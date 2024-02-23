/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new capacity provider.
 *
 * Capacity providers are associated with an Amazon ECS cluster and are used in capacity provider strategies to facilitate cluster auto scaling.
 *
 * Only capacity providers that use an Auto Scaling group can be created. Amazon ECS tasks on AWS Fargate use the `FARGATE` and `FARGATE_SPOT` capacity providers. These providers are available to all accounts in the AWS Regions that AWS Fargate supports.
 *
 * @cloudformationResource AWS::ECS::CapacityProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-capacityprovider.html
 */
export class CfnCapacityProvider extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::CapacityProvider";

  /**
   * Build a CfnCapacityProvider from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCapacityProvider {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCapacityProviderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCapacityProvider(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Auto Scaling group settings for the capacity provider.
   */
  public autoScalingGroupProvider: CfnCapacityProvider.AutoScalingGroupProviderProperty | cdk.IResolvable;

  /**
   * The name of the capacity provider.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the capacity provider to help you categorize and organize it.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCapacityProviderProps) {
    super(scope, id, {
      "type": CfnCapacityProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoScalingGroupProvider", this);

    this.autoScalingGroupProvider = props.autoScalingGroupProvider;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECS::CapacityProvider", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingGroupProvider": this.autoScalingGroupProvider,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCapacityProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCapacityProviderPropsToCloudFormation(props);
  }
}

export namespace CfnCapacityProvider {
  /**
   * The details of the Auto Scaling group for the capacity provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-autoscalinggroupprovider.html
   */
  export interface AutoScalingGroupProviderProperty {
    /**
     * The Amazon Resource Name (ARN) that identifies the Auto Scaling group, or the Auto Scaling group name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-autoscalinggroupprovider.html#cfn-ecs-capacityprovider-autoscalinggroupprovider-autoscalinggrouparn
     */
    readonly autoScalingGroupArn: string;

    /**
     * The managed draining option for the Auto Scaling group capacity provider.
     *
     * When you enable this, Amazon ECS manages and gracefully drains the EC2 container instances that are in the Auto Scaling group capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-autoscalinggroupprovider.html#cfn-ecs-capacityprovider-autoscalinggroupprovider-manageddraining
     */
    readonly managedDraining?: string;

    /**
     * The managed scaling settings for the Auto Scaling group capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-autoscalinggroupprovider.html#cfn-ecs-capacityprovider-autoscalinggroupprovider-managedscaling
     */
    readonly managedScaling?: cdk.IResolvable | CfnCapacityProvider.ManagedScalingProperty;

    /**
     * The managed termination protection setting to use for the Auto Scaling group capacity provider.
     *
     * This determines whether the Auto Scaling group has managed termination protection. The default is off.
     *
     * > When using managed termination protection, managed scaling must also be used otherwise managed termination protection doesn't work.
     *
     * When managed termination protection is on, Amazon ECS prevents the Amazon EC2 instances in an Auto Scaling group that contain tasks from being terminated during a scale-in action. The Auto Scaling group and each instance in the Auto Scaling group must have instance protection from scale-in actions on as well. For more information, see [Instance Protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-termination.html#instance-protection) in the *AWS Auto Scaling User Guide* .
     *
     * When managed termination protection is off, your Amazon EC2 instances aren't protected from termination when the Auto Scaling group scales in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-autoscalinggroupprovider.html#cfn-ecs-capacityprovider-autoscalinggroupprovider-managedterminationprotection
     */
    readonly managedTerminationProtection?: string;
  }

  /**
   * The managed scaling settings for the Auto Scaling group capacity provider.
   *
   * When managed scaling is turned on, Amazon ECS manages the scale-in and scale-out actions of the Auto Scaling group. Amazon ECS manages a target tracking scaling policy using an Amazon ECS managed CloudWatch metric with the specified `targetCapacity` value as the target value for the metric. For more information, see [Using managed scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/asg-capacity-providers.html#asg-capacity-providers-managed-scaling) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * If managed scaling is off, the user must manage the scaling of the Auto Scaling group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html
   */
  export interface ManagedScalingProperty {
    /**
     * The period of time, in seconds, after a newly launched Amazon EC2 instance can contribute to CloudWatch metrics for Auto Scaling group.
     *
     * If this parameter is omitted, the default value of `300` seconds is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html#cfn-ecs-capacityprovider-managedscaling-instancewarmupperiod
     */
    readonly instanceWarmupPeriod?: number;

    /**
     * The maximum number of Amazon EC2 instances that Amazon ECS will scale out at one time.
     *
     * The scale in process is not affected by this parameter. If this parameter is omitted, the default value of `10000` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html#cfn-ecs-capacityprovider-managedscaling-maximumscalingstepsize
     */
    readonly maximumScalingStepSize?: number;

    /**
     * The minimum number of Amazon EC2 instances that Amazon ECS will scale out at one time.
     *
     * The scale in process is not affected by this parameter If this parameter is omitted, the default value of `1` is used.
     *
     * When additional capacity is required, Amazon ECS will scale up the minimum scaling step size even if the actual demand is less than the minimum scaling step size.
     *
     * If you use a capacity provider with an Auto Scaling group configured with more than one Amazon EC2 instance type or Availability Zone, Amazon ECS will scale up by the exact minimum scaling step size value and will ignore both the maximum scaling step size as well as the capacity demand.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html#cfn-ecs-capacityprovider-managedscaling-minimumscalingstepsize
     */
    readonly minimumScalingStepSize?: number;

    /**
     * Determines whether to use managed scaling for the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html#cfn-ecs-capacityprovider-managedscaling-status
     */
    readonly status?: string;

    /**
     * The target capacity utilization as a percentage for the capacity provider.
     *
     * The specified value must be greater than `0` and less than or equal to `100` . For example, if you want the capacity provider to maintain 10% spare capacity, then that means the utilization is 90%, so use a `targetCapacity` of `90` . The default value of `100` percent results in the Amazon EC2 instances in your Auto Scaling group being completely used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-capacityprovider-managedscaling.html#cfn-ecs-capacityprovider-managedscaling-targetcapacity
     */
    readonly targetCapacity?: number;
  }
}

/**
 * Properties for defining a `CfnCapacityProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-capacityprovider.html
 */
export interface CfnCapacityProviderProps {
  /**
   * The Auto Scaling group settings for the capacity provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-capacityprovider.html#cfn-ecs-capacityprovider-autoscalinggroupprovider
   */
  readonly autoScalingGroupProvider: CfnCapacityProvider.AutoScalingGroupProviderProperty | cdk.IResolvable;

  /**
   * The name of the capacity provider.
   *
   * If a name is specified, it cannot start with `aws` , `ecs` , or `fargate` . If no name is specified, a default name in the `CFNStackName-CFNResourceName-RandomString` format is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-capacityprovider.html#cfn-ecs-capacityprovider-name
   */
  readonly name?: string;

  /**
   * The metadata that you apply to the capacity provider to help you categorize and organize it.
   *
   * Each tag consists of a key and an optional value. You define both.
   *
   * The following basic restrictions apply to tags:
   *
   * - Maximum number of tags per resource - 50
   * - For each resource, each tag key must be unique, and each tag key can have only one value.
   * - Maximum key length - 128 Unicode characters in UTF-8
   * - Maximum value length - 256 Unicode characters in UTF-8
   * - If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
   * - Tag keys and values are case-sensitive.
   * - Do not use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You cannot edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-capacityprovider.html#cfn-ecs-capacityprovider-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ManagedScalingProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedScalingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityProviderManagedScalingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceWarmupPeriod", cdk.validateNumber)(properties.instanceWarmupPeriod));
  errors.collect(cdk.propertyValidator("maximumScalingStepSize", cdk.validateNumber)(properties.maximumScalingStepSize));
  errors.collect(cdk.propertyValidator("minimumScalingStepSize", cdk.validateNumber)(properties.minimumScalingStepSize));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("targetCapacity", cdk.validateNumber)(properties.targetCapacity));
  return errors.wrap("supplied properties not correct for \"ManagedScalingProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapacityProviderManagedScalingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityProviderManagedScalingPropertyValidator(properties).assertSuccess();
  return {
    "InstanceWarmupPeriod": cdk.numberToCloudFormation(properties.instanceWarmupPeriod),
    "MaximumScalingStepSize": cdk.numberToCloudFormation(properties.maximumScalingStepSize),
    "MinimumScalingStepSize": cdk.numberToCloudFormation(properties.minimumScalingStepSize),
    "Status": cdk.stringToCloudFormation(properties.status),
    "TargetCapacity": cdk.numberToCloudFormation(properties.targetCapacity)
  };
}

// @ts-ignore TS6133
function CfnCapacityProviderManagedScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCapacityProvider.ManagedScalingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityProvider.ManagedScalingProperty>();
  ret.addPropertyResult("instanceWarmupPeriod", "InstanceWarmupPeriod", (properties.InstanceWarmupPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceWarmupPeriod) : undefined));
  ret.addPropertyResult("maximumScalingStepSize", "MaximumScalingStepSize", (properties.MaximumScalingStepSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumScalingStepSize) : undefined));
  ret.addPropertyResult("minimumScalingStepSize", "MinimumScalingStepSize", (properties.MinimumScalingStepSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumScalingStepSize) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("targetCapacity", "TargetCapacity", (properties.TargetCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingGroupProviderProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingGroupProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityProviderAutoScalingGroupProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupArn", cdk.requiredValidator)(properties.autoScalingGroupArn));
  errors.collect(cdk.propertyValidator("autoScalingGroupArn", cdk.validateString)(properties.autoScalingGroupArn));
  errors.collect(cdk.propertyValidator("managedDraining", cdk.validateString)(properties.managedDraining));
  errors.collect(cdk.propertyValidator("managedScaling", CfnCapacityProviderManagedScalingPropertyValidator)(properties.managedScaling));
  errors.collect(cdk.propertyValidator("managedTerminationProtection", cdk.validateString)(properties.managedTerminationProtection));
  return errors.wrap("supplied properties not correct for \"AutoScalingGroupProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapacityProviderAutoScalingGroupProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityProviderAutoScalingGroupProviderPropertyValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupArn": cdk.stringToCloudFormation(properties.autoScalingGroupArn),
    "ManagedDraining": cdk.stringToCloudFormation(properties.managedDraining),
    "ManagedScaling": convertCfnCapacityProviderManagedScalingPropertyToCloudFormation(properties.managedScaling),
    "ManagedTerminationProtection": cdk.stringToCloudFormation(properties.managedTerminationProtection)
  };
}

// @ts-ignore TS6133
function CfnCapacityProviderAutoScalingGroupProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapacityProvider.AutoScalingGroupProviderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityProvider.AutoScalingGroupProviderProperty>();
  ret.addPropertyResult("autoScalingGroupArn", "AutoScalingGroupArn", (properties.AutoScalingGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingGroupArn) : undefined));
  ret.addPropertyResult("managedDraining", "ManagedDraining", (properties.ManagedDraining != null ? cfn_parse.FromCloudFormation.getString(properties.ManagedDraining) : undefined));
  ret.addPropertyResult("managedScaling", "ManagedScaling", (properties.ManagedScaling != null ? CfnCapacityProviderManagedScalingPropertyFromCloudFormation(properties.ManagedScaling) : undefined));
  ret.addPropertyResult("managedTerminationProtection", "ManagedTerminationProtection", (properties.ManagedTerminationProtection != null ? cfn_parse.FromCloudFormation.getString(properties.ManagedTerminationProtection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCapacityProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnCapacityProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingGroupProvider", cdk.requiredValidator)(properties.autoScalingGroupProvider));
  errors.collect(cdk.propertyValidator("autoScalingGroupProvider", CfnCapacityProviderAutoScalingGroupProviderPropertyValidator)(properties.autoScalingGroupProvider));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCapacityProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnCapacityProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityProviderPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingGroupProvider": convertCfnCapacityProviderAutoScalingGroupProviderPropertyToCloudFormation(properties.autoScalingGroupProvider),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCapacityProviderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapacityProviderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityProviderProps>();
  ret.addPropertyResult("autoScalingGroupProvider", "AutoScalingGroupProvider", (properties.AutoScalingGroupProvider != null ? CfnCapacityProviderAutoScalingGroupProviderPropertyFromCloudFormation(properties.AutoScalingGroupProvider) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECS::Cluster` resource creates an Amazon Elastic Container Service (Amazon ECS) cluster.
 *
 * @cloudformationResource AWS::ECS::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::Cluster";

  /**
   * Build a CfnCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Amazon ECS cluster, such as `arn:aws:ecs:us-east-2:123456789012:cluster/MyECSCluster` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The short name of one or more capacity providers to associate with the cluster.
   */
  public capacityProviders?: Array<string>;

  /**
   * A user-generated string that you use to identify your cluster.
   */
  public clusterName?: string;

  /**
   * The settings to use when creating a cluster.
   */
  public clusterSettings?: Array<CfnCluster.ClusterSettingsProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The execute command configuration for the cluster.
   */
  public configuration?: CfnCluster.ClusterConfigurationProperty | cdk.IResolvable;

