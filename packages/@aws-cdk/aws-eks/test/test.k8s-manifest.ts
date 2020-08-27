import { expect, haveResource } from '@aws-cdk/assert';
import { Test } from 'nodeunit';
import { Cluster, KubernetesManifest, KubernetesVersion } from '../lib';
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
};
