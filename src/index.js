import { NativeFunctions } from "./natives/functions.js";
import { Commands } from "./core/commands.js";
import { BattleTick } from "./core/tick.js";
import { License } from "./utils/license.js";
import { LobbyInfo } from "./ui/lobbyinfo.js";
import { AntiAfk } from "./features/antiafk.js";
import { Menu } from "./ui/menu.js";
import { Ammo } from "./features/ammo.js";
import { HideUltiAiming } from "./features/hideultiaiming.js";
import { AutoSpin } from "./features/autospin.js";
import { AntiAutoShoot } from "./features/antiautoshoot.js";

class Index {
  static init() {
    const module = Process.getModuleByName("Nulls Brawl");
    NativeFunctions.init(module.base);
    Commands.init(module.base);
    BattleTick.init(module.base);
    License.init(module);
    LobbyInfo.init(module.base);
    AntiAfk.init(module.base);
    Menu.init(module.base);
    Ammo.init(module.base);
    HideUltiAiming.init(module.base);
    AutoSpin.init();
    AntiAutoShoot.init(module.base);
  }
}

Index.init();
