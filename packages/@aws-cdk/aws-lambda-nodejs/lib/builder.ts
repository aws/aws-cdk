import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { findPkgPath, updatePkg } from './util';

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
  readonly nodeVersion?: string;
}

/**
 * Builder
 */
export class Builder {
  constructor(private readonly options: BuilderOptions) {
  }

  public build(): void {
    const pkgPath = findPkgPath();
    let originalPkg;

    try {
      if (this.options.nodeVersion && pkgPath) {
        // Update engines.node (Babel target)
        originalPkg = updatePkg(pkgPath, {
          engines: { node: `>= ${this.options.nodeVersion}` }
        });
      }

      const dockerBuildArgs = [
        "build", "-t", "parcel-bundler", path.join(__dirname, "../parcel-bundler")
      ];
      const dockerRunArgs = [
        "run", "--rm",
        "-v", `${path.dirname(path.resolve(this.options.entry))}:/entry`,
        "-v", `${path.resolve(this.options.outDir)}:/out`,
        ...(this.options.cacheDir ? ["-v", `${path.resolve(this.options.cacheDir)}:/cache`] : []),
        "parcel-bundler"
      ];
      const parcelArgs = [
        'parcel', 'build', `/entry/${path.basename(this.options.entry)}`,
        '--out-dir', "/out",
        '--out-file', 'index.js',
        '--global', this.options.global,
        '--target', 'node',
        '--bundle-node-modules',
        '--log-level', '2',
        !this.options.minify && '--no-minify',
        !this.options.sourceMaps && '--no-source-maps',
        ...(this.options.cacheDir ? ['--cache-dir', "/cache"] : []),
      ].filter(Boolean) as string[];

      const build = spawnSync("docker", dockerBuildArgs);
      if (build.error) {
        throw build.error;
      }
      if (build.status !== 0) {
        throw new Error(`[Status ${build.status}] stdout: ${build.stdout?.toString().trim()}\n\n\nstderr: ${build.stderr?.toString().trim()}`);
      }

      const parcel = spawnSync("docker", [...dockerRunArgs, ...parcelArgs]);
      if (parcel.error) {
        throw parcel.error;
      }
      if (parcel.status !== 0) {
        throw new Error(`[Status ${parcel.status}] stdout: ${parcel.stdout?.toString().trim()}\n\n\nstderr: ${parcel.stderr?.toString().trim()}`);
      }
    } catch (err) {
      throw new Error(`Failed to build file at ${this.options.entry}: ${err}`);
    } finally { // Always restore package.json to original
      if (pkgPath && originalPkg) {
        fs.writeFileSync(pkgPath, originalPkg);
      }
    }
  }
}
