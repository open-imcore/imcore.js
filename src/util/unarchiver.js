"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unarchiveBase64EncodedBPlist = void 0;
function cleanValue(nested, objects) {
    if (typeof nested === "object")
        walk(nested, objects);
    if (typeof nested === "object" && nested["NS.relative"])
        nested = nested["NS.relative"];
    if (typeof nested === "object" && typeof nested["NS.objects"] === "object" && Array.isArray(nested["NS.objects"])) {
        var resolved;
        nested["NS.objects"].forEach((o, i, a) => {
            a[i] = cleanValue(objects[o.UID], objects);
        });
        resolved = nested["NS.objects"];
        if (typeof nested["NS.keys"] === "object" && Array.isArray(nested["NS.keys"])) {
            nested["NS.keys"].forEach((o, i, a) => {
                a[i] = cleanValue(objects[o.UID], objects);
            });
            resolved = nested["NS.keys"].reduce((obj, key, index) => {
                return Object.assign(obj, { [key]: resolved[index] });
            }, {});
        }
        nested = resolved;
    }
    if (typeof nested === "object" && nested["$class"])
        delete nested["$class"];
    return nested;
}
function walk(object, objects) {
    Object.entries(object).forEach(([key, value]) => {
        if (typeof value !== "object")
            return value;
        if (Array.isArray(value))
            return value.forEach(obj => walk(obj, objects));
        if (!value.UID)
            return walk(value, objects);
        let nested = cleanValue(objects[value.UID], objects);
        object[key] = nested;
    });
}
function deserializeArchiveRoot({ $top, $objects }) {
    const rootIndex = $top.root.UID;
    console.log(JSON.stringify($objects));
    $objects.forEach(o => walk(o, $objects));
    const root = $objects[rootIndex];
    return root;
}
function unarchiveBase64EncodedBPlist(rawPayload) {
    if (typeof atob === "undefined") {
        var atob = require("atob");
    }
    if (typeof Buffer === "undefined") {
        var Buffer = require("buffer").Buffer;
    }
    const byteChars = atob(rawPayload);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const roots = require("bplist-parser").parseBuffer(new Buffer(new Uint8Array(byteNumbers)));
    return roots.map(r => deserializeArchiveRoot(r));
}
exports.unarchiveBase64EncodedBPlist = unarchiveBase64EncodedBPlist;
//# sourceMappingURL=unarchiver.js.map