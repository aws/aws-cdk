import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const lambdaFunction = new lambda.Function(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const lambdaVersion = new lambda.Version(stack, 'LambdaVersion', {
  lambda: lambdaFunction,
});

new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors: [{
        isDefaultBehavior: true,
        lambdaFunctionAssociations: [{
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          lambdaFunction: lambdaVersion,
        }],
      }],
    },
  ],
});

app.synth();
