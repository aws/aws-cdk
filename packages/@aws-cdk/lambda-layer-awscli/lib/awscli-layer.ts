import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { FileSystem } from '@aws-cdk/core';
import { ILambdaLayerAsset } from '@aws-cdk/interfaces';
import { Construct } from 'constructs';

/**
 * AwsCliLayer construct props
 */
export interface AwsCliLayerProps {
  /**
   * Use this property to supply your own version of the AWS CLI
   *
   * @default - An asset containing AWS CLI v1 will be used.
   */
  readonly awsCliAsset?: ILambdaLayerAsset;
}

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string, props: AwsCliLayerProps = {}) {
    super(scope, id, {
      code: props.awsCliAsset ? lambda.Code.fromLambdaLayerAsset(props.awsCliAsset) : lambda.Code.fromAsset(path.join(__dirname, 'layer.zip'), {
        // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
        assetHash: FileSystem.fingerprint(path.join(__dirname, '../layer')),
      }),
      description: '/opt/awscli/aws',
    });
  }
}
