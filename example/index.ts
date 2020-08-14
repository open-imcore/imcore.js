import { ChatDisplayNameUpdated, ChatJoinStateUpdated, ChatParticipantsChanged, Client, MessageReceived, MessageUpdated, Ready, Chat, PluginChatItem } from "../src";
import inquirer = require("inquirer");
import fs = require("fs-extra");

const client = new Client();

var running = true
client.on(Ready, () => {
    if (!running) {
        (async () => {
            while (true) {
                const { instruction } = await inquirer.prompt({
                    type: "list",
                    name: "instruction",
                    message: "What do you want to do?",
                    choices: [
                        {
                            name: "Send Message",
                            value: "send-message"
                        },
                        {
                            name: "Upload Attachment",
                            value: "upload"
                        }
                    ]
                });

                switch (instruction) {
                    case "upload":
                        const { path: filePath } = await inquirer.prompt({
                            type: "input",
                            name: "path",
                            message: "File Path"
                        });

                        if (!await fs.pathExists(filePath) || !await fs.stat(filePath).then(stat => stat.isFile())) {
                            console.warn('Not a file')
                            continue
                        }

                        try {
                            const data = await fs.readFile(filePath);

                            console.log(await client.upload(data));
                        } catch (e) {
                            console.log(e)
                        }
                        
                        break;
                    case "send-message":
                        const { chat, text }: { chat: Chat, text: string } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "chat",
                                message: "What chat are you sending a message to?",
                                choices: client.chats.map(chat => ({
                                    name: chat.prettyName,
                                    value: chat
                                }))
                            }, {
                                type: "input",
                                name: "text",
                                message: "What message are you sending?"
                            }
                        ]);

                        const messages = await chat.sendText(text);

                        console.log(`Sent message wiht GUID ${messages.map(m => m.guid).join(', ')}`)
                        
                        break;
                }
            }
        })()
        running = true
    }
});

client.on('debug', ({ level, messages }) => console[level](...messages));

client.on(MessageUpdated, message => {
    console.log(`Message Updated ${message.guid}`)

    message.items.forEach(item => {
        if (item instanceof PluginChatItem) {
            console.log(JSON.stringify(item.plist))
        }
    })
});

client.on(MessageReceived, message => {
    console.log(`Message Received ${message.guid}`)

    message.items.forEach(item => {
        if (item instanceof PluginChatItem) {
            console.log(JSON.stringify(item.plist))
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
});

client.connect();
