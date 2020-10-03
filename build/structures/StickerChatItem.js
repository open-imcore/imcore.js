"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickerChatItem = void 0;
const AssociatedChatItem_1 = require("./AssociatedChatItem");
class StickerChatItem extends AssociatedChatItem_1.AssociatedChatItem {
    _patch({ attachment, sticker, ...item }) {
        this.attachment = attachment;
        this.sticker = sticker;
        return super._patch(item);
    }
}
exports.StickerChatItem = StickerChatItem;
//# sourceMappingURL=StickerChatItem.js.map