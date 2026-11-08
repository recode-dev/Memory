import { constants } from "./constants.js";
import { getDataById } from "./functions.js";

export function resolveGradient(classId, itemId) {
    return getDataById(classId * constants.LogicDataTables_globalIdStep + itemId, classId);
}
