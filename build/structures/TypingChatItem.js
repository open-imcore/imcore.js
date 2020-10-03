"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
class TypingChatItem extends ChatItem_1.ChatItem {
    get sender() {
        return this.client.handles.resolve(this._sender);
    }
    _patch({ sender, ...item }) {
        this._sender = sender;
        return super._patch(item);
    }
}
exports.TypingChatItem = TypingChatItem;
//# sourceMappingURL=TypingChatItem.js.map