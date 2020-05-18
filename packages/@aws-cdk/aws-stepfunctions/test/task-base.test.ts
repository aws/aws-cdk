import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';

describe('Task base', () => {
  test('instantiate a concrete implementation', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new ConcreteTask(stack, 'my-task', {
      comment: 'my exciting task',
      heartbeat: cdk.Duration.seconds(10),
      timeout: cdk.Duration.minutes(10),
    });

    // THEN
    expect(render(task)).toEqual({
      StartAt: 'my-task',
      States: {
        'my-task': {
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

  test('add catch configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new ConcreteTask(stack, 'my-task');
    const failure = new sfn.Fail(stack, 'failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });

    // WHEN
    task.addCatch(failure);

    // THEN
    expect(render(task)).toEqual({
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

  test('add retry configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new ConcreteTask(stack, 'my-task');

    // WHEN
    task.addRetry({ errors: ['HTTPError'], maxAttempts: 2 })
      .addRetry(); // adds default retry

    // THEN
    expect(render(task)).toEqual({
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

  test('add a next state to the task in the chain', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new ConcreteTask(stack, 'mytask');

    // WHEN
    task.next(new sfn.Pass(stack, 'passState'));

    // THEN
    expect(render(task)).toEqual({
      StartAt: 'mytask',
      States: {
        mytask: {
          Next: 'passState',
          Type: 'Task',
          Resource: 'my-resource',
          Parameters: { MyParameter: 'myParameter' },
        },
        passState: { Type: 'Pass', End: true },
      },
    });
  });

  test('get named metric for this task', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new ConcreteTask(stack, 'mytask', {});

    // WHEN
    const metric = stack.resolve(task.metric('my metric'));

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'my metric',
      statistic: 'Sum'});
  });

  test('add metric for task state run time', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixSingular: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricRunTime());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'RunTime',
      statistic: 'Average',
    });
  });

  test('add metric for task schedule time', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixSingular: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricScheduleTime());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'ScheduleTime',
      statistic: 'Average',
    });
  });

  test('add metric for time between task being scheduled to closing', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixSingular: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricTime());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'Time',
      statistic: 'Average',
    });
  });

  test('add metric for number of times the task is scheduled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricScheduled());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'Scheduled',
      statistic: 'Sum',
    });
  });

  test('add metric for number of times the task times out', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricTimedOut());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'TimedOut',
      statistic: 'Sum',
    });
  });

  test('add metric for number of times the task was started', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricStarted());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'Started',
      statistic: 'Sum',
    });
  });

  test('add metric for number of times the task succeeded', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricSucceeded());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'Succeeded',
      statistic: 'Sum',
    });
  });

  test('add metric for number of times the task failed', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricFailed());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'Failed',
      statistic: 'Sum',
    });
  });

  test('add metric for number of times the metrics heartbeat timed out', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskMetrics: sfn.TaskMetricsConfig = { metricPrefixPlural: '' };
    const task = new ConcreteTask(stack, 'mytask', { metrics: taskMetrics });

    // WHEN
    const metric = stack.resolve(task.metricHeartbeatTimedOut());

    // THEN
    expect(metric).toStrictEqual({
      period: {
        amount: 5,
        unit: {
          label: 'minutes',
          inMillis: 60000,
        },
      },
      namespace: 'AWS/States',
      metricName: 'HeartbeatTimedOut',
      statistic: 'Sum',
    });
  });

  test('metrics must be configured to use metric* APIs', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new ConcreteTask(stack, 'mytask', {});

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

function render(sm: sfn.IChainable) {
  return new cdk.Stack().resolve(
    new sfn.StateGraph(sm.startState, 'Test Graph').toGraphJson(),
  );
}

interface ConcreteTaskProps extends sfn.TaskStateBaseProps {
  readonly metrics?: sfn.TaskMetricsConfig;
}

class ConcreteTask extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: cdk.Construct, id: string, props: ConcreteTaskProps = {}) {
    super(scope, id, props);
    this.taskMetrics = props.metrics;
  }

  protected renderTask(): any {
    return {
      Resource: 'my-resource',
      Parameters: sfn.FieldUtils.renderObject({
        MyParameter: 'myParameter',
      }),
    };
  }
}
