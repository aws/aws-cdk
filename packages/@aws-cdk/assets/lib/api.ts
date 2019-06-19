/**
 * Common interface for all assets.
 */
export interface IAsset {
  /**
   * A hash of the source of this asset, which is available at construction time. As this is a plain
   * string, it can be used in construct IDs in order to enforce creation of a new resource when
   * the content hash has changed.
   */
  readonly sourceHash: string;

  /**
   * A hash of the bundle for of this asset, which is only available at deployment time. As this is
   * a late-bound token, it may not be used in construct IDs, but can be passed as a resource
   * property in order to force a change on a resource when an asset is effectively updated. This is
   * more reliable than `sourceHash` in particular for assets which bundling phase involve external
   * resources that can change over time (such as Docker image builds).
   */
  readonly artifactHash: string;
}
