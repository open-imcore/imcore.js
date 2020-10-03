import { BaseManager } from "./BaseManager";
import { Contact } from "../structures/Contact";
import { Client } from "../client/client";
import { ContactRepresentation } from "imcore-ajax-core";
export declare class ContactsManager extends BaseManager<Contact, ContactRepresentation> {
    constructor(client: Client);
    contactWithHandle(id: string): Contact | null;
}
