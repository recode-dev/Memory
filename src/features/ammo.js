import { offsets } from "../core/offsets.js";
import { initFunctions } from "../core/functions.js";
import { updateHealthBarCallback } from "../core/callbacks.js";

let _init = false;

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    Interceptor.replace(base.add(offsets.Character_updateHealthBar), updateHealthBarCallback);
}
