import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { CfnCreationPolicy, CfnUpdatePolicy, Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BasicLifecycleHookProps, LifecycleHook } from './lifecycle-hook';
import { BasicScheduledActionProps, ScheduledAction } from './scheduled-action';
import { BasicStepScalingPolicyProps, StepScalingPolicy } from './step-scaling-policy';
import { BaseTargetTrackingProps, TargetTrackingScalingPolicy } from './target-tracking-scaling-policy';
import { TerminationPolicy } from './termination-policy';
import { BlockDevice } from './volume';
import { WarmPool, WarmPoolOptions } from './warm-pool';
/**
 * The monitoring mode for instances launched in an autoscaling group
 */
export declare enum Monitoring {
    /**
     * Generates metrics every 5 minutes
     */
    BASIC = 0,
    /**
     * Generates metrics every minute
     */
    DETAILED = 1
}
/**
 * Basic properties of an AutoScalingGroup, except the exact machines to run and where they should run
 *
 * Constructs that want to create AutoScalingGroups can inherit
 * this interface and specialize the essential parts in various ways.
 */
export interface CommonAutoScalingGroupProps {
    /**
     * Minimum number of instances in the fleet
     *
     * @default 1
     */
    readonly minCapacity?: number;
    /**
     * Maximum number of instances in the fleet
     *
     * @default desiredCapacity
     */
    readonly maxCapacity?: number;
    /**
     * Initial amount of instances in the fleet
     *
     * If this is set to a number, every deployment will reset the amount of
     * instances to this number. It is recommended to leave this value blank.
     *
     * @default minCapacity, and leave unchanged during deployment
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity
     */
    readonly desiredCapacity?: number;
    /**
     * Name of SSH keypair to grant access to instances
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - No SSH access will be possible.
     */
    readonly keyName?: string;
    /**
     * Where to place instances within the VPC
     *
     * @default - All Private subnets.
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * SNS topic to send notifications about fleet changes
     *
     * @default - No fleet change notifications will be sent.
     * @deprecated use `notifications`
     */
    readonly notificationsTopic?: sns.ITopic;
    /**
     * Configure autoscaling group to send notifications about fleet changes to an SNS topic(s)
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations
     * @default - No fleet change notifications will be sent.
     */
    readonly notifications?: NotificationConfiguration[];
    /**
     * Whether the instances can initiate connections to anywhere by default
     *
     * @default true
     */
    readonly allowAllOutbound?: boolean;
    /**
     * What to do when an AutoScalingGroup's instance configuration is changed
     *
     * This is applied when any of the settings on the ASG are changed that
     * affect how the instances should be created (VPC, instance type, startup
     * scripts, etc.). It indicates how the existing instances should be
     * replaced with new instances matching the new config. By default,
     * `updatePolicy` takes precedence over `updateType`.
     *
     * @default UpdateType.REPLACING_UPDATE, unless updatePolicy has been set
     * @deprecated Use `updatePolicy` instead
     */
    readonly updateType?: UpdateType;
    /**
     * Configuration for rolling updates
     *
     * Only used if updateType == UpdateType.RollingUpdate.
     *
     * @default - RollingUpdateConfiguration with defaults.
     * @deprecated Use `updatePolicy` instead
     */
    readonly rollingUpdateConfiguration?: RollingUpdateConfiguration;
    /**
     * Configuration for replacing updates.
     *
     * Only used if updateType == UpdateType.ReplacingUpdate. Specifies how
     * many instances must signal success for the update to succeed.
     *
     * @default minSuccessfulInstancesPercent
     * @deprecated Use `signals` instead
     */
    readonly replacingUpdateMinSuccessfulInstancesPercent?: number;
    /**
     * If the ASG has scheduled actions, don't reset unchanged group sizes
     *
     * Only used if the ASG has scheduled actions (which may scale your ASG up
     * or down regardless of cdk deployments). If true, the size of the group
     * will only be reset if it has been changed in the CDK app. If false, the
     * sizes will always be changed back to what they were in the CDK app
     * on deployment.
     *
     * @default true
     */
    readonly ignoreUnmodifiedSizeProperties?: boolean;
    /**
     * How many ResourceSignal calls CloudFormation expects before the resource is considered created
     *
     * @default 1 if resourceSignalTimeout is set, 0 otherwise
     * @deprecated Use `signals` instead.
     */
    readonly resourceSignalCount?: number;
    /**
     * The length of time to wait for the resourceSignalCount
     *
     * The maximum value is 43200 (12 hours).
     *
     * @default Duration.minutes(5) if resourceSignalCount is set, N/A otherwise
     * @deprecated Use `signals` instead.
     */
    readonly resourceSignalTimeout?: Duration;
    /**
     * Default scaling cooldown for this AutoScalingGroup
     *
     * @default Duration.minutes(5)
     */
    readonly cooldown?: Duration;
    /**
     * Whether instances in the Auto Scaling Group should have public
     * IP addresses associated with them.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - Use subnet setting.
     */
    readonly associatePublicIpAddress?: boolean;
    /**
     * The maximum hourly price (in USD) to be paid for any Spot Instance launched to fulfill the request. Spot Instances are
     * launched when the price you specify exceeds the current Spot market price.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default none
     */
    readonly spotPrice?: string;
    /**
     * Configuration for health checks
     *
     * @default - HealthCheck.ec2 with no grace period
     */
    readonly healthCheck?: HealthCheck;
    /**
     * Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.
     *
     * Each instance that is launched has an associated root device volume,
     * either an Amazon EBS volume or an instance store volume.
     * You can use block device mappings to specify additional EBS volumes or
     * instance store volumes to attach to an instance when it is launched.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
     *
     * @default - Uses the block device mapping of the AMI
     */
    readonly blockDevices?: BlockDevice[];
    /**
     * The maximum amount of time that an instance can be in service. The maximum duration applies
     * to all current and future instances in the group. As an instance approaches its maximum duration,
     * it is terminated and replaced, and cannot be used again.
     *
     * You must specify a value of at least 604,800 seconds (7 days). To clear a previously set value,
     * leave this property undefined.
     *
     * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html
     *
     * @default none
     */
    readonly maxInstanceLifetime?: Duration;
    /**
     * Controls whether instances in this group are launched with detailed or basic monitoring.
     *
     * When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account
     * is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @see https://docs.aws.amazon.com/autoscaling/latest/userguide/as-instance-monitoring.html#enable-as-instance-metrics
     *
     * @default - Monitoring.DETAILED
     */
    readonly instanceMonitoring?: Monitoring;
    /**
     * Enable monitoring for group metrics, these metrics describe the group rather than any of its instances.
     * To report all group metrics use `GroupMetrics.all()`
     * Group metrics are reported in a granularity of 1 minute at no additional charge.
     * @default - no group metrics will be reported
     *
     */
    readonly groupMetrics?: GroupMetrics[];
    /**
     * Configure waiting for signals during deployment
     *
     * Use this to pause the CloudFormation deployment to wait for the instances
     * in the AutoScalingGroup to report successful startup during
     * creation and updates. The UserData script needs to invoke `cfn-signal`
     * with a success or failure code after it is done setting up the instance.
     *
     * Without waiting for signals, the CloudFormation deployment will proceed as
     * soon as the AutoScalingGroup has been created or updated but before the
     * instances in the group have been started.
     *
     * For example, to have instances wait for an Elastic Load Balancing health check before
     * they signal success, add a health-check verification by using the
     * cfn-init helper script. For an example, see the verify_instance_health
     * command in the Auto Scaling rolling updates sample template:
     *
     * https://github.com/awslabs/aws-cloudformation-templates/blob/master/aws/services/AutoScaling/AutoScalingRollingUpdates.yaml
     *
     * @default - Do not wait for signals
     */
    readonly signals?: Signals;
    /**
     * What to do when an AutoScalingGroup's instance configuration is changed
     *
     * This is applied when any of the settings on the ASG are changed that
     * affect how the instances should be created (VPC, instance type, startup
     * scripts, etc.). It indicates how the existing instances should be
     * replaced with new instances matching the new config. By default, nothing
     * is done and only new instances are launched with the new config.
     *
     * @default - `UpdatePolicy.rollingUpdate()` if using `init`, `UpdatePolicy.none()` otherwise
     */
    readonly updatePolicy?: UpdatePolicy;
    /**
     * Whether newly-launched instances are protected from termination by Amazon
     * EC2 Auto Scaling when scaling in.
     *
     * By default, Auto Scaling can terminate an instance at any time after launch
     * when scaling in an Auto Scaling Group, subject to the group's termination
     * policy. However, you may wish to protect newly-launched instances from
     * being scaled in if they are going to run critical applications that should
     * not be prematurely terminated.
     *
     * This flag must be enabled if the Auto Scaling Group will be associated with
     * an ECS Capacity Provider with managed termination protection.
     *
     * @default false
     */
    readonly newInstancesProtectedFromScaleIn?: boolean;
    /**
     * The name of the Auto Scaling group. This name must be unique per Region per account.
     * @default - Auto generated by CloudFormation
     */
    readonly autoScalingGroupName?: string;
    /**
     * A policy or a list of policies that are used to select the instances to
     * terminate. The policies are executed in the order that you list them.
     *
     * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-termination.html
     *
     * @default - `TerminationPolicy.DEFAULT`
     */
    readonly terminationPolicies?: TerminationPolicy[];
    /**
     * The amount of time, in seconds, until a newly launched instance can contribute to the Amazon CloudWatch metrics.
     * This delay lets an instance finish initializing before Amazon EC2 Auto Scaling aggregates instance metrics,
     * resulting in more reliable usage data. Set this value equal to the amount of time that it takes for resource
     * consumption to become stable after an instance reaches the InService state.
     *
     * To optimize the performance of scaling policies that scale continuously, such as target tracking and
     * step scaling policies, we strongly recommend that you enable the default instance warmup, even if its value is set to 0 seconds
     *
     * Default instance warmup will not be added if no value is specified
     *
     * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html
     *
     * @default None
     */
    readonly defaultInstanceWarmup?: Duration;
    /**
     * Indicates whether Capacity Rebalancing is enabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling
     * attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of
     * interruption. After launching a new instance, it then terminates an old instance.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-capacityrebalance
     *
     * @default false
     *
     */
    readonly capacityRebalance?: boolean;
}
/**
 * MixedInstancesPolicy allows you to configure a group that diversifies across On-Demand Instances
 * and Spot Instances of multiple instance types. For more information, see Auto Scaling groups with
 * multiple instance types and purchase options in the Amazon EC2 Auto Scaling User Guide:
 *
 * https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-purchase-options.html
 */
