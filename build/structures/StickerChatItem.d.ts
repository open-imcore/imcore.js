import { AttachmentRepresentation, StickerChatItemRepresentation, StickerRepresentation } from "imcore-ajax-core";
import { AssociatedChatItem } from './AssociatedChatItem';
export declare class StickerChatItem extends AssociatedChatItem<StickerChatItemRepresentation> implements StickerChatItemRepresentation {
    attachment: AttachmentRepresentation;
    sticker: StickerRepresentation;
    _patch({ attachment, sticker, ...item }: StickerChatItemRepresentation): this;
}
