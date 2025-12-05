import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { LogGroupLogsDelivery } from '../../../lib/services/aws-logs/logs-delivery';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMultiplesTest');

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

// Delivery Source
const deliverySource = new logs.CfnDeliverySource(stack, 'CloudFrontSource', {
  name: `delivery-source-${distribution.distributionId}-ACCESS_LOGS`,
  resourceArn: distribution.distributionArn,
  logType: 'ACCESS_LOGS',
});

// Destinations
const destinationLogGroupA = new logs.LogGroup(stack, 'DeliveryLogGroupA', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const destinationLogGroupB = new logs.LogGroup(stack, 'DeliveryLogGroupB', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Setup deliveries
const one = new LogGroupLogsDelivery(destinationLogGroupA).bind(stack, deliverySource, distribution.distributionArn);
const two = new LogGroupLogsDelivery(destinationLogGroupB).bind(stack, deliverySource, distribution.distributionArn);

// // There's issues with multiple Logs::Delivery resources bing deployed in parallel
// // let's ensure they wait for each other for now
two.delivery.node.addDependency(one.delivery);

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
