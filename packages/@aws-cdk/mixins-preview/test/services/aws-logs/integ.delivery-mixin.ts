import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { CfnDistributionLogsMixin } from '../../../lib/services/aws-cloudfront/mixins';
import '../../../lib/with';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMixinTest');

// Source Resource
const cloudfrontBucket = new s3.Bucket(stack, 'OriginBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(cloudfrontBucket),
  },
});

// Destination
const logGroup = new logs.LogGroup(stack, 'DeliveryLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Setup delivery
distribution
  .with(CfnDistributionLogsMixin.CONNECTION_LOGS.toLogGroup(logGroup));

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
