import util from "util";
import { Client, MessageReceived, MessageUpdated, PluginChatItem } from "../src";

const client = new Client();

// function bindEcho(...events: IMCoreEvent[]) {
//     events.forEach(event => {
//         client.on(event, arg => {
//             console.log(`${event}${arg ? ` ${arg}` : ''}`);
//         });
//     });
// }

// bindEcho(Ready, MessageReceived, MessageUpdated, MessageRemoved, ChatCreated, ChatUpdated, ChatDisplayNameUpdated, ChatJoinStateUpdated, ChatRemoved, ContactCreated, ContactUpdated, ContactRemoved, BlockListUpdated)

interface MessageExtensionsMessage {
    ldtext?: string;
    URL?: string;
    dataFilePath?: {
        'NS.data'?: Buffer
    },
    AccessibilityLabel?: string,
    sessionIdentifier?: {
        'NS.uuidbytes'?: Buffer
    },
    liveLayoutInfo?: {
        'NS.data'?: Buffer
    },
    layoutClass?: string;
    userInfo?: {
        'image-subtitle'?: string;
        'image-title'?: string;
        subcaption?: string;
        'tertiary-subcaption'?: string;
        'secondary-subcaption'?: string;
        caption?: string;
        'tap-action'?: number;
    }
}

client.on(MessageReceived, message => {
    message.items.forEach(item => {
        if (item instanceof PluginChatItem) {
            const plist: MessageExtensionsMessage = item.plist;
            // console.log(util.inspect(, true, 4, true))

            if (item.bundleID !== "com.apple.messages.MSMessageExtensionBalloonPlugin:0000000000:com.apple.icloud.apps.messages.business.extension") {
                return
            }

            console.log(plist.dataFilePath["NS.data"].toString("base64"))
        }
    })
});

client.on(MessageUpdated, message => {
    message.items.forEach(item => {
        if (item instanceof PluginChatItem) {
            console.log(util.inspect(item.plist, true, undefined, true))
        }
    })
});

client.connect();