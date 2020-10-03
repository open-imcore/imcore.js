import { AttachmentRepresentation, DigitalTouch, MessagesExtension, PluginChatItemRepresentation, RichLink } from "imcore-ajax-core";
import { AcknowledgableChatItem } from "./AcknowledgableChatItem";
export declare class PluginChatItem extends AcknowledgableChatItem<PluginChatItemRepresentation> implements Omit<PluginChatItemRepresentation, "acknowledgments"> {
    payload?: string;
    bundleID: string;
    attachments: AttachmentRepresentation[];
    richLink?: RichLink;
    extension?: MessagesExtension;
    digitalTouch?: DigitalTouch;
    private _plist;
    get plist(): any;
    _patch({ payload, bundleID, attachments, richLink, extension, digitalTouch, ...item }: PluginChatItemRepresentation): this;
}
