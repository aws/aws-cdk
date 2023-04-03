import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * The properties used to define an ECS cluster.
 */
export interface ClusterProps {
    /**
     * The name for the cluster.
     *
     * @default CloudFormation-generated name
     */
    readonly clusterName?: string;
    /**
     * The VPC where your ECS instances will be running or your ENIs will be deployed
     *
     * @default - creates a new VPC with two AZs
     */
    readonly vpc?: ec2.IVpc;
    /**
     * The service discovery namespace created in this cluster
     *
     * @default - no service discovery namespace created, you can use `addDefaultCloudMapNamespace` to add a
     * default service discovery namespace later.
     */
    readonly defaultCloudMapNamespace?: CloudMapNamespaceOptions;
    /**
     * The ec2 capacity to add to the cluster
     *
     * @default - no EC2 capacity will be added, you can use `addCapacity` to add capacity later.
     */
    readonly capacity?: AddCapacityOptions;
    /**
     * The capacity providers to add to the cluster
     *
     * @default - None. Currently only FARGATE and FARGATE_SPOT are supported.
     * @deprecated Use `ClusterProps.enableFargateCapacityProviders` instead.
     */
    readonly capacityProviders?: string[];
    /**
     * Whether to enable Fargate Capacity Providers
     *
     * @default false
     */
    readonly enableFargateCapacityProviders?: boolean;
    /**
     * If true CloudWatch Container Insights will be enabled for the cluster
     *
     * @default - Container Insights will be disabled for this cluster.
     */
    readonly containerInsights?: boolean;
    /**
     * The execute command configuration for the cluster
     *
     * @default - no configuration will be provided.
     */
    readonly executeCommandConfiguration?: ExecuteCommandConfiguration;
}
/**
 * The machine image type
 */
export declare enum MachineImageType {
    /**
     * Amazon ECS-optimized Amazon Linux 2 AMI
     */
    AMAZON_LINUX_2 = 0,
    /**
     * Bottlerocket AMI
     */
    BOTTLEROCKET = 1
}
/**
 * A regional grouping of one or more container instances on which you can run tasks and services.
 */
