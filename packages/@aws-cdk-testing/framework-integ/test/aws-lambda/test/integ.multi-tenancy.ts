import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, TenancyConfig } from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-multi-tenancy');

new Function(stack, 'MultiTenantFunction', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  tenancyConfig: TenancyConfig.PER_TENANT,
});

new integ.IntegTest(app, 'lambda-multi-tenancy', {
  testCases: [stack],
});

app.synth();
