import { constants } from "./constants.js";
import { structs } from "./structs.js";
import { updateHealthBar } from "./functions.js";

function showAmmo(character) {
    for (const offset of structs.Character_heroHudClips) {
        const clip = character.add(offset).readPointer();
        if (clip.isNull()) continue;
        clip.add(structs.DisplayObject_visible).writeU8(constants.Boolean_true);
    }
}

export const updateHealthBarCallback = new NativeCallback(function (character, deltaTime) {
    updateHealthBar(character, deltaTime);
    showAmmo(character);
}, "void", ["pointer", "float"]);
