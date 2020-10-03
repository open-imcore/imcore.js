import { HandleFormat, HandleRepresentation } from "imcore-ajax-core";
import { Base } from "./Base";
import { Contact } from "./Contact";

export class Handle extends Base<HandleRepresentation> implements HandleRepresentation {
    id: string;
    format: HandleFormat;

    /**
     * Block this handle
     */
    async block() {
        await this.rest.handles.block(this.id);
    }

    /**
     * Unblock this handle
     */
    async unblock() {
        await this.rest.handles.unblock(this.id);
    }

    get pictureURL(): string | null {
        return this.contact?.pictureURL || null;
    }

    get hasPicture(): boolean {
        return this.contact?.hasPicture || false;
    }

    get fullName(): string | null {
        return this.contact?.fullName || null;
    }

    get firstName(): string | null {
        return this.contact?.firstName || null;
    }

    get lastName(): string | null {
        return this.contact?.lastName || null;
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

    _patch({ id, format }: HandleRepresentation) {
        this.id = id;
        this.format = format;

        return this;
    }
}
