import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import { TestFunction } from './test-function';
import { SnsEventSource } from '../lib';

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
