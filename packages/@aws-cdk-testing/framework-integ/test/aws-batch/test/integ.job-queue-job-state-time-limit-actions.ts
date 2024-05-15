import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack, Duration } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-stack-job-queue');
const vpc = new Vpc(stack, 'vpc');

// WHEN
new batch.JobQueue(stack, 'joBBQ', {
  computeEnvironments: [{
    computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'CE', {
      vpc,
    }),
    order: 1,
  }],
  jobStateTimeLimitActions: [
    {
      action: batch.JobStateTimeLimitActionsAction.CANCEL,
      maxTime: Duration.minutes(10),
      reason: batch.JobStateTimeLimitActionsReason.INSUFFICIENT_INSTANCE_CAPACITY,
      state: batch.JobStateTimeLimitActionsState.RUNNABLE,
    },
    {
      action: batch.JobStateTimeLimitActionsAction.CANCEL,
      maxTime: Duration.minutes(10),
      reason: batch.JobStateTimeLimitActionsReason.COMPUTE_ENVIRONMENT_MAX_RESOURCE,
      state: batch.JobStateTimeLimitActionsState.RUNNABLE,
    },
    {
      maxTime: Duration.minutes(10),
      reason: batch.JobStateTimeLimitActionsReason.JOB_RESOURCE_REQUIREMENT,
    },
  ],
});

new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();
