import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";

let _init = false;

function applyHeroHudVisibility(character, visible) {
    for (const offset of structs.Character_heroHudClips) {
        const clip = character.add(offset).readPointer();
        if (clip.isNull()) continue;
        clip.add(structs.DisplayObject_visible).writeU8(visible);
    }
}

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    Interceptor.attach(base.add(offsets.Character_updateHealthBar), {
        onEnter(args) {
            this.character = args[0];
        },
        onLeave() {
            applyHeroHudVisibility(this.character, 1);
        }
    });
}
