import { setupLicense } from "./utils/license.js";
import { setupLobbyInfo } from "./ui/lobbyinfo.js";
import { setupAntiAfk } from "./features/antiafk.js";
import { setupAmmo } from "./features/ammo.js";

const module = Process.getModuleByName("Nulls Brawl");

setupLicense(module);
setupLobbyInfo(module.base);
setupAntiAfk(module.base);
setupAmmo(module.base);
