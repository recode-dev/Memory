import { offsets } from "../natives/offsets.js";

export class BattleTick {
  static ticks = [];

  static on(tick) {
    this.ticks.push(tick);
  }

  static init(base) {
    Interceptor.attach(base.add(offsets.LogicBattleModeClient_update), {
      onEnter: (args) => {
        for (const tick of this.ticks) tick(args[0]);
      }
    });
  }
}
