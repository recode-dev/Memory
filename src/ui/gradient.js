import { constants } from "../core/constants.js";

const CHANNELS = [16, 8, 0];

export function mix(from, to, t) {
    let color = 0;
    for (const shift of CHANNELS) {
        const a = (from >> shift) & 0xff;
        const b = (to >> shift) & 0xff;
        color |= Math.round(a + (b - a) * t) << shift;
    }
    return 0xff000000 | color;
}

export function wave(phase) {
    return (Math.sin(phase * 2 * Math.PI) + 1) / 2;
}
