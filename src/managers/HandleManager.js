"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleManager = void 0;
const BaseManager_1 = require("./BaseManager");
const Handle_1 = require("../structures/Handle");
class HandleManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, Handle_1.Handle, "id");
    }
}
exports.HandleManager = HandleManager;
//# sourceMappingURL=HandleManager.js.map