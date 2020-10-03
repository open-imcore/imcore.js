import { TypingChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from './ChatItem';
import { Handle } from "./Handle";
export declare class TypingChatItem extends ChatItem<TypingChatItemRepresentation> implements Omit<TypingChatItemRepresentation, "sender"> {
    private _sender;
    get sender(): Handle;
    _patch({ sender, ...item }: TypingChatItemRepresentation): this;
}
