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

  /**
   * Whether or not to enable cgo during go build
   *
   * This will set the CGO_ENABLED environment variable
   *
   * @default - false
   */
  readonly cgoEnabled?: boolean;
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
 *   // Run tests prior to bundling
 *   beforeBundling(inputDir: string, outputDir: string): string[] {
 *     return [`go test -mod=vendor ./...`];
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
   * Returns commands to run after bundling.
   *
   * Commands are chained with `&&`.
   */
  afterBundling(inputDir: string, outputDir: string): string[];
}
