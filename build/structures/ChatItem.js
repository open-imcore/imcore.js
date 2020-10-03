"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatItem = void 0;
const Base_1 = require("./Base");
const AcknowledgableChatItem_1 = require("./AcknowledgableChatItem");
class ChatItem extends Base_1.Base {
    constructor(client, data) {
        super(client, data);
        this.isTranscriptLike = false;
    }
    toString() {
        return this.constructor.name;
    }
    /**
     * Returns true if both chat items are acknowledgeable, have no acknowledgments, and were created within 60 seconds of eachother
     * @param chatItem chat item to test
     */
    isContiguousWith(chatItem) {
        if (chatItem instanceof AcknowledgableChatItem_1.AcknowledgableChatItem && this instanceof AcknowledgableChatItem_1.AcknowledgableChatItem) {
            if (chatItem.acknowledgments.length > 0 || this.acknowledgments.length > 0)
                return false;
            const { date: date1 } = chatItem, { date: date2 } = this;
            return Math.abs((date1.getTime() - date2.getTime()) / 1000) <= 60;
        }
        return false;
    }
    _patch({ id, chatID, fromMe, time }) {
        this.id = id;
        this.chatID = chatID;
        this.fromMe = fromMe;
        this.time = time;
        return this;
    }
    get date() {
        return new Date(this.time);
    }
    get chat() {
        return this.client.chats.resolve(this.chatID);
    }
}
exports.ChatItem = ChatItem;
//# sourceMappingURL=ChatItem.js.map