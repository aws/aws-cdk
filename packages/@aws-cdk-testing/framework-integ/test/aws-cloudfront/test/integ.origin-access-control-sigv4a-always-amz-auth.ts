import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-origin-access-control-sigv4a-always-amz-auth');

const oac = new cloudfront.FunctionUrlOriginAccessControl(stack, 'OriginAccessControl', {
  signing: cloudfront.Signing.SIGV4A_ALWAYS_AMZ_AUTH,
});

const integ = new IntegTest(app, 'origin-access-control-sigv4a-always-amz-auth', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: oac.originAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4a',
    SigningBehavior: 'always-amz-auth',
    OriginAccessControlOriginType: 'lambda',
  },
}));
