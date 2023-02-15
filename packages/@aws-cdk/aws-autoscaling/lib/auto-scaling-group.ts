import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';

import {
  Annotations,
  Aspects,
  Aws,
  CfnAutoScalingRollingUpdate, CfnCreationPolicy, CfnUpdatePolicy,
  Duration, Fn, IResource, Lazy, PhysicalName, Resource, Stack, Tags,
  Token,
  Tokenization, withResolved,
} from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AutoScalingGroupRequireImdsv2Aspect } from './aspects';
import { CfnAutoScalingGroup, CfnAutoScalingGroupProps, CfnLaunchConfiguration } from './autoscaling.generated';
import { BasicLifecycleHookProps, LifecycleHook } from './lifecycle-hook';
import { BasicScheduledActionProps, ScheduledAction } from './scheduled-action';
import { BasicStepScalingPolicyProps, StepScalingPolicy } from './step-scaling-policy';
import { BaseTargetTrackingProps, PredefinedMetric, TargetTrackingScalingPolicy } from './target-tracking-scaling-policy';
import { TerminationPolicy } from './termination-policy';
import { BlockDevice, BlockDeviceVolume, EbsDeviceVolumeType } from './volume';
import { WarmPool, WarmPoolOptions } from './warm-pool';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * The monitoring mode for instances launched in an autoscaling group
 */
export enum Monitoring {
  /**
   * Generates metrics every 5 minutes
   */
  BASIC,

  /**
   * Generates metrics every minute
   */
  DETAILED,
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
export enum OnDemandAllocationStrategy {
  /**
   * This strategy uses the order of instance types in the LaunchTemplateOverrides to define the launch
   * priority of each instance type. The first instance type in the array is prioritized higher than the
   * last. If all your On-Demand capacity cannot be fulfilled using your highest priority instance, then
   * the Auto Scaling group launches the remaining capacity using the second priority instance type, and
   * so on.
   */
  PRIORITIZED = 'prioritized',
}

/**
 * Indicates how to allocate instance types to fulfill Spot capacity.
 */
export enum SpotAllocationStrategy {
  /**
   * The Auto Scaling group launches instances using the Spot pools with the lowest price, and evenly
   * allocates your instances across the number of Spot pools that you specify.
   */
  LOWEST_PRICE = 'lowest-price',

  /**
   * The Auto Scaling group launches instances using Spot pools that are optimally chosen based on the
   * available Spot capacity.
   *
   * Recommended.
   */
  CAPACITY_OPTIMIZED = 'capacity-optimized',

  /**
   * When you use this strategy, you need to set the order of instance types in the list of launch template
   * overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling
   * honors the instance type priorities on a best-effort basis but optimizes for capacity first.
   */
  CAPACITY_OPTIMIZED_PRIORITIZED = 'capacity-optimized-prioritized',

  /**
   * The price and capacity optimized allocation strategy looks at both price and
   * capacity to select the Spot Instance pools that are the least likely to be
   * interrupted and have the lowest possible price.
   */
  PRICE_CAPACITY_OPTIMIZED = 'price-capacity-optimized',
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
  readonly onDemandAllocationStrategy?: OnDemandAllocationStrategy,

  /**
   * The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances. This
   * base portion is provisioned first as your group scales. Defaults to 0 if not specified. If you specify weights
   * for the instance types in the overrides, set the value of OnDemandBaseCapacity in terms of the number of
   * capacity units, and not the number of instances.
   *
   * @default 0
   */
  readonly onDemandBaseCapacity?: number,

  /**
   * Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond
   * OnDemandBaseCapacity. Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances).
   * Defaults to 100 if not specified. If set to 100, only On-Demand Instances are provisioned.
   *
   * @default 100
   */
  readonly onDemandPercentageAboveBaseCapacity?: number,

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
  readonly spotAllocationStrategy?: SpotAllocationStrategy,

  /**
   * The number of Spot Instance pools to use to allocate your Spot capacity. The Spot pools are determined from the different instance
   * types in the overrides. Valid only when the Spot allocation strategy is lowest-price. Value must be in the range of 1 to 20.
   * Defaults to 2 if not specified.
   *
   * @default 2
   */
  readonly spotInstancePools?: number,

  /**
   * The maximum price per unit hour that you are willing to pay for a Spot Instance. If you leave the value at its default (empty),
   * Amazon EC2 Auto Scaling uses the On-Demand price as the maximum Spot price. To remove a value that you previously set, include
   * the property but specify an empty string ("") for the value.
   *
   * @default "" - On-Demand price
   */
  readonly spotMaxPrice?: string
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
  readonly instanceType: ec2.InstanceType,

  /**
   * Provides the launch template to be used when launching the instance type. For example, some instance types might
   * require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template
   * that's defined for your mixed instances policy.
   *
   * @default - Do not override launch template
   */
  readonly launchTemplate?: ec2.ILaunchTemplate,

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
  readonly weightedCapacity?: number
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
export abstract class Signals {
  /**
   * Wait for the desiredCapacity of the AutoScalingGroup amount of signals to have been received
   *
   * If no desiredCapacity has been configured, wait for minCapacity signals intead.
   *
   * This number is used during initial creation and during replacing updates.
   * During rolling updates, all updated instances must send a signal.
   */
  public static waitForAll(options: SignalsOptions = {}): Signals {
    validatePercentage(options.minSuccessPercentage);
    return new class extends Signals {
      public renderCreationPolicy(renderOptions: RenderSignalsOptions): CfnCreationPolicy {
        return this.doRender(options, renderOptions.desiredCapacity ?? renderOptions.minCapacity);
      }
    }();
  }

  /**
   * Wait for the minCapacity of the AutoScalingGroup amount of signals to have been received
   *
   * This number is used during initial creation and during replacing updates.
   * During rolling updates, all updated instances must send a signal.
   */
  public static waitForMinCapacity(options: SignalsOptions = {}): Signals {
    validatePercentage(options.minSuccessPercentage);
    return new class extends Signals {
      public renderCreationPolicy(renderOptions: RenderSignalsOptions): CfnCreationPolicy {
        return this.doRender(options, renderOptions.minCapacity);
      }
    }();
  }

