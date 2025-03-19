import { ASSET_FILE, LAYER_SOURCE_DIR } from '@aws-cdk/asset-awscli-v1';
import { Construct } from 'constructs';
import * as lambda from '../../aws-lambda';
import { FeatureFlags, FileSystem, Stack } from '../../core';
import { LAMBDA_AWS_CLI_LAYER_SHARE } from '../../cx-api';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  /**
   * Creates or finds a stack-singleton AwsCliLayer in the stack containing the provided construct.
   *
   * If the feature flag `@aws-cdk/lambda-layer-awscli:shareLayer` is disabled, this
   * will instead unconditionally create a new AwsCliLayer in the provided scope.
   */
  public static getOrCreate(scope: Construct) {
    const uid = '@aws-cdk/lambda-layer-awscli.AwsCliLayer';
    if (FeatureFlags.of(scope).isEnabled(LAMBDA_AWS_CLI_LAYER_SHARE)) {
      /* Issue reference: https://github.com/aws/aws-cdk/issues/32907 */
      const stack = Stack.of(scope);
      const existingLayer = stack.node.tryFindChild(uid);
      if (existingLayer !== undefined) {
        return existingLayer as AwsCliLayer;
      } else {
        return new AwsCliLayer(stack, uid);
      }
    } else {
      return new AwsCliLayer(scope, 'AwsCliLayer');
    }
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
