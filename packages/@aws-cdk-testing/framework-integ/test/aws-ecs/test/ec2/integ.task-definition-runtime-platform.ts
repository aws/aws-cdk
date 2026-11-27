import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-runtime-platform');

const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
  compatibility: ecs.Compatibility.EC2,
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
  },
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 256,
});

const integTest = new IntegTest(app, 'TaskDefinitionRuntimePlatform', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('ECS', 'describeTaskDefinition', {
  taskDefinition: taskDefinition.taskDefinitionArn,
}).expect(ExpectedResult.objectLike({
  taskDefinition: {
    runtimePlatform: {
      cpuArchitecture: 'X86_64',
      operatingSystemFamily: 'LINUX',
    },
  },
}));
