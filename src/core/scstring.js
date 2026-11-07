import { offsets } from "./offsets.js";

const _zero = new Uint8Array(offsets.ScString_width);
let _ctor = null;

export function initScString(base) {
    if (_ctor) return;
    _ctor = new NativeFunction(base.add(offsets.String_String), "pointer", ["pointer", "pointer"]);
}

export function makeScString(str) {
    const sc = Memory.alloc(offsets.ScString_width);
    sc.writeByteArray(_zero);
    _ctor(sc, Memory.allocUtf8String(str));
    return sc;
}

export function readScString(ptr) {
    const len = ptr.add(offsets.ScString_length).readU32();
    const dataField = ptr.add(offsets.ScString_data);
    const data = len <= offsets.ScString_inline_max ? dataField : dataField.readPointer();
    return data.readUtf8String(len);
}