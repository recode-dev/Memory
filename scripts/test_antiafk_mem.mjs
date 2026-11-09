import { createHash } from "node:crypto";
import { offsets } from "../src/natives/offsets.js";
import { constants } from "../src/natives/constants.js";
import { structs } from "../src/natives/structs.js";

const BASE = 0x10000000;
const MALLOC_ADDR = 0x600d0000;
const BIN = new Uint8Array(0xf00000);
const HEAP = new Uint8Array(1 << 20);
const DV_BIN = new DataView(BIN.buffer);
const DV_HEAP = new DataView(HEAP.buffer);
let bump = 0x10000;

function region(addr) {
  return addr >= BASE ? [BIN, DV_BIN, addr - BASE] : [HEAP, DV_HEAP, addr];
}

class Ptr {
  constructor(addr) { this.addr = addr; }
  add(n) { return new Ptr(this.addr + Number(n)); }
  equals(p) { return this.addr === p.addr; }
  isNull() { return this.addr === 0; }
  toInt32() { return this.addr | 0; }
  toString() { return "0x" + this.addr.toString(16); }
  readByteArray(n) { const [buf, , idx] = region(this.addr); return buf.slice(idx, idx + n).buffer; }
  writeByteArray(buf) { const [buf2, , idx] = region(this.addr); buf2.set(new Uint8Array(buf), idx); }
  readU8() { const [, dv, idx] = region(this.addr); return dv.getUint8(idx); }
  writeU8(v) { const [, dv, idx] = region(this.addr); dv.setUint8(idx, v); }
  readU32() { const [, dv, idx] = region(this.addr); return dv.getUint32(idx, true); }
  writeU32(v) { const [, dv, idx] = region(this.addr); dv.setUint32(idx, v, true); }
  readS32() { const [, dv, idx] = region(this.addr); return dv.getInt32(idx, true); }
  writeS32(v) { const [, dv, idx] = region(this.addr); dv.setInt32(idx, v, true); }
  readS16() { const [, dv, idx] = region(this.addr); return dv.getInt16(idx, true); }
  readFloat() { const [, dv, idx] = region(this.addr); return dv.getFloat32(idx, true); }
  writeFloat(v) { const [, dv, idx] = region(this.addr); dv.setFloat32(idx, v, true); }
  readPointer() { const [, dv, idx] = region(this.addr); return new Ptr(Number(dv.getBigUint64(idx, true))); }
  writePointer(p) { const [, dv, idx] = region(this.addr); dv.setBigUint64(idx, BigInt(p.addr), true); }
  readUtf8String() {
    const [buf, , idx] = region(this.addr);
    let end = idx;
    while (buf[end] !== 0) end++;
    return new TextDecoder().decode(buf.slice(idx, end));
  }
}

const off = (name) => BASE + parseInt(offsets[name], 16);

let battleMode = null;
let ownChar = null;
const predictions = [];
const inputs = [];

globalThis.Memory = {
  alloc(n) { const a = bump; bump += (n + 15) & ~15; return new Ptr(a); },
  allocUtf8String(s) { const bytes = Buffer.from(s + "\0", "utf8"); const a = bump; HEAP.set(bytes, a); bump += bytes.length; return new Ptr(a); }
};
globalThis.Process = { pointerSize: 8 };
globalThis.Module = { getGlobalExportByName: () => new Ptr(MALLOC_ADDR) };
globalThis.ptr = (x) => new Ptr(x);
globalThis.NativeCallback = function (fn) { return fn; };
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

const natives = {
  [MALLOC_ADDR]: (n) => Memory.alloc(n),
  [off("BattleMode_getInstance")]: () => battleMode,
  [off("LogicBattleModeClient_getOwnCharacter")]: () => ownChar,
  [off("LogicGameObjectClient_getX")]: (p) => p.add(0x30).readS32(),
  [off("LogicGameObjectClient_getY")]: (p) => p.add(0x34).readS32(),
  [off("LogicBattleModeClient_setClientPredictionMoveTo")]: (l, x, y, f) => predictions.push({ logic: l.addr, x, y, flag: f }),
  [off("ClientInput_ctor")]: (input, type) => { HEAP.fill(0, input.addr, input.addr + 0x48); input.add(0x8).writeS32(type); },
  [off("ClientInputManager_addInput")]: (mgr, ci) => inputs.push({ ptr: ci, snapshot: HEAP.slice(ci.addr, ci.addr + 0x48) })
};
globalThis.NativeFunction = function (addr) { return natives[addr.addr] ?? (() => new Ptr(0x7777)); };

