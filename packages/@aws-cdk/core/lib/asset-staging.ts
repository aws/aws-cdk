import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { BUNDLING_INPUT_DIR, BUNDLING_OUTPUT_DIR, BundlingOptions } from './bundling';
import { Construct, ISynthesisSession } from './construct-compat';
import { FileSystem, FingerprintOptions } from './fs';

/**
 * Initialization properties for `AssetStaging`.
 */
export interface AssetStagingProps extends FingerprintOptions {
  /**
   * The source file or directory to copy from.
   */
  readonly sourcePath: string;

  /**
   * Bundle the asset by executing a command in a Docker container.
   * The asset path will be mounted at `/asset-input`. The Docker
   * container is responsible for putting content at `/asset-output`.
   * The content at `/asset-output` will be zipped ans used as the
   * final asset.
   *
   * @default - source is copied to staging directory
   *
   * @experimental
   */
  readonly bundling?: BundlingOptions;

  /**
   * How to calculate the source hash for this asset.
   *
   * @default BUNDLE
   */
  readonly assetHashType?: AssetHashType;
}

/**
 * Source hash calculation
 */
export enum AssetHashType {
  /**
   * Based on the content of the source path
   */
  SOURCE = 'source',

  /**
   * Based on the content of the bundled path
   */
  BUNDLE = 'bundle',

  /**
   * Use a custom hash
   */
  CUSTOM = 'custom',
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
   * A cryptographic hash of the source document(s).
   */
  public readonly sourceHash: string;

  private readonly fingerprintOptions: FingerprintOptions;

  private readonly relativePath?: string;

  private readonly bundleDir?: string;

  constructor(scope: Construct, id: string, props: AssetStagingProps) {
    super(scope, id);

    this.sourcePath = props.sourcePath;
    this.fingerprintOptions = props;

    const stagingDisabled = this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);

    if (props.bundling) {
      // Create temporary directory for bundling
      this.bundleDir = fs.mkdtempSync(path.resolve(path.join(os.tmpdir(), 'cdk-asset-bundle-')));

      // Always mount input and output dir
      const volumes = [
        {
          hostPath: this.sourcePath,
          containerPath: BUNDLING_INPUT_DIR,
        },
        {
          hostPath: this.bundleDir,
          containerPath: BUNDLING_OUTPUT_DIR,
        },
        ...props.bundling.volumes ?? [],
      ];

      try {
        props.bundling.image._run({
          command: props.bundling.command,
          volumes,
          environment: props.bundling.environment,
          workingDirectory: props.bundling.workingDirectory ?? BUNDLING_INPUT_DIR,
        });
      } catch (err) {
        throw new Error(`Failed to run bundling Docker image for asset ${this.node.path}: ${err}`);
      }

      if (FileSystem.isEmpty(this.bundleDir)) {
        throw new Error(`Bundling did not produce any output. Check that your container writes content to ${BUNDLING_OUTPUT_DIR}.`);
      }

      const hashCalculation = props.assetHashType ?? AssetHashType.BUNDLE;
      if (hashCalculation === AssetHashType.SOURCE) {
        this.sourceHash = this.fingerprint(this.sourcePath);
      } else if (hashCalculation === AssetHashType.BUNDLE) {
        this.sourceHash = this.fingerprint(this.bundleDir);
      } else {
        throw new Error('Unknown source hash calculation.');
      }
      if (stagingDisabled) {
        this.stagedPath = this.bundleDir;
      } else {
        // Make relative path always bundle based. This way we move it
        // in `synthesize()` to the staging directory only if the final
        // bundled asset has changed and we can safely skip this otherwise.
        this.relativePath = `asset.${this.fingerprint(this.bundleDir)}`;
        this.stagedPath = this.relativePath; // always relative to outdir
      }
    } else { // No bundling
      this.sourceHash = this.fingerprint(this.sourcePath);
      if (stagingDisabled) {
        this.stagedPath = this.sourcePath;
      } else {
        this.relativePath = `asset.${this.sourceHash}${path.extname(this.sourcePath)}`;
        this.stagedPath = this.relativePath; // always relative to outdir
      }
    }
  }

  protected synthesize(session: ISynthesisSession) {
    // Staging is disabled
    if (!this.relativePath) {
      return;
    }

    const targetPath = path.join(session.assembly.outdir, this.relativePath);

    // Already staged. This also works with bundling because relative
    // path is always bundle based when bundling
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
}
