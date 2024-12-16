import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

// !!!! WARNING !!!!
// Running this integration requires enabling the optIn Africa (Cape Town) af-south-1 region
// Using the CLI: aws account get-region-opt-status --region-name af-south-1
// !!!! WARNING !!!!

/**
 * As far as I can tell, it's not possible to run integrations assertions across multiple regions.
 * Manual integration verification it is:
 *
 * # Deploy this integration with the --no-clean flag
 * $ set CDK_INTEG_ACCOUNT=<account>
 *
 * # Opt-in region topic, opt-in region queue
 * $ AWS_REGION=af-south-1 aws sns publish --topic-arn "arn:aws:sns:af-south-1:$CDK_INTEG_ACCOUNT:TestCaseOptInRegionQueueOptInRegionTopicTopicStack0561E431-TopicBFC7AF6E-MrTkQkFtOVg9" --message "opt-in region, but not cross region"
 * $ AWS_REGION=af-south-1 aws sqs receive-message --queue-url "https://sqs.af-south-1.amazonaws.com/$CDK_INTEG_ACCOUNT/TestCaseOptInRegionQueueOptInRegionTopicQueueStackF61-Queue4A7E3555-n9VkU2Dpvu0M" | jq -r '.Messages[] | .Body | fromjson | .Message'
 * # Should output "opt-in region, but not cross region"
 *
 * # Opt-in region topic, default region queue
 * $ AWS_REGION=af-south-1 aws sns publish --topic-arn "arn:aws:sns:af-south-1:$CDK_INTEG_ACCOUNT:TestCaseDefaultRegionQueueOptInRegionTopicTopicStack4AB04298-TopicBFC7AF6E-pfdAkV0rp1wz" --message "opt-in region topic, default region queue"
 * $ AWS_REGION=us-east-1 aws sqs receive-message --queue-url "https://sqs.us-east-1.amazonaws.com/$CDK_INTEG_ACCOUNT/TestCaseDefaultRegionQueueOptInRegionTopicQueueStackF-Queue4A7E3555-Nwk9eBynKwD8" | jq -r '.Messages[] | .Body | fromjson | .Message'
 * # Should output "opt-in region topic, default region queue"
 *
 * # Default region topic, opt-in region queue
 * $ AWS_REGION=us-east-1 aws sns publish --topic-arn "arn:aws:sns:us-east-1:$CDK_INTEG_ACCOUNT:TestCaseOptInRegionQueueDefaultRegionTopicTopicStack3B645352-TopicBFC7AF6E-URc2uRgyrlJ8" --message "default region topic, opt-in region queue"
 * $ AWS_REGION=af-south-1 aws sqs receive-message --queue-url "https://sqs.af-south-1.amazonaws.com/$CDK_INTEG_ACCOUNT/TestCaseOptInRegionQueueDefaultRegionTopicQueueStackA-Queue4A7E3555-NwrKx4MK8SIi" | jq -r '.Messages[] | .Body | fromjson | .Message'
 * # Should output "default region topic, opt-in region queue"
 *
 * # Remember to clean up the resources after running the above tests
 */

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
  public readonly testCases: cdk.Stack[] = [];

  constructor(scope: Construct, id: string, props: TestCaseStackProps) {
    super(scope, id);

    const queueStack = new QueueStack(this, 'QueueStack', {
      region: props.regions.queue,
    });
    this.testCases.push(queueStack);

    this.testCases.push(new TopicStack(this, 'TopicStack', {
      queue: queueStack.queue,
      region: props.regions.topic,
    }));
  }
}
// Not a cross-region test case, just running this as a sanity check
const testCaseOptInRegionQueueOptInRegionTopic = new TestCaseStack(app, 'TestCaseOptInRegionQueueOptInRegionTopic', {
  regions: { queue: optInRegion, topic: optInRegion },
});
const testCaseOptInRegionQueueDefaultRegionTopic = new TestCaseStack(app, 'TestCaseOptInRegionQueueDefaultRegionTopic', {
  regions: { queue: optInRegion, topic: defaultRegion },
});
const testCaseDefaultRegionQueueOptInRegionTopic = new TestCaseStack(app, 'TestCaseDefaultRegionQueueOptInRegionTopic', {
  regions: { queue: defaultRegion, topic: optInRegion },
});
// Opt-in to opt-in cross region delivery is not supported for SQS
// See https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html

// THEN
new IntegTest(app, 'CrossOptInRegionsSqsSubscriptionTest', {
  testCases: [
    testCaseOptInRegionQueueOptInRegionTopic,
    testCaseOptInRegionQueueDefaultRegionTopic,
    testCaseDefaultRegionQueueOptInRegionTopic,
  ].map(({ testCases }) => testCases).flat(),
});

app.synth();

