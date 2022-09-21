/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static assetPackage: any;
  private static asset: s3_assets.Asset;
  private static wellKnownInstallDir: string;


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

  private static installNpmPackage(): any {
    // TODO install to a well-known location and then copy over to the current node_modules closure
    const installDir = require.main?.paths[0].split('/').slice(0, -1).join('/');
    if (!installDir) {
      return;
    }
    console.log(`Shelling out to run npm install ${this.assetPackageName} --no-save --prefix ${installDir}`);
    const result = childproc.execSync(`pwd; npm prefix; npm install  ${this.assetPackageName} --no-save --prefix ${installDir}`);
    console.log(result.toString('utf8'));
    return this.requireWrapper(path.join(installDir, 'node_modules', this.assetPackageName, 'lib/index.js'));
  }

  constructor(scope: Construct, id: string) {
    const installParentDir = os.homedir() ?? os.tmpdir();
    AwsCliLayer.wellKnownInstallDir = path.join(installParentDir, '.cdk/npm-cache');

    if (!AwsCliLayer.asset) {
      const targetVersion = AwsCliLayer.requireWrapper(path.join(__dirname, '../package.json')).devDependencies[AwsCliLayer.assetPackageName];
      const pathOfModuleIfAlreadyInstalled = require.resolve(`${AwsCliLayer.assetPackageName}`);
      const versionAlreadyInstalled = AwsCliLayer.requireWrapper(path.join(pathOfModuleIfAlreadyInstalled, '../../package.json')).version;

      if (targetVersion === versionAlreadyInstalled) {
        AwsCliLayer.assetPackage = AwsCliLayer.requireWrapper(AwsCliLayer.assetPackageName);
      }
      if (!AwsCliLayer.assetPackage) {
        AwsCliLayer.assetPackage = AwsCliLayer.installNpmPackage();
      }
      if (!AwsCliLayer.assetPackage) {
        // In this case, use the fallback to a package bundled in aws-cdk-lib.
        throw new Error(`Unable to load ${AwsCliLayer.assetPackageName}@${targetVersion}`);
      }

      AwsCliLayer.asset = new AwsCliLayer.assetPackage.AwsCliAsset(scope, `${id}-asset`);
    }

    super(scope, id, {
      code: lambda.Code.fromBucket(AwsCliLayer.asset.bucket, AwsCliLayer.asset.s3ObjectKey),
      description: '/opt/awscli/aws',
    });
  }
}
