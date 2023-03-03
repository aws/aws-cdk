import { Metric } from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { FakeTask } from './private/fake-task';
import { renderGraph } from './private/render-util';
import * as sfn from '../lib';

describe('Task base', () => {
  let stack: cdk.Stack;
  let task: sfn.TaskStateBase;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    task = new FakeTask(stack, 'my-task', {
      metrics: {
        metricPrefixPlural: '',
        metricPrefixSingular: '',
      },
    });
  });
  test('instantiate a concrete implementation with properties', () => {
    // WHEN
    task = new FakeTask(stack, 'my-exciting-task', {
      comment: 'my exciting task',
      heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
      taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
    });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-exciting-task',
      States: {
        'my-exciting-task': {
          End: true,
          Type: 'Task',
          Comment: 'my exciting task',
          TimeoutSeconds: 600,
          HeartbeatSeconds: 10,
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
      },
    });
  });

  test('instantiate a concrete implementation with credentials of a specified role', () => {
    // WHEN
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/example-role');
    task = new FakeTask(stack, 'my-exciting-task', {
      comment: 'my exciting task',
      heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
      taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
      credentials: {
        role: sfn.TaskRole.fromRole(role),
      },
    });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-exciting-task',
      States: {
        'my-exciting-task': {
          End: true,
          Type: 'Task',
          Comment: 'my exciting task',
          TimeoutSeconds: 600,
          HeartbeatSeconds: 10,
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
          Credentials: { RoleArn: 'arn:aws:iam::123456789012:role/example-role' },
        },
      },
    });
  });

  test('instantiate a concrete implementation with credentials of json expression roleArn', () => {
    // WHEN
    task = new FakeTask(stack, 'my-exciting-task', {
      comment: 'my exciting task',
      heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
      taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
      credentials: {
        role: sfn.TaskRole.fromRoleArnJsonPath('$.Input.RoleArn'),
      },
    });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-exciting-task',
      States: {
        'my-exciting-task': {
          End: true,
          Type: 'Task',
          Comment: 'my exciting task',
          TimeoutSeconds: 600,
          HeartbeatSeconds: 10,
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
          Credentials: { 'RoleArn.$': '$.Input.RoleArn' },
        },
      },
    });
  });

  test('instantiate a concrete implementation with resultSelector', () => {
    // WHEN
    task = new FakeTask(stack, 'my-exciting-task', {
      resultSelector: {
        buz: 'buz',
        baz: sfn.JsonPath.stringAt('$.baz'),
      },
    });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-exciting-task',
      States: {
        'my-exciting-task': {
          End: true,
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
          ResultSelector: {
            'buz': 'buz',
            'baz.$': '$.baz',
          },
        },
      },
    });
  });

  test('add catch configuration', () => {
    // GIVEN
    const failure = new sfn.Fail(stack, 'failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });

    // WHEN
    task.addCatch(failure);

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'my-task': {
          End: true,
          Catch: [{
            ErrorEquals: ['States.ALL'],
            Next: 'failed',
          }],
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
        'failed': {
          Type: 'Fail',
          Error: 'DidNotWork',
          Cause: 'We got stuck',
        },
      },
    });
  });

  test('States.ALL catch appears at end of list', () => {
    // GIVEN
    const httpFailure = new sfn.Fail(stack, 'http', { error: 'HTTP' });
    const otherFailure = new sfn.Fail(stack, 'other', { error: 'Other' });
    const allFailure = new sfn.Fail(stack, 'all');

    // WHEN
    task
      .addCatch(httpFailure, { errors: ['HTTPError'] })
      .addCatch(allFailure)
      .addCatch(otherFailure, { errors: ['OtherError'] });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'all': {
          Type: 'Fail',
        },
        'http': {
          Error: 'HTTP',
          Type: 'Fail',
        },
        'my-task': {
          End: true,
          Catch: [
            {
              ErrorEquals: ['HTTPError'],
              Next: 'http',
            },
            {
              ErrorEquals: ['OtherError'],
              Next: 'other',
            },
            {
              ErrorEquals: ['States.ALL'],
              Next: 'all',
            },
          ],
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
        'other': {
          Error: 'Other',
          Type: 'Fail',
        },
      },
    });
  });

  test('addCatch throws when errors are combined with States.ALL', () => {
    // GIVEN
    const failure = new sfn.Fail(stack, 'failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });

    expect(() => task.addCatch(failure, {
      errors: ['States.ALL', 'HTTPError'],
    })).toThrow(/must appear alone/);
  });

  test('add retry configuration', () => {
    // WHEN
    task.addRetry({ errors: ['HTTPError'], maxAttempts: 2 })
      .addRetry(); // adds default retry

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'my-task': {
          End: true,
          Retry: [
            {
              ErrorEquals: ['HTTPError'],
              MaxAttempts: 2,
            },
            {
              ErrorEquals: ['States.ALL'],
            },
          ],
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
      },
    });
  });

  test('States.ALL retry appears at end of list', () => {
    // WHEN
    task
      .addRetry({ errors: ['HTTPError'] })
      .addRetry()
      .addRetry({ errors: ['OtherError'] });

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'my-task': {
          End: true,
          Retry: [
            {
              ErrorEquals: ['HTTPError'],
            },
            {
              ErrorEquals: ['OtherError'],
            },
            {
              ErrorEquals: ['States.ALL'],
            },
          ],
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
      },
    });
  });

  test('addRetry throws when errors are combined with States.ALL', () => {
    expect(() => task.addRetry({
      errors: ['States.ALL', 'HTTPError'],
    })).toThrow(/must appear alone/);
  });

  test('add a next state to the task in the chain', () => {
    // WHEN
    task.next(new sfn.Pass(stack, 'passState'));

    // THEN
    expect(renderGraph(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'my-task': {
          Next: 'passState',
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
        'passState': { Type: 'Pass', End: true },
      },
    });
  });

  test('taskTimeout and heartbeatTimeout specified with a path', () => {
    // WHEN
    task = new FakeTask(stack, 'my-exciting-task', {
      heartbeatTimeout: sfn.Timeout.at('$.heartbeat'),
      taskTimeout: sfn.Timeout.at('$.timeout'),
    });

    // THEN
    expect(renderGraph(task)).toEqual(expect.objectContaining({
      States: {
        'my-exciting-task': expect.objectContaining({
          HeartbeatSecondsPath: '$.heartbeat',
          TimeoutSecondsPath: '$.timeout',
        }),
      },
    }));
  });

  testDeprecated('deprecated props timeout and heartbeat still work', () => {
    // WHEN
    task = new FakeTask(stack, 'my-exciting-task', {
      heartbeat: cdk.Duration.seconds(10),
      timeout: cdk.Duration.minutes(10),
    });

    // THEN
    expect(renderGraph(task)).toEqual(expect.objectContaining({
      States: {
        'my-exciting-task': expect.objectContaining({
          HeartbeatSeconds: 10,
          TimeoutSeconds: 600,
        }),
      },
    }));
  });

  test('get named metric for this task', () => {
    // WHEN
    const metric = task.metric('my-metric');

    // THEN
    verifyMetric(metric, 'my-metric', 'Sum');
  });

  test('add metric for task state run time', () => {
    // WHEN
    const metric = task.metricRunTime();

    // THEN
    verifyMetric(metric, 'RunTime', 'Average');
  });

  test('add metric for task schedule time', () => {
    // WHEN
    const metric = task.metricScheduleTime();

    // THEN
    verifyMetric(metric, 'ScheduleTime', 'Average');
  });

  test('add metric for time between task being scheduled to closing', () => {
    // WHEN
    const metric = task.metricTime();

    // THEN
    verifyMetric(metric, 'Time', 'Average');
  });

  test('add metric for number of times the task is scheduled', () => {
    // WHEN
    const metric = task.metricScheduled();

    // THEN
    verifyMetric(metric, 'Scheduled', 'Sum');
  });

  test('add metric for number of times the task times out', () => {
    // WHEN
    const metric = task.metricTimedOut();

    // THEN
    verifyMetric(metric, 'TimedOut', 'Sum');
  });

  test('add metric for number of times the task was started', () => {
    // WHEN
    const metric = task.metricStarted();

    // THEN
    verifyMetric(metric, 'Started', 'Sum');
  });

  test('add metric for number of times the task succeeded', () => {
    // WHEN
    const metric = task.metricSucceeded();

    // THEN
    verifyMetric(metric, 'Succeeded', 'Sum');
  });

  test('add metric for number of times the task failed', () => {
    // WHEN
    const metric = task.metricFailed();

    // THEN
    verifyMetric(metric, 'Failed', 'Sum');
  });

  test('add metric for number of times the metrics heartbeat timed out', () => {
    // WHEN
    const metric = task.metricHeartbeatTimedOut();

    // THEN
    verifyMetric(metric, 'HeartbeatTimedOut', 'Sum');
  });

  test('metrics must be configured to use metric* APIs', () => {
    // GIVEN
    task = new FakeTask(stack, 'mytask', {});

    // THEN
    expect(() => {
      task.metricFailed();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricHeartbeatTimedOut();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricRunTime();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricScheduleTime();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricScheduled();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricStarted();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricSucceeded();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricTime();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );

    expect(() => {
      task.metricTimedOut();
    }).toThrow(
      'Task does not expose metrics. Use the \'metric()\' function to add metrics.',
    );
  });
});

function verifyMetric(metric: Metric, metricName: string, statistic: string) {
  expect(metric).toEqual(expect.objectContaining({
    namespace: 'AWS/States',
    metricName,
    statistic,
  }));
}
