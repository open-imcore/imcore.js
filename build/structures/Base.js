"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
class Base {
    constructor(client, data = null) {
        this.client = client;
        this._patch(data);
    }
    get rest() {
        return this.client.rest;
    }
}
exports.Base = Base;
//# sourceMappingURL=Base.js.map