"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const assertions_1 = require("aws-cdk-lib/assertions");
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib/core");
const cxapi = require("aws-cdk-lib/cx-api");
const util_1 = require("./util");
const eks = require("../lib");
const lib_1 = require("../lib");
const nodegroup_1 = require("../lib/private/nodegroup");
const CLUSTER_VERSION = eks.KubernetesVersion.V1_31;
const commonProps = {
    version: CLUSTER_VERSION,
    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
    defaultCapacity: 0,
};
describe('node group', () => {
    test('default ami type is not applied when launch template is configured', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.MEDIUM).toString(),
            },
        });
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
            launchTemplateData: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.MEDIUM).toString(),
            },
        });
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', { cluster });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
    test('create a x86_64 AL2023 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.AL2023_X86_64_STANDARD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'AL2023_x86_64_STANDARD',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
        });
    });
    test('create a ARM64 AL2023 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.AL2023_ARM_64_STANDARD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'AL2023_ARM_64_STANDARD',
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_ARM_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
    test('create a x86_64 Windows Core 2019 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.WINDOWS_CORE_2019_X86_64,
            taints: [
                {
                    effect: lib_1.TaintEffect.NO_SCHEDULE,
                    key: 'os',
                    value: 'windows',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'WINDOWS_CORE_2019_x86_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
            Taints: [
                {
                    Effect: 'NO_SCHEDULE',
                    Key: 'os',
                    Value: 'windows',
                },
            ],
        });
    });
    test('create a x86_64 Windows Core 2022 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.WINDOWS_CORE_2022_X86_64,
            taints: [
                {
                    effect: lib_1.TaintEffect.NO_SCHEDULE,
                    key: 'os',
                    value: 'windows',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'WINDOWS_CORE_2022_x86_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
            Taints: [
                {
                    Effect: 'NO_SCHEDULE',
                    Key: 'os',
                    Value: 'windows',
                },
            ],
        });
    });
    test('create a x86_64 Windows Full 2019 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.WINDOWS_FULL_2019_X86_64,
            taints: [
                {
                    effect: lib_1.TaintEffect.NO_SCHEDULE,
                    key: 'os',
                    value: 'windows',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'WINDOWS_FULL_2019_x86_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
            Taints: [
                {
                    Effect: 'NO_SCHEDULE',
                    Key: 'os',
                    Value: 'windows',
                },
            ],
        });
    });
    test('create a x86_64 Windows Full 2022 nodegroup correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            amiType: lib_1.NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
            taints: [
                {
                    effect: lib_1.TaintEffect.NO_SCHEDULE,
                    key: 'os',
                    value: 'windows',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
            AmiType: 'WINDOWS_FULL_2022_x86_64',
            ForceUpdateEnabled: true,
            ScalingConfig: {
                DesiredSize: 2,
                MaxSize: 2,
                MinSize: 1,
            },
            Taints: [
                {
                    Effect: 'NO_SCHEDULE',
                    Key: 'os',
                    Value: 'windows',
                },
            ],
        });
    });
    /**
     * When LaunchTemplate and amiType are undefined and instanceTypes are x86_64 instances,
     * the amiType should be implicitly set as AL2_x86_64.
     */
    test('amiType should be AL2_x86_64 with LaunchTemplate and amiType undefined and instanceTypes is x86_64', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_X86_64,
            instanceTypes: [
                new ec2.InstanceType('p3.large'),
                new ec2.InstanceType('g3.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64_GPU, AL2023_X86_64_NEURON, AL2023_X86_64_NVIDIA, AL2023_ARM_64_NVIDIA, BOTTLEROCKET_X86_64_NVIDIA, BOTTLEROCKET_ARM_64_NVIDIA or don't specify any/);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2023_X86_64_STANDARD and instanceTypes are not x86_64,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2023_X86_64_STANDARD and instanceTypes are not x86_64', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2023_X86_64_STANDARD,
            instanceTypes: [
                new ec2.InstanceType('c6g.large'),
                new ec2.InstanceType('t4g.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_ARM_64, AL2023_ARM_64_STANDARD, BOTTLEROCKET_ARM_64 or don't specify any/);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2023_ARM_64_STANDARD and instanceTypes are not ARM_64,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2023_ARM_64_STANDARD and instanceTypes are not ARM_64', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2023_ARM_64_STANDARD,
            instanceTypes: [
                new ec2.InstanceType('m5.large'),
                new ec2.InstanceType('c5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64, AL2023_X86_64_STANDARD, BOTTLEROCKET_X86_64, WINDOWS_CORE_2019_X86_64, WINDOWS_CORE_2022_X86_64, WINDOWS_FULL_2019_X86_64, WINDOWS_FULL_2022_X86_64 or don't specify any/);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2_ARM_64 and instanceTypes are not ARM_64,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2_ARM_64 and instanceTypes are not ARM_64', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_ARM_64,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64, AL2023_X86_64_STANDARD, BOTTLEROCKET_X86_64, WINDOWS_CORE_2019_X86_64, WINDOWS_CORE_2022_X86_64, WINDOWS_FULL_2019_X86_64, WINDOWS_FULL_2022_X86_64 or don't specify any/);
    });
    test('throws when AmiType is Windows and forbidden instanceType is selected', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
            instanceTypes: [
                new ec2.InstanceType('c3.large'),
            ],
        })).toThrow(/The specified instanceType does not support Windows workloads. Amazon EC2 instance types C3, C4, D2, I2, M4 \(excluding m4.16xlarge\), M6a.x, and R3 instances aren't supported for Windows workloads./);
    });
    /**
     * When LaunchTemplate is undefined, amiType is AL2_x86_64_GPU and instanceTypes are not GPU instances,
     * we should throw an error.
     */
    test('throws when LaunchTemplate is undefined, amiType is AL2_X86_64_GPU and instanceTypes are not X86_64_GPU', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.AL2_X86_64_GPU,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64, AL2023_X86_64_STANDARD, BOTTLEROCKET_X86_64, WINDOWS_CORE_2019_X86_64, WINDOWS_CORE_2022_X86_64, WINDOWS_FULL_2019_X86_64, WINDOWS_FULL_2022_X86_64 or don't specify any/);
    });
    test('throws when LaunchTemplate is undefined, amiType is BOTTLEROCKET_ARM_64_NVIDIA and instanceTypes are not GPU', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_ARM_64_NVIDIA,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64, AL2023_X86_64_STANDARD, BOTTLEROCKET_X86_64, WINDOWS_CORE_2019_X86_64, WINDOWS_CORE_2022_X86_64, WINDOWS_FULL_2019_X86_64, WINDOWS_FULL_2022_X86_64 or don't specify any/);
    });
    test('throws when LaunchTemplate is undefined, amiType is BOTTLEROCKET_X86_64_NVIDIA and instanceTypes are not GPU', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', {
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_X86_64_NVIDIA,
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('m5.large'),
            ],
        })).toThrow(/The specified AMI does not match the instance types architecture, either specify one of AL2_X86_64, AL2023_X86_64_STANDARD, BOTTLEROCKET_X86_64, WINDOWS_CORE_2019_X86_64, WINDOWS_CORE_2022_X86_64, WINDOWS_FULL_2019_X86_64, WINDOWS_FULL_2022_X86_64 or don't specify any/);
    });
    /**
     * When LaunchTemplate is defined, amiType is undefined and instanceTypes are GPU instances,
     * we should deploy correctly.
     */
    test('deploy correctly with defined LaunchTemplate and instanceTypes(GPU) and amiType undefined.', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
    /**
     * WINDOWS_CORE_2019_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('WINDOWS_CORE_2019_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        cluster.addNodegroupCapacity('windows', {
            instanceTypes: [new ec2.InstanceType('m5a.xlarge')],
            amiType: lib_1.NodegroupAmiType.WINDOWS_CORE_2019_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'WINDOWS_CORE_2019_x86_64',
        });
    });
    /**
     * WINDOWS_CORE_2022_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('WINDOWS_CORE_2019_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        cluster.addNodegroupCapacity('windows', {
            instanceTypes: [new ec2.InstanceType('m5a.xlarge')],
            amiType: lib_1.NodegroupAmiType.WINDOWS_CORE_2022_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'WINDOWS_CORE_2022_x86_64',
        });
    });
    /**
     * WINDOWS_FULL_2019_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('WINDOWS_FULL_2019_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        cluster.addNodegroupCapacity('windows', {
            instanceTypes: [new ec2.InstanceType('m5a.xlarge')],
            amiType: lib_1.NodegroupAmiType.WINDOWS_FULL_2019_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'WINDOWS_FULL_2019_x86_64',
        });
    });
    /**
     * WINDOWS_FULL_2022_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly.
     */
    test('WINDOWS_FULL_2022_x86_64 with defined instance types w/o launchTemplateSpec should deploy correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        cluster.addNodegroupCapacity('windows', {
            instanceTypes: [new ec2.InstanceType('m5a.xlarge')],
            amiType: lib_1.NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            AmiType: 'WINDOWS_FULL_2022_x86_64',
        });
    });
    test('create nodegroup correctly with security groups provided', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
    test('create nodegroup correctly with enableNodeAutoRepair provided', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            enableNodeAutoRepair: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            NodeRepairConfig: {
                Enabled: true,
            },
        });
    });
    test('create nodegroup with forceUpdate disabled', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', { cluster, forceUpdate: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ForceUpdateEnabled: false,
        });
    });
    test('create nodegroup with instanceTypes provided', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
    (0, cdk_build_tools_1.testDeprecated)('throws when both instanceTypes and instanceType defined', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            version: CLUSTER_VERSION,
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack: stack1, vpc, app } = (0, util_1.testFixture)();
        const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
        const cluster = new eks.Cluster(stack1, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // WHEN
        cluster.addNodegroupCapacity('ng');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            ClusterName: {
                Ref: 'ClusterEB0386A7',
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
                Ref: 'ClusterEB0386A7',
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { desiredSize: 3, maxSize: 2 })).toThrow(/Desired capacity 3 can't be greater than max size 2/);
    });
    test('throws when desiredSize < minSize', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { desiredSize: 2, minSize: 3 })).toThrow(/Minimum capacity 3 can't be greater than desired size 2/);
    });
    test('can set minSize , maxSize and DesiredSize', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
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
    test('create updateConfig for maxUnavailable correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            maxUnavailable: 3,
            maxSize: 5,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            UpdateConfig: {
                MaxUnavailable: 3,
            },
        });
    });
    test('create updateConfig for maxUnavailablePercentage correctly', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        // WHEN
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        new eks.Nodegroup(stack, 'Nodegroup', {
            cluster,
            maxUnavailablePercentage: 33,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
            UpdateConfig: {
                MaxUnavailablePercentage: 33,
            },
        });
    });
    test('EKS_NODEGROUP_NAME feature flag should return correct nodegroupName', () => {
        // GIVEN
        const app = new cdk.App();
        const stackWithFlag = new cdk.Stack(app, 'StackWithFlag', {
            env: { account: '1234', region: 'testregion' },
        });
        // WHEN
        stackWithFlag.node.setContext(cxapi.EKS_NODEGROUP_NAME, true);
        const cluster = new eks.Cluster(stackWithFlag, 'Cluster', {
            ...commonProps,
        });
        const ng = new eks.Nodegroup(stackWithFlag, 'Nodegroup', {
            cluster,
        });
        // THEN
        expect(ng.nodegroupName).not.toEqual(ng.node.defaultChild.ref);
    });
    test('throws when maxUnavailable and maxUnavailablePercentage are set', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailable: 3, maxUnavailablePercentage: 2 })).toThrow(/maxUnavailable and maxUnavailablePercentage are not allowed to be defined together/);
    });
    test('throws when maxUnavailable is greater than maxSize', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailable: 5, maxSize: 4 })).toThrow(/maxUnavailable must be lower than maxSize/);
    });
    test('throws when maxUnavailable is less than 1', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailable: -3, maxSize: 10 })).toThrow(/maxUnavailable must be between 1 and 100/);
    });
    test('throws when maxUnavailable is greater than 100', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailable: 101, maxSize: 200 })).toThrow(/maxUnavailable must be between 1 and 100/);
    });
    test('throws when maxUnavailablePercentage is less than 1', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailablePercentage: -3, maxSize: 10 })).toThrow(/maxUnavailablePercentage must be between 1 and 100/);
    });
    test('throws when maxUnavailablePercentage is greater than 100', () => {
        // GIVEN
        const { stack, vpc } = (0, util_1.testFixture)();
        const cluster = new eks.Cluster(stack, 'Cluster', {
            vpc,
            ...commonProps,
        });
        // THEN
        expect(() => cluster.addNodegroupCapacity('ng', { maxUnavailablePercentage: 101 })).toThrow(/maxUnavailablePercentage must be between 1 and 100/);
    });
});
describe('isGpuInstanceType', () => {
    it('should return true for known GPU instance types', () => {
        const gpuInstanceTypes = [
            ec2.InstanceType.of(ec2.InstanceClass.P2, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G3, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.P4D, ec2.InstanceSize.LARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.MEDIUM),
            ec2.InstanceType.of(ec2.InstanceClass.G6E, ec2.InstanceSize.XLARGE2),
            ec2.InstanceType.of(ec2.InstanceClass.INF1, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.INF2, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.P3DN, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.P4DE, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G4AD, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G4DN, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G3S, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G5, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G5G, ec2.InstanceSize.XLARGE),
        ];
        gpuInstanceTypes.forEach(instanceType => {
            expect((0, nodegroup_1.isGpuInstanceType)(instanceType)).toBe(true);
        });
    });
    it('should return false for non-GPU instance types', () => {
        const nonGpuInstanceTypes = [
            ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
            ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE),
        ];
        nonGpuInstanceTypes.forEach(instanceType => {
            expect((0, nodegroup_1.isGpuInstanceType)(instanceType)).toBe(false);
        });
    });
    it('should return true for different sizes of GPU instance types', () => {
        const gpuInstanceTypes = [
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.XLARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.XLARGE16),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.XLARGE48),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.LARGE),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.MEDIUM),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.SMALL),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.NANO),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.MICRO),
            ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.METAL),
        ];
        gpuInstanceTypes.forEach(instanceType => {
            expect((0, nodegroup_1.isGpuInstanceType)(instanceType)).toBe(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUEwRDtBQUMxRCx1REFBa0Q7QUFDbEQsMkNBQTJDO0FBRTNDLHdDQUF3QztBQUN4Qyw0Q0FBNEM7QUFDNUMsaUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixnQ0FBdUQ7QUFDdkQsd0RBQTZEO0FBRTdELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7QUFFcEQsTUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFLGVBQWU7SUFDeEIsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7SUFDdEQsZUFBZSxFQUFFLENBQUM7Q0FDbkIsQ0FBQztBQUVGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7UUFDOUUsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQ3hFLGtCQUFrQixFQUFFO2dCQUNsQixZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUU7YUFDNUY7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxhQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xGLGtCQUFrQixFQUFFO2dCQUNsQixFQUFFLEVBQUUsY0FBYyxDQUFDLEdBQUc7Z0JBQ3RCLE9BQU8sRUFBRSxjQUFjLENBQUMsdUJBQXVCO2FBQ2hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBZSxDQUFDO1FBQ3hDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFO2FBQzVGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVO1lBQ3hDLGtCQUFrQixFQUFFO2dCQUNsQixFQUFFLEVBQUUsY0FBYyxDQUFDLEdBQUc7Z0JBQ3RCLE9BQU8sRUFBRSxjQUFjLENBQUMsdUJBQXVCO2FBQ2hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBZSxDQUFDO1FBQ3hDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RHLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtRQUN6RSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxPQUFPLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWM7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLGlCQUFpQjthQUN2QjtZQUNELFFBQVEsRUFBRTtnQkFDUixZQUFZLEVBQUU7b0JBQ1osZ0NBQWdDO29CQUNoQyxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7YUFDRjtZQUNELGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLHNCQUFzQjtTQUNqRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLHNCQUFzQjtTQUNqRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLG1CQUFtQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUscUJBQXFCO1lBQzlCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLG1CQUFtQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUscUJBQXFCO1lBQzlCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLHdCQUF3QjtZQUNsRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLGlCQUFXLENBQUMsV0FBVztvQkFDL0IsR0FBRyxFQUFFLElBQUk7b0JBQ1QsS0FBSyxFQUFFLFNBQVM7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFDRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLEdBQUcsRUFBRSxJQUFJO29CQUNULEtBQUssRUFBRSxTQUFTO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQ2pFLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTztZQUNQLE9BQU8sRUFBRSxzQkFBZ0IsQ0FBQyx3QkFBd0I7WUFDbEQsTUFBTSxFQUFFO2dCQUNOO29CQUNFLE1BQU0sRUFBRSxpQkFBVyxDQUFDLFdBQVc7b0JBQy9CLEdBQUcsRUFBRSxJQUFJO29CQUNULEtBQUssRUFBRSxTQUFTO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFdBQVcsRUFBRTtnQkFDWCxHQUFHLEVBQUUsaUJBQWlCO2FBQ3ZCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFlBQVksRUFBRTtvQkFDWixnQ0FBZ0M7b0JBQ2hDLEtBQUs7aUJBQ047YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxHQUFHLEVBQUUsaUNBQWlDO2lCQUN2QztnQkFDRDtvQkFDRSxHQUFHLEVBQUUsaUNBQWlDO2lCQUN2QzthQUNGO1lBQ0QsT0FBTyxFQUFFLDBCQUEwQjtZQUNuQyxrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLGFBQWEsRUFBRTtnQkFDYixXQUFXLEVBQUUsQ0FBQztnQkFDZCxPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQ0QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLE1BQU0sRUFBRSxhQUFhO29CQUNyQixHQUFHLEVBQUUsSUFBSTtvQkFDVCxLQUFLLEVBQUUsU0FBUztpQkFDakI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtRQUNqRSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxPQUFPLEVBQUUsc0JBQWdCLENBQUMsd0JBQXdCO1lBQ2xELE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxNQUFNLEVBQUUsaUJBQVcsQ0FBQyxXQUFXO29CQUMvQixHQUFHLEVBQUUsSUFBSTtvQkFDVCxLQUFLLEVBQUUsU0FBUztpQkFDakI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLGlCQUFpQjthQUN2QjtZQUNELFFBQVEsRUFBRTtnQkFDUixZQUFZLEVBQUU7b0JBQ1osZ0NBQWdDO29CQUNoQyxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7YUFDRjtZQUNELE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixhQUFhLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxNQUFNLEVBQUUsYUFBYTtvQkFDckIsR0FBRyxFQUFFLElBQUk7b0JBQ1QsS0FBSyxFQUFFLFNBQVM7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsT0FBTyxFQUFFLHNCQUFnQixDQUFDLHdCQUF3QjtZQUNsRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLGlCQUFXLENBQUMsV0FBVztvQkFDL0IsR0FBRyxFQUFFLElBQUk7b0JBQ1QsS0FBSyxFQUFFLFNBQVM7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSxpQkFBaUI7YUFDdkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFDRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLEdBQUcsRUFBRSxJQUFJO29CQUNULEtBQUssRUFBRSxTQUFTO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSDs7O09BR0c7SUFDSCxJQUFJLENBQUMsb0dBQW9HLEVBQUUsR0FBRyxFQUFFO1FBQzlHLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTztZQUNQLGFBQWEsRUFBRTtnQkFDYixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2FBQ2pDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLE9BQU8sRUFBRSxZQUFZO1NBQ3RCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLG9HQUFvRyxFQUFFLEdBQUcsRUFBRTtRQUM5RyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDakMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQzthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxPQUFPLEVBQUUsWUFBWTtTQUN0QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVIOzs7T0FHRztJQUNILElBQUksQ0FBQyxxR0FBcUcsRUFBRSxHQUFHLEVBQUU7UUFDL0csUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7YUFDakM7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsT0FBTyxFQUFFLGdCQUFnQjtTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVIOzs7T0FHRztJQUNILElBQUksQ0FBQyxpR0FBaUcsRUFBRSxHQUFHLEVBQUU7UUFDM0csUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUUsc0JBQWdCLENBQUMsVUFBVTtZQUNwQyxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzthQUNqQztTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1UEFBdVAsQ0FBQyxDQUFDO0lBQ3ZRLENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLDZHQUE2RyxFQUFFLEdBQUcsRUFBRTtRQUN2SCxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO1lBQzlDLE9BQU8sRUFBRSxzQkFBZ0IsQ0FBQyxzQkFBc0I7WUFDaEQsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7YUFDbEM7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0tBQXNLLENBQUMsQ0FBQztJQUN0TCxDQUFDLENBQUMsQ0FBQztJQUVIOzs7T0FHRztJQUNILElBQUksQ0FBQyw2R0FBNkcsRUFBRSxHQUFHLEVBQUU7UUFDdkgsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUUsc0JBQWdCLENBQUMsc0JBQXNCO1lBQ2hELGFBQWEsRUFBRTtnQkFDYixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2FBQ2pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhRQUE4USxDQUFDLENBQUM7SUFDOVIsQ0FBQyxDQUFDLENBQUM7SUFFSDs7O09BR0c7SUFDSCxJQUFJLENBQUMsaUdBQWlHLEVBQUUsR0FBRyxFQUFFO1FBQzNHLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsT0FBTyxFQUFFLHNCQUFnQixDQUFDLFVBQVU7WUFDcEMsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7YUFDakM7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsOFFBQThRLENBQUMsQ0FBQztJQUM5UixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDakYsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUUsc0JBQWdCLENBQUMsd0JBQXdCO1lBQ2xELGFBQWEsRUFBRTtnQkFDYixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2FBQ2pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdNQUF3TSxDQUFDLENBQUM7SUFDeE4sQ0FBQyxDQUFDLENBQUM7SUFFSDs7O09BR0c7SUFDSCxJQUFJLENBQUMseUdBQXlHLEVBQUUsR0FBRyxFQUFFO1FBQ25ILFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsT0FBTyxFQUFFLHNCQUFnQixDQUFDLGNBQWM7WUFDeEMsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7YUFDakM7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsOFFBQThRLENBQUMsQ0FBQztJQUM5UixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4R0FBOEcsRUFBRSxHQUFHLEVBQUU7UUFDeEgsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUUsc0JBQWdCLENBQUMsMEJBQTBCO1lBQ3BELGFBQWEsRUFBRTtnQkFDYixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2FBQ2pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhRQUE4USxDQUFDLENBQUM7SUFDOVIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOEdBQThHLEVBQUUsR0FBRyxFQUFFO1FBQ3hILFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsT0FBTyxFQUFFLHNCQUFnQixDQUFDLDBCQUEwQjtZQUNwRCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzthQUNqQztTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4UUFBOFEsQ0FBQyxDQUFDO0lBQzlSLENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLDRGQUE0RixFQUFFLEdBQUcsRUFBRTtRQUN0RyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQy9DLE9BQU87WUFDUCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzthQUNqQztZQUNELGtCQUFrQixFQUFFO2dCQUNsQixFQUFFLEVBQUUsTUFBTTthQUNYO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLCtGQUErRixFQUFFLEdBQUcsRUFBRTtRQUN6RyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQy9DLE9BQU87WUFDUCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzthQUNqQztZQUNELGtCQUFrQixFQUFFO2dCQUNsQixFQUFFLEVBQUUsTUFBTTthQUNYO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLCtGQUErRixFQUFFLEdBQUcsRUFBRTtRQUN6RyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQy9DLE9BQU87WUFDUCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDakMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQzthQUNsQztZQUNELGtCQUFrQixFQUFFO2dCQUNsQixFQUFFLEVBQUUsTUFBTTthQUNYO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUg7O09BRUc7SUFDSCxJQUFJLENBQUMsZ0dBQWdHLEVBQUUsR0FBRyxFQUFFO1FBQzFHLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRTtZQUMzQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbkQsT0FBTyxFQUFFLHNCQUFnQixDQUFDLG1CQUFtQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsT0FBTyxFQUFFLHFCQUFxQjtTQUMvQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVIOztPQUVHO0lBQ0gsSUFBSSxDQUFDLGdHQUFnRyxFQUFFLEdBQUcsRUFBRTtRQUMxRyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0QsT0FBTztRQUNULE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUU7WUFDM0MsYUFBYSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25ELE9BQU8sRUFBRSxzQkFBZ0IsQ0FBQyxtQkFBbUI7U0FDOUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLE9BQU8sRUFBRSxxQkFBcUI7U0FDL0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILElBQUksQ0FBQyxxR0FBcUcsRUFBRSxHQUFHLEVBQUU7UUFDL0csUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFO1lBQ3RDLGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRCxPQUFPLEVBQUUsc0JBQWdCLENBQUMsd0JBQXdCO1NBQ25ELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUg7O09BRUc7SUFDSCxJQUFJLENBQUMscUdBQXFHLEVBQUUsR0FBRyxFQUFFO1FBQy9HLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRTtZQUN0QyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbkQsT0FBTyxFQUFFLHNCQUFnQixDQUFDLHdCQUF3QjtTQUNuRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsT0FBTyxFQUFFLDBCQUEwQjtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVIOztPQUVHO0lBQ0gsSUFBSSxDQUFDLHFHQUFxRyxFQUFFLEdBQUcsRUFBRTtRQUMvRyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUU7WUFDdEMsYUFBYSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25ELE9BQU8sRUFBRSxzQkFBZ0IsQ0FBQyx3QkFBd0I7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLE9BQU8sRUFBRSwwQkFBMEI7U0FDcEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILElBQUksQ0FBQyxxR0FBcUcsRUFBRSxHQUFHLEVBQUU7UUFDL0csUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFO1lBQ3RDLGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRCxPQUFPLEVBQUUsc0JBQWdCLENBQUMsd0JBQXdCO1NBQ25ELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxZQUFZLEVBQUU7Z0JBQ1osVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLG9CQUFvQixFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ3BFO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFlBQVksRUFBRTtnQkFDWixTQUFTLEVBQUUsS0FBSztnQkFDaEIsb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLFlBQVksRUFBRTs0QkFDWixZQUFZOzRCQUNaLFNBQVM7eUJBQ1Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtRQUN6RSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxvQkFBb0IsRUFBRSxJQUFJO1NBQzNCLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxnQkFBZ0IsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUN0RCxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXZFLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxrQkFBa0IsRUFBRSxLQUFLO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxhQUFhLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbEQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLGFBQWEsRUFBRTtnQkFDYixVQUFVO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsYUFBYSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLGFBQWEsRUFBRTtnQkFDYixVQUFVO2FBQ1g7WUFDRCxZQUFZLEVBQUUsV0FBVztTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7YUFDakM7WUFDRCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJO1NBQ3BDLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxhQUFhLEVBQUU7Z0JBQ2IsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFVBQVU7YUFDWDtZQUNELFlBQVksRUFBRSxNQUFNO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJFQUEyRSxFQUFFLEdBQUcsRUFBRTtRQUNyRixRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzthQUNqQztZQUNELFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVM7U0FDekMsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLGFBQWEsRUFBRTtnQkFDYixVQUFVO2dCQUNWLFVBQVU7Z0JBQ1YsVUFBVTthQUNYO1lBQ0QsWUFBWSxFQUFFLFdBQVc7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFBLGdDQUFjLEVBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQzdFLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO1lBQzlDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQzlDLGFBQWEsRUFBRTtnQkFDYixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2FBQ2pDO1lBQ0QsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSTtTQUNwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsOERBQThELENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLEVBQUU7UUFDaEYsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxPQUFPLEVBQUUsZUFBZTtZQUN4QixtQkFBbUIsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUztTQUN2RCxDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSTtTQUNwQyxDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1FBQzlFLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsYUFBYSxFQUFFO2dCQUNiLE1BQU07Z0JBQ04sSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDakMsUUFBUTtnQkFDUixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7YUFDbEM7WUFDRCxvQkFBb0I7WUFDcEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVO1NBQ3pDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCxZQUFZLEVBQUU7Z0JBQ1osVUFBVSxFQUFFLEtBQUs7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsWUFBWSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO1lBQ2pELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1Asd0dBQXdHO1FBQ3hHLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBRTlFLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDekMsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRTtvQkFDYixLQUFLLEVBQUU7d0JBQ0wsaUJBQWlCLEVBQUUsaURBQWlEO3FCQUNyRTtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5DLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLGlCQUFpQjthQUN2QjtZQUNELFFBQVEsRUFBRTtnQkFDUixZQUFZLEVBQUU7b0JBQ1oseUNBQXlDO29CQUN6QyxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztpQkFDdkM7YUFDRjtZQUNELGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO1lBQ2pDLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXO29CQUNuQyxHQUFHLEVBQUUsS0FBSztvQkFDVixLQUFLLEVBQUUsS0FBSztpQkFDYjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFdBQVcsRUFBRTtnQkFDWCxHQUFHLEVBQUUsaUJBQWlCO2FBQ3ZCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLE1BQU0sRUFBRSxhQUFhO29CQUNyQixHQUFHLEVBQUUsS0FBSztvQkFDVixLQUFLLEVBQUUsS0FBSztpQkFDYjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7SUFDbEosQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7SUFDdEosQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBQztZQUNWLFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsQ0FBQztnQkFDVixXQUFXLEVBQUUsQ0FBQzthQUNmO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1FBQ3pELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QyxXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsQ0FBQztnQkFDVixXQUFXLEVBQUUsRUFBRTthQUNoQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDekMsUUFBUSxDQUFDLFdBQVcsQ0FDbEIsZUFBZSxFQUNmLHlCQUF5QixPQUFPLENBQUMsV0FBVyxFQUFFLENBQy9DLENBQUM7UUFDRixNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDNUQsa0JBQWtCLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPO2dCQUM1RCxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDekQsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUMzQztTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUU7WUFDcEMsa0JBQWtCLEVBQUU7Z0JBQ2xCLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRztnQkFDVixPQUFPLEVBQUUsRUFBRSxDQUFDLHdCQUF3QjthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxjQUFjLEVBQUU7Z0JBQ2QsRUFBRSxFQUFFO29CQUNGLEdBQUcsRUFBRSxnQkFBZ0I7aUJBQ3RCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxZQUFZLEVBQUU7d0JBQ1osZ0JBQWdCO3dCQUNoQixzQkFBc0I7cUJBQ3ZCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxXQUFXLENBQ2xCLGVBQWUsRUFDZix5QkFBeUIsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUMvQyxDQUFDO1FBQ0YsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVELGtCQUFrQixFQUFFO2dCQUNsQixPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTztnQkFDNUQsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pELFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDM0M7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNWLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUU7WUFDcEMsUUFBUSxFQUFFLEdBQUc7WUFDYixrQkFBa0IsRUFBRTtnQkFDbEIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHO2dCQUNWLE9BQU8sRUFBRSxFQUFFLENBQUMsd0JBQXdCO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDcEMsT0FBTztZQUNQLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFlBQVksRUFBRTtnQkFDWixjQUFjLEVBQUUsQ0FBQzthQUNsQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtRQUN0RSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3BDLE9BQU87WUFDUCx3QkFBd0IsRUFBRSxFQUFFO1NBQzdCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRTtZQUNyRSxZQUFZLEVBQUU7Z0JBQ1osd0JBQXdCLEVBQUUsRUFBRTthQUM3QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtRQUMvRSxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7WUFDeEQsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFO1NBQy9DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUU7WUFDeEQsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUU7WUFDdkQsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUE2QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25GLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlFQUFpRSxFQUFFLEdBQUcsRUFBRTtRQUMzRSxRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGtCQUFXLEdBQUUsQ0FBQztRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNoRCxHQUFHO1lBQ0gsR0FBRyxXQUFXO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSx3QkFBd0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9GQUFvRixDQUFDLENBQUM7SUFDck0sQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzlELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDM0ksQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUM1SSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUM5SSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDaEQsR0FBRztZQUNILEdBQUcsV0FBVztTQUNmLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDaEssQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsa0JBQVcsR0FBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2hELEdBQUc7WUFDSCxHQUFHLFdBQVc7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDcEosQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUN6RCxNQUFNLGdCQUFnQixHQUFHO1lBQ3ZCLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ25FLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQ3BFLENBQUM7UUFDRixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEMsTUFBTSxDQUFDLElBQUEsNkJBQWlCLEVBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDeEQsTUFBTSxtQkFBbUIsR0FBRztZQUMxQixHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUNqRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUNqRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztTQUNuRSxDQUFDO1FBQ0YsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxJQUFBLDZCQUFpQixFQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3RFLE1BQU0sZ0JBQWdCLEdBQUc7WUFDdkIsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDbEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7WUFDcEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7WUFDcEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDakUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDbEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDakUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFDaEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDakUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7U0FDbEUsQ0FBQztRQUNGLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN0QyxNQUFNLENBQUMsSUFBQSw2QkFBaUIsRUFBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ2ZuTm9kZWdyb3VwIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBOb2RlZ3JvdXBBbWlUeXBlLCBUYWludEVmZmVjdCB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBpc0dwdUluc3RhbmNlVHlwZSB9IGZyb20gJy4uL2xpYi9wcml2YXRlL25vZGVncm91cCc7XG5cbmNvbnN0IENMVVNURVJfVkVSU0lPTiA9IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMTtcblxuY29uc3QgY29tbW9uUHJvcHMgPSB7XG4gIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxuICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG59O1xuXG5kZXNjcmliZSgnbm9kZSBncm91cCcsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBhbWkgdHlwZSBpcyBub3QgYXBwbGllZCB3aGVuIGxhdW5jaCB0ZW1wbGF0ZSBpcyBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgY29uc3QgbGF1bmNoVGVtcGxhdGUgPSBuZXcgZWMyLkNmbkxhdW5jaFRlbXBsYXRlKHN0YWNrLCAnTGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkM1LCBlYzIuSW5zdGFuY2VTaXplLk1FRElVTSkudG9TdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5DNSwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSldLFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiBsYXVuY2hUZW1wbGF0ZS5yZWYsXG4gICAgICAgIHZlcnNpb246IGxhdW5jaFRlbXBsYXRlLmF0dHJMYXRlc3RWZXJzaW9uTnVtYmVyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByb290ID0gc3RhY2subm9kZS5yb290IGFzIGNkay5BcHA7XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IHJvb3Quc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpO1xuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnRlbXBsYXRlLlJlc291cmNlcy5Ob2RlZ3JvdXA2MkI0QjJDMS5Qcm9wZXJ0aWVzLkFtaVR5cGUpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhwbGljaXQgYW1pIHR5cGUgaXMgYXBwbGllZCBldmVuIHdoZW4gbGF1bmNoIHRlbXBsYXRlIGlzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBsYXVuY2hUZW1wbGF0ZSA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQzUsIGVjMi5JbnN0YW5jZVNpemUuTUVESVVNKS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFtaVR5cGU6IGVrcy5Ob2RlZ3JvdXBBbWlUeXBlLkFMMl9YODZfNjQsXG4gICAgICBsYXVuY2hUZW1wbGF0ZVNwZWM6IHtcbiAgICAgICAgaWQ6IGxhdW5jaFRlbXBsYXRlLnJlZixcbiAgICAgICAgdmVyc2lvbjogbGF1bmNoVGVtcGxhdGUuYXR0ckxhdGVzdFZlcnNpb25OdW1iZXIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHJvb3QgPSBzdGFjay5ub2RlLnJvb3QgYXMgY2RrLkFwcDtcbiAgICBjb25zdCBzdGFja0FydGlmYWN0ID0gcm9vdC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSk7XG4gICAgZXhwZWN0KHN0YWNrQXJ0aWZhY3QudGVtcGxhdGUuUmVzb3VyY2VzLk5vZGVncm91cDYyQjRCMkMxLlByb3BlcnRpZXMuQW1pVHlwZSkudG9FcXVhbCgnQUwyX3g4Nl82NCcpO1xuICB9KTtcblxuICB0ZXN0KCdhbWkgdHlwZSBpcyB0YWtlbiBhcyBpcyB3aGVuIG5vIGluc3RhbmNlIHR5cGVzIGFyZSBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogZWtzLk5vZGVncm91cEFtaVR5cGUuQUwyX1g4Nl82NF9HUFUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQUwyX3g4Nl82NF9HUFUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBkZWZhdWx0IG5vZGVncm91cCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHsgY2x1c3RlciB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICB9LFxuICAgICAgTm9kZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBGb3JjZVVwZGF0ZUVuYWJsZWQ6IHRydWUsXG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICBNYXhTaXplOiAyLFxuICAgICAgICBNaW5TaXplOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgeDg2XzY0IEFMMjAyMyBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfWDg2XzY0X1NUQU5EQVJELFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdBTDIwMjNfeDg2XzY0X1NUQU5EQVJEJyxcbiAgICAgIEZvcmNlVXBkYXRlRW5hYmxlZDogdHJ1ZSxcbiAgICAgIFNjYWxpbmdDb25maWc6IHtcbiAgICAgICAgRGVzaXJlZFNpemU6IDIsXG4gICAgICAgIE1heFNpemU6IDIsXG4gICAgICAgIE1pblNpemU6IDEsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBBUk02NCBBTDIwMjMgbm9kZWdyb3VwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyMDIzX0FSTV82NF9TVEFOREFSRCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICB9LFxuICAgICAgTm9kZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ05vZGVncm91cE5vZGVHcm91cFJvbGUwMzhBMTI4QicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBBbWlUeXBlOiAnQUwyMDIzX0FSTV82NF9TVEFOREFSRCcsXG4gICAgICBGb3JjZVVwZGF0ZUVuYWJsZWQ6IHRydWUsXG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIERlc2lyZWRTaXplOiAyLFxuICAgICAgICBNYXhTaXplOiAyLFxuICAgICAgICBNaW5TaXplOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgeDg2XzY0IGJvdHRsZXJvY2tldCBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfWDg2XzY0LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdCT1RUTEVST0NLRVRfeDg2XzY0JyxcbiAgICAgIEZvcmNlVXBkYXRlRW5hYmxlZDogdHJ1ZSxcbiAgICAgIFNjYWxpbmdDb25maWc6IHtcbiAgICAgICAgRGVzaXJlZFNpemU6IDIsXG4gICAgICAgIE1heFNpemU6IDIsXG4gICAgICAgIE1pblNpemU6IDEsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBBUk1fNjQgYm90dGxlcm9ja2V0IG5vZGVncm91cCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9BUk1fNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBDbHVzdGVyTmFtZToge1xuICAgICAgICBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnLFxuICAgICAgfSxcbiAgICAgIE5vZGVSb2xlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdOb2RlZ3JvdXBOb2RlR3JvdXBSb2xlMDM4QTEyOEInLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDRkNEQUE3QScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgQW1pVHlwZTogJ0JPVFRMRVJPQ0tFVF9BUk1fNjQnLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHg4Nl82NCBXaW5kb3dzIENvcmUgMjAxOSBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAxOV9YODZfNjQsXG4gICAgICB0YWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVmZmVjdDogVGFpbnRFZmZlY3QuTk9fU0NIRURVTEUsXG4gICAgICAgICAga2V5OiAnb3MnLFxuICAgICAgICAgIHZhbHVlOiAnd2luZG93cycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdXSU5ET1dTX0NPUkVfMjAxOV94ODZfNjQnLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgICBUYWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ05PX1NDSEVEVUxFJyxcbiAgICAgICAgICBLZXk6ICdvcycsXG4gICAgICAgICAgVmFsdWU6ICd3aW5kb3dzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHg4Nl82NCBXaW5kb3dzIENvcmUgMjAyMiBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAyMl9YODZfNjQsXG4gICAgICB0YWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVmZmVjdDogVGFpbnRFZmZlY3QuTk9fU0NIRURVTEUsXG4gICAgICAgICAga2V5OiAnb3MnLFxuICAgICAgICAgIHZhbHVlOiAnd2luZG93cycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdXSU5ET1dTX0NPUkVfMjAyMl94ODZfNjQnLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgICBUYWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ05PX1NDSEVEVUxFJyxcbiAgICAgICAgICBLZXk6ICdvcycsXG4gICAgICAgICAgVmFsdWU6ICd3aW5kb3dzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHg4Nl82NCBXaW5kb3dzIEZ1bGwgMjAxOSBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0ZVTExfMjAxOV9YODZfNjQsXG4gICAgICB0YWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVmZmVjdDogVGFpbnRFZmZlY3QuTk9fU0NIRURVTEUsXG4gICAgICAgICAga2V5OiAnb3MnLFxuICAgICAgICAgIHZhbHVlOiAnd2luZG93cycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdXSU5ET1dTX0ZVTExfMjAxOV94ODZfNjQnLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgICBUYWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ05PX1NDSEVEVUxFJyxcbiAgICAgICAgICBLZXk6ICdvcycsXG4gICAgICAgICAgVmFsdWU6ICd3aW5kb3dzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHg4Nl82NCBXaW5kb3dzIEZ1bGwgMjAyMiBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0ZVTExfMjAyMl9YODZfNjQsXG4gICAgICB0YWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVmZmVjdDogVGFpbnRFZmZlY3QuTk9fU0NIRURVTEUsXG4gICAgICAgICAga2V5OiAnb3MnLFxuICAgICAgICAgIHZhbHVlOiAnd2luZG93cycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgIH0sXG4gICAgICBOb2RlUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTm9kZWdyb3VwTm9kZUdyb3VwUm9sZTAzOEExMjhCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFtaVR5cGU6ICdXSU5ET1dTX0ZVTExfMjAyMl94ODZfNjQnLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgICBUYWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ05PX1NDSEVEVUxFJyxcbiAgICAgICAgICBLZXk6ICdvcycsXG4gICAgICAgICAgVmFsdWU6ICd3aW5kb3dzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGFuZCBhbWlUeXBlIGFyZSB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIHg4Nl82NCBpbnN0YW5jZXMsXG4gICAqIHRoZSBhbWlUeXBlIHNob3VsZCBiZSBpbXBsaWNpdGx5IHNldCBhcyBBTDJfeDg2XzY0LlxuICAgKi9cbiAgdGVzdCgnYW1pVHlwZSBzaG91bGQgYmUgQUwyX3g4Nl82NCB3aXRoIExhdW5jaFRlbXBsYXRlIGFuZCBhbWlUeXBlIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBpcyB4ODZfNjQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQUwyX3g4Nl82NCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGFuZCBhbWlUeXBlIGFyZSBib3RoIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgQVJNNjQgaW5zdGFuY2VzLFxuICAgKiB0aGUgYW1pVHlwZSBzaG91bGQgYmUgaW1wbGljaXRseSBzZXQgYXMgQUwyX0FSTV82NC5cbiAgICovXG4gIHRlc3QoJ2FtaVR5cGUgc2hvdWxkIGJlIEFMMl9BUk1fNjQgd2l0aCBMYXVuY2hUZW1wbGF0ZSBhbmQgYW1pVHlwZSB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgaXMgQVJNXzY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzZnLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0NGcubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQUwyX0FSTV82NCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGFuZCBhbWlUeXBlIGFyZSBib3RoIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgR1BVIGluc3RhbmNlcyxcbiAgICogdGhlIGFtaVR5cGUgc2hvdWxkIGJlIGltcGxpY2l0bHkgc2V0IGFzIEFMMl94ODZfNjRfR1BVLlxuICAgKi9cbiAgdGVzdCgnYW1pVHlwZSBzaG91bGQgYmUgQUwyX3g4Nl82NF9HUFUgd2l0aCBMYXVuY2hUZW1wbGF0ZSBhbmQgYW1pVHlwZSB1bmRlZmluZWQgYW5kIGluc3RhbmNlVHlwZXMgaXMgR1BVJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgncDMubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2czLmxhcmdlJyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgQW1pVHlwZTogJ0FMMl94ODZfNjRfR1BVJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdoZW4gTGF1bmNoVGVtcGxhdGUgaXMgdW5kZWZpbmVkLCBhbWlUeXBlIGlzIEFMMl94ODZfNjQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCB4ODZfNjQsXG4gICAqIHdlIHNob3VsZCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHRlc3QoJ3Rocm93cyB3aGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfeDg2XzY0IGFuZCBpbnN0YW5jZVR5cGVzIGFyZSBub3QgeDg2XzY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyX1g4Nl82NCxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3AzLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdnMy5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mIEFMMl9YODZfNjRfR1BVLCBBTDIwMjNfWDg2XzY0X05FVVJPTiwgQUwyMDIzX1g4Nl82NF9OVklESUEsIEFMMjAyM19BUk1fNjRfTlZJRElBLCBCT1RUTEVST0NLRVRfWDg2XzY0X05WSURJQSwgQk9UVExFUk9DS0VUX0FSTV82NF9OVklESUEgb3IgZG9uJ3Qgc3BlY2lmeSBhbnkvKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdoZW4gTGF1bmNoVGVtcGxhdGUgaXMgdW5kZWZpbmVkLCBhbWlUeXBlIGlzIEFMMjAyM19YODZfNjRfU1RBTkRBUkQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCB4ODZfNjQsXG4gICAqIHdlIHNob3VsZCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHRlc3QoJ3Rocm93cyB3aGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDIwMjNfWDg2XzY0X1NUQU5EQVJEIGFuZCBpbnN0YW5jZVR5cGVzIGFyZSBub3QgeDg2XzY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyMDIzX1g4Nl82NF9TVEFOREFSRCxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M2Zy5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDRnLmxhcmdlJyksXG4gICAgICBdLFxuICAgIH0pKS50b1Rocm93KC9UaGUgc3BlY2lmaWVkIEFNSSBkb2VzIG5vdCBtYXRjaCB0aGUgaW5zdGFuY2UgdHlwZXMgYXJjaGl0ZWN0dXJlLCBlaXRoZXIgc3BlY2lmeSBvbmUgb2YgQUwyX0FSTV82NCwgQUwyMDIzX0FSTV82NF9TVEFOREFSRCwgQk9UVExFUk9DS0VUX0FSTV82NCBvciBkb24ndCBzcGVjaWZ5IGFueS8pO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQUwyMDIzX0FSTV82NF9TVEFOREFSRCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IEFSTV82NCxcbiAgICogd2Ugc2hvdWxkIHRocm93IGFuIGVycm9yLlxuICAgKi9cbiAgdGVzdCgndGhyb3dzIHdoZW4gTGF1bmNoVGVtcGxhdGUgaXMgdW5kZWZpbmVkLCBhbWlUeXBlIGlzIEFMMjAyM19BUk1fNjRfU1RBTkRBUkQgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCBBUk1fNjQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfQVJNXzY0X1NUQU5EQVJELFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICBdLFxuICAgIH0pKS50b1Rocm93KC9UaGUgc3BlY2lmaWVkIEFNSSBkb2VzIG5vdCBtYXRjaCB0aGUgaW5zdGFuY2UgdHlwZXMgYXJjaGl0ZWN0dXJlLCBlaXRoZXIgc3BlY2lmeSBvbmUgb2YgQUwyX1g4Nl82NCwgQUwyMDIzX1g4Nl82NF9TVEFOREFSRCwgQk9UVExFUk9DS0VUX1g4Nl82NCwgV0lORE9XU19DT1JFXzIwMTlfWDg2XzY0LCBXSU5ET1dTX0NPUkVfMjAyMl9YODZfNjQsIFdJTkRPV1NfRlVMTF8yMDE5X1g4Nl82NCwgV0lORE9XU19GVUxMXzIwMjJfWDg2XzY0IG9yIGRvbid0IHNwZWNpZnkgYW55Lyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfQVJNXzY0IGFuZCBpbnN0YW5jZVR5cGVzIGFyZSBub3QgQVJNXzY0LFxuICAgKiB3ZSBzaG91bGQgdGhyb3cgYW4gZXJyb3IuXG4gICAqL1xuICB0ZXN0KCd0aHJvd3Mgd2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQUwyX0FSTV82NCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IEFSTV82NCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkFMMl9BUk1fNjQsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSkpLnRvVGhyb3coL1RoZSBzcGVjaWZpZWQgQU1JIGRvZXMgbm90IG1hdGNoIHRoZSBpbnN0YW5jZSB0eXBlcyBhcmNoaXRlY3R1cmUsIGVpdGhlciBzcGVjaWZ5IG9uZSBvZiBBTDJfWDg2XzY0LCBBTDIwMjNfWDg2XzY0X1NUQU5EQVJELCBCT1RUTEVST0NLRVRfWDg2XzY0LCBXSU5ET1dTX0NPUkVfMjAxOV9YODZfNjQsIFdJTkRPV1NfQ09SRV8yMDIyX1g4Nl82NCwgV0lORE9XU19GVUxMXzIwMTlfWDg2XzY0LCBXSU5ET1dTX0ZVTExfMjAyMl9YODZfNjQgb3IgZG9uJ3Qgc3BlY2lmeSBhbnkvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gQW1pVHlwZSBpcyBXaW5kb3dzIGFuZCBmb3JiaWRkZW4gaW5zdGFuY2VUeXBlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuV0lORE9XU19GVUxMXzIwMjJfWDg2XzY0LFxuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzMubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgfSkpLnRvVGhyb3coL1RoZSBzcGVjaWZpZWQgaW5zdGFuY2VUeXBlIGRvZXMgbm90IHN1cHBvcnQgV2luZG93cyB3b3JrbG9hZHMuIEFtYXpvbiBFQzIgaW5zdGFuY2UgdHlwZXMgQzMsIEM0LCBEMiwgSTIsIE00IFxcKGV4Y2x1ZGluZyBtNC4xNnhsYXJnZVxcKSwgTTZhLngsIGFuZCBSMyBpbnN0YW5jZXMgYXJlbid0IHN1cHBvcnRlZCBmb3IgV2luZG93cyB3b3JrbG9hZHMuLyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfeDg2XzY0X0dQVSBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IEdQVSBpbnN0YW5jZXMsXG4gICAqIHdlIHNob3VsZCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHRlc3QoJ3Rocm93cyB3aGVuIExhdW5jaFRlbXBsYXRlIGlzIHVuZGVmaW5lZCwgYW1pVHlwZSBpcyBBTDJfWDg2XzY0X0dQVSBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgbm90IFg4Nl82NF9HUFUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5BTDJfWDg2XzY0X0dQVSxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mIEFMMl9YODZfNjQsIEFMMjAyM19YODZfNjRfU1RBTkRBUkQsIEJPVFRMRVJPQ0tFVF9YODZfNjQsIFdJTkRPV1NfQ09SRV8yMDE5X1g4Nl82NCwgV0lORE9XU19DT1JFXzIwMjJfWDg2XzY0LCBXSU5ET1dTX0ZVTExfMjAxOV9YODZfNjQsIFdJTkRPV1NfRlVMTF8yMDIyX1g4Nl82NCBvciBkb24ndCBzcGVjaWZ5IGFueS8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQk9UVExFUk9DS0VUX0FSTV82NF9OVklESUEgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCBHUFUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQSxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mIEFMMl9YODZfNjQsIEFMMjAyM19YODZfNjRfU1RBTkRBUkQsIEJPVFRMRVJPQ0tFVF9YODZfNjQsIFdJTkRPV1NfQ09SRV8yMDE5X1g4Nl82NCwgV0lORE9XU19DT1JFXzIwMjJfWDg2XzY0LCBXSU5ET1dTX0ZVTExfMjAxOV9YODZfNjQsIFdJTkRPV1NfRlVMTF8yMDIyX1g4Nl82NCBvciBkb24ndCBzcGVjaWZ5IGFueS8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyB1bmRlZmluZWQsIGFtaVR5cGUgaXMgQk9UVExFUk9DS0VUX1g4Nl82NF9OVklESUEgYW5kIGluc3RhbmNlVHlwZXMgYXJlIG5vdCBHUFUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfWDg2XzY0X05WSURJQSxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mIEFMMl9YODZfNjQsIEFMMjAyM19YODZfNjRfU1RBTkRBUkQsIEJPVFRMRVJPQ0tFVF9YODZfNjQsIFdJTkRPV1NfQ09SRV8yMDE5X1g4Nl82NCwgV0lORE9XU19DT1JFXzIwMjJfWDg2XzY0LCBXSU5ET1dTX0ZVTExfMjAxOV9YODZfNjQsIFdJTkRPV1NfRlVMTF8yMDIyX1g4Nl82NCBvciBkb24ndCBzcGVjaWZ5IGFueS8pO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyBkZWZpbmVkLCBhbWlUeXBlIGlzIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgR1BVIGluc3RhbmNlcyxcbiAgICogd2Ugc2hvdWxkIGRlcGxveSBjb3JyZWN0bHkuXG4gICAqL1xuICB0ZXN0KCdkZXBsb3kgY29ycmVjdGx5IHdpdGggZGVmaW5lZCBMYXVuY2hUZW1wbGF0ZSBhbmQgaW5zdGFuY2VUeXBlcyhHUFUpIGFuZCBhbWlUeXBlIHVuZGVmaW5lZC4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBjb25zdCBuZyA9IG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3AzLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdnMy5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogJ21vY2snLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobmcpLm5vdC50b0hhdmVQcm9wZXJ0eSgnQW1pVHlwZScpO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyBkZWZpbmVkLCBhbWlUeXBlIGlzIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgeDg2XzY0IGluc3RhbmNlcyxcbiAgICogd2Ugc2hvdWxkIGRlcGxveSBjb3JyZWN0bHkuXG4gICAqL1xuICB0ZXN0KCdkZXBsb3kgY29ycmVjdGx5IHdpdGggZGVmaW5lZCBMYXVuY2hUZW1wbGF0ZSBhbmQgaW5zdGFuY2VUeXBlcyh4ODZfNjQpIGFuZCBhbWlUeXBlIHVuZGVmaW5lZC4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBjb25zdCBuZyA9IG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogJ21vY2snLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobmcpLm5vdC50b0hhdmVQcm9wZXJ0eSgnQW1pVHlwZScpO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBMYXVuY2hUZW1wbGF0ZSBpcyBkZWZpbmVkLCBhbWlUeXBlIGlzIHVuZGVmaW5lZCBhbmQgaW5zdGFuY2VUeXBlcyBhcmUgQVJNXzY0IGluc3RhbmNlcyxcbiAgICogd2Ugc2hvdWxkIGRlcGxveSBjb3JyZWN0bHkuXG4gICAqL1xuICB0ZXN0KCdkZXBsb3kgY29ycmVjdGx5IHdpdGggZGVmaW5lZCBMYXVuY2hUZW1wbGF0ZSBhbmQgaW5zdGFuY2VUeXBlcyhBUk1fNjQpIGFuZCBhbWlUeXBlIHVuZGVmaW5lZC4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBjb25zdCBuZyA9IG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M2Zy5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDRnLmxhcmdlJyksXG4gICAgICBdLFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiAnbW9jaycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChuZykubm90LnRvSGF2ZVByb3BlcnR5KCdBbWlUeXBlJyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCT1RUTEVST0NLRVRfWDg2XzY0IHdpdGggZGVmaW5lZCBpbnN0YW5jZSB0eXBlcyB3L28gbGF1bmNoVGVtcGxhdGVTcGVjIHNob3VsZCBkZXBsb3kgY29ycmVjdGx5LlxuICAgKi9cbiAgdGVzdCgnQk9UVExFUk9DS0VUX1g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdib3R0bGVyb2NrZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201YS54bGFyZ2UnKV0sXG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9YODZfNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnQk9UVExFUk9DS0VUX3g4Nl82NCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCT1RUTEVST0NLRVRfQVJNXzY0IHdpdGggZGVmaW5lZCBpbnN0YW5jZSB0eXBlcyB3L28gbGF1bmNoVGVtcGxhdGVTcGVjIHNob3VsZCBkZXBsb3kgY29ycmVjdGx5LlxuICAgKi9cbiAgdGVzdCgnQk9UVExFUk9DS0VUX0FSTV82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgICAgLy8gVEhFTlxuICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzZnLnhsYXJnZScpXSxcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX0FSTV82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIEFtaVR5cGU6ICdCT1RUTEVST0NLRVRfQVJNXzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdJTkRPV1NfQ09SRV8yMDE5X3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ1dJTkRPV1NfQ09SRV8yMDE5X3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCd3aW5kb3dzJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNWEueGxhcmdlJyldLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAxOV9YODZfNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnV0lORE9XU19DT1JFXzIwMTlfeDg2XzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdJTkRPV1NfQ09SRV8yMDIyX3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ1dJTkRPV1NfQ09SRV8yMDE5X3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCd3aW5kb3dzJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNWEueGxhcmdlJyldLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAyMl9YODZfNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnV0lORE9XU19DT1JFXzIwMjJfeDg2XzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdJTkRPV1NfRlVMTF8yMDE5X3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ1dJTkRPV1NfRlVMTF8yMDE5X3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCd3aW5kb3dzJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNWEueGxhcmdlJyldLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0ZVTExfMjAxOV9YODZfNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnV0lORE9XU19GVUxMXzIwMTlfeDg2XzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFdJTkRPV1NfRlVMTF8yMDIyX3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseS5cbiAgICovXG4gIHRlc3QoJ1dJTkRPV1NfRlVMTF8yMDIyX3g4Nl82NCB3aXRoIGRlZmluZWQgaW5zdGFuY2UgdHlwZXMgdy9vIGxhdW5jaFRlbXBsYXRlU3BlYyBzaG91bGQgZGVwbG95IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCd3aW5kb3dzJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNWEueGxhcmdlJyldLFxuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0ZVTExfMjAyMl9YODZfNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBBbWlUeXBlOiAnV0lORE9XU19GVUxMXzIwMjJfeDg2XzY0JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCBjb3JyZWN0bHkgd2l0aCBzZWN1cml0eSBncm91cHMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICByZW1vdGVBY2Nlc3M6IHtcbiAgICAgICAgc3NoS2V5TmFtZTogJ2ZvbycsXG4gICAgICAgIHNvdXJjZVNlY3VyaXR5R3JvdXBzOiBbbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYyB9KV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIFJlbW90ZUFjY2Vzczoge1xuICAgICAgICBFYzJTc2hLZXk6ICdmb28nLFxuICAgICAgICBTb3VyY2VTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnU0dBREI1MzkzNycsXG4gICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgY29ycmVjdGx5IHdpdGggZW5hYmxlTm9kZUF1dG9SZXBhaXIgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBlbmFibGVOb2RlQXV0b1JlcGFpcjogdHJ1ZSxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBOb2RlUmVwYWlyQ29uZmlnOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgbm9kZWdyb3VwIHdpdGggZm9yY2VVcGRhdGUgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHsgY2x1c3RlciwgZm9yY2VVcGRhdGU6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiBmYWxzZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIGluc3RhbmNlVHlwZXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAnbTUubGFyZ2UnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIG9uLWRlbWFuZCBjYXBhY2l0eSB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpXSxcbiAgICAgIGNhcGFjaXR5VHlwZTogZWtzLkNhcGFjaXR5VHlwZS5PTl9ERU1BTkQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICdtNS5sYXJnZScsXG4gICAgICBdLFxuICAgICAgQ2FwYWNpdHlUeXBlOiAnT05fREVNQU5EJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIG5vZGVncm91cCB3aXRoIHNwb3QgY2FwYWNpdHkgdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgICBjYXBhY2l0eVR5cGU6IGVrcy5DYXBhY2l0eVR5cGUuU1BPVCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICdtNS5sYXJnZScsXG4gICAgICAgICd0My5sYXJnZScsXG4gICAgICAgICdjNS5sYXJnZScsXG4gICAgICBdLFxuICAgICAgQ2FwYWNpdHlUeXBlOiAnU1BPVCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgd2l0aCBvbi1kZW1hbmQgY2FwYWNpdHkgdHlwZSBhbmQgbXVsdGlwbGUgaW5zdGFuY2UgdHlwZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDMubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICBdLFxuICAgICAgY2FwYWNpdHlUeXBlOiBla3MuQ2FwYWNpdHlUeXBlLk9OX0RFTUFORCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICdtNS5sYXJnZScsXG4gICAgICAgICd0My5sYXJnZScsXG4gICAgICAgICdjNS5sYXJnZScsXG4gICAgICBdLFxuICAgICAgQ2FwYWNpdHlUeXBlOiAnT05fREVNQU5EJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93cyB3aGVuIGJvdGggaW5zdGFuY2VUeXBlcyBhbmQgaW5zdGFuY2VUeXBlIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTUubGFyZ2UnKSxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ201LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgICBjYXBhY2l0eVR5cGU6IGVrcy5DYXBhY2l0eVR5cGUuU1BPVCxcbiAgICB9KSkudG9UaHJvdygvXCJpbnN0YW5jZVR5cGUgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBcImluc3RhbmNlVHlwZXNcIiBvbmx5Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgd2l0aCBuZWl0aGVyIGluc3RhbmNlVHlwZXMgbm9yIGluc3RhbmNlVHlwZSBkZWZpbmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGNhcGFjaXR5VHlwZTogZWtzLkNhcGFjaXR5VHlwZS5TUE9ULFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENhcGFjaXR5VHlwZTogJ1NQT1QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBpbnN0YW5jZVR5cGVzIHByb3ZpZGVkIHdpdGggZGlmZmVyZW50IENQVSBhcmNoaXRyY3R1cmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICAvLyBYODZcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNWEubGFyZ2UnKSxcbiAgICAgICAgLy8gQVJNNjRcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5sYXJnZScpLFxuICAgICAgXSxcbiAgICB9KSkudG9UaHJvdygvaW5zdGFuY2VUeXBlcyBvZiBkaWZmZXJlbnQgYXJjaGl0ZWN0dXJlcyBpcyBub3QgYWxsb3dlZC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhbWlUeXBlIHByb3ZpZGVkIGlzIGluY29ycmVjdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzVhLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNWQubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgICAvLyBpbmNvcnJlY3QgYW1pVHlwZVxuICAgICAgYW1pVHlwZTogZWtzLk5vZGVncm91cEFtaVR5cGUuQUwyX0FSTV82NCxcbiAgICB9KSkudG9UaHJvdygvVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZS8pO1xuICB9KTtcblxuICB0ZXN0KCdyZW1vdGVBY2Nlc3Mgd2l0aG91dCBzZWN1cml0eSBncm91cCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHJlbW90ZUFjY2Vzczoge1xuICAgICAgICBzc2hLZXlOYW1lOiAnZm9vJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBSZW1vdGVBY2Nlc3M6IHtcbiAgICAgICAgRWMyU3NoS2V5OiAnZm9vJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydCBub2RlZ3JvdXAgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjazogc3RhY2sxLCB2cGMsIGFwcCB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrMSwgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICAvLyBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogdHJ1ZSwgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuICAgIGNvbnN0IG5nID0gbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2sxLCAnTm9kZWdyb3VwJywgeyBjbHVzdGVyIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkID0gZWtzLk5vZGVncm91cC5mcm9tTm9kZWdyb3VwTmFtZShzdGFjazIsICdJbXBvcnRlZE5nJywgbmcubm9kZWdyb3VwTmFtZSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2syLCAnTm9kZWdyb3VwTmFtZScsIHsgdmFsdWU6IGltcG9ydGVkLm5vZGVncm91cE5hbWUgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgTm9kZWdyb3VwTmFtZToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrOkV4cG9ydHNPdXRwdXRSZWZOb2RlZ3JvdXA2MkI0QjJDMUVGOEFCN0MxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTm9kZWdyb3VwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBDbHVzdGVyTmFtZToge1xuICAgICAgICBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnLFxuICAgICAgfSxcbiAgICAgIE5vZGVSb2xlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdDbHVzdGVyTm9kZWdyb3VwbmdOb2RlR3JvdXBSb2xlREEwRDM1REEnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDRkNEQUE3QScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgRm9yY2VVcGRhdGVFbmFibGVkOiB0cnVlLFxuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBEZXNpcmVkU2l6ZTogMixcbiAgICAgICAgTWF4U2l6ZTogMixcbiAgICAgICAgTWluU2l6ZTogMSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBub2RlIGdyb3VwIHdpdGggdGFpbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7XG4gICAgICB0YWludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVmZmVjdDogZWtzLlRhaW50RWZmZWN0Lk5PX1NDSEVEVUxFLFxuICAgICAgICAgIGtleTogJ2ZvbycsXG4gICAgICAgICAgdmFsdWU6ICdiYXInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6Ok5vZGVncm91cCcsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0NsdXN0ZXJFQjAzODZBNycsXG4gICAgICB9LFxuICAgICAgVGFpbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFZmZlY3Q6ICdOT19TQ0hFRFVMRScsXG4gICAgICAgICAgS2V5OiAnZm9vJyxcbiAgICAgICAgICBWYWx1ZTogJ2JhcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBkZXNpcmVkU2l6ZSA+IG1heFNpemUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBkZXNpcmVkU2l6ZTogMywgbWF4U2l6ZTogMiB9KSkudG9UaHJvdygvRGVzaXJlZCBjYXBhY2l0eSAzIGNhbid0IGJlIGdyZWF0ZXIgdGhhbiBtYXggc2l6ZSAyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGRlc2lyZWRTaXplIDwgbWluU2l6ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7IGRlc2lyZWRTaXplOiAyLCBtaW5TaXplOiAzIH0pKS50b1Rocm93KC9NaW5pbXVtIGNhcGFjaXR5IDMgY2FuJ3QgYmUgZ3JlYXRlciB0aGFuIGRlc2lyZWQgc2l6ZSAyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzZXQgbWluU2l6ZSAsIG1heFNpemUgYW5kIERlc2lyZWRTaXplJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZUdyb3VwJywge1xuICAgICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICAgIG1pblNpemU6IDIsXG4gICAgICBtYXhTaXplOiA2LFxuICAgICAgZGVzaXJlZFNpemU6IDQsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgU2NhbGluZ0NvbmZpZzoge1xuICAgICAgICBNaW5TaXplOiAyLFxuICAgICAgICBNYXhTaXplOiA2LFxuICAgICAgICBEZXNpcmVkU2l6ZTogNCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gaXMgbm90IHBlcmZvcm1lZCB3aGVuIHVzaW5nIFRva2VucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLk5vZGVncm91cChzdGFjaywgJ05vZGVHcm91cCcsIHtcbiAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICBtaW5TaXplOiBjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1IH0pLFxuICAgICAgbWF4U2l6ZTogY2RrLkxhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gMSB9KSxcbiAgICAgIGRlc2lyZWRTaXplOiBjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiAyMCB9KSxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBTY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIE1pblNpemU6IDUsXG4gICAgICAgIE1heFNpemU6IDEsXG4gICAgICAgIERlc2lyZWRTaXplOiAyMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBub2RlZ3JvdXAgY29ycmVjdGx5IHdpdGggbGF1bmNoIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcyhcbiAgICAgICdzZXQgLW8geHRyYWNlJyxcbiAgICAgIGAvZXRjL2Vrcy9ib290c3RyYXAuc2ggJHtjbHVzdGVyLmNsdXN0ZXJOYW1lfWAsXG4gICAgKTtcbiAgICBjb25zdCBsdCA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbWFnZUlkOiBuZXcgZWtzLkVrc09wdGltaXplZEltYWdlKCkuZ2V0SW1hZ2Uoc3RhY2spLmltYWdlSWQsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJykudG9TdHJpbmcoKSxcbiAgICAgICAgdXNlckRhdGE6IGNkay5Gbi5iYXNlNjQodXNlckRhdGEucmVuZGVyKCkpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZy1sdCcsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogbHQucmVmLFxuICAgICAgICB2ZXJzaW9uOiBsdC5hdHRyRGVmYXVsdFZlcnNpb25OdW1iZXIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGU6IHtcbiAgICAgICAgSWQ6IHtcbiAgICAgICAgICBSZWY6ICdMYXVuY2hUZW1wbGF0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIFZlcnNpb246IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdMYXVuY2hUZW1wbGF0ZScsXG4gICAgICAgICAgICAnRGVmYXVsdFZlcnNpb25OdW1iZXInLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBib3RoIGRpc2tTaXplIGFuZCBsYXVuY2ggdGVtcGxhdGUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcyhcbiAgICAgICdzZXQgLW8geHRyYWNlJyxcbiAgICAgIGAvZXRjL2Vrcy9ib290c3RyYXAuc2ggJHtjbHVzdGVyLmNsdXN0ZXJOYW1lfWAsXG4gICAgKTtcbiAgICBjb25zdCBsdCA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbWFnZUlkOiBuZXcgZWtzLkVrc09wdGltaXplZEltYWdlKCkuZ2V0SW1hZ2Uoc3RhY2spLmltYWdlSWQsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJykudG9TdHJpbmcoKSxcbiAgICAgICAgdXNlckRhdGE6IGNkay5Gbi5iYXNlNjQodXNlckRhdGEucmVuZGVyKCkpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+XG4gICAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZy1sdCcsIHtcbiAgICAgICAgZGlza1NpemU6IDEwMCxcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgICAgaWQ6IGx0LnJlZixcbiAgICAgICAgICB2ZXJzaW9uOiBsdC5hdHRyRGVmYXVsdFZlcnNpb25OdW1iZXIsXG4gICAgICAgIH0sXG4gICAgICB9KSkudG9UaHJvdygvZGlza1NpemUgbXVzdCBiZSBzcGVjaWZpZWQgd2l0aGluIHRoZSBsYXVuY2ggdGVtcGxhdGUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIHVwZGF0ZUNvbmZpZyBmb3IgbWF4VW5hdmFpbGFibGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2ssICdOb2RlZ3JvdXAnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWF4VW5hdmFpbGFibGU6IDMsXG4gICAgICBtYXhTaXplOiA1LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Tm9kZWdyb3VwJywge1xuICAgICAgVXBkYXRlQ29uZmlnOiB7XG4gICAgICAgIE1heFVuYXZhaWxhYmxlOiAzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIHVwZGF0ZUNvbmZpZyBmb3IgbWF4VW5hdmFpbGFibGVQZXJjZW50YWdlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIG5ldyBla3MuTm9kZWdyb3VwKHN0YWNrLCAnTm9kZWdyb3VwJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZTogMzMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpOb2RlZ3JvdXAnLCB7XG4gICAgICBVcGRhdGVDb25maWc6IHtcbiAgICAgICAgTWF4VW5hdmFpbGFibGVQZXJjZW50YWdlOiAzMyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0VLU19OT0RFR1JPVVBfTkFNRSBmZWF0dXJlIGZsYWcgc2hvdWxkIHJldHVybiBjb3JyZWN0IG5vZGVncm91cE5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrV2l0aEZsYWcgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrV2l0aEZsYWcnLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YWNrV2l0aEZsYWcubm9kZS5zZXRDb250ZXh0KGN4YXBpLkVLU19OT0RFR1JPVVBfTkFNRSwgdHJ1ZSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFja1dpdGhGbGFnLCAnQ2x1c3RlcicsIHtcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIGNvbnN0IG5nID0gbmV3IGVrcy5Ob2RlZ3JvdXAoc3RhY2tXaXRoRmxhZywgJ05vZGVncm91cCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG5nLm5vZGVncm91cE5hbWUpLm5vdC50b0VxdWFsKChuZy5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5Ob2RlZ3JvdXApLnJlZik7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIG1heFVuYXZhaWxhYmxlIGFuZCBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2UgYXJlIHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnbmcnLCB7IG1heFVuYXZhaWxhYmxlOiAzLCBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2U6IDIgfSkpLnRvVGhyb3coL21heFVuYXZhaWxhYmxlIGFuZCBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2UgYXJlIG5vdCBhbGxvd2VkIHRvIGJlIGRlZmluZWQgdG9nZXRoZXIvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gbWF4VW5hdmFpbGFibGUgaXMgZ3JlYXRlciB0aGFuIG1heFNpemUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBtYXhVbmF2YWlsYWJsZTogNSwgbWF4U2l6ZTogNCB9KSkudG9UaHJvdygvbWF4VW5hdmFpbGFibGUgbXVzdCBiZSBsb3dlciB0aGFuIG1heFNpemUvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gbWF4VW5hdmFpbGFibGUgaXMgbGVzcyB0aGFuIDEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBtYXhVbmF2YWlsYWJsZTogLTMsIG1heFNpemU6IDEwIH0pKS50b1Rocm93KC9tYXhVbmF2YWlsYWJsZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAwLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIG1heFVuYXZhaWxhYmxlIGlzIGdyZWF0ZXIgdGhhbiAxMDAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ25nJywgeyBtYXhVbmF2YWlsYWJsZTogMTAxLCBtYXhTaXplOiAyMDAgfSkpLnRvVGhyb3coL21heFVuYXZhaWxhYmxlIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMDAvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gbWF4VW5hdmFpbGFibGVQZXJjZW50YWdlIGlzIGxlc3MgdGhhbiAxJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHsgbWF4VW5hdmFpbGFibGVQZXJjZW50YWdlOiAtMywgbWF4U2l6ZTogMTAgfSkpLnRvVGhyb3coL21heFVuYXZhaWxhYmxlUGVyY2VudGFnZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAwLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSBpcyBncmVhdGVyIHRoYW4gMTAwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCduZycsIHsgbWF4VW5hdmFpbGFibGVQZXJjZW50YWdlOiAxMDEgfSkpLnRvVGhyb3coL21heFVuYXZhaWxhYmxlUGVyY2VudGFnZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAwLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdpc0dwdUluc3RhbmNlVHlwZScsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3Iga25vd24gR1BVIGluc3RhbmNlIHR5cGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGdwdUluc3RhbmNlVHlwZXMgPSBbXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlAyLCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkczLCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlA0RCwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLk1FRElVTSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2RSwgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UyKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuSU5GMSwgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UpLFxuICAgICAgZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5JTkYyLCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlAzLCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlAzRE4sIGVjMi5JbnN0YW5jZVNpemUuWExBUkdFKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuUDRERSwgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UpLFxuICAgICAgZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5HNEFELCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc0RE4sIGVjMi5JbnN0YW5jZVNpemUuWExBUkdFKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuRzNTLCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc1LCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc1RywgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UpLFxuICAgIF07XG4gICAgZ3B1SW5zdGFuY2VUeXBlcy5mb3JFYWNoKGluc3RhbmNlVHlwZSA9PiB7XG4gICAgICBleHBlY3QoaXNHcHVJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBub24tR1BVIGluc3RhbmNlIHR5cGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IG5vbkdwdUluc3RhbmNlVHlwZXMgPSBbXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQzLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTUsIGVjMi5JbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5DNSwgZWMyLkluc3RhbmNlU2l6ZS5YTEFSR0UpLFxuICAgIF07XG4gICAgbm9uR3B1SW5zdGFuY2VUeXBlcy5mb3JFYWNoKGluc3RhbmNlVHlwZSA9PiB7XG4gICAgICBleHBlY3QoaXNHcHVJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlKSkudG9CZShmYWxzZSk7XG4gICAgfSk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBkaWZmZXJlbnQgc2l6ZXMgb2YgR1BVIGluc3RhbmNlIHR5cGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGdwdUluc3RhbmNlVHlwZXMgPSBbXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRTE2KSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuRzYsIGVjMi5JbnN0YW5jZVNpemUuWExBUkdFNDgpLFxuICAgICAgZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5HNiwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLk1FRElVTSksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLlNNQUxMKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuRzYsIGVjMi5JbnN0YW5jZVNpemUuTkFOTyksXG4gICAgICBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkc2LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuRzYsIGVjMi5JbnN0YW5jZVNpemUuTUVUQUwpLFxuICAgIF07XG4gICAgZ3B1SW5zdGFuY2VUeXBlcy5mb3JFYWNoKGluc3RhbmNlVHlwZSA9PiB7XG4gICAgICBleHBlY3QoaXNHcHVJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==