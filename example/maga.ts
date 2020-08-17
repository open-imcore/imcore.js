import { Client, MessageReceived, TextChatItem } from "../src";
import { TapbackStyle } from "../src/structures/ChatItem";

const client = new Client()

client.on(MessageReceived, async message => {
    if (message.fromMe) {
        return;
    }

    const magaItem = message.items.find(item => item instanceof TextChatItem && item.text.toLowerCase().includes("maga")) as TextChatItem | undefined;

    if (magaItem) {
        await Promise.all([message.chat.sendText('MAGA'), magaItem.sendAssociatedMessage(TapbackStyle.heart)])
    }
});

client.connect();