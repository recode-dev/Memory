import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, getTextFieldByName, setText, setFontSize, setTextColor, setXY, setVisibility, addChild } from "../core/functions.js";
import { withScString } from "../core/scstring.js";

let _init = false;

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
            const field = getTextFieldByName(clip, textName);

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(structs.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            withScString(constants.Lobby_text, (text) => setText(field, text));

            addChild(this.page, field);
            setVisibility(field, true);
        }
    });
}
