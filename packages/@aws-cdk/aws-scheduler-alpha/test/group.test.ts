import { Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnScheduleGroup } from 'aws-cdk-lib/aws-scheduler';
import { Schedule } from '../lib';
import { Group, GroupProps } from '../lib/group';

describe('Schedule Group', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
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

    const schedule1 = new Schedule(stack, 'Schedule1');
    const schedule2 = new Schedule(stack, 'Schedule2');

    group.addSchedules(schedule1, schedule2);

    expect(schedule1.group).toEqual(group);
    expect(schedule2.group).toEqual(group);
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
                  ':scheduler:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':schedule/MyGroup/*',
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
                  ':scheduler:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':schedule/MyGroup/*',
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
                  ':scheduler:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':schedule/MyGroup/*',
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