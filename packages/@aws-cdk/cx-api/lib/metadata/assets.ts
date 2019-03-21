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

  /**
   * ECR repository name, if omitted a default name based on the asset's
   * ID is used instead. Specify this property if you need to statically
   * address the image, e.g. from a Kubernetes Pod.
   * Note, this is only the repository name, without the registry and
   * the tag parts.
   *
   * * @default automatically derived from the asset's ID.
   */
  repositoryName?: string;

  /**
   * Image tag within ECR repository.
   *
   * @default tag image with tag calculated by CDK.
   */
  imageTag?: string;

  /**
   * Whether to allow image layer caching while building the image.
   * If set to `false` layer chaching is deactivated, neither local (`--no-cache`)
   * nor remote (`--cache-from`) cache is used. If set to `true` remote cache will
   * be used if `imageTag` is defined and local cache will be enabled.
   *
   * If in doubt do not set this property and use the default behavior, with defaults
   * to Docker's default behavior and usually is a good trade of between correctness
   * and speed. Use `false` if you want to ensure correnctness and reproducable builds
   * and use `true` only if build speed is more important than reproducability.
   *
   * @default If not set, the default local layer caching of the docker daemon
   *          is enabled, but `--cache-from` is not used.
   */
  allowLayerCaching?: boolean;
}

export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;
