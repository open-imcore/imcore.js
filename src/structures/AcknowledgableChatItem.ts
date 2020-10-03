import { ChatItem } from './ChatItem';
import { AcknowledgmentChatItem } from './AcknowledgmentChatItem';
import { Message } from './Message';
import { MessageReceived } from '..';
import { associatedIDExtractor } from './AssociatedChatItem';
import { AcknowledgmentChatItemRepresentation, AcknowledgmentType, ChatItemAcknowledgableRepresentation } from "imcore-ajax-core";

export class AcknowledgableChatItem<T extends ChatItemAcknowledgableRepresentation = ChatItemAcknowledgableRepresentation> extends ChatItem<T> implements Omit<ChatItemAcknowledgableRepresentation, "acknowledgments"> {
    private _acknowledgments: AcknowledgmentChatItemRepresentation[];

    get acknowledgments() {
        return this._acknowledgments?.map(item => new AcknowledgmentChatItem(this.client, item)) || [];
    }

    get positiveAcknowledgments() {
        return this.acknowledgments.filter(item => item.acknowledgmentType < 2999);
    }

    /**
     * Send an associated message with the given style
     * @param style association style
     */
    async sendAssociatedMessage(style: AcknowledgmentType) {
      const message = await this.client.messages.add(await this.rest.messages.createAssociatedMessage(this.id, this.parentMessageID, style));

      if (message.acknowledgedMessageItem && message.acknowledgmentItem) {
        message.acknowledgedMessageItem._acknowledgments = message.acknowledgedMessageItem._acknowledgments.filter(ack => !ack.fromMe).concat(message.acknowledgmentItem.representation)
      }

      this.client.emit(MessageReceived, message);
    }

    /**
     * Load all associated messages for the item
     */
    async associatedMessages(): Promise<Message[]> {
      const associatedRepresentations = await this.rest.messages.fetchAssociatedMessages(this.id);

      return Promise.all(associatedRepresentations.map(message => this.client.messages.add(message)));
    }

    private get parentMessageID(): string {
      return associatedIDExtractor().exec(this.id)[2]
    }

    _patch({ acknowledgments, ...item }: ChatItemAcknowledgableRepresentation) {
        this._acknowledgments = (acknowledgments || []).filter(({ acknowledgmentType }) => {
          switch (acknowledgmentType) {
            case AcknowledgmentType.removeExclamation:
            case AcknowledgmentType.removeHa:
            case AcknowledgmentType.removeHeart:
            case AcknowledgmentType.removeQuestionmark:
            case AcknowledgmentType.removeThumbsdown:
            case AcknowledgmentType.removeThumbsup:
              return false
          }
          return true
        });

        return super._patch(item);
    }
}
