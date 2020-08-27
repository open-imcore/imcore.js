import { AcknowledgmentChatItemRepresentation, ChatItemAcknowledgableRepresentation } from "../types";
import { ChatItem, TapbackStyle } from './ChatItem';
import { AcknowledgmentChatItem } from './AcknowledgmentChatItem';
import { Message } from './Message';
import { MessageReceived } from '..';
import { associatedGUIDExtractor } from './AssociatedChatItem';

export class AcknowledgableChatItem<T extends ChatItemAcknowledgableRepresentation = ChatItemAcknowledgableRepresentation> extends ChatItem<T> implements Omit<ChatItemAcknowledgableRepresentation, "acknowledgments"> {
    private _acknowledgments: AcknowledgmentChatItemRepresentation[];

    get acknowledgments() {
        return this._acknowledgments?.map(item => new AcknowledgmentChatItem(this.client, item)) || [];
    }

    /**
     * Send an associated message with the given style
     * @param style association style
     */
    async sendAssociatedMessage(style: TapbackStyle) {
      const message = await this.client.messages.add(await this.rest.sendAssociatedMessage(this.guid, this.parentMessageGUID, style));

      if (message.acknowledgedMessageItem && message.acknowledgmentItem) {
        message.acknowledgedMessageItem._acknowledgments = message.acknowledgedMessageItem._acknowledgments.filter(ack => !ack.fromMe).concat(message.acknowledgmentItem.representation)
      }

      this.client.emit(MessageReceived, message);
    }

    /**
     * Load all associated messages for the item
     */
    async associatedMessages(): Promise<Message[]> {
      const associatedRepresentations = await this.rest.getAssociatedMessages(this.guid);

      return Promise.all(associatedRepresentations.map(message => this.client.messages.add(message)));
    }

    private get parentMessageGUID(): string {
      return associatedGUIDExtractor().exec(this.guid)[2]
    }

    _patch({ acknowledgments, ...item }: ChatItemAcknowledgableRepresentation) {
        this._acknowledgments = acknowledgments.filter(({ acknowledgmentType }) => {
          switch (acknowledgmentType) {
            case TapbackStyle.revokeExclamation:
            case TapbackStyle.revokeHaha:
            case TapbackStyle.revokeHeart:
            case TapbackStyle.revokeQuestion:
            case TapbackStyle.revokeThumbsDown:
            case TapbackStyle.revokeThumbsUp:
              return false
          }
          return true
        });

        return super._patch(item);
    }
}
