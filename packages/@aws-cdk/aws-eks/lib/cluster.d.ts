import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { IResource, Resource, Duration, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AlbController, AlbControllerOptions } from './alb-controller';
import { AwsAuth } from './aws-auth';
import { FargateProfile, FargateProfileOptions } from './fargate-profile';
import { HelmChart, HelmChartOptions } from './helm-chart';
import { KubernetesManifest, KubernetesManifestOptions } from './k8s-manifest';
import { IKubectlProvider, KubectlProvider } from './kubectl-provider';
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
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     */
    readonly kubectlRole?: iam.IRole;
    /**
     * Custom environment variables when running `kubectl` against this cluster.
     */
    readonly kubectlEnvironment?: {
        [key: string]: string;
    };
    /**
     * A security group to use for `kubectl` execution.
     *
     * If this is undefined, the k8s endpoint is expected to be accessible
     * publicly.
     */
    readonly kubectlSecurityGroup?: ec2.ISecurityGroup;
    /**
     * Subnets to host the `kubectl` compute resources.
     *
     * If this is undefined, the k8s endpoint is expected to be accessible
     * publicly.
     */
    readonly kubectlPrivateSubnets?: ec2.ISubnet[];
    /**
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     *
     * This role is directly passed to the lambda handler that sends Kube Ctl commands to the cluster.
     */
    readonly kubectlLambdaRole?: iam.IRole;
    /**
     * An AWS Lambda layer that includes `kubectl` and `helm`
     *
     * If not defined, a default layer will be used containing Kubectl 1.20 and Helm 3.8
     */
    readonly kubectlLayer?: lambda.ILayerVersion;
    /**
     * An AWS Lambda layer that contains the `aws` CLI.
     *
     * If not defined, a default layer will be used containing the AWS CLI 1.x.
     */
    readonly awscliLayer?: lambda.ILayerVersion;
    /**
     * Kubectl Provider for issuing kubectl commands against it
     *
     * If not defined, a default provider will be used
     */
    readonly kubectlProvider?: IKubectlProvider;
    /**
     * Amount of memory to allocate to the provider's lambda function.
     */
    readonly kubectlMemory?: Size;
    /**
     * A security group to associate with the Cluster Handler's Lambdas.
     * The Cluster Handler's Lambdas are responsible for calling AWS's EKS API.
     *
     * Requires `placeClusterHandlerInVpc` to be set to true.
     *
     * @default - No security group.
     * @attribute
     */
    readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
    /**
     * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
     *
     * If not defined, a default layer will be used.
     */
    readonly onEventLayer?: lambda.ILayerVersion;
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
     * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
     * If kubectl is enabled, the
     * [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
     * daemon will be installed on all spot instances to handle
     * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
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
     * Additional security groups associated with this cluster.
     * @default - if not specified, no additional security groups will be
     * considered in `cluster.connections`.
     */
    readonly securityGroupIds?: string[];
    /**
     * An IAM role with cluster administrator and "system:masters" permissions.
     * @default - if not specified, it not be possible to issue `kubectl` commands
     * against an imported cluster.
     */
    readonly kubectlRoleArn?: string;
    /**
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     *
     * This role is directly passed to the lambda handler that sends Kube Ctl commands
     * to the cluster.
     * @default - if not specified, the default role created by a lambda function will
     * be used.
     */
    readonly kubectlLambdaRole?: iam.IRole;
    /**
     * Environment variables to use when running `kubectl` against this cluster.
     * @default - no additional variables
     */
    readonly kubectlEnvironment?: {
        [name: string]: string;
    };
    /**
     * A security group to use for `kubectl` execution. If not specified, the k8s
     * endpoint is expected to be accessible publicly.
     * @default - k8s endpoint is expected to be accessible publicly
     */
    readonly kubectlSecurityGroupId?: string;
    /**
     * Subnets to host the `kubectl` compute resources. If not specified, the k8s
     * endpoint is expected to be accessible publicly.
     * @default - k8s endpoint is expected to be accessible publicly
     */
    readonly kubectlPrivateSubnetIds?: string[];
    /**
     * An Open ID Connect provider for this cluster that can be used to configure service accounts.
     * You can either import an existing provider using `iam.OpenIdConnectProvider.fromProviderArn`,
     * or create a new provider using `new eks.OpenIdConnectProvider`
     * @default - if not specified `cluster.openIdConnectProvider` and `cluster.addServiceAccount` will throw an error.
     */
    readonly openIdConnectProvider?: iam.IOpenIdConnectProvider;
    /**
     * An AWS Lambda Layer which includes `kubectl` and Helm.
     *
     * This layer is used by the kubectl handler to apply manifests and install
     * helm charts. You must pick an appropriate releases of one of the
     * `@aws-cdk/layer-kubectl-vXX` packages, that works with the version of
     * Kubernetes you have chosen. If you don't supply this value `kubectl`
     * 1.20 will be used, but that version is most likely too old.
     *
     * The handler expects the layer to include the following executables:
     *
     * ```
     * /opt/helm/helm
     * /opt/kubectl/kubectl
     * ```
     *
     * @default - a default layer with Kubectl 1.20 and helm 3.8.
     */
    readonly kubectlLayer?: lambda.ILayerVersion;
    /**
     * An AWS Lambda layer that contains the `aws` CLI.
     *
     * The handler expects the layer to include the following executables:
     *
     * ```
     * /opt/awscli/aws
     * ```
     *
     * @default - a default layer with the AWS CLI 1.x
     */
    readonly awscliLayer?: lambda.ILayerVersion;
    /**
     * KubectlProvider for issuing kubectl commands.
     *
     * @default - Default CDK provider
     */
    readonly kubectlProvider?: IKubectlProvider;
    /**
     * Amount of memory to allocate to the provider's lambda function.
     *
     * @default Size.gibibytes(1)
     */
    readonly kubectlMemory?: Size;
    /**
     * A security group id to associate with the Cluster Handler's Lambdas.
     * The Cluster Handler's Lambdas are responsible for calling AWS's EKS API.
     *
     * @default - No security group.
     */
    readonly clusterHandlerSecurityGroupId?: string;
    /**
     * An AWS Lambda Layer which includes the NPM dependency `proxy-agent`. This layer
     * is used by the onEvent handler to route AWS SDK requests through a proxy.
     *
     * The handler expects the layer to include the following node_modules:
     *
     *    proxy-agent
     *
     * @default - a layer bundled with this module.
     */
    readonly onEventLayer?: lambda.ILayerVersion;
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
    readonly kubectlEnvironment?: {
        [key: string]: string;
    };
    /**
     * An AWS Lambda Layer which includes `kubectl` and Helm.
     *
     * This layer is used by the kubectl handler to apply manifests and install
     * helm charts. You must pick an appropriate releases of one of the
     * `@aws-cdk/layer-kubectl-vXX` packages, that works with the version of
     * Kubernetes you have chosen. If you don't supply this value `kubectl`
     * 1.20 will be used, but that version is most likely too old.
     *
     * The handler expects the layer to include the following executables:
     *
     * ```
     * /opt/helm/helm
     * /opt/kubectl/kubectl
     * ```
     *
     * @default - a default layer with Kubectl 1.20.
     */
    readonly kubectlLayer?: lambda.ILayerVersion;
    /**
     * An AWS Lambda layer that contains the `aws` CLI.
     *
     * The handler expects the layer to include the following executables:
     *
     * ```
     * /opt/awscli/aws
     * ```
     *
     * @default - a default layer with the AWS CLI 1.x
     */
    readonly awscliLayer?: lambda.ILayerVersion;
    /**
     * Amount of memory to allocate to the provider's lambda function.
     *
     * @default Size.gibibytes(1)
     */
    readonly kubectlMemory?: Size;
    /**
     * Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.
     *
     * @default - No environment variables.
     */
    readonly clusterHandlerEnvironment?: {
        [key: string]: string;
    };
    /**
     * A security group to associate with the Cluster Handler's Lambdas.
     * The Cluster Handler's Lambdas are responsible for calling AWS's EKS API.
     *
     * Requires `placeClusterHandlerInVpc` to be set to true.
     *
     * @default - No security group.
     */
    readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
    /**
     * An AWS Lambda Layer which includes the NPM dependency `proxy-agent`. This layer
     * is used by the onEvent handler to route AWS SDK requests through a proxy.
     *
     * By default, the provider will use the layer included in the
     * "aws-lambda-layer-node-proxy-agent" SAR application which is available in all
     * commercial regions.
     *
     * To deploy the layer locally define it in your app as follows:
     *
     * ```ts
     * const layer = new lambda.LayerVersion(this, 'proxy-agent-layer', {
     *   code: lambda.Code.fromAsset(`${__dirname}/layer.zip`),
     *   compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
     * });
     * ```
     *
     * @default - a layer bundled with this module.
     */
    readonly onEventLayer?: lambda.ILayerVersion;
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
     * If set to true, the cluster handler functions will be placed in the private subnets
     * of the cluster vpc, subject to the `vpcSubnets` selection strategy.
     *
     * @default false
     */
    readonly placeClusterHandlerInVpc?: boolean;
    /**
     * KMS secret for envelope encryption for Kubernetes secrets.
     *
     * @default - By default, Kubernetes stores all secret object data within etcd and
     *            all etcd volumes used by Amazon EKS are encrypted at the disk-level
     *            using AWS-Managed encryption keys.
     */
    readonly secretsEncryptionKey?: kms.IKey;
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
 * Common configuration props for EKS clusters.
 */
export interface ClusterProps extends ClusterOptions {
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
     * @default NODEGROUP
     */
    readonly defaultCapacityType?: DefaultCapacityType;
    /**
     * The IAM role to pass to the Kubectl Lambda Handler.
     *
     * @default - Default Lambda IAM Execution Role
     */
    readonly kubectlLambdaRole?: iam.IRole;
    /**
     * The tags assigned to the EKS cluster
     *
     * @default - none
     */
    readonly tags?: {
        [key: string]: string;
    };
}
/**
 * Kubernetes cluster version
 * @see https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar
 */
export declare class KubernetesVersion {
    readonly version: string;
    /**
     * Kubernetes version 1.14
     * @deprecated Use newer version of EKS
     */
    static readonly V1_14: KubernetesVersion;
    /**
     * Kubernetes version 1.15
     * @deprecated Use newer version of EKS
     */
    static readonly V1_15: KubernetesVersion;
    /**
     * Kubernetes version 1.16
     * @deprecated Use newer version of EKS
     */
    static readonly V1_16: KubernetesVersion;
    /**
     * Kubernetes version 1.17
     * @deprecated Use newer version of EKS
     */
    static readonly V1_17: KubernetesVersion;
    /**
     * Kubernetes version 1.18
     * @deprecated Use newer version of EKS
     */
    static readonly V1_18: KubernetesVersion;
    /**
     * Kubernetes version 1.19
     * @deprecated Use newer version of EKS
     */
    static readonly V1_19: KubernetesVersion;
    /**
     * Kubernetes version 1.20
     * @deprecated Use newer version of EKS
     */
    static readonly V1_20: KubernetesVersion;
    /**
     * Kubernetes version 1.21
     */
    static readonly V1_21: KubernetesVersion;
    /**
     * Kubernetes version 1.22
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV22Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v22`.
     */
    static readonly V1_22: KubernetesVersion;
    /**
     * Kubernetes version 1.23
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV23Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v23`.
     */
    static readonly V1_23: KubernetesVersion;
    /**
     * Kubernetes version 1.24
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV24Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v24`.
     */
    static readonly V1_24: KubernetesVersion;
    /**
     * Kubernetes version 1.25
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV25Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v25`.
     */
    static readonly V1_25: KubernetesVersion;
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
    abstract readonly kubectlRole?: iam.IRole;
    abstract readonly kubectlLambdaRole?: iam.IRole;
    abstract readonly kubectlEnvironment?: {
        [key: string]: string;
    };
    abstract readonly kubectlSecurityGroup?: ec2.ISecurityGroup;
    abstract readonly kubectlPrivateSubnets?: ec2.ISubnet[];
    abstract readonly kubectlMemory?: Size;
    abstract readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
    abstract readonly prune: boolean;
    abstract readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
    abstract readonly awsAuth: AwsAuth;
    private _spotInterruptHandler?;
    /**
     * Manages the aws-auth config map.
     *
     * @internal
     */
    protected _awsAuth?: AwsAuth;
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
     * Installs the AWS spot instance interrupt handler on the cluster if it's not
     * already added.
     */
    private addSpotInterruptHandler;
    /**
     * Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.
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
 */
export declare class Cluster extends ClusterBase {
    /**
     * Import an existing cluster
     *
     * @param scope the construct scope, in most cases 'this'
     * @param id the id or name to import as
     * @param attrs the cluster properties to use for importing information
     */
    static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster;
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
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     */
    readonly kubectlRole?: iam.IRole;
    /**
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     *
     * This role is directly passed to the lambda handler that sends Kube Ctl commands to the cluster.
     * @default - if not specified, the default role created by a lambda function will
     * be used.
     */
    readonly kubectlLambdaRole?: iam.IRole;
    /**
     * Custom environment variables when running `kubectl` against this cluster.
     */
    readonly kubectlEnvironment?: {
        [key: string]: string;
    };
    /**
     * A security group to use for `kubectl` execution.
     *
     * @default - If not specified, the k8s endpoint is expected to be accessible
     * publicly.
     */
    readonly kubectlSecurityGroup?: ec2.ISecurityGroup;
    /**
     * Subnets to host the `kubectl` compute resources.
     *
     * @default - If not specified, the k8s endpoint is expected to be accessible
     * publicly.
     */
    readonly kubectlPrivateSubnets?: ec2.ISubnet[];
    /**
     * An IAM role with administrative permissions to create or update the
     * cluster. This role also has `systems:master` permissions.
     */
    readonly adminRole: iam.Role;
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
     * An AWS Lambda layer that includes `kubectl` and `helm`
     *
     * If not defined, a default layer will be used containing Kubectl 1.20 and Helm 3.8
     */
    readonly kubectlLayer?: lambda.ILayerVersion;
    /**
     * An AWS Lambda layer that contains the `aws` CLI.
     *
     * If not defined, a default layer will be used containing the AWS CLI 1.x.
     */
    readonly awscliLayer?: lambda.ILayerVersion;
    /**
     * The amount of memory allocated to the kubectl provider's lambda function.
     */
    readonly kubectlMemory?: Size;
    /**
     * A security group to associate with the Cluster Handler's Lambdas.
     * The Cluster Handler's Lambdas are responsible for calling AWS's EKS API.
     *
     * Requires `placeClusterHandlerInVpc` to be set to true.
     *
     * @default - No security group.
     */
    readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
    /**
     * The AWS Lambda layer that contains the NPM dependency `proxy-agent`. If
     * undefined, a SAR app that contains this layer will be used.
     */
    readonly onEventLayer?: lambda.ILayerVersion;
    /**
     * Determines if Kubernetes resources can be pruned automatically.
     */
    readonly prune: boolean;
    /**
     * The ALB Controller construct defined for this cluster.
     * Will be undefined if `albController` wasn't configured.
     */
    readonly albController?: AlbController;
    /**
     * If this cluster is kubectl-enabled, returns the `ClusterResource` object
     * that manages it. If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     */
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
    private readonly _kubectlResourceProvider;
    /**
     * Initiates an EKS Cluster with the supplied arguments
     *
     * @param scope a Construct, most likely a cdk.Stack created
     * @param id the id of the Construct to create
     * @param props properties in the IClusterProps interface
     */
    constructor(scope: Construct, id: string, props: ClusterProps);
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
     * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
     * In addition, the [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
     * daemon will be installed on all spot instances to handle
     * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
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
     * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
     */
    get awsAuth(): AwsAuth;
    /**
     * If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.
     * This is because the values is only be retrieved by the API and not exposed
     * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     * @attribute
     */
    get clusterOpenIdConnectIssuerUrl(): string;
    /**
     * If this cluster is kubectl-enabled, returns the OpenID Connect issuer.
     * This is because the values is only be retrieved by the API and not exposed
     * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     * @attribute
     */
    get clusterOpenIdConnectIssuer(): string;
    /**
     * An `OpenIdConnectProvider` resource associated with this cluster, and which can be used
     * to link this cluster to AWS IAM.
     *
     * A provider will only be defined if this property is accessed (lazy initialization).
     */
    get openIdConnectProvider(): iam.IOpenIdConnectProvider;
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
     * Adds a resource scope that requires `kubectl` to this cluster and returns
     * the `KubectlProvider` which is the custom resource provider that should be
     * used as the resource provider.
     *
     * Called from `HelmResource` and `KubernetesResource`
     *
     * @param resourceScope the construct scope in which kubectl resources are defined.
     *
     * @internal
     */
    _attachKubectlResourceScope(resourceScope: Construct): KubectlProvider;
    private defineKubectlProvider;
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
    /**
     * Installs the AWS spot instance interrupt handler on the cluster if it's not
     * already added. Only relevant if `spotPrice` is used.
     *
     * @default true
     */
    readonly spotInterruptHandler?: boolean;
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
    /**
     * Installs the AWS spot instance interrupt handler on the cluster if it's not
     * already added. Only relevant if `spotPrice` is configured on the auto-scaling group.
     *
     * @default true
     */
    readonly spotInterruptHandler?: boolean;
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
    INFERENTIA = "INFERENTIA"
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
    EC2 = 1
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
