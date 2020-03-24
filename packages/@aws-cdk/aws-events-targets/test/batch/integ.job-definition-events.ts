import * as batch from '@aws-cdk/aws-batch';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'batch-events');

const queue = new batch.JobQueue(stack, 'MyQueue', {
  computeEnvironments: [
    {
      computeEnvironment: new batch.ComputeEnvironment(stack, 'ComputeEnvironment', {
        managed: false
      }),
      order: 1
    }
  ]
});
const job = new batch.JobDefinition(stack, 'MyJob', {
  container: {
    image: ContainerImage.fromRegistry('test-repo')
  }
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.BatchJob(queue, job));

const timer2 = new events.Rule(stack, 'Timer2', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
timer2.addTarget(new targets.BatchJob(queue, job));

app.synth();
