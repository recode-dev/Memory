import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { NativeFunctions } from "../natives/functions.js";
import { Crypto } from "../utils/crypto.js";

function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
}

export class Commands {
  static base = null;
  static typeTable = null;
  static innerMask = null;
  static outerMask = null;

  static init(moduleBase) {
    if (this.base) return;
    this.base = moduleBase;
    this.typeTable = new Uint32Array(this.base.add(offsets.ClientInput_typeConstantTable).readByteArray((constants.ClientInput_maxTableType + 1) * 4));
    this.innerMask = new Uint8Array(this.base.add(offsets.ClientInput_hashInnerMask).readByteArray(constants.ClientInput_maskSize));
    this.outerMask = new Uint8Array(this.base.add(offsets.ClientInput_hashOuterMask).readByteArray(constants.ClientInput_maskSize));
  }

  static tokenOf(key, cmd, type) {
    let typeC = constants.ClientInput_fallbackType;
    if (type <= constants.ClientInput_maxTableType) typeC = this.typeTable[type];
    const msg = new Uint8Array(constants.ClientInput_msgSize);
    msg.set(cmd.subarray(4), 0);
    msg.set(cmd.subarray(0, 4), 12);
    msg[16] = typeC;
    msg[17] = typeC >>> 8;
    msg[18] = typeC >>> 16;
    msg[19] = typeC >>> 24;
    const block = new Uint8Array(constants.ClientInput_hashBlockSize);
    for (let i = 0; i < constants.ClientInput_maskSize; i++) block[i] = key[i] ^ this.innerMask[i];
    block.fill(0x36, constants.ClientInput_maskSize);
    const inner = Crypto.sha256(concat(block, msg));
    for (let i = 0; i < constants.ClientInput_maskSize; i++) block[i] = key[i] ^ this.outerMask[i];
    block.fill(0x5c, constants.ClientInput_maskSize);
    const digest = Crypto.sha256(concat(block, inner));
    const token = digest[0] | (digest[1] & 0x7f) << 8;
    return token < 2 ? 1 : token;
  }

  static signClientInput(input, battle) {
    if (battle.add(structs.BattleMode_hashEnabled).readU8() !== 1) return;
    const key = new Uint8Array(battle.add(structs.BattleMode_hashKey).readByteArray(constants.ClientInput_maskSize));
    const cmd = new Uint8Array(input.add(structs.ClientInput_data).readByteArray(constants.ClientInput_maskSize));
    const type = cmd[4] | cmd[5] << 8 | cmd[6] << 16 | cmd[7] << 24;
    input.add(structs.ClientInput_token).writeU32(this.tokenOf(key, cmd, type));
  }

  static sendCommand(cmdType, fillFn) {
    const battle = NativeFunctions.battleModeGetInstance();
    const manager = battle.add(structs.BattleMode_clientInputManager).readPointer();
    const input = NativeFunctions.malloc(constants.ClientInput_recordSize);
    input.writeByteArray(new ArrayBuffer(constants.ClientInput_recordSize));
    NativeFunctions.clientInputCtor(input, cmdType);
    fillFn(input);
    this.signClientInput(input, battle);
    NativeFunctions.clientInputManagerAddInput(manager, input);
  }

  static sendMove(logic, x, y) {
    NativeFunctions.setClientPredictionMoveTo(logic, x, y, 1);
    this.sendCommand(constants.ClientInput_moveType, (input) => {
      input.add(structs.ClientInput_x).writeS32(x);
      input.add(structs.ClientInput_y).writeS32(y);
    });
  }
}
