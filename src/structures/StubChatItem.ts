import { ChatItem } from "./ChatItem";
import { StubChatItemRepresentation } from "../types";

export class StubChatItem extends ChatItem<StubChatItemRepresentation> implements StubChatItemRepresentation {
    className: string;
    
    _patch({ className, ...item }: StubChatItemRepresentation) {
        this.className = className;

        return super._patch(item);
    }
}