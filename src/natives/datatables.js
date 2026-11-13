import { NativeFunctions } from "./functions.js";
import { constants } from "./constants.js";

export class DataTables {
  static resolveGradient(classId, itemId) {
    return NativeFunctions.getDataById(classId * constants.LogicDataTables_globalIdStep + itemId, classId);
  }
}
