import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk8s from 'cdk8s';
import { Annotations, CfnOutput, Resource, Stack, Token, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster, ClusterAttributes, KubernetesVersion, NodeType, DefaultCapacityType, EksOptimizedImage, AutoScalingGroupCapacityOptions, MachineImageType, AutoScalingGroupOptions, CommonClusterOptions } from './cluster';
import { clusterArnComponents } from './cluster-resource';
import { CfnCluster, CfnClusterProps } from './eks.generated';
import { HelmChartOptions, HelmChart } from './helm-chart';
import { KubernetesManifest } from './k8s-manifest';
import { Nodegroup, NodegroupOptions } from './managed-nodegroup';
import { renderAmazonLinuxUserData, renderBottlerocketUserData } from './user-data';

// defaults are based on https://eksctl.io
const DEFAULT_CAPACITY_COUNT = 2;
const DEFAULT_CAPACITY_TYPE = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE);

/**
 * Common configuration props for EKS clusters.
 */
export interface LegacyClusterProps extends CommonClusterOptions {
  /**
   * Number of instances to allocate as an initial capacity for this cluster.
   * Instance type can be configured through `defaultCapacityInstanceType`,
   * which defaults to `m5.large`.
   *
   * Use `cluster.addCapacity` to add additional customized capacity. Set this
   * to `0` is you wish to avoid the initial capacity allocation.
   *
   * @default 2
   */
  readonly defaultCapacity?: number;

  /**
   * The instance type to use for the default capacity. This will only be taken
   * into account if `defaultCapacity` is > 0.
   *
   * @default m5.large
   */
  readonly defaultCapacityInstance?: ec2.InstanceType;

  /**
   * The default capacity type for the cluster.
   *
   * @default NODEGROUP
   */
  readonly defaultCapacityType?: DefaultCapacityType;

  /**
   * KMS secret for envelope encryption for Kubernetes secrets.
   *
   * @default - By default, Kubernetes stores all secret object data within etcd and
   *            all etcd volumes used by Amazon EKS are encrypted at the disk-level
   *            using AWS-Managed encryption keys.
   */
  readonly secretsEncryptionKey?: kms.IKey;
}

/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 *
 * @resource AWS::EKS::Cluster
 */
export class LegacyCluster extends Resource implements ICluster {
  /**
   * Import an existing cluster
   *
   * @param scope the construct scope, in most cases 'this'
   * @param id the id or name to import as
   * @param attrs the cluster properties to use for importing information
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    return new ImportedCluster(scope, id, attrs);
  }

  /**
   * The VPC in which this Cluster was created
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The Name of the created EKS Cluster
   */
  public readonly clusterName: string;

  /**
   * The AWS generated ARN for the Cluster resource
   *
   * @example arn:aws:eks:us-west-2:666666666666:cluster/prod
   */
  public readonly clusterArn: string;

  /**
   * The endpoint URL for the Cluster
   *
   * This is the URL inside the kubeconfig file to use with kubectl
   *
   * @example https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com
   */
  public readonly clusterEndpoint: string;

  /**
   * The certificate-authority-data for your cluster.
   */
  public readonly clusterCertificateAuthorityData: string;

  /**
   * The cluster security group that was created by Amazon EKS for the cluster.
   */
  public readonly clusterSecurityGroupId: string;

  /**
   * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
   */
  public readonly clusterEncryptionConfigKeyArn: string;

  /**
   * Manages connection rules (Security Group Rules) for the cluster
   *
   * @type {ec2.Connections}
   * @memberof Cluster
   */
  public readonly connections: ec2.Connections;

  /**
   * IAM role assumed by the EKS Control Plane
   */
  public readonly role: iam.IRole;

  /**
   * The auto scaling group that hosts the default capacity for this cluster.
   * This will be `undefined` if the `defaultCapacityType` is not `EC2` or
   * `defaultCapacityType` is `EC2` but default capacity is set to 0.
   */
  public readonly defaultCapacity?: autoscaling.AutoScalingGroup;

  /**
   * The node group that hosts the default capacity for this cluster.
   * This will be `undefined` if the `defaultCapacityType` is `EC2` or
   * `defaultCapacityType` is `NODEGROUP` but default capacity is set to 0.
   */
  public readonly defaultNodegroup?: Nodegroup;

