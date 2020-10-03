"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOptions = exports.ChatItemType = exports.browser = void 0;
exports.browser = typeof window !== 'undefined';
var ChatItemType;
(function (ChatItemType) {
    ChatItemType["date"] = "date";
    ChatItemType["sender"] = "sender";
    ChatItemType["participantChange"] = "participantChange";
    ChatItemType["attachment"] = "attachment";
    ChatItemType["status"] = "status";
    ChatItemType["groupAction"] = "groupAction";
    ChatItemType["plugin"] = "plugin";
    ChatItemType["text"] = "text";
    ChatItemType["acknowledgment"] = "acknowledgment";
    ChatItemType["associated"] = "associated";
    ChatItemType["message"] = "message";
    ChatItemType["phantom"] = "phantom";
    ChatItemType["groupTitle"] = "groupTitle";
    ChatItemType["typing"] = "typing";
    ChatItemType["sticker"] = "sticker";
})(ChatItemType = exports.ChatItemType || (exports.ChatItemType = {}));
exports.DefaultOptions = {
    gateway: "ws://127.0.0.1:8090/stream",
    apiHost: "http://127.0.0.1:8090"
};
//# sourceMappingURL=Constants.js.map