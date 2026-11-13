import { offsets } from "./offsets.js";

export class NativeFunctions {
  static init(base) {
    this.stageBase = base;
    this.battleModeGetInstance = new NativeFunction(base.add(offsets.BattleMode_getInstance), "pointer", []);
    this.getOwnCharacter = new NativeFunction(base.add(offsets.LogicBattleModeClient_getOwnCharacter), "pointer", ["pointer"]);
    this.clientInputCtor = new NativeFunction(base.add(offsets.ClientInput_constructor_int), "void", ["pointer", "int"]);
    this.clientInputManagerAddInput = new NativeFunction(base.add(offsets.ClientInputManager_addInput), "void", ["pointer", "pointer"]);
    this.setClientPredictionMoveTo = new NativeFunction(base.add(offsets.LogicBattleModeClient_setClientPredictionMoveTo), "void", ["pointer", "int", "int", "int"]);
    this.gameObjectGetX = new NativeFunction(base.add(offsets.LogicGameObjectClient_getX), "int", ["pointer"]);
    this.gameObjectGetY = new NativeFunction(base.add(offsets.LogicGameObjectClient_getY), "int", ["pointer"]);
    this.getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
    this.setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
    this.setFontSize = new NativeFunction(base.add(offsets.TextField_setFontSize), "void", ["pointer", "uint16"]);
    this.setTextColor = new NativeFunction(base.add(offsets.TextField_setTextColor), "void", ["pointer", "uint"]);
    this.setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
    this.setVisible = new NativeFunction(base.add(offsets.DisplayObject_setVisible), "void", ["pointer", "int"]);
    this.addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
    this.spriteCtor = new NativeFunction(base.add(offsets.Sprite_ctor), "pointer", ["pointer", "int"]);
    this.updateHealthBar = new NativeFunction(base.add(offsets.Character_updateHealthBar), "void", ["pointer", "float"]);
    this.popupCtor = new NativeFunction(base.add(offsets.GenericPopup_ctor), "pointer", ["pointer", "pointer", "int", "int", "pointer", "pointer", "pointer", "pointer", "pointer"]);
    this.popupClose = new NativeFunction(base.add(offsets.GenericPopup_onCloseButton), "void", ["pointer"]);
    this.gotoAndStopFrameIndex = new NativeFunction(base.add(offsets.MovieClip_gotoAndStopFrameIndex), "void", ["pointer", "int"]);
    this.setChildVisible = new NativeFunction(base.add(offsets.MovieClip_setChildVisible), "void", ["pointer", "pointer", "int"]);
    this.guiGetInstance = new NativeFunction(base.add(offsets.GUI_getInstance), "pointer", []);
    this.guiShowPopup = new NativeFunction(base.add(offsets.GUI_showPopup), "pointer", ["float", "float", "pointer", "pointer", "int", "ulong", "int"]);
    this.customButtonCtor = new NativeFunction(base.add(offsets.CustomButton_ctor), "void", ["pointer"]);
    this.customButtonSetMovieClip = new NativeFunction(base.add(offsets.CustomButton_setMovieClip), "void", ["pointer", "pointer", "int"]);
    this.stageAddChild = new NativeFunction(base.add(offsets.Stage_addChild), "void", ["pointer", "pointer"]);
    this.setScale = new NativeFunction(base.add(offsets.DisplayObject_setScale), "void", ["pointer", "float"]);
    this.getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
    this.movieClipSetText = new NativeFunction(base.add(offsets.MovieClip_setText), "void", ["pointer", "pointer", "pointer"]);
    this.createBlingTextField = new NativeFunction(base.add(offsets.BlingTextField_create), "pointer", ["pointer", "pointer", "pointer"]);
    this.getDataById = new NativeFunction(base.add(offsets.LogicDataTables_getDataById), "pointer", ["long", "int"]);
    this.stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
    this.stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
    this.malloc = new NativeFunction(Module.getGlobalExportByName("malloc"), "pointer", ["int"]);
  }

  static stageInstance() {
    return this.stageBase.add(offsets.Stage_Instance).readPointer();
  }
}
