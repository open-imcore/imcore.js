"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const Constants_1 = require("./util/Constants");
const TextChatItem_1 = require("./structures/TextChatItem");
const DateChatItem_1 = require("./structures/DateChatItem");
const SenderChatItem_1 = require("./structures/SenderChatItem");
const ParticipantChangeChatItem_1 = require("./structures/ParticipantChangeChatItem");
const AttachmentChatItem_1 = require("./structures/AttachmentChatItem");
const StatusChatItem_1 = require("./structures/StatusChatItem");
const GroupActionChatItem_1 = require("./structures/GroupActionChatItem");
const PluginChatItem_1 = require("./structures/PluginChatItem");
const AcknowledgmentChatItem_1 = require("./structures/AcknowledgmentChatItem");
const AssociatedChatItem_1 = require("./structures/AssociatedChatItem");
const StubChatItem_1 = require("./structures/StubChatItem");
const GroupTitleChatItem_1 = require("./structures/GroupTitleChatItem");
const Message_1 = require("./structures/Message");
const Handle_1 = require("./structures/Handle");
const Contact_1 = require("./structures/Contact");
const TypingChatItem_1 = require("./structures/TypingChatItem");
const StickerChatItem_1 = require("./structures/StickerChatItem");
class Util {
    /**
     * Takes a fuzzy item representation and returns a solid chat item instance for its type
     * @param item fuzzy item
     * @param client client instance
     */
    static resolveItem(item, client) {
        switch (item.type) {
            case Constants_1.ChatItemType.date: return new DateChatItem_1.DateChatItem(client, item.payload);
            case Constants_1.ChatItemType.sender: return new SenderChatItem_1.SenderChatItem(client, item.payload);
            case Constants_1.ChatItemType.participantChange: return new ParticipantChangeChatItem_1.ParticipantChangeChatItem(client, item.payload);
            case Constants_1.ChatItemType.attachment: return new AttachmentChatItem_1.AttachmentChatItem(client, item.payload);
            case Constants_1.ChatItemType.status: return new StatusChatItem_1.StatusChatItem(client, item.payload);
            case Constants_1.ChatItemType.groupAction: return new GroupActionChatItem_1.GroupActionChatItem(client, item.payload);
            case Constants_1.ChatItemType.plugin: return new PluginChatItem_1.PluginChatItem(client, item.payload);
            case Constants_1.ChatItemType.text: return new TextChatItem_1.TextChatItem(client, item.payload);
            case Constants_1.ChatItemType.acknowledgment: return new AcknowledgmentChatItem_1.AcknowledgmentChatItem(client, item.payload);
            case Constants_1.ChatItemType.associated: return new AssociatedChatItem_1.AssociatedChatItem(client, item.payload);
            case Constants_1.ChatItemType.message: return new Message_1.Message(client, item.payload);
            case Constants_1.ChatItemType.phantom: return new StubChatItem_1.StubChatItem(client, item.payload);
            case Constants_1.ChatItemType.groupTitle: return new GroupTitleChatItem_1.GroupTitleChatItem(client, item.payload);
            case Constants_1.ChatItemType.typing: return new TypingChatItem_1.TypingChatItem(client, item.payload);
            case Constants_1.ChatItemType.sticker: return new StickerChatItem_1.StickerChatItem(client, item.payload);
            default: return null;
        }
    }
    /**
     * Takes a fuzzy handle representation and returns a solid handle ID
     * @param handle fuzzy handle
     */
    static resolveHandle(handle) {
        var id;
        if (handle instanceof Handle_1.Handle)
            id = handle.id;
        else if (handle instanceof Contact_1.Contact)
            id = handle.handleIDs[0];
        else
            id = handle;
        if (typeof id !== "string")
            return null;
        return id;
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map