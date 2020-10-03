import { Client } from "../src";
import { ChatParticipantsChanged } from "../src/client/client-events";

const client = new Client();

const chatID = 'DD0712E5-D0CD-4CA0-B2F5-7A3700BBA5CA';
const handleID = '+16475469749';

client.on(ChatParticipantsChanged, chat => {
    if (chat.id !== chatID) return;
    if (!chat.participantIDs.includes(handleID)) {
        chat.addParticipants([handleID]);
        console.log('shimmy shimmy ya')
    }
})

client.connect();