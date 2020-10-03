"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
class StubChatItem extends ChatItem_1.ChatItem {
    toString() {
        return `StubChatItem[className: ${this.className}]`;
    }
    _patch({ className, ...item }) {
        this.className = className;
        return super._patch(item);
    }
}
exports.StubChatItem = StubChatItem;
//# sourceMappingURL=StubChatItem.js.map