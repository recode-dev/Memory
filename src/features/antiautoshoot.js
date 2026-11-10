import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let canAutoShootAddress = null;
let canAutoShootListener = null;

function apply() {
  const active = canAutoShootListener !== null;
  if (flags.antiAutoShoot === active) return;
  if (flags.antiAutoShoot) {
    canAutoShootListener = Interceptor.attach(canAutoShootAddress, {
      onEnter(args) {
        const data = args[0];
        if (data.isNull()) return;
        const field = data.add(structs.LogicSkillData_canAutoShoot);
        this.field = field;
        this.saved = field.readS32();
        field.writeS32(constants.LogicSkillData_canAutoShootBlocked);
      },
      onLeave() {
        if (this.saved === undefined) return;
        this.field.writeS32(this.saved);
        this.saved = undefined;
      }
    });
  } else {
    canAutoShootListener.detach();
    canAutoShootListener = null;
  }
}

export function setupAntiAutoShoot(base) {
  canAutoShootAddress = base.add(offsets.LogicSkillData_canAutoShoot);
  apply();
}

export function toggleAntiAutoShoot() {
  toggleFlag("antiAutoShoot");
  apply();
}
