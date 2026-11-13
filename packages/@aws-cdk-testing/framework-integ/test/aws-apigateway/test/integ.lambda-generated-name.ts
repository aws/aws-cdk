import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { App, PhysicalName, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'LambdaGeneratedNameStack', {
  env: { account: '111111111111', region: 'us-east-1' },
});

const fn = new Function(stack, 'myfn', {
  functionName: PhysicalName.GENERATE_IF_NEEDED,
  code: Code.fromInline('foo'),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

new LambdaRestApi(stack, 'lambdarestapi', {
  handler: fn,
  cloudWatchRole: true,
});

const other = new Stack(app, 'LambdaGeneratedNameOtherStack', {
  env: { account: '999999999999', region: 'eu-west-1' },
});
new StringParameter(other, 'FunctionArn', {
  stringValue: fn.functionArn,
});

new IntegTest(app, 'lambda-generated-name', {
  testCases: [stack, other],
});
