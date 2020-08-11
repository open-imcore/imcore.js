import { ChatItem } from "./ChatItem";
import { AssociatedMessageItemRepresentation } from "../types";

export class AssociatedChatItem extends ChatItem<AssociatedMessageItemRepresentation> implements AssociatedMessageItemRepresentation {
    associatedGUID: string;
    associatedType: number;

    _patch({ associatedGUID, associatedType, ...item }: AssociatedMessageItemRepresentation) {
        this.associatedGUID = associatedGUID;
        this.associatedType = associatedType;

        return super._patch(item);
    }
}