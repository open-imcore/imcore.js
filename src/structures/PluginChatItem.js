"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginChatItem = void 0;
const unarchiverV2_1 = require("../util/unarchiverV2");
const AcknowledgableChatItem_1 = require("./AcknowledgableChatItem");
class PluginChatItem extends AcknowledgableChatItem_1.AcknowledgableChatItem {
    get plist() {
        if (typeof this._plist !== "object")
            return null;
        if (Array.isArray(this._plist) && this._plist.length === 1)
            return this._plist[0];
        return this._plist;
    }
    _patch({ payload, bundleID, attachments, richLink, extension, digitalTouch, ...item }) {
        this.payload = payload;
        this.bundleID = bundleID;
        this.attachments = attachments;
        this.richLink = richLink;
        this.extension = extension;
        this.digitalTouch = digitalTouch;
        if (payload) {
            try {
                this._plist = unarchiverV2_1.unarchiveBase64EncodedBPlist(payload);
            }
            catch (e) {
                this.client.emit('debug', { level: 'warn', messages: ['failed to unarchive plist with error', e] });
            }
        }
        return super._patch(item);
    }
}
exports.PluginChatItem = PluginChatItem;
//# sourceMappingURL=PluginChatItem.js.map