declare module "@couchbaselabs/topology-ui" {
  export interface TopologyUiRenderOptions {
    assetRoot?: string;
    allowJavaScript?: boolean;
  }

  export interface TopologyUiModule {
    parseTopologySource(input: string, options?: TopologyUiRenderOptions): unknown;
    renderTopology(input: unknown, options?: TopologyUiRenderOptions): string;
  }

  const topologyUi: TopologyUiModule;
  export default topologyUi;
}
