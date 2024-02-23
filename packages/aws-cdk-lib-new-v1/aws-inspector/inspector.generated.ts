/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Inspector::AssessmentTarget` resource is used to create Amazon Inspector assessment targets, which specify the Amazon EC2 instances that will be analyzed during an assessment run.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTarget
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html
 */
export class CfnAssessmentTarget extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Inspector::AssessmentTarget";

  /**
   * Build a CfnAssessmentTarget from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessmentTarget {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssessmentTargetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssessmentTarget(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that specifies the assessment target that is created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the Amazon Inspector assessment target.
   */
  public assessmentTargetName?: string;

  /**
   * The ARN that specifies the resource group that is used to create the assessment target.
   */
  public resourceGroupArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssessmentTargetProps = {}) {
    super(scope, id, {
      "type": CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.assessmentTargetName = props.assessmentTargetName;
    this.resourceGroupArn = props.resourceGroupArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assessmentTargetName": this.assessmentTargetName,
      "resourceGroupArn": this.resourceGroupArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssessmentTargetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAssessmentTarget`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html
 */
export interface CfnAssessmentTargetProps {
  /**
   * The name of the Amazon Inspector assessment target.
   *
   * The name must be unique within the AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-assessmenttargetname
   */
  readonly assessmentTargetName?: string;

