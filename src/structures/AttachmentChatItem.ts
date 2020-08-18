import { AttachmentChatItemRepresentation, AttachmentRepresentation } from "../types";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";

export class AttachmentChatItem extends AcknowledgableChatItem<AttachmentChatItemRepresentation> implements Omit<AttachmentChatItemRepresentation, "acknowledgments"> {
    transferGUID: string;
    metadata?: AttachmentRepresentation;

    toString() {
        return `AttachmentChatItem[transferGUID: ${this.transferGUID}]`
    }

    /**
     * The URL to download the attachment
     */
    get url() {
        return this.rest.attachmentURL(this.transferGUID);
    }

    _patch({ transferGUID, metadata, ...item }: AttachmentChatItemRepresentation) {
        this.transferGUID = transferGUID;
        this.metadata = metadata;

        return super._patch(item);
    }
}
