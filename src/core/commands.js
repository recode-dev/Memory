import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { battleModeGetInstance, clientInputCtor, clientInputManagerAddInput, malloc } from "../natives/functions.js";
import { sha256 } from "../utils/crypto.js";

let base = null;
let typeTable = null;
let innerMask = null;
let outerMask = null;

function loadSigningConstants() {
  if (typeTable) return;
  typeTable = new Uint32Array(base.add(offsets.ClientInput_typeConstantTable).readByteArray((constants.ClientInput_maxTableType + 1) * 4));
  innerMask = new Uint8Array(base.add(offsets.ClientInput_hashInnerMask).readByteArray(constants.ClientInput_maskSize));
  outerMask = new Uint8Array(base.add(offsets.ClientInput_hashOuterMask).readByteArray(constants.ClientInput_maskSize));
}

function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
}

function tokenOf(key, cmd, type) {
  let typeC = constants.ClientInput_fallbackType;
  if (type <= constants.ClientInput_maxTableType) typeC = typeTable[type];
  const msg = new Uint8Array(constants.ClientInput_msgSize);
  msg.set(cmd.subarray(4), 0);
  msg.set(cmd.subarray(0, 4), 12);
  msg[16] = typeC;
  msg[17] = typeC >>> 8;
  msg[18] = typeC >>> 16;
  msg[19] = typeC >>> 24;
  const block = new Uint8Array(constants.ClientInput_hashBlockSize);
  for (let i = 0; i < constants.ClientInput_maskSize; i++) block[i] = key[i] ^ innerMask[i];
  block.fill(0x36, constants.ClientInput_maskSize);
  const inner = sha256(concat(block, msg));
  for (let i = 0; i < constants.ClientInput_maskSize; i++) block[i] = key[i] ^ outerMask[i];
  block.fill(0x5c, constants.ClientInput_maskSize);
  const digest = sha256(concat(block, inner));
  const token = digest[0] | (digest[1] & 0x7f) << 8;
  return token < 2 ? 1 : token;
}

export function signClientInput(input, battle) {
  if (battle.add(structs.BattleMode_hashEnabled).readU8() !== 1) return;
  const key = new Uint8Array(battle.add(structs.BattleMode_hashKey).readByteArray(constants.ClientInput_maskSize));
  const cmd = new Uint8Array(input.add(structs.ClientInput_data).readByteArray(constants.ClientInput_maskSize));
  const type = cmd[4] | cmd[5] << 8 | cmd[6] << 16 | cmd[7] << 24;
  input.add(structs.ClientInput_token).writeU32(tokenOf(key, cmd, type));
}

export function setupCommands(moduleBase) {
  if (base) return;
  base = moduleBase;
  loadSigningConstants();
}

export function sendCommand(cmdType, fillFn) {
  const battle = battleModeGetInstance();
  const manager = battle.add(structs.BattleMode_clientInputManager).readPointer();
  const input = malloc(constants.ClientInput_recordSize);
  input.writeByteArray(new ArrayBuffer(constants.ClientInput_recordSize));
  clientInputCtor(input, cmdType);
  fillFn(input);
  signClientInput(input, battle);
  clientInputManagerAddInput(manager, input);
}
