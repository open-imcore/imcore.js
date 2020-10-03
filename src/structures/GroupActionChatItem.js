"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupActionChatItem = exports.GroupActionType = void 0;
const ChatItem_1 = require("./ChatItem");
var GroupActionType;
(function (GroupActionType) {
    GroupActionType[GroupActionType["left"] = 0] = "left";
})(GroupActionType = exports.GroupActionType || (exports.GroupActionType = {}));
class GroupActionChatItem extends ChatItem_1.ChatItem {
    constructor() {
        super(...arguments);
        this.isTranscriptLike = true;
    }
    get sender() {
        return this.client.handles.resolve(this._sender);
    }
    _patch({ actionType, sender, ...item }) {
        this.actionType = actionType;
        this._sender = sender;
        return super._patch(item);
    }
}
exports.GroupActionChatItem = GroupActionChatItem;
//# sourceMappingURL=GroupActionChatItem.js.map