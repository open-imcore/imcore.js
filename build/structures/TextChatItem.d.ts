import { TextChatItemRepresentation, TextPart } from "imcore-ajax-core";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
export declare class TextChatItem extends AcknowledgableChatItem<TextChatItemRepresentation> implements Omit<TextChatItemRepresentation, "acknowledgments"> {
    text: string;
    parts: TextPart[];
    toString(): string;
    _patch({ text, parts, ...item }: TextChatItemRepresentation): this;
}
