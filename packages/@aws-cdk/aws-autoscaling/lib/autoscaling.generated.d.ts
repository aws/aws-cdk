import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAutoScalingGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html
 */
export interface CfnAutoScalingGroupProps {
    /**
     * The maximum size of the group.
     *
     * > With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above `MaxSize` to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above `MaxSize` by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-maxsize
     */
    readonly maxSize: string;
    /**
     * The minimum size of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-minsize
     */
    readonly minSize: string;
    /**
     * The name of the Auto Scaling group. This name must be unique per Region per account.
     *
     * The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters.
     *
     * > You cannot use a colon (:) in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-autoscalinggroupname
     */
    readonly autoScalingGroupName?: string;
    /**
     * A list of Availability Zones where instances in the Auto Scaling group can be created. Used for launching into the default VPC subnet in each Availability Zone when not using the `VPCZoneIdentifier` property, or for attaching a network interface when an existing network interface ID is specified in a launch template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-availabilityzones
     */
    readonly availabilityZones?: string[];
    /**
     * Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-capacityrebalance
     */
    readonly capacityRebalance?: boolean | cdk.IResolvable;
    /**
     * Reserved.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-context
     */
    readonly context?: string;
    /**
     * *Only needed if you use simple scaling policies.*
     *
     * The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: `300` seconds
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-cooldown
     */
    readonly cooldown?: string;
    /**
     * The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the `InService` state.
     *
     * During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see [Set the default instance warmup for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * > To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, *even if it is set to 0 seconds* . To remove a value that you previously set, include the property but specify `-1` for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of `0` or other nominal value.
     *
     * Default: None
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-defaultinstancewarmup
     */
    readonly defaultInstanceWarmup?: number;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain. It can scale beyond this capacity if you configure automatic scaling.
     *
     * The number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity when creating the stack, the default is the minimum size of the group.
     *
     * CloudFormation marks the Auto Scaling group as successful (by setting its status to CREATE_COMPLETE) when the desired capacity is reached. However, if a maximum Spot price is set in the launch template or launch configuration that you specified, then desired capacity is not used as a criteria for success. Whether your request is fulfilled depends on Spot Instance capacity and your maximum price.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity
     */
    readonly desiredCapacity?: string;
    /**
     * The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports `DesiredCapacityType` for attribute-based instance type selection only. For more information, see [Creating an Auto Scaling group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-instance-type-requirements.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * By default, Amazon EC2 Auto Scaling specifies `units` , which translates into number of instances.
     *
     * Valid values: `units` | `vcpu` | `memory-mib`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacitytype
     */
    readonly desiredCapacityType?: string;
    /**
     * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the `InService` state. For more information, see [Set the health check grace period for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: `0` seconds
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthcheckgraceperiod
     */
    readonly healthCheckGracePeriod?: number;
    /**
     * Determines whether any additional health checks are performed on the instances in this group. Amazon EC2 health checks are always on. For more information, see [Health checks for Auto Scaling instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/healthcheck.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * The valid values are `EC2` (default), `ELB` , and `VPC_LATTICE` . The `VPC_LATTICE` health check type is reserved for use with VPC Lattice, which is in preview release and is subject to change.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthchecktype
     */
    readonly healthCheckType?: string;
    /**
     * The ID of the instance used to base the launch configuration on. For more information, see [Create an Auto Scaling group using an EC2 instance](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-from-instance.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify `LaunchTemplate` , `MixedInstancesPolicy` , or `LaunchConfigurationName` , don't specify `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-instanceid
     */
    readonly instanceId?: string;
    /**
     * The name of the launch configuration to use to launch instances.
     *
     * Required only if you don't specify `LaunchTemplate` , `MixedInstancesPolicy` , or `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-launchconfigurationname
     */
    readonly launchConfigurationName?: string;
    /**
     * Information used to specify the launch template and version to use to launch instances. You can alternatively associate a launch template to the Auto Scaling group by specifying a `MixedInstancesPolicy` . For more information about creating launch templates, see [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you omit this property, you must specify `MixedInstancesPolicy` , `LaunchConfigurationName` , or `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-launchtemplate
     */
    readonly launchTemplate?: CfnAutoScalingGroup.LaunchTemplateSpecificationProperty | cdk.IResolvable;
    /**
     * One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecificationlist
     */
    readonly lifecycleHookSpecificationList?: Array<CfnAutoScalingGroup.LifecycleHookSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A list of Classic Load Balancers associated with this Auto Scaling group. For Application Load Balancers, Network Load Balancers, and Gateway Load Balancer, specify the `TargetGroupARNs` property instead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-loadbalancernames
     */
    readonly loadBalancerNames?: string[];
    /**
     * The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see [Replacing Auto Scaling instances based on maximum instance lifetime](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-maxinstancelifetime
     */
    readonly maxInstanceLifetime?: number;
    /**
     * Enables the monitoring of group metrics of an Auto Scaling group. By default, these metrics are disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-metricscollection
     */
    readonly metricsCollection?: Array<CfnAutoScalingGroup.MetricsCollectionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * An embedded object that specifies a mixed instances policy.
     *
     * The policy includes properties that not only define the distribution of On-Demand Instances and Spot Instances, the maximum price to pay for Spot Instances (optional), and how the Auto Scaling group allocates instance types to fulfill On-Demand and Spot capacities, but also the properties that specify the instance configuration information—the launch template and instance types. The policy can also include a weight for each instance type and different launch templates for individual instance types.
     *
     * For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-mixedinstancespolicy
     */
    readonly mixedInstancesPolicy?: CfnAutoScalingGroup.MixedInstancesPolicyProperty | cdk.IResolvable;
    /**
     * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see [Using instance scale-in protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-newinstancesprotectedfromscalein
     */
    readonly newInstancesProtectedFromScaleIn?: boolean | cdk.IResolvable;
    /**
     * Configures an Auto Scaling group to send notifications when specified events take place.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations
     */
    readonly notificationConfigurations?: Array<CfnAutoScalingGroup.NotificationConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the placement group into which to launch your instances. For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * > A *cluster* placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-placementgroup
     */
    readonly placementGroup?: string;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf. By default, Amazon EC2 Auto Scaling uses a service-linked role named `AWSServiceRoleForAutoScaling` , which it creates if it does not exist. For more information, see [Service-linked roles](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-servicelinkedrolearn
     */
    readonly serviceLinkedRoleArn?: string;
    /**
     * One or more tags. You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-tags
     */
    readonly tags?: CfnAutoScalingGroup.TagPropertyProperty[];
    /**
     * The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group. Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see [Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-targetgrouparns
     */
    readonly targetGroupArns?: string[];
    /**
     * A policy or a list of policies that are used to select the instance to terminate. These policies are executed in the order that you list them. For more information, see [Work with Amazon EC2 Auto Scaling termination policies](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid values: `Default` | `AllocationStrategy` | `ClosestToNextInstanceHour` | `NewestInstance` | `OldestInstance` | `OldestLaunchConfiguration` | `OldestLaunchTemplate` | `arn:aws:lambda:region:account-id:function:my-function:my-alias`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-termpolicy
     */
    readonly terminationPolicies?: string[];
    /**
     * A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created.
     *
     * If this resource specifies public subnets and is also in a VPC that is defined in the same stack template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the [VPC-gateway attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html) .
     *
     * > When you update `VPCZoneIdentifier` , this retains the same Auto Scaling group and replaces old instances with new ones, according to the specified subnets. You can optionally specify how CloudFormation handles these updates by using an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) .
     *
     * Required to launch instances into a nondefault VPC. If you specify `VPCZoneIdentifier` with `AvailabilityZones` , the subnets that you specify for this property must reside in those Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-vpczoneidentifier
     */
    readonly vpcZoneIdentifier?: string[];
}
/**
 * A CloudFormation `AWS::AutoScaling::AutoScalingGroup`
 *
 * The `AWS::AutoScaling::AutoScalingGroup` resource defines an Amazon EC2 Auto Scaling group, which is a collection of Amazon EC2 instances that are treated as a logical grouping for the purposes of automatic scaling and management.
 *
 * For more information about Amazon EC2 Auto Scaling, see the [Amazon EC2 Auto Scaling User Guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) .
 *
 * > Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a [launch template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For more information, see [Launch configurations](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::AutoScalingGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html
 */
export declare class CfnAutoScalingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::AutoScalingGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAutoScalingGroup;
    /**
     * The maximum size of the group.
     *
     * > With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above `MaxSize` to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above `MaxSize` by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-maxsize
     */
    maxSize: string;
    /**
     * The minimum size of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-minsize
     */
    minSize: string;
    /**
     * The name of the Auto Scaling group. This name must be unique per Region per account.
     *
     * The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters.
     *
     * > You cannot use a colon (:) in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-autoscalinggroupname
     */
    autoScalingGroupName: string | undefined;
    /**
     * A list of Availability Zones where instances in the Auto Scaling group can be created. Used for launching into the default VPC subnet in each Availability Zone when not using the `VPCZoneIdentifier` property, or for attaching a network interface when an existing network interface ID is specified in a launch template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-availabilityzones
     */
    availabilityZones: string[] | undefined;
    /**
     * Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-capacityrebalance
     */
    capacityRebalance: boolean | cdk.IResolvable | undefined;
    /**
     * Reserved.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-context
     */
    context: string | undefined;
    /**
     * *Only needed if you use simple scaling policies.*
     *
     * The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: `300` seconds
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-cooldown
     */
    cooldown: string | undefined;
    /**
     * The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the `InService` state.
     *
     * During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see [Set the default instance warmup for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * > To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, *even if it is set to 0 seconds* . To remove a value that you previously set, include the property but specify `-1` for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of `0` or other nominal value.
     *
     * Default: None
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-defaultinstancewarmup
     */
    defaultInstanceWarmup: number | undefined;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain. It can scale beyond this capacity if you configure automatic scaling.
     *
     * The number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity when creating the stack, the default is the minimum size of the group.
     *
     * CloudFormation marks the Auto Scaling group as successful (by setting its status to CREATE_COMPLETE) when the desired capacity is reached. However, if a maximum Spot price is set in the launch template or launch configuration that you specified, then desired capacity is not used as a criteria for success. Whether your request is fulfilled depends on Spot Instance capacity and your maximum price.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity
     */
    desiredCapacity: string | undefined;
    /**
     * The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports `DesiredCapacityType` for attribute-based instance type selection only. For more information, see [Creating an Auto Scaling group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-instance-type-requirements.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * By default, Amazon EC2 Auto Scaling specifies `units` , which translates into number of instances.
     *
     * Valid values: `units` | `vcpu` | `memory-mib`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacitytype
     */
    desiredCapacityType: string | undefined;
    /**
     * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the `InService` state. For more information, see [Set the health check grace period for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: `0` seconds
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthcheckgraceperiod
     */
    healthCheckGracePeriod: number | undefined;
    /**
     * Determines whether any additional health checks are performed on the instances in this group. Amazon EC2 health checks are always on. For more information, see [Health checks for Auto Scaling instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/healthcheck.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * The valid values are `EC2` (default), `ELB` , and `VPC_LATTICE` . The `VPC_LATTICE` health check type is reserved for use with VPC Lattice, which is in preview release and is subject to change.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthchecktype
     */
    healthCheckType: string | undefined;
    /**
     * The ID of the instance used to base the launch configuration on. For more information, see [Create an Auto Scaling group using an EC2 instance](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-from-instance.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify `LaunchTemplate` , `MixedInstancesPolicy` , or `LaunchConfigurationName` , don't specify `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-instanceid
     */
    instanceId: string | undefined;
    /**
     * The name of the launch configuration to use to launch instances.
     *
     * Required only if you don't specify `LaunchTemplate` , `MixedInstancesPolicy` , or `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-launchconfigurationname
     */
    launchConfigurationName: string | undefined;
    /**
     * Information used to specify the launch template and version to use to launch instances. You can alternatively associate a launch template to the Auto Scaling group by specifying a `MixedInstancesPolicy` . For more information about creating launch templates, see [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you omit this property, you must specify `MixedInstancesPolicy` , `LaunchConfigurationName` , or `InstanceId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-launchtemplate
     */
    launchTemplate: CfnAutoScalingGroup.LaunchTemplateSpecificationProperty | cdk.IResolvable | undefined;
    /**
     * One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecificationlist
     */
    lifecycleHookSpecificationList: Array<CfnAutoScalingGroup.LifecycleHookSpecificationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A list of Classic Load Balancers associated with this Auto Scaling group. For Application Load Balancers, Network Load Balancers, and Gateway Load Balancer, specify the `TargetGroupARNs` property instead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-loadbalancernames
     */
    loadBalancerNames: string[] | undefined;
    /**
     * The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see [Replacing Auto Scaling instances based on maximum instance lifetime](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-maxinstancelifetime
     */
    maxInstanceLifetime: number | undefined;
    /**
     * Enables the monitoring of group metrics of an Auto Scaling group. By default, these metrics are disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-metricscollection
     */
    metricsCollection: Array<CfnAutoScalingGroup.MetricsCollectionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * An embedded object that specifies a mixed instances policy.
     *
     * The policy includes properties that not only define the distribution of On-Demand Instances and Spot Instances, the maximum price to pay for Spot Instances (optional), and how the Auto Scaling group allocates instance types to fulfill On-Demand and Spot capacities, but also the properties that specify the instance configuration information—the launch template and instance types. The policy can also include a weight for each instance type and different launch templates for individual instance types.
     *
     * For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-mixedinstancespolicy
     */
    mixedInstancesPolicy: CfnAutoScalingGroup.MixedInstancesPolicyProperty | cdk.IResolvable | undefined;
    /**
     * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see [Using instance scale-in protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-newinstancesprotectedfromscalein
     */
    newInstancesProtectedFromScaleIn: boolean | cdk.IResolvable | undefined;
    /**
     * Configures an Auto Scaling group to send notifications when specified events take place.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations
     */
    notificationConfigurations: Array<CfnAutoScalingGroup.NotificationConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The name of the placement group into which to launch your instances. For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * > A *cluster* placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-placementgroup
     */
    placementGroup: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf. By default, Amazon EC2 Auto Scaling uses a service-linked role named `AWSServiceRoleForAutoScaling` , which it creates if it does not exist. For more information, see [Service-linked roles](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-servicelinkedrolearn
     */
    serviceLinkedRoleArn: string | undefined;
    /**
     * One or more tags. You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group. Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see [Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-targetgrouparns
     */
    targetGroupArns: string[] | undefined;
    /**
     * A policy or a list of policies that are used to select the instance to terminate. These policies are executed in the order that you list them. For more information, see [Work with Amazon EC2 Auto Scaling termination policies](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid values: `Default` | `AllocationStrategy` | `ClosestToNextInstanceHour` | `NewestInstance` | `OldestInstance` | `OldestLaunchConfiguration` | `OldestLaunchTemplate` | `arn:aws:lambda:region:account-id:function:my-function:my-alias`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-termpolicy
     */
    terminationPolicies: string[] | undefined;
    /**
     * A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created.
     *
     * If this resource specifies public subnets and is also in a VPC that is defined in the same stack template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the [VPC-gateway attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html) .
     *
     * > When you update `VPCZoneIdentifier` , this retains the same Auto Scaling group and replaces old instances with new ones, according to the specified subnets. You can optionally specify how CloudFormation handles these updates by using an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) .
     *
     * Required to launch instances into a nondefault VPC. If you specify `VPCZoneIdentifier` with `AvailabilityZones` , the subnets that you specify for this property must reside in those Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-vpczoneidentifier
     */
    vpcZoneIdentifier: string[] | undefined;
    /**
     * Create a new `AWS::AutoScaling::AutoScalingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAutoScalingGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `AcceleratorCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of accelerators for an instance type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html
     */
    interface AcceleratorCountRequestProperty {
        /**
         * The maximum value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html#cfn-autoscaling-autoscalinggroup-acceleratorcountrequest-max
         */
        readonly max?: number;
        /**
         * The minimum value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html#cfn-autoscaling-autoscalinggroup-acceleratorcountrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `AcceleratorTotalMemoryMiBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum total memory size for the accelerators for an instance type, in MiB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html
     */
    interface AcceleratorTotalMemoryMiBRequestProperty {
        /**
         * The memory maximum in MiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html#cfn-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest-max
         */
        readonly max?: number;
        /**
         * The memory minimum in MiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html#cfn-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `BaselineEbsBandwidthMbpsRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum baseline bandwidth performance for an instance type, in Mbps.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html
     */
    interface BaselineEbsBandwidthMbpsRequestProperty {
        /**
         * The maximum value in Mbps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html#cfn-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest-max
         */
        readonly max?: number;
        /**
         * The minimum value in Mbps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html#cfn-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * The attributes for the instance types for a mixed instances policy. Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types.
     *
     * When you specify multiple attributes, you get instance types that satisfy all of the specified attributes. If you specify multiple values for an attribute, you get instance types that satisfy any of the specified values.
     *
     * To limit the list of instance types from which Amazon EC2 Auto Scaling can identify matching instance types, you can use one of the following parameters, but not both in the same request:
     *
     * - `AllowedInstanceTypes` - The instance types to include in the list. All other instance types are ignored, even if they match your specified attributes.
     * - `ExcludedInstanceTypes` - The instance types to exclude from the list, even if they match your specified attributes.
     *
     * > You must specify `VCpuCount` and `MemoryMiB` . All other attributes are optional. Any unspecified optional attribute is set to its default.
     *
     * For an example template, see [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
     *
     * For more information, see [Creating an Auto Scaling group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-instance-type-requirements.html) in the *Amazon EC2 Auto Scaling User Guide* . For help determining which instance types match your attributes before you apply them to your Auto Scaling group, see [Preview instance types with specified attributes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html#ec2fleet-get-instance-types-from-instance-requirements) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * `InstanceRequirements` is a property of the `LaunchTemplateOverrides` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html
     */
    interface InstanceRequirementsProperty {
        /**
         * The minimum and maximum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) for an instance type.
         *
         * To exclude accelerator-enabled instance types, set `Max` to `0` .
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratorcount
         */
        readonly acceleratorCount?: CfnAutoScalingGroup.AcceleratorCountRequestProperty | cdk.IResolvable;
        /**
         * Indicates whether instance types must have accelerators by specific manufacturers.
         *
         * - For instance types with NVIDIA devices, specify `nvidia` .
         * - For instance types with AMD devices, specify `amd` .
         * - For instance types with AWS devices, specify `amazon-web-services` .
         * - For instance types with Xilinx devices, specify `xilinx` .
         *
         * Default: Any manufacturer
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratormanufacturers
         */
        readonly acceleratorManufacturers?: string[];
        /**
         * Lists the accelerators that must be on an instance type.
         *
         * - For instance types with NVIDIA A100 GPUs, specify `a100` .
         * - For instance types with NVIDIA V100 GPUs, specify `v100` .
         * - For instance types with NVIDIA K80 GPUs, specify `k80` .
         * - For instance types with NVIDIA T4 GPUs, specify `t4` .
         * - For instance types with NVIDIA M60 GPUs, specify `m60` .
         * - For instance types with AMD Radeon Pro V520 GPUs, specify `radeon-pro-v520` .
         * - For instance types with Xilinx VU9P FPGAs, specify `vu9p` .
         *
         * Default: Any accelerator
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratornames
         */
        readonly acceleratorNames?: string[];
        /**
         * The minimum and maximum total memory size for the accelerators on an instance type, in MiB.
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratortotalmemorymib
         */
        readonly acceleratorTotalMemoryMiB?: CfnAutoScalingGroup.AcceleratorTotalMemoryMiBRequestProperty | cdk.IResolvable;
        /**
         * Lists the accelerator types that must be on an instance type.
         *
         * - For instance types with GPU accelerators, specify `gpu` .
         * - For instance types with FPGA accelerators, specify `fpga` .
         * - For instance types with inference accelerators, specify `inference` .
         *
         * Default: Any accelerator type
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratortypes
         */
        readonly acceleratorTypes?: string[];
        /**
         * The instance types to apply your specified attributes against. All other instance types are ignored, even if they match your specified attributes.
         *
         * You can use strings with one or more wild cards, represented by an asterisk ( `*` ), to allow an instance type, size, or generation. The following are examples: `m5.8xlarge` , `c5*.*` , `m5a.*` , `r*` , `*3*` .
         *
         * For example, if you specify `c5*` , Amazon EC2 Auto Scaling will allow the entire C5 instance family, which includes all C5a and C5n instance types. If you specify `m5a.*` , Amazon EC2 Auto Scaling will allow all the M5a instance types, but not the M5n instance types.
         *
         * > If you specify `AllowedInstanceTypes` , you can't specify `ExcludedInstanceTypes` .
         *
         * Default: All instance types
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-allowedinstancetypes
         */
        readonly allowedInstanceTypes?: string[];
        /**
         * Indicates whether bare metal instance types are included, excluded, or required.
         *
         * Default: `excluded`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-baremetal
         */
        readonly bareMetal?: string;
        /**
         * The minimum and maximum baseline bandwidth performance for an instance type, in Mbps. For more information, see [Amazon EBS–optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-baselineebsbandwidthmbps
         */
        readonly baselineEbsBandwidthMbps?: CfnAutoScalingGroup.BaselineEbsBandwidthMbpsRequestProperty | cdk.IResolvable;
        /**
         * Indicates whether burstable performance instance types are included, excluded, or required. For more information, see [Burstable performance instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * Default: `excluded`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-burstableperformance
         */
        readonly burstablePerformance?: string;
        /**
         * Lists which specific CPU manufacturers to include.
         *
         * - For instance types with Intel CPUs, specify `intel` .
         * - For instance types with AMD CPUs, specify `amd` .
         * - For instance types with AWS CPUs, specify `amazon-web-services` .
         *
         * > Don't confuse the CPU hardware manufacturer with the CPU hardware architecture. Instances will be launched with a compatible CPU architecture based on the Amazon Machine Image (AMI) that you specify in your launch template.
         *
         * Default: Any manufacturer
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-cpumanufacturers
         */
        readonly cpuManufacturers?: string[];
        /**
         * The instance types to exclude. You can use strings with one or more wild cards, represented by an asterisk ( `*` ), to exclude an instance family, type, size, or generation. The following are examples: `m5.8xlarge` , `c5*.*` , `m5a.*` , `r*` , `*3*` .
         *
         * For example, if you specify `c5*` , you are excluding the entire C5 instance family, which includes all C5a and C5n instance types. If you specify `m5a.*` , Amazon EC2 Auto Scaling will exclude all the M5a instance types, but not the M5n instance types.
         *
         * > If you specify `ExcludedInstanceTypes` , you can't specify `AllowedInstanceTypes` .
         *
         * Default: No excluded instance types
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-excludedinstancetypes
         */
        readonly excludedInstanceTypes?: string[];
        /**
         * Indicates whether current or previous generation instance types are included.
         *
         * - For current generation instance types, specify `current` . The current generation includes EC2 instance types currently recommended for use. This typically includes the latest two to three generations in each instance family. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon EC2 User Guide for Linux Instances* .
         * - For previous generation instance types, specify `previous` .
         *
         * Default: Any current or previous generation
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-instancegenerations
         */
        readonly instanceGenerations?: string[];
        /**
         * Indicates whether instance types with instance store volumes are included, excluded, or required. For more information, see [Amazon EC2 instance store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * Default: `included`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-localstorage
         */
        readonly localStorage?: string;
        /**
         * Indicates the type of local storage that is required.
         *
         * - For instance types with hard disk drive (HDD) storage, specify `hdd` .
         * - For instance types with solid state drive (SSD) storage, specify `ssd` .
         *
         * Default: Any local storage type
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-localstoragetypes
         */
        readonly localStorageTypes?: string[];
        /**
         * The minimum and maximum amount of memory per vCPU for an instance type, in GiB.
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-memorygibpervcpu
         */
        readonly memoryGiBPerVCpu?: CfnAutoScalingGroup.MemoryGiBPerVCpuRequestProperty | cdk.IResolvable;
        /**
         * The minimum and maximum instance memory size for an instance type, in MiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-memorymib
         */
        readonly memoryMiB?: CfnAutoScalingGroup.MemoryMiBRequestProperty | cdk.IResolvable;
        /**
         * The minimum and maximum amount of network bandwidth, in gigabits per second (Gbps).
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-networkbandwidthgbps
         */
        readonly networkBandwidthGbps?: CfnAutoScalingGroup.NetworkBandwidthGbpsRequestProperty | cdk.IResolvable;
        /**
         * The minimum and maximum number of network interfaces for an instance type.
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-networkinterfacecount
         */
        readonly networkInterfaceCount?: CfnAutoScalingGroup.NetworkInterfaceCountRequestProperty | cdk.IResolvable;
        /**
         * The price protection threshold for On-Demand Instances. This is the maximum you’ll pay for an On-Demand Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as `999999` .
         *
         * If you set `DesiredCapacityType` to `vcpu` or `memory-mib` , the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.
         *
         * Default: `20`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-ondemandmaxpricepercentageoverlowestprice
         */
        readonly onDemandMaxPricePercentageOverLowestPrice?: number;
        /**
         * Indicates whether instance types must provide On-Demand Instance hibernation support.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-requirehibernatesupport
         */
        readonly requireHibernateSupport?: boolean | cdk.IResolvable;
        /**
         * The price protection threshold for Spot Instances. This is the maximum you’ll pay for a Spot Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as `999999` .
         *
         * If you set `DesiredCapacityType` to `vcpu` or `memory-mib` , the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.
         *
         * Default: `100`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-spotmaxpricepercentageoverlowestprice
         */
        readonly spotMaxPricePercentageOverLowestPrice?: number;
        /**
         * The minimum and maximum total local storage size for an instance type, in GB.
         *
         * Default: No minimum or maximum limits
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-totallocalstoragegb
         */
        readonly totalLocalStorageGb?: CfnAutoScalingGroup.TotalLocalStorageGBRequestProperty | cdk.IResolvable;
        /**
         * The minimum and maximum number of vCPUs for an instance type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-vcpucount
         */
        readonly vCpuCount?: CfnAutoScalingGroup.VCpuCountRequestProperty | cdk.IResolvable;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * Use this structure to specify the distribution of On-Demand Instances and Spot Instances and the allocation strategies used to fulfill On-Demand and Spot capacities for a mixed instances policy.
     *
     * For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * `InstancesDistribution` is a property of the [AWS::AutoScaling::AutoScalingGroup MixedInstancesPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html
     */
    interface InstancesDistributionProperty {
        /**
         * The allocation strategy to apply to your On-Demand Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify.
         *
         * The following lists the valid values:
         *
         * - **lowest-price** - Uses price to determine which instance types are the highest priority, launching the lowest priced instance types within an Availability Zone first. This is the default value for Auto Scaling groups that specify `InstanceRequirements` .
         * - **prioritized** - You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling launches your highest priority instance types first. If all your On-Demand capacity cannot be fulfilled using your highest priority instance type, then Amazon EC2 Auto Scaling launches the remaining capacity using the second priority instance type, and so on. This is the default value for Auto Scaling groups that don't specify `InstanceRequirements` and cannot be used for groups that do.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandallocationstrategy
         */
        readonly onDemandAllocationStrategy?: string;
        /**
         * The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances. This base portion is launched first as your group scales.
         *
         * This number has the same unit of measurement as the group's desired capacity. If you change the default unit of measurement (number of instances) by specifying weighted capacity values in your launch template overrides list, or by changing the default desired capacity type setting of the group, you must specify this number using the same unit of measurement.
         *
         * Default: 0
         *
         * > An update to this setting means a gradual replacement of instances to adjust the current On-Demand Instance levels. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandbasecapacity
         */
        readonly onDemandBaseCapacity?: number;
        /**
         * Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond `OnDemandBaseCapacity` . Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances). If set to 100, only On-Demand Instances are used.
         *
         * Default: 100
         *
         * > An update to this setting means a gradual replacement of instances to adjust the current On-Demand and Spot Instance levels for your additional capacity higher than the base capacity. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandpercentageabovebasecapacity
         */
        readonly onDemandPercentageAboveBaseCapacity?: number;
        /**
         * The allocation strategy to apply to your Spot Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify.
         *
         * The following lists the valid values:
         *
         * - **capacity-optimized** - Requests Spot Instances using pools that are optimally chosen based on the available Spot capacity. This strategy has the lowest risk of interruption. To give certain instance types a higher chance of launching first, use `capacity-optimized-prioritized` .
         * - **capacity-optimized-prioritized** - You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling honors the instance type priorities on a best effort basis but optimizes for capacity first. Note that if the On-Demand allocation strategy is set to `prioritized` , the same priority is applied when fulfilling On-Demand capacity. This is not a valid value for Auto Scaling groups that specify `InstanceRequirements` .
         * - **lowest-price** - Requests Spot Instances using the lowest priced pools within an Availability Zone, across the number of Spot pools that you specify for the `SpotInstancePools` property. To ensure that your desired capacity is met, you might receive Spot Instances from several pools. This is the default value, but it might lead to high interruption rates because this strategy only considers instance price and not available capacity.
         * - **price-capacity-optimized (recommended)** - The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotallocationstrategy
         */
        readonly spotAllocationStrategy?: string;
        /**
         * The number of Spot Instance pools across which to allocate your Spot Instances. The Spot pools are determined from the different instance types in the overrides. Valid only when the `SpotAllocationStrategy` is `lowest-price` . Value must be in the range of 1–20.
         *
         * Default: 2
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotinstancepools
         */
        readonly spotInstancePools?: number;
        /**
         * The maximum price per unit hour that you are willing to pay for a Spot Instance. If your maximum price is lower than the Spot price for the instance types that you selected, your Spot Instances are not launched. We do not recommend specifying a maximum price because it can lead to increased interruptions. When Spot Instances launch, you pay the current Spot price. To remove a maximum price that you previously set, include the property but specify an empty string ("") for the value.
         *
         * > If you specify a maximum price, your instances will be interrupted more frequently than if you do not specify one.
         *
         * Valid Range: Minimum value of 0.001
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotmaxprice
         */
        readonly spotMaxPrice?: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * Use this structure to specify the launch templates and instance types (overrides) for a mixed instances policy.
     *
     * `LaunchTemplate` is a property of the [AWS::AutoScaling::AutoScalingGroup MixedInstancesPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplate.html
     */
    interface LaunchTemplateProperty {
        /**
         * The launch template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplate.html#cfn-as-group-launchtemplate
         */
        readonly launchTemplateSpecification: CfnAutoScalingGroup.LaunchTemplateSpecificationProperty | cdk.IResolvable;
        /**
         * Any properties that you specify override the same properties in the launch template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplate.html#cfn-as-mixedinstancespolicy-overrides
         */
        readonly overrides?: Array<CfnAutoScalingGroup.LaunchTemplateOverridesProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * Use this structure to let Amazon EC2 Auto Scaling do the following when the Auto Scaling group has a mixed instances policy:
     *
     * - Override the instance type that is specified in the launch template.
     * - Use multiple instance types.
     *
     * Specify the instance types that you want, or define your instance requirements instead and let Amazon EC2 Auto Scaling provision the available instance types that meet your requirements. This can provide Amazon EC2 Auto Scaling with a larger selection of instance types to choose from when fulfilling Spot and On-Demand capacities. You can view which instance types are matched before you apply the instance requirements to your Auto Scaling group.
     *
     * After you define your instance requirements, you don't have to keep updating these settings to get new EC2 instance types automatically. Amazon EC2 Auto Scaling uses the instance requirements of the Auto Scaling group to determine whether a new EC2 instance type can be used.
     *
     * `LaunchTemplateOverrides` is a property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplateoverrides.html
     */
    interface LaunchTemplateOverridesProperty {
        /**
         * The instance requirements. Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types.
         *
         * You can specify up to four separate sets of instance requirements per Auto Scaling group. This is useful for provisioning instances from different Amazon Machine Images (AMIs) in the same Auto Scaling group. To do this, create the AMIs and create a new launch template for each AMI. Then, create a compatible set of instance requirements for each launch template.
         *
         * > If you specify `InstanceRequirements` , you can't specify `InstanceType` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplateoverrides.html#cfn-as-mixedinstancespolicy-instancerequirements
         */
        readonly instanceRequirements?: CfnAutoScalingGroup.InstanceRequirementsProperty | cdk.IResolvable;
        /**
         * The instance type, such as `m3.xlarge` . You must specify an instance type that is supported in your requested Region and Availability Zones. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon Elastic Compute Cloud User Guide* .
         *
         * You can specify up to 40 instance types per Auto Scaling group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-instancetype
         */
        readonly instanceType?: string;
        /**
         * Provides a launch template for the specified instance type or set of instance requirements. For example, some instance types might require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template that's specified in the `LaunchTemplate` definition. For more information, see [Specifying a different launch template for an instance type](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-launch-template-overrides.html) in the *Amazon EC2 Auto Scaling User Guide* .
         *
         * You can specify up to 20 launch templates per Auto Scaling group. The launch templates specified in the overrides and in the `LaunchTemplate` definition count towards this limit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-launchtemplatespecification
         */
        readonly launchTemplateSpecification?: CfnAutoScalingGroup.LaunchTemplateSpecificationProperty | cdk.IResolvable;
        /**
         * If you provide a list of instance types to use, you can specify the number of capacity units provided by each instance type in terms of virtual CPUs, memory, storage, throughput, or other relative performance characteristic. When a Spot or On-Demand Instance is launched, the capacity units count toward the desired capacity. Amazon EC2 Auto Scaling launches instances until the desired capacity is totally fulfilled, even if this results in an overage. For example, if there are two units remaining to fulfill capacity, and Amazon EC2 Auto Scaling can only launch an instance with a `WeightedCapacity` of five units, the instance is launched, and the desired capacity is exceeded by three units. For more information, see [Configure instance weighting for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-instance-weighting.html) in the *Amazon EC2 Auto Scaling User Guide* . Value must be in the range of 1-999.
         *
         * If you specify a value for `WeightedCapacity` for one instance type, you must specify a value for `WeightedCapacity` for all of them.
         *
         * > Every Auto Scaling group has three size parameters ( `DesiredCapacity` , `MaxSize` , and `MinSize` ). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-mixedinstancespolicy-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-weightedcapacity
         */
        readonly weightedCapacity?: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * Specifies a launch template to use when provisioning EC2 instances for an Auto Scaling group.
     *
     * You must specify the following:
     *
     * - The ID or the name of the launch template, but not both.
     * - The version of the launch template.
     *
     * `LaunchTemplateSpecification` is property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource. It is also a property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html) and [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property types.
     *
     * For information about creating a launch template, see [AWS::EC2::LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) and [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * For examples of launch templates, see [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) and the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html#aws-resource-ec2-launchtemplate--examples) section in the `AWS::EC2::LaunchTemplate` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html
     */
    interface LaunchTemplateSpecificationProperty {
        /**
         * The ID of the launch template.
         *
         * You must specify the `LaunchTemplateID` or the `LaunchTemplateName` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-launchtemplateid
         */
        readonly launchTemplateId?: string;
        /**
         * The name of the launch template.
         *
         * You must specify the `LaunchTemplateName` or the `LaunchTemplateID` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-launchtemplatename
         */
        readonly launchTemplateName?: string;
        /**
         * The version number of the launch template.
         *
         * Specifying `$Latest` or `$Default` for the template version number is not supported. However, you can specify `LatestVersionNumber` or `DefaultVersionNumber` using the `Fn::GetAtt` intrinsic function. For more information, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
         *
         * > For an example of using the `Fn::GetAtt` function, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#aws-properties-as-group--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-version
         */
        readonly version: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `LifecycleHookSpecification` specifies a lifecycle hook for the `LifecycleHookSpecificationList` property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource. A lifecycle hook specifies actions to perform when Amazon EC2 Auto Scaling launches or terminates instances.
     *
     * For more information, see [Amazon EC2 Auto Scaling lifecycle hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#aws-resource-as-lifecyclehook--examples) section of the `AWS::AutoScaling::LifecycleHook` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html
     */
    interface LifecycleHookSpecificationProperty {
        /**
         * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is `ABANDON` .
         *
         * Valid values: `CONTINUE` | `ABANDON`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-defaultresult
         */
        readonly defaultResult?: string;
        /**
         * The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from `30` to `7200` seconds. The default value is `3600` seconds (1 hour).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-heartbeattimeout
         */
        readonly heartbeatTimeout?: number;
        /**
         * The name of the lifecycle hook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecyclehookname
         */
        readonly lifecycleHookName: string;
        /**
         * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
         *
         * - To create a lifecycle hook for scale-out events, specify `autoscaling:EC2_INSTANCE_LAUNCHING` .
         * - To create a lifecycle hook for scale-in events, specify `autoscaling:EC2_INSTANCE_TERMINATING` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecycletransition
         */
        readonly lifecycleTransition: string;
        /**
         * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationmetadata
         */
        readonly notificationMetadata?: string;
        /**
         * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook. You can specify an Amazon SNS topic or an Amazon SQS queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationtargetarn
         */
        readonly notificationTargetArn?: string;
        /**
         * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. For information about creating this role, see [Configure a notification target for a lifecycle hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html#lifecycle-hook-notification-target) in the *Amazon EC2 Auto Scaling User Guide* .
         *
         * Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-rolearn
         */
        readonly roleArn?: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `MemoryGiBPerVCpuRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum amount of memory per vCPU for an instance type, in GiB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html
     */
    interface MemoryGiBPerVCpuRequestProperty {
        /**
         * The memory maximum in GiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html#cfn-autoscaling-autoscalinggroup-memorygibpervcpurequest-max
         */
        readonly max?: number;
        /**
         * The memory minimum in GiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html#cfn-autoscaling-autoscalinggroup-memorygibpervcpurequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `MemoryMiBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum instance memory size for an instance type, in MiB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html
     */
    interface MemoryMiBRequestProperty {
        /**
         * The memory maximum in MiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html#cfn-autoscaling-autoscalinggroup-memorymibrequest-max
         */
        readonly max?: number;
        /**
         * The memory minimum in MiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html#cfn-autoscaling-autoscalinggroup-memorymibrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `MetricsCollection` is a property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource that describes the group metrics that an Amazon EC2 Auto Scaling group sends to Amazon CloudWatch. These metrics describe the group rather than any of its instances.
     *
     * For more information, see [Monitor CloudWatch metrics for your Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-monitoring.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#aws-properties-as-group--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html
     */
    interface MetricsCollectionProperty {
        /**
         * The frequency at which Amazon EC2 Auto Scaling sends aggregated data to CloudWatch. The only valid value is `1Minute` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html#cfn-as-metricscollection-granularity
         */
        readonly granularity: string;
        /**
         * Identifies the metrics to enable.
         *
         * You can specify one or more of the following metrics:
         *
         * - `GroupMinSize`
         * - `GroupMaxSize`
         * - `GroupDesiredCapacity`
         * - `GroupInServiceInstances`
         * - `GroupPendingInstances`
         * - `GroupStandbyInstances`
         * - `GroupTerminatingInstances`
         * - `GroupTotalInstances`
         * - `GroupInServiceCapacity`
         * - `GroupPendingCapacity`
         * - `GroupStandbyCapacity`
         * - `GroupTerminatingCapacity`
         * - `GroupTotalCapacity`
         * - `WarmPoolDesiredCapacity`
         * - `WarmPoolWarmedCapacity`
         * - `WarmPoolPendingCapacity`
         * - `WarmPoolTerminatingCapacity`
         * - `WarmPoolTotalCapacity`
         * - `GroupAndWarmPoolDesiredCapacity`
         * - `GroupAndWarmPoolTotalCapacity`
         *
         * If you specify `Granularity` and don't specify any metrics, all metrics are enabled.
         *
         * For more information, see [Auto Scaling group metrics](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-cloudwatch-monitoring.html#as-group-metrics) in the *Amazon EC2 Auto Scaling User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html#cfn-as-metricscollection-metrics
         */
        readonly metrics?: string[];
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * Use this structure to launch multiple instance types and On-Demand Instances and Spot Instances within a single Auto Scaling group.
     *
     * A mixed instances policy contains information that Amazon EC2 Auto Scaling can use to launch instances and help optimize your costs. For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * You can create a mixed instances policy for new and existing Auto Scaling groups. You must use a launch template to configure the policy. You cannot use a launch configuration.
     *
     * There are key differences between Spot Instances and On-Demand Instances:
     *
     * - The price for Spot Instances varies based on demand
     * - Amazon EC2 can terminate an individual Spot Instance as the availability of, or price for, Spot Instances changes
     *
     * When a Spot Instance is terminated, Amazon EC2 Auto Scaling group attempts to launch a replacement instance to maintain the desired capacity for the group.
     *
     * `MixedInstancesPolicy` is a property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-group-mixedinstancespolicy.html
     */
    interface MixedInstancesPolicyProperty {
        /**
         * The instances distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-group-mixedinstancespolicy.html#cfn-as-mixedinstancespolicy-instancesdistribution
         */
        readonly instancesDistribution?: CfnAutoScalingGroup.InstancesDistributionProperty | cdk.IResolvable;
        /**
         * One or more launch templates and the instance types (overrides) that are used to launch EC2 instances to fulfill On-Demand and Spot capacities.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-as-group-mixedinstancespolicy.html#cfn-as-mixedinstancespolicy-launchtemplate
         */
        readonly launchTemplate: CfnAutoScalingGroup.LaunchTemplateProperty | cdk.IResolvable;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `NetworkBandwidthGbpsRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum network bandwidth for an instance type, in Gbps.
     *
     * > Setting the minimum bandwidth does not guarantee that your instance will achieve the minimum bandwidth. Amazon EC2 will identify instance types that support the specified minimum bandwidth, but the actual bandwidth of your instance might go below the specified minimum at times. For more information, see [Available instance bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html#available-instance-bandwidth) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html
     */
    interface NetworkBandwidthGbpsRequestProperty {
        /**
         * The maximum amount of network bandwidth, in gigabits per second (Gbps).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html#cfn-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest-max
         */
        readonly max?: number;
        /**
         * The minimum amount of network bandwidth, in gigabits per second (Gbps).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html#cfn-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `NetworkInterfaceCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of network interfaces for an instance type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html
     */
    interface NetworkInterfaceCountRequestProperty {
        /**
         * The maximum number of network interfaces.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html#cfn-autoscaling-autoscalinggroup-networkinterfacecountrequest-max
         */
        readonly max?: number;
        /**
         * The minimum number of network interfaces.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html#cfn-autoscaling-autoscalinggroup-networkinterfacecountrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * A structure that specifies an Amazon SNS notification configuration for the `NotificationConfigurations` property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource.
     *
     * For an example template snippet, see [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
     *
     * For more information, see [Get Amazon SNS notifications when your Auto Scaling group scales](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ASGettingNotifications.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-notificationconfigurations.html
     */
    interface NotificationConfigurationProperty {
        /**
         * A list of event types that send a notification. Event types can include any of the following types.
         *
         * *Allowed values* :
         *
         * - `autoscaling:EC2_INSTANCE_LAUNCH`
         * - `autoscaling:EC2_INSTANCE_LAUNCH_ERROR`
         * - `autoscaling:EC2_INSTANCE_TERMINATE`
         * - `autoscaling:EC2_INSTANCE_TERMINATE_ERROR`
         * - `autoscaling:TEST_NOTIFICATION`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-notificationconfigurations.html#cfn-as-group-notificationconfigurations-notificationtypes
         */
        readonly notificationTypes?: string[];
        /**
         * The Amazon Resource Name (ARN) of the Amazon SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-notificationconfigurations.html#cfn-autoscaling-autoscalinggroup-notificationconfigurations-topicarn
         */
        readonly topicArn: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * A structure that specifies a tag for the `Tags` property of [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html) resource.
     *
     * For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#aws-properties-as-group--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
     *
     * CloudFormation adds the following tags to all Auto Scaling groups and associated instances:
     *
     * - aws:cloudformation:stack-name
     * - aws:cloudformation:stack-id
     * - aws:cloudformation:logical-id
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html
     */
    interface TagPropertyProperty {
        /**
         * The tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-Key
         */
        readonly key: string;
        /**
         * Set to `true` if you want CloudFormation to copy the tag to EC2 instances that are launched as part of the Auto Scaling group. Set to `false` if you want the tag attached only to the Auto Scaling group and not copied to any instances launched as part of the Auto Scaling group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-PropagateAtLaunch
         */
        readonly propagateAtLaunch: boolean | cdk.IResolvable;
        /**
         * The tag value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-Value
         */
        readonly value: string;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `TotalLocalStorageGBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum total local storage size for an instance type, in GB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html
     */
    interface TotalLocalStorageGBRequestProperty {
        /**
         * The storage maximum in GB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html#cfn-autoscaling-autoscalinggroup-totallocalstoragegbrequest-max
         */
        readonly max?: number;
        /**
         * The storage minimum in GB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html#cfn-autoscaling-autoscalinggroup-totallocalstoragegbrequest-min
         */
        readonly min?: number;
    }
}
export declare namespace CfnAutoScalingGroup {
    /**
     * `VCpuCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of vCPUs for an instance type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html
     */
    interface VCpuCountRequestProperty {
        /**
         * The maximum number of vCPUs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html#cfn-autoscaling-autoscalinggroup-vcpucountrequest-max
         */
        readonly max?: number;
        /**
         * The minimum number of vCPUs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html#cfn-autoscaling-autoscalinggroup-vcpucountrequest-min
         */
        readonly min?: number;
    }
}
/**
 * Properties for defining a `CfnLaunchConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html
 */
export interface CfnLaunchConfigurationProps {
    /**
     * The ID of the Amazon Machine Image (AMI) that was assigned during registration. For more information, see [Finding a Linux AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * If you specify `InstanceId` , an `ImageId` is not required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-imageid
     */
    readonly imageId: string;
    /**
     * Specifies the instance type of the EC2 instance. For information about available instance types, see [Available instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#AvailableInstanceTypes) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * If you specify `InstanceId` , an `InstanceType` is not required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancetype
     */
    readonly instanceType: string;
    /**
     * Specifies whether to assign a public IPv4 address to the group's instances. If the instance is launched into a default subnet, the default is to assign a public IPv4 address, unless you disabled the option to assign a public IPv4 address on the subnet. If the instance is launched into a nondefault subnet, the default is not to assign a public IPv4 address, unless you enabled the option to assign a public IPv4 address on the subnet.
     *
     * If you specify `true` , each instance in the Auto Scaling group receives a unique public IPv4 address. For more information, see [Launching Auto Scaling instances in a VPC](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-in-vpc.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify this property, you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-associatepublicipaddress
     */
    readonly associatePublicIpAddress?: boolean | cdk.IResolvable;
    /**
     * The block device mapping entries that define the block devices to attach to the instances at launch. By default, the block devices specified in the block device mapping for the AMI are used. For more information, see [Block device mappings](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-blockdevicemappings
     */
    readonly blockDeviceMappings?: Array<CfnLaunchConfiguration.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Available for backward compatibility.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcid
     */
    readonly classicLinkVpcId?: string;
    /**
     * Available for backward compatibility.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcsecuritygroups
     */
    readonly classicLinkVpcSecurityGroups?: string[];
    /**
     * Specifies whether the launch configuration is optimized for EBS I/O ( `true` ) or not ( `false` ). The optimization provides dedicated throughput to Amazon EBS and an optimized configuration stack to provide optimal I/O performance. This optimization is not available with all instance types. Additional fees are incurred when you enable EBS optimization for an instance type that is not EBS-optimized by default. For more information, see [Amazon EBS-optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * The default value is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ebsoptimized
     */
    readonly ebsOptimized?: boolean | cdk.IResolvable;
    /**
     * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance. The instance profile contains the IAM role. For more information, see [IAM role for applications that run on Amazon EC2 instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/us-iam-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-iaminstanceprofile
     */
    readonly iamInstanceProfile?: string;
    /**
     * The ID of the Amazon EC2 instance to use to create the launch configuration. When you use an instance to create a launch configuration, all properties are derived from the instance with the exception of `BlockDeviceMapping` and `AssociatePublicIpAddress` . You can override any properties from the instance by specifying them in the launch configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instanceid
     */
    readonly instanceId?: string;
    /**
     * Controls whether instances in this group are launched with detailed ( `true` ) or basic ( `false` ) monitoring.
     *
     * The default value is `true` (enabled).
     *
     * > When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes. For more information, see [Configure Monitoring for Auto Scaling Instances](https://docs.aws.amazon.com/autoscaling/latest/userguide/enable-as-instance-metrics.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancemonitoring
     */
    readonly instanceMonitoring?: boolean | cdk.IResolvable;
    /**
     * The ID of the kernel associated with the AMI.
     *
     * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-kernelid
     */
    readonly kernelId?: string;
    /**
     * The name of the key pair. For more information, see [Amazon EC2 key pairs and Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-keyname
     */
    readonly keyName?: string;
    /**
     * The name of the launch configuration. This name must be unique per Region per account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-launchconfigurationname
     */
    readonly launchConfigurationName?: string;
    /**
     * The metadata options for the instances. For more information, see [Configuring the Instance Metadata Options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-config.html#launch-configurations-imds) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-metadataoptions
     */
    readonly metadataOptions?: CfnLaunchConfiguration.MetadataOptionsProperty | cdk.IResolvable;
    /**
     * The tenancy of the instance, either `default` or `dedicated` . An instance with `dedicated` tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC. To launch dedicated instances into a shared tenancy VPC (a VPC with the instance placement tenancy attribute set to `default` ), you must set the value of this property to `dedicated` . For more information, see [Configuring instance tenancy with Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-dedicated-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify `PlacementTenancy` , you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
     *
     * Valid values: `default` | `dedicated`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-placementtenancy
     */
    readonly placementTenancy?: string;
    /**
     * The ID of the RAM disk to select.
     *
     * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ramdiskid
     */
    readonly ramDiskId?: string;
    /**
     * A list that contains the security groups to assign to the instances in the Auto Scaling group. The list can contain both the IDs of existing security groups and references to [SecurityGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) resources created in the template.
     *
     * For more information, see [Control traffic to resources using security groups](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-securitygroups
     */
    readonly securityGroups?: string[];
    /**
     * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request. Spot Instances are launched when the price you specify exceeds the current Spot price. For more information, see [Request Spot Instances for fault-tolerant and flexible applications](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-template-spot-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid Range: Minimum value of 0.001
     *
     * > When you change your maximum price by creating a new launch configuration, running instances will continue to run as long as the maximum price for those running instances is higher than the current Spot price.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-spotprice
     */
    readonly spotPrice?: string;
    /**
     * The Base64-encoded user data to make available to the launched EC2 instances. For more information, see [Instance metadata and user data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-userdata
     */
    readonly userData?: string;
}
/**
 * A CloudFormation `AWS::AutoScaling::LaunchConfiguration`
 *
 * The `AWS::AutoScaling::LaunchConfiguration` resource specifies the launch configuration that can be used by an Auto Scaling group to configure Amazon EC2 instances.
 *
 * When you update the launch configuration for an Auto Scaling group, CloudFormation deletes that resource and creates a new launch configuration with the updated properties and a new name. Existing instances are not affected. To update existing instances when you update the `AWS::AutoScaling::LaunchConfiguration` resource, you can specify an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) for the group. You can find sample update policies for rolling updates in [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
 *
 * > Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a [launch template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For more information, see [Launch configurations](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::LaunchConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html
 */
export declare class CfnLaunchConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::LaunchConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchConfiguration;
    /**
     * The ID of the Amazon Machine Image (AMI) that was assigned during registration. For more information, see [Finding a Linux AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * If you specify `InstanceId` , an `ImageId` is not required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-imageid
     */
    imageId: string;
    /**
     * Specifies the instance type of the EC2 instance. For information about available instance types, see [Available instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#AvailableInstanceTypes) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * If you specify `InstanceId` , an `InstanceType` is not required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancetype
     */
    instanceType: string;
    /**
     * Specifies whether to assign a public IPv4 address to the group's instances. If the instance is launched into a default subnet, the default is to assign a public IPv4 address, unless you disabled the option to assign a public IPv4 address on the subnet. If the instance is launched into a nondefault subnet, the default is not to assign a public IPv4 address, unless you enabled the option to assign a public IPv4 address on the subnet.
     *
     * If you specify `true` , each instance in the Auto Scaling group receives a unique public IPv4 address. For more information, see [Launching Auto Scaling instances in a VPC](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-in-vpc.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify this property, you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-associatepublicipaddress
     */
    associatePublicIpAddress: boolean | cdk.IResolvable | undefined;
    /**
     * The block device mapping entries that define the block devices to attach to the instances at launch. By default, the block devices specified in the block device mapping for the AMI are used. For more information, see [Block device mappings](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-blockdevicemappings
     */
    blockDeviceMappings: Array<CfnLaunchConfiguration.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Available for backward compatibility.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcid
     */
    classicLinkVpcId: string | undefined;
    /**
     * Available for backward compatibility.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcsecuritygroups
     */
    classicLinkVpcSecurityGroups: string[] | undefined;
    /**
     * Specifies whether the launch configuration is optimized for EBS I/O ( `true` ) or not ( `false` ). The optimization provides dedicated throughput to Amazon EBS and an optimized configuration stack to provide optimal I/O performance. This optimization is not available with all instance types. Additional fees are incurred when you enable EBS optimization for an instance type that is not EBS-optimized by default. For more information, see [Amazon EBS-optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * The default value is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ebsoptimized
     */
    ebsOptimized: boolean | cdk.IResolvable | undefined;
    /**
     * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance. The instance profile contains the IAM role. For more information, see [IAM role for applications that run on Amazon EC2 instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/us-iam-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-iaminstanceprofile
     */
    iamInstanceProfile: string | undefined;
    /**
     * The ID of the Amazon EC2 instance to use to create the launch configuration. When you use an instance to create a launch configuration, all properties are derived from the instance with the exception of `BlockDeviceMapping` and `AssociatePublicIpAddress` . You can override any properties from the instance by specifying them in the launch configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instanceid
     */
    instanceId: string | undefined;
    /**
     * Controls whether instances in this group are launched with detailed ( `true` ) or basic ( `false` ) monitoring.
     *
     * The default value is `true` (enabled).
     *
     * > When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes. For more information, see [Configure Monitoring for Auto Scaling Instances](https://docs.aws.amazon.com/autoscaling/latest/userguide/enable-as-instance-metrics.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancemonitoring
     */
    instanceMonitoring: boolean | cdk.IResolvable | undefined;
    /**
     * The ID of the kernel associated with the AMI.
     *
     * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-kernelid
     */
    kernelId: string | undefined;
    /**
     * The name of the key pair. For more information, see [Amazon EC2 key pairs and Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-keyname
     */
    keyName: string | undefined;
    /**
     * The name of the launch configuration. This name must be unique per Region per account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-launchconfigurationname
     */
    launchConfigurationName: string | undefined;
    /**
     * The metadata options for the instances. For more information, see [Configuring the Instance Metadata Options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-config.html#launch-configurations-imds) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-metadataoptions
     */
    metadataOptions: CfnLaunchConfiguration.MetadataOptionsProperty | cdk.IResolvable | undefined;
    /**
     * The tenancy of the instance, either `default` or `dedicated` . An instance with `dedicated` tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC. To launch dedicated instances into a shared tenancy VPC (a VPC with the instance placement tenancy attribute set to `default` ), you must set the value of this property to `dedicated` . For more information, see [Configuring instance tenancy with Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-dedicated-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * If you specify `PlacementTenancy` , you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
     *
     * Valid values: `default` | `dedicated`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-placementtenancy
     */
    placementTenancy: string | undefined;
    /**
     * The ID of the RAM disk to select.
     *
     * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ramdiskid
     */
    ramDiskId: string | undefined;
    /**
     * A list that contains the security groups to assign to the instances in the Auto Scaling group. The list can contain both the IDs of existing security groups and references to [SecurityGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) resources created in the template.
     *
     * For more information, see [Control traffic to resources using security groups](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-securitygroups
     */
    securityGroups: string[] | undefined;
    /**
     * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request. Spot Instances are launched when the price you specify exceeds the current Spot price. For more information, see [Request Spot Instances for fault-tolerant and flexible applications](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-template-spot-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid Range: Minimum value of 0.001
     *
     * > When you change your maximum price by creating a new launch configuration, running instances will continue to run as long as the maximum price for those running instances is higher than the current Spot price.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-spotprice
     */
    spotPrice: string | undefined;
    /**
     * The Base64-encoded user data to make available to the launched EC2 instances. For more information, see [Instance metadata and user data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-userdata
     */
    userData: string | undefined;
    /**
     * Create a new `AWS::AutoScaling::LaunchConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchConfigurationProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnLaunchConfiguration {
    /**
     * `BlockDevice` is a property of the `EBS` property of the [AWS::AutoScaling::LaunchConfiguration BlockDeviceMapping](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig-blockdev-mapping.html) property type that describes an Amazon EBS volume.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html
     */
    interface BlockDeviceProperty {
        /**
         * Indicates whether the volume is deleted on instance termination. For Amazon EC2 Auto Scaling, the default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * Specifies whether the volume should be encrypted. Encrypted EBS volumes can only be attached to instances that support Amazon EBS encryption. For more information, see [Supported instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_supported_instances) . If your AMI uses encrypted volumes, you can also only launch it on supported instance types.
         *
         * > If you are creating a volume from a snapshot, you cannot create an unencrypted volume from an encrypted snapshot. Also, you cannot specify a KMS key ID when using a launch configuration.
         * >
         * > If you enable encryption by default, the EBS volumes that you create are always encrypted, either using the AWS managed KMS key or a customer-managed KMS key, regardless of whether the snapshot was encrypted.
         * >
         * > For more information, see [Use AWS KMS keys to encrypt Amazon EBS volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-data-protection.html#encryption) in the *Amazon EC2 Auto Scaling User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * The number of input/output (I/O) operations per second (IOPS) to provision for the volume. For `gp3` and `io1` volumes, this represents the number of IOPS that are provisioned for the volume. For `gp2` volumes, this represents the baseline performance of the volume and the rate at which the volume accumulates I/O credits for bursting.
         *
         * The following are the supported values for each volume type:
         *
         * - `gp3` : 3,000-16,000 IOPS
         * - `io1` : 100-64,000 IOPS
         *
         * For `io1` volumes, we guarantee 64,000 IOPS only for [Instances built on the Nitro System](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#ec2-nitro-instances) . Other instance families guarantee performance up to 32,000 IOPS.
         *
         * `Iops` is supported when the volume type is `gp3` or `io1` and required only when the volume type is `io1` . (Not used with `standard` , `gp2` , `st1` , or `sc1` volumes.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-iops
         */
        readonly iops?: number;
        /**
         * The snapshot ID of the volume to use.
         *
         * You must specify either a `VolumeSize` or a `SnapshotId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * The throughput (MiBps) to provision for a `gp3` volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-throughput
         */
        readonly throughput?: number;
        /**
         * The volume size, in GiBs. The following are the supported volumes sizes for each volume type:
         *
         * - `gp2` and `gp3` : 1-16,384
         * - `io1` : 4-16,384
         * - `st1` and `sc1` : 125-16,384
         * - `standard` : 1-1,024
         *
         * You must specify either a `SnapshotId` or a `VolumeSize` . If you specify both `SnapshotId` and `VolumeSize` , the volume size must be equal or greater than the size of the snapshot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-volumesize
         */
        readonly volumeSize?: number;
        /**
         * The volume type. For more information, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * Valid values: `standard` | `io1` | `gp2` | `st1` | `sc1` | `gp3`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-volumetype
         */
        readonly volumeType?: string;
    }
}
export declare namespace CfnLaunchConfiguration {
    /**
     * `BlockDeviceMapping` specifies a block device mapping for the `BlockDeviceMappings` property of the [AWS::AutoScaling::LaunchConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig.html) resource.
     *
     * Each instance that is launched has an associated root device volume, either an Amazon EBS volume or an instance store volume. You can use block device mappings to specify additional EBS volumes or instance store volumes to attach to an instance when it is launched.
     *
     * For more information, see [Example block device mapping](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html#block-device-mapping-ex) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html
     */
    interface BlockDeviceMappingProperty {
        /**
         * The device name assigned to the volume (for example, `/dev/sdh` or `xvdh` ). For more information, see [Device naming on Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html) in the *Amazon EC2 User Guide for Linux Instances* .
         *
         * > To define a block device mapping, set the device name and exactly one of the following properties: `Ebs` , `NoDevice` , or `VirtualName` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-devicename
         */
        readonly deviceName: string;
        /**
         * Information to attach an EBS volume to an instance at launch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-ebs
         */
        readonly ebs?: CfnLaunchConfiguration.BlockDeviceProperty | cdk.IResolvable;
        /**
         * Setting this value to `true` prevents a volume that is included in the block device mapping of the AMI from being mapped to the specified device name at launch.
         *
         * If `NoDevice` is `true` for the root device, instances might fail the EC2 health check. In that case, Amazon EC2 Auto Scaling launches replacement instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-nodevice
         */
        readonly noDevice?: boolean | cdk.IResolvable;
        /**
         * The name of the instance store volume (virtual device) to attach to an instance at launch. The name must be in the form ephemeral *X* where *X* is a number starting from zero (0), for example, `ephemeral0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}
export declare namespace CfnLaunchConfiguration {
    /**
     * `MetadataOptions` is a property of [AWS::AutoScaling::LaunchConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig.html) that describes metadata options for the instances.
     *
     * For more information, see [Configure the instance metadata options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-config.html#launch-configurations-imds) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html
     */
    interface MetadataOptionsProperty {
        /**
         * This parameter enables or disables the HTTP metadata endpoint on your instances. If the parameter is not specified, the default state is `enabled` .
         *
         * > If you specify a value of `disabled` , you will not be able to access your instance metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httpendpoint
         */
        readonly httpEndpoint?: string;
        /**
         * The desired HTTP PUT response hop limit for instance metadata requests. The larger the number, the further instance metadata requests can travel.
         *
         * Default: 1
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httpputresponsehoplimit
         */
        readonly httpPutResponseHopLimit?: number;
        /**
         * The state of token usage for your instance metadata requests. If the parameter is not specified in the request, the default state is `optional` .
         *
         * If the state is `optional` , you can choose to retrieve instance metadata with or without a signed token header on your request. If you retrieve the IAM role credentials without a token, the version 1.0 role credentials are returned. If you retrieve the IAM role credentials using a valid signed token, the version 2.0 role credentials are returned.
         *
         * If the state is `required` , you must send a signed token header with any instance metadata retrieval requests. In this state, retrieving the IAM role credentials always returns the version 2.0 credentials; the version 1.0 credentials are not available.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httptokens
         */
        readonly httpTokens?: string;
    }
}
/**
 * Properties for defining a `CfnLifecycleHook`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html
 */
export interface CfnLifecycleHookProps {
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-autoscalinggroupname
     */
    readonly autoScalingGroupName: string;
    /**
     * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
     *
     * - To create a lifecycle hook for scale-out events, specify `autoscaling:EC2_INSTANCE_LAUNCHING` .
     * - To create a lifecycle hook for scale-in events, specify `autoscaling:EC2_INSTANCE_TERMINATING` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecycletransition
     */
    readonly lifecycleTransition: string;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is `ABANDON` .
     *
     * Valid values: `CONTINUE` | `ABANDON`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-defaultresult
     */
    readonly defaultResult?: string;
    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from `30` to `7200` seconds. The default value is `3600` seconds (1 hour).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-heartbeattimeout
     */
    readonly heartbeatTimeout?: number;
    /**
     * The name of the lifecycle hook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecyclehookname
     */
    readonly lifecycleHookName?: string;
    /**
     * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationmetadata
     */
    readonly notificationMetadata?: string;
    /**
     * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook. You can specify an Amazon SNS topic or an Amazon SQS queue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationtargetarn
     */
    readonly notificationTargetArn?: string;
    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. For information about creating this role, see [Configure a notification target for a lifecycle hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html#lifecycle-hook-notification-target) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-rolearn
     */
    readonly roleArn?: string;
}
/**
 * A CloudFormation `AWS::AutoScaling::LifecycleHook`
 *
 * The `AWS::AutoScaling::LifecycleHook` resource specifies lifecycle hooks for an Auto Scaling group. These hooks let you create solutions that are aware of events in the Auto Scaling instance lifecycle, and then perform a custom action on instances when the corresponding lifecycle event occurs. A lifecycle hook provides a specified amount of time (one hour by default) to wait for the action to complete before the instance transitions to the next state.
 *
 * Use lifecycle hooks to prepare new instances for use or to delay them from being registered behind a load balancer before their configuration has been applied completely. You can also use lifecycle hooks to prepare running instances to be terminated by, for example, downloading logs or other data.
 *
 * For more information, see [Amazon EC2 Auto Scaling lifecycle hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::LifecycleHook
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html
 */
export declare class CfnLifecycleHook extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::LifecycleHook";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecycleHook;
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-autoscalinggroupname
     */
    autoScalingGroupName: string;
    /**
     * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
     *
     * - To create a lifecycle hook for scale-out events, specify `autoscaling:EC2_INSTANCE_LAUNCHING` .
     * - To create a lifecycle hook for scale-in events, specify `autoscaling:EC2_INSTANCE_TERMINATING` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecycletransition
     */
    lifecycleTransition: string;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is `ABANDON` .
     *
     * Valid values: `CONTINUE` | `ABANDON`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-defaultresult
     */
    defaultResult: string | undefined;
    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from `30` to `7200` seconds. The default value is `3600` seconds (1 hour).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-heartbeattimeout
     */
    heartbeatTimeout: number | undefined;
    /**
     * The name of the lifecycle hook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecyclehookname
     */
    lifecycleHookName: string | undefined;
    /**
     * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationmetadata
     */
    notificationMetadata: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook. You can specify an Amazon SNS topic or an Amazon SQS queue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationtargetarn
     */
    notificationTargetArn: string | undefined;
    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. For information about creating this role, see [Configure a notification target for a lifecycle hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html#lifecycle-hook-notification-target) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-rolearn
     */
    roleArn: string | undefined;
    /**
     * Create a new `AWS::AutoScaling::LifecycleHook`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLifecycleHookProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnScalingPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html
 */
export interface CfnScalingPolicyProps {
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-autoscalinggroupname
     */
    readonly autoScalingGroupName: string;
    /**
     * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage). The valid values are `ChangeInCapacity` , `ExactCapacity` , and `PercentChangeInCapacity` .
     *
     * Required if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-adjustmenttype
     */
    readonly adjustmentType?: string;
    /**
     * A cooldown period, in seconds, that applies to a specific simple scaling policy. When a cooldown period is specified here, it overrides the default cooldown.
     *
     * Valid only if the policy type is `SimpleScaling` . For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: None
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-cooldown
     */
    readonly cooldown?: string;
    /**
     * *Not needed if the default instance warmup is defined for the group.*
     *
     * The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics. This warm-up period applies to instances launched due to a specific target tracking or step scaling policy. When a warm-up period is specified here, it overrides the default instance warmup.
     *
     * Valid only if the policy type is `TargetTrackingScaling` or `StepScaling` .
     *
     * > The default is to use the value for the default instance warmup defined for the group. If default instance warmup is null, then `EstimatedInstanceWarmup` falls back to the value of default cooldown.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-estimatedinstancewarmup
     */
    readonly estimatedInstanceWarmup?: number;
    /**
     * The aggregation type for the CloudWatch metrics. The valid values are `Minimum` , `Maximum` , and `Average` . If the aggregation type is null, the value is treated as `Average` .
     *
     * Valid only if the policy type is `StepScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-metricaggregationtype
     */
    readonly metricAggregationType?: string;
    /**
     * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` . For example, suppose that you create a step scaling policy to scale out an Auto Scaling group by 25 percent and you specify a `MinAdjustmentMagnitude` of 2. If the group has 4 instances and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a `MinAdjustmentMagnitude` of 2, Amazon EC2 Auto Scaling scales out the group by 2 instances.
     *
     * Valid only if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * > Some Auto Scaling groups use instance weights. In this case, set the `MinAdjustmentMagnitude` to a value that is at least as large as your largest instance weight.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-minadjustmentmagnitude
     */
    readonly minAdjustmentMagnitude?: number;
    /**
     * One of the following policy types:
     *
     * - `TargetTrackingScaling`
     * - `StepScaling`
     * - `SimpleScaling` (default)
     * - `PredictiveScaling`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-policytype
     */
    readonly policyType?: string;
    /**
     * A predictive scaling policy. Provides support for predefined and custom metrics.
     *
     * Predefined metrics include CPU utilization, network in/out, and the Application Load Balancer request count.
     *
     * Required if the policy type is `PredictiveScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration
     */
    readonly predictiveScalingConfiguration?: CfnScalingPolicy.PredictiveScalingConfigurationProperty | cdk.IResolvable;
    /**
     * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a positive value.
     *
     * Required if the policy type is `SimpleScaling` . (Not used with any other policy type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-scalingadjustment
     */
    readonly scalingAdjustment?: number;
    /**
     * A set of adjustments that enable you to scale based on the size of the alarm breach.
     *
     * Required if the policy type is `StepScaling` . (Not used with any other policy type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-stepadjustments
     */
    readonly stepAdjustments?: Array<CfnScalingPolicy.StepAdjustmentProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A target tracking scaling policy. Provides support for predefined or custom metrics.
     *
     * The following predefined metrics are available:
     *
     * - `ASGAverageCPUUtilization`
     * - `ASGAverageNetworkIn`
     * - `ASGAverageNetworkOut`
     * - `ALBRequestCountPerTarget`
     *
     * If you specify `ALBRequestCountPerTarget` for the metric, you must specify the `ResourceLabel` property with the `PredefinedMetricSpecification` .
     *
     * Required if the policy type is `TargetTrackingScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration
     */
    readonly targetTrackingConfiguration?: CfnScalingPolicy.TargetTrackingConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::AutoScaling::ScalingPolicy`
 *
 * The `AWS::AutoScaling::ScalingPolicy` resource specifies an Amazon EC2 Auto Scaling scaling policy so that the Auto Scaling group can scale the number of instances available for your application.
 *
 * For more information about using scaling policies to scale your Auto Scaling group automatically, see [Dynamic scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html) and [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::ScalingPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html
 */
export declare class CfnScalingPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::ScalingPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalingPolicy;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of a scaling policy.
     * @cloudformationAttribute PolicyName
     */
    readonly attrPolicyName: string;
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-autoscalinggroupname
     */
    autoScalingGroupName: string;
    /**
     * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage). The valid values are `ChangeInCapacity` , `ExactCapacity` , and `PercentChangeInCapacity` .
     *
     * Required if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-adjustmenttype
     */
    adjustmentType: string | undefined;
    /**
     * A cooldown period, in seconds, that applies to a specific simple scaling policy. When a cooldown period is specified here, it overrides the default cooldown.
     *
     * Valid only if the policy type is `SimpleScaling` . For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Default: None
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-cooldown
     */
    cooldown: string | undefined;
    /**
     * *Not needed if the default instance warmup is defined for the group.*
     *
     * The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics. This warm-up period applies to instances launched due to a specific target tracking or step scaling policy. When a warm-up period is specified here, it overrides the default instance warmup.
     *
     * Valid only if the policy type is `TargetTrackingScaling` or `StepScaling` .
     *
     * > The default is to use the value for the default instance warmup defined for the group. If default instance warmup is null, then `EstimatedInstanceWarmup` falls back to the value of default cooldown.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-estimatedinstancewarmup
     */
    estimatedInstanceWarmup: number | undefined;
    /**
     * The aggregation type for the CloudWatch metrics. The valid values are `Minimum` , `Maximum` , and `Average` . If the aggregation type is null, the value is treated as `Average` .
     *
     * Valid only if the policy type is `StepScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-metricaggregationtype
     */
    metricAggregationType: string | undefined;
    /**
     * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` . For example, suppose that you create a step scaling policy to scale out an Auto Scaling group by 25 percent and you specify a `MinAdjustmentMagnitude` of 2. If the group has 4 instances and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a `MinAdjustmentMagnitude` of 2, Amazon EC2 Auto Scaling scales out the group by 2 instances.
     *
     * Valid only if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * > Some Auto Scaling groups use instance weights. In this case, set the `MinAdjustmentMagnitude` to a value that is at least as large as your largest instance weight.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-minadjustmentmagnitude
     */
    minAdjustmentMagnitude: number | undefined;
    /**
     * One of the following policy types:
     *
     * - `TargetTrackingScaling`
     * - `StepScaling`
     * - `SimpleScaling` (default)
     * - `PredictiveScaling`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-policytype
     */
    policyType: string | undefined;
    /**
     * A predictive scaling policy. Provides support for predefined and custom metrics.
     *
     * Predefined metrics include CPU utilization, network in/out, and the Application Load Balancer request count.
     *
     * Required if the policy type is `PredictiveScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration
     */
    predictiveScalingConfiguration: CfnScalingPolicy.PredictiveScalingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a positive value.
     *
     * Required if the policy type is `SimpleScaling` . (Not used with any other policy type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-scalingadjustment
     */
    scalingAdjustment: number | undefined;
    /**
     * A set of adjustments that enable you to scale based on the size of the alarm breach.
     *
     * Required if the policy type is `StepScaling` . (Not used with any other policy type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-stepadjustments
     */
    stepAdjustments: Array<CfnScalingPolicy.StepAdjustmentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A target tracking scaling policy. Provides support for predefined or custom metrics.
     *
     * The following predefined metrics are available:
     *
     * - `ASGAverageCPUUtilization`
     * - `ASGAverageNetworkIn`
     * - `ASGAverageNetworkOut`
     * - `ALBRequestCountPerTarget`
     *
     * If you specify `ALBRequestCountPerTarget` for the metric, you must specify the `ResourceLabel` property with the `PredefinedMetricSpecification` .
     *
     * Required if the policy type is `TargetTrackingScaling` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration
     */
    targetTrackingConfiguration: CfnScalingPolicy.TargetTrackingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::AutoScaling::ScalingPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScalingPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains customized metric specification information for a target tracking scaling policy for Amazon EC2 Auto Scaling.
     *
     * To create your customized metric specification:
     *
     * - Add values for each required property from CloudWatch. You can use an existing metric, or a new metric that you create. To use your own metric, you must first publish the metric to CloudWatch. For more information, see [Publish Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) in the *Amazon CloudWatch User Guide* .
     * - Choose a metric that changes proportionally with capacity. The value of the metric should increase or decrease in inverse proportion to the number of capacity units. That is, the value of the metric should decrease when capacity increases.
     *
     * For more information about CloudWatch, see [Amazon CloudWatch Concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) .
     *
     * `CustomizedMetricSpecification` is a property of the [AWS::AutoScaling::ScalingPolicy TargetTrackingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html
     */
    interface CustomizedMetricSpecificationProperty {
        /**
         * The dimensions of the metric.
         *
         * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-dimensions
         */
        readonly dimensions?: Array<CfnScalingPolicy.MetricDimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric. To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-metricname
         */
        readonly metricName: string;
        /**
         * The namespace of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-namespace
         */
        readonly namespace: string;
        /**
         * The statistic of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-statistic
         */
        readonly statistic: string;
        /**
         * The unit of the metric. For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-unit
         */
        readonly unit?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Represents a specific metric.
     *
     * `Metric` is a property of the [AWS::AutoScaling::ScalingPolicy MetricStat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html
     */
    interface MetricProperty {
        /**
         * The dimensions for the metric. For the list of available dimensions, see the AWS documentation available from the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
         *
         * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-dimensions
         */
        readonly dimensions?: Array<CfnScalingPolicy.MetricDimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-metricname
         */
        readonly metricName: string;
        /**
         * The namespace of the metric. For more information, see the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-namespace
         */
        readonly namespace: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * The metric data to return. Also defines whether this call is returning data for one metric only, or whether it is performing a math expression on the values of returned metric statistics to create a new time series. A time series is a series of data points, each of which is associated with a timestamp.
     *
     * `MetricDataQuery` is a property of the following property types:
     *
     * - [AWS::AutoScaling::ScalingPolicy PredictiveScalingCustomizedScalingMetric](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric.html)
     * - [AWS::AutoScaling::ScalingPolicy PredictiveScalingCustomizedLoadMetric](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric.html)
     * - [AWS::AutoScaling::ScalingPolicy PredictiveScalingCustomizedCapacityMetric](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric.html)
     *
     * Predictive scaling uses the time series data received from CloudWatch to understand how to schedule capacity based on your historical workload patterns.
     *
     * You can call for a single metric or perform math expressions on multiple metrics. Any expressions used in a metric specification must eventually return a single time series.
     *
     * For more information and examples, see [Advanced predictive scaling policy configurations using custom metrics](https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-customized-metric-specification.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html
     */
    interface MetricDataQueryProperty {
        /**
         * The math expression to perform on the returned data, if this object is performing a math expression. This expression can use the `Id` of the other metrics to refer to those metrics, and can also use the `Id` of other expressions to use the result of those expressions.
         *
         * Conditional: Within each `MetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-expression
         */
        readonly expression?: string;
        /**
         * A short name that identifies the object's results in the response. This name must be unique among all `MetricDataQuery` objects specified for a single scaling policy. If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscores. The first character must be a lowercase letter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-id
         */
        readonly id: string;
        /**
         * A human-readable label for this metric or expression. This is especially useful if this is a math expression, so that you know what the value represents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-label
         */
        readonly label?: string;
        /**
         * Information about the metric data to return.
         *
         * Conditional: Within each `MetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-metricstat
         */
        readonly metricStat?: CfnScalingPolicy.MetricStatProperty | cdk.IResolvable;
        /**
         * Indicates whether to return the timestamps and raw data values of this metric.
         *
         * If you use any math expressions, specify `true` for this value for only the final math expression that the metric specification is based on. You must specify `false` for `ReturnData` for all the other metrics and expressions used in the metric specification.
         *
         * If you are only retrieving metrics and not performing any math expressions, do not specify anything for `ReturnData` . This sets it to its default ( `true` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-returndata
         */
        readonly returnData?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * `MetricDimension` specifies a name/value pair that is part of the identity of a CloudWatch metric for the `Dimensions` property of the [AWS::AutoScaling::ScalingPolicy CustomizedMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html) property type. Duplicate dimensions are not allowed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html
     */
    interface MetricDimensionProperty {
        /**
         * The name of the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html#cfn-autoscaling-scalingpolicy-metricdimension-name
         */
        readonly name: string;
        /**
         * The value of the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html#cfn-autoscaling-scalingpolicy-metricdimension-value
         */
        readonly value: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * `MetricStat` is a property of the [AWS::AutoScaling::ScalingPolicy MetricDataQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html) property type.
     *
     * This structure defines the CloudWatch metric to return, along with the statistic, period, and unit.
     *
     * For more information about the CloudWatch terminology below, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) in the *Amazon CloudWatch User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html
     */
    interface MetricStatProperty {
        /**
         * The CloudWatch metric to return, including the metric name, namespace, and dimensions. To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-metric
         */
        readonly metric: CfnScalingPolicy.MetricProperty | cdk.IResolvable;
        /**
         * The statistic to return. It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in [Statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Statistic) in the *Amazon CloudWatch User Guide* .
         *
         * The most commonly used metrics for predictive scaling are `Average` and `Sum` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-stat
         */
        readonly stat: string;
        /**
         * The unit to use for the returned data points. For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-unit
         */
        readonly unit?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains predefined metric specification information for a target tracking scaling policy for Amazon EC2 Auto Scaling.
     *
     * `PredefinedMetricSpecification` is a property of the [AWS::AutoScaling::ScalingPolicy TargetTrackingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html
     */
    interface PredefinedMetricSpecificationProperty {
        /**
         * The metric type. The following predefined metrics are available:
         *
         * - `ASGAverageCPUUtilization` - Average CPU utilization of the Auto Scaling group.
         * - `ASGAverageNetworkIn` - Average number of bytes received on all network interfaces by the Auto Scaling group.
         * - `ASGAverageNetworkOut` - Average number of bytes sent out on all network interfaces by the Auto Scaling group.
         * - `ALBRequestCountPerTarget` - Average Application Load Balancer request count per target for your Auto Scaling group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype
         */
        readonly predefinedMetricType: string;
        /**
         * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group.
         *
         * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
         *
         * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
         *
         * Where:
         *
         * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
         * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
         *
         * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel
         */
        readonly resourceLabel?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * `PredictiveScalingConfiguration` is a property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-policy.html) resource that specifies a predictive scaling policy for Amazon EC2 Auto Scaling.
     *
     * For more information, see [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html
     */
    interface PredictiveScalingConfigurationProperty {
        /**
         * Defines the behavior that should be applied if the forecast capacity approaches or exceeds the maximum capacity of the Auto Scaling group. Defaults to `HonorMaxCapacity` if not specified.
         *
         * The following are possible values:
         *
         * - `HonorMaxCapacity` - Amazon EC2 Auto Scaling cannot scale out capacity higher than the maximum capacity. The maximum capacity is enforced as a hard limit.
         * - `IncreaseMaxCapacity` - Amazon EC2 Auto Scaling can scale out capacity higher than the maximum capacity when the forecast capacity is close to or exceeds the maximum capacity. The upper limit is determined by the forecasted capacity and the value for `MaxCapacityBuffer` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-maxcapacitybreachbehavior
         */
        readonly maxCapacityBreachBehavior?: string;
        /**
         * The size of the capacity buffer to use when the forecast capacity is close to or exceeds the maximum capacity. The value is specified as a percentage relative to the forecast capacity. For example, if the buffer is 10, this means a 10 percent buffer, such that if the forecast capacity is 50, and the maximum capacity is 40, then the effective maximum capacity is 55.
         *
         * If set to 0, Amazon EC2 Auto Scaling may scale capacity higher than the maximum capacity to equal but not exceed forecast capacity.
         *
         * Required if the `MaxCapacityBreachBehavior` property is set to `IncreaseMaxCapacity` , and cannot be used otherwise.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-maxcapacitybuffer
         */
        readonly maxCapacityBuffer?: number;
        /**
         * This structure includes the metrics and target utilization to use for predictive scaling.
         *
         * This is an array, but we currently only support a single metric specification. That is, you can specify a target value and a single metric pair, or a target value and one scaling metric and one load metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-metricspecifications
         */
        readonly metricSpecifications: Array<CfnScalingPolicy.PredictiveScalingMetricSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The predictive scaling mode. Defaults to `ForecastOnly` if not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-mode
         */
        readonly mode?: string;
        /**
         * The amount of time, in seconds, by which the instance launch time can be advanced. For example, the forecast says to add capacity at 10:00 AM, and you choose to pre-launch instances by 5 minutes. In that case, the instances will be launched at 9:55 AM. The intention is to give resources time to be provisioned. It can take a few minutes to launch an EC2 instance. The actual amount of time required depends on several factors, such as the size of the instance and whether there are startup scripts to complete.
         *
         * The value must be less than the forecast interval duration of 3600 seconds (60 minutes). Defaults to 300 seconds if not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-schedulingbuffertime
         */
        readonly schedulingBufferTime?: number;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains capacity metric information for the `CustomizedCapacityMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric.html
     */
    interface PredictiveScalingCustomizedCapacityMetricProperty {
        /**
         * One or more metric data queries to provide the data points for a capacity metric. Use multiple metric data queries only if you are performing a math expression on returned data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric-metricdataqueries
         */
        readonly metricDataQueries: Array<CfnScalingPolicy.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains load metric information for the `CustomizedLoadMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric.html
     */
    interface PredictiveScalingCustomizedLoadMetricProperty {
        /**
         * One or more metric data queries to provide the data points for a load metric. Use multiple metric data queries only if you are performing a math expression on returned data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric-metricdataqueries
         */
        readonly metricDataQueries: Array<CfnScalingPolicy.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains scaling metric information for the `CustomizedScalingMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric.html
     */
    interface PredictiveScalingCustomizedScalingMetricProperty {
        /**
         * One or more metric data queries to provide the data points for a scaling metric. Use multiple metric data queries only if you are performing a math expression on returned data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric-metricdataqueries
         */
        readonly metricDataQueries: Array<CfnScalingPolicy.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * A structure that specifies a metric specification for the `MetricSpecifications` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html) property type.
     *
     * You must specify either a metric pair, or a load metric and a scaling metric individually. Specifying a metric pair instead of individual metrics provides a simpler way to configure metrics for a scaling policy. You choose the metric pair, and the policy automatically knows the correct sum and average statistics to use for the load metric and the scaling metric.
     *
     * Example
     *
     * - You create a predictive scaling policy and specify `ALBRequestCount` as the value for the metric pair and `1000.0` as the target value. For this type of metric, you must provide the metric dimension for the corresponding target group, so you also provide a resource label for the Application Load Balancer target group that is attached to your Auto Scaling group.
     * - The number of requests the target group receives per minute provides the load metric, and the request count averaged between the members of the target group provides the scaling metric. In CloudWatch, this refers to the `RequestCount` and `RequestCountPerTarget` metrics, respectively.
     * - For optimal use of predictive scaling, you adhere to the best practice of using a dynamic scaling policy to automatically scale between the minimum capacity and maximum capacity in response to real-time changes in resource utilization.
     * - Amazon EC2 Auto Scaling consumes data points for the load metric over the last 14 days and creates an hourly load forecast for predictive scaling. (A minimum of 24 hours of data is required.)
     * - After creating the load forecast, Amazon EC2 Auto Scaling determines when to reduce or increase the capacity of your Auto Scaling group in each hour of the forecast period so that the average number of requests received by each instance is as close to 1000 requests per minute as possible at all times.
     *
     * For information about using custom metrics with predictive scaling, see [Advanced predictive scaling policy configurations using custom metrics](https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-customized-metric-specification.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html
     */
    interface PredictiveScalingMetricSpecificationProperty {
        /**
         * The customized capacity metric specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedcapacitymetricspecification
         */
        readonly customizedCapacityMetricSpecification?: CfnScalingPolicy.PredictiveScalingCustomizedCapacityMetricProperty | cdk.IResolvable;
        /**
         * The customized load metric specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedloadmetricspecification
         */
        readonly customizedLoadMetricSpecification?: CfnScalingPolicy.PredictiveScalingCustomizedLoadMetricProperty | cdk.IResolvable;
        /**
         * The customized scaling metric specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedscalingmetricspecification
         */
        readonly customizedScalingMetricSpecification?: CfnScalingPolicy.PredictiveScalingCustomizedScalingMetricProperty | cdk.IResolvable;
        /**
         * The predefined load metric specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedloadmetricspecification
         */
        readonly predefinedLoadMetricSpecification?: CfnScalingPolicy.PredictiveScalingPredefinedLoadMetricProperty | cdk.IResolvable;
        /**
         * The predefined metric pair specification from which Amazon EC2 Auto Scaling determines the appropriate scaling metric and load metric to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedmetricpairspecification
         */
        readonly predefinedMetricPairSpecification?: CfnScalingPolicy.PredictiveScalingPredefinedMetricPairProperty | cdk.IResolvable;
        /**
         * The predefined scaling metric specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedscalingmetricspecification
         */
        readonly predefinedScalingMetricSpecification?: CfnScalingPolicy.PredictiveScalingPredefinedScalingMetricProperty | cdk.IResolvable;
        /**
         * Specifies the target utilization.
         *
         * > Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-targetvalue
         */
        readonly targetValue: number;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains load metric information for the `PredefinedLoadMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * > Does not apply to policies that use a *metric pair* for the metric specification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html
     */
    interface PredictiveScalingPredefinedLoadMetricProperty {
        /**
         * The metric type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric-predefinedmetrictype
         */
        readonly predefinedMetricType: string;
        /**
         * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group.
         *
         * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
         *
         * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
         *
         * Where:
         *
         * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
         * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
         *
         * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric-resourcelabel
         */
        readonly resourceLabel?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains metric pair information for the `PredefinedMetricPairSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * For more information, see [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html
     */
    interface PredictiveScalingPredefinedMetricPairProperty {
        /**
         * Indicates which metrics to use. There are two different types of metrics for each metric type: one is a load metric and one is a scaling metric. For example, if the metric type is `ASGCPUUtilization` , the Auto Scaling group's total CPU metric is used as the load metric, and the average CPU metric is used for the scaling metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair-predefinedmetrictype
         */
        readonly predefinedMetricType: string;
        /**
         * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the total and average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group.
         *
         * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
         *
         * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
         *
         * Where:
         *
         * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
         * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
         *
         * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair-resourcelabel
         */
        readonly resourceLabel?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * Contains scaling metric information for the `PredefinedScalingMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
     *
     * > Does not apply to policies that use a *metric pair* for the metric specification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html
     */
    interface PredictiveScalingPredefinedScalingMetricProperty {
        /**
         * The metric type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric-predefinedmetrictype
         */
        readonly predefinedMetricType: string;
        /**
         * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group.
         *
         * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
         *
         * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
         *
         * Where:
         *
         * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
         * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
         *
         * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric-resourcelabel
         */
        readonly resourceLabel?: string;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * `StepAdjustment` specifies a step adjustment for the `StepAdjustments` property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-policy.html) resource.
     *
     * For the following examples, suppose that you have an alarm with a breach threshold of 50:
     *
     * - To trigger a step adjustment when the metric is greater than or equal to 50 and less than 60, specify a lower bound of 0 and an upper bound of 10.
     * - To trigger a step adjustment when the metric is greater than 40 and less than or equal to 50, specify a lower bound of -10 and an upper bound of 0.
     *
     * There are a few rules for the step adjustments for your step policy:
     *
     * - The ranges of your step adjustments can't overlap or have a gap.
     * - At most one step adjustment can have a null lower bound. If one step adjustment has a negative lower bound, then there must be a step adjustment with a null lower bound.
     * - At most one step adjustment can have a null upper bound. If one step adjustment has a positive upper bound, then there must be a step adjustment with a null upper bound.
     * - The upper and lower bound can't be null in the same step adjustment.
     *
     * For more information, see [Step adjustments](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-steps) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-policy.html#aws-properties-as-policy--examples) section of the `AWS::AutoScaling::ScalingPolicy` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html
     */
    interface StepAdjustmentProperty {
        /**
         * The lower bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound). Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound). A null value indicates negative infinity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervallowerbound
         */
        readonly metricIntervalLowerBound?: number;
        /**
         * The upper bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound). A null value indicates positive infinity.
         *
         * The upper bound must be greater than the lower bound.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervalupperbound
         */
        readonly metricIntervalUpperBound?: number;
        /**
         * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity.
         *
         * The amount by which to scale. The adjustment is based on the value that you specified in the `AdjustmentType` property (either an absolute number or a percentage). A positive value adds to the current capacity and a negative number subtracts from the current capacity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-scalingadjustment
         */
        readonly scalingAdjustment: number;
    }
}
export declare namespace CfnScalingPolicy {
    /**
     * `TargetTrackingConfiguration` is a property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-policy.html) resource that specifies a target tracking scaling policy configuration for Amazon EC2 Auto Scaling.
     *
     * For more information about scaling policies, see [Dynamic scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html
     */
    interface TargetTrackingConfigurationProperty {
        /**
         * A customized metric. You must specify either a predefined metric or a customized metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-customizedmetricspecification
         */
        readonly customizedMetricSpecification?: CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable;
        /**
         * Indicates whether scaling in by the target tracking scaling policy is disabled. If scaling in is disabled, the target tracking scaling policy doesn't remove instances from the Auto Scaling group. Otherwise, the target tracking scaling policy can remove instances from the Auto Scaling group. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-disablescalein
         */
        readonly disableScaleIn?: boolean | cdk.IResolvable;
        /**
         * A predefined metric. You must specify either a predefined metric or a customized metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-predefinedmetricspecification
         */
        readonly predefinedMetricSpecification?: CfnScalingPolicy.PredefinedMetricSpecificationProperty | cdk.IResolvable;
        /**
         * The target value for the metric.
         *
         * > Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-targetvalue
         */
        readonly targetValue: number;
    }
}
/**
 * Properties for defining a `CfnScheduledAction`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html
 */
export interface CfnScheduledActionProps {
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-autoscalinggroupname
     */
    readonly autoScalingGroupName: string;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain. It can scale beyond this capacity if you add more scaling conditions.
     *
     * > You must specify at least one of the following properties: `MaxSize` , `MinSize` , or `DesiredCapacity` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-desiredcapacity
     */
    readonly desiredCapacity?: number;
    /**
     * The date and time for the recurring schedule to end, in UTC. For example, `"2021-06-01T00:00:00Z"` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-endtime
     */
    readonly endTime?: string;
    /**
     * The maximum size of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-maxsize
     */
    readonly maxSize?: number;
    /**
     * The minimum size of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-minsize
     */
    readonly minSize?: number;
    /**
     * The recurring schedule for this action. This format consists of five fields separated by white spaces: [Minute] [Hour] [Day_of_Month] [Month_of_Year] [Day_of_Week]. The value must be in quotes (for example, `"30 0 1 1,6,12 *"` ). For more information about this format, see [Crontab](https://docs.aws.amazon.com/http://crontab.org) .
     *
     * When `StartTime` and `EndTime` are specified with `Recurrence` , they form the boundaries of when the recurring action starts and stops.
     *
     * Cron expressions use Universal Coordinated Time (UTC) by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-recurrence
     */
    readonly recurrence?: string;
    /**
     * The date and time for this action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, `"2021-06-01T00:00:00Z"` ).
     *
     * If you specify `Recurrence` and `StartTime` , Amazon EC2 Auto Scaling performs the action at this time, and then performs the action based on the specified recurrence.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-starttime
     */
    readonly startTime?: string;
    /**
     * Specifies the time zone for a cron expression. If a time zone is not provided, UTC is used by default.
     *
     * Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as `Etc/GMT+9` or `Pacific/Tahiti` ). For more information, see [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-timezone
     */
    readonly timeZone?: string;
}
/**
 * A CloudFormation `AWS::AutoScaling::ScheduledAction`
 *
 * The `AWS::AutoScaling::ScheduledAction` resource specifies an Amazon EC2 Auto Scaling scheduled action so that the Auto Scaling group can change the number of instances available for your application in response to predictable load changes.
 *
 * When you update a stack with an Auto Scaling group and scheduled action, CloudFormation always sets the min size, max size, and desired capacity properties of your group to the values that are defined in the `AWS::AutoScaling::AutoScalingGroup` section of your template. However, you might not want CloudFormation to do that when you have a scheduled action in effect. You can use an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) to prevent CloudFormation from changing the min size, max size, or desired capacity property values during a stack update unless you modified the individual values in your template. If you have rolling updates enabled, before you can update the Auto Scaling group, you must suspend scheduled actions by specifying an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) for the Auto Scaling group. You can find a sample update policy for rolling updates in [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
 *
 * For more information, see [Scheduled scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/schedule_time.html) and [Suspending and resuming scaling processes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-suspend-resume-processes.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::ScheduledAction
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html
 */
export declare class CfnScheduledAction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::ScheduledAction";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledAction;
    /**
     * Returns the name of a scheduled action.
     * @cloudformationAttribute ScheduledActionName
     */
    readonly attrScheduledActionName: string;
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-autoscalinggroupname
     */
    autoScalingGroupName: string;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain. It can scale beyond this capacity if you add more scaling conditions.
     *
     * > You must specify at least one of the following properties: `MaxSize` , `MinSize` , or `DesiredCapacity` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-desiredcapacity
     */
    desiredCapacity: number | undefined;
    /**
     * The date and time for the recurring schedule to end, in UTC. For example, `"2021-06-01T00:00:00Z"` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-endtime
     */
    endTime: string | undefined;
    /**
     * The maximum size of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-maxsize
     */
    maxSize: number | undefined;
    /**
     * The minimum size of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-minsize
     */
    minSize: number | undefined;
    /**
     * The recurring schedule for this action. This format consists of five fields separated by white spaces: [Minute] [Hour] [Day_of_Month] [Month_of_Year] [Day_of_Week]. The value must be in quotes (for example, `"30 0 1 1,6,12 *"` ). For more information about this format, see [Crontab](https://docs.aws.amazon.com/http://crontab.org) .
     *
     * When `StartTime` and `EndTime` are specified with `Recurrence` , they form the boundaries of when the recurring action starts and stops.
     *
     * Cron expressions use Universal Coordinated Time (UTC) by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-recurrence
     */
    recurrence: string | undefined;
    /**
     * The date and time for this action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, `"2021-06-01T00:00:00Z"` ).
     *
     * If you specify `Recurrence` and `StartTime` , Amazon EC2 Auto Scaling performs the action at this time, and then performs the action based on the specified recurrence.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-starttime
     */
    startTime: string | undefined;
    /**
     * Specifies the time zone for a cron expression. If a time zone is not provided, UTC is used by default.
     *
     * Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as `Etc/GMT+9` or `Pacific/Tahiti` ). For more information, see [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-timezone
     */
    timeZone: string | undefined;
    /**
     * Create a new `AWS::AutoScaling::ScheduledAction`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScheduledActionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnWarmPool`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html
 */
export interface CfnWarmPoolProps {
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-autoscalinggroupname
     */
    readonly autoScalingGroupName: string;
    /**
     * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in. The default is to terminate instances in the Auto Scaling group when the group scales in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-instancereusepolicy
     */
    readonly instanceReusePolicy?: CfnWarmPool.InstanceReusePolicyProperty | cdk.IResolvable;
    /**
     * Specifies the maximum number of instances that are allowed to be in the warm pool or in any state except `Terminated` for the Auto Scaling group. This is an optional property. Specify it only if you do not want the warm pool size to be determined by the difference between the group's maximum capacity and its desired capacity.
     *
     * > If a value for `MaxGroupPreparedCapacity` is not specified, Amazon EC2 Auto Scaling launches and maintains the difference between the group's maximum capacity and its desired capacity. If you specify a value for `MaxGroupPreparedCapacity` , Amazon EC2 Auto Scaling uses the difference between the `MaxGroupPreparedCapacity` and the desired capacity instead.
     * >
     * > The size of the warm pool is dynamic. Only when `MaxGroupPreparedCapacity` and `MinSize` are set to the same value does the warm pool have an absolute size.
     *
     * If the desired capacity of the Auto Scaling group is higher than the `MaxGroupPreparedCapacity` , the capacity of the warm pool is 0, unless you specify a value for `MinSize` . To remove a value that you previously set, include the property but specify -1 for the value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-maxgrouppreparedcapacity
     */
    readonly maxGroupPreparedCapacity?: number;
    /**
     * Specifies the minimum number of instances to maintain in the warm pool. This helps you to ensure that there is always a certain number of warmed instances available to handle traffic spikes. Defaults to 0 if not specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-minsize
     */
    readonly minSize?: number;
    /**
     * Sets the instance state to transition to after the lifecycle actions are complete. Default is `Stopped` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-poolstate
     */
    readonly poolState?: string;
}
/**
 * A CloudFormation `AWS::AutoScaling::WarmPool`
 *
 * The `AWS::AutoScaling::WarmPool` resource creates a pool of pre-initialized EC2 instances that sits alongside the Auto Scaling group. Whenever your application needs to scale out, the Auto Scaling group can draw on the warm pool to meet its new desired capacity.
 *
 * When you create a warm pool, you can define a minimum size. When your Auto Scaling group scales out and the size of the warm pool shrinks, Amazon EC2 Auto Scaling launches new instances into the warm pool to maintain its minimum size.
 *
 * For more information, see [Warm pools for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * > CloudFormation supports the `UpdatePolicy` attribute for Auto Scaling groups. During an update, if `UpdatePolicy` is set to `AutoScalingRollingUpdate` , CloudFormation replaces `InService` instances only. Instances in the warm pool are not replaced. The difference in which instances are replaced can potentially result in different instance configurations after the stack update completes. If `UpdatePolicy` is set to `AutoScalingReplacingUpdate` , you do not encounter this issue because CloudFormation replaces both the Auto Scaling group and the warm pool.
 *
 * @cloudformationResource AWS::AutoScaling::WarmPool
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html
 */
export declare class CfnWarmPool extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AutoScaling::WarmPool";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWarmPool;
    /**
     * The name of the Auto Scaling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-autoscalinggroupname
     */
    autoScalingGroupName: string;
    /**
     * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in. The default is to terminate instances in the Auto Scaling group when the group scales in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-instancereusepolicy
     */
    instanceReusePolicy: CfnWarmPool.InstanceReusePolicyProperty | cdk.IResolvable | undefined;
    /**
     * Specifies the maximum number of instances that are allowed to be in the warm pool or in any state except `Terminated` for the Auto Scaling group. This is an optional property. Specify it only if you do not want the warm pool size to be determined by the difference between the group's maximum capacity and its desired capacity.
     *
     * > If a value for `MaxGroupPreparedCapacity` is not specified, Amazon EC2 Auto Scaling launches and maintains the difference between the group's maximum capacity and its desired capacity. If you specify a value for `MaxGroupPreparedCapacity` , Amazon EC2 Auto Scaling uses the difference between the `MaxGroupPreparedCapacity` and the desired capacity instead.
     * >
     * > The size of the warm pool is dynamic. Only when `MaxGroupPreparedCapacity` and `MinSize` are set to the same value does the warm pool have an absolute size.
     *
     * If the desired capacity of the Auto Scaling group is higher than the `MaxGroupPreparedCapacity` , the capacity of the warm pool is 0, unless you specify a value for `MinSize` . To remove a value that you previously set, include the property but specify -1 for the value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-maxgrouppreparedcapacity
     */
    maxGroupPreparedCapacity: number | undefined;
    /**
     * Specifies the minimum number of instances to maintain in the warm pool. This helps you to ensure that there is always a certain number of warmed instances available to handle traffic spikes. Defaults to 0 if not specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-minsize
     */
    minSize: number | undefined;
    /**
     * Sets the instance state to transition to after the lifecycle actions are complete. Default is `Stopped` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-poolstate
     */
    poolState: string | undefined;
    /**
     * Create a new `AWS::AutoScaling::WarmPool`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWarmPoolProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnWarmPool {
    /**
     * A structure that specifies an instance reuse policy for the `InstanceReusePolicy` property of the [AWS::AutoScaling::WarmPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html) resource.
     *
     * For more information, see [Warm pools for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-warmpool-instancereusepolicy.html
     */
    interface InstanceReusePolicyProperty {
        /**
         * Specifies whether instances in the Auto Scaling group can be returned to the warm pool on scale in.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-warmpool-instancereusepolicy.html#cfn-autoscaling-warmpool-instancereusepolicy-reuseonscalein
         */
        readonly reuseOnScaleIn?: boolean | cdk.IResolvable;
    }
}
