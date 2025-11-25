import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-management');

new Function(stack, 'Lambda', {
  code: Code.fromAsset(path.join(__dirname, 'dotnet-handler')),
  handler: 'Handler',
  runtime: Runtime.DOTNET_8,
});

new integ.IntegTest(app, 'lambda-runtime-management', {
  testCases: [stack],
});
