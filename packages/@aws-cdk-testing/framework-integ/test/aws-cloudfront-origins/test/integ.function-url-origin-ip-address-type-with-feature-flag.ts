import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-cloudfront-origins:functionUrlOriginDualStackDefault': true,
  },
});
const stack = new Stack(app, 'FunctionUrlOriginIpAddressTypeStack');

// Lambda function
const fn = new lambda.Function(stack, 'TestFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello" });'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Function URL with IAM auth
const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

const distribution = new cloudfront.Distribution(stack, 'DistributionWithoutIpAddressTypeProp(DualStack)', {
  defaultBehavior: {
    origin: new FunctionUrlOrigin(fnUrl),
  },
});

const distributionOac = new cloudfront.Distribution(stack, 'DistributionWithoutIpAddressTypePropOac(DualStack)', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl),
  },
});

const integ = new IntegTest(app, 'FunctionUrlOriginIpAddressTypeTest', {
  testCases: [stack],
});

// Assert that distributions are created with expected IP address type settings
integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionOac.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV4Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionOac.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV6Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distribution.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV4Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distribution.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV6Enabled', ExpectedResult.exact(true));
