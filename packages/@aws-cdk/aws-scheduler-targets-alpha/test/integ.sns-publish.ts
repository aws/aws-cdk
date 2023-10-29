import * as schedule from '@aws-cdk/aws-scheduler-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import { SnsPublish } from '../lib/sns-publish';

const app = new App();
const stack = new Stack(app, 'Stack');

const topic = new sns.Topic(stack, 'Topic', {});

const payload = {
  message: 'hello scheduler!',
};

new schedule.Schedule(stack, 'Schedule', {
  schedule: schedule.ScheduleExpression.rate(Duration.minutes(1)),
  target: new SnsPublish(topic, {
    input: schedule.ScheduleTargetInput.fromObject(payload),
  }),
});

new IntegTest(app, 'IntegTestSnsPublish', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

app.synth();
