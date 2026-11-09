import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let address = null;
let listener = null;

function apply() {
  const active = listener !== null;
  if (flags.hideUltiAiming === active) return;
  if (flags.hideUltiAiming) {
    listener = Interceptor.attach(address, {
      onEnter(args) {
        if (args[1].toInt32() === constants.ClientInput_ultiAimingType) args[1] = ptr(constants.ClientInput_hiddenType);
      }
    });
  } else {
    listener.detach();
    listener = null;
  }
}

export function setupHideUltiAiming(base) {
  address = base.add(offsets.ClientInput_ctor);
  apply();
}

export function toggleHideUltiAiming() {
  toggleFlag("hideUltiAiming");
  apply();
}
