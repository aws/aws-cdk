import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnScheduleGroup } from 'aws-cdk-lib/aws-scheduler';
import { IScheduleTarget, ScheduleExpression, ScheduleTargetConfig } from '../lib';
import { Group, GroupProps } from '../lib/group';
import { Schedule } from '../lib/schedule';

class SomeLambdaTarget implements IScheduleTarget {
  public constructor(private readonly fn: lambda.IFunction, private readonly role: iam.IRole) {
  }

  public bind(): ScheduleTargetConfig {
    return {
      arn: this.fn.functionArn,
      role: this.role,
    };
  }
}

describe('Schedule Group', () => {
  let stack: Stack;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    func = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      tracing: lambda.Tracing.PASS_THROUGH,
    });
  });

  test('creates a group with default properties', () => {
    const props: GroupProps = {};
    const group = new Group(stack, 'TestGroup', props);

    expect(group).toBeInstanceOf(Group);
    expect(group.groupName).toBeDefined();
    expect(group.groupArn).toBeDefined();

    const resource = group.node.findChild('Resource') as CfnScheduleGroup;
    expect(resource).toBeInstanceOf(CfnScheduleGroup);
    expect(resource.name).toEqual(group.groupName);
  });

  test('creates a group with removal policy', () => {
    const props: GroupProps = {
      removalPolicy: RemovalPolicy.RETAIN,
    };
    new Group(stack, 'TestGroup', props);

    Template.fromStack(stack).hasResource('AWS::Scheduler::ScheduleGroup', {
      DeletionPolicy: 'Retain',
    });
  });

  test('creates a group with specified name', () => {
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);
    const resource = group.node.findChild('Resource') as CfnScheduleGroup;
    expect(resource).toBeInstanceOf(CfnScheduleGroup);
    expect(resource.name).toEqual(group.groupName);

    Template.fromStack(stack).hasResource('AWS::Scheduler::ScheduleGroup', {
      Properties: {
        Name: `${props.groupName}`,
      },
    });
  });

  test('creates a group from ARN', () => {
    const groupArn = 'arn:aws:scheduler:region:account-id:schedule-group/group-name';
    const group = Group.fromGroupArn(stack, 'TestGroup', groupArn);

    expect(group.groupArn).toBeDefined();
    expect(group.groupName).toEqual('group-name');

    const groups = Template.fromStack(stack).findResources('AWS::Scheduler::ScheduleGroup');
    expect(groups).toEqual({});
  });

  test('creates a group from name', () => {
    const groupName = 'MyGroup';
    const group = Group.fromGroupName(stack, 'TestGroup', groupName);

    expect(group.groupArn).toBeDefined();
    expect(group.groupName).toEqual(groupName);

    const groups = Template.fromStack(stack).findResources('AWS::Scheduler::ScheduleGroup');
    expect(groups).toEqual({});
  });

  test('creates a group from default group', () => {
    const group = Group.fromDefaultGroup(stack, 'DefaultGroup');

    expect(group.groupArn).toBeDefined();
    expect(group.groupName).toEqual('default');

    const groups = Template.fromStack(stack).findResources('AWS::Scheduler::ScheduleGroup');
    expect(groups).toEqual({});
  });

  test('adds schedules to the group', () => {
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);
    const role = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const schedule1 = new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      group: group,
      target: new SomeLambdaTarget(func, role),
    });
    const schedule2 = new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      group: group,
      target: new SomeLambdaTarget(func, role),
    });

    expect(schedule1.group).toEqual(group);
    expect(schedule2.group).toEqual(group);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        GroupName: `${props.groupName}`,
      },
    });
  });

  test('adds schedules to the group with unspecified name', () => {
    const group = new Group(stack, 'TestGroup', {});
    const role = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const schedule1 = new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      group: group,
      target: new SomeLambdaTarget(func, role),
    });
    const schedule2 = new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      group: group,
      target: new SomeLambdaTarget(func, role),
    });

    expect(schedule1.group).toEqual(group);
    expect(schedule2.group).toEqual(group);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        GroupName: group.groupName,
      },
    });
  });

  test('grantReadSchedules', () => {
    // GIVEN
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);

    const user = new iam.User(stack, 'User');

    // WHEN
    group.grantReadSchedules(user);
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'scheduler:GetSchedule',
              'scheduler:ListSchedules',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':scheduler:us-east-1:123456789012:schedule/MyGroup/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantWriteSchedules', () => {
    // GIVEN
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);

    const user = new iam.User(stack, 'User');

    // WHEN
    group.grantWriteSchedules(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'scheduler:CreateSchedule',
              'scheduler:UpdateSchedule',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':scheduler:us-east-1:123456789012:schedule/MyGroup/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantDeleteSchedules', () => {
    // GIVEN
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);

    const user = new iam.User(stack, 'User');

    // WHEN
    group.grantDeleteSchedules(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'scheduler:DeleteSchedule',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':scheduler:us-east-1:123456789012:schedule/MyGroup/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('Target Error Metrics', () => {
    // GIVEN
    const props: GroupProps = {
      groupName: 'MyGroup',
    };
    const group = new Group(stack, 'TestGroup', props);

    // WHEN
    const metricTargetErrors = group.metricTargetErrors({
      period: Duration.minutes(1),
    });

    new cw.Alarm(stack, 'GroupTargetErrorAlarm', {
      metric: metricTargetErrors,
      evaluationPeriods: 1,
      threshold: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Dimensions: Match.arrayWith([
        Match.objectLike({
          Name: 'ScheduleGroup',
          Value: 'MyGroup',
        }),
      ]),
      MetricName: 'TargetErrorCount',
      Namespace: 'AWS/Scheduler',
    });
  });
});
