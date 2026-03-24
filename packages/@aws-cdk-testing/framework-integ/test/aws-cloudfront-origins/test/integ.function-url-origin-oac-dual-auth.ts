import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new App();
const stack = new Stack(app, 'CloudFrontFunctionUrlOACDualAuthStack');

const fn = new lambda.Function(stack, 'Fn', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "ok" })'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl),
  },
});

new IntegTest(app, 'CloudFrontFunctionUrlOACDualAuthInteg', {
  testCases: [stack],
});
