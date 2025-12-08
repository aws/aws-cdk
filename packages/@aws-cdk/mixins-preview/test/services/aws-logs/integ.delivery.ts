import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { FirehoseLogsDelivery, LogGroupLogsDelivery, S3LogsDelivery } from '../../../lib/services/aws-logs/logs-delivery';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsTest');

// Source Resource
const eventBus = new events.CfnEventBus(stack, 'EventBus', {
  name: 'vended-logs-mixin-event-bus',
  logConfig: {
    includeDetail: events.IncludeDetail.NONE,
    level: events.Level.ERROR,
  },
});

const logType = 'ERROR_LOGS';

// Destinations
const destinationBucket = new s3.Bucket(stack, 'DeliveryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
});
const destinationLogGroup = new logs.LogGroup(stack, 'DeliveryLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const firehoseBucket = new s3.Bucket(stack, 'FirehoseBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
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
  deliveryStreamEncryptionConfigurationInput: {
    keyType: 'AWS_OWNED_CMK',
  },
});

// Setup deliveries
new S3LogsDelivery(destinationBucket).bind(stack, logType, eventBus.attrArn);
new LogGroupLogsDelivery(destinationLogGroup).bind(stack, logType, eventBus.attrArn);
new FirehoseLogsDelivery(deliveryStream).bind(stack, logType, eventBus.attrArn);

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
