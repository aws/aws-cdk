import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import { App, Stack, Duration } from '../../core';
import { IScheduleTarget, Schedule, ScheduleTargetConfig, TimeWindow } from '../lib';
import { ScheduleExpression } from '../lib/schedule-expression';

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

describe('Schedule', () => {
  let stack: Stack;
  let func: lambda.IFunction;
  let role: iam.IRole;
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
    role = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');
  });

  test('schedule is enabled by default', () => {
    // WHEN
    new Schedule(stack, 'TestSchedule', {
      schedule: expr,
      target: new SomeLambdaTarget(func, role),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
      State: 'ENABLED',
    });
  });

  test('schedule can be disabled', () => {
    // WHEN
    new Schedule(stack, 'TestSchedule', {
      schedule: expr,
      target: new SomeLambdaTarget(func, role),
      enabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
      State: 'DISABLED',
    });
  });

  test.each([
    ['metricAllThrottled', 'InvocationThrottleCount'],
    ['metricAllErrors', 'TargetErrorCount'],
    ['metricAllAttempts', 'InvocationAttemptCount'],
    ['metricAllTargetThrottled', 'TargetErrorThrottledCount'],
    ['metricAllDropped', 'InvocationDroppedCount'],
    ['metricAllSentToDLQ', 'InvocationsSentToDeadLetterCount'],
    ['metricAllSentToDLQTruncated', 'InvocationsSentToDeadLetterCount_Truncated_MessageSizeExceeded'],

  ])('returns expected metric for %s', (metricMethodName: string, metricName: string) => {
    // WHEN
    const metric = (Schedule as any)[metricMethodName]();

    // THEN
    expect(metric.namespace).toEqual('AWS/Scheduler');
    expect(metric.metricName).toEqual(metricName);
    expect(metric.dimensions).toBeUndefined();
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period).toEqual(Duration.minutes(5));
  });

  test('returns metric for delivery of failed invocations to DLQ for specific error code', () => {
    // WHEN
    const metric = Schedule.metricAllFailedToBeSentToDLQ('test_error_code');

    // THEN
    expect(metric.namespace).toEqual('AWS/Scheduler');
    expect(metric.metricName).toEqual('InvocationsFailedToBeSentToDeadLetterCount_test_error_code');
    expect(metric.dimensions).toBeUndefined();
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period).toEqual(Duration.minutes(5));
  });

  test('returns metric for delivery of failed invocations to DLQ with no error code', () => {
    // WHEN
    const metric = Schedule.metricAllFailedToBeSentToDLQ();

    // THEN
    expect(metric.namespace).toEqual('AWS/Scheduler');
    expect(metric.metricName).toEqual('InvocationsFailedToBeSentToDeadLetterCount');
    expect(metric.dimensions).toBeUndefined();
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period).toEqual(Duration.minutes(5));
  });

  test('returns metric for all errors with provided statistic and period', () => {
    // WHEN
    const metric = Schedule.metricAllErrors({
      statistic: 'Maximum',
      period: Duration.minutes(1),
    });

    // THEN
    expect(metric.namespace).toEqual('AWS/Scheduler');
    expect(metric.metricName).toEqual('TargetErrorCount');
    expect(metric.dimensions).toBeUndefined();
    expect(metric.statistic).toEqual('Maximum');
    expect(metric.period).toEqual(Duration.minutes(1));
  });

  test('schedule can use customer managed KMS key', () => {
    // GIVEN
    const key = new kms.Key(stack, 'Key');

    // WHEN
    new Schedule(stack, 'TestSchedule', {
      schedule: expr,
      target: new SomeLambdaTarget(func, role),
      key,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  describe('schedule timeFrame', () => {
    test.each([
      { StartDate: '2023-04-15T06:20:00.000Z', EndDate: '2023-10-01T00:00:00.000Z' },
      { StartDate: '2023-04-15T06:25:00.000Z' },
      { EndDate: '2023-10-01T00:00:00.000Z' },
    ])('schedule can set start and end', (timeFrame) => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func, role),
        start: timeFrame.StartDate ? new Date(timeFrame.StartDate) : undefined,
        end: timeFrame.EndDate ? new Date(timeFrame.EndDate) : undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        ...timeFrame,
      });
    });

    test.each([
      { start: '2023-10-01T00:00:00.000Z', end: '2023-10-01T00:00:00.000Z' },
      { start: '2023-10-01T00:00:00.000Z', end: '2023-09-01T00:00:00.000Z' },
    ])('throw error when start does not come before end', ({ start, end }) => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          start: new Date(start),
          end: new Date(end),
        });
      }).toThrow(`start must precede end, got start: ${start}, end: ${end}`);
    });
  });

  describe('flexibleTimeWindow', () => {
    test('flexibleTimeWindow mode is set to OFF by default', () => {
      // WHEN
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func, role),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
      });
    });

    test('flexibleTimeWindow mode can be set to FLEXIBLE', () => {
      // WHEN
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func, role),
        timeWindow: TimeWindow.flexible(Duration.minutes(1440)),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        FlexibleTimeWindow: {
          Mode: 'FLEXIBLE',
          MaximumWindowInMinutes: 1440,
        },
      });
    });

    test('throw error when maximumWindowInMinutes is greater than 1440', () => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          timeWindow: TimeWindow.flexible(Duration.minutes(1441)),
        });
      }).toThrow('The provided duration must be between 1 minute and 1440 minutes, got 1441');
    });

    test('throw error when maximumWindowInMinutes is less than 1', () => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          timeWindow: TimeWindow.flexible(Duration.minutes(0)),
        });
      }).toThrow('The provided duration must be between 1 minute and 1440 minutes, got 0');
    });

    test('throw error when scheduleName exceeds 64 characters', () => {
      const name = 'an-extremely-unnecessarily-long-name-exceeding-64-characters-in-length';
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          scheduleName: name,
        });
      }).toThrow(`scheduleName cannot be longer than 64 characters, got: ${name.length}`);
    });

    test('schedule with description', () => {
      // WHEN
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func, role),
        description: 'test description',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        Description: 'test description',
      });
    });
  });
});
