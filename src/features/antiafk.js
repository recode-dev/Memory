import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { getOwnCharacter, gameObjectGetX, gameObjectGetY, setClientPredictionMoveTo } from "../natives/functions.js";
import { sendCommand } from "../core/commands.js";

let logic = null;
let lastX = null;
let lastY = null;
let last = 0;
let dir = 1;

function nudge(current, x, y) {
  const now = Date.now();
  if (lastX === null || Math.abs(x - lastX) + Math.abs(y - lastY) > constants.AntiAfk_moveDelta) {
    lastX = x;
    lastY = y;
    last = now;
    return;
  }
  if (now - last < constants.AntiAfk_intervalMs) return;
  last = now;
  let nx = x + dir;
  const width = current.add(structs.LogicBattleModeClient_tileMap).readPointer().add(structs.TileMap_widthUnits).readS32();
  if (nx < 1 || nx > width - 2) {
    dir = -dir;
    nx = x + dir;
  }
  dir = -dir;
  lastX = nx;
  lastY = y;
  setClientPredictionMoveTo(current, nx, y, 1);
  sendCommand(constants.ClientInput_moveType, (input) => {
    input.add(structs.ClientInput_x).writeS32(nx);
    input.add(structs.ClientInput_y).writeS32(y);
  });
}

let _init = false;
export function setupAntiAfk(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
    onLeave(retval) {
      if (flags.antiAfk) retval.replace(0);
    }
  });
  Interceptor.attach(base.add(offsets.LogicBattleModeClient_update), {
    onEnter(args) {
      const current = args[0];
      if (!logic || !logic.equals(current)) {
        logic = current;
        lastX = null;
        dir = 1;
      }
      if (!flags.antiAfk) return;
      const own = getOwnCharacter(current);
      if (own.isNull()) return;
      nudge(current, gameObjectGetX(own), gameObjectGetY(own));
    }
  });
}
