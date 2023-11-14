import { App, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ContextAttribute, IScheduleTarget, ScheduleExpression, ScheduleTargetConfig, ScheduleTargetInput } from '../lib';
import { Schedule } from '../lib/schedule';

class SomeLambdaTarget implements IScheduleTarget {
  public constructor(private readonly fn: lambda.IFunction, private readonly input: ScheduleTargetInput) {
  }

  public bind(): ScheduleTargetConfig {
    return {
      arn: this.fn.functionArn,
      input: this.input,
      role: iam.Role.fromRoleArn(this.fn, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole'),
    };
  }
}

describe('schedule target input', () => {
  let stack: Stack;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app);
    func = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      tracing: lambda.Tracing.PASS_THROUGH,
    });
  });

  test('create an input from text', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func, ScheduleTargetInput.fromText('test')),
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
      target: new SomeLambdaTarget(func, ScheduleTargetInput.fromText(stack.account)),
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
    const input = ScheduleTargetInput.fromObject({
      test: 'test',
    });
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func, input),
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
    const input = ScheduleTargetInput.fromObject({
      test: stack.account,
    });
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func, input),
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
    const input = ScheduleTargetInput.fromText(`Test=${ContextAttribute.scheduleArn}`);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func, input),
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
    const input = ScheduleTargetInput.fromObject({
      arn: ContextAttribute.scheduleArn,
      att: ContextAttribute.attemptNumber,
      xid: ContextAttribute.executionId,
      tim: ContextAttribute.scheduledTime,
      cus: ContextAttribute.fromName('escapehatch'),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func, input),
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

  test('can override target input', () => {
    // WHEN
    const input = ScheduleTargetInput.fromText('Original Input');
    new Schedule(stack, 'TestSchedule', {
      schedule: expr,
      target: new SomeLambdaTarget(func, input),
      targetOverrides: {
        input: ScheduleTargetInput.fromText('Overridden Input'),
      },
      enabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
      Target: {
        Input: '"Overridden Input"',
      },
    });
  });
});
