import { ChatItem } from "./ChatItem";
import { GroupActionTranscriptChatItemRepresentation } from "../types";

export class GroupActionChatItem extends ChatItem<GroupActionTranscriptChatItemRepresentation> implements Omit<GroupActionTranscriptChatItemRepresentation, "sender"> {
    actionType: number;
    private _sender: string;

    get sender() {
        return this.client.handles.resolve(this._sender);
    }

    _patch({ actionType, sender, ...item }: GroupActionTranscriptChatItemRepresentation) {
        this.actionType = actionType;
        this._sender = sender;

        return super._patch(item);
    }
}