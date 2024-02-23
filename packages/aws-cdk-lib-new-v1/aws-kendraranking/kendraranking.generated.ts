/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a rescore execution plan.
 *
 * A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the `Rescore` API. You set the number of capacity units that you require for Amazon Kendra Intelligent Ranking to rescore or re-rank a search service's results.
 *
 * For an example of using the `CreateRescoreExecutionPlan` API, including using the Python and Java SDKs, see [Semantically ranking a search service's results](https://docs.aws.amazon.com/kendra/latest/dg/search-service-rerank.html) .
 *
 * @cloudformationResource AWS::KendraRanking::ExecutionPlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export class CfnExecutionPlan extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KendraRanking::ExecutionPlan";

  /**
   * Build a CfnExecutionPlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExecutionPlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnExecutionPlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnExecutionPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the rescore execution plan.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The identifier of the rescore execution plan.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * You can set additional capacity units to meet the needs of your rescore execution plan.
   */
  public capacityUnits?: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the rescore execution plan.
   */
  public description?: string;

  /**
   * A name for the rescore execution plan.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that identify or categorize your rescore execution plan.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnExecutionPlanProps) {
    super(scope, id, {
      "type": CfnExecutionPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.capacityUnits = props.capacityUnits;
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KendraRanking::ExecutionPlan", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityUnits": this.capacityUnits,
      "description": this.description,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnExecutionPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnExecutionPlanPropsToCloudFormation(props);
  }
}

export namespace CfnExecutionPlan {
  /**
   * Sets additional capacity units configured for your rescore execution plan.
   *
   * A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the `Rescore` API. You can add and remove capacity units to fit your usage requirements.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html
   */
  export interface CapacityUnitsConfigurationProperty {
    /**
     * The amount of extra capacity for your rescore execution plan.
     *
     * A single extra capacity unit for a rescore execution plan provides 0.01 rescore requests per second. You can add up to 1000 extra capacity units.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html#cfn-kendraranking-executionplan-capacityunitsconfiguration-rescorecapacityunits
     */
    readonly rescoreCapacityUnits: number;
  }
}

/**
 * Properties for defining a `CfnExecutionPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export interface CfnExecutionPlanProps {
  /**
   * You can set additional capacity units to meet the needs of your rescore execution plan.
   *
   * You are given a single capacity unit by default. If you want to use the default capacity, you don't set additional capacity units. For more information on the default capacity and additional capacity units, see [Adjusting capacity](https://docs.aws.amazon.com/kendra/latest/dg/adjusting-capacity.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-capacityunits
   */
  readonly capacityUnits?: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the rescore execution plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-description
   */
  readonly description?: string;

  /**
   * A name for the rescore execution plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-name
   */
  readonly name: string;

  /**
   * A list of key-value pairs that identify or categorize your rescore execution plan.
   *
   * You can also use tags to help control access to the rescore execution plan. Tag keys and values can consist of Unicode letters, digits, white space. They can also consist of underscore, period, colon, equal, plus, and asperand.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CapacityUnitsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityUnitsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExecutionPlanCapacityUnitsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rescoreCapacityUnits", cdk.requiredValidator)(properties.rescoreCapacityUnits));
  errors.collect(cdk.propertyValidator("rescoreCapacityUnits", cdk.validateNumber)(properties.rescoreCapacityUnits));
  return errors.wrap("supplied properties not correct for \"CapacityUnitsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnExecutionPlanCapacityUnitsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExecutionPlanCapacityUnitsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RescoreCapacityUnits": cdk.numberToCloudFormation(properties.rescoreCapacityUnits)
  };
}

// @ts-ignore TS6133
function CfnExecutionPlanCapacityUnitsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExecutionPlan.CapacityUnitsConfigurationProperty>();
  ret.addPropertyResult("rescoreCapacityUnits", "RescoreCapacityUnits", (properties.RescoreCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.RescoreCapacityUnits) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnExecutionPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnExecutionPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExecutionPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityUnits", CfnExecutionPlanCapacityUnitsConfigurationPropertyValidator)(properties.capacityUnits));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnExecutionPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnExecutionPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExecutionPlanPropsValidator(properties).assertSuccess();
  return {
    "CapacityUnits": convertCfnExecutionPlanCapacityUnitsConfigurationPropertyToCloudFormation(properties.capacityUnits),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnExecutionPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExecutionPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExecutionPlanProps>();
  ret.addPropertyResult("capacityUnits", "CapacityUnits", (properties.CapacityUnits != null ? CfnExecutionPlanCapacityUnitsConfigurationPropertyFromCloudFormation(properties.CapacityUnits) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}