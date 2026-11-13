import { NativeFunctions } from "./functions.js";
import { structs } from "./structs.js";
import { flags } from "../utils/flags.js";

export class Callbacks {
  static buttons = new Map();

  static showAmmo(character) {
    const clip = character.add(structs.Character_ammoClip).readPointer();
    if (clip.isNull()) return;
    clip.add(structs.DisplayObject_visible).writeU8(1);
  }

  static registerButton(button, action) {
    this.buttons.set(button.toString(), action);
  }

  static unregisterButton(button) {
    this.buttons.delete(button.toString());
  }

  static buttonAction(button) {
    return this.buttons.get(button.toString());
  }

  static updateHealthBarCallback = new NativeCallback((character, deltaTime) => {
    NativeFunctions.updateHealthBar(character, deltaTime);
    if (flags.enemyAmmo) Callbacks.showAmmo(character);
  }, "void", ["pointer", "float"]);
}
