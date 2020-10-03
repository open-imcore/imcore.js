"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
class SenderChatItem extends ChatItem_1.ChatItem {
    get handle() {
        return this.client.handles.resolve(this.handleID);
    }
    _patch({ handleID, ...item }) {
        this.handleID = handleID;
        return super._patch(item);
    }
}
exports.SenderChatItem = SenderChatItem;
//# sourceMappingURL=SenderChatItem.js.map