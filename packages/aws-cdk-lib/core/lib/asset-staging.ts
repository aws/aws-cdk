import * as crypto from 'crypto';
import * as path from 'path';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import type { AssetOptions } from './assets';
import { AssetHashType, FileAssetPackaging } from './assets';
import type { BundlingOptions } from './bundling';
import { BundlingFileAccess, BundlingOutput, PERF_BUNDLING_SRC_SYM } from './bundling';
import { AssumptionError, ValidationError } from './errors';
import type { FingerprintOptions } from './fs';
import { FileSystem, SymlinkFollowMode, IgnoreStrategy } from './fs';
import { clearLargeFileFingerprintCache } from './fs/fingerprint';
import { Names } from './names';
import { AssetBundlingVolumeCopy, AssetBundlingBindMount } from './private/asset-staging';
import { Cache } from './private/cache';
import { stackOf, stageOf } from './private/core-construct-finders';
import { lit } from './private/literal-string';
import { profileSpan } from './private/perf';
import type { Stack } from './stack';
import * as cxapi from '../../cx-api';
import { walkDirectory } from './fs/utils';

const ARCHIVE_EXTENSIONS = ['.tar.gz', '.zip', '.jar', '.tar', '.tgz'];

const ASSET_SALT_CONTEXT_KEY = '@aws-cdk/core:assetHashSalt';

/**
 * A previously staged asset
 */
interface StagedAsset {
  /**
   * The path where we wrote this asset previously
   */
  readonly stagedPath: string;

  /**
   * The hash we used previously
   */
  readonly assetHash: string;

  /**
   * The packaging of the asset
   */
  readonly packaging: FileAssetPackaging;

  /**
   * Whether this asset is an archive
   */
  readonly isArchive: boolean;
}

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
export class AssetStaging extends Construct {
  /**
   * The directory inside the bundling container into which the asset sources will be mounted.
   */
  public static readonly BUNDLING_INPUT_DIR = '/asset-input';

  /**
   * The directory inside the bundling container into which the bundled output should be written.
   */
  public static readonly BUNDLING_OUTPUT_DIR = '/asset-output';

  /**
   * Clears the asset hash cache
   */
  public static clearAssetHashCache() {
    this.assetCache.clear();
    clearLargeFileFingerprintCache();
  }

  /**
   * Cache of asset hashes based on asset configuration to avoid repeated file
   * system and bundling operations.
   */
  private static assetCache = new Cache<StagedAsset>();

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
  public readonly stagedPath: string;

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
  public readonly absoluteStagedPath: string;

  /**
   * The absolute path of the asset as it was referenced by the user.
   */
  public readonly sourcePath: string;

  /**
   * A cryptographic hash of the asset.
   */
  public readonly assetHash: string;

  /**
   * How this asset should be packaged.
   */
  public readonly packaging: FileAssetPackaging;

  /**
   * Whether this asset is an archive (zip or jar).
   */
  public readonly isArchive: boolean;

  private readonly fingerprintOptions: FingerprintOptions;

  private readonly hashType: AssetHashType;
  private readonly assetOutdir: string;

  /**
   * A custom source fingerprint given by the user
   *
   * Will not be changed, hashed later on.
   */
  private readonly customSourceFingerprint?: string;

  private readonly cacheKey: string;

