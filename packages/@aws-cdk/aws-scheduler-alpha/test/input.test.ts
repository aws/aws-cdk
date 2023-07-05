import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ContextAttribute, ScheduleExpression, ScheduleTargetInput } from '../lib';
import { Schedule, targets } from '../lib/private';

describe('schedule target input', () => {
  let stack: Stack;
  let role: iam.IRole;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    stack = new Stack();
    role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/johndoe');
    func = lambda.Function.fromFunctionArn(stack, 'Function', 'arn:aws:lambda:us-east-1:123456789012:function/somefunc');
  });

  test('create an input from text', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromText('test'),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: '"test"',
        },
      },
    });
  });

  test('create an input from text with a ref inside', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromText(stack.account),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: {
            'Fn::Join': ['', ['"', { Ref: 'AWS::AccountId' }, '"']],
          },
        },
      },
    });
  });

  test('create an input from object', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromObject({
          test: 'test',
        }),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: '{"test":"test"}',
        },
      },
    });
  });

  test('create an input from object with a ref', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromObject({
          test: stack.account,
        }),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: {
            'Fn::Join': ['', [
              '{"test":"',
              { Ref: 'AWS::AccountId' },
              '"}',
            ]],
          },
        },
      },
    });
  });

  test('create an input with fromText with ContextAttribute', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromText(`Test=${ContextAttribute.scheduleArn}`),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: '"Test=<aws.scheduler.schedule-arn>"',
        },
      },
    });
  });

  test('create an input with fromObject with ContextAttribute', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke({
        role,
        input: ScheduleTargetInput.fromObject({
          arn: ContextAttribute.scheduleArn,
          att: ContextAttribute.attemptNumber,
          xid: ContextAttribute.executionId,
          tim: ContextAttribute.scheduledTime,
          cus: ContextAttribute.fromName('escapehatch'),
        }),
      }, func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Input: '{"arn":"<aws.scheduler.schedule-arn>",' +
            '"att":"<aws.scheduler.attempt-number>",' +
            '"xid":"<aws.scheduler.execution-id>",' +
            '"tim":"<aws.scheduler.scheduled-time>",' +
            '"cus":"<aws.scheduler.escapehatch>"}',
        },
      },
    });
  });
});
