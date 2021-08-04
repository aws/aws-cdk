import * as path from 'path';
import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { Duration } from '@aws-cdk/core';
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
    'should use the last 53 of the default release name'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChartNameWhichISMostProbablyLongerThanFiftyThreeCharacters', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Release: 'hismostprobablylongerthanfiftythreecharacterscaf15d09' }));
      test.done();
    },
    'should handle chart from S3 asset'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const chartAsset = new Asset(stack, 'ChartAsset', {
        path: path.join(__dirname, 'test-chart'),
      });
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'test-chart', chartAsset: chartAsset });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, {
        ChartAsset: {
          'Fn::Join': [
            '',
            [
              's3://',
              {
                Ref: 'AssetParametersd65fbdc11b108e0386ed8577c454d4544f6d4e7960f84a0d2e211478d6324dbfS3BucketBFD29DFB',
              },
              '/',
              {
                'Fn::Select': [
                  0,
                  {
                    'Fn::Split': [
                      '||',
                      {
                        Ref: 'AssetParametersd65fbdc11b108e0386ed8577c454d4544f6d4e7960f84a0d2e211478d6324dbfS3VersionKeyD1F874DF',
                      },
                    ],
                  },
                ],
              },
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '||',
                      {
                        Ref: 'AssetParametersd65fbdc11b108e0386ed8577c454d4544f6d4e7960f84a0d2e211478d6324dbfS3VersionKeyD1F874DF',
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
      }));
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
    'should support create namespaces by default'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true }));
      test.done();
    },
    'should support create namespaces when explicitly specified'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: true });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true }));
      test.done();
    },
    'should not create namespaces when disabled'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', createNamespace: false });

      // THEN
      expect(stack).notTo(haveResource(eks.HelmChart.RESOURCE_TYPE, { CreateNamespace: true }));
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
      expect(stack).notTo(haveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true }));
      test.done();
    },
    'should enable waiting when specified'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: true });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true }));
      test.done();
    },
    'should disable waiting when specified as false'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyWaitingChart', { cluster, chart: 'chart', wait: false });

      // THEN
      expect(stack).notTo(haveResource(eks.HelmChart.RESOURCE_TYPE, { Wait: true }));
      test.done();
    },

    'should timeout only after 10 minutes'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart', timeout: Duration.minutes(10) });

      // THEN
      expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, { Timeout: '600s' }));
      test.done();
    },
  },
};
