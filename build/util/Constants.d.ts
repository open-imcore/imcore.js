import { ClientOptions } from "../client/client";
export declare const browser: boolean;
export declare enum ChatItemType {
    date = "date",
    sender = "sender",
    participantChange = "participantChange",
    attachment = "attachment",
    status = "status",
    groupAction = "groupAction",
    plugin = "plugin",
    text = "text",
    acknowledgment = "acknowledgment",
    associated = "associated",
    message = "message",
    phantom = "phantom",
    groupTitle = "groupTitle",
    typing = "typing",
    sticker = "sticker"
}
export declare const DefaultOptions: ClientOptions;
