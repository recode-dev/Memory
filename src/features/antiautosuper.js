import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { getOwnCharacter } from "../natives/functions.js";

let pressHandlerAddress = null;
let pressHandlerListener = null;

function apply() {
  const active = pressHandlerListener !== null;
  if (flags.antiAutoSuper === active) return;
  if (flags.antiAutoSuper) {
    pressHandlerListener = Interceptor.attach(pressHandlerAddress, {
      onEnter(args) {
        const press = args[2];
        if (press.isNull()) return;
        if (press.readS32() !== constants.Press_superButton) return;
        if (press.add(4).readS32() !== constants.Press_pressPhase) return;
        const lbmc = args[0].add(structs.BattleController_logicBattleModeClient).readPointer();
        if (lbmc.isNull()) return;
        const char = getOwnCharacter(lbmc);
        if (char.isNull()) return;
        const table = char.add(structs.LogicCharacterClient_buttonSkills).readPointer();
        if (table.isNull()) return;
        this.patched = [];
        for (const slot of constants.Press_buttonSkillSlots) {
          const skill = table.add(slot).readPointer();
          if (skill.isNull()) continue;
          const field = skill.add(structs.LogicSkill_castReady);
          this.patched.push([field, field.readU8()]);
          field.writeU8(0);
        }
      },
      onLeave() {
        if (!this.patched) return;
        for (const [field, value] of this.patched) field.writeU8(value);
        this.patched = null;
      }
    });
  } else {
    pressHandlerListener.detach();
    pressHandlerListener = null;
  }
}

export function setupAntiAutoSuper(base) {
  pressHandlerAddress = base.add(offsets.BattleController_handleButtonPress);
  apply();
}

export function toggleAntiAutoSuper() {
  toggleFlag("antiAutoSuper");
  apply();
}
