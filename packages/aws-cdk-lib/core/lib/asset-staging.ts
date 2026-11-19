import * as crypto from 'crypto';
import * as path from 'path';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import { Annotations } from './annotations';
import type { AssetOptions } from './assets';
import { AssetHashType, FileAssetPackaging } from './assets';
import type { BundlingOptions } from './bundling';
import { BundlingFileAccess, BundlingOutput, PERF_BUNDLING_SRC_SYM } from './bundling';
import { AssumptionError, ValidationError } from './errors';
import type { FingerprintOptions } from './fs';
import { FileSystem, IgnoreStrategy, SymlinkFollowMode } from './fs';
import { clearLargeFileFingerprintCache } from './fs/fingerprint';
import { Names } from './names';
import { AssetBundlingVolumeCopy, AssetBundlingBindMount } from './private/asset-staging';
import { clearKnownDockerImages } from './private/bundling';
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
   * Whether this asset will ultimately end up in S3 as an archive
   *
   * It will end up as an archive either if it's a directory (which
   * the CDK will ZIP) or if it's a file that's an archive.
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
 * This construct can operate in two modes: without and with "bundling". Bundling
 * means that an additional command is run to transform the source files into
 * a final asset that will be used for deployment.
 *
 * ## Without bundling
 *
 * Without the `bundling` property, the asset is just a regular file copy
 * operation.
 *
 * - `exclude` and `ignoreMode` control which files are excluded from the copy operation.
 * - `follow` controls how symlinks are handled during the copy operation:
 *   the symlink can be copied, the file the symlink points to can be copied,
 *   or symlinks pointing outside the source tree can be blocked.
 * - The asset hash is calculated based on the files that are copied into the asset,
 *   unless the hash is overridden entirely by the `assetHash` property.
 *
 * The copy-staging operation can be disabled by setting the context
 * key `'aws:cdk:asset-staging': false`. This can be useful for local
 * development tools like SAM CLI, so that you can update the source files
 * directly and immediately see the result in a local emulator without needing
 * to run `cdk synth` every time to stage the assets. Note that in this mode,
 * since there is no copying, `exclude` and `follow` settings have no effect,
 * including `BLOCK_EXTERNAL` which will not be applied.
 *
 * ## With bundling
 *
 * With the `bundling` property, the transformation of source files to a final asset
 * is done through bundling operation specified in the `bundling` property.
 *
 * The behavior of the construct depends on the `assetHashType` selected:
 *
 * - `AssetHashType.SOURCE`: the asset hash will be based on the source files
 *   after applying the `exclude`, `ignoreMode` and `follow` settings. That hash
 *   will be used to skip the bundling command entirely if an asset with the given
 *   hash already exists in the assembly directory. This requires that those
 *   settings accurately model the dependencies used by the bundling operation to
 *   produce the final asset.
 * - `AssetHashType.OUTPUT`: the asset hash will be based on the output of the
 *   bundling operation. `exclude`/`ignoreMode` are not used, and no attempt
 *   is made to materialize any symlinks that bundling may have written.
 * - `AssetHashType.CUSTOM`: the asset hash will be taken from the `assetHash`
 *   property. `exclude`/`ignoreMode` are not used, and no attempt is made to
 *   materialize any symlinks that bundling may have written.
 *
 * For all three modes, if `follow` is set to `SymlinkFollowMode.BLOCK_EXTERNAL`,
 * any symlinks written by bundling that point outside the output directory
 * will be blocked.
 *
 * For bundled assets, staging can not be disabled for the benefit of local
 * development. If you are iterating against a local emulator, you will need to
 * run `cdk synth` for every asset change.
 *
 * ## Other behavior
 *
 * The `stagedPath` property is a stringified token that represents the location
 * of the file or directory after staging. It will be resolved only during the
 * "prepare" stage and may be either the original path or the staged path
 * depending on the context setting.
 *
 * The file/directory are staged based on their content hash (fingerprint). This
 * means that only if content was changed, copy will happen.
 *
 * ## Security notes on BLOCK_EXTERNAL symlinks
 *
 * If a bundled asset is being reused from the `cdk.out` cache, the BLOCK_EXTERNAL
 * symlink check is not re-run, and on an asset hash collission (made more likely
 * in the case of a chosen `CUSTOM` hash) external symlinks left over from a
 * previous unchecked synth can persist. This is unlikely to be a problem in
 * practice, but to prevent this from happening to you, delete the `cdk.out`
 * directory whenever you switch from non-`BLOCK_EXTERNAL` to `BLOCK_EXTERNAL` follow mode.
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
    this.deduplicationCache.clear();
    clearLargeFileFingerprintCache();
    clearKnownDockerImages();
  }

  /**
   * Cache of asset hashes based on asset configuration to avoid repeated file
   * system and bundling operations.
   */
  private static deduplicationCache = new Cache<StagedAsset>();

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
   * Whether this asset will ultimately end up in S3 as an archive
   *
   * It will end up as an archive either if it's a directory (which
   * the CDK will ZIP) or if it's a file that's an archive.
   */
  public readonly isArchive: boolean;

  private readonly fingerprintOptions: FingerprintOptions;

  private readonly hashType: AssetHashType;
  private readonly assetOutdir: string;

  /**
   * A custom source fingerprint given by the user
   *
   * Will not be used literally, always hashed later on.
   */
  private customSourceFingerprint?: string;

  private readonly deduplicationKey: string;

  private readonly sourceStats: FileStats;

  constructor(scope: Construct, id: string, props: AssetStagingProps) {
    super(scope, id);

    const salt = this.node.tryGetContext(ASSET_SALT_CONTEXT_KEY);

    this.sourcePath = path.resolve(props.sourcePath);
    this.fingerprintOptions = {
      follow: props.follow,
      ignoreMode: props.ignoreMode,
      exclude: ['.is_custom_resource', ...props.exclude ?? []],
      extraHash: props.extraHash || salt ? `${props.extraHash ?? ''}${salt ?? ''}` : undefined,
    };

    if (!fs.existsSync(this.sourcePath)) {
      throw new ValidationError(lit`CannotFindAsset`, `Cannot find asset at ${this.sourcePath}`, this);
    }

    const stats = fs.statSync(this.sourcePath);
    this.sourceStats = new FileStats(stats.isDirectory(), stats.isFile());

    const outdir = stageOf(this)?.assetOutdir;
    if (!outdir) {
      throw new ValidationError(lit`UnableToDetermineCloudAssembly`, 'unable to determine cloud assembly asset output directory. Assets must be defined indirectly within a "Stage" or an "App" scope', this);
    }
    this.assetOutdir = outdir;

    // Determine the hash type based on the props as props.assetHashType is
    // optional from a caller perspective.
    this.customSourceFingerprint = props.assetHash;
    this.hashType = determineHashType(this, props.assetHashType, this.customSourceFingerprint);

    // Check for some nonsensical configurations that aren't rejected below. Historically these used to be accepted,
    // but either didn't do anything or did the wrong thing. We don't want to turn these into errors outright, but
    // we do want to warn the user about them.
    if (props.bundling && this.hashType !== AssetHashType.SOURCE) {
      if (props.exclude && props.exclude.length > 0) {
        Annotations.of(this).addWarningV2('@aws-cdk/core:meaninglessExclude', `"exclude" is configured on a bundled asset, but that field does nothing unless assetHashType is "SOURCE" (got "${this.hashType}")`);
      }
      if (!!props.follow && props.follow !== SymlinkFollowMode.BLOCK_EXTERNAL && props.follow !== SymlinkFollowMode.NEVER) {
        Annotations.of(this).addWarningV2('@aws-cdk/core:meaninglessFollow', `On a bundled asset with assetHashType "${this.hashType}", only "follow: BLOCK_EXTERNAL" has an effect (got "${props.follow}")`);
      }
    }
    if (!props.bundling && [AssetHashType.BUNDLE, AssetHashType.OUTPUT].includes(this.hashType)) {
      throw new ValidationError(lit`CannotUseHashTypeWithoutBundling`, `Cannot use \`${this.hashType}\` hash type when \`bundling\` is not specified.`, this);
    }

    const skip = props.bundling ? !stackOf(this).bundlingRequired : false;

    // Calculate a deduplication key from the props. This way we can check if we already
    // staged this asset and reuse the result (e.g. the same asset with the same
    // configuration is used in multiple stacks). In this case we can completely
    // skip file system and bundling operations.
    //
    // The output directory and whether this asset is skipped or not should also be
    // part of the deduplication key to make sure we don't accidentally return the wrong
    // staged asset from the cache.
    this.deduplicationKey = calculateDeduplicationKey({
      outdir: this.assetOutdir,
      sourcePath: path.resolve(props.sourcePath),
      bundling: props.bundling,
      assetHashType: this.hashType,
      customFingerprint: this.customSourceFingerprint,
      extraHash: this.fingerprintOptions.extraHash,
      exclude: props.exclude,
      ignoreMode: props.ignoreMode,
      follow: props.follow,
      skip,
      stagingDisabled: this.stagingDisabled,
    });

    let staged: StagedAsset;
    if (props.bundling) {
      const bundling = props.bundling;

      staged = AssetStaging.deduplicationCache.obtain(this.deduplicationKey, () => this.stageByBundling(bundling, skip));
    } else {
      staged = AssetStaging.deduplicationCache.obtain(this.deduplicationKey, () => this.stageByCopying());
    }

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
   * Optionally skip if staging is disabled, in which case we pretend we did
   * something but we don't really.  This mode is designed for quick iteration
   * using a local development tool, like SAM CLI. The produced template will
   * link to the source location of the asset, rather than the staged location,
   * so that you don't need to run `cdk synth` every time you make changes to
   * the asset source.
   */
  private stageByCopying(): StagedAsset {
    const assetHash = this.calculateSourceHash(undefined);
    const targetPath = this.stagingDisabled
      ? this.sourcePath
      : path.resolve(this.assetOutdir, renderAssetFilename(assetHash, getExtension(this.sourcePath)));
    const stagedPath = this.renderStagedPath(this.sourcePath, targetPath);

    if (!this.sourceStats.isDirectory() && !this.sourceStats.isFile()) {
      throw new ValidationError(lit`AssetExpectedDirectoryOrFile`, `Asset ${this.sourcePath} is expected to be either a directory or a regular file`, this);
    }

    this.stageAsset(this.sourcePath, stagedPath, 'copy');

    return {
      assetHash,
      stagedPath,
      packaging: this.sourceStats.isDirectory() ? FileAssetPackaging.ZIP_DIRECTORY : FileAssetPackaging.FILE,
      isArchive: this.sourceStats.isDirectory() || isArchiveFile(this.sourcePath),
    };
  }

  /**
   * Stage the source to the target by bundling
   *
   * Optionally skip, which in this case means that we don't do the actual bundling command because
   * we consider it too slow and we are only interested in the template anyway.
   */
  private stageByBundling(bundling: BundlingOptions, skip: boolean): StagedAsset {
    if (!this.sourceStats.isDirectory()) {
      throw new ValidationError(lit`AssetExpectedDirectoryForBundling`, `Asset ${this.sourcePath} is expected to be a directory when bundling`, this);
    }

    if (skip) {
      // We should have bundled, but didn't to save time. We still need to pretend to have
      // a hash, but it doesn't quite matter what it is.
      const hash = crypto.createHash('sha256');
      hash.update(Names.uniqueId(this));
      const fakeAssetHash = hash.digest('hex');

      return {
        assetHash: fakeAssetHash,
        stagedPath: this.sourcePath,
        packaging: FileAssetPackaging.ZIP_DIRECTORY,
        isArchive: true,
      };
    }

    const bundlingOutputType = bundling.outputType ?? BundlingOutput.AUTO_DISCOVER;

    // Try to calculate assetHash beforehand (if we can)
    let assetHash = this.calculateHashBeforehand ? this.calculateSourceHash(bundling) : undefined;

    // Bundling proceeds in 2 steps:
    // - Run the bundling command to turn the source into a BUNDLE DIRECTORY
    // - Get the BUNDLE ASSET from the BUNDLE DIRECTORY. Either use the entire
    //   directory as the asset, or pick a single file from that directory to be
    //   the final asset.
    // The first step, running the command to a directory, is a step we could skip. To that end,
    // let's leave the output directory in place in the Cloud Assembly, and take its existence (with the source
    // hash in place) as proof that we have already performed the bundling step.
    let bundleDir = this.bundlingOutputdir(assetHash);
    if (!assetHash || !bundleDir || !fs.existsSync(bundleDir) || isLegacyPlaceholderDirectory(bundleDir)) {
      const tempDir = this.bundleToTempDir(bundling, assetHash);

      // Calculate the final output asset hash here if we didn't have one yet
      // calculateOutputHash will make sure that there are no symlinks pointing outside the directory.
      // If we are not going to call it, do an additional validation of that same fact.
      if (assetHash) {
        if (this.fingerprintOptions.follow === SymlinkFollowMode.BLOCK_EXTERNAL) {
          validateInternalSymlinks(tempDir);
        }
      } else {
        // Pick the asset target from the temp dir, but only for hashing purposes.
        // That way, we hash either the single file contents or the entire directory.
        const hashTarget = pickAssetTarget(this, tempDir, bundlingOutputType);
        assetHash = this.calculateOutputHash(hashTarget.path);
      }
      bundleDir = this.bundlingOutputdir(assetHash);

      // Success, rename the tempDir into place (removing the old directory if it exists)
      FileSystem.rmrf(bundleDir);
      fs.renameSync(tempDir, bundleDir);
    }

    // Pick the asset from the bundling directory
    const targetAsset = pickAssetTarget(this, bundleDir, bundlingOutputType);
    return {
      assetHash,
      stagedPath: targetAsset.path,
      packaging: targetAsset.packaging,
      isArchive: targetAsset.isArchive,
    };
  }

  private get calculateHashBeforehand() {
    return this.hashType === AssetHashType.SOURCE || this.hashType === AssetHashType.CUSTOM;
  }

  /**
   * Whether staging has been disabled
   */
  private get stagingDisabled() {
    return !!this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
  }

  /**
   * Copies or moves the files from sourcePath to targetPath.
   *
   * Moving implies the source directory is temporary and can be trashed.
   *
   * Will not do anything if source and target are the same.
   */
  private stageAsset(sourcePath: string, targetPath: string, style: 'move' | 'copy') {
    // Is the work already done?
    const isAlreadyStaged = fs.existsSync(targetPath);
    if (isAlreadyStaged) {
      if (style === 'move' && sourcePath !== targetPath) {
        fs.removeSync(sourcePath);
      }
      return;
    }

    // Moving can be done quickly
    if (style === 'move') {
      fs.renameSync(sourcePath, targetPath);
      return;
    }

    // Copy file/directory to staging directory
    if (this.sourceStats.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else if (this.sourceStats.isDirectory()) {
      FileSystem.copyDirectoryAtomic(sourcePath, targetPath, this.fingerprintOptions);
    } else {
      throw new ValidationError(lit`UnknownFileType`, `Unknown file type: ${sourcePath}`, this);
    }
  }

  /**
   * Return the directory where the bundling output will be placed.
   *
   * This is where we expect the output of the bundling command to end up after
   * running it.
   *
   * If the source hash is known, this will be the directory named after the hash.
   * Otherwise, it will be undefined.
   */
  private bundlingOutputdir<A extends string | undefined>(sourceHash: A): A {
    if (sourceHash === undefined) {
      // { A must contain `undefined` so this is correct }
      return undefined as any;
    }

    return path.resolve(this.assetOutdir, renderAssetFilename(sourceHash)) as any;
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
  private bundleToTempDir(options: BundlingOptions, assetHash: string | undefined): string {
    const tempDir = path.resolve(this.assetOutdir, `asset.${assetHash ?? this.deduplicationKey}-building`);

    // Remove the tempDir if it exists, then recreate it
    fs.rmSync(tempDir, { recursive: true, force: true });

    fs.ensureDirSync(tempDir);
    // Chmod the bundleDir to full access.
    fs.chmodSync(tempDir, 0o777);

    let localBundling: boolean | undefined;
    try {
      process.stderr.write(`Bundling asset ${this.node.path}...\n`);

      using _span = timerSpanFromOptions(options);

      localBundling = options.local?.tryBundle(tempDir, options);
      if (!localBundling) {
        // Running the image would also build it, but building first keeps the build time out of the container run time
        options.image.buildImage?.();

        const assetStagingOptions = {
          sourcePath: this.sourcePath,
          bundleDir: tempDir,
          ...options,
        };

        switch (options.bundlingFileAccess) {
          case BundlingFileAccess.VOLUME_COPY:
            new AssetBundlingVolumeCopy(assetStagingOptions).run();
            break;
          case BundlingFileAccess.BIND_MOUNT:
          default:
            new AssetBundlingBindMount(assetStagingOptions).run();
            break;
        }
      }
    } catch (err) {
      throw new ValidationError(lit`FailedToBundleAsset`, `Failed to bundle asset ${this.node.path}, bundle output is located at ${tempDir}: ${err}`, this);
    }

    if (FileSystem.isEmpty(tempDir)) {
      const outputDir = localBundling ? tempDir : AssetStaging.BUNDLING_OUTPUT_DIR;
      throw new ValidationError(lit`BundlingProducedNoOutput`, `Bundling did not produce any output. Check that content is written to ${outputDir}.`, this);
    }

    return tempDir;
  }

  /**
   * Calculate the asset hash as a source hash
   *
   * Must not be called if the asset hash type is `AssetHashType.BUNDLE` or `AssetHashType.OUTPUT`.
   */
  private calculateSourceHash(bundling: BundlingOptions | undefined): string {
    if (!this.calculateHashBeforehand) {
      throw new AssumptionError(lit`InvalidHashType`, 'Cannot call calculateSourceHash with this asset hash type');
    }

    const hash = crypto.createHash('sha256');

    switch (this.hashType) {
      case AssetHashType.SOURCE:
        const sourceFingerprint = FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions);

        if (!bundling) {
          // Short circuit in the name of not disturbing users too much. In the very olden days we
          // used to return this fingerprint directly. We continue to do so if there's nothing to add in.
          return sourceFingerprint;
        }

        hash.update(sourceFingerprint);
        break;
      case AssetHashType.CUSTOM:
        // Rely on the user-supplied fingerprint to be correct. We don't use the user-given hash
        // as a literal hash,
        // but this is how it was originally written. Include bundling configuration if present.
        hash.update(this.customSourceFingerprint!);
        break;
      default:
        throw new AssumptionError(lit`InvalidHashType`, 'Cannot call calculateSourceHash with this asset hash type');
    }

    if (bundling) {
      hash.update(JSON.stringify(bundling, sanitizeHashValue));
    }

    return hash.digest('hex');
  }

  /**
   * Calculate the asset hash based on the contents of the output directory.
   *
   * We do NOT use the source fingerprinting options on purpose; those are only
   * for COPY assets and SOURCEHASHED bundles. The bundling command is entirely
   * responsible for the contents of the output directory.
   *
   * Exceptions:
   *
   * - We do use the `extraHash` field, user wants to be able to invalidate the asset hash externally.
   * - We copy over the symlink follow mode IF it was BLOCK_EXTERNAL, as a security measure.
   */
  private calculateOutputHash(outputDir: string): string {
    return FileSystem.fingerprint(outputDir, {
      follow: this.fingerprintOptions.follow === SymlinkFollowMode.BLOCK_EXTERNAL ? SymlinkFollowMode.BLOCK_EXTERNAL : undefined,
      extraHash: this.fingerprintOptions.extraHash,
    });
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
  const hashType = assetHashType ?? (customSourceFingerprint ? AssetHashType.CUSTOM : AssetHashType.SOURCE);

  if (customSourceFingerprint && hashType !== AssetHashType.CUSTOM) {
    throw new ValidationError(lit`CannotSpecifyAssetHashTypeWithAssetHash`, `Cannot specify \`${assetHashType}\` for \`assetHashType\` when \`assetHash\` is specified. Use \`CUSTOM\` or leave \`undefined\`.`, scope);
  }
  if (hashType === AssetHashType.CUSTOM && !customSourceFingerprint) {
    throw new ValidationError(lit`MustBeSpecified`, '`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.', scope);
  }

  return hashType;
}

/**
 * Walk the directory tree, throw if we find symlinks that point outside `root`
 */
function validateInternalSymlinks(root: string) {
  // `walkDirectory` will throw if it encounters any symlinks that point outside the `root` directory.
  walkDirectory(root, { follow: SymlinkFollowMode.BLOCK_EXTERNAL, ignoreStrategy: IgnoreStrategy.none() }, { });
}

/**
 * Calculates a cache key from the props. Normalize by sorting keys.
 */
function calculateDeduplicationKey<A extends object>(props: A): string {
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

/**
 * Returns the single archive file of a directory or undefined
 */
function findSingleFile(scope: Construct, directory: string, mustBeArchive: boolean): string | undefined {
  if (!fs.existsSync(directory)) {
    throw new ValidationError(lit`DirectoryDoesNotExist`, `Directory ${directory} does not exist.`, scope);
  }

  if (!fs.statSync(directory).isDirectory()) {
    throw new ValidationError(lit`PathIsNotDirectory`, `${directory} is not a directory.`, scope);
  }

  const content = fs.readdirSync(directory);
  if (content.length === 1) {
    const file = path.join(directory, content[0]);

    if (fs.statSync(file).isFile() && (!mustBeArchive || isArchiveFile(file))) {
      return file;
    }
  }

  return undefined;
}

interface BundledAsset {
  readonly path: string;
  readonly packaging: FileAssetPackaging;
  readonly isArchive: boolean;
}

/**
 * Returns the bundled asset to use based on the content of the bundle directory
 * and the type of output.
 */
function pickAssetTarget(
  scope: Construct,
  bundleDir: string,
  outputType: BundlingOutput,
): BundledAsset {
  if (outputType === BundlingOutput.NOT_ARCHIVED) {
    // Simple case.
    return { path: bundleDir, packaging: FileAssetPackaging.ZIP_DIRECTORY, isArchive: true };
  }

  // Look for a single file. It must be an archive unless we are in SINGLE_FILE mode.
  // It's an error to not find one unless we are in AUTO_DISCOVER mode.
  const allowNonArchiveFile = outputType === BundlingOutput.SINGLE_FILE;
  const singleFile = findSingleFile(scope, bundleDir, !allowNonArchiveFile);

  if (!singleFile && outputType === BundlingOutput.AUTO_DISCOVER) {
    // Simple case, fallback
    return { path: bundleDir, packaging: FileAssetPackaging.ZIP_DIRECTORY, isArchive: true };
  }

  // Otherwise we MUST have found the single file, and that becomes our asset target
  if (!singleFile) {
    throw new ValidationError(lit`BundlingOutputDirectoryExpectedSingleFile`, 'Bundling output directory is expected to include only a single file when `output` is set to `ARCHIVED` or `SINGLE_FILE`', scope);
  }

  if (fs.lstatSync(singleFile).isSymbolicLink()) {
    throw new ValidationError(lit`SymlinkInBundlingOutput`, `The output from bundling is not allowed to be a symlink: ${singleFile}`, scope);
  }

  return { path: singleFile, packaging: FileAssetPackaging.FILE, isArchive: isArchiveFile(singleFile) };
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

/**
 * Replaces fs.Stats because that object holds too much internal state that takes up too much memory.
 */
class FileStats {
  constructor(private readonly _isDir: boolean, private readonly _isFile: boolean) {
  }

  public isDirectory(): boolean { return this._isDir; }
  public isFile(): boolean { return this._isFile; }
}

function isArchiveFile(filename: string): boolean {
  return ARCHIVE_EXTENSIONS.includes(getExtension(filename).toLowerCase());
}

/**
 * Returns `true` if this is a directory with a single 0-byte file
 *
 * This is to catch the behavior of the old `AssetStaging` implementation,
 * where it would move single-file bundling outputs out of the bundling
 * directory and leave a 0-byte placeholder file behind.
 *
 * The new implementation expects an existing directory to be complete,
 * but we have to catch that single case where a 0-byte placeholder file exists
 * and treat it as uncacheable detritus.
 *
 * (Shortcoming: a genuine single 0-byte bundling output also matches and is re-bundled
 * on every synth; accepted as too rare to matter).
 */
function isLegacyPlaceholderDirectory(bundleDir: string) {
  const files = fs.readdirSync(bundleDir);
  if (files.length !== 1) {
    return false;
  }
  const singleFile = path.join(bundleDir, files[0]);
  const stats = fs.lstatSync(singleFile);
  return stats.isFile() && stats.size === 0;
}
