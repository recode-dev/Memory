import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { battleModeGetInstance, clientInputCtor, clientInputManagerAddInput, getOwnCharacter } from "../natives/functions.js";
import { inputToken } from "../utils/crypto.js";

function bytesAt(pointer, size) {
  return new Uint8Array(pointer.readByteArray(size));
}

function signInput(input, mode) {
  if (mode.add(structs.BattleMode_hashEnabled).readU8() !== 1) return;
  const secrets = {
    key16: bytesAt(mode.add(structs.BattleMode_hashKey), constants.Crypto_maskSize),
    maskIn: bytesAt(base.add(offsets.ClientInput_hashInnerMask), constants.Crypto_maskSize),
    maskOut: bytesAt(base.add(offsets.ClientInput_hashOuterMask), constants.Crypto_maskSize)
  };
  const table = bytesAt(base.add(offsets.ClientInput_typeConstantTable), constants.ClientInput_typeTableEntries * 4);
  const type = input.add(structs.ClientInput_type).readU32();
  const constant = table[type * 4] | (table[type * 4 + 1] << 8) | (table[type * 4 + 2] << 16) | (table[type * 4 + 3] << 24);
  const typeConst = new Uint8Array([constant & 0xff, (constant >>> 16) & 0xff, 0, 0]);
  const snapshot = bytesAt(input.add(constants.ClientInput_dataOffset), constants.Crypto_maskSize);
  input.add(structs.ClientInput_token).writeU32(inputToken(secrets, typeConst, snapshot));
}

function sendMoveInput() {
  const mode = battleModeGetInstance();
  const character = getOwnCharacter(mode.add(structs.BattleMode_battleClient).readPointer());
  if (character.isNull()) return;
  const input = Memory.alloc(constants.ClientInput_recordSize);
  clientInputCtor(input, constants.ClientInput_moveType);
  input.add(structs.ClientInput_x).writeInt(character.add(structs.Character_posX).readInt());
  input.add(structs.ClientInput_y).writeInt(character.add(structs.Character_posY).readInt());
  signInput(input, mode);
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

let base = null;
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
export function setupAntiAfk(moduleBase) {
  base = moduleBase;
  address = moduleBase.add(offsets.BattleScreen_isAFK);
  apply();
}
export function toggleAntiAfk() {
  toggleFlag("antiAfk");
  apply();
}
