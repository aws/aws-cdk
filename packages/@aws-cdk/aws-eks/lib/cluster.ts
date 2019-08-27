import autoscaling = require('@aws-cdk/aws-autoscaling');
import { Subnet } from '@aws-cdk/aws-ec2';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, Duration, IResource, Resource, Tag } from '@aws-cdk/core';
import path = require('path');
import { EksOptimizedAmi, nodeTypeForInstanceType } from './ami';
import { AwsAuth } from './aws-auth';
import { ClusterResource } from './cluster-resource';
import { CfnCluster, CfnClusterProps } from './eks.generated';
import { MAX_PODS } from './instance-data';
import { KubernetesResource } from './k8s-resource';
import { KubectlLayer } from './kubectl-layer';

// defaults are based on https://eksctl.io
const DEFAULT_CAPACITY_COUNT = 2;
const DEFAULT_CAPACITY_TYPE = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE);

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

  /**
   * The security groups associated with this cluster.
   */
  readonly securityGroups: ec2.ISecurityGroup[];
}

/**
 * Properties to instantiate the Cluster
 */
export interface ClusterProps {
  /**
   * The VPC in which to create the Cluster
   *
   * @default - a VPC with default configuration will be created and can be accessed through `cluster.vpc`.
   */
  readonly vpc?: ec2.IVpc;

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
   * @default - All public and private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection[];

  /**
   * Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.
   *
   * @default - A role is automatically created for you
   */
  readonly role?: iam.IRole;

  /**
   * Name for the cluster.
   *
   * @default - Automatically generated name
   */
  readonly clusterName?: string;

  /**
   * Security Group to use for Control Plane ENIs
   *
   * @default - A security group is automatically created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The Kubernetes version to run in the cluster
   *
   * @default - If not supplied, will use Amazon default version
   */
  readonly version?: string;

  /**
   * An IAM role that will be added to the `system:masters` Kubernetes RBAC
   * group.
   *
   * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings
   *
   * @default - By default, it will only possible to update this Kubernetes
   *            system by adding resources to this cluster via `addResource` or
   *            by defining `KubernetesResource` resources in your AWS CDK app.
   *            Use this if you wish to grant cluster administration privileges
   *            to another role.
   */
  readonly mastersRole?: iam.IRole;

  /**
   * Allows defining `kubectrl`-related resources on this cluster.
   *
   * If this is disabled, it will not be possible to use the following
   * capabilities:
   * - `addResource`
   * - `addRoleMapping`
   * - `addUserMapping`
   * - `addMastersRole` and `props.mastersRole`
   *
   * If this is disabled, the cluster can only be managed by issuing `kubectl`
   * commands from a session that uses the IAM role/user that created the
   * account.
   *
   * _NOTE_: changing this value will destoy the cluster. This is because a
   * managable cluster must be created using an AWS CloudFormation custom
   * resource which executes with an IAM role owned by the CDK app.
   *
   * @default true The cluster can be managed by the AWS CDK application.
   */
  readonly kubectlEnabled?: boolean;

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
   * Determines whether a CloudFormation output with the name of the cluster
   * will be synthesized.
   *
   * @default false
   */
  readonly outputClusterName?: boolean;

  /**
   * Determines whether a CloudFormation output with the ARN of the "masters"
   * IAM role will be synthesized (if `mastersRole` is specified).
   *
   * @default false
   */
  readonly outputMastersRoleArn?: boolean;

  /**
   * Determines whether a CloudFormation output with the `aws eks
   * update-kubeconfig` command will be synthesized. This command will include
   * the cluster name and, if applicable, the ARN of the masters IAM role.
   *
   * @default true
   */
  readonly outputConfigCommand?: boolean;
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

  /**
   * Indicates if `kubectl` related operations can be performed on this cluster.
   */
  public readonly kubectlEnabled: boolean;

  /**
   * The CloudFormation custom resource handler that can apply Kubernetes
   * manifests to this cluster.
   *
   * @internal
   */
  public readonly _k8sResourceHandler?: lambda.Function;

  /**
   * The auto scaling group that hosts the default capacity for this cluster.
   * This will be `undefined` if the default capacity is set to 0.
   */
  public readonly defaultCapacity?: autoscaling.AutoScalingGroup;

  /**
   * The IAM role that was used to create this cluster. This role is
   * automatically added by Amazon EKS to the `system:masters` RBAC group of the
   * cluster. Use `addMastersRole` or `props.mastersRole` to define additional
   * IAM roles as administrators.
   */
  private readonly _defaultMastersRole?: iam.IRole;

  /**
   * Manages the aws-auth config map.
   */
  private _awsAuth?: AwsAuth;

  private readonly version: string | undefined;

  /**
   * Initiates an EKS Cluster with the supplied arguments
   *
   * @param scope a Construct, most likely a cdk.Stack created
   * @param name the name of the Construct to create
   * @param props properties in the IClusterProps interface
   */
  constructor(scope: Construct, id: string, props: ClusterProps = { }) {
    super(scope, id, {
      physicalName: props.clusterName,
    });

    this.vpc = props.vpc || new ec2.Vpc(this, 'DefaultVpc');
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
      version: props.version,
      resourcesVpcConfig: {
        securityGroupIds: [securityGroup.securityGroupId],
        subnetIds
      }
    };

    let resource;
    this.kubectlEnabled = props.kubectlEnabled === undefined ? true : props.kubectlEnabled;
    if (this.kubectlEnabled) {
      resource = new ClusterResource(this, 'Resource', clusterProps);
      this._defaultMastersRole = resource.creationRole;
    } else {
      resource = new CfnCluster(this, 'Resource', clusterProps);
    }

