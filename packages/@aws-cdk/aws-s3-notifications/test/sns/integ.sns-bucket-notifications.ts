import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import s3n = require('../../lib');

class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const objectCreateTopic = new sns.Topic(this, 'ObjectCreatedTopic');
    const objectRemovedTopic = new sns.Topic(this, 'ObjectDeletedTopic');
    const bucket = new s3.Bucket(this, 'MyBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    bucket.addObjectCreatedNotification(new s3n.SnsDestination(objectCreateTopic));
    bucket.addObjectRemovedNotification(new s3n.SnsDestination(objectRemovedTopic), { prefix: 'foo/', suffix: '.txt' });

  }
}

const app = new cdk.App();

new MyStack(app, 'sns-bucket-notifications');

app.synth();
