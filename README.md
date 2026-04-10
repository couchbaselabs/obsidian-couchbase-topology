# Couchbase Topology Obsidian Plugin

Render Couchbase topology diagrams directly inside Obsidian from fenced code blocks.

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

The block content uses the `@couchbaselabs/topology-ui` topology source format, including its JavaScript-style object syntax.

## Usage

1. Add a fenced code block with the `couchbase-topology` language.
2. Paste your topology definition inside the block.
3. Switch to Reading view or Live Preview to render the diagram.

Example:

````
```couchbase-topology
{
  name: "cb-demo",
  version: "7.6.2",
  serverGroups: [
    {
      name: "SG 1",
      nodes: [
        { name: "cb-demo-0000", services: ["Data", "Query", "Index"] },
        { name: "cb-demo-0001", services: ["Data", "Analytics"] }
      ]
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
- The release workflow verifies the tag matches both `package.json` and `manifest.json`, builds the plugin, generates notes with `git-cliff`, and uploads `manifest.json`, `main.js`, and `styles.css` to the GitHub release.
- Before creating a release tag locally, update the package version with `npm version <patch|minor|major>`, then push the commit and the matching tag.

## Beta Testing With BRAT

Before the plugin is available in the official community directory, testers can install it with the BRAT plugin:

1. Install `BRAT` in Obsidian.
2. Open the BRAT command to add a beta plugin.
3. Enter this repository: `couchbaselabs/obsidian-couchbase-topology`
4. Install the plugin from BRAT and enable `Couchbase Topology`.

Repository URL: [couchbaselabs/obsidian-couchbase-topology](https://github.com/couchbaselabs/obsidian-couchbase-topology)

## Community Submission

Submission target repository: [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases)

Entry to add to `community-plugins.json`:

```json
{
  "id": "couchbase-topology",
  "name": "Couchbase Topology",
  "author": "Couchbase Labs",
  "description": "Render Couchbase topology diagrams from fenced code blocks.",
  "repo": "couchbaselabs/obsidian-couchbase-topology"
}
```
