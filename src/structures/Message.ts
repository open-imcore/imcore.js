import { MessageRepresentation, AnyChatItemModel } from "../types";
import { Handle } from "./Handle";
import { AnyChatItem, Util } from "../Util";
import { Base } from "./Base";

export class Message extends Base<MessageRepresentation> implements Omit<MessageRepresentation, "sender" | "subject" | "items"> {
    
    private _sender: string;
    private _subject: string;
    private _items: AnyChatItemModel[];
    
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
    chatGUID: string;
    fromMe: boolean;
    time: number;
    
    get date() {
        return new Date(this.time);
    }

    get chat() {
        return this.client.chats.resolve(this.chatGUID);
    }

    get items(): AnyChatItem[] {
        return this._items.map((item, index) => Util.resolveItem(item, this.client, this.guid, index)).filter(item => item)
    }

    get sender(): Handle | null {
        return this.client.handles.resolve(this._sender);
    }

    get subject(): Handle | null {
        return this.client.handles.resolve(this._subject);
    }

    _patch({ sender, subject, timeDelivered, timePlayed, timeRead, messageSubject, isSOS, isTypingMessage, isCancelTypingMessage, isDelivered, isAudioMessage, description, flags, items, guid, chatGUID, fromMe, time }: MessageRepresentation): this {
        this._sender = sender;
        this._subject = subject;
        this._items = items;
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
        this.chatGUID = chatGUID;
        this.fromMe = fromMe;
        this.time = time;

        return this;
    }
}