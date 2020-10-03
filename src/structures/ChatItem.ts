import { Base } from "./Base";
import { Client } from "../client/client";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
import { ChatItemRepresentation } from "imcore-ajax-core";

export enum TapbackStyle {
    heart = 2000,
    thumbsUp = 2001,
    thumbsDown = 2002,
    haha = 2003,
    exclamation = 2004,
    question = 2005,
    revokeHeart = 3000,
    revokeThumbsUp = 3001,
    revokeThumbsDown = 3002,
    revokeHaha = 3003,
    revokeExclamation = 3004,
    revokeQuestion = 3005
}

export class ChatItem<T extends ChatItemRepresentation = ChatItemRepresentation> extends Base<T> implements ChatItemRepresentation {
    constructor(client: Client, data: T) {
        super(client, data)
    }

    toString() {
        return this.constructor.name;
    }

    /**
     * Returns true if both chat items are acknowledgeable, have no acknowledgments, and were created within 60 seconds of eachother
     * @param chatItem chat item to test
     */
    public isContiguousWith(chatItem: ChatItem): boolean {
        if (chatItem instanceof AcknowledgableChatItem && this instanceof AcknowledgableChatItem) {
            if (chatItem.acknowledgments.length > 0 || this.acknowledgments.length > 0) return false;
            const { date: date1 } = chatItem, { date: date2 } = this;

            return Math.abs((date1.getTime() - date2.getTime()) / 1000) <= 60;
        }

        return false;
    }

    public isTranscriptLike: boolean = false;

    _patch({ id, chatID, fromMe, time }: ChatItemRepresentation) {
        this.id = id;
        this.chatID = chatID
        this.fromMe = fromMe;
        this.time = time;

        return this;
    }

    id: string;
    chatID: string;
    fromMe: boolean;
    time: number;

    get date() {
        return new Date(this.time);
    }

    get chat() {
        return this.client.chats.resolve(this.chatID);
    }
}