export interface MixedInstancesPolicy {
    /**
     * InstancesDistribution to use.
     *
     * @default - The value for each property in it uses a default value.
     */
    readonly instancesDistribution?: InstancesDistribution;
    /**
     * Launch template to use.
     */
    readonly launchTemplate: ec2.ILaunchTemplate;
    /**
     * Launch template overrides.
     *
     * The maximum number of instance types that can be associated with an Auto Scaling group is 40.
     *
     * The maximum number of distinct launch templates you can define for an Auto Scaling group is 20.
     *
     * @default - Do not provide any overrides
     */
    readonly launchTemplateOverrides?: LaunchTemplateOverrides[];
}
/**
 * Indicates how to allocate instance types to fulfill On-Demand capacity.
 */
export declare enum OnDemandAllocationStrategy {
    /**
     * This strategy uses the order of instance types in the LaunchTemplateOverrides to define the launch
     * priority of each instance type. The first instance type in the array is prioritized higher than the
     * last. If all your On-Demand capacity cannot be fulfilled using your highest priority instance, then
     * the Auto Scaling group launches the remaining capacity using the second priority instance type, and
     * so on.
     */
    PRIORITIZED = "prioritized"
}
/**
 * Indicates how to allocate instance types to fulfill Spot capacity.
 */
