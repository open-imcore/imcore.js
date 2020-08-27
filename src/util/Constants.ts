import { ClientOptions } from "../client/client"

export const browser = typeof window !== 'undefined'

export enum ChatItemType {
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

export const DefaultOptions: ClientOptions = {
    gateway: "ws://127.0.0.1:8090/stream",
    apiHost: "http://127.0.0.1:8090"
}
