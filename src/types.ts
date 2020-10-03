// import { ChatItemType } from "./util/Constants";
// import { Contact } from "./structures/Contact";
// import { Handle } from "./structures/Handle";
// import { IMService } from "./Constants";

import { Contact } from "./structures/Contact";
import { Handle } from "./structures/Handle";

// export declare interface ChatPropertyListRepresentation {
//   readReceipts: boolean;
//   ignoreAlerts: boolean;
// }

// export declare interface ChatConfigurationRepresentation extends ChatPropertyListRepresentation {
//   id: string;
// }

// export declare interface ChatRepresentation extends ChatConfigurationRepresentation {
//     joinState: number;
//     roomName?: string;
//     displayName?: string;
//     id: string;
//     participants: string[];
//     lastAddressedHandleID?: string;
//     unreadMessageCount?: number;
//     messageFailureCount?: number;
//     service: IMService;
//     lastMessage?: string;
//     lastMessageTime: number;
//     style: number;
// }

// export declare interface ChatIDRepresentation {
//     chat: string;
// }

// export declare interface BulkChatRepresentation {
//     chats: ChatRepresentation[];
// }

// export declare interface BulkChatItemRepresentation {
//     items: AnyChatItemModel[];
// }

// export declare interface BulkMessageIDRepresentation {
//     messages: string[];
// }

// export declare interface BulkHandleIDRepresentation {
//     handles: string[];
// }

// export declare interface HandleRepresentation {
//     id: string;
//     isBusiness: boolean;
// }

// export declare interface ContactRepresentation {
//     id: string;
//     firstName?: string;
//     middleName?: string;
//     lastName?: string;
//     fullName?: string;
//     nickname?: string;
//     countryCode?: string;
//     hasPicture: boolean;
//     handles: HandleRepresentation[];
// }

// export declare interface ContactIDRepresentation {
//     id: string;
// }

// export declare interface BulkContactRepresentation {
//     contacts: ContactRepresentation[];
//     strangers: HandleRepresentation[];
// }

// export declare interface ChatItemRepresentation {
//     id: string;
//     chatID: string;
//     fromMe: boolean;
//     time: number;
// }

// export declare interface AssociatedChatItemRepresentation extends ChatItemRepresentation {
//     associatedID: string;
// }

// export type DateTranscriptChatItemRepresentation = ChatItemRepresentation;

// export declare interface SenderTranscriptChatItemRepresentation extends ChatItemRepresentation {
//     handleID: string;
// }

// export declare interface ParticipantChangeTranscriptChatItemRepresentation extends ChatItemRepresentation {
//     initiatorID?: string;
//     targetID?: string;
//     changeType: number;
// }

// export declare interface AttachmentRepresentation {
//     mime?: string;
//     filename?: string;
//     id: string;
//     uti?: string;
// }

// export declare interface AttachmentChatItemRepresentation extends ChatItemAcknowledgableRepresentation {
//     transferID: string;
//     metadata?: AttachmentRepresentation;
// }

// export declare interface StatusChatItemRepresentation extends ChatItemRepresentation {
//     statusType: number;
//     itemID: string;
//     flags: number;
//     timeDelivered: number;
//     timeRead: number;
//     timePlayed: number;
// }

// export declare interface GroupActionTranscriptChatItemRepresentation extends ChatItemRepresentation {
//     actionType: number;
//     sender: string;
// }

// export declare interface PluginChatItemRepresentation extends ChatItemAcknowledgableRepresentation {
//     payload: string;
//     bundleID: string;
//     attachments: AttachmentRepresentation[];
// }

// export enum TextPartType {
//   link = "link",
//   calendar = "calendar",
//   text = "text"
// }

// export declare interface TextPart {
//   type: TextPartType;
//   string: string;
//   data?: any;
// }

// export declare interface TextChatItemRepresentation extends ChatItemAcknowledgableRepresentation {
//     text: string;
//     parts: TextPart[];
// }

// export declare interface ChatItemAcknowledgableRepresentation extends ChatItemRepresentation {
//     acknowledgments?: AcknowledgmentChatItemRepresentation[];
// }

