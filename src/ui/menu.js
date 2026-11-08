import { offsets } from "../natives/offsets.js";
import { buttonAction } from "../natives/callbacks.js";
import { makeMenuButton } from "./menubutton.js";
import { togglePanel } from "./panel.js";

let _init = false;
export function setupMenu(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.CustomButton_buttonPressed), {
    onEnter(args) {
      const action = buttonAction(args[0]);
      if (action) action();
    }
  });
  Interceptor.attach(base.add(offsets.HomePage_ctor), {
    onLeave() {
      makeMenuButton(togglePanel);
    }
  });
}
