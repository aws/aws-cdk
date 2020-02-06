import { DestinationIdentifier, ManifestEntry } from './asset-manifest';
import { expectKey } from './private/schema-helpers';

export const FILE_ASSET_TYPE = 'file';

/**
 * A manifest entry for a file asset
 */
export interface FileManifestEntry {
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
  readonly source: FileSource;

  /**
   * Destination for the file asset
   */
  readonly destination: FileDestination;
}

/**
 * Return whether the given manifest entry is for a file asset
 *
 * Will throw if the manifest entry is for a file asset but malformed.
 *
 * @internal Internal so it's only exposed via the StandardManifestEntries class, but the
 * implementation can live close to the data types it's describing.
 */
export function isFileEntry(entry: ManifestEntry): entry is FileManifestEntry {
  if (entry.type !== FILE_ASSET_TYPE) { return false; }

  expectKey(entry.source, 'path', 'string');
  expectKey(entry.source, 'packaging', 'string', true);
  expectKey(entry.destination, 'region', 'string', true);
  expectKey(entry.destination, 'assumeRoleArn', 'string', true);
  expectKey(entry.destination, 'assumeRoleExternalId', 'string', true);
  expectKey(entry.destination, 'bucketName', 'string');
  expectKey(entry.destination, 'objectKey', 'string');

  return true;
}
