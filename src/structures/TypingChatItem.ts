import { ChatItem } from './ChatItem';
import { TypingChatItemRepresentation } from '../types';
import { Handle } from "./Handle";

export class TypingChatItem extends ChatItem<TypingChatItemRepresentation> implements Omit<TypingChatItemRepresentation, "sender"> {
  private _sender: string;

  get sender(): Handle {
    return this.client.handles.resolve(this._sender);
  }

  _patch({ sender, ...item }: TypingChatItemRepresentation) {
    this._sender = sender;

    return super._patch(item);
  }
}
