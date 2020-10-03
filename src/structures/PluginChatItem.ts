import { AttachmentRepresentation, DigitalTouch, MessagesExtension, PluginChatItemRepresentation, RichLink } from "imcore-ajax-core";
import { unarchiveBase64EncodedBPlist } from "../util/unarchiverV2";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";

export class PluginChatItem extends AcknowledgableChatItem<PluginChatItemRepresentation> implements Omit<PluginChatItemRepresentation, "acknowledgments"> {
    payload?: string;
    bundleID: string;
    attachments: AttachmentRepresentation[];
    richLink?: RichLink;
    extension?: MessagesExtension;
    digitalTouch?: DigitalTouch;
    private _plist: any;

    get plist() {
        if (typeof this._plist !== "object") return null;
        if (Array.isArray(this._plist) && this._plist.length === 1) return this._plist[0];
        return this._plist;
    }

    _patch({ payload, bundleID, attachments, richLink, extension, digitalTouch, ...item }: PluginChatItemRepresentation) {
        this.payload = payload;
        this.bundleID = bundleID;
        this.attachments = attachments;
        this.richLink = richLink;
        this.extension = extension;
        this.digitalTouch = digitalTouch;

        if (payload) {
            try {
                this._plist = unarchiveBase64EncodedBPlist(payload);
            } catch (e) {
                this.client.emit('debug', { level: 'warn', messages: ['failed to unarchive plist with error', e] });
            }
        }

        return super._patch(item);
    }
}
