import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

// !!!! WARNING !!!!
// Running this integration requires enabling the optIn Africa (Cape Town) af-south-1 region
// Using the CLI: aws account get-region-opt-status --region-name af-south-1
// !!!! WARNING !!!!

const defaultRegion = 'us-east-1';
const optInRegion = 'af-south-1';
const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;

// GIVEN
const app = new cdk.App();

interface QueueStackProps extends cdk.StackProps {
  readonly region: string;
}
class QueueStack extends cdk.Stack {
  public readonly queue: sqs.IQueue;

  constructor(scope: Construct, id: string, props: QueueStackProps) {
    super(scope, id, {
      ...props,
      env: { account, region: props.region },
      crossRegionReferences: true,
    });

    this.queue = new sqs.Queue(this, 'Queue');
  }
}

interface TopicStackProps extends cdk.StackProps {
  readonly queue: sqs.IQueue;
  readonly region: string;
}
class TopicStack extends cdk.Stack {
  public readonly topic: sns.ITopic;
  constructor(scope: Construct, id: string, props: TopicStackProps) {
    super(scope, id, {
      ...props,
      env: { account, region: props.region },
      crossRegionReferences: true,
    });

    this.topic = new sns.Topic(this, 'Topic', {
      topicName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
    this.topic.addSubscription(new subs.SqsSubscription(props.queue));
  }
}

interface TestCaseStackProps extends cdk.StackProps {
  readonly regions: { queue: string; topic: string };
}
class TestCaseStack extends Construct {
  public readonly testCase: TopicStack;

  public readonly queue: sqs.IQueue;
  public readonly topic: sns.ITopic;

  constructor(scope: Construct, id: string, props: TestCaseStackProps) {
    super(scope, id);

    this.queue = new QueueStack(this, 'QueueStack', {
      region: props.regions.queue,
    }).queue;

    this.testCase = new TopicStack(this, 'TopicStack', {
      queue: this.queue,
      region: props.regions.topic,
    });;
    this.topic = this.testCase.topic;
  }
}
const testCaseDefaultRegionQueueDefaultRegionTopic = new TestCaseStack(app, 'TestCaseDefaultRegionQueueDefaultRegionTopic', {
  // env: { account, region: defaultRegion },
  regions: { queue: defaultRegion, topic: defaultRegion },
});
const testCaseOptInRegionQueueDefaultRegionTopic = new TestCaseStack(app, 'TestCaseOptInRegionQueueDefaultRegionTopic', {
  regions: { queue: optInRegion, topic: defaultRegion },
});
const testCaseDefaultRegionQueueOptInRegionTopic = new TestCaseStack(app, 'TestCaseDefaultRegionQueueOptInRegionTopic', {
  regions: { queue: defaultRegion, topic: optInRegion },
});
// Opt-in region to opt-in region delivery is not supported
// See https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html

const testStacks = [
  testCaseDefaultRegionQueueDefaultRegionTopic,
  testCaseOptInRegionQueueDefaultRegionTopic,
  testCaseDefaultRegionQueueOptInRegionTopic,
];

// THEN

const assertionStack = new cdk.Stack(app, 'AssertionStack', {
  env: { region: defaultRegion, account },
  crossRegionReferences: true,
});
const integTest = new IntegTest(app, 'CrossOptInRegionSubscriptionTest', {
  testCases: testStacks.map(({ testCase }) => testCase),
  assertionStack,
});

for (const { topic, queue } of testStacks) {
  integTest.assertions.awsApiCall('SNS', 'publish', {
    Message: '{ background: { color: \'green\' }, price: 200 }',
    TopicArn: topic.topicArn,
  });
  const message = integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
    QueueUrl: queue.queueUrl,
    WaitTimeSeconds: 20,
  });
  message.expect(ExpectedResult.objectLike({
    Messages: [{ Body: '{color: "green", price: 200}' }],
  }));
}

app.synth();

