import { offsets } from "../core/offsets.js";

let _init = false;

const License_path = "/res/license.bin";
const License_payload = JSON.stringify({ features: [], connection: "Keep-Alive" });

export function setupLicense(base) {
    if (_init) return;
    _init = true;

    const dir = Process.mainModule.path.slice(0, Process.mainModule.path.lastIndexOf("/"));
    const license = File.readAllBytes(dir + License_path);
    const total = license.byteLength + License_payload.length + 1;

    const malloc = new NativeFunction(Module.findExportByName(null, "malloc"), "pointer", ["ulong"]);

    Interceptor.attach(base.add(offsets.LogicHttpRequest_encode), {
        onEnter(args) {
            const buf = malloc(total);
            Memory.copy(buf, license.unwrap(), license.byteLength);
            buf.add(license.byteLength).writeUtf8String(License_payload);
            args[0].add(offsets.LogicHttpRequest_bodyPtr).writePointer(buf);
            args[0].add(offsets.LogicHttpRequest_bodySize).writeS32(total);
        }
    });
}
