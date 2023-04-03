"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetStaging = void 0;
const crypto = require("crypto");
const path = require("path");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const fs = require("fs-extra");
const assets_1 = require("./assets");
const bundling_1 = require("./bundling");
const fs_1 = require("./fs");
const fingerprint_1 = require("./fs/fingerprint");
const names_1 = require("./names");
const asset_staging_1 = require("./private/asset-staging");
const cache_1 = require("./private/cache");
const stack_1 = require("./stack");
const stage_1 = require("./stage");
const ARCHIVE_EXTENSIONS = ['.tar.gz', '.zip', '.jar', '.tar', '.tgz'];
const ASSET_SALT_CONTEXT_KEY = '@aws-cdk/core:assetHashSalt';
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
class AssetStaging extends constructs_1.Construct {
    /**
     * Clears the asset hash cache
     */
    static clearAssetHashCache() {
        this.assetCache.clear();
        (0, fingerprint_1.clearLargeFileFingerprintCache)();
    }
    constructor(scope, id, props) {
        super(scope, id);
        const salt = this.node.tryGetContext(ASSET_SALT_CONTEXT_KEY);
        this.sourcePath = path.resolve(props.sourcePath);
        this.fingerprintOptions = {
            ...props,
            extraHash: props.extraHash || salt ? `${props.extraHash ?? ''}${salt ?? ''}` : undefined,
        };
        if (!fs.existsSync(this.sourcePath)) {
            throw new Error(`Cannot find asset at ${this.sourcePath}`);
        }
        this.sourceStats = fs.statSync(this.sourcePath);
        const outdir = stage_1.Stage.of(this)?.assetOutdir;
        if (!outdir) {
            throw new Error('unable to determine cloud assembly asset output directory. Assets must be defined indirectly within a "Stage" or an "App" scope');
        }
        this.assetOutdir = outdir;
        // Determine the hash type based on the props as props.assetHashType is
        // optional from a caller perspective.
        this.customSourceFingerprint = props.assetHash;
        this.hashType = determineHashType(props.assetHashType, this.customSourceFingerprint);
        // Decide what we're going to do, without actually doing it yet
        let stageThisAsset;
        let skip = false;
        if (props.bundling) {
            // Check if we actually have to bundle for this stack
            skip = !stack_1.Stack.of(this).bundlingRequired;
            const bundling = props.bundling;
            stageThisAsset = () => this.stageByBundling(bundling, skip);
        }
        else {
            stageThisAsset = () => this.stageByCopying();
        }
        // Calculate a cache key from the props. This way we can check if we already
        // staged this asset and reuse the result (e.g. the same asset with the same
        // configuration is used in multiple stacks). In this case we can completely
        // skip file system and bundling operations.
        //
        // The output directory and whether this asset is skipped or not should also be
        // part of the cache key to make sure we don't accidentally return the wrong
        // staged asset from the cache.
        this.cacheKey = calculateCacheKey({
            outdir: this.assetOutdir,
            sourcePath: path.resolve(props.sourcePath),
            bundling: props.bundling,
            assetHashType: this.hashType,
            customFingerprint: this.customSourceFingerprint,
            extraHash: props.extraHash,
            exclude: props.exclude,
            ignoreMode: props.ignoreMode,
            skip,
        });
        const staged = AssetStaging.assetCache.obtain(this.cacheKey, stageThisAsset);
        this.stagedPath = staged.stagedPath;
        this.absoluteStagedPath = staged.stagedPath;
        this.assetHash = staged.assetHash;
        this.packaging = staged.packaging;
        this.isArchive = staged.isArchive;
    }
    /**
     * A cryptographic hash of the asset.
     *
     * @deprecated see `assetHash`.
     */
    get sourceHash() {
        return this.assetHash;
    }
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
    relativeStagedPath(stack) {
        const asmManifestDir = stage_1.Stage.of(stack)?.outdir;
        if (!asmManifestDir) {
            return this.stagedPath;
        }
        const isOutsideAssetDir = path.relative(this.assetOutdir, this.stagedPath).startsWith('..');
        if (isOutsideAssetDir || this.stagingDisabled) {
            return this.stagedPath;
        }
        return path.relative(asmManifestDir, this.stagedPath);
    }
    /**
     * Stage the source to the target by copying
     *
     * Optionally skip if staging is disabled, in which case we pretend we did something but we don't really.
     */
    stageByCopying() {
        const assetHash = this.calculateHash(this.hashType);
        const stagedPath = this.stagingDisabled
            ? this.sourcePath
            : path.resolve(this.assetOutdir, renderAssetFilename(assetHash, getExtension(this.sourcePath)));
        if (!this.sourceStats.isDirectory() && !this.sourceStats.isFile()) {
            throw new Error(`Asset ${this.sourcePath} is expected to be either a directory or a regular file`);
        }
        this.stageAsset(this.sourcePath, stagedPath, 'copy');
        return {
            assetHash,
            stagedPath,
            packaging: this.sourceStats.isDirectory() ? assets_1.FileAssetPackaging.ZIP_DIRECTORY : assets_1.FileAssetPackaging.FILE,
            isArchive: this.sourceStats.isDirectory() || ARCHIVE_EXTENSIONS.includes(getExtension(this.sourcePath).toLowerCase()),
        };
    }
    /**
     * Stage the source to the target by bundling
     *
     * Optionally skip, in which case we pretend we did something but we don't really.
     */
    stageByBundling(bundling, skip) {
        if (!this.sourceStats.isDirectory()) {
            throw new Error(`Asset ${this.sourcePath} is expected to be a directory when bundling`);
        }
        if (skip) {
            // We should have bundled, but didn't to save time. Still pretend to have a hash.
            // If the asset uses OUTPUT or BUNDLE, we use a CUSTOM hash to avoid fingerprinting
            // a potentially very large source directory. Other hash types are kept the same.
            let hashType = this.hashType;
            if (hashType === assets_1.AssetHashType.OUTPUT || hashType === assets_1.AssetHashType.BUNDLE) {
                this.customSourceFingerprint = names_1.Names.uniqueId(this);
                hashType = assets_1.AssetHashType.CUSTOM;
            }
            return {
                assetHash: this.calculateHash(hashType, bundling),
                stagedPath: this.sourcePath,
                packaging: assets_1.FileAssetPackaging.ZIP_DIRECTORY,
                isArchive: true,
            };
        }
        // Try to calculate assetHash beforehand (if we can)
        let assetHash = this.hashType === assets_1.AssetHashType.SOURCE || this.hashType === assets_1.AssetHashType.CUSTOM
            ? this.calculateHash(this.hashType, bundling)
            : undefined;
        const bundleDir = this.determineBundleDir(this.assetOutdir, assetHash);
        this.bundle(bundling, bundleDir);
        // Check bundling output content and determine if we will need to archive
        const bundlingOutputType = bundling.outputType ?? bundling_1.BundlingOutput.AUTO_DISCOVER;
        const bundledAsset = determineBundledAsset(bundleDir, bundlingOutputType);
        // Calculate assetHash afterwards if we still must
        assetHash = assetHash ?? this.calculateHash(this.hashType, bundling, bundledAsset.path);
        const stagedPath = path.resolve(this.assetOutdir, renderAssetFilename(assetHash, bundledAsset.extension));
        this.stageAsset(bundledAsset.path, stagedPath, 'move');
        // If bundling produced a single archive file we "touch" this file in the bundling
        // directory after it has been moved to the staging directory. This way if bundling
        // is skipped because the bundling directory already exists we can still determine
        // the correct packaging type.
        if (bundledAsset.packaging === assets_1.FileAssetPackaging.FILE) {
            fs.closeSync(fs.openSync(bundledAsset.path, 'w'));
        }
        return {
            assetHash,
            stagedPath,
            packaging: bundledAsset.packaging,
            isArchive: true, // bundling always produces an archive
        };
    }
    /**
     * Whether staging has been disabled
     */
    get stagingDisabled() {
        return !!this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
    }
    /**
     * Copies or moves the files from sourcePath to targetPath.
     *
     * Moving implies the source directory is temporary and can be trashed.
     *
     * Will not do anything if source and target are the same.
     */
    stageAsset(sourcePath, targetPath, style) {
        // Is the work already done?
        const isAlreadyStaged = fs.existsSync(targetPath);
        if (isAlreadyStaged) {
            if (style === 'move' && sourcePath !== targetPath) {
                fs.removeSync(sourcePath);
            }
            return;
        }
        // Moving can be done quickly
        if (style == 'move') {
            fs.renameSync(sourcePath, targetPath);
            return;
        }
        // Copy file/directory to staging directory
        if (this.sourceStats.isFile()) {
            fs.copyFileSync(sourcePath, targetPath);
        }
        else if (this.sourceStats.isDirectory()) {
            fs.mkdirSync(targetPath);
            fs_1.FileSystem.copyDirectory(sourcePath, targetPath, this.fingerprintOptions);
        }
        else {
            throw new Error(`Unknown file type: ${sourcePath}`);
        }
    }
    /**
     * Determine the directory where we're going to write the bundling output
     *
     * This is the target directory where we're going to write the staged output
     * files if we can (if the hash is fully known), or a temporary directory
     * otherwise.
     */
    determineBundleDir(outdir, sourceHash) {
        if (sourceHash) {
            return path.resolve(outdir, renderAssetFilename(sourceHash));
        }
        // When the asset hash isn't known in advance, bundler outputs to an
        // intermediate directory named after the asset's cache key
        return path.resolve(outdir, `bundling-temp-${this.cacheKey}`);
    }
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
    bundle(options, bundleDir) {
        if (fs.existsSync(bundleDir)) {
            return;
        }
        fs.ensureDirSync(bundleDir);
        // Chmod the bundleDir to full access.
        fs.chmodSync(bundleDir, 0o777);
        let localBundling;
        try {
            process.stderr.write(`Bundling asset ${this.node.path}...\n`);
            localBundling = options.local?.tryBundle(bundleDir, options);
            if (!localBundling) {
                const assetStagingOptions = {
                    sourcePath: this.sourcePath,
                    bundleDir,
                    ...options,
                };
                switch (options.bundlingFileAccess) {
                    case bundling_1.BundlingFileAccess.VOLUME_COPY:
                        new asset_staging_1.AssetBundlingVolumeCopy(assetStagingOptions).run();
                        break;
                    case bundling_1.BundlingFileAccess.BIND_MOUNT:
                    default:
                        new asset_staging_1.AssetBundlingBindMount(assetStagingOptions).run();
                        break;
                }
            }
        }
        catch (err) {
            // When bundling fails, keep the bundle output for diagnosability, but
            // rename it out of the way so that the next run doesn't assume it has a
            // valid bundleDir.
            const bundleErrorDir = bundleDir + '-error';
            if (fs.existsSync(bundleErrorDir)) {
                // Remove the last bundleErrorDir.
                fs.removeSync(bundleErrorDir);
            }
            fs.renameSync(bundleDir, bundleErrorDir);
            throw new Error(`Failed to bundle asset ${this.node.path}, bundle output is located at ${bundleErrorDir}: ${err}`);
        }
        if (fs_1.FileSystem.isEmpty(bundleDir)) {
            const outputDir = localBundling ? bundleDir : AssetStaging.BUNDLING_OUTPUT_DIR;
            throw new Error(`Bundling did not produce any output. Check that content is written to ${outputDir}.`);
        }
    }
    calculateHash(hashType, bundling, outputDir) {
        // When bundling a CUSTOM or SOURCE asset hash type, we want the hash to include
        // the bundling configuration. We handle CUSTOM and bundled SOURCE hash types
        // as a special case to preserve existing user asset hashes in all other cases.
        if (hashType == assets_1.AssetHashType.CUSTOM || (hashType == assets_1.AssetHashType.SOURCE && bundling)) {
            const hash = crypto.createHash('sha256');
            // if asset hash is provided by user, use it, otherwise fingerprint the source.
            hash.update(this.customSourceFingerprint ?? fs_1.FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions));
            // If we're bundling an asset, include the bundling configuration in the hash
            if (bundling) {
                hash.update(JSON.stringify(bundling));
            }
            return hash.digest('hex');
        }
        switch (hashType) {
            case assets_1.AssetHashType.SOURCE:
                return fs_1.FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions);
            case assets_1.AssetHashType.BUNDLE:
            case assets_1.AssetHashType.OUTPUT:
                if (!outputDir) {
                    throw new Error(`Cannot use \`${hashType}\` hash type when \`bundling\` is not specified.`);
                }
                return fs_1.FileSystem.fingerprint(outputDir, this.fingerprintOptions);
            default:
                throw new Error('Unknown asset hash type.');
        }
    }
}
exports.AssetStaging = AssetStaging;
/**
 * The directory inside the bundling container into which the asset sources will be mounted.
 */
