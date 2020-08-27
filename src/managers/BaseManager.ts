import { Client } from "../client/client";
import Collection from "@discordjs/collection";
import { Base } from "../structures/Base";


type ConstructorType<T> = T extends Base ? new (client: Client, data: any) => T : never;

/**
 * Manages the API methods of a data model and holds its cache.
 * @exeternal https://github.com/discordjs/discord.js/blob/master/src/managers/BaseManager.js
 * @abstract
 */
export abstract class BaseManager<T extends Base, R = any> {
    protected cache: Collection<string, T> = new Collection();

    protected constructor(public client: Client, protected Structure: ConstructorType<T>, protected idKey: keyof T & keyof R) {

    }

    get map(): Collection<string, T>['map'] {
        return this.cache.map.bind(this.cache);
    }

    get forEach(): Collection<string, T>['forEach'] {
        return this.cache.forEach.bind(this.cache);
    }

    get allKeys(): string[] {
        return Array.from(this.cache.keys());
    }

    get allValues(): T[] {
        return Array.from(this.cache.values());
    }

    add(data: R): T | Promise<T> {
        if (!data) return null;
        const id = data[this.idKey] as unknown as string;
        const existing = this.cache.get(id);
        if (existing && existing._patch) existing._patch(data);
        if (existing) return existing;

        const entry = new this.Structure(this.client, data) as T;
        this.cache.set(id, entry);
        return entry;
    }

    /**
     * Removes a data entry
     * @param idOrInstance The id or instance of something in this Manager
     */
    delete(idOrInstance: string | T): T {
        var oldInstance: T, id: string

        if (idOrInstance instanceof this.Structure) {
            oldInstance = idOrInstance
            id = idOrInstance[this.idKey] as unknown as string;
        } else {
            oldInstance = this.resolve(idOrInstance)
            id = idOrInstance
        }

        this.cache.delete(id);

        return oldInstance
    }

    /**
     * Returns whether or not this manager is tracking a given object
     * @param idOrInstance data to check
     */
    contains(idOrInstance: string | T): boolean {
        const id = this.resolveID(idOrInstance);
        if (id === null) return false;
        return this.cache.has(id);
    }

    /**
     * Resolves a data entry to a data Object.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?Object} An instance from this Manager
     */
    resolve(idOrInstance: string | T): T | null {
        if (idOrInstance instanceof this.Structure) return idOrInstance;
        if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) || null;
        return null;
    }

    /**
     * Resolves a data entry to a instance ID.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?string}
     */
    resolveID(idOrInstance: string | T): string | null {
        if (idOrInstance instanceof this.Structure) return (idOrInstance[this.idKey] as unknown as string) || null;
        if (typeof idOrInstance === 'string') return idOrInstance;
        return null;
    }

    // abstract fetch(id: string): Promise<T | null>;
    // abstract create(using: T): Promise<T | null>;

    valueOf() {
        return this.cache;
    }
}
