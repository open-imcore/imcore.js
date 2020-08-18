import { AcknowledgmentChatItemRepresentation, ChatItemAcknowledgableRepresentation } from "../types";
import { ChatItem } from "./ChatItem";
import { AcknowledgmentChatItem } from "./AcknowledgmentChatItem";

export class AcknowledgableChatItem<T extends ChatItemAcknowledgableRepresentation = ChatItemAcknowledgableRepresentation> extends ChatItem<T> implements Omit<ChatItemAcknowledgableRepresentation, "acknowledgments"> {
    private _acknowledgments: AcknowledgmentChatItemRepresentation[];

    get acknowledgments() {
        return this._acknowledgments.map(item => new AcknowledgmentChatItem(this.client, item));
    }

    _patch({ acknowledgments, ...item }: ChatItemAcknowledgableRepresentation) {
        this._acknowledgments = acknowledgments;

        return super._patch(item);
    }
}