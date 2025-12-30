import * as path from 'path';
import * as asg from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-ec2-run-task-capacity-provider');

const cluster = new ecs.Cluster(stack, 'Ec2Cluster');

// Create Auto Scaling Groups
const autoScalingGroup1 = new asg.AutoScalingGroup(stack, 'AutoScalingGroup1', {
  vpc: cluster.vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  minCapacity: 1,
  maxCapacity: 2,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});

const autoScalingGroup2 = new asg.AutoScalingGroup(stack, 'AutoScalingGroup2', {
  vpc: cluster.vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  minCapacity: 1,
  maxCapacity: 2,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});

// Create and add Capacity Providers
const capacityProvider1 = new ecs.AsgCapacityProvider(stack, 'CP1', {
  autoScalingGroup: autoScalingGroup1,
  enableManagedTerminationProtection: false,
  enableManagedDraining: true,
});

const capacityProvider2 = new ecs.AsgCapacityProvider(stack, 'CP2', {
  autoScalingGroup: autoScalingGroup2,
  enableManagedTerminationProtection: false,
  enableManagedDraining: true,
});

cluster.addAsgCapacityProvider(capacityProvider1);
cluster.addAsgCapacityProvider(capacityProvider2);

// Set default capacity provider strategy for the cluster
cluster.addDefaultCapacityProviderStrategy([
  { capacityProvider: capacityProvider1.capacityProviderName, weight: 1, base: 1 },
  { capacityProvider: capacityProvider2.capacityProviderName, weight: 2 },
]);

// Build task definition
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
const containerDefinition = taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Build state machine with different capacity provider options
const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
}).next(
  // Task without capacity provider option - uses launch type
  new tasks.EcsRunTask(stack, 'Ec2TaskWithNone', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
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
    launchTarget: new tasks.EcsEc2LaunchTarget(),
    enableExecuteCommand: true,
    resultPath: sfn.JsonPath.DISCARD,
  }),
).next(
  // Task with custom capacity provider option
  new tasks.EcsRunTask(stack, 'Ec2TaskWithCustom', {
    cluster,
    taskDefinition,
    launchTarget: new tasks.EcsEc2LaunchTarget({
      capacityProviderOptions: tasks.CapacityProviderOptions.custom([
        {
          capacityProvider: capacityProvider1.capacityProviderName,
          weight: 1,
          base: 0,
        },
        {
          capacityProvider: capacityProvider2.capacityProviderName,
          weight: 2,
          base: 1,
        },
      ]),
    }),
    resultPath: sfn.JsonPath.DISCARD,
  }),
).next(
  // Task with default capacity provider option - uses cluster default
  new tasks.EcsRunTask(stack, 'Ec2TaskWithDefault', {
    cluster,
    taskDefinition,
    launchTarget: new tasks.EcsEc2LaunchTarget({
      capacityProviderOptions: tasks.CapacityProviderOptions.default(),
    }),
    resultPath: sfn.JsonPath.DISCARD,
  }),
);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

const integ = new IntegTest(app, 'SfnTasksEcsEc2RunTaskCapacityProviderTest', {
  testCases: [stack],
});

// Start state machine execution and verify it succeeds
const startExecutionCall = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
  input: JSON.stringify({ SomeKey: 'SomeValue' }),
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
