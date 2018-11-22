export const ASSET_METADATA = 'aws:cdk:asset';

export interface FileAssetMetadataEntry {
  /**
   * Requested packaging style
   */
  packaging: 'zip' | 'file';

  /**
   * Path on disk to the asset
   */
  path: string;

  /**
   * Logical identifier for the asset
   */
  id: string;

  /**
   * Name of parameter where S3 bucket should be passed in
   */
  s3BucketParameter: string;

  /**
   * Name of parameter where S3 key should be passed in
   */
  s3KeyParameter: string;
}

export interface ContainerImageAssetMetadataEntry {
  /**
   * Type of asset
   */
  packaging: 'container-image';

  /**
   * Path on disk to the asset
   */
  path: string;

  /**
   * Logical identifier for the asset
   */
  id: string;

  /**
   * Name of the parameter that takes the repository name
   */
  repositoryParameter: string;

  /**
   * Name of the parameter that takes the tag
   */
  tagParameter: string;
}

export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;