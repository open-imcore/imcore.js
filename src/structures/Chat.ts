import {
//   ChatPropertyListRepresentation,
//   ChatRepresentation,
  FuzzyHandle
} from '../types';
import { Base } from "./Base";
import { Handle } from "./Handle";
import { Util } from "../Util";
import { Message } from "./Message";
// import { MessageOptions } from "../client/rest/client";
import { MessageReceived } from '..';
import { IMCoreEvent } from '../client/client-events';
import Collection from "@discordjs/collection";
import { IMService } from "../Constants";
import { ChatPropertyListRepresentation, ChatRepresentation } from "imcore-ajax-core";
import { MessageOptions } from "imcore-ajax-core/dist/rest/chat-client";

export enum ChatJoinState {
    removed = 0,
    unknown = 1,
    unknown1 = 2,
    joined = 3
}

export enum ChatStyle {
  group = 43,
  single = 45
}

export class Chat extends Base<ChatRepresentation> implements Omit<ChatRepresentation, "participants"> {
    joinState: ChatJoinState;
    roomName?: string;
    displayName?: string;
    id: string;
    participantIDs: string[];
    unreadMessageCount?: number;
    messageFailureCount?: number;
    service: IMService;
    lastMessage?: string;
    lastMessageTime: number;
    style: ChatStyle;
    readReceipts: boolean;
    ignoreAlerts: boolean;

    toString(): string {
        return `Chat[id: ${this.id}; joinState: ${this.joinState}; roomName: ${this.roomName}; displayName: ${this.displayName}; participants: [${this.participantIDs.join(', ')}]; unreadMessageCount: ${this.unreadMessageCount}; messageFailureCount: ${this.messageFailureCount}; service: ${this.service}; lastMessage: ${this.lastMessage}; lastMessageTime: ${this.lastMessageTime}; style: ${this.style};]`
    }
    
    get messages(): Collection<string, Message> {
        return this.client.messages.getAllForChat(this);
    }

    get prettyName(): string {
        if (this.displayName) return this.displayName;

        const participants = this.participants;
        if (participants.length === 1) return participants[0].name;
        return participants.map(p => p.shortName).join(', ');
    }

    get participants(): Handle[] {
        return this.participantIDs.map(id => this.client.handles.resolve(id));
    }

    set participants(participants: Handle[]) {
        this.participantIDs = participants.map(p => p.id);
    }

    /**
     * Updates the properties of this chat
     * @param properties properties to apply
     */
    async updateProperties(properties: Partial<ChatPropertyListRepresentation>): Promise<this> {
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
    async markAllMessagesAsRead(): Promise<void> {
        await this.client.rest.chats.readAllMessages(this.id);
    }

    /**
     * Refreshes the participants and returns an updated array of handles
     */
    async refreshParticipants(): Promise<Handle[]> {
        this.participantIDs = await this.rest.chats.fetchParticipants(this.id);

        return this.participants;
    }

    /**
     * Refreshes the object with the latest record from the API
     */
    async refresh(): Promise<this> {
        return this._patch(await this.rest.chats.fetchOne(this.id));
    }

    /**
     * Rejoin a chat. Doesn't work well.
     */
    async join(): Promise<Chat> {
        return this._patch(await this.rest.chats.join(this.id));
    }

    /**
     * Rename the chat
     * @param name new name to assign
     */
    async rename(name: string | null): Promise<Chat> {
        return this._patch(await this.rest.chats.rename(this.id, name));
    }

    /**
     * Deletes the current chat
     */
    async delete(): Promise<Chat> {
        return this._patch(await this.rest.chats.deleteChat(this.id));
    }

    /**
     * Loads messages before a given ID
     * @param before id to mark as the start
     * @param limit number of messages to load
     */
    async loadMessages(before?: string, limit: number = 50): Promise<Message[]> {
        const rawMessages = await this.rest.chats.fetchRecentMessages(this.id, {
            before,
            limit
        });

        return await Promise.all(rawMessages.map(message => this.client.messages.add(message))).then(messages => {
          this.client.emit(IMCoreEvent.historyLoaded, messages);
          return messages;
        });
    }

    /**
     * Send a message with the given parameters
     * @param options message options
     */
    async sendMessage(options: MessageOptions): Promise<Message[]> {
        const representations = await this.rest.chats.sendMessage(this.id, options);

        return await Promise.all(representations.map(r => this.client.messages.add(r))).then(messages => {
          messages.forEach(message => this.client.emit(MessageReceived, message));
          return messages;
        });
    }

    /**
     * Send a text message
     * @param text text to send
     */
    async sendText(text: string): Promise<Message[]> {
        return this.sendMessage({
            parts: [
                {
                    type: "text",
                    details: text
                }
            ]
        })
    }

    /**
     * Add an array of participants to this group chat.
     * @param participants participants to add
     */
    async addParticipants(participants: FuzzyHandle[]): Promise<this> {
        return this.toggleParticipants(participants, "put")
    }

    /**
     * Remove an array of participants from this group chat.
     * @param participants participants to remove
     */
    async removeParticipants(participants: FuzzyHandle[]): Promise<this> {
        return this.toggleParticipants(participants, "delete")
    }

    private async toggleParticipants(participants: FuzzyHandle[], mode: "put" | "delete"): Promise<this> {
        const handles = participants.map(handle => Util.resolveHandle(handle)).filter(h => h) as string[]

        this.participantIDs = await this.rest[mode === "put" ? "addChatParticipants" : "removeChatParticipants"](this.id, handles);

        return this;
    }

    _patch_configuration({ readReceipts, ignoreAlerts }: ChatPropertyListRepresentation): this {
        this.readReceipts = readReceipts;
        this.ignoreAlerts = ignoreAlerts;

        return this;
    }

    _patch({ joinState, roomName, displayName, id, participants, unreadMessageCount, messageFailureCount, service, lastMessageTime, lastMessage, style, ignoreAlerts, readReceipts }: ChatRepresentation): this {
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
