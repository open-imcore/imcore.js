import { ChatDisplayNameUpdated, ChatJoinStateUpdated, ChatParticipantsChanged, Client, MessageReceived, MessageUpdated, Ready } from "../src";

const client = new Client();

var running = false
client.on(Ready, () => {
    if (!running) {
        (async function() {
            const inquirer = await import("inquirer");
            const fs = await import("fs-extra");
        
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

                        const data = await fs.readFile(filePath);

                        const attachment = await client.upload(data);

                        console.log(attachment);
                        
                        break;
                    case "send-message":
                        break;
                }
            }
        })()
        running = true
    }
});

client.on(MessageUpdated, message => {
    console.log(`Message Updated ${message.guid}`)
});

client.on(MessageReceived, message => {
    console.log(`Message Received ${message.guid}`)
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
