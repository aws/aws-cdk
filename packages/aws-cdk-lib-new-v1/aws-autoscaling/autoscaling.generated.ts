/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::AutoScaling::AutoScalingGroup` resource defines an Amazon EC2 Auto Scaling group, which is a collection of Amazon EC2 instances that are treated as a logical grouping for the purposes of automatic scaling and management.
 *
 * For more information about Amazon EC2 Auto Scaling, see the [Amazon EC2 Auto Scaling User Guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) .
 *
 * > Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a [launch template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For more information, see [Launch configurations](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html) and [Migrate AWS CloudFormation stacks from launch configurations to launch templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/migrate-launch-configurations-with-cloudformation.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::AutoScalingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html
 */
export class CfnAutoScalingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::AutoScalingGroup";

  /**
   * Build a CfnAutoScalingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAutoScalingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAutoScalingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAutoScalingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Auto Scaling group. This name must be unique per Region per account.
   */
  public autoScalingGroupName?: string;

  /**
   * A list of Availability Zones where instances in the Auto Scaling group can be created.
   */
  public availabilityZones?: Array<string>;

  /**
   * Indicates whether Capacity Rebalancing is enabled.
   */
  public capacityRebalance?: boolean | cdk.IResolvable;

  /**
   * Reserved.
   */
  public context?: string;

  /**
   * *Only needed if you use simple scaling policies.*.
   */
  public cooldown?: string;

  /**
   * The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the `InService` state.
   */
  public defaultInstanceWarmup?: number;

  /**
   * The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain.
   */
  public desiredCapacity?: string;

  /**
   * The unit of measurement for the value specified for desired capacity.
   */
  public desiredCapacityType?: string;

  /**
   * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check.
   */
  public healthCheckGracePeriod?: number;

  /**
   * A comma-separated value string of one or more health check types.
   */
  public healthCheckType?: string;

  /**
   * The ID of the instance used to base the launch configuration on.
   */
  public instanceId?: string;

  /**
   * An instance maintenance policy.
   */
  public instanceMaintenancePolicy?: CfnAutoScalingGroup.InstanceMaintenancePolicyProperty | cdk.IResolvable;

  /**
   * The name of the launch configuration to use to launch instances.
   */
  public launchConfigurationName?: string;

  /**
   * Information used to specify the launch template and version to use to launch instances.
   */
  public launchTemplate?: cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateSpecificationProperty;

  /**
   * One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.
   */
  public lifecycleHookSpecificationList?: Array<cdk.IResolvable | CfnAutoScalingGroup.LifecycleHookSpecificationProperty> | cdk.IResolvable;

  /**
   * A list of Classic Load Balancers associated with this Auto Scaling group.
   */
  public loadBalancerNames?: Array<string>;

  /**
   * The maximum amount of time, in seconds, that an instance can be in service.
   */
  public maxInstanceLifetime?: number;

  /**
   * The maximum size of the group.
   */
  public maxSize: string;

  /**
   * Enables the monitoring of group metrics of an Auto Scaling group.
   */
  public metricsCollection?: Array<cdk.IResolvable | CfnAutoScalingGroup.MetricsCollectionProperty> | cdk.IResolvable;

  /**
   * The minimum size of the group.
   */
  public minSize: string;

  /**
   * An embedded object that specifies a mixed instances policy.
   */
  public mixedInstancesPolicy?: cdk.IResolvable | CfnAutoScalingGroup.MixedInstancesPolicyProperty;

  /**
   * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in.
   */
  public newInstancesProtectedFromScaleIn?: boolean | cdk.IResolvable;

  /**
   * @deprecated this property has been deprecated
   */
  public notificationConfiguration?: cdk.IResolvable | CfnAutoScalingGroup.NotificationConfigurationProperty;

  /**
   * Configures an Auto Scaling group to send notifications when specified events take place.
   */
  public notificationConfigurations?: Array<cdk.IResolvable | CfnAutoScalingGroup.NotificationConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the placement group into which to launch your instances.
   */
  public placementGroup?: string;

  /**
   * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf.
   */
  public serviceLinkedRoleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more tags.
   */
  public tagsRaw?: Array<CfnAutoScalingGroup.TagPropertyProperty>;

  /**
   * The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group.
   */
  public targetGroupArns?: Array<string>;

  /**
   * A policy or a list of policies that are used to select the instance to terminate.
   */
  public terminationPolicies?: Array<string>;

  /**
   * A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created.
   */
  public vpcZoneIdentifier?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAutoScalingGroupProps) {
    super(scope, id, {
      "type": CfnAutoScalingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "maxSize", this);
    cdk.requireProperty(props, "minSize", this);

    this.autoScalingGroupName = props.autoScalingGroupName;
    this.availabilityZones = props.availabilityZones;
    this.capacityRebalance = props.capacityRebalance;
    this.context = props.context;
    this.cooldown = props.cooldown;
    this.defaultInstanceWarmup = props.defaultInstanceWarmup;
    this.desiredCapacity = props.desiredCapacity;
    this.desiredCapacityType = props.desiredCapacityType;
    this.healthCheckGracePeriod = props.healthCheckGracePeriod;
    this.healthCheckType = props.healthCheckType;
    this.instanceId = props.instanceId;
    this.instanceMaintenancePolicy = props.instanceMaintenancePolicy;
    this.launchConfigurationName = props.launchConfigurationName;
    this.launchTemplate = props.launchTemplate;
    this.lifecycleHookSpecificationList = props.lifecycleHookSpecificationList;
    this.loadBalancerNames = props.loadBalancerNames;
    this.maxInstanceLifetime = props.maxInstanceLifetime;
    this.maxSize = props.maxSize;
    this.metricsCollection = props.metricsCollection;
    this.minSize = props.minSize;
    this.mixedInstancesPolicy = props.mixedInstancesPolicy;
    this.newInstancesProtectedFromScaleIn = props.newInstancesProtectedFromScaleIn;
    this.notificationConfiguration = props.notificationConfiguration;
    this.notificationConfigurations = props.notificationConfigurations;
    this.placementGroup = props.placementGroup;
    this.serviceLinkedRoleArn = props.serviceLinkedRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.AUTOSCALING_GROUP, "AWS::AutoScaling::AutoScalingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetGroupArns = props.targetGroupArns;
    this.terminationPolicies = props.terminationPolicies;
    this.vpcZoneIdentifier = props.vpcZoneIdentifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingGroupName": this.autoScalingGroupName,
      "availabilityZones": this.availabilityZones,
      "capacityRebalance": this.capacityRebalance,
      "context": this.context,
      "cooldown": this.cooldown,
      "defaultInstanceWarmup": this.defaultInstanceWarmup,
      "desiredCapacity": this.desiredCapacity,
      "desiredCapacityType": this.desiredCapacityType,
      "healthCheckGracePeriod": this.healthCheckGracePeriod,
      "healthCheckType": this.healthCheckType,
      "instanceId": this.instanceId,
      "instanceMaintenancePolicy": this.instanceMaintenancePolicy,
      "launchConfigurationName": this.launchConfigurationName,
      "launchTemplate": this.launchTemplate,
      "lifecycleHookSpecificationList": this.lifecycleHookSpecificationList,
      "loadBalancerNames": this.loadBalancerNames,
      "maxInstanceLifetime": this.maxInstanceLifetime,
      "maxSize": this.maxSize,
      "metricsCollection": this.metricsCollection,
      "minSize": this.minSize,
      "mixedInstancesPolicy": this.mixedInstancesPolicy,
      "newInstancesProtectedFromScaleIn": this.newInstancesProtectedFromScaleIn,
      "notificationConfiguration": this.notificationConfiguration,
      "notificationConfigurations": this.notificationConfigurations,
      "placementGroup": this.placementGroup,
      "serviceLinkedRoleArn": this.serviceLinkedRoleArn,
      "tags": this.tags.renderTags(),
      "targetGroupArns": this.targetGroupArns,
      "terminationPolicies": this.terminationPolicies,
      "vpcZoneIdentifier": this.vpcZoneIdentifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAutoScalingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAutoScalingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnAutoScalingGroup {
  /**
   * Specifies a launch template to use when provisioning EC2 instances for an Auto Scaling group.
   *
   * You must specify the following:
   *
   * - The ID or the name of the launch template, but not both.
   * - The version of the launch template.
   *
   * `LaunchTemplateSpecification` is property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource. It is also a property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html) and [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property types.
   *
   * For information about creating a launch template, see [AWS::EC2::LaunchTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) and [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * For examples of launch templates, see [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) and the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html#aws-resource-ec2-launchtemplate--examples) section in the `AWS::EC2::LaunchTemplate` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html
   */
  export interface LaunchTemplateSpecificationProperty {
    /**
     * The ID of the launch template.
     *
     * You must specify the `LaunchTemplateID` or the `LaunchTemplateName` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-launchtemplateid
     */
    readonly launchTemplateId?: string;

    /**
     * The name of the launch template.
     *
     * You must specify the `LaunchTemplateName` or the `LaunchTemplateID` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-launchtemplatename
     */
    readonly launchTemplateName?: string;

    /**
     * The version number of the launch template.
     *
     * Specifying `$Latest` or `$Default` for the template version number is not supported. However, you can specify `LatestVersionNumber` or `DefaultVersionNumber` using the `Fn::GetAtt` intrinsic function. For more information, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
     *
     * > For an example of using the `Fn::GetAtt` function, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplatespecification.html#cfn-autoscaling-autoscalinggroup-launchtemplatespecification-version
     */
    readonly version: string;
  }

  /**
   * `LifecycleHookSpecification` specifies a lifecycle hook for the `LifecycleHookSpecificationList` property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource. A lifecycle hook specifies actions to perform when Amazon EC2 Auto Scaling launches or terminates instances.
   *
   * For more information, see [Amazon EC2 Auto Scaling lifecycle hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html#aws-resource-as-lifecyclehook--examples) section of the `AWS::AutoScaling::LifecycleHook` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html
   */
  export interface LifecycleHookSpecificationProperty {
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
     *
     * The default value is `ABANDON` .
     *
     * Valid values: `CONTINUE` | `ABANDON`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-defaultresult
     */
    readonly defaultResult?: string;

    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out.
     *
     * The range is from `30` to `7200` seconds. The default value is `3600` seconds (1 hour).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-heartbeattimeout
     */
    readonly heartbeatTimeout?: number;

    /**
     * The name of the lifecycle hook.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecyclehookname
     */
    readonly lifecycleHookName: string;

    /**
     * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
     *
     * - To create a lifecycle hook for scale-out events, specify `autoscaling:EC2_INSTANCE_LAUNCHING` .
     * - To create a lifecycle hook for scale-in events, specify `autoscaling:EC2_INSTANCE_TERMINATING` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-lifecycletransition
     */
    readonly lifecycleTransition: string;

    /**
     * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationmetadata
     */
    readonly notificationMetadata?: string;

    /**
     * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook.
     *
     * You can specify an Amazon SNS topic or an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-notificationtargetarn
     */
    readonly notificationTargetArn?: string;

    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target.
     *
     * For information about creating this role, see [Configure a notification target for a lifecycle hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html#lifecycle-hook-notification-target) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-lifecyclehookspecification.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecification-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * `MetricsCollection` is a property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource that describes the group metrics that an Amazon EC2 Auto Scaling group sends to Amazon CloudWatch. These metrics describe the group rather than any of its instances.
   *
   * For more information, see [Monitor CloudWatch metrics for your Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-monitoring.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-metricscollection.html
   */
  export interface MetricsCollectionProperty {
    /**
     * The frequency at which Amazon EC2 Auto Scaling sends aggregated data to CloudWatch.
     *
     * The only valid value is `1Minute` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-metricscollection.html#cfn-autoscaling-autoscalinggroup-metricscollection-granularity
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-metricscollection.html#cfn-autoscaling-autoscalinggroup-metricscollection-metrics
     */
    readonly metrics?: Array<string>;
  }

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
   * `MixedInstancesPolicy` is a property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html
   */
  export interface MixedInstancesPolicyProperty {
    /**
     * The instances distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html#cfn-autoscaling-autoscalinggroup-mixedinstancespolicy-instancesdistribution
     */
    readonly instancesDistribution?: CfnAutoScalingGroup.InstancesDistributionProperty | cdk.IResolvable;

    /**
     * One or more launch templates and the instance types (overrides) that are used to launch EC2 instances to fulfill On-Demand and Spot capacities.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html#cfn-autoscaling-autoscalinggroup-mixedinstancespolicy-launchtemplate
     */
    readonly launchTemplate: cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateProperty;
  }

  /**
   * Use this structure to specify the distribution of On-Demand Instances and Spot Instances and the allocation strategies used to fulfill On-Demand and Spot capacities for a mixed instances policy.
   *
   * For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * `InstancesDistribution` is a property of the [AWS::AutoScaling::AutoScalingGroup MixedInstancesPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html
   */
  export interface InstancesDistributionProperty {
    /**
     * The allocation strategy to apply to your On-Demand Instances when they are launched.
     *
     * Possible instance types are determined by the launch template overrides that you specify.
     *
     * The following lists the valid values:
     *
     * - **lowest-price** - Uses price to determine which instance types are the highest priority, launching the lowest priced instance types within an Availability Zone first. This is the default value for Auto Scaling groups that specify `InstanceRequirements` .
     * - **prioritized** - You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling launches your highest priority instance types first. If all your On-Demand capacity cannot be fulfilled using your highest priority instance type, then Amazon EC2 Auto Scaling launches the remaining capacity using the second priority instance type, and so on. This is the default value for Auto Scaling groups that don't specify `InstanceRequirements` and cannot be used for groups that do.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandallocationstrategy
     */
    readonly onDemandAllocationStrategy?: string;

    /**
     * The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances.
     *
     * This base portion is launched first as your group scales.
     *
     * This number has the same unit of measurement as the group's desired capacity. If you change the default unit of measurement (number of instances) by specifying weighted capacity values in your launch template overrides list, or by changing the default desired capacity type setting of the group, you must specify this number using the same unit of measurement.
     *
     * Default: 0
     *
     * > An update to this setting means a gradual replacement of instances to adjust the current On-Demand Instance levels. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandbasecapacity
     */
    readonly onDemandBaseCapacity?: number;

    /**
     * Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond `OnDemandBaseCapacity` .
     *
     * Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances). If set to 100, only On-Demand Instances are used.
     *
     * Default: 100
     *
     * > An update to this setting means a gradual replacement of instances to adjust the current On-Demand and Spot Instance levels for your additional capacity higher than the base capacity. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-ondemandpercentageabovebasecapacity
     */
    readonly onDemandPercentageAboveBaseCapacity?: number;

    /**
     * The allocation strategy to apply to your Spot Instances when they are launched.
     *
     * Possible instance types are determined by the launch template overrides that you specify.
     *
     * The following lists the valid values:
     *
     * - **capacity-optimized** - Requests Spot Instances using pools that are optimally chosen based on the available Spot capacity. This strategy has the lowest risk of interruption. To give certain instance types a higher chance of launching first, use `capacity-optimized-prioritized` .
     * - **capacity-optimized-prioritized** - You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling honors the instance type priorities on a best effort basis but optimizes for capacity first. Note that if the On-Demand allocation strategy is set to `prioritized` , the same priority is applied when fulfilling On-Demand capacity. This is not a valid value for Auto Scaling groups that specify `InstanceRequirements` .
     * - **lowest-price** - Requests Spot Instances using the lowest priced pools within an Availability Zone, across the number of Spot pools that you specify for the `SpotInstancePools` property. To ensure that your desired capacity is met, you might receive Spot Instances from several pools. This is the default value, but it might lead to high interruption rates because this strategy only considers instance price and not available capacity.
     * - **price-capacity-optimized (recommended)** - The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotallocationstrategy
     */
    readonly spotAllocationStrategy?: string;

    /**
     * The number of Spot Instance pools across which to allocate your Spot Instances.
     *
     * The Spot pools are determined from the different instance types in the overrides. Valid only when the `SpotAllocationStrategy` is `lowest-price` . Value must be in the range of 1–20.
     *
     * Default: 2
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotinstancepools
     */
    readonly spotInstancePools?: number;

    /**
     * The maximum price per unit hour that you are willing to pay for a Spot Instance.
     *
     * If your maximum price is lower than the Spot price for the instance types that you selected, your Spot Instances are not launched. We do not recommend specifying a maximum price because it can lead to increased interruptions. When Spot Instances launch, you pay the current Spot price. To remove a maximum price that you previously set, include the property but specify an empty string ("") for the value.
     *
     * > If you specify a maximum price, your instances will be interrupted more frequently than if you do not specify one.
     *
     * Valid Range: Minimum value of 0.001
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancesdistribution.html#cfn-autoscaling-autoscalinggroup-instancesdistribution-spotmaxprice
     */
    readonly spotMaxPrice?: string;
  }

  /**
   * Use this structure to specify the launch templates and instance types (overrides) for a mixed instances policy.
   *
   * `LaunchTemplate` is a property of the [AWS::AutoScaling::AutoScalingGroup MixedInstancesPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-mixedinstancespolicy.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html
   */
  export interface LaunchTemplateProperty {
    /**
     * The launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html#cfn-autoscaling-autoscalinggroup-launchtemplate-launchtemplatespecification
     */
    readonly launchTemplateSpecification: cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateSpecificationProperty;

    /**
     * Any properties that you specify override the same properties in the launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplate.html#cfn-autoscaling-autoscalinggroup-launchtemplate-overrides
     */
    readonly overrides?: Array<cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateOverridesProperty> | cdk.IResolvable;
  }

  /**
   * Use this structure to let Amazon EC2 Auto Scaling do the following when the Auto Scaling group has a mixed instances policy:  - Override the instance type that is specified in the launch template.
   *
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html
   */
  export interface LaunchTemplateOverridesProperty {
    /**
     * The instance requirements.
     *
     * Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types.
     *
     * You can specify up to four separate sets of instance requirements per Auto Scaling group. This is useful for provisioning instances from different Amazon Machine Images (AMIs) in the same Auto Scaling group. To do this, create the AMIs and create a new launch template for each AMI. Then, create a compatible set of instance requirements for each launch template.
     *
     * > If you specify `InstanceRequirements` , you can't specify `InstanceType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-instancerequirements
     */
    readonly instanceRequirements?: CfnAutoScalingGroup.InstanceRequirementsProperty | cdk.IResolvable;

    /**
     * The instance type, such as `m3.xlarge` . You must specify an instance type that is supported in your requested Region and Availability Zones. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon Elastic Compute Cloud User Guide* .
     *
     * You can specify up to 40 instance types per Auto Scaling group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-instancetype
     */
    readonly instanceType?: string;

    /**
     * Provides a launch template for the specified instance type or set of instance requirements.
     *
     * For example, some instance types might require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template that's specified in the `LaunchTemplate` definition. For more information, see [Specifying a different launch template for an instance type](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-launch-template-overrides.html) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * You can specify up to 20 launch templates per Auto Scaling group. The launch templates specified in the overrides and in the `LaunchTemplate` definition count towards this limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-launchtemplatespecification
     */
    readonly launchTemplateSpecification?: cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateSpecificationProperty;

    /**
     * If you provide a list of instance types to use, you can specify the number of capacity units provided by each instance type in terms of virtual CPUs, memory, storage, throughput, or other relative performance characteristic.
     *
     * When a Spot or On-Demand Instance is launched, the capacity units count toward the desired capacity. Amazon EC2 Auto Scaling launches instances until the desired capacity is totally fulfilled, even if this results in an overage. For example, if there are two units remaining to fulfill capacity, and Amazon EC2 Auto Scaling can only launch an instance with a `WeightedCapacity` of five units, the instance is launched, and the desired capacity is exceeded by three units. For more information, see [Configure instance weighting for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-instance-weighting.html) in the *Amazon EC2 Auto Scaling User Guide* . Value must be in the range of 1-999.
     *
     * If you specify a value for `WeightedCapacity` for one instance type, you must specify a value for `WeightedCapacity` for all of them.
     *
     * > Every Auto Scaling group has three size parameters ( `DesiredCapacity` , `MaxSize` , and `MinSize` ). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html#cfn-autoscaling-autoscalinggroup-launchtemplateoverrides-weightedcapacity
     */
    readonly weightedCapacity?: string;
  }

  /**
   * The attributes for the instance types for a mixed instances policy.
   *
   * Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types.
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html
   */
  export interface InstanceRequirementsProperty {
    /**
     * The minimum and maximum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) for an instance type.
     *
     * To exclude accelerator-enabled instance types, set `Max` to `0` .
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratorcount
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratormanufacturers
     */
    readonly acceleratorManufacturers?: Array<string>;

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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratornames
     */
    readonly acceleratorNames?: Array<string>;

    /**
     * The minimum and maximum total memory size for the accelerators on an instance type, in MiB.
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratortotalmemorymib
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-acceleratortypes
     */
    readonly acceleratorTypes?: Array<string>;

    /**
     * The instance types to apply your specified attributes against.
     *
     * All other instance types are ignored, even if they match your specified attributes.
     *
     * You can use strings with one or more wild cards, represented by an asterisk ( `*` ), to allow an instance type, size, or generation. The following are examples: `m5.8xlarge` , `c5*.*` , `m5a.*` , `r*` , `*3*` .
     *
     * For example, if you specify `c5*` , Amazon EC2 Auto Scaling will allow the entire C5 instance family, which includes all C5a and C5n instance types. If you specify `m5a.*` , Amazon EC2 Auto Scaling will allow all the M5a instance types, but not the M5n instance types.
     *
     * > If you specify `AllowedInstanceTypes` , you can't specify `ExcludedInstanceTypes` .
     *
     * Default: All instance types
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-allowedinstancetypes
     */
    readonly allowedInstanceTypes?: Array<string>;

    /**
     * Indicates whether bare metal instance types are included, excluded, or required.
     *
     * Default: `excluded`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-baremetal
     */
    readonly bareMetal?: string;

    /**
     * The minimum and maximum baseline bandwidth performance for an instance type, in Mbps.
     *
     * For more information, see [Amazon EBS–optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-baselineebsbandwidthmbps
     */
    readonly baselineEbsBandwidthMbps?: CfnAutoScalingGroup.BaselineEbsBandwidthMbpsRequestProperty | cdk.IResolvable;

    /**
     * Indicates whether burstable performance instance types are included, excluded, or required.
     *
     * For more information, see [Burstable performance instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * Default: `excluded`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-burstableperformance
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-cpumanufacturers
     */
    readonly cpuManufacturers?: Array<string>;

    /**
     * The instance types to exclude.
     *
     * You can use strings with one or more wild cards, represented by an asterisk ( `*` ), to exclude an instance family, type, size, or generation. The following are examples: `m5.8xlarge` , `c5*.*` , `m5a.*` , `r*` , `*3*` .
     *
     * For example, if you specify `c5*` , you are excluding the entire C5 instance family, which includes all C5a and C5n instance types. If you specify `m5a.*` , Amazon EC2 Auto Scaling will exclude all the M5a instance types, but not the M5n instance types.
     *
     * > If you specify `ExcludedInstanceTypes` , you can't specify `AllowedInstanceTypes` .
     *
     * Default: No excluded instance types
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-excludedinstancetypes
     */
    readonly excludedInstanceTypes?: Array<string>;

    /**
     * Indicates whether current or previous generation instance types are included.
     *
     * - For current generation instance types, specify `current` . The current generation includes EC2 instance types currently recommended for use. This typically includes the latest two to three generations in each instance family. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon EC2 User Guide for Linux Instances* .
     * - For previous generation instance types, specify `previous` .
     *
     * Default: Any current or previous generation
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-instancegenerations
     */
    readonly instanceGenerations?: Array<string>;

    /**
     * Indicates whether instance types with instance store volumes are included, excluded, or required.
     *
     * For more information, see [Amazon EC2 instance store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * Default: `included`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-localstorage
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-localstoragetypes
     */
    readonly localStorageTypes?: Array<string>;

    /**
     * The minimum and maximum amount of memory per vCPU for an instance type, in GiB.
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-memorygibpervcpu
     */
    readonly memoryGiBPerVCpu?: cdk.IResolvable | CfnAutoScalingGroup.MemoryGiBPerVCpuRequestProperty;

    /**
     * The minimum and maximum instance memory size for an instance type, in MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-memorymib
     */
    readonly memoryMiB: cdk.IResolvable | CfnAutoScalingGroup.MemoryMiBRequestProperty;

    /**
     * The minimum and maximum amount of network bandwidth, in gigabits per second (Gbps).
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-networkbandwidthgbps
     */
    readonly networkBandwidthGbps?: cdk.IResolvable | CfnAutoScalingGroup.NetworkBandwidthGbpsRequestProperty;

    /**
     * The minimum and maximum number of network interfaces for an instance type.
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-networkinterfacecount
     */
    readonly networkInterfaceCount?: cdk.IResolvable | CfnAutoScalingGroup.NetworkInterfaceCountRequestProperty;

    /**
     * The price protection threshold for On-Demand Instances.
     *
     * This is the maximum you’ll pay for an On-Demand Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as `999999` .
     *
     * If you set `DesiredCapacityType` to `vcpu` or `memory-mib` , the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.
     *
     * Default: `20`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-ondemandmaxpricepercentageoverlowestprice
     */
    readonly onDemandMaxPricePercentageOverLowestPrice?: number;

    /**
     * Indicates whether instance types must provide On-Demand Instance hibernation support.
     *
     * Default: `false`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-requirehibernatesupport
     */
    readonly requireHibernateSupport?: boolean | cdk.IResolvable;

    /**
     * The price protection threshold for Spot Instances.
     *
     * This is the maximum you’ll pay for a Spot Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as `999999` .
     *
     * If you set `DesiredCapacityType` to `vcpu` or `memory-mib` , the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.
     *
     * Default: `100`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-spotmaxpricepercentageoverlowestprice
     */
    readonly spotMaxPricePercentageOverLowestPrice?: number;

    /**
     * The minimum and maximum total local storage size for an instance type, in GB.
     *
     * Default: No minimum or maximum limits
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-totallocalstoragegb
     */
    readonly totalLocalStorageGb?: cdk.IResolvable | CfnAutoScalingGroup.TotalLocalStorageGBRequestProperty;

    /**
     * The minimum and maximum number of vCPUs for an instance type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancerequirements.html#cfn-autoscaling-autoscalinggroup-instancerequirements-vcpucount
     */
    readonly vCpuCount: cdk.IResolvable | CfnAutoScalingGroup.VCpuCountRequestProperty;
  }

  /**
   * `AcceleratorCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of accelerators for an instance type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html
   */
  export interface AcceleratorCountRequestProperty {
    /**
     * The maximum value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html#cfn-autoscaling-autoscalinggroup-acceleratorcountrequest-max
     */
    readonly max?: number;

    /**
     * The minimum value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratorcountrequest.html#cfn-autoscaling-autoscalinggroup-acceleratorcountrequest-min
     */
    readonly min?: number;
  }

  /**
   * `AcceleratorTotalMemoryMiBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum total memory size for the accelerators for an instance type, in MiB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html
   */
  export interface AcceleratorTotalMemoryMiBRequestProperty {
    /**
     * The memory maximum in MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html#cfn-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest-max
     */
    readonly max?: number;

    /**
     * The memory minimum in MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest.html#cfn-autoscaling-autoscalinggroup-acceleratortotalmemorymibrequest-min
     */
    readonly min?: number;
  }

  /**
   * `BaselineEbsBandwidthMbpsRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum baseline bandwidth performance for an instance type, in Mbps.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html
   */
  export interface BaselineEbsBandwidthMbpsRequestProperty {
    /**
     * The maximum value in Mbps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html#cfn-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest-max
     */
    readonly max?: number;

    /**
     * The minimum value in Mbps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest.html#cfn-autoscaling-autoscalinggroup-baselineebsbandwidthmbpsrequest-min
     */
    readonly min?: number;
  }

  /**
   * `MemoryGiBPerVCpuRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum amount of memory per vCPU for an instance type, in GiB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html
   */
  export interface MemoryGiBPerVCpuRequestProperty {
    /**
     * The memory maximum in GiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html#cfn-autoscaling-autoscalinggroup-memorygibpervcpurequest-max
     */
    readonly max?: number;

    /**
     * The memory minimum in GiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorygibpervcpurequest.html#cfn-autoscaling-autoscalinggroup-memorygibpervcpurequest-min
     */
    readonly min?: number;
  }

  /**
   * `MemoryMiBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum instance memory size for an instance type, in MiB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html
   */
  export interface MemoryMiBRequestProperty {
    /**
     * The memory maximum in MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html#cfn-autoscaling-autoscalinggroup-memorymibrequest-max
     */
    readonly max?: number;

    /**
     * The memory minimum in MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-memorymibrequest.html#cfn-autoscaling-autoscalinggroup-memorymibrequest-min
     */
    readonly min?: number;
  }

  /**
   * `NetworkBandwidthGbpsRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum network bandwidth for an instance type, in Gbps.
   *
   * > Setting the minimum bandwidth does not guarantee that your instance will achieve the minimum bandwidth. Amazon EC2 will identify instance types that support the specified minimum bandwidth, but the actual bandwidth of your instance might go below the specified minimum at times. For more information, see [Available instance bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html#available-instance-bandwidth) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html
   */
  export interface NetworkBandwidthGbpsRequestProperty {
    /**
     * The maximum amount of network bandwidth, in gigabits per second (Gbps).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html#cfn-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest-max
     */
    readonly max?: number;

    /**
     * The minimum amount of network bandwidth, in gigabits per second (Gbps).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest.html#cfn-autoscaling-autoscalinggroup-networkbandwidthgbpsrequest-min
     */
    readonly min?: number;
  }

  /**
   * `NetworkInterfaceCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of network interfaces for an instance type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html
   */
  export interface NetworkInterfaceCountRequestProperty {
    /**
     * The maximum number of network interfaces.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html#cfn-autoscaling-autoscalinggroup-networkinterfacecountrequest-max
     */
    readonly max?: number;

    /**
     * The minimum number of network interfaces.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-networkinterfacecountrequest.html#cfn-autoscaling-autoscalinggroup-networkinterfacecountrequest-min
     */
    readonly min?: number;
  }

  /**
   * `TotalLocalStorageGBRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum total local storage size for an instance type, in GB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html
   */
  export interface TotalLocalStorageGBRequestProperty {
    /**
     * The storage maximum in GB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html#cfn-autoscaling-autoscalinggroup-totallocalstoragegbrequest-max
     */
    readonly max?: number;

    /**
     * The storage minimum in GB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-totallocalstoragegbrequest.html#cfn-autoscaling-autoscalinggroup-totallocalstoragegbrequest-min
     */
    readonly min?: number;
  }

  /**
   * `VCpuCountRequest` is a property of the `InstanceRequirements` property of the [AWS::AutoScaling::AutoScalingGroup LaunchTemplateOverrides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-launchtemplateoverrides.html) property type that describes the minimum and maximum number of vCPUs for an instance type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html
   */
  export interface VCpuCountRequestProperty {
    /**
     * The maximum number of vCPUs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html#cfn-autoscaling-autoscalinggroup-vcpucountrequest-max
     */
    readonly max?: number;

    /**
     * The minimum number of vCPUs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-vcpucountrequest.html#cfn-autoscaling-autoscalinggroup-vcpucountrequest-min
     */
    readonly min?: number;
  }

  /**
   * A structure that specifies an Amazon SNS notification configuration for the `NotificationConfigurations` property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource.
   *
   * For an example template snippet, see [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
   *
   * For more information, see [Get Amazon SNS notifications when your Auto Scaling group scales](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ASGettingNotifications.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-notificationconfiguration.html
   */
  export interface NotificationConfigurationProperty {
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-notificationconfiguration.html#cfn-autoscaling-autoscalinggroup-notificationconfiguration-notificationtypes
     */
    readonly notificationTypes?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-notificationconfiguration.html#cfn-autoscaling-autoscalinggroup-notificationconfiguration-topicarn
     */
    readonly topicArn: string;
  }

  /**
   * A structure that specifies a tag for the `Tags` property of [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource.
   *
   * For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide* . You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the `AWS::AutoScaling::AutoScalingGroup` resource.
   *
   * CloudFormation adds the following tags to all Auto Scaling groups and associated instances:
   *
   * - aws:cloudformation:stack-name
   * - aws:cloudformation:stack-id
   * - aws:cloudformation:logical-id
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-tagproperty.html
   */
  export interface TagPropertyProperty {
    /**
     * The tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-tagproperty.html#cfn-autoscaling-autoscalinggroup-tagproperty-key
     */
    readonly key: string;

    /**
     * Set to `true` if you want CloudFormation to copy the tag to EC2 instances that are launched as part of the Auto Scaling group.
     *
     * Set to `false` if you want the tag attached only to the Auto Scaling group and not copied to any instances launched as part of the Auto Scaling group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-tagproperty.html#cfn-autoscaling-autoscalinggroup-tagproperty-propagateatlaunch
     */
    readonly propagateAtLaunch: boolean | cdk.IResolvable;

    /**
     * The tag value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-tagproperty.html#cfn-autoscaling-autoscalinggroup-tagproperty-value
     */
    readonly value: string;
  }

  /**
   * `InstanceMaintenancePolicy` is a property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource.
   *
   * For more information, see [Instance maintenance policies](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-maintenance-policy.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancemaintenancepolicy.html
   */
  export interface InstanceMaintenancePolicyProperty {
    /**
     * Specifies the upper threshold as a percentage of the desired capacity of the Auto Scaling group.
     *
     * It represents the maximum percentage of the group that can be in service and healthy, or pending, to support your workload when replacing instances. Value range is 100 to 200. After it's set, a value of `-1` will clear the previously set value.
     *
     * Both `MinHealthyPercentage` and `MaxHealthyPercentage` must be specified, and the difference between them cannot be greater than 100. A large range increases the number of instances that can be replaced at the same time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancemaintenancepolicy.html#cfn-autoscaling-autoscalinggroup-instancemaintenancepolicy-maxhealthypercentage
     */
    readonly maxHealthyPercentage?: number;

    /**
     * Specifies the lower threshold as a percentage of the desired capacity of the Auto Scaling group.
     *
     * It represents the minimum percentage of the group to keep in service, healthy, and ready to use to support your workload when replacing instances. Value range is 0 to 100. After it's set, a value of `-1` will clear the previously set value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-autoscalinggroup-instancemaintenancepolicy.html#cfn-autoscaling-autoscalinggroup-instancemaintenancepolicy-minhealthypercentage
     */
    readonly minHealthyPercentage?: number;
  }
}

