import { InstanceType, ISecurityGroup, SubnetSelection } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
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
 * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the
 * Amazon EKS-optimized Linux AMI with GPU support. Non-GPU instances should use the `AL2_x86_64` AMI type, which
 * uses the Amazon EKS-optimized Linux AMI.
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
     *  Bottlerocket Linux(ARM-64)
     */
    BOTTLEROCKET_ARM_64 = "BOTTLEROCKET_ARM_64",
    /**
     * Bottlerocket(x86-64)
     */
    BOTTLEROCKET_X86_64 = "BOTTLEROCKET_x86_64"
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
    ON_DEMAND = "ON_DEMAND"
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
     * @default - desiredSize
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
     * `AL2_x86_64_GPU` with the amiType parameter.
     *
     * @default t3.medium
     * @deprecated Use `instanceTypes` instead.
     */
    readonly instanceType?: InstanceType;
    /**
     * The instance types to use for your node group.
     * @default t3.medium will be used according to the cloudformation document.
     * @see - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes
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
     * @default - None
     */
    readonly tags?: {
        [name: string]: string;
    };
    /**
     * Launch template specification used for the nodegroup
     * @see - https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html
     * @default - no launch template
     */
    readonly launchTemplateSpec?: LaunchTemplateSpec;
    /**
     * The capacity type of the nodegroup.
     *
     * @default - ON_DEMAND
     */
    readonly capacityType?: CapacityType;
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
 */
export declare class Nodegroup extends Resource implements INodegroup {
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
}