  /**
   * Wait for a specific amount of signals to have been received
   *
   * You should send one signal per instance, so this represents the number of
   * instances to wait for.
   *
   * This number is used during initial creation and during replacing updates.
   * During rolling updates, all updated instances must send a signal.
   */
  public static waitForCount(count: number, options: SignalsOptions = {}): Signals {
    validatePercentage(options.minSuccessPercentage);
    return new class extends Signals {
      public renderCreationPolicy(): CfnCreationPolicy {
        return this.doRender(options, count);
      }
    }();
  }

  /**
   * Render the ASG's CreationPolicy
   */
  public abstract renderCreationPolicy(renderOptions: RenderSignalsOptions): CfnCreationPolicy;

  /**
   * Helper to render the actual creation policy, as the logic between them is quite similar
   */
  protected doRender(options: SignalsOptions, count?: number): CfnCreationPolicy {
    const minSuccessfulInstancesPercent = validatePercentage(options.minSuccessPercentage);
    return {
      ...options.minSuccessPercentage !== undefined ? { autoScalingCreationPolicy: { minSuccessfulInstancesPercent } } : { },
      resourceSignal: {
        count,
        timeout: options.timeout?.toIsoString(),
      },
    };
  }

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
export abstract class UpdatePolicy {
  /**
   * Create a new AutoScalingGroup and switch over to it
   */
  public static replacingUpdate(): UpdatePolicy {
    return new class extends UpdatePolicy {
      public _renderUpdatePolicy(): CfnUpdatePolicy {
        return {
          autoScalingReplacingUpdate: { willReplace: true },
        };
      }
    }();
  }

  /**
   * Replace the instances in the AutoScalingGroup one by one, or in batches
   */
  public static rollingUpdate(options: RollingUpdateOptions = {}): UpdatePolicy {
    const minSuccessPercentage = validatePercentage(options.minSuccessPercentage);

    return new class extends UpdatePolicy {
      public _renderUpdatePolicy(renderOptions: RenderUpdateOptions): CfnUpdatePolicy {
        return {
          autoScalingRollingUpdate: {
            maxBatchSize: options.maxBatchSize,
            minInstancesInService: options.minInstancesInService,
            suspendProcesses: options.suspendProcesses ?? DEFAULT_SUSPEND_PROCESSES,
            minSuccessfulInstancesPercent:
              minSuccessPercentage ?? renderOptions.creationPolicy?.autoScalingCreationPolicy?.minSuccessfulInstancesPercent,
            waitOnResourceSignals: options.waitOnResourceSignals ?? renderOptions.creationPolicy?.resourceSignal !== undefined ? true : undefined,
            pauseTime: options.pauseTime?.toIsoString() ?? renderOptions.creationPolicy?.resourceSignal?.timeout,
          },
        };
      }
    }();
  }

  /**
   * Render the ASG's CreationPolicy
   * @internal
   */
  public abstract _renderUpdatePolicy(renderOptions: RenderUpdateOptions): CfnUpdatePolicy;
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
export class GroupMetrics {

  /**
   * Report all group metrics.
   */
  public static all(): GroupMetrics {
    return new GroupMetrics();
  }

  /**
   * @internal
   */
  public _metrics = new Set<GroupMetric>();

  constructor(...metrics: GroupMetric[]) {
    metrics?.forEach(metric => this._metrics.add(metric));
  }
}

/**
 * Group metrics that an Auto Scaling group sends to Amazon CloudWatch.
 */
export class GroupMetric {

  /**
   * The minimum size of the Auto Scaling group
   */
  public static readonly MIN_SIZE = new GroupMetric('GroupMinSize');

  /**
   * The maximum size of the Auto Scaling group
   */
  public static readonly MAX_SIZE = new GroupMetric('GroupMaxSize');

  /**
   * The number of instances that the Auto Scaling group attempts to maintain
   */
  public static readonly DESIRED_CAPACITY = new GroupMetric('GroupDesiredCapacity');

  /**
   * The number of instances that are running as part of the Auto Scaling group
   * This metric does not include instances that are pending or terminating
   */
  public static readonly IN_SERVICE_INSTANCES = new GroupMetric('GroupInServiceInstances');

  /**
   * The number of instances that are pending
   * A pending instance is not yet in service, this metric does not include instances that are in service or terminating
   */
  public static readonly PENDING_INSTANCES = new GroupMetric('GroupPendingInstances');

  /**
   * The number of instances that are in a Standby state
   * Instances in this state are still running but are not actively in service
   */
  public static readonly STANDBY_INSTANCES = new GroupMetric('GroupStandbyInstances');

  /**
   * The number of instances that are in the process of terminating
   * This metric does not include instances that are in service or pending
   */
  public static readonly TERMINATING_INSTANCES = new GroupMetric('GroupTerminatingInstances');

  /**
   * The total number of instances in the Auto Scaling group
   * This metric identifies the number of instances that are in service, pending, and terminating
   */
  public static readonly TOTAL_INSTANCES = new GroupMetric('GroupTotalInstances');

  /**
   * The name of the group metric
   */
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

abstract class AutoScalingGroupBase extends Resource implements IAutoScalingGroup {

  public abstract autoScalingGroupName: string;
  public abstract autoScalingGroupArn: string;
  public abstract readonly osType: ec2.OperatingSystemType;
  protected albTargetGroup?: elbv2.ApplicationTargetGroup;
  public readonly grantPrincipal: iam.IPrincipal = new iam.UnknownPrincipal({ resource: this });
  protected hasCalledScaleOnRequestCount: boolean = false;

