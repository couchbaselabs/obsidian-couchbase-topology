import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginDir = path.resolve(__dirname, "..");

const packageJsonPath = path.join(pluginDir, "package.json");
const manifestJsonPath = path.join(pluginDir, "manifest.json");
const versionsJsonPath = path.join(pluginDir, "versions.json");

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const manifestJson = JSON.parse(await readFile(manifestJsonPath, "utf8"));
const versionsJson = JSON.parse(await readFile(versionsJsonPath, "utf8"));

manifestJson.version = packageJson.version;
versionsJson[packageJson.version] = manifestJson.minAppVersion;

await writeFile(manifestJsonPath, `${JSON.stringify(manifestJson, null, 2)}\n`, "utf8");
await writeFile(versionsJsonPath, `${JSON.stringify(versionsJson, null, 2)}\n`, "utf8");