export declare enum SpotAllocationStrategy {
    /**
     * The Auto Scaling group launches instances using the Spot pools with the lowest price, and evenly
     * allocates your instances across the number of Spot pools that you specify.
     */
    LOWEST_PRICE = "lowest-price",
    /**
     * The Auto Scaling group launches instances using Spot pools that are optimally chosen based on the
     * available Spot capacity.
     *
     * Recommended.
     */
    CAPACITY_OPTIMIZED = "capacity-optimized",
    /**
     * When you use this strategy, you need to set the order of instance types in the list of launch template
     * overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling
     * honors the instance type priorities on a best-effort basis but optimizes for capacity first.
     */
    CAPACITY_OPTIMIZED_PRIORITIZED = "capacity-optimized-prioritized",
    /**
     * The price and capacity optimized allocation strategy looks at both price and
     * capacity to select the Spot Instance pools that are the least likely to be
     * interrupted and have the lowest possible price.
     */
    PRICE_CAPACITY_OPTIMIZED = "price-capacity-optimized"
}
/**
 * InstancesDistribution is a subproperty of MixedInstancesPolicy that describes an instances distribution
 * for an Auto Scaling group. The instances distribution specifies the distribution of On-Demand Instances
 * and Spot Instances, the maximum price to pay for Spot Instances, and how the Auto Scaling group allocates
 * instance types to fulfill On-Demand and Spot capacities.
 *
 * For more information and example configurations, see Auto Scaling groups with multiple instance types
 * and purchase options in the Amazon EC2 Auto Scaling User Guide:
 *
 * https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-purchase-options.html
 */
export interface InstancesDistribution {
    /**
     * Indicates how to allocate instance types to fulfill On-Demand capacity. The only valid value is prioritized,
     * which is also the default value.
     *
     * @default OnDemandAllocationStrategy.PRIORITIZED
     */
    readonly onDemandAllocationStrategy?: OnDemandAllocationStrategy;
    /**
     * The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances. This
     * base portion is provisioned first as your group scales. Defaults to 0 if not specified. If you specify weights
     * for the instance types in the overrides, set the value of OnDemandBaseCapacity in terms of the number of
     * capacity units, and not the number of instances.
     *
     * @default 0
     */
    readonly onDemandBaseCapacity?: number;
    /**
     * Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond
     * OnDemandBaseCapacity. Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances).
     * Defaults to 100 if not specified. If set to 100, only On-Demand Instances are provisioned.
     *
     * @default 100
     */
    readonly onDemandPercentageAboveBaseCapacity?: number;
    /**
     * If the allocation strategy is lowest-price, the Auto Scaling group launches instances using the Spot pools with the
     * lowest price, and evenly allocates your instances across the number of Spot pools that you specify. Defaults to
     * lowest-price if not specified.
     *
     * If the allocation strategy is capacity-optimized (recommended), the Auto Scaling group launches instances using Spot
     * pools that are optimally chosen based on the available Spot capacity. Alternatively, you can use capacity-optimized-prioritized
     * and set the order of instance types in the list of launch template overrides from highest to lowest priority
     * (from first to last in the list). Amazon EC2 Auto Scaling honors the instance type priorities on a best-effort basis but
     * optimizes for capacity first.
     *
     * @default SpotAllocationStrategy.LOWEST_PRICE
     */
    readonly spotAllocationStrategy?: SpotAllocationStrategy;
    /**
     * The number of Spot Instance pools to use to allocate your Spot capacity. The Spot pools are determined from the different instance
     * types in the overrides. Valid only when the Spot allocation strategy is lowest-price. Value must be in the range of 1 to 20.
     * Defaults to 2 if not specified.
     *
     * @default 2
     */
    readonly spotInstancePools?: number;
    /**
     * The maximum price per unit hour that you are willing to pay for a Spot Instance. If you leave the value at its default (empty),
     * Amazon EC2 Auto Scaling uses the On-Demand price as the maximum Spot price. To remove a value that you previously set, include
     * the property but specify an empty string ("") for the value.
     *
     * @default "" - On-Demand price
     */
    readonly spotMaxPrice?: string;
}
/**
 * LaunchTemplateOverrides is a subproperty of LaunchTemplate that describes an override for a launch template.
 */
