import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { gotoAndStopFrameIndex } from "../natives/functions.js";

let _init = false;
export function setupStaticEmoji(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.MovieClip_getExport), {
    onEnter(args) {
      this.emoji = args[1].readCString().startsWith(constants.Emoji_sc);
    },
    onLeave(retval) {
      if (!flags.staticEmoji || !this.emoji || retval.isNull()) return;
      gotoAndStopFrameIndex(retval, constants.Emoji_staticFrame);
    }
  });
}
export function toggleStaticEmoji() {
  toggleFlag("staticEmoji");
}
