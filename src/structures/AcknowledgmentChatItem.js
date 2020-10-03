"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgmentChatItem = void 0;
const AssociatedChatItem_1 = require("./AssociatedChatItem");
class AcknowledgmentChatItem extends AssociatedChatItem_1.AssociatedChatItem {
    get representation() {
        return {
            chatID: this.chatID,
            time: this.time,
            id: this.id,
            fromMe: this.fromMe,
            sender: this._sender,
            acknowledgmentType: this.acknowledgmentType,
            associatedID: this.associatedID
        };
    }
    get sender() {
        if (!this._sender)
            return null;
        return this.client.handles.resolve(this._sender);
    }
    _patch({ sender, acknowledgmentType, ...item }) {
        this._sender = sender;
        this.acknowledgmentType = acknowledgmentType;
        return super._patch(item);
    }
}
exports.AcknowledgmentChatItem = AcknowledgmentChatItem;
//# sourceMappingURL=AcknowledgmentChatItem.js.map