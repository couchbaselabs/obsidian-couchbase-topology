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
- Keeps the root [styles.css](/Users/tayebchlyah/Projects/couchbase/couchbaselabs/topology-ui/obsidian-plugin/styles.css) as a thin plugin-owned entry file that imports the vendored library CSS.

## Distribution

- Keep source files in Git.
- Run `npm run build` before each release.
- Attach `manifest.json`, `main.js`, and `styles.css` to the GitHub release.
- Include the generated `vendor/` folder in your release artifact or release zip for manual installs and BRAT testing.
