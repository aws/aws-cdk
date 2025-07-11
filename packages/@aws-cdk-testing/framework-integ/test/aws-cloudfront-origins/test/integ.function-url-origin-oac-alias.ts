import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'integ-cloudfront-function-url-origin-oac');

// Create the Lambda function with a custom response
const fn = new lambda.Function(stack, 'MyFunction', {
  code: lambda.Code.fromInline(`
    exports.handler = async () => ({
      statusCode: 200,
      body: 'Hello!!'
    });
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Add a Lambda alias with provisioned concurrency
const alias = fn.addAlias('Live', {
  provisionedConcurrentExecutions: 5,
});

const aliasUrl = alias.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

// Test Lambda Function alias URL
const lambdaAliasUrlHttpCall = new IntegTest(app, 'lambda-alias-url-test', {
  testCases: [stack],
});
lambdaAliasUrlHttpCall.assertions.httpApiCall(aliasUrl.url).expect(ExpectedResult.objectLike({
  status: 200,
  body: 'Hello!!',
}));

// Create CloudFront Distribution with OAC for the alias URL
const aliasDistribution = new cloudfront.Distribution(stack, 'AliasDistribution', {
  defaultBehavior: {
    origin: origins.FunctionUrlOrigin.withOriginAccessControl(aliasUrl),
  },
});

// Set up integration test for the alias
const aliasInteg = new IntegTest(app, 'lambda-alias-url-origin-oac', {
  testCases: [stack],
});

// Validate CloudFront distribution config for the Lambda Function alias URL origin
aliasInteg.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: aliasDistribution.distributionId,
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

// Fetch the OriginAccessControlId from the alias distribution config
const aliasOriginAccessControlId = aliasInteg.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: aliasDistribution.distributionId,
}).getAttString('DistributionConfig.Origins.Items.0.OriginAccessControlId');

// Validate the Origin Access Control configuration for alias
aliasInteg.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: aliasOriginAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 'lambda',
  },
}));

// Make an HTTP call to the CloudFront alias distribution and verify the response
const aliasDistHttpCall = aliasInteg.assertions.httpApiCall(`https://${aliasDistribution.distributionDomainName}`);
aliasDistHttpCall.expect(ExpectedResult.objectLike({
  status: 200,
  body: 'Hello!!',
}));

lambdaAliasUrlHttpCall.assertions.httpApiCall(aliasUrl.url).expect(ExpectedResult.objectLike({
  status: 403,
  body: 'Forbidden',
}));
