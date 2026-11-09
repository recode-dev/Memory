import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let _init = false;
export function setupHideUltiAiming(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.ClientInputManager_addInput), {
    onEnter(args) {
      if (!flags.hideUltiAiming) return;
      const type = args[1].add(structs.ClientInput_type);
      if (type.readS32() === constants.ClientInput_ultiAimingType) {
        type.writeS32(constants.ClientInput_hiddenType);
      }
    }
  });
}
export function toggleHideUltiAiming() {
  toggleFlag("hideUltiAiming");
}
