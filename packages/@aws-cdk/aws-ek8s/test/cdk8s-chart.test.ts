import '@aws-cdk/assert/jest';
import * as eks from '@aws-cdk/aws-eks';
import * as cdk from '@aws-cdk/core';
import * as cdk8s from 'cdk8s';
import { Cdk8sChart } from '../lib/cdk8s-chart';

test('cdk8s chart can be added to an EKS cluster', () => {

  const stack = new cdk.Stack();

  const cluster = new eks.Cluster(stack, 'Cluster', {
    version: eks.KubernetesVersion.V1_18,
  });

  const app = new cdk8s.App();
  const chart = new cdk8s.Chart(app, 'Chart');

  new cdk8s.ApiObject(chart, 'FakePod', {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name: 'fake-pod',
      labels: {
        // adding aws-cdk token to cdk8s chart
        clusterName: cluster.clusterName,
      },
    },
  });

  cluster.addCustomChart('cdk8s-chart', new Cdk8sChart(chart));

  expect(stack).toHaveResourceLike('Custom::AWSCDK-EKS-KubernetesResource', {
    Manifest: {
      'Fn::Join': [
        '',
        [
          '[{"apiVersion":"v1","kind":"Pod","metadata":{"labels":{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '"},"name":"fake-pod"}}]',
        ],
      ],
    },
  });
});