  constructor(scope: Construct, id: string, props: AssetStagingProps) {
    super(scope, id);

    const salt = this.node.tryGetContext(ASSET_SALT_CONTEXT_KEY);

    this.sourcePath = path.resolve(props.sourcePath);
    this.fingerprintOptions = {
      ...props,
      exclude: ['.is_custom_resource', ...props.exclude ?? []],
      extraHash: props.extraHash || salt ? `${props.extraHash ?? ''}${salt ?? ''}` : undefined,
    };

    // Stat the source once. The decisions below depend on whether it's a file or a directory.
    const sourceStats = fs.statSync(this.sourcePath, { throwIfNoEntry: false });
    if (!sourceStats) {
      throw new ValidationError(lit`CannotFindAsset`, `Cannot find asset at ${this.sourcePath}`, this);
    }

    // Look for invalid (external) symlinks. Uses `fingerprintOptions`, so we check
    // exactly the files that get packaged.
    if (props.follow == SymlinkFollowMode.BLOCK_EXTERNAL && sourceStats.isDirectory()) {
      validateInternalSymlinks(this.sourcePath, this, props.follow, IgnoreStrategy.fromCopyOptions(this.fingerprintOptions, this.sourcePath));
    }

    const outdir = stageOf(this)?.assetOutdir;
    if (!outdir) {
      throw new ValidationError(lit`UnableToDetermineCloudAssembly`, 'unable to determine cloud assembly asset output directory. Assets must be defined indirectly within a "Stage" or an "App" scope', this);
    }
    this.assetOutdir = outdir;

    // Determine the hash type based on the props as props.assetHashType is
    // optional from a caller perspective.
    this.customSourceFingerprint = props.assetHash;
    this.hashType = determineHashType(this, props.assetHashType, this.customSourceFingerprint);

    // Decide what to do, without doing it yet. Bundling is skipped when no stack needs
    // it; we still produce a hash, so `skip` is part of the cache key below.
    const bundling = props.bundling;
    const skip = bundling !== undefined && !stackOf(this).bundlingRequired;
    const stageThisAsset = bundling
      ? () => this.stageByBundling(bundling, skip, props, sourceStats)
      : () => this.stageByCopying(sourceStats);

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

    // Actually stage the asset: on a cache miss, we stage the asset.
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
  public get sourceHash(): string {
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
  public relativeStagedPath(stack: Stack) {
    const asmManifestDir = stageOf(stack)?.outdir;
    if (!asmManifestDir) { return this.stagedPath; }

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
  private stageByCopying(sourceStats: fs.Stats): StagedAsset {
    if (!sourceStats.isDirectory() && !sourceStats.isFile()) {
      throw new ValidationError(lit`AssetExpectedDirectoryOrFile`, `Asset ${this.sourcePath} is expected to be either a directory or a regular file`, this);
    }

    const assetHash = this.calculateHash(this.hashType, this.customSourceFingerprint);
    const targetPath = this.stagingDisabled
      ? this.sourcePath
      : path.resolve(this.assetOutdir, renderAssetFilename(assetHash, getExtension(this.sourcePath)));
    const stagedPath = this.renderStagedPath(this.sourcePath, targetPath);

    this.copySourceIntoStaging(stagedPath, sourceStats);

    return {
      assetHash,
      stagedPath,
      packaging: sourceStats.isDirectory() ? FileAssetPackaging.ZIP_DIRECTORY : FileAssetPackaging.FILE,
      isArchive: sourceStats.isDirectory() || ARCHIVE_EXTENSIONS.includes(getExtension(this.sourcePath).toLowerCase()),
    };
  }

  /**
   * Stage the source to the target by bundling
   */
  private stageByBundling(bundling: BundlingOptions, skip: boolean, props: AssetStagingProps, sourceStats: fs.Stats): StagedAsset {
    if (!sourceStats.isDirectory()) {
      throw new ValidationError(lit`AssetExpectedDirectoryForBundling`, `Asset ${this.sourcePath} is expected to be a directory when bundling`, this);
    }

    if (skip) {
      return this.stageBySkippingBundling(bundling);
    }

    // Bundle straight into the final asset directory if we know the hash, otherwise
    // into a temporary one we hash and rename afterwards.
    const knownDirHash = this.hashIsKnownBeforeBundling
      ? this.calculateHash(this.hashType, this.customSourceFingerprint, bundling)
      : undefined;
    const bundleDir = this.determineBundleDir(knownDirHash);
    this.bundle(bundling, bundleDir);

    const outputType = bundling.outputType ?? BundlingOutput.AUTO_DISCOVER;
    const ignore = IgnoreStrategy.fromCopyOptions(this.fingerprintOptions, bundleDir);
    const bundledAsset = determineBundledAsset(this, bundleDir, outputType, ignore, props.follow);

    const assetHash = knownDirHash
      ?? this.calculateHash(this.hashType, this.customSourceFingerprint, bundling, bundledAsset.path);
    const stagedPath = this.renderStagedPath(
      bundledAsset.path,
      path.resolve(this.assetOutdir, renderAssetFilename(assetHash, bundledAsset.extension)),
    );

    this.moveBundleIntoStaging(bundledAsset.path, stagedPath);
    this.cleanUpBundleDir(bundledAsset);

    return {
      assetHash,
      stagedPath,
      packaging: bundledAsset.packaging,
      isArchive: outputType !== BundlingOutput.SINGLE_FILE,
    };
  }

  /**
   * Produce a `StagedAsset` for an asset we deliberately did not bundle.
   *
   * No stack needs the output, so we skip the bundling and return the source directory.
   */
  private stageBySkippingBundling(bundling: BundlingOptions): StagedAsset {
    // OUTPUT and BUNDLE hash the bundling result, which we don't have. Use a CUSTOM hash
    // instead of fingerprinting a potentially very large source directory.
    const hashType = this.hashIsKnownBeforeBundling ? this.hashType : AssetHashType.CUSTOM;
    const customFingerprint = this.hashIsKnownBeforeBundling
      ? this.customSourceFingerprint
      : Names.uniqueId(this);

    return {
      assetHash: this.calculateHash(hashType, customFingerprint, bundling),
      stagedPath: this.sourcePath,
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      isArchive: true,
    };
  }

  /**
   * Whether the asset hash can be computed before bundling runs.
   *
   * SOURCE and CUSTOM come from the input; OUTPUT and BUNDLE come from the result.
   */
  private get hashIsKnownBeforeBundling(): boolean {
    return this.hashType === AssetHashType.SOURCE || this.hashType === AssetHashType.CUSTOM;
  }

  /**
   * Tidy up the bundling directory after its output has been staged.
   *
   * Only single-file output leaves a directory behind, since a bundled directory was
   * renamed into staging. Moving that one file out left the directory empty,
   * and what we do with it depends on whether a later run looks for it:
   *
   * - Hash known up front: it is `asset.<hash>`, which a later run reuses to skip
   *   bundling. Recreate the file empty so that run still sees single-file output.
   * - Hash known afterwards: it is `bundling-temp-<cacheKey>`, so delete it.
   */
  private cleanUpBundleDir(bundledAsset: BundledAsset) {
    if (bundledAsset.packaging !== FileAssetPackaging.FILE) {
      return;
    }

    if (this.hashIsKnownBeforeBundling) {
      fs.closeSync(fs.openSync(bundledAsset.path, 'w'));
    } else {
      fs.removeSync(path.dirname(bundledAsset.path));
    }
  }

  /**
   * Whether staging has been disabled
   */
  private get stagingDisabled() {
    return !!this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
  }

  /**
   * Move a freshly created bundle into the staging directory.
   *
   * We own the bundle directory, since `bundle()` just produced it: renaming it into
   * place is cheap, and if the staged asset already exists we can throw the bundle away.
   *
   * Does nothing if bundle and staged path are the same.
   */
  private moveBundleIntoStaging(bundlePath: string, stagedPath: string) {
    // Already staged, so our bundle output is redundant.
    if (fs.existsSync(stagedPath)) {
      if (bundlePath !== stagedPath) {
        fs.removeSync(bundlePath);
      }
      return;
    }

    fs.renameSync(bundlePath, stagedPath);
  }

  /**
   * Copy the user's source into the staging directory.
   *
   * The source belongs to the user, so it is only ever read, never moved or deleted.
   *
   * Does nothing if source and staged path are the same, i.e. when staging is disabled.
   *
   * `sourceStats` is a file or a directory; `stageByCopying` has already rejected
   * anything else.
   */
  private copySourceIntoStaging(stagedPath: string, sourceStats: fs.Stats) {
    // Is the work already done?
    if (fs.existsSync(stagedPath)) {
      return;
    }

    if (sourceStats.isFile()) {
      fs.copyFileSync(this.sourcePath, stagedPath);
    } else {
      fs.mkdirSync(stagedPath);
      FileSystem.copyDirectory(this.sourcePath, stagedPath, this.fingerprintOptions);
    }
  }

  /**
   * Determine the directory where we're going to write the bundling output
   *
   * The final staged asset directory if the hash is already known, otherwise an
   * intermediate one named after the asset's cache key.
   */
  private determineBundleDir(assetHash?: string) {
    return path.resolve(
      this.assetOutdir,
      assetHash ? renderAssetFilename(assetHash) : `bundling-temp-${this.cacheKey}`,
    );
  }

  /**
   * Make sure `bundleDir` holds the bundled asset
   *
   * If the directory already exists, a previous run bundled identical content there and
   * we don't bundle again. Either way the result is checked for output, so an empty
   * directory left behind by an interrupted run is not staged as an empty asset.
   *
   * @param options Bundling options
   * @param bundleDir Where to create the bundle directory
   */
  private bundle(options: BundlingOptions, bundleDir: string) {
    const existing = fs.statSync(bundleDir, { throwIfNoEntry: false });
    const bundledLocally = existing ? undefined : this.runBundling(options, bundleDir);

    // A `bundleDir` that isn't a directory is reported by `determineBundledAsset`, which
    // has a clearer message for it than a failed read would.
    if (existing && !existing.isDirectory()) {
      return;
    }

    if (FileSystem.isEmpty(bundleDir)) {
      // Name the directory the user writes to theirs locally, the container's mount otherwise.
      const outputDir = bundledLocally ? bundleDir : AssetStaging.BUNDLING_OUTPUT_DIR;
      throw new ValidationError(lit`BundlingProducedNoOutput`, `Bundling did not produce any output. Check that content is written to ${outputDir}.`, this);
    }
  }

  /**
   * Bundle into `bundleDir`, returning whether the bundling ran locally
   */
  private runBundling(options: BundlingOptions, bundleDir: string): boolean | undefined {
    // Bundle into a sibling and rename on success, so an interrupted run can't leave a
    // partial bundle at `bundleDir` for a later run to mistake for a complete one.
    const tempDir = `${bundleDir}-building`;
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.ensureDirSync(tempDir);
    fs.chmodSync(tempDir, 0o777); // the bundling container may run as another user

    let bundledLocally: boolean | undefined;
    try {
      process.stderr.write(`Bundling asset ${this.node.path}...\n`);

      using _span = timerSpanFromOptions(options);

      bundledLocally = options.local?.tryBundle(tempDir, options);
      if (!bundledLocally) {
        this.bundleWithDocker(options, tempDir);
      }
    } catch (err) {
      throw new ValidationError(lit`FailedToBundleAsset`, `Failed to bundle asset ${this.node.path}, bundle output is located at ${tempDir}: ${err}`, this);
    }

    // Outside the `catch`: bundling has succeeded, so a failure to move the output into
    // place is not a bundling failure and must not be reported as one.
    fs.renameSync(tempDir, bundleDir);

    return bundledLocally;
  }

  /**
   * Run the bundling command in a Docker container.
   */
  private bundleWithDocker(options: BundlingOptions, bundleDir: string) {
    const bundlingOptions = {
      sourcePath: this.sourcePath,
      bundleDir,
      ...options,
    };

    switch (options.bundlingFileAccess) {
      case BundlingFileAccess.VOLUME_COPY:
        new AssetBundlingVolumeCopy(bundlingOptions).run();
        break;
      case BundlingFileAccess.BIND_MOUNT:
      default:
        new AssetBundlingBindMount(bundlingOptions).run();
        break;
    }
  }

  /**
   * Compute the asset hash.
   *
   * `customFingerprint` is passed in rather than read from the field, because the
   * skipped-bundling path substitutes one of its own.
   */
  private calculateHash(hashType: AssetHashType, customFingerprint: string | undefined, bundling?: BundlingOptions, outputDir?: string): string {
    // When bundling a CUSTOM or SOURCE asset hash type, we want the hash to include
    // the bundling configuration. We handle CUSTOM and bundled SOURCE hash types
    // as a special case to preserve existing user asset hashes in all other cases.
    if (hashType == AssetHashType.CUSTOM || (hashType == AssetHashType.SOURCE && bundling)) {
      const hash = crypto.createHash('sha256');

      // if asset hash is provided by user, use it, otherwise fingerprint the source.
      hash.update(customFingerprint ?? FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions));

      // If we're bundling an asset, include the bundling configuration in the hash
      if (bundling) {
        hash.update(JSON.stringify(bundling, sanitizeHashValue));
      }

      return hash.digest('hex');
    }

    switch (hashType) {
      case AssetHashType.SOURCE:
        return FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions);
      case AssetHashType.BUNDLE:
      case AssetHashType.OUTPUT:
        if (!outputDir) {
          throw new ValidationError(lit`CannotUseHashTypeWithoutBundling`, `Cannot use \`${hashType}\` hash type when \`bundling\` is not specified.`, this);
        }
        return FileSystem.fingerprint(outputDir, this.fingerprintOptions);
      default:
        throw new ValidationError(lit`UnknownAssetHashType`, 'Unknown asset hash type.', this);
    }
  }

  private renderStagedPath(sourcePath: string, targetPath: string): string {
    // Add a suffix to the asset file name
    // because when a file without extension is specified, the source directory name is the same as the staged asset file name.
    // But when the hashType is `AssetHashType.OUTPUT`, the source directory name begins with `bundling-temp-` and the staged asset file name is different.
    // We only need to add a suffix when the hashType is not `AssetHashType.OUTPUT`.
    if (this.hashType !== AssetHashType.OUTPUT && path.dirname(sourcePath) === targetPath) {
      targetPath = targetPath + '_noext';
    }
    return targetPath;
  }
}

function renderAssetFilename(assetHash: string, extension = '') {
  return `asset.${assetHash}${extension}`;
}

/**
 * Determines the hash type from user-given prop values.
 *
 * @param assetHashType Asset hash type construct prop
 * @param customSourceFingerprint Asset hash seed given in the construct props
 */
function determineHashType(scope: Construct, assetHashType?: AssetHashType, customSourceFingerprint?: string) {
  const hashType = customSourceFingerprint
    ? (assetHashType ?? AssetHashType.CUSTOM)
    : (assetHashType ?? AssetHashType.SOURCE);

  if (customSourceFingerprint && hashType !== AssetHashType.CUSTOM) {
    throw new ValidationError(lit`CannotSpecifyAssetHashTypeWithAssetHash`, `Cannot specify \`${assetHashType}\` for \`assetHashType\` when \`assetHash\` is specified. Use \`CUSTOM\` or leave \`undefined\`.`, scope);
  }
  if (hashType === AssetHashType.CUSTOM && !customSourceFingerprint) {
    throw new ValidationError(lit`MustBeSpecified`, '`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.', scope);
  }

  return hashType;
}

/**
 * Walk the directory tree, throw if we find external symlinks
 *
 * Only checks entries that end up in the asset: ignored files, and the contents of
 * ignored directories, are skipped.
 */
function validateInternalSymlinks(
  root: string,
  scope: Construct,
  followMode: SymlinkFollowMode,
  ignoreStrategy: IgnoreStrategy,
) {
  // Under BLOCK_EXTERNAL the walk follows internal links and reports external ones, which
  // is exactly the set we have to reject. Links the ignore strategy excludes never reach
  // us, so nothing outside the asset is validated.
  walkDirectory(root, { follow: followMode, ignoreStrategy }, {
    onSymlink: (entry) => {
      if (!entry.internal) {
        throw new ValidationError(
          lit`BundlingFileSymlinkForbidden`,
          `The file ${entry.resolvedLinkTarget} is an external symbolic link which is forbidden due to follow mode ${followMode}. Set \`follow\` to a mode that will follow symlinks (ALWAYS or EXTERNAL) or emit a regular file`,
          scope,
        );
      }
    },
  });
}

/**
 * Calculates a cache key from the props. Normalize by sorting keys.
 */
function calculateCacheKey<A extends object>(props: A): string {
  return crypto.createHash('sha256')
    .update(JSON.stringify(sortObject(props), sanitizeHashValue))
    .digest('hex');
}

/**
 * Recursively sort object keys
 */
function sortObject(object: { [key: string]: any }): { [key: string]: any } {
  if (typeof object !== 'object' || object instanceof Array) {
    return object;
  }
  const ret: { [key: string]: any } = {};
  for (const key of Object.keys(object).sort()) {
    ret[key] = sortObject(object[key]);
  }
  return ret;
}

/**
 * Removes the auth token from pip URLs if present to prevent an unnecessary
 * rebuild.
 *
 * @see https://github.com/aws/aws-cdk/issues/27331
 */
function sanitizeHashValue(key: string, value: any): any {
  if (key === 'PIP_INDEX_URL' || key === 'PIP_EXTRA_INDEX_URL') {
    try {
      let url = new URL(value);
      if (url.password) {
        url.password = '';
        return url.toString();
      }
    } catch (e: any) {
      if (e.name === 'TypeError') {
        throw new AssumptionError(lit`MustBeValid`, `${key} must be a valid URL, got ${value}.`);
      }
      throw e;
    }
  }
  return value;
}

interface BundledAsset {
  path: string;
  packaging: FileAssetPackaging;
  extension?: string;
}

/**
 * Returns the bundled asset to use based on the content of the bundle directory
 * and the type of output.
 *
 * Reads the bundle directory once; everything below is derived from those entries.
 */
function determineBundledAsset(
  scope: Construct,
  bundleDir: string,
  outputType: BundlingOutput,
  ignore: IgnoreStrategy,
  followMode?: SymlinkFollowMode,
): BundledAsset {
  const stats = fs.statSync(bundleDir, { throwIfNoEntry: false });
  if (!stats) {
    throw new ValidationError(lit`DirectoryDoesNotExist`, `Directory ${bundleDir} does not exist.`, scope);
  }
  if (!stats.isDirectory()) {
    throw new ValidationError(lit`PathIsNotDirectory`, `${bundleDir} is not a directory.`, scope);
  }

  const entries = fs.readdirSync(bundleDir, { withFileTypes: true });
  const singleFile = findSingleOutputFile(entries, outputType);

  // auto-discover means that if there is an archive file, we take it as the
  // bundle, otherwise, we will archive here.
  const discoveredOutputType = outputType === BundlingOutput.AUTO_DISCOVER
    ? (singleFile ? BundlingOutput.ARCHIVED : BundlingOutput.NOT_ARCHIVED)
    : outputType;

  switch (discoveredOutputType) {
    case BundlingOutput.NOT_ARCHIVED:
      if (followMode == SymlinkFollowMode.BLOCK_EXTERNAL) {
        validateInternalSymlinks(bundleDir, scope, followMode, ignore);
      }
      return { path: bundleDir, packaging: FileAssetPackaging.ZIP_DIRECTORY };
    case BundlingOutput.ARCHIVED:
    case BundlingOutput.SINGLE_FILE:
      if (!singleFile) {
        throw new ValidationError(lit`BundlingOutputDirectoryExpectedSingleFile`, 'Bundling output directory is expected to include only a single file when `output` is set to `ARCHIVED` or `SINGLE_FILE`', scope);
      } else if (singleFile.isSymbolicLink()) {
        throw new ValidationError(lit`SymlinkInBundlingOutput`, 'The output from bundling is not allowed to be a symlink.', scope);
      }
      return {
        path: path.join(bundleDir, singleFile.name),
        packaging: FileAssetPackaging.FILE,
        extension: getExtension(singleFile.name),
      };
  }
}

/**
 * Returns the lone file bundling produced, or undefined if the output isn't a single file.
 *
 * `SINGLE_FILE` accepts any lone file. Other output types only accept one that looks like
 * an archive, so a single loose file still gets zipped.
 */
function findSingleOutputFile(entries: fs.Dirent[], outputType: BundlingOutput): fs.Dirent | undefined {
  if (entries.length !== 1) {
    return undefined;
  }

  const entry = entries[0];
  const isFile = entry.isFile() || entry.isSymbolicLink();
  const isArchive = ARCHIVE_EXTENSIONS.includes(getExtension(entry.name).toLowerCase());

  return isFile && (isArchive || outputType === BundlingOutput.SINGLE_FILE) ? entry : undefined;
}

/**
 * Return the extension name of a source path
 *
 * Loop through ARCHIVE_EXTENSIONS for valid archive extensions.
 */
function getExtension(source: string): string {
  for ( const ext of ARCHIVE_EXTENSIONS ) {
    if (source.toLowerCase().endsWith(ext)) {
      return ext;
    }
  }

  return path.extname(source);
}

function timerSpanFromOptions(x: any): Disposable | undefined {
  const src = bundlingSourceFromOptions(x);
  return src ? profileSpan(`bundle:${src}`, { telemetry: true }) : undefined;
}

/**
 * Get the bundling source from the options object
 *
 * If this is a built-in CDK bundling source, it will have a value here we use to log a timer
 */
function bundlingSourceFromOptions(x: any): string | undefined {
  const value = x[PERF_BUNDLING_SRC_SYM];
  return typeof value === 'string' ? value : undefined;
}
