import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let address = null;
let listener = null;

function apply() {
  const active = listener !== null;
  if (flags.antiAutoShoot === active) return;
  if (flags.antiAutoShoot) {
    listener = Interceptor.attach(address, {
      onEnter(args) {
        const input = args[1];
        if (input.add(structs.ClientInput_type).readS32() !== constants.ClientInput_shootType) return;
        input.add(structs.ClientInput_isAuto).writeU8(0);
      }
    });
  } else {
    listener.detach();
    listener = null;
  }
}

export function setupAntiAutoShoot(base) {
  address = base.add(offsets.ClientInputManager_addInput);
  apply();
}

export function toggleAntiAutoShoot() {
  toggleFlag("antiAutoShoot");
  apply();
}
