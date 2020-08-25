import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { DockerBundler, Installer, LocalBundler, LockFile } from './bundlers';
import { PackageJsonManager } from './package-json-manager';
import { findUp } from './util';

/**
 * Base options for Parcel bundling
 */
export interface ParcelBaseOptions {
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
  readonly sourceMaps?: boolean;

  /**
   * The cache directory (relative to the project root)
   *
   * Parcel uses a filesystem cache for fast rebuilds.
   *
   * @default - `.parcel-cache` in the working directory
   */
  readonly cacheDir?: string;

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
   * Environment variables defined when Parcel runs.
   *
   * @default - no environment variables are defined.
   */
  readonly parcelEnvironment?: { [key: string]: string; };

  /**
   * A list of modules that should be considered as externals (already available
   * in the runtime).
   *
   * @default ['aws-sdk']
   */
  readonly externalModules?: string[];

  /**
   * A list of modules that should be installed instead of bundled. Modules are
   * installed in a Lambda compatible environnment.
   *
   * @default - all modules are bundled
   */
  readonly nodeModules?: string[];

  /**
   * The version of Parcel to use when running in a Docker container.
   *
   * @default - 2.0.0-beta.1
   */
  readonly parcelVersion?: string;

  /**
   * Build arguments to pass when building the bundling image.
   *
   * @default - no build arguments are passed
   */
  readonly buildArgs?: { [key:string] : string };

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible.This  is useful if your function relies on node modules
   * that should be installed (`nodeModules`) in a Lambda compatible
   * environment.
   *
   * @default false
   */
  readonly forceDockerBundling?: boolean;
}

/**
 * Options for Parcel bundling
 */
export interface ParcelOptions extends ParcelBaseOptions {
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
   * Parcel bundled Lambda asset code
   */
  public static parcel(options: ParcelOptions): lambda.AssetCode {
    // Find project root
    const projectRoot = options.projectRoot ?? findUp(`.git${path.sep}`);
    if (!projectRoot) {
      throw new Error('Cannot find project root. Please specify it with `projectRoot`.');
    }
    const relativeEntryPath = path.relative(projectRoot, path.resolve(options.entry));

    const packageJsonManager = new PackageJsonManager(path.dirname(options.entry));

    // Collect external and install modules
    let includeNodeModules: { [key: string]: boolean } | undefined;
    let dependencies: { [key: string]: string } | undefined;
    const externalModules = options.externalModules ?? ['aws-sdk'];
    if (externalModules || options.nodeModules) {
      const modules = [...externalModules, ...options.nodeModules ?? []];
      includeNodeModules = {};
      for (const mod of modules) {
        includeNodeModules[mod] = false;
      }
      if (options.nodeModules) {
        dependencies = packageJsonManager.getVersions(options.nodeModules);
      }
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

    // Configure target in package.json for Parcel
    packageJsonManager.update({
      targets: {
        'cdk-lambda': {
          context: 'node',
          includeNodeModules: includeNodeModules ?? true,
          sourceMap: options.sourceMaps ?? false,
          minify: options.minify ?? false,
          engines: {
            node: `>= ${runtimeVersion(options.runtime)}`,
          },
        },
      },
    });

    // Local
    let localBundler: cdk.ILocalBundling | undefined;
    if (!options.forceDockerBundling) {
      localBundler = new LocalBundler({
        projectRoot,
        relativeEntryPath,
        cacheDir: options.cacheDir,
        environment: options.parcelEnvironment,
        dependencies,
        installer,
        lockFile,
      });
    }

    // Docker
    const dockerBundler = new DockerBundler({
      runtime: options.runtime,
      relativeEntryPath,
      cacheDir: options.cacheDir,
      environment: options.parcelEnvironment,
      buildImage: !LocalBundler.runsLocally || options.forceDockerBundling,
      buildArgs: options.buildArgs,
      parcelVersion: options.parcelVersion,
      dependencies,
      installer,
      lockFile,
    });

    return lambda.Code.fromAsset(projectRoot, {
      assetHashType: cdk.AssetHashType.BUNDLE,
      bundling: {
        local: localBundler,
        ...dockerBundler.bundlingOptions,
      },
    });
  }
}

function runtimeVersion(runtime: lambda.Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return match[1];
}
