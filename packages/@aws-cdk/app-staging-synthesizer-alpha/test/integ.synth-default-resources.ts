import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { APP_ID_MAX } from './util';
import { AppStagingSynthesizer } from '../lib';

// IMAGE_COPIES env variable is used to test maximum number of ECR repositories allowed.
const IMAGE_COPIES = Number(process.env.IMAGE_COPIES) ?? 1;

const app = new App({
  context: {
    '@aws-cdk/aws-iam:minimizePolicies': true,
  },
});

const stack = new Stack(app, 'synthesize-default-resources', {
  synthesizer: AppStagingSynthesizer.defaultResources({
    appId: APP_ID_MAX, // this has implications on the overall template size
    stagingBucketEncryption: BucketEncryption.KMS,
  }),
});

new lambda.Function(stack, 'lambda-s3', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')),
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_10,
});

for (let i = 1; i < IMAGE_COPIES+1; i++) {
  new lambda.Function(stack, `lambda-ecr-${i}`, {
    code: lambda.EcrImageCode.fromAssetImage(path.join(__dirname, 'assets'), {
      assetName: `ecr-asset/${i}`,
    }),
    handler: lambda.Handler.FROM_IMAGE,
    runtime: lambda.Runtime.FROM_IMAGE,
  });
}

// This lambda will share the same published asset as lambda-ecr-1
new lambda.Function(stack, 'lambda-ecr-1-copy', {
  code: lambda.EcrImageCode.fromAssetImage(path.join(__dirname, 'assets'), {
    assetName: 'ecr-asset/1',
  }),
  handler: lambda.Handler.FROM_IMAGE,
  runtime: lambda.Runtime.FROM_IMAGE,
});

// This lambda will use a different published asset as lambda-ecr-1
new lambda.Function(stack, 'lambda-ecr-two', {
  code: lambda.EcrImageCode.fromAssetImage(path.join(__dirname, 'assets'), {
    assetName: 'ecr-asset-2',
  }),
  handler: lambda.Handler.FROM_IMAGE,
  runtime: lambda.Runtime.FROM_IMAGE,
});

const defaultStagingStack = app.node.tryFindChild(`StagingStack-${APP_ID_MAX}-ACCOUNT-REGION`) as Stack;
if (!defaultStagingStack) {
  throw new Error('Default Staging Stack not found');
}

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack, defaultStagingStack],
});

app.synth();
