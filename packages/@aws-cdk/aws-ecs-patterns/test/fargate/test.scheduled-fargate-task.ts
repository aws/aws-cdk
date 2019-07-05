import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { ScheduledFargateTask } from '../../lib';

export = {
  "Can create a scheduled Fargate Task - with only required props"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 512,
      schedule: events.Schedule.expression('rate(1 minute)')
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { "Fn::GetAtt": ["EcsCluster97242B84", "Arn"] },
          EcsParameters: {
            TaskCount: 1,
            TaskDefinitionArn: { Ref: "ScheduledFargateTaskScheduledTaskDef521FA675" }
          },
          Id: "ScheduledFargateTaskScheduledTaskDef4D131A6E",
          Input: "{}",
          RoleArn: { "Fn::GetAtt": ["ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522", "Arn"] }
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: "henk",
          Links: [],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": {
                Ref: "ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C"
              },
              "awslogs-stream-prefix": "ScheduledFargateTask",
              "awslogs-region": {
                Ref: "AWS::Region"
              }
            }
          },
          MountPoints: [],
          Name: "ScheduledContainer",
          PortMappings: [],
          Ulimits: [],
          VolumesFrom: []
        }
      ]
    }));

    test.done();
  },

  "Can create a scheduled Fargate Task - with optional props"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('henk'),
      desiredTaskCount: 2,
      memoryLimitMiB: 512,
      cpu: 2,
      environment: { name: 'TRIGGER', value: 'CloudWatch Events' },
      schedule: events.Schedule.expression('rate(1 minute)')
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { "Fn::GetAtt": ["EcsCluster97242B84", "Arn"] },
          EcsParameters: {
            TaskCount: 2,
            TaskDefinitionArn: { Ref: "ScheduledFargateTaskScheduledTaskDef521FA675" }
          },
          Id: "ScheduledFargateTaskScheduledTaskDef4D131A6E",
          Input: "{}",
          RoleArn: { "Fn::GetAtt": ["ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522", "Arn"] }
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "name",
              Value: "TRIGGER"
            },
            {
              Name: "value",
              Value: "CloudWatch Events"
            }
          ],
          Essential: true,
          Image: "henk",
          Links: [],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": {
                Ref: "ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C"
              },
              "awslogs-stream-prefix": "ScheduledFargateTask",
              "awslogs-region": {
                Ref: "AWS::Region"
              }
            }
          },
          MountPoints: [],
          Name: "ScheduledContainer",
          PortMappings: [],
          Ulimits: [],
          VolumesFrom: []
        }
      ]
    }));

    test.done();
  },

  "Scheduled Fargate Task - with MemoryReservation defined"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('henk'),
      schedule: events.Schedule.expression('rate(1 minute)')
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: "henk",
          Links: [],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": {
                Ref: "ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C"
              },
              "awslogs-stream-prefix": "ScheduledFargateTask",
              "awslogs-region": {
                Ref: "AWS::Region"
              }
            }
          },
          MountPoints: [],
          Name: "ScheduledContainer",
          PortMappings: [],
          Ulimits: [],
          VolumesFrom: []
        }
      ]
    }));

    test.done();
  },

  "Scheduled Fargate Task - with Command defined"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('henk'),
      command: ["-c", "4", "amazon.com"],
      schedule: events.Schedule.expression('rate(1 minute)')
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Command: [
            "-c",
            "4",
            "amazon.com"
          ],
          Essential: true,
          Image: "henk",
          Links: [],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": {
                Ref: "ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C"
              },
              "awslogs-stream-prefix": "ScheduledFargateTask",
              "awslogs-region": {
                Ref: "AWS::Region"
              }
            }
          },
          MountPoints: [],
          Name: "ScheduledContainer",
          PortMappings: [],
          Ulimits: [],
          VolumesFrom: []
        }
      ]
    }));

    test.done();
  },
};
