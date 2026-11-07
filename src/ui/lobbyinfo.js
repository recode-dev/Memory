import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, createBlingTextField, resolveGradient, setText, setFontSize, setTextColor, setXY, setVisibility, addChild } from "../core/functions.js";
import { makeScString, withScString } from "../core/scstring.js";

let _init = false;

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
            const field = createBlingTextField(clip, textName, resolveGradient(constants.Lobby_gradientTable, constants.Lobby_gradientId));
            if (field.isNull()) {
                console.log("[memory] bling create failed: no 'text' field in popover_text_left");
                return;
            }

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            withScString(constants.Lobby_text, (sc) => setText(field, sc));

            addChild(this.page, field);
            setVisibility(field, true);
        }
    });
}
