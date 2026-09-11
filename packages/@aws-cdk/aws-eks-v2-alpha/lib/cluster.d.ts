import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { IResource, Resource, Duration } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IAccessPolicy, AccessEntry } from './access-entry';
import { IAddon } from './addon';
import { AlbController, AlbControllerOptions } from './alb-controller';
import { FargateProfile, FargateProfileOptions } from './fargate-profile';
import { HelmChart, HelmChartOptions } from './helm-chart';
import { KubernetesManifest, KubernetesManifestOptions } from './k8s-manifest';
import { IKubectlProvider, KubectlProviderOptions } from './kubectl-provider';
import { Nodegroup, NodegroupOptions } from './managed-nodegroup';
import { ServiceAccount, ServiceAccountOptions } from './service-account';
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
     * The id of the cluster security group that was created by Amazon EKS for the cluster.
     * @attribute
     */
    readonly clusterSecurityGroupId: string;
    /**
     * The cluster security group that was created by Amazon EKS for the cluster.
     * @attribute
     */
    readonly clusterSecurityGroup: ec2.ISecurityGroup;
    /**
     * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
     * @attribute
     */
    readonly clusterEncryptionConfigKeyArn: string;
    /**
     * The Open ID Connect Provider of the cluster used to configure Service Accounts.
     */
    readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
    /**
     * The EKS Pod Identity Agent addon for the EKS cluster.
     *
     * The EKS Pod Identity Agent is responsible for managing the temporary credentials
     * used by pods in the cluster to access AWS resources. It runs as a DaemonSet on
     * each node and provides the necessary credentials to the pods based on their
     * associated service account.
     *
     * This property returns the `CfnAddon` resource representing the EKS Pod Identity
     * Agent addon. If the addon has not been created yet, it will be created and
     * returned.
     */
    readonly eksPodIdentityAgent?: IAddon;
    /**
     * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
     *
     * @default - IpFamily.IP_V4
     * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-ipFamily
     */
    readonly ipFamily?: IpFamily;
    /**
     * Options for creating the kubectl provider - a lambda function that executes `kubectl` and `helm`
     * against the cluster. If defined, `kubectlLayer` is a required property.
     *
     * If not defined, kubectl provider will not be created by default.
     */
    readonly kubectlProviderOptions?: KubectlProviderOptions;
    /**
     * Kubectl Provider for issuing kubectl commands against it
     *
     * If not defined, a default provider will be used
     */
    readonly kubectlProvider?: IKubectlProvider;
    /**
     * Indicates whether Kubernetes resources can be automatically pruned. When
     * this is enabled (default), prune labels will be allocated and injected to
     * each resource. These labels will then be used when issuing the `kubectl
     * apply` operation with the `--prune` switch.
     */
    readonly prune: boolean;
    /**
     * Creates a new service account with corresponding IAM Role (IRSA).
     *
     * @param id logical id of service account
     * @param options service account options
     */
    addServiceAccount(id: string, options?: ServiceAccountOptions): ServiceAccount;
    /**
     * Defines a Kubernetes resource in this cluster.
     *
     * The manifest will be applied/deleted using kubectl as needed.
     *
     * @param id logical id of this manifest
     * @param manifest a list of Kubernetes resource specifications
     * @returns a `KubernetesManifest` object.
     */
    addManifest(id: string, ...manifest: Record<string, any>[]): KubernetesManifest;
    /**
     * Defines a Helm chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param options options of this chart.
     * @returns a `HelmChart` construct
     */
    addHelmChart(id: string, options: HelmChartOptions): HelmChart;
    /**
     * Defines a CDK8s chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param chart the cdk8s chart.
     * @returns a `KubernetesManifest` construct representing the chart.
     */
    addCdk8sChart(id: string, chart: Construct, options?: KubernetesManifestOptions): KubernetesManifest;
    /**
     * Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.
     *
     * The AutoScalingGroup must be running an EKS-optimized AMI containing the
     * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
     * add the right policies to the instance role, apply the right tags, and add
     * the required user data to the instance's launch configuration.
     *
     * Prefer to use `addAutoScalingGroupCapacity` if possible.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
     * @param autoScalingGroup [disable-awslint:ref-via-interface]
     * @param options options for adding auto scaling groups, like customizing the bootstrap script
     */
    connectAutoScalingGroupCapacity(autoScalingGroup: autoscaling.AutoScalingGroup, options: AutoScalingGroupOptions): void;
}
/**
 * Attributes for EKS clusters.
 */
