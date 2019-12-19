import { expect, haveResource } from '@aws-cdk/assert';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

// tslint:disable:max-line-length

export = {
  'add Helm chart': {
    'should have default namespace'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, name: 'mychart', chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Namespace: 'default' }));
      test.done();
    },
    'with values'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, name: 'mychart', chart: 'chart', values: { foo: 123 } });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Values: '{\"foo\":123}' }));
      test.done();
    }
  }
};
