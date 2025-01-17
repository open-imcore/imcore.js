import { Message } from "../structures/Message";
import { Contact } from "../structures/Contact";
import { Chat } from "../structures/Chat";
import { Handle } from "../structures/Handle";

export enum IMCoreEvent {
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

export const MessageReceived = IMCoreEvent.messageReceived;
export const HistoryLoaded = IMCoreEvent.historyLoaded;
export const MessageUpdated = IMCoreEvent.messageUpdated;
export const MessageRemoved = IMCoreEvent.messageRemoved;
export const ContactCreated = IMCoreEvent.contactCreated;
export const ContactUpdated = IMCoreEvent.contactUpdated;
export const ContactRemoved = IMCoreEvent.contactRemoved;
export const ChatCreated = IMCoreEvent.chatCreated;
export const ChatUpdated = IMCoreEvent.chatUpdated;
export const ChatDisplayNameUpdated = IMCoreEvent.chatDisplayNameUpdated;
export const ChatJoinStateUpdated = IMCoreEvent.chatJoinStateUpdated;
export const ChatUnreadCountUpdated = IMCoreEvent.chatUnreadCountUpdated;
export const ChatRemoved = IMCoreEvent.chatRemoved;
export const ChatParticipantsChanged = IMCoreEvent.chatParticipantsChanged;
export const ChatconfigurationChanged = IMCoreEvent.chatConfigurationChanged;
export const BlockListUpdated = IMCoreEvent.blockListUpdated;
export const Ready = IMCoreEvent.ready;
