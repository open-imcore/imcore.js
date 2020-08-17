import { ChatItem } from "./ChatItem";
import { AcknowledgmentChatItemRepresentation } from "../types";

export class AcknowledgmentChatItem extends ChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender" | "associatedGUID"> {
    private _sender?: string;
    acknowledgmentType: number;
    private associatedGUID: string;

    get associatedMessagePart(): number {
        return +/(?:\w+:(\d+))\/([\w-]+)/g.exec(this.associatedGUID)![1]
    }

    get associatedMessageGUID(): string {
        return /(?:\w+:(\d+))\/([\w-]+)/g.exec(this.associatedGUID)![2];
    }
    
    get sender() {
        if (!this._sender) return null;
        return this.client.handles.resolve(this._sender);
    }

    _patch({ sender, acknowledgmentType, associatedGUID, ...item }: AcknowledgmentChatItemRepresentation) {
        this._sender = sender;
        this.acknowledgmentType = acknowledgmentType;
        this.associatedGUID = associatedGUID;

        return super._patch(item);
    }
}