import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

/* eslint-disable max-len */

export = {
  'add Helm chart': {
    'should have default namespace'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Namespace: 'default' }));
      test.done();
    },
    'should have a lowercase default release name'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'stackmychartff398361' }));
      test.done();
    },
    'should trim the last 63 of the default release name'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThenSixtyThreeCharacters', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'rtnamewhichismostprobablylongerthensixtythreecharactersb800614d' }));
      test.done();
    },
    'with values'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', values: { foo: 123 } });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Values: '{\"foo\":123}' }));
      test.done();
    },
  },
};
