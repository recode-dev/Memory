import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";
import { getMovieClip } from "../natives/functions.js";
import { buttonAction } from "../natives/callbacks.js";
import { allocScString } from "../core/scstring.js";
import { makePopup } from "./popup.js";
import { makeButton } from "./button.js";
import { pages } from "./pages.js";

let _init = false;
let popup = null;
let popupType = null;
let labels = null;
let sc = null;
let buttonClip = null;
let labelField = null;

function renderPage(page) {
    const clip = getMovieClip(sc, buttonClip, 0);
    const addButton = new NativeFunction(popup.readPointer().add(constants.Menu_addButtonSlot).readPointer(), "pointer", ["pointer", "pointer", "int"]);
    for (let index = 0; index < page.length; index++) {
        const column = index % constants.Menu_gridX.length;
        const row = Math.floor(index / constants.Menu_gridX.length);
        const button = addButton(popup, clip, constants.Menu_buttonFlag);
        makeButton(button, page[index], labels[index], labelField, constants.Menu_gridX[column], constants.Menu_gridY[row]);
    }
}

export function setupMenu(base) {
    if (_init) return;
    _init = true;

    popupType = allocScString(constants.Menu_popupType);
    labels = pages[0].map((entry) => allocScString(entry.label));
    sc = Memory.allocUtf8String(constants.Menu_sc);
    buttonClip = Memory.allocUtf8String(constants.Menu_buttonClip);
    labelField = Memory.allocUtf8String(constants.Menu_labelField);

    Interceptor.attach(base.add(offsets.CustomButton_buttonPressed), {
        onEnter(args) {
            const action = buttonAction(args[0]);
            if (action !== null) action();
        }
    });

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onLeave() {
            popup = makePopup(popupType);
            renderPage(pages[0]);
        }
    });
}
