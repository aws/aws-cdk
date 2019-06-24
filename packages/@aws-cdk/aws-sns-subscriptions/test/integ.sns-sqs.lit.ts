import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import subs = require('../lib');

class SnsToSqs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue');

    topic.addSubscription(new subs.SqsSubscription(queue));
    /// !hide
  }
}

const app = new cdk.App();

new SnsToSqs(app, 'aws-cdk-sns-sqs');

app.synth();
