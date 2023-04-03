"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetStaging = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_AssetStagingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AssetStaging);
            }
            throw error;
        }
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
     * Clears the asset hash cache
     */
    static clearAssetHashCache() {
        this.assetCache.clear();
        fingerprint_1.clearLargeFileFingerprintCache();
    }
    /**
     * A cryptographic hash of the asset.
     *
     * @deprecated see `assetHash`.
     */
    get sourceHash() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.AssetStaging#sourceHash", "see `assetHash`.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "sourceHash").get);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.relativeStagedPath);
            }
            throw error;
        }
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
            isArchive: true,
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
_a = JSII_RTTI_SYMBOL_1;
AssetStaging[_a] = { fqn: "@aws-cdk/core.AssetStaging", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtc3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3Qix5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLCtCQUErQjtBQUMvQixxQ0FBMkU7QUFDM0UseUNBQWlGO0FBQ2pGLDZCQUFzRDtBQUN0RCxrREFBa0U7QUFDbEUsbUNBQWdDO0FBQ2hDLDJEQUEwRjtBQUMxRiwyQ0FBd0M7QUFDeEMsbUNBQWdDO0FBQ2hDLG1DQUFnQztBQUVoQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZFLE1BQU0sc0JBQXNCLEdBQUcsNkJBQTZCLENBQUM7QUFxQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBeUZ6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0ExRlIsWUFBWTs7OztRQTRGckIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsR0FBRztZQUN4QixHQUFHLEtBQUs7WUFDUixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQ3pGLENBQUM7UUFFRixJ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QUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBBc3NldEhhc2hUeXBlLCBBc3NldE9wdGlvbnMsIEZpbGVBc3NldFBhY2thZ2luZyB9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7IEJ1bmRsaW5nRmlsZUFjY2VzcywgQnVuZGxpbmdPcHRpb25zLCBCdW5kbGluZ091dHB1dCB9IGZyb20gJy4vYnVuZGxpbmcnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSwgRmluZ2VycHJpbnRPcHRpb25zIH0gZnJvbSAnLi9mcyc7XG5pbXBvcnQgeyBjbGVhckxhcmdlRmlsZUZpbmdlcnByaW50Q2FjaGUgfSBmcm9tICcuL2ZzL2ZpbmdlcnByaW50JztcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnLi9uYW1lcyc7XG5pbXBvcnQgeyBBc3NldEJ1bmRsaW5nVm9sdW1lQ29weSwgQXNzZXRCdW5kbGluZ0JpbmRNb3VudCB9IGZyb20gJy4vcHJpdmF0ZS9hc3NldC1zdGFnaW5nJztcbmltcG9ydCB7IENhY2hlIH0gZnJvbSAnLi9wcml2YXRlL2NhY2hlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4vc3RhZ2UnO1xuXG5jb25zdCBBUkNISVZFX0VYVEVOU0lPTlMgPSBbJy50YXIuZ3onLCAnLnppcCcsICcuamFyJywgJy50YXInLCAnLnRneiddO1xuXG5jb25zdCBBU1NFVF9TQUxUX0NPTlRFWFRfS0VZID0gJ0Bhd3MtY2RrL2NvcmU6YXNzZXRIYXNoU2FsdCc7XG5cbi8qKlxuICogQSBwcmV2aW91c2x5IHN0YWdlZCBhc3NldFxuICovXG5pbnRlcmZhY2UgU3RhZ2VkQXNzZXQge1xuICAvKipcbiAgICogVGhlIHBhdGggd2hlcmUgd2Ugd3JvdGUgdGhpcyBhc3NldCBwcmV2aW91c2x5XG4gICAqL1xuICByZWFkb25seSBzdGFnZWRQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBoYXNoIHdlIHVzZWQgcHJldmlvdXNseVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzZXRIYXNoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYWNrYWdpbmcgb2YgdGhlIGFzc2V0XG4gICAqL1xuICByZWFkb25seSBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZyxcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIGFzc2V0IGlzIGFuIGFyY2hpdmVcbiAgICovXG4gIHJlYWRvbmx5IGlzQXJjaGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzIGZvciBgQXNzZXRTdGFnaW5nYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NldFN0YWdpbmdQcm9wcyBleHRlbmRzIEZpbmdlcnByaW50T3B0aW9ucywgQXNzZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgZmlsZSBvciBkaXJlY3RvcnkgdG8gY29weSBmcm9tLlxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlUGF0aDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFN0YWdlcyBhIGZpbGUgb3IgZGlyZWN0b3J5IGZyb20gYSBsb2NhdGlvbiBvbiB0aGUgZmlsZSBzeXN0ZW0gaW50byBhIHN0YWdpbmdcbiAqIGRpcmVjdG9yeS5cbiAqXG4gKiBUaGlzIGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbnRleHQga2V5ICdhd3M6Y2RrOmFzc2V0LXN0YWdpbmcnIGFuZCBlbmFibGVkXG4gKiBieSB0aGUgQ0xJIGJ5IGRlZmF1bHQgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgd2hlbiB0aGUgQ0RLIGFwcCBleGlzdHMsIGFsbFxuICogYXNzZXRzIGFyZSBhdmFpbGFibGUgZm9yIGRlcGxveW1lbnQuIE90aGVyd2lzZSwgaWYgYW4gYXBwIHJlZmVyZW5jZXMgYXNzZXRzXG4gKiBpbiB0ZW1wb3JhcnkgbG9jYXRpb25zLCB0aG9zZSB3aWxsIG5vdCBiZSBhdmFpbGFibGUgd2hlbiBpdCBleGlzdHMgKHNlZVxuICogaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNzE2KS5cbiAqXG4gKiBUaGUgYHN0YWdlZFBhdGhgIHByb3BlcnR5IGlzIGEgc3RyaW5naWZpZWQgdG9rZW4gdGhhdCByZXByZXNlbnRzIHRoZSBsb2NhdGlvblxuICogb2YgdGhlIGZpbGUgb3IgZGlyZWN0b3J5IGFmdGVyIHN0YWdpbmcuIEl0IHdpbGwgYmUgcmVzb2x2ZWQgb25seSBkdXJpbmcgdGhlXG4gKiBcInByZXBhcmVcIiBzdGFnZSBhbmQgbWF5IGJlIGVpdGhlciB0aGUgb3JpZ2luYWwgcGF0aCBvciB0aGUgc3RhZ2VkIHBhdGhcbiAqIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dCBzZXR0aW5nLlxuICpcbiAqIFRoZSBmaWxlL2RpcmVjdG9yeSBhcmUgc3RhZ2VkIGJhc2VkIG9uIHRoZWlyIGNvbnRlbnQgaGFzaCAoZmluZ2VycHJpbnQpLiBUaGlzXG4gKiBtZWFucyB0aGF0IG9ubHkgaWYgY29udGVudCB3YXMgY2hhbmdlZCwgY29weSB3aWxsIGhhcHBlbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0U3RhZ2luZyBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0b3J5IGluc2lkZSB0aGUgYnVuZGxpbmcgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGFzc2V0IHNvdXJjZXMgd2lsbCBiZSBtb3VudGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCVU5ETElOR19JTlBVVF9ESVIgPSAnL2Fzc2V0LWlucHV0JztcblxuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSBpbnNpZGUgdGhlIGJ1bmRsaW5nIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBidW5kbGVkIG91dHB1dCBzaG91bGQgYmUgd3JpdHRlbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQlVORExJTkdfT1VUUFVUX0RJUiA9ICcvYXNzZXQtb3V0cHV0JztcblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBhc3NldCBoYXNoIGNhY2hlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNsZWFyQXNzZXRIYXNoQ2FjaGUoKSB7XG4gICAgdGhpcy5hc3NldENhY2hlLmNsZWFyKCk7XG4gICAgY2xlYXJMYXJnZUZpbGVGaW5nZXJwcmludENhY2hlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgb2YgYXNzZXQgaGFzaGVzIGJhc2VkIG9uIGFzc2V0IGNvbmZpZ3VyYXRpb24gdG8gYXZvaWQgcmVwZWF0ZWQgZmlsZVxuICAgKiBzeXN0ZW0gYW5kIGJ1bmRsaW5nIG9wZXJhdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBhc3NldENhY2hlID0gbmV3IENhY2hlPFN0YWdlZEFzc2V0PigpO1xuXG4gIC8qKlxuICAgKiBBYnNvbHV0ZSBwYXRoIHRvIHRoZSBhc3NldCBkYXRhLlxuICAgKlxuICAgKiBJZiBhc3NldCBzdGFnaW5nIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwganVzdCBiZSB0aGUgc291cmNlIHBhdGggb3JcbiAgICogYSB0ZW1wb3JhcnkgZGlyZWN0b3J5IHVzZWQgZm9yIGJ1bmRsaW5nLlxuICAgKlxuICAgKiBJZiBhc3NldCBzdGFnaW5nIGlzIGVuYWJsZWQgaXQgd2lsbCBiZSB0aGUgc3RhZ2VkIHBhdGguXG4gICAqXG4gICAqIElNUE9SVEFOVDogSWYgeW91IGFyZSBnb2luZyB0byBjYWxsIGBhZGRGaWxlQXNzZXQoKWAsIHVzZVxuICAgKiBgcmVsYXRpdmVTdGFnZWRQYXRoKClgIGluc3RlYWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIC0gVXNlIGBhYnNvbHV0ZVN0YWdlZFBhdGhgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhZ2VkUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBYnNvbHV0ZSBwYXRoIHRvIHRoZSBhc3NldCBkYXRhLlxuICAgKlxuICAgKiBJZiBhc3NldCBzdGFnaW5nIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwganVzdCBiZSB0aGUgc291cmNlIHBhdGggb3JcbiAgICogYSB0ZW1wb3JhcnkgZGlyZWN0b3J5IHVzZWQgZm9yIGJ1bmRsaW5nLlxuICAgKlxuICAgKiBJZiBhc3NldCBzdGFnaW5nIGlzIGVuYWJsZWQgaXQgd2lsbCBiZSB0aGUgc3RhZ2VkIHBhdGguXG4gICAqXG4gICAqIElNUE9SVEFOVDogSWYgeW91IGFyZSBnb2luZyB0byBjYWxsIGBhZGRGaWxlQXNzZXQoKWAsIHVzZVxuICAgKiBgcmVsYXRpdmVTdGFnZWRQYXRoKClgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWJzb2x1dGVTdGFnZWRQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhYnNvbHV0ZSBwYXRoIG9mIHRoZSBhc3NldCBhcyBpdCB3YXMgcmVmZXJlbmNlZCBieSB0aGUgdXNlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzb3VyY2VQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3J5cHRvZ3JhcGhpYyBoYXNoIG9mIHRoZSBhc3NldC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhc3NldEhhc2g6IHN0cmluZztcblxuICAvKipcbiAgICogSG93IHRoaXMgYXNzZXQgc2hvdWxkIGJlIHBhY2thZ2VkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYXNzZXQgaXMgYW4gYXJjaGl2ZSAoemlwIG9yIGphcikuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXNBcmNoaXZlOiBib29sZWFuO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZmluZ2VycHJpbnRPcHRpb25zOiBGaW5nZXJwcmludE9wdGlvbnM7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBoYXNoVHlwZTogQXNzZXRIYXNoVHlwZTtcbiAgcHJpdmF0ZSByZWFkb25seSBhc3NldE91dGRpcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBzb3VyY2UgZmluZ2VycHJpbnQgZ2l2ZW4gYnkgdGhlIHVzZXJcbiAgICpcbiAgICogV2lsbCBub3QgYmUgdXNlZCBsaXRlcmFsbHksIGFsd2F5cyBoYXNoZWQgbGF0ZXIgb24uXG4gICAqL1xuICBwcml2YXRlIGN1c3RvbVNvdXJjZUZpbmdlcnByaW50Pzogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2FjaGVLZXk6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHNvdXJjZVN0YXRzOiBmcy5TdGF0cztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXNzZXRTdGFnaW5nUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc2FsdCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KEFTU0VUX1NBTFRfQ09OVEVYVF9LRVkpO1xuXG4gICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKHByb3BzLnNvdXJjZVBhdGgpO1xuICAgIHRoaXMuZmluZ2VycHJpbnRPcHRpb25zID0ge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBleHRyYUhhc2g6IHByb3BzLmV4dHJhSGFzaCB8fCBzYWx0ID8gYCR7cHJvcHMuZXh0cmFIYXNoID8/ICcnfSR7c2FsdCA/PyAnJ31gIDogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5zb3VyY2VQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBhc3NldCBhdCAke3RoaXMuc291cmNlUGF0aH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvdXJjZVN0YXRzID0gZnMuc3RhdFN5bmModGhpcy5zb3VyY2VQYXRoKTtcblxuICAgIGNvbnN0IG91dGRpciA9IFN0YWdlLm9mKHRoaXMpPy5hc3NldE91dGRpcjtcbiAgICBpZiAoIW91dGRpcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gZGV0ZXJtaW5lIGNsb3VkIGFzc2VtYmx5IGFzc2V0IG91dHB1dCBkaXJlY3RvcnkuIEFzc2V0cyBtdXN0IGJlIGRlZmluZWQgaW5kaXJlY3RseSB3aXRoaW4gYSBcIlN0YWdlXCIgb3IgYW4gXCJBcHBcIiBzY29wZScpO1xuICAgIH1cbiAgICB0aGlzLmFzc2V0T3V0ZGlyID0gb3V0ZGlyO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBoYXNoIHR5cGUgYmFzZWQgb24gdGhlIHByb3BzIGFzIHByb3BzLmFzc2V0SGFzaFR5cGUgaXNcbiAgICAvLyBvcHRpb25hbCBmcm9tIGEgY2FsbGVyIHBlcnNwZWN0aXZlLlxuICAgIHRoaXMuY3VzdG9tU291cmNlRmluZ2VycHJpbnQgPSBwcm9wcy5hc3NldEhhc2g7XG4gICAgdGhpcy5oYXNoVHlwZSA9IGRldGVybWluZUhhc2hUeXBlKHByb3BzLmFzc2V0SGFzaFR5cGUsIHRoaXMuY3VzdG9tU291cmNlRmluZ2VycHJpbnQpO1xuXG4gICAgLy8gRGVjaWRlIHdoYXQgd2UncmUgZ29pbmcgdG8gZG8sIHdpdGhvdXQgYWN0dWFsbHkgZG9pbmcgaXQgeWV0XG4gICAgbGV0IHN0YWdlVGhpc0Fzc2V0OiAoKSA9PiBTdGFnZWRBc3NldDtcbiAgICBsZXQgc2tpcCA9IGZhbHNlO1xuICAgIGlmIChwcm9wcy5idW5kbGluZykge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UgYWN0dWFsbHkgaGF2ZSB0byBidW5kbGUgZm9yIHRoaXMgc3RhY2tcbiAgICAgIHNraXAgPSAhU3RhY2sub2YodGhpcykuYnVuZGxpbmdSZXF1aXJlZDtcbiAgICAgIGNvbnN0IGJ1bmRsaW5nID0gcHJvcHMuYnVuZGxpbmc7XG4gICAgICBzdGFnZVRoaXNBc3NldCA9ICgpID0+IHRoaXMuc3RhZ2VCeUJ1bmRsaW5nKGJ1bmRsaW5nLCBza2lwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhZ2VUaGlzQXNzZXQgPSAoKSA9PiB0aGlzLnN0YWdlQnlDb3B5aW5nKCk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGEgY2FjaGUga2V5IGZyb20gdGhlIHByb3BzLiBUaGlzIHdheSB3ZSBjYW4gY2hlY2sgaWYgd2UgYWxyZWFkeVxuICAgIC8vIHN0YWdlZCB0aGlzIGFzc2V0IGFuZCByZXVzZSB0aGUgcmVzdWx0IChlLmcuIHRoZSBzYW1lIGFzc2V0IHdpdGggdGhlIHNhbWVcbiAgICAvLyBjb25maWd1cmF0aW9uIGlzIHVzZWQgaW4gbXVsdGlwbGUgc3RhY2tzKS4gSW4gdGhpcyBjYXNlIHdlIGNhbiBjb21wbGV0ZWx5XG4gICAgLy8gc2tpcCBmaWxlIHN5c3RlbSBhbmQgYnVuZGxpbmcgb3BlcmF0aW9ucy5cbiAgICAvL1xuICAgIC8vIFRoZSBvdXRwdXQgZGlyZWN0b3J5IGFuZCB3aGV0aGVyIHRoaXMgYXNzZXQgaXMgc2tpcHBlZCBvciBub3Qgc2hvdWxkIGFsc28gYmVcbiAgICAvLyBwYXJ0IG9mIHRoZSBjYWNoZSBrZXkgdG8gbWFrZSBzdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSByZXR1cm4gdGhlIHdyb25nXG4gICAgLy8gc3RhZ2VkIGFzc2V0IGZyb20gdGhlIGNhY2hlLlxuICAgIHRoaXMuY2FjaGVLZXkgPSBjYWxjdWxhdGVDYWNoZUtleSh7XG4gICAgICBvdXRkaXI6IHRoaXMuYXNzZXRPdXRkaXIsXG4gICAgICBzb3VyY2VQYXRoOiBwYXRoLnJlc29sdmUocHJvcHMuc291cmNlUGF0aCksXG4gICAgICBidW5kbGluZzogcHJvcHMuYnVuZGxpbmcsXG4gICAgICBhc3NldEhhc2hUeXBlOiB0aGlzLmhhc2hUeXBlLFxuICAgICAgY3VzdG9tRmluZ2VycHJpbnQ6IHRoaXMuY3VzdG9tU291cmNlRmluZ2VycHJpbnQsXG4gICAgICBleHRyYUhhc2g6IHByb3BzLmV4dHJhSGFzaCxcbiAgICAgIGV4Y2x1ZGU6IHByb3BzLmV4Y2x1ZGUsXG4gICAgICBpZ25vcmVNb2RlOiBwcm9wcy5pZ25vcmVNb2RlLFxuICAgICAgc2tpcCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWdlZCA9IEFzc2V0U3RhZ2luZy5hc3NldENhY2hlLm9idGFpbih0aGlzLmNhY2hlS2V5LCBzdGFnZVRoaXNBc3NldCk7XG4gICAgdGhpcy5zdGFnZWRQYXRoID0gc3RhZ2VkLnN0YWdlZFBhdGg7XG4gICAgdGhpcy5hYnNvbHV0ZVN0YWdlZFBhdGggPSBzdGFnZWQuc3RhZ2VkUGF0aDtcbiAgICB0aGlzLmFzc2V0SGFzaCA9IHN0YWdlZC5hc3NldEhhc2g7XG4gICAgdGhpcy5wYWNrYWdpbmcgPSBzdGFnZWQucGFja2FnaW5nO1xuICAgIHRoaXMuaXNBcmNoaXZlID0gc3RhZ2VkLmlzQXJjaGl2ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNyeXB0b2dyYXBoaWMgaGFzaCBvZiB0aGUgYXNzZXQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHNlZSBgYXNzZXRIYXNoYC5cbiAgICovXG4gIHB1YmxpYyBnZXQgc291cmNlSGFzaCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFzc2V0SGFzaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHBhdGggdG8gdGhlIHN0YWdlZCBhc3NldCwgcmVsYXRpdmUgdG8gdGhlIENsb3VkIEFzc2VtYmx5IChtYW5pZmVzdCkgZGlyZWN0b3J5IG9mIHRoZSBnaXZlbiBzdGFja1xuICAgKlxuICAgKiBPbmx5IHJldHVybnMgYSByZWxhdGl2ZSBwYXRoIGlmIHRoZSBhc3NldCB3YXMgc3RhZ2VkLCByZXR1cm5zIGFuIGFic29sdXRlIHBhdGggaWZcbiAgICogaXQgd2FzIG5vdCBzdGFnZWQuXG4gICAqXG4gICAqIEEgYnVuZGxlZCBhc3NldCBtaWdodCBlbmQgdXAgaW4gdGhlIG91dERpciBhbmQgc3RpbGwgbm90IGNvdW50IGFzXG4gICAqIFwic3RhZ2VkXCI7IGlmIGFzc2V0IHN0YWdpbmcgaXMgZGlzYWJsZWQgd2UncmUgdGVjaG5pY2FsbHkgZXhwZWN0ZWQgdG9cbiAgICogcmVmZXJlbmNlIHNvdXJjZSBkaXJlY3RvcmllcywgYnV0IHdlIGRvbid0IGhhdmUgYSBzb3VyY2UgZGlyZWN0b3J5IGZvciB0aGVcbiAgICogYnVuZGxlZCBvdXRwdXRzIChhcyB0aGUgYnVuZGxlIG91dHB1dCBpcyB3cml0dGVuIHRvIGEgdGVtcG9yYXJ5XG4gICAqIGRpcmVjdG9yeSkuIE5ldmVydGhlbGVzcywgd2Ugd2lsbCBzdGlsbCByZXR1cm4gYW4gYWJzb2x1dGUgcGF0aC5cbiAgICpcbiAgICogQSBub24tb2J2aW91cyBkaXJlY3RvcnkgbGF5b3V0IG1heSBsb29rIGxpa2UgdGhpczpcbiAgICpcbiAgICogYGBgXG4gICAqICAgQ0xPVUQgQVNTRU1CTFkgUk9PVFxuICAgKiAgICAgKy0tIGFzc2V0LjEyMzQ1YWJjZGVmL1xuICAgKiAgICAgKy0tIGFzc2VtYmx5LVN0YWdlXG4gICAqICAgICAgICAgICArLS0gTXlTdGFjay50ZW1wbGF0ZS5qc29uXG4gICAqICAgICAgICAgICArLS0gTXlTdGFjay5hc3NldHMuanNvbiA8LSB3aWxsIGNvbnRhaW4geyBcInBhdGhcIjogXCIuLi9hc3NldC4xMjM0NWFiY2RlZlwiIH1cbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgcmVsYXRpdmVTdGFnZWRQYXRoKHN0YWNrOiBTdGFjaykge1xuICAgIGNvbnN0IGFzbU1hbmlmZXN0RGlyID0gU3RhZ2Uub2Yoc3RhY2spPy5vdXRkaXI7XG4gICAgaWYgKCFhc21NYW5pZmVzdERpcikgeyByZXR1cm4gdGhpcy5zdGFnZWRQYXRoOyB9XG5cbiAgICBjb25zdCBpc091dHNpZGVBc3NldERpciA9IHBhdGgucmVsYXRpdmUodGhpcy5hc3NldE91dGRpciwgdGhpcy5zdGFnZWRQYXRoKS5zdGFydHNXaXRoKCcuLicpO1xuICAgIGlmIChpc091dHNpZGVBc3NldERpciB8fCB0aGlzLnN0YWdpbmdEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhZ2VkUGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShhc21NYW5pZmVzdERpciwgdGhpcy5zdGFnZWRQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFnZSB0aGUgc291cmNlIHRvIHRoZSB0YXJnZXQgYnkgY29weWluZ1xuICAgKlxuICAgKiBPcHRpb25hbGx5IHNraXAgaWYgc3RhZ2luZyBpcyBkaXNhYmxlZCwgaW4gd2hpY2ggY2FzZSB3ZSBwcmV0ZW5kIHdlIGRpZCBzb21ldGhpbmcgYnV0IHdlIGRvbid0IHJlYWxseS5cbiAgICovXG4gIHByaXZhdGUgc3RhZ2VCeUNvcHlpbmcoKTogU3RhZ2VkQXNzZXQge1xuICAgIGNvbnN0IGFzc2V0SGFzaCA9IHRoaXMuY2FsY3VsYXRlSGFzaCh0aGlzLmhhc2hUeXBlKTtcbiAgICBjb25zdCBzdGFnZWRQYXRoID0gdGhpcy5zdGFnaW5nRGlzYWJsZWRcbiAgICAgID8gdGhpcy5zb3VyY2VQYXRoXG4gICAgICA6IHBhdGgucmVzb2x2ZSh0aGlzLmFzc2V0T3V0ZGlyLCByZW5kZXJBc3NldEZpbGVuYW1lKGFzc2V0SGFzaCwgZ2V0RXh0ZW5zaW9uKHRoaXMuc291cmNlUGF0aCkpKTtcblxuICAgIGlmICghdGhpcy5zb3VyY2VTdGF0cy5pc0RpcmVjdG9yeSgpICYmICF0aGlzLnNvdXJjZVN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0ICR7dGhpcy5zb3VyY2VQYXRofSBpcyBleHBlY3RlZCB0byBiZSBlaXRoZXIgYSBkaXJlY3Rvcnkgb3IgYSByZWd1bGFyIGZpbGVgKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlQXNzZXQodGhpcy5zb3VyY2VQYXRoLCBzdGFnZWRQYXRoLCAnY29weScpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFzc2V0SGFzaCxcbiAgICAgIHN0YWdlZFBhdGgsXG4gICAgICBwYWNrYWdpbmc6IHRoaXMuc291cmNlU3RhdHMuaXNEaXJlY3RvcnkoKSA/IEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZIDogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBpc0FyY2hpdmU6IHRoaXMuc291cmNlU3RhdHMuaXNEaXJlY3RvcnkoKSB8fCBBUkNISVZFX0VYVEVOU0lPTlMuaW5jbHVkZXMoZ2V0RXh0ZW5zaW9uKHRoaXMuc291cmNlUGF0aCkudG9Mb3dlckNhc2UoKSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFnZSB0aGUgc291cmNlIHRvIHRoZSB0YXJnZXQgYnkgYnVuZGxpbmdcbiAgICpcbiAgICogT3B0aW9uYWxseSBza2lwLCBpbiB3aGljaCBjYXNlIHdlIHByZXRlbmQgd2UgZGlkIHNvbWV0aGluZyBidXQgd2UgZG9uJ3QgcmVhbGx5LlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFnZUJ5QnVuZGxpbmcoYnVuZGxpbmc6IEJ1bmRsaW5nT3B0aW9ucywgc2tpcDogYm9vbGVhbik6IFN0YWdlZEFzc2V0IHtcbiAgICBpZiAoIXRoaXMuc291cmNlU3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCAke3RoaXMuc291cmNlUGF0aH0gaXMgZXhwZWN0ZWQgdG8gYmUgYSBkaXJlY3Rvcnkgd2hlbiBidW5kbGluZ2ApO1xuICAgIH1cblxuICAgIGlmIChza2lwKSB7XG4gICAgICAvLyBXZSBzaG91bGQgaGF2ZSBidW5kbGVkLCBidXQgZGlkbid0IHRvIHNhdmUgdGltZS4gU3RpbGwgcHJldGVuZCB0byBoYXZlIGEgaGFzaC5cbiAgICAgIC8vIElmIHRoZSBhc3NldCB1c2VzIE9VVFBVVCBvciBCVU5ETEUsIHdlIHVzZSBhIENVU1RPTSBoYXNoIHRvIGF2b2lkIGZpbmdlcnByaW50aW5nXG4gICAgICAvLyBhIHBvdGVudGlhbGx5IHZlcnkgbGFyZ2Ugc291cmNlIGRpcmVjdG9yeS4gT3RoZXIgaGFzaCB0eXBlcyBhcmUga2VwdCB0aGUgc2FtZS5cbiAgICAgIGxldCBoYXNoVHlwZSA9IHRoaXMuaGFzaFR5cGU7XG4gICAgICBpZiAoaGFzaFR5cGUgPT09IEFzc2V0SGFzaFR5cGUuT1VUUFVUIHx8IGhhc2hUeXBlID09PSBBc3NldEhhc2hUeXBlLkJVTkRMRSkge1xuICAgICAgICB0aGlzLmN1c3RvbVNvdXJjZUZpbmdlcnByaW50ID0gTmFtZXMudW5pcXVlSWQodGhpcyk7XG4gICAgICAgIGhhc2hUeXBlID0gQXNzZXRIYXNoVHlwZS5DVVNUT007XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhc3NldEhhc2g6IHRoaXMuY2FsY3VsYXRlSGFzaChoYXNoVHlwZSwgYnVuZGxpbmcpLFxuICAgICAgICBzdGFnZWRQYXRoOiB0aGlzLnNvdXJjZVBhdGgsXG4gICAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUlksXG4gICAgICAgIGlzQXJjaGl2ZTogdHJ1ZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGNhbGN1bGF0ZSBhc3NldEhhc2ggYmVmb3JlaGFuZCAoaWYgd2UgY2FuKVxuICAgIGxldCBhc3NldEhhc2ggPSB0aGlzLmhhc2hUeXBlID09PSBBc3NldEhhc2hUeXBlLlNPVVJDRSB8fCB0aGlzLmhhc2hUeXBlID09PSBBc3NldEhhc2hUeXBlLkNVU1RPTVxuICAgICAgPyB0aGlzLmNhbGN1bGF0ZUhhc2godGhpcy5oYXNoVHlwZSwgYnVuZGxpbmcpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGJ1bmRsZURpciA9IHRoaXMuZGV0ZXJtaW5lQnVuZGxlRGlyKHRoaXMuYXNzZXRPdXRkaXIsIGFzc2V0SGFzaCk7XG4gICAgdGhpcy5idW5kbGUoYnVuZGxpbmcsIGJ1bmRsZURpcik7XG5cbiAgICAvLyBDaGVjayBidW5kbGluZyBvdXRwdXQgY29udGVudCBhbmQgZGV0ZXJtaW5lIGlmIHdlIHdpbGwgbmVlZCB0byBhcmNoaXZlXG4gICAgY29uc3QgYnVuZGxpbmdPdXRwdXRUeXBlID0gYnVuZGxpbmcub3V0cHV0VHlwZSA/PyBCdW5kbGluZ091dHB1dC5BVVRPX0RJU0NPVkVSO1xuICAgIGNvbnN0IGJ1bmRsZWRBc3NldCA9IGRldGVybWluZUJ1bmRsZWRBc3NldChidW5kbGVEaXIsIGJ1bmRsaW5nT3V0cHV0VHlwZSk7XG5cbiAgICAvLyBDYWxjdWxhdGUgYXNzZXRIYXNoIGFmdGVyd2FyZHMgaWYgd2Ugc3RpbGwgbXVzdFxuICAgIGFzc2V0SGFzaCA9IGFzc2V0SGFzaCA/PyB0aGlzLmNhbGN1bGF0ZUhhc2godGhpcy5oYXNoVHlwZSwgYnVuZGxpbmcsIGJ1bmRsZWRBc3NldC5wYXRoKTtcblxuICAgIGNvbnN0IHN0YWdlZFBhdGggPSBwYXRoLnJlc29sdmUodGhpcy5hc3NldE91dGRpciwgcmVuZGVyQXNzZXRGaWxlbmFtZShhc3NldEhhc2gsIGJ1bmRsZWRBc3NldC5leHRlbnNpb24pKTtcblxuICAgIHRoaXMuc3RhZ2VBc3NldChidW5kbGVkQXNzZXQucGF0aCwgc3RhZ2VkUGF0aCwgJ21vdmUnKTtcblxuICAgIC8vIElmIGJ1bmRsaW5nIHByb2R1Y2VkIGEgc2luZ2xlIGFyY2hpdmUgZmlsZSB3ZSBcInRvdWNoXCIgdGhpcyBmaWxlIGluIHRoZSBidW5kbGluZ1xuICAgIC8vIGRpcmVjdG9yeSBhZnRlciBpdCBoYXMgYmVlbiBtb3ZlZCB0byB0aGUgc3RhZ2luZyBkaXJlY3RvcnkuIFRoaXMgd2F5IGlmIGJ1bmRsaW5nXG4gICAgLy8gaXMgc2tpcHBlZCBiZWNhdXNlIHRoZSBidW5kbGluZyBkaXJlY3RvcnkgYWxyZWFkeSBleGlzdHMgd2UgY2FuIHN0aWxsIGRldGVybWluZVxuICAgIC8vIHRoZSBjb3JyZWN0IHBhY2thZ2luZyB0eXBlLlxuICAgIGlmIChidW5kbGVkQXNzZXQucGFja2FnaW5nID09PSBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSkge1xuICAgICAgZnMuY2xvc2VTeW5jKGZzLm9wZW5TeW5jKGJ1bmRsZWRBc3NldC5wYXRoLCAndycpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYXNzZXRIYXNoLFxuICAgICAgc3RhZ2VkUGF0aCxcbiAgICAgIHBhY2thZ2luZzogYnVuZGxlZEFzc2V0LnBhY2thZ2luZyxcbiAgICAgIGlzQXJjaGl2ZTogdHJ1ZSwgLy8gYnVuZGxpbmcgYWx3YXlzIHByb2R1Y2VzIGFuIGFyY2hpdmVcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgc3RhZ2luZyBoYXMgYmVlbiBkaXNhYmxlZFxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgc3RhZ2luZ0Rpc2FibGVkKCkge1xuICAgIHJldHVybiAhIXRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkRJU0FCTEVfQVNTRVRfU1RBR0lOR19DT05URVhUKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgb3IgbW92ZXMgdGhlIGZpbGVzIGZyb20gc291cmNlUGF0aCB0byB0YXJnZXRQYXRoLlxuICAgKlxuICAgKiBNb3ZpbmcgaW1wbGllcyB0aGUgc291cmNlIGRpcmVjdG9yeSBpcyB0ZW1wb3JhcnkgYW5kIGNhbiBiZSB0cmFzaGVkLlxuICAgKlxuICAgKiBXaWxsIG5vdCBkbyBhbnl0aGluZyBpZiBzb3VyY2UgYW5kIHRhcmdldCBhcmUgdGhlIHNhbWUuXG4gICAqL1xuICBwcml2YXRlIHN0YWdlQXNzZXQoc291cmNlUGF0aDogc3RyaW5nLCB0YXJnZXRQYXRoOiBzdHJpbmcsIHN0eWxlOiAnbW92ZScgfCAnY29weScpIHtcbiAgICAvLyBJcyB0aGUgd29yayBhbHJlYWR5IGRvbmU/XG4gICAgY29uc3QgaXNBbHJlYWR5U3RhZ2VkID0gZnMuZXhpc3RzU3luYyh0YXJnZXRQYXRoKTtcbiAgICBpZiAoaXNBbHJlYWR5U3RhZ2VkKSB7XG4gICAgICBpZiAoc3R5bGUgPT09ICdtb3ZlJyAmJiBzb3VyY2VQYXRoICE9PSB0YXJnZXRQYXRoKSB7XG4gICAgICAgIGZzLnJlbW92ZVN5bmMoc291cmNlUGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTW92aW5nIGNhbiBiZSBkb25lIHF1aWNrbHlcbiAgICBpZiAoc3R5bGUgPT0gJ21vdmUnKSB7XG4gICAgICBmcy5yZW5hbWVTeW5jKHNvdXJjZVBhdGgsIHRhcmdldFBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvcHkgZmlsZS9kaXJlY3RvcnkgdG8gc3RhZ2luZyBkaXJlY3RvcnlcbiAgICBpZiAodGhpcy5zb3VyY2VTdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgZnMuY29weUZpbGVTeW5jKHNvdXJjZVBhdGgsIHRhcmdldFBhdGgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2VTdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBmcy5ta2RpclN5bmModGFyZ2V0UGF0aCk7XG4gICAgICBGaWxlU3lzdGVtLmNvcHlEaXJlY3Rvcnkoc291cmNlUGF0aCwgdGFyZ2V0UGF0aCwgdGhpcy5maW5nZXJwcmludE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZmlsZSB0eXBlOiAke3NvdXJjZVBhdGh9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgZGlyZWN0b3J5IHdoZXJlIHdlJ3JlIGdvaW5nIHRvIHdyaXRlIHRoZSBidW5kbGluZyBvdXRwdXRcbiAgICpcbiAgICogVGhpcyBpcyB0aGUgdGFyZ2V0IGRpcmVjdG9yeSB3aGVyZSB3ZSdyZSBnb2luZyB0byB3cml0ZSB0aGUgc3RhZ2VkIG91dHB1dFxuICAgKiBmaWxlcyBpZiB3ZSBjYW4gKGlmIHRoZSBoYXNoIGlzIGZ1bGx5IGtub3duKSwgb3IgYSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAqIG90aGVyd2lzZS5cbiAgICovXG4gIHByaXZhdGUgZGV0ZXJtaW5lQnVuZGxlRGlyKG91dGRpcjogc3RyaW5nLCBzb3VyY2VIYXNoPzogc3RyaW5nKSB7XG4gICAgaWYgKHNvdXJjZUhhc2gpIHtcbiAgICAgIHJldHVybiBwYXRoLnJlc29sdmUob3V0ZGlyLCByZW5kZXJBc3NldEZpbGVuYW1lKHNvdXJjZUhhc2gpKTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBhc3NldCBoYXNoIGlzbid0IGtub3duIGluIGFkdmFuY2UsIGJ1bmRsZXIgb3V0cHV0cyB0byBhblxuICAgIC8vIGludGVybWVkaWF0ZSBkaXJlY3RvcnkgbmFtZWQgYWZ0ZXIgdGhlIGFzc2V0J3MgY2FjaGUga2V5XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZShvdXRkaXIsIGBidW5kbGluZy10ZW1wLSR7dGhpcy5jYWNoZUtleX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdW5kbGVzIGFuIGFzc2V0IHRvIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICpcbiAgICogSWYgdGhlIGdpdmVuIGRpcmVjdG9yeSBhbHJlYWR5IGV4aXN0cywgYXNzdW1lIHRoYXQgZXZlcnl0aGluZydzIGFscmVhZHlcbiAgICogaW4gb3JkZXIgYW5kIGRvbid0IGRvIGFueXRoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBCdW5kbGluZyBvcHRpb25zXG4gICAqIEBwYXJhbSBidW5kbGVEaXIgV2hlcmUgdG8gY3JlYXRlIHRoZSBidW5kbGUgZGlyZWN0b3J5XG4gICAqIEByZXR1cm5zIFRoZSBmdWxseSByZXNvbHZlZCBidW5kbGUgb3V0cHV0IGRpcmVjdG9yeS5cbiAgICovXG4gIHByaXZhdGUgYnVuZGxlKG9wdGlvbnM6IEJ1bmRsaW5nT3B0aW9ucywgYnVuZGxlRGlyOiBzdHJpbmcpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhidW5kbGVEaXIpKSB7IHJldHVybjsgfVxuXG4gICAgZnMuZW5zdXJlRGlyU3luYyhidW5kbGVEaXIpO1xuICAgIC8vIENobW9kIHRoZSBidW5kbGVEaXIgdG8gZnVsbCBhY2Nlc3MuXG4gICAgZnMuY2htb2RTeW5jKGJ1bmRsZURpciwgMG83NzcpO1xuXG4gICAgbGV0IGxvY2FsQnVuZGxpbmc6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGBCdW5kbGluZyBhc3NldCAke3RoaXMubm9kZS5wYXRofS4uLlxcbmApO1xuXG4gICAgICBsb2NhbEJ1bmRsaW5nID0gb3B0aW9ucy5sb2NhbD8udHJ5QnVuZGxlKGJ1bmRsZURpciwgb3B0aW9ucyk7XG4gICAgICBpZiAoIWxvY2FsQnVuZGxpbmcpIHtcbiAgICAgICAgY29uc3QgYXNzZXRTdGFnaW5nT3B0aW9ucyA9IHtcbiAgICAgICAgICBzb3VyY2VQYXRoOiB0aGlzLnNvdXJjZVBhdGgsXG4gICAgICAgICAgYnVuZGxlRGlyLFxuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH07XG5cbiAgICAgICAgc3dpdGNoIChvcHRpb25zLmJ1bmRsaW5nRmlsZUFjY2Vzcykge1xuICAgICAgICAgIGNhc2UgQnVuZGxpbmdGaWxlQWNjZXNzLlZPTFVNRV9DT1BZOlxuICAgICAgICAgICAgbmV3IEFzc2V0QnVuZGxpbmdWb2x1bWVDb3B5KGFzc2V0U3RhZ2luZ09wdGlvbnMpLnJ1bigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBCdW5kbGluZ0ZpbGVBY2Nlc3MuQklORF9NT1VOVDpcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbmV3IEFzc2V0QnVuZGxpbmdCaW5kTW91bnQoYXNzZXRTdGFnaW5nT3B0aW9ucykucnVuKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gV2hlbiBidW5kbGluZyBmYWlscywga2VlcCB0aGUgYnVuZGxlIG91dHB1dCBmb3IgZGlhZ25vc2FiaWxpdHksIGJ1dFxuICAgICAgLy8gcmVuYW1lIGl0IG91dCBvZiB0aGUgd2F5IHNvIHRoYXQgdGhlIG5leHQgcnVuIGRvZXNuJ3QgYXNzdW1lIGl0IGhhcyBhXG4gICAgICAvLyB2YWxpZCBidW5kbGVEaXIuXG4gICAgICBjb25zdCBidW5kbGVFcnJvckRpciA9IGJ1bmRsZURpciArICctZXJyb3InO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoYnVuZGxlRXJyb3JEaXIpKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBidW5kbGVFcnJvckRpci5cbiAgICAgICAgZnMucmVtb3ZlU3luYyhidW5kbGVFcnJvckRpcik7XG4gICAgICB9XG5cbiAgICAgIGZzLnJlbmFtZVN5bmMoYnVuZGxlRGlyLCBidW5kbGVFcnJvckRpcik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBidW5kbGUgYXNzZXQgJHt0aGlzLm5vZGUucGF0aH0sIGJ1bmRsZSBvdXRwdXQgaXMgbG9jYXRlZCBhdCAke2J1bmRsZUVycm9yRGlyfTogJHtlcnJ9YCk7XG4gICAgfVxuXG4gICAgaWYgKEZpbGVTeXN0ZW0uaXNFbXB0eShidW5kbGVEaXIpKSB7XG4gICAgICBjb25zdCBvdXRwdXREaXIgPSBsb2NhbEJ1bmRsaW5nID8gYnVuZGxlRGlyIDogQXNzZXRTdGFnaW5nLkJVTkRMSU5HX09VVFBVVF9ESVI7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEJ1bmRsaW5nIGRpZCBub3QgcHJvZHVjZSBhbnkgb3V0cHV0LiBDaGVjayB0aGF0IGNvbnRlbnQgaXMgd3JpdHRlbiB0byAke291dHB1dERpcn0uYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVIYXNoKGhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLCBidW5kbGluZz86IEJ1bmRsaW5nT3B0aW9ucywgb3V0cHV0RGlyPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBXaGVuIGJ1bmRsaW5nIGEgQ1VTVE9NIG9yIFNPVVJDRSBhc3NldCBoYXNoIHR5cGUsIHdlIHdhbnQgdGhlIGhhc2ggdG8gaW5jbHVkZVxuICAgIC8vIHRoZSBidW5kbGluZyBjb25maWd1cmF0aW9uLiBXZSBoYW5kbGUgQ1VTVE9NIGFuZCBidW5kbGVkIFNPVVJDRSBoYXNoIHR5cGVzXG4gICAgLy8gYXMgYSBzcGVjaWFsIGNhc2UgdG8gcHJlc2VydmUgZXhpc3RpbmcgdXNlciBhc3NldCBoYXNoZXMgaW4gYWxsIG90aGVyIGNhc2VzLlxuICAgIGlmIChoYXNoVHlwZSA9PSBBc3NldEhhc2hUeXBlLkNVU1RPTSB8fCAoaGFzaFR5cGUgPT0gQXNzZXRIYXNoVHlwZS5TT1VSQ0UgJiYgYnVuZGxpbmcpKSB7XG4gICAgICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpO1xuXG4gICAgICAvLyBpZiBhc3NldCBoYXNoIGlzIHByb3ZpZGVkIGJ5IHVzZXIsIHVzZSBpdCwgb3RoZXJ3aXNlIGZpbmdlcnByaW50IHRoZSBzb3VyY2UuXG4gICAgICBoYXNoLnVwZGF0ZSh0aGlzLmN1c3RvbVNvdXJjZUZpbmdlcnByaW50ID8/IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQodGhpcy5zb3VyY2VQYXRoLCB0aGlzLmZpbmdlcnByaW50T3B0aW9ucykpO1xuXG4gICAgICAvLyBJZiB3ZSdyZSBidW5kbGluZyBhbiBhc3NldCwgaW5jbHVkZSB0aGUgYnVuZGxpbmcgY29uZmlndXJhdGlvbiBpbiB0aGUgaGFzaFxuICAgICAgaWYgKGJ1bmRsaW5nKSB7XG4gICAgICAgIGhhc2gudXBkYXRlKEpTT04uc3RyaW5naWZ5KGJ1bmRsaW5nKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChoYXNoVHlwZSkge1xuICAgICAgY2FzZSBBc3NldEhhc2hUeXBlLlNPVVJDRTpcbiAgICAgICAgcmV0dXJuIEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQodGhpcy5zb3VyY2VQYXRoLCB0aGlzLmZpbmdlcnByaW50T3B0aW9ucyk7XG4gICAgICBjYXNlIEFzc2V0SGFzaFR5cGUuQlVORExFOlxuICAgICAgY2FzZSBBc3NldEhhc2hUeXBlLk9VVFBVVDpcbiAgICAgICAgaWYgKCFvdXRwdXREaXIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB1c2UgXFxgJHtoYXNoVHlwZX1cXGAgaGFzaCB0eXBlIHdoZW4gXFxgYnVuZGxpbmdcXGAgaXMgbm90IHNwZWNpZmllZC5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRmlsZVN5c3RlbS5maW5nZXJwcmludChvdXRwdXREaXIsIHRoaXMuZmluZ2VycHJpbnRPcHRpb25zKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBhc3NldCBoYXNoIHR5cGUuJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckFzc2V0RmlsZW5hbWUoYXNzZXRIYXNoOiBzdHJpbmcsIGV4dGVuc2lvbiA9ICcnKSB7XG4gIHJldHVybiBgYXNzZXQuJHthc3NldEhhc2h9JHtleHRlbnNpb259YDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBoYXNoIHR5cGUgZnJvbSB1c2VyLWdpdmVuIHByb3AgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSBhc3NldEhhc2hUeXBlIEFzc2V0IGhhc2ggdHlwZSBjb25zdHJ1Y3QgcHJvcFxuICogQHBhcmFtIGN1c3RvbVNvdXJjZUZpbmdlcnByaW50IEFzc2V0IGhhc2ggc2VlZCBnaXZlbiBpbiB0aGUgY29uc3RydWN0IHByb3BzXG4gKi9cbmZ1bmN0aW9uIGRldGVybWluZUhhc2hUeXBlKGFzc2V0SGFzaFR5cGU/OiBBc3NldEhhc2hUeXBlLCBjdXN0b21Tb3VyY2VGaW5nZXJwcmludD86IHN0cmluZykge1xuICBjb25zdCBoYXNoVHlwZSA9IGN1c3RvbVNvdXJjZUZpbmdlcnByaW50XG4gICAgPyAoYXNzZXRIYXNoVHlwZSA/PyBBc3NldEhhc2hUeXBlLkNVU1RPTSlcbiAgICA6IChhc3NldEhhc2hUeXBlID8/IEFzc2V0SGFzaFR5cGUuU09VUkNFKTtcblxuICBpZiAoY3VzdG9tU291cmNlRmluZ2VycHJpbnQgJiYgaGFzaFR5cGUgIT09IEFzc2V0SGFzaFR5cGUuQ1VTVE9NKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc3BlY2lmeSBcXGAke2Fzc2V0SGFzaFR5cGV9XFxgIGZvciBcXGBhc3NldEhhc2hUeXBlXFxgIHdoZW4gXFxgYXNzZXRIYXNoXFxgIGlzIHNwZWNpZmllZC4gVXNlIFxcYENVU1RPTVxcYCBvciBsZWF2ZSBcXGB1bmRlZmluZWRcXGAuYCk7XG4gIH1cbiAgaWYgKGhhc2hUeXBlID09PSBBc3NldEhhc2hUeXBlLkNVU1RPTSAmJiAhY3VzdG9tU291cmNlRmluZ2VycHJpbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bhc3NldEhhc2hgIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gYGFzc2V0SGFzaFR5cGVgIGlzIHNldCB0byBgQXNzZXRIYXNoVHlwZS5DVVNUT01gLicpO1xuICB9XG5cbiAgcmV0dXJuIGhhc2hUeXBlO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgYSBjYWNoZSBrZXkgZnJvbSB0aGUgcHJvcHMuIE5vcm1hbGl6ZSBieSBzb3J0aW5nIGtleXMuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZUNhY2hlS2V5PEEgZXh0ZW5kcyBvYmplY3Q+KHByb3BzOiBBKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKVxuICAgIC51cGRhdGUoSlNPTi5zdHJpbmdpZnkoc29ydE9iamVjdChwcm9wcykpKVxuICAgIC5kaWdlc3QoJ2hleCcpO1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHNvcnQgb2JqZWN0IGtleXNcbiAqL1xuZnVuY3Rpb24gc29ydE9iamVjdChvYmplY3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8IG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBjb25zdCByZXQ6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KS5zb3J0KCkpIHtcbiAgICByZXRba2V5XSA9IHNvcnRPYmplY3Qob2JqZWN0W2tleV0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc2luZ2xlIGFyY2hpdmUgZmlsZSBvZiBhIGRpcmVjdG9yeSBvciB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gc2luZ2xlQXJjaGl2ZUZpbGUoZGlyZWN0b3J5OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyZWN0b3J5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRGlyZWN0b3J5ICR7ZGlyZWN0b3J5fSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxuXG4gIGlmICghZnMuc3RhdFN5bmMoZGlyZWN0b3J5KS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke2RpcmVjdG9yeX0gaXMgbm90IGEgZGlyZWN0b3J5LmApO1xuICB9XG5cbiAgY29uc3QgY29udGVudCA9IGZzLnJlYWRkaXJTeW5jKGRpcmVjdG9yeSk7XG4gIGlmIChjb250ZW50Lmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IGZpbGUgPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBjb250ZW50WzBdKTtcbiAgICBjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oY29udGVudFswXSkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZnMuc3RhdFN5bmMoZmlsZSkuaXNGaWxlKCkgJiYgQVJDSElWRV9FWFRFTlNJT05TLmluY2x1ZGVzKGV4dGVuc2lvbikpIHtcbiAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBCdW5kbGVkQXNzZXQge1xuICBwYXRoOiBzdHJpbmcsXG4gIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLFxuICBleHRlbnNpb24/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBidW5kbGVkIGFzc2V0IHRvIHVzZSBiYXNlZCBvbiB0aGUgY29udGVudCBvZiB0aGUgYnVuZGxlIGRpcmVjdG9yeVxuICogYW5kIHRoZSB0eXBlIG9mIG91dHB1dC5cbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5lQnVuZGxlZEFzc2V0KGJ1bmRsZURpcjogc3RyaW5nLCBvdXRwdXRUeXBlOiBCdW5kbGluZ091dHB1dCk6IEJ1bmRsZWRBc3NldCB7XG4gIGNvbnN0IGFyY2hpdmVGaWxlID0gc2luZ2xlQXJjaGl2ZUZpbGUoYnVuZGxlRGlyKTtcblxuICAvLyBhdXRvLWRpc2NvdmVyIG1lYW5zIHRoYXQgaWYgdGhlcmUgaXMgYW4gYXJjaGl2ZSBmaWxlLCB3ZSB0YWtlIGl0IGFzIHRoZVxuICAvLyBidW5kbGUsIG90aGVyd2lzZSwgd2Ugd2lsbCBhcmNoaXZlIGhlcmUuXG4gIGlmIChvdXRwdXRUeXBlID09PSBCdW5kbGluZ091dHB1dC5BVVRPX0RJU0NPVkVSKSB7XG4gICAgb3V0cHV0VHlwZSA9IGFyY2hpdmVGaWxlID8gQnVuZGxpbmdPdXRwdXQuQVJDSElWRUQgOiBCdW5kbGluZ091dHB1dC5OT1RfQVJDSElWRUQ7XG4gIH1cblxuICBzd2l0Y2ggKG91dHB1dFR5cGUpIHtcbiAgICBjYXNlIEJ1bmRsaW5nT3V0cHV0Lk5PVF9BUkNISVZFRDpcbiAgICAgIHJldHVybiB7IHBhdGg6IGJ1bmRsZURpciwgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuWklQX0RJUkVDVE9SWSB9O1xuICAgIGNhc2UgQnVuZGxpbmdPdXRwdXQuQVJDSElWRUQ6XG4gICAgICBpZiAoIWFyY2hpdmVGaWxlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSBpcyBleHBlY3RlZCB0byBpbmNsdWRlIG9ubHkgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIHdoZW4gYG91dHB1dGAgaXMgc2V0IHRvIGBBUkNISVZFRGAnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHBhdGg6IGFyY2hpdmVGaWxlLCBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLCBleHRlbnNpb246IGdldEV4dGVuc2lvbihhcmNoaXZlRmlsZSkgfTtcbiAgfVxufVxuXG4vKipcbiogUmV0dXJuIHRoZSBleHRlbnNpb24gbmFtZSBvZiBhIHNvdXJjZSBwYXRoXG4qXG4qIExvb3AgdGhyb3VnaCBBUkNISVZFX0VYVEVOU0lPTlMgZm9yIHZhbGlkIGFyY2hpdmUgZXh0ZW5zaW9ucy5cbiovXG5mdW5jdGlvbiBnZXRFeHRlbnNpb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBmb3IgKCBjb25zdCBleHQgb2YgQVJDSElWRV9FWFRFTlNJT05TICkge1xuICAgIGlmIChzb3VyY2UudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChleHQpKSB7XG4gICAgICByZXR1cm4gZXh0O1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHBhdGguZXh0bmFtZShzb3VyY2UpO1xufTtcblxuIl19