export interface LaunchTemplateOverrides {
    /**
     * The instance type, such as m3.xlarge. You must use an instance type that is supported in your requested Region
     * and Availability Zones.
     *
     * @default - Do not override instance type
     */
    readonly instanceType: ec2.InstanceType;
    /**
     * Provides the launch template to be used when launching the instance type. For example, some instance types might
     * require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template
     * that's defined for your mixed instances policy.
     *
     * @default - Do not override launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * The number of capacity units provided by the specified instance type in terms of virtual CPUs, memory, storage,
     * throughput, or other relative performance characteristic. When a Spot or On-Demand Instance is provisioned, the
     * capacity units count toward the desired capacity. Amazon EC2 Auto Scaling provisions instances until the desired
     * capacity is totally fulfilled, even if this results in an overage. Value must be in the range of 1 to 999.
     *
     * For example, If there are 2 units remaining to fulfill capacity, and Amazon EC2 Auto Scaling can only provision
     * an instance with a WeightedCapacity of 5 units, the instance is provisioned, and the desired capacity is exceeded
     * by 3 units.
     *
     * @see https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-weighting.html
     *
     * @default - Do not provide weight
     */
    readonly weightedCapacity?: number;
}
/**
 * Properties of a Fleet
 */
export interface AutoScalingGroupProps extends CommonAutoScalingGroupProps {
    /**
     * VPC to launch these instances in.
     */
    readonly vpc: ec2.IVpc;
    /**
     * Launch template to use.
     *
     * Launch configuration related settings and MixedInstancesPolicy must not be specified when a
     * launch template is specified.
     *
     * @default - Do not provide any launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * Mixed Instances Policy to use.
     *
     * Launch configuration related settings and Launch Template  must not be specified when a
     * MixedInstancesPolicy is specified.
     *
     * @default - Do not provide any MixedInstancesPolicy
     */
    readonly mixedInstancesPolicy?: MixedInstancesPolicy;
    /**
     * Type of instance to launch
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - Do not provide any instance type
     */
    readonly instanceType?: ec2.InstanceType;
    /**
     * AMI to launch
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - Do not provide any machine image
     */
    readonly machineImage?: ec2.IMachineImage;
    /**
     * Security group to launch the instances in.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - A SecurityGroup will be created if none is specified.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * Specific UserData to use
     *
     * The UserData may still be mutated after creation.
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @default - A UserData object appropriate for the MachineImage's
     * Operating System is created.
     */
    readonly userData?: ec2.UserData;
    /**
     * An IAM role to associate with the instance profile assigned to this Auto Scaling Group.
     *
     * The role must be assumable by the service principal `ec2.amazonaws.com`:
     *
     * `launchTemplate` and `mixedInstancesPolicy` must not be specified when this property is specified
     *
     * @example
     *
     *    const role = new iam.Role(this, 'MyRole', {
     *      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
     *    });
     *
     * @default A role will automatically be created, it can be accessed via the `role` property
     */
    readonly role?: iam.IRole;
    /**
     * Apply the given CloudFormation Init configuration to the instances in the AutoScalingGroup at startup
     *
     * If you specify `init`, you must also specify `signals` to configure
     * the number of instances to wait for and the timeout for waiting for the
     * init process.
     *
     * @default - no CloudFormation init
     */
    readonly init?: ec2.CloudFormationInit;
    /**
     * Use the given options for applying CloudFormation Init
     *
     * Describes the configsets to use and the timeout to wait
     *
     * @default - default options
     */
    readonly initOptions?: ApplyCloudFormationInitOptions;
    /**
     * Whether IMDSv2 should be required on launched instances.
     *
     * @default false
     */
    readonly requireImdsv2?: boolean;
}
/**
 * Configure whether the AutoScalingGroup waits for signals
 *
 * If you do configure waiting for signals, you should make sure the instances
 * invoke `cfn-signal` somewhere in their UserData to signal that they have
 * started up (either successfully or unsuccessfully).
 *
 * Signals are used both during intial creation and subsequent updates.
 */
export declare abstract class Signals {
    /**
     * Wait for the desiredCapacity of the AutoScalingGroup amount of signals to have been received
     *
     * If no desiredCapacity has been configured, wait for minCapacity signals intead.
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForAll(options?: SignalsOptions): Signals;
    /**
     * Wait for the minCapacity of the AutoScalingGroup amount of signals to have been received
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForMinCapacity(options?: SignalsOptions): Signals;
    /**
     * Wait for a specific amount of signals to have been received
     *
     * You should send one signal per instance, so this represents the number of
     * instances to wait for.
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForCount(count: number, options?: SignalsOptions): Signals;
    /**
     * Render the ASG's CreationPolicy
     */
    abstract renderCreationPolicy(renderOptions: RenderSignalsOptions): CfnCreationPolicy;
    /**
     * Helper to render the actual creation policy, as the logic between them is quite similar
     */
    protected doRender(options: SignalsOptions, count?: number): CfnCreationPolicy;
}
/**
 * Input for Signals.renderCreationPolicy
 */
export interface RenderSignalsOptions {
    /**
     * The desiredCapacity of the ASG
     *
     * @default - desired capacity not configured
     */
    readonly desiredCapacity?: number;
    /**
     * The minSize of the ASG
     *
     * @default - minCapacity not configured
     */
    readonly minCapacity?: number;
}
/**
 * Customization options for Signal handling
 */
export interface SignalsOptions {
    /**
     * The percentage of signals that need to be successful
     *
     * If this number is less than 100, a percentage of signals may be failure
     * signals while still succeeding the creation or update in CloudFormation.
     *
     * @default 100
     */
    readonly minSuccessPercentage?: number;
    /**
     * How long to wait for the signals to be sent
     *
     * This should reflect how long it takes your instances to start up
     * (including instance start time and instance initialization time).
     *
     * @default Duration.minutes(5)
     */
    readonly timeout?: Duration;
}
/**
 * How existing instances should be updated
 */
