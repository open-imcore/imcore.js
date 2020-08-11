import { WebSocket, TextDecoder } from "../../util/WebSocket";
import pako from "pako";
import { error } from "../../util/log";
import { Events, EventType } from "./events";
import { EventEmitter } from "events";

export interface Event<T extends EventType> {
    type: T;
    data: Events[T];
}

export function isEvent(e: any): e is Event<EventType> {
    return typeof e === "object"
        && typeof e.type === "string"
        && typeof e.data === "object";
}

export declare interface WebSocketManager {
    on<T extends EventType>(event: T, listener: (data: Events[T]) => void): this;
    on(event: string, listener: Function): this;
}

export class WebSocketManager extends EventEmitter {
    private socket: WebSocket;
    private decoder = new TextDecoder("utf-8");

    constructor(public readonly url: string) {
        super();
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('message', message => {
            if (typeof message.data === "string") {
                return this.parse(message.data);
            }

            const uint8 = pako.inflateRaw(new Uint8Array(message.data as ArrayBuffer));

            this.parse(this.decoder.decode(uint8));
        });
    }

    private parse(raw: string) {
        try {
            var payload = JSON.parse(raw);
        } catch (e) {
            error(`Failed to parse payload from server`, e)
            return
        }

        if (!isEvent(payload)) {
            return
        }

        this.emit(payload.type, payload.data);
    }
}