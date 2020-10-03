"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgableChatItem = void 0;
const ChatItem_1 = require("./ChatItem");
const AcknowledgmentChatItem_1 = require("./AcknowledgmentChatItem");
const __1 = require("..");
const AssociatedChatItem_1 = require("./AssociatedChatItem");
const imcore_ajax_core_1 = require("imcore-ajax-core");
class AcknowledgableChatItem extends ChatItem_1.ChatItem {
    get acknowledgments() {
        return this._acknowledgments?.map(item => new AcknowledgmentChatItem_1.AcknowledgmentChatItem(this.client, item)) || [];
    }
    get positiveAcknowledgments() {
        return this.acknowledgments.filter(item => item.acknowledgmentType < 2999);
    }
    /**
     * Send an associated message with the given style
     * @param style association style
     */
    async sendAssociatedMessage(style) {
        const message = await this.client.messages.add(await this.rest.messages.createAssociatedMessage(this.id, this.parentMessageID, style));
        if (message.acknowledgedMessageItem && message.acknowledgmentItem) {
            message.acknowledgedMessageItem._acknowledgments = message.acknowledgedMessageItem._acknowledgments.filter(ack => !ack.fromMe).concat(message.acknowledgmentItem.representation);
        }
        this.client.emit(__1.MessageReceived, message);
    }
    /**
     * Load all associated messages for the item
     */
    async associatedMessages() {
        const associatedRepresentations = await this.rest.messages.fetchAssociatedMessages(this.id);
        return Promise.all(associatedRepresentations.map(message => this.client.messages.add(message)));
    }
    get parentMessageID() {
        return AssociatedChatItem_1.associatedIDExtractor().exec(this.id)[2];
    }
    _patch({ acknowledgments, ...item }) {
        this._acknowledgments = (acknowledgments || []).filter(({ acknowledgmentType }) => {
            switch (acknowledgmentType) {
                case imcore_ajax_core_1.AcknowledgmentType.removeExclamation:
                case imcore_ajax_core_1.AcknowledgmentType.removeHa:
                case imcore_ajax_core_1.AcknowledgmentType.removeHeart:
                case imcore_ajax_core_1.AcknowledgmentType.removeQuestionmark:
                case imcore_ajax_core_1.AcknowledgmentType.removeThumbsdown:
                case imcore_ajax_core_1.AcknowledgmentType.removeThumbsup:
                    return false;
            }
            return true;
        });
        return super._patch(item);
    }
}
exports.AcknowledgableChatItem = AcknowledgableChatItem;
//# sourceMappingURL=AcknowledgableChatItem.js.map