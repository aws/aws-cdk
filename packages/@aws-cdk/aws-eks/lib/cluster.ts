import * as fs from 'fs';
import * as path from 'path';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput, CfnResource, Construct, IResource, Resource, Stack, Tags, Token, Duration } from '@aws-cdk/core';
import * as YAML from 'yaml';
import { AwsAuth } from './aws-auth';
import { clusterArnComponents, ClusterResource } from './cluster-resource';
import { CfnClusterProps } from './eks.generated';
import { FargateProfile, FargateProfileOptions } from './fargate-profile';
import { HelmChart, HelmChartOptions } from './helm-chart';
import { KubernetesManifest } from './k8s-manifest';
import { KubernetesObjectValue } from './k8s-object-value';
import { KubernetesPatch } from './k8s-patch';
import { KubectlProvider, KubectlProviderProps } from './kubectl-provider';
import { Nodegroup, NodegroupOptions } from './managed-nodegroup';
import { ServiceAccount, ServiceAccountOptions } from './service-account';
import { LifecycleLabel, renderAmazonLinuxUserData, renderBottlerocketUserData } from './user-data';

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

  /**
   * The cluster security group that was created by Amazon EKS for the cluster.
   * @attribute
   */
  readonly clusterSecurityGroupId: string;

  /**
   * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
   * @attribute
   */
  readonly clusterEncryptionConfigKeyArn: string;
}

/**
 * Attributes for EKS clusters.
 */
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
   * The cluster security group that was created by Amazon EKS for the cluster.
   */
  readonly clusterSecurityGroupId: string;

  /**
   * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
   */
  readonly clusterEncryptionConfigKeyArn: string;

  /**
   * The security groups associated with this cluster.
   */
  readonly securityGroups: ec2.ISecurityGroup[];
}

/**
 * Options for configuring an EKS cluster.
 */
export interface CommonClusterOptions {
  /**
   * The VPC in which to create the Cluster.
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
   */
  readonly version: KubernetesVersion;

  /**
   * Determines whether a CloudFormation output with the name of the cluster
   * will be synthesized.
   *
   * @default false
   */
  readonly outputClusterName?: boolean;

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
 * Options for EKS clusters.
 */
export interface ClusterOptions extends CommonClusterOptions {
  /**
   * An IAM role that will be added to the `system:masters` Kubernetes RBAC
   * group.
   *
   * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings
   *
   * @default - a role that assumable by anyone with permissions in the same
   * account will automatically be defined
   */
  readonly mastersRole?: iam.IRole;

  /**
   * Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS
   * configuration on your cluster to determine which compute type to use
   * for CoreDNS.
   *
   * @default CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)
   */
  readonly coreDnsComputeType?: CoreDnsComputeType;

  /**
   * Determines whether a CloudFormation output with the ARN of the "masters"
   * IAM role will be synthesized (if `mastersRole` is specified).
   *
   * @default false
   */
  readonly outputMastersRoleArn?: boolean;

  /**
   * Configure access to the Kubernetes API server endpoint..
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html
   *
   * @default EndpointAccess.PUBLIC_AND_PRIVATE
   */
  readonly endpointAccess?: EndpointAccess;

  /**
   * Environment variables for the kubectl execution. Only relevant for kubectl enabled clusters.
   *
   * @default - No environment variables.
   */
  readonly kubectlEnvironment?: { [key: string]: string };
}

/**
 * Group access configuration together.
 */
interface EndpointAccessConfig {

  /**
   * Indicates if private access is enabled.
   */
  readonly privateAccess: boolean;

  /**
   * Indicates if public access is enabled.
   */
  readonly publicAccess: boolean;
  /**
   * Public access is allowed only from these CIDR blocks.
   * An empty array means access is open to any address.
   *
   * @default - No restrictions.
   */
  readonly publicCidrs?: string[];

}

/**
 * Endpoint access characteristics.
 */
export class EndpointAccess {