  private readonly version: KubernetesVersion;

  /**
   * Initiates an EKS Cluster with the supplied arguments
   *
   * @param scope a Construct, most likely a cdk.Stack created
   * @param name the name of the Construct to create
   * @param props properties in the IClusterProps interface
   */
  constructor(scope: Construct, id: string, props: LegacyClusterProps) {
    super(scope, id, {
      physicalName: props.clusterName,
    });

    const stack = Stack.of(this);

    this.vpc = props.vpc || new ec2.Vpc(this, 'DefaultVpc');
    this.version = props.version;

    this.tagSubnets();

    // this is the role used by EKS when interacting with AWS resources
    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
      ],
    });

    const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'ControlPlaneSecurityGroup', {
      vpc: this.vpc,
      description: 'EKS Control Plane Security Group',
    });

    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
      defaultPort: ec2.Port.tcp(443), // Control Plane has an HTTPS API
    });

    // Get subnetIds for all selected subnets
    const placements = props.vpcSubnets || [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE }];
    const subnetIds = [...new Set(Array().concat(...placements.map(s => this.vpc.selectSubnets(s).subnetIds)))];

    const clusterProps: CfnClusterProps = {
      name: this.physicalName,
      roleArn: this.role.roleArn,
      version: props.version.version,
      resourcesVpcConfig: {
        securityGroupIds: [securityGroup.securityGroupId],
        subnetIds,
      },
      ...(props.secretsEncryptionKey ? {
        encryptionConfig: [{
          provider: {
            keyArn: props.secretsEncryptionKey.keyArn,
          },
          resources: ['secrets'],
        }],
      } : {} ),
    };

    const resource = new CfnCluster(this, 'Resource', clusterProps);

    this.clusterName = this.getResourceNameAttribute(resource.ref);
    this.clusterArn = this.getResourceArnAttribute(resource.attrArn, clusterArnComponents(this.physicalName));

    this.clusterEndpoint = resource.attrEndpoint;
    this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;
    this.clusterSecurityGroupId = resource.attrClusterSecurityGroupId;
    this.clusterEncryptionConfigKeyArn = resource.attrEncryptionConfigKeyArn;

    const updateConfigCommandPrefix = `aws eks update-kubeconfig --name ${this.clusterName}`;
    const getTokenCommandPrefix = `aws eks get-token --cluster-name ${this.clusterName}`;
    const commonCommandOptions = [`--region ${stack.region}`];

    if (props.outputClusterName) {
      new CfnOutput(this, 'ClusterName', { value: this.clusterName });
    }

    // allocate default capacity if non-zero (or default).
    const minCapacity = props.defaultCapacity === undefined ? DEFAULT_CAPACITY_COUNT : props.defaultCapacity;
    if (minCapacity > 0) {
      const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
      this.defaultCapacity = props.defaultCapacityType === DefaultCapacityType.EC2 ?
        this.addCapacity('DefaultCapacity', { instanceType, minCapacity }) : undefined;

      this.defaultNodegroup = props.defaultCapacityType !== DefaultCapacityType.EC2 ?
        this.addNodegroup('DefaultCapacity', { instanceType, minSize: minCapacity }) : undefined;
    }

    const outputConfigCommand = props.outputConfigCommand === undefined ? true : props.outputConfigCommand;
    if (outputConfigCommand) {
      const postfix = commonCommandOptions.join(' ');
      new CfnOutput(this, 'ConfigCommand', { value: `${updateConfigCommandPrefix} ${postfix}` });
      new CfnOutput(this, 'GetTokenCommand', { value: `${getTokenCommandPrefix} ${postfix}` });
    }
  }

  /**
   * Add nodes to this EKS cluster
   *
   * The nodes will automatically be configured with the right VPC and AMI
   * for the instance type and Kubernetes version.
   *
   * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
   */
  public addCapacity(id: string, options: AutoScalingGroupCapacityOptions): autoscaling.AutoScalingGroup {
    if (options.machineImageType === MachineImageType.BOTTLEROCKET && options.bootstrapOptions !== undefined ) {
      throw new Error('bootstrapOptions is not supported for Bottlerocket');
    }
    const asg = new autoscaling.AutoScalingGroup(this, id, {
      ...options,
      vpc: this.vpc,
      machineImage: options.machineImageType === MachineImageType.BOTTLEROCKET ?
        new BottleRocketImage() :
        new EksOptimizedImage({
          nodeType: nodeTypeForInstanceType(options.instanceType),
          kubernetesVersion: this.version.version,
        }),
      updateType: options.updateType || autoscaling.UpdateType.ROLLING_UPDATE,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(asg, {
      mapRole: options.mapRole,
      bootstrapOptions: options.bootstrapOptions,
      bootstrapEnabled: options.bootstrapEnabled,
      machineImageType: options.machineImageType,
    });

    return asg;
  }

  /**
   * Add managed nodegroup to this Amazon EKS cluster
   *
   * This method will create a new managed nodegroup and add into the capacity.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html
   * @param id The ID of the nodegroup
   * @param options options for creating a new nodegroup
   */
  public addNodegroup(id: string, options?: NodegroupOptions): Nodegroup {
    return new Nodegroup(this, `Nodegroup${id}`, {
      cluster: this,
      ...options,
    });
  }

  /**
   * Add compute capacity to this EKS cluster in the form of an AutoScalingGroup
   *
   * The AutoScalingGroup must be running an EKS-optimized AMI containing the
   * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
   * add the right policies to the instance role, apply the right tags, and add
   * the required user data to the instance's launch configuration.
   *
   * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
   * If kubectl is enabled, the
   * [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
   * daemon will be installed on all spot instances to handle
   * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
   *
   * Prefer to use `addCapacity` if possible.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
   * @param autoScalingGroup [disable-awslint:ref-via-interface]
   * @param options options for adding auto scaling groups, like customizing the bootstrap script
   */
  public addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options: AutoScalingGroupOptions) {
    // self rules
    autoScalingGroup.connections.allowInternally(ec2.Port.allTraffic());

    // Cluster to:nodes rules
    autoScalingGroup.connections.allowFrom(this, ec2.Port.tcp(443));
    autoScalingGroup.connections.allowFrom(this, ec2.Port.tcpRange(1025, 65535));

    // Allow HTTPS from Nodes to Cluster
    autoScalingGroup.connections.allowTo(this, ec2.Port.tcp(443));

    // Allow all node outbound traffic
    autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allTcp());
    autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allUdp());
    autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allIcmp());

    const bootstrapEnabled = options.bootstrapEnabled !== undefined ? options.bootstrapEnabled : true;
    if (options.bootstrapOptions && !bootstrapEnabled) {
      throw new Error('Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false');
    }

    if (bootstrapEnabled) {
      const userData = options.machineImageType === MachineImageType.BOTTLEROCKET ?
        renderBottlerocketUserData(this) :
        renderAmazonLinuxUserData(this.clusterName, autoScalingGroup, options.bootstrapOptions);
      autoScalingGroup.addUserData(...userData);
    }

    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    // EKS Required Tags
    Tags.of(autoScalingGroup).add(`kubernetes.io/cluster/${this.clusterName}`, 'owned', {
      applyToLaunchedInstances: true,
    });

    if (options.mapRole) {
      throw new Error('Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster');
    }

    // since we are not mapping the instance role to RBAC, synthesize an
    // output so it can be pasted into `aws-auth-cm.yaml`
    new CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
      value: autoScalingGroup.role.roleArn,
    });
  }

  public addManifest(_id: string, ..._manifest: any[]): KubernetesManifest {
    throw new Error('legacy cluster does not support adding kubernetes manifests');
  }

  public addHelmChart(_id: string, _options: HelmChartOptions): HelmChart {
    throw new Error('legacy cluster does not support adding helm charts');
  }

  public addCdk8sChart(_id: string, _chart: cdk8s.Chart): KubernetesManifest {
    throw new Error('legacy cluster does not support adding cdk8s charts');
  }

  /**
   * Opportunistically tag subnets with the required tags.
   *
   * If no subnets could be found (because this is an imported VPC), add a warning.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
   */
  private tagSubnets() {
    const tagAllSubnets = (type: string, subnets: ec2.ISubnet[], tag: string) => {
      for (const subnet of subnets) {
        // if this is not a concrete subnet, attach a construct warning
        if (!ec2.Subnet.isVpcSubnet(subnet)) {
          // message (if token): "could not auto-tag public/private subnet with tag..."
          // message (if not token): "count not auto-tag public/private subnet xxxxx with tag..."
          const subnetID = Token.isUnresolved(subnet.subnetId) ? '' : ` ${subnet.subnetId}`;
          Annotations.of(this).addWarning(`Could not auto-tag ${type} subnet${subnetID} with "${tag}=1", please remember to do this manually`);
          continue;
        }

        Tags.of(subnet).add(tag, '1');
      }
    };

    // https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
    tagAllSubnets('private', this.vpc.privateSubnets, 'kubernetes.io/role/internal-elb');
    tagAllSubnets('public', this.vpc.publicSubnets, 'kubernetes.io/role/elb');
  }
}

