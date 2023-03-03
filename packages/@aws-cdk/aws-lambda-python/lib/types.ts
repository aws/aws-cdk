import { AssetHashType, BundlingFileAccess, DockerImage, DockerRunOptions } from '@aws-cdk/core';


/**
 * Options for bundling
 */
export interface BundlingOptions extends DockerRunOptions {

  /**
   * Whether to export Poetry dependencies with hashes. Note that this can cause builds to fail if not all dependencies
   * export with a hash.
   *
   * @see https://github.com/aws/aws-cdk/issues/19232
   * @default Hashes are NOT included in the exported `requirements.txt` file
   */
  readonly poetryIncludeHashes?: boolean;

  /**
 * List of file patterns to exclude when copying assets from source for bundling.
 *
 * @default - Empty list
 */
  readonly assetExcludes?: string[];

  /**
   * Output path suffix: the suffix for the directory into which the bundled output is written.
   *
   * @default - 'python' for a layer, empty string otherwise.
   */
  readonly outputPathSuffix?: string;

  /**
   * Docker image to use for bundling. If no options are provided, the default bundling image
   * will be used. Dependencies will be installed using the default packaging commands
   * and copied over from into the Lambda asset.
   *
   * @default - Default bundling image.
   */
  readonly image?: DockerImage;

  /**
   * Optional build arguments to pass to the default container. This can be used to customize
   * the index URLs used for installing dependencies.
   * This is not used if a custom image is provided.
   *
   * @default - No build arguments.
   */
  readonly buildArgs?: { [key: string]: string };

  /**
   * Determines how asset hash is calculated. Assets will get rebuild and
   * uploaded only if their hash has changed.
   *
   * If asset hash is set to `SOURCE` (default), then only changes to the source
   * directory will cause the asset to rebuild. This means, for example, that in
   * order to pick up a new dependency version, a change must be made to the
   * source tree. Ideally, this can be implemented by including a dependency
   * lockfile in your source tree or using fixed dependencies.
   *
   * If the asset hash is set to `OUTPUT`, the hash is calculated after
   * bundling. This means that any change in the output will cause the asset to
   * be invalidated and uploaded. Bear in mind that `pip` adds timestamps to
   * dependencies it installs, which implies that in this mode Python bundles
   * will _always_ get rebuild and uploaded. Normally this is an anti-pattern
   * since build
   *
   * @default AssetHashType.SOURCE By default, hash is calculated based on the
   * contents of the source directory. This means that only updates to the
   * source will cause the asset to rebuild.
   */

  readonly assetHashType?: AssetHashType;

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
   * @default - Based on `assetHashType`
   */
  readonly assetHash?: string;

  /**
   * Command hooks
   *
   * @default - do not run additional commands
   */
  readonly commandHooks?: ICommandHooks;

  /**
   * Which option to use to copy the source files to the docker container and output files back
   * @default - BundlingFileAccess.BIND_MOUNT
   */
  readonly bundlingFileAccess?: BundlingFileAccess;
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
 *     return [`pytest`];
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
