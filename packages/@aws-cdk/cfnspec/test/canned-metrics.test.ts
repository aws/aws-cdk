import * as cfnspec from '../lib';

test('spot-check DynamoDB metrics', () => {
  const metrics = cfnspec.cannedMetricsForService('AWS::DynamoDB');
  expect(metrics.length).toBeGreaterThan(0);

  const resLatency = metrics.find(m => m.metricName === 'SuccessfulRequestLatency');
  expect(resLatency).toBeTruthy();

  expect(resLatency?.dimensions).toEqual([['Operation', 'TableName']]);
});

test('spot-check MediaStore metrics', () => {
  const metrics = cfnspec.cannedMetricsForService('AWS::MediaStore');
  expect(metrics.length).toBeGreaterThan(0);
});

/**
 * Test that we can read canned metrics for all namespaces in the spec without throwing an error
 */
for (const _namespace of cfnspec.namespaces()) {
  const namespace = _namespace;
  test(`Validate canned metrics for ${namespace}`, () => {
    const metrics = cfnspec.cannedMetricsForService(namespace);

    // Check that there are no duplicates in these list (duplicates may occur because of duplicate
    // dimensions, but those have readly been combined).
    const uniqueMetricNames = new Set(metrics.map(m => `${m.namespace}/${m.metricName}`));
    expect(uniqueMetricNames.size).toEqual(metrics.length);
  });
};