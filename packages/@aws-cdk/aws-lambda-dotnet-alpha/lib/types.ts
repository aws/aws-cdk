import * as cdk from 'aws-cdk-lib';

/**
 * Bundling options
 */
export interface BundlingOptions {
  /**
   * Environment variables defined when go runs.
   *
   * @default - no environment variables are defined.
   */
  readonly environment?: { [key: string]: string };

  /**
   * A custom bundling Docker image.
   *
   * @default - use the Docker image provided by @aws-cdk/aws-lambda-go
   */
  readonly dockerImage?: cdk.DockerImage;

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible.
   *
   * @default - false
   */
  readonly forcedDockerBundling?: boolean;

  /**
   * Build arguments to pass when building the bundling image.
   *
   * @default - no build arguments are passed
   */
  readonly buildArgs?: { [key: string]: string };

  /**
   * Determines how the asset hash is calculated. Assets will
   * get rebuilt and uploaded only if their hash has changed.
   *
   * If the asset hash is set to `OUTPUT` (default), the hash is calculated
   * after bundling. This means that any change in the output will cause
   * the asset to be invalidated and uploaded. Bear in mind that the
   * go binary that is output can be different depending on the environment
   * that it was compiled in. If you want to control when the output is changed
   * it is recommended that you use immutable build images such as
   * `public.ecr.aws/bitnami/golang:1.16.3-debian-10-r16`.
   *
   * If the asset hash is set to `SOURCE`, then only changes to the source
   * directory will cause the asset to rebuild. If your go project has multiple
   * Lambda functions this means that an update to any one function could cause
   * all the functions to be rebuilt and uploaded.
   *
   * @default - AssetHashType.OUTPUT. If `assetHash` is also specified,
   * the default is `CUSTOM`.
   */
  readonly assetHashType?: cdk.AssetHashType;

  /**
   * Specify a custom hash for this asset. If `assetHashType` is set it must
   * be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
   * be SHA256 hashed and encoded as hex. The resulting hash will be the asset
   * hash.
   *
   * NOTE: the hash is used in order to identify a specific revision of the asset, and
   * used for optimizing and caching deployment activities related to this asset such as
   * packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
   * need to make sure it is updated every time the asset changes, or otherwise it is
   * possible that some deployments will not be invalidated.
   *
   * @default - based on `assetHashType`
   */
  readonly assetHash?: string;

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
 * ```text
 * {
 *   // Run tests prior to bundling
 *   beforeBundling(inputDir: string, outputDir: string): string[] {
 *     return [`go test -mod=vendor ./...`];
 *   }
 *   // ...
 * }
 * ```
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
