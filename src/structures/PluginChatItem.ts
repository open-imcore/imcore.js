import { ChatItem } from "./ChatItem";
import { PluginChatItemRepresentation, AttachmentRepresentation } from "../types";
import { unarchiveBase64EncodedBPlist } from "../util/unarchiver";

export class PluginChatItem extends ChatItem<PluginChatItemRepresentation> implements PluginChatItemRepresentation {
    payload: string;
    bundleID: string;
    attachments: AttachmentRepresentation[];
    plist: any;

    _patch({ payload, bundleID, attachments, ...item }: PluginChatItemRepresentation) {
        this.payload = payload;
        this.bundleID = bundleID;
        this.attachments = attachments;
        
        try {
            this.plist = unarchiveBase64EncodedBPlist(payload);
        } catch (e) {
            this.client.emit('debug', { level: 'warn', messages: ['failed to unarchive plist with error', e] });
        }

        return super._patch(item);
    }
}