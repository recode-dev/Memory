import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";

export class AntiAutoShoot {
  static address = null;
  static listener = null;

  static apply() {
    const active = this.listener !== null;
    if (flags.antiAutoShoot === active) return;
    if (flags.antiAutoShoot) {
      this.listener = Interceptor.attach(this.address, {
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
      this.listener.detach();
      this.listener = null;
    }
  }

  static init(base) {
    this.address = base.add(offsets.LogicSkillData_canAutoShoot);
    this.apply();
  }

  static toggle() {
    flags.toggle("antiAutoShoot");
    this.apply();
  }
}
