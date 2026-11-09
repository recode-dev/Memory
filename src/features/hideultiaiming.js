import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

const handler = new NativeCallback(function (manager, input) {
  const type = input.add(structs.ClientInput_type);
  if (type.readS32() === constants.ClientInput_ultiAimingType) type.writeS32(constants.ClientInput_hiddenType);
}, "void", ["pointer", "pointer"]);

let address = null;
let replaced = false;

function apply() {
  if (flags.hideUltiAiming === replaced) return;
  if (flags.hideUltiAiming) {
    Interceptor.replace(address, handler);
  } else {
    Interceptor.revert(address);
  }
  replaced = flags.hideUltiAiming;
}
export function setupHideUltiAiming(base) {
  address = base.add(offsets.ClientInputManager_addInput);
  apply();
}
export function toggleHideUltiAiming() {
  toggleFlag("hideUltiAiming");
  apply();
}