export interface ClusterAttributes {
    /**
     * The VPC in which this Cluster was created
     * @default - if not specified `cluster.vpc` will throw an error
     */
    readonly vpc?: ec2.IVpc;
    /**
     * The physical name of the Cluster
     */
    readonly clusterName: string;
    /**
     * The API Server endpoint URL
     * @default - if not specified `cluster.clusterEndpoint` will throw an error.
     */
    readonly clusterEndpoint?: string;
    /**
     * The certificate-authority-data for your cluster.
     * @default - if not specified `cluster.clusterCertificateAuthorityData` will
     * throw an error
     */
    readonly clusterCertificateAuthorityData?: string;
    /**
     * The cluster security group that was created by Amazon EKS for the cluster.
     * @default - if not specified `cluster.clusterSecurityGroupId` will throw an
     * error
     */
    readonly clusterSecurityGroupId?: string;
    /**
     * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
     * @default - if not specified `cluster.clusterEncryptionConfigKeyArn` will
     * throw an error
     */
    readonly clusterEncryptionConfigKeyArn?: string;
    /**
     * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
     *
     * @default - IpFamily.IP_V4
     * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-ipFamily
     */
    readonly ipFamily?: IpFamily;
    /**
     * Additional security groups associated with this cluster.
     * @default - if not specified, no additional security groups will be
     * considered in `cluster.connections`.
     */
    readonly securityGroupIds?: string[];
    /**
     * An Open ID Connect provider for this cluster that can be used to configure service accounts.
     * You can either import an existing provider using `iam.OpenIdConnectProvider.fromProviderArn`,
     * or create a new provider using `new eks.OpenIdConnectProvider`
     * @default - if not specified `cluster.openIdConnectProvider` and `cluster.addServiceAccount` will throw an error.
     */
    readonly openIdConnectProvider?: iam.IOpenIdConnectProvider;
    /**
     * KubectlProvider for issuing kubectl commands.
     *
     * @default - Default CDK provider
     */
    readonly kubectlProvider?: IKubectlProvider;
    /**
     * Options for creating the kubectl provider - a lambda function that executes `kubectl` and `helm`
     * against the cluster. If defined, `kubectlLayer` is a required property.
     *
     * If not defined, kubectl provider will not be created by default.
     */
    readonly kubectlProviderOptions?: KubectlProviderOptions;
    /**
     * Indicates whether Kubernetes resources added through `addManifest()` can be
     * automatically pruned. When this is enabled (default), prune labels will be
     * allocated and injected to each resource. These labels will then be used
     * when issuing the `kubectl apply` operation with the `--prune` switch.
     *
     * @default true
     */
    readonly prune?: boolean;
}
/**
 * Options for configuring an EKS cluster.
 */
