import { Client } from "../client/client";

export abstract class Base<T = any> {
    constructor(public client: Client, data: T = null) {
        this._patch(data);
    }

    abstract _patch(data: T): this;

    protected get http() {
        return this.client.http;
    }

    protected get get() {
        return this.http.get;
    }

    protected get post() {
        return this.http.post;
    }

    protected get patch() {
        return this.http.patch;
    }

    protected get put() {
        return this.http.put;
    }

    protected get delete() {
        return this.http.delete;
    }
}