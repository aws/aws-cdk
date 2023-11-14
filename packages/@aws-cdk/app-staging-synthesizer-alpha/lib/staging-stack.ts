import { DockerImageAssetSource, FileAssetSource, Stack } from 'aws-cdk-lib/core';
import { IConstruct } from 'constructs';

/**
 * Information returned by the Staging Stack for each file asset.
 */
export interface FileStagingLocation {
  /**
   * The name of the staging bucket
   */
  readonly bucketName: string;

  /**
   * A prefix to add to the keys
   *
   * @default ''
   */
  readonly prefix?: string;

  /**
   * The ARN to assume to write files to this bucket
   *
   * @default - Don't assume a role
   */
  readonly assumeRoleArn?: string;

  /**
   * The stack that creates this bucket (leads to dependencies on it)
   *
   * @default - Don't add dependencies
   */
  readonly dependencyStack?: Stack;
}

/**
 * Information returned by the Staging Stack for each image asset
 */
export interface ImageStagingLocation {
  /**
   * The name of the staging repository
   */
  readonly repoName: string;

  /**
   * The arn to assume to write files to this repository
   *
   * @default - Don't assume a role
   */
  readonly assumeRoleArn?: string;

  /**
   * The stack that creates this repository (leads to dependencies on it)
   *
   * @default - Don't add dependencies
   */
  readonly dependencyStack?: Stack;
}

/**
 * Staging Resource interface.
 */
export interface IStagingResources extends IConstruct {
  /**
   * Return staging resource information for a file asset.
   */
  addFile(asset: FileAssetSource): FileStagingLocation;

  /**
   * Return staging resource information for a docker asset.
   */
  addDockerImage(asset: DockerImageAssetSource): ImageStagingLocation;
}

/**
 * Staging Resource Factory interface.
 *
 * The function included in this class will be called by the synthesizer
 * to create or reference an IStagingResources construct that has the necessary
 * staging resources for the stack.
 */
export interface IStagingResourcesFactory {
  /**
   * Return an object that will manage staging resources for the given stack
   *
   * This is called whenever the the `AppStagingSynthesizer` binds to a specific
   * stack, and allows selecting where the staging resources go.
   *
   * This method can choose to either create a new construct (perhaps a stack)
   * and return it, or reference an existing construct.
   *
   * @param stack - stack to return an appropriate IStagingStack for
   */
  obtainStagingResources(stack: Stack, context: ObtainStagingResourcesContext): IStagingResources;
}

/**
 * Context parameters for the 'obtainStagingResources' function
 */
export interface ObtainStagingResourcesContext {
  /**
   * A unique string describing the environment that is guaranteed not to have tokens in it
   */
  readonly environmentString: string;

  /**
   * The ARN of the deploy action role, if given
   *
   * This role will need permissions to read from to the staging resources.
   *
   * @default - Deploy role ARN is unknown
   */
  readonly deployRoleArn?: string;

  /**
   * The qualifier passed to the synthesizer
   *
   * The staging stack shouldn't need this, but it might.
   */
  readonly qualifier: string;
}
