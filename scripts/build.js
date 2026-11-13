import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const version = process.argv[2] || "2";
const distDir = path.resolve("dist");
const toolsDir = path.resolve("tools");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const jsOutput = path.join(distDir, `agent_${version}.js`);
const qbcOutput = path.join(distDir, `agent_${version}.qbc`);
const binOutput = path.join(distDir, `agent_${version}.bin`);

execSync(`npx frida-compile src/index.js -o ${jsOutput} --bundle-format iife -c -S`, { stdio: "inherit" });

const compilerPath = path.join(toolsDir, "compile_bytecode");
execSync(`${compilerPath} ${jsOutput} ${qbcOutput}`, { stdio: "inherit" });
fs.copyFileSync(qbcOutput, binOutput);
