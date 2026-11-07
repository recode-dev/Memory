import { offsets } from "../core/offsets.js";
import { structs } from "../core/structs.js";
import { initFunctions, getMovieClip, getFieldByName, setText, setMultiLine, setVisibility, addChild, setXY } from "../core/functions.js";
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
            const tf = getFieldByName(clip, textName);

            setMultiLine(tf, true);
            setVisibility(tf, true);

            withScString("<c00FF66>BSD BRAWL</c> v69.252\n<cFFFFFF>Telegram: @bsdatamines</c>", (str) => {
                setText(tf, str);
            });

            setXY(tf, 120.0, 90.0);

            const container = this.page.add(structs.GUIContainer_movieClip).readPointer();
            addChild(container.isNull() ? this.page : container, tf);
        }
    });
}
