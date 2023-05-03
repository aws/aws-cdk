import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { AppStagingSynthesizer } from '../lib';

const app = new App();

const stack = new Stack(app, 'kaizentest3', {
  synthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'kaikai',
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

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();