    this.clusterName = this.getResourceNameAttribute(resource.ref);
    this.clusterArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'cluster',
      resourceName: this.physicalName,
    });

    this.clusterEndpoint = resource.attrEndpoint;
    this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;

    let configCommand = `aws eks update-kubeconfig --name ${this.clusterName}`;

    if (props.outputClusterName) {
      new CfnOutput(this, 'ClusterName', { value: this.clusterName });
    }

    // we maintain a single manifest custom resource handler per cluster since
    // permissions and role are scoped. This will return `undefined` if kubectl
    // is not enabled for this cluster.
    this._k8sResourceHandler = this.createKubernetesResourceHandler();

    // map the IAM role to the `system:masters` group.
    if (props.mastersRole) {
      if (!this.kubectlEnabled) {
        throw new Error(`Cannot specify a "masters" role if kubectl is disabled`);
      }

      this.awsAuth.addMastersRole(props.mastersRole);

      if (props.outputMastersRoleArn) {
        new CfnOutput(this, 'MastersRoleArn', { value: props.mastersRole.roleArn });
      }

      configCommand += ` --role-arn ${props.mastersRole.roleArn}`;
    }

    // allocate default capacity if non-zero (or default).
    const desiredCapacity = props.defaultCapacity === undefined ? DEFAULT_CAPACITY_COUNT : props.defaultCapacity;
    if (desiredCapacity > 0) {
      const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
      this.defaultCapacity = this.addCapacity('DefaultCapacity', { instanceType, desiredCapacity });
    }

    const outputConfigCommand = props.outputConfigCommand === undefined ? true : props.outputConfigCommand;
    if (outputConfigCommand) {
      new CfnOutput(this, 'ConfigCommand', { value: configCommand });
    }
  }

  /**
   * Add nodes to this EKS cluster
   *
   * The nodes will automatically be configured with the right VPC and AMI
   * for the instance type and Kubernetes version.
   */
  public addCapacity(id: string, options: CapacityOptions): autoscaling.AutoScalingGroup {
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
      mapRole: options.mapRole,
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

    if (options.mapRole === true && !this.kubectlEnabled) {
      throw new Error(`Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster`);
    }

    // do not attempt to map the role if `kubectl` is not enabled for this
    // cluster or if `mapRole` is set to false. By default this should happen.
    const mapRole = options.mapRole === undefined ? true : options.mapRole;
    if (mapRole && this.kubectlEnabled) {
      // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
      this.awsAuth.addRoleMapping(autoScalingGroup.role, {
        username: 'system:node:{{EC2PrivateDNSName}}',
        groups: [
          'system:bootstrappers',
          'system:nodes'
        ]
      });
    } else {
      // since we are not mapping the instance role to RBAC, synthesize an
      // output so it can be pasted into `aws-auth-cm.yaml`
      new CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
        value: autoScalingGroup.role.roleArn
      });
    }
  }

  /**
   * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
   */
  public get awsAuth() {
    if (!this.kubectlEnabled) {
      throw new Error(`Cannot define aws-auth mappings if kubectl is disabled`);
    }

    if (!this._awsAuth) {
      this._awsAuth = new AwsAuth(this, 'AwsAuth', { cluster: this });
    }

    return this._awsAuth;
  }

  /**
   * Defines a Kubernetes resource in this cluster.
   *
   * The manifest will be applied/deleted using kubectl as needed.
   *
   * @param id logical id of this manifest
   * @param manifest a list of Kubernetes resource specifications
   * @returns a `KubernetesResource` object.
   * @throws If `kubectlEnabled` is `false`
   */
  public addResource(id: string, ...manifest: any[]) {
    return new KubernetesResource(this, `manifest-${id}`, { cluster: this, manifest });
  }

  private createKubernetesResourceHandler() {
    if (!this.kubectlEnabled) {
      return undefined;
    }

    return new lambda.Function(this, 'KubernetesResourceHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'k8s-resource')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      layers: [ KubectlLayer.getOrCreate(this) ],
      memorySize: 256,
      environment: {
        CLUSTER_NAME: this.clusterName,
      },

      // NOTE: we must use the default IAM role that's mapped to "system:masters"
      // as the execution role of this custom resource handler. This is the only
      // way to be able to interact with the cluster after it's been created.
      role: this._defaultMastersRole,
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
export interface CapacityOptions extends autoscaling.CommonAutoScalingGroupProps {
  /**
   * Instance type of the instances to start
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * Will automatically update the aws-auth ConfigMap to map the IAM instance
   * role to RBAC.
   *
   * This cannot be explicitly set to `true` if the cluster has kubectl disabled.
   *
   * @default - true if the cluster has kubectl enabled (which is the default).
   */
  readonly mapRole?: boolean;
}

/**
 * Options for adding an AutoScalingGroup as capacity
 */
export interface AutoScalingGroupOptions {
  /**
   * How many pods to allow on this instance.
   *
   * Should be at most equal to the maximum number of IP addresses available to
   * the instance type less one.
   */
  readonly maxPods: number;

  /**
   * Will automatically update the aws-auth ConfigMap to map the IAM instance
   * role to RBAC.
   *
   * This cannot be explicitly set to `true` if the cluster has kubectl disabled.
   *
   * @default - true if the cluster has kubectl enabled (which is the default).
   */
  readonly mapRole?: boolean;
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

export function maxPodsForInstanceType(instanceType: ec2.InstanceType) {
  const num = MAX_PODS.get(instanceType.toString());
  if (num === undefined) {
    throw new Error(`Instance type not supported for EKS: ${instanceType.toString()}. Please pick a different instance type.`);
  }
  return num;
}