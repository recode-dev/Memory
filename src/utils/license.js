import { offsets } from "../core/offsets.js";
import { constants } from "../core/constants.js";

let _init = false;

export function setupLicense(base) {
    if (_init) return;
    _init = true;

    const modPath = Process.getModuleByAddress(base).path;
    const licensePath = modPath.slice(0, modPath.lastIndexOf("/")) + constants.License_path;
    const malloc = new NativeFunction(Module.getGlobalExportByName("malloc"), "pointer", ["int"]);

    Interceptor.attach(base.add(offsets.LogicHttpRequest_encode), {
        onEnter(args) {
            const fileBytes = File.readAllBytes(licensePath);
            const totalSize = fileBytes.byteLength + constants.License_payload.length + 1;
            const buf = malloc(totalSize);

            Memory.copy(buf, fileBytes.unwrap(), fileBytes.byteLength);
            buf.add(fileBytes.byteLength).writeUtf8String(constants.License_payload);

            const obj = args[0];
            obj.add(offsets.LogicHttpRequest_bodyPtr).writePointer(buf);
            obj.add(offsets.LogicHttpRequest_bodySize).writeS32(totalSize);
        }
    });
}