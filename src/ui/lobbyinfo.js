import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, getTextFieldByName, setText, setFontSize, setTextColor, setAllowColorCodes, setXY, setVisibility, addChild } from "../core/functions.js";
import { withScString } from "../core/scstring.js";
import { mix, wave, paintGradient } from "./gradient.js";

let _init = false;
let field = null;
let phase = 0;
let gradient = false;

const uiSc = Memory.allocUtf8String("sc/ui.sc");
const popover = Memory.allocUtf8String("popover_text_left");
const textName = Memory.allocUtf8String("text");

function setPlain(text) {
    withScString(text, (sc) => setText(field, sc));
}

function setGradient() {
    withScString(paintGradient(constants.Lobby_text, phase), (sc) => setText(field, sc));
}

function textLength() {
    return field.add(structs.TextField_text).add(structs.ScString_length).readU32();
}

function layoutWidth() {
    const block = field.add(structs.TextField_layout).readPointer();
    return block.isNull() ? -1 : block.add(structs.TextBlock_width).readFloat();
}

function shine() {
    if (!field) return;
    phase = (phase + constants.Lobby_shineStep) % 1;
    if (gradient) {
        setGradient();
    } else {
        setTextColor(field, mix(constants.Lobby_lightColor, constants.Lobby_darkColor, wave(phase)));
    }
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
            const clip = getMovieClip(uiSc, popover, 0);
            field = getTextFieldByName(clip, textName);

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            addChild(this.page, field);
            setVisibility(field, true);

            setAllowColorCodes(field, true);
            setGradient();

            const length = textLength();
            console.log(`[memory] tagged len=${length} blockWidth=${layoutWidth()}`);

            gradient = length !== 0;
            if (!gradient) {
                setPlain(constants.Lobby_text);
            }
        }
    });

    setInterval(shine, constants.Lobby_shineMs);
}
