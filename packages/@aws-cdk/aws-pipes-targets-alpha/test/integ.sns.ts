import { InputTransformation, IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsTarget } from '../lib';

/*
 * This integration test sends a message to an SQS queue and validates
 * that the message is published to an SNS topic. There is another SQS
 * queue that is subscribed to the SNS topic that will receive the message
 * via SNS. We can check the message made it through the pipe by checking the
 * destination SQS queue.
 *
 * SQS (pipe source) --> SNS (pipe target) --> Destination SQS
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-sns');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetTopic = new cdk.aws_sns.Topic(stack, 'TargetTopic');
const destinationQueue = new cdk.aws_sqs.Queue(stack, 'DestinationQueue');

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
  target: new SnsTarget(targetTopic,
    {
      inputTransformation: InputTransformation.fromEventPath('$.body'),
    }),
});

// message is sent to the destination SQS queue via the SNS topic
targetTopic.addSubscription(new subs.SqsSubscription(destinationQueue));

const test = new IntegTest(app, 'integtest-pipe-target-sns', {
  testCases: [stack],
});

const uniqueIdentifier = 'nebraska';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: destinationQueue.queueUrl,
})).expect(ExpectedResult.objectLike({
  Messages: [{
    Body: Match.stringLikeRegexp(uniqueIdentifier),
  }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
});

