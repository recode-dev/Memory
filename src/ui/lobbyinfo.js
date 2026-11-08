import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, createBlingTextField, setText, setFontSize, setTextColor, setXY, setVisibility, addChild } from "../core/functions.js";
import { resolveGradient } from "../core/datatables.js";
import { makeScString, withScString } from "../utils/scstring.js";
import { paintGradient } from "./gradient.js";

let _init = false;
let field = null;

function repaint() {
    if (field === null) return;
    const phase = (Date.now() % constants.Lobby_shinePeriod) / constants.Lobby_shinePeriod;
    withScString(paintGradient(constants.Lobby_text, phase), (sc) => setText(field, sc));
}

const uiSc = Memory.allocUtf8String("sc/ui.sc");
const popover = Memory.allocUtf8String("popover_text_left");

export function setupLobbyInfo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    const textName = makeScString("text");

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onEnter(args) {
            this.page = args[0];
        },
        onLeave() {
            const clip = getMovieClip(uiSc, popover, 0);
            field = createBlingTextField(clip, textName, resolveGradient(constants.Lobby_gradientTable, constants.Lobby_gradientId));

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            withScString(paintGradient(constants.Lobby_text, 0), (sc) => setText(field, sc));

            addChild(this.page, field);
            setVisibility(field, 1);
        }
    });

    setInterval(repaint, constants.Lobby_shineMs);
}
