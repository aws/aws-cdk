import { Template } from '../../../assertions';
import * as autoscaling from '../../../aws-autoscaling';
import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { ECS_REDUCE_RUN_TASK_PERMISSIONS } from '../../../cx-api';
import * as tasks from '../../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let cluster: ecs.Cluster;

/* eslint-disable quote-props */

test('Setting ECS_REDUCE_RUN_TASK_PERMISSIONS to false grants extra permissions', () => {
  stack = new Stack();
  stack.node.setContext(ECS_REDUCE_RUN_TASK_PERMISSIONS, false);
  vpc = new ec2.Vpc(stack, 'Vpc');
  cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new ecs.AsgCapacityProvider(stack, 'Capacity', {
    autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t3.medium'),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    }),
  }));

  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.FARGATE,
  });
  const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new tasks.EcsRunTask(stack, 'RunFargate', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerDefinition,
        environment: [{ name: 'SOME_KEY', value: sfn.JsonPath.stringAt('$.SomeKey') }],
      },
    ],
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
  });

  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(runTask),
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: { 'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'] },
      LaunchType: 'FARGATE',
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          SecurityGroups: [{ 'Fn::GetAtt': ['RunFargateSecurityGroup709740F2', 'GroupId'] }],
          Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }, { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }],
        },
      },
      PlatformVersion: '1.4.0',
      TaskDefinition: 'TD',
      Overrides: {
        ContainerOverrides: [
          {
            Environment: [
              {
                Name: 'SOME_KEY',
                'Value.$': '$.SomeKey',
              },
            ],
            Name: 'TheContainer',
          },
        ],
      },
    },
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::ecs:runTask.sync',
        ],
      ],
    },
    Type: 'Task',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'ecs:RunTask',
          Effect: 'Allow',
          Resource: [{
            'Fn::Join': [
              '',
              [
                'arn:',
                { 'Fn::Select': [1, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [2, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                '/',
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
              ],
            ],
          }, {
            'Fn::Join': [
              '',
              [
                'arn:',
                { 'Fn::Select': [1, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [2, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                '/',
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                ':*',
              ],
            ],
          }],
        },
        {
          Action: ['ecs:StopTask', 'ecs:DescribeTasks'],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['TDTaskRoleC497AFFC', 'Arn'] },
        },
        {
          Action: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':events:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':rule/StepFunctionsGetEventsForECSTaskRule',
              ],
            ],
          },
        },
      ],
    },
  });
});

test('Leaving ECS_REDUCE_RUN_TASK_PERMISSIONS as the default (false) grants extra permissions', () => {
  stack = new Stack();
  stack.node.setContext(ECS_REDUCE_RUN_TASK_PERMISSIONS, false);
  vpc = new ec2.Vpc(stack, 'Vpc');
  cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new ecs.AsgCapacityProvider(stack, 'Capacity', {
    autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t3.medium'),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    }),
  }));

  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.FARGATE,
  });
  const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new tasks.EcsRunTask(stack, 'RunFargate', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerDefinition,
        environment: [{ name: 'SOME_KEY', value: sfn.JsonPath.stringAt('$.SomeKey') }],
      },
    ],
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
  });

  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(runTask),
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: { 'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'] },
      LaunchType: 'FARGATE',
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          SecurityGroups: [{ 'Fn::GetAtt': ['RunFargateSecurityGroup709740F2', 'GroupId'] }],
          Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }, { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }],
        },
      },
      PlatformVersion: '1.4.0',
      TaskDefinition: 'TD',
      Overrides: {
        ContainerOverrides: [
          {
            Environment: [
              {
                Name: 'SOME_KEY',
                'Value.$': '$.SomeKey',
              },
            ],
            Name: 'TheContainer',
          },
        ],
      },
    },
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::ecs:runTask.sync',
        ],
      ],
    },
    Type: 'Task',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'ecs:RunTask',
          Effect: 'Allow',
          Resource: [{
            'Fn::Join': [
              '',
              [
                'arn:',
                { 'Fn::Select': [1, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [2, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                '/',
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
              ],
            ],
          }, {
            'Fn::Join': [
              '',
              [
                'arn:',
                { 'Fn::Select': [1, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [2, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                '/',
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                ':*',
              ],
            ],
          }],
        },
        {
          Action: ['ecs:StopTask', 'ecs:DescribeTasks'],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['TDTaskRoleC497AFFC', 'Arn'] },
        },
        {
          Action: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':events:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':rule/StepFunctionsGetEventsForECSTaskRule',
              ],
            ],
          },
        },
      ],
    },
  });
});

test('Setting ECS_REDUCE_RUN_TASK_PERMISSIONS to true reduces permissions', () => {
  stack = new Stack();
  stack.node.setContext(ECS_REDUCE_RUN_TASK_PERMISSIONS, true);
  vpc = new ec2.Vpc(stack, 'Vpc');
  cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new ecs.AsgCapacityProvider(stack, 'Capacity', {
    autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t3.medium'),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    }),
  }));

  const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
    memoryMiB: '512',
    cpu: '256',
    compatibility: ecs.Compatibility.FARGATE,
  });
  const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('foo/bar'),
    memoryLimitMiB: 256,
  });

  // WHEN
  const runTask = new tasks.EcsRunTask(stack, 'RunFargate', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    containerOverrides: [
      {
        containerDefinition,
        environment: [{ name: 'SOME_KEY', value: sfn.JsonPath.stringAt('$.SomeKey') }],
      },
    ],
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
  });

  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(runTask),
  });

  // THEN
  expect(stack.resolve(runTask.toStateJson())).toEqual({
    End: true,
    Parameters: {
      Cluster: { 'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'] },
      LaunchType: 'FARGATE',
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          SecurityGroups: [{ 'Fn::GetAtt': ['RunFargateSecurityGroup709740F2', 'GroupId'] }],
          Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }, { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }],
        },
      },
      PlatformVersion: '1.4.0',
      TaskDefinition: 'TD',
      Overrides: {
        ContainerOverrides: [
          {
            Environment: [
              {
                Name: 'SOME_KEY',
                'Value.$': '$.SomeKey',
              },
            ],
            Name: 'TheContainer',
          },
        ],
      },
    },
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::ecs:runTask.sync',
        ],
      ],
    },
    Type: 'Task',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'ecs:RunTask',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { 'Fn::Select': [1, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [2, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] },
                ':',
                { 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                '/',
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Ref': 'TD49C78F36' }] }] }] }] },
                ':*',
              ],
            ],
          },
        },
        {
          Action: ['ecs:StopTask', 'ecs:DescribeTasks'],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['TDTaskRoleC497AFFC', 'Arn'] },
        },
        {
          Action: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':events:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':rule/StepFunctionsGetEventsForECSTaskRule',
              ],
            ],
          },
        },
      ],
    },
  });
});
