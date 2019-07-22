import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import { Subnet } from '@aws-cdk/aws-ec2';
import iam = require('@aws-cdk/aws-iam');
import { CfnOutput, Construct, IResource, Resource, Tag } from '@aws-cdk/core';
import { EksOptimizedAmi, nodeTypeForInstanceType } from './ami';
import { CfnCluster } from './eks.generated';
import { maxPodsForInstanceType } from './instance-data';

/**
 * An EKS cluster
 */
export interface ICluster extends IResource, ec2.IConnectable {
  /**
   * The VPC in which this Cluster was created
   */
  readonly vpc: ec2.IVpc;

  /**
   * The physical name of the Cluster
   * @attribute
   */
  readonly clusterName: string;

  /**
   * The unique ARN assigned to the service by AWS
   * in the form of arn:aws:eks:
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * The API Server endpoint URL
   * @attribute
   */
  readonly clusterEndpoint: string;

  /**
   * The certificate-authority-data for your cluster.
   * @attribute
   */
  readonly clusterCertificateAuthorityData: string;
}

export interface ClusterAttributes {
  /**
   * The VPC in which this Cluster was created
   */
  readonly vpc: ec2.IVpc;

  /**
   * The physical name of the Cluster
   */
  readonly clusterName: string;

  /**
   * The unique ARN assigned to the service by AWS
   * in the form of arn:aws:eks:
   */
  readonly clusterArn: string;

  /**
   * The API Server endpoint URL
   */
  readonly clusterEndpoint: string;

  /**
   * The certificate-authority-data for your cluster.
   */
  readonly clusterCertificateAuthorityData: string;

  readonly securityGroups: ec2.ISecurityGroup[];
}

/**
 * Properties to instantiate the Cluster
 */
export interface ClusterProps {
  /**
   * The VPC in which to create the Cluster
   */
  readonly vpc: ec2.IVpc;

  /**
   * Where to place EKS Control Plane ENIs
   *
   * If you want to create public load balancers, this must include public subnets.
   *
   * For example, to only select private subnets, supply the following:
   *
   * ```ts
   * vpcSubnets: [
   *   { subnetType: ec2.SubnetType.Private }
   * ]
   * ```
   *
   * @default All public and private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection[];

  /**
   * Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.
   *
   * @default A role is automatically created for you
   */
  readonly role?: iam.IRole;

  /**
   * Name for the cluster.
   *
   * @default Automatically generated name
   */
  readonly clusterName?: string;

  /**
   * Security Group to use for Control Plane ENIs
   *
   * @default A security group is automatically created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The Kubernetes version to run in the cluster
   *
   * @default If not supplied, will use Amazon default version
   */
  readonly version?: string;
}

/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 */
export class Cluster extends Resource implements ICluster {
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

  private readonly version: string | undefined;

