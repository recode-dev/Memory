import { movieClipSetText, setXY } from "../natives/functions.js";
import { registerButton } from "../natives/callbacks.js";

export function makeButton(button, entry, label, labelField, x, y) {
    setXY(button, x, y);
    movieClipSetText(button, labelField, label);
    if (entry.action !== null) {
        registerButton(button, entry.action);
    }
}
