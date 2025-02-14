import { Group, Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StepFunctionsStartExecution } from '../lib';

describe('stepfunction start execution', () => {
  let app: App;
  let stack: Stack;
  let stepFunction: sfn.StateMachine;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTargetc174eeEF9C09F9';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    stepFunction = new sfn.StateMachine(stack, 'MyStateMachine', {
      definition: new sfn.Pass(stack, 'MyPass'),
    });
  });

  test('creates IAM role and IAM policy for step function target in the same account', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyStateMachine6C968CA5',
          },
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
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

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyStateMachine6C968CA5',
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {});

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {});
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: stepFunctionTarget,
      group,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM policy for imported state machine in the same account', () => {
    const importedStateMachineArn = 'arn:aws:states:us-east-1:123456789012:stateMachine/MyStateMachine';
    const importedStateMachine = sfn.StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', importedStateMachineArn);

    const stepFunctionTarget = new StepFunctionsStartExecution(importedStateMachine, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedStateMachineArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget732a9aEBCC8E18', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: importedStateMachineArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget732a9aEBCC8E18' }],
    });
  });

  test('creates IAM policy for imported role for step function in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyStateMachine6C968CA5',
          },
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported step function with imported IAM role in the same account', () => {
    const importedStateMachineArn = 'arn:aws:states:us-east-1:123456789012:stateMachine/MyStateMachine';
    const importedStateMachine = sfn.StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', importedStateMachineArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const stepFunctionTarget = new StepFunctionsStartExecution(importedStateMachine, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedStateMachineArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: importedStateMachineArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
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

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
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

  test('renders expected retry policy', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyStateMachine6C968CA5',
          },
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
