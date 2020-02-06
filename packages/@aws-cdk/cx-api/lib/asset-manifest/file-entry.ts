import { DestinationIdentifier, ManifestEntry } from './asset-manifest';
import { expectKey } from './private/schema-helpers';

export const FILE_ASSET_TYPE = 'file';

/**
 * Packaging strategy for file assets
 */
export enum FileAssetPackaging {
  /**
   * Upload the given path as a file
   */
  FILE = 'file',

  /**
   * The given path is a directory, zip it and upload
   */
  ZIP_DIRECTORY = 'zip',
}

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
 * Describe the source of a file asset
 */
export interface FileSource {
  /**
   * The filesystem object to upload
   */
  readonly path: string;

  /**
   * Packaging method
   *
   * @default FILE
   */
  readonly packaging?: FileAssetPackaging;
}

/**
 * Where in S3 a file asset needs to be published
 */
export interface FileDestination {
  /**
   * The region where this asset will need to be published
   */
  readonly region: string;

  /**
   * The role that needs to be assumed while publishing this asset
   *
   * @default - No role will be assumed
   */
  readonly assumeRoleArn?: string;

  /**
   * The ExternalId that needs to be supplied while assuming this role
   *
   * @default - No ExternalId will be supplied
   */
  readonly assumeRoleExternalId?: string;

  /**
   * The name of the bucket
   */
  readonly bucketName: string;

  /**
   * The destination object key
   */
  readonly objectKey: string;
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