/**
 * Import a cluster to use in another stack
 */
class ImportedCluster extends Resource implements ICluster {
  public readonly clusterName: string;
  public readonly clusterArn: string;
  public readonly connections = new ec2.Connections();

  constructor(scope: Construct, id: string, private readonly props: ClusterAttributes) {
    super(scope, id);

    this.clusterName = props.clusterName;
    this.clusterArn = this.stack.formatArn(clusterArnComponents(props.clusterName));

    let i = 1;
    for (const sgid of props.securityGroupIds ?? []) {
      this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgid));
      i++;
    }
  }

  public addManifest(_id: string, ..._manifest: any[]): KubernetesManifest {
    throw new Error('legacy cluster does not support adding kubernetes manifests');
  }

  public addHelmChart(_id: string, _options: HelmChartOptions): HelmChart {
    throw new Error('legacy cluster does not support adding helm charts');
  }

  public addCdk8sChart(_id: string, _chart: cdk8s.Chart): KubernetesManifest {
    throw new Error('legacy cluster does not support adding cdk8s charts');
  }

  public get vpc() {
    if (!this.props.vpc) {
      throw new Error('"vpc" is not defined for this imported cluster');
    }
    return this.props.vpc;
  }

  public get clusterSecurityGroupId(): string {
    if (!this.props.clusterSecurityGroupId) {
      throw new Error('"clusterSecurityGroupId" is not defined for this imported cluster');
    }
    return this.props.clusterSecurityGroupId;
  }

  public get clusterEndpoint(): string {
    if (!this.props.clusterEndpoint) {
      throw new Error('"clusterEndpoint" is not defined for this imported cluster');
    }
    return this.props.clusterEndpoint;
  }

  public get clusterCertificateAuthorityData(): string {
    if (!this.props.clusterCertificateAuthorityData) {
      throw new Error('"clusterCertificateAuthorityData" is not defined for this imported cluster');
    }
    return this.props.clusterCertificateAuthorityData;
  }

  public get clusterEncryptionConfigKeyArn(): string {
    if (!this.props.clusterEncryptionConfigKeyArn) {
      throw new Error('"clusterEncryptionConfigKeyArn" is not defined for this imported cluster');
    }
    return this.props.clusterEncryptionConfigKeyArn;
  }

}

/**
 * Construct an Bottlerocket image from the latest AMI published in SSM
 */
class BottleRocketImage implements ec2.IMachineImage {
  private readonly kubernetesVersion?: string;

  private readonly amiParameterName: string;

  /**
   * Constructs a new instance of the BottleRocketImage class.
   */
  public constructor() {
    // only 1.15 is currently available
    this.kubernetesVersion = '1.15';

    // set the SSM parameter name
    this.amiParameterName = `/aws/service/bottlerocket/aws-k8s-${this.kubernetesVersion}/x86_64/latest/image_id`;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
    return {
      imageId: ami,
      osType: ec2.OperatingSystemType.LINUX,
      userData: ec2.UserData.custom(''),
    };
  }
}

const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];
const INFERENTIA_INSTANCETYPES = ['inf1'];

function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? NodeType.GPU :
    INFERENTIA_INSTANCETYPES.includes(instanceType.toString().substring(0, 4)) ? NodeType.INFERENTIA :
      NodeType.STANDARD;
}
