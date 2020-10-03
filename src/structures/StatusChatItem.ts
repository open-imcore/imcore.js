import { StatusChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export class StatusChatItem extends ChatItem<StatusChatItemRepresentation> implements StatusChatItemRepresentation {
    statusType: number;
    itemID: string;
    flags: number;
    timeDelivered: number;
    timeRead: number;
    timePlayed: number;

    get item() {
        return this.client.messages.resolve(this.itemID);
    }

    _patch({ statusType, itemID, flags, timeDelivered, timeRead, timePlayed, ...item }: StatusChatItemRepresentation) {
        this.statusType = statusType;
        this.itemID = itemID;
        this.flags = flags;
        this.timeDelivered = timeDelivered;
        this.timeRead = timeRead;
        this.timePlayed = timePlayed;

        return super._patch(item);
    }
}
