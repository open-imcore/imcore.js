import { ParticipantChangeTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare enum ParticipantChangeType {
    addMember = 0,
    removeMember = 1
}
export declare class ParticipantChangeChatItem extends ChatItem<ParticipantChangeTranscriptChatItemRepresentation> implements ParticipantChangeTranscriptChatItemRepresentation {
    initiatorID?: string;
    targetID?: string;
    changeType: ParticipantChangeType;
    isTranscriptLike: boolean;
    get initiator(): import("./Handle").Handle;
    get target(): import("./Handle").Handle;
    _patch({ initiatorID, targetID, changeType, ...item }: ParticipantChangeTranscriptChatItemRepresentation): this;
}
