import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ScheduledEc2Task } from '../../lib';

export = {
  'Can create a scheduled Ec2 Task - with only required props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('henk'),
        memoryLimitMiB: 512,
      },
      schedule: events.Schedule.expression('rate(1 minute)'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
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
    }));

    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'Can create a scheduled Ec2 Task - with optional props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('henk'),
        memoryLimitMiB: 512,
        cpu: 2,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.expression('rate(1 minute)'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
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
    }));

    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'Scheduled Ec2 Task - with MemoryReservation defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('henk'),
        memoryReservationMiB: 512,
      },
      schedule: events.Schedule.expression('rate(1 minute)'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'Scheduled Ec2 Task - with Command defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

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
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'throws if desiredTaskCount is 0'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    // THEN
    test.throws(() =>
      new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
        cluster,
        scheduledEc2TaskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('henk'),
          memoryLimitMiB: 512,
        },
        schedule: events.Schedule.expression('rate(1 minute)'),
        desiredTaskCount: 0,
      }),
    /You must specify a desiredTaskCount greater than 0/);

    test.done();
  },
};
