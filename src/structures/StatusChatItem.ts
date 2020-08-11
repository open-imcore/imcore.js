import { ChatItem } from "./ChatItem";
import { StatusChatItemRepresentation } from "../types";

export class StatusChatItem extends ChatItem<StatusChatItemRepresentation> implements StatusChatItemRepresentation {
    statusType: number;
    itemGUID: string;

    get item() {
        return this.client.messages.resolve(this.itemGUID);
    }

    _patch({ statusType, itemGUID, ...item }: StatusChatItemRepresentation) {
        this.statusType = statusType;
        this.itemGUID = itemGUID;

        return super._patch(item);
    }
}