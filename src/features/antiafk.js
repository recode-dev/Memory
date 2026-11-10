import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { getOwnCharacter, gameObjectGetX, gameObjectGetY } from "../natives/functions.js";
import { sendMove } from "../core/commands.js";
import { onBattleTick } from "../core/tick.js";

let logic = null;
let lastX = null;
let lastY = null;
let last = 0;
let armed = false;
let pending = false;

function tick(current) {
  if (!logic || !logic.equals(current)) {
    logic = current;
    lastX = null;
  }
  if (!flags.antiAfk) {
    armed = false;
    pending = false;
    return;
  }
  // v69.252: update само гейтится cmp [x0,#0x7c],#2; b.le — до state>2 игра не
  // трогает контейнер игроков и не создаёт инпуты. Наш тик подчиняется тому же:
  // warmup (загрузка/отсчёт) не армит фичу и не шлёт sendMove — включение в
  // лобби больше не отличается от включения в бою.
  if (current.add(structs.LogicBattleModeClient_state).readS32() <= constants.AntiAfk_liveState) return;
  if (!armed) {
    armed = true;
    pending = true;
    lastX = null;
  }
  const own = getOwnCharacter(current);
  if (own.isNull()) return;
  const x = gameObjectGetX(own);
  const y = gameObjectGetY(own);
  const now = Date.now();
  if (lastX === null || Math.abs(x - lastX) + Math.abs(y - lastY) > constants.AntiAfk_moveDelta) {
    lastX = x;
    lastY = y;
    last = now;
    return;
  }
  if (!pending && now - last < constants.AntiAfk_intervalMs) return;
  pending = false;
  last = now;
  sendMove(current, x, y);
}

let _init = false;
export function setupAntiAfk(base) {
  if (_init) return;
  _init = true;
  onBattleTick(tick);
  Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
    onLeave(retval) {
      if (flags.antiAfk) retval.replace(0);
    }
  });
}
