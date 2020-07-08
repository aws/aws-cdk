import * as cxapi from '@aws-cdk/cx-api';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { AssetHashType, AssetOptions } from './assets';
import { BundlingOptions } from './bundling';
import { Construct, ISynthesisSession } from './construct-compat';
import { FileSystem, FingerprintOptions } from './fs';

const STAGING_TMP = '.cdk.staging';

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
   * @experimental
   */
  public static readonly BUNDLING_INPUT_DIR = '/asset-input';

  /**
   * The directory inside the bundling container into which the bundled output should be written.
   * @experimental
   */
  public static readonly BUNDLING_OUTPUT_DIR = '/asset-output';

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

  private readonly bundleDir?: string;

  constructor(scope: Construct, id: string, props: AssetStagingProps) {
    super(scope, id);

    this.sourcePath = props.sourcePath;
    this.fingerprintOptions = props;

    // Determine the hash type based on the props as props.assetHashType is
    // optional from a caller perspective.
    const hashType = this.determineHashType(props.assetHashType, props.assetHash);

    if (props.bundling) {
      // Determine the source hash in advance of bundling if the asset hash type
      // is source so that the bundler can opt to re-use its bundle dir.
      const sourceHash = hashType === AssetHashType.SOURCE
        ? this.calculateHash(hashType, props.assetHash)
        : undefined;

      this.bundleDir = this.bundle(props.bundling, sourceHash);
      this.assetHash = sourceHash ?? this.calculateHash(hashType, props.assetHash);
    } else {
      this.assetHash = this.calculateHash(hashType, props.assetHash);
    }

    const stagingDisabled = this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
    if (stagingDisabled) {
      this.stagedPath = this.bundleDir ?? this.sourcePath;
    } else {
      this.relativePath = `asset.${this.assetHash}${path.extname(this.bundleDir ?? this.sourcePath)}`;
      this.stagedPath = this.relativePath;
    }

    this.sourceHash = this.assetHash;
  }

  protected synthesize(session: ISynthesisSession) {
    // Staging is disabled
    if (!this.relativePath) {
      return;
    }

    const targetPath = path.join(session.assembly.outdir, this.relativePath);

    // Already staged
    if (fs.existsSync(targetPath)) {
      return;
    }

    // Asset has been bundled
    if (this.bundleDir) {
      // Move bundling directory to staging directory
      fs.moveSync(this.bundleDir, targetPath);
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
   * @Property sourceHash The source hash of the asset. If specified, the bundler
   * will attempt to re-use the bundling directory, which is based on a hash of
   * both the sourceHash and options. If bundling finds a pre-existing directory,
   * the bundler will return it as-is and won't regenerate the bundle.
   */
  private bundle(options: BundlingOptions, sourceHash?: string): string {
    // Temp staging directory in the working directory
    const stagingTmp = path.join('.', STAGING_TMP);
    fs.ensureDirSync(stagingTmp);

    let bundleDir: string;
    if (sourceHash) {
      // Calculate a hash that considers the source hash as well as the bundling options.
      const bundleHash = this.calculateBundleHash(options, sourceHash);

      // When an asset hash is known in advance of bundling, bundling is done into a dedicated staging directory.
      bundleDir = path.resolve(path.join(stagingTmp, 'asset-bundle-hash-' + bundleHash));

      if (fs.existsSync(bundleDir)) {
        // Pre-existing bundle directory. The bundle has already been generated once before, so lets provide it
        // as-is to the caller.
        return bundleDir;
      }

      fs.ensureDirSync(bundleDir);
    } else {
      // When the asset hash isn't known in advance, bundling is done into a temporary staging directory.

      // Create temp directory for bundling inside the temp staging directory
      bundleDir = path.resolve(fs.mkdtempSync(path.join(stagingTmp, 'asset-bundle-temp-')));
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

    try {
      options.image._run({
        command: options.command,
        user,
        volumes,
        environment: options.environment,
        workingDirectory: options.workingDirectory ?? AssetStaging.BUNDLING_INPUT_DIR,
      });
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
      throw new Error(`Failed to run bundling Docker image for asset ${this.node.path}, bundle output is located at ${bundleErrorDir}: ${err}`);
    }

    if (FileSystem.isEmpty(bundleDir)) {
      throw new Error(`Bundling did not produce any output. Check that your container writes content to ${AssetStaging.BUNDLING_OUTPUT_DIR}.`);
    }

    return bundleDir;
  }

  /**
   * Determines the hash type from user-given prop values.
   *
   * @param assetHashType Asset hash type construct prop
   * @param assetHash Asset hash given in the construct props
   */
  private determineHashType(assetHashType?: AssetHashType, assetHash?: string) {
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
   * Calculates a hash for bundle directories which combines the bundler options
   * and source hash.
   *
   * @param options Bundling options considered for hashing purposes
   * @param sourceHash The source asset hash
   */
  private calculateBundleHash(options: BundlingOptions, sourceHash: string) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(options))
      .update(sourceHash)
      .digest('hex');
  }

  private calculateHash(hashType: AssetHashType, assetHash?: string): string {
    switch (hashType) {
      case AssetHashType.SOURCE:
        return FileSystem.fingerprint(this.sourcePath, this.fingerprintOptions);
      case AssetHashType.BUNDLE:
        if (!this.bundleDir) {
          throw new Error('Cannot use `AssetHashType.BUNDLE` when `bundling` is not specified.');
        }
        return FileSystem.fingerprint(this.bundleDir, this.fingerprintOptions);
      case AssetHashType.CUSTOM:
        if (!assetHash) {
          throw new Error('`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.');
        }
        // Hash the hash to make sure we can use it in a file/directory name.
        // The resulting hash will also have the same length as for the other hash types.
        return crypto.createHash('sha256').update(assetHash).digest('hex');
      default:
        throw new Error('Unknown asset hash type.');
    }
  }
}
