import { constants } from "../natives/constants.js";
import { malloc, gameButtonCtor, customButtonSetMovieClip, setScale, setXY, addChild, movieClipSetText } from "../natives/functions.js";
import { registerButton } from "../natives/callbacks.js";

export function makeButton(popup, entry, label, clip, labelField, x, y) {
    const button = malloc(constants.Menu_buttonSize);
    gameButtonCtor(button);
    customButtonSetMovieClip(button, clip, 1);
    setScale(button, constants.Menu_buttonScale);
    setXY(button, x, y);
    movieClipSetText(button, labelField, label);
    addChild(popup, button);
    if (entry.action !== null) {
        registerButton(button, entry.action);
    }
    return button;
}
