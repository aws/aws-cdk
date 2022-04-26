import { Template } from '@aws-cdk/assertions';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

/* eslint-disable max-len */

describeDeprecated('helm chart', () => {
  describe('add Helm chart', () => {
    test('should have default namespace', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Namespace: 'default' });

    });
    test('should have a lowercase default release name', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Release: 'stackmychartff398361' });

    });
    test('should trim the last 63 of the default release name', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThenSixtyThreeCharacters', { cluster, chart: 'chart' });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Release: 'rtnamewhichismostprobablylongerthensixtythreecharactersb800614d' });

    });
    test('with values', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', values: { foo: 123 } });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Values: '{\"foo\":123}' });

    });
  });
});
