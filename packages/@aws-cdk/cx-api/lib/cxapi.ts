/**
 * File with definitions for the interface between the Cloud Executable and the CDK toolkit.
 */

import { Environment } from './environment';

/**
 * Bump this to the library version if and only if the CX protocol changes.
 *
 * We could also have used 1, 2, 3, ... here to indicate protocol versions, but
 * those then still need to be mapped to software versions to be useful. So we
 * might as well use the software version as protocol version and immediately
 * generate a useful error message from this.
 *
 * Note the following:
 *
 * - The versions are not compared in a semver way, they are used as
 *    opaque ordered tokens.
 * - The version needs to be set to the NEXT releasable version when it's
 *   updated (as the current verison in package.json has already been released!)
 * - The request does not have versioning yet, only the response.
 */
export const PROTO_RESPONSE_VERSION = '0.14.0';

export const OUTFILE_NAME = 'cdk.out';
export const OUTDIR_ENV = 'CDK_OUTDIR';
export const CONTEXT_ENV = 'CDK_CONTEXT_JSON';

/**
 * Represents a missing piece of context.
 */
export interface MissingContext {
  provider: string;
  props: {
    account?: string;
    region?: string;
    [key: string]: any;
  };
}

export interface SynthesizeResponse {
  /**
   * Protocol version
   */
  version: string;
  stacks: SynthesizedStack[];
  runtime?: AppRuntime;
}

/**
 * A complete synthesized stack
 */
export interface SynthesizedStack {
  name: string;
  environment: Environment;
  missing?: { [key: string]: MissingContext };
  metadata: StackMetadata;
  template: any;
}

/**
 * An metadata entry in the construct.
 */
export interface MetadataEntry {
  /**
   * The type of the metadata entry.
   */
  type: string;

  /**
   * The data.
   */
  data?: any;

  /**
   * A stack trace for when the entry was created.
   */
  trace: string[];
}

/**
 * Metadata associated with the objects in the stack's Construct tree
 */
export type StackMetadata = { [path: string]: MetadataEntry[] };

/**
 * Information about the application's runtime components.
 */
export interface AppRuntime {
  /**
   * The list of libraries loaded in the application, associated with their versions.
   */
  libraries: { [name: string]: string };
}

/**
 * Context parameter for the default AWS account to use if a stack's environment is not set.
 */
export const DEFAULT_ACCOUNT_CONTEXT_KEY = 'aws:cdk:toolkit:default-account';

/**
 * Context parameter for the default AWS region to use if a stack's environment is not set.
 */
export const DEFAULT_REGION_CONTEXT_KEY = 'aws:cdk:toolkit:default-region';

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

/**
 * Metadata key used to print INFO-level messages by the toolkit when an app is syntheized.
 */
export const INFO_METADATA_KEY = 'aws:cdk:info';

/**
 * Metadata key used to print WARNING-level messages by the toolkit when an app is syntheized.
 */
export const WARNING_METADATA_KEY = 'aws:cdk:warning';

/**
 * Metadata key used to print ERROR-level messages by the toolkit when an app is syntheized.
 */
export const ERROR_METADATA_KEY = 'aws:cdk:error';

/**
 * The key used when CDK path is embedded in **CloudFormation template**
 * metadata.
 */
export const PATH_METADATA_KEY = 'aws:cdk:path';

/**
 * Enables the embedding of the "aws:cdk:path" in CloudFormation template metadata.
 */
export const PATH_METADATA_ENABLE_CONTEXT = 'aws:cdk:enable-path-metadata';

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
