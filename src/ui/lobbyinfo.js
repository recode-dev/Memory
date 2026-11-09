import { offsets } from "../natives/offsets.js";
import { addChild, createBlingTextField, getMovieClip, setFontSize, setText, setTextColor, setXY } from "../natives/functions.js";
import { constants } from "../natives/constants.js";
import { structs } from "../natives/structs.js";
import { setLobbyInfoField } from "../features/hidelobbyinfo.js";
import { flags } from "../utils/flags.js";
import { resolveGradient } from "../natives/datatables.js";
import { allocScString, withScString } from "../core/scstring.js";
import { paintGradient } from "./gradient.js";

let _init = false;
let field = null;
let started = false;
function paintBadge(phase) {
  withScString(paintGradient(constants.Badge_text, phase, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => setText(field, sc));
}
function repaint() {
  if (flags.hideLobbyInfo) return;
  paintBadge(Date.now() % constants.Badge_shinePeriod / constants.Badge_shinePeriod);
}
function applyVisibility() {
  if (flags.hideLobbyInfo) {
    withScString("", (sc) => setText(field, sc));
    return;
  }
  repaint();
}
let uiSc = Memory.allocUtf8String(constants.Ui_sc);
let popover = Memory.allocUtf8String(constants.Badge_clip);
export function setupLobbyInfo(base) {
  if (_init) return;
  _init = true;
  const textName = allocScString(constants.Badge_field);
  Interceptor.attach(base.add(offsets.HomePage_ctor), {
    onEnter(args) {
      this.page = args[0];
    },
    onLeave() {
      const clip = getMovieClip(uiSc, popover, 0);
      field = createBlingTextField(clip, textName, resolveGradient(constants.Badge_gradientTable, constants.Badge_gradientId));
      setXY(field, constants.Badge_x, constants.Badge_y);
      setFontSize(field, constants.Badge_fontSize);
      field.add(structs.TextField_flags).writeU32(field.add(structs.TextField_flags).readU32() | constants.Badge_outlineFlag);
      setTextColor(field, constants.Badge_color);
      paintBadge(0);
      addChild(this.page, field);
      setLobbyInfoField(applyVisibility);
      if (started) return;
      started = true;
      setInterval(repaint, constants.Badge_shineMs);
    }
  });
}
