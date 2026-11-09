import { offsets } from "../natives/offsets.js";
import { flags, toggleFlag } from "../utils/flags.js";

let base = null;
let listener = null;

function apply() {
  if (flags.antiAfk === (listener !== null)) return;
  if (flags.antiAfk) {
    listener = Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
      onLeave(retval) {
        retval.replace(0);
      }
    });
  } else {
    listener.detach();
    listener = null;
  }
}
export function setupAntiAfk(moduleBase) {
  base = moduleBase;
  apply();
}
export function toggleAntiAfk() {
  toggleFlag("antiAfk");
  apply();
}
