"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const asg = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const cdk8s = require("cdk8s");
const constructs_1 = require("constructs");
const YAML = require("yaml");
const util_1 = require("./util");
const eks = require("../lib");
const lib_1 = require("../lib");
const kubectl_provider_1 = require("../lib/kubectl-provider");
const bottlerocket_1 = require("../lib/private/bottlerocket");
/* eslint-disable max-len */
const CLUSTER_VERSION = eks.KubernetesVersion.V1_25;
describe('cluster', () => {
    test('can configure and access ALB controller', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            albController: {
                version: eks.AlbControllerVersion.V2_4_1,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
            Chart: 'aws-load-balancer-controller',
        });
        expect(cluster.albController).toBeDefined();
    });
    test('can specify custom environment to cluster resource handler', () => {
        const { stack } = util_1.testFixture();
        new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            clusterHandlerEnvironment: {
                foo: 'bar',
            },
        });
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.ClusterResourceProvider');
        assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
            Environment: { Variables: { foo: 'bar' } },
        });
    });
    test('can specify security group to cluster resource handler', () => {
        const { stack, vpc } = util_1.testFixture();
        const securityGroup = new ec2.SecurityGroup(stack, 'ProxyInstanceSG', {
            vpc,
            allowAllOutbound: false,
        });
        new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            placeClusterHandlerInVpc: true,
            clusterHandlerSecurityGroup: securityGroup,
        });
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.ClusterResourceProvider');
        assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
            VpcConfig: {
                SecurityGroupIds: [{ Ref: 'referencetoStackProxyInstanceSG80B79D87GroupId' }],
            },
        });
    });
    test('throws when trying to place cluster handlers in a vpc with no private subnets', () => {
        const { stack } = util_1.testFixture();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        expect(() => {
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                placeClusterHandlerInVpc: true,
                vpc: vpc,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
            });
        }).toThrow(/Cannot place cluster handler in the VPC since no private subnets could be selected/);
    });
    test('throws when provided `clusterHandlerSecurityGroup` without `placeClusterHandlerInVpc: true`', () => {
        const { stack, vpc } = util_1.testFixture();
        const securityGroup = new ec2.SecurityGroup(stack, 'ProxyInstanceSG', {
            vpc,
            allowAllOutbound: false,
        });
        expect(() => {
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                clusterHandlerSecurityGroup: securityGroup,
            });
        }).toThrow(/Cannot specify clusterHandlerSecurityGroup without placeClusterHandlerInVpc set to true/);
    });
    describe('imported Vpc from unparseable list tokens', () => {
        let stack;
        let vpc;
        beforeEach(() => {
            stack = new cdk.Stack();
            const vpcId = cdk.Fn.importValue('myVpcId');
            const availabilityZones = cdk.Fn.split(',', cdk.Fn.importValue('myAvailabilityZones'));
            const publicSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPublicSubnetIds'));
            const privateSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPrivateSubnetIds'));
            const isolatedSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myIsolatedSubnetIds'));
            vpc = ec2.Vpc.fromVpcAttributes(stack, 'importedVpc', {
                vpcId,
                availabilityZones,
                publicSubnetIds,
                privateSubnetIds,
                isolatedSubnetIds,
            });
        });
        test('throws if selecting more than one subnet group', () => {
            expect(() => new eks.Cluster(stack, 'Cluster', {
                vpc: vpc,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
                defaultCapacity: 0,
                version: eks.KubernetesVersion.V1_21,
            })).toThrow(/cannot select multiple subnet groups/);
        });
        test('synthesis works if only one subnet group is selected', () => {
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                vpc: vpc,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                defaultCapacity: 0,
                version: eks.KubernetesVersion.V1_21,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
                Config: {
                    resourcesVpcConfig: {
                        subnetIds: {
                            'Fn::Split': [
                                ',',
                                { 'Fn::ImportValue': 'myPublicSubnetIds' },
                            ],
                        },
                    },
                },
            });
        });
    });
    test('throws when accessing cluster security group for imported cluster without cluster security group id', () => {
        const { stack } = util_1.testFixture();
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
        });
        expect(() => cluster.clusterSecurityGroup).toThrow(/"clusterSecurityGroup" is not defined for this imported cluster/);
    });
    test('can place cluster handlers in the cluster vpc', () => {
        const { stack } = util_1.testFixture();
        new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            placeClusterHandlerInVpc: true,
        });
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.ClusterResourceProvider');
        const template = assertions_1.Template.fromStack(nested);
        const resources = template.findResources('AWS::Lambda::Function');
        function assertFunctionPlacedInVpc(id) {
            expect(resources[id].Properties.VpcConfig.SubnetIds).toEqual([
                { Ref: 'referencetoStackClusterDefaultVpcPrivateSubnet1SubnetA64D1BF0Ref' },
                { Ref: 'referencetoStackClusterDefaultVpcPrivateSubnet2Subnet32D85AB8Ref' },
            ]);
        }
        assertFunctionPlacedInVpc('OnEventHandler42BEBAE0');
        assertFunctionPlacedInVpc('IsCompleteHandler7073F4DA');
        assertFunctionPlacedInVpc('ProviderframeworkonEvent83C1D0A7');
        assertFunctionPlacedInVpc('ProviderframeworkisComplete26D7B0CB');
        assertFunctionPlacedInVpc('ProviderframeworkonTimeout0B47CA38');
    });
    test('can access cluster security group for imported cluster with cluster security group id', () => {
        const { stack } = util_1.testFixture();
        const clusterSgId = 'cluster-sg-id';
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
            clusterSecurityGroupId: clusterSgId,
        });
        const clusterSg = cluster.clusterSecurityGroup;
        expect(clusterSg.securityGroupId).toEqual(clusterSgId);
    });
    test('cluster security group is attached when adding self-managed nodes', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: [
                { 'Fn::GetAtt': ['ClusterselfmanagedInstanceSecurityGroup64468C3A', 'GroupId'] },
                { 'Fn::GetAtt': ['Cluster9EE0221C', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('security group of self-managed asg is not tagged with owned', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        let template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::SecurityGroup', {
            Tags: [{ Key: 'Name', Value: 'Stack/Cluster/self-managed' }],
        });
    });
    test('connect autoscaling group with imported cluster', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        const importedCluster = eks.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
            clusterName: cluster.clusterName,
            clusterSecurityGroupId: cluster.clusterSecurityGroupId,
        });
        const selfManaged = new asg.AutoScalingGroup(stack, 'self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
            vpc: vpc,
            machineImage: new ec2.AmazonLinuxImage(),
        });
        // WHEN
        importedCluster.connectAutoScalingGroupCapacity(selfManaged, {});
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: [
                { 'Fn::GetAtt': ['selfmanagedInstanceSecurityGroupEA6D80C9', 'GroupId'] },
                { 'Fn::GetAtt': ['Cluster9EE0221C', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('cluster security group is attached when connecting self-managed nodes', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        const selfManaged = new asg.AutoScalingGroup(stack, 'self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
            vpc: vpc,
            machineImage: new ec2.AmazonLinuxImage(),
        });
        // WHEN
        cluster.connectAutoScalingGroupCapacity(selfManaged, {});
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: [
                { 'Fn::GetAtt': ['selfmanagedInstanceSecurityGroupEA6D80C9', 'GroupId'] },
                { 'Fn::GetAtt': ['Cluster9EE0221C', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('spot interrupt handler is not added if spotInterruptHandler is false when connecting self-managed nodes', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        const selfManaged = new asg.AutoScalingGroup(stack, 'self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
            vpc: vpc,
            machineImage: new ec2.AmazonLinuxImage(),
            spotPrice: '0.1',
        });
        // WHEN
        cluster.connectAutoScalingGroupCapacity(selfManaged, { spotInterruptHandler: false });
        expect(cluster.node.findAll().filter(c => c.node.id === 'chart-spot-interrupt-handler').length).toEqual(0);
    });
    test('throws when a non cdk8s chart construct is added as cdk8s chart', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            prune: false,
        });
        // create a plain construct, not a cdk8s chart
        const someConstruct = new constructs_1.Construct(stack, 'SomeConstruct');
        expect(() => cluster.addCdk8sChart('chart', someConstruct)).toThrow(/Invalid cdk8s chart. Must contain a \'toJson\' method, but found undefined/);
    });
    test('throws when a core construct is added as cdk8s chart', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            prune: false,
        });
        // create a plain construct, not a cdk8s chart
        const someConstruct = new constructs_1.Construct(stack, 'SomeConstruct');
        expect(() => cluster.addCdk8sChart('chart', someConstruct)).toThrow(/Invalid cdk8s chart. Must contain a \'toJson\' method, but found undefined/);
    });
    test('cdk8s chart can be added to cluster', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            prune: false,
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
        cluster.addCdk8sChart('cdk8s-chart', chart);
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
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
    test('cluster connections include both control plane and cluster security group', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            prune: false,
        });
        expect(cluster.connections.securityGroups.map(sg => stack.resolve(sg.securityGroupId))).toEqual([
            { 'Fn::GetAtt': ['Cluster9EE0221C', 'ClusterSecurityGroupId'] },
            { 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] },
        ]);
    });
    test('can declare a security group from a different stack', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    securityGroup: props.sg,
                    vpc: props.vpc,
                });
            }
        }
        class NetworkStack extends cdk.Stack {
            constructor(scope, id) {
                super(scope, id);
                this.vpc = new ec2.Vpc(this, 'Vpc');
                this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc: this.vpc });
            }
        }
        const { app } = util_1.testFixture();
        const networkStack = new NetworkStack(app, 'NetworkStack');
        new ClusterStack(app, 'ClusterStack', { sg: networkStack.securityGroup, vpc: networkStack.vpc });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a manifest with a token from a different stack than the cluster that depends on the cluster stack', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }
        }
        class ManifestStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                // this role creates a dependency between this stack and the cluster stack
                const role = new iam.Role(this, 'CrossRole', {
                    assumedBy: new iam.ServicePrincipal('sqs.amazonaws.com'),
                    roleName: props.cluster.clusterArn,
                });
                // make sure this manifest doesn't create a dependency between the cluster stack
                // and this stack
                new eks.KubernetesManifest(this, 'cross-stack', {
                    manifest: [{
                            kind: 'ConfigMap',
                            apiVersion: 'v1',
                            metadata: {
                                name: 'config-map',
                            },
                            data: {
                                foo: role.roleArn,
                            },
                        }],
                    cluster: props.cluster,
                });
            }
        }
        const { app } = util_1.testFixture();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ManifestStack(app, 'ManifestStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a chart with a token from a different stack than the cluster that depends on the cluster stack', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }
        }
        class ChartStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                // this role creates a dependency between this stack and the cluster stack
                const role = new iam.Role(this, 'CrossRole', {
                    assumedBy: new iam.ServicePrincipal('sqs.amazonaws.com'),
                    roleName: props.cluster.clusterArn,
                });
                // make sure this chart doesn't create a dependency between the cluster stack
                // and this stack
                new eks.HelmChart(this, 'cross-stack', {
                    chart: role.roleArn,
                    cluster: props.cluster,
                });
            }
        }
        const { app } = util_1.testFixture();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a HelmChart in a different stack than the cluster', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }
        }
        class ChartStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                const resource = new cdk.CfnResource(this, 'resource', { type: 'MyType' });
                new eks.HelmChart(this, `chart-${id}`, { cluster: props.cluster, chart: resource.ref });
            }
        }
        const { app } = util_1.testFixture();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('throws when declaring an ASG role in a different stack than the cluster', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }
        }
        class CapacityStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                // the role is create in this stack implicitly by the ASG
                this.group = new asg.AutoScalingGroup(this, 'autoScaling', {
                    instanceType: new ec2.InstanceType('t3.medium'),
                    vpc: props.cluster.vpc,
                    machineImage: new eks.EksOptimizedImage({
                        kubernetesVersion: CLUSTER_VERSION.version,
                        nodeType: eks.NodeType.STANDARD,
                    }),
                });
            }
        }
        const { app } = util_1.testFixture();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        const capacityStack = new CapacityStack(app, 'CapacityStack', { cluster: clusterStack.eksCluster });
        expect(() => {
            clusterStack.eksCluster.connectAutoScalingGroupCapacity(capacityStack.group, {});
        }).toThrow('CapacityStack/autoScaling/InstanceRole should be defined in the scope of the ClusterStack stack to prevent circular dependencies');
    });
    test('can declare a ServiceAccount in a different stack than the cluster', () => {
        class ClusterStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'EKSCluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }
        }
        class AppStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                new eks.ServiceAccount(this, 'testAccount', { cluster: props.cluster, name: 'test-account', namespace: 'test' });
            }
        }
        const { app } = util_1.testFixture();
        const clusterStack = new ClusterStack(app, 'EKSCluster');
        new AppStack(app, 'KubeApp', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('a default cluster spans all subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
            Config: {
                roleArn: { 'Fn::GetAtt': ['ClusterRoleFA261979', 'Arn'] },
                version: CLUSTER_VERSION.version,
                resourcesVpcConfig: {
                    securityGroupIds: [{ 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] }],
                    subnetIds: [
                        { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
                        { Ref: 'VPCPublicSubnet2Subnet74179F39' },
                        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
                        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
                    ],
                },
            },
        });
    });
    test('cluster handler gets created with STS regional endpoint configuration', () => {
        // This is necessary to make aws-sdk-jsv2 work in opt-in regions
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
        // THEN
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.ClusterResourceProvider');
        assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    AWS_STS_REGIONAL_ENDPOINTS: 'regional',
                },
            },
        });
    });
    test('if "vpc" is not specified, vpc with default configuration will be created', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        // WHEN
        new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', assertions_1.Match.anyValue());
    });
    describe('default capacity', () => {
        test('x2 m5.large by default', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });
            // THEN
            expect(cluster.defaultNodegroup).toBeDefined();
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                InstanceTypes: [
                    'm5.large',
                ],
                ScalingConfig: {
                    DesiredSize: 2,
                    MaxSize: 2,
                    MinSize: 2,
                },
            });
        });
        test('quantity and type can be customized', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 10,
                defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            expect(cluster.defaultNodegroup).toBeDefined();
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                ScalingConfig: {
                    DesiredSize: 10,
                    MaxSize: 10,
                    MinSize: 10,
                },
            });
            // expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' }));
        });
        test('defaultCapacity=0 will not allocate at all', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
            // THEN
            expect(cluster.defaultCapacity).toBeUndefined();
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::LaunchConfiguration', 0);
        });
    });
    test('creating a cluster tags the private VPC subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
            Tags: [
                { Key: 'aws-cdk:subnet-name', Value: 'Private' },
                { Key: 'aws-cdk:subnet-type', Value: 'Private' },
                { Key: 'kubernetes.io/role/internal-elb', Value: '1' },
                { Key: 'Name', Value: 'Stack/VPC/PrivateSubnet1' },
            ],
        });
    });
    test('creating a cluster tags the public VPC subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
            MapPublicIpOnLaunch: true,
            Tags: [
                { Key: 'aws-cdk:subnet-name', Value: 'Public' },
                { Key: 'aws-cdk:subnet-type', Value: 'Public' },
                { Key: 'kubernetes.io/role/elb', Value: '1' },
                { Key: 'Name', Value: 'Stack/VPC/PublicSubnet1' },
            ],
        });
    });
    test('adding capacity creates an ASG without a rolling update policy', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('Default', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: { AutoScalingScheduledAction: { IgnoreUnmodifiedGroupSizeProperties: true } },
        });
    });
    test('adding capacity creates an ASG with tags', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('Default', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            Tags: [
                {
                    Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'Cluster9EE0221C' }]] },
                    PropagateAtLaunch: true,
                    Value: 'owned',
                },
                {
                    Key: 'Name',
                    PropagateAtLaunch: true,
                    Value: 'Stack/Cluster/Default',
                },
            ],
        });
    });
    test('create nodegroup with existing role', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        // WHEN
        const cluster = new eks.Cluster(stack, 'cluster', {
            defaultCapacity: 10,
            defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
            version: CLUSTER_VERSION,
            prune: false,
        });
        const existingRole = new iam.Role(stack, 'ExistingRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            nodeRole: existingRole,
        });
        // THEN
        expect(cluster.defaultNodegroup).toBeDefined();
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ScalingConfig: {
                DesiredSize: 10,
                MaxSize: 10,
                MinSize: 10,
            },
        });
    });
    test('adding bottlerocket capacity creates an ASG with tags', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('Bottlerocket', {
            instanceType: new ec2.InstanceType('t2.medium'),
            machineImageType: eks.MachineImageType.BOTTLEROCKET,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            Tags: [
                {
                    Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'Cluster9EE0221C' }]] },
                    PropagateAtLaunch: true,
                    Value: 'owned',
                },
                {
                    Key: 'Name',
                    PropagateAtLaunch: true,
                    Value: 'Stack/Cluster/Bottlerocket',
                },
            ],
        });
    });
    test('adding bottlerocket capacity with bootstrapOptions throws error', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        expect(() => cluster.addAutoScalingGroupCapacity('Bottlerocket', {
            instanceType: new ec2.InstanceType('t2.medium'),
            machineImageType: eks.MachineImageType.BOTTLEROCKET,
            bootstrapOptions: {},
        })).toThrow(/bootstrapOptions is not supported for Bottlerocket/);
    });
    test('import cluster with existing kubectl provider function', () => {
        const { stack } = util_1.testFixture();
        const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
        const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
            functionArn: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
            kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role',
            handlerRole: handlerRole,
        });
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
            kubectlProvider: kubectlProvider,
        });
        expect(cluster.kubectlProvider).toEqual(kubectlProvider);
    });
    describe('import cluster with existing kubectl provider function should work as expected with resources relying on kubectl getOrCreate', () => {
        test('creates helm chart', () => {
            const { stack } = util_1.testFixture();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                functionArn: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role',
                handlerRole: handlerRole,
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'cluster',
                kubectlProvider: kubectlProvider,
            });
            new eks.HelmChart(stack, 'Chart', {
                cluster: cluster,
                chart: 'chart',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
                ServiceToken: kubectlProvider.serviceToken,
                RoleArn: kubectlProvider.roleArn,
            });
        });
        test('creates Kubernetes patch', () => {
            const { stack } = util_1.testFixture();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                functionArn: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role',
                handlerRole: handlerRole,
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'cluster',
                kubectlProvider: kubectlProvider,
            });
            new eks.HelmChart(stack, 'Chart', {
                cluster: cluster,
                chart: 'chart',
            });
            new eks.KubernetesPatch(stack, 'Patch', {
                cluster: cluster,
                applyPatch: {},
                restorePatch: {},
                resourceName: 'PatchResource',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
                ServiceToken: kubectlProvider.serviceToken,
                RoleArn: kubectlProvider.roleArn,
            });
        });
        test('creates Kubernetes object value', () => {
            const { stack } = util_1.testFixture();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                functionArn: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role',
                handlerRole: handlerRole,
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'cluster',
                kubectlProvider: kubectlProvider,
            });
            new eks.HelmChart(stack, 'Chart', {
                cluster: cluster,
                chart: 'chart',
            });
            new eks.KubernetesPatch(stack, 'Patch', {
                cluster: cluster,
                applyPatch: {},
                restorePatch: {},
                resourceName: 'PatchResource',
            });
            new eks.KubernetesManifest(stack, 'Manifest', {
                cluster: cluster,
                manifest: [],
            });
            new eks.KubernetesObjectValue(stack, 'ObjectValue', {
                cluster: cluster,
                jsonPath: '',
                objectName: 'name',
                objectType: 'type',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesObjectValue', {
                ServiceToken: kubectlProvider.serviceToken,
                RoleArn: kubectlProvider.roleArn,
            });
            expect(cluster.kubectlProvider).not.toBeInstanceOf(eks.KubectlProvider);
        });
    });
    test('import cluster with new kubectl private subnets', () => {
        const { stack, vpc } = util_1.testFixture();
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
            kubectlPrivateSubnetIds: vpc.privateSubnets.map(s => s.subnetId),
        });
        expect(cluster.kubectlPrivateSubnets?.map(s => stack.resolve(s.subnetId))).toEqual([
            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ]);
        expect(cluster.kubectlPrivateSubnets?.map(s => s.node.id)).toEqual([
            'KubectlSubnet0',
            'KubectlSubnet1',
        ]);
    });
    test('exercise export/import', () => {
        // GIVEN
        const { stack: stack1, vpc, app } = util_1.testFixture();
        const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
        const cluster = new eks.Cluster(stack1, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
            vpc: cluster.vpc,
            clusterEndpoint: cluster.clusterEndpoint,
            clusterName: cluster.clusterName,
            securityGroupIds: cluster.connections.securityGroups.map(x => x.securityGroupId),
            clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
            clusterSecurityGroupId: cluster.clusterSecurityGroupId,
            clusterEncryptionConfigKeyArn: cluster.clusterEncryptionConfigKeyArn,
        });
        // this should cause an export/import
        new cdk.CfnOutput(stack2, 'ClusterARN', { value: imported.clusterArn });
        // THEN
        assertions_1.Template.fromStack(stack2).templateMatches({
            Outputs: {
                ClusterARN: {
                    Value: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':eks:us-east-1:',
                                {
                                    Ref: 'AWS::AccountId',
                                },
                                ':cluster/',
                                {
                                    'Fn::ImportValue': 'Stack:ExportsOutputRefCluster9EE0221C4853B4C3',
                                },
                            ],
                        ],
                    },
                },
            },
        });
    });
    test('mastersRole can be used to map an IAM role to "system:masters"', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            mastersRole: role,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('addManifest can be used to apply k8s manifests on this cluster', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addManifest('manifest1', { foo: 123 });
        cluster.addManifest('manifest2', { bar: 123 }, { boor: [1, 2, 3] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: '[{"foo":123}]',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: '[{"bar":123},{"boor":[1,2,3]}]',
        });
    });
    test('kubectl resources can be created in a separate stack', () => {
        // GIVEN
        const { stack, app } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false }); // cluster is under stack2
        // WHEN resource is under stack2
        const stack2 = new cdk.Stack(app, 'stack2', { env: { account: stack.account, region: stack.region } });
        new eks.KubernetesManifest(stack2, 'myresource', {
            cluster,
            manifest: [{ foo: 'bar' }],
        });
        // THEN
        app.synth(); // no cyclic dependency (see https://github.com/aws/aws-cdk/issues/7231)
        // expect a single resource in the 2nd stack
        assertions_1.Template.fromStack(stack2).templateMatches({
            Resources: {
                myresource49C6D325: {
                    Type: 'Custom::AWSCDK-EKS-KubernetesResource',
                    Properties: {
                        ServiceToken: {
                            'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttawscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6BOutputsStackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn49BEF20C',
                        },
                        Manifest: '[{\"foo\":\"bar\"}]',
                        ClusterName: { 'Fn::ImportValue': 'Stack:ExportsOutputRefclusterC5B25D0D98D553F5' },
                        RoleArn: { 'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttclusterCreationRole2B3B5002ArnF05122FC' },
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
    test('adding capacity will automatically map its IAM role', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('default', {
            instanceType: new ec2.InstanceType('t2.nano'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterdefaultInstanceRoleF20A29CD',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('addAutoScalingGroupCapacity will *not* map the IAM role if mapRole is false', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('default', {
            instanceType: new ec2.InstanceType('t2.nano'),
            mapRole: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    describe('outputs', () => {
        test('aws eks update-kubeconfig is the only output synthesized by default', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['ClusterMastersRole9AA35625', 'Arn'] }]] } },
                ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['ClusterMastersRole9AA35625', 'Arn'] }]] } },
            });
        });
        test('if masters role is defined, it should be included in the config command', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
            new eks.Cluster(stack, 'Cluster', {
                mastersRole,
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
                ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
            });
        });
        test('if `outputConfigCommand=false` will disabled the output', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
            new eks.Cluster(stack, 'Cluster', {
                mastersRole,
                outputConfigCommand: false,
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toBeUndefined(); // no outputs
        });
        test('`outputClusterName` can be used to synthesize an output with the cluster name', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                outputConfigCommand: false,
                outputClusterName: true,
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterClusterNameEB26049E: { Value: { Ref: 'Cluster9EE0221C' } },
            });
        });
        test('`outputMastersRoleArn` can be used to synthesize an output with the arn of the masters role if defined', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                outputConfigCommand: false,
                outputMastersRoleArn: true,
                mastersRole: new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() }),
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterMastersRoleArnB15964B1: { Value: { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] } },
            });
        });
        describe('boostrap user-data', () => {
            test('rendered by default for ASGs', () => {
                // GIVEN
                const { app, stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                // WHEN
                cluster.addAutoScalingGroupCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });
                // THEN
                const template = app.synth().getStackByName(stack.stackName).template;
                const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
            });
            test('not rendered if bootstrap is disabled', () => {
                // GIVEN
                const { app, stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                // WHEN
                cluster.addAutoScalingGroupCapacity('MyCapcity', {
                    instanceType: new ec2.InstanceType('m3.xlargs'),
                    bootstrapEnabled: false,
                });
                // THEN
                const template = app.synth().getStackByName(stack.stackName).template;
                const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                expect(userData).toEqual({ 'Fn::Base64': '#!/bin/bash' });
            });
            // cursory test for options: see test.user-data.ts for full suite
            test('bootstrap options', () => {
                // GIVEN
                const { app, stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                // WHEN
                cluster.addAutoScalingGroupCapacity('MyCapcity', {
                    instanceType: new ec2.InstanceType('m3.xlargs'),
                    bootstrapOptions: {
                        kubeletExtraArgs: '--node-labels FOO=42',
                    },
                });
                // THEN
                const template = app.synth().getStackByName(stack.stackName).template;
                const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --apiserver-endpoint \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
            });
            describe('spot instances', () => {
                test('nodes labeled an tainted accordingly', () => {
                    // GIVEN
                    const { app, stack } = util_1.testFixtureNoVpc();
                    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                    // WHEN
                    cluster.addAutoScalingGroupCapacity('MyCapcity', {
                        instanceType: new ec2.InstanceType('m3.xlargs'),
                        spotPrice: '0.01',
                    });
                    // THEN
                    const template = app.synth().getStackByName(stack.stackName).template;
                    const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                    expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --apiserver-endpoint \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['Cluster9EE0221C', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
                });
                test('interrupt handler is added', () => {
                    // GIVEN
                    const { stack } = util_1.testFixtureNoVpc();
                    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                    // WHEN
                    cluster.addAutoScalingGroupCapacity('MyCapcity', {
                        instanceType: new ec2.InstanceType('m3.xlarge'),
                        spotPrice: '0.01',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties(eks.HelmChart.RESOURCE_TYPE, {
                        Release: 'stackclusterchartspotinterrupthandlerdec62e07',
                        Chart: 'aws-node-termination-handler',
                        Values: '{\"nodeSelector\":{\"lifecycle\":\"Ec2Spot\"}}',
                        Namespace: 'kube-system',
                        Repository: 'https://aws.github.io/eks-charts',
                    });
                });
                test('interrupt handler is not added when spotInterruptHandler is false', () => {
                    // GIVEN
                    const { stack } = util_1.testFixtureNoVpc();
                    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                    // WHEN
                    cluster.addAutoScalingGroupCapacity('MyCapcity', {
                        instanceType: new ec2.InstanceType('m3.xlarge'),
                        spotPrice: '0.01',
                        spotInterruptHandler: false,
                    });
                    // THEN
                    expect(cluster.node.findAll().filter(c => c.node.id === 'chart-spot-interrupt-handler').length).toEqual(0);
                });
                test('its possible to add two capacities with spot instances and only one stop handler will be installed', () => {
                    // GIVEN
                    const { stack } = util_1.testFixtureNoVpc();
                    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
                    // WHEN
                    cluster.addAutoScalingGroupCapacity('Spot1', {
                        instanceType: new ec2.InstanceType('m3.xlarge'),
                        spotPrice: '0.01',
                    });
                    cluster.addAutoScalingGroupCapacity('Spot2', {
                        instanceType: new ec2.InstanceType('m4.xlarge'),
                        spotPrice: '0.01',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).resourceCountIs(eks.HelmChart.RESOURCE_TYPE, 1);
                });
            });
        });
        test('if bootstrap is disabled cannot specify options', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
            // THEN
            expect(() => cluster.addAutoScalingGroupCapacity('MyCapcity', {
                instanceType: new ec2.InstanceType('m3.xlargs'),
                bootstrapEnabled: false,
                bootstrapOptions: { awsApiRetryAttempts: 10 },
            })).toThrow(/Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
        });
        test('EksOptimizedImage() with no nodeType always uses STANDARD with LATEST_KUBERNETES_VERSION', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            const LATEST_KUBERNETES_VERSION = '1.24';
            // WHEN
            new eks.EksOptimizedImage().getImage(stack);
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('/amazon-linux-2/'))).toEqual(true);
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes(LATEST_KUBERNETES_VERSION))).toEqual(true);
        });
        test('EksOptimizedImage() with specific kubernetesVersion return correct AMI', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.EksOptimizedImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('/amazon-linux-2/'))).toEqual(true);
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('/1.25/'))).toEqual(true);
        });
        test('default cluster capacity with ARM64 instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 1,
                version: CLUSTER_VERSION,
                prune: false,
                defaultCapacityInstance: new ec2.InstanceType('m6g.medium'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                AmiType: 'AL2_ARM_64',
            });
        });
        test('addNodegroup with ARM64 instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
                defaultCapacityInstance: new ec2.InstanceType('m6g.medium'),
            }).addNodegroupCapacity('ng', {
                instanceTypes: [new ec2.InstanceType('m6g.medium')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                AmiType: 'AL2_ARM_64',
            });
        });
        test('addNodegroupCapacity with T4g instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
                defaultCapacityInstance: new ec2.InstanceType('t4g.medium'),
            }).addNodegroupCapacity('ng', {
                instanceTypes: [new ec2.InstanceType('t4g.medium')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                AmiType: 'AL2_ARM_64',
            });
        });
        test('addAutoScalingGroupCapacity with T4g instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
            }).addAutoScalingGroupCapacity('ng', {
                instanceType: new ec2.InstanceType('t4g.medium'),
            });
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('amazon-linux-2-arm64/'))).toEqual(true);
        });
        test('addNodegroupCapacity with C7g instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
                defaultCapacityInstance: new ec2.InstanceType('c7g.large'),
            }).addNodegroupCapacity('ng', {
                instanceTypes: [new ec2.InstanceType('c7g.large')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
                AmiType: 'AL2_ARM_64',
            });
        });
        test('addAutoScalingGroupCapacity with C7g instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
            }).addAutoScalingGroupCapacity('ng', {
                instanceType: new ec2.InstanceType('c7g.large'),
            });
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('amazon-linux-2-arm64/'))).toEqual(true);
        });
        test('EKS-Optimized AMI with GPU support when addAutoScalingGroupCapacity', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
            }).addAutoScalingGroupCapacity('GPUCapacity', {
                instanceType: new ec2.InstanceType('g4dn.xlarge'),
            });
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && v.Default.includes('amazon-linux-2-gpu'))).toEqual(true);
        });
        test('EKS-Optimized AMI with ARM64 when addAutoScalingGroupCapacity', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 0,
                version: CLUSTER_VERSION,
                prune: false,
            }).addAutoScalingGroupCapacity('ARMCapacity', {
                instanceType: new ec2.InstanceType('m6g.medium'),
            });
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && v.Default.includes('/amazon-linux-2-arm64/'))).toEqual(true);
        });
        test('BottleRocketImage() with specific kubernetesVersion return correct AMI', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new bottlerocket_1.BottleRocketImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
                v.Default.includes('/bottlerocket/'))).toEqual(true);
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
                v.Default.includes('/aws-k8s-1.25/'))).toEqual(true);
        });
        test('when using custom resource a creation role & policy is defined', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            // WHEN
            new eks.Cluster(stack, 'MyCluster', {
                clusterName: 'my-cluster-name',
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
                Config: {
                    name: 'my-cluster-name',
                    roleArn: { 'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'] },
                    version: CLUSTER_VERSION.version,
                    resourcesVpcConfig: {
                        securityGroupIds: [
                            { 'Fn::GetAtt': ['MyClusterControlPlaneSecurityGroup6B658F79', 'GroupId'] },
                        ],
                        subnetIds: [
                            { Ref: 'MyClusterDefaultVpcPublicSubnet1SubnetFAE5A9B6' },
                            { Ref: 'MyClusterDefaultVpcPublicSubnet2SubnetF6D028A0' },
                            { Ref: 'MyClusterDefaultVpcPrivateSubnet1SubnetE1D0DCDB' },
                            { Ref: 'MyClusterDefaultVpcPrivateSubnet2Subnet11FEA8D0' },
                        ],
                        endpointPrivateAccess: true,
                        endpointPublicAccess: true,
                    },
                },
            });
            // role can be assumed by 3 lambda handlers (2 for the cluster resource and 1 for the kubernetes resource)
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root'],
                                    ],
                                },
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            // policy allows creation role to pass the cluster role and to interact with the cluster (given we know the explicit cluster name)
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'MyClusterRoleBA20FE72',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'eks:CreateCluster',
                                'eks:DescribeCluster',
                                'eks:DescribeUpdate',
                                'eks:DeleteCluster',
                                'eks:UpdateClusterVersion',
                                'eks:UpdateClusterConfig',
                                'eks:CreateFargateProfile',
                                'eks:TagResource',
                                'eks:UntagResource',
                            ],
                            Effect: 'Allow',
                            Resource: [{
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            ':eks:us-east-1:',
                                            {
                                                Ref: 'AWS::AccountId',
                                            },
                                            ':cluster/my-cluster-name',
                                        ],
                                    ],
                                }, {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            ':eks:us-east-1:',
                                            {
                                                Ref: 'AWS::AccountId',
                                            },
                                            ':cluster/my-cluster-name/*',
                                        ],
                                    ],
                                }],
                        },
                        {
                            Action: [
                                'eks:DescribeFargateProfile',
                                'eks:DeleteFargateProfile',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':eks:us-east-1:',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':fargateprofile/my-cluster-name/*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: 'iam:CreateServiceLinkedRole',
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: [
                                'ec2:DescribeInstances',
                                'ec2:DescribeNetworkInterfaces',
                                'ec2:DescribeSecurityGroups',
                                'ec2:DescribeSubnets',
                                'ec2:DescribeRouteTables',
                                'ec2:DescribeDhcpOptions',
                                'ec2:DescribeVpcs',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('if an explicit cluster name is not provided, the creation role policy is wider (allows interacting with all clusters)', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            // WHEN
            new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION, prune: false });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'MyClusterRoleBA20FE72',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'eks:CreateCluster',
                                'eks:DescribeCluster',
                                'eks:DescribeUpdate',
                                'eks:DeleteCluster',
                                'eks:UpdateClusterVersion',
                                'eks:UpdateClusterConfig',
                                'eks:CreateFargateProfile',
                                'eks:TagResource',
                                'eks:UntagResource',
                            ],
                            Effect: 'Allow',
                            Resource: ['*'],
                        },
                        {
                            Action: [
                                'eks:DescribeFargateProfile',
                                'eks:DeleteFargateProfile',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: 'iam:CreateServiceLinkedRole',
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: [
                                'ec2:DescribeInstances',
                                'ec2:DescribeNetworkInterfaces',
                                'ec2:DescribeSecurityGroups',
                                'ec2:DescribeSubnets',
                                'ec2:DescribeRouteTables',
                                'ec2:DescribeDhcpOptions',
                                'ec2:DescribeVpcs',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('if helm charts are used, the provider role is allowed to assume the creation role', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            const cluster = new eks.Cluster(stack, 'MyCluster', {
                clusterName: 'my-cluster-name',
                version: CLUSTER_VERSION,
                prune: false,
            });
            // WHEN
            cluster.addHelmChart('MyChart', {
                chart: 'foo',
            });
            // THEN
            const providerStack = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'eks:DescribeCluster',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'referencetoStackMyClusterD33CAEABArn',
                            },
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'referencetoStackMyClusterCreationRoleA67486E4Arn',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
                PolicyName: 'HandlerServiceRoleDefaultPolicyCBD0CC91',
                Roles: [
                    {
                        Ref: 'HandlerServiceRoleFCDC14AE',
                    },
                ],
            });
            assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' },
                        },
                    ],
                    Version: '2012-10-17',
                },
                ManagedPolicyArns: [
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/AmazonEC2ContainerRegistryReadOnly',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/AmazonElasticContainerRegistryPublicReadOnly',
                            ]],
                    },
                ],
            });
        });
        test('coreDnsComputeType will patch the coreDNS configuration to use a "fargate" compute type and restore to "ec2" upon removal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new eks.Cluster(stack, 'MyCluster', {
                coreDnsComputeType: eks.CoreDnsComputeType.FARGATE,
                version: CLUSTER_VERSION,
                prune: false,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
                ResourceName: 'deployment/coredns',
                ResourceNamespace: 'kube-system',
                ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
                RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
                ClusterName: {
                    Ref: 'MyCluster8AD82BF8',
                },
                RoleArn: {
                    'Fn::GetAtt': [
                        'MyClusterCreationRoleB5FA4FF3',
                        'Arn',
                    ],
                },
            });
        });
        test('if openIDConnectProvider a new OpenIDConnectProvider resource is created and exposed', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
            // WHEN
            const provider = cluster.openIdConnectProvider;
            // THEN
            expect(provider).toEqual(cluster.openIdConnectProvider);
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'CustomAWSCDKOpenIdConnectProviderCustomResourceProviderHandlerF2C543E0',
                        'Arn',
                    ],
                },
                ClientIDList: [
                    'sts.amazonaws.com',
                ],
                Url: {
                    'Fn::GetAtt': [
                        'Cluster9EE0221C',
                        'OpenIdConnectIssuerUrl',
                    ],
                },
            });
        });
        test('inference instances are supported', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION, prune: false });
            // WHEN
            cluster.addAutoScalingGroupCapacity('InferenceInstances', {
                instanceType: new ec2.InstanceType('inf1.2xlarge'),
                minCapacity: 1,
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '../lib', 'addons/neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('kubectl resources are always created after all fargate profiles', () => {
            // GIVEN
            const { stack, app } = util_1.testFixture();
            const cluster = new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });
            // WHEN
            cluster.addFargateProfile('profile1', { selectors: [{ namespace: 'profile1' }] });
            cluster.addManifest('resource1', { foo: 123 });
            cluster.addFargateProfile('profile2', { selectors: [{ namespace: 'profile2' }] });
            new eks.HelmChart(stack, 'chart', { cluster, chart: 'mychart' });
            cluster.addFargateProfile('profile3', { selectors: [{ namespace: 'profile3' }] });
            new eks.KubernetesPatch(stack, 'patch1', {
                cluster,
                applyPatch: { foo: 123 },
                restorePatch: { bar: 123 },
                resourceName: 'foo/bar',
            });
            cluster.addFargateProfile('profile4', { selectors: [{ namespace: 'profile4' }] });
            // THEN
            const template = app.synth().getStackArtifact(stack.artifactId).template;
            const barrier = template.Resources.ClusterKubectlReadyBarrier200052AF;
            expect(barrier.DependsOn).toEqual([
                'Clusterfargateprofileprofile1PodExecutionRoleE85F87B5',
                'Clusterfargateprofileprofile129AEA3C6',
                'Clusterfargateprofileprofile2PodExecutionRole22670AF8',
                'Clusterfargateprofileprofile233B9A117',
                'Clusterfargateprofileprofile3PodExecutionRole475C0D8F',
                'Clusterfargateprofileprofile3D06F3076',
                'Clusterfargateprofileprofile4PodExecutionRole086057FB',
                'Clusterfargateprofileprofile4A0E3BBE8',
                'ClusterCreationRoleDefaultPolicyE8BDFC7B',
                'ClusterCreationRole360249B6',
                'Cluster9EE0221C',
            ]);
            const kubectlResources = ['chartF2447AFC', 'patch1B964AC93', 'Clustermanifestresource10B1C9505', 'ClusterAwsAuthmanifestFE51F8AE'];
            // check that all kubectl resources depend on the barrier
            for (const r of kubectlResources) {
                expect(template.Resources[r].DependsOn).toEqual(['ClusterKubectlReadyBarrier200052AF']);
            }
        });
        test('kubectl provider role can assume creation role', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            const c1 = new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION, prune: false });
            // WHEN
            // activate kubectl provider
            c1.addManifest('c1a', { foo: 123 });
            c1.addManifest('c1b', { foo: 123 });
            // THEN
            const providerStack = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'eks:DescribeCluster',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'referencetoStackCluster18DFEAC17Arn',
                            },
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'referencetoStackCluster1CreationRoleEF7C9BBCArn',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' },
                        },
                    ],
                    Version: '2012-10-17',
                },
                ManagedPolicyArns: [
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/AmazonEC2ContainerRegistryReadOnly',
                            ]],
                    },
                    {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/AmazonElasticContainerRegistryPublicReadOnly',
                            ]],
                    },
                ],
            });
        });
    });
    test('kubectl provider passes security group to provider', () => {
        const { stack } = util_1.testFixture();
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            endpointAccess: eks.EndpointAccess.PRIVATE,
            kubectlEnvironment: {
                Foo: 'Bar',
            },
        });
        // the kubectl provider is inside a nested stack.
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
        assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
            VpcConfig: {
                SecurityGroupIds: [{ Ref: 'referencetoStackCluster18DFEAC17ClusterSecurityGroupId' }],
            },
        });
    });
    test('kubectl provider passes environment to lambda', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            endpointAccess: eks.EndpointAccess.PRIVATE,
            kubectlEnvironment: {
                Foo: 'Bar',
            },
        });
        cluster.addManifest('resource', {
            kind: 'ConfigMap',
            apiVersion: 'v1',
            data: {
                hello: 'world',
            },
            metadata: {
                name: 'config-map',
            },
        });
        // the kubectl provider is inside a nested stack.
        const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
        assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    Foo: 'Bar',
                },
            },
        });
    });
    describe('kubectl provider passes iam role environment to kube ctl lambda', () => {
        test('new cluster', () => {
            const { stack } = util_1.testFixture();
            const kubectlRole = new iam.Role(stack, 'KubectlIamRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // using _ syntax to silence warning about _cluster not being used, when it is
            const cluster = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                kubectlLambdaRole: kubectlRole,
            });
            cluster.addManifest('resource', {
                kind: 'ConfigMap',
                apiVersion: 'v1',
                data: {
                    hello: 'world',
                },
                metadata: {
                    name: 'config-map',
                },
            });
            // the kubectl provider is inside a nested stack.
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                Role: {
                    Ref: 'referencetoStackKubectlIamRole02F8947EArn',
                },
            });
        });
        test('imported cluster', () => {
            const clusterName = 'my-cluster';
            const stack = new cdk.Stack();
            const kubectlLambdaRole = new iam.Role(stack, 'KubectlLambdaRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Imported', {
                clusterName,
                kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
                kubectlLambdaRole: kubectlLambdaRole,
            });
            const chart = 'hello-world';
            cluster.addHelmChart('test-chart', {
                chart,
            });
            const nested = stack.node.tryFindChild('Imported-KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                Role: {
                    Ref: 'referencetoKubectlLambdaRole7D084D94Arn',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
                ClusterName: clusterName,
                RoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
                Release: 'importedcharttestchartf3acd6e5',
                Chart: chart,
                Namespace: 'default',
                CreateNamespace: true,
            });
        });
    });
    describe('endpoint access', () => {
        test('public restricted', () => {
            expect(() => {
                eks.EndpointAccess.PUBLIC.onlyFrom('1.2.3.4/32');
            }).toThrow(/Cannot restric public access to endpoint when private access is disabled. Use PUBLIC_AND_PRIVATE.onlyFrom\(\) instead./);
        });
        test('public non restricted without private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            // we don't attach vpc config in case endpoint is public only, regardless of whether
            // the vpc has private subnets or not.
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('public non restricted with private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC,
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            // we don't attach vpc config in case endpoint is public only, regardless of whether
            // the vpc has private subnets or not.
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('private without private subnets', () => {
            const { stack } = util_1.testFixture();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    endpointAccess: eks.EndpointAccess.PRIVATE,
                    vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                });
            }).toThrow(/Vpc must contain private subnets when public endpoint access is disabled/);
        });
        test('private with private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            const functions = assertions_1.Template.fromStack(nested).findResources('AWS::Lambda::Function');
            expect(functions.Handler886CB40B.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.Handler886CB40B.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
        });
        test('private and non restricted public without private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            // we don't have private subnets, but we don't need them since public access
            // is not restricted.
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('private and non restricted public with private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            // we have private subnets so we should use them.
            const functions = assertions_1.Template.fromStack(nested).findResources('AWS::Lambda::Function');
            expect(functions.Handler886CB40B.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.Handler886CB40B.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
        });
        test('private and restricted public without private subnets', () => {
            const { stack } = util_1.testFixture();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom('1.2.3.4/32'),
                    vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                });
            }).toThrow(/Vpc must contain private subnets when public endpoint access is restricted/);
        });
        test('private and restricted public with private subnets', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom('1.2.3.4/32'),
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            // we have private subnets so we should use them.
            const functions = assertions_1.Template.fromStack(nested).findResources('AWS::Lambda::Function');
            expect(functions.Handler886CB40B.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.Handler886CB40B.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
        });
        test('private endpoint access selects only private subnets from looked up vpc', () => {
            const vpcId = 'vpc-12345';
            // can't use the regular fixture because it also adds a VPC to the stack, which prevents
            // us from setting context.
            const stack = new cdk.Stack(new cdk.App(), 'Stack', {
                env: {
                    account: '11112222',
                    region: 'us-east-1',
                },
            });
            stack.node.setContext(`vpc-provider:account=${stack.account}:filter.vpc-id=${vpcId}:region=${stack.region}:returnAsymmetricSubnets=true`, {
                vpcId: vpcId,
                vpcCidrBlock: '10.0.0.0/16',
                subnetGroups: [
                    {
                        name: 'Private',
                        type: 'Private',
                        subnets: [
                            {
                                subnetId: 'subnet-private-in-us-east-1a',
                                cidr: '10.0.1.0/24',
                                availabilityZone: 'us-east-1a',
                                routeTableId: 'rtb-06068e4c4049921ef',
                            },
                        ],
                    },
                    {
                        name: 'Public',
                        type: 'Public',
                        subnets: [
                            {
                                subnetId: 'subnet-public-in-us-east-1c',
                                cidr: '10.0.0.0/24',
                                availabilityZone: 'us-east-1c',
                                routeTableId: 'rtb-0ff08e62195198dbb',
                            },
                        ],
                    },
                ],
            });
            const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
                vpcId: vpcId,
            });
            new eks.Cluster(stack, 'Cluster', {
                vpc,
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: { SubnetIds: ['subnet-private-in-us-east-1a'] },
            });
        });
        test('private endpoint access selects only private subnets from looked up vpc with concrete subnet selection', () => {
            const vpcId = 'vpc-12345';
            // can't use the regular fixture because it also adds a VPC to the stack, which prevents
            // us from setting context.
            const stack = new cdk.Stack(new cdk.App(), 'Stack', {
                env: {
                    account: '11112222',
                    region: 'us-east-1',
                },
            });
            stack.node.setContext(`vpc-provider:account=${stack.account}:filter.vpc-id=${vpcId}:region=${stack.region}:returnAsymmetricSubnets=true`, {
                vpcId: vpcId,
                vpcCidrBlock: '10.0.0.0/16',
                subnetGroups: [
                    {
                        name: 'Private',
                        type: 'Private',
                        subnets: [
                            {
                                subnetId: 'subnet-private-in-us-east-1a',
                                cidr: '10.0.1.0/24',
                                availabilityZone: 'us-east-1a',
                                routeTableId: 'rtb-06068e4c4049921ef',
                            },
                        ],
                    },
                    {
                        name: 'Public',
                        type: 'Public',
                        subnets: [
                            {
                                subnetId: 'subnet-public-in-us-east-1c',
                                cidr: '10.0.0.0/24',
                                availabilityZone: 'us-east-1c',
                                routeTableId: 'rtb-0ff08e62195198dbb',
                            },
                        ],
                    },
                ],
            });
            const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
                vpcId: vpcId,
            });
            new eks.Cluster(stack, 'Cluster', {
                vpc,
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpcSubnets: [{
                        subnets: [
                            ec2.Subnet.fromSubnetId(stack, 'Private', 'subnet-private-in-us-east-1a'),
                            ec2.Subnet.fromSubnetId(stack, 'Public', 'subnet-public-in-us-east-1c'),
                        ],
                    }],
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: { SubnetIds: ['subnet-private-in-us-east-1a'] },
            });
        });
        test('private endpoint access selects only private subnets from managed vpc with concrete subnet selection', () => {
            const { stack } = util_1.testFixture();
            const vpc = new ec2.Vpc(stack, 'Vpc');
            new eks.Cluster(stack, 'Cluster', {
                vpc,
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpcSubnets: [{
                        subnets: [
                            vpc.privateSubnets[0],
                            vpc.publicSubnets[1],
                            ec2.Subnet.fromSubnetId(stack, 'Private', 'subnet-unknown'),
                        ],
                    }],
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SubnetIds: [
                        { Ref: 'referencetoStackVpcPrivateSubnet1Subnet8E6A14CBRef' },
                        'subnet-unknown',
                    ],
                },
            });
        });
        test('private endpoint access considers specific subnet selection', () => {
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpcSubnets: [{
                        subnets: [ec2.PrivateSubnet.fromSubnetAttributes(stack, 'Private1', {
                                subnetId: 'subnet1',
                                availabilityZone: 'us-east-1a',
                            })],
                    }],
            });
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: { SubnetIds: ['subnet1'] },
            });
        });
        test('can configure private endpoint access', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION, endpointAccess: eks.EndpointAccess.PRIVATE, prune: false });
            const app = stack.node.root;
            const template = app.synth().getStackArtifact(stack.stackName).template;
            expect(template.Resources.Cluster1B02DD5A2.Properties.Config.resourcesVpcConfig.endpointPrivateAccess).toEqual(true);
            expect(template.Resources.Cluster1B02DD5A2.Properties.Config.resourcesVpcConfig.endpointPublicAccess).toEqual(false);
        });
        test('kubectl provider chooses only private subnets', () => {
            const { stack } = util_1.testFixture();
            const vpc = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 2,
                natGateways: 1,
                subnetConfiguration: [
                    {
                        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                        name: 'Private1',
                    },
                    {
                        subnetType: ec2.SubnetType.PUBLIC,
                        name: 'Public1',
                    },
                ],
            });
            const cluster = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpc,
            });
            cluster.addManifest('resource', {
                kind: 'ConfigMap',
                apiVersion: 'v1',
                data: {
                    hello: 'world',
                },
                metadata: {
                    name: 'config-map',
                },
            });
            // the kubectl provider is inside a nested stack.
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            Ref: 'referencetoStackCluster18DFEAC17ClusterSecurityGroupId',
                        },
                    ],
                    SubnetIds: [
                        {
                            Ref: 'referencetoStackVpcPrivate1Subnet1Subnet6764A0F6Ref',
                        },
                        {
                            Ref: 'referencetoStackVpcPrivate1Subnet2SubnetDFD49645Ref',
                        },
                    ],
                },
            });
        });
        test('kubectl provider limits number of subnets to 16', () => {
            const { stack } = util_1.testFixture();
            const subnetConfiguration = [];
            for (let i = 0; i < 20; i++) {
                subnetConfiguration.push({
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    name: `Private${i}`,
                });
            }
            subnetConfiguration.push({
                subnetType: ec2.SubnetType.PUBLIC,
                name: 'Public1',
            });
            const vpc2 = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 2,
                natGateways: 1,
                subnetConfiguration,
            });
            const cluster = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpc: vpc2,
            });
            cluster.addManifest('resource', {
                kind: 'ConfigMap',
                apiVersion: 'v1',
                data: {
                    hello: 'world',
                },
                metadata: {
                    name: 'config-map',
                },
            });
            // the kubectl provider is inside a nested stack.
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            const functions = assertions_1.Template.fromStack(nested).findResources('AWS::Lambda::Function');
            expect(functions.Handler886CB40B.Properties.VpcConfig.SubnetIds.length).toEqual(16);
        });
        test('kubectl provider considers vpc subnet selection', () => {
            const { stack } = util_1.testFixture();
            const subnetConfiguration = [];
            for (let i = 0; i < 20; i++) {
                subnetConfiguration.push({
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    name: `Private${i}`,
                });
            }
            subnetConfiguration.push({
                subnetType: ec2.SubnetType.PUBLIC,
                name: 'Public1',
            });
            const vpc2 = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 2,
                natGateways: 1,
                subnetConfiguration,
            });
            const cluster = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                vpc: vpc2,
                vpcSubnets: [{ subnetGroupName: 'Private1' }, { subnetGroupName: 'Private2' }],
            });
            cluster.addManifest('resource', {
                kind: 'ConfigMap',
                apiVersion: 'v1',
                data: {
                    hello: 'world',
                },
                metadata: {
                    name: 'config-map',
                },
            });
            // the kubectl provider is inside a nested stack.
            const nested = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
            assertions_1.Template.fromStack(nested).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            Ref: 'referencetoStackCluster18DFEAC17ClusterSecurityGroupId',
                        },
                    ],
                    SubnetIds: [
                        {
                            Ref: 'referencetoStackVpcPrivate1Subnet1Subnet6764A0F6Ref',
                        },
                        {
                            Ref: 'referencetoStackVpcPrivate1Subnet2SubnetDFD49645Ref',
                        },
                        {
                            Ref: 'referencetoStackVpcPrivate2Subnet1Subnet586AD392Ref',
                        },
                        {
                            Ref: 'referencetoStackVpcPrivate2Subnet2SubnetE42148C0Ref',
                        },
                    ],
                },
            });
        });
        test('throw when private access is configured without dns support enabled for the VPC', () => {
            const { stack } = util_1.testFixture();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    vpc: new ec2.Vpc(stack, 'Vpc', {
                        enableDnsSupport: false,
                    }),
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }).toThrow(/Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled/);
        });
        test('throw when private access is configured without dns hostnames enabled for the VPC', () => {
            const { stack } = util_1.testFixture();
            expect(() => {
                new eks.Cluster(stack, 'Cluster', {
                    vpc: new ec2.Vpc(stack, 'Vpc', {
                        enableDnsHostnames: false,
                    }),
                    version: CLUSTER_VERSION,
                    prune: false,
                });
            }).toThrow(/Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled/);
        });
        test('throw when cidrs are configured without public access endpoint', () => {
            expect(() => {
                eks.EndpointAccess.PRIVATE.onlyFrom('1.2.3.4/5');
            }).toThrow(/CIDR blocks can only be configured when public access is enabled/);
        });
    });
    test('getServiceLoadBalancerAddress', () => {
        const { stack } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION, prune: false });
        const loadBalancerAddress = cluster.getServiceLoadBalancerAddress('myservice');
        new cdk.CfnOutput(stack, 'LoadBalancerAddress', {
            value: loadBalancerAddress,
        });
        const expectedKubernetesGetId = 'Cluster1myserviceLoadBalancerAddress198CCB03';
        let template = assertions_1.Template.fromStack(stack);
        const resources = template.findResources('Custom::AWSCDK-EKS-KubernetesObjectValue');
        // make sure the custom resource is created correctly
        expect(resources[expectedKubernetesGetId].Properties).toEqual({
            ServiceToken: {
                'Fn::GetAtt': [
                    'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                    'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
                ],
            },
            ClusterName: {
                Ref: 'Cluster1B02DD5A2',
            },
            RoleArn: {
                'Fn::GetAtt': [
                    'Cluster1CreationRoleA231BE8D',
                    'Arn',
                ],
            },
            ObjectType: 'service',
            ObjectName: 'myservice',
            ObjectNamespace: 'default',
            JsonPath: '.status.loadBalancer.ingress[0].hostname',
            TimeoutSeconds: 300,
        });
        // make sure the attribute points to the expected custom resource and extracts the correct attribute
        template.hasOutput('LoadBalancerAddress', {
            Value: { 'Fn::GetAtt': [expectedKubernetesGetId, 'Value'] },
        });
    });
    test('custom kubectl layer can be provided', () => {
        // GIVEN
        const { stack } = util_1.testFixture();
        // WHEN
        const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            kubectlLayer: layer,
        });
        // THEN
        const providerStack = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
        assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::Lambda::Function', {
            Layers: [
                { Ref: 'AwsCliLayerF44AAF94' },
                'arn:of:layer',
            ],
        });
    });
    describe('kubectlLayer annotation', () => {
        function message(version) {
            return [
                `You created a cluster with Kubernetes Version 1.${version} without specifying the kubectlLayer property.`,
                'This may cause failures as the kubectl version provided with aws-cdk-lib is 1.20, which is only guaranteed to be compatible with Kubernetes versions 1.19-1.21.',
                `Please provide a kubectlLayer from @aws-cdk/lambda-layer-kubectl-v${version}.`,
            ].join(' ');
        }
        test('not added when version < 1.22 and no kubectl layer provided', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            // WHEN
            new eks.Cluster(stack, 'Cluster1', {
                version: eks.KubernetesVersion.V1_21,
                prune: false,
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasNoWarning('/Stack/Cluster1', message('21'));
        });
        test('added when version >= 1.22 and no kubectl layer provided', () => {
            // GIVEN
            const { stack } = util_1.testFixture();
            // WHEN
            new eks.Cluster(stack, 'Cluster1', {
                version: eks.KubernetesVersion.V1_24,
                prune: false,
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Stack/Cluster1', message('24'));
        });
    });
    test('custom awscli layer can be provided', () => {
        // GIVEN
        const { stack } = util_1.testFixture();
        // WHEN
        const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            awscliLayer: layer,
        });
        // THEN
        const providerStack = stack.node.tryFindChild('@aws-cdk/aws-eks.KubectlProvider');
        assertions_1.Template.fromStack(providerStack).hasResourceProperties('AWS::Lambda::Function', {
            Layers: [
                'arn:of:layer',
                { Ref: 'KubectlLayer600207B5' },
            ],
        });
    });
    test('create a cluster using custom resource with secrets encryption using KMS CMK', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
            prune: false,
            secretsEncryptionKey: new kms.Key(stack, 'Key'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
            Config: {
                encryptionConfig: [{
                        provider: {
                            keyArn: {
                                'Fn::GetAtt': [
                                    'Key961B73FD',
                                    'Arn',
                                ],
                            },
                        },
                        resources: ['secrets'],
                    }],
            },
        });
    });
    test('custom memory size for kubectl provider', () => {
        // GIVEN
        const { stack, vpc, app } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
            kubectlMemory: cdk.Size.gibibytes(2),
        });
        // THEN
        const casm = app.synth();
        const providerNestedStackTemplate = JSON.parse(fs.readFileSync(path.join(casm.directory, 'StackawscdkawseksKubectlProvider7346F799.nested.template.json'), 'utf-8'));
        expect(providerNestedStackTemplate?.Resources?.Handler886CB40B?.Properties?.MemorySize).toEqual(2048);
    });
    test('custom memory size for imported clusters', () => {
        // GIVEN
        const { stack, app } = util_1.testFixture();
        // WHEN
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Imported', {
            clusterName: 'my-cluster',
            kubectlRoleArn: 'arn:aws:iam::123456789012:role/MyRole',
            kubectlMemory: cdk.Size.gibibytes(4),
        });
        cluster.addManifest('foo', { bar: 123 });
        // THEN
        const casm = app.synth();
        const providerNestedStackTemplate = JSON.parse(fs.readFileSync(path.join(casm.directory, 'StackStackImported1CBA9C50KubectlProviderAA00BA49.nested.template.json'), 'utf-8'));
        expect(providerNestedStackTemplate?.Resources?.Handler886CB40B?.Properties?.MemorySize).toEqual(4096);
    });
    test('create a cluster using custom kubernetes network config', () => {
        // GIVEN
        const { stack } = util_1.testFixture();
        const customCidr = '172.16.0.0/12';
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            serviceIpv4Cidr: customCidr,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
            Config: {
                kubernetesNetworkConfig: {
                    serviceIpv4Cidr: customCidr,
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixvREFBbUU7QUFDbkUsZ0RBQWdEO0FBQ2hELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsK0JBQStCO0FBQy9CLDJDQUF1QztBQUN2Qyw2QkFBNkI7QUFDN0IsaUNBQXVEO0FBQ3ZELDhCQUE4QjtBQUM5QixnQ0FBbUM7QUFDbkMsOERBQTBEO0FBQzFELDhEQUFnRTtBQUVoRSw0QkFBNEI7QUFFNUIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztBQUVwRCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxrQkFBVyxFQUFFLENBQUM7UUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsb0JBQW9CLENBQUMsTUFBTTthQUN6QztTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLEtBQUssRUFBRSw4QkFBOEI7U0FDdEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7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LElBQUksQ0FBQyxTQUFTLEVBQUUsd0VBQXdFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlLLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsa0JBQVcsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQztRQUVuQyxPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsZUFBZSxFQUFFLFVBQVU7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRCQUE0QixFQUFFO1lBQzVFLE1BQU0sRUFBRTtnQkFDTix1QkFBdUIsRUFBRTtvQkFDdkIsZUFBZSxFQUFFLFVBQVU7aUJBQzVCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGFzZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2RrOHMgZnJvbSAnY2RrOHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBZQU1MIGZyb20gJ3lhbWwnO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUsIHRlc3RGaXh0dXJlTm9WcGMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBIZWxtQ2hhcnQgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgS3ViZWN0bFByb3ZpZGVyIH0gZnJvbSAnLi4vbGliL2t1YmVjdGwtcHJvdmlkZXInO1xuaW1wb3J0IHsgQm90dGxlUm9ja2V0SW1hZ2UgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9ib3R0bGVyb2NrZXQnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmNvbnN0IENMVVNURVJfVkVSU0lPTiA9IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8yNTtcblxuZGVzY3JpYmUoJ2NsdXN0ZXInLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBjb25maWd1cmUgYW5kIGFjY2VzcyBBTEIgY29udHJvbGxlcicsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBhbGJDb250cm9sbGVyOiB7XG4gICAgICAgIHZlcnNpb246IGVrcy5BbGJDb250cm9sbGVyVmVyc2lvbi5WMl80XzEsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1IZWxtQ2hhcnQnLCB7XG4gICAgICBDaGFydDogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgIH0pO1xuICAgIGV4cGVjdChjbHVzdGVyLmFsYkNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IGN1c3RvbSBlbnZpcm9ubWVudCB0byBjbHVzdGVyIHJlc291cmNlIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBjbHVzdGVySGFuZGxlckVudmlyb25tZW50OiB7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmVzdGVkID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ0Bhd3MtY2RrL2F3cy1la3MuQ2x1c3RlclJlc291cmNlUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIEVudmlyb25tZW50OiB7IFZhcmlhYmxlczogeyBmb286ICdiYXInIH0gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgc2VjdXJpdHkgZ3JvdXAgdG8gY2x1c3RlciByZXNvdXJjZSBoYW5kbGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnUHJveHlJbnN0YW5jZVNHJywge1xuICAgICAgdnBjLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcGxhY2VDbHVzdGVySGFuZGxlckluVnBjOiB0cnVlLFxuICAgICAgY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwOiBzZWN1cml0eUdyb3VwLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmVzdGVkID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ0Bhd3MtY2RrL2F3cy1la3MuQ2x1c3RlclJlc291cmNlUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFZwY0NvbmZpZzoge1xuICAgICAgICBTZWN1cml0eUdyb3VwSWRzOiBbeyBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrUHJveHlJbnN0YW5jZVNHODBCNzlEODdHcm91cElkJyB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHRyeWluZyB0byBwbGFjZSBjbHVzdGVyIGhhbmRsZXJzIGluIGEgdnBjIHdpdGggbm8gcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcGxhY2VDbHVzdGVySGFuZGxlckluVnBjOiB0cnVlLFxuICAgICAgICB2cGM6IHZwYyxcbiAgICAgICAgdnBjU3VibmV0czogW3sgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH1dLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IHBsYWNlIGNsdXN0ZXIgaGFuZGxlciBpbiB0aGUgVlBDIHNpbmNlIG5vIHByaXZhdGUgc3VibmV0cyBjb3VsZCBiZSBzZWxlY3RlZC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBwcm92aWRlZCBgY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwYCB3aXRob3V0IGBwbGFjZUNsdXN0ZXJIYW5kbGVySW5WcGM6IHRydWVgJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnUHJveHlJbnN0YW5jZVNHJywge1xuICAgICAgdnBjLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBjbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXA6IHNlY3VyaXR5R3JvdXAsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3Qgc3BlY2lmeSBjbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXAgd2l0aG91dCBwbGFjZUNsdXN0ZXJIYW5kbGVySW5WcGMgc2V0IHRvIHRydWUvKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ltcG9ydGVkIFZwYyBmcm9tIHVucGFyc2VhYmxlIGxpc3QgdG9rZW5zJywgKCkgPT4ge1xuICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICAgIGxldCB2cGM6IGVjMi5JVnBjO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwY0lkID0gY2RrLkZuLmltcG9ydFZhbHVlKCdteVZwY0lkJyk7XG4gICAgICBjb25zdCBhdmFpbGFiaWxpdHlab25lcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlBdmFpbGFiaWxpdHlab25lcycpKTtcbiAgICAgIGNvbnN0IHB1YmxpY1N1Ym5ldElkcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlQdWJsaWNTdWJuZXRJZHMnKSk7XG4gICAgICBjb25zdCBwcml2YXRlU3VibmV0SWRzID0gY2RrLkZuLnNwbGl0KCcsJywgY2RrLkZuLmltcG9ydFZhbHVlKCdteVByaXZhdGVTdWJuZXRJZHMnKSk7XG4gICAgICBjb25zdCBpc29sYXRlZFN1Ym5ldElkcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlJc29sYXRlZFN1Ym5ldElkcycpKTtcblxuICAgICAgdnBjID0gZWMyLlZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkVnBjJywge1xuICAgICAgICB2cGNJZCxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXMsXG4gICAgICAgIHB1YmxpY1N1Ym5ldElkcyxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldElkcyxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXRJZHMsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBzZWxlY3RpbmcgbW9yZSB0aGFuIG9uZSBzdWJuZXQgZ3JvdXAnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjOiB2cGMsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LCB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfV0sXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgICAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzIxLFxuICAgICAgfSkpLnRvVGhyb3coL2Nhbm5vdCBzZWxlY3QgbXVsdGlwbGUgc3VibmV0IGdyb3Vwcy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3ludGhlc2lzIHdvcmtzIGlmIG9ubHkgb25lIHN1Ym5ldCBncm91cCBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYzogdnBjLFxuICAgICAgICB2cGNTdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfV0sXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgICAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzIxLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtQ2x1c3RlcicsIHtcbiAgICAgICAgQ29uZmlnOiB7XG4gICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICBzdWJuZXRJZHM6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgeyAnRm46OkltcG9ydFZhbHVlJzogJ215UHVibGljU3VibmV0SWRzJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGFjY2Vzc2luZyBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGZvciBpbXBvcnRlZCBjbHVzdGVyIHdpdGhvdXQgY2x1c3RlciBzZWN1cml0eSBncm91cCBpZCcsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXInLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuY2x1c3RlclNlY3VyaXR5R3JvdXApLnRvVGhyb3coL1wiY2x1c3RlclNlY3VyaXR5R3JvdXBcIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBwbGFjZSBjbHVzdGVyIGhhbmRsZXJzIGluIHRoZSBjbHVzdGVyIHZwYycsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBsYWNlQ2x1c3RlckhhbmRsZXJJblZwYzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkNsdXN0ZXJSZXNvdXJjZVByb3ZpZGVyJykgYXMgY2RrLk5lc3RlZFN0YWNrO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCk7XG4gICAgY29uc3QgcmVzb3VyY2VzID0gdGVtcGxhdGUuZmluZFJlc291cmNlcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyk7XG5cbiAgICBmdW5jdGlvbiBhc3NlcnRGdW5jdGlvblBsYWNlZEluVnBjKGlkOiBzdHJpbmcpIHtcbiAgICAgIGV4cGVjdChyZXNvdXJjZXNbaWRdLlByb3BlcnRpZXMuVnBjQ29uZmlnLlN1Ym5ldElkcykudG9FcXVhbChbXG4gICAgICAgIHsgUmVmOiAncmVmZXJlbmNldG9TdGFja0NsdXN0ZXJEZWZhdWx0VnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXRBNjREMUJGMFJlZicgfSxcbiAgICAgICAgeyBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrQ2x1c3RlckRlZmF1bHRWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDMyRDg1QUI4UmVmJyB9LFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgYXNzZXJ0RnVuY3Rpb25QbGFjZWRJblZwYygnT25FdmVudEhhbmRsZXI0MkJFQkFFMCcpO1xuICAgIGFzc2VydEZ1bmN0aW9uUGxhY2VkSW5WcGMoJ0lzQ29tcGxldGVIYW5kbGVyNzA3M0Y0REEnKTtcbiAgICBhc3NlcnRGdW5jdGlvblBsYWNlZEluVnBjKCdQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ4M0MxRDBBNycpO1xuICAgIGFzc2VydEZ1bmN0aW9uUGxhY2VkSW5WcGMoJ1Byb3ZpZGVyZnJhbWV3b3JraXNDb21wbGV0ZTI2RDdCMENCJyk7XG4gICAgYXNzZXJ0RnVuY3Rpb25QbGFjZWRJblZwYygnUHJvdmlkZXJmcmFtZXdvcmtvblRpbWVvdXQwQjQ3Q0EzOCcpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWNjZXNzIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgZm9yIGltcG9ydGVkIGNsdXN0ZXIgd2l0aCBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBjbHVzdGVyU2dJZCA9ICdjbHVzdGVyLXNnLWlkJztcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyJyxcbiAgICAgIGNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IGNsdXN0ZXJTZ0lkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlclNnID0gY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cDtcblxuICAgIGV4cGVjdChjbHVzdGVyU2cuc2VjdXJpdHlHcm91cElkKS50b0VxdWFsKGNsdXN0ZXJTZ0lkKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2x1c3RlciBzZWN1cml0eSBncm91cCBpcyBhdHRhY2hlZCB3aGVuIGFkZGluZyBzZWxmLW1hbmFnZWQgbm9kZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ3NlbGYtbWFuYWdlZCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyc2VsZm1hbmFnZWRJbnN0YW5jZVNlY3VyaXR5R3JvdXA2NDQ2OEMzQScsICdHcm91cElkJ10gfSxcbiAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlcjlFRTAyMjFDJywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnXSB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2VjdXJpdHkgZ3JvdXAgb2Ygc2VsZi1tYW5hZ2VkIGFzZyBpcyBub3QgdGFnZ2VkIHdpdGggb3duZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ3NlbGYtbWFuYWdlZCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgIH0pO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgVGFnczogW3sgS2V5OiAnTmFtZScsIFZhbHVlOiAnU3RhY2svQ2x1c3Rlci9zZWxmLW1hbmFnZWQnIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb25uZWN0IGF1dG9zY2FsaW5nIGdyb3VwIHdpdGggaW1wb3J0ZWQgY2x1c3RlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltcG9ydGVkQ2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQ2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgY2x1c3RlclNlY3VyaXR5R3JvdXBJZDogY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cElkLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VsZk1hbmFnZWQgPSBuZXcgYXNnLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdzZWxmLW1hbmFnZWQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIHZwYzogdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBpbXBvcnRlZENsdXN0ZXIuY29ubmVjdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShzZWxmTWFuYWdlZCwge30pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydzZWxmbWFuYWdlZEluc3RhbmNlU2VjdXJpdHlHcm91cEVBNkQ4MEM5JywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyOUVFMDIyMUMnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGlzIGF0dGFjaGVkIHdoZW4gY29ubmVjdGluZyBzZWxmLW1hbmFnZWQgbm9kZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWxmTWFuYWdlZCA9IG5ldyBhc2cuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ3NlbGYtbWFuYWdlZCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgICAgdnBjOiB2cGMsXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuY29ubmVjdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShzZWxmTWFuYWdlZCwge30pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydzZWxmbWFuYWdlZEluc3RhbmNlU2VjdXJpdHlHcm91cEVBNkQ4MEM5JywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyOUVFMDIyMUMnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzcG90IGludGVycnVwdCBoYW5kbGVyIGlzIG5vdCBhZGRlZCBpZiBzcG90SW50ZXJydXB0SGFuZGxlciBpcyBmYWxzZSB3aGVuIGNvbm5lY3Rpbmcgc2VsZi1tYW5hZ2VkIG5vZGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VsZk1hbmFnZWQgPSBuZXcgYXNnLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdzZWxmLW1hbmFnZWQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIHZwYzogdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHNwb3RQcmljZTogJzAuMScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5jb25uZWN0QXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KHNlbGZNYW5hZ2VkLCB7IHNwb3RJbnRlcnJ1cHRIYW5kbGVyOiBmYWxzZSB9KTtcblxuICAgIGV4cGVjdChjbHVzdGVyLm5vZGUuZmluZEFsbCgpLmZpbHRlcihjID0+IGMubm9kZS5pZCA9PT0gJ2NoYXJ0LXNwb3QtaW50ZXJydXB0LWhhbmRsZXInKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGEgbm9uIGNkazhzIGNoYXJ0IGNvbnN0cnVjdCBpcyBhZGRlZCBhcyBjZGs4cyBjaGFydCcsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgYSBwbGFpbiBjb25zdHJ1Y3QsIG5vdCBhIGNkazhzIGNoYXJ0XG4gICAgY29uc3Qgc29tZUNvbnN0cnVjdCA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdTb21lQ29uc3RydWN0Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRDZGs4c0NoYXJ0KCdjaGFydCcsIHNvbWVDb25zdHJ1Y3QpKS50b1Rocm93KC9JbnZhbGlkIGNkazhzIGNoYXJ0LiBNdXN0IGNvbnRhaW4gYSBcXCd0b0pzb25cXCcgbWV0aG9kLCBidXQgZm91bmQgdW5kZWZpbmVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGEgY29yZSBjb25zdHJ1Y3QgaXMgYWRkZWQgYXMgY2RrOHMgY2hhcnQnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gY3JlYXRlIGEgcGxhaW4gY29uc3RydWN0LCBub3QgYSBjZGs4cyBjaGFydFxuICAgIGNvbnN0IHNvbWVDb25zdHJ1Y3QgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnU29tZUNvbnN0cnVjdCcpO1xuXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkQ2RrOHNDaGFydCgnY2hhcnQnLCBzb21lQ29uc3RydWN0KSkudG9UaHJvdygvSW52YWxpZCBjZGs4cyBjaGFydC4gTXVzdCBjb250YWluIGEgXFwndG9Kc29uXFwnIG1ldGhvZCwgYnV0IGZvdW5kIHVuZGVmaW5lZC8pO1xuICB9KTtcblxuICB0ZXN0KCdjZGs4cyBjaGFydCBjYW4gYmUgYWRkZWQgdG8gY2x1c3RlcicsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrOHMuQXBwKCk7XG4gICAgY29uc3QgY2hhcnQgPSBuZXcgY2RrOHMuQ2hhcnQoYXBwLCAnQ2hhcnQnKTtcblxuICAgIG5ldyBjZGs4cy5BcGlPYmplY3QoY2hhcnQsICdGYWtlUG9kJywge1xuICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgIGtpbmQ6ICdQb2QnLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZTogJ2Zha2UtcG9kJyxcbiAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgLy8gYWRkaW5nIGF3cy1jZGsgdG9rZW4gdG8gY2RrOHMgY2hhcnRcbiAgICAgICAgICBjbHVzdGVyTmFtZTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZENkazhzQ2hhcnQoJ2NkazhzLWNoYXJ0JywgY2hhcnQpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzUmVzb3VyY2UnLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiUG9kXCIsXCJtZXRhZGF0YVwiOntcImxhYmVsc1wiOntcImNsdXN0ZXJOYW1lXCI6XCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIn0sXCJuYW1lXCI6XCJmYWtlLXBvZFwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2x1c3RlciBjb25uZWN0aW9ucyBpbmNsdWRlIGJvdGggY29udHJvbCBwbGFuZSBhbmQgY2x1c3RlciBzZWN1cml0eSBncm91cCcsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2x1c3Rlci5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwcy5tYXAoc2cgPT4gc3RhY2sucmVzb2x2ZShzZy5zZWN1cml0eUdyb3VwSWQpKSkudG9FcXVhbChbXG4gICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyOUVFMDIyMUMnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH0sXG4gICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyQ29udHJvbFBsYW5lU2VjdXJpdHlHcm91cEQyNzQyNDJDJywgJ0dyb3VwSWQnXSB9LFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIHNlY3VyaXR5IGdyb3VwIGZyb20gYSBkaWZmZXJlbnQgc3RhY2snLCAoKSA9PiB7XG4gICAgY2xhc3MgQ2x1c3RlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIHB1YmxpYyBla3NDbHVzdGVyOiBla3MuQ2x1c3RlcjtcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IHsgc2c6IGVjMi5JU2VjdXJpdHlHcm91cCwgdnBjOiBlYzIuSVZwYyB9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXA6IHByb3BzLnNnLFxuICAgICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBOZXR3b3JrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycpO1xuICAgICAgICB0aGlzLnNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlY3VyaXR5R3JvdXAnLCB7IHZwYzogdGhpcy52cGMgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgbmV0d29ya1N0YWNrID0gbmV3IE5ldHdvcmtTdGFjayhhcHAsICdOZXR3b3JrU3RhY2snKTtcbiAgICBuZXcgQ2x1c3RlclN0YWNrKGFwcCwgJ0NsdXN0ZXJTdGFjaycsIHsgc2c6IG5ldHdvcmtTdGFjay5zZWN1cml0eUdyb3VwLCB2cGM6IG5ldHdvcmtTdGFjay52cGMgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgY2FuIHN5bnRoIChubyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGUgc3RhY2tzKVxuICAgIGFwcC5zeW50aCgpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIG1hbmlmZXN0IHdpdGggYSB0b2tlbiBmcm9tIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXIgdGhhdCBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBNYW5pZmVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcyAmIHsgY2x1c3RlcjogZWtzLkNsdXN0ZXIgfSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICAvLyB0aGlzIHJvbGUgY3JlYXRlcyBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGlzIHN0YWNrIGFuZCB0aGUgY2x1c3RlciBzdGFja1xuICAgICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdDcm9zc1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nxcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgcm9sZU5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3RlckFybixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoaXMgbWFuaWZlc3QgZG9lc24ndCBjcmVhdGUgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIGNsdXN0ZXIgc3RhY2tcbiAgICAgICAgLy8gYW5kIHRoaXMgc3RhY2tcbiAgICAgICAgbmV3IGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgJ2Nyb3NzLXN0YWNrJywge1xuICAgICAgICAgIG1hbmlmZXN0OiBbe1xuICAgICAgICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZm9vOiByb2xlLnJvbGVBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXJTdGFjayA9IG5ldyBDbHVzdGVyU3RhY2soYXBwLCAnQ2x1c3RlclN0YWNrJyk7XG4gICAgbmV3IE1hbmlmZXN0U3RhY2soYXBwLCAnTWFuaWZlc3RTdGFjaycsIHsgY2x1c3RlcjogY2x1c3RlclN0YWNrLmVrc0NsdXN0ZXIgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgY2FuIHN5bnRoIChubyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGUgc3RhY2tzKVxuICAgIGFwcC5zeW50aCgpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIGNoYXJ0IHdpdGggYSB0b2tlbiBmcm9tIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXIgdGhhdCBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBDaGFydFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcyAmIHsgY2x1c3RlcjogZWtzLkNsdXN0ZXIgfSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICAvLyB0aGlzIHJvbGUgY3JlYXRlcyBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGlzIHN0YWNrIGFuZCB0aGUgY2x1c3RlciBzdGFja1xuICAgICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdDcm9zc1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nxcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgcm9sZU5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3RlckFybixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoaXMgY2hhcnQgZG9lc24ndCBjcmVhdGUgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIGNsdXN0ZXIgc3RhY2tcbiAgICAgICAgLy8gYW5kIHRoaXMgc3RhY2tcbiAgICAgICAgbmV3IGVrcy5IZWxtQ2hhcnQodGhpcywgJ2Nyb3NzLXN0YWNrJywge1xuICAgICAgICAgIGNoYXJ0OiByb2xlLnJvbGVBcm4sXG4gICAgICAgICAgY2x1c3RlcjogcHJvcHMuY2x1c3RlcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlclN0YWNrID0gbmV3IENsdXN0ZXJTdGFjayhhcHAsICdDbHVzdGVyU3RhY2snKTtcbiAgICBuZXcgQ2hhcnRTdGFjayhhcHAsICdDaGFydFN0YWNrJywgeyBjbHVzdGVyOiBjbHVzdGVyU3RhY2suZWtzQ2x1c3RlciB9KTtcblxuICAgIC8vIG1ha2Ugc3VyZSB3ZSBjYW4gc3ludGggKG5vIGNpcmN1bGFyIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHRoZSBzdGFja3MpXG4gICAgYXBwLnN5bnRoKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkZWNsYXJlIGEgSGVsbUNoYXJ0IGluIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgY2xhc3MgQ2x1c3RlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIHB1YmxpYyBla3NDbHVzdGVyOiBla3MuQ2x1c3RlcjtcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICAgICAgdGhpcy5la3NDbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIENoYXJ0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzICYgeyBjbHVzdGVyOiBla3MuQ2x1c3RlciB9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNkay5DZm5SZXNvdXJjZSh0aGlzLCAncmVzb3VyY2UnLCB7IHR5cGU6ICdNeVR5cGUnIH0pO1xuICAgICAgICBuZXcgZWtzLkhlbG1DaGFydCh0aGlzLCBgY2hhcnQtJHtpZH1gLCB7IGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsIGNoYXJ0OiByZXNvdXJjZS5yZWYgfSk7XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyU3RhY2sgPSBuZXcgQ2x1c3RlclN0YWNrKGFwcCwgJ0NsdXN0ZXJTdGFjaycpO1xuICAgIG5ldyBDaGFydFN0YWNrKGFwcCwgJ0NoYXJ0U3RhY2snLCB7IGNsdXN0ZXI6IGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIGNhbiBzeW50aCAobm8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhlIHN0YWNrcylcbiAgICBhcHAuc3ludGgoKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gZGVjbGFyaW5nIGFuIEFTRyByb2xlIGluIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgY2xhc3MgQ2x1c3RlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIHB1YmxpYyBla3NDbHVzdGVyOiBla3MuQ2x1c3RlcjtcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICAgICAgdGhpcy5la3NDbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIENhcGFjaXR5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gICAgICBwdWJsaWMgZ3JvdXA6IGFzZy5BdXRvU2NhbGluZ0dyb3VwO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgJiB7IGNsdXN0ZXI6IGVrcy5DbHVzdGVyIH0pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgLy8gdGhlIHJvbGUgaXMgY3JlYXRlIGluIHRoaXMgc3RhY2sgaW1wbGljaXRseSBieSB0aGUgQVNHXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgYXNnLkF1dG9TY2FsaW5nR3JvdXAodGhpcywgJ2F1dG9TY2FsaW5nJywge1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLm1lZGl1bScpLFxuICAgICAgICAgIHZwYzogcHJvcHMuY2x1c3Rlci52cGMsXG4gICAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWtzLkVrc09wdGltaXplZEltYWdlKHtcbiAgICAgICAgICAgIGt1YmVybmV0ZXNWZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04udmVyc2lvbixcbiAgICAgICAgICAgIG5vZGVUeXBlOiBla3MuTm9kZVR5cGUuU1RBTkRBUkQsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXJTdGFjayA9IG5ldyBDbHVzdGVyU3RhY2soYXBwLCAnQ2x1c3RlclN0YWNrJyk7XG4gICAgY29uc3QgY2FwYWNpdHlTdGFjayA9IG5ldyBDYXBhY2l0eVN0YWNrKGFwcCwgJ0NhcGFjaXR5U3RhY2snLCB7IGNsdXN0ZXI6IGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyLmNvbm5lY3RBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoY2FwYWNpdHlTdGFjay5ncm91cCwge30pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAnQ2FwYWNpdHlTdGFjay9hdXRvU2NhbGluZy9JbnN0YW5jZVJvbGUgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhlIHNjb3BlIG9mIHRoZSBDbHVzdGVyU3RhY2sgc3RhY2sgdG8gcHJldmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXMnLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkZWNsYXJlIGEgU2VydmljZUFjY291bnQgaW4gYSBkaWZmZXJlbnQgc3RhY2sgdGhhbiB0aGUgY2x1c3RlcicsICgpID0+IHtcbiAgICBjbGFzcyBDbHVzdGVyU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgcHVibGljIGVrc0NsdXN0ZXI6IGVrcy5DbHVzdGVyO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgICAgICB0aGlzLmVrc0NsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0VLU0NsdXN0ZXInLCB7XG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQXBwU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzICYgeyBjbHVzdGVyOiBla3MuQ2x1c3RlciB9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIG5ldyBla3MuU2VydmljZUFjY291bnQodGhpcywgJ3Rlc3RBY2NvdW50JywgeyBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyLCBuYW1lOiAndGVzdC1hY2NvdW50JywgbmFtZXNwYWNlOiAndGVzdCcgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlclN0YWNrID0gbmV3IENsdXN0ZXJTdGFjayhhcHAsICdFS1NDbHVzdGVyJyk7XG4gICAgbmV3IEFwcFN0YWNrKGFwcCwgJ0t1YmVBcHAnLCB7IGNsdXN0ZXI6IGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIGNhbiBzeW50aCAobm8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhlIHN0YWNrcylcbiAgICBhcHAuc3ludGgoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYSBkZWZhdWx0IGNsdXN0ZXIgc3BhbnMgYWxsIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtQ2x1c3RlcicsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICByb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyUm9sZUZBMjYxOTc5JywgJ0FybiddIH0sXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTi52ZXJzaW9uLFxuICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckNvbnRyb2xQbGFuZVNlY3VyaXR5R3JvdXBEMjc0MjQyQycsICdHcm91cElkJ10gfV0sXG4gICAgICAgICAgc3VibmV0SWRzOiBbXG4gICAgICAgICAgICB7IFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDFTdWJuZXRCNDI0NkQzMCcgfSxcbiAgICAgICAgICAgIHsgUmVmOiAnVlBDUHVibGljU3VibmV0MlN1Ym5ldDc0MTc5RjM5JyB9LFxuICAgICAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgICAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjbHVzdGVyIGhhbmRsZXIgZ2V0cyBjcmVhdGVkIHdpdGggU1RTIHJlZ2lvbmFsIGVuZHBvaW50IGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gVGhpcyBpcyBuZWNlc3NhcnkgdG8gbWFrZSBhd3Mtc2RrLWpzdjIgd29yayBpbiBvcHQtaW4gcmVnaW9uc1xuXG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkNsdXN0ZXJSZXNvdXJjZVByb3ZpZGVyJykgYXMgY2RrLk5lc3RlZFN0YWNrO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVmFyaWFibGVzOiB7XG4gICAgICAgICAgQVdTX1NUU19SRUdJT05BTF9FTkRQT0lOVFM6ICdyZWdpb25hbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiBcInZwY1wiIGlzIG5vdCBzcGVjaWZpZWQsIHZwYyB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbiB3aWxsIGJlIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCBNYXRjaC5hbnlWYWx1ZSgpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHQgY2FwYWNpdHknLCAoKSA9PiB7XG4gICAgdGVzdCgneDIgbTUubGFyZ2UgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsdXN0ZXIuZGVmYXVsdE5vZGVncm91cCkudG9CZURlZmluZWQoKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICAgJ201LmxhcmdlJyxcbiAgICAgICAgXSxcbiAgICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICAgIE1heFNpemU6IDIsXG4gICAgICAgICAgTWluU2l6ZTogMixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncXVhbnRpdHkgYW5kIHR5cGUgY2FuIGJlIGN1c3RvbWl6ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAxMCxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMi54bGFyZ2UnKSxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsdXN0ZXIuZGVmYXVsdE5vZGVncm91cCkudG9CZURlZmluZWQoKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgICAgRGVzaXJlZFNpemU6IDEwLFxuICAgICAgICAgIE1heFNpemU6IDEwLFxuICAgICAgICAgIE1pblNpemU6IDEwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICAvLyBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywgeyBJbnN0YW5jZVR5cGU6ICdtMi54bGFyZ2UnIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHRDYXBhY2l0eT0wIHdpbGwgbm90IGFsbG9jYXRlIGF0IGFsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIDApO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGluZyBhIGNsdXN0ZXIgdGFncyB0aGUgcHJpdmF0ZSBWUEMgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMsIGRlZmF1bHRDYXBhY2l0eTogMCwgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICBUYWdzOiBbXG4gICAgICAgIHsgS2V5OiAnYXdzLWNkazpzdWJuZXQtbmFtZScsIFZhbHVlOiAnUHJpdmF0ZScgfSxcbiAgICAgICAgeyBLZXk6ICdhd3MtY2RrOnN1Ym5ldC10eXBlJywgVmFsdWU6ICdQcml2YXRlJyB9LFxuICAgICAgICB7IEtleTogJ2t1YmVybmV0ZXMuaW8vcm9sZS9pbnRlcm5hbC1lbGInLCBWYWx1ZTogJzEnIH0sXG4gICAgICAgIHsgS2V5OiAnTmFtZScsIFZhbHVlOiAnU3RhY2svVlBDL1ByaXZhdGVTdWJuZXQxJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRpbmcgYSBjbHVzdGVyIHRhZ3MgdGhlIHB1YmxpYyBWUEMgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMsIGRlZmF1bHRDYXBhY2l0eTogMCwgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ2F3cy1jZGs6c3VibmV0LW5hbWUnLCBWYWx1ZTogJ1B1YmxpYycgfSxcbiAgICAgICAgeyBLZXk6ICdhd3MtY2RrOnN1Ym5ldC10eXBlJywgVmFsdWU6ICdQdWJsaWMnIH0sXG4gICAgICAgIHsgS2V5OiAna3ViZXJuZXRlcy5pby9yb2xlL2VsYicsIFZhbHVlOiAnMScgfSxcbiAgICAgICAgeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdTdGFjay9WUEMvUHVibGljU3VibmV0MScgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBjYXBhY2l0eSBjcmVhdGVzIGFuIEFTRyB3aXRob3V0IGEgcm9sbGluZyB1cGRhdGUgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdEZWZhdWx0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7IEF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uOiB7IElnbm9yZVVubW9kaWZpZWRHcm91cFNpemVQcm9wZXJ0aWVzOiB0cnVlIH0gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIGNhcGFjaXR5IGNyZWF0ZXMgYW4gQVNHIHdpdGggdGFncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnRGVmYXVsdCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiB7ICdGbjo6Sm9pbic6IFsnJywgWydrdWJlcm5ldGVzLmlvL2NsdXN0ZXIvJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH1dXSB9LFxuICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgIFZhbHVlOiAnb3duZWQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdTdGFjay9DbHVzdGVyL0RlZmF1bHQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIGV4aXN0aW5nIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDEwLFxuICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMi54bGFyZ2UnKSxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4aXN0aW5nUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ0V4aXN0aW5nUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbm9kZVJvbGU6IGV4aXN0aW5nUm9sZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoY2x1c3Rlci5kZWZhdWx0Tm9kZWdyb3VwKS50b0JlRGVmaW5lZCgpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMTAsXG4gICAgICAgIE1heFNpemU6IDEwLFxuICAgICAgICBNaW5TaXplOiAxMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBib3R0bGVyb2NrZXQgY2FwYWNpdHkgY3JlYXRlcyBhbiBBU0cgd2l0aCB0YWdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVrcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogeyAnRm46OkpvaW4nOiBbJycsIFsna3ViZXJuZXRlcy5pby9jbHVzdGVyLycsIHsgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyB9XV0gfSxcbiAgICAgICAgICBQcm9wYWdhdGVBdExhdW5jaDogdHJ1ZSxcbiAgICAgICAgICBWYWx1ZTogJ293bmVkJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgIFZhbHVlOiAnU3RhY2svQ2x1c3Rlci9Cb3R0bGVyb2NrZXQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIGJvdHRsZXJvY2tldCBjYXBhY2l0eSB3aXRoIGJvb3RzdHJhcE9wdGlvbnMgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVrcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgICAgIGJvb3RzdHJhcE9wdGlvbnM6IHt9LFxuICAgIH0pKS50b1Rocm93KC9ib290c3RyYXBPcHRpb25zIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIEJvdHRsZXJvY2tldC8pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgY2x1c3RlciB3aXRoIGV4aXN0aW5nIGt1YmVjdGwgcHJvdmlkZXIgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcbiAgICBjb25zdCBrdWJlY3RsUHJvdmlkZXIgPSBLdWJlY3RsUHJvdmlkZXIuZnJvbUt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXMoc3RhY2ssICdLdWJlY3RsUHJvdmlkZXInLCB7XG4gICAgICBmdW5jdGlvbkFybjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb246MScsXG4gICAgICBrdWJlY3RsUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9rdWJlY3RsLXJvbGUnLFxuICAgICAgaGFuZGxlclJvbGU6IGhhbmRsZXJSb2xlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXInLFxuICAgICAga3ViZWN0bFByb3ZpZGVyOiBrdWJlY3RsUHJvdmlkZXIsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2x1c3Rlci5rdWJlY3RsUHJvdmlkZXIpLnRvRXF1YWwoa3ViZWN0bFByb3ZpZGVyKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ltcG9ydCBjbHVzdGVyIHdpdGggZXhpc3Rpbmcga3ViZWN0bCBwcm92aWRlciBmdW5jdGlvbiBzaG91bGQgd29yayBhcyBleHBlY3RlZCB3aXRoIHJlc291cmNlcyByZWx5aW5nIG9uIGt1YmVjdGwgZ2V0T3JDcmVhdGUnLCAoKSA9PiB7XG4gICAgdGVzdCgnY3JlYXRlcyBoZWxtIGNoYXJ0JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgY29uc3QgaGFuZGxlclJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ0hhbmRsZXJSb2xlJywgJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9sYW1iZGEtcm9sZScpO1xuICAgICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmZyb21LdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzKHN0YWNrLCAnS3ViZWN0bFByb3ZpZGVyJywge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb246MScsXG4gICAgICAgIGt1YmVjdGxSb2xlQXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2t1YmVjdGwtcm9sZScsXG4gICAgICAgIGhhbmRsZXJSb2xlOiBoYW5kbGVyUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyJyxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyOiBrdWJlY3RsUHJvdmlkZXIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVrcy5IZWxtQ2hhcnQoc3RhY2ssICdDaGFydCcsIHtcbiAgICAgICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICAgICAgY2hhcnQ6ICdjaGFydCcsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1IZWxtQ2hhcnQnLCB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjoga3ViZWN0bFByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgICAgUm9sZUFybjoga3ViZWN0bFByb3ZpZGVyLnJvbGVBcm4sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NyZWF0ZXMgS3ViZXJuZXRlcyBwYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcbiAgICAgIGNvbnN0IGt1YmVjdGxQcm92aWRlciA9IEt1YmVjdGxQcm92aWRlci5mcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzdGFjaywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uOjEnLFxuICAgICAgICBrdWJlY3RsUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9rdWJlY3RsLXJvbGUnLFxuICAgICAgICBoYW5kbGVyUm9sZTogaGFuZGxlclJvbGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiAnY2x1c3RlcicsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlcjoga3ViZWN0bFByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHN0YWNrLCAnQ2hhcnQnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGNoYXJ0OiAnY2hhcnQnLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuS3ViZXJuZXRlc1BhdGNoKHN0YWNrLCAnUGF0Y2gnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGFwcGx5UGF0Y2g6IHt9LFxuICAgICAgICByZXN0b3JlUGF0Y2g6IHt9LFxuICAgICAgICByZXNvdXJjZU5hbWU6ICdQYXRjaFJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNQYXRjaCcsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiBrdWJlY3RsUHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgICBSb2xlQXJuOiBrdWJlY3RsUHJvdmlkZXIucm9sZUFybixcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBLdWJlcm5ldGVzIG9iamVjdCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcbiAgICAgIGNvbnN0IGt1YmVjdGxQcm92aWRlciA9IEt1YmVjdGxQcm92aWRlci5mcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzdGFjaywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uOjEnLFxuICAgICAgICBrdWJlY3RsUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9rdWJlY3RsLXJvbGUnLFxuICAgICAgICBoYW5kbGVyUm9sZTogaGFuZGxlclJvbGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiAnY2x1c3RlcicsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlcjoga3ViZWN0bFByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHN0YWNrLCAnQ2hhcnQnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGNoYXJ0OiAnY2hhcnQnLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuS3ViZXJuZXRlc1BhdGNoKHN0YWNrLCAnUGF0Y2gnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGFwcGx5UGF0Y2g6IHt9LFxuICAgICAgICByZXN0b3JlUGF0Y2g6IHt9LFxuICAgICAgICByZXNvdXJjZU5hbWU6ICdQYXRjaFJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkt1YmVybmV0ZXNNYW5pZmVzdChzdGFjaywgJ01hbmlmZXN0Jywge1xuICAgICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgICBtYW5pZmVzdDogW10sXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVrcy5LdWJlcm5ldGVzT2JqZWN0VmFsdWUoc3RhY2ssICdPYmplY3RWYWx1ZScsIHtcbiAgICAgICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICAgICAganNvblBhdGg6ICcnLFxuICAgICAgICBvYmplY3ROYW1lOiAnbmFtZScsXG4gICAgICAgIG9iamVjdFR5cGU6ICd0eXBlJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNPYmplY3RWYWx1ZScsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiBrdWJlY3RsUHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgICBSb2xlQXJuOiBrdWJlY3RsUHJvdmlkZXIucm9sZUFybixcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoY2x1c3Rlci5rdWJlY3RsUHJvdmlkZXIpLm5vdC50b0JlSW5zdGFuY2VPZihla3MuS3ViZWN0bFByb3ZpZGVyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IGNsdXN0ZXIgd2l0aCBuZXcga3ViZWN0bCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXInLFxuICAgICAga3ViZWN0bFByaXZhdGVTdWJuZXRJZHM6IHZwYy5wcml2YXRlU3VibmV0cy5tYXAocyA9PiBzLnN1Ym5ldElkKSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChjbHVzdGVyLmt1YmVjdGxQcml2YXRlU3VibmV0cz8ubWFwKHMgPT4gc3RhY2sucmVzb2x2ZShzLnN1Ym5ldElkKSkpLnRvRXF1YWwoW1xuICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyB9LFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KGNsdXN0ZXIua3ViZWN0bFByaXZhdGVTdWJuZXRzPy5tYXAocyA9PiBzLm5vZGUuaWQpKS50b0VxdWFsKFtcbiAgICAgICdLdWJlY3RsU3VibmV0MCcsXG4gICAgICAnS3ViZWN0bFN1Ym5ldDEnLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdleGVyY2lzZSBleHBvcnQvaW1wb3J0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjazogc3RhY2sxLCB2cGMsIGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrMSwgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2syLCAnSW1wb3J0ZWQnLCB7XG4gICAgICB2cGM6IGNsdXN0ZXIudnBjLFxuICAgICAgY2x1c3RlckVuZHBvaW50OiBjbHVzdGVyLmNsdXN0ZXJFbmRwb2ludCxcbiAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgc2VjdXJpdHlHcm91cElkczogY2x1c3Rlci5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwcy5tYXAoeCA9PiB4LnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEsXG4gICAgICBjbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLmNsdXN0ZXJTZWN1cml0eUdyb3VwSWQsXG4gICAgICBjbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybjogY2x1c3Rlci5jbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybixcbiAgICB9KTtcblxuICAgIC8vIHRoaXMgc2hvdWxkIGNhdXNlIGFuIGV4cG9ydC9pbXBvcnRcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjazIsICdDbHVzdGVyQVJOJywgeyB2YWx1ZTogaW1wb3J0ZWQuY2x1c3RlckFybiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBDbHVzdGVyQVJOOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpla3M6dXMtZWFzdC0xOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpjbHVzdGVyLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazpFeHBvcnRzT3V0cHV0UmVmQ2x1c3RlcjlFRTAyMjFDNDg1M0I0QzMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtYXN0ZXJzUm9sZSBjYW4gYmUgdXNlZCB0byBtYXAgYW4gSUFNIHJvbGUgdG8gXCJzeXN0ZW06bWFzdGVyc1wiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdyb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCkgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hc3RlcnNSb2xlOiByb2xlLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdbe1wiYXBpVmVyc2lvblwiOlwidjFcIixcImtpbmRcIjpcIkNvbmZpZ01hcFwiLFwibWV0YWRhdGFcIjp7XCJuYW1lXCI6XCJhd3MtYXV0aFwiLFwibmFtZXNwYWNlXCI6XCJrdWJlLXN5c3RlbVwifSxcImRhdGFcIjp7XCJtYXBSb2xlc1wiOlwiW3tcXFxcXCJyb2xlYXJuXFxcXFwiOlxcXFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdyb2xlQzdCN0U3NzUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3JvbGVDN0I3RTc3NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTptYXN0ZXJzXFxcXFwiXX1dXCIsXCJtYXBVc2Vyc1wiOlwiW11cIixcIm1hcEFjY291bnRzXCI6XCJbXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTWFuaWZlc3QgY2FuIGJlIHVzZWQgdG8gYXBwbHkgazhzIG1hbmlmZXN0cyBvbiB0aGlzIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgnbWFuaWZlc3QxJywgeyBmb286IDEyMyB9KTtcbiAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtYW5pZmVzdDInLCB7IGJhcjogMTIzIH0sIHsgYm9vcjogWzEsIDIsIDNdIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6ICdbe1wiZm9vXCI6MTIzfV0nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDogJ1t7XCJiYXJcIjoxMjN9LHtcImJvb3JcIjpbMSwyLDNdfV0nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdrdWJlY3RsIHJlc291cmNlcyBjYW4gYmUgY3JlYXRlZCBpbiBhIHNlcGFyYXRlIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTsgLy8gY2x1c3RlciBpcyB1bmRlciBzdGFjazJcblxuICAgIC8vIFdIRU4gcmVzb3VyY2UgaXMgdW5kZXIgc3RhY2syXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjazInLCB7IGVudjogeyBhY2NvdW50OiBzdGFjay5hY2NvdW50LCByZWdpb246IHN0YWNrLnJlZ2lvbiB9IH0pO1xuICAgIG5ldyBla3MuS3ViZXJuZXRlc01hbmlmZXN0KHN0YWNrMiwgJ215cmVzb3VyY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWFuaWZlc3Q6IFt7IGZvbzogJ2JhcicgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgYXBwLnN5bnRoKCk7IC8vIG5vIGN5Y2xpYyBkZXBlbmRlbmN5IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy83MjMxKVxuXG4gICAgLy8gZXhwZWN0IGEgc2luZ2xlIHJlc291cmNlIGluIHRoZSAybmQgc3RhY2tcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIG15cmVzb3VyY2U0OUM2RDMyNToge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1Jlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRhd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlck5lc3RlZFN0YWNrUmVzb3VyY2VBN0FFQkE2Qk91dHB1dHNTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ4ODk3RkQ5QkFybjQ5QkVGMjBDJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5pZmVzdDogJ1t7XFxcImZvb1xcXCI6XFxcImJhclxcXCJ9XScsXG4gICAgICAgICAgICBDbHVzdGVyTmFtZTogeyAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrOkV4cG9ydHNPdXRwdXRSZWZjbHVzdGVyQzVCMjVEMEQ5OEQ1NTNGNScgfSxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRjbHVzdGVyQ3JlYXRpb25Sb2xlMkIzQjUwMDJBcm5GMDUxMjJGQycgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBjYXBhY2l0eSB3aWxsIGF1dG9tYXRpY2FsbHkgbWFwIGl0cyBJQU0gcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnZGVmYXVsdCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm5hbm8nKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJDb25maWdNYXBcIixcIm1ldGFkYXRhXCI6e1wibmFtZVwiOlwiYXdzLWF1dGhcIixcIm5hbWVzcGFjZVwiOlwia3ViZS1zeXN0ZW1cIn0sXCJkYXRhXCI6e1wibWFwUm9sZXNcIjpcIlt7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3Rlck1hc3RlcnNSb2xlOUFBMzU2MjUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOm1hc3RlcnNcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3RlcmRlZmF1bHRJbnN0YW5jZVJvbGVGMjBBMjlDRCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX1cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJzeXN0ZW06Ym9vdHN0cmFwcGVyc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZXNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbXVwiLFwibWFwQWNjb3VudHNcIjpcIltdXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkgd2lsbCAqbm90KiBtYXAgdGhlIElBTSByb2xlIGlmIG1hcFJvbGUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ2RlZmF1bHQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5uYW5vJyksXG4gICAgICBtYXBSb2xlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJDb25maWdNYXBcIixcIm1ldGFkYXRhXCI6e1wibmFtZVwiOlwiYXdzLWF1dGhcIixcIm5hbWVzcGFjZVwiOlwia3ViZS1zeXN0ZW1cIn0sXCJkYXRhXCI6e1wibWFwUm9sZXNcIjpcIlt7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3Rlck1hc3RlcnNSb2xlOUFBMzU2MjUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOm1hc3RlcnNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbXVwiLFwibWFwQWNjb3VudHNcIjpcIltdXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnb3V0cHV0cycsICgpID0+IHtcbiAgICB0ZXN0KCdhd3MgZWtzIHVwZGF0ZS1rdWJlY29uZmlnIGlzIHRoZSBvbmx5IG91dHB1dCBzeW50aGVzaXplZCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgICAgQ2x1c3RlckNvbmZpZ0NvbW1hbmQ0M0FBRTQwRjogeyBWYWx1ZTogeyAnRm46OkpvaW4nOiBbJycsIFsnYXdzIGVrcyB1cGRhdGUta3ViZWNvbmZpZyAtLW5hbWUgJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1yZWdpb24gdXMtZWFzdC0xIC0tcm9sZS1hcm4gJywgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3Rlck1hc3RlcnNSb2xlOUFBMzU2MjUnLCAnQXJuJ10gfV1dIH0gfSxcbiAgICAgICAgQ2x1c3RlckdldFRva2VuQ29tbWFuZDA2QUU5OTJFOiB7IFZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhd3MgZWtzIGdldC10b2tlbiAtLWNsdXN0ZXItbmFtZSAnLCB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSwgJyAtLXJlZ2lvbiB1cy1lYXN0LTEgLS1yb2xlLWFybiAnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyTWFzdGVyc1JvbGU5QUEzNTYyNScsICdBcm4nXSB9XV0gfSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBtYXN0ZXJzIHJvbGUgaXMgZGVmaW5lZCwgaXQgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSBjb25maWcgY29tbWFuZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdtYXN0ZXJzJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgICBDbHVzdGVyQ29uZmlnQ29tbWFuZDQzQUFFNDBGOiB7IFZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhd3MgZWtzIHVwZGF0ZS1rdWJlY29uZmlnIC0tbmFtZSAnLCB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSwgJyAtLXJlZ2lvbiB1cy1lYXN0LTEgLS1yb2xlLWFybiAnLCB7ICdGbjo6R2V0QXR0JzogWydtYXN0ZXJzMEQwNEYyM0QnLCAnQXJuJ10gfV1dIH0gfSxcbiAgICAgICAgQ2x1c3RlckdldFRva2VuQ29tbWFuZDA2QUU5OTJFOiB7IFZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhd3MgZWtzIGdldC10b2tlbiAtLWNsdXN0ZXItbmFtZSAnLCB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSwgJyAtLXJlZ2lvbiB1cy1lYXN0LTEgLS1yb2xlLWFybiAnLCB7ICdGbjo6R2V0QXR0JzogWydtYXN0ZXJzMEQwNEYyM0QnLCAnQXJuJ10gfV1dIH0gfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaWYgYG91dHB1dENvbmZpZ0NvbW1hbmQ9ZmFsc2VgIHdpbGwgZGlzYWJsZWQgdGhlIG91dHB1dCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdtYXN0ZXJzJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgICBvdXRwdXRDb25maWdDb21tYW5kOiBmYWxzZSxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5PdXRwdXRzKS50b0JlVW5kZWZpbmVkKCk7IC8vIG5vIG91dHB1dHNcbiAgICB9KTtcblxuICAgIHRlc3QoJ2BvdXRwdXRDbHVzdGVyTmFtZWAgY2FuIGJlIHVzZWQgdG8gc3ludGhlc2l6ZSBhbiBvdXRwdXQgd2l0aCB0aGUgY2x1c3RlciBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICBvdXRwdXRDb25maWdDb21tYW5kOiBmYWxzZSxcbiAgICAgICAgb3V0cHV0Q2x1c3Rlck5hbWU6IHRydWUsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodGVtcGxhdGUuT3V0cHV0cykudG9FcXVhbCh7XG4gICAgICAgIENsdXN0ZXJDbHVzdGVyTmFtZUVCMjYwNDlFOiB7IFZhbHVlOiB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdgb3V0cHV0TWFzdGVyc1JvbGVBcm5gIGNhbiBiZSB1c2VkIHRvIHN5bnRoZXNpemUgYW4gb3V0cHV0IHdpdGggdGhlIGFybiBvZiB0aGUgbWFzdGVycyByb2xlIGlmIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIG91dHB1dENvbmZpZ0NvbW1hbmQ6IGZhbHNlLFxuICAgICAgICBvdXRwdXRNYXN0ZXJzUm9sZUFybjogdHJ1ZSxcbiAgICAgICAgbWFzdGVyc1JvbGU6IG5ldyBpYW0uUm9sZShzdGFjaywgJ21hc3RlcnMnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgICBDbHVzdGVyTWFzdGVyc1JvbGVBcm5CMTU5NjRCMTogeyBWYWx1ZTogeyAnRm46OkdldEF0dCc6IFsnbWFzdGVyczBEMDRGMjNEJywgJ0FybiddIH0gfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2Jvb3N0cmFwIHVzZXItZGF0YScsICgpID0+IHtcbiAgICAgIHRlc3QoJ3JlbmRlcmVkIGJ5IGRlZmF1bHQgZm9yIEFTR3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwLCB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdNeUNhcGNpdHknLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgICBjb25zdCB1c2VyRGF0YSA9IHRlbXBsYXRlLlJlc291cmNlcy5DbHVzdGVyTXlDYXBjaXR5TGF1bmNoQ29uZmlnNTg1ODMzNDUuUHJvcGVydGllcy5Vc2VyRGF0YTtcbiAgICAgICAgZXhwZWN0KHVzZXJEYXRhKS50b0VxdWFsKHsgJ0ZuOjpCYXNlNjQnOiB7ICdGbjo6Sm9pbic6IFsnJywgWycjIS9iaW4vYmFzaFxcbnNldCAtbyB4dHJhY2VcXG4vZXRjL2Vrcy9ib290c3RyYXAuc2ggJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXI5RUUwMjIxQycsICdFbmRwb2ludCddIH0sICdcXCcgLS1iNjQtY2x1c3Rlci1jYSBcXCcnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyOUVFMDIyMUMnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10gfSwgJ1xcJyAtLXVzZS1tYXgtcG9kcyB0cnVlXFxuL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBTdGFjayAtLXJlc291cmNlIENsdXN0ZXJNeUNhcGNpdHlBU0dENENEOEI5NyAtLXJlZ2lvbiB1cy1lYXN0LTEnXV0gfSB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdub3QgcmVuZGVyZWQgaWYgYm9vdHN0cmFwIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IGRlZmF1bHRDYXBhY2l0eTogMCwgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnTXlDYXBjaXR5Jywge1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICAgIGJvb3RzdHJhcEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogJyMhL2Jpbi9iYXNoJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjdXJzb3J5IHRlc3QgZm9yIG9wdGlvbnM6IHNlZSB0ZXN0LnVzZXItZGF0YS50cyBmb3IgZnVsbCBzdWl0ZVxuICAgICAgdGVzdCgnYm9vdHN0cmFwIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwLCB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgICAgYm9vdHN0cmFwT3B0aW9uczoge1xuICAgICAgICAgICAga3ViZWxldEV4dHJhQXJnczogJy0tbm9kZS1sYWJlbHMgRk9PPTQyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogeyAnRm46OkpvaW4nOiBbJycsIFsnIyEvYmluL2Jhc2hcXG5zZXQgLW8geHRyYWNlXFxuL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsIHsgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyB9LCAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmQgIC0tbm9kZS1sYWJlbHMgRk9PPTQyXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJywgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlcjlFRTAyMjFDJywgJ0VuZHBvaW50J10gfSwgJ1xcJyAtLWI2NC1jbHVzdGVyLWNhIFxcJycsIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXI5RUUwMjIxQycsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSB9LCAnXFwnIC0tdXNlLW1heC1wb2RzIHRydWVcXG4vb3B0L2F3cy9iaW4vY2ZuLXNpZ25hbCAtLWV4aXQtY29kZSAkPyAtLXN0YWNrIFN0YWNrIC0tcmVzb3VyY2UgQ2x1c3Rlck15Q2FwY2l0eUFTR0Q0Q0Q4Qjk3IC0tcmVnaW9uIHVzLWVhc3QtMSddXSB9IH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdzcG90IGluc3RhbmNlcycsICgpID0+IHtcblxuICAgICAgICB0ZXN0KCdub2RlcyBsYWJlbGVkIGFuIHRhaW50ZWQgYWNjb3JkaW5nbHknLCAoKSA9PiB7XG4gICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwLCB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnTXlDYXBjaXR5Jywge1xuICAgICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgICAgICBzcG90UHJpY2U6ICcwLjAxJyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgICAgZXhwZWN0KHVzZXJEYXRhKS50b0VxdWFsKHsgJ0ZuOjpCYXNlNjQnOiB7ICdGbjo6Sm9pbic6IFsnJywgWycjIS9iaW4vYmFzaFxcbnNldCAtbyB4dHJhY2VcXG4vZXRjL2Vrcy9ib290c3RyYXAuc2ggJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1FYzJTcG90IC0tcmVnaXN0ZXItd2l0aC10YWludHM9c3BvdEluc3RhbmNlPXRydWU6UHJlZmVyTm9TY2hlZHVsZVwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXI5RUUwMjIxQycsICdFbmRwb2ludCddIH0sICdcXCcgLS1iNjQtY2x1c3Rlci1jYSBcXCcnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyOUVFMDIyMUMnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10gfSwgJ1xcJyAtLXVzZS1tYXgtcG9kcyB0cnVlXFxuL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBTdGFjayAtLXJlc291cmNlIENsdXN0ZXJNeUNhcGNpdHlBU0dENENEOEI5NyAtLXJlZ2lvbiB1cy1lYXN0LTEnXV0gfSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgnaW50ZXJydXB0IGhhbmRsZXIgaXMgYWRkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IGRlZmF1bHRDYXBhY2l0eTogMCwgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ015Q2FwY2l0eScsIHtcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJnZScpLFxuICAgICAgICAgICAgc3BvdFByaWNlOiAnMC4wMScsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkhlbG1DaGFydC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICAgICAgICBSZWxlYXNlOiAnc3RhY2tjbHVzdGVyY2hhcnRzcG90aW50ZXJydXB0aGFuZGxlcmRlYzYyZTA3JyxcbiAgICAgICAgICAgIENoYXJ0OiAnYXdzLW5vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICAgICAgICBWYWx1ZXM6ICd7XFxcIm5vZGVTZWxlY3RvclxcXCI6e1xcXCJsaWZlY3ljbGVcXFwiOlxcXCJFYzJTcG90XFxcIn19JyxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgICAgICAgIFJlcG9zaXRvcnk6ICdodHRwczovL2F3cy5naXRodWIuaW8vZWtzLWNoYXJ0cycsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ2ludGVycnVwdCBoYW5kbGVyIGlzIG5vdCBhZGRlZCB3aGVuIHNwb3RJbnRlcnJ1cHRIYW5kbGVyIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgLy8gV0hFTlxuICAgICAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMy54bGFyZ2UnKSxcbiAgICAgICAgICAgIHNwb3RQcmljZTogJzAuMDEnLFxuICAgICAgICAgICAgc3BvdEludGVycnVwdEhhbmRsZXI6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIGV4cGVjdChjbHVzdGVyLm5vZGUuZmluZEFsbCgpLmZpbHRlcihjID0+IGMubm9kZS5pZCA9PT0gJ2NoYXJ0LXNwb3QtaW50ZXJydXB0LWhhbmRsZXInKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ2l0cyBwb3NzaWJsZSB0byBhZGQgdHdvIGNhcGFjaXRpZXMgd2l0aCBzcG90IGluc3RhbmNlcyBhbmQgb25seSBvbmUgc3RvcCBoYW5kbGVyIHdpbGwgYmUgaW5zdGFsbGVkJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgLy8gV0hFTlxuICAgICAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdTcG90MScsIHtcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJnZScpLFxuICAgICAgICAgICAgc3BvdFByaWNlOiAnMC4wMScsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnU3BvdDInLCB7XG4gICAgICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNC54bGFyZ2UnKSxcbiAgICAgICAgICAgIHNwb3RQcmljZTogJzAuMDEnLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKGVrcy5IZWxtQ2hhcnQuUkVTT1VSQ0VfVFlQRSwgMSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBib290c3RyYXAgaXMgZGlzYWJsZWQgY2Fubm90IHNwZWNpZnkgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwLCB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICBib290c3RyYXBFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgYm9vdHN0cmFwT3B0aW9uczogeyBhd3NBcGlSZXRyeUF0dGVtcHRzOiAxMCB9LFxuICAgICAgfSkpLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IFwiYm9vdHN0cmFwT3B0aW9uc1wiIGlmIFwiYm9vdHN0cmFwRW5hYmxlZFwiIGlzIGZhbHNlLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdFa3NPcHRpbWl6ZWRJbWFnZSgpIHdpdGggbm8gbm9kZVR5cGUgYWx3YXlzIHVzZXMgU1RBTkRBUkQgd2l0aCBMQVRFU1RfS1VCRVJORVRFU19WRVJTSU9OJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgTEFURVNUX0tVQkVSTkVURVNfVkVSU0lPTiA9ICcxLjI0JztcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5Fa3NPcHRpbWl6ZWRJbWFnZSgpLmdldEltYWdlKHN0YWNrKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJlxuICAgICAgICAgICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnL2FtYXpvbi1saW51eC0yLycpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT04pLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0Vrc09wdGltaXplZEltYWdlKCkgd2l0aCBzcGVjaWZpYyBrdWJlcm5ldGVzVmVyc2lvbiByZXR1cm4gY29ycmVjdCBBTUknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuRWtzT3B0aW1pemVkSW1hZ2UoeyBrdWJlcm5ldGVzVmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLnZlcnNpb24gfSkuZ2V0SW1hZ2Uoc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCcvYW1hem9uLWxpbnV4LTIvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWtzb3B0aW1pemVkYW1pJykgJiZcbiAgICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy8xLjI1LycpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHQgY2x1c3RlciBjYXBhY2l0eSB3aXRoIEFSTTY0IGluc3RhbmNlIHR5cGUgY29tZXMgd2l0aCBub2RlZ3JvdXAgd2l0aCBjb3JyZWN0IEFtaVR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgICBkZWZhdWx0Q2FwYWNpdHk6IDEsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5tZWRpdW0nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgICAgQW1pVHlwZTogJ0FMMl9BUk1fNjQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGROb2RlZ3JvdXAgd2l0aCBBUk02NCBpbnN0YW5jZSB0eXBlIGNvbWVzIHdpdGggbm9kZWdyb3VwIHdpdGggY29ycmVjdCBBbWlUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubWVkaXVtJyksXG4gICAgICB9KS5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTZnLm1lZGl1bScpXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgICAgQW1pVHlwZTogJ0FMMl9BUk1fNjQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGROb2RlZ3JvdXBDYXBhY2l0eSB3aXRoIFQ0ZyBpbnN0YW5jZSB0eXBlIGNvbWVzIHdpdGggbm9kZWdyb3VwIHdpdGggY29ycmVjdCBBbWlUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0NGcubWVkaXVtJyksXG4gICAgICB9KS5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgndDRnLm1lZGl1bScpXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgICAgQW1pVHlwZTogJ0FMMl9BUk1fNjQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkgd2l0aCBUNGcgaW5zdGFuY2UgdHlwZSBjb21lcyB3aXRoIG5vZGVncm91cCB3aXRoIGNvcnJlY3QgQW1pVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3Q0Zy5tZWRpdW0nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCdhbWF6b24tbGludXgtMi1hcm02NC8nKSxcbiAgICAgICkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGROb2RlZ3JvdXBDYXBhY2l0eSB3aXRoIEM3ZyBpbnN0YW5jZSB0eXBlIGNvbWVzIHdpdGggbm9kZWdyb3VwIHdpdGggY29ycmVjdCBBbWlUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjN2cubGFyZ2UnKSxcbiAgICAgIH0pLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdjN2cubGFyZ2UnKV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIEFtaVR5cGU6ICdBTDJfQVJNXzY0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5IHdpdGggQzdnIGluc3RhbmNlIHR5cGUgY29tZXMgd2l0aCBub2RlZ3JvdXAgd2l0aCBjb3JyZWN0IEFtaVR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KS5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjN2cubGFyZ2UnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCdhbWF6b24tbGludXgtMi1hcm02NC8nKSxcbiAgICAgICkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdFS1MtT3B0aW1pemVkIEFNSSB3aXRoIEdQVSBzdXBwb3J0IHdoZW4gYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSkuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdHUFVDYXBhY2l0eScsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnZzRkbi54bGFyZ2UnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnYW1hem9uLWxpbnV4LTItZ3B1JyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnRUtTLU9wdGltaXplZCBBTUkgd2l0aCBBUk02NCB3aGVuIGFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnQVJNQ2FwYWNpdHknLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5tZWRpdW0nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnL2FtYXpvbi1saW51eC0yLWFybTY0LycpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0JvdHRsZVJvY2tldEltYWdlKCkgd2l0aCBzcGVjaWZpYyBrdWJlcm5ldGVzVmVyc2lvbiByZXR1cm4gY29ycmVjdCBBTUknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBCb3R0bGVSb2NrZXRJbWFnZSh7IGt1YmVybmV0ZXNWZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04udmVyc2lvbiB9KS5nZXRJbWFnZShzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJzID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZS5QYXJhbWV0ZXJzO1xuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzJykgJiZcbiAgICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy9ib3R0bGVyb2NrZXQvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzJykgJiZcbiAgICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy9hd3MtazhzLTEuMjUvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2hlbiB1c2luZyBjdXN0b20gcmVzb3VyY2UgYSBjcmVhdGlvbiByb2xlICYgcG9saWN5IGlzIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtQ2x1c3RlcicsIHtcbiAgICAgICAgQ29uZmlnOiB7XG4gICAgICAgICAgbmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICAgICAgcm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyUm9sZUJBMjBGRTcyJywgJ0FybiddIH0sXG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLnZlcnNpb24sXG4gICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015Q2x1c3RlckNvbnRyb2xQbGFuZVNlY3VyaXR5R3JvdXA2QjY1OEY3OScsICdHcm91cElkJ10gfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdWJuZXRJZHM6IFtcbiAgICAgICAgICAgICAgeyBSZWY6ICdNeUNsdXN0ZXJEZWZhdWx0VnBjUHVibGljU3VibmV0MVN1Ym5ldEZBRTVBOUI2JyB9LFxuICAgICAgICAgICAgICB7IFJlZjogJ015Q2x1c3RlckRlZmF1bHRWcGNQdWJsaWNTdWJuZXQyU3VibmV0RjZEMDI4QTAnIH0sXG4gICAgICAgICAgICAgIHsgUmVmOiAnTXlDbHVzdGVyRGVmYXVsdFZwY1ByaXZhdGVTdWJuZXQxU3VibmV0RTFEMERDREInIH0sXG4gICAgICAgICAgICAgIHsgUmVmOiAnTXlDbHVzdGVyRGVmYXVsdFZwY1ByaXZhdGVTdWJuZXQyU3VibmV0MTFGRUE4RDAnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZW5kcG9pbnRQcml2YXRlQWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyByb2xlIGNhbiBiZSBhc3N1bWVkIGJ5IDMgbGFtYmRhIGhhbmRsZXJzICgyIGZvciB0aGUgY2x1c3RlciByZXNvdXJjZSBhbmQgMSBmb3IgdGhlIGt1YmVybmV0ZXMgcmVzb3VyY2UpXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpyb290J10sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHBvbGljeSBhbGxvd3MgY3JlYXRpb24gcm9sZSB0byBwYXNzIHRoZSBjbHVzdGVyIHJvbGUgYW5kIHRvIGludGVyYWN0IHdpdGggdGhlIGNsdXN0ZXIgKGdpdmVuIHdlIGtub3cgdGhlIGV4cGxpY2l0IGNsdXN0ZXIgbmFtZSlcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlDbHVzdGVyUm9sZUJBMjBGRTcyJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWtzOkNyZWF0ZUNsdXN0ZXInLFxuICAgICAgICAgICAgICAgICdla3M6RGVzY3JpYmVDbHVzdGVyJyxcbiAgICAgICAgICAgICAgICAnZWtzOkRlc2NyaWJlVXBkYXRlJyxcbiAgICAgICAgICAgICAgICAnZWtzOkRlbGV0ZUNsdXN0ZXInLFxuICAgICAgICAgICAgICAgICdla3M6VXBkYXRlQ2x1c3RlclZlcnNpb24nLFxuICAgICAgICAgICAgICAgICdla3M6VXBkYXRlQ2x1c3RlckNvbmZpZycsXG4gICAgICAgICAgICAgICAgJ2VrczpDcmVhdGVGYXJnYXRlUHJvZmlsZScsXG4gICAgICAgICAgICAgICAgJ2VrczpUYWdSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgJ2VrczpVbnRhZ1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogW3tcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmVrczp1cy1lYXN0LTE6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpjbHVzdGVyL215LWNsdXN0ZXItbmFtZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmVrczp1cy1lYXN0LTE6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpjbHVzdGVyL215LWNsdXN0ZXItbmFtZS8qJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWtzOkRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUnLFxuICAgICAgICAgICAgICAgICdla3M6RGVsZXRlRmFyZ2F0ZVByb2ZpbGUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpla3M6dXMtZWFzdC0xOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6ZmFyZ2F0ZXByb2ZpbGUvbXktY2x1c3Rlci1uYW1lLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbJ2lhbTpHZXRSb2xlJywgJ2lhbTpsaXN0QXR0YWNoZWRSb2xlUG9saWNpZXMnXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnaWFtOkNyZWF0ZVNlcnZpY2VMaW5rZWRSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZUluc3RhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZU5ldHdvcmtJbnRlcmZhY2VzJyxcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlU2VjdXJpdHlHcm91cHMnLFxuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVTdWJuZXRzJyxcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlUm91dGVUYWJsZXMnLFxuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVEaGNwT3B0aW9ucycsXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVZwY3MnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBhbiBleHBsaWNpdCBjbHVzdGVyIG5hbWUgaXMgbm90IHByb3ZpZGVkLCB0aGUgY3JlYXRpb24gcm9sZSBwb2xpY3kgaXMgd2lkZXIgKGFsbG93cyBpbnRlcmFjdGluZyB3aXRoIGFsbCBjbHVzdGVycyknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpQYXNzUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeUNsdXN0ZXJSb2xlQkEyMEZFNzInLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdla3M6Q3JlYXRlQ2x1c3RlcicsXG4gICAgICAgICAgICAgICAgJ2VrczpEZXNjcmliZUNsdXN0ZXInLFxuICAgICAgICAgICAgICAgICdla3M6RGVzY3JpYmVVcGRhdGUnLFxuICAgICAgICAgICAgICAgICdla3M6RGVsZXRlQ2x1c3RlcicsXG4gICAgICAgICAgICAgICAgJ2VrczpVcGRhdGVDbHVzdGVyVmVyc2lvbicsXG4gICAgICAgICAgICAgICAgJ2VrczpVcGRhdGVDbHVzdGVyQ29uZmlnJyxcbiAgICAgICAgICAgICAgICAnZWtzOkNyZWF0ZUZhcmdhdGVQcm9maWxlJyxcbiAgICAgICAgICAgICAgICAnZWtzOlRhZ1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgICAnZWtzOlVudGFnUmVzb3VyY2UnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiBbJyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdla3M6RGVzY3JpYmVGYXJnYXRlUHJvZmlsZScsXG4gICAgICAgICAgICAgICAgJ2VrczpEZWxldGVGYXJnYXRlUHJvZmlsZScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogWydpYW06R2V0Um9sZScsICdpYW06bGlzdEF0dGFjaGVkUm9sZVBvbGljaWVzJ10sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpDcmVhdGVTZXJ2aWNlTGlua2VkUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVJbnN0YW5jZXMnLFxuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVOZXR3b3JrSW50ZXJmYWNlcycsXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVNlY3VyaXR5R3JvdXBzJyxcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlU3VibmV0cycsXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVJvdXRlVGFibGVzJyxcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlRGhjcE9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVWcGNzJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaWYgaGVsbSBjaGFydHMgYXJlIHVzZWQsIHRoZSBwcm92aWRlciByb2xlIGlzIGFsbG93ZWQgdG8gYXNzdW1lIHRoZSBjcmVhdGlvbiByb2xlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCdNeUNoYXJ0Jywge1xuICAgICAgICBjaGFydDogJ2ZvbycsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgcHJvdmlkZXJTdGFjayA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwcm92aWRlclN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2VrczpEZXNjcmliZUNsdXN0ZXInLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9TdGFja015Q2x1c3RlckQzM0NBRUFCQXJuJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tNeUNsdXN0ZXJDcmVhdGlvblJvbGVBNjc0ODZFNEFybicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnSGFuZGxlclNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeUNCRDBDQzkxJyxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdIYW5kbGVyU2VydmljZVJvbGVGQ0RDMTRBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJvdmlkZXJTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYVZQQ0FjY2Vzc0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9BbWF6b25FQzJDb250YWluZXJSZWdpc3RyeVJlYWRPbmx5JyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQW1hem9uRWxhc3RpY0NvbnRhaW5lclJlZ2lzdHJ5UHVibGljUmVhZE9ubHknLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29yZURuc0NvbXB1dGVUeXBlIHdpbGwgcGF0Y2ggdGhlIGNvcmVETlMgY29uZmlndXJhdGlvbiB0byB1c2UgYSBcImZhcmdhdGVcIiBjb21wdXRlIHR5cGUgYW5kIHJlc3RvcmUgdG8gXCJlYzJcIiB1cG9uIHJlbW92YWwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHtcbiAgICAgICAgY29yZURuc0NvbXB1dGVUeXBlOiBla3MuQ29yZURuc0NvbXB1dGVUeXBlLkZBUkdBVEUsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1BhdGNoJywge1xuICAgICAgICBSZXNvdXJjZU5hbWU6ICdkZXBsb3ltZW50L2NvcmVkbnMnLFxuICAgICAgICBSZXNvdXJjZU5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgICAgQXBwbHlQYXRjaEpzb246ICd7XCJzcGVjXCI6e1widGVtcGxhdGVcIjp7XCJtZXRhZGF0YVwiOntcImFubm90YXRpb25zXCI6e1wiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCI6XCJmYXJnYXRlXCJ9fX19fScsXG4gICAgICAgIFJlc3RvcmVQYXRjaEpzb246ICd7XCJzcGVjXCI6e1widGVtcGxhdGVcIjp7XCJtZXRhZGF0YVwiOntcImFubm90YXRpb25zXCI6e1wiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCI6XCJlYzJcIn19fX19JyxcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgICBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcsXG4gICAgICAgIH0sXG4gICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeUNsdXN0ZXJDcmVhdGlvblJvbGVCNUZBNEZGMycsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBvcGVuSURDb25uZWN0UHJvdmlkZXIgYSBuZXcgT3BlbklEQ29ubmVjdFByb3ZpZGVyIHJlc291cmNlIGlzIGNyZWF0ZWQgYW5kIGV4cG9zZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IGRlZmF1bHRDYXBhY2l0eTogMCwgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXI7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChwcm92aWRlcikudG9FcXVhbChjbHVzdGVyLm9wZW5JZENvbm5lY3RQcm92aWRlcik7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXInLCB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0N1c3RvbUFXU0NES09wZW5JZENvbm5lY3RQcm92aWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRjJDNTQzRTAnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgQ2xpZW50SURMaXN0OiBbXG4gICAgICAgICAgJ3N0cy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgXSxcbiAgICAgICAgVXJsOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgICAgICAgICdPcGVuSWRDb25uZWN0SXNzdWVyVXJsJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnaW5mZXJlbmNlIGluc3RhbmNlcyBhcmUgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAsIHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnSW5mZXJlbmNlSW5zdGFuY2VzJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdpbmYxLjJ4bGFyZ2UnKSxcbiAgICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGliJywgJ2FkZG9ucy9uZXVyb24tZGV2aWNlLXBsdWdpbi55YW1sJyksICd1dGY4Jyk7XG4gICAgICBjb25zdCBzYW5pdGl6ZWQgPSBZQU1MLnBhcnNlKGZpbGVDb250ZW50cyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW3Nhbml0aXplZF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHJlc291cmNlcyBhcmUgYWx3YXlzIGNyZWF0ZWQgYWZ0ZXIgYWxsIGZhcmdhdGUgcHJvZmlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdwcm9maWxlMScsIHsgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdwcm9maWxlMScgfV0gfSk7XG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdyZXNvdXJjZTEnLCB7IGZvbzogMTIzIH0pO1xuICAgICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgncHJvZmlsZTInLCB7IHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAncHJvZmlsZTInIH1dIH0pO1xuICAgICAgbmV3IGVrcy5IZWxtQ2hhcnQoc3RhY2ssICdjaGFydCcsIHsgY2x1c3RlciwgY2hhcnQ6ICdteWNoYXJ0JyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ3Byb2ZpbGUzJywgeyBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ3Byb2ZpbGUzJyB9XSB9KTtcbiAgICAgIG5ldyBla3MuS3ViZXJuZXRlc1BhdGNoKHN0YWNrLCAncGF0Y2gxJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBhcHBseVBhdGNoOiB7IGZvbzogMTIzIH0sXG4gICAgICAgIHJlc3RvcmVQYXRjaDogeyBiYXI6IDEyMyB9LFxuICAgICAgICByZXNvdXJjZU5hbWU6ICdmb28vYmFyJyxcbiAgICAgIH0pO1xuICAgICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgncHJvZmlsZTQnLCB7IHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAncHJvZmlsZTQnIH1dIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCkudGVtcGxhdGU7XG5cbiAgICAgIGNvbnN0IGJhcnJpZXIgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlckt1YmVjdGxSZWFkeUJhcnJpZXIyMDAwNTJBRjtcblxuICAgICAgZXhwZWN0KGJhcnJpZXIuRGVwZW5kc09uKS50b0VxdWFsKFtcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGUxUG9kRXhlY3V0aW9uUm9sZUU4NUY4N0I1JyxcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGUxMjlBRUEzQzYnLFxuICAgICAgICAnQ2x1c3RlcmZhcmdhdGVwcm9maWxlcHJvZmlsZTJQb2RFeGVjdXRpb25Sb2xlMjI2NzBBRjgnLFxuICAgICAgICAnQ2x1c3RlcmZhcmdhdGVwcm9maWxlcHJvZmlsZTIzM0I5QTExNycsXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlM1BvZEV4ZWN1dGlvblJvbGU0NzVDMEQ4RicsXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlM0QwNkYzMDc2JyxcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGU0UG9kRXhlY3V0aW9uUm9sZTA4NjA1N0ZCJyxcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGU0QTBFM0JCRTgnLFxuICAgICAgICAnQ2x1c3RlckNyZWF0aW9uUm9sZURlZmF1bHRQb2xpY3lFOEJERkM3QicsXG4gICAgICAgICdDbHVzdGVyQ3JlYXRpb25Sb2xlMzYwMjQ5QjYnLFxuICAgICAgICAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBrdWJlY3RsUmVzb3VyY2VzID0gWydjaGFydEYyNDQ3QUZDJywgJ3BhdGNoMUI5NjRBQzkzJywgJ0NsdXN0ZXJtYW5pZmVzdHJlc291cmNlMTBCMUM5NTA1JywgJ0NsdXN0ZXJBd3NBdXRobWFuaWZlc3RGRTUxRjhBRSddO1xuXG4gICAgICAvLyBjaGVjayB0aGF0IGFsbCBrdWJlY3RsIHJlc291cmNlcyBkZXBlbmQgb24gdGhlIGJhcnJpZXJcbiAgICAgIGZvciAoY29uc3QgciBvZiBrdWJlY3RsUmVzb3VyY2VzKSB7XG4gICAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5SZXNvdXJjZXNbcl0uRGVwZW5kc09uKS50b0VxdWFsKFsnQ2x1c3Rlckt1YmVjdGxSZWFkeUJhcnJpZXIyMDAwNTJBRiddKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QoJ2t1YmVjdGwgcHJvdmlkZXIgcm9sZSBjYW4gYXNzdW1lIGNyZWF0aW9uIHJvbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICAgIGNvbnN0IGMxID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgICAvLyBXSEVOXG5cbiAgICAgIC8vIGFjdGl2YXRlIGt1YmVjdGwgcHJvdmlkZXJcbiAgICAgIGMxLmFkZE1hbmlmZXN0KCdjMWEnLCB7IGZvbzogMTIzIH0pO1xuICAgICAgYzEuYWRkTWFuaWZlc3QoJ2MxYicsIHsgZm9vOiAxMjMgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyU3RhY2sgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJvdmlkZXJTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdla3M6RGVzY3JpYmVDbHVzdGVyJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tDbHVzdGVyMThERkVBQzE3QXJuJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tDbHVzdGVyMUNyZWF0aW9uUm9sZUVGN0M5QkJDQXJuJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHByb3ZpZGVyU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFWUENBY2Nlc3NFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlSZWFkT25seScsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L0FtYXpvbkVsYXN0aWNDb250YWluZXJSZWdpc3RyeVB1YmxpY1JlYWRPbmx5JyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgna3ViZWN0bCBwcm92aWRlciBwYXNzZXMgc2VjdXJpdHkgZ3JvdXAgdG8gcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAga3ViZWN0bEVudmlyb25tZW50OiB7XG4gICAgICAgIEZvbzogJ0JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gdGhlIGt1YmVjdGwgcHJvdmlkZXIgaXMgaW5zaWRlIGEgbmVzdGVkIHN0YWNrLlxuICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFZwY0NvbmZpZzoge1xuICAgICAgICBTZWN1cml0eUdyb3VwSWRzOiBbeyBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrQ2x1c3RlcjE4REZFQUMxN0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgna3ViZWN0bCBwcm92aWRlciBwYXNzZXMgZW52aXJvbm1lbnQgdG8gbGFtYmRhJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsXG4gICAgICBrdWJlY3RsRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgRm9vOiAnQmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdyZXNvdXJjZScsIHtcbiAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaGVsbG86ICd3b3JsZCcsXG4gICAgICB9LFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIHRoZSBrdWJlY3RsIHByb3ZpZGVyIGlzIGluc2lkZSBhIG5lc3RlZCBzdGFjay5cbiAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICBWYXJpYWJsZXM6IHtcbiAgICAgICAgICBGb286ICdCYXInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2t1YmVjdGwgcHJvdmlkZXIgcGFzc2VzIGlhbSByb2xlIGVudmlyb25tZW50IHRvIGt1YmUgY3RsIGxhbWJkYScsICgpPT57XG4gICAgdGVzdCgnbmV3IGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBjb25zdCBrdWJlY3RsUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ0t1YmVjdGxJYW1Sb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB1c2luZyBfIHN5bnRheCB0byBzaWxlbmNlIHdhcm5pbmcgYWJvdXQgX2NsdXN0ZXIgbm90IGJlaW5nIHVzZWQsIHdoZW4gaXQgaXNcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyMScsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgICAga3ViZWN0bExhbWJkYVJvbGU6IGt1YmVjdGxSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ3Jlc291cmNlJywge1xuICAgICAgICBraW5kOiAnQ29uZmlnTWFwJyxcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICB9LFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdjb25maWctbWFwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGUga3ViZWN0bCBwcm92aWRlciBpcyBpbnNpZGUgYSBuZXN0ZWQgc3RhY2suXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgUm9sZToge1xuICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tLdWJlY3RsSWFtUm9sZTAyRjg5NDdFQXJuJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0ZWQgY2x1c3RlcicsICgpPT4ge1xuICAgICAgY29uc3QgY2x1c3Rlck5hbWUgPSAnbXktY2x1c3Rlcic7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGt1YmVjdGxMYW1iZGFSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnS3ViZWN0bExhbWJkYVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWQnLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lLFxuICAgICAgICBrdWJlY3RsUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMTExMTExOnJvbGUvaWFtLXJvbGUtdGhhdC1oYXMtbWFzdGVycy1hY2Nlc3MnLFxuICAgICAgICBrdWJlY3RsTGFtYmRhUm9sZToga3ViZWN0bExhbWJkYVJvbGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2hhcnQgPSAnaGVsbG8td29ybGQnO1xuICAgICAgY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3QtY2hhcnQnLCB7XG4gICAgICAgIGNoYXJ0LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdJbXBvcnRlZC1LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgUm9sZToge1xuICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvS3ViZWN0bExhbWJkYVJvbGU3RDA4NEQ5NEFybicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEhlbG1DaGFydC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICAgIENsdXN0ZXJOYW1lOiBjbHVzdGVyTmFtZSxcbiAgICAgICAgUm9sZUFybjogJ2Fybjphd3M6aWFtOjoxMTExMTExOnJvbGUvaWFtLXJvbGUtdGhhdC1oYXMtbWFzdGVycy1hY2Nlc3MnLFxuICAgICAgICBSZWxlYXNlOiAnaW1wb3J0ZWRjaGFydHRlc3RjaGFydGYzYWNkNmU1JyxcbiAgICAgICAgQ2hhcnQ6IGNoYXJ0LFxuICAgICAgICBOYW1lc3BhY2U6ICdkZWZhdWx0JyxcbiAgICAgICAgQ3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlbmRwb2ludCBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgdGVzdCgncHVibGljIHJlc3RyaWN0ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBla3MuRW5kcG9pbnRBY2Nlc3MuUFVCTElDLm9ubHlGcm9tKCcxLjIuMy40LzMyJyk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgcmVzdHJpYyBwdWJsaWMgYWNjZXNzIHRvIGVuZHBvaW50IHdoZW4gcHJpdmF0ZSBhY2Nlc3MgaXMgZGlzYWJsZWQuIFVzZSBQVUJMSUNfQU5EX1BSSVZBVEUub25seUZyb21cXChcXCkgaW5zdGVhZC4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3B1YmxpYyBub24gcmVzdHJpY3RlZCB3aXRob3V0IHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQyxcbiAgICAgICAgdnBjU3VibmV0czogW3sgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcblxuICAgICAgLy8gd2UgZG9uJ3QgYXR0YWNoIHZwYyBjb25maWcgaW4gY2FzZSBlbmRwb2ludCBpcyBwdWJsaWMgb25seSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyXG4gICAgICAvLyB0aGUgdnBjIGhhcyBwcml2YXRlIHN1Ym5ldHMgb3Igbm90LlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3B1YmxpYyBub24gcmVzdHJpY3RlZCB3aXRoIHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICAgIC8vIHdlIGRvbid0IGF0dGFjaCB2cGMgY29uZmlnIGluIGNhc2UgZW5kcG9pbnQgaXMgcHVibGljIG9ubHksIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAgLy8gdGhlIHZwYyBoYXMgcHJpdmF0ZSBzdWJuZXRzIG9yIG5vdC5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIHdpdGhvdXQgcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgICAgICB2cGNTdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvVnBjIG11c3QgY29udGFpbiBwcml2YXRlIHN1Ym5ldHMgd2hlbiBwdWJsaWMgZW5kcG9pbnQgYWNjZXNzIGlzIGRpc2FibGVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIHdpdGggcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmZpbmRSZXNvdXJjZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpO1xuICAgICAgZXhwZWN0KGZ1bmN0aW9ucy5IYW5kbGVyODg2Q0I0MEIuUHJvcGVydGllcy5WcGNDb25maWcuU3VibmV0SWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICBleHBlY3QoZnVuY3Rpb25zLkhhbmRsZXI4ODZDQjQwQi5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TZWN1cml0eUdyb3VwSWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGFuZCBub24gcmVzdHJpY3RlZCBwdWJsaWMgd2l0aG91dCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QVUJMSUNfQU5EX1BSSVZBVEUsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICAgIC8vIHdlIGRvbid0IGhhdmUgcHJpdmF0ZSBzdWJuZXRzLCBidXQgd2UgZG9uJ3QgbmVlZCB0aGVtIHNpbmNlIHB1YmxpYyBhY2Nlc3NcbiAgICAgIC8vIGlzIG5vdCByZXN0cmljdGVkLlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ByaXZhdGUgYW5kIG5vbiByZXN0cmljdGVkIHB1YmxpYyB3aXRoIHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICAgIC8vIHdlIGhhdmUgcHJpdmF0ZSBzdWJuZXRzIHNvIHdlIHNob3VsZCB1c2UgdGhlbS5cbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmZpbmRSZXNvdXJjZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpO1xuICAgICAgZXhwZWN0KGZ1bmN0aW9ucy5IYW5kbGVyODg2Q0I0MEIuUHJvcGVydGllcy5WcGNDb25maWcuU3VibmV0SWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICBleHBlY3QoZnVuY3Rpb25zLkhhbmRsZXI4ODZDQjQwQi5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TZWN1cml0eUdyb3VwSWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGFuZCByZXN0cmljdGVkIHB1YmxpYyB3aXRob3V0IHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURS5vbmx5RnJvbSgnMS4yLjMuNC8zMicpLFxuICAgICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9WcGMgbXVzdCBjb250YWluIHByaXZhdGUgc3VibmV0cyB3aGVuIHB1YmxpYyBlbmRwb2ludCBhY2Nlc3MgaXMgcmVzdHJpY3RlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBhbmQgcmVzdHJpY3RlZCBwdWJsaWMgd2l0aCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QVUJMSUNfQU5EX1BSSVZBVEUub25seUZyb20oJzEuMi4zLjQvMzInKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXN0ZWQgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG5cbiAgICAgIC8vIHdlIGhhdmUgcHJpdmF0ZSBzdWJuZXRzIHNvIHdlIHNob3VsZCB1c2UgdGhlbS5cbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmZpbmRSZXNvdXJjZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpO1xuICAgICAgZXhwZWN0KGZ1bmN0aW9ucy5IYW5kbGVyODg2Q0I0MEIuUHJvcGVydGllcy5WcGNDb25maWcuU3VibmV0SWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICBleHBlY3QoZnVuY3Rpb25zLkhhbmRsZXI4ODZDQjQwQi5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TZWN1cml0eUdyb3VwSWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGVuZHBvaW50IGFjY2VzcyBzZWxlY3RzIG9ubHkgcHJpdmF0ZSBzdWJuZXRzIGZyb20gbG9va2VkIHVwIHZwYycsICgpID0+IHtcbiAgICAgIGNvbnN0IHZwY0lkID0gJ3ZwYy0xMjM0NSc7XG4gICAgICAvLyBjYW4ndCB1c2UgdGhlIHJlZ3VsYXIgZml4dHVyZSBiZWNhdXNlIGl0IGFsc28gYWRkcyBhIFZQQyB0byB0aGUgc3RhY2ssIHdoaWNoIHByZXZlbnRzXG4gICAgICAvLyB1cyBmcm9tIHNldHRpbmcgY29udGV4dC5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhuZXcgY2RrLkFwcCgpLCAnU3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMTExMjIyMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGB2cGMtcHJvdmlkZXI6YWNjb3VudD0ke3N0YWNrLmFjY291bnR9OmZpbHRlci52cGMtaWQ9JHt2cGNJZH06cmVnaW9uPSR7c3RhY2sucmVnaW9ufTpyZXR1cm5Bc3ltbWV0cmljU3VibmV0cz10cnVlYCwge1xuICAgICAgICB2cGNJZDogdnBjSWQsXG4gICAgICAgIHZwY0NpZHJCbG9jazogJzEwLjAuMC4wLzE2JyxcbiAgICAgICAgc3VibmV0R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1ByaXZhdGUnLFxuICAgICAgICAgICAgdHlwZTogJ1ByaXZhdGUnLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQtcHJpdmF0ZS1pbi11cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICBjaWRyOiAnMTAuMC4xLjAvMjQnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItMDYwNjhlNGM0MDQ5OTIxZWYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMnLFxuICAgICAgICAgICAgdHlwZTogJ1B1YmxpYycsXG4gICAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3N1Ym5ldC1wdWJsaWMtaW4tdXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgY2lkcjogJzEwLjAuMC4wLzI0JyxcbiAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLTBmZjA4ZTYyMTk1MTk4ZGJiJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHN0YWNrLCAnVnBjJywge1xuICAgICAgICB2cGNJZDogdnBjSWQsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHsgU3VibmV0SWRzOiBbJ3N1Ym5ldC1wcml2YXRlLWluLXVzLWVhc3QtMWEnXSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGVuZHBvaW50IGFjY2VzcyBzZWxlY3RzIG9ubHkgcHJpdmF0ZSBzdWJuZXRzIGZyb20gbG9va2VkIHVwIHZwYyB3aXRoIGNvbmNyZXRlIHN1Ym5ldCBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB2cGNJZCA9ICd2cGMtMTIzNDUnO1xuICAgICAgLy8gY2FuJ3QgdXNlIHRoZSByZWd1bGFyIGZpeHR1cmUgYmVjYXVzZSBpdCBhbHNvIGFkZHMgYSBWUEMgdG8gdGhlIHN0YWNrLCB3aGljaCBwcmV2ZW50c1xuICAgICAgLy8gdXMgZnJvbSBzZXR0aW5nIGNvbnRleHQuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sobmV3IGNkay5BcHAoKSwgJ1N0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMTExMTIyMjInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGB2cGMtcHJvdmlkZXI6YWNjb3VudD0ke3N0YWNrLmFjY291bnR9OmZpbHRlci52cGMtaWQ9JHt2cGNJZH06cmVnaW9uPSR7c3RhY2sucmVnaW9ufTpyZXR1cm5Bc3ltbWV0cmljU3VibmV0cz10cnVlYCwge1xuICAgICAgICB2cGNJZDogdnBjSWQsXG4gICAgICAgIHZwY0NpZHJCbG9jazogJzEwLjAuMC4wLzE2JyxcbiAgICAgICAgc3VibmV0R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1ByaXZhdGUnLFxuICAgICAgICAgICAgdHlwZTogJ1ByaXZhdGUnLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQtcHJpdmF0ZS1pbi11cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICBjaWRyOiAnMTAuMC4xLjAvMjQnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItMDYwNjhlNGM0MDQ5OTIxZWYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMnLFxuICAgICAgICAgICAgdHlwZTogJ1B1YmxpYycsXG4gICAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3N1Ym5ldC1wdWJsaWMtaW4tdXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgY2lkcjogJzEwLjAuMC4wLzI0JyxcbiAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLTBmZjA4ZTYyMTk1MTk4ZGJiJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIHZwY0lkOiB2cGNJZCxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7XG4gICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgZWMyLlN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdQcml2YXRlJywgJ3N1Ym5ldC1wcml2YXRlLWluLXVzLWVhc3QtMWEnKSxcbiAgICAgICAgICAgIGVjMi5TdWJuZXQuZnJvbVN1Ym5ldElkKHN0YWNrLCAnUHVibGljJywgJ3N1Ym5ldC1wdWJsaWMtaW4tdXMtZWFzdC0xYycpLFxuICAgICAgICAgIF0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHsgU3VibmV0SWRzOiBbJ3N1Ym5ldC1wcml2YXRlLWluLXVzLWVhc3QtMWEnXSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGVuZHBvaW50IGFjY2VzcyBzZWxlY3RzIG9ubHkgcHJpdmF0ZSBzdWJuZXRzIGZyb20gbWFuYWdlZCB2cGMgd2l0aCBjb25jcmV0ZSBzdWJuZXQgc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGNTdWJuZXRzOiBbe1xuICAgICAgICAgIHN1Ym5ldHM6IFtcbiAgICAgICAgICAgIHZwYy5wcml2YXRlU3VibmV0c1swXSxcbiAgICAgICAgICAgIHZwYy5wdWJsaWNTdWJuZXRzWzFdLFxuICAgICAgICAgICAgZWMyLlN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdQcml2YXRlJywgJ3N1Ym5ldC11bmtub3duJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbmVzdGVkID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ0Bhd3MtY2RrL2F3cy1la3MuS3ViZWN0bFByb3ZpZGVyJykgYXMgY2RrLk5lc3RlZFN0YWNrO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzoge1xuICAgICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgICAgeyBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4RTZBMTRDQlJlZicgfSxcbiAgICAgICAgICAgICdzdWJuZXQtdW5rbm93bicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBlbmRwb2ludCBhY2Nlc3MgY29uc2lkZXJzIHNwZWNpZmljIHN1Ym5ldCBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOlxuICAgICAgICAgIGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGNTdWJuZXRzOiBbe1xuICAgICAgICAgIHN1Ym5ldHM6IFtlYzIuUHJpdmF0ZVN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcyhzdGFjaywgJ1ByaXZhdGUxJywge1xuICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQxJyxcbiAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHsgU3VibmV0SWRzOiBbJ3N1Ym5ldDEnXSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gY29uZmlndXJlIHByaXZhdGUgZW5kcG9pbnQgYWNjZXNzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyMScsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgYXBwID0gc3RhY2subm9kZS5yb290IGFzIGNkay5BcHA7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3RlcjFCMDJERDVBMi5Qcm9wZXJ0aWVzLkNvbmZpZy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLlJlc291cmNlcy5DbHVzdGVyMUIwMkRENUEyLlByb3BlcnRpZXMuQ29uZmlnLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcykudG9FcXVhbChmYWxzZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHByb3ZpZGVyIGNob29zZXMgb25seSBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgbWF4QXpzOiAyLFxuICAgICAgICBuYXRHYXRld2F5czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgICBuYW1lOiAnUHJpdmF0ZTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYzEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgncmVzb3VyY2UnLCB7XG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaGVsbG86ICd3b3JsZCcsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZSBrdWJlY3RsIHByb3ZpZGVyIGlzIGluc2lkZSBhIG5lc3RlZCBzdGFjay5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHtcbiAgICAgICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tDbHVzdGVyMThERkVBQzE3Q2x1c3RlclNlY3VyaXR5R3JvdXBJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tWcGNQcml2YXRlMVN1Ym5ldDFTdWJuZXQ2NzY0QTBGNlJlZicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrVnBjUHJpdmF0ZTFTdWJuZXQyU3VibmV0REZENDk2NDVSZWYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHByb3ZpZGVyIGxpbWl0cyBudW1iZXIgb2Ygc3VibmV0cyB0byAxNicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IHN1Ym5ldENvbmZpZ3VyYXRpb246IGVjMi5TdWJuZXRDb25maWd1cmF0aW9uW10gPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24ucHVzaCh7XG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICBuYW1lOiBgUHJpdmF0ZSR7aX1gLFxuICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uLnB1c2goe1xuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIG5hbWU6ICdQdWJsaWMxJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2cGMyID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMixcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGM6IHZwYzIsXG4gICAgICB9KTtcblxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgncmVzb3VyY2UnLCB7XG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaGVsbG86ICd3b3JsZCcsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZSBrdWJlY3RsIHByb3ZpZGVyIGlzIGluc2lkZSBhIG5lc3RlZCBzdGFjay5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmZpbmRSZXNvdXJjZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpO1xuICAgICAgZXhwZWN0KGZ1bmN0aW9ucy5IYW5kbGVyODg2Q0I0MEIuUHJvcGVydGllcy5WcGNDb25maWcuU3VibmV0SWRzLmxlbmd0aCkudG9FcXVhbCgxNik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHByb3ZpZGVyIGNvbnNpZGVycyB2cGMgc3VibmV0IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IHN1Ym5ldENvbmZpZ3VyYXRpb246IGVjMi5TdWJuZXRDb25maWd1cmF0aW9uW10gPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24ucHVzaCh7XG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICBuYW1lOiBgUHJpdmF0ZSR7aX1gLFxuICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uLnB1c2goe1xuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIG5hbWU6ICdQdWJsaWMxJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2cGMyID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMixcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGM6IHZwYzIsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldEdyb3VwTmFtZTogJ1ByaXZhdGUxJyB9LCB7IHN1Ym5ldEdyb3VwTmFtZTogJ1ByaXZhdGUyJyB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdyZXNvdXJjZScsIHtcbiAgICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBoZWxsbzogJ3dvcmxkJyxcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBuYW1lOiAnY29uZmlnLW1hcCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlIGt1YmVjdGwgcHJvdmlkZXIgaXMgaW5zaWRlIGEgbmVzdGVkIHN0YWNrLlxuICAgICAgY29uc3QgbmVzdGVkID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ0Bhd3MtY2RrL2F3cy1la3MuS3ViZWN0bFByb3ZpZGVyJykgYXMgY2RrLk5lc3RlZFN0YWNrO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzoge1xuICAgICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9TdGFja0NsdXN0ZXIxOERGRUFDMTdDbHVzdGVyU2VjdXJpdHlHcm91cElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBTdWJuZXRJZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9TdGFja1ZwY1ByaXZhdGUxU3VibmV0MVN1Ym5ldDY3NjRBMEY2UmVmJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2tWcGNQcml2YXRlMVN1Ym5ldDJTdWJuZXRERkQ0OTY0NVJlZicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrVnBjUHJpdmF0ZTJTdWJuZXQxU3VibmV0NTg2QUQzOTJSZWYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9TdGFja1ZwY1ByaXZhdGUyU3VibmV0MlN1Ym5ldEU0MjE0OEMwUmVmJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgd2hlbiBwcml2YXRlIGFjY2VzcyBpcyBjb25maWd1cmVkIHdpdGhvdXQgZG5zIHN1cHBvcnQgZW5hYmxlZCBmb3IgdGhlIFZQQycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdnBjOiBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IGZhbHNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvUHJpdmF0ZSBlbmRwb2ludCBhY2Nlc3MgcmVxdWlyZXMgdGhlIFZQQyB0byBoYXZlIEROUyBzdXBwb3J0IGFuZCBETlMgaG9zdG5hbWVzIGVuYWJsZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IHdoZW4gcHJpdmF0ZSBhY2Nlc3MgaXMgY29uZmlndXJlZCB3aXRob3V0IGRucyBob3N0bmFtZXMgZW5hYmxlZCBmb3IgdGhlIFZQQycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdnBjOiBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogZmFsc2UsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Qcml2YXRlIGVuZHBvaW50IGFjY2VzcyByZXF1aXJlcyB0aGUgVlBDIHRvIGhhdmUgRE5TIHN1cHBvcnQgYW5kIEROUyBob3N0bmFtZXMgZW5hYmxlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgd2hlbiBjaWRycyBhcmUgY29uZmlndXJlZCB3aXRob3V0IHB1YmxpYyBhY2Nlc3MgZW5kcG9pbnQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURS5vbmx5RnJvbSgnMS4yLjMuNC81Jyk7XG4gICAgICB9KS50b1Rocm93KC9DSURSIGJsb2NrcyBjYW4gb25seSBiZSBjb25maWd1cmVkIHdoZW4gcHVibGljIGFjY2VzcyBpcyBlbmFibGVkLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dldFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBjbHVzdGVyLmdldFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzKCdteXNlcnZpY2UnKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTG9hZEJhbGFuY2VyQWRkcmVzcycsIHtcbiAgICAgIHZhbHVlOiBsb2FkQmFsYW5jZXJBZGRyZXNzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhwZWN0ZWRLdWJlcm5ldGVzR2V0SWQgPSAnQ2x1c3RlcjFteXNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzMTk4Q0NCMDMnO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICBjb25zdCByZXNvdXJjZXMgPSB0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc09iamVjdFZhbHVlJyk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhlIGN1c3RvbSByZXNvdXJjZSBpcyBjcmVhdGVkIGNvcnJlY3RseVxuICAgIGV4cGVjdChyZXNvdXJjZXNbZXhwZWN0ZWRLdWJlcm5ldGVzR2V0SWRdLlByb3BlcnRpZXMpLnRvRXF1YWwoe1xuICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdhd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlck5lc3RlZFN0YWNrUmVzb3VyY2VBN0FFQkE2QicsXG4gICAgICAgICAgJ091dHB1dHMuU3RhY2thd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50ODg5N0ZEOUJBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXIxQjAyREQ1QTInLFxuICAgICAgfSxcbiAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0NsdXN0ZXIxQ3JlYXRpb25Sb2xlQTIzMUJFOEQnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIE9iamVjdFR5cGU6ICdzZXJ2aWNlJyxcbiAgICAgIE9iamVjdE5hbWU6ICdteXNlcnZpY2UnLFxuICAgICAgT2JqZWN0TmFtZXNwYWNlOiAnZGVmYXVsdCcsXG4gICAgICBKc29uUGF0aDogJy5zdGF0dXMubG9hZEJhbGFuY2VyLmluZ3Jlc3NbMF0uaG9zdG5hbWUnLFxuICAgICAgVGltZW91dFNlY29uZHM6IDMwMCxcbiAgICB9KTtcblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUgYXR0cmlidXRlIHBvaW50cyB0byB0aGUgZXhwZWN0ZWQgY3VzdG9tIHJlc291cmNlIGFuZCBleHRyYWN0cyB0aGUgY29ycmVjdCBhdHRyaWJ1dGVcbiAgICB0ZW1wbGF0ZS5oYXNPdXRwdXQoJ0xvYWRCYWxhbmNlckFkZHJlc3MnLCB7XG4gICAgICBWYWx1ZTogeyAnRm46OkdldEF0dCc6IFtleHBlY3RlZEt1YmVybmV0ZXNHZXRJZCwgJ1ZhbHVlJ10gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGt1YmVjdGwgbGF5ZXIgY2FuIGJlIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsYXllciA9IGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihzdGFjaywgJ015TGF5ZXInLCAnYXJuOm9mOmxheWVyJyk7XG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsTGF5ZXI6IGxheWVyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHByb3ZpZGVyU3RhY2sgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQGF3cy1jZGsvYXdzLWVrcy5LdWJlY3RsUHJvdmlkZXInKSBhcyBjZGsuTmVzdGVkU3RhY2s7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHByb3ZpZGVyU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgTGF5ZXJzOiBbXG4gICAgICAgIHsgUmVmOiAnQXdzQ2xpTGF5ZXJGNDRBQUY5NCcgfSxcbiAgICAgICAgJ2FybjpvZjpsYXllcicsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgna3ViZWN0bExheWVyIGFubm90YXRpb24nLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gbWVzc2FnZSh2ZXJzaW9uOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGBZb3UgY3JlYXRlZCBhIGNsdXN0ZXIgd2l0aCBLdWJlcm5ldGVzIFZlcnNpb24gMS4ke3ZlcnNpb259IHdpdGhvdXQgc3BlY2lmeWluZyB0aGUga3ViZWN0bExheWVyIHByb3BlcnR5LmAsXG4gICAgICAgICdUaGlzIG1heSBjYXVzZSBmYWlsdXJlcyBhcyB0aGUga3ViZWN0bCB2ZXJzaW9uIHByb3ZpZGVkIHdpdGggYXdzLWNkay1saWIgaXMgMS4yMCwgd2hpY2ggaXMgb25seSBndWFyYW50ZWVkIHRvIGJlIGNvbXBhdGlibGUgd2l0aCBLdWJlcm5ldGVzIHZlcnNpb25zIDEuMTktMS4yMS4nLFxuICAgICAgICBgUGxlYXNlIHByb3ZpZGUgYSBrdWJlY3RsTGF5ZXIgZnJvbSBAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12JHt2ZXJzaW9ufS5gLFxuICAgICAgXS5qb2luKCcgJyk7XG4gICAgfVxuXG4gICAgdGVzdCgnbm90IGFkZGVkIHdoZW4gdmVyc2lvbiA8IDEuMjIgYW5kIG5vIGt1YmVjdGwgbGF5ZXIgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjEsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc05vV2FybmluZygnL1N0YWNrL0NsdXN0ZXIxJywgbWVzc2FnZSgnMjEnKSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRlZCB3aGVuIHZlcnNpb24gPj0gMS4yMiBhbmQgbm8ga3ViZWN0bCBsYXllciBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8yNCxcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL1N0YWNrL0NsdXN0ZXIxJywgbWVzc2FnZSgnMjQnKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbSBhd3NjbGkgbGF5ZXIgY2FuIGJlIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsYXllciA9IGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihzdGFjaywgJ015TGF5ZXInLCAnYXJuOm9mOmxheWVyJyk7XG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBhd3NjbGlMYXllcjogbGF5ZXIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcHJvdmlkZXJTdGFjayA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcicpIGFzIGNkay5OZXN0ZWRTdGFjaztcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJvdmlkZXJTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBMYXllcnM6IFtcbiAgICAgICAgJ2FybjpvZjpsYXllcicsXG4gICAgICAgIHsgUmVmOiAnS3ViZWN0bExheWVyNjAwMjA3QjUnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBjbHVzdGVyIHVzaW5nIGN1c3RvbSByZXNvdXJjZSB3aXRoIHNlY3JldHMgZW5jcnlwdGlvbiB1c2luZyBLTVMgQ01LJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBzZWNyZXRzRW5jcnlwdGlvbktleTogbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUNsdXN0ZXInLCB7XG4gICAgICBDb25maWc6IHtcbiAgICAgICAgZW5jcnlwdGlvbkNvbmZpZzogW3tcbiAgICAgICAgICBwcm92aWRlcjoge1xuICAgICAgICAgICAga2V5QXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdLZXk5NjFCNzNGRCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJ3NlY3JldHMnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gbWVtb3J5IHNpemUgZm9yIGt1YmVjdGwgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMsIGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bE1lbW9yeTogY2RrLlNpemUuZ2liaWJ5dGVzKDIpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBwcm92aWRlck5lc3RlZFN0YWNrVGVtcGxhdGUgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oY2FzbS5kaXJlY3RvcnksICdTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlcjczNDZGNzk5Lm5lc3RlZC50ZW1wbGF0ZS5qc29uJyksICd1dGYtOCcpKTtcbiAgICBleHBlY3QocHJvdmlkZXJOZXN0ZWRTdGFja1RlbXBsYXRlPy5SZXNvdXJjZXM/LkhhbmRsZXI4ODZDQjQwQj8uUHJvcGVydGllcz8uTWVtb3J5U2l6ZSkudG9FcXVhbCgyMDQ4KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIG1lbW9yeSBzaXplIGZvciBpbXBvcnRlZCBjbHVzdGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWQnLCB7XG4gICAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXInLFxuICAgICAga3ViZWN0bFJvbGVBcm46ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvTXlSb2xlJyxcbiAgICAgIGt1YmVjdGxNZW1vcnk6IGNkay5TaXplLmdpYmlieXRlcyg0KSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ2ZvbycsIHsgYmFyOiAxMjMgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY2FzbSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHByb3ZpZGVyTmVzdGVkU3RhY2tUZW1wbGF0ZSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjYXNtLmRpcmVjdG9yeSwgJ1N0YWNrU3RhY2tJbXBvcnRlZDFDQkE5QzUwS3ViZWN0bFByb3ZpZGVyQUEwMEJBNDkubmVzdGVkLnRlbXBsYXRlLmpzb24nKSwgJ3V0Zi04JykpO1xuICAgIGV4cGVjdChwcm92aWRlck5lc3RlZFN0YWNrVGVtcGxhdGU/LlJlc291cmNlcz8uSGFuZGxlcjg4NkNCNDBCPy5Qcm9wZXJ0aWVzPy5NZW1vcnlTaXplKS50b0VxdWFsKDQwOTYpO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBjbHVzdGVyIHVzaW5nIGN1c3RvbSBrdWJlcm5ldGVzIG5ldHdvcmsgY29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjdXN0b21DaWRyID0gJzE3Mi4xNi4wLjAvMTInO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBzZXJ2aWNlSXB2NENpZHI6IGN1c3RvbUNpZHIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1DbHVzdGVyJywge1xuICAgICAgQ29uZmlnOiB7XG4gICAgICAgIGt1YmVybmV0ZXNOZXR3b3JrQ29uZmlnOiB7XG4gICAgICAgICAgc2VydmljZUlwdjRDaWRyOiBjdXN0b21DaWRyLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==