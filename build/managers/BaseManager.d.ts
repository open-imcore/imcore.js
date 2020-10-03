import { Client } from "../client/client";
import Collection from "@discordjs/collection";
import { Base } from "../structures/Base";
declare type ConstructorType<T> = T extends Base ? new (client: Client, data: any) => T : never;
/**
 * Manages the API methods of a data model and holds its cache.
 * @exeternal https://github.com/discordjs/discord.js/blob/master/src/managers/BaseManager.js
 * @abstract
 */
export declare abstract class BaseManager<T extends Base, R = any> {
    client: Client;
    protected Structure: ConstructorType<T>;
    protected idKey: keyof T & keyof R;
    protected cache: Collection<string, T>;
    protected constructor(client: Client, Structure: ConstructorType<T>, idKey: keyof T & keyof R);
    get map(): Collection<string, T>['map'];
    get forEach(): Collection<string, T>['forEach'];
    get allKeys(): string[];
    get allValues(): T[];
    add(data: R): T | Promise<T>;
    /**
     * Removes a data entry
     * @param idOrInstance The id or instance of something in this Manager
     */
    delete(idOrInstance: string | T): T;
    /**
     * Returns whether or not this manager is tracking a given object
     * @param idOrInstance data to check
     */
    contains(idOrInstance: string | T): boolean;
    /**
     * Resolves a data entry to a data Object.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?Object} An instance from this Manager
     */
    resolve(idOrInstance: string | T): T | null;
    /**
     * Resolves a data entry to a instance ID.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?string}
     */
    resolveID(idOrInstance: string | T): string | null;
    valueOf(): Collection<string, T>;
}
export {};
