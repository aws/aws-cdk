import { InstanceType, SubnetSelection } from '@aws-cdk/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/core';
import { Cluster } from './cluster';
import { CfnNodegroup } from './eks.generated';

/**
 * NodeGroup interface
 */
export interface INodegroup extends IResource {
  /**
   * Name of the nodegroup
   * @attribute
   */
  readonly nodegroupName: string
}

/**
 * Nodegroup attributes used for the import
 */
export interface NodegroupAttributes {
  /**
   * Name of the nodegroup
   */
  readonly nodegroupName: string;
}

/**
 * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the Amazon EKS-optimized
 * Linux AMI with GPU support. Non-GPU instances should use the `AL2_x86_64` AMI type, which uses the Amazon EKS-optimized Linux AMI.
 */
export enum AmiType {
  /**
   * Amazon EKS-optimized Linux AMI
   */
  AL2_X86_64 = 'AL2_x86_64',
  /**
   *  Amazon EKS-optimized Linux AMI with GPU support
   */
  AL2_X86_64_GPU = 'AL2_x86_64_GPU'
}

/**
 * The remote access (SSH) configuration to use with your node group.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html
 */
export interface RemoteAccess {
  /**
   * The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.
   */
  readonly ec2SshKey: string,
  /**
   * The security groups that are allowed SSH access (port 22) to the worker nodes. If you specify an Amazon EC2 SSH key but do not
   * specify a source security group when you create a managed node group, then port 22 on the worker nodes is opened to the internet (0.0.0.0/0).
   *
   * @default - port 22 on the worker nodes is opened to the internet (0.0.0.0/0)
   */
  readonly sourceSecurityGroups?: string[],
}

/**
 * The NodeGroupOps for addNodeGroup() method
 */
export interface NodegroupOps {
  /**
   * Name of the Nodegroup
   *
   * @default - resource ID
   */
  readonly nodegroupName?: string;
  /**
   * The subnets to use for the Auto Scaling group that is created for your node group. These subnets must have the tag key
   * `kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with the name of your cluster.
   *
   * @default - private subnets
   */
  readonly subnets?: SubnetSelection;
  /**
   * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the Amazon EKS-optimized
   * Linux AMI with GPU support. Non-GPU instances should use the `AL2_x86_64` AMI type, which uses the Amazon EKS-optimized Linux AMI.
   *
   * @default - AL2_x86_64
   */
  readonly amiType?: AmiType;
  /**
   * The root device disk size (in GiB) for your node group instances.
   *
   * @default - 20
   */
  readonly diskSize?: number;
  /**
   * The current number of worker nodes that the managed node group should maintain. If not specified, the nodewgroup will initially
   * create `minSize` instances.
   *
   * @default - 2
   */
  readonly desiredSize?: number,
  /**
   * The maximum number of worker nodes that the managed node group can scale out to. Managed node groups can support up to 100 nodes by default.
   *
   * @default - desiredSize
   */
  readonly maxSize?: number,
  /**
   * The minimum number of worker nodes that the managed node group can scale in to. This number must be greater than zero.
   *
   * @default - 1
   */
  readonly minSize?: number
  /**
   * Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue. If an update fails
   * because pods could not be drained, you can force the update after it fails to terminate the old node whether or not any pods are
   * running on the node.
   *
   * @default - true
   */
  readonly forceUpdateEnabled?: boolean;
  /**
   * The instance type to use for your node group. Currently, you can specify a single instance type for a node group. The default value
   * for this parameter is `t3.medium`. If you choose a GPU instance type, be sure to specify the `AL2_x86_64_GPU` with the amiType parameter.
   *
   * @default - t3.medium
   */
  readonly instanceType?: InstanceType;
  /**
   * The Kubernetes labels to be applied to the nodes in the node group when they are created.
   *
   * @default - None
   */
  readonly labels?: any;
  /**
   * The IAM role to associate with your node group. The Amazon EKS worker node kubelet daemon
   * makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through an IAM instance profile
   * and associated policies. Before you can launch worker nodes and register them into a cluster, you must create an IAM role for
   * those worker nodes to use when they are launched.
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
   * The remote access (SSH) configuration to use with your node group. Disabled by default, however, if you specify an Amazon EC2
   * SSH key but do not specify a source security group when you create a managed node group, then port 22 on the worker nodes is
   * opened to the internet (0.0.0.0/0)
   *
   * @default - disabled
   */
  readonly remoteAccess?: RemoteAccess;
  /**
   * The metadata to apply to the node group to assist with categorization and organization. Each tag consists of a key and an optional
   * value, both of which you define. Node group tags do not propagate to any other resources associated with the node group, such as the
   * Amazon EC2 instances or subnets.
   *
   * @default - None
   */
  readonly tags?: any;
}

