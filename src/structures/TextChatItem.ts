import { ChatItem } from "./ChatItem";
import { TextChatItemRepresentation } from "../types";

export class TextChatItem extends ChatItem<TextChatItemRepresentation> implements TextChatItemRepresentation {
    text: string;
    html?: string;

    _patch({ text, html, ...item }: TextChatItemRepresentation) {
        this.text = text;
        this.html = html;

        return super._patch(item);
    }
}