import { DestinationIdentifier, ManifestEntry } from './asset-manifest';
import { expectKey } from './private/schema-helpers';

const DOCKER_IMAGE_ASSET_TYPE = 'docker-image';

/**
 * A manifest entry for a file asset
 */
export interface DockerImageManifestEntry {
  /**
   * Identifier for this asset
   */
  readonly id: DestinationIdentifier;

  /**
   * Type of this manifest entry
   */
  readonly type: 'file';

  /**
   * Source of the file asset
   */
  readonly source: DockerImageSource;

  /**
   * Destination for the file asset
   */
  readonly destination: DockerImageDestination;
}

/**
 * Return whether the given manifest entry is for a docker image asset
 *
 * Will throw if the manifest entry is for a file asset but malformed.
 *
 * @internal Internal so it's only exposed via the StandardManifestEntries class, but the
 * implementation can live close to the data types it's describing.
 */
export function isDockerImageEntry(entry: ManifestEntry): entry is DockerImageManifestEntry {
  if (entry.type !== DOCKER_IMAGE_ASSET_TYPE) { return false; }

  expectKey(entry.source, 'directory', 'string');
  expectKey(entry.source, 'dockerFile', 'string', true);
  expectKey(entry.source, 'dockerBuildTarget', 'string', true);
  expectKey(entry.source, 'dockerBuildArgs', 'object', true);
  for (const value of Object.values(entry.source.dockerBuildArgs || {})) {
    if (typeof value !== 'string') {
      throw new Error(`All elements of 'dockerBuildArgs' should be strings, got: '${value}'`);
    }
  }

  expectKey(entry.destination, 'region', 'string', true);
  expectKey(entry.destination, 'assumeRoleArn', 'string', true);
  expectKey(entry.destination, 'assumeRoleExternalId', 'string', true);
  expectKey(entry.destination, 'repositoryName', 'string');
  expectKey(entry.destination, 'imageTag', 'string');
  expectKey(entry.destination, 'imageUri', 'string');

  return true;
}
