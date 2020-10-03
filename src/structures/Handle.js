"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
const Base_1 = require("./Base");
class Handle extends Base_1.Base {
    /**
     * Block this handle
     */
    async block() {
        await this.rest.handles.block(this.id);
    }
    /**
     * Unblock this handle
     */
    async unblock() {
        await this.rest.handles.unblock(this.id);
    }
    get pictureURL() {
        return this.contact?.pictureURL || null;
    }
    get hasPicture() {
        return this.contact?.hasPicture || false;
    }
    get fullName() {
        return this.contact?.fullName || null;
    }
    get firstName() {
        return this.contact?.firstName || null;
    }
    get lastName() {
        return this.contact?.lastName || null;
    }
    get contact() {
        return this.client.contactForHandleID(this.id);
    }
    get shortName() {
        return this.contact?.firstName || this.contact?.nickname || this.contact?.lastName || this.id;
    }
    get name() {
        return this.contact?.fullName || this.id;
    }
    _patch({ id, format }) {
        this.id = id;
        this.format = format;
        return this;
    }
}
exports.Handle = Handle;
//# sourceMappingURL=Handle.js.map