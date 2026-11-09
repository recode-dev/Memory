import { toggleFlag } from "../utils/flags.js";
import { syncLobbyInfo } from "../ui/lobbyinfo.js";

export function toggleHideLobbyInfo() {
  toggleFlag("hideLobbyInfo");
  syncLobbyInfo();
}
