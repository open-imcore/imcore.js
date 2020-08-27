import { PatchedAxios, ClientOptions } from "../client";
import { DefaultOptions, ChatItemType } from "../../util/Constants";
import Axios from "axios";
import { RatelimitResponseInterceptor } from "./ratelimit";
import {
  attachments,
  message,
  chats,
  chat,
  chatName,
  chatJoin,
  chatParticipants,
  chatMessages,
  associatedMessages,
  messages,
  handleBlocks,
  handleBlock,
  searchMessages,
  contacts,
  contact,
  attachment,
  chatTyping, chatRead, chatProperties, resource,
} from './endpoints';
import {
  AttachmentRepresentation,
  MessageRepresentation,
  ChatRepresentation,
  SearchResult,
  BulkContactRepresentation,
  ContactRepresentation,
  ChatItem,
  ChatConfigurationRepresentation, ChatPropertyListRepresentation, ResourceMode,
} from '../../types';

type XHR = typeof XMLHttpRequest;

export interface ChatCreationOptions {
    participants: string[];
}

export interface MessagePartOptions {
    type: "text" | "attachment";
    details: string;
}

export interface MessageOptions {
    subject?: string;
    parts: MessagePartOptions[];
    isAudioMessage?: boolean;
    flags?: number;
    balloonBundleID?: string;
    payloadData?: string;
    expressiveSendStyleID?: string;
}

export interface MessageDeletionOptions {
    guid: string;
    parts: number[];
}

export interface MessageSearchOptions {
    query?: string;
    limit?: number;
}

export interface ContactSearchOptions {
    search?: string;
    limit?: number;
}

export class HTTPClient {
    protected axios: PatchedAxios;

    constructor(protected options: ClientOptions = DefaultOptions) {
        this.axios = Axios.create({
            baseURL: options.apiHost
        });

        new RatelimitResponseInterceptor(this.axios).register(this.axios);
    }

    /**
     * Resolves the URL of a resource with the given identifier
     * @param identifier identifier to resolve
     */
    public resourceURL(identifier: string): string {
        return `${this.options.apiHost}${resource(identifier)}`;
    }

    /**
     * Resolves the URL of an attachment with the given GUID
     * @param guid GUID of the URL to resolve
     */
    public attachmentURL(guid: string): string {
        return `${this.options.apiHost}${attachment(guid)}`
    }

    /**
     * Resolves the URL of the contact photo with the given contact ID
     * @param contactID contactID of the URL to resolve
     */
    public contactPhotoURL(contactID: string): string {
        return `${this.options.apiHost}${contact(contactID)}/photo`
    }

    public async getResourceMode(): Promise<ResourceMode> {
        const { data: { mode } } = await this.get(resource("mode"));

        return mode;
    }

    /**
     * Get a contact with the given ID
     * @param contactID ID to resolve
     */
    public async getContact(contactID: string): Promise<ContactRepresentation> {
        const { data: contactRepresentation } = await this.get(contact(contactID));

        return contactRepresentation;
    }

    /**
     * Gets contacts meeting the given criteria
     * @param search search criteria
     */
    public async getContacts(options: ContactSearchOptions = {}): Promise<BulkContactRepresentation> {
        const { data: results } = await this.get(contacts, {
            params: options
        });

        return results;
    }

    /**
     * Searches for messages meeting the criteria and returns them, sorted by the time they were sent
     * @param options search criteria to apply
     */
    public async searchMessages(options: MessageSearchOptions = {}): Promise<SearchResult[]> {
        const { data: { results } } = await this.get(searchMessages, {
            params: options
        });

        return results;
    }

    /**
     * Removes a handle ID from the blocklist, returning the updated blocklist
     * @param handle handle ID to unblock
     */
    public async unblock(handle: string): Promise<string[]> {
        const { data: { handles } } = await this.delete(handleBlock(handle));

        return handles;
    }

    /**
     * Adds a handle ID to the blocklist, returning the updated blocklist
     * @param handle handle to block
     */
    public async block(handle: string): Promise<string[]> {
        const { data: { handles } } = await this.put(handleBlock(handle));

        return handles;
    }

    /**
     * Gets an array of blocked handle IDs
     */
    public async getBlocklist(): Promise<string[]> {
        const { data: { handles } } = await this.get(handleBlocks);

        return handles;
    }

    /**
     * Loads a message record from the API
     * @param guid message GUID
     */
    public async getMessage(guid: string): Promise<MessageRepresentation> {
        const { data: messageRepresentation } = await this.get(message(guid));

        return messageRepresentation;
    }

    /**
     * Loads a set of message GUIDs from the API
     * @param guids message GUIDs to load
     */
    public async bulkGetMessages(guids: string[]): Promise<MessageRepresentation[]> {
        if (guids.length === 0) return [];

        const { data: { messages: representations } } = await this.get(messages, {
            params: {
                guids: guids.join(",")
            }
        });

        return representations;
    }

    /**
     * Deletes a variable number of messages. If no parts are specified, the entire message is deleted.
     * @param options messages to delete
     */
    public async deleteMessages(options: MessageDeletionOptions[]): Promise<void> {
        await this.delete(messages, {
            messages: options
        });
    }

    /**
     * Send an associated message for a given item
     * @param guid guid of the item to associate
     * @param type association type
     */
    public async sendAssociatedMessage(guid: string, messageGUID: string, type: number): Promise<MessageRepresentation> {
        const { data: message } = await this.post(associatedMessages, {
            type,
            message: messageGUID,
            item: guid
        })

        return message
    }

    /**
     * Gets all associated messages for a given item GUID
     * @param guid item GUID to query
     */
    public async getAssociatedMessages(guid: string): Promise<MessageRepresentation[]> {
        const { data: { messages } } = await this.get(associatedMessages, {
            params: {
                item: guid
            }
        });

        return messages;
    }

