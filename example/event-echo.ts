import { Client, MessageReceived, Ready, MessageUpdated, MessageRemoved, ChatCreated, ChatUpdated, ChatRemoved, ContactCreated, ContactUpdated, ContactRemoved, BlockListUpdated, ChatDisplayNameUpdated } from "../src";
import { IMCoreEvent, ChatJoinStateUpdated } from "../src/client/client-events";

const client = new Client();

function bindEcho(...events: IMCoreEvent[]) {
    events.forEach(event => {
        client.on(event, arg => {
            console.log(`${event}${arg ? ` ${arg}` : ''}`);
        });
    });
}

bindEcho(Ready, MessageReceived, MessageUpdated, MessageRemoved, ChatCreated, ChatUpdated, ChatDisplayNameUpdated, ChatJoinStateUpdated, ChatRemoved, ContactCreated, ContactUpdated, ContactRemoved, BlockListUpdated)

client.connect();