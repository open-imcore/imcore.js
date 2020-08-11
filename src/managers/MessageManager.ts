import { BaseManager } from "./BaseManager";
import { Message } from "../structures/Message";
import { Client } from "../client/client";
import { MessageRepresentation } from "../types";

export class MessageManager extends BaseManager<Message, MessageRepresentation> {
    constructor(client: Client) {
        super(client, Message, "guid");
    }

    // fetch(id: string): Promise<Message> {
    //     throw new Error("Method not implemented.");
    // }
    // create(using: Message): Promise<Message> {
    //     throw new Error("Method not implemented.");
    // }
}