import { offsets } from "../natives/offsets.js";
import { constants } from "../natives/constants.js";
import { buttonPressedCallback } from "../natives/callbacks.js";
import { makePopup } from "./popup.js";
import { makeButton } from "./button.js";
import { pages } from "./pages.js";

let _init = false;
let popup = null;

function buildPage(page) {
    for (let index = 0; index < page.length; index++) {
        const column = index % constants.Menu_gridX.length;
        const row = Math.floor(index / constants.Menu_gridX.length);
        makeButton(popup, page[index], constants.Menu_gridX[column], constants.Menu_gridY[row]);
    }
}

export function setupMenu(base) {
    if (_init) return;
    _init = true;

    Interceptor.replace(base.add(offsets.CustomButton_buttonPressed), buttonPressedCallback);

    Interceptor.attach(base.add(offsets.HomePage_ctor), {
        onLeave() {
            popup = makePopup();
            buildPage(pages[0]);
        }
    });
}
