import { constants } from "../natives/constants.js";
import { popupAddButton, setXY } from "../natives/functions.js";
import { registerButton } from "../natives/callbacks.js";

export function makeButton(popup, entry, label, x, y) {
    const button = popupAddButton(popup, label, constants.Menu_buttonArg);
    setXY(button, x, y);
    if (entry.action !== null) {
        registerButton(button, entry.action);
    }
    return button;
}
