import { BundlingDockerImage } from '@aws-cdk/core';

/**
 * Bundling options
 */
export interface BundlingOptions {
  /**
   * Whether to minify files when bundling.
   *
   * @default false
   */
  readonly minify?: boolean;

  /**
   * Whether to include source maps when bundling.
   *
   * @default false
   */
  readonly sourceMap?: boolean;

  /**
   * Target environment for the generated JavaScript code.
   *
   * @see https://esbuild.github.io/api/#target
   *
   * @default - the node version of the runtime
   */
  readonly target?: string;

  /**
   * Use loaders to change how a given input file is interpreted.
   *
   * Configuring a loader for a given file type lets you load that file type with
   * an `import` statement or a `require` call.
   *
   * @see https://esbuild.github.io/api/#loader
   *
   * @default - use esbuild default loaders
   */
  readonly loaders?: EsBuildLoader[];

  /**
   * Environment variables defined when bundling runs.
   *
   * @default - no environment variables are defined.
   */
  readonly bundlingEnvironment?: { [key: string]: string; };

  /**
   * A list of modules that should be considered as externals (already available
   * in the runtime).
   *
   * @default ['aws-sdk']
   */
  readonly externalModules?: string[];

  /**
   * A list of modules that should be installed instead of bundled. Modules are
   * installed in a Lambda compatible environnment only when bundling runs in
   * Docker.
   *
   * @default - all modules are bundled
   */
  readonly nodeModules?: string[];

  /**
   * The version of esbuild to use when running in a Docker container.
   *
   * @default - latest v0
   */
  readonly esbuildVersion?: string;

  /**
   * Build arguments to pass when building the bundling image.
   *
   * @default - no build arguments are passed
   */
  readonly buildArgs?: { [key:string] : string };

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible. This is useful if your function relies on node modules
   * that should be installed (`nodeModules`) in a Lambda compatible
   * environment.
   *
   * @default false
   */
  readonly forceDockerBundling?: boolean;

  /**
   * A custom bundling Docker image.
   *
   * This image should have esbuild installed globally. If you plan to use `nodeModules`
   * it should also have `npm` or `yarn` depending on the lock file you're using.
   *
   * See https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-lambda-nodejs/lib/Dockerfile
   * for the default image provided by @aws-cdk/aws-lambda-nodejs.
   *
   * @default - use the Docker image provided by @aws-cdk/aws-lambda-nodejs
   */
  readonly bundlingDockerImage?: BundlingDockerImage;
}

/**
 * An esbuild loader.
 *
 * Configuring a loader for a given file type lets you load that file type with
 * an `import` statement or a `require` call.
 *
 * @see https://esbuild.github.io/api/#loader
 */
export interface EsBuildLoader {
  /**
   * The file extension
   *
   * @example .png
   */
  readonly extension: string;

  /**
   * The name of the loader
   *
   * @example dataurl
   */
  readonly name: string;
}
