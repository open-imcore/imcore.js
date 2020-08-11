import { ChatItem } from "./ChatItem";
import { ParticipantChangeTranscriptChatItemRepresentation } from "../types";

export class ParticipantChangeChatItem extends ChatItem<ParticipantChangeTranscriptChatItemRepresentation> implements ParticipantChangeTranscriptChatItemRepresentation {
    initiatorID?: string;
    targetID?: string;
    changeType: number;

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