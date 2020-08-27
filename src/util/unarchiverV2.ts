/** Data structure as it appears from bplist parser **/
interface ArchiveRoot {
  $version: number;
  $archiver: string;
  $top: {
    root: WeakLink;
  };
  $objects: any[];
}

/** Base for an archived NSObject **/
interface NSArchivedObject {
  $class: {
    $classname: string;
  }
}

/** Archived NSDictionary **/
interface NSArchivedDictionary extends NSArchivedObject {
  "NS.keys": WeakLink[];
  "NS.objects": WeakLink[];
}

interface NSArchivedArray extends NSArchivedObject {
  "NS.objects": WeakLink[];
}

/** Archived NSURL **/
interface NSArchivedURL extends NSArchivedObject {
  "NS.relative": string;
}

/** Reference to another archive element **/
type WeakLink = {UID: number};

const isWeakLink = (obj: any): obj is WeakLink => typeof obj === "object" && obj !== null && typeof obj["UID"] === "number";

const isNSArchivedObject = (obj: any): obj is NSArchivedObject => typeof obj === "object" && obj !== null && typeof obj["$class"] === "object" && typeof obj["$class"]["$classname"] === "string";
const isNSArchivedDictionary = (obj: any): obj is NSArchivedDictionary => isNSArchivedObject(obj) && typeof obj["NS.keys"] === "object" && typeof obj["NS.objects"] === "object";
const isNSArchivedArray = (obj: any): obj is NSArchivedArray => isNSArchivedObject(obj) && typeof obj["NS.objects"] === "object";
const isNSArchivedURL = (obj: any): obj is NSArchivedURL => isNSArchivedObject(obj) && obj.$class.$classname === "NSURL";
const extractWeakLinks = (links: WeakLink[], data: any[]) => links.map(({ UID }) => data[UID]);

function unarchiveDictionary({ "NS.keys": keyLinks, "NS.objects": valueLinks }: NSArchivedDictionary, root: any[]) {
  const keys = extractWeakLinks(keyLinks, root);
  const values = extractWeakLinks(valueLinks, root);

  return keys.reduce((acc, c, idx) => Object.assign(acc, { [c]: values[idx] }), {});
}

function unarchiveArray({ "NS.objects": valueLinks }: NSArchivedArray, root: any[]) {
  return extractWeakLinks(valueLinks, root);
}

function testForKnownClasses(item: NSArchivedObject, objects: any[]): any {
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
        return new URL(item['NS.relative'])
      } catch {
        return item['NS.relative'];
      }
    case "NSData":
    case "NSMutableData":
      break
    case "NSUUID":
      break
    default:
      break
  }

  return item;
}

function parse(objects: any[]) {
  const firstPass = objects.map(object => {
    if (typeof object === "object" && object !== null) {
      Object.entries(object).forEach(([key, value]) => {
        if (!isWeakLink(value)) return;
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
        if (!isNSArchivedObject(value)) return;
        object[key] = testForKnownClasses(value, firstPass);
      });
    }
  });

  return firstPass;
}

function extractArchive(archive: ArchiveRoot) {
  const objects = parse(archive.$objects);

  return objects[archive.$top.root.UID];
}

export function unarchiveBase64EncodedBPlist(rawPayload: string) {
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

  const roots: ArchiveRoot[] = require("bplist-parser").parseBuffer(new Buffer(new Uint8Array(byteNumbers)));

  return roots.map(r => extractArchive(r));
}
