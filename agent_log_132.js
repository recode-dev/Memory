(() => {
  // src/natives/offsets.js
  var offsets = {
    HomePage_ctor: 8845684,
    StringTable_getMovieClip: 9303260,
    MovieClip_getTextFieldByName: 12099700,
    TextField_setText: 12278848,
    TextField_setFontSize: 12278764,
    TextField_setTextColor: 12279028,
    DisplayObject_setXY: 12080296,
    DisplayObject_setVisibility: 12080352,
    Sprite_ctor: 12178448,
    Sprite_addChild: 12179072,
    SettingsPopup_ctor: 4787612,
    GenericPopup_ctor: 6693852,
    GenericPopup_setTitle: 6694988,
    GenericPopup_addChildButton: 6696240,
    GenericPopup_hideDefaults: 6697204,
    GUI_getInstance: 5500212,
    GUI_showPopup: 5504500,
    CustomButton_ctor: 12288400,
    CustomButton_setMovieClip: 12289560,
    CustomButton_buttonPressed: 12288728,
    Stage_instance: 17980968,
    Stage_addChild: 12201300,
    DisplayObject_getBounds: 12207596,
    DisplayObject_getBox: 12080396,
    DisplayObject_setSize: 12081008,
    DisplayObject_setScale: 12080324,
    DisplayObject_setHeight: 12080336,
    DisplayObject_setWidth: 12080344,
    MovieClip_setText: 12100212,
    BlingTextField_create: 5629028,
    LogicDataTables_getData: 10132920,
    MovieClip_gotoAndStopFrameIndex: 12096116,
    MovieClip_setChildVisible: 12101080,
    MovieClip_getByName: 12099100,
    String_ctor: 13891260,
    String_dtor: 13890976,
    LogicHttpRequest_encode: 12410684,
    BattleScreen_isAFK: 8059712,
    Character_updateHealthBar: 4905908
  };

  // src/natives/functions.js
  function resolveExport(name) {
    if (typeof Module.getGlobalExportByName === "function") {
      return Module.getGlobalExportByName(name);
    }
    return Module.getExportByName(null, name);
  }
  var getMovieClip = null;
  var getTextFieldByName = null;
  var setText = null;
  var setFontSize = null;
  var setTextColor = null;
  var setXY = null;
  var setVisibility = null;
  var addChild = null;
  var spriteCtor = null;
  var updateHealthBar = null;
  var popupCtor = null;
  var popupSetTitle = null;
  var popupAddChildButton = null;
  var popupHideDefaults = null;
  var gotoAndStopFrameIndex = null;
  var setChildVisible = null;
  var movieClipByName = null;
  var guiGetInstance = null;
  var guiShowPopup = null;
  var customButtonCtor = null;
  var customButtonSetMovieClip = null;
  var stageAddChild = null;
  var setScale = null;
  var setSize = null;
  var getBounds = null;
  var getBox = null;
  var setHeight = null;
  var setWidth = null;
  var movieClipSetText = null;
  var createBlingTextField = null;
  var getDataById = null;
  var stringCtor = null;
  var stringDtor = null;
  var malloc = null;
  var stageBase = null;
  function stageInstance() {
    return stageBase.add(offsets.Stage_instance).readPointer();
  }
  function initFunctions(base) {
    getMovieClip = new NativeFunction(base.add(offsets.StringTable_getMovieClip), "pointer", ["pointer", "pointer", "ulong"]);
    getTextFieldByName = new NativeFunction(base.add(offsets.MovieClip_getTextFieldByName), "pointer", ["pointer", "pointer"]);
    setText = new NativeFunction(base.add(offsets.TextField_setText), "void", ["pointer", "pointer"]);
    setFontSize = new NativeFunction(base.add(offsets.TextField_setFontSize), "void", ["pointer", "uint16"]);
    setTextColor = new NativeFunction(base.add(offsets.TextField_setTextColor), "void", ["pointer", "uint"]);
    setXY = new NativeFunction(base.add(offsets.DisplayObject_setXY), "void", ["pointer", "float", "float"]);
    setVisibility = new NativeFunction(base.add(offsets.DisplayObject_setVisibility), "void", ["pointer", "int"]);
    addChild = new NativeFunction(base.add(offsets.Sprite_addChild), "pointer", ["pointer", "pointer"]);
    spriteCtor = new NativeFunction(base.add(offsets.Sprite_ctor), "pointer", ["pointer", "int"]);
    updateHealthBar = new NativeFunction(base.add(offsets.Character_updateHealthBar), "void", ["pointer", "float"]);
    popupCtor = new NativeFunction(base.add(offsets.GenericPopup_ctor), "pointer", ["pointer", "pointer", "int", "int", "pointer", "pointer", "pointer", "pointer", "pointer"]);
    popupSetTitle = new NativeFunction(base.add(offsets.GenericPopup_setTitle), "void", ["pointer", "pointer"]);
    popupAddChildButton = new NativeFunction(base.add(offsets.GenericPopup_addChildButton), "pointer", ["pointer", "pointer", "pointer"]);
    popupHideDefaults = new NativeFunction(base.add(offsets.GenericPopup_hideDefaults), "void", ["pointer"]);
    gotoAndStopFrameIndex = new NativeFunction(base.add(offsets.MovieClip_gotoAndStopFrameIndex), "void", ["pointer", "int"]);
    setChildVisible = new NativeFunction(base.add(offsets.MovieClip_setChildVisible), "void", ["pointer", "pointer", "int"]);
    movieClipByName = new NativeFunction(base.add(offsets.MovieClip_getByName), "pointer", ["pointer", "pointer", "int"]);
    guiGetInstance = new NativeFunction(base.add(offsets.GUI_getInstance), "pointer", []);
    guiShowPopup = new NativeFunction(base.add(offsets.GUI_showPopup), "pointer", ["float", "float", "pointer", "pointer", "int", "ulong", "int"]);
    customButtonCtor = new NativeFunction(base.add(offsets.CustomButton_ctor), "void", ["pointer"]);
    stageBase = base;
    customButtonSetMovieClip = new NativeFunction(base.add(offsets.CustomButton_setMovieClip), "void", ["pointer", "pointer", "int"]);
    stageAddChild = new NativeFunction(base.add(offsets.Stage_addChild), "void", ["pointer", "pointer"]);
    setScale = new NativeFunction(base.add(offsets.DisplayObject_setScale), "void", ["pointer", "float"]);
    setSize = new NativeFunction(base.add(offsets.DisplayObject_setSize), "void", ["pointer", "float", "float"]);
    getBounds = new NativeFunction(base.add(offsets.DisplayObject_getBounds), "void", ["pointer", "pointer", "pointer", "pointer", "uchar", "int"]);
    getBox = new NativeFunction(base.add(offsets.DisplayObject_getBox), "void", ["pointer", "pointer", "pointer", "int"]);
    setHeight = new NativeFunction(base.add(offsets.DisplayObject_setHeight), "void", ["pointer", "float"]);
    setWidth = new NativeFunction(base.add(offsets.DisplayObject_setWidth), "void", ["pointer", "float"]);
    movieClipSetText = new NativeFunction(base.add(offsets.MovieClip_setText), "void", ["pointer", "pointer", "pointer"]);
    createBlingTextField = new NativeFunction(base.add(offsets.BlingTextField_create), "pointer", ["pointer", "pointer", "pointer"]);
    getDataById = new NativeFunction(base.add(offsets.LogicDataTables_getData), "pointer", ["long", "int"]);
    stringCtor = new NativeFunction(base.add(offsets.String_ctor), "pointer", ["pointer", "pointer"]);
    stringDtor = new NativeFunction(base.add(offsets.String_dtor), "void", ["pointer"]);
    malloc = new NativeFunction(resolveExport("malloc"), "pointer", ["int"]);
  }

  // src/natives/structs.js
  var structs = {
    TextField_text: 224,
    TextField_fontOutline: 144,
    ScString_length: 4,
    DisplayObject_visible: 8,
    Popup_clip: 144,
    Popup_extraClip: 416,
    Clip_childTable: 144,
    Clip_nameTable: 152,
    Clip_childCount: 192,
    ScString_data: 8,
    DisplayObject_scaleX: 16,
    DisplayObject_scaleY: 28,
    DisplayObject_x: 32,
    DisplayObject_touchable: 76,
    DisplayObject_parent: 56,
    DisplayObject_y: 36,
    Character_ammoClip: 2848,
    LogicHttpRequest_bodyPtr: 192,
    LogicHttpRequest_bodySize: 200
  };

  // src/natives/constants.js
  var constants = {
    ScString_width: 32,
    Color_channels: [16, 8, 0],
    Color_mask: 255,
    Color_hexDigits: 6,
    LogicDataTables_globalIdStep: 1e6,
    Badge_sc: "sc/ui.sc",
    Badge_clip: "popover_text_left",
    Badge_field: "text",
    Badge_text: "Memory v69.252\nTelegram: @memoryutils",
    Badge_x: 120,
    Badge_y: 90,
    Badge_fontSize: 14,
    Badge_fontOutline: 1,
    Badge_color: 4294967295,
    Badge_bandChars: 2,
    Badge_lightColor: 7268231,
    Badge_darkColor: 1736503,
    Badge_gradientTable: 46,
    Badge_gradientId: 1,
    Badge_shineMs: 60,
    Badge_shinePeriod: 2e3,
    Badge_shineLineStep: 0.5,
    Plate_sc: "sc/ui.sc",
    Plate_spawnClip: "popover_text_left",
    Plate_fieldName: "text",
    Plate_gradientTable: 46,
    Plate_gradientId: 1,
    Plate_fontOutline: 1,
    Plate_color: 4294967295,
    Plate_shineMs: 60,
    Plate_shinePeriod: 2e3,
    Plate_bandChars: 2,
    Plate_titleSize: 26,
    Plate_titleLight: 16770688,
    Plate_titleDark: 11565568,
    Plate_footerSize: 15,
    Plate_titleX: 150,
    Plate_footerLight: 10475775,
    Plate_footerDark: 1798064,
    Menu_popupSize: 440,
    Menu_popupFlags: 1,
    Menu_popupX: 0,
    Menu_popupY: 0,
    Menu_popupSc: "sc/buddy.sc",
    Menu_popupFallback: "popup_terms_info",
    Menu_popupType: "purchase_confirmation_popup",
    Menu_popupScale: 1,
    Menu_title: "MemoryUtils",
    Menu_titleField: "title_txt",
    Menu_captionField: "txt",
    Menu_closeField: "button_close",
    Menu_chromeNames: [],
    Menu_sc: "sc/ui.sc",
    Menu_buttonClip: "country_item",
    Menu_buttonSize: 544,
    Menu_buttonScale: -0.17,
    Menu_labelField: "Text",
    Menu_frameOn: 0,
    Menu_frameOff: 1,
    Menu_lightColor: 16765286,
    Menu_darkColor: 12092939,
    Menu_bandChars: 2,
    Menu_slots: 12,
    Menu_gridX: [-220, -75, 70, 215],
    Menu_gridY: [-95, -30, 35],
    Menu_placeholder: "Soon",
    Menu_pagePrefix: "Page ",
    Menu_setLabel: "SET",
    Menu_infoLabel: "!",
    Label_sc: "sc/ui.sc",
    Label_spawnClip: "popover_text_left",
    Label_fieldName: "text",
    Label_gradientTable: 46,
    Label_gradientId: 1,
    Label_chipSize: 18,
    Label_chipY: -222,
    Label_setX: 196,
    Label_infoX: 240,
    Label_footerSize: 16,
    Label_footerX: -68,
    Menu_navY: 105,
    Menu_prevX: -220,
    Menu_nextX: 220,
    Menu_prevLabel: "Previous Page",
    Menu_nextLabel: "Next Page",
    Menu_footerText: "t.me/memoryutils",
    Menu_footerY: 100,
    Menu_footerColor: 4294967295,
    Panel_clip: "popup_generic",
    Panel_taleClip: "gameroom_joincode_popup",
    Panel_sizeHeight: 589.633,
    Panel_sizeWidth: 334.775,
    Panel_titleField: "title_txt",
    Panel_footerSlot: "button_ok",
    Panel_hidden: ["txt", "button_no", "button_yes", "button_negative"],
    Panel_gearClip: "popup_profile",
    Panel_gearPath: ["header"],
    Panel_gearChild: "previous_stats_button",
    Panel_badgeClip: "popup_player_profile",
    Panel_badgePath: ["profile_stats", "name_button"],
    Panel_badgeChild: "edit_pic_icon",
    Panel_badgeX: 0,
    Panel_badgeY: 0,
    Panel_badgeScale: 0.2,
    Panel_gearGap: 104,
    Panel_gearScale: 0.85,
    Panel_closeScale: 1,
    Panel_infoScale: 0.95,
    Panel_titleShift: 7.7,
    Panel_footerX: 12.8,
    Panel_footerY: 17.7,
    Panel_footerScale: 0.5,
    Panel_infoClip: "friends_info",
    Panel_infoChild: "button_info",
    Panel_infoGap: 62,
    Panel_anchorX: 90,
    Panel_anchorY: -60,
    Panel_gridColumns: 4,
    Panel_gridRows: 3,
    Panel_gridWidthRatio: 0.9,
    Panel_gridTop: -10,
    Panel_gridScale: 0.4,
    Panel_contentWidth: 311.885,
    Panel_contentHeight: 539.798,
    Menu_modButtonClip: "map_editor_exit_button",
    Menu_modButtonLabel: "Menu",
    Menu_modButtonField: "txt",
    Menu_modButtonX: 40,
    Menu_modButtonY: 540,
    License_path: "/res/license.bin",
    License_payload: JSON.stringify({ features: [], connection: "Keep-Alive" })
  };

  // src/utils/license.js
  var _init = false;
  function setupLicense(module2) {
    if (_init) return;
    _init = true;
    const licensePath = module2.path.slice(0, module2.path.lastIndexOf("/")) + constants.License_path;
    Interceptor.attach(module2.base.add(offsets.LogicHttpRequest_encode), {
      onEnter(args) {
        const fileBytes = File.readAllBytes(licensePath);
        const totalSize = fileBytes.byteLength + constants.License_payload.length + 1;
        const buf = malloc(totalSize);
        Memory.copy(buf, fileBytes.unwrap(), fileBytes.byteLength);
        buf.add(fileBytes.byteLength).writeUtf8String(constants.License_payload);
        args[0].add(structs.LogicHttpRequest_bodyPtr).writePointer(buf);
        args[0].add(structs.LogicHttpRequest_bodySize).writeS32(totalSize);
      }
    });
  }

  // src/natives/datatables.js
  function resolveGradient(classId, itemId) {
    return getDataById(classId * constants.LogicDataTables_globalIdStep + itemId, classId);
  }

  // src/core/scstring.js
  function allocScString(text) {
    const sc = malloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    return sc;
  }
  function destroyScString(sc) {
    stringDtor(sc);
  }
  function withScString(text, fn) {
    const sc = Memory.alloc(constants.ScString_width);
    stringCtor(sc, Memory.allocUtf8String(text));
    const result = fn(sc);
    stringDtor(sc);
    return result;
  }

  // src/ui/gradient.js
  function mix(from, to, t) {
    let color = 0;
    for (const shift of constants.Color_channels) {
      const a = from >> shift & constants.Color_mask;
      const b = to >> shift & constants.Color_mask;
      color |= Math.round(a + (b - a) * t) << shift;
    }
    return color;
  }
  function colorAt(position, light, dark) {
    return mix(light, dark, 1 - Math.abs(position * 2 - 1));
  }
  function paintLine(line, phase, painted, light, dark, bandChars) {
    const span = line.length;
    let index = 0;
    while (index < span) {
      const raw = index / span - phase;
      const position = (raw % 1 + 1) % 1;
      painted += `<c${colorAt(position, light, dark).toString(16).padStart(constants.Color_hexDigits, "0")}>`;
      for (let step = 0; step < bandChars && index < span; step++, index++) {
        painted += line[index];
      }
      painted += "</c>";
    }
    return painted;
  }
  function paintGradient(text, phase, light, dark, bandChars) {
    const lines = text.split("\n");
    let painted = "";
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      if (lineIndex > 0) {
        painted += "\n";
      }
      painted = paintLine(lines[lineIndex], phase - lineIndex * constants.Badge_shineLineStep, painted, light, dark, bandChars);
    }
    return painted;
  }

  // src/ui/lobbyinfo.js
  var _init2 = false;
  var field = null;
  function repaint() {
    if (field === null) return;
    const phase = Date.now() % constants.Badge_shinePeriod / constants.Badge_shinePeriod;
    withScString(paintGradient(constants.Badge_text, phase, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => setText(field, sc));
  }
  var uiSc = Memory.allocUtf8String(constants.Badge_sc);
  var popover = Memory.allocUtf8String(constants.Badge_clip);
  function setupLobbyInfo(base) {
    if (_init2) return;
    _init2 = true;
    const textName = allocScString(constants.Badge_field);
    Interceptor.attach(base.add(offsets.HomePage_ctor), {
      onEnter(args) {
        this.page = args[0];
      },
      onLeave() {
        const clip2 = getMovieClip(uiSc, popover, 0);
        field = createBlingTextField(clip2, textName, resolveGradient(constants.Badge_gradientTable, constants.Badge_gradientId));
        setXY(field, constants.Badge_x, constants.Badge_y);
        setFontSize(field, constants.Badge_fontSize);
        field.add(structs.TextField_fontOutline).writeU8(constants.Badge_fontOutline);
        setTextColor(field, constants.Badge_color);
        withScString(paintGradient(constants.Badge_text, 0, constants.Badge_lightColor, constants.Badge_darkColor, constants.Badge_bandChars), (sc) => setText(field, sc));
        addChild(this.page, field);
        setVisibility(field, 1);
      }
    });
    setInterval(repaint, constants.Badge_shineMs);
  }

  // src/natives/callbacks.js
  var enemyAmmo = true;
  var antiAfk = true;
  var buttons = /* @__PURE__ */ new Map();
  function showAmmo(character) {
    const clip2 = character.add(structs.Character_ammoClip).readPointer();
    if (clip2.isNull()) return;
    clip2.add(structs.DisplayObject_visible).writeU8(1);
  }
  function toggleEnemyAmmo() {
    enemyAmmo = !enemyAmmo;
  }
  function toggleAntiAfk() {
    antiAfk = !antiAfk;
  }
  function isEnemyAmmoEnabled() {
    return enemyAmmo;
  }
  function isAntiAfkEnabled() {
    return antiAfk;
  }
  function registerButton(button2, action) {
    buttons.set(button2.toString(), action);
  }
  function buttonAction(button2) {
    const action = buttons.get(button2.toString());
    return action === void 0 ? null : action;
  }
  var updateHealthBarCallback = new NativeCallback(function(character, deltaTime) {
    updateHealthBar(character, deltaTime);
    if (enemyAmmo) showAmmo(character);
  }, "void", ["pointer", "float"]);

  // src/features/antiafk.js
  var _init3 = false;
  function setupAntiAfk(base) {
    if (_init3) return;
    _init3 = true;
    Interceptor.attach(base.add(offsets.BattleScreen_isAFK), {
      onLeave(retval) {
        if (isAntiAfkEnabled()) retval.replace(0);
      }
    });
  }

  // src/core/log.js
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
  function logInit() {
    return "path=" + LOG_PATH + " home=" + h + " lastError=" + lastError;
  }
  function log(msg) {
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

  // src/ui/menubutton.js
  var labelField = Memory.allocUtf8String(constants.Menu_modButtonField);
  var button = null;
  function makeMenuButton(action) {
    if (button !== null) return button;
    const sc = Memory.allocUtf8String(constants.Menu_sc);
    const clipName2 = Memory.allocUtf8String(constants.Menu_modButtonClip);
    const clip2 = getMovieClip(sc, clipName2, 0);
    const stage = stageInstance();
    log("menu: stage=" + stage + " clip=" + clip2);
    button = malloc(constants.Menu_buttonSize);
    customButtonCtor(button);
    customButtonSetMovieClip(button, clip2, 1);
    setXY(button, constants.Menu_modButtonX, constants.Menu_modButtonY);
    const label = allocScString(constants.Menu_modButtonLabel);
    movieClipSetText(clip2, labelField, label);
    destroyScString(label);
    button.add(structs.DisplayObject_touchable).writeU8(1);
    setVisibility(button, 1);
    stageAddChild(stage, button);
    registerButton(button, action);
    log("menu: button=" + button + " parent=" + button.add(56).readPointer() + " touch=" + button.add(76).readU8());
    return button;
  }

  // src/ui/pages.js
  var placeholder = { label: constants.Menu_placeholder, action: null, state: null };
  function buildPage(items) {
    const page = [];
    for (let index = 0; index < constants.Menu_slots; index++) {
      page.push(index < items.length ? items[index] : placeholder);
    }
    return page;
  }
  var features = [
    { label: "ENEMY AMMO", action: toggleEnemyAmmo, state: isEnemyAmmoEnabled },
    { label: "ANTI AFK", action: toggleAntiAfk, state: isAntiAfkEnabled }
  ];
  var pages = [buildPage(features), buildPage([]), buildPage([]), buildPage([])];

  // src/ui/plate.js
  var plates = [];
  var uiSc2 = null;
  var spawnName = null;
  var fieldName = null;
  var gradient = null;
  var ticking = false;
  function init() {
    if (uiSc2 !== null) return;
    uiSc2 = Memory.allocUtf8String(constants.Plate_sc);
    spawnName = Memory.allocUtf8String(constants.Plate_spawnClip);
    fieldName = allocScString(constants.Plate_fieldName);
    gradient = resolveGradient(constants.Plate_gradientTable, constants.Plate_gradientId);
  }
  function paint(plate) {
    const phase = (Date.now() - plate.start) % constants.Plate_shinePeriod / constants.Plate_shinePeriod;
    withScString(paintGradient(plate.text, phase, plate.light, plate.dark, constants.Plate_bandChars), (sc) => setText(plate.field, sc));
  }
  function tick() {
    for (const plate of plates) paint(plate);
  }
  function makePlate(parent, x, y, size, text, light, dark) {
    init();
    const spawn = getMovieClip(uiSc2, spawnName, 0);
    const field2 = createBlingTextField(spawn, fieldName, gradient);
    setXY(field2, x, y);
    setFontSize(field2, size);
    field2.add(structs.TextField_fontOutline).writeU8(constants.Plate_fontOutline);
    setTextColor(field2, constants.Plate_color);
    addChild(parent, field2);
    setVisibility(field2, 1);
    const plate = { field: field2, text, light, dark, start: Date.now() };
    plates.push(plate);
    paint(plate);
    if (!ticking) {
      ticking = true;
      setInterval(tick, constants.Plate_shineMs);
    }
    return field2;
  }

  // src/ui/panel.js
  var slot = Memory.alloc(Process.pointerSize);
  var scPath = Memory.allocUtf8String(constants.Menu_sc);
  var empty = null;
  var clipName = null;
  var ready = false;
  var popup = null;
  var clip = null;
  var open = false;
  var labelName = Memory.allocUtf8String(constants.Menu_labelField);
  var titleSlot = Memory.allocUtf8String(constants.Panel_titleField);
  var shining = false;
  function shine() {
    if (clip === null) return;
    const phase = Date.now() % constants.Plate_shinePeriod / constants.Plate_shinePeriod;
    withScString(paintGradient(constants.Menu_title, phase, constants.Plate_titleLight, constants.Plate_titleDark, constants.Plate_bandChars), (sc) => movieClipSetText(clip, titleSlot, sc));
  }
  var measured = false;
  function init2() {
    if (ready) return;
    ready = true;
    empty = allocScString("");
    clipName = allocScString(constants.Panel_clip);
  }
  function child(node, name) {
    const count = node.add(structs.Clip_childCount).readS16();
    const names = node.add(structs.Clip_nameTable).readPointer();
    const kids = node.add(structs.Clip_childTable).readPointer();
    for (let index = 0; index < count; index++) {
      const entry = names.add(index * 8).readPointer();
      if (!entry.isNull() && entry.readUtf8String() === name) return kids.add(index * 8).readPointer();
    }
    return null;
  }
  function iconArt(clipName2, path, childName) {
    let node = getMovieClip(scPath, Memory.allocUtf8String(clipName2), 0);
    for (const step of path === null ? [] : path) {
      node = child(node, step);
      if (node === null) break;
    }
    const art = node === null ? null : childName === null ? node : child(node, childName);
    if (art === null) log("panel: icon missing " + clipName2 + "/" + (path === null ? "" : path.join("/") + "/") + childName);
    return art;
  }
  function attach(node, art, x, y, scale, action) {
    const button2 = malloc(constants.Menu_buttonSize);
    customButtonCtor(button2);
    customButtonSetMovieClip(button2, art, 1);
    setScale(button2, scale);
    setScale(art, 1);
    setXY(button2, x, y);
    addChild(node, button2);
    registerButton(button2, action);
    return button2;
  }
  function round(value) {
    return Math.round(value * 1e3) / 1e3;
  }
  function measure(target, name) {
    const height = target.add(16).readFloat();
    const width = target.add(28).readFloat();
    setSize(target, 1e3, 1e3);
    const boxHeight = 1e3 / target.add(16).readFloat();
    const boxWidth = 1e3 / target.add(28).readFloat();
    setSize(target, boxHeight * boxHeight / 1e3, boxWidth * boxWidth / 1e3);
    log("panel: " + name + " size=" + round(boxHeight) + "x" + round(boxWidth) + " scale=" + round(height) + "," + round(width));
  }
  function measureTale() {
    const other = malloc(constants.Menu_popupSize);
    popupCtor(other, allocScString(constants.Panel_taleClip), 0, 0, empty, empty, empty, empty, empty);
    measure(other.add(structs.Popup_clip).readPointer(), constants.Panel_taleClip);
  }
  function chip(node, x, y, scale, text, light, dark, action) {
    const art = getMovieClip(scPath, Memory.allocUtf8String(constants.Menu_buttonClip), 0);
    const button2 = malloc(constants.Menu_buttonSize);
    customButtonCtor(button2);
    customButtonSetMovieClip(button2, art, 1);
    setScale(button2, scale);
    setXY(button2, x, y);
    addChild(node, button2);
    const label = allocScString(paintGradient(text, 0, light, dark, constants.Menu_bandChars));
    movieClipSetText(art, Memory.allocUtf8String(constants.Menu_labelField), label);
    destroyScString(label);
    registerButton(button2, action);
    return button2;
  }
  function grid(node, right, bottom) {
    const stepX = right * 2 * constants.Panel_gridWidthRatio / constants.Panel_gridColumns;
    const stepY = (bottom - constants.Panel_gridTop) / constants.Panel_gridRows;
    const originX = -right + stepX / 2;
    const originY = constants.Panel_gridTop + stepY / 2;
    const page = pages[0];
    for (let index = 0; index < constants.Panel_gridColumns * constants.Panel_gridRows; index++) {
      const column = index % constants.Panel_gridColumns;
      const row = (index - column) / constants.Panel_gridColumns;
      const entry = page[index];
      chip(node, originX + column * stepX, originY + row * stepY, constants.Panel_gridScale, entry.label, constants.Menu_lightColor, constants.Menu_darkColor, entry.action);
    }
  }
  function setOpen(value) {
    open = value;
    setVisibility(clip, value ? 1 : 0);
  }
  function build() {
    popup = malloc(constants.Menu_popupSize);
    popupCtor(popup, clipName, 0, 0, empty, empty, empty, empty, empty);
    clip = popup.add(structs.Popup_clip).readPointer();
    if (!measured) {
      measured = true;
      measure(clip, constants.Panel_clip);
      measureTale();
    }
    setSize(clip, constants.Panel_sizeHeight, constants.Panel_sizeWidth);
    for (const name of constants.Panel_hidden) {
      setChildVisible(clip, Memory.allocUtf8String(name), 0);
    }
    slot.writePointer(popup);
    guiShowPopup(constants.Menu_popupX, constants.Menu_popupY, guiGetInstance(), slot, 1, constants.Menu_popupFlags, 0);
    const close = child(clip, constants.Menu_closeField);
    const closeX = close === null ? constants.Panel_anchorX : close.add(structs.DisplayObject_x).readFloat();
    const closeY = close === null ? constants.Panel_anchorY : close.add(structs.DisplayObject_y).readFloat();
    const ok = child(clip, constants.Panel_footerSlot);
    const footerX = ok === null ? 0 : ok.add(structs.DisplayObject_x).readFloat();
    const footerY = ok === null ? 0 : ok.add(structs.DisplayObject_y).readFloat();
    makePlate(clip, footerX, footerY, constants.Plate_footerSize, constants.Menu_footerText, constants.Plate_footerLight, constants.Plate_footerDark);
    shine();
    if (!shining) {
      shining = true;
      setInterval(shine, constants.Plate_shineMs);
    }
    if (close !== null) {
      setXY(close, 0, 0);
      attach(clip, close, closeX, closeY, constants.Panel_closeScale, function() {
        setOpen(false);
      });
    }
    const info = iconArt(constants.Panel_infoClip, null, constants.Panel_infoChild);
    if (info !== null) {
      setXY(info, 0, 0);
      attach(clip, info, closeX - constants.Panel_infoGap, closeY, constants.Panel_infoScale, function() {
      });
    }
    const gearArt = iconArt(constants.Panel_gearClip, constants.Panel_gearPath, constants.Panel_gearChild);
    if (gearArt !== null) {
      setXY(gearArt, 0, 0);
      const cover = iconArt(constants.Panel_badgeClip, constants.Panel_badgePath, constants.Panel_badgeChild);
      if (cover !== null) {
        const holder = malloc(constants.Menu_buttonSize);
        spriteCtor(holder, 1);
        setXY(cover, 0, 0);
        addChild(holder, cover);
        setScale(holder, holder.add(structs.DisplayObject_scaleX).readFloat() + constants.Panel_badgeScale);
        setXY(holder, constants.Panel_badgeX, constants.Panel_badgeY);
        addChild(gearArt, holder);
      }
      attach(clip, gearArt, closeX - constants.Panel_gearGap, closeY, constants.Panel_gearScale, function() {
      });
    }
    grid(clip, closeX, footerY);
    log("panel: built close=" + closeX + "," + closeY + " footer=" + footerY + " title=" + constants.Menu_title);
  }
  function togglePanel() {
    if (open) return;
    init2();
    if (popup === null) {
      build();
    } else {
      setOpen(true);
    }
    open = true;
  }

  // src/ui/menu.js
  var _init4 = false;
  function setupMenu(base) {
    if (_init4) return;
    _init4 = true;
    Interceptor.attach(base.add(offsets.CustomButton_buttonPressed), {
      onEnter(args) {
        const action = buttonAction(args[0]);
        log("menu: press " + args[0] + (action === null ? " (foreign)" : " (own)"));
        if (action !== null) action();
      }
    });
    Interceptor.attach(base.add(offsets.HomePage_ctor), {
      onLeave() {
        makeMenuButton(togglePanel);
      }
    });
  }

  // src/features/ammo.js
  var _init5 = false;
  function setupAmmo(base) {
    if (_init5) return;
    _init5 = true;
    Interceptor.replace(base.add(offsets.Character_updateHealthBar), updateHealthBarCallback);
  }

  // src/index.js
  log("boot: script evaluated " + logInit());
  var module = Process.getModuleByName("Nulls Brawl");
  log("boot: module " + module.base);
  initFunctions(module.base);
  log("boot: natives ok");
  setupLicense(module);
  log("boot: license hook ok");
  setupLobbyInfo(module.base);
  log("boot: lobby hook ok");
  setupAntiAfk(module.base);
  log("boot: antiafk hook ok");
  setupMenu(module.base);
  setupAmmo(module.base);
  log("boot: ammo replace ok");
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL25hdGl2ZXMvb2Zmc2V0cy5qcyIsICJzcmMvbmF0aXZlcy9mdW5jdGlvbnMuanMiLCAic3JjL25hdGl2ZXMvc3RydWN0cy5qcyIsICJzcmMvbmF0aXZlcy9jb25zdGFudHMuanMiLCAic3JjL3V0aWxzL2xpY2Vuc2UuanMiLCAic3JjL25hdGl2ZXMvZGF0YXRhYmxlcy5qcyIsICJzcmMvY29yZS9zY3N0cmluZy5qcyIsICJzcmMvdWkvZ3JhZGllbnQuanMiLCAic3JjL3VpL2xvYmJ5aW5mby5qcyIsICJzcmMvbmF0aXZlcy9jYWxsYmFja3MuanMiLCAic3JjL2ZlYXR1cmVzL2FudGlhZmsuanMiLCAic3JjL2NvcmUvbG9nLmpzIiwgInNyYy91aS9tZW51YnV0dG9uLmpzIiwgInNyYy91aS9wYWdlcy5qcyIsICJzcmMvdWkvcGxhdGUuanMiLCAic3JjL3VpL3BhbmVsLmpzIiwgInNyYy91aS9tZW51LmpzIiwgInNyYy9mZWF0dXJlcy9hbW1vLmpzIiwgInNyYy9pbmRleC5qcyJdLAogICJtYXBwaW5ncyI6ICI7O0FBQU8sTUFBTSxVQUFVO0FBQUEsSUFDbkIsZUFBZTtBQUFBLElBQ2YsMEJBQTBCO0FBQUEsSUFDMUIsOEJBQThCO0FBQUEsSUFDOUIsbUJBQW1CO0FBQUEsSUFDbkIsdUJBQXVCO0FBQUEsSUFDdkIsd0JBQXdCO0FBQUEsSUFDeEIscUJBQXFCO0FBQUEsSUFDckIsNkJBQTZCO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIsbUJBQW1CO0FBQUEsSUFDbkIsdUJBQXVCO0FBQUEsSUFDdkIsNkJBQTZCO0FBQUEsSUFDN0IsMkJBQTJCO0FBQUEsSUFDM0IsaUJBQWlCO0FBQUEsSUFDakIsZUFBZTtBQUFBLElBQ2YsbUJBQW1CO0FBQUEsSUFDbkIsMkJBQTJCO0FBQUEsSUFDM0IsNEJBQTRCO0FBQUEsSUFDNUIsZ0JBQWdCO0FBQUEsSUFDaEIsZ0JBQWdCO0FBQUEs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
