import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AwsAuth } from './aws-auth';
import { HelmChart, HelmChartOptions } from './helm-chart';
import { KubernetesResource } from './k8s-resource';
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
export declare class Cluster extends Resource implements ICluster {
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
     * Indicates if `kubectl` related operations can be performed on this cluster.
     */
    readonly kubectlEnabled: boolean;
    /**
     * The CloudFormation custom resource handler that can apply Kubernetes
     * manifests to this cluster.
     *
     * @internal
     */
    readonly _k8sResourceHandler?: lambda.Function;
    /**
     * The auto scaling group that hosts the default capacity for this cluster.
     * This will be `undefined` if the default capacity is set to 0.
     */
    readonly defaultCapacity?: autoscaling.AutoScalingGroup;
    /**
     * The IAM role that was used to create this cluster. This role is
     * automatically added by Amazon EKS to the `system:masters` RBAC group of the
     * cluster. Use `addMastersRole` or `props.mastersRole` to define additional
     * IAM roles as administrators.
     *
     * @internal
     */
    readonly _defaultMastersRole?: iam.IRole;
    /**
     * Manages the aws-auth config map.
     */
    private _awsAuth?;
    private readonly version;
    /**
     * Initiates an EKS Cluster with the supplied arguments
     *
     * @param scope a Construct, most likely a cdk.Stack created
     * @param name the name of the Construct to create
     * @param props properties in the IClusterProps interface
     */
    constructor(scope: Construct, id: string, props?: ClusterProps);
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
    addCapacity(id: string, options: CapacityOptions): autoscaling.AutoScalingGroup;
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
    addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options: AutoScalingGroupOptions): void;
    /**
     * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
     */
    get awsAuth(): AwsAuth;
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
    addResource(id: string, ...manifest: any[]): KubernetesResource;
    /**
     * Defines a Helm chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param options options of this chart.
     * @returns a `HelmChart` object
     * @throws If `kubectlEnabled` is `false`
     */
    addChart(id: string, options: HelmChartOptions): HelmChart;
    private createKubernetesResourceHandler;
    /**
     * Opportunistically tag subnets with the required tags.
     *
     * If no subnets could be found (because this is an imported VPC), add a warning.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
     */
    private tagSubnets;
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
export declare class EksOptimizedImage implements ec2.IMachineImage {
    private readonly nodeType?;
    private readonly kubernetesVersion?;
    private readonly amiParameterName;
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props: EksOptimizedImageProps);
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
    GPU = "GPU"
}
export declare function nodeTypeForInstanceType(instanceType: ec2.InstanceType): NodeType;
