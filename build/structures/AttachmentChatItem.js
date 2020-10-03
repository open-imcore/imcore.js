"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentChatItem = void 0;
const AcknowledgableChatItem_1 = require("./AcknowledgableChatItem");
class AttachmentChatItem extends AcknowledgableChatItem_1.AcknowledgableChatItem {
    toString() {
        return `AttachmentChatItem[transferID: ${this.transferID}]`;
    }
    /**
     * The URL to download the attachment
     */
    get url() {
        return this.rest.attachmentURL(this.transferID);
    }
    _patch({ transferID, metadata, ...item }) {
        this.transferID = transferID;
        this.metadata = metadata;
        return super._patch(item);
    }
}
exports.AttachmentChatItem = AttachmentChatItem;
//# sourceMappingURL=AttachmentChatItem.js.map