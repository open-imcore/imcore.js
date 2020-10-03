import { SenderTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";

export class SenderChatItem extends ChatItem<SenderTranscriptChatItemRepresentation> implements SenderTranscriptChatItemRepresentation {
    handleID: string;

    get handle() {
        return this.client.handles.resolve(this.handleID);
    }

    _patch({ handleID, ...item }: SenderTranscriptChatItemRepresentation) {
        this.handleID = handleID;

        return super._patch(item);
    }
}