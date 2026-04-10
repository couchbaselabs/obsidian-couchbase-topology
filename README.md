# Couchbase Topology Obsidian Plugin

This plugin renders fenced code blocks like:

````
```couchbase-topology
{
  name: "cb-demo",
  serverGroups: [
    {
      name: "Group A",
      nodes: [{ name: "node-01", services: ["Data", "Query"] }]
    }
  ]
}
```
````

## Development

1. Run `npm install`.
2. Run `npm run build`.
3. Install into a vault with `npm run install:vault -- /path/to/vault`.
4. Enable the plugin in Obsidian or with the Obsidian CLI.

## Implementation notes

- Uses the published npm package `@couchbaselabs/topology-ui` directly.
- Passes an Obsidian plugin-local `assetRoot` so the library resolves bundled images correctly inside the vault.
- Generates a single vendored runtime bundle under `vendor/topology-ui/` containing the library stylesheet, images, and webfonts.
- Builds the plugin entrypoint to `dist/main.js`, and only copies it to `main.js` when installing into an Obsidian vault.
- Builds the final plugin stylesheet to `dist/styles.css`, combining the vendored library CSS with plugin-local styles before install/release packaging.

## Distribution

- Keep source files in Git.
- Run `npm run build` before each release.
- Attach `manifest.json`, plus packaged root-level `main.js` and `styles.css`, to the GitHub release.
- Include the generated `vendor/` folder in your release artifact or release zip for manual installs and BRAT testing.
