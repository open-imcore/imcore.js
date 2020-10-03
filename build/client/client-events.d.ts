import { Message } from "../structures/Message";
import { Contact } from "../structures/Contact";
import { Chat } from "../structures/Chat";
import { Handle } from "../structures/Handle";
export declare enum IMCoreEvent {
    messageReceived = "messageReceived",
    historyLoaded = "historyLoaded",
    messageUpdated = "messageUpdated",
    messageRemoved = "messageRemoved",
    contactCreated = "contactCreated",
    contactUpdated = "contactUpdated",
    contactRemoved = "contactRemoved",
    chatCreated = "chatCreated",
    chatUpdated = "chatUpdated",
    chatDisplayNameUpdated = "chatDisplayNameUpdated",
    chatJoinStateUpdated = "chatJoinStateUpdated",
    chatRemoved = "chatRemoved",
    chatParticipantsChanged = "chatParticipantsChanged",
    chatUnreadCountUpdated = "chatUnreadCountUpdated",
    chatConfigurationChanged = "chatConfigurationChanged",
    blockListUpdated = "blockListUpdated",
    ready = "ready"
}
export interface IMCoreEventMap {
    [IMCoreEvent.messageReceived]: Message;
    [IMCoreEvent.messageUpdated]: Message;
    [IMCoreEvent.historyLoaded]: Message;
    [IMCoreEvent.messageRemoved]: Message;
    [IMCoreEvent.contactCreated]: Contact;
    [IMCoreEvent.contactUpdated]: Contact;
    [IMCoreEvent.contactRemoved]: Contact;
    [IMCoreEvent.chatCreated]: Chat;
    [IMCoreEvent.chatUpdated]: Chat;
    [IMCoreEvent.chatDisplayNameUpdated]: Chat;
    [IMCoreEvent.chatJoinStateUpdated]: Chat;
    [IMCoreEvent.chatRemoved]: Chat;
    [IMCoreEvent.chatParticipantsChanged]: Chat;
    [IMCoreEvent.chatUnreadCountUpdated]: Chat;
    [IMCoreEvent.chatConfigurationChanged]: Chat;
    [IMCoreEvent.blockListUpdated]: Handle[];
    [IMCoreEvent.ready]: never;
}
export declare const MessageReceived = IMCoreEvent.messageReceived;
export declare const HistoryLoaded = IMCoreEvent.historyLoaded;
export declare const MessageUpdated = IMCoreEvent.messageUpdated;
export declare const MessageRemoved = IMCoreEvent.messageRemoved;
export declare const ContactCreated = IMCoreEvent.contactCreated;
export declare const ContactUpdated = IMCoreEvent.contactUpdated;
export declare const ContactRemoved = IMCoreEvent.contactRemoved;
export declare const ChatCreated = IMCoreEvent.chatCreated;
export declare const ChatUpdated = IMCoreEvent.chatUpdated;
export declare const ChatDisplayNameUpdated = IMCoreEvent.chatDisplayNameUpdated;
export declare const ChatJoinStateUpdated = IMCoreEvent.chatJoinStateUpdated;
export declare const ChatUnreadCountUpdated = IMCoreEvent.chatUnreadCountUpdated;
export declare const ChatRemoved = IMCoreEvent.chatRemoved;
export declare const ChatParticipantsChanged = IMCoreEvent.chatParticipantsChanged;
export declare const ChatconfigurationChanged = IMCoreEvent.chatConfigurationChanged;
export declare const BlockListUpdated = IMCoreEvent.blockListUpdated;
export declare const Ready = IMCoreEvent.ready;
