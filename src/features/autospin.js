import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags } from "../utils/flags.js";
import { battleModeGetInstance, clientInputCtor, clientInputManagerAddInput, gameObjectGetX, gameObjectGetY, getOwnCharacter, setClientPredictionMoveTo } from "../natives/functions.js";

let screen = null;
let client = null;
let gameScreenGetLogicBattle = null;
let angle = 0;
let startX = 0;
let startY = 0;

function logicBattle() {
  if (gameScreenGetLogicBattle === null) return null;
  return gameScreenGetLogicBattle(screen);
}

function sendMove(x, y) {
  const input = Memory.alloc(constants.ClientInput_recordSize);
  clientInputCtor(input, constants.ClientInput_moveType);
  input.add(structs.ClientInput_x).writeInt(x);
  input.add(structs.ClientInput_y).writeInt(y);
  clientInputManagerAddInput(battleModeGetInstance().add(structs.BattleMode_inputManager).readPointer(), input);
  setClientPredictionMoveTo(client, x, y);
}

function spin() {
  if (!flags.autoSpin || client === null || logicBattle() === null) return;
  const character = getOwnCharacter(client);
  if (character.isNull()) return;
  if (startX === 0) {
    startX = gameObjectGetX(character);
    startY = gameObjectGetY(character);
  }
  angle += constants.Spinner_angleStep;
  sendMove(
    startX + Math.round(Math.cos(angle) * constants.Spinner_radius),
    startY + Math.round(Math.sin(angle) * constants.Spinner_radius)
  );
}

let _init = false;
export function setupAutoSpin(base) {
  if (_init) return;
  _init = true;
  if (offsets.GameScreen_getLogicBattle !== "0x0") {
    gameScreenGetLogicBattle = new NativeFunction(base.add(offsets.GameScreen_getLogicBattle), "pointer", ["pointer"]);
  }
  Interceptor.attach(base.add(offsets.LogicBattleModeClient_update), {
    onEnter(args) {
      client = args[0];
    }
  });
  Interceptor.attach(base.add(offsets.BattleScreen_update), {
    onEnter(args) {
      screen = args[0];
    }
  });
  Interceptor.attach(base.add(offsets.BattleMode_exit), {
    onEnter() {
      client = null;
      screen = null;
      angle = 0;
      startX = 0;
      startY = 0;
    }
  });
  setInterval(spin, constants.Spinner_intervalMs);
}
