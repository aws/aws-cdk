import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, CfnParameter, NestedStack, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/* eslint-disable @cdklabs/no-core-construct */

interface MyNestedStackProps {
  readonly subscriber?: sqs.Queue;
  readonly siblingTopic?: sns.Topic; // a topic defined in a sibling nested stack
  readonly topicCount: number;
  readonly topicNamePrefix: string;
  readonly description?: string;
}

class MyNestedStack extends NestedStack {
  constructor(scope: Construct, id: string, props: MyNestedStackProps) {
    const topicNamePrefixLogicalId = 'TopicNamePrefix';

    super(scope, id, {
      parameters: {
        [topicNamePrefixLogicalId]: props.topicNamePrefix, // pass in a parameter to the nested stack
      },
      description: props.description,
    });

    const topicNamePrefixParameter = new CfnParameter(this, 'TopicNamePrefix', { type: 'String' });

    for (let i = 0; i < props.topicCount; ++i) {
      const topic = new sns.Topic(this, `topic-${i}`, { displayName: `${topicNamePrefixParameter.valueAsString}-${i}` });

      // since the subscription resources are defined in the subscriber's stack, this
      // will add an SNS subscription resource to the parent stack that reference this topic.
      if (props.subscriber) {
        topic.addSubscription(new sns_subscriptions.SqsSubscription(props.subscriber));
      }
    }

    if (props.subscriber) {
      new lambda.Function(this, 'fn', {
        runtime: STANDARD_NODEJS_RUNTIME,
        code: lambda.Code.fromInline('console.error("hi")'),
        handler: 'index.handler',
        environment: {
          TOPIC_ARN: props.siblingTopic?.topicArn ?? '',
          QUEUE_URL: props.subscriber.queueUrl, // nested stack references a resource in the parent
        },
      });
    }
  }
}

class MyTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'SubscriberQueue');

    new MyNestedStack(this, 'NestedStack1', { topicCount: 3, topicNamePrefix: 'Prefix1', subscriber: queue });
    new MyNestedStack(this, 'NestedStack2', { topicCount: 2, topicNamePrefix: 'Prefix2', description: 'This is secound nested stack.' });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new MyTestStack(app, 'nested-stacks-test');
app.synth();
