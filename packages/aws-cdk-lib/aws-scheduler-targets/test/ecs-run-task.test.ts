import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import { AccountRootPrincipal, Role } from '../../aws-iam';
import { Schedule, ScheduleExpression, ScheduleGroup } from '../../aws-scheduler';
import * as sqs from '../../aws-sqs';
import { App, Duration, Stack } from '../../core';
import { EcsRunFargateTask, EcsRunEc2Task } from '../lib';

describe('EcsRunTask schedule target', () => {
  let app: App;
  let stack: Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let fargateTaskDef: ecs.TaskDefinition;
  let ec2TaskDef: ecs.TaskDefinition;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget0173fd6BD2182B';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
                  { Ref: 'VpcPrivateSubnet3SubnetF258B56E' },
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
                  { Ref: 'VpcPublicSubnet3SubnetBE12F0B6' },
                ],
                AssignPublicIp: 'ENABLED',
              },
            },
          },
        },
      });
    });

    test('if security group is an empty array then set to undefined (default security group is used)', () => {
      // WHEN
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          securityGroups: [],
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
                  { Ref: 'VpcPublicSubnet3SubnetBE12F0B6' },
                ],
                SecurityGroups: Match.absent(),
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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
                  { Ref: 'VpcPrivateSubnet3SubnetF258B56E' },
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
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

    test('if security group is an empty array then set to undefined (default security group is used)', () => {
      // WHEN
      const ec2TaskDefUsingAwsVpc = new ecs.Ec2TaskDefinition(stack, 'AwsVpcTaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunEc2Task(cluster, {
          taskDefinition: ec2TaskDefUsingAwsVpc,
          vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          securityGroups: [],
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
                  { Ref: 'VpcPublicSubnet3SubnetBE12F0B6' },
                ],
                SecurityGroups: Match.absent(),
              },
            },
          },
        },
      });
    });
  });

  describe('IAM Permissions', () => {
    test('grants necessary permissions to execute task', () => {
      // WHEN
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
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
                    ':ecs:us-east-1:123456789012:task/',
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

    test('creates IAM role and IAM policy for EcsRunTask in the same account', () => {
      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
        Properties: {
          Target: {
            Arn: {
              'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'],
            },
            RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
            RetryPolicy: {},
          },
        },
      });

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
        Roles: [{ Ref: roleId }],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': '123456789012',
                  'aws:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':scheduler:us-east-1:123456789012:schedule-group/default',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            },
          ],
        },
      });
    });

    test('creates IAM policy for provided IAM role', () => {
      const targetExecutionRole = new Role(stack, 'ProvidedTargetRole', {
        assumedBy: new AccountRootPrincipal(),
      });

      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
        role: targetExecutionRole,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
        Properties: {
          Target: {
            Arn: {
              'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'],
            },
            RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
            RetryPolicy: {},
          },
        },
      });

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
        Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
      });
    });

    test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
      });

      new Schedule(stack, 'MyScheduleDummy1', {
        schedule: expr,
        target: ecsTarget,
      });

      new Schedule(stack, 'MyScheduleDummy2', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': '123456789012',
                  'aws:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':scheduler:us-east-1:123456789012:schedule-group/default',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            },
          ],
        },
      }, 1);

      Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
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
        Roles: [{ Ref: roleId }],
      }, 1);
    });

    test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
      const group = new ScheduleGroup(stack, 'Group', {
        scheduleGroupName: 'mygroup',
      });

      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
      });

      new Schedule(stack, 'MyScheduleDummy1', {
        schedule: expr,
        target: ecsTarget,
      });

      new Schedule(stack, 'MyScheduleDummy2', {
        schedule: expr,
        target: ecsTarget,
        scheduleGroup: group,
      });

      Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': '123456789012',
                  'aws:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':scheduler:us-east-1:123456789012:schedule-group/default',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            },
            {
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': '123456789012',
                  'aws:SourceArn': {
                    'Fn::GetAtt': [
                      'GroupC77FDACD',
                      'Arn',
                    ],
                  },
                },
              },
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            },
          ],
        },
      }, 1);

      Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
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
        Roles: [{ Ref: roleId }],
      }, 1);
    });

    test('creates IAM policy for EcsRunTask target in the another stack with the same account', () => {
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          region: 'us-east-1',
          account: '123456789012',
        },
      });

      const anotherFargateTaskDef = new ecs.FargateTaskDefinition(stack2, 'AnotherTaskDef', {
        memoryLimitMiB: 512,
        cpu: 256,
      });

      const anotherCluster = new ecs.Cluster(stack2, 'AnotherCluster', {
        vpc: new ec2.Vpc(stack2, 'AnotherVpc'),
      });

      const ecsTarget = new EcsRunFargateTask(anotherCluster, {
        taskDefinition: anotherFargateTaskDef,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
        Properties: {
          Target: {
            Arn: {
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherCluster9D7C9369ArnAB7C726B',
            },
            RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargetf6cfaa4FEBD4A7', 'Arn'] },
            RetryPolicy: {},
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
              Resource: {
                'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherTaskDefTaskRoleB2BCE54CArn329BDA15',
              },
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: {
                'Fn::ImportValue': 'Stack2:ExportsOutputRefAnotherTaskDefF1908EE5C2DB091A',
              },
            },
          ],
        },
        Roles: [{ Ref: 'SchedulerRoleForTargetf6cfaa4FEBD4A7' }],
      });
    });

    test('creates IAM policy for imported role for ecs in the same account', () => {
      const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
        role: importedRole,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
        Properties: {
          Target: {
            Arn: {
              'Fn::GetAtt': ['ClusterEB0386A7', 'Arn'],
            },
            RoleArn: 'arn:aws:iam::123456789012:role/someRole',
            RetryPolicy: {},
          },
        },
      });

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
              Resource: {
                Ref: 'TaskDef54694570',
              },
            },
          ],
        },
        Roles: ['someRole'],
      });
    });

    test('creates IAM policy for ecs run task in the another stack with imported IAM role in the same account', () => {
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          region: 'us-east-1',
          account: '123456789012',
        },
      });

      const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

      const anotherFargateTaskDef = new ecs.FargateTaskDefinition(stack2, 'AnotherTaskDef', {
        memoryLimitMiB: 512,
        cpu: 256,
      });

      const anotherCluster = new ecs.Cluster(stack2, 'AnotherCluster', {
        vpc: new ec2.Vpc(stack2, 'AnotherVpc'),
      });

      const ecsTarget = new EcsRunFargateTask(anotherCluster, {
        taskDefinition: anotherFargateTaskDef,
        role: importedRole,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
        Properties: {
          Target: {
            Arn: {
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherCluster9D7C9369ArnAB7C726B',
            },
            RoleArn: 'arn:aws:iam::123456789012:role/someRole',
            RetryPolicy: {},
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
              Resource: {
                'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherTaskDefTaskRoleB2BCE54CArn329BDA15',
              },
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: {
                'Fn::ImportValue': 'Stack2:ExportsOutputRefAnotherTaskDefF1908EE5C2DB091A',
              },
            },
          ],
        },
        Roles: ['someRole'],
      });
    });

    test('adds permissions to execution role for sending messages to DLQ', () => {
      const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
        deadLetterQueue: dlq,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {

              Action: 'iam:PassRole',
              Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
              Effect: 'Allow',
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
              Action: 'sqs:SendMessage',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
              },
            },
          ],
        },
        Roles: [{ Ref: roleId }],
      });
    });

    test('adds permission to execution role when imported DLQ is in same account', () => {
      const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

      const ecsTarget = new EcsRunFargateTask(cluster, {
        taskDefinition: fargateTaskDef,
        deadLetterQueue: importedQueue,
      });

      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: ecsTarget,
      });

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
              Action: 'sqs:SendMessage',
              Effect: 'Allow',
              Resource: importedQueue.queueArn,
            },
          ],
        },
        Roles: [{ Ref: roleId }],
      });
    });
  });

  describe('Error handling', () => {
    test('configures retry policy correctly', () => {
      // WHEN
      new Schedule(stack, 'Schedule', {
        schedule: expr,
        target: new EcsRunFargateTask(cluster, {
          taskDefinition: fargateTaskDef,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          retryAttempts: 3,
          maxEventAge: Duration.hours(2),
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
        new Schedule(stack, 'Schedule', {
          schedule: expr,
          target: new EcsRunFargateTask(cluster, {
            taskDefinition: ec2TaskDef,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/TaskDefinition is not compatible with Fargate launch type/);
    });

    test('throws when using Fargate task definition with EC2 launch type', () => {
      fargateTaskDef = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      expect(() => {
        new Schedule(stack, 'Schedule', {
          schedule: expr,
          target: new EcsRunEc2Task(cluster, {
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
        new Schedule(stack, 'Schedule', {
          schedule: expr,
          target: new EcsRunEc2Task(cluster, {
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
        new Schedule(stack, 'Schedule', {
          schedule: expr,
          target: new EcsRunEc2Task(cluster, {
            taskDefinition: ec2TaskDef,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          }),
        });
      }).toThrow(/Security groups and subnets can only be used with awsvpc network mode/);
    });

    test('throws when retry policy max age is more than 1 day', () => {
      const ecsTarget = new EcsRunEc2Task(cluster, {
        taskDefinition: ec2TaskDef,
        maxEventAge: Duration.days(3),
      });

      expect(() =>
        new Schedule(stack, 'MyScheduleDummy', {
          schedule: expr,
          target: ecsTarget,
        })).toThrow(/Maximum event age is 1 day/);
    });

    test('throws when retry policy max age is less than 1 minute', () => {
      const ecsTarget = new EcsRunEc2Task(cluster, {
        taskDefinition: ec2TaskDef,
        maxEventAge: Duration.seconds(59),
      });

      expect(() =>
        new Schedule(stack, 'MyScheduleDummy', {
          schedule: expr,
          target: ecsTarget,
        })).toThrow(/Minimum event age is 1 minute/);
    });

    test('throws when retry policy max retry attempts is out of the allowed limits', () => {
      const ecsTarget = new EcsRunEc2Task(cluster, {
        taskDefinition: ec2TaskDef,
        retryAttempts: 200,
      });

      expect(() =>
        new Schedule(stack, 'MyScheduleDummy', {
          schedule: expr,
          target: ecsTarget,
        })).toThrow(/Number of retry attempts should be less or equal than 185/);
    });
  });
});
