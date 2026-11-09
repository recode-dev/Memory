import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { getOwnCharacter, gameObjectGetX, gameObjectGetY, setClientPredictionMoveTo } from "../natives/functions.js";
import { sendCommand } from "../core/commands.js";

let phase = 0;
let battle = null;
let attached = false;

function spinTo(current, own) {
  phase += constants.AutoSpin_step;
  if (phase >= constants.AutoSpin_turn) phase -= constants.AutoSpin_turn;
  const tx = Math.round(gameObjectGetX(own) + Math.cos(phase) * constants.AutoSpin_radius);
  const ty = Math.round(gameObjectGetY(own) + Math.sin(phase) * constants.AutoSpin_radius);
  setClientPredictionMoveTo(current, tx, ty, 1);
  sendCommand(constants.ClientInput_moveType, (input) => {
    input.add(structs.ClientInput_x).writeS32(tx);
    input.add(structs.ClientInput_y).writeS32(ty);
  });
}

export function setupAutoSpin(base) {
  if (attached) return;
  attached = true;
  Interceptor.attach(base.add(offsets.LogicBattleModeClient_update), {
    onEnter(args) {
      if (!flags.autoSpin) return;
      const current = args[0];
      if (!battle || !battle.equals(current)) {
        battle = current;
        phase = 0;
      }
      const own = getOwnCharacter(current);
      if (!own.isNull()) spinTo(current, own);
    }
  });
}

export function toggleAutoSpin() {
  toggleFlag("autoSpin");
}
