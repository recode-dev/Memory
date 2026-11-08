import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { initFunctions, updateHealthBar } from "../core/functions.js";

let _init = false;

function showAmmo(character) {
    for (const offset of structs.Character_heroHudClips) {
        const clip = character.add(offset).readPointer();
        if (clip.isNull()) continue;
        clip.add(structs.DisplayObject_visible).writeU8(1);
    }
}

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    Interceptor.replace(base.add(offsets.Character_updateHealthBar), new NativeCallback(function (character, deltaTime) {
        updateHealthBar(character, deltaTime);
        showAmmo(character);
    }, "void", ["pointer", "float"]));
}
