import { ChatItem } from "./ChatItem";
import { AcknowledgmentChatItemRepresentation } from "../types";

export class AcknowledgmentChatItem extends ChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender"> {
    private _sender?: string;
    acknowledgmentType: number;
    
    get sender() {
        if (!this._sender) return null;
        return this.client.handles.resolve(this._sender);
    }

    _patch({ sender, acknowledgmentType, ...item }: AcknowledgmentChatItemRepresentation) {
        this._sender = sender;
        this.acknowledgmentType = acknowledgmentType;

        return super._patch(item);
    }
}