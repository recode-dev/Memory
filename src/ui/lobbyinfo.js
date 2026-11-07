import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, getTextFieldByName, setText, setFontSize, setTextColor, setXY, setVisibility, addChild } from "../core/functions.js";
import { withScString } from "../core/scstring.js";
import { mix, wave } from "./gradient.js";

let _init = false;
let top = null;
let bottom = null;
let phase = 0;

const uiSc = Memory.allocUtf8String("sc/ui.sc");
const popover = Memory.allocUtf8String("popover_text_left");
const textName = Memory.allocUtf8String("text");

function createField(page, y, text) {
    const clip = getMovieClip(uiSc, popover, 0);
    const field = getTextFieldByName(clip, textName);

    setXY(field, constants.Lobby_x, y);
    setFontSize(field, constants.Lobby_fontSize);
    field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
    setTextColor(field, constants.Lobby_color);
    withScString(text, (sc) => setText(field, sc));

    addChild(page, field);
    setVisibility(field, true);
    return field;
}

function shine() {
    if (!top) return;
    phase = (phase + constants.Lobby_shineStep) % 1;
    setTextColor(top, mix(constants.Lobby_lightColor, constants.Lobby_midColor, wave(phase)));
    setTextColor(bottom, mix(constants.Lobby_midColor, constants.Lobby_darkColor, wave(phase + 0.5)));
}

export function setupLobbyInfo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onEnter(args) {
            this.page = args[0];
        },
        onLeave() {
            top = createField(this.page, constants.Lobby_y, constants.Lobby_textTop);
            bottom = createField(this.page, constants.Lobby_y + constants.Lobby_lineHeight, constants.Lobby_textBottom);
        }
    });

    setInterval(shine, constants.Lobby_shineMs);
}
