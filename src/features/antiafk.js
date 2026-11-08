import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";

let _init = false;

export function setupAntiAfk(base) {
    if (_init) return;
    _init = true;

    Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
        onLeave(retval) {
            retval.replace(constants.Boolean_false);
        }
    });
}
