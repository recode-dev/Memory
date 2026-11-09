import { flags, toggleFlag } from "../utils/flags.js";

let apply = null;
export function setLobbyInfoField(applyVisibility) {
  apply = applyVisibility;
  apply();
}
export function toggleHideLobbyInfo() {
  toggleFlag("hideLobbyInfo");
  apply();
}
