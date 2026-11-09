import { offsets } from "../natives/offsets.js";
import { flags } from "../utils/flags.js";

let _init = false;
export function setupAntiAfk(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
    onLeave(retval) {
      if (flags.antiAfk) retval.replace(0);
    }
  });
}
