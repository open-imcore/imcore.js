"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantChangeChatItem = exports.ParticipantChangeType = void 0;
const ChatItem_1 = require("./ChatItem");
var ParticipantChangeType;
(function (ParticipantChangeType) {
    ParticipantChangeType[ParticipantChangeType["addMember"] = 0] = "addMember";
    ParticipantChangeType[ParticipantChangeType["removeMember"] = 1] = "removeMember";
})(ParticipantChangeType = exports.ParticipantChangeType || (exports.ParticipantChangeType = {}));
class ParticipantChangeChatItem extends ChatItem_1.ChatItem {
    constructor() {
        super(...arguments);
        this.isTranscriptLike = true;
    }
    get initiator() {
        if (!this.initiatorID)
            return null;
        return this.client.handles.resolve(this.initiatorID);
    }
    get target() {
        if (!this.targetID)
            return null;
        return this.client.handles.resolve(this.targetID);
    }
    _patch({ initiatorID, targetID, changeType, ...item }) {
        this.initiatorID = initiatorID;
        this.targetID = targetID;
        this.changeType = changeType;
        return super._patch(item);
    }
}
exports.ParticipantChangeChatItem = ParticipantChangeChatItem;
//# sourceMappingURL=ParticipantChangeChatItem.js.map