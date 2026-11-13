import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";

export class HideUltiAiming {
  static address = null;
  static listener = null;

  static apply() {
    const active = this.listener !== null;
    if (flags.hideUltiAiming === active) return;
    if (flags.hideUltiAiming) {
      this.listener = Interceptor.attach(this.address, {
        onEnter(args) {
          if (args[1].toInt32() === constants.ClientInput_ultiAimingType) args[1] = ptr(constants.ClientInput_hiddenType);
        }
      });
    } else {
      this.listener.detach();
      this.listener = null;
    }
  }

  static init(base) {
    this.address = base.add(offsets.ClientInput_constructor_int);
    this.apply();
  }

  static toggle() {
    flags.toggle("hideUltiAiming");
    this.apply();
  }
}