  /**
   * The default capacity provider strategy for the cluster.
   */
  public defaultCapacityProviderStrategy?: Array<CfnCluster.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Use this parameter to set a default Service Connect namespace.
   */
  public serviceConnectDefaults?: cdk.IResolvable | CfnCluster.ServiceConnectDefaultsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the cluster to help you categorize and organize them.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterProps = {}) {
    super(scope, id, {
      "type": CfnCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.capacityProviders = props.capacityProviders;
    this.clusterName = props.clusterName;
    this.clusterSettings = props.clusterSettings;
    this.configuration = props.configuration;
    this.defaultCapacityProviderStrategy = props.defaultCapacityProviderStrategy;
    this.serviceConnectDefaults = props.serviceConnectDefaults;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECS::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityProviders": this.capacityProviders,
      "clusterName": this.clusterName,
      "clusterSettings": this.clusterSettings,
      "configuration": this.configuration,
      "defaultCapacityProviderStrategy": this.defaultCapacityProviderStrategy,
      "serviceConnectDefaults": this.serviceConnectDefaults,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPropsToCloudFormation(props);
  }
}

export namespace CfnCluster {
  /**
   * The settings to use when creating a cluster.
   *
   * This parameter is used to turn on CloudWatch Container Insights for a cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clustersettings.html
   */
  export interface ClusterSettingsProperty {
    /**
     * The name of the cluster setting.
     *
     * The value is `containerInsights` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clustersettings.html#cfn-ecs-cluster-clustersettings-name
     */
    readonly name?: string;

    /**
     * The value to set for the cluster setting. The supported values are `enabled` and `disabled` .
     *
     * If you set `name` to `containerInsights` and `value` to `enabled` , CloudWatch Container Insights will be on for the cluster, otherwise it will be off unless the `containerInsights` account setting is turned on. If a cluster value is specified, it will override the `containerInsights` value set with [PutAccountSetting](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PutAccountSetting.html) or [PutAccountSettingDefault](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PutAccountSettingDefault.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clustersettings.html#cfn-ecs-cluster-clustersettings-value
     */
    readonly value?: string;
  }

  /**
   * The `CapacityProviderStrategyItem` property specifies the details of the default capacity provider strategy for the cluster.
   *
   * When services or tasks are run in the cluster with no launch type or capacity provider strategy specified, the default capacity provider strategy is used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-capacityproviderstrategyitem.html
   */
  export interface CapacityProviderStrategyItemProperty {
    /**
     * The *base* value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a *base* defined. If no value is specified, the default value of `0` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-capacityproviderstrategyitem.html#cfn-ecs-cluster-capacityproviderstrategyitem-base
     */
    readonly base?: number;

    /**
     * The short name of the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-capacityproviderstrategyitem.html#cfn-ecs-cluster-capacityproviderstrategyitem-capacityprovider
     */
    readonly capacityProvider?: string;

    /**
     * The *weight* value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
     *
     * The `weight` value is taken into consideration after the `base` value, if defined, is satisfied.
     *
     * If no `weight` value is specified, the default value of `0` is used. When multiple capacity providers are specified within a capacity provider strategy, at least one of the capacity providers must have a weight value greater than zero and any capacity providers with a weight of `0` can't be used to place tasks. If you specify multiple capacity providers in a strategy that all have a weight of `0` , any `RunTask` or `CreateService` actions using the capacity provider strategy will fail.
     *
     * An example scenario for using weights is defining a strategy that contains two capacity providers and both have a weight of `1` , then when the `base` is satisfied, the tasks will be split evenly across the two capacity providers. Using that same logic, if you specify a weight of `1` for *capacityProviderA* and a weight of `4` for *capacityProviderB* , then for every one task that's run using *capacityProviderA* , four tasks would use *capacityProviderB* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-capacityproviderstrategyitem.html#cfn-ecs-cluster-capacityproviderstrategyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * The execute command configuration for the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clusterconfiguration.html
   */
  export interface ClusterConfigurationProperty {
    /**
     * The details of the execute command configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clusterconfiguration.html#cfn-ecs-cluster-clusterconfiguration-executecommandconfiguration
     */
    readonly executeCommandConfiguration?: CfnCluster.ExecuteCommandConfigurationProperty | cdk.IResolvable;
  }

  /**
   * The details of the execute command configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html
   */
  export interface ExecuteCommandConfigurationProperty {
    /**
     * Specify an AWS Key Management Service key ID to encrypt the data between the local client and the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html#cfn-ecs-cluster-executecommandconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The log configuration for the results of the execute command actions.
     *
     * The logs can be sent to CloudWatch Logs or an Amazon S3 bucket. When `logging=OVERRIDE` is specified, a `logConfiguration` must be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html#cfn-ecs-cluster-executecommandconfiguration-logconfiguration
     */
    readonly logConfiguration?: CfnCluster.ExecuteCommandLogConfigurationProperty | cdk.IResolvable;

    /**
     * The log setting to use for redirecting logs for your execute command results. The following log settings are available.
     *
     * - `NONE` : The execute command session is not logged.
     * - `DEFAULT` : The `awslogs` configuration in the task definition is used. If no logging parameter is specified, it defaults to this value. If no `awslogs` log driver is configured in the task definition, the output won't be logged.
     * - `OVERRIDE` : Specify the logging details as a part of `logConfiguration` . If the `OVERRIDE` logging option is specified, the `logConfiguration` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html#cfn-ecs-cluster-executecommandconfiguration-logging
     */
    readonly logging?: string;
  }

  /**
   * The log configuration for the results of the execute command actions.
   *
   * The logs can be sent to CloudWatch Logs or an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html
   */
  export interface ExecuteCommandLogConfigurationProperty {
    /**
     * Determines whether to use encryption on the CloudWatch logs.
     *
     * If not specified, encryption will be off.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html#cfn-ecs-cluster-executecommandlogconfiguration-cloudwatchencryptionenabled
     */
    readonly cloudWatchEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * The name of the CloudWatch log group to send logs to.
     *
     * > The CloudWatch log group must already be created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html#cfn-ecs-cluster-executecommandlogconfiguration-cloudwatchloggroupname
     */
    readonly cloudWatchLogGroupName?: string;

    /**
     * The name of the S3 bucket to send logs to.
     *
     * > The S3 bucket must already be created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html#cfn-ecs-cluster-executecommandlogconfiguration-s3bucketname
     */
    readonly s3BucketName?: string;

    /**
     * Determines whether to use encryption on the S3 logs.
     *
     * If not specified, encryption is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html#cfn-ecs-cluster-executecommandlogconfiguration-s3encryptionenabled
     */
    readonly s3EncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * An optional folder in the S3 bucket to place logs in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandlogconfiguration.html#cfn-ecs-cluster-executecommandlogconfiguration-s3keyprefix
     */
    readonly s3KeyPrefix?: string;
  }

  /**
   * Use this parameter to set a default Service Connect namespace.
   *
   * After you set a default Service Connect namespace, any new services with Service Connect turned on that are created in the cluster are added as client services in the namespace. This setting only applies to new services that set the `enabled` parameter to `true` in the `ServiceConnectConfiguration` . You can set the namespace of each service individually in the `ServiceConnectConfiguration` to override this default parameter.
   *
   * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-serviceconnectdefaults.html
   */
  export interface ServiceConnectDefaultsProperty {
    /**
     * The namespace name or full Amazon Resource Name (ARN) of the AWS Cloud Map namespace that's used when you create a service and don't specify a Service Connect configuration.
     *
     * The namespace name can include up to 1024 characters. The name is case-sensitive. The name can't include hyphens (-), tilde (~), greater than (>), less than (<), or slash (/).
     *
     * If you enter an existing namespace name or ARN, then that namespace will be used. Any namespace type is supported. The namespace must be in this account and this AWS Region.
     *
     * If you enter a new name, a AWS Cloud Map namespace will be created. Amazon ECS creates a AWS Cloud Map namespace with the "API calls" method of instance discovery only. This instance discovery method is the "HTTP" namespace type in the AWS Command Line Interface . Other types of instance discovery aren't used by Service Connect.
     *
     * If you update the cluster with an empty string `""` for the namespace name, the cluster configuration for Service Connect is removed. Note that the namespace will remain in AWS Cloud Map and must be deleted separately.
     *
     * For more information about AWS Cloud Map , see [Working with Services](https://docs.aws.amazon.com/cloud-map/latest/dg/working-with-services.html) in the *AWS Cloud Map Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-serviceconnectdefaults.html#cfn-ecs-cluster-serviceconnectdefaults-namespace
     */
    readonly namespace?: string;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html
 */
export interface CfnClusterProps {
  /**
   * The short name of one or more capacity providers to associate with the cluster.
   *
   * A capacity provider must be associated with a cluster before it can be included as part of the default capacity provider strategy of the cluster or used in a capacity provider strategy when calling the [CreateService](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html) or [RunTask](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) actions.
   *
   * If specifying a capacity provider that uses an Auto Scaling group, the capacity provider must be created but not associated with another cluster. New Auto Scaling group capacity providers can be created with the [CreateCapacityProvider](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateCapacityProvider.html) API operation.
   *
   * To use a AWS Fargate capacity provider, specify either the `FARGATE` or `FARGATE_SPOT` capacity providers. The AWS Fargate capacity providers are available to all accounts and only need to be associated with a cluster to be used.
   *
   * The [PutCapacityProvider](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PutCapacityProvider.html) API operation is used to update the list of available capacity providers for a cluster after the cluster is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-capacityproviders
   */
  readonly capacityProviders?: Array<string>;

  /**
   * A user-generated string that you use to identify your cluster.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-clustername
   */
  readonly clusterName?: string;

  /**
   * The settings to use when creating a cluster.
   *
   * This parameter is used to turn on CloudWatch Container Insights for a cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-clustersettings
   */
  readonly clusterSettings?: Array<CfnCluster.ClusterSettingsProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The execute command configuration for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-configuration
   */
  readonly configuration?: CfnCluster.ClusterConfigurationProperty | cdk.IResolvable;

  /**
   * The default capacity provider strategy for the cluster.
   *
   * When services or tasks are run in the cluster with no launch type or capacity provider strategy specified, the default capacity provider strategy is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-defaultcapacityproviderstrategy
   */
  readonly defaultCapacityProviderStrategy?: Array<CfnCluster.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Use this parameter to set a default Service Connect namespace.
   *
   * After you set a default Service Connect namespace, any new services with Service Connect turned on that are created in the cluster are added as client services in the namespace. This setting only applies to new services that set the `enabled` parameter to `true` in the `ServiceConnectConfiguration` . You can set the namespace of each service individually in the `ServiceConnectConfiguration` to override this default parameter.
   *
   * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-serviceconnectdefaults
   */
  readonly serviceConnectDefaults?: cdk.IResolvable | CfnCluster.ServiceConnectDefaultsProperty;

  /**
   * The metadata that you apply to the cluster to help you categorize and organize them.
   *
   * Each tag consists of a key and an optional value. You define both.
   *
   * The following basic restrictions apply to tags:
   *
   * - Maximum number of tags per resource - 50
   * - For each resource, each tag key must be unique, and each tag key can have only one value.
   * - Maximum key length - 128 Unicode characters in UTF-8
   * - Maximum value length - 256 Unicode characters in UTF-8
   * - If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
   * - Tag keys and values are case-sensitive.
   * - Do not use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You cannot edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ClusterSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterClusterSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ClusterSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterClusterSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterClusterSettingsPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnClusterClusterSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterSettingsProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterCapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("base", cdk.validateNumber)(properties.base));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.validateString)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CapacityProviderStrategyItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterCapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnClusterCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.CapacityProviderStrategyItemProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecuteCommandLogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExecuteCommandLogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterExecuteCommandLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchEncryptionEnabled", cdk.validateBoolean)(properties.cloudWatchEncryptionEnabled));
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupName", cdk.validateString)(properties.cloudWatchLogGroupName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3EncryptionEnabled", cdk.validateBoolean)(properties.s3EncryptionEnabled));
  errors.collect(cdk.propertyValidator("s3KeyPrefix", cdk.validateString)(properties.s3KeyPrefix));
  return errors.wrap("supplied properties not correct for \"ExecuteCommandLogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterExecuteCommandLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterExecuteCommandLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchEncryptionEnabled": cdk.booleanToCloudFormation(properties.cloudWatchEncryptionEnabled),
    "CloudWatchLogGroupName": cdk.stringToCloudFormation(properties.cloudWatchLogGroupName),
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3EncryptionEnabled": cdk.booleanToCloudFormation(properties.s3EncryptionEnabled),
    "S3KeyPrefix": cdk.stringToCloudFormation(properties.s3KeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnClusterExecuteCommandLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ExecuteCommandLogConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ExecuteCommandLogConfigurationProperty>();
  ret.addPropertyResult("cloudWatchEncryptionEnabled", "CloudWatchEncryptionEnabled", (properties.CloudWatchEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchEncryptionEnabled) : undefined));
  ret.addPropertyResult("cloudWatchLogGroupName", "CloudWatchLogGroupName", (properties.CloudWatchLogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupName) : undefined));
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3EncryptionEnabled", "S3EncryptionEnabled", (properties.S3EncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.S3EncryptionEnabled) : undefined));
  ret.addPropertyResult("s3KeyPrefix", "S3KeyPrefix", (properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecuteCommandConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExecuteCommandConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterExecuteCommandConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnClusterExecuteCommandLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("logging", cdk.validateString)(properties.logging));
  return errors.wrap("supplied properties not correct for \"ExecuteCommandConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterExecuteCommandConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterExecuteCommandConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LogConfiguration": convertCfnClusterExecuteCommandLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "Logging": cdk.stringToCloudFormation(properties.logging)
  };
}

// @ts-ignore TS6133
function CfnClusterExecuteCommandConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ExecuteCommandConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ExecuteCommandConfigurationProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnClusterExecuteCommandLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? cfn_parse.FromCloudFormation.getString(properties.Logging) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClusterConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterClusterConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executeCommandConfiguration", CfnClusterExecuteCommandConfigurationPropertyValidator)(properties.executeCommandConfiguration));
  return errors.wrap("supplied properties not correct for \"ClusterConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterClusterConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterClusterConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ExecuteCommandConfiguration": convertCfnClusterExecuteCommandConfigurationPropertyToCloudFormation(properties.executeCommandConfiguration)
  };
}

// @ts-ignore TS6133
function CfnClusterClusterConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterConfigurationProperty>();
  ret.addPropertyResult("executeCommandConfiguration", "ExecuteCommandConfiguration", (properties.ExecuteCommandConfiguration != null ? CfnClusterExecuteCommandConfigurationPropertyFromCloudFormation(properties.ExecuteCommandConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceConnectDefaultsProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceConnectDefaultsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterServiceConnectDefaultsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"ServiceConnectDefaultsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterServiceConnectDefaultsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterServiceConnectDefaultsPropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnClusterServiceConnectDefaultsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ServiceConnectDefaultsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ServiceConnectDefaultsProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviders", cdk.listValidator(cdk.validateString))(properties.capacityProviders));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterSettings", cdk.listValidator(CfnClusterClusterSettingsPropertyValidator))(properties.clusterSettings));
  errors.collect(cdk.propertyValidator("configuration", CfnClusterClusterConfigurationPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("defaultCapacityProviderStrategy", cdk.listValidator(CfnClusterCapacityProviderStrategyItemPropertyValidator))(properties.defaultCapacityProviderStrategy));
  errors.collect(cdk.propertyValidator("serviceConnectDefaults", CfnClusterServiceConnectDefaultsPropertyValidator)(properties.serviceConnectDefaults));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "CapacityProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.capacityProviders),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "ClusterSettings": cdk.listMapper(convertCfnClusterClusterSettingsPropertyToCloudFormation)(properties.clusterSettings),
    "Configuration": convertCfnClusterClusterConfigurationPropertyToCloudFormation(properties.configuration),
    "DefaultCapacityProviderStrategy": cdk.listMapper(convertCfnClusterCapacityProviderStrategyItemPropertyToCloudFormation)(properties.defaultCapacityProviderStrategy),
    "ServiceConnectDefaults": convertCfnClusterServiceConnectDefaultsPropertyToCloudFormation(properties.serviceConnectDefaults),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
  ret.addPropertyResult("capacityProviders", "CapacityProviders", (properties.CapacityProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CapacityProviders) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("clusterSettings", "ClusterSettings", (properties.ClusterSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterClusterSettingsPropertyFromCloudFormation)(properties.ClusterSettings) : undefined));
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnClusterClusterConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("defaultCapacityProviderStrategy", "DefaultCapacityProviderStrategy", (properties.DefaultCapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.DefaultCapacityProviderStrategy) : undefined));
  ret.addPropertyResult("serviceConnectDefaults", "ServiceConnectDefaults", (properties.ServiceConnectDefaults != null ? CfnClusterServiceConnectDefaultsPropertyFromCloudFormation(properties.ServiceConnectDefaults) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECS::ClusterCapacityProviderAssociations` resource associates one or more capacity providers and a default capacity provider strategy with a cluster.
 *
 * @cloudformationResource AWS::ECS::ClusterCapacityProviderAssociations
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-clustercapacityproviderassociations.html
 */
export class CfnClusterCapacityProviderAssociations extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::ClusterCapacityProviderAssociations";

  /**
   * Build a CfnClusterCapacityProviderAssociations from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterCapacityProviderAssociations {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterCapacityProviderAssociationsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterCapacityProviderAssociations(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The capacity providers to associate with the cluster.
   */
  public capacityProviders: Array<string>;

  /**
   * The cluster the capacity provider association is the target of.
   */
  public cluster: string;

  /**
   * The default capacity provider strategy to associate with the cluster.
   */
  public defaultCapacityProviderStrategy: Array<CfnClusterCapacityProviderAssociations.CapacityProviderStrategyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterCapacityProviderAssociationsProps) {
    super(scope, id, {
      "type": CfnClusterCapacityProviderAssociations.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "capacityProviders", this);
    cdk.requireProperty(props, "cluster", this);
    cdk.requireProperty(props, "defaultCapacityProviderStrategy", this);

    this.capacityProviders = props.capacityProviders;
    this.cluster = props.cluster;
    this.defaultCapacityProviderStrategy = props.defaultCapacityProviderStrategy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityProviders": this.capacityProviders,
      "cluster": this.cluster,
      "defaultCapacityProviderStrategy": this.defaultCapacityProviderStrategy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterCapacityProviderAssociations.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterCapacityProviderAssociationsPropsToCloudFormation(props);
  }
}

export namespace CfnClusterCapacityProviderAssociations {
  /**
   * The `CapacityProviderStrategy` property specifies the details of the default capacity provider strategy for the cluster.
   *
   * When services or tasks are run in the cluster with no launch type or capacity provider strategy specified, the default capacity provider strategy is used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-clustercapacityproviderassociations-capacityproviderstrategy.html
   */
  export interface CapacityProviderStrategyProperty {
    /**
     * The *base* value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a *base* defined. If no value is specified, the default value of `0` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-clustercapacityproviderassociations-capacityproviderstrategy.html#cfn-ecs-clustercapacityproviderassociations-capacityproviderstrategy-base
     */
    readonly base?: number;

    /**
     * The short name of the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-clustercapacityproviderassociations-capacityproviderstrategy.html#cfn-ecs-clustercapacityproviderassociations-capacityproviderstrategy-capacityprovider
     */
    readonly capacityProvider: string;

    /**
     * The *weight* value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
     *
     * The `weight` value is taken into consideration after the `base` value, if defined, is satisfied.
     *
     * If no `weight` value is specified, the default value of `0` is used. When multiple capacity providers are specified within a capacity provider strategy, at least one of the capacity providers must have a weight value greater than zero and any capacity providers with a weight of `0` will not be used to place tasks. If you specify multiple capacity providers in a strategy that all have a weight of `0` , any `RunTask` or `CreateService` actions using the capacity provider strategy will fail.
     *
     * An example scenario for using weights is defining a strategy that contains two capacity providers and both have a weight of `1` , then when the `base` is satisfied, the tasks will be split evenly across the two capacity providers. Using that same logic, if you specify a weight of `1` for *capacityProviderA* and a weight of `4` for *capacityProviderB* , then for every one task that is run using *capacityProviderA* , four tasks would use *capacityProviderB* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-clustercapacityproviderassociations-capacityproviderstrategy.html#cfn-ecs-clustercapacityproviderassociations-capacityproviderstrategy-weight
     */
    readonly weight?: number;
  }
}

/**
 * Properties for defining a `CfnClusterCapacityProviderAssociations`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-clustercapacityproviderassociations.html
 */
export interface CfnClusterCapacityProviderAssociationsProps {
  /**
   * The capacity providers to associate with the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-clustercapacityproviderassociations.html#cfn-ecs-clustercapacityproviderassociations-capacityproviders
   */
  readonly capacityProviders: Array<string>;

  /**
   * The cluster the capacity provider association is the target of.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-clustercapacityproviderassociations.html#cfn-ecs-clustercapacityproviderassociations-cluster
   */
  readonly cluster: string;

  /**
   * The default capacity provider strategy to associate with the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-clustercapacityproviderassociations.html#cfn-ecs-clustercapacityproviderassociations-defaultcapacityproviderstrategy
   */
  readonly defaultCapacityProviderStrategy: Array<CfnClusterCapacityProviderAssociations.CapacityProviderStrategyProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("base", cdk.validateNumber)(properties.base));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.requiredValidator)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.validateString)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CapacityProviderStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterCapacityProviderAssociations.CapacityProviderStrategyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterCapacityProviderAssociations.CapacityProviderStrategyProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterCapacityProviderAssociationsProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterCapacityProviderAssociationsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterCapacityProviderAssociationsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviders", cdk.requiredValidator)(properties.capacityProviders));
  errors.collect(cdk.propertyValidator("capacityProviders", cdk.listValidator(cdk.validateString))(properties.capacityProviders));
  errors.collect(cdk.propertyValidator("cluster", cdk.requiredValidator)(properties.cluster));
  errors.collect(cdk.propertyValidator("cluster", cdk.validateString)(properties.cluster));
  errors.collect(cdk.propertyValidator("defaultCapacityProviderStrategy", cdk.requiredValidator)(properties.defaultCapacityProviderStrategy));
  errors.collect(cdk.propertyValidator("defaultCapacityProviderStrategy", cdk.listValidator(CfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyValidator))(properties.defaultCapacityProviderStrategy));
  return errors.wrap("supplied properties not correct for \"CfnClusterCapacityProviderAssociationsProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterCapacityProviderAssociationsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterCapacityProviderAssociationsPropsValidator(properties).assertSuccess();
  return {
    "CapacityProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.capacityProviders),
    "Cluster": cdk.stringToCloudFormation(properties.cluster),
    "DefaultCapacityProviderStrategy": cdk.listMapper(convertCfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyToCloudFormation)(properties.defaultCapacityProviderStrategy)
  };
}

// @ts-ignore TS6133
function CfnClusterCapacityProviderAssociationsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterCapacityProviderAssociationsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterCapacityProviderAssociationsProps>();
  ret.addPropertyResult("capacityProviders", "CapacityProviders", (properties.CapacityProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CapacityProviders) : undefined));
  ret.addPropertyResult("cluster", "Cluster", (properties.Cluster != null ? cfn_parse.FromCloudFormation.getString(properties.Cluster) : undefined));
  ret.addPropertyResult("defaultCapacityProviderStrategy", "DefaultCapacityProviderStrategy", (properties.DefaultCapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterCapacityProviderAssociationsCapacityProviderStrategyPropertyFromCloudFormation)(properties.DefaultCapacityProviderStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Modifies which task set in a service is the primary task set.
 *
 * Any parameters that are updated on the primary task set in a service will transition to the service. This is used when a service uses the `EXTERNAL` deployment controller type. For more information, see [Amazon ECS Deployment Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * @cloudformationResource AWS::ECS::PrimaryTaskSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-primarytaskset.html
 */
export class CfnPrimaryTaskSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::PrimaryTaskSet";

  /**
   * Build a CfnPrimaryTaskSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPrimaryTaskSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPrimaryTaskSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPrimaryTaskSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service that the task set exists in.
   */
  public cluster: string;

  /**
   * The short name or full Amazon Resource Name (ARN) of the service that the task set exists in.
   */
  public service: string;

  /**
   * The short name or full Amazon Resource Name (ARN) of the task set to set as the primary task set in the deployment.
   */
  public taskSetId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPrimaryTaskSetProps) {
    super(scope, id, {
      "type": CfnPrimaryTaskSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "cluster", this);
    cdk.requireProperty(props, "service", this);
    cdk.requireProperty(props, "taskSetId", this);

    this.cluster = props.cluster;
    this.service = props.service;
    this.taskSetId = props.taskSetId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cluster": this.cluster,
      "service": this.service,
      "taskSetId": this.taskSetId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPrimaryTaskSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPrimaryTaskSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPrimaryTaskSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-primarytaskset.html
 */
export interface CfnPrimaryTaskSetProps {
  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service that the task set exists in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-primarytaskset.html#cfn-ecs-primarytaskset-cluster
   */
  readonly cluster: string;

  /**
   * The short name or full Amazon Resource Name (ARN) of the service that the task set exists in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-primarytaskset.html#cfn-ecs-primarytaskset-service
   */
  readonly service: string;

  /**
   * The short name or full Amazon Resource Name (ARN) of the task set to set as the primary task set in the deployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-primarytaskset.html#cfn-ecs-primarytaskset-tasksetid
   */
  readonly taskSetId: string;
}

/**
 * Determine whether the given properties match those of a `CfnPrimaryTaskSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnPrimaryTaskSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrimaryTaskSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cluster", cdk.requiredValidator)(properties.cluster));
  errors.collect(cdk.propertyValidator("cluster", cdk.validateString)(properties.cluster));
  errors.collect(cdk.propertyValidator("service", cdk.requiredValidator)(properties.service));
  errors.collect(cdk.propertyValidator("service", cdk.validateString)(properties.service));
  errors.collect(cdk.propertyValidator("taskSetId", cdk.requiredValidator)(properties.taskSetId));
  errors.collect(cdk.propertyValidator("taskSetId", cdk.validateString)(properties.taskSetId));
  return errors.wrap("supplied properties not correct for \"CfnPrimaryTaskSetProps\"");
}

// @ts-ignore TS6133
function convertCfnPrimaryTaskSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrimaryTaskSetPropsValidator(properties).assertSuccess();
  return {
    "Cluster": cdk.stringToCloudFormation(properties.cluster),
    "Service": cdk.stringToCloudFormation(properties.service),
    "TaskSetId": cdk.stringToCloudFormation(properties.taskSetId)
  };
}

// @ts-ignore TS6133
function CfnPrimaryTaskSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrimaryTaskSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrimaryTaskSetProps>();
  ret.addPropertyResult("cluster", "Cluster", (properties.Cluster != null ? cfn_parse.FromCloudFormation.getString(properties.Cluster) : undefined));
  ret.addPropertyResult("service", "Service", (properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined));
  ret.addPropertyResult("taskSetId", "TaskSetId", (properties.TaskSetId != null ? cfn_parse.FromCloudFormation.getString(properties.TaskSetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECS::Service` resource creates an Amazon Elastic Container Service (Amazon ECS) service that runs and maintains the requested number of tasks and associated load balancers.
 *
 * > The stack update fails if you change any properties that require replacement and at least one Amazon ECS Service Connect `ServiceConnectService` is configured. This is because AWS CloudFormation creates the replacement service first, but each `ServiceConnectService` must have a name that is unique in the namespace. > Starting April 15, 2023, AWS ; will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS , or Amazon EC2 . However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service.
 *
 * @cloudformationResource AWS::ECS::Service
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html
 */
export class CfnService extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::Service";

  /**
   * Build a CfnService from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnService(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Amazon ECS service, such as `sample-webapp` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Not currently supported in AWS CloudFormation .
   *
   * @cloudformationAttribute ServiceArn
   */
  public readonly attrServiceArn: string;

  /**
   * The capacity provider strategy to use for the service.
   */
  public capacityProviderStrategy?: Array<CfnService.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that you run your service on.
   */
  public cluster?: string;

  /**
   * Optional deployment parameters that control how many tasks run during the deployment and the ordering of stopping and starting tasks.
   */
  public deploymentConfiguration?: CfnService.DeploymentConfigurationProperty | cdk.IResolvable;

  /**
   * The deployment controller to use for the service.
   */
  public deploymentController?: CfnService.DeploymentControllerProperty | cdk.IResolvable;

  /**
   * The number of instantiations of the specified task definition to place and keep running in your service.
   */
  public desiredCount?: number;

  /**
   * Specifies whether to turn on Amazon ECS managed tags for the tasks within the service.
   */
  public enableEcsManagedTags?: boolean | cdk.IResolvable;

  /**
   * Determines whether the execute command functionality is turned on for the service.
   */
  public enableExecuteCommand?: boolean | cdk.IResolvable;

  /**
   * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy Elastic Load Balancing target health checks after a task has first started.
   */
  public healthCheckGracePeriodSeconds?: number;

  /**
   * The launch type on which to run your service.
   */
  public launchType?: string;

  /**
   * A list of load balancer objects to associate with the service.
   */
  public loadBalancers?: Array<cdk.IResolvable | CfnService.LoadBalancerProperty> | cdk.IResolvable;

  /**
   * The network configuration for the service.
   */
  public networkConfiguration?: cdk.IResolvable | CfnService.NetworkConfigurationProperty;

  /**
   * An array of placement constraint objects to use for tasks in your service.
   */
  public placementConstraints?: Array<cdk.IResolvable | CfnService.PlacementConstraintProperty> | cdk.IResolvable;

  /**
   * The placement strategy objects to use for tasks in your service.
   */
  public placementStrategies?: Array<cdk.IResolvable | CfnService.PlacementStrategyProperty> | cdk.IResolvable;

  /**
   * The platform version that your tasks in the service are running on.
   */
  public platformVersion?: string;

  /**
   * Specifies whether to propagate the tags from the task definition to the task.
   */
  public propagateTags?: string;

  /**
   * The name or full Amazon Resource Name (ARN) of the IAM role that allows Amazon ECS to make calls to your load balancer on your behalf.
   */
  public role?: string;

  /**
   * The scheduling strategy to use for the service. For more information, see [Services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html) .
   */
  public schedulingStrategy?: string;

  /**
   * The configuration for this service to discover and connect to services, and be discovered by, and connected from, other services within a namespace.
   */
  public serviceConnectConfiguration?: cdk.IResolvable | CfnService.ServiceConnectConfigurationProperty;

  /**
   * The name of your service.
   */
  public serviceName?: string;

  /**
   * The details of the service discovery registry to associate with this service. For more information, see [Service discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html) .
   */
  public serviceRegistries?: Array<cdk.IResolvable | CfnService.ServiceRegistryProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the service to help you categorize and organize them.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The `family` and `revision` ( `family:revision` ) or full ARN of the task definition to run in your service.
   */
  public taskDefinition?: string;

  public volumeConfigurations?: Array<cdk.IResolvable | CfnService.ServiceVolumeConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceProps = {}) {
    super(scope, id, {
      "type": CfnService.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrServiceArn = cdk.Token.asString(this.getAtt("ServiceArn", cdk.ResolutionTypeHint.STRING));
    this.capacityProviderStrategy = props.capacityProviderStrategy;
    this.cluster = props.cluster;
    this.deploymentConfiguration = props.deploymentConfiguration;
    this.deploymentController = props.deploymentController;
    this.desiredCount = props.desiredCount;
    this.enableEcsManagedTags = props.enableEcsManagedTags;
    this.enableExecuteCommand = props.enableExecuteCommand;
    this.healthCheckGracePeriodSeconds = props.healthCheckGracePeriodSeconds;
    this.launchType = props.launchType;
    this.loadBalancers = props.loadBalancers;
    this.networkConfiguration = props.networkConfiguration;
    this.placementConstraints = props.placementConstraints;
    this.placementStrategies = props.placementStrategies;
    this.platformVersion = props.platformVersion;
    this.propagateTags = props.propagateTags;
    this.role = props.role;
    this.schedulingStrategy = props.schedulingStrategy;
    this.serviceConnectConfiguration = props.serviceConnectConfiguration;
    this.serviceName = props.serviceName;
    this.serviceRegistries = props.serviceRegistries;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECS::Service", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taskDefinition = props.taskDefinition;
    this.volumeConfigurations = props.volumeConfigurations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityProviderStrategy": this.capacityProviderStrategy,
      "cluster": this.cluster,
      "deploymentConfiguration": this.deploymentConfiguration,
      "deploymentController": this.deploymentController,
      "desiredCount": this.desiredCount,
      "enableEcsManagedTags": this.enableEcsManagedTags,
      "enableExecuteCommand": this.enableExecuteCommand,
      "healthCheckGracePeriodSeconds": this.healthCheckGracePeriodSeconds,
      "launchType": this.launchType,
      "loadBalancers": this.loadBalancers,
      "networkConfiguration": this.networkConfiguration,
      "placementConstraints": this.placementConstraints,
      "placementStrategies": this.placementStrategies,
      "platformVersion": this.platformVersion,
      "propagateTags": this.propagateTags,
      "role": this.role,
      "schedulingStrategy": this.schedulingStrategy,
      "serviceConnectConfiguration": this.serviceConnectConfiguration,
      "serviceName": this.serviceName,
      "serviceRegistries": this.serviceRegistries,
      "tags": this.tags.renderTags(),
      "taskDefinition": this.taskDefinition,
      "volumeConfigurations": this.volumeConfigurations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnService.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServicePropsToCloudFormation(props);
  }
}

export namespace CfnService {
  /**
   * The `PlacementConstraint` property specifies an object representing a constraint on task placement in the task definition.
   *
   * For more information, see [Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementconstraint.html
   */
  export interface PlacementConstraintProperty {
    /**
     * A cluster query language expression to apply to the constraint.
     *
     * The expression can have a maximum length of 2000 characters. You can't specify an expression if the constraint type is `distinctInstance` . For more information, see [Cluster query language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementconstraint.html#cfn-ecs-service-placementconstraint-expression
     */
    readonly expression?: string;

    /**
     * The type of constraint.
     *
     * Use `distinctInstance` to ensure that each task in a particular group is running on a different container instance. Use `memberOf` to restrict the selection to a group of valid candidates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementconstraint.html#cfn-ecs-service-placementconstraint-type
     */
    readonly type: string;
  }

  /**
   * The `LoadBalancer` property specifies details on a load balancer that is used with a service.
   *
   * If the service is using the `CODE_DEPLOY` deployment controller, the service is required to use either an Application Load Balancer or Network Load Balancer. When you are creating an AWS CodeDeploy deployment group, you specify two target groups (referred to as a `targetGroupPair` ). Each target group binds to a separate task set in the deployment. The load balancer can also have up to two listeners, a required listener for production traffic and an optional listener that allows you to test new revisions of the service before routing production traffic to it.
   *
   * Services with tasks that use the `awsvpc` network mode (for example, those with the Fargate launch type) only support Application Load Balancers and Network Load Balancers. Classic Load Balancers are not supported. Also, when you create any target groups for these services, you must choose `ip` as the target type, not `instance` . Tasks that use the `awsvpc` network mode are associated with an elastic network interface, not an Amazon EC2 instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-loadbalancer.html
   */
  export interface LoadBalancerProperty {
    /**
     * The name of the container (as it appears in a container definition) to associate with the load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-loadbalancer.html#cfn-ecs-service-loadbalancer-containername
     */
    readonly containerName?: string;

    /**
     * The port on the container to associate with the load balancer.
     *
     * This port must correspond to a `containerPort` in the task definition the tasks in the service are using. For tasks that use the EC2 launch type, the container instance they're launched on must allow ingress traffic on the `hostPort` of the port mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-loadbalancer.html#cfn-ecs-service-loadbalancer-containerport
     */
    readonly containerPort?: number;

    /**
     * The name of the load balancer to associate with the Amazon ECS service or task set.
     *
     * If you are using an Application Load Balancer or a Network Load Balancer the load balancer name parameter should be omitted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-loadbalancer.html#cfn-ecs-service-loadbalancer-loadbalancername
     */
    readonly loadBalancerName?: string;

    /**
     * The full Amazon Resource Name (ARN) of the Elastic Load Balancing target group or groups associated with a service or task set.
     *
     * A target group ARN is only specified when using an Application Load Balancer or Network Load Balancer.
     *
     * For services using the `ECS` deployment controller, you can specify one or multiple target groups. For more information, see [Registering multiple target groups with a service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/register-multiple-targetgroups.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For services using the `CODE_DEPLOY` deployment controller, you're required to define two target groups for the load balancer. For more information, see [Blue/green deployment with CodeDeploy](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If your service's task definition uses the `awsvpc` network mode, you must choose `ip` as the target type, not `instance` . Do this when creating your target groups because tasks that use the `awsvpc` network mode are associated with an elastic network interface, not an Amazon EC2 instance. This network mode is required for the Fargate launch type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-loadbalancer.html#cfn-ecs-service-loadbalancer-targetgrouparn
     */
    readonly targetGroupArn?: string;
  }

  /**
   * The Service Connect configuration of your Amazon ECS service.
   *
   * The configuration for this service to discover and connect to services, and be discovered by, and connected from, other services within a namespace.
   *
   * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectconfiguration.html
   */
  export interface ServiceConnectConfigurationProperty {
    /**
     * Specifies whether to use Service Connect with this service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectconfiguration.html#cfn-ecs-service-serviceconnectconfiguration-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The log configuration for the container.
     *
     * This parameter maps to `LogConfig` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--log-driver` option to [`docker run`](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/commandline/run/) .
     *
     * By default, containers use the same logging driver that the Docker daemon uses. However, the container might use a different logging driver than the Docker daemon by specifying a log driver configuration in the container definition. For more information about the options for different supported log drivers, see [Configure logging drivers](https://docs.aws.amazon.com/https://docs.docker.com/engine/admin/logging/overview/) in the Docker documentation.
     *
     * Understand the following when specifying a log configuration for your containers.
     *
     * - Amazon ECS currently supports a subset of the logging drivers available to the Docker daemon. Additional log drivers may be available in future releases of the Amazon ECS container agent.
     *
     * For tasks on AWS Fargate , the supported log drivers are `awslogs` , `splunk` , and `awsfirelens` .
     *
     * For tasks hosted on Amazon EC2 instances, the supported log drivers are `awslogs` , `fluentd` , `gelf` , `json-file` , `journald` , `logentries` , `syslog` , `splunk` , and `awsfirelens` .
     * - This parameter requires version 1.18 of the Docker Remote API or greater on your container instance.
     * - For tasks that are hosted on Amazon EC2 instances, the Amazon ECS container agent must register the available logging drivers with the `ECS_AVAILABLE_LOGGING_DRIVERS` environment variable before containers placed on that instance can use these log configuration options. For more information, see [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) in the *Amazon Elastic Container Service Developer Guide* .
     * - For tasks that are on AWS Fargate , because you don't have access to the underlying infrastructure your tasks are hosted on, any additional software needed must be installed outside of the task. For example, the Fluentd output aggregators or a remote host running Logstash to send Gelf logs to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectconfiguration.html#cfn-ecs-service-serviceconnectconfiguration-logconfiguration
     */
    readonly logConfiguration?: cdk.IResolvable | CfnService.LogConfigurationProperty;

    /**
     * The namespace name or full Amazon Resource Name (ARN) of the AWS Cloud Map namespace for use with Service Connect.
     *
     * The namespace must be in the same AWS Region as the Amazon ECS service and cluster. The type of namespace doesn't affect Service Connect. For more information about AWS Cloud Map , see [Working with Services](https://docs.aws.amazon.com/cloud-map/latest/dg/working-with-services.html) in the *AWS Cloud Map Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectconfiguration.html#cfn-ecs-service-serviceconnectconfiguration-namespace
     */
    readonly namespace?: string;

    /**
     * The list of Service Connect service objects.
     *
     * These are names and aliases (also known as endpoints) that are used by other Amazon ECS services to connect to this service.
     *
     * This field is not required for a "client" Amazon ECS service that's a member of a namespace only to connect to other services within the namespace. An example of this would be a frontend application that accepts incoming requests from either a load balancer that's attached to the service or by other means.
     *
     * An object selects a port from the task definition, assigns a name for the AWS Cloud Map service, and a list of aliases (endpoints) and ports for client applications to refer to this service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectconfiguration.html#cfn-ecs-service-serviceconnectconfiguration-services
     */
    readonly services?: Array<cdk.IResolvable | CfnService.ServiceConnectServiceProperty> | cdk.IResolvable;
  }

  /**
   * The Service Connect service object configuration.
   *
   * For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectservice.html
   */
  export interface ServiceConnectServiceProperty {
    /**
     * The list of client aliases for this Service Connect service.
     *
     * You use these to assign names that can be used by client applications. The maximum number of client aliases that you can have in this list is 1.
     *
     * Each alias ("endpoint") is a fully-qualified name and port number that other Amazon ECS tasks ("clients") can use to connect to this service.
     *
     * Each name and port mapping must be unique within the namespace.
     *
     * For each `ServiceConnectService` , you must provide at least one `clientAlias` with one `port` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectservice.html#cfn-ecs-service-serviceconnectservice-clientaliases
     */
    readonly clientAliases?: Array<cdk.IResolvable | CfnService.ServiceConnectClientAliasProperty> | cdk.IResolvable;

    /**
     * The `discoveryName` is the name of the new AWS Cloud Map service that Amazon ECS creates for this Amazon ECS service.
     *
     * This must be unique within the AWS Cloud Map namespace. The name can contain up to 64 characters. The name can include lowercase letters, numbers, underscores (_), and hyphens (-). The name can't start with a hyphen.
     *
     * If the `discoveryName` isn't specified, the port mapping name from the task definition is used in `portName.namespace` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectservice.html#cfn-ecs-service-serviceconnectservice-discoveryname
     */
    readonly discoveryName?: string;

    /**
     * The port number for the Service Connect proxy to listen on.
     *
     * Use the value of this field to bypass the proxy for traffic on the port number specified in the named `portMapping` in the task definition of this application, and then use it in your VPC security groups to allow traffic into the proxy for this Amazon ECS service.
     *
     * In `awsvpc` mode and Fargate, the default value is the container port number. The container port number is in the `portMapping` in the task definition. In bridge mode, the default value is the ephemeral port of the Service Connect proxy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectservice.html#cfn-ecs-service-serviceconnectservice-ingressportoverride
     */
    readonly ingressPortOverride?: number;

    /**
     * The `portName` must match the name of one of the `portMappings` from all the containers in the task definition of this Amazon ECS service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectservice.html#cfn-ecs-service-serviceconnectservice-portname
     */
    readonly portName: string;
  }

  /**
   * Each alias ("endpoint") is a fully-qualified name and port number that other tasks ("clients") can use to connect to this service.
   *
   * Each name and port mapping must be unique within the namespace.
   *
   * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectclientalias.html
   */
  export interface ServiceConnectClientAliasProperty {
    /**
     * The `dnsName` is the name that you use in the applications of client tasks to connect to this service.
     *
     * The name must be a valid DNS name but doesn't need to be fully-qualified. The name can include up to 127 characters. The name can include lowercase letters, numbers, underscores (_), hyphens (-), and periods (.). The name can't start with a hyphen.
     *
     * If this parameter isn't specified, the default value of `discoveryName.namespace` is used. If the `discoveryName` isn't specified, the port mapping name from the task definition is used in `portName.namespace` .
     *
     * To avoid changing your applications in client Amazon ECS services, set this to the same name that the client application uses by default. For example, a few common names are `database` , `db` , or the lowercase name of a database, such as `mysql` or `redis` . For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectclientalias.html#cfn-ecs-service-serviceconnectclientalias-dnsname
     */
    readonly dnsName?: string;

    /**
     * The listening port number for the Service Connect proxy.
     *
     * This port is available inside of all of the tasks within the same namespace.
     *
     * To avoid changing your applications in client Amazon ECS services, set this to the same port that the client application uses by default. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceconnectclientalias.html#cfn-ecs-service-serviceconnectclientalias-port
     */
    readonly port: number;
  }

  /**
   * The log configuration for the container.
   *
   * This parameter maps to `LogConfig` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--log-driver` option to [`docker run`](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/commandline/run/) .
   *
   * By default, containers use the same logging driver that the Docker daemon uses. However, the container might use a different logging driver than the Docker daemon by specifying a log driver configuration in the container definition. For more information about the options for different supported log drivers, see [Configure logging drivers](https://docs.aws.amazon.com/https://docs.docker.com/engine/admin/logging/overview/) in the Docker documentation.
   *
   * Understand the following when specifying a log configuration for your containers.
   *
   * - Amazon ECS currently supports a subset of the logging drivers available to the Docker daemon. Additional log drivers may be available in future releases of the Amazon ECS container agent.
   *
   * For tasks on AWS Fargate , the supported log drivers are `awslogs` , `splunk` , and `awsfirelens` .
   *
   * For tasks hosted on Amazon EC2 instances, the supported log drivers are `awslogs` , `fluentd` , `gelf` , `json-file` , `journald` , `logentries` , `syslog` , `splunk` , and `awsfirelens` .
   * - This parameter requires version 1.18 of the Docker Remote API or greater on your container instance.
   * - For tasks that are hosted on Amazon EC2 instances, the Amazon ECS container agent must register the available logging drivers with the `ECS_AVAILABLE_LOGGING_DRIVERS` environment variable before containers placed on that instance can use these log configuration options. For more information, see [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) in the *Amazon Elastic Container Service Developer Guide* .
   * - For tasks that are on AWS Fargate , because you don't have access to the underlying infrastructure your tasks are hosted on, any additional software needed must be installed outside of the task. For example, the Fluentd output aggregators or a remote host running Logstash to send Gelf logs to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * The log driver to use for the container.
     *
     * For tasks on AWS Fargate , the supported log drivers are `awslogs` , `splunk` , and `awsfirelens` .
     *
     * For tasks hosted on Amazon EC2 instances, the supported log drivers are `awslogs` , `fluentd` , `gelf` , `json-file` , `journald` , `logentries` , `syslog` , `splunk` , and `awsfirelens` .
     *
     * For more information about using the `awslogs` log driver, see [Using the awslogs log driver](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For more information about using the `awsfirelens` log driver, see [Custom log routing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If you have a custom driver that isn't listed, you can fork the Amazon ECS container agent project that's [available on GitHub](https://docs.aws.amazon.com/https://github.com/aws/amazon-ecs-agent) and customize it to work with that driver. We encourage you to submit pull requests for changes that you would like to have included. However, we don't currently provide support for running modified copies of this software.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-logconfiguration.html#cfn-ecs-service-logconfiguration-logdriver
     */
    readonly logDriver?: string;

    /**
     * The configuration options to send to the log driver.
     *
     * This parameter requires version 1.19 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-logconfiguration.html#cfn-ecs-service-logconfiguration-options
     */
    readonly options?: cdk.IResolvable | Record<string, string>;

    /**
     * The secrets to pass to the log configuration.
     *
     * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-logconfiguration.html#cfn-ecs-service-logconfiguration-secretoptions
     */
    readonly secretOptions?: Array<cdk.IResolvable | CfnService.SecretProperty> | cdk.IResolvable;
  }

  /**
   * An object representing the secret to expose to your container.
   *
   * Secrets can be exposed to a container in the following ways:
   *
   * - To inject sensitive data into your containers as environment variables, use the `secrets` container definition parameter.
   * - To reference sensitive information in the log configuration of a container, use the `secretOptions` container definition parameter.
   *
   * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-secret.html
   */
  export interface SecretProperty {
    /**
     * The name of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-secret.html#cfn-ecs-service-secret-name
     */
    readonly name: string;

    /**
     * The secret to expose to the container.
     *
     * The supported values are either the full ARN of the AWS Secrets Manager secret or the full ARN of the parameter in the SSM Parameter Store.
     *
     * For information about the require AWS Identity and Access Management permissions, see [Required IAM permissions for Amazon ECS secrets](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html#secrets-iam) (for Secrets Manager) or [Required IAM permissions for Amazon ECS secrets](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-parameters.html) (for Systems Manager Parameter store) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If the SSM Parameter Store parameter exists in the same Region as the task you're launching, then you can use either the full ARN or name of the parameter. If the parameter exists in a different Region, then the full ARN must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-secret.html#cfn-ecs-service-secret-valuefrom
     */
    readonly valueFrom: string;
  }

  /**
   * The `PlacementStrategy` property specifies the task placement strategy for a task or service.
   *
   * For more information, see [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementstrategy.html
   */
  export interface PlacementStrategyProperty {
    /**
     * The field to apply the placement strategy against.
     *
     * For the `spread` placement strategy, valid values are `instanceId` (or `host` , which has the same effect), or any platform or custom attribute that is applied to a container instance, such as `attribute:ecs.availability-zone` . For the `binpack` placement strategy, valid values are `CPU` and `MEMORY` . For the `random` placement strategy, this field is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementstrategy.html#cfn-ecs-service-placementstrategy-field
     */
    readonly field?: string;

    /**
     * The type of placement strategy.
     *
     * The `random` placement strategy randomly places tasks on available candidates. The `spread` placement strategy spreads placement across available candidates evenly based on the `field` parameter. The `binpack` strategy places tasks on available candidates that have the least available amount of the resource that's specified with the `field` parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory but still enough to run the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-placementstrategy.html#cfn-ecs-service-placementstrategy-type
     */
    readonly type: string;
  }

  /**
   * The deployment controller to use for the service.
   *
   * For more information, see [Amazon ECS deployment types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentcontroller.html
   */
  export interface DeploymentControllerProperty {
    /**
     * The deployment controller type to use. There are three deployment controller types available:.
     *
     * - **ECS** - The rolling update ( `ECS` ) deployment type involves replacing the current running version of the container with the latest version. The number of containers Amazon ECS adds or removes from the service during a rolling update is controlled by adjusting the minimum and maximum number of healthy tasks allowed during a service deployment, as specified in the [DeploymentConfiguration](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeploymentConfiguration.html) .
     * - **CODE_DEPLOY** - The blue/green ( `CODE_DEPLOY` ) deployment type uses the blue/green deployment model powered by AWS CodeDeploy , which allows you to verify a new deployment of a service before sending production traffic to it.
     * - **EXTERNAL** - The external ( `EXTERNAL` ) deployment type enables you to use any third-party deployment controller for full control over the deployment process for an Amazon ECS service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentcontroller.html#cfn-ecs-service-deploymentcontroller-type
     */
    readonly type?: string;
  }

  /**
   * The `ServiceRegistry` property specifies details of the service registry.
   *
   * For more information, see [Service Discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceregistry.html
   */
  export interface ServiceRegistryProperty {
    /**
     * The container name value to be used for your service discovery service.
     *
     * It's already specified in the task definition. If the task definition that your service task specifies uses the `bridge` or `host` network mode, you must specify a `containerName` and `containerPort` combination from the task definition. If the task definition that your service task specifies uses the `awsvpc` network mode and a type SRV DNS record is used, you must specify either a `containerName` and `containerPort` combination or a `port` value. However, you can't specify both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceregistry.html#cfn-ecs-service-serviceregistry-containername
     */
    readonly containerName?: string;

    /**
     * The port value to be used for your service discovery service.
     *
     * It's already specified in the task definition. If the task definition your service task specifies uses the `bridge` or `host` network mode, you must specify a `containerName` and `containerPort` combination from the task definition. If the task definition your service task specifies uses the `awsvpc` network mode and a type SRV DNS record is used, you must specify either a `containerName` and `containerPort` combination or a `port` value. However, you can't specify both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceregistry.html#cfn-ecs-service-serviceregistry-containerport
     */
    readonly containerPort?: number;

    /**
     * The port value used if your service discovery service specified an SRV record.
     *
     * This field might be used if both the `awsvpc` network mode and SRV records are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceregistry.html#cfn-ecs-service-serviceregistry-port
     */
    readonly port?: number;

    /**
     * The Amazon Resource Name (ARN) of the service registry.
     *
     * The currently supported service registry is AWS Cloud Map . For more information, see [CreateService](https://docs.aws.amazon.com/cloud-map/latest/api/API_CreateService.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-serviceregistry.html#cfn-ecs-service-serviceregistry-registryarn
     */
    readonly registryArn?: string;
  }

  /**
   * The details of a capacity provider strategy.
   *
   * A capacity provider strategy can be set when using the `RunTask` or `CreateService` APIs or as the default capacity provider strategy for a cluster with the `CreateCluster` API.
   *
   * Only capacity providers that are already associated with a cluster and have an `ACTIVE` or `UPDATING` status can be used in a capacity provider strategy. The `PutClusterCapacityProviders` API is used to associate a capacity provider with a cluster.
   *
   * If specifying a capacity provider that uses an Auto Scaling group, the capacity provider must already be created. New Auto Scaling group capacity providers can be created with the `CreateCapacityProvider` API operation.
   *
   * To use an AWS Fargate capacity provider, specify either the `FARGATE` or `FARGATE_SPOT` capacity providers. The AWS Fargate capacity providers are available to all accounts and only need to be associated with a cluster to be used in a capacity provider strategy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html
   */
  export interface CapacityProviderStrategyItemProperty {
    /**
     * The *base* value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a *base* defined. If no value is specified, the default value of `0` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-base
     */
    readonly base?: number;

    /**
     * The short name of the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-capacityprovider
     */
    readonly capacityProvider?: string;

    /**
     * The *weight* value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
     *
     * The `weight` value is taken into consideration after the `base` value, if defined, is satisfied.
     *
     * If no `weight` value is specified, the default value of `0` is used. When multiple capacity providers are specified within a capacity provider strategy, at least one of the capacity providers must have a weight value greater than zero and any capacity providers with a weight of `0` can't be used to place tasks. If you specify multiple capacity providers in a strategy that all have a weight of `0` , any `RunTask` or `CreateService` actions using the capacity provider strategy will fail.
     *
     * An example scenario for using weights is defining a strategy that contains two capacity providers and both have a weight of `1` , then when the `base` is satisfied, the tasks will be split evenly across the two capacity providers. Using that same logic, if you specify a weight of `1` for *capacityProviderA* and a weight of `4` for *capacityProviderB* , then for every one task that's run using *capacityProviderA* , four tasks would use *capacityProviderB* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * The `NetworkConfiguration` property specifies an object representing the network configuration for a task or service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * The VPC subnets and security groups that are associated with a task.
     *
     * > All specified subnets and security groups must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html#cfn-ecs-service-networkconfiguration-awsvpcconfiguration
     */
    readonly awsvpcConfiguration?: CfnService.AwsVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * An object representing the networking details for a task or service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html
   */
  export interface AwsVpcConfigurationProperty {
    /**
     * Whether the task's elastic network interface receives a public IP address.
     *
     * The default value is `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;

    /**
     * The IDs of the security groups associated with the task or service.
     *
     * If you don't specify a security group, the default security group for the VPC is used. There's a limit of 5 security groups that can be specified per `AwsVpcConfiguration` .
     *
     * > All specified security groups must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * The IDs of the subnets associated with the task or service.
     *
     * There's a limit of 16 subnets that can be specified per `AwsVpcConfiguration` .
     *
     * > All specified subnets must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-subnets
     */
    readonly subnets?: Array<string>;
  }

  /**
   * The `DeploymentConfiguration` property specifies optional deployment parameters that control how many tasks run during the deployment and the ordering of stopping and starting tasks.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html
   */
  export interface DeploymentConfigurationProperty {
    /**
     * Information about the CloudWatch alarms.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-alarms
     */
    readonly alarms?: CfnService.DeploymentAlarmsProperty | cdk.IResolvable;

    /**
     * > The deployment circuit breaker can only be used for services using the rolling update ( `ECS` ) deployment type.
     *
     * The *deployment circuit breaker* determines whether a service deployment will fail if the service can't reach a steady state. If you use the deployment circuit breaker, a service deployment will transition to a failed state and stop launching new tasks. If you use the rollback option, when a service deployment fails, the service is rolled back to the last deployment that completed successfully. For more information, see [Rolling update](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html) in the *Amazon Elastic Container Service Developer Guide*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-deploymentcircuitbreaker
     */
    readonly deploymentCircuitBreaker?: CfnService.DeploymentCircuitBreakerProperty | cdk.IResolvable;

    /**
     * If a service is using the rolling update ( `ECS` ) deployment type, the `maximumPercent` parameter represents an upper limit on the number of your service's tasks that are allowed in the `RUNNING` or `PENDING` state during a deployment, as a percentage of the `desiredCount` (rounded down to the nearest integer).
     *
     * This parameter enables you to define the deployment batch size. For example, if your service is using the `REPLICA` service scheduler and has a `desiredCount` of four tasks and a `maximumPercent` value of 200%, the scheduler may start four new tasks before stopping the four older tasks (provided that the cluster resources required to do this are available). The default `maximumPercent` value for a service using the `REPLICA` service scheduler is 200%.
     *
     * If a service is using either the blue/green ( `CODE_DEPLOY` ) or `EXTERNAL` deployment types and tasks that use the EC2 launch type, the *maximum percent* value is set to the default value and is used to define the upper limit on the number of the tasks in the service that remain in the `RUNNING` state while the container instances are in the `DRAINING` state. If the tasks in the service use the Fargate launch type, the maximum percent value is not used, although it is returned when describing your service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-maximumpercent
     */
    readonly maximumPercent?: number;

    /**
     * If a service is using the rolling update ( `ECS` ) deployment type, the `minimumHealthyPercent` represents a lower limit on the number of your service's tasks that must remain in the `RUNNING` state during a deployment, as a percentage of the `desiredCount` (rounded up to the nearest integer).
     *
     * This parameter enables you to deploy without using additional cluster capacity. For example, if your service has a `desiredCount` of four tasks and a `minimumHealthyPercent` of 50%, the service scheduler may stop two existing tasks to free up cluster capacity before starting two new tasks.
     *
     * For services that *do not* use a load balancer, the following should be noted:
     *
     * - A service is considered healthy if all essential containers within the tasks in the service pass their health checks.
     * - If a task has no essential containers with a health check defined, the service scheduler will wait for 40 seconds after a task reaches a `RUNNING` state before the task is counted towards the minimum healthy percent total.
     * - If a task has one or more essential containers with a health check defined, the service scheduler will wait for the task to reach a healthy status before counting it towards the minimum healthy percent total. A task is considered healthy when all essential containers within the task have passed their health checks. The amount of time the service scheduler can wait for is determined by the container health check settings.
     *
     * For services are that *do* use a load balancer, the following should be noted:
     *
     * - If a task has no essential containers with a health check defined, the service scheduler will wait for the load balancer target group health check to return a healthy status before counting the task towards the minimum healthy percent total.
     * - If a task has an essential container with a health check defined, the service scheduler will wait for both the task to reach a healthy status and the load balancer target group health check to return a healthy status before counting the task towards the minimum healthy percent total.
     *
     * If a service is using either the blue/green ( `CODE_DEPLOY` ) or `EXTERNAL` deployment types and is running tasks that use the EC2 launch type, the *minimum healthy percent* value is set to the default value and is used to define the lower limit on the number of the tasks in the service that remain in the `RUNNING` state while the container instances are in the `DRAINING` state. If a service is using either the blue/green ( `CODE_DEPLOY` ) or `EXTERNAL` deployment types and is running tasks that use the Fargate launch type, the minimum healthy percent value is not used, although it is returned when describing your service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentconfiguration.html#cfn-ecs-service-deploymentconfiguration-minimumhealthypercent
     */
    readonly minimumHealthyPercent?: number;
  }

  /**
   * One of the methods which provide a way for you to quickly identify when a deployment has failed, and then to optionally roll back the failure to the last working deployment.
   *
   * When the alarms are generated, Amazon ECS sets the service deployment to failed. Set the rollback parameter to have Amazon ECS to roll back your service to the last completed deployment after a failure.
   *
   * You can only use the `DeploymentAlarms` method to detect failures when the `DeploymentController` is set to `ECS` (rolling update).
   *
   * For more information, see [Rolling update](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html) in the **Amazon Elastic Container Service Developer Guide** .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentalarms.html
   */
  export interface DeploymentAlarmsProperty {
    /**
     * One or more CloudWatch alarm names.
     *
     * Use a "," to separate the alarms.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentalarms.html#cfn-ecs-service-deploymentalarms-alarmnames
     */
    readonly alarmNames: Array<string>;

    /**
     * Determines whether to use the CloudWatch alarm option in the service deployment process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentalarms.html#cfn-ecs-service-deploymentalarms-enable
     */
    readonly enable: boolean | cdk.IResolvable;

    /**
     * Determines whether to configure Amazon ECS to roll back the service if a service deployment fails.
     *
     * If rollback is used, when a service deployment fails, the service is rolled back to the last deployment that completed successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentalarms.html#cfn-ecs-service-deploymentalarms-rollback
     */
    readonly rollback: boolean | cdk.IResolvable;
  }

  /**
   * > The deployment circuit breaker can only be used for services using the rolling update ( `ECS` ) deployment type.
   *
   * The *deployment circuit breaker* determines whether a service deployment will fail if the service can't reach a steady state. If it is turned on, a service deployment will transition to a failed state and stop launching new tasks. You can also configure Amazon ECS to roll back your service to the last completed deployment after a failure. For more information, see [Rolling update](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * For more information about API failure reasons, see [API failure reasons](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/api_failures_messages.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentcircuitbreaker.html
   */
  export interface DeploymentCircuitBreakerProperty {
    /**
     * Determines whether to use the deployment circuit breaker logic for the service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentcircuitbreaker.html#cfn-ecs-service-deploymentcircuitbreaker-enable
     */
    readonly enable: boolean | cdk.IResolvable;

    /**
     * Determines whether to configure Amazon ECS to roll back the service if a service deployment fails.
     *
     * If rollback is on, when a service deployment fails, the service is rolled back to the last deployment that completed successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-deploymentcircuitbreaker.html#cfn-ecs-service-deploymentcircuitbreaker-rollback
     */
    readonly rollback: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicevolumeconfiguration.html
   */
  export interface ServiceVolumeConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicevolumeconfiguration.html#cfn-ecs-service-servicevolumeconfiguration-managedebsvolume
     */
    readonly managedEbsVolume?: cdk.IResolvable | CfnService.ServiceManagedEBSVolumeConfigurationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicevolumeconfiguration.html#cfn-ecs-service-servicevolumeconfiguration-name
     */
    readonly name: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html
   */
  export interface ServiceManagedEBSVolumeConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-filesystemtype
     */
    readonly filesystemType?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-iops
     */
    readonly iops?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-sizeingib
     */
    readonly sizeInGiB?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-snapshotid
     */
    readonly snapshotId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-tagspecifications
     */
    readonly tagSpecifications?: Array<CfnService.EBSTagSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-throughput
     */
    readonly throughput?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-servicemanagedebsvolumeconfiguration.html#cfn-ecs-service-servicemanagedebsvolumeconfiguration-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-ebstagspecification.html
   */
  export interface EBSTagSpecificationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-ebstagspecification.html#cfn-ecs-service-ebstagspecification-propagatetags
     */
    readonly propagateTags?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-ebstagspecification.html#cfn-ecs-service-ebstagspecification-resourcetype
     */
    readonly resourceType: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-ebstagspecification.html#cfn-ecs-service-ebstagspecification-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }
}

/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html
 */
export interface CfnServiceProps {
  /**
   * The capacity provider strategy to use for the service.
   *
   * If a `capacityProviderStrategy` is specified, the `launchType` parameter must be omitted. If no `capacityProviderStrategy` or `launchType` is specified, the `defaultCapacityProviderStrategy` for the cluster is used.
   *
   * A capacity provider strategy may contain a maximum of 6 capacity providers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-capacityproviderstrategy
   */
  readonly capacityProviderStrategy?: Array<CfnService.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that you run your service on.
   *
   * If you do not specify a cluster, the default cluster is assumed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-cluster
   */
  readonly cluster?: string;

  /**
   * Optional deployment parameters that control how many tasks run during the deployment and the ordering of stopping and starting tasks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-deploymentconfiguration
   */
  readonly deploymentConfiguration?: CfnService.DeploymentConfigurationProperty | cdk.IResolvable;

  /**
   * The deployment controller to use for the service.
   *
   * If no deployment controller is specified, the default value of `ECS` is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-deploymentcontroller
   */
  readonly deploymentController?: CfnService.DeploymentControllerProperty | cdk.IResolvable;

  /**
   * The number of instantiations of the specified task definition to place and keep running in your service.
   *
   * For new services, if a desired count is not specified, a default value of `1` is used. When using the `DAEMON` scheduling strategy, the desired count is not required.
   *
   * For existing services, if a desired count is not specified, it is omitted from the operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-desiredcount
   */
  readonly desiredCount?: number;

  /**
   * Specifies whether to turn on Amazon ECS managed tags for the tasks within the service.
   *
   * For more information, see [Tagging your Amazon ECS resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * When you use Amazon ECS managed tags, you need to set the `propagateTags` request parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-enableecsmanagedtags
   */
  readonly enableEcsManagedTags?: boolean | cdk.IResolvable;

  /**
   * Determines whether the execute command functionality is turned on for the service.
   *
   * If `true` , the execute command functionality is turned on for all containers in tasks as part of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-enableexecutecommand
   */
  readonly enableExecuteCommand?: boolean | cdk.IResolvable;

  /**
   * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy Elastic Load Balancing target health checks after a task has first started.
   *
   * This is only used when your service is configured to use a load balancer. If your service has a load balancer defined and you don't specify a health check grace period value, the default value of `0` is used.
   *
   * If you do not use an Elastic Load Balancing, we recommend that you use the `startPeriod` in the task definition health check parameters. For more information, see [Health check](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_HealthCheck.html) .
   *
   * If your service's tasks take a while to start and respond to Elastic Load Balancing health checks, you can specify a health check grace period of up to 2,147,483,647 seconds (about 69 years). During that time, the Amazon ECS service scheduler ignores health check status. This grace period can prevent the service scheduler from marking tasks as unhealthy and stopping them before they have time to come up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-healthcheckgraceperiodseconds
   */
  readonly healthCheckGracePeriodSeconds?: number;

  /**
   * The launch type on which to run your service.
   *
   * For more information, see [Amazon ECS Launch Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-launchtype
   */
  readonly launchType?: string;

  /**
   * A list of load balancer objects to associate with the service.
   *
   * If you specify the `Role` property, `LoadBalancers` must be specified as well. For information about the number of load balancers that you can specify per service, see [Service Load Balancing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-loadbalancers
   */
  readonly loadBalancers?: Array<cdk.IResolvable | CfnService.LoadBalancerProperty> | cdk.IResolvable;

  /**
   * The network configuration for the service.
   *
   * This parameter is required for task definitions that use the `awsvpc` network mode to receive their own elastic network interface, and it is not supported for other network modes. For more information, see [Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnService.NetworkConfigurationProperty;

  /**
   * An array of placement constraint objects to use for tasks in your service.
   *
   * You can specify a maximum of 10 constraints for each task. This limit includes constraints in the task definition and those specified at runtime.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-placementconstraints
   */
  readonly placementConstraints?: Array<cdk.IResolvable | CfnService.PlacementConstraintProperty> | cdk.IResolvable;

  /**
   * The placement strategy objects to use for tasks in your service.
   *
   * You can specify a maximum of 5 strategy rules for each service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-placementstrategies
   */
  readonly placementStrategies?: Array<cdk.IResolvable | CfnService.PlacementStrategyProperty> | cdk.IResolvable;

  /**
   * The platform version that your tasks in the service are running on.
   *
   * A platform version is specified only for tasks using the Fargate launch type. If one isn't specified, the `LATEST` platform version is used. For more information, see [AWS Fargate platform versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @default - "LATEST"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-platformversion
   */
  readonly platformVersion?: string;

  /**
   * Specifies whether to propagate the tags from the task definition to the task.
   *
   * If no value is specified, the tags aren't propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the [TagResource](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_TagResource.html) API action.
   *
   * The default is `NONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-propagatetags
   */
  readonly propagateTags?: string;

  /**
   * The name or full Amazon Resource Name (ARN) of the IAM role that allows Amazon ECS to make calls to your load balancer on your behalf.
   *
   * This parameter is only permitted if you are using a load balancer with your service and your task definition doesn't use the `awsvpc` network mode. If you specify the `role` parameter, you must also specify a load balancer object with the `loadBalancers` parameter.
   *
   * > If your account has already created the Amazon ECS service-linked role, that role is used for your service unless you specify a role here. The service-linked role is required if your task definition uses the `awsvpc` network mode or if the service is configured to use service discovery, an external deployment controller, multiple target groups, or Elastic Inference accelerators in which case you don't specify a role here. For more information, see [Using service-linked roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using-service-linked-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * If your specified role has a path other than `/` , then you must either specify the full role ARN (this is recommended) or prefix the role name with the path. For example, if a role with the name `bar` has a path of `/foo/` then you would specify `/foo/bar` as the role name. For more information, see [Friendly names and paths](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-friendly-names) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-role
   */
  readonly role?: string;

  /**
   * The scheduling strategy to use for the service. For more information, see [Services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html) .
   *
   * There are two service scheduler strategies available:
   *
   * - `REPLICA` -The replica scheduling strategy places and maintains the desired number of tasks across your cluster. By default, the service scheduler spreads tasks across Availability Zones. You can use task placement strategies and constraints to customize task placement decisions. This scheduler strategy is required if the service uses the `CODE_DEPLOY` or `EXTERNAL` deployment controller types.
   * - `DAEMON` -The daemon scheduling strategy deploys exactly one task on each active container instance that meets all of the task placement constraints that you specify in your cluster. The service scheduler also evaluates the task placement constraints for running tasks and will stop tasks that don't meet the placement constraints. When you're using this strategy, you don't need to specify a desired number of tasks, a task placement strategy, or use Service Auto Scaling policies.
   *
   * > Tasks using the Fargate launch type or the `CODE_DEPLOY` or `EXTERNAL` deployment controller types don't support the `DAEMON` scheduling strategy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-schedulingstrategy
   */
  readonly schedulingStrategy?: string;

  /**
   * The configuration for this service to discover and connect to services, and be discovered by, and connected from, other services within a namespace.
   *
   * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-serviceconnectconfiguration
   */
  readonly serviceConnectConfiguration?: cdk.IResolvable | CfnService.ServiceConnectConfigurationProperty;

  /**
   * The name of your service.
   *
   * Up to 255 letters (uppercase and lowercase), numbers, underscores, and hyphens are allowed. Service names must be unique within a cluster, but you can have similarly named services in multiple clusters within a Region or across multiple Regions.
   *
   * > The stack update fails if you change any properties that require replacement and the `ServiceName` is configured. This is because AWS CloudFormation creates the replacement service first, but each `ServiceName` must be unique in the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-servicename
   */
  readonly serviceName?: string;

  /**
   * The details of the service discovery registry to associate with this service. For more information, see [Service discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html) .
   *
   * > Each service may be associated with one service registry. Multiple service registries for each service isn't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-serviceregistries
   */
  readonly serviceRegistries?: Array<cdk.IResolvable | CfnService.ServiceRegistryProperty> | cdk.IResolvable;

  /**
   * The metadata that you apply to the service to help you categorize and organize them.
   *
   * Each tag consists of a key and an optional value, both of which you define. When a service is deleted, the tags are deleted as well.
   *
   * The following basic restrictions apply to tags:
   *
   * - Maximum number of tags per resource - 50
   * - For each resource, each tag key must be unique, and each tag key can have only one value.
   * - Maximum key length - 128 Unicode characters in UTF-8
   * - Maximum value length - 256 Unicode characters in UTF-8
   * - If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
   * - Tag keys and values are case-sensitive.
   * - Do not use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You cannot edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The `family` and `revision` ( `family:revision` ) or full ARN of the task definition to run in your service.
   *
   * If a `revision` isn't specified, the latest `ACTIVE` revision is used.
   *
   * A task definition must be specified if the service uses either the `ECS` or `CODE_DEPLOY` deployment controllers.
   *
   * For more information about deployment types, see [Amazon ECS deployment types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-taskdefinition
   */
  readonly taskDefinition?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-volumeconfigurations
   */
  readonly volumeConfigurations?: Array<cdk.IResolvable | CfnService.ServiceVolumeConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnServicePlacementConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePlacementConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnServicePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.PlacementConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.PlacementConstraintProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoadBalancerProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBalancerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceLoadBalancerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.validateString)(properties.loadBalancerName));
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  return errors.wrap("supplied properties not correct for \"LoadBalancerProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceLoadBalancerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceLoadBalancerPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "LoadBalancerName": cdk.stringToCloudFormation(properties.loadBalancerName),
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn)
  };
}

// @ts-ignore TS6133
function CfnServiceLoadBalancerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.LoadBalancerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.LoadBalancerProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("loadBalancerName", "LoadBalancerName", (properties.LoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName) : undefined));
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceConnectClientAliasProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceConnectClientAliasProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceConnectClientAliasPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dnsName", cdk.validateString)(properties.dnsName));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"ServiceConnectClientAliasProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceConnectClientAliasPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceConnectClientAliasPropertyValidator(properties).assertSuccess();
  return {
    "DnsName": cdk.stringToCloudFormation(properties.dnsName),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceConnectClientAliasPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceConnectClientAliasProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceConnectClientAliasProperty>();
  ret.addPropertyResult("dnsName", "DnsName", (properties.DnsName != null ? cfn_parse.FromCloudFormation.getString(properties.DnsName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceConnectServiceProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceConnectServiceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceConnectServicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientAliases", cdk.listValidator(CfnServiceServiceConnectClientAliasPropertyValidator))(properties.clientAliases));
  errors.collect(cdk.propertyValidator("discoveryName", cdk.validateString)(properties.discoveryName));
  errors.collect(cdk.propertyValidator("ingressPortOverride", cdk.validateNumber)(properties.ingressPortOverride));
  errors.collect(cdk.propertyValidator("portName", cdk.requiredValidator)(properties.portName));
  errors.collect(cdk.propertyValidator("portName", cdk.validateString)(properties.portName));
  return errors.wrap("supplied properties not correct for \"ServiceConnectServiceProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceConnectServicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceConnectServicePropertyValidator(properties).assertSuccess();
  return {
    "ClientAliases": cdk.listMapper(convertCfnServiceServiceConnectClientAliasPropertyToCloudFormation)(properties.clientAliases),
    "DiscoveryName": cdk.stringToCloudFormation(properties.discoveryName),
    "IngressPortOverride": cdk.numberToCloudFormation(properties.ingressPortOverride),
    "PortName": cdk.stringToCloudFormation(properties.portName)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceConnectServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceConnectServiceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceConnectServiceProperty>();
  ret.addPropertyResult("clientAliases", "ClientAliases", (properties.ClientAliases != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceServiceConnectClientAliasPropertyFromCloudFormation)(properties.ClientAliases) : undefined));
  ret.addPropertyResult("discoveryName", "DiscoveryName", (properties.DiscoveryName != null ? cfn_parse.FromCloudFormation.getString(properties.DiscoveryName) : undefined));
  ret.addPropertyResult("ingressPortOverride", "IngressPortOverride", (properties.IngressPortOverride != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngressPortOverride) : undefined));
  ret.addPropertyResult("portName", "PortName", (properties.PortName != null ? cfn_parse.FromCloudFormation.getString(properties.PortName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecretProperty`
 *
 * @param properties - the TypeScript properties of a `SecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.requiredValidator)(properties.valueFrom));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.validateString)(properties.valueFrom));
  return errors.wrap("supplied properties not correct for \"SecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceSecretPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ValueFrom": cdk.stringToCloudFormation(properties.valueFrom)
  };
}

// @ts-ignore TS6133
function CfnServiceSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.SecretProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.SecretProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("valueFrom", "ValueFrom", (properties.ValueFrom != null ? cfn_parse.FromCloudFormation.getString(properties.ValueFrom) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDriver", cdk.validateString)(properties.logDriver));
  errors.collect(cdk.propertyValidator("options", cdk.hashValidator(cdk.validateString))(properties.options));
  errors.collect(cdk.propertyValidator("secretOptions", cdk.listValidator(CfnServiceSecretPropertyValidator))(properties.secretOptions));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogDriver": cdk.stringToCloudFormation(properties.logDriver),
    "Options": cdk.hashMapper(cdk.stringToCloudFormation)(properties.options),
    "SecretOptions": cdk.listMapper(convertCfnServiceSecretPropertyToCloudFormation)(properties.secretOptions)
  };
}

// @ts-ignore TS6133
function CfnServiceLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.LogConfigurationProperty>();
  ret.addPropertyResult("logDriver", "LogDriver", (properties.LogDriver != null ? cfn_parse.FromCloudFormation.getString(properties.LogDriver) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Options) : undefined));
  ret.addPropertyResult("secretOptions", "SecretOptions", (properties.SecretOptions != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceSecretPropertyFromCloudFormation)(properties.SecretOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceConnectConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceConnectConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceConnectConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnServiceLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("services", cdk.listValidator(CfnServiceServiceConnectServicePropertyValidator))(properties.services));
  return errors.wrap("supplied properties not correct for \"ServiceConnectConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceConnectConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceConnectConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LogConfiguration": convertCfnServiceLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Services": cdk.listMapper(convertCfnServiceServiceConnectServicePropertyToCloudFormation)(properties.services)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceConnectConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceConnectConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceConnectConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnServiceLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("services", "Services", (properties.Services != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceServiceConnectServicePropertyFromCloudFormation)(properties.Services) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnServicePlacementStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePlacementStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnServicePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.PlacementStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.PlacementStrategyProperty>();
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentControllerProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentControllerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceDeploymentControllerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DeploymentControllerProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceDeploymentControllerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceDeploymentControllerPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnServiceDeploymentControllerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.DeploymentControllerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.DeploymentControllerProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceRegistryProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceRegistryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceRegistryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("registryArn", cdk.validateString)(properties.registryArn));
  return errors.wrap("supplied properties not correct for \"ServiceRegistryProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceRegistryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceRegistryPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "Port": cdk.numberToCloudFormation(properties.port),
    "RegistryArn": cdk.stringToCloudFormation(properties.registryArn)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceRegistryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceRegistryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceRegistryProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("registryArn", "RegistryArn", (properties.RegistryArn != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceCapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("base", cdk.validateNumber)(properties.base));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.validateString)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CapacityProviderStrategyItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceCapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnServiceCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.CapacityProviderStrategyItemProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceAwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignPublicIp", cdk.validateString)(properties.assignPublicIp));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"AwsVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceAwsVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnServiceAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.AwsVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.AwsVpcConfigurationProperty>();
  ret.addPropertyResult("assignPublicIp", "AssignPublicIp", (properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsvpcConfiguration", CfnServiceAwsVpcConfigurationPropertyValidator)(properties.awsvpcConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AwsvpcConfiguration": convertCfnServiceAwsVpcConfigurationPropertyToCloudFormation(properties.awsvpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.NetworkConfigurationProperty>();
  ret.addPropertyResult("awsvpcConfiguration", "AwsvpcConfiguration", (properties.AwsvpcConfiguration != null ? CfnServiceAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsvpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentAlarmsProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentAlarmsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceDeploymentAlarmsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmNames", cdk.requiredValidator)(properties.alarmNames));
  errors.collect(cdk.propertyValidator("alarmNames", cdk.listValidator(cdk.validateString))(properties.alarmNames));
  errors.collect(cdk.propertyValidator("enable", cdk.requiredValidator)(properties.enable));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  errors.collect(cdk.propertyValidator("rollback", cdk.requiredValidator)(properties.rollback));
  errors.collect(cdk.propertyValidator("rollback", cdk.validateBoolean)(properties.rollback));
  return errors.wrap("supplied properties not correct for \"DeploymentAlarmsProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceDeploymentAlarmsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceDeploymentAlarmsPropertyValidator(properties).assertSuccess();
  return {
    "AlarmNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.alarmNames),
    "Enable": cdk.booleanToCloudFormation(properties.enable),
    "Rollback": cdk.booleanToCloudFormation(properties.rollback)
  };
}

// @ts-ignore TS6133
function CfnServiceDeploymentAlarmsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.DeploymentAlarmsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.DeploymentAlarmsProperty>();
  ret.addPropertyResult("alarmNames", "AlarmNames", (properties.AlarmNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AlarmNames) : undefined));
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addPropertyResult("rollback", "Rollback", (properties.Rollback != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Rollback) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentCircuitBreakerProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentCircuitBreakerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceDeploymentCircuitBreakerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enable", cdk.requiredValidator)(properties.enable));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  errors.collect(cdk.propertyValidator("rollback", cdk.requiredValidator)(properties.rollback));
  errors.collect(cdk.propertyValidator("rollback", cdk.validateBoolean)(properties.rollback));
  return errors.wrap("supplied properties not correct for \"DeploymentCircuitBreakerProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceDeploymentCircuitBreakerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceDeploymentCircuitBreakerPropertyValidator(properties).assertSuccess();
  return {
    "Enable": cdk.booleanToCloudFormation(properties.enable),
    "Rollback": cdk.booleanToCloudFormation(properties.rollback)
  };
}

// @ts-ignore TS6133
function CfnServiceDeploymentCircuitBreakerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.DeploymentCircuitBreakerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.DeploymentCircuitBreakerProperty>();
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addPropertyResult("rollback", "Rollback", (properties.Rollback != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Rollback) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceDeploymentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarms", CfnServiceDeploymentAlarmsPropertyValidator)(properties.alarms));
  errors.collect(cdk.propertyValidator("deploymentCircuitBreaker", CfnServiceDeploymentCircuitBreakerPropertyValidator)(properties.deploymentCircuitBreaker));
  errors.collect(cdk.propertyValidator("maximumPercent", cdk.validateNumber)(properties.maximumPercent));
  errors.collect(cdk.propertyValidator("minimumHealthyPercent", cdk.validateNumber)(properties.minimumHealthyPercent));
  return errors.wrap("supplied properties not correct for \"DeploymentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceDeploymentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceDeploymentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Alarms": convertCfnServiceDeploymentAlarmsPropertyToCloudFormation(properties.alarms),
    "DeploymentCircuitBreaker": convertCfnServiceDeploymentCircuitBreakerPropertyToCloudFormation(properties.deploymentCircuitBreaker),
    "MaximumPercent": cdk.numberToCloudFormation(properties.maximumPercent),
    "MinimumHealthyPercent": cdk.numberToCloudFormation(properties.minimumHealthyPercent)
  };
}

// @ts-ignore TS6133
function CfnServiceDeploymentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.DeploymentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.DeploymentConfigurationProperty>();
  ret.addPropertyResult("alarms", "Alarms", (properties.Alarms != null ? CfnServiceDeploymentAlarmsPropertyFromCloudFormation(properties.Alarms) : undefined));
  ret.addPropertyResult("deploymentCircuitBreaker", "DeploymentCircuitBreaker", (properties.DeploymentCircuitBreaker != null ? CfnServiceDeploymentCircuitBreakerPropertyFromCloudFormation(properties.DeploymentCircuitBreaker) : undefined));
  ret.addPropertyResult("maximumPercent", "MaximumPercent", (properties.MaximumPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumPercent) : undefined));
  ret.addPropertyResult("minimumHealthyPercent", "MinimumHealthyPercent", (properties.MinimumHealthyPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumHealthyPercent) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EBSTagSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EBSTagSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceEBSTagSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateString)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"EBSTagSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceEBSTagSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceEBSTagSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "PropagateTags": cdk.stringToCloudFormation(properties.propagateTags),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServiceEBSTagSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.EBSTagSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.EBSTagSpecificationProperty>();
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceManagedEBSVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceManagedEBSVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceManagedEBSVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("filesystemType", cdk.validateString)(properties.filesystemType));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.validateNumber)(properties.sizeInGiB));
  errors.collect(cdk.propertyValidator("snapshotId", cdk.validateString)(properties.snapshotId));
  errors.collect(cdk.propertyValidator("tagSpecifications", cdk.listValidator(CfnServiceEBSTagSpecificationPropertyValidator))(properties.tagSpecifications));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"ServiceManagedEBSVolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceManagedEBSVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceManagedEBSVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "FilesystemType": cdk.stringToCloudFormation(properties.filesystemType),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SizeInGiB": cdk.numberToCloudFormation(properties.sizeInGiB),
    "SnapshotId": cdk.stringToCloudFormation(properties.snapshotId),
    "TagSpecifications": cdk.listMapper(convertCfnServiceEBSTagSpecificationPropertyToCloudFormation)(properties.tagSpecifications),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceManagedEBSVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceManagedEBSVolumeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceManagedEBSVolumeConfigurationProperty>();
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("filesystemType", "FilesystemType", (properties.FilesystemType != null ? cfn_parse.FromCloudFormation.getString(properties.FilesystemType) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("sizeInGiB", "SizeInGiB", (properties.SizeInGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGiB) : undefined));
  ret.addPropertyResult("snapshotId", "SnapshotId", (properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined));
  ret.addPropertyResult("tagSpecifications", "TagSpecifications", (properties.TagSpecifications != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceEBSTagSpecificationPropertyFromCloudFormation)(properties.TagSpecifications) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("managedEbsVolume", CfnServiceServiceManagedEBSVolumeConfigurationPropertyValidator)(properties.managedEbsVolume));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ServiceVolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ManagedEBSVolume": convertCfnServiceServiceManagedEBSVolumeConfigurationPropertyToCloudFormation(properties.managedEbsVolume),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceVolumeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceVolumeConfigurationProperty>();
  ret.addPropertyResult("managedEbsVolume", "ManagedEBSVolume", (properties.ManagedEBSVolume != null ? CfnServiceServiceManagedEBSVolumeConfigurationPropertyFromCloudFormation(properties.ManagedEBSVolume) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviderStrategy", cdk.listValidator(CfnServiceCapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
  errors.collect(cdk.propertyValidator("cluster", cdk.validateString)(properties.cluster));
  errors.collect(cdk.propertyValidator("deploymentConfiguration", CfnServiceDeploymentConfigurationPropertyValidator)(properties.deploymentConfiguration));
  errors.collect(cdk.propertyValidator("deploymentController", CfnServiceDeploymentControllerPropertyValidator)(properties.deploymentController));
  errors.collect(cdk.propertyValidator("desiredCount", cdk.validateNumber)(properties.desiredCount));
  errors.collect(cdk.propertyValidator("enableEcsManagedTags", cdk.validateBoolean)(properties.enableEcsManagedTags));
  errors.collect(cdk.propertyValidator("enableExecuteCommand", cdk.validateBoolean)(properties.enableExecuteCommand));
  errors.collect(cdk.propertyValidator("healthCheckGracePeriodSeconds", cdk.validateNumber)(properties.healthCheckGracePeriodSeconds));
  errors.collect(cdk.propertyValidator("launchType", cdk.validateString)(properties.launchType));
  errors.collect(cdk.propertyValidator("loadBalancers", cdk.listValidator(CfnServiceLoadBalancerPropertyValidator))(properties.loadBalancers));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnServiceNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("placementConstraints", cdk.listValidator(CfnServicePlacementConstraintPropertyValidator))(properties.placementConstraints));
  errors.collect(cdk.propertyValidator("placementStrategies", cdk.listValidator(CfnServicePlacementStrategyPropertyValidator))(properties.placementStrategies));
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateString)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("schedulingStrategy", cdk.validateString)(properties.schedulingStrategy));
  errors.collect(cdk.propertyValidator("serviceConnectConfiguration", CfnServiceServiceConnectConfigurationPropertyValidator)(properties.serviceConnectConfiguration));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceRegistries", cdk.listValidator(CfnServiceServiceRegistryPropertyValidator))(properties.serviceRegistries));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskDefinition", cdk.validateString)(properties.taskDefinition));
  errors.collect(cdk.propertyValidator("volumeConfigurations", cdk.listValidator(CfnServiceServiceVolumeConfigurationPropertyValidator))(properties.volumeConfigurations));
  return errors.wrap("supplied properties not correct for \"CfnServiceProps\"");
}

// @ts-ignore TS6133
function convertCfnServicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePropsValidator(properties).assertSuccess();
  return {
    "CapacityProviderStrategy": cdk.listMapper(convertCfnServiceCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
    "Cluster": cdk.stringToCloudFormation(properties.cluster),
    "DeploymentConfiguration": convertCfnServiceDeploymentConfigurationPropertyToCloudFormation(properties.deploymentConfiguration),
    "DeploymentController": convertCfnServiceDeploymentControllerPropertyToCloudFormation(properties.deploymentController),
    "DesiredCount": cdk.numberToCloudFormation(properties.desiredCount),
    "EnableECSManagedTags": cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
    "EnableExecuteCommand": cdk.booleanToCloudFormation(properties.enableExecuteCommand),
    "HealthCheckGracePeriodSeconds": cdk.numberToCloudFormation(properties.healthCheckGracePeriodSeconds),
    "LaunchType": cdk.stringToCloudFormation(properties.launchType),
    "LoadBalancers": cdk.listMapper(convertCfnServiceLoadBalancerPropertyToCloudFormation)(properties.loadBalancers),
    "NetworkConfiguration": convertCfnServiceNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "PlacementConstraints": cdk.listMapper(convertCfnServicePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
    "PlacementStrategies": cdk.listMapper(convertCfnServicePlacementStrategyPropertyToCloudFormation)(properties.placementStrategies),
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion),
    "PropagateTags": cdk.stringToCloudFormation(properties.propagateTags),
    "Role": cdk.stringToCloudFormation(properties.role),
    "SchedulingStrategy": cdk.stringToCloudFormation(properties.schedulingStrategy),
    "ServiceConnectConfiguration": convertCfnServiceServiceConnectConfigurationPropertyToCloudFormation(properties.serviceConnectConfiguration),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "ServiceRegistries": cdk.listMapper(convertCfnServiceServiceRegistryPropertyToCloudFormation)(properties.serviceRegistries),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskDefinition": cdk.stringToCloudFormation(properties.taskDefinition),
    "VolumeConfigurations": cdk.listMapper(convertCfnServiceServiceVolumeConfigurationPropertyToCloudFormation)(properties.volumeConfigurations)
  };
}

// @ts-ignore TS6133
function CfnServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProps>();
  ret.addPropertyResult("capacityProviderStrategy", "CapacityProviderStrategy", (properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined));
  ret.addPropertyResult("cluster", "Cluster", (properties.Cluster != null ? cfn_parse.FromCloudFormation.getString(properties.Cluster) : undefined));
  ret.addPropertyResult("deploymentConfiguration", "DeploymentConfiguration", (properties.DeploymentConfiguration != null ? CfnServiceDeploymentConfigurationPropertyFromCloudFormation(properties.DeploymentConfiguration) : undefined));
  ret.addPropertyResult("deploymentController", "DeploymentController", (properties.DeploymentController != null ? CfnServiceDeploymentControllerPropertyFromCloudFormation(properties.DeploymentController) : undefined));
  ret.addPropertyResult("desiredCount", "DesiredCount", (properties.DesiredCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredCount) : undefined));
  ret.addPropertyResult("enableEcsManagedTags", "EnableECSManagedTags", (properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined));
  ret.addPropertyResult("enableExecuteCommand", "EnableExecuteCommand", (properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined));
  ret.addPropertyResult("healthCheckGracePeriodSeconds", "HealthCheckGracePeriodSeconds", (properties.HealthCheckGracePeriodSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckGracePeriodSeconds) : undefined));
  ret.addPropertyResult("launchType", "LaunchType", (properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined));
  ret.addPropertyResult("loadBalancers", "LoadBalancers", (properties.LoadBalancers != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceLoadBalancerPropertyFromCloudFormation)(properties.LoadBalancers) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnServiceNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("placementConstraints", "PlacementConstraints", (properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnServicePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined));
  ret.addPropertyResult("placementStrategies", "PlacementStrategies", (properties.PlacementStrategies != null ? cfn_parse.FromCloudFormation.getArray(CfnServicePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategies) : undefined));
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("schedulingStrategy", "SchedulingStrategy", (properties.SchedulingStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.SchedulingStrategy) : undefined));
  ret.addPropertyResult("serviceConnectConfiguration", "ServiceConnectConfiguration", (properties.ServiceConnectConfiguration != null ? CfnServiceServiceConnectConfigurationPropertyFromCloudFormation(properties.ServiceConnectConfiguration) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("serviceRegistries", "ServiceRegistries", (properties.ServiceRegistries != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceServiceRegistryPropertyFromCloudFormation)(properties.ServiceRegistries) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskDefinition", "TaskDefinition", (properties.TaskDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinition) : undefined));
  ret.addPropertyResult("volumeConfigurations", "VolumeConfigurations", (properties.VolumeConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceServiceVolumeConfigurationPropertyFromCloudFormation)(properties.VolumeConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers a new task definition from the supplied `family` and `containerDefinitions` .
 *
 * Optionally, you can add data volumes to your containers with the `volumes` parameter. For more information about task definition parameters and defaults, see [Amazon ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_defintions.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * You can specify a role for your task with the `taskRoleArn` parameter. When you specify a role for a task, its containers can then use the latest versions of the AWS CLI or SDKs to make API requests to the AWS services that are specified in the policy that's associated with the role. For more information, see [IAM Roles for Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * You can specify a Docker networking mode for the containers in your task definition with the `networkMode` parameter. The available network modes correspond to those described in [Network settings](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#/network-settings) in the Docker run reference. If you specify the `awsvpc` network mode, the task is allocated an elastic network interface, and you must specify a `NetworkConfiguration` when you create a service or run a task with the task definition. For more information, see [Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * @cloudformationResource AWS::ECS::TaskDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html
 */
export class CfnTaskDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::TaskDefinition";

  /**
   * Build a CfnTaskDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTaskDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTaskDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the task definition.
   *
   * @cloudformationAttribute TaskDefinitionArn
   */
  public readonly attrTaskDefinitionArn: string;

  /**
   * A list of container definitions in JSON format that describe the different containers that make up your task.
   */
  public containerDefinitions?: Array<CfnTaskDefinition.ContainerDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The number of `cpu` units used by the task.
   */
  public cpu?: string;

  /**
   * The ephemeral storage settings to use for tasks run with the task definition.
   */
  public ephemeralStorage?: CfnTaskDefinition.EphemeralStorageProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the task execution role that grants the Amazon ECS container agent permission to make AWS API calls on your behalf.
   */
  public executionRoleArn?: string;

  /**
   * The name of a family that this task definition is registered to.
   */
  public family?: string;

  /**
   * The Elastic Inference accelerators to use for the containers in the task.
   */
  public inferenceAccelerators?: Array<CfnTaskDefinition.InferenceAcceleratorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The IPC resource namespace to use for the containers in the task.
   */
  public ipcMode?: string;

  /**
   * The amount (in MiB) of memory used by the task.
   */
  public memory?: string;

  /**
   * The Docker networking mode to use for the containers in the task.
   */
  public networkMode?: string;

  /**
   * The process namespace to use for the containers in the task.
   */
  public pidMode?: string;

  /**
   * An array of placement constraint objects to use for tasks.
   */
  public placementConstraints?: Array<cdk.IResolvable | CfnTaskDefinition.TaskDefinitionPlacementConstraintProperty> | cdk.IResolvable;

  /**
   * The configuration details for the App Mesh proxy.
   */
  public proxyConfiguration?: cdk.IResolvable | CfnTaskDefinition.ProxyConfigurationProperty;

  /**
   * The task launch types the task definition was validated against.
   */
  public requiresCompatibilities?: Array<string>;

  /**
   * The operating system that your tasks definitions run on.
   */
  public runtimePlatform?: cdk.IResolvable | CfnTaskDefinition.RuntimePlatformProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the task definition to help you categorize and organize them.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The short name or full Amazon Resource Name (ARN) of the AWS Identity and Access Management role that grants containers in the task permission to call AWS APIs on your behalf.
   */
  public taskRoleArn?: string;

  /**
   * The list of data volume definitions for the task.
   */
  public volumes?: Array<cdk.IResolvable | CfnTaskDefinition.VolumeProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTaskDefinitionProps = {}) {
    super(scope, id, {
      "type": CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrTaskDefinitionArn = cdk.Token.asString(this.getAtt("TaskDefinitionArn", cdk.ResolutionTypeHint.STRING));
    this.containerDefinitions = props.containerDefinitions;
    this.cpu = props.cpu;
    this.ephemeralStorage = props.ephemeralStorage;
    this.executionRoleArn = props.executionRoleArn;
    this.family = props.family;
    this.inferenceAccelerators = props.inferenceAccelerators;
    this.ipcMode = props.ipcMode;
    this.memory = props.memory;
    this.networkMode = props.networkMode;
    this.pidMode = props.pidMode;
    this.placementConstraints = props.placementConstraints;
    this.proxyConfiguration = props.proxyConfiguration;
    this.requiresCompatibilities = props.requiresCompatibilities;
    this.runtimePlatform = props.runtimePlatform;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECS::TaskDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taskRoleArn = props.taskRoleArn;
    this.volumes = props.volumes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "containerDefinitions": this.containerDefinitions,
      "cpu": this.cpu,
      "ephemeralStorage": this.ephemeralStorage,
      "executionRoleArn": this.executionRoleArn,
      "family": this.family,
      "inferenceAccelerators": this.inferenceAccelerators,
      "ipcMode": this.ipcMode,
      "memory": this.memory,
      "networkMode": this.networkMode,
      "pidMode": this.pidMode,
      "placementConstraints": this.placementConstraints,
      "proxyConfiguration": this.proxyConfiguration,
      "requiresCompatibilities": this.requiresCompatibilities,
      "runtimePlatform": this.runtimePlatform,
      "tags": this.tags.renderTags(),
      "taskRoleArn": this.taskRoleArn,
      "volumes": this.volumes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTaskDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnTaskDefinition {
  /**
   * Details on an Elastic Inference accelerator.
   *
   * For more information, see [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-inferenceaccelerator.html
   */
  export interface InferenceAcceleratorProperty {
    /**
     * The Elastic Inference accelerator device name.
     *
     * The `deviceName` must also be referenced in a container definition as a [ResourceRequirement](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ResourceRequirement.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-inferenceaccelerator.html#cfn-ecs-taskdefinition-inferenceaccelerator-devicename
     */
    readonly deviceName?: string;

    /**
     * The Elastic Inference accelerator type to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-inferenceaccelerator.html#cfn-ecs-taskdefinition-inferenceaccelerator-devicetype
     */
    readonly deviceType?: string;
  }

  /**
   * The constraint on task placement in the task definition.
   *
   * For more information, see [Task placement constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * > Task placement constraints aren't supported for tasks run on AWS Fargate .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-taskdefinitionplacementconstraint.html
   */
  export interface TaskDefinitionPlacementConstraintProperty {
    /**
     * A cluster query language expression to apply to the constraint.
     *
     * For more information, see [Cluster query language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-taskdefinitionplacementconstraint.html#cfn-ecs-taskdefinition-taskdefinitionplacementconstraint-expression
     */
    readonly expression?: string;

    /**
     * The type of constraint.
     *
     * The `MemberOf` constraint restricts selection to be from a group of valid candidates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-taskdefinitionplacementconstraint.html#cfn-ecs-taskdefinition-taskdefinitionplacementconstraint-type
     */
    readonly type: string;
  }

  /**
   * Information about the platform for the Amazon ECS service or task.
   *
   * For more information about `RuntimePlatform` , see [RuntimePlatform](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#runtime-platform) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html
   */
  export interface RuntimePlatformProperty {
    /**
     * The CPU architecture.
     *
     * You can run your Linux tasks on an ARM-based platform by setting the value to `ARM64` . This option is available for tasks that run on Linux Amazon EC2 instance or Linux containers on Fargate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-cpuarchitecture
     */
    readonly cpuArchitecture?: string;

    /**
     * The operating system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-operatingsystemfamily
     */
    readonly operatingSystemFamily?: string;
  }

  /**
   * The configuration details for the App Mesh proxy.
   *
   * For tasks that use the EC2 launch type, the container instances require at least version 1.26.0 of the container agent and at least version 1.26.0-1 of the `ecs-init` package to use a proxy configuration. If your container instances are launched from the Amazon ECS optimized AMI version `20190301` or later, then they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-proxyconfiguration.html
   */
  export interface ProxyConfigurationProperty {
    /**
     * The name of the container that will serve as the App Mesh proxy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-proxyconfiguration.html#cfn-ecs-taskdefinition-proxyconfiguration-containername
     */
    readonly containerName: string;

    /**
     * The set of network configuration parameters to provide the Container Network Interface (CNI) plugin, specified as key-value pairs.
     *
     * - `IgnoredUID` - (Required) The user ID (UID) of the proxy container as defined by the `user` parameter in a container definition. This is used to ensure the proxy ignores its own traffic. If `IgnoredGID` is specified, this field can be empty.
     * - `IgnoredGID` - (Required) The group ID (GID) of the proxy container as defined by the `user` parameter in a container definition. This is used to ensure the proxy ignores its own traffic. If `IgnoredUID` is specified, this field can be empty.
     * - `AppPorts` - (Required) The list of ports that the application uses. Network traffic to these ports is forwarded to the `ProxyIngressPort` and `ProxyEgressPort` .
     * - `ProxyIngressPort` - (Required) Specifies the port that incoming traffic to the `AppPorts` is directed to.
     * - `ProxyEgressPort` - (Required) Specifies the port that outgoing traffic from the `AppPorts` is directed to.
     * - `EgressIgnoredPorts` - (Required) The egress traffic going to the specified ports is ignored and not redirected to the `ProxyEgressPort` . It can be an empty list.
     * - `EgressIgnoredIPs` - (Required) The egress traffic going to the specified IP addresses is ignored and not redirected to the `ProxyEgressPort` . It can be an empty list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-proxyconfiguration.html#cfn-ecs-taskdefinition-proxyconfiguration-proxyconfigurationproperties
     */
    readonly proxyConfigurationProperties?: Array<cdk.IResolvable | CfnTaskDefinition.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * The proxy type.
     *
     * The only supported value is `APPMESH` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-proxyconfiguration.html#cfn-ecs-taskdefinition-proxyconfiguration-type
     */
    readonly type?: string;
  }

  /**
   * A key-value pair object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-keyvaluepair.html
   */
  export interface KeyValuePairProperty {
    /**
     * The name of the key-value pair.
     *
     * For environment variables, this is the name of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-keyvaluepair.html#cfn-ecs-taskdefinition-keyvaluepair-name
     */
    readonly name?: string;

    /**
     * The value of the key-value pair.
     *
     * For environment variables, this is the value of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-keyvaluepair.html#cfn-ecs-taskdefinition-keyvaluepair-value
     */
    readonly value?: string;
  }

  /**
   * The `Volume` property specifies a data volume used in a task definition.
   *
   * For tasks that use a Docker volume, specify a `DockerVolumeConfiguration` . For tasks that use a bind mount host volume, specify a `host` and optional `sourcePath` . For more information about `host` and optional `sourcePath` , see [Volumes](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#volumes) and [Using Data Volumes in Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html
   */
  export interface VolumeProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html#cfn-ecs-taskdefinition-volume-configuredatlaunch
     */
    readonly configuredAtLaunch?: boolean | cdk.IResolvable;

    /**
     * This parameter is specified when you use Docker volumes.
     *
     * Windows containers only support the use of the `local` driver. To use bind mounts, specify the `host` parameter instead.
     *
     * > Docker volumes aren't supported by tasks run on AWS Fargate .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html#cfn-ecs-taskdefinition-volume-dockervolumeconfiguration
     */
    readonly dockerVolumeConfiguration?: CfnTaskDefinition.DockerVolumeConfigurationProperty | cdk.IResolvable;

    /**
     * This parameter is specified when you use an Amazon Elastic File System file system for task storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html#cfn-ecs-taskdefinition-volume-efsvolumeconfiguration
     */
    readonly efsVolumeConfiguration?: CfnTaskDefinition.EFSVolumeConfigurationProperty | cdk.IResolvable;

    /**
     * This parameter is specified when you use bind mount host volumes.
     *
     * The contents of the `host` parameter determine whether your bind mount host volume persists on the host container instance and where it's stored. If the `host` parameter is empty, then the Docker daemon assigns a host path for your data volume. However, the data isn't guaranteed to persist after the containers that are associated with it stop running.
     *
     * Windows containers can mount whole directories on the same drive as `$env:ProgramData` . Windows containers can't mount directories on a different drive, and mount point can't be across drives. For example, you can mount `C:\my\path:C:\my\path` and `D:\:D:\` , but not `D:\my\path:C:\my\path` or `D:\:C:\my\path` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html#cfn-ecs-taskdefinition-volume-host
     */
    readonly host?: CfnTaskDefinition.HostVolumePropertiesProperty | cdk.IResolvable;

    /**
     * The name of the volume.
     *
     * Up to 255 letters (uppercase and lowercase), numbers, underscores, and hyphens are allowed. This name is referenced in the `sourceVolume` parameter of container definition `mountPoints` .
     *
     * This is required wwhen you use an Amazon EFS volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volume.html#cfn-ecs-taskdefinition-volume-name
     */
    readonly name?: string;
  }

  /**
   * This parameter is specified when you're using an Amazon Elastic File System file system for task storage.
   *
   * For more information, see [Amazon EFS volumes](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html
   */
  export interface EFSVolumeConfigurationProperty {
    /**
     * The authorization configuration details for the Amazon EFS file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html#cfn-ecs-taskdefinition-efsvolumeconfiguration-authorizationconfig
     */
    readonly authorizationConfig?: CfnTaskDefinition.AuthorizationConfigProperty | cdk.IResolvable;

    /**
     * The Amazon EFS file system ID to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html#cfn-ecs-taskdefinition-efsvolumeconfiguration-filesystemid
     */
    readonly filesystemId: string;

    /**
     * The directory within the Amazon EFS file system to mount as the root directory inside the host.
     *
     * If this parameter is omitted, the root of the Amazon EFS volume will be used. Specifying `/` will have the same effect as omitting this parameter.
     *
     * > If an EFS access point is specified in the `authorizationConfig` , the root directory parameter must either be omitted or set to `/` which will enforce the path set on the EFS access point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html#cfn-ecs-taskdefinition-efsvolumeconfiguration-rootdirectory
     */
    readonly rootDirectory?: string;

    /**
     * Determines whether to use encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server.
     *
     * Transit encryption must be turned on if Amazon EFS IAM authorization is used. If this parameter is omitted, the default value of `DISABLED` is used. For more information, see [Encrypting data in transit](https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html) in the *Amazon Elastic File System User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html#cfn-ecs-taskdefinition-efsvolumeconfiguration-transitencryption
     */
    readonly transitEncryption?: string;

    /**
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
     *
     * If you do not specify a transit encryption port, it will use the port selection strategy that the Amazon EFS mount helper uses. For more information, see [EFS mount helper](https://docs.aws.amazon.com/efs/latest/ug/efs-mount-helper.html) in the *Amazon Elastic File System User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-efsvolumeconfiguration.html#cfn-ecs-taskdefinition-efsvolumeconfiguration-transitencryptionport
     */
    readonly transitEncryptionPort?: number;
  }

  /**
   * The authorization configuration details for the Amazon EFS file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-authorizationconfig.html
   */
  export interface AuthorizationConfigProperty {
    /**
     * The Amazon EFS access point ID to use.
     *
     * If an access point is specified, the root directory value specified in the `EFSVolumeConfiguration` must either be omitted or set to `/` which will enforce the path set on the EFS access point. If an access point is used, transit encryption must be on in the `EFSVolumeConfiguration` . For more information, see [Working with Amazon EFS access points](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html) in the *Amazon Elastic File System User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-authorizationconfig.html#cfn-ecs-taskdefinition-authorizationconfig-accesspointid
     */
    readonly accessPointId?: string;

    /**
     * Determines whether to use the Amazon ECS task role defined in a task definition when mounting the Amazon EFS file system.
     *
     * If it is turned on, transit encryption must be turned on in the `EFSVolumeConfiguration` . If this parameter is omitted, the default value of `DISABLED` is used. For more information, see [Using Amazon EFS access points](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html#efs-volume-accesspoints) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-authorizationconfig.html#cfn-ecs-taskdefinition-authorizationconfig-iam
     */
    readonly iam?: string;
  }

  /**
   * The `HostVolumeProperties` property specifies details on a container instance bind mount host volume.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-hostvolumeproperties.html
   */
  export interface HostVolumePropertiesProperty {
    /**
     * When the `host` parameter is used, specify a `sourcePath` to declare the path on the host container instance that's presented to the container.
     *
     * If this parameter is empty, then the Docker daemon has assigned a host path for you. If the `host` parameter contains a `sourcePath` file location, then the data volume persists at the specified location on the host container instance until you delete it manually. If the `sourcePath` value doesn't exist on the host container instance, the Docker daemon creates it. If the location does exist, the contents of the source path folder are exported.
     *
     * If you're using the Fargate launch type, the `sourcePath` parameter is not supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-hostvolumeproperties.html#cfn-ecs-taskdefinition-hostvolumeproperties-sourcepath
     */
    readonly sourcePath?: string;
  }

  /**
   * The `DockerVolumeConfiguration` property specifies a Docker volume configuration and is used when you use Docker volumes.
   *
   * Docker volumes are only supported when you are using the EC2 launch type. Windows containers only support the use of the `local` driver. To use bind mounts, specify a `host` instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html
   */
  export interface DockerVolumeConfigurationProperty {
    /**
     * If this value is `true` , the Docker volume is created if it doesn't already exist.
     *
     * > This field is only used if the `scope` is `shared` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html#cfn-ecs-taskdefinition-dockervolumeconfiguration-autoprovision
     */
    readonly autoprovision?: boolean | cdk.IResolvable;

    /**
     * The Docker volume driver to use.
     *
     * The driver value must match the driver name provided by Docker because it is used for task placement. If the driver was installed using the Docker plugin CLI, use `docker plugin ls` to retrieve the driver name from your container instance. If the driver was installed using another method, use Docker plugin discovery to retrieve the driver name. For more information, see [Docker plugin discovery](https://docs.aws.amazon.com/https://docs.docker.com/engine/extend/plugin_api/#plugin-discovery) . This parameter maps to `Driver` in the [Create a volume](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/VolumeCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `xxdriver` option to [docker volume create](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/commandline/volume_create/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html#cfn-ecs-taskdefinition-dockervolumeconfiguration-driver
     */
    readonly driver?: string;

    /**
     * A map of Docker driver-specific options passed through.
     *
     * This parameter maps to `DriverOpts` in the [Create a volume](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/VolumeCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `xxopt` option to [docker volume create](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/commandline/volume_create/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html#cfn-ecs-taskdefinition-dockervolumeconfiguration-driveropts
     */
    readonly driverOpts?: cdk.IResolvable | Record<string, string>;

    /**
     * Custom metadata to add to your Docker volume.
     *
     * This parameter maps to `Labels` in the [Create a volume](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/VolumeCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `xxlabel` option to [docker volume create](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/commandline/volume_create/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html#cfn-ecs-taskdefinition-dockervolumeconfiguration-labels
     */
    readonly labels?: cdk.IResolvable | Record<string, string>;

    /**
     * The scope for the Docker volume that determines its lifecycle.
     *
     * Docker volumes that are scoped to a `task` are automatically provisioned when the task starts and destroyed when the task stops. Docker volumes that are scoped as `shared` persist after the task stops.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-dockervolumeconfiguration.html#cfn-ecs-taskdefinition-dockervolumeconfiguration-scope
     */
    readonly scope?: string;
  }

  /**
   * The `ContainerDefinition` property specifies a container definition.
   *
   * Container definitions are used in task definitions to describe the different containers that are launched as part of a task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html
   */
  export interface ContainerDefinitionProperty {
    /**
     * The command that's passed to the container.
     *
     * This parameter maps to `Cmd` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `COMMAND` parameter to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . For more information, see [https://docs.docker.com/engine/reference/builder/#cmd](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/builder/#cmd) . If there are multiple arguments, each argument is a separated string in the array.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-command
     */
    readonly command?: Array<string>;

    /**
     * The number of `cpu` units reserved for the container.
     *
     * This parameter maps to `CpuShares` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--cpu-shares` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * This field is optional for tasks using the Fargate launch type, and the only requirement is that the total amount of CPU reserved for all containers within a task be lower than the task-level `cpu` value.
     *
     * > You can determine the number of CPU units that are available per EC2 instance type by multiplying the vCPUs listed for that instance type on the [Amazon EC2 Instances](https://docs.aws.amazon.com/ec2/instance-types/) detail page by 1,024.
     *
     * Linux containers share unallocated CPU units with other containers on the container instance with the same ratio as their allocated amount. For example, if you run a single-container task on a single-core instance type with 512 CPU units specified for that container, and that's the only task running on the container instance, that container could use the full 1,024 CPU unit share at any given time. However, if you launched another copy of the same task on that container instance, each task is guaranteed a minimum of 512 CPU units when needed. Moreover, each container could float to higher CPU usage if the other container was not using it. If both tasks were 100% active all of the time, they would be limited to 512 CPU units.
     *
     * On Linux container instances, the Docker daemon on the container instance uses the CPU value to calculate the relative CPU share ratios for running containers. For more information, see [CPU share constraint](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#cpu-share-constraint) in the Docker documentation. The minimum valid CPU share value that the Linux kernel allows is 2. However, the CPU parameter isn't required, and you can use CPU values below 2 in your container definitions. For CPU values below 2 (including null), the behavior varies based on your Amazon ECS container agent version:
     *
     * - *Agent versions less than or equal to 1.1.0:* Null and zero CPU values are passed to Docker as 0, which Docker then converts to 1,024 CPU shares. CPU values of 1 are passed to Docker as 1, which the Linux kernel converts to two CPU shares.
     * - *Agent versions greater than or equal to 1.2.0:* Null, zero, and CPU values of 1 are passed to Docker as 2.
     *
     * On Windows container instances, the CPU limit is enforced as an absolute limit, or a quota. Windows containers only have access to the specified amount of CPU that's described in the task definition. A null or zero CPU value is passed to Docker as `0` , which Windows interprets as 1% of one CPU.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-cpu
     */
    readonly cpu?: number;

    /**
     * The dependencies defined for container startup and shutdown.
     *
     * A container can contain multiple dependencies. When a dependency is defined for container startup, for container shutdown it is reversed.
     *
     * For tasks using the EC2 launch type, the container instances require at least version 1.26.0 of the container agent to turn on container dependencies. However, we recommend using the latest container agent version. For information about checking your agent version and updating to the latest version, see [Updating the Amazon ECS Container Agent](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-update.html) in the *Amazon Elastic Container Service Developer Guide* . If you're using an Amazon ECS-optimized Linux AMI, your instance needs at least version 1.26.0-1 of the `ecs-init` package. If your container instances are launched from version `20190301` or later, then they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For tasks using the Fargate launch type, the task or service requires the following platforms:
     *
     * - Linux platform version `1.3.0` or later.
     * - Windows platform version `1.0.0` or later.
     *
     * If the task definition is used in a blue/green deployment that uses [AWS::CodeDeploy::DeploymentGroup BlueGreenDeploymentConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-bluegreendeploymentconfiguration.html) , the `dependsOn` parameter is not supported. For more information see [Issue #680](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/680) on the on the GitHub website.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-dependson
     */
    readonly dependsOn?: Array<CfnTaskDefinition.ContainerDependencyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * When this parameter is true, networking is off within the container.
     *
     * This parameter maps to `NetworkDisabled` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) .
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-disablenetworking
     */
    readonly disableNetworking?: boolean | cdk.IResolvable;

    /**
     * A list of DNS search domains that are presented to the container.
     *
     * This parameter maps to `DnsSearch` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--dns-search` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-dnssearchdomains
     */
    readonly dnsSearchDomains?: Array<string>;

    /**
     * A list of DNS servers that are presented to the container.
     *
     * This parameter maps to `Dns` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--dns` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-dnsservers
     */
    readonly dnsServers?: Array<string>;

    /**
     * A key/value map of labels to add to the container.
     *
     * This parameter maps to `Labels` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--label` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-dockerlabels
     */
    readonly dockerLabels?: cdk.IResolvable | Record<string, string>;

    /**
     * A list of strings to provide custom configuration for multiple security systems.
     *
     * For more information about valid values, see [Docker Run Security Configuration](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . This field isn't valid for containers in tasks using the Fargate launch type.
     *
     * For Linux tasks on EC2, this parameter can be used to reference custom labels for SELinux and AppArmor multi-level security systems.
     *
     * For any tasks on EC2, this parameter can be used to reference a credential spec file that configures a container for Active Directory authentication. For more information, see [Using gMSAs for Windows Containers](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/windows-gmsa.html) and [Using gMSAs for Linux Containers](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/linux-gmsa.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * This parameter maps to `SecurityOpt` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--security-opt` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > The Amazon ECS container agent running on a container instance must register with the `ECS_SELINUX_CAPABLE=true` or `ECS_APPARMOR_CAPABLE=true` environment variables before containers placed on that instance can use these security options. For more information, see [Amazon ECS Container Agent Configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For more information about valid values, see [Docker Run Security Configuration](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * Valid values: "no-new-privileges" | "apparmor:PROFILE" | "label:value" | "credentialspec:CredentialSpecFilePath"
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-dockersecurityoptions
     */
    readonly dockerSecurityOptions?: Array<string>;

    /**
     * > Early versions of the Amazon ECS container agent don't properly handle `entryPoint` parameters.
     *
     * If you have problems using `entryPoint` , update your container agent or enter your commands and arguments as `command` array items instead.
     *
     * The entry point that's passed to the container. This parameter maps to `Entrypoint` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--entrypoint` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . For more information, see [https://docs.docker.com/engine/reference/builder/#entrypoint](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/builder/#entrypoint) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-entrypoint
     */
    readonly entryPoint?: Array<string>;

    /**
     * The environment variables to pass to a container.
     *
     * This parameter maps to `Env` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--env` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > We don't recommend that you use plaintext environment variables for sensitive information, such as credential data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-environment
     */
    readonly environment?: Array<cdk.IResolvable | CfnTaskDefinition.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * A list of files containing the environment variables to pass to a container.
     *
     * This parameter maps to the `--env-file` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * You can specify up to ten environment files. The file must have a `.env` file extension. Each line in an environment file contains an environment variable in `VARIABLE=VALUE` format. Lines beginning with `#` are treated as comments and are ignored. For more information about the environment variable file syntax, see [Declare default environment variables in file](https://docs.aws.amazon.com/https://docs.docker.com/compose/env-file/) .
     *
     * If there are environment variables specified using the `environment` parameter in a container definition, they take precedence over the variables contained within an environment file. If multiple environment files are specified that contain the same variable, they're processed from the top down. We recommend that you use unique variable names. For more information, see [Specifying Environment Variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-environmentfiles
     */
    readonly environmentFiles?: Array<CfnTaskDefinition.EnvironmentFileProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If the `essential` parameter of a container is marked as `true` , and that container fails or stops for any reason, all other containers that are part of the task are stopped.
     *
     * If the `essential` parameter of a container is marked as `false` , its failure doesn't affect the rest of the containers in a task. If this parameter is omitted, a container is assumed to be essential.
     *
     * All tasks must have at least one essential container. If you have an application that's composed of multiple containers, group containers that are used for a common purpose into components, and separate the different components into multiple task definitions. For more information, see [Application Architecture](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/application_architecture.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-essential
     */
    readonly essential?: boolean | cdk.IResolvable;

    /**
     * A list of hostnames and IP address mappings to append to the `/etc/hosts` file on the container.
     *
     * This parameter maps to `ExtraHosts` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--add-host` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter isn't supported for Windows containers or tasks that use the `awsvpc` network mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-extrahosts
     */
    readonly extraHosts?: Array<CfnTaskDefinition.HostEntryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The FireLens configuration for the container.
     *
     * This is used to specify and configure a log router for container logs. For more information, see [Custom Log Routing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-firelensconfiguration
     */
    readonly firelensConfiguration?: CfnTaskDefinition.FirelensConfigurationProperty | cdk.IResolvable;

    /**
     * The container health check command and associated configuration parameters for the container.
     *
     * This parameter maps to `HealthCheck` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `HEALTHCHECK` parameter of [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-healthcheck
     */
    readonly healthCheck?: CfnTaskDefinition.HealthCheckProperty | cdk.IResolvable;

    /**
     * The hostname to use for your container.
     *
     * This parameter maps to `Hostname` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--hostname` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > The `hostname` parameter is not supported if you're using the `awsvpc` network mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-hostname
     */
    readonly hostname?: string;

    /**
     * The image used to start a container.
     *
     * This string is passed directly to the Docker daemon. By default, images in the Docker Hub registry are available. Other repositories are specified with either `*repository-url* / *image* : *tag*` or `*repository-url* / *image* @ *digest*` . Up to 255 letters (uppercase and lowercase), numbers, hyphens, underscores, colons, periods, forward slashes, and number signs are allowed. This parameter maps to `Image` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `IMAGE` parameter of [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * - When a new task starts, the Amazon ECS container agent pulls the latest version of the specified image and tag for the container to use. However, subsequent updates to a repository image aren't propagated to already running tasks.
     * - Images in Amazon ECR repositories can be specified by either using the full `registry/repository:tag` or `registry/repository@digest` . For example, `012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>:latest` or `012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE` .
     * - Images in official repositories on Docker Hub use a single name (for example, `ubuntu` or `mongo` ).
     * - Images in other repositories on Docker Hub are qualified with an organization name (for example, `amazon/amazon-ecs-agent` ).
     * - Images in other online repositories are qualified further by a domain name (for example, `quay.io/assemblyline/ubuntu` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-image
     */
    readonly image: string;

    /**
     * When this parameter is `true` , you can deploy containerized applications that require `stdin` or a `tty` to be allocated.
     *
     * This parameter maps to `OpenStdin` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--interactive` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-interactive
     */
    readonly interactive?: boolean | cdk.IResolvable;

    /**
     * The `links` parameter allows containers to communicate with each other without the need for port mappings.
     *
     * This parameter is only supported if the network mode of a task definition is `bridge` . The `name:internalName` construct is analogous to `name:alias` in Docker links. Up to 255 letters (uppercase and lowercase), numbers, underscores, and hyphens are allowed. For more information about linking Docker containers, go to [Legacy container links](https://docs.aws.amazon.com/https://docs.docker.com/network/links/) in the Docker documentation. This parameter maps to `Links` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--link` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter is not supported for Windows containers. > Containers that are collocated on a single container instance may be able to communicate with each other without requiring links or host port mappings. Network isolation is achieved on the container instance using security groups and VPC settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-links
     */
    readonly links?: Array<string>;

    /**
     * Linux-specific modifications that are applied to the container, such as Linux kernel capabilities. For more information see [KernelCapabilities](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_KernelCapabilities.html) .
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-linuxparameters
     */
    readonly linuxParameters?: cdk.IResolvable | CfnTaskDefinition.LinuxParametersProperty;

    /**
     * The log configuration specification for the container.
     *
     * This parameter maps to `LogConfig` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--log-driver` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . By default, containers use the same logging driver that the Docker daemon uses. However, the container may use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance (or on a different log server for remote logging options). For more information on the options for different supported log drivers, see [Configure logging drivers](https://docs.aws.amazon.com/https://docs.docker.com/engine/admin/logging/overview/) in the Docker documentation.
     *
     * > Amazon ECS currently supports a subset of the logging drivers available to the Docker daemon (shown in the [LogConfiguration](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_LogConfiguration.html) data type). Additional log drivers may be available in future releases of the Amazon ECS container agent.
     *
     * This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * > The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the `ECS_AVAILABLE_LOGGING_DRIVERS` environment variable before containers placed on that instance can use these log configuration options. For more information, see [Amazon ECS Container Agent Configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-logconfiguration
     */
    readonly logConfiguration?: cdk.IResolvable | CfnTaskDefinition.LogConfigurationProperty;

    /**
     * The amount (in MiB) of memory to present to the container.
     *
     * If your container attempts to exceed the memory specified here, the container is killed. The total amount of memory reserved for all containers within a task must be lower than the task `memory` value, if one is specified. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * If using the Fargate launch type, this parameter is optional.
     *
     * If using the EC2 launch type, you must specify either a task-level memory value or a container-level memory value. If you specify both a container-level `memory` and `memoryReservation` value, `memory` must be greater than `memoryReservation` . If you specify `memoryReservation` , then that value is subtracted from the available memory resources for the container instance where the container is placed. Otherwise, the value of `memory` is used.
     *
     * The Docker 20.10.0 or later daemon reserves a minimum of 6 MiB of memory for a container, so you should not specify fewer than 6 MiB of memory for your containers.
     *
     * The Docker 19.03.13-ce or earlier daemon reserves a minimum of 4 MiB of memory for a container, so you should not specify fewer than 4 MiB of memory for your containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-memory
     */
    readonly memory?: number;

    /**
     * The soft limit (in MiB) of memory to reserve for the container.
     *
     * When system memory is under heavy contention, Docker attempts to keep the container memory to this soft limit. However, your container can consume more memory when it needs to, up to either the hard limit specified with the `memory` parameter (if applicable), or all of the available memory on the container instance, whichever comes first. This parameter maps to `MemoryReservation` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--memory-reservation` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * If a task-level memory value is not specified, you must specify a non-zero integer for one or both of `memory` or `memoryReservation` in a container definition. If you specify both, `memory` must be greater than `memoryReservation` . If you specify `memoryReservation` , then that value is subtracted from the available memory resources for the container instance where the container is placed. Otherwise, the value of `memory` is used.
     *
     * For example, if your container normally uses 128 MiB of memory, but occasionally bursts to 256 MiB of memory for short periods of time, you can set a `memoryReservation` of 128 MiB, and a `memory` hard limit of 300 MiB. This configuration would allow the container to only reserve 128 MiB of memory from the remaining resources on the container instance, but also allow the container to consume more memory resources when needed.
     *
     * The Docker 20.10.0 or later daemon reserves a minimum of 6 MiB of memory for a container. So, don't specify less than 6 MiB of memory for your containers.
     *
     * The Docker 19.03.13-ce or earlier daemon reserves a minimum of 4 MiB of memory for a container. So, don't specify less than 4 MiB of memory for your containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-memoryreservation
     */
    readonly memoryReservation?: number;

    /**
     * The mount points for data volumes in your container.
     *
     * This parameter maps to `Volumes` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--volume` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * Windows containers can mount whole directories on the same drive as `$env:ProgramData` . Windows containers can't mount directories on a different drive, and mount point can't be across drives.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-mountpoints
     */
    readonly mountPoints?: Array<cdk.IResolvable | CfnTaskDefinition.MountPointProperty> | cdk.IResolvable;

    /**
     * The name of a container.
     *
     * If you're linking multiple containers together in a task definition, the `name` of one container can be entered in the `links` of another container to connect the containers. Up to 255 letters (uppercase and lowercase), numbers, underscores, and hyphens are allowed. This parameter maps to `name` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--name` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-name
     */
    readonly name: string;

    /**
     * The list of port mappings for the container.
     *
     * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
     *
     * For task definitions that use the `awsvpc` network mode, you should only specify the `containerPort` . The `hostPort` can be left blank or it must be the same value as the `containerPort` .
     *
     * Port mappings on Windows use the `NetNAT` gateway address rather than `localhost` . There is no loopback for port mappings on Windows, so you cannot access a container's mapped port from the host itself.
     *
     * This parameter maps to `PortBindings` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--publish` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . If the network mode of a task definition is set to `none` , then you can't specify port mappings. If the network mode of a task definition is set to `host` , then host ports must either be undefined or they must match the container port in the port mapping.
     *
     * > After a task reaches the `RUNNING` status, manual and automatic host and container port assignments are visible in the *Network Bindings* section of a container description for a selected task in the Amazon ECS console. The assignments are also visible in the `networkBindings` section [DescribeTasks](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTasks.html) responses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-portmappings
     */
    readonly portMappings?: Array<cdk.IResolvable | CfnTaskDefinition.PortMappingProperty> | cdk.IResolvable;

    /**
     * When this parameter is true, the container is given elevated privileges on the host container instance (similar to the `root` user).
     *
     * This parameter maps to `Privileged` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--privileged` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter is not supported for Windows containers or tasks run on AWS Fargate .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-privileged
     */
    readonly privileged?: boolean | cdk.IResolvable;

    /**
     * When this parameter is `true` , a TTY is allocated.
     *
     * This parameter maps to `Tty` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--tty` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-pseudoterminal
     */
    readonly pseudoTerminal?: boolean | cdk.IResolvable;

    /**
     * When this parameter is true, the container is given read-only access to its root file system.
     *
     * This parameter maps to `ReadonlyRootfs` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--read-only` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-readonlyrootfilesystem
     */
    readonly readonlyRootFilesystem?: boolean | cdk.IResolvable;

    /**
     * The private repository authentication credentials to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-repositorycredentials
     */
    readonly repositoryCredentials?: cdk.IResolvable | CfnTaskDefinition.RepositoryCredentialsProperty;

    /**
     * The type and amount of a resource to assign to a container.
     *
     * The only supported resource is a GPU.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-resourcerequirements
     */
    readonly resourceRequirements?: Array<cdk.IResolvable | CfnTaskDefinition.ResourceRequirementProperty> | cdk.IResolvable;

    /**
     * The secrets to pass to the container.
     *
     * For more information, see [Specifying Sensitive Data](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-secrets
     */
    readonly secrets?: Array<cdk.IResolvable | CfnTaskDefinition.SecretProperty> | cdk.IResolvable;

    /**
     * Time duration (in seconds) to wait before giving up on resolving dependencies for a container.
     *
     * For example, you specify two containers in a task definition with containerA having a dependency on containerB reaching a `COMPLETE` , `SUCCESS` , or `HEALTHY` status. If a `startTimeout` value is specified for containerB and it doesn't reach the desired status within that time then containerA gives up and not start. This results in the task transitioning to a `STOPPED` state.
     *
     * > When the `ECS_CONTAINER_START_TIMEOUT` container agent configuration variable is used, it's enforced independently from this start timeout value.
     *
     * For tasks using the Fargate launch type, the task or service requires the following platforms:
     *
     * - Linux platform version `1.3.0` or later.
     * - Windows platform version `1.0.0` or later.
     *
     * For tasks using the EC2 launch type, your container instances require at least version `1.26.0` of the container agent to use a container start timeout value. However, we recommend using the latest container agent version. For information about checking your agent version and updating to the latest version, see [Updating the Amazon ECS Container Agent](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-update.html) in the *Amazon Elastic Container Service Developer Guide* . If you're using an Amazon ECS-optimized Linux AMI, your instance needs at least version `1.26.0-1` of the `ecs-init` package. If your container instances are launched from version `20190301` or later, then they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * The valid values are 2-120 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-starttimeout
     */
    readonly startTimeout?: number;

    /**
     * Time duration (in seconds) to wait before the container is forcefully killed if it doesn't exit normally on its own.
     *
     * For tasks using the Fargate launch type, the task or service requires the following platforms:
     *
     * - Linux platform version `1.3.0` or later.
     * - Windows platform version `1.0.0` or later.
     *
     * The max stop timeout value is 120 seconds and if the parameter is not specified, the default value of 30 seconds is used.
     *
     * For tasks that use the EC2 launch type, if the `stopTimeout` parameter isn't specified, the value set for the Amazon ECS container agent configuration variable `ECS_CONTAINER_STOP_TIMEOUT` is used. If neither the `stopTimeout` parameter or the `ECS_CONTAINER_STOP_TIMEOUT` agent configuration variable are set, then the default values of 30 seconds for Linux containers and 30 seconds on Windows containers are used. Your container instances require at least version 1.26.0 of the container agent to use a container stop timeout value. However, we recommend using the latest container agent version. For information about checking your agent version and updating to the latest version, see [Updating the Amazon ECS Container Agent](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-update.html) in the *Amazon Elastic Container Service Developer Guide* . If you're using an Amazon ECS-optimized Linux AMI, your instance needs at least version 1.26.0-1 of the `ecs-init` package. If your container instances are launched from version `20190301` or later, then they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * The valid values are 2-120 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-stoptimeout
     */
    readonly stopTimeout?: number;

    /**
     * A list of namespaced kernel parameters to set in the container.
     *
     * This parameter maps to `Sysctls` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--sysctl` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . For example, you can configure `net.ipv4.tcp_keepalive_time` setting to maintain longer lived connections.
     *
     * > We don't recommended that you specify network-related `systemControls` parameters for multiple containers in a single task that also uses either the `awsvpc` or `host` network modes. For tasks that use the `awsvpc` network mode, the container that's started last determines which `systemControls` parameters take effect. For tasks that use the `host` network mode, it changes the container instance's namespaced kernel parameters as well as the containers. > This parameter is not supported for Windows containers. > This parameter is only supported for tasks that are hosted on AWS Fargate if the tasks are using platform version `1.4.0` or later (Linux). This isn't supported for Windows containers on Fargate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-systemcontrols
     */
    readonly systemControls?: Array<cdk.IResolvable | CfnTaskDefinition.SystemControlProperty> | cdk.IResolvable;

    /**
     * A list of `ulimits` to set in the container.
     *
     * This parameter maps to `Ulimits` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--ulimit` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . Valid naming values are displayed in the [Ulimit](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_Ulimit.html) data type. This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-ulimits
     */
    readonly ulimits?: Array<cdk.IResolvable | CfnTaskDefinition.UlimitProperty> | cdk.IResolvable;

    /**
     * The user to use inside the container.
     *
     * This parameter maps to `User` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--user` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > When running tasks using the `host` network mode, don't run containers using the root user (UID 0). We recommend using a non-root user for better security.
     *
     * You can specify the `user` using the following formats. If specifying a UID or GID, you must specify it as a positive integer.
     *
     * - `user`
     * - `user:group`
     * - `uid`
     * - `uid:gid`
     * - `user:gid`
     * - `uid:group`
     *
     * > This parameter is not supported for Windows containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-user
     */
    readonly user?: string;

    /**
     * Data volumes to mount from another container.
     *
     * This parameter maps to `VolumesFrom` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--volumes-from` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-volumesfrom
     */
    readonly volumesFrom?: Array<cdk.IResolvable | CfnTaskDefinition.VolumeFromProperty> | cdk.IResolvable;

    /**
     * The working directory to run commands inside the container in.
     *
     * This parameter maps to `WorkingDir` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--workdir` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinition.html#cfn-ecs-taskdefinition-containerdefinition-workingdirectory
     */
    readonly workingDirectory?: string;
  }

  /**
   * An object representing the secret to expose to your container.
   *
   * Secrets can be exposed to a container in the following ways:
   *
   * - To inject sensitive data into your containers as environment variables, use the `secrets` container definition parameter.
   * - To reference sensitive information in the log configuration of a container, use the `secretOptions` container definition parameter.
   *
   * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-secret.html
   */
  export interface SecretProperty {
    /**
     * The name of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-secret.html#cfn-ecs-taskdefinition-secret-name
     */
    readonly name: string;

    /**
     * The secret to expose to the container.
     *
     * The supported values are either the full ARN of the AWS Secrets Manager secret or the full ARN of the parameter in the SSM Parameter Store.
     *
     * For information about the require AWS Identity and Access Management permissions, see [Required IAM permissions for Amazon ECS secrets](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html#secrets-iam) (for Secrets Manager) or [Required IAM permissions for Amazon ECS secrets](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-parameters.html) (for Systems Manager Parameter store) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If the SSM Parameter Store parameter exists in the same Region as the task you're launching, then you can use either the full ARN or name of the parameter. If the parameter exists in a different Region, then the full ARN must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-secret.html#cfn-ecs-taskdefinition-secret-valuefrom
     */
    readonly valueFrom: string;
  }

  /**
   * The `HealthCheck` property specifies an object representing a container health check.
   *
   * Health check parameters that are specified in a container definition override any Docker health checks that exist in the container image (such as those specified in a parent image or from the image's Dockerfile). This configuration maps to the `HEALTHCHECK` parameter of [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
   *
   * > The Amazon ECS container agent only monitors and reports on the health checks specified in the task definition. Amazon ECS does not monitor Docker health checks that are embedded in a container image and not specified in the container definition. Health check parameters that are specified in a container definition override any Docker health checks that exist in the container image.
   *
   * If a task is run manually, and not as part of a service, the task will continue its lifecycle regardless of its health status. For tasks that are part of a service, if the task reports as unhealthy then the task will be stopped and the service scheduler will replace it.
   *
   * The following are notes about container health check support:
   *
   * - Container health checks require version 1.17.0 or greater of the Amazon ECS container agent. For more information, see [Updating the Amazon ECS Container Agent](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-update.html) .
   * - Container health checks are supported for Fargate tasks if you are using platform version 1.1.0 or greater. For more information, see [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) .
   * - Container health checks are not supported for tasks that are part of a service that is configured to use a Classic Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html
   */
  export interface HealthCheckProperty {
    /**
     * A string array representing the command that the container runs to determine if it is healthy.
     *
     * The string array must start with `CMD` to run the command arguments directly, or `CMD-SHELL` to run the command with the container's default shell.
     *
     * When you use the AWS Management Console JSON panel, the AWS Command Line Interface , or the APIs, enclose the list of commands in double quotes and brackets.
     *
     * `[ "CMD-SHELL", "curl -f http://localhost/ || exit 1" ]`
     *
     * You don't include the double quotes and brackets when you use the AWS Management Console.
     *
     * `CMD-SHELL, curl -f http://localhost/ || exit 1`
     *
     * An exit code of 0 indicates success, and non-zero exit code indicates failure. For more information, see `HealthCheck` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html#cfn-ecs-taskdefinition-healthcheck-command
     */
    readonly command?: Array<string>;

    /**
     * The time period in seconds between each health check execution.
     *
     * You may specify between 5 and 300 seconds. The default value is 30 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html#cfn-ecs-taskdefinition-healthcheck-interval
     */
    readonly interval?: number;

    /**
     * The number of times to retry a failed health check before the container is considered unhealthy.
     *
     * You may specify between 1 and 10 retries. The default value is 3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html#cfn-ecs-taskdefinition-healthcheck-retries
     */
    readonly retries?: number;

    /**
     * The optional grace period to provide containers time to bootstrap before failed health checks count towards the maximum number of retries.
     *
     * You can specify between 0 and 300 seconds. By default, the `startPeriod` is off.
     *
     * > If a health check succeeds within the `startPeriod` , then the container is considered healthy and any subsequent failures count toward the maximum number of retries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html#cfn-ecs-taskdefinition-healthcheck-startperiod
     */
    readonly startPeriod?: number;

    /**
     * The time period in seconds to wait for a health check to succeed before it is considered a failure.
     *
     * You may specify between 2 and 60 seconds. The default value is 5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-healthcheck.html#cfn-ecs-taskdefinition-healthcheck-timeout
     */
    readonly timeout?: number;
  }

  /**
   * Details on a data volume from another container in the same task definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumefrom.html
   */
  export interface VolumeFromProperty {
    /**
     * If this value is `true` , the container has read-only access to the volume.
     *
     * If this value is `false` , then the container can write to the volume. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumefrom.html#cfn-ecs-taskdefinition-volumefrom-readonly
     */
    readonly readOnly?: boolean | cdk.IResolvable;

    /**
     * The name of another container within the same task definition to mount volumes from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-volumefrom.html#cfn-ecs-taskdefinition-volumefrom-sourcecontainer
     */
    readonly sourceContainer?: string;
  }

  /**
   * The `LogConfiguration` property specifies log configuration options to send to a custom log driver for the container.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * The log driver to use for the container.
     *
     * For tasks on AWS Fargate , the supported log drivers are `awslogs` , `splunk` , and `awsfirelens` .
     *
     * For tasks hosted on Amazon EC2 instances, the supported log drivers are `awslogs` , `fluentd` , `gelf` , `json-file` , `journald` , `logentries` , `syslog` , `splunk` , and `awsfirelens` .
     *
     * For more information about using the `awslogs` log driver, see [Using the awslogs log driver](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For more information about using the `awsfirelens` log driver, see [Custom log routing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If you have a custom driver that isn't listed, you can fork the Amazon ECS container agent project that's [available on GitHub](https://docs.aws.amazon.com/https://github.com/aws/amazon-ecs-agent) and customize it to work with that driver. We encourage you to submit pull requests for changes that you would like to have included. However, we don't currently provide support for running modified copies of this software.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-logconfiguration.html#cfn-ecs-taskdefinition-logconfiguration-logdriver
     */
    readonly logDriver: string;

    /**
     * The configuration options to send to the log driver.
     *
     * This parameter requires version 1.19 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-logconfiguration.html#cfn-ecs-taskdefinition-logconfiguration-options
     */
    readonly options?: cdk.IResolvable | Record<string, string>;

    /**
     * The secrets to pass to the log configuration.
     *
     * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-logconfiguration.html#cfn-ecs-taskdefinition-logconfiguration-secretoptions
     */
    readonly secretOptions?: Array<cdk.IResolvable | CfnTaskDefinition.SecretProperty> | cdk.IResolvable;
  }

  /**
   * The type and amount of a resource to assign to a container.
   *
   * The supported resource types are GPUs and Elastic Inference accelerators. For more information, see [Working with GPUs on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html) or [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-resourcerequirement.html
   */
  export interface ResourceRequirementProperty {
    /**
     * The type of resource to assign to a container.
     *
     * The supported values are `GPU` or `InferenceAccelerator` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-resourcerequirement.html#cfn-ecs-taskdefinition-resourcerequirement-type
     */
    readonly type: string;

    /**
     * The value for the specified resource type.
     *
     * If the `GPU` type is used, the value is the number of physical `GPUs` the Amazon ECS container agent reserves for the container. The number of GPUs that's reserved for all containers in a task can't exceed the number of available GPUs on the container instance that the task is launched on.
     *
     * If the `InferenceAccelerator` type is used, the `value` matches the `deviceName` for an [InferenceAccelerator](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_InferenceAccelerator.html) specified in a task definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-resourcerequirement.html#cfn-ecs-taskdefinition-resourcerequirement-value
     */
    readonly value: string;
  }

  /**
   * A list of files containing the environment variables to pass to a container.
   *
   * You can specify up to ten environment files. The file must have a `.env` file extension. Each line in an environment file should contain an environment variable in `VARIABLE=VALUE` format. Lines beginning with `#` are treated as comments and are ignored.
   *
   * If there are environment variables specified using the `environment` parameter in a container definition, they take precedence over the variables contained within an environment file. If multiple environment files are specified that contain the same variable, they're processed from the top down. We recommend that you use unique variable names. For more information, see [Specifying environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * You must use the following platforms for the Fargate launch type:
   *
   * - Linux platform version `1.4.0` or later.
   * - Windows platform version `1.0.0` or later.
   *
   * Consider the following when using the Fargate launch type:
   *
   * - The file is handled like a native Docker env-file.
   * - There is no support for shell escape handling.
   * - The container entry point interperts the `VARIABLE` values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-environmentfile.html
   */
  export interface EnvironmentFileProperty {
    /**
     * The file type to use.
     *
     * The only supported value is `s3` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-environmentfile.html#cfn-ecs-taskdefinition-environmentfile-type
     */
    readonly type?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 object containing the environment variable file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-environmentfile.html#cfn-ecs-taskdefinition-environmentfile-value
     */
    readonly value?: string;
  }

  /**
   * The FireLens configuration for the container.
   *
   * This is used to specify and configure a log router for container logs. For more information, see [Custom log routing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-firelensconfiguration.html
   */
  export interface FirelensConfigurationProperty {
    /**
     * The options to use when configuring the log router.
     *
     * This field is optional and can be used to add additional metadata, such as the task, task definition, cluster, and container instance details to the log event.
     *
     * If specified, valid option keys are:
     *
     * - `enable-ecs-log-metadata` , which can be `true` or `false`
     * - `config-file-type` , which can be `s3` or `file`
     * - `config-file-value` , which is either an S3 ARN or a file path
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-firelensconfiguration.html#cfn-ecs-taskdefinition-firelensconfiguration-options
     */
    readonly options?: cdk.IResolvable | Record<string, string>;

    /**
     * The log router to use.
     *
     * The valid values are `fluentd` or `fluentbit` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-firelensconfiguration.html#cfn-ecs-taskdefinition-firelensconfiguration-type
     */
    readonly type?: string;
  }

  /**
   * A list of namespaced kernel parameters to set in the container.
   *
   * This parameter maps to `Sysctls` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--sysctl` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
   *
   * We don't recommend that you specify network-related `systemControls` parameters for multiple containers in a single task. This task also uses either the `awsvpc` or `host` network mode. It does it for the following reasons.
   *
   * - For tasks that use the `awsvpc` network mode, if you set `systemControls` for any container, it applies to all containers in the task. If you set different `systemControls` for multiple containers in a single task, the container that's started last determines which `systemControls` take effect.
   * - For tasks that use the `host` network mode, the `systemControls` parameter applies to the container instance's kernel parameter and that of all containers of any tasks running on that container instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-systemcontrol.html
   */
  export interface SystemControlProperty {
    /**
     * The namespaced kernel parameter to set a `value` for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-systemcontrol.html#cfn-ecs-taskdefinition-systemcontrol-namespace
     */
    readonly namespace?: string;

    /**
     * The namespaced kernel parameter to set a `value` for.
     *
     * Valid IPC namespace values: `"kernel.msgmax" | "kernel.msgmnb" | "kernel.msgmni" | "kernel.sem" | "kernel.shmall" | "kernel.shmmax" | "kernel.shmmni" | "kernel.shm_rmid_forced"` , and `Sysctls` that start with `"fs.mqueue.*"`
     *
     * Valid network namespace values: `Sysctls` that start with `"net.*"`
     *
     * All of these values are supported by Fargate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-systemcontrol.html#cfn-ecs-taskdefinition-systemcontrol-value
     */
    readonly value?: string;
  }

  /**
   * The `ulimit` settings to pass to the container.
   *
   * Amazon ECS tasks hosted on AWS Fargate use the default resource limit values set by the operating system with the exception of the `nofile` resource limit parameter which AWS Fargate overrides. The `nofile` resource limit sets a restriction on the number of open files that a container can use. The default `nofile` soft limit is `1024` and the default hard limit is `4096` .
   *
   * You can specify the `ulimit` settings for a container in a task definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ulimit.html
   */
  export interface UlimitProperty {
    /**
     * The hard limit for the `ulimit` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ulimit.html#cfn-ecs-taskdefinition-ulimit-hardlimit
     */
    readonly hardLimit: number;

    /**
     * The `type` of the `ulimit` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ulimit.html#cfn-ecs-taskdefinition-ulimit-name
     */
    readonly name: string;

    /**
     * The soft limit for the `ulimit` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ulimit.html#cfn-ecs-taskdefinition-ulimit-softlimit
     */
    readonly softLimit: number;
  }

  /**
   * The repository credentials for private registry authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-repositorycredentials.html
   */
  export interface RepositoryCredentialsProperty {
    /**
     * The Amazon Resource Name (ARN) of the secret containing the private repository credentials.
     *
     * > When you use the Amazon ECS API, AWS CLI , or AWS SDK, if the secret exists in the same Region as the task that you're launching then you can use either the full ARN or the name of the secret. When you use the AWS Management Console, you must specify the full ARN of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-repositorycredentials.html#cfn-ecs-taskdefinition-repositorycredentials-credentialsparameter
     */
    readonly credentialsParameter?: string;
  }

  /**
   * The `HostEntry` property specifies a hostname and an IP address that are added to the `/etc/hosts` file of a container through the `extraHosts` parameter of its `ContainerDefinition` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-hostentry.html
   */
  export interface HostEntryProperty {
    /**
     * The hostname to use in the `/etc/hosts` entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-hostentry.html#cfn-ecs-taskdefinition-hostentry-hostname
     */
    readonly hostname?: string;

    /**
     * The IP address to use in the `/etc/hosts` entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-hostentry.html#cfn-ecs-taskdefinition-hostentry-ipaddress
     */
    readonly ipAddress?: string;
  }

  /**
   * The Linux-specific options that are applied to the container, such as Linux [KernelCapabilities](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_KernelCapabilities.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html
   */
  export interface LinuxParametersProperty {
    /**
     * The Linux capabilities for the container that are added to or dropped from the default configuration provided by Docker.
     *
     * > For tasks that use the Fargate launch type, `capabilities` is supported for all platform versions but the `add` parameter is only supported if using platform version 1.4.0 or later.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-capabilities
     */
    readonly capabilities?: cdk.IResolvable | CfnTaskDefinition.KernelCapabilitiesProperty;

    /**
     * Any host devices to expose to the container.
     *
     * This parameter maps to `Devices` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--device` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > If you're using tasks that use the Fargate launch type, the `devices` parameter isn't supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-devices
     */
    readonly devices?: Array<CfnTaskDefinition.DeviceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Run an `init` process inside the container that forwards signals and reaps processes.
     *
     * This parameter maps to the `--init` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) . This parameter requires version 1.25 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version --format '{{.Server.APIVersion}}'`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-initprocessenabled
     */
    readonly initProcessEnabled?: boolean | cdk.IResolvable;

    /**
     * The total amount of swap memory (in MiB) a container can use.
     *
     * This parameter will be translated to the `--memory-swap` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) where the value would be the sum of the container memory plus the `maxSwap` value.
     *
     * If a `maxSwap` value of `0` is specified, the container will not use swap. Accepted values are `0` or any positive integer. If the `maxSwap` parameter is omitted, the container will use the swap configuration for the container instance it is running on. A `maxSwap` value must be set for the `swappiness` parameter to be used.
     *
     * > If you're using tasks that use the Fargate launch type, the `maxSwap` parameter isn't supported.
     * >
     * > If you're using tasks on Amazon Linux 2023 the `swappiness` parameter isn't supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-maxswap
     */
    readonly maxSwap?: number;

    /**
     * The value for the size (in MiB) of the `/dev/shm` volume.
     *
     * This parameter maps to the `--shm-size` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > If you are using tasks that use the Fargate launch type, the `sharedMemorySize` parameter is not supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-sharedmemorysize
     */
    readonly sharedMemorySize?: number;

    /**
     * This allows you to tune a container's memory swappiness behavior.
     *
     * A `swappiness` value of `0` will cause swapping to not happen unless absolutely necessary. A `swappiness` value of `100` will cause pages to be swapped very aggressively. Accepted values are whole numbers between `0` and `100` . If the `swappiness` parameter is not specified, a default value of `60` is used. If a value is not specified for `maxSwap` then this parameter is ignored. This parameter maps to the `--memory-swappiness` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > If you're using tasks that use the Fargate launch type, the `swappiness` parameter isn't supported.
     * >
     * > If you're using tasks on Amazon Linux 2023 the `swappiness` parameter isn't supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-swappiness
     */
    readonly swappiness?: number;

    /**
     * The container path, mount options, and size (in MiB) of the tmpfs mount.
     *
     * This parameter maps to the `--tmpfs` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > If you're using tasks that use the Fargate launch type, the `tmpfs` parameter isn't supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-linuxparameters.html#cfn-ecs-taskdefinition-linuxparameters-tmpfs
     */
    readonly tmpfs?: Array<cdk.IResolvable | CfnTaskDefinition.TmpfsProperty> | cdk.IResolvable;
  }

  /**
   * The `KernelCapabilities` property specifies the Linux capabilities for the container that are added to or dropped from the default configuration that is provided by Docker.
   *
   * For more information on the default capabilities and the non-default available capabilities, see [Runtime privilege and Linux capabilities](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) in the *Docker run reference* . For more detailed information on these Linux capabilities, see the [capabilities(7)](https://docs.aws.amazon.com/http://man7.org/linux/man-pages/man7/capabilities.7.html) Linux manual page.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-kernelcapabilities.html
   */
  export interface KernelCapabilitiesProperty {
    /**
     * The Linux capabilities for the container that have been added to the default configuration provided by Docker.
     *
     * This parameter maps to `CapAdd` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--cap-add` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * > Tasks launched on AWS Fargate only support adding the `SYS_PTRACE` kernel capability.
     *
     * Valid values: `"ALL" | "AUDIT_CONTROL" | "AUDIT_WRITE" | "BLOCK_SUSPEND" | "CHOWN" | "DAC_OVERRIDE" | "DAC_READ_SEARCH" | "FOWNER" | "FSETID" | "IPC_LOCK" | "IPC_OWNER" | "KILL" | "LEASE" | "LINUX_IMMUTABLE" | "MAC_ADMIN" | "MAC_OVERRIDE" | "MKNOD" | "NET_ADMIN" | "NET_BIND_SERVICE" | "NET_BROADCAST" | "NET_RAW" | "SETFCAP" | "SETGID" | "SETPCAP" | "SETUID" | "SYS_ADMIN" | "SYS_BOOT" | "SYS_CHROOT" | "SYS_MODULE" | "SYS_NICE" | "SYS_PACCT" | "SYS_PTRACE" | "SYS_RAWIO" | "SYS_RESOURCE" | "SYS_TIME" | "SYS_TTY_CONFIG" | "SYSLOG" | "WAKE_ALARM"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-kernelcapabilities.html#cfn-ecs-taskdefinition-kernelcapabilities-add
     */
    readonly add?: Array<string>;

    /**
     * The Linux capabilities for the container that have been removed from the default configuration provided by Docker.
     *
     * This parameter maps to `CapDrop` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/#operation/ContainerCreate) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.35/) and the `--cap-drop` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#security-configuration) .
     *
     * Valid values: `"ALL" | "AUDIT_CONTROL" | "AUDIT_WRITE" | "BLOCK_SUSPEND" | "CHOWN" | "DAC_OVERRIDE" | "DAC_READ_SEARCH" | "FOWNER" | "FSETID" | "IPC_LOCK" | "IPC_OWNER" | "KILL" | "LEASE" | "LINUX_IMMUTABLE" | "MAC_ADMIN" | "MAC_OVERRIDE" | "MKNOD" | "NET_ADMIN" | "NET_BIND_SERVICE" | "NET_BROADCAST" | "NET_RAW" | "SETFCAP" | "SETGID" | "SETPCAP" | "SETUID" | "SYS_ADMIN" | "SYS_BOOT" | "SYS_CHROOT" | "SYS_MODULE" | "SYS_NICE" | "SYS_PACCT" | "SYS_PTRACE" | "SYS_RAWIO" | "SYS_RESOURCE" | "SYS_TIME" | "SYS_TTY_CONFIG" | "SYSLOG" | "WAKE_ALARM"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-kernelcapabilities.html#cfn-ecs-taskdefinition-kernelcapabilities-drop
     */
    readonly drop?: Array<string>;
  }

  /**
   * The container path, mount options, and size of the tmpfs mount.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-tmpfs.html
   */
  export interface TmpfsProperty {
    /**
     * The absolute file path where the tmpfs volume is to be mounted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-tmpfs.html#cfn-ecs-taskdefinition-tmpfs-containerpath
     */
    readonly containerPath?: string;

    /**
     * The list of tmpfs volume mount options.
     *
     * Valid values: `"defaults" | "ro" | "rw" | "suid" | "nosuid" | "dev" | "nodev" | "exec" | "noexec" | "sync" | "async" | "dirsync" | "remount" | "mand" | "nomand" | "atime" | "noatime" | "diratime" | "nodiratime" | "bind" | "rbind" | "unbindable" | "runbindable" | "private" | "rprivate" | "shared" | "rshared" | "slave" | "rslave" | "relatime" | "norelatime" | "strictatime" | "nostrictatime" | "mode" | "uid" | "gid" | "nr_inodes" | "nr_blocks" | "mpol"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-tmpfs.html#cfn-ecs-taskdefinition-tmpfs-mountoptions
     */
    readonly mountOptions?: Array<string>;

    /**
     * The maximum size (in MiB) of the tmpfs volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-tmpfs.html#cfn-ecs-taskdefinition-tmpfs-size
     */
    readonly size: number;
  }

  /**
   * The `Device` property specifies an object representing a container instance host device.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-device.html
   */
  export interface DeviceProperty {
    /**
     * The path inside the container at which to expose the host device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-device.html#cfn-ecs-taskdefinition-device-containerpath
     */
    readonly containerPath?: string;

    /**
     * The path for the device on the host container instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-device.html#cfn-ecs-taskdefinition-device-hostpath
     */
    readonly hostPath?: string;

    /**
     * The explicit permissions to provide to the container for the device.
     *
     * By default, the container has permissions for `read` , `write` , and `mknod` for the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-device.html#cfn-ecs-taskdefinition-device-permissions
     */
    readonly permissions?: Array<string>;
  }

  /**
   * The details for a volume mount point that's used in a container definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-mountpoint.html
   */
  export interface MountPointProperty {
    /**
     * The path on the container to mount the host volume at.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-mountpoint.html#cfn-ecs-taskdefinition-mountpoint-containerpath
     */
    readonly containerPath?: string;

    /**
     * If this value is `true` , the container has read-only access to the volume.
     *
     * If this value is `false` , then the container can write to the volume. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-mountpoint.html#cfn-ecs-taskdefinition-mountpoint-readonly
     */
    readonly readOnly?: boolean | cdk.IResolvable;

    /**
     * The name of the volume to mount.
     *
     * Must be a volume name referenced in the `name` parameter of task definition `volume` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-mountpoint.html#cfn-ecs-taskdefinition-mountpoint-sourcevolume
     */
    readonly sourceVolume?: string;
  }

  /**
   * The `ContainerDependency` property specifies the dependencies defined for container startup and shutdown.
   *
   * A container can contain multiple dependencies. When a dependency is defined for container startup, for container shutdown it is reversed.
   *
   * Your Amazon ECS container instances require at least version 1.26.0 of the container agent to enable container dependencies. However, we recommend using the latest container agent version. For information about checking your agent version and updating to the latest version, see [Updating the Amazon ECS Container Agent](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-update.html) in the *Amazon Elastic Container Service Developer Guide* . If you are using an Amazon ECS-optimized Linux AMI, your instance needs at least version 1.26.0-1 of the `ecs-init` package. If your container instances are launched from version `20190301` or later, then they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * > For tasks using the Fargate launch type, this parameter requires that the task or service uses platform version 1.3.0 or later.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdependency.html
   */
  export interface ContainerDependencyProperty {
    /**
     * The dependency condition of the container. The following are the available conditions and their behavior:.
     *
     * - `START` - This condition emulates the behavior of links and volumes today. It validates that a dependent container is started before permitting other containers to start.
     * - `COMPLETE` - This condition validates that a dependent container runs to completion (exits) before permitting other containers to start. This can be useful for nonessential containers that run a script and then exit. This condition can't be set on an essential container.
     * - `SUCCESS` - This condition is the same as `COMPLETE` , but it also requires that the container exits with a `zero` status. This condition can't be set on an essential container.
     * - `HEALTHY` - This condition validates that the dependent container passes its Docker health check before permitting other containers to start. This requires that the dependent container has health checks configured. This condition is confirmed only at task startup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdependency.html#cfn-ecs-taskdefinition-containerdependency-condition
     */
    readonly condition?: string;

    /**
     * The name of a container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdependency.html#cfn-ecs-taskdefinition-containerdependency-containername
     */
    readonly containerName?: string;
  }

  /**
   * The `PortMapping` property specifies a port mapping.
   *
   * Port mappings allow containers to access ports on the host container instance to send or receive traffic. Port mappings are specified as part of the container definition.
   *
   * If you are using containers in a task with the `awsvpc` or `host` network mode, exposed ports should be specified using `containerPort` . The `hostPort` can be left blank or it must be the same value as the `containerPort` .
   *
   * After a task reaches the `RUNNING` status, manual and automatic host and container port assignments are visible in the `networkBindings` section of [DescribeTasks](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTasks.html) API responses.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html
   */
  export interface PortMappingProperty {
    /**
     * The application protocol that's used for the port mapping.
     *
     * This parameter only applies to Service Connect. We recommend that you set this parameter to be consistent with the protocol that your application uses. If you set this parameter, Amazon ECS adds protocol-specific connection handling to the Service Connect proxy. If you set this parameter, Amazon ECS adds protocol-specific telemetry in the Amazon ECS console and CloudWatch.
     *
     * If you don't set a value for this parameter, then TCP is used. However, Amazon ECS doesn't add protocol-specific telemetry for TCP.
     *
     * `appProtocol` is immutable in a Service Connect service. Updating this field requires a service deletion and redeployment.
     *
     * Tasks that run in a namespace can use short names to connect to services in the namespace. Tasks can connect to services across all of the clusters in the namespace. Tasks connect through a managed proxy container that collects logs and metrics for increased visibility. Only the tasks that Amazon ECS services create are supported with Service Connect. For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-appprotocol
     */
    readonly appProtocol?: string;

    /**
     * The port number on the container that's bound to the user-specified or automatically assigned host port.
     *
     * If you use containers in a task with the `awsvpc` or `host` network mode, specify the exposed ports using `containerPort` .
     *
     * If you use containers in a task with the `bridge` network mode and you specify a container port and not a host port, your container automatically receives a host port in the ephemeral port range. For more information, see `hostPort` . Port mappings that are automatically assigned in this way do not count toward the 100 reserved ports limit of a container instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-containerport
     */
    readonly containerPort?: number;

    /**
     * The port number range on the container that's bound to the dynamically mapped host port range.
     *
     * The following rules apply when you specify a `containerPortRange` :
     *
     * - You must use either the `bridge` network mode or the `awsvpc` network mode.
     * - This parameter is available for both the EC2 and AWS Fargate launch types.
     * - This parameter is available for both the Linux and Windows operating systems.
     * - The container instance must have at least version 1.67.0 of the container agent and at least version 1.67.0-1 of the `ecs-init` package
     * - You can specify a maximum of 100 port ranges per container.
     * - You do not specify a `hostPortRange` . The value of the `hostPortRange` is set as follows:
     *
     * - For containers in a task with the `awsvpc` network mode, the `hostPortRange` is set to the same value as the `containerPortRange` . This is a static mapping strategy.
     * - For containers in a task with the `bridge` network mode, the Amazon ECS agent finds open host ports from the default ephemeral range and passes it to docker to bind them to the container ports.
     * - The `containerPortRange` valid values are between 1 and 65535.
     * - A port can only be included in one port mapping per container.
     * - You cannot specify overlapping port ranges.
     * - The first port in the range must be less than last port in the range.
     * - Docker recommends that you turn off the docker-proxy in the Docker daemon config file when you have a large number of ports.
     *
     * For more information, see [Issue #11185](https://docs.aws.amazon.com/https://github.com/moby/moby/issues/11185) on the Github website.
     *
     * For information about how to turn off the docker-proxy in the Docker daemon config file, see [Docker daemon](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bootstrap_container_instance.html#bootstrap_docker_daemon) in the *Amazon ECS Developer Guide* .
     *
     * You can call [`DescribeTasks`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTasks.html) to view the `hostPortRange` which are the host ports that are bound to the container ports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-containerportrange
     */
    readonly containerPortRange?: string;

    /**
     * The port number on the container instance to reserve for your container.
     *
     * If you specify a `containerPortRange` , leave this field empty and the value of the `hostPort` is set as follows:
     *
     * - For containers in a task with the `awsvpc` network mode, the `hostPort` is set to the same value as the `containerPort` . This is a static mapping strategy.
     * - For containers in a task with the `bridge` network mode, the Amazon ECS agent finds open ports on the host and automatically binds them to the container ports. This is a dynamic mapping strategy.
     *
     * If you use containers in a task with the `awsvpc` or `host` network mode, the `hostPort` can either be left blank or set to the same value as the `containerPort` .
     *
     * If you use containers in a task with the `bridge` network mode, you can specify a non-reserved host port for your container port mapping, or you can omit the `hostPort` (or set it to `0` ) while specifying a `containerPort` and your container automatically receives a port in the ephemeral port range for your container instance operating system and Docker version.
     *
     * The default ephemeral port range for Docker version 1.6.0 and later is listed on the instance under `/proc/sys/net/ipv4/ip_local_port_range` . If this kernel parameter is unavailable, the default ephemeral port range from 49153 through 65535 (Linux) or 49152 through 65535 (Windows) is used. Do not attempt to specify a host port in the ephemeral port range as these are reserved for automatic assignment. In general, ports below 32768 are outside of the ephemeral port range.
     *
     * The default reserved ports are 22 for SSH, the Docker ports 2375 and 2376, and the Amazon ECS container agent ports 51678-51680. Any host port that was previously specified in a running task is also reserved while the task is running. That is, after a task stops, the host port is released. The current reserved ports are displayed in the `remainingResources` of [DescribeContainerInstances](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeContainerInstances.html) output. A container instance can have up to 100 reserved ports at a time. This number includes the default reserved ports. Automatically assigned ports aren't included in the 100 reserved ports quota.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-hostport
     */
    readonly hostPort?: number;

    /**
     * The name that's used for the port mapping.
     *
     * This parameter only applies to Service Connect. This parameter is the name that you use in the `serviceConnectConfiguration` of a service. The name can include up to 64 characters. The characters can include lowercase letters, numbers, underscores (_), and hyphens (-). The name can't start with a hyphen.
     *
     * For more information, see [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-name
     */
    readonly name?: string;

    /**
     * The protocol used for the port mapping.
     *
     * Valid values are `tcp` and `udp` . The default is `tcp` . `protocol` is immutable in a Service Connect service. Updating this field requires a service deletion and redeployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-portmapping.html#cfn-ecs-taskdefinition-portmapping-protocol
     */
    readonly protocol?: string;
  }

  /**
   * The amount of ephemeral storage to allocate for the task.
   *
   * This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on AWS Fargate . For more information, see [Fargate task storage](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) in the *Amazon ECS User Guide for AWS Fargate* .
   *
   * > For tasks using the Fargate launch type, the task requires the following platforms:
   * >
   * > - Linux platform version `1.4.0` or later.
   * > - Windows platform version `1.0.0` or later.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ephemeralstorage.html
   */
  export interface EphemeralStorageProperty {
    /**
     * The total amount, in GiB, of ephemeral storage to set for the task.
     *
     * The minimum supported value is `21` GiB and the maximum supported value is `200` GiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-ephemeralstorage.html#cfn-ecs-taskdefinition-ephemeralstorage-sizeingib
     */
    readonly sizeInGiB?: number;
  }
}

/**
 * Properties for defining a `CfnTaskDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html
 */
export interface CfnTaskDefinitionProps {
  /**
   * A list of container definitions in JSON format that describe the different containers that make up your task.
   *
   * For more information about container definition parameters and defaults, see [Amazon ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_defintions.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-containerdefinitions
   */
  readonly containerDefinitions?: Array<CfnTaskDefinition.ContainerDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The number of `cpu` units used by the task.
   *
   * If you use the EC2 launch type, this field is optional. Any value can be used. If you use the Fargate launch type, this field is required. You must use one of the following values. The value that you choose determines your range of valid values for the `memory` parameter.
   *
   * The CPU units cannot be less than 1 vCPU when you use Windows containers on Fargate.
   *
   * - 256 (.25 vCPU) - Available `memory` values: 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB)
   * - 512 (.5 vCPU) - Available `memory` values: 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB)
   * - 1024 (1 vCPU) - Available `memory` values: 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB)
   * - 2048 (2 vCPU) - Available `memory` values: 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB)
   * - 4096 (4 vCPU) - Available `memory` values: 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB)
   * - 8192 (8 vCPU) - Available `memory` values: 16 GB and 60 GB in 4 GB increments
   *
   * This option requires Linux platform `1.4.0` or later.
   * - 16384 (16vCPU) - Available `memory` values: 32GB and 120 GB in 8 GB increments
   *
   * This option requires Linux platform `1.4.0` or later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-cpu
   */
  readonly cpu?: string;

  /**
   * The ephemeral storage settings to use for tasks run with the task definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-ephemeralstorage
   */
  readonly ephemeralStorage?: CfnTaskDefinition.EphemeralStorageProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the task execution role that grants the Amazon ECS container agent permission to make AWS API calls on your behalf.
   *
   * The task execution IAM role is required depending on the requirements of your task. For more information, see [Amazon ECS task execution IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * The name of a family that this task definition is registered to.
   *
   * Up to 255 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
   *
   * A family groups multiple versions of a task definition. Amazon ECS gives the first task definition that you registered to a family a revision number of 1. Amazon ECS gives sequential revision numbers to each task definition that you add.
   *
   * > To use revision numbers when you update a task definition, specify this property. If you don't specify a value, AWS CloudFormation generates a new task definition each time that you update it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-family
   */
  readonly family?: string;

  /**
   * The Elastic Inference accelerators to use for the containers in the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-inferenceaccelerators
   */
  readonly inferenceAccelerators?: Array<CfnTaskDefinition.InferenceAcceleratorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The IPC resource namespace to use for the containers in the task.
   *
   * The valid values are `host` , `task` , or `none` . If `host` is specified, then all containers within the tasks that specified the `host` IPC mode on the same container instance share the same IPC resources with the host Amazon EC2 instance. If `task` is specified, all containers within the specified task share the same IPC resources. If `none` is specified, then IPC resources within the containers of a task are private and not shared with other containers in a task or on the container instance. If no value is specified, then the IPC resource namespace sharing depends on the Docker daemon setting on the container instance. For more information, see [IPC settings](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#ipc-settings---ipc) in the *Docker run reference* .
   *
   * If the `host` IPC mode is used, be aware that there is a heightened risk of undesired IPC namespace expose. For more information, see [Docker security](https://docs.aws.amazon.com/https://docs.docker.com/engine/security/security/) .
   *
   * If you are setting namespaced kernel parameters using `systemControls` for the containers in the task, the following will apply to your IPC resource namespace. For more information, see [System Controls](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * - For tasks that use the `host` IPC mode, IPC namespace related `systemControls` are not supported.
   * - For tasks that use the `task` IPC mode, IPC namespace related `systemControls` will apply to all containers within a task.
   *
   * > This parameter is not supported for Windows containers or tasks run on AWS Fargate .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-ipcmode
   */
  readonly ipcMode?: string;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * If your tasks runs on Amazon EC2 instances, you must specify either a task-level memory value or a container-level memory value. This field is optional and any value can be used. If a task-level memory value is specified, the container-level memory value is optional. For more information regarding container-level memory and memory reservation, see [ContainerDefinition](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html) .
   *
   * If your tasks runs on AWS Fargate , this field is required. You must use one of the following values. The value you choose determines your range of valid values for the `cpu` parameter.
   *
   * - 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB) - Available `cpu` values: 256 (.25 vCPU)
   * - 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB) - Available `cpu` values: 512 (.5 vCPU)
   * - 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB) - Available `cpu` values: 1024 (1 vCPU)
   * - Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB) - Available `cpu` values: 2048 (2 vCPU)
   * - Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB) - Available `cpu` values: 4096 (4 vCPU)
   * - Between 16 GB and 60 GB in 4 GB increments - Available `cpu` values: 8192 (8 vCPU)
   *
   * This option requires Linux platform `1.4.0` or later.
   * - Between 32GB and 120 GB in 8 GB increments - Available `cpu` values: 16384 (16 vCPU)
   *
   * This option requires Linux platform `1.4.0` or later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-memory
   */
  readonly memory?: string;

  /**
   * The Docker networking mode to use for the containers in the task.
   *
   * The valid values are `none` , `bridge` , `awsvpc` , and `host` . If no network mode is specified, the default is `bridge` .
   *
   * For Amazon ECS tasks on Fargate, the `awsvpc` network mode is required. For Amazon ECS tasks on Amazon EC2 Linux instances, any network mode can be used. For Amazon ECS tasks on Amazon EC2 Windows instances, `<default>` or `awsvpc` can be used. If the network mode is set to `none` , you cannot specify port mappings in your container definitions, and the tasks containers do not have external connectivity. The `host` and `awsvpc` network modes offer the highest networking performance for containers because they use the EC2 network stack instead of the virtualized network stack provided by the `bridge` mode.
   *
   * With the `host` and `awsvpc` network modes, exposed container ports are mapped directly to the corresponding host port (for the `host` network mode) or the attached elastic network interface port (for the `awsvpc` network mode), so you cannot take advantage of dynamic host port mappings.
   *
   * > When using the `host` network mode, you should not run containers using the root user (UID 0). It is considered best practice to use a non-root user.
   *
   * If the network mode is `awsvpc` , the task is allocated an elastic network interface, and you must specify a `NetworkConfiguration` value when you create a service or run a task with the task definition. For more information, see [Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * If the network mode is `host` , you cannot run multiple instantiations of the same task on a single container instance when port mappings are used.
   *
   * For more information, see [Network settings](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#network-settings) in the *Docker run reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-networkmode
   */
  readonly networkMode?: string;

  /**
   * The process namespace to use for the containers in the task.
   *
   * The valid values are `host` or `task` . On Fargate for Linux containers, the only valid value is `task` . For example, monitoring sidecars might need `pidMode` to access information about other containers running in the same task.
   *
   * If `host` is specified, all containers within the tasks that specified the `host` PID mode on the same container instance share the same process namespace with the host Amazon EC2 instance.
   *
   * If `task` is specified, all containers within the specified task share the same process namespace.
   *
   * If no value is specified, the default is a private namespace for each container. For more information, see [PID settings](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/#pid-settings---pid) in the *Docker run reference* .
   *
   * If the `host` PID mode is used, there's a heightened risk of undesired process namespace exposure. For more information, see [Docker security](https://docs.aws.amazon.com/https://docs.docker.com/engine/security/security/) .
   *
   * > This parameter is not supported for Windows containers. > This parameter is only supported for tasks that are hosted on AWS Fargate if the tasks are using platform version `1.4.0` or later (Linux). This isn't supported for Windows containers on Fargate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-pidmode
   */
  readonly pidMode?: string;

  /**
   * An array of placement constraint objects to use for tasks.
   *
   * > This parameter isn't supported for tasks run on AWS Fargate .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-placementconstraints
   */
  readonly placementConstraints?: Array<cdk.IResolvable | CfnTaskDefinition.TaskDefinitionPlacementConstraintProperty> | cdk.IResolvable;

  /**
   * The configuration details for the App Mesh proxy.
   *
   * Your Amazon ECS container instances require at least version 1.26.0 of the container agent and at least version 1.26.0-1 of the `ecs-init` package to use a proxy configuration. If your container instances are launched from the Amazon ECS optimized AMI version `20190301` or later, they contain the required versions of the container agent and `ecs-init` . For more information, see [Amazon ECS-optimized Linux AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-proxyconfiguration
   */
  readonly proxyConfiguration?: cdk.IResolvable | CfnTaskDefinition.ProxyConfigurationProperty;

  /**
   * The task launch types the task definition was validated against.
   *
   * The valid values are `EC2` , `FARGATE` , and `EXTERNAL` . For more information, see [Amazon ECS launch types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-requirescompatibilities
   */
  readonly requiresCompatibilities?: Array<string>;

  /**
   * The operating system that your tasks definitions run on.
   *
   * A platform family is specified only for tasks using the Fargate launch type.
   *
   * When you specify a task definition in a service, this value must match the `runtimePlatform` value of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-runtimeplatform
   */
  readonly runtimePlatform?: cdk.IResolvable | CfnTaskDefinition.RuntimePlatformProperty;

  /**
   * The metadata that you apply to the task definition to help you categorize and organize them.
   *
   * Each tag consists of a key and an optional value. You define both of them.
   *
   * The following basic restrictions apply to tags:
   *
   * - Maximum number of tags per resource - 50
   * - For each resource, each tag key must be unique, and each tag key can have only one value.
   * - Maximum key length - 128 Unicode characters in UTF-8
   * - Maximum value length - 256 Unicode characters in UTF-8
   * - If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
   * - Tag keys and values are case-sensitive.
   * - Do not use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You cannot edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The short name or full Amazon Resource Name (ARN) of the AWS Identity and Access Management role that grants containers in the task permission to call AWS APIs on your behalf.
   *
   * For more information, see [Amazon ECS Task Role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * IAM roles for tasks on Windows require that the `-EnableTaskIAMRole` option is set when you launch the Amazon ECS-optimized Windows AMI. Your containers must also run some configuration code to use the feature. For more information, see [Windows IAM roles for tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/windows_task_IAM_roles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-taskrolearn
   */
  readonly taskRoleArn?: string;

  /**
   * The list of data volume definitions for the task.
   *
   * For more information, see [Using data volumes in tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * > The `host` and `sourcePath` parameters aren't supported for tasks run on AWS Fargate .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-volumes
   */
  readonly volumes?: Array<cdk.IResolvable | CfnTaskDefinition.VolumeProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `InferenceAcceleratorProperty`
 *
 * @param properties - the TypeScript properties of a `InferenceAcceleratorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionInferenceAcceleratorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("deviceType", cdk.validateString)(properties.deviceType));
  return errors.wrap("supplied properties not correct for \"InferenceAcceleratorProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionInferenceAcceleratorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionInferenceAcceleratorPropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "DeviceType": cdk.stringToCloudFormation(properties.deviceType)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionInferenceAcceleratorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.InferenceAcceleratorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.InferenceAcceleratorProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("deviceType", "DeviceType", (properties.DeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskDefinitionPlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `TaskDefinitionPlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"TaskDefinitionPlacementConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.TaskDefinitionPlacementConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.TaskDefinitionPlacementConstraintProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuntimePlatformProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimePlatformProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionRuntimePlatformPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuArchitecture", cdk.validateString)(properties.cpuArchitecture));
  errors.collect(cdk.propertyValidator("operatingSystemFamily", cdk.validateString)(properties.operatingSystemFamily));
  return errors.wrap("supplied properties not correct for \"RuntimePlatformProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionRuntimePlatformPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionRuntimePlatformPropertyValidator(properties).assertSuccess();
  return {
    "CpuArchitecture": cdk.stringToCloudFormation(properties.cpuArchitecture),
    "OperatingSystemFamily": cdk.stringToCloudFormation(properties.operatingSystemFamily)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionRuntimePlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.RuntimePlatformProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.RuntimePlatformProperty>();
  ret.addPropertyResult("cpuArchitecture", "CpuArchitecture", (properties.CpuArchitecture != null ? cfn_parse.FromCloudFormation.getString(properties.CpuArchitecture) : undefined));
  ret.addPropertyResult("operatingSystemFamily", "OperatingSystemFamily", (properties.OperatingSystemFamily != null ? cfn_parse.FromCloudFormation.getString(properties.OperatingSystemFamily) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyValuePairProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValuePairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionKeyValuePairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KeyValuePairProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionKeyValuePairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionKeyValuePairPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionKeyValuePairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.KeyValuePairProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.KeyValuePairProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProxyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProxyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionProxyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.requiredValidator)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("proxyConfigurationProperties", cdk.listValidator(CfnTaskDefinitionKeyValuePairPropertyValidator))(properties.proxyConfigurationProperties));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ProxyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionProxyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionProxyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ProxyConfigurationProperties": cdk.listMapper(convertCfnTaskDefinitionKeyValuePairPropertyToCloudFormation)(properties.proxyConfigurationProperties),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionProxyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.ProxyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.ProxyConfigurationProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("proxyConfigurationProperties", "ProxyConfigurationProperties", (properties.ProxyConfigurationProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionKeyValuePairPropertyFromCloudFormation)(properties.ProxyConfigurationProperties) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthorizationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionAuthorizationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPointId", cdk.validateString)(properties.accessPointId));
  errors.collect(cdk.propertyValidator("iam", cdk.validateString)(properties.iam));
  return errors.wrap("supplied properties not correct for \"AuthorizationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionAuthorizationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionAuthorizationConfigPropertyValidator(properties).assertSuccess();
  return {
    "AccessPointId": cdk.stringToCloudFormation(properties.accessPointId),
    "IAM": cdk.stringToCloudFormation(properties.iam)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionAuthorizationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.AuthorizationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.AuthorizationConfigProperty>();
  ret.addPropertyResult("accessPointId", "AccessPointId", (properties.AccessPointId != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointId) : undefined));
  ret.addPropertyResult("iam", "IAM", (properties.IAM != null ? cfn_parse.FromCloudFormation.getString(properties.IAM) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EFSVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EFSVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionEFSVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationConfig", CfnTaskDefinitionAuthorizationConfigPropertyValidator)(properties.authorizationConfig));
  errors.collect(cdk.propertyValidator("filesystemId", cdk.requiredValidator)(properties.filesystemId));
  errors.collect(cdk.propertyValidator("filesystemId", cdk.validateString)(properties.filesystemId));
  errors.collect(cdk.propertyValidator("rootDirectory", cdk.validateString)(properties.rootDirectory));
  errors.collect(cdk.propertyValidator("transitEncryption", cdk.validateString)(properties.transitEncryption));
  errors.collect(cdk.propertyValidator("transitEncryptionPort", cdk.validateNumber)(properties.transitEncryptionPort));
  return errors.wrap("supplied properties not correct for \"EFSVolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionEFSVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionEFSVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationConfig": convertCfnTaskDefinitionAuthorizationConfigPropertyToCloudFormation(properties.authorizationConfig),
    "FilesystemId": cdk.stringToCloudFormation(properties.filesystemId),
    "RootDirectory": cdk.stringToCloudFormation(properties.rootDirectory),
    "TransitEncryption": cdk.stringToCloudFormation(properties.transitEncryption),
    "TransitEncryptionPort": cdk.numberToCloudFormation(properties.transitEncryptionPort)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionEFSVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.EFSVolumeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.EFSVolumeConfigurationProperty>();
  ret.addPropertyResult("authorizationConfig", "AuthorizationConfig", (properties.AuthorizationConfig != null ? CfnTaskDefinitionAuthorizationConfigPropertyFromCloudFormation(properties.AuthorizationConfig) : undefined));
  ret.addPropertyResult("filesystemId", "FilesystemId", (properties.FilesystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FilesystemId) : undefined));
  ret.addPropertyResult("rootDirectory", "RootDirectory", (properties.RootDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.RootDirectory) : undefined));
  ret.addPropertyResult("transitEncryption", "TransitEncryption", (properties.TransitEncryption != null ? cfn_parse.FromCloudFormation.getString(properties.TransitEncryption) : undefined));
  ret.addPropertyResult("transitEncryptionPort", "TransitEncryptionPort", (properties.TransitEncryptionPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransitEncryptionPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HostVolumePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `HostVolumePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionHostVolumePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"HostVolumePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionHostVolumePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionHostVolumePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionHostVolumePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.HostVolumePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.HostVolumePropertiesProperty>();
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DockerVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DockerVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionDockerVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoprovision", cdk.validateBoolean)(properties.autoprovision));
  errors.collect(cdk.propertyValidator("driver", cdk.validateString)(properties.driver));
  errors.collect(cdk.propertyValidator("driverOpts", cdk.hashValidator(cdk.validateString))(properties.driverOpts));
  errors.collect(cdk.propertyValidator("labels", cdk.hashValidator(cdk.validateString))(properties.labels));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  return errors.wrap("supplied properties not correct for \"DockerVolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionDockerVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionDockerVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Autoprovision": cdk.booleanToCloudFormation(properties.autoprovision),
    "Driver": cdk.stringToCloudFormation(properties.driver),
    "DriverOpts": cdk.hashMapper(cdk.stringToCloudFormation)(properties.driverOpts),
    "Labels": cdk.hashMapper(cdk.stringToCloudFormation)(properties.labels),
    "Scope": cdk.stringToCloudFormation(properties.scope)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionDockerVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.DockerVolumeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.DockerVolumeConfigurationProperty>();
  ret.addPropertyResult("autoprovision", "Autoprovision", (properties.Autoprovision != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Autoprovision) : undefined));
  ret.addPropertyResult("driver", "Driver", (properties.Driver != null ? cfn_parse.FromCloudFormation.getString(properties.Driver) : undefined));
  ret.addPropertyResult("driverOpts", "DriverOpts", (properties.DriverOpts != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DriverOpts) : undefined));
  ret.addPropertyResult("labels", "Labels", (properties.Labels != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Labels) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionVolumePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuredAtLaunch", cdk.validateBoolean)(properties.configuredAtLaunch));
  errors.collect(cdk.propertyValidator("dockerVolumeConfiguration", CfnTaskDefinitionDockerVolumeConfigurationPropertyValidator)(properties.dockerVolumeConfiguration));
  errors.collect(cdk.propertyValidator("efsVolumeConfiguration", CfnTaskDefinitionEFSVolumeConfigurationPropertyValidator)(properties.efsVolumeConfiguration));
  errors.collect(cdk.propertyValidator("host", CfnTaskDefinitionHostVolumePropertiesPropertyValidator)(properties.host));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"VolumeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionVolumePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionVolumePropertyValidator(properties).assertSuccess();
  return {
    "ConfiguredAtLaunch": cdk.booleanToCloudFormation(properties.configuredAtLaunch),
    "DockerVolumeConfiguration": convertCfnTaskDefinitionDockerVolumeConfigurationPropertyToCloudFormation(properties.dockerVolumeConfiguration),
    "EFSVolumeConfiguration": convertCfnTaskDefinitionEFSVolumeConfigurationPropertyToCloudFormation(properties.efsVolumeConfiguration),
    "Host": convertCfnTaskDefinitionHostVolumePropertiesPropertyToCloudFormation(properties.host),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionVolumePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.VolumeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.VolumeProperty>();
  ret.addPropertyResult("configuredAtLaunch", "ConfiguredAtLaunch", (properties.ConfiguredAtLaunch != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ConfiguredAtLaunch) : undefined));
  ret.addPropertyResult("dockerVolumeConfiguration", "DockerVolumeConfiguration", (properties.DockerVolumeConfiguration != null ? CfnTaskDefinitionDockerVolumeConfigurationPropertyFromCloudFormation(properties.DockerVolumeConfiguration) : undefined));
  ret.addPropertyResult("efsVolumeConfiguration", "EFSVolumeConfiguration", (properties.EFSVolumeConfiguration != null ? CfnTaskDefinitionEFSVolumeConfigurationPropertyFromCloudFormation(properties.EFSVolumeConfiguration) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? CfnTaskDefinitionHostVolumePropertiesPropertyFromCloudFormation(properties.Host) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecretProperty`
 *
 * @param properties - the TypeScript properties of a `SecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.requiredValidator)(properties.valueFrom));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.validateString)(properties.valueFrom));
  return errors.wrap("supplied properties not correct for \"SecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionSecretPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ValueFrom": cdk.stringToCloudFormation(properties.valueFrom)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.SecretProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.SecretProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("valueFrom", "ValueFrom", (properties.ValueFrom != null ? cfn_parse.FromCloudFormation.getString(properties.ValueFrom) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthCheckProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionHealthCheckPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("retries", cdk.validateNumber)(properties.retries));
  errors.collect(cdk.propertyValidator("startPeriod", cdk.validateNumber)(properties.startPeriod));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"HealthCheckProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionHealthCheckPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionHealthCheckPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "Retries": cdk.numberToCloudFormation(properties.retries),
    "StartPeriod": cdk.numberToCloudFormation(properties.startPeriod),
    "Timeout": cdk.numberToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionHealthCheckPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.HealthCheckProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.HealthCheckProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("retries", "Retries", (properties.Retries != null ? cfn_parse.FromCloudFormation.getNumber(properties.Retries) : undefined));
  ret.addPropertyResult("startPeriod", "StartPeriod", (properties.StartPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartPeriod) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeFromProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeFromProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionVolumeFromPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("readOnly", cdk.validateBoolean)(properties.readOnly));
  errors.collect(cdk.propertyValidator("sourceContainer", cdk.validateString)(properties.sourceContainer));
  return errors.wrap("supplied properties not correct for \"VolumeFromProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionVolumeFromPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionVolumeFromPropertyValidator(properties).assertSuccess();
  return {
    "ReadOnly": cdk.booleanToCloudFormation(properties.readOnly),
    "SourceContainer": cdk.stringToCloudFormation(properties.sourceContainer)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionVolumeFromPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.VolumeFromProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.VolumeFromProperty>();
  ret.addPropertyResult("readOnly", "ReadOnly", (properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined));
  ret.addPropertyResult("sourceContainer", "SourceContainer", (properties.SourceContainer != null ? cfn_parse.FromCloudFormation.getString(properties.SourceContainer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDriver", cdk.requiredValidator)(properties.logDriver));
  errors.collect(cdk.propertyValidator("logDriver", cdk.validateString)(properties.logDriver));
  errors.collect(cdk.propertyValidator("options", cdk.hashValidator(cdk.validateString))(properties.options));
  errors.collect(cdk.propertyValidator("secretOptions", cdk.listValidator(CfnTaskDefinitionSecretPropertyValidator))(properties.secretOptions));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogDriver": cdk.stringToCloudFormation(properties.logDriver),
    "Options": cdk.hashMapper(cdk.stringToCloudFormation)(properties.options),
    "SecretOptions": cdk.listMapper(convertCfnTaskDefinitionSecretPropertyToCloudFormation)(properties.secretOptions)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LogConfigurationProperty>();
  ret.addPropertyResult("logDriver", "LogDriver", (properties.LogDriver != null ? cfn_parse.FromCloudFormation.getString(properties.LogDriver) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Options) : undefined));
  ret.addPropertyResult("secretOptions", "SecretOptions", (properties.SecretOptions != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionSecretPropertyFromCloudFormation)(properties.SecretOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ResourceRequirementProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionResourceRequirementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionResourceRequirementPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.ResourceRequirementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.ResourceRequirementProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentFileProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentFileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionEnvironmentFilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EnvironmentFileProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionEnvironmentFilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionEnvironmentFilePropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionEnvironmentFilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.EnvironmentFileProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.EnvironmentFileProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirelensConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FirelensConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionFirelensConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("options", cdk.hashValidator(cdk.validateString))(properties.options));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FirelensConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionFirelensConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionFirelensConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Options": cdk.hashMapper(cdk.stringToCloudFormation)(properties.options),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionFirelensConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.FirelensConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.FirelensConfigurationProperty>();
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Options) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SystemControlProperty`
 *
 * @param properties - the TypeScript properties of a `SystemControlProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionSystemControlPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SystemControlProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionSystemControlPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionSystemControlPropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionSystemControlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.SystemControlProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.SystemControlProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UlimitProperty`
 *
 * @param properties - the TypeScript properties of a `UlimitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionUlimitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hardLimit", cdk.requiredValidator)(properties.hardLimit));
  errors.collect(cdk.propertyValidator("hardLimit", cdk.validateNumber)(properties.hardLimit));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("softLimit", cdk.requiredValidator)(properties.softLimit));
  errors.collect(cdk.propertyValidator("softLimit", cdk.validateNumber)(properties.softLimit));
  return errors.wrap("supplied properties not correct for \"UlimitProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionUlimitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionUlimitPropertyValidator(properties).assertSuccess();
  return {
    "HardLimit": cdk.numberToCloudFormation(properties.hardLimit),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SoftLimit": cdk.numberToCloudFormation(properties.softLimit)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionUlimitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.UlimitProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.UlimitProperty>();
  ret.addPropertyResult("hardLimit", "HardLimit", (properties.HardLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.HardLimit) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("softLimit", "SoftLimit", (properties.SoftLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.SoftLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RepositoryCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionRepositoryCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentialsParameter", cdk.validateString)(properties.credentialsParameter));
  return errors.wrap("supplied properties not correct for \"RepositoryCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionRepositoryCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionRepositoryCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "CredentialsParameter": cdk.stringToCloudFormation(properties.credentialsParameter)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionRepositoryCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.RepositoryCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.RepositoryCredentialsProperty>();
  ret.addPropertyResult("credentialsParameter", "CredentialsParameter", (properties.CredentialsParameter != null ? cfn_parse.FromCloudFormation.getString(properties.CredentialsParameter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HostEntryProperty`
 *
 * @param properties - the TypeScript properties of a `HostEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionHostEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", cdk.validateString)(properties.hostname));
  errors.collect(cdk.propertyValidator("ipAddress", cdk.validateString)(properties.ipAddress));
  return errors.wrap("supplied properties not correct for \"HostEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionHostEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionHostEntryPropertyValidator(properties).assertSuccess();
  return {
    "Hostname": cdk.stringToCloudFormation(properties.hostname),
    "IpAddress": cdk.stringToCloudFormation(properties.ipAddress)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionHostEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.HostEntryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.HostEntryProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined));
  ret.addPropertyResult("ipAddress", "IpAddress", (properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KernelCapabilitiesProperty`
 *
 * @param properties - the TypeScript properties of a `KernelCapabilitiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionKernelCapabilitiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("add", cdk.listValidator(cdk.validateString))(properties.add));
  errors.collect(cdk.propertyValidator("drop", cdk.listValidator(cdk.validateString))(properties.drop));
  return errors.wrap("supplied properties not correct for \"KernelCapabilitiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionKernelCapabilitiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionKernelCapabilitiesPropertyValidator(properties).assertSuccess();
  return {
    "Add": cdk.listMapper(cdk.stringToCloudFormation)(properties.add),
    "Drop": cdk.listMapper(cdk.stringToCloudFormation)(properties.drop)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionKernelCapabilitiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.KernelCapabilitiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.KernelCapabilitiesProperty>();
  ret.addPropertyResult("add", "Add", (properties.Add != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Add) : undefined));
  ret.addPropertyResult("drop", "Drop", (properties.Drop != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Drop) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TmpfsProperty`
 *
 * @param properties - the TypeScript properties of a `TmpfsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionTmpfsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("mountOptions", cdk.listValidator(cdk.validateString))(properties.mountOptions));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"TmpfsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionTmpfsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionTmpfsPropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "MountOptions": cdk.listMapper(cdk.stringToCloudFormation)(properties.mountOptions),
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionTmpfsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.TmpfsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.TmpfsProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MountOptions) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("hostPath", cdk.validateString)(properties.hostPath));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  return errors.wrap("supplied properties not correct for \"DeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionDevicePropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "HostPath": cdk.stringToCloudFormation(properties.hostPath),
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.DeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.DeviceProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("hostPath", "HostPath", (properties.HostPath != null ? cfn_parse.FromCloudFormation.getString(properties.HostPath) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LinuxParametersProperty`
 *
 * @param properties - the TypeScript properties of a `LinuxParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionLinuxParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capabilities", CfnTaskDefinitionKernelCapabilitiesPropertyValidator)(properties.capabilities));
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnTaskDefinitionDevicePropertyValidator))(properties.devices));
  errors.collect(cdk.propertyValidator("initProcessEnabled", cdk.validateBoolean)(properties.initProcessEnabled));
  errors.collect(cdk.propertyValidator("maxSwap", cdk.validateNumber)(properties.maxSwap));
  errors.collect(cdk.propertyValidator("sharedMemorySize", cdk.validateNumber)(properties.sharedMemorySize));
  errors.collect(cdk.propertyValidator("swappiness", cdk.validateNumber)(properties.swappiness));
  errors.collect(cdk.propertyValidator("tmpfs", cdk.listValidator(CfnTaskDefinitionTmpfsPropertyValidator))(properties.tmpfs));
  return errors.wrap("supplied properties not correct for \"LinuxParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionLinuxParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionLinuxParametersPropertyValidator(properties).assertSuccess();
  return {
    "Capabilities": convertCfnTaskDefinitionKernelCapabilitiesPropertyToCloudFormation(properties.capabilities),
    "Devices": cdk.listMapper(convertCfnTaskDefinitionDevicePropertyToCloudFormation)(properties.devices),
    "InitProcessEnabled": cdk.booleanToCloudFormation(properties.initProcessEnabled),
    "MaxSwap": cdk.numberToCloudFormation(properties.maxSwap),
    "SharedMemorySize": cdk.numberToCloudFormation(properties.sharedMemorySize),
    "Swappiness": cdk.numberToCloudFormation(properties.swappiness),
    "Tmpfs": cdk.listMapper(convertCfnTaskDefinitionTmpfsPropertyToCloudFormation)(properties.tmpfs)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLinuxParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.LinuxParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LinuxParametersProperty>();
  ret.addPropertyResult("capabilities", "Capabilities", (properties.Capabilities != null ? CfnTaskDefinitionKernelCapabilitiesPropertyFromCloudFormation(properties.Capabilities) : undefined));
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionDevicePropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addPropertyResult("initProcessEnabled", "InitProcessEnabled", (properties.InitProcessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InitProcessEnabled) : undefined));
  ret.addPropertyResult("maxSwap", "MaxSwap", (properties.MaxSwap != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSwap) : undefined));
  ret.addPropertyResult("sharedMemorySize", "SharedMemorySize", (properties.SharedMemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.SharedMemorySize) : undefined));
  ret.addPropertyResult("swappiness", "Swappiness", (properties.Swappiness != null ? cfn_parse.FromCloudFormation.getNumber(properties.Swappiness) : undefined));
  ret.addPropertyResult("tmpfs", "Tmpfs", (properties.Tmpfs != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionTmpfsPropertyFromCloudFormation)(properties.Tmpfs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MountPointProperty`
 *
 * @param properties - the TypeScript properties of a `MountPointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionMountPointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("readOnly", cdk.validateBoolean)(properties.readOnly));
  errors.collect(cdk.propertyValidator("sourceVolume", cdk.validateString)(properties.sourceVolume));
  return errors.wrap("supplied properties not correct for \"MountPointProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionMountPointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionMountPointPropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "ReadOnly": cdk.booleanToCloudFormation(properties.readOnly),
    "SourceVolume": cdk.stringToCloudFormation(properties.sourceVolume)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionMountPointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.MountPointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.MountPointProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("readOnly", "ReadOnly", (properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined));
  ret.addPropertyResult("sourceVolume", "SourceVolume", (properties.SourceVolume != null ? cfn_parse.FromCloudFormation.getString(properties.SourceVolume) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerDependencyProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerDependencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionContainerDependencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  return errors.wrap("supplied properties not correct for \"ContainerDependencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionContainerDependencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionContainerDependencyPropertyValidator(properties).assertSuccess();
  return {
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "ContainerName": cdk.stringToCloudFormation(properties.containerName)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionContainerDependencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.ContainerDependencyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.ContainerDependencyProperty>();
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionPortMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appProtocol", cdk.validateString)(properties.appProtocol));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("containerPortRange", cdk.validateString)(properties.containerPortRange));
  errors.collect(cdk.propertyValidator("hostPort", cdk.validateNumber)(properties.hostPort));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"PortMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionPortMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionPortMappingPropertyValidator(properties).assertSuccess();
  return {
    "AppProtocol": cdk.stringToCloudFormation(properties.appProtocol),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "ContainerPortRange": cdk.stringToCloudFormation(properties.containerPortRange),
    "HostPort": cdk.numberToCloudFormation(properties.hostPort),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionPortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.PortMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.PortMappingProperty>();
  ret.addPropertyResult("appProtocol", "AppProtocol", (properties.AppProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.AppProtocol) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("containerPortRange", "ContainerPortRange", (properties.ContainerPortRange != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPortRange) : undefined));
  ret.addPropertyResult("hostPort", "HostPort", (properties.HostPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HostPort) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionContainerDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateNumber)(properties.cpu));
  errors.collect(cdk.propertyValidator("dependsOn", cdk.listValidator(CfnTaskDefinitionContainerDependencyPropertyValidator))(properties.dependsOn));
  errors.collect(cdk.propertyValidator("disableNetworking", cdk.validateBoolean)(properties.disableNetworking));
  errors.collect(cdk.propertyValidator("dnsSearchDomains", cdk.listValidator(cdk.validateString))(properties.dnsSearchDomains));
  errors.collect(cdk.propertyValidator("dnsServers", cdk.listValidator(cdk.validateString))(properties.dnsServers));
  errors.collect(cdk.propertyValidator("dockerLabels", cdk.hashValidator(cdk.validateString))(properties.dockerLabels));
  errors.collect(cdk.propertyValidator("dockerSecurityOptions", cdk.listValidator(cdk.validateString))(properties.dockerSecurityOptions));
  errors.collect(cdk.propertyValidator("entryPoint", cdk.listValidator(cdk.validateString))(properties.entryPoint));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnTaskDefinitionKeyValuePairPropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("environmentFiles", cdk.listValidator(CfnTaskDefinitionEnvironmentFilePropertyValidator))(properties.environmentFiles));
  errors.collect(cdk.propertyValidator("essential", cdk.validateBoolean)(properties.essential));
  errors.collect(cdk.propertyValidator("extraHosts", cdk.listValidator(CfnTaskDefinitionHostEntryPropertyValidator))(properties.extraHosts));
  errors.collect(cdk.propertyValidator("firelensConfiguration", CfnTaskDefinitionFirelensConfigurationPropertyValidator)(properties.firelensConfiguration));
  errors.collect(cdk.propertyValidator("healthCheck", CfnTaskDefinitionHealthCheckPropertyValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("hostname", cdk.validateString)(properties.hostname));
  errors.collect(cdk.propertyValidator("image", cdk.requiredValidator)(properties.image));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  errors.collect(cdk.propertyValidator("interactive", cdk.validateBoolean)(properties.interactive));
  errors.collect(cdk.propertyValidator("links", cdk.listValidator(cdk.validateString))(properties.links));
  errors.collect(cdk.propertyValidator("linuxParameters", CfnTaskDefinitionLinuxParametersPropertyValidator)(properties.linuxParameters));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnTaskDefinitionLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("memory", cdk.validateNumber)(properties.memory));
  errors.collect(cdk.propertyValidator("memoryReservation", cdk.validateNumber)(properties.memoryReservation));
  errors.collect(cdk.propertyValidator("mountPoints", cdk.listValidator(CfnTaskDefinitionMountPointPropertyValidator))(properties.mountPoints));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("portMappings", cdk.listValidator(CfnTaskDefinitionPortMappingPropertyValidator))(properties.portMappings));
  errors.collect(cdk.propertyValidator("privileged", cdk.validateBoolean)(properties.privileged));
  errors.collect(cdk.propertyValidator("pseudoTerminal", cdk.validateBoolean)(properties.pseudoTerminal));
  errors.collect(cdk.propertyValidator("readonlyRootFilesystem", cdk.validateBoolean)(properties.readonlyRootFilesystem));
  errors.collect(cdk.propertyValidator("repositoryCredentials", CfnTaskDefinitionRepositoryCredentialsPropertyValidator)(properties.repositoryCredentials));
  errors.collect(cdk.propertyValidator("resourceRequirements", cdk.listValidator(CfnTaskDefinitionResourceRequirementPropertyValidator))(properties.resourceRequirements));
  errors.collect(cdk.propertyValidator("secrets", cdk.listValidator(CfnTaskDefinitionSecretPropertyValidator))(properties.secrets));
  errors.collect(cdk.propertyValidator("startTimeout", cdk.validateNumber)(properties.startTimeout));
  errors.collect(cdk.propertyValidator("stopTimeout", cdk.validateNumber)(properties.stopTimeout));
  errors.collect(cdk.propertyValidator("systemControls", cdk.listValidator(CfnTaskDefinitionSystemControlPropertyValidator))(properties.systemControls));
  errors.collect(cdk.propertyValidator("ulimits", cdk.listValidator(CfnTaskDefinitionUlimitPropertyValidator))(properties.ulimits));
  errors.collect(cdk.propertyValidator("user", cdk.validateString)(properties.user));
  errors.collect(cdk.propertyValidator("volumesFrom", cdk.listValidator(CfnTaskDefinitionVolumeFromPropertyValidator))(properties.volumesFrom));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"ContainerDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionContainerDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionContainerDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Cpu": cdk.numberToCloudFormation(properties.cpu),
    "DependsOn": cdk.listMapper(convertCfnTaskDefinitionContainerDependencyPropertyToCloudFormation)(properties.dependsOn),
    "DisableNetworking": cdk.booleanToCloudFormation(properties.disableNetworking),
    "DnsSearchDomains": cdk.listMapper(cdk.stringToCloudFormation)(properties.dnsSearchDomains),
    "DnsServers": cdk.listMapper(cdk.stringToCloudFormation)(properties.dnsServers),
    "DockerLabels": cdk.hashMapper(cdk.stringToCloudFormation)(properties.dockerLabels),
    "DockerSecurityOptions": cdk.listMapper(cdk.stringToCloudFormation)(properties.dockerSecurityOptions),
    "EntryPoint": cdk.listMapper(cdk.stringToCloudFormation)(properties.entryPoint),
    "Environment": cdk.listMapper(convertCfnTaskDefinitionKeyValuePairPropertyToCloudFormation)(properties.environment),
    "EnvironmentFiles": cdk.listMapper(convertCfnTaskDefinitionEnvironmentFilePropertyToCloudFormation)(properties.environmentFiles),
    "Essential": cdk.booleanToCloudFormation(properties.essential),
    "ExtraHosts": cdk.listMapper(convertCfnTaskDefinitionHostEntryPropertyToCloudFormation)(properties.extraHosts),
    "FirelensConfiguration": convertCfnTaskDefinitionFirelensConfigurationPropertyToCloudFormation(properties.firelensConfiguration),
    "HealthCheck": convertCfnTaskDefinitionHealthCheckPropertyToCloudFormation(properties.healthCheck),
    "Hostname": cdk.stringToCloudFormation(properties.hostname),
    "Image": cdk.stringToCloudFormation(properties.image),
    "Interactive": cdk.booleanToCloudFormation(properties.interactive),
    "Links": cdk.listMapper(cdk.stringToCloudFormation)(properties.links),
    "LinuxParameters": convertCfnTaskDefinitionLinuxParametersPropertyToCloudFormation(properties.linuxParameters),
    "LogConfiguration": convertCfnTaskDefinitionLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "Memory": cdk.numberToCloudFormation(properties.memory),
    "MemoryReservation": cdk.numberToCloudFormation(properties.memoryReservation),
    "MountPoints": cdk.listMapper(convertCfnTaskDefinitionMountPointPropertyToCloudFormation)(properties.mountPoints),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PortMappings": cdk.listMapper(convertCfnTaskDefinitionPortMappingPropertyToCloudFormation)(properties.portMappings),
    "Privileged": cdk.booleanToCloudFormation(properties.privileged),
    "PseudoTerminal": cdk.booleanToCloudFormation(properties.pseudoTerminal),
    "ReadonlyRootFilesystem": cdk.booleanToCloudFormation(properties.readonlyRootFilesystem),
    "RepositoryCredentials": convertCfnTaskDefinitionRepositoryCredentialsPropertyToCloudFormation(properties.repositoryCredentials),
    "ResourceRequirements": cdk.listMapper(convertCfnTaskDefinitionResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements),
    "Secrets": cdk.listMapper(convertCfnTaskDefinitionSecretPropertyToCloudFormation)(properties.secrets),
    "StartTimeout": cdk.numberToCloudFormation(properties.startTimeout),
    "StopTimeout": cdk.numberToCloudFormation(properties.stopTimeout),
    "SystemControls": cdk.listMapper(convertCfnTaskDefinitionSystemControlPropertyToCloudFormation)(properties.systemControls),
    "Ulimits": cdk.listMapper(convertCfnTaskDefinitionUlimitPropertyToCloudFormation)(properties.ulimits),
    "User": cdk.stringToCloudFormation(properties.user),
    "VolumesFrom": cdk.listMapper(convertCfnTaskDefinitionVolumeFromPropertyToCloudFormation)(properties.volumesFrom),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionContainerDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.ContainerDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.ContainerDefinitionProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cpu) : undefined));
  ret.addPropertyResult("dependsOn", "DependsOn", (properties.DependsOn != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionContainerDependencyPropertyFromCloudFormation)(properties.DependsOn) : undefined));
  ret.addPropertyResult("disableNetworking", "DisableNetworking", (properties.DisableNetworking != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableNetworking) : undefined));
  ret.addPropertyResult("dnsSearchDomains", "DnsSearchDomains", (properties.DnsSearchDomains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DnsSearchDomains) : undefined));
  ret.addPropertyResult("dnsServers", "DnsServers", (properties.DnsServers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DnsServers) : undefined));
  ret.addPropertyResult("dockerLabels", "DockerLabels", (properties.DockerLabels != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DockerLabels) : undefined));
  ret.addPropertyResult("dockerSecurityOptions", "DockerSecurityOptions", (properties.DockerSecurityOptions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DockerSecurityOptions) : undefined));
  ret.addPropertyResult("entryPoint", "EntryPoint", (properties.EntryPoint != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EntryPoint) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionKeyValuePairPropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("environmentFiles", "EnvironmentFiles", (properties.EnvironmentFiles != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionEnvironmentFilePropertyFromCloudFormation)(properties.EnvironmentFiles) : undefined));
  ret.addPropertyResult("essential", "Essential", (properties.Essential != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Essential) : undefined));
  ret.addPropertyResult("extraHosts", "ExtraHosts", (properties.ExtraHosts != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionHostEntryPropertyFromCloudFormation)(properties.ExtraHosts) : undefined));
  ret.addPropertyResult("firelensConfiguration", "FirelensConfiguration", (properties.FirelensConfiguration != null ? CfnTaskDefinitionFirelensConfigurationPropertyFromCloudFormation(properties.FirelensConfiguration) : undefined));
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? CfnTaskDefinitionHealthCheckPropertyFromCloudFormation(properties.HealthCheck) : undefined));
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addPropertyResult("interactive", "Interactive", (properties.Interactive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Interactive) : undefined));
  ret.addPropertyResult("links", "Links", (properties.Links != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Links) : undefined));
  ret.addPropertyResult("linuxParameters", "LinuxParameters", (properties.LinuxParameters != null ? CfnTaskDefinitionLinuxParametersPropertyFromCloudFormation(properties.LinuxParameters) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnTaskDefinitionLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined));
  ret.addPropertyResult("memoryReservation", "MemoryReservation", (properties.MemoryReservation != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryReservation) : undefined));
  ret.addPropertyResult("mountPoints", "MountPoints", (properties.MountPoints != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionMountPointPropertyFromCloudFormation)(properties.MountPoints) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("portMappings", "PortMappings", (properties.PortMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionPortMappingPropertyFromCloudFormation)(properties.PortMappings) : undefined));
  ret.addPropertyResult("privileged", "Privileged", (properties.Privileged != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Privileged) : undefined));
  ret.addPropertyResult("pseudoTerminal", "PseudoTerminal", (properties.PseudoTerminal != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PseudoTerminal) : undefined));
  ret.addPropertyResult("readonlyRootFilesystem", "ReadonlyRootFilesystem", (properties.ReadonlyRootFilesystem != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadonlyRootFilesystem) : undefined));
  ret.addPropertyResult("repositoryCredentials", "RepositoryCredentials", (properties.RepositoryCredentials != null ? CfnTaskDefinitionRepositoryCredentialsPropertyFromCloudFormation(properties.RepositoryCredentials) : undefined));
  ret.addPropertyResult("resourceRequirements", "ResourceRequirements", (properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined));
  ret.addPropertyResult("secrets", "Secrets", (properties.Secrets != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionSecretPropertyFromCloudFormation)(properties.Secrets) : undefined));
  ret.addPropertyResult("startTimeout", "StartTimeout", (properties.StartTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartTimeout) : undefined));
  ret.addPropertyResult("stopTimeout", "StopTimeout", (properties.StopTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.StopTimeout) : undefined));
  ret.addPropertyResult("systemControls", "SystemControls", (properties.SystemControls != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionSystemControlPropertyFromCloudFormation)(properties.SystemControls) : undefined));
  ret.addPropertyResult("ulimits", "Ulimits", (properties.Ulimits != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionUlimitPropertyFromCloudFormation)(properties.Ulimits) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? cfn_parse.FromCloudFormation.getString(properties.User) : undefined));
  ret.addPropertyResult("volumesFrom", "VolumesFrom", (properties.VolumesFrom != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionVolumeFromPropertyFromCloudFormation)(properties.VolumesFrom) : undefined));
  ret.addPropertyResult("workingDirectory", "WorkingDirectory", (properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.validateNumber)(properties.sizeInGiB));
  return errors.wrap("supplied properties not correct for \"EphemeralStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionEphemeralStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionEphemeralStoragePropertyValidator(properties).assertSuccess();
  return {
    "SizeInGiB": cdk.numberToCloudFormation(properties.sizeInGiB)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.EphemeralStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.EphemeralStorageProperty>();
  ret.addPropertyResult("sizeInGiB", "SizeInGiB", (properties.SizeInGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGiB) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTaskDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerDefinitions", cdk.listValidator(CfnTaskDefinitionContainerDefinitionPropertyValidator))(properties.containerDefinitions));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateString)(properties.cpu));
  errors.collect(cdk.propertyValidator("ephemeralStorage", CfnTaskDefinitionEphemeralStoragePropertyValidator)(properties.ephemeralStorage));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
  errors.collect(cdk.propertyValidator("inferenceAccelerators", cdk.listValidator(CfnTaskDefinitionInferenceAcceleratorPropertyValidator))(properties.inferenceAccelerators));
  errors.collect(cdk.propertyValidator("ipcMode", cdk.validateString)(properties.ipcMode));
  errors.collect(cdk.propertyValidator("memory", cdk.validateString)(properties.memory));
  errors.collect(cdk.propertyValidator("networkMode", cdk.validateString)(properties.networkMode));
  errors.collect(cdk.propertyValidator("pidMode", cdk.validateString)(properties.pidMode));
  errors.collect(cdk.propertyValidator("placementConstraints", cdk.listValidator(CfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyValidator))(properties.placementConstraints));
  errors.collect(cdk.propertyValidator("proxyConfiguration", CfnTaskDefinitionProxyConfigurationPropertyValidator)(properties.proxyConfiguration));
  errors.collect(cdk.propertyValidator("requiresCompatibilities", cdk.listValidator(cdk.validateString))(properties.requiresCompatibilities));
  errors.collect(cdk.propertyValidator("runtimePlatform", CfnTaskDefinitionRuntimePlatformPropertyValidator)(properties.runtimePlatform));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskRoleArn", cdk.validateString)(properties.taskRoleArn));
  errors.collect(cdk.propertyValidator("volumes", cdk.listValidator(CfnTaskDefinitionVolumePropertyValidator))(properties.volumes));
  return errors.wrap("supplied properties not correct for \"CfnTaskDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionPropsValidator(properties).assertSuccess();
  return {
    "ContainerDefinitions": cdk.listMapper(convertCfnTaskDefinitionContainerDefinitionPropertyToCloudFormation)(properties.containerDefinitions),
    "Cpu": cdk.stringToCloudFormation(properties.cpu),
    "EphemeralStorage": convertCfnTaskDefinitionEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "Family": cdk.stringToCloudFormation(properties.family),
    "InferenceAccelerators": cdk.listMapper(convertCfnTaskDefinitionInferenceAcceleratorPropertyToCloudFormation)(properties.inferenceAccelerators),
    "IpcMode": cdk.stringToCloudFormation(properties.ipcMode),
    "Memory": cdk.stringToCloudFormation(properties.memory),
    "NetworkMode": cdk.stringToCloudFormation(properties.networkMode),
    "PidMode": cdk.stringToCloudFormation(properties.pidMode),
    "PlacementConstraints": cdk.listMapper(convertCfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
    "ProxyConfiguration": convertCfnTaskDefinitionProxyConfigurationPropertyToCloudFormation(properties.proxyConfiguration),
    "RequiresCompatibilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.requiresCompatibilities),
    "RuntimePlatform": convertCfnTaskDefinitionRuntimePlatformPropertyToCloudFormation(properties.runtimePlatform),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskRoleArn": cdk.stringToCloudFormation(properties.taskRoleArn),
    "Volumes": cdk.listMapper(convertCfnTaskDefinitionVolumePropertyToCloudFormation)(properties.volumes)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinitionProps>();
  ret.addPropertyResult("containerDefinitions", "ContainerDefinitions", (properties.ContainerDefinitions != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionContainerDefinitionPropertyFromCloudFormation)(properties.ContainerDefinitions) : undefined));
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined));
  ret.addPropertyResult("ephemeralStorage", "EphemeralStorage", (properties.EphemeralStorage != null ? CfnTaskDefinitionEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("inferenceAccelerators", "InferenceAccelerators", (properties.InferenceAccelerators != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionInferenceAcceleratorPropertyFromCloudFormation)(properties.InferenceAccelerators) : undefined));
  ret.addPropertyResult("ipcMode", "IpcMode", (properties.IpcMode != null ? cfn_parse.FromCloudFormation.getString(properties.IpcMode) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined));
  ret.addPropertyResult("networkMode", "NetworkMode", (properties.NetworkMode != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkMode) : undefined));
  ret.addPropertyResult("pidMode", "PidMode", (properties.PidMode != null ? cfn_parse.FromCloudFormation.getString(properties.PidMode) : undefined));
  ret.addPropertyResult("placementConstraints", "PlacementConstraints", (properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionTaskDefinitionPlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined));
  ret.addPropertyResult("proxyConfiguration", "ProxyConfiguration", (properties.ProxyConfiguration != null ? CfnTaskDefinitionProxyConfigurationPropertyFromCloudFormation(properties.ProxyConfiguration) : undefined));
  ret.addPropertyResult("requiresCompatibilities", "RequiresCompatibilities", (properties.RequiresCompatibilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RequiresCompatibilities) : undefined));
  ret.addPropertyResult("runtimePlatform", "RuntimePlatform", (properties.RuntimePlatform != null ? CfnTaskDefinitionRuntimePlatformPropertyFromCloudFormation(properties.RuntimePlatform) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskRoleArn", "TaskRoleArn", (properties.TaskRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskRoleArn) : undefined));
  ret.addPropertyResult("volumes", "Volumes", (properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskDefinitionVolumePropertyFromCloudFormation)(properties.Volumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a task set in the specified cluster and service.
 *
 * This is used when a service uses the `EXTERNAL` deployment controller type. For more information, see [Amazon ECS deployment types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * You can create a maximum of 5 tasks sets for a deployment.
 *
 * @cloudformationResource AWS::ECS::TaskSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html
 */
export class CfnTaskSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECS::TaskSet";

  /**
   * Build a CfnTaskSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTaskSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTaskSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the task set.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service to create the task set in.
   */
  public cluster: string;

  /**
   * An optional non-unique tag that identifies this task set in external systems.
   */
  public externalId?: string;

  /**
   * The launch type that new tasks in the task set uses.
   */
  public launchType?: string;

  /**
   * A load balancer object representing the load balancer to use with the task set.
   */
  public loadBalancers?: Array<cdk.IResolvable | CfnTaskSet.LoadBalancerProperty> | cdk.IResolvable;

  /**
   * The network configuration for the task set.
   */
  public networkConfiguration?: cdk.IResolvable | CfnTaskSet.NetworkConfigurationProperty;

  /**
   * The platform version that the tasks in the task set uses.
   */
  public platformVersion?: string;

  /**
   * A floating-point percentage of your desired number of tasks to place and keep running in the task set.
   */
  public scale?: cdk.IResolvable | CfnTaskSet.ScaleProperty;

  /**
   * The short name or full Amazon Resource Name (ARN) of the service to create the task set in.
   */
  public service: string;

  /**
   * The details of the service discovery registries to assign to this task set.
   */
  public serviceRegistries?: Array<cdk.IResolvable | CfnTaskSet.ServiceRegistryProperty> | cdk.IResolvable;

  /**
   * The task definition for the tasks in the task set to use.
   */
  public taskDefinition: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTaskSetProps) {
    super(scope, id, {
      "type": CfnTaskSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "cluster", this);
    cdk.requireProperty(props, "service", this);
    cdk.requireProperty(props, "taskDefinition", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.cluster = props.cluster;
    this.externalId = props.externalId;
    this.launchType = props.launchType;
    this.loadBalancers = props.loadBalancers;
    this.networkConfiguration = props.networkConfiguration;
    this.platformVersion = props.platformVersion;
    this.scale = props.scale;
    this.service = props.service;
    this.serviceRegistries = props.serviceRegistries;
    this.taskDefinition = props.taskDefinition;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cluster": this.cluster,
      "externalId": this.externalId,
      "launchType": this.launchType,
      "loadBalancers": this.loadBalancers,
      "networkConfiguration": this.networkConfiguration,
      "platformVersion": this.platformVersion,
      "scale": this.scale,
      "service": this.service,
      "serviceRegistries": this.serviceRegistries,
      "taskDefinition": this.taskDefinition
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTaskSetPropsToCloudFormation(props);
  }
}

export namespace CfnTaskSet {
  /**
   * The load balancer configuration to use with a service or task set.
   *
   * When you add, update, or remove a load balancer configuration, Amazon ECS starts a new deployment with the updated Elastic Load Balancing configuration. This causes tasks to register to and deregister from load balancers.
   *
   * We recommend that you verify this on a test environment before you update the Elastic Load Balancing configuration.
   *
   * A service-linked role is required for services that use multiple target groups. For more information, see [Using service-linked roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using-service-linked-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-loadbalancer.html
   */
  export interface LoadBalancerProperty {
    /**
     * The name of the container (as it appears in a container definition) to associate with the load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-loadbalancer.html#cfn-ecs-taskset-loadbalancer-containername
     */
    readonly containerName?: string;

    /**
     * The port on the container to associate with the load balancer.
     *
     * This port must correspond to a `containerPort` in the task definition the tasks in the service are using. For tasks that use the EC2 launch type, the container instance they're launched on must allow ingress traffic on the `hostPort` of the port mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-loadbalancer.html#cfn-ecs-taskset-loadbalancer-containerport
     */
    readonly containerPort?: number;

    /**
     * The full Amazon Resource Name (ARN) of the Elastic Load Balancing target group or groups associated with a service or task set.
     *
     * A target group ARN is only specified when using an Application Load Balancer or Network Load Balancer.
     *
     * For services using the `ECS` deployment controller, you can specify one or multiple target groups. For more information, see [Registering multiple target groups with a service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/register-multiple-targetgroups.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * For services using the `CODE_DEPLOY` deployment controller, you're required to define two target groups for the load balancer. For more information, see [Blue/green deployment with CodeDeploy](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * > If your service's task definition uses the `awsvpc` network mode, you must choose `ip` as the target type, not `instance` . Do this when creating your target groups because tasks that use the `awsvpc` network mode are associated with an elastic network interface, not an Amazon EC2 instance. This network mode is required for the Fargate launch type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-loadbalancer.html#cfn-ecs-taskset-loadbalancer-targetgrouparn
     */
    readonly targetGroupArn?: string;
  }

  /**
   * The network configuration for a task or service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * The VPC subnets and security groups that are associated with a task.
     *
     * > All specified subnets and security groups must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-networkconfiguration.html#cfn-ecs-taskset-networkconfiguration-awsvpcconfiguration
     */
    readonly awsVpcConfiguration?: CfnTaskSet.AwsVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * An object representing the networking details for a task or service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-awsvpcconfiguration.html
   */
  export interface AwsVpcConfigurationProperty {
    /**
     * Whether the task's elastic network interface receives a public IP address.
     *
     * The default value is `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-awsvpcconfiguration.html#cfn-ecs-taskset-awsvpcconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;

    /**
     * The IDs of the security groups associated with the task or service.
     *
     * If you don't specify a security group, the default security group for the VPC is used. There's a limit of 5 security groups that can be specified per `AwsVpcConfiguration` .
     *
     * > All specified security groups must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-awsvpcconfiguration.html#cfn-ecs-taskset-awsvpcconfiguration-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * The IDs of the subnets associated with the task or service.
     *
     * There's a limit of 16 subnets that can be specified per `AwsVpcConfiguration` .
     *
     * > All specified subnets must be from the same VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-awsvpcconfiguration.html#cfn-ecs-taskset-awsvpcconfiguration-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * A floating-point percentage of the desired number of tasks to place and keep running in the task set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-scale.html
   */
  export interface ScaleProperty {
    /**
     * The unit of measure for the scale value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-scale.html#cfn-ecs-taskset-scale-unit
     */
    readonly unit?: string;

    /**
     * The value, specified as a percent total of a service's `desiredCount` , to scale the task set.
     *
     * Accepted values are numbers between 0 and 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-scale.html#cfn-ecs-taskset-scale-value
     */
    readonly value?: number;
  }

  /**
   * The details for the service registry.
   *
   * Each service may be associated with one service registry. Multiple service registries for each service are not supported.
   *
   * When you add, update, or remove the service registries configuration, Amazon ECS starts a new deployment. New tasks are registered and deregistered to the updated service registry configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-serviceregistry.html
   */
  export interface ServiceRegistryProperty {
    /**
     * The container name value to be used for your service discovery service.
     *
     * It's already specified in the task definition. If the task definition that your service task specifies uses the `bridge` or `host` network mode, you must specify a `containerName` and `containerPort` combination from the task definition. If the task definition that your service task specifies uses the `awsvpc` network mode and a type SRV DNS record is used, you must specify either a `containerName` and `containerPort` combination or a `port` value. However, you can't specify both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-serviceregistry.html#cfn-ecs-taskset-serviceregistry-containername
     */
    readonly containerName?: string;

    /**
     * The port value to be used for your service discovery service.
     *
     * It's already specified in the task definition. If the task definition your service task specifies uses the `bridge` or `host` network mode, you must specify a `containerName` and `containerPort` combination from the task definition. If the task definition your service task specifies uses the `awsvpc` network mode and a type SRV DNS record is used, you must specify either a `containerName` and `containerPort` combination or a `port` value. However, you can't specify both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-serviceregistry.html#cfn-ecs-taskset-serviceregistry-containerport
     */
    readonly containerPort?: number;

    /**
     * The port value used if your service discovery service specified an SRV record.
     *
     * This field might be used if both the `awsvpc` network mode and SRV records are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-serviceregistry.html#cfn-ecs-taskset-serviceregistry-port
     */
    readonly port?: number;

    /**
     * The Amazon Resource Name (ARN) of the service registry.
     *
     * The currently supported service registry is AWS Cloud Map . For more information, see [CreateService](https://docs.aws.amazon.com/cloud-map/latest/api/API_CreateService.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskset-serviceregistry.html#cfn-ecs-taskset-serviceregistry-registryarn
     */
    readonly registryArn?: string;
  }
}

/**
 * Properties for defining a `CfnTaskSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html
 */
export interface CfnTaskSetProps {
  /**
   * The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service to create the task set in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-cluster
   */
  readonly cluster: string;

  /**
   * An optional non-unique tag that identifies this task set in external systems.
   *
   * If the task set is associated with a service discovery registry, the tasks in this task set will have the `ECS_TASK_SET_EXTERNAL_ID` AWS Cloud Map attribute set to the provided value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-externalid
   */
  readonly externalId?: string;

  /**
   * The launch type that new tasks in the task set uses.
   *
   * For more information, see [Amazon ECS launch types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * If a `launchType` is specified, the `capacityProviderStrategy` parameter must be omitted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-launchtype
   */
  readonly launchType?: string;

  /**
   * A load balancer object representing the load balancer to use with the task set.
   *
   * The supported load balancer types are either an Application Load Balancer or a Network Load Balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-loadbalancers
   */
  readonly loadBalancers?: Array<cdk.IResolvable | CfnTaskSet.LoadBalancerProperty> | cdk.IResolvable;

  /**
   * The network configuration for the task set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnTaskSet.NetworkConfigurationProperty;

  /**
   * The platform version that the tasks in the task set uses.
   *
   * A platform version is specified only for tasks using the Fargate launch type. If one isn't specified, the `LATEST` platform version is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-platformversion
   */
  readonly platformVersion?: string;

  /**
   * A floating-point percentage of your desired number of tasks to place and keep running in the task set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-scale
   */
  readonly scale?: cdk.IResolvable | CfnTaskSet.ScaleProperty;

  /**
   * The short name or full Amazon Resource Name (ARN) of the service to create the task set in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-service
   */
  readonly service: string;

  /**
   * The details of the service discovery registries to assign to this task set.
   *
   * For more information, see [Service discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-serviceregistries
   */
  readonly serviceRegistries?: Array<cdk.IResolvable | CfnTaskSet.ServiceRegistryProperty> | cdk.IResolvable;

  /**
   * The task definition for the tasks in the task set to use.
   *
   * If a revision isn't specified, the latest `ACTIVE` revision is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskset.html#cfn-ecs-taskset-taskdefinition
   */
  readonly taskDefinition: string;
}

/**
 * Determine whether the given properties match those of a `LoadBalancerProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBalancerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetLoadBalancerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  return errors.wrap("supplied properties not correct for \"LoadBalancerProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetLoadBalancerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetLoadBalancerPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn)
  };
}

// @ts-ignore TS6133
function CfnTaskSetLoadBalancerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskSet.LoadBalancerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSet.LoadBalancerProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetAwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignPublicIp", cdk.validateString)(properties.assignPublicIp));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"AwsVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetAwsVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnTaskSetAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskSet.AwsVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSet.AwsVpcConfigurationProperty>();
  ret.addPropertyResult("assignPublicIp", "AssignPublicIp", (properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsVpcConfiguration", CfnTaskSetAwsVpcConfigurationPropertyValidator)(properties.awsVpcConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AwsVpcConfiguration": convertCfnTaskSetAwsVpcConfigurationPropertyToCloudFormation(properties.awsVpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnTaskSetNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskSet.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSet.NetworkConfigurationProperty>();
  ret.addPropertyResult("awsVpcConfiguration", "AwsVpcConfiguration", (properties.AwsVpcConfiguration != null ? CfnTaskSetAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsVpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScaleProperty`
 *
 * @param properties - the TypeScript properties of a `ScaleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetScalePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"ScaleProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetScalePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetScalePropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskSetScalePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskSet.ScaleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSet.ScaleProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceRegistryProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceRegistryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetServiceRegistryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("registryArn", cdk.validateString)(properties.registryArn));
  return errors.wrap("supplied properties not correct for \"ServiceRegistryProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetServiceRegistryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetServiceRegistryPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "Port": cdk.numberToCloudFormation(properties.port),
    "RegistryArn": cdk.stringToCloudFormation(properties.registryArn)
  };
}

// @ts-ignore TS6133
function CfnTaskSetServiceRegistryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskSet.ServiceRegistryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSet.ServiceRegistryProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("registryArn", "RegistryArn", (properties.RegistryArn != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTaskSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cluster", cdk.requiredValidator)(properties.cluster));
  errors.collect(cdk.propertyValidator("cluster", cdk.validateString)(properties.cluster));
  errors.collect(cdk.propertyValidator("externalId", cdk.validateString)(properties.externalId));
  errors.collect(cdk.propertyValidator("launchType", cdk.validateString)(properties.launchType));
  errors.collect(cdk.propertyValidator("loadBalancers", cdk.listValidator(CfnTaskSetLoadBalancerPropertyValidator))(properties.loadBalancers));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnTaskSetNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  errors.collect(cdk.propertyValidator("scale", CfnTaskSetScalePropertyValidator)(properties.scale));
  errors.collect(cdk.propertyValidator("service", cdk.requiredValidator)(properties.service));
  errors.collect(cdk.propertyValidator("service", cdk.validateString)(properties.service));
  errors.collect(cdk.propertyValidator("serviceRegistries", cdk.listValidator(CfnTaskSetServiceRegistryPropertyValidator))(properties.serviceRegistries));
  errors.collect(cdk.propertyValidator("taskDefinition", cdk.requiredValidator)(properties.taskDefinition));
  errors.collect(cdk.propertyValidator("taskDefinition", cdk.validateString)(properties.taskDefinition));
  return errors.wrap("supplied properties not correct for \"CfnTaskSetProps\"");
}

// @ts-ignore TS6133
function convertCfnTaskSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSetPropsValidator(properties).assertSuccess();
  return {
    "Cluster": cdk.stringToCloudFormation(properties.cluster),
    "ExternalId": cdk.stringToCloudFormation(properties.externalId),
    "LaunchType": cdk.stringToCloudFormation(properties.launchType),
    "LoadBalancers": cdk.listMapper(convertCfnTaskSetLoadBalancerPropertyToCloudFormation)(properties.loadBalancers),
    "NetworkConfiguration": convertCfnTaskSetNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion),
    "Scale": convertCfnTaskSetScalePropertyToCloudFormation(properties.scale),
    "Service": cdk.stringToCloudFormation(properties.service),
    "ServiceRegistries": cdk.listMapper(convertCfnTaskSetServiceRegistryPropertyToCloudFormation)(properties.serviceRegistries),
    "TaskDefinition": cdk.stringToCloudFormation(properties.taskDefinition)
  };
}

// @ts-ignore TS6133
function CfnTaskSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskSetProps>();
  ret.addPropertyResult("cluster", "Cluster", (properties.Cluster != null ? cfn_parse.FromCloudFormation.getString(properties.Cluster) : undefined));
  ret.addPropertyResult("externalId", "ExternalId", (properties.ExternalId != null ? cfn_parse.FromCloudFormation.getString(properties.ExternalId) : undefined));
  ret.addPropertyResult("launchType", "LaunchType", (properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined));
  ret.addPropertyResult("loadBalancers", "LoadBalancers", (properties.LoadBalancers != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskSetLoadBalancerPropertyFromCloudFormation)(properties.LoadBalancers) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnTaskSetNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addPropertyResult("scale", "Scale", (properties.Scale != null ? CfnTaskSetScalePropertyFromCloudFormation(properties.Scale) : undefined));
  ret.addPropertyResult("service", "Service", (properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined));
  ret.addPropertyResult("serviceRegistries", "ServiceRegistries", (properties.ServiceRegistries != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskSetServiceRegistryPropertyFromCloudFormation)(properties.ServiceRegistries) : undefined));
  ret.addPropertyResult("taskDefinition", "TaskDefinition", (properties.TaskDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}