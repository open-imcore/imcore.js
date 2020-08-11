import { ChatItem } from "./ChatItem";
import { PluginChatItemRepresentation, AttachmentRepresentation } from "../types";

export class PluginChatItem extends ChatItem<PluginChatItemRepresentation> implements PluginChatItemRepresentation {
    payload: string;
    bundleID: string;
    attachments: AttachmentRepresentation[];

    _patch({ payload, bundleID, attachments, ...item }: PluginChatItemRepresentation) {
        this.payload = payload;
        this.bundleID = bundleID;
        this.attachments = attachments;

        return super._patch(item);
    }
}