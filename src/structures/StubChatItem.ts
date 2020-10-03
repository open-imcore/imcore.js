import { StubChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export class StubChatItem extends ChatItem<StubChatItemRepresentation> implements StubChatItemRepresentation {
    className: string;

    toString() {
        return `StubChatItem[className: ${this.className}]`;
    }
    
    _patch({ className, ...item }: StubChatItemRepresentation) {
        this.className = className;

        return super._patch(item);
    }
}