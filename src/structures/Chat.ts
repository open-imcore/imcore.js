import { ChatRepresentation, FuzzyHandle, MessageRepresentation } from "../types";
import { Base } from "./Base";
import { Handle } from "./Handle";
import { chatParticipants, chatMessages, chatJoin, chatName } from "../client/rest/endpoints";
import { Util } from "../Util";
import { Message } from "./Message";

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

export class Chat extends Base<ChatRepresentation> implements Omit<ChatRepresentation, "participants"> {
    guid: string;
    joinState: number;
    roomName?: string;
    displayName?: string;
    groupID?: string;
    participantIDs: string[];
    lastAddressedHandleID?: string;
    unreadMessageCount?: number;
    messageFailureCount?: number;
    service?: string;
    lastMessage?: string;
    lastMessageTime: number;
    style: number;

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
     * Rejoin a chat. Doesn't work well.
     */
    async join(): Promise<Chat> {
        const { data: resolved } = await this.get(chatJoin(this.guid));

        return this._patch(resolved);
    }

    /**
     * Rename the chat
     * @param name new name to assign
     */
    async rename(name: string): Promise<Chat> {
        const { data: resolved } = await this.patch(chatName(this.guid), { name });

        return this._patch(resolved);
    }

    /**
     * Loads messages before a given GUID
     * @param beforeGUID guid to mark as the start
     * @param limit number of messages to load
     */
    async loadMessages(beforeGUID: string, limit: number = 50): Promise<Message[]> {
        const { data: { items: rawMessages } } = await this.get(chatMessages(this.guid), {
            params: {
                before: beforeGUID,
                limit
            }
        }) as { data: { items: MessageRepresentation[] } }

        return rawMessages.map(message => this.client.messages.add(message));
    }

    /**
     * Send a message with the given parameters
     * @param options message options
     */
    async sendMessage(options: MessageOptions): Promise<Message[]> {
        const { data: { messages: representations } }: { data: { messages: MessageRepresentation[] }} = await this.post(chatMessages(this.guid), options);

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

        const { data } = await this[mode](chatParticipants(this.guid), {
            handles
        });

        if (typeof data === "object" && typeof data.handles === "object") {
            this.participantIDs = data.handles;
        }

        return this;
    }

    _patch({ guid, joinState, roomName, displayName, groupID, participants, lastAddressedHandleID, unreadMessageCount, messageFailureCount, service, lastMessageTime, lastMessage, style }: ChatRepresentation): this {
        this.guid = guid;
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