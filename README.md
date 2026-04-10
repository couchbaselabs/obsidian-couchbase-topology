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
- Inlines the library image assets into the rendered markup at runtime, so the release artifact does not need a separate runtime image folder.
- Inlines the library webfonts into the built stylesheet, so the release artifact stays self-contained.
- Builds the plugin entrypoint to `dist/main.js`, and only copies it to `main.js` when installing into an Obsidian vault.
- Builds the final plugin stylesheet to `dist/styles.css`, combining the inlined library CSS with plugin-local styles before install/release packaging.

## Distribution

- CI runs on pushes to `main` and on pull requests via `.github/workflows/validate.yml`.
- Releases run from exact version tags like `0.1.0`, not `v0.1.0`.
- The release workflow verifies the tag matches both `package.json` and `manifest.json`, builds the plugin, and uploads `manifest.json`, `main.js`, and `styles.css` to the GitHub release.
- Before creating a release tag locally, update the package version with `npm version <patch|minor|major>`, then push the commit and the matching tag.