export declare class Cluster extends Resource implements ICluster {
    /**
      * Return whether the given object is a Cluster
     */
    static isCluster(x: any): x is Cluster;
    /**
     * Import an existing cluster to the stack from its attributes.
     */
    static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster;
    /**
     * Import an existing cluster to the stack from the cluster ARN.
     * This does not provide access to the vpc, hasEc2Capacity, or connections -
     * use the `fromClusterAttributes` method to access those properties.
     */
    static fromClusterArn(scope: Construct, id: string, clusterArn: string): ICluster;
    /**
     * Manage the allowed network connections for the cluster with Security Groups.
     */
    readonly connections: ec2.Connections;
    /**
     * The VPC associated with the cluster.
     */
    readonly vpc: ec2.IVpc;
    /**
     * The Amazon Resource Name (ARN) that identifies the cluster.
     */
    readonly clusterArn: string;
    /**
     * The name of the cluster.
     */
    readonly clusterName: string;
    /**
     * The names of both ASG and Fargate capacity providers associated with the cluster.
     */
    private _capacityProviderNames;
    /**
     * The cluster default capacity provider strategy. This takes the form of a list of CapacityProviderStrategy objects.
     */
    private _defaultCapacityProviderStrategy;
    /**
     * The AWS Cloud Map namespace to associate with the cluster.
     */
    private _defaultCloudMapNamespace?;
    /**
     * Specifies whether the cluster has EC2 instance capacity.
     */
    private _hasEc2Capacity;
    /**
     * The autoscaling group for added Ec2 capacity
     */
    private _autoscalingGroup?;
    /**
     * The execute command configuration for the cluster
     */
    private _executeCommandConfiguration?;
    /**
     * CfnCluster instance
     */
    private _cfnCluster;
    /**
     * Constructs a new instance of the Cluster class.
     */
    constructor(scope: Construct, id: string, props?: ClusterProps);
    /**
     * Enable the Fargate capacity providers for this cluster.
     */
    enableFargateCapacityProviders(): void;
    /**
     * Add default capacity provider strategy for this cluster.
     *
     * @param defaultCapacityProviderStrategy cluster default capacity provider strategy. This takes the form of a list of CapacityProviderStrategy objects.
     *
     * For example
     * [
     *   {
     *     capacityProvider: 'FARGATE',
     *     base: 10,
     *     weight: 50
     *   }
     * ]
     */
    addDefaultCapacityProviderStrategy(defaultCapacityProviderStrategy: CapacityProviderStrategy[]): void;
    private renderExecuteCommandConfiguration;
    private renderExecuteCommandLogConfiguration;
    /**
     * Add an AWS Cloud Map DNS namespace for this cluster.
     * NOTE: HttpNamespaces are supported only for use cases involving Service Connect. For use cases involving both Service-
     * Discovery and Service Connect, customers should manage the HttpNamespace outside of the Cluster.addDefaultCloudMapNamespace method.
     */
    addDefaultCloudMapNamespace(options: CloudMapNamespaceOptions): cloudmap.INamespace;
    /**
     * Getter for _defaultCapacityProviderStrategy. This is necessary to correctly create Capacity Provider Associations.
     */
    get defaultCapacityProviderStrategy(): CapacityProviderStrategy[];
    /**
     * Getter for _capacityProviderNames added to cluster
     */
    get capacityProviderNames(): string[];
    /**
     * Getter for namespace added to cluster
     */
    get defaultCloudMapNamespace(): cloudmap.INamespace | undefined;
    /**
     * It is highly recommended to use `Cluster.addAsgCapacityProvider` instead of this method.
     *
     * This method adds compute capacity to a cluster by creating an AutoScalingGroup with the specified options.
     *
     * Returns the AutoScalingGroup so you can add autoscaling settings to it.
     */
    addCapacity(id: string, options: AddCapacityOptions): autoscaling.AutoScalingGroup;
    /**
     * This method adds an Auto Scaling Group Capacity Provider to a cluster.
     *
     * @param provider the capacity provider to add to this cluster.
     */
    addAsgCapacityProvider(provider: AsgCapacityProvider, options?: AddAutoScalingGroupCapacityOptions): void;
    /**
     * This method adds compute capacity to a cluster using the specified AutoScalingGroup.
     *
     * @deprecated Use `Cluster.addAsgCapacityProvider` instead.
     * @param autoScalingGroup the ASG to add to this cluster.
     * [disable-awslint:ref-via-interface] is needed in order to install the ECS
     * agent by updating the ASGs user data.
     */
    addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options?: AddAutoScalingGroupCapacityOptions): void;
    private configureAutoScalingGroup;
    /**
     * This method enables the Fargate or Fargate Spot capacity providers on the cluster.
     *
     * @param provider the capacity provider to add to this cluster.
     * @deprecated Use `enableFargateCapacityProviders` instead.
     * @see `addAsgCapacityProvider` to add an Auto Scaling Group capacity provider to the cluster.
     */
    addCapacityProvider(provider: string): void;
    private configureWindowsAutoScalingGroup;
    /**
     * Getter for autoscaling group added to cluster
     */
    get autoscalingGroup(): autoscaling.IAutoScalingGroup | undefined;
    /**
     * Whether the cluster has EC2 capacity associated with it
     */
    get hasEc2Capacity(): boolean;
    /**
     * Getter for execute command configuration associated with the cluster.
     */
    get executeCommandConfiguration(): ExecuteCommandConfiguration | undefined;
    /**
     * This method returns the CloudWatch metric for this clusters CPU reservation.
     *
     * @default average over 5 minutes
     */
    metricCpuReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the CloudWatch metric for this clusters CPU utilization.
     *
     * @default average over 5 minutes
     */
    metricCpuUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the CloudWatch metric for this clusters memory reservation.
     *
     * @default average over 5 minutes
     */
    metricMemoryReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the CloudWatch metric for this clusters memory utilization.
     *
     * @default average over 5 minutes
     */
    metricMemoryUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the specifed CloudWatch metric for this cluster.
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    private cannedMetric;
}
/**
 * A regional grouping of one or more container instances on which you can run tasks and services.
 */
