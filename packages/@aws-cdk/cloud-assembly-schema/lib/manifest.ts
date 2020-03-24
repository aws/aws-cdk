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

/**
 * Metadata Entry spec for stack tag.
 */
export interface Tag {
  /**
   * Tag key.
   */
  readonly key: string

  /**
   * Tag value.
   */
  readonly value: string
}

/**
 * @see ArtifactMetadataEntryType.ASSET
 */
export type AssetMetadataEntry = FileAssetMetadataEntry | ContainerImageAssetMetadataEntry;

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
   * Tag metadata key.
   */
  STACK_TAGS = 'aws:cdk:stack-tags'
}

/**
 * Type of cloud artifact.
 */
export enum ArtifactType {
  /**
   * Stub required because of JSII.
   */
  NONE = 'none', // required due to a jsii bug

  /**
   * The artifact is an AWS CloudFormation stack.
   */
  AWS_CLOUDFORMATION_STACK = 'aws:cloudformation:stack',

  /**
   * The artifact contains metadata generated out of the CDK application.
   */
  CDK_TREE = 'cdk:tree',
}

/**
 * An metadata entry in the construct.
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

/**
 * Information about the application's runtime components.
 */
export interface RuntimeInfo {
  /**
   * The list of libraries loaded in the application, associated with their versions.
   */
  readonly libraries: { [name: string]: string };
}

/**
 * Represents a missing piece of context.
 */
export interface MissingContext {
  /**
   * The missing context key.
   */
  readonly key: string;

  /**
   * The provider from which we expect this context key to be obtained.
   */
  readonly provider: string;

  /**
   * A set of provider-specific options.
   */
  readonly props: {
    account?: string;
    region?: string;
    [key: string]: any;
  };
}

/**
 * A manifest for a single artifact within the cloud assembly.
 */
export interface ArtifactManifest {
  /**
   * The type of artifact.
   */
  readonly type: ArtifactType;

  /**
   * The environment into which this artifact is deployed.
   *
   * @default - no envrionment.
   */
  readonly environment?: string; // format: aws://account/region

  /**
   * Associated metadata.
   *
   * @default - no metadata.
   */
  readonly metadata?: { [path: string]: MetadataEntry[] };

  /**
   * IDs of artifacts that must be deployed before this artifact.
   *
   * @default - no dependencies.
   */
  readonly dependencies?: string[];

  /**
   * The set of properties for this artifact (depends on type)
   *
   * @default - no properties.
   */
  readonly properties?: { [name: string]: any };
}

/**
 * A manifest which describes the cloud assembly.
 */
export interface AssemblyManifest {
  /**
   * Protocol version
   */
  readonly version: string;

  /**
   * The set of artifacts in this assembly.
   *
   * @default - no artifacts.
   */
  readonly artifacts?: { [id: string]: ArtifactManifest };

  /**
   * Missing context information. If this field has values, it means that the
   * cloud assembly is not complete and should not be deployed.
   *
   * @default - no missing context.
   */
  readonly missing?: MissingContext[];

  /**
   * Runtime information.
   *
   * @default - no info.
   */
  readonly runtime?: RuntimeInfo;
}
