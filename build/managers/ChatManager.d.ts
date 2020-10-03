import { BaseManager } from "./BaseManager";
import { Chat } from "../structures/Chat";
import { Client } from "../client/client";
import { ChatRepresentation } from "imcore-ajax-core";
export declare class ChatManager extends BaseManager<Chat, ChatRepresentation> {
    constructor(client: Client);
    hardResolve(chatID: string): Promise<Chat>;
}
