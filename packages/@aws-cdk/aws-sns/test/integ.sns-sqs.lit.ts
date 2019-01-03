import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

class SnsToSqs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue');

    topic.subscribeQueue(queue);
    /// !hide
  }
}

const app = new cdk.App();

new SnsToSqs(app, 'aws-cdk-sns-sqs');

app.run();
