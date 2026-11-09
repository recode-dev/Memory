import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { battleModeGetInstance, clientInputCtor, clientInputManagerAddInput, getOwnCharacter } from "../natives/functions.js";

function sendMoveInput() {
  const mode = battleModeGetInstance();
  const character = getOwnCharacter(mode.add(structs.BattleMode_battleClient).readPointer());
  if (character.isNull()) return;
  const input = Memory.alloc(constants.ClientInput_recordSize);
  clientInputCtor(input, constants.ClientInput_moveType);
  input.add(structs.ClientInput_x).writeInt(character.add(structs.Character_posX).readInt());
  input.add(structs.ClientInput_y).writeInt(character.add(structs.Character_posY).readInt());
  clientInputManagerAddInput(mode.add(structs.BattleMode_inputManager).readPointer(), input);
}

let lastSent = 0;

const handler = new NativeCallback(function (screen) {
  const idle = screen.add(structs.BattleScreen_afkTime);
  if (idle.readFloat() > constants.AntiAfk_idleSeconds && Date.now() - lastSent > constants.AntiAfk_resendMs) {
    sendMoveInput();
    idle.writeFloat(0);
    lastSent = Date.now();
  }
  return 0;
}, "bool", ["pointer"]);

let address = null;
let replaced = false;

function apply() {
  if (flags.antiAfk === replaced) return;
  if (flags.antiAfk) {
    Interceptor.replace(address, handler);
  } else {
    Interceptor.revert(address);
  }
  replaced = flags.antiAfk;
}
export function setupAntiAfk(base) {
  address = base.add(offsets.BattleScreen_isAFK);
  apply();
}
export function toggleAntiAfk() {
  toggleFlag("antiAfk");
  apply();
}
