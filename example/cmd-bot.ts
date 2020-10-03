import { Client, Message, MessageReceived } from '../src';

const client = new Client();

const CMD_PREFIX = "!";

const commands: Record<string, (message: Message, args: string[]) => any> = {
  chats(message) {
    const chats = message.client.chats.allValues;
    
    const chatString = chats.map(chat => `Chat GroupID: ${chat.chatID}\nChat Participants: ${chat.participantIDs.join(',')}`).join('\n--------------\n');

    message.chat.sendText(chatString);
  },
  async spam(message, [ chatGroupID, interval, ...text ]) {
    const chat = await message.client.chat(chatGroupID);
    if (!chat) {
      await message.chat.sendText("Unknown chat.");
      return;
    }

    const repeat = +interval || 100;

    for (let i = 0; i < repeat; i++) {
      await chat.sendText(text.join(" "));
    }

    await message.chat.sendText("Done.");
  }
}

client.on(MessageReceived, message => {
  if (!message.fromMe) return;
  const [ textItem ] = message.textItems;
  if (!textItem || !textItem.text.startsWith(CMD_PREFIX)) return;

  const [ command, ...args ] = textItem.text.substring(CMD_PREFIX.length).split(" ");

  if (!commands[command]) {
    message.chat.sendText("Girl what the fuck are you talking about");
    return;
  }

  commands[command](message, args);
});

client.connect();
