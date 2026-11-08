import { structs } from "./structs.js";
import { updateHealthBar } from "./functions.js";

function showAmmo(character) {
    const clip = character.add(structs.Character_ammoClip).readPointer();
    if (clip.isNull()) return;
    clip.add(structs.DisplayObject_visible).writeU8(1);
}

export const updateHealthBarCallback = new NativeCallback(function (character, deltaTime) {
    updateHealthBar(character, deltaTime);
    showAmmo(character);
}, "void", ["pointer", "float"]);
