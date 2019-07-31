import { expect, haveResource } from '@aws-cdk/assert';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Cluster } from '../lib';
import { KubernetesManifest } from '../lib';

// tslint:disable:max-line-length

export = {
  'basic usage'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');
    const cluster = new Cluster(stack, 'cluster', { vpc });

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
            { port: 80, targetPort: 8080 }
          ],
          selector: {
            app: 'hello-kubernetes'
          }
        }
      },
      {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'hello-kubernetes'
        },
        spec: {
          replicas: 2,
          selector: {
            matchLabels: {
              app: 'hello-kubernetes'
            }
          },
          template: {
            metadata: {
              labels: {
                app: 'hello-kubernetes'
              }
            },
            spec: {
              containers: [
                {
                  name: 'hello-kubernetes',
                  image: 'paulbouwer/hello-kubernetes:1.5',
                  ports: [
                    { containerPort: 8080 }
                  ]
                }
              ]
            }
          }
        }
      }
    ];

    // WHEN
    new KubernetesManifest(stack, 'manifest', {
      cluster,
      resources: manifest
    });

    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: JSON.stringify(manifest)
    }));
    test.done();
  }
};