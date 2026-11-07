import { offsets } from "./offsets.js";

let _init = false;

export let getMovieClip = null;
export let getTextFieldByName = null;
export let setText = null;
export let setMultiLine = null;
export let setXY = null;
export let addChild = null;
export let stringCtor = null;
export let stringDtor = null;
export let malloc = null;

export function initFunctions(base) {
    if (_init) return;
    _init = true;

    getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
    getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
    setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
    setMultiLine = new NativeFunction(base.add(offsets.TextField_setMultiLine), "void", ["pointer", "bool"]);
    setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["float", "float", "pointer"]);
    addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
    stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
    stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
    malloc = new NativeFunction(Module.getGlobalExportByName("malloc"), "pointer", ["int"]);
}
