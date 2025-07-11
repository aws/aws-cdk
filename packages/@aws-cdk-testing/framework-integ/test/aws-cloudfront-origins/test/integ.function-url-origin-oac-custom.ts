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

const customOacStack = new cdk.Stack(app, 'integ-cloudfront-function-url-origin-custom-oac');

// Create the Lambda function with a custom response
const customOacFn = new lambda.Function(customOacStack, 'MyFunction', {
  code: lambda.Code.fromInline(`
    exports.handler = async () => ({
      statusCode: 200,
      body: 'Hello!!'
    });
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Add a Lambda Function URL
const customOacFnUrl = customOacFn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

// Optionally, test Lambda Function URL before creating CloudFront distribution
const customOacLambdaUrlHttpCall = new IntegTest(app, 'lambda-url-custom-oac-test', {
  testCases: [customOacStack],
});
customOacLambdaUrlHttpCall.assertions.httpApiCall(customOacFnUrl.url).expect(ExpectedResult.objectLike({
  status: 200,
  body: 'Hello!!',
}));

const oac = new cloudfront.FunctionUrlOriginAccessControl(customOacStack, 'CustomOAC', {
  originAccessControlName: 'CustomLambdaOAC',
  signing: cloudfront.Signing.SIGV4_ALWAYS,
});

// Create CloudFront Distribution with OAC
const customOacDistribution = new cloudfront.Distribution(customOacStack, 'Distribution', {
  defaultBehavior: {
    origin: origins.FunctionUrlOrigin.withOriginAccessControl(customOacFnUrl, {
      originAccessControl: oac,
    }),
  },
});

// Set up integration test
const customOacInteg = new IntegTest(app, 'lambda-url-origin-custom-oac', {
  testCases: [customOacStack],
});

// Validate CloudFront distribution config for the Lambda Function URL origin
customOacInteg.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: customOacDistribution.distributionId,
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
const customOacOriginAccessControlId = customOacInteg.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: customOacDistribution.distributionId,
}).getAttString('DistributionConfig.Origins.Items.0.OriginAccessControlId');

// Validate the Origin Access Control configuration
customOacInteg.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: customOacOriginAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    Name: 'CustomLambdaOAC',
    SigningProtocol: 'sigv4',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 'lambda',
  },
}));

// Make an HTTP call to the CloudFront distribution and verify the response
const customOacHttpCall = customOacInteg.assertions.httpApiCall(`https://${customOacDistribution.distributionDomainName}`);
customOacHttpCall.expect(ExpectedResult.objectLike({
  status: 200,
  body: 'Hello!!',
}));

customOacLambdaUrlHttpCall.assertions.httpApiCall(customOacFnUrl.url).expect(ExpectedResult.objectLike({
  status: 403,
  body: 'Forbidden',
}));
