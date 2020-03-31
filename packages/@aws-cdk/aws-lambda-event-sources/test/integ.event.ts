import { Schedule } from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { CloudWatchEventSource } from '../lib/event';
import { TestFunction } from './test-function';

class CloudWatchEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');

    fn.addEventSource(new CloudWatchEventSource({
      schedule: Schedule.cron({ day: '1', minute: '1', hour: '1', month: '1', year: '*' })
    }));
  }
}

const app = new cdk.App();
new CloudWatchEventSourceTest(app, 'lambda-event-source-cw');
app.synth();
