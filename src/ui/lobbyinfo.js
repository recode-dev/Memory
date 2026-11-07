import { offsets } from "../core/offsets.js";
import { constants } from "../core/constants.js";
import { initFunctions, getMovieClip, createBlingTextField, setText, setFontSize, setTextColor, setXY, setVisibility, addChild, stringCtor, stringDtor } from "../core/functions.js";

let _init = false;

function withString(text, fn) {
    const sc = Memory.alloc(offsets.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    const result = fn(sc);
    stringDtor(sc);
    return result;
}

function gradient(base) {
    const table = base.add(offsets.LogicDataTables_tables).add(constants.Lobby_gradientTable * Process.pointerSize).readPointer();
    const entries = table.add(offsets.LogicDataTable_entries).readPointer();
    return entries.add(constants.Lobby_gradientId * Process.pointerSize).readPointer();
}

export function setupLobbyInfo(base) {
    if (_init) return;
    _init = true;

    initFunctions(base);

    const uiSc = Memory.allocUtf8String("sc/ui.sc");
    const popover = Memory.allocUtf8String("popover_text_left");

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onEnter(args) {
            this.page = args[0];
        },
        onLeave() {
            const clip = getMovieClip(uiSc, popover, 0);
            const field = withString("text", (name) => createBlingTextField(clip, name, gradient(base)));

            setXY(field, constants.Lobby_x, constants.Lobby_y);
            setFontSize(field, constants.Lobby_fontSize);
            field.add(offsets.TextField_fontOutline).writeU8(constants.Lobby_fontOutline);
            setTextColor(field, constants.Lobby_color);
            withString(constants.Lobby_text, (text) => setText(field, text));

            addChild(this.page, field);
            setVisibility(field, true);
        }
    });
}
