"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const Util_1 = require("../Util");
const Base_1 = require("./Base");
const AcknowledgmentChatItem_1 = require("./AcknowledgmentChatItem");
const AttachmentChatItem_1 = require("./AttachmentChatItem");
const TextChatItem_1 = require("./TextChatItem");
const AcknowledgableChatItem_1 = require("./AcknowledgableChatItem");
const AssociatedChatItem_1 = require("./AssociatedChatItem");
class Message extends Base_1.Base {
    toString() {
        return `Message[id: ${this.id}; time: ${this.time}; timeDelivered: ${this.timeDelivered}; timePlayed: ${this.timePlayed}; isTypingMessage: ${this.isTypingMessage}; isCancelTypingMessage: ${this.isCancelTypingMessage}; isDelivered: ${this.isDelivered}; isAudioMessage: ${this.isAudioMessage}; flags: ${this.flags}; fromMe: ${this.fromMe}; items: [${this.items.join(', ')}];]`;
    }
    get isTranscriptLike() {
        return this.items.every(item => item.isTranscriptLike);
    }
    get attachments() {
        return this.attachmentItems.map(item => item.metadata).filter(metadata => !!metadata);
    }
    get textItems() {
        return this.items.filter(item => item instanceof TextChatItem_1.TextChatItem);
    }
    get attachmentItems() {
        return this.items.filter(item => item instanceof AttachmentChatItem_1.AttachmentChatItem);
    }
    get acknowledgmentItem() {
        return this.items.find(item => item instanceof AcknowledgmentChatItem_1.AcknowledgmentChatItem) || null;
    }
    get acknowledgmentType() {
        return this.acknowledgmentItem?.acknowledgmentType || null;
    }
    get acknowledgedMessage() {
        const { acknowledgedMessageID } = this;
        if (!acknowledgedMessageID)
            return null;
        return this.client.messages.resolve(acknowledgedMessageID) || null;
    }
    get acknowledgedMessageItem() {
        const { acknowledgedMessage, acknowledgedMessagePart } = this;
        if (!acknowledgedMessage || typeof acknowledgedMessagePart !== "number")
            return null;
        const item = acknowledgedMessage.items[acknowledgedMessagePart];
        if (!item)
            return null;
        if (!(item instanceof AcknowledgableChatItem_1.AcknowledgableChatItem)) {
            this.client.emit('debug', {
                level: 'error',
                messages: [
                    `Got an unknown acknowledged item. Error[acknowledgementMessage: ${this}; acknowledgedMessage: ${acknowledgedMessage}; part: ${acknowledgedMessagePart};]`
                ]
            });
            return null;
        }
        return item;
    }
    get acknowledgedMessagePart() {
        const part = this.acknowledgmentItem?.associatedMessagePart;
        if (typeof part !== "number")
            return null;
        return part;
    }
    get acknowledgedMessageID() {
        return this.acknowledgmentItem?.associatedMessageID || null;
    }
    get associatedItems() {
        return this.items.filter(item => item instanceof AssociatedChatItem_1.AssociatedChatItem);
    }
    get associatedIDs() {
        return this.associatedItems.map(item => item.associatedMessageID);
    }
    get isAcknowledgment() {
        return !!this.acknowledgmentItem;
    }
    get isAcknowledged() {
        return this.items.some(item => item instanceof AcknowledgableChatItem_1.AcknowledgableChatItem && item.positiveAcknowledgments.length > 0);
    }
    get date() {
        return new Date(this.time);
    }
    get chat() {
        if (!this.chatID) {
            console.warn(`Message.ts:chat – chatID is empty or undefined! Message ID: ${this.id}`);
            if (typeof window === "object") {
                (window["chatGroupIDDebug"] || (window["chatGroupIDDebug"] = [])).push(this);
            }
        }
        return this.client.chats.resolve(this.chatID);
    }
    get sender() {
        return this.client.handles.resolve(this._sender);
    }
    get subject() {
        return this.client.handles.resolve(this._subject);
    }
    get read() {
        return !!this.timeRead;
    }
    get delivered() {
        return !!this.timeDelivered || this.isDelivered;
    }
    _applyStatusItem({ flags, timeDelivered, timeRead, timePlayed }) {
        this.flags = flags;
        this.timeDelivered = timeDelivered;
        this.timeRead = timeRead;
        this.timePlayed = timePlayed;
        return this;
    }
    _patch({ sender, subject, timeDelivered, timePlayed, timeRead, messageSubject, isSOS, isTypingMessage, isCancelTypingMessage, isDelivered, isAudioMessage, description, flags, items, id, chatID, fromMe, time, service, fileTransferIDs }) {
        this._sender = sender;
        this._subject = subject;
        this.items = (items?.map((item) => Util_1.Util.resolveItem(item, this.client)).filter(item => item)) || [];
        this.timeDelivered = timeDelivered;
        this.timePlayed = timePlayed;
        this.timeRead = timeRead;
        this.messageSubject = messageSubject;
        this.isSOS = isSOS;
        this.isTypingMessage = isTypingMessage;
        this.isCancelTypingMessage = isCancelTypingMessage;
        this.isDelivered = isDelivered;
        this.isAudioMessage = isAudioMessage;
        this.description = description;
        this.flags = flags;
        this.id = id;
        this.chatID = chatID;
        this.fromMe = fromMe;
        this.time = time;
        this.service = service;
        this.fileTransferIDs = fileTransferIDs;
        return this;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map