import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as subs from '../lib';

class SnsToSqs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue');

    topic.addSubscription(new subs.SqsSubscription(queue, {
      deadLetterQueue: new sqs.Queue(this, 'DeadLetterQueue'),
    }));
    /// !hide
  }
}

const app = new cdk.App();

new SnsToSqs(app, 'aws-cdk-sns-sqs');

app.synth();
