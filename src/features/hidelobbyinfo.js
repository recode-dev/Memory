import { flags } from "../utils/flags.js";
import { LobbyInfo } from "../ui/lobbyinfo.js";

export class HideLobbyInfo {
  static toggle() {
    flags.toggle("hideLobbyInfo");
    LobbyInfo.applyVisibility();
  }
}
