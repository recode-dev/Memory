import { offsets } from "../natives/offsets.js";
import { updateHealthBarCallback } from "../natives/callbacks.js";

var _init = false;
export function setupAmmo(base) {
  if (_init) return;
  _init = true;
  Interceptor.replace(base.add(offsets.Character_updateHealthBar), updateHealthBarCallback);
}
