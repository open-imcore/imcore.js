"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unarchiveBase64EncodedBPlist = void 0;
const isWeakLink = (obj) => typeof obj === "object" && obj !== null && typeof obj["UID"] === "number";
const isNSArchivedObject = (obj) => typeof obj === "object" && obj !== null && typeof obj["$class"] === "object" && typeof obj["$class"]["$classname"] === "string";
const isNSArchivedDictionary = (obj) => isNSArchivedObject(obj) && typeof obj["NS.keys"] === "object" && typeof obj["NS.objects"] === "object";
const isNSArchivedArray = (obj) => isNSArchivedObject(obj) && typeof obj["NS.objects"] === "object";
const isNSArchivedURL = (obj) => isNSArchivedObject(obj) && obj.$class.$classname === "NSURL";
const extractWeakLinks = (links, data) => links.map(({ UID }) => data[UID]);
function unarchiveDictionary({ "NS.keys": keyLinks, "NS.objects": valueLinks }, root) {
    const keys = extractWeakLinks(keyLinks, root);
    const values = extractWeakLinks(valueLinks, root);
    return keys.reduce((acc, c, idx) => Object.assign(acc, { [c]: values[idx] }), {});
}
function unarchiveArray({ "NS.objects": valueLinks }, root) {
    return extractWeakLinks(valueLinks, root);
}
function testForKnownClasses(item, objects) {
    switch (item.$class.$classname) {
        case "NSDictionary":
        case "NSMutableDictionary":
            if (!isNSArchivedDictionary(item)) {
                break;
            }
            return unarchiveDictionary(item, objects);
        case "NSArray":
            if (!isNSArchivedArray(item)) {
                break;
            }
            return unarchiveArray(item, objects);
        case "NSURL":
            if (!isNSArchivedURL(item)) {
                break;
            }
            try {
                return new URL(item['NS.relative']);
            }
            catch {
                return item['NS.relative'];
            }
        case "NSData":
        case "NSMutableData":
            break;
        case "NSUUID":
            break;
        default:
            break;
    }
    return item;
}
function parse(objects) {
    const firstPass = objects.map(object => {
        if (typeof object === "object" && object !== null) {
            Object.entries(object).forEach(([key, value]) => {
                if (!isWeakLink(value))
                    return;
                object[key] = objects[value.UID];
            });
        }
        if (isNSArchivedObject(object)) {
            object = testForKnownClasses(object, objects);
        }
        return object;
    });
    firstPass.forEach(object => {
        if (typeof object === "object" && object !== null) {
            Object.entries(object).forEach(([key, value]) => {
                if (!isNSArchivedObject(value))
                    return;
                object[key] = testForKnownClasses(value, firstPass);
            });
        }
    });
    return firstPass;
}
function extractArchive(archive) {
    const objects = parse(archive.$objects);
    return objects[archive.$top.root.UID];
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
    return roots.map(r => extractArchive(r));
}
exports.unarchiveBase64EncodedBPlist = unarchiveBase64EncodedBPlist;
//# sourceMappingURL=unarchiverV2.js.map