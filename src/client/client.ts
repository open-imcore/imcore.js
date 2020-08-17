import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { EventEmitter } from "events";
import { ChatManager } from "../managers/ChatManager";
import { ContactsManager } from "../managers/ContactsManager";
import { HandleManager } from "../managers/HandleManager";
import { MessageManager } from "../managers/MessageManager";
import { Contact } from "../structures/Contact";
import { SearchResult, AttachmentRepresentation } from "../types";
import { DefaultOptions } from "../util/Constants";
import { IMCoreEvent, IMCoreEventMap } from "./client-events";
import { EventHandler } from "./websocket/EventHandler";
import { WebSocketManager } from "./websocket/manager";
import { Message } from "../structures/Message";
import { HTTPClient, MessageDeletionOptions, ChatCreationOptions } from "./rest/client";
import { Handle } from "../structures/Handle";
import { Chat } from "../structures/Chat";

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
    private socket = new WebSocketManager(this.options.gateway);
    protected handler = new EventHandler(this, this.socket, () => this.emit("ready"));
    public rest: HTTPClient;

    public constructor(public options: ClientOptions = DefaultOptions) {
        super();

        this.rest = new HTTPClient(options);

        this.on("ready", () => {
            (this as any).ready = true;
        });
    }

    /**
     * Load a message with the given GUID
     * @param guid message to load
     */
    public async message(guid: string): Promise<Message> {
        const message = await this.rest.getMessage(guid);

        return this.messages.add(message);
    }

    public async deleteMessages(options: MessageDeletionOptions[]): Promise<void> {
        await this.rest.deleteMessages(options);
    }

    /**
     * Search the database for messages using a given query
     * @param query query string
     * @param limit maximum number of results
     */
    public async searchMessages(query?: string, limit: number = 20): Promise<SearchResult[]> {
        return this.rest.searchMessages({ query, limit });
    }

    /**
     * Search the database for contacts using a given query
     * @param search query string
     * @param limit maximum number of results
     */
    public async searchContacts(search?: string, limit?: number): Promise<Contact[]> {
        const results = await this.rest.getContacts({
            search,
            limit
        });

        results.strangers.forEach(handle => this.handles.add(handle));
        
        return results.contacts.map(contact => this.contacts.add(contact));
    }

    /**
     * Gets an array of blocked handles
     */
    public async blockedHandles(): Promise<Handle[]> {
        const handleIDs = await this.rest.getBlocklist();
        
        return handleIDs.map(handle => this.handles.resolve(handle)).filter(h => h);
    }

    /**
     * Gets an array of chats sorted by the most recently updated
     * @param limit maximum number of results
     */
    public async getChats(limit?: number): Promise<Chat[]> {
        const chats = await this.rest.getChats(limit);

        return chats.map(c => this.chats.add(c));
    }

    /**
     * Creates a chat with the given options
     * @param options options to use when creating the chat
     */
    public async createChat(options: ChatCreationOptions): Promise<Chat> {
        return this.chats.add(await this.rest.createChat(options));
    }

    /**
     * Uploads a file to the server and returns its new record
     * @param attachment attachment to upload
     */
    public async upload(attachment: Parameters<this["rest"]["upload"]>[0]): Promise<AttachmentRepresentation> {
        return this.rest.upload(attachment);
    }

    /**
     * Connect to the event API
     */
    public connect() {
        this.socket.connect();
    }

    /**
     * Resolve a contact for a given handle
     * @param handleID handle to resolve
     */
    public contactForHandleID(handleID: string): Contact | null {
        return this.contacts.contactWithHandle(handleID);
    }
}