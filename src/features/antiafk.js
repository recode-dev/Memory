import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { battleModeGetInstance, clientInputCtor, clientInputManagerAddInput, getOwnCharacter } from "../natives/functions.js";

function moveToCharacter() {
  const mode = battleModeGetInstance();
  const character = getOwnCharacter(mode.add(structs.BattleMode_battleClient).readPointer());
  if (character.isNull()) return;
  const input = Memory.alloc(200);
  clientInputCtor(input, constants.ClientInput_moveType);
  input.add(structs.ClientInput_x).writeInt(character.add(structs.Character_posX).readInt());
  input.add(structs.ClientInput_y).writeInt(character.add(structs.Character_posY).readInt());
  clientInputManagerAddInput(mode.add(structs.BattleMode_inputManager).readPointer(), input);
}

let _init = false;
export function setupAntiAfk(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
    onEnter(args) {
      this.idle = args[0].add(structs.BattleScreen_afkTime).readFloat();
    },
    onLeave(retval) {
      if (!flags.antiAfk) return;
      if (this.idle > constants.AntiAfk_idleSeconds) moveToCharacter();
      retval.replace(0);
    }
  });
}
