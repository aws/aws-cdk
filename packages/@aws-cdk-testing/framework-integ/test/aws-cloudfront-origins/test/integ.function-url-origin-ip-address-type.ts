import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { OriginIpAddressType } from 'aws-cdk-lib/aws-cloudfront';

const app = new App();
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

// CloudFront distribution with IPv4 IP address type
new cloudfront.Distribution(stack, 'DistributionWithoutIpAddressTypeProp(IPv4)', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {}),
  },
});

// CloudFront distribution with IPv4 IP address type
const distributionIPv4 = new cloudfront.Distribution(stack, 'DistributionWithIPv4', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
      ipAddressType: OriginIpAddressType.IPV4,
    }),
  },
});

// CloudFront distribution with IPv6 IP address type
const distributionIPv6 = new cloudfront.Distribution(stack, 'DistributionWithIPv6', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
      ipAddressType: OriginIpAddressType.IPV6,
    }),
  },
});

// CloudFront distribution with dualstack IP address type
const distributionDualstack = new cloudfront.Distribution(stack, 'DistributionWithDualstack', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
      ipAddressType: OriginIpAddressType.DUALSTACK,
    }),
  },
});

const integ = new IntegTest(app, 'FunctionUrlOriginIpAddressTypeTest', {
  testCases: [stack],
});

// Assert that distributions are created with expected IP address type settings
integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionIPv4.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV4Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionIPv4.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV6Enabled', ExpectedResult.exact(false));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionIPv6.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV4Enabled', ExpectedResult.exact(false));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionIPv6.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV6Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionDualstack.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV4Enabled', ExpectedResult.exact(true));

integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distributionDualstack.distributionId,
}).assertAtPath('Distribution.DistributionConfig.IsIPV6Enabled', ExpectedResult.exact(true));
