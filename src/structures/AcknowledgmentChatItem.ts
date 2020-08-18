import { ChatItem } from "./ChatItem";
import { AcknowledgmentChatItemRepresentation } from "../types";

const associatedGUIDExtractor = () => /(?:\w+:)(?:(\d*)\/)?([\w-]+)/g

export class AcknowledgmentChatItem extends ChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender" | "associatedGUID"> {
    private _sender?: string;
    acknowledgmentType: number;
    private associatedGUID: string;

    get associatedMessagePart(): number {
        return +associatedGUIDExtractor().exec(this.associatedGUID)![1] ?? 0
    }

    get associatedMessageGUID(): string {
        try {
            return associatedGUIDExtractor().exec(this.associatedGUID)![2];
        } catch {
            console.log(this.associatedGUID);
            return this.associatedGUID;
        }
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