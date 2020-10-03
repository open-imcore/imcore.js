import { BaseManager } from "./BaseManager";
import { Message } from "../structures/Message";
import { Client } from "../client/client";
import { Chat } from "../structures/Chat";
import { MessageRepresentation } from "imcore-ajax-core";

export interface MessageBatchingResult {
    message: Message;
    associatedIDs?: string[];
}

export class MessageManager extends BaseManager<Message, MessageRepresentation> {
    constructor(client: Client) {
        super(client, Message, "id");
    }

    getAllForChatID(chatID: string) {
        return this.cache.filter(m => m.chatID === chatID);
    }

    getAllForChat(chat: Chat) {
        return this.getAllForChatID(chat.id);
    }

    /**
     * Like add(), but returns additional data IDs instead of resolving them
     * @param data data to load into the store
     */
    async batchAdd(data: MessageRepresentation): Promise<MessageBatchingResult> {
        const message = await super.add(data);

        return {
            message,
            associatedIDs: message.associatedIDs
        };
    }

    /**
     * Resolves associated data with the given batching results
     * @param results results to load
     */
    async resolveBatchResults(results: MessageBatchingResult[]): Promise<Message[]> {
        const messageIDs = results.reduce((acc, { associatedIDs }) => acc.concat(associatedIDs), [] as string[]);

        const representations = await this.client.rest.messages.fetchMany(messageIDs)

        return Promise.all(representations.map(rep => this.add(rep)));
    }

    async add(data: MessageRepresentation, loadAcknowledgementData = false): Promise<Message> {
        const result = await this.batchAdd(data);

        if (loadAcknowledgementData) {
            await this.resolveBatchResults([result]);
        }
        
        const { message } = result;
        if (!message.chat) {
            await this.client.chat(message.chatID)
        }

        return result.message;
    }
}
