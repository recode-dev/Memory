import { offsets } from "./offsets.js";
import { constants } from "./constants.js";

function resolveExport(name) {
    if (typeof Module.getGlobalExportByName === "function") {
        return Module.getGlobalExportByName(name);
    }
    return Module.getExportByName(null, name);
}

let _init = false;

export let getMovieClip = null;
export let getTextFieldByName = null;
export let setText = null;
export let setFontSize = null;
export let setTextColor = null;
export let setXY = null;
export let setVisibility = null;
export let addChild = null;
export let updateHealthBar = null;
export let createBlingTextField = null;
export let getDataById = null;
export let resolveGradient = null;
export let stringCtor = null;
export let stringDtor = null;
export let malloc = null;

export function initFunctions(base) {
    if (_init) return;
    _init = true;

    getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
    getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
    setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
    setFontSize = new NativeFunction(base.add(offsets.TextField_setFontSize), "void", ["pointer", "uint16"]);
    setTextColor = new NativeFunction(base.add(offsets.TextField_setTextColor), "void", ["pointer", "uint"]);
    setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
    setVisibility = new NativeFunction(base.add(offsets.DisplayObject_setVisibility), "void", ["pointer", "int"]);
    addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
    updateHealthBar = new NativeFunction(base.add(offsets.Character_updateHealthBar), "void", ["pointer", "float"]);
    createBlingTextField = new NativeFunction(base.add(offsets.BlingTextField_create), "pointer", ["pointer", "pointer", "pointer"]);
    getDataById = new NativeFunction(base.add(offsets.LogicDataTables_getData), "pointer", ["long", "int"]);
    resolveGradient = (classId, itemId) => getDataById(classId * constants.LogicDataTables_globalIdStep + itemId, classId);
    stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
    stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
    malloc = new NativeFunction(resolveExport("malloc"), "pointer", ["int"]);
}
