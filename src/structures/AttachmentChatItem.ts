import { AttachmentChatItemRepresentation, AttachmentRepresentation } from "imcore-ajax-core";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";

export class AttachmentChatItem extends AcknowledgableChatItem<AttachmentChatItemRepresentation> implements Omit<AttachmentChatItemRepresentation, "acknowledgments"> {
    transferID: string;
    metadata?: AttachmentRepresentation;

    toString() {
        return `AttachmentChatItem[transferID: ${this.transferID}]`
    }

    /**
     * The URL to download the attachment
     */
    get url() {
        return this.rest.attachmentURL(this.transferID);
    }

    _patch({ transferID, metadata, ...item }: AttachmentChatItemRepresentation) {
        this.transferID = transferID;
        this.metadata = metadata;

        return super._patch(item);
    }
}
