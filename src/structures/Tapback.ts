import { Base } from "./Base";
import { TapbackRepresentation } from "../types";

export class Tapback extends Base<TapbackRepresentation> implements Omit<TapbackRepresentation, "handle"> {
    chatGUID: string;
    associatedMessageType: number;
    associatedMessageGUID: string;
    get handle() {
        return this.client.handles.resolve(this._handle);
    }

    private _handle: string;

    _patch({ chatGUID, associatedMessageGUID, associatedMessageType, handle }: TapbackRepresentation): this {
        this.chatGUID = chatGUID;
        this.associatedMessageGUID = associatedMessageGUID;
        this.associatedMessageType = associatedMessageType;
        this._handle = handle;
        
        return this;
    }
}