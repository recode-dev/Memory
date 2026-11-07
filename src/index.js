import { setupLicense } from "./utils/license.js";
import { setupLobbyInfo } from "./ui/lobbyinfo.js";

const base = Process.getModuleByName("Nulls Brawl").base;

setupLicense(base);
setupLobbyInfo(base);
