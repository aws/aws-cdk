import { Metric } from '@aws-cdk/aws-cloudwatch';
import { StateTransitionMetric } from '../lib';

describe('State Transition Metrics', () => {
  test('add a named state transition metric', () => {
    // WHEN
    const metric = StateTransitionMetric.metric('my-metric');

    // THEN
    verifyTransitionMetric(metric, 'my-metric', 'Average');
  });

  test('metric for available state transitions.', () => {
    // WHEN
    const metric = StateTransitionMetric.metricProvisionedBucketSize();

    // THEN
    verifyTransitionMetric(metric, 'ProvisionedBucketSize', 'Average');
  });

  test('metric for provisioned steady-state execution rate', () => {
    // WHEN
    const metric = StateTransitionMetric.metricProvisionedRefillRate();

    // THEN
    verifyTransitionMetric(metric, 'ProvisionedRefillRate', 'Average');
  });

  test('metric for state-transitions per second', () => {
    // WHEN
    const metric = StateTransitionMetric.metricConsumedCapacity();

    // THEN
    verifyTransitionMetric(metric, 'ConsumedCapacity', 'Average');
  });

  test('metric for the number of throttled state transitions', () => {
    // WHEN
    const metric = StateTransitionMetric.metricThrottledEvents();

    // THEN
    verifyTransitionMetric(metric, 'ThrottledEvents', 'Sum');
  });
});

function verifyTransitionMetric(metric: Metric, metricName: string, statistic: string) {
  expect(metric).toEqual(expect.objectContaining({
    dimensions: { ServiceMetric: 'StateTransition' },
    namespace: 'AWS/States',
    metricName,
    statistic,
  }));
}
