import { ChatItem } from "./ChatItem";
import { GroupTitleChangeItemRepresentation } from "../types";

export class GroupTitleChatItem extends ChatItem<GroupTitleChangeItemRepresentation> implements Omit<GroupTitleChangeItemRepresentation, "sender"> {
    title: string;
    private _sender?: string;

    get sender() {
        if (!this._sender) return null;
        return this.client.handles.resolve(this._sender);
    }

    _patch({ title, sender, ...item }: GroupTitleChangeItemRepresentation) {
        this.title = title;
        this._sender = sender;

        return super._patch(item);
    }
}