  /**
   * Send a message to either an SQS queue or SNS topic when instances launch or terminate
   */
  public addLifecycleHook(id: string, props: BasicLifecycleHookProps): LifecycleHook {
    return new LifecycleHook(this, `LifecycleHook${id}`, {
      autoScalingGroup: this,
      ...props,
    });
  }

  /**
   * Add a pool of pre-initialized EC2 instances that sits alongside an Auto Scaling group
   */
  public addWarmPool(options?: WarmPoolOptions): WarmPool {
    return new WarmPool(this, 'WarmPool', {
      autoScalingGroup: this,
      ...options,
    });
  }

  /**
   * Scale out or in based on time
   */
  public scaleOnSchedule(id: string, props: BasicScheduledActionProps): ScheduledAction {
    return new ScheduledAction(this, `ScheduledAction${id}`, {
      autoScalingGroup: this,
      ...props,
    });
  }

  /**
   * Scale out or in to achieve a target CPU utilization
   */
  public scaleOnCpuUtilization(id: string, props: CpuUtilizationScalingProps): TargetTrackingScalingPolicy {
    return new TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
      autoScalingGroup: this,
      predefinedMetric: PredefinedMetric.ASG_AVERAGE_CPU_UTILIZATION,
      targetValue: props.targetUtilizationPercent,
      ...props,
    });
  }

  /**
   * Scale out or in to achieve a target network ingress rate
   */
  public scaleOnIncomingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy {
    return new TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
      autoScalingGroup: this,
      predefinedMetric: PredefinedMetric.ASG_AVERAGE_NETWORK_IN,
      targetValue: props.targetBytesPerSecond,
      ...props,
    });
  }

