/**
 * File with definitions for the interface between the Cloud Executable and the CDK toolkit.
 */

import { Artifact } from './artifacts';
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
export const PROTO_RESPONSE_VERSION = '0.19.0';

/**
 * The name of the root manifest file of the assembly.
 */
export const MANIFEST_FILE = 'manifest.json';

/**
 * The name of the root file with build instructions.
 */
export const BUILD_FILE = 'build.json';

export const OUTDIR_ENV = 'CDK_OUTDIR';
export const CONTEXT_ENV = 'CDK_CONTEXT_JSON';

/**
 * Represents a missing piece of context.
 */
export interface MissingContext {
  readonly provider: string;
  readonly props: {
    account?: string;
    region?: string;
    [key: string]: any;
  };
}

export interface AssemblyManifest {
  /**
   * Protocol version
   */
  readonly version: string;

  /**
   * The set of artifacts in this assembly.
   */
  readonly artifacts?: { [id: string]: Artifact };

  /**
   * Runtime information.
   */
  readonly runtime?: AppRuntime;
}

/**
 * @deprecated use `AssemblyManifest`
 */
export interface SynthesizeResponse extends AssemblyManifest {
  readonly stacks: SynthesizedStack[];
}

/**
 * A complete synthesized stack
 */
export interface SynthesizedStack {
  readonly name: string;
  readonly environment: Environment;
  readonly missing?: { [key: string]: MissingContext };
  readonly metadata: StackMetadata;
  readonly template: any;
  readonly autoDeploy?: boolean;

  /**
   * Other stacks this stack depends on
   */
  readonly dependsOn?: string[];
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
   */
  readonly data?: any;

  /**
   * A stack trace for when the entry was created.
   */
  readonly trace: string[];
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
  readonly libraries: { [name: string]: string };
}

/**
 * Context parameter for the default AWS account to use if a stack's environment is not set.
 */
export const DEFAULT_ACCOUNT_CONTEXT_KEY = 'aws:cdk:toolkit:default-account';

/**
 * Context parameter for the default AWS region to use if a stack's environment is not set.
 */
export const DEFAULT_REGION_CONTEXT_KEY = 'aws:cdk:toolkit:default-region';

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
 * Disables the emission of `cdk.out`
 */
export const DISABLE_LEGACY_MANIFEST_CONTEXT = 'aws:cdk:disable-legacy-manifest';

/**
 * The name of the pre 0.25.0 manifest file. Will only be emitted if
 * aws:cdk:disable-legacy-manifest is not defined.
 *
 * @deprecated Use `MANIFEST_FILE`
 */
export const OUTFILE_NAME = 'cdk.out';

/**
 * Disable the collection and reporting of version information.
 */
export const DISABLE_VERSION_REPORTING = 'aws:cdk:disable-version-reporting';
