import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import s3n = require('../lib');

const app = new cdk.App();

const stack = new Stack(app, 'test-3');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});
const topic = new sns.Topic(stack, 'Topic');
const topic3 = new sns.Topic(stack, 'Topic3');

bucket.addEventNotification(s3.EventType.ObjectCreatedPut, new s3n.SnsDestination(topic));
bucket.addEventNotification(s3.EventType.ObjectRemoved, new s3n.SnsDestination(topic3), { prefix: 'home/myusername/' });

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});
bucket2.addObjectRemovedNotification(new s3n.SnsDestination(topic3), { prefix: 'foo' }, { suffix: 'foo/bar' });

app.run();
