import { ChatItem } from "./ChatItem";
import { AssociatedChatItemRepresentation } from '../types';

export const associatedGUIDExtractor = () => /(?:\w+:)(?:(\d*)\/)?([\w-]+)/g

export class AssociatedChatItem<T extends AssociatedChatItemRepresentation = AssociatedChatItemRepresentation> extends ChatItem<T> implements AssociatedChatItemRepresentation {
    associatedGUID: string;

    get associatedMessagePart(): number | null {
      const part = +associatedGUIDExtractor().exec(this.associatedGUID)![1]
      if (isNaN(part)) return null;
      return part;
    }

    get associatedMessageGUID(): string {
      try {
        return associatedGUIDExtractor().exec(this.associatedGUID)![2];
      } catch {
        console.log(this.associatedGUID);
        return this.associatedGUID;
      }
    }

    _patch({ associatedGUID, ...item }: AssociatedChatItemRepresentation) {
        this.associatedGUID = associatedGUID;

        return super._patch(item);
    }
}
