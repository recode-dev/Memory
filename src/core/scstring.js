import { constants } from "../natives/constants.js";
import { malloc, stringCtor, stringDtor } from "../natives/functions.js";

export function allocScString(text) {
    const sc = malloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    return sc;
}

export function destroyScString(sc) {
    stringDtor(sc);
}

export function withScString(text, fn) {
    const sc = Memory.alloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    const result = fn(sc);
    stringDtor(sc);
    return result;
}
