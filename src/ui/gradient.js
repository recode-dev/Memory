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
    const span = chars.length;
    let painted = "";
    let index = 0;
    while (index < span) {
        const ch = chars[index];
        if (ch === "\n") {
            painted += ch;
            index++;
            continue;
        }
        const position = (index / span + phase) % 1;
        painted += `<c${mix(constants.Lobby_lightColor, constants.Lobby_darkColor, 1 - Math.abs(position * 2 - 1))}>`;
        for (let step = 0; step < constants.Lobby_bandChars && index < span && chars[index] !== "\n"; step++, index++) {
            painted += chars[index];
        }
        painted += "</c>";
    }
    return painted;
}
