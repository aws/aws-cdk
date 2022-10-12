/* eslint-disable no-console */
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Annotations, FileSystem } from '@aws-cdk/core';
import { debugModeEnabled } from '@aws-cdk/core/lib/debug';
import { Construct } from 'constructs';
import { TARGET_VERSION } from './asset-package-version';
import { installAndLoadPackage, _downloadPackage, _tryLoadPackage } from './private/package-loading-functions';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static readonly assetPackageNpmTarPrefix: string = 'aws-cdk-asset-awscli-v1-';

  constructor(scope: Construct, id: string) {
    const logs: string[] = [];
    let fallback = false;

    let assetPackage = _tryLoadPackage(AwsCliLayer.assetPackageName, TARGET_VERSION, logs);

    if (!assetPackage) {
      const downloadPath = _downloadPackage(AwsCliLayer.assetPackageName, AwsCliLayer.assetPackageNpmTarPrefix, TARGET_VERSION, logs);
      if (downloadPath) {
        assetPackage = installAndLoadPackage(AwsCliLayer.assetPackageName, downloadPath, logs);
      }
    }

    let code;
    if (assetPackage) {
      // ask for feedback here
      if (!assetPackage.AwsCliAsset) {
        logs.push(`ERROR: loaded ${AwsCliLayer.assetPackageName}, but AwsCliAsset is undefined in the module.`);
      } else {
        const asset = new assetPackage.AwsCliAsset(scope, `${id}-asset`);
        code = lambda.Code.fromBucket(asset.bucket, asset.s3ObjectKey);
      }
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
    console.log(logs.join('\n'));

    if (debugModeEnabled()) {
      Annotations.of(this).addInfo(logs.join('\n'));
    }

    if (fallback) {
      Annotations.of(this).addWarning(`[ACTION REQUIRED] Your CDK application is using ${this.constructor.name}. Add a dependency on ${AwsCliLayer.assetPackageName}, or the equivalent in your language, to remove this warning. See https://github.com/aws/aws-cdk/issues/22470 for more information.`);
      new Notice(this, 'cli-notice');
    }
  }
}

/**
 * An empty construct that can be added to the tree as a marker for the CLI Notices
 */
class Notice extends Construct {}