import { ChatItem } from "./ChatItem";
import { StatusChatItemRepresentation } from "../types";

export class StatusChatItem extends ChatItem<StatusChatItemRepresentation> implements StatusChatItemRepresentation {
    statusType: number;
    itemGUID: string;
    flags: number;
    timeDelivered: number;
    timeRead: number;
    timePlayed: number;

    get item() {
        return this.client.messages.resolve(this.itemGUID);
    }

    _patch({ statusType, itemGUID, flags, timeDelivered, timeRead, timePlayed, ...item }: StatusChatItemRepresentation) {
        this.statusType = statusType;
        this.itemGUID = itemGUID;
        this.flags = flags;
        this.timeDelivered = timeDelivered;
        this.timeRead = timeRead;
        this.timePlayed = timePlayed;

        return super._patch(item);
    }
}
