import { Construct, ISynthesisSession } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as path from 'path';
import { copyDirectory, CopyOptions, fingerprint } from './fs';

export interface StagingProps extends CopyOptions {
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
export class Staging extends Construct {

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

  private readonly copyOptions: CopyOptions;

  private readonly relativePath?: string;

  constructor(scope: Construct, id: string, props: StagingProps) {
    super(scope, id);

    this.sourcePath = props.sourcePath;
    this.copyOptions = props;
    this.sourceHash = fingerprint(this.sourcePath, props);

    const stagingDisabled = this.node.tryGetContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT);
    if (stagingDisabled) {
      this.stagedPath = this.sourcePath;
    } else {
      this.relativePath = `asset.` + this.sourceHash + path.extname(this.sourcePath);
      this.stagedPath = this.relativePath; // always relative to outdir
    }
  }

  protected synthesize(session: ISynthesisSession) {
    if (!this.relativePath) {
      return;
    }

    const targetPath = path.join(session.assembly.outdir, this.relativePath);

    // asset already staged
    if (fs.existsSync(targetPath)) {
      return;
    }

    // copy file/directory to staging directory
    const stat = fs.statSync(this.sourcePath);
    if (stat.isFile()) {
      fs.copyFileSync(this.sourcePath, targetPath);
    } else if (stat.isDirectory()) {
      fs.mkdirSync(targetPath);
      copyDirectory(this.sourcePath, targetPath, this.copyOptions);
    } else {
      throw new Error(`Unknown file type: ${this.sourcePath}`);
    }
  }
}
