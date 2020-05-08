import * as lambda from '@aws-cdk/aws-lambda';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { findPkgPath } from './util';

/**
 * Builder options
 */
export interface BuilderOptions {
  /**
   * Entry file
   */
  readonly entry: string;

  /**
   * The output directory
   */
  readonly outDir: string;

  /**
   * Expose modules as UMD under this name
   */
  readonly global: string;

  /**
   * Minify
   */
  readonly minify?: boolean;

  /**
   * Include source maps
   */
  readonly sourceMaps?: boolean;

  /**
   * The cache directory
   */
  readonly cacheDir?: string;

  /**
   * The runtime of the function
   */
  readonly runtime: lambda.Runtime;

  /**
   * The root of the project. This will be used as the source for the volume
   * mounted in the Docker container.
   */
  readonly projectRoot: string;

  /**
   * A list of modules that should be considered as externals
   */
  readonly externalModules?: string[];

  /**
   * A list of modules that should not be bundled but included in the
   * `node_modules` folder.
   */
  readonly installModules?: string[];
}

/**
 * Builder
 */
export class Builder {
  private readonly pkgPath: string;

  private readonly originalPkg: Buffer;

  private readonly originalPkgJson: { [key: string]: any };

  constructor(private readonly options: BuilderOptions) {
    // Original package.json
    const pkgPath = findPkgPath();
    if (!pkgPath) {
      throw new Error('Cannot find a `package.json` in this project.');
    }
    this.pkgPath = path.join(pkgPath, 'package.json');
    this.originalPkg = fs.readFileSync(this.pkgPath);
    this.originalPkgJson = JSON.parse(this.originalPkg.toString());

    // Clean out dir
    fs.rmdirSync(path.resolve(this.options.outDir), { recursive: true });
  }

  /**
   * Build with parcel in a Docker container
   */
  public build(): void {
    try {
      this.updatePkg();

      const dockerBuildArgs = [
        'build',
        '--build-arg', `LAMBCI_LAMBDA_TAG=build-${this.options.runtime.name}`,
        '-t', 'parcel-bundler',
        path.join(__dirname, '../parcel-bundler'),
      ];

      const build = spawnSync('docker', dockerBuildArgs);

      if (build.error) {
        throw build.error;
      }

      if (build.status !== 0) {
        throw new Error(`[Status ${build.status}] stdout: ${build.stdout?.toString().trim()}\n\n\nstderr: ${build.stderr?.toString().trim()}`);
      }

      const containerProjectRoot = '/project';
      const containerOutDir = '/out';
      const containerCacheDir = '/cache';
      const containerEntryPath = path.join(containerProjectRoot, path.relative(this.options.projectRoot, path.resolve(this.options.entry)));

      const dockerRunArgs = [
        'run', '--rm',
        '-v', `${this.options.projectRoot}:${containerProjectRoot}`,
        '-v', `${path.resolve(this.options.outDir)}:${containerOutDir}`,
        ...(this.options.cacheDir ? ['-v', `${path.resolve(this.options.cacheDir)}:${containerCacheDir}`] : []),
        '-w', path.dirname(containerEntryPath),
        'parcel-bundler',
      ];
      const parcelArgs = [
        'parcel', 'build', containerEntryPath,
        '--out-dir', containerOutDir,
        '--out-file', 'index.js',
        '--global', this.options.global,
        '--target', 'node',
        '--bundle-node-modules',
        '--log-level', '2',
        !this.options.minify && '--no-minify',
        !this.options.sourceMaps && '--no-source-maps',
        ...(this.options.cacheDir ? ['--cache-dir', containerCacheDir] : []),
      ].filter(Boolean) as string[];

      const parcel = spawnSync('docker', [...dockerRunArgs, ...parcelArgs]);

      if (parcel.error) {
        throw parcel.error;
      }

      if (parcel.status !== 0) {
        throw new Error(`[Status ${parcel.status}] stdout: ${parcel.stdout?.toString().trim()}\n\n\nstderr: ${parcel.stderr?.toString().trim()}`);
      }

      if (this.options.installModules && this.options.installModules.length !== 0) {
        this.installModules(this.options.installModules);
      }
    } catch (err) {
      throw new Error(`Failed to build file at ${this.options.entry}: ${err}`);
    } finally { // Always restore package.json to original
      this.restorePkg();
    }
  }

