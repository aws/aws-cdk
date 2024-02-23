/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A calculated attribute definition for Customer Profiles.
 *
 * @cloudformationResource AWS::CustomerProfiles::CalculatedAttributeDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html
 */
export class CfnCalculatedAttributeDefinition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CustomerProfiles::CalculatedAttributeDefinition";

  /**
   * Build a CfnCalculatedAttributeDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCalculatedAttributeDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCalculatedAttributeDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCalculatedAttributeDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp of when the calculated attribute definition was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The timestamp of when the calculated attribute definition was most recently edited.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * Mathematical expression and a list of attribute items specified in that expression.
   */
  public attributeDetails: CfnCalculatedAttributeDefinition.AttributeDetailsProperty | cdk.IResolvable;

  /**
   * The name of an attribute defined in a profile object type.
   */
  public calculatedAttributeName: string;

  /**
   * The conditions including range, object count, and threshold for the calculated attribute.
   */
  public conditions?: CfnCalculatedAttributeDefinition.ConditionsProperty | cdk.IResolvable;

  /**
   * The description of the calculated attribute.
   */
  public description?: string;

  /**
   * The display name of the calculated attribute.
   */
  public displayName?: string;

  /**
   * The unique name of the domain.
   */
  public domainName: string;

  /**
   * The aggregation operation to perform for the calculated attribute.
   */
  public statistic: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCalculatedAttributeDefinitionProps) {
    super(scope, id, {
      "type": CfnCalculatedAttributeDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "attributeDetails", this);
    cdk.requireProperty(props, "calculatedAttributeName", this);
    cdk.requireProperty(props, "domainName", this);
    cdk.requireProperty(props, "statistic", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attributeDetails = props.attributeDetails;
    this.calculatedAttributeName = props.calculatedAttributeName;
    this.conditions = props.conditions;
    this.description = props.description;
    this.displayName = props.displayName;
    this.domainName = props.domainName;
    this.statistic = props.statistic;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributeDetails": this.attributeDetails,
      "calculatedAttributeName": this.calculatedAttributeName,
      "conditions": this.conditions,
      "description": this.description,
      "displayName": this.displayName,
      "domainName": this.domainName,
      "statistic": this.statistic,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCalculatedAttributeDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCalculatedAttributeDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnCalculatedAttributeDefinition {
  /**
   * Mathematical expression and a list of attribute items specified in that expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-attributedetails.html
   */
  export interface AttributeDetailsProperty {
    /**
     * Mathematical expression and a list of attribute items specified in that expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-attributedetails.html#cfn-customerprofiles-calculatedattributedefinition-attributedetails-attributes
     */
    readonly attributes: Array<CfnCalculatedAttributeDefinition.AttributeItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Mathematical expression that is performed on attribute items provided in the attribute list.
     *
     * Each element in the expression should follow the structure of \"{ObjectTypeName.AttributeName}\".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-attributedetails.html#cfn-customerprofiles-calculatedattributedefinition-attributedetails-expression
     */
    readonly expression: string;
  }

  /**
   * The details of a single attribute item specified in the mathematical expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-attributeitem.html
   */
  export interface AttributeItemProperty {
    /**
     * The unique name of the calculated attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-attributeitem.html#cfn-customerprofiles-calculatedattributedefinition-attributeitem-name
     */
    readonly name: string;
  }

  /**
   * The conditions including range, object count, and threshold for the calculated attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-conditions.html
   */
  export interface ConditionsProperty {
    /**
     * The number of profile objects used for the calculated attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-conditions.html#cfn-customerprofiles-calculatedattributedefinition-conditions-objectcount
     */
    readonly objectCount?: number;

    /**
     * The relative time period over which data is included in the aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-conditions.html#cfn-customerprofiles-calculatedattributedefinition-conditions-range
     */
    readonly range?: cdk.IResolvable | CfnCalculatedAttributeDefinition.RangeProperty;

    /**
     * The threshold for the calculated attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-conditions.html#cfn-customerprofiles-calculatedattributedefinition-conditions-threshold
     */
    readonly threshold?: cdk.IResolvable | CfnCalculatedAttributeDefinition.ThresholdProperty;
  }

  /**
   * The relative time period over which data is included in the aggregation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-range.html
   */
  export interface RangeProperty {
    /**
     * The unit of time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-range.html#cfn-customerprofiles-calculatedattributedefinition-range-unit
     */
    readonly unit: string;

    /**
     * The amount of time of the specified unit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-range.html#cfn-customerprofiles-calculatedattributedefinition-range-value
     */
    readonly value: number;
  }

  /**
   * The threshold for the calculated attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-threshold.html
   */
  export interface ThresholdProperty {
    /**
     * The operator of the threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-threshold.html#cfn-customerprofiles-calculatedattributedefinition-threshold-operator
     */
    readonly operator: string;

    /**
     * The value of the threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-calculatedattributedefinition-threshold.html#cfn-customerprofiles-calculatedattributedefinition-threshold-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnCalculatedAttributeDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html
 */
export interface CfnCalculatedAttributeDefinitionProps {
  /**
   * Mathematical expression and a list of attribute items specified in that expression.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-attributedetails
   */
  readonly attributeDetails: CfnCalculatedAttributeDefinition.AttributeDetailsProperty | cdk.IResolvable;

  /**
   * The name of an attribute defined in a profile object type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-calculatedattributename
   */
  readonly calculatedAttributeName: string;

  /**
   * The conditions including range, object count, and threshold for the calculated attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-conditions
   */
  readonly conditions?: CfnCalculatedAttributeDefinition.ConditionsProperty | cdk.IResolvable;

  /**
   * The description of the calculated attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-description
   */
  readonly description?: string;

  /**
   * The display name of the calculated attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-displayname
   */
  readonly displayName?: string;

  /**
   * The unique name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-domainname
   */
  readonly domainName: string;

  /**
   * The aggregation operation to perform for the calculated attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-statistic
   */
  readonly statistic: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-calculatedattributedefinition.html#cfn-customerprofiles-calculatedattributedefinition-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AttributeItemProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionAttributeItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"AttributeItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionAttributeItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionAttributeItemPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionAttributeItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCalculatedAttributeDefinition.AttributeItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinition.AttributeItemProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttributeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionAttributeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(CfnCalculatedAttributeDefinitionAttributeItemPropertyValidator))(properties.attributes));
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  return errors.wrap("supplied properties not correct for \"AttributeDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionAttributeDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionAttributeDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(convertCfnCalculatedAttributeDefinitionAttributeItemPropertyToCloudFormation)(properties.attributes),
    "Expression": cdk.stringToCloudFormation(properties.expression)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionAttributeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCalculatedAttributeDefinition.AttributeDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinition.AttributeDetailsProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnCalculatedAttributeDefinitionAttributeItemPropertyFromCloudFormation)(properties.Attributes) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RangeProperty`
 *
 * @param properties - the TypeScript properties of a `RangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"RangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionRangePropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCalculatedAttributeDefinition.RangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinition.RangeProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThresholdProperty`
 *
 * @param properties - the TypeScript properties of a `ThresholdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionThresholdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("operator", cdk.requiredValidator)(properties.operator));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ThresholdProperty\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionThresholdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionThresholdPropertyValidator(properties).assertSuccess();
  return {
    "Operator": cdk.stringToCloudFormation(properties.operator),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionThresholdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCalculatedAttributeDefinition.ThresholdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinition.ThresholdProperty>();
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionsProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionConditionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectCount", cdk.validateNumber)(properties.objectCount));
  errors.collect(cdk.propertyValidator("range", CfnCalculatedAttributeDefinitionRangePropertyValidator)(properties.range));
  errors.collect(cdk.propertyValidator("threshold", CfnCalculatedAttributeDefinitionThresholdPropertyValidator)(properties.threshold));
  return errors.wrap("supplied properties not correct for \"ConditionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionConditionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionConditionsPropertyValidator(properties).assertSuccess();
  return {
    "ObjectCount": cdk.numberToCloudFormation(properties.objectCount),
    "Range": convertCfnCalculatedAttributeDefinitionRangePropertyToCloudFormation(properties.range),
    "Threshold": convertCfnCalculatedAttributeDefinitionThresholdPropertyToCloudFormation(properties.threshold)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionConditionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCalculatedAttributeDefinition.ConditionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinition.ConditionsProperty>();
  ret.addPropertyResult("objectCount", "ObjectCount", (properties.ObjectCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectCount) : undefined));
  ret.addPropertyResult("range", "Range", (properties.Range != null ? CfnCalculatedAttributeDefinitionRangePropertyFromCloudFormation(properties.Range) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? CfnCalculatedAttributeDefinitionThresholdPropertyFromCloudFormation(properties.Threshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCalculatedAttributeDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCalculatedAttributeDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeDetails", cdk.requiredValidator)(properties.attributeDetails));
  errors.collect(cdk.propertyValidator("attributeDetails", CfnCalculatedAttributeDefinitionAttributeDetailsPropertyValidator)(properties.attributeDetails));
  errors.collect(cdk.propertyValidator("calculatedAttributeName", cdk.requiredValidator)(properties.calculatedAttributeName));
  errors.collect(cdk.propertyValidator("calculatedAttributeName", cdk.validateString)(properties.calculatedAttributeName));
  errors.collect(cdk.propertyValidator("conditions", CfnCalculatedAttributeDefinitionConditionsPropertyValidator)(properties.conditions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("statistic", cdk.requiredValidator)(properties.statistic));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCalculatedAttributeDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnCalculatedAttributeDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCalculatedAttributeDefinitionPropsValidator(properties).assertSuccess();
  return {
    "AttributeDetails": convertCfnCalculatedAttributeDefinitionAttributeDetailsPropertyToCloudFormation(properties.attributeDetails),
    "CalculatedAttributeName": cdk.stringToCloudFormation(properties.calculatedAttributeName),
    "Conditions": convertCfnCalculatedAttributeDefinitionConditionsPropertyToCloudFormation(properties.conditions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "Statistic": cdk.stringToCloudFormation(properties.statistic),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCalculatedAttributeDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCalculatedAttributeDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCalculatedAttributeDefinitionProps>();
  ret.addPropertyResult("attributeDetails", "AttributeDetails", (properties.AttributeDetails != null ? CfnCalculatedAttributeDefinitionAttributeDetailsPropertyFromCloudFormation(properties.AttributeDetails) : undefined));
  ret.addPropertyResult("calculatedAttributeName", "CalculatedAttributeName", (properties.CalculatedAttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.CalculatedAttributeName) : undefined));
  ret.addPropertyResult("conditions", "Conditions", (properties.Conditions != null ? CfnCalculatedAttributeDefinitionConditionsPropertyFromCloudFormation(properties.Conditions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an Amazon Connect Customer Profiles Domain.
 *
 * @cloudformationResource AWS::CustomerProfiles::Domain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CustomerProfiles::Domain";

  /**
   * Build a CfnDomain from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomain(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp of when the domain was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The timestamp of when the domain was most recently edited.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * The status of rule-based matching rule.
   *
   * @cloudformationAttribute RuleBasedMatching.Status
   */
  public readonly attrRuleBasedMatchingStatus: string;

  /**
   * Usage-specific statistics about the domain.
   *
   * @cloudformationAttribute Stats
   */
  public readonly attrStats: cdk.IResolvable;

  /**
   * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications.
   */
  public deadLetterQueueUrl?: string;

  /**
   * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified.
   */
  public defaultEncryptionKey?: string;

  /**
   * The default number of days until the data within the domain expires.
   */
  public defaultExpirationDays?: number;

  /**
   * The unique name of the domain.
   */
  public domainName: string;

  /**
   * The process of matching duplicate profiles.
   */
  public matching?: cdk.IResolvable | CfnDomain.MatchingProperty;

  /**
   * The process of matching duplicate profiles using Rule-Based matching.
   */
  public ruleBasedMatching?: cdk.IResolvable | CfnDomain.RuleBasedMatchingProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainProps) {
    super(scope, id, {
      "type": CfnDomain.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrRuleBasedMatchingStatus = cdk.Token.asString(this.getAtt("RuleBasedMatching.Status", cdk.ResolutionTypeHint.STRING));
    this.attrStats = this.getAtt("Stats");
    this.deadLetterQueueUrl = props.deadLetterQueueUrl;
    this.defaultEncryptionKey = props.defaultEncryptionKey;
    this.defaultExpirationDays = props.defaultExpirationDays;
    this.domainName = props.domainName;
    this.matching = props.matching;
    this.ruleBasedMatching = props.ruleBasedMatching;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::Domain", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deadLetterQueueUrl": this.deadLetterQueueUrl,
      "defaultEncryptionKey": this.defaultEncryptionKey,
      "defaultExpirationDays": this.defaultExpirationDays,
      "domainName": this.domainName,
      "matching": this.matching,
      "ruleBasedMatching": this.ruleBasedMatching,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainPropsToCloudFormation(props);
  }
}

export namespace CfnDomain {
  /**
   * The process of matching duplicate profiles.
   *
   * If `Matching = true` , Amazon Connect Customer Profiles starts a weekly batch process called *Identity Resolution Job* . If you do not specify a date and time for the *Identity Resolution Job* to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains. After the *Identity Resolution Job* completes, use the `GetMatches` API to return and review the results. Or, if you have configured `ExportingConfig` in the `MatchingRequest` , you can download the results from S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matching.html
   */
  export interface MatchingProperty {
    /**
     * Configuration information about the auto-merging process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matching.html#cfn-customerprofiles-domain-matching-automerging
     */
    readonly autoMerging?: CfnDomain.AutoMergingProperty | cdk.IResolvable;

    /**
     * The flag that enables the matching process of duplicate profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matching.html#cfn-customerprofiles-domain-matching-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The S3 location where Identity Resolution Jobs write result files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matching.html#cfn-customerprofiles-domain-matching-exportingconfig
     */
    readonly exportingConfig?: CfnDomain.ExportingConfigProperty | cdk.IResolvable;

    /**
     * The day and time when do you want to start the Identity Resolution Job every week.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matching.html#cfn-customerprofiles-domain-matching-jobschedule
     */
    readonly jobSchedule?: cdk.IResolvable | CfnDomain.JobScheduleProperty;
  }

  /**
   * Configuration information about the auto-merging process.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-automerging.html
   */
  export interface AutoMergingProperty {
    /**
     * Determines how the auto-merging process should resolve conflicts between different profiles.
     *
     * For example, if Profile A and Profile B have the same `FirstName` and `LastName` , `ConflictResolution` specifies which `EmailAddress` should be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-automerging.html#cfn-customerprofiles-domain-automerging-conflictresolution
     */
    readonly conflictResolution?: CfnDomain.ConflictResolutionProperty | cdk.IResolvable;

    /**
     * A list of matching attributes that represent matching criteria.
     *
     * If two profiles meet at least one of the requirements in the matching attributes list, they will be merged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-automerging.html#cfn-customerprofiles-domain-automerging-consolidation
     */
    readonly consolidation?: CfnDomain.ConsolidationProperty | cdk.IResolvable;

    /**
     * The flag that enables the auto-merging of duplicate profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-automerging.html#cfn-customerprofiles-domain-automerging-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * A number between 0 and 1 that represents the minimum confidence score required for profiles within a matching group to be merged during the auto-merge process.
     *
     * A higher score means that a higher similarity is required to merge profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-automerging.html#cfn-customerprofiles-domain-automerging-minallowedconfidencescoreformerging
     */
    readonly minAllowedConfidenceScoreForMerging?: number;
  }

  /**
   * Determines how the auto-merging process should resolve conflicts between different profiles.
   *
   * For example, if Profile A and Profile B have the same `FirstName` and `LastName` , `ConflictResolution` specifies which `EmailAddress` should be used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-conflictresolution.html
   */
  export interface ConflictResolutionProperty {
    /**
     * How the auto-merging process should resolve conflicts between different profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-conflictresolution.html#cfn-customerprofiles-domain-conflictresolution-conflictresolvingmodel
     */
    readonly conflictResolvingModel: string;

    /**
     * The `ObjectType` name that is used to resolve profile merging conflicts when choosing `SOURCE` as the `ConflictResolvingModel` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-conflictresolution.html#cfn-customerprofiles-domain-conflictresolution-sourcename
     */
    readonly sourceName?: string;
  }

  /**
   * A list of matching attributes that represent matching criteria.
   *
   * If two profiles meet at least one of the requirements in the matching attributes list, they will be merged.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-consolidation.html
   */
  export interface ConsolidationProperty {
    /**
     * A list of matching criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-consolidation.html#cfn-customerprofiles-domain-consolidation-matchingattributeslist
     */
    readonly matchingAttributesList: Array<Array<string>> | cdk.IResolvable;
  }

  /**
   * Configuration information for exporting Identity Resolution results, for example, to an S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-exportingconfig.html
   */
  export interface ExportingConfigProperty {
    /**
     * The S3 location where Identity Resolution Jobs write result files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-exportingconfig.html#cfn-customerprofiles-domain-exportingconfig-s3exporting
     */
    readonly s3Exporting?: cdk.IResolvable | CfnDomain.S3ExportingConfigProperty;
  }

  /**
   * The S3 location where Identity Resolution Jobs write result files.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-s3exportingconfig.html
   */
  export interface S3ExportingConfigProperty {
    /**
     * The name of the S3 bucket where Identity Resolution Jobs write result files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-s3exportingconfig.html#cfn-customerprofiles-domain-s3exportingconfig-s3bucketname
     */
    readonly s3BucketName: string;

    /**
     * The S3 key name of the location where Identity Resolution Jobs write result files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-s3exportingconfig.html#cfn-customerprofiles-domain-s3exportingconfig-s3keyname
     */
    readonly s3KeyName?: string;
  }

  /**
   * The day and time when do you want to start the Identity Resolution Job every week.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-jobschedule.html
   */
  export interface JobScheduleProperty {
    /**
     * The day when the Identity Resolution Job should run every week.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-jobschedule.html#cfn-customerprofiles-domain-jobschedule-dayoftheweek
     */
    readonly dayOfTheWeek: string;

    /**
     * The time when the Identity Resolution Job should run every week.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-jobschedule.html#cfn-customerprofiles-domain-jobschedule-time
     */
    readonly time: string;
  }

  /**
   * The process of matching duplicate profiles using Rule-Based matching.
   *
   * If `RuleBasedMatching = true` , Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the `RuleBasedMatchingRequest` . You can use the `ListRuleBasedMatches` and `GetSimilarProfiles` API to return and review the results. Also, if you have configured `ExportingConfig` in the `RuleBasedMatchingRequest` , you can download the results from S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html
   */
  export interface RuleBasedMatchingProperty {
    /**
     * Configures information about the `AttributeTypesSelector` where the rule-based identity resolution uses to match profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-attributetypesselector
     */
    readonly attributeTypesSelector?: CfnDomain.AttributeTypesSelectorProperty | cdk.IResolvable;

    /**
     * Determines how the auto-merging process should resolve conflicts between different profiles.
     *
     * For example, if Profile A and Profile B have the same `FirstName` and `LastName` , `ConflictResolution` specifies which `EmailAddress` should be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-conflictresolution
     */
    readonly conflictResolution?: CfnDomain.ConflictResolutionProperty | cdk.IResolvable;

    /**
     * The flag that enables the matching process of duplicate profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The S3 location where Identity Resolution Jobs write result files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-exportingconfig
     */
    readonly exportingConfig?: CfnDomain.ExportingConfigProperty | cdk.IResolvable;

    /**
     * Configures how the rule-based matching process should match profiles.
     *
     * You can have up to 15 `MatchingRule` in the `MatchingRules` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-matchingrules
     */
    readonly matchingRules?: Array<cdk.IResolvable | CfnDomain.MatchingRuleProperty> | cdk.IResolvable;

    /**
     * Indicates the maximum allowed rule level for matching.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-maxallowedrulelevelformatching
     */
    readonly maxAllowedRuleLevelForMatching?: number;

    /**
     * Indicates the maximum allowed rule level for merging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-maxallowedrulelevelformerging
     */
    readonly maxAllowedRuleLevelForMerging?: number;

    /**
     * The status of rule-based matching rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-rulebasedmatching.html#cfn-customerprofiles-domain-rulebasedmatching-status
     */
    readonly status?: string;
  }

  /**
   * Configures information about the `AttributeTypesSelector` which rule-based identity resolution uses to match profiles.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-attributetypesselector.html
   */
  export interface AttributeTypesSelectorProperty {
    /**
     * The `Address` type.
     *
     * You can choose from `Address` , `BusinessAddress` , `MaillingAddress` , and `ShippingAddress` . You only can use the `Address` type in the `MatchingRule` . For example, if you want to match a profile based on `BusinessAddress.City` or `MaillingAddress.City` , you can choose the `BusinessAddress` and the `MaillingAddress` to represent the `Address` type and specify the `Address.City` on the matching rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-attributetypesselector.html#cfn-customerprofiles-domain-attributetypesselector-address
     */
    readonly address?: Array<string>;

    /**
     * Configures the `AttributeMatchingModel` , you can either choose `ONE_TO_ONE` or `MANY_TO_MANY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-attributetypesselector.html#cfn-customerprofiles-domain-attributetypesselector-attributematchingmodel
     */
    readonly attributeMatchingModel: string;

    /**
     * The Email type.
     *
     * You can choose from `EmailAddress` , `BusinessEmailAddress` and `PersonalEmailAddress` . You only can use the `EmailAddress` type in the `MatchingRule` . For example, if you want to match profile based on `PersonalEmailAddress` or `BusinessEmailAddress` , you can choose the `PersonalEmailAddress` and the `BusinessEmailAddress` to represent the `EmailAddress` type and only specify the `EmailAddress` on the matching rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-attributetypesselector.html#cfn-customerprofiles-domain-attributetypesselector-emailaddress
     */
    readonly emailAddress?: Array<string>;

    /**
     * The `PhoneNumber` type.
     *
     * You can choose from `PhoneNumber` , `HomePhoneNumber` , and `MobilePhoneNumber` . You only can use the `PhoneNumber` type in the `MatchingRule` . For example, if you want to match a profile based on `Phone` or `HomePhone` , you can choose the `Phone` and the `HomePhone` to represent the `PhoneNumber` type and only specify the `PhoneNumber` on the matching rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-attributetypesselector.html#cfn-customerprofiles-domain-attributetypesselector-phonenumber
     */
    readonly phoneNumber?: Array<string>;
  }

  /**
   * Specifies how the rule-based matching process should match profiles.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matchingrule.html
   */
  export interface MatchingRuleProperty {
    /**
     * A single rule level of the `MatchRules` .
     *
     * Configures how the rule-based matching process should match profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-matchingrule.html#cfn-customerprofiles-domain-matchingrule-rule
     */
    readonly rule: Array<string>;
  }

  /**
   * Usage-specific statistics about the domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-domainstats.html
   */
  export interface DomainStatsProperty {
    /**
     * The number of profiles that you are currently paying for in the domain.
     *
     * If you have more than 100 objects associated with a single profile, that profile counts as two profiles. If you have more than 200 objects, that profile counts as three, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-domainstats.html#cfn-customerprofiles-domain-domainstats-meteringprofilecount
     */
    readonly meteringProfileCount?: number;

    /**
     * The total number of objects in domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-domainstats.html#cfn-customerprofiles-domain-domainstats-objectcount
     */
    readonly objectCount?: number;

    /**
     * The total number of profiles currently in the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-domainstats.html#cfn-customerprofiles-domain-domainstats-profilecount
     */
    readonly profileCount?: number;

    /**
     * The total size, in bytes, of all objects in the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-domain-domainstats.html#cfn-customerprofiles-domain-domainstats-totalsize
     */
    readonly totalSize?: number;
  }
}

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html
 */
export interface CfnDomainProps {
  /**
   * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications.
   *
   * You must set up a policy on the `DeadLetterQueue` for the `SendMessage` operation to enable Amazon Connect Customer Profiles to send messages to the `DeadLetterQueue` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-deadletterqueueurl
   */
  readonly deadLetterQueueUrl?: string;

  /**
   * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified.
   *
   * It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultencryptionkey
   */
  readonly defaultEncryptionKey?: string;

  /**
   * The default number of days until the data within the domain expires.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultexpirationdays
   */
  readonly defaultExpirationDays?: number;

  /**
   * The unique name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-domainname
   */
  readonly domainName: string;

  /**
   * The process of matching duplicate profiles.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-matching
   */
  readonly matching?: cdk.IResolvable | CfnDomain.MatchingProperty;

  /**
   * The process of matching duplicate profiles using Rule-Based matching.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-rulebasedmatching
   */
  readonly ruleBasedMatching?: cdk.IResolvable | CfnDomain.RuleBasedMatchingProperty;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ConflictResolutionProperty`
 *
 * @param properties - the TypeScript properties of a `ConflictResolutionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConflictResolutionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conflictResolvingModel", cdk.requiredValidator)(properties.conflictResolvingModel));
  errors.collect(cdk.propertyValidator("conflictResolvingModel", cdk.validateString)(properties.conflictResolvingModel));
  errors.collect(cdk.propertyValidator("sourceName", cdk.validateString)(properties.sourceName));
  return errors.wrap("supplied properties not correct for \"ConflictResolutionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainConflictResolutionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConflictResolutionPropertyValidator(properties).assertSuccess();
  return {
    "ConflictResolvingModel": cdk.stringToCloudFormation(properties.conflictResolvingModel),
    "SourceName": cdk.stringToCloudFormation(properties.sourceName)
  };
}

// @ts-ignore TS6133
function CfnDomainConflictResolutionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ConflictResolutionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ConflictResolutionProperty>();
  ret.addPropertyResult("conflictResolvingModel", "ConflictResolvingModel", (properties.ConflictResolvingModel != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictResolvingModel) : undefined));
  ret.addPropertyResult("sourceName", "SourceName", (properties.SourceName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConsolidationProperty`
 *
 * @param properties - the TypeScript properties of a `ConsolidationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConsolidationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchingAttributesList", cdk.requiredValidator)(properties.matchingAttributesList));
  errors.collect(cdk.propertyValidator("matchingAttributesList", cdk.listValidator(cdk.listValidator(cdk.validateString)))(properties.matchingAttributesList));
  return errors.wrap("supplied properties not correct for \"ConsolidationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainConsolidationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConsolidationPropertyValidator(properties).assertSuccess();
  return {
    "MatchingAttributesList": cdk.listMapper(cdk.listMapper(cdk.stringToCloudFormation))(properties.matchingAttributesList)
  };
}

// @ts-ignore TS6133
function CfnDomainConsolidationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ConsolidationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ConsolidationProperty>();
  ret.addPropertyResult("matchingAttributesList", "MatchingAttributesList", (properties.MatchingAttributesList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString))(properties.MatchingAttributesList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoMergingProperty`
 *
 * @param properties - the TypeScript properties of a `AutoMergingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainAutoMergingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conflictResolution", CfnDomainConflictResolutionPropertyValidator)(properties.conflictResolution));
  errors.collect(cdk.propertyValidator("consolidation", CfnDomainConsolidationPropertyValidator)(properties.consolidation));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("minAllowedConfidenceScoreForMerging", cdk.validateNumber)(properties.minAllowedConfidenceScoreForMerging));
  return errors.wrap("supplied properties not correct for \"AutoMergingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainAutoMergingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainAutoMergingPropertyValidator(properties).assertSuccess();
  return {
    "ConflictResolution": convertCfnDomainConflictResolutionPropertyToCloudFormation(properties.conflictResolution),
    "Consolidation": convertCfnDomainConsolidationPropertyToCloudFormation(properties.consolidation),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "MinAllowedConfidenceScoreForMerging": cdk.numberToCloudFormation(properties.minAllowedConfidenceScoreForMerging)
  };
}

// @ts-ignore TS6133
function CfnDomainAutoMergingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.AutoMergingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.AutoMergingProperty>();
  ret.addPropertyResult("conflictResolution", "ConflictResolution", (properties.ConflictResolution != null ? CfnDomainConflictResolutionPropertyFromCloudFormation(properties.ConflictResolution) : undefined));
  ret.addPropertyResult("consolidation", "Consolidation", (properties.Consolidation != null ? CfnDomainConsolidationPropertyFromCloudFormation(properties.Consolidation) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("minAllowedConfidenceScoreForMerging", "MinAllowedConfidenceScoreForMerging", (properties.MinAllowedConfidenceScoreForMerging != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinAllowedConfidenceScoreForMerging) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ExportingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ExportingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainS3ExportingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.requiredValidator)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3KeyName", cdk.validateString)(properties.s3KeyName));
  return errors.wrap("supplied properties not correct for \"S3ExportingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainS3ExportingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainS3ExportingConfigPropertyValidator(properties).assertSuccess();
  return {
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3KeyName": cdk.stringToCloudFormation(properties.s3KeyName)
  };
}

// @ts-ignore TS6133
function CfnDomainS3ExportingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.S3ExportingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.S3ExportingConfigProperty>();
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3KeyName", "S3KeyName", (properties.S3KeyName != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExportingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ExportingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainExportingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Exporting", CfnDomainS3ExportingConfigPropertyValidator)(properties.s3Exporting));
  return errors.wrap("supplied properties not correct for \"ExportingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainExportingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainExportingConfigPropertyValidator(properties).assertSuccess();
  return {
    "S3Exporting": convertCfnDomainS3ExportingConfigPropertyToCloudFormation(properties.s3Exporting)
  };
}

// @ts-ignore TS6133
function CfnDomainExportingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ExportingConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ExportingConfigProperty>();
  ret.addPropertyResult("s3Exporting", "S3Exporting", (properties.S3Exporting != null ? CfnDomainS3ExportingConfigPropertyFromCloudFormation(properties.S3Exporting) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `JobScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainJobSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dayOfTheWeek", cdk.requiredValidator)(properties.dayOfTheWeek));
  errors.collect(cdk.propertyValidator("dayOfTheWeek", cdk.validateString)(properties.dayOfTheWeek));
  errors.collect(cdk.propertyValidator("time", cdk.requiredValidator)(properties.time));
  errors.collect(cdk.propertyValidator("time", cdk.validateString)(properties.time));
  return errors.wrap("supplied properties not correct for \"JobScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainJobSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainJobSchedulePropertyValidator(properties).assertSuccess();
  return {
    "DayOfTheWeek": cdk.stringToCloudFormation(properties.dayOfTheWeek),
    "Time": cdk.stringToCloudFormation(properties.time)
  };
}

// @ts-ignore TS6133
function CfnDomainJobSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.JobScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.JobScheduleProperty>();
  ret.addPropertyResult("dayOfTheWeek", "DayOfTheWeek", (properties.DayOfTheWeek != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfTheWeek) : undefined));
  ret.addPropertyResult("time", "Time", (properties.Time != null ? cfn_parse.FromCloudFormation.getString(properties.Time) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchingProperty`
 *
 * @param properties - the TypeScript properties of a `MatchingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainMatchingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoMerging", CfnDomainAutoMergingPropertyValidator)(properties.autoMerging));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("exportingConfig", CfnDomainExportingConfigPropertyValidator)(properties.exportingConfig));
  errors.collect(cdk.propertyValidator("jobSchedule", CfnDomainJobSchedulePropertyValidator)(properties.jobSchedule));
  return errors.wrap("supplied properties not correct for \"MatchingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainMatchingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainMatchingPropertyValidator(properties).assertSuccess();
  return {
    "AutoMerging": convertCfnDomainAutoMergingPropertyToCloudFormation(properties.autoMerging),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "ExportingConfig": convertCfnDomainExportingConfigPropertyToCloudFormation(properties.exportingConfig),
    "JobSchedule": convertCfnDomainJobSchedulePropertyToCloudFormation(properties.jobSchedule)
  };
}

// @ts-ignore TS6133
function CfnDomainMatchingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.MatchingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.MatchingProperty>();
  ret.addPropertyResult("autoMerging", "AutoMerging", (properties.AutoMerging != null ? CfnDomainAutoMergingPropertyFromCloudFormation(properties.AutoMerging) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("exportingConfig", "ExportingConfig", (properties.ExportingConfig != null ? CfnDomainExportingConfigPropertyFromCloudFormation(properties.ExportingConfig) : undefined));
  ret.addPropertyResult("jobSchedule", "JobSchedule", (properties.JobSchedule != null ? CfnDomainJobSchedulePropertyFromCloudFormation(properties.JobSchedule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttributeTypesSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeTypesSelectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainAttributeTypesSelectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.listValidator(cdk.validateString))(properties.address));
  errors.collect(cdk.propertyValidator("attributeMatchingModel", cdk.requiredValidator)(properties.attributeMatchingModel));
  errors.collect(cdk.propertyValidator("attributeMatchingModel", cdk.validateString)(properties.attributeMatchingModel));
  errors.collect(cdk.propertyValidator("emailAddress", cdk.listValidator(cdk.validateString))(properties.emailAddress));
  errors.collect(cdk.propertyValidator("phoneNumber", cdk.listValidator(cdk.validateString))(properties.phoneNumber));
  return errors.wrap("supplied properties not correct for \"AttributeTypesSelectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainAttributeTypesSelectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainAttributeTypesSelectorPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.listMapper(cdk.stringToCloudFormation)(properties.address),
    "AttributeMatchingModel": cdk.stringToCloudFormation(properties.attributeMatchingModel),
    "EmailAddress": cdk.listMapper(cdk.stringToCloudFormation)(properties.emailAddress),
    "PhoneNumber": cdk.listMapper(cdk.stringToCloudFormation)(properties.phoneNumber)
  };
}

// @ts-ignore TS6133
function CfnDomainAttributeTypesSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.AttributeTypesSelectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.AttributeTypesSelectorProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Address) : undefined));
  ret.addPropertyResult("attributeMatchingModel", "AttributeMatchingModel", (properties.AttributeMatchingModel != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeMatchingModel) : undefined));
  ret.addPropertyResult("emailAddress", "EmailAddress", (properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EmailAddress) : undefined));
  ret.addPropertyResult("phoneNumber", "PhoneNumber", (properties.PhoneNumber != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PhoneNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MatchingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainMatchingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rule", cdk.requiredValidator)(properties.rule));
  errors.collect(cdk.propertyValidator("rule", cdk.listValidator(cdk.validateString))(properties.rule));
  return errors.wrap("supplied properties not correct for \"MatchingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainMatchingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainMatchingRulePropertyValidator(properties).assertSuccess();
  return {
    "Rule": cdk.listMapper(cdk.stringToCloudFormation)(properties.rule)
  };
}

// @ts-ignore TS6133
function CfnDomainMatchingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.MatchingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.MatchingRuleProperty>();
  ret.addPropertyResult("rule", "Rule", (properties.Rule != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Rule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleBasedMatchingProperty`
 *
 * @param properties - the TypeScript properties of a `RuleBasedMatchingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainRuleBasedMatchingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeTypesSelector", CfnDomainAttributeTypesSelectorPropertyValidator)(properties.attributeTypesSelector));
  errors.collect(cdk.propertyValidator("conflictResolution", CfnDomainConflictResolutionPropertyValidator)(properties.conflictResolution));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("exportingConfig", CfnDomainExportingConfigPropertyValidator)(properties.exportingConfig));
  errors.collect(cdk.propertyValidator("matchingRules", cdk.listValidator(CfnDomainMatchingRulePropertyValidator))(properties.matchingRules));
  errors.collect(cdk.propertyValidator("maxAllowedRuleLevelForMatching", cdk.validateNumber)(properties.maxAllowedRuleLevelForMatching));
  errors.collect(cdk.propertyValidator("maxAllowedRuleLevelForMerging", cdk.validateNumber)(properties.maxAllowedRuleLevelForMerging));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"RuleBasedMatchingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainRuleBasedMatchingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainRuleBasedMatchingPropertyValidator(properties).assertSuccess();
  return {
    "AttributeTypesSelector": convertCfnDomainAttributeTypesSelectorPropertyToCloudFormation(properties.attributeTypesSelector),
    "ConflictResolution": convertCfnDomainConflictResolutionPropertyToCloudFormation(properties.conflictResolution),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "ExportingConfig": convertCfnDomainExportingConfigPropertyToCloudFormation(properties.exportingConfig),
    "MatchingRules": cdk.listMapper(convertCfnDomainMatchingRulePropertyToCloudFormation)(properties.matchingRules),
    "MaxAllowedRuleLevelForMatching": cdk.numberToCloudFormation(properties.maxAllowedRuleLevelForMatching),
    "MaxAllowedRuleLevelForMerging": cdk.numberToCloudFormation(properties.maxAllowedRuleLevelForMerging),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnDomainRuleBasedMatchingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.RuleBasedMatchingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.RuleBasedMatchingProperty>();
  ret.addPropertyResult("attributeTypesSelector", "AttributeTypesSelector", (properties.AttributeTypesSelector != null ? CfnDomainAttributeTypesSelectorPropertyFromCloudFormation(properties.AttributeTypesSelector) : undefined));
  ret.addPropertyResult("conflictResolution", "ConflictResolution", (properties.ConflictResolution != null ? CfnDomainConflictResolutionPropertyFromCloudFormation(properties.ConflictResolution) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("exportingConfig", "ExportingConfig", (properties.ExportingConfig != null ? CfnDomainExportingConfigPropertyFromCloudFormation(properties.ExportingConfig) : undefined));
  ret.addPropertyResult("matchingRules", "MatchingRules", (properties.MatchingRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDomainMatchingRulePropertyFromCloudFormation)(properties.MatchingRules) : undefined));
  ret.addPropertyResult("maxAllowedRuleLevelForMatching", "MaxAllowedRuleLevelForMatching", (properties.MaxAllowedRuleLevelForMatching != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAllowedRuleLevelForMatching) : undefined));
  ret.addPropertyResult("maxAllowedRuleLevelForMerging", "MaxAllowedRuleLevelForMerging", (properties.MaxAllowedRuleLevelForMerging != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAllowedRuleLevelForMerging) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainStatsProperty`
 *
 * @param properties - the TypeScript properties of a `DomainStatsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainDomainStatsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("meteringProfileCount", cdk.validateNumber)(properties.meteringProfileCount));
  errors.collect(cdk.propertyValidator("objectCount", cdk.validateNumber)(properties.objectCount));
  errors.collect(cdk.propertyValidator("profileCount", cdk.validateNumber)(properties.profileCount));
  errors.collect(cdk.propertyValidator("totalSize", cdk.validateNumber)(properties.totalSize));
  return errors.wrap("supplied properties not correct for \"DomainStatsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainDomainStatsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainDomainStatsPropertyValidator(properties).assertSuccess();
  return {
    "MeteringProfileCount": cdk.numberToCloudFormation(properties.meteringProfileCount),
    "ObjectCount": cdk.numberToCloudFormation(properties.objectCount),
    "ProfileCount": cdk.numberToCloudFormation(properties.profileCount),
    "TotalSize": cdk.numberToCloudFormation(properties.totalSize)
  };
}

// @ts-ignore TS6133
function CfnDomainDomainStatsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.DomainStatsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.DomainStatsProperty>();
  ret.addPropertyResult("meteringProfileCount", "MeteringProfileCount", (properties.MeteringProfileCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MeteringProfileCount) : undefined));
  ret.addPropertyResult("objectCount", "ObjectCount", (properties.ObjectCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectCount) : undefined));
  ret.addPropertyResult("profileCount", "ProfileCount", (properties.ProfileCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProfileCount) : undefined));
  ret.addPropertyResult("totalSize", "TotalSize", (properties.TotalSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deadLetterQueueUrl", cdk.validateString)(properties.deadLetterQueueUrl));
  errors.collect(cdk.propertyValidator("defaultEncryptionKey", cdk.validateString)(properties.defaultEncryptionKey));
  errors.collect(cdk.propertyValidator("defaultExpirationDays", cdk.validateNumber)(properties.defaultExpirationDays));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("matching", CfnDomainMatchingPropertyValidator)(properties.matching));
  errors.collect(cdk.propertyValidator("ruleBasedMatching", CfnDomainRuleBasedMatchingPropertyValidator)(properties.ruleBasedMatching));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDomainProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainPropsValidator(properties).assertSuccess();
  return {
    "DeadLetterQueueUrl": cdk.stringToCloudFormation(properties.deadLetterQueueUrl),
    "DefaultEncryptionKey": cdk.stringToCloudFormation(properties.defaultEncryptionKey),
    "DefaultExpirationDays": cdk.numberToCloudFormation(properties.defaultExpirationDays),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "Matching": convertCfnDomainMatchingPropertyToCloudFormation(properties.matching),
    "RuleBasedMatching": convertCfnDomainRuleBasedMatchingPropertyToCloudFormation(properties.ruleBasedMatching),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
  ret.addPropertyResult("deadLetterQueueUrl", "DeadLetterQueueUrl", (properties.DeadLetterQueueUrl != null ? cfn_parse.FromCloudFormation.getString(properties.DeadLetterQueueUrl) : undefined));
  ret.addPropertyResult("defaultEncryptionKey", "DefaultEncryptionKey", (properties.DefaultEncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultEncryptionKey) : undefined));
  ret.addPropertyResult("defaultExpirationDays", "DefaultExpirationDays", (properties.DefaultExpirationDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultExpirationDays) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("matching", "Matching", (properties.Matching != null ? CfnDomainMatchingPropertyFromCloudFormation(properties.Matching) : undefined));
  ret.addPropertyResult("ruleBasedMatching", "RuleBasedMatching", (properties.RuleBasedMatching != null ? CfnDomainRuleBasedMatchingPropertyFromCloudFormation(properties.RuleBasedMatching) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An Event Stream resource of Amazon Connect Customer Profiles.
 *
 * @cloudformationResource AWS::CustomerProfiles::EventStream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html
 */
export class CfnEventStream extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CustomerProfiles::EventStream";

  /**
   * Build a CfnEventStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventStream(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp of when the export was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * Details regarding the Kinesis stream.
   *
   * @cloudformationAttribute DestinationDetails
   */
  public readonly attrDestinationDetails: cdk.IResolvable;

  /**
   * @cloudformationAttribute DestinationDetails.Status
   */
  public readonly attrDestinationDetailsStatus: string;

  /**
   * @cloudformationAttribute DestinationDetails.Uri
   */
  public readonly attrDestinationDetailsUri: string;

  /**
   * A unique identifier for the event stream.
   *
   * @cloudformationAttribute EventStreamArn
   */
  public readonly attrEventStreamArn: string;

  /**
   * The operational state of destination stream for export.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The unique name of the domain.
   */
  public domainName: string;

  /**
   * The name of the event stream.
   */
  public eventStreamName: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The StreamARN of the destination to deliver profile events to.
   */
  public uri: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventStreamProps) {
    super(scope, id, {
      "type": CfnEventStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);
    cdk.requireProperty(props, "eventStreamName", this);
    cdk.requireProperty(props, "uri", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDestinationDetails = this.getAtt("DestinationDetails");
    this.attrDestinationDetailsStatus = cdk.Token.asString(this.getAtt("DestinationDetails.Status", cdk.ResolutionTypeHint.STRING));
    this.attrDestinationDetailsUri = cdk.Token.asString(this.getAtt("DestinationDetails.Uri", cdk.ResolutionTypeHint.STRING));
    this.attrEventStreamArn = cdk.Token.asString(this.getAtt("EventStreamArn", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.domainName = props.domainName;
    this.eventStreamName = props.eventStreamName;
    this.tags = props.tags;
    this.uri = props.uri;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domainName": this.domainName,
      "eventStreamName": this.eventStreamName,
      "tags": this.tags,
      "uri": this.uri
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventStreamPropsToCloudFormation(props);
  }
}

export namespace CfnEventStream {
  /**
   * Details regarding the Kinesis stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-eventstream-destinationdetails.html
   */
  export interface DestinationDetailsProperty {
    /**
     * The status of enabling the Kinesis stream as a destination for export.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-eventstream-destinationdetails.html#cfn-customerprofiles-eventstream-destinationdetails-status
     */
    readonly status: string;

    /**
     * The StreamARN of the destination to deliver profile events to.
     *
     * For example, arn:aws:kinesis:region:account-id:stream/stream-name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-eventstream-destinationdetails.html#cfn-customerprofiles-eventstream-destinationdetails-uri
     */
    readonly uri: string;
  }
}

/**
 * Properties for defining a `CfnEventStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html
 */
export interface CfnEventStreamProps {
  /**
   * The unique name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html#cfn-customerprofiles-eventstream-domainname
   */
  readonly domainName: string;

  /**
   * The name of the event stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html#cfn-customerprofiles-eventstream-eventstreamname
   */
  readonly eventStreamName: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html#cfn-customerprofiles-eventstream-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The StreamARN of the destination to deliver profile events to.
   *
   * For example, arn:aws:kinesis:region:account-id:stream/stream-name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-eventstream.html#cfn-customerprofiles-eventstream-uri
   */
  readonly uri: string;
}

/**
 * Determine whether the given properties match those of a `DestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventStreamDestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("uri", cdk.requiredValidator)(properties.uri));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"DestinationDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventStreamDestinationDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventStreamDestinationDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnEventStreamDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventStream.DestinationDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventStream.DestinationDetailsProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEventStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("eventStreamName", cdk.requiredValidator)(properties.eventStreamName));
  errors.collect(cdk.propertyValidator("eventStreamName", cdk.validateString)(properties.eventStreamName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("uri", cdk.requiredValidator)(properties.uri));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"CfnEventStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnEventStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventStreamPropsValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EventStreamName": cdk.stringToCloudFormation(properties.eventStreamName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnEventStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventStreamProps>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("eventStreamName", "EventStreamName", (properties.EventStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.EventStreamName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an Amazon Connect Customer Profiles Integration.
 *
 * @cloudformationResource AWS::CustomerProfiles::Integration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html
 */
export class CfnIntegration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CustomerProfiles::Integration";

  /**
   * Build a CfnIntegration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIntegration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIntegrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIntegration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp of when the integration was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The timestamp of when the integration was most recently edited.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * The unique name of the domain.
   */
  public domainName: string;

  /**
   * The configuration that controls how Customer Profiles retrieves data from the source.
   */
  public flowDefinition?: CfnIntegration.FlowDefinitionProperty | cdk.IResolvable;

  /**
   * The name of the profile object type mapping to use.
   */
  public objectTypeName?: string;

  /**
   * The object type mapping.
   */
  public objectTypeNames?: Array<cdk.IResolvable | CfnIntegration.ObjectTypeMappingProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The URI of the S3 bucket or any other type of data source.
   */
  public uri?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIntegrationProps) {
    super(scope, id, {
      "type": CfnIntegration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.domainName = props.domainName;
    this.flowDefinition = props.flowDefinition;
    this.objectTypeName = props.objectTypeName;
    this.objectTypeNames = props.objectTypeNames;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::Integration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.uri = props.uri;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domainName": this.domainName,
      "flowDefinition": this.flowDefinition,
      "objectTypeName": this.objectTypeName,
      "objectTypeNames": this.objectTypeNames,
      "tags": this.tags.renderTags(),
      "uri": this.uri
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIntegration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIntegrationPropsToCloudFormation(props);
  }
}

export namespace CfnIntegration {
  /**
   * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an `ObjectTypeName` (template) used to ingest the event.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html
   */
  export interface ObjectTypeMappingProperty {
    /**
     * The key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html#cfn-customerprofiles-integration-objecttypemapping-key
     */
    readonly key: string;

    /**
     * The value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html#cfn-customerprofiles-integration-objecttypemapping-value
     */
    readonly value: string;
  }

  /**
   * The configurations that control how Customer Profiles retrieves data from the source, Amazon AppFlow.
   *
   * Customer Profiles uses this information to create an AppFlow flow on behalf of customers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html
   */
  export interface FlowDefinitionProperty {
    /**
     * A description of the flow you want to create.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-description
     */
    readonly description?: string;

    /**
     * The specified name of the flow.
     *
     * Use underscores (_) or hyphens (-) only. Spaces are not allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-flowname
     */
    readonly flowName: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key you provide for encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-kmsarn
     */
    readonly kmsArn: string;

    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-sourceflowconfig
     */
    readonly sourceFlowConfig: cdk.IResolvable | CfnIntegration.SourceFlowConfigProperty;

    /**
     * A list of tasks that Customer Profiles performs while transferring the data in the flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-tasks
     */
    readonly tasks: Array<cdk.IResolvable | CfnIntegration.TaskProperty> | cdk.IResolvable;

    /**
     * The trigger settings that determine how and when the flow runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-triggerconfig
     */
    readonly triggerConfig: cdk.IResolvable | CfnIntegration.TriggerConfigProperty;
  }

  /**
   * The `Task` property type specifies the class for modeling different type of tasks.
   *
   * Task implementation varies based on the TaskType.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html
   */
  export interface TaskProperty {
    /**
     * The operation to be performed on the provided source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-connectoroperator
     */
    readonly connectorOperator?: CfnIntegration.ConnectorOperatorProperty | cdk.IResolvable;

    /**
     * A field in a destination connector, or a field value against which Amazon AppFlow validates a source field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-destinationfield
     */
    readonly destinationField?: string;

    /**
     * The source fields to which a particular task is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-sourcefields
     */
    readonly sourceFields: Array<string>;

    /**
     * A map used to store task-related information.
     *
     * The service looks for particular information based on the TaskType.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-taskproperties
     */
    readonly taskProperties?: Array<cdk.IResolvable | CfnIntegration.TaskPropertiesMapProperty> | cdk.IResolvable;

    /**
     * Specifies the particular task implementation that Amazon AppFlow performs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-tasktype
     */
    readonly taskType: string;
  }

  /**
   * The operation to be performed on the provided source fields.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html
   */
  export interface ConnectorOperatorProperty {
    /**
     * The operation to be performed on the provided Marketo source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-marketo
     */
    readonly marketo?: string;

    /**
     * The operation to be performed on the provided Amazon S3 source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-s3
     */
    readonly s3?: string;

    /**
     * The operation to be performed on the provided Salesforce source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-salesforce
     */
    readonly salesforce?: string;

    /**
     * The operation to be performed on the provided ServiceNow source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-servicenow
     */
    readonly serviceNow?: string;

    /**
     * The operation to be performed on the provided Zendesk source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-zendesk
     */
    readonly zendesk?: string;
  }

  /**
   * A map used to store task-related information.
   *
   * The execution service looks for particular information based on the `TaskType` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html
   */
  export interface TaskPropertiesMapProperty {
    /**
     * The task property key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html#cfn-customerprofiles-integration-taskpropertiesmap-operatorpropertykey
     */
    readonly operatorPropertyKey: string;

    /**
     * The task property value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html#cfn-customerprofiles-integration-taskpropertiesmap-property
     */
    readonly property: string;
  }

  /**
   * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html
   */
  export interface TriggerConfigProperty {
    /**
     * Specifies the configuration details of a schedule-triggered flow that you define.
     *
     * Currently, these settings only apply to the Scheduled trigger type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html#cfn-customerprofiles-integration-triggerconfig-triggerproperties
     */
    readonly triggerProperties?: cdk.IResolvable | CfnIntegration.TriggerPropertiesProperty;

    /**
     * Specifies the type of flow trigger.
     *
     * It can be OnDemand, Scheduled, or Event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html#cfn-customerprofiles-integration-triggerconfig-triggertype
     */
    readonly triggerType: string;
  }

  /**
   * Specifies the configuration details that control the trigger for a flow.
   *
   * Currently, these settings only apply to the Scheduled trigger type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerproperties.html
   */
  export interface TriggerPropertiesProperty {
    /**
     * Specifies the configuration details of a schedule-triggered flow that you define.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerproperties.html#cfn-customerprofiles-integration-triggerproperties-scheduled
     */
    readonly scheduled?: cdk.IResolvable | CfnIntegration.ScheduledTriggerPropertiesProperty;
  }

  /**
   * Specifies the configuration details of a scheduled-trigger flow that you define.
   *
   * Currently, these settings only apply to the scheduled-trigger type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html
   */
  export interface ScheduledTriggerPropertiesProperty {
    /**
     * Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-datapullmode
     */
    readonly dataPullMode?: string;

    /**
     * Specifies the date range for the records to import from the connector in the first flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-firstexecutionfrom
     */
    readonly firstExecutionFrom?: number;

    /**
     * Specifies the scheduled end time for a scheduled-trigger flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleendtime
     */
    readonly scheduleEndTime?: number;

    /**
     * The scheduling expression that determines the rate at which the schedule will run, for example rate (5 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleexpression
     */
    readonly scheduleExpression: string;

    /**
     * Specifies the optional offset that is added to the time interval for a schedule-triggered flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleoffset
     */
    readonly scheduleOffset?: number;

    /**
     * Specifies the scheduled start time for a scheduled-trigger flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-schedulestarttime
     */
    readonly scheduleStartTime?: number;

    /**
     * Specifies the time zone used when referring to the date and time of a scheduled-triggered flow, such as America/New_York.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-timezone
     */
    readonly timezone?: string;
  }

  /**
   * The configuration that controls how Customer Profiles retrieves data from the source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html
   */
  export interface SourceFlowConfigProperty {
    /**
     * The name of the Amazon AppFlow connector profile.
     *
     * This name must be unique for each connector profile in the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-connectorprofilename
     */
    readonly connectorProfileName?: string;

    /**
     * The type of connector, such as Salesforce, Marketo, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-connectortype
     */
    readonly connectorType: string;

    /**
     * Defines the configuration for a scheduled incremental data pull.
     *
     * If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-incrementalpullconfig
     */
    readonly incrementalPullConfig?: CfnIntegration.IncrementalPullConfigProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required to query a particular source connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-sourceconnectorproperties
     */
    readonly sourceConnectorProperties: cdk.IResolvable | CfnIntegration.SourceConnectorPropertiesProperty;
  }

  /**
   * Specifies the information that is required to query a particular Amazon AppFlow connector.
   *
   * Customer Profiles supports Salesforce, Zendesk, Marketo, ServiceNow and Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html
   */
  export interface SourceConnectorPropertiesProperty {
    /**
     * The properties that are applied when Marketo is being used as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-marketo
     */
    readonly marketo?: cdk.IResolvable | CfnIntegration.MarketoSourcePropertiesProperty;

    /**
     * The properties that are applied when Amazon S3 is being used as the flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-s3
     */
    readonly s3?: cdk.IResolvable | CfnIntegration.S3SourcePropertiesProperty;

    /**
     * The properties that are applied when Salesforce is being used as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-salesforce
     */
    readonly salesforce?: cdk.IResolvable | CfnIntegration.SalesforceSourcePropertiesProperty;

    /**
     * The properties that are applied when ServiceNow is being used as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-servicenow
     */
    readonly serviceNow?: cdk.IResolvable | CfnIntegration.ServiceNowSourcePropertiesProperty;

    /**
     * The properties that are applied when using Zendesk as a flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-zendesk
     */
    readonly zendesk?: cdk.IResolvable | CfnIntegration.ZendeskSourcePropertiesProperty;
  }

  /**
   * The properties that are applied when Amazon S3 is being used as the flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html
   */
  export interface S3SourcePropertiesProperty {
    /**
     * The Amazon S3 bucket name where the source files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html#cfn-customerprofiles-integration-s3sourceproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The object key for the Amazon S3 bucket in which the source files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html#cfn-customerprofiles-integration-s3sourceproperties-bucketprefix
     */
    readonly bucketPrefix?: string;
  }

  /**
   * The properties that are applied when ServiceNow is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-servicenowsourceproperties.html
   */
  export interface ServiceNowSourcePropertiesProperty {
    /**
     * The object specified in the ServiceNow flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-servicenowsourceproperties.html#cfn-customerprofiles-integration-servicenowsourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when using Zendesk as a flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-zendesksourceproperties.html
   */
  export interface ZendeskSourcePropertiesProperty {
    /**
     * The object specified in the Zendesk flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-zendesksourceproperties.html#cfn-customerprofiles-integration-zendesksourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Marketo is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-marketosourceproperties.html
   */
  export interface MarketoSourcePropertiesProperty {
    /**
     * The object specified in the Marketo flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-marketosourceproperties.html#cfn-customerprofiles-integration-marketosourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Salesforce is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html
   */
  export interface SalesforceSourcePropertiesProperty {
    /**
     * The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-enabledynamicfieldupdate
     */
    readonly enableDynamicFieldUpdate?: boolean | cdk.IResolvable;

    /**
     * Indicates whether Amazon AppFlow includes deleted files in the flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-includedeletedrecords
     */
    readonly includeDeletedRecords?: boolean | cdk.IResolvable;

    /**
     * The object specified in the Salesforce flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-object
     */
    readonly object: string;
  }

  /**
   * Specifies the configuration used when importing incremental records from the source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-incrementalpullconfig.html
   */
  export interface IncrementalPullConfigProperty {
    /**
     * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-incrementalpullconfig.html#cfn-customerprofiles-integration-incrementalpullconfig-datetimetypefieldname
     */
    readonly datetimeTypeFieldName?: string;
  }
}

/**
 * Properties for defining a `CfnIntegration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html
 */
export interface CfnIntegrationProps {
  /**
   * The unique name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-domainname
   */
  readonly domainName: string;

  /**
   * The configuration that controls how Customer Profiles retrieves data from the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-flowdefinition
   */
  readonly flowDefinition?: CfnIntegration.FlowDefinitionProperty | cdk.IResolvable;

  /**
   * The name of the profile object type mapping to use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypename
   */
  readonly objectTypeName?: string;

  /**
   * The object type mapping.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypenames
   */
  readonly objectTypeNames?: Array<cdk.IResolvable | CfnIntegration.ObjectTypeMappingProperty> | cdk.IResolvable;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The URI of the S3 bucket or any other type of data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-uri
   */
  readonly uri?: string;
}

/**
 * Determine whether the given properties match those of a `ObjectTypeMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationObjectTypeMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ObjectTypeMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationObjectTypeMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationObjectTypeMappingPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIntegrationObjectTypeMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ObjectTypeMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ObjectTypeMappingProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorOperatorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationConnectorOperatorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("marketo", cdk.validateString)(properties.marketo));
  errors.collect(cdk.propertyValidator("s3", cdk.validateString)(properties.s3));
  errors.collect(cdk.propertyValidator("salesforce", cdk.validateString)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", cdk.validateString)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("zendesk", cdk.validateString)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"ConnectorOperatorProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationConnectorOperatorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationConnectorOperatorPropertyValidator(properties).assertSuccess();
  return {
    "Marketo": cdk.stringToCloudFormation(properties.marketo),
    "S3": cdk.stringToCloudFormation(properties.s3),
    "Salesforce": cdk.stringToCloudFormation(properties.salesforce),
    "ServiceNow": cdk.stringToCloudFormation(properties.serviceNow),
    "Zendesk": cdk.stringToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnIntegrationConnectorOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ConnectorOperatorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ConnectorOperatorProperty>();
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? cfn_parse.FromCloudFormation.getString(properties.Marketo) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? cfn_parse.FromCloudFormation.getString(properties.S3) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? cfn_parse.FromCloudFormation.getString(properties.Salesforce) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNow) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? cfn_parse.FromCloudFormation.getString(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskPropertiesMapProperty`
 *
 * @param properties - the TypeScript properties of a `TaskPropertiesMapProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationTaskPropertiesMapPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("operatorPropertyKey", cdk.requiredValidator)(properties.operatorPropertyKey));
  errors.collect(cdk.propertyValidator("operatorPropertyKey", cdk.validateString)(properties.operatorPropertyKey));
  errors.collect(cdk.propertyValidator("property", cdk.requiredValidator)(properties.property));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  return errors.wrap("supplied properties not correct for \"TaskPropertiesMapProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationTaskPropertiesMapPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationTaskPropertiesMapPropertyValidator(properties).assertSuccess();
  return {
    "OperatorPropertyKey": cdk.stringToCloudFormation(properties.operatorPropertyKey),
    "Property": cdk.stringToCloudFormation(properties.property)
  };
}

// @ts-ignore TS6133
function CfnIntegrationTaskPropertiesMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.TaskPropertiesMapProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TaskPropertiesMapProperty>();
  ret.addPropertyResult("operatorPropertyKey", "OperatorPropertyKey", (properties.OperatorPropertyKey != null ? cfn_parse.FromCloudFormation.getString(properties.OperatorPropertyKey) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskProperty`
 *
 * @param properties - the TypeScript properties of a `TaskProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationTaskPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorOperator", CfnIntegrationConnectorOperatorPropertyValidator)(properties.connectorOperator));
  errors.collect(cdk.propertyValidator("destinationField", cdk.validateString)(properties.destinationField));
  errors.collect(cdk.propertyValidator("sourceFields", cdk.requiredValidator)(properties.sourceFields));
  errors.collect(cdk.propertyValidator("sourceFields", cdk.listValidator(cdk.validateString))(properties.sourceFields));
  errors.collect(cdk.propertyValidator("taskProperties", cdk.listValidator(CfnIntegrationTaskPropertiesMapPropertyValidator))(properties.taskProperties));
  errors.collect(cdk.propertyValidator("taskType", cdk.requiredValidator)(properties.taskType));
  errors.collect(cdk.propertyValidator("taskType", cdk.validateString)(properties.taskType));
  return errors.wrap("supplied properties not correct for \"TaskProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationTaskPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationTaskPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorOperator": convertCfnIntegrationConnectorOperatorPropertyToCloudFormation(properties.connectorOperator),
    "DestinationField": cdk.stringToCloudFormation(properties.destinationField),
    "SourceFields": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceFields),
    "TaskProperties": cdk.listMapper(convertCfnIntegrationTaskPropertiesMapPropertyToCloudFormation)(properties.taskProperties),
    "TaskType": cdk.stringToCloudFormation(properties.taskType)
  };
}

// @ts-ignore TS6133
function CfnIntegrationTaskPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.TaskProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TaskProperty>();
  ret.addPropertyResult("connectorOperator", "ConnectorOperator", (properties.ConnectorOperator != null ? CfnIntegrationConnectorOperatorPropertyFromCloudFormation(properties.ConnectorOperator) : undefined));
  ret.addPropertyResult("destinationField", "DestinationField", (properties.DestinationField != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationField) : undefined));
  ret.addPropertyResult("sourceFields", "SourceFields", (properties.SourceFields != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceFields) : undefined));
  ret.addPropertyResult("taskProperties", "TaskProperties", (properties.TaskProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationTaskPropertiesMapPropertyFromCloudFormation)(properties.TaskProperties) : undefined));
  ret.addPropertyResult("taskType", "TaskType", (properties.TaskType != null ? cfn_parse.FromCloudFormation.getString(properties.TaskType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduledTriggerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledTriggerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationScheduledTriggerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataPullMode", cdk.validateString)(properties.dataPullMode));
  errors.collect(cdk.propertyValidator("firstExecutionFrom", cdk.validateNumber)(properties.firstExecutionFrom));
  errors.collect(cdk.propertyValidator("scheduleEndTime", cdk.validateNumber)(properties.scheduleEndTime));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleOffset", cdk.validateNumber)(properties.scheduleOffset));
  errors.collect(cdk.propertyValidator("scheduleStartTime", cdk.validateNumber)(properties.scheduleStartTime));
  errors.collect(cdk.propertyValidator("timezone", cdk.validateString)(properties.timezone));
  return errors.wrap("supplied properties not correct for \"ScheduledTriggerPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationScheduledTriggerPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationScheduledTriggerPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DataPullMode": cdk.stringToCloudFormation(properties.dataPullMode),
    "FirstExecutionFrom": cdk.numberToCloudFormation(properties.firstExecutionFrom),
    "ScheduleEndTime": cdk.numberToCloudFormation(properties.scheduleEndTime),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleOffset": cdk.numberToCloudFormation(properties.scheduleOffset),
    "ScheduleStartTime": cdk.numberToCloudFormation(properties.scheduleStartTime),
    "Timezone": cdk.stringToCloudFormation(properties.timezone)
  };
}

// @ts-ignore TS6133
function CfnIntegrationScheduledTriggerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ScheduledTriggerPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ScheduledTriggerPropertiesProperty>();
  ret.addPropertyResult("dataPullMode", "DataPullMode", (properties.DataPullMode != null ? cfn_parse.FromCloudFormation.getString(properties.DataPullMode) : undefined));
  ret.addPropertyResult("firstExecutionFrom", "FirstExecutionFrom", (properties.FirstExecutionFrom != null ? cfn_parse.FromCloudFormation.getNumber(properties.FirstExecutionFrom) : undefined));
  ret.addPropertyResult("scheduleEndTime", "ScheduleEndTime", (properties.ScheduleEndTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleEndTime) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleOffset", "ScheduleOffset", (properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined));
  ret.addPropertyResult("scheduleStartTime", "ScheduleStartTime", (properties.ScheduleStartTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleStartTime) : undefined));
  ret.addPropertyResult("timezone", "Timezone", (properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TriggerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationTriggerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scheduled", CfnIntegrationScheduledTriggerPropertiesPropertyValidator)(properties.scheduled));
  return errors.wrap("supplied properties not correct for \"TriggerPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationTriggerPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationTriggerPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Scheduled": convertCfnIntegrationScheduledTriggerPropertiesPropertyToCloudFormation(properties.scheduled)
  };
}

// @ts-ignore TS6133
function CfnIntegrationTriggerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.TriggerPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TriggerPropertiesProperty>();
  ret.addPropertyResult("scheduled", "Scheduled", (properties.Scheduled != null ? CfnIntegrationScheduledTriggerPropertiesPropertyFromCloudFormation(properties.Scheduled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TriggerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationTriggerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("triggerProperties", CfnIntegrationTriggerPropertiesPropertyValidator)(properties.triggerProperties));
  errors.collect(cdk.propertyValidator("triggerType", cdk.requiredValidator)(properties.triggerType));
  errors.collect(cdk.propertyValidator("triggerType", cdk.validateString)(properties.triggerType));
  return errors.wrap("supplied properties not correct for \"TriggerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationTriggerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationTriggerConfigPropertyValidator(properties).assertSuccess();
  return {
    "TriggerProperties": convertCfnIntegrationTriggerPropertiesPropertyToCloudFormation(properties.triggerProperties),
    "TriggerType": cdk.stringToCloudFormation(properties.triggerType)
  };
}

// @ts-ignore TS6133
function CfnIntegrationTriggerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.TriggerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TriggerConfigProperty>();
  ret.addPropertyResult("triggerProperties", "TriggerProperties", (properties.TriggerProperties != null ? CfnIntegrationTriggerPropertiesPropertyFromCloudFormation(properties.TriggerProperties) : undefined));
  ret.addPropertyResult("triggerType", "TriggerType", (properties.TriggerType != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3SourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationS3SourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  return errors.wrap("supplied properties not correct for \"S3SourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationS3SourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationS3SourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix)
  };
}

// @ts-ignore TS6133
function CfnIntegrationS3SourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.S3SourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.S3SourcePropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationServiceNowSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"ServiceNowSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationServiceNowSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationServiceNowSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnIntegrationServiceNowSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ServiceNowSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ServiceNowSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZendeskSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationZendeskSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"ZendeskSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationZendeskSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationZendeskSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnIntegrationZendeskSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ZendeskSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ZendeskSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MarketoSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationMarketoSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"MarketoSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationMarketoSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationMarketoSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnIntegrationMarketoSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.MarketoSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.MarketoSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationSalesforceSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableDynamicFieldUpdate", cdk.validateBoolean)(properties.enableDynamicFieldUpdate));
  errors.collect(cdk.propertyValidator("includeDeletedRecords", cdk.validateBoolean)(properties.includeDeletedRecords));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"SalesforceSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationSalesforceSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationSalesforceSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "EnableDynamicFieldUpdate": cdk.booleanToCloudFormation(properties.enableDynamicFieldUpdate),
    "IncludeDeletedRecords": cdk.booleanToCloudFormation(properties.includeDeletedRecords),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnIntegrationSalesforceSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.SalesforceSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SalesforceSourcePropertiesProperty>();
  ret.addPropertyResult("enableDynamicFieldUpdate", "EnableDynamicFieldUpdate", (properties.EnableDynamicFieldUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDynamicFieldUpdate) : undefined));
  ret.addPropertyResult("includeDeletedRecords", "IncludeDeletedRecords", (properties.IncludeDeletedRecords != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDeletedRecords) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConnectorPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConnectorPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationSourceConnectorPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("marketo", CfnIntegrationMarketoSourcePropertiesPropertyValidator)(properties.marketo));
  errors.collect(cdk.propertyValidator("s3", CfnIntegrationS3SourcePropertiesPropertyValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("salesforce", CfnIntegrationSalesforceSourcePropertiesPropertyValidator)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", CfnIntegrationServiceNowSourcePropertiesPropertyValidator)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("zendesk", CfnIntegrationZendeskSourcePropertiesPropertyValidator)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"SourceConnectorPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationSourceConnectorPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationSourceConnectorPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Marketo": convertCfnIntegrationMarketoSourcePropertiesPropertyToCloudFormation(properties.marketo),
    "S3": convertCfnIntegrationS3SourcePropertiesPropertyToCloudFormation(properties.s3),
    "Salesforce": convertCfnIntegrationSalesforceSourcePropertiesPropertyToCloudFormation(properties.salesforce),
    "ServiceNow": convertCfnIntegrationServiceNowSourcePropertiesPropertyToCloudFormation(properties.serviceNow),
    "Zendesk": convertCfnIntegrationZendeskSourcePropertiesPropertyToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnIntegrationSourceConnectorPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.SourceConnectorPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SourceConnectorPropertiesProperty>();
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? CfnIntegrationMarketoSourcePropertiesPropertyFromCloudFormation(properties.Marketo) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnIntegrationS3SourcePropertiesPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? CfnIntegrationSalesforceSourcePropertiesPropertyFromCloudFormation(properties.Salesforce) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? CfnIntegrationServiceNowSourcePropertiesPropertyFromCloudFormation(properties.ServiceNow) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? CfnIntegrationZendeskSourcePropertiesPropertyFromCloudFormation(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IncrementalPullConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IncrementalPullConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationIncrementalPullConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datetimeTypeFieldName", cdk.validateString)(properties.datetimeTypeFieldName));
  return errors.wrap("supplied properties not correct for \"IncrementalPullConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationIncrementalPullConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationIncrementalPullConfigPropertyValidator(properties).assertSuccess();
  return {
    "DatetimeTypeFieldName": cdk.stringToCloudFormation(properties.datetimeTypeFieldName)
  };
}

// @ts-ignore TS6133
function CfnIntegrationIncrementalPullConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.IncrementalPullConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.IncrementalPullConfigProperty>();
  ret.addPropertyResult("datetimeTypeFieldName", "DatetimeTypeFieldName", (properties.DatetimeTypeFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DatetimeTypeFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationSourceFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorProfileName", cdk.validateString)(properties.connectorProfileName));
  errors.collect(cdk.propertyValidator("connectorType", cdk.requiredValidator)(properties.connectorType));
  errors.collect(cdk.propertyValidator("connectorType", cdk.validateString)(properties.connectorType));
  errors.collect(cdk.propertyValidator("incrementalPullConfig", CfnIntegrationIncrementalPullConfigPropertyValidator)(properties.incrementalPullConfig));
  errors.collect(cdk.propertyValidator("sourceConnectorProperties", cdk.requiredValidator)(properties.sourceConnectorProperties));
  errors.collect(cdk.propertyValidator("sourceConnectorProperties", CfnIntegrationSourceConnectorPropertiesPropertyValidator)(properties.sourceConnectorProperties));
  return errors.wrap("supplied properties not correct for \"SourceFlowConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationSourceFlowConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationSourceFlowConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorProfileName": cdk.stringToCloudFormation(properties.connectorProfileName),
    "ConnectorType": cdk.stringToCloudFormation(properties.connectorType),
    "IncrementalPullConfig": convertCfnIntegrationIncrementalPullConfigPropertyToCloudFormation(properties.incrementalPullConfig),
    "SourceConnectorProperties": convertCfnIntegrationSourceConnectorPropertiesPropertyToCloudFormation(properties.sourceConnectorProperties)
  };
}

// @ts-ignore TS6133
function CfnIntegrationSourceFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.SourceFlowConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SourceFlowConfigProperty>();
  ret.addPropertyResult("connectorProfileName", "ConnectorProfileName", (properties.ConnectorProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProfileName) : undefined));
  ret.addPropertyResult("connectorType", "ConnectorType", (properties.ConnectorType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorType) : undefined));
  ret.addPropertyResult("incrementalPullConfig", "IncrementalPullConfig", (properties.IncrementalPullConfig != null ? CfnIntegrationIncrementalPullConfigPropertyFromCloudFormation(properties.IncrementalPullConfig) : undefined));
  ret.addPropertyResult("sourceConnectorProperties", "SourceConnectorProperties", (properties.SourceConnectorProperties != null ? CfnIntegrationSourceConnectorPropertiesPropertyFromCloudFormation(properties.SourceConnectorProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FlowDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `FlowDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationFlowDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("flowName", cdk.requiredValidator)(properties.flowName));
  errors.collect(cdk.propertyValidator("flowName", cdk.validateString)(properties.flowName));
  errors.collect(cdk.propertyValidator("kmsArn", cdk.requiredValidator)(properties.kmsArn));
  errors.collect(cdk.propertyValidator("kmsArn", cdk.validateString)(properties.kmsArn));
  errors.collect(cdk.propertyValidator("sourceFlowConfig", cdk.requiredValidator)(properties.sourceFlowConfig));
  errors.collect(cdk.propertyValidator("sourceFlowConfig", CfnIntegrationSourceFlowConfigPropertyValidator)(properties.sourceFlowConfig));
  errors.collect(cdk.propertyValidator("tasks", cdk.requiredValidator)(properties.tasks));
  errors.collect(cdk.propertyValidator("tasks", cdk.listValidator(CfnIntegrationTaskPropertyValidator))(properties.tasks));
  errors.collect(cdk.propertyValidator("triggerConfig", cdk.requiredValidator)(properties.triggerConfig));
  errors.collect(cdk.propertyValidator("triggerConfig", CfnIntegrationTriggerConfigPropertyValidator)(properties.triggerConfig));
  return errors.wrap("supplied properties not correct for \"FlowDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationFlowDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationFlowDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FlowName": cdk.stringToCloudFormation(properties.flowName),
    "KmsArn": cdk.stringToCloudFormation(properties.kmsArn),
    "SourceFlowConfig": convertCfnIntegrationSourceFlowConfigPropertyToCloudFormation(properties.sourceFlowConfig),
    "Tasks": cdk.listMapper(convertCfnIntegrationTaskPropertyToCloudFormation)(properties.tasks),
    "TriggerConfig": convertCfnIntegrationTriggerConfigPropertyToCloudFormation(properties.triggerConfig)
  };
}

// @ts-ignore TS6133
function CfnIntegrationFlowDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.FlowDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.FlowDefinitionProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("flowName", "FlowName", (properties.FlowName != null ? cfn_parse.FromCloudFormation.getString(properties.FlowName) : undefined));
  ret.addPropertyResult("kmsArn", "KmsArn", (properties.KmsArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsArn) : undefined));
  ret.addPropertyResult("sourceFlowConfig", "SourceFlowConfig", (properties.SourceFlowConfig != null ? CfnIntegrationSourceFlowConfigPropertyFromCloudFormation(properties.SourceFlowConfig) : undefined));
  ret.addPropertyResult("tasks", "Tasks", (properties.Tasks != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationTaskPropertyFromCloudFormation)(properties.Tasks) : undefined));
  ret.addPropertyResult("triggerConfig", "TriggerConfig", (properties.TriggerConfig != null ? CfnIntegrationTriggerConfigPropertyFromCloudFormation(properties.TriggerConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("flowDefinition", CfnIntegrationFlowDefinitionPropertyValidator)(properties.flowDefinition));
  errors.collect(cdk.propertyValidator("objectTypeName", cdk.validateString)(properties.objectTypeName));
  errors.collect(cdk.propertyValidator("objectTypeNames", cdk.listValidator(CfnIntegrationObjectTypeMappingPropertyValidator))(properties.objectTypeNames));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"CfnIntegrationProps\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationPropsValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "FlowDefinition": convertCfnIntegrationFlowDefinitionPropertyToCloudFormation(properties.flowDefinition),
    "ObjectTypeName": cdk.stringToCloudFormation(properties.objectTypeName),
    "ObjectTypeNames": cdk.listMapper(convertCfnIntegrationObjectTypeMappingPropertyToCloudFormation)(properties.objectTypeNames),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegrationProps>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("flowDefinition", "FlowDefinition", (properties.FlowDefinition != null ? CfnIntegrationFlowDefinitionPropertyFromCloudFormation(properties.FlowDefinition) : undefined));
  ret.addPropertyResult("objectTypeName", "ObjectTypeName", (properties.ObjectTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTypeName) : undefined));
  ret.addPropertyResult("objectTypeNames", "ObjectTypeNames", (properties.ObjectTypeNames != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationObjectTypeMappingPropertyFromCloudFormation)(properties.ObjectTypeNames) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an Amazon Connect Customer Profiles Object Type Mapping.
 *
 * @cloudformationResource AWS::CustomerProfiles::ObjectType
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html
 */
export class CfnObjectType extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CustomerProfiles::ObjectType";

  /**
   * Build a CfnObjectType from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnObjectType {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnObjectTypePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnObjectType(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp of when the object type was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The timestamp of when the object type was most recently edited.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type.
   */
  public allowProfileCreation?: boolean | cdk.IResolvable;

  /**
   * The description of the profile object type mapping.
   */
  public description?: string;

  /**
   * The unique name of the domain.
   */
  public domainName: string;

  /**
   * The customer-provided key to encrypt the profile object that will be created in this profile object type mapping.
   */
  public encryptionKey?: string;

  /**
   * The number of days until the data of this type expires.
   */
  public expirationDays?: number;

  /**
   * A list of field definitions for the object type mapping.
   */
  public fields?: Array<CfnObjectType.FieldMapProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of keys that can be used to map data to the profile or search for the profile.
   */
  public keys?: Array<cdk.IResolvable | CfnObjectType.KeyMapProperty> | cdk.IResolvable;

  /**
   * The name of the profile object type.
   */
  public objectTypeName?: string;

  /**
   * The format of your sourceLastUpdatedTimestamp that was previously set up.
   */
  public sourceLastUpdatedTimestampFormat?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A unique identifier for the template mapping.
   */
  public templateId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnObjectTypeProps) {
    super(scope, id, {
      "type": CfnObjectType.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.allowProfileCreation = props.allowProfileCreation;
    this.description = props.description;
    this.domainName = props.domainName;
    this.encryptionKey = props.encryptionKey;
    this.expirationDays = props.expirationDays;
    this.fields = props.fields;
    this.keys = props.keys;
    this.objectTypeName = props.objectTypeName;
    this.sourceLastUpdatedTimestampFormat = props.sourceLastUpdatedTimestampFormat;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::ObjectType", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateId = props.templateId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowProfileCreation": this.allowProfileCreation,
      "description": this.description,
      "domainName": this.domainName,
      "encryptionKey": this.encryptionKey,
      "expirationDays": this.expirationDays,
      "fields": this.fields,
      "keys": this.keys,
      "objectTypeName": this.objectTypeName,
      "sourceLastUpdatedTimestampFormat": this.sourceLastUpdatedTimestampFormat,
      "tags": this.tags.renderTags(),
      "templateId": this.templateId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnObjectType.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnObjectTypePropsToCloudFormation(props);
  }
}

export namespace CfnObjectType {
  /**
   * A map of the name and ObjectType field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html
   */
  export interface FieldMapProperty {
    /**
     * Name of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html#cfn-customerprofiles-objecttype-fieldmap-name
     */
    readonly name?: string;

    /**
     * Represents a field in a ProfileObjectType.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html#cfn-customerprofiles-objecttype-fieldmap-objecttypefield
     */
    readonly objectTypeField?: cdk.IResolvable | CfnObjectType.ObjectTypeFieldProperty;
  }

  /**
   * Represents a field in a ProfileObjectType.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html
   */
  export interface ObjectTypeFieldProperty {
    /**
     * The content type of the field.
     *
     * Used for determining equality when searching.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-contenttype
     */
    readonly contentType?: string;

    /**
     * A field of a ProfileObject.
     *
     * For example: _source.FirstName, where “_source” is a ProfileObjectType of a Zendesk user and “FirstName” is a field in that ObjectType.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-source
     */
    readonly source?: string;

    /**
     * The location of the data in the standard ProfileObject model.
     *
     * For example: _profile.Address.PostalCode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-target
     */
    readonly target?: string;
  }

  /**
   * A unique key map that can be used to map data to the profile.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html
   */
  export interface KeyMapProperty {
    /**
     * Name of the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html#cfn-customerprofiles-objecttype-keymap-name
     */
    readonly name?: string;

    /**
     * A list of ObjectTypeKey.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html#cfn-customerprofiles-objecttype-keymap-objecttypekeylist
     */
    readonly objectTypeKeyList?: Array<cdk.IResolvable | CfnObjectType.ObjectTypeKeyProperty> | cdk.IResolvable;
  }

  /**
   * An object that defines the Key element of a ProfileObject.
   *
   * A Key is a special element that can be used to search for a customer profile.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html
   */
  export interface ObjectTypeKeyProperty {
    /**
     * The reference for the key name of the fields map.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html#cfn-customerprofiles-objecttype-objecttypekey-fieldnames
     */
    readonly fieldNames?: Array<string>;

    /**
     * The types of keys that a ProfileObject can have.
     *
     * Each ProfileObject can have only 1 UNIQUE key but multiple PROFILE keys. PROFILE means that this key can be used to tie an object to a PROFILE. UNIQUE means that it can be used to uniquely identify an object. If a key a is marked as SECONDARY, it will be used to search for profiles after all other PROFILE keys have been searched. A LOOKUP_ONLY key is only used to match a profile but is not persisted to be used for searching of the profile. A NEW_ONLY key is only used if the profile does not already exist before the object is ingested, otherwise it is only used for matching objects to profiles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html#cfn-customerprofiles-objecttype-objecttypekey-standardidentifiers
     */
    readonly standardIdentifiers?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnObjectType`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html
 */
export interface CfnObjectTypeProps {
  /**
   * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type.
   *
   * The default is `FALSE` . If the AllowProfileCreation flag is set to `FALSE` , then the service tries to fetch a standard profile and associate this object with the profile. If it is set to `TRUE` , and if no match is found, then the service creates a new standard profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-allowprofilecreation
   */
  readonly allowProfileCreation?: boolean | cdk.IResolvable;

  /**
   * The description of the profile object type mapping.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-description
   */
  readonly description?: string;

  /**
   * The unique name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-domainname
   */
  readonly domainName: string;

  /**
   * The customer-provided key to encrypt the profile object that will be created in this profile object type mapping.
   *
   * If not specified the system will use the encryption key of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-encryptionkey
   */
  readonly encryptionKey?: string;

  /**
   * The number of days until the data of this type expires.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-expirationdays
   */
  readonly expirationDays?: number;

  /**
   * A list of field definitions for the object type mapping.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-fields
   */
  readonly fields?: Array<CfnObjectType.FieldMapProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of keys that can be used to map data to the profile or search for the profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-keys
   */
  readonly keys?: Array<cdk.IResolvable | CfnObjectType.KeyMapProperty> | cdk.IResolvable;

  /**
   * The name of the profile object type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-objecttypename
   */
  readonly objectTypeName?: string;

  /**
   * The format of your sourceLastUpdatedTimestamp that was previously set up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-sourcelastupdatedtimestampformat
   */
  readonly sourceLastUpdatedTimestampFormat?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A unique identifier for the template mapping.
   *
   * This can be used instead of specifying the Keys and Fields properties directly.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-templateid
   */
  readonly templateId?: string;
}

/**
 * Determine whether the given properties match those of a `ObjectTypeFieldProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeFieldProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObjectTypeObjectTypeFieldPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"ObjectTypeFieldProperty\"");
}

// @ts-ignore TS6133
function convertCfnObjectTypeObjectTypeFieldPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObjectTypeObjectTypeFieldPropertyValidator(properties).assertSuccess();
  return {
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "Source": cdk.stringToCloudFormation(properties.source),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnObjectTypeObjectTypeFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnObjectType.ObjectTypeFieldProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.ObjectTypeFieldProperty>();
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldMapProperty`
 *
 * @param properties - the TypeScript properties of a `FieldMapProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObjectTypeFieldMapPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("objectTypeField", CfnObjectTypeObjectTypeFieldPropertyValidator)(properties.objectTypeField));
  return errors.wrap("supplied properties not correct for \"FieldMapProperty\"");
}

// @ts-ignore TS6133
function convertCfnObjectTypeFieldMapPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObjectTypeFieldMapPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObjectTypeField": convertCfnObjectTypeObjectTypeFieldPropertyToCloudFormation(properties.objectTypeField)
  };
}

// @ts-ignore TS6133
function CfnObjectTypeFieldMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectType.FieldMapProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.FieldMapProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("objectTypeField", "ObjectTypeField", (properties.ObjectTypeField != null ? CfnObjectTypeObjectTypeFieldPropertyFromCloudFormation(properties.ObjectTypeField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObjectTypeKeyProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObjectTypeObjectTypeKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldNames", cdk.listValidator(cdk.validateString))(properties.fieldNames));
  errors.collect(cdk.propertyValidator("standardIdentifiers", cdk.listValidator(cdk.validateString))(properties.standardIdentifiers));
  return errors.wrap("supplied properties not correct for \"ObjectTypeKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnObjectTypeObjectTypeKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObjectTypeObjectTypeKeyPropertyValidator(properties).assertSuccess();
  return {
    "FieldNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.fieldNames),
    "StandardIdentifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.standardIdentifiers)
  };
}

// @ts-ignore TS6133
function CfnObjectTypeObjectTypeKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnObjectType.ObjectTypeKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.ObjectTypeKeyProperty>();
  ret.addPropertyResult("fieldNames", "FieldNames", (properties.FieldNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FieldNames) : undefined));
  ret.addPropertyResult("standardIdentifiers", "StandardIdentifiers", (properties.StandardIdentifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StandardIdentifiers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyMapProperty`
 *
 * @param properties - the TypeScript properties of a `KeyMapProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObjectTypeKeyMapPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("objectTypeKeyList", cdk.listValidator(CfnObjectTypeObjectTypeKeyPropertyValidator))(properties.objectTypeKeyList));
  return errors.wrap("supplied properties not correct for \"KeyMapProperty\"");
}

// @ts-ignore TS6133
function convertCfnObjectTypeKeyMapPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObjectTypeKeyMapPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObjectTypeKeyList": cdk.listMapper(convertCfnObjectTypeObjectTypeKeyPropertyToCloudFormation)(properties.objectTypeKeyList)
  };
}

// @ts-ignore TS6133
function CfnObjectTypeKeyMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnObjectType.KeyMapProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.KeyMapProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("objectTypeKeyList", "ObjectTypeKeyList", (properties.ObjectTypeKeyList != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeObjectTypeKeyPropertyFromCloudFormation)(properties.ObjectTypeKeyList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnObjectTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnObjectTypeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObjectTypePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowProfileCreation", cdk.validateBoolean)(properties.allowProfileCreation));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("encryptionKey", cdk.validateString)(properties.encryptionKey));
  errors.collect(cdk.propertyValidator("expirationDays", cdk.validateNumber)(properties.expirationDays));
  errors.collect(cdk.propertyValidator("fields", cdk.listValidator(CfnObjectTypeFieldMapPropertyValidator))(properties.fields));
  errors.collect(cdk.propertyValidator("keys", cdk.listValidator(CfnObjectTypeKeyMapPropertyValidator))(properties.keys));
  errors.collect(cdk.propertyValidator("objectTypeName", cdk.validateString)(properties.objectTypeName));
  errors.collect(cdk.propertyValidator("sourceLastUpdatedTimestampFormat", cdk.validateString)(properties.sourceLastUpdatedTimestampFormat));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("templateId", cdk.validateString)(properties.templateId));
  return errors.wrap("supplied properties not correct for \"CfnObjectTypeProps\"");
}

// @ts-ignore TS6133
function convertCfnObjectTypePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObjectTypePropsValidator(properties).assertSuccess();
  return {
    "AllowProfileCreation": cdk.booleanToCloudFormation(properties.allowProfileCreation),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EncryptionKey": cdk.stringToCloudFormation(properties.encryptionKey),
    "ExpirationDays": cdk.numberToCloudFormation(properties.expirationDays),
    "Fields": cdk.listMapper(convertCfnObjectTypeFieldMapPropertyToCloudFormation)(properties.fields),
    "Keys": cdk.listMapper(convertCfnObjectTypeKeyMapPropertyToCloudFormation)(properties.keys),
    "ObjectTypeName": cdk.stringToCloudFormation(properties.objectTypeName),
    "SourceLastUpdatedTimestampFormat": cdk.stringToCloudFormation(properties.sourceLastUpdatedTimestampFormat),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TemplateId": cdk.stringToCloudFormation(properties.templateId)
  };
}

// @ts-ignore TS6133
function CfnObjectTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectTypeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectTypeProps>();
  ret.addPropertyResult("allowProfileCreation", "AllowProfileCreation", (properties.AllowProfileCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowProfileCreation) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("encryptionKey", "EncryptionKey", (properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined));
  ret.addPropertyResult("expirationDays", "ExpirationDays", (properties.ExpirationDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationDays) : undefined));
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeFieldMapPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addPropertyResult("keys", "Keys", (properties.Keys != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeKeyMapPropertyFromCloudFormation)(properties.Keys) : undefined));
  ret.addPropertyResult("objectTypeName", "ObjectTypeName", (properties.ObjectTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTypeName) : undefined));
  ret.addPropertyResult("sourceLastUpdatedTimestampFormat", "SourceLastUpdatedTimestampFormat", (properties.SourceLastUpdatedTimestampFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLastUpdatedTimestampFormat) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("templateId", "TemplateId", (properties.TemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}