import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { getMovieClip, createBlingTextField, setText, setFontSize, setTextColor, setXY, setVisibility, addChild } from "../natives/functions.js";
import { resolveGradient } from "../natives/datatables.js";
import { allocScString, withScString } from "../core/scstring.js";
import { paintGradient } from "./gradient.js";

let _init = false;
let field = null;

function repaint() {
    if (field === null) return;
    const phase = (Date.now() % constants.Badge_shinePeriod) / constants.Badge_shinePeriod;
    withScString(paintGradient(constants.Badge_text, phase), (sc) => setText(field, sc));
}

const uiSc = Memory.allocUtf8String(constants.Badge_sc);
const popover = Memory.allocUtf8String(constants.Badge_clip);

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
            withScString(paintGradient(constants.Badge_text, 0), (sc) => setText(field, sc));

            addChild(this.page, field);
            setVisibility(field, 1);
        }
    });

    setInterval(repaint, constants.Badge_shineMs);
}
