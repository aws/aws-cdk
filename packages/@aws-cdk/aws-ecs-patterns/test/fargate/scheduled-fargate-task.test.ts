import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { ScheduledFargateTask } from '../../lib';

test('Can create a scheduled Fargate Task - with only required props', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    State: 'ENABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                {
                  'Fn::GetAtt': [
                    'ScheduledFargateTaskScheduledTaskDefSecurityGroupE075BC19',
                    'GroupId',
                  ],
                },
              ],
              Subnets: [
                {
                  Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
              ],
            },
          },
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
      },
    ],
  });

  expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
            },
            'awslogs-stream-prefix': 'ScheduledFargateTask',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Can create a scheduled Fargate Task - with optional props', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    enabled: false,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
      cpu: 2,
      ephemeralStorageGiB: 100,
      environment: { TRIGGER: 'CloudWatch Events' },
    },
    desiredTaskCount: 2,
    schedule: events.Schedule.expression('rate(1 minute)'),
    ruleName: 'sample-scheduled-task-rule',
  });

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    Name: 'sample-scheduled-task-rule',
    State: 'DISABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                {
                  'Fn::GetAtt': [
                    'ScheduledFargateTaskScheduledTaskDefSecurityGroupE075BC19',
                    'GroupId',
                  ],
                },
              ],
              Subnets: [
                {
                  Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
              ],
            },
          },
          TaskCount: 2,
          TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
      },
    ],
  });

  expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Environment: [
          {
            Name: 'TRIGGER',
            Value: 'CloudWatch Events',
          },
        ],
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
            },
            'awslogs-stream-prefix': 'ScheduledFargateTask',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Name: 'ScheduledContainer',
      },
    ],
    EphemeralStorage: {
      SizeInGiB: 100,
    },
  });
});

test('Scheduled Fargate Task - with MemoryReservation defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
            },
            'awslogs-stream-prefix': 'ScheduledFargateTask',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Scheduled Fargate Task - with Command defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      command: ['-c', '4', 'amazon.com'],
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Command: [
          '-c',
          '4',
          'amazon.com',
        ],
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
            },
            'awslogs-stream-prefix': 'ScheduledFargateTask',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Scheduled Fargate Task - with subnetSelection defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', {
    maxAzs: 1,
    subnetConfiguration: [
      { name: 'Public', cidrMask: 28, subnetType: ec2.SubnetType.PUBLIC },
    ],
  });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
    },
    subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        EcsParameters: {
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'ENABLED',
              Subnets: [
                {
                  Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
                },
              ],
            },
          },
        },
      },
    ],
  });
});

test('Scheduled Fargate Task - with platformVersion defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
    platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
  });

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                {
                  'Fn::GetAtt': [
                    'ScheduledFargateTaskScheduledTaskDefSecurityGroupE075BC19',
                    'GroupId',
                  ],
                },
              ],
              Subnets: [
                {
                  Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
              ],
            },
          },
          PlatformVersion: '1.4.0',
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
      },
    ],
  });
});

test('Scheduled Fargate Task - with securityGroups defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

  new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
    securityGroups: [sg],
  });

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [{
                'Fn::GetAtt': [
                  'SGADB53937',
                  'GroupId',
                ],
              }],
              Subnets: [
                {
                  Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
              ],
            },
          },
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
      },
    ],
  });
});

test('Scheduled Fargate Task - exposes ECS Task', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const scheduledFargateTask = new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(scheduledFargateTask.task).toBeDefined();
});
