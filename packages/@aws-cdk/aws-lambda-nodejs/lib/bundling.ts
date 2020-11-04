import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { DockerBundler, Installer, LocalBundler, LockFile } from './bundlers';
import { PackageJsonManager } from './package-json-manager';
import { findUp } from './util';

/**
 * Base options for esbuild bundling
 */
export interface EsBuildBaseOptions {
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
   * @default es2017
   */
  readonly target?: string;

  /**
   * The root of the project. This will be used as the source for the volume
   * mounted in the Docker container. If you specify this prop, ensure that
   * this path includes `entry` and any module/dependencies used by your
   * function otherwise bundling will not be possible.
   *
   * @default - the closest path containing a .git folder
   */
  readonly projectRoot?: string;

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
   * @default - latest 0
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
  readonly bundlingDockerImage?: cdk.BundlingDockerImage;
}

/**
 * Options for esbuild bundling
 */
export interface EsBuildOptions extends EsBuildBaseOptions {
  /**
   * Entry file
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;
}

/**
 * Bundling
 */
export class Bundling {
  /**
   * esbuild bundled Lambda asset code
   */
  public static esbuild(options: EsBuildOptions): lambda.AssetCode {
    // Find project root
    const projectRoot = options.projectRoot
      ?? findUp(`.git${path.sep}`)
      ?? findUp(LockFile.YARN)
      ?? findUp(LockFile.NPM)
      ?? findUp('package.json');
    if (!projectRoot) {
      throw new Error('Cannot find project root. Please specify it with `projectRoot`.');
    }
    const relativeEntryPath = path.relative(projectRoot, path.resolve(options.entry));

    const packageJsonManager = new PackageJsonManager(path.dirname(options.entry));

    // Collect external and install modules
    let dependencies: { [key: string]: string } | undefined;
    let externals = options.externalModules ?? ['aws-sdk'];
    if (options.nodeModules) {
      externals = [...externals, ...options.nodeModules];
      dependencies = packageJsonManager.getVersions(options.nodeModules);
    }

    let installer = Installer.NPM;
    let lockFile: LockFile | undefined;
    if (dependencies) {
      // Use npm unless we have a yarn.lock.
      if (fs.existsSync(path.join(projectRoot, LockFile.YARN))) {
        installer = Installer.YARN;
        lockFile = LockFile.YARN;
      } else if (fs.existsSync(path.join(projectRoot, LockFile.NPM))) {
        lockFile = LockFile.NPM;
      }
    }

    // Local
    let localBundler: cdk.ILocalBundling | undefined;
    if (!options.forceDockerBundling) {
      localBundler = new LocalBundler({
        ...options,
        projectRoot,
        relativeEntryPath,
        dependencies,
        externals,
        installer,
        lockFile,
      });
    }

    // Docker
    const dockerBundler = new DockerBundler({
      ...options,
      relativeEntryPath,
      buildImage: !LocalBundler.runsLocally || options.forceDockerBundling, // build image only if we can't run locally
      dependencies,
      externals,
      installer,
      lockFile,
    });

    return lambda.Code.fromAsset(projectRoot, {
      assetHashType: cdk.AssetHashType.OUTPUT,
      bundling: {
        local: localBundler,
        ...dockerBundler.bundlingOptions,
      },
    });
  }
}
