import { ChatItem } from "./ChatItem";
import { AttachmentChatItemRepresentation, AttachmentRepresentation } from "../types";

export class AttachmentChatItem extends ChatItem<AttachmentChatItemRepresentation> implements AttachmentChatItemRepresentation {
    transferGUID: string;
    metadata?: AttachmentRepresentation;

    _patch({ transferGUID, metadata, ...item }: AttachmentChatItemRepresentation) {
        this.transferGUID = transferGUID;
        this.metadata = metadata;

        return super._patch(item);
    }
}
