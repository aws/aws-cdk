import { InstanceType, ISecurityGroup, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IResource, Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
/**
 * NodeGroup interface
 */
export interface INodegroup extends IResource {
    /**
     * Name of the nodegroup
     * @attribute
     */
    readonly nodegroupName: string;
}
/**
 * The AMI type for your node group.
 *
 * GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the
 * Amazon EKS-optimized Linux AMI with GPU support or the `BOTTLEROCKET_ARM_64_NVIDIA` or `BOTTLEROCKET_X86_64_NVIDIA`
 * AMI types, which uses the Amazon EKS-optimized Linux AMI with Nvidia-GPU support.
 *
 * Non-GPU instances should use the `AL2_x86_64` AMI type, which uses the Amazon EKS-optimized Linux AMI.
 */
export declare enum NodegroupAmiType {
    /**
     * Amazon Linux 2 (x86-64)
     */
    AL2_X86_64 = "AL2_x86_64",
    /**
     * Amazon Linux 2 with GPU support
     */
    AL2_X86_64_GPU = "AL2_x86_64_GPU",
    /**
     * Amazon Linux 2 (ARM-64)
     */
    AL2_ARM_64 = "AL2_ARM_64",
    /**
     *  Bottlerocket Linux (ARM-64)
     */
    BOTTLEROCKET_ARM_64 = "BOTTLEROCKET_ARM_64",
    /**
     * Bottlerocket (x86-64)
     */
    BOTTLEROCKET_X86_64 = "BOTTLEROCKET_x86_64",
    /**
     *  Bottlerocket Linux with Nvidia-GPU support (ARM-64)
     */
    BOTTLEROCKET_ARM_64_NVIDIA = "BOTTLEROCKET_ARM_64_NVIDIA",
    /**
     * Bottlerocket with Nvidia-GPU support (x86-64)
     */
    BOTTLEROCKET_X86_64_NVIDIA = "BOTTLEROCKET_x86_64_NVIDIA",
    /**
     * Bottlerocket Linux (ARM-64) with FIPS enabled
     */
    BOTTLEROCKET_ARM_64_FIPS = "BOTTLEROCKET_ARM_64_FIPS",
    /**
     * Bottlerocket (x86-64) with FIPS enabled
     */
    BOTTLEROCKET_X86_64_FIPS = "BOTTLEROCKET_x86_64_FIPS",
    /**
     * Windows Core 2019 (x86-64)
     */
    WINDOWS_CORE_2019_X86_64 = "WINDOWS_CORE_2019_x86_64",
    /**
     * Windows Core 2022 (x86-64)
     */
    WINDOWS_CORE_2022_X86_64 = "WINDOWS_CORE_2022_x86_64",
    /**
     * Windows Full 2019 (x86-64)
     */
    WINDOWS_FULL_2019_X86_64 = "WINDOWS_FULL_2019_x86_64",
    /**
     * Windows Full 2022 (x86-64)
     */
    WINDOWS_FULL_2022_X86_64 = "WINDOWS_FULL_2022_x86_64",
    /**
     * Amazon Linux 2023 (x86-64)
     */
    AL2023_X86_64_STANDARD = "AL2023_x86_64_STANDARD",
    /**
     * Amazon Linux 2023 with AWS Neuron drivers (x86-64)
     */
    AL2023_X86_64_NEURON = "AL2023_x86_64_NEURON",
    /**
     * Amazon Linux 2023 with NVIDIA drivers (x86-64)
     */
    AL2023_X86_64_NVIDIA = "AL2023_x86_64_NVIDIA",
    /**
     * Amazon Linux 2023 with NVIDIA drivers (ARM-64)
     */
    AL2023_ARM_64_NVIDIA = "AL2023_ARM_64_NVIDIA",
    /**
     * Amazon Linux 2023 (ARM-64)
     */
    AL2023_ARM_64_STANDARD = "AL2023_ARM_64_STANDARD"
}
/**
 * Capacity type of the managed node group
 */
export declare enum CapacityType {
    /**
     * spot instances
     */
    SPOT = "SPOT",
    /**
     * on-demand instances
     */
    ON_DEMAND = "ON_DEMAND",
    /**
     * capacity block instances
     */
    CAPACITY_BLOCK = "CAPACITY_BLOCK"
}
/**
 * The remote access (SSH) configuration to use with your node group.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html
 */
export interface NodegroupRemoteAccess {
    /**
     * The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.
     */
    readonly sshKeyName: string;
    /**
     * The security groups that are allowed SSH access (port 22) to the worker nodes. If you specify an Amazon EC2 SSH
     * key but do not specify a source security group when you create a managed node group, then port 22 on the worker
     * nodes is opened to the internet (0.0.0.0/0).
     *
     * @default - port 22 on the worker nodes is opened to the internet (0.0.0.0/0)
     */
    readonly sourceSecurityGroups?: ISecurityGroup[];
}
/**
 * Launch template property specification
 */
export interface LaunchTemplateSpec {
    /**
     * The Launch template ID
     */
    readonly id: string;
    /**
     * The launch template version to be used (optional).
     *
     * @default - the default version of the launch template
     */
    readonly version?: string;
}
/**
 * Effect types of kubernetes node taint.
 *
 * Note: These values are specifically for AWS EKS NodeGroups and use the AWS API format.
 * When using AWS CLI or API, taint effects must be NO_SCHEDULE, PREFER_NO_SCHEDULE, or NO_EXECUTE.
 * When using Kubernetes directly or kubectl, taint effects must be NoSchedule, PreferNoSchedule, or NoExecute.
 *
 * For Kubernetes manifests (like Karpenter NodePools), use string literals with PascalCase format:
 * - 'NoSchedule' instead of TaintEffect.NO_SCHEDULE
 * - 'PreferNoSchedule' instead of TaintEffect.PREFER_NO_SCHEDULE
 * - 'NoExecute' instead of TaintEffect.NO_EXECUTE
 *
 * @see https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html
 */
export declare enum TaintEffect {
    /**
     * NoSchedule
     */
    NO_SCHEDULE = "NO_SCHEDULE",
    /**
     * PreferNoSchedule
     */
    PREFER_NO_SCHEDULE = "PREFER_NO_SCHEDULE",
    /**
     * NoExecute
     */
    NO_EXECUTE = "NO_EXECUTE"
}
/**
 * Taint interface
 */
export interface TaintSpec {
    /**
     * Effect type
     *
     * @default - None
     */
    readonly effect?: TaintEffect;
    /**
     * Taint key
     *
     * @default - None
     */
    readonly key?: string;
    /**
     * Taint value
     *
     * @default - None
     */
    readonly value?: string;
}
/**
 * The Nodegroup Options for addNodeGroup() method
 */
export interface NodegroupOptions {
    /**
     * Name of the Nodegroup
     *
     * @default - resource ID
     */
    readonly nodegroupName?: string;
    /**
     * The subnets to use for the Auto Scaling group that is created for your node group. By specifying the
     * SubnetSelection, the selected subnets will automatically apply required tags i.e.
     * `kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with
     * the name of your cluster.
     *
     * @default - private subnets
     */
    readonly subnets?: SubnetSelection;
    /**
     * The AMI type for your node group. If you explicitly specify the launchTemplate with custom AMI, do not specify this property, or
     * the node group deployment will fail. In other cases, you will need to specify correct amiType for the nodegroup.
     *
     * @default - auto-determined from the instanceTypes property when launchTemplateSpec property is not specified
     */
    readonly amiType?: NodegroupAmiType;
    /**
     * The root device disk size (in GiB) for your node group instances.
     *
     * @default 20
     */
    readonly diskSize?: number;
    /**
     * The current number of worker nodes that the managed node group should maintain. If not specified,
     * the nodewgroup will initially create `minSize` instances.
     *
     * @default 2
     */
    readonly desiredSize?: number;
    /**
     * The maximum number of worker nodes that the managed node group can scale out to. Managed node groups can support up to 100 nodes by default.
     *
     * @default - same as desiredSize property
     */
    readonly maxSize?: number;
    /**
     * The minimum number of worker nodes that the managed node group can scale in to. This number must be greater than or equal to zero.
     *
     * @default 1
     */
    readonly minSize?: number;
    /**
     * Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.
     * If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
     * node whether or not any pods are
     * running on the node.
     *
     * @default true
     */
    readonly forceUpdate?: boolean;
    /**
     * The instance type to use for your node group. Currently, you can specify a single instance type for a node group.
     * The default value for this parameter is `t3.medium`. If you choose a GPU instance type, be sure to specify the
     * `AL2_x86_64_GPU`, `BOTTLEROCKET_ARM_64_NVIDIA`, or `BOTTLEROCKET_x86_64_NVIDIA` with the amiType parameter.
     *
     * @default t3.medium
     * @deprecated Use `instanceTypes` instead.
     */
    readonly instanceType?: InstanceType;
    /**
     * The instance types to use for your node group.
     * @default t3.medium will be used according to the cloudformation document.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes
     */
    readonly instanceTypes?: InstanceType[];
    /**
     * The Kubernetes labels to be applied to the nodes in the node group when they are created.
     *
     * @default - None
     */
    readonly labels?: {
        [name: string]: string;
    };
    /**
     * The Kubernetes taints to be applied to the nodes in the node group when they are created.
     *
     * @default - None
     */
    readonly taints?: TaintSpec[];
    /**
     * The IAM role to associate with your node group. The Amazon EKS worker node kubelet daemon
     * makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
     * an IAM instance profile and associated policies. Before you can launch worker nodes and register them
     * into a cluster, you must create an IAM role for those worker nodes to use when they are launched.
     *
     * @default - None. Auto-generated if not specified.
     */
    readonly nodeRole?: IRole;
    /**
     * The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).
     *
     * @default - The latest available AMI version for the node group's current Kubernetes version is used.
     */
    readonly releaseVersion?: string;
    /**
     * The remote access (SSH) configuration to use with your node group. Disabled by default, however, if you
     * specify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group,
     * then port 22 on the worker nodes is opened to the internet (0.0.0.0/0)
     *
     * @default - disabled
     */
    readonly remoteAccess?: NodegroupRemoteAccess;
    /**
     * The metadata to apply to the node group to assist with categorization and organization. Each tag consists of
     * a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
     * associated with the node group, such as the Amazon EC2 instances or subnets.
     *
     * @default None
     */
    readonly tags?: {
        [name: string]: string;
    };
    /**
     * Launch template specification used for the nodegroup
     * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html
     * @default - no launch template
     */
    readonly launchTemplateSpec?: LaunchTemplateSpec;
    /**
     * The capacity type of the nodegroup.
     *
     * @default CapacityType.ON_DEMAND
     */
    readonly capacityType?: CapacityType;
    /**
     * The maximum number of nodes unavailable at once during a version update.
     * Nodes will be updated in parallel. The maximum number is 100.
     *
     * This value or `maxUnavailablePercentage` is required to have a value for custom update configurations to be applied.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailable
     * @default 1
     */
    readonly maxUnavailable?: number;
    /**
     * The maximum percentage of nodes unavailable during a version update.
     * This percentage of nodes will be updated in parallel, up to 100 nodes at once.
     *
     * This value or `maxUnavailable` is required to have a value for custom update configurations to be applied.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailablepercentage
     * @default undefined - node groups will update instances one at a time
     */
    readonly maxUnavailablePercentage?: number;
    /**
     * Specifies whether to enable node auto repair for the node group. Node auto repair is disabled by default.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/node-health.html#node-auto-repair
     * @default false
     */
    readonly enableNodeAutoRepair?: boolean;
}
/**
 * NodeGroup properties interface
 */
export interface NodegroupProps extends NodegroupOptions {
    /**
     * Cluster resource
     */
    readonly cluster: ICluster;
}
/**
 * The Nodegroup resource class
 * @resource AWS::EKS::Nodegroup
 */
export declare class Nodegroup extends Resource implements INodegroup {
    /** Uniquely identifies this class. */
    static readonly PROPERTY_INJECTION_ID: string;
    /**
     * Import the Nodegroup from attributes
     */
    static fromNodegroupName(scope: Construct, id: string, nodegroupName: string): INodegroup;
    /**
     * ARN of the nodegroup
     *
     * @attribute
     */
    readonly nodegroupArn: string;
    /**
     * Nodegroup name
     *
     * @attribute
     */
    readonly nodegroupName: string;
    /**
     * the Amazon EKS cluster resource
     *
     * @attribute ClusterName
     */
    readonly cluster: ICluster;
    /**
     * IAM role of the instance profile for the nodegroup
     */
    readonly role: IRole;
    private readonly desiredSize;
    private readonly maxSize;
    private readonly minSize;
    constructor(scope: Construct, id: string, props: NodegroupProps);
    private validateUpdateConfig;
}
