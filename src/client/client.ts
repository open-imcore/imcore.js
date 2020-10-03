import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { EventEmitter } from "events";
import { ChatManager } from "../managers/ChatManager";
import { ContactsManager } from "../managers/ContactsManager";
import { HandleManager } from "../managers/HandleManager";
import { MessageManager } from "../managers/MessageManager";
import { Contact } from "../structures/Contact";
import { DefaultOptions } from "../util/Constants";
import { IMCoreEvent, IMCoreEventMap } from "./client-events";
import { EventHandler } from "./websocket/EventHandler";
import { AttachmentRepresentation, ContactSearchParameters, IMHTTPClient, IMWebSocketClient, MessageRepresentation, MessageSearchParameters } from "imcore-ajax-core";
import { Message } from "../structures/Message";
import { Handle } from "../structures/Handle";
import { Chat } from "../structures/Chat";
import { MessageDeletionOptions } from "imcore-ajax-core/dist/rest/message-client";
import { ChatCreationOptions } from "imcore-ajax-core/dist/rest/chat-client";

const { Axios } = require('axios');
Axios.prototype.delete = function (url, data, config) {
    return this.request(Object.assign({}, config || {}, {
        method: "delete",
        url: url,
        data: data
    }))
}

export declare interface PatchedAxios extends AxiosInstance {
    delete<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
}

export interface ClientOptions {
    apiHost: string;
    gateway: string;
    token?: string;
    preloadChat?: string;
}

export declare interface Client {
    on<T extends IMCoreEvent>(event: T, listener: (item: IMCoreEventMap[T]) => any): this;
    on(event: string, listener: Function): this;
}

export class Client extends EventEmitter {
    public handles: HandleManager = new HandleManager(this);
    public contacts: ContactsManager = new ContactsManager(this);
    public messages: MessageManager = new MessageManager(this);
    public chats: ChatManager = new ChatManager(this);
    public blockedHandleIDs: string[] = [];
    public readonly ready = false;
    public rest: IMHTTPClient;
    public handler: EventHandler;

    #socket: IMWebSocketClient;

    public constructor(private options: ClientOptions = DefaultOptions) {
        super();

        this.rest = new IMHTTPClient({
            baseURL: options.apiHost,
            token: options.token
        });

        this.socket = new IMWebSocketClient(options.gateway, options.token);

        this.on("ready", () => {
            (this as any).ready = true;
        });
    }
    
    public get token(): string | undefined {
        return this.options.token;
    }

    public set token(newValue) {
        this.options.token = newValue;
        if (this.socket) {
            this.socket["token" as any] = newValue;
        }
    }

    public get socket(): IMWebSocketClient {
        return this.#socket;
    }

    public set socket(newValue) {
        this.#socket = newValue;
        this.handler = new EventHandler(this, this.socket, () => this.emit("ready"));
    }

    /**
     * Lazily resolve a chat
     * @param chatID id of the chat to load
     */
    public async chat(chatID: string): Promise<Chat> {
        return this.chats.resolve(chatID) || this.chats.add(await this.rest.chats.fetchOne(chatID));
    }

    /**
     * Load a message with the given ID
     * @param id message ID to load
     */
    public async message(id: string): Promise<Message> {
        const message = await this.rest.messages.fetchOne(id);

        return this.messages.add(message);
    }

    /**
     * Deletes messages matching the provided parameters
     * @param options deletion parameters
     */
    public async deleteMessages(options: MessageDeletionOptions[]): Promise<void> {
        await this.rest.messages.deleteMessage(options);
    }

    /**
     * Search the database for messages using a given query
     * @param query query string
     * @param limit maximum number of results
     */
    public async searchMessages(parameters: MessageSearchParameters): Promise<Message[]> {
        return this.rest.messages.search.single(parameters).then(messages => this.bulkIntakeMessages(messages));
    }

    /**
     * Search the database for contacts using a given query
     * @param search query string
     * @param limit maximum number of results
     */
    public async searchContacts(parameters: ContactSearchParameters): Promise<Contact[]> {
        const results = await this.rest.contacts.search.single(parameters);


        return Promise.all(results.map(contact => this.contacts.add(contact)));
    }

    /**
     * Gets an array of blocked handles
     */
    public async blockedHandles(): Promise<Handle[]> {
        const handleIDs = await this.rest.handles.fetchBlocked();

        return handleIDs.map(handle => this.handles.resolve(handle)).filter(h => h);
    }

    /**
     * Gets an array of chats sorted by the most recently updated
     * @param limit maximum number of results
     */
    public async getChats(limit?: number): Promise<Chat[]> {
        const chats = await this.rest.chats.fetchAll(limit);

        return Promise.all(chats.map(c => this.chats.add(c)));
    }

    /**
     * Creates a chat with the given options
     * @param options options to use when creating the chat
     */
    public async createChat(options: ChatCreationOptions): Promise<Chat> {
        return this.chats.add(await this.rest.chats.create(options));
    }

    /**
     * Uploads a file to the server and returns its new record
     * @param attachment attachment to upload
     */
    public async upload(attachment: Parameters<this["rest"]["attachments"]["create"]>[0], mime: Parameters<this["rest"]["attachments"]["create"]>[1]): Promise<AttachmentRepresentation> {
        return this.rest.attachments.create(attachment, mime);
    }

    /**
     * Connect to the event API
     */
    public connect(preload?: string) {
        this.socket.connect(preload);
    }

    /**
     * Resolve a contact for a given handle
     * @param handleID handle to resolve
     */
    public contactForHandleID(handleID: string): Contact | null {
        return this.contacts.contactWithHandle(handleID);
    }

    /**
     * Takes an array of message representations and batch processes them
     * @param messages message representations
     */
    private async bulkIntakeMessages(messages: MessageRepresentation[]): Promise<Message[]> {
        const batch = await Promise.all(messages.map(message => this.messages.batchAdd(message)));

        return this.messages.resolveBatchResults(batch);
    }
}
