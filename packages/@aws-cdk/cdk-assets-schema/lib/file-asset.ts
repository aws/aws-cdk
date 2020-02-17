/**
 * A file asset
 */
export interface FileAsset {
  /**
   * Source description for file assets
   */
  readonly source: FileSource;

  /**
   * Destinations for this file asset
   */
  readonly destinations: Record<string, FileDestination>;
}

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
  readonly region?: string;

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