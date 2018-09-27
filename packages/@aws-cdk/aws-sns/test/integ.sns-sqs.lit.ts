import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

class SnsToSqs extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    /// !show
    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue');

    topic.subscribeQueue(queue);
    /// !hide
  }
}

const app = new cdk.App(process.argv);

new SnsToSqs(app, 'aws-cdk-sns-sqs');

process.stdout.write(app.run());
