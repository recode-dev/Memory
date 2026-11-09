import { offsets } from "../natives/offsets.js";
import { gotoAndStopFrameIndex } from "../natives/functions.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { constants } from "../natives/constants.js";

let _init = false;
export function setupStaticEmoji(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.StringTable_getMovieClip), {
    onEnter(args) {
      this.emoji = args[0].readCString().includes(constants.Emoji_sc);
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
