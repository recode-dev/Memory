import { offsets } from "../natives/offsets.js";
import { initFunctions } from "../natives/functions.js";
import { updateHealthBarCallback } from "../natives/callbacks.js";

let _init = false;

export function setupAmmo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    Interceptor.replace(base.add(offsets.Character_updateHealthBar), updateHealthBarCallback);
}
