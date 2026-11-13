import { offsets } from "../natives/offsets.js";
import { Callbacks } from "../natives/callbacks.js";
import { NativeFunctions } from "../natives/functions.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { ScString } from "../core/scstring.js";
import { DataTables } from "../natives/datatables.js";
import { Gradient } from "./gradient.js";
import { flags } from "../utils/flags.js";
import { HideLobbyInfo } from "../features/hidelobbyinfo.js";
import { HideUltiAiming } from "../features/hideultiaiming.js";
import { AutoSpin } from "../features/autospin.js";
import { AntiAutoShoot } from "../features/antiautoshoot.js";

export class Menu {
  static slot = Memory.alloc(Process.pointerSize);
  static scPath = Memory.allocUtf8String(constants.Ui_sc);
  static empty = null;
  static clipName = null;
  static panelSc = null;
  static ready = false;
  static popup = null;
  static clip = null;
  static titleSlot = null;
  static txtSlot = null;
  static plateSlot = null;
  static txtSc = null;
  static gridFields = [];
  static liveButtons = [];
  static pageButtons = [];
  static pending = new Map();
  static footerField = null;
  static pageLabel = null;
  static page = 0;
  static shineTimer = null;

  static slots = [
    { label: constants.Panel_ammoLabel, flag: "enemyAmmo" },
    { label: constants.Panel_afkLabel, flag: "antiAfk" },
    { label: constants.Panel_hideLobbyLabel, flag: "hideLobbyInfo", toggle: () => HideLobbyInfo.toggle() },
    { label: constants.Panel_hideUltiAimingLabel, flag: "hideUltiAiming", toggle: () => HideUltiAiming.toggle() },
    { label: constants.Panel_autoSpinLabel, flag: "autoSpin", toggle: () => AutoSpin.toggle() },
    { label: constants.Panel_antiAutoShootLabel, flag: "antiAutoShoot", toggle: () => AntiAutoShoot.toggle() }
  ];

  static initElements() {
    if (this.ready) return;
    this.ready = true;
    this.empty = ScString.alloc("");
    this.clipName = ScString.alloc(constants.Panel_clip);
    this.panelSc = ScString.alloc(constants.Ui_sc);
    this.titleSlot = Memory.allocUtf8String(constants.Panel_titleField);
    this.txtSlot = Memory.allocUtf8String(constants.Panel_txtField);
    this.plateSlot = Memory.allocUtf8String(constants.Panel_plateTxtField);
    this.txtSc = ScString.alloc(constants.Panel_txtField);
  }

  static child(node, name) {
    const count = node.add(structs.MovieClip_childCount).readS16();
    const names = node.add(structs.MovieClip_nameTable).readPointer();
    const kids = node.add(structs.MovieClip_childTable).readPointer();
    for (let index = 0; index < count; index++) {
      const entry = names.add(index * 8).readPointer();
      if (!entry.isNull() && entry.readUtf8String() === name) return kids.add(index * 8).readPointer();
    }
    return null;
  }

  static iconArt(clipName, path, childName) {
    let node = NativeFunctions.getMovieClip(this.scPath, Memory.allocUtf8String(clipName), 0);
    for (const step of path) {
      node = this.child(node, step);
    }
    return this.child(node, childName);
  }

  static plate() {
    const art = NativeFunctions.getMovieClip(this.scPath, Memory.allocUtf8String(constants.Panel_rowClip), 0);
    NativeFunctions.gotoAndStopFrameIndex(art, 1);
    return art;
  }

  static attach(node, art, x, y, scale, action) {
    const button = NativeFunctions.malloc(constants.Menu_buttonSize);
    NativeFunctions.customButtonCtor(button);
    NativeFunctions.customButtonSetMovieClip(button, art, 1);
    button.add(structs.DisplayObject_interactive).writeU8(1);
    NativeFunctions.setScale(button, scale);
    NativeFunctions.setScale(art, 1);
    NativeFunctions.setXY(button, x, y);
    NativeFunctions.addChild(node, button);
    Callbacks.registerButton(button, action);
    this.liveButtons.push(button);
    return button;
  }

  static noop() {}

  static dropPopup() {
    this.popup = null;
    this.clip = null;
    this.footerField = null;
    this.pageLabel = null;
    this.gridFields = [];
    this.pageButtons = [];
    for (const button of this.liveButtons) Callbacks.unregisterButton(button);
    this.liveButtons = [];
    this.stopShine();
    for (const sc of this.pending.values()) ScString.destroy(sc);
    this.pending.clear();
  }

  static closePopup() {
    const closing = this.popup;
    this.dropPopup();
    NativeFunctions.popupClose(closing);
  }

  static startShine() {
    if (this.shineTimer !== null) return;
    this.shineTimer = setInterval(() => this.shine(), constants.Menu_shineMs);
  }

