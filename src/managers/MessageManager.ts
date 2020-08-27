import { BaseManager } from "./BaseManager";
import { Message } from "../structures/Message";
import { Client } from "../client/client";
import { MessageRepresentation } from "../types";

export interface MessageBatchingResult {
    message: Message;
    associatedGUIDs?: string[];
}

export class MessageManager extends BaseManager<Message, MessageRepresentation> {
    constructor(client: Client) {
        super(client, Message, "guid");
    }

    /**
     * Like add(), but returns additional data IDs instead of resolving them
     * @param data data to load into the store
     */
    async batchAdd(data: MessageRepresentation): Promise<MessageBatchingResult> {
        const message = await super.add(data);

        return {
            message,
            associatedGUIDs: message.associatedGUIDs
        };
    }

    /**
     * Resolves associated data with the given batching results
     * @param results results to load
     */
    async resolveBatchResults(results: MessageBatchingResult[]): Promise<Message[]> {
        const guids = results.reduce((acc, { associatedGUIDs }) => acc.concat(associatedGUIDs), [] as string[]);

        const representations = await this.client.rest.bulkGetMessages(guids)

        return Promise.all(representations.map(rep => this.add(rep)));
    }

    async add(data: MessageRepresentation, loadAcknowledgementData = false): Promise<Message> {
        const result = await this.batchAdd(data);

        if (loadAcknowledgementData) {
            await this.resolveBatchResults([result]);
        }
        
        const { message } = result;
        if (!message.chat) {
            await this.client.chat(message.chatGroupID)
        }

        return result.message;
    }
}
