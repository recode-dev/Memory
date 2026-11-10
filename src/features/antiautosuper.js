import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let address = null;
let listener = null;

function apply() {
  const active = listener !== null;
  if (flags.antiAutoSuper === active) return;
  if (flags.antiAutoSuper) {
    listener = Interceptor.attach(address, {
      onEnter(args) {
        const input = args[1];
        const type = input.add(structs.ClientInput_type).readS32();
        if (type !== constants.ClientInput_superType && type !== constants.ClientInput_superAltType) return;
        input.add(structs.ClientInput_isAuto).writeU8(0);
      }
    });
  } else {
    listener.detach();
    listener = null;
  }
}

export function setupAntiAutoSuper(base) {
  address = base.add(offsets.ClientInputManager_addInput);
  apply();
}

export function toggleAntiAutoSuper() {
  toggleFlag("antiAutoSuper");
  apply();
}
