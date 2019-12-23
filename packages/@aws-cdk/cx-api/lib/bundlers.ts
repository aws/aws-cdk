import * as Parcel from 'parcel-bundler';
import * as path from 'path';
import { FileAssetMetadataEntry } from './assets';

/**
 * An asset bundler
 */
export interface IBundler {
  /**
   * Bundler options as passed to the constructor
   */
  readonly options?: any;

  /**
   * Bundles the asset
   */
  bundle(asset: FileAssetMetadataEntry, assemblyDir: string): Promise<FileAssetMetadataEntry>;
}

/**
 * Options for ParcelBundler
 */
export interface ParcelBundlerOptions {
  /**
   * Expose modules as UMD under this name
   *
   * @default - handler
   */
  readonly global?: string;

  /**
   * Minify files
   *
   * @default false
   */
  readonly minify?: boolean;

  /**
   * Include source maps
   *
   * @default false
   */
  readonly sourceMaps?: boolean;
}

/**
 * Bundle asset with Parcel
 */
export class ParcelBundler implements IBundler {
  /**
   * Parcel bundler options
   */
  public readonly options?: any;

  constructor(options?: ParcelBundlerOptions) { // Cannot use `public readonly` here to change type to any
    this.options = options; // Change type to any
  }

  public async bundle(asset: FileAssetMetadataEntry, assemblyDir: string): Promise<FileAssetMetadataEntry> {
    if (!/\.(js|ts)$/.test(asset.path)) {
      throw new Error('Parcel supports only JavaScript or TypeScript entry files.');
    }

    const outDir = path.join('parcel-build', asset.sourceHash);
    const cacheDir = path.join(assemblyDir, 'parcel-cache', asset.sourceHash);
    const bundler = new Parcel(asset.path, {
      outDir: path.join(assemblyDir, outDir),
      cacheDir,
      watch: false,
      bundleNodeModules: true,
      sourceMaps: false,
      logLevel: 2,
      global: 'handler',
      target: 'node',
      ...this.options,
    });

    await bundler.bundle();

    return {
      ...asset,
      path: outDir,
    };
  }
}
