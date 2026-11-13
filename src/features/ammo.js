import { offsets } from "../natives/offsets.js";
import { Callbacks } from "../natives/callbacks.js";

export class Ammo {
  static init(base) {
    if (this._init) return;
    this._init = true;
    Interceptor.replace(base.add(offsets.Character_updateHealthBar), Callbacks.updateHealthBarCallback);
  }
}
