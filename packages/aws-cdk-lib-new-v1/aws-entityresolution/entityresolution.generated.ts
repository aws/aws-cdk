/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a `MatchingWorkflow` object which stores the configuration of the data processing job to be run.
 *
 * It is important to note that there should not be a pre-existing `MatchingWorkflow` with the same name. To modify an existing workflow, utilize the `UpdateMatchingWorkflow` API.
 *
 * @cloudformationResource AWS::EntityResolution::MatchingWorkflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html
 */
export class CfnMatchingWorkflow extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EntityResolution::MatchingWorkflow";

  /**
   * Build a CfnMatchingWorkflow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMatchingWorkflow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMatchingWorkflowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMatchingWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time of this MatchingWorkflow got created
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The time of this MatchingWorkflow got last updated at
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The default MatchingWorkflow arn
   *
   * @cloudformationAttribute WorkflowArn
   */
  public readonly attrWorkflowArn: string;

  /**
   * A description of the workflow.
   */
  public description?: string;

  /**
   * A list of `InputSource` objects, which have the fields `InputSourceARN` and `SchemaName` .
   */
  public inputSourceConfig: Array<CfnMatchingWorkflow.InputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of `OutputSource` objects, each of which contains fields `OutputS3Path` , `ApplyNormalization` , and `Output` .
   */
  public outputSourceConfig: Array<cdk.IResolvable | CfnMatchingWorkflow.OutputSourceProperty> | cdk.IResolvable;

  /**
   * An object which defines the `resolutionType` and the `ruleBasedProperties` .
   */
  public resolutionTechniques: cdk.IResolvable | CfnMatchingWorkflow.ResolutionTechniquesProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role.
   */
  public roleArn: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name of the workflow.
   */
  public workflowName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMatchingWorkflowProps) {
    super(scope, id, {
      "type": CfnMatchingWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "inputSourceConfig", this);
    cdk.requireProperty(props, "outputSourceConfig", this);
    cdk.requireProperty(props, "resolutionTechniques", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "workflowName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrWorkflowArn = cdk.Token.asString(this.getAtt("WorkflowArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.inputSourceConfig = props.inputSourceConfig;
    this.outputSourceConfig = props.outputSourceConfig;
    this.resolutionTechniques = props.resolutionTechniques;
    this.roleArn = props.roleArn;
    this.tags = props.tags;
    this.workflowName = props.workflowName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "inputSourceConfig": this.inputSourceConfig,
      "outputSourceConfig": this.outputSourceConfig,
      "resolutionTechniques": this.resolutionTechniques,
      "roleArn": this.roleArn,
      "tags": this.tags,
      "workflowName": this.workflowName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMatchingWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMatchingWorkflowPropsToCloudFormation(props);
  }
}

export namespace CfnMatchingWorkflow {
  /**
   * An object which defines the `resolutionType` and the `ruleBasedProperties` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-resolutiontechniques.html
   */
  export interface ResolutionTechniquesProperty {
    /**
     * The properties of the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-resolutiontechniques.html#cfn-entityresolution-matchingworkflow-resolutiontechniques-providerproperties
     */
    readonly providerProperties?: cdk.IResolvable | CfnMatchingWorkflow.ProviderPropertiesProperty;

    /**
     * The type of matching.
     *
     * There are two types of matching: `RULE_MATCHING` and `ML_MATCHING` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-resolutiontechniques.html#cfn-entityresolution-matchingworkflow-resolutiontechniques-resolutiontype
     */
    readonly resolutionType?: string;

    /**
     * An object which defines the list of matching rules to run and has a field `Rules` , which is a list of rule objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-resolutiontechniques.html#cfn-entityresolution-matchingworkflow-resolutiontechniques-rulebasedproperties
     */
    readonly ruleBasedProperties?: cdk.IResolvable | CfnMatchingWorkflow.RuleBasedPropertiesProperty;
  }

  /**
   * An object which defines the list of matching rules to run and has a field `Rules` , which is a list of rule objects.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rulebasedproperties.html
   */
  export interface RuleBasedPropertiesProperty {
    /**
     * The comparison type.
     *
     * You can either choose `ONE_TO_ONE` or `MANY_TO_MANY` as the AttributeMatchingModel. When choosing `MANY_TO_MANY` , the system can match attributes across the sub-types of an attribute type. For example, if the value of the `Email` field of Profile A and the value of `BusinessEmail` field of Profile B matches, the two profiles are matched on the `Email` type. When choosing `ONE_TO_ONE` ,the system can only match if the sub-types are exact matches. For example, only when the value of the `Email` field of Profile A and the value of the `Email` field of Profile B matches, the two profiles are matched on the `Email` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rulebasedproperties.html#cfn-entityresolution-matchingworkflow-rulebasedproperties-attributematchingmodel
     */
    readonly attributeMatchingModel: string;

    /**
     * A list of `Rule` objects, each of which have fields `RuleName` and `MatchingKeys` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rulebasedproperties.html#cfn-entityresolution-matchingworkflow-rulebasedproperties-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnMatchingWorkflow.RuleProperty> | cdk.IResolvable;
  }

  /**
   * An object containing `RuleName` , and `MatchingKeys` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rule.html
   */
  export interface RuleProperty {
    /**
     * A list of `MatchingKeys` .
     *
     * The `MatchingKeys` must have been defined in the `SchemaMapping` . Two records are considered to match according to this rule if all of the `MatchingKeys` match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rule.html#cfn-entityresolution-matchingworkflow-rule-matchingkeys
     */
    readonly matchingKeys: Array<string>;

    /**
     * A name for the matching rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-rule.html#cfn-entityresolution-matchingworkflow-rule-rulename
     */
    readonly ruleName: string;
  }

  /**
   * An object containing the `providerServiceARN` , `intermediateSourceConfiguration` , and `providerConfiguration` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-providerproperties.html
   */
  export interface ProviderPropertiesProperty {
    /**
     * The Amazon S3 location that temporarily stores your data while it processes.
     *
     * Your information won't be saved permanently.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-providerproperties.html#cfn-entityresolution-matchingworkflow-providerproperties-intermediatesourceconfiguration
     */
    readonly intermediateSourceConfiguration?: CfnMatchingWorkflow.IntermediateSourceConfigurationProperty | cdk.IResolvable;

    /**
     * The required configuration fields to use with the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-providerproperties.html#cfn-entityresolution-matchingworkflow-providerproperties-providerconfiguration
     */
    readonly providerConfiguration?: cdk.IResolvable | Record<string, string>;

    /**
     * The ARN of the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-providerproperties.html#cfn-entityresolution-matchingworkflow-providerproperties-providerservicearn
     */
    readonly providerServiceArn: string;
  }

  /**
   * The Amazon S3 location that temporarily stores your data while it processes.
   *
   * Your information won't be saved permanently.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-intermediatesourceconfiguration.html
   */
  export interface IntermediateSourceConfigurationProperty {
    /**
     * The Amazon S3 location (bucket and prefix).
     *
     * For example: `s3://provider_bucket/DOC-EXAMPLE-BUCKET`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-intermediatesourceconfiguration.html#cfn-entityresolution-matchingworkflow-intermediatesourceconfiguration-intermediates3path
     */
    readonly intermediateS3Path: string;
  }

  /**
   * An object containing `InputSourceARN` , `SchemaName` , and `ApplyNormalization` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-inputsource.html
   */
  export interface InputSourceProperty {
    /**
     * Normalizes the attributes defined in the schema in the input data.
     *
     * For example, if an attribute has an `AttributeType` of `PHONE_NUMBER` , and the data in the input table is in a format of 1234567890, AWS Entity Resolution will normalize this field in the output to (123)-456-7890.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-inputsource.html#cfn-entityresolution-matchingworkflow-inputsource-applynormalization
     */
    readonly applyNormalization?: boolean | cdk.IResolvable;

    /**
     * An object containing `InputSourceARN` , `SchemaName` , and `ApplyNormalization` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-inputsource.html#cfn-entityresolution-matchingworkflow-inputsource-inputsourcearn
     */
    readonly inputSourceArn: string;

    /**
     * The name of the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-inputsource.html#cfn-entityresolution-matchingworkflow-inputsource-schemaarn
     */
    readonly schemaArn: string;
  }

  /**
   * A list of `OutputAttribute` objects, each of which have the fields `Name` and `Hashed` .
   *
   * Each of these objects selects a column to be included in the output table, and whether the values of the column should be hashed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputsource.html
   */
  export interface OutputSourceProperty {
    /**
     * Normalizes the attributes defined in the schema in the input data.
     *
     * For example, if an attribute has an `AttributeType` of `PHONE_NUMBER` , and the data in the input table is in a format of 1234567890, AWS Entity Resolution will normalize this field in the output to (123)-456-7890.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputsource.html#cfn-entityresolution-matchingworkflow-outputsource-applynormalization
     */
    readonly applyNormalization?: boolean | cdk.IResolvable;

    /**
     * Customer KMS ARN for encryption at rest.
     *
     * If not provided, system will use an AWS Entity Resolution managed KMS key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputsource.html#cfn-entityresolution-matchingworkflow-outputsource-kmsarn
     */
    readonly kmsArn?: string;

    /**
     * A list of `OutputAttribute` objects, each of which have the fields `Name` and `Hashed` .
     *
     * Each of these objects selects a column to be included in the output table, and whether the values of the column should be hashed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputsource.html#cfn-entityresolution-matchingworkflow-outputsource-output
     */
    readonly output: Array<cdk.IResolvable | CfnMatchingWorkflow.OutputAttributeProperty> | cdk.IResolvable;

    /**
     * The S3 path to which AWS Entity Resolution will write the output table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputsource.html#cfn-entityresolution-matchingworkflow-outputsource-outputs3path
     */
    readonly outputS3Path: string;
  }

  /**
   * A list of `OutputAttribute` objects, each of which have the fields `Name` and `Hashed` .
   *
   * Each of these objects selects a column to be included in the output table, and whether the values of the column should be hashed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputattribute.html
   */
  export interface OutputAttributeProperty {
    /**
     * Enables the ability to hash the column values in the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputattribute.html#cfn-entityresolution-matchingworkflow-outputattribute-hashed
     */
    readonly hashed?: boolean | cdk.IResolvable;

    /**
     * A name of a column to be written to the output.
     *
     * This must be an `InputField` name in the schema mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-matchingworkflow-outputattribute.html#cfn-entityresolution-matchingworkflow-outputattribute-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnMatchingWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html
 */
export interface CfnMatchingWorkflowProps {
  /**
   * A description of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-description
   */
  readonly description?: string;

  /**
   * A list of `InputSource` objects, which have the fields `InputSourceARN` and `SchemaName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-inputsourceconfig
   */
  readonly inputSourceConfig: Array<CfnMatchingWorkflow.InputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of `OutputSource` objects, each of which contains fields `OutputS3Path` , `ApplyNormalization` , and `Output` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-outputsourceconfig
   */
  readonly outputSourceConfig: Array<cdk.IResolvable | CfnMatchingWorkflow.OutputSourceProperty> | cdk.IResolvable;

  /**
   * An object which defines the `resolutionType` and the `ruleBasedProperties` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-resolutiontechniques
   */
  readonly resolutionTechniques: cdk.IResolvable | CfnMatchingWorkflow.ResolutionTechniquesProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role.
   *
   * AWS Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-rolearn
   */
  readonly roleArn: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the workflow.
   *
   * There can't be multiple `MatchingWorkflows` with the same name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-matchingworkflow.html#cfn-entityresolution-matchingworkflow-workflowname
   */
  readonly workflowName: string;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchingKeys", cdk.requiredValidator)(properties.matchingKeys));
  errors.collect(cdk.propertyValidator("matchingKeys", cdk.listValidator(cdk.validateString))(properties.matchingKeys));
  errors.collect(cdk.propertyValidator("ruleName", cdk.requiredValidator)(properties.ruleName));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowRulePropertyValidator(properties).assertSuccess();
  return {
    "MatchingKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchingKeys),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.RuleProperty>();
  ret.addPropertyResult("matchingKeys", "MatchingKeys", (properties.MatchingKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchingKeys) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleBasedPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `RuleBasedPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowRuleBasedPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeMatchingModel", cdk.requiredValidator)(properties.attributeMatchingModel));
  errors.collect(cdk.propertyValidator("attributeMatchingModel", cdk.validateString)(properties.attributeMatchingModel));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnMatchingWorkflowRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"RuleBasedPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowRuleBasedPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowRuleBasedPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "AttributeMatchingModel": cdk.stringToCloudFormation(properties.attributeMatchingModel),
    "Rules": cdk.listMapper(convertCfnMatchingWorkflowRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowRuleBasedPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.RuleBasedPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.RuleBasedPropertiesProperty>();
  ret.addPropertyResult("attributeMatchingModel", "AttributeMatchingModel", (properties.AttributeMatchingModel != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeMatchingModel) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnMatchingWorkflowRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntermediateSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IntermediateSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowIntermediateSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intermediateS3Path", cdk.requiredValidator)(properties.intermediateS3Path));
  errors.collect(cdk.propertyValidator("intermediateS3Path", cdk.validateString)(properties.intermediateS3Path));
  return errors.wrap("supplied properties not correct for \"IntermediateSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowIntermediateSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowIntermediateSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "IntermediateS3Path": cdk.stringToCloudFormation(properties.intermediateS3Path)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowIntermediateSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchingWorkflow.IntermediateSourceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.IntermediateSourceConfigurationProperty>();
  ret.addPropertyResult("intermediateS3Path", "IntermediateS3Path", (properties.IntermediateS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.IntermediateS3Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProviderPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ProviderPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowProviderPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intermediateSourceConfiguration", CfnMatchingWorkflowIntermediateSourceConfigurationPropertyValidator)(properties.intermediateSourceConfiguration));
  errors.collect(cdk.propertyValidator("providerConfiguration", cdk.hashValidator(cdk.validateString))(properties.providerConfiguration));
  errors.collect(cdk.propertyValidator("providerServiceArn", cdk.requiredValidator)(properties.providerServiceArn));
  errors.collect(cdk.propertyValidator("providerServiceArn", cdk.validateString)(properties.providerServiceArn));
  return errors.wrap("supplied properties not correct for \"ProviderPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowProviderPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowProviderPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "IntermediateSourceConfiguration": convertCfnMatchingWorkflowIntermediateSourceConfigurationPropertyToCloudFormation(properties.intermediateSourceConfiguration),
    "ProviderConfiguration": cdk.hashMapper(cdk.stringToCloudFormation)(properties.providerConfiguration),
    "ProviderServiceArn": cdk.stringToCloudFormation(properties.providerServiceArn)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowProviderPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.ProviderPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.ProviderPropertiesProperty>();
  ret.addPropertyResult("intermediateSourceConfiguration", "IntermediateSourceConfiguration", (properties.IntermediateSourceConfiguration != null ? CfnMatchingWorkflowIntermediateSourceConfigurationPropertyFromCloudFormation(properties.IntermediateSourceConfiguration) : undefined));
  ret.addPropertyResult("providerConfiguration", "ProviderConfiguration", (properties.ProviderConfiguration != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ProviderConfiguration) : undefined));
  ret.addPropertyResult("providerServiceArn", "ProviderServiceArn", (properties.ProviderServiceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderServiceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResolutionTechniquesProperty`
 *
 * @param properties - the TypeScript properties of a `ResolutionTechniquesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowResolutionTechniquesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("providerProperties", CfnMatchingWorkflowProviderPropertiesPropertyValidator)(properties.providerProperties));
  errors.collect(cdk.propertyValidator("resolutionType", cdk.validateString)(properties.resolutionType));
  errors.collect(cdk.propertyValidator("ruleBasedProperties", CfnMatchingWorkflowRuleBasedPropertiesPropertyValidator)(properties.ruleBasedProperties));
  return errors.wrap("supplied properties not correct for \"ResolutionTechniquesProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowResolutionTechniquesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowResolutionTechniquesPropertyValidator(properties).assertSuccess();
  return {
    "ProviderProperties": convertCfnMatchingWorkflowProviderPropertiesPropertyToCloudFormation(properties.providerProperties),
    "ResolutionType": cdk.stringToCloudFormation(properties.resolutionType),
    "RuleBasedProperties": convertCfnMatchingWorkflowRuleBasedPropertiesPropertyToCloudFormation(properties.ruleBasedProperties)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowResolutionTechniquesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.ResolutionTechniquesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.ResolutionTechniquesProperty>();
  ret.addPropertyResult("providerProperties", "ProviderProperties", (properties.ProviderProperties != null ? CfnMatchingWorkflowProviderPropertiesPropertyFromCloudFormation(properties.ProviderProperties) : undefined));
  ret.addPropertyResult("resolutionType", "ResolutionType", (properties.ResolutionType != null ? cfn_parse.FromCloudFormation.getString(properties.ResolutionType) : undefined));
  ret.addPropertyResult("ruleBasedProperties", "RuleBasedProperties", (properties.RuleBasedProperties != null ? CfnMatchingWorkflowRuleBasedPropertiesPropertyFromCloudFormation(properties.RuleBasedProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputSourceProperty`
 *
 * @param properties - the TypeScript properties of a `InputSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowInputSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applyNormalization", cdk.validateBoolean)(properties.applyNormalization));
  errors.collect(cdk.propertyValidator("inputSourceArn", cdk.requiredValidator)(properties.inputSourceArn));
  errors.collect(cdk.propertyValidator("inputSourceArn", cdk.validateString)(properties.inputSourceArn));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.requiredValidator)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  return errors.wrap("supplied properties not correct for \"InputSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowInputSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowInputSourcePropertyValidator(properties).assertSuccess();
  return {
    "ApplyNormalization": cdk.booleanToCloudFormation(properties.applyNormalization),
    "InputSourceARN": cdk.stringToCloudFormation(properties.inputSourceArn),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowInputSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchingWorkflow.InputSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.InputSourceProperty>();
  ret.addPropertyResult("applyNormalization", "ApplyNormalization", (properties.ApplyNormalization != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplyNormalization) : undefined));
  ret.addPropertyResult("inputSourceArn", "InputSourceARN", (properties.InputSourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.InputSourceARN) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `OutputAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowOutputAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hashed", cdk.validateBoolean)(properties.hashed));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"OutputAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowOutputAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowOutputAttributePropertyValidator(properties).assertSuccess();
  return {
    "Hashed": cdk.booleanToCloudFormation(properties.hashed),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowOutputAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.OutputAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.OutputAttributeProperty>();
  ret.addPropertyResult("hashed", "Hashed", (properties.Hashed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Hashed) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputSourceProperty`
 *
 * @param properties - the TypeScript properties of a `OutputSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowOutputSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applyNormalization", cdk.validateBoolean)(properties.applyNormalization));
  errors.collect(cdk.propertyValidator("kmsArn", cdk.validateString)(properties.kmsArn));
  errors.collect(cdk.propertyValidator("output", cdk.requiredValidator)(properties.output));
  errors.collect(cdk.propertyValidator("output", cdk.listValidator(CfnMatchingWorkflowOutputAttributePropertyValidator))(properties.output));
  errors.collect(cdk.propertyValidator("outputS3Path", cdk.requiredValidator)(properties.outputS3Path));
  errors.collect(cdk.propertyValidator("outputS3Path", cdk.validateString)(properties.outputS3Path));
  return errors.wrap("supplied properties not correct for \"OutputSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowOutputSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowOutputSourcePropertyValidator(properties).assertSuccess();
  return {
    "ApplyNormalization": cdk.booleanToCloudFormation(properties.applyNormalization),
    "KMSArn": cdk.stringToCloudFormation(properties.kmsArn),
    "Output": cdk.listMapper(convertCfnMatchingWorkflowOutputAttributePropertyToCloudFormation)(properties.output),
    "OutputS3Path": cdk.stringToCloudFormation(properties.outputS3Path)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowOutputSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMatchingWorkflow.OutputSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflow.OutputSourceProperty>();
  ret.addPropertyResult("applyNormalization", "ApplyNormalization", (properties.ApplyNormalization != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplyNormalization) : undefined));
  ret.addPropertyResult("kmsArn", "KMSArn", (properties.KMSArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSArn) : undefined));
  ret.addPropertyResult("output", "Output", (properties.Output != null ? cfn_parse.FromCloudFormation.getArray(CfnMatchingWorkflowOutputAttributePropertyFromCloudFormation)(properties.Output) : undefined));
  ret.addPropertyResult("outputS3Path", "OutputS3Path", (properties.OutputS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMatchingWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnMatchingWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchingWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inputSourceConfig", cdk.requiredValidator)(properties.inputSourceConfig));
  errors.collect(cdk.propertyValidator("inputSourceConfig", cdk.listValidator(CfnMatchingWorkflowInputSourcePropertyValidator))(properties.inputSourceConfig));
  errors.collect(cdk.propertyValidator("outputSourceConfig", cdk.requiredValidator)(properties.outputSourceConfig));
  errors.collect(cdk.propertyValidator("outputSourceConfig", cdk.listValidator(CfnMatchingWorkflowOutputSourcePropertyValidator))(properties.outputSourceConfig));
  errors.collect(cdk.propertyValidator("resolutionTechniques", cdk.requiredValidator)(properties.resolutionTechniques));
  errors.collect(cdk.propertyValidator("resolutionTechniques", CfnMatchingWorkflowResolutionTechniquesPropertyValidator)(properties.resolutionTechniques));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workflowName", cdk.requiredValidator)(properties.workflowName));
  errors.collect(cdk.propertyValidator("workflowName", cdk.validateString)(properties.workflowName));
  return errors.wrap("supplied properties not correct for \"CfnMatchingWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnMatchingWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchingWorkflowPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InputSourceConfig": cdk.listMapper(convertCfnMatchingWorkflowInputSourcePropertyToCloudFormation)(properties.inputSourceConfig),
    "OutputSourceConfig": cdk.listMapper(convertCfnMatchingWorkflowOutputSourcePropertyToCloudFormation)(properties.outputSourceConfig),
    "ResolutionTechniques": convertCfnMatchingWorkflowResolutionTechniquesPropertyToCloudFormation(properties.resolutionTechniques),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkflowName": cdk.stringToCloudFormation(properties.workflowName)
  };
}

// @ts-ignore TS6133
function CfnMatchingWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchingWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchingWorkflowProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inputSourceConfig", "InputSourceConfig", (properties.InputSourceConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnMatchingWorkflowInputSourcePropertyFromCloudFormation)(properties.InputSourceConfig) : undefined));
  ret.addPropertyResult("outputSourceConfig", "OutputSourceConfig", (properties.OutputSourceConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnMatchingWorkflowOutputSourcePropertyFromCloudFormation)(properties.OutputSourceConfig) : undefined));
  ret.addPropertyResult("resolutionTechniques", "ResolutionTechniques", (properties.ResolutionTechniques != null ? CfnMatchingWorkflowResolutionTechniquesPropertyFromCloudFormation(properties.ResolutionTechniques) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workflowName", "WorkflowName", (properties.WorkflowName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a schema mapping, which defines the schema of the input customer records table.
 *
 * The `SchemaMapping` also provides AWS Entity Resolution with some metadata about the table, such as the attribute types of the columns and which columns to match on.
 *
 * @cloudformationResource AWS::EntityResolution::SchemaMapping
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html
 */
export class CfnSchemaMapping extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EntityResolution::SchemaMapping";

  /**
   * Build a CfnSchemaMapping from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchemaMapping {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaMappingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchemaMapping(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time of this SchemaMapping got created
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The boolean value that indicates whether or not a SchemaMapping has MatchingWorkflows that are associated with
   *
   * @cloudformationAttribute HasWorkflows
   */
  public readonly attrHasWorkflows: cdk.IResolvable;

  /**
   * The SchemaMapping arn associated with the Schema
   *
   * @cloudformationAttribute SchemaArn
   */
  public readonly attrSchemaArn: string;

  /**
   * The time of this SchemaMapping got last updated at
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * A description of the schema.
   */
  public description?: string;

  /**
   * A list of `MappedInputFields` .
   */
  public mappedInputFields: Array<cdk.IResolvable | CfnSchemaMapping.SchemaInputAttributeProperty> | cdk.IResolvable;

  /**
   * The name of the schema.
   */
  public schemaName: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaMappingProps) {
    super(scope, id, {
      "type": CfnSchemaMapping.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "mappedInputFields", this);
    cdk.requireProperty(props, "schemaName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrHasWorkflows = this.getAtt("HasWorkflows");
    this.attrSchemaArn = cdk.Token.asString(this.getAtt("SchemaArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.mappedInputFields = props.mappedInputFields;
    this.schemaName = props.schemaName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "mappedInputFields": this.mappedInputFields,
      "schemaName": this.schemaName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchemaMapping.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaMappingPropsToCloudFormation(props);
  }
}

export namespace CfnSchemaMapping {
  /**
   * An object containing `FieldName` , `Type` , `GroupName` , and `MatchKey` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html
   */
  export interface SchemaInputAttributeProperty {
    /**
     * A string containing the field name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html#cfn-entityresolution-schemamapping-schemainputattribute-fieldname
     */
    readonly fieldName: string;

    /**
     * Instruct AWS Entity Resolution to combine several columns into a unified column with the identical attribute type.
     *
     * For example, when working with columns such as first_name, middle_name, and last_name, assigning them a common `GroupName` will prompt AWS Entity Resolution to concatenate them into a single value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html#cfn-entityresolution-schemamapping-schemainputattribute-groupname
     */
    readonly groupName?: string;

    /**
     * A key that allows grouping of multiple input attributes into a unified matching group.
     *
     * For example, let's consider a scenario where the source table contains various addresses, such as `business_address` and `shipping_address` . By assigning the `MatchKey` *Address* to both attributes, AWS Entity Resolution will match records across these fields to create a consolidated matching group. If no `MatchKey` is specified for a column, it won't be utilized for matching purposes but will still be included in the output table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html#cfn-entityresolution-schemamapping-schemainputattribute-matchkey
     */
    readonly matchKey?: string;

    /**
     * The subtype of the attribute, selected from a list of values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html#cfn-entityresolution-schemamapping-schemainputattribute-subtype
     */
    readonly subType?: string;

    /**
     * The type of the attribute, selected from a list of values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-schemamapping-schemainputattribute.html#cfn-entityresolution-schemamapping-schemainputattribute-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnSchemaMapping`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html
 */
export interface CfnSchemaMappingProps {
  /**
   * A description of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html#cfn-entityresolution-schemamapping-description
   */
  readonly description?: string;

  /**
   * A list of `MappedInputFields` .
   *
   * Each `MappedInputField` corresponds to a column the source data table, and contains column name plus additional information that AWS Entity Resolution uses for matching.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html#cfn-entityresolution-schemamapping-mappedinputfields
   */
  readonly mappedInputFields: Array<cdk.IResolvable | CfnSchemaMapping.SchemaInputAttributeProperty> | cdk.IResolvable;

  /**
   * The name of the schema.
   *
   * There can't be multiple `SchemaMappings` with the same name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html#cfn-entityresolution-schemamapping-schemaname
   */
  readonly schemaName: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-schemamapping.html#cfn-entityresolution-schemamapping-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SchemaInputAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaInputAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaMappingSchemaInputAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldName", cdk.requiredValidator)(properties.fieldName));
  errors.collect(cdk.propertyValidator("fieldName", cdk.validateString)(properties.fieldName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("matchKey", cdk.validateString)(properties.matchKey));
  errors.collect(cdk.propertyValidator("subType", cdk.validateString)(properties.subType));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SchemaInputAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchemaMappingSchemaInputAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaMappingSchemaInputAttributePropertyValidator(properties).assertSuccess();
  return {
    "FieldName": cdk.stringToCloudFormation(properties.fieldName),
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "MatchKey": cdk.stringToCloudFormation(properties.matchKey),
    "SubType": cdk.stringToCloudFormation(properties.subType),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSchemaMappingSchemaInputAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchemaMapping.SchemaInputAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaMapping.SchemaInputAttributeProperty>();
  ret.addPropertyResult("fieldName", "FieldName", (properties.FieldName != null ? cfn_parse.FromCloudFormation.getString(properties.FieldName) : undefined));
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("matchKey", "MatchKey", (properties.MatchKey != null ? cfn_parse.FromCloudFormation.getString(properties.MatchKey) : undefined));
  ret.addPropertyResult("subType", "SubType", (properties.SubType != null ? cfn_parse.FromCloudFormation.getString(properties.SubType) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaMappingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaMappingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("mappedInputFields", cdk.requiredValidator)(properties.mappedInputFields));
  errors.collect(cdk.propertyValidator("mappedInputFields", cdk.listValidator(CfnSchemaMappingSchemaInputAttributePropertyValidator))(properties.mappedInputFields));
  errors.collect(cdk.propertyValidator("schemaName", cdk.requiredValidator)(properties.schemaName));
  errors.collect(cdk.propertyValidator("schemaName", cdk.validateString)(properties.schemaName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSchemaMappingProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaMappingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaMappingPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MappedInputFields": cdk.listMapper(convertCfnSchemaMappingSchemaInputAttributePropertyToCloudFormation)(properties.mappedInputFields),
    "SchemaName": cdk.stringToCloudFormation(properties.schemaName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSchemaMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaMappingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaMappingProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("mappedInputFields", "MappedInputFields", (properties.MappedInputFields != null ? cfn_parse.FromCloudFormation.getArray(CfnSchemaMappingSchemaInputAttributePropertyFromCloudFormation)(properties.MappedInputFields) : undefined));
  ret.addPropertyResult("schemaName", "SchemaName", (properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an `IdMappingWorkflow` object which stores the configuration of the data processing job to be run.
 *
 * Each `IdMappingWorkflow` must have a unique workflow name. To modify an existing workflow, use the `UpdateIdMappingWorkflow` API.
 *
 * @cloudformationResource AWS::EntityResolution::IdMappingWorkflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html
 */
export class CfnIdMappingWorkflow extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EntityResolution::IdMappingWorkflow";

  /**
   * Build a CfnIdMappingWorkflow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdMappingWorkflow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdMappingWorkflowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdMappingWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time of this IdMappingWorkflow got created
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The time of this IdMappingWorkflow got last updated at
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The default IdMappingWorkflow arn
   *
   * @cloudformationAttribute WorkflowArn
   */
  public readonly attrWorkflowArn: string;

  /**
   * A description of the workflow.
   */
  public description?: string;

  /**
   * An object which defines the `idMappingType` and the `providerProperties` .
   */
  public idMappingTechniques: CfnIdMappingWorkflow.IdMappingTechniquesProperty | cdk.IResolvable;

  /**
   * A list of `InputSource` objects, which have the fields `InputSourceARN` and `SchemaName` .
   */
  public inputSourceConfig: Array<CfnIdMappingWorkflow.IdMappingWorkflowInputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of `IdMappingWorkflowOutputSource` objects, each of which contains fields `OutputS3Path` and `Output` .
   */
  public outputSourceConfig: Array<CfnIdMappingWorkflow.IdMappingWorkflowOutputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role.
   */
  public roleArn: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name of the workflow.
   */
  public workflowName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdMappingWorkflowProps) {
    super(scope, id, {
      "type": CfnIdMappingWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "idMappingTechniques", this);
    cdk.requireProperty(props, "inputSourceConfig", this);
    cdk.requireProperty(props, "outputSourceConfig", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "workflowName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrWorkflowArn = cdk.Token.asString(this.getAtt("WorkflowArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.idMappingTechniques = props.idMappingTechniques;
    this.inputSourceConfig = props.inputSourceConfig;
    this.outputSourceConfig = props.outputSourceConfig;
    this.roleArn = props.roleArn;
    this.tags = props.tags;
    this.workflowName = props.workflowName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "idMappingTechniques": this.idMappingTechniques,
      "inputSourceConfig": this.inputSourceConfig,
      "outputSourceConfig": this.outputSourceConfig,
      "roleArn": this.roleArn,
      "tags": this.tags,
      "workflowName": this.workflowName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdMappingWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdMappingWorkflowPropsToCloudFormation(props);
  }
}

export namespace CfnIdMappingWorkflow {
  /**
   * An object containing `InputSourceARN` and `SchemaName` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowinputsource.html
   */
  export interface IdMappingWorkflowInputSourceProperty {
    /**
     * An AWS Glue table ARN for the input source table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowinputsource.html#cfn-entityresolution-idmappingworkflow-idmappingworkflowinputsource-inputsourcearn
     */
    readonly inputSourceArn: string;

    /**
     * The ARN (Amazon Resource Name) that AWS Entity Resolution generated for the `SchemaMapping` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowinputsource.html#cfn-entityresolution-idmappingworkflow-idmappingworkflowinputsource-schemaarn
     */
    readonly schemaArn: string;
  }

  /**
   * A list of `IdMappingWorkflowOutputSource` objects, each of which contains fields `OutputS3Path` and `Output` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowoutputsource.html
   */
  export interface IdMappingWorkflowOutputSourceProperty {
    /**
     * Customer AWS KMS ARN for encryption at rest.
     *
     * If not provided, system will use an AWS Entity Resolution managed KMS key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowoutputsource.html#cfn-entityresolution-idmappingworkflow-idmappingworkflowoutputsource-kmsarn
     */
    readonly kmsArn?: string;

    /**
     * The S3 path to which AWS Entity Resolution will write the output table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingworkflowoutputsource.html#cfn-entityresolution-idmappingworkflow-idmappingworkflowoutputsource-outputs3path
     */
    readonly outputS3Path: string;
  }

  /**
   * An object which defines the ID mapping techniques and provider configurations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingtechniques.html
   */
  export interface IdMappingTechniquesProperty {
    /**
     * The type of ID mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingtechniques.html#cfn-entityresolution-idmappingworkflow-idmappingtechniques-idmappingtype
     */
    readonly idMappingType?: string;

    /**
     * An object which defines any additional configurations required by the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-idmappingtechniques.html#cfn-entityresolution-idmappingworkflow-idmappingtechniques-providerproperties
     */
    readonly providerProperties?: cdk.IResolvable | CfnIdMappingWorkflow.ProviderPropertiesProperty;
  }

  /**
   * An object containing the `providerServiceARN` , `intermediateSourceConfiguration` , and `providerConfiguration` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-providerproperties.html
   */
  export interface ProviderPropertiesProperty {
    /**
     * The Amazon S3 location that temporarily stores your data while it processes.
     *
     * Your information won't be saved permanently.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-providerproperties.html#cfn-entityresolution-idmappingworkflow-providerproperties-intermediatesourceconfiguration
     */
    readonly intermediateSourceConfiguration?: CfnIdMappingWorkflow.IntermediateSourceConfigurationProperty | cdk.IResolvable;

    /**
     * The required configuration fields to use with the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-providerproperties.html#cfn-entityresolution-idmappingworkflow-providerproperties-providerconfiguration
     */
    readonly providerConfiguration?: cdk.IResolvable | Record<string, string>;

    /**
     * The ARN of the provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-providerproperties.html#cfn-entityresolution-idmappingworkflow-providerproperties-providerservicearn
     */
    readonly providerServiceArn: string;
  }

  /**
   * The Amazon S3 location that temporarily stores your data while it processes.
   *
   * Your information won't be saved permanently.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-intermediatesourceconfiguration.html
   */
  export interface IntermediateSourceConfigurationProperty {
    /**
     * The Amazon S3 location (bucket and prefix).
     *
     * For example: `s3://provider_bucket/DOC-EXAMPLE-BUCKET`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-entityresolution-idmappingworkflow-intermediatesourceconfiguration.html#cfn-entityresolution-idmappingworkflow-intermediatesourceconfiguration-intermediates3path
     */
    readonly intermediateS3Path: string;
  }
}

/**
 * Properties for defining a `CfnIdMappingWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html
 */
export interface CfnIdMappingWorkflowProps {
  /**
   * A description of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-description
   */
  readonly description?: string;

  /**
   * An object which defines the `idMappingType` and the `providerProperties` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-idmappingtechniques
   */
  readonly idMappingTechniques: CfnIdMappingWorkflow.IdMappingTechniquesProperty | cdk.IResolvable;

  /**
   * A list of `InputSource` objects, which have the fields `InputSourceARN` and `SchemaName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-inputsourceconfig
   */
  readonly inputSourceConfig: Array<CfnIdMappingWorkflow.IdMappingWorkflowInputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of `IdMappingWorkflowOutputSource` objects, each of which contains fields `OutputS3Path` and `Output` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-outputsourceconfig
   */
  readonly outputSourceConfig: Array<CfnIdMappingWorkflow.IdMappingWorkflowOutputSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role.
   *
   * AWS Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-rolearn
   */
  readonly roleArn: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the workflow.
   *
   * There can't be multiple `IdMappingWorkflows` with the same name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-entityresolution-idmappingworkflow.html#cfn-entityresolution-idmappingworkflow-workflowname
   */
  readonly workflowName: string;
}

/**
 * Determine whether the given properties match those of a `IdMappingWorkflowInputSourceProperty`
 *
 * @param properties - the TypeScript properties of a `IdMappingWorkflowInputSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputSourceArn", cdk.requiredValidator)(properties.inputSourceArn));
  errors.collect(cdk.propertyValidator("inputSourceArn", cdk.validateString)(properties.inputSourceArn));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.requiredValidator)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  return errors.wrap("supplied properties not correct for \"IdMappingWorkflowInputSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyValidator(properties).assertSuccess();
  return {
    "InputSourceARN": cdk.stringToCloudFormation(properties.inputSourceArn),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdMappingWorkflow.IdMappingWorkflowInputSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflow.IdMappingWorkflowInputSourceProperty>();
  ret.addPropertyResult("inputSourceArn", "InputSourceARN", (properties.InputSourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.InputSourceARN) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdMappingWorkflowOutputSourceProperty`
 *
 * @param properties - the TypeScript properties of a `IdMappingWorkflowOutputSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsArn", cdk.validateString)(properties.kmsArn));
  errors.collect(cdk.propertyValidator("outputS3Path", cdk.requiredValidator)(properties.outputS3Path));
  errors.collect(cdk.propertyValidator("outputS3Path", cdk.validateString)(properties.outputS3Path));
  return errors.wrap("supplied properties not correct for \"IdMappingWorkflowOutputSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyValidator(properties).assertSuccess();
  return {
    "KMSArn": cdk.stringToCloudFormation(properties.kmsArn),
    "OutputS3Path": cdk.stringToCloudFormation(properties.outputS3Path)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdMappingWorkflow.IdMappingWorkflowOutputSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflow.IdMappingWorkflowOutputSourceProperty>();
  ret.addPropertyResult("kmsArn", "KMSArn", (properties.KMSArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSArn) : undefined));
  ret.addPropertyResult("outputS3Path", "OutputS3Path", (properties.OutputS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntermediateSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IntermediateSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowIntermediateSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intermediateS3Path", cdk.requiredValidator)(properties.intermediateS3Path));
  errors.collect(cdk.propertyValidator("intermediateS3Path", cdk.validateString)(properties.intermediateS3Path));
  return errors.wrap("supplied properties not correct for \"IntermediateSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowIntermediateSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowIntermediateSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "IntermediateS3Path": cdk.stringToCloudFormation(properties.intermediateS3Path)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowIntermediateSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdMappingWorkflow.IntermediateSourceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflow.IntermediateSourceConfigurationProperty>();
  ret.addPropertyResult("intermediateS3Path", "IntermediateS3Path", (properties.IntermediateS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.IntermediateS3Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProviderPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ProviderPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowProviderPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intermediateSourceConfiguration", CfnIdMappingWorkflowIntermediateSourceConfigurationPropertyValidator)(properties.intermediateSourceConfiguration));
  errors.collect(cdk.propertyValidator("providerConfiguration", cdk.hashValidator(cdk.validateString))(properties.providerConfiguration));
  errors.collect(cdk.propertyValidator("providerServiceArn", cdk.requiredValidator)(properties.providerServiceArn));
  errors.collect(cdk.propertyValidator("providerServiceArn", cdk.validateString)(properties.providerServiceArn));
  return errors.wrap("supplied properties not correct for \"ProviderPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowProviderPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowProviderPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "IntermediateSourceConfiguration": convertCfnIdMappingWorkflowIntermediateSourceConfigurationPropertyToCloudFormation(properties.intermediateSourceConfiguration),
    "ProviderConfiguration": cdk.hashMapper(cdk.stringToCloudFormation)(properties.providerConfiguration),
    "ProviderServiceArn": cdk.stringToCloudFormation(properties.providerServiceArn)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowProviderPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdMappingWorkflow.ProviderPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflow.ProviderPropertiesProperty>();
  ret.addPropertyResult("intermediateSourceConfiguration", "IntermediateSourceConfiguration", (properties.IntermediateSourceConfiguration != null ? CfnIdMappingWorkflowIntermediateSourceConfigurationPropertyFromCloudFormation(properties.IntermediateSourceConfiguration) : undefined));
  ret.addPropertyResult("providerConfiguration", "ProviderConfiguration", (properties.ProviderConfiguration != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ProviderConfiguration) : undefined));
  ret.addPropertyResult("providerServiceArn", "ProviderServiceArn", (properties.ProviderServiceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderServiceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdMappingTechniquesProperty`
 *
 * @param properties - the TypeScript properties of a `IdMappingTechniquesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingTechniquesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idMappingType", cdk.validateString)(properties.idMappingType));
  errors.collect(cdk.propertyValidator("providerProperties", CfnIdMappingWorkflowProviderPropertiesPropertyValidator)(properties.providerProperties));
  return errors.wrap("supplied properties not correct for \"IdMappingTechniquesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowIdMappingTechniquesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowIdMappingTechniquesPropertyValidator(properties).assertSuccess();
  return {
    "IdMappingType": cdk.stringToCloudFormation(properties.idMappingType),
    "ProviderProperties": convertCfnIdMappingWorkflowProviderPropertiesPropertyToCloudFormation(properties.providerProperties)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowIdMappingTechniquesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdMappingWorkflow.IdMappingTechniquesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflow.IdMappingTechniquesProperty>();
  ret.addPropertyResult("idMappingType", "IdMappingType", (properties.IdMappingType != null ? cfn_parse.FromCloudFormation.getString(properties.IdMappingType) : undefined));
  ret.addPropertyResult("providerProperties", "ProviderProperties", (properties.ProviderProperties != null ? CfnIdMappingWorkflowProviderPropertiesPropertyFromCloudFormation(properties.ProviderProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdMappingWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdMappingWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdMappingWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("idMappingTechniques", cdk.requiredValidator)(properties.idMappingTechniques));
  errors.collect(cdk.propertyValidator("idMappingTechniques", CfnIdMappingWorkflowIdMappingTechniquesPropertyValidator)(properties.idMappingTechniques));
  errors.collect(cdk.propertyValidator("inputSourceConfig", cdk.requiredValidator)(properties.inputSourceConfig));
  errors.collect(cdk.propertyValidator("inputSourceConfig", cdk.listValidator(CfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyValidator))(properties.inputSourceConfig));
  errors.collect(cdk.propertyValidator("outputSourceConfig", cdk.requiredValidator)(properties.outputSourceConfig));
  errors.collect(cdk.propertyValidator("outputSourceConfig", cdk.listValidator(CfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyValidator))(properties.outputSourceConfig));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workflowName", cdk.requiredValidator)(properties.workflowName));
  errors.collect(cdk.propertyValidator("workflowName", cdk.validateString)(properties.workflowName));
  return errors.wrap("supplied properties not correct for \"CfnIdMappingWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnIdMappingWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdMappingWorkflowPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "IdMappingTechniques": convertCfnIdMappingWorkflowIdMappingTechniquesPropertyToCloudFormation(properties.idMappingTechniques),
    "InputSourceConfig": cdk.listMapper(convertCfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyToCloudFormation)(properties.inputSourceConfig),
    "OutputSourceConfig": cdk.listMapper(convertCfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyToCloudFormation)(properties.outputSourceConfig),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkflowName": cdk.stringToCloudFormation(properties.workflowName)
  };
}

// @ts-ignore TS6133
function CfnIdMappingWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdMappingWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdMappingWorkflowProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("idMappingTechniques", "IdMappingTechniques", (properties.IdMappingTechniques != null ? CfnIdMappingWorkflowIdMappingTechniquesPropertyFromCloudFormation(properties.IdMappingTechniques) : undefined));
  ret.addPropertyResult("inputSourceConfig", "InputSourceConfig", (properties.InputSourceConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnIdMappingWorkflowIdMappingWorkflowInputSourcePropertyFromCloudFormation)(properties.InputSourceConfig) : undefined));
  ret.addPropertyResult("outputSourceConfig", "OutputSourceConfig", (properties.OutputSourceConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnIdMappingWorkflowIdMappingWorkflowOutputSourcePropertyFromCloudFormation)(properties.OutputSourceConfig) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workflowName", "WorkflowName", (properties.WorkflowName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}