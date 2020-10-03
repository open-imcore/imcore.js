import { BaseManager } from "./BaseManager";
import { Contact } from "../structures/Contact";
import { Client } from "../client/client";
import { ContactRepresentation } from "imcore-ajax-core";

export class ContactsManager extends BaseManager<Contact, ContactRepresentation> {
    constructor(client: Client) {
        super(client, Contact, "id");
    }

    contactWithHandle(id: string): Contact | null {
        return this.cache.find(c => c.handleIDs.includes(id));
    }

    // fetch(id: string): Promise<Contact> {
    //     throw new Error("Method not implemented.");
    // }

    // create(using: Contact): Promise<Contact> {
    //     throw new Error("Method not implemented.");
    // }
}