"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupTitleChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
class GroupTitleChatItem extends ChatItem_1.ChatItem {
    constructor() {
        super(...arguments);
        this.isTranscriptLike = true;
    }
    get sender() {
        if (!this._sender)
            return null;
        return this.client.handles.resolve(this._sender);
    }
    _patch({ title, sender, ...item }) {
        this.title = title;
        this._sender = sender;
        return super._patch(item);
    }
}
exports.GroupTitleChatItem = GroupTitleChatItem;
//# sourceMappingURL=GroupTitleChatItem.js.map