import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';

test('.metricXxx() methods can be used to obtain Metrics for the canary', () => {
  // GIVEN
  const stack = new Stack(new App(), 'canaries');

  const canary = new synthetics.Canary(stack, 'mycanary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // WHEN
  const metricSuccess = canary.metricSuccessPercent();
  const metricFailed = canary.metricFailed();
  const metricDuration = canary.metricDuration();

  // THEN
  expect(metricSuccess).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'SuccessPercent',
    statistic: 'Average',
  });

  expect(metricFailed).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Failed',
    statistic: 'Average',
  });

  expect(metricDuration).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Duration',
    statistic: 'Average',
  });
});

test('Metric can specify statistic', () => {
  // GIVEN
  const stack = new Stack(new App(), 'canaries');

  const canary = new synthetics.Canary(stack, 'mycanary', {
    test: synthetics.Test.custom({
      handler: 'index.handler',
      code: synthetics.Code.fromInline('foo'),
    }),
  });

  // WHEN
  const metric = canary.metricFailed({ statistic: 'Sum' });

  // THEN
  expect(metric).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Failed',
    statistic: 'Sum',
  });
});