export interface ICluster extends IResource {
    /**
     * The name of the cluster.
     * @attribute
     */
    readonly clusterName: string;
    /**
     * The Amazon Resource Name (ARN) that identifies the cluster.
     * @attribute
     */
    readonly clusterArn: string;
    /**
     * The VPC associated with the cluster.
     */
    readonly vpc: ec2.IVpc;
    /**
     * Manage the allowed network connections for the cluster with Security Groups.
     */
    readonly connections: ec2.Connections;
    /**
     * Specifies whether the cluster has EC2 instance capacity.
     */
    readonly hasEc2Capacity: boolean;
    /**
     * The AWS Cloud Map namespace to associate with the cluster.
     */
    readonly defaultCloudMapNamespace?: cloudmap.INamespace;
    /**
     * The autoscaling group added to the cluster if capacity is associated to the cluster
     */
    readonly autoscalingGroup?: autoscaling.IAutoScalingGroup;
    /**
     * The execute command configuration for the cluster
     */
    readonly executeCommandConfiguration?: ExecuteCommandConfiguration;
}
/**
 * The properties to import from the ECS cluster.
 */
export interface ClusterAttributes {
    /**
     * The name of the cluster.
     */
    readonly clusterName: string;
    /**
     * The Amazon Resource Name (ARN) that identifies the cluster.
     *
     * @default Derived from clusterName
     */
    readonly clusterArn?: string;
    /**
     * The VPC associated with the cluster.
     */
    readonly vpc: ec2.IVpc;
    /**
     * The security groups associated with the container instances registered to the cluster.
     */
    readonly securityGroups: ec2.ISecurityGroup[];
    /**
     * Specifies whether the cluster has EC2 instance capacity.
     *
     * @default true
     */
    readonly hasEc2Capacity?: boolean;
    /**
     * The AWS Cloud Map namespace to associate with the cluster.
     *
     * @default - No default namespace
     */
    readonly defaultCloudMapNamespace?: cloudmap.INamespace;
    /**
     * Autoscaling group added to the cluster if capacity is added
     *
     * @default - No default autoscaling group
     */
    readonly autoscalingGroup?: autoscaling.IAutoScalingGroup;
    /**
     * The execute command configuration for the cluster
     *
     * @default - none.
     */
    readonly executeCommandConfiguration?: ExecuteCommandConfiguration;
}
/**
 * The properties for adding an AutoScalingGroup.
 */
export interface AddAutoScalingGroupCapacityOptions {
    /**
     * Specifies whether the containers can access the container instance role.
     *
     * @default false
     */
    readonly canContainersAccessInstanceRole?: boolean;
    /**
     * The time period to wait before force terminating an instance that is draining.
     *
     * This creates a Lambda function that is used by a lifecycle hook for the
     * AutoScalingGroup that will delay instance termination until all ECS tasks
     * have drained from the instance. Set to 0 to disable task draining.
     *
     * Set to 0 to disable task draining.
     *
     * @deprecated The lifecycle draining hook is not configured if using the EC2 Capacity Provider. Enable managed termination protection instead.
     * @default Duration.minutes(5)
     */
    readonly taskDrainTime?: Duration;
    /**
     * Specify whether to enable Automated Draining for Spot Instances running Amazon ECS Services.
     * For more information, see [Using Spot Instances](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-instance-spot.html).
     *
     * @default false
     */
    readonly spotInstanceDraining?: boolean;
    /**
     * If `AddAutoScalingGroupCapacityOptions.taskDrainTime` is non-zero, then the ECS cluster creates an
     * SNS Topic to as part of a system to drain instances of tasks when the instance is being shut down.
     * If this property is provided, then this key will be used to encrypt the contents of that SNS Topic.
     * See [SNS Data Encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-data-encryption.html) for more information.
     *
     * @default The SNS Topic will not be encrypted.
     */
    readonly topicEncryptionKey?: kms.IKey;
    /**
     * What type of machine image this is
     *
     * Depending on the setting, different UserData will automatically be added
     * to the `AutoScalingGroup` to configure it properly for use with ECS.
     *
     * If you create an `AutoScalingGroup` yourself and are adding it via
     * `addAutoScalingGroup()`, you must specify this value. If you are adding an
     * `autoScalingGroup` via `addCapacity`, this value will be determined
     * from the `machineImage` you pass.
     *
     * @default - Automatically determined from `machineImage`, if available, otherwise `MachineImageType.AMAZON_LINUX_2`.
     */
    readonly machineImageType?: MachineImageType;
}
/**
 * The properties for adding instance capacity to an AutoScalingGroup.
 */