  /**
   * The cluster endpoint is accessible from outside of your VPC.
   * Worker node traffic will leave your VPC to connect to the endpoint.
   *
   * By default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC.onlyFrom` method.
   * If you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you
   * specify include the addresses that worker nodes and Fargate pods (if you use them)
   * access the public endpoint from.
   *
   * @param cidr The CIDR blocks.
   */
  public static readonly PUBLIC = new EndpointAccess({ privateAccess: false, publicAccess: true });

  /**
   * The cluster endpoint is only accessible through your VPC.
   * Worker node traffic to the endpoint will stay within your VPC.
   */
  public static readonly PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: false });

  /**
   * The cluster endpoint is accessible from outside of your VPC.
   * Worker node traffic to the endpoint will stay within your VPC.
   *
   * By default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC_AND_PRIVATE.onlyFrom` method.
   * If you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you
   * specify include the addresses that worker nodes and Fargate pods (if you use them)
   * access the public endpoint from.
   *
   * @param cidr The CIDR blocks.
   */
  public static readonly PUBLIC_AND_PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: true });

  private constructor(
    /**
     * Configuration properties.
     *
     * @internal
     */
    public readonly _config: EndpointAccessConfig) {
    if (!_config.publicAccess && _config.publicCidrs && _config.publicCidrs.length > 0) {
      throw new Error('CIDR blocks can only be configured when public access is enabled');
    }
  }


  /**
   * Restrict public access to specific CIDR blocks.
   * If public access is disabled, this method will result in an error.
   *
   * @param cidr CIDR blocks.
   */
  public onlyFrom(...cidr: string[]) {
    return new EndpointAccess({
      ...this._config,
      // override CIDR
      publicCidrs: cidr,
    });
  }
}

/**
 * Common configuration props for EKS clusters.
 */
export interface ClusterProps extends ClusterOptions {
  /**
   * NOT SUPPORTED: We no longer allow disabling kubectl-support. Setting this
   * option to `false` will throw an error.
   *
   * To temporary allow you to retain existing clusters created with
   * `kubectlEnabled: false`, you can use `eks.LegacyCluster` class, which is a
   * drop-in replacement for `eks.Cluster` with `kubectlEnabled: false`.
   *
   * Bear in mind that this is a temporary workaround. We have plans to remove
   * `eks.LegacyCluster`. If you have a use case for using `eks.LegacyCluster`,
   * please add a comment here https://github.com/aws/aws-cdk/issues/9332 and
   * let us know so we can make sure to continue to support your use case with
   * `eks.Cluster`. This issue also includes additional context into why this
   * class is being removed.
   *
   * @deprecated `eks.LegacyCluster` is __temporarily__ provided as a drop-in
   * replacement until you are able to migrate to `eks.Cluster`.
   *
   * @see https://github.com/aws/aws-cdk/issues/9332
   * @default true
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
   * The default capacity type for the cluster.
   *
   * @default NODEGROUP
   */
  readonly defaultCapacityType?: DefaultCapacityType;
}

/**
 * Kubernetes cluster version
 */
export class KubernetesVersion {
  /**
   * Kubernetes version 1.14
   */
  public static readonly V1_14 = KubernetesVersion.of('1.14');

  /**
   * Kubernetes version 1.15
   */
  public static readonly V1_15 = KubernetesVersion.of('1.15');

  /**
   * Kubernetes version 1.16
   */
  public static readonly V1_16 = KubernetesVersion.of('1.16');

  /**
   * Kubernetes version 1.17
   */
  public static readonly V1_17 = KubernetesVersion.of('1.17');

  /**
   * Custom cluster version
   * @param version custom version number
   */
  public static of(version: string) { return new KubernetesVersion(version); }
  /**
   *
   * @param version cluster version number
   */
  private constructor(public readonly version: string) { }
}

/**
 * Options for fetching a ServiceLoadBalancerAddress.
 */
export interface ServiceLoadBalancerAddressOptions {

  /**
   * Timeout for waiting on the load balancer address.
   *
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;

  /**
   * The namespace the service belongs to.
   *
   * @default 'default'
   */
  readonly namespace?: string;

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

