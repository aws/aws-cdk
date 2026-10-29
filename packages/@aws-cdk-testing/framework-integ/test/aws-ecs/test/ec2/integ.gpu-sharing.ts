import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * Registers an EC2 task definition whose containers share a GPU with NVIDIA MPS.
 * Registering the task definition does not need GPU instances; running it does.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-gpu-sharing');

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('Model', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 1024,
  gpuSharing: ecs.GpuSharing.nvidiaMps({
    memory: cdk.Size.gibibytes(4),
    maxComputePercent: 50,
  }),
});

taskDefinition.addContainer('Embeddings', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 1024,
  essential: false,
  gpuSharing: ecs.GpuSharing.nvidiaMps({
    memory: cdk.Size.mebibytes(2048),
  }),
});

const integ = new IntegTest(app, 'GpuSharingTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('ECS', 'describeTaskDefinition', {
  taskDefinition: taskDefinition.taskDefinitionArn,
}).expect(ExpectedResult.objectLike({
  taskDefinition: {
    containerDefinitions: Match.arrayWith([
      Match.objectLike({
        name: 'Model',
        resourceRequirements: [{
          type: 'GPU',
          sharingStrategy: { nvidiaMps: { memory: 4096, maxComputePercent: 50 } },
        }],
      }),
      Match.objectLike({
        name: 'Embeddings',
        resourceRequirements: [{
          type: 'GPU',
          sharingStrategy: { nvidiaMps: { memory: 2048 } },
        }],
      }),
    ]),
  },
}));

app.synth();
