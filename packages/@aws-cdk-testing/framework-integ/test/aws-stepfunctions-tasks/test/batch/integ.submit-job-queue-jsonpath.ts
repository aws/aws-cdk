import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Size, Stack } from 'aws-cdk-lib/core';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { BatchSubmitJob } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();
const stack = new Stack(app, 'cdk-submit-job-queue-json-path');

const vpc = new ec2.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

const jobQueue = new batch.JobQueue(stack, 'MyQueue', {
  computeEnvironments: [
    {
      order: 1,
      computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'ComputeEnv', {
        vpc,
      }),
    },
  ],
});

const jobDefinition = new batch.EcsJobDefinition(stack, 'MyJob', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'container', {
    image: ecs.ContainerImage.fromAsset(
      path.resolve(__dirname, 'batchjob-image'),
    ),
    cpu: 1,
    memory: Size.mebibytes(256),
  }),
});

const submitJob = new BatchSubmitJob(stack, 'Submit Job', {
  jobDefinitionArn: jobDefinition.jobDefinitionArn,
  jobQueueArn: sfn.JsonPath.stringAt('$.jobQueueArn'),
  jobName: 'MyJob',
});

const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ jobQueueArn: jobQueue.jobQueueArn }),
}).next(submitJob);

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

const integTest = new integ.IntegTest(app, 'cdk-submit-job-queue-json-path-integ', {
  testCases: [stack],
});

const startExecutionCall = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: startExecutionCall.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
})
  .expect(integ.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
    interval: Duration.seconds(30),
  });
