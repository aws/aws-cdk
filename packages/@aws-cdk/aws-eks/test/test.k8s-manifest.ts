import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Cluster, KubernetesManifest, KubernetesVersion, HelmChart } from '../lib';
import { testFixtureNoVpc } from './util';

/* eslint-disable max-len */

const CLUSTER_VERSION = KubernetesVersion.V1_16;

export = {
  'basic usage'(test: Test) {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new Cluster(stack, 'cluster', { version: CLUSTER_VERSION });

    const manifest = [
      {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: 'hello-kubernetes',
        },
        spec: {
          type: 'LoadBalancer',
          ports: [
            { port: 80, targetPort: 8080 },
          ],
          selector: {
            app: 'hello-kubernetes',
          },
        },
      },
      {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'hello-kubernetes',
        },
        spec: {
          replicas: 2,
          selector: {
            matchLabels: {
              app: 'hello-kubernetes',
            },
          },
          template: {
            metadata: {
              labels: {
                app: 'hello-kubernetes',
              },
            },
            spec: {
              containers: [
                {
                  name: 'hello-kubernetes',
                  image: 'paulbouwer/hello-kubernetes:1.5',
                  ports: [
                    { containerPort: 8080 },
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    // WHEN
    new KubernetesManifest(stack, 'manifest', {
      cluster,
      manifest,
    });

    expect(stack).to(haveResource(KubernetesManifest.RESOURCE_TYPE, {
      Manifest: JSON.stringify(manifest),
    }));
    test.done();
  },

  'can be added to an imported cluster with minimal config'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = Cluster.fromClusterAttributes(stack, 'MyCluster', {
      clusterName: 'my-cluster-name',
      kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
    });

    // WHEN
    cluster.addManifest('foo', { bar: 2334 });
    cluster.addChart('helm', { chart: 'hello-world' });

    // THEN
    expect(stack).to(haveResource(KubernetesManifest.RESOURCE_TYPE, {
      Manifest: '[{"bar":2334}]',
      ClusterName: 'my-cluster-name',
      RoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
    }));

    expect(stack).to(haveResource(HelmChart.RESOURCE_TYPE, {
      ClusterName: 'my-cluster-name',
      RoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
      Release: 'myclustercharthelm78d2c26a',
      Chart: 'hello-world',
      Namespace: 'default',
      CreateNamespace: true,
    }));

    test.done();
  },
};
