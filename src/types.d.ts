import { ChatItemType } from "./util/Constants";
import { Contact } from "./structures/Contact";
import { Handle } from "./structures/Handle";

export declare interface ChatRepresentation {
    guid: string;
    joinState: number;
    roomName?: string;
    displayName?: string;
    groupID?: string;
    participants: string[];
    lastAddressedHandleID?: string;
    unreadMessageCount?: number;
    messageFailureCount?: number;
    service?: string;
    lastMessage?: string;
    lastMessageTime: number;
    style: number;
}

export declare interface SearchResult {
    sender: string;
    isFromMe: boolean;
    time: number;
    acknowledgmentType: number;
    chatGUID: string;
    text: string;
    guid: string;
}

export declare interface ChatIDRepresentation {
    chat: string;
}

export declare interface BulkChatRepresentation {
    chats: ChatRepresentation[];
}

export declare interface BulkChatItemRepresentation {
    items: AnyChatItemModel[];
}

export declare interface BulkMessageIDRepresentation {
    messages: string[];
}

export declare interface BulkHandleIDRepresentation {
    handles: string[];
}

export declare interface HandleRepresentation {
    id: string;
    isBusiness: boolean;
}

export declare interface ContactRepresentation {
    id: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fullName?: string;
    nickname?: string;
    countryCode?: string;
    hasPicture: boolean;
    handles: HandleRepresentation[];
}

export declare interface ContactIDRepresentation {
    id: string;
}

export declare interface BulkContactRepresentation {
    contacts: ContactRepresentation[];
    strangers: HandleRepresentation[];
}

export declare interface ChatItemRepresentation {
    guid: string;
    chatGUID: string;
    fromMe: boolean;
    time: number;
}

export type DateTranscriptChatItemRepresentation = ChatItemRepresentation;

export declare interface SenderTranscriptChatItemRepresentation extends ChatItemRepresentation {
    handleID: string;
}

export declare interface ParticipantChangeTranscriptChatItemRepresentation extends ChatItemRepresentation {
    initiatorID?: string;
    targetID?: string;
    changeType: number;
}

export declare interface AttachmentRepresentation {
    mime?: string;
    filename?: string;
    guid: string;
    uti?: string;
}

export declare interface AttachmentChatItemRepresentation extends ChatItemRepresentation {
    transferGUID: string;
    metadata?: AttachmentRepresentation;
}

export declare interface StatusChatItemRepresentation extends ChatItemRepresentation {
    statusType: number;
    itemGUID: string;
}

export declare interface GroupActionTranscriptChatItemRepresentation extends ChatItemRepresentation {
    actionType: number;
    sender: string;
}

export declare interface PluginChatItemRepresentation extends ChatItemRepresentation {
    payload: string;
    bundleID: string;
    attachments: AttachmentRepresentation[];
}

export declare interface TextChatItemRepresentation extends ChatItemRepresentation {
    text: string;
    html?: string;
}

export declare interface AcknowledgmentChatItemRepresentation extends ChatItemRepresentation {
    sender?: string;
    acknowledgmentType: number;
}

export declare interface TapbackRepresentation {
    chatGUID: string;
    associatedMessageType: number;
    associatedMessageGUID: string;
    handle: string;
}

export declare interface AssociatedMessageItemRepresentation extends ChatItemRepresentation {
    associatedGUID: string;
    associatedType: number;
}

export declare interface TypingChatItemRepresentation extends ChatItemRepresentation {
  sender: string;
}

export declare interface MessageRepresentation extends ChatItemRepresentation {
    sender?: string;
    subject?: string;
    timeDelivered: number;
    timePlayed: number;
    timeRead: number;
    messageSubject?: string;
    isSOS: boolean;
    isTypingMessage: boolean;
    isCancelTypingMessage: boolean;
    isDelivered: boolean;
    isAudioMessage: boolean;
    description?: string;
    flags: number;
    items: AnyChatItemModel[]
}

export declare interface StubChatItemRepresentation extends ChatItemRepresentation {
    className: string;
}

export declare interface GroupTitleChangeItemRepresentation extends ChatItemRepresentation {
    title: string;
    sender?: string;
}

export declare type ChatItems = {
    [ChatItemType.date]: DateTranscriptChatItemRepresentation,
    [ChatItemType.sender]: SenderTranscriptChatItemRepresentation,
    [ChatItemType.participantChange]: ParticipantChangeTranscriptChatItemRepresentation,
    [ChatItemType.attachment]: AttachmentChatItemRepresentation,
    [ChatItemType.status]: StatusChatItemRepresentation,
    [ChatItemType.groupAction]: GroupActionTranscriptChatItemRepresentation,
    [ChatItemType.plugin]: PluginChatItemRepresentation,
    [ChatItemType.text]: TextChatItemRepresentation,
    [ChatItemType.acknowledgment]: AcknowledgmentChatItemRepresentation,
    [ChatItemType.associated]: AssociatedMessageItemRepresentation,
    [ChatItemType.message]: MessageRepresentation,
    [ChatItemType.phantom]: StubChatItemRepresentation,
    [ChatItemType.groupTitle]: GroupTitleChangeItemRepresentation,
    [ChatItemType.typing]: TypingChatItemRepresentation
}

export declare interface ChatItem<T extends ChatItemType> {
    type: T;
    payload: ChatItems[T];
}

export type AnyChatItemModel = ChatItem<ChatItemType.typing> | ChatItem<ChatItemType.date> | ChatItem<ChatItemType.sender> | ChatItem<ChatItemType.participantChange> | ChatItem<ChatItemType.attachment> | ChatItem<ChatItemType.status> | ChatItem<ChatItemType.groupAction> | ChatItem<ChatItemType.plugin> | ChatItem<ChatItemType.text> | ChatItem<ChatItemType.acknowledgment> | ChatItem<ChatItemType.associated> | ChatItem<ChatItemType.message> | ChatItem<ChatItemType.phantom> | ChatItem<ChatItemType.groupTitle>

export declare type FuzzyHandle = string | Handle | Contact