  /**
   * If the cluster has one (or more) FargateProfiles associated, this array
   * will hold a reference to each.
   */
  private readonly _fargateProfiles: FargateProfile[] = [];

  /**
   * If this cluster is kubectl-enabled, returns the `ClusterResource` object
   * that manages it. If this cluster is not kubectl-enabled (i.e. uses the
   * stock `CfnCluster`), this is `undefined`.
   */
  private readonly _clusterResource: ClusterResource;

  /**
   * Manages the aws-auth config map.
   */
  private _awsAuth?: AwsAuth;

  private _openIdConnectProvider?: iam.OpenIdConnectProvider;

  private _spotInterruptHandler?: HelmChart;

  private _neuronDevicePlugin?: KubernetesManifest;

  private readonly endpointAccess: EndpointAccess;

  private readonly kubctlProviderSecurityGroup: ec2.ISecurityGroup;

  private readonly vpcSubnets: ec2.SubnetSelection[];

  private readonly kubectlProviderEnv?: { [key: string]: string };

  private readonly version: KubernetesVersion;

  /**
   * A dummy CloudFormation resource that is used as a wait barrier which
   * represents that the cluster is ready to receive "kubectl" commands.
   *
   * Specifically, all fargate profiles are automatically added as a dependency
   * of this barrier, which means that it will only be "signaled" when all
   * fargate profiles have been successfully created.
   *
   * When kubectl resources call `_attachKubectlResourceScope()`, this resource
   * is added as their dependency which implies that they can only be deployed
   * after the cluster is ready.
   */
  private readonly _kubectlReadyBarrier?: CfnResource;

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

    if (props.kubectlEnabled === false) {
      throw new Error(
        'The "eks.Cluster" class no longer allows disabling kubectl support. ' +
        'As a temporary workaround, you can use the drop-in replacement class `eks.LegacyCluster`, ' +
        'but bear in mind that this class will soon be removed and will no longer receive additional ' +
        'features or bugfixes. See https://github.com/aws/aws-cdk/issues/9332 for more details');
    }

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

