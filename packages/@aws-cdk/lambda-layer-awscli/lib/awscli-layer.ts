import { AwsCliV1Asset } from '@aws-cdk/asset-awscli-v1';
import * as lambda from '@aws-cdk/aws-lambda';
import { FileSystem } from '@aws-cdk/core';
import { AssetSource } from '@aws-cdk/interfaces';
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
  readonly awsCliVersion?: AssetSource;
}

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string, props: AwsCliLayerProps = {}) {
    super(scope, id, {
      code: createCodeForLayer(props.awsCliVersion ?? new AwsCliV1Asset()),
      description: '/opt/awscli/aws',
    });
  }
}

function createCodeForLayer(source: AssetSource): lambda.Code {
  return lambda.Code.fromAsset(source.path, {
    assetHash: source.pathToGenerateAssetHash ? FileSystem.fingerprint(source.pathToGenerateAssetHash) : undefined,
  });
}
