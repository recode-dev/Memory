import { customButtonCtor, customButtonSetMovieClip, getMovieClip, malloc, movieClipSetText, setVisibility, setXY, stageAddChild, stageInstance } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString, destroyScString } from "../core/scstring.js";
import { registerButton } from "../natives/callbacks.js";
import { log } from "../core/log.js";

var labelField = Memory.allocUtf8String(constants.Menu_modButtonField);
var button = null;
export function makeMenuButton(action) {
  if (button !== null) return button;
  const sc = Memory.allocUtf8String(constants.Menu_sc);
  const clipName = Memory.allocUtf8String(constants.Menu_modButtonClip);
  const clip = getMovieClip(sc, clipName, 0);
  const stage = stageInstance();
  log("menu: stage=" + stage + " clip=" + clip);
  button = malloc(constants.Menu_buttonSize);
  customButtonCtor(button);
  customButtonSetMovieClip(button, clip, 1);
  setXY(button, constants.Menu_modButtonX, constants.Menu_modButtonY);
  const label = allocScString(constants.Menu_modButtonLabel);
  movieClipSetText(clip, labelField, label);
  destroyScString(label);
  button.add(structs.DisplayObject_touchable).writeU8(1);
  setVisibility(button, 1);
  stageAddChild(stage, button);
  registerButton(button, action);
  log("menu: button=" + button + " parent=" + button.add(56).readPointer() + " touch=" + button.add(76).readU8());
  return button;
}
