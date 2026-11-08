import { offsets } from "../natives/offsets.js";
import { addChild, createBlingTextField, getMovieClip, setFontSize, setText, setTextColor, setVisibility, setXY } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { resolveGradient } from "../natives/datatables.js";
import { allocScString, withScString } from "../core/scstring.js";
import { paintGradient } from "./gradient.js";

var _init = false;
var started = false;
var field = null;
function repaint() {
  const phase = Date.now() % constants.Badge_shinePeriod / constants.Badge_shinePeriod;
  withScString(paintGradient(constants.Badge_text, phase, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => setText(field, sc));
}
var uiSc = Memory.allocUtf8String(constants.Badge_sc);
var popover = Memory.allocUtf8String(constants.Badge_clip);
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
      field.add(structs.TextField_fontOutline).writeU8(constants.Badge_fontOutline);
      setTextColor(field, constants.Badge_color);
      withScString(paintGradient(constants.Badge_text, 0, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => setText(field, sc));
      addChild(this.page, field);
      setVisibility(field, 1);
      if (started) return;
      started = true;
      setInterval(repaint, constants.Badge_shineMs);
    }
  });
}
