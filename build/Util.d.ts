import { TextChatItem } from "./structures/TextChatItem";
import { DateChatItem } from "./structures/DateChatItem";
import { SenderChatItem } from "./structures/SenderChatItem";
import { ParticipantChangeChatItem } from "./structures/ParticipantChangeChatItem";
import { AttachmentChatItem } from "./structures/AttachmentChatItem";
import { StatusChatItem } from "./structures/StatusChatItem";
import { GroupActionChatItem } from "./structures/GroupActionChatItem";
import { PluginChatItem } from "./structures/PluginChatItem";
import { AcknowledgmentChatItem } from "./structures/AcknowledgmentChatItem";
import { StubChatItem } from "./structures/StubChatItem";
import { GroupTitleChatItem } from "./structures/GroupTitleChatItem";
import { Message } from "./structures/Message";
import { FuzzyHandle } from "./types";
import { Client } from "./client/client";
import { AnyChatItemModel } from "imcore-ajax-core";
export declare type AnyChatItem = TextChatItem | DateChatItem | SenderChatItem | ParticipantChangeChatItem | AttachmentChatItem | StatusChatItem | GroupActionChatItem | PluginChatItem | AcknowledgmentChatItem | StubChatItem | GroupTitleChatItem | Message;
export declare class Util {
    /**
     * Takes a fuzzy item representation and returns a solid chat item instance for its type
     * @param item fuzzy item
     * @param client client instance
     */
    static resolveItem(item: AnyChatItemModel, client: Client): AnyChatItem | null;
    /**
     * Takes a fuzzy handle representation and returns a solid handle ID
     * @param handle fuzzy handle
     */
    static resolveHandle(handle: FuzzyHandle): string | null;
}
