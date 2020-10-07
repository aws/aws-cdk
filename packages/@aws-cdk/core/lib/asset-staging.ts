import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import { AssetHashType, AssetOptions } from './assets';
import { BundlingOptions } from './bundling';
import { FileSystem, FingerprintOptions } from './fs';
import { Stack } from './stack';
import { Stage } from './stage';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from './construct-compat';

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
export class AssetStaging extends CoreConstruct {
  /**
   * The directory inside the bundling container into which the asset sources will be mounted.
   * @experimental
   */
  public static readonly BUNDLING_INPUT_DIR = '/asset-input';

  /**
   * The directory inside the bundling container into which the bundled output should be written.
   * @experimental
   */
  public static readonly BUNDLING_OUTPUT_DIR = '/asset-output';

  /**
   * Clears the asset hash cache
   */
  public static clearAssetHashCache() {
    this.assetHashCache = {};
  }

  /**
   * Cache of asset hashes based on asset configuration to avoid repeated file
   * system and bundling operations.
   */
  private static assetHashCache: { [key: string]: string } = {};

  /**
   * Get asset hash from cache or calculate it in case of cache miss.
   */
  private static getOrCalcAssetHash(cacheKey: string, calcFn: () => string) {
    this.assetHashCache[cacheKey] = this.assetHashCache[cacheKey] ?? calcFn();
    return this.assetHashCache[cacheKey];
  }

  /**
   * The path to the asset (stringinfied token).
   *
   * If asset staging is disabled, this will just be the original path.
   * If asset staging is enabled it will be the staged path.
   */
  public readonly stagedPath: string;

  /**
   * The path of the asset as it was referenced by the user.
   */
  public readonly sourcePath: string;

  /**
   * A cryptographic hash of the asset.
   *
   * @deprecated see `assetHash`.
   */
  public readonly sourceHash: string;

  /**
   * A cryptographic hash of the asset.
   */
  public readonly assetHash: string;

  private readonly fingerprintOptions: FingerprintOptions;

  private readonly relativePath?: string;

  private bundleDir?: string;

  constructor(scope: Construct, id: string, props: AssetStagingProps) {
    super(scope, id);

    this.sourcePath = props.sourcePath;
    this.fingerprintOptions = props;

    const outdir = Stage.of(this)?.outdir;
    if (!outdir) {
      throw new Error('unable to determine cloud assembly output directory. Assets must be defined indirectly within a "Stage" or an "App" scope');
    }

    // Determine the hash type based on the props as props.assetHashType is
    // optional from a caller perspective.
    const hashType = determineHashType(props.assetHashType, props.assetHash);

    // Calculate a cache key from the props. This way we can check if we already
    // staged this asset (e.g. the same asset with the same configuration is used
    // in multiple stacks). In this case we can completely skip file system and
    // bundling operations.
    const cacheKey = calculateCacheKey({
      sourcePath: path.resolve(props.sourcePath),
      bundling: props.bundling,
      assetHashType: hashType,
      extraHash: props.extraHash,
      exclude: props.exclude,
    });

    if (props.bundling) {
      // Check if we actually have to bundle for this stack
      const bundlingStacks: string[] = this.node.tryGetContext(cxapi.BUNDLING_STACKS) ?? ['*'];
      const runBundling = bundlingStacks.includes(Stack.of(this).stackName) || bundlingStacks.includes('*');
      if (runBundling) {
        const bundling = props.bundling;
        this.assetHash = AssetStaging.getOrCalcAssetHash(cacheKey, () => {
          // Determine the source hash in advance of bundling if the asset hash type
          // is SOURCE so that the bundler can opt to re-use its previous output.
          const sourceHash = hashType === AssetHashType.SOURCE
            ? this.calculateHash(hashType, props.assetHash, props.bundling)
            : undefined;
          this.bundleDir = this.bundle(bundling, outdir, sourceHash);
          return sourceHash ?? this.calculateHash(hashType, props.assetHash, props.bundling);
        });
        this.relativePath = renderAssetFilename(this.assetHash);
        this.stagedPath = this.relativePath;
      } else { // Bundling is skipped
        this.assetHash = AssetStaging.getOrCalcAssetHash(cacheKey, () => {
          return props.assetHashType === AssetHashType.BUNDLE || props.assetHashType === AssetHashType.OUTPUT
            ? this.calculateHash(AssetHashType.CUSTOM, this.node.path) // Use node path as dummy hash because we're not bundling
            : this.calculateHash(hashType, props.assetHash);
        });
        this.stagedPath = this.sourcePath;
      }
    } else {
      this.assetHash = AssetStaging.getOrCalcAssetHash(cacheKey, () => this.calculateHash(hashType, props.assetHash));
      this.relativePath = renderAssetFilename(this.assetHash, path.extname(this.sourcePath));
      this.stagedPath = this.relativePath;
    }

    const stagingDisabled = this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
    if (stagingDisabled) {
      this.relativePath = undefined;
      this.stagedPath = this.bundleDir ?? this.sourcePath;
    }

    this.sourceHash = this.assetHash;

    this.stageAsset(outdir);
  }

