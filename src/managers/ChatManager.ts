import { BaseManager } from "./BaseManager";
import { Chat } from "../structures/Chat";
import { Client } from "../client/client";
import { ChatRepresentation } from "imcore-ajax-core";

export class ChatManager extends BaseManager<Chat, ChatRepresentation> {
    constructor(client: Client) {
        super(client, Chat, "id");
    }

    async hardResolve(chatID: string): Promise<Chat> {
      return this.resolve(chatID) || await this.add(await this.client.rest.chats.fetchOne(chatID));
    }

    // fetch(id: string): Promise<Chat> {
    //     throw new Error("Method not implemented.");
    // }
    // create(using: Chat): Promise<Chat> {
    //     throw new Error("Method not implemented.");
    // }
}
