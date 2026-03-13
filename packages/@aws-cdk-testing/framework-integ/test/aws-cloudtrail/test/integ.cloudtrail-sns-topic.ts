import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail-sns-topic');

const topic = new sns.Topic(stack, 'Topic');

new cloudtrail.Trail(stack, 'Trail', {
  snsTopic: topic,
});

new integ.IntegTest(app, 'CloudTrailSnsTopicTest', {
  testCases: [stack],
});

app.synth();
