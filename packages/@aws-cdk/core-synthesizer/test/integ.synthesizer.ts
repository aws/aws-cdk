import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { AppScopedStagingSynthesizer, DefaultStagingStack } from '../lib';

const app = new App();

const stack = new Stack(app, 'app-scoped-staging-test', {
  synthesizer: new AppScopedStagingSynthesizer({
    stagingStack: new DefaultStagingStack(app, 'StagingStackz', {
      // fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::489318732371:role/cdk-0zn5h5s73a-file-publishing-role-489318732371-us-east-1'),
    }),
  }),
  env: {
    account: '489318732371',
    region: 'us-east-1',
  },
});

new lambda.Function(stack, 'lambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')),
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_9,
});

app.synth();
