import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssetHashType, AssetOptions } from './assets';
import { BUNDLING_INPUT_DIR, BUNDLING_OUTPUT_DIR, BundlingOptions } from './bundling';
import { Construct, ISynthesisSession } from './construct-compat';
import { FileSystem, FingerprintOptions } from './fs';

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

    if (props.assetHash && props.assetHashType && props.assetHashType !== AssetHashType.CUSTOM) {
      throw new Error(`Cannot specify \`${props.assetHashType}\` for \`assetHashType\` when \`assetHash\` is specified. Use \`CUSTOM\` or leave \`undefined\`.`);
    }

    this.sourcePath = props.sourcePath;
    this.fingerprintOptions = props;

    if (props.bundling) {
      this.bundleDir = this.bundle(props.bundling);
    }

    const hashType = props.assetHash ? AssetHashType.CUSTOM : props.assetHashType ?? AssetHashType.SOURCE;
    this.assetHash = this.calculateHash(hashType, props.assetHash);

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
      // Try to rename bundling directory to staging directory
      try {
        fs.renameSync(this.bundleDir, targetPath);
        return;
      } catch (err) {
        // /tmp and cdk.out could be mounted across different mount points
        // in this case we will fallback to copying. This can happen in Windows
        // Subsystem for Linux (WSL).
        if (err.code === 'EXDEV') {
          fs.mkdirSync(targetPath);
          FileSystem.copyDirectory(this.bundleDir, targetPath, this.fingerprintOptions);
          return;
        }

        throw err;
      }
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

  private fingerprint(fileOrDirectory: string) {
    return FileSystem.fingerprint(fileOrDirectory, this.fingerprintOptions);
  }

  private bundle(options: BundlingOptions): string {
    // Create temporary directory for bundling
    const bundleDir = fs.mkdtempSync(path.resolve(path.join(os.tmpdir(), 'cdk-asset-bundle-')));

    // Always mount input and output dir
    const volumes = [
      {
        hostPath: this.sourcePath,
        containerPath: BUNDLING_INPUT_DIR,
      },
      {
        hostPath: bundleDir,
        containerPath: BUNDLING_OUTPUT_DIR,
      },
      ...options.volumes ?? [],
    ];

    try {
      options.image._run({
        command: options.command,
        volumes,
        environment: options.environment,
        workingDirectory: options.workingDirectory ?? BUNDLING_INPUT_DIR,
      });
    } catch (err) {
      throw new Error(`Failed to run bundling Docker image for asset ${this.node.path}: ${err}`);
    }

    if (FileSystem.isEmpty(bundleDir)) {
      throw new Error(`Bundling did not produce any output. Check that your container writes content to ${BUNDLING_OUTPUT_DIR}.`);
    }

    return bundleDir;
  }

  private calculateHash(hashType: AssetHashType, assetHash?: string): string {
    if (hashType === AssetHashType.SOURCE) {
      return this.fingerprint(this.sourcePath);
    }

    if (hashType === AssetHashType.BUNDLE) {
      if (!this.bundleDir) {
        throw new Error('Cannot use `AssetHashType.BUNDLE` when `bundling` is not specified.');
      }
      return this.fingerprint(this.bundleDir);
    }

    if (hashType === AssetHashType.CUSTOM) {
      if (!assetHash) {
        throw new Error('`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`.');
      }
      return assetHash;
    }

    throw new Error('Unknown asset hash type.');
  }
}
