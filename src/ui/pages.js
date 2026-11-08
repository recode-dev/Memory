import { constants } from "../natives/constants.js";
import { toggleEnemyAmmo, toggleAntiAfk } from "../natives/callbacks.js";

const slots = [
    { label: "ENEMY AMMO", action: toggleEnemyAmmo },
    { label: "ANTI AFK", action: toggleAntiAfk }
];

const placeholder = { label: constants.Menu_placeholder, action: null };

function buildPage() {
    const page = [];
    for (let index = 0; index < constants.Menu_slots; index++) {
        page.push(index < slots.length ? slots[index] : placeholder);
    }
    return page;
}

export const pages = [buildPage()];
