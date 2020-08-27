import {
  ChatIDRepresentation,
  ChatRepresentation,
  ContactRepresentation,
  ContactIDRepresentation,
  BulkHandleIDRepresentation,
  BulkMessageIDRepresentation,
  BulkChatItemRepresentation,
  BulkContactRepresentation,
  StatusChatItemRepresentation, ChatConfigurationRepresentation,
} from '../../types';

export enum EventType {
    bootstrap = "bootstrap",
    itemsReceived = "itemsReceived",
    itemsUpdated = "itemsUpdated",
    itemStatusChanged = "itemStatusChanged",
    itemsRemoved = "itemsRemoved",
    participantsChanged = "participantsChanged",
    conversationRemoved = "conversationRemoved",
    conversationCreated = "conversationCreated",
    conversationChanged = "conversationChanged",
    conversationDisplayNameChanged = "conversationDisplayNameChanged",
    conversationJoinStateChanged = "conversationJoinStateChanged",
    conversationUnreadCountChanged = "conversationUnreadCountChanged",
    conversationPropertiesChanged = "conversationPropertiesChanged",
    contactCreated = "contactCreated",
    contactRemoved = "contactRemoved",
    contactUpdated = "contactUpdated",
    blockListUpdated = "blockListUpdated"
}

export interface BootstrapEvent {
    chats: ChatRepresentation[];
    contacts: BulkContactRepresentation;
    messages?: BulkChatItemRepresentation;
}

export type ItemsReceivedEvent = BulkChatItemRepresentation;

export type ItemsUpdatedEvent = BulkChatItemRepresentation;

export type ItemStatusChangedEvent = StatusChatItemRepresentation;

export type ItemsRemovedEvent = BulkMessageIDRepresentation;

export interface ParticipantsChangedEvent extends BulkHandleIDRepresentation {
    chat: string;
}

export type ConversationRemovedEvent = ChatIDRepresentation;

export type ConversationChangedEvent = ChatRepresentation;

export type ConversationDisplayNameChangedEvent = ChatRepresentation;

export type ConversationJoinStateChangedEvent = ChatRepresentation;

export type ConversationCreatedEvent = ChatRepresentation;

export type ConversationUnreadCountChangedEvent = ChatRepresentation;

export type ConversationPropertiesChangedEvent = ChatConfigurationRepresentation;

export type ContactCreatedEvent = ContactRepresentation;

export type ContactUpdatedEvent = ContactRepresentation;

export type ContactRemovedEvent = ContactIDRepresentation;

export type BlockListUpdatedEvent = BulkHandleIDRepresentation;

export type Events = {
    [EventType.bootstrap]: BootstrapEvent;
    [EventType.itemsReceived]: ItemsReceivedEvent;
    [EventType.itemsUpdated]: ItemsUpdatedEvent;
    [EventType.itemStatusChanged]: ItemStatusChangedEvent;
    [EventType.itemsRemoved]: ItemsRemovedEvent;
    [EventType.participantsChanged]: ParticipantsChangedEvent;
    [EventType.conversationRemoved]: ConversationRemovedEvent;
    [EventType.conversationChanged]: ConversationChangedEvent;
    [EventType.conversationDisplayNameChanged]: ConversationDisplayNameChangedEvent;
    [EventType.conversationJoinStateChanged]: ConversationJoinStateChangedEvent;
    [EventType.conversationUnreadCountChanged]: ConversationUnreadCountChangedEvent;
    [EventType.conversationPropertiesChanged]: ConversationPropertiesChangedEvent;
    [EventType.conversationCreated]: ConversationCreatedEvent;
    [EventType.contactCreated]: ContactCreatedEvent;
    [EventType.contactRemoved]: ContactRemovedEvent;
    [EventType.contactUpdated]: ContactUpdatedEvent;
    [EventType.blockListUpdated]: BlockListUpdatedEvent;
}
