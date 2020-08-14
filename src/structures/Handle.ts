import { Base } from "./Base";
import { HandleRepresentation } from "../types";
import { Contact } from "./Contact";
import { handleBlock } from "../client/rest/endpoints";

export class Handle extends Base<HandleRepresentation> implements HandleRepresentation {
    id: string;
    isBusiness: boolean;

    /**
     * Block this handle
     */
    async block() {
        await this.put(handleBlock(this.id));
    }

    /**
     * Unblock this handle
     */
    async unblock() {
        await this.delete(handleBlock(this.id));
    }

    get contact(): Contact | null {
        return this.client.contactForHandleID(this.id);
    }

    get shortName() {
        return this.contact?.firstName || this.contact?.nickname || this.contact?.lastName || this.id;
    }

    get name() {
        return this.contact?.fullName || this.id;
    }

    _patch({ id, isBusiness }: HandleRepresentation) {
        this.id = id;
        this.isBusiness = isBusiness;

        return this;
    }
}