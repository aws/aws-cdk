import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Add metric success percent', () => {
  // GIVEN
  const canary = new synthetics.Canary(stack, 'mycanary', {
  });

  // WHEN
  const metric = canary.metricSuccessPercent();

  // THEN
  expect(metric).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'SuccessPercent',
    statistic: 'Average',
  });
});

test('Add metric failed', () => {
  // GIVEN
  const canary = new synthetics.Canary(stack, 'mycanary', {
  });

  // WHEN
  const metric = canary.metricFailed();

  // THEN
  expect(metric).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Failed',
    statistic: 'Average',
  });
});

test('Add metric duration', () => {
  // GIVEN
  const canary = new synthetics.Canary(stack, 'mycanary', {
  });

  // WHEN
  const metric = canary.metricDuration();

  // THEN
  expect(metric).toEqual({
    period: { amount: 5, unit: { inMillis: 60000, label: 'minutes' } },
    dimensions: { CanaryName: canary.canaryName },
    namespace: 'CloudWatchSynthetics',
    metricName: 'Duration',
    statistic: 'Average',
  });
});
