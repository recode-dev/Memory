import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";

let _init = false;
const characters = [];

function applyHeroHudVisibility(character, visible) {
    for (const offset of structs.Character_heroHudClips) {
        const clip = character.add(offset).readPointer();
        if (clip.isNull()) continue;
        clip.add(structs.DisplayObject_visible).writeU8(visible);
    }
}

function applyToAll() {
    for (const character of characters) {
        applyHeroHudVisibility(character, 1);
    }
}

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    Interceptor.attach(base.add(offsets.Character_ctor), {
        onEnter(args) {
            this.character = args[0];
        },
        onLeave() {
            characters.push(this.character);
            if (characters.length > constants.Ammo_maxCharacters) characters.shift();
            applyHeroHudVisibility(this.character, 1);
        }
    });

    Interceptor.attach(base.add(offsets.Character_updateAmmo), {
        onLeave() {
            applyToAll();
        }
    });
}
