import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();
const topicStack = new cdk.Stack(app, 'aws-cdk-sns-firehose-topicstack', {
  env: { region: 'us-east-1' },
});
const firehoseStack = new cdk.Stack(app, 'aws-cdk-sns-firehose-firehosestack', {
  env: { region: 'us-east-2' },
});

const topic = new sns.Topic(topicStack, 'MyTopic', {
  topicName: 'sns-firehose-integ-topic',
});

const bucket = new s3.Bucket(firehoseStack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const deliveryStream = new firehose.DeliveryStream(firehoseStack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(30),
    loggingConfig: { logging: false },
  }),
});

topic.addSubscription(new subs.FirehoseSubscription(deliveryStream));

new IntegTest(app, 'sns-firehose-integ', {
  testCases: [topicStack, firehoseStack],
});