  /**
   * Initiates an EKS Cluster with the supplied arguments
   *
   * @param scope a Construct, most likely a cdk.Stack created
   * @param name the name of the Construct to create
   * @param props properties in the IClusterProps interface
   */
  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id, {
      physicalName: props.clusterName,
    });

    this.vpc = props.vpc;
    this.version = props.version;

    this.tagSubnets();

    this.role = props.role || new iam.Role(this, 'ClusterRole', {
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy'),
      ],
    });

    const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'ControlPlaneSecurityGroup', {
      vpc: props.vpc,
      description: 'EKS Control Plane Security Group',
    });

    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
      defaultPort: ec2.Port.tcp(443), // Control Plane has an HTTPS API
    });

    // Get subnetIds for all selected subnets
    const placements = props.vpcSubnets || [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE }];
    const subnetIds = [...new Set(Array().concat(...placements.map(s => props.vpc.selectSubnets(s).subnetIds)))];

    const resource = new CfnCluster(this, 'Resource', {
      name: this.physicalName,
      roleArn: this.role.roleArn,
      version: props.version,
      resourcesVpcConfig: {
        securityGroupIds: [securityGroup.securityGroupId],
        subnetIds
      }
    });

    this.clusterName = this.getResourceNameAttribute(resource.ref);
    this.clusterArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'cluster',
      resourceName: this.physicalName,
    });

    this.clusterEndpoint = resource.attrEndpoint;
    this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;

    new CfnOutput(this, 'ClusterName', { value: this.clusterName });
  }

  /**
   * Add nodes to this EKS cluster
   *
   * The nodes will automatically be configured with the right VPC and AMI
   * for the instance type and Kubernetes version.
   */
  public addCapacity(id: string, options: AddWorkerNodesOptions): autoscaling.AutoScalingGroup {
    const asg = new autoscaling.AutoScalingGroup(this, id, {
      ...options,
      vpc: this.vpc,
      machineImage: new EksOptimizedAmi({
        nodeType: nodeTypeForInstanceType(options.instanceType),
        kubernetesVersion: this.version,
      }),
      updateType: options.updateType || autoscaling.UpdateType.ROLLING_UPDATE,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(asg, {
      maxPods: maxPodsForInstanceType(options.instanceType),
    });

    return asg;
  }

  /**
   * Add compute capacity to this EKS cluster in the form of an AutoScalingGroup
   *
   * The AutoScalingGroup must be running an EKS-optimized AMI containing the
   * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
   * add the right policies to the instance role, apply the right tags, and add
   * the required user data to the instance's launch configuration.
   *
   * Prefer to use `addCapacity` if possible, it will automatically configure
   * the right AMI and the `maxPods` number based on your instance type.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
   * @param autoScalingGroup [disable-awslint:ref-via-interface]
   */
  public addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options: AddAutoScalingGroupOptions) {
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

    autoScalingGroup.addUserData(
      'set -o xtrace',
      `/etc/eks/bootstrap.sh ${this.clusterName} --use-max-pods ${options.maxPods}`,
    );
    // FIXME: Add a cfn-signal call once we've sorted out UserData and can write reliable
    // signaling scripts: https://github.com/aws/aws-cdk/issues/623

    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    // EKS Required Tags
    autoScalingGroup.node.applyAspect(new Tag(`kubernetes.io/cluster/${this.clusterName}`, 'owned', { applyToLaunchedInstances: true }));

    // Create an CfnOutput for the Instance Role ARN (need to paste it into aws-auth-cm.yaml)
    new CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
      value: autoScalingGroup.role.roleArn
    });
  }

  /**
   * Opportunistically tag subnets with the required tags.
   *
   * If no subnets could be found (because this is an imported VPC), add a warning.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
   */
  private tagSubnets() {
    for (const subnet of this.vpc.privateSubnets) {
      if (!Subnet.isVpcSubnet(subnet)) {
        // Just give up, all of them will be the same.
        this.node.addWarning('Could not auto-tag private subnets with "kubernetes.io/role/internal-elb=1", please remember to do this manually');
        return;
      }

      subnet.node.applyAspect(new Tag("kubernetes.io/role/internal-elb", "1"));
    }
  }
}

/**
 * Options for adding worker nodes
 */
export interface AddWorkerNodesOptions extends autoscaling.CommonAutoScalingGroupProps {
  /**
   * Instance type of the instances to start
   */
  readonly instanceType: ec2.InstanceType;
}

/**
 * Options for adding an AutoScalingGroup as capacity
 */
export interface AddAutoScalingGroupOptions {
  /**
   * How many pods to allow on this instance.
   *
   * Should be at most equal to the maximum number of IP addresses available to
   * the instance type less one.
   */
  readonly maxPods: number;
}

/**
 * Import a cluster to use in another stack
 */
class ImportedCluster extends Resource implements ICluster {
  public readonly vpc: ec2.IVpc;
  public readonly clusterCertificateAuthorityData: string;
  public readonly clusterName: string;
  public readonly clusterArn: string;
  public readonly clusterEndpoint: string;
  public readonly connections = new ec2.Connections();

  constructor(scope: Construct, id: string, props: ClusterAttributes) {
    super(scope, id);

    this.vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", props.vpc);
    this.clusterName = props.clusterName;
    this.clusterEndpoint = props.clusterEndpoint;
    this.clusterArn = props.clusterArn;
    this.clusterCertificateAuthorityData = props.clusterCertificateAuthorityData;

    let i = 1;
    for (const sgProps of props.securityGroups) {
      this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgProps.securityGroupId));
      i++;
    }
  }
}
