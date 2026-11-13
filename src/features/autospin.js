import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { NativeFunctions } from "../natives/functions.js";
import { Commands } from "../core/commands.js";
import { BattleTick } from "../core/tick.js";

export class AutoSpin {
  static phase = 0;
  static battle = null;

  static spinTo(current, own) {
    this.phase += constants.AutoSpin_step;
    if (this.phase >= constants.AutoSpin_turn) this.phase -= constants.AutoSpin_turn;
    const tx = Math.round(NativeFunctions.gameObjectGetX(own) + Math.cos(this.phase) * constants.AutoSpin_radius);
    const ty = Math.round(NativeFunctions.gameObjectGetY(own) + Math.sin(this.phase) * constants.AutoSpin_radius);
    Commands.sendMove(current, tx, ty);
  }

  static tick(current) {
    if (!flags.autoSpin) return;
    if (!this.battle || !this.battle.equals(current)) {
      this.battle = current;
      this.phase = 0;
    }
    const own = NativeFunctions.getOwnCharacter(current);
    if (!own.isNull()) this.spinTo(current, own);
  }

  static init() {
    if (this._init) return;
    this._init = true;
    BattleTick.on((current) => this.tick(current));
  }

  static toggle() {
    flags.toggle("autoSpin");
  }
}