/**
 * NodeGroup properties interface
 */
export interface NodegroupProps extends NodegroupOps {
  /**
   * Cluster resource
   * [disable-awslint:ref-via-interface]"
   */
  readonly cluster: Cluster;
}

/**
 * The Nodegroup resource class
 */
export class Nodegroup extends Resource implements INodegroup {
  /**
   * Import the Nodegroup from attributes
   */
  public static fromNodegroupAttributes(scope: Construct, id: string, attrs: NodegroupAttributes): INodegroup {
    class Import extends Resource implements INodegroup {
      public readonly nodegroupName = attrs.nodegroupName;
    }
    return new Import(scope, id);
  }
  /**
   * ARN of the nodegroup
   *
   * @attribute
   */
  public readonly nodegroupArn: string;
  /**
   * Nodegroup name
   *
   * @attribute
   */
  public readonly nodegroupName: string;
  /**
   * the Amazon EKS cluster resource
   *
   * @attribute ClusterName
   */
  public readonly cluster: Cluster;
  /**
   * IAM role of the instance profile for the nodegroup
   */
  public readonly role: IRole;

  private readonly desiredSize: number;
  private readonly maxSize: number;
  private readonly minSize: number;

  constructor(scope: Construct, id: string, props: NodegroupProps ) {
    super(scope, id);

    this.cluster = props.cluster;

    this.desiredSize = props.desiredSize ?? props.minSize ?? 2;
    this.maxSize = props.maxSize ?? this.desiredSize;
    this.minSize = props.minSize ?? 1;

    if (this.desiredSize > this.maxSize) {
      throw new Error(`desired capacity ${this.desiredSize} can't be greater than max size ${this.maxSize}`);
    }
    if (this.desiredSize < this.minSize) {
      throw new Error(`Minimum capacity ${this.minSize} can't be greater than desired size ${this.desiredSize}`);
    }

    const ngRole = new Role(this, 'NodeGroupRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com')
    });

    ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    const resource = new CfnNodegroup(this, id, {
      clusterName: this.cluster.clusterName,
      nodegroupName: props.nodegroupName,
      nodeRole: ngRole.roleArn,
      subnets: this.cluster.vpc.selectSubnets(props.subnets).subnetIds,
      amiType: props.amiType,
      diskSize: props.diskSize,
      forceUpdateEnabled: props.forceUpdateEnabled ?? true,
      instanceTypes: props.instanceType ? [props.instanceType?.toString()] : undefined,
      labels: props.labels,
      releaseVersion: props.releaseVersion,
      remoteAccess: props.remoteAccess,
      scalingConfig: {
        desiredSize: this.desiredSize,
        maxSize: this.maxSize,
        minSize: this.minSize
      },
      tags: props.tags
    });

    // do not attempt to map the role if `kubectl` is not enabled for this
    // cluster or if `mapRole` is set to false. By default this should happen.
    // const mapRole = options.mapRole === undefined ? true : options.mapRole;
    // if (mapRole && this.kubectlEnabled) {
    if (this.cluster.kubectlEnabled) {
      // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
      this.cluster.awsAuth.addRoleMapping(ngRole, {
        username: 'system:node:{{EC2PrivateDNSName}}',
        groups: [
          'system:bootstrappers',
          'system:nodes'
        ]
      });
    } else {
      // since we are not mapping the instance role to RBAC, synthesize an
      // output so it can be pasted into `aws-auth-cm.yaml`
      new CfnOutput(this, 'InstanceRoleARN', {
        value: ngRole.roleArn
      });
    }

    this.cluster.awsAuth.addRoleMapping(ngRole, {
      username: 'system:node:{{EC2PrivateDNSName}}',
      groups: [
        'system:bootstrappers',
        'system:nodes'
      ]
    });

    this.nodegroupArn = resource.attrArn;
    this.nodegroupName = resource.ref;
    this.role = ngRole;
  }

}