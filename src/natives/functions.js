import { offsets } from "./offsets.js";

function resolveExport(name) {
  if (typeof Module.getGlobalExportByName === "function") {
    return Module.getGlobalExportByName(name);
  }
  return Module.getExportByName(null, name);
}
export var getMovieClip = null;
var getTextFieldByName = null;
export var setText = null;
export var setFontSize = null;
export var setTextColor = null;
export var setXY = null;
export var setVisibility = null;
export var addChild = null;
export var spriteCtor = null;
export var updateHealthBar = null;
export var popupCtor = null;
var popupSetTitle = null;
var popupAddChildButton = null;
var popupHideDefaults = null;
var gotoAndStopFrameIndex = null;
export var setChildVisible = null;
var movieClipByName = null;
export var guiGetInstance = null;
export var guiShowPopup = null;
export var customButtonCtor = null;
export var customButtonSetMovieClip = null;
export var stageAddChild = null;
export var setScale = null;
export var setSize = null;
var getBounds = null;
var getBox = null;
var setHeight = null;
var setWidth = null;
export var movieClipSetText = null;
export var createBlingTextField = null;
export var getDataById = null;
export var stringCtor = null;
export var stringDtor = null;
export var malloc = null;
var stageBase = null;
export function stageInstance() {
  return stageBase.add(offsets.Stage_instance).readPointer();
}
export function initFunctions(base) {
  getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
  getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
  setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
  setFontSize = new NativeFunction(base.add(offsets.TextField_setFontSize), "void", ["pointer", "uint16"]);
  setTextColor = new NativeFunction(base.add(offsets.TextField_setTextColor), "void", ["pointer", "uint"]);
  setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
  setVisibility = new NativeFunction(base.add(offsets.DisplayObject_setVisibility), "void", ["pointer", "int"]);
  addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
  spriteCtor = new NativeFunction(base.add(offsets.Sprite_ctor), "pointer", ["pointer", "int"]);
  updateHealthBar = new NativeFunction(base.add(offsets.Character_updateHealthBar), "void", ["pointer", "float"]);
  popupCtor = new NativeFunction(base.add(offsets.GenericPopup_ctor), "pointer", ["pointer", "pointer", "int", "int", "pointer", "pointer", "pointer", "pointer", "pointer"]);
  popupSetTitle = new NativeFunction(base.add(offsets.GenericPopup_setTitle), "void", ["pointer", "pointer"]);
  popupAddChildButton = new NativeFunction(base.add(offsets.GenericPopup_addChildButton), "pointer", ["pointer", "pointer", "pointer"]);
  popupHideDefaults = new NativeFunction(base.add(offsets.GenericPopup_hideDefaults), "void", ["pointer"]);
  gotoAndStopFrameIndex = new NativeFunction(base.add(offsets.MovieClip_gotoAndStopFrameIndex), "void", ["pointer", "int"]);
  setChildVisible = new NativeFunction(base.add(offsets.MovieClip_setChildVisible), "void", ["pointer", "pointer", "int"]);
  movieClipByName = new NativeFunction(base.add(offsets.MovieClip_getByName), "pointer", ["pointer", "pointer", "int"]);
  guiGetInstance = new NativeFunction(base.add(offsets.GUI_getInstance), "pointer", []);
  guiShowPopup = new NativeFunction(base.add(offsets.GUI_showPopup), "pointer", ["float", "float", "pointer", "pointer", "int", "ulong", "int"]);
  customButtonCtor = new NativeFunction(base.add(offsets.CustomButton_ctor), "void", ["pointer"]);
  stageBase = base;
  customButtonSetMovieClip = new NativeFunction(base.add(offsets.CustomButton_setMovieClip), "void", ["pointer", "pointer", "int"]);
  stageAddChild = new NativeFunction(base.add(offsets.Stage_addChild), "void", ["pointer", "pointer"]);
  setScale = new NativeFunction(base.add(offsets.DisplayObject_setScale), "void", ["pointer", "float"]);
  setSize = new NativeFunction(base.add(offsets.DisplayObject_setSize), "void", ["pointer", "float", "float"]);
  getBounds = new NativeFunction(base.add(offsets.DisplayObject_getBounds), "void", ["pointer", "pointer", "pointer", "pointer", "uchar", "int"]);
  getBox = new NativeFunction(base.add(offsets.DisplayObject_getBox), "void", ["pointer", "pointer", "pointer", "int"]);
  setHeight = new NativeFunction(base.add(offsets.DisplayObject_setHeight), "void", ["pointer", "float"]);
  setWidth = new NativeFunction(base.add(offsets.DisplayObject_setWidth), "void", ["pointer", "float"]);
  movieClipSetText = new NativeFunction(base.add(offsets.MovieClip_setText), "void", ["pointer", "pointer", "pointer"]);
  createBlingTextField = new NativeFunction(base.add(offsets.BlingTextField_create), "pointer", ["pointer", "pointer", "pointer"]);
  getDataById = new NativeFunction(base.add(offsets.LogicDataTables_getData), "pointer", ["long", "int"]);
  stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
  stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
  malloc = new NativeFunction(resolveExport("malloc"), "pointer", ["int"]);
}
