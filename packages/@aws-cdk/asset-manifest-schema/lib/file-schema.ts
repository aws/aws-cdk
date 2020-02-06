import { DockerImageAsset } from "./docker-image-asset";
import { FileAsset } from "./file-asset";

// These structs are exposed publicly since doing so makes them checked for backwards compatibility
// by the jsii-diff tool.

/**
 * Definitions for the asset manifest
 */
export interface ManifestFile {
  /**
   * Version of the manifest
   */
  readonly version: string;

  /**
   * The file assets in this manifest
   */
  readonly files: Record<string, FileAsset>;

  /**
   * The Docker image assets in this manifest
   */
  readonly dockerImages: Record<string, DockerImageAsset>;
}