import { Construct } from 'constructs';
import {
  AutoScalingGroup,
  HealthCheck,
  NotificationConfiguration,
  GroupMetrics,
  Signals,
  UpdatePolicy,
  MixedInstancesPolicy,
  ApplyCloudFormationInitOptions,
} from './auto-scaling-group';
import { TerminationPolicy } from './termination-policy';
import * as ec2 from '../../aws-ec2';
import { Duration } from '../../core';

/**
 * Basic properties of an AutoScalingGroup, except the exact machines to run and where they should run
 *
 * Constructs that want to create AutoScalingGroups can inherit
 * this interface and specialize the essential parts in various ways.
 */
export interface CommonAutoScalingGroupV2Props {
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
   * Where to place instances within the VPC
   *
   * @default - All Private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

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
   * Default scaling cooldown for this AutoScalingGroup
   *
   * @default Duration.minutes(5)
   */
  readonly cooldown?: Duration;

  /**
   * Configuration for health checks
   *
   * @default - HealthCheck.ec2 with no grace period
   */
  readonly healthCheck?: HealthCheck;

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

  /**
   * Add SSM session permissions to the instance role
   *
   * Setting this to `true` adds the necessary permissions to connect
   * to the instance using SSM Session Manager. You can do this
   * from the AWS Console.
   *
   * NOTE: Setting this flag to `true` may not be enough by itself.
   * You must also use an AMI that comes with the SSM Agent, or install
   * the SSM Agent yourself. See
   * [Working with SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)
   * in the SSM Developer Guide.
   *
   * @default false
   */
  readonly ssmSessionPermissions?: boolean;
}

/**
 * Properties of a Fleet
 */
export interface AutoScalingGroupV2Props extends CommonAutoScalingGroupV2Props {
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
export class AutoScalingGroupV2 extends AutoScalingGroup {
  constructor(scope: Construct, id: string, props: AutoScalingGroupV2Props) {
    super(scope, id, props);
  }

  public addUserData(...commands: string[]): void {
    this.launchTemplate?.userData?.addCommands(...commands);
  }
}