import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
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
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.FunctionUrlOrigin.withOriginAccessControl(fnUrl),
  },
});

// Set up integration test
const integ = new IntegTest(app, 'lambda-url-origin-oac', {
  testCases: [stack],
});

// Validate CloudFront distribution config for the Lambda Function URL origin
integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(ExpectedResult.objectLike({
  DistributionConfig: Match.objectLike({
    Origins: {
      Quantity: 1,
      Items: Match.arrayWith([
        Match.objectLike({
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
          OriginAccessControlId: Match.stringLikeRegexp('^[A-Z0-9]+$'),
        }),
      ]),
    },
  }),
}));

// Fetch the OriginAccessControlId from the distribution config
const originAccessControlId = integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).getAttString('DistributionConfig.Origins.Items.0.OriginAccessControlId');

// Validate the Origin Access Control configuration
integ.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: originAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 'lambda',
  },
}));

app.synth();