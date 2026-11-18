import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-task-definition-trusted-execution');

// Task definitions only: registering them launches no instances and no tasks.
const isolated = new ecs.TaskDefinition(stack, 'IsolatedSandboxTaskDef', {
  compatibility: ecs.Compatibility.MANAGED_INSTANCES,
  networkMode: ecs.NetworkMode.AWS_VPC,
  cpu: '1024',
  memoryMiB: '2048',
  trustedExecutionConfiguration: {
    isolationMode: ecs.IsolationMode.ISOLATED_SANDBOX,
  },
});

isolated.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/nginx:latest'),
  memoryReservationMiB: 256,
});

new integ.IntegTest(app, 'TaskDefinitionTrustedExecution', {
  testCases: [stack],
});
