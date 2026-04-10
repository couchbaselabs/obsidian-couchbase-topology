import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
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
const generatedDir = path.join(pluginDir, "src", "generated");
const topologyImagesDir = path.join(topologyUiRoot, "images");
const topologyFontsDir = path.join(topologyUiRoot, "dist", "webfonts");
const topologyCssPath = path.join(topologyUiRoot, "dist", "topology-ui.css");

await rm(path.join(pluginDir, "vendor"), { recursive: true, force: true });
await rm(path.join(pluginDir, "assets"), { recursive: true, force: true });
await rm(path.join(pluginDir, "webfonts"), { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await mkdir(generatedDir, { recursive: true });

const libraryCss = await readFile(topologyCssPath, "utf8");
const pluginCss = await readFile(path.join(pluginDir, "src", "styles.css"), "utf8");
const imageAssetMap = await buildImageAssetMap(topologyImagesDir);
const inlinedLibraryCss = await inlineWebfonts(libraryCss, topologyFontsDir);

await writeFile(
  path.join(distDir, "styles.css"),
  `${inlinedLibraryCss}\n\n${pluginCss}`.trimEnd() + "\n",
  "utf8"
);

await writeFile(
  path.join(generatedDir, "topology-assets.ts"),
  [
    "export const topologyAssetDataUris = {",
    ...Object.entries(imageAssetMap).map(
      ([assetName, assetDataUri]) => `  ${JSON.stringify(assetName)}: ${JSON.stringify(assetDataUri)},`
    ),
    "} as const;",
    ""
  ].join("\n"),
  "utf8"
);

function mimeTypeForExtension(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    case ".eot":
      return "application/vnd.ms-fontobject";
    case ".ttf":
      return "font/ttf";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      throw new Error(`Unsupported asset type: ${filePath}`);
  }
}

async function buildImageAssetMap(imagesDir) {
  const files = (await readdir(imagesDir)).sort();
  const entries = await Promise.all(
    files.map(async (fileName) => {
      const assetPath = path.join(imagesDir, fileName);
      const assetBuffer = await readFile(assetPath);
      return [fileName, toDataUri(assetBuffer, mimeTypeForExtension(assetPath))];
    })
  );

  return Object.fromEntries(entries);
}

async function inlineWebfonts(css, fontsDir) {
  const fontFileNames = Array.from(
    new Set(
      [...css.matchAll(/url\((['"]?)(?:\.\/)?webfonts\/([^'")?#]+)(?:\?[^'")#]*)?(?:#[^'")]+)?\1\)/g)].map(
        (match) => match[2]
      )
    )
  );

  const fontDataUris = Object.fromEntries(
    await Promise.all(
      fontFileNames.map(async (fileName) => {
        const fontPath = path.join(fontsDir, fileName);
        const fontBuffer = await readFile(fontPath);
        return [fileName, toDataUri(fontBuffer, mimeTypeForExtension(fontPath))];
      })
    )
  );

  return css.replace(
    /url\((['"]?)(?:\.\/)?webfonts\/([^'")?#]+)(?:\?[^'")#]*)?(?:#[^'")]+)?\1\)/g,
    (match, quote, fileName) => {
      const fontDataUri = fontDataUris[fileName];
      return fontDataUri ? `url(${quote}${fontDataUri}${quote})` : match;
    }
  );
}

function toDataUri(content, mimeType) {
  return `data:${mimeType};base64,${content.toString("base64")}`;
}
