import { NativeFunctions } from "../natives/functions.js";
import { constants } from "../natives/constants.js";

export class ScString {
  static alloc(text) {
    const sc = NativeFunctions.malloc(constants.ScString_width);
    NativeFunctions.stringCtor(sc, Memory.allocUtf8String(text));
    return sc;
  }

  static destroy(sc) {
    NativeFunctions.stringDtor(sc);
  }

  static with(text, fn) {
    const sc = Memory.alloc(constants.ScString_width);
    NativeFunctions.stringCtor(sc, Memory.allocUtf8String(text));
    const result = fn(sc);
    NativeFunctions.stringDtor(sc);
    return result;
  }
}
