import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { topologyAssetDataUris } from "./generated/topology-assets";

type TopologyUiModule = {
  parseTopologySource: (input: string, options?: { allowJavaScript?: boolean }) => unknown;
  renderTopology: (input: unknown) => string;
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
      host.innerHTML = this.inlineTopologyAssets(this.topologyUi.renderTopology(topology));
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

  private inlineTopologyAssets(html: string): string {
    return html.replace(
      /\b(xlink:href|src)=(["'])images\/([^"'?#]+)\2/g,
      (match, attributeName: string, quote: string, assetName: string) => {
        const assetDataUri =
          topologyAssetDataUris[assetName as keyof typeof topologyAssetDataUris];
        return assetDataUri ? `${attributeName}=${quote}${assetDataUri}${quote}` : match;
      }
    );
  }
}
