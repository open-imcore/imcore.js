import { HandleFormat, HandleRepresentation } from "imcore-ajax-core";
import { Base } from "./Base";
import { Contact } from "./Contact";
export declare class Handle extends Base<HandleRepresentation> implements HandleRepresentation {
    id: string;
    format: HandleFormat;
    /**
     * Block this handle
     */
    block(): Promise<void>;
    /**
     * Unblock this handle
     */
    unblock(): Promise<void>;
    get pictureURL(): string | null;
    get hasPicture(): boolean;
    get fullName(): string | null;
    get firstName(): string | null;
    get lastName(): string | null;
    get contact(): Contact | null;
    get shortName(): string;
    get name(): string;
    _patch({ id, format }: HandleRepresentation): this;
}
