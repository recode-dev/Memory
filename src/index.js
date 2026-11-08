import { setupLicense } from "./utils/license.js";
import { setupLobbyInfo } from "./ui/lobbyinfo.js";
import { setupAntiAfk } from "./features/antiafk.js";
import { setupAmmo } from "./features/ammo.js";
import { constants } from "./natives/constants.js";

const module = Process.getModuleByName(constants.Module_name);

setupLicense(module);
setupLobbyInfo(module.base);
setupAntiAfk(module.base);
setupAmmo(module.base);