// export declare interface AcknowledgmentChatItemRepresentation extends AssociatedChatItemRepresentation {
//     sender?: string;
//     acknowledgmentType: number;
// }

// export declare interface TapbackRepresentation {
//     chatID: string;
//     associatedMessageType: number;
//     associatedMessageID: string;
//     handle: string;
// }

// export declare interface AssociatedMessageItemRepresentation extends ChatItemRepresentation {
//     associatedID: string;
//     associatedType: number;
// }

// export declare interface TypingChatItemRepresentation extends ChatItemRepresentation {
//   sender: string;
// }

// export declare interface MessageRepresentation extends ChatItemRepresentation {
//     sender?: string;
//     subject?: string;
//     service: IMService;
//     timeDelivered: number;
//     timePlayed: number;
//     timeRead: number;
//     messageSubject?: string;
//     isSOS: boolean;
//     isTypingMessage: boolean;
//     isCancelTypingMessage: boolean;
//     isDelivered: boolean;
//     isAudioMessage: boolean;
//     description?: string;
//     flags: number;
//     items: AnyChatItemModel[]
// }

// export enum ResourceMode {
//   SocialUI = "SocialUI",
//   ChatKit = "ChatKit",
//   Local = "Local"
// }

// export declare interface StickerRepresentation {
//   stickerID: string;
//   stickerPackID: string;
//   stickerHash: string;
//   stickerRecipe?: string;
//   bid?: string;
//   transcodedStickerHash?: string;
//   layoutIntent: number;
//   associatedLayoutIntent: number;
//   parentPreviewWidth: number;
//   xScalar: number;
//   yScalar: number;
//   scale: number;
//   rotation: number;
//   transcodedScale?: number;
// }

// export declare interface StickerChatItemRepresentation extends AssociatedChatItemRepresentation {
//   attachment?: AttachmentRepresentation;
//   sticker?: StickerRepresentation;
// }

// export declare interface StubChatItemRepresentation extends ChatItemRepresentation {
//     className: string;
// }

// export declare interface GroupTitleChangeItemRepresentation extends ChatItemRepresentation {
//     title: string;
//     sender?: string;
// }

// export declare type ChatItems = {
//     [ChatItemType.date]: DateTranscriptChatItemRepresentation,
//     [ChatItemType.sender]: SenderTranscriptChatItemRepresentation,
//     [ChatItemType.participantChange]: ParticipantChangeTranscriptChatItemRepresentation,
//     [ChatItemType.attachment]: AttachmentChatItemRepresentation,
//     [ChatItemType.status]: StatusChatItemRepresentation,
//     [ChatItemType.groupAction]: GroupActionTranscriptChatItemRepresentation,
//     [ChatItemType.plugin]: PluginChatItemRepresentation,
//     [ChatItemType.text]: TextChatItemRepresentation,
//     [ChatItemType.acknowledgment]: AcknowledgmentChatItemRepresentation,
//     [ChatItemType.associated]: AssociatedMessageItemRepresentation,
//     [ChatItemType.message]: MessageRepresentation,
//     [ChatItemType.phantom]: StubChatItemRepresentation,
//     [ChatItemType.groupTitle]: GroupTitleChangeItemRepresentation,
//     [ChatItemType.typing]: TypingChatItemRepresentation,
//     [ChatItemType.sticker]: StickerChatItemRepresentation
// }

// export declare interface ChatItem<T extends ChatItemType> {
//     type: T;
//     payload: ChatItems[T];
// }

// export type AnyChatItemModel = ChatItem<ChatItemType.sticker> | ChatItem<ChatItemType.typing> | ChatItem<ChatItemType.date> | ChatItem<ChatItemType.sender> | ChatItem<ChatItemType.participantChange> | ChatItem<ChatItemType.attachment> | ChatItem<ChatItemType.status> | ChatItem<ChatItemType.groupAction> | ChatItem<ChatItemType.plugin> | ChatItem<ChatItemType.text> | ChatItem<ChatItemType.acknowledgment> | ChatItem<ChatItemType.associated> | ChatItem<ChatItemType.message> | ChatItem<ChatItemType.phantom> | ChatItem<ChatItemType.groupTitle>

export declare type FuzzyHandle = string | Handle | Contact
