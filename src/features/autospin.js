import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { getOwnCharacter, gameObjectGetX, gameObjectGetY } from "../natives/functions.js";
import { sendMove } from "../core/commands.js";
import { onBattleTick } from "../core/tick.js";

let phase = 0;
let battle = null;

function spinTo(current, own) {
  phase += constants.AutoSpin_step;
  if (phase >= constants.AutoSpin_turn) phase -= constants.AutoSpin_turn;
  const tx = Math.round(gameObjectGetX(own) + Math.cos(phase) * constants.AutoSpin_radius);
  const ty = Math.round(gameObjectGetY(own) + Math.sin(phase) * constants.AutoSpin_radius);
  sendMove(current, tx, ty);
}

function tick(current) {
  if (!flags.autoSpin) return;
  if (!battle || !battle.equals(current)) {
    battle = current;
    phase = 0;
  }
  const own = getOwnCharacter(current);
  if (!own.isNull()) spinTo(current, own);
}

let _init = false;
export function setupAutoSpin() {
  if (_init) return;
  _init = true;
  onBattleTick(tick);
}

export function toggleAutoSpin() {
  toggleFlag("autoSpin");
}
