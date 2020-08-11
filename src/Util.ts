
import { ChatItemType } from "./util/Constants";
import { TextChatItem } from "./structures/TextChatItem";
import { DateChatItem } from "./structures/DateChatItem";
import { SenderChatItem } from "./structures/SenderChatItem";
import { ParticipantChangeChatItem } from "./structures/ParticipantChangeChatItem";
import { AttachmentChatItem } from "./structures/AttachmentChatItem";
import { StatusChatItem } from "./structures/StatusChatItem";
import { GroupActionChatItem } from "./structures/GroupActionChatItem";
import { PluginChatItem } from "./structures/PluginChatItem";
import { AcknowledgmentChatItem } from "./structures/AcknowledgmentChatItem";
import { AssociatedChatItem } from "./structures/AssociatedChatItem";
import { StubChatItem } from "./structures/StubChatItem";
import { GroupTitleChatItem } from "./structures/GroupTitleChatItem";
import { Message } from "./structures/Message";
import { AnyChatItemModel, FuzzyHandle } from "./types";
import { Client } from "./client/client";
import { Handle } from "./structures/Handle";
import { Contact } from "./structures/Contact";

export type AnyChatItem = TextChatItem | DateChatItem | SenderChatItem | ParticipantChangeChatItem | AttachmentChatItem | StatusChatItem | GroupActionChatItem | PluginChatItem | AcknowledgmentChatItem | StubChatItem | GroupTitleChatItem | Message;

export class Util {
    /**
     * Takes a fuzzy item representation and returns a solid chat item instance for its type
     * @param item fuzzy item
     * @param client client instance
     */
    static resolveItem(item: AnyChatItemModel, client: Client, messageGUID: string, part: number): AnyChatItem | null {
        switch (item.type) {
            case ChatItemType.date: return new DateChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.sender: return new SenderChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.participantChange: return new ParticipantChangeChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.attachment: return new AttachmentChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.status: return new StatusChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.groupAction: return new GroupActionChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.plugin: return new PluginChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.text: return new TextChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.acknowledgment: return new AcknowledgmentChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.associated: return new AssociatedChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.message: return new Message(client, item.payload)
            case ChatItemType.phantom: return new StubChatItem(client, item.payload, messageGUID, part)
            case ChatItemType.groupTitle: return new GroupTitleChatItem(client, item.payload, messageGUID, part)
            default: return null
        }
    }
    
    /**
     * Takes a fuzzy handle representation and returns a solid handle ID
     * @param handle fuzzy handle
     */
    static resolveHandle(handle: FuzzyHandle): string | null {
        var id: string

        if (handle instanceof Handle) id = handle.id
        else if (handle instanceof Contact) id = handle.handleIDs[0]
        else id = handle

        if (typeof id !== "string") return null

        return id
    }
}