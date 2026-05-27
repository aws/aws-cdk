import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, RuntimeManagementMode } from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-management');

new Function(stack, 'Lambda', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  runtimeManagementMode: RuntimeManagementMode.AUTO,
});

new integ.IntegTest(app, 'lambda-runtime-management', {
  testCases: [stack],
});

app.synth();
