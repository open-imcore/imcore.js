import { ChatItemRepresentation } from "../types";
import { Base } from "./Base";
import { Client } from "../client/client";
import { Message } from "./Message";

export enum TapbackStyle {
    heart = 2000,
    thumbsUp = 2001,
    thumbsDown = 2002,
    haha = 2003,
    exclamation = 2004,
    question = 2005,
    revokeHeart = 3000,
    revokeThumbsUp = 3001,
    revokeThumbsDown = 3002,
    revokeHaha = 3003,
    revokeExclamation = 3004,
    revokeQuestion = 3005
}

export class ChatItem<T extends ChatItemRepresentation = ChatItemRepresentation> extends Base<T> implements ChatItemRepresentation {
    constructor(client: Client, data: T) {
        super(client, data)
    }

    toString() {
        return this.constructor.name;
    }

    /**
     * Send an associated message with the given style
     * @param style association style
     */
    async sendAssociatedMessage(style: TapbackStyle) {
        await this.rest.sendAssociatedMessage(this.guid, style);
    }

    /**
     * Load all associated messages for the item
     */
    async associatedMessages(): Promise<Message[]> {
        const associatedRepresentations = await this.rest.getAssociatedMessages(this.guid);

        return associatedRepresentations.map(message => this.client.messages.add(message));
    }

    _patch({ guid, chatGroupID, fromMe, time }: ChatItemRepresentation) {
        this.guid = guid;
        this.chatGroupID = chatGroupID
        this.fromMe = fromMe;
        this.time = time;

        return this;
    }

    guid: string;
    chatGroupID: string;
    fromMe: boolean;
    time: number;

    get date() {
        return new Date(this.time);
    }

    get chat() {
        return this.client.chats.resolve(this.chatGroupID);
    }
}