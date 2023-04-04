/**
 * Common properties for asset metadata.
 */
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
   * The hash of the asset source.
   */
  readonly sourceHash: string;

  /**
   * Path on disk to the asset
   */
  readonly path: string;
}

/**
 * Metadata Entry spec for files.
 */
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

/**
 * Metadata Entry spec for stack tag.
 */
export interface Tag {
  /**
   * Tag key.
   *
   * (In the actual file on disk this will be cased as "Key", and the structure is
   * patched to match this structure upon loading:
   * https://github.com/aws/aws-cdk/blob/4aadaa779b48f35838cccd4e25107b2338f05547/packages/%40aws-cdk/cloud-assembly-schema/lib/manifest.ts#L137)
   */
  readonly key: string

  /**
   * Tag value.
   *
   * (In the actual file on disk this will be cased as "Value", and the structure is
   * patched to match this structure upon loading:
   * https://github.com/aws/aws-cdk/blob/4aadaa779b48f35838cccd4e25107b2338f05547/packages/%40aws-cdk/cloud-assembly-schema/lib/manifest.ts#L137)
   */
  readonly value: string
}

/**
 * Options for configuring the Docker cache backend
 */
export interface ContainerImageAssetCacheOption {
  /**
   * The type of cache to use.
   * Refer to https://docs.docker.com/build/cache/backends/ for full list of backends.
   * @default - unspecified
   *
   * @example 'registry'
   */
  readonly type: string;
  /**
   * Any parameters to pass into the docker cache backend configuration.
   * Refer to https://docs.docker.com/build/cache/backends/ for cache backend configuration.
   * @default {} No options provided
   *
   * @example { ref: `12345678.dkr.ecr.us-west-2.amazonaws.com/cache:${branch}`, mode: "max" }
   */
  readonly params?: { [key: string]: string };
}

/**
 * Metadata Entry spec for container images.
 */
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
   * Build secrets to pass to the `docker build` command
   *
   * @default no build secrets are passed
   */
  readonly buildSecrets?: { [key: string]: string };

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

  /**
   * Networking mode for the RUN commands during build.
   *
   * @default - no networking mode specified
   */
  readonly networkMode?: string;

  /**
   * Platform to build for. _Requires Docker Buildx_.
   *
   * @default - current machine platform
   */
  readonly platform?: string;

  /**
   * Outputs to pass to the `docker build` command.
   *
   * @default - no outputs are passed to the build command (default outputs are used)
   * @see https://docs.docker.com/engine/reference/commandline/build/#custom-build-outputs
   */
  readonly outputs?: string[];

  /**
   * Cache from options to pass to the `docker build` command.
   *
   * @default - no cache from options are passed to the build command
   * @see https://docs.docker.com/build/cache/backends/
   */
  readonly cacheFrom?: ContainerImageAssetCacheOption[];

  /**
   * Cache to options to pass to the `docker build` command.
   *
   * @default - no cache to options are passed to the build command
   * @see https://docs.docker.com/build/cache/backends/
   */
  readonly cacheTo?: ContainerImageAssetCacheOption;
}

/**
 * @see ArtifactMetadataEntryType.ASSET
 */
export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;

// Type aliases for metadata entries.
// Used simply to assign names to data types for more clarity.

/**
 * @see ArtifactMetadataEntryType.INFO
 * @see ArtifactMetadataEntryType.WARN
 * @see ArtifactMetadataEntryType.ERROR
 */
export type LogMessageMetadataEntry = string;

/**
 * @see ArtifactMetadataEntryType.LOGICAL_ID
 */
export type LogicalIdMetadataEntry = string;

/**
 * @see ArtifactMetadataEntryType.STACK_TAGS
 */
export type StackTagsMetadataEntry = Tag[];

/**
 * Union type for all metadata entries that might exist in the manifest.
 */
export type MetadataEntryData = AssetMetadataEntry | LogMessageMetadataEntry | LogicalIdMetadataEntry | StackTagsMetadataEntry;

/**
 * Type of artifact metadata entry.
 */
export enum ArtifactMetadataEntryType {
  /**
   * Asset in metadata.
   */
  ASSET = 'aws:cdk:asset',

  /**
   * Metadata key used to print INFO-level messages by the toolkit when an app is syntheized.
   */
  INFO = 'aws:cdk:info',

  /**
   * Metadata key used to print WARNING-level messages by the toolkit when an app is syntheized.
   */
  WARN = 'aws:cdk:warning',

  /**
   * Metadata key used to print ERROR-level messages by the toolkit when an app is syntheized.
   */
  ERROR = 'aws:cdk:error',

  /**
   * Represents the CloudFormation logical ID of a resource at a certain path.
   */
  LOGICAL_ID = 'aws:cdk:logicalId',

  /**
   * Represents tags of a stack.
   */
  STACK_TAGS = 'aws:cdk:stack-tags'
}

/**
 * A metadata entry in a cloud assembly artifact.
 */
export interface MetadataEntry {
  /**
   * The type of the metadata entry.
   */
  readonly type: string;

  /**
   * The data.
   *
   * @default - no data.
   */
  readonly data?: MetadataEntryData;

  /**
   * A stack trace for when the entry was created.
   *
   * @default - no trace.
   */
  readonly trace?: string[];
}
