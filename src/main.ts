import { MarkdownPostProcessorContext, Plugin, normalizePath } from "obsidian";

type TopologyUiModule = {
  parseTopologySource: (input: string, options?: { allowJavaScript?: boolean }) => unknown;
  renderTopology: (input: unknown, options?: { assetRoot?: string }) => string;
};

const topologyUi = require("@couchbaselabs/topology-ui") as TopologyUiModule;

export default class CouchbaseTopologyPlugin extends Plugin {
  private topologyUi = topologyUi;

  async onload(): Promise<void> {
    this.registerMarkdownCodeBlockProcessor("couchbase-topology", async (source, el, ctx) => {
      await this.renderTopologyCodeBlock(source, el, ctx);
    });
  }

  private async renderTopologyCodeBlock(
    source: string,
    el: HTMLElement,
    _ctx: MarkdownPostProcessorContext
  ): Promise<void> {
    const host = el.createDiv({ cls: "couchbase-topology-block" });

    try {
      const topology = this.topologyUi.parseTopologySource(source);
      host.innerHTML = this.topologyUi.renderTopology(topology, {
        assetRoot: this.getImageAssetRoot()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      host.empty();
      host.createEl("pre", {
        cls: "couchbase-topology-error",
        text: `couchbase-topology error: ${message}`
      });
      console.error("[couchbase-topology] failed to render block", error);
    }
  }

  private getImageAssetRoot(): string {
    const sampleImageUrl = this.getPluginResourcePath("vendor/topology-ui/images/nodebg.png");
    return sampleImageUrl.replace(/\/nodebg\.png(?:\?.*)?$/, "");
  }

  private getPluginResourcePath(relativePath: string): string {
    const pluginFilePath = normalizePath(
      `${this.app.vault.configDir}/plugins/${this.manifest.id}/${relativePath}`
    );

    return this.app.vault.adapter.getResourcePath(pluginFilePath);
  }
}