const hooks = new Map();
globalThis.Interceptor = {
  attach: (a, l) => { if (!hooks.has(a.addr)) hooks.set(a.addr, []); hooks.get(a.addr).push(l); return { detach() { const list = hooks.get(a.addr); const i = list.indexOf(l); if (i >= 0) list.splice(i, 1); } }; },
  detach: (l) => { for (const list of hooks.values()) { const i = list.indexOf(l); if (i >= 0) list.splice(i, 1); } },
  replace: () => {}
};

function setOwn(x, y) {
  ownChar.add(0x30).writeS32(x);
  ownChar.add(0x34).writeS32(y);
}
function makeBattle(enabled) {
  battleMode = Memory.alloc(0x100);
  battleMode.add(structs.BattleMode_clientInputManager).writePointer(Memory.alloc(0x100));
  const key = Buffer.from(Array.from({ length: 16 }, (_, i) => i + 1));
  HEAP.set(key, battleMode.addr + parseInt(structs.BattleMode_hashKey, 16));
  battleMode.add(structs.BattleMode_hashEnabled).writeU8(enabled ? 1 : 0);
}

const innerMask = Array.from({ length: 16 }, (_, i) => (i * 7 + 3) & 255);
const outerMask = Array.from({ length: 16 }, (_, i) => (i * 13 + 11) & 255);
BIN.set(new Uint8Array(innerMask), parseInt(offsets.ClientInput_hashInnerMask, 16));
BIN.set(new Uint8Array(outerMask), parseInt(offsets.ClientInput_hashOuterMask, 16));
for (let i = 0; i <= constants.ClientInput_maxTableType; i++) DV_BIN.setUint32(parseInt(offsets.ClientInput_typeConstantTable, 16) + i * 4, 0x51500000 + i * 0x101, true);

function fireHook(name, args) {
  for (const l of hooks.get(off(name)) ?? []) {
    if (l.onEnter) l.onEnter(args);
    if (l.onLeave) l.onLeave(args);
  }
}

const { initFunctions } = await import("../src/natives/functions.js");
const { setupCommands, sendCommand, signClientInput } = await import("../src/core/commands.js");
const { setupBattleTick } = await import("../src/core/tick.js");
const { setupAntiAfk } = await import("../src/features/antiafk.js");
const { setupAutoSpin, toggleAutoSpin } = await import("../src/features/autospin.js");
const { setupHideUltiAiming, toggleHideUltiAiming } = await import("../src/features/hideultiaiming.js");
const { flags, toggleFlag } = await import("../src/utils/flags.js");
const { sha256 } = await import("../src/utils/crypto.js");
const { paintGradient } = await import("../src/ui/gradient.js");
const { allocScString, withScString } = await import("../src/core/scstring.js");
await import("../src/ui/menu.js");
await import("../src/ui/lobbyinfo.js");
await import("../src/ui/menubutton.js");

initFunctions(new Ptr(BASE));
setupCommands(new Ptr(BASE));
setupBattleTick(new Ptr(BASE));
setupAntiAfk(new Ptr(BASE));
setupHideUltiAiming(new Ptr(BASE));
setupAutoSpin();

let clock = 1000000;
const realNow = Date.now;
Date.now = () => clock;

const LBMC = "LogicBattleModeClient_update";
let lbmc = Memory.alloc(0x100);
ownChar = Memory.alloc(0x100);
setOwn(1000, 2000);
makeBattle(true);

function tokenRef(cmd16, type) {
  const typeC = type <= constants.ClientInput_maxTableType ? 0x51500000 + type * 0x101 : constants.ClientInput_fallbackType;
  const msg = Buffer.alloc(20);
  Buffer.from(cmd16).copy(msg, 0, 4, 16);
  Buffer.from(cmd16).copy(msg, 12, 0, 4);
  msg.writeUInt32LE(typeC >>> 0, 16);
  const ipad = Buffer.alloc(64), opad = Buffer.alloc(64);
  for (let i = 0; i < 16; i++) { ipad[i] = (i + 1) ^ innerMask[i]; opad[i] = (i + 1) ^ outerMask[i]; }
  ipad.fill(0x36, 16);
  opad.fill(0x5c, 16);
  const inner = createHash("sha256").update(Buffer.concat([ipad, msg])).digest();
  const digest = createHash("sha256").update(Buffer.concat([opad, inner])).digest();
  const token = digest[0] | (digest[1] & 0x7f) << 8;
  return token < 2 ? 1 : token;
}
function inputInfo(entry) {
  const s = entry.snapshot;
  const dv = new DataView(s.buffer, s.byteOffset, s.byteLength);
  return {
    type: dv.getInt32(0x8, true),
    x: dv.getInt32(0xc, true),
    y: dv.getInt32(0x10, true),
    token: dv.getUint32(0x34, true),
    cmd: Buffer.from(s.slice(0x4, 0x14))
  };
}

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS " + name); }
  else { fail++; console.log("FAIL " + name); }
}