export declare abstract class UpdatePolicy {
    /**
     * Create a new AutoScalingGroup and switch over to it
     */
    static replacingUpdate(): UpdatePolicy;
    /**
     * Replace the instances in the AutoScalingGroup one by one, or in batches
     */
    static rollingUpdate(options?: RollingUpdateOptions): UpdatePolicy;
    /**
     * Render the ASG's CreationPolicy
     * @internal
     */
    abstract _renderUpdatePolicy(renderOptions: RenderUpdateOptions): CfnUpdatePolicy;
}
/**
 * Options for rendering UpdatePolicy
 */
interface RenderUpdateOptions {
    /**
     * The Creation Policy already created
     *
     * @default - no CreationPolicy configured
     */
    readonly creationPolicy?: CfnCreationPolicy;
}
/**
 * Options for customizing the rolling update
 */
export interface RollingUpdateOptions {
    /**
     * The maximum number of instances that AWS CloudFormation updates at once.
     *
     * This number affects the speed of the replacement.
     *
     * @default 1
     */
    readonly maxBatchSize?: number;
    /**
     * The minimum number of instances that must be in service before more instances are replaced.
     *
     * This number affects the speed of the replacement.
     *
     * @default 0
     */
    readonly minInstancesInService?: number;
    /**
     * Specifies the Auto Scaling processes to suspend during a stack update.
     *
     * Suspending processes prevents Auto Scaling from interfering with a stack
     * update.
     *
     * @default HealthCheck, ReplaceUnhealthy, AZRebalance, AlarmNotification, ScheduledActions.
     */
    readonly suspendProcesses?: ScalingProcess[];
    /**
     * Specifies whether the Auto Scaling group waits on signals from new instances during an update.
     *
     * @default true if you configured `signals` on the AutoScalingGroup, false otherwise
     */
    readonly waitOnResourceSignals?: boolean;
    /**
     * The pause time after making a change to a batch of instances.
     *
     * @default - The `timeout` configured for `signals` on the AutoScalingGroup
     */
    readonly pauseTime?: Duration;
    /**
     * The percentage of instances that must signal success for the update to succeed.
     *
     * @default - The `minSuccessPercentage` configured for `signals` on the AutoScalingGroup
     */
    readonly minSuccessPercentage?: number;
}
/**
 * A set of group metrics
 */
export declare class GroupMetrics {
    /**
     * Report all group metrics.
     */
    static all(): GroupMetrics;
    /**
     * @internal
     */
    _metrics: Set<GroupMetric>;
    constructor(...metrics: GroupMetric[]);
}
/**
 * Group metrics that an Auto Scaling group sends to Amazon CloudWatch.
 */
