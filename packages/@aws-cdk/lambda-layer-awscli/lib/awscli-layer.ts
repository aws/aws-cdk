/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  private static readonly assetPackageName: string = 'asset-awscli-v1';
  private static readonly fallbackLocation: string = '';
  private static assetPackage: any;

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

    const targetVersion = AwsCliLayer.requireWrapper(path.join(__dirname, '../package.json')).devDependencies[AwsCliLayer.assetPackageName];
    const pathOfModuleIfAlreadyInstalled = require.resolve(`${AwsCliLayer.assetPackageName}`);
    const versionAlreadyInstalled = AwsCliLayer.requireWrapper(path.join(pathOfModuleIfAlreadyInstalled, '../../package.json')).version;
    let usedFallback = false;

    if (targetVersion === versionAlreadyInstalled) {
      AwsCliLayer.assetPackage = AwsCliLayer.requireWrapper(AwsCliLayer.assetPackageName);
    }
    if (!AwsCliLayer.assetPackage) {
      AwsCliLayer.assetPackage = AwsCliLayer.installNpmPackage();
    }
    if (!AwsCliLayer.assetPackage) {
      AwsCliLayer.assetPackage = AwsCliLayer.requireWrapper(AwsCliLayer.fallbackLocation);
      usedFallback = true;
    }
    if (!AwsCliLayer.assetPackage) {
      // This case should never happen, until the fallback to a package bundled in aws-cdk-lib is removed.
      throw new Error(`Unable to load ${AwsCliLayer.assetPackageName}@${targetVersion}`);
    }

    super(scope, id, {
      code: lambda.Code.fromAssetConstruct(new AwsCliLayer.assetPackage.AwsCliAsset(scope, `${id}-asset`)),
      description: '/opt/awscli/aws',
    });

    if (usedFallback) {
      cdk.Annotations.of(this).addWarning('This CDK app will be impacted by an upcoming change...');
      // TODO add a 'marker' construct to the construct tree so that we can create a CLI notice for this scenario
    }
  }
}
