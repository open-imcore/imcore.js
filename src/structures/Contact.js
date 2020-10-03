"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const Base_1 = require("./Base");
class Contact extends Base_1.Base {
    toString() {
        return `Contact[id: ${this.id}; firstName: ${this.firstName}; middleName: ${this.middleName}; lastName: ${this.lastName}; fullName: ${this.fullName}; nickname: ${this.nickname}; countryCode: ${this.countryCode}; hasPicture: ${this.hasPicture};]`;
    }
    /**
     * URL to download the image for this contact
     */
    get pictureURL() {
        if (!this.hasPicture)
            return null;
        return this.rest.contactPhotoURL(this.id);
    }
    get handles() {
        return this._handles.map(({ id }) => this.client.handles.resolve(id));
    }
    get handleIDs() {
        return this._handles.map(({ id }) => id);
    }
    async refresh() {
        return this._patch(await this.rest.contacts.fetchOne(this.id));
    }
    _patch({ id, firstName, middleName, lastName, fullName, nickname, countryCode, hasPicture, handles }) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.nickname = nickname;
        this.countryCode = countryCode;
        this.hasPicture = hasPicture;
        this._handles = handles;
        return this;
    }
}
exports.Contact = Contact;
//# sourceMappingURL=Contact.js.map