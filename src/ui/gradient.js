import { constants } from "../natives/constants.js";

function mix(from, to, t) {
    let color = 0;
    for (const shift of constants.Color_channels) {
        const a = (from >> shift) & constants.Color_mask;
        const b = (to >> shift) & constants.Color_mask;
        color |= Math.round(a + (b - a) * t) << shift;
    }
    return color;
}

function colorAt(position) {
    return mix(constants.Badge_lightColor, constants.Badge_darkColor, 1 - Math.abs(position * constants.Badge_waveScale - 1));
}

function paintLine(line, phase, painted) {
    const span = line.length;
    let index = 0;
    while (index < span) {
        const raw = index / span - phase;
        const position = ((raw % 1) + 1) % 1;
        painted += constants.Color_tagOpen + colorAt(position).toString(constants.Color_radix).padStart(constants.Color_hexDigits, "0") + constants.Color_tagEnd;
        for (let step = 0; step < constants.Badge_bandChars && index < span; step++, index++) {
            painted += line[index];
        }
        painted += constants.Color_tagClose;
    }
    return painted;
}

export function paintGradient(text, phase) {
    const lines = text.split(constants.Badge_lineSeparator);
    let painted = "";
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (lineIndex > 0) {
            painted += constants.Badge_lineSeparator;
        }
        painted = paintLine(lines[lineIndex], phase - lineIndex * constants.Badge_shineLineStep, painted);
    }
    return painted;
}