export interface ClusterCommonOptions {
    /**
     * The VPC in which to create the Cluster.
     *
     * @default - a VPC with default configuration will be created and can be accessed through `cluster.vpc`.
     */
    readonly vpc?: ec2.IVpc;
    /**
     * Where to place EKS Control Plane ENIs
     *
     * For example, to only select private subnets, supply the following:
     *
     * `vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }]`
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
     * An IAM role that will be added to the `system:masters` Kubernetes RBAC
     * group.
     *
     * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings
     *
     * @default - no masters role.
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
     * Configure access to the Kubernetes API server endpoint..
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html
     *
     * @default EndpointAccess.PUBLIC_AND_PRIVATE
     */
    readonly endpointAccess?: EndpointAccess;
    /**
     * Indicates whether Kubernetes resources added through `addManifest()` can be
     * automatically pruned. When this is enabled (default), prune labels will be
     * allocated and injected to each resource. These labels will then be used
     * when issuing the `kubectl apply` operation with the `--prune` switch.
     *
     * @default true
     */
    readonly prune?: boolean;
    /**
     * KMS secret for envelope encryption for Kubernetes secrets.
     *
     * @default - By default, Kubernetes stores all secret object data within etcd and
     *            all etcd volumes used by Amazon EKS are encrypted at the disk-level
     *            using AWS-Managed encryption keys.
     */
    readonly secretsEncryptionKey?: kms.IKeyRef;
    /**
     * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
     *
     * @default IpFamily.IP_V4
     * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-ipFamily
     */
    readonly ipFamily?: IpFamily;
    /**
     * The CIDR block to assign Kubernetes service IP addresses from.
     *
     * @default - Kubernetes assigns addresses from either the
     *            10.100.0.0/16 or 172.20.0.0/16 CIDR blocks
     * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-serviceIpv4Cidr
     */
    readonly serviceIpv4Cidr?: string;
    /**
     * Install the AWS Load Balancer Controller onto the cluster.
     *
     * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller
     *
     * @default - The controller is not installed.
     */
    readonly albController?: AlbControllerOptions;
    /**
     * The cluster log types which you want to enable.
     *
     * @default - none
     */
    readonly clusterLogging?: ClusterLoggingTypes[];
    /**
     * The tags assigned to the EKS cluster
     *
     * @default - none
     */
    readonly tags?: {
        [key: string]: string;
    };
    /**
     * Options for creating the kubectl provider - a lambda function that executes `kubectl` and `helm`
     * against the cluster. If defined, `kubectlLayer` is a required property.
     *
     * If not defined, kubectl provider will not be created by default.
     */
    readonly kubectlProviderOptions?: KubectlProviderOptions;
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
export declare class EndpointAccess {
    /**
     * Configuration properties.
     *
     * @internal
     */
    readonly _config: EndpointAccessConfig;
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
    static readonly PUBLIC: EndpointAccess;
    /**
     * The cluster endpoint is only accessible through your VPC.
     * Worker node traffic to the endpoint will stay within your VPC.
     */
    static readonly PRIVATE: EndpointAccess;
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
    static readonly PUBLIC_AND_PRIVATE: EndpointAccess;
    private constructor();
    /**
     * Restrict public access to specific CIDR blocks.
     * If public access is disabled, this method will result in an error.
     *
     * @param cidr CIDR blocks.
     */
    onlyFrom(...cidr: string[]): EndpointAccess;
}
/**
 * Options for configuring EKS Auto Mode compute settings.
 * When enabled, EKS will automatically manage compute resources like node groups and Fargate profiles.
 */
export interface ComputeConfig {
    /**
     * Names of nodePools to include in Auto Mode.
     * You cannot modify the built in system and general-purpose node pools. You can only enable or disable them.
     * Node pool values are case-sensitive and must be `general-purpose` and/or `system`.
     *
     * @see - https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html
     *
     * @default - ['system', 'general-purpose']
     */
    readonly nodePools?: string[];
    /**
     * IAM role for the nodePools.
     *
     * @see - https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html
     *
     * @default - generated by the CDK
     */
    readonly nodeRole?: iam.IRole;
}
/**
 * Properties for configuring a standard EKS cluster (non-Fargate)
 */
export interface ClusterProps extends ClusterCommonOptions {
    /**
     * Configuration for compute settings in Auto Mode.
     * When enabled, EKS will automatically manage compute resources.
     * @default - Auto Mode compute disabled
     */
    readonly compute?: ComputeConfig;
    /**
     * Number of instances to allocate as an initial capacity for this cluster.
     * Instance type can be configured through `defaultCapacityInstanceType`,
     * which defaults to `m5.large`.
     *
     * Use `cluster.addAutoScalingGroupCapacity` to add additional customized capacity. Set this
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
     * @default AUTOMODE
     */
    readonly defaultCapacityType?: DefaultCapacityType;
    /**
     * Whether or not IAM principal of the cluster creator was set as a cluster admin access entry
     * during cluster creation time.
     *
     * Changing this value after the cluster has been created will result in the cluster being replaced.
     *
     * @default true
     */
    readonly bootstrapClusterCreatorAdminPermissions?: boolean;
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
 * Kubernetes cluster version
 * @see https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar
 */
export declare class KubernetesVersion {
    readonly version: string;
    /**
     * Kubernetes version 1.25
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV25Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v25`.
     */
    static readonly V1_25: KubernetesVersion;
    /**
     * Kubernetes version 1.26
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV26Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v26`.
     */
    static readonly V1_26: KubernetesVersion;
    /**
     * Kubernetes version 1.27
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV27Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v27`.
     */
    static readonly V1_27: KubernetesVersion;
    /**
     * Kubernetes version 1.28
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV28Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v28`.
     */
    static readonly V1_28: KubernetesVersion;
    /**
     * Kubernetes version 1.29
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV29Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v29`.
     */
    static readonly V1_29: KubernetesVersion;
    /**
     * Kubernetes version 1.30
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV30Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v30`.
     */
    static readonly V1_30: KubernetesVersion;
    /**
     * Kubernetes version 1.31
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV31Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v31`.
     */
    static readonly V1_31: KubernetesVersion;
    /**
     * Kubernetes version 1.32
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV32Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v32`.
     */
    static readonly V1_32: KubernetesVersion;
    /**
     * Kubernetes version 1.33
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV33Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v33`.
     */
    static readonly V1_33: KubernetesVersion;
    /**
     * Kubernetes version 1.34
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV34Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v34`.
     */
    static readonly V1_34: KubernetesVersion;
    /**
     * Custom cluster version
     * @param version custom version number
     */
    static of(version: string): KubernetesVersion;
    /**
     *
     * @param version cluster version number
     */
    private constructor();
}
/**
 * EKS cluster logging types
 */
export declare enum ClusterLoggingTypes {
    /**
     * Logs pertaining to API requests to the cluster.
     */
    API = "api",
    /**
     * Logs pertaining to cluster access via the Kubernetes API.
     */
    AUDIT = "audit",
    /**
     * Logs pertaining to authentication requests into the cluster.
     */
    AUTHENTICATOR = "authenticator",
    /**
     * Logs pertaining to state of cluster controllers.
     */
    CONTROLLER_MANAGER = "controllerManager",
    /**
     * Logs pertaining to scheduling decisions.
     */
    SCHEDULER = "scheduler"
}
/**
 * EKS cluster IP family.
 */
export declare enum IpFamily {
    /**
     * Use IPv4 for pods and services in your cluster.
     */
    IP_V4 = "ipv4",
    /**
     * Use IPv6 for pods and services in your cluster.
     */
    IP_V6 = "ipv6"
}
declare abstract class ClusterBase extends Resource implements ICluster {
    abstract readonly connections: ec2.Connections;
    abstract readonly vpc: ec2.IVpc;
    abstract readonly clusterName: string;
    abstract readonly clusterArn: string;
    abstract readonly clusterEndpoint: string;
    abstract readonly clusterCertificateAuthorityData: string;
    abstract readonly clusterSecurityGroupId: string;
    abstract readonly clusterSecurityGroup: ec2.ISecurityGroup;
    abstract readonly clusterEncryptionConfigKeyArn: string;
    abstract readonly ipFamily?: IpFamily;
    abstract readonly prune: boolean;
    abstract readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
    /**
     * Defines a Kubernetes resource in this cluster.
     *
     * The manifest will be applied/deleted using kubectl as needed.
     *
     * @param id logical id of this manifest
     * @param manifest a list of Kubernetes resource specifications
     * @returns a `KubernetesResource` object.
     */
    addManifest(id: string, ...manifest: Record<string, any>[]): KubernetesManifest;
    /**
     * Defines a Helm chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param options options of this chart.
     * @returns a `HelmChart` construct
     */
    addHelmChart(id: string, options: HelmChartOptions): HelmChart;
    /**
     * Defines a CDK8s chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param chart the cdk8s chart.
     * @returns a `KubernetesManifest` construct representing the chart.
     */
    addCdk8sChart(id: string, chart: Construct, options?: KubernetesManifestOptions): KubernetesManifest;
    addServiceAccount(id: string, options?: ServiceAccountOptions): ServiceAccount;
    /**
     * Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.
     *
     * The AutoScalingGroup must be running an EKS-optimized AMI containing the
     * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
     * add the right policies to the instance role, apply the right tags, and add
     * the required user data to the instance's launch configuration.
     *
     * Prefer to use `addAutoScalingGroupCapacity` if possible.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
     * @param autoScalingGroup [disable-awslint:ref-via-interface]
     * @param options options for adding auto scaling groups, like customizing the bootstrap script
     */
    connectAutoScalingGroupCapacity(autoScalingGroup: autoscaling.AutoScalingGroup, options: AutoScalingGroupOptions): void;
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
 * Options for fetching an IngressLoadBalancerAddress.
 */
export interface IngressLoadBalancerAddressOptions extends ServiceLoadBalancerAddressOptions {
}
/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 * @resource AWS::EKS::Cluster
 */
export declare class Cluster extends ClusterBase {
    /** Uniquely identifies this class. */
    static readonly PROPERTY_INJECTION_ID: string;
    /**
     * Import an existing cluster
     *
     * @param scope the construct scope, in most cases 'this'
     * @param id the id or name to import as
     * @param attrs the cluster properties to use for importing information
     */
    static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster;
    private accessEntries;
    /**
     * The VPC in which this Cluster was created
     */
    readonly vpc: ec2.IVpc;
    /**
     * The Name of the created EKS Cluster
     */
    readonly clusterName: string;
    /**
     * The AWS generated ARN for the Cluster resource
     *
     * For example, `arn:aws:eks:us-west-2:666666666666:cluster/prod`
     */
    readonly clusterArn: string;
    /**
     * The endpoint URL for the Cluster
     *
     * This is the URL inside the kubeconfig file to use with kubectl
     *
     * For example, `https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com`
     */
    readonly clusterEndpoint: string;
    /**
     * The certificate-authority-data for your cluster.
     */
    readonly clusterCertificateAuthorityData: string;
    /**
     * The id of the cluster security group that was created by Amazon EKS for the cluster.
     */
    readonly clusterSecurityGroupId: string;
    /**
     * The cluster security group that was created by Amazon EKS for the cluster.
     */
    readonly clusterSecurityGroup: ec2.ISecurityGroup;
    /**
     * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
     */
    readonly clusterEncryptionConfigKeyArn: string;
    /**
     * Manages connection rules (Security Group Rules) for the cluster
     *
     * @type {ec2.Connections}
     * @memberof Cluster
     */
    readonly connections: ec2.Connections;
    /**
     * IAM role assumed by the EKS Control Plane
     */
    readonly role: iam.IRole;
    /**
     * The auto scaling group that hosts the default capacity for this cluster.
     * This will be `undefined` if the `defaultCapacityType` is not `EC2` or
     * `defaultCapacityType` is `EC2` but default capacity is set to 0.
     */
    readonly defaultCapacity?: autoscaling.AutoScalingGroup;
    /**
     * The node group that hosts the default capacity for this cluster.
     * This will be `undefined` if the `defaultCapacityType` is `EC2` or
     * `defaultCapacityType` is `NODEGROUP` but default capacity is set to 0.
     */
    readonly defaultNodegroup?: Nodegroup;
    /**
     * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
     *
     * @default IpFamily.IP_V4
     * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-ipFamily
     */
    readonly ipFamily?: IpFamily;
    /**
     * If the cluster has one (or more) FargateProfiles associated, this array
     * will hold a reference to each.
     */
    private readonly _fargateProfiles;
    /**
     * an Open ID Connect Provider instance
     */
    private _openIdConnectProvider?;
    /**
     * an EKS Pod Identity Agent instance
     */
    private _eksPodIdentityAgent?;
    /**
     * Determines if Kubernetes resources can be pruned automatically.
     */
    readonly prune: boolean;
    /**
     * The ALB Controller construct defined for this cluster.
     * Will be undefined if `albController` wasn't configured.
     */
    readonly albController?: AlbController;
    private readonly _clusterResource;
    private _neuronDevicePlugin?;
    private readonly endpointAccess;
    private readonly vpcSubnets;
    private readonly version;
    private readonly logging?;
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
    private readonly _kubectlReadyBarrier;
    private readonly _kubectlProviderOptions?;
    private readonly _kubectlProvider?;
    private readonly _clusterAdminAccess?;
    /**
     * Initiates an EKS Cluster with the supplied arguments
     *
     * @param scope a Construct, most likely a cdk.Stack created
     * @param id the id of the Construct to create
     * @param props properties in the IClusterProps interface
     */
    constructor(scope: Construct, id: string, props: ClusterProps);
    /**
     * Grants the specified IAM principal access to the EKS cluster based on the provided access policies.
     *
     * This method creates an `AccessEntry` construct that grants the specified IAM principal the access permissions
     * defined by the provided `IAccessPolicy` array. This allows the IAM principal to perform the actions permitted
     * by the access policies within the EKS cluster.
     * [disable-awslint:no-grants]
     *
     * @param id - The ID of the `AccessEntry` construct to be created.
     * @param principal - The IAM principal (role or user) to be granted access to the EKS cluster.
     * @param accessPolicies - An array of `IAccessPolicy` objects that define the access permissions to be granted to the IAM principal.
     */
    grantAccess(id: string, principal: string, accessPolicies: IAccessPolicy[]): void;
    /**
     * Grants the specified IAM principal cluster admin access to the EKS cluster.
     *
     * This method creates an `AccessEntry` construct that grants the specified IAM principal the cluster admin
     * access permissions. This allows the IAM principal to perform the actions permitted
     * by the cluster admin acces.
     * [disable-awslint:no-grants]
     *
     * @param id - The ID of the `AccessEntry` construct to be created.
     * @param principal - The IAM principal (role or user) to be granted access to the EKS cluster.
     * @returns the access entry construct
     */
    grantClusterAdmin(id: string, principal: string): AccessEntry;
    /**
     * Fetch the load balancer address of a service of type 'LoadBalancer'.
     *
     * @param serviceName The name of the service.
     * @param options Additional operation options.
     */
    getServiceLoadBalancerAddress(serviceName: string, options?: ServiceLoadBalancerAddressOptions): string;
    /**
     * Fetch the load balancer address of an ingress backed by a load balancer.
     *
     * @param ingressName The name of the ingress.
     * @param options Additional operation options.
     */
    getIngressLoadBalancerAddress(ingressName: string, options?: IngressLoadBalancerAddressOptions): string;
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
     */
    addAutoScalingGroupCapacity(id: string, options: AutoScalingGroupCapacityOptions): autoscaling.AutoScalingGroup;
    /**
     * Add managed nodegroup to this Amazon EKS cluster
     *
     * This method will create a new managed nodegroup and add into the capacity.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html
     * @param id The ID of the nodegroup
     * @param options options for creating a new nodegroup
     */
    addNodegroupCapacity(id: string, options?: NodegroupOptions): Nodegroup;
    /**
     * If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.
     * If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     * @attribute
     */
    get clusterOpenIdConnectIssuerUrl(): string;
    /**
     * An `OpenIdConnectProvider` resource associated with this cluster, and which can be used
     * to link this cluster to AWS IAM.
     *
     * A provider will only be defined if this property is accessed (lazy initialization).
     */
    get openIdConnectProvider(): iam.IOpenIdConnectProvider;
    get kubectlProvider(): IKubectlProvider | undefined;
    /**
     * Retrieves the EKS Pod Identity Agent addon for the EKS cluster.
     *
     * The EKS Pod Identity Agent is responsible for managing the temporary credentials
     * used by pods in the cluster to access AWS resources. It runs as a DaemonSet on
     * each node and provides the necessary credentials to the pods based on their
     * associated service account.
     *
     */
    get eksPodIdentityAgent(): IAddon | undefined;
    /**
     * Adds a Fargate profile to this cluster.
     * @see https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html
     *
     * @param id the id of this profile
     * @param options profile options
     */
    addFargateProfile(id: string, options: FargateProfileOptions): FargateProfile;
    /**
     * Internal API used by `FargateProfile` to keep inventory of Fargate profiles associated with
     * this cluster, for the sake of ensuring the profiles are created sequentially.
     *
     * @returns the list of FargateProfiles attached to this cluster, including the one just attached.
     * @internal
     */
    _attachFargateProfile(fargateProfile: FargateProfile): FargateProfile[];
    /**
     * validate all autoMode relevant configurations to ensure they are correct and throw
     * errors if they are not.
     *
     * @param props ClusterProps
     *
     */
    private isValidAutoModeConfig;
    private addNodePoolRole;
    /**
     * Adds an access entry to the cluster's access entries map.
     *
     * If an entry already exists for the given principal, it adds the provided access policies to the existing entry.
     * If no entry exists for the given principal, it creates a new access entry with the provided access policies.
     *
     * @param principal - The principal (e.g., IAM user or role) for which the access entry is being added.
     * @param policies - An array of access policies to be associated with the principal.
     *
     * @throws {Error} If the uniqueName generated for the new access entry is not unique.
     *
     * @returns {void}
     */
    private addToAccessEntry;
    /**
     * Adds a resource scope that requires `kubectl` to this cluster and returns
     *
     * @internal
     */
    _dependOnKubectlBarrier(resource: Construct): void;
    private selectPrivateSubnets;
    /**
     * Installs the Neuron device plugin on the cluster if it's not
     * already added.
     */
    private addNeuronDevicePlugin;
    /**
     * Opportunistically tag subnets with the required tags.
     *
     * If no subnets could be found (because this is an imported VPC), add a warning.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
     */
    private tagSubnets;
    /**
     * Patches the CoreDNS deployment configuration and sets the "eks.amazonaws.com/compute-type"
     * annotation to either "ec2" or "fargate". Note that if "ec2" is selected, the resource is
     * omitted/removed, since the cluster is created with the "ec2" compute type by default.
     */
    private defineCoreDnsComputeType;
}
/**
 * Options for adding worker nodes
 */
export interface AutoScalingGroupCapacityOptions extends autoscaling.CommonAutoScalingGroupProps {
    /**
     * Instance type of the instances to start
     */
    readonly instanceType: ec2.InstanceType;
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
     * Overrides the IP address to use for DNS queries within the
     * cluster.
     *
     * @default - 10.100.0.10 or 172.20.0.10 based on the IP
     * address of the primary interface.
     */
    readonly dnsClusterIp?: string;
    /**
     * Extra arguments to add to the kubelet. Useful for adding labels or taints.
     *
     * For example, `--node-labels foo=bar,goo=far`.
     *
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
     * What cpu architecture to retrieve the image for (arm64 or x86_64)
     *
     * @default CpuArch.X86_64
     */
    readonly cpuArch?: CpuArch;
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
export declare class EksOptimizedImage implements ec2.IMachineImage {
    private readonly nodeType?;
    private readonly cpuArch?;
    private readonly kubernetesVersion?;
    private readonly amiParameterName;
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props?: EksOptimizedImageProps);
    /**
     * Return the correct image
     */
    getImage(scope: Construct): ec2.MachineImageConfig;
}
/**
 * Whether the worker nodes should support GPU or just standard instances
 */
export declare enum NodeType {
    /**
     * Standard instances
     */
    STANDARD = "Standard",
    /**
     * GPU instances
     */
    GPU = "GPU",
    /**
     * Inferentia instances
     */
    INFERENTIA = "INFERENTIA",
    /**
     * Trainium instances
     */
    TRAINIUM = "TRAINIUM"
}
/**
 * CPU architecture
 */
export declare enum CpuArch {
    /**
     * arm64 CPU type
     */
    ARM_64 = "arm64",
    /**
     * x86_64 CPU type
     */
    X86_64 = "x86_64"
}
/**
 * The type of compute resources to use for CoreDNS.
 */
export declare enum CoreDnsComputeType {
    /**
     * Deploy CoreDNS on EC2 instances.
     */
    EC2 = "ec2",
    /**
     * Deploy CoreDNS on Fargate-managed instances.
     */
    FARGATE = "fargate"
}
/**
 * The default capacity type for the cluster
 */
export declare enum DefaultCapacityType {
    /**
     * managed node group
     */
    NODEGROUP = 0,
    /**
     * EC2 autoscaling group
     */
    EC2 = 1,
    /**
     * Auto Mode
     */
    AUTOMODE = 2
}
/**
 * The machine image type
 */
export declare enum MachineImageType {
    /**
     * Amazon EKS-optimized Linux AMI
     */
    AMAZON_LINUX_2 = 0,
    /**
     * Bottlerocket AMI
     */
    BOTTLEROCKET = 1
}
export {};
