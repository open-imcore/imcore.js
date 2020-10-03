import { AttachmentChatItemRepresentation, AttachmentRepresentation } from "imcore-ajax-core";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
export declare class AttachmentChatItem extends AcknowledgableChatItem<AttachmentChatItemRepresentation> implements Omit<AttachmentChatItemRepresentation, "acknowledgments"> {
    transferID: string;
    metadata?: AttachmentRepresentation;
    toString(): string;
    /**
     * The URL to download the attachment
     */
    get url(): string;
    _patch({ transferID, metadata, ...item }: AttachmentChatItemRepresentation): this;
}
