import { AwsDestination } from './aws-destination';

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
  readonly destinations: { [id: string]: FileDestination };
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
   *
   * This path is relative to the asset manifest location.
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
export interface FileDestination extends AwsDestination {
  /**
   * The name of the bucket
   */
  readonly bucketName: string;

  /**
   * The destination object key
   */
  readonly objectKey: string;
}