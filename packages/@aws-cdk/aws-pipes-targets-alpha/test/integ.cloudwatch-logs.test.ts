import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CloudWatchLogsTarget } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetLogGroup = new cdk.aws_logs.LogGroup(stack, 'TargetLogGroup');
const logStreamName = 'Mexico';

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

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new CloudWatchLogsTarget(targetLogGroup, { logStreamName }),
});

const test = new IntegTest(app, 'integtest-pipe-target-sqs', {
  testCases: [stack],
});

const body = 'Cozumel';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: body,
});

const message = putMessageOnQueue.next(test.assertions.awsApiCall('CloudWatchLogs', 'GetLogEvents', {
  LogGroupName: targetLogGroup.logGroupName,
  LogStreamName: logStreamName,
}));

message.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp(body)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(10),
});

app.synth();
