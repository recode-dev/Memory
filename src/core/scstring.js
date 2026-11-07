import { offsets } from "./offsets.js";

var _ctor = null;

export function initScString(base) {
    if (!_ctor) {
        _ctor = new NativeFunction(base.add(offsets.String_String), "pointer", ["pointer", "pointer"]);
    }
}

export function makeScString(str, base) {
    if (!_ctor) initScString(base);
    const sc = Memory.alloc(offsets.ScString_width);
    sc.writeByteArray(new Uint8Array(offsets.ScString_width));
    _ctor(sc, Memory.allocUtf8String(str));
    return sc;
}

export function readScString(ptr) {
    const len = ptr.add(offsets.ScString_length).readU32();
    const dataField = ptr.add(offsets.ScString_data);
    const data = len <= offsets.ScString_inline_max ? dataField : dataField.readPointer();
    return data.readUtf8String(len);
}