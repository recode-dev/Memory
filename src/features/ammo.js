import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";

let _init = false;
let updateHealthBar = null;

function applyHeroHudVisibility(character) {
    for (const offset of structs.Character_heroHudClips) {
        const clip = character.add(offset).readPointer();
        if (clip.isNull()) continue;
        clip.add(structs.DisplayObject_visible).writeU8(1);
    }
}

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    const target = base.add(offsets.Character_updateHealthBar);
    updateHealthBar = new NativeFunction(target, "void", ["pointer", "float"]);

    Interceptor.replace(
        target,
        new NativeCallback(function (character, deltaTime) {
            updateHealthBar(character, deltaTime);
            applyHeroHudVisibility(character);
        }, "void", ["pointer", "float"])
    );
}
