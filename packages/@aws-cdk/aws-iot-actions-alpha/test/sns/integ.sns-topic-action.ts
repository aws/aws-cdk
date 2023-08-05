import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as sns from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  public readonly queue: sqs.IQueue;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
      ),
    });

    const snsTopic = new sns.Topic(this, 'MyTopic');
    topicRule.addAction(new actions.SnsTopicAction(snsTopic));

    const queue = new sqs.Queue(this, 'MyQueue');
    snsTopic.addSubscription(new SqsSubscription(queue));

    this.queue = queue;
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'sns-topic-action-test-stack');
const integ = new IntegTest(app, 'sns-topic-action-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const sqsPurgeCall = integ.assertions.awsApiCall('SQS', 'purgeQueue', {
  QueueUrl: stack.queue.queueUrl,
});
const iotPublishCall = integ.assertions.awsApiCall('IotData', 'publish', {
  topic: 'device/test-device-id/data',
});
const sqsReceiveCall = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
  WaitTimeSeconds: 20,
});

sqsPurgeCall
  .next(iotPublishCall)
  .next(sqsReceiveCall)
  .assertAtPath('Messages.0.Body.Message.device_id', ExpectedResult.stringLikeRegexp('test-device-id'));
