#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { AwsSdkJsCustomResource } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sdk-js');

const topic = new sns.Topic(stack, 'Topic');

new AwsSdkJsCustomResource(stack, 'AwsSdk', {
  onUpdate: {
    service: 'SNS',
    action: 'publish',
    parameters: {
      Message: 'hello',
      TopicArn: topic.topicArn,
    }
  }
});

app.run();
