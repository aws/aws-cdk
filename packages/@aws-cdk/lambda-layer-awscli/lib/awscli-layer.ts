/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Annotations, FileSystem } from '@aws-cdk/core';
import { debugModeEnabled } from '@aws-cdk/core/lib/debug';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  /**
   * @internal
   */
  public static _tryLoadPackage(targetVersion: string, logs: string[]): any {
    let availableVersion;
    let assetPackagePath;
    try {
      assetPackagePath = require.resolve(`${AwsCliLayer.assetPackageName}`);
    } catch (err) {
      logs.push(`require.resolve('${AwsCliLayer.assetPackageName}') failed`);
      return;
    }
    availableVersion = AwsCliLayer.requireWrapper(path.join(assetPackagePath, '../../package.json'), logs).version;

    if (targetVersion === availableVersion) {
      logs.push(`${AwsCliLayer.assetPackageName} already installed with correct version: ${availableVersion}.`);
      const result = AwsCliLayer.requireWrapper(AwsCliLayer.assetPackageName, logs);
      if (result) {
        logs.push(`Successfully loaded ${AwsCliLayer.assetPackageName} from pre-installed packages.`);
        return result;
      }
    }
  }

  /**
   * @internal
   */
  public static _downloadPackage(targetVersion: string, logs: string[]): string | undefined {
    const cdkHomeDir = cxapi.cdkHomeDir();
    const downloadDir = path.join(cdkHomeDir, 'npm-cache');
    const downloadPath = path.join(downloadDir, `${AwsCliLayer.assetPackageNpmTarPrefix}${targetVersion}.tgz`);

    if (fs.existsSync(downloadPath)) {
      logs.push(`Using package archive already available at location: ${downloadPath}`);
      return downloadPath;
    }
    logs.push(`Downloading package using npm pack to: ${downloadDir}`);
    childproc.execSync(`mkdir -p ${downloadDir}; cd ${downloadDir}; npm pack ${AwsCliLayer.assetPackageName}@${targetVersion} -q`);
    if (fs.existsSync(downloadPath)) {
      logs.push('Successfully downloaded using npm pack.');
      return downloadPath;
    }

    logs.push('Failed to download using npm pack.');
    return undefined;
  }

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static readonly assetPackageNpmTarPrefix: string = 'aws-cdk-asset-awscli-v1-';

  private static requireWrapper(id: string, logs: string[]): any {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const result = require(id);
      if (result) {
        logs.push(`require('${id}') succeeded.`);
      }
      return result;
    } catch (e) {
      logs.push(`require('${id}') failed.`);
      const eAsError = e as Error;
      if (eAsError?.stack) {
        logs.push(eAsError.stack);
      }
    }
  }

  private static installAndLoadPackage(from: string, logs: string[]): any {
    const installDir = AwsCliLayer.findInstallDir();
    if (!installDir) {
      logs.push('Unable to find an install directory. require.main.paths[0] is undefined.');
      return;
    }
    logs.push(`Installing from: ${from} to: ${installDir}`);
    childproc.execSync(`npm install ${from} --no-save --prefix ${installDir} -q`);
    return AwsCliLayer.requireWrapper(path.join(installDir, 'node_modules', AwsCliLayer.assetPackageName, 'lib/index.js'), logs);
  }

  private static findInstallDir(): string | undefined {
    if (!require.main?.paths) {
      return undefined;
    }
    return require.main.paths[0];
  }

  constructor(scope: Construct, id: string) {
    const logs: string[] = [];
    let fallback = false;

    const targetVersion = AwsCliLayer.requireWrapper(path.join(__dirname, '../package.json'), logs).devDependencies[AwsCliLayer.assetPackageName];

    let assetPackage = AwsCliLayer._tryLoadPackage(targetVersion, logs);

    if (!assetPackage) {
      const downloadPath = AwsCliLayer._downloadPackage(targetVersion, logs);
      if (downloadPath) {
        assetPackage = AwsCliLayer.installAndLoadPackage(downloadPath, logs);
      }
    }

    let code;
    if (assetPackage) {
      // ask for feedback here
      const asset = new assetPackage.AwsCliAsset(scope, `${id}-asset`);
      code = lambda.Code.fromBucket(asset.bucket, asset.s3ObjectKey);
    }

    if (!code) {
      fallback = true;
      logs.push(`Unable to load ${AwsCliLayer.assetPackageName}. Falling back to use layer.zip bundled with aws-cdk-lib`);
      code = lambda.Code.fromAsset(path.join(__dirname, 'layer.zip'), {
        // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
        assetHash: FileSystem.fingerprint(path.join(__dirname, '../layer')),
      });
    }

    super(scope, id, {
      code: code,
      description: '/opt/awscli/aws',
    });

    if (debugModeEnabled()) {
      Annotations.of(this).addInfo(logs.join('\n'));
    }

    if (fallback) {
      Annotations.of(this).addWarning(`WARNING! ACTION REQUIRED! Your CDK application is using ${this.constructor.name} and this construct may experience a breaking change in a future release. See [] or [] for details and resolution instructions.`);
      new Notice(this, 'cli-notice');
    }
  }
}

/**
 * An empty construct that can be added to the tree as a marker for the CLI Notices
 */
class Notice extends Construct {}