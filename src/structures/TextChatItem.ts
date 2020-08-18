import { TextChatItemRepresentation } from "../types";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";

export class TextChatItem extends AcknowledgableChatItem<TextChatItemRepresentation> implements Omit<TextChatItemRepresentation, "acknowledgments"> {
    text: string;
    html?: string;

    _patch({ text, html, acknowledgments, ...item }: TextChatItemRepresentation) {
        this.text = text;
        this.html = html;

        return super._patch(item);
    }
}