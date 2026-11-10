import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";

let addInputAddress = null;
let submitAddress = null;
let addInputListener = null;
let submitListener = null;

function isAutoSuper(input) {
  if (input.isNull()) return false;
  const type = input.add(structs.ClientInput_type).readS32();
  if (type !== constants.ClientInput_superType && type !== constants.ClientInput_superAltType) return false;
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
  if (flags.antiAutoSuper === active) return;
  if (flags.antiAutoSuper) {
    addInputListener = Interceptor.attach(addInputAddress, {
      onEnter(args) {
        if (!isAutoSuper(args[1])) return;
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
        if (!isAutoSuper(args[1])) return;
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
    addInputListener.detach();
    addInputListener = null;
    submitListener.detach();
    submitListener = null;
  }
}

export function setupAntiAutoSuper(base) {
  addInputAddress = base.add(offsets.ClientInputManager_addInput);
  submitAddress = base.add(offsets.LogicBattleModeClient_submitInput);
  apply();
}

export function toggleAntiAutoSuper() {
  toggleFlag("antiAutoSuper");
  apply();
}
