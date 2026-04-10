import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import topologyUi from "@couchbaselabs/topology-ui";
import { topologyAssetDataUris } from "./generated/topology-assets";

export default class CouchbaseTopologyPlugin extends Plugin {
  private topologyUi = topologyUi;

  onload(): void {
    this.registerMarkdownCodeBlockProcessor("couchbase-topology", (source, el, ctx) => {
      this.renderTopologyCodeBlock(source, el, ctx);
    });
  }

  private renderTopologyCodeBlock(
    source: string,
    el: HTMLElement,
    _ctx: MarkdownPostProcessorContext
  ): void {
    const host = el.createDiv({ cls: "couchbase-topology-block" });

    try {
      const topology = this.topologyUi.parseTopologySource(source);
      const renderedMarkup = this.inlineTopologyAssets(this.topologyUi.renderTopology(topology));
      host.replaceChildren(this.createRenderedFragment(host, renderedMarkup));
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

  private createRenderedFragment(host: HTMLElement, markup: string): DocumentFragment {
    const range = host.ownerDocument.createRange();
    range.selectNodeContents(host);
    return range.createContextualFragment(markup);
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
