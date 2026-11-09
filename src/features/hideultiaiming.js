import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let _init = false;
export function setupHideUltiAiming(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.ClientInput_ctor), {
    onEnter(args) {
      this.record = args[0];
      this.aiming = args[1].toInt32() === constants.ClientInput_superAimType;
    },
    onLeave() {
      if (!flags.hideUltiAiming || !this.aiming) return;
      this.record.add(structs.ClientInput_type).writeS32(constants.ClientInput_noneType);
    }
  });
}
export function toggleHideUltiAiming() {
  toggleFlag("hideUltiAiming");
}
