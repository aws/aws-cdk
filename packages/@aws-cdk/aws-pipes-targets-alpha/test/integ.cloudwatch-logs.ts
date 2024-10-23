import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CloudWatchLogsTarget } from '../lib';

/*
 * This integration test sends a message to an SQS queue and validates
 * that the message is logged in the CloudWatch Logs log group.
 *
 * SQS (pipe source) --> CloudWatch Logs log group (pipe target)
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-cwl');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetLogGroup = new cdk.aws_logs.LogGroup(stack, 'TargetLogGroup');
const logStreamName = 'Mexico';
const body = 'Cozumel';

new cdk.aws_logs.LogStream(stack, 'TargetLogStream', {
  logGroup: targetLogGroup,
  logStreamName: logStreamName,
});

new Pipe(stack, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: new CloudWatchLogsTarget(targetLogGroup, {
    logStreamName,
    inputTransformation: InputTransformation.fromEventPath('$.body'),
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-cwl', {
  testCases: [stack],
});

const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: body,
});

const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: targetLogGroup.logGroupName,
  logStreamName: logStreamName,
  limit: 1,
});

const message = putMessageOnQueue.next(logEvents);

// verify the message made it from the queue and is logged in the log group
message.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp(body)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
