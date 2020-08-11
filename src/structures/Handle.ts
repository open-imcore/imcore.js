import { Base } from "./Base";
import { HandleRepresentation } from "../types";
import { Contact } from "./Contact";

export class Handle extends Base<HandleRepresentation> implements HandleRepresentation {
    id: string;
    isBusiness: boolean;

    get contact(): Contact | null {
        return this.client.contactForHandleID(this.id);
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