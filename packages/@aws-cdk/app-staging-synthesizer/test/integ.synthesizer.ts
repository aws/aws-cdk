import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import { AppStagingSynthesizer } from '../lib';

const app = new App();

const stack = new Stack(app, 'synth-test', {
  synthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'synthassets',
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

new ecr_assets.DockerImageAsset(stack, 'ecr-asset', {
  directory: path.join(__dirname, 'assets'),
  assetName: 'ecr-asset',
});

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();
