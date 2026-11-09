import { offsets } from "../natives/offsets.js";

let ticks = [];
export function onBattleTick(tick) {
  ticks.push(tick);
}
export function setupBattleTick(base) {
  Interceptor.attach(base.add(offsets.LogicBattleModeClient_update), {
    onEnter(args) {
      for (const tick of ticks) tick(args[0]);
    }
  });
}
