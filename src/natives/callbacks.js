import { updateHealthBar } from "./functions.js";
import { structs } from "./structs.js";
import { flags } from "../utils/flags.js";

let buttons = new Map();
function showAmmo(character) {
  const clip = character.add(structs.Character_ammoClip).readPointer();
  if (clip.isNull()) return;
  clip.add(structs.DisplayObject_visible).writeU8(1);
}
export function isAntiAfkEnabled() {
  return flags.antiAfk;
}
export function registerButton(button, action) {
  buttons.set(button.toString(), action);
}
export function unregisterButton(button) {
  buttons.delete(button.toString());
}
export function buttonAction(button) {
  return buttons.get(button.toString());
}
export let updateHealthBarCallback = new NativeCallback(function(character, deltaTime) {
  updateHealthBar(character, deltaTime);
  if (flags.enemyAmmo) showAmmo(character);
}, "void", ["pointer", "float"]);
