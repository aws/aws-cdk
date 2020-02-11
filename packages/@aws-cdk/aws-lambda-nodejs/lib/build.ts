import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { findPkgPath, updatePkg } from './util';

/**
 * Build options
 */
export interface BuildOptions {
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
 * Build with Parcel
 */
export function build(options: BuildOptions): void {
  const pkgPath = findPkgPath();
  let originalPkg;

  try {
    if (options.nodeVersion && pkgPath) {
      // Update engines.node (Babel target)
      originalPkg = updatePkg(pkgPath, {
        engines: { node: `>= ${options.nodeVersion}` }
      });
    }

    const args = [
      'build', options.entry,
      '--out-dir', options.outDir,
      '--out-file', 'index.js',
      '--global', options.global,
      '--target', 'node',
      '--bundle-node-modules',
      '--log-level', '2',
      !options.minify && '--no-minify',
      !options.sourceMaps && '--no-source-maps',
      ...options.cacheDir
        ? ['--cache-dir', options.cacheDir]
        : [],
    ].filter(Boolean) as string[];

    const parcel = spawnSync('parcel', args);

    if (parcel.error) {
      throw parcel.error;
    }

    if (parcel.status !== 0) {
      throw new Error(parcel.stderr.toString().trim());
    }
  } catch (err) {
    throw new Error(`Failed to build file at ${options.entry}: ${err}`);
  } finally { // Always restore package.json to original
    if (pkgPath && originalPkg) {
      fs.writeFileSync(pkgPath, originalPkg);
    }
  }
}
