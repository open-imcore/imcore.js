import { ContactRepresentation } from "imcore-ajax-core";
import { Base } from "./Base";
import { Handle } from "./Handle";
export declare class Contact extends Base<ContactRepresentation> implements Omit<ContactRepresentation, "handles"> {
    private _handles;
    id: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fullName?: string;
    nickname?: string;
    countryCode?: string;
    hasPicture: boolean;
    toString(): string;
    /**
     * URL to download the image for this contact
     */
    get pictureURL(): string | null;
    get handles(): Handle[];
    get handleIDs(): string[];
    refresh(): Promise<this>;
    _patch({ id, firstName, middleName, lastName, fullName, nickname, countryCode, hasPicture, handles }: ContactRepresentation): this;
}
