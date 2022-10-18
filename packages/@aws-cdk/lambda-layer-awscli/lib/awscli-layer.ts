import { AwsCliAsset } from '@aws-cdk/asset-awscli-v1';
import * as lambda from '@aws-cdk/aws-lambda';
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
      code: props.awsCliAsset ? lambda.Code.fromLambdaLayerAsset(props.awsCliAsset) : lambda.Code.fromLambdaLayerAsset(new AwsCliAsset(scope, `${id}-Default-AwsCli`)),
    });
  }
}
