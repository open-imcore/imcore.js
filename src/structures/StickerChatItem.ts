import { AttachmentRepresentation, StickerChatItemRepresentation, StickerRepresentation } from '../types';
import { AssociatedChatItem } from './AssociatedChatItem';

export class StickerChatItem extends AssociatedChatItem<StickerChatItemRepresentation> implements StickerChatItemRepresentation {
  attachment: AttachmentRepresentation;
  sticker: StickerRepresentation;

  _patch({ attachment, sticker, ...item }: StickerChatItemRepresentation) {
    this.attachment = attachment!;
    this.sticker = sticker!;

    return super._patch(item);
  }
}
