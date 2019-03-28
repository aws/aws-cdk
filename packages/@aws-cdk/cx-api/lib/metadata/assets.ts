export const ASSET_METADATA = 'aws:cdk:asset';

/**
 * If this is set in the context, the aws:asset:xxx metadata entries will not be
 * added to the template. This is used, for example, when we run integrationt
 * tests.
 */
export const ASSET_RESOURCE_METADATA_ENABLED_CONTEXT = 'aws:cdk:enable-asset-metadata';

/**
 * Metadata added to the CloudFormation template entries that map local assets
 * to resources.
 */
export const ASSET_RESOURCE_METADATA_PATH_KEY = 'aws:asset:path';
export const ASSET_RESOURCE_METADATA_PROPERTY_KEY = 'aws:asset:property';

/**
 * Separator string that separates the prefix separator from the object key separator.
 *
 * Asset keys will look like:
 *
 *    /assets/MyConstruct12345678/||abcdef12345.zip
 *
 * This allows us to encode both the prefix and the full location in a single
 * CloudFormation Template Parameter.
 */
export const ASSET_PREFIX_SEPARATOR = '||';

export interface FileAssetMetadataEntry {
  /**
   * Requested packaging style
   */
  readonly packaging: 'zip' | 'file';

  /**
   * Path on disk to the asset
   */
  readonly path: string;

  /**
   * Logical identifier for the asset
   */
  readonly id: string;

  /**
   * Name of parameter where S3 bucket should be passed in
   */
  readonly s3BucketParameter: string;

  /**
   * Name of parameter where S3 key should be passed in
   */
  readonly s3KeyParameter: string;
}

export interface ContainerImageAssetMetadataEntry {
  /**
   * Type of asset
   */
  readonly packaging: 'container-image';

  /**
   * Path on disk to the asset
   */
  readonly path: string;

  /**
   * Logical identifier for the asset
   */
  readonly id: string;

  /**
   * ECR Repository name and tag (separated by ":") where this asset is stored.
   */
  readonly imageNameParameter: string;

  /**
   * ECR repository name, if omitted a default name based on the asset's
   * ID is used instead. Specify this property if you need to statically
   * address the image, e.g. from a Kubernetes Pod.
   * Note, this is only the repository name, without the registry and
   * the tag parts.
   *
   * * @default automatically derived from the asset's ID.
   */
  readonly repositoryName?: string;
}

export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;
