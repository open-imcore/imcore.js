import { Client } from "../client/client";
export declare abstract class Base<T = any> {
    client: Client;
    constructor(client: Client, data?: T);
    abstract _patch(data: T): this;
    protected get rest(): import("imcore-ajax-core").IMHTTPClient;
}
