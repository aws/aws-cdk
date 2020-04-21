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
    'should use the last 53 of the default release name'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThanFiftyThreeCharacters', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'hismostprobablylongerthanfiftythreecharacterscaf15d09' }));
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
    'should support waiting until everything is completed before marking release as successful'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true }));
      test.done();
    },
    'should default to not waiting before marking release as successful'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: false}));
      test.done();
    },
  },
};
