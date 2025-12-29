import * as path from 'path';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-fargate-run-task-capacity-provider');

const cluster = new ecs.Cluster(stack, 'FargateCluster');

// Enable FARGATE and FARGATE_SPOT capacity providers
cluster.enableFargateCapacityProviders();

// Set default capacity provider strategy for the cluster
cluster.addDefaultCapacityProviderStrategy([
  { capacityProvider: 'FARGATE', weight: 1, base: 1 },
  { capacityProvider: 'FARGATE_SPOT', weight: 4 },
]);

// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
  runtimePlatform: {
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
  },
});
const containerDefinition = taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Build state machine with different capacity provider strategies
const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ SomeKey: 'SomeValue', Timeout: 900 }),
}).next(
  // Task with default behavior - uses FARGATE launch type
  new tasks.EcsRunTask(stack, 'FargateTaskWithLaunchType', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    assignPublicIp: true,
    containerOverrides: [
      {
        containerDefinition,
        environment: [
          {
            name: 'SOME_KEY',
            value: sfn.JsonPath.stringAt('$.SomeKey'),
          },
        ],
      },
    ],
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
    taskTimeout: sfn.Timeout.at('$.Timeout'),
    cpu: '1024',
    memoryMiB: '2048',
    resultPath: sfn.JsonPath.DISCARD,
  }),
).next(
  // Task with custom capacity provider strategy
  new tasks.EcsRunTask(stack, 'FargateTaskWithCustom', {
    cluster,
    taskDefinition,
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      capacityProviderStrategy: [
        {
          capacityProvider: 'FARGATE',
          weight: 1,
          base: 0,
        },
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 2,
          base: 1,
        },
      ],
    }),
    resultPath: sfn.JsonPath.DISCARD,
  }),
).next(
  // Task with cluster's default capacity provider strategy
  new tasks.EcsRunTask(stack, 'FargateTaskWithClusterDefault', {
    cluster,
    taskDefinition,
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      useDefaultCapacityProviderStrategy: true,
    }),
    resultPath: sfn.JsonPath.DISCARD,
  }),
);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

const integ = new IntegTest(app, 'SfnTasksEcsFargateRunTaskCapacityProviderTest', {
  testCases: [stack],
});

// Start state machine execution and verify it succeeds
const startExecutionCall = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
  input: JSON.stringify({ SomeKey: 'SomeValue', Timeout: 900 }),
});

startExecutionCall.next(
  integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
    executionArn: startExecutionCall.getAttString('executionArn'),
  }).expect(ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  })).waitForAssertions({
    totalTimeout: Duration.minutes(15),
    interval: Duration.seconds(10),
  }),
);
