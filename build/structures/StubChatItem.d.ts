import { StubChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare class StubChatItem extends ChatItem<StubChatItemRepresentation> implements StubChatItemRepresentation {
    className: string;
    toString(): string;
    _patch({ className, ...item }: StubChatItemRepresentation): this;
}
