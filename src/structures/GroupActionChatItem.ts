import { GroupActionTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export enum GroupActionType {
  left = 0
}

export class GroupActionChatItem extends ChatItem<GroupActionTranscriptChatItemRepresentation> implements Omit<GroupActionTranscriptChatItemRepresentation, "sender"> {
    actionType: GroupActionType;
    private _sender: string;

    public isTranscriptLike = true

    get sender() {
        return this.client.handles.resolve(this._sender);
    }

    _patch({ actionType, sender, ...item }: GroupActionTranscriptChatItemRepresentation) {
        this.actionType = actionType;
        this._sender = sender;

        return super._patch(item);
    }
}
