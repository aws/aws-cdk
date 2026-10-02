import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-origin-access-control-sigv4a');

const oac = new cloudfront.S3OriginAccessControl(stack, 'OriginAccessControl', {
  signing: cloudfront.Signing.SIGV4A_ALWAYS,
});

const integ = new IntegTest(app, 'origin-access-control-sigv4a', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: oac.originAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4a',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 's3',
  },
}));
