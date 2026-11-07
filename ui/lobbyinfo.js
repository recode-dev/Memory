import { offsets } from "../core/offsets.js";
import { getMovieClip, getFieldByName, setText, addChild, setXY } from "../core/functions.js";
import { makeScString } from "../core/scstring.js";

let _init = false;

export function setupLobbyInfo(base) {
    if (_init) return;
    _init = true;

    const file = makeScString("sc/ui.sc");
    const clipName = makeScString("popover_text_left");
    const fieldName = makeScString("text");
    const text = makeScString("<c00FF66>Recoil+</c> v1.0\n<cFFFFFF>Telegram: @recoil_dev</c>");

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onEnter(args) {
            this.page = args[0];
        },
        onLeave() {
            const clip = getMovieClip(file, clipName, 0);
            const tf = getFieldByName(clip, fieldName);

            setText(tf, text);
            setXY(tf, 120.0, 90.0);
            addChild(this.page, tf);
        }
    });
}