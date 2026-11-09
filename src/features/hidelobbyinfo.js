import { flags, toggleFlag } from "../utils/flags.js";
import { setVisibility } from "../natives/functions.js";

let field = null;
function apply() {
  if (field === null) return;
  setVisibility(field, flags.hideLobbyInfo ? 0 : 1);
}
export function setLobbyInfoField(node) {
  field = node;
  apply();
}
export function toggleHideLobbyInfo() {
  toggleFlag("hideLobbyInfo");
  apply();
}
