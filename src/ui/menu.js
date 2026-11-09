import { offsets } from "../natives/offsets.js";
import { buttonAction, registerButton, unregisterButton } from "../natives/callbacks.js";
import { addChild, createBlingTextField, customButtonCtor, customButtonSetMovieClip, getMovieClip, guiGetInstance, guiShowPopup, getTextFieldByName, gotoAndStopFrameIndex, malloc, movieClipSetText, popupClose, popupCtor, setChildVisible, setFontSize, setScale, setText, setTextColor, setXY, spriteCtor } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString, destroyScString, withScString } from "../core/scstring.js";
import { resolveGradient } from "../natives/datatables.js";
import { paintGradient } from "./gradient.js";
import { flags, toggleFlag } from "../utils/flags.js";
import { makeMenuButton } from "./menubutton.js";
import { toggleHideLobbyInfo } from "../features/hidelobbyinfo.js";

let slot = Memory.alloc(Process.pointerSize);
let scPath = Memory.allocUtf8String(constants.Menu_sc);
let empty = null;
let clipName = null;
let panelSc = null;
let ready = false;
let shining = false;
let popup = null;
let popupClass = null;
let clip = null;
let titleSlot = null;
let txtSlot = null;
let plateSlot = null;
let txtSc = null;
let gridFields = [];
let liveButtons = [];
let pageButtons = [];
let pending = new Map();
let footerField = null;
let pageLabel = null;
let page = 0;
function init() {
  if (ready) return;
  ready = true;
  empty = allocScString("");
  clipName = allocScString(constants.Panel_clip);
  panelSc = allocScString(constants.Panel_sc);
  titleSlot = Memory.allocUtf8String(constants.Panel_titleField);
  txtSlot = Memory.allocUtf8String(constants.Panel_txtField);
  plateSlot = Memory.allocUtf8String(constants.Panel_plateTxtField);
  txtSc = allocScString(constants.Panel_txtField);
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
function iconArt(clipName, path, childName) {
  let node = getMovieClip(scPath, Memory.allocUtf8String(clipName), 0);
  for (const step of path) {
    node = child(node, step);
  }
  return child(node, childName);
}
function plate() {
  const art = getMovieClip(scPath, Memory.allocUtf8String(constants.Panel_rowClip), 0);
  gotoAndStopFrameIndex(art, 1);
  return art;
}
function attach(node, art, x, y, scale, action) {
  if (art === null) return;
  const button = malloc(constants.Menu_buttonSize);
  customButtonCtor(button);
  customButtonSetMovieClip(button, art, 1);
  button.add(structs.DisplayObject_touchable).writeU8(1);
  setScale(button, scale);
  setScale(art, 1);
  setXY(button, x, y);
  addChild(node, button);
  registerButton(button, function() {
    if (popup === null) return;
    action();
  });
  liveButtons.push(button);
  return button;
}
function dropPopup() {
  popup = null;
  popupClass = null;
  clip = null;
  footerField = null;
  pageLabel = null;
  gridFields = [];
  pageButtons = [];
  for (const button of liveButtons) unregisterButton(button);
  liveButtons = [];
  for (const sc of pending.values()) destroyScString(sc);
  pending.clear();
}
function closePopup() {
  if (popup === null) return;
  const closing = popup;
  dropPopup();
  popupClose(closing);
}
function shine() {
  if (clip === null) return;
  const phase = Date.now() % constants.Menu_shinePeriod / constants.Menu_shinePeriod;
  withScString(paintGradient(constants.Panel_title, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars), (text) => movieClipSetText(clip, titleSlot, text));
  paintRow(footerField, constants.Panel_footer, true, phase);
  paintLive(phase);
}
function pageSize() {
  return constants.Panel_layout.colX.length * constants.Panel_layout.rowY.length;
}
function slotIndex(position) {
  return page * pageSize() + position;
}
function slotLabel(index) {
  return index === 0 ? constants.Panel_ammoLabel : index === 1 ? constants.Panel_afkLabel : index === 2 ? constants.Panel_hideLobbyLabel : constants.Panel_soonLabel;
}
function slotOn(index) {
  return index === 0 ? flags.enemyAmmo : index === 1 ? flags.antiAfk : index === 2 ? flags.hideLobbyInfo : false;
}
function flagName(index) {
  return index === 0 ? "enemyAmmo" : "antiAfk";
}
function activate(target) {
  if (target === 2) toggleHideLobbyInfo();
  else toggleFlag(flagName(target));
}
function styleLabel(field, size) {
  field.add(structs.TextField_baseFontSize).writeU8(size);
  field.add(structs.TextField_align).writeU8(constants.Panel_labelAlign);
  field.add(structs.TextField_autoAdjustFontSize).writeU8(constants.Panel_labelAutoFit);
  field.add(structs.TextField_boundsLeft).writeFloat(constants.Panel_labelLeft);
  field.add(structs.TextField_boundsTop).writeFloat(constants.Panel_labelTop);
  field.add(structs.TextField_boundsRight).writeFloat(constants.Panel_labelRight);
  field.add(structs.TextField_boundsBottom).writeFloat(constants.Panel_labelBottom);
  setFontSize(field, size);
}
function paintRow(field, label, on, phase) {
  const text = on ? paintGradient(label, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars) : "<c" + constants.Panel_offColor + ">" + label + "</c>";
  const sc = allocScString(text);
  setText(field, sc);
  const previous = pending.get(field);
  if (previous !== undefined) destroyScString(previous);
  pending.set(field, sc);
}
function paintSlot(position, phase) {
  const index = slotIndex(position);
  paintRow(gridFields[position], slotLabel(index), slotOn(index), phase);
}
function paintPage() {
  for (let position = 0; position < gridFields.length; position++) {
    paintSlot(position, 0);
  }
}
function paintLive(phase) {
  for (let position = 0; position < gridFields.length; position++) {
    if (slotOn(slotIndex(position))) paintSlot(position, phase);
  }
}
function paintPageLabel() {
  paintRow(pageLabel, constants.Panel_pageLabel + " " + (page + 1) + "/" + constants.Menu_pages, false, 0);
  const layout = constants.Panel_layout;
  setFontSize(pageLabel, layout.pageSize);
  setXY(pageLabel, layout.pageX + layout.labelShiftX, layout.pageY + layout.labelShiftY);
}
function paintPageButtons() {
  for (const item of pageButtons) {
    const on = (item.delta < 0 ? page > 0 : page < constants.Menu_pages - 1) ? 1 : 0;
    item.button.add(structs.DisplayObject_visible).writeU8(on);
    item.button.add(structs.DisplayObject_touchable).writeU8(on);
  }
}
function flip(delta) {
  page = (page + delta + constants.Menu_pages) % constants.Menu_pages;
  paintPage();
  paintPageLabel();
  paintPageButtons();
}
function build() {
  const layout = constants.Panel_layout;
  for (const sc of pending.values()) destroyScString(sc);
  pending.clear();
  gridFields = [];
  pageButtons = [];
  popup = malloc(constants.Menu_popupSize);
  popupCtor(popup, clipName, 0, 0, empty, empty, empty, empty, panelSc);
  popupClass = popup.readPointer();
  clip = popup.add(structs.Popup_clip).readPointer();
  clip.add(structs.DisplayObject_scaleX).writeFloat(constants.Panel_scaleX);
  clip.add(structs.DisplayObject_scaleY).writeFloat(constants.Panel_scaleY);
  for (const name of constants.Panel_hidden) {
    setChildVisible(clip, Memory.allocUtf8String(name), 0);
  }
  slot.writePointer(popup);
  guiShowPopup(constants.Menu_popupX, constants.Menu_popupY, guiGetInstance(), slot, 1, constants.Menu_popupFlags, 0);
  if (slot.readPointer().isNull()) {
    popup = null;
    clip = null;
    console.error("menu popup was rejected by the gui");
    return;
  }
  for (let index = 0; index < pageSize(); index++) {
    const column = index % layout.colX.length;
    const line = (index - column) / layout.colX.length;
    const art = plate();
    attach(clip, art, layout.colX[column] + layout.featX, layout.rowY[line] + layout.featY, layout.featSize, function() {
      const target = slotIndex(index);
      if (target > 2) return;
      activate(target);
      paintSlot(index, 0);
    });
    const field = getTextFieldByName(art, txtSlot);
    styleLabel(field, layout.featFont);
    gridFields.push(field);
  }
  paintPage();
  pageLabel = createBlingTextField(plate(), txtSc, resolveGradient(constants.Badge_gradientTable, constants.Badge_gradientId));
  setTextColor(pageLabel, constants.Panel_pageColor);
  addChild(clip, pageLabel);
  paintPageLabel();
  for (const spec of constants.Panel_pageButtons) {
    const art = plate();
    const limit = spec.x < 0 ? -layout.pnX : layout.pnX;
    const button = attach(clip, art, limit, layout.pnY, layout.pnSize, function() {
      flip(spec.delta);
    });
    pageButtons.push({ button: button, x: limit, delta: spec.delta });
    paintRow(getTextFieldByName(art, txtSlot), spec.label, false, 0);
  }
  paintPageButtons();
  const footer = child(clip, constants.Panel_footerSlot);
  setXY(footer, 0, 0);
  attach(clip, footer, 0, layout.footerY, layout.footerSize, function() {
  });
  footerField = getTextFieldByName(footer, plateSlot);
  footerField.add(structs.TextField_autoAdjustFontSize).writeU8(constants.Panel_labelAutoFit);
  setFontSize(footerField, layout.footerFont);
  const close = child(clip, constants.Menu_closeField);
  setXY(close, 0, 0);
  attach(clip, close, layout.closeX, layout.closeY, layout.closeSize, function() {
    closePopup();
  });
  const info = iconArt(constants.Panel_infoClip, [], constants.Panel_infoChild);
  setXY(info, 0, 0);
  attach(clip, info, layout.closeX - constants.Panel_infoGap, layout.closeY + layout.iconDy, constants.Panel_infoScale, function() {
  });
  const gear = iconArt(constants.Panel_gearClip, constants.Panel_gearPath, constants.Panel_gearChild);
  setXY(gear, 0, 0);
  const cover = iconArt(constants.Panel_badgeClip, constants.Panel_badgePath, constants.Panel_badgeChild);
  const holder = malloc(constants.Menu_buttonSize);
  spriteCtor(holder, 1);
  setXY(cover, 0, 0);
  addChild(holder, cover);
  setScale(holder, holder.add(structs.DisplayObject_scaleX).readFloat() + constants.Panel_badgeScale);
  setXY(holder, constants.Panel_badgeX, constants.Panel_badgeY);
  addChild(gear, holder);
  attach(clip, gear, layout.closeX - constants.Panel_gearGap, layout.closeY + layout.iconDy, constants.Panel_gearScale, function() {
  });
  shine();
  if (!shining) {
    shining = true;
    setInterval(shine, constants.Menu_shineMs);
  }
}
function togglePanel() {
  init();
  if (popup !== null) {
    if (popup.readPointer().equals(popupClass)) {
      closePopup();
      return;
    }
    dropPopup();
  }
  build();
}
let _init = false;
export function setupMenu(base) {
  if (_init) return;
  _init = true;
  Interceptor.attach(base.add(offsets.CustomButton_buttonPressed), {
    onEnter(args) {
      const action = buttonAction(args[0]);
      if (action) action();
    }
  });
  Interceptor.attach(base.add(offsets.HomePage_ctor), {
    onLeave() {
      makeMenuButton(togglePanel);
    }
  });
}
