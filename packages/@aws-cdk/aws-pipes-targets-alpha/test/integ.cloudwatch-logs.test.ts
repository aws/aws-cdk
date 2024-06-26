import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CloudWatchLogsTarget } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetLogGroup = new cdk.aws_logs.LogGroup(stack, 'TargetLogGroup');
const logStreamName = 'Mexico';
const body = 'Cozumel';
class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }

  bind(_pipe: IPipe): SourceConfig {
    return { sourceParameters: this.sourceParameters };
  }

  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

new cdk.aws_logs.LogStream(stack, 'TargetLogStream', {
  logGroup: targetLogGroup,
  logStreamName: logStreamName,
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new CloudWatchLogsTarget(targetLogGroup, { logStreamName }),
});

const test = new IntegTest(app, 'integtest-pipe-target-sqs', {
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

message.assertAtPath('events.0.message.body', ExpectedResult.stringLikeRegexp(body)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
