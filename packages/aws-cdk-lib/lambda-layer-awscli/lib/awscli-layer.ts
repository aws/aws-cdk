import { ASSET_FILE, LAYER_SOURCE_DIR } from '@aws-cdk/asset-awscli-v1';
import { Construct } from 'constructs';
import * as lambda from '../../aws-lambda';
import { FileSystem, Stack } from '../../core';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  /**
   * Creates a stack-singleton AwsCliLayer.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/lambda-layer-awscli.AwsCliLayer';
    return stack.node.tryFindChild(uid) as AwsCliLayer ?? new AwsCliLayer(stack, uid);
  }

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
