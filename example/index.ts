import { Client, MessageReceived, PluginChatItem } from "../src";

const client = new Client();

client.on(MessageReceived, message => {
    console.log(message);

    message.items.forEach(item => {
        if (item instanceof PluginChatItem) {
            console.log(item.payload)
        }
    })
});

client.connect()