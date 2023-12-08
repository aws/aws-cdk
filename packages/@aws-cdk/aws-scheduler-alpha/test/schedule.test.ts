import { App, Stack, Duration } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IScheduleTarget, Schedule, ScheduleTargetConfig } from '../lib';
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

  test('returns metric for delivery of failed invocations to DLQ', () => {
    // WHEN
    const metric = Schedule.metricAllFailedToBeSentToDLQ();

    // THEN
    expect(metric.namespace).toEqual('AWS/Scheduler');
    expect(metric.metricName).toEqual('InvocationsFailedToBeSentToDeadLetterCount');
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
            Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
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
    ])('schedule can set startDate and endDate', (timeFrame) => {
      new Schedule(stack, 'TestSchedule', {
        schedule: expr,
        target: new SomeLambdaTarget(func, role),
        startDate: timeFrame.StartDate,
        endDate: timeFrame.EndDate,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
        ...timeFrame,
      });
    });

    test.each([
      '2023-01-01',
      '2023-10-01T00:00:00.000+09:00',
      '2023-10-01T00:00:00Z',
    ])('throw error when startDate is invalid format', (startDate) => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          startDate,
        });
      }).toThrow(`startDate needs to follow the format yyyy-MM-ddTHH:mm:ss.SSSZ but got ${startDate}`);
    });

    test.each([
      '2023-01-01',
      '2023-10-01T00:00:00.000+09:00',
      '2023-10-01T00:00:00Z',
    ])('throw error when endDate is invalid format', (endDate) => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          endDate,
        });
      }).toThrow(`endDate needs to follow the format yyyy-MM-ddTHH:mm:ss.SSSZ but got ${endDate}`);
    });

    test.each([
      { startDate: '2023-10-01T00:00:00.000Z', endDate: '2023-10-01T00:00:00.000Z' },
      { startDate: '2023-10-01T00:00:00.000Z', endDate: '2023-09-01T00:00:00.000Z' },
    ])('throw error when startDate does not come before endDate', ({ startDate, endDate }) => {
      expect(() => {
        new Schedule(stack, 'TestSchedule', {
          schedule: expr,
          target: new SomeLambdaTarget(func, role),
          startDate,
          endDate,
        });
      }).toThrow(`startDate must come before the endDate but got startDate: ${startDate}, endDate: ${endDate}`);
    });
  });
});