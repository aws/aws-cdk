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

    const schedule = tasks.Schedule.rate(Duration.minutes(1));

    const createScheduleTask = new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
      scheduleName: 'TestSchedule',
      schedule,
      target: new tasks.EventBridgeSchedulerTarget({
        arn: targetQueue.queueArn,
        role: schedulerRole,
      }),
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
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        Name: 'TestSchedule',
        ScheduleExpression: schedule.expressionString,
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
              Service: 'scheduler.amazonaws.com',
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

  test('default settings - using JSONata', () => {
    const targetQueue = new sqs.Queue(stack, 'TargetQueue');
    schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [targetQueue.queueArn],
    }));

    const schedule = tasks.Schedule.rate(Duration.minutes(1));

    const createScheduleTask = tasks.EventBridgeSchedulerCreateScheduleTask.jsonata(stack, 'createSchedule', {
      scheduleName: 'TestSchedule',
      schedule,
      target: new tasks.EventBridgeSchedulerTarget({
        arn: targetQueue.queueArn,
        role: schedulerRole,
      }),
    });

    new sfn.StateMachine(stack, 'stateMachine', {
      definition: sfn.Chain.start(createScheduleTask),
    });

    expect(stack.resolve(createScheduleTask.toStateJson())).toEqual({
      Type: 'Task',
      QueryLanguage: 'JSONata',
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
      Arguments: {
        ActionAfterCompletion: 'NONE',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        Name: 'TestSchedule',
        ScheduleExpression: schedule.expressionString,
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
              Service: 'scheduler.amazonaws.com',
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

    const testDate = new Date();
    const testEndDate = new Date(testDate.getTime() + 1000 * 60 * 60);

    const schedule = tasks.Schedule.rate(Duration.minutes(1));

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
      schedule,
      timezone: 'UTC',
      enabled: true,
      target: new tasks.EventBridgeSchedulerTarget({
        arn: targetQueue.queueArn,
        role: schedulerRole,
        retryPolicy: {
          maximumRetryAttempts: 2,
          maximumEventAge: Duration.minutes(5),
        },
        deadLetterQueue,
      }),
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
        ScheduleExpression: schedule.expressionString,
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
              Service: 'scheduler.amazonaws.com',
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
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'TargetQueue08AD2B3C',
                'Arn',
              ],
            },
          },
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'SchedulerRole59E73443',
        },
      ],
    });
  });

  test.each([
    tasks.Schedule.rate(Duration.minutes(5)),
    tasks.Schedule.rate(Duration.hours(5)),
    tasks.Schedule.rate(Duration.days(5)),
    tasks.Schedule.cron({ minute: '0', hour: '12' }),
    tasks.Schedule.cron({ minute: '0', hour: '12', day: '29', month: '12' }),
    tasks.Schedule.cron({ minute: '0', hour: '12', day: '29', month: '12', year: '2023' }),
    tasks.Schedule.cron({ minute: '0', hour: '12', weekDay: 'MON' }),
    tasks.Schedule.oneTime(new Date('2023-12-29T11:55:00Z')),
  ])('with schedule', (schedule) => {
    const targetQueue = new sqs.Queue(stack, 'TargetQueue');
    schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [targetQueue.queueArn],
    }));

    const createScheduleTask = new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
      scheduleName: 'TestSchedule',
      schedule,
      target: new tasks.EventBridgeSchedulerTarget({
        arn: targetQueue.queueArn,
        role: schedulerRole,
      }),
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
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        Name: 'TestSchedule',
        ScheduleExpression: schedule.expressionString,
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
  });

  test.each([
    '', 'a'.repeat(65),
  ])('throw error for invalid clientToken length', (clientToken) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        clientToken,
      });
    }).toThrow(`ClientToken must be between 1 and 64 characters long. Got: ${clientToken.length}`);
  });

  test.each(['*', 'abc.'])('throw error for invalid client token format', (clientToken) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        clientToken,
      });
    }).toThrow(`ClientToken must consist of alphanumeric characters, dashes, and underscores only, Got: ${clientToken}`);
  });

  test('throw error for invalid description', () => {
    const invalidDescription = 'a'.repeat(513);
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        description: invalidDescription,
      });
    }).toThrow(`Description must be less than 512 characters long. Got: ${invalidDescription.length}`);
  });

  test.each([
    Duration.minutes(0), Duration.minutes(1441), Duration.seconds(59), Duration.millis(999),
  ])('throw error for invalid flexibleTimeWindow', (flexibleTimeWindow) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        flexibleTimeWindow,
      });
    }).toThrow('FlexibleTimeWindow must be between 1 and 1440 minutes');
  });

  test.each([
    '', 'a'.repeat(65),
  ])('throw error for invalid groupName length', (groupName) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        groupName,
      });
    }).toThrow(`GroupName must be between 1 and 64 characters long. Got: ${groupName.length}`);
  });

  test.each(['*', 'abc['])('throw error for invalid groupName format', (groupName) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        groupName,
      });
    }).toThrow(`GroupName must consist of alphanumeric characters, dashes, underscores, and periods only, Got: ${groupName}`);
  });

  test.each(['', 'a'.repeat(51)])('throw error for invalid timezone length', (timezone) => {
    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        timezone,
      });
    }).toThrow(`Timezone must be between 1 and 50 characters long. Got: ${timezone.length}`);
  });

  test('throw error for bigger start date than end date', () => {
    const testDate = new Date();
    const testEndDate = new Date(testDate.getTime() - 1000 * 60 * 60);

    expect(() => {
      new tasks.EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule', {
        scheduleName: 'TestSchedule',
        schedule: tasks.Schedule.rate(Duration.minutes(1)),
        target: new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
        }),
        startDate: testDate,
        endDate: testEndDate,
      });
    }).toThrow('\'startDate\' must be before \'endDate\'');
  });

  describe('EventBridgeSchedulerTarget', () => {
    test.each([-1, 0.1, 186])('throw error for invalid maximumRetryAttempts %s', (maximumRetryAttempts) => {
      expect(() => {
        new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
          retryPolicy: {
            maximumRetryAttempts,
            maximumEventAge: Duration.minutes(5),
          },
        });
      }).toThrow(`MaximumRetryAttempts must be an integer between 0 and 185, got ${maximumRetryAttempts}`);
    });

    test.each([
      Duration.millis(1),
      Duration.seconds(59),
      Duration.seconds(86401),
    ])('throw error for invalid maximumEventAge %s', (maximumEventAge) => {
      expect(() => {
        new tasks.EventBridgeSchedulerTarget({
          arn: 'arn:aws:sqs:us-east-1:123456789012:queue-name',
          role: schedulerRole,
          retryPolicy: {
            maximumRetryAttempts: 2,
            maximumEventAge,
          },
        });
      }).toThrow('MaximumEventAgeInSeconds must be between 60 and 86400 seconds');
    });
  });
});
