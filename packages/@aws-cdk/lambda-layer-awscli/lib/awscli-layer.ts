/* eslint-disable no-console */
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Annotations, FileSystem } from '@aws-cdk/core';
import { debugModeEnabled } from '@aws-cdk/core/lib/debug';
import { Construct } from 'constructs';
import { installAndLoadPackage, requireWrapper, _downloadPackage, _tryLoadPackage } from './private/package-loading-functions';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  private static readonly assetPackageName: string = '@aws-cdk/asset-awscli-v1';
  private static readonly assetPackageNpmTarPrefix: string = 'aws-cdk-asset-awscli-v1-';

  constructor(scope: Construct, id: string) {
    const logs: string[] = [];
    let fallback = false;

    const targetVersion = requireWrapper(path.join(__dirname, '../package.json'), logs).devDependencies[AwsCliLayer.assetPackageName];

    let assetPackage = _tryLoadPackage(AwsCliLayer.assetPackageName, targetVersion, logs);

    if (!assetPackage) {
      const downloadPath = _downloadPackage(AwsCliLayer.assetPackageName, AwsCliLayer.assetPackageNpmTarPrefix, targetVersion, logs);
      if (downloadPath) {
        assetPackage = installAndLoadPackage(AwsCliLayer.assetPackageName, downloadPath, logs);
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
      Annotations.of(this).addWarning(`WARNING! ACTION REQUIRED! Your CDK application is using ${this.constructor.name} and this construct may experience a breaking change for your environment in a future release. See https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.lambda_layer_awscli-readme.html or https://github.com/aws/aws-cdk/issues/999999999 for details and resolution instructions.`);
      new Notice(this, 'cli-notice');
    }
  }
}

/**
 * An empty construct that can be added to the tree as a marker for the CLI Notices
 */
class Notice extends Construct {}