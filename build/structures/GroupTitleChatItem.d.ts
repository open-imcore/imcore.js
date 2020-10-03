import { GroupTitleChangeItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare class GroupTitleChatItem extends ChatItem<GroupTitleChangeItemRepresentation> implements Omit<GroupTitleChangeItemRepresentation, "sender"> {
    title: string;
    private _sender?;
    isTranscriptLike: boolean;
    get sender(): import("./Handle").Handle;
    _patch({ title, sender, ...item }: GroupTitleChangeItemRepresentation): this;
}