    this.vpcSubnets = props.vpcSubnets ?? [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE }];

    // Get subnetIds for all selected subnets
    const subnetIds = [...new Set(Array().concat(...this.vpcSubnets.map(s => this.vpc.selectSubnets(s).subnetIds)))];

    const clusterProps: CfnClusterProps = {
      name: this.physicalName,
      roleArn: this.role.roleArn,
      version: props.version.version,
      resourcesVpcConfig: {
        securityGroupIds: [securityGroup.securityGroupId],
        subnetIds,
      },
    };

    this.endpointAccess = props.endpointAccess ?? EndpointAccess.PUBLIC_AND_PRIVATE;
    this.kubectlProviderEnv = props.kubectlEnvironment;

    if (this.endpointAccess._config.privateAccess && this.vpc instanceof ec2.Vpc) {
      // validate VPC properties according to: https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html
      if (!this.vpc.dnsHostnamesEnabled || !this.vpc.dnsSupportEnabled) {
        throw new Error('Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled. Use `enableDnsHostnames: true` and `enableDnsSupport: true` when creating the VPC.');
      }
    }

    this.kubctlProviderSecurityGroup = new ec2.SecurityGroup(this, 'KubectlProviderSecurityGroup', {
      vpc: this.vpc,
      description: 'Comminication between KubectlProvider and EKS Control Plane',
    });

    // grant the kubectl provider access to the cluster control plane.
    this.connections.allowFrom(this.kubctlProviderSecurityGroup, this.connections.defaultPort!);

    const resource = this._clusterResource = new ClusterResource(this, 'Resource', {
      ...clusterProps,
      endpointPrivateAccess: this.endpointAccess._config.privateAccess,
      endpointPublicAccess: this.endpointAccess._config.publicAccess,
      publicAccessCidrs: this.endpointAccess._config.publicCidrs,
    });

    // the security group and vpc must exist in order to properly delete the cluster (since we run `kubectl delete`).
    // this ensures that.
    this._clusterResource.node.addDependency(this.kubctlProviderSecurityGroup, this.vpc);

    // see https://github.com/aws/aws-cdk/issues/9027
    this._clusterResource.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: ['ec2:DescribeVpcs'],
      resources: [stack.formatArn({
        service: 'ec2',
        resource: 'vpc',
        resourceName: this.vpc.vpcId,
      })],
    }));

    // we use an SSM parameter as a barrier because it's free and fast.
    this._kubectlReadyBarrier = new CfnResource(this, 'KubectlReadyBarrier', {
      type: 'AWS::SSM::Parameter',
      properties: {
        Type: 'String',
        Value: 'aws:cdk:eks:kubectl-ready',
      },
    });

    // add the cluster resource itself as a dependency of the barrier
    this._kubectlReadyBarrier.node.addDependency(this._clusterResource);

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

    // if an explicit role is not configured, define a masters role that can
    // be assumed by anyone in the account (with sts:AssumeRole permissions of
    // course)
    const mastersRole = props.mastersRole ?? new iam.Role(this, 'MastersRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // map the IAM role to the `system:masters` group.
    this.awsAuth.addMastersRole(mastersRole);

    if (props.outputMastersRoleArn) {
      new CfnOutput(this, 'MastersRoleArn', { value: mastersRole.roleArn });
    }

    commonCommandOptions.push(`--role-arn ${mastersRole.roleArn}`);

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

    this.defineCoreDnsComputeType(props.coreDnsComputeType ?? CoreDnsComputeType.EC2);
  }

  /**
   * Fetch the load balancer address of a service of type 'LoadBalancer'.
   *
   * @param serviceName The name of the service.
   * @param options Additional operation options.
   */
  public getServiceLoadBalancerAddress(serviceName: string, options: ServiceLoadBalancerAddressOptions = {}): string {

    const loadBalancerAddress = new KubernetesObjectValue(this, `${serviceName}LoadBalancerAddress`, {
      cluster: this,
      objectType: 'service',
      objectName: serviceName,
      objectNamespace: options.namespace,
      jsonPath: '.status.loadBalancer.ingress[0].hostname',
      timeout: options.timeout,
    });

    return loadBalancerAddress.value;

  }

  /**
   * Add nodes to this EKS cluster
   *
   * The nodes will automatically be configured with the right VPC and AMI
   * for the instance type and Kubernetes version.
   *
   * Note that if you specify `updateType: RollingUpdate` or `updateType: ReplacingUpdate`, your nodes might be replaced at deploy
   * time without notice in case the recommended AMI for your machine image type has been updated by AWS.
   * The default behavior for `updateType` is `None`, which means only new instances will be launched using the new AMI.
   *
   * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
   * In addition, the [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
   * daemon will be installed on all spot instances to handle
   * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
   */
  public addCapacity(id: string, options: CapacityOptions): autoscaling.AutoScalingGroup {
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
      updateType: options.updateType,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(asg, {
      mapRole: options.mapRole,
      bootstrapOptions: options.bootstrapOptions,
      bootstrapEnabled: options.bootstrapEnabled,
      machineImageType: options.machineImageType,
    });

    if (nodeTypeForInstanceType(options.instanceType) === NodeType.INFERENTIA) {
      this.addNeuronDevicePlugin();
    }

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

    // do not attempt to map the role if `kubectl` is not enabled for this
    // cluster or if `mapRole` is set to false. By default this should happen.
    const mapRole = options.mapRole === undefined ? true : options.mapRole;
    if (mapRole) {
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
    if (autoScalingGroup.spotPrice) {
      this.addSpotInterruptHandler();
    }
  }

  /**
   * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
   */
  public get awsAuth() {
    if (!this._awsAuth) {
      this._awsAuth = new AwsAuth(this, 'AwsAuth', { cluster: this });
    }

    return this._awsAuth;
  }

  /**
   * If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.
   * This is because the values is only be retrieved by the API and not exposed
   * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
   * stock `CfnCluster`), this is `undefined`.
   * @attribute
   */
  public get clusterOpenIdConnectIssuerUrl(): string {
    return this._clusterResource.attrOpenIdConnectIssuerUrl;
  }

  /**
   * If this cluster is kubectl-enabled, returns the OpenID Connect issuer.
   * This is because the values is only be retrieved by the API and not exposed
   * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
   * stock `CfnCluster`), this is `undefined`.
   * @attribute
   */
  public get clusterOpenIdConnectIssuer(): string {
    return this._clusterResource.attrOpenIdConnectIssuer;
  }

  /**
   * An `OpenIdConnectProvider` resource associated with this cluster, and which can be used
   * to link this cluster to AWS IAM.
   *
   * A provider will only be defined if this property is accessed (lazy initialization).
   */
  public get openIdConnectProvider() {
    if (!this._openIdConnectProvider) {
      this._openIdConnectProvider = new iam.OpenIdConnectProvider(this, 'OpenIdConnectProvider', {
        url: this.clusterOpenIdConnectIssuerUrl,
        clientIds: ['sts.amazonaws.com'],
        /**
         * For some reason EKS isn't validating the root certificate but a intermediat certificate
         * which is one level up in the tree. Because of the a constant thumbprint value has to be
         * stated with this OpenID Connect provider. The certificate thumbprint is the same for all the regions.
         */
        thumbprints: ['9e99a48a9960b14926bb7f3b02e22da2b0ab7280'],
      });
    }

    return this._openIdConnectProvider;
  }

  /**
   * Defines a Kubernetes manifest in this cluster.
   *
   * The manifest will be applied/deleted using kubectl as needed.
   *
   * @param id logical id of this manifest
   * @param manifest a list of Kubernetes resource specifications
   * @returns a `KubernetesManifest` object.
   */
  public addManifest(id: string, ...manifest: any[]) {
    return new KubernetesManifest(this, `manifest-${id}`, { cluster: this, manifest });
  }

  /**
   * Defines a Helm chart in this cluster.
   *
   * @param id logical id of this chart.
   * @param options options of this chart.
   * @returns a `HelmChart` object
   */
  public addChart(id: string, options: HelmChartOptions) {
    return new HelmChart(this, `chart-${id}`, { cluster: this, ...options });
  }

  /**
   * Adds a Fargate profile to this cluster.
   * @see https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html
   *
   * @param id the id of this profile
   * @param options profile options
   */
  public addFargateProfile(id: string, options: FargateProfileOptions) {
    return new FargateProfile(this, `fargate-profile-${id}`, {
      ...options,
      cluster: this,
    });
  }

  /**
   * Adds a service account to this cluster.
   *
   * @param id the id of this service account
   * @param options service account options
   */
  public addServiceAccount(id: string, options: ServiceAccountOptions = { }) {
    return new ServiceAccount(this, id, {
      ...options,
      cluster: this,
    });
  }

  /**
   * Returns the role ARN for the cluster creation role for kubectl-enabled
   * clusters.
   * @param assumedBy The IAM that will assume this role. If omitted, the
   * creation role will be returned witout modification of its trust policy.
   *
   * @internal
   */
  public get _kubectlCreationRole() {
    return this._clusterResource.creationRole;
  }

  /**
   * Internal API used by `FargateProfile` to keep inventory of Fargate profiles associated with
   * this cluster, for the sake of ensuring the profiles are created sequentially.
   *
   * @returns the list of FargateProfiles attached to this cluster, including the one just attached.
   * @internal
   */
  public _attachFargateProfile(fargateProfile: FargateProfile): FargateProfile[] {
    this._fargateProfiles.push(fargateProfile);

    // add all profiles as a dependency of the "kubectl-ready" barrier because all kubectl-
    // resources can only be deployed after all fargate profiles are created.
    if (this._kubectlReadyBarrier) {
      this._kubectlReadyBarrier.node.addDependency(fargateProfile);
    }

    return this._fargateProfiles;
  }

  /**
   * Adds a resource scope that requires `kubectl` to this cluster and returns
   * the `KubectlProvider` which is the custom resource provider that should be
   * used as the resource provider.
   *
   * Called from `HelmResource` and `KubernetesResource`
   *
   * @property resourceScope the construct scope in which kubectl resources are defined.
   *
   * @internal
   */
  public _attachKubectlResourceScope(resourceScope: Construct): KubectlProvider {
    const uid = '@aws-cdk/aws-eks.KubectlProvider';

    // singleton
    let provider = this.stack.node.tryFindChild(uid) as KubectlProvider;
    if (!provider) {
      // create the provider.

      let providerProps: KubectlProviderProps = {
        env: this.kubectlProviderEnv,
      };

      if (!this.endpointAccess._config.publicAccess) {

        const privateSubents = this.selectPrivateSubnets().slice(0, 16);

        if (privateSubents.length === 0) {
          throw new Error('Vpc must contain private subnets to configure private endpoint access');
        }

        // endpoint access is private only, we need to attach the
        // provider to the VPC so that it can access the cluster.
        providerProps = {
          ...providerProps,
          vpc: this.vpc,
          // lambda can only be accociated with max 16 subnets and they all need to be private.
          vpcSubnets: { subnets: privateSubents },
          securityGroups: [this.kubctlProviderSecurityGroup],
        };
      }

      provider = new KubectlProvider(this.stack, uid, providerProps);
    }

    // allow the kubectl provider to assume the cluster creation role.
    this._clusterResource.addTrustedRole(provider.role);

    if (!this._kubectlReadyBarrier) {
      throw new Error('unexpected: kubectl enabled clusters should have a kubectl-ready barrier resource');
    }

    resourceScope.node.addDependency(this._kubectlReadyBarrier);

    return provider;
  }

  private selectPrivateSubnets(): ec2.ISubnet[] {

    const privateSubnets: ec2.ISubnet[] = [];

    for (const placement of this.vpcSubnets) {

      for (const subnet of this.vpc.selectSubnets(placement).subnets) {

        if (this.vpc.privateSubnets.includes(subnet)) {
          // definitely private, take it.
          privateSubnets.push(subnet);
          continue;
        }

        if (this.vpc.publicSubnets.includes(subnet)) {
          // definitely public, skip it.
          continue;
        }

        // neither public and nor private - what is it then? this means its a subnet instance that was explicitly passed
        // in the subnet selection. since ISubnet doesn't contain information on type, we have to assume its private and let it
        // fail at deploy time :\ (its better than filtering it out and preventing a possibly successful deployment)
        privateSubnets.push(subnet);
      }

    }

    return privateSubnets;
  }

  /**
   * Installs the AWS spot instance interrupt handler on the cluster if it's not
   * already added.
   */
  private addSpotInterruptHandler() {
    if (!this._spotInterruptHandler) {
      this._spotInterruptHandler = this.addChart('spot-interrupt-handler', {
        chart: 'aws-node-termination-handler',
        version: '0.7.3',
        repository: 'https://aws.github.io/eks-charts',
        namespace: 'kube-system',
        values: {
          'nodeSelector.lifecycle': LifecycleLabel.SPOT,
        },
      });
    }

    return this._spotInterruptHandler;
  }

  /**
   * Installs the Neuron device plugin on the cluster if it's not
   * already added.
   */
  private addNeuronDevicePlugin() {
    if (!this._neuronDevicePlugin) {
      const fileContents = fs.readFileSync(path.join(__dirname, 'addons/neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);
      this._neuronDevicePlugin = this.addManifest('NeuronDevicePlugin', sanitized);
    }

    return this._neuronDevicePlugin;
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
          this.node.addWarning(`Could not auto-tag ${type} subnet${subnetID} with "${tag}=1", please remember to do this manually`);
          continue;
        }

        Tags.of(subnet).add(tag, '1');
      }
    };

    // https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
    tagAllSubnets('private', this.vpc.privateSubnets, 'kubernetes.io/role/internal-elb');
    tagAllSubnets('public', this.vpc.publicSubnets, 'kubernetes.io/role/elb');
  }

  /**
   * Patches the CoreDNS deployment configuration and sets the "eks.amazonaws.com/compute-type"
   * annotation to either "ec2" or "fargate". Note that if "ec2" is selected, the resource is
   * omitted/removed, since the cluster is created with the "ec2" compute type by default.
   */
  private defineCoreDnsComputeType(type: CoreDnsComputeType) {
    // ec2 is the "built in" compute type of the cluster so if this is the
    // requested type we can simply omit the resource. since the resource's
    // `restorePatch` is configured to restore the value to "ec2" this means
    // that deletion of the resource will change to "ec2" as well.
    if (type === CoreDnsComputeType.EC2) {
      return;
    }

    // this is the json patch we merge into the resource based off of:
    // https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html#fargate-gs-coredns
    const renderPatch = (computeType: CoreDnsComputeType) => ({
      spec: {
        template: {
          metadata: {
            annotations: {
              'eks.amazonaws.com/compute-type': computeType,
            },
          },
        },
      },
    });

    new KubernetesPatch(this, 'CoreDnsComputeTypePatch', {
      cluster: this,
      resourceName: 'deployment/coredns',
      resourceNamespace: 'kube-system',
      applyPatch: renderPatch(CoreDnsComputeType.FARGATE),
      restorePatch: renderPatch(CoreDnsComputeType.EC2),
    });
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

  /**
   * Machine image type
   *
   * @default MachineImageType.AMAZON_LINUX_2
   */
  readonly machineImageType?: MachineImageType;
}

