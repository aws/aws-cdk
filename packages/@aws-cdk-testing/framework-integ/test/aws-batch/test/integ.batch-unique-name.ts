import * as integ from '@aws-cdk/integ-tests-alpha';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { App, Size, Stack } from 'aws-cdk-lib/core';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'stack');
const jobQueue = new batch.JobQueue(stack, 'MyQueue', {
  computeEnvironments: [
    {
      computeEnvironment: new batch.UnmanagedComputeEnvironment(stack, 'ComputeEnvironment'),
      order: 1,
    },
  ],
});
const jobDefinition = new batch.EcsJobDefinition(stack, 'MyJob', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'container', {
    image: ContainerImage.fromRegistry('test-repo'),
    cpu: 256,
    memory: Size.mebibytes(2048),
  }),
});

const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.expression('rate(1 minute)'),
});

rule.addTarget(new targets.BatchJob(
  jobQueue.jobQueueArn,
  jobQueue,
  jobDefinition.jobDefinitionArn,
  jobDefinition,
));

new integ.IntegTest(app, 'BatchUniqueNameTest', {
  testCases: [stack],
});

app.synth();
