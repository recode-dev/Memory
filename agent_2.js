// src/core/offsets.js
var offsets = {
  HomePage_ctor: 8845684,
  ResourceManager_getMovieClip: 11818224,
  MovieClip_getFieldByName: 12099700,
  TextField_setText: 12278848,
  Sprite_addChild: 12179072,
  String_ctor: 13891260,
  ScString_dtor: 13890976,
  DisplayObject_setXY: 12080296,
  ScString_data: 8,
  ScString_length: 4,
  DisplayObject_x: 32,
  DisplayObject_y: 36,
  LogicHttpRequest_encode: 12410684,
  LogicHttpRequest_bodyPtr: 192,
  LogicHttpRequest_bodySize: 200
};

// src/utils/license.js
var _init = false;
var License_path = "/res/license.bin";
var License_payload = JSON.stringify({ features: [], connection: "Keep-Alive" });
function setupLicense(base2) {
  if (_init) return;
  _init = true;
  const dir = Process.mainModule.path.slice(0, Process.mainModule.path.lastIndexOf("/"));
  const license = File.readAllBytes(dir + License_path);
  const total = license.byteLength + License_payload.length + 1;
  const malloc = new NativeFunction(Module.findExportByName(null, "malloc"), "pointer", ["ulong"]);
  Interceptor.attach(base2.add(offsets.LogicHttpRequest_encode), {
    onEnter(args) {
      const buf = malloc(total);
      Memory.copy(buf, license.unwrap(), license.byteLength);
      buf.add(license.byteLength).writeUtf8String(License_payload);
      args[0].add(offsets.LogicHttpRequest_bodyPtr).writePointer(buf);
      args[0].add(offsets.LogicHttpRequest_bodySize).writeS32(total);
    }
  });
}

// src/core/functions.js
var _init2 = false;
var homePageCtor = null;
var getMovieClip = null;
var getFieldByName = null;
var setText = null;
var addChild = null;
var stringCtor = null;
var scStringDtor = null;
var setXY = null;
function initFunctions(base2) {
  if (_init2) return;
  _init2 = true;
  homePageCtor = new NativeFunction(base2.add(offsets.HomePage_ctor), "pointer", ["pointer"]);
  getMovieClip = new NativeFunction(base2.add(offsets.ResourceManager_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
  getFieldByName = new NativeFunction(base2.add(offsets.MovieClip_getFieldByName), "pointer", ["pointer", "pointer"]);
  setText = new NativeFunction(base2.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
  addChild = new NativeFunction(base2.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
  stringCtor = new NativeFunction(base2.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
  scStringDtor = new NativeFunction(base2.add(offsets.ScString_dtor), "void", ["pointer"]);
  setXY = new NativeFunction(base2.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
}

// src/core/constants.js
var constants = {
  ScString_inline_max: 7,
  ScString_width: 32,
  ScString_max_length: 256
};

// src/core/scstring.js
function makeScString(text) {
  const sc = Memory.alloc(constants.ScString_width);
  stringCtor(sc, Memory.allocUtf8String(text));
  return sc;
}
function destroyScString(sc) {
  scStringDtor(sc);
}
function withScString(text, fn) {
  const sc = makeScString(text);
  const result = fn(sc);
  destroyScString(sc);
  return result;
}

// src/ui/lobbyinfo.js
var _init3 = false;
function setupLobbyInfo(base2) {
  if (_init3) return;
  _init3 = true;
  initFunctions(base2);
  const uiSc = Memory.allocUtf8String("sc/ui.sc");
  const popover = Memory.allocUtf8String("popover_text_left");
  const textName = Memory.allocUtf8String("text");
  Interceptor.attach(base2.add(offsets.HomePage_ctor), {
    onEnter(args) {
      this.page = args[0];
    },
    onLeave() {
      const clip = getMovieClip(uiSc, popover, 1);
      const tf = getFieldByName(clip, textName);
      withScString("<c00FF66>Recoil+</c> v1.0\n<cFFFFFF>Telegram: @recoil_dev</c>", (str) => {
        setText(tf, str);
      });
      setXY(tf, 120, 90);
      addChild(this.page, tf);
    }
  });
}

// src/index.js
var base = Process.getModuleByName("Nulls Brawl").base;
setupLicense(base);
setupLobbyInfo(base);
