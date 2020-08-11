import { Client, Ready, MessageReceived, ChatParticipantsChanged, ChatJoinStateUpdated, ChatDisplayNameUpdated, TextChatItem, MessageUpdated } from "../src";

const client = new Client();

client.on(Ready, () => {
    console.log("Client is ready!");
});

client.on(MessageUpdated, message => {
    console.log(`Message Updated ${message.guid}`)
});

client.on(MessageReceived, message => {
    const sender = message.sender;
    if (!sender) return;
    
    const items = message.items;
    const textItems = items.filter(item => item instanceof TextChatItem) as TextChatItem[];
    const COMMAND_PREFIX = '!'

    textItems.forEach(async item => {
        if (!item.fromMe) return;
        if (!item.text.startsWith(COMMAND_PREFIX)) return;
        const [ command, ...args ] = item.text.substring(COMMAND_PREFIX.length).split(' ');

        switch (command) {
            case "tapback":
                const [ rawTapback ] = args;
                const tapback = +rawTapback;
                if (![2000, 2001, 2002, 2003, 2004, 2005, 3000, 3001, 3002, 3003, 3004, 3005].includes(tapback)) return;
                item.tapback(tapback);
                break;
            case "echo":
                message.chat.sendText(args.join(' '))
                break;
            case "echo-repeat":
                const [ rawRepeat, ...textParts ] = args;
                const repeat = +rawRepeat;
                if (isNaN(repeat)) { return }

                for (let i = 0; i < repeat; i++) {
                    await item.chat.sendText(textParts.join(' '));
                }
        }
    });
});

client.on(ChatParticipantsChanged, chat => {
    console.log(`Chat ${chat.guid} participants changed to ${chat.participants.map(p => p.id)}`)
});

client.on(ChatJoinStateUpdated, async chat => {
    console.log(`Chat ${chat.guid} join state changed to ${chat.joinState}`)
});

client.on(ChatDisplayNameUpdated, chat => {
    console.log(`Chat ${chat.guid} display name changed to ${chat.displayName}`)
})

client.connect();