/**
 * Properties for defining a `CfnAutoScalingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html
 */
export interface CfnAutoScalingGroupProps {
  /**
   * The name of the Auto Scaling group. This name must be unique per Region per account.
   *
   * The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters.
   *
   * > You cannot use a colon (:) in the name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-autoscalinggroupname
   */
  readonly autoScalingGroupName?: string;

  /**
   * A list of Availability Zones where instances in the Auto Scaling group can be created.
   *
   * Used for launching into the default VPC subnet in each Availability Zone when not using the `VPCZoneIdentifier` property, or for attaching a network interface when an existing network interface ID is specified in a launch template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * Indicates whether Capacity Rebalancing is enabled.
   *
   * Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-capacityrebalance
   */
  readonly capacityRebalance?: boolean | cdk.IResolvable;

  /**
   * Reserved.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-context
   */
  readonly context?: string;

  /**
   * *Only needed if you use simple scaling policies.*.
   *
   * The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Default: `300` seconds
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-cooldown
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-defaultinstancewarmup
   */
  readonly defaultInstanceWarmup?: number;

  /**
   * The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain.
   *
   * It can scale beyond this capacity if you configure automatic scaling.
   *
   * The number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity when creating the stack, the default is the minimum size of the group.
   *
   * CloudFormation marks the Auto Scaling group as successful (by setting its status to CREATE_COMPLETE) when the desired capacity is reached. However, if a maximum Spot price is set in the launch template or launch configuration that you specified, then desired capacity is not used as a criteria for success. Whether your request is fulfilled depends on Spot Instance capacity and your maximum price.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-desiredcapacity
   */
  readonly desiredCapacity?: string;

  /**
   * The unit of measurement for the value specified for desired capacity.
   *
   * Amazon EC2 Auto Scaling supports `DesiredCapacityType` for attribute-based instance type selection only. For more information, see [Creating an Auto Scaling group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-instance-type-requirements.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * By default, Amazon EC2 Auto Scaling specifies `units` , which translates into number of instances.
   *
   * Valid values: `units` | `vcpu` | `memory-mib`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-desiredcapacitytype
   */
  readonly desiredCapacityType?: string;

  /**
   * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check.
   *
   * This is useful if your instances do not immediately pass their health checks after they enter the `InService` state. For more information, see [Set the health check grace period for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Default: `0` seconds
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-healthcheckgraceperiod
   */
  readonly healthCheckGracePeriod?: number;

  /**
   * A comma-separated value string of one or more health check types.
   *
   * The valid values are `EC2` , `ELB` , and `VPC_LATTICE` . `EC2` is the default health check and cannot be disabled. For more information, see [Health checks for Auto Scaling instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/healthcheck.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Only specify `EC2` if you must clear a value that was previously set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-healthchecktype
   */
  readonly healthCheckType?: string;

  /**
   * The ID of the instance used to base the launch configuration on.
   *
   * For more information, see [Create an Auto Scaling group using an EC2 instance](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-from-instance.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * If you specify `LaunchTemplate` , `MixedInstancesPolicy` , or `LaunchConfigurationName` , don't specify `InstanceId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-instanceid
   */
  readonly instanceId?: string;

  /**
   * An instance maintenance policy.
   *
   * For more information, see [Set instance maintenance policy](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-maintenance-policy.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-instancemaintenancepolicy
   */
  readonly instanceMaintenancePolicy?: CfnAutoScalingGroup.InstanceMaintenancePolicyProperty | cdk.IResolvable;

  /**
   * The name of the launch configuration to use to launch instances.
   *
   * Required only if you don't specify `LaunchTemplate` , `MixedInstancesPolicy` , or `InstanceId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-launchconfigurationname
   */
  readonly launchConfigurationName?: string;

  /**
   * Information used to specify the launch template and version to use to launch instances.
   *
   * You can alternatively associate a launch template to the Auto Scaling group by specifying a `MixedInstancesPolicy` . For more information about creating launch templates, see [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * If you omit this property, you must specify `MixedInstancesPolicy` , `LaunchConfigurationName` , or `InstanceId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-launchtemplate
   */
  readonly launchTemplate?: cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateSpecificationProperty;

  /**
   * One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecificationlist
   */
  readonly lifecycleHookSpecificationList?: Array<cdk.IResolvable | CfnAutoScalingGroup.LifecycleHookSpecificationProperty> | cdk.IResolvable;

  /**
   * A list of Classic Load Balancers associated with this Auto Scaling group.
   *
   * For Application Load Balancers, Network Load Balancers, and Gateway Load Balancers, specify the `TargetGroupARNs` property instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-loadbalancernames
   */
  readonly loadBalancerNames?: Array<string>;

  /**
   * The maximum amount of time, in seconds, that an instance can be in service.
   *
   * The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see [Replacing Auto Scaling instances based on maximum instance lifetime](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-maxinstancelifetime
   */
  readonly maxInstanceLifetime?: number;

  /**
   * The maximum size of the group.
   *
   * > With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above `MaxSize` to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above `MaxSize` by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-maxsize
   */
  readonly maxSize: string;

  /**
   * Enables the monitoring of group metrics of an Auto Scaling group.
   *
   * By default, these metrics are disabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-metricscollection
   */
  readonly metricsCollection?: Array<cdk.IResolvable | CfnAutoScalingGroup.MetricsCollectionProperty> | cdk.IResolvable;

  /**
   * The minimum size of the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-minsize
   */
  readonly minSize: string;

  /**
   * An embedded object that specifies a mixed instances policy.
   *
   * The policy includes properties that not only define the distribution of On-Demand Instances and Spot Instances, the maximum price to pay for Spot Instances (optional), and how the Auto Scaling group allocates instance types to fulfill On-Demand and Spot capacities, but also the properties that specify the instance configuration information—the launch template and instance types. The policy can also include a weight for each instance type and different launch templates for individual instance types.
   *
   * For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-mixedinstancespolicy
   */
  readonly mixedInstancesPolicy?: cdk.IResolvable | CfnAutoScalingGroup.MixedInstancesPolicyProperty;

  /**
   * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in.
   *
   * For more information about preventing instances from terminating on scale in, see [Using instance scale-in protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-newinstancesprotectedfromscalein
   */
  readonly newInstancesProtectedFromScaleIn?: boolean | cdk.IResolvable;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-notificationconfiguration
   */
  readonly notificationConfiguration?: cdk.IResolvable | CfnAutoScalingGroup.NotificationConfigurationProperty;

  /**
   * Configures an Auto Scaling group to send notifications when specified events take place.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-notificationconfigurations
   */
  readonly notificationConfigurations?: Array<cdk.IResolvable | CfnAutoScalingGroup.NotificationConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the placement group into which to launch your instances.
   *
   * For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * > A *cluster* placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-placementgroup
   */
  readonly placementGroup?: string;

  /**
   * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf.
   *
   * By default, Amazon EC2 Auto Scaling uses a service-linked role named `AWSServiceRoleForAutoScaling` , which it creates if it does not exist. For more information, see [Service-linked roles](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-servicelinkedrolearn
   */
  readonly serviceLinkedRoleArn?: string;

  /**
   * One or more tags.
   *
   * You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-tags
   */
  readonly tags?: Array<CfnAutoScalingGroup.TagPropertyProperty>;

  /**
   * The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group.
   *
   * Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see [Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-targetgrouparns
   */
  readonly targetGroupArns?: Array<string>;

  /**
   * A policy or a list of policies that are used to select the instance to terminate.
   *
   * These policies are executed in the order that you list them. For more information, see [Work with Amazon EC2 Auto Scaling termination policies](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Valid values: `Default` | `AllocationStrategy` | `ClosestToNextInstanceHour` | `NewestInstance` | `OldestInstance` | `OldestLaunchConfiguration` | `OldestLaunchTemplate` | `arn:aws:lambda:region:account-id:function:my-function:my-alias`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-terminationpolicies
   */
  readonly terminationPolicies?: Array<string>;

