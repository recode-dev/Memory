import { getDataById } from "./functions.js";
import { constants } from "./constants.js";

export function resolveGradient(classId, itemId) {
  return getDataById(classId * constants.LogicDataTables_globalIdStep + itemId, classId);
}
