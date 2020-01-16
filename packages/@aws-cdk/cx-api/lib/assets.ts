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

interface BaseAssetMetadataEntry {
  /**
   * Requested packaging style
   */
  readonly packaging: string;

  /**
   * Logical identifier for the asset
   */
  readonly id: string;

  /**
   * The hash of the source directory used to build the asset.
   */
  readonly sourceHash: string;

  /**
   * Path on disk to the asset
   */
  readonly path: string;

}

export interface FileAssetMetadataEntry extends BaseAssetMetadataEntry {
  /**
   * Requested packaging style
   */
  readonly packaging: 'zip' | 'file';

  /**
   * Name of parameter where S3 bucket should be passed in
   */
  readonly s3BucketParameter: string;

  /**
   * Name of parameter where S3 key should be passed in
   */
  readonly s3KeyParameter: string;

  /**
   * The name of the parameter where the hash of the bundled asset should be passed in.
   */
  readonly artifactHashParameter: string;
}

export interface ContainerImageAssetMetadataEntry extends BaseAssetMetadataEntry {
  /**
   * Type of asset
   */
  readonly packaging: 'container-image';

  /**
   * ECR Repository name and repo digest (separated by "@sha256:") where this
   * image is stored.
   *
   * @default undefined If not specified, `repositoryName` and `imageTag` are
   * required because otherwise how will the stack know where to find the asset,
   * ha?
   * @deprecated specify `repositoryName` and `imageTag` instead, and then you
   * know where the image will go.
   */
  readonly imageNameParameter?: string;

  /**
   * ECR repository name, if omitted a default name based on the asset's ID is
   * used instead. Specify this property if you need to statically address the
   * image, e.g. from a Kubernetes Pod. Note, this is only the repository name,
   * without the registry and the tag parts.
   *
   * @default - this parameter is REQUIRED after 1.21.0
   */
  readonly repositoryName?: string;

  /**
   * The docker image tag to use for tagging pushed images. This field is
   * required if `imageParameterName` is ommited (otherwise, the app won't be
   * able to find the image).
   *
   * @default - this parameter is REQUIRED after 1.21.0
   */
  readonly imageTag?: string;

  /**
   * Build args to pass to the `docker build` command
   *
   * @default no build args are passed
   */
  readonly buildArgs?: { [key: string]: string };

  /**
   * Docker target to build to
   *
   * @default no build target
   */
  readonly target?: string;

  /**
   * Path to the Dockerfile (relative to the directory).
   *
   * @default - no file is passed
   */
  readonly file?: string;

}

export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;
