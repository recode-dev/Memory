import { offsets } from "../natives/offsets.js";
import { NativeFunctions } from "../natives/functions.js";
import { constants } from "../natives/constants.js";
import { structs } from "../natives/structs.js";
import { flags } from "../utils/flags.js";
import { DataTables } from "../natives/datatables.js";
import { ScString } from "../core/scstring.js";
import { Gradient } from "./gradient.js";

export class LobbyInfo {
  static field = null;
  static started = false;
  static uiSc = Memory.allocUtf8String(constants.Ui_sc);
  static popover = Memory.allocUtf8String(constants.Badge_clip);

  static paintBadge(phase) {
    ScString.with(Gradient.paint(constants.Badge_text, phase, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => NativeFunctions.setText(this.field, sc));
  }

  static repaint() {
    if (flags.hideLobbyInfo) return;
    LobbyInfo.paintBadge(Date.now() % constants.Badge_shinePeriod / constants.Badge_shinePeriod);
  }

  static applyVisibility() {
    if (flags.hideLobbyInfo) {
      ScString.with("", (sc) => NativeFunctions.setText(LobbyInfo.field, sc));
      return;
    }
    LobbyInfo.repaint();
  }

  static init(base) {
    if (this._init) return;
    this._init = true;
    const textName = ScString.alloc(constants.Badge_field);
    Interceptor.attach(base.add(offsets.HomePage_ctor), {
      onEnter(args) {
        this.page = args[0];
      },
      onLeave() {
        const clip = NativeFunctions.getMovieClip(LobbyInfo.uiSc, LobbyInfo.popover, 0);
        LobbyInfo.field = NativeFunctions.createBlingTextField(clip, textName, DataTables.resolveGradient(constants.Badge_gradientTable, constants.Badge_gradientId));
        NativeFunctions.setXY(LobbyInfo.field, constants.Badge_x, constants.Badge_y);
        NativeFunctions.setFontSize(LobbyInfo.field, constants.Badge_fontSize);
        LobbyInfo.field.add(structs.TextField_flags).writeU32(LobbyInfo.field.add(structs.TextField_flags).readU32() | constants.Badge_outlineFlag);
        NativeFunctions.setTextColor(LobbyInfo.field, constants.Badge_color);
        LobbyInfo.paintBadge(0);
        NativeFunctions.addChild(this.page, LobbyInfo.field);
        if (LobbyInfo.started) return;
        LobbyInfo.started = true;
        setInterval(LobbyInfo.repaint, constants.Badge_shineMs);
      }
    });
  }
}