  /**
   * Updates the package.json to configure Parcel
   */
  private updatePkg() {
    const updateData: { [key: string]: any } = {};
    // Update engines.node (Babel target)
    updateData.engines = { node: `>= ${extractVersion(this.options.runtime)}` };

    // Add externals for parcel-plugin-externals
    if (this.options.externalModules || this.options.installModules) {
      updateData.devDependencies = {
        ...this.originalPkgJson.devDependencies || {},
        'parcel-plugin-externals': '*',
      };
      updateData.externals = [...this.options.externalModules || [], ...this.options.installModules || []];
    }

    // Write new package.json
    if (Object.keys(updateData).length !== 0) {
      fs.writeFileSync(this.pkgPath, JSON.stringify({
        ...this.originalPkgJson,
        ...updateData,
      }, null, 2));
    }
  }

  /**
   * Install modules that should be included in the node_modules directory
   */
  private installModules(modules: string[]) {
    // Use original dependencies for versions
    const dependencies: { [dependency: string]: string } = {
      ...this.originalPkgJson.dependencies ?? {},
      ...this.originalPkgJson.devDependencies ?? {},
      ...this.originalPkgJson.peerDependencies ?? {},
    };

    // Retain only modules to be installed
    const filteredDependencies: { [dependency: string]: string } = {};
    for (const mod of modules) {
      if (dependencies[mod]) {
        filteredDependencies[mod] = dependencies[mod];
      } else {
        throw new Error(`Module '${mod}' must be listed in the project dependencies`);
      }
    }

    // Write dummy package.json
    const dummyPackageJson = path.join(this.options.outDir, 'package.json');
    fs.writeFileSync(dummyPackageJson, JSON.stringify({
      dependencies: filteredDependencies,
    }, null, 2));

    // Determine package manager to use and lock file
    const installOptions = this.getInstallOptions();
    if (installOptions.lockFile) {
      fs.copyFileSync(installOptions.lockFile, path.join(this.options.outDir, installOptions.packageManager.lockFileName));
    }

    const installArgs = [
      'run', '--rm',
      '-v', `${this.options.outDir}:/var/task`, // /var/task is the WORKDIR of the base image
      'parcel-bundler',
      installOptions.packageManager.command, ...installOptions.packageManager.installArgs,
    ];
    const install = spawnSync('docker', installArgs);

    if (install.error) {
      throw install.error;
    }

    if (install.status !== 0) {
      throw new Error(install.stderr.toString().trim());
    }
  }

  private getInstallOptions(): InstallOptions {
    // If we have a `yarn.lock` we use `yarn` as installer otherwise
    // we use `package-lock.json` and `npm`. Look first in the package
    // path and then in the project root.
    let lockFile = path.join(path.dirname(this.pkgPath), PackageManager.YARN.lockFileName);
    if (fs.existsSync(lockFile)) {
      return { packageManager: PackageManager.YARN, lockFile };
    }

    lockFile = path.join(this.options.projectRoot, PackageManager.YARN.lockFileName);
    if (fs.existsSync(lockFile)) {
      return { packageManager: PackageManager.YARN, lockFile };
    }

    lockFile = path.join(path.dirname(this.pkgPath), PackageManager.NPM.lockFileName);
    if (fs.existsSync(lockFile)) {
      return { packageManager: PackageManager.NPM, lockFile };
    }

    lockFile = path.join(this.options.projectRoot, PackageManager.NPM.lockFileName);
    if (fs.existsSync(lockFile)) {
      return { packageManager: PackageManager.NPM, lockFile };
    }

    return { packageManager: PackageManager.NPM };
  }

  private restorePkg() {
    fs.writeFileSync(this.pkgPath, this.originalPkg);
  }
}

/**
 * Package manager
 */
class PackageManager {
  public static readonly NPM = new PackageManager('npm', ['install', '--production'], 'package-lock.json');
  public static readonly YARN = new PackageManager('yarn', ['install', '--production'], 'yarn.lock');

  public readonly command: string;

  public readonly installArgs: string[];

  public readonly lockFileName: string;

  constructor(command: string, installArgs: string[], lockFileName: string) {
    this.command = command;
    this.installArgs = installArgs;
    this.lockFileName = lockFileName;
  }
}

interface InstallOptions {
  packageManager: PackageManager;
  lockFile?: string;
}

/**
 * Extracts the version from the runtime
 */
function extractVersion(runtime: lambda.Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return match[1];
}
