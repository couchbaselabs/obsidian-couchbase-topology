import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const topologyUiEntryPath = require.resolve("@couchbaselabs/topology-ui");
const topologyUiRoot = path.dirname(topologyUiEntryPath);
const distDir = path.join(pluginDir, "dist");
const vendorDir = path.join(pluginDir, "vendor", "topology-ui");

await rm(path.join(pluginDir, "assets"), { recursive: true, force: true });
await rm(path.join(pluginDir, "webfonts"), { recursive: true, force: true });
await rm(vendorDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await mkdir(vendorDir, { recursive: true });

const libraryStylesPath = path.join(vendorDir, "styles.css");
await copyFile(
  path.join(topologyUiRoot, "dist", "topology-ui.css"),
  libraryStylesPath
);
await cp(
  path.join(topologyUiRoot, "images"),
  path.join(vendorDir, "images"),
  { recursive: true }
);
await cp(
  path.join(topologyUiRoot, "dist", "webfonts"),
  path.join(vendorDir, "webfonts"),
  { recursive: true }
);

const pluginStyles = await readFile(path.join(pluginDir, "src", "styles.css"), "utf8");
const libraryStyles = await readFile(libraryStylesPath, "utf8");

await writeFile(
  path.join(distDir, "styles.css"),
  `${libraryStyles}\n\n${pluginStyles}`,
  "utf8"
);
