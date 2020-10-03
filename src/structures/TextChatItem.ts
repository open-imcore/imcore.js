import { TextChatItemRepresentation, TextPart } from "imcore-ajax-core";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";

export class TextChatItem extends AcknowledgableChatItem<TextChatItemRepresentation> implements Omit<TextChatItemRepresentation, "acknowledgments"> {
    text: string;
    parts: TextPart[];

    toString() {
        return `TextChatItem[text: ${this.text};]`
    }

    _patch({ text, parts, ...item }: TextChatItemRepresentation) {
        this.text = text;
        this.parts = parts;

        return super._patch(item);
    }
}
