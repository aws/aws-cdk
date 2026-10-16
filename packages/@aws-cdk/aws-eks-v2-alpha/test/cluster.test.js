"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const assertions_1 = require("aws-cdk-lib/assertions");
const asg = require("aws-cdk-lib/aws-autoscaling");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib/core");
const cdk8s = require("cdk8s");
const constructs_1 = require("constructs");
const YAML = require("yaml");
const util_1 = require("./util");
const eks = require("../lib");
const lib_1 = require("../lib");
const kubectl_provider_1 = require("../lib/kubectl-provider");
const bottlerocket_1 = require("../lib/private/bottlerocket");
const CLUSTER_VERSION = eks.KubernetesVersion.V1_33;
const commonProps = {
    version: CLUSTER_VERSION,
    defaultCapacity: 0,
    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
};
describe('cluster', () => {
    test('can configure and access ALB controller', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            albController: {
                version: eks.AlbControllerVersion.V2_4_1,
            },
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
            Chart: 'aws-load-balancer-controller',
        });
        expect(cluster.albController).toBeDefined();
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
                ...commonProps,
            })).toThrow(/cannot select multiple subnet groups/);
        });
        test('synthesis works if only one subnet group is selected', () => {
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                vpc: vpc,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                ...commonProps,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                ResourcesVpcConfig: {
                    SubnetIds: {
                        'Fn::Split': [
                            ',',
                            { 'Fn::ImportValue': 'myPublicSubnetIds' },
                        ],
                    },
                },
            });
        });
    });
    test('throws when accessing cluster security group for imported cluster without cluster security group id', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
        });
        expect(() => cluster.clusterSecurityGroup).toThrow(/"clusterSecurityGroup" is not defined for this imported cluster/);
    });
    test('can access cluster security group for imported cluster with cluster security group id', () => {
        const { stack } = (0, util_1.testFixture)();
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
            prune: false,
        });
        // WHEN
        cluster.addAutoScalingGroupCapacity('self-managed', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: [
                { 'Fn::GetAtt': ['ClusterselfmanagedInstanceSecurityGroup64468C3A', 'GroupId'] },
                { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('security group of self-managed asg is not tagged with owned', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
                { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('cluster security group is attached when connecting self-managed nodes', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
                { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
            ],
        });
    });
    test('throws when a non cdk8s chart construct is added as cdk8s chart', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            ...commonProps,
            prune: false,
        });
        // create a plain construct, not a cdk8s chart
        const someConstruct = new constructs_1.Construct(stack, 'SomeConstruct');
        expect(() => cluster.addCdk8sChart('chart', someConstruct)).toThrow(/Invalid cdk8s chart. Must contain a \'toJson\' method, but found undefined/);
    });
    test('cdk8s chart can be added to cluster', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            ...commonProps,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
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
                            Ref: 'ClusterEB0386A7',
                        },
                        '"},"name":"fake-pod"}}]',
                    ],
                ],
            },
        });
    });
    test('cluster connections include both control plane and cluster security group', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            ...commonProps,
            prune: false,
        });
        expect(cluster.connections.securityGroups.map(sg => stack.resolve(sg.securityGroupId))).toEqual([
            { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
            { 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] },
        ]);
    });
    test('can declare a security group from a different stack', () => {
        class ClusterStack extends cdk.Stack {
            eksCluster;
            constructor(scope, id, props) {
                super(scope, id);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    ...commonProps,
                    prune: false,
                    securityGroup: props.sg,
                    vpc: props.vpc,
                });
            }
        }
        class NetworkStack extends cdk.Stack {
            securityGroup;
            vpc;
            constructor(scope, id) {
                super(scope, id);
                this.vpc = new ec2.Vpc(this, 'Vpc');
                this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc: this.vpc });
            }
        }
        const { app } = (0, util_1.testFixture)();
        const networkStack = new NetworkStack(app, 'NetworkStack');
        new ClusterStack(app, 'ClusterStack', { sg: networkStack.securityGroup, vpc: networkStack.vpc });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a manifest with a token from a different stack than the cluster that depends on the cluster stack', () => {
        class ClusterStack extends cdk.Stack {
            eksCluster;
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    ...commonProps,
                    prune: false,
                    kubectlProviderOptions: {
                        kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
                    },
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
        const { app } = (0, util_1.testFixture)();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ManifestStack(app, 'ManifestStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a chart with a token from a different stack than the cluster that depends on the cluster stack', () => {
        class ClusterStack extends cdk.Stack {
            eksCluster;
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    kubectlProviderOptions: {
                        kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
                    },
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
        const { app } = (0, util_1.testFixture)();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a HelmChart in a different stack than the cluster', () => {
        class ClusterStack extends cdk.Stack {
            eksCluster;
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'Cluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    kubectlProviderOptions: {
                        kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
                    },
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
        const { app } = (0, util_1.testFixture)();
        const clusterStack = new ClusterStack(app, 'ClusterStack');
        new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('can declare a ServiceAccount in a different stack than the cluster', () => {
        class ClusterStack extends cdk.Stack {
            eksCluster;
            constructor(scope, id, props) {
                super(scope, id, props);
                this.eksCluster = new eks.Cluster(this, 'EKSCluster', {
                    version: CLUSTER_VERSION,
                    prune: false,
                    kubectlProviderOptions: {
                        kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
                    },
                });
            }
        }
        class AppStack extends cdk.Stack {
            constructor(scope, id, props) {
                super(scope, id, props);
                new eks.ServiceAccount(this, 'testAccount', { cluster: props.cluster, name: 'test-account', namespace: 'test' });
            }
        }
        const { app } = (0, util_1.testFixture)();
        const clusterStack = new ClusterStack(app, 'EKSCluster');
        new AppStack(app, 'KubeApp', { cluster: clusterStack.eksCluster });
        // make sure we can synth (no circular dependencies between the stacks)
        app.synth();
    });
    test('a default cluster spans all subnets', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, ...commonProps, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            RoleArn: { 'Fn::GetAtt': ['ClusterRoleFA261979', 'Arn'] },
            Version: CLUSTER_VERSION.version,
            ResourcesVpcConfig: {
                SecurityGroupIds: [{ 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] }],
                SubnetIds: [
                    { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
                    { Ref: 'VPCPublicSubnet2Subnet74179F39' },
                    { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
                    { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
                ],
            },
        });
    });
    test('if "vpc" is not specified, vpc with default configuration will be created', () => {
        // GIVEN
        const { stack } = (0, util_1.testFixtureNoVpc)();
        // WHEN
        new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', assertions_1.Match.anyValue());
    });
    describe('no default capacity as auto mode is implicitly enabled', () => {
        test('no default capacity by default', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });
            // THEN
            expect(cluster.defaultNodegroup).toBeUndefined();
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EKS::Nodegroup', 0);
        });
        test('quantity and type can be customized', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', {
                defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
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
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', {
                ...commonProps,
                prune: false,
            });
            // THEN
            expect(cluster.defaultCapacity).toBeUndefined();
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::LaunchConfiguration', 0);
        });
    });
    test('creating a cluster tags the private VPC subnets', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
            prune: false,
        });
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
            prune: false,
        });
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
                    Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'ClusterEB0386A7' }]] },
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
        const { stack } = (0, util_1.testFixtureNoVpc)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'cluster', {
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
                    Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'ClusterEB0386A7' }]] },
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
            prune: false,
        });
        expect(() => cluster.addAutoScalingGroupCapacity('Bottlerocket', {
            instanceType: new ec2.InstanceType('t2.medium'),
            machineImageType: eks.MachineImageType.BOTTLEROCKET,
            bootstrapOptions: {},
        })).toThrow(/bootstrapOptions is not supported for Bottlerocket/);
    });
    test('import cluster with existing kubectl provider function', () => {
        const { stack } = (0, util_1.testFixture)();
        const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
        const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
            serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
            role: handlerRole,
        });
        const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster',
            kubectlProvider: kubectlProvider,
        });
        expect(cluster.kubectlProvider).toEqual(kubectlProvider);
    });
    describe('import cluster with existing kubectl provider function should work as expected with resources relying on kubectl getOrCreate', () => {
        test('creates helm chart', () => {
            const { stack } = (0, util_1.testFixture)();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                role: handlerRole,
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
            });
        });
        test('creates Kubernetes patch', () => {
            const { stack } = (0, util_1.testFixture)();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                role: handlerRole,
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
            });
        });
        test('creates Kubernetes object value', () => {
            const { stack } = (0, util_1.testFixture)();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                role: handlerRole,
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
            });
            expect(cluster.kubectlProvider).not.toBeInstanceOf(eks.KubectlProvider);
        });
    });
    test('exercise export/import', () => {
        // GIVEN
        const { stack: stack1, vpc, app } = (0, util_1.testFixture)();
        const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
        const cluster = new eks.Cluster(stack1, 'Cluster', {
            vpc,
            ...commonProps,
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
                                    'Fn::ImportValue': 'Stack:ExportsOutputRefClusterEB0386A796A0E3FE',
                                },
                            ],
                        ],
                    },
                },
            },
        });
    });
    test('addManifest can be used to apply k8s manifests on this cluster', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
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
        const { stack, app } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'cluster', {
            version: CLUSTER_VERSION,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
        }); // cluster is under stack2
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
                            'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttclusterKubectlProviderframeworkonEvent7E8470F1Arn6086AAA4',
                        },
                        Manifest: '[{\"foo\":\"bar\"}]',
                        ClusterName: { 'Fn::ImportValue': 'Stack:ExportsOutputRefcluster611F8AFFA07FC079' },
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
    describe('outputs', () => {
        test('no outputs are synthesized by default', () => {
            // GIVEN
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toBeUndefined(); // no outputs
        });
        describe('boostrap user-data', () => {
            test('rendered by default for ASGs', () => {
                // GIVEN
                const { app, stack } = (0, util_1.testFixtureNoVpc)();
                const cluster = new eks.Cluster(stack, 'Cluster', {
                    ...commonProps,
                    prune: false,
                });
                // WHEN
                cluster.addAutoScalingGroupCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });
                // THEN
                const template = app.synth().getStackByName(stack.stackName).template;
                const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
            });
            test('not rendered if bootstrap is disabled', () => {
                // GIVEN
                const { app, stack } = (0, util_1.testFixtureNoVpc)();
                const cluster = new eks.Cluster(stack, 'Cluster', {
                    ...commonProps,
                    prune: false,
                });
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
                const { app, stack } = (0, util_1.testFixtureNoVpc)();
                const cluster = new eks.Cluster(stack, 'Cluster', {
                    ...commonProps,
                    prune: false,
                });
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
                expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
            });
            describe('spot instances', () => {
                test('nodes labeled an tainted accordingly', () => {
                    // GIVEN
                    const { app, stack } = (0, util_1.testFixtureNoVpc)();
                    const cluster = new eks.Cluster(stack, 'Cluster', {
                        ...commonProps,
                        prune: false,
                        kubectlProviderOptions: {
                            kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                        },
                    });
                    // WHEN
                    cluster.addAutoScalingGroupCapacity('MyCapcity', {
                        instanceType: new ec2.InstanceType('m3.xlargs'),
                        spotPrice: '0.01',
                    });
                    // THEN
                    const template = app.synth().getStackByName(stack.stackName).template;
                    const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                    expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
                });
            });
        });
        test('if bootstrap is disabled cannot specify options', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
            });
            // THEN
            expect(() => cluster.addAutoScalingGroupCapacity('MyCapcity', {
                instanceType: new ec2.InstanceType('m3.xlargs'),
                bootstrapEnabled: false,
                bootstrapOptions: { awsApiRetryAttempts: 10 },
            })).toThrow(/Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
        });
        test('EksOptimizedImage() with no nodeType always uses STANDARD with LATEST_KUBERNETES_VERSION', () => {
            // GIVEN
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.EksOptimizedImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('/amazon-linux-2/'))).toEqual(true);
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
                v.Default.includes('/1.33/'))).toEqual(true);
        });
        test('default cluster capacity with ARM64 instance type comes with nodegroup with correct AmiType', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
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
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new eks.Cluster(stack, 'cluster', {
                ...commonProps,
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
            const { app, stack } = (0, util_1.testFixtureNoVpc)();
            // WHEN
            new bottlerocket_1.BottleRocketImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);
            // THEN
            const assembly = app.synth();
            const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
                v.Default.includes('/bottlerocket/'))).toEqual(true);
            expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
                v.Default.includes('/aws-k8s-1.33/'))).toEqual(true);
        });
        test('coreDnsComputeType will patch the coreDNS configuration to use a "fargate" compute type and restore to "ec2" upon removal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new eks.Cluster(stack, 'MyCluster', {
                coreDnsComputeType: eks.CoreDnsComputeType.FARGATE,
                version: CLUSTER_VERSION,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
                ResourceName: 'deployment/coredns',
                ResourceNamespace: 'kube-system',
                ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
                RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
                ClusterName: {
                    Ref: 'MyCluster4C1BA579',
                },
            });
        });
        test('if openIDConnectProvider a new OpenIDConnectProvider resource is created and exposed', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
            });
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
                        'ClusterEB0386A7',
                        'OpenIdConnectIssuerUrl',
                    ],
                },
            });
        });
        test('inf1 instances are supported', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addAutoScalingGroupCapacity('InferenceInstances', {
                instanceType: new ec2.InstanceType('inf1.2xlarge'),
                minCapacity: 1,
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('inf2 instances are supported', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addAutoScalingGroupCapacity('InferenceInstances', {
                instanceType: new ec2.InstanceType('inf2.xlarge'),
                minCapacity: 1,
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('trn1 instances are supported', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addAutoScalingGroupCapacity('TrainiumInstances', {
                instanceType: new ec2.InstanceType('trn1.2xlarge'),
                minCapacity: 1,
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('trn1n instances are supported', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addAutoScalingGroupCapacity('TrainiumInstances', {
                instanceType: new ec2.InstanceType('trn1n.2xlarge'),
                minCapacity: 1,
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('inf1 instances are supported in addNodegroupCapacity', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addNodegroupCapacity('InferenceInstances', {
                instanceTypes: [new ec2.InstanceType('inf1.2xlarge')],
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('inf2 instances are supported in addNodegroupCapacity', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixtureNoVpc)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                ...commonProps,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            cluster.addNodegroupCapacity('InferenceInstances', {
                instanceTypes: [new ec2.InstanceType('inf2.xlarge')],
            });
            const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                Manifest: JSON.stringify([sanitized]),
            });
        });
        test('kubectl resources are always created after all fargate profiles', () => {
            // GIVEN
            const { stack, app } = (0, util_1.testFixture)();
            const cluster = new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
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
                'ClusterEB0386A7',
            ]);
            const kubectlResources = ['chartF2447AFC', 'patch1B964AC93', 'Clustermanifestresource10B1C9505'];
            // check that all kubectl resources depend on the barrier
            for (const r of kubectlResources) {
                expect(template.Resources[r].DependsOn).toEqual(['ClusterKubectlReadyBarrier200052AF']);
            }
        });
        test('kubectl provider role have right policy', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixture)();
            const c1 = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // WHEN
            // activate kubectl provider
            c1.addManifest('c1a', { foo: 123 });
            c1.addManifest('c1b', { foo: 123 });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'eks:DescribeCluster',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'Cluster192CD0375',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
                        'Fn::If': [
                            'Cluster1KubectlProviderHandlerHasEcrPublic0B1C9820',
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':iam::aws:policy/AmazonElasticContainerRegistryPublicReadOnly',
                                    ],
                                ],
                            },
                            {
                                Ref: 'AWS::NoValue',
                            },
                        ],
                    },
                ],
            });
        });
    });
    test('kubectl provider passes security group to provider', () => {
        const { stack } = (0, util_1.testFixture)();
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            endpointAccess: eks.EndpointAccess.PRIVATE,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                environment: {
                    Foo: 'Bar',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            VpcConfig: {
                SecurityGroupIds: [{ 'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'] }],
            },
        });
    });
    test('kubectl provider passes environment to lambda', () => {
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            endpointAccess: eks.EndpointAccess.PRIVATE,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                environment: {
                    Foo: 'Bar',
                },
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    Foo: 'Bar',
                },
            },
        });
    });
    describe('kubectl provider passes iam role environment to kubectl lambda', () => {
        test('new cluster', () => {
            const { stack } = (0, util_1.testFixture)();
            const kubectlRole = new iam.Role(stack, 'KubectlIamRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // using _ syntax to silence warning about _cluster not being used, when it is
            const cluster = new eks.Cluster(stack, 'Cluster1', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                    role: kubectlRole,
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Role: {
                    'Fn::GetAtt': ['Cluster1KubectlProviderframeworkonEventServiceRole67819AA9', 'Arn'],
                },
            });
        });
        test('imported cluster', () => {
            const clusterName = 'my-cluster';
            const stack = new cdk.Stack();
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = kubectl_provider_1.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
                role: handlerRole,
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Imported', {
                clusterName,
                kubectlProvider: kubectlProvider,
            });
            const chart = 'hello-world';
            cluster.addHelmChart('test-chart', {
                chart,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
                ClusterName: clusterName,
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
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // we don't attach vpc config in case endpoint is public only, regardless of whether
            // the vpc has private subnets or not.
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('public non restricted with private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                endpointAccess: eks.EndpointAccess.PUBLIC,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // we don't attach vpc config in case endpoint is public only, regardless of whether
            // the vpc has private subnets or not.
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('private without private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
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
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PRIVATE,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            const functions = assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function');
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
        });
        test('private and non restricted public without private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
                vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // we don't have private subnets, but we don't need them since public access
            // is not restricted.
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: assertions_1.Match.absent(),
            });
        });
        test('private and non restricted public with private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // we have private subnets so we should use them.
            const functions = assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function');
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
        });
        test('private and restricted public without private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
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
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                prune: false,
                endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom('1.2.3.4/32'),
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            // we have private subnets so we should use them.
            const functions = assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function');
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
            expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: { SubnetIds: ['subnet-private-in-us-east-1a'] },
            });
        });
        test('private endpoint access selects only private subnets from managed vpc with concrete subnet selection', () => {
            const { stack } = (0, util_1.testFixture)();
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SubnetIds: [
                        { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                        'subnet-unknown',
                    ],
                },
            });
        });
        test('private endpoint access considers specific subnet selection', () => {
            const { stack } = (0, util_1.testFixture)();
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: { SubnetIds: ['subnet1'] },
            });
        });
        test('can configure private endpoint access', () => {
            // GIVEN
            const { stack } = (0, util_1.testFixture)();
            new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION, endpointAccess: eks.EndpointAccess.PRIVATE, prune: false });
            const app = stack.node.root;
            const template = app.synth().getStackArtifact(stack.stackName).template;
            expect(template.Resources.Cluster192CD0375.Properties.ResourcesVpcConfig.EndpointPrivateAccess).toEqual(true);
            expect(template.Resources.Cluster192CD0375.Properties.ResourcesVpcConfig.EndpointPublicAccess).toEqual(false);
        });
        test('kubectl provider chooses only private subnets', () => {
            const { stack } = (0, util_1.testFixture)();
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'],
                        },
                    ],
                    SubnetIds: [
                        {
                            Ref: 'VpcPrivate1Subnet1SubnetC688B2B1',
                        },
                        {
                            Ref: 'VpcPrivate1Subnet2SubnetA2AF15C7',
                        },
                    ],
                },
            });
        });
        test('kubectl provider considers vpc subnet selection', () => {
            const { stack } = (0, util_1.testFixture)();
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
                kubectlProviderOptions: {
                    kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'],
                        },
                    ],
                    SubnetIds: [
                        {
                            Ref: 'VpcPrivate1Subnet1SubnetC688B2B1',
                        },
                        {
                            Ref: 'VpcPrivate1Subnet2SubnetA2AF15C7',
                        },
                        {
                            Ref: 'VpcPrivate2Subnet1SubnetE13E2E30',
                        },
                        {
                            Ref: 'VpcPrivate2Subnet2Subnet158A38AB',
                        },
                    ],
                },
            });
        });
        test('throw when private access is configured without dns support enabled for the VPC', () => {
            const { stack } = (0, util_1.testFixture)();
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
            const { stack } = (0, util_1.testFixture)();
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
        const { stack } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
        });
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
                    'Cluster1KubectlProviderframeworkonEventBB398CAE',
                    'Arn',
                ],
            },
            ClusterName: {
                Ref: 'Cluster192CD0375',
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
        const { stack } = (0, util_1.testFixture)();
        // WHEN
        const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: layer,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Layers: [
                { Ref: 'Cluster1KubectlProviderAwsCliLayer5CF50321' },
                'arn:of:layer',
            ],
        });
    });
    test('custom awscli layer can be provided', () => {
        // GIVEN
        const { stack } = (0, util_1.testFixture)();
        // WHEN
        const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
        new eks.Cluster(stack, 'Cluster1', {
            version: CLUSTER_VERSION,
            prune: false,
            kubectlProviderOptions: {
                awscliLayer: layer,
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Layers: [
                'arn:of:layer',
                { Ref: 'kubectlLayer44321E08' },
            ],
        });
    });
    test('create a cluster using custom resource with secrets encryption using KMS CMK', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
            prune: false,
            secretsEncryptionKey: new kms.Key(stack, 'Key'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            EncryptionConfig: [{
                    Provider: {
                        KeyArn: {
                            'Fn::GetAtt': [
                                'Key961B73FD',
                                'Arn',
                            ],
                        },
                    },
                    Resources: ['secrets'],
                }],
        });
    });
    test('create a cluster using custom kubernetes network config', () => {
        // GIVEN
        const { stack } = (0, util_1.testFixture)();
        const customCidr = '172.16.0.0/12';
        // WHEN
        new eks.Cluster(stack, 'Cluster', {
            version: CLUSTER_VERSION,
            serviceIpv4Cidr: customCidr,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            KubernetesNetworkConfig: {
                ServiceIpv4Cidr: customCidr,
            },
        });
    });
    describe('AccessConfig', () => {
        // bootstrapClusterCreatorAdminPermissions can be explicitly enabled or disabled
        test.each([
            [true, true],
            [false, false],
        ])('bootstrapClusterCreatorAdminPermissions(%s) should work', (a, b) => {
            // GIVEN
            const { stack } = (0, util_1.testFixture)();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                version: CLUSTER_VERSION,
                bootstrapClusterCreatorAdminPermissions: a,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
                AccessConfig: {
                    BootstrapClusterCreatorAdminPermissions: b,
                },
            });
        });
    });
    describe('AccessEntry', () => {
        // cluster can grantAccess();
        test('cluster can grantAccess', () => {
            // GIVEN
            const { stack, vpc } = (0, util_1.testFixture)();
            // WHEN
            const mastersRole = new iam.Role(stack, 'role', { assumedBy: new iam.AccountRootPrincipal() });
            new eks.Cluster(stack, 'Cluster', {
                vpc,
                mastersRole,
                version: CLUSTER_VERSION,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
                AccessPolicies: [
                    {
                        AccessScope: {
                            Type: 'cluster',
                        },
                        PolicyArn: {
                            'Fn::Join': [
                                '', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy',
                                ],
                            ],
                        },
                    },
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixnRkFBb0U7QUFDcEUsdURBQXlEO0FBQ3pELG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFDakQsd0NBQXdDO0FBQ3hDLCtCQUErQjtBQUMvQiwyQ0FBdUM7QUFDdkMsNkJBQTZCO0FBQzdCLGlDQUF1RDtBQUN2RCw4QkFBOEI7QUFDOUIsZ0NBQW1DO0FBQ25DLDhEQUEwRDtBQUMxRCw4REFBZ0U7QUFFaEUsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztBQUNwRCxNQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUUsZUFBZTtJQUN4QixlQUFlLEVBQUUsQ0FBQztJQUNsQixtQkFBbUIsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUztDQUN2RCxDQUFDO0FBRUYsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtRQUNuRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsb0JBQW9CLENBQUMsTUFBTTthQUN6QztZQUNELHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7YUFDekQ7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNB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QUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYXNnIGZyb20gJ2F3cy1jZGstbGliL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgKiBhcyBjZGs4cyBmcm9tICdjZGs4cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIFlBTUwgZnJvbSAneWFtbCc7XG5pbXBvcnQgeyB0ZXN0Rml4dHVyZSwgdGVzdEZpeHR1cmVOb1ZwYyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEhlbG1DaGFydCB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBLdWJlY3RsUHJvdmlkZXIgfSBmcm9tICcuLi9saWIva3ViZWN0bC1wcm92aWRlcic7XG5pbXBvcnQgeyBCb3R0bGVSb2NrZXRJbWFnZSB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2JvdHRsZXJvY2tldCc7XG5cbmNvbnN0IENMVVNURVJfVkVSU0lPTiA9IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMztcbmNvbnN0IGNvbW1vblByb3BzID0ge1xuICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxufTtcblxuZGVzY3JpYmUoJ2NsdXN0ZXInLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBjb25maWd1cmUgYW5kIGFjY2VzcyBBTEIgY29udHJvbGxlcicsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBhbGJDb250cm9sbGVyOiB7XG4gICAgICAgIHZlcnNpb246IGVrcy5BbGJDb250cm9sbGVyVmVyc2lvbi5WMl80XzEsXG4gICAgICB9LFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUhlbG1DaGFydCcsIHtcbiAgICAgIENoYXJ0OiAnYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlcicsXG4gICAgfSk7XG4gICAgZXhwZWN0KGNsdXN0ZXIuYWxiQ29udHJvbGxlcikudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ltcG9ydGVkIFZwYyBmcm9tIHVucGFyc2VhYmxlIGxpc3QgdG9rZW5zJywgKCkgPT4ge1xuICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICAgIGxldCB2cGM6IGVjMi5JVnBjO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwY0lkID0gY2RrLkZuLmltcG9ydFZhbHVlKCdteVZwY0lkJyk7XG4gICAgICBjb25zdCBhdmFpbGFiaWxpdHlab25lcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlBdmFpbGFiaWxpdHlab25lcycpKTtcbiAgICAgIGNvbnN0IHB1YmxpY1N1Ym5ldElkcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlQdWJsaWNTdWJuZXRJZHMnKSk7XG4gICAgICBjb25zdCBwcml2YXRlU3VibmV0SWRzID0gY2RrLkZuLnNwbGl0KCcsJywgY2RrLkZuLmltcG9ydFZhbHVlKCdteVByaXZhdGVTdWJuZXRJZHMnKSk7XG4gICAgICBjb25zdCBpc29sYXRlZFN1Ym5ldElkcyA9IGNkay5Gbi5zcGxpdCgnLCcsIGNkay5Gbi5pbXBvcnRWYWx1ZSgnbXlJc29sYXRlZFN1Ym5ldElkcycpKTtcblxuICAgICAgdnBjID0gZWMyLlZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkVnBjJywge1xuICAgICAgICB2cGNJZCxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXMsXG4gICAgICAgIHB1YmxpY1N1Ym5ldElkcyxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldElkcyxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXRJZHMsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBzZWxlY3RpbmcgbW9yZSB0aGFuIG9uZSBzdWJuZXQgZ3JvdXAnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjOiB2cGMsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LCB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfV0sXG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgfSkpLnRvVGhyb3coL2Nhbm5vdCBzZWxlY3QgbXVsdGlwbGUgc3VibmV0IGdyb3Vwcy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3ludGhlc2lzIHdvcmtzIGlmIG9ubHkgb25lIHN1Ym5ldCBncm91cCBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYzogdnBjLFxuICAgICAgICB2cGNTdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfV0sXG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgUmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgU3VibmV0SWRzOiB7XG4gICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgIHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdteVB1YmxpY1N1Ym5ldElkcycgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhY2Nlc3NpbmcgY2x1c3RlciBzZWN1cml0eSBncm91cCBmb3IgaW1wb3J0ZWQgY2x1c3RlciB3aXRob3V0IGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgaWQnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmNsdXN0ZXJTZWN1cml0eUdyb3VwKS50b1Rocm93KC9cImNsdXN0ZXJTZWN1cml0eUdyb3VwXCIgaXMgbm90IGRlZmluZWQgZm9yIHRoaXMgaW1wb3J0ZWQgY2x1c3Rlci8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWNjZXNzIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgZm9yIGltcG9ydGVkIGNsdXN0ZXIgd2l0aCBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBjbHVzdGVyU2dJZCA9ICdjbHVzdGVyLXNnLWlkJztcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyJyxcbiAgICAgIGNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IGNsdXN0ZXJTZ0lkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlclNnID0gY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cDtcblxuICAgIGV4cGVjdChjbHVzdGVyU2cuc2VjdXJpdHlHcm91cElkKS50b0VxdWFsKGNsdXN0ZXJTZ0lkKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2x1c3RlciBzZWN1cml0eSBncm91cCBpcyBhdHRhY2hlZCB3aGVuIGFkZGluZyBzZWxmLW1hbmFnZWQgbm9kZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnc2VsZi1tYW5hZ2VkJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJzZWxmbWFuYWdlZEluc3RhbmNlU2VjdXJpdHlHcm91cDY0NDY4QzNBJywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzZWN1cml0eSBncm91cCBvZiBzZWxmLW1hbmFnZWQgYXNnIGlzIG5vdCB0YWdnZWQgd2l0aCBvd25lZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdzZWxmLW1hbmFnZWQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICB9KTtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIFRhZ3M6IFt7IEtleTogJ05hbWUnLCBWYWx1ZTogJ1N0YWNrL0NsdXN0ZXIvc2VsZi1tYW5hZ2VkJyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ubmVjdCBhdXRvc2NhbGluZyBncm91cCB3aXRoIGltcG9ydGVkIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltcG9ydGVkQ2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQ2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgY2x1c3RlclNlY3VyaXR5R3JvdXBJZDogY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cElkLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VsZk1hbmFnZWQgPSBuZXcgYXNnLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdzZWxmLW1hbmFnZWQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIHZwYzogdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBpbXBvcnRlZENsdXN0ZXIuY29ubmVjdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShzZWxmTWFuYWdlZCwge30pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydzZWxmbWFuYWdlZEluc3RhbmNlU2VjdXJpdHlHcm91cEVBNkQ4MEM5JywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGlzIGF0dGFjaGVkIHdoZW4gY29ubmVjdGluZyBzZWxmLW1hbmFnZWQgbm9kZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlbGZNYW5hZ2VkID0gbmV3IGFzZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnc2VsZi1tYW5hZ2VkJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgICB2cGM6IHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5jb25uZWN0QXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KHNlbGZNYW5hZ2VkLCB7fSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ3NlbGZtYW5hZ2VkSW5zdGFuY2VTZWN1cml0eUdyb3VwRUE2RDgwQzknLCAnR3JvdXBJZCddIH0sXG4gICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdDbHVzdGVyU2VjdXJpdHlHcm91cElkJ10gfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGEgbm9uIGNkazhzIGNoYXJ0IGNvbnN0cnVjdCBpcyBhZGRlZCBhcyBjZGs4cyBjaGFydCcsICgpID0+IHtcbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIGNyZWF0ZSBhIHBsYWluIGNvbnN0cnVjdCwgbm90IGEgY2RrOHMgY2hhcnRcbiAgICBjb25zdCBzb21lQ29uc3RydWN0ID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ1NvbWVDb25zdHJ1Y3QnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZENkazhzQ2hhcnQoJ2NoYXJ0Jywgc29tZUNvbnN0cnVjdCkpLnRvVGhyb3coL0ludmFsaWQgY2RrOHMgY2hhcnQuIE11c3QgY29udGFpbiBhIFxcJ3RvSnNvblxcJyBtZXRob2QsIGJ1dCBmb3VuZCB1bmRlZmluZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2RrOHMgY2hhcnQgY2FuIGJlIGFkZGVkIHRvIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGs4cy5BcHAoKTtcbiAgICBjb25zdCBjaGFydCA9IG5ldyBjZGs4cy5DaGFydChhcHAsICdDaGFydCcpO1xuXG4gICAgbmV3IGNkazhzLkFwaU9iamVjdChjaGFydCwgJ0Zha2VQb2QnLCB7XG4gICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAga2luZDogJ1BvZCcsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnZmFrZS1wb2QnLFxuICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAvLyBhZGRpbmcgYXdzLWNkayB0b2tlbiB0byBjZGs4cyBjaGFydFxuICAgICAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkQ2RrOHNDaGFydCgnY2RrOHMtY2hhcnQnLCBjaGFydCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNSZXNvdXJjZScsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJQb2RcIixcIm1ldGFkYXRhXCI6e1wibGFiZWxzXCI6e1wiY2x1c3Rlck5hbWVcIjpcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1wifSxcIm5hbWVcIjpcImZha2UtcG9kXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjbHVzdGVyIGNvbm5lY3Rpb25zIGluY2x1ZGUgYm90aCBjb250cm9sIHBsYW5lIGFuZCBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGNsdXN0ZXIuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHN0YWNrLnJlc29sdmUoc2cuc2VjdXJpdHlHcm91cElkKSkpLnRvRXF1YWwoW1xuICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnXSB9LFxuICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckNvbnRyb2xQbGFuZVNlY3VyaXR5R3JvdXBEMjc0MjQyQycsICdHcm91cElkJ10gfSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRlY2xhcmUgYSBzZWN1cml0eSBncm91cCBmcm9tIGEgZGlmZmVyZW50IHN0YWNrJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiB7IHNnOiBlYzIuSVNlY3VyaXR5R3JvdXA7IHZwYzogZWMyLklWcGMgfSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICB0aGlzLmVrc0NsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXA6IHByb3BzLnNnLFxuICAgICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBOZXR3b3JrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycpO1xuICAgICAgICB0aGlzLnNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlY3VyaXR5R3JvdXAnLCB7IHZwYzogdGhpcy52cGMgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgbmV0d29ya1N0YWNrID0gbmV3IE5ldHdvcmtTdGFjayhhcHAsICdOZXR3b3JrU3RhY2snKTtcbiAgICBuZXcgQ2x1c3RlclN0YWNrKGFwcCwgJ0NsdXN0ZXJTdGFjaycsIHsgc2c6IG5ldHdvcmtTdGFjay5zZWN1cml0eUdyb3VwLCB2cGM6IG5ldHdvcmtTdGFjay52cGMgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgY2FuIHN5bnRoIChubyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGUgc3RhY2tzKVxuICAgIGFwcC5zeW50aCgpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIG1hbmlmZXN0IHdpdGggYSB0b2tlbiBmcm9tIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXIgdGhhdCBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBNYW5pZmVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcyAmIHsgY2x1c3RlcjogZWtzLkNsdXN0ZXIgfSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICAvLyB0aGlzIHJvbGUgY3JlYXRlcyBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGlzIHN0YWNrIGFuZCB0aGUgY2x1c3RlciBzdGFja1xuICAgICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdDcm9zc1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nxcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgcm9sZU5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3RlckFybixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoaXMgbWFuaWZlc3QgZG9lc24ndCBjcmVhdGUgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIGNsdXN0ZXIgc3RhY2tcbiAgICAgICAgLy8gYW5kIHRoaXMgc3RhY2tcbiAgICAgICAgbmV3IGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgJ2Nyb3NzLXN0YWNrJywge1xuICAgICAgICAgIG1hbmlmZXN0OiBbe1xuICAgICAgICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZm9vOiByb2xlLnJvbGVBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXJTdGFjayA9IG5ldyBDbHVzdGVyU3RhY2soYXBwLCAnQ2x1c3RlclN0YWNrJyk7XG4gICAgbmV3IE1hbmlmZXN0U3RhY2soYXBwLCAnTWFuaWZlc3RTdGFjaycsIHsgY2x1c3RlcjogY2x1c3RlclN0YWNrLmVrc0NsdXN0ZXIgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgY2FuIHN5bnRoIChubyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGUgc3RhY2tzKVxuICAgIGFwcC5zeW50aCgpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIGNoYXJ0IHdpdGggYSB0b2tlbiBmcm9tIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdGhlIGNsdXN0ZXIgdGhhdCBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQ2hhcnRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgJiB7IGNsdXN0ZXI6IGVrcy5DbHVzdGVyIH0pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgLy8gdGhpcyByb2xlIGNyZWF0ZXMgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhpcyBzdGFjayBhbmQgdGhlIGNsdXN0ZXIgc3RhY2tcbiAgICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ3Jvc3NSb2xlJywge1xuICAgICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzcXMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgIHJvbGVOYW1lOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJBcm4sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGlzIGNoYXJ0IGRvZXNuJ3QgY3JlYXRlIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHRoZSBjbHVzdGVyIHN0YWNrXG4gICAgICAgIC8vIGFuZCB0aGlzIHN0YWNrXG4gICAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHRoaXMsICdjcm9zcy1zdGFjaycsIHtcbiAgICAgICAgICBjaGFydDogcm9sZS5yb2xlQXJuLFxuICAgICAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHsgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXJTdGFjayA9IG5ldyBDbHVzdGVyU3RhY2soYXBwLCAnQ2x1c3RlclN0YWNrJyk7XG4gICAgbmV3IENoYXJ0U3RhY2soYXBwLCAnQ2hhcnRTdGFjaycsIHsgY2x1c3RlcjogY2x1c3RlclN0YWNrLmVrc0NsdXN0ZXIgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgY2FuIHN5bnRoIChubyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGUgc3RhY2tzKVxuICAgIGFwcC5zeW50aCgpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGVjbGFyZSBhIEhlbG1DaGFydCBpbiBhIGRpZmZlcmVudCBzdGFjayB0aGFuIHRoZSBjbHVzdGVyJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQ2hhcnRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgJiB7IGNsdXN0ZXI6IGVrcy5DbHVzdGVyIH0pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY2RrLkNmblJlc291cmNlKHRoaXMsICdyZXNvdXJjZScsIHsgdHlwZTogJ015VHlwZScgfSk7XG4gICAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHRoaXMsIGBjaGFydC0ke2lkfWAsIHsgY2x1c3RlcjogcHJvcHMuY2x1c3RlciwgY2hhcnQ6IHJlc291cmNlLnJlZiB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyU3RhY2sgPSBuZXcgQ2x1c3RlclN0YWNrKGFwcCwgJ0NsdXN0ZXJTdGFjaycpO1xuICAgIG5ldyBDaGFydFN0YWNrKGFwcCwgJ0NoYXJ0U3RhY2snLCB7IGNsdXN0ZXI6IGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIGNhbiBzeW50aCAobm8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhlIHN0YWNrcylcbiAgICBhcHAuc3ludGgoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRlY2xhcmUgYSBTZXJ2aWNlQWNjb3VudCBpbiBhIGRpZmZlcmVudCBzdGFjayB0aGFuIHRoZSBjbHVzdGVyJywgKCkgPT4ge1xuICAgIGNsYXNzIENsdXN0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgZWtzQ2x1c3RlcjogZWtzLkNsdXN0ZXI7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuZWtzQ2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnRUtTQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQXBwU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzICYgeyBjbHVzdGVyOiBla3MuQ2x1c3RlciB9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIG5ldyBla3MuU2VydmljZUFjY291bnQodGhpcywgJ3Rlc3RBY2NvdW50JywgeyBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyLCBuYW1lOiAndGVzdC1hY2NvdW50JywgbmFtZXNwYWNlOiAndGVzdCcgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlclN0YWNrID0gbmV3IENsdXN0ZXJTdGFjayhhcHAsICdFS1NDbHVzdGVyJyk7XG4gICAgbmV3IEFwcFN0YWNrKGFwcCwgJ0t1YmVBcHAnLCB7IGNsdXN0ZXI6IGNsdXN0ZXJTdGFjay5la3NDbHVzdGVyIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIGNhbiBzeW50aCAobm8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhlIHN0YWNrcylcbiAgICBhcHAuc3ludGgoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYSBkZWZhdWx0IGNsdXN0ZXIgc3BhbnMgYWxsIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCAuLi5jb21tb25Qcm9wcywgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJSb2xlRkEyNjE5NzknLCAnQXJuJ10gfSxcbiAgICAgIFZlcnNpb246IENMVVNURVJfVkVSU0lPTi52ZXJzaW9uLFxuICAgICAgUmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFt7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyQ29udHJvbFBsYW5lU2VjdXJpdHlHcm91cEQyNzQyNDJDJywgJ0dyb3VwSWQnXSB9XSxcbiAgICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgICAgeyBSZWY6ICdWUENQdWJsaWNTdWJuZXQxU3VibmV0QjQyNDZEMzAnIH0sXG4gICAgICAgICAgeyBSZWY6ICdWUENQdWJsaWNTdWJuZXQyU3VibmV0NzQxNzlGMzknIH0sXG4gICAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgICAgICAgIHsgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDRkNEQUE3QScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIFwidnBjXCIgaXMgbm90IHNwZWNpZmllZCwgdnBjIHdpdGggZGVmYXVsdCBjb25maWd1cmF0aW9uIHdpbGwgYmUgY3JlYXRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQycsIE1hdGNoLmFueVZhbHVlKCkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm8gZGVmYXVsdCBjYXBhY2l0eSBhcyBhdXRvIG1vZGUgaXMgaW1wbGljaXRseSBlbmFibGVkJywgKCkgPT4ge1xuICAgIHRlc3QoJ25vIGRlZmF1bHQgY2FwYWNpdHkgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsdXN0ZXIuZGVmYXVsdE5vZGVncm91cCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCAwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3F1YW50aXR5IGFuZCB0eXBlIGNhbiBiZSBjdXN0b21pemVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLk5PREVHUk9VUCxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAxMCxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMi54bGFyZ2UnKSxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsdXN0ZXIuZGVmYXVsdE5vZGVncm91cCkudG9CZURlZmluZWQoKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgICAgRGVzaXJlZFNpemU6IDEwLFxuICAgICAgICAgIE1heFNpemU6IDEwLFxuICAgICAgICAgIE1pblNpemU6IDEwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICAvLyBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywgeyBJbnN0YW5jZVR5cGU6ICdtMi54bGFyZ2UnIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHRDYXBhY2l0eT0wIHdpbGwgbm90IGFsbG9jYXRlIGF0IGFsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjbHVzdGVyLmRlZmF1bHRDYXBhY2l0eSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywgMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0aW5nIGEgY2x1c3RlciB0YWdzIHRoZSBwcml2YXRlIFZQQyBzdWJuZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgeyBLZXk6ICdhd3MtY2RrOnN1Ym5ldC1uYW1lJywgVmFsdWU6ICdQcml2YXRlJyB9LFxuICAgICAgICB7IEtleTogJ2F3cy1jZGs6c3VibmV0LXR5cGUnLCBWYWx1ZTogJ1ByaXZhdGUnIH0sXG4gICAgICAgIHsgS2V5OiAna3ViZXJuZXRlcy5pby9yb2xlL2ludGVybmFsLWVsYicsIFZhbHVlOiAnMScgfSxcbiAgICAgICAgeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdTdGFjay9WUEMvUHJpdmF0ZVN1Ym5ldDEnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGluZyBhIGNsdXN0ZXIgdGFncyB0aGUgcHVibGljIFZQQyBzdWJuZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIE1hcFB1YmxpY0lwT25MYXVuY2g6IHRydWUsXG4gICAgICBUYWdzOiBbXG4gICAgICAgIHsgS2V5OiAnYXdzLWNkazpzdWJuZXQtbmFtZScsIFZhbHVlOiAnUHVibGljJyB9LFxuICAgICAgICB7IEtleTogJ2F3cy1jZGs6c3VibmV0LXR5cGUnLCBWYWx1ZTogJ1B1YmxpYycgfSxcbiAgICAgICAgeyBLZXk6ICdrdWJlcm5ldGVzLmlvL3JvbGUvZWxiJywgVmFsdWU6ICcxJyB9LFxuICAgICAgICB7IEtleTogJ05hbWUnLCBWYWx1ZTogJ1N0YWNrL1ZQQy9QdWJsaWNTdWJuZXQxJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIGNhcGFjaXR5IGNyZWF0ZXMgYW4gQVNHIHdpdGhvdXQgYSByb2xsaW5nIHVwZGF0ZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnRGVmYXVsdCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIFVwZGF0ZVBvbGljeTogeyBBdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbjogeyBJZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllczogdHJ1ZSB9IH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBjYXBhY2l0eSBjcmVhdGVzIGFuIEFTRyB3aXRoIHRhZ3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnRGVmYXVsdCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiB7ICdGbjo6Sm9pbic6IFsnJywgWydrdWJlcm5ldGVzLmlvL2NsdXN0ZXIvJywgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH1dXSB9LFxuICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgIFZhbHVlOiAnb3duZWQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdTdGFjay9DbHVzdGVyL0RlZmF1bHQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIGV4aXN0aW5nIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDEwLFxuICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMi54bGFyZ2UnKSxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4aXN0aW5nUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ0V4aXN0aW5nUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbm9kZVJvbGU6IGV4aXN0aW5nUm9sZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoY2x1c3Rlci5kZWZhdWx0Tm9kZWdyb3VwKS50b0JlRGVmaW5lZCgpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMTAsXG4gICAgICAgIE1heFNpemU6IDEwLFxuICAgICAgICBNaW5TaXplOiAxMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBib3R0bGVyb2NrZXQgY2FwYWNpdHkgY3JlYXRlcyBhbiBBU0cgd2l0aCB0YWdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ0JvdHRsZXJvY2tldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgICAgbWFjaGluZUltYWdlVHlwZTogZWtzLk1hY2hpbmVJbWFnZVR5cGUuQk9UVExFUk9DS0VULFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiB7ICdGbjo6Sm9pbic6IFsnJywgWydrdWJlcm5ldGVzLmlvL2NsdXN0ZXIvJywgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH1dXSB9LFxuICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgIFZhbHVlOiAnb3duZWQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdTdGFjay9DbHVzdGVyL0JvdHRsZXJvY2tldCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRpbmcgYm90dGxlcm9ja2V0IGNhcGFjaXR5IHdpdGggYm9vdHN0cmFwT3B0aW9ucyB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnQm90dGxlcm9ja2V0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgICBtYWNoaW5lSW1hZ2VUeXBlOiBla3MuTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQsXG4gICAgICBib290c3RyYXBPcHRpb25zOiB7fSxcbiAgICB9KSkudG9UaHJvdygvYm9vdHN0cmFwT3B0aW9ucyBpcyBub3Qgc3VwcG9ydGVkIGZvciBCb3R0bGVyb2NrZXQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IGNsdXN0ZXIgd2l0aCBleGlzdGluZyBrdWJlY3RsIHByb3ZpZGVyIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBoYW5kbGVyUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSGFuZGxlclJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2xhbWJkYS1yb2xlJyk7XG5cbiAgICBjb25zdCBrdWJlY3RsUHJvdmlkZXIgPSBLdWJlY3RsUHJvdmlkZXIuZnJvbUt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXMoc3RhY2ssICdLdWJlY3RsUHJvdmlkZXInLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uOjEnLFxuICAgICAgcm9sZTogaGFuZGxlclJvbGUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiAnY2x1c3RlcicsXG4gICAgICBrdWJlY3RsUHJvdmlkZXI6IGt1YmVjdGxQcm92aWRlcixcbiAgICB9KTtcblxuICAgIGV4cGVjdChjbHVzdGVyLmt1YmVjdGxQcm92aWRlcikudG9FcXVhbChrdWJlY3RsUHJvdmlkZXIpO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW1wb3J0IGNsdXN0ZXIgd2l0aCBleGlzdGluZyBrdWJlY3RsIHByb3ZpZGVyIGZ1bmN0aW9uIHNob3VsZCB3b3JrIGFzIGV4cGVjdGVkIHdpdGggcmVzb3VyY2VzIHJlbHlpbmcgb24ga3ViZWN0bCBnZXRPckNyZWF0ZScsICgpID0+IHtcbiAgICB0ZXN0KCdjcmVhdGVzIGhlbG0gY2hhcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBjb25zdCBoYW5kbGVyUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSGFuZGxlclJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2xhbWJkYS1yb2xlJyk7XG4gICAgICBjb25zdCBrdWJlY3RsUHJvdmlkZXIgPSBLdWJlY3RsUHJvdmlkZXIuZnJvbUt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXMoc3RhY2ssICdLdWJlY3RsUHJvdmlkZXInLCB7XG4gICAgICAgIHNlcnZpY2VUb2tlbjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb246MScsXG4gICAgICAgIHJvbGU6IGhhbmRsZXJSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXInLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXI6IGt1YmVjdGxQcm92aWRlcixcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkhlbG1DaGFydChzdGFjaywgJ0NoYXJ0Jywge1xuICAgICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgICBjaGFydDogJ2NoYXJ0JyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUhlbG1DaGFydCcsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiBrdWJlY3RsUHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcmVhdGVzIEt1YmVybmV0ZXMgcGF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBjb25zdCBoYW5kbGVyUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSGFuZGxlclJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2xhbWJkYS1yb2xlJyk7XG4gICAgICBjb25zdCBrdWJlY3RsUHJvdmlkZXIgPSBLdWJlY3RsUHJvdmlkZXIuZnJvbUt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXMoc3RhY2ssICdLdWJlY3RsUHJvdmlkZXInLCB7XG4gICAgICAgIHNlcnZpY2VUb2tlbjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb246MScsXG4gICAgICAgIHJvbGU6IGhhbmRsZXJSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXInLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXI6IGt1YmVjdGxQcm92aWRlcixcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkhlbG1DaGFydChzdGFjaywgJ0NoYXJ0Jywge1xuICAgICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgICBjaGFydDogJ2NoYXJ0JyxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkt1YmVybmV0ZXNQYXRjaChzdGFjaywgJ1BhdGNoJywge1xuICAgICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgICBhcHBseVBhdGNoOiB7fSxcbiAgICAgICAgcmVzdG9yZVBhdGNoOiB7fSxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiAnUGF0Y2hSZXNvdXJjZScsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzUGF0Y2gnLCB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjoga3ViZWN0bFByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBLdWJlcm5ldGVzIG9iamVjdCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcbiAgICAgIGNvbnN0IGt1YmVjdGxQcm92aWRlciA9IEt1YmVjdGxQcm92aWRlci5mcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzdGFjaywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgICAgc2VydmljZVRva2VuOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbjoxJyxcbiAgICAgICAgcm9sZTogaGFuZGxlclJvbGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiAnY2x1c3RlcicsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlcjoga3ViZWN0bFByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHN0YWNrLCAnQ2hhcnQnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGNoYXJ0OiAnY2hhcnQnLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuS3ViZXJuZXRlc1BhdGNoKHN0YWNrLCAnUGF0Y2gnLCB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgIGFwcGx5UGF0Y2g6IHt9LFxuICAgICAgICByZXN0b3JlUGF0Y2g6IHt9LFxuICAgICAgICByZXNvdXJjZU5hbWU6ICdQYXRjaFJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWtzLkt1YmVybmV0ZXNNYW5pZmVzdChzdGFjaywgJ01hbmlmZXN0Jywge1xuICAgICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgICBtYW5pZmVzdDogW10sXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVrcy5LdWJlcm5ldGVzT2JqZWN0VmFsdWUoc3RhY2ssICdPYmplY3RWYWx1ZScsIHtcbiAgICAgICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICAgICAganNvblBhdGg6ICcnLFxuICAgICAgICBvYmplY3ROYW1lOiAnbmFtZScsXG4gICAgICAgIG9iamVjdFR5cGU6ICd0eXBlJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNPYmplY3RWYWx1ZScsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiBrdWJlY3RsUHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjbHVzdGVyLmt1YmVjdGxQcm92aWRlcikubm90LnRvQmVJbnN0YW5jZU9mKGVrcy5LdWJlY3RsUHJvdmlkZXIpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdleGVyY2lzZSBleHBvcnQvaW1wb3J0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjazogc3RhY2sxLCB2cGMsIGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrMSwgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZCA9IGVrcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjazIsICdJbXBvcnRlZCcsIHtcbiAgICAgIHZwYzogY2x1c3Rlci52cGMsXG4gICAgICBjbHVzdGVyRW5kcG9pbnQ6IGNsdXN0ZXIuY2x1c3RlckVuZHBvaW50LFxuICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICBzZWN1cml0eUdyb3VwSWRzOiBjbHVzdGVyLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLm1hcCh4ID0+IHguc2VjdXJpdHlHcm91cElkKSxcbiAgICAgIGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE6IGNsdXN0ZXIuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSxcbiAgICAgIGNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IGNsdXN0ZXIuY2x1c3RlclNlY3VyaXR5R3JvdXBJZCxcbiAgICAgIGNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBjbHVzdGVyLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuLFxuICAgIH0pO1xuXG4gICAgLy8gdGhpcyBzaG91bGQgY2F1c2UgYW4gZXhwb3J0L2ltcG9ydFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrMiwgJ0NsdXN0ZXJBUk4nLCB7IHZhbHVlOiBpbXBvcnRlZC5jbHVzdGVyQXJuIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIENsdXN0ZXJBUk46IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmVrczp1cy1lYXN0LTE6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmNsdXN0ZXIvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrOkV4cG9ydHNPdXRwdXRSZWZDbHVzdGVyRUIwMzg2QTc5NkEwRTNGRScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZE1hbmlmZXN0IGNhbiBiZSB1c2VkIHRvIGFwcGx5IGs4cyBtYW5pZmVzdHMgb24gdGhpcyBjbHVzdGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdtYW5pZmVzdDEnLCB7IGZvbzogMTIzIH0pO1xuICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ21hbmlmZXN0MicsIHsgYmFyOiAxMjMgfSwgeyBib29yOiBbMSwgMiwgM10gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDogJ1t7XCJmb29cIjoxMjN9XScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiAnW3tcImJhclwiOjEyM30se1wiYm9vclwiOlsxLDIsM119XScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2t1YmVjdGwgcmVzb3VyY2VzIGNhbiBiZSBjcmVhdGVkIGluIGEgc2VwYXJhdGUgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTsgLy8gY2x1c3RlciBpcyB1bmRlciBzdGFjazJcblxuICAgIC8vIFdIRU4gcmVzb3VyY2UgaXMgdW5kZXIgc3RhY2syXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjazInLCB7IGVudjogeyBhY2NvdW50OiBzdGFjay5hY2NvdW50LCByZWdpb246IHN0YWNrLnJlZ2lvbiB9IH0pO1xuICAgIG5ldyBla3MuS3ViZXJuZXRlc01hbmlmZXN0KHN0YWNrMiwgJ215cmVzb3VyY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWFuaWZlc3Q6IFt7IGZvbzogJ2JhcicgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgYXBwLnN5bnRoKCk7IC8vIG5vIGN5Y2xpYyBkZXBlbmRlbmN5IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy83MjMxKVxuXG4gICAgLy8gZXhwZWN0IGEgc2luZ2xlIHJlc291cmNlIGluIHRoZSAybmQgc3RhY2tcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIG15cmVzb3VyY2U0OUM2RDMyNToge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1Jlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRjbHVzdGVyS3ViZWN0bFByb3ZpZGVyZnJhbWV3b3Jrb25FdmVudDdFODQ3MEYxQXJuNjA4NkFBQTQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1hbmlmZXN0OiAnW3tcXFwiZm9vXFxcIjpcXFwiYmFyXFxcIn1dJyxcbiAgICAgICAgICAgIENsdXN0ZXJOYW1lOiB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2s6RXhwb3J0c091dHB1dFJlZmNsdXN0ZXI2MTFGOEFGRkEwN0ZDMDc5JyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ291dHB1dHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnbm8gb3V0cHV0cyBhcmUgc3ludGhlc2l6ZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodGVtcGxhdGUuT3V0cHV0cykudG9CZVVuZGVmaW5lZCgpOyAvLyBubyBvdXRwdXRzXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYm9vc3RyYXAgdXNlci1kYXRhJywgKCkgPT4ge1xuICAgICAgdGVzdCgncmVuZGVyZWQgYnkgZGVmYXVsdCBmb3IgQVNHcycsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnTXlDYXBjaXR5JywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMy54bGFyZ3MnKSB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogeyAnRm46OkpvaW4nOiBbJycsIFsnIyEvYmluL2Jhc2hcXG5zZXQgLW8geHRyYWNlXFxuL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsIHsgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyB9LCAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LCAnXFwnIC0tYjY0LWNsdXN0ZXItY2EgXFwnJywgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddIH0sICdcXCcgLS11c2UtbWF4LXBvZHMgdHJ1ZVxcbi9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBDbHVzdGVyTXlDYXBjaXR5QVNHRDRDRDhCOTcgLS1yZWdpb24gdXMtZWFzdC0xJ11dIH0gfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnbm90IHJlbmRlcmVkIGlmIGJvb3RzdHJhcCBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnTXlDYXBjaXR5Jywge1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICAgIGJvb3RzdHJhcEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogJyMhL2Jpbi9iYXNoJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjdXJzb3J5IHRlc3QgZm9yIG9wdGlvbnM6IHNlZSB0ZXN0LnVzZXItZGF0YS50cyBmb3IgZnVsbCBzdWl0ZVxuICAgICAgdGVzdCgnYm9vdHN0cmFwIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ015Q2FwY2l0eScsIHtcbiAgICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMy54bGFyZ3MnKSxcbiAgICAgICAgICBib290c3RyYXBPcHRpb25zOiB7XG4gICAgICAgICAgICBrdWJlbGV0RXh0cmFBcmdzOiAnLS1ub2RlLWxhYmVscyBGT089NDInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgICBjb25zdCB1c2VyRGF0YSA9IHRlbXBsYXRlLlJlc291cmNlcy5DbHVzdGVyTXlDYXBjaXR5TGF1bmNoQ29uZmlnNTg1ODMzNDUuUHJvcGVydGllcy5Vc2VyRGF0YTtcbiAgICAgICAgZXhwZWN0KHVzZXJEYXRhKS50b0VxdWFsKHsgJ0ZuOjpCYXNlNjQnOiB7ICdGbjo6Sm9pbic6IFsnJywgWycjIS9iaW4vYmFzaFxcbnNldCAtbyB4dHJhY2VcXG4vZXRjL2Vrcy9ib290c3RyYXAuc2ggJywgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZCAgLS1ub2RlLWxhYmVscyBGT089NDJcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LCAnXFwnIC0tYjY0LWNsdXN0ZXItY2EgXFwnJywgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddIH0sICdcXCcgLS11c2UtbWF4LXBvZHMgdHJ1ZVxcbi9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBDbHVzdGVyTXlDYXBjaXR5QVNHRDRDRDhCOTcgLS1yZWdpb24gdXMtZWFzdC0xJ11dIH0gfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3Nwb3QgaW5zdGFuY2VzJywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCdub2RlcyBsYWJlbGVkIGFuIHRhaW50ZWQgYWNjb3JkaW5nbHknLCAoKSA9PiB7XG4gICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ015Q2FwY2l0eScsIHtcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICAgICAgc3BvdFByaWNlOiAnMC4wMScsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGVtcGxhdGUuUmVzb3VyY2VzLkNsdXN0ZXJNeUNhcGNpdHlMYXVuY2hDb25maWc1ODU4MzM0NS5Qcm9wZXJ0aWVzLlVzZXJEYXRhO1xuICAgICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogeyAnRm46OkpvaW4nOiBbJycsIFsnIyEvYmluL2Jhc2hcXG5zZXQgLW8geHRyYWNlXFxuL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsIHsgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyB9LCAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9RWMyU3BvdCAtLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGVcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLCB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LCAnXFwnIC0tYjY0LWNsdXN0ZXItY2EgXFwnJywgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddIH0sICdcXCcgLS11c2UtbWF4LXBvZHMgdHJ1ZVxcbi9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBDbHVzdGVyTXlDYXBjaXR5QVNHRDRDRDhCOTcgLS1yZWdpb24gdXMtZWFzdC0xJ11dIH0gfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBib290c3RyYXAgaXMgZGlzYWJsZWQgY2Fubm90IHNwZWNpZnkgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ015Q2FwY2l0eScsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgIGJvb3RzdHJhcEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBib290c3RyYXBPcHRpb25zOiB7IGF3c0FwaVJldHJ5QXR0ZW1wdHM6IDEwIH0sXG4gICAgICB9KSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkgXCJib290c3RyYXBPcHRpb25zXCIgaWYgXCJib290c3RyYXBFbmFibGVkXCIgaXMgZmFsc2UvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0Vrc09wdGltaXplZEltYWdlKCkgd2l0aCBubyBub2RlVHlwZSBhbHdheXMgdXNlcyBTVEFOREFSRCB3aXRoIExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT04nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBMQVRFU1RfS1VCRVJORVRFU19WRVJTSU9OID0gJzEuMjQnO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkVrc09wdGltaXplZEltYWdlKCkuZ2V0SW1hZ2Uoc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVrc29wdGltaXplZGFtaScpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCcvYW1hem9uLWxpbnV4LTIvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWtzb3B0aW1pemVkYW1pJykgJiZcbiAgICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoTEFURVNUX0tVQkVSTkVURVNfVkVSU0lPTiksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnRWtzT3B0aW1pemVkSW1hZ2UoKSB3aXRoIHNwZWNpZmljIGt1YmVybmV0ZXNWZXJzaW9uIHJldHVybiBjb3JyZWN0IEFNSScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5Fa3NPcHRpbWl6ZWRJbWFnZSh7IGt1YmVybmV0ZXNWZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04udmVyc2lvbiB9KS5nZXRJbWFnZShzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJzID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZS5QYXJhbWV0ZXJzO1xuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWtzb3B0aW1pemVkYW1pJykgJiZcbiAgICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy9hbWF6b24tbGludXgtMi8nKSxcbiAgICAgICkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJlxuICAgICAgICAgICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnLzEuMzMvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGVmYXVsdCBjbHVzdGVyIGNhcGFjaXR5IHdpdGggQVJNNjQgaW5zdGFuY2UgdHlwZSBjb21lcyB3aXRoIG5vZGVncm91cCB3aXRoIGNvcnJlY3QgQW1pVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLk5PREVHUk9VUCxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAxLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubWVkaXVtJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIEFtaVR5cGU6ICdBTDJfQVJNXzY0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkTm9kZWdyb3VwIHdpdGggQVJNNjQgaW5zdGFuY2UgdHlwZSBjb21lcyB3aXRoIG5vZGVncm91cCB3aXRoIGNvcnJlY3QgQW1pVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTZnLm1lZGl1bScpLFxuICAgICAgfSkuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5tZWRpdW0nKV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIEFtaVR5cGU6ICdBTDJfQVJNXzY0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkTm9kZWdyb3VwQ2FwYWNpdHkgd2l0aCBUNGcgaW5zdGFuY2UgdHlwZSBjb21lcyB3aXRoIG5vZGVncm91cCB3aXRoIGNvcnJlY3QgQW1pVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDRnLm1lZGl1bScpLFxuICAgICAgfSkuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3Q0Zy5tZWRpdW0nKV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICAgIEFtaVR5cGU6ICdBTDJfQVJNXzY0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5IHdpdGggVDRnIGluc3RhbmNlIHR5cGUgY29tZXMgd2l0aCBub2RlZ3JvdXAgd2l0aCBjb3JyZWN0IEFtaVR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KS5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0NGcubWVkaXVtJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJlxuICAgICAgICAgICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnYW1hem9uLWxpbnV4LTItYXJtNjQvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkTm9kZWdyb3VwQ2FwYWNpdHkgd2l0aCBDN2cgaW5zdGFuY2UgdHlwZSBjb21lcyB3aXRoIG5vZGVncm91cCB3aXRoIGNvcnJlY3QgQW1pVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzdnLmxhcmdlJyksXG4gICAgICB9KS5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzdnLmxhcmdlJyldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgICBBbWlUeXBlOiAnQUwyX0FSTV82NCcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSB3aXRoIEM3ZyBpbnN0YW5jZSB0eXBlIGNvbWVzIHdpdGggbm9kZWdyb3VwIHdpdGggY29ycmVjdCBBbWlUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgfSkuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzdnLmxhcmdlJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJlxuICAgICAgICAgICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnYW1hem9uLWxpbnV4LTItYXJtNjQvJyksXG4gICAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnRUtTLU9wdGltaXplZCBBTUkgd2l0aCBHUFUgc3VwcG9ydCB3aGVuIGFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnR1BVQ2FwYWNpdHknLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2c0ZG4ueGxhcmdlJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJiAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJ2FtYXpvbi1saW51eC0yLWdwdScpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0VLUy1PcHRpbWl6ZWQgQU1JIHdpdGggQVJNNjQgd2hlbiBhZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICB9KS5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ0FSTUNhcGFjaXR5Jywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubWVkaXVtJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vla3NvcHRpbWl6ZWRhbWknKSAmJiAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy9hbWF6b24tbGludXgtMi1hcm02NC8nKSxcbiAgICAgICkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdCb3R0bGVSb2NrZXRJbWFnZSgpIHdpdGggc3BlY2lmaWMga3ViZXJuZXRlc1ZlcnNpb24gcmV0dXJuIGNvcnJlY3QgQU1JJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQm90dGxlUm9ja2V0SW1hZ2UoeyBrdWJlcm5ldGVzVmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLnZlcnNpb24gfSkuZ2V0SW1hZ2Uoc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWJvdHRsZXJvY2tldGF3cycpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCcvYm90dGxlcm9ja2V0LycpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWJvdHRsZXJvY2tldGF3cycpICYmXG4gICAgICAgICAgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCcvYXdzLWs4cy0xLjMzLycpLFxuICAgICAgKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcmVEbnNDb21wdXRlVHlwZSB3aWxsIHBhdGNoIHRoZSBjb3JlRE5TIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGEgXCJmYXJnYXRlXCIgY29tcHV0ZSB0eXBlIGFuZCByZXN0b3JlIHRvIFwiZWMyXCIgdXBvbiByZW1vdmFsJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7XG4gICAgICAgIGNvcmVEbnNDb21wdXRlVHlwZTogZWtzLkNvcmVEbnNDb21wdXRlVHlwZS5GQVJHQVRFLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1BhdGNoJywge1xuICAgICAgICBSZXNvdXJjZU5hbWU6ICdkZXBsb3ltZW50L2NvcmVkbnMnLFxuICAgICAgICBSZXNvdXJjZU5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgICAgQXBwbHlQYXRjaEpzb246ICd7XCJzcGVjXCI6e1widGVtcGxhdGVcIjp7XCJtZXRhZGF0YVwiOntcImFubm90YXRpb25zXCI6e1wiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCI6XCJmYXJnYXRlXCJ9fX19fScsXG4gICAgICAgIFJlc3RvcmVQYXRjaEpzb246ICd7XCJzcGVjXCI6e1widGVtcGxhdGVcIjp7XCJtZXRhZGF0YVwiOntcImFubm90YXRpb25zXCI6e1wiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCI6XCJlYzJcIn19fX19JyxcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgICBSZWY6ICdNeUNsdXN0ZXI0QzFCQTU3OScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lmIG9wZW5JRENvbm5lY3RQcm92aWRlciBhIG5ldyBPcGVuSURDb25uZWN0UHJvdmlkZXIgcmVzb3VyY2UgaXMgY3JlYXRlZCBhbmQgZXhwb3NlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IGNsdXN0ZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QocHJvdmlkZXIpLnRvRXF1YWwoY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdDdXN0b21BV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckYyQzU0M0UwJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIENsaWVudElETGlzdDogW1xuICAgICAgICAgICdzdHMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgIF0sXG4gICAgICAgIFVybDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICAgICAgICAnT3BlbklkQ29ubmVjdElzc3VlclVybCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ2luZjEgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnSW5mZXJlbmNlSW5zdGFuY2VzJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdpbmYxLjJ4bGFyZ2UnKSxcbiAgICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGliJywgJ2FkZG9ucycsICduZXVyb24tZGV2aWNlLXBsdWdpbi55YW1sJyksICd1dGY4Jyk7XG4gICAgICBjb25zdCBzYW5pdGl6ZWQgPSBZQU1MLnBhcnNlKGZpbGVDb250ZW50cyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW3Nhbml0aXplZF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnaW5mMiBpbnN0YW5jZXMgYXJlIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdJbmZlcmVuY2VJbnN0YW5jZXMnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2luZjIueGxhcmdlJyksXG4gICAgICAgIG1pbkNhcGFjaXR5OiAxLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZGRvbnMnLCAnbmV1cm9uLWRldmljZS1wbHVnaW4ueWFtbCcpLCAndXRmOCcpO1xuICAgICAgY29uc3Qgc2FuaXRpemVkID0gWUFNTC5wYXJzZShmaWxlQ29udGVudHMpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFtzYW5pdGl6ZWRdKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ3RybjEgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnVHJhaW5pdW1JbnN0YW5jZXMnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3RybjEuMnhsYXJnZScpLFxuICAgICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdsaWInLCAnYWRkb25zJywgJ25ldXJvbi1kZXZpY2UtcGx1Z2luLnlhbWwnKSwgJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IHNhbml0aXplZCA9IFlBTUwucGFyc2UoZmlsZUNvbnRlbnRzKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICAgIE1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShbc2FuaXRpemVkXSksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0ZXN0KCd0cm4xbiBpbnN0YW5jZXMgYXJlIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdUcmFpbml1bUluc3RhbmNlcycsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndHJuMW4uMnhsYXJnZScpLFxuICAgICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdsaWInLCAnYWRkb25zJywgJ25ldXJvbi1kZXZpY2UtcGx1Z2luLnlhbWwnKSwgJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IHNhbml0aXplZCA9IFlBTUwucGFyc2UoZmlsZUNvbnRlbnRzKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICAgIE1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShbc2FuaXRpemVkXSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2luZjEgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgaW4gYWRkTm9kZWdyb3VwQ2FwYWNpdHknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdJbmZlcmVuY2VJbnN0YW5jZXMnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnaW5mMS4yeGxhcmdlJyldLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZGRvbnMnLCAnbmV1cm9uLWRldmljZS1wbHVnaW4ueWFtbCcpLCAndXRmOCcpO1xuICAgICAgY29uc3Qgc2FuaXRpemVkID0gWUFNTC5wYXJzZShmaWxlQ29udGVudHMpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFtzYW5pdGl6ZWRdKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ2luZjIgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgaW4gYWRkTm9kZWdyb3VwQ2FwYWNpdHknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdJbmZlcmVuY2VJbnN0YW5jZXMnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnaW5mMi54bGFyZ2UnKV0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGliJywgJ2FkZG9ucycsICduZXVyb24tZGV2aWNlLXBsdWdpbi55YW1sJyksICd1dGY4Jyk7XG4gICAgICBjb25zdCBzYW5pdGl6ZWQgPSBZQU1MLnBhcnNlKGZpbGVDb250ZW50cyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkoW3Nhbml0aXplZF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHJlc291cmNlcyBhcmUgYWx3YXlzIGNyZWF0ZWQgYWZ0ZXIgYWxsIGZhcmdhdGUgcHJvZmlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgncHJvZmlsZTEnLCB7IHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAncHJvZmlsZTEnIH1dIH0pO1xuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgncmVzb3VyY2UxJywgeyBmb286IDEyMyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ3Byb2ZpbGUyJywgeyBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ3Byb2ZpbGUyJyB9XSB9KTtcbiAgICAgIG5ldyBla3MuSGVsbUNoYXJ0KHN0YWNrLCAnY2hhcnQnLCB7IGNsdXN0ZXIsIGNoYXJ0OiAnbXljaGFydCcgfSk7XG4gICAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdwcm9maWxlMycsIHsgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdwcm9maWxlMycgfV0gfSk7XG4gICAgICBuZXcgZWtzLkt1YmVybmV0ZXNQYXRjaChzdGFjaywgJ3BhdGNoMScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgYXBwbHlQYXRjaDogeyBmb286IDEyMyB9LFxuICAgICAgICByZXN0b3JlUGF0Y2g6IHsgYmFyOiAxMjMgfSxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiAnZm9vL2JhcicsXG4gICAgICB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ3Byb2ZpbGU0JywgeyBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ3Byb2ZpbGU0JyB9XSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpLnRlbXBsYXRlO1xuXG4gICAgICBjb25zdCBiYXJyaWVyID0gdGVtcGxhdGUuUmVzb3VyY2VzLkNsdXN0ZXJLdWJlY3RsUmVhZHlCYXJyaWVyMjAwMDUyQUY7XG5cbiAgICAgIGV4cGVjdChiYXJyaWVyLkRlcGVuZHNPbikudG9FcXVhbChbXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlMVBvZEV4ZWN1dGlvblJvbGVFODVGODdCNScsXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlMTI5QUVBM0M2JyxcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGUyUG9kRXhlY3V0aW9uUm9sZTIyNjcwQUY4JyxcbiAgICAgICAgJ0NsdXN0ZXJmYXJnYXRlcHJvZmlsZXByb2ZpbGUyMzNCOUExMTcnLFxuICAgICAgICAnQ2x1c3RlcmZhcmdhdGVwcm9maWxlcHJvZmlsZTNQb2RFeGVjdXRpb25Sb2xlNDc1QzBEOEYnLFxuICAgICAgICAnQ2x1c3RlcmZhcmdhdGVwcm9maWxlcHJvZmlsZTNEMDZGMzA3NicsXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlNFBvZEV4ZWN1dGlvblJvbGUwODYwNTdGQicsXG4gICAgICAgICdDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVwcm9maWxlNEEwRTNCQkU4JyxcbiAgICAgICAgJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qga3ViZWN0bFJlc291cmNlcyA9IFsnY2hhcnRGMjQ0N0FGQycsICdwYXRjaDFCOTY0QUM5MycsICdDbHVzdGVybWFuaWZlc3RyZXNvdXJjZTEwQjFDOTUwNSddO1xuXG4gICAgICAvLyBjaGVjayB0aGF0IGFsbCBrdWJlY3RsIHJlc291cmNlcyBkZXBlbmQgb24gdGhlIGJhcnJpZXJcbiAgICAgIGZvciAoY29uc3QgciBvZiBrdWJlY3RsUmVzb3VyY2VzKSB7XG4gICAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5SZXNvdXJjZXNbcl0uRGVwZW5kc09uKS50b0VxdWFsKFsnQ2x1c3Rlckt1YmVjdGxSZWFkeUJhcnJpZXIyMDAwNTJBRiddKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QoJ2t1YmVjdGwgcHJvdmlkZXIgcm9sZSBoYXZlIHJpZ2h0IHBvbGljeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgY29uc3QgYzEgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyMScsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICAvLyBhY3RpdmF0ZSBrdWJlY3RsIHByb3ZpZGVyXG4gICAgICBjMS5hZGRNYW5pZmVzdCgnYzFhJywgeyBmb286IDEyMyB9KTtcbiAgICAgIGMxLmFkZE1hbmlmZXN0KCdjMWInLCB7IGZvbzogMTIzIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnZWtzOkRlc2NyaWJlQ2x1c3RlcicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdDbHVzdGVyMTkyQ0QwMzc1JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYVZQQ0FjY2Vzc0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9BbWF6b25FQzJDb250YWluZXJSZWdpc3RyeVJlYWRPbmx5JyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpJZic6IFtcbiAgICAgICAgICAgICAgJ0NsdXN0ZXIxS3ViZWN0bFByb3ZpZGVySGFuZGxlckhhc0VjclB1YmxpYzBCMUM5ODIwJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L0FtYXpvbkVsYXN0aWNDb250YWluZXJSZWdpc3RyeVB1YmxpY1JlYWRPbmx5JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6Tm9WYWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgna3ViZWN0bCBwcm92aWRlciBwYXNzZXMgc2VjdXJpdHkgZ3JvdXAgdG8gcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBGb286ICdCYXInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBWcGNDb25maWc6IHtcbiAgICAgICAgU2VjdXJpdHlHcm91cElkczogW3sgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXIxOTJDRDAzNzUnLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCddIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgna3ViZWN0bCBwcm92aWRlciBwYXNzZXMgZW52aXJvbm1lbnQgdG8gbGFtYmRhJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIEZvbzogJ0JhcicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgncmVzb3VyY2UnLCB7XG4gICAgICBraW5kOiAnQ29uZmlnTWFwJyxcbiAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgfSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdjb25maWctbWFwJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVmFyaWFibGVzOiB7XG4gICAgICAgICAgRm9vOiAnQmFyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdrdWJlY3RsIHByb3ZpZGVyIHBhc3NlcyBpYW0gcm9sZSBlbnZpcm9ubWVudCB0byBrdWJlY3RsIGxhbWJkYScsICgpID0+IHtcbiAgICB0ZXN0KCduZXcgY2x1c3RlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IGt1YmVjdGxSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnS3ViZWN0bElhbVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHVzaW5nIF8gc3ludGF4IHRvIHNpbGVuY2Ugd2FybmluZyBhYm91dCBfY2x1c3RlciBub3QgYmVpbmcgdXNlZCwgd2hlbiBpdCBpc1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgICAgcm9sZToga3ViZWN0bFJvbGUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY2x1c3Rlci5hZGRNYW5pZmVzdCgncmVzb3VyY2UnLCB7XG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaGVsbG86ICd3b3JsZCcsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbmZpZy1tYXAnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFJvbGU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2x1c3RlcjFLdWJlY3RsUHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50U2VydmljZVJvbGU2NzgxOUFBOScsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0ZWQgY2x1c3RlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNsdXN0ZXJOYW1lID0gJ215LWNsdXN0ZXInO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcblxuICAgICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmZyb21LdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzKHN0YWNrLCAnS3ViZWN0bFByb3ZpZGVyJywge1xuICAgICAgICBzZXJ2aWNlVG9rZW46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uOjEnLFxuICAgICAgICByb2xlOiBoYW5kbGVyUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWQnLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXI6IGt1YmVjdGxQcm92aWRlcixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjaGFydCA9ICdoZWxsby13b3JsZCc7XG4gICAgICBjbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1jaGFydCcsIHtcbiAgICAgICAgY2hhcnQsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoSGVsbUNoYXJ0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgQ2x1c3Rlck5hbWU6IGNsdXN0ZXJOYW1lLFxuICAgICAgICBSZWxlYXNlOiAnaW1wb3J0ZWRjaGFydHRlc3RjaGFydGYzYWNkNmU1JyxcbiAgICAgICAgQ2hhcnQ6IGNoYXJ0LFxuICAgICAgICBOYW1lc3BhY2U6ICdkZWZhdWx0JyxcbiAgICAgICAgQ3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlbmRwb2ludCBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgdGVzdCgncHVibGljIHJlc3RyaWN0ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBla3MuRW5kcG9pbnRBY2Nlc3MuUFVCTElDLm9ubHlGcm9tKCcxLjIuMy40LzMyJyk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgcmVzdHJpYyBwdWJsaWMgYWNjZXNzIHRvIGVuZHBvaW50IHdoZW4gcHJpdmF0ZSBhY2Nlc3MgaXMgZGlzYWJsZWQuIFVzZSBQVUJMSUNfQU5EX1BSSVZBVEUub25seUZyb21cXChcXCkgaW5zdGVhZC4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3B1YmxpYyBub24gcmVzdHJpY3RlZCB3aXRob3V0IHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQyxcbiAgICAgICAgdnBjU3VibmV0czogW3sgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH1dLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gd2UgZG9uJ3QgYXR0YWNoIHZwYyBjb25maWcgaW4gY2FzZSBlbmRwb2ludCBpcyBwdWJsaWMgb25seSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyXG4gICAgICAvLyB0aGUgdnBjIGhhcyBwcml2YXRlIHN1Ym5ldHMgb3Igbm90LlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgVnBjQ29uZmlnOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHVibGljIG5vbiByZXN0cmljdGVkIHdpdGggcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQyxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdlIGRvbid0IGF0dGFjaCB2cGMgY29uZmlnIGluIGNhc2UgZW5kcG9pbnQgaXMgcHVibGljIG9ubHksIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAgLy8gdGhlIHZwYyBoYXMgcHJpdmF0ZSBzdWJuZXRzIG9yIG5vdC5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ByaXZhdGUgd2l0aG91dCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9WcGMgbXVzdCBjb250YWluIHByaXZhdGUgc3VibmV0cyB3aGVuIHB1YmxpYyBlbmRwb2ludCBhY2Nlc3MgaXMgZGlzYWJsZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ByaXZhdGUgd2l0aCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZnVuY3Rpb25zID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nKTtcbiAgICAgIGV4cGVjdChmdW5jdGlvbnMuQ2x1c3Rlckt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ2OEUwQ0Y4MC5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TdWJuZXRJZHMubGVuZ3RoKS5ub3QudG9FcXVhbCgwKTtcbiAgICAgIGV4cGVjdChmdW5jdGlvbnMuQ2x1c3Rlckt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ2OEUwQ0Y4MC5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TZWN1cml0eUdyb3VwSWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGFuZCBub24gcmVzdHJpY3RlZCBwdWJsaWMgd2l0aG91dCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QVUJMSUNfQU5EX1BSSVZBVEUsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdlIGRvbid0IGhhdmUgcHJpdmF0ZSBzdWJuZXRzLCBidXQgd2UgZG9uJ3QgbmVlZCB0aGVtIHNpbmNlIHB1YmxpYyBhY2Nlc3NcbiAgICAgIC8vIGlzIG5vdCByZXN0cmljdGVkLlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgVnBjQ29uZmlnOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBhbmQgbm9uIHJlc3RyaWN0ZWQgcHVibGljIHdpdGggcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFVCTElDX0FORF9QUklWQVRFLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gd2UgaGF2ZSBwcml2YXRlIHN1Ym5ldHMgc28gd2Ugc2hvdWxkIHVzZSB0aGVtLlxuICAgICAgY29uc3QgZnVuY3Rpb25zID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nKTtcbiAgICAgIGV4cGVjdChmdW5jdGlvbnMuQ2x1c3Rlckt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ2OEUwQ0Y4MC5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TdWJuZXRJZHMubGVuZ3RoKS5ub3QudG9FcXVhbCgwKTtcbiAgICAgIGV4cGVjdChmdW5jdGlvbnMuQ2x1c3Rlckt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ2OEUwQ0Y4MC5Qcm9wZXJ0aWVzLlZwY0NvbmZpZy5TZWN1cml0eUdyb3VwSWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGFuZCByZXN0cmljdGVkIHB1YmxpYyB3aXRob3V0IHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURS5vbmx5RnJvbSgnMS4yLjMuNC8zMicpLFxuICAgICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9WcGMgbXVzdCBjb250YWluIHByaXZhdGUgc3VibmV0cyB3aGVuIHB1YmxpYyBlbmRwb2ludCBhY2Nlc3MgaXMgcmVzdHJpY3RlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBhbmQgcmVzdHJpY3RlZCBwdWJsaWMgd2l0aCBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QVUJMSUNfQU5EX1BSSVZBVEUub25seUZyb20oJzEuMi4zLjQvMzInKSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdlIGhhdmUgcHJpdmF0ZSBzdWJuZXRzIHNvIHdlIHNob3VsZCB1c2UgdGhlbS5cbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyk7XG4gICAgICBleHBlY3QoZnVuY3Rpb25zLkNsdXN0ZXJLdWJlY3RsUHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50NjhFMENGODAuUHJvcGVydGllcy5WcGNDb25maWcuU3VibmV0SWRzLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICBleHBlY3QoZnVuY3Rpb25zLkNsdXN0ZXJLdWJlY3RsUHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50NjhFMENGODAuUHJvcGVydGllcy5WcGNDb25maWcuU2VjdXJpdHlHcm91cElkcy5sZW5ndGgpLm5vdC50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBlbmRwb2ludCBhY2Nlc3Mgc2VsZWN0cyBvbmx5IHByaXZhdGUgc3VibmV0cyBmcm9tIGxvb2tlZCB1cCB2cGMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB2cGNJZCA9ICd2cGMtMTIzNDUnO1xuICAgICAgLy8gY2FuJ3QgdXNlIHRoZSByZWd1bGFyIGZpeHR1cmUgYmVjYXVzZSBpdCBhbHNvIGFkZHMgYSBWUEMgdG8gdGhlIHN0YWNrLCB3aGljaCBwcmV2ZW50c1xuICAgICAgLy8gdXMgZnJvbSBzZXR0aW5nIGNvbnRleHQuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sobmV3IGNkay5BcHAoKSwgJ1N0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMTExMTIyMjInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChgdnBjLXByb3ZpZGVyOmFjY291bnQ9JHtzdGFjay5hY2NvdW50fTpmaWx0ZXIudnBjLWlkPSR7dnBjSWR9OnJlZ2lvbj0ke3N0YWNrLnJlZ2lvbn06cmV0dXJuQXN5bW1ldHJpY1N1Ym5ldHM9dHJ1ZWAsIHtcbiAgICAgICAgdnBjSWQ6IHZwY0lkLFxuICAgICAgICB2cGNDaWRyQmxvY2s6ICcxMC4wLjAuMC8xNicsXG4gICAgICAgIHN1Ym5ldEdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgICAgICAgIHR5cGU6ICdQcml2YXRlJyxcbiAgICAgICAgICAgIHN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Ym5ldElkOiAnc3VibmV0LXByaXZhdGUtaW4tdXMtZWFzdC0xYScsXG4gICAgICAgICAgICAgICAgY2lkcjogJzEwLjAuMS4wLzI0JyxcbiAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLTA2MDY4ZTRjNDA0OTkyMWVmJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgICAgIHR5cGU6ICdQdWJsaWMnLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQtcHVibGljLWluLXVzLWVhc3QtMWMnLFxuICAgICAgICAgICAgICAgIGNpZHI6ICcxMC4wLjAuMC8yNCcsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWMnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0Yi0wZmYwOGU2MjE5NTE5OGRiYicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgdnBjSWQ6IHZwY0lkLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIFZwY0NvbmZpZzogeyBTdWJuZXRJZHM6IFsnc3VibmV0LXByaXZhdGUtaW4tdXMtZWFzdC0xYSddIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ByaXZhdGUgZW5kcG9pbnQgYWNjZXNzIHNlbGVjdHMgb25seSBwcml2YXRlIHN1Ym5ldHMgZnJvbSBsb29rZWQgdXAgdnBjIHdpdGggY29uY3JldGUgc3VibmV0IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHZwY0lkID0gJ3ZwYy0xMjM0NSc7XG4gICAgICAvLyBjYW4ndCB1c2UgdGhlIHJlZ3VsYXIgZml4dHVyZSBiZWNhdXNlIGl0IGFsc28gYWRkcyBhIFZQQyB0byB0aGUgc3RhY2ssIHdoaWNoIHByZXZlbnRzXG4gICAgICAvLyB1cyBmcm9tIHNldHRpbmcgY29udGV4dC5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhuZXcgY2RrLkFwcCgpLCAnU3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMTExMjIyMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoYHZwYy1wcm92aWRlcjphY2NvdW50PSR7c3RhY2suYWNjb3VudH06ZmlsdGVyLnZwYy1pZD0ke3ZwY0lkfTpyZWdpb249JHtzdGFjay5yZWdpb259OnJldHVybkFzeW1tZXRyaWNTdWJuZXRzPXRydWVgLCB7XG4gICAgICAgIHZwY0lkOiB2cGNJZCxcbiAgICAgICAgdnBjQ2lkckJsb2NrOiAnMTAuMC4wLjAvMTYnLFxuICAgICAgICBzdWJuZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUHJpdmF0ZScsXG4gICAgICAgICAgICB0eXBlOiAnUHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3N1Ym5ldC1wcml2YXRlLWluLXVzLWVhc3QtMWEnLFxuICAgICAgICAgICAgICAgIGNpZHI6ICcxMC4wLjEuMC8yNCcsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0Yi0wNjA2OGU0YzQwNDk5MjFlZicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgICB0eXBlOiAnUHVibGljJyxcbiAgICAgICAgICAgIHN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Ym5ldElkOiAnc3VibmV0LXB1YmxpYy1pbi11cy1lYXN0LTFjJyxcbiAgICAgICAgICAgICAgICBjaWRyOiAnMTAuMC4wLjAvMjQnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFjJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItMGZmMDhlNjIxOTUxOThkYmInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgdnBjSWQ6IHZwY0lkLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgICAgdnBjU3VibmV0czogW3tcbiAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICBlYzIuU3VibmV0LmZyb21TdWJuZXRJZChzdGFjaywgJ1ByaXZhdGUnLCAnc3VibmV0LXByaXZhdGUtaW4tdXMtZWFzdC0xYScpLFxuICAgICAgICAgICAgZWMyLlN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdQdWJsaWMnLCAnc3VibmV0LXB1YmxpYy1pbi11cy1lYXN0LTFjJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfV0sXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHsgU3VibmV0SWRzOiBbJ3N1Ym5ldC1wcml2YXRlLWluLXVzLWVhc3QtMWEnXSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcml2YXRlIGVuZHBvaW50IGFjY2VzcyBzZWxlY3RzIG9ubHkgcHJpdmF0ZSBzdWJuZXRzIGZyb20gbWFuYWdlZCB2cGMgd2l0aCBjb25jcmV0ZSBzdWJuZXQgc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGNTdWJuZXRzOiBbe1xuICAgICAgICAgIHN1Ym5ldHM6IFtcbiAgICAgICAgICAgIHZwYy5wcml2YXRlU3VibmV0c1swXSxcbiAgICAgICAgICAgIHZwYy5wdWJsaWNTdWJuZXRzWzFdLFxuICAgICAgICAgICAgZWMyLlN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdQcml2YXRlJywgJ3N1Ym5ldC11bmtub3duJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfV0sXG4gICAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHtcbiAgICAgICAgICBTdWJuZXRJZHM6IFtcbiAgICAgICAgICAgIHsgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScgfSxcbiAgICAgICAgICAgICdzdWJuZXQtdW5rbm93bicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpdmF0ZSBlbmRwb2ludCBhY2Nlc3MgY29uc2lkZXJzIHNwZWNpZmljIHN1Ym5ldCBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICBwcnVuZTogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50QWNjZXNzOlxuICAgICAgICAgIGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGNTdWJuZXRzOiBbe1xuICAgICAgICAgIHN1Ym5ldHM6IFtlYzIuUHJpdmF0ZVN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcyhzdGFjaywgJ1ByaXZhdGUxJywge1xuICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQxJyxcbiAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH1dLFxuICAgICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgVnBjQ29uZmlnOiB7IFN1Ym5ldElkczogWydzdWJuZXQxJ10gfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBwcml2YXRlIGVuZHBvaW50IGFjY2VzcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLCBwcnVuZTogZmFsc2UgfSk7XG5cbiAgICAgIGNvbnN0IGFwcCA9IHN0YWNrLm5vZGUucm9vdCBhcyBjZGsuQXBwO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodGVtcGxhdGUuUmVzb3VyY2VzLkNsdXN0ZXIxOTJDRDAzNzUuUHJvcGVydGllcy5SZXNvdXJjZXNWcGNDb25maWcuRW5kcG9pbnRQcml2YXRlQWNjZXNzKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLlJlc291cmNlcy5DbHVzdGVyMTkyQ0QwMzc1LlByb3BlcnRpZXMuUmVzb3VyY2VzVnBjQ29uZmlnLkVuZHBvaW50UHVibGljQWNjZXNzKS50b0VxdWFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2t1YmVjdGwgcHJvdmlkZXIgY2hvb3NlcyBvbmx5IHByaXZhdGUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywge1xuICAgICAgICBtYXhBenM6IDIsXG4gICAgICAgIG5hdEdhdGV3YXlzOiAxLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgIG5hbWU6ICdQcml2YXRlMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAnUHVibGljMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsXG4gICAgICAgIHZwYyxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ3Jlc291cmNlJywge1xuICAgICAgICBraW5kOiAnQ29uZmlnTWFwJyxcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICB9LFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdjb25maWctbWFwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHtcbiAgICAgICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyMTkyQ0QwMzc1JywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBTdWJuZXRJZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTFTdWJuZXQxU3VibmV0QzY4OEIyQjEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTFTdWJuZXQyU3VibmV0QTJBRjE1QzcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrdWJlY3RsIHByb3ZpZGVyIGNvbnNpZGVycyB2cGMgc3VibmV0IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAgIGNvbnN0IHN1Ym5ldENvbmZpZ3VyYXRpb246IGVjMi5TdWJuZXRDb25maWd1cmF0aW9uW10gPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24ucHVzaCh7XG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICBuYW1lOiBgUHJpdmF0ZSR7aX1gLFxuICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uLnB1c2goe1xuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIG5hbWU6ICdQdWJsaWMxJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2cGMyID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMixcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb24sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRBY2Nlc3M6IGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLFxuICAgICAgICB2cGM6IHZwYzIsXG4gICAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldEdyb3VwTmFtZTogJ1ByaXZhdGUxJyB9LCB7IHN1Ym5ldEdyb3VwTmFtZTogJ1ByaXZhdGUyJyB9XSxcbiAgICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ3Jlc291cmNlJywge1xuICAgICAgICBraW5kOiAnQ29uZmlnTWFwJyxcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICB9LFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdjb25maWctbWFwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBWcGNDb25maWc6IHtcbiAgICAgICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyMTkyQ0QwMzc1JywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBTdWJuZXRJZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTFTdWJuZXQxU3VibmV0QzY4OEIyQjEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTFTdWJuZXQyU3VibmV0QTJBRjE1QzcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTJTdWJuZXQxU3VibmV0RTEzRTJFMzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZTJTdWJuZXQyU3VibmV0MTU4QTM4QUInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvdyB3aGVuIHByaXZhdGUgYWNjZXNzIGlzIGNvbmZpZ3VyZWQgd2l0aG91dCBkbnMgc3VwcG9ydCBlbmFibGVkIGZvciB0aGUgVlBDJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2cGM6IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywge1xuICAgICAgICAgICAgZW5hYmxlRG5zU3VwcG9ydDogZmFsc2UsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Qcml2YXRlIGVuZHBvaW50IGFjY2VzcyByZXF1aXJlcyB0aGUgVlBDIHRvIGhhdmUgRE5TIHN1cHBvcnQgYW5kIEROUyBob3N0bmFtZXMgZW5hYmxlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgd2hlbiBwcml2YXRlIGFjY2VzcyBpcyBjb25maWd1cmVkIHdpdGhvdXQgZG5zIGhvc3RuYW1lcyBlbmFibGVkIGZvciB0aGUgVlBDJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2cGM6IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywge1xuICAgICAgICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiBmYWxzZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1ByaXZhdGUgZW5kcG9pbnQgYWNjZXNzIHJlcXVpcmVzIHRoZSBWUEMgdG8gaGF2ZSBETlMgc3VwcG9ydCBhbmQgRE5TIGhvc3RuYW1lcyBlbmFibGVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvdyB3aGVuIGNpZHJzIGFyZSBjb25maWd1cmVkIHdpdGhvdXQgcHVibGljIGFjY2VzcyBlbmRwb2ludCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGVrcy5FbmRwb2ludEFjY2Vzcy5QUklWQVRFLm9ubHlGcm9tKCcxLjIuMy40LzUnKTtcbiAgICAgIH0pLnRvVGhyb3coL0NJRFIgYmxvY2tzIGNhbiBvbmx5IGJlIGNvbmZpZ3VyZWQgd2hlbiBwdWJsaWMgYWNjZXNzIGlzIGVuYWJsZWQvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2V0U2VydmljZUxvYWRCYWxhbmNlckFkZHJlc3MnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcjEnLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBjbHVzdGVyLmdldFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzKCdteXNlcnZpY2UnKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTG9hZEJhbGFuY2VyQWRkcmVzcycsIHtcbiAgICAgIHZhbHVlOiBsb2FkQmFsYW5jZXJBZGRyZXNzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhwZWN0ZWRLdWJlcm5ldGVzR2V0SWQgPSAnQ2x1c3RlcjFteXNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzMTk4Q0NCMDMnO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICBjb25zdCByZXNvdXJjZXMgPSB0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc09iamVjdFZhbHVlJyk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhlIGN1c3RvbSByZXNvdXJjZSBpcyBjcmVhdGVkIGNvcnJlY3RseVxuICAgIGV4cGVjdChyZXNvdXJjZXNbZXhwZWN0ZWRLdWJlcm5ldGVzR2V0SWRdLlByb3BlcnRpZXMpLnRvRXF1YWwoe1xuICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdDbHVzdGVyMUt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnRCQjM5OENBRScsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlcjE5MkNEMDM3NScsXG4gICAgICB9LFxuICAgICAgT2JqZWN0VHlwZTogJ3NlcnZpY2UnLFxuICAgICAgT2JqZWN0TmFtZTogJ215c2VydmljZScsXG4gICAgICBPYmplY3ROYW1lc3BhY2U6ICdkZWZhdWx0JyxcbiAgICAgIEpzb25QYXRoOiAnLnN0YXR1cy5sb2FkQmFsYW5jZXIuaW5ncmVzc1swXS5ob3N0bmFtZScsXG4gICAgICBUaW1lb3V0U2Vjb25kczogMzAwLFxuICAgIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIHRoZSBhdHRyaWJ1dGUgcG9pbnRzIHRvIHRoZSBleHBlY3RlZCBjdXN0b20gcmVzb3VyY2UgYW5kIGV4dHJhY3RzIHRoZSBjb3JyZWN0IGF0dHJpYnV0ZVxuICAgIHRlbXBsYXRlLmhhc091dHB1dCgnTG9hZEJhbGFuY2VyQWRkcmVzcycsIHtcbiAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogW2V4cGVjdGVkS3ViZXJuZXRlc0dldElkLCAnVmFsdWUnXSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20ga3ViZWN0bCBsYXllciBjYW4gYmUgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxheWVyID0gbGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKHN0YWNrLCAnTXlMYXllcicsICdhcm46b2Y6bGF5ZXInKTtcbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyMScsIHtcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBsYXllcixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIExheWVyczogW1xuICAgICAgICB7IFJlZjogJ0NsdXN0ZXIxS3ViZWN0bFByb3ZpZGVyQXdzQ2xpTGF5ZXI1Q0Y1MDMyMScgfSxcbiAgICAgICAgJ2FybjpvZjpsYXllcicsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gYXdzY2xpIGxheWVyIGNhbiBiZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGF5ZXIgPSBsYW1iZGEuTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25Bcm4oc3RhY2ssICdNeUxheWVyJywgJ2FybjpvZjpsYXllcicpO1xuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXIxJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBhd3NjbGlMYXllcjogbGF5ZXIsXG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgTGF5ZXJzOiBbXG4gICAgICAgICdhcm46b2Y6bGF5ZXInLFxuICAgICAgICB7IFJlZjogJ2t1YmVjdGxMYXllcjQ0MzIxRTA4JyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgY2x1c3RlciB1c2luZyBjdXN0b20gcmVzb3VyY2Ugd2l0aCBzZWNyZXRzIGVuY3J5cHRpb24gdXNpbmcgS01TIENNSycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgcHJ1bmU6IGZhbHNlLFxuICAgICAgc2VjcmV0c0VuY3J5cHRpb25LZXk6IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpDbHVzdGVyJywge1xuICAgICAgRW5jcnlwdGlvbkNvbmZpZzogW3tcbiAgICAgICAgUHJvdmlkZXI6IHtcbiAgICAgICAgICBLZXlBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnS2V5OTYxQjczRkQnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2VzOiBbJ3NlY3JldHMnXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBjbHVzdGVyIHVzaW5nIGN1c3RvbSBrdWJlcm5ldGVzIG5ldHdvcmsgY29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjdXN0b21DaWRyID0gJzE3Mi4xNi4wLjAvMTInO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBzZXJ2aWNlSXB2NENpZHI6IGN1c3RvbUNpZHIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpDbHVzdGVyJywge1xuICAgICAgS3ViZXJuZXRlc05ldHdvcmtDb25maWc6IHtcbiAgICAgICAgU2VydmljZUlwdjRDaWRyOiBjdXN0b21DaWRyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FjY2Vzc0NvbmZpZycsICgpID0+IHtcbiAgICAvLyBib290c3RyYXBDbHVzdGVyQ3JlYXRvckFkbWluUGVybWlzc2lvbnMgY2FuIGJlIGV4cGxpY2l0bHkgZW5hYmxlZCBvciBkaXNhYmxlZFxuICAgIHRlc3QuZWFjaChbXG4gICAgICBbdHJ1ZSwgdHJ1ZV0sXG4gICAgICBbZmFsc2UsIGZhbHNlXSxcbiAgICBdKSgnYm9vdHN0cmFwQ2x1c3RlckNyZWF0b3JBZG1pblBlcm1pc3Npb25zKCVzKSBzaG91bGQgd29yaycsXG4gICAgICAoYSwgYikgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICAgICAgYm9vdHN0cmFwQ2x1c3RlckNyZWF0b3JBZG1pblBlcm1pc3Npb25zOiBhLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgICAgICBBY2Nlc3NDb25maWc6IHtcbiAgICAgICAgICAgIEJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9uczogYixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FjY2Vzc0VudHJ5JywgKCkgPT4ge1xuICAgIC8vIGNsdXN0ZXIgY2FuIGdyYW50QWNjZXNzKCk7XG4gICAgdGVzdCgnY2x1c3RlciBjYW4gZ3JhbnRBY2Nlc3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdyb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIH0pO1xuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpBY2Nlc3NFbnRyeScsIHtcbiAgICAgICAgQWNjZXNzUG9saWNpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY2Nlc3NTY29wZToge1xuICAgICAgICAgICAgICBUeXBlOiAnY2x1c3RlcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5QXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJywgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6ZWtzOjphd3M6Y2x1c3Rlci1hY2Nlc3MtcG9saWN5L0FtYXpvbkVLU0NsdXN0ZXJBZG1pblBvbGljeScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19