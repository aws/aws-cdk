import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/cdk';
import tasks = require('../lib');

test('Running a Fargate Task', () => {
  // GIVEN
  const stack = new Stack();

  const vpc = new ec2.VpcNetwork(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.Fargate
  });
  taskDefinition.addContainer('henk', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: new tasks.RunEcsFargateTask(stack, 'RunFargate', {
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerName: 'TheContainer',
        environment: [
          {name: 'SOME_KEY', valuePath: '$.SomeKey'}
        ]
      }
    ]
  }) });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.node.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "FARGATE",
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: "DISABLED",
          SecurityGroups: [{"Fn::GetAtt": ["RunFargateSecurityGroup709740F2", "GroupId"]}],
          Subnets: [
            {Ref: "VpcPrivateSubnet1Subnet536B997A"},
            {Ref: "VpcPrivateSubnet2Subnet3788AAA1"},
            {Ref: "VpcPrivateSubnet3SubnetF258B56E"},
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
  // GIVEN
  const stack = new Stack();

  const vpc = new ec2.VpcNetwork(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('Capacity', {
    instanceType: new ec2.InstanceType('t3.medium')
  });

  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    compatibility: ecs.Compatibility.Ec2
  });
  taskDefinition.addContainer('henk', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: new tasks.RunEcsEc2Task(stack, 'RunEc2', {
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerName: 'TheContainer',
        environment: [
          {name: 'SOME_KEY', valuePath: '$.SomeKey'}
        ]
      }
    ]
  }) });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.node.resolve(runTask.toStateJson())).toEqual({
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
  // GIVEN
  const stack = new Stack();

  const vpc = new ec2.VpcNetwork(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('Capacity', {
    instanceType: new ec2.InstanceType('t3.medium')
  });

  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    compatibility: ecs.Compatibility.Ec2
  });
  taskDefinition.addContainer('henk', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  const ec2Task = new tasks.RunEcsEc2Task(stack, 'RunEc2', {
    cluster,
    taskDefinition,
  });
  ec2Task.placeSpreadAcross();
  ec2Task.placePackedBy(ecs.BinPackResource.Cpu);
  ec2Task.placeRandomly();
  ec2Task.placeOnMemberOf('blieptuut');

  // WHEN
  const runTask = new sfn.Task(stack, 'Run', { task: ec2Task });

  new sfn.StateMachine(stack, 'SM', {
    definition: runTask
  });

  // THEN
  expect(stack.node.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: {"Fn::GetAtt": ["ClusterEB0386A7", "Arn"]},
      LaunchType: "EC2",
      TaskDefinition: {Ref: "TD49C78F36"},
      PlacementConstraints: [
        { Type: "memberOf", expression: "blieptuut", },
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