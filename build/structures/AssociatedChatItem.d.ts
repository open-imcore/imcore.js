import { AssociatedChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare const associatedIDExtractor: () => RegExp;
export declare class AssociatedChatItem<T extends AssociatedChatItemRepresentation = AssociatedChatItemRepresentation> extends ChatItem<T> implements AssociatedChatItemRepresentation {
    associatedID: string;
    get associatedMessagePart(): number | null;
    get associatedMessageID(): string;
    _patch({ associatedID, ...item }: AssociatedChatItemRepresentation): this;
}
