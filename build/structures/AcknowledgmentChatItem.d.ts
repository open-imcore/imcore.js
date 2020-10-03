import { AcknowledgmentChatItemRepresentation } from "imcore-ajax-core";
import { AssociatedChatItem } from "./AssociatedChatItem";
export declare class AcknowledgmentChatItem extends AssociatedChatItem<AcknowledgmentChatItemRepresentation> implements Omit<AcknowledgmentChatItemRepresentation, "sender" | "associatedID"> {
    private _sender?;
    acknowledgmentType: number;
    get representation(): AcknowledgmentChatItemRepresentation;
    get sender(): import("./Handle").Handle;
    _patch({ sender, acknowledgmentType, ...item }: AcknowledgmentChatItemRepresentation): this;
}
