import { constants } from "../core/constants.js";

const CHANNELS = [16, 8, 0];

function mix(from, to, t) {
    let color = 0;
    for (const shift of CHANNELS) {
        const a = (from >> shift) & 0xff;
        const b = (to >> shift) & 0xff;
        color |= Math.round(a + (b - a) * t) << shift;
    }
    return color.toString(16).padStart(6, "0");
}

export function paintGradient(text, phase) {
    const chars = Array.from(text);
    let painted = "";
    for (let index = 0; index < chars.length; index++) {
        const ch = chars[index];
        if (ch === "\n") {
            painted += ch;
            continue;
        }
        const position = (index / chars.length + phase) % 1;
        const wave = 1 - Math.abs(position * 2 - 1);
        painted += `<c${mix(constants.Lobby_lightColor, constants.Lobby_darkColor, wave)}>${ch}</c>`;
    }
    return painted;
}
