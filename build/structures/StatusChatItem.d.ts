import { StatusChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare class StatusChatItem extends ChatItem<StatusChatItemRepresentation> implements StatusChatItemRepresentation {
    statusType: number;
    itemID: string;
    flags: number;
    timeDelivered: number;
    timeRead: number;
    timePlayed: number;
    get item(): import("./Message").Message;
    _patch({ statusType, itemID, flags, timeDelivered, timeRead, timePlayed, ...item }: StatusChatItemRepresentation): this;
}
