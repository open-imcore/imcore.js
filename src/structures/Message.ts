import { MessageRepresentation, AttachmentRepresentation } from "../types";
import { Handle } from "./Handle";
import { AnyChatItem, Util } from "../Util";
import { Base } from "./Base";
import { AcknowledgmentChatItem } from "./AcknowledgmentChatItem";
import { TapbackStyle } from "./ChatItem";
import { AttachmentChatItem } from "./AttachmentChatItem";
import { TextChatItem } from "./TextChatItem";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
import { StatusChatItem } from './StatusChatItem';
import { AssociatedChatItem } from './AssociatedChatItem';

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
    guid: string;
    chatGroupID: string;
    fromMe: boolean;
    time: number;
    items: AnyChatItem[];
    service: string;

    toString(): string {
        return `Message[guid: ${this.guid}; time: ${this.time}; timeDelivered: ${this.timeDelivered}; timePlayed: ${this.timePlayed}; isTypingMessage: ${this.isTypingMessage}; isCancelTypingMessage: ${this.isCancelTypingMessage}; isDelivered: ${this.isDelivered}; isAudioMessage: ${this.isAudioMessage}; flags: ${this.flags}; fromMe: ${this.fromMe}; items: [${this.items.join(', ')}];]`
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

    get acknowledgmentType(): TapbackStyle | null {
        return this.acknowledgmentItem?.acknowledgmentType || null;
    }

    get acknowledgedMessage(): Message | null {
        const { acknowledgedMessageGUID } = this;
        if (!acknowledgedMessageGUID) return null;
        return this.client.messages.resolve(acknowledgedMessageGUID) || null;
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

    get acknowledgedMessageGUID(): string | null {
        return this.acknowledgmentItem?.associatedMessageGUID || null;
    }

    get associatedItems(): AssociatedChatItem[] {
        return this.items.filter(item => item instanceof AssociatedChatItem) as AssociatedChatItem[];
    }

    get associatedGUIDs(): string[] {
        return this.associatedItems.map(item => item.associatedMessageGUID);
    }

    get isAcknowledgment() {
        return !!this.acknowledgmentItem;
    }

    get date() {
        return new Date(this.time);
    }

    get chat() {
        return this.client.chats.resolve(this.chatGroupID);
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
        return !!this.timeDelivered;
    }

    _applyStatusItem({ flags, timeDelivered, timeRead, timePlayed }: StatusChatItem): this {
      this.flags = flags;
      this.timeDelivered = timeDelivered;
      this.timeRead = timeRead;
      this.timePlayed = timePlayed;

      return this;
    }

    _patch({ sender, subject, timeDelivered, timePlayed, timeRead, messageSubject, isSOS, isTypingMessage, isCancelTypingMessage, isDelivered, isAudioMessage, description, flags, items, guid, chatGroupID, fromMe, time, service }: MessageRepresentation): this {
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
        this.guid = guid;
        this.chatGroupID = chatGroupID;
        this.fromMe = fromMe;
        this.time = time;
        this.service = service;

        return this;
    }
}
