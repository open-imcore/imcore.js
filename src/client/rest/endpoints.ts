export const attachments = "/attachments"
export const resource = (identifier: string) => `/resources/${identifier}`;
export const attachment = (guid: string) => `${attachments}/${guid}`
export const messages = "/messages"
export const associatedMessages = `${messages}/associated`
export const message = (guid: string) => `${messages}/${guid}`
export const chats = "/chats"
export const chat = (guid: string) => `${chats}/${guid}`
export const chatTyping = (guid: string) => `${chat(guid)}/typing`;
export const chatRead = (guid: string) => `${chat(guid)}/read`;
export const chatJoin = (guid: string) => `${chat(guid)}/join`
export const chatProperties = (guid: string) => `${chat(guid)}/properties`;
export const chatName = (guid: string) => `${chat(guid)}/name`
export const chatParticipants = (guid: string) => `${chat(guid)}/participants`
export const chatMessages = (guid: string) => `${chat(guid)}/messages`
// export const chatMessagesTapbacks = (guid: string) => `${chatMessages(guid)}/tapbacks`
// export const chatMessage = (chatGUID: string, messageGUID: string) => `${chatMessages(chatGUID)}/${messageGUID}`
// export const chatMessageTapbacks = (chatGUID: string, messageGUID: string) => `${chatMessage(chatGUID, messageGUID)}/tapbacks`
export const handles = "/handles"
export const handleBlocks = `${handles}/blocked`
export const handleBlock = (id: string) => `${handleBlocks}/${id}`
export const search = "/search"
export const searchMessages = `${search}/messages`
export const contacts = "/contacts"
export const contact = (id: string) => `${contacts}/${id}`
export const contactPhoto = (id: string) => `${contact(id)}/photo`
