import { AssociatedChatItem } from "./AssociatedChatItem";
import { AcknowledgmentChatItemRepresentation } from "../types";

export class AcknowledgmentChatItem extends AssociatedChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender" | "associatedGUID"> {
    private _sender?: string;
    acknowledgmentType: number;

    get representation(): AcknowledgmentChatItemRepresentation {
      return {
        chatGroupID: this.chatGroupID,
        time: this.time,
        guid: this.guid,
        fromMe: this.fromMe,
        sender: this._sender,
        acknowledgmentType: this.acknowledgmentType,
        associatedGUID: this.associatedGUID
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
