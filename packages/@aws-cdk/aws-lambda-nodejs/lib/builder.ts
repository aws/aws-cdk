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
   * The node version to use as target for Babel
   */
  readonly nodeVersion: string;

  /**
   * The docker tag of the node base image to use in the parcel-bundler docker image
   *
   * @see https://hub.docker.com/_/node/?tab=tags
   */
  readonly nodeDockerTag: string;

  /**
   * The root of the project. This will be used as the source for the volume
   * mounted in the Docker container.
   */
  readonly projectRoot: string;
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
  }

  /**
   * Build with parcel in a Docker container
   */
  public build(): void {
    try {
      this.updatePkg();

      const dockerBuildArgs = [
        'build',
        '--build-arg', `NODE_TAG=${this.options.nodeDockerTag}`,
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
        '-w', path.dirname(containerEntryPath).replace(/\\/g, '/'), // Always use POSIX paths in the container
        'parcel-bundler',
      ];
      const parcelArgs = [
        'parcel', 'build', containerEntryPath.replace(/\\/g, '/'), // Always use POSIX paths in the container
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
    updateData.engines = { node: `>= ${this.options.nodeVersion}` };

    // Write new package.json
    if (Object.keys(updateData).length !== 0) {
      fs.writeFileSync(this.pkgPath, JSON.stringify({
        ...this.originalPkgJson,
        ...updateData,
      }, null, 2));
    }
  }

  private restorePkg() {
    fs.writeFileSync(this.pkgPath, this.originalPkg);
  }
}
