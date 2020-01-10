import * as Parcel from 'parcel-bundler';
import * as path from 'path';
import { FileAssetMetadataEntry } from './assets';

/**
 * An asset bundler
 */
export abstract class Bundler {
  /**
   * @param options Bundler options that are passed to the constructor
   */
  constructor(public readonly options?: any) {}

  /**
   * Bundles the asset
   */
  public abstract bundle(asset: FileAssetMetadataEntry, assemblyDir: string): Promise<FileAssetMetadataEntry>;
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
export class ParcelBundler extends Bundler {
  constructor(options?: ParcelBundlerOptions) {
    super(options);
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
