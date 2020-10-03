import { ChatItem } from './ChatItem';
import { AcknowledgmentChatItem } from './AcknowledgmentChatItem';
import { Message } from './Message';
import { AcknowledgmentType, ChatItemAcknowledgableRepresentation } from "imcore-ajax-core";
export declare class AcknowledgableChatItem<T extends ChatItemAcknowledgableRepresentation = ChatItemAcknowledgableRepresentation> extends ChatItem<T> implements Omit<ChatItemAcknowledgableRepresentation, "acknowledgments"> {
    private _acknowledgments;
    get acknowledgments(): AcknowledgmentChatItem[];
    get positiveAcknowledgments(): AcknowledgmentChatItem[];
    /**
     * Send an associated message with the given style
     * @param style association style
     */
    sendAssociatedMessage(style: AcknowledgmentType): Promise<void>;
    /**
     * Load all associated messages for the item
     */
    associatedMessages(): Promise<Message[]>;
    private get parentMessageID();
    _patch({ acknowledgments, ...item }: ChatItemAcknowledgableRepresentation): this;
}
