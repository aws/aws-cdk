import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import tasks = require('../lib');

let stack: Stack;
let vpc: ec2.Vpc;
let cluster: ecs.Cluster;

beforeEach(() => {
  // GIVEN
  stack = new Stack();
  vpc = new ec2.Vpc(stack, 'Vpc');
  cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('Capacity', {
    instanceType: new ec2.InstanceType('t3.medium')
  });
});

test('Cannot create a Fargate task with a fargate-incompatible task definition', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.EC2,
  });
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  expect(() => new tasks.RunEcsFargateTask({ cluster, taskDefinition }))
    .toThrowError(/not configured for compatibility with Fargate/);
});

test('Cannot create a Fargate task without a default container', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.FARGATE,
  });
  expect(() => new tasks.RunEcsFargateTask({ cluster, taskDefinition }))
    .toThrowError(/must have at least one essential container/);
});

test('Running a Fargate Task', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.FARGATE
  });
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'RunFargate', { task: new tasks.RunEcsFargateTask({
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerName: 'TheContainer',
        environment: [
          {name: 'SOME_KEY', value: sfn.Data.stringAt('$.SomeKey')}
        ]
      }
    ]
  }) });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "FARGATE",
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          SecurityGroups: [{"Fn::GetAtt": ["RunFargateSecurityGroup709740F2", "GroupId"]}],
          Subnets: [
            {Ref: "VpcPrivateSubnet1Subnet536B997A"},
            {Ref: "VpcPrivateSubnet2Subnet3788AAA1"},
          ]
        },
      },
      TaskDefinition: {Ref: "TD49C78F36"},
      Overrides: {
        ContainerOverrides: [
          {
            Environment: [
              {
                "Name": "SOME_KEY",
                "Value.$": "$.SomeKey",
              },
            ],
            Name: "TheContainer",
          },
        ],
      },
    },
    Resource: "arn:aws:states:::ecs:runTask.sync",
    Type: "Task",
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "ecs:RunTask",
          Effect: "Allow",
          Resource: {Ref: "TD49C78F36"}
        },
        {
          Action: ["ecs:StopTask", "ecs:DescribeTasks"],
          Effect: "Allow",
          Resource: "*"
        },
        {
          Action: "iam:PassRole",
          Effect: "Allow",
          Resource: [{"Fn::GetAtt": ["TDTaskRoleC497AFFC", "Arn"]}]
        },
        {
          Action: ["events:PutTargets", "events:PutRule", "events:DescribeRule"],
          Effect: "Allow",
          Resource: {"Fn::Join": ["", [
            "arn:",
            {Ref: "AWS::Partition"},
            ":events:",
            {Ref: "AWS::Region"},
            ":",
            {Ref: "AWS::AccountId"},
            ":rule/StepFunctionsGetEventsForECSTaskRule"
          ]]}
        }
      ],
    },
  });
});

test('Running an EC2 Task with bridge network', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    compatibility: ecs.Compatibility.EC2
  });
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: new tasks.RunEcsEc2Task({
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerName: 'TheContainer',
        environment: [
          {name: 'SOME_KEY', value: sfn.Data.stringAt('$.SomeKey')}
        ]
      }
    ]
  }) });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "EC2",
      TaskDefinition: {Ref: "TD49C78F36"},
      Overrides: {
        ContainerOverrides: [
          {
            Environment: [
              {
                "Name": "SOME_KEY",
                "Value.$": "$.SomeKey",
              },
            ],
            Name: "TheContainer",
          },
        ],
      },
    },
    Resource: "arn:aws:states:::ecs:runTask.sync",
    Type: "Task",
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "ecs:RunTask",
          Effect: "Allow",
          Resource: {Ref: "TD49C78F36"}
        },
        {
          Action: ["ecs:StopTask", "ecs:DescribeTasks"],
          Effect: "Allow",
          Resource: "*"
        },
        {
          Action: "iam:PassRole",
          Effect: "Allow",
          Resource: [{"Fn::GetAtt": ["TDTaskRoleC497AFFC", "Arn"]}]
        },
        {
          Action: ["events:PutTargets", "events:PutRule", "events:DescribeRule"],
          Effect: "Allow",
          Resource: {"Fn::Join": ["", [
            "arn:",
            {Ref: "AWS::Partition"},
            ":events:",
            {Ref: "AWS::Region"},
            ":",
            {Ref: "AWS::AccountId"},
            ":rule/StepFunctionsGetEventsForECSTaskRule"
          ]]}
        }
      ],
    },
  });
});

test('Running an EC2 Task with placement strategies', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    compatibility: ecs.Compatibility.EC2
  });
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  const ec2Task = new tasks.RunEcsEc2Task({
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
    cluster,
    taskDefinition,
    placementStrategies: [
      ecs.PlacementStrategy.spreadAcrossInstances(),
      ecs.PlacementStrategy.packedByCpu(),
      ecs.PlacementStrategy.randomly(),
    ],
    placementConstraints: [ecs.PlacementConstraint.memberOf('blieptuut')],
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: ec2Task });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "EC2",
      TaskDefinition: {Ref: "TD49C78F36"},
      PlacementConstraints: [
        { Type: "memberOf", Expression: "blieptuut", },
      ],
      PlacementStrategy: [
        { Field: "instanceId", Type: "spread", },
        { Field: "cpu", Type: "binpack", },
        { Type: "random", },
      ],
    },
    Resource: "arn:aws:states:::ecs:runTask.sync",
    Type: "Task",
  });
});

test('Running an EC2 Task with overridden number values', () => {
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    compatibility: ecs.Compatibility.EC2
  });
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  const ec2Task = new tasks.RunEcsEc2Task({
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerName: 'TheContainer',
        command: sfn.Data.listAt('$.TheCommand'),
        cpu: 5,
        memoryLimit: sfn.Data.numberAt('$.MemoryLimit'),
      }
    ]
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: ec2Task });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "EC2",
      TaskDefinition: {Ref: "TD49C78F36"},
      Overrides: {
        ContainerOverrides: [
          {
            "Command.$": "$.TheCommand",
            "Cpu": 5,
            "Memory.$": "$.MemoryLimit",
            "Name": "TheContainer",
          },
        ],
      },
    },
    Resource: "arn:aws:states:::ecs:runTask.sync",
    Type: "Task",
  });
});
