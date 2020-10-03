import { Client } from '../client';
import { IMWebSocketClient } from "imcore-ajax-core";
export declare class EventHandler {
    client: Client;
    constructor(client: Client, manager: IMWebSocketClient, onReady: () => void);
}
