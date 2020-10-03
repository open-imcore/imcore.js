"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.ChatStyle = exports.ChatJoinState = void 0;
const Base_1 = require("./Base");
const Util_1 = require("../Util");
// import { MessageOptions } from "../client/rest/client";
const __1 = require("..");
const client_events_1 = require("../client/client-events");
var ChatJoinState;
(function (ChatJoinState) {
    ChatJoinState[ChatJoinState["removed"] = 0] = "removed";
    ChatJoinState[ChatJoinState["unknown"] = 1] = "unknown";
    ChatJoinState[ChatJoinState["unknown1"] = 2] = "unknown1";
    ChatJoinState[ChatJoinState["joined"] = 3] = "joined";
})(ChatJoinState = exports.ChatJoinState || (exports.ChatJoinState = {}));
var ChatStyle;
(function (ChatStyle) {
    ChatStyle[ChatStyle["group"] = 43] = "group";
    ChatStyle[ChatStyle["single"] = 45] = "single";
})(ChatStyle = exports.ChatStyle || (exports.ChatStyle = {}));
class Chat extends Base_1.Base {
    toString() {
        return `Chat[id: ${this.id}; joinState: ${this.joinState}; roomName: ${this.roomName}; displayName: ${this.displayName}; participants: [${this.participantIDs.join(', ')}]; unreadMessageCount: ${this.unreadMessageCount}; messageFailureCount: ${this.messageFailureCount}; service: ${this.service}; lastMessage: ${this.lastMessage}; lastMessageTime: ${this.lastMessageTime}; style: ${this.style};]`;
    }
    get messages() {
        return this.client.messages.getAllForChat(this);
    }
    get prettyName() {
        if (this.displayName)
            return this.displayName;
        const participants = this.participants;
        if (participants.length === 1)
            return participants[0].name;
        return participants.map(p => p.shortName).join(', ');
    }
    get participants() {
        return this.participantIDs.map(id => this.client.handles.resolve(id));
    }
    set participants(participants) {
        this.participantIDs = participants.map(p => p.id);
    }
    /**
     * Updates the properties of this chat
     * @param properties properties to apply
     */
    async updateProperties(properties) {
        return this._patch_configuration(await this.client.rest.chats.patchProperties(this.id, properties));
    }
    /**
     * Sends a typing indicator or cancel typing indicator
     * @param isTyping whether we are typing
     */
    async typing(isTyping = true) {
        await this.client.rest.chats.setTyping(this.id, isTyping);
    }
    /**
     * Marks all messages in the chat as read
     */
    async markAllMessagesAsRead() {
        await this.client.rest.chats.readAllMessages(this.id);
    }
    /**
     * Refreshes the participants and returns an updated array of handles
     */
    async refreshParticipants() {
        this.participantIDs = await this.rest.chats.fetchParticipants(this.id);
        return this.participants;
    }
    /**
     * Refreshes the object with the latest record from the API
     */
    async refresh() {
        return this._patch(await this.rest.chats.fetchOne(this.id));
    }
    /**
     * Rejoin a chat. Doesn't work well.
     */
    async join() {
        return this._patch(await this.rest.chats.join(this.id));
    }
    /**
     * Rename the chat
     * @param name new name to assign
     */
    async rename(name) {
        return this._patch(await this.rest.chats.rename(this.id, name));
    }
    /**
     * Deletes the current chat
     */
    async delete() {
        return this._patch(await this.rest.chats.deleteChat(this.id));
    }
    /**
     * Loads messages before a given ID
     * @param before id to mark as the start
     * @param limit number of messages to load
     */
    async loadMessages(before, limit = 50) {
        const rawMessages = await this.rest.chats.fetchRecentMessages(this.id, {
            before,
            limit
        });
        return await Promise.all(rawMessages.map(message => this.client.messages.add(message))).then(messages => {
            this.client.emit(client_events_1.IMCoreEvent.historyLoaded, messages);
            return messages;
        });
    }
    /**
     * Send a message with the given parameters
     * @param options message options
     */
    async sendMessage(options) {
        const representations = await this.rest.chats.sendMessage(this.id, options);
        return await Promise.all(representations.map(r => this.client.messages.add(r))).then(messages => {
            messages.forEach(message => this.client.emit(__1.MessageReceived, message));
            return messages;
        });
    }
    /**
     * Send a text message
     * @param text text to send
     */
    async sendText(text) {
        return this.sendMessage({
            parts: [
                {
                    type: "text",
                    details: text
                }
            ]
        });
    }
    /**
     * Add an array of participants to this group chat.
     * @param participants participants to add
     */
    async addParticipants(participants) {
        return this.toggleParticipants(participants, "put");
    }
    /**
     * Remove an array of participants from this group chat.
     * @param participants participants to remove
     */
    async removeParticipants(participants) {
        return this.toggleParticipants(participants, "delete");
    }
    async toggleParticipants(participants, mode) {
        const handles = participants.map(handle => Util_1.Util.resolveHandle(handle)).filter(h => h);
        this.participantIDs = await this.rest[mode === "put" ? "addChatParticipants" : "removeChatParticipants"](this.id, handles);
        return this;
    }
    _patch_configuration({ readReceipts, ignoreAlerts }) {
        this.readReceipts = readReceipts;
        this.ignoreAlerts = ignoreAlerts;
        return this;
    }
    _patch({ joinState, roomName, displayName, id, participants, unreadMessageCount, messageFailureCount, service, lastMessageTime, lastMessage, style, ignoreAlerts, readReceipts }) {
        this.joinState = joinState;
        this.roomName = roomName;
        this.displayName = displayName;
        this.id = id;
        this.participantIDs = participants;
        this.unreadMessageCount = unreadMessageCount;
        this.messageFailureCount = messageFailureCount;
        this.service = service;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.style = style;
        this.ignoreAlerts = ignoreAlerts;
        this.readReceipts = readReceipts;
        return this;
    }
}
exports.Chat = Chat;
//# sourceMappingURL=Chat.js.map