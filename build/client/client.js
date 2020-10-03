"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _socket;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const events_1 = require("events");
const ChatManager_1 = require("../managers/ChatManager");
const ContactsManager_1 = require("../managers/ContactsManager");
const HandleManager_1 = require("../managers/HandleManager");
const MessageManager_1 = require("../managers/MessageManager");
const Constants_1 = require("../util/Constants");
const EventHandler_1 = require("./websocket/EventHandler");
const imcore_ajax_core_1 = require("imcore-ajax-core");
const { Axios } = require('axios');
Axios.prototype.delete = function (url, data, config) {
    return this.request(Object.assign({}, config || {}, {
        method: "delete",
        url: url,
        data: data
    }));
};
class Client extends events_1.EventEmitter {
    constructor(options = Constants_1.DefaultOptions) {
        super();
        this.options = options;
        this.handles = new HandleManager_1.HandleManager(this);
        this.contacts = new ContactsManager_1.ContactsManager(this);
        this.messages = new MessageManager_1.MessageManager(this);
        this.chats = new ChatManager_1.ChatManager(this);
        this.blockedHandleIDs = [];
        this.ready = false;
        _socket.set(this, void 0);
        this.rest = new imcore_ajax_core_1.IMHTTPClient({
            baseURL: options.apiHost,
            token: options.token
        });
        this.socket = new imcore_ajax_core_1.IMWebSocketClient(options.gateway, options.token);
        this.on("ready", () => {
            this.ready = true;
        });
    }
    get token() {
        return this.options.token;
    }
    set token(newValue) {
        this.options.token = newValue;
        if (this.socket) {
            this.socket["token"] = newValue;
        }
    }
    get socket() {
        return __classPrivateFieldGet(this, _socket);
    }
    set socket(newValue) {
        __classPrivateFieldSet(this, _socket, newValue);
        this.handler = new EventHandler_1.EventHandler(this, this.socket, () => this.emit("ready"));
    }
    /**
     * Lazily resolve a chat
     * @param chatID id of the chat to load
     */
    async chat(chatID) {
        return this.chats.resolve(chatID) || this.chats.add(await this.rest.chats.fetchOne(chatID));
    }
    /**
     * Load a message with the given ID
     * @param id message ID to load
     */
    async message(id) {
        const message = await this.rest.messages.fetchOne(id);
        return this.messages.add(message);
    }
    /**
     * Deletes messages matching the provided parameters
     * @param options deletion parameters
     */
    async deleteMessages(options) {
        await this.rest.messages.deleteMessage(options);
    }
    /**
     * Search the database for messages using a given query
     * @param query query string
     * @param limit maximum number of results
     */
    async searchMessages(parameters) {
        return this.rest.messages.search.single(parameters).then(messages => this.bulkIntakeMessages(messages));
    }
    /**
     * Search the database for contacts using a given query
     * @param search query string
     * @param limit maximum number of results
     */
    async searchContacts(parameters) {
        const results = await this.rest.contacts.search.single(parameters);
        return Promise.all(results.map(contact => this.contacts.add(contact)));
    }
    /**
     * Gets an array of blocked handles
     */
    async blockedHandles() {
        const handleIDs = await this.rest.handles.fetchBlocked();
        return handleIDs.map(handle => this.handles.resolve(handle)).filter(h => h);
    }
    /**
     * Gets an array of chats sorted by the most recently updated
     * @param limit maximum number of results
     */
    async getChats(limit) {
        const chats = await this.rest.chats.fetchAll(limit);
        return Promise.all(chats.map(c => this.chats.add(c)));
    }
    /**
     * Creates a chat with the given options
     * @param options options to use when creating the chat
     */
    async createChat(options) {
        return this.chats.add(await this.rest.chats.create(options));
    }
    /**
     * Uploads a file to the server and returns its new record
     * @param attachment attachment to upload
     */
    async upload(attachment, mime) {
        return this.rest.attachments.create(attachment, mime);
    }
    /**
     * Connect to the event API
     */
    connect(preload) {
        this.socket.connect(preload);
    }
    /**
     * Resolve a contact for a given handle
     * @param handleID handle to resolve
     */
    contactForHandleID(handleID) {
        return this.contacts.contactWithHandle(handleID);
    }
    /**
     * Takes an array of message representations and batch processes them
     * @param messages message representations
     */
    async bulkIntakeMessages(messages) {
        const batch = await Promise.all(messages.map(message => this.messages.batchAdd(message)));
        return this.messages.resolveBatchResults(batch);
    }
}
exports.Client = Client;
_socket = new WeakMap();
//# sourceMappingURL=client.js.map