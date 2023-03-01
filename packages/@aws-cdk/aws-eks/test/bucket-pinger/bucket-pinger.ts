import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { CustomResource, Token, Duration } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

export interface BucketPingerProps {
  readonly bucketName: string;
  readonly timeout?: Duration;
}
export class BucketPinger extends Construct {

  private _resource: CustomResource;

  constructor(scope: Construct, id: string, props: BucketPingerProps) {
    super(scope, id);

    const func = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset(`${__dirname}/function`),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: props.timeout ?? Duration.minutes(1),
      environment: {
        BUCKET_NAME: props.bucketName,
      },
    });

    if (!func.role) {
      throw new Error('pinger lambda has no execution role!');
    }

    func.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:DeleteBucket', 's3:ListBucket'],
      resources: [`arn:aws:s3:::${props.bucketName}`],
    }));

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: func,
    });

    this._resource = new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
    });
  }

  public get response() {
    return Token.asString(this._resource.getAtt('Value'));
  }
}
