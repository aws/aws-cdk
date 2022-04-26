import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { AccessPoint } from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket');
    const handler1 = new lambda.Function(this, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    const handler2 = new lambda.Function(this, 'MyFunction2', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    new AccessPoint(this, 'MyObjectLambda1', {
      bucket,
      handler: handler1,
      cloudWatchMetricsEnabled: true,
      supportsGetObjectPartNumber: true,
    });

    new AccessPoint(this, 'MyObjectLambda2', {
      bucket,
      handler: handler2,
      supportsGetObjectRange: true,
      payload: { foo: 10 },
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'aws-s3-object-lambda');

app.synth();
