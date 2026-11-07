import { setupLicense } from "./utils/license.js";
import { setupLobbyInfo } from "./ui/lobbyinfo.js";
import { setupAntiAfk } from "./core/features/antiafk.js";

const module = Process.getModuleByName("Nulls Brawl");

setupLicense(module);
setupLobbyInfo(module.base);
setupAntiAfk(module.base);
