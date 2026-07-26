import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  Delivery,
  DeliveryDestination,
  DeliveryDestinationTarget,
  DeliverySource,
  LogGroup,
  LogType,
} from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-logs-delivery-integ');

// EventBridge event bus is used as the delivery source: it is a supported
// V2 Permissions source and is fast and inexpensive to create for an integ test.
// logConfig must be enabled on the bus itself (default is OFF) for it to emit
// any log records at all, independently of the CloudWatch Logs delivery pipeline below.
const eventBus = new events.EventBus(stack, 'EventBus', {
  logConfig: {
    level: events.Level.INFO,
    includeDetail: events.IncludeDetail.NONE,
  },
});

const source = new DeliverySource(stack, 'Source', {
  resourceArn: eventBus.eventBusArn,
  logType: LogType.EVENTBRIDGE_INFO_LOGS,
});

// S3 destination
const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const s3Destination = new DeliveryDestination(stack, 'S3Destination', {
  target: DeliveryDestinationTarget.fromBucket(bucket),
});
new Delivery(stack, 'S3Delivery', {
  source,
  destination: s3Destination,
});

// CloudWatch Logs destination
const logGroup = new LogGroup(stack, 'LogGroup', {
  removalPolicy: RemovalPolicy.DESTROY,
});
const cwlDestination = new DeliveryDestination(stack, 'CwlDestination', {
  target: DeliveryDestinationTarget.fromLogGroup(logGroup),
});
new Delivery(stack, 'CwlDelivery', {
  source,
  destination: cwlDestination,
});

// Firehose destination
const firehoseBucket = new s3.Bucket(stack, 'FirehoseBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(firehoseBucket),
});
const firehoseDestination = new DeliveryDestination(stack, 'FirehoseDestination', {
  target: DeliveryDestinationTarget.fromDeliveryStream(deliveryStream),
});
new Delivery(stack, 'FirehoseDelivery', {
  source,
  destination: firehoseDestination,
});

new IntegTest(app, 'DeliveryInteg', {
  testCases: [stack],
});
