import { ParticipantChangeTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export enum ParticipantChangeType {
  addMember = 0,
  removeMember = 1
}

export class ParticipantChangeChatItem extends ChatItem<ParticipantChangeTranscriptChatItemRepresentation> implements ParticipantChangeTranscriptChatItemRepresentation {
    initiatorID?: string;
    targetID?: string;
    changeType: ParticipantChangeType;

    public isTranscriptLike = true

    get initiator() {
        if (!this.initiatorID) return null;
        return this.client.handles.resolve(this.initiatorID);
    }

    get target() {
        if (!this.targetID) return null;
        return this.client.handles.resolve(this.targetID);
    }

    _patch({ initiatorID, targetID, changeType, ...item }: ParticipantChangeTranscriptChatItemRepresentation) {
        this.initiatorID = initiatorID;
        this.targetID = targetID;
        this.changeType = changeType;

        return super._patch(item);
    }
}