  static stopShine() {
    if (this.shineTimer === null) return;
    clearInterval(this.shineTimer);
    this.shineTimer = null;
  }

  static shine() {
    const phase = Date.now() % constants.Menu_shinePeriod / constants.Menu_shinePeriod;
    ScString.with(Gradient.paint(constants.Panel_title, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars), (text) => NativeFunctions.movieClipSetText(this.clip, this.titleSlot, text));
    this.paintRow(this.footerField, constants.Panel_footer, true, phase);
    this.paintLive(phase);
  }

  static pageSize() {
    return constants.Panel_layout.colX.length * constants.Panel_layout.rowY.length;
  }

  static slotIndex(position) {
    return this.page * this.pageSize() + position;
  }

  static slotLabel(index) {
    return index < this.slots.length ? this.slots[index].label : constants.Panel_soonLabel;
  }

  static slotOn(index) {
    return index < this.slots.length ? flags[this.slots[index].flag] : false;
  }

  static activate(index) {
    const slot = this.slots[index];
    if (slot.toggle) slot.toggle();
    else flags.toggle(slot.flag);
  }

  static styleLabel(field, size) {
    field.add(structs.TextField_baseFontSize).writeU8(size);
    field.add(structs.TextField_align).writeU8(constants.Panel_labelAlign);
    field.add(structs.TextField_autoAdjustFontSize).writeU8(constants.Panel_labelAutoFit);
    field.add(structs.TextField_boundsLeft).writeFloat(constants.Panel_labelLeft);
    field.add(structs.TextField_boundsTop).writeFloat(constants.Panel_labelTop);
    field.add(structs.TextField_boundsRight).writeFloat(constants.Panel_labelRight);
    field.add(structs.TextField_boundsBottom).writeFloat(constants.Panel_labelBottom);
    NativeFunctions.setFontSize(field, size);
  }

  static paintRow(field, label, on, phase) {
    const text = on ? Gradient.paint(label, phase, constants.Menu_lightColor, constants.Menu_darkColor, constants.Menu_bandChars) : "<c" + constants.Panel_offColor + ">" + label + "</c>";
    const sc = ScString.alloc(text);
    NativeFunctions.setText(field, sc);
    const previous = this.pending.get(field);
    if (previous !== undefined) ScString.destroy(previous);
    this.pending.set(field, sc);
  }

  static paintSlot(position, phase) {
    const index = this.slotIndex(position);
    this.paintRow(this.gridFields[position], this.slotLabel(index), this.slotOn(index), phase);
  }

  static paintPage() {
    for (let position = 0; position < this.gridFields.length; position++) {
      this.paintSlot(position, 0);
    }
  }

  static paintLive(phase) {
    for (let position = 0; position < this.gridFields.length; position++) {
      if (this.slotOn(this.slotIndex(position))) this.paintSlot(position, phase);
    }
  }

  static paintPageLabel() {
    this.paintRow(this.pageLabel, constants.Panel_pageLabel + " " + (this.page + 1) + "/" + constants.Menu_pages, false, 0);
    const layout = constants.Panel_layout;
    NativeFunctions.setFontSize(this.pageLabel, layout.pageSize);
    NativeFunctions.setXY(this.pageLabel, layout.pageX + layout.labelShiftX, layout.pageY + layout.labelShiftY);
  }

  static paintPageButtons() {
    for (const item of this.pageButtons) {
      const on = (item.delta < 0 ? this.page > 0 : this.page < constants.Menu_pages - 1) ? 1 : 0;
      item.button.add(structs.DisplayObject_visible).writeU8(on);
      item.button.add(structs.DisplayObject_interactive).writeU8(on);
    }
  }

  static flip(delta) {
    this.page = (this.page + delta + constants.Menu_pages) % constants.Menu_pages;
    this.paintPage();
    this.paintPageLabel();
    this.paintPageButtons();
  }

