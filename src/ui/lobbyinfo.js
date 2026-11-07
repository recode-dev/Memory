import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, getTextFieldByName, setText, setMultiLine, setXY, addChild } from "../core/functions.js";
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

            field.add(structs.DisplayObject_visible).writeU8(1);
            setMultiLine(field, true);
            setXY(constants.Lobby_x, constants.Lobby_y, field);
            withScString(constants.Lobby_text, (text) => setText(field, text));

            addChild(this.page, field);
        }
    });
}
