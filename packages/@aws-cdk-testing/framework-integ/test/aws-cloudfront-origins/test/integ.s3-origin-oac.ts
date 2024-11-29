import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-bucket-origin-oac');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(bucket);
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: s3Origin,
  },
});

const integ = new IntegTest(app, 's3-origin-oac', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(ExpectedResult.objectLike({
  DistributionConfig: Match.objectLike({
    Origins: {
      Quantity: 1,
      Items: Match.arrayWith([
        Match.objectLike(
          {
            S3OriginConfig: {
              OriginAccessIdentity: '',
            },
            OriginAccessControlId: Match.stringLikeRegexp('^[A-Z0-9]+$'),
          }),
      ]),
    },
  }),
}));

const originAccessControlId = integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).getAttString('DistributionConfig.Origins.Items.0.OriginAccessControlId');

integ.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: originAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 's3',
  },
}));