AssetStaging.BUNDLING_INPUT_DIR = '/asset-input';
/**
 * The directory inside the bundling container into which the bundled output should be written.
 */
AssetStaging.BUNDLING_OUTPUT_DIR = '/asset-output';
/**
 * Cache of asset hashes based on asset configuration to avoid repeated file
 * system and bundling operations.
 */
AssetStaging.assetCache = new cache_1.Cache();
function renderAssetFilename(assetHash, extension = '') {
    return `asset.${assetHash}${extension}`;
}
/**
 * Determines the hash type from user-given prop values.
 *
 * @param assetHashType Asset hash type construct prop
 * @param customSourceFingerprint Asset hash seed given in the construct props
 */
function determineHashType(assetHashType, customSourceFingerprint) {
    const hashType = customSourceFingerprint
        ? (assetHashType ?? assets_1.AssetHashType.CUSTOM)
        : (assetHashType ?? assets_1.AssetHashType.SOURCE);
    if (customSourceFingerprint && hashType !== assets_1.AssetHashType.CUSTOM) {
        throw new Error(`Cannot specify \`${assetHashType}\` for \`assetHashType\` when \`assetHash\` is specified. Use \`CUSTOM\` or leave \`undefined\`.`);
    }
    if (hashType === assets_1.AssetHashType.CUSTOM && !customSourceFingerprint) {
        throw new Error('`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.');
    }
    return hashType;
}
/**
 * Calculates a cache key from the props. Normalize by sorting keys.
 */
function calculateCacheKey(props) {
    return crypto.createHash('sha256')
        .update(JSON.stringify(sortObject(props)))
        .digest('hex');
}
/**
 * Recursively sort object keys
 */
function sortObject(object) {
    if (typeof object !== 'object' || object instanceof Array) {
        return object;
    }
    const ret = {};
    for (const key of Object.keys(object).sort()) {
        ret[key] = sortObject(object[key]);
    }
    return ret;
}
/**
 * Returns the single archive file of a directory or undefined
 */
function singleArchiveFile(directory) {
    if (!fs.existsSync(directory)) {
        throw new Error(`Directory ${directory} does not exist.`);
    }
    if (!fs.statSync(directory).isDirectory()) {
        throw new Error(`${directory} is not a directory.`);
    }
    const content = fs.readdirSync(directory);
    if (content.length === 1) {
        const file = path.join(directory, content[0]);
        const extension = getExtension(content[0]).toLowerCase();
        if (fs.statSync(file).isFile() && ARCHIVE_EXTENSIONS.includes(extension)) {
            return file;
        }
    }
    return undefined;
}
/**
 * Returns the bundled asset to use based on the content of the bundle directory
 * and the type of output.
 */
