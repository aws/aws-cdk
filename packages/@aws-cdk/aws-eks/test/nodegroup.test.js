"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const util_1 = require("./util");
const eks = require("../lib");
const lib_1 = require("../lib");
/* eslint-disable max-len */
const CLUSTER_VERSION = eks.KubernetesVersion.V1_21;
describe('node group', () => {
    test('default ami type is not applied when launch template is configured', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.MEDIUM).toString(),
            },
        });
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE)],
            launchTemplateSpec: {
                id: launchTemplate.ref,
                version: launchTemplate.attrLatestVersionNumber,
            },
        });
        // THEN
        const root = stack.node.root;
        const stackArtifact = root.synth().getStackByName(stack.stackName);
        expect(stackArtifact.template.Resources.Nodegroup62B4B2C1.Properties.AmiType).toBeUndefined();
    });
    test('explicit ami type is applied even when launch template is configured', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.MEDIUM).toString(),
            },
        });
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: eks.NodegroupAmiType.AL2_X86_64,
            launchTemplateSpec: {
                id: launchTemplate.ref,
                version: launchTemplate.attrLatestVersionNumber,
            },
        });
        // THEN
        const root = stack.node.root;
        const stackArtifact = root.synth().getStackByName(stack.stackName);
        expect(stackArtifact.template.Resources.Nodegroup62B4B2C1.Properties.AmiType).toEqual('AL2_x86_64');
    });
    test('ami type is taken as is when no instance types are configured', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: eks.NodegroupAmiType.AL2_X86_64_GPU,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'AL2_x86_64_GPU',
        });
    });
    test('create a default nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', { cluster });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            NodeRole: {
                'Fn::GetAtt': [
                    'NodegroupNodeGroupRole038A128B',
                    'Arn',
                ],
            },
            Subnets: [
                {
                    Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                },
                {
                    Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                },
            ],
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
        });
    });
    test('create a x86_64 bottlerocket nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            NodeRole: {
                'Fn::GetAtt': [
                    'NodegroupNodeGroupRole038A128B',
                    'Arn',
                ],
            },
            Subnets: [
                {
                    Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                },
                {
                    Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                },
            ],
            AmiType: 'BOTTLEROCKET_x86_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
        });
    });
    test('create a ARM_64 bottlerocket nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_ARM_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            NodeRole: {
                'Fn::GetAtt': [
                    'NodegroupNodeGroupRole038A128B',
                    'Arn',
                ],
            },
            Subnets: [
                {
                    Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                },
                {
                    Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                },
            ],
            AmiType: 'BOTTLEROCKET_ARM_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
        });
    });
    /**
     * When LaunchTemplate and amiType are undefined and instanceTypes are x86_64 instances,
     * the amiType should be implicitly set as AL2_x86_64.
     */
    test('amiType should be AL2_x86_64 with LaunchTemplate and amiType undefined and instanceTypes is x86_64', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('m5.large'),
                new ec2.InstanceType('c5.large'),
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'AL2_x86_64',
        });
    });
    /**
     * When LaunchTemplate and amiType are both undefined and instanceTypes are ARM64 instances,
     * the amiType should be implicitly set as AL2_ARM_64.
     */
    test('amiType should be AL2_ARM_64 with LaunchTemplate and amiType undefined and instanceTypes is ARM_64', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('c6g.large'),
                new ec2.InstanceType('t4g.large'),
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'AL2_ARM_64',
        });
    });
    /**
     * When LaunchTemplate and amiType are both undefined and instanceTypes are GPU instances,
     * the amiType should be implicitly set as AL2_x86_64_GPU.
     */
    test('amiType should be AL2_x86_64_GPU with LaunchTemplate and amiType undefined and instanceTypes is GPU', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('p3.large'),
                new ec2.InstanceType('g3.large'),
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'AL2_x86_64_GPU',
        });
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2_x86_64 and instanceTypes are not x86_64,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2_x86_64 and instanceTypes are not x86_64', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_X86_64,
            instanceTypes: [
                new ec2.InstanceType('p3.large'),
                new ec2.InstanceType('g3.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_x86_64_GPU or don't specify any/);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2_ARM_64 and instanceTypes are not ARM_64,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2_ARM_64 and instanceTypes are not ARM_64', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_ARM_64,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_x86_64,BOTTLEROCKET_x86_64 or don't specify any/);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2_x86_64_GPU and instanceTypes are not GPU instances,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2_X86_64_GPU and instanceTypes are not X86_64_GPU', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_X86_64_GPU,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_x86_64,BOTTLEROCKET_x86_64 or don't specify any/);
    });
    /**
     * When LaunchTemplate is defined, amiType is undefined and instanceTypes are GPU instances,
     * we should deploy correctly.
     */
    test('deploy correctly with defined LaunchTemplate and instanceTypes(GPU) and amiType undefined.', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        const ng = new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('p3.large'),
                new ec2.InstanceType('g3.large'),
            ],
            launchTemplateSpec: {
                id: 'mock',
            },
        });
        // THEN
        expect(ng).not.toHaveProperty('AmiType');
    });
    /**
     * When LaunchTemplate is defined, amiType is undefined and instanceTypes are x86_64 instances,
     * we should deploy correctly.
     */
    test('deploy correctly with defined LaunchTemplate and instanceTypes(x86_64) and amiType undefined.', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        const ng = new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
            launchTemplateSpec: {
                id: 'mock',
            },
        });
        // THEN
        expect(ng).not.toHaveProperty('AmiType');
    });
    /**
     * When LaunchTemplate is defined, amiType is undefined and instanceTypes are ARM_64 instances,
     * we should deploy correctly.
     */
    test('deploy correctly with defined LaunchTemplate and instanceTypes(ARM_64) and amiType undefined.', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        const ng = new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('c6g.large'),
                new ec2.InstanceType('t4g.large'),
            ],
            launchTemplateSpec: {
                id: 'mock',
            },
        });
        // THEN
        expect(ng).not.toHaveProperty('AmiType');
    });
    /**
     * BOTTLEROCKET_X86_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('BOTTLEROCKET_X86_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        cluster.addNodegroupCapacity('bottlerocket', {
            instanceTypes: [new ec2.InstanceType('m5a.xlarge')],
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'BOTTLEROCKET_x86_64',
        });
    });
    /**
     * BOTTLEROCKET_ARM_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('BOTTLEROCKET_ARM_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        cluster.addNodegroupCapacity('bottlerocket', {
            instanceTypes: [new ec2.InstanceType('c6g.xlarge')],
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_ARM_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'BOTTLEROCKET_ARM_64',
        });
    });
    test('aws-auth will be updated', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', { cluster });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
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
                                'NodegroupNodeGroupRole038A128B',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            RoleArn: {
                'Fn::GetAtt': [
                    'ClusterCreationRole360249B6',
                    'Arn',
                ],
            },
            PruneLabel: 'aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76',
        });
    });
    test('create nodegroup correctly with security groups provided', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            remoteAccess: {
                sshKeyName: 'foo',
                sourceSecurityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc })],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            RemoteAccess: {
                Ec2SshKey: 'foo',
                SourceSecurityGroups: [
                    {
                        'Fn::GetAtt': [
                            'SGADB53937',
                            'GroupId',
                        ],
                    },
                ],
            },
        });
    });
    test('create nodegroup with forceUpdate disabled', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', { cluster, forceUpdate: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ForceUpdateEnabled: false,
        });
    });
    test('create nodegroup with instanceTypes provided', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [new ec2.InstanceType('m5.large')],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            InstanceTypes: [
                'm5.large',
            ],
        });
    });
    test('create nodegroup with on-demand capacity type', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [new ec2.InstanceType('m5.large')],
            capacityType: eks.CapacityType.ON_DEMAND,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            InstanceTypes: [
                'm5.large',
            ],
            CapacityType: 'ON_DEMAND',
        });
    });
    test('create nodegroup with spot capacity type', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('m5.large'),
                new ec2.InstanceType('t3.large'),
                new ec2.InstanceType('c5.large'),
            ],
            capacityType: eks.CapacityType.SPOT,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            InstanceTypes: [
                'm5.large',
                't3.large',
                'c5.large',
            ],
            CapacityType: 'SPOT',
        });
    });
    test('create nodegroup with on-demand capacity type and multiple instance types', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            instanceTypes: [
                new ec2.InstanceType('m5.large'),
                new ec2.InstanceType('t3.large'),
                new ec2.InstanceType('c5.large'),
            ],
            capacityType: eks.CapacityType.ON_DEMAND,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            InstanceTypes: [
                'm5.large',
                't3.large',
                'c5.large',
            ],
            CapacityType: 'ON_DEMAND',
        });
    });
    cdk_build_tools_1.testDeprecated('throws when both instanceTypes and instanceType defined', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            instanceType: new ec2.InstanceType('m5.large'),
            instanceTypes: [
                new ec2.InstanceType('m5.large'),
                new ec2.InstanceType('t3.large'),
                new ec2.InstanceType('c5.large'),
            ],
            capacityType: eks.CapacityType.SPOT,
        })).toThrow(/"instanceType is deprecated, please use "instanceTypes" only/);
    });
    test('create nodegroup with neither instanceTypes nor instanceType defined', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            capacityType: eks.CapacityType.SPOT,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            CapacityType: 'SPOT',
        });
    });
    test('throws when instanceTypes provided with different CPU architrcture', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            instanceTypes: [
                // X86
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('c5a.large'),
                // ARM64
                new ec2.InstanceType('m6g.large'),
            ],
        })).toThrow(/instanceTypes of different architectures is not allowed/);
    });
    test('throws when amiType provided is incorrect', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('c5a.large'),
                new ec2.InstanceType('c5d.large'),
            ],
            // incorrect amiType
            amiType: eks.NodegroupAmiType.AL2_ARM_64,
        })).toThrow(/The specified AMI does not match the instance types architecture/);
    });
    test('remoteAccess without security group provided', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            remoteAccess: {
                sshKeyName: 'foo',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            RemoteAccess: {
                Ec2SshKey: 'foo',
            },
        });
    });
    test('import nodegroup correctly', () => {
        // GIVEN
        const { stack: stack1, vpc, app } = util_1.testFixture();
        const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
        const cluster = new eks.Cluster(stack1, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // WHEN
        // const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: true, defaultCapacity: 0 });
        const ng = new eks.Nodegroup(stack1, 'Nodegroup', { cluster });
        const imported = eks.Nodegroup.fromNodegroupName(stack2, 'ImportedNg', ng.nodegroupName);
        new cdk.CfnOutput(stack2, 'NodegroupName', { value: imported.nodegroupName });
        // THEN
        assertions_1.Template.fromStack(stack2).templateMatches({
            Outputs: {
                NodegroupName: {
                    Value: {
                        'Fn::ImportValue': 'Stack:ExportsOutputRefNodegroup62B4B2C1EF8AB7C1',
                    },
                },
            },
        });
    });
    test('addNodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // WHEN
        cluster.addNodegroupCapacity('ng');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            NodeRole: {
                'Fn::GetAtt': [
                    'ClusterNodegroupngNodeGroupRoleDA0D35DA',
                    'Arn',
                ],
            },
            Subnets: [
                {
                    Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                },
                {
                    Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                },
            ],
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
        });
    });
    test('add node group with taints', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // WHEN
        cluster.addNodegroupCapacity('ng', {
            taints: [
                {
                    effect: eks.TaintEffect.NO_SCHEDULE,
                    key: 'foo',
                    value: 'bar',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            Taints: [
                {
                    Effect: 'NO_SCHEDULE',
                    Key: 'foo',
                    Value: 'bar',
                },
            ],
        });
    });
    test('throws when desiredSize > maxSize', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { desiredSize: 3, maxSize: 2 })).toThrow(/Desired capacity 3 can't be greater than max size 2/);
    });
    test('throws when desiredSize < minSize', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { desiredSize: 2, minSize: 3 })).toThrow(/Minimum capacity 3 can't be greater than desired size 2/);
    });
    test('can set minSize , maxSize and DesiredSize', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // WHEN
        new eks.Nodegroup(stack, 'NodeGroup', {
            cluster: cluster,
            minSize: 2,
            maxSize: 6,
            desiredSize: 4,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ScalingConfig: {
                MinSize: 2,
                MaxSize: 6,
                DesiredSize: 4,
            },
        });
    });
    test('validation is not performed when using Tokens', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        // WHEN
        new eks.Nodegroup(stack, 'NodeGroup', {
            cluster: cluster,
            minSize: cdk.Lazy.number({ produce: () => 5 }),
            maxSize: cdk.Lazy.number({ produce: () => 1 }),
            desiredSize: cdk.Lazy.number({ produce: () => 20 }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ScalingConfig: {
                MinSize: 5,
                MaxSize: 1,
                DesiredSize: 20,
            },
        });
    });
    test('create nodegroup correctly with launch template', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        const userData = ec2.UserData.forLinux();
        userData.addCommands('set -o xtrace', `/etc/eks/bootstrap.sh ${cluster.clusterName}`);
        const lt = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                imageId: new eks.EksOptimizedImage().getImage(stack).imageId,
                instanceType: new ec2.InstanceType('t3.small').toString(),
                userData: cdk.Fn.base64(userData.render()),
            },
        });
        cluster.addNodegroupCapacity('ng-lt', {
            launchTemplateSpec: {
                id: lt.ref,
                version: lt.attrDefaultVersionNumber,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            LaunchTemplate: {
                Id: {
                    Ref: 'LaunchTemplate',
                },
                Version: {
                    'Fn::GetAtt': [
                        'LaunchTemplate',
                        'DefaultVersionNumber',
                    ],
                },
            },
        });
    });
    test('throws when both diskSize and launch template specified', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
        });
        const userData = ec2.UserData.forLinux();
        userData.addCommands('set -o xtrace', `/etc/eks/bootstrap.sh ${cluster.clusterName}`);
        const lt = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                imageId: new eks.EksOptimizedImage().getImage(stack).imageId,
                instanceType: new ec2.InstanceType('t3.small').toString(),
                userData: cdk.Fn.base64(userData.render()),
            },
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng-lt', {
            diskSize: 100,
            launchTemplateSpec: {
                id: lt.ref,
                version: lt.attrDefaultVersionNumber,
            },
        })).toThrow(/diskSize must be specified within the launch template/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsOERBQTBEO0FBQzFELHFDQUFxQztBQUNyQyxpQ0FBcUM7QUFDckMsOEJBQThCO0FBQzlCLGdDQUEwQztBQUUxQyw0QkFBNEI7QUFFNUIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztBQUVwRCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1FBQzlFLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLGtCQUFXLEVBQUUsQ0FBQztRQUVyQyxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRTthQUM1RjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsZUFBZSxFQUFFLENBQUM7WUFDbEIsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTztZQUNQLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcs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bGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBOb2RlZ3JvdXBBbWlUeXBlIH0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5jb25zdCBDTFVTVEVSX1ZFUlNJT04gPSBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjE7XG5cbmRlc2NyaWJlKCdub2RlIGdyb3VwJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IGFtaSB0eXBlIGlzIG5vdCBhcHBsaWVkIHdoZW4gbGF1bmNoIHRlbXBsYXRlIGlzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBsYXVuY2hUZW1wbGF0ZSA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQzUsIGVjMi5JbnN0YW5jZVNpemUuTUVESVVNKS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5DNSwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSldLFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiBsYXVuY2hUZW1wbGF0ZS5yZWYsXG4gICAgICAgIHZlcnNpb246IGxhdW5jaFRlbXBsYXRlLmF0dHJMYXRlc3RWZXJzaW9uTnVtYmVyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByb290ID0gc3RhY2subm9kZS5yb290IGFzIGNkay5BcHA7XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IHJvb3Quc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpO1xuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnRlbXBsYXRlLlJlc291cmNlcy5Ob2RlZ3JvdXA2MkI0QjJDMS5Qcm9wZXJ0aWVzLkFtaVR5cGUpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhwbGljaXQgYW1pIHR5cGUgaXMgYXBwbGllZCBldmVuIHdoZW4gbGF1bmNoIHRlbXBsYXRlIGlzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBsYXVuY2hUZW1wbGF0ZSA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQzUsIGVjMi5JbnN0YW5jZVNpemUuTUVESVVNKS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBhbWlUeXBlOiBla3MuTm9kZWdyb3VwQW1pVHlwZS5BTDJfWDg2XzY0LFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiBsYXVuY2hUZW1wbGF0ZS5yZWYsXG4gICAgICAgIHZlcnNpb246IGxhdW5jaFRlbXBsYXRlLmF0dHJMYXRlc3RWZXJzaW9uTnVtYmVyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByb290ID0gc3RhY2subm9kZS5yb290IGFzIGNkay5BcHA7XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IHJvb3Quc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpO1xuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnRlbXBsYXRlLlJlc291cmNlcy5Ob2RlZ3JvdXA2MkI0QjJDMS5Qcm9wZXJ0aWVzLkFtaVR5cGUpLnRvRXF1YWwoJ0FMMl94ODZfNjQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYW1pIHR5cGUgaXMgdGFrZW4gYXMgaXMgd2hlbiBubyBpbnN0YW5jZSB0eXBlcyBhcmUgY29uZmlndXJlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBhbWlUeXBlOiBla3MuTm9kZWdyb3VwQW1pVHlwZS5BTDJfWDg2XzY0X0dQVSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEFtaVR5cGU6ICdBTDJfeDg2XzY0X0dQVScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIGRlZmF1bHQgbm9kZWdyb3VwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHsgY2x1c3RlciB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycsXG4gICAgICB9LFxuICAgICAgTm9kZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBGb3JjZVVwZGF0ZUVuYWJsZWQ6IHRydWUsXG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICBNYXhTaXplOiAyLFxuICAgICAgICBNaW5TaXplOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgeDg2XzY0IGJvdHRsZXJvY2tldCBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX1g4Nl82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycsXG4gICAgICB9LFxuICAgICAgTm9kZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBBbWlUeXBlOiAnQk9UVExFUk9DS0VUX3g4Nl82NCcsXG4gICAgICBGb3JjZVVwZGF0ZUVuYWJsZWQ6IHRydWUsXG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICBNYXhTaXplOiAyLFxuICAgICAgICBNaW5TaXplOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgQVJNXzY0IGJvdHRsZXJvY2tldCBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX0FSTV82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycsXG4gICAgICB9LFxuICAgICAgTm9kZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBBbWlUeXBlOiAnQk9UVExFUk9DS0VUX0FSTV82NCcsXG4gICAgICBGb3JjZVVwZGF0ZUVuYWJsZWQ6IHRydWUsXG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICBNYXhTaXplOiAyLFxuICAgICAgICBNaW5TaXplOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdoZW4gTGF1bmNoVGVtcGxhdGUgYW5kIGFtaVR5cGUgYXJlIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgeDg2XzY0IGluc3RhbmNlcyxcbiAgICogdGhlIGFtaVR5cGUgc2hvdWxkIGJlIGltcGxpY2l0bHkgc2V0IGFzIEFMMl94ODZfNjQuXG4gICAqL1xuICB0ZXN0KCdhbWlUeXBlIHNob3VsZCBiZSBBTDJfeDg2XzY0IHdpdGggTGF1bmNoVGVtcGxhdGUgYW5kIGFtaVR5cGUgdW5kZWZpbmVkIGFuZCBpbnN0YW5jZVR5cGVzIGlzIHg4Nl82NCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQUwyX3g4Nl82NCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGFuZCBhbWlUeXBlIGFyZSBib3RoIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgQVJNNjQgaW5zdGFuY2VzLFxuICAgKiB0aGUgYW1pVHlwZSBzaG91bGQgYmUgaW1wbGljaXRseSBzZXQgYXMgQUwyX0FSTV82NC5cbiAgICovXG4gIHRlc3QoJ2FtaVR5cGUgc2hvdWxkIGJlIEFMMl9BUk1fNjQgd2l0aCBMYXVuY2hUZW1wbGF0ZSBhbmQgYW1pVHlwZSB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgaXMgQVJNXzY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M2Zy5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDRnLmxhcmdlJyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQW1pVHlwZTogJ0FMMl9BUk1fNjQnLFxuICAgIH0pO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBhbmQgYW1pVHlwZSBhcmUgYm90aCB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIEdQVSBpbnN0YW5jZXMsXG4gICAqIHRoZSBhbWlUeXBlIHNob3VsZCBiZSBpbXBsaWNpdGx5IHNldCBhcyBBTDJfeDg2XzY0X0dQVS5cbiAgICovXG4gIHRlc3QoJ2FtaVR5cGUgc2hvdWxkIGJlIEFMMl94ODZfNjRfR1BVIHdpdGggTGF1bmNoVGVtcGxhdGUgYW5kIGFtaVR5cGUgdW5kZWZpbmVkIGFuZCBpbnN0YW5jZVR5cGVzIGlzIEdQVScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdwMy5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnZzMubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQUwyX3g4Nl82NF9HUFUnLFxuICAgIH0pO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQUwyX3g4Nl82NCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IHg4Nl82NCxcbiAgICogd2Ugc2hvdWxkIHRocm93IGFuIGVycm9yLlxuICAgKi9cbiAgdGVzdCgndGhyb3dzIHdoZW4gTGF1bmNoVGVtcGxhdGUgaXMgdW5kZWZpbmVkLCBhbWlUeXBlIGlzIEFMMl94ODZfNjQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCB4ODZfNjQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyX1g4Nl82NCxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3AzLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdnMy5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mIEFMMl94ODZfNjRfR1BVIG9yIGRvbid0IHNwZWNpZnkgYW55Lyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfQVJNXzY0IGFuZCBpbnN0YW5jZVR5cGVzIGFyZSBub3QgQVJNXzY0LFxuICAgKiB3ZSBzaG91bGQgdGhyb3cgYW4gZXJyb3IuXG4gICAqL1xuICB0ZXN0KCd0aHJvd3Mgd2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQUwyX0FSTV82NCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IEFSTV82NCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5BTDJfQVJNXzY0LFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyksXG4gICAgICBdLFxuICAgIH0pKS50b1Rocm93KC9UaGUgc3BlY2lmaWVkIEFNSSBkb2VzIG5vdCBtYXRjaCB0aGUgaW5zdGFuY2UgdHlwZXMgYXJjaGl0ZWN0dXJlLCBlaXRoZXIgc3BlY2lmeSBvbmUgb2YgQUwyX3g4Nl82NCxCT1RUTEVST0NLRVRfeDg2XzY0IG9yIGRvbid0IHNwZWNpZnkgYW55Lyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfeDg2XzY0X0dQVSBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IEdQVSBpbnN0YW5jZXMsXG4gICAqIHdlIHNob3VsZCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHRlc3QoJ3Rocm93cyB3aGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfWDg2XzY0X0dQVSBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IFg4Nl82NF9HUFUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyX1g4Nl82NF9HUFUsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSkpLnRvVGhyb3coL1RoZSBzcGVjaWZpZWQgQU1JIGRvZXMgbm90IG1hdGNoIHRoZSBpbnN0YW5jZSB0eXBlcyBhcmNoaXRlY3R1cmUsIGVpdGhlciBzcGVjaWZ5IG9uZSBvZiBBTDJfeDg2XzY0LEJPVFRMRVJPQ0tFVF94ODZfNjQgb3IgZG9uJ3Qgc3BlY2lmeSBhbnkvKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdoZW4gTGF1bmNoVGVtcGxhdGUgaXMgZGVmaW5lZCwgYW1pVHlwZSBpcyB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIEdQVSBpbnN0YW5jZXMsXG4gICAqIHdlIHNob3VsZCBkZXBsb3kgY29ycmVjdGx5LlxuICAgKi9cbiAgdGVzdCgnZGVwbG95IGNvcnJlY3RseSB3aXRoIGRlZmluZWQgTGF1bmNoVGVtcGxhdGUgYW5kIGluc3RhbmNlVHlwZXMoR1BVKSBhbmQgYW1pVHlwZSB1bmRlZmluZWQuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIGNvbnN0IG5nID0gbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgncDMubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2czLmxhcmdlJyksXG4gICAgICBdLFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiAnbW9jaycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChuZykubm90LnRvSGF2ZVByb3BlcnR5KCdBbWlUeXBlJyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGlzIGRlZmluZWQsIGFtaVR5cGUgaXMgdW5kZWZpbmVkIGFuZCBpbnN0YW5jZVR5cGVzIGFyZSB4ODZfNjQgaW5zdGFuY2VzLFxuICAgKiB3ZSBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ2RlcGxveSBjb3JyZWN0bHkgd2l0aCBkZWZpbmVkIExhdW5jaFRlbXBsYXRlIGFuZCBpbnN0YW5jZVR5cGVzKHg4Nl82NCkgYW5kIGFtaVR5cGUgdW5kZWZpbmVkLicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBjb25zdCBuZyA9IG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogJ21vY2snLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobmcpLm5vdC50b0hhdmVQcm9wZXJ0eSgnQW1pVHlwZScpO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyBkZWZpbmVkLCBhbWlUeXBlIGlzIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgQVJNXzY0IGluc3RhbmNlcyxcbiAgICogd2Ugc2hvdWxkIGRlcGxveSBjb3JyZWN0bHkuXG4gICAqL1xuICB0ZXN0KCdkZXBsb3kgY29ycmVjdGx5IHdpdGggZGVmaW5lZCBMYXVuY2hUZW1wbGF0ZSBhbmQgaW5zdGFuY2VUeXBlcyhBUk1fNjQpIGFuZCBhbWlUeXBlIHVuZGVmaW5lZC4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgY29uc3QgbmcgPSBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNmcubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3Q0Zy5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogJ21vY2snLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobmcpLm5vdC50b0hhdmVQcm9wZXJ0eSgnQW1pVHlwZScpO1xuICB9KTtcblxuICAvKipcbiAgICogQk9UVExFUk9DS0VUX1g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ0JPVFRMRVJPQ0tFVF9YODZfNjQgd2l0aCBkZWZpbmVkIGluc3RhbmNlIHR5cGVzIHcvbyBsYXVuY2hUZW1wbGF0ZVNwZWMgc2hvdWxkIGRlcGxveSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTVhLnhsYXJnZScpXSxcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX1g4Nl82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEFtaVR5cGU6ICdCT1RUTEVST0NLRVRfeDg2XzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEJPVFRMRVJPQ0tFVF9BUk1fNjQgd2l0aCBkZWZpbmVkIGluc3RhbmNlIHR5cGVzIHcvbyBsYXVuY2hUZW1wbGF0ZVNwZWMgc2hvdWxkIGRlcGxveSBjb3JyZWN0bHkuXG4gICAqL1xuICB0ZXN0KCdCT1RUTEVST0NLRVRfQVJNXzY0IHdpdGggZGVmaW5lZCBpbnN0YW5jZSB0eXBlcyB3L28gbGF1bmNoVGVtcGxhdGVTcGVjIHNob3VsZCBkZXBsb3kgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgICAgLy8gVEhFTlxuICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzZnLnhsYXJnZScpXSxcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX0FSTV82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEFtaVR5cGU6ICdCT1RUTEVST0NLRVRfQVJNXzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXdzLWF1dGggd2lsbCBiZSB1cGRhdGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywgeyBjbHVzdGVyIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdbe1wiYXBpVmVyc2lvblwiOlwidjFcIixcImtpbmRcIjpcIkNvbmZpZ01hcFwiLFwibWV0YWRhdGFcIjp7XCJuYW1lXCI6XCJhd3MtYXV0aFwiLFwibmFtZXNwYWNlXCI6XCJrdWJlLXN5c3RlbVwiLFwibGFiZWxzXCI6e1wiYXdzLmNkay5la3MvcHJ1bmUtYzgyZWNlY2FiZjc3ZTAzZTM1OTBmMmViZTAyYWRiYTg2NDFkMWIzZTc2XCI6XCJcIn19LFwiZGF0YVwiOntcIm1hcFJvbGVzXCI6XCJbe1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDbHVzdGVyTWFzdGVyc1JvbGU5QUEzNTYyNScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTptYXN0ZXJzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX1cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJzeXN0ZW06Ym9vdHN0cmFwcGVyc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZXNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbXVwiLFwibWFwQWNjb3VudHNcIjpcIltdXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgIH0sXG4gICAgICBSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdDbHVzdGVyQ3JlYXRpb25Sb2xlMzYwMjQ5QjYnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFBydW5lTGFiZWw6ICdhd3MuY2RrLmVrcy9wcnVuZS1jODJlY2VjYWJmNzdlMDNlMzU5MGYyZWJlMDJhZGJhODY0MWQxYjNlNzYnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgbm9kZWdyb3VwIGNvcnJlY3RseSB3aXRoIHNlY3VyaXR5IGdyb3VwcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICByZW1vdGVBY2Nlc3M6IHtcbiAgICAgICAgc3NoS2V5TmFtZTogJ2ZvbycsXG4gICAgICAgIHNvdXJjZVNlY3VyaXR5R3JvdXBzOiBbbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYyB9KV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIFJlbW90ZUFjY2Vzczoge1xuICAgICAgICBFYzJTc2hLZXk6ICdmb28nLFxuICAgICAgICBTb3VyY2VTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnU0dBREI1MzkzNycsXG4gICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgd2l0aCBmb3JjZVVwZGF0ZSBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHsgY2x1c3RlciwgZm9yY2VVcGRhdGU6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiBmYWxzZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIGluc3RhbmNlVHlwZXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgJ201LmxhcmdlJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgd2l0aCBvbi1kZW1hbmQgY2FwYWNpdHkgdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyldLFxuICAgICAgY2FwYWNpdHlUeXBlOiBla3MuQ2FwYWNpdHlUeXBlLk9OX0RFTUFORCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgJ201LmxhcmdlJyxcbiAgICAgIF0sXG4gICAgICBDYXBhY2l0eVR5cGU6ICdPTl9ERU1BTkQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgbm9kZWdyb3VwIHdpdGggc3BvdCBjYXBhY2l0eSB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgICBjYXBhY2l0eVR5cGU6IGVrcy5DYXBhY2l0eVR5cGUuU1BPVCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICdtNS5sYXJnZScsXG4gICAgICAgICd0My5sYXJnZScsXG4gICAgICAgICdjNS5sYXJnZScsXG4gICAgICBdLFxuICAgICAgQ2FwYWNpdHlUeXBlOiAnU1BPVCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgd2l0aCBvbi1kZW1hbmQgY2FwYWNpdHkgdHlwZSBhbmQgbXVsdGlwbGUgaW5zdGFuY2UgdHlwZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGNhcGFjaXR5VHlwZTogZWtzLkNhcGFjaXR5VHlwZS5PTl9ERU1BTkQsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAnbTUubGFyZ2UnLFxuICAgICAgICAndDMubGFyZ2UnLFxuICAgICAgICAnYzUubGFyZ2UnLFxuICAgICAgXSxcbiAgICAgIENhcGFjaXR5VHlwZTogJ09OX0RFTUFORCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd0aHJvd3Mgd2hlbiBib3RoIGluc3RhbmNlVHlwZXMgYW5kIGluc3RhbmNlVHlwZSBkZWZpbmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGNhcGFjaXR5VHlwZTogZWtzLkNhcGFjaXR5VHlwZS5TUE9ULFxuICAgIH0pKS50b1Rocm93KC9cImluc3RhbmNlVHlwZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIFwiaW5zdGFuY2VUeXBlc1wiIG9ubHkvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIG5laXRoZXIgaW5zdGFuY2VUeXBlcyBub3IgaW5zdGFuY2VUeXBlIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgY2FwYWNpdHlUeXBlOiBla3MuQ2FwYWNpdHlUeXBlLlNQT1QsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2FwYWNpdHlUeXBlOiAnU1BPVCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGluc3RhbmNlVHlwZXMgcHJvdmlkZWQgd2l0aCBkaWZmZXJlbnQgQ1BVIGFyY2hpdHJjdHVyZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICAvLyBYODZcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNWEubGFyZ2UnKSxcbiAgICAgICAgLy8gQVJNNjRcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvaW5zdGFuY2VUeXBlcyBvZiBkaWZmZXJlbnQgYXJjaGl0ZWN0dXJlcyBpcyBub3QgYWxsb3dlZC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhbWlUeXBlIHByb3ZpZGVkIGlzIGluY29ycmVjdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1YS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzVkLmxhcmdlJyksXG4gICAgICBdLFxuICAgICAgLy8gaW5jb3JyZWN0IGFtaVR5cGVcbiAgICAgIGFtaVR5cGU6IGVrcy5Ob2RlZ3JvdXBBbWlUeXBlLkFMMl9BUk1fNjQsXG4gICAgfSkpLnRvVGhyb3coL1RoZSBzcGVjaWZpZWQgQU1JIGRvZXMgbm90IG1hdGNoIHRoZSBpbnN0YW5jZSB0eXBlcyBhcmNoaXRlY3R1cmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVtb3RlQWNjZXNzIHdpdGhvdXQgc2VjdXJpdHkgZ3JvdXAgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgcmVtb3RlQWNjZXNzOiB7XG4gICAgICAgIHNzaEtleU5hbWU6ICdmb28nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIFJlbW90ZUFjY2Vzczoge1xuICAgICAgICBFYzJTc2hLZXk6ICdmb28nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IG5vZGVncm91cCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrOiBzdGFjazEsIHZwYywgYXBwIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2syJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2sxLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICAvLyBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogdHJ1ZSwgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuICAgIGNvbnN0IG5nID0gbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2sxLCAnTm9kZWdyb3VwJywgeyBjbHVzdGVyIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkID0gZWtzLk5vZGVncm91cC5mcm9tTm9kZWdyb3VwTmFtZShzdGFjazIsICdJbXBvcnRlZE5nJywgbmcubm9kZWdyb3VwTmFtZSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2syLCAnTm9kZWdyb3VwTmFtZScsIHsgdmFsdWU6IGltcG9ydGVkLm5vZGVncm91cE5hbWUgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgTm9kZWdyb3VwTmFtZToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrOkV4cG9ydHNPdXRwdXRSZWZOb2RlZ3JvdXA2MkI0QjJDMUVGOEFCN0MxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTm9kZWdyb3VwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQ2x1c3Rlck5vZGVncm91cG5nTm9kZUdyb3VwUm9sZURBMEQzNURBJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEZvcmNlVXBkYXRlRW5hYmxlZDogdHJ1ZSxcbiAgICAgIFNjYWxpbmdDb25maWc6IHtcbiAgICAgICAgRGVzaXJlZFNpemU6IDIsXG4gICAgICAgIE1heFNpemU6IDIsXG4gICAgICAgIE1pblNpemU6IDEsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbm9kZSBncm91cCB3aXRoIHRhaW50cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIHRhaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgZWZmZWN0OiBla3MuVGFpbnRFZmZlY3QuTk9fU0NIRURVTEUsXG4gICAgICAgICAga2V5OiAnZm9vJyxcbiAgICAgICAgICB2YWx1ZTogJ2JhcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgIH0sXG4gICAgICBUYWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ05PX1NDSEVEVUxFJyxcbiAgICAgICAgICBLZXk6ICdmb28nLFxuICAgICAgICAgIFZhbHVlOiAnYmFyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGRlc2lyZWRTaXplID4gbWF4U2l6ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBkZXNpcmVkU2l6ZTogMywgbWF4U2l6ZTogMiB9KSkudG9UaHJvdygvRGVzaXJlZCBjYXBhY2l0eSAzIGNhbid0IGJlIGdyZWF0ZXIgdGhhbiBtYXggc2l6ZSAyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGRlc2lyZWRTaXplIDwgbWluU2l6ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBkZXNpcmVkU2l6ZTogMiwgbWluU2l6ZTogMyB9KSkudG9UaHJvdygvTWluaW11bSBjYXBhY2l0eSAzIGNhbid0IGJlIGdyZWF0ZXIgdGhhbiBkZXNpcmVkIHNpemUgMi8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc2V0IG1pblNpemUgLCBtYXhTaXplIGFuZCBEZXNpcmVkU2l6ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlR3JvdXAnLCB7XG4gICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgbWluU2l6ZTogMixcbiAgICAgIG1heFNpemU6IDYsXG4gICAgICBkZXNpcmVkU2l6ZTogNCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIE1pblNpemU6IDIsXG4gICAgICAgIE1heFNpemU6IDYsXG4gICAgICAgIERlc2lyZWRTaXplOiA0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsaWRhdGlvbiBpcyBub3QgcGVyZm9ybWVkIHdoZW4gdXNpbmcgVG9rZW5zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVHcm91cCcsIHtcbiAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICBtaW5TaXplOiBjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1IH0pLFxuICAgICAgbWF4U2l6ZTogY2RrLkxhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gMSB9KSxcbiAgICAgIGRlc2lyZWRTaXplOiBjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiAyMCB9KSxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIE1pblNpemU6IDUsXG4gICAgICAgIE1heFNpemU6IDEsXG4gICAgICAgIERlc2lyZWRTaXplOiAyMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgY29ycmVjdGx5IHdpdGggbGF1bmNoIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgIH0pO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvckxpbnV4KCk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICBgL2V0Yy9la3MvYm9vdHN0cmFwLnNoICR7Y2x1c3Rlci5jbHVzdGVyTmFtZX1gLFxuICAgICk7XG4gICAgY29uc3QgbHQgPSBuZXcgZWMyLkNmbkxhdW5jaFRlbXBsYXRlKHN0YWNrLCAnTGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgaW1hZ2VJZDogbmV3IGVrcy5Fa3NPcHRpbWl6ZWRJbWFnZSgpLmdldEltYWdlKHN0YWNrKS5pbWFnZUlkLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5zbWFsbCcpLnRvU3RyaW5nKCksXG4gICAgICAgIHVzZXJEYXRhOiBjZGsuRm4uYmFzZTY0KHVzZXJEYXRhLnJlbmRlcigpKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmctbHQnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZVNwZWM6IHtcbiAgICAgICAgaWQ6IGx0LnJlZixcbiAgICAgICAgdmVyc2lvbjogbHQuYXR0ckRlZmF1bHRWZXJzaW9uTnVtYmVyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlOiB7XG4gICAgICAgIElkOiB7XG4gICAgICAgICAgUmVmOiAnTGF1bmNoVGVtcGxhdGUnLFxuICAgICAgICB9LFxuICAgICAgICBWZXJzaW9uOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTGF1bmNoVGVtcGxhdGUnLFxuICAgICAgICAgICAgJ0RlZmF1bHRWZXJzaW9uTnVtYmVyJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gYm90aCBkaXNrU2l6ZSBhbmQgbGF1bmNoIHRlbXBsYXRlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKFxuICAgICAgJ3NldCAtbyB4dHJhY2UnLFxuICAgICAgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAke2NsdXN0ZXIuY2x1c3Rlck5hbWV9YCxcbiAgICApO1xuICAgIGNvbnN0IGx0ID0gbmV3IGVjMi5DZm5MYXVuY2hUZW1wbGF0ZShzdGFjaywgJ0xhdW5jaFRlbXBsYXRlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIGltYWdlSWQ6IG5ldyBla3MuRWtzT3B0aW1pemVkSW1hZ2UoKS5nZXRJbWFnZShzdGFjaykuaW1hZ2VJZCxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDMuc21hbGwnKS50b1N0cmluZygpLFxuICAgICAgICB1c2VyRGF0YTogY2RrLkZuLmJhc2U2NCh1c2VyRGF0YS5yZW5kZXIoKSksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT5cbiAgICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nLWx0Jywge1xuICAgICAgICBkaXNrU2l6ZTogMTAwLFxuICAgICAgICBsYXVuY2hUZW1wbGF0ZVNwZWM6IHtcbiAgICAgICAgICBpZDogbHQucmVmLFxuICAgICAgICAgIHZlcnNpb246IGx0LmF0dHJEZWZhdWx0VmVyc2lvbk51bWJlcixcbiAgICAgICAgfSxcbiAgICAgIH0pKS50b1Rocm93KC9kaXNrU2l6ZSBtdXN0IGJlIHNwZWNpZmllZCB3aXRoaW4gdGhlIGxhdW5jaCB0ZW1wbGF0ZS8pO1xuICB9KTtcbn0pO1xuIl19