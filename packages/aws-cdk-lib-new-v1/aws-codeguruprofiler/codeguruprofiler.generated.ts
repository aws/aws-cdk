/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a profiling group.
 *
 * @cloudformationResource AWS::CodeGuruProfiler::ProfilingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html
 */
export class CfnProfilingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeGuruProfiler::ProfilingGroup";

  /**
   * Build a CfnProfilingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfilingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProfilingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProfilingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The full Amazon Resource Name (ARN) for that profiling group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The agent permissions attached to this profiling group.
   */
  public agentPermissions?: any | cdk.IResolvable;

  /**
   * Adds anomaly notifications for a profiling group.
   */
  public anomalyDetectionNotificationConfiguration?: Array<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The compute platform of the profiling group.
   */
  public computePlatform?: string;

  /**
   * The name of the profiling group.
   */
  public profilingGroupName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to add to the created profiling group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProfilingGroupProps) {
    super(scope, id, {
      "type": CfnProfilingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "profilingGroupName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.agentPermissions = props.agentPermissions;
    this.anomalyDetectionNotificationConfiguration = props.anomalyDetectionNotificationConfiguration;
    this.computePlatform = props.computePlatform;
    this.profilingGroupName = props.profilingGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeGuruProfiler::ProfilingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentPermissions": this.agentPermissions,
      "anomalyDetectionNotificationConfiguration": this.anomalyDetectionNotificationConfiguration,
      "computePlatform": this.computePlatform,
      "profilingGroupName": this.profilingGroupName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfilingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProfilingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnProfilingGroup {
  /**
   * Notification medium for users to get alerted for events that occur in application profile.
   *
   * We support SNS topic as a notification channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html
   */
  export interface ChannelProperty {
    /**
     * The channel ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html#cfn-codeguruprofiler-profilinggroup-channel-channelid
     */
    readonly channelId?: string;

    /**
     * The channel URI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html#cfn-codeguruprofiler-profilinggroup-channel-channeluri
     */
    readonly channelUri: string;
  }

  /**
   * The agent permissions attached to this profiling group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-agentpermissions.html
   */
  export interface AgentPermissionsProperty {
    /**
     * The principals for the agent permissions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-agentpermissions.html#cfn-codeguruprofiler-profilinggroup-agentpermissions-principals
     */
    readonly principals: Array<string>;
  }
}

/**
 * Properties for defining a `CfnProfilingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html
 */
export interface CfnProfilingGroupProps {
  /**
   * The agent permissions attached to this profiling group.
   *
   * This action group grants `ConfigureAgent` and `PostAgentProfile` permissions to perform actions required by the profiling agent. The Json consists of key `Principals` .
   *
   * *Principals* : A list of string ARNs for the roles and users you want to grant access to the profiling group. Wildcards are not supported in the ARNs. You are allowed to provide up to 50 ARNs. An empty list is not permitted. This is a required key.
   *
   * For more information, see [Resource-based policies in CodeGuru Profiler](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/resource-based-policies.html) in the *Amazon CodeGuru Profiler user guide* , [ConfigureAgent](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ConfigureAgent.html) , and [PostAgentProfile](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_PostAgentProfile.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-agentpermissions
   */
  readonly agentPermissions?: any | cdk.IResolvable;

  /**
   * Adds anomaly notifications for a profiling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-anomalydetectionnotificationconfiguration
   */
  readonly anomalyDetectionNotificationConfiguration?: Array<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The compute platform of the profiling group.
   *
   * Use `AWSLambda` if your application runs on AWS Lambda. Use `Default` if your application runs on a compute platform that is not AWS Lambda , such an Amazon EC2 instance, an on-premises server, or a different platform. If not specified, `Default` is used. This property is immutable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-computeplatform
   */
  readonly computePlatform?: string;

  /**
   * The name of the profiling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-profilinggroupname
   */
  readonly profilingGroupName: string;

  /**
   * A list of tags to add to the created profiling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilingGroupChannelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelId", cdk.validateString)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelUri", cdk.requiredValidator)(properties.channelUri));
  errors.collect(cdk.propertyValidator("channelUri", cdk.validateString)(properties.channelUri));
  return errors.wrap("supplied properties not correct for \"ChannelProperty\"");
}

// @ts-ignore TS6133
function convertCfnProfilingGroupChannelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilingGroupChannelPropertyValidator(properties).assertSuccess();
  return {
    "channelId": cdk.stringToCloudFormation(properties.channelId),
    "channelUri": cdk.stringToCloudFormation(properties.channelUri)
  };
}

// @ts-ignore TS6133
function CfnProfilingGroupChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroup.ChannelProperty>();
  ret.addPropertyResult("channelId", "channelId", (properties.channelId != null ? cfn_parse.FromCloudFormation.getString(properties.channelId) : undefined));
  ret.addPropertyResult("channelUri", "channelUri", (properties.channelUri != null ? cfn_parse.FromCloudFormation.getString(properties.channelUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AgentPermissionsProperty`
 *
 * @param properties - the TypeScript properties of a `AgentPermissionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilingGroupAgentPermissionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("principals", cdk.requiredValidator)(properties.principals));
  errors.collect(cdk.propertyValidator("principals", cdk.listValidator(cdk.validateString))(properties.principals));
  return errors.wrap("supplied properties not correct for \"AgentPermissionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnProfilingGroupAgentPermissionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilingGroupAgentPermissionsPropertyValidator(properties).assertSuccess();
  return {
    "Principals": cdk.listMapper(cdk.stringToCloudFormation)(properties.principals)
  };
}

// @ts-ignore TS6133
function CfnProfilingGroupAgentPermissionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroup.AgentPermissionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroup.AgentPermissionsProperty>();
  ret.addPropertyResult("principals", "Principals", (properties.Principals != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Principals) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProfilingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfilingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentPermissions", cdk.validateObject)(properties.agentPermissions));
  errors.collect(cdk.propertyValidator("anomalyDetectionNotificationConfiguration", cdk.listValidator(CfnProfilingGroupChannelPropertyValidator))(properties.anomalyDetectionNotificationConfiguration));
  errors.collect(cdk.propertyValidator("computePlatform", cdk.validateString)(properties.computePlatform));
  errors.collect(cdk.propertyValidator("profilingGroupName", cdk.requiredValidator)(properties.profilingGroupName));
  errors.collect(cdk.propertyValidator("profilingGroupName", cdk.validateString)(properties.profilingGroupName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProfilingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnProfilingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilingGroupPropsValidator(properties).assertSuccess();
  return {
    "AgentPermissions": cdk.objectToCloudFormation(properties.agentPermissions),
    "AnomalyDetectionNotificationConfiguration": cdk.listMapper(convertCfnProfilingGroupChannelPropertyToCloudFormation)(properties.anomalyDetectionNotificationConfiguration),
    "ComputePlatform": cdk.stringToCloudFormation(properties.computePlatform),
    "ProfilingGroupName": cdk.stringToCloudFormation(properties.profilingGroupName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProfilingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroupProps>();
  ret.addPropertyResult("agentPermissions", "AgentPermissions", (properties.AgentPermissions != null ? cfn_parse.FromCloudFormation.getAny(properties.AgentPermissions) : undefined));
  ret.addPropertyResult("anomalyDetectionNotificationConfiguration", "AnomalyDetectionNotificationConfiguration", (properties.AnomalyDetectionNotificationConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnProfilingGroupChannelPropertyFromCloudFormation)(properties.AnomalyDetectionNotificationConfiguration) : undefined));
  ret.addPropertyResult("computePlatform", "ComputePlatform", (properties.ComputePlatform != null ? cfn_parse.FromCloudFormation.getString(properties.ComputePlatform) : undefined));
  ret.addPropertyResult("profilingGroupName", "ProfilingGroupName", (properties.ProfilingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ProfilingGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}