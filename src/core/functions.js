import { offsets } from "./offsets.js";

let _init = false;

export let homePageCtor = null;
export let getMovieClip = null;
export let getFieldByName = null;
export let setText = null;
export let addChild = null;
export let stringCtor = null;
export let scStringDtor = null;
export let setXY = null;

export function initFunctions(base) {
    if (_init) return;
    _init = true;

    homePageCtor = new NativeFunction(base.add(offsets.HomePage_ctor), "pointer", ["pointer"]);
    getMovieClip = new NativeFunction(base.add(offsets.ResourceManager_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
    getFieldByName = new NativeFunction(base.add(offsets.MovieClip_getFieldByName), "pointer", ["pointer", "pointer"]);
    setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
    addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
    stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
    scStringDtor = new NativeFunction(base.add(offsets.ScString_dtor), "void", ["pointer"]);
    setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
}