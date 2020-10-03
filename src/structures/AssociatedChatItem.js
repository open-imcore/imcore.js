"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociatedChatItem = exports.associatedIDExtractor = void 0;
const ChatItem_1 = require("./ChatItem");
exports.associatedIDExtractor = () => /(?:\w+:)(?:(\d*)\/)?([\w-]+)/g;
class AssociatedChatItem extends ChatItem_1.ChatItem {
    get associatedMessagePart() {
        const part = +exports.associatedIDExtractor().exec(this.associatedID)[1];
        if (isNaN(part))
            return null;
        return part;
    }
    get associatedMessageID() {
        try {
            return exports.associatedIDExtractor().exec(this.associatedID)[2];
        }
        catch {
            console.log(this.associatedID);
            return this.associatedID;
        }
    }
    _patch({ associatedID, ...item }) {
        this.associatedID = associatedID;
        return super._patch(item);
    }
}
exports.AssociatedChatItem = AssociatedChatItem;
//# sourceMappingURL=AssociatedChatItem.js.map