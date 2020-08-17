import axios from "axios";
import sharp = require("sharp");
import fs = require("fs-extra");
import { Client, MessageReceived, TextChatItem, AttachmentChatItem, Message, AcknowledgmentChatItem } from "../src";
import { TapbackStyle } from "../src/structures/ChatItem";

const client = new Client();

const legalMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'image/gif'
];

function distort(message: Message) {
    const items = message.items;
    const attachmentItems = items.filter(item => item instanceof AttachmentChatItem && legalMimes.includes(item.metadata?.mime)) as AttachmentChatItem[];

    if (attachmentItems.length === 0) return;

    attachmentItems.map(item => ({ url: item.url, guid: item.transferGUID, mime: item.metadata!.mime })).map(({ url, guid, mime }) => {
        const path = `${guid}.${mime.split('/')[1]}`;
        const writer = fs.createWriteStream(path);

        const resolution = new Promise((resolve, reject) => {
            var error = null;

            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
            });
        })

        axios({
            method: "get",
            url: url,
            responseType: "stream"
        }).then(async (response) => {
            response.data.pipe(writer);

            const roll = (min: number, max: number) => Math.random() * (max - min) + min
            
            try {
                await resolution;
            } catch (e) {
                console.log(`Failed to download attachment at url ${url}`);
                return;
            }

            await sharp(path)
                .sharpen(roll(0.01, 1), roll(3, 4), roll(3, 4))
                .gamma(3)
                .modulate({ brightness: roll(25, 40), saturation: roll(25, 40), hue: +roll(0, 360).toFixed(0) })
                .blur(roll(0.3, 3))
                .flip(roll(0,30) < 5)
                .flop(roll(0,30) < 5)
                .negate(roll(0,30) < 5)
                .toFile(`mutated.${path}`)

            const file = await fs.readFile(`mutated.${path}`)

            const attachment = await client.upload(file);

            await message.chat.sendMessage({
                parts: [
                    {
                        type: "attachment",
                        details: attachment.guid
                    }
                ]
            })

            await Promise.all([fs.unlink(`mutated.${path}`), fs.unlink(path)])
        });
    });
}

client.on(MessageReceived, async message => {
    const acknowledgment = message.items.find(item => item instanceof AcknowledgmentChatItem) as AcknowledgmentChatItem | undefined;

    if (acknowledgment && acknowledgment.acknowledgmentType === TapbackStyle.question) {
        const associated = await client.message(acknowledgment.associatedMessageGUID);

        distort(associated);
    }
});

client.on(MessageReceived, message => {
    const items = message.items;
    const attachmentItems = items.filter(item => item instanceof AttachmentChatItem && legalMimes.includes(item.metadata?.mime)) as AttachmentChatItem[];

    const shouldDistort = message.items.find(item => item instanceof TextChatItem && item.text.toLowerCase().includes('distort')) && attachmentItems.length > 0;

    if (!shouldDistort) return;

    distort(message);
});

client.connect();