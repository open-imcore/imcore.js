"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const BaseManager_1 = require("./BaseManager");
const Chat_1 = require("../structures/Chat");
class ChatManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, Chat_1.Chat, "id");
    }
    async hardResolve(chatID) {
        return this.resolve(chatID) || await this.add(await this.client.rest.chats.fetchOne(chatID));
    }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map