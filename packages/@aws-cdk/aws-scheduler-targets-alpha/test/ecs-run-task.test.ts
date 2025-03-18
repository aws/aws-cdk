import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as targets from '../lib';

describe('EcsRunTask', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let fargateTaskDef: ecs.TaskDefinition;
  let ec2TaskDef: ecs.TaskDefinition;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    fargateTaskDef = new ecs.TaskDefinition(stack, 'TaskDef', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });
    fargateTaskDef.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('test'),
    });

    ec2TaskDef = new ecs.TaskDefinition(stack, 'EC2TaskDef', {
      compatibility: ecs.Compatibility.EC2,
    });
    ec2TaskDef.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 256,
    });
  });

  describe('Fargate configuration', () => {
    test('creates basic Fargate configuration', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          assignPublicIp: false,
          platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
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
            PlatformVersion: '1.4.0',
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
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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

    test('supports capacity provider strategies and omits launch type', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          capacityProviderStrategies: [
            {
              capacityProvider: 'FARGATE_SPOT',
              weight: 2,
              base: 1,
            },
            {
              capacityProvider: 'FARGATE',
              weight: 1,
            },
          ],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            CapacityProviderStrategy: [
              {
                CapacityProvider: 'FARGATE_SPOT',
                Weight: 2,
                Base: 1,
              },
              {
                CapacityProvider: 'FARGATE',
                Weight: 1,
              },
            ],
            // LaunchType should not be set when using capacity provider strategy
            LaunchType: Match.absent(),
          },
        },
      });
    });

    test('sets launch type to FARGATE when capacity provider strategies are not specified', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          // No capacityProviderStrategies specified
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            // LaunchType should be set to FARGATE when no capacity provider strategies are specified
            LaunchType: 'FARGATE',
            // CapacityProviderStrategy should be absent
            CapacityProviderStrategy: Match.absent(),
          },
        },
      });
    });

    test('supports public subnet with assignPublicIp', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          assignPublicIp: true,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                Subnets: [
                  { Ref: 'VpcPublicSubnet1Subnet5C2D37C4' },
                  { Ref: 'VpcPublicSubnet2Subnet691E08A3' },
                ],
                AssignPublicIp: 'ENABLED',
              },
            },
          },
        },
      });
    });
  });

  describe('EC2 configuration', () => {
    test('creates basic EC2 configuration', () => {
      // WHEN
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

    test('supports vpc configuration with awsvpc network mode', () => {
      const ec2TaskDefUsingAwsVpc = new ecs.Ec2TaskDefinition(stack, 'AwsVpcTaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });
      ec2TaskDefUsingAwsVpc.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 256,
      });

      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDefUsingAwsVpc,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          securityGroups: [new ec2.SecurityGroup(stack, 'CustomSecurityGroup', { vpc })],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                Subnets: [
                  { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                  { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
                ],
                SecurityGroups: [
                  { 'Fn::GetAtt': ['CustomSecurityGroupE5E500E5', 'GroupId'] },
                ],
              },
            },
          },
        },
      });
    });

    test('supports placement constraints', () => {
      // WHEN
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

    test('supports capacity provider strategies and omits launch type', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDef,
          capacityProviderStrategies: [
            {
              capacityProvider: 'my-ec2-capacity-provider',
              weight: 1,
            },
          ],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            CapacityProviderStrategy: [
              {
                CapacityProvider: 'my-ec2-capacity-provider',
                Weight: 1,
              },
            ],
            // LaunchType should not be set when using capacity provider strategy
            LaunchType: Match.absent(),
          },
        },
      });
    });

    test('sets launch type to EC2 when capacity provider strategies are not specified', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDef,
          // No capacityProviderStrategies specified
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            // LaunchType should be set to EC2 when no capacity provider strategies are specified
            LaunchType: 'EC2',
            // CapacityProviderStrategy should be absent
            CapacityProviderStrategy: Match.absent(),
          },
        },
      });
    });

    test('supports placement strategies', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onEc2(cluster, {
          taskDefinition: ec2TaskDef,
          placementStrategies: [
            ecs.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE),
            ecs.PlacementStrategy.packedByCpu(),
            ecs.PlacementStrategy.randomly(),
          ],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          EcsParameters: {
            PlacementStrategy: [
              {
                Type: 'spread',
                Field: 'attribute:ecs.availability-zone',
              },
              {
                Type: 'binpack',
                Field: 'CPU',
              },
              {
                Type: 'random',
              },
            ],
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
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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
          ],
        },
      });
    });

    test('includes tag permissions when tagging is enabled', () => {
      // WHEN
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
        target: targets.EcsRunTask.onFargate(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onFargate(cluster, {
            taskDefinition: ec2TaskDef,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/TaskDefinition is not compatible with Fargate launch type/);
    });

    test('throws when using Fargate task definition with EC2 launch type', () => {
      fargateTaskDef = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onEc2(cluster, {
            taskDefinition: fargateTaskDef,
          }),
        });
      }).toThrow(/TaskDefinition is not compatible with EC2 launch type/);
    });

    test('throws when security groups are provided with non-awsvpc network mode', () => {
      // GIVEN
      const ec2TaskDefUsingBridgeMode = new ecs.TaskDefinition(stack, 'Ec2TaskDefBridgeMode', {
        compatibility: ecs.Compatibility.EC2,
        networkMode: ecs.NetworkMode.BRIDGE,
      });
      ec2TaskDefUsingBridgeMode.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
      });
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onEc2(cluster, {
            taskDefinition: ec2TaskDef,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/Security groups and subnets can only be used with awsvpc network mode/);
    });

    test('throws when vpcSubnets are provided with non-awsvpc network mode', () => {
      // GIVEN
      const ec2TaskDefUsingBridgeMode = new ecs.TaskDefinition(stack, 'Ec2TaskDefBridgeMode', {
        compatibility: ecs.Compatibility.EC2,
        networkMode: ecs.NetworkMode.BRIDGE,
      });
      ec2TaskDefUsingBridgeMode.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('test'),
      });
      expect(() => {
        new scheduler.Schedule(stack, 'Schedule', {
          schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(5)),
          target: targets.EcsRunTask.onEc2(cluster, {
            taskDefinition: ec2TaskDef,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/Security groups and subnets can only be used with awsvpc network mode/);
    });
  });
});
