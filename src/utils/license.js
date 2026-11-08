import { offsets } from "../natives/offsets.js";
import { structs } from "../natives/structs.js";
import { constants } from "../natives/constants.js";
import { initFunctions, malloc } from "../natives/functions.js";

let _init = false;

export function setupLicense(module) {
    if (_init) return;
    _init = true;

    initFunctions(module.base);

    const licensePath = module.path.slice(0, module.path.lastIndexOf(constants.Path_separator)) + constants.License_path;

    Interceptor.attach(module.base.add(offsets.LogicHttpRequest_encode), {
        onEnter(args) {
            const fileBytes = File.readAllBytes(licensePath);
            const totalSize = fileBytes.byteLength + constants.License_payload.length + constants.License_terminator;
            const buf = malloc(totalSize);

            Memory.copy(buf, fileBytes.unwrap(), fileBytes.byteLength);
            buf.add(fileBytes.byteLength).writeUtf8String(constants.License_payload);

            args[0].add(structs.LogicHttpRequest_bodyPtr).writePointer(buf);
            args[0].add(structs.LogicHttpRequest_bodySize).writeS32(totalSize);
        }
    });
}
