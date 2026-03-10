import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as events from 'aws-cdk-lib/aws-events';
import { CfnEventBusLogsMixin } from '../../../lib/services/aws-events/mixins';
import '../../../lib/with';
import { CloudwatchDeliveryDestination } from '../../../lib/services/aws-logs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMixinTest');

// Source Resource
const eventBus = new events.EventBus(stack, 'EventBus', {
  eventBusName: 'vended-logs-mixin-event-bus',
  logConfig: {
    includeDetail: events.IncludeDetail.NONE,
    level: events.Level.INFO,
  },
});

// Cloudwatch Log Group Destination
const logGroup = new logs.LogGroup(stack, 'DeliveryLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// KMS Key for Bucket encryption
const key = new kms.Key(stack, 'DeliveryBucketKey', {
  enabled: true,
});

// S3 Bucket Destination
const bucket = new s3.Bucket(stack, 'DeliveryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryptionKey: key,
});

// Cloudwatch delivery destination to be used with toDestination
const deliveryDestination = new CloudwatchDeliveryDestination(stack, 'DeliveryDestination', {
  logGroup,
});

// Setup error logs delivery to Cloudwatch
eventBus.with(CfnEventBusLogsMixin.ERROR_LOGS.toLogGroup(logGroup));
// Setup info logs delivery to Cloudwatch via manually created delivery destination
eventBus.with(CfnEventBusLogsMixin.INFO_LOGS.toDestination(deliveryDestination));
// Setup error logs delivery to S3
eventBus.with(CfnEventBusLogsMixin.ERROR_LOGS.toS3(bucket));
// Setup info logs delivery to S3
eventBus.with(CfnEventBusLogsMixin.INFO_LOGS.toS3(bucket, { encryptionKey: key }));

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
