import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
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
   * The cache directory
   *
   * Parcel uses a filesystem cache for fast rebuilds.
   *
   * @default - `.cache` in the root directory
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
   * The version of Parcel to use.
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

    // Bundling image derived from runtime bundling image (lambci)
    const image = cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../parcel'), {
      buildArgs: {
        ...options.buildArgs ?? {},
        IMAGE: options.runtime.bundlingDockerImage.image,
        PARCEL_VERSION: options.parcelVersion ?? '2.0.0-beta.1',
      },
    });

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

    // Configure target in package.json for Parcel
    packageJsonManager.update({
      'cdk-lambda': `${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/index.js`,
      'targets': {
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

    // Entry file path relative to container path
    const containerEntryPath = path.join(cdk.AssetStaging.BUNDLING_INPUT_DIR, path.relative(projectRoot, path.resolve(options.entry)));
    const parcelCommand = [
      '$(node -p "require.resolve(\'parcel\')")', // Parcel is not globally installed, find its "bin"
      'build', containerEntryPath.replace(/\\/g, '/'), // Always use POSIX paths in the container
      '--target', 'cdk-lambda',
      '--no-autoinstall',
      '--no-scope-hoist',
      ...options.cacheDir
        ? ['--cache-dir', '/parcel-cache']
        : [],
    ].join(' ');

    let installer = Installer.NPM;
    let lockfile: string | undefined;
    let depsCommand = '';

    if (dependencies) {
      // Create a dummy package.json for dependencies that we need to install
      fs.writeFileSync(
        path.join(projectRoot, '.package.json'),
        JSON.stringify({ dependencies }),
      );

      // Use npm unless we have a yarn.lock.
      if (fs.existsSync(path.join(projectRoot, LockFile.YARN))) {
        installer = Installer.YARN;
        lockfile = LockFile.YARN;
      } else if (fs.existsSync(path.join(projectRoot, LockFile.NPM))) {
        lockfile = LockFile.NPM;
      }

      // Move dummy package.json and lock file then install
      depsCommand = chain([
        `mv ${cdk.AssetStaging.BUNDLING_INPUT_DIR}/.package.json ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/package.json`,
        lockfile ? `cp ${cdk.AssetStaging.BUNDLING_INPUT_DIR}/${lockfile} ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/${lockfile}` : '',
        `cd ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR} && ${installer} install`,
      ]);
    }

    return lambda.Code.fromAsset(projectRoot, {
      assetHashType: cdk.AssetHashType.BUNDLE,
      bundling: {
        image,
        command: ['bash', '-c', chain([parcelCommand, depsCommand])],
        environment: options.parcelEnvironment,
        volumes: options.cacheDir
          ? [{ containerPath: '/parcel-cache', hostPath: options.cacheDir }]
          : [],
        workingDirectory: path.dirname(containerEntryPath).replace(/\\/g, '/'), // Always use POSIX paths in the container
      },
    });
  }
}

enum Installer {
  NPM = 'npm',
  YARN = 'yarn',
}

enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock'
}

function runtimeVersion(runtime: lambda.Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return match[1];
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
