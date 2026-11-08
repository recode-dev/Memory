import { constants } from "../natives/constants.js";
import { malloc, popupCtor } from "../natives/functions.js";

export function makePopup(type) {
    const popup = malloc(constants.Menu_popupSize);
    popupCtor(popup, type, 0, 0, NULL, NULL, NULL, NULL);
    return popup;
}
