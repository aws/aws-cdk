export const ASSET_METADATA = 'aws:cdk:asset';
export const ASSET_RESOURCE_PATH_METADATA = 'aws:asset:path';
export const ASSET_RESOURCE_PROPERTY_METADATA = 'aws:asset:property';

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
   * ECR Repository name and tag (separated by ":") where this asset is stored.
   */
  imageNameParameter: string;
}

export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;
