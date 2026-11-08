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

  // src/ui/panel.js
  var slot = Memory.alloc(Process.pointerSize);
  var scPath = Memory.allocUtf8String(constants.Menu_sc);
  var empty = null;
  var clipName = null;
  var ready = false;
  var popup = null;
  var clip = null;
  var open = false;
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
    movieClipSetText(clip, Memory.allocUtf8String(constants.Panel_titleField), empty);
    setChildVisible(clip, Memory.allocUtf8String(constants.Panel_footerSlot), 0);
    slot.writePointer(popup);
    guiShowPopup(constants.Menu_popupX, constants.Menu_popupY, guiGetInstance(), slot, 1, constants.Menu_popupFlags, 0);
    const close = child(clip, constants.Menu_closeField);
    const closeX = close === null ? constants.Panel_anchorX : close.add(structs.DisplayObject_x).readFloat();
    const closeY = close === null ? constants.Panel_anchorY : close.add(structs.DisplayObject_y).readFloat();
    const ok = child(clip, constants.Panel_footerSlot);
    const footerX = ok === null ? 0 : ok.add(structs.DisplayObject_x).readFloat();
    const footerY = ok === null ? 0 : ok.add(structs.DisplayObject_y).readFloat();
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