const vectors = [
  new Uint8Array(0),
  new TextEncoder().encode("abc"),
  new Uint8Array(55).fill(0x61),
  Uint8Array.from({ length: 84 }, (_, i) => (i * 3 + 7) & 255),
  Uint8Array.from({ length: 96 }, (_, i) => (i * 11 + 1) & 255)
];
check("sha256 matches node:crypto on 5 vectors (0/3/55/84/96 bytes)", vectors.every((v) => Buffer.from(sha256(v)).toString("hex") === createHash("sha256").update(v).digest("hex")));

const g = paintGradient("AB\nCD", 0.3, 0xffffff, 0, 2);
check("paintGradient emits balanced color tags per line", (g.match(/<c/g) || []).length === (g.match(/<\/c>/g) || []).length && g.includes("</c>"));
check("scstring helpers allocate and round-trip", allocScString("x").isNull() === false && withScString("y", () => 42) === 42);

check("single dispatcher hook on LBMC_update (de-dup)", (hooks.get(off(LBMC)) ?? []).length === 1);

flags.antiAfk = false;
flags.autoSpin = false;
toggleFlag("antiAfk");
clock = 100000;
fireHook(LBMC, [lbmc]);
check("antiafk rebaseline frame sends nothing", predictions.length === 0);
clock += 100;
fireHook(LBMC, [lbmc]);
check("antiafk instant send on next standing frame after enable", predictions.length === 1 && predictions[0].x === 1000 && predictions[0].y === 2000 && predictions[0].flag === 1);
check("sendMove emits one signed type-2 input with zero-delta coords", inputs.length === 1 && inputInfo(inputs[0]).type === 2 && inputInfo(inputs[0]).x === 1000 && inputInfo(inputs[0]).y === 2000);
const t0 = inputInfo(inputs[0]);
check("token == independent node:crypto reference (real commands.js, real masks)", t0.token === tokenRef(t0.cmd, t0.type) && t0.token > 0);

clock = 100500;
fireHook(LBMC, [lbmc]);
clock = 110099;
fireHook(LBMC, [lbmc]);
check("no resend before 10s cadence", predictions.length === 1);
clock = 110101;
fireHook(LBMC, [lbmc]);
check("resend after 10s idle", predictions.length === 2 && predictions[1].x === 1000);

setOwn(1200, 2000);
clock = 1010100;
fireHook(LBMC, [lbmc]);
clock = 1010300;
fireHook(LBMC, [lbmc]);
check("drift rebaselines, no send while moved", predictions.length === 2);

toggleFlag("antiAfk");
fireHook(LBMC, [lbmc]);
toggleFlag("antiAfk");
clock = 1010500;
fireHook(LBMC, [lbmc]);
clock = 1010600;
fireHook(LBMC, [lbmc]);
check("re-enable sends immediately again", predictions.length === 3);

toggleFlag("antiAfk");
fireHook(LBMC, [lbmc]);
toggleFlag("antiAfk");
setOwn(1200, 2000);
clock = 1010700;
fireHook(LBMC, [lbmc]);
check("enabled while moving: no early send", predictions.length === 3);
setOwn(1205, 2000);
clock = 1010800;
fireHook(LBMC, [lbmc]);
setOwn(1205, 2000);
clock = 1010900;
fireHook(LBMC, [lbmc]);
check("enabled while moving: send fires exactly at first standing frame", predictions.length === 4 && predictions[3].x === 1205);

const retval = { v: 1, replaced: null, replace(v) { this.replaced = v; } };
hooks.get(off("BattleScreen_isAFK"))[0].onLeave(retval);
check("isAFK bypassed while antiAfk on", retval.replaced === 0);
toggleFlag("antiAfk");
const retval2 = { v: 1, replaced: null, replace(v) { this.replaced = v; } };
hooks.get(off("BattleScreen_isAFK"))[0].onLeave(retval2);
check("isAFK untouched while antiAfk off", retval2.replaced === null);