export interface AddCapacityOptions extends AddAutoScalingGroupCapacityOptions, autoscaling.CommonAutoScalingGroupProps {
    /**
     * The EC2 instance type to use when launching instances into the AutoScalingGroup.
     */
    readonly instanceType: ec2.InstanceType;
    /**
     * The ECS-optimized AMI variant to use
     *
     * The default is to use an ECS-optimized AMI of Amazon Linux 2 which is
     * automatically updated to the latest version on every deployment. This will
     * replace the instances in the AutoScalingGroup. Make sure you have not disabled
     * task draining, to avoid downtime when the AMI updates.
     *
     * To use an image that does not update on every deployment, pass:
     *
     * ```ts
     * const machineImage = ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, {
     *   cachedInContext: true,
     * });
     * ```
     *
     * For more information, see [Amazon ECS-optimized
     * AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
     *
     * You must define either `machineImage` or `machineImageType`, not both.
     *
     * @default - Automatically updated, ECS-optimized Amazon Linux 2
     */
    readonly machineImage?: ec2.IMachineImage;
}
/**
 * The options for creating an AWS Cloud Map namespace.
 */
export interface CloudMapNamespaceOptions {
    /**
     * The name of the namespace, such as example.com.
     */
    readonly name: string;
    /**
     * The type of CloudMap Namespace to create.
     *
     * @default PrivateDns
     */
    readonly type?: cloudmap.NamespaceType;
    /**
     * The VPC to associate the namespace with. This property is required for private DNS namespaces.
     *
     * @default VPC of the cluster for Private DNS Namespace, otherwise none
     */
    readonly vpc?: ec2.IVpc;
    /**
     * This property specifies whether to set the provided namespace as the service connect default in the cluster properties.
     *
     * @default false
     */
    readonly useForServiceConnect?: boolean;
}
/**
 * A Capacity Provider strategy to use for the service.
 */
export interface CapacityProviderStrategy {
    /**
     * The name of the capacity provider.
     */
    readonly capacityProvider: string;
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one
     * capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default
     * value of 0 is used.
     *
     * @default - none
     */
    readonly base?: number;
    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the
     * specified
  capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
     *
     * @default - 0
     */
    readonly weight?: number;
}
/**
 * The details of the execute command configuration. For more information, see
 * [ExecuteCommandConfiguration] https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html
 */
export interface ExecuteCommandConfiguration {
    /**
     * The AWS Key Management Service key ID to encrypt the data between the local client and the container.
     *
     * @default - none
     */
    readonly kmsKey?: kms.IKey;
    /**
     * The log configuration for the results of the execute command actions. The logs can be sent to CloudWatch Logs or an Amazon S3 bucket.
     *
     * @default - none
     */
    readonly logConfiguration?: ExecuteCommandLogConfiguration;
    /**
     * The log settings to use for logging the execute command session.
     *
     * @default - none
     */
    readonly logging?: ExecuteCommandLogging;
}
/**
 * The log settings to use to for logging the execute command session. For more information, see
 * [Logging] https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html#cfn-ecs-cluster-executecommandconfiguration-logging
 */
export declare enum ExecuteCommandLogging {
    /**
     * The execute command session is not logged.
     */
    NONE = "NONE",
    /**
     * The awslogs configuration in the task definition is used. If no logging parameter is specified, it defaults to this value. If no awslogs log driver is configured in the task definition, the output won't be logged.
     */
    DEFAULT = "DEFAULT",
    /**
     * Specify the logging details as a part of logConfiguration.
     */
    OVERRIDE = "OVERRIDE"
}
/**
 * The log configuration for the results of the execute command actions. The logs can be sent to CloudWatch Logs and/ or an Amazon S3 bucket.
 * For more information, see [ExecuteCommandLogConfiguration] https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html
 */
