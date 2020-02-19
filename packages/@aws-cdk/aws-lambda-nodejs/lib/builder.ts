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
  private readonly parcelBinPath: string;

  constructor(private readonly options: BuilderOptions) {
    let parcelPkgPath: string;
    try {
      parcelPkgPath = require.resolve('parcel-bundler/package.json'); // This will throw if `parcel-bundler` cannot be found
    } catch (err) {
      throw new Error('It looks like parcel-bundler is not installed. Please install v1.x of parcel-bundler with yarn or npm.');
    }
    const parcelDir = path.dirname(parcelPkgPath);
    const parcelPkg = JSON.parse(fs.readFileSync(parcelPkgPath, 'utf8'));

    if (!parcelPkg.version || !/^1\./.test(parcelPkg.version)) { // Peer dependency on parcel v1.x
      throw new Error(`This module has a peer dependency on parcel-bundler v1.x. Got v${parcelPkg.version}.`);
    }

    this.parcelBinPath = path.join(parcelDir, parcelPkg.bin.parcel);
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

      const args = [
        'build', this.options.entry,
        '--out-dir', this.options.outDir,
        '--out-file', 'index.js',
        '--global', this.options.global,
        '--target', 'node',
        '--bundle-node-modules',
        '--log-level', '2',
        !this.options.minify && '--no-minify',
        !this.options.sourceMaps && '--no-source-maps',
        ...this.options.cacheDir
          ? ['--cache-dir', this.options.cacheDir]
          : [],
      ].filter(Boolean) as string[];

      const parcel = spawnSync(this.parcelBinPath, args);

      if (parcel.error) {
        throw parcel.error;
      }

      if (parcel.status !== 0) {
        throw new Error(parcel.stdout.toString().trim());
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
