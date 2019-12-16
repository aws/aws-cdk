#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import { App, Construct, Stack } from '@aws-cdk/core';
import { AwsCustomResource } from '../../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const topic = new sns.Topic(this, 'Topic');

    const hello = new AwsCustomResource(this, 'Hello', {
      onUpdate: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'hello',
          TopicArn: topic.topicArn
        },
        physicalResourceId: 'hello',
      },
      useLatestSdk: true,
    });

    const bye = new AwsCustomResource(this, 'Bye', {
      onUpdate: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'bye',
          TopicArn: topic.topicArn
        },
        physicalResourceId: 'bye',
      },
      useLatestSdk: true,
    });
    bye.node.addDependency(hello); // SDK installation should be skipped in `bye`
  }
}

const app = new App();

new TestStack(app, 'aws-cdk-sdk-js-latest');

app.synth();
