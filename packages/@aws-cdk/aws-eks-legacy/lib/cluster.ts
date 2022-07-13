import * as path from 'path';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';
import { Annotations, CfnOutput, Duration, IResource, Resource, Stack, Token, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AwsAuth } from './aws-auth';
import { ClusterResource } from './cluster-resource';
import { CfnCluster, CfnClusterProps } from './eks.generated';
import { HelmChart, HelmChartOptions } from './helm-chart';
import { KubernetesResource } from './k8s-resource';
import { KubectlLayer } from './kubectl-layer';
import { spotInterruptHandler } from './spot-interrupt-handler';
import { renderUserData } from './user-data';

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
   * const vpcSubnets = [
   *   { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT }
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
 *
 * @resource AWS::EKS::Cluster
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
   * For example, `arn:aws:eks:us-west-2:666666666666:cluster/prod`
   */
  public readonly clusterArn: string;

  /**
   * The endpoint URL for the Cluster
   *
   * This is the URL inside the kubeconfig file to use with kubectl
   *
   * For example, `https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com`
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
   *
   * @internal
   */
  public readonly _defaultMastersRole?: iam.IRole;

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

    Annotations.of(this).addWarning('The @aws-cdk/aws-eks-legacy module will no longer be released as part of the AWS CDK starting March 1st, 2020. Please refer to https://github.com/aws/aws-cdk/issues/5544 for upgrade instructions');

    const stack = Stack.of(this);

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
    const placements = props.vpcSubnets || [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT }];
    const subnetIds = [...new Set(Array().concat(...placements.map(s => this.vpc.selectSubnets(s).subnetIds)))];

    const clusterProps: CfnClusterProps = {
      name: this.physicalName,
      roleArn: this.role.roleArn,
      version: props.version,
      resourcesVpcConfig: {
        securityGroupIds: [securityGroup.securityGroupId],
        subnetIds,
      },
    };

    let resource;
    this.kubectlEnabled = props.kubectlEnabled ?? true;
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

    const updateConfigCommandPrefix = `aws eks update-kubeconfig --name ${this.clusterName}`;
    const getTokenCommandPrefix = `aws eks get-token --cluster-name ${this.clusterName}`;
    const commonCommandOptions = [`--region ${stack.region}`];

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
        throw new Error('Cannot specify a "masters" role if kubectl is disabled');
      }

      this.awsAuth.addMastersRole(props.mastersRole);

      if (props.outputMastersRoleArn) {
        new CfnOutput(this, 'MastersRoleArn', { value: props.mastersRole.roleArn });
      }

      commonCommandOptions.push(`--role-arn ${props.mastersRole.roleArn}`);
    }

    // allocate default capacity if non-zero (or default).
    const desiredCapacity = props.defaultCapacity ?? DEFAULT_CAPACITY_COUNT;
    if (desiredCapacity > 0) {
      const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
      this.defaultCapacity = this.addCapacity('DefaultCapacity', { instanceType, desiredCapacity });
    }

    const outputConfigCommand = props.outputConfigCommand ?? true;
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
   * If kubectl is enabled, the
   * [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
   * daemon will be installed on all spot instances to handle
   * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
   */
  public addCapacity(id: string, options: CapacityOptions): autoscaling.AutoScalingGroup {
    const asg = new autoscaling.AutoScalingGroup(this, id, {
      ...options,
      vpc: this.vpc,
      machineImage: new EksOptimizedImage({
        nodeType: nodeTypeForInstanceType(options.instanceType),
        kubernetesVersion: this.version,
      }),
      updateType: options.updateType || autoscaling.UpdateType.ROLLING_UPDATE,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(asg, {
      mapRole: options.mapRole,
      bootstrapOptions: options.bootstrapOptions,
      bootstrapEnabled: options.bootstrapEnabled,
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

    const bootstrapEnabled = options.bootstrapEnabled ?? true;
    if (options.bootstrapOptions && !bootstrapEnabled) {
      throw new Error('Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false');
    }

    if (bootstrapEnabled) {
      const userData = renderUserData(this.clusterName, autoScalingGroup, options.bootstrapOptions);
      autoScalingGroup.addUserData(...userData);
    }

    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    // EKS Required Tags
    Tags.of(autoScalingGroup).add(`kubernetes.io/cluster/${this.clusterName}`, 'owned', {
      applyToLaunchedInstances: true,
    });

    if (options.mapRole === true && !this.kubectlEnabled) {
      throw new Error('Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster');
    }

    // do not attempt to map the role if `kubectl` is not enabled for this
    // cluster or if `mapRole` is set to false. By default this should happen.
    const mapRole = options.mapRole ?? true;
    if (mapRole && this.kubectlEnabled) {
      // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
      this.awsAuth.addRoleMapping(autoScalingGroup.role, {
        username: 'system:node:{{EC2PrivateDNSName}}',
        groups: [
          'system:bootstrappers',
          'system:nodes',
        ],
      });
    } else {
      // since we are not mapping the instance role to RBAC, synthesize an
      // output so it can be pasted into `aws-auth-cm.yaml`
      new CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
        value: autoScalingGroup.role.roleArn,
      });
    }

    // if this is an ASG with spot instances, install the spot interrupt handler (only if kubectl is enabled).
    if (autoScalingGroup.spotPrice && this.kubectlEnabled) {
      this.addResource('spot-interrupt-handler', ...spotInterruptHandler());
    }
  }

  /**
   * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
   */
  public get awsAuth() {
    if (!this.kubectlEnabled) {
      throw new Error('Cannot define aws-auth mappings if kubectl is disabled');
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

  /**
   * Defines a Helm chart in this cluster.
   *
   * @param id logical id of this chart.
   * @param options options of this chart.
   * @returns a `HelmChart` object
   * @throws If `kubectlEnabled` is `false`
   */
  public addChart(id: string, options: HelmChartOptions) {
    return new HelmChart(this, `chart-${id}`, { cluster: this, ...options });
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
      layers: [KubectlLayer.getOrCreate(this)],
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

  /**
   * Configures the EC2 user-data script for instances in this autoscaling group
   * to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it
   * with the EKS cluster.
   *
   * If you wish to provide a custom user data script, set this to `false` and
   * manually invoke `autoscalingGroup.addUserData()`.
   *
   * @default true
   */
  readonly bootstrapEnabled?: boolean;

  /**
   * EKS node bootstrapping options.
   *
   * @default - none
   */
  readonly bootstrapOptions?: BootstrapOptions;
}

export interface BootstrapOptions {
  /**
   * Sets `--max-pods` for the kubelet based on the capacity of the EC2 instance.
   *
   * @default true
   */
  readonly useMaxPods?: boolean;

  /**
   * Restores the docker default bridge network.
   *
   * @default false
   */
  readonly enableDockerBridge?: boolean;

  /**
   * Number of retry attempts for AWS API call (DescribeCluster).
   *
   * @default 3
   */
  readonly awsApiRetryAttempts?: number;

  /**
   * The contents of the `/etc/docker/daemon.json` file. Useful if you want a
   * custom config differing from the default one in the EKS AMI.
   *
   * @default - none
   */
  readonly dockerConfigJson?: string;

  /**
   * Extra arguments to add to the kubelet. Useful for adding labels or taints.
   *
   * For example, `--node-labels foo=bar,goo=far`
   * @default - none
   */
  readonly kubeletExtraArgs?: string;

  /**
   * Additional command line arguments to pass to the `/etc/eks/bootstrap.sh`
   * command.
   *
   * @see https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh
   * @default - none
   */
  readonly additionalArgs?: string;
}

/**
 * Options for adding an AutoScalingGroup as capacity
 */
export interface AutoScalingGroupOptions {
  /**
   * Will automatically update the aws-auth ConfigMap to map the IAM instance
   * role to RBAC.
   *
   * This cannot be explicitly set to `true` if the cluster has kubectl disabled.
   *
   * @default - true if the cluster has kubectl enabled (which is the default).
   */
  readonly mapRole?: boolean;

  /**
   * Configures the EC2 user-data script for instances in this autoscaling group
   * to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it
   * with the EKS cluster.
   *
   * If you wish to provide a custom user data script, set this to `false` and
   * manually invoke `autoscalingGroup.addUserData()`.
   *
   * @default true
   */
  readonly bootstrapEnabled?: boolean;

  /**
   * Allows options for node bootstrapping through EC2 user data.
   */
  readonly bootstrapOptions?: BootstrapOptions;
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

    this.vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', props.vpc);
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

/**
 * Properties for EksOptimizedImage
 */
export interface EksOptimizedImageProps {
  /**
   * What instance type to retrieve the image for (standard or GPU-optimized)
   *
   * @default NodeType.STANDARD
   */
  readonly nodeType?: NodeType;

  /**
   * The Kubernetes version to use
   *
   * @default - The latest version
   */
  readonly kubernetesVersion?: string;
}

/**
 * Construct an Amazon Linux 2 image from the latest EKS Optimized AMI published in SSM
 */
export class EksOptimizedImage implements ec2.IMachineImage {
  private readonly nodeType?: NodeType;
  private readonly kubernetesVersion?: string;

  private readonly amiParameterName: string;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  public constructor(props: EksOptimizedImageProps) {
    this.nodeType = props && props.nodeType;
    this.kubernetesVersion = props && props.kubernetesVersion || LATEST_KUBERNETES_VERSION;

    // set the SSM parameter name
    this.amiParameterName = `/aws/service/eks/optimized-ami/${this.kubernetesVersion}/`
      + ( this.nodeType === NodeType.STANDARD ? 'amazon-linux-2/' : '' )
      + ( this.nodeType === NodeType.GPU ? 'amazon-linux2-gpu/' : '' )
      + 'recommended/image_id';
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
    return {
      imageId: ami,
      osType: ec2.OperatingSystemType.LINUX,
      userData: ec2.UserData.forLinux(),
    };
  }
}

// MAINTAINERS: use ./scripts/kube_bump.sh to update LATEST_KUBERNETES_VERSION
const LATEST_KUBERNETES_VERSION = '1.14';

/**
 * Whether the worker nodes should support GPU or just standard instances
 */
export enum NodeType {
  /**
   * Standard instances
   */
  STANDARD = 'Standard',

  /**
   * GPU instances
   */
  GPU = 'GPU',
}

const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];

export function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? NodeType.GPU : NodeType.STANDARD;
}
