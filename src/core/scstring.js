import { constants } from "../natives/constants.js";
import { stringCtor, stringDtor } from "../natives/functions.js";

export function makeScString(text) {
    const sc = Memory.alloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    return sc;
}

export function destroyScString(sc) {
    stringDtor(sc);
}

export function withScString(text, fn) {
    const sc = makeScString(text);
    const result = fn(sc);
    destroyScString(sc);
    return result;
}
