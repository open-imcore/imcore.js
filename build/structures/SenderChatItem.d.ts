import { SenderTranscriptChatItemRepresentation } from "imcore-ajax-core";
import { ChatItem } from "./ChatItem";
export declare class SenderChatItem extends ChatItem<SenderTranscriptChatItemRepresentation> implements SenderTranscriptChatItemRepresentation {
    handleID: string;
    get handle(): import("./Handle").Handle;
    _patch({ handleID, ...item }: SenderTranscriptChatItemRepresentation): this;
}