  /**
   * The ARN that specifies the resource group that is used to create the assessment target.
   *
   * If `resourceGroupArn` is not specified, all EC2 instances in the current AWS account and Region are included in the assessment target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-resourcegrouparn
   */
  readonly resourceGroupArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTargetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentTargetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assessmentTargetName", cdk.validateString)(properties.assessmentTargetName));
  errors.collect(cdk.propertyValidator("resourceGroupArn", cdk.validateString)(properties.resourceGroupArn));
  return errors.wrap("supplied properties not correct for \"CfnAssessmentTargetProps\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentTargetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentTargetPropsValidator(properties).assertSuccess();
  return {
    "AssessmentTargetName": cdk.stringToCloudFormation(properties.assessmentTargetName),
    "ResourceGroupArn": cdk.stringToCloudFormation(properties.resourceGroupArn)
  };
}

// @ts-ignore TS6133
function CfnAssessmentTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentTargetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentTargetProps>();
  ret.addPropertyResult("assessmentTargetName", "AssessmentTargetName", (properties.AssessmentTargetName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetName) : undefined));
  ret.addPropertyResult("resourceGroupArn", "ResourceGroupArn", (properties.ResourceGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Inspector::AssessmentTemplate` resource creates an Amazon Inspector assessment template, which specifies the Inspector assessment targets that will be evaluated by an assessment run and its related configurations.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html
 */
export class CfnAssessmentTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Inspector::AssessmentTemplate";

  /**
   * Build a CfnAssessmentTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessmentTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssessmentTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssessmentTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that specifies the assessment template that is created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ARN of the assessment target to be included in the assessment template.
   */
  public assessmentTargetArn: string;

  /**
   * The user-defined name that identifies the assessment template that you want to create.
   */
  public assessmentTemplateName?: string;

  /**
   * The duration of the assessment run in seconds.
   */
  public durationInSeconds: number;

  /**
   * The ARNs of the rules packages that you want to use in the assessment template.
   */
  public rulesPackageArns: Array<string>;

  /**
   * The user-defined attributes that are assigned to every finding that is generated by the assessment run that uses this assessment template.
   */
  public userAttributesForFindings?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssessmentTemplateProps) {
    super(scope, id, {
      "type": CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "assessmentTargetArn", this);
    cdk.requireProperty(props, "durationInSeconds", this);
    cdk.requireProperty(props, "rulesPackageArns", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.assessmentTargetArn = props.assessmentTargetArn;
    this.assessmentTemplateName = props.assessmentTemplateName;
    this.durationInSeconds = props.durationInSeconds;
    this.rulesPackageArns = props.rulesPackageArns;
    this.userAttributesForFindings = props.userAttributesForFindings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assessmentTargetArn": this.assessmentTargetArn,
      "assessmentTemplateName": this.assessmentTemplateName,
      "durationInSeconds": this.durationInSeconds,
      "rulesPackageArns": this.rulesPackageArns,
      "userAttributesForFindings": this.userAttributesForFindings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssessmentTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAssessmentTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html
 */
export interface CfnAssessmentTemplateProps {
  /**
   * The ARN of the assessment target to be included in the assessment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttargetarn
   */
  readonly assessmentTargetArn: string;

  /**
   * The user-defined name that identifies the assessment template that you want to create.
   *
   * You can create several assessment templates for the same assessment target. The names of the assessment templates that correspond to a particular assessment target must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttemplatename
   */
  readonly assessmentTemplateName?: string;

  /**
   * The duration of the assessment run in seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-durationinseconds
   */
  readonly durationInSeconds: number;

  /**
   * The ARNs of the rules packages that you want to use in the assessment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-rulespackagearns
   */
  readonly rulesPackageArns: Array<string>;

  /**
   * The user-defined attributes that are assigned to every finding that is generated by the assessment run that uses this assessment template.
   *
   * Within an assessment template, each key must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-userattributesforfindings
   */
  readonly userAttributesForFindings?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assessmentTargetArn", cdk.requiredValidator)(properties.assessmentTargetArn));
  errors.collect(cdk.propertyValidator("assessmentTargetArn", cdk.validateString)(properties.assessmentTargetArn));
  errors.collect(cdk.propertyValidator("assessmentTemplateName", cdk.validateString)(properties.assessmentTemplateName));
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.requiredValidator)(properties.durationInSeconds));
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  errors.collect(cdk.propertyValidator("rulesPackageArns", cdk.requiredValidator)(properties.rulesPackageArns));
  errors.collect(cdk.propertyValidator("rulesPackageArns", cdk.listValidator(cdk.validateString))(properties.rulesPackageArns));
  errors.collect(cdk.propertyValidator("userAttributesForFindings", cdk.listValidator(cdk.validateCfnTag))(properties.userAttributesForFindings));
  return errors.wrap("supplied properties not correct for \"CfnAssessmentTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentTemplatePropsValidator(properties).assertSuccess();
  return {
    "AssessmentTargetArn": cdk.stringToCloudFormation(properties.assessmentTargetArn),
    "AssessmentTemplateName": cdk.stringToCloudFormation(properties.assessmentTemplateName),
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds),
    "RulesPackageArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.rulesPackageArns),
    "UserAttributesForFindings": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.userAttributesForFindings)
  };
}

// @ts-ignore TS6133
function CfnAssessmentTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentTemplateProps>();
  ret.addPropertyResult("assessmentTargetArn", "AssessmentTargetArn", (properties.AssessmentTargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetArn) : undefined));
  ret.addPropertyResult("assessmentTemplateName", "AssessmentTemplateName", (properties.AssessmentTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTemplateName) : undefined));
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addPropertyResult("rulesPackageArns", "RulesPackageArns", (properties.RulesPackageArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RulesPackageArns) : undefined));
  ret.addPropertyResult("userAttributesForFindings", "UserAttributesForFindings", (properties.UserAttributesForFindings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.UserAttributesForFindings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Inspector::ResourceGroup` resource is used to create Amazon Inspector resource groups.
 *
 * A resource group defines a set of tags that, when queried, identify the AWS resources that make up the assessment target.
 *
 * @cloudformationResource AWS::Inspector::ResourceGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html
 */
export class CfnResourceGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Inspector::ResourceGroup";

  /**
   * Build a CfnResourceGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that specifies the resource group that is created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The tags (key and value pairs) that will be associated with the resource group.
   */
  public resourceGroupTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceGroupProps) {
    super(scope, id, {
      "type": CfnResourceGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceGroupTags", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.resourceGroupTags = props.resourceGroupTags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceGroupTags": this.resourceGroupTags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html
 */
export interface CfnResourceGroupProps {
  /**
   * The tags (key and value pairs) that will be associated with the resource group.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html#cfn-inspector-resourcegroup-resourcegrouptags
   */
  readonly resourceGroupTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnResourceGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceGroupTags", cdk.requiredValidator)(properties.resourceGroupTags));
  errors.collect(cdk.propertyValidator("resourceGroupTags", cdk.listValidator(cdk.validateCfnTag))(properties.resourceGroupTags));
  return errors.wrap("supplied properties not correct for \"CfnResourceGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceGroupPropsValidator(properties).assertSuccess();
  return {
    "ResourceGroupTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.resourceGroupTags)
  };
}

// @ts-ignore TS6133
function CfnResourceGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceGroupProps>();
  ret.addPropertyResult("resourceGroupTags", "ResourceGroupTags", (properties.ResourceGroupTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ResourceGroupTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}