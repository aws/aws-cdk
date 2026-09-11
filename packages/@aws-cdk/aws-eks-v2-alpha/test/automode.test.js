"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const eks = require("../lib");
const util_1 = require("./util");
const CLUSTER_VERSION = eks.KubernetesVersion.V1_33;
describe('eks auto mode', () => {
    describe('basic configuration', () => {
        test('auto mode is enabled by default', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: true,
                    NodePools: ['system', 'general-purpose'],
                },
                KubernetesNetworkConfig: {
                    ElasticLoadBalancing: {
                        Enabled: true,
                    },
                },
                StorageConfig: {
                    BlockStorage: {
                        Enabled: true,
                    },
                },
            });
        });
        test('auto mode can be explicitly enabled', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: true,
                    NodePools: ['system', 'general-purpose'],
                },
                KubernetesNetworkConfig: {
                    ElasticLoadBalancing: {
                        Enabled: true,
                    },
                },
                StorageConfig: {
                    BlockStorage: {
                        Enabled: true,
                    },
                },
            });
        });
    });
    describe('default capacity interactions', () => {
        test('throws when defaultCapacity is set with auto mode', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                    defaultCapacity: 2,
                });
            }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode/);
        });
        test('throws when defaultCapacityInstance is set with auto mode', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                    defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
                });
            }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode/);
        });
        test('allows nodegroup with specific capacity settings', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
                defaultCapacity: 3,
                defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
            });
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: false,
                },
            });
            template.hasResourceProperties('AWS::EKS::Nodegroup', {
                ScalingConfig: {
                    DesiredSize: 3,
                    MinSize: 3,
                },
                InstanceTypes: ['t3.large'],
            });
        });
    });
    describe('node pool configuration', () => {
        test('throws when nodePools specified without auto mode', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
                    compute: {
                        nodePools: ['system', 'general-purpose'],
                    },
                });
            }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
        });
        test('throws when nodeRole specified without auto mode', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const customRole = new iam.Role(stack, 'CustomRole', {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            });
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
                    compute: {
                        nodeRole: customRole,
                    },
                });
            }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
        });
        test('throws when both nodePools and nodeRole specified without auto mode', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const customRole = new iam.Role(stack, 'CustomRole', {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            });
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
                    compute: {
                        nodePools: ['system', 'general-purpose'],
                        nodeRole: customRole,
                    },
                });
            }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
        });
        test('validates node pool values', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                    compute: {
                        nodePools: ['invalid-pool'],
                    },
                });
            }).toThrow(/Invalid node pool values: invalid-pool. Valid values are: general-purpose, system/);
        });
        test('validates case-sensitive node pool values', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                    compute: {
                        nodePools: ['System', 'GENERAL-PURPOSE'],
                    },
                });
            }).toThrow(/Invalid node pool values: System, GENERAL-PURPOSE. Valid values are: general-purpose, system/);
        });
        test('configures node pools in correct order', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    NodePools: assertions_1.Match.arrayEquals(['system', 'general-purpose']),
                },
            });
        });
        test('supports custom node role(new role)', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const customRole = new iam.Role(stack, 'CustomRole', {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            });
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                compute: {
                    nodeRole: customRole,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    NodeRoleArn: { 'Fn::GetAtt': ['CustomRole6D8E6809', 'Arn'] },
                },
            });
        });
        test('supports custom node role(imported role)', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const customRole = iam.Role.fromRoleArn(stack, 'CustomRole', 'arn:aws:iam::123456789012:role/CustomRole');
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                compute: {
                    nodeRole: customRole,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    NodeRoleArn: 'arn:aws:iam::123456789012:role/CustomRole',
                },
            });
        });
        test('does not include nodeRoleArn when nodePools is empty', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                compute: {
                    nodePools: [],
                },
            });
            // Verify that nodeRoleArn is not included in the CloudFormation template
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: true,
                    NodePools: [],
                },
            });
            // Verify that nodeRoleArn is not present in the ComputeConfig
            const template = assertions_1.Template.fromStack(stack);
            const cluster = template.findResources('AWS::EKS::Cluster');
            const clusterLogicalId = Object.keys(cluster)[0];
            const computeConfig = cluster[clusterLogicalId].Properties.ComputeConfig;
            expect(computeConfig).not.toHaveProperty('NodeRoleArn');
            // Verify that no IAM role resource is created for node pools
            // The role would typically have a logical ID like 'ClusterClusternodePoolRole...'
            const iamRoles = template.findResources('AWS::IAM::Role');
            const nodePoolRoleKeys = Object.keys(iamRoles).filter(key => key.includes('nodePoolRole'));
            expect(nodePoolRoleKeys.length).toBe(0);
        });
    });
    describe('network configuration', () => {
        test('supports private endpoint access', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
                endpointAccess: eks.EndpointAccess.PRIVATE,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ResourcesVpcConfig: assertions_1.Match.objectLike({
                    EndpointPrivateAccess: true,
                    EndpointPublicAccess: false,
                }),
                KubernetesNetworkConfig: {
                    ElasticLoadBalancing: {
                        Enabled: true,
                    },
                },
            });
        });
    });
    describe('mixed scenarios', () => {
        test('supports auto mode with explicit node groups', () => {
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
            });
            cluster.addNodegroupCapacity('CpuNodegroup', {
                minSize: 1,
                instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE)],
                labels: { workload: 'cpu-intensive' },
            });
            cluster.addNodegroupCapacity('MemoryNodegroup', {
                minSize: 1,
                instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.XLARGE)],
                labels: { workload: 'memory-intensive' },
            });
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: true,
                    NodePools: ['system', 'general-purpose'],
                },
            });
            template.resourceCountIs('AWS::EKS::Nodegroup', 2);
            // cluster should support auto mode
            template.hasResourceProperties('AWS::EKS::Cluster', {
                ComputeConfig: {
                    Enabled: true,
                    NodePools: ['system', 'general-purpose'],
                },
                StorageConfig: {
                    BlockStorage: {
                        Enabled: true,
                    },
                },
                KubernetesNetworkConfig: {
                    ElasticLoadBalancing: {
                        Enabled: true,
                    },
                },
            });
            // as well as nodegroups
            template.hasResourceProperties('AWS::EKS::Nodegroup', {
                ScalingConfig: { MinSize: 1 },
                InstanceTypes: ['c5.xlarge'],
                Labels: { workload: 'cpu-intensive' },
            });
            template.hasResourceProperties('AWS::EKS::Nodegroup', {
                ScalingConfig: { MinSize: 1 },
                InstanceTypes: ['r5.xlarge'],
                Labels: { workload: 'memory-intensive' },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b21vZGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dG9tb2RlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBeUQ7QUFDekQsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFDOUIsaUNBQTBDO0FBRTFDLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7QUFFcEQsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDN0IsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNuQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQzNDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFBLHVCQUFnQixHQUFFLENBQUM7WUFDckMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSxlQUFlO2FBQ3pCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO2dCQUNuRSxhQUFhLEVBQUU7b0JBQ2IsT0FBTyxFQUFFLElBQUk7b0JBQ2IsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDO2lCQUN6QztnQkFDRCx1QkFBdUIsRUFBRTtvQkFDdkIsb0JBQW9CLEVBQUU7d0JBQ3BCLE9BQU8sRUFBRSxJQUFJO3FCQUNkO2lCQUNGO2dCQUNELGFBQWEsRUFBRTtvQkFDYixZQUFZLEVBQUU7d0JBQ1osT0FBTyxFQUFFLElBQUk7cUJBQ2Q7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUEsdUJBQWdCLEdBQUUsQ0FBQztZQUNy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QzVCLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRTthQUN6QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmVOb1ZwYyB9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IENMVVNURVJfVkVSU0lPTiA9IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMztcblxuZGVzY3JpYmUoJ2VrcyBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdiYXNpYyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2F1dG8gbW9kZSBpcyBlbmFibGVkIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpDbHVzdGVyJywge1xuICAgICAgICBDb21wdXRlQ29uZmlnOiB7XG4gICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBOb2RlUG9vbHM6IFsnc3lzdGVtJywgJ2dlbmVyYWwtcHVycG9zZSddLFxuICAgICAgICB9LFxuICAgICAgICBLdWJlcm5ldGVzTmV0d29ya0NvbmZpZzoge1xuICAgICAgICAgIEVsYXN0aWNMb2FkQmFsYW5jaW5nOiB7XG4gICAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFN0b3JhZ2VDb25maWc6IHtcbiAgICAgICAgICBCbG9ja1N0b3JhZ2U6IHtcbiAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXV0byBtb2RlIGNhbiBiZSBleHBsaWNpdGx5IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgQ29tcHV0ZUNvbmZpZzoge1xuICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgTm9kZVBvb2xzOiBbJ3N5c3RlbScsICdnZW5lcmFsLXB1cnBvc2UnXSxcbiAgICAgICAgfSxcbiAgICAgICAgS3ViZXJuZXRlc05ldHdvcmtDb25maWc6IHtcbiAgICAgICAgICBFbGFzdGljTG9hZEJhbGFuY2luZzoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBTdG9yYWdlQ29uZmlnOiB7XG4gICAgICAgICAgQmxvY2tTdG9yYWdlOiB7XG4gICAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHQgY2FwYWNpdHkgaW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyB3aGVuIGRlZmF1bHRDYXBhY2l0eSBpcyBzZXQgd2l0aCBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkgZGVmYXVsdENhcGFjaXR5IG9yIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlIHdoZW4gdXNpbmcgQXV0byBNb2RlLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZSBpcyBzZXQgd2l0aCBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5UMywgZWMyLkluc3RhbmNlU2l6ZS5NRURJVU0pLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGRlZmF1bHRDYXBhY2l0eSBvciBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZSB3aGVuIHVzaW5nIEF1dG8gTW9kZS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIG5vZGVncm91cCB3aXRoIHNwZWNpZmljIGNhcGFjaXR5IHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eTogMyxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuVDMsIGVjMi5JbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIENvbXB1dGVDb25maWc6IHtcbiAgICAgICAgICBFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIFNjYWxpbmdDb25maWc6IHtcbiAgICAgICAgICBEZXNpcmVkU2l6ZTogMyxcbiAgICAgICAgICBNaW5TaXplOiAzLFxuICAgICAgICB9LFxuICAgICAgICBJbnN0YW5jZVR5cGVzOiBbJ3QzLmxhcmdlJ10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vZGUgcG9vbCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyB3aGVuIG5vZGVQb29scyBzcGVjaWZpZWQgd2l0aG91dCBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICAgICAgY29tcHV0ZToge1xuICAgICAgICAgICAgbm9kZVBvb2xzOiBbJ3N5c3RlbScsICdnZW5lcmFsLXB1cnBvc2UnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGNvbXB1dGUgd2l0aG91dCB1c2luZyBEZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBub2RlUm9sZSBzcGVjaWZpZWQgd2l0aG91dCBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjdXN0b21Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnQ3VzdG9tUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxuICAgICAgICAgIGNvbXB1dGU6IHtcbiAgICAgICAgICAgIG5vZGVSb2xlOiBjdXN0b21Sb2xlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkgY29tcHV0ZSB3aXRob3V0IHVzaW5nIERlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREUvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIGJvdGggbm9kZVBvb2xzIGFuZCBub2RlUm9sZSBzcGVjaWZpZWQgd2l0aG91dCBhdXRvIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjdXN0b21Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnQ3VzdG9tUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxuICAgICAgICAgIGNvbXB1dGU6IHtcbiAgICAgICAgICAgIG5vZGVQb29sczogWydzeXN0ZW0nLCAnZ2VuZXJhbC1wdXJwb3NlJ10sXG4gICAgICAgICAgICBub2RlUm9sZTogY3VzdG9tUm9sZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGNvbXB1dGUgd2l0aG91dCB1c2luZyBEZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YWxpZGF0ZXMgbm9kZSBwb29sIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLFxuICAgICAgICAgIGNvbXB1dGU6IHtcbiAgICAgICAgICAgIG5vZGVQb29sczogWydpbnZhbGlkLXBvb2wnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0ludmFsaWQgbm9kZSBwb29sIHZhbHVlczogaW52YWxpZC1wb29sLiBWYWxpZCB2YWx1ZXMgYXJlOiBnZW5lcmFsLXB1cnBvc2UsIHN5c3RlbS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndmFsaWRhdGVzIGNhc2Utc2Vuc2l0aXZlIG5vZGUgcG9vbCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgICAgICBjb21wdXRlOiB7XG4gICAgICAgICAgICBub2RlUG9vbHM6IFsnU3lzdGVtJywgJ0dFTkVSQUwtUFVSUE9TRSddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvSW52YWxpZCBub2RlIHBvb2wgdmFsdWVzOiBTeXN0ZW0sIEdFTkVSQUwtUFVSUE9TRS4gVmFsaWQgdmFsdWVzIGFyZTogZ2VuZXJhbC1wdXJwb3NlLCBzeXN0ZW0vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvbmZpZ3VyZXMgbm9kZSBwb29scyBpbiBjb3JyZWN0IG9yZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIENvbXB1dGVDb25maWc6IHtcbiAgICAgICAgICBOb2RlUG9vbHM6IE1hdGNoLmFycmF5RXF1YWxzKFsnc3lzdGVtJywgJ2dlbmVyYWwtcHVycG9zZSddKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3VwcG9ydHMgY3VzdG9tIG5vZGUgcm9sZShuZXcgcm9sZSknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjdXN0b21Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnQ3VzdG9tUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgICAgY29tcHV0ZToge1xuICAgICAgICAgIG5vZGVSb2xlOiBjdXN0b21Sb2xlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgQ29tcHV0ZUNvbmZpZzoge1xuICAgICAgICAgIE5vZGVSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydDdXN0b21Sb2xlNkQ4RTY4MDknLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3VwcG9ydHMgY3VzdG9tIG5vZGUgcm9sZShpbXBvcnRlZCByb2xlKScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgIGNvbnN0IGN1c3RvbVJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ0N1c3RvbVJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL0N1c3RvbVJvbGUnKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5BVVRPTU9ERSxcbiAgICAgICAgY29tcHV0ZToge1xuICAgICAgICAgIG5vZGVSb2xlOiBjdXN0b21Sb2xlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgQ29tcHV0ZUNvbmZpZzoge1xuICAgICAgICAgIE5vZGVSb2xlQXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL0N1c3RvbVJvbGUnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBpbmNsdWRlIG5vZGVSb2xlQXJuIHdoZW4gbm9kZVBvb2xzIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLFxuICAgICAgICBjb21wdXRlOiB7XG4gICAgICAgICAgbm9kZVBvb2xzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBWZXJpZnkgdGhhdCBub2RlUm9sZUFybiBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIENvbXB1dGVDb25maWc6IHtcbiAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIE5vZGVQb29sczogW10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgbm9kZVJvbGVBcm4gaXMgbm90IHByZXNlbnQgaW4gdGhlIENvbXB1dGVDb25maWdcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSB0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdBV1M6OkVLUzo6Q2x1c3RlcicpO1xuICAgICAgY29uc3QgY2x1c3RlckxvZ2ljYWxJZCA9IE9iamVjdC5rZXlzKGNsdXN0ZXIpWzBdO1xuICAgICAgY29uc3QgY29tcHV0ZUNvbmZpZyA9IGNsdXN0ZXJbY2x1c3RlckxvZ2ljYWxJZF0uUHJvcGVydGllcy5Db21wdXRlQ29uZmlnO1xuXG4gICAgICBleHBlY3QoY29tcHV0ZUNvbmZpZykubm90LnRvSGF2ZVByb3BlcnR5KCdOb2RlUm9sZUFybicpO1xuXG4gICAgICAvLyBWZXJpZnkgdGhhdCBubyBJQU0gcm9sZSByZXNvdXJjZSBpcyBjcmVhdGVkIGZvciBub2RlIHBvb2xzXG4gICAgICAvLyBUaGUgcm9sZSB3b3VsZCB0eXBpY2FsbHkgaGF2ZSBhIGxvZ2ljYWwgSUQgbGlrZSAnQ2x1c3RlckNsdXN0ZXJub2RlUG9vbFJvbGUuLi4nXG4gICAgICBjb25zdCBpYW1Sb2xlcyA9IHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6SUFNOjpSb2xlJyk7XG4gICAgICBjb25zdCBub2RlUG9vbFJvbGVLZXlzID0gT2JqZWN0LmtleXMoaWFtUm9sZXMpLmZpbHRlcihrZXkgPT5cbiAgICAgICAga2V5LmluY2x1ZGVzKCdub2RlUG9vbFJvbGUnKSxcbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdChub2RlUG9vbFJvbGVLZXlzLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25ldHdvcmsgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdzdXBwb3J0cyBwcml2YXRlIGVuZHBvaW50IGFjY2VzcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREUsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIFJlc291cmNlc1ZwY0NvbmZpZzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgRW5kcG9pbnRQcml2YXRlQWNjZXNzOiB0cnVlLFxuICAgICAgICAgIEVuZHBvaW50UHVibGljQWNjZXNzOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIEt1YmVybmV0ZXNOZXR3b3JrQ29uZmlnOiB7XG4gICAgICAgICAgRWxhc3RpY0xvYWRCYWxhbmNpbmc6IHtcbiAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbWl4ZWQgc2NlbmFyaW9zJywgKCkgPT4ge1xuICAgIHRlc3QoJ3N1cHBvcnRzIGF1dG8gbW9kZSB3aXRoIGV4cGxpY2l0IG5vZGUgZ3JvdXBzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREUsXG4gICAgICB9KTtcblxuICAgICAgY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnQ3B1Tm9kZWdyb3VwJywge1xuICAgICAgICBtaW5TaXplOiAxLFxuICAgICAgICBpbnN0YW5jZVR5cGVzOiBbZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5DNSwgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UpXSxcbiAgICAgICAgbGFiZWxzOiB7IHdvcmtsb2FkOiAnY3B1LWludGVuc2l2ZScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdNZW1vcnlOb2RlZ3JvdXAnLCB7XG4gICAgICAgIG1pblNpemU6IDEsXG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlI1LCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSldLFxuICAgICAgICBsYWJlbHM6IHsgd29ya2xvYWQ6ICdtZW1vcnktaW50ZW5zaXZlJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIENvbXB1dGVDb25maWc6IHtcbiAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIE5vZGVQb29sczogWydzeXN0ZW0nLCAnZ2VuZXJhbC1wdXJwb3NlJ10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywgMik7XG4gICAgICAvLyBjbHVzdGVyIHNob3VsZCBzdXBwb3J0IGF1dG8gbW9kZVxuICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgQ29tcHV0ZUNvbmZpZzoge1xuICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgTm9kZVBvb2xzOiBbJ3N5c3RlbScsICdnZW5lcmFsLXB1cnBvc2UnXSxcbiAgICAgICAgfSxcbiAgICAgICAgU3RvcmFnZUNvbmZpZzoge1xuICAgICAgICAgIEJsb2NrU3RvcmFnZToge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBLdWJlcm5ldGVzTmV0d29ya0NvbmZpZzoge1xuICAgICAgICAgIEVsYXN0aWNMb2FkQmFsYW5jaW5nOiB7XG4gICAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIC8vIGFzIHdlbGwgYXMgbm9kZWdyb3Vwc1xuICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgICBTY2FsaW5nQ29uZmlnOiB7IE1pblNpemU6IDEgfSxcbiAgICAgICAgSW5zdGFuY2VUeXBlczogWydjNS54bGFyZ2UnXSxcbiAgICAgICAgTGFiZWxzOiB7IHdvcmtsb2FkOiAnY3B1LWludGVuc2l2ZScgfSxcbiAgICAgIH0pO1xuXG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIFNjYWxpbmdDb25maWc6IHsgTWluU2l6ZTogMSB9LFxuICAgICAgICBJbnN0YW5jZVR5cGVzOiBbJ3I1LnhsYXJnZSddLFxuICAgICAgICBMYWJlbHM6IHsgd29ya2xvYWQ6ICdtZW1vcnktaW50ZW5zaXZlJyB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=