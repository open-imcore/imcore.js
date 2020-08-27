import { BaseManager } from "./BaseManager";
import { Chat } from "../structures/Chat";
import { Client } from "../client/client";
import { ChatRepresentation } from "../types";

export class ChatManager extends BaseManager<Chat, ChatRepresentation> {
    constructor(client: Client) {
        super(client, Chat, "groupID");
    }

    async hardResolve(groupID: string): Promise<Chat> {
      return this.resolve(groupID) || await this.add(await this.client.rest.getChat(groupID));
    }

    // fetch(id: string): Promise<Chat> {
    //     throw new Error("Method not implemented.");
    // }
    // create(using: Chat): Promise<Chat> {
    //     throw new Error("Method not implemented.");
    // }
}
