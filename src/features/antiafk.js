import { offsets } from "../natives/offsets.js";
import { isAntiAfkEnabled } from "../natives/callbacks.js";

let _init = false;

export function setupAntiAfk(base) {
    if (_init) return;
    _init = true;

    Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
        onLeave(retval) {
            if (isAntiAfkEnabled()) retval.replace(0);
        }
    });
}
