import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { KinesisStreamPutRecord } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * A record is put to the kinesis data stream by the scheduler
 * The assertion checks that the expected record is received by the stream
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-kinesis-stream-put-record');

const payload = {
  Data: 'record',
};
const streamName = 'my-stream';
const partitionKey = 'key';

const stream = new Stream(stack, 'MyStream', {
  streamName,
  shardCount: 1,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new KinesisStreamPutRecord(stream, {
    input: scheduler.ScheduleTargetInput.fromObject(payload),
    partitionKey: partitionKey,
  }),
});

const integrationTest = new IntegTest(app, 'integrationtest-kinesis-stream-put-record', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

// Verifies that an object was delivered to the S3 bucket by the stream
const getShardIterator = integrationTest.assertions.awsApiCall('kinesis', 'getShardIterator', {
  ShardId: 'shardId-000000000',
  ShardIteratorType: 'TRIM_HORIZON',
  StreamName: streamName,
}).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

const getRecords = integrationTest.assertions.awsApiCall('kinesis', 'getRecords', {
  ShardIterator: getShardIterator.getAttString('ShardIterator'),
});

getRecords.assertAtPath(
  'Records.0.PartitionKey',
  ExpectedResult.stringLikeRegexp(partitionKey),
).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

