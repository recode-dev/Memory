import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, getTextFieldByName, setText, setFontSize, setTextColor, setAllowColorCodes, setXY, setVisibility, addChild } from "../core/functions.js";
import { withScString } from "../core/scstring.js";
import { paintGradient } from "./gradient.js";

let _init = false;
let field = null;
let phase = 0;

function paint() {
    withScString(paintGradient(constants.Lobby_text, phase), (text) => setText(field, text));
}

function shine() {
    if (!field) return;
    phase = (phase + constants.Lobby_shineStep) % 1;
    paint();
}

export function setupLobbyInfo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    const uiSc = Memory.allocUtf8String("sc/ui.sc");
    const popover = Memory.allocUtf8String("popover_text_left");
    const textName = Memory.allocUtf8String("text");

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onEnter(args) {
            this.page = args[0];
        },
        onLeave() {
            const clip = getMovieClip(uiSc, popover, 0);
            field = getTextFieldByName(clip, textName);

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            setAllowColorCodes(field, true);
            paint();

            addChild(this.page, field);
            setVisibility(field, true);
        }
    });

    setInterval(shine, constants.Lobby_shineMs);
}
