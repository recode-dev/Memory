import { getMovieClip, getTextFieldByName, gotoAndStopFrameIndex, setText, setVisibility, setXY, stageAddChild, stageInstance } from "../natives/functions.js";
import { constants } from "../natives/constants.js";
import { onBattleTick } from "../core/tick.js";
import { withScString } from "../core/scstring.js";

let clip = null;
let field = null;
let visible = false;
let shownText = null;
let until = 0;
let pending = null;

let uiSc = Memory.allocUtf8String(constants.Ui_sc);
let clipName = Memory.allocUtf8String(constants.Panel_rowClip);
let fieldName = Memory.allocUtf8String(constants.Panel_txtField);

function ensurePlate() {
  if (clip !== null) return;
  clip = getMovieClip(uiSc, clipName, 0);
  gotoAndStopFrameIndex(clip, 1);
  field = getTextFieldByName(clip, fieldName);
  setXY(clip, constants.BlockNotify_x, constants.BlockNotify_y);
  setVisibility(clip, 0);
  stageAddChild(stageInstance(), clip);
}

export function notifyBlock(text) {
  pending = text;
  until = Date.now() + constants.BlockNotify_visibleMs;
}

function tick() {
  if (pending !== null) {
    ensurePlate();
    if (shownText !== pending) {
      withScString("<c" + constants.Panel_offColor + ">" + pending + "</c>", (sc) => setText(field, sc));
      shownText = pending;
    }
    pending = null;
  }
  const active = Date.now() < until;
  if (clip !== null && active !== visible) {
    setVisibility(clip, active ? 1 : 0);
    visible = active;
  }
}

let _init = false;
export function setupBlockNotify() {
  if (_init) return;
  _init = true;
  onBattleTick(tick);
}
