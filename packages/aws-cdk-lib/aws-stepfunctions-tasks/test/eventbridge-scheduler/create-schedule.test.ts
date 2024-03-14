import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as scheduler from '../../../aws-scheduler';
import * as sqs from '../../../aws-sqs';
import * as sfn from '../../../aws-stepfunctions';
import * as tasks from '../../../aws-stepfunctions-tasks';
import { Duration, RemovalPolicy, Stack } from '../../../core';

describe('Create Schedule', () => {
  let stack: Stack;
  let schedulerRole: iam.Role;

  beforeEach(() => {
    stack = new Stack();
    schedulerRole = new iam.Role(stack, 'SchedulerRole', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });
  });

  test('default settings', () => {
    const targetQueue = new sqs.Queue(stack, 'TargetQueue');
    schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [targetQueue.queueArn],
    }));

    const createScheduleTask = new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
      scheduleName: 'TestSchedule',
      scheduleExpression: 'rate(1 minute)',
      targetArn: targetQueue.queueArn,
      role: schedulerRole,
    });

    new sfn.StateMachine(stack, 'stateMachine', {
      definition: sfn.Chain.start(createScheduleTask),
    });

    expect(stack.resolve(createScheduleTask.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:scheduler:createSchedule',
          ],
        ],
      },
      End: true,
      Parameters: {
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        Name: 'TestSchedule',
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'TargetQueue08AD2B3C',
              'Arn',
            ],
          },
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRole59E73443',
              'Arn',
            ],
          },
        },
      },
    });
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: {
                'Fn::FindInMap': [
                  'ServiceprincipalMap',
                  {
                    Ref: 'AWS::Region',
                  },
                  'states',
                ],
              },
            },
          },
        ],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'scheduler:CreateSchedule',
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
                  ':schedule/default/TestSchedule',
                ],
              ],
            },
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'SchedulerRole59E73443',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'stateMachineRole64DF9B42',
        },
      ],
    });
  });

  test('with all settings', () => {
    const kmsKey = new kms.Key(stack, 'Key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const scheduleGroup = new scheduler.CfnScheduleGroup(stack, 'ScheduleGroup', {
      name: 'TestGroup',
    });
    const targetQueue = new sqs.Queue(stack, 'TargetQueue');
    const deadLetterQueue = new sqs.Queue(stack, 'DeadLetterQueue');

    schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [targetQueue.queueArn],
    }));
    schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['kms:Decrypt'],
      resources: [kmsKey.keyArn],
    }));

    const testDate = new Date();
    const testEndDate = new Date(testDate.getTime() + 1000 * 60 * 60);

    const createScheduleTask = new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
      scheduleName: 'TestSchedule',
      actionAfterCompletion: tasks.ActionAfterCompletion.NONE,
      clientToken: 'testToken',
      description: 'Testdescription',
      startDate: testDate,
      endDate: testEndDate,
      flexibleTimeWindow: Duration.minutes(5),
      groupName: scheduleGroup.ref,
      kmsKey,
      scheduleExpression: 'rate(1 minute)',
      timezone: 'UTC',
      enabled: true,
      targetArn: targetQueue.queueArn,
      role: schedulerRole,
      retryPolicy: {
        maximumRetryAttempts: 2,
        maximumEventAge: Duration.minutes(5),
      },
      deadLetterQueue,
    });

    new sfn.StateMachine(stack, 'stateMachine', {
      definition: sfn.Chain.start(createScheduleTask),
    });

    expect(stack.resolve(createScheduleTask.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:scheduler:createSchedule',
          ],
        ],
      },
      End: true,
      Parameters: {
        ActionAfterCompletion: 'NONE',
        ClientToken: 'testToken',
        Description: 'Testdescription',
        EndDate: testEndDate.toISOString(),
        FlexibleTimeWindow: {
          Mode: 'FLEXIBLE',
          MaximumWindowInMinutes: 5,
        },
        GroupName: {
          Ref: 'ScheduleGroup',
        },
        KmsKeyArn: {
          'Fn::GetAtt': [
            'Key961B73FD',
            'Arn',
          ],
        },
        Name: 'TestSchedule',
        ScheduleExpression: 'rate(1 minute)',
        ScheduleExpressionTimezone: 'UTC',
        StartDate: testDate.toISOString(),
        State: 'ENABLED',
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'TargetQueue08AD2B3C',
              'Arn',
            ],
          },
          DeadLetterConfig: {
            Arn: {
              'Fn::GetAtt': [
                'DeadLetterQueue9F481546',
                'Arn',
              ],
            },
          },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 300,
            MaximumRetryAttempts: 2,
          },
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRole59E73443',
              'Arn',
            ],
          },
        },
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: {
                'Fn::FindInMap': [
                  'ServiceprincipalMap',
                  {
                    Ref: 'AWS::Region',
                  },
                  'states',
                ],
              },
            },
          },
        ],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'scheduler:CreateSchedule',
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
                  ':schedule/',
                  {
                    Ref: 'ScheduleGroup',
                  },
                  '/TestSchedule',
                ],
              ],
            },
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'SchedulerRole59E73443',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'stateMachineRole64DF9B42',
        },
      ],
    });
  });

  test.each([
    '', 'a'.repeat(65),
  ])('throw error for invalid clientToken', (clientToken) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        scheduleExpression: 'rate(1 minute)',
        targetArn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
        role: schedulerRole,
        clientToken,
      });
    }).toThrow(`ClientToken must be between 1 and 64 characters long. Got: ${clientToken.length}`);
  });

  test('throw error for invalid description', () => {
    const invalidDescription = 'a'.repeat(513);
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        scheduleExpression: 'rate(1 minute)',
        targetArn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
        role: schedulerRole,
        description: invalidDescription,
      });
    }).toThrow(`Description must be less than 512 characters long. Got: ${invalidDescription.length}`);
  });

  test.each([
    Duration.minutes(0), Duration.minutes(1441),
  ])('throw error for invalid flexibleTimeWindow', (flexibleTimeWindow) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        scheduleExpression: 'rate(1 minute)',
        targetArn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
        role: schedulerRole,
        flexibleTimeWindow,
      });
    }).toThrow('FlexibleTimeWindow must be between 1 and 1440 minutes');
  });

  test.each([
    '', 'a'.repeat(65),
  ])('throw error for invalid groupName', (groupName) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        scheduleExpression: 'rate(1 minute)',
        targetArn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
        role: schedulerRole,
        groupName,
      });
    }).toThrow(`GroupName must be between 1 and 64 characters long. Got: ${groupName.length}`);
  });
});
