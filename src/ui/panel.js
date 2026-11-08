import { addChild, customButtonCtor, customButtonSetMovieClip, getMovieClip, guiGetInstance, guiShowPopup, malloc, movieClipSetText, popupCtor, setChildVisible, setScale, setSize, setVisibility, setXY, spriteCtor } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { allocScString } from "../core/scstring.js";
import { registerButton } from "../natives/callbacks.js";

let slot = Memory.alloc(Process.pointerSize);
let scPath = Memory.allocUtf8String(constants.Menu_sc);
let empty = null;
let clipName = null;
let ready = false;
let popup = null;
let clip = null;
let open = false;
let measured = false;
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
    measure(clip);
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
  const closeX = close.add(structs.DisplayObject_x).readFloat();
  const closeY = close.add(structs.DisplayObject_y).readFloat();
  setXY(close, 0, 0);
  attach(clip, close, closeX, closeY, constants.Panel_closeScale, function() {
    setOpen(false);
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
  if (open) return;
  init();
  if (popup === null) {
    build();
  } else {
    setOpen(true);
  }
  open = true;
}
