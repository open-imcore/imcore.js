import { Client } from '../client';
import { WebSocketManager } from './manager';
import { EventType } from './events';
import {
  BlockListUpdated,
  ChatCreated,
  ChatDisplayNameUpdated,
  ChatJoinStateUpdated,
  ChatParticipantsChanged,
  ChatRemoved, ChatUnreadCountUpdated,
  ChatUpdated,
  ContactCreated,
  ContactRemoved,
  ContactUpdated,
  MessageReceived,
  MessageRemoved,
  MessageUpdated,
} from '../client-events';
import { ChatItemType } from '../../util/Constants';
import { ChatItem } from '../../types';
import { StatusChatItem } from '../..';

export class EventHandler {
    constructor(public client: Client, manager: WebSocketManager, onReady: () => void) {
        manager.on(EventType.bootstrap, async ({ chats, contacts: { contacts, strangers }, messages }) => {
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

            if (messages) {
              const messageItems = (messages.items.filter(item => item.type === ChatItemType.message) as ChatItem<ChatItemType.message>[]).map(({ payload }) => payload);

              const batches = await Promise.all(messageItems.map(async message => await this.client.messages.batchAdd(message)));

              await this.client.messages.resolveBatchResults(batches);
            }

            onReady();
        });

        manager.on(EventType.itemsReceived, ({ items }) => {
            const messages = items.filter(item => item.type === ChatItemType.message) as ChatItem<ChatItemType.message>[]

            messages.map(async ({ payload: message }) => this.client.emit(MessageReceived, await this.client.messages.add(message, true)));
        });

        manager.on(EventType.itemsUpdated, ({ items }) => {
          const messages = items.filter(item => item.type === ChatItemType.message) as ChatItem<ChatItemType.message>[];

          messages.forEach(async ({ payload: message }) => {
            this.client.emit(MessageUpdated, await this.client.messages.add(message, true));
          });
        });

        manager.on(EventType.itemStatusChanged, status => {
          const message = this.client.messages.resolve(status.itemGUID);
          if (!message) return;

          const item = new StatusChatItem(this.client, status)
          message._applyStatusItem(item);

          this.client.emit(MessageUpdated, message);
        });

        manager.on(EventType.itemsRemoved, ({ messages }) => {
            messages.forEach(id => {
                const message = this.client.messages.resolve(id);
                if (message?.isTypingMessage || message?.isCancelTypingMessage) return;
                const deleted = this.client.messages.delete(id);
                if (!deleted) return;
                this.client.emit(MessageRemoved, deleted);
            });
        });

        manager.on(EventType.contactCreated, async contact => {
            this.client.emit(ContactCreated, await this.client.contacts.add(contact));
        });

        manager.on(EventType.contactUpdated, async contact => {
            this.client.emit(ContactUpdated, await this.client.contacts.add(contact));
        });

        manager.on(EventType.contactRemoved, contact => {
            this.client.emit(ContactRemoved, this.client.contacts.delete(contact.id));
        });

        manager.on(EventType.conversationChanged, async chat => {
            this.client.emit(ChatUpdated, await this.client.chats.add(chat));
        });

        manager.on(EventType.conversationDisplayNameChanged, async chat => {
            this.client.emit(ChatDisplayNameUpdated, await this.client.chats.add(chat));
        });

        manager.on(EventType.conversationJoinStateChanged, async chat => {
            this.client.emit(ChatJoinStateUpdated, await this.client.chats.add(chat));
        });

        manager.on(EventType.conversationUnreadCountChanged, async chat => {
            this.client.emit(ChatUnreadCountUpdated, await this.client.chats.add(chat));
        });

        manager.on(EventType.conversationPropertiesChanged, async properties => {
            const chat = await this.client.chats.hardResolve(properties.groupID);
            if (!chat) return;
            chat._patch_configuration(properties);
        });

        manager.on(EventType.conversationCreated, async chat => {
            this.client.emit(ChatCreated, await this.client.chats.add(chat));
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
