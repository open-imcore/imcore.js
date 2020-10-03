"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseManager = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
/**
 * Manages the API methods of a data model and holds its cache.
 * @exeternal https://github.com/discordjs/discord.js/blob/master/src/managers/BaseManager.js
 * @abstract
 */
class BaseManager {
    constructor(client, Structure, idKey) {
        this.client = client;
        this.Structure = Structure;
        this.idKey = idKey;
        this.cache = new collection_1.default();
    }
    get map() {
        return this.cache.map.bind(this.cache);
    }
    get forEach() {
        return this.cache.forEach.bind(this.cache);
    }
    get allKeys() {
        return Array.from(this.cache.keys());
    }
    get allValues() {
        return Array.from(this.cache.values());
    }
    add(data) {
        if (!data)
            return null;
        const id = data[this.idKey];
        const existing = this.cache.get(id);
        if (existing && existing._patch)
            existing._patch(data);
        if (existing)
            return existing;
        const entry = new this.Structure(this.client, data);
        this.cache.set(id, entry);
        return entry;
    }
    /**
     * Removes a data entry
     * @param idOrInstance The id or instance of something in this Manager
     */
    delete(idOrInstance) {
        var oldInstance, id;
        if (idOrInstance instanceof this.Structure) {
            oldInstance = idOrInstance;
            id = idOrInstance[this.idKey];
        }
        else {
            oldInstance = this.resolve(idOrInstance);
            id = idOrInstance;
        }
        this.cache.delete(id);
        return oldInstance;
    }
    /**
     * Returns whether or not this manager is tracking a given object
     * @param idOrInstance data to check
     */
    contains(idOrInstance) {
        const id = this.resolveID(idOrInstance);
        if (id === null)
            return false;
        return this.cache.has(id);
    }
    /**
     * Resolves a data entry to a data Object.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?Object} An instance from this Manager
     */
    resolve(idOrInstance) {
        if (idOrInstance instanceof this.Structure)
            return idOrInstance;
        if (typeof idOrInstance === 'string')
            return this.cache.get(idOrInstance) || null;
        return null;
    }
    /**
     * Resolves a data entry to a instance ID.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?string}
     */
    resolveID(idOrInstance) {
        if (idOrInstance instanceof this.Structure)
            return idOrInstance[this.idKey] || null;
        if (typeof idOrInstance === 'string')
            return idOrInstance;
        return null;
    }
    // abstract fetch(id: string): Promise<T | null>;
    // abstract create(using: T): Promise<T | null>;
    valueOf() {
        return this.cache;
    }
}
exports.BaseManager = BaseManager;
//# sourceMappingURL=BaseManager.js.map