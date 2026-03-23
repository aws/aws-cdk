import { LambdaMetrics } from '../../lib/services/aws-lambda/metrics.generated';

test('statistic can be overridden via MetricOptions', () => {
  const metrics = new LambdaMetrics.FunctionNameMetrics({
    functionName: 'my-function',
  });

  // Default statistic for Duration is Average
  const defaultMetric = metrics.metricDuration();
  expect(defaultMetric.toMetricConfig().metricStat?.statistic).toEqual('Average');

  // Override statistic via MetricOptions
  const overriddenMetric = metrics.metricDuration({ statistic: 'p99' });
  expect(overriddenMetric.toMetricConfig().metricStat?.statistic).toEqual('p99');
});
