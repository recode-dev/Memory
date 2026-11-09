import { addChild, getMovieClip, gotoAndStopFrameIndex, setScale, setXY, spriteCtor } from "../natives/functions.js";
import { constants } from "../natives/constants.js";
import { toggleFlag } from "../utils/flags.js";

export function staticEmojiIcon() {
  const icon = spriteCtor(Memory.alloc(4), 1);
  const sc = Memory.allocUtf8String(constants.Emoji_sc);
  const grin = getMovieClip(sc, Memory.allocUtf8String(constants.Emoji_grinExport), 0);
  const stop = getMovieClip(sc, Memory.allocUtf8String(constants.Emoji_stopExport), 0);
  if (grin.isNull() || stop.isNull()) return null;
  gotoAndStopFrameIndex(stop, constants.Emoji_stopFrame);
  setScale(stop, constants.Emoji_stopScale);
  setXY(stop, constants.Emoji_iconSize / 3, constants.Emoji_iconSize / 3.3);
  addChild(icon, grin);
  addChild(icon, stop);
  setXY(icon, constants.Emoji_iconX, constants.Emoji_iconY);
  return icon;
}
export function toggleStaticEmoji() {
  toggleFlag("staticEmoji");
}
