import { FuzzyHandle } from '../types';
import { Base } from "./Base";
import { Handle } from "./Handle";
import { Message } from "./Message";
import Collection from "@discordjs/collection";
import { IMService } from "../Constants";
import { ChatPropertyListRepresentation, ChatRepresentation } from "imcore-ajax-core";
import { MessageOptions } from "imcore-ajax-core/dist/rest/chat-client";
export declare enum ChatJoinState {
    removed = 0,
    unknown = 1,
    unknown1 = 2,
    joined = 3
}
export declare enum ChatStyle {
    group = 43,
    single = 45
}
export declare class Chat extends Base<ChatRepresentation> implements Omit<ChatRepresentation, "participants"> {
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
    toString(): string;
    get messages(): Collection<string, Message>;
    get prettyName(): string;
    get participants(): Handle[];
    set participants(participants: Handle[]);
    /**
     * Updates the properties of this chat
     * @param properties properties to apply
     */
    updateProperties(properties: Partial<ChatPropertyListRepresentation>): Promise<this>;
    /**
     * Sends a typing indicator or cancel typing indicator
     * @param isTyping whether we are typing
     */
    typing(isTyping?: boolean): Promise<void>;
    /**
     * Marks all messages in the chat as read
     */
    markAllMessagesAsRead(): Promise<void>;
    /**
     * Refreshes the participants and returns an updated array of handles
     */
    refreshParticipants(): Promise<Handle[]>;
    /**
     * Refreshes the object with the latest record from the API
     */
    refresh(): Promise<this>;
    /**
     * Rejoin a chat. Doesn't work well.
     */
    join(): Promise<Chat>;
    /**
     * Rename the chat
     * @param name new name to assign
     */
    rename(name: string | null): Promise<Chat>;
    /**
     * Deletes the current chat
     */
    delete(): Promise<Chat>;
    /**
     * Loads messages before a given ID
     * @param before id to mark as the start
     * @param limit number of messages to load
     */
    loadMessages(before?: string, limit?: number): Promise<Message[]>;
    /**
     * Send a message with the given parameters
     * @param options message options
     */
    sendMessage(options: MessageOptions): Promise<Message[]>;
    /**
     * Send a text message
     * @param text text to send
     */
    sendText(text: string): Promise<Message[]>;
    /**
     * Add an array of participants to this group chat.
     * @param participants participants to add
     */
    addParticipants(participants: FuzzyHandle[]): Promise<this>;
    /**
     * Remove an array of participants from this group chat.
     * @param participants participants to remove
     */
    removeParticipants(participants: FuzzyHandle[]): Promise<this>;
    private toggleParticipants;
    _patch_configuration({ readReceipts, ignoreAlerts }: ChatPropertyListRepresentation): this;
    _patch({ joinState, roomName, displayName, id, participants, unreadMessageCount, messageFailureCount, service, lastMessageTime, lastMessage, style, ignoreAlerts, readReceipts }: ChatRepresentation): this;
}
