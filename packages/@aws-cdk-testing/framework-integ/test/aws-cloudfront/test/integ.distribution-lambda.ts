import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-lambda', { env: { region: 'us-east-1' } });

const lambdaFunction = new lambda.Function(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_16_X,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: lambdaFunction.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
    }],
  },
});

app.synth();
