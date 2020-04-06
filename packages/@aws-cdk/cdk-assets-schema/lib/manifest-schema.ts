import { DockerImageAsset } from './docker-image-asset';
import { FileAsset } from './file-asset';

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
   *
   * @default - No files
   */
  readonly files?: Record<string, FileAsset>;

  /**
   * The Docker image assets in this manifest
   *
   * @default - No Docker images
   */
  readonly dockerImages?: Record<string, DockerImageAsset>;
}