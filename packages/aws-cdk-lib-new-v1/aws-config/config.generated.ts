/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * An object that represents the authorizations granted to aggregator accounts and regions.
 *
 * @cloudformationResource AWS::Config::AggregationAuthorization
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html
 */
export class CfnAggregationAuthorization extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::AggregationAuthorization";

  /**
   * Build a CfnAggregationAuthorization from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAggregationAuthorization {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAggregationAuthorizationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAggregationAuthorization(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the aggregation object.
   *
   * @cloudformationAttribute AggregationAuthorizationArn
   */
  public readonly attrAggregationAuthorizationArn: string;

  /**
   * The 12-digit account ID of the account authorized to aggregate data.
   */
  public authorizedAccountId: string;

  /**
   * The region authorized to collect aggregated data.
   */
  public authorizedAwsRegion: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of tag object.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAggregationAuthorizationProps) {
    super(scope, id, {
      "type": CfnAggregationAuthorization.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authorizedAccountId", this);
    cdk.requireProperty(props, "authorizedAwsRegion", this);

    this.attrAggregationAuthorizationArn = cdk.Token.asString(this.getAtt("AggregationAuthorizationArn", cdk.ResolutionTypeHint.STRING));
    this.authorizedAccountId = props.authorizedAccountId;
    this.authorizedAwsRegion = props.authorizedAwsRegion;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::AggregationAuthorization", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorizedAccountId": this.authorizedAccountId,
      "authorizedAwsRegion": this.authorizedAwsRegion,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAggregationAuthorization.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAggregationAuthorizationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAggregationAuthorization`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html
 */
export interface CfnAggregationAuthorizationProps {
  /**
   * The 12-digit account ID of the account authorized to aggregate data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedaccountid
   */
  readonly authorizedAccountId: string;

  /**
   * The region authorized to collect aggregated data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedawsregion
   */
  readonly authorizedAwsRegion: string;

  /**
   * An array of tag object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAggregationAuthorizationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAggregationAuthorizationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAggregationAuthorizationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizedAccountId", cdk.requiredValidator)(properties.authorizedAccountId));
  errors.collect(cdk.propertyValidator("authorizedAccountId", cdk.validateString)(properties.authorizedAccountId));
  errors.collect(cdk.propertyValidator("authorizedAwsRegion", cdk.requiredValidator)(properties.authorizedAwsRegion));
  errors.collect(cdk.propertyValidator("authorizedAwsRegion", cdk.validateString)(properties.authorizedAwsRegion));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAggregationAuthorizationProps\"");
}

// @ts-ignore TS6133
function convertCfnAggregationAuthorizationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAggregationAuthorizationPropsValidator(properties).assertSuccess();
  return {
    "AuthorizedAccountId": cdk.stringToCloudFormation(properties.authorizedAccountId),
    "AuthorizedAwsRegion": cdk.stringToCloudFormation(properties.authorizedAwsRegion),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAggregationAuthorizationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAggregationAuthorizationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAggregationAuthorizationProps>();
  ret.addPropertyResult("authorizedAccountId", "AuthorizedAccountId", (properties.AuthorizedAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizedAccountId) : undefined));
  ret.addPropertyResult("authorizedAwsRegion", "AuthorizedAwsRegion", (properties.AuthorizedAwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizedAwsRegion) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > You must first create and start the AWS Config configuration recorder in order to create AWS Config managed rules with AWS CloudFormation .
 *
 * For more information, see [Managing the Configuration Recorder](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html) .
 *
 * Adds or updates an AWS Config rule to evaluate if your AWS resources comply with your desired configurations. For information on how many AWS Config rules you can have per account, see [*Service Limits*](https://docs.aws.amazon.com/config/latest/developerguide/configlimits.html) in the *AWS Config Developer Guide* .
 *
 * There are two types of rules: *AWS Config Managed Rules* and *AWS Config Custom Rules* . You can use the `ConfigRule` resource to create both AWS Config Managed Rules and AWS Config Custom Rules.
 *
 * AWS Config Managed Rules are predefined, customizable rules created by AWS Config . For a list of managed rules, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) . If you are adding an AWS Config managed rule, you must specify the rule's identifier for the `SourceIdentifier` key.
 *
 * AWS Config Custom Rules are rules that you create from scratch. There are two ways to create AWS Config custom rules: with Lambda functions ( [AWS Lambda Developer Guide](https://docs.aws.amazon.com/config/latest/developerguide/gettingstarted-concepts.html#gettingstarted-concepts-function) ) and with Guard ( [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) ), a policy-as-code language. AWS Config custom rules created with AWS Lambda are called *AWS Config Custom Lambda Rules* and AWS Config custom rules created with Guard are called *AWS Config Custom Policy Rules* .
 *
 * If you are adding a new AWS Config Custom Lambda rule, you first need to create an AWS Lambda function that the rule invokes to evaluate your resources. When you use the `ConfigRule` resource to add a Custom Lambda rule to AWS Config , you must specify the Amazon Resource Name (ARN) that AWS Lambda assigns to the function. You specify the ARN in the `SourceIdentifier` key. This key is part of the `Source` object, which is part of the `ConfigRule` object.
 *
 * For any new AWS Config rule that you add, specify the `ConfigRuleName` in the `ConfigRule` object. Do not specify the `ConfigRuleArn` or the `ConfigRuleId` . These values are generated by AWS Config for new rules.
 *
 * If you are updating a rule that you added previously, you can specify the rule by `ConfigRuleName` , `ConfigRuleId` , or `ConfigRuleArn` in the `ConfigRule` data type that you use in this request.
 *
 * For more information about developing and using AWS Config rules, see [Evaluating Resources with AWS Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html) in the *AWS Config Developer Guide* .
 *
 * @cloudformationResource AWS::Config::ConfigRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html
 */
export class CfnConfigRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::ConfigRule";

  /**
   * Build a CfnConfigRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the AWS Config rule, such as `arn:aws:config:us-east-1:123456789012:config-rule/config-rule-a1bzhi` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Compliance type determined by the Config rule
   *
   * @cloudformationAttribute Compliance.Type
   */
  public readonly attrComplianceType: string;

  /**
   * The ID of the AWS Config rule, such as `config-rule-a1bzhi` .
   *
   * @cloudformationAttribute ConfigRuleId
   */
  public readonly attrConfigRuleId: string;

  /**
   * Indicates whether an AWS resource or AWS Config rule is compliant and provides the number of contributors that affect the compliance.
   */
  public compliance?: CfnConfigRule.ComplianceProperty | cdk.IResolvable;

  /**
   * A name for the AWS Config rule.
   */
  public configRuleName?: string;

  /**
   * The description that you provide for the AWS Config rule.
   */
  public description?: string;

  /**
   * The modes the AWS Config rule can be evaluated in.
   */
  public evaluationModes?: Array<CfnConfigRule.EvaluationModeConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A string, in JSON format, that is passed to the AWS Config rule Lambda function.
   */
  public inputParameters?: any | cdk.IResolvable;

  /**
   * The maximum frequency with which AWS Config runs evaluations for a rule.
   */
  public maximumExecutionFrequency?: string;

  /**
   * Defines which resources can trigger an evaluation for the rule.
   */
  public scope?: cdk.IResolvable | CfnConfigRule.ScopeProperty;

  /**
   * Provides the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the notifications that cause the function to evaluate your AWS resources.
   */
  public source: cdk.IResolvable | CfnConfigRule.SourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigRuleProps) {
    super(scope, id, {
      "type": CfnConfigRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "source", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrComplianceType = cdk.Token.asString(this.getAtt("Compliance.Type", cdk.ResolutionTypeHint.STRING));
    this.attrConfigRuleId = cdk.Token.asString(this.getAtt("ConfigRuleId", cdk.ResolutionTypeHint.STRING));
    this.compliance = props.compliance;
    this.configRuleName = props.configRuleName;
    this.description = props.description;
    this.evaluationModes = props.evaluationModes;
    this.inputParameters = props.inputParameters;
    this.maximumExecutionFrequency = props.maximumExecutionFrequency;
    this.scope = props.scope;
    this.source = props.source;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "compliance": this.compliance,
      "configRuleName": this.configRuleName,
      "description": this.description,
      "evaluationModes": this.evaluationModes,
      "inputParameters": this.inputParameters,
      "maximumExecutionFrequency": this.maximumExecutionFrequency,
      "scope": this.scope,
      "source": this.source
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigRulePropsToCloudFormation(props);
  }
}

export namespace CfnConfigRule {
  /**
   * The configuration object for AWS Config rule evaluation mode.
   *
   * The supported valid values are Detective or Proactive.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-evaluationmodeconfiguration.html
   */
  export interface EvaluationModeConfigurationProperty {
    /**
     * The mode of an evaluation.
     *
     * The valid values are Detective or Proactive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-evaluationmodeconfiguration.html#cfn-config-configrule-evaluationmodeconfiguration-mode
     */
    readonly mode?: string;
  }

  /**
   * Defines which resources trigger an evaluation for an AWS Config rule.
   *
   * The scope can include one or more resource types, a combination of a tag key and value, or a combination of one resource type and one resource ID. Specify a scope to constrain which resources trigger an evaluation for a rule. Otherwise, evaluations for the rule are triggered when any resource in your recording group changes in configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html
   */
  export interface ScopeProperty {
    /**
     * The ID of the only AWS resource that you want to trigger an evaluation for the rule.
     *
     * If you specify a resource ID, you must specify one resource type for `ComplianceResourceTypes` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourceid
     */
    readonly complianceResourceId?: string;

    /**
     * The resource types of only those AWS resources that you want to trigger an evaluation for the rule.
     *
     * You can only specify one type if you also specify a resource ID for `ComplianceResourceId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourcetypes
     */
    readonly complianceResourceTypes?: Array<string>;

    /**
     * The tag key that is applied to only those AWS resources that you want to trigger an evaluation for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagkey
     */
    readonly tagKey?: string;

    /**
     * The tag value applied to only those AWS resources that you want to trigger an evaluation for the rule.
     *
     * If you specify a value for `TagValue` , you must also specify a value for `TagKey` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagvalue
     */
    readonly tagValue?: string;
  }

  /**
   * Indicates whether an AWS resource or AWS Config rule is compliant and provides the number of contributors that affect the compliance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-compliance.html
   */
  export interface ComplianceProperty {
    /**
     * Indicates whether an AWS resource or AWS Config rule is compliant.
     *
     * A resource is compliant if it complies with all of the AWS Config rules that evaluate it. A resource is noncompliant if it does not comply with one or more of these rules.
     *
     * A rule is compliant if all of the resources that the rule evaluates comply with it. A rule is noncompliant if any of these resources do not comply.
     *
     * AWS Config returns the `INSUFFICIENT_DATA` value when no evaluation results are available for the AWS resource or AWS Config rule.
     *
     * For the `Compliance` data type, AWS Config supports only `COMPLIANT` , `NON_COMPLIANT` , and `INSUFFICIENT_DATA` values. AWS Config does not support the `NOT_APPLICABLE` value for the `Compliance` data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-compliance.html#cfn-config-configrule-compliance-type
     */
    readonly type?: string;
  }

  /**
   * Provides the CustomPolicyDetails, the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the events that cause the evaluation of your AWS resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html
   */
  export interface SourceProperty {
    /**
     * Provides the runtime system, policy definition, and whether debug logging is enabled.
     *
     * Required when owner is set to `CUSTOM_POLICY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-custompolicydetails
     */
    readonly customPolicyDetails?: CfnConfigRule.CustomPolicyDetailsProperty | cdk.IResolvable;

    /**
     * Indicates whether AWS or the customer owns and manages the AWS Config rule.
     *
     * AWS Config Managed Rules are predefined rules owned by AWS . For more information, see [AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html) in the *AWS Config developer guide* .
     *
     * AWS Config Custom Rules are rules that you can develop either with Guard ( `CUSTOM_POLICY` ) or AWS Lambda ( `CUSTOM_LAMBDA` ). For more information, see [AWS Config Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) in the *AWS Config developer guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-owner
     */
    readonly owner: string;

    /**
     * Provides the source and the message types that cause AWS Config to evaluate your AWS resources against a rule.
     *
     * It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
     *
     * If the owner is set to `CUSTOM_POLICY` , the only acceptable values for the AWS Config rule trigger message type are `ConfigurationItemChangeNotification` and `OversizedConfigurationItemChangeNotification` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourcedetails
     */
    readonly sourceDetails?: Array<cdk.IResolvable | CfnConfigRule.SourceDetailProperty> | cdk.IResolvable;

    /**
     * For AWS Config Managed rules, a predefined identifier from a list.
     *
     * For example, `IAM_PASSWORD_POLICY` is a managed rule. To reference a managed rule, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) .
     *
     * For AWS Config Custom Lambda rules, the identifier is the Amazon Resource Name (ARN) of the rule's AWS Lambda function, such as `arn:aws:lambda:us-east-2:123456789012:function:custom_rule_name` .
     *
     * For AWS Config Custom Policy rules, this field will be ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourceidentifier
     */
    readonly sourceIdentifier?: string;
  }

  /**
   * Provides the CustomPolicyDetails, the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the events that cause the evaluation of your AWS resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html
   */
  export interface CustomPolicyDetailsProperty {
    /**
     * The boolean expression for enabling debug logging for your AWS Config Custom Policy rule.
     *
     * The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-enabledebuglogdelivery
     */
    readonly enableDebugLogDelivery?: boolean | cdk.IResolvable;

    /**
     * The runtime system for your AWS Config Custom Policy rule.
     *
     * Guard is a policy-as-code language that allows you to write policies that are enforced by AWS Config Custom Policy rules. For more information about Guard, see the [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-policyruntime
     */
    readonly policyRuntime?: string;

    /**
     * The policy definition containing the logic for your AWS Config Custom Policy rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-policytext
     */
    readonly policyText?: string;
  }

  /**
   * Provides the source and the message types that trigger AWS Config to evaluate your AWS resources against a rule.
   *
   * It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic. You can specify the parameter values for `SourceDetail` only for custom rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-sourcedetail.html
   */
  export interface SourceDetailProperty {
    /**
     * The source of the event, such as an AWS service, that triggers AWS Config to evaluate your AWS resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-sourcedetail.html#cfn-config-configrule-sourcedetail-eventsource
     */
    readonly eventSource: string;

    /**
     * The frequency at which you want AWS Config to run evaluations for a custom rule with a periodic trigger.
     *
     * If you specify a value for `MaximumExecutionFrequency` , then `MessageType` must use the `ScheduledNotification` value.
     *
     * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
     * >
     * > Based on the valid value you choose, AWS Config runs evaluations once for each valid value. For example, if you choose `Three_Hours` , AWS Config runs evaluations once every three hours. In this case, `Three_Hours` is the frequency of this rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-sourcedetail.html#cfn-config-configrule-sourcedetail-maximumexecutionfrequency
     */
    readonly maximumExecutionFrequency?: string;

    /**
     * The type of notification that triggers AWS Config to run an evaluation for a rule.
     *
     * You can specify the following notification types:
     *
     * - `ConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers a configuration item as a result of a resource change.
     * - `OversizedConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers an oversized configuration item. AWS Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.
     * - `ScheduledNotification` - Triggers a periodic evaluation at the frequency specified for `MaximumExecutionFrequency` .
     * - `ConfigurationSnapshotDeliveryCompleted` - Triggers a periodic evaluation when AWS Config delivers a configuration snapshot.
     *
     * If you want your custom rule to be triggered by configuration changes, specify two SourceDetail objects, one for `ConfigurationItemChangeNotification` and one for `OversizedConfigurationItemChangeNotification` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-sourcedetail.html#cfn-config-configrule-sourcedetail-messagetype
     */
    readonly messageType: string;
  }
}

/**
 * Properties for defining a `CfnConfigRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html
 */
export interface CfnConfigRuleProps {
  /**
   * Indicates whether an AWS resource or AWS Config rule is compliant and provides the number of contributors that affect the compliance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-compliance
   */
  readonly compliance?: CfnConfigRule.ComplianceProperty | cdk.IResolvable;

  /**
   * A name for the AWS Config rule.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the rule name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-configrulename
   */
  readonly configRuleName?: string;

  /**
   * The description that you provide for the AWS Config rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-description
   */
  readonly description?: string;

  /**
   * The modes the AWS Config rule can be evaluated in.
   *
   * The valid values are distinct objects. By default, the value is Detective evaluation mode only.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-evaluationmodes
   */
  readonly evaluationModes?: Array<CfnConfigRule.EvaluationModeConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A string, in JSON format, that is passed to the AWS Config rule Lambda function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-inputparameters
   */
  readonly inputParameters?: any | cdk.IResolvable;

  /**
   * The maximum frequency with which AWS Config runs evaluations for a rule.
   *
   * You can specify a value for `MaximumExecutionFrequency` when:
   *
   * - You are using an AWS managed rule that is triggered at a periodic frequency.
   * - Your custom rule is triggered when AWS Config delivers the configuration snapshot. For more information, see [ConfigSnapshotDeliveryProperties](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigSnapshotDeliveryProperties.html) .
   *
   * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-maximumexecutionfrequency
   */
  readonly maximumExecutionFrequency?: string;

  /**
   * Defines which resources can trigger an evaluation for the rule.
   *
   * The scope can include one or more resource types, a combination of one resource type and one resource ID, or a combination of a tag key and value. Specify a scope to constrain the resources that can trigger an evaluation for the rule. If you do not specify a scope, evaluations are triggered when any resource in the recording group changes.
   *
   * > The scope can be empty.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-scope
   */
  readonly scope?: cdk.IResolvable | CfnConfigRule.ScopeProperty;

  /**
   * Provides the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the notifications that cause the function to evaluate your AWS resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-source
   */
  readonly source: cdk.IResolvable | CfnConfigRule.SourceProperty;
}

/**
 * Determine whether the given properties match those of a `EvaluationModeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationModeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleEvaluationModeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  return errors.wrap("supplied properties not correct for \"EvaluationModeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleEvaluationModeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleEvaluationModeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleEvaluationModeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.EvaluationModeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.EvaluationModeConfigurationProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleScopePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("complianceResourceId", cdk.validateString)(properties.complianceResourceId));
  errors.collect(cdk.propertyValidator("complianceResourceTypes", cdk.listValidator(cdk.validateString))(properties.complianceResourceTypes));
  errors.collect(cdk.propertyValidator("tagKey", cdk.validateString)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagValue", cdk.validateString)(properties.tagValue));
  return errors.wrap("supplied properties not correct for \"ScopeProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleScopePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleScopePropertyValidator(properties).assertSuccess();
  return {
    "ComplianceResourceId": cdk.stringToCloudFormation(properties.complianceResourceId),
    "ComplianceResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceTypes),
    "TagKey": cdk.stringToCloudFormation(properties.tagKey),
    "TagValue": cdk.stringToCloudFormation(properties.tagValue)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigRule.ScopeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.ScopeProperty>();
  ret.addPropertyResult("complianceResourceId", "ComplianceResourceId", (properties.ComplianceResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceResourceId) : undefined));
  ret.addPropertyResult("complianceResourceTypes", "ComplianceResourceTypes", (properties.ComplianceResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ComplianceResourceTypes) : undefined));
  ret.addPropertyResult("tagKey", "TagKey", (properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined));
  ret.addPropertyResult("tagValue", "TagValue", (properties.TagValue != null ? cfn_parse.FromCloudFormation.getString(properties.TagValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComplianceProperty`
 *
 * @param properties - the TypeScript properties of a `ComplianceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleCompliancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ComplianceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleCompliancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleCompliancePropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleCompliancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.ComplianceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.ComplianceProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomPolicyDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPolicyDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleCustomPolicyDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableDebugLogDelivery", cdk.validateBoolean)(properties.enableDebugLogDelivery));
  errors.collect(cdk.propertyValidator("policyRuntime", cdk.validateString)(properties.policyRuntime));
  errors.collect(cdk.propertyValidator("policyText", cdk.validateString)(properties.policyText));
  return errors.wrap("supplied properties not correct for \"CustomPolicyDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleCustomPolicyDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleCustomPolicyDetailsPropertyValidator(properties).assertSuccess();
  return {
    "EnableDebugLogDelivery": cdk.booleanToCloudFormation(properties.enableDebugLogDelivery),
    "PolicyRuntime": cdk.stringToCloudFormation(properties.policyRuntime),
    "PolicyText": cdk.stringToCloudFormation(properties.policyText)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleCustomPolicyDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.CustomPolicyDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.CustomPolicyDetailsProperty>();
  ret.addPropertyResult("enableDebugLogDelivery", "EnableDebugLogDelivery", (properties.EnableDebugLogDelivery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDebugLogDelivery) : undefined));
  ret.addPropertyResult("policyRuntime", "PolicyRuntime", (properties.PolicyRuntime != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyRuntime) : undefined));
  ret.addPropertyResult("policyText", "PolicyText", (properties.PolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyText) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceDetailProperty`
 *
 * @param properties - the TypeScript properties of a `SourceDetailProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleSourceDetailPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventSource", cdk.requiredValidator)(properties.eventSource));
  errors.collect(cdk.propertyValidator("eventSource", cdk.validateString)(properties.eventSource));
  errors.collect(cdk.propertyValidator("maximumExecutionFrequency", cdk.validateString)(properties.maximumExecutionFrequency));
  errors.collect(cdk.propertyValidator("messageType", cdk.requiredValidator)(properties.messageType));
  errors.collect(cdk.propertyValidator("messageType", cdk.validateString)(properties.messageType));
  return errors.wrap("supplied properties not correct for \"SourceDetailProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleSourceDetailPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleSourceDetailPropertyValidator(properties).assertSuccess();
  return {
    "EventSource": cdk.stringToCloudFormation(properties.eventSource),
    "MaximumExecutionFrequency": cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
    "MessageType": cdk.stringToCloudFormation(properties.messageType)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleSourceDetailPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigRule.SourceDetailProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.SourceDetailProperty>();
  ret.addPropertyResult("eventSource", "EventSource", (properties.EventSource != null ? cfn_parse.FromCloudFormation.getString(properties.EventSource) : undefined));
  ret.addPropertyResult("maximumExecutionFrequency", "MaximumExecutionFrequency", (properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined));
  ret.addPropertyResult("messageType", "MessageType", (properties.MessageType != null ? cfn_parse.FromCloudFormation.getString(properties.MessageType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRuleSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customPolicyDetails", CfnConfigRuleCustomPolicyDetailsPropertyValidator)(properties.customPolicyDetails));
  errors.collect(cdk.propertyValidator("owner", cdk.requiredValidator)(properties.owner));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  errors.collect(cdk.propertyValidator("sourceDetails", cdk.listValidator(CfnConfigRuleSourceDetailPropertyValidator))(properties.sourceDetails));
  errors.collect(cdk.propertyValidator("sourceIdentifier", cdk.validateString)(properties.sourceIdentifier));
  return errors.wrap("supplied properties not correct for \"SourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigRuleSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRuleSourcePropertyValidator(properties).assertSuccess();
  return {
    "CustomPolicyDetails": convertCfnConfigRuleCustomPolicyDetailsPropertyToCloudFormation(properties.customPolicyDetails),
    "Owner": cdk.stringToCloudFormation(properties.owner),
    "SourceDetails": cdk.listMapper(convertCfnConfigRuleSourceDetailPropertyToCloudFormation)(properties.sourceDetails),
    "SourceIdentifier": cdk.stringToCloudFormation(properties.sourceIdentifier)
  };
}

// @ts-ignore TS6133
function CfnConfigRuleSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigRule.SourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.SourceProperty>();
  ret.addPropertyResult("customPolicyDetails", "CustomPolicyDetails", (properties.CustomPolicyDetails != null ? CfnConfigRuleCustomPolicyDetailsPropertyFromCloudFormation(properties.CustomPolicyDetails) : undefined));
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addPropertyResult("sourceDetails", "SourceDetails", (properties.SourceDetails != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigRuleSourceDetailPropertyFromCloudFormation)(properties.SourceDetails) : undefined));
  ret.addPropertyResult("sourceIdentifier", "SourceIdentifier", (properties.SourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compliance", CfnConfigRuleCompliancePropertyValidator)(properties.compliance));
  errors.collect(cdk.propertyValidator("configRuleName", cdk.validateString)(properties.configRuleName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("evaluationModes", cdk.listValidator(CfnConfigRuleEvaluationModeConfigurationPropertyValidator))(properties.evaluationModes));
  errors.collect(cdk.propertyValidator("inputParameters", cdk.validateObject)(properties.inputParameters));
  errors.collect(cdk.propertyValidator("maximumExecutionFrequency", cdk.validateString)(properties.maximumExecutionFrequency));
  errors.collect(cdk.propertyValidator("scope", CfnConfigRuleScopePropertyValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", CfnConfigRuleSourcePropertyValidator)(properties.source));
  return errors.wrap("supplied properties not correct for \"CfnConfigRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigRulePropsValidator(properties).assertSuccess();
  return {
    "Compliance": convertCfnConfigRuleCompliancePropertyToCloudFormation(properties.compliance),
    "ConfigRuleName": cdk.stringToCloudFormation(properties.configRuleName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EvaluationModes": cdk.listMapper(convertCfnConfigRuleEvaluationModeConfigurationPropertyToCloudFormation)(properties.evaluationModes),
    "InputParameters": cdk.objectToCloudFormation(properties.inputParameters),
    "MaximumExecutionFrequency": cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
    "Scope": convertCfnConfigRuleScopePropertyToCloudFormation(properties.scope),
    "Source": convertCfnConfigRuleSourcePropertyToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnConfigRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRuleProps>();
  ret.addPropertyResult("compliance", "Compliance", (properties.Compliance != null ? CfnConfigRuleCompliancePropertyFromCloudFormation(properties.Compliance) : undefined));
  ret.addPropertyResult("configRuleName", "ConfigRuleName", (properties.ConfigRuleName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigRuleName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("evaluationModes", "EvaluationModes", (properties.EvaluationModes != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigRuleEvaluationModeConfigurationPropertyFromCloudFormation)(properties.EvaluationModes) : undefined));
  ret.addPropertyResult("inputParameters", "InputParameters", (properties.InputParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.InputParameters) : undefined));
  ret.addPropertyResult("maximumExecutionFrequency", "MaximumExecutionFrequency", (properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? CfnConfigRuleScopePropertyFromCloudFormation(properties.Scope) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? CfnConfigRuleSourcePropertyFromCloudFormation(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The details about the configuration aggregator, including information about source accounts, regions, and metadata of the aggregator.
 *
 * @cloudformationResource AWS::Config::ConfigurationAggregator
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html
 */
export class CfnConfigurationAggregator extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::ConfigurationAggregator";

  /**
   * Build a CfnConfigurationAggregator from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationAggregator {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationAggregatorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationAggregator(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the aggregator.
   *
   * @cloudformationAttribute ConfigurationAggregatorArn
   */
  public readonly attrConfigurationAggregatorArn: string;

  /**
   * Provides a list of source accounts and regions to be aggregated.
   */
  public accountAggregationSources?: Array<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the aggregator.
   */
  public configurationAggregatorName?: string;

  /**
   * Provides an organization and list of regions to be aggregated.
   */
  public organizationAggregationSource?: cdk.IResolvable | CfnConfigurationAggregator.OrganizationAggregationSourceProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of tag object.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationAggregatorProps = {}) {
    super(scope, id, {
      "type": CfnConfigurationAggregator.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrConfigurationAggregatorArn = cdk.Token.asString(this.getAtt("ConfigurationAggregatorArn", cdk.ResolutionTypeHint.STRING));
    this.accountAggregationSources = props.accountAggregationSources;
    this.configurationAggregatorName = props.configurationAggregatorName;
    this.organizationAggregationSource = props.organizationAggregationSource;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::ConfigurationAggregator", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountAggregationSources": this.accountAggregationSources,
      "configurationAggregatorName": this.configurationAggregatorName,
      "organizationAggregationSource": this.organizationAggregationSource,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationAggregator.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationAggregatorPropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationAggregator {
  /**
   * A collection of accounts and regions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html
   */
  export interface AccountAggregationSourceProperty {
    /**
     * The 12-digit account ID of the account being aggregated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-accountids
     */
    readonly accountIds: Array<string>;

    /**
     * If true, aggregate existing AWS Config regions and future regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-allawsregions
     */
    readonly allAwsRegions?: boolean | cdk.IResolvable;

    /**
     * The source regions being aggregated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-awsregions
     */
    readonly awsRegions?: Array<string>;
  }

  /**
   * This object contains regions to set up the aggregator and an IAM role to retrieve organization details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html
   */
  export interface OrganizationAggregationSourceProperty {
    /**
     * If true, aggregate existing AWS Config regions and future regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-allawsregions
     */
    readonly allAwsRegions?: boolean | cdk.IResolvable;

    /**
     * The source regions being aggregated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-awsregions
     */
    readonly awsRegions?: Array<string>;

    /**
     * ARN of the IAM role used to retrieve AWS Organizations details associated with the aggregator account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationAggregator`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html
 */
export interface CfnConfigurationAggregatorProps {
  /**
   * Provides a list of source accounts and regions to be aggregated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-accountaggregationsources
   */
  readonly accountAggregationSources?: Array<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the aggregator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-configurationaggregatorname
   */
  readonly configurationAggregatorName?: string;

  /**
   * Provides an organization and list of regions to be aggregated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-organizationaggregationsource
   */
  readonly organizationAggregationSource?: cdk.IResolvable | CfnConfigurationAggregator.OrganizationAggregationSourceProperty;

  /**
   * An array of tag object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AccountAggregationSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AccountAggregationSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationAggregatorAccountAggregationSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountIds", cdk.requiredValidator)(properties.accountIds));
  errors.collect(cdk.propertyValidator("accountIds", cdk.listValidator(cdk.validateString))(properties.accountIds));
  errors.collect(cdk.propertyValidator("allAwsRegions", cdk.validateBoolean)(properties.allAwsRegions));
  errors.collect(cdk.propertyValidator("awsRegions", cdk.listValidator(cdk.validateString))(properties.awsRegions));
  return errors.wrap("supplied properties not correct for \"AccountAggregationSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationAggregatorAccountAggregationSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationAggregatorAccountAggregationSourcePropertyValidator(properties).assertSuccess();
  return {
    "AccountIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.accountIds),
    "AllAwsRegions": cdk.booleanToCloudFormation(properties.allAwsRegions),
    "AwsRegions": cdk.listMapper(cdk.stringToCloudFormation)(properties.awsRegions)
  };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorAccountAggregationSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregator.AccountAggregationSourceProperty>();
  ret.addPropertyResult("accountIds", "AccountIds", (properties.AccountIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AccountIds) : undefined));
  ret.addPropertyResult("allAwsRegions", "AllAwsRegions", (properties.AllAwsRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllAwsRegions) : undefined));
  ret.addPropertyResult("awsRegions", "AwsRegions", (properties.AwsRegions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AwsRegions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrganizationAggregationSourceProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationAggregationSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationAggregatorOrganizationAggregationSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allAwsRegions", cdk.validateBoolean)(properties.allAwsRegions));
  errors.collect(cdk.propertyValidator("awsRegions", cdk.listValidator(cdk.validateString))(properties.awsRegions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"OrganizationAggregationSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationAggregatorOrganizationAggregationSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationAggregatorOrganizationAggregationSourcePropertyValidator(properties).assertSuccess();
  return {
    "AllAwsRegions": cdk.booleanToCloudFormation(properties.allAwsRegions),
    "AwsRegions": cdk.listMapper(cdk.stringToCloudFormation)(properties.awsRegions),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorOrganizationAggregationSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationAggregator.OrganizationAggregationSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregator.OrganizationAggregationSourceProperty>();
  ret.addPropertyResult("allAwsRegions", "AllAwsRegions", (properties.AllAwsRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllAwsRegions) : undefined));
  ret.addPropertyResult("awsRegions", "AwsRegions", (properties.AwsRegions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AwsRegions) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationAggregatorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAggregatorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationAggregatorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountAggregationSources", cdk.listValidator(CfnConfigurationAggregatorAccountAggregationSourcePropertyValidator))(properties.accountAggregationSources));
  errors.collect(cdk.propertyValidator("configurationAggregatorName", cdk.validateString)(properties.configurationAggregatorName));
  errors.collect(cdk.propertyValidator("organizationAggregationSource", CfnConfigurationAggregatorOrganizationAggregationSourcePropertyValidator)(properties.organizationAggregationSource));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationAggregatorProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationAggregatorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationAggregatorPropsValidator(properties).assertSuccess();
  return {
    "AccountAggregationSources": cdk.listMapper(convertCfnConfigurationAggregatorAccountAggregationSourcePropertyToCloudFormation)(properties.accountAggregationSources),
    "ConfigurationAggregatorName": cdk.stringToCloudFormation(properties.configurationAggregatorName),
    "OrganizationAggregationSource": convertCfnConfigurationAggregatorOrganizationAggregationSourcePropertyToCloudFormation(properties.organizationAggregationSource),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAggregatorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregatorProps>();
  ret.addPropertyResult("accountAggregationSources", "AccountAggregationSources", (properties.AccountAggregationSources != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationAggregatorAccountAggregationSourcePropertyFromCloudFormation)(properties.AccountAggregationSources) : undefined));
  ret.addPropertyResult("configurationAggregatorName", "ConfigurationAggregatorName", (properties.ConfigurationAggregatorName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationAggregatorName) : undefined));
  ret.addPropertyResult("organizationAggregationSource", "OrganizationAggregationSource", (properties.OrganizationAggregationSource != null ? CfnConfigurationAggregatorOrganizationAggregationSourcePropertyFromCloudFormation(properties.OrganizationAggregationSource) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Config::ConfigurationRecorder` resource type describes the AWS resource types that AWS Config records for configuration changes.
 *
 * The configuration recorder stores the configuration changes of the specified resources in your account as configuration items.
 *
 * > To enable AWS Config , you must create a configuration recorder and a delivery channel.
 * >
 * > AWS Config uses the delivery channel to deliver the configuration changes to your Amazon S3 bucket or Amazon SNS topic. For more information, see [AWS::Config::DeliveryChannel](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html) .
 *
 * AWS CloudFormation starts the recorder as soon as the delivery channel is available.
 *
 * To stop the recorder and delete it, delete the configuration recorder from your stack. To stop the recorder without deleting it, call the [StopConfigurationRecorder](https://docs.aws.amazon.com/config/latest/APIReference/API_StopConfigurationRecorder.html) action of the AWS Config API directly.
 *
 * For more information, see [Configuration Recorder](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#config-recorder) in the AWS Config Developer Guide.
 *
 * @cloudformationResource AWS::Config::ConfigurationRecorder
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html
 */
export class CfnConfigurationRecorder extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::ConfigurationRecorder";

  /**
   * Build a CfnConfigurationRecorder from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationRecorder {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationRecorderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationRecorder(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the configuration recorder. AWS Config automatically assigns the name of "default" when creating the configuration recorder.
   */
  public name?: string;

  /**
   * Specifies which resource types AWS Config records for configuration changes.
   */
  public recordingGroup?: cdk.IResolvable | CfnConfigurationRecorder.RecordingGroupProperty;

  /**
   * Specifies the default recording frequency that AWS Config uses to record configuration changes.
   */
  public recordingMode?: cdk.IResolvable | CfnConfigurationRecorder.RecordingModeProperty;

  /**
   * Amazon Resource Name (ARN) of the IAM role assumed by AWS Config and used by the configuration recorder.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationRecorderProps) {
    super(scope, id, {
      "type": CfnConfigurationRecorder.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.recordingGroup = props.recordingGroup;
    this.recordingMode = props.recordingMode;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "recordingGroup": this.recordingGroup,
      "recordingMode": this.recordingMode,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationRecorder.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationRecorderPropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationRecorder {
  /**
   * Specifies which resource types AWS Config records for configuration changes.
   *
   * By default, AWS Config records configuration changes for all current and future supported resource types in the AWS Region where you have enabled AWS Config , excluding the global IAM resource types: IAM users, groups, roles, and customer managed policies.
   *
   * In the recording group, you specify whether you want to record all supported current and future supported resource types or to include or exclude specific resources types. For a list of supported resource types, see [Supported Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources) in the *AWS Config developer guide* .
   *
   * If you don't want AWS Config to record all current and future supported resource types (excluding the global IAM resource types), use one of the following recording strategies:
   *
   * - *Record all current and future resource types with exclusions* ( `EXCLUSION_BY_RESOURCE_TYPES` ), or
   * - *Record specific resource types* ( `INCLUSION_BY_RESOURCE_TYPES` ).
   *
   * If you use the recording strategy to *Record all current and future resource types* ( `ALL_SUPPORTED_RESOURCE_TYPES` ), you can use the flag `includeGlobalResourceTypes` to include the global IAM resource types in your recording.
   *
   * > *Aurora global clusters are recorded in all enabled Regions*
   * >
   * > The `AWS::RDS::GlobalCluster` resource type will be recorded in all supported AWS Config Regions where the configuration recorder is enabled.
   * >
   * > If you do not want to record `AWS::RDS::GlobalCluster` in all enabled Regions, use the `EXCLUSION_BY_RESOURCE_TYPES` or `INCLUSION_BY_RESOURCE_TYPES` recording strategy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html
   */
  export interface RecordingGroupProperty {
    /**
     * Specifies whether AWS Config records configuration changes for all supported resource types, excluding the global IAM resource types.
     *
     * If you set this field to `true` , when AWS Config adds support for a new resource type, AWS Config starts recording resources of that type automatically.
     *
     * If you set this field to `true` , you cannot enumerate specific resource types to record in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) , or to exclude in the `resourceTypes` field of [ExclusionByResourceTypes](https://docs.aws.amazon.com/config/latest/APIReference/API_ExclusionByResourceTypes.html) .
     *
     * > *Region availability*
     * >
     * > Check [Resource Coverage by Region Availability](https://docs.aws.amazon.com/config/latest/developerguide/what-is-resource-config-coverage.html) to see if a resource type is supported in the AWS Region where you set up AWS Config .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-allsupported
     */
    readonly allSupported?: boolean | cdk.IResolvable;

    /**
     * An object that specifies how AWS Config excludes resource types from being recorded by the configuration recorder.
     *
     * To use this option, you must set the `useOnly` field of [AWS::Config::ConfigurationRecorder RecordingStrategy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingstrategy.html) to `EXCLUSION_BY_RESOURCE_TYPES` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-exclusionbyresourcetypes
     */
    readonly exclusionByResourceTypes?: CfnConfigurationRecorder.ExclusionByResourceTypesProperty | cdk.IResolvable;

    /**
     * This option is a bundle which only applies to the global IAM resource types: IAM users, groups, roles, and customer managed policies.
     *
     * These global IAM resource types can only be recorded by AWS Config in Regions where AWS Config was available before February 2022. You cannot be record the global IAM resouce types in Regions supported by AWS Config after February 2022. This list where you cannot record the global IAM resource types includes the following Regions:
     *
     * - Asia Pacific (Hyderabad)
     * - Asia Pacific (Melbourne)
     * - Europe (Spain)
     * - Europe (Zurich)
     * - Israel (Tel Aviv)
     * - Middle East (UAE)
     *
     * > *Aurora global clusters are recorded in all enabled Regions*
     * >
     * > The `AWS::RDS::GlobalCluster` resource type will be recorded in all supported AWS Config Regions where the configuration recorder is enabled, even if `includeGlobalResourceTypes` is not set to `true` . The `includeGlobalResourceTypes` option is a bundle which only applies to IAM users, groups, roles, and customer managed policies.
     * >
     * > If you do not want to record `AWS::RDS::GlobalCluster` in all enabled Regions, use one of the following recording strategies:
     * >
     * > - *Record all current and future resource types with exclusions* ( `EXCLUSION_BY_RESOURCE_TYPES` ), or
     * > - *Record specific resource types* ( `INCLUSION_BY_RESOURCE_TYPES` ).
     * >
     * > For more information, see [Selecting Which Resources are Recorded](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-all) in the *AWS Config developer guide* . > Before you set this field to `true` , set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` . Optionally, you can set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `ALL_SUPPORTED_RESOURCE_TYPES` . > *Overriding fields*
     * >
     * > If you set this field to `false` but list global IAM resource types in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) , AWS Config will still record configuration changes for those specified resource types *regardless* of if you set the `includeGlobalResourceTypes` field to false.
     * >
     * > If you do not want to record configuration changes to the global IAM resource types (IAM users, groups, roles, and customer managed policies), make sure to not list them in the `resourceTypes` field in addition to setting the `includeGlobalResourceTypes` field to false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-includeglobalresourcetypes
     */
    readonly includeGlobalResourceTypes?: boolean | cdk.IResolvable;

    /**
     * An object that specifies the recording strategy for the configuration recorder.
     *
     * - If you set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `ALL_SUPPORTED_RESOURCE_TYPES` , AWS Config records configuration changes for all supported resource types, excluding the global IAM resource types. You also must set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` . When AWS Config adds support for a new resource type, AWS Config automatically starts recording resources of that type.
     * - If you set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `INCLUSION_BY_RESOURCE_TYPES` , AWS Config records configuration changes for only the resource types you specify in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) .
     * - If you set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `EXCLUSION_BY_RESOURCE_TYPES` , AWS Config records configuration changes for all supported resource types except the resource types that you specify to exclude from being recorded in the `resourceTypes` field of [ExclusionByResourceTypes](https://docs.aws.amazon.com/config/latest/APIReference/API_ExclusionByResourceTypes.html) .
     *
     * > *Required and optional fields*
     * >
     * > The `recordingStrategy` field is optional when you set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` .
     * >
     * > The `recordingStrategy` field is optional when you list resource types in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) .
     * >
     * > The `recordingStrategy` field is required if you list resource types to exclude from recording in the `resourceTypes` field of [ExclusionByResourceTypes](https://docs.aws.amazon.com/config/latest/APIReference/API_ExclusionByResourceTypes.html) . > *Overriding fields*
     * >
     * > If you choose `EXCLUSION_BY_RESOURCE_TYPES` for the recording strategy, the `exclusionByResourceTypes` field will override other properties in the request.
     * >
     * > For example, even if you set `includeGlobalResourceTypes` to false, global IAM resource types will still be automatically recorded in this option unless those resource types are specifically listed as exclusions in the `resourceTypes` field of `exclusionByResourceTypes` . > *Global resources types and the resource exclusion recording strategy*
     * >
     * > By default, if you choose the `EXCLUSION_BY_RESOURCE_TYPES` recording strategy, when AWS Config adds support for a new resource type in the Region where you set up the configuration recorder, including global resource types, AWS Config starts recording resources of that type automatically.
     * >
     * > Unless specifically listed as exclusions, `AWS::RDS::GlobalCluster` will be recorded automatically in all supported AWS Config Regions were the configuration recorder is enabled.
     * >
     * > IAM users, groups, roles, and customer managed policies will be recorded in the Region where you set up the configuration recorder if that is a Region where AWS Config was available before February 2022. You cannot be record the global IAM resouce types in Regions supported by AWS Config after February 2022. This list where you cannot record the global IAM resource types includes the following Regions:
     * >
     * > - Asia Pacific (Hyderabad)
     * > - Asia Pacific (Melbourne)
     * > - Europe (Spain)
     * > - Europe (Zurich)
     * > - Israel (Tel Aviv)
     * > - Middle East (UAE)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-recordingstrategy
     */
    readonly recordingStrategy?: cdk.IResolvable | CfnConfigurationRecorder.RecordingStrategyProperty;

    /**
     * A comma-separated list that specifies which resource types AWS Config records.
     *
     * For a list of valid `resourceTypes` values, see the *Resource Type Value* column in [Supported AWS resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources) in the *AWS Config developer guide* .
     *
     * > *Required and optional fields*
     * >
     * > Optionally, you can set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `INCLUSION_BY_RESOURCE_TYPES` .
     * >
     * > To record all configuration changes, set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` , and either omit this field or don't specify any resource types in this field. If you set the `allSupported` field to `false` and specify values for `resourceTypes` , when AWS Config adds support for a new type of resource, it will not record resources of that type unless you manually add that type to your recording group. > *Region availability*
     * >
     * > Before specifying a resource type for AWS Config to track, check [Resource Coverage by Region Availability](https://docs.aws.amazon.com/config/latest/developerguide/what-is-resource-config-coverage.html) to see if the resource type is supported in the AWS Region where you set up AWS Config . If a resource type is supported by AWS Config in at least one Region, you can enable the recording of that resource type in all Regions supported by AWS Config , even if the specified resource type is not supported in the AWS Region where you set up AWS Config .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-resourcetypes
     */
    readonly resourceTypes?: Array<string>;
  }

  /**
   * Specifies whether the configuration recorder excludes certain resource types from being recorded.
   *
   * Use the `resourceTypes` field to enter a comma-separated list of resource types you want to exclude from recording.
   *
   * By default, when AWS Config adds support for a new resource type in the Region where you set up the configuration recorder, including global resource types, AWS Config starts recording resources of that type automatically.
   *
   * > *How to use the exclusion recording strategy*
   * >
   * > To use this option, you must set the `useOnly` field of [RecordingStrategy](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingStrategy.html) to `EXCLUSION_BY_RESOURCE_TYPES` .
   * >
   * > AWS Config will then record configuration changes for all supported resource types, except the resource types that you specify to exclude from being recorded.
   * >
   * > *Global resource types and the exclusion recording strategy*
   * >
   * > Unless specifically listed as exclusions, `AWS::RDS::GlobalCluster` will be recorded automatically in all supported AWS Config Regions were the configuration recorder is enabled.
   * >
   * > IAM users, groups, roles, and customer managed policies will be recorded in the Region where you set up the configuration recorder if that is a Region where AWS Config was available before February 2022. You cannot be record the global IAM resouce types in Regions supported by AWS Config after February 2022. This list where you cannot record the global IAM resource types includes the following Regions:
   * >
   * > - Asia Pacific (Hyderabad)
   * > - Asia Pacific (Melbourne)
   * > - Europe (Spain)
   * > - Europe (Zurich)
   * > - Israel (Tel Aviv)
   * > - Middle East (UAE)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-exclusionbyresourcetypes.html
   */
  export interface ExclusionByResourceTypesProperty {
    /**
     * A comma-separated list of resource types to exclude from recording by the configuration recorder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-exclusionbyresourcetypes.html#cfn-config-configurationrecorder-exclusionbyresourcetypes-resourcetypes
     */
    readonly resourceTypes: Array<string>;
  }

  /**
   * Specifies the recording strategy of the configuration recorder.
   *
   * Valid values include: `ALL_SUPPORTED_RESOURCE_TYPES` , `INCLUSION_BY_RESOURCE_TYPES` , and `EXCLUSION_BY_RESOURCE_TYPES` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingstrategy.html
   */
  export interface RecordingStrategyProperty {
    /**
     * The recording strategy for the configuration recorder.
     *
     * - If you set this option to `ALL_SUPPORTED_RESOURCE_TYPES` , AWS Config records configuration changes for all supported resource types, excluding the global IAM resource types. You also must set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` . When AWS Config adds support for a new resource type, AWS Config automatically starts recording resources of that type. For a list of supported resource types, see [Supported Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources) in the *AWS Config developer guide* .
     * - If you set this option to `INCLUSION_BY_RESOURCE_TYPES` , AWS Config records configuration changes for only the resource types that you specify in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) .
     * - If you set this option to `EXCLUSION_BY_RESOURCE_TYPES` , AWS Config records configuration changes for all supported resource types, except the resource types that you specify to exclude from being recorded in the `resourceTypes` field of [ExclusionByResourceTypes](https://docs.aws.amazon.com/config/latest/APIReference/API_ExclusionByResourceTypes.html) .
     *
     * > *Required and optional fields*
     * >
     * > The `recordingStrategy` field is optional when you set the `allSupported` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) to `true` .
     * >
     * > The `recordingStrategy` field is optional when you list resource types in the `resourceTypes` field of [RecordingGroup](https://docs.aws.amazon.com/config/latest/APIReference/API_RecordingGroup.html) .
     * >
     * > The `recordingStrategy` field is required if you list resource types to exclude from recording in the `resourceTypes` field of [ExclusionByResourceTypes](https://docs.aws.amazon.com/config/latest/APIReference/API_ExclusionByResourceTypes.html) . > *Overriding fields*
     * >
     * > If you choose `EXCLUSION_BY_RESOURCE_TYPES` for the recording strategy, the `exclusionByResourceTypes` field will override other properties in the request.
     * >
     * > For example, even if you set `includeGlobalResourceTypes` to false, global IAM resource types will still be automatically recorded in this option unless those resource types are specifically listed as exclusions in the `resourceTypes` field of `exclusionByResourceTypes` . > *Global resource types and the exclusion recording strategy*
     * >
     * > By default, if you choose the `EXCLUSION_BY_RESOURCE_TYPES` recording strategy, when AWS Config adds support for a new resource type in the Region where you set up the configuration recorder, including global resource types, AWS Config starts recording resources of that type automatically.
     * >
     * > Unless specifically listed as exclusions, `AWS::RDS::GlobalCluster` will be recorded automatically in all supported AWS Config Regions were the configuration recorder is enabled.
     * >
     * > IAM users, groups, roles, and customer managed policies will be recorded in the Region where you set up the configuration recorder if that is a Region where AWS Config was available before February 2022. You cannot be record the global IAM resouce types in Regions supported by AWS Config after February 2022. This list where you cannot record the global IAM resource types includes the following Regions:
     * >
     * > - Asia Pacific (Hyderabad)
     * > - Asia Pacific (Melbourne)
     * > - Europe (Spain)
     * > - Europe (Zurich)
     * > - Israel (Tel Aviv)
     * > - Middle East (UAE)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingstrategy.html#cfn-config-configurationrecorder-recordingstrategy-useonly
     */
    readonly useOnly: string;
  }

  /**
   * Specifies the default recording frequency that AWS Config uses to record configuration changes.
   *
   * AWS Config supports *Continuous recording* and *Daily recording* .
   *
   * - Continuous recording allows you to record configuration changes continuously whenever a change occurs.
   * - Daily recording allows you to receive a configuration item (CI) representing the most recent state of your resources over the last 24-hour period, only if it’s different from the previous CI recorded.
   *
   * > AWS Firewall Manager depends on continuous recording to monitor your resources. If you are using Firewall Manager, it is recommended that you set the recording frequency to Continuous.
   *
   * You can also override the recording frequency for specific resource types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmode.html
   */
  export interface RecordingModeProperty {
    /**
     * The default recording frequency that AWS Config uses to record configuration changes.
     *
     * > Daily recording is not supported for the following resource types:
     * >
     * > - `AWS::Config::ResourceCompliance`
     * > - `AWS::Config::ConformancePackCompliance`
     * > - `AWS::Config::ConfigurationRecorder`
     * >
     * > For the *allSupported* ( `ALL_SUPPORTED_RESOURCE_TYPES` ) recording strategy, these resource types will be set to Continuous recording.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmode.html#cfn-config-configurationrecorder-recordingmode-recordingfrequency
     */
    readonly recordingFrequency: string;

    /**
     * An array of `recordingModeOverride` objects for you to specify your overrides for the recording mode.
     *
     * The `recordingModeOverride` object in the `recordingModeOverrides` array consists of three fields: a `description` , the new `recordingFrequency` , and an array of `resourceTypes` to override.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmode.html#cfn-config-configurationrecorder-recordingmode-recordingmodeoverrides
     */
    readonly recordingModeOverrides?: Array<cdk.IResolvable | CfnConfigurationRecorder.RecordingModeOverrideProperty> | cdk.IResolvable;
  }

  /**
   * An object for you to specify your overrides for the recording mode.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmodeoverride.html
   */
  export interface RecordingModeOverrideProperty {
    /**
     * A description that you provide for the override.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmodeoverride.html#cfn-config-configurationrecorder-recordingmodeoverride-description
     */
    readonly description?: string;

    /**
     * The recording frequency that will be applied to all the resource types specified in the override.
     *
     * - Continuous recording allows you to record configuration changes continuously whenever a change occurs.
     * - Daily recording allows you to receive a configuration item (CI) representing the most recent state of your resources over the last 24-hour period, only if it’s different from the previous CI recorded.
     *
     * > AWS Firewall Manager depends on continuous recording to monitor your resources. If you are using Firewall Manager, it is recommended that you set the recording frequency to Continuous.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmodeoverride.html#cfn-config-configurationrecorder-recordingmodeoverride-recordingfrequency
     */
    readonly recordingFrequency: string;

    /**
     * A comma-separated list that specifies which resource types AWS Config includes in the override.
     *
     * > Daily recording is not supported for the following resource types:
     * >
     * > - `AWS::Config::ResourceCompliance`
     * > - `AWS::Config::ConformancePackCompliance`
     * > - `AWS::Config::ConfigurationRecorder`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordingmodeoverride.html#cfn-config-configurationrecorder-recordingmodeoverride-resourcetypes
     */
    readonly resourceTypes: Array<string>;
  }
}

/**
 * Properties for defining a `CfnConfigurationRecorder`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html
 */
export interface CfnConfigurationRecorderProps {
  /**
   * The name of the configuration recorder. AWS Config automatically assigns the name of "default" when creating the configuration recorder.
   *
   * You cannot change the name of the configuration recorder after it has been created. To change the configuration recorder name, you must delete it and create a new configuration recorder with a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-name
   */
  readonly name?: string;

  /**
   * Specifies which resource types AWS Config records for configuration changes.
   *
   * > *High Number of AWS Config Evaluations*
   * >
   * > You may notice increased activity in your account during your initial month recording with AWS Config when compared to subsequent months. During the initial bootstrapping process, AWS Config runs evaluations on all the resources in your account that you have selected for AWS Config to record.
   * >
   * > If you are running ephemeral workloads, you may see increased activity from AWS Config as it records configuration changes associated with creating and deleting these temporary resources. An *ephemeral workload* is a temporary use of computing resources that are loaded and run when needed. Examples include Amazon Elastic Compute Cloud ( Amazon EC2 ) Spot Instances, Amazon EMR jobs, and AWS Auto Scaling . If you want to avoid the increased activity from running ephemeral workloads, you can run these types of workloads in a separate account with AWS Config turned off to avoid increased configuration recording and rule evaluations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-recordinggroup
   */
  readonly recordingGroup?: cdk.IResolvable | CfnConfigurationRecorder.RecordingGroupProperty;

  /**
   * Specifies the default recording frequency that AWS Config uses to record configuration changes.
   *
   * AWS Config supports *Continuous recording* and *Daily recording* .
   *
   * - Continuous recording allows you to record configuration changes continuously whenever a change occurs.
   * - Daily recording allows you to receive a configuration item (CI) representing the most recent state of your resources over the last 24-hour period, only if it’s different from the previous CI recorded.
   *
   * > AWS Firewall Manager depends on continuous recording to monitor your resources. If you are using Firewall Manager, it is recommended that you set the recording frequency to Continuous.
   *
   * You can also override the recording frequency for specific resource types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-recordingmode
   */
  readonly recordingMode?: cdk.IResolvable | CfnConfigurationRecorder.RecordingModeProperty;

  /**
   * Amazon Resource Name (ARN) of the IAM role assumed by AWS Config and used by the configuration recorder.
   *
   * For more information, see [Permissions for the IAM Role Assigned](https://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html) to AWS Config in the AWS Config Developer Guide.
   *
   * > *Pre-existing AWS Config role*
   * >
   * > If you have used an AWS service that uses AWS Config , such as AWS Security Hub or AWS Control Tower , and an AWS Config role has already been created, make sure that the IAM role that you use when setting up AWS Config keeps the same minimum permissions as the already created AWS Config role. You must do this so that the other AWS service continues to run as expected.
   * >
   * > For example, if AWS Control Tower has an IAM role that allows AWS Config to read Amazon Simple Storage Service ( Amazon S3 ) objects, make sure that the same permissions are granted within the IAM role you use when setting up AWS Config . Otherwise, it may interfere with how AWS Control Tower operates. For more information about IAM roles for AWS Config , see [*Identity and Access Management for AWS Config*](https://docs.aws.amazon.com/config/latest/developerguide/security-iam.html) in the *AWS Config Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `ExclusionByResourceTypesProperty`
 *
 * @param properties - the TypeScript properties of a `ExclusionByResourceTypesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderExclusionByResourceTypesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.requiredValidator)(properties.resourceTypes));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.listValidator(cdk.validateString))(properties.resourceTypes));
  return errors.wrap("supplied properties not correct for \"ExclusionByResourceTypesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderExclusionByResourceTypesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderExclusionByResourceTypesPropertyValidator(properties).assertSuccess();
  return {
    "ResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderExclusionByResourceTypesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationRecorder.ExclusionByResourceTypesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.ExclusionByResourceTypesProperty>();
  ret.addPropertyResult("resourceTypes", "ResourceTypes", (properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordingStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `RecordingStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("useOnly", cdk.requiredValidator)(properties.useOnly));
  errors.collect(cdk.propertyValidator("useOnly", cdk.validateString)(properties.useOnly));
  return errors.wrap("supplied properties not correct for \"RecordingStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderRecordingStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderRecordingStrategyPropertyValidator(properties).assertSuccess();
  return {
    "UseOnly": cdk.stringToCloudFormation(properties.useOnly)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationRecorder.RecordingStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.RecordingStrategyProperty>();
  ret.addPropertyResult("useOnly", "UseOnly", (properties.UseOnly != null ? cfn_parse.FromCloudFormation.getString(properties.UseOnly) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordingGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RecordingGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allSupported", cdk.validateBoolean)(properties.allSupported));
  errors.collect(cdk.propertyValidator("exclusionByResourceTypes", CfnConfigurationRecorderExclusionByResourceTypesPropertyValidator)(properties.exclusionByResourceTypes));
  errors.collect(cdk.propertyValidator("includeGlobalResourceTypes", cdk.validateBoolean)(properties.includeGlobalResourceTypes));
  errors.collect(cdk.propertyValidator("recordingStrategy", CfnConfigurationRecorderRecordingStrategyPropertyValidator)(properties.recordingStrategy));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.listValidator(cdk.validateString))(properties.resourceTypes));
  return errors.wrap("supplied properties not correct for \"RecordingGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderRecordingGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderRecordingGroupPropertyValidator(properties).assertSuccess();
  return {
    "AllSupported": cdk.booleanToCloudFormation(properties.allSupported),
    "ExclusionByResourceTypes": convertCfnConfigurationRecorderExclusionByResourceTypesPropertyToCloudFormation(properties.exclusionByResourceTypes),
    "IncludeGlobalResourceTypes": cdk.booleanToCloudFormation(properties.includeGlobalResourceTypes),
    "RecordingStrategy": convertCfnConfigurationRecorderRecordingStrategyPropertyToCloudFormation(properties.recordingStrategy),
    "ResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationRecorder.RecordingGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.RecordingGroupProperty>();
  ret.addPropertyResult("allSupported", "AllSupported", (properties.AllSupported != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllSupported) : undefined));
  ret.addPropertyResult("exclusionByResourceTypes", "ExclusionByResourceTypes", (properties.ExclusionByResourceTypes != null ? CfnConfigurationRecorderExclusionByResourceTypesPropertyFromCloudFormation(properties.ExclusionByResourceTypes) : undefined));
  ret.addPropertyResult("includeGlobalResourceTypes", "IncludeGlobalResourceTypes", (properties.IncludeGlobalResourceTypes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeGlobalResourceTypes) : undefined));
  ret.addPropertyResult("recordingStrategy", "RecordingStrategy", (properties.RecordingStrategy != null ? CfnConfigurationRecorderRecordingStrategyPropertyFromCloudFormation(properties.RecordingStrategy) : undefined));
  ret.addPropertyResult("resourceTypes", "ResourceTypes", (properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordingModeOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `RecordingModeOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingModeOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("recordingFrequency", cdk.requiredValidator)(properties.recordingFrequency));
  errors.collect(cdk.propertyValidator("recordingFrequency", cdk.validateString)(properties.recordingFrequency));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.requiredValidator)(properties.resourceTypes));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.listValidator(cdk.validateString))(properties.resourceTypes));
  return errors.wrap("supplied properties not correct for \"RecordingModeOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderRecordingModeOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderRecordingModeOverridePropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "RecordingFrequency": cdk.stringToCloudFormation(properties.recordingFrequency),
    "ResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingModeOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationRecorder.RecordingModeOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.RecordingModeOverrideProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("recordingFrequency", "RecordingFrequency", (properties.RecordingFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.RecordingFrequency) : undefined));
  ret.addPropertyResult("resourceTypes", "ResourceTypes", (properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordingModeProperty`
 *
 * @param properties - the TypeScript properties of a `RecordingModeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingModePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordingFrequency", cdk.requiredValidator)(properties.recordingFrequency));
  errors.collect(cdk.propertyValidator("recordingFrequency", cdk.validateString)(properties.recordingFrequency));
  errors.collect(cdk.propertyValidator("recordingModeOverrides", cdk.listValidator(CfnConfigurationRecorderRecordingModeOverridePropertyValidator))(properties.recordingModeOverrides));
  return errors.wrap("supplied properties not correct for \"RecordingModeProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderRecordingModePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderRecordingModePropertyValidator(properties).assertSuccess();
  return {
    "RecordingFrequency": cdk.stringToCloudFormation(properties.recordingFrequency),
    "RecordingModeOverrides": cdk.listMapper(convertCfnConfigurationRecorderRecordingModeOverridePropertyToCloudFormation)(properties.recordingModeOverrides)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingModePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationRecorder.RecordingModeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.RecordingModeProperty>();
  ret.addPropertyResult("recordingFrequency", "RecordingFrequency", (properties.RecordingFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.RecordingFrequency) : undefined));
  ret.addPropertyResult("recordingModeOverrides", "RecordingModeOverrides", (properties.RecordingModeOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationRecorderRecordingModeOverridePropertyFromCloudFormation)(properties.RecordingModeOverrides) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationRecorderProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationRecorderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationRecorderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recordingGroup", CfnConfigurationRecorderRecordingGroupPropertyValidator)(properties.recordingGroup));
  errors.collect(cdk.propertyValidator("recordingMode", CfnConfigurationRecorderRecordingModePropertyValidator)(properties.recordingMode));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationRecorderProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationRecorderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationRecorderPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RecordingGroup": convertCfnConfigurationRecorderRecordingGroupPropertyToCloudFormation(properties.recordingGroup),
    "RecordingMode": convertCfnConfigurationRecorderRecordingModePropertyToCloudFormation(properties.recordingMode),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationRecorderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorderProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recordingGroup", "RecordingGroup", (properties.RecordingGroup != null ? CfnConfigurationRecorderRecordingGroupPropertyFromCloudFormation(properties.RecordingGroup) : undefined));
  ret.addPropertyResult("recordingMode", "RecordingMode", (properties.RecordingMode != null ? CfnConfigurationRecorderRecordingModePropertyFromCloudFormation(properties.RecordingMode) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A conformance pack is a collection of AWS Config rules and remediation actions that can be easily deployed in an account and a region.
 *
 * ConformancePack creates a service linked role in your account. The service linked role is created only when the role does not exist in your account.
 *
 * @cloudformationResource AWS::Config::ConformancePack
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html
 */
export class CfnConformancePack extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::ConformancePack";

  /**
   * Build a CfnConformancePack from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConformancePack {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConformancePackPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConformancePack(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of ConformancePackInputParameter objects.
   */
  public conformancePackInputParameters?: Array<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Name of the conformance pack you want to create.
   */
  public conformancePackName: string;

  /**
   * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
   */
  public deliveryS3Bucket?: string;

  /**
   * The prefix for the Amazon S3 bucket.
   */
  public deliveryS3KeyPrefix?: string;

  /**
   * A string containing full conformance pack template body.
   */
  public templateBody?: string;

  /**
   * Location of file containing the template body (s3://bucketname/prefix).
   */
  public templateS3Uri?: string;

  /**
   * An object that contains the name or Amazon Resource Name (ARN) of the AWS Systems Manager document (SSM document) and the version of the SSM document that is used to create a conformance pack.
   */
  public templateSsmDocumentDetails?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConformancePackProps) {
    super(scope, id, {
      "type": CfnConformancePack.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "conformancePackName", this);

    this.conformancePackInputParameters = props.conformancePackInputParameters;
    this.conformancePackName = props.conformancePackName;
    this.deliveryS3Bucket = props.deliveryS3Bucket;
    this.deliveryS3KeyPrefix = props.deliveryS3KeyPrefix;
    this.templateBody = props.templateBody;
    this.templateS3Uri = props.templateS3Uri;
    this.templateSsmDocumentDetails = props.templateSsmDocumentDetails;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "conformancePackInputParameters": this.conformancePackInputParameters,
      "conformancePackName": this.conformancePackName,
      "deliveryS3Bucket": this.deliveryS3Bucket,
      "deliveryS3KeyPrefix": this.deliveryS3KeyPrefix,
      "templateBody": this.templateBody,
      "templateS3Uri": this.templateS3Uri,
      "templateSsmDocumentDetails": this.templateSsmDocumentDetails
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConformancePack.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConformancePackPropsToCloudFormation(props);
  }
}

export namespace CfnConformancePack {
  /**
   * Input parameters in the form of key-value pairs for the conformance pack, both of which you define.
   *
   * Keys can have a maximum character length of 255 characters, and values can have a maximum length of 4096 characters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html
   */
  export interface ConformancePackInputParameterProperty {
    /**
     * One part of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html#cfn-config-conformancepack-conformancepackinputparameter-parametername
     */
    readonly parameterName: string;

    /**
     * Another part of the key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html#cfn-config-conformancepack-conformancepackinputparameter-parametervalue
     */
    readonly parameterValue: string;
  }

  /**
   * This API allows you to create a conformance pack template with an AWS Systems Manager document (SSM document).
   *
   * To deploy a conformance pack using an SSM document, first create an SSM document with conformance pack content, and then provide the `DocumentName` in the [PutConformancePack API](https://docs.aws.amazon.com/config/latest/APIReference/API_PutConformancePack.html) . You can also provide the `DocumentVersion` .
   *
   * The `TemplateSSMDocumentDetails` object contains the name of the SSM document and the version of the SSM document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html
   */
  export interface TemplateSSMDocumentDetailsProperty {
    /**
     * The name or Amazon Resource Name (ARN) of the SSM document to use to create a conformance pack.
     *
     * If you use the document name, AWS Config checks only your account and AWS Region for the SSM document. If you want to use an SSM document from another Region or account, you must provide the ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html#cfn-config-conformancepack-templatessmdocumentdetails-documentname
     */
    readonly documentName?: string;

    /**
     * The version of the SSM document to use to create a conformance pack.
     *
     * By default, AWS Config uses the latest version.
     *
     * > This field is optional.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html#cfn-config-conformancepack-templatessmdocumentdetails-documentversion
     */
    readonly documentVersion?: string;
  }
}

/**
 * Properties for defining a `CfnConformancePack`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html
 */
export interface CfnConformancePackProps {
  /**
   * A list of ConformancePackInputParameter objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackinputparameters
   */
  readonly conformancePackInputParameters?: Array<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Name of the conformance pack you want to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackname
   */
  readonly conformancePackName: string;

  /**
   * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3bucket
   */
  readonly deliveryS3Bucket?: string;

  /**
   * The prefix for the Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3keyprefix
   */
  readonly deliveryS3KeyPrefix?: string;

  /**
   * A string containing full conformance pack template body.
   *
   * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
   *
   * > You can only use a YAML template with two resource types: config rule ( `AWS::Config::ConfigRule` ) and a remediation action ( `AWS::Config::RemediationConfiguration` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatebody
   */
  readonly templateBody?: string;

  /**
   * Location of file containing the template body (s3://bucketname/prefix).
   *
   * The uri must point to the conformance pack template (max size: 300 KB) that is located in an Amazon S3 bucket.
   *
   * > You must have access to read Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templates3uri
   */
  readonly templateS3Uri?: string;

  /**
   * An object that contains the name or Amazon Resource Name (ARN) of the AWS Systems Manager document (SSM document) and the version of the SSM document that is used to create a conformance pack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatessmdocumentdetails
   */
  readonly templateSsmDocumentDetails?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConformancePackInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConformancePackConformancePackInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ConformancePackInputParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnConformancePackConformancePackInputParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConformancePackConformancePackInputParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnConformancePackConformancePackInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePack.ConformancePackInputParameterProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateSSMDocumentDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateSSMDocumentDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConformancePackTemplateSSMDocumentDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentName", cdk.validateString)(properties.documentName));
  errors.collect(cdk.propertyValidator("documentVersion", cdk.validateString)(properties.documentVersion));
  return errors.wrap("supplied properties not correct for \"TemplateSSMDocumentDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConformancePackTemplateSSMDocumentDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConformancePackTemplateSSMDocumentDetailsPropertyValidator(properties).assertSuccess();
  return {
    "DocumentName": cdk.stringToCloudFormation(properties.documentName),
    "DocumentVersion": cdk.stringToCloudFormation(properties.documentVersion)
  };
}

// @ts-ignore TS6133
function CfnConformancePackTemplateSSMDocumentDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConformancePack.TemplateSSMDocumentDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePack.TemplateSSMDocumentDetailsProperty>();
  ret.addPropertyResult("documentName", "DocumentName", (properties.DocumentName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentName) : undefined));
  ret.addPropertyResult("documentVersion", "DocumentVersion", (properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConformancePackProps`
 *
 * @param properties - the TypeScript properties of a `CfnConformancePackProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConformancePackPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conformancePackInputParameters", cdk.listValidator(CfnConformancePackConformancePackInputParameterPropertyValidator))(properties.conformancePackInputParameters));
  errors.collect(cdk.propertyValidator("conformancePackName", cdk.requiredValidator)(properties.conformancePackName));
  errors.collect(cdk.propertyValidator("conformancePackName", cdk.validateString)(properties.conformancePackName));
  errors.collect(cdk.propertyValidator("deliveryS3Bucket", cdk.validateString)(properties.deliveryS3Bucket));
  errors.collect(cdk.propertyValidator("deliveryS3KeyPrefix", cdk.validateString)(properties.deliveryS3KeyPrefix));
  errors.collect(cdk.propertyValidator("templateBody", cdk.validateString)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateS3Uri", cdk.validateString)(properties.templateS3Uri));
  errors.collect(cdk.propertyValidator("templateSsmDocumentDetails", cdk.validateObject)(properties.templateSsmDocumentDetails));
  return errors.wrap("supplied properties not correct for \"CfnConformancePackProps\"");
}

// @ts-ignore TS6133
function convertCfnConformancePackPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConformancePackPropsValidator(properties).assertSuccess();
  return {
    "ConformancePackInputParameters": cdk.listMapper(convertCfnConformancePackConformancePackInputParameterPropertyToCloudFormation)(properties.conformancePackInputParameters),
    "ConformancePackName": cdk.stringToCloudFormation(properties.conformancePackName),
    "DeliveryS3Bucket": cdk.stringToCloudFormation(properties.deliveryS3Bucket),
    "DeliveryS3KeyPrefix": cdk.stringToCloudFormation(properties.deliveryS3KeyPrefix),
    "TemplateBody": cdk.stringToCloudFormation(properties.templateBody),
    "TemplateS3Uri": cdk.stringToCloudFormation(properties.templateS3Uri),
    "TemplateSSMDocumentDetails": cdk.objectToCloudFormation(properties.templateSsmDocumentDetails)
  };
}

// @ts-ignore TS6133
function CfnConformancePackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConformancePackProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePackProps>();
  ret.addPropertyResult("conformancePackInputParameters", "ConformancePackInputParameters", (properties.ConformancePackInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnConformancePackConformancePackInputParameterPropertyFromCloudFormation)(properties.ConformancePackInputParameters) : undefined));
  ret.addPropertyResult("conformancePackName", "ConformancePackName", (properties.ConformancePackName != null ? cfn_parse.FromCloudFormation.getString(properties.ConformancePackName) : undefined));
  ret.addPropertyResult("deliveryS3Bucket", "DeliveryS3Bucket", (properties.DeliveryS3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3Bucket) : undefined));
  ret.addPropertyResult("deliveryS3KeyPrefix", "DeliveryS3KeyPrefix", (properties.DeliveryS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3KeyPrefix) : undefined));
  ret.addPropertyResult("templateBody", "TemplateBody", (properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined));
  ret.addPropertyResult("templateS3Uri", "TemplateS3Uri", (properties.TemplateS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateS3Uri) : undefined));
  ret.addPropertyResult("templateSsmDocumentDetails", "TemplateSSMDocumentDetails", (properties.TemplateSSMDocumentDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.TemplateSSMDocumentDetails) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a delivery channel object to deliver configuration information to an Amazon S3 bucket and Amazon SNS topic.
 *
 * Before you can create a delivery channel, you must create a configuration recorder. You can use this action to change the Amazon S3 bucket or an Amazon SNS topic of the existing delivery channel. To change the Amazon S3 bucket or an Amazon SNS topic, call this action and specify the changed values for the S3 bucket and the SNS topic. If you specify a different value for either the S3 bucket or the SNS topic, this action will keep the existing value for the parameter that is not changed.
 *
 * > In the China (Beijing) Region, when you call this action, the Amazon S3 bucket must also be in the China (Beijing) Region. In all the other regions, AWS Config supports cross-region and cross-account delivery channels.
 *
 * You can have only one delivery channel per region per AWS account, and the delivery channel is required to use AWS Config .
 *
 * > AWS Config does not support the delivery channel to an Amazon S3 bucket bucket where object lock is enabled. For more information, see [How S3 Object Lock works](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html) .
 *
 * When you create the delivery channel, you can specify; how often AWS Config delivers configuration snapshots to your Amazon S3 bucket (for example, 24 hours), the S3 bucket to which AWS Config sends configuration snapshots and configuration history files, and the Amazon SNS topic to which AWS Config sends notifications about configuration changes, such as updated resources, AWS Config rule evaluations, and when AWS Config delivers the configuration snapshot to your S3 bucket. For more information, see [Deliver Configuration Items](https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html#delivery-channel) in the AWS Config Developer Guide.
 *
 * > To enable AWS Config , you must create a configuration recorder and a delivery channel. If you want to create the resources separately, you must create a configuration recorder before you can create a delivery channel. AWS Config uses the configuration recorder to capture configuration changes to your resources. For more information, see [AWS::Config::ConfigurationRecorder](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html) .
 *
 * For more information, see [Managing the Delivery Channel](https://docs.aws.amazon.com/config/latest/developerguide/manage-delivery-channel.html) in the AWS Config Developer Guide.
 *
 * @cloudformationResource AWS::Config::DeliveryChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html
 */
export class CfnDeliveryChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::DeliveryChannel";

  /**
   * Build a CfnDeliveryChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeliveryChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeliveryChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeliveryChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket.
   */
  public configSnapshotDeliveryProperties?: CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable;

  /**
   * A name for the delivery channel.
   */
  public name?: string;

  /**
   * The name of the Amazon S3 bucket to which AWS Config delivers configuration snapshots and configuration history files.
   */
  public s3BucketName: string;

  /**
   * The prefix for the specified Amazon S3 bucket.
   */
  public s3KeyPrefix?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service ( AWS KMS ) AWS KMS key (KMS key) used to encrypt objects delivered by AWS Config .
   */
  public s3KmsKeyArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic to which AWS Config sends notifications about configuration changes.
   */
  public snsTopicArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeliveryChannelProps) {
    super(scope, id, {
      "type": CfnDeliveryChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "s3BucketName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.configSnapshotDeliveryProperties = props.configSnapshotDeliveryProperties;
    this.name = props.name;
    this.s3BucketName = props.s3BucketName;
    this.s3KeyPrefix = props.s3KeyPrefix;
    this.s3KmsKeyArn = props.s3KmsKeyArn;
    this.snsTopicArn = props.snsTopicArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configSnapshotDeliveryProperties": this.configSnapshotDeliveryProperties,
      "name": this.name,
      "s3BucketName": this.s3BucketName,
      "s3KeyPrefix": this.s3KeyPrefix,
      "s3KmsKeyArn": this.s3KmsKeyArn,
      "snsTopicArn": this.snsTopicArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeliveryChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeliveryChannelPropsToCloudFormation(props);
  }
}

export namespace CfnDeliveryChannel {
  /**
   * Provides options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket in your delivery channel.
   *
   * > If you want to create a rule that triggers evaluations for your resources when AWS Config delivers the configuration snapshot, see the following:
   *
   * The frequency for a rule that triggers evaluations for your resources when AWS Config delivers the configuration snapshot is set by one of two values, depending on which is less frequent:
   *
   * - The value for the `deliveryFrequency` parameter within the delivery channel configuration, which sets how often AWS Config delivers configuration snapshots. This value also sets how often AWS Config invokes evaluations for AWS Config rules.
   * - The value for the `MaximumExecutionFrequency` parameter, which sets the maximum frequency with which AWS Config invokes evaluations for the rule. For more information, see [ConfigRule](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigRule.html) .
   *
   * If the `deliveryFrequency` value is less frequent than the `MaximumExecutionFrequency` value for a rule, AWS Config invokes the rule only as often as the `deliveryFrequency` value.
   *
   * - For example, you want your rule to run evaluations when AWS Config delivers the configuration snapshot.
   * - You specify the `MaximumExecutionFrequency` value for `Six_Hours` .
   * - You then specify the delivery channel `deliveryFrequency` value for `TwentyFour_Hours` .
   * - Because the value for `deliveryFrequency` is less frequent than `MaximumExecutionFrequency` , AWS Config invokes evaluations for the rule every 24 hours.
   *
   * You should set the `MaximumExecutionFrequency` value to be at least as frequent as the `deliveryFrequency` value. You can view the `deliveryFrequency` value by using the `DescribeDeliveryChannnels` action.
   *
   * To update the `deliveryFrequency` with which AWS Config delivers your configuration snapshots, use the `PutDeliveryChannel` action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html
   */
  export interface ConfigSnapshotDeliveryPropertiesProperty {
    /**
     * The frequency with which AWS Config delivers configuration snapshots.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties-deliveryfrequency
     */
    readonly deliveryFrequency?: string;
  }
}

/**
 * Properties for defining a `CfnDeliveryChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html
 */
export interface CfnDeliveryChannelProps {
  /**
   * The options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties
   */
  readonly configSnapshotDeliveryProperties?: CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable;

  /**
   * A name for the delivery channel.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the delivery channel name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * Updates are not supported. To change the name, you must run two separate updates. In the first update, delete this resource, and then recreate it with a new name in the second update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-name
   */
  readonly name?: string;

  /**
   * The name of the Amazon S3 bucket to which AWS Config delivers configuration snapshots and configuration history files.
   *
   * If you specify a bucket that belongs to another AWS account , that bucket must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon S3 Bucket](https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-policy.html) in the *AWS Config Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3bucketname
   */
  readonly s3BucketName: string;

  /**
   * The prefix for the specified Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3keyprefix
   */
  readonly s3KeyPrefix?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service ( AWS KMS ) AWS KMS key (KMS key) used to encrypt objects delivered by AWS Config .
   *
   * Must belong to the same Region as the destination S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3kmskeyarn
   */
  readonly s3KmsKeyArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic to which AWS Config sends notifications about configuration changes.
   *
   * If you choose a topic from another account, the topic must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon SNS Topic](https://docs.aws.amazon.com/config/latest/developerguide/sns-topic-policy.html) in the *AWS Config Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-snstopicarn
   */
  readonly snsTopicArn?: string;
}

/**
 * Determine whether the given properties match those of a `ConfigSnapshotDeliveryPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigSnapshotDeliveryPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryFrequency", cdk.validateString)(properties.deliveryFrequency));
  return errors.wrap("supplied properties not correct for \"ConfigSnapshotDeliveryPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryFrequency": cdk.stringToCloudFormation(properties.deliveryFrequency)
  };
}

// @ts-ignore TS6133
function CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty>();
  ret.addPropertyResult("deliveryFrequency", "DeliveryFrequency", (properties.DeliveryFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryFrequency) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeliveryChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configSnapshotDeliveryProperties", CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyValidator)(properties.configSnapshotDeliveryProperties));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.requiredValidator)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3KeyPrefix", cdk.validateString)(properties.s3KeyPrefix));
  errors.collect(cdk.propertyValidator("s3KmsKeyArn", cdk.validateString)(properties.s3KmsKeyArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  return errors.wrap("supplied properties not correct for \"CfnDeliveryChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryChannelPropsValidator(properties).assertSuccess();
  return {
    "ConfigSnapshotDeliveryProperties": convertCfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyToCloudFormation(properties.configSnapshotDeliveryProperties),
    "Name": cdk.stringToCloudFormation(properties.name),
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3KeyPrefix": cdk.stringToCloudFormation(properties.s3KeyPrefix),
    "S3KmsKeyArn": cdk.stringToCloudFormation(properties.s3KmsKeyArn),
    "SnsTopicARN": cdk.stringToCloudFormation(properties.snsTopicArn)
  };
}

// @ts-ignore TS6133
function CfnDeliveryChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryChannelProps>();
  ret.addPropertyResult("configSnapshotDeliveryProperties", "ConfigSnapshotDeliveryProperties", (properties.ConfigSnapshotDeliveryProperties != null ? CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyFromCloudFormation(properties.ConfigSnapshotDeliveryProperties) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3KeyPrefix", "S3KeyPrefix", (properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined));
  ret.addPropertyResult("s3KmsKeyArn", "S3KmsKeyArn", (properties.S3KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3KmsKeyArn) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicARN", (properties.SnsTopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds or updates an AWS Config rule for your entire organization to evaluate if your AWS resources comply with your desired configurations.
 *
 * For information on how many organization AWS Config rules you can have per account, see [*Service Limits*](https://docs.aws.amazon.com/config/latest/developerguide/configlimits.html) in the *AWS Config Developer Guide* .
 *
 * Only a management account and a delegated administrator can create or update an organization AWS Config rule. When calling the `OrganizationConfigRule` resource with a delegated administrator, you must ensure AWS Organizations `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * The `OrganizationConfigRule` resource enables organization service access through the `EnableAWSServiceAccess` action and creates a service-linked role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization. The service-linked role is created only when the role does not exist in the caller account. AWS Config verifies the existence of role with `GetRole` action.
 *
 * To use the `OrganizationConfigRule` resource with delegated administrator, register a delegated administrator by calling AWS Organization `register-delegated-administrator` for `config-multiaccountsetup.amazonaws.com` .
 *
 * There are two types of rules: *AWS Config Managed Rules* and *AWS Config Custom Rules* . You can use `PutOrganizationConfigRule` to create both AWS Config Managed Rules and AWS Config Custom Rules.
 *
 * AWS Config Managed Rules are predefined, customizable rules created by AWS Config . For a list of managed rules, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) . If you are adding an AWS Config managed rule, you must specify the rule's identifier for the `RuleIdentifier` key.
 *
 * AWS Config Custom Rules are rules that you create from scratch. There are two ways to create AWS Config custom rules: with Lambda functions ( [AWS Lambda Developer Guide](https://docs.aws.amazon.com/config/latest/developerguide/gettingstarted-concepts.html#gettingstarted-concepts-function) ) and with Guard ( [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) ), a policy-as-code language. AWS Config custom rules created with AWS Lambda are called *AWS Config Custom Lambda Rules* and AWS Config custom rules created with Guard are called *AWS Config Custom Policy Rules* .
 *
 * If you are adding a new AWS Config Custom Lambda rule, you first need to create an AWS Lambda function in the management account or a delegated administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed account that can be assumed by the Lambda function. When you use `PutOrganizationConfigRule` to add a Custom Lambda rule to AWS Config , you must specify the Amazon Resource Name (ARN) that AWS Lambda assigns to the function.
 *
 * @cloudformationResource AWS::Config::OrganizationConfigRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html
 */
export class CfnOrganizationConfigRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::OrganizationConfigRule";

  /**
   * Build a CfnOrganizationConfigRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOrganizationConfigRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOrganizationConfigRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOrganizationConfigRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A comma-separated list of accounts excluded from organization AWS Config rule.
   */
  public excludedAccounts?: Array<string>;

  /**
   * The name that you assign to organization AWS Config rule.
   */
  public organizationConfigRuleName: string;

  /**
   * An object that specifies metadata for your organization's AWS Config Custom Policy rule.
   */
  public organizationCustomPolicyRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomPolicyRuleMetadataProperty;

  /**
   * An `OrganizationCustomRuleMetadata` object.
   */
  public organizationCustomRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty;

  /**
   * An `OrganizationManagedRuleMetadata` object.
   */
  public organizationManagedRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOrganizationConfigRuleProps) {
    super(scope, id, {
      "type": CfnOrganizationConfigRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "organizationConfigRuleName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.excludedAccounts = props.excludedAccounts;
    this.organizationConfigRuleName = props.organizationConfigRuleName;
    this.organizationCustomPolicyRuleMetadata = props.organizationCustomPolicyRuleMetadata;
    this.organizationCustomRuleMetadata = props.organizationCustomRuleMetadata;
    this.organizationManagedRuleMetadata = props.organizationManagedRuleMetadata;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "excludedAccounts": this.excludedAccounts,
      "organizationConfigRuleName": this.organizationConfigRuleName,
      "organizationCustomPolicyRuleMetadata": this.organizationCustomPolicyRuleMetadata,
      "organizationCustomRuleMetadata": this.organizationCustomRuleMetadata,
      "organizationManagedRuleMetadata": this.organizationManagedRuleMetadata
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOrganizationConfigRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOrganizationConfigRulePropsToCloudFormation(props);
  }
}

export namespace CfnOrganizationConfigRule {
  /**
   * An object that specifies organization managed rule metadata such as resource type and ID of AWS resource along with the rule identifier.
   *
   * It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html
   */
  export interface OrganizationManagedRuleMetadataProperty {
    /**
     * The description that you provide for your organization AWS Config rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-description
     */
    readonly description?: string;

    /**
     * A string, in JSON format, that is passed to your organization AWS Config rule Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-inputparameters
     */
    readonly inputParameters?: string;

    /**
     * The maximum frequency with which AWS Config runs evaluations for a rule.
     *
     * This is for an AWS Config managed rule that is triggered at a periodic frequency.
     *
     * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-maximumexecutionfrequency
     */
    readonly maximumExecutionFrequency?: string;

    /**
     * The ID of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-resourceidscope
     */
    readonly resourceIdScope?: string;

    /**
     * The type of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-resourcetypesscope
     */
    readonly resourceTypesScope?: Array<string>;

    /**
     * For organization config managed rules, a predefined identifier from a list.
     *
     * For example, `IAM_PASSWORD_POLICY` is a managed rule. To reference a managed rule, see [Using AWS Config managed rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-ruleidentifier
     */
    readonly ruleIdentifier: string;

    /**
     * One part of a key-value pair that make up a tag.
     *
     * A key is a general label that acts like a category for more specific tag values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-tagkeyscope
     */
    readonly tagKeyScope?: string;

    /**
     * The optional part of a key-value pair that make up a tag.
     *
     * A value acts as a descriptor within a tag category (key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-tagvaluescope
     */
    readonly tagValueScope?: string;
  }

  /**
   * An object that specifies organization custom rule metadata such as resource type, resource ID of AWS resource, Lambda function ARN, and organization trigger types that trigger AWS Config to evaluate your AWS resources against a rule.
   *
   * It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html
   */
  export interface OrganizationCustomRuleMetadataProperty {
    /**
     * The description that you provide for your organization AWS Config rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-description
     */
    readonly description?: string;

    /**
     * A string, in JSON format, that is passed to your organization AWS Config rule Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-inputparameters
     */
    readonly inputParameters?: string;

    /**
     * The lambda function ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-lambdafunctionarn
     */
    readonly lambdaFunctionArn: string;

    /**
     * The maximum frequency with which AWS Config runs evaluations for a rule.
     *
     * Your custom rule is triggered when AWS Config delivers the configuration snapshot. For more information, see `ConfigSnapshotDeliveryProperties` .
     *
     * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-maximumexecutionfrequency
     */
    readonly maximumExecutionFrequency?: string;

    /**
     * The type of notification that triggers AWS Config to run an evaluation for a rule.
     *
     * You can specify the following notification types:
     *
     * - `ConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers a configuration item as a result of a resource change.
     * - `OversizedConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers an oversized configuration item. AWS Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.
     * - `ScheduledNotification` - Triggers a periodic evaluation at the frequency specified for `MaximumExecutionFrequency` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-organizationconfigruletriggertypes
     */
    readonly organizationConfigRuleTriggerTypes: Array<string>;

    /**
     * The ID of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-resourceidscope
     */
    readonly resourceIdScope?: string;

    /**
     * The type of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-resourcetypesscope
     */
    readonly resourceTypesScope?: Array<string>;

    /**
     * One part of a key-value pair that make up a tag.
     *
     * A key is a general label that acts like a category for more specific tag values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-tagkeyscope
     */
    readonly tagKeyScope?: string;

    /**
     * The optional part of a key-value pair that make up a tag.
     *
     * A value acts as a descriptor within a tag category (key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-tagvaluescope
     */
    readonly tagValueScope?: string;
  }

  /**
   * An object that specifies metadata for your organization's AWS Config Custom Policy rule.
   *
   * The metadata includes the runtime system in use, which accounts have debug logging enabled, and other custom rule metadata, such as resource type, resource ID of AWS resource, and organization trigger types that initiate AWS Config to evaluate AWS resources against a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html
   */
  export interface OrganizationCustomPolicyRuleMetadataProperty {
    /**
     * A list of accounts that you can enable debug logging for your organization AWS Config Custom Policy rule.
     *
     * List is null when debug logging is enabled for all accounts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-debuglogdeliveryaccounts
     */
    readonly debugLogDeliveryAccounts?: Array<string>;

    /**
     * The description that you provide for your organization AWS Config Custom Policy rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-description
     */
    readonly description?: string;

    /**
     * A string, in JSON format, that is passed to your organization AWS Config Custom Policy rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-inputparameters
     */
    readonly inputParameters?: string;

    /**
     * The maximum frequency with which AWS Config runs evaluations for a rule.
     *
     * Your AWS Config Custom Policy rule is triggered when AWS Config delivers the configuration snapshot. For more information, see `ConfigSnapshotDeliveryProperties` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-maximumexecutionfrequency
     */
    readonly maximumExecutionFrequency?: string;

    /**
     * The type of notification that initiates AWS Config to run an evaluation for a rule.
     *
     * For AWS Config Custom Policy rules, AWS Config supports change-initiated notification types:
     *
     * - `ConfigurationItemChangeNotification` - Initiates an evaluation when AWS Config delivers a configuration item as a result of a resource change.
     * - `OversizedConfigurationItemChangeNotification` - Initiates an evaluation when AWS Config delivers an oversized configuration item. AWS Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-organizationconfigruletriggertypes
     */
    readonly organizationConfigRuleTriggerTypes?: Array<string>;

    /**
     * The policy definition containing the logic for your organization AWS Config Custom Policy rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-policytext
     */
    readonly policyText: string;

    /**
     * The ID of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-resourceidscope
     */
    readonly resourceIdScope?: string;

    /**
     * The type of the AWS resource that was evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-resourcetypesscope
     */
    readonly resourceTypesScope?: Array<string>;

    /**
     * The runtime system for your organization AWS Config Custom Policy rules.
     *
     * Guard is a policy-as-code language that allows you to write policies that are enforced by AWS Config Custom Policy rules. For more information about Guard, see the [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-runtime
     */
    readonly runtime: string;

    /**
     * One part of a key-value pair that make up a tag.
     *
     * A key is a general label that acts like a category for more specific tag values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-tagkeyscope
     */
    readonly tagKeyScope?: string;

    /**
     * The optional part of a key-value pair that make up a tag.
     *
     * A value acts as a descriptor within a tag category (key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustompolicyrulemetadata.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata-tagvaluescope
     */
    readonly tagValueScope?: string;
  }
}

/**
 * Properties for defining a `CfnOrganizationConfigRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html
 */
export interface CfnOrganizationConfigRuleProps {
  /**
   * A comma-separated list of accounts excluded from organization AWS Config rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-excludedaccounts
   */
  readonly excludedAccounts?: Array<string>;

  /**
   * The name that you assign to organization AWS Config rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationconfigrulename
   */
  readonly organizationConfigRuleName: string;

  /**
   * An object that specifies metadata for your organization's AWS Config Custom Policy rule.
   *
   * The metadata includes the runtime system in use, which accounts have debug logging enabled, and other custom rule metadata, such as resource type, resource ID of AWS resource, and organization trigger types that initiate AWS Config to evaluate AWS resources against a rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustompolicyrulemetadata
   */
  readonly organizationCustomPolicyRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomPolicyRuleMetadataProperty;

  /**
   * An `OrganizationCustomRuleMetadata` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata
   */
  readonly organizationCustomRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty;

  /**
   * An `OrganizationManagedRuleMetadata` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata
   */
  readonly organizationManagedRuleMetadata?: cdk.IResolvable | CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty;
}

/**
 * Determine whether the given properties match those of a `OrganizationManagedRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationManagedRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inputParameters", cdk.validateString)(properties.inputParameters));
  errors.collect(cdk.propertyValidator("maximumExecutionFrequency", cdk.validateString)(properties.maximumExecutionFrequency));
  errors.collect(cdk.propertyValidator("resourceIdScope", cdk.validateString)(properties.resourceIdScope));
  errors.collect(cdk.propertyValidator("resourceTypesScope", cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
  errors.collect(cdk.propertyValidator("ruleIdentifier", cdk.requiredValidator)(properties.ruleIdentifier));
  errors.collect(cdk.propertyValidator("ruleIdentifier", cdk.validateString)(properties.ruleIdentifier));
  errors.collect(cdk.propertyValidator("tagKeyScope", cdk.validateString)(properties.tagKeyScope));
  errors.collect(cdk.propertyValidator("tagValueScope", cdk.validateString)(properties.tagValueScope));
  return errors.wrap("supplied properties not correct for \"OrganizationManagedRuleMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InputParameters": cdk.stringToCloudFormation(properties.inputParameters),
    "MaximumExecutionFrequency": cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
    "ResourceIdScope": cdk.stringToCloudFormation(properties.resourceIdScope),
    "ResourceTypesScope": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
    "RuleIdentifier": cdk.stringToCloudFormation(properties.ruleIdentifier),
    "TagKeyScope": cdk.stringToCloudFormation(properties.tagKeyScope),
    "TagValueScope": cdk.stringToCloudFormation(properties.tagValueScope)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inputParameters", "InputParameters", (properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined));
  ret.addPropertyResult("maximumExecutionFrequency", "MaximumExecutionFrequency", (properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined));
  ret.addPropertyResult("resourceIdScope", "ResourceIdScope", (properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined));
  ret.addPropertyResult("resourceTypesScope", "ResourceTypesScope", (properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypesScope) : undefined));
  ret.addPropertyResult("ruleIdentifier", "RuleIdentifier", (properties.RuleIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.RuleIdentifier) : undefined));
  ret.addPropertyResult("tagKeyScope", "TagKeyScope", (properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined));
  ret.addPropertyResult("tagValueScope", "TagValueScope", (properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrganizationCustomRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inputParameters", cdk.validateString)(properties.inputParameters));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.requiredValidator)(properties.lambdaFunctionArn));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.validateString)(properties.lambdaFunctionArn));
  errors.collect(cdk.propertyValidator("maximumExecutionFrequency", cdk.validateString)(properties.maximumExecutionFrequency));
  errors.collect(cdk.propertyValidator("organizationConfigRuleTriggerTypes", cdk.requiredValidator)(properties.organizationConfigRuleTriggerTypes));
  errors.collect(cdk.propertyValidator("organizationConfigRuleTriggerTypes", cdk.listValidator(cdk.validateString))(properties.organizationConfigRuleTriggerTypes));
  errors.collect(cdk.propertyValidator("resourceIdScope", cdk.validateString)(properties.resourceIdScope));
  errors.collect(cdk.propertyValidator("resourceTypesScope", cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
  errors.collect(cdk.propertyValidator("tagKeyScope", cdk.validateString)(properties.tagKeyScope));
  errors.collect(cdk.propertyValidator("tagValueScope", cdk.validateString)(properties.tagValueScope));
  return errors.wrap("supplied properties not correct for \"OrganizationCustomRuleMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InputParameters": cdk.stringToCloudFormation(properties.inputParameters),
    "LambdaFunctionArn": cdk.stringToCloudFormation(properties.lambdaFunctionArn),
    "MaximumExecutionFrequency": cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
    "OrganizationConfigRuleTriggerTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationConfigRuleTriggerTypes),
    "ResourceIdScope": cdk.stringToCloudFormation(properties.resourceIdScope),
    "ResourceTypesScope": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
    "TagKeyScope": cdk.stringToCloudFormation(properties.tagKeyScope),
    "TagValueScope": cdk.stringToCloudFormation(properties.tagValueScope)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inputParameters", "InputParameters", (properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined));
  ret.addPropertyResult("lambdaFunctionArn", "LambdaFunctionArn", (properties.LambdaFunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionArn) : undefined));
  ret.addPropertyResult("maximumExecutionFrequency", "MaximumExecutionFrequency", (properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined));
  ret.addPropertyResult("organizationConfigRuleTriggerTypes", "OrganizationConfigRuleTriggerTypes", (properties.OrganizationConfigRuleTriggerTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationConfigRuleTriggerTypes) : undefined));
  ret.addPropertyResult("resourceIdScope", "ResourceIdScope", (properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined));
  ret.addPropertyResult("resourceTypesScope", "ResourceTypesScope", (properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypesScope) : undefined));
  ret.addPropertyResult("tagKeyScope", "TagKeyScope", (properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined));
  ret.addPropertyResult("tagValueScope", "TagValueScope", (properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrganizationCustomPolicyRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomPolicyRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("debugLogDeliveryAccounts", cdk.listValidator(cdk.validateString))(properties.debugLogDeliveryAccounts));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inputParameters", cdk.validateString)(properties.inputParameters));
  errors.collect(cdk.propertyValidator("maximumExecutionFrequency", cdk.validateString)(properties.maximumExecutionFrequency));
  errors.collect(cdk.propertyValidator("organizationConfigRuleTriggerTypes", cdk.listValidator(cdk.validateString))(properties.organizationConfigRuleTriggerTypes));
  errors.collect(cdk.propertyValidator("policyText", cdk.requiredValidator)(properties.policyText));
  errors.collect(cdk.propertyValidator("policyText", cdk.validateString)(properties.policyText));
  errors.collect(cdk.propertyValidator("resourceIdScope", cdk.validateString)(properties.resourceIdScope));
  errors.collect(cdk.propertyValidator("resourceTypesScope", cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
  errors.collect(cdk.propertyValidator("runtime", cdk.requiredValidator)(properties.runtime));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  errors.collect(cdk.propertyValidator("tagKeyScope", cdk.validateString)(properties.tagKeyScope));
  errors.collect(cdk.propertyValidator("tagValueScope", cdk.validateString)(properties.tagValueScope));
  return errors.wrap("supplied properties not correct for \"OrganizationCustomPolicyRuleMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyValidator(properties).assertSuccess();
  return {
    "DebugLogDeliveryAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.debugLogDeliveryAccounts),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InputParameters": cdk.stringToCloudFormation(properties.inputParameters),
    "MaximumExecutionFrequency": cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
    "OrganizationConfigRuleTriggerTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationConfigRuleTriggerTypes),
    "PolicyText": cdk.stringToCloudFormation(properties.policyText),
    "ResourceIdScope": cdk.stringToCloudFormation(properties.resourceIdScope),
    "ResourceTypesScope": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
    "Runtime": cdk.stringToCloudFormation(properties.runtime),
    "TagKeyScope": cdk.stringToCloudFormation(properties.tagKeyScope),
    "TagValueScope": cdk.stringToCloudFormation(properties.tagValueScope)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOrganizationConfigRule.OrganizationCustomPolicyRuleMetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationCustomPolicyRuleMetadataProperty>();
  ret.addPropertyResult("debugLogDeliveryAccounts", "DebugLogDeliveryAccounts", (properties.DebugLogDeliveryAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DebugLogDeliveryAccounts) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inputParameters", "InputParameters", (properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined));
  ret.addPropertyResult("maximumExecutionFrequency", "MaximumExecutionFrequency", (properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined));
  ret.addPropertyResult("organizationConfigRuleTriggerTypes", "OrganizationConfigRuleTriggerTypes", (properties.OrganizationConfigRuleTriggerTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationConfigRuleTriggerTypes) : undefined));
  ret.addPropertyResult("policyText", "PolicyText", (properties.PolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyText) : undefined));
  ret.addPropertyResult("resourceIdScope", "ResourceIdScope", (properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined));
  ret.addPropertyResult("resourceTypesScope", "ResourceTypesScope", (properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypesScope) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addPropertyResult("tagKeyScope", "TagKeyScope", (properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined));
  ret.addPropertyResult("tagValueScope", "TagValueScope", (properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOrganizationConfigRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConfigRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConfigRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludedAccounts", cdk.listValidator(cdk.validateString))(properties.excludedAccounts));
  errors.collect(cdk.propertyValidator("organizationConfigRuleName", cdk.requiredValidator)(properties.organizationConfigRuleName));
  errors.collect(cdk.propertyValidator("organizationConfigRuleName", cdk.validateString)(properties.organizationConfigRuleName));
  errors.collect(cdk.propertyValidator("organizationCustomPolicyRuleMetadata", CfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyValidator)(properties.organizationCustomPolicyRuleMetadata));
  errors.collect(cdk.propertyValidator("organizationCustomRuleMetadata", CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyValidator)(properties.organizationCustomRuleMetadata));
  errors.collect(cdk.propertyValidator("organizationManagedRuleMetadata", CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyValidator)(properties.organizationManagedRuleMetadata));
  return errors.wrap("supplied properties not correct for \"CfnOrganizationConfigRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConfigRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConfigRulePropsValidator(properties).assertSuccess();
  return {
    "ExcludedAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedAccounts),
    "OrganizationConfigRuleName": cdk.stringToCloudFormation(properties.organizationConfigRuleName),
    "OrganizationCustomPolicyRuleMetadata": convertCfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyToCloudFormation(properties.organizationCustomPolicyRuleMetadata),
    "OrganizationCustomRuleMetadata": convertCfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyToCloudFormation(properties.organizationCustomRuleMetadata),
    "OrganizationManagedRuleMetadata": convertCfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyToCloudFormation(properties.organizationManagedRuleMetadata)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConfigRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRuleProps>();
  ret.addPropertyResult("excludedAccounts", "ExcludedAccounts", (properties.ExcludedAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedAccounts) : undefined));
  ret.addPropertyResult("organizationConfigRuleName", "OrganizationConfigRuleName", (properties.OrganizationConfigRuleName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationConfigRuleName) : undefined));
  ret.addPropertyResult("organizationCustomPolicyRuleMetadata", "OrganizationCustomPolicyRuleMetadata", (properties.OrganizationCustomPolicyRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationCustomPolicyRuleMetadataPropertyFromCloudFormation(properties.OrganizationCustomPolicyRuleMetadata) : undefined));
  ret.addPropertyResult("organizationCustomRuleMetadata", "OrganizationCustomRuleMetadata", (properties.OrganizationCustomRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyFromCloudFormation(properties.OrganizationCustomRuleMetadata) : undefined));
  ret.addPropertyResult("organizationManagedRuleMetadata", "OrganizationManagedRuleMetadata", (properties.OrganizationManagedRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyFromCloudFormation(properties.OrganizationManagedRuleMetadata) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * OrganizationConformancePack deploys conformance packs across member accounts in an AWS Organizations .
 *
 * OrganizationConformancePack enables organization service access for `config-multiaccountsetup.amazonaws.com` through the `EnableAWSServiceAccess` action and creates a service linked role in the master account of your organization. The service linked role is created only when the role does not exist in the master account.
 *
 * @cloudformationResource AWS::Config::OrganizationConformancePack
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html
 */
export class CfnOrganizationConformancePack extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::OrganizationConformancePack";

  /**
   * Build a CfnOrganizationConformancePack from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOrganizationConformancePack {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOrganizationConformancePackPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOrganizationConformancePack(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of `ConformancePackInputParameter` objects.
   */
  public conformancePackInputParameters?: Array<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
   */
  public deliveryS3Bucket?: string;

  /**
   * Any folder structure you want to add to an Amazon S3 bucket.
   */
  public deliveryS3KeyPrefix?: string;

  /**
   * A comma-separated list of accounts excluded from organization conformance pack.
   */
  public excludedAccounts?: Array<string>;

  /**
   * The name you assign to an organization conformance pack.
   */
  public organizationConformancePackName: string;

  /**
   * A string containing full conformance pack template body.
   */
  public templateBody?: string;

  /**
   * Location of file containing the template body.
   */
  public templateS3Uri?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOrganizationConformancePackProps) {
    super(scope, id, {
      "type": CfnOrganizationConformancePack.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "organizationConformancePackName", this);

    this.conformancePackInputParameters = props.conformancePackInputParameters;
    this.deliveryS3Bucket = props.deliveryS3Bucket;
    this.deliveryS3KeyPrefix = props.deliveryS3KeyPrefix;
    this.excludedAccounts = props.excludedAccounts;
    this.organizationConformancePackName = props.organizationConformancePackName;
    this.templateBody = props.templateBody;
    this.templateS3Uri = props.templateS3Uri;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "conformancePackInputParameters": this.conformancePackInputParameters,
      "deliveryS3Bucket": this.deliveryS3Bucket,
      "deliveryS3KeyPrefix": this.deliveryS3KeyPrefix,
      "excludedAccounts": this.excludedAccounts,
      "organizationConformancePackName": this.organizationConformancePackName,
      "templateBody": this.templateBody,
      "templateS3Uri": this.templateS3Uri
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOrganizationConformancePack.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOrganizationConformancePackPropsToCloudFormation(props);
  }
}

export namespace CfnOrganizationConformancePack {
  /**
   * Input parameters in the form of key-value pairs for the conformance pack, both of which you define.
   *
   * Keys can have a maximum character length of 255 characters, and values can have a maximum length of 4096 characters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html
   */
  export interface ConformancePackInputParameterProperty {
    /**
     * One part of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html#cfn-config-organizationconformancepack-conformancepackinputparameter-parametername
     */
    readonly parameterName: string;

    /**
     * One part of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html#cfn-config-organizationconformancepack-conformancepackinputparameter-parametervalue
     */
    readonly parameterValue: string;
  }
}

/**
 * Properties for defining a `CfnOrganizationConformancePack`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html
 */
export interface CfnOrganizationConformancePackProps {
  /**
   * A list of `ConformancePackInputParameter` objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-conformancepackinputparameters
   */
  readonly conformancePackInputParameters?: Array<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
   *
   * > This field is optional.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3bucket
   */
  readonly deliveryS3Bucket?: string;

  /**
   * Any folder structure you want to add to an Amazon S3 bucket.
   *
   * > This field is optional.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3keyprefix
   */
  readonly deliveryS3KeyPrefix?: string;

  /**
   * A comma-separated list of accounts excluded from organization conformance pack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-excludedaccounts
   */
  readonly excludedAccounts?: Array<string>;

  /**
   * The name you assign to an organization conformance pack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-organizationconformancepackname
   */
  readonly organizationConformancePackName: string;

  /**
   * A string containing full conformance pack template body.
   *
   * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templatebody
   */
  readonly templateBody?: string;

  /**
   * Location of file containing the template body.
   *
   * The uri must point to the conformance pack template (max size: 300 KB).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templates3uri
   */
  readonly templateS3Uri?: string;
}

/**
 * Determine whether the given properties match those of a `ConformancePackInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConformancePackConformancePackInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ConformancePackInputParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConformancePackConformancePackInputParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConformancePackConformancePackInputParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConformancePackConformancePackInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConformancePack.ConformancePackInputParameterProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOrganizationConformancePackProps`
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConformancePackProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationConformancePackPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conformancePackInputParameters", cdk.listValidator(CfnOrganizationConformancePackConformancePackInputParameterPropertyValidator))(properties.conformancePackInputParameters));
  errors.collect(cdk.propertyValidator("deliveryS3Bucket", cdk.validateString)(properties.deliveryS3Bucket));
  errors.collect(cdk.propertyValidator("deliveryS3KeyPrefix", cdk.validateString)(properties.deliveryS3KeyPrefix));
  errors.collect(cdk.propertyValidator("excludedAccounts", cdk.listValidator(cdk.validateString))(properties.excludedAccounts));
  errors.collect(cdk.propertyValidator("organizationConformancePackName", cdk.requiredValidator)(properties.organizationConformancePackName));
  errors.collect(cdk.propertyValidator("organizationConformancePackName", cdk.validateString)(properties.organizationConformancePackName));
  errors.collect(cdk.propertyValidator("templateBody", cdk.validateString)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateS3Uri", cdk.validateString)(properties.templateS3Uri));
  return errors.wrap("supplied properties not correct for \"CfnOrganizationConformancePackProps\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationConformancePackPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationConformancePackPropsValidator(properties).assertSuccess();
  return {
    "ConformancePackInputParameters": cdk.listMapper(convertCfnOrganizationConformancePackConformancePackInputParameterPropertyToCloudFormation)(properties.conformancePackInputParameters),
    "DeliveryS3Bucket": cdk.stringToCloudFormation(properties.deliveryS3Bucket),
    "DeliveryS3KeyPrefix": cdk.stringToCloudFormation(properties.deliveryS3KeyPrefix),
    "ExcludedAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedAccounts),
    "OrganizationConformancePackName": cdk.stringToCloudFormation(properties.organizationConformancePackName),
    "TemplateBody": cdk.stringToCloudFormation(properties.templateBody),
    "TemplateS3Uri": cdk.stringToCloudFormation(properties.templateS3Uri)
  };
}

// @ts-ignore TS6133
function CfnOrganizationConformancePackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConformancePackProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConformancePackProps>();
  ret.addPropertyResult("conformancePackInputParameters", "ConformancePackInputParameters", (properties.ConformancePackInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnOrganizationConformancePackConformancePackInputParameterPropertyFromCloudFormation)(properties.ConformancePackInputParameters) : undefined));
  ret.addPropertyResult("deliveryS3Bucket", "DeliveryS3Bucket", (properties.DeliveryS3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3Bucket) : undefined));
  ret.addPropertyResult("deliveryS3KeyPrefix", "DeliveryS3KeyPrefix", (properties.DeliveryS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3KeyPrefix) : undefined));
  ret.addPropertyResult("excludedAccounts", "ExcludedAccounts", (properties.ExcludedAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedAccounts) : undefined));
  ret.addPropertyResult("organizationConformancePackName", "OrganizationConformancePackName", (properties.OrganizationConformancePackName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationConformancePackName) : undefined));
  ret.addPropertyResult("templateBody", "TemplateBody", (properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined));
  ret.addPropertyResult("templateS3Uri", "TemplateS3Uri", (properties.TemplateS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateS3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An object that represents the details about the remediation configuration that includes the remediation action, parameters, and data to execute the action.
 *
 * @cloudformationResource AWS::Config::RemediationConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html
 */
export class CfnRemediationConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::RemediationConfiguration";

  /**
   * Build a CfnRemediationConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRemediationConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRemediationConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRemediationConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The remediation is triggered automatically.
   */
  public automatic?: boolean | cdk.IResolvable;

  /**
   * The name of the AWS Config rule.
   */
  public configRuleName: string;

  /**
   * An ExecutionControls object.
   */
  public executionControls?: CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable;

  /**
   * The maximum number of failed attempts for auto-remediation. If you do not select a number, the default is 5.
   */
  public maximumAutomaticAttempts?: number;

  /**
   * An object of the RemediationParameterValue. For more information, see [RemediationParameterValue](https://docs.aws.amazon.com/config/latest/APIReference/API_RemediationParameterValue.html) .
   */
  public parameters?: any | cdk.IResolvable;

  /**
   * The type of a resource.
   */
  public resourceType?: string;

  /**
   * Time window to determine whether or not to add a remediation exception to prevent infinite remediation attempts.
   */
  public retryAttemptSeconds?: number;

  /**
   * Target ID is the name of the SSM document.
   */
  public targetId: string;

  /**
   * The type of the target.
   */
  public targetType: string;

  /**
   * Version of the target. For example, version of the SSM document.
   */
  public targetVersion?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRemediationConfigurationProps) {
    super(scope, id, {
      "type": CfnRemediationConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configRuleName", this);
    cdk.requireProperty(props, "targetId", this);
    cdk.requireProperty(props, "targetType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.automatic = props.automatic;
    this.configRuleName = props.configRuleName;
    this.executionControls = props.executionControls;
    this.maximumAutomaticAttempts = props.maximumAutomaticAttempts;
    this.parameters = props.parameters;
    this.resourceType = props.resourceType;
    this.retryAttemptSeconds = props.retryAttemptSeconds;
    this.targetId = props.targetId;
    this.targetType = props.targetType;
    this.targetVersion = props.targetVersion;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "automatic": this.automatic,
      "configRuleName": this.configRuleName,
      "executionControls": this.executionControls,
      "maximumAutomaticAttempts": this.maximumAutomaticAttempts,
      "parameters": this.parameters,
      "resourceType": this.resourceType,
      "retryAttemptSeconds": this.retryAttemptSeconds,
      "targetId": this.targetId,
      "targetType": this.targetType,
      "targetVersion": this.targetVersion
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRemediationConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRemediationConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnRemediationConfiguration {
  /**
   * An ExecutionControls object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-executioncontrols.html
   */
  export interface ExecutionControlsProperty {
    /**
     * A SsmControls object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-executioncontrols.html#cfn-config-remediationconfiguration-executioncontrols-ssmcontrols
     */
    readonly ssmControls?: cdk.IResolvable | CfnRemediationConfiguration.SsmControlsProperty;
  }

  /**
   * AWS Systems Manager (SSM) specific remediation controls.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html
   */
  export interface SsmControlsProperty {
    /**
     * The maximum percentage of remediation actions allowed to run in parallel on the non-compliant resources for that specific rule.
     *
     * You can specify a percentage, such as 10%. The default value is 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html#cfn-config-remediationconfiguration-ssmcontrols-concurrentexecutionratepercentage
     */
    readonly concurrentExecutionRatePercentage?: number;

    /**
     * The percentage of errors that are allowed before SSM stops running automations on non-compliant resources for that specific rule.
     *
     * You can specify a percentage of errors, for example 10%. If you do not specifiy a percentage, the default is 50%. For example, if you set the ErrorPercentage to 40% for 10 non-compliant resources, then SSM stops running the automations when the fifth error is received.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html#cfn-config-remediationconfiguration-ssmcontrols-errorpercentage
     */
    readonly errorPercentage?: number;
  }

  /**
   * The value is either a dynamic (resource) value or a static value.
   *
   * You must select either a dynamic value or a static value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html
   */
  export interface RemediationParameterValueProperty {
    /**
     * The value is dynamic and changes at run-time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html#cfn-config-remediationconfiguration-remediationparametervalue-resourcevalue
     */
    readonly resourceValue?: cdk.IResolvable | CfnRemediationConfiguration.ResourceValueProperty;

    /**
     * The value is static and does not change at run-time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html#cfn-config-remediationconfiguration-remediationparametervalue-staticvalue
     */
    readonly staticValue?: cdk.IResolvable | CfnRemediationConfiguration.StaticValueProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-resourcevalue.html
   */
  export interface ResourceValueProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-resourcevalue.html#cfn-config-remediationconfiguration-resourcevalue-value
     */
    readonly value?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-staticvalue.html
   */
  export interface StaticValueProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-staticvalue.html#cfn-config-remediationconfiguration-staticvalue-value
     */
    readonly value?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-staticvalue.html#cfn-config-remediationconfiguration-staticvalue-values
     */
    readonly values?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnRemediationConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html
 */
export interface CfnRemediationConfigurationProps {
  /**
   * The remediation is triggered automatically.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-automatic
   */
  readonly automatic?: boolean | cdk.IResolvable;

  /**
   * The name of the AWS Config rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-configrulename
   */
  readonly configRuleName: string;

  /**
   * An ExecutionControls object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-executioncontrols
   */
  readonly executionControls?: CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable;

  /**
   * The maximum number of failed attempts for auto-remediation. If you do not select a number, the default is 5.
   *
   * For example, if you specify MaximumAutomaticAttempts as 5 with RetryAttemptSeconds as 50 seconds, AWS Config will put a RemediationException on your behalf for the failing resource after the 5th failed attempt within 50 seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-maximumautomaticattempts
   */
  readonly maximumAutomaticAttempts?: number;

  /**
   * An object of the RemediationParameterValue. For more information, see [RemediationParameterValue](https://docs.aws.amazon.com/config/latest/APIReference/API_RemediationParameterValue.html) .
   *
   * > The type is a map of strings to RemediationParameterValue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * The type of a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-resourcetype
   */
  readonly resourceType?: string;

  /**
   * Time window to determine whether or not to add a remediation exception to prevent infinite remediation attempts.
   *
   * If `MaximumAutomaticAttempts` remediation attempts have been made under `RetryAttemptSeconds` , a remediation exception will be added to the resource. If you do not select a number, the default is 60 seconds.
   *
   * For example, if you specify `RetryAttemptSeconds` as 50 seconds and `MaximumAutomaticAttempts` as 5, AWS Config will run auto-remediations 5 times within 50 seconds before adding a remediation exception to the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-retryattemptseconds
   */
  readonly retryAttemptSeconds?: number;

  /**
   * Target ID is the name of the SSM document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetid
   */
  readonly targetId: string;

  /**
   * The type of the target.
   *
   * Target executes remediation. For example, SSM document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targettype
   */
  readonly targetType: string;

  /**
   * Version of the target. For example, version of the SSM document.
   *
   * > If you make backward incompatible changes to the SSM document, you must call PutRemediationConfiguration API again to ensure the remediations can run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetversion
   */
  readonly targetVersion?: string;
}

/**
 * Determine whether the given properties match those of a `SsmControlsProperty`
 *
 * @param properties - the TypeScript properties of a `SsmControlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationSsmControlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("concurrentExecutionRatePercentage", cdk.validateNumber)(properties.concurrentExecutionRatePercentage));
  errors.collect(cdk.propertyValidator("errorPercentage", cdk.validateNumber)(properties.errorPercentage));
  return errors.wrap("supplied properties not correct for \"SsmControlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationSsmControlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationSsmControlsPropertyValidator(properties).assertSuccess();
  return {
    "ConcurrentExecutionRatePercentage": cdk.numberToCloudFormation(properties.concurrentExecutionRatePercentage),
    "ErrorPercentage": cdk.numberToCloudFormation(properties.errorPercentage)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationSsmControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRemediationConfiguration.SsmControlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.SsmControlsProperty>();
  ret.addPropertyResult("concurrentExecutionRatePercentage", "ConcurrentExecutionRatePercentage", (properties.ConcurrentExecutionRatePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConcurrentExecutionRatePercentage) : undefined));
  ret.addPropertyResult("errorPercentage", "ErrorPercentage", (properties.ErrorPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecutionControlsProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionControlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationExecutionControlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ssmControls", CfnRemediationConfigurationSsmControlsPropertyValidator)(properties.ssmControls));
  return errors.wrap("supplied properties not correct for \"ExecutionControlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationExecutionControlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationExecutionControlsPropertyValidator(properties).assertSuccess();
  return {
    "SsmControls": convertCfnRemediationConfigurationSsmControlsPropertyToCloudFormation(properties.ssmControls)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationExecutionControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.ExecutionControlsProperty>();
  ret.addPropertyResult("ssmControls", "SsmControls", (properties.SsmControls != null ? CfnRemediationConfigurationSsmControlsPropertyFromCloudFormation(properties.SsmControls) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceValueProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationResourceValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ResourceValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationResourceValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationResourceValuePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationResourceValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRemediationConfiguration.ResourceValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.ResourceValueProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StaticValueProperty`
 *
 * @param properties - the TypeScript properties of a `StaticValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationStaticValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"StaticValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationStaticValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationStaticValuePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationStaticValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRemediationConfiguration.StaticValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.StaticValueProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RemediationParameterValueProperty`
 *
 * @param properties - the TypeScript properties of a `RemediationParameterValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationRemediationParameterValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceValue", CfnRemediationConfigurationResourceValuePropertyValidator)(properties.resourceValue));
  errors.collect(cdk.propertyValidator("staticValue", CfnRemediationConfigurationStaticValuePropertyValidator)(properties.staticValue));
  return errors.wrap("supplied properties not correct for \"RemediationParameterValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationRemediationParameterValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationRemediationParameterValuePropertyValidator(properties).assertSuccess();
  return {
    "ResourceValue": convertCfnRemediationConfigurationResourceValuePropertyToCloudFormation(properties.resourceValue),
    "StaticValue": convertCfnRemediationConfigurationStaticValuePropertyToCloudFormation(properties.staticValue)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationRemediationParameterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRemediationConfiguration.RemediationParameterValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.RemediationParameterValueProperty>();
  ret.addPropertyResult("resourceValue", "ResourceValue", (properties.ResourceValue != null ? CfnRemediationConfigurationResourceValuePropertyFromCloudFormation(properties.ResourceValue) : undefined));
  ret.addPropertyResult("staticValue", "StaticValue", (properties.StaticValue != null ? CfnRemediationConfigurationStaticValuePropertyFromCloudFormation(properties.StaticValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRemediationConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRemediationConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRemediationConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automatic", cdk.validateBoolean)(properties.automatic));
  errors.collect(cdk.propertyValidator("configRuleName", cdk.requiredValidator)(properties.configRuleName));
  errors.collect(cdk.propertyValidator("configRuleName", cdk.validateString)(properties.configRuleName));
  errors.collect(cdk.propertyValidator("executionControls", CfnRemediationConfigurationExecutionControlsPropertyValidator)(properties.executionControls));
  errors.collect(cdk.propertyValidator("maximumAutomaticAttempts", cdk.validateNumber)(properties.maximumAutomaticAttempts));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("retryAttemptSeconds", cdk.validateNumber)(properties.retryAttemptSeconds));
  errors.collect(cdk.propertyValidator("targetId", cdk.requiredValidator)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetId", cdk.validateString)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetType", cdk.requiredValidator)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetVersion", cdk.validateString)(properties.targetVersion));
  return errors.wrap("supplied properties not correct for \"CfnRemediationConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnRemediationConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRemediationConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Automatic": cdk.booleanToCloudFormation(properties.automatic),
    "ConfigRuleName": cdk.stringToCloudFormation(properties.configRuleName),
    "ExecutionControls": convertCfnRemediationConfigurationExecutionControlsPropertyToCloudFormation(properties.executionControls),
    "MaximumAutomaticAttempts": cdk.numberToCloudFormation(properties.maximumAutomaticAttempts),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "RetryAttemptSeconds": cdk.numberToCloudFormation(properties.retryAttemptSeconds),
    "TargetId": cdk.stringToCloudFormation(properties.targetId),
    "TargetType": cdk.stringToCloudFormation(properties.targetType),
    "TargetVersion": cdk.stringToCloudFormation(properties.targetVersion)
  };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfigurationProps>();
  ret.addPropertyResult("automatic", "Automatic", (properties.Automatic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Automatic) : undefined));
  ret.addPropertyResult("configRuleName", "ConfigRuleName", (properties.ConfigRuleName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigRuleName) : undefined));
  ret.addPropertyResult("executionControls", "ExecutionControls", (properties.ExecutionControls != null ? CfnRemediationConfigurationExecutionControlsPropertyFromCloudFormation(properties.ExecutionControls) : undefined));
  ret.addPropertyResult("maximumAutomaticAttempts", "MaximumAutomaticAttempts", (properties.MaximumAutomaticAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumAutomaticAttempts) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("retryAttemptSeconds", "RetryAttemptSeconds", (properties.RetryAttemptSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryAttemptSeconds) : undefined));
  ret.addPropertyResult("targetId", "TargetId", (properties.TargetId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetId) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addPropertyResult("targetVersion", "TargetVersion", (properties.TargetVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TargetVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Provides the details of a stored query.
 *
 * @cloudformationResource AWS::Config::StoredQuery
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html
 */
export class CfnStoredQuery extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Config::StoredQuery";

  /**
   * Build a CfnStoredQuery from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStoredQuery {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStoredQueryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStoredQuery(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Amazon Resource Name (ARN) of the query. For example, arn:partition:service:region:account-id:resource-type/resource-name/resource-id.
   *
   * @cloudformationAttribute QueryArn
   */
  public readonly attrQueryArn: string;

  /**
   * The ID of the query.
   *
   * @cloudformationAttribute QueryId
   */
  public readonly attrQueryId: string;

  /**
   * A unique description for the query.
   */
  public queryDescription?: string;

  /**
   * The expression of the query.
   */
  public queryExpression: string;

  /**
   * The name of the query.
   */
  public queryName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStoredQueryProps) {
    super(scope, id, {
      "type": CfnStoredQuery.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "queryExpression", this);
    cdk.requireProperty(props, "queryName", this);

    this.attrQueryArn = cdk.Token.asString(this.getAtt("QueryArn", cdk.ResolutionTypeHint.STRING));
    this.attrQueryId = cdk.Token.asString(this.getAtt("QueryId", cdk.ResolutionTypeHint.STRING));
    this.queryDescription = props.queryDescription;
    this.queryExpression = props.queryExpression;
    this.queryName = props.queryName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::StoredQuery", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "queryDescription": this.queryDescription,
      "queryExpression": this.queryExpression,
      "queryName": this.queryName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStoredQuery.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStoredQueryPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStoredQuery`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html
 */
export interface CfnStoredQueryProps {
  /**
   * A unique description for the query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-querydescription
   */
  readonly queryDescription?: string;

  /**
   * The expression of the query.
   *
   * For example, `SELECT resourceId, resourceType, supplementaryConfiguration.BucketVersioningConfiguration.status WHERE resourceType = 'AWS::S3::Bucket' AND supplementaryConfiguration.BucketVersioningConfiguration.status = 'Off'.`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryexpression
   */
  readonly queryExpression: string;

  /**
   * The name of the query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryname
   */
  readonly queryName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnStoredQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnStoredQueryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStoredQueryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryDescription", cdk.validateString)(properties.queryDescription));
  errors.collect(cdk.propertyValidator("queryExpression", cdk.requiredValidator)(properties.queryExpression));
  errors.collect(cdk.propertyValidator("queryExpression", cdk.validateString)(properties.queryExpression));
  errors.collect(cdk.propertyValidator("queryName", cdk.requiredValidator)(properties.queryName));
  errors.collect(cdk.propertyValidator("queryName", cdk.validateString)(properties.queryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStoredQueryProps\"");
}

// @ts-ignore TS6133
function convertCfnStoredQueryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStoredQueryPropsValidator(properties).assertSuccess();
  return {
    "QueryDescription": cdk.stringToCloudFormation(properties.queryDescription),
    "QueryExpression": cdk.stringToCloudFormation(properties.queryExpression),
    "QueryName": cdk.stringToCloudFormation(properties.queryName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStoredQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStoredQueryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStoredQueryProps>();
  ret.addPropertyResult("queryDescription", "QueryDescription", (properties.QueryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.QueryDescription) : undefined));
  ret.addPropertyResult("queryExpression", "QueryExpression", (properties.QueryExpression != null ? cfn_parse.FromCloudFormation.getString(properties.QueryExpression) : undefined));
  ret.addPropertyResult("queryName", "QueryName", (properties.QueryName != null ? cfn_parse.FromCloudFormation.getString(properties.QueryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}