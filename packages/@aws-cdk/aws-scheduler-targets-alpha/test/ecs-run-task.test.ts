import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as targets from '../lib';

describe('EcsRunTask', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let taskDefinition: ecs.TaskDefinition;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('test'),
    });
  });

  describe('Fargate configuration', () => {
    test('creates basic Fargate configuration', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          assignPublicIp: false,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget0173fd6BD2182B', 'Arn'] },
          EcsParameters: {
            TaskDefinitionArn: { Ref: 'TaskDef54694570' },
            LaunchType: 'FARGATE',
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                Subnets: [
                  { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                  { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
                ],
                AssignPublicIp: 'DISABLED',
              },
            },
          },
        },
      });
    });

    test('supports custom security groups', () => {
      // WHEN
      const securityGroup = new ec2.SecurityGroup(stack, 'CustomSG', { vpc });
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          securityGroups: [securityGroup],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                SecurityGroups: [{ 'Fn::GetAtt': ['CustomSG353C444F', 'GroupId'] }],
              },
            },
          },
        },
      });
    });

    test('supports platform version configuration', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            PlatformVersion: '1.4.0',
          },
        },
      });
    });
  });

  describe('EC2 configuration', () => {
    test('creates basic EC2 configuration', () => {
      // WHEN
      const ec2TaskDef = new ecs.TaskDefinition(stack, 'EC2TaskDef', {
        compatibility: ecs.Compatibility.EC2,
      });
      ec2TaskDef.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 256,
      });

      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDef,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget0173fd6BD2182B', 'Arn'] },
          EcsParameters: {
            TaskDefinitionArn: { Ref: 'EC2TaskDef78A4E50E' },
            LaunchType: 'EC2',
          },
        },
      });
    });

    test('supports placement constraints', () => {
      // WHEN
      const ec2TaskDef = new ecs.TaskDefinition(stack, 'EC2TaskDef', {
        compatibility: ecs.Compatibility.EC2,
      });
      ec2TaskDef.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 256,
      });

      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDef,
          placementConstraints: [ecs.PlacementConstraint.memberOf('task:group == databases')],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            PlacementConstraints: [{
              Type: 'memberOf',
              Expression: 'task:group == databases',
            }],
          },
        },
      });
    });
  });

  describe('IAM Permissions', () => {
    test('grants necessary permissions to execute task', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
              Resource: {
                'Fn::GetAtt': ['TaskDefTaskRole1EDB4A67', 'Arn'],
              },
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: { Ref: 'TaskDef54694570' },
            },
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': ['TaskDefTaskRole1EDB4A67', 'Arn'] },
            },
          ],
        },
      });
    });

    test('includes tag permissions when tagging is enabled', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          propagateTags: true,
          tags: [{ key: 'test', value: 'value' }],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
              Resource: {
                'Fn::GetAtt': ['TaskDefTaskRole1EDB4A67', 'Arn'],
              },
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: { Ref: 'TaskDef54694570' },
            },
            {
              Action: 'ecs:TagResource',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ecs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':task/',
                    {
                      Ref: 'ClusterEB0386A7',
                    },
                    '/*',
                  ],
                ],
              },
            },
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': ['TaskDefTaskRole1EDB4A67', 'Arn'] },
            },
          ],
        },
      });
    });
  });

  describe('Error handling', () => {
    test('configures retry policy correctly', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          retryAttempts: 3,
          maxEventAge: cdk.Duration.hours(2),
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          RetryPolicy: {
            MaximumEventAgeInSeconds: 7200,
            MaximumRetryAttempts: 3,
          },
        },
      });
    });

    test('throws when using EC2 task definition with Fargate launch type', () => {
      const ec2TaskDef = new ecs.Ec2TaskDefinition(stack, 'EC2TaskDef');
      ec2TaskDef.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
      });

      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onFargate(cluster, {
            taskDefinition: ec2TaskDef,
            subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/TaskDefinition is not compatible with Fargate launch type/);
    });

    test('throws when using Fargate task definition with EC2 launch type', () => {
      const fargateTaskDef = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onEc2(cluster, {
            taskDefinition: fargateTaskDef,
          }),
        });
      }).toThrow(/TaskDefinition is not compatible with EC2 launch type/);
    });

    test('throws when using assignPublicIp with non-public subnet', () => {
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onFargate(cluster, {
            taskDefinition,
            subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
            assignPublicIp: true,
          }),
        });
      }).toThrow(/assignPublicIp should be set to true only for public subnets/);
    });
  });
});
