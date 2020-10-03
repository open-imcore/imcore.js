import { AcknowledgmentChatItemRepresentation } from "imcore-ajax-core";
import { AssociatedChatItem } from "./AssociatedChatItem";

export class AcknowledgmentChatItem extends AssociatedChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender" | "associatedID"> {
    private _sender?: string;
    acknowledgmentType: number;

    get representation(): AcknowledgmentChatItemRepresentation {
      return {
        chatID: this.chatID,
        time: this.time,
        id: this.id,
        fromMe: this.fromMe,
        sender: this._sender,
        acknowledgmentType: this.acknowledgmentType,
        associatedID: this.associatedID
      }
    }

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
