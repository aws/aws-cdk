export namespace schema {

  /**
   * Current version of the manifest definition
   */
  export const CURRENT_VERSION = 'assets-1.0';

  /**
   * Definitions for the asset manifest
   */
  export interface ManifestFile {
    /**
     * Version of the manifest
     */
    readonly version: 'assets-1.0';

    /**
     * The assets in this manifest
     */
    readonly assets: Record<string, GenericAsset>;
  }

  export interface GenericAsset {
    /**
     * Type of the asset
     *
     * Files and container images are recognized by default, other asset types
     * depend on the tool that is interpreting the manifest.
     */
    readonly type: string;

    /**
     * Type-dependent description of the asset source
     */
    readonly source: any;

    /**
     * Type-dependent description of the asset destination
     */
    readonly destinations: Record<string, any>;
  }
}