import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

class MyStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    const objectCreateTopic = new sns.Topic(this, 'ObjectCreatedTopic');
    const objectRemovedTopic = new sns.Topic(this, 'ObjectDeletedTopic');
    const bucket = new s3.Bucket(this, 'MyBucket');

    bucket.onObjectCreated(objectCreateTopic);
    bucket.onObjectRemoved(objectRemovedTopic, { prefix: 'foo/', suffix: '.txt' });

  }
}

const app = new cdk.App(process.argv);

new MyStack(app, 'sns-bucket-notifications');

process.stdout.write(app.run());
