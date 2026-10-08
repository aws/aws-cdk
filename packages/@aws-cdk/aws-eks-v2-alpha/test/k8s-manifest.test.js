"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const assertions_1 = require("aws-cdk-lib/assertions");
const iam = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const util_1 = require("./util");
const lib_1 = require("../lib");
const CLUSTER_VERSION = lib_1.KubernetesVersion.V1_33;
describe('k8s manifest', () => {
    test('basic usage', () => {
        // GIVEN
        const { stack } = (0, util_1.testFixtureNoVpc)();
        const cluster = new lib_1.Cluster(stack, 'cluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
        });
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
        const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
        const kubectlProvider = lib_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
            serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
            role: handlerRole,
        });
        const cluster = lib_1.Cluster.fromClusterAttributes(stack, 'MyCluster', {
            clusterName: 'my-cluster-name',
            kubectlProvider: kubectlProvider,
        });
        // WHEN
        cluster.addManifest('foo', { bar: 2334 });
        cluster.addHelmChart('helm', { chart: 'hello-world' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: '[{"bar":2334}]',
            ClusterName: 'my-cluster-name',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
            ClusterName: 'my-cluster-name',
            Release: 'myclustercharthelm78d2c26a',
            Chart: 'hello-world',
            Namespace: 'default',
            CreateNamespace: true,
        });
    });
    test('default child is a CfnResource', () => {
        const stack = new core_1.Stack();
        const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
        const kubectlProvider = lib_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
            serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
            role: handlerRole,
        });
        const cluster = lib_1.Cluster.fromClusterAttributes(stack, 'MyCluster', {
            clusterName: 'my-cluster-name',
            kubectlProvider: kubectlProvider,
        });
        const manifest = cluster.addManifest('foo', { bar: 2334 });
        expect(manifest.node.defaultChild).toBeInstanceOf(core_1.CfnResource);
    });
    describe('prune labels', () => {
        test('base case', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // prune is enabled by default
            const cluster = new lib_1.Cluster(stack, 'Cluster', {
                version: lib_1.KubernetesVersion.V1_33,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
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
            const { stack, cluster } = (0, util_1.testFixtureCluster)({ prune: true });
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
            const { stack, cluster } = (0, util_1.testFixtureCluster)({ prune: true });
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
            const { stack, cluster } = (0, util_1.testFixtureCluster)({ prune: true });
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
            const { stack, cluster } = (0, util_1.testFixtureCluster)({ prune: true });
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
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new lib_1.Cluster(stack, 'Cluster', {
                version: lib_1.KubernetesVersion.V1_33,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW1hbmlmZXN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrOHMtbWFuaWZlc3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUFvRTtBQUNwRSx1REFBa0Q7QUFDbEQsMkNBQTJDO0FBQzNDLDJDQUFzRDtBQUN0RCxpQ0FBOEQ7QUFDOUQsZ0NBQW9HO0FBRXBHLE1BQU0sZUFBZSxHQUFHLHVCQUFpQixDQUFDLEtBQUssQ0FBQztBQUVoRCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUN2QixRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUEsdUJBQWdCLEdBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQzVDLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7YUFDekQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRztZQUNmO2dCQUNFLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixJQUFJLEVBQUUsU0FBUztnQkFDZixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLGtCQUFrQjtpQkFDekI7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUU7d0JBQ0wsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7cUJBQy9CO29CQUNELFFBQVEsRUFBRTt3QkFDUixHQUFHLEVBQUUsa0JBQWtCO3FCQUN4QjtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLElBQUksRUFBRSxZQUFZO2dCQUNsQixRQUFRLEVBQUU7b0JBQ1IsSUFB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UyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDcEQsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1lBRXBELE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3pDO29CQUNFLFVBQVUsRUFBRSxJQUFJO29CQUNoQixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDTiw4REFBOEQsRUFBRSxFQUFFO3lCQUNuRTtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IHRlc3RGaXh0dXJlTm9WcGMsIHRlc3RGaXh0dXJlQ2x1c3RlciB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDbHVzdGVyLCBLdWJlcm5ldGVzTWFuaWZlc3QsIEt1YmVybmV0ZXNWZXJzaW9uLCBIZWxtQ2hhcnQsIEt1YmVjdGxQcm92aWRlciB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IENMVVNURVJfVkVSU0lPTiA9IEt1YmVybmV0ZXNWZXJzaW9uLlYxXzMzO1xuXG5kZXNjcmliZSgnazhzIG1hbmlmZXN0JywgKCkgPT4ge1xuICB0ZXN0KCdiYXNpYyB1c2FnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYW5pZmVzdCA9IFtcbiAgICAgIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1NlcnZpY2UnLFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIHR5cGU6ICdMb2FkQmFsYW5jZXInLFxuICAgICAgICAgIHBvcnRzOiBbXG4gICAgICAgICAgICB7IHBvcnQ6IDgwLCB0YXJnZXRQb3J0OiA4MDgwIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBzZWxlY3Rvcjoge1xuICAgICAgICAgICAgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGFwaVZlcnNpb246ICdhcHBzL3YxJyxcbiAgICAgICAga2luZDogJ0RlcGxveW1lbnQnLFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIHJlcGxpY2FzOiAyLFxuICAgICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgICBtYXRjaExhYmVsczoge1xuICAgICAgICAgICAgICBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICBjb250YWluZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICAgICAgICAgICAgaW1hZ2U6ICdwYXVsYm91d2VyL2hlbGxvLWt1YmVybmV0ZXM6MS41JyxcbiAgICAgICAgICAgICAgICAgIHBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgY29udGFpbmVyUG9ydDogODA4MCB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBLdWJlcm5ldGVzTWFuaWZlc3Qoc3RhY2ssICdtYW5pZmVzdCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgYWRkZWQgdG8gYW4gaW1wb3J0ZWQgY2x1c3RlciB3aXRoIG1pbmltYWwgY29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBoYW5kbGVyUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSGFuZGxlclJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2xhbWJkYS1yb2xlJyk7XG4gICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmZyb21LdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzKHN0YWNrLCAnS3ViZWN0bFByb3ZpZGVyJywge1xuICAgICAgc2VydmljZVRva2VuOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbjoxJyxcbiAgICAgIHJvbGU6IGhhbmRsZXJSb2xlLFxuICAgIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBDbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ015Q2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiAnbXktY2x1c3Rlci1uYW1lJyxcbiAgICAgIGt1YmVjdGxQcm92aWRlcjoga3ViZWN0bFByb3ZpZGVyLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ2ZvbycsIHsgYmFyOiAyMzM0IH0pO1xuICAgIGNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCdoZWxtJywgeyBjaGFydDogJ2hlbGxvLXdvcmxkJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6ICdbe1wiYmFyXCI6MjMzNH1dJyxcbiAgICAgIENsdXN0ZXJOYW1lOiAnbXktY2x1c3Rlci1uYW1lJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEhlbG1DaGFydC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBDbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICBSZWxlYXNlOiAnbXljbHVzdGVyY2hhcnRoZWxtNzhkMmMyNmEnLFxuICAgICAgQ2hhcnQ6ICdoZWxsby13b3JsZCcsXG4gICAgICBOYW1lc3BhY2U6ICdkZWZhdWx0JyxcbiAgICAgIENyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBjaGlsZCBpcyBhIENmblJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgaGFuZGxlclJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ0hhbmRsZXJSb2xlJywgJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9sYW1iZGEtcm9sZScpO1xuICAgIGNvbnN0IGt1YmVjdGxQcm92aWRlciA9IEt1YmVjdGxQcm92aWRlci5mcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzdGFjaywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb246MScsXG4gICAgICByb2xlOiBoYW5kbGVyUm9sZSxcbiAgICB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdNeUNsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICBrdWJlY3RsUHJvdmlkZXI6IGt1YmVjdGxQcm92aWRlcixcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0ID0gY2x1c3Rlci5hZGRNYW5pZmVzdCgnZm9vJywgeyBiYXI6IDIzMzQgfSk7XG4gICAgZXhwZWN0KG1hbmlmZXN0Lm5vZGUuZGVmYXVsdENoaWxkKS50b0JlSW5zdGFuY2VPZihDZm5SZXNvdXJjZSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwcnVuZSBsYWJlbHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYmFzZSBjYXNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gcHJ1bmUgaXMgZW5hYmxlZCBieSBkZWZhdWx0XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjbHVzdGVyLnBydW5lKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtMScsIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxYmV0YTEnLFxuICAgICAgICBraW5kOiAnRm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW3tcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjFiZXRhMScsXG4gICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dKSxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4OWE1OTgzNTA1ZjU4MjMxYWMyYTlhODZmZDgyNzM1Y2NmMjMwOGVhYycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ211bHRpcGxlIHJlc291cmNlcyBpbiB0aGUgc2FtZSBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoeyBwcnVuZTogdHJ1ZSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLFxuICAgICAgICB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogJ3YxYmV0YScsXG4gICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgIGtpbmQ6ICdQb2QnLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICBiYXI6IDEyMzQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgY29udGFpbmVyczogW3sgbmFtZTogJ21haW4nLCBpbWFnZTogJ21haW4nIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgICAgIGtpbmQ6ICdQb2QnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnOiAnJyxcbiAgICAgICAgICAgICAgICAnYmFyJzogMTIzNCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnbWFpbicsXG4gICAgICAgICAgICAgICAgICBpbWFnZTogJ21haW4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgICBQcnVuZUxhYmVsOiAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGlmZmVyZW50IEt1YmVybmV0ZXNNYW5pZmVzdCByZXNvdXJjZSB1c2UgZGlmZmVyZW50IHBydW5lIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoeyBwcnVuZTogdHJ1ZSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLCB7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICBraW5kOiAnRm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtMicsIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1BvZCcsXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICBiYXI6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGNvbnRhaW5lcnM6IFt7IG5hbWU6ICdtYWluJywgaW1hZ2U6ICdtYWluJyB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MWJldGEnLFxuICAgICAgICAgICAga2luZDogJ0ZvbycsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJzogJycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgICBQcnVuZUxhYmVsOiAnYXdzLmNkay5la3MvcHJ1bmUtYzg5YTU5ODM1MDVmNTgyMzFhYzJhOWE4NmZkODI3MzVjY2YyMzA4ZWFjJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgICAgICBraW5kOiAnUG9kJyxcbiAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzLmNkay5la3MvcHJ1bmUtYzhhZmY2YWM4MTcwMDZkZDRkNjQ0ZTlkOTliMmNkYmI4YzhjZDAzNmQ5JzogJycsXG4gICAgICAgICAgICAgICAgJ2Jhcic6IDEyMzQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICBjb250YWluZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ21haW4nLFxuICAgICAgICAgICAgICAgICAgaW1hZ2U6ICdtYWluJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4YWZmNmFjODE3MDA2ZGQ0ZDY0NGU5ZDk5YjJjZGJiOGM4Y2QwMzZkOScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lnbm9yZXMgcmVzb3VyY2VzIHdpdGhvdXQgXCJraW5kXCInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKHsgcHJ1bmU6IHRydWUgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ20xJywge1xuICAgICAgICBtYWxmb3JtZWQ6IHsgcmVzb3VyY2U6ICd5ZXMnIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFt7IG1hbGZvcm1lZDogeyByZXNvdXJjZTogJ3llcycgfSB9XSksXG4gICAgICAgIFBydW5lTGFiZWw6ICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZ25vcmVzIGVudHJpZXMgdGhhdCBhcmUgbm90IG9iamVjdHMgKGludmFsaWQgdHlwZSknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKHsgcHJ1bmU6IHRydWUgfSk7XG4gICAgICBleHBlY3QoY2x1c3Rlci5wcnVuZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbTEnLCBbJ2ZvbyddKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFtbJ2ZvbyddXSksXG4gICAgICAgIFBydW5lTGFiZWw6ICdhd3MuY2RrLmVrcy9wcnVuZS1jODlhNTk4MzUwNWY1ODIzMWFjMmE5YTg2ZmQ4MjczNWNjZjIzMDhlYWMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBwcnVuZSBsYWJlbHMgd2hlbiBcInBydW5lXCIgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMzMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ20xJywgeyBhcGlWZXJzaW9uOiAndjFiZXRhJywga2luZDogJ0ZvbycgfSk7XG5cbiAgICAgIC8vIGlmIFwicHJ1bmVcIiBpcyBub3Qgc3BlY2lmaWVkIGF0IHRoZSBtYW5pZmVzdCBsZXZlbCwgaXQgaXMgZGVyaXZlZCBmcm9tIHRoZSBjbHVzdGVyIHNldHRpbmdzLlxuICAgICAgbmV3IEt1YmVybmV0ZXNNYW5pZmVzdChzdGFjaywgJ20yJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBtYW5pZmVzdDogW3sgYXBpVmVyc2lvbjogJ3YxJywga2luZDogJ1BvZCcgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gYXQgdGhlIG1hbmlmZXN0IGxldmVsXG4gICAgICBuZXcgS3ViZXJuZXRlc01hbmlmZXN0KHN0YWNrLCAnbTMnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIG1hbmlmZXN0OiBbeyBhcGlWZXJzaW9uOiAndjEnLCBraW5kOiAnRGVwbG95bWVudCcgfV0sXG4gICAgICAgIHBydW5lOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50b0pTT04oKTtcblxuICAgICAgY29uc3QgbTEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlcm1hbmlmZXN0bTFFNUZCRTNDMS5Qcm9wZXJ0aWVzO1xuICAgICAgY29uc3QgbTIgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMubTIwMUY5MDlDNS5Qcm9wZXJ0aWVzO1xuICAgICAgY29uc3QgbTMgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMubTNCMEFGOTI2NC5Qcm9wZXJ0aWVzO1xuXG4gICAgICBleHBlY3QobTEuTWFuaWZlc3QpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoW3sgYXBpVmVyc2lvbjogJ3YxYmV0YScsIGtpbmQ6ICdGb28nIH1dKSk7XG4gICAgICBleHBlY3QobTIuTWFuaWZlc3QpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoW3sgYXBpVmVyc2lvbjogJ3YxJywga2luZDogJ1BvZCcgfV0pKTtcbiAgICAgIGV4cGVjdChtMy5NYW5pZmVzdCkudG9FcXVhbChKU09OLnN0cmluZ2lmeShbXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgIGtpbmQ6ICdEZXBsb3ltZW50JyxcbiAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICdhd3MuY2RrLmVrcy9wcnVuZS1jODk3MTk3MjQ0MGM1YmIzNjYxZTQ2OGU0Y2I4MDY5ZjdlZTU0OTQxNGMnOiAnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0pKTtcbiAgICAgIGV4cGVjdChtMS5QcnVuZUxhYmVsKS50b0JlRmFsc3koKTtcbiAgICAgIGV4cGVjdChtMi5QcnVuZUxhYmVsKS50b0JlRmFsc3koKTtcbiAgICAgIGV4cGVjdChtMy5QcnVuZUxhYmVsKS50b0VxdWFsKCdhd3MuY2RrLmVrcy9wcnVuZS1jODk3MTk3MjQ0MGM1YmIzNjYxZTQ2OGU0Y2I4MDY5ZjdlZTU0OTQxNGMnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==