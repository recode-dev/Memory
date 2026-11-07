import { structs } from "./structs.js";
import { constants } from "./constants.js";
import { stringCtor, scStringDtor } from "./functions.js";

export function makeScString(text) {
    const sc = Memory.alloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    return sc;
}

export function destroyScString(sc) {
    scStringDtor(sc);
}

export function readScString(value, maxLength = constants.ScString_max_length) {
    const length = value.add(structs.ScString_length).readS32();
    if (length <= 0 || length > maxLength) return null;
    const data = length <= constants.ScString_inline_max ?
        value.add(structs.ScString_data) :
        value.add(structs.ScString_data).readPointer();
    return data.readUtf8String(length);
}

export function withScString(text, fn) {
    const sc = makeScString(text);
    const result = fn(sc);
    destroyScString(sc);
    return result;
}
