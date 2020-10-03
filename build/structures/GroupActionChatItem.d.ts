import { GroupActionTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare enum GroupActionType {
    left = 0
}
export declare class GroupActionChatItem extends ChatItem<GroupActionTranscriptChatItemRepresentation> implements Omit<GroupActionTranscriptChatItemRepresentation, "sender"> {
    actionType: GroupActionType;
    private _sender;
    isTranscriptLike: boolean;
    get sender(): import("./Handle").Handle;
    _patch({ actionType, sender, ...item }: GroupActionTranscriptChatItemRepresentation): this;
}
