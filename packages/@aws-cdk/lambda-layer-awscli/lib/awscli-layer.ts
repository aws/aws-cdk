import { ASSET_FILE, LAYER_SOURCE_DIR } from '@aws-cdk/asset-awscli-v1';
import * as lambda from '@aws-cdk/aws-lambda';
import { FileSystem } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(ASSET_FILE, {
        // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
        assetHash: FileSystem.fingerprint(LAYER_SOURCE_DIR),
      }),
      description: '/opt/awscli/aws',
    });
  }
}
