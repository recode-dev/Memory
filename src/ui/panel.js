import { addChild, customButtonCtor, customButtonSetMovieClip, getMovieClip, guiGetInstance, guiShowPopup, malloc, movieClipSetText, popupCtor, setChildVisible, setScale, setSize, setVisibility, setXY, spriteCtor } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString } from "../core/scstring.js";
import { registerButton } from "../natives/callbacks.js";
import { log } from "../core/log.js";

var slot = Memory.alloc(Process.pointerSize);
var scPath = Memory.allocUtf8String(constants.Menu_sc);
var empty = null;
var clipName = null;
var ready = false;
var popup = null;
var clip = null;
var open = false;
var measured = false;
function init() {
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
function iconArt(clipName, path, childName) {
  let node = getMovieClip(scPath, Memory.allocUtf8String(clipName), 0);
  for (const step of path === null ? [] : path) {
    node = child(node, step);
    if (node === null) break;
  }
  const art = node === null ? null : childName === null ? node : child(node, childName);
  if (art === null) log("panel: icon missing " + clipName + "/" + (path === null ? "" : path.join("/") + "/") + childName);
  return art;
}
function attach(node, art, x, y, scale, action) {
  const button = malloc(constants.Menu_buttonSize);
  customButtonCtor(button);
  customButtonSetMovieClip(button, art, 1);
  setScale(button, scale);
  setScale(art, 1);
  setXY(button, x, y);
  addChild(node, button);
  registerButton(button, action);
  return button;
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
export function togglePanel() {
  if (open) return;
  init();
  if (popup === null) {
    build();
  } else {
    setOpen(true);
  }
  open = true;
}
