import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let base = null;
let listener = null;

function apply() {
  if (flags.hideUltiAiming === (listener !== null)) return;
  if (flags.hideUltiAiming) {
    listener = Interceptor.attach(base.add(offsets.ClientInputManager_addInput), {
      onEnter(args) {
        const type = args[1].add(structs.ClientInput_type);
        if (type.readS32() === constants.ClientInput_ultiAimingType) {
          type.writeS32(constants.ClientInput_hiddenType);
        }
      }
    });
  } else {
    listener.detach();
    listener = null;
  }
}
export function setupHideUltiAiming(moduleBase) {
  base = moduleBase;
  apply();
}
export function toggleHideUltiAiming() {
  toggleFlag("hideUltiAiming");
  apply();
}
