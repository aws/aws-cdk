import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';

describe('Task state', () => {
  test('add metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metric('my-metric');

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'my-metric',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add failed metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricFailed();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'Failed',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add heartbeat timeout metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricHeartbeatTimedOut();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'HeartbeatTimedOut',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add runtime metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricRunTime();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'RunTime',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Average',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add schedule time metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricScheduleTime();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'ScheduleTime',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Average',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add scheduled metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricScheduled();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'Scheduled',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add started metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricStarted();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'Started',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add failed metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricSucceeded();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'Succeeded',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add time metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricTime();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'Time',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Average',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

  test('add timed out metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new sfn.Task(stack, 'my-task', {
      task: new FakeTask(),
    });

    // WHEN
    const metric = task.metricTimedOut();

    // THEN
    expect(stack.resolve(metric)).toEqual({
      metricName: 'TimedOut',
      namespace: 'AWS/States',
      period: {
        amount: 5,
        unit: {
          inMillis: 60000,
          label: 'minutes',
        },
      },
      statistic: 'Sum',
      dimensions: {
        Arn: 'resource',
      },
    });
  });

});

class FakeTask implements sfn.IStepFunctionsTask {
  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: 'resource',
      metricPrefixSingular: '',
      metricPrefixPlural: '',
      metricDimensions: { Arn: 'resource' },
    };
  }
}