import { App, Duration, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IScheduleTarget, ScheduleExpression, ScheduleTargetConfig } from '../lib';
import { Schedule } from '../lib/schedule';

class SomeLambdaTarget implements IScheduleTarget {
  public constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(): ScheduleTargetConfig {
    return {
      arn: this.fn.functionArn,
      retryPolicy: {
        maximumEventAgeInSeconds: 180,
        maximumRetryAttempts: 10,
      },
      role: iam.Role.fromRoleArn(this.fn, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole'),
    };
  }
}

describe('schedule target retry policy', () => {
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

  test('create a schedule with retry policy', () => {
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: new SomeLambdaTarget(func),
    });
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          RetryPolicy: {
            MaximumEventAgeInSeconds: 180,
            MaximumRetryAttempts: 10,
          },
        },
      },
    });
  });

  test('can override retry policy', () => {
    // WHEN
    new Schedule(stack, 'TestSchedule', {
      schedule: expr,
      target: new SomeLambdaTarget(func),
      targetOverrides: {
        maxEventAge: Duration.seconds(120),
        retryAttempts: 5,
      },
      enabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          RetryPolicy: {
            MaximumEventAgeInSeconds: 120,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('apply maximumEventAge min value validation', () => {
    expect(() => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func),
        targetOverrides: {
          maxEventAge: Duration.seconds(50),
          retryAttempts: 5,
        },
        enabled: false,
      });
    }).toThrow(/maximumEventAgeInSeconds must be between 60 and 86400, got 50/);
  });

  test('apply maximumEventAge max value validation', () => {
    expect(() => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func),
        targetOverrides: {
          maxEventAge: Duration.seconds(100000),
          retryAttempts: 5,
        },
        enabled: false,
      });
    }).toThrow(/maximumEventAgeInSeconds must be between 60 and 86400, got 100000/);
  });

  test('apply maximumRetryAttempts min value validation', () => {
    expect(() => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func),
        targetOverrides: {
          maxEventAge: Duration.seconds(120),
          retryAttempts: -1,
        },
        enabled: false,
      });
    }).toThrow(/maximumRetryAttempts must be between 0 and 185, got -1/);
  });

  test('apply maximumRetryAttempts max value validation', () => {
    expect(() => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func),
        targetOverrides: {
          maxEventAge: Duration.seconds(120),
          retryAttempts: 200,
        },
        enabled: false,
      });
    }).toThrow(/maximumRetryAttempts must be between 0 and 185, got 200/);
  });
});
