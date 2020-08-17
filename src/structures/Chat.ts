import { ChatRepresentation, FuzzyHandle } from "../types";
import { Base } from "./Base";
import { Handle } from "./Handle";
import { Util } from "../Util";
import { Message } from "./Message";
import { MessageOptions } from "../client/rest/client";

export enum ChatJoinState {
    removed = 0,
    unknown = 1,
    unknown1 = 2,
    joined = 3
}

export class Chat extends Base<ChatRepresentation> implements Omit<ChatRepresentation, "participants"> {
    joinState: number;
    roomName?: string;
    displayName?: string;
    groupID: string;
    participantIDs: string[];
    lastAddressedHandleID?: string;
    unreadMessageCount?: number;
    messageFailureCount?: number;
    service?: string;
    lastMessage?: string;
    lastMessageTime: number;
    style: number;

    toString(): string {
        return `Chat[groupID: ${this.groupID}; joinState: ${this.joinState}; roomName: ${this.roomName}; displayName: ${this.displayName}; participants: [${this.participantIDs.join(', ')}]; lastAddressedHandleID: ${this.lastAddressedHandleID}; unreadMessageCount: ${this.unreadMessageCount}; messageFailureCount: ${this.messageFailureCount}; service: ${this.service}; lastMessage: ${this.lastMessage}; lastMessageTime: ${this.lastMessageTime}; style: ${this.style};]`
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
     * Refreshes the participants and returns an updated array of handles
     */
    async refreshParticipants(): Promise<Handle[]> {
        this.participantIDs = await this.rest.chatParticipants(this.groupID);

        return this.participants;
    }

    /**
     * Refreshes the object with the latest record from the API
     */
    async refresh(): Promise<this> {
        return this._patch(await this.rest.getChat(this.groupID));
    }

    /**
     * Rejoin a chat. Doesn't work well.
     */
    async join(): Promise<Chat> {
        return this._patch(await this.rest.joinChat(this.groupID));
    }

    /**
     * Rename the chat
     * @param name new name to assign
     */
    async rename(name: string): Promise<Chat> {
        return this._patch(await this.rest.renameChat(this.groupID, name));
    }

    /**
     * Deletes the current chat
     */
    async delete(): Promise<Chat> {
        return this._patch(await this.rest.deleteChat(this.groupID));
    }

    /**
     * Loads messages before a given GUID
     * @param before guid to mark as the start
     * @param limit number of messages to load
     */
    async loadMessages(before?: string, limit: number = 50): Promise<Message[]> {
        const rawMessages = await this.rest.getMessages(this.groupID, {
            before,
            limit
        });

        return rawMessages.map(message => this.client.messages.add(message));
    }

    /**
     * Send a message with the given parameters
     * @param options message options
     */
    async sendMessage(options: MessageOptions): Promise<Message[]> {
        const representations = await this.rest.sendMessage(this.groupID, options);

        return representations.map(r => this.client.messages.add(r));
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

        this.participantIDs = await this.rest[mode === "put" ? "addChatParticipants" : "removeChatParticipants"](this.groupID, handles);

        return this;
    }

    _patch({ joinState, roomName, displayName, groupID, participants, lastAddressedHandleID, unreadMessageCount, messageFailureCount, service, lastMessageTime, lastMessage, style }: ChatRepresentation): this {
        this.joinState = joinState;
        this.roomName = roomName;
        this.displayName = displayName;
        this.groupID = groupID;
        this.participantIDs = participants;
        this.lastAddressedHandleID = lastAddressedHandleID;
        this.unreadMessageCount = unreadMessageCount;
        this.messageFailureCount = messageFailureCount;
        this.service = service;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.style = style;

        return this;
    }
}