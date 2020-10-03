import { Base } from "./Base";
import { Client } from "../client/client";
import { ChatItemRepresentation } from "imcore-ajax-core";
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
