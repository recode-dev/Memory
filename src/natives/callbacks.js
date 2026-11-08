import { updateHealthBar } from "./functions.js";
import { structs } from "./structs.js";

var enemyAmmo = true;
var antiAfk = true;
var buttons = new Map();
function showAmmo(character) {
  const clip = character.add(structs.Character_ammoClip).readPointer();
  if (clip.isNull()) return;
  clip.add(structs.DisplayObject_visible).writeU8(1);
}
export function isAntiAfkEnabled() {
  return antiAfk;
}
export function registerButton(button, action) {
  buttons.set(button.toString(), action);
}
export function buttonAction(button) {
  return buttons.get(button.toString());
}
export var updateHealthBarCallback = new NativeCallback(function(character, deltaTime) {
  updateHealthBar(character, deltaTime);
  if (enemyAmmo) showAmmo(character);
}, "void", ["pointer", "float"]);
