import { constants } from "../natives/constants.js";
import { popupAddButton, setXY } from "../natives/functions.js";
import { registerButton } from "../natives/callbacks.js";
import { withScString } from "../core/scstring.js";

export function makeButton(popup, entry, x, y) {
    const button = withScString(entry.label, (sc) => popupAddButton(popup, sc, constants.Menu_buttonArg));
    setXY(button, x, y);
    if (entry.action !== null) {
        registerButton(button, entry.action);
    }
    return button;
}
