import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { Contact } from "../structures/Contact";
import { ContactsManager } from "../managers/ContactsManager";
import { MessageManager } from "../managers/MessageManager";
import { HandleManager } from "../managers/HandleManager";
import { ChatManager } from "../managers/ChatManager";
import { EventEmitter } from "events";
import { DefaultOptions } from "../util/Constants";
import { WebSocketManager } from "./websocket/manager";
import { IMCoreEvent, IMCoreEventMap } from "./client-events";
import { EventHandler } from "./websocket/EventHandler";
import { RatelimitResponseInterceptor } from "./rest/ratelimit";
import { SearchResult } from "../types";
import { searchMessages } from "./rest/endpoints";

const { Axios } = require('axios');
Axios.prototype.delete = function(url, data, config) {
    return this.request(Object.assign({}, config || {}, {
        method: "delete",
        url: url,
        data: data
    }))
}

declare interface PatchedAxios extends AxiosInstance {
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
    public http: PatchedAxios = axios.create({
        baseURL: this.options.apiHost
    })

    public constructor(public options: ClientOptions = DefaultOptions) {
        super();
        
        new RatelimitResponseInterceptor(this.http).register(this.http);

        this.on("ready", () => {
            (this as any).ready = true;
        });
    }

    /**
     * Search the database using a given query
     * @param query query string
     * @param limit maximum number of results
     */
    public async search(query: string, limit: number = 20): Promise<SearchResult[]> {
        const { results } = await this.http.get(searchMessages, {
            params: {
                query,
                limit
            }
        }) as { results: SearchResult[] };

        return results;
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