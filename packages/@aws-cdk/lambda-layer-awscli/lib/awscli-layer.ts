/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static readonly assetPackageNpmTarPrefix: string = 'aws-cdk-asset-awscli-v1-';
  private static assetPackage: any;
  private static asset: s3_assets.Asset;

  private static tryLoadPackage(targetVersion: string) {
    let availableVersion;
    try {
      const assetPackagePath = require.resolve(`${AwsCliLayer.assetPackageName}`);
      availableVersion = AwsCliLayer.requireWrapper(path.join(assetPackagePath, '../../package.json')).version;
    } catch (err) {
      console.log('require.resolve error');
    }

    if (targetVersion === availableVersion) {
      AwsCliLayer.assetPackage = AwsCliLayer.requireWrapper(AwsCliLayer.assetPackageName);
    }
  }

  private static requireWrapper(id: string): any {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(id);
    } catch (err) {
      console.log(`require('${id}') failed`);
      console.log(err);
      if (err instanceof Error) {
        console.error(err.name, err.message.split('\n')[0]);
      }
    }
  }

  private static downloadPackage(targetVersion: string): string | undefined {
    const cdkHomeDir = cxapi.cdkHomeDir();
    const downloadDir = path.join(cdkHomeDir, 'npm-cache');
    const downloadPath = path.join(downloadDir, `${AwsCliLayer.assetPackageNpmTarPrefix}${targetVersion}.tgz`);
    console.log(downloadPath);

    if (fs.existsSync(downloadPath)) {
      return downloadPath;
    }
    childproc.execSync(`mkdir -p ${downloadDir}; cd ${downloadDir}; npm pack ${AwsCliLayer.assetPackageName}@${targetVersion} -q`);
    if (fs.existsSync(downloadPath)) {
      return downloadPath;
    }

    return undefined;
  }

  private static installAndLoadPackage(from: string) {
    const installDir = AwsCliLayer.findInstallDir();
    if (!installDir) {
      return;
    }
    console.log('install dir: ', installDir);
    childproc.execSync(`npm install ${from} --no-save --prefix ${installDir} -q`);
    AwsCliLayer.assetPackage = AwsCliLayer.requireWrapper(path.join(installDir, 'node_modules', AwsCliLayer.assetPackageName, 'lib/index.js'));
  }

  private static findInstallDir(): string | undefined {
    if (!require.main?.paths) {
      return;
    }
    for (let p of require.main?.paths) {
      console.log('p: ', p);
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return undefined;
  }

  constructor(scope: Construct, id: string) {
    let usedFallback = false;

    if (!AwsCliLayer.asset) {
      const targetVersion = AwsCliLayer.requireWrapper(path.join(__dirname, '../package.json')).devDependencies[AwsCliLayer.assetPackageName];

      console.log('trying reqular require');
      AwsCliLayer.tryLoadPackage(targetVersion);

      if (!AwsCliLayer.assetPackage) {
        console.log('trying to download package');
        const downloadPath = AwsCliLayer.downloadPackage(targetVersion);
        if (downloadPath) {
          console.log('trying to load from install location');
          AwsCliLayer.installAndLoadPackage(downloadPath);
        }
      }
      if (!AwsCliLayer.assetPackage) {
        usedFallback = true;
        console.log('using fallback');
        AwsCliLayer.installAndLoadPackage(path.join(__dirname, `../${AwsCliLayer.assetPackageNpmTarPrefix}${targetVersion}.tgz`));
      }
      if (!AwsCliLayer.assetPackage) {
        throw new Error('This should never happen');
      }

      AwsCliLayer.asset = new AwsCliLayer.assetPackage.AwsCliAsset(scope, `${id}-asset`);
    }

    super(scope, id, {
      code: lambda.Code.fromBucket(AwsCliLayer.asset.bucket, AwsCliLayer.asset.s3ObjectKey),
      description: '/opt/awscli/aws',
    });
    if (usedFallback) {
      console.log('we used the fallback when creating this construct, so a marker construct should be added to the tree for CLI notices');
    }
  }
}
