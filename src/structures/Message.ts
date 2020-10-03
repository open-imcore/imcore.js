import { Handle } from "./Handle";
import { AnyChatItem, Util } from "../Util";
import { Base } from "./Base";
import { AcknowledgmentChatItem } from "./AcknowledgmentChatItem";
import { AttachmentChatItem } from "./AttachmentChatItem";
import { TextChatItem } from "./TextChatItem";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
import { StatusChatItem } from './StatusChatItem';
import { AssociatedChatItem } from './AssociatedChatItem';
import { IMService } from "../Constants";
import { AttachmentRepresentation, MessageRepresentation, AcknowledgmentType } from "imcore-ajax-core";

export class Message extends Base<MessageRepresentation> implements Omit<MessageRepresentation, "sender" | "subject" | "items"> {

    private _sender: string;
    private _subject: string;

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
    id: string;
    chatID: string;
    fromMe: boolean;
    time: number;
    items: AnyChatItem[];
    service: IMService;
    fileTransferIDs: string[];

    toString(): string {
        return `Message[id: ${this.id}; time: ${this.time}; timeDelivered: ${this.timeDelivered}; timePlayed: ${this.timePlayed}; isTypingMessage: ${this.isTypingMessage}; isCancelTypingMessage: ${this.isCancelTypingMessage}; isDelivered: ${this.isDelivered}; isAudioMessage: ${this.isAudioMessage}; flags: ${this.flags}; fromMe: ${this.fromMe}; items: [${this.items.join(', ')}];]`
    }

    public get isTranscriptLike(): boolean {
      return this.items.every(item => item.isTranscriptLike);
    }

    get attachments(): AttachmentRepresentation[] {
        return this.attachmentItems.map(item => item.metadata).filter(metadata => !!metadata);
    }

    get textItems(): TextChatItem[] {
        return this.items.filter(item => item instanceof TextChatItem) as TextChatItem[];
    }

    get attachmentItems(): AttachmentChatItem[] {
        return this.items.filter(item => item instanceof AttachmentChatItem) as AttachmentChatItem[];
    }

    get acknowledgmentItem(): AcknowledgmentChatItem | null {
        return (this.items.find(item => item instanceof AcknowledgmentChatItem) as AcknowledgmentChatItem | undefined) || null;
    }

    get acknowledgmentType(): AcknowledgmentType | null {
        return this.acknowledgmentItem?.acknowledgmentType || null;
    }

    get acknowledgedMessage(): Message | null {
        const { acknowledgedMessageID } = this;
        if (!acknowledgedMessageID) return null;
        return this.client.messages.resolve(acknowledgedMessageID) || null;
    }

    get acknowledgedMessageItem(): AcknowledgableChatItem | null {
        const { acknowledgedMessage, acknowledgedMessagePart } = this;
        if (!acknowledgedMessage || typeof acknowledgedMessagePart !== "number") return null;
        const item = acknowledgedMessage.items[acknowledgedMessagePart];
        if (!item) return null;
        if (!(item instanceof AcknowledgableChatItem)) {
            this.client.emit('debug', {
                level: 'error',
                messages: [
                    `Got an unknown acknowledged item. Error[acknowledgementMessage: ${this}; acknowledgedMessage: ${acknowledgedMessage}; part: ${acknowledgedMessagePart};]`
                ]
            });
            return null;
        }
        return item;
    }

    get acknowledgedMessagePart(): number | null {
        const part = this.acknowledgmentItem?.associatedMessagePart
        if (typeof part !== "number") return null;
        return part;
    }

    get acknowledgedMessageID(): string | null {
        return this.acknowledgmentItem?.associatedMessageID || null;
    }

    get associatedItems(): AssociatedChatItem[] {
        return this.items.filter(item => item instanceof AssociatedChatItem) as AssociatedChatItem[];
    }

    get associatedIDs(): string[] {
        return this.associatedItems.map(item => item.associatedMessageID);
    }

    get isAcknowledgment() {
        return !!this.acknowledgmentItem;
    }

    get isAcknowledged() {
        return this.items.some(item => item instanceof AcknowledgableChatItem && item.positiveAcknowledgments.length > 0);
    }

    get date() {
        return new Date(this.time);
    }

    get chat() {
        if (!this.chatID) {
            console.warn(`Message.ts:chat – chatID is empty or undefined! Message ID: ${this.id}`)
            if (typeof window === "object") {
                (window["chatGroupIDDebug"] || (window["chatGroupIDDebug"] = [])).push(this);
            }
        }
        return this.client.chats.resolve(this.chatID);
    }

    get sender(): Handle | null {
        return this.client.handles.resolve(this._sender);
    }

    get subject(): Handle | null {
        return this.client.handles.resolve(this._subject);
    }

    get read(): boolean {
        return !!this.timeRead;
    }

    get delivered(): boolean {
        return !!this.timeDelivered || this.isDelivered;
    }

    _applyStatusItem({ flags, timeDelivered, timeRead, timePlayed }: StatusChatItem): this {
      this.flags = flags;
      this.timeDelivered = timeDelivered;
      this.timeRead = timeRead;
      this.timePlayed = timePlayed;

      return this;
    }

    _patch({ sender, subject, timeDelivered, timePlayed, timeRead, messageSubject, isSOS, isTypingMessage, isCancelTypingMessage, isDelivered, isAudioMessage, description, flags, items, id, chatID, fromMe, time, service, fileTransferIDs }: MessageRepresentation): this {
        this._sender = sender;
        this._subject = subject;
        this.items = (items?.map((item) => Util.resolveItem(item, this.client)).filter(item => item)) || []
        this.timeDelivered = timeDelivered;
        this.timePlayed = timePlayed;
        this.timeRead = timeRead;
        this.messageSubject = messageSubject;
        this.isSOS = isSOS;
        this.isTypingMessage = isTypingMessage;
        this.isCancelTypingMessage = isCancelTypingMessage;
        this.isDelivered = isDelivered;
        this.isAudioMessage = isAudioMessage;
        this.description = description;
        this.flags = flags;
        this.id = id;
        this.chatID = chatID;
        this.fromMe = fromMe;
        this.time = time;
        this.service = service;
        this.fileTransferIDs = fileTransferIDs;

        return this;
    }
}
