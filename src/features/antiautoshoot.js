import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let addInputAddress = null;
let submitAddress = null;
let handleAutoShootAddress = null;
let addInputListener = null;
let submitListener = null;
let handleAutoShootListener = null;

function isAutoShoot(input) {
  if (input.isNull()) return false;
  if (input.add(structs.ClientInput_type).readS32() !== constants.ClientInput_shootType) return false;
  return input.add(structs.ClientInput_isAuto).readU8() === 1;
}

function popIfLast(queue, input) {
  const count = queue.add(structs.Vector_count).readS32();
  if (count < 1) return false;
  if (!queue.add(structs.Vector_items).readPointer().add((count - 1) * 8).readPointer().equals(input)) return false;
  queue.add(structs.Vector_count).writeS32(count - 1);
  return true;
}

function apply() {
  const active = addInputListener !== null;
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
    addInputListener = Interceptor.attach(addInputAddress, {
      onEnter(args) {
        if (!isAutoShoot(args[1])) return;
        this.manager = args[0];
        this.input = args[1];
      },
      onLeave() {
        if (!this.manager) return;
        popIfLast(this.manager.add(structs.ClientInputManager_queue).readPointer(), this.input);
      }
    });
    submitListener = Interceptor.attach(submitAddress, {
      onEnter(args) {
        if (!isAutoShoot(args[1])) return;
        this.battle = args[0];
        this.input = args[1];
      },
      onLeave() {
        if (!this.battle) return;
        if (!popIfLast(this.battle.add(structs.LogicBattleModeClient_pendingInputs), this.input)) return;
        const units = this.battle.add(structs.LogicBattleModeClient_pendingInputUnits);
        const count = units.add(structs.Vector_count).readS32();
        if (count > 0) units.add(structs.Vector_count).writeS32(count - 1);
      }
    });
  } else {
    handleAutoShootListener.detach();
    handleAutoShootListener = null;
    addInputListener.detach();
    addInputListener = null;
    submitListener.detach();
    submitListener = null;
  }
}

export function setupAntiAutoShoot(base) {
  addInputAddress = base.add(offsets.ClientInputManager_addInput);
  submitAddress = base.add(offsets.LogicBattleModeClient_submitInput);
  handleAutoShootAddress = base.add(offsets.BattleScreen_handleAutoShoot);
  apply();
}

export function toggleAntiAutoShoot() {
  toggleFlag("antiAutoShoot");
  apply();
}
