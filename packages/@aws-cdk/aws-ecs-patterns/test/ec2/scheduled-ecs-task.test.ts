import { Annotations, Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MachineImage } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { AsgCapacityProvider } from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { ScheduledEc2Task } from '../../lib';

test('Can create a scheduled Ec2 Task - with only required props', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    State: 'ENABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'ScheduledEc2TaskScheduledTaskDef56328BA4' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledEc2TaskScheduledTaskDefEventsRole64113C5F', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
            },
            'awslogs-stream-prefix': 'ScheduledEc2Task',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Memory: 512,
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Can create a scheduled Ec2 Task - with optional props', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    enabled: false,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
      cpu: 2,
      environment: { TRIGGER: 'CloudWatch Events' },
    },
    desiredTaskCount: 2,
    schedule: events.Schedule.expression('rate(1 minute)'),
    ruleName: 'sample-scheduled-task-rule',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Name: 'sample-scheduled-task-rule',
    State: 'DISABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          TaskCount: 2,
          TaskDefinitionArn: { Ref: 'ScheduledEc2TaskScheduledTaskDef56328BA4' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['ScheduledEc2TaskScheduledTaskDefEventsRole64113C5F', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Cpu: 2,
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
              Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
            },
            'awslogs-stream-prefix': 'ScheduledEc2Task',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Memory: 512,
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Scheduled ECS Task - with securityGroups defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
    networkMode: ecs.NetworkMode.AWS_VPC,
  });
  const sg = new ec2.SecurityGroup(stack, 'MySG', { vpc });

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskDefinitionOptions: {
      taskDefinition,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
    securityGroups: [sg],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'EC2',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [{
                'Fn::GetAtt': [
                  'MySG94FE69A8',
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
          TaskDefinitionArn: { Ref: 'Ec2TaskDef0226F28C' },
        },
        Id: 'Target0',
        Input: '{}',
        RoleArn: { 'Fn::GetAtt': ['Ec2TaskDefEventsRoleA0756175', 'Arn'] },
      },
    ],
  });
});

test('Scheduled Ec2 Task - with MemoryReservation defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryReservationMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Essential: true,
        Image: 'henk',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
            },
            'awslogs-stream-prefix': 'ScheduledEc2Task',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        MemoryReservation: 512,
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('Scheduled Ec2 Task - with Command defined', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryReservationMiB: 512,
      command: ['-c', '4', 'amazon.com'],
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
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
              Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
            },
            'awslogs-stream-prefix': 'ScheduledEc2Task',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        MemoryReservation: 512,
        Name: 'ScheduledContainer',
      },
    ],
  });
});

test('throws if desiredTaskCount is 0', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // THEN
  expect(() =>
    new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('henk'),
        memoryLimitMiB: 512,
      },
      schedule: events.Schedule.expression('rate(1 minute)'),
      desiredTaskCount: 0,
    }),
  ).toThrow(/You must specify a desiredTaskCount greater than 0/);
});

test('Scheduled Ec2 Task - exposes ECS Task', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const scheduledEc2Task = new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // THEN
  expect(scheduledEc2Task.task).toBeDefined();
});

test('Scheduled Ec2 Task shows warning when minute is not defined in cron', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.cron({}),
  });

  // THEN
  Annotations.fromStack(stack).hasWarning('/Default', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
});

test('Scheduled Ec2 Task shows no warning when minute is * in cron', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
    cluster,
    scheduledEc2TaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
    },
    schedule: events.Schedule.cron({ minute: '*' }),
  });

  // THEN
  Annotations.fromStack(stack).hasNoWarning('/Default', Match.anyValue());
});
