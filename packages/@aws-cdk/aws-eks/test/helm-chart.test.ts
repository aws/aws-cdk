import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { Duration } from '@aws-cdk/core';
import { testFixtureCluster } from './util';
import * as eks from '../lib';

/* eslint-disable max-len */

describe('helm chart', () => {
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
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, {
        Release: 'stackmychartff398361',
      });
    });

    test('should throw when chart and chartAsset not specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const t = () => {
        new eks.HelmChart(stack, 'MyChart', { cluster });
      };

      // THEN
      expect(t).toThrowError();
    });

    test('should throw when chart and repository specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const t = () => {
        const chartAsset = new Asset(stack, 'ChartAsset', {
          path: path.join(__dirname, 'test-chart'),
        });
        new eks.HelmChart(stack, 'MyChart', {
          cluster,
          chartAsset,
          repository: 'repository',
        });
      };

      // THEN
      expect(t).toThrowError();
    });

    test('should throw when chartAsset and version specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const t = () => {
        const chartAsset = new Asset(stack, 'ChartAsset', {
          path: path.join(__dirname, 'test-chart'),
        });
        new eks.HelmChart(stack, 'MyChart', {
          cluster,
          chartAsset,
          version: 'version',
        });
      };

      // THEN
      expect(t).toThrowError();
    });

    test('should handle chart from S3 asset', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const chartAsset = new Asset(stack, 'ChartAsset', {
        path: path.join(__dirname, 'test-chart'),
      });
      new eks.HelmChart(stack, 'MyChart', { cluster, chartAsset });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, {
        ChartAssetURL: {
          'Fn::Sub':
            's3://cdk-hnb659fds-assets-${AWS::AccountId}-us-east-1/d65fbdc11b108e0386ed8577c454d4544f6d4e7960f84a0d2e211478d6324dbf.zip',
        },
      });
    });

    test('should use the last 53 of the default release name', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThanFiftyThreeCharacters', {
        cluster,
        chart: 'chart',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, {
        Release: 'hismostprobablylongerthanfiftythreecharacterscaf15d09',
      });
    });

    test('with values', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', values: { foo: 123 } });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Values: '{"foo":123}' });
    });

    test('should support create namespaces by default', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });
    });

    test('should support create namespaces when explicitly specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: true });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });
    });

    test('should not create namespaces when disabled', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: false });

      // THEN
      const charts = Template.fromStack(stack).findResources(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true });
      expect(Object.keys(charts).length).toEqual(0);
    });

    test('should support waiting until everything is completed before marking release as successful', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Wait: true });
    });

    test('should default to not waiting before marking release as successful', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart' });

      // THEN
      const charts = Template.fromStack(stack).findResources(eks.HelmChart.RESOURCE_TYPE, { Wait: true });
      expect(Object.keys(charts).length).toEqual(0);
    });

    test('should enable waiting when specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Wait: true });
    });

    test('should disable waiting when specified as false', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: false });

      // THEN
      const charts = Template.fromStack(stack).findResources(eks.HelmChart.RESOURCE_TYPE, { Wait: true });
      expect(Object.keys(charts).length).toEqual(0);
    });

    test('should timeout only after 10 minutes', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', {
        cluster,
        chart: 'chart',
        timeout: Duration.minutes(10),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { Timeout: '600s' });
    });

    test('should disable skip crds by default', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      const charts = Template.fromStack(stack).findResources(eks.HelmChart.RESOURCE_TYPE, { SkipCrds: false });
      expect(Object.keys(charts).length).toEqual(0);
    });
    test('should enable atomic operations when specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyAtomicChart', { cluster, chart: 'chart', skipCrds: true });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, { SkipCrds: true });
    });
  });
});
