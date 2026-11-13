import { NativeFunctions } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { ScString } from "../core/scstring.js";
import { Callbacks } from "../natives/callbacks.js";

export class MenuButton {
  static labelField = Memory.allocUtf8String(constants.Menu_modButtonField);
  static button = null;

  static create(action) {
    if (this.button !== null) return this.button;
    const sc = Memory.allocUtf8String(constants.Ui_sc);
    const clipName = Memory.allocUtf8String(constants.Menu_modButtonClip);
    const clip = NativeFunctions.getMovieClip(sc, clipName, 0);
    this.button = NativeFunctions.malloc(constants.Menu_buttonSize);
    NativeFunctions.customButtonCtor(this.button);
    NativeFunctions.customButtonSetMovieClip(this.button, clip, 1);
    NativeFunctions.setXY(this.button, constants.Menu_modButtonX, constants.Menu_modButtonY);
    const label = ScString.alloc(constants.Menu_modButtonLabel);
    NativeFunctions.movieClipSetText(clip, this.labelField, label);
    ScString.destroy(label);
    this.button.add(structs.DisplayObject_interactive).writeU8(1);
    NativeFunctions.setVisible(this.button, 1);
    NativeFunctions.stageAddChild(NativeFunctions.stageInstance(), this.button);
    Callbacks.registerButton(this.button, action);
    return this.button;
  }
}
