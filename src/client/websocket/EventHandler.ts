import { Client } from '../client';
import { WebSocketManager } from './manager';
import { EventType } from './events';
import {
  BlockListUpdated,
  ChatCreated,
  ChatDisplayNameUpdated,
  ChatJoinStateUpdated,
  ChatParticipantsChanged,
  ChatRemoved,
  ChatUpdated,
  ContactCreated,
  ContactRemoved,
  ContactUpdated,
  MessageReceived,
  MessageRemoved, MessageUpdated,
} from '../client-events';
import { ChatItemType } from '../../util/Constants';
import { ChatItem } from '../../types';

export class EventHandler {
    constructor(public client: Client, manager: WebSocketManager, onReady: () => void) {
        manager.on(EventType.bootstrap, ({ chats, contacts: { contacts, strangers } }) => {
            contacts.forEach(contact => {
                this.client.contacts.add(contact);

                contact.handles.forEach(handle => {
                    this.client.handles.add(handle);
                });
            });

            strangers.forEach(stranger => {
                this.client.handles.add(stranger);
            });

            chats.forEach(chat => {
                this.client.chats.add(chat);
            });

            onReady();
        });

        manager.on(EventType.itemsReceived, ({ items }) => {
            const messages = items.filter(item => item.type === ChatItemType.message) as ChatItem<ChatItemType.message>[]


            messages.forEach(({ payload: message }) => {
                this.client.emit(MessageReceived, this.client.messages.add(message));
            });
        });

        manager.on(EventType.itemsUpdated, ({ items }) => {
          const messages = items.filter(item => item.type === ChatItemType.message) as ChatItem<ChatItemType.message>[];

          messages.forEach(({ payload: message }) => {
            this.client.emit(MessageUpdated, this.client.messages.add(message));
          });
        })

        manager.on(EventType.itemsRemoved, ({ messages }) => {
            messages.forEach(id => {
                const deleted = this.client.messages.delete(id);
                if (!deleted) return;
                this.client.emit(MessageRemoved, deleted);
            });
        });

        manager.on(EventType.contactCreated, contact => {
            this.client.emit(ContactCreated, this.client.contacts.add(contact));
        });

        manager.on(EventType.contactUpdated, contact => {
            this.client.emit(ContactUpdated, this.client.contacts.add(contact));
        });

        manager.on(EventType.contactRemoved, contact => {
            this.client.emit(ContactRemoved, this.client.contacts.delete(contact.id));
        });

        manager.on(EventType.conversationChanged, chat => {
            this.client.emit(ChatUpdated, this.client.chats.add(chat));
        });

        manager.on(EventType.conversationDisplayNameChanged, chat => {
            this.client.emit(ChatDisplayNameUpdated, this.client.chats.add(chat));
        });

        manager.on(EventType.conversationJoinStateChanged, chat => {
            this.client.emit(ChatJoinStateUpdated, this.client.chats.add(chat));
        });

        manager.on(EventType.conversationCreated, chat => {
            this.client.emit(ChatCreated, this.client.chats.add(chat));
        });

        manager.on(EventType.conversationRemoved, ({ chat }) => {
            this.client.emit(ChatRemoved, this.client.chats.delete(chat));
        });

        manager.on(EventType.blockListUpdated, ({ handles }) => {
            this.client.blockedHandleIDs = handles;

            this.client.emit(BlockListUpdated, this.client.blockedHandleIDs.map(id => this.client.handles.resolve(id)));
        });

        manager.on(EventType.participantsChanged, ({ chat: chatGUID, handles }) => {
            const chat = this.client.chats.resolve(chatGUID);

            chat.participants = handles.map(h => this.client.handles.resolve(h));

            this.client.emit(ChatParticipantsChanged, chat);
        });
    }
}
