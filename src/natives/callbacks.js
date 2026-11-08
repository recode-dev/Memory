import { structs } from "./structs.js";
import { updateHealthBar, buttonPressed } from "./functions.js";

let enemyAmmo = true;
let antiAfk = true;
const buttons = new Map();

function showAmmo(character) {
    const clip = character.add(structs.Character_ammoClip).readPointer();
    if (clip.isNull()) return;
    clip.add(structs.DisplayObject_visible).writeU8(1);
}

export function toggleEnemyAmmo() {
    enemyAmmo = !enemyAmmo;
}

export function toggleAntiAfk() {
    antiAfk = !antiAfk;
}

export function isEnemyAmmoEnabled() {
    return enemyAmmo;
}

export function isAntiAfkEnabled() {
    return antiAfk;
}

export function registerButton(button, action) {
    buttons.set(button.toString(), action);
}

export const updateHealthBarCallback = new NativeCallback(function (character, deltaTime) {
    updateHealthBar(character, deltaTime);
    if (enemyAmmo) showAmmo(character);
}, "void", ["pointer", "float"]);

export const buttonPressedCallback = new NativeCallback(function (button) {
    const action = buttons.get(button.toString());
    if (action === undefined) {
        buttonPressed(button);
        return;
    }
    action();
}, "void", ["pointer"]);
