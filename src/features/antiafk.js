import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { NativeFunctions } from "../natives/functions.js";
import { Commands } from "../core/commands.js";
import { BattleTick } from "../core/tick.js";

export class AntiAfk {
  static logic = null;
  static lastX = null;
  static lastY = null;
  static last = 0;
  static armed = false;
  static pending = false;

  static tick(current) {
    if (!this.logic || !this.logic.equals(current)) {
      this.logic = current;
      this.lastX = null;
    }
    if (!flags.antiAfk || flags.autoSpin) {
      this.armed = false;
      this.pending = false;
      return;
    }
    if (current.add(structs.LogicBattleModeClient_state).readS32() <= constants.AntiAfk_liveState) return;
    if (!this.armed) {
      this.armed = true;
      this.pending = true;
      this.lastX = null;
    }
    const own = NativeFunctions.getOwnCharacter(current);
    if (own.isNull()) return;
    const x = NativeFunctions.gameObjectGetX(own);
    const y = NativeFunctions.gameObjectGetY(own);
    const now = Date.now();
    if (this.lastX === null || Math.abs(x - this.lastX) + Math.abs(y - this.lastY) > constants.AntiAfk_moveDelta) {
      this.lastX = x;
      this.lastY = y;
      this.last = now;
      return;
    }
    if (!this.pending && now - this.last < constants.AntiAfk_intervalMs) return;
    this.pending = false;
    this.last = now;
    Commands.sendMove(current, x, y);
  }

  static init(base) {
    if (this._init) return;
    this._init = true;
    BattleTick.on((current) => this.tick(current));
    Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
      onLeave(retval) {
        if (flags.antiAfk) retval.replace(0);
      }
    });
  }
}
