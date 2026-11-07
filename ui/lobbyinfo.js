import { offsets } from "../core/offsets.js";
import { initFunctions, getMovieClip, getFieldByName, setText, addChild, setXY } from "../core/functions.js";
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
            const clip = getMovieClip(uiSc, popover, 1);
            const tf = getFieldByName(clip, textName);

            withScString("<c00FF66>Recoil+</c> v1.0\n<cFFFFFF>Telegram: @recoil_dev</c>", (str) => {
                setText(tf, str);
            });

            setXY(tf, 120.0, 90.0);
            addChild(this.page, tf);
        }
    });
}