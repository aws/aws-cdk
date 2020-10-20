import { AssetHashType, BundlingDockerImage } from '@aws-cdk/core';

/**
 * Bundling options
 */
export interface BundlingOptions {
  /**
   * Environment variables defined when go runs.
   *
   * @default - no environment variables are defined.
   */
  readonly environment?: { [key: string]: string; };

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible.
   *
   * @default - false
   */
  readonly forcedDockerBundling?: boolean;

  /**
   * A custom bundling Docker image.
   *
   * @default - use the Docker image provided by @aws-cdk/aws-lambda-golang
   */
  readonly dockerImage?: BundlingDockerImage;

  /**
   * List of additional flags to use while building.
   *
   * For example:
   * ['ldflags "-s -w"']
   *
   * @default - none
   */
  readonly goBuildFlags?: string[];

  /**
   * Build arguments to pass when building the bundling image.
   *
   * @default - no build arguments are passed
   */
  readonly buildArgs?: { [key:string] : string };

  /**
   * Set the asset hash type of the function
   *
   * @default - AssetHashType.SOURCE
   */
  readonly assetHashType?: AssetHashType

  /**
   * Command hooks
   *
   * @default - do not run additional commands
   */
  readonly commandHooks?: ICommandHooks;
}

/**
 * Command hooks
 *
 * These commands will run in the environment in which bundling occurs: inside
 * the container for Docker bundling or on the host OS for local bundling.
 *
 * Commands are chained with `&&`.
 *
 * @example
 * {
 *   // Copy a file from the input directory to the output directory
 *   // to include it in the bundled asset
 *   afterBundling(inputDir: string, outputDir: string): string[] {
 *     return [`cp ${inputDir}/my-binary.node ${outputDir}`];
 *   }
 *   // ...
 * }
 */
export interface ICommandHooks {
  /**
   * Returns commands to run before bundling.
   *
   * Commands are chained with `&&`.
   */
  beforeBundling(inputDir: string, outputDir: string): string[];

  /**
   * Returns commands to run before installing node modules.
   *
   * This hook only runs when node modules are installed.
   *
   * Commands are chained with `&&`.
   */
  beforeInstall(inputDir: string, outputDir: string): string[];

  /**
   * Returns commands to run after bundling.
   *
   * Commands are chained with `&&`.
   */
  afterBundling(inputDir: string, outputDir: string): string[];
}
