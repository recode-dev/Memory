import { initFunctions } from "./natives/functions.js";
import { setupLicense } from "./utils/license.js";
import { setupLobbyInfo } from "./ui/lobbyinfo.js";
import { setupAntiAfk } from "./features/antiafk.js";
import { setupMenu } from "./ui/menu.js";
import { setupAmmo } from "./features/ammo.js";

var module = Process.getModuleByName("Nulls Brawl");
initFunctions(module.base);
setupLicense(module);
setupLobbyInfo(module.base);
setupAntiAfk(module.base);
setupMenu(module.base);
setupAmmo(module.base);
