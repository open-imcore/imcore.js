import { BaseManager } from "./BaseManager";
import { Handle } from "../structures/Handle";
import { Client } from "../client/client";
import { HandleRepresentation } from "imcore-ajax-core";
export declare class HandleManager extends BaseManager<Handle, HandleRepresentation> {
    constructor(client: Client);
}
