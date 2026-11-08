function home() {
  try {
    const fn = Module.findGlobalExportByName("NSHomeDirectory");
    const ms = Module.findGlobalExportByName("objc_msgSend");
    const sr = Module.findGlobalExportByName("sel_registerName");
    if (!fn || !ms || !sr) return null;
    const p = new NativeFunction(fn, "pointer", [])();
    if (!p || p.isNull()) return null;
    const msgSend = new NativeFunction(ms, "pointer", ["pointer", "pointer"]);
    const sel = new NativeFunction(sr, "pointer", ["pointer"]);
    const u = msgSend(p, sel(Memory.allocUtf8String("UTF8String")));
    if (!u || u.isNull()) return null;
    return u.readUtf8String();
  } catch (e) {
    return null;
  }
}
var h = home();
var stamp = Date.now();
var candidates = [];
if (h) candidates.push(h + "/Documents");
candidates.push("/var/mobile/Documents");
candidates.push("/tmp");
candidates.push("/var/tmp");
var LOG_PATH = null;
var lastError = null;
for (const dir of candidates) {
  const p = dir + "/menu_" + stamp + ".log";
  try {
    const f = new File(p, "w");
    f.write("time=" + (/* @__PURE__ */ new Date()).toISOString() + "\n");
    f.write("home=" + h + "\n");
    f.write("dir=" + dir + "\n");
    f.flush();
    f.close();
    LOG_PATH = p;
    break;
  } catch (e) {
    lastError = dir + ": " + e.message;
  }
}
export function logInit() {
  return "path=" + LOG_PATH + " home=" + h + " lastError=" + lastError;
}
export function log(msg) {
  if (LOG_PATH === null) return;
  const line = "[" + (/* @__PURE__ */ new Date()).toISOString() + "] " + msg + "\n";
  try {
    const f = new File(LOG_PATH, "a");
    f.write(line);
    f.flush();
    f.close();
  } catch (_) {
  }
}
