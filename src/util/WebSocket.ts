import { browser } from "./Constants";

if (browser) {
    exports.WebSocket = window.WebSocket;
    exports.TextDecoder = window.TextDecoder;
} else {
    exports.WebSocket = require('ws');
    exports.TextDecoder = require('util').TextDecoder;
}

export declare const WebSocket: typeof window.WebSocket;
export declare const TextDecoder: typeof window.TextDecoder;