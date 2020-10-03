import { AssociatedChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export const associatedIDExtractor = () => /(?:\w+:)(?:(\d*)\/)?([\w-]+)/g

export class AssociatedChatItem<T extends AssociatedChatItemRepresentation = AssociatedChatItemRepresentation> extends ChatItem<T> implements AssociatedChatItemRepresentation {
    associatedID: string;

    get associatedMessagePart(): number | null {
      const part = +associatedIDExtractor().exec(this.associatedID)![1]
      if (isNaN(part)) return null;
      return part;
    }

    get associatedMessageID(): string {
      try {
        return associatedIDExtractor().exec(this.associatedID)![2];
      } catch {
        console.log(this.associatedID);
        return this.associatedID;
      }
    }

    _patch({ associatedID, ...item }: AssociatedChatItemRepresentation) {
        this.associatedID = associatedID;

        return super._patch(item);
    }
}