  /**
   * Scale out or in to achieve a target network egress rate
   */
  public scaleOnOutgoingBytes(id: string, props: NetworkUtilizationScalingProps): TargetTrackingScalingPolicy {
    return new TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
      autoScalingGroup: this,
      predefinedMetric: PredefinedMetric.ASG_AVERAGE_NETWORK_OUT,
      targetValue: props.targetBytesPerSecond,
      ...props,
    });
  }

  /**
   * Scale out or in to achieve a target request handling rate
   *
   * The AutoScalingGroup must have been attached to an Application Load Balancer
   * in order to be able to call this.
   */
  public scaleOnRequestCount(id: string, props: RequestCountScalingProps): TargetTrackingScalingPolicy {
    if (this.albTargetGroup === undefined) {
      throw new Error('Attach the AutoScalingGroup to a non-imported Application Load Balancer before calling scaleOnRequestCount()');
    }

    const resourceLabel = `${this.albTargetGroup.firstLoadBalancerFullName}/${this.albTargetGroup.targetGroupFullName}`;

    if ((props.targetRequestsPerMinute === undefined) === (props.targetRequestsPerSecond === undefined)) {
      throw new Error('Specify exactly one of \'targetRequestsPerMinute\' or \'targetRequestsPerSecond\'');
    }

    let rpm: number;
    if (props.targetRequestsPerSecond !== undefined) {
      if (Token.isUnresolved(props.targetRequestsPerSecond)) {
        throw new Error('\'targetRequestsPerSecond\' cannot be an unresolved value; use \'targetRequestsPerMinute\' instead.');
      }
      rpm = props.targetRequestsPerSecond * 60;
    } else {
      rpm = props.targetRequestsPerMinute!;
    }

    const policy = new TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
      autoScalingGroup: this,
      predefinedMetric: PredefinedMetric.ALB_REQUEST_COUNT_PER_TARGET,
      targetValue: rpm,
      resourceLabel,
      ...props,
    });

    policy.node.addDependency(this.albTargetGroup.loadBalancerAttached);
    this.hasCalledScaleOnRequestCount = true;
    return policy;
  }

  /**
   * Scale out or in in order to keep a metric around a target value
   */
  public scaleToTrackMetric(id: string, props: MetricTargetTrackingProps): TargetTrackingScalingPolicy {
    return new TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
      autoScalingGroup: this,
      customMetric: props.metric,
      ...props,
    });
  }

  /**
   * Scale out or in, in response to a metric
   */
  public scaleOnMetric(id: string, props: BasicStepScalingPolicyProps): StepScalingPolicy {
    return new StepScalingPolicy(this, id, { ...props, autoScalingGroup: this });
  }

  public addUserData(..._commands: string[]): void {
    // do nothing
  }
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
export class AutoScalingGroup extends AutoScalingGroupBase implements
  elb.ILoadBalancerTarget,
  ec2.IConnectable,
  elbv2.IApplicationLoadBalancerTarget,
  elbv2.INetworkLoadBalancerTarget {

  public static fromAutoScalingGroupName(scope: Construct, id: string, autoScalingGroupName: string): IAutoScalingGroup {
    class Import extends AutoScalingGroupBase {
      public autoScalingGroupName = autoScalingGroupName;
      public autoScalingGroupArn = Stack.of(this).formatArn({
        service: 'autoscaling',
        resource: 'autoScalingGroup:*:autoScalingGroupName',
        resourceName: this.autoScalingGroupName,
      });
      public readonly osType = ec2.OperatingSystemType.UNKNOWN;
    }

    return new Import(scope, id);
  }

  /**
   * The type of OS instances of this fleet are running.
   */
  public readonly osType: ec2.OperatingSystemType;

  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * Name of the AutoScalingGroup
   */
  public readonly autoScalingGroupName: string;

  /**
   * Arn of the AutoScalingGroup
   */
  public readonly autoScalingGroupArn: string;

  /**
   * The maximum spot price configured for the autoscaling group. `undefined`
   * indicates that this group uses on-demand capacity.
   */
  public readonly spotPrice?: string;

  /**
   * The maximum amount of time that an instance can be in service.
   */
  public readonly maxInstanceLifetime?: Duration;

  private readonly autoScalingGroup: CfnAutoScalingGroup;
  private readonly securityGroup?: ec2.ISecurityGroup;
  private readonly securityGroups?: ec2.ISecurityGroup[];
  private readonly loadBalancerNames: string[] = [];
  private readonly targetGroupArns: string[] = [];
  private readonly groupMetrics: GroupMetrics[] = [];
  private readonly notifications: NotificationConfiguration[] = [];
  private readonly launchTemplate?: ec2.LaunchTemplate;
  private readonly _connections?: ec2.Connections;
  private readonly _userData?: ec2.UserData;
  private readonly _role?: iam.IRole;

  protected newInstancesProtectedFromScaleIn?: boolean;

  constructor(scope: Construct, id: string, props: AutoScalingGroupProps) {
    super(scope, id, {
      physicalName: props.autoScalingGroupName,
    });

    this.newInstancesProtectedFromScaleIn = props.newInstancesProtectedFromScaleIn;

    if (props.initOptions && !props.init) {
      throw new Error('Setting \'initOptions\' requires that \'init\' is also set');
    }

    if (props.groupMetrics) {
      this.groupMetrics.push(...props.groupMetrics);
    }

    let launchConfig: CfnLaunchConfiguration | undefined = undefined;
    if (props.launchTemplate || props.mixedInstancesPolicy) {
      this.verifyNoLaunchConfigPropIsGiven(props);

      const bareLaunchTemplate = props.launchTemplate;
      const mixedInstancesPolicy = props.mixedInstancesPolicy;

      if (bareLaunchTemplate && mixedInstancesPolicy) {
        throw new Error('Setting \'mixedInstancesPolicy\' must not be set when \'launchTemplate\' is set');
      }

      if (bareLaunchTemplate && bareLaunchTemplate instanceof ec2.LaunchTemplate) {
        if (!bareLaunchTemplate.instanceType) {
          throw new Error('Setting \'launchTemplate\' requires its \'instanceType\' to be set');
        }

        if (!bareLaunchTemplate.imageId) {
          throw new Error('Setting \'launchTemplate\' requires its \'machineImage\' to be set');
        }

        this.launchTemplate = bareLaunchTemplate;
      }

      if (mixedInstancesPolicy && mixedInstancesPolicy.launchTemplate instanceof ec2.LaunchTemplate) {
        if (!mixedInstancesPolicy.launchTemplate.imageId) {
          throw new Error('Setting \'mixedInstancesPolicy.launchTemplate\' requires its \'machineImage\' to be set');
        }

        this.launchTemplate = mixedInstancesPolicy.launchTemplate;
      }

      this._role = this.launchTemplate?.role;
      this.grantPrincipal = this._role || new iam.UnknownPrincipal({ resource: this });

      this.osType = this.launchTemplate?.osType ?? ec2.OperatingSystemType.UNKNOWN;
    } else {
      if (!props.machineImage) {
        throw new Error('Setting \'machineImage\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
      }
      if (!props.instanceType) {
        throw new Error('Setting \'instanceType\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
      }

      this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'InstanceSecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: props.allowAllOutbound !== false,
      });
      this._connections = new ec2.Connections({ securityGroups: [this.securityGroup] });
      this.securityGroups = [this.securityGroup];
      Tags.of(this).add(NAME_TAG, this.node.path);

      this._role = props.role || new iam.Role(this, 'InstanceRole', {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

      this.grantPrincipal = this._role;

      const iamProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
        roles: [this.role.roleName],
      });

      // use delayed evaluation
      const imageConfig = props.machineImage.getImage(this);
      this._userData = props.userData ?? imageConfig.userData;
      const userDataToken = Lazy.string({ produce: () => Fn.base64(this.userData!.render()) });
      const securityGroupsToken = Lazy.list({ produce: () => this.securityGroups!.map(sg => sg.securityGroupId) });

      launchConfig = new CfnLaunchConfiguration(this, 'LaunchConfig', {
        imageId: imageConfig.imageId,
        keyName: props.keyName,
        instanceType: props.instanceType.toString(),
        instanceMonitoring: (props.instanceMonitoring !== undefined ? (props.instanceMonitoring === Monitoring.DETAILED) : undefined),
        securityGroups: securityGroupsToken,
        iamInstanceProfile: iamProfile.ref,
        userData: userDataToken,
        associatePublicIpAddress: props.associatePublicIpAddress,
        spotPrice: props.spotPrice,
        blockDeviceMappings: (props.blockDevices !== undefined ?
          synthesizeBlockDeviceMappings(this, props.blockDevices) : undefined),
      });

      launchConfig.node.addDependency(this.role);
      this.osType = imageConfig.osType;
    }

    // desiredCapacity just reflects what the user has supplied.
    const desiredCapacity = props.desiredCapacity;
    const minCapacity = props.minCapacity ?? 1;
    const maxCapacity = props.maxCapacity ?? desiredCapacity ?? Math.max(minCapacity, 1);

    withResolved(minCapacity, maxCapacity, (min, max) => {
      if (min > max) {
        throw new Error(`minCapacity (${min}) should be <= maxCapacity (${max})`);
      }
    });
    withResolved(desiredCapacity, minCapacity, (desired, min) => {
      if (desired === undefined) { return; }
      if (desired < min) {
        throw new Error(`Should have minCapacity (${min}) <= desiredCapacity (${desired})`);
      }
    });
    withResolved(desiredCapacity, maxCapacity, (desired, max) => {
      if (desired === undefined) { return; }
      if (max < desired) {
        throw new Error(`Should have desiredCapacity (${desired}) <= maxCapacity (${max})`);
      }
    });

    if (desiredCapacity !== undefined) {
      Annotations.of(this).addWarning('desiredCapacity has been configured. Be aware this will reset the size of your AutoScalingGroup on every deployment. See https://github.com/aws/aws-cdk/issues/5215');
    }

    this.maxInstanceLifetime = props.maxInstanceLifetime;
    // See https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html for details on max instance lifetime.
    if (this.maxInstanceLifetime && !this.maxInstanceLifetime.isUnresolved() &&
      (this.maxInstanceLifetime.toSeconds() !== 0) &&
      (this.maxInstanceLifetime.toSeconds() < 86400 || this.maxInstanceLifetime.toSeconds() > 31536000)) {
      throw new Error('maxInstanceLifetime must be between 1 and 365 days (inclusive)');
    }

    if (props.notificationsTopic && props.notifications) {
      throw new Error('Cannot set \'notificationsTopic\' and \'notifications\', \'notificationsTopic\' is deprecated use \'notifications\' instead');
    }

    if (props.notificationsTopic) {
      this.notifications = [{
        topic: props.notificationsTopic,
      }];
    }

    if (props.notifications) {
      this.notifications = props.notifications.map(nc => ({
        topic: nc.topic,
        scalingEvents: nc.scalingEvents ?? ScalingEvents.ALL,
      }));
    }

    const { subnetIds, hasPublic } = props.vpc.selectSubnets(props.vpcSubnets);
    const asgProps: CfnAutoScalingGroupProps = {
      autoScalingGroupName: this.physicalName,
      cooldown: props.cooldown?.toSeconds().toString(),
      minSize: Tokenization.stringifyNumber(minCapacity),
      maxSize: Tokenization.stringifyNumber(maxCapacity),
      desiredCapacity: desiredCapacity !== undefined ? Tokenization.stringifyNumber(desiredCapacity) : undefined,
      loadBalancerNames: Lazy.list({ produce: () => this.loadBalancerNames }, { omitEmpty: true }),
      targetGroupArns: Lazy.list({ produce: () => this.targetGroupArns }, { omitEmpty: true }),
      notificationConfigurations: this.renderNotificationConfiguration(),
      metricsCollection: Lazy.any({ produce: () => this.renderMetricsCollection() }),
      vpcZoneIdentifier: subnetIds,
      healthCheckType: props.healthCheck && props.healthCheck.type,
      healthCheckGracePeriod: props.healthCheck && props.healthCheck.gracePeriod && props.healthCheck.gracePeriod.toSeconds(),
      maxInstanceLifetime: this.maxInstanceLifetime ? this.maxInstanceLifetime.toSeconds() : undefined,
      newInstancesProtectedFromScaleIn: Lazy.any({ produce: () => this.newInstancesProtectedFromScaleIn }),
      terminationPolicies: props.terminationPolicies,
      defaultInstanceWarmup: props.defaultInstanceWarmup?.toSeconds(),
      capacityRebalance: props.capacityRebalance,
      ...this.getLaunchSettings(launchConfig, props.launchTemplate, props.mixedInstancesPolicy),
    };

    if (!hasPublic && props.associatePublicIpAddress) {
      throw new Error("To set 'associatePublicIpAddress: true' you must select Public subnets (vpcSubnets: { subnetType: SubnetType.PUBLIC })");
    }

    this.autoScalingGroup = new CfnAutoScalingGroup(this, 'ASG', asgProps);
    this.autoScalingGroupName = this.getResourceNameAttribute(this.autoScalingGroup.ref),
    this.autoScalingGroupArn = Stack.of(this).formatArn({
      service: 'autoscaling',
      resource: 'autoScalingGroup:*:autoScalingGroupName',
      resourceName: this.autoScalingGroupName,
    });
    this.node.defaultChild = this.autoScalingGroup;

    this.applyUpdatePolicies(props, { desiredCapacity, minCapacity });
    if (props.init) {
      this.applyCloudFormationInit(props.init, props.initOptions);
    }

    this.spotPrice = props.spotPrice;

    if (props.requireImdsv2) {
      Aspects.of(this).add(new AutoScalingGroupRequireImdsv2Aspect());
    }

    this.node.addValidation({ validate: () => this.validateTargetGroup() });
  }

  /**
   * Add the security group to all instances via the launch configuration
   * security groups array.
   *
   * @param securityGroup: The security group to add
   */
  public addSecurityGroup(securityGroup: ec2.ISecurityGroup): void {
    if (!this.securityGroups) {
      throw new Error('You cannot add security groups when the Auto Scaling Group is created from a Launch Template.');
    }

    this.securityGroups.push(securityGroup);
  }

  /**
   * Attach to a classic load balancer
   */
  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    this.loadBalancerNames.push(loadBalancer.loadBalancerName);
  }

  /**
   * Attach to ELBv2 Application Target Group
   */
  public attachToApplicationTargetGroup(targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    this.targetGroupArns.push(targetGroup.targetGroupArn);
    if (targetGroup instanceof elbv2.ApplicationTargetGroup) {
      // Copy onto self if it's a concrete type. We need this for autoscaling
      // based on request count, which we cannot do with an imported TargetGroup.
      this.albTargetGroup = targetGroup;
    }

    targetGroup.registerConnectable(this);
    return { targetType: elbv2.TargetType.INSTANCE };
  }

  /**
   * Attach to ELBv2 Application Target Group
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    this.targetGroupArns.push(targetGroup.targetGroupArn);
    return { targetType: elbv2.TargetType.INSTANCE };
  }

  public addUserData(...commands: string[]): void {
    this.userData.addCommands(...commands);
  }

  /**
   * Adds a statement to the IAM role assumed by instances of this fleet.
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPrincipalPolicy(statement);
  }

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
  public applyCloudFormationInit(init: ec2.CloudFormationInit, options: ApplyCloudFormationInitOptions = {}) {
    if (!this.autoScalingGroup.cfnOptions.creationPolicy?.resourceSignal) {
      throw new Error('When applying CloudFormationInit, you must also configure signals by supplying \'signals\' at instantiation time.');
    }

    init.attach(this.autoScalingGroup, {
      platform: this.osType,
      instanceRole: this.role,
      userData: this.userData,
      configSets: options.configSets,
      embedFingerprint: options.embedFingerprint,
      printLog: options.printLog,
      ignoreFailures: options.ignoreFailures,
      includeRole: options.includeRole,
      includeUrl: options.includeUrl,
    });
  }

  /**
   * Ensures newly-launched instances are protected from scale-in.
   */
  public protectNewInstancesFromScaleIn() {
    this.newInstancesProtectedFromScaleIn = true;
  }

  /**
   * Returns `true` if newly-launched instances are protected from scale-in.
   */
  public areNewInstancesProtectedFromScaleIn(): boolean {
    return this.newInstancesProtectedFromScaleIn === true;
  }

  /**
   * The network connections associated with this resource.
   */
  public get connections(): ec2.Connections {
    if (this._connections) {
      return this._connections;
    }

    if (this.launchTemplate) {
      return this.launchTemplate.connections;
    }

    throw new Error('AutoScalingGroup can only be used as IConnectable if it is not created from an imported Launch Template.');
  }

  /**
   * The Base64-encoded user data to make available to the launched EC2 instances.
   *
   * @throws an error if a launch template is given and it does not provide a non-null `userData`
   */
  public get userData(): ec2.UserData {
    if (this._userData) {
      return this._userData;
    }

    if (this.launchTemplate?.userData) {
      return this.launchTemplate.userData;
    }

    throw new Error('The provided launch template does not expose its user data.');
  }

  /**
   * The IAM Role in the instance profile
   *
   * @throws an error if a launch template is given
   */
  public get role(): iam.IRole {
    if (this._role) {
      return this._role;
    }

    throw new Error('The provided launch template does not expose or does not define its role.');
  }

  private verifyNoLaunchConfigPropIsGiven(props: AutoScalingGroupProps) {
    if (props.machineImage) {
      throw new Error('Setting \'machineImage\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.instanceType) {
      throw new Error('Setting \'instanceType\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.role) {
      throw new Error('Setting \'role\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.userData) {
      throw new Error('Setting \'userData\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.securityGroup) {
      throw new Error('Setting \'securityGroup\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.keyName) {
      throw new Error('Setting \'keyName\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.instanceMonitoring) {
      throw new Error('Setting \'instanceMonitoring\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.associatePublicIpAddress !== undefined) {
      throw new Error('Setting \'associatePublicIpAddress\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.spotPrice) {
      throw new Error('Setting \'spotPrice\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
    if (props.blockDevices) {
      throw new Error('Setting \'blockDevices\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    }
  }

  /**
   * Apply CloudFormation update policies for the AutoScalingGroup
   */
  private applyUpdatePolicies(props: AutoScalingGroupProps, signalOptions: RenderSignalsOptions) {
    // Make sure people are not using the old and new properties together
    const oldProps: Array<keyof AutoScalingGroupProps> = [
      'updateType',
      'rollingUpdateConfiguration',
      'resourceSignalCount',
      'resourceSignalTimeout',
      'replacingUpdateMinSuccessfulInstancesPercent',
    ];
    for (const prop of oldProps) {
      if ((props.signals || props.updatePolicy) && props[prop] !== undefined) {
        throw new Error(`Cannot set 'signals'/'updatePolicy' and '${prop}' together. Prefer 'signals'/'updatePolicy'`);
      }
    }

    // Reify updatePolicy to `rollingUpdate` default in case it is combined with `init`
    props = {
      ...props,
      updatePolicy: props.updatePolicy ?? (props.init ? UpdatePolicy.rollingUpdate() : undefined),
    };

    if (props.signals || props.updatePolicy) {
      this.applyNewSignalUpdatePolicies(props, signalOptions);
    } else {
      this.applyLegacySignalUpdatePolicies(props);
    }

    // The following is technically part of the "update policy" but it's also a completely
    // separate aspect of rolling/replacing update, so it's just its own top-level property.
    // Default is 'true' because that's what you're most likely to want
    if (props.ignoreUnmodifiedSizeProperties !== false) {
      this.autoScalingGroup.cfnOptions.updatePolicy = {
        ...this.autoScalingGroup.cfnOptions.updatePolicy,
        autoScalingScheduledAction: { ignoreUnmodifiedGroupSizeProperties: true },
      };
    }

    if (props.signals && !props.init) {
      // To be able to send a signal using `cfn-init`, the execution role needs
      // `cloudformation:SignalResource`. Normally the binding of CfnInit would
      // grant that permissions and another one, but if the user wants to use
      // `signals` without `init`, add the permissions here.
      //
      // If they call `applyCloudFormationInit()` after construction, nothing bad
      // happens either, we'll just have a duplicate statement which doesn't hurt.
      this.addToRolePolicy(new iam.PolicyStatement({
        actions: ['cloudformation:SignalResource'],
        resources: [Aws.STACK_ID],
      }));
    }
  }

  /**
   * Use 'signals' and 'updatePolicy' to determine the creation and update policies
   */
  private applyNewSignalUpdatePolicies(props: AutoScalingGroupProps, signalOptions: RenderSignalsOptions) {
    this.autoScalingGroup.cfnOptions.creationPolicy = props.signals?.renderCreationPolicy(signalOptions);
    this.autoScalingGroup.cfnOptions.updatePolicy = props.updatePolicy?._renderUpdatePolicy({
      creationPolicy: this.autoScalingGroup.cfnOptions.creationPolicy,
    });
  }

  private applyLegacySignalUpdatePolicies(props: AutoScalingGroupProps) {
    if (props.updateType === UpdateType.REPLACING_UPDATE) {
      this.autoScalingGroup.cfnOptions.updatePolicy = {
        ...this.autoScalingGroup.cfnOptions.updatePolicy,
        autoScalingReplacingUpdate: {
          willReplace: true,
        },
      };

      if (props.replacingUpdateMinSuccessfulInstancesPercent !== undefined) {
        // Yes, this goes on CreationPolicy, not as a process parameter to ReplacingUpdate.
        // It's a little confusing, but the docs seem to explicitly state it will only be used
        // during the update?
        //
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html
        this.autoScalingGroup.cfnOptions.creationPolicy = {
          ...this.autoScalingGroup.cfnOptions.creationPolicy,
          autoScalingCreationPolicy: {
            minSuccessfulInstancesPercent: validatePercentage(props.replacingUpdateMinSuccessfulInstancesPercent),
          },
        };
      }
    } else if (props.updateType === UpdateType.ROLLING_UPDATE) {
      this.autoScalingGroup.cfnOptions.updatePolicy = {
        ...this.autoScalingGroup.cfnOptions.updatePolicy,
        autoScalingRollingUpdate: renderRollingUpdateConfig(props.rollingUpdateConfiguration),
      };
    }

    if (props.resourceSignalCount !== undefined || props.resourceSignalTimeout !== undefined) {
      this.autoScalingGroup.cfnOptions.creationPolicy = {
        ...this.autoScalingGroup.cfnOptions.creationPolicy,
        resourceSignal: {
          count: props.resourceSignalCount,
          timeout: props.resourceSignalTimeout && props.resourceSignalTimeout.toIsoString(),
        },
      };
    }
  }

  private renderNotificationConfiguration(): CfnAutoScalingGroup.NotificationConfigurationProperty[] | undefined {
    if (this.notifications.length === 0) {
      return undefined;
    }

    return this.notifications.map(notification => ({
      topicArn: notification.topic.topicArn,
      notificationTypes: notification.scalingEvents ? notification.scalingEvents._types : ScalingEvents.ALL._types,
    }));
  }

  private renderMetricsCollection(): CfnAutoScalingGroup.MetricsCollectionProperty[] | undefined {
    if (this.groupMetrics.length === 0) {
      return undefined;
    }

    return this.groupMetrics.map(group => ({
      granularity: '1Minute',
      metrics: group._metrics?.size !== 0 ? [...group._metrics].map(m => m.name) : undefined,
    }));
  }

  private getLaunchSettings(launchConfig?: CfnLaunchConfiguration, launchTemplate?: ec2.ILaunchTemplate, mixedInstancesPolicy?: MixedInstancesPolicy)
    : Pick<CfnAutoScalingGroupProps, 'launchConfigurationName'>
    | Pick<CfnAutoScalingGroupProps, 'launchTemplate'>
    | Pick<CfnAutoScalingGroupProps, 'mixedInstancesPolicy'> {
    if (launchConfig) {
      return {
        launchConfigurationName: launchConfig.ref,
      };
    }

    if (launchTemplate) {
      return {
        launchTemplate: this.convertILaunchTemplateToSpecification(launchTemplate),
      };
    }

    if (mixedInstancesPolicy) {
      let instancesDistribution: CfnAutoScalingGroup.InstancesDistributionProperty | undefined = undefined;
      if (mixedInstancesPolicy.instancesDistribution) {
        const dist = mixedInstancesPolicy.instancesDistribution;
        instancesDistribution = {
          onDemandAllocationStrategy: dist.onDemandAllocationStrategy?.toString(),
          onDemandBaseCapacity: dist.onDemandBaseCapacity,
          onDemandPercentageAboveBaseCapacity: dist.onDemandPercentageAboveBaseCapacity,
          spotAllocationStrategy: dist.spotAllocationStrategy?.toString(),
          spotInstancePools: dist.spotInstancePools,
          spotMaxPrice: dist.spotMaxPrice,
        };
      }
      return {
        mixedInstancesPolicy: {
          instancesDistribution,
          launchTemplate: {
            launchTemplateSpecification: this.convertILaunchTemplateToSpecification(mixedInstancesPolicy.launchTemplate),
            ...(mixedInstancesPolicy.launchTemplateOverrides ? {
              overrides: mixedInstancesPolicy.launchTemplateOverrides.map(override => {
                if (override.weightedCapacity && Math.floor(override.weightedCapacity) !== override.weightedCapacity) {
                  throw new Error('Weight must be an integer');
                }
                return {
                  instanceType: override.instanceType.toString(),
                  launchTemplateSpecification: override.launchTemplate
                    ? this.convertILaunchTemplateToSpecification(override.launchTemplate)
                    : undefined,
                  weightedCapacity: override.weightedCapacity?.toString(),
                };
              }),
            } : {}),
          },
        },
      };
    }

    throw new Error('Either launchConfig, launchTemplate or mixedInstancesPolicy needs to be specified.');
  }

  private convertILaunchTemplateToSpecification(launchTemplate: ec2.ILaunchTemplate): CfnAutoScalingGroup.LaunchTemplateSpecificationProperty {
    if (launchTemplate.launchTemplateId) {
      return {
        launchTemplateId: launchTemplate.launchTemplateId,
        version: launchTemplate.versionNumber,
      };
    } else {
      return {
        launchTemplateName: launchTemplate.launchTemplateName,
        version: launchTemplate.versionNumber,
      };
    }
  }


  private validateTargetGroup(): string[] {
    const errors = new Array<string>();
    if (this.hasCalledScaleOnRequestCount && this.targetGroupArns.length > 1) {
      errors.push('Cannon use multiple target groups if `scaleOnRequestCount()` is being used.');
    }

    return errors;
  }
}

/**
 * The type of update to perform on instances in this AutoScalingGroup
 *
 * @deprecated Use UpdatePolicy instead
 */
export enum UpdateType {
  /**
   * Don't do anything
   */
  NONE = 'None',

  /**
   * Replace the entire AutoScalingGroup
   *
   * Builds a new AutoScalingGroup first, then delete the old one.
   */
  REPLACING_UPDATE = 'Replace',

  /**
   * Replace the instances in the AutoScalingGroup.
   */
  ROLLING_UPDATE = 'RollingUpdate',
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
export enum ScalingEvent {
  /**
   * Notify when an instance was launched
   */
  INSTANCE_LAUNCH = 'autoscaling:EC2_INSTANCE_LAUNCH',

  /**
   * Notify when an instance was terminated
   */
  INSTANCE_TERMINATE = 'autoscaling:EC2_INSTANCE_TERMINATE',

  /**
   * Notify when an instance failed to terminate
   */
  INSTANCE_TERMINATE_ERROR = 'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',

  /**
   * Notify when an instance failed to launch
   */
  INSTANCE_LAUNCH_ERROR = 'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',

  /**
   * Send a test notification to the topic
   */
  TEST_NOTIFICATION = 'autoscaling:TEST_NOTIFICATION'
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
export class ScalingEvents {
  /**
   * Fleet scaling errors
   */
  public static readonly ERRORS = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH_ERROR, ScalingEvent.INSTANCE_TERMINATE_ERROR);

  /**
   * All fleet scaling events
   */
  public static readonly ALL = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH,
    ScalingEvent.INSTANCE_LAUNCH_ERROR,
    ScalingEvent.INSTANCE_TERMINATE,
    ScalingEvent.INSTANCE_TERMINATE_ERROR);

  /**
   * Fleet scaling launch events
   */
  public static readonly LAUNCH_EVENTS = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH, ScalingEvent.INSTANCE_LAUNCH_ERROR);

  /**
   * Fleet termination launch events
   */
  public static readonly TERMINATION_EVENTS = new ScalingEvents(ScalingEvent.INSTANCE_TERMINATE, ScalingEvent.INSTANCE_TERMINATE_ERROR);


  /**
   * @internal
   */
  public readonly _types: ScalingEvent[];

  constructor(...types: ScalingEvent[]) {
    this._types = types;
  }
}

export enum ScalingProcess {
  LAUNCH = 'Launch',
  TERMINATE = 'Terminate',
  HEALTH_CHECK = 'HealthCheck',
  REPLACE_UNHEALTHY = 'ReplaceUnhealthy',
  AZ_REBALANCE = 'AZRebalance',
  ALARM_NOTIFICATION = 'AlarmNotification',
  SCHEDULED_ACTIONS = 'ScheduledActions',
  ADD_TO_LOAD_BALANCER = 'AddToLoadBalancer'
}

// Recommended list of processes to suspend from here:
// https://aws.amazon.com/premiumsupport/knowledge-center/auto-scaling-group-rolling-updates/
const DEFAULT_SUSPEND_PROCESSES = [ScalingProcess.HEALTH_CHECK, ScalingProcess.REPLACE_UNHEALTHY, ScalingProcess.AZ_REBALANCE,
  ScalingProcess.ALARM_NOTIFICATION, ScalingProcess.SCHEDULED_ACTIONS];

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
export class HealthCheck {
  /**
   * Use EC2 for health checks
   *
   * @param options EC2 health check options
   */
  public static ec2(options: Ec2HealthCheckOptions = {}): HealthCheck {
    return new HealthCheck(HealthCheckType.EC2, options.grace);
  }

  /**
   * Use ELB for health checks.
   * It considers the instance unhealthy if it fails either the EC2 status checks or the load balancer health checks.
   *
   * @param options ELB health check options
   */
  public static elb(options: ElbHealthCheckOptions): HealthCheck {
    return new HealthCheck(HealthCheckType.ELB, options.grace);
  }

  private constructor(public readonly type: string, public readonly gracePeriod?: Duration) { }
}

enum HealthCheckType {
  EC2 = 'EC2',
  ELB = 'ELB',
}

/**
 * Render the rolling update configuration into the appropriate object
 */
function renderRollingUpdateConfig(config: RollingUpdateConfiguration = {}): CfnAutoScalingRollingUpdate {
  const waitOnResourceSignals = config.minSuccessfulInstancesPercent !== undefined;
  const pauseTime = config.pauseTime || (waitOnResourceSignals ? Duration.minutes(5) : Duration.seconds(0));

  return {
    maxBatchSize: config.maxBatchSize,
    minInstancesInService: config.minInstancesInService,
    minSuccessfulInstancesPercent: validatePercentage(config.minSuccessfulInstancesPercent),
    waitOnResourceSignals,
    pauseTime: pauseTime && pauseTime.toIsoString(),
    suspendProcesses: config.suspendProcesses ?? DEFAULT_SUSPEND_PROCESSES,
  };
}

function validatePercentage(x?: number): number | undefined {
  if (x === undefined || (0 <= x && x <= 100)) { return x; }
  throw new Error(`Expected: a percentage 0..100, got: ${x}`);
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
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
function synthesizeBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnLaunchConfiguration.BlockDeviceMappingProperty[] {
  return blockDevices.map<CfnLaunchConfiguration.BlockDeviceMappingProperty>(({ deviceName, volume, mappingEnabled }) => {
    const { virtualName, ebsDevice: ebs } = volume;

    if (volume === BlockDeviceVolume._NO_DEVICE || mappingEnabled === false) {
      return {
        deviceName,
        noDevice: true,
      };
    }

    if (ebs) {
      const { iops, volumeType, throughput } = ebs;

      if (throughput) {
        const throughputRange = { Min: 125, Max: 1000 };
        const { Min, Max } = throughputRange;

        if (volumeType != EbsDeviceVolumeType.GP3) {
          throw new Error('throughput property requires volumeType: EbsDeviceVolumeType.GP3');
        }

        if (throughput < Min || throughput > Max) {
          throw new Error(
            `throughput property takes a minimum of ${Min} and a maximum of ${Max}`,
          );
        }

        const maximumThroughputRatio = 0.25;
        if (iops) {
          const iopsRatio = (throughput / iops);
          if (iopsRatio > maximumThroughputRatio) {
            throw new Error(`Throughput (MiBps) to iops ratio of ${iopsRatio} is too high; maximum is ${maximumThroughputRatio} MiBps per iops`);
          }
        }
      }


      if (!iops) {
        if (volumeType === EbsDeviceVolumeType.IO1) {
          throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1');
        }
      } else if (volumeType !== EbsDeviceVolumeType.IO1) {
        Annotations.of(construct).addWarning('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
      }
    }

    return {
      deviceName, ebs, virtualName,
    };
  });
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