export declare class GroupMetric {
    /**
     * The minimum size of the Auto Scaling group
     */
    static readonly MIN_SIZE: GroupMetric;
    /**
     * The maximum size of the Auto Scaling group
     */
    static readonly MAX_SIZE: GroupMetric;
    /**
     * The number of instances that the Auto Scaling group attempts to maintain
     */
    static readonly DESIRED_CAPACITY: GroupMetric;
    /**
     * The number of instances that are running as part of the Auto Scaling group
     * This metric does not include instances that are pending or terminating
     */
    static readonly IN_SERVICE_INSTANCES: GroupMetric;
    /**
     * The number of instances that are pending
     * A pending instance is not yet in service, this metric does not include instances that are in service or terminating
     */
    static readonly PENDING_INSTANCES: GroupMetric;
    /**
     * The number of instances that are in a Standby state
     * Instances in this state are still running but are not actively in service
     */
    static readonly STANDBY_INSTANCES: GroupMetric;
    /**
     * The number of instances that are in the process of terminating
     * This metric does not include instances that are in service or pending
     */
    static readonly TERMINATING_INSTANCES: GroupMetric;
    /**
     * The total number of instances in the Auto Scaling group
     * This metric identifies the number of instances that are in service, pending, and terminating
     */
    static readonly TOTAL_INSTANCES: GroupMetric;
    /**
     * The name of the group metric
     */
    readonly name: string;
    constructor(name: string);
}
declare abstract class AutoScalingGroupBase extends Resource implements IAutoScalingGroup {
    abstract autoScalingGroupName: string;
    abstract autoScalingGroupArn: string;
    abstract readonly osType: ec2.OperatingSystemType;
    protected albTargetGroup?: elbv2.ApplicationTargetGroup;
    readonly grantPrincipal: iam.IPrincipal;
    protected hasCalledScaleOnRequestCount: boolean;
    /**
     * Send a message to either an SQS queue or SNS topic when instances launch or terminate
     */
    addLifecycleHook(id: string, props: BasicLifecycleHookProps): LifecycleHook;
    /**
     * Add a pool of pre-initialized EC2 instances that sits alongside an Auto Scaling group
     */
    addWarmPool(options?: WarmPoolOptions): WarmPool;
    /**
     * Scale out or in based on time
     */
    scaleOnSchedule(id: string, props: BasicScheduledActionProps): ScheduledAction;
    /**
     * Scale out or in to achieve a target CPU utilization
     */
    scaleOnCpuUtilization(id: string, props: CpuUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in to achieve a target network ingress rate
     */
    scaleOnIncomingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in to achieve a target network egress rate
     */
    scaleOnOutgoingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in to achieve a target request handling rate
     *
     * The AutoScalingGroup must have been attached to an Application Load Balancer
     * in order to be able to call this.
     */
    scaleOnRequestCount(id: string, props: RequestCountScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    scaleToTrackMetric(id: string, props: MetricTargetTrackingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in, in response to a metric
     */
    scaleOnMetric(id: string, props: BasicStepScalingPolicyProps): StepScalingPolicy;
    addUserData(..._commands: string[]): void;
}
/**
 * A Fleet represents a managed set of EC2 instances
 *
 * The Fleet models a number of AutoScalingGroups, a launch configuration, a
 * security group and an instance role.
 *
 * It allows adding arbitrary commands to the startup scripts of the instances
 * in the fleet.
 *
 * The ASG spans the availability zones specified by vpcSubnets, falling back to
 * the Vpc default strategy if not specified.
 */
export declare class AutoScalingGroup extends AutoScalingGroupBase implements elb.ILoadBalancerTarget, ec2.IConnectable, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {
    static fromAutoScalingGroupName(scope: Construct, id: string, autoScalingGroupName: string): IAutoScalingGroup;
    /**
     * The type of OS instances of this fleet are running.
     */
    readonly osType: ec2.OperatingSystemType;
    /**
     * The principal to grant permissions to
     */
    readonly grantPrincipal: iam.IPrincipal;
    /**
     * Name of the AutoScalingGroup
     */
    readonly autoScalingGroupName: string;
    /**
     * Arn of the AutoScalingGroup
     */
    readonly autoScalingGroupArn: string;
    /**
     * The maximum spot price configured for the autoscaling group. `undefined`
     * indicates that this group uses on-demand capacity.
     */
    readonly spotPrice?: string;
    /**
     * The maximum amount of time that an instance can be in service.
     */
    readonly maxInstanceLifetime?: Duration;
    private readonly autoScalingGroup;
    private readonly securityGroup?;
    private readonly securityGroups?;
    private readonly loadBalancerNames;
    private readonly targetGroupArns;
    private readonly groupMetrics;
    private readonly notifications;
    private readonly launchTemplate?;
    private readonly _connections?;
    private readonly _userData?;
    private readonly _role?;
    protected newInstancesProtectedFromScaleIn?: boolean;
    constructor(scope: Construct, id: string, props: AutoScalingGroupProps);
    /**
     * Add the security group to all instances via the launch configuration
     * security groups array.
     *
     * @param securityGroup: The security group to add
     */
    addSecurityGroup(securityGroup: ec2.ISecurityGroup): void;
    /**
     * Attach to a classic load balancer
     */
    attachToClassicLB(loadBalancer: elb.LoadBalancer): void;
    /**
     * Attach to ELBv2 Application Target Group
     */
    attachToApplicationTargetGroup(targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps;
    /**
     * Attach to ELBv2 Application Target Group
     */
    attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps;
    addUserData(...commands: string[]): void;
    /**
     * Adds a statement to the IAM role assumed by instances of this fleet.
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Use a CloudFormation Init configuration at instance startup
     *
     * This does the following:
     *
     * - Attaches the CloudFormation Init metadata to the AutoScalingGroup resource.
     * - Add commands to the UserData to run `cfn-init` and `cfn-signal`.
     * - Update the instance's CreationPolicy to wait for `cfn-init` to finish
     *   before reporting success.
     */
    applyCloudFormationInit(init: ec2.CloudFormationInit, options?: ApplyCloudFormationInitOptions): void;
    /**
     * Ensures newly-launched instances are protected from scale-in.
     */
    protectNewInstancesFromScaleIn(): void;
    /**
     * Returns `true` if newly-launched instances are protected from scale-in.
     */
    areNewInstancesProtectedFromScaleIn(): boolean;
    /**
     * The network connections associated with this resource.
     */
    get connections(): ec2.Connections;
    /**
     * The Base64-encoded user data to make available to the launched EC2 instances.
     *
     * @throws an error if a launch template is given and it does not provide a non-null `userData`
     */
    get userData(): ec2.UserData;
    /**
     * The IAM Role in the instance profile
     *
     * @throws an error if a launch template is given
     */
    get role(): iam.IRole;
    private verifyNoLaunchConfigPropIsGiven;
    /**
     * Apply CloudFormation update policies for the AutoScalingGroup
     */
    private applyUpdatePolicies;
    /**
     * Use 'signals' and 'updatePolicy' to determine the creation and update policies
     */
    private applyNewSignalUpdatePolicies;
    private applyLegacySignalUpdatePolicies;
    private renderNotificationConfiguration;
    private renderMetricsCollection;
    private getLaunchSettings;
    private convertILaunchTemplateToSpecification;
    private validateTargetGroup;
}
/**
 * The type of update to perform on instances in this AutoScalingGroup
 *
 * @deprecated Use UpdatePolicy instead
 */
export declare enum UpdateType {
    /**
     * Don't do anything
     */
    NONE = "None",
    /**
     * Replace the entire AutoScalingGroup
     *
     * Builds a new AutoScalingGroup first, then delete the old one.
     */
    REPLACING_UPDATE = "Replace",
    /**
     * Replace the instances in the AutoScalingGroup.
     */
    ROLLING_UPDATE = "RollingUpdate"
}
/**
 * AutoScalingGroup fleet change notifications configurations.
 * You can configure AutoScaling to send an SNS notification whenever your Auto Scaling group scales.
 */
export interface NotificationConfiguration {
    /**
     * SNS topic to send notifications about fleet scaling events
     */
    readonly topic: sns.ITopic;
    /**
     * Which fleet scaling events triggers a notification
     * @default ScalingEvents.ALL
     */
    readonly scalingEvents?: ScalingEvents;
}
/**
 * Fleet scaling events
 */
export declare enum ScalingEvent {
    /**
     * Notify when an instance was launched
     */
    INSTANCE_LAUNCH = "autoscaling:EC2_INSTANCE_LAUNCH",
    /**
     * Notify when an instance was terminated
     */
    INSTANCE_TERMINATE = "autoscaling:EC2_INSTANCE_TERMINATE",
    /**
     * Notify when an instance failed to terminate
     */
    INSTANCE_TERMINATE_ERROR = "autoscaling:EC2_INSTANCE_TERMINATE_ERROR",
    /**
     * Notify when an instance failed to launch
     */
    INSTANCE_LAUNCH_ERROR = "autoscaling:EC2_INSTANCE_LAUNCH_ERROR",
    /**
     * Send a test notification to the topic
     */
    TEST_NOTIFICATION = "autoscaling:TEST_NOTIFICATION"
}
/**
 * Additional settings when a rolling update is selected
 * @deprecated use `UpdatePolicy.rollingUpdate()`
 */
export interface RollingUpdateConfiguration {
    /**
     * The maximum number of instances that AWS CloudFormation updates at once.
     *
     * @default 1
     */
    readonly maxBatchSize?: number;
    /**
     * The minimum number of instances that must be in service before more instances are replaced.
     *
     * This number affects the speed of the replacement.
     *
     * @default 0
     */
    readonly minInstancesInService?: number;
    /**
     * The percentage of instances that must signal success for an update to succeed.
     *
     * If an instance doesn't send a signal within the time specified in the
     * pauseTime property, AWS CloudFormation assumes that the instance wasn't
     * updated.
     *
     * This number affects the success of the replacement.
     *
     * If you specify this property, you must also enable the
     * waitOnResourceSignals and pauseTime properties.
     *
     * @default 100
     */
    readonly minSuccessfulInstancesPercent?: number;
    /**
     * The pause time after making a change to a batch of instances.
     *
     * This is intended to give those instances time to start software applications.
     *
     * Specify PauseTime in the ISO8601 duration format (in the format
     * PT#H#M#S, where each # is the number of hours, minutes, and seconds,
     * respectively). The maximum PauseTime is one hour (PT1H).
     *
     * @default Duration.minutes(5) if the waitOnResourceSignals property is true, otherwise 0
     */
    readonly pauseTime?: Duration;
    /**
     * Specifies whether the Auto Scaling group waits on signals from new instances during an update.
     *
     * AWS CloudFormation must receive a signal from each new instance within
     * the specified PauseTime before continuing the update.
     *
     * To have instances wait for an Elastic Load Balancing health check before
     * they signal success, add a health-check verification by using the
     * cfn-init helper script. For an example, see the verify_instance_health
     * command in the Auto Scaling rolling updates sample template.
     *
     * @default true if you specified the minSuccessfulInstancesPercent property, false otherwise
     */
    readonly waitOnResourceSignals?: boolean;
    /**
     * Specifies the Auto Scaling processes to suspend during a stack update.
     *
     * Suspending processes prevents Auto Scaling from interfering with a stack
     * update.
     *
     * @default HealthCheck, ReplaceUnhealthy, AZRebalance, AlarmNotification, ScheduledActions.
     */
    readonly suspendProcesses?: ScalingProcess[];
}
/**
 * A list of ScalingEvents, you can use one of the predefined lists, such as ScalingEvents.ERRORS
 * or create a custom group by instantiating a `NotificationTypes` object, e.g: `new NotificationTypes(`NotificationType.INSTANCE_LAUNCH`)`.
 */
export declare class ScalingEvents {
    /**
     * Fleet scaling errors
     */
    static readonly ERRORS: ScalingEvents;
    /**
     * All fleet scaling events
     */
    static readonly ALL: ScalingEvents;
    /**
     * Fleet scaling launch events
     */
    static readonly LAUNCH_EVENTS: ScalingEvents;
    /**
     * Fleet termination launch events
     */
    static readonly TERMINATION_EVENTS: ScalingEvents;
    /**
     * @internal
     */
    readonly _types: ScalingEvent[];
    constructor(...types: ScalingEvent[]);
}
export declare enum ScalingProcess {
    LAUNCH = "Launch",
    TERMINATE = "Terminate",
    HEALTH_CHECK = "HealthCheck",
    REPLACE_UNHEALTHY = "ReplaceUnhealthy",
    AZ_REBALANCE = "AZRebalance",
    ALARM_NOTIFICATION = "AlarmNotification",
    SCHEDULED_ACTIONS = "ScheduledActions",
    ADD_TO_LOAD_BALANCER = "AddToLoadBalancer"
}
/**
 * EC2 Heath check options
 */
export interface Ec2HealthCheckOptions {
    /**
     * Specified the time Auto Scaling waits before checking the health status of an EC2 instance that has come into service
     *
     * @default Duration.seconds(0)
     */
    readonly grace?: Duration;
}
/**
 * ELB Heath check options
 */
export interface ElbHealthCheckOptions {
    /**
     * Specified the time Auto Scaling waits before checking the health status of an EC2 instance that has come into service
     *
     * This option is required for ELB health checks.
     */
    readonly grace: Duration;
}
/**
 * Health check settings
 */
export declare class HealthCheck {
    readonly type: string;
    readonly gracePeriod?: Duration | undefined;
    /**
     * Use EC2 for health checks
     *
     * @param options EC2 health check options
     */
    static ec2(options?: Ec2HealthCheckOptions): HealthCheck;
    /**
     * Use ELB for health checks.
     * It considers the instance unhealthy if it fails either the EC2 status checks or the load balancer health checks.
     *
     * @param options ELB health check options
     */
    static elb(options: ElbHealthCheckOptions): HealthCheck;
    private constructor();
}
/**
 * An AutoScalingGroup
 */
export interface IAutoScalingGroup extends IResource, iam.IGrantable {
    /**
     * The name of the AutoScalingGroup
     * @attribute
     */
    readonly autoScalingGroupName: string;
    /**
     * The arn of the AutoScalingGroup
     * @attribute
     */
    readonly autoScalingGroupArn: string;
    /**
     * The operating system family that the instances in this auto-scaling group belong to.
     * Is 'UNKNOWN' for imported ASGs.
     */
    readonly osType: ec2.OperatingSystemType;
    /**
     * Add command to the startup script of fleet instances.
     * The command must be in the scripting language supported by the fleet's OS (i.e. Linux/Windows).
     * Does nothing for imported ASGs.
     */
    addUserData(...commands: string[]): void;
    /**
     * Send a message to either an SQS queue or SNS topic when instances launch or terminate
     */
    addLifecycleHook(id: string, props: BasicLifecycleHookProps): LifecycleHook;
    /**
     * Add a pool of pre-initialized EC2 instances that sits alongside an Auto Scaling group
     */
    addWarmPool(options?: WarmPoolOptions): WarmPool;
    /**
     * Scale out or in based on time
     */
    scaleOnSchedule(id: string, props: BasicScheduledActionProps): ScheduledAction;
    /**
     * Scale out or in to achieve a target CPU utilization
     */
    scaleOnCpuUtilization(id: string, props: CpuUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in to achieve a target network ingress rate
     */
    scaleOnIncomingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in to achieve a target network egress rate
     */
    scaleOnOutgoingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    scaleToTrackMetric(id: string, props: MetricTargetTrackingProps): TargetTrackingScalingPolicy;
    /**
     * Scale out or in, in response to a metric
     */
    scaleOnMetric(id: string, props: BasicStepScalingPolicyProps): StepScalingPolicy;
}
/**
 * Properties for enabling scaling based on CPU utilization
 */
export interface CpuUtilizationScalingProps extends BaseTargetTrackingProps {
    /**
     * Target average CPU utilization across the task
     */
    readonly targetUtilizationPercent: number;
}
/**
 * Properties for enabling scaling based on network utilization
 */
export interface NetworkUtilizationScalingProps extends BaseTargetTrackingProps {
    /**
     * Target average bytes/seconds on each instance
     */
    readonly targetBytesPerSecond: number;
}
/**
 * Properties for enabling scaling based on request/second
 */
export interface RequestCountScalingProps extends BaseTargetTrackingProps {
    /**
     * Target average requests/seconds on each instance
     *
     * @deprecated Use 'targetRequestsPerMinute' instead
     * @default - Specify exactly one of 'targetRequestsPerMinute' and 'targetRequestsPerSecond'
     */
    readonly targetRequestsPerSecond?: number;
    /**
     * Target average requests/minute on each instance
     * @default - Specify exactly one of 'targetRequestsPerMinute' and 'targetRequestsPerSecond'
     */
    readonly targetRequestsPerMinute?: number;
}
/**
 * Properties for enabling tracking of an arbitrary metric
 */
export interface MetricTargetTrackingProps extends BaseTargetTrackingProps {
    /**
     * Metric to track
     *
     * The metric must represent a utilization, so that if it's higher than the
     * target value, your ASG should scale out, and if it's lower it should
     * scale in.
     */
    readonly metric: cloudwatch.IMetric;
    /**
     * Value to keep the metric around
     */
    readonly targetValue: number;
}
/**
 * Options for applying CloudFormation init to an instance or instance group
 */
export interface ApplyCloudFormationInitOptions {
    /**
     * ConfigSet to activate
     *
     * @default ['default']
     */
    readonly configSets?: string[];
    /**
     * Force instance replacement by embedding a config fingerprint
     *
     * If `true` (the default), a hash of the config will be embedded into the
     * UserData, so that if the config changes, the UserData changes and
     * instances will be replaced (given an UpdatePolicy has been configured on
     * the AutoScalingGroup).
     *
     * If `false`, no such hash will be embedded, and if the CloudFormation Init
     * config changes nothing will happen to the running instances. If a
     * config update introduces errors, you will not notice until after the
     * CloudFormation deployment successfully finishes and the next instance
     * fails to launch.
     *
     * @default true
     */
    readonly embedFingerprint?: boolean;
    /**
     * Print the results of running cfn-init to the Instance System Log
     *
     * By default, the output of running cfn-init is written to a log file
     * on the instance. Set this to `true` to print it to the System Log
     * (visible from the EC2 Console), `false` to not print it.
     *
     * (Be aware that the system log is refreshed at certain points in
     * time of the instance life cycle, and successful execution may
     * not always show up).
     *
     * @default true
     */
    readonly printLog?: boolean;
    /**
     * Don't fail the instance creation when cfn-init fails
     *
     * You can use this to prevent CloudFormation from rolling back when
     * instances fail to start up, to help in debugging.
     *
     * @default false
     */
    readonly ignoreFailures?: boolean;
    /**
     * Include --url argument when running cfn-init and cfn-signal commands
     *
     * This will be the cloudformation endpoint in the deployed region
     * e.g. https://cloudformation.us-east-1.amazonaws.com
     *
     * @default false
     */
    readonly includeUrl?: boolean;
    /**
    * Include --role argument when running cfn-init and cfn-signal commands
    *
    * This will be the IAM instance profile attached to the EC2 instance
    *
    * @default false
    */
    readonly includeRole?: boolean;
}
export {};
