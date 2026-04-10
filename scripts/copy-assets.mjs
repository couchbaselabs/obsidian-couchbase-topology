import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const topologyUiEntryPath = require.resolve("@couchbaselabs/topology-ui");
const topologyUiRoot = path.dirname(topologyUiEntryPath);
const vendorDir = path.join(pluginDir, "vendor", "topology-ui");

await rm(path.join(pluginDir, "assets"), { recursive: true, force: true });
await rm(path.join(pluginDir, "webfonts"), { recursive: true, force: true });
await rm(vendorDir, { recursive: true, force: true });
await mkdir(vendorDir, { recursive: true });

await copyFile(
  path.join(topologyUiRoot, "dist", "topology-ui.css"),
  path.join(vendorDir, "styles.css")
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
