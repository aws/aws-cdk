import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { SnsEventSource } from '../lib';
import { TestFunction } from './test-function';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const topic = new sns.Topic(this, 'T');

    fn.addEventSource(new SnsEventSource(topic));
  }
}

const app = new cdk.App();
new SqsEventSourceTest(app, 'lambda-event-source-sns');
app.synth();
