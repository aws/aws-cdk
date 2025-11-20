import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, Runtime, TenancyConfig } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-multi-tenancy');

new Function(stack, 'MultiTenantFunction', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  tenancyConfig: TenancyConfig.PER_TENANT,
});

new integ.IntegTest(app, 'lambda-multi-tenancy', {
  testCases: [stack],
});

app.synth();
