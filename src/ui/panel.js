import { addChild, buttonSetText, customButtonCtor, customButtonSetMovieClip, getMovieClip, guiGetInstance, guiShowPopup, getTextFieldByName, gotoAndStopFrameIndex, malloc, setText, movieClipSetText, popupAddButton, popupClose, popupCtor, setChildVisible, setScale, setSize, setVisibility, setXY, spriteCtor } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString, destroyScString, withScString } from "../core/scstring.js";
import { registerButton } from "../natives/callbacks.js";
import { paintGradient } from "./gradient.js";
import { flags, toggleFlag } from "../utils/flags.js";

let slot = Memory.alloc(Process.pointerSize);
let scPath = Memory.allocUtf8String(constants.Menu_sc);
let empty = null;
let clipName = null;
let ready = false;
let shining = false;
let measured = false;
let popup = null;
let clip = null;
let titleSlot = null;
let ammoArt = null;
let txtSlot = null;
let ammoField = null;
let afkField = null;
let pending = new Map();
let okButton = null;
let afkArt = null;
function init() {
  if (ready) return;
  ready = true;
  empty = allocScString("");
  clipName = allocScString(constants.Panel_clip);
  titleSlot = Memory.allocUtf8String(constants.Panel_titleField);
  txtSlot = Memory.allocUtf8String(constants.Panel_txtField);
}
function child(node, name) {
  const count = node.add(structs.Clip_childCount).readS16();
  const names = node.add(structs.Clip_nameTable).readPointer();
  const kids = node.add(structs.Clip_childTable).readPointer();
  for (let index = 0; index < count; index++) {
    const entry = names.add(index * 8).readPointer();
    if (!entry.isNull() && entry.readUtf8String() === name) return kids.add(index * 8).readPointer();
  }
  throw new Error("panel: no child " + name);
}
function iconArt(clipName, path, childName) {
  let node = getMovieClip(scPath, Memory.allocUtf8String(clipName), 0);
  for (const step of path) {
    node = child(node, step);
  }
  return child(node, childName);
}
function attach(node, art, x, y, scale, action) {
  const button = malloc(constants.Menu_buttonSize);
  customButtonCtor(button);
  customButtonSetMovieClip(button, art, 1);
  button.add(structs.DisplayObject_touchable).writeU8(1);
  setScale(button, scale);
  setScale(art, 1);
  setXY(button, x, y);
  addChild(node, button);
  registerButton(button, action);
  return button;
}
function measure(target) {
  setSize(target, 1e3, 1e3);
  const boxHeight = 1e3 / target.add(16).readFloat();
  const boxWidth = 1e3 / target.add(28).readFloat();
  setSize(target, boxHeight * boxHeight / 1e3, boxWidth * boxWidth / 1e3);
}
function measureTale() {
  const other = malloc(constants.Menu_popupSize);
  popupCtor(other, allocScString(constants.Panel_taleClip), 0, 0, empty, empty, empty, empty, empty);
  measure(other.add(structs.Popup_clip).readPointer());
}
function closePopup() {
  popupClose(popup);
  popup = null;
}

function shine() {
  if (popup === null) return;
  const phase = Date.now() % constants.Menu_shinePeriod / constants.Menu_shinePeriod;
  withScString(paintGradient(constants.Panel_title, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars), (text) => movieClipSetText(clip, titleSlot, text));
  withScString(paintGradient(constants.Panel_footer, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars), (text) => buttonSetText(okButton, text));
  if (flags.enemyAmmo) paintRow(ammoField, constants.Panel_ammoLabel, true, phase);
  if (flags.antiAfk) paintRow(afkField, constants.Panel_afkLabel, true, phase);
}
function paintRow(field, label, on, phase) {
  const text = on ? paintGradient(label, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars) : "<c" + constants.Panel_offColor + ">" + label + "</c>";
  const sc = allocScString(text);
  setText(field, sc);
  const previous = pending.get(field);
  if (previous !== undefined) destroyScString(previous);
  pending.set(field, sc);
}
function rowLineY() {
  const title = getTextFieldByName(clip, titleSlot).add(structs.DisplayObject_y).readFloat();
  const footer = child(clip, constants.Panel_footerSlot).add(structs.DisplayObject_y).readFloat();
  return title + (footer - title) * constants.Panel_rowDepth;
}
function build() {
  popup = malloc(constants.Menu_popupSize);
  popupCtor(popup, clipName, 0, 0, empty, empty, empty, empty, empty);
  clip = popup.add(structs.Popup_clip).readPointer();
  if (!measured) {
    measured = true;
    measure(clip);
    measureTale();
  }
  setSize(clip, constants.Panel_sizeHeight, constants.Panel_sizeWidth);
  for (const name of constants.Panel_hidden) {
    setChildVisible(clip, Memory.allocUtf8String(name), 0);
  }
  slot.writePointer(popup);
  guiShowPopup(constants.Menu_popupX, constants.Menu_popupY, guiGetInstance(), slot, 1, constants.Menu_popupFlags, 0);
  ammoArt = getMovieClip(scPath, Memory.allocUtf8String(constants.Panel_rowClip), 0);
  afkArt = getMovieClip(scPath, Memory.allocUtf8String(constants.Panel_rowClip), 0);
  gotoAndStopFrameIndex(ammoArt, 1);
  gotoAndStopFrameIndex(afkArt, 1);
  const rowLeft = -constants.Panel_sizeHeight / 2 + constants.Panel_rowMargin;
  const rowPitch = (constants.Panel_sizeHeight - constants.Panel_rowMargin * 2) / constants.Panel_rowSlots;
  const rowY = rowLineY();
  attach(clip, ammoArt, rowLeft + rowPitch * 0.5, rowY, constants.Panel_rowScale, function() {
    toggleFlag("enemyAmmo");
    paintRow(ammoField, constants.Panel_ammoLabel, flags.enemyAmmo, 0);
  });
  attach(clip, afkArt, rowLeft + rowPitch * 1.5, rowY, constants.Panel_rowScale, function() {
    toggleFlag("antiAfk");
    paintRow(afkField, constants.Panel_afkLabel, flags.antiAfk, 0);
  });
  ammoField = getTextFieldByName(ammoArt, txtSlot);
  afkField = getTextFieldByName(afkArt, txtSlot);
  paintRow(ammoField, constants.Panel_ammoLabel, flags.enemyAmmo, 0);
  paintRow(afkField, constants.Panel_afkLabel, flags.antiAfk, 0);
  withScString(constants.Panel_footerSlot, (name) => {
    okButton = popupAddButton(popup, name, NULL);
  });
  shine();
  if (!shining) {
    shining = true;
    setInterval(shine, constants.Menu_shineMs);
  }
  const close = child(clip, constants.Menu_closeField);
  const closeX = close.add(structs.DisplayObject_x).readFloat();
  const closeY = close.add(structs.DisplayObject_y).readFloat();
  setXY(close, 0, 0);
  attach(clip, close, closeX, closeY, constants.Panel_closeScale, function() {
    closePopup();
  });
  const info = iconArt(constants.Panel_infoClip, [], constants.Panel_infoChild);
  setXY(info, 0, 0);
  attach(clip, info, closeX - constants.Panel_infoGap, closeY, constants.Panel_infoScale, function() {
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
  attach(clip, gear, closeX - constants.Panel_gearGap, closeY, constants.Panel_gearScale, function() {
  });
}
export function togglePanel() {
  init();
  build();
}