/**
 * EKS node bootstrapping options.
 */
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
   * @example --node-labels foo=bar,goo=far
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
   * @default - default options
   */
  readonly bootstrapOptions?: BootstrapOptions;

  /**
   * Allow options to specify different machine image type
   *
   * @default MachineImageType.AMAZON_LINUX_2
   */
  readonly machineImageType?: MachineImageType;
}

/**
 * Import a cluster to use in another stack
 */
class ImportedCluster extends Resource implements ICluster {
  public readonly vpc: ec2.IVpc;
  public readonly clusterCertificateAuthorityData: string;
  public readonly clusterSecurityGroupId: string;
  public readonly clusterEncryptionConfigKeyArn: string;
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
    this.clusterSecurityGroupId = props.clusterSecurityGroupId;
    this.clusterEncryptionConfigKeyArn = props.clusterEncryptionConfigKeyArn;

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
  public constructor(props: EksOptimizedImageProps = {}) {
    this.nodeType = props.nodeType ?? NodeType.STANDARD;
    this.kubernetesVersion = props.kubernetesVersion ?? LATEST_KUBERNETES_VERSION;

    // set the SSM parameter name
    this.amiParameterName = `/aws/service/eks/optimized-ami/${this.kubernetesVersion}/`
      + ( this.nodeType === NodeType.STANDARD ? 'amazon-linux-2/' : '' )
      + ( this.nodeType === NodeType.GPU ? 'amazon-linux-2-gpu/' : '' )
      + (this.nodeType === NodeType.INFERENTIA ? 'amazon-linux-2-gpu/' : '')
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

  /**
   * Inferentia instances
   */
  INFERENTIA = 'INFERENTIA',
}

/**
 * The type of compute resources to use for CoreDNS.
 */
export enum CoreDnsComputeType {
  /**
   * Deploy CoreDNS on EC2 instances.
   */
  EC2 = 'ec2',

  /**
   * Deploy CoreDNS on Fargate-managed instances.
   */
  FARGATE = 'fargate'
}

/**
 * The default capacity type for the cluster
 */
export enum DefaultCapacityType {
  /**
   * managed node group
   */
  NODEGROUP,
  /**
   * EC2 autoscaling group
   */
  EC2
}

/**
 * The machine image type
 */
export enum MachineImageType {
  /**
   * Amazon EKS-optimized Linux AMI
   */
  AMAZON_LINUX_2,
  /**
   * Bottlerocket AMI
   */
  BOTTLEROCKET
}

const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];
const INFERENTIA_INSTANCETYPES = ['inf1'];

function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? NodeType.GPU :
    INFERENTIA_INSTANCETYPES.includes(instanceType.toString().substring(0, 4)) ? NodeType.INFERENTIA :
      NodeType.STANDARD;
}
