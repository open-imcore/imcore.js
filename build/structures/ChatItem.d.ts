import { Base } from "./Base";
import { Client } from "../client/client";
import { ChatItemRepresentation } from "imcore-ajax-core";
export declare enum TapbackStyle {
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
export declare class ChatItem<T extends ChatItemRepresentation = ChatItemRepresentation> extends Base<T> implements ChatItemRepresentation {
    constructor(client: Client, data: T);
    toString(): string;
    /**
     * Returns true if both chat items are acknowledgeable, have no acknowledgments, and were created within 60 seconds of eachother
     * @param chatItem chat item to test
     */
    isContiguousWith(chatItem: ChatItem): boolean;
    isTranscriptLike: boolean;
    _patch({ id, chatID, fromMe, time }: ChatItemRepresentation): this;
    id: string;
    chatID: string;
    fromMe: boolean;
    time: number;
    get date(): Date;
    get chat(): import("./Chat").Chat;
}
