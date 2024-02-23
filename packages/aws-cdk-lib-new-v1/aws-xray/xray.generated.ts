/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Use the `AWS::XRay::Group` resource to specify a group with a name and a filter expression.
 *
 * Groups enable the collection of traces that match the filter expression, can be used to filter service graphs and traces, and to supply Amazon CloudWatch metrics.
 *
 * @cloudformationResource AWS::XRay::Group
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::XRay::Group";

  /**
   * Build a CfnGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The group ARN that was created or updated.
   *
   * @cloudformationAttribute GroupARN
   */
  public readonly attrGroupArn: string;

  /**
   * The filter expression defining the parameters to include traces.
   */
  public filterExpression?: string;

  /**
   * The unique case-sensitive name of the group.
   */
  public groupName: string;

  /**
   * The structure containing configurations related to insights.
   */
  public insightsConfiguration?: CfnGroup.InsightsConfigurationProperty | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<any>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupProps) {
    super(scope, id, {
      "type": CfnGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupName", this);

    this.attrGroupArn = cdk.Token.asString(this.getAtt("GroupARN", cdk.ResolutionTypeHint.STRING));
    this.filterExpression = props.filterExpression;
    this.groupName = props.groupName;
    this.insightsConfiguration = props.insightsConfiguration;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "filterExpression": this.filterExpression,
      "groupName": this.groupName,
      "insightsConfiguration": this.insightsConfiguration,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupPropsToCloudFormation(props);
  }
}

export namespace CfnGroup {
  /**
   * The structure containing configurations related to insights.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html
   */
  export interface InsightsConfigurationProperty {
    /**
     * Set the InsightsEnabled value to true to enable insights or false to disable insights.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html#cfn-xray-group-insightsconfiguration-insightsenabled
     */
    readonly insightsEnabled?: boolean | cdk.IResolvable;

    /**
     * Set the NotificationsEnabled value to true to enable insights notifications.
     *
     * Notifications can only be enabled on a group with InsightsEnabled set to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html#cfn-xray-group-insightsconfiguration-notificationsenabled
     */
    readonly notificationsEnabled?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html
 */
export interface CfnGroupProps {
  /**
   * The filter expression defining the parameters to include traces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-filterexpression
   */
  readonly filterExpression?: string;

  /**
   * The unique case-sensitive name of the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-groupname
   */
  readonly groupName: string;

  /**
   * The structure containing configurations related to insights.
   *
   * - The InsightsEnabled boolean can be set to true to enable insights for the group or false to disable insights for the group.
   * - The NotificationsEnabled boolean can be set to true to enable insights notifications through Amazon EventBridge for the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-insightsconfiguration
   */
  readonly insightsConfiguration?: CfnGroup.InsightsConfigurationProperty | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-tags
   */
  readonly tags?: Array<any>;
}

/**
 * Determine whether the given properties match those of a `InsightsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InsightsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupInsightsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("insightsEnabled", cdk.validateBoolean)(properties.insightsEnabled));
  errors.collect(cdk.propertyValidator("notificationsEnabled", cdk.validateBoolean)(properties.notificationsEnabled));
  return errors.wrap("supplied properties not correct for \"InsightsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGroupInsightsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupInsightsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InsightsEnabled": cdk.booleanToCloudFormation(properties.insightsEnabled),
    "NotificationsEnabled": cdk.booleanToCloudFormation(properties.notificationsEnabled)
  };
}

// @ts-ignore TS6133
function CfnGroupInsightsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroup.InsightsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroup.InsightsConfigurationProperty>();
  ret.addPropertyResult("insightsEnabled", "InsightsEnabled", (properties.InsightsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InsightsEnabled) : undefined));
  ret.addPropertyResult("notificationsEnabled", "NotificationsEnabled", (properties.NotificationsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotificationsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterExpression", cdk.validateString)(properties.filterExpression));
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("insightsConfiguration", CfnGroupInsightsConfigurationPropertyValidator)(properties.insightsConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateObject))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPropsValidator(properties).assertSuccess();
  return {
    "FilterExpression": cdk.stringToCloudFormation(properties.filterExpression),
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "InsightsConfiguration": convertCfnGroupInsightsConfigurationPropertyToCloudFormation(properties.insightsConfiguration),
    "Tags": cdk.listMapper(cdk.objectToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
  ret.addPropertyResult("filterExpression", "FilterExpression", (properties.FilterExpression != null ? cfn_parse.FromCloudFormation.getString(properties.FilterExpression) : undefined));
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("insightsConfiguration", "InsightsConfiguration", (properties.InsightsConfiguration != null ? CfnGroupInsightsConfigurationPropertyFromCloudFormation(properties.InsightsConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use `AWS::XRay::ResourcePolicy` to specify an X-Ray resource-based policy, which grants one or more AWS services and accounts permissions to access X-Ray .
 *
 * Each resource-based policy is associated with a specific AWS account.
 *
 * @cloudformationResource AWS::XRay::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::XRay::ResourcePolicy";

  /**
   * Build a CfnResourcePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourcePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A flag to indicate whether to bypass the resource-based policy lockout safety check.
   */
  public bypassPolicyLockoutCheck?: boolean | cdk.IResolvable;

  /**
   * The resource-based policy document, which can be up to 5kb in size.
   */
  public policyDocument: string;

  /**
   * The name of the resource-based policy.
   */
  public policyName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
    super(scope, id, {
      "type": CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "policyName", this);

    this.bypassPolicyLockoutCheck = props.bypassPolicyLockoutCheck;
    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bypassPolicyLockoutCheck": this.bypassPolicyLockoutCheck,
      "policyDocument": this.policyDocument,
      "policyName": this.policyName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * A flag to indicate whether to bypass the resource-based policy lockout safety check.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-bypasspolicylockoutcheck
   */
  readonly bypassPolicyLockoutCheck?: boolean | cdk.IResolvable;

  /**
   * The resource-based policy document, which can be up to 5kb in size.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policydocument
   */
  readonly policyDocument: string;

  /**
   * The name of the resource-based policy.
   *
   * Must be unique within a specific AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policyname
   */
  readonly policyName: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bypassPolicyLockoutCheck", cdk.validateBoolean)(properties.bypassPolicyLockoutCheck));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateString)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "BypassPolicyLockoutCheck": cdk.booleanToCloudFormation(properties.bypassPolicyLockoutCheck),
    "PolicyDocument": cdk.stringToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
  ret.addPropertyResult("bypassPolicyLockoutCheck", "BypassPolicyLockoutCheck", (properties.BypassPolicyLockoutCheck != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BypassPolicyLockoutCheck) : undefined));
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::XRay::SamplingRule` resource to specify a sampling rule, which controls sampling behavior for instrumented applications.
 *
 * Include a `SamplingRule` entity to create or update a sampling rule.
 *
 * > `SamplingRule.Version` can only be set when creating a sampling rule. Updating the version will cause the update to fail.
 *
 * Services retrieve rules with [GetSamplingRules](https://docs.aws.amazon.com//xray/latest/api/API_GetSamplingRules.html) , and evaluate each rule in ascending order of *priority* for each request. If a rule matches, the service records a trace, borrowing it from the reservoir size. After 10 seconds, the service reports back to X-Ray with [GetSamplingTargets](https://docs.aws.amazon.com//xray/latest/api/API_GetSamplingTargets.html) to get updated versions of each in-use rule. The updated rule contains a trace quota that the service can use instead of borrowing from the reservoir.
 *
 * @cloudformationResource AWS::XRay::SamplingRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html
 */
export class CfnSamplingRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::XRay::SamplingRule";

  /**
   * Build a CfnSamplingRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSamplingRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSamplingRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSamplingRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The sampling rule ARN that was created or updated.
   *
   * @cloudformationAttribute RuleARN
   */
  public readonly attrRuleArn: string;

  /**
   * The ARN of the sampling rule.
   *
   * @deprecated this property has been deprecated
   */
  public ruleName?: string;

  /**
   * The sampling rule to be created or updated.
   */
  public samplingRule?: cdk.IResolvable | CfnSamplingRule.SamplingRuleProperty;

  /**
   * @deprecated this property has been deprecated
   */
  public samplingRuleRecord?: cdk.IResolvable | CfnSamplingRule.SamplingRuleRecordProperty;

  /**
   * @deprecated this property has been deprecated
   */
  public samplingRuleUpdate?: cdk.IResolvable | CfnSamplingRule.SamplingRuleUpdateProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<any>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSamplingRuleProps = {}) {
    super(scope, id, {
      "type": CfnSamplingRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRuleArn = cdk.Token.asString(this.getAtt("RuleARN", cdk.ResolutionTypeHint.STRING));
    this.ruleName = props.ruleName;
    this.samplingRule = props.samplingRule;
    this.samplingRuleRecord = props.samplingRuleRecord;
    this.samplingRuleUpdate = props.samplingRuleUpdate;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ruleName": this.ruleName,
      "samplingRule": this.samplingRule,
      "samplingRuleRecord": this.samplingRuleRecord,
      "samplingRuleUpdate": this.samplingRuleUpdate,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSamplingRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSamplingRulePropsToCloudFormation(props);
  }
}

export namespace CfnSamplingRule {
  /**
   * A sampling rule that services use to decide whether to instrument a request.
   *
   * Rule fields can match properties of the service, or properties of a request. The service can ignore rules that don't match its properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html
   */
  export interface SamplingRuleProperty {
    /**
     * Matches attributes derived from the request.
     *
     * *Map Entries:* Maximum number of 5 items.
     *
     * *Key Length Constraints:* Minimum length of 1. Maximum length of 32.
     *
     * *Value Length Constraints:* Minimum length of 1. Maximum length of 32.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-attributes
     */
    readonly attributes?: cdk.IResolvable | Record<string, string>;

    /**
     * The percentage of matching requests to instrument, after the reservoir is exhausted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-fixedrate
     */
    readonly fixedRate: number;

    /**
     * Matches the hostname from a request URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-host
     */
    readonly host: string;

    /**
     * Matches the HTTP method of a request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-httpmethod
     */
    readonly httpMethod: string;

    /**
     * The priority of the sampling rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-priority
     */
    readonly priority: number;

    /**
     * A fixed number of matching requests to instrument per second, prior to applying the fixed rate.
     *
     * The reservoir is not used directly by services, but applies to all services using the rule collectively.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-reservoirsize
     */
    readonly reservoirSize: number;

    /**
     * Matches the ARN of the AWS resource on which the service runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-resourcearn
     */
    readonly resourceArn: string;

    /**
     * The ARN of the sampling rule. Specify a rule by either name or ARN, but not both.
     *
     * > Specifying a sampling rule by name is recommended, as specifying by ARN will be deprecated in future.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-rulearn
     */
    readonly ruleArn?: string;

    /**
     * The name of the sampling rule.
     *
     * Specify a rule by either name or ARN, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-rulename
     */
    readonly ruleName?: string;

    /**
     * Matches the `name` that the service uses to identify itself in segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-servicename
     */
    readonly serviceName: string;

    /**
     * Matches the `origin` that the service uses to identify its type in segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-servicetype
     */
    readonly serviceType: string;

    /**
     * Matches the path from a request URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-urlpath
     */
    readonly urlPath: string;

    /**
     * The version of the sampling rule.
     *
     * `Version` can only be set when creating a new sampling rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-version
     */
    readonly version?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html
   */
  export interface SamplingRuleRecordProperty {
    /**
     * When the rule was created, in Unix time seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-createdat
     */
    readonly createdAt?: string;

    /**
     * When the rule was modified, in Unix time seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-modifiedat
     */
    readonly modifiedAt?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-samplingrule
     */
    readonly samplingRule?: cdk.IResolvable | CfnSamplingRule.SamplingRuleProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html
   */
  export interface SamplingRuleUpdateProperty {
    /**
     * Matches attributes derived from the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-attributes
     */
    readonly attributes?: cdk.IResolvable | Record<string, string>;

    /**
     * The percentage of matching requests to instrument, after the reservoir is exhausted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-fixedrate
     */
    readonly fixedRate?: number;

    /**
     * Matches the hostname from a request URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-host
     */
    readonly host?: string;

    /**
     * Matches the HTTP method from a request URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-httpmethod
     */
    readonly httpMethod?: string;

    /**
     * The priority of the sampling rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-priority
     */
    readonly priority?: number;

    /**
     * A fixed number of matching requests to instrument per second, prior to applying the fixed rate.
     *
     * The reservoir is not used directly by services, but applies to all services using the rule collectively.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-reservoirsize
     */
    readonly reservoirSize?: number;

    /**
     * Matches the ARN of the AWS resource on which the service runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-resourcearn
     */
    readonly resourceArn?: string;

    /**
     * The ARN of the sampling rule.
     *
     * Specify a rule by either name or ARN, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-rulearn
     */
    readonly ruleArn?: string;

    /**
     * The ARN of the sampling rule.
     *
     * Specify a rule by either name or ARN, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-rulename
     */
    readonly ruleName?: string;

    /**
     * Matches the name that the service uses to identify itself in segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-servicename
     */
    readonly serviceName?: string;

    /**
     * Matches the origin that the service uses to identify its type in segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-servicetype
     */
    readonly serviceType?: string;

    /**
     * Matches the path from a request URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-urlpath
     */
    readonly urlPath?: string;
  }
}

/**
 * Properties for defining a `CfnSamplingRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html
 */
export interface CfnSamplingRuleProps {
  /**
   * The ARN of the sampling rule.
   *
   * Specify a rule by either name or ARN, but not both.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-rulename
   */
  readonly ruleName?: string;

  /**
   * The sampling rule to be created or updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrule
   */
  readonly samplingRule?: cdk.IResolvable | CfnSamplingRule.SamplingRuleProperty;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrulerecord
   */
  readonly samplingRuleRecord?: cdk.IResolvable | CfnSamplingRule.SamplingRuleRecordProperty;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingruleupdate
   */
  readonly samplingRuleUpdate?: cdk.IResolvable | CfnSamplingRule.SamplingRuleUpdateProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-tags
   */
  readonly tags?: Array<any>;
}

/**
 * Determine whether the given properties match those of a `SamplingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSamplingRuleSamplingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("fixedRate", cdk.requiredValidator)(properties.fixedRate));
  errors.collect(cdk.propertyValidator("fixedRate", cdk.validateNumber)(properties.fixedRate));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.requiredValidator)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("host", cdk.requiredValidator)(properties.host));
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("reservoirSize", cdk.requiredValidator)(properties.reservoirSize));
  errors.collect(cdk.propertyValidator("reservoirSize", cdk.validateNumber)(properties.reservoirSize));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("ruleArn", cdk.validateString)(properties.ruleArn));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.requiredValidator)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceType", cdk.requiredValidator)(properties.serviceType));
  errors.collect(cdk.propertyValidator("serviceType", cdk.validateString)(properties.serviceType));
  errors.collect(cdk.propertyValidator("urlPath", cdk.requiredValidator)(properties.urlPath));
  errors.collect(cdk.propertyValidator("urlPath", cdk.validateString)(properties.urlPath));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"SamplingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnSamplingRuleSamplingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSamplingRuleSamplingRulePropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "FixedRate": cdk.numberToCloudFormation(properties.fixedRate),
    "HTTPMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "Host": cdk.stringToCloudFormation(properties.host),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ReservoirSize": cdk.numberToCloudFormation(properties.reservoirSize),
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RuleARN": cdk.stringToCloudFormation(properties.ruleArn),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "ServiceType": cdk.stringToCloudFormation(properties.serviceType),
    "URLPath": cdk.stringToCloudFormation(properties.urlPath),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSamplingRule.SamplingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("fixedRate", "FixedRate", (properties.FixedRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.FixedRate) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("httpMethod", "HTTPMethod", (properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HTTPMethod) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("reservoirSize", "ReservoirSize", (properties.ReservoirSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservoirSize) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("ruleArn", "RuleARN", (properties.RuleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RuleARN) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("serviceType", "ServiceType", (properties.ServiceType != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceType) : undefined));
  ret.addPropertyResult("urlPath", "URLPath", (properties.URLPath != null ? cfn_parse.FromCloudFormation.getString(properties.URLPath) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SamplingRuleRecordProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleRecordProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleRecordPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createdAt", cdk.validateString)(properties.createdAt));
  errors.collect(cdk.propertyValidator("modifiedAt", cdk.validateString)(properties.modifiedAt));
  errors.collect(cdk.propertyValidator("samplingRule", CfnSamplingRuleSamplingRulePropertyValidator)(properties.samplingRule));
  return errors.wrap("supplied properties not correct for \"SamplingRuleRecordProperty\"");
}

// @ts-ignore TS6133
function convertCfnSamplingRuleSamplingRuleRecordPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSamplingRuleSamplingRuleRecordPropertyValidator(properties).assertSuccess();
  return {
    "CreatedAt": cdk.stringToCloudFormation(properties.createdAt),
    "ModifiedAt": cdk.stringToCloudFormation(properties.modifiedAt),
    "SamplingRule": convertCfnSamplingRuleSamplingRulePropertyToCloudFormation(properties.samplingRule)
  };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleRecordPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSamplingRule.SamplingRuleRecordProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleRecordProperty>();
  ret.addPropertyResult("createdAt", "CreatedAt", (properties.CreatedAt != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedAt) : undefined));
  ret.addPropertyResult("modifiedAt", "ModifiedAt", (properties.ModifiedAt != null ? cfn_parse.FromCloudFormation.getString(properties.ModifiedAt) : undefined));
  ret.addPropertyResult("samplingRule", "SamplingRule", (properties.SamplingRule != null ? CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties.SamplingRule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SamplingRuleUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("fixedRate", cdk.validateNumber)(properties.fixedRate));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("reservoirSize", cdk.validateNumber)(properties.reservoirSize));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("ruleArn", cdk.validateString)(properties.ruleArn));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceType", cdk.validateString)(properties.serviceType));
  errors.collect(cdk.propertyValidator("urlPath", cdk.validateString)(properties.urlPath));
  return errors.wrap("supplied properties not correct for \"SamplingRuleUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnSamplingRuleSamplingRuleUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSamplingRuleSamplingRuleUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "FixedRate": cdk.numberToCloudFormation(properties.fixedRate),
    "HTTPMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "Host": cdk.stringToCloudFormation(properties.host),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ReservoirSize": cdk.numberToCloudFormation(properties.reservoirSize),
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RuleARN": cdk.stringToCloudFormation(properties.ruleArn),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "ServiceType": cdk.stringToCloudFormation(properties.serviceType),
    "URLPath": cdk.stringToCloudFormation(properties.urlPath)
  };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSamplingRule.SamplingRuleUpdateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleUpdateProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("fixedRate", "FixedRate", (properties.FixedRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.FixedRate) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("httpMethod", "HTTPMethod", (properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HTTPMethod) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("reservoirSize", "ReservoirSize", (properties.ReservoirSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservoirSize) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("ruleArn", "RuleARN", (properties.RuleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RuleARN) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("serviceType", "ServiceType", (properties.ServiceType != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceType) : undefined));
  ret.addPropertyResult("urlPath", "URLPath", (properties.URLPath != null ? cfn_parse.FromCloudFormation.getString(properties.URLPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSamplingRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnSamplingRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSamplingRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("samplingRule", CfnSamplingRuleSamplingRulePropertyValidator)(properties.samplingRule));
  errors.collect(cdk.propertyValidator("samplingRuleRecord", CfnSamplingRuleSamplingRuleRecordPropertyValidator)(properties.samplingRuleRecord));
  errors.collect(cdk.propertyValidator("samplingRuleUpdate", CfnSamplingRuleSamplingRuleUpdatePropertyValidator)(properties.samplingRuleUpdate));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateObject))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSamplingRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnSamplingRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSamplingRulePropsValidator(properties).assertSuccess();
  return {
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "SamplingRule": convertCfnSamplingRuleSamplingRulePropertyToCloudFormation(properties.samplingRule),
    "SamplingRuleRecord": convertCfnSamplingRuleSamplingRuleRecordPropertyToCloudFormation(properties.samplingRuleRecord),
    "SamplingRuleUpdate": convertCfnSamplingRuleSamplingRuleUpdatePropertyToCloudFormation(properties.samplingRuleUpdate),
    "Tags": cdk.listMapper(cdk.objectToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSamplingRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRuleProps>();
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("samplingRule", "SamplingRule", (properties.SamplingRule != null ? CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties.SamplingRule) : undefined));
  ret.addPropertyResult("samplingRuleRecord", "SamplingRuleRecord", (properties.SamplingRuleRecord != null ? CfnSamplingRuleSamplingRuleRecordPropertyFromCloudFormation(properties.SamplingRuleRecord) : undefined));
  ret.addPropertyResult("samplingRuleUpdate", "SamplingRuleUpdate", (properties.SamplingRuleUpdate != null ? CfnSamplingRuleSamplingRuleUpdatePropertyFromCloudFormation(properties.SamplingRuleUpdate) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}