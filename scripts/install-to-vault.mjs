import { copyFile, cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginDir = path.resolve(__dirname, "..");
const vaultPath = process.argv[2] || process.env.OBSIDIAN_VAULT;

if (!vaultPath) {
  console.error("Usage: node scripts/install-to-vault.mjs /absolute/path/to/vault");
  process.exit(1);
}

const manifest = JSON.parse(
  await readFile(path.join(pluginDir, "manifest.json"), "utf8")
);

const installDir = path.join(vaultPath, ".obsidian", "plugins", manifest.id);
await mkdir(installDir, { recursive: true });

for (const fileName of ["main.js", "manifest.json", "styles.css"]) {
  await copyFile(path.join(pluginDir, fileName), path.join(installDir, fileName));
}

await rm(path.join(installDir, "assets"), { recursive: true, force: true });
await rm(path.join(installDir, "webfonts"), { recursive: true, force: true });

for (const directoryName of ["vendor"]) {
  await rm(path.join(installDir, directoryName), { recursive: true, force: true });
  await cp(path.join(pluginDir, directoryName), path.join(installDir, directoryName), {
    recursive: true,
    force: true
  });
}

console.log(installDir);
