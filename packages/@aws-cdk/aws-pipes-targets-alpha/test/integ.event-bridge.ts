import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { EventBridgeTarget } from '../lib/event-bridge';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-event-bridge');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetEventBus = new cdk.aws_events.EventBus(stack, 'TargetEventBus');

// When this module is promoted from alpha, TestSource should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha
class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new EventBridgeTarget(targetEventBus, {}),
});

// To check that the event is published to the event bus,
// connect another SQS queue as a target to the event bus.
// i.e., source queue --> event bus --> result queue
// We can then check the result in the result queue.
const resultQueue = new cdk.aws_sqs.Queue(stack, 'ResultQueue');
const rule = new cdk.aws_events.Rule(stack, 'rule', {
  eventBus: targetEventBus,
  eventPattern: {
    detailType: ['Event from aws:sqs'],
  },
});
rule.addTarget(new cdk.aws_events_targets.SqsQueue(resultQueue, {}));

const test = new IntegTest(app, 'integtest-pipe-target-event-bridge', {
  testCases: [stack],
});

const body = 'OmahaNebraska';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: body,
});

// This queue receives the payload from the event bus
const message = putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: resultQueue.queueUrl,
}));

message.assertAtPath('Messages.0.Body.detail.body', ExpectedResult.stringLikeRegexp(body)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(10),
});

app.synth();
