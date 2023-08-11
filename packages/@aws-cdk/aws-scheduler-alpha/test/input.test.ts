import { App, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ContextAttribute, ScheduleExpression, ScheduleTargetInput } from '../lib';
import { Schedule } from '../lib/private';
import { targets } from '../lib/target';

describe('schedule target input', () => {
  let stack: Stack;
  let role: iam.IRole;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app);
    func = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      tracing: lambda.Tracing.PASS_THROUGH,
    });
  });

  test('create an input from text', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new targets.LambdaInvoke(func, {
        input: ScheduleTargetInput.fromText('test'),
      }),
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
      target: new targets.LambdaInvoke(func, {
        input: ScheduleTargetInput.fromText(stack.account),
      }),
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
      target: new targets.LambdaInvoke(func, {
        role,
        input: ScheduleTargetInput.fromObject({
          test: 'test',
        }),
      }),
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
      target: new targets.LambdaInvoke(func, {
        input: ScheduleTargetInput.fromObject({
          test: stack.account,
        }),
      }),
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
      target: new targets.LambdaInvoke(func, {
        input: ScheduleTargetInput.fromText(`Test=${ContextAttribute.scheduleArn}`),
      }),
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
      target: new targets.LambdaInvoke(func, {
        input: ScheduleTargetInput.fromObject({
          arn: ContextAttribute.scheduleArn,
          att: ContextAttribute.attemptNumber,
          xid: ContextAttribute.executionId,
          tim: ContextAttribute.scheduledTime,
          cus: ContextAttribute.fromName('escapehatch'),
        }),
      } ),
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
