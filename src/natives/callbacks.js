import { updateHealthBar } from "./functions.js";
import { structs } from "./structs.js";

var enemyAmmo = true;
var antiAfk = true;
var buttons = /* @__PURE__ */ new Map();
function showAmmo(character) {
  const clip2 = character.add(structs.Character_ammoClip).readPointer();
  if (clip2.isNull()) return;
  clip2.add(structs.DisplayObject_visible).writeU8(1);
}
export function isAntiAfkEnabled() {
  return antiAfk;
}
export function registerButton(button2, action) {
  buttons.set(button2.toString(), action);
}
export function buttonAction(button2) {
  const action = buttons.get(button2.toString());
  return action === void 0 ? null : action;
}
export var updateHealthBarCallback = new NativeCallback(function(character, deltaTime) {
  updateHealthBar(character, deltaTime);
  if (enemyAmmo) showAmmo(character);
}, "void", ["pointer", "float"]);
