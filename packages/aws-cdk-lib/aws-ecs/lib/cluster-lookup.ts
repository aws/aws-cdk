export interface EcsClusterLookupOptions {
  /**
     * The name of the cluster
     *
     * If given, will import the cluster with this name.
     *
     * @default Don't filter on clusterName
     */
  readonly clusterName?: string;

  /**
     * Optional to override inferred region
     *
     * @default Current stack's environment region
     */
  readonly region?: string;
}