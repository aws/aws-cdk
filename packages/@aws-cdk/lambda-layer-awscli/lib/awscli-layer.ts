/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { FileSystem } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';

/**
 * Options for AwsCliLayer
 */
export interface AwsCliLayerProps {
  /**
   * Filter out logging statements.
   *
   * @default true
   */
  readonly quiet?: boolean;
}

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  /**
   * @internal
   */
  public static _tryLoadPackage(targetVersion: string, log: (s: any) => void): any {
    let availableVersion;
    try {
      const assetPackagePath = require.resolve(`${AwsCliLayer.assetPackageName}`);
      availableVersion = AwsCliLayer.requireWrapper(path.join(assetPackagePath, '../../package.json'), log).version;
    } catch (err) {
      log('require.resolve error');
    }

    if (targetVersion === availableVersion) {
      return AwsCliLayer.requireWrapper(AwsCliLayer.assetPackageName, log);
    }
  }

  /**
   * @internal
   */
  public static _downloadPackage(targetVersion: string, log: (s: string) => void): string | undefined {
    const cdkHomeDir = cxapi.cdkHomeDir();
    const downloadDir = path.join(cdkHomeDir, 'npm-cache');
    const downloadPath = path.join(downloadDir, `${AwsCliLayer.assetPackageNpmTarPrefix}${targetVersion}.tgz`);
    log(downloadPath);

    if (fs.existsSync(downloadPath)) {
      return downloadPath;
    }
    childproc.execSync(`mkdir -p ${downloadDir}; cd ${downloadDir}; npm pack ${AwsCliLayer.assetPackageName}@${targetVersion} -q`);
    if (fs.existsSync(downloadPath)) {
      return downloadPath;
    }

    return undefined;
  }

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static readonly assetPackageNpmTarPrefix: string = 'aws-cdk-asset-awscli-v1-';

  private static requireWrapper(id: string, log: (s: any) => void): any {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(id);
    } catch (err) {
      log(`require('${id}') failed`);
      log(err);
      if (err instanceof Error) {
        console.error(err.name, err.message.split('\n')[0]);
      }
    }
  }

  private static installAndLoadPackage(from: string, log: (s: any) => void): any {
    const installDir = AwsCliLayer.findInstallDir(log);
    if (!installDir) {
      return;
    }
    log(`install dir: ${installDir}`);
    childproc.execSync(`npm install ${from} --no-save --prefix ${installDir} -q`);
    return AwsCliLayer.requireWrapper(path.join(installDir, 'node_modules', AwsCliLayer.assetPackageName, 'lib/index.js'), log);
  }

  private static findInstallDir(log: (s: any) => void): string | undefined {
    if (!require.main?.paths) {
      return undefined;
    }
    for (let p of require.main.paths) {
      log(`p: ${p}`);
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return undefined;
  }

  constructor(scope: Construct, id: string, props?: AwsCliLayerProps) {
    const quiet = props?.quiet ?? true;
    const log = (s: any) => {
      if (!quiet) {
        console.log(s);
      }
    };

    const targetVersion = AwsCliLayer.requireWrapper(path.join(__dirname, '../package.json'), log).devDependencies[AwsCliLayer.assetPackageName];

    let assetPackage;

    let downloadStyle = 'require';
    log('trying regular require');
    assetPackage = AwsCliLayer._tryLoadPackage(targetVersion, log);

    if (!assetPackage) {
      downloadStyle = 'dynamic';
      log('trying to download package');
      const downloadPath = AwsCliLayer._downloadPackage(targetVersion, log);
      if (downloadPath) {
        log('trying to load from install location');
        assetPackage = AwsCliLayer.installAndLoadPackage(downloadPath, log);
      }
    }

    let code;
    if (assetPackage) {
      const asset = new assetPackage.AwsCliAsset(scope, `${id}-asset`);
      code = lambda.Code.fromBucket(asset.bucket, asset.s3ObjectKey);
    } else {
      downloadStyle = 'fallback';
      log('using fallback to original version');
      code = lambda.Code.fromAsset(path.join(__dirname, 'layer.zip'), {
        // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
        assetHash: FileSystem.fingerprint(path.join(__dirname, '../layer')),
      });
    }

    super(scope, id, {
      code: code,
      description: '/opt/awscli/aws',
    });

    if (downloadStyle === 'fallback') {
      log('we used the fallback when creating this construct, so a marker construct should be added to the tree for CLI notices');
    }
  }
}
