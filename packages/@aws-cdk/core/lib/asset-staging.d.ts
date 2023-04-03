import { Construct } from 'constructs';
import { AssetOptions, FileAssetPackaging } from './assets';
import { FingerprintOptions } from './fs';
import { Stack } from './stack';
/**
 * Initialization properties for `AssetStaging`.
 */
export interface AssetStagingProps extends FingerprintOptions, AssetOptions {
    /**
     * The source file or directory to copy from.
     */
    readonly sourcePath: string;
}
/**
 * Stages a file or directory from a location on the file system into a staging
 * directory.
 *
 * This is controlled by the context key 'aws:cdk:asset-staging' and enabled
 * by the CLI by default in order to ensure that when the CDK app exists, all
 * assets are available for deployment. Otherwise, if an app references assets
 * in temporary locations, those will not be available when it exists (see
 * https://github.com/aws/aws-cdk/issues/1716).
 *
 * The `stagedPath` property is a stringified token that represents the location
 * of the file or directory after staging. It will be resolved only during the
 * "prepare" stage and may be either the original path or the staged path
 * depending on the context setting.
 *
 * The file/directory are staged based on their content hash (fingerprint). This
 * means that only if content was changed, copy will happen.
 */
export declare class AssetStaging extends Construct {
    /**
     * The directory inside the bundling container into which the asset sources will be mounted.
     */
    static readonly BUNDLING_INPUT_DIR = "/asset-input";
    /**
     * The directory inside the bundling container into which the bundled output should be written.
     */
    static readonly BUNDLING_OUTPUT_DIR = "/asset-output";
    /**
     * Clears the asset hash cache
     */
    static clearAssetHashCache(): void;
    /**
     * Cache of asset hashes based on asset configuration to avoid repeated file
     * system and bundling operations.
     */
    private static assetCache;
    /**
     * Absolute path to the asset data.
     *
     * If asset staging is disabled, this will just be the source path or
     * a temporary directory used for bundling.
     *
     * If asset staging is enabled it will be the staged path.
     *
     * IMPORTANT: If you are going to call `addFileAsset()`, use
     * `relativeStagedPath()` instead.
     *
     * @deprecated - Use `absoluteStagedPath` instead.
     */
    readonly stagedPath: string;
    /**
     * Absolute path to the asset data.
     *
     * If asset staging is disabled, this will just be the source path or
     * a temporary directory used for bundling.
     *
     * If asset staging is enabled it will be the staged path.
     *
     * IMPORTANT: If you are going to call `addFileAsset()`, use
     * `relativeStagedPath()` instead.
     */
    readonly absoluteStagedPath: string;
    /**
     * The absolute path of the asset as it was referenced by the user.
     */
    readonly sourcePath: string;
    /**
     * A cryptographic hash of the asset.
     */
    readonly assetHash: string;
    /**
     * How this asset should be packaged.
     */
    readonly packaging: FileAssetPackaging;
    /**
     * Whether this asset is an archive (zip or jar).
     */
    readonly isArchive: boolean;
    private readonly fingerprintOptions;
    private readonly hashType;
    private readonly assetOutdir;
    /**
     * A custom source fingerprint given by the user
     *
     * Will not be used literally, always hashed later on.
     */
    private customSourceFingerprint?;
    private readonly cacheKey;
    private readonly sourceStats;
    constructor(scope: Construct, id: string, props: AssetStagingProps);
    /**
     * A cryptographic hash of the asset.
     *
     * @deprecated see `assetHash`.
     */
    get sourceHash(): string;
    /**
     * Return the path to the staged asset, relative to the Cloud Assembly (manifest) directory of the given stack
     *
     * Only returns a relative path if the asset was staged, returns an absolute path if
     * it was not staged.
     *
     * A bundled asset might end up in the outDir and still not count as
     * "staged"; if asset staging is disabled we're technically expected to
     * reference source directories, but we don't have a source directory for the
     * bundled outputs (as the bundle output is written to a temporary
     * directory). Nevertheless, we will still return an absolute path.
     *
     * A non-obvious directory layout may look like this:
     *
     * ```
     *   CLOUD ASSEMBLY ROOT
     *     +-- asset.12345abcdef/
     *     +-- assembly-Stage
     *           +-- MyStack.template.json
     *           +-- MyStack.assets.json <- will contain { "path": "../asset.12345abcdef" }
     * ```
     */
    relativeStagedPath(stack: Stack): string;
    /**
     * Stage the source to the target by copying
     *
     * Optionally skip if staging is disabled, in which case we pretend we did something but we don't really.
     */
    private stageByCopying;
    /**
     * Stage the source to the target by bundling
     *
     * Optionally skip, in which case we pretend we did something but we don't really.
     */
    private stageByBundling;
    /**
     * Whether staging has been disabled
     */
    private get stagingDisabled();
    /**
     * Copies or moves the files from sourcePath to targetPath.
     *
     * Moving implies the source directory is temporary and can be trashed.
     *
     * Will not do anything if source and target are the same.
     */
    private stageAsset;
    /**
     * Determine the directory where we're going to write the bundling output
     *
     * This is the target directory where we're going to write the staged output
     * files if we can (if the hash is fully known), or a temporary directory
     * otherwise.
     */
    private determineBundleDir;
    /**
     * Bundles an asset to the given directory
     *
     * If the given directory already exists, assume that everything's already
     * in order and don't do anything.
     *
     * @param options Bundling options
     * @param bundleDir Where to create the bundle directory
     * @returns The fully resolved bundle output directory.
     */
    private bundle;
    private calculateHash;
}
