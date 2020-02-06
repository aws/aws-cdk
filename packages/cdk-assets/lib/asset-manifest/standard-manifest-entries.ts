import { ManifestEntry } from "./asset-manifest";
import { DockerImageManifestEntry, isDockerImageEntry } from "./docker-entry";
import { FileManifestEntry, isFileEntry } from "./file-entry";

/**
 * Static class so that this is accessible via JSII
 */
export class StandardManifestEntries {
  /**
   * Return whether the given manifest entry is for a file asset
   *
   * Will throw if the manifest entry is for a file asset but malformed.
   */
  public static isFileEntry(entry: ManifestEntry): entry is FileManifestEntry {
    return isFileEntry(entry);
  }

  /**
   * Return whether the given manifest entry is for a docker image asset
   *
   * Will throw if the manifest entry is for a file asset but malformed.
   */
  public static isDockerImageEntry(entry: ManifestEntry): entry is DockerImageManifestEntry {
    return isDockerImageEntry(entry);
  }
}
