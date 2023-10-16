import { Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
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

  beforeEach(() => {
    app = new App();
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
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
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
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
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

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
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
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
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
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
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

  test('throws when step function is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedStateMachine = sfn.StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', `arn:aws:states:us-east-1:${anotherAccountId}:stateMachine/MyStateMachine`);
    const stepFunctionTarget = new StepFunctionsStartExecution(importedStateMachine, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Both the schedule and the stateMachine must be in the same account./);
  });

  test('throws when step function is imported from different region', () => {
    const anotherRegion = 'eu-central-1';
    const importedStateMachine = sfn.StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', `arn:aws:states:${anotherRegion}:123456789012:stateMachine/MyStateMachine`);
    const stepFunctionTarget = new StepFunctionsStartExecution(importedStateMachine, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Both the schedule and the stateMachine must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', `arn:aws:iam::${anotherAccountId}:role/someRole`);

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
            },
          },
        ],
      },
      Queues: [
        {
          Ref: 'DummyDeadLetterQueueCEBF3463',
        },
      ],
    });
  });

  test('throws when adding permissions to DLQ from a different region', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'eu-west-2',
      },
    });
    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue');

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: queue,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('does not create a queue policy when DLQ is created in a different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });

    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
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
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
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

  test('throws when retry policy max age is less than 15 minutes', () => {
    const stepFunctionTarget = new StepFunctionsStartExecution(stepFunction, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: stepFunctionTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
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
