import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let handleAutoShootAddress = null;
let handleAutoShootListener = null;

function apply() {
  const active = handleAutoShootListener !== null;
  if (flags.antiAutoShoot === active) return;
  if (flags.antiAutoShoot) {
    handleAutoShootListener = Interceptor.attach(handleAutoShootAddress, {
      onEnter(args) {
        const char = args[3];
        if (char.isNull()) return;
        const items = char.add(structs.LogicCharacterClient_skills).readPointer();
        const count = char.add(structs.LogicCharacterClient_skillCount).readS32();
        this.patched = [];
        for (let index = 0; index < count; index++) {
          const skill = items.add(index * 8).readPointer();
          if (skill.isNull()) continue;
          const field = skill.add(structs.LogicSkillData_canAutoShoot);
          this.patched.push([field, field.readS32()]);
          field.writeS32(constants.LogicSkillData_canAutoShootBlocked);
        }
      },
      onLeave() {
        if (!this.patched) return;
        for (const [field, mode] of this.patched) field.writeS32(mode);
        this.patched = null;
      }
    });
  } else {
    handleAutoShootListener.detach();
    handleAutoShootListener = null;
  }
}

export function setupAntiAutoShoot(base) {
  handleAutoShootAddress = base.add(offsets.BattleScreen_handleAutoShoot);
  apply();
}

export function toggleAntiAutoShoot() {
  toggleFlag("antiAutoShoot");
  apply();
}
