import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-bucket-origin-oac-read-versioned-access');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
  originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.READ_VERSIONED],
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: s3Origin,
  },
});

const integ = new IntegTest(app, 's3-origin-oac-read-versioned-access', {
  testCases: [stack],
});

integ.assertions.awsApiCall('S3', 'getBucketPolicy', {
  Bucket: bucket.bucketName,
}).expect(ExpectedResult.objectLike({ Policy: Match.serializedJson(Match.objectLike({ Statement: [{ Action: ['s3:GetObject', 's3:GetObjectVersion'] }] })) }));
