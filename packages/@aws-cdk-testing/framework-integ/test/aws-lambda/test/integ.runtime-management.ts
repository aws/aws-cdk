import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, Runtime, RuntimeManagementMode } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-management');

new Function(stack, 'Lambda', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  runtimeManagementMode: RuntimeManagementMode.AUTO,
});

new integ.IntegTest(app, 'lambda-runtime-management', {
  testCases: [stack],
});

app.synth();
