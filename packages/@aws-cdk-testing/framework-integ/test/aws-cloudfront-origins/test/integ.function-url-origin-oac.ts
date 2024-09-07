import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-cloudfront-function-url-origin-oac');

// Create the Lambda function
const fn = new lambda.Function(stack, 'MyFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Add a Lambda Function URL
const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

// Create CloudFront Distribution with OAC
new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.FunctionUrlOrigin.withOriginAccessControl(fnUrl),
  },
});

// Set up integration test
new IntegTest(app, 'lambda-url-origin-oac', {
  testCases: [stack],
});