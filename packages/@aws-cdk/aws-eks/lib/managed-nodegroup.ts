import { InstanceType, ISecurityGroup, SubnetSelection, InstanceArchitecture } from '@aws-cdk/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IResource, Resource, Annotations, withResolved } from '@aws-cdk/core';
import { Construct, Node } from 'constructs';
import { Cluster, ICluster } from './cluster';
import { CfnNodegroup } from './eks.generated';

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
export enum NodegroupAmiType {
  /**
   * Amazon Linux 2 (x86-64)
   */
  AL2_X86_64 = 'AL2_x86_64',
  /**
   * Amazon Linux 2 with GPU support
   */
  AL2_X86_64_GPU = 'AL2_x86_64_GPU',
  /**
   * Amazon Linux 2 (ARM-64)
   */
  AL2_ARM_64 = 'AL2_ARM_64',
  /**
   *  Bottlerocket Linux(ARM-64)
   */
  BOTTLEROCKET_ARM_64 = 'BOTTLEROCKET_ARM_64',
  /**
   * Bottlerocket(x86-64)
   */
  BOTTLEROCKET_X86_64 = 'BOTTLEROCKET_x86_64',
}

/**
 * Capacity type of the managed node group
 */
export enum CapacityType {
  /**
   * spot instances
   */
  SPOT = 'SPOT',
  /**
   * on-demand instances
   */
  ON_DEMAND = 'ON_DEMAND'
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
export enum TaintEffect {
  /**
   * NoSchedule
   */
  NO_SCHEDULE = 'NO_SCHEDULE',
  /**
   * PreferNoSchedule
   */
  PREFER_NO_SCHEDULE = 'PREFER_NO_SCHEDULE',
  /**
   * NoExecute
   */
  NO_EXECUTE = 'NO_EXECUTE',
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
  readonly labels?: { [name: string]: string };
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
  readonly tags?: { [name: string]: string };
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
export class Nodegroup extends Resource implements INodegroup {
  /**
   * Import the Nodegroup from attributes
   */
  public static fromNodegroupName(scope: Construct, id: string, nodegroupName: string): INodegroup {
    class Import extends Resource implements INodegroup {
      public readonly nodegroupName = nodegroupName;
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
  public readonly cluster: ICluster;
  /**
   * IAM role of the instance profile for the nodegroup
   */
  public readonly role: IRole;

  private readonly desiredSize: number;
  private readonly maxSize: number;
  private readonly minSize: number;

  constructor(scope: Construct, id: string, props: NodegroupProps) {
    super(scope, id, {
      physicalName: props.nodegroupName,
    });

    this.cluster = props.cluster;

    this.desiredSize = props.desiredSize ?? props.minSize ?? 2;
    this.maxSize = props.maxSize ?? this.desiredSize;
    this.minSize = props.minSize ?? 1;

    withResolved(this.desiredSize, this.maxSize, (desired, max) => {
      if (desired === undefined) {return ;}
      if (desired > max) {
        throw new Error(`Desired capacity ${desired} can't be greater than max size ${max}`);
      }
    });

    withResolved(this.desiredSize, this.minSize, (desired, min) => {
      if (desired === undefined) {return ;}
      if (desired < min) {
        throw new Error(`Minimum capacity ${min} can't be greater than desired size ${desired}`);
      }
    });

    if (props.launchTemplateSpec && props.diskSize) {
      // see - https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html
      // and https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize
      throw new Error('diskSize must be specified within the launch template');
    }

    if (props.instanceType && props.instanceTypes) {
      throw new Error('"instanceType is deprecated, please use "instanceTypes" only.');
    }

    if (props.instanceType) {
      Annotations.of(this).addWarning('"instanceType" is deprecated and will be removed in the next major version. please use "instanceTypes" instead');
    }
    const instanceTypes = props.instanceTypes ?? (props.instanceType ? [props.instanceType] : undefined);
    let possibleAmiTypes: NodegroupAmiType[] = [];

    if (instanceTypes && instanceTypes.length > 0) {
      /**
       * if the user explicitly configured instance types, we can't caculate the expected ami type as we support
       * Amazon Linux 2 and Bottlerocket now. However we can check:
       *
       * 1. instance types of different CPU architectures are not mixed(e.g. X86 with ARM).
       * 2. user-specified amiType should be included in `possibleAmiTypes`.
       */
      possibleAmiTypes = getPossibleAmiTypes(instanceTypes);

      // if the user explicitly configured an ami type, make sure it's included in the possibleAmiTypes
      if (props.amiType && !possibleAmiTypes.includes(props.amiType)) {
        throw new Error(`The specified AMI does not match the instance types architecture, either specify one of ${possibleAmiTypes} or don't specify any`);
      }
    }

    if (!props.nodeRole) {
      const ngRole = new Role(this, 'NodeGroupRole', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      });

      ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
      ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
      ngRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
      this.role = ngRole;
    } else {
      this.role = props.nodeRole;
    }

    const resource = new CfnNodegroup(this, 'Resource', {
      clusterName: this.cluster.clusterName,
      nodegroupName: props.nodegroupName,
      nodeRole: this.role.roleArn,
      subnets: this.cluster.vpc.selectSubnets(props.subnets).subnetIds,
      /**
       * Case 1: If launchTemplate is explicitly specified with custom AMI, we cannot specify amiType, or the node group deployment will fail.
       * As we don't know if the custom AMI is specified in the lauchTemplate, we just use props.amiType.
       *
       * Case 2: If launchTemplate is not specified, we try to determine amiType from the instanceTypes and it could be either AL2 or Bottlerocket.
       * To avoid breaking changes, we use possibleAmiTypes[0] if amiType is undefined and make sure AL2 is always the first element in possibleAmiTypes
       * as AL2 is previously the `expectedAmi` and this avoids breaking changes.
       *
       * That being said, users now either have to explicitly specify correct amiType or just leave it undefined.
       */
      amiType: props.launchTemplateSpec ? props.amiType : (props.amiType ?? possibleAmiTypes[0]),
      capacityType: props.capacityType ? props.capacityType.valueOf() : undefined,
      diskSize: props.diskSize,
      forceUpdateEnabled: props.forceUpdate ?? true,

      // note that we don't check if a launch template is configured here (even though it might configure instance types as well)
      // because this doesn't have a default value, meaning the user had to explicitly configure this.
      instanceTypes: instanceTypes?.map(t => t.toString()),
      labels: props.labels,
      taints: props.taints,
      launchTemplate: props.launchTemplateSpec,
      releaseVersion: props.releaseVersion,
      remoteAccess: props.remoteAccess ? {
        ec2SshKey: props.remoteAccess.sshKeyName,
        sourceSecurityGroups: props.remoteAccess.sourceSecurityGroups ?
          props.remoteAccess.sourceSecurityGroups.map(m => m.securityGroupId) : undefined,
      } : undefined,
      scalingConfig: {
        desiredSize: this.desiredSize,
        maxSize: this.maxSize,
        minSize: this.minSize,
      },
      tags: props.tags,
    });

    // managed nodegroups update the `aws-auth` on creation, but we still need to track
    // its state for consistency.
    if (this.cluster instanceof Cluster) {
      // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
      this.cluster.awsAuth.addRoleMapping(this.role, {
        username: 'system:node:{{EC2PrivateDNSName}}',
        groups: [
          'system:bootstrappers',
          'system:nodes',
        ],
      });

      // the controller runs on the worker nodes so they cannot
      // be deleted before the controller.
      if (this.cluster.albController) {
        Node.of(this.cluster.albController).addDependency(this);
      }
    }

    this.nodegroupArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'nodegroup',
      resourceName: this.physicalName,
    });
    this.nodegroupName = this.getResourceNameAttribute(resource.ref);
  }
}

/**
 * AMI types of different architectures. Make sure AL2 is always the first element, which will be the default
 * AmiType if amiType and launchTemplateSpec are both undefined.
 */
const arm64AmiTypes: NodegroupAmiType[] = [NodegroupAmiType.AL2_ARM_64, NodegroupAmiType.BOTTLEROCKET_ARM_64];
const x8664AmiTypes: NodegroupAmiType[] = [NodegroupAmiType.AL2_X86_64, NodegroupAmiType.BOTTLEROCKET_X86_64];
const gpuAmiTypes: NodegroupAmiType[] = [NodegroupAmiType.AL2_X86_64_GPU];


/**
 * This function check if the instanceType is GPU instance.
 * @param instanceType The EC2 instance type
 */
function isGpuInstanceType(instanceType: InstanceType): boolean {
  // capture the family, generation, capabilities, and size portions of the instance type id
  const instanceTypeComponents = instanceType.toString().match(/^([a-z]+)(\d{1,2})([a-z]*)\.([a-z0-9]+)$/);
  if (instanceTypeComponents == null) {
    throw new Error('Malformed instance type identifier');
  }
  const family = instanceTypeComponents[1];
  return ['p', 'g', 'inf'].includes(family);
}

type AmiArchitecture = InstanceArchitecture | 'GPU';
/**
 * This function examines the CPU architecture of every instance type and determines
 * what AMI types are compatible for all of them. it either throws or produces an array of possible AMI types because
 * instance types of different CPU architectures are not supported.
 * @param instanceTypes The instance types
 * @returns NodegroupAmiType[]
 */
function getPossibleAmiTypes(instanceTypes: InstanceType[]): NodegroupAmiType[] {
  function typeToArch(instanceType: InstanceType): AmiArchitecture {
    return isGpuInstanceType(instanceType) ? 'GPU' : instanceType.architecture;
  }
  const archAmiMap = new Map<AmiArchitecture, NodegroupAmiType[]>([
    [InstanceArchitecture.ARM_64, arm64AmiTypes],
    [InstanceArchitecture.X86_64, x8664AmiTypes],
    ['GPU', gpuAmiTypes],
  ]);
  const architectures: Set<AmiArchitecture> = new Set(instanceTypes.map(typeToArch));

  if (architectures.size === 0) { // protective code, the current implementation will never result in this.
    throw new Error(`Cannot determine any ami type comptaible with instance types: ${instanceTypes.map(i => i.toString).join(',')}`);
  }

  if (architectures.size > 1) {
    throw new Error('instanceTypes of different architectures is not allowed');
  }

  return archAmiMap.get(Array.from(architectures)[0])!;
}
