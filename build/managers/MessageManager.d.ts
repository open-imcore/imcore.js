import { BaseManager } from "./BaseManager";
import { Message } from "../structures/Message";
import { Client } from "../client/client";
import { Chat } from "../structures/Chat";
import { MessageRepresentation } from "imcore-ajax-core";
export interface MessageBatchingResult {
    message: Message;
    associatedIDs?: string[];
}
export declare class MessageManager extends BaseManager<Message, MessageRepresentation> {
    constructor(client: Client);
    getAllForChatID(chatID: string): import("@discordjs/collection").Collection<string, Message>;
    getAllForChat(chat: Chat): import("@discordjs/collection").Collection<string, Message>;
    /**
     * Like add(), but returns additional data IDs instead of resolving them
     * @param data data to load into the store
     */
    batchAdd(data: MessageRepresentation): Promise<MessageBatchingResult>;
    /**
     * Resolves associated data with the given batching results
     * @param results results to load
     */
    resolveBatchResults(results: MessageBatchingResult[]): Promise<Message[]>;
    add(data: MessageRepresentation, loadAcknowledgementData?: boolean): Promise<Message>;
}
