import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginDir = path.resolve(__dirname, "..");

const packageJson = JSON.parse(await readFile(path.join(pluginDir, "package.json"), "utf8"));
const manifestJson = JSON.parse(await readFile(path.join(pluginDir, "manifest.json"), "utf8"));
const versionsJson = JSON.parse(await readFile(path.join(pluginDir, "versions.json"), "utf8"));
const distMainPath = path.join(pluginDir, "dist", "main.js");
const distStylesPath = path.join(pluginDir, "dist", "styles.css");

await access(distMainPath);
await access(distStylesPath);

if (packageJson.version !== manifestJson.version) {
  throw new Error(
    `Version mismatch: package.json=${packageJson.version} manifest.json=${manifestJson.version}`
  );
}

if (versionsJson[packageJson.version] !== manifestJson.minAppVersion) {
  throw new Error(
    `versions.json entry for ${packageJson.version} must equal minAppVersion ${manifestJson.minAppVersion}`
  );
}

const [distMain, distStyles] = await Promise.all([
  readFile(distMainPath, "utf8"),
  readFile(distStylesPath, "utf8")
]);

for (const [label, content, disallowedValues] of [
  ["dist/main.js", distMain, ["vendor/topology-ui"]],
  ["dist/styles.css", distStyles, ["./webfonts/", "vendor/topology-ui", "../vendor/"]]
]) {
  for (const disallowedValue of disallowedValues) {
    if (content.includes(disallowedValue)) {
      throw new Error(`${label} still contains unresolved runtime path: ${disallowedValue}`);
    }
  }
}

console.log("Release artifact verified.");