    /**
     * Gets an array of messages for a chat with the given criteria
     * @param groupID groupID of the chat to query messages from
     * @param params parameters to apply when querying for messages
     */
    public async getMessages(groupID: string, params: { before?: string, limit?: number }): Promise<MessageRepresentation[]> {
        const { data: { items } } = await this.get(chatMessages(groupID), {
            params
        }) as { data: { items: ChatItem<ChatItemType.message>[] }}

        return items.map(({ payload }) => payload);
    }

    /**
     * Sends a message to a given chat, returning the created message records from the request
     * @param groupID groupID of the chat to send a message in
     * @param options options to use when crafting the message
     */
    public async sendMessage(groupID: string, options: MessageOptions): Promise<MessageRepresentation[]> {
        const { data: { messages } } = await this.post(chatMessages(groupID), options);

        return messages;
    }

    /**
     * Returns an array of handle IDs for a given chat record
     * @param groupID groupID of the chat record to query
     */
    public async chatParticipants(groupID: string): Promise<string[]> {
        const { data: handles } = await this.get(chatParticipants(groupID));

        return handles;
    }

    /**
     * Removes an array of handle IDs from a chat record, returning the updated array of participants
     * @param groupID groupID of the chat to remove participants from
     * @param participants participants to remove
     */
    public async removeChatParticipants(groupID: string, participants: string[]): Promise<string[]> {
        const { data: { handles } } = await this.delete(chatParticipants(groupID), {
            handles: participants
        });

        return handles;
    }

    /**
     * Adds an array of handle IDs to a chat record, returning the updated array of participants
     * @param groupID groupID of the chat to add participants to
     * @param participants participants to add to the chat
     */
    public async addChatParticipants(groupID: string, participants: string[]): Promise<string[]> {
        const { data: { handles } } = await this.put(chatParticipants(groupID), {
            handles: participants
        });

        return handles;
    }

    /**
     * Re-join a group chat, returning the updated chat
     * @param groupID groupID of the chat to re-join
     */
    public async joinChat(groupID: string): Promise<ChatRepresentation> {
        const { data: chatRepresentation } = await this.get(chatJoin(groupID));

        return chatRepresentation;
    }

    /**
     * Gets a chat record from the API
     * @param groupID groupID of the chat to retrieve
     */
    public async getChat(groupID: string): Promise<ChatRepresentation> {
        const { data: chatRepresentation } = await this.get(chat(groupID));

        return chatRepresentation;
    }

    /**
     * Marks all messages as read in a chat
     * @param groupID groupID of the chat to mark as read
     */
    public async readAllMessages(groupID: string): Promise<void> {
        await this.post(chatRead(groupID));
    }

    /**
     * Gets the latest properties for a chat
     * @param groupID groupID of the chat to query
     */
    public async getProperties(groupID: string): Promise<ChatConfigurationRepresentation> {
        const { data: properties } = await this.get(chatProperties(groupID));

        return properties;
    }

    /**
     * Edits the properties of a given chat
     * @param groupID groupID of the chat to mutate
     * @param properties properties to apply
     */
    public async editProperties(groupID: string, properties: Partial<ChatPropertyListRepresentation>): Promise<ChatConfigurationRepresentation> {
        const { data: newProperties } = await this.patch(chatProperties(groupID), properties);

        return newProperties;
    }

    /**
     * Sets whether or not the user is composing
     * @param groupID
     * @param isTyping
     */
    public async setTyping(groupID: string, isTyping: boolean): Promise<void> {
        await this[isTyping ? "post" : "delete"](chatTyping(groupID));
    }

    /**
     * Renames a chat record, returning the updated chat
     * @param groupID groupID of the chat to update
     * @param name new name for the chat
     */
    public async renameChat(groupID: string, name: string | null): Promise<ChatRepresentation> {
        const { data: chatRepresentation } = await this.patch(chatName(groupID), { name });

        return chatRepresentation;
    }

    /**
     * Deletes a chat record from the API, returning the deleted chat
     *
     * @param groupID the group ID of the chat to delete
     */
    public async deleteChat(groupID: string): Promise<ChatRepresentation> {
        const { data: chatRepresentation } = await this.delete(chat(groupID));

        return chatRepresentation;
    }

    /**
     * Gets chat records from the API, starting with the most recent.
     * @param limit max number of chats to retrieve
     */
    public async getChats(limit?: number): Promise<ChatRepresentation[]> {
        const { data: { chatRepresentations } } = await this.get(chats, {
            params: {
                limit
            }
        });

        return chatRepresentations;
    }

    /**
     * Inserts a chat record and returns it
     * @param options chat to create
     */
    public async createChat(options: ChatCreationOptions): Promise<ChatRepresentation> {
        const { data: chatRepresentation } = await this.post(chats, options);

        return chatRepresentation;
    }

    /**
     * Upload a file to the API
     * @param attachment file data
     */
    public async upload(attachment: Buffer | Uint8Array | ArrayBuffer): Promise<AttachmentRepresentation> {
        if (typeof XMLHttpRequest === "undefined") {
            var { XMLHttpRequest }: { XMLHttpRequest: XHR } = await import("xmlhttprequest");
        }

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("POST", `${this.options.apiHost}${attachments}`, true);
            request.setRequestHeader("Content-Type", "application/octet-stream");
            request.send(attachment);

            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }

            request.onerror = reject;
        });
    }

    protected get get() {
        return this.axios.get;
    }

    protected get patch() {
        return this.axios.patch;
    }

    protected get delete() {
        return this.axios.delete;
    }

    protected get post() {
        return this.axios.post;
    }

    protected get put() {
        return this.axios.put;
    }
}
