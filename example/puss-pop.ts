import { Client, MessageReceived, TextChatItem } from "../src";
import { TapbackStyle } from "../src/structures/ChatItem";

const client = new Client();

client.on(MessageReceived, async message => {
    const item = message.items.find(item => item instanceof TextChatItem && item.text.toLowerCase().startsWith('did you just call me puss pop')) as TextChatItem | undefined;

    if (item) {
        await Promise.all([message.chat.sendText('Dam right I did puss pop').then(message => {
            const item = message[0].items.find(item => item instanceof TextChatItem) as TextChatItem | undefined;

            if (item) {
                return item.sendAssociatedMessage(TapbackStyle.thumbsUp);
            }

            return Promise.resolve()
        }), item.sendAssociatedMessage(TapbackStyle.thumbsUp)]);
    }
});

client.connect();