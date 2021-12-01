import '@aws-cdk/assert-internal/jest';
import { Duration } from '@aws-cdk/core';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

/* eslint-disable max-len */

describe('helm chart', () => {
  describe('add Helm chart', () => {
    test('should have default namespace', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Namespace: 'default' });

    });
    test('should have a lowercase default release name', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'stackmychartff398361' });

    });
    test('should use the last 53 of the default release name', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThanFiftyThreeCharacters', { cluster, chart: 'chart' });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'hismostprobablylongerthanfiftythreecharacterscaf15d09' });

    });
    test('with values', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', values: { foo: 123 } });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Values: '{\"foo\":123}' });

    });
    test('should support create namespaces by default', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });

    });
    test('should support create namespaces when explicitly specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: true });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });

    });
    test('should not create namespaces when disabled', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: false });

      // THEN
      expect(stack).not.toHaveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });

    });
    test('should support waiting until everything is completed before marking release as successful', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true });

    });
    test('should default to not waiting before marking release as successful', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).not.toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true });

    });
    test('should enable waiting when specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true });

    });
    test('should disable waiting when specified as false', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: false });

      // THEN
      expect(stack).not.toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true });

    });

    test('should timeout only after 10 minutes', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', timeout: Duration.minutes(10) });

      // THEN
      expect(stack).toHaveResource(eks.HelmChart.RESOURCE_TYPE, { Timeout: '600s' });

    });
  });
});
