import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as sns_subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import { App, CfnParameter, Construct, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

/* eslint-disable cdk/no-core-construct */

interface MyNestedStackProps {
  readonly subscriber?: sqs.Queue;
  readonly siblingTopic?: sns.Topic; // a topic defined in a sibling nested stack
  readonly topicCount: number;
  readonly topicNamePrefix: string;
}

class MyNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, props: MyNestedStackProps) {
    const topicNamePrefixLogicalId = 'TopicNamePrefix';

    super(scope, id, {
      parameters: {
        [topicNamePrefixLogicalId]: props.topicNamePrefix, // pass in a parameter to the nested stack
      },
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
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.inline('console.error("hi")'),
        handler: 'index.handler',
        environment: {
          TOPIC_ARN: props.siblingTopic ? props.siblingTopic.topicArn : '',
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
    new MyNestedStack(this, 'NestedStack2', { topicCount: 2, topicNamePrefix: 'Prefix2' });
  }
}

const app = new App();
new MyTestStack(app, 'nested-stacks-test');
app.synth();
