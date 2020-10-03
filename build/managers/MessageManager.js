"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManager = void 0;
const BaseManager_1 = require("./BaseManager");
const Message_1 = require("../structures/Message");
class MessageManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, Message_1.Message, "id");
    }
    getAllForChatID(chatID) {
        return this.cache.filter(m => m.chatID === chatID);
    }
    getAllForChat(chat) {
        return this.getAllForChatID(chat.id);
    }
    /**
     * Like add(), but returns additional data IDs instead of resolving them
     * @param data data to load into the store
     */
    async batchAdd(data) {
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
    async resolveBatchResults(results) {
        const messageIDs = results.reduce((acc, { associatedIDs }) => acc.concat(associatedIDs), []);
        const representations = await this.client.rest.messages.fetchMany(messageIDs);
        return Promise.all(representations.map(rep => this.add(rep)));
    }
    async add(data, loadAcknowledgementData = false) {
        const result = await this.batchAdd(data);
        if (loadAcknowledgementData) {
            await this.resolveBatchResults([result]);
        }
        const { message } = result;
        if (!message.chat) {
            await this.client.chat(message.chatID);
        }
        return result.message;
    }
}
exports.MessageManager = MessageManager;
//# sourceMappingURL=MessageManager.js.map