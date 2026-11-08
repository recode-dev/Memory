import { constants } from "../natives/constants.js";
import { popupCtor } from "../natives/functions.js";
import { withScString } from "../core/scstring.js";

export function makePopup() {
    const popup = Memory.alloc(constants.Menu_popupSize);
    withScString(constants.Menu_popupType, (sc) => popupCtor(popup, sc, 0, 0, null, null, null, null));
    return popup;
}
