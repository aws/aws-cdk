import { Template } from '@aws-cdk/assertions';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Cluster, KubernetesResource } from '../lib';
import { testFixtureNoVpc } from './util';

/* eslint-disable max-len */

describeDeprecated('manifest', () => {
  test('basic usage', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new Cluster(stack, 'cluster');

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
    new KubernetesResource(stack, 'manifest', {
      cluster,
      manifest,
    });

    Template.fromStack(stack).hasResourceProperties(KubernetesResource.RESOURCE_TYPE, {
      Manifest: JSON.stringify(manifest),
    });

  });
});