  static build() {
    const layout = constants.Panel_layout;
    for (const sc of this.pending.values()) ScString.destroy(sc);
    this.pending.clear();
    this.gridFields = [];
    this.pageButtons = [];
    this.popup = NativeFunctions.malloc(constants.Menu_popupSize);
    NativeFunctions.popupCtor(this.popup, this.clipName, 0, 0, this.empty, this.empty, this.empty, this.empty, this.panelSc);
    this.clip = this.popup.add(structs.PopupBase_clip).readPointer();
    this.clip.add(structs.DisplayObject_scaleX).writeFloat(constants.Panel_scaleX);
    this.clip.add(structs.DisplayObject_scaleY).writeFloat(constants.Panel_scaleY);
    for (const name of constants.Panel_hidden) {
      NativeFunctions.setChildVisible(this.clip, Memory.allocUtf8String(name), 0);
    }
    this.slot.writePointer(this.popup);
    NativeFunctions.guiShowPopup(constants.Menu_popupX, constants.Menu_popupY, NativeFunctions.guiGetInstance(), this.slot, 1, constants.Menu_popupFlags, 0);
    for (let index = 0; index < this.pageSize(); index++) {
      const column = index % layout.colX.length;
      const line = (index - column) / layout.colX.length;
      const art = this.plate();
      this.attach(this.clip, art, layout.colX[column] + layout.featX, layout.rowY[line] + layout.featY, layout.featSize, () => {
        const target = this.slotIndex(index);
        if (!this.slots[target]) return;
        this.activate(target);
        this.paintSlot(index, 0);
      });
      const field = NativeFunctions.getTextFieldByName(art, this.txtSlot);
      this.styleLabel(field, layout.featFont);
      this.gridFields.push(field);
    }
    this.paintPage();
    this.pageLabel = NativeFunctions.createBlingTextField(this.plate(), this.txtSc, DataTables.resolveGradient(constants.Badge_gradientTable, constants.Badge_gradientId));
    NativeFunctions.setTextColor(this.pageLabel, constants.Panel_pageColor);
    NativeFunctions.addChild(this.clip, this.pageLabel);
    this.paintPageLabel();
    for (const spec of constants.Panel_pageButtons) {
      const art = this.plate();
      const limit = spec.x < 0 ? -layout.pnX : layout.pnX;
      const button = this.attach(this.clip, art, limit, layout.pnY, layout.pnSize, () => {
        this.flip(spec.delta);
      });
      this.pageButtons.push({ button: button, x: limit, delta: spec.delta });
      this.paintRow(NativeFunctions.getTextFieldByName(art, this.txtSlot), spec.label, false, 0);
    }
    this.paintPageButtons();
    const footer = this.child(this.clip, constants.Panel_footerSlot);
    NativeFunctions.setXY(footer, 0, 0);
    this.attach(this.clip, footer, 0, layout.footerY, layout.footerSize, this.noop);
    this.footerField = NativeFunctions.getTextFieldByName(footer, this.plateSlot);
    this.footerField.add(structs.TextField_autoAdjustFontSize).writeU8(constants.Panel_labelAutoFit);
    NativeFunctions.setFontSize(this.footerField, layout.footerFont);
    const close = this.child(this.clip, constants.Menu_closeField);
    NativeFunctions.setXY(close, 0, 0);
    this.attach(this.clip, close, layout.closeX, layout.closeY, layout.closeSize, () => {
      this.closePopup();
    });
    const info = this.iconArt(constants.Panel_infoClip, [], constants.Panel_infoChild);
    NativeFunctions.setXY(info, 0, 0);
    this.attach(this.clip, info, layout.closeX - constants.Panel_infoGap, layout.closeY + layout.iconDy, constants.Panel_infoScale, this.noop);
    const gear = this.iconArt(constants.Panel_gearClip, constants.Panel_gearPath, constants.Panel_gearChild);
    NativeFunctions.setXY(gear, 0, 0);
    const cover = this.iconArt(constants.Panel_badgeClip, constants.Panel_badgePath, constants.Panel_badgeChild);
    const holder = NativeFunctions.malloc(constants.Menu_buttonSize);
    NativeFunctions.spriteCtor(holder, 1);
    NativeFunctions.setXY(cover, 0, 0);
    NativeFunctions.addChild(holder, cover);
    NativeFunctions.setScale(holder, holder.add(structs.DisplayObject_scaleX).readFloat() + constants.Panel_badgeScale);
    NativeFunctions.setXY(holder, constants.Panel_badgeX, constants.Panel_badgeY);
    NativeFunctions.addChild(gear, holder);
    this.attach(this.clip, gear, layout.closeX - constants.Panel_gearGap, layout.closeY + layout.iconDy, constants.Panel_gearScale, this.noop);
    this.shine();
    this.startShine();
  }

  static popupAlive() {
    const gui = NativeFunctions.guiGetInstance();
    const list = gui.add(constants.GUI_popupList).readPointer();
    const count = gui.add(constants.GUI_popupCount).readS32();
    for (let i = 0; i < count; i += 1) {
      if (list.add(i * 8).readPointer().equals(this.popup)) return true;
    }
    return false;
  }

  static toggle() {
    this.initElements();
    if (this.popup !== null) {
      if (!this.popupAlive()) {
        this.dropPopup();
        this.build();
        return;
      }
      this.closePopup();
      return;
    }
    this.build();
  }

  static init(base) {
    if (this._init) return;
    this._init = true;
    Interceptor.attach(base.add(offsets.CustomButton_buttonPressed), {
      onEnter(args) {
        const action = Callbacks.buttonAction(args[0]);
        if (action) action();
      }
    });
  }
}
