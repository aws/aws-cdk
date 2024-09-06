import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-cloudfront-function-url-origin-oai');

// Create the Lambda function
const fn = new lambda.Function(stack, 'MyFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Add a Lambda Function URL
const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});

// Create an Origin Access Identity (OAI)
const originAccessIdentity = new cloudfront.OriginAccessIdentity(stack, 'LambdaOriginAccessIdentity', {
  comment: 'OAI for Lambda Function URL',
});

// Create CloudFront Distribution with OAI
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.FunctionUrlOrigin.withOriginAccessIdentity(fnUrl, {
      originAccessIdentity,
    }),
  },
});

// Set up integration test
const integ = new IntegTest(app, 'lambda-url-origin-oai', {
  testCases: [stack],
});

// Validate CloudFront distribution configuration
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
          DomainName: {
            'Fn::Select': [
              2,
              {
                'Fn::Split': [
                  '/',
                  {
                    'Fn::GetAtt': ['MyFunctionFunctionUrlFF6DE78C', 'FunctionUrl'],
                  },
                ],
              },
            ],
          },
        }),
      ]),
    },
  }),
}));

// Validate Origin Access Identity (OAI) configuration
integ.assertions.awsApiCall('CloudFront', 'getCloudFrontOriginAccessIdentity', {
  Id: originAccessIdentity.originAccessIdentityId,
}).expect(ExpectedResult.objectLike({
  CloudFrontOriginAccessIdentity: {
    Id: Match.stringLikeRegexp('^[A-Z0-9]+$'),
    S3CanonicalUserId: Match.stringLikeRegexp('^[A-Za-z0-9]+$'),
    CloudFrontOriginAccessIdentityConfig: {
      CallerReference: Match.stringLikeRegexp('^[A-Za-z0-9-]+$'),
      Comment: 'OAI for Lambda Function URL',
    },
  },
}));

