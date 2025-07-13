import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-bucket-origin-oac-list-access');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
  originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.LIST],
});
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: s3Origin,
  },
  defaultRootObject: 'index.html',
});

const integ = new IntegTest(app, 's3-origin-oac-list-access', {
  testCases: [stack],
});

const call = integ.assertions.httpApiCall(`https://${distribution.distributionDomainName}/test.html`);
call.expect(ExpectedResult.objectLike({ status: 404 }));
