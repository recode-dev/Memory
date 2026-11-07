import
{
    offsets
}
from "./offsets.js";
import
{
    constants
}
from "./constants.js";
import
{
    getFunctions
}
from "./functions.js";

export function readScString(value, maxLength = constants.ScString_max_length)
{
    const length = value.add(offsets.ScString_length).readS32();
    if (length <= 0 || length > maxLength) return null;
    const data = length <= constants.ScString_inline_max ?
        value.add(offsets.ScString_data) :
        value.add(offsets.ScString_data).readPointer();
    return data.readUtf8String(length);
}

export function withScString(text, fn)
{
    const fns = getFunctions();
    const sc = Memory.alloc(constants.ScString_width);
    fns.StringCtor(sc, Memory.allocUtf8String(text));
    const result = fn(sc);
    fns.ScString_destruct(sc);
    return result;
}