/**
 * Options for looking up a cluster.
 */
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
  * The ARN of the cluster
  *
  * If given, will import the cluster with this ARN.
  *
  * @default Don't filter on clusterArn
  */
  readonly clusterArn?: string;

  /**
  * Optional to override inferred region
  *
  * @default Current stack's environment region
  */
  readonly region?: string;

  /**
   * tags
   */
  readonly tags?: Record<string, string>;

}