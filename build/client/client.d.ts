/// <reference types="node" />
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { EventEmitter } from "events";
import { ChatManager } from "../managers/ChatManager";
import { ContactsManager } from "../managers/ContactsManager";
import { HandleManager } from "../managers/HandleManager";
import { MessageManager } from "../managers/MessageManager";
import { Contact } from "../structures/Contact";
import { IMCoreEvent, IMCoreEventMap } from "./client-events";
import { EventHandler } from "./websocket/EventHandler";
import { AttachmentRepresentation, ContactSearchParameters, IMHTTPClient, IMWebSocketClient, MessageSearchParameters } from "imcore-ajax-core";
import { Message } from "../structures/Message";
import { Handle } from "../structures/Handle";
import { Chat } from "../structures/Chat";
import { MessageDeletionOptions } from "imcore-ajax-core/dist/rest/message-client";
import { ChatCreationOptions } from "imcore-ajax-core/dist/rest/chat-client";
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
export declare class Client extends EventEmitter {
    #private;
    private options;
    handles: HandleManager;
    contacts: ContactsManager;
    messages: MessageManager;
    chats: ChatManager;
    blockedHandleIDs: string[];
    readonly ready = false;
    rest: IMHTTPClient;
    handler: EventHandler;
    constructor(options?: ClientOptions);
    get token(): string | undefined;
    set token(newValue: string | undefined);
    get socket(): IMWebSocketClient;
    set socket(newValue: IMWebSocketClient);
    /**
     * Lazily resolve a chat
     * @param chatID id of the chat to load
     */
    chat(chatID: string): Promise<Chat>;
    /**
     * Load a message with the given ID
     * @param id message ID to load
     */
    message(id: string): Promise<Message>;
    /**
     * Deletes messages matching the provided parameters
     * @param options deletion parameters
     */
    deleteMessages(options: MessageDeletionOptions[]): Promise<void>;
    /**
     * Search the database for messages using a given query
     * @param query query string
     * @param limit maximum number of results
     */
    searchMessages(parameters: MessageSearchParameters): Promise<Message[]>;
    /**
     * Search the database for contacts using a given query
     * @param search query string
     * @param limit maximum number of results
     */
    searchContacts(parameters: ContactSearchParameters): Promise<Contact[]>;
    /**
     * Gets an array of blocked handles
     */
    blockedHandles(): Promise<Handle[]>;
    /**
     * Gets an array of chats sorted by the most recently updated
     * @param limit maximum number of results
     */
    getChats(limit?: number): Promise<Chat[]>;
    /**
     * Creates a chat with the given options
     * @param options options to use when creating the chat
     */
    createChat(options: ChatCreationOptions): Promise<Chat>;
    /**
     * Uploads a file to the server and returns its new record
     * @param attachment attachment to upload
     */
    upload(attachment: Parameters<this["rest"]["attachments"]["create"]>[0], mime: Parameters<this["rest"]["attachments"]["create"]>[1]): Promise<AttachmentRepresentation>;
    /**
     * Connect to the event API
     */
    connect(preload?: string): void;
    /**
     * Resolve a contact for a given handle
     * @param handleID handle to resolve
     */
    contactForHandleID(handleID: string): Contact | null;
    /**
     * Takes an array of message representations and batch processes them
     * @param messages message representations
     */
    private bulkIntakeMessages;
}