  private stageAsset(outdir: string) {
    // Staging is disabled
    if (!this.relativePath) {
      return;
    }

    const targetPath = path.join(outdir, this.relativePath);

    // Staging the bundling asset.
    if (this.bundleDir) {
      const isAlreadyStaged = fs.existsSync(targetPath);

      if (isAlreadyStaged && path.resolve(this.bundleDir) !== path.resolve(targetPath)) {
        // When an identical asset is already staged and the bundler used an
        // intermediate bundling directory, we remove the extra directory.
        fs.removeSync(this.bundleDir);
      } else if (!isAlreadyStaged) {
        fs.renameSync(this.bundleDir, targetPath);
      }

      return;
    }

    // Already staged
    if (fs.existsSync(targetPath)) {
      return;
    }

    // Copy file/directory to staging directory
    const stat = fs.statSync(this.sourcePath);
    if (stat.isFile()) {
      fs.copyFileSync(this.sourcePath, targetPath);
    } else if (stat.isDirectory()) {
      fs.mkdirSync(targetPath);
      FileSystem.copyDirectory(this.sourcePath, targetPath, this.fingerprintOptions);
    } else {
      throw new Error(`Unknown file type: ${this.sourcePath}`);
    }
  }

  /**
   * Bundles an asset and provides the emitted asset's directory in return.
   *
   * @param options Bundling options
   * @param outdir Parent directory to create the bundle output directory in
   * @param sourceHash The asset source hash if known in advance. If this field
   * is provided, the bundler may opt to skip bundling, providing any already-
   * emitted bundle. If this field is not provided, the bundler uses an
   * intermediate directory in outdir.
   * @returns The fully resolved bundle output directory.
   */
  private bundle(options: BundlingOptions, outdir: string, sourceHash?: string): string {
    let bundleDir: string;
    if (sourceHash) {
      // When an asset hash is known in advance of bundling, the bundler outputs
      // directly to the assembly output directory.
      bundleDir = path.resolve(path.join(outdir, renderAssetFilename(sourceHash)));

      if (fs.existsSync(bundleDir)) {
        // Pre-existing bundle directory. The bundle has already been generated
        // once before, so we'll give the caller nothing.
        return bundleDir;
      }

      fs.ensureDirSync(bundleDir);
    } else {
      // When the asset hash isn't known in advance, bundler outputs to an
      // intermediate directory.

      // Create temp directory for bundling inside the temp staging directory
      bundleDir = path.resolve(fs.mkdtempSync(path.join(outdir, 'bundling-temp-')));
      // Chmod the bundleDir to full access.
      fs.chmodSync(bundleDir, 0o777);
    }

    let user: string;
    if (options.user) {
      user = options.user;
    } else { // Default to current user
      const userInfo = os.userInfo();
      user = userInfo.uid !== -1 // uid is -1 on Windows
        ? `${userInfo.uid}:${userInfo.gid}`
        : '1000:1000';
    }

    // Always mount input and output dir
    const volumes = [
      {
        hostPath: this.sourcePath,
        containerPath: AssetStaging.BUNDLING_INPUT_DIR,
      },
      {
        hostPath: bundleDir,
        containerPath: AssetStaging.BUNDLING_OUTPUT_DIR,
      },
      ...options.volumes ?? [],
    ];

    let localBundling: boolean | undefined;
    try {
      process.stderr.write(`Bundling asset ${this.node.path}...\n`);

      localBundling = options.local?.tryBundle(bundleDir, options);
      if (!localBundling) {
        options.image._run({
          command: options.command,
          user,
          volumes,
          environment: options.environment,
          workingDirectory: options.workingDirectory ?? AssetStaging.BUNDLING_INPUT_DIR,
        });
      }
    } catch (err) {
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

    if (FileSystem.isEmpty(bundleDir)) {
      const outputDir = localBundling ? bundleDir : AssetStaging.BUNDLING_OUTPUT_DIR;
      throw new Error(`Bundling did not produce any output. Check that content is written to ${outputDir}.`);
    }

    return bundleDir;
  }

  private calculateHash(hashType: AssetHashType, assetHash?: string, bundling?: BundlingOptions): string {
    if (hashType === AssetHashType.CUSTOM && !assetHash) {
      throw new Error('`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.');
    }

    // When bundling a CUSTOM or SOURCE asset hash type, we want the hash to include
    // the bundling configuration. We handle CUSTOM and bundled SOURCE hash types
    // as a special case to preserve existing user asset hashes in all other cases.
    if (hashType == AssetHashType.CUSTOM || (hashType == AssetHashType.SOURCE && bundling)) {
      const hash = crypto.createHash('sha256');

      // if asset hash is provided by user, use it, otherwise fingerprint the source.
      hash.update(assetHash ?? FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions));

      // If we're bundling an asset, include the bundling configuration in the hash
      if (bundling) {
        hash.update(JSON.stringify(bundling));
      }

      return hash.digest('hex');
    }

    switch (hashType) {
      case AssetHashType.SOURCE:
        return FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions);
      case AssetHashType.BUNDLE:
      case AssetHashType.OUTPUT:
        if (!this.bundleDir) {
          throw new Error(`Cannot use \`${hashType}\` hash type when \`bundling\` is not specified.`);
        }
        return FileSystem.fingerprint(this.bundleDir, this.fingerprintOptions);
      default:
        throw new Error('Unknown asset hash type.');
    }
  }
}

function renderAssetFilename(assetHash: string, extension = '') {
  return `asset.${assetHash}${extension}`;
}

/**
 * Determines the hash type from user-given prop values.
 *
 * @param assetHashType Asset hash type construct prop
 * @param assetHash Asset hash given in the construct props
 */
function determineHashType(assetHashType?: AssetHashType, assetHash?: string) {
  if (assetHash) {
    if (assetHashType && assetHashType !== AssetHashType.CUSTOM) {
      throw new Error(`Cannot specify \`${assetHashType}\` for \`assetHashType\` when \`assetHash\` is specified. Use \`CUSTOM\` or leave \`undefined\`.`);
    }
    return AssetHashType.CUSTOM;
  } else if (assetHashType) {
    return assetHashType;
  } else {
    return AssetHashType.SOURCE;
  }
}

/**
 * Calculates a cache key from the props. Normalize by sorting keys.
 */
function calculateCacheKey(props: AssetStagingProps): string {
  return crypto.createHash('sha256')
    .update(JSON.stringify(sortObject(props)))
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