export interface ExecuteCommandLogConfiguration {
    /**
     * Whether or not to enable encryption on the CloudWatch logs.
     *
     * @default - encryption will be disabled.
     */
    readonly cloudWatchEncryptionEnabled?: boolean;
    /**
     * The name of the CloudWatch log group to send logs to. The CloudWatch log group must already be created.
     * @default - none
     */
    readonly cloudWatchLogGroup?: logs.ILogGroup;
    /**
     * The name of the S3 bucket to send logs to. The S3 bucket must already be created.
     *
     * @default - none
     */
    readonly s3Bucket?: s3.IBucket;
    /**
     * Whether or not to enable encryption on the CloudWatch logs.
     *
     * @default - encryption will be disabled.
     */
    readonly s3EncryptionEnabled?: boolean;
    /**
     * An optional folder in the S3 bucket to place logs in.
     *
     * @default - none
     */
    readonly s3KeyPrefix?: string;
}
/**
 * The options for creating an Auto Scaling Group Capacity Provider.
 */
export interface AsgCapacityProviderProps extends AddAutoScalingGroupCapacityOptions {
    /**
     * The name of the capacity provider. If a name is specified,
     * it cannot start with `aws`, `ecs`, or `fargate`. If no name is specified,
     * a default name in the CFNStackName-CFNResourceName-RandomString format is used.
     *
     * @default CloudFormation-generated name
     */
    readonly capacityProviderName?: string;
    /**
     * The autoscaling group to add as a Capacity Provider.
     */
    readonly autoScalingGroup: autoscaling.IAutoScalingGroup;
    /**
     * When enabled the scale-in and scale-out actions of the cluster's Auto Scaling Group will be managed for you.
     * This means your cluster will automatically scale instances based on the load your tasks put on the cluster.
     * For more information, see [Using Managed Scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/asg-capacity-providers.html#asg-capacity-providers-managed-scaling) in the ECS Developer Guide.
     *
     * @default true
     */
    readonly enableManagedScaling?: boolean;
    /**
     * When enabled the Auto Scaling Group will only terminate EC2 instances that no longer have running non-daemon
     * tasks.
     *
     * Scale-in protection will be automatically enabled on instances. When all non-daemon tasks are
     * stopped on an instance, ECS initiates the scale-in process and turns off scale-in protection for the
     * instance. The Auto Scaling Group can then terminate the instance. For more information see [Managed termination
     *  protection](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html#managed-termination-protection)
     * in the ECS Developer Guide.
     *
     * Managed scaling must also be enabled.
     *
     * @default true
     */
    readonly enableManagedTerminationProtection?: boolean;
    /**
     * Maximum scaling step size. In most cases this should be left alone.
     *
     * @default 1000
     */
    readonly maximumScalingStepSize?: number;
    /**
     * Minimum scaling step size. In most cases this should be left alone.
     *
     * @default 1
     */
    readonly minimumScalingStepSize?: number;
    /**
     * Target capacity percent. In most cases this should be left alone.
     *
     * @default 100
     */
    readonly targetCapacityPercent?: number;
}
/**
 * An Auto Scaling Group Capacity Provider. This allows an ECS cluster to target
 * a specific EC2 Auto Scaling Group for the placement of tasks. Optionally (and
 * recommended), ECS can manage the number of instances in the ASG to fit the
 * tasks, and can ensure that instances are not prematurely terminated while
 * there are still tasks running on them.
 */
export declare class AsgCapacityProvider extends Construct {
    /**
     * Capacity provider name
     * @default Chosen by CloudFormation
     */
    readonly capacityProviderName: string;
    /**
     * Auto Scaling Group
     */
    readonly autoScalingGroup: autoscaling.AutoScalingGroup;
    /**
     * Auto Scaling Group machineImageType.
     */
    readonly machineImageType: MachineImageType;
    /**
     * Whether managed termination protection is enabled.
     */
    readonly enableManagedTerminationProtection?: boolean;
    /**
     * Specifies whether the containers can access the container instance role.
     *
     * @default false
     */
    readonly canContainersAccessInstanceRole?: boolean;
    constructor(scope: Construct, id: string, props: AsgCapacityProviderProps);
}
