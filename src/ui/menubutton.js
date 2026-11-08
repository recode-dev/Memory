import { customButtonCtor, customButtonSetMovieClip, getMovieClip, malloc, movieClipSetText, setVisibility, setXY, stageAddChild, stageInstance } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString, destroyScString } from "../core/scstring.js";
import { registerButton } from "../natives/callbacks.js";

let labelField = Memory.allocUtf8String(constants.Menu_modButtonField);
let button = null;
export function makeMenuButton(action) {
  if (button !== null) return button;
  const sc = Memory.allocUtf8String(constants.Menu_sc);
  const clipName = Memory.allocUtf8String(constants.Menu_modButtonClip);
  const clip = getMovieClip(sc, clipName, 0);
  button = malloc(constants.Menu_buttonSize);
  customButtonCtor(button);
  customButtonSetMovieClip(button, clip, 1);
  setXY(button, constants.Menu_modButtonX, constants.Menu_modButtonY);
  const label = allocScString(constants.Menu_modButtonLabel);
  movieClipSetText(clip, labelField, label);
  destroyScString(label);
  button.add(structs.DisplayObject_touchable).writeU8(1);
  setVisibility(button, 1);
  stageAddChild(stageInstance(), button);
  registerButton(button, action);
  return button;
}
