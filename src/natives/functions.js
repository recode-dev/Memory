import { offsets } from "./offsets.js";

export let getMovieClip = null;
export let setText = null;
export let setFontSize = null;
export let setTextColor = null;
export let setXY = null;
export let setVisibility = null;
export let addChild = null;
export let spriteCtor = null;
export let updateHealthBar = null;
export let popupCtor = null;
export let popupClose = null;
export let gotoAndStopFrameIndex = null;
export let setChildVisible = null;
export let guiGetInstance = null;
export let guiShowPopup = null;
export let customButtonCtor = null;
export let customButtonSetMovieClip = null;
export let stageAddChild = null;
export let setScale = null;
export let movieClipSetText = null;
export let getTextFieldByName = null;
export let createBlingTextField = null;
export let getDataById = null;
export let stringCtor = null;
export let stringDtor = null;
export let malloc = null;
let stageBase = null;
export function stageInstance() {
  return stageBase.add(offsets.Stage_instance).readPointer();
}
export function initFunctions(base) {
  getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
  setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
  setFontSize = new NativeFunction(base.add(offsets.TextField_setFontSize), "void", ["pointer", "uint16"]);
  setTextColor = new NativeFunction(base.add(offsets.TextField_setTextColor), "void", ["pointer", "uint"]);
  setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
  setVisibility = new NativeFunction(base.add(offsets.DisplayObject_setVisibility), "void", ["pointer", "int"]);
  addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
  spriteCtor = new NativeFunction(base.add(offsets.Sprite_ctor), "pointer", ["pointer", "int"]);
  updateHealthBar = new NativeFunction(base.add(offsets.Character_updateHealthBar), "void", ["pointer", "float"]);
  popupCtor = new NativeFunction(base.add(offsets.GenericPopup_ctor), "pointer", ["pointer", "pointer", "int", "int", "pointer", "pointer", "pointer", "pointer", "pointer"]);
  popupClose = new NativeFunction(base.add(offsets.GenericPopup_onCloseButton), "void", ["pointer"]);
  gotoAndStopFrameIndex = new NativeFunction(base.add(offsets.MovieClip_gotoAndStopFrameIndex), "void", ["pointer", "int"]);
  setChildVisible = new NativeFunction(base.add(offsets.MovieClip_setChildVisible), "void", ["pointer", "pointer", "int"]);
  guiGetInstance = new NativeFunction(base.add(offsets.GUI_getInstance), "pointer", []);
  guiShowPopup = new NativeFunction(base.add(offsets.GUI_showPopup), "pointer", ["float", "float", "pointer", "pointer", "int", "ulong", "int"]);
  customButtonCtor = new NativeFunction(base.add(offsets.CustomButton_ctor), "void", ["pointer"]);
  stageBase = base;
  customButtonSetMovieClip = new NativeFunction(base.add(offsets.CustomButton_setMovieClip), "void", ["pointer", "pointer", "int"]);
  stageAddChild = new NativeFunction(base.add(offsets.Stage_addChild), "void", ["pointer", "pointer"]);
  setScale = new NativeFunction(base.add(offsets.DisplayObject_setScale), "void", ["pointer", "float"]);
  getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
  movieClipSetText = new NativeFunction(base.add(offsets.MovieClip_setText), "void", ["pointer", "pointer", "pointer"]);
  createBlingTextField = new NativeFunction(base.add(offsets.BlingTextField_create), "pointer", ["pointer", "pointer", "pointer"]);
  getDataById = new NativeFunction(base.add(offsets.LogicDataTables_getData), "pointer", ["long", "int"]);
  stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
  stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
  malloc = new NativeFunction(Module.getGlobalExportByName("malloc"), "pointer", ["int"]);
}

