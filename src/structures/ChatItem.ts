import { ChatItemRepresentation, TapbackRepresentation } from "../types";
import { Base } from "./Base";
import { Client } from "../client/client";
import { chatMessageTapbacks } from "../client/rest/endpoints";
import { Tapback } from "./Tapback";

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
    constructor(client: Client, data: T, public messageGUID: string, public part: number) {
        super(client, data)
    }

    /**
     * Send a tapback with the given style
     * @param style tapback style
     */
    async tapback(style: TapbackStyle) {
        await this.post(chatMessageTapbacks(this.chatGUID, this.messageGUID), undefined, {
            params: {
                part: this.part,
                type: style
            }
        })
    }

    /**
     * Load all tapbacks for the item
     */
    async tapbacks(): Promise<Tapback[]> {
        const { representations: rawTapbacks } = await this.get(chatMessageTapbacks(this.chatGUID, this.messageGUID), {
            params: {
                part: this.part
            }
        }) as { representations: TapbackRepresentation[] }

        return rawTapbacks.map(t => new Tapback(this.client, t));
    }

    _patch({ guid, chatGUID, fromMe, time }: ChatItemRepresentation) {
        this.guid = guid;
        this.chatGUID = chatGUID;
        this.fromMe = fromMe;
        this.time = time;

        return this;
    }

    guid: string;
    chatGUID: string;
    fromMe: boolean;
    time: number;

    get date() {
        return new Date(this.time);
    }

    get chat() {
        return this.client.chats.resolve(this.chatGUID);
    }
}