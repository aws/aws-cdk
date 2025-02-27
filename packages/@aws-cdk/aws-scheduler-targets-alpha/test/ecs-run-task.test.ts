import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack, ValidationError } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { EcsRunTask } from '../lib/ecs-run-task';

describe('ecs run task schedule target', () => {
  let app: App;
  let stack: Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let taskDefinition: ecs.TaskDefinition;
  const scheduleExpression = scheduler.ScheduleExpression.at(new Date(Date.UTC(2023, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget0173fd6BD2182B';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
  });

  test('creates IAM role with required permissions for ECS task execution', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    // Verify scheduler configuration
    template.hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        Arn: {
          'Fn::GetAtt': [
            'ClusterEB0386A7',
            'Arn',
          ],
        },
        RoleArn: {
          'Fn::GetAtt': [
            roleId,
            'Arn',
          ],
        },
        EcsParameters: {
          TaskDefinitionArn: {
            Ref: 'TaskDefinitionB36D86D9',
          },
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              Subnets: [
                { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
                { Ref: 'VpcPrivateSubnet3SubnetF258B56E' },
              ],
            },
          },
        },
        RetryPolicy: {},
      },
    });

    // Verify IAM permissions
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
          },
          {
            Action: 'ecs:RunTask',
            Effect: 'Allow',
            Resource: {
              Ref: 'TaskDefinitionB36D86D9',
            },
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });
  });

  test('adds tag resource permission when propagateTags is true', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
      propagateTags: true,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
          },
          {
            Action: 'ecs:RunTask',
            Effect: 'Allow',
            Resource: {
              Ref: 'TaskDefinitionB36D86D9',
            },
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
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

  test('adds tag resource permission when tags are provided', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
      tags: [
        { key: 'Tag1', value: 'Value1' },
        { key: 'Tag2', value: 'Value2' },
      ],
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Condition: { StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' } },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
          },
          {
            Action: 'ecs:RunTask',
            Effect: 'Allow',
            Resource: {
              Ref: 'TaskDefinitionB36D86D9',
            },
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['TaskDefinitionTaskRoleFD40A61D', 'Arn'],
            },
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

  test('configures network settings with public subnet and assignPublicIp', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
      subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
      assignPublicIp: true,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        EcsParameters: {
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              AssignPublicIp: 'ENABLED',
              Subnets: [
                {
                  Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
                },
                {
                  Ref: 'VpcPublicSubnet2Subnet691E08A3',
                },
                {
                  Ref: 'VpcPublicSubnet3SubnetBE12F0B6',
                },
              ],
            },
          },
        },
      },
    });
  });

  test('throws validation error when assignPublicIp is true but subnet type is not public', () => {
    expect(() => {
      new EcsRunTask(cluster, {
        taskDefinition,
        subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        assignPublicIp: true,
      });
    }).not.toThrow();

    const target = new EcsRunTask(cluster, {
      taskDefinition,
      subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      assignPublicIp: true,
    });

    expect(() => {
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      });
    }).toThrow(ValidationError);
  });

  test('throws validation error when assignPublicIp is enabled for non-FARGATE tasks', () => {
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'EC2TaskDefinition');
    const target = new EcsRunTask(cluster, {
      taskDefinition: ec2TaskDefinition,
      subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
      assignPublicIp: true,
      launchType: ecs.LaunchType.EC2,
    });

    expect(() => {
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      });
    }).toThrow(ValidationError);
  });

  test('configures all optional properties correctly', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
      taskCount: 3,
      enableEcsManagedTags: true,
      enableExecuteCommand: true,
      group: 'test-group',
      platformVersion: '1.4.0',
      propagateTags: true,
      referenceId: 'test-ref-id',
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        EcsParameters: {
          TaskCount: 3,
          EnableECSManagedTags: true,
          EnableExecuteCommand: true,
          Group: 'test-group',
          PlatformVersion: '1.4.0',
          PropagateTags: 'TASK_DEFINITION',
          ReferenceId: 'test-ref-id',
        },
      },
    });
  });

  test('configures retry policy correctly', () => {
    const target = new EcsRunTask(cluster, {
      taskDefinition,
      retryAttempts: 3,
      maxEventAge: Duration.hours(3),
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        RetryPolicy: {
          MaximumRetryAttempts: 3,
          MaximumEventAgeInSeconds: 10800,
        },
      },
    });
  });

  test('correctly assigns security groups when provided', () => {
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

    const target = new EcsRunTask(cluster, {
      taskDefinition,
      securityGroups: [securityGroup],
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        EcsParameters: {
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              SecurityGroups: [{
                'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'],
              }],
            },
          },
        },
      },
    });
  });
});
