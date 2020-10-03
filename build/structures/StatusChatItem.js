"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
class StatusChatItem extends ChatItem_1.ChatItem {
    get item() {
        return this.client.messages.resolve(this.itemID);
    }
    _patch({ statusType, itemID, flags, timeDelivered, timeRead, timePlayed, ...item }) {
        this.statusType = statusType;
        this.itemID = itemID;
        this.flags = flags;
        this.timeDelivered = timeDelivered;
        this.timeRead = timeRead;
        this.timePlayed = timePlayed;
        return super._patch(item);
    }
}
exports.StatusChatItem = StatusChatItem;
//# sourceMappingURL=StatusChatItem.js.map