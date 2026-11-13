import { constants } from "../natives/constants.js";

export class Gradient {
  static mix(from, to, t) {
    let color = 0;
    for (const shift of constants.Color_channels) {
      const a = from >> shift & constants.Color_mask;
      const b = to >> shift & constants.Color_mask;
      color |= Math.round(a + (b - a) * t) << shift;
    }
    return color;
  }

  static colorAt(position, light, dark) {
    return this.mix(light, dark, 1 - Math.abs(position * 2 - 1));
  }

  static paintLine(line, phase, light, dark, bandChars) {
    const span = line.length;
    let index = 0;
    let painted = "";
    while (index < span) {
      const raw = index / span - phase;
      const position = (raw % 1 + 1) % 1;
      painted += `<c${this.colorAt(position, light, dark).toString(16).padStart(constants.Color_hexDigits, "0")}>`;
      for (let step = 0; step < bandChars && index < span; step++, index++) {
        painted += line[index];
      }
      painted += "</c>";
    }
    return painted;
  }

  static paint(text, phase, light, dark, bandChars) {
    const lines = text.split("\n");
    let painted = "";
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      if (lineIndex > 0) painted += "\n";
      painted += this.paintLine(lines[lineIndex], phase - lineIndex * constants.Badge_shineLineStep, light, dark, bandChars);
    }
    return painted;
  }
}