function determineBundledAsset(bundleDir, outputType) {
    const archiveFile = singleArchiveFile(bundleDir);
    // auto-discover means that if there is an archive file, we take it as the
    // bundle, otherwise, we will archive here.
    if (outputType === bundling_1.BundlingOutput.AUTO_DISCOVER) {
        outputType = archiveFile ? bundling_1.BundlingOutput.ARCHIVED : bundling_1.BundlingOutput.NOT_ARCHIVED;
    }
    switch (outputType) {
        case bundling_1.BundlingOutput.NOT_ARCHIVED:
            return { path: bundleDir, packaging: assets_1.FileAssetPackaging.ZIP_DIRECTORY };
        case bundling_1.BundlingOutput.ARCHIVED:
            if (!archiveFile) {
                throw new Error('Bundling output directory is expected to include only a single archive file when `output` is set to `ARCHIVED`');
            }
            return { path: archiveFile, packaging: assets_1.FileAssetPackaging.FILE, extension: getExtension(archiveFile) };
    }
}
/**
* Return the extension name of a source path
*
* Loop through ARCHIVE_EXTENSIONS for valid archive extensions.
*/
function getExtension(source) {
    for (const ext of ARCHIVE_EXTENSIONS) {
        if (source.toLowerCase().endsWith(ext)) {
            return ext;
        }
        ;
    }
    ;
    return path.extname(source);
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtc3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3Qix5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLCtCQUErQjtBQUMvQixxQ0FBMkU7QUFDM0UseUNBQWlGO0FBQ2pGLDZCQUFzRDtBQUN0RCxrREFBa0U7QUFDbEUsbUNBQWdDO0FBQ2hDLDJEQUEwRjtBQUMxRiwyQ0FBd0M7QUFDeEMsbUNBQWdDO0FBQ2hDLG1DQUFnQztBQUVoQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZFLE1BQU0sc0JBQXNCLEdBQUcsNkJBQTZCLENBQUM7QUFxQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBV3pDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQjtRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLElBQUEsNENBQThCLEdBQUUsQ0FBQztJQUNuQyxDQUFDO0lBd0VELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHO1lBQ3hCLEdBQUcsS0FBSztZQUNSLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FB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Q0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IEFzc2V0SGFzaFR5cGUsIEFzc2V0T3B0aW9ucywgRmlsZUFzc2V0UGFja2FnaW5nIH0gZnJvbSAnLi9hc3NldHMnO1xuaW1wb3J0IHsgQnVuZGxpbmdGaWxlQWNjZXNzLCBCdW5kbGluZ09wdGlvbnMsIEJ1bmRsaW5nT3V0cHV0IH0gZnJvbSAnLi9idW5kbGluZyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtLCBGaW5nZXJwcmludE9wdGlvbnMgfSBmcm9tICcuL2ZzJztcbmltcG9ydCB7IGNsZWFyTGFyZ2VGaWxlRmluZ2VycHJpbnRDYWNoZSB9IGZyb20gJy4vZnMvZmluZ2VycHJpbnQnO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuL25hbWVzJztcbmltcG9ydCB7IEFzc2V0QnVuZGxpbmdWb2x1bWVDb3B5LCBBc3NldEJ1bmRsaW5nQmluZE1vdW50IH0gZnJvbSAnLi9wcml2YXRlL2Fzc2V0LXN0YWdpbmcnO1xuaW1wb3J0IHsgQ2FjaGUgfSBmcm9tICcuL3ByaXZhdGUvY2FjaGUnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi9zdGFnZSc7XG5cbmNvbnN0IEFSQ0hJVkVfRVhURU5TSU9OUyA9IFsnLnRhci5neicsICcuemlwJywgJy5qYXInLCAnLnRhcicsICcudGd6J107XG5cbmNvbnN0IEFTU0VUX1NBTFRfQ09OVEVYVF9LRVkgPSAnQGF3cy1jZGsvY29yZTphc3NldEhhc2hTYWx0JztcblxuLyoqXG4gKiBBIHByZXZpb3VzbHkgc3RhZ2VkIGFzc2V0XG4gKi9cbmludGVyZmFjZSBTdGFnZWRBc3NldCB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB3aGVyZSB3ZSB3cm90ZSB0aGlzIGFzc2V0IHByZXZpb3VzbHlcbiAgICovXG4gIHJlYWRvbmx5IHN0YWdlZFBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhhc2ggd2UgdXNlZCBwcmV2aW91c2x5XG4gICAqL1xuICByZWFkb25seSBhc3NldEhhc2g6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhY2thZ2luZyBvZiB0aGUgYXNzZXRcbiAgICovXG4gIHJlYWRvbmx5IHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYXNzZXQgaXMgYW4gYXJjaGl2ZVxuICAgKi9cbiAgcmVhZG9ubHkgaXNBcmNoaXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemF0aW9uIHByb3BlcnRpZXMgZm9yIGBBc3NldFN0YWdpbmdgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzc2V0U3RhZ2luZ1Byb3BzIGV4dGVuZHMgRmluZ2VycHJpbnRPcHRpb25zLCBBc3NldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNvdXJjZSBmaWxlIG9yIGRpcmVjdG9yeSB0byBjb3B5IGZyb20uXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VQYXRoOiBzdHJpbmc7XG59XG5cbi8qKlxuICogU3RhZ2VzIGEgZmlsZSBvciBkaXJlY3RvcnkgZnJvbSBhIGxvY2F0aW9uIG9uIHRoZSBmaWxlIHN5c3RlbSBpbnRvIGEgc3RhZ2luZ1xuICogZGlyZWN0b3J5LlxuICpcbiAqIFRoaXMgaXMgY29udHJvbGxlZCBieSB0aGUgY29udGV4dCBrZXkgJ2F3czpjZGs6YXNzZXQtc3RhZ2luZycgYW5kIGVuYWJsZWRcbiAqIGJ5IHRoZSBDTEkgYnkgZGVmYXVsdCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB3aGVuIHRoZSBDREsgYXBwIGV4aXN0cywgYWxsXG4gKiBhc3NldHMgYXJlIGF2YWlsYWJsZSBmb3IgZGVwbG95bWVudC4gT3RoZXJ3aXNlLCBpZiBhbiBhcHAgcmVmZXJlbmNlcyBhc3NldHNcbiAqIGluIHRlbXBvcmFyeSBsb2NhdGlvbnMsIHRob3NlIHdpbGwgbm90IGJlIGF2YWlsYWJsZSB3aGVuIGl0IGV4aXN0cyAoc2VlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzE3MTYpLlxuICpcbiAqIFRoZSBgc3RhZ2VkUGF0aGAgcHJvcGVydHkgaXMgYSBzdHJpbmdpZmllZCB0b2tlbiB0aGF0IHJlcHJlc2VudHMgdGhlIGxvY2F0aW9uXG4gKiBvZiB0aGUgZmlsZSBvciBkaXJlY3RvcnkgYWZ0ZXIgc3RhZ2luZy4gSXQgd2lsbCBiZSByZXNvbHZlZCBvbmx5IGR1cmluZyB0aGVcbiAqIFwicHJlcGFyZVwiIHN0YWdlIGFuZCBtYXkgYmUgZWl0aGVyIHRoZSBvcmlnaW5hbCBwYXRoIG9yIHRoZSBzdGFnZWQgcGF0aFxuICogZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0IHNldHRpbmcuXG4gKlxuICogVGhlIGZpbGUvZGlyZWN0b3J5IGFyZSBzdGFnZWQgYmFzZWQgb24gdGhlaXIgY29udGVudCBoYXNoIChmaW5nZXJwcmludCkuIFRoaXNcbiAqIG1lYW5zIHRoYXQgb25seSBpZiBjb250ZW50IHdhcyBjaGFuZ2VkLCBjb3B5IHdpbGwgaGFwcGVuLlxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRTdGFnaW5nIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBkaXJlY3RvcnkgaW5zaWRlIHRoZSBidW5kbGluZyBjb250YWluZXIgaW50byB3aGljaCB0aGUgYXNzZXQgc291cmNlcyB3aWxsIGJlIG1vdW50ZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJVTkRMSU5HX0lOUFVUX0RJUiA9ICcvYXNzZXQtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0b3J5IGluc2lkZSB0aGUgYnVuZGxpbmcgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGJ1bmRsZWQgb3V0cHV0IHNob3VsZCBiZSB3cml0dGVuLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCVU5ETElOR19PVVRQVVRfRElSID0gJy9hc3NldC1vdXRwdXQnO1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGFzc2V0IGhhc2ggY2FjaGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2xlYXJBc3NldEhhc2hDYWNoZSgpIHtcbiAgICB0aGlzLmFzc2V0Q2FjaGUuY2xlYXIoKTtcbiAgICBjbGVhckxhcmdlRmlsZUZpbmdlcnByaW50Q2FjaGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSBvZiBhc3NldCBoYXNoZXMgYmFzZWQgb24gYXNzZXQgY29uZmlndXJhdGlvbiB0byBhdm9pZCByZXBlYXRlZCBmaWxlXG4gICAqIHN5c3RlbSBhbmQgYnVuZGxpbmcgb3BlcmF0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGFzc2V0Q2FjaGUgPSBuZXcgQ2FjaGU8U3RhZ2VkQXNzZXQ+KCk7XG5cbiAgLyoqXG4gICAqIEFic29sdXRlIHBhdGggdG8gdGhlIGFzc2V0IGRhdGEuXG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBqdXN0IGJlIHRoZSBzb3VyY2UgcGF0aCBvclxuICAgKiBhIHRlbXBvcmFyeSBkaXJlY3RvcnkgdXNlZCBmb3IgYnVuZGxpbmcuXG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZW5hYmxlZCBpdCB3aWxsIGJlIHRoZSBzdGFnZWQgcGF0aC5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiB5b3UgYXJlIGdvaW5nIHRvIGNhbGwgYGFkZEZpbGVBc3NldCgpYCwgdXNlXG4gICAqIGByZWxhdGl2ZVN0YWdlZFBhdGgoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgLSBVc2UgYGFic29sdXRlU3RhZ2VkUGF0aGAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGFnZWRQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFic29sdXRlIHBhdGggdG8gdGhlIGFzc2V0IGRhdGEuXG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBqdXN0IGJlIHRoZSBzb3VyY2UgcGF0aCBvclxuICAgKiBhIHRlbXBvcmFyeSBkaXJlY3RvcnkgdXNlZCBmb3IgYnVuZGxpbmcuXG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZW5hYmxlZCBpdCB3aWxsIGJlIHRoZSBzdGFnZWQgcGF0aC5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiB5b3UgYXJlIGdvaW5nIHRvIGNhbGwgYGFkZEZpbGVBc3NldCgpYCwgdXNlXG4gICAqIGByZWxhdGl2ZVN0YWdlZFBhdGgoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhYnNvbHV0ZVN0YWdlZFBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFic29sdXRlIHBhdGggb2YgdGhlIGFzc2V0IGFzIGl0IHdhcyByZWZlcmVuY2VkIGJ5IHRoZSB1c2VyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogQSBjcnlwdG9ncmFwaGljIGhhc2ggb2YgdGhlIGFzc2V0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzc2V0SGFzaDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBIb3cgdGhpcyBhc3NldCBzaG91bGQgYmUgcGFja2FnZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBhc3NldCBpcyBhbiBhcmNoaXZlICh6aXAgb3IgamFyKS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpc0FyY2hpdmU6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSByZWFkb25seSBmaW5nZXJwcmludE9wdGlvbnM6IEZpbmdlcnByaW50T3B0aW9ucztcblxuICBwcml2YXRlIHJlYWRvbmx5IGhhc2hUeXBlOiBBc3NldEhhc2hUeXBlO1xuICBwcml2YXRlIHJlYWRvbmx5IGFzc2V0T3V0ZGlyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHNvdXJjZSBmaW5nZXJwcmludCBnaXZlbiBieSB0aGUgdXNlclxuICAgKlxuICAgKiBXaWxsIG5vdCBiZSB1c2VkIGxpdGVyYWxseSwgYWx3YXlzIGhhc2hlZCBsYXRlciBvbi5cbiAgICovXG4gIHByaXZhdGUgY3VzdG9tU291cmNlRmluZ2VycHJpbnQ/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZUtleTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc291cmNlU3RhdHM6IGZzLlN0YXRzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBc3NldFN0YWdpbmdQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzYWx0ID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoQVNTRVRfU0FMVF9DT05URVhUX0tFWSk7XG5cbiAgICB0aGlzLnNvdXJjZVBhdGggPSBwYXRoLnJlc29sdmUocHJvcHMuc291cmNlUGF0aCk7XG4gICAgdGhpcy5maW5nZXJwcmludE9wdGlvbnMgPSB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGV4dHJhSGFzaDogcHJvcHMuZXh0cmFIYXNoIHx8IHNhbHQgPyBgJHtwcm9wcy5leHRyYUhhc2ggPz8gJyd9JHtzYWx0ID8/ICcnfWAgOiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLnNvdXJjZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGFzc2V0IGF0ICR7dGhpcy5zb3VyY2VQYXRofWApO1xuICAgIH1cblxuICAgIHRoaXMuc291cmNlU3RhdHMgPSBmcy5zdGF0U3luYyh0aGlzLnNvdXJjZVBhdGgpO1xuXG4gICAgY29uc3Qgb3V0ZGlyID0gU3RhZ2Uub2YodGhpcyk/LmFzc2V0T3V0ZGlyO1xuICAgIGlmICghb3V0ZGlyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBkZXRlcm1pbmUgY2xvdWQgYXNzZW1ibHkgYXNzZXQgb3V0cHV0IGRpcmVjdG9yeS4gQXNzZXRzIG11c3QgYmUgZGVmaW5lZCBpbmRpcmVjdGx5IHdpdGhpbiBhIFwiU3RhZ2VcIiBvciBhbiBcIkFwcFwiIHNjb3BlJyk7XG4gICAgfVxuICAgIHRoaXMuYXNzZXRPdXRkaXIgPSBvdXRkaXI7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIGhhc2ggdHlwZSBiYXNlZCBvbiB0aGUgcHJvcHMgYXMgcHJvcHMuYXNzZXRIYXNoVHlwZSBpc1xuICAgIC8vIG9wdGlvbmFsIGZyb20gYSBjYWxsZXIgcGVyc3BlY3RpdmUuXG4gICAgdGhpcy5jdXN0b21Tb3VyY2VGaW5nZXJwcmludCA9IHByb3BzLmFzc2V0SGFzaDtcbiAgICB0aGlzLmhhc2hUeXBlID0gZGV0ZXJtaW5lSGFzaFR5cGUocHJvcHMuYXNzZXRIYXNoVHlwZSwgdGhpcy5jdXN0b21Tb3VyY2VGaW5nZXJwcmludCk7XG5cbiAgICAvLyBEZWNpZGUgd2hhdCB3ZSdyZSBnb2luZyB0byBkbywgd2l0aG91dCBhY3R1YWxseSBkb2luZyBpdCB5ZXRcbiAgICBsZXQgc3RhZ2VUaGlzQXNzZXQ6ICgpID0+IFN0YWdlZEFzc2V0O1xuICAgIGxldCBza2lwID0gZmFsc2U7XG4gICAgaWYgKHByb3BzLmJ1bmRsaW5nKSB7XG4gICAgICAvLyBDaGVjayBpZiB3ZSBhY3R1YWxseSBoYXZlIHRvIGJ1bmRsZSBmb3IgdGhpcyBzdGFja1xuICAgICAgc2tpcCA9ICFTdGFjay5vZih0aGlzKS5idW5kbGluZ1JlcXVpcmVkO1xuICAgICAgY29uc3QgYnVuZGxpbmcgPSBwcm9wcy5idW5kbGluZztcbiAgICAgIHN0YWdlVGhpc0Fzc2V0ID0gKCkgPT4gdGhpcy5zdGFnZUJ5QnVuZGxpbmcoYnVuZGxpbmcsIHNraXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFnZVRoaXNBc3NldCA9ICgpID0+IHRoaXMuc3RhZ2VCeUNvcHlpbmcoKTtcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgYSBjYWNoZSBrZXkgZnJvbSB0aGUgcHJvcHMuIFRoaXMgd2F5IHdlIGNhbiBjaGVjayBpZiB3ZSBhbHJlYWR5XG4gICAgLy8gc3RhZ2VkIHRoaXMgYXNzZXQgYW5kIHJldXNlIHRoZSByZXN1bHQgKGUuZy4gdGhlIHNhbWUgYXNzZXQgd2l0aCB0aGUgc2FtZVxuICAgIC8vIGNvbmZpZ3VyYXRpb24gaXMgdXNlZCBpbiBtdWx0aXBsZSBzdGFja3MpLiBJbiB0aGlzIGNhc2Ugd2UgY2FuIGNvbXBsZXRlbHlcbiAgICAvLyBza2lwIGZpbGUgc3lzdGVtIGFuZCBidW5kbGluZyBvcGVyYXRpb25zLlxuICAgIC8vXG4gICAgLy8gVGhlIG91dHB1dCBkaXJlY3RvcnkgYW5kIHdoZXRoZXIgdGhpcyBhc3NldCBpcyBza2lwcGVkIG9yIG5vdCBzaG91bGQgYWxzbyBiZVxuICAgIC8vIHBhcnQgb2YgdGhlIGNhY2hlIGtleSB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IHJldHVybiB0aGUgd3JvbmdcbiAgICAvLyBzdGFnZWQgYXNzZXQgZnJvbSB0aGUgY2FjaGUuXG4gICAgdGhpcy5jYWNoZUtleSA9IGNhbGN1bGF0ZUNhY2hlS2V5KHtcbiAgICAgIG91dGRpcjogdGhpcy5hc3NldE91dGRpcixcbiAgICAgIHNvdXJjZVBhdGg6IHBhdGgucmVzb2x2ZShwcm9wcy5zb3VyY2VQYXRoKSxcbiAgICAgIGJ1bmRsaW5nOiBwcm9wcy5idW5kbGluZyxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IHRoaXMuaGFzaFR5cGUsXG4gICAgICBjdXN0b21GaW5nZXJwcmludDogdGhpcy5jdXN0b21Tb3VyY2VGaW5nZXJwcmludCxcbiAgICAgIGV4dHJhSGFzaDogcHJvcHMuZXh0cmFIYXNoLFxuICAgICAgZXhjbHVkZTogcHJvcHMuZXhjbHVkZSxcbiAgICAgIGlnbm9yZU1vZGU6IHByb3BzLmlnbm9yZU1vZGUsXG4gICAgICBza2lwLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhZ2VkID0gQXNzZXRTdGFnaW5nLmFzc2V0Q2FjaGUub2J0YWluKHRoaXMuY2FjaGVLZXksIHN0YWdlVGhpc0Fzc2V0KTtcbiAgICB0aGlzLnN0YWdlZFBhdGggPSBzdGFnZWQuc3RhZ2VkUGF0aDtcbiAgICB0aGlzLmFic29sdXRlU3RhZ2VkUGF0aCA9IHN0YWdlZC5zdGFnZWRQYXRoO1xuICAgIHRoaXMuYXNzZXRIYXNoID0gc3RhZ2VkLmFzc2V0SGFzaDtcbiAgICB0aGlzLnBhY2thZ2luZyA9IHN0YWdlZC5wYWNrYWdpbmc7XG4gICAgdGhpcy5pc0FyY2hpdmUgPSBzdGFnZWQuaXNBcmNoaXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY3J5cHRvZ3JhcGhpYyBoYXNoIG9mIHRoZSBhc3NldC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgc2VlIGBhc3NldEhhc2hgLlxuICAgKi9cbiAgcHVibGljIGdldCBzb3VyY2VIYXNoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXNzZXRIYXNoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcGF0aCB0byB0aGUgc3RhZ2VkIGFzc2V0LCByZWxhdGl2ZSB0byB0aGUgQ2xvdWQgQXNzZW1ibHkgKG1hbmlmZXN0KSBkaXJlY3Rvcnkgb2YgdGhlIGdpdmVuIHN0YWNrXG4gICAqXG4gICAqIE9ubHkgcmV0dXJucyBhIHJlbGF0aXZlIHBhdGggaWYgdGhlIGFzc2V0IHdhcyBzdGFnZWQsIHJldHVybnMgYW4gYWJzb2x1dGUgcGF0aCBpZlxuICAgKiBpdCB3YXMgbm90IHN0YWdlZC5cbiAgICpcbiAgICogQSBidW5kbGVkIGFzc2V0IG1pZ2h0IGVuZCB1cCBpbiB0aGUgb3V0RGlyIGFuZCBzdGlsbCBub3QgY291bnQgYXNcbiAgICogXCJzdGFnZWRcIjsgaWYgYXNzZXQgc3RhZ2luZyBpcyBkaXNhYmxlZCB3ZSdyZSB0ZWNobmljYWxseSBleHBlY3RlZCB0b1xuICAgKiByZWZlcmVuY2Ugc291cmNlIGRpcmVjdG9yaWVzLCBidXQgd2UgZG9uJ3QgaGF2ZSBhIHNvdXJjZSBkaXJlY3RvcnkgZm9yIHRoZVxuICAgKiBidW5kbGVkIG91dHB1dHMgKGFzIHRoZSBidW5kbGUgb3V0cHV0IGlzIHdyaXR0ZW4gdG8gYSB0ZW1wb3JhcnlcbiAgICogZGlyZWN0b3J5KS4gTmV2ZXJ0aGVsZXNzLCB3ZSB3aWxsIHN0aWxsIHJldHVybiBhbiBhYnNvbHV0ZSBwYXRoLlxuICAgKlxuICAgKiBBIG5vbi1vYnZpb3VzIGRpcmVjdG9yeSBsYXlvdXQgbWF5IGxvb2sgbGlrZSB0aGlzOlxuICAgKlxuICAgKiBgYGBcbiAgICogICBDTE9VRCBBU1NFTUJMWSBST09UXG4gICAqICAgICArLS0gYXNzZXQuMTIzNDVhYmNkZWYvXG4gICAqICAgICArLS0gYXNzZW1ibHktU3RhZ2VcbiAgICogICAgICAgICAgICstLSBNeVN0YWNrLnRlbXBsYXRlLmpzb25cbiAgICogICAgICAgICAgICstLSBNeVN0YWNrLmFzc2V0cy5qc29uIDwtIHdpbGwgY29udGFpbiB7IFwicGF0aFwiOiBcIi4uL2Fzc2V0LjEyMzQ1YWJjZGVmXCIgfVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyByZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2s6IFN0YWNrKSB7XG4gICAgY29uc3QgYXNtTWFuaWZlc3REaXIgPSBTdGFnZS5vZihzdGFjayk/Lm91dGRpcjtcbiAgICBpZiAoIWFzbU1hbmlmZXN0RGlyKSB7IHJldHVybiB0aGlzLnN0YWdlZFBhdGg7IH1cblxuICAgIGNvbnN0IGlzT3V0c2lkZUFzc2V0RGlyID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmFzc2V0T3V0ZGlyLCB0aGlzLnN0YWdlZFBhdGgpLnN0YXJ0c1dpdGgoJy4uJyk7XG4gICAgaWYgKGlzT3V0c2lkZUFzc2V0RGlyIHx8IHRoaXMuc3RhZ2luZ0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFnZWRQYXRoO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGFzbU1hbmlmZXN0RGlyLCB0aGlzLnN0YWdlZFBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YWdlIHRoZSBzb3VyY2UgdG8gdGhlIHRhcmdldCBieSBjb3B5aW5nXG4gICAqXG4gICAqIE9wdGlvbmFsbHkgc2tpcCBpZiBzdGFnaW5nIGlzIGRpc2FibGVkLCBpbiB3aGljaCBjYXNlIHdlIHByZXRlbmQgd2UgZGlkIHNvbWV0aGluZyBidXQgd2UgZG9uJ3QgcmVhbGx5LlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFnZUJ5Q29weWluZygpOiBTdGFnZWRBc3NldCB7XG4gICAgY29uc3QgYXNzZXRIYXNoID0gdGhpcy5jYWxjdWxhdGVIYXNoKHRoaXMuaGFzaFR5cGUpO1xuICAgIGNvbnN0IHN0YWdlZFBhdGggPSB0aGlzLnN0YWdpbmdEaXNhYmxlZFxuICAgICAgPyB0aGlzLnNvdXJjZVBhdGhcbiAgICAgIDogcGF0aC5yZXNvbHZlKHRoaXMuYXNzZXRPdXRkaXIsIHJlbmRlckFzc2V0RmlsZW5hbWUoYXNzZXRIYXNoLCBnZXRFeHRlbnNpb24odGhpcy5zb3VyY2VQYXRoKSkpO1xuXG4gICAgaWYgKCF0aGlzLnNvdXJjZVN0YXRzLmlzRGlyZWN0b3J5KCkgJiYgIXRoaXMuc291cmNlU3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgJHt0aGlzLnNvdXJjZVBhdGh9IGlzIGV4cGVjdGVkIHRvIGJlIGVpdGhlciBhIGRpcmVjdG9yeSBvciBhIHJlZ3VsYXIgZmlsZWApO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2VBc3NldCh0aGlzLnNvdXJjZVBhdGgsIHN0YWdlZFBhdGgsICdjb3B5Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYXNzZXRIYXNoLFxuICAgICAgc3RhZ2VkUGF0aCxcbiAgICAgIHBhY2thZ2luZzogdGhpcy5zb3VyY2VTdGF0cy5pc0RpcmVjdG9yeSgpID8gRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUlkgOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIGlzQXJjaGl2ZTogdGhpcy5zb3VyY2VTdGF0cy5pc0RpcmVjdG9yeSgpIHx8IEFSQ0hJVkVfRVhURU5TSU9OUy5pbmNsdWRlcyhnZXRFeHRlbnNpb24odGhpcy5zb3VyY2VQYXRoKS50b0xvd2VyQ2FzZSgpKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YWdlIHRoZSBzb3VyY2UgdG8gdGhlIHRhcmdldCBieSBidW5kbGluZ1xuICAgKlxuICAgKiBPcHRpb25hbGx5IHNraXAsIGluIHdoaWNoIGNhc2Ugd2UgcHJldGVuZCB3ZSBkaWQgc29tZXRoaW5nIGJ1dCB3ZSBkb24ndCByZWFsbHkuXG4gICAqL1xuICBwcml2YXRlIHN0YWdlQnlCdW5kbGluZyhidW5kbGluZzogQnVuZGxpbmdPcHRpb25zLCBza2lwOiBib29sZWFuKTogU3RhZ2VkQXNzZXQge1xuICAgIGlmICghdGhpcy5zb3VyY2VTdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0ICR7dGhpcy5zb3VyY2VQYXRofSBpcyBleHBlY3RlZCB0byBiZSBhIGRpcmVjdG9yeSB3aGVuIGJ1bmRsaW5nYCk7XG4gICAgfVxuXG4gICAgaWYgKHNraXApIHtcbiAgICAgIC8vIFdlIHNob3VsZCBoYXZlIGJ1bmRsZWQsIGJ1dCBkaWRuJ3QgdG8gc2F2ZSB0aW1lLiBTdGlsbCBwcmV0ZW5kIHRvIGhhdmUgYSBoYXNoLlxuICAgICAgLy8gSWYgdGhlIGFzc2V0IHVzZXMgT1VUUFVUIG9yIEJVTkRMRSwgd2UgdXNlIGEgQ1VTVE9NIGhhc2ggdG8gYXZvaWQgZmluZ2VycHJpbnRpbmdcbiAgICAgIC8vIGEgcG90ZW50aWFsbHkgdmVyeSBsYXJnZSBzb3VyY2UgZGlyZWN0b3J5LiBPdGhlciBoYXNoIHR5cGVzIGFyZSBrZXB0IHRoZSBzYW1lLlxuICAgICAgbGV0IGhhc2hUeXBlID0gdGhpcy5oYXNoVHlwZTtcbiAgICAgIGlmIChoYXNoVHlwZSA9PT0gQXNzZXRIYXNoVHlwZS5PVVRQVVQgfHwgaGFzaFR5cGUgPT09IEFzc2V0SGFzaFR5cGUuQlVORExFKSB7XG4gICAgICAgIHRoaXMuY3VzdG9tU291cmNlRmluZ2VycHJpbnQgPSBOYW1lcy51bmlxdWVJZCh0aGlzKTtcbiAgICAgICAgaGFzaFR5cGUgPSBBc3NldEhhc2hUeXBlLkNVU1RPTTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFzc2V0SGFzaDogdGhpcy5jYWxjdWxhdGVIYXNoKGhhc2hUeXBlLCBidW5kbGluZyksXG4gICAgICAgIHN0YWdlZFBhdGg6IHRoaXMuc291cmNlUGF0aCxcbiAgICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuWklQX0RJUkVDVE9SWSxcbiAgICAgICAgaXNBcmNoaXZlOiB0cnVlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gY2FsY3VsYXRlIGFzc2V0SGFzaCBiZWZvcmVoYW5kIChpZiB3ZSBjYW4pXG4gICAgbGV0IGFzc2V0SGFzaCA9IHRoaXMuaGFzaFR5cGUgPT09IEFzc2V0SGFzaFR5cGUuU09VUkNFIHx8IHRoaXMuaGFzaFR5cGUgPT09IEFzc2V0SGFzaFR5cGUuQ1VTVE9NXG4gICAgICA/IHRoaXMuY2FsY3VsYXRlSGFzaCh0aGlzLmhhc2hUeXBlLCBidW5kbGluZylcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYnVuZGxlRGlyID0gdGhpcy5kZXRlcm1pbmVCdW5kbGVEaXIodGhpcy5hc3NldE91dGRpciwgYXNzZXRIYXNoKTtcbiAgICB0aGlzLmJ1bmRsZShidW5kbGluZywgYnVuZGxlRGlyKTtcblxuICAgIC8vIENoZWNrIGJ1bmRsaW5nIG91dHB1dCBjb250ZW50IGFuZCBkZXRlcm1pbmUgaWYgd2Ugd2lsbCBuZWVkIHRvIGFyY2hpdmVcbiAgICBjb25zdCBidW5kbGluZ091dHB1dFR5cGUgPSBidW5kbGluZy5vdXRwdXRUeXBlID8/IEJ1bmRsaW5nT3V0cHV0LkFVVE9fRElTQ09WRVI7XG4gICAgY29uc3QgYnVuZGxlZEFzc2V0ID0gZGV0ZXJtaW5lQnVuZGxlZEFzc2V0KGJ1bmRsZURpciwgYnVuZGxpbmdPdXRwdXRUeXBlKTtcblxuICAgIC8vIENhbGN1bGF0ZSBhc3NldEhhc2ggYWZ0ZXJ3YXJkcyBpZiB3ZSBzdGlsbCBtdXN0XG4gICAgYXNzZXRIYXNoID0gYXNzZXRIYXNoID8/IHRoaXMuY2FsY3VsYXRlSGFzaCh0aGlzLmhhc2hUeXBlLCBidW5kbGluZywgYnVuZGxlZEFzc2V0LnBhdGgpO1xuXG4gICAgY29uc3Qgc3RhZ2VkUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLmFzc2V0T3V0ZGlyLCByZW5kZXJBc3NldEZpbGVuYW1lKGFzc2V0SGFzaCwgYnVuZGxlZEFzc2V0LmV4dGVuc2lvbikpO1xuXG4gICAgdGhpcy5zdGFnZUFzc2V0KGJ1bmRsZWRBc3NldC5wYXRoLCBzdGFnZWRQYXRoLCAnbW92ZScpO1xuXG4gICAgLy8gSWYgYnVuZGxpbmcgcHJvZHVjZWQgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIHdlIFwidG91Y2hcIiB0aGlzIGZpbGUgaW4gdGhlIGJ1bmRsaW5nXG4gICAgLy8gZGlyZWN0b3J5IGFmdGVyIGl0IGhhcyBiZWVuIG1vdmVkIHRvIHRoZSBzdGFnaW5nIGRpcmVjdG9yeS4gVGhpcyB3YXkgaWYgYnVuZGxpbmdcbiAgICAvLyBpcyBza2lwcGVkIGJlY2F1c2UgdGhlIGJ1bmRsaW5nIGRpcmVjdG9yeSBhbHJlYWR5IGV4aXN0cyB3ZSBjYW4gc3RpbGwgZGV0ZXJtaW5lXG4gICAgLy8gdGhlIGNvcnJlY3QgcGFja2FnaW5nIHR5cGUuXG4gICAgaWYgKGJ1bmRsZWRBc3NldC5wYWNrYWdpbmcgPT09IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKSB7XG4gICAgICBmcy5jbG9zZVN5bmMoZnMub3BlblN5bmMoYnVuZGxlZEFzc2V0LnBhdGgsICd3JykpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhc3NldEhhc2gsXG4gICAgICBzdGFnZWRQYXRoLFxuICAgICAgcGFja2FnaW5nOiBidW5kbGVkQXNzZXQucGFja2FnaW5nLFxuICAgICAgaXNBcmNoaXZlOiB0cnVlLCAvLyBidW5kbGluZyBhbHdheXMgcHJvZHVjZXMgYW4gYXJjaGl2ZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBzdGFnaW5nIGhhcyBiZWVuIGRpc2FibGVkXG4gICAqL1xuICBwcml2YXRlIGdldCBzdGFnaW5nRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5ub2RlLnRyeUdldENvbnRleHQoY3hhcGkuRElTQUJMRV9BU1NFVF9TVEFHSU5HX0NPTlRFWFQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBvciBtb3ZlcyB0aGUgZmlsZXMgZnJvbSBzb3VyY2VQYXRoIHRvIHRhcmdldFBhdGguXG4gICAqXG4gICAqIE1vdmluZyBpbXBsaWVzIHRoZSBzb3VyY2UgZGlyZWN0b3J5IGlzIHRlbXBvcmFyeSBhbmQgY2FuIGJlIHRyYXNoZWQuXG4gICAqXG4gICAqIFdpbGwgbm90IGRvIGFueXRoaW5nIGlmIHNvdXJjZSBhbmQgdGFyZ2V0IGFyZSB0aGUgc2FtZS5cbiAgICovXG4gIHByaXZhdGUgc3RhZ2VBc3NldChzb3VyY2VQYXRoOiBzdHJpbmcsIHRhcmdldFBhdGg6IHN0cmluZywgc3R5bGU6ICdtb3ZlJyB8ICdjb3B5Jykge1xuICAgIC8vIElzIHRoZSB3b3JrIGFscmVhZHkgZG9uZT9cbiAgICBjb25zdCBpc0FscmVhZHlTdGFnZWQgPSBmcy5leGlzdHNTeW5jKHRhcmdldFBhdGgpO1xuICAgIGlmIChpc0FscmVhZHlTdGFnZWQpIHtcbiAgICAgIGlmIChzdHlsZSA9PT0gJ21vdmUnICYmIHNvdXJjZVBhdGggIT09IHRhcmdldFBhdGgpIHtcbiAgICAgICAgZnMucmVtb3ZlU3luYyhzb3VyY2VQYXRoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNb3ZpbmcgY2FuIGJlIGRvbmUgcXVpY2tseVxuICAgIGlmIChzdHlsZSA9PSAnbW92ZScpIHtcbiAgICAgIGZzLnJlbmFtZVN5bmMoc291cmNlUGF0aCwgdGFyZ2V0UGF0aCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29weSBmaWxlL2RpcmVjdG9yeSB0byBzdGFnaW5nIGRpcmVjdG9yeVxuICAgIGlmICh0aGlzLnNvdXJjZVN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICBmcy5jb3B5RmlsZVN5bmMoc291cmNlUGF0aCwgdGFyZ2V0UGF0aCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZVN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGZzLm1rZGlyU3luYyh0YXJnZXRQYXRoKTtcbiAgICAgIEZpbGVTeXN0ZW0uY29weURpcmVjdG9yeShzb3VyY2VQYXRoLCB0YXJnZXRQYXRoLCB0aGlzLmZpbmdlcnByaW50T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBmaWxlIHR5cGU6ICR7c291cmNlUGF0aH1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBkaXJlY3Rvcnkgd2hlcmUgd2UncmUgZ29pbmcgdG8gd3JpdGUgdGhlIGJ1bmRsaW5nIG91dHB1dFxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSB0YXJnZXQgZGlyZWN0b3J5IHdoZXJlIHdlJ3JlIGdvaW5nIHRvIHdyaXRlIHRoZSBzdGFnZWQgb3V0cHV0XG4gICAqIGZpbGVzIGlmIHdlIGNhbiAoaWYgdGhlIGhhc2ggaXMgZnVsbHkga25vd24pLCBvciBhIHRlbXBvcmFyeSBkaXJlY3RvcnlcbiAgICogb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHJpdmF0ZSBkZXRlcm1pbmVCdW5kbGVEaXIob3V0ZGlyOiBzdHJpbmcsIHNvdXJjZUhhc2g/OiBzdHJpbmcpIHtcbiAgICBpZiAoc291cmNlSGFzaCkge1xuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShvdXRkaXIsIHJlbmRlckFzc2V0RmlsZW5hbWUoc291cmNlSGFzaCkpO1xuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIGFzc2V0IGhhc2ggaXNuJ3Qga25vd24gaW4gYWR2YW5jZSwgYnVuZGxlciBvdXRwdXRzIHRvIGFuXG4gICAgLy8gaW50ZXJtZWRpYXRlIGRpcmVjdG9yeSBuYW1lZCBhZnRlciB0aGUgYXNzZXQncyBjYWNoZSBrZXlcbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKG91dGRpciwgYGJ1bmRsaW5nLXRlbXAtJHt0aGlzLmNhY2hlS2V5fWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1bmRsZXMgYW4gYXNzZXQgdG8gdGhlIGdpdmVuIGRpcmVjdG9yeVxuICAgKlxuICAgKiBJZiB0aGUgZ2l2ZW4gZGlyZWN0b3J5IGFscmVhZHkgZXhpc3RzLCBhc3N1bWUgdGhhdCBldmVyeXRoaW5nJ3MgYWxyZWFkeVxuICAgKiBpbiBvcmRlciBhbmQgZG9uJ3QgZG8gYW55dGhpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIEJ1bmRsaW5nIG9wdGlvbnNcbiAgICogQHBhcmFtIGJ1bmRsZURpciBXaGVyZSB0byBjcmVhdGUgdGhlIGJ1bmRsZSBkaXJlY3RvcnlcbiAgICogQHJldHVybnMgVGhlIGZ1bGx5IHJlc29sdmVkIGJ1bmRsZSBvdXRwdXQgZGlyZWN0b3J5LlxuICAgKi9cbiAgcHJpdmF0ZSBidW5kbGUob3B0aW9uczogQnVuZGxpbmdPcHRpb25zLCBidW5kbGVEaXI6IHN0cmluZykge1xuICAgIGlmIChmcy5leGlzdHNTeW5jKGJ1bmRsZURpcikpIHsgcmV0dXJuOyB9XG5cbiAgICBmcy5lbnN1cmVEaXJTeW5jKGJ1bmRsZURpcik7XG4gICAgLy8gQ2htb2QgdGhlIGJ1bmRsZURpciB0byBmdWxsIGFjY2Vzcy5cbiAgICBmcy5jaG1vZFN5bmMoYnVuZGxlRGlyLCAwbzc3Nyk7XG5cbiAgICBsZXQgbG9jYWxCdW5kbGluZzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUoYEJ1bmRsaW5nIGFzc2V0ICR7dGhpcy5ub2RlLnBhdGh9Li4uXFxuYCk7XG5cbiAgICAgIGxvY2FsQnVuZGxpbmcgPSBvcHRpb25zLmxvY2FsPy50cnlCdW5kbGUoYnVuZGxlRGlyLCBvcHRpb25zKTtcbiAgICAgIGlmICghbG9jYWxCdW5kbGluZykge1xuICAgICAgICBjb25zdCBhc3NldFN0YWdpbmdPcHRpb25zID0ge1xuICAgICAgICAgIHNvdXJjZVBhdGg6IHRoaXMuc291cmNlUGF0aCxcbiAgICAgICAgICBidW5kbGVEaXIsXG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfTtcblxuICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuYnVuZGxpbmdGaWxlQWNjZXNzKSB7XG4gICAgICAgICAgY2FzZSBCdW5kbGluZ0ZpbGVBY2Nlc3MuVk9MVU1FX0NPUFk6XG4gICAgICAgICAgICBuZXcgQXNzZXRCdW5kbGluZ1ZvbHVtZUNvcHkoYXNzZXRTdGFnaW5nT3B0aW9ucykucnVuKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEJ1bmRsaW5nRmlsZUFjY2Vzcy5CSU5EX01PVU5UOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBuZXcgQXNzZXRCdW5kbGluZ0JpbmRNb3VudChhc3NldFN0YWdpbmdPcHRpb25zKS5ydW4oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBXaGVuIGJ1bmRsaW5nIGZhaWxzLCBrZWVwIHRoZSBidW5kbGUgb3V0cHV0IGZvciBkaWFnbm9zYWJpbGl0eSwgYnV0XG4gICAgICAvLyByZW5hbWUgaXQgb3V0IG9mIHRoZSB3YXkgc28gdGhhdCB0aGUgbmV4dCBydW4gZG9lc24ndCBhc3N1bWUgaXQgaGFzIGFcbiAgICAgIC8vIHZhbGlkIGJ1bmRsZURpci5cbiAgICAgIGNvbnN0IGJ1bmRsZUVycm9yRGlyID0gYnVuZGxlRGlyICsgJy1lcnJvcic7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhidW5kbGVFcnJvckRpcikpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYXN0IGJ1bmRsZUVycm9yRGlyLlxuICAgICAgICBmcy5yZW1vdmVTeW5jKGJ1bmRsZUVycm9yRGlyKTtcbiAgICAgIH1cblxuICAgICAgZnMucmVuYW1lU3luYyhidW5kbGVEaXIsIGJ1bmRsZUVycm9yRGlyKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGJ1bmRsZSBhc3NldCAke3RoaXMubm9kZS5wYXRofSwgYnVuZGxlIG91dHB1dCBpcyBsb2NhdGVkIGF0ICR7YnVuZGxlRXJyb3JEaXJ9OiAke2Vycn1gKTtcbiAgICB9XG5cbiAgICBpZiAoRmlsZVN5c3RlbS5pc0VtcHR5KGJ1bmRsZURpcikpIHtcbiAgICAgIGNvbnN0IG91dHB1dERpciA9IGxvY2FsQnVuZGxpbmcgPyBidW5kbGVEaXIgOiBBc3NldFN0YWdpbmcuQlVORExJTkdfT1VUUFVUX0RJUjtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQnVuZGxpbmcgZGlkIG5vdCBwcm9kdWNlIGFueSBvdXRwdXQuIENoZWNrIHRoYXQgY29udGVudCBpcyB3cml0dGVuIHRvICR7b3V0cHV0RGlyfS5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZUhhc2goaGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUsIGJ1bmRsaW5nPzogQnVuZGxpbmdPcHRpb25zLCBvdXRwdXREaXI/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIFdoZW4gYnVuZGxpbmcgYSBDVVNUT00gb3IgU09VUkNFIGFzc2V0IGhhc2ggdHlwZSwgd2Ugd2FudCB0aGUgaGFzaCB0byBpbmNsdWRlXG4gICAgLy8gdGhlIGJ1bmRsaW5nIGNvbmZpZ3VyYXRpb24uIFdlIGhhbmRsZSBDVVNUT00gYW5kIGJ1bmRsZWQgU09VUkNFIGhhc2ggdHlwZXNcbiAgICAvLyBhcyBhIHNwZWNpYWwgY2FzZSB0byBwcmVzZXJ2ZSBleGlzdGluZyB1c2VyIGFzc2V0IGhhc2hlcyBpbiBhbGwgb3RoZXIgY2FzZXMuXG4gICAgaWYgKGhhc2hUeXBlID09IEFzc2V0SGFzaFR5cGUuQ1VTVE9NIHx8IChoYXNoVHlwZSA9PSBBc3NldEhhc2hUeXBlLlNPVVJDRSAmJiBidW5kbGluZykpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2Jyk7XG5cbiAgICAgIC8vIGlmIGFzc2V0IGhhc2ggaXMgcHJvdmlkZWQgYnkgdXNlciwgdXNlIGl0LCBvdGhlcndpc2UgZmluZ2VycHJpbnQgdGhlIHNvdXJjZS5cbiAgICAgIGhhc2gudXBkYXRlKHRoaXMuY3VzdG9tU291cmNlRmluZ2VycHJpbnQgPz8gRmlsZVN5c3RlbS5maW5nZXJwcmludCh0aGlzLnNvdXJjZVBhdGgsIHRoaXMuZmluZ2VycHJpbnRPcHRpb25zKSk7XG5cbiAgICAgIC8vIElmIHdlJ3JlIGJ1bmRsaW5nIGFuIGFzc2V0LCBpbmNsdWRlIHRoZSBidW5kbGluZyBjb25maWd1cmF0aW9uIGluIHRoZSBoYXNoXG4gICAgICBpZiAoYnVuZGxpbmcpIHtcbiAgICAgICAgaGFzaC51cGRhdGUoSlNPTi5zdHJpbmdpZnkoYnVuZGxpbmcpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhhc2guZGlnZXN0KCdoZXgnKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGhhc2hUeXBlKSB7XG4gICAgICBjYXNlIEFzc2V0SGFzaFR5cGUuU09VUkNFOlxuICAgICAgICByZXR1cm4gRmlsZVN5c3RlbS5maW5nZXJwcmludCh0aGlzLnNvdXJjZVBhdGgsIHRoaXMuZmluZ2VycHJpbnRPcHRpb25zKTtcbiAgICAgIGNhc2UgQXNzZXRIYXNoVHlwZS5CVU5ETEU6XG4gICAgICBjYXNlIEFzc2V0SGFzaFR5cGUuT1VUUFVUOlxuICAgICAgICBpZiAoIW91dHB1dERpcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSBcXGAke2hhc2hUeXBlfVxcYCBoYXNoIHR5cGUgd2hlbiBcXGBidW5kbGluZ1xcYCBpcyBub3Qgc3BlY2lmaWVkLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGaWxlU3lzdGVtLmZpbmdlcnByaW50KG91dHB1dERpciwgdGhpcy5maW5nZXJwcmludE9wdGlvbnMpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGFzc2V0IGhhc2ggdHlwZS4nKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQXNzZXRGaWxlbmFtZShhc3NldEhhc2g6IHN0cmluZywgZXh0ZW5zaW9uID0gJycpIHtcbiAgcmV0dXJuIGBhc3NldC4ke2Fzc2V0SGFzaH0ke2V4dGVuc2lvbn1gO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGhhc2ggdHlwZSBmcm9tIHVzZXItZ2l2ZW4gcHJvcCB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIGFzc2V0SGFzaFR5cGUgQXNzZXQgaGFzaCB0eXBlIGNvbnN0cnVjdCBwcm9wXG4gKiBAcGFyYW0gY3VzdG9tU291cmNlRmluZ2VycHJpbnQgQXNzZXQgaGFzaCBzZWVkIGdpdmVuIGluIHRoZSBjb25zdHJ1Y3QgcHJvcHNcbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5lSGFzaFR5cGUoYXNzZXRIYXNoVHlwZT86IEFzc2V0SGFzaFR5cGUsIGN1c3RvbVNvdXJjZUZpbmdlcnByaW50Pzogc3RyaW5nKSB7XG4gIGNvbnN0IGhhc2hUeXBlID0gY3VzdG9tU291cmNlRmluZ2VycHJpbnRcbiAgICA/IChhc3NldEhhc2hUeXBlID8/IEFzc2V0SGFzaFR5cGUuQ1VTVE9NKVxuICAgIDogKGFzc2V0SGFzaFR5cGUgPz8gQXNzZXRIYXNoVHlwZS5TT1VSQ0UpO1xuXG4gIGlmIChjdXN0b21Tb3VyY2VGaW5nZXJwcmludCAmJiBoYXNoVHlwZSAhPT0gQXNzZXRIYXNoVHlwZS5DVVNUT00pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzcGVjaWZ5IFxcYCR7YXNzZXRIYXNoVHlwZX1cXGAgZm9yIFxcYGFzc2V0SGFzaFR5cGVcXGAgd2hlbiBcXGBhc3NldEhhc2hcXGAgaXMgc3BlY2lmaWVkLiBVc2UgXFxgQ1VTVE9NXFxgIG9yIGxlYXZlIFxcYHVuZGVmaW5lZFxcYC5gKTtcbiAgfVxuICBpZiAoaGFzaFR5cGUgPT09IEFzc2V0SGFzaFR5cGUuQ1VTVE9NICYmICFjdXN0b21Tb3VyY2VGaW5nZXJwcmludCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYGFzc2V0SGFzaGAgbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBgYXNzZXRIYXNoVHlwZWAgaXMgc2V0IHRvIGBBc3NldEhhc2hUeXBlLkNVU1RPTWAuJyk7XG4gIH1cblxuICByZXR1cm4gaGFzaFR5cGU7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBhIGNhY2hlIGtleSBmcm9tIHRoZSBwcm9wcy4gTm9ybWFsaXplIGJ5IHNvcnRpbmcga2V5cy5cbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlQ2FjaGVLZXk8QSBleHRlbmRzIG9iamVjdD4ocHJvcHM6IEEpOiBzdHJpbmcge1xuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpXG4gICAgLnVwZGF0ZShKU09OLnN0cmluZ2lmeShzb3J0T2JqZWN0KHByb3BzKSkpXG4gICAgLmRpZ2VzdCgnaGV4Jyk7XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgc29ydCBvYmplY3Qga2V5c1xuICovXG5mdW5jdGlvbiBzb3J0T2JqZWN0KG9iamVjdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgb2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGNvbnN0IHJldDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpLnNvcnQoKSkge1xuICAgIHJldFtrZXldID0gc29ydE9iamVjdChvYmplY3Rba2V5XSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzaW5nbGUgYXJjaGl2ZSBmaWxlIG9mIGEgZGlyZWN0b3J5IG9yIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBzaW5nbGVBcmNoaXZlRmlsZShkaXJlY3Rvcnk6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXJlY3RvcnkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEaXJlY3RvcnkgJHtkaXJlY3Rvcnl9IGRvZXMgbm90IGV4aXN0LmApO1xuICB9XG5cbiAgaWYgKCFmcy5zdGF0U3luYyhkaXJlY3RvcnkpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZGlyZWN0b3J5fSBpcyBub3QgYSBkaXJlY3RvcnkuYCk7XG4gIH1cblxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZGRpclN5bmMoZGlyZWN0b3J5KTtcbiAgaWYgKGNvbnRlbnQubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgZmlsZSA9IHBhdGguam9pbihkaXJlY3RvcnksIGNvbnRlbnRbMF0pO1xuICAgIGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihjb250ZW50WzBdKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChmcy5zdGF0U3luYyhmaWxlKS5pc0ZpbGUoKSAmJiBBUkNISVZFX0VYVEVOU0lPTlMuaW5jbHVkZXMoZXh0ZW5zaW9uKSkge1xuICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuaW50ZXJmYWNlIEJ1bmRsZWRBc3NldCB7XG4gIHBhdGg6IHN0cmluZyxcbiAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcsXG4gIGV4dGVuc2lvbj86IHN0cmluZ1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGJ1bmRsZWQgYXNzZXQgdG8gdXNlIGJhc2VkIG9uIHRoZSBjb250ZW50IG9mIHRoZSBidW5kbGUgZGlyZWN0b3J5XG4gKiBhbmQgdGhlIHR5cGUgb2Ygb3V0cHV0LlxuICovXG5mdW5jdGlvbiBkZXRlcm1pbmVCdW5kbGVkQXNzZXQoYnVuZGxlRGlyOiBzdHJpbmcsIG91dHB1dFR5cGU6IEJ1bmRsaW5nT3V0cHV0KTogQnVuZGxlZEFzc2V0IHtcbiAgY29uc3QgYXJjaGl2ZUZpbGUgPSBzaW5nbGVBcmNoaXZlRmlsZShidW5kbGVEaXIpO1xuXG4gIC8vIGF1dG8tZGlzY292ZXIgbWVhbnMgdGhhdCBpZiB0aGVyZSBpcyBhbiBhcmNoaXZlIGZpbGUsIHdlIHRha2UgaXQgYXMgdGhlXG4gIC8vIGJ1bmRsZSwgb3RoZXJ3aXNlLCB3ZSB3aWxsIGFyY2hpdmUgaGVyZS5cbiAgaWYgKG91dHB1dFR5cGUgPT09IEJ1bmRsaW5nT3V0cHV0LkFVVE9fRElTQ09WRVIpIHtcbiAgICBvdXRwdXRUeXBlID0gYXJjaGl2ZUZpbGUgPyBCdW5kbGluZ091dHB1dC5BUkNISVZFRCA6IEJ1bmRsaW5nT3V0cHV0Lk5PVF9BUkNISVZFRDtcbiAgfVxuXG4gIHN3aXRjaCAob3V0cHV0VHlwZSkge1xuICAgIGNhc2UgQnVuZGxpbmdPdXRwdXQuTk9UX0FSQ0hJVkVEOlxuICAgICAgcmV0dXJuIHsgcGF0aDogYnVuZGxlRGlyLCBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZIH07XG4gICAgY2FzZSBCdW5kbGluZ091dHB1dC5BUkNISVZFRDpcbiAgICAgIGlmICghYXJjaGl2ZUZpbGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCdW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IGlzIGV4cGVjdGVkIHRvIGluY2x1ZGUgb25seSBhIHNpbmdsZSBhcmNoaXZlIGZpbGUgd2hlbiBgb3V0cHV0YCBpcyBzZXQgdG8gYEFSQ0hJVkVEYCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgcGF0aDogYXJjaGl2ZUZpbGUsIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsIGV4dGVuc2lvbjogZ2V0RXh0ZW5zaW9uKGFyY2hpdmVGaWxlKSB9O1xuICB9XG59XG5cbi8qKlxuKiBSZXR1cm4gdGhlIGV4dGVuc2lvbiBuYW1lIG9mIGEgc291cmNlIHBhdGhcbipcbiogTG9vcCB0aHJvdWdoIEFSQ0hJVkVfRVhURU5TSU9OUyBmb3IgdmFsaWQgYXJjaGl2ZSBleHRlbnNpb25zLlxuKi9cbmZ1bmN0aW9uIGdldEV4dGVuc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGZvciAoIGNvbnN0IGV4dCBvZiBBUkNISVZFX0VYVEVOU0lPTlMgKSB7XG4gICAgaWYgKHNvdXJjZS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKGV4dCkpIHtcbiAgICAgIHJldHVybiBleHQ7XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gcGF0aC5leHRuYW1lKHNvdXJjZSk7XG59O1xuXG4iXX0=