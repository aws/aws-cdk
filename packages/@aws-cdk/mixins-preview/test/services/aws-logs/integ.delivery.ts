import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { FirehoseLogsDelivery, LogGroupLogsDelivery, S3LogsDelivery } from '../../../lib/services/aws-logs/logs-delivery';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsTest');

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

const logType = 'ACCESS_LOGS';

// Delivery Source
const deliverySource = new logs.CfnDeliverySource(stack, 'CloudFrontSource', {
  name: `delivery-source-${distribution.distributionId}-ACCESS_LOGS`,
  resourceArn: distribution.distributionArn,
  logType,
});

// Destinations
const destinationBucket = new s3.Bucket(stack, 'DeliveryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const destinationLogGroup = new logs.LogGroup(stack, 'DeliveryLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const firehoseBucket = new s3.Bucket(stack, 'FirehoseBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const deliveryStream = new firehose.CfnDeliveryStream(stack, 'DeliveryStream', {
  s3DestinationConfiguration: {
    bucketArn: firehoseBucket.bucketArn,
    bufferingHints: {
      intervalInSeconds: 10,
      sizeInMBs: 1,
    },
    roleArn: new iam.Role(stack, 'FirehoseRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      inlinePolicies: {
        s3: new iam.PolicyDocument({
          statements: [new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [firehoseBucket.arnForObjects('*')],
          })],
        }),
      },
    }).roleArn,
  },
});

// Setup deliveries
const s3Delivery = new S3LogsDelivery(destinationBucket).bind(stack, deliverySource, logType, distribution.distributionArn);
const lgDelivery = new LogGroupLogsDelivery(destinationLogGroup).bind(stack, deliverySource, logType, distribution.distributionArn);
const fhDelivery = new FirehoseLogsDelivery(deliveryStream).bind(stack, deliverySource, logType, distribution.distributionArn);

// // There's issues with multiple Logs::Delivery resources bing deployed in parallel
// // let's ensure they wait for each other for now
fhDelivery.delivery.node.addDependency(lgDelivery.delivery);
lgDelivery.delivery.node.addDependency(s3Delivery.delivery);

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
