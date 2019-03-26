#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { AwsCustomResource } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sdk-js');

const topic = new sns.Topic(stack, 'Topic');

const snsPublish = new AwsCustomResource(stack, 'Publish', {
  physicalResourceId: topic.topicArn,
  onUpdate: {
    service: 'SNS',
    action: 'publish',
    parameters: {
      Message: 'hello',
      TopicArn: topic.topicArn
    }
  }
});

const listTopics = new AwsCustomResource(stack, 'ListTopics', {
  physicalResourceId: topic.topicArn,
  onUpdate: {
    service: 'SNS',
    action: 'listTopics'
  }
});

new cdk.CfnOutput(stack, 'MessageId', { value: snsPublish.getData('MessageId') });
new cdk.CfnOutput(stack, 'TopicArn', { value: listTopics.getData('Topics.0.TopicArn') });

app.run();
