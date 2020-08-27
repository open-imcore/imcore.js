import { Base } from "./Base";
import { ContactRepresentation } from "../types";
import { Handle } from "./Handle";

export class Contact extends Base<ContactRepresentation> implements Omit<ContactRepresentation, "handles"> {
    private _handles: import("../types").HandleRepresentation[];

    id: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fullName?: string;
    nickname?: string;
    countryCode?: string;
    hasPicture: boolean;

    toString(): string {
        return `Contact[id: ${this.id}; firstName: ${this.firstName}; middleName: ${this.middleName}; lastName: ${this.lastName}; fullName: ${this.fullName}; nickname: ${this.nickname}; countryCode: ${this.countryCode}; hasPicture: ${this.hasPicture};]`
    }

    /**
     * URL to download the image for this contact
     */
    get pictureURL(): string | null {
        if (!this.hasPicture) return null;
        return this.rest.contactPhotoURL(this.id);
    }

    get handles(): Handle[] {
        return this._handles.map(({ id }) => this.client.handles.resolve(id));
    }

    get handleIDs(): string[] {
        return this._handles.map(({ id }) => id);
    }

    async refresh(): Promise<this> {
        return this._patch(await this.rest.getContact(this.id));
    }

    _patch({ id, firstName, middleName, lastName, fullName, nickname, countryCode, hasPicture, handles }: ContactRepresentation) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.nickname = nickname;
        this.countryCode = countryCode;
        this.hasPicture = hasPicture;
        this._handles = handles;

        return this;
    }
}
