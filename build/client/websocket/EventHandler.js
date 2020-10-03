"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const client_events_1 = require("../client-events");
const Constants_1 = require("../../util/Constants");
const __1 = require("../..");
const imcore_ajax_core_1 = require("imcore-ajax-core");
class EventHandler {
    constructor(client, manager, onReady) {
        this.client = client;
        manager.on(imcore_ajax_core_1.EventType.bootstrap, async ({ chats, contacts: { contacts, strangers }, messages }) => {
            contacts.forEach(contact => {
                this.client.contacts.add(contact);
                contact.handles.forEach(handle => {
                    this.client.handles.add(handle);
                });
            });
            strangers.forEach(stranger => {
                this.client.handles.add(stranger);
            });
            chats.forEach(chat => {
                this.client.chats.add(chat);
            });
            if (messages) {
                const messageItems = messages.items.filter(item => item.type === Constants_1.ChatItemType.message).map(({ payload }) => payload);
                const batches = await Promise.all(messageItems.map(async (message) => await this.client.messages.batchAdd(message)));
                await this.client.messages.resolveBatchResults(batches);
            }
            onReady();
        });
        manager.on(imcore_ajax_core_1.EventType.itemsReceived, ({ items }) => {
            const messages = items.filter(item => item.type === Constants_1.ChatItemType.message);
            messages.map(async ({ payload: message }) => this.client.emit(client_events_1.MessageReceived, await this.client.messages.add(message, true)));
        });
        manager.on(imcore_ajax_core_1.EventType.itemsUpdated, ({ items }) => {
            const messages = items.filter(item => item.type === Constants_1.ChatItemType.message);
            messages.forEach(async ({ payload: message }) => {
                this.client.emit(client_events_1.MessageUpdated, await this.client.messages.add(message, true));
            });
        });
        manager.on(imcore_ajax_core_1.EventType.itemStatusChanged, status => {
            const message = this.client.messages.resolve(status.itemID);
            if (!message)
                return;
            const item = new __1.StatusChatItem(this.client, status);
            message._applyStatusItem(item);
            this.client.emit(client_events_1.MessageUpdated, message);
        });
        manager.on(imcore_ajax_core_1.EventType.itemsRemoved, ({ messages }) => {
            messages.forEach(id => {
                const message = this.client.messages.resolve(id);
                if (message?.isTypingMessage || message?.isCancelTypingMessage)
                    return;
                const deleted = this.client.messages.delete(id);
                if (!deleted)
                    return;
                this.client.emit(client_events_1.MessageRemoved, deleted);
            });
        });
        manager.on(imcore_ajax_core_1.EventType.contactCreated, async (contact) => {
            this.client.emit(client_events_1.ContactCreated, await this.client.contacts.add(contact));
        });
        manager.on(imcore_ajax_core_1.EventType.contactUpdated, async (contact) => {
            this.client.emit(client_events_1.ContactUpdated, await this.client.contacts.add(contact));
        });
        manager.on(imcore_ajax_core_1.EventType.contactRemoved, contact => {
            this.client.emit(client_events_1.ContactRemoved, this.client.contacts.delete(contact.id));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationChanged, async (chat) => {
            this.client.emit(client_events_1.ChatUpdated, await this.client.chats.add(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationDisplayNameChanged, async (chat) => {
            this.client.emit(client_events_1.ChatDisplayNameUpdated, await this.client.chats.add(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationJoinStateChanged, async (chat) => {
            this.client.emit(client_events_1.ChatJoinStateUpdated, await this.client.chats.add(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationUnreadCountChanged, async (chat) => {
            this.client.emit(client_events_1.ChatUnreadCountUpdated, await this.client.chats.add(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationPropertiesChanged, async (properties) => {
            const chat = await this.client.chats.hardResolve(properties.id);
            if (!chat)
                return;
            chat._patch_configuration(properties);
        });
        manager.on(imcore_ajax_core_1.EventType.conversationCreated, async (chat) => {
            this.client.emit(client_events_1.ChatCreated, await this.client.chats.add(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.conversationRemoved, ({ chat }) => {
            this.client.emit(client_events_1.ChatRemoved, this.client.chats.delete(chat));
        });
        manager.on(imcore_ajax_core_1.EventType.blockListUpdated, ({ handles }) => {
            this.client.blockedHandleIDs = handles;
            this.client.emit(client_events_1.BlockListUpdated, this.client.blockedHandleIDs.map(id => this.client.handles.resolve(id)));
        });
        manager.on(imcore_ajax_core_1.EventType.participantsChanged, ({ chat: chatID, handles }) => {
            const chat = this.client.chats.resolve(chatID);
            chat.participants = handles.map(h => this.client.handles.resolve(h));
            this.client.emit(client_events_1.ChatParticipantsChanged, chat);
        });
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map