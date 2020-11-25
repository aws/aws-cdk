import { Test } from 'nodeunit';
import * as cfnspec from '../lib';

module.exports = {
  'spot-check DynamoDB metrics'(test: Test) {
    const metrics = cfnspec.cannedMetricsForService('AWS::DynamoDB');
    test.ok(metrics.length > 0);

    const resLatency = metrics.find(m => m.metricName === 'SuccessfulRequestLatency');
    test.ok(resLatency);

    test.deepEqual(resLatency?.dimensions, [['Operation', 'TableName']]);

    test.done();
  },

  'spot-check MediaStore metrics'(test: Test) {
    const metrics = cfnspec.cannedMetricsForService('AWS::MediaStore');
    test.ok(metrics.length > 0);

    test.done();
  },
};

/**
 * Test that we can read canned metrics for all namespaces in the spec without throwing an error
 */
for (const _namespace of cfnspec.namespaces()) {
  const namespace = _namespace;
  module.exports[`Validate canned metrics for ${namespace}`] = (test: Test) => {
    const metrics = cfnspec.cannedMetricsForService(namespace);

    // Check that there are no duplicates in these list (duplicates may occur because of duplicate
    // dimensions, but those have readly been combined).
    const uniqueMetricNames = new Set(metrics.map(m => `${m.namespace}/${m.metricName}`));
    test.equal(uniqueMetricNames.size, metrics.length, 'There are metrics with duplicate names');

    test.done();
  };
}