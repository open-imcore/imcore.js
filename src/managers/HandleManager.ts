import { BaseManager } from "./BaseManager";
import { Handle } from "../structures/Handle";
import { Client } from "../client/client";
import { HandleRepresentation } from "imcore-ajax-core";

export class HandleManager extends BaseManager<Handle, HandleRepresentation> {
    constructor(client: Client) {
        super(client, Handle, "id");
    }

    // fetch(id: string): Promise<Handle> {
    //     throw new Error("Method not implemented.");
    // }

    // create(using: Handle): Promise<Handle> {
    //     throw new Error("Method not implemented.");
    // }
}
