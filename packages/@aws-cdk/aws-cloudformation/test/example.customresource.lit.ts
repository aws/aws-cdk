import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, Stack } from '@aws-cdk/core';
import { CustomResource, CustomResourceProvider } from '../lib';

interface IBucket {
  readonly bucketArn: string;
}

/// !show
interface CopyOperationProps {
  sourceBucket: IBucket;
  targetBucket: IBucket;
}

class CopyOperation extends Construct {
  constructor(parent: Construct, name: string, props: CopyOperationProps) {
    super(parent, name);

    const lambdaProvider = new lambda.SingletonFunction(this, 'Provider', {
      uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset('../copy-handler'),
      handler: 'index.handler',
      timeout: Duration.seconds(60),
    });

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(lambdaProvider),
      properties: {
        sourceBucketArn: props.sourceBucket.bucketArn,
        targetBucketArn: props.targetBucket.bucketArn,
      }
    });
  }
}
/// !hide

new CopyOperation(new Stack(), 'Test', {
  sourceBucket: { bucketArn: 'x' },
  targetBucket: { bucketArn: 'y' },
});