import { Client } from "../client/client";

export abstract class Base<T = any> {
    constructor(public client: Client, data: T = null) {
        this._patch(data);
    }

    abstract _patch(data: T): this;

    protected get rest() {
        return this.client.rest;
    }
}