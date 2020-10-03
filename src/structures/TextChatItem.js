"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChatItem = void 0;
const AcknowledgableChatItem_1 = require("./AcknowledgableChatItem");
class TextChatItem extends AcknowledgableChatItem_1.AcknowledgableChatItem {
    toString() {
        return `TextChatItem[text: ${this.text};]`;
    }
    _patch({ text, parts, ...item }) {
        this.text = text;
        this.parts = parts;
        return super._patch(item);
    }
}
exports.TextChatItem = TextChatItem;
//# sourceMappingURL=TextChatItem.js.map