setOwn(1000, 2000);
toggleAutoSpin();
check("toggleAutoSpin flips flag", flags.autoSpin === true);
const spinLbmc = Memory.alloc(0x100);
clock = 1020000;
fireHook(LBMC, [spinLbmc]);
const p1 = predictions[predictions.length - 1];
const q1 = Math.round(Math.cos(Math.PI / 4) * 100), q2 = Math.round(Math.sin(Math.PI / 2) * 100);
check("autospin first tick target x+71/y+71 (phase pi/4)", p1.x === 1000 + q1 && p1.y === 2000 + q1);
fireHook(LBMC, [spinLbmc]);
const p2 = predictions[predictions.length - 1];
check("autospin second tick target x+0/y+100 (phase pi/2)", p2.x === 1000 && p2.y === 2000 + q2);
for (let i = 0; i < 7; i++) fireHook(LBMC, [spinLbmc]);
const p9 = predictions[predictions.length - 1];
check("autospin phase wraps after 8 ticks (tick9 == tick1)", p9.x === p1.x && p9.y === p1.y);
const spinLbmc2 = Memory.alloc(0x100);
fireHook(LBMC, [spinLbmc2]);
const pR = predictions[predictions.length - 1];
check("battle change resets phase (fresh pi/4 target)", pR.x === 1000 + q1 && pR.y === 2000 + q1 && pR.logic === spinLbmc2.addr);
const before = predictions.length;
toggleAutoSpin();
fireHook(LBMC, [spinLbmc2]);
check("autospin disabled sends nothing", flags.autoSpin === false && predictions.length === before);

toggleFlag("antiAfk");
toggleAutoSpin();
setOwn(1000, 2000);
const bothLbmc = Memory.alloc(0x100);
const baseCount = predictions.length;
clock = 1030000;
fireHook(LBMC, [bothLbmc]);
fireHook(LBMC, [bothLbmc]);
check("combined ticks: autospin frame1, antiafk zero-delta + autospin frame2", predictions[baseCount].x === 1000 + q1 && predictions[baseCount].y === 2000 + q1 && predictions[baseCount + 1].x === 1000 && predictions[baseCount + 1].y === 2000 && predictions[baseCount + 2].y === 2000 + q2 && inputs.length === baseCount + 3);

toggleFlag("antiAfk");
toggleAutoSpin();

flags.antiAfk = false;
flags.autoSpin = false;

const input = Memory.alloc(0x48);
input.writeByteArray(new ArrayBuffer(0x48));
input.add(0x8).writeS32(2);
input.add(0xc).writeS32(100);
input.add(0x10).writeS32(200);
signClientInput(input, battleMode);
const cmdBuf = Buffer.from(HEAP.slice(input.addr + 4, input.addr + 0x14));
check("signClientInput writes reference token at +0x34", input.add(0x34).readU32() === tokenRef(cmdBuf, 2));

makeBattle(false);
const input2 = Memory.alloc(0x48);
input2.writeByteArray(new ArrayBuffer(0x48));
input2.add(0x8).writeS32(2);
signClientInput(input2, battleMode);
check("hashEnabled=0 leaves token zero", input2.add(0x34).readU32() === 0);

makeBattle(true);
const before99 = inputs.length;
sendCommand(0x99, () => {});
const e99 = inputInfo(inputs[inputs.length - 1]);
check("type > 0x16 uses fallback 0xdeadbeef constant", inputs.length === before99 + 1 && e99.type === 0x99 && e99.token === tokenRef(e99.cmd, 0x99));

const ctorBefore = (hooks.get(off("ClientInput_ctor")) ?? []).length;
toggleHideUltiAiming();
const ulist = hooks.get(off("ClientInput_ctor")) ?? [];
check("hideUltiAiming toggle attaches ctor listener", ulist.length === ctorBefore + 1);
const uargs = [new Ptr(0x12345), globalThis.ptr(5)];
ulist[ulist.length - 1].onEnter(uargs);
check("ctor arg 5 flipped to hidden type 6 in place", uargs[1].toInt32() === 6);
toggleHideUltiAiming();
check("hideUltiAiming untoggle detaches", (hooks.get(off("ClientInput_ctor")) ?? []).length === ctorBefore);

let lobbyFired = false;
try {
  const ctx = { args: [new Ptr(0x9999)] };
  for (const l of hooks.get(off("HomePage_ctor")) ?? []) {
    if (l.onEnter) l.onEnter.call(ctx, ctx.args);
    if (l.onLeave) l.onLeave.call(ctx, ctx);
  }
  lobbyFired = true;
} catch (_) {}
check("HomePage_ctor fire: lobbyinfo badge + menu button wiring runs clean", lobbyFired);

Date.now = realNow;
console.log(fail === 0 ? `ALL PASS (${pass}/${pass + fail})` : `FAILED ${fail}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
