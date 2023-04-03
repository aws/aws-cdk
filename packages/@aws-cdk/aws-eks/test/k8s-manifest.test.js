"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const util_1 = require("./util");
const lib_1 = require("../lib");
/* eslint-disable max-len */
const CLUSTER_VERSION = lib_1.KubernetesVersion.V1_16;
describe('k8s manifest', () => {
    test('basic usage', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'cluster', { version: CLUSTER_VERSION });
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
        new lib_1.KubernetesManifest(stack, 'manifest', {
            cluster,
            manifest,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: JSON.stringify(manifest),
        });
    });
    test('can be added to an imported cluster with minimal config', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = lib_1.Cluster.fromClusterAttributes(stack, 'MyCluster', {
            clusterName: 'my-cluster-name',
            kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
        });
        // WHEN
        cluster.addManifest('foo', { bar: 2334 });
        cluster.addHelmChart('helm', { chart: 'hello-world' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: '[{"bar":2334}]',
            ClusterName: 'my-cluster-name',
            RoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
            ClusterName: 'my-cluster-name',
            RoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
            Release: 'myclustercharthelm78d2c26a',
            Chart: 'hello-world',
            Namespace: 'default',
            CreateNamespace: true,
        });
    });
    test('default child is a CfnResource', () => {
        const stack = new core_1.Stack();
        const cluster = lib_1.Cluster.fromClusterAttributes(stack, 'MyCluster', {
            clusterName: 'my-cluster-name',
            kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
        });
        const manifest = cluster.addManifest('foo', { bar: 2334 });
        expect(manifest.node.defaultChild).toBeInstanceOf(core_1.CfnResource);
    });
    describe('prune labels', () => {
        test('base case', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // prune is enabled by default
            const cluster = new lib_1.Cluster(stack, 'Cluster', {
                version: lib_1.KubernetesVersion.V1_16,
            });
            expect(cluster.prune).toEqual(true);
            // WHEN
            cluster.addManifest('m1', {
                apiVersion: 'v1beta1',
                kind: 'Foo',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([{
                        apiVersion: 'v1beta1',
                        kind: 'Foo',
                        metadata: {
                            labels: {
                                'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac': '',
                            },
                        },
                    }]),
                PruneLabel: 'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac',
            });
        });
        test('multiple resources in the same manifest', () => {
            // GIVEN
            const { stack, cluster } = util_1.testFixtureCluster({ prune: true });
            // WHEN
            cluster.addManifest('m1', {
                apiVersion: 'v1beta',
                kind: 'Foo',
            }, {
                apiVersion: 'v1',
                kind: 'Pod',
                metadata: {
                    name: 'foo',
                    labels: {
                        bar: 1234,
                    },
                },
                spec: {
                    containers: [{ name: 'main', image: 'main' }],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([
                    {
                        apiVersion: 'v1beta',
                        kind: 'Foo',
                        metadata: {
                            labels: {
                                'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac': '',
                            },
                        },
                    },
                    {
                        apiVersion: 'v1',
                        kind: 'Pod',
                        metadata: {
                            name: 'foo',
                            labels: {
                                'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac': '',
                                'bar': 1234,
                            },
                        },
                        spec: {
                            containers: [
                                {
                                    name: 'main',
                                    image: 'main',
                                },
                            ],
                        },
                    },
                ]),
                PruneLabel: 'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac',
            });
        });
        test('different KubernetesManifest resource use different prune labels', () => {
            // GIVEN
            const { stack, cluster } = util_1.testFixtureCluster({ prune: true });
            // WHEN
            cluster.addManifest('m1', {
                apiVersion: 'v1beta',
                kind: 'Foo',
            });
            cluster.addManifest('m2', {
                apiVersion: 'v1',
                kind: 'Pod',
                metadata: {
                    name: 'foo',
                    labels: {
                        bar: 1234,
                    },
                },
                spec: {
                    containers: [{ name: 'main', image: 'main' }],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([
                    {
                        apiVersion: 'v1beta',
                        kind: 'Foo',
                        metadata: {
                            labels: {
                                'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac': '',
                            },
                        },
                    },
                ]),
                PruneLabel: 'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([
                    {
                        apiVersion: 'v1',
                        kind: 'Pod',
                        metadata: {
                            name: 'foo',
                            labels: {
                                'aws.cdk.eks/prune-c8aff6ac817006dd4d644e9d99b2cdbb8c8cd036d9': '',
                                'bar': 1234,
                            },
                        },
                        spec: {
                            containers: [
                                {
                                    name: 'main',
                                    image: 'main',
                                },
                            ],
                        },
                    },
                ]),
                PruneLabel: 'aws.cdk.eks/prune-c8aff6ac817006dd4d644e9d99b2cdbb8c8cd036d9',
            });
        });
        test('ignores resources without "kind"', () => {
            // GIVEN
            const { stack, cluster } = util_1.testFixtureCluster({ prune: true });
            // WHEN
            cluster.addManifest('m1', {
                malformed: { resource: 'yes' },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([{ malformed: { resource: 'yes' } }]),
                PruneLabel: 'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac',
            });
        });
        test('ignores entries that are not objects (invalid type)', () => {
            // GIVEN
            const { stack, cluster } = util_1.testFixtureCluster({ prune: true });
            expect(cluster.prune).toEqual(true);
            // WHEN
            cluster.addManifest('m1', ['foo']);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([['foo']]),
                PruneLabel: 'aws.cdk.eks/prune-c89a5983505f58231ac2a9a86fd82735ccf2308eac',
            });
        });
        test('no prune labels when "prune" is disabled', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            const cluster = new lib_1.Cluster(stack, 'Cluster', {
                version: lib_1.KubernetesVersion.V1_16,
                prune: false,
            });
            // WHEN
            cluster.addManifest('m1', { apiVersion: 'v1beta', kind: 'Foo' });
            // if "prune" is not specified at the manifest level, it is derived from the cluster settings.
            new lib_1.KubernetesManifest(stack, 'm2', {
                cluster,
                manifest: [{ apiVersion: 'v1', kind: 'Pod' }],
            });
            // can be overridden at the manifest level
            new lib_1.KubernetesManifest(stack, 'm3', {
                cluster,
                manifest: [{ apiVersion: 'v1', kind: 'Deployment' }],
                prune: true,
            });
            // THEN
            const template = assertions_1.Template.fromStack(stack).toJSON();
            const m1 = template.Resources.Clustermanifestm1E5FBE3C1.Properties;
            const m2 = template.Resources.m201F909C5.Properties;
            const m3 = template.Resources.m3B0AF9264.Properties;
            expect(m1.Manifest).toEqual(JSON.stringify([{ apiVersion: 'v1beta', kind: 'Foo' }]));
            expect(m2.Manifest).toEqual(JSON.stringify([{ apiVersion: 'v1', kind: 'Pod' }]));
            expect(m3.Manifest).toEqual(JSON.stringify([
                {
                    apiVersion: 'v1',
                    kind: 'Deployment',
                    metadata: {
                        labels: {
                            'aws.cdk.eks/prune-c8971972440c5bb3661e468e4cb8069f7ee549414c': '',
                        },
                    },
                },
            ]));
            expect(m1.PruneLabel).toBeFalsy();
            expect(m2.PruneLabel).toBeFalsy();
            expect(m3.PruneLabel).toEqual('aws.cdk.eks/prune-c8971972440c5bb3661e468e4cb8069f7ee549414c');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW1hbmlmZXN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrOHMtbWFuaWZlc3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBbUQ7QUFDbkQsaUNBQThEO0FBQzlELGdDQUFtRjtBQUVuRiw0QkFBNEI7QUFFNUIsTUFBTSxlQUFlLEdBQUcsdUJBQWlCLENBQUMsS0FBSyxDQUFDO0FBRWhELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQ3ZCLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsdUJBQWdCLEVBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFFNUUsTUFBTSxRQUFRLEdBQUc7WUFDZjtnQkFDRSxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxrQkFBa0I7aUJBQ3pCO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsY0FBYztvQkFDcEIsS0FBSyxFQUFFO3dCQUNMLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO3FCQUMvQjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLGtCQUFrQjtxQkFDeEI7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixJQUFJLEVBQUUsWUFBWTtnQkFDbEIsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxrQkFBa0I7aUJBQ3pCO2dCQUNELElBQUksRUFBRTtvQkFDSixRQUFRLEVBQUUsQ0FBQztvQkFDWCxRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFOzRCQUNY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RUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IENmblJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmVOb1ZwYywgdGVzdEZpeHR1cmVDbHVzdGVyIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IENsdXN0ZXIsIEt1YmVybmV0ZXNNYW5pZmVzdCwgS3ViZXJuZXRlc1ZlcnNpb24sIEhlbG1DaGFydCB9IGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuY29uc3QgQ0xVU1RFUl9WRVJTSU9OID0gS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTY7XG5cbmRlc2NyaWJlKCdrOHMgbWFuaWZlc3QnLCAoKSA9PiB7XG4gIHRlc3QoJ2Jhc2ljIHVzYWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiB9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0ID0gW1xuICAgICAge1xuICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICBraW5kOiAnU2VydmljZScsXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgdHlwZTogJ0xvYWRCYWxhbmNlcicsXG4gICAgICAgICAgcG9ydHM6IFtcbiAgICAgICAgICAgIHsgcG9ydDogODAsIHRhcmdldFBvcnQ6IDgwODAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgICBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ2FwcHMvdjEnLFxuICAgICAgICBraW5kOiAnRGVwbG95bWVudCcsXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgcmVwbGljYXM6IDIsXG4gICAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICAgIG1hdGNoTGFiZWxzOiB7XG4gICAgICAgICAgICAgIGFwcDogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgICAgICAgICBpbWFnZTogJ3BhdWxib3V3ZXIvaGVsbG8ta3ViZXJuZXRlczoxLjUnLFxuICAgICAgICAgICAgICAgICAgcG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBjb250YWluZXJQb3J0OiA4MDgwIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEt1YmVybmV0ZXNNYW5pZmVzdChzdGFjaywgJ21hbmlmZXN0Jywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1hbmlmZXN0LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBhZGRlZCB0byBhbiBpbXBvcnRlZCBjbHVzdGVyIHdpdGggbWluaW1hbCBjb25maWcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBDbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ015Q2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiAnbXktY2x1c3Rlci1uYW1lJyxcbiAgICAgIGt1YmVjdGxSb2xlQXJuOiAnYXJuOmF3czppYW06OjExMTExMTE6cm9sZS9pYW0tcm9sZS10aGF0LWhhcy1tYXN0ZXJzLWFjY2VzcycsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnZm9vJywgeyBiYXI6IDIzMzQgfSk7XG4gICAgY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ2hlbG0nLCB7IGNoYXJ0OiAnaGVsbG8td29ybGQnIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDogJ1t7XCJiYXJcIjoyMzM0fV0nLFxuICAgICAgQ2x1c3Rlck5hbWU6ICdteS1jbHVzdGVyLW5hbWUnLFxuICAgICAgUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMTExMTExOnJvbGUvaWFtLXJvbGUtdGhhdC1oYXMtbWFzdGVycy1hY2Nlc3MnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoSGVsbUNoYXJ0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiAnbXktY2x1c3Rlci1uYW1lJyxcbiAgICAgIFJvbGVBcm46ICdhcm46YXdzOmlhbTo6MTExMTExMTpyb2xlL2lhbS1yb2xlLXRoYXQtaGFzLW1hc3RlcnMtYWNjZXNzJyxcbiAgICAgIFJlbGVhc2U6ICdteWNsdXN0ZXJjaGFydGhlbG03OGQyYzI2YScsXG4gICAgICBDaGFydDogJ2hlbGxvLXdvcmxkJyxcbiAgICAgIE5hbWVzcGFjZTogJ2RlZmF1bHQnLFxuICAgICAgQ3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGNoaWxkIGlzIGEgQ2ZuUmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbHVzdGVyID0gQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdNeUNsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICBrdWJlY3RsUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMTExMTExOnJvbGUvaWFtLXJvbGUtdGhhdC1oYXMtbWFzdGVycy1hY2Nlc3MnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFuaWZlc3QgPSBjbHVzdGVyLmFkZE1hbmlmZXN0KCdmb28nLCB7IGJhcjogMjMzNCB9KTtcbiAgICBleHBlY3QobWFuaWZlc3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvQmVJbnN0YW5jZU9mKENmblJlc291cmNlKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BydW5lIGxhYmVscycsICgpID0+IHtcbiAgICB0ZXN0KCdiYXNlIGNhc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBwcnVuZSBpcyBlbmFibGVkIGJ5IGRlZmF1bHRcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IEt1YmVybmV0ZXNWZXJzaW9uLlYxXzE2LFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjbHVzdGVyLnBydW5lKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtMScsIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxYmV0YTEnLFxuICAgICAgICBraW5kOiAnRm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW3tcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjFiZXRhMScsXG4gICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dKSxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4OWE1OTgzNTA1ZjU4MjMxYWMyYTlhODZmZDgyNzM1Y2NmMjMwOGVhYycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ211bHRpcGxlIHJlc291cmNlcyBpbiB0aGUgc2FtZSBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoeyBwcnVuZTogdHJ1ZSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLFxuICAgICAgICB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogJ3YxYmV0YScsXG4gICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgIGtpbmQ6ICdQb2QnLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICBiYXI6IDEyMzQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgY29udGFpbmVyczogW3sgbmFtZTogJ21haW4nLCBpbWFnZTogJ21haW4nIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgICAgIGtpbmQ6ICdQb2QnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnOiAnJyxcbiAgICAgICAgICAgICAgICAnYmFyJzogMTIzNCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnbWFpbicsXG4gICAgICAgICAgICAgICAgICBpbWFnZTogJ21haW4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgICBQcnVuZUxhYmVsOiAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGlmZmVyZW50IEt1YmVybmV0ZXNNYW5pZmVzdCByZXNvdXJjZSB1c2UgZGlmZmVyZW50IHBydW5lIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoeyBwcnVuZTogdHJ1ZSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLCB7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICBraW5kOiAnRm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtMicsIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1BvZCcsXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICBiYXI6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGNvbnRhaW5lcnM6IFt7IG5hbWU6ICdtYWluJywgaW1hZ2U6ICdtYWluJyB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgICBQcnVuZUxhYmVsOiAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgICAgICBraW5kOiAnUG9kJyxcbiAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzhhZmY2YWM4MTcwMDZkZDRkNjQ0ZTlkOTliMmNkYmI4YzhjZDAzNmQ5JzogJycsXG4gICAgICAgICAgICAgICAgJ2Jhcic6IDEyMzQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICBjb250YWluZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ21haW4nLFxuICAgICAgICAgICAgICAgICAgaW1hZ2U6ICdtYWluJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4YWZmNmFjODE3MDA2ZGQ0ZDY0NGU5ZDk5YjJjZGJiOGM4Y2QwMzZkOScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lnbm9yZXMgcmVzb3VyY2VzIHdpdGhvdXQgXCJraW5kXCInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKHsgcHJ1bmU6IHRydWUgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ20xJywge1xuICAgICAgICBtYWxmb3JtZWQ6IHsgcmVzb3VyY2U6ICd5ZXMnIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFt7IG1hbGZvcm1lZDogeyByZXNvdXJjZTogJ3llcycgfSB9XSksXG4gICAgICAgIFBydW5lTGFiZWw6ICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZ25vcmVzIGVudHJpZXMgdGhhdCBhcmUgbm90IG9iamVjdHMgKGludmFsaWQgdHlwZSknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKHsgcHJ1bmU6IHRydWUgfSk7XG4gICAgICBleHBlY3QoY2x1c3Rlci5wcnVuZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLCBbJ2ZvbyddKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFtbJ2ZvbyddXSksXG4gICAgICAgIFBydW5lTGFiZWw6ICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBwcnVuZSBsYWJlbHMgd2hlbiBcInBydW5lXCIgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTYsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtMScsIHsgYXBpVmVyc2lvbjogJ3YxYmV0YScsIGtpbmQ6ICdGb28nIH0pO1xuXG4gICAgICAvLyBpZiBcInBydW5lXCIgaXMgbm90IHNwZWNpZmllZCBhdCB0aGUgbWFuaWZlc3QgbGV2ZWwsIGl0IGlzIGRlcml2ZWQgZnJvbSB0aGUgY2x1c3RlciBzZXR0aW5ncy5cbiAgICAgIG5ldyBLdWJlcm5ldGVzTWFuaWZlc3Qoc3RhY2ssICdtMicsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgbWFuaWZlc3Q6IFt7IGFwaVZlcnNpb246ICd2MScsIGtpbmQ6ICdQb2QnIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNhbiBiZSBvdmVycmlkZGVuIGF0IHRoZSBtYW5pZmVzdCBsZXZlbFxuICAgICAgbmV3IEt1YmVybmV0ZXNNYW5pZmVzdChzdGFjaywgJ20zJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBtYW5pZmVzdDogW3sgYXBpVmVyc2lvbjogJ3YxJywga2luZDogJ0RlcGxveW1lbnQnIH1dLFxuICAgICAgICBwcnVuZTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCk7XG5cbiAgICAgIGNvbnN0IG0xID0gdGVtcGxhdGUuUmVzb3VyY2VzLkNsdXN0ZXJtYW5pZmVzdG0xRTVGQkUzQzEuUHJvcGVydGllcztcbiAgICAgIGNvbnN0IG0yID0gdGVtcGxhdGUuUmVzb3VyY2VzLm0yMDFGOTA5QzUuUHJvcGVydGllcztcbiAgICAgIGNvbnN0IG0zID0gdGVtcGxhdGUuUmVzb3VyY2VzLm0zQjBBRjkyNjQuUHJvcGVydGllcztcblxuICAgICAgZXhwZWN0KG0xLk1hbmlmZXN0KS50b0VxdWFsKEpTT04uc3RyaW5naWZ5KFt7IGFwaVZlcnNpb246ICd2MWJldGEnLCBraW5kOiAnRm9vJyB9XSkpO1xuICAgICAgZXhwZWN0KG0yLk1hbmlmZXN0KS50b0VxdWFsKEpTT04uc3RyaW5naWZ5KFt7IGFwaVZlcnNpb246ICd2MScsIGtpbmQ6ICdQb2QnIH1dKSk7XG4gICAgICBleHBlY3QobTMuTWFuaWZlc3QpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgICBraW5kOiAnRGVwbG95bWVudCcsXG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5NzE5NzI0NDBjNWJiMzY2MWU0NjhlNGNiODA2OWY3ZWU1NDk0MTRjJzogJycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdKSk7XG4gICAgICBleHBlY3QobTEuUHJ1bmVMYWJlbCkudG9CZUZhbHN5KCk7XG4gICAgICBleHBlY3QobTIuUHJ1bmVMYWJlbCkudG9CZUZhbHN5KCk7XG4gICAgICBleHBlY3QobTMuUHJ1bmVMYWJlbCkudG9FcXVhbCgnYXdzLmNkay5la3MvcHJ1bmUtYzg5NzE5NzI0NDBjNWJiMzY2MWU0NjhlNGNiODA2OWY3ZWU1NDk0MTRjJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=