  /**
   * A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created.
   *
   * If this resource specifies public subnets and is also in a VPC that is defined in the same stack template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the [VPC-gateway attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html) .
   *
   * > When you update `VPCZoneIdentifier` , this retains the same Auto Scaling group and replaces old instances with new ones, according to the specified subnets. You can optionally specify how CloudFormation handles these updates by using an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) .
   *
   * Required to launch instances into a nondefault VPC. If you specify `VPCZoneIdentifier` with `AvailabilityZones` , the subnets that you specify for this property must reside in those Availability Zones.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#cfn-autoscaling-autoscalinggroup-vpczoneidentifier
   */
  readonly vpcZoneIdentifier?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchTemplateId", cdk.validateString)(properties.launchTemplateId));
  errors.collect(cdk.propertyValidator("launchTemplateName", cdk.validateString)(properties.launchTemplateName));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupLaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "LaunchTemplateId": cdk.stringToCloudFormation(properties.launchTemplateId),
    "LaunchTemplateName": cdk.stringToCloudFormation(properties.launchTemplateName),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.LaunchTemplateSpecificationProperty>();
  ret.addPropertyResult("launchTemplateId", "LaunchTemplateId", (properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined));
  ret.addPropertyResult("launchTemplateName", "LaunchTemplateName", (properties.LaunchTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateName) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecycleHookSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleHookSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupLifecycleHookSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultResult", cdk.validateString)(properties.defaultResult));
  errors.collect(cdk.propertyValidator("heartbeatTimeout", cdk.validateNumber)(properties.heartbeatTimeout));
  errors.collect(cdk.propertyValidator("lifecycleHookName", cdk.requiredValidator)(properties.lifecycleHookName));
  errors.collect(cdk.propertyValidator("lifecycleHookName", cdk.validateString)(properties.lifecycleHookName));
  errors.collect(cdk.propertyValidator("lifecycleTransition", cdk.requiredValidator)(properties.lifecycleTransition));
  errors.collect(cdk.propertyValidator("lifecycleTransition", cdk.validateString)(properties.lifecycleTransition));
  errors.collect(cdk.propertyValidator("notificationMetadata", cdk.validateString)(properties.notificationMetadata));
  errors.collect(cdk.propertyValidator("notificationTargetArn", cdk.validateString)(properties.notificationTargetArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"LifecycleHookSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupLifecycleHookSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupLifecycleHookSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultResult": cdk.stringToCloudFormation(properties.defaultResult),
    "HeartbeatTimeout": cdk.numberToCloudFormation(properties.heartbeatTimeout),
    "LifecycleHookName": cdk.stringToCloudFormation(properties.lifecycleHookName),
    "LifecycleTransition": cdk.stringToCloudFormation(properties.lifecycleTransition),
    "NotificationMetadata": cdk.stringToCloudFormation(properties.notificationMetadata),
    "NotificationTargetARN": cdk.stringToCloudFormation(properties.notificationTargetArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupLifecycleHookSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.LifecycleHookSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.LifecycleHookSpecificationProperty>();
  ret.addPropertyResult("defaultResult", "DefaultResult", (properties.DefaultResult != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultResult) : undefined));
  ret.addPropertyResult("heartbeatTimeout", "HeartbeatTimeout", (properties.HeartbeatTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.HeartbeatTimeout) : undefined));
  ret.addPropertyResult("lifecycleHookName", "LifecycleHookName", (properties.LifecycleHookName != null ? cfn_parse.FromCloudFormation.getString(properties.LifecycleHookName) : undefined));
  ret.addPropertyResult("lifecycleTransition", "LifecycleTransition", (properties.LifecycleTransition != null ? cfn_parse.FromCloudFormation.getString(properties.LifecycleTransition) : undefined));
  ret.addPropertyResult("notificationMetadata", "NotificationMetadata", (properties.NotificationMetadata != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationMetadata) : undefined));
  ret.addPropertyResult("notificationTargetArn", "NotificationTargetARN", (properties.NotificationTargetARN != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTargetARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricsCollectionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsCollectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupMetricsCollectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("granularity", cdk.requiredValidator)(properties.granularity));
  errors.collect(cdk.propertyValidator("granularity", cdk.validateString)(properties.granularity));
  errors.collect(cdk.propertyValidator("metrics", cdk.listValidator(cdk.validateString))(properties.metrics));
  return errors.wrap("supplied properties not correct for \"MetricsCollectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupMetricsCollectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupMetricsCollectionPropertyValidator(properties).assertSuccess();
  return {
    "Granularity": cdk.stringToCloudFormation(properties.granularity),
    "Metrics": cdk.listMapper(cdk.stringToCloudFormation)(properties.metrics)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupMetricsCollectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.MetricsCollectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.MetricsCollectionProperty>();
  ret.addPropertyResult("granularity", "Granularity", (properties.Granularity != null ? cfn_parse.FromCloudFormation.getString(properties.Granularity) : undefined));
  ret.addPropertyResult("metrics", "Metrics", (properties.Metrics != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Metrics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstancesDistributionProperty`
 *
 * @param properties - the TypeScript properties of a `InstancesDistributionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupInstancesDistributionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onDemandAllocationStrategy", cdk.validateString)(properties.onDemandAllocationStrategy));
  errors.collect(cdk.propertyValidator("onDemandBaseCapacity", cdk.validateNumber)(properties.onDemandBaseCapacity));
  errors.collect(cdk.propertyValidator("onDemandPercentageAboveBaseCapacity", cdk.validateNumber)(properties.onDemandPercentageAboveBaseCapacity));
  errors.collect(cdk.propertyValidator("spotAllocationStrategy", cdk.validateString)(properties.spotAllocationStrategy));
  errors.collect(cdk.propertyValidator("spotInstancePools", cdk.validateNumber)(properties.spotInstancePools));
  errors.collect(cdk.propertyValidator("spotMaxPrice", cdk.validateString)(properties.spotMaxPrice));
  return errors.wrap("supplied properties not correct for \"InstancesDistributionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupInstancesDistributionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupInstancesDistributionPropertyValidator(properties).assertSuccess();
  return {
    "OnDemandAllocationStrategy": cdk.stringToCloudFormation(properties.onDemandAllocationStrategy),
    "OnDemandBaseCapacity": cdk.numberToCloudFormation(properties.onDemandBaseCapacity),
    "OnDemandPercentageAboveBaseCapacity": cdk.numberToCloudFormation(properties.onDemandPercentageAboveBaseCapacity),
    "SpotAllocationStrategy": cdk.stringToCloudFormation(properties.spotAllocationStrategy),
    "SpotInstancePools": cdk.numberToCloudFormation(properties.spotInstancePools),
    "SpotMaxPrice": cdk.stringToCloudFormation(properties.spotMaxPrice)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupInstancesDistributionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.InstancesDistributionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.InstancesDistributionProperty>();
  ret.addPropertyResult("onDemandAllocationStrategy", "OnDemandAllocationStrategy", (properties.OnDemandAllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.OnDemandAllocationStrategy) : undefined));
  ret.addPropertyResult("onDemandBaseCapacity", "OnDemandBaseCapacity", (properties.OnDemandBaseCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.OnDemandBaseCapacity) : undefined));
  ret.addPropertyResult("onDemandPercentageAboveBaseCapacity", "OnDemandPercentageAboveBaseCapacity", (properties.OnDemandPercentageAboveBaseCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.OnDemandPercentageAboveBaseCapacity) : undefined));
  ret.addPropertyResult("spotAllocationStrategy", "SpotAllocationStrategy", (properties.SpotAllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.SpotAllocationStrategy) : undefined));
  ret.addPropertyResult("spotInstancePools", "SpotInstancePools", (properties.SpotInstancePools != null ? cfn_parse.FromCloudFormation.getNumber(properties.SpotInstancePools) : undefined));
  ret.addPropertyResult("spotMaxPrice", "SpotMaxPrice", (properties.SpotMaxPrice != null ? cfn_parse.FromCloudFormation.getString(properties.SpotMaxPrice) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AcceleratorCountRequestProperty`
 *
 * @param properties - the TypeScript properties of a `AcceleratorCountRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupAcceleratorCountRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"AcceleratorCountRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupAcceleratorCountRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupAcceleratorCountRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupAcceleratorCountRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.AcceleratorCountRequestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.AcceleratorCountRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AcceleratorTotalMemoryMiBRequestProperty`
 *
 * @param properties - the TypeScript properties of a `AcceleratorTotalMemoryMiBRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"AcceleratorTotalMemoryMiBRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.AcceleratorTotalMemoryMiBRequestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.AcceleratorTotalMemoryMiBRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BaselineEbsBandwidthMbpsRequestProperty`
 *
 * @param properties - the TypeScript properties of a `BaselineEbsBandwidthMbpsRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"BaselineEbsBandwidthMbpsRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.BaselineEbsBandwidthMbpsRequestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.BaselineEbsBandwidthMbpsRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MemoryGiBPerVCpuRequestProperty`
 *
 * @param properties - the TypeScript properties of a `MemoryGiBPerVCpuRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"MemoryGiBPerVCpuRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.MemoryGiBPerVCpuRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.MemoryGiBPerVCpuRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MemoryMiBRequestProperty`
 *
 * @param properties - the TypeScript properties of a `MemoryMiBRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupMemoryMiBRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"MemoryMiBRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupMemoryMiBRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupMemoryMiBRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupMemoryMiBRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.MemoryMiBRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.MemoryMiBRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkBandwidthGbpsRequestProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkBandwidthGbpsRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"NetworkBandwidthGbpsRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.NetworkBandwidthGbpsRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.NetworkBandwidthGbpsRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkInterfaceCountRequestProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceCountRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupNetworkInterfaceCountRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"NetworkInterfaceCountRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupNetworkInterfaceCountRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupNetworkInterfaceCountRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupNetworkInterfaceCountRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.NetworkInterfaceCountRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.NetworkInterfaceCountRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TotalLocalStorageGBRequestProperty`
 *
 * @param properties - the TypeScript properties of a `TotalLocalStorageGBRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupTotalLocalStorageGBRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"TotalLocalStorageGBRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupTotalLocalStorageGBRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupTotalLocalStorageGBRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupTotalLocalStorageGBRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.TotalLocalStorageGBRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.TotalLocalStorageGBRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VCpuCountRequestProperty`
 *
 * @param properties - the TypeScript properties of a `VCpuCountRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupVCpuCountRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("max", cdk.validateNumber)(properties.max));
  errors.collect(cdk.propertyValidator("min", cdk.validateNumber)(properties.min));
  return errors.wrap("supplied properties not correct for \"VCpuCountRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupVCpuCountRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupVCpuCountRequestPropertyValidator(properties).assertSuccess();
  return {
    "Max": cdk.numberToCloudFormation(properties.max),
    "Min": cdk.numberToCloudFormation(properties.min)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupVCpuCountRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.VCpuCountRequestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.VCpuCountRequestProperty>();
  ret.addPropertyResult("max", "Max", (properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined));
  ret.addPropertyResult("min", "Min", (properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceRequirementsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceRequirementsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupInstanceRequirementsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceleratorCount", CfnAutoScalingGroupAcceleratorCountRequestPropertyValidator)(properties.acceleratorCount));
  errors.collect(cdk.propertyValidator("acceleratorManufacturers", cdk.listValidator(cdk.validateString))(properties.acceleratorManufacturers));
  errors.collect(cdk.propertyValidator("acceleratorNames", cdk.listValidator(cdk.validateString))(properties.acceleratorNames));
  errors.collect(cdk.propertyValidator("acceleratorTotalMemoryMiB", CfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyValidator)(properties.acceleratorTotalMemoryMiB));
  errors.collect(cdk.propertyValidator("acceleratorTypes", cdk.listValidator(cdk.validateString))(properties.acceleratorTypes));
  errors.collect(cdk.propertyValidator("allowedInstanceTypes", cdk.listValidator(cdk.validateString))(properties.allowedInstanceTypes));
  errors.collect(cdk.propertyValidator("bareMetal", cdk.validateString)(properties.bareMetal));
  errors.collect(cdk.propertyValidator("baselineEbsBandwidthMbps", CfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyValidator)(properties.baselineEbsBandwidthMbps));
  errors.collect(cdk.propertyValidator("burstablePerformance", cdk.validateString)(properties.burstablePerformance));
  errors.collect(cdk.propertyValidator("cpuManufacturers", cdk.listValidator(cdk.validateString))(properties.cpuManufacturers));
  errors.collect(cdk.propertyValidator("excludedInstanceTypes", cdk.listValidator(cdk.validateString))(properties.excludedInstanceTypes));
  errors.collect(cdk.propertyValidator("instanceGenerations", cdk.listValidator(cdk.validateString))(properties.instanceGenerations));
  errors.collect(cdk.propertyValidator("localStorage", cdk.validateString)(properties.localStorage));
  errors.collect(cdk.propertyValidator("localStorageTypes", cdk.listValidator(cdk.validateString))(properties.localStorageTypes));
  errors.collect(cdk.propertyValidator("memoryGiBPerVCpu", CfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyValidator)(properties.memoryGiBPerVCpu));
  errors.collect(cdk.propertyValidator("memoryMiB", cdk.requiredValidator)(properties.memoryMiB));
  errors.collect(cdk.propertyValidator("memoryMiB", CfnAutoScalingGroupMemoryMiBRequestPropertyValidator)(properties.memoryMiB));
  errors.collect(cdk.propertyValidator("networkBandwidthGbps", CfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyValidator)(properties.networkBandwidthGbps));
  errors.collect(cdk.propertyValidator("networkInterfaceCount", CfnAutoScalingGroupNetworkInterfaceCountRequestPropertyValidator)(properties.networkInterfaceCount));
  errors.collect(cdk.propertyValidator("onDemandMaxPricePercentageOverLowestPrice", cdk.validateNumber)(properties.onDemandMaxPricePercentageOverLowestPrice));
  errors.collect(cdk.propertyValidator("requireHibernateSupport", cdk.validateBoolean)(properties.requireHibernateSupport));
  errors.collect(cdk.propertyValidator("spotMaxPricePercentageOverLowestPrice", cdk.validateNumber)(properties.spotMaxPricePercentageOverLowestPrice));
  errors.collect(cdk.propertyValidator("totalLocalStorageGb", CfnAutoScalingGroupTotalLocalStorageGBRequestPropertyValidator)(properties.totalLocalStorageGb));
  errors.collect(cdk.propertyValidator("vCpuCount", cdk.requiredValidator)(properties.vCpuCount));
  errors.collect(cdk.propertyValidator("vCpuCount", CfnAutoScalingGroupVCpuCountRequestPropertyValidator)(properties.vCpuCount));
  return errors.wrap("supplied properties not correct for \"InstanceRequirementsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupInstanceRequirementsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupInstanceRequirementsPropertyValidator(properties).assertSuccess();
  return {
    "AcceleratorCount": convertCfnAutoScalingGroupAcceleratorCountRequestPropertyToCloudFormation(properties.acceleratorCount),
    "AcceleratorManufacturers": cdk.listMapper(cdk.stringToCloudFormation)(properties.acceleratorManufacturers),
    "AcceleratorNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.acceleratorNames),
    "AcceleratorTotalMemoryMiB": convertCfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyToCloudFormation(properties.acceleratorTotalMemoryMiB),
    "AcceleratorTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.acceleratorTypes),
    "AllowedInstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedInstanceTypes),
    "BareMetal": cdk.stringToCloudFormation(properties.bareMetal),
    "BaselineEbsBandwidthMbps": convertCfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyToCloudFormation(properties.baselineEbsBandwidthMbps),
    "BurstablePerformance": cdk.stringToCloudFormation(properties.burstablePerformance),
    "CpuManufacturers": cdk.listMapper(cdk.stringToCloudFormation)(properties.cpuManufacturers),
    "ExcludedInstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedInstanceTypes),
    "InstanceGenerations": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceGenerations),
    "LocalStorage": cdk.stringToCloudFormation(properties.localStorage),
    "LocalStorageTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.localStorageTypes),
    "MemoryGiBPerVCpu": convertCfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyToCloudFormation(properties.memoryGiBPerVCpu),
    "MemoryMiB": convertCfnAutoScalingGroupMemoryMiBRequestPropertyToCloudFormation(properties.memoryMiB),
    "NetworkBandwidthGbps": convertCfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyToCloudFormation(properties.networkBandwidthGbps),
    "NetworkInterfaceCount": convertCfnAutoScalingGroupNetworkInterfaceCountRequestPropertyToCloudFormation(properties.networkInterfaceCount),
    "OnDemandMaxPricePercentageOverLowestPrice": cdk.numberToCloudFormation(properties.onDemandMaxPricePercentageOverLowestPrice),
    "RequireHibernateSupport": cdk.booleanToCloudFormation(properties.requireHibernateSupport),
    "SpotMaxPricePercentageOverLowestPrice": cdk.numberToCloudFormation(properties.spotMaxPricePercentageOverLowestPrice),
    "TotalLocalStorageGB": convertCfnAutoScalingGroupTotalLocalStorageGBRequestPropertyToCloudFormation(properties.totalLocalStorageGb),
    "VCpuCount": convertCfnAutoScalingGroupVCpuCountRequestPropertyToCloudFormation(properties.vCpuCount)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupInstanceRequirementsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.InstanceRequirementsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.InstanceRequirementsProperty>();
  ret.addPropertyResult("acceleratorCount", "AcceleratorCount", (properties.AcceleratorCount != null ? CfnAutoScalingGroupAcceleratorCountRequestPropertyFromCloudFormation(properties.AcceleratorCount) : undefined));
  ret.addPropertyResult("acceleratorManufacturers", "AcceleratorManufacturers", (properties.AcceleratorManufacturers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AcceleratorManufacturers) : undefined));
  ret.addPropertyResult("acceleratorNames", "AcceleratorNames", (properties.AcceleratorNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AcceleratorNames) : undefined));
  ret.addPropertyResult("acceleratorTotalMemoryMiB", "AcceleratorTotalMemoryMiB", (properties.AcceleratorTotalMemoryMiB != null ? CfnAutoScalingGroupAcceleratorTotalMemoryMiBRequestPropertyFromCloudFormation(properties.AcceleratorTotalMemoryMiB) : undefined));
  ret.addPropertyResult("acceleratorTypes", "AcceleratorTypes", (properties.AcceleratorTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AcceleratorTypes) : undefined));
  ret.addPropertyResult("allowedInstanceTypes", "AllowedInstanceTypes", (properties.AllowedInstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedInstanceTypes) : undefined));
  ret.addPropertyResult("bareMetal", "BareMetal", (properties.BareMetal != null ? cfn_parse.FromCloudFormation.getString(properties.BareMetal) : undefined));
  ret.addPropertyResult("baselineEbsBandwidthMbps", "BaselineEbsBandwidthMbps", (properties.BaselineEbsBandwidthMbps != null ? CfnAutoScalingGroupBaselineEbsBandwidthMbpsRequestPropertyFromCloudFormation(properties.BaselineEbsBandwidthMbps) : undefined));
  ret.addPropertyResult("burstablePerformance", "BurstablePerformance", (properties.BurstablePerformance != null ? cfn_parse.FromCloudFormation.getString(properties.BurstablePerformance) : undefined));
  ret.addPropertyResult("cpuManufacturers", "CpuManufacturers", (properties.CpuManufacturers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CpuManufacturers) : undefined));
  ret.addPropertyResult("excludedInstanceTypes", "ExcludedInstanceTypes", (properties.ExcludedInstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedInstanceTypes) : undefined));
  ret.addPropertyResult("instanceGenerations", "InstanceGenerations", (properties.InstanceGenerations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceGenerations) : undefined));
  ret.addPropertyResult("localStorage", "LocalStorage", (properties.LocalStorage != null ? cfn_parse.FromCloudFormation.getString(properties.LocalStorage) : undefined));
  ret.addPropertyResult("localStorageTypes", "LocalStorageTypes", (properties.LocalStorageTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LocalStorageTypes) : undefined));
  ret.addPropertyResult("memoryGiBPerVCpu", "MemoryGiBPerVCpu", (properties.MemoryGiBPerVCpu != null ? CfnAutoScalingGroupMemoryGiBPerVCpuRequestPropertyFromCloudFormation(properties.MemoryGiBPerVCpu) : undefined));
  ret.addPropertyResult("memoryMiB", "MemoryMiB", (properties.MemoryMiB != null ? CfnAutoScalingGroupMemoryMiBRequestPropertyFromCloudFormation(properties.MemoryMiB) : undefined));
  ret.addPropertyResult("networkBandwidthGbps", "NetworkBandwidthGbps", (properties.NetworkBandwidthGbps != null ? CfnAutoScalingGroupNetworkBandwidthGbpsRequestPropertyFromCloudFormation(properties.NetworkBandwidthGbps) : undefined));
  ret.addPropertyResult("networkInterfaceCount", "NetworkInterfaceCount", (properties.NetworkInterfaceCount != null ? CfnAutoScalingGroupNetworkInterfaceCountRequestPropertyFromCloudFormation(properties.NetworkInterfaceCount) : undefined));
  ret.addPropertyResult("onDemandMaxPricePercentageOverLowestPrice", "OnDemandMaxPricePercentageOverLowestPrice", (properties.OnDemandMaxPricePercentageOverLowestPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.OnDemandMaxPricePercentageOverLowestPrice) : undefined));
  ret.addPropertyResult("requireHibernateSupport", "RequireHibernateSupport", (properties.RequireHibernateSupport != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireHibernateSupport) : undefined));
  ret.addPropertyResult("spotMaxPricePercentageOverLowestPrice", "SpotMaxPricePercentageOverLowestPrice", (properties.SpotMaxPricePercentageOverLowestPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.SpotMaxPricePercentageOverLowestPrice) : undefined));
  ret.addPropertyResult("totalLocalStorageGb", "TotalLocalStorageGB", (properties.TotalLocalStorageGB != null ? CfnAutoScalingGroupTotalLocalStorageGBRequestPropertyFromCloudFormation(properties.TotalLocalStorageGB) : undefined));
  ret.addPropertyResult("vCpuCount", "VCpuCount", (properties.VCpuCount != null ? CfnAutoScalingGroupVCpuCountRequestPropertyFromCloudFormation(properties.VCpuCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateOverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplateOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceRequirements", CfnAutoScalingGroupInstanceRequirementsPropertyValidator)(properties.instanceRequirements));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("launchTemplateSpecification", CfnAutoScalingGroupLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplateSpecification));
  errors.collect(cdk.propertyValidator("weightedCapacity", cdk.validateString)(properties.weightedCapacity));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateOverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupLaunchTemplateOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupLaunchTemplateOverridesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceRequirements": convertCfnAutoScalingGroupInstanceRequirementsPropertyToCloudFormation(properties.instanceRequirements),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "LaunchTemplateSpecification": convertCfnAutoScalingGroupLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplateSpecification),
    "WeightedCapacity": cdk.stringToCloudFormation(properties.weightedCapacity)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplateOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateOverridesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.LaunchTemplateOverridesProperty>();
  ret.addPropertyResult("instanceRequirements", "InstanceRequirements", (properties.InstanceRequirements != null ? CfnAutoScalingGroupInstanceRequirementsPropertyFromCloudFormation(properties.InstanceRequirements) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("launchTemplateSpecification", "LaunchTemplateSpecification", (properties.LaunchTemplateSpecification != null ? CfnAutoScalingGroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplateSpecification) : undefined));
  ret.addPropertyResult("weightedCapacity", "WeightedCapacity", (properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getString(properties.WeightedCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchTemplateSpecification", cdk.requiredValidator)(properties.launchTemplateSpecification));
  errors.collect(cdk.propertyValidator("launchTemplateSpecification", CfnAutoScalingGroupLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplateSpecification));
  errors.collect(cdk.propertyValidator("overrides", cdk.listValidator(CfnAutoScalingGroupLaunchTemplateOverridesPropertyValidator))(properties.overrides));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupLaunchTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupLaunchTemplatePropertyValidator(properties).assertSuccess();
  return {
    "LaunchTemplateSpecification": convertCfnAutoScalingGroupLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplateSpecification),
    "Overrides": cdk.listMapper(convertCfnAutoScalingGroupLaunchTemplateOverridesPropertyToCloudFormation)(properties.overrides)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupLaunchTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.LaunchTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.LaunchTemplateProperty>();
  ret.addPropertyResult("launchTemplateSpecification", "LaunchTemplateSpecification", (properties.LaunchTemplateSpecification != null ? CfnAutoScalingGroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplateSpecification) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? cfn_parse.FromCloudFormation.getArray(CfnAutoScalingGroupLaunchTemplateOverridesPropertyFromCloudFormation)(properties.Overrides) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MixedInstancesPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `MixedInstancesPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupMixedInstancesPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instancesDistribution", CfnAutoScalingGroupInstancesDistributionPropertyValidator)(properties.instancesDistribution));
  errors.collect(cdk.propertyValidator("launchTemplate", cdk.requiredValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnAutoScalingGroupLaunchTemplatePropertyValidator)(properties.launchTemplate));
  return errors.wrap("supplied properties not correct for \"MixedInstancesPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupMixedInstancesPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupMixedInstancesPolicyPropertyValidator(properties).assertSuccess();
  return {
    "InstancesDistribution": convertCfnAutoScalingGroupInstancesDistributionPropertyToCloudFormation(properties.instancesDistribution),
    "LaunchTemplate": convertCfnAutoScalingGroupLaunchTemplatePropertyToCloudFormation(properties.launchTemplate)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupMixedInstancesPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.MixedInstancesPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.MixedInstancesPolicyProperty>();
  ret.addPropertyResult("instancesDistribution", "InstancesDistribution", (properties.InstancesDistribution != null ? CfnAutoScalingGroupInstancesDistributionPropertyFromCloudFormation(properties.InstancesDistribution) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnAutoScalingGroupLaunchTemplatePropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupNotificationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notificationTypes", cdk.listValidator(cdk.validateString))(properties.notificationTypes));
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"NotificationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupNotificationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupNotificationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "NotificationTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationTypes),
    "TopicARN": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupNotificationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.NotificationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.NotificationConfigurationProperty>();
  ret.addPropertyResult("notificationTypes", "NotificationTypes", (properties.NotificationTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationTypes) : undefined));
  ret.addPropertyResult("topicArn", "TopicARN", (properties.TopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.TopicARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `TagPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupTagPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("propagateAtLaunch", cdk.requiredValidator)(properties.propagateAtLaunch));
  errors.collect(cdk.propertyValidator("propagateAtLaunch", cdk.validateBoolean)(properties.propagateAtLaunch));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupTagPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupTagPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "PropagateAtLaunch": cdk.booleanToCloudFormation(properties.propagateAtLaunch),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupTagPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutoScalingGroup.TagPropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.TagPropertyProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("propagateAtLaunch", "PropagateAtLaunch", (properties.PropagateAtLaunch != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PropagateAtLaunch) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceMaintenancePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceMaintenancePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupInstanceMaintenancePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxHealthyPercentage", cdk.validateNumber)(properties.maxHealthyPercentage));
  errors.collect(cdk.propertyValidator("minHealthyPercentage", cdk.validateNumber)(properties.minHealthyPercentage));
  return errors.wrap("supplied properties not correct for \"InstanceMaintenancePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupInstanceMaintenancePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupInstanceMaintenancePolicyPropertyValidator(properties).assertSuccess();
  return {
    "MaxHealthyPercentage": cdk.numberToCloudFormation(properties.maxHealthyPercentage),
    "MinHealthyPercentage": cdk.numberToCloudFormation(properties.minHealthyPercentage)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupInstanceMaintenancePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroup.InstanceMaintenancePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroup.InstanceMaintenancePolicyProperty>();
  ret.addPropertyResult("maxHealthyPercentage", "MaxHealthyPercentage", (properties.MaxHealthyPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxHealthyPercentage) : undefined));
  ret.addPropertyResult("minHealthyPercentage", "MinHealthyPercentage", (properties.MinHealthyPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinHealthyPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAutoScalingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnAutoScalingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.validateString)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("capacityRebalance", cdk.validateBoolean)(properties.capacityRebalance));
  errors.collect(cdk.propertyValidator("context", cdk.validateString)(properties.context));
  errors.collect(cdk.propertyValidator("cooldown", cdk.validateString)(properties.cooldown));
  errors.collect(cdk.propertyValidator("defaultInstanceWarmup", cdk.validateNumber)(properties.defaultInstanceWarmup));
  errors.collect(cdk.propertyValidator("desiredCapacity", cdk.validateString)(properties.desiredCapacity));
  errors.collect(cdk.propertyValidator("desiredCapacityType", cdk.validateString)(properties.desiredCapacityType));
  errors.collect(cdk.propertyValidator("healthCheckGracePeriod", cdk.validateNumber)(properties.healthCheckGracePeriod));
  errors.collect(cdk.propertyValidator("healthCheckType", cdk.validateString)(properties.healthCheckType));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("instanceMaintenancePolicy", CfnAutoScalingGroupInstanceMaintenancePolicyPropertyValidator)(properties.instanceMaintenancePolicy));
  errors.collect(cdk.propertyValidator("launchConfigurationName", cdk.validateString)(properties.launchConfigurationName));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnAutoScalingGroupLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("lifecycleHookSpecificationList", cdk.listValidator(CfnAutoScalingGroupLifecycleHookSpecificationPropertyValidator))(properties.lifecycleHookSpecificationList));
  errors.collect(cdk.propertyValidator("loadBalancerNames", cdk.listValidator(cdk.validateString))(properties.loadBalancerNames));
  errors.collect(cdk.propertyValidator("maxInstanceLifetime", cdk.validateNumber)(properties.maxInstanceLifetime));
  errors.collect(cdk.propertyValidator("maxSize", cdk.requiredValidator)(properties.maxSize));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateString)(properties.maxSize));
  errors.collect(cdk.propertyValidator("metricsCollection", cdk.listValidator(CfnAutoScalingGroupMetricsCollectionPropertyValidator))(properties.metricsCollection));
  errors.collect(cdk.propertyValidator("minSize", cdk.requiredValidator)(properties.minSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateString)(properties.minSize));
  errors.collect(cdk.propertyValidator("mixedInstancesPolicy", CfnAutoScalingGroupMixedInstancesPolicyPropertyValidator)(properties.mixedInstancesPolicy));
  errors.collect(cdk.propertyValidator("newInstancesProtectedFromScaleIn", cdk.validateBoolean)(properties.newInstancesProtectedFromScaleIn));
  errors.collect(cdk.propertyValidator("notificationConfiguration", CfnAutoScalingGroupNotificationConfigurationPropertyValidator)(properties.notificationConfiguration));
  errors.collect(cdk.propertyValidator("notificationConfigurations", cdk.listValidator(CfnAutoScalingGroupNotificationConfigurationPropertyValidator))(properties.notificationConfigurations));
  errors.collect(cdk.propertyValidator("placementGroup", cdk.validateString)(properties.placementGroup));
  errors.collect(cdk.propertyValidator("serviceLinkedRoleArn", cdk.validateString)(properties.serviceLinkedRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnAutoScalingGroupTagPropertyPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("targetGroupArns", cdk.listValidator(cdk.validateString))(properties.targetGroupArns));
  errors.collect(cdk.propertyValidator("terminationPolicies", cdk.listValidator(cdk.validateString))(properties.terminationPolicies));
  errors.collect(cdk.propertyValidator("vpcZoneIdentifier", cdk.listValidator(cdk.validateString))(properties.vpcZoneIdentifier));
  return errors.wrap("supplied properties not correct for \"CfnAutoScalingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingGroupPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupName": cdk.stringToCloudFormation(properties.autoScalingGroupName),
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "CapacityRebalance": cdk.booleanToCloudFormation(properties.capacityRebalance),
    "Context": cdk.stringToCloudFormation(properties.context),
    "Cooldown": cdk.stringToCloudFormation(properties.cooldown),
    "DefaultInstanceWarmup": cdk.numberToCloudFormation(properties.defaultInstanceWarmup),
    "DesiredCapacity": cdk.stringToCloudFormation(properties.desiredCapacity),
    "DesiredCapacityType": cdk.stringToCloudFormation(properties.desiredCapacityType),
    "HealthCheckGracePeriod": cdk.numberToCloudFormation(properties.healthCheckGracePeriod),
    "HealthCheckType": cdk.stringToCloudFormation(properties.healthCheckType),
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "InstanceMaintenancePolicy": convertCfnAutoScalingGroupInstanceMaintenancePolicyPropertyToCloudFormation(properties.instanceMaintenancePolicy),
    "LaunchConfigurationName": cdk.stringToCloudFormation(properties.launchConfigurationName),
    "LaunchTemplate": convertCfnAutoScalingGroupLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
    "LifecycleHookSpecificationList": cdk.listMapper(convertCfnAutoScalingGroupLifecycleHookSpecificationPropertyToCloudFormation)(properties.lifecycleHookSpecificationList),
    "LoadBalancerNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.loadBalancerNames),
    "MaxInstanceLifetime": cdk.numberToCloudFormation(properties.maxInstanceLifetime),
    "MaxSize": cdk.stringToCloudFormation(properties.maxSize),
    "MetricsCollection": cdk.listMapper(convertCfnAutoScalingGroupMetricsCollectionPropertyToCloudFormation)(properties.metricsCollection),
    "MinSize": cdk.stringToCloudFormation(properties.minSize),
    "MixedInstancesPolicy": convertCfnAutoScalingGroupMixedInstancesPolicyPropertyToCloudFormation(properties.mixedInstancesPolicy),
    "NewInstancesProtectedFromScaleIn": cdk.booleanToCloudFormation(properties.newInstancesProtectedFromScaleIn),
    "NotificationConfiguration": convertCfnAutoScalingGroupNotificationConfigurationPropertyToCloudFormation(properties.notificationConfiguration),
    "NotificationConfigurations": cdk.listMapper(convertCfnAutoScalingGroupNotificationConfigurationPropertyToCloudFormation)(properties.notificationConfigurations),
    "PlacementGroup": cdk.stringToCloudFormation(properties.placementGroup),
    "ServiceLinkedRoleARN": cdk.stringToCloudFormation(properties.serviceLinkedRoleArn),
    "Tags": cdk.listMapper(convertCfnAutoScalingGroupTagPropertyPropertyToCloudFormation)(properties.tags),
    "TargetGroupARNs": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetGroupArns),
    "TerminationPolicies": cdk.listMapper(cdk.stringToCloudFormation)(properties.terminationPolicies),
    "VPCZoneIdentifier": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcZoneIdentifier)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingGroupProps>();
  ret.addPropertyResult("autoScalingGroupName", "AutoScalingGroupName", (properties.AutoScalingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupName) : undefined));
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("capacityRebalance", "CapacityRebalance", (properties.CapacityRebalance != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CapacityRebalance) : undefined));
  ret.addPropertyResult("context", "Context", (properties.Context != null ? cfn_parse.FromCloudFormation.getString(properties.Context) : undefined));
  ret.addPropertyResult("cooldown", "Cooldown", (properties.Cooldown != null ? cfn_parse.FromCloudFormation.getString(properties.Cooldown) : undefined));
  ret.addPropertyResult("defaultInstanceWarmup", "DefaultInstanceWarmup", (properties.DefaultInstanceWarmup != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultInstanceWarmup) : undefined));
  ret.addPropertyResult("desiredCapacity", "DesiredCapacity", (properties.DesiredCapacity != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredCapacity) : undefined));
  ret.addPropertyResult("desiredCapacityType", "DesiredCapacityType", (properties.DesiredCapacityType != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredCapacityType) : undefined));
  ret.addPropertyResult("healthCheckGracePeriod", "HealthCheckGracePeriod", (properties.HealthCheckGracePeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckGracePeriod) : undefined));
  ret.addPropertyResult("healthCheckType", "HealthCheckType", (properties.HealthCheckType != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckType) : undefined));
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("instanceMaintenancePolicy", "InstanceMaintenancePolicy", (properties.InstanceMaintenancePolicy != null ? CfnAutoScalingGroupInstanceMaintenancePolicyPropertyFromCloudFormation(properties.InstanceMaintenancePolicy) : undefined));
  ret.addPropertyResult("launchConfigurationName", "LaunchConfigurationName", (properties.LaunchConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchConfigurationName) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnAutoScalingGroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addPropertyResult("lifecycleHookSpecificationList", "LifecycleHookSpecificationList", (properties.LifecycleHookSpecificationList != null ? cfn_parse.FromCloudFormation.getArray(CfnAutoScalingGroupLifecycleHookSpecificationPropertyFromCloudFormation)(properties.LifecycleHookSpecificationList) : undefined));
  ret.addPropertyResult("loadBalancerNames", "LoadBalancerNames", (properties.LoadBalancerNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LoadBalancerNames) : undefined));
  ret.addPropertyResult("maxInstanceLifetime", "MaxInstanceLifetime", (properties.MaxInstanceLifetime != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxInstanceLifetime) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getString(properties.MaxSize) : undefined));
  ret.addPropertyResult("metricsCollection", "MetricsCollection", (properties.MetricsCollection != null ? cfn_parse.FromCloudFormation.getArray(CfnAutoScalingGroupMetricsCollectionPropertyFromCloudFormation)(properties.MetricsCollection) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getString(properties.MinSize) : undefined));
  ret.addPropertyResult("mixedInstancesPolicy", "MixedInstancesPolicy", (properties.MixedInstancesPolicy != null ? CfnAutoScalingGroupMixedInstancesPolicyPropertyFromCloudFormation(properties.MixedInstancesPolicy) : undefined));
  ret.addPropertyResult("newInstancesProtectedFromScaleIn", "NewInstancesProtectedFromScaleIn", (properties.NewInstancesProtectedFromScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NewInstancesProtectedFromScaleIn) : undefined));
  ret.addPropertyResult("notificationConfiguration", "NotificationConfiguration", (properties.NotificationConfiguration != null ? CfnAutoScalingGroupNotificationConfigurationPropertyFromCloudFormation(properties.NotificationConfiguration) : undefined));
  ret.addPropertyResult("notificationConfigurations", "NotificationConfigurations", (properties.NotificationConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnAutoScalingGroupNotificationConfigurationPropertyFromCloudFormation)(properties.NotificationConfigurations) : undefined));
  ret.addPropertyResult("placementGroup", "PlacementGroup", (properties.PlacementGroup != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementGroup) : undefined));
  ret.addPropertyResult("serviceLinkedRoleArn", "ServiceLinkedRoleARN", (properties.ServiceLinkedRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceLinkedRoleARN) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnAutoScalingGroupTagPropertyPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("targetGroupArns", "TargetGroupARNs", (properties.TargetGroupARNs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetGroupARNs) : undefined));
  ret.addPropertyResult("terminationPolicies", "TerminationPolicies", (properties.TerminationPolicies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TerminationPolicies) : undefined));
  ret.addPropertyResult("vpcZoneIdentifier", "VPCZoneIdentifier", (properties.VPCZoneIdentifier != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VPCZoneIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AutoScaling::LaunchConfiguration` resource specifies the launch configuration that can be used by an Auto Scaling group to configure Amazon EC2 instances.
 *
 * When you update the launch configuration for an Auto Scaling group, CloudFormation deletes that resource and creates a new launch configuration with the updated properties and a new name. Existing instances are not affected. To update existing instances when you update the `AWS::AutoScaling::LaunchConfiguration` resource, you can specify an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) for the group. You can find sample update policies for rolling updates in [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
 *
 * > Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a [launch template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html) or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For more information, see [Launch configurations](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html) and [Migrate AWS CloudFormation stacks from launch configurations to launch templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/migrate-launch-configurations-with-cloudformation.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::LaunchConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html
 */
export class CfnLaunchConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::LaunchConfiguration";

  /**
   * Build a CfnLaunchConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunchConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies whether to assign a public IPv4 address to the group's instances.
   */
  public associatePublicIpAddress?: boolean | cdk.IResolvable;

  /**
   * The block device mapping entries that define the block devices to attach to the instances at launch.
   */
  public blockDeviceMappings?: Array<CfnLaunchConfiguration.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Available for backward compatibility.
   */
  public classicLinkVpcId?: string;

  /**
   * Available for backward compatibility.
   */
  public classicLinkVpcSecurityGroups?: Array<string>;

  /**
   * Specifies whether the launch configuration is optimized for EBS I/O ( `true` ) or not ( `false` ).
   */
  public ebsOptimized?: boolean | cdk.IResolvable;

  /**
   * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance.
   */
  public iamInstanceProfile?: string;

  /**
   * The ID of the Amazon Machine Image (AMI) that was assigned during registration.
   */
  public imageId: string;

  /**
   * The ID of the Amazon EC2 instance to use to create the launch configuration.
   */
  public instanceId?: string;

  /**
   * Controls whether instances in this group are launched with detailed ( `true` ) or basic ( `false` ) monitoring.
   */
  public instanceMonitoring?: boolean | cdk.IResolvable;

  /**
   * Specifies the instance type of the EC2 instance.
   */
  public instanceType: string;

  /**
   * The ID of the kernel associated with the AMI.
   */
  public kernelId?: string;

  /**
   * The name of the key pair.
   */
  public keyName?: string;

  /**
   * The name of the launch configuration.
   */
  public launchConfigurationName?: string;

  /**
   * The metadata options for the instances.
   */
  public metadataOptions?: cdk.IResolvable | CfnLaunchConfiguration.MetadataOptionsProperty;

  /**
   * The tenancy of the instance, either `default` or `dedicated` .
   */
  public placementTenancy?: string;

  /**
   * The ID of the RAM disk to select.
   */
  public ramDiskId?: string;

  /**
   * A list that contains the security groups to assign to the instances in the Auto Scaling group.
   */
  public securityGroups?: Array<string>;

  /**
   * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request.
   */
  public spotPrice?: string;

  /**
   * The Base64-encoded user data to make available to the launched EC2 instances.
   */
  public userData?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchConfigurationProps) {
    super(scope, id, {
      "type": CfnLaunchConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "imageId", this);
    cdk.requireProperty(props, "instanceType", this);

    this.associatePublicIpAddress = props.associatePublicIpAddress;
    this.blockDeviceMappings = props.blockDeviceMappings;
    this.classicLinkVpcId = props.classicLinkVpcId;
    this.classicLinkVpcSecurityGroups = props.classicLinkVpcSecurityGroups;
    this.ebsOptimized = props.ebsOptimized;
    this.iamInstanceProfile = props.iamInstanceProfile;
    this.imageId = props.imageId;
    this.instanceId = props.instanceId;
    this.instanceMonitoring = props.instanceMonitoring;
    this.instanceType = props.instanceType;
    this.kernelId = props.kernelId;
    this.keyName = props.keyName;
    this.launchConfigurationName = props.launchConfigurationName;
    this.metadataOptions = props.metadataOptions;
    this.placementTenancy = props.placementTenancy;
    this.ramDiskId = props.ramDiskId;
    this.securityGroups = props.securityGroups;
    this.spotPrice = props.spotPrice;
    this.userData = props.userData;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associatePublicIpAddress": this.associatePublicIpAddress,
      "blockDeviceMappings": this.blockDeviceMappings,
      "classicLinkVpcId": this.classicLinkVpcId,
      "classicLinkVpcSecurityGroups": this.classicLinkVpcSecurityGroups,
      "ebsOptimized": this.ebsOptimized,
      "iamInstanceProfile": this.iamInstanceProfile,
      "imageId": this.imageId,
      "instanceId": this.instanceId,
      "instanceMonitoring": this.instanceMonitoring,
      "instanceType": this.instanceType,
      "kernelId": this.kernelId,
      "keyName": this.keyName,
      "launchConfigurationName": this.launchConfigurationName,
      "metadataOptions": this.metadataOptions,
      "placementTenancy": this.placementTenancy,
      "ramDiskId": this.ramDiskId,
      "securityGroups": this.securityGroups,
      "spotPrice": this.spotPrice,
      "userData": this.userData
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnLaunchConfiguration {
  /**
   * `MetadataOptions` is a property of [AWS::AutoScaling::LaunchConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html) that describes metadata options for the instances.
   *
   * For more information, see [Configure the instance metadata options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-config.html#launch-configurations-imds) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html
   */
  export interface MetadataOptionsProperty {
    /**
     * This parameter enables or disables the HTTP metadata endpoint on your instances.
     *
     * If the parameter is not specified, the default state is `enabled` .
     *
     * > If you specify a value of `disabled` , you will not be able to access your instance metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httpendpoint
     */
    readonly httpEndpoint?: string;

    /**
     * The desired HTTP PUT response hop limit for instance metadata requests.
     *
     * The larger the number, the further instance metadata requests can travel.
     *
     * Default: 1
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httpputresponsehoplimit
     */
    readonly httpPutResponseHopLimit?: number;

    /**
     * The state of token usage for your instance metadata requests.
     *
     * If the parameter is not specified in the request, the default state is `optional` .
     *
     * If the state is `optional` , you can choose to retrieve instance metadata with or without a signed token header on your request. If you retrieve the IAM role credentials without a token, the version 1.0 role credentials are returned. If you retrieve the IAM role credentials using a valid signed token, the version 2.0 role credentials are returned.
     *
     * If the state is `required` , you must send a signed token header with any instance metadata retrieval requests. In this state, retrieving the IAM role credentials always returns the version 2.0 credentials; the version 1.0 credentials are not available.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-metadataoptions.html#cfn-autoscaling-launchconfiguration-metadataoptions-httptokens
     */
    readonly httpTokens?: string;
  }

  /**
   * `BlockDeviceMapping` specifies a block device mapping for the `BlockDeviceMappings` property of the [AWS::AutoScaling::LaunchConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html) resource.
   *
   * Each instance that is launched has an associated root device volume, either an Amazon EBS volume or an instance store volume. You can use block device mappings to specify additional EBS volumes or instance store volumes to attach to an instance when it is launched.
   *
   * For more information, see [Example block device mapping](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html#block-device-mapping-ex) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html
   */
  export interface BlockDeviceMappingProperty {
    /**
     * The device name assigned to the volume (for example, `/dev/sdh` or `xvdh` ).
     *
     * For more information, see [Device naming on Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * > To define a block device mapping, set the device name and exactly one of the following properties: `Ebs` , `NoDevice` , or `VirtualName` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-devicename
     */
    readonly deviceName: string;

    /**
     * Information to attach an EBS volume to an instance at launch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-ebs
     */
    readonly ebs?: CfnLaunchConfiguration.BlockDeviceProperty | cdk.IResolvable;

    /**
     * Setting this value to `true` prevents a volume that is included in the block device mapping of the AMI from being mapped to the specified device name at launch.
     *
     * If `NoDevice` is `true` for the root device, instances might fail the EC2 health check. In that case, Amazon EC2 Auto Scaling launches replacement instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-nodevice
     */
    readonly noDevice?: boolean | cdk.IResolvable;

    /**
     * The name of the instance store volume (virtual device) to attach to an instance at launch.
     *
     * The name must be in the form ephemeral *X* where *X* is a number starting from zero (0), for example, `ephemeral0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html#cfn-autoscaling-launchconfiguration-blockdevicemapping-virtualname
     */
    readonly virtualName?: string;
  }

  /**
   * `BlockDevice` is a property of the `EBS` property of the [AWS::AutoScaling::LaunchConfiguration BlockDeviceMapping](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevicemapping.html) property type that describes an Amazon EBS volume.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html
   */
  export interface BlockDeviceProperty {
    /**
     * Indicates whether the volume is deleted on instance termination.
     *
     * For Amazon EC2 Auto Scaling, the default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-deleteontermination
     */
    readonly deleteOnTermination?: boolean | cdk.IResolvable;

    /**
     * Specifies whether the volume should be encrypted.
     *
     * Encrypted EBS volumes can only be attached to instances that support Amazon EBS encryption. For more information, see [Supported instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_supported_instances) . If your AMI uses encrypted volumes, you can also only launch it on supported instance types.
     *
     * > If you are creating a volume from a snapshot, you cannot create an unencrypted volume from an encrypted snapshot. Also, you cannot specify a KMS key ID when using a launch configuration.
     * >
     * > If you enable encryption by default, the EBS volumes that you create are always encrypted, either using the AWS managed KMS key or a customer-managed KMS key, regardless of whether the snapshot was encrypted.
     * >
     * > For more information, see [Use AWS KMS keys to encrypt Amazon EBS volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-data-protection.html#encryption) in the *Amazon EC2 Auto Scaling User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * The number of input/output (I/O) operations per second (IOPS) to provision for the volume.
     *
     * For `gp3` and `io1` volumes, this represents the number of IOPS that are provisioned for the volume. For `gp2` volumes, this represents the baseline performance of the volume and the rate at which the volume accumulates I/O credits for bursting.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-iops
     */
    readonly iops?: number;

    /**
     * The snapshot ID of the volume to use.
     *
     * You must specify either a `VolumeSize` or a `SnapshotId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-snapshotid
     */
    readonly snapshotId?: string;

    /**
     * The throughput (MiBps) to provision for a `gp3` volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-throughput
     */
    readonly throughput?: number;

    /**
     * The volume size, in GiBs. The following are the supported volumes sizes for each volume type:.
     *
     * - `gp2` and `gp3` : 1-16,384
     * - `io1` : 4-16,384
     * - `st1` and `sc1` : 125-16,384
     * - `standard` : 1-1,024
     *
     * You must specify either a `SnapshotId` or a `VolumeSize` . If you specify both `SnapshotId` and `VolumeSize` , the volume size must be equal or greater than the size of the snapshot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-volumesize
     */
    readonly volumeSize?: number;

    /**
     * The volume type.
     *
     * For more information, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * Valid values: `standard` | `io1` | `gp2` | `st1` | `sc1` | `gp3`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-volumetype
     */
    readonly volumeType?: string;
  }
}

/**
 * Properties for defining a `CfnLaunchConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html
 */
export interface CfnLaunchConfigurationProps {
  /**
   * Specifies whether to assign a public IPv4 address to the group's instances.
   *
   * If the instance is launched into a default subnet, the default is to assign a public IPv4 address, unless you disabled the option to assign a public IPv4 address on the subnet. If the instance is launched into a nondefault subnet, the default is not to assign a public IPv4 address, unless you enabled the option to assign a public IPv4 address on the subnet.
   *
   * If you specify `true` , each instance in the Auto Scaling group receives a unique public IPv4 address. For more information, see [Launching Auto Scaling instances in a VPC](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-in-vpc.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * If you specify this property, you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-associatepublicipaddress
   */
  readonly associatePublicIpAddress?: boolean | cdk.IResolvable;

  /**
   * The block device mapping entries that define the block devices to attach to the instances at launch.
   *
   * By default, the block devices specified in the block device mapping for the AMI are used. For more information, see [Block device mappings](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-blockdevicemappings
   */
  readonly blockDeviceMappings?: Array<CfnLaunchConfiguration.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Available for backward compatibility.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcid
   */
  readonly classicLinkVpcId?: string;

  /**
   * Available for backward compatibility.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-classiclinkvpcsecuritygroups
   */
  readonly classicLinkVpcSecurityGroups?: Array<string>;

  /**
   * Specifies whether the launch configuration is optimized for EBS I/O ( `true` ) or not ( `false` ).
   *
   * The optimization provides dedicated throughput to Amazon EBS and an optimized configuration stack to provide optimal I/O performance. This optimization is not available with all instance types. Additional fees are incurred when you enable EBS optimization for an instance type that is not EBS-optimized by default. For more information, see [Amazon EBS-optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * The default value is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ebsoptimized
   */
  readonly ebsOptimized?: boolean | cdk.IResolvable;

  /**
   * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance.
   *
   * The instance profile contains the IAM role. For more information, see [IAM role for applications that run on Amazon EC2 instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/us-iam-role.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-iaminstanceprofile
   */
  readonly iamInstanceProfile?: string;

  /**
   * The ID of the Amazon Machine Image (AMI) that was assigned during registration.
   *
   * For more information, see [Finding a Linux AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * If you specify `InstanceId` , an `ImageId` is not required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-imageid
   */
  readonly imageId: string;

  /**
   * The ID of the Amazon EC2 instance to use to create the launch configuration.
   *
   * When you use an instance to create a launch configuration, all properties are derived from the instance with the exception of `BlockDeviceMapping` and `AssociatePublicIpAddress` . You can override any properties from the instance by specifying them in the launch configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instanceid
   */
  readonly instanceId?: string;

  /**
   * Controls whether instances in this group are launched with detailed ( `true` ) or basic ( `false` ) monitoring.
   *
   * The default value is `true` (enabled).
   *
   * > When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes. For more information, see [Configure Monitoring for Auto Scaling Instances](https://docs.aws.amazon.com/autoscaling/latest/userguide/enable-as-instance-metrics.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancemonitoring
   */
  readonly instanceMonitoring?: boolean | cdk.IResolvable;

  /**
   * Specifies the instance type of the EC2 instance.
   *
   * For information about available instance types, see [Available instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#AvailableInstanceTypes) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * If you specify `InstanceId` , an `InstanceType` is not required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-instancetype
   */
  readonly instanceType: string;

  /**
   * The ID of the kernel associated with the AMI.
   *
   * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-kernelid
   */
  readonly kernelId?: string;

  /**
   * The name of the key pair.
   *
   * For more information, see [Amazon EC2 key pairs and Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-keyname
   */
  readonly keyName?: string;

  /**
   * The name of the launch configuration.
   *
   * This name must be unique per Region per account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-launchconfigurationname
   */
  readonly launchConfigurationName?: string;

  /**
   * The metadata options for the instances.
   *
   * For more information, see [Configuring the Instance Metadata Options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-config.html#launch-configurations-imds) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-metadataoptions
   */
  readonly metadataOptions?: cdk.IResolvable | CfnLaunchConfiguration.MetadataOptionsProperty;

  /**
   * The tenancy of the instance, either `default` or `dedicated` .
   *
   * An instance with `dedicated` tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC. To launch dedicated instances into a shared tenancy VPC (a VPC with the instance placement tenancy attribute set to `default` ), you must set the value of this property to `dedicated` . For more information, see [Configuring instance tenancy with Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-dedicated-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * If you specify `PlacementTenancy` , you must specify at least one subnet for `VPCZoneIdentifier` when you create your group.
   *
   * Valid values: `default` | `dedicated`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-placementtenancy
   */
  readonly placementTenancy?: string;

  /**
   * The ID of the RAM disk to select.
   *
   * > We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see [User provided kernels](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UserProvidedKernels.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-ramdiskid
   */
  readonly ramDiskId?: string;

  /**
   * A list that contains the security groups to assign to the instances in the Auto Scaling group.
   *
   * The list can contain both the IDs of existing security groups and references to [SecurityGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) resources created in the template.
   *
   * For more information, see [Control traffic to resources using security groups](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-securitygroups
   */
  readonly securityGroups?: Array<string>;

  /**
   * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request.
   *
   * Spot Instances are launched when the price you specify exceeds the current Spot price. For more information, see [Request Spot Instances for fault-tolerant and flexible applications](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-template-spot-instances.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Valid Range: Minimum value of 0.001
   *
   * > When you change your maximum price by creating a new launch configuration, running instances will continue to run as long as the maximum price for those running instances is higher than the current Spot price.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-spotprice
   */
  readonly spotPrice?: string;

  /**
   * The Base64-encoded user data to make available to the launched EC2 instances.
   *
   * For more information, see [Instance metadata and user data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) in the *Amazon EC2 User Guide for Linux Instances* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html#cfn-autoscaling-launchconfiguration-userdata
   */
  readonly userData?: string;
}

/**
 * Determine whether the given properties match those of a `MetadataOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchConfigurationMetadataOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpEndpoint", cdk.validateString)(properties.httpEndpoint));
  errors.collect(cdk.propertyValidator("httpPutResponseHopLimit", cdk.validateNumber)(properties.httpPutResponseHopLimit));
  errors.collect(cdk.propertyValidator("httpTokens", cdk.validateString)(properties.httpTokens));
  return errors.wrap("supplied properties not correct for \"MetadataOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchConfigurationMetadataOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchConfigurationMetadataOptionsPropertyValidator(properties).assertSuccess();
  return {
    "HttpEndpoint": cdk.stringToCloudFormation(properties.httpEndpoint),
    "HttpPutResponseHopLimit": cdk.numberToCloudFormation(properties.httpPutResponseHopLimit),
    "HttpTokens": cdk.stringToCloudFormation(properties.httpTokens)
  };
}

// @ts-ignore TS6133
function CfnLaunchConfigurationMetadataOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchConfiguration.MetadataOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchConfiguration.MetadataOptionsProperty>();
  ret.addPropertyResult("httpEndpoint", "HttpEndpoint", (properties.HttpEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.HttpEndpoint) : undefined));
  ret.addPropertyResult("httpPutResponseHopLimit", "HttpPutResponseHopLimit", (properties.HttpPutResponseHopLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.HttpPutResponseHopLimit) : undefined));
  ret.addPropertyResult("httpTokens", "HttpTokens", (properties.HttpTokens != null ? cfn_parse.FromCloudFormation.getString(properties.HttpTokens) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockDeviceProperty`
 *
 * @param properties - the TypeScript properties of a `BlockDeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchConfigurationBlockDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteOnTermination", cdk.validateBoolean)(properties.deleteOnTermination));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("snapshotId", cdk.validateString)(properties.snapshotId));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"BlockDeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchConfigurationBlockDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchConfigurationBlockDevicePropertyValidator(properties).assertSuccess();
  return {
    "DeleteOnTermination": cdk.booleanToCloudFormation(properties.deleteOnTermination),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "SnapshotId": cdk.stringToCloudFormation(properties.snapshotId),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnLaunchConfigurationBlockDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchConfiguration.BlockDeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchConfiguration.BlockDeviceProperty>();
  ret.addPropertyResult("deleteOnTermination", "DeleteOnTermination", (properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("snapshotId", "SnapshotId", (properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `BlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchConfigurationBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.requiredValidator)(properties.deviceName));
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("ebs", CfnLaunchConfigurationBlockDevicePropertyValidator)(properties.ebs));
  errors.collect(cdk.propertyValidator("noDevice", cdk.validateBoolean)(properties.noDevice));
  errors.collect(cdk.propertyValidator("virtualName", cdk.validateString)(properties.virtualName));
  return errors.wrap("supplied properties not correct for \"BlockDeviceMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchConfigurationBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchConfigurationBlockDeviceMappingPropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "Ebs": convertCfnLaunchConfigurationBlockDevicePropertyToCloudFormation(properties.ebs),
    "NoDevice": cdk.booleanToCloudFormation(properties.noDevice),
    "VirtualName": cdk.stringToCloudFormation(properties.virtualName)
  };
}

// @ts-ignore TS6133
function CfnLaunchConfigurationBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchConfiguration.BlockDeviceMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchConfiguration.BlockDeviceMappingProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("ebs", "Ebs", (properties.Ebs != null ? CfnLaunchConfigurationBlockDevicePropertyFromCloudFormation(properties.Ebs) : undefined));
  ret.addPropertyResult("noDevice", "NoDevice", (properties.NoDevice != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoDevice) : undefined));
  ret.addPropertyResult("virtualName", "VirtualName", (properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associatePublicIpAddress", cdk.validateBoolean)(properties.associatePublicIpAddress));
  errors.collect(cdk.propertyValidator("blockDeviceMappings", cdk.listValidator(CfnLaunchConfigurationBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
  errors.collect(cdk.propertyValidator("classicLinkVpcId", cdk.validateString)(properties.classicLinkVpcId));
  errors.collect(cdk.propertyValidator("classicLinkVpcSecurityGroups", cdk.listValidator(cdk.validateString))(properties.classicLinkVpcSecurityGroups));
  errors.collect(cdk.propertyValidator("ebsOptimized", cdk.validateBoolean)(properties.ebsOptimized));
  errors.collect(cdk.propertyValidator("iamInstanceProfile", cdk.validateString)(properties.iamInstanceProfile));
  errors.collect(cdk.propertyValidator("imageId", cdk.requiredValidator)(properties.imageId));
  errors.collect(cdk.propertyValidator("imageId", cdk.validateString)(properties.imageId));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("instanceMonitoring", cdk.validateBoolean)(properties.instanceMonitoring));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("kernelId", cdk.validateString)(properties.kernelId));
  errors.collect(cdk.propertyValidator("keyName", cdk.validateString)(properties.keyName));
  errors.collect(cdk.propertyValidator("launchConfigurationName", cdk.validateString)(properties.launchConfigurationName));
  errors.collect(cdk.propertyValidator("metadataOptions", CfnLaunchConfigurationMetadataOptionsPropertyValidator)(properties.metadataOptions));
  errors.collect(cdk.propertyValidator("placementTenancy", cdk.validateString)(properties.placementTenancy));
  errors.collect(cdk.propertyValidator("ramDiskId", cdk.validateString)(properties.ramDiskId));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("spotPrice", cdk.validateString)(properties.spotPrice));
  errors.collect(cdk.propertyValidator("userData", cdk.validateString)(properties.userData));
  return errors.wrap("supplied properties not correct for \"CfnLaunchConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AssociatePublicIpAddress": cdk.booleanToCloudFormation(properties.associatePublicIpAddress),
    "BlockDeviceMappings": cdk.listMapper(convertCfnLaunchConfigurationBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
    "ClassicLinkVPCId": cdk.stringToCloudFormation(properties.classicLinkVpcId),
    "ClassicLinkVPCSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.classicLinkVpcSecurityGroups),
    "EbsOptimized": cdk.booleanToCloudFormation(properties.ebsOptimized),
    "IamInstanceProfile": cdk.stringToCloudFormation(properties.iamInstanceProfile),
    "ImageId": cdk.stringToCloudFormation(properties.imageId),
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "InstanceMonitoring": cdk.booleanToCloudFormation(properties.instanceMonitoring),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "KernelId": cdk.stringToCloudFormation(properties.kernelId),
    "KeyName": cdk.stringToCloudFormation(properties.keyName),
    "LaunchConfigurationName": cdk.stringToCloudFormation(properties.launchConfigurationName),
    "MetadataOptions": convertCfnLaunchConfigurationMetadataOptionsPropertyToCloudFormation(properties.metadataOptions),
    "PlacementTenancy": cdk.stringToCloudFormation(properties.placementTenancy),
    "RamDiskId": cdk.stringToCloudFormation(properties.ramDiskId),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "SpotPrice": cdk.stringToCloudFormation(properties.spotPrice),
    "UserData": cdk.stringToCloudFormation(properties.userData)
  };
}

// @ts-ignore TS6133
function CfnLaunchConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchConfigurationProps>();
  ret.addPropertyResult("associatePublicIpAddress", "AssociatePublicIpAddress", (properties.AssociatePublicIpAddress != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AssociatePublicIpAddress) : undefined));
  ret.addPropertyResult("blockDeviceMappings", "BlockDeviceMappings", (properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchConfigurationBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined));
  ret.addPropertyResult("classicLinkVpcId", "ClassicLinkVPCId", (properties.ClassicLinkVPCId != null ? cfn_parse.FromCloudFormation.getString(properties.ClassicLinkVPCId) : undefined));
  ret.addPropertyResult("classicLinkVpcSecurityGroups", "ClassicLinkVPCSecurityGroups", (properties.ClassicLinkVPCSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClassicLinkVPCSecurityGroups) : undefined));
  ret.addPropertyResult("ebsOptimized", "EbsOptimized", (properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined));
  ret.addPropertyResult("iamInstanceProfile", "IamInstanceProfile", (properties.IamInstanceProfile != null ? cfn_parse.FromCloudFormation.getString(properties.IamInstanceProfile) : undefined));
  ret.addPropertyResult("imageId", "ImageId", (properties.ImageId != null ? cfn_parse.FromCloudFormation.getString(properties.ImageId) : undefined));
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("instanceMonitoring", "InstanceMonitoring", (properties.InstanceMonitoring != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InstanceMonitoring) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("kernelId", "KernelId", (properties.KernelId != null ? cfn_parse.FromCloudFormation.getString(properties.KernelId) : undefined));
  ret.addPropertyResult("keyName", "KeyName", (properties.KeyName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyName) : undefined));
  ret.addPropertyResult("launchConfigurationName", "LaunchConfigurationName", (properties.LaunchConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchConfigurationName) : undefined));
  ret.addPropertyResult("metadataOptions", "MetadataOptions", (properties.MetadataOptions != null ? CfnLaunchConfigurationMetadataOptionsPropertyFromCloudFormation(properties.MetadataOptions) : undefined));
  ret.addPropertyResult("placementTenancy", "PlacementTenancy", (properties.PlacementTenancy != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementTenancy) : undefined));
  ret.addPropertyResult("ramDiskId", "RamDiskId", (properties.RamDiskId != null ? cfn_parse.FromCloudFormation.getString(properties.RamDiskId) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("spotPrice", "SpotPrice", (properties.SpotPrice != null ? cfn_parse.FromCloudFormation.getString(properties.SpotPrice) : undefined));
  ret.addPropertyResult("userData", "UserData", (properties.UserData != null ? cfn_parse.FromCloudFormation.getString(properties.UserData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AutoScaling::LifecycleHook` resource specifies lifecycle hooks for an Auto Scaling group.
 *
 * These hooks let you create solutions that are aware of events in the Auto Scaling instance lifecycle, and then perform a custom action on instances when the corresponding lifecycle event occurs. A lifecycle hook provides a specified amount of time (one hour by default) to wait for the action to complete before the instance transitions to the next state.
 *
 * Use lifecycle hooks to prepare new instances for use or to delay them from being registered behind a load balancer before their configuration has been applied completely. You can also use lifecycle hooks to prepare running instances to be terminated by, for example, downloading logs or other data.
 *
 * For more information, see [Amazon EC2 Auto Scaling lifecycle hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::LifecycleHook
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html
 */
export class CfnLifecycleHook extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::LifecycleHook";

  /**
   * Build a CfnLifecycleHook from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecycleHook {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLifecycleHookPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLifecycleHook(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Auto Scaling group.
   */
  public autoScalingGroupName: string;

  /**
   * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
   */
  public defaultResult?: string;

  /**
   * The maximum time, in seconds, that can elapse before the lifecycle hook times out.
   */
  public heartbeatTimeout?: number;

  /**
   * The name of the lifecycle hook.
   */
  public lifecycleHookName?: string;

  /**
   * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
   */
  public lifecycleTransition: string;

  /**
   * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
   */
  public notificationMetadata?: string;

  /**
   * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook.
   */
  public notificationTargetArn?: string;

  /**
   * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target.
   */
  public roleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLifecycleHookProps) {
    super(scope, id, {
      "type": CfnLifecycleHook.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoScalingGroupName", this);
    cdk.requireProperty(props, "lifecycleTransition", this);

    this.autoScalingGroupName = props.autoScalingGroupName;
    this.defaultResult = props.defaultResult;
    this.heartbeatTimeout = props.heartbeatTimeout;
    this.lifecycleHookName = props.lifecycleHookName;
    this.lifecycleTransition = props.lifecycleTransition;
    this.notificationMetadata = props.notificationMetadata;
    this.notificationTargetArn = props.notificationTargetArn;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingGroupName": this.autoScalingGroupName,
      "defaultResult": this.defaultResult,
      "heartbeatTimeout": this.heartbeatTimeout,
      "lifecycleHookName": this.lifecycleHookName,
      "lifecycleTransition": this.lifecycleTransition,
      "notificationMetadata": this.notificationMetadata,
      "notificationTargetArn": this.notificationTargetArn,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLifecycleHook.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLifecycleHookPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLifecycleHook`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html
 */
export interface CfnLifecycleHookProps {
  /**
   * The name of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-autoscalinggroupname
   */
  readonly autoScalingGroupName: string;

  /**
   * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
   *
   * The default value is `ABANDON` .
   *
   * Valid values: `CONTINUE` | `ABANDON`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-defaultresult
   */
  readonly defaultResult?: string;

  /**
   * The maximum time, in seconds, that can elapse before the lifecycle hook times out.
   *
   * The range is from `30` to `7200` seconds. The default value is `3600` seconds (1 hour).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-heartbeattimeout
   */
  readonly heartbeatTimeout?: number;

  /**
   * The name of the lifecycle hook.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecyclehookname
   */
  readonly lifecycleHookName?: string;

  /**
   * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.
   *
   * - To create a lifecycle hook for scale-out events, specify `autoscaling:EC2_INSTANCE_LAUNCHING` .
   * - To create a lifecycle hook for scale-in events, specify `autoscaling:EC2_INSTANCE_TERMINATING` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-lifecycletransition
   */
  readonly lifecycleTransition: string;

  /**
   * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationmetadata
   */
  readonly notificationMetadata?: string;

  /**
   * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook.
   *
   * You can specify an Amazon SNS topic or an Amazon SQS queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-notificationtargetarn
   */
  readonly notificationTargetArn?: string;

  /**
   * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target.
   *
   * For information about creating this role, see [Configure a notification target for a lifecycle hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html#lifecycle-hook-notification-target) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-lifecyclehook.html#cfn-autoscaling-lifecyclehook-rolearn
   */
  readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLifecycleHookProps`
 *
 * @param properties - the TypeScript properties of a `CfnLifecycleHookProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecycleHookPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.requiredValidator)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.validateString)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("defaultResult", cdk.validateString)(properties.defaultResult));
  errors.collect(cdk.propertyValidator("heartbeatTimeout", cdk.validateNumber)(properties.heartbeatTimeout));
  errors.collect(cdk.propertyValidator("lifecycleHookName", cdk.validateString)(properties.lifecycleHookName));
  errors.collect(cdk.propertyValidator("lifecycleTransition", cdk.requiredValidator)(properties.lifecycleTransition));
  errors.collect(cdk.propertyValidator("lifecycleTransition", cdk.validateString)(properties.lifecycleTransition));
  errors.collect(cdk.propertyValidator("notificationMetadata", cdk.validateString)(properties.notificationMetadata));
  errors.collect(cdk.propertyValidator("notificationTargetArn", cdk.validateString)(properties.notificationTargetArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnLifecycleHookProps\"");
}

// @ts-ignore TS6133
function convertCfnLifecycleHookPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecycleHookPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupName": cdk.stringToCloudFormation(properties.autoScalingGroupName),
    "DefaultResult": cdk.stringToCloudFormation(properties.defaultResult),
    "HeartbeatTimeout": cdk.numberToCloudFormation(properties.heartbeatTimeout),
    "LifecycleHookName": cdk.stringToCloudFormation(properties.lifecycleHookName),
    "LifecycleTransition": cdk.stringToCloudFormation(properties.lifecycleTransition),
    "NotificationMetadata": cdk.stringToCloudFormation(properties.notificationMetadata),
    "NotificationTargetARN": cdk.stringToCloudFormation(properties.notificationTargetArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnLifecycleHookPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecycleHookProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecycleHookProps>();
  ret.addPropertyResult("autoScalingGroupName", "AutoScalingGroupName", (properties.AutoScalingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupName) : undefined));
  ret.addPropertyResult("defaultResult", "DefaultResult", (properties.DefaultResult != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultResult) : undefined));
  ret.addPropertyResult("heartbeatTimeout", "HeartbeatTimeout", (properties.HeartbeatTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.HeartbeatTimeout) : undefined));
  ret.addPropertyResult("lifecycleHookName", "LifecycleHookName", (properties.LifecycleHookName != null ? cfn_parse.FromCloudFormation.getString(properties.LifecycleHookName) : undefined));
  ret.addPropertyResult("lifecycleTransition", "LifecycleTransition", (properties.LifecycleTransition != null ? cfn_parse.FromCloudFormation.getString(properties.LifecycleTransition) : undefined));
  ret.addPropertyResult("notificationMetadata", "NotificationMetadata", (properties.NotificationMetadata != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationMetadata) : undefined));
  ret.addPropertyResult("notificationTargetArn", "NotificationTargetARN", (properties.NotificationTargetARN != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTargetARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AutoScaling::ScalingPolicy` resource specifies an Amazon EC2 Auto Scaling scaling policy so that the Auto Scaling group can scale the number of instances available for your application.
 *
 * For more information about using scaling policies to scale your Auto Scaling group automatically, see [Dynamic scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html) and [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::ScalingPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html
 */
export class CfnScalingPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::ScalingPolicy";

  /**
   * Build a CfnScalingPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalingPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScalingPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScalingPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of a scaling policy.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of a scaling policy.
   *
   * @cloudformationAttribute PolicyName
   */
  public readonly attrPolicyName: string;

  /**
   * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage).
   */
  public adjustmentType?: string;

  /**
   * The name of the Auto Scaling group.
   */
  public autoScalingGroupName: string;

  /**
   * A cooldown period, in seconds, that applies to a specific simple scaling policy.
   */
  public cooldown?: string;

  /**
   * *Not needed if the default instance warmup is defined for the group.*.
   */
  public estimatedInstanceWarmup?: number;

  /**
   * The aggregation type for the CloudWatch metrics.
   */
  public metricAggregationType?: string;

  /**
   * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` .
   */
  public minAdjustmentMagnitude?: number;

  /**
   * One of the following policy types:.
   */
  public policyType?: string;

  /**
   * A predictive scaling policy. Provides support for predefined and custom metrics.
   */
  public predictiveScalingConfiguration?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingConfigurationProperty;

  /**
   * The amount by which to scale, based on the specified adjustment type.
   */
  public scalingAdjustment?: number;

  /**
   * A set of adjustments that enable you to scale based on the size of the alarm breach.
   */
  public stepAdjustments?: Array<cdk.IResolvable | CfnScalingPolicy.StepAdjustmentProperty> | cdk.IResolvable;

  /**
   * A target tracking scaling policy. Provides support for predefined or custom metrics.
   */
  public targetTrackingConfiguration?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScalingPolicyProps) {
    super(scope, id, {
      "type": CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoScalingGroupName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyName = cdk.Token.asString(this.getAtt("PolicyName", cdk.ResolutionTypeHint.STRING));
    this.adjustmentType = props.adjustmentType;
    this.autoScalingGroupName = props.autoScalingGroupName;
    this.cooldown = props.cooldown;
    this.estimatedInstanceWarmup = props.estimatedInstanceWarmup;
    this.metricAggregationType = props.metricAggregationType;
    this.minAdjustmentMagnitude = props.minAdjustmentMagnitude;
    this.policyType = props.policyType;
    this.predictiveScalingConfiguration = props.predictiveScalingConfiguration;
    this.scalingAdjustment = props.scalingAdjustment;
    this.stepAdjustments = props.stepAdjustments;
    this.targetTrackingConfiguration = props.targetTrackingConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adjustmentType": this.adjustmentType,
      "autoScalingGroupName": this.autoScalingGroupName,
      "cooldown": this.cooldown,
      "estimatedInstanceWarmup": this.estimatedInstanceWarmup,
      "metricAggregationType": this.metricAggregationType,
      "minAdjustmentMagnitude": this.minAdjustmentMagnitude,
      "policyType": this.policyType,
      "predictiveScalingConfiguration": this.predictiveScalingConfiguration,
      "scalingAdjustment": this.scalingAdjustment,
      "stepAdjustments": this.stepAdjustments,
      "targetTrackingConfiguration": this.targetTrackingConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScalingPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnScalingPolicy {
  /**
   * `PredictiveScalingConfiguration` is a property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html) resource that specifies a predictive scaling policy for Amazon EC2 Auto Scaling.
   *
   * For more information, see [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html
   */
  export interface PredictiveScalingConfigurationProperty {
    /**
     * Defines the behavior that should be applied if the forecast capacity approaches or exceeds the maximum capacity of the Auto Scaling group.
     *
     * Defaults to `HonorMaxCapacity` if not specified.
     *
     * The following are possible values:
     *
     * - `HonorMaxCapacity` - Amazon EC2 Auto Scaling cannot scale out capacity higher than the maximum capacity. The maximum capacity is enforced as a hard limit.
     * - `IncreaseMaxCapacity` - Amazon EC2 Auto Scaling can scale out capacity higher than the maximum capacity when the forecast capacity is close to or exceeds the maximum capacity. The upper limit is determined by the forecasted capacity and the value for `MaxCapacityBuffer` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-maxcapacitybreachbehavior
     */
    readonly maxCapacityBreachBehavior?: string;

    /**
     * The size of the capacity buffer to use when the forecast capacity is close to or exceeds the maximum capacity.
     *
     * The value is specified as a percentage relative to the forecast capacity. For example, if the buffer is 10, this means a 10 percent buffer, such that if the forecast capacity is 50, and the maximum capacity is 40, then the effective maximum capacity is 55.
     *
     * If set to 0, Amazon EC2 Auto Scaling may scale capacity higher than the maximum capacity to equal but not exceed forecast capacity.
     *
     * Required if the `MaxCapacityBreachBehavior` property is set to `IncreaseMaxCapacity` , and cannot be used otherwise.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-maxcapacitybuffer
     */
    readonly maxCapacityBuffer?: number;

    /**
     * This structure includes the metrics and target utilization to use for predictive scaling.
     *
     * This is an array, but we currently only support a single metric specification. That is, you can specify a target value and a single metric pair, or a target value and one scaling metric and one load metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-metricspecifications
     */
    readonly metricSpecifications: Array<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingMetricSpecificationProperty> | cdk.IResolvable;

    /**
     * The predictive scaling mode.
     *
     * Defaults to `ForecastOnly` if not specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-mode
     */
    readonly mode?: string;

    /**
     * The amount of time, in seconds, by which the instance launch time can be advanced.
     *
     * For example, the forecast says to add capacity at 10:00 AM, and you choose to pre-launch instances by 5 minutes. In that case, the instances will be launched at 9:55 AM. The intention is to give resources time to be provisioned. It can take a few minutes to launch an EC2 instance. The actual amount of time required depends on several factors, such as the size of the instance and whether there are startup scripts to complete.
     *
     * The value must be less than the forecast interval duration of 3600 seconds (60 minutes). Defaults to 300 seconds if not specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingconfiguration.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration-schedulingbuffertime
     */
    readonly schedulingBufferTime?: number;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html
   */
  export interface PredictiveScalingMetricSpecificationProperty {
    /**
     * The customized capacity metric specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedcapacitymetricspecification
     */
    readonly customizedCapacityMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedCapacityMetricProperty;

    /**
     * The customized load metric specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedloadmetricspecification
     */
    readonly customizedLoadMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedLoadMetricProperty;

    /**
     * The customized scaling metric specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-customizedscalingmetricspecification
     */
    readonly customizedScalingMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedScalingMetricProperty;

    /**
     * The predefined load metric specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedloadmetricspecification
     */
    readonly predefinedLoadMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedLoadMetricProperty;

    /**
     * The predefined metric pair specification from which Amazon EC2 Auto Scaling determines the appropriate scaling metric and load metric to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedmetricpairspecification
     */
    readonly predefinedMetricPairSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedMetricPairProperty;

    /**
     * The predefined scaling metric specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-predefinedscalingmetricspecification
     */
    readonly predefinedScalingMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedScalingMetricProperty;

    /**
     * Specifies the target utilization.
     *
     * > Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html#cfn-autoscaling-scalingpolicy-predictivescalingmetricspecification-targetvalue
     */
    readonly targetValue: number;
  }

  /**
   * Contains load metric information for the `CustomizedLoadMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric.html
   */
  export interface PredictiveScalingCustomizedLoadMetricProperty {
    /**
     * One or more metric data queries to provide the data points for a load metric.
     *
     * Use multiple metric data queries only if you are performing a math expression on returned data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedloadmetric-metricdataqueries
     */
    readonly metricDataQueries: Array<cdk.IResolvable | CfnScalingPolicy.MetricDataQueryProperty> | cdk.IResolvable;
  }

  /**
   * The metric data to return.
   *
   * Also defines whether this call is returning data for one metric only, or whether it is performing a math expression on the values of returned metric statistics to create a new time series. A time series is a series of data points, each of which is associated with a timestamp.
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html
   */
  export interface MetricDataQueryProperty {
    /**
     * The math expression to perform on the returned data, if this object is performing a math expression.
     *
     * This expression can use the `Id` of the other metrics to refer to those metrics, and can also use the `Id` of other expressions to use the result of those expressions.
     *
     * Conditional: Within each `MetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-expression
     */
    readonly expression?: string;

    /**
     * A short name that identifies the object's results in the response.
     *
     * This name must be unique among all `MetricDataQuery` objects specified for a single scaling policy. If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscores. The first character must be a lowercase letter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-id
     */
    readonly id: string;

    /**
     * A human-readable label for this metric or expression.
     *
     * This is especially useful if this is a math expression, so that you know what the value represents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-label
     */
    readonly label?: string;

    /**
     * Information about the metric data to return.
     *
     * Conditional: Within each `MetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-metricstat
     */
    readonly metricStat?: cdk.IResolvable | CfnScalingPolicy.MetricStatProperty;

    /**
     * Indicates whether to return the timestamps and raw data values of this metric.
     *
     * If you use any math expressions, specify `true` for this value for only the final math expression that the metric specification is based on. You must specify `false` for `ReturnData` for all the other metrics and expressions used in the metric specification.
     *
     * If you are only retrieving metrics and not performing any math expressions, do not specify anything for `ReturnData` . This sets it to its default ( `true` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html#cfn-autoscaling-scalingpolicy-metricdataquery-returndata
     */
    readonly returnData?: boolean | cdk.IResolvable;
  }

  /**
   * `MetricStat` is a property of the [AWS::AutoScaling::ScalingPolicy MetricDataQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdataquery.html) property type.
   *
   * This structure defines the CloudWatch metric to return, along with the statistic and unit.
   *
   * For more information about the CloudWatch terminology below, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) in the *Amazon CloudWatch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html
   */
  export interface MetricStatProperty {
    /**
     * The CloudWatch metric to return, including the metric name, namespace, and dimensions.
     *
     * To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-metric
     */
    readonly metric: cdk.IResolvable | CfnScalingPolicy.MetricProperty;

    /**
     * The statistic to return.
     *
     * It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in [Statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Statistic) in the *Amazon CloudWatch User Guide* .
     *
     * The most commonly used metrics for predictive scaling are `Average` and `Sum` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-stat
     */
    readonly stat: string;

    /**
     * The unit to use for the returned data points.
     *
     * For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html#cfn-autoscaling-scalingpolicy-metricstat-unit
     */
    readonly unit?: string;
  }

  /**
   * Represents a specific metric.
   *
   * `Metric` is a property of the [AWS::AutoScaling::ScalingPolicy MetricStat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricstat.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html
   */
  export interface MetricProperty {
    /**
     * The dimensions for the metric.
     *
     * For the list of available dimensions, see the AWS documentation available from the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
     *
     * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnScalingPolicy.MetricDimensionProperty> | cdk.IResolvable;

    /**
     * The name of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-metricname
     */
    readonly metricName: string;

    /**
     * The namespace of the metric.
     *
     * For more information, see the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metric.html#cfn-autoscaling-scalingpolicy-metric-namespace
     */
    readonly namespace: string;
  }

  /**
   * `MetricDimension` specifies a name/value pair that is part of the identity of a CloudWatch metric for the `Dimensions` property of the [AWS::AutoScaling::ScalingPolicy CustomizedMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html) property type. Duplicate dimensions are not allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * The name of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html#cfn-autoscaling-scalingpolicy-metricdimension-name
     */
    readonly name: string;

    /**
     * The value of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-metricdimension.html#cfn-autoscaling-scalingpolicy-metricdimension-value
     */
    readonly value: string;
  }

  /**
   * Contains load metric information for the `PredefinedLoadMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * > Does not apply to policies that use a *metric pair* for the metric specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html
   */
  export interface PredictiveScalingPredefinedLoadMetricProperty {
    /**
     * The metric type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric-predefinedmetrictype
     */
    readonly predefinedMetricType: string;

    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the request count served by your Auto Scaling group.
     *
     * You can't specify a resource label unless the target group is attached to the Auto Scaling group.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedloadmetric-resourcelabel
     */
    readonly resourceLabel?: string;
  }

  /**
   * Contains scaling metric information for the `PredefinedScalingMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * > Does not apply to policies that use a *metric pair* for the metric specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html
   */
  export interface PredictiveScalingPredefinedScalingMetricProperty {
    /**
     * The metric type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric-predefinedmetrictype
     */
    readonly predefinedMetricType: string;

    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group.
     *
     * You can't specify a resource label unless the target group is attached to the Auto Scaling group.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedscalingmetric-resourcelabel
     */
    readonly resourceLabel?: string;
  }

  /**
   * Contains capacity metric information for the `CustomizedCapacityMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric.html
   */
  export interface PredictiveScalingCustomizedCapacityMetricProperty {
    /**
     * One or more metric data queries to provide the data points for a capacity metric.
     *
     * Use multiple metric data queries only if you are performing a math expression on returned data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedcapacitymetric-metricdataqueries
     */
    readonly metricDataQueries: Array<cdk.IResolvable | CfnScalingPolicy.MetricDataQueryProperty> | cdk.IResolvable;
  }

  /**
   * Contains scaling metric information for the `CustomizedScalingMetricSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric.html
   */
  export interface PredictiveScalingCustomizedScalingMetricProperty {
    /**
     * One or more metric data queries to provide the data points for a scaling metric.
     *
     * Use multiple metric data queries only if you are performing a math expression on returned data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric.html#cfn-autoscaling-scalingpolicy-predictivescalingcustomizedscalingmetric-metricdataqueries
     */
    readonly metricDataQueries: Array<cdk.IResolvable | CfnScalingPolicy.MetricDataQueryProperty> | cdk.IResolvable;
  }

  /**
   * Contains metric pair information for the `PredefinedMetricPairSpecification` property of the [AWS::AutoScaling::ScalingPolicy PredictiveScalingMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingmetricspecification.html) property type.
   *
   * For more information, see [Predictive scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html
   */
  export interface PredictiveScalingPredefinedMetricPairProperty {
    /**
     * Indicates which metrics to use.
     *
     * There are two different types of metrics for each metric type: one is a load metric and one is a scaling metric. For example, if the metric type is `ASGCPUUtilization` , the Auto Scaling group's total CPU metric is used as the load metric, and the average CPU metric is used for the scaling metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair-predefinedmetrictype
     */
    readonly predefinedMetricType: string;

    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the total and average request count served by your Auto Scaling group.
     *
     * You can't specify a resource label unless the target group is attached to the Auto Scaling group.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair.html#cfn-autoscaling-scalingpolicy-predictivescalingpredefinedmetricpair-resourcelabel
     */
    readonly resourceLabel?: string;
  }

  /**
   * `StepAdjustment` specifies a step adjustment for the `StepAdjustments` property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html) resource.
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
   * You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#aws-resource-autoscaling-scalingpolicy--examples) section of the `AWS::AutoScaling::ScalingPolicy` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html
   */
  export interface StepAdjustmentProperty {
    /**
     * The lower bound for the difference between the alarm threshold and the CloudWatch metric.
     *
     * If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound). Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound). A null value indicates negative infinity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervallowerbound
     */
    readonly metricIntervalLowerBound?: number;

    /**
     * The upper bound for the difference between the alarm threshold and the CloudWatch metric.
     *
     * If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound). A null value indicates positive infinity.
     *
     * The upper bound must be greater than the lower bound.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervalupperbound
     */
    readonly metricIntervalUpperBound?: number;

    /**
     * The amount by which to scale, based on the specified adjustment type.
     *
     * A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a non-negative value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustment.html#cfn-autoscaling-scalingpolicy-stepadjustment-scalingadjustment
     */
    readonly scalingAdjustment: number;
  }

  /**
   * `TargetTrackingConfiguration` is a property of the [AWS::AutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html) resource that specifies a target tracking scaling policy configuration for Amazon EC2 Auto Scaling.
   *
   * For more information about scaling policies, see [Dynamic scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html
   */
  export interface TargetTrackingConfigurationProperty {
    /**
     * A customized metric.
     *
     * You must specify either a predefined metric or a customized metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-customizedmetricspecification
     */
    readonly customizedMetricSpecification?: CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable;

    /**
     * Indicates whether scaling in by the target tracking scaling policy is disabled.
     *
     * If scaling in is disabled, the target tracking scaling policy doesn't remove instances from the Auto Scaling group. Otherwise, the target tracking scaling policy can remove instances from the Auto Scaling group. The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-disablescalein
     */
    readonly disableScaleIn?: boolean | cdk.IResolvable;

    /**
     * A predefined metric.
     *
     * You must specify either a predefined metric or a customized metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-predefinedmetricspecification
     */
    readonly predefinedMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredefinedMetricSpecificationProperty;

    /**
     * The target value for the metric.
     *
     * > Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-targetvalue
     */
    readonly targetValue: number;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html
   */
  export interface CustomizedMetricSpecificationProperty {
    /**
     * The dimensions of the metric.
     *
     * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnScalingPolicy.MetricDimensionProperty> | cdk.IResolvable;

    /**
     * The name of the metric.
     *
     * To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-metricname
     */
    readonly metricName: string;

    /**
     * The namespace of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-namespace
     */
    readonly namespace: string;

    /**
     * The statistic of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-statistic
     */
    readonly statistic: string;

    /**
     * The unit of the metric.
     *
     * For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-unit
     */
    readonly unit?: string;
  }

  /**
   * Contains predefined metric specification information for a target tracking scaling policy for Amazon EC2 Auto Scaling.
   *
   * `PredefinedMetricSpecification` is a property of the [AWS::AutoScaling::ScalingPolicy TargetTrackingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html
   */
  export interface PredefinedMetricSpecificationProperty {
    /**
     * The metric type. The following predefined metrics are available:.
     *
     * - `ASGAverageCPUUtilization` - Average CPU utilization of the Auto Scaling group.
     * - `ASGAverageNetworkIn` - Average number of bytes received on all network interfaces by the Auto Scaling group.
     * - `ASGAverageNetworkOut` - Average number of bytes sent out on all network interfaces by the Auto Scaling group.
     * - `ALBRequestCountPerTarget` - Average Application Load Balancer request count per target for your Auto Scaling group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype
     */
    readonly predefinedMetricType: string;

    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group.
     *
     * You can't specify a resource label unless the target group is attached to the Auto Scaling group.
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel
     */
    readonly resourceLabel?: string;
  }
}

/**
 * Properties for defining a `CfnScalingPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html
 */
export interface CfnScalingPolicyProps {
  /**
   * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage).
   *
   * The valid values are `ChangeInCapacity` , `ExactCapacity` , and `PercentChangeInCapacity` .
   *
   * Required if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-adjustmenttype
   */
  readonly adjustmentType?: string;

  /**
   * The name of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-autoscalinggroupname
   */
  readonly autoScalingGroupName: string;

  /**
   * A cooldown period, in seconds, that applies to a specific simple scaling policy.
   *
   * When a cooldown period is specified here, it overrides the default cooldown.
   *
   * Valid only if the policy type is `SimpleScaling` . For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * Default: None
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-cooldown
   */
  readonly cooldown?: string;

  /**
   * *Not needed if the default instance warmup is defined for the group.*.
   *
   * The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics. This warm-up period applies to instances launched due to a specific target tracking or step scaling policy. When a warm-up period is specified here, it overrides the default instance warmup.
   *
   * Valid only if the policy type is `TargetTrackingScaling` or `StepScaling` .
   *
   * > The default is to use the value for the default instance warmup defined for the group. If default instance warmup is null, then `EstimatedInstanceWarmup` falls back to the value of default cooldown.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-estimatedinstancewarmup
   */
  readonly estimatedInstanceWarmup?: number;

  /**
   * The aggregation type for the CloudWatch metrics.
   *
   * The valid values are `Minimum` , `Maximum` , and `Average` . If the aggregation type is null, the value is treated as `Average` .
   *
   * Valid only if the policy type is `StepScaling` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-metricaggregationtype
   */
  readonly metricAggregationType?: string;

  /**
   * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` .
   *
   * For example, suppose that you create a step scaling policy to scale out an Auto Scaling group by 25 percent and you specify a `MinAdjustmentMagnitude` of 2. If the group has 4 instances and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a `MinAdjustmentMagnitude` of 2, Amazon EC2 Auto Scaling scales out the group by 2 instances.
   *
   * Valid only if the policy type is `StepScaling` or `SimpleScaling` . For more information, see [Scaling adjustment types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#as-scaling-adjustment) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * > Some Auto Scaling groups use instance weights. In this case, set the `MinAdjustmentMagnitude` to a value that is at least as large as your largest instance weight.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-minadjustmentmagnitude
   */
  readonly minAdjustmentMagnitude?: number;

  /**
   * One of the following policy types:.
   *
   * - `TargetTrackingScaling`
   * - `StepScaling`
   * - `SimpleScaling` (default)
   * - `PredictiveScaling`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-policytype
   */
  readonly policyType?: string;

  /**
   * A predictive scaling policy. Provides support for predefined and custom metrics.
   *
   * Predefined metrics include CPU utilization, network in/out, and the Application Load Balancer request count.
   *
   * Required if the policy type is `PredictiveScaling` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-predictivescalingconfiguration
   */
  readonly predictiveScalingConfiguration?: cdk.IResolvable | CfnScalingPolicy.PredictiveScalingConfigurationProperty;

  /**
   * The amount by which to scale, based on the specified adjustment type.
   *
   * A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a non-negative value.
   *
   * Required if the policy type is `SimpleScaling` . (Not used with any other policy type.)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-scalingadjustment
   */
  readonly scalingAdjustment?: number;

  /**
   * A set of adjustments that enable you to scale based on the size of the alarm breach.
   *
   * Required if the policy type is `StepScaling` . (Not used with any other policy type.)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-stepadjustments
   */
  readonly stepAdjustments?: Array<cdk.IResolvable | CfnScalingPolicy.StepAdjustmentProperty> | cdk.IResolvable;

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scalingpolicy.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration
   */
  readonly targetTrackingConfiguration?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricDimensionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnScalingPolicyMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"MetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyMetricPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnScalingPolicyMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.MetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricStatProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyMetricStatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metric", cdk.requiredValidator)(properties.metric));
  errors.collect(cdk.propertyValidator("metric", CfnScalingPolicyMetricPropertyValidator)(properties.metric));
  errors.collect(cdk.propertyValidator("stat", cdk.requiredValidator)(properties.stat));
  errors.collect(cdk.propertyValidator("stat", cdk.validateString)(properties.stat));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"MetricStatProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyMetricStatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyMetricStatPropertyValidator(properties).assertSuccess();
  return {
    "Metric": convertCfnScalingPolicyMetricPropertyToCloudFormation(properties.metric),
    "Stat": cdk.stringToCloudFormation(properties.stat),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricStatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.MetricStatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricStatProperty>();
  ret.addPropertyResult("metric", "Metric", (properties.Metric != null ? CfnScalingPolicyMetricPropertyFromCloudFormation(properties.Metric) : undefined));
  ret.addPropertyResult("stat", "Stat", (properties.Stat != null ? cfn_parse.FromCloudFormation.getString(properties.Stat) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDataQueryProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDataQueryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyMetricDataQueryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("label", cdk.validateString)(properties.label));
  errors.collect(cdk.propertyValidator("metricStat", CfnScalingPolicyMetricStatPropertyValidator)(properties.metricStat));
  errors.collect(cdk.propertyValidator("returnData", cdk.validateBoolean)(properties.returnData));
  return errors.wrap("supplied properties not correct for \"MetricDataQueryProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyMetricDataQueryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyMetricDataQueryPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Label": cdk.stringToCloudFormation(properties.label),
    "MetricStat": convertCfnScalingPolicyMetricStatPropertyToCloudFormation(properties.metricStat),
    "ReturnData": cdk.booleanToCloudFormation(properties.returnData)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricDataQueryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.MetricDataQueryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricDataQueryProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("label", "Label", (properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined));
  ret.addPropertyResult("metricStat", "MetricStat", (properties.MetricStat != null ? CfnScalingPolicyMetricStatPropertyFromCloudFormation(properties.MetricStat) : undefined));
  ret.addPropertyResult("returnData", "ReturnData", (properties.ReturnData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReturnData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingCustomizedLoadMetricProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingCustomizedLoadMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.requiredValidator)(properties.metricDataQueries));
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.listValidator(CfnScalingPolicyMetricDataQueryPropertyValidator))(properties.metricDataQueries));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingCustomizedLoadMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyValidator(properties).assertSuccess();
  return {
    "MetricDataQueries": cdk.listMapper(convertCfnScalingPolicyMetricDataQueryPropertyToCloudFormation)(properties.metricDataQueries)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedLoadMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingCustomizedLoadMetricProperty>();
  ret.addPropertyResult("metricDataQueries", "MetricDataQueries", (properties.MetricDataQueries != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDataQueryPropertyFromCloudFormation)(properties.MetricDataQueries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingPredefinedLoadMetricProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingPredefinedLoadMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.requiredValidator)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.validateString)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("resourceLabel", cdk.validateString)(properties.resourceLabel));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingPredefinedLoadMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyValidator(properties).assertSuccess();
  return {
    "PredefinedMetricType": cdk.stringToCloudFormation(properties.predefinedMetricType),
    "ResourceLabel": cdk.stringToCloudFormation(properties.resourceLabel)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedLoadMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingPredefinedLoadMetricProperty>();
  ret.addPropertyResult("predefinedMetricType", "PredefinedMetricType", (properties.PredefinedMetricType != null ? cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType) : undefined));
  ret.addPropertyResult("resourceLabel", "ResourceLabel", (properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingPredefinedScalingMetricProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingPredefinedScalingMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.requiredValidator)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.validateString)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("resourceLabel", cdk.validateString)(properties.resourceLabel));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingPredefinedScalingMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyValidator(properties).assertSuccess();
  return {
    "PredefinedMetricType": cdk.stringToCloudFormation(properties.predefinedMetricType),
    "ResourceLabel": cdk.stringToCloudFormation(properties.resourceLabel)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedScalingMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingPredefinedScalingMetricProperty>();
  ret.addPropertyResult("predefinedMetricType", "PredefinedMetricType", (properties.PredefinedMetricType != null ? cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType) : undefined));
  ret.addPropertyResult("resourceLabel", "ResourceLabel", (properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingCustomizedCapacityMetricProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingCustomizedCapacityMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.requiredValidator)(properties.metricDataQueries));
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.listValidator(CfnScalingPolicyMetricDataQueryPropertyValidator))(properties.metricDataQueries));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingCustomizedCapacityMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyValidator(properties).assertSuccess();
  return {
    "MetricDataQueries": cdk.listMapper(convertCfnScalingPolicyMetricDataQueryPropertyToCloudFormation)(properties.metricDataQueries)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedCapacityMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingCustomizedCapacityMetricProperty>();
  ret.addPropertyResult("metricDataQueries", "MetricDataQueries", (properties.MetricDataQueries != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDataQueryPropertyFromCloudFormation)(properties.MetricDataQueries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingCustomizedScalingMetricProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingCustomizedScalingMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.requiredValidator)(properties.metricDataQueries));
  errors.collect(cdk.propertyValidator("metricDataQueries", cdk.listValidator(CfnScalingPolicyMetricDataQueryPropertyValidator))(properties.metricDataQueries));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingCustomizedScalingMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyValidator(properties).assertSuccess();
  return {
    "MetricDataQueries": cdk.listMapper(convertCfnScalingPolicyMetricDataQueryPropertyToCloudFormation)(properties.metricDataQueries)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingCustomizedScalingMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingCustomizedScalingMetricProperty>();
  ret.addPropertyResult("metricDataQueries", "MetricDataQueries", (properties.MetricDataQueries != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDataQueryPropertyFromCloudFormation)(properties.MetricDataQueries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingPredefinedMetricPairProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingPredefinedMetricPairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.requiredValidator)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.validateString)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("resourceLabel", cdk.validateString)(properties.resourceLabel));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingPredefinedMetricPairProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyValidator(properties).assertSuccess();
  return {
    "PredefinedMetricType": cdk.stringToCloudFormation(properties.predefinedMetricType),
    "ResourceLabel": cdk.stringToCloudFormation(properties.resourceLabel)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingPredefinedMetricPairProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingPredefinedMetricPairProperty>();
  ret.addPropertyResult("predefinedMetricType", "PredefinedMetricType", (properties.PredefinedMetricType != null ? cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType) : undefined));
  ret.addPropertyResult("resourceLabel", "ResourceLabel", (properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customizedCapacityMetricSpecification", CfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyValidator)(properties.customizedCapacityMetricSpecification));
  errors.collect(cdk.propertyValidator("customizedLoadMetricSpecification", CfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyValidator)(properties.customizedLoadMetricSpecification));
  errors.collect(cdk.propertyValidator("customizedScalingMetricSpecification", CfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyValidator)(properties.customizedScalingMetricSpecification));
  errors.collect(cdk.propertyValidator("predefinedLoadMetricSpecification", CfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyValidator)(properties.predefinedLoadMetricSpecification));
  errors.collect(cdk.propertyValidator("predefinedMetricPairSpecification", CfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyValidator)(properties.predefinedMetricPairSpecification));
  errors.collect(cdk.propertyValidator("predefinedScalingMetricSpecification", CfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyValidator)(properties.predefinedScalingMetricSpecification));
  errors.collect(cdk.propertyValidator("targetValue", cdk.requiredValidator)(properties.targetValue));
  errors.collect(cdk.propertyValidator("targetValue", cdk.validateNumber)(properties.targetValue));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingMetricSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingMetricSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingMetricSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "CustomizedCapacityMetricSpecification": convertCfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyToCloudFormation(properties.customizedCapacityMetricSpecification),
    "CustomizedLoadMetricSpecification": convertCfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyToCloudFormation(properties.customizedLoadMetricSpecification),
    "CustomizedScalingMetricSpecification": convertCfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyToCloudFormation(properties.customizedScalingMetricSpecification),
    "PredefinedLoadMetricSpecification": convertCfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyToCloudFormation(properties.predefinedLoadMetricSpecification),
    "PredefinedMetricPairSpecification": convertCfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyToCloudFormation(properties.predefinedMetricPairSpecification),
    "PredefinedScalingMetricSpecification": convertCfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyToCloudFormation(properties.predefinedScalingMetricSpecification),
    "TargetValue": cdk.numberToCloudFormation(properties.targetValue)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingMetricSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingMetricSpecificationProperty>();
  ret.addPropertyResult("customizedCapacityMetricSpecification", "CustomizedCapacityMetricSpecification", (properties.CustomizedCapacityMetricSpecification != null ? CfnScalingPolicyPredictiveScalingCustomizedCapacityMetricPropertyFromCloudFormation(properties.CustomizedCapacityMetricSpecification) : undefined));
  ret.addPropertyResult("customizedLoadMetricSpecification", "CustomizedLoadMetricSpecification", (properties.CustomizedLoadMetricSpecification != null ? CfnScalingPolicyPredictiveScalingCustomizedLoadMetricPropertyFromCloudFormation(properties.CustomizedLoadMetricSpecification) : undefined));
  ret.addPropertyResult("customizedScalingMetricSpecification", "CustomizedScalingMetricSpecification", (properties.CustomizedScalingMetricSpecification != null ? CfnScalingPolicyPredictiveScalingCustomizedScalingMetricPropertyFromCloudFormation(properties.CustomizedScalingMetricSpecification) : undefined));
  ret.addPropertyResult("predefinedLoadMetricSpecification", "PredefinedLoadMetricSpecification", (properties.PredefinedLoadMetricSpecification != null ? CfnScalingPolicyPredictiveScalingPredefinedLoadMetricPropertyFromCloudFormation(properties.PredefinedLoadMetricSpecification) : undefined));
  ret.addPropertyResult("predefinedMetricPairSpecification", "PredefinedMetricPairSpecification", (properties.PredefinedMetricPairSpecification != null ? CfnScalingPolicyPredictiveScalingPredefinedMetricPairPropertyFromCloudFormation(properties.PredefinedMetricPairSpecification) : undefined));
  ret.addPropertyResult("predefinedScalingMetricSpecification", "PredefinedScalingMetricSpecification", (properties.PredefinedScalingMetricSpecification != null ? CfnScalingPolicyPredictiveScalingPredefinedScalingMetricPropertyFromCloudFormation(properties.PredefinedScalingMetricSpecification) : undefined));
  ret.addPropertyResult("targetValue", "TargetValue", (properties.TargetValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveScalingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveScalingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacityBreachBehavior", cdk.validateString)(properties.maxCapacityBreachBehavior));
  errors.collect(cdk.propertyValidator("maxCapacityBuffer", cdk.validateNumber)(properties.maxCapacityBuffer));
  errors.collect(cdk.propertyValidator("metricSpecifications", cdk.requiredValidator)(properties.metricSpecifications));
  errors.collect(cdk.propertyValidator("metricSpecifications", cdk.listValidator(CfnScalingPolicyPredictiveScalingMetricSpecificationPropertyValidator))(properties.metricSpecifications));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("schedulingBufferTime", cdk.validateNumber)(properties.schedulingBufferTime));
  return errors.wrap("supplied properties not correct for \"PredictiveScalingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredictiveScalingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredictiveScalingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacityBreachBehavior": cdk.stringToCloudFormation(properties.maxCapacityBreachBehavior),
    "MaxCapacityBuffer": cdk.numberToCloudFormation(properties.maxCapacityBuffer),
    "MetricSpecifications": cdk.listMapper(convertCfnScalingPolicyPredictiveScalingMetricSpecificationPropertyToCloudFormation)(properties.metricSpecifications),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "SchedulingBufferTime": cdk.numberToCloudFormation(properties.schedulingBufferTime)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredictiveScalingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredictiveScalingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredictiveScalingConfigurationProperty>();
  ret.addPropertyResult("maxCapacityBreachBehavior", "MaxCapacityBreachBehavior", (properties.MaxCapacityBreachBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.MaxCapacityBreachBehavior) : undefined));
  ret.addPropertyResult("maxCapacityBuffer", "MaxCapacityBuffer", (properties.MaxCapacityBuffer != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacityBuffer) : undefined));
  ret.addPropertyResult("metricSpecifications", "MetricSpecifications", (properties.MetricSpecifications != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyPredictiveScalingMetricSpecificationPropertyFromCloudFormation)(properties.MetricSpecifications) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("schedulingBufferTime", "SchedulingBufferTime", (properties.SchedulingBufferTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.SchedulingBufferTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StepAdjustmentProperty`
 *
 * @param properties - the TypeScript properties of a `StepAdjustmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyStepAdjustmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricIntervalLowerBound", cdk.validateNumber)(properties.metricIntervalLowerBound));
  errors.collect(cdk.propertyValidator("metricIntervalUpperBound", cdk.validateNumber)(properties.metricIntervalUpperBound));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.requiredValidator)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  return errors.wrap("supplied properties not correct for \"StepAdjustmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyStepAdjustmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyStepAdjustmentPropertyValidator(properties).assertSuccess();
  return {
    "MetricIntervalLowerBound": cdk.numberToCloudFormation(properties.metricIntervalLowerBound),
    "MetricIntervalUpperBound": cdk.numberToCloudFormation(properties.metricIntervalUpperBound),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.StepAdjustmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.StepAdjustmentProperty>();
  ret.addPropertyResult("metricIntervalLowerBound", "MetricIntervalLowerBound", (properties.MetricIntervalLowerBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalLowerBound) : undefined));
  ret.addPropertyResult("metricIntervalUpperBound", "MetricIntervalUpperBound", (properties.MetricIntervalUpperBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalUpperBound) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomizedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomizedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnScalingPolicyMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("statistic", cdk.requiredValidator)(properties.statistic));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"CustomizedMetricSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnScalingPolicyMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Statistic": cdk.stringToCloudFormation(properties.statistic),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.CustomizedMetricSpecificationProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredefinedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PredefinedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.requiredValidator)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.validateString)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("resourceLabel", cdk.validateString)(properties.resourceLabel));
  return errors.wrap("supplied properties not correct for \"PredefinedMetricSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "PredefinedMetricType": cdk.stringToCloudFormation(properties.predefinedMetricType),
    "ResourceLabel": cdk.stringToCloudFormation(properties.resourceLabel)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredefinedMetricSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredefinedMetricSpecificationProperty>();
  ret.addPropertyResult("predefinedMetricType", "PredefinedMetricType", (properties.PredefinedMetricType != null ? cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType) : undefined));
  ret.addPropertyResult("resourceLabel", "ResourceLabel", (properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customizedMetricSpecification", CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator)(properties.customizedMetricSpecification));
  errors.collect(cdk.propertyValidator("disableScaleIn", cdk.validateBoolean)(properties.disableScaleIn));
  errors.collect(cdk.propertyValidator("predefinedMetricSpecification", CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator)(properties.predefinedMetricSpecification));
  errors.collect(cdk.propertyValidator("targetValue", cdk.requiredValidator)(properties.targetValue));
  errors.collect(cdk.propertyValidator("targetValue", cdk.validateNumber)(properties.targetValue));
  return errors.wrap("supplied properties not correct for \"TargetTrackingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CustomizedMetricSpecification": convertCfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties.customizedMetricSpecification),
    "DisableScaleIn": cdk.booleanToCloudFormation(properties.disableScaleIn),
    "PredefinedMetricSpecification": convertCfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties.predefinedMetricSpecification),
    "TargetValue": cdk.numberToCloudFormation(properties.targetValue)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingConfigurationProperty>();
  ret.addPropertyResult("customizedMetricSpecification", "CustomizedMetricSpecification", (properties.CustomizedMetricSpecification != null ? CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties.CustomizedMetricSpecification) : undefined));
  ret.addPropertyResult("disableScaleIn", "DisableScaleIn", (properties.DisableScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableScaleIn) : undefined));
  ret.addPropertyResult("predefinedMetricSpecification", "PredefinedMetricSpecification", (properties.PredefinedMetricSpecification != null ? CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties.PredefinedMetricSpecification) : undefined));
  ret.addPropertyResult("targetValue", "TargetValue", (properties.TargetValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScalingPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnScalingPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adjustmentType", cdk.validateString)(properties.adjustmentType));
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.requiredValidator)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.validateString)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("cooldown", cdk.validateString)(properties.cooldown));
  errors.collect(cdk.propertyValidator("estimatedInstanceWarmup", cdk.validateNumber)(properties.estimatedInstanceWarmup));
  errors.collect(cdk.propertyValidator("metricAggregationType", cdk.validateString)(properties.metricAggregationType));
  errors.collect(cdk.propertyValidator("minAdjustmentMagnitude", cdk.validateNumber)(properties.minAdjustmentMagnitude));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  errors.collect(cdk.propertyValidator("predictiveScalingConfiguration", CfnScalingPolicyPredictiveScalingConfigurationPropertyValidator)(properties.predictiveScalingConfiguration));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("stepAdjustments", cdk.listValidator(CfnScalingPolicyStepAdjustmentPropertyValidator))(properties.stepAdjustments));
  errors.collect(cdk.propertyValidator("targetTrackingConfiguration", CfnScalingPolicyTargetTrackingConfigurationPropertyValidator)(properties.targetTrackingConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnScalingPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPropsValidator(properties).assertSuccess();
  return {
    "AdjustmentType": cdk.stringToCloudFormation(properties.adjustmentType),
    "AutoScalingGroupName": cdk.stringToCloudFormation(properties.autoScalingGroupName),
    "Cooldown": cdk.stringToCloudFormation(properties.cooldown),
    "EstimatedInstanceWarmup": cdk.numberToCloudFormation(properties.estimatedInstanceWarmup),
    "MetricAggregationType": cdk.stringToCloudFormation(properties.metricAggregationType),
    "MinAdjustmentMagnitude": cdk.numberToCloudFormation(properties.minAdjustmentMagnitude),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType),
    "PredictiveScalingConfiguration": convertCfnScalingPolicyPredictiveScalingConfigurationPropertyToCloudFormation(properties.predictiveScalingConfiguration),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment),
    "StepAdjustments": cdk.listMapper(convertCfnScalingPolicyStepAdjustmentPropertyToCloudFormation)(properties.stepAdjustments),
    "TargetTrackingConfiguration": convertCfnScalingPolicyTargetTrackingConfigurationPropertyToCloudFormation(properties.targetTrackingConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicyProps>();
  ret.addPropertyResult("adjustmentType", "AdjustmentType", (properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined));
  ret.addPropertyResult("autoScalingGroupName", "AutoScalingGroupName", (properties.AutoScalingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupName) : undefined));
  ret.addPropertyResult("cooldown", "Cooldown", (properties.Cooldown != null ? cfn_parse.FromCloudFormation.getString(properties.Cooldown) : undefined));
  ret.addPropertyResult("estimatedInstanceWarmup", "EstimatedInstanceWarmup", (properties.EstimatedInstanceWarmup != null ? cfn_parse.FromCloudFormation.getNumber(properties.EstimatedInstanceWarmup) : undefined));
  ret.addPropertyResult("metricAggregationType", "MetricAggregationType", (properties.MetricAggregationType != null ? cfn_parse.FromCloudFormation.getString(properties.MetricAggregationType) : undefined));
  ret.addPropertyResult("minAdjustmentMagnitude", "MinAdjustmentMagnitude", (properties.MinAdjustmentMagnitude != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinAdjustmentMagnitude) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addPropertyResult("predictiveScalingConfiguration", "PredictiveScalingConfiguration", (properties.PredictiveScalingConfiguration != null ? CfnScalingPolicyPredictiveScalingConfigurationPropertyFromCloudFormation(properties.PredictiveScalingConfiguration) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addPropertyResult("stepAdjustments", "StepAdjustments", (properties.StepAdjustments != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation)(properties.StepAdjustments) : undefined));
  ret.addPropertyResult("targetTrackingConfiguration", "TargetTrackingConfiguration", (properties.TargetTrackingConfiguration != null ? CfnScalingPolicyTargetTrackingConfigurationPropertyFromCloudFormation(properties.TargetTrackingConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AutoScaling::ScheduledAction` resource specifies an Amazon EC2 Auto Scaling scheduled action so that the Auto Scaling group can change the number of instances available for your application in response to predictable load changes.
 *
 * When you update a stack with an Auto Scaling group and scheduled action, CloudFormation always sets the min size, max size, and desired capacity properties of your group to the values that are defined in the `AWS::AutoScaling::AutoScalingGroup` section of your template. However, you might not want CloudFormation to do that when you have a scheduled action in effect. You can use an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) to prevent CloudFormation from changing the min size, max size, or desired capacity property values during a stack update unless you modified the individual values in your template. If you have rolling updates enabled, before you can update the Auto Scaling group, you must suspend scheduled actions by specifying an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) for the Auto Scaling group. You can find a sample update policy for rolling updates in [Auto scaling template snippets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-autoscaling.html) .
 *
 * For more information, see [Scheduled scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/schedule_time.html) and [Suspending and resuming scaling processes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-suspend-resume-processes.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::AutoScaling::ScheduledAction
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html
 */
export class CfnScheduledAction extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::ScheduledAction";

  /**
   * Build a CfnScheduledAction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledAction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScheduledActionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScheduledAction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the name of a scheduled action.
   *
   * @cloudformationAttribute ScheduledActionName
   */
  public readonly attrScheduledActionName: string;

  /**
   * The name of the Auto Scaling group.
   */
  public autoScalingGroupName: string;

  /**
   * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain.
   */
  public desiredCapacity?: number;

  /**
   * The date and time for the recurring schedule to end, in UTC.
   */
  public endTime?: string;

  /**
   * The maximum size of the Auto Scaling group.
   */
  public maxSize?: number;

  /**
   * The minimum size of the Auto Scaling group.
   */
  public minSize?: number;

  /**
   * The recurring schedule for this action.
   */
  public recurrence?: string;

  /**
   * The date and time for this action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, `"2021-06-01T00:00:00Z"` ).
   */
  public startTime?: string;

  /**
   * Specifies the time zone for a cron expression.
   */
  public timeZone?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduledActionProps) {
    super(scope, id, {
      "type": CfnScheduledAction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoScalingGroupName", this);

    this.attrScheduledActionName = cdk.Token.asString(this.getAtt("ScheduledActionName", cdk.ResolutionTypeHint.STRING));
    this.autoScalingGroupName = props.autoScalingGroupName;
    this.desiredCapacity = props.desiredCapacity;
    this.endTime = props.endTime;
    this.maxSize = props.maxSize;
    this.minSize = props.minSize;
    this.recurrence = props.recurrence;
    this.startTime = props.startTime;
    this.timeZone = props.timeZone;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingGroupName": this.autoScalingGroupName,
      "desiredCapacity": this.desiredCapacity,
      "endTime": this.endTime,
      "maxSize": this.maxSize,
      "minSize": this.minSize,
      "recurrence": this.recurrence,
      "startTime": this.startTime,
      "timeZone": this.timeZone
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduledAction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScheduledActionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnScheduledAction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html
 */
export interface CfnScheduledActionProps {
  /**
   * The name of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-autoscalinggroupname
   */
  readonly autoScalingGroupName: string;

  /**
   * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain.
   *
   * It can scale beyond this capacity if you add more scaling conditions.
   *
   * > You must specify at least one of the following properties: `MaxSize` , `MinSize` , or `DesiredCapacity` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-desiredcapacity
   */
  readonly desiredCapacity?: number;

  /**
   * The date and time for the recurring schedule to end, in UTC.
   *
   * For example, `"2021-06-01T00:00:00Z"` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-endtime
   */
  readonly endTime?: string;

  /**
   * The maximum size of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-maxsize
   */
  readonly maxSize?: number;

  /**
   * The minimum size of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-minsize
   */
  readonly minSize?: number;

  /**
   * The recurring schedule for this action.
   *
   * This format consists of five fields separated by white spaces: [Minute] [Hour] [Day_of_Month] [Month_of_Year] [Day_of_Week]. The value must be in quotes (for example, `"30 0 1 1,6,12 *"` ). For more information about this format, see [Crontab](https://docs.aws.amazon.com/http://crontab.org) .
   *
   * When `StartTime` and `EndTime` are specified with `Recurrence` , they form the boundaries of when the recurring action starts and stops.
   *
   * Cron expressions use Universal Coordinated Time (UTC) by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-recurrence
   */
  readonly recurrence?: string;

  /**
   * The date and time for this action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, `"2021-06-01T00:00:00Z"` ).
   *
   * If you specify `Recurrence` and `StartTime` , Amazon EC2 Auto Scaling performs the action at this time, and then performs the action based on the specified recurrence.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-starttime
   */
  readonly startTime?: string;

  /**
   * Specifies the time zone for a cron expression.
   *
   * If a time zone is not provided, UTC is used by default.
   *
   * Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as `Etc/GMT+9` or `Pacific/Tahiti` ). For more information, see [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-scheduledaction.html#cfn-autoscaling-scheduledaction-timezone
   */
  readonly timeZone?: string;
}

/**
 * Determine whether the given properties match those of a `CfnScheduledActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduledActionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.requiredValidator)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.validateString)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("desiredCapacity", cdk.validateNumber)(properties.desiredCapacity));
  errors.collect(cdk.propertyValidator("endTime", cdk.validateString)(properties.endTime));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  errors.collect(cdk.propertyValidator("recurrence", cdk.validateString)(properties.recurrence));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  return errors.wrap("supplied properties not correct for \"CfnScheduledActionProps\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupName": cdk.stringToCloudFormation(properties.autoScalingGroupName),
    "DesiredCapacity": cdk.numberToCloudFormation(properties.desiredCapacity),
    "EndTime": cdk.stringToCloudFormation(properties.endTime),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MinSize": cdk.numberToCloudFormation(properties.minSize),
    "Recurrence": cdk.stringToCloudFormation(properties.recurrence),
    "StartTime": cdk.stringToCloudFormation(properties.startTime),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledActionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledActionProps>();
  ret.addPropertyResult("autoScalingGroupName", "AutoScalingGroupName", (properties.AutoScalingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupName) : undefined));
  ret.addPropertyResult("desiredCapacity", "DesiredCapacity", (properties.DesiredCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredCapacity) : undefined));
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? cfn_parse.FromCloudFormation.getString(properties.EndTime) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addPropertyResult("recurrence", "Recurrence", (properties.Recurrence != null ? cfn_parse.FromCloudFormation.getString(properties.Recurrence) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AutoScaling::WarmPool` resource creates a pool of pre-initialized EC2 instances that sits alongside the Auto Scaling group.
 *
 * Whenever your application needs to scale out, the Auto Scaling group can draw on the warm pool to meet its new desired capacity.
 *
 * When you create a warm pool, you can define a minimum size. When your Auto Scaling group scales out and the size of the warm pool shrinks, Amazon EC2 Auto Scaling launches new instances into the warm pool to maintain its minimum size.
 *
 * For more information, see [Warm pools for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) in the *Amazon EC2 Auto Scaling User Guide* .
 *
 * > CloudFormation supports the `UpdatePolicy` attribute for Auto Scaling groups. During an update, if `UpdatePolicy` is set to `AutoScalingRollingUpdate` , CloudFormation replaces `InService` instances only. Instances in the warm pool are not replaced. The difference in which instances are replaced can potentially result in different instance configurations after the stack update completes. If `UpdatePolicy` is set to `AutoScalingReplacingUpdate` , you do not encounter this issue because CloudFormation replaces both the Auto Scaling group and the warm pool.
 *
 * @cloudformationResource AWS::AutoScaling::WarmPool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html
 */
export class CfnWarmPool extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AutoScaling::WarmPool";

  /**
   * Build a CfnWarmPool from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWarmPool {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWarmPoolPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWarmPool(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Auto Scaling group.
   */
  public autoScalingGroupName: string;

  /**
   * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in.
   */
  public instanceReusePolicy?: CfnWarmPool.InstanceReusePolicyProperty | cdk.IResolvable;

  /**
   * Specifies the maximum number of instances that are allowed to be in the warm pool or in any state except `Terminated` for the Auto Scaling group.
   */
  public maxGroupPreparedCapacity?: number;

  /**
   * Specifies the minimum number of instances to maintain in the warm pool.
   */
  public minSize?: number;

  /**
   * Sets the instance state to transition to after the lifecycle actions are complete.
   */
  public poolState?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWarmPoolProps) {
    super(scope, id, {
      "type": CfnWarmPool.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoScalingGroupName", this);

    this.autoScalingGroupName = props.autoScalingGroupName;
    this.instanceReusePolicy = props.instanceReusePolicy;
    this.maxGroupPreparedCapacity = props.maxGroupPreparedCapacity;
    this.minSize = props.minSize;
    this.poolState = props.poolState;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingGroupName": this.autoScalingGroupName,
      "instanceReusePolicy": this.instanceReusePolicy,
      "maxGroupPreparedCapacity": this.maxGroupPreparedCapacity,
      "minSize": this.minSize,
      "poolState": this.poolState
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWarmPool.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWarmPoolPropsToCloudFormation(props);
  }
}

export namespace CfnWarmPool {
  /**
   * A structure that specifies an instance reuse policy for the `InstanceReusePolicy` property of the [AWS::AutoScaling::WarmPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html) resource.
   *
   * For more information, see [Warm pools for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) in the *Amazon EC2 Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-warmpool-instancereusepolicy.html
   */
  export interface InstanceReusePolicyProperty {
    /**
     * Specifies whether instances in the Auto Scaling group can be returned to the warm pool on scale in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-warmpool-instancereusepolicy.html#cfn-autoscaling-warmpool-instancereusepolicy-reuseonscalein
     */
    readonly reuseOnScaleIn?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnWarmPool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html
 */
export interface CfnWarmPoolProps {
  /**
   * The name of the Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-autoscalinggroupname
   */
  readonly autoScalingGroupName: string;

  /**
   * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in.
   *
   * The default is to terminate instances in the Auto Scaling group when the group scales in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-instancereusepolicy
   */
  readonly instanceReusePolicy?: CfnWarmPool.InstanceReusePolicyProperty | cdk.IResolvable;

  /**
   * Specifies the maximum number of instances that are allowed to be in the warm pool or in any state except `Terminated` for the Auto Scaling group.
   *
   * This is an optional property. Specify it only if you do not want the warm pool size to be determined by the difference between the group's maximum capacity and its desired capacity.
   *
   * > If a value for `MaxGroupPreparedCapacity` is not specified, Amazon EC2 Auto Scaling launches and maintains the difference between the group's maximum capacity and its desired capacity. If you specify a value for `MaxGroupPreparedCapacity` , Amazon EC2 Auto Scaling uses the difference between the `MaxGroupPreparedCapacity` and the desired capacity instead.
   * >
   * > The size of the warm pool is dynamic. Only when `MaxGroupPreparedCapacity` and `MinSize` are set to the same value does the warm pool have an absolute size.
   *
   * If the desired capacity of the Auto Scaling group is higher than the `MaxGroupPreparedCapacity` , the capacity of the warm pool is 0, unless you specify a value for `MinSize` . To remove a value that you previously set, include the property but specify -1 for the value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-maxgrouppreparedcapacity
   */
  readonly maxGroupPreparedCapacity?: number;

  /**
   * Specifies the minimum number of instances to maintain in the warm pool.
   *
   * This helps you to ensure that there is always a certain number of warmed instances available to handle traffic spikes. Defaults to 0 if not specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-minsize
   */
  readonly minSize?: number;

  /**
   * Sets the instance state to transition to after the lifecycle actions are complete.
   *
   * Default is `Stopped` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-warmpool.html#cfn-autoscaling-warmpool-poolstate
   */
  readonly poolState?: string;
}

/**
 * Determine whether the given properties match those of a `InstanceReusePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceReusePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWarmPoolInstanceReusePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reuseOnScaleIn", cdk.validateBoolean)(properties.reuseOnScaleIn));
  return errors.wrap("supplied properties not correct for \"InstanceReusePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWarmPoolInstanceReusePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWarmPoolInstanceReusePolicyPropertyValidator(properties).assertSuccess();
  return {
    "ReuseOnScaleIn": cdk.booleanToCloudFormation(properties.reuseOnScaleIn)
  };
}

// @ts-ignore TS6133
function CfnWarmPoolInstanceReusePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWarmPool.InstanceReusePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWarmPool.InstanceReusePolicyProperty>();
  ret.addPropertyResult("reuseOnScaleIn", "ReuseOnScaleIn", (properties.ReuseOnScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReuseOnScaleIn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWarmPoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnWarmPoolProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWarmPoolPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.requiredValidator)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("autoScalingGroupName", cdk.validateString)(properties.autoScalingGroupName));
  errors.collect(cdk.propertyValidator("instanceReusePolicy", CfnWarmPoolInstanceReusePolicyPropertyValidator)(properties.instanceReusePolicy));
  errors.collect(cdk.propertyValidator("maxGroupPreparedCapacity", cdk.validateNumber)(properties.maxGroupPreparedCapacity));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  errors.collect(cdk.propertyValidator("poolState", cdk.validateString)(properties.poolState));
  return errors.wrap("supplied properties not correct for \"CfnWarmPoolProps\"");
}

// @ts-ignore TS6133
function convertCfnWarmPoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWarmPoolPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupName": cdk.stringToCloudFormation(properties.autoScalingGroupName),
    "InstanceReusePolicy": convertCfnWarmPoolInstanceReusePolicyPropertyToCloudFormation(properties.instanceReusePolicy),
    "MaxGroupPreparedCapacity": cdk.numberToCloudFormation(properties.maxGroupPreparedCapacity),
    "MinSize": cdk.numberToCloudFormation(properties.minSize),
    "PoolState": cdk.stringToCloudFormation(properties.poolState)
  };
}

// @ts-ignore TS6133
function CfnWarmPoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWarmPoolProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWarmPoolProps>();
  ret.addPropertyResult("autoScalingGroupName", "AutoScalingGroupName", (properties.AutoScalingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupName) : undefined));
  ret.addPropertyResult("instanceReusePolicy", "InstanceReusePolicy", (properties.InstanceReusePolicy != null ? CfnWarmPoolInstanceReusePolicyPropertyFromCloudFormation(properties.InstanceReusePolicy) : undefined));
  ret.addPropertyResult("maxGroupPreparedCapacity", "MaxGroupPreparedCapacity", (properties.MaxGroupPreparedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxGroupPreparedCapacity) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addPropertyResult("poolState", "PoolState", (properties.PoolState != null ? cfn_parse.FromCloudFormation.getString(properties.PoolState) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}