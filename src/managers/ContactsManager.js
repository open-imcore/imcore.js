"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsManager = void 0;
const BaseManager_1 = require("./BaseManager");
const Contact_1 = require("../structures/Contact");
class ContactsManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, Contact_1.Contact, "id");
    }
    contactWithHandle(id) {
        return this.cache.find(c => c.handleIDs.includes(id));
    }
}
exports.ContactsManager = ContactsManager;
//# sourceMappingURL=ContactsManager.js.map