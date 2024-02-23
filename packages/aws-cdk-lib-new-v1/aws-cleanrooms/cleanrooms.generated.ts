/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new analysis template.
 *
 * @cloudformationResource AWS::CleanRooms::AnalysisTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html
 */
export class CfnAnalysisTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CleanRooms::AnalysisTemplate";

  /**
   * Build a CfnAnalysisTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalysisTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnalysisTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnalysisTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the identifier for the analysis template.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE2222`
   *
   * @cloudformationAttribute AnalysisTemplateIdentifier
   */
  public readonly attrAnalysisTemplateIdentifier: string;

  /**
   * Returns the Amazon Resource Name (ARN) of the analysis template.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:membership/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111/analysistemplates/a1b2c3d4-5678-90ab-cdef-EXAMPLE2222`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the unique ARN for the analysis template’s associated collaboration.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:collaboration/a1b2c3d4-5678-90ab-cdef-EXAMPLE33333`
   *
   * @cloudformationAttribute CollaborationArn
   */
  public readonly attrCollaborationArn: string;

  /**
   * Returns the unique ID for the associated collaboration of the analysis template.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE33333`
   *
   * @cloudformationAttribute CollaborationIdentifier
   */
  public readonly attrCollaborationIdentifier: string;

  /**
   * Returns the Amazon Resource Name (ARN) of the member who created the analysis template.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:membership/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute MembershipArn
   */
  public readonly attrMembershipArn: string;

  /**
   * Returns the entire [schema object](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisschema.html) .
   *
   * @cloudformationAttribute Schema
   */
  public readonly attrSchema: cdk.IResolvable;

  /**
   * @cloudformationAttribute Schema.ReferencedTables
   */
  public readonly attrSchemaReferencedTables: Array<string>;

  /**
   * The parameters of the analysis template.
   */
  public analysisParameters?: Array<CfnAnalysisTemplate.AnalysisParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the analysis template.
   */
  public description?: string;

  /**
   * The format of the analysis template.
   */
  public format: string;

  /**
   * The identifier for a membership resource.
   */
  public membershipIdentifier: string;

  /**
   * The name of the analysis template.
   */
  public name: string;

  /**
   * The source of the analysis template.
   */
  public source: CfnAnalysisTemplate.AnalysisSourceProperty | cdk.IResolvable;

  /**
   * An optional label that you can assign to a resource when you create it.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnalysisTemplateProps) {
    super(scope, id, {
      "type": CfnAnalysisTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "format", this);
    cdk.requireProperty(props, "membershipIdentifier", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "source", this);

    this.attrAnalysisTemplateIdentifier = cdk.Token.asString(this.getAtt("AnalysisTemplateIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCollaborationArn = cdk.Token.asString(this.getAtt("CollaborationArn", cdk.ResolutionTypeHint.STRING));
    this.attrCollaborationIdentifier = cdk.Token.asString(this.getAtt("CollaborationIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrMembershipArn = cdk.Token.asString(this.getAtt("MembershipArn", cdk.ResolutionTypeHint.STRING));
    this.attrSchema = this.getAtt("Schema");
    this.attrSchemaReferencedTables = cdk.Token.asList(this.getAtt("Schema.ReferencedTables", cdk.ResolutionTypeHint.STRING_LIST));
    this.analysisParameters = props.analysisParameters;
    this.description = props.description;
    this.format = props.format;
    this.membershipIdentifier = props.membershipIdentifier;
    this.name = props.name;
    this.source = props.source;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "analysisParameters": this.analysisParameters,
      "description": this.description,
      "format": this.format,
      "membershipIdentifier": this.membershipIdentifier,
      "name": this.name,
      "source": this.source,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnalysisTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnalysisTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnAnalysisTemplate {
  /**
   * Optional.
   *
   * The member who can query can provide this placeholder for a literal data value in an analysis template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisparameter.html
   */
  export interface AnalysisParameterProperty {
    /**
     * Optional.
     *
     * The default value that is applied in the analysis template. The member who can query can override this value in the query editor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisparameter.html#cfn-cleanrooms-analysistemplate-analysisparameter-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The name of the parameter.
     *
     * The name must use only alphanumeric, underscore (_), or hyphen (-) characters but cannot start or end with a hyphen.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisparameter.html#cfn-cleanrooms-analysistemplate-analysisparameter-name
     */
    readonly name: string;

    /**
     * The type of parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisparameter.html#cfn-cleanrooms-analysistemplate-analysisparameter-type
     */
    readonly type: string;
  }

  /**
   * The structure that defines the body of the analysis template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysissource.html
   */
  export interface AnalysisSourceProperty {
    /**
     * The query text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysissource.html#cfn-cleanrooms-analysistemplate-analysissource-text
     */
    readonly text: string;
  }

  /**
   * A relation within an analysis.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisschema.html
   */
  export interface AnalysisSchemaProperty {
    /**
     * The tables referenced in the analysis schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-analysistemplate-analysisschema.html#cfn-cleanrooms-analysistemplate-analysisschema-referencedtables
     */
    readonly referencedTables: Array<string>;
  }
}

/**
 * Properties for defining a `CfnAnalysisTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html
 */
export interface CfnAnalysisTemplateProps {
  /**
   * The parameters of the analysis template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-analysisparameters
   */
  readonly analysisParameters?: Array<CfnAnalysisTemplate.AnalysisParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the analysis template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-description
   */
  readonly description?: string;

  /**
   * The format of the analysis template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-format
   */
  readonly format: string;

  /**
   * The identifier for a membership resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-membershipidentifier
   */
  readonly membershipIdentifier: string;

  /**
   * The name of the analysis template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-name
   */
  readonly name: string;

  /**
   * The source of the analysis template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-source
   */
  readonly source: CfnAnalysisTemplate.AnalysisSourceProperty | cdk.IResolvable;

  /**
   * An optional label that you can assign to a resource when you create it.
   *
   * Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-analysistemplate.html#cfn-cleanrooms-analysistemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AnalysisParameterProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AnalysisParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalysisTemplateAnalysisParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalysisTemplateAnalysisParameterPropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysisTemplate.AnalysisParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysisTemplate.AnalysisParameterProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("text", cdk.requiredValidator)(properties.text));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  return errors.wrap("supplied properties not correct for \"AnalysisSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalysisTemplateAnalysisSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalysisTemplateAnalysisSourcePropertyValidator(properties).assertSuccess();
  return {
    "Text": cdk.stringToCloudFormation(properties.text)
  };
}

// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysisTemplate.AnalysisSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysisTemplate.AnalysisSourceProperty>();
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisSchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referencedTables", cdk.requiredValidator)(properties.referencedTables));
  errors.collect(cdk.propertyValidator("referencedTables", cdk.listValidator(cdk.validateString))(properties.referencedTables));
  return errors.wrap("supplied properties not correct for \"AnalysisSchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalysisTemplateAnalysisSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalysisTemplateAnalysisSchemaPropertyValidator(properties).assertSuccess();
  return {
    "ReferencedTables": cdk.listMapper(cdk.stringToCloudFormation)(properties.referencedTables)
  };
}

// @ts-ignore TS6133
function CfnAnalysisTemplateAnalysisSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysisTemplate.AnalysisSchemaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysisTemplate.AnalysisSchemaProperty>();
  ret.addPropertyResult("referencedTables", "ReferencedTables", (properties.ReferencedTables != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ReferencedTables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnalysisTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnalysisTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalysisTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("analysisParameters", cdk.listValidator(CfnAnalysisTemplateAnalysisParameterPropertyValidator))(properties.analysisParameters));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("membershipIdentifier", cdk.requiredValidator)(properties.membershipIdentifier));
  errors.collect(cdk.propertyValidator("membershipIdentifier", cdk.validateString)(properties.membershipIdentifier));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", CfnAnalysisTemplateAnalysisSourcePropertyValidator)(properties.source));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAnalysisTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnAnalysisTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalysisTemplatePropsValidator(properties).assertSuccess();
  return {
    "AnalysisParameters": cdk.listMapper(convertCfnAnalysisTemplateAnalysisParameterPropertyToCloudFormation)(properties.analysisParameters),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Format": cdk.stringToCloudFormation(properties.format),
    "MembershipIdentifier": cdk.stringToCloudFormation(properties.membershipIdentifier),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Source": convertCfnAnalysisTemplateAnalysisSourcePropertyToCloudFormation(properties.source),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAnalysisTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysisTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysisTemplateProps>();
  ret.addPropertyResult("analysisParameters", "AnalysisParameters", (properties.AnalysisParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisTemplateAnalysisParameterPropertyFromCloudFormation)(properties.AnalysisParameters) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("membershipIdentifier", "MembershipIdentifier", (properties.MembershipIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.MembershipIdentifier) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? CfnAnalysisTemplateAnalysisSourcePropertyFromCloudFormation(properties.Source) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new collaboration.
 *
 * @cloudformationResource AWS::CleanRooms::Collaboration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html
 */
export class CfnCollaboration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CleanRooms::Collaboration";

  /**
   * Build a CfnCollaboration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCollaboration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCollaborationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCollaboration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified collaboration.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:collaboration/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the unique identifier of the specified collaboration.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute CollaborationIdentifier
   */
  public readonly attrCollaborationIdentifier: string;

  /**
   * A display name of the collaboration creator.
   */
  public creatorDisplayName: string;

  /**
   * The abilities granted to the collaboration creator.
   */
  public creatorMemberAbilities: Array<string>;

  /**
   * An object representing the collaboration member's payment responsibilities set by the collaboration creator.
   */
  public creatorPaymentConfiguration?: cdk.IResolvable | CfnCollaboration.PaymentConfigurationProperty;

  /**
   * The settings for client-side encryption for cryptographic computing.
   */
  public dataEncryptionMetadata?: CfnCollaboration.DataEncryptionMetadataProperty | cdk.IResolvable;

  /**
   * A description of the collaboration provided by the collaboration owner.
   */
  public description: string;

  /**
   * A list of initial members, not including the creator.
   */
  public members: Array<cdk.IResolvable | CfnCollaboration.MemberSpecificationProperty> | cdk.IResolvable;

  /**
   * A human-readable identifier provided by the collaboration owner.
   */
  public name: string;

  /**
   * An indicator as to whether query logging has been enabled or disabled for the collaboration.
   */
  public queryLogStatus: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCollaborationProps) {
    super(scope, id, {
      "type": CfnCollaboration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "creatorDisplayName", this);
    cdk.requireProperty(props, "creatorMemberAbilities", this);
    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "members", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "queryLogStatus", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCollaborationIdentifier = cdk.Token.asString(this.getAtt("CollaborationIdentifier", cdk.ResolutionTypeHint.STRING));
    this.creatorDisplayName = props.creatorDisplayName;
    this.creatorMemberAbilities = props.creatorMemberAbilities;
    this.creatorPaymentConfiguration = props.creatorPaymentConfiguration;
    this.dataEncryptionMetadata = props.dataEncryptionMetadata;
    this.description = props.description;
    this.members = props.members;
    this.name = props.name;
    this.queryLogStatus = props.queryLogStatus;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "creatorDisplayName": this.creatorDisplayName,
      "creatorMemberAbilities": this.creatorMemberAbilities,
      "creatorPaymentConfiguration": this.creatorPaymentConfiguration,
      "dataEncryptionMetadata": this.dataEncryptionMetadata,
      "description": this.description,
      "members": this.members,
      "name": this.name,
      "queryLogStatus": this.queryLogStatus,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCollaboration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCollaborationPropsToCloudFormation(props);
  }
}

export namespace CfnCollaboration {
  /**
   * The settings for client-side encryption for cryptographic computing.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-dataencryptionmetadata.html
   */
  export interface DataEncryptionMetadataProperty {
    /**
     * Indicates whether encrypted tables can contain cleartext data ( `TRUE` ) or are to cryptographically process every column ( `FALSE` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-dataencryptionmetadata.html#cfn-cleanrooms-collaboration-dataencryptionmetadata-allowcleartext
     */
    readonly allowCleartext: boolean | cdk.IResolvable;

    /**
     * Indicates whether Fingerprint columns can contain duplicate entries ( `TRUE` ) or are to contain only non-repeated values ( `FALSE` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-dataencryptionmetadata.html#cfn-cleanrooms-collaboration-dataencryptionmetadata-allowduplicates
     */
    readonly allowDuplicates: boolean | cdk.IResolvable;

    /**
     * Indicates whether Fingerprint columns can be joined on any other Fingerprint column with a different name ( `TRUE` ) or can only be joined on Fingerprint columns of the same name ( `FALSE` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-dataencryptionmetadata.html#cfn-cleanrooms-collaboration-dataencryptionmetadata-allowjoinsoncolumnswithdifferentnames
     */
    readonly allowJoinsOnColumnsWithDifferentNames: boolean | cdk.IResolvable;

    /**
     * Indicates whether NULL values are to be copied as NULL to encrypted tables ( `TRUE` ) or cryptographically processed ( `FALSE` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-dataencryptionmetadata.html#cfn-cleanrooms-collaboration-dataencryptionmetadata-preservenulls
     */
    readonly preserveNulls: boolean | cdk.IResolvable;
  }

  /**
   * Basic metadata used to construct a new member.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-memberspecification.html
   */
  export interface MemberSpecificationProperty {
    /**
     * The identifier used to reference members of the collaboration.
     *
     * Currently only supports AWS account ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-memberspecification.html#cfn-cleanrooms-collaboration-memberspecification-accountid
     */
    readonly accountId: string;

    /**
     * The member's display name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-memberspecification.html#cfn-cleanrooms-collaboration-memberspecification-displayname
     */
    readonly displayName: string;

    /**
     * The abilities granted to the collaboration member.
     *
     * *Allowed Values* : `CAN_QUERY` | `CAN_RECEIVE_RESULTS`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-memberspecification.html#cfn-cleanrooms-collaboration-memberspecification-memberabilities
     */
    readonly memberAbilities: Array<string>;

    /**
     * The collaboration member's payment responsibilities set by the collaboration creator.
     *
     * If the collaboration creator hasn't speciﬁed anyone as the member paying for query compute costs, then the member who can query is the default payer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-memberspecification.html#cfn-cleanrooms-collaboration-memberspecification-paymentconfiguration
     */
    readonly paymentConfiguration?: cdk.IResolvable | CfnCollaboration.PaymentConfigurationProperty;
  }

  /**
   * An object representing the collaboration member's payment responsibilities set by the collaboration creator.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-paymentconfiguration.html
   */
  export interface PaymentConfigurationProperty {
    /**
     * The collaboration member's payment responsibilities set by the collaboration creator for query compute costs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-paymentconfiguration.html#cfn-cleanrooms-collaboration-paymentconfiguration-querycompute
     */
    readonly queryCompute: cdk.IResolvable | CfnCollaboration.QueryComputePaymentConfigProperty;
  }

  /**
   * An object representing the collaboration member's payment responsibilities set by the collaboration creator for query compute costs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-querycomputepaymentconfig.html
   */
  export interface QueryComputePaymentConfigProperty {
    /**
     * Indicates whether the collaboration creator has configured the collaboration member to pay for query compute costs ( `TRUE` ) or has not configured the collaboration member to pay for query compute costs ( `FALSE` ).
     *
     * Exactly one member can be configured to pay for query compute costs. An error is returned if the collaboration creator sets a `TRUE` value for more than one member in the collaboration.
     *
     * If the collaboration creator hasn't specified anyone as the member paying for query compute costs, then the member who can query is the default payer. An error is returned if the collaboration creator sets a `FALSE` value for the member who can query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-collaboration-querycomputepaymentconfig.html#cfn-cleanrooms-collaboration-querycomputepaymentconfig-isresponsible
     */
    readonly isResponsible: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnCollaboration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html
 */
export interface CfnCollaborationProps {
  /**
   * A display name of the collaboration creator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-creatordisplayname
   */
  readonly creatorDisplayName: string;

  /**
   * The abilities granted to the collaboration creator.
   *
   * *Allowed values* `CAN_QUERY` | `CAN_RECEIVE_RESULTS`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-creatormemberabilities
   */
  readonly creatorMemberAbilities: Array<string>;

  /**
   * An object representing the collaboration member's payment responsibilities set by the collaboration creator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-creatorpaymentconfiguration
   */
  readonly creatorPaymentConfiguration?: cdk.IResolvable | CfnCollaboration.PaymentConfigurationProperty;

  /**
   * The settings for client-side encryption for cryptographic computing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-dataencryptionmetadata
   */
  readonly dataEncryptionMetadata?: CfnCollaboration.DataEncryptionMetadataProperty | cdk.IResolvable;

  /**
   * A description of the collaboration provided by the collaboration owner.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-description
   */
  readonly description: string;

  /**
   * A list of initial members, not including the creator.
   *
   * This list is immutable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-members
   */
  readonly members: Array<cdk.IResolvable | CfnCollaboration.MemberSpecificationProperty> | cdk.IResolvable;

  /**
   * A human-readable identifier provided by the collaboration owner.
   *
   * Display names are not unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-name
   */
  readonly name: string;

  /**
   * An indicator as to whether query logging has been enabled or disabled for the collaboration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-querylogstatus
   */
  readonly queryLogStatus: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   *
   * Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-collaboration.html#cfn-cleanrooms-collaboration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DataEncryptionMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `DataEncryptionMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollaborationDataEncryptionMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCleartext", cdk.requiredValidator)(properties.allowCleartext));
  errors.collect(cdk.propertyValidator("allowCleartext", cdk.validateBoolean)(properties.allowCleartext));
  errors.collect(cdk.propertyValidator("allowDuplicates", cdk.requiredValidator)(properties.allowDuplicates));
  errors.collect(cdk.propertyValidator("allowDuplicates", cdk.validateBoolean)(properties.allowDuplicates));
  errors.collect(cdk.propertyValidator("allowJoinsOnColumnsWithDifferentNames", cdk.requiredValidator)(properties.allowJoinsOnColumnsWithDifferentNames));
  errors.collect(cdk.propertyValidator("allowJoinsOnColumnsWithDifferentNames", cdk.validateBoolean)(properties.allowJoinsOnColumnsWithDifferentNames));
  errors.collect(cdk.propertyValidator("preserveNulls", cdk.requiredValidator)(properties.preserveNulls));
  errors.collect(cdk.propertyValidator("preserveNulls", cdk.validateBoolean)(properties.preserveNulls));
  return errors.wrap("supplied properties not correct for \"DataEncryptionMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnCollaborationDataEncryptionMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollaborationDataEncryptionMetadataPropertyValidator(properties).assertSuccess();
  return {
    "AllowCleartext": cdk.booleanToCloudFormation(properties.allowCleartext),
    "AllowDuplicates": cdk.booleanToCloudFormation(properties.allowDuplicates),
    "AllowJoinsOnColumnsWithDifferentNames": cdk.booleanToCloudFormation(properties.allowJoinsOnColumnsWithDifferentNames),
    "PreserveNulls": cdk.booleanToCloudFormation(properties.preserveNulls)
  };
}

// @ts-ignore TS6133
function CfnCollaborationDataEncryptionMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCollaboration.DataEncryptionMetadataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollaboration.DataEncryptionMetadataProperty>();
  ret.addPropertyResult("allowCleartext", "AllowCleartext", (properties.AllowCleartext != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCleartext) : undefined));
  ret.addPropertyResult("allowDuplicates", "AllowDuplicates", (properties.AllowDuplicates != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowDuplicates) : undefined));
  ret.addPropertyResult("allowJoinsOnColumnsWithDifferentNames", "AllowJoinsOnColumnsWithDifferentNames", (properties.AllowJoinsOnColumnsWithDifferentNames != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowJoinsOnColumnsWithDifferentNames) : undefined));
  ret.addPropertyResult("preserveNulls", "PreserveNulls", (properties.PreserveNulls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PreserveNulls) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryComputePaymentConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryComputePaymentConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollaborationQueryComputePaymentConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isResponsible", cdk.requiredValidator)(properties.isResponsible));
  errors.collect(cdk.propertyValidator("isResponsible", cdk.validateBoolean)(properties.isResponsible));
  return errors.wrap("supplied properties not correct for \"QueryComputePaymentConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCollaborationQueryComputePaymentConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollaborationQueryComputePaymentConfigPropertyValidator(properties).assertSuccess();
  return {
    "IsResponsible": cdk.booleanToCloudFormation(properties.isResponsible)
  };
}

// @ts-ignore TS6133
function CfnCollaborationQueryComputePaymentConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCollaboration.QueryComputePaymentConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollaboration.QueryComputePaymentConfigProperty>();
  ret.addPropertyResult("isResponsible", "IsResponsible", (properties.IsResponsible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsResponsible) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PaymentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PaymentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollaborationPaymentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryCompute", cdk.requiredValidator)(properties.queryCompute));
  errors.collect(cdk.propertyValidator("queryCompute", CfnCollaborationQueryComputePaymentConfigPropertyValidator)(properties.queryCompute));
  return errors.wrap("supplied properties not correct for \"PaymentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCollaborationPaymentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollaborationPaymentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "QueryCompute": convertCfnCollaborationQueryComputePaymentConfigPropertyToCloudFormation(properties.queryCompute)
  };
}

// @ts-ignore TS6133
function CfnCollaborationPaymentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCollaboration.PaymentConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollaboration.PaymentConfigurationProperty>();
  ret.addPropertyResult("queryCompute", "QueryCompute", (properties.QueryCompute != null ? CfnCollaborationQueryComputePaymentConfigPropertyFromCloudFormation(properties.QueryCompute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MemberSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollaborationMemberSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("memberAbilities", cdk.requiredValidator)(properties.memberAbilities));
  errors.collect(cdk.propertyValidator("memberAbilities", cdk.listValidator(cdk.validateString))(properties.memberAbilities));
  errors.collect(cdk.propertyValidator("paymentConfiguration", CfnCollaborationPaymentConfigurationPropertyValidator)(properties.paymentConfiguration));
  return errors.wrap("supplied properties not correct for \"MemberSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCollaborationMemberSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollaborationMemberSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "MemberAbilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.memberAbilities),
    "PaymentConfiguration": convertCfnCollaborationPaymentConfigurationPropertyToCloudFormation(properties.paymentConfiguration)
  };
}

// @ts-ignore TS6133
function CfnCollaborationMemberSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCollaboration.MemberSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollaboration.MemberSpecificationProperty>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("memberAbilities", "MemberAbilities", (properties.MemberAbilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MemberAbilities) : undefined));
  ret.addPropertyResult("paymentConfiguration", "PaymentConfiguration", (properties.PaymentConfiguration != null ? CfnCollaborationPaymentConfigurationPropertyFromCloudFormation(properties.PaymentConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCollaborationProps`
 *
 * @param properties - the TypeScript properties of a `CfnCollaborationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollaborationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("creatorDisplayName", cdk.requiredValidator)(properties.creatorDisplayName));
  errors.collect(cdk.propertyValidator("creatorDisplayName", cdk.validateString)(properties.creatorDisplayName));
  errors.collect(cdk.propertyValidator("creatorMemberAbilities", cdk.requiredValidator)(properties.creatorMemberAbilities));
  errors.collect(cdk.propertyValidator("creatorMemberAbilities", cdk.listValidator(cdk.validateString))(properties.creatorMemberAbilities));
  errors.collect(cdk.propertyValidator("creatorPaymentConfiguration", CfnCollaborationPaymentConfigurationPropertyValidator)(properties.creatorPaymentConfiguration));
  errors.collect(cdk.propertyValidator("dataEncryptionMetadata", CfnCollaborationDataEncryptionMetadataPropertyValidator)(properties.dataEncryptionMetadata));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("members", cdk.requiredValidator)(properties.members));
  errors.collect(cdk.propertyValidator("members", cdk.listValidator(CfnCollaborationMemberSpecificationPropertyValidator))(properties.members));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queryLogStatus", cdk.requiredValidator)(properties.queryLogStatus));
  errors.collect(cdk.propertyValidator("queryLogStatus", cdk.validateString)(properties.queryLogStatus));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCollaborationProps\"");
}

// @ts-ignore TS6133
function convertCfnCollaborationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollaborationPropsValidator(properties).assertSuccess();
  return {
    "CreatorDisplayName": cdk.stringToCloudFormation(properties.creatorDisplayName),
    "CreatorMemberAbilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.creatorMemberAbilities),
    "CreatorPaymentConfiguration": convertCfnCollaborationPaymentConfigurationPropertyToCloudFormation(properties.creatorPaymentConfiguration),
    "DataEncryptionMetadata": convertCfnCollaborationDataEncryptionMetadataPropertyToCloudFormation(properties.dataEncryptionMetadata),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Members": cdk.listMapper(convertCfnCollaborationMemberSpecificationPropertyToCloudFormation)(properties.members),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QueryLogStatus": cdk.stringToCloudFormation(properties.queryLogStatus),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCollaborationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCollaborationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollaborationProps>();
  ret.addPropertyResult("creatorDisplayName", "CreatorDisplayName", (properties.CreatorDisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.CreatorDisplayName) : undefined));
  ret.addPropertyResult("creatorMemberAbilities", "CreatorMemberAbilities", (properties.CreatorMemberAbilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CreatorMemberAbilities) : undefined));
  ret.addPropertyResult("creatorPaymentConfiguration", "CreatorPaymentConfiguration", (properties.CreatorPaymentConfiguration != null ? CfnCollaborationPaymentConfigurationPropertyFromCloudFormation(properties.CreatorPaymentConfiguration) : undefined));
  ret.addPropertyResult("dataEncryptionMetadata", "DataEncryptionMetadata", (properties.DataEncryptionMetadata != null ? CfnCollaborationDataEncryptionMetadataPropertyFromCloudFormation(properties.DataEncryptionMetadata) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("members", "Members", (properties.Members != null ? cfn_parse.FromCloudFormation.getArray(CfnCollaborationMemberSpecificationPropertyFromCloudFormation)(properties.Members) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queryLogStatus", "QueryLogStatus", (properties.QueryLogStatus != null ? cfn_parse.FromCloudFormation.getString(properties.QueryLogStatus) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new configured table resource.
 *
 * @cloudformationResource AWS::CleanRooms::ConfiguredTable
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html
 */
export class CfnConfiguredTable extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CleanRooms::ConfiguredTable";

  /**
   * Build a CfnConfiguredTable from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfiguredTable {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfiguredTablePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfiguredTable(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified configured table.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:configuredtable/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the unique identifier of the specified configured table.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE33333`
   *
   * @cloudformationAttribute ConfiguredTableIdentifier
   */
  public readonly attrConfiguredTableIdentifier: string;

  /**
   * The columns within the underlying AWS Glue table that can be utilized within collaborations.
   */
  public allowedColumns: Array<string>;

  /**
   * The analysis method for the configured table.
   */
  public analysisMethod: string;

  /**
   * The entire created analysis rule.
   */
  public analysisRules?: Array<CfnConfiguredTable.AnalysisRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description for the configured table.
   */
  public description?: string;

  /**
   * A name for the configured table.
   */
  public name: string;

  /**
   * The AWS Glue table that this configured table represents.
   */
  public tableReference: cdk.IResolvable | CfnConfiguredTable.TableReferenceProperty;

  /**
   * An optional label that you can assign to a resource when you create it.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfiguredTableProps) {
    super(scope, id, {
      "type": CfnConfiguredTable.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "allowedColumns", this);
    cdk.requireProperty(props, "analysisMethod", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "tableReference", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrConfiguredTableIdentifier = cdk.Token.asString(this.getAtt("ConfiguredTableIdentifier", cdk.ResolutionTypeHint.STRING));
    this.allowedColumns = props.allowedColumns;
    this.analysisMethod = props.analysisMethod;
    this.analysisRules = props.analysisRules;
    this.description = props.description;
    this.name = props.name;
    this.tableReference = props.tableReference;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowedColumns": this.allowedColumns,
      "analysisMethod": this.analysisMethod,
      "analysisRules": this.analysisRules,
      "description": this.description,
      "name": this.name,
      "tableReference": this.tableReference,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfiguredTable.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfiguredTablePropsToCloudFormation(props);
  }
}

export namespace CfnConfiguredTable {
  /**
   * A pointer to the dataset that underlies this table.
   *
   * Currently, this can only be an AWS Glue table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-tablereference.html
   */
  export interface TableReferenceProperty {
    /**
     * If present, a reference to the AWS Glue table referred to by this table reference.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-tablereference.html#cfn-cleanrooms-configuredtable-tablereference-glue
     */
    readonly glue: CfnConfiguredTable.GlueTableReferenceProperty | cdk.IResolvable;
  }

  /**
   * A reference to a table within an AWS Glue data catalog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-gluetablereference.html
   */
  export interface GlueTableReferenceProperty {
    /**
     * The name of the database the AWS Glue table belongs to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-gluetablereference.html#cfn-cleanrooms-configuredtable-gluetablereference-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the AWS Glue table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-gluetablereference.html#cfn-cleanrooms-configuredtable-gluetablereference-tablename
     */
    readonly tableName: string;
  }

  /**
   * A specification about how data from the configured table can be used in a query.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrule.html
   */
  export interface AnalysisRuleProperty {
    /**
     * A policy that describes the associated data usage limitations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrule.html#cfn-cleanrooms-configuredtable-analysisrule-policy
     */
    readonly policy: CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyProperty | cdk.IResolvable;

    /**
     * The type of analysis rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrule.html#cfn-cleanrooms-configuredtable-analysisrule-type
     */
    readonly type: string;
  }

  /**
   * Controls on the query specifications that can be run on a configured table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicy.html
   */
  export interface ConfiguredTableAnalysisRulePolicyProperty {
    /**
     * Controls on the query specifications that can be run on a configured table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicy.html#cfn-cleanrooms-configuredtable-configuredtableanalysisrulepolicy-v1
     */
    readonly v1: CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyV1Property | cdk.IResolvable;
  }

  /**
   * Controls on the query specifications that can be run on a configured table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1.html
   */
  export interface ConfiguredTableAnalysisRulePolicyV1Property {
    /**
     * Analysis rule type that enables only aggregation queries on a configured table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1.html#cfn-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1-aggregation
     */
    readonly aggregation?: CfnConfiguredTable.AnalysisRuleAggregationProperty | cdk.IResolvable;

    /**
     * Analysis rule type that enables custom SQL queries on a configured table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1.html#cfn-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1-custom
     */
    readonly custom?: CfnConfiguredTable.AnalysisRuleCustomProperty | cdk.IResolvable;

    /**
     * Analysis rule type that enables only list queries on a configured table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1.html#cfn-cleanrooms-configuredtable-configuredtableanalysisrulepolicyv1-list
     */
    readonly list?: CfnConfiguredTable.AnalysisRuleListProperty | cdk.IResolvable;
  }

  /**
   * A type of analysis rule that enables query structure and specified queries that produce aggregate statistics.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html
   */
  export interface AnalysisRuleAggregationProperty {
    /**
     * The columns that query runners are allowed to use in aggregation queries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-aggregatecolumns
     */
    readonly aggregateColumns: Array<CfnConfiguredTable.AggregateColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Which logical operators (if any) are to be used in an INNER JOIN match condition.
     *
     * Default is `AND` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-allowedjoinoperators
     */
    readonly allowedJoinOperators?: Array<string>;

    /**
     * The columns that query runners are allowed to select, group by, or filter by.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-dimensioncolumns
     */
    readonly dimensionColumns: Array<string>;

    /**
     * Columns in configured table that can be used in join statements and/or as aggregate columns.
     *
     * They can never be outputted directly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-joincolumns
     */
    readonly joinColumns: Array<string>;

    /**
     * Control that requires member who runs query to do a join with their configured table and/or other configured table in query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-joinrequired
     */
    readonly joinRequired?: string;

    /**
     * Columns that must meet a specific threshold value (after an aggregation function is applied to it) for each output row to be returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-outputconstraints
     */
    readonly outputConstraints: Array<CfnConfiguredTable.AggregationConstraintProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Set of scalar functions that are allowed to be used on dimension columns and the output of aggregation of metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisruleaggregation.html#cfn-cleanrooms-configuredtable-analysisruleaggregation-scalarfunctions
     */
    readonly scalarFunctions: Array<string>;
  }

  /**
   * Constraint on query output removing output rows that do not meet a minimum number of distinct values of a specified column.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregationconstraint.html
   */
  export interface AggregationConstraintProperty {
    /**
     * Column in aggregation constraint for which there must be a minimum number of distinct values in an output row for it to be in the query output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregationconstraint.html#cfn-cleanrooms-configuredtable-aggregationconstraint-columnname
     */
    readonly columnName: string;

    /**
     * The minimum number of distinct values that an output row must be an aggregation of.
     *
     * Minimum threshold of distinct values for a specified column that must exist in an output row for it to be in the query output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregationconstraint.html#cfn-cleanrooms-configuredtable-aggregationconstraint-minimum
     */
    readonly minimum: number;

    /**
     * The type of aggregation the constraint allows.
     *
     * The only valid value is currently `COUNT_DISTINCT`.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregationconstraint.html#cfn-cleanrooms-configuredtable-aggregationconstraint-type
     */
    readonly type: string;
  }

  /**
   * Column in configured table that can be used in aggregate function in query.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregatecolumn.html
   */
  export interface AggregateColumnProperty {
    /**
     * Column names in configured table of aggregate columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregatecolumn.html#cfn-cleanrooms-configuredtable-aggregatecolumn-columnnames
     */
    readonly columnNames: Array<string>;

    /**
     * Aggregation function that can be applied to aggregate column in query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-aggregatecolumn.html#cfn-cleanrooms-configuredtable-aggregatecolumn-function
     */
    readonly function: string;
  }

  /**
   * A type of analysis rule that enables row-level analysis.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulelist.html
   */
  export interface AnalysisRuleListProperty {
    /**
     * The logical operators (if any) that are to be used in an INNER JOIN match condition.
     *
     * Default is `AND` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulelist.html#cfn-cleanrooms-configuredtable-analysisrulelist-allowedjoinoperators
     */
    readonly allowedJoinOperators?: Array<string>;

    /**
     * Columns that can be used to join a configured table with the table of the member who can query and other members' configured tables.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulelist.html#cfn-cleanrooms-configuredtable-analysisrulelist-joincolumns
     */
    readonly joinColumns: Array<string>;

    /**
     * Columns that can be listed in the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulelist.html#cfn-cleanrooms-configuredtable-analysisrulelist-listcolumns
     */
    readonly listColumns: Array<string>;
  }

  /**
   * A type of analysis rule that enables the table owner to approve custom SQL queries on their configured tables.
   *
   * It supports differential privacy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulecustom.html
   */
  export interface AnalysisRuleCustomProperty {
    /**
     * The analysis templates that are allowed by the custom analysis rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulecustom.html#cfn-cleanrooms-configuredtable-analysisrulecustom-allowedanalyses
     */
    readonly allowedAnalyses: Array<string>;

    /**
     * The AWS accounts that are allowed to query by the custom analysis rule.
     *
     * Required when `allowedAnalyses` is `ANY_QUERY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-configuredtable-analysisrulecustom.html#cfn-cleanrooms-configuredtable-analysisrulecustom-allowedanalysisproviders
     */
    readonly allowedAnalysisProviders?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnConfiguredTable`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html
 */
export interface CfnConfiguredTableProps {
  /**
   * The columns within the underlying AWS Glue table that can be utilized within collaborations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-allowedcolumns
   */
  readonly allowedColumns: Array<string>;

  /**
   * The analysis method for the configured table.
   *
   * The only valid value is currently `DIRECT_QUERY`.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-analysismethod
   */
  readonly analysisMethod: string;

  /**
   * The entire created analysis rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-analysisrules
   */
  readonly analysisRules?: Array<CfnConfiguredTable.AnalysisRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description for the configured table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-description
   */
  readonly description?: string;

  /**
   * A name for the configured table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-name
   */
  readonly name: string;

  /**
   * The AWS Glue table that this configured table represents.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-tablereference
   */
  readonly tableReference: cdk.IResolvable | CfnConfiguredTable.TableReferenceProperty;

  /**
   * An optional label that you can assign to a resource when you create it.
   *
   * Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtable.html#cfn-cleanrooms-configuredtable-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `GlueTableReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `GlueTableReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableGlueTableReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"GlueTableReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableGlueTableReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableGlueTableReferencePropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableGlueTableReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.GlueTableReferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.GlueTableReferenceProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `TableReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableTableReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("glue", cdk.requiredValidator)(properties.glue));
  errors.collect(cdk.propertyValidator("glue", CfnConfiguredTableGlueTableReferencePropertyValidator)(properties.glue));
  return errors.wrap("supplied properties not correct for \"TableReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableTableReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableTableReferencePropertyValidator(properties).assertSuccess();
  return {
    "Glue": convertCfnConfiguredTableGlueTableReferencePropertyToCloudFormation(properties.glue)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableTableReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfiguredTable.TableReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.TableReferenceProperty>();
  ret.addPropertyResult("glue", "Glue", (properties.Glue != null ? CfnConfiguredTableGlueTableReferencePropertyFromCloudFormation(properties.Glue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AggregationConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `AggregationConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAggregationConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnName", cdk.requiredValidator)(properties.columnName));
  errors.collect(cdk.propertyValidator("columnName", cdk.validateString)(properties.columnName));
  errors.collect(cdk.propertyValidator("minimum", cdk.requiredValidator)(properties.minimum));
  errors.collect(cdk.propertyValidator("minimum", cdk.validateNumber)(properties.minimum));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AggregationConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAggregationConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAggregationConstraintPropertyValidator(properties).assertSuccess();
  return {
    "ColumnName": cdk.stringToCloudFormation(properties.columnName),
    "Minimum": cdk.numberToCloudFormation(properties.minimum),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAggregationConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AggregationConstraintProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AggregationConstraintProperty>();
  ret.addPropertyResult("columnName", "ColumnName", (properties.ColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnName) : undefined));
  ret.addPropertyResult("minimum", "Minimum", (properties.Minimum != null ? cfn_parse.FromCloudFormation.getNumber(properties.Minimum) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AggregateColumnProperty`
 *
 * @param properties - the TypeScript properties of a `AggregateColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAggregateColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnNames", cdk.requiredValidator)(properties.columnNames));
  errors.collect(cdk.propertyValidator("columnNames", cdk.listValidator(cdk.validateString))(properties.columnNames));
  errors.collect(cdk.propertyValidator("function", cdk.requiredValidator)(properties.function));
  errors.collect(cdk.propertyValidator("function", cdk.validateString)(properties.function));
  return errors.wrap("supplied properties not correct for \"AggregateColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAggregateColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAggregateColumnPropertyValidator(properties).assertSuccess();
  return {
    "ColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
    "Function": cdk.stringToCloudFormation(properties.function)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAggregateColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AggregateColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AggregateColumnProperty>();
  ret.addPropertyResult("columnNames", "ColumnNames", (properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ColumnNames) : undefined));
  ret.addPropertyResult("function", "Function", (properties.Function != null ? cfn_parse.FromCloudFormation.getString(properties.Function) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisRuleAggregationProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisRuleAggregationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleAggregationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregateColumns", cdk.requiredValidator)(properties.aggregateColumns));
  errors.collect(cdk.propertyValidator("aggregateColumns", cdk.listValidator(CfnConfiguredTableAggregateColumnPropertyValidator))(properties.aggregateColumns));
  errors.collect(cdk.propertyValidator("allowedJoinOperators", cdk.listValidator(cdk.validateString))(properties.allowedJoinOperators));
  errors.collect(cdk.propertyValidator("dimensionColumns", cdk.requiredValidator)(properties.dimensionColumns));
  errors.collect(cdk.propertyValidator("dimensionColumns", cdk.listValidator(cdk.validateString))(properties.dimensionColumns));
  errors.collect(cdk.propertyValidator("joinColumns", cdk.requiredValidator)(properties.joinColumns));
  errors.collect(cdk.propertyValidator("joinColumns", cdk.listValidator(cdk.validateString))(properties.joinColumns));
  errors.collect(cdk.propertyValidator("joinRequired", cdk.validateString)(properties.joinRequired));
  errors.collect(cdk.propertyValidator("outputConstraints", cdk.requiredValidator)(properties.outputConstraints));
  errors.collect(cdk.propertyValidator("outputConstraints", cdk.listValidator(CfnConfiguredTableAggregationConstraintPropertyValidator))(properties.outputConstraints));
  errors.collect(cdk.propertyValidator("scalarFunctions", cdk.requiredValidator)(properties.scalarFunctions));
  errors.collect(cdk.propertyValidator("scalarFunctions", cdk.listValidator(cdk.validateString))(properties.scalarFunctions));
  return errors.wrap("supplied properties not correct for \"AnalysisRuleAggregationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAnalysisRuleAggregationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAnalysisRuleAggregationPropertyValidator(properties).assertSuccess();
  return {
    "AggregateColumns": cdk.listMapper(convertCfnConfiguredTableAggregateColumnPropertyToCloudFormation)(properties.aggregateColumns),
    "AllowedJoinOperators": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedJoinOperators),
    "DimensionColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.dimensionColumns),
    "JoinColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.joinColumns),
    "JoinRequired": cdk.stringToCloudFormation(properties.joinRequired),
    "OutputConstraints": cdk.listMapper(convertCfnConfiguredTableAggregationConstraintPropertyToCloudFormation)(properties.outputConstraints),
    "ScalarFunctions": cdk.listMapper(cdk.stringToCloudFormation)(properties.scalarFunctions)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleAggregationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AnalysisRuleAggregationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AnalysisRuleAggregationProperty>();
  ret.addPropertyResult("aggregateColumns", "AggregateColumns", (properties.AggregateColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnConfiguredTableAggregateColumnPropertyFromCloudFormation)(properties.AggregateColumns) : undefined));
  ret.addPropertyResult("allowedJoinOperators", "AllowedJoinOperators", (properties.AllowedJoinOperators != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedJoinOperators) : undefined));
  ret.addPropertyResult("dimensionColumns", "DimensionColumns", (properties.DimensionColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DimensionColumns) : undefined));
  ret.addPropertyResult("joinColumns", "JoinColumns", (properties.JoinColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.JoinColumns) : undefined));
  ret.addPropertyResult("joinRequired", "JoinRequired", (properties.JoinRequired != null ? cfn_parse.FromCloudFormation.getString(properties.JoinRequired) : undefined));
  ret.addPropertyResult("outputConstraints", "OutputConstraints", (properties.OutputConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnConfiguredTableAggregationConstraintPropertyFromCloudFormation)(properties.OutputConstraints) : undefined));
  ret.addPropertyResult("scalarFunctions", "ScalarFunctions", (properties.ScalarFunctions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ScalarFunctions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisRuleListProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisRuleListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedJoinOperators", cdk.listValidator(cdk.validateString))(properties.allowedJoinOperators));
  errors.collect(cdk.propertyValidator("joinColumns", cdk.requiredValidator)(properties.joinColumns));
  errors.collect(cdk.propertyValidator("joinColumns", cdk.listValidator(cdk.validateString))(properties.joinColumns));
  errors.collect(cdk.propertyValidator("listColumns", cdk.requiredValidator)(properties.listColumns));
  errors.collect(cdk.propertyValidator("listColumns", cdk.listValidator(cdk.validateString))(properties.listColumns));
  return errors.wrap("supplied properties not correct for \"AnalysisRuleListProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAnalysisRuleListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAnalysisRuleListPropertyValidator(properties).assertSuccess();
  return {
    "AllowedJoinOperators": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedJoinOperators),
    "JoinColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.joinColumns),
    "ListColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.listColumns)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AnalysisRuleListProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AnalysisRuleListProperty>();
  ret.addPropertyResult("allowedJoinOperators", "AllowedJoinOperators", (properties.AllowedJoinOperators != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedJoinOperators) : undefined));
  ret.addPropertyResult("joinColumns", "JoinColumns", (properties.JoinColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.JoinColumns) : undefined));
  ret.addPropertyResult("listColumns", "ListColumns", (properties.ListColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ListColumns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisRuleCustomProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisRuleCustomProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleCustomPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedAnalyses", cdk.requiredValidator)(properties.allowedAnalyses));
  errors.collect(cdk.propertyValidator("allowedAnalyses", cdk.listValidator(cdk.validateString))(properties.allowedAnalyses));
  errors.collect(cdk.propertyValidator("allowedAnalysisProviders", cdk.listValidator(cdk.validateString))(properties.allowedAnalysisProviders));
  return errors.wrap("supplied properties not correct for \"AnalysisRuleCustomProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAnalysisRuleCustomPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAnalysisRuleCustomPropertyValidator(properties).assertSuccess();
  return {
    "AllowedAnalyses": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedAnalyses),
    "AllowedAnalysisProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedAnalysisProviders)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRuleCustomPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AnalysisRuleCustomProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AnalysisRuleCustomProperty>();
  ret.addPropertyResult("allowedAnalyses", "AllowedAnalyses", (properties.AllowedAnalyses != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedAnalyses) : undefined));
  ret.addPropertyResult("allowedAnalysisProviders", "AllowedAnalysisProviders", (properties.AllowedAnalysisProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedAnalysisProviders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfiguredTableAnalysisRulePolicyV1Property`
 *
 * @param properties - the TypeScript properties of a `ConfiguredTableAnalysisRulePolicyV1Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregation", CfnConfiguredTableAnalysisRuleAggregationPropertyValidator)(properties.aggregation));
  errors.collect(cdk.propertyValidator("custom", CfnConfiguredTableAnalysisRuleCustomPropertyValidator)(properties.custom));
  errors.collect(cdk.propertyValidator("list", CfnConfiguredTableAnalysisRuleListPropertyValidator)(properties.list));
  return errors.wrap("supplied properties not correct for \"ConfiguredTableAnalysisRulePolicyV1Property\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyValidator(properties).assertSuccess();
  return {
    "Aggregation": convertCfnConfiguredTableAnalysisRuleAggregationPropertyToCloudFormation(properties.aggregation),
    "Custom": convertCfnConfiguredTableAnalysisRuleCustomPropertyToCloudFormation(properties.custom),
    "List": convertCfnConfiguredTableAnalysisRuleListPropertyToCloudFormation(properties.list)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyV1Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyV1Property>();
  ret.addPropertyResult("aggregation", "Aggregation", (properties.Aggregation != null ? CfnConfiguredTableAnalysisRuleAggregationPropertyFromCloudFormation(properties.Aggregation) : undefined));
  ret.addPropertyResult("custom", "Custom", (properties.Custom != null ? CfnConfiguredTableAnalysisRuleCustomPropertyFromCloudFormation(properties.Custom) : undefined));
  ret.addPropertyResult("list", "List", (properties.List != null ? CfnConfiguredTableAnalysisRuleListPropertyFromCloudFormation(properties.List) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfiguredTableAnalysisRulePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ConfiguredTableAnalysisRulePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("v1", cdk.requiredValidator)(properties.v1));
  errors.collect(cdk.propertyValidator("v1", CfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyValidator)(properties.v1));
  return errors.wrap("supplied properties not correct for \"ConfiguredTableAnalysisRulePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyValidator(properties).assertSuccess();
  return {
    "V1": convertCfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyToCloudFormation(properties.v1)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.ConfiguredTableAnalysisRulePolicyProperty>();
  ret.addPropertyResult("v1", "V1", (properties.V1 != null ? CfnConfiguredTableConfiguredTableAnalysisRulePolicyV1PropertyFromCloudFormation(properties.V1) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalysisRuleProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", CfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AnalysisRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAnalysisRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAnalysisRulePropertyValidator(properties).assertSuccess();
  return {
    "Policy": convertCfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyToCloudFormation(properties.policy),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAnalysisRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTable.AnalysisRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTable.AnalysisRuleProperty>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? CfnConfiguredTableConfiguredTableAnalysisRulePolicyPropertyFromCloudFormation(properties.Policy) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfiguredTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfiguredTableProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTablePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedColumns", cdk.requiredValidator)(properties.allowedColumns));
  errors.collect(cdk.propertyValidator("allowedColumns", cdk.listValidator(cdk.validateString))(properties.allowedColumns));
  errors.collect(cdk.propertyValidator("analysisMethod", cdk.requiredValidator)(properties.analysisMethod));
  errors.collect(cdk.propertyValidator("analysisMethod", cdk.validateString)(properties.analysisMethod));
  errors.collect(cdk.propertyValidator("analysisRules", cdk.listValidator(CfnConfiguredTableAnalysisRulePropertyValidator))(properties.analysisRules));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tableReference", cdk.requiredValidator)(properties.tableReference));
  errors.collect(cdk.propertyValidator("tableReference", CfnConfiguredTableTableReferencePropertyValidator)(properties.tableReference));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConfiguredTableProps\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTablePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTablePropsValidator(properties).assertSuccess();
  return {
    "AllowedColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedColumns),
    "AnalysisMethod": cdk.stringToCloudFormation(properties.analysisMethod),
    "AnalysisRules": cdk.listMapper(convertCfnConfiguredTableAnalysisRulePropertyToCloudFormation)(properties.analysisRules),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TableReference": convertCfnConfiguredTableTableReferencePropertyToCloudFormation(properties.tableReference),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTableProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTableProps>();
  ret.addPropertyResult("allowedColumns", "AllowedColumns", (properties.AllowedColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedColumns) : undefined));
  ret.addPropertyResult("analysisMethod", "AnalysisMethod", (properties.AnalysisMethod != null ? cfn_parse.FromCloudFormation.getString(properties.AnalysisMethod) : undefined));
  ret.addPropertyResult("analysisRules", "AnalysisRules", (properties.AnalysisRules != null ? cfn_parse.FromCloudFormation.getArray(CfnConfiguredTableAnalysisRulePropertyFromCloudFormation)(properties.AnalysisRules) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tableReference", "TableReference", (properties.TableReference != null ? CfnConfiguredTableTableReferencePropertyFromCloudFormation(properties.TableReference) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a configured table association.
 *
 * A configured table association links a configured table with a collaboration.
 *
 * @cloudformationResource AWS::CleanRooms::ConfiguredTableAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html
 */
export class CfnConfiguredTableAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CleanRooms::ConfiguredTableAssociation";

  /**
   * Build a CfnConfiguredTableAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfiguredTableAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfiguredTableAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfiguredTableAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified configured table association.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:configuredtable/a1b2c3d4-5678-90ab-cdef-EXAMPLE33333`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the unique identifier of the specified configured table association.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE33333`
   *
   * @cloudformationAttribute ConfiguredTableAssociationIdentifier
   */
  public readonly attrConfiguredTableAssociationIdentifier: string;

  /**
   * A unique identifier for the configured table to be associated to.
   */
  public configuredTableIdentifier: string;

  /**
   * A description of the configured table association.
   */
  public description?: string;

  /**
   * The unique ID for the membership this configured table association belongs to.
   */
  public membershipIdentifier: string;

  /**
   * The name of the configured table association, in lowercase.
   */
  public name: string;

  /**
   * The service will assume this role to access catalog metadata and query the table.
   */
  public roleArn: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfiguredTableAssociationProps) {
    super(scope, id, {
      "type": CfnConfiguredTableAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configuredTableIdentifier", this);
    cdk.requireProperty(props, "membershipIdentifier", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrConfiguredTableAssociationIdentifier = cdk.Token.asString(this.getAtt("ConfiguredTableAssociationIdentifier", cdk.ResolutionTypeHint.STRING));
    this.configuredTableIdentifier = props.configuredTableIdentifier;
    this.description = props.description;
    this.membershipIdentifier = props.membershipIdentifier;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuredTableIdentifier": this.configuredTableIdentifier,
      "description": this.description,
      "membershipIdentifier": this.membershipIdentifier,
      "name": this.name,
      "roleArn": this.roleArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfiguredTableAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfiguredTableAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnConfiguredTableAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html
 */
export interface CfnConfiguredTableAssociationProps {
  /**
   * A unique identifier for the configured table to be associated to.
   *
   * Currently accepts a configured table ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-configuredtableidentifier
   */
  readonly configuredTableIdentifier: string;

  /**
   * A description of the configured table association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-description
   */
  readonly description?: string;

  /**
   * The unique ID for the membership this configured table association belongs to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-membershipidentifier
   */
  readonly membershipIdentifier: string;

  /**
   * The name of the configured table association, in lowercase.
   *
   * The table is identified by this name when running protected queries against the underlying data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-name
   */
  readonly name: string;

  /**
   * The service will assume this role to access catalog metadata and query the table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-rolearn
   */
  readonly roleArn: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   *
   * Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-configuredtableassociation.html#cfn-cleanrooms-configuredtableassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnConfiguredTableAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfiguredTableAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfiguredTableAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuredTableIdentifier", cdk.requiredValidator)(properties.configuredTableIdentifier));
  errors.collect(cdk.propertyValidator("configuredTableIdentifier", cdk.validateString)(properties.configuredTableIdentifier));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("membershipIdentifier", cdk.requiredValidator)(properties.membershipIdentifier));
  errors.collect(cdk.propertyValidator("membershipIdentifier", cdk.validateString)(properties.membershipIdentifier));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConfiguredTableAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfiguredTableAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfiguredTableAssociationPropsValidator(properties).assertSuccess();
  return {
    "ConfiguredTableIdentifier": cdk.stringToCloudFormation(properties.configuredTableIdentifier),
    "Description": cdk.stringToCloudFormation(properties.description),
    "MembershipIdentifier": cdk.stringToCloudFormation(properties.membershipIdentifier),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConfiguredTableAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfiguredTableAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguredTableAssociationProps>();
  ret.addPropertyResult("configuredTableIdentifier", "ConfiguredTableIdentifier", (properties.ConfiguredTableIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ConfiguredTableIdentifier) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("membershipIdentifier", "MembershipIdentifier", (properties.MembershipIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.MembershipIdentifier) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a membership for a specific collaboration identifier and joins the collaboration.
 *
 * @cloudformationResource AWS::CleanRooms::Membership
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html
 */
export class CfnMembership extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CleanRooms::Membership";

  /**
   * Build a CfnMembership from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMembership {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMembershipPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMembership(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified membership.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:membership/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the Amazon Resource Name (ARN) of the specified collaboration.
   *
   * Example: `arn:aws:cleanrooms:us-east-1:111122223333:collaboration/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute CollaborationArn
   */
  public readonly attrCollaborationArn: string;

  /**
   * Returns the unique identifier of the specified collaboration creator account.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`
   *
   * @cloudformationAttribute CollaborationCreatorAccountId
   */
  public readonly attrCollaborationCreatorAccountId: string;

  /**
   * Returns the unique identifier of the specified membership.
   *
   * Example: `a1b2c3d4-5678-90ab-cdef-EXAMPLE22222`
   *
   * @cloudformationAttribute MembershipIdentifier
   */
  public readonly attrMembershipIdentifier: string;

  /**
   * The unique ID for the associated collaboration.
   */
  public collaborationIdentifier: string;

  /**
   * The default protected query result configuration as specified by the member who can receive results.
   */
  public defaultResultConfiguration?: cdk.IResolvable | CfnMembership.MembershipProtectedQueryResultConfigurationProperty;

  /**
   * The payment responsibilities accepted by the collaboration member.
   */
  public paymentConfiguration?: cdk.IResolvable | CfnMembership.MembershipPaymentConfigurationProperty;

  /**
   * An indicator as to whether query logging has been enabled or disabled for the membership.
   */
  public queryLogStatus: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMembershipProps) {
    super(scope, id, {
      "type": CfnMembership.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "collaborationIdentifier", this);
    cdk.requireProperty(props, "queryLogStatus", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCollaborationArn = cdk.Token.asString(this.getAtt("CollaborationArn", cdk.ResolutionTypeHint.STRING));
    this.attrCollaborationCreatorAccountId = cdk.Token.asString(this.getAtt("CollaborationCreatorAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrMembershipIdentifier = cdk.Token.asString(this.getAtt("MembershipIdentifier", cdk.ResolutionTypeHint.STRING));
    this.collaborationIdentifier = props.collaborationIdentifier;
    this.defaultResultConfiguration = props.defaultResultConfiguration;
    this.paymentConfiguration = props.paymentConfiguration;
    this.queryLogStatus = props.queryLogStatus;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "collaborationIdentifier": this.collaborationIdentifier,
      "defaultResultConfiguration": this.defaultResultConfiguration,
      "paymentConfiguration": this.paymentConfiguration,
      "queryLogStatus": this.queryLogStatus,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMembership.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMembershipPropsToCloudFormation(props);
  }
}

export namespace CfnMembership {
  /**
   * Contains configurations for protected query results.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipprotectedqueryresultconfiguration.html
   */
  export interface MembershipProtectedQueryResultConfigurationProperty {
    /**
     * Configuration for protected query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipprotectedqueryresultconfiguration.html#cfn-cleanrooms-membership-membershipprotectedqueryresultconfiguration-outputconfiguration
     */
    readonly outputConfiguration: cdk.IResolvable | CfnMembership.MembershipProtectedQueryOutputConfigurationProperty;

    /**
     * The unique ARN for an IAM role that is used by AWS Clean Rooms to write protected query results to the result location, given by the member who can receive results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipprotectedqueryresultconfiguration.html#cfn-cleanrooms-membership-membershipprotectedqueryresultconfiguration-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * Contains configurations for protected query results.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipprotectedqueryoutputconfiguration.html
   */
  export interface MembershipProtectedQueryOutputConfigurationProperty {
    /**
     * Required configuration for a protected query with an `S3` output type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipprotectedqueryoutputconfiguration.html#cfn-cleanrooms-membership-membershipprotectedqueryoutputconfiguration-s3
     */
    readonly s3: cdk.IResolvable | CfnMembership.ProtectedQueryS3OutputConfigurationProperty;
  }

  /**
   * Contains the configuration to write the query results to S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-protectedquerys3outputconfiguration.html
   */
  export interface ProtectedQueryS3OutputConfigurationProperty {
    /**
     * The S3 bucket to unload the protected query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-protectedquerys3outputconfiguration.html#cfn-cleanrooms-membership-protectedquerys3outputconfiguration-bucket
     */
    readonly bucket: string;

    /**
     * The S3 prefix to unload the protected query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-protectedquerys3outputconfiguration.html#cfn-cleanrooms-membership-protectedquerys3outputconfiguration-keyprefix
     */
    readonly keyPrefix?: string;

    /**
     * Intended file format of the result.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-protectedquerys3outputconfiguration.html#cfn-cleanrooms-membership-protectedquerys3outputconfiguration-resultformat
     */
    readonly resultFormat: string;
  }

  /**
   * An object representing the payment responsibilities accepted by the collaboration member.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershippaymentconfiguration.html
   */
  export interface MembershipPaymentConfigurationProperty {
    /**
     * The payment responsibilities accepted by the collaboration member for query compute costs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershippaymentconfiguration.html#cfn-cleanrooms-membership-membershippaymentconfiguration-querycompute
     */
    readonly queryCompute: cdk.IResolvable | CfnMembership.MembershipQueryComputePaymentConfigProperty;
  }

  /**
   * An object representing the payment responsibilities accepted by the collaboration member for query compute costs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipquerycomputepaymentconfig.html
   */
  export interface MembershipQueryComputePaymentConfigProperty {
    /**
     * Indicates whether the collaboration member has accepted to pay for query compute costs ( `TRUE` ) or has not accepted to pay for query compute costs ( `FALSE` ).
     *
     * If the collaboration creator has not specified anyone to pay for query compute costs, then the member who can query is the default payer.
     *
     * An error message is returned for the following reasons:
     *
     * - If you set the value to `FALSE` but you are responsible to pay for query compute costs.
     * - If you set the value to `TRUE` but you are not responsible to pay for query compute costs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cleanrooms-membership-membershipquerycomputepaymentconfig.html#cfn-cleanrooms-membership-membershipquerycomputepaymentconfig-isresponsible
     */
    readonly isResponsible: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnMembership`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html
 */
export interface CfnMembershipProps {
  /**
   * The unique ID for the associated collaboration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html#cfn-cleanrooms-membership-collaborationidentifier
   */
  readonly collaborationIdentifier: string;

  /**
   * The default protected query result configuration as specified by the member who can receive results.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html#cfn-cleanrooms-membership-defaultresultconfiguration
   */
  readonly defaultResultConfiguration?: cdk.IResolvable | CfnMembership.MembershipProtectedQueryResultConfigurationProperty;

  /**
   * The payment responsibilities accepted by the collaboration member.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html#cfn-cleanrooms-membership-paymentconfiguration
   */
  readonly paymentConfiguration?: cdk.IResolvable | CfnMembership.MembershipPaymentConfigurationProperty;

  /**
   * An indicator as to whether query logging has been enabled or disabled for the membership.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html#cfn-cleanrooms-membership-querylogstatus
   */
  readonly queryLogStatus: string;

  /**
   * An optional label that you can assign to a resource when you create it.
   *
   * Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cleanrooms-membership.html#cfn-cleanrooms-membership-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ProtectedQueryS3OutputConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProtectedQueryS3OutputConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipProtectedQueryS3OutputConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("keyPrefix", cdk.validateString)(properties.keyPrefix));
  errors.collect(cdk.propertyValidator("resultFormat", cdk.requiredValidator)(properties.resultFormat));
  errors.collect(cdk.propertyValidator("resultFormat", cdk.validateString)(properties.resultFormat));
  return errors.wrap("supplied properties not correct for \"ProtectedQueryS3OutputConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMembershipProtectedQueryS3OutputConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipProtectedQueryS3OutputConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "KeyPrefix": cdk.stringToCloudFormation(properties.keyPrefix),
    "ResultFormat": cdk.stringToCloudFormation(properties.resultFormat)
  };
}

// @ts-ignore TS6133
function CfnMembershipProtectedQueryS3OutputConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMembership.ProtectedQueryS3OutputConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembership.ProtectedQueryS3OutputConfigurationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("keyPrefix", "KeyPrefix", (properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined));
  ret.addPropertyResult("resultFormat", "ResultFormat", (properties.ResultFormat != null ? cfn_parse.FromCloudFormation.getString(properties.ResultFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MembershipProtectedQueryOutputConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MembershipProtectedQueryOutputConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipMembershipProtectedQueryOutputConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3", cdk.requiredValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("s3", CfnMembershipProtectedQueryS3OutputConfigurationPropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"MembershipProtectedQueryOutputConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMembershipMembershipProtectedQueryOutputConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipMembershipProtectedQueryOutputConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3": convertCfnMembershipProtectedQueryS3OutputConfigurationPropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnMembershipMembershipProtectedQueryOutputConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMembership.MembershipProtectedQueryOutputConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembership.MembershipProtectedQueryOutputConfigurationProperty>();
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnMembershipProtectedQueryS3OutputConfigurationPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MembershipProtectedQueryResultConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MembershipProtectedQueryResultConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipMembershipProtectedQueryResultConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("outputConfiguration", cdk.requiredValidator)(properties.outputConfiguration));
  errors.collect(cdk.propertyValidator("outputConfiguration", CfnMembershipMembershipProtectedQueryOutputConfigurationPropertyValidator)(properties.outputConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"MembershipProtectedQueryResultConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMembershipMembershipProtectedQueryResultConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipMembershipProtectedQueryResultConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "OutputConfiguration": convertCfnMembershipMembershipProtectedQueryOutputConfigurationPropertyToCloudFormation(properties.outputConfiguration),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnMembershipMembershipProtectedQueryResultConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMembership.MembershipProtectedQueryResultConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembership.MembershipProtectedQueryResultConfigurationProperty>();
  ret.addPropertyResult("outputConfiguration", "OutputConfiguration", (properties.OutputConfiguration != null ? CfnMembershipMembershipProtectedQueryOutputConfigurationPropertyFromCloudFormation(properties.OutputConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MembershipQueryComputePaymentConfigProperty`
 *
 * @param properties - the TypeScript properties of a `MembershipQueryComputePaymentConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipMembershipQueryComputePaymentConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isResponsible", cdk.requiredValidator)(properties.isResponsible));
  errors.collect(cdk.propertyValidator("isResponsible", cdk.validateBoolean)(properties.isResponsible));
  return errors.wrap("supplied properties not correct for \"MembershipQueryComputePaymentConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMembershipMembershipQueryComputePaymentConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipMembershipQueryComputePaymentConfigPropertyValidator(properties).assertSuccess();
  return {
    "IsResponsible": cdk.booleanToCloudFormation(properties.isResponsible)
  };
}

// @ts-ignore TS6133
function CfnMembershipMembershipQueryComputePaymentConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMembership.MembershipQueryComputePaymentConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembership.MembershipQueryComputePaymentConfigProperty>();
  ret.addPropertyResult("isResponsible", "IsResponsible", (properties.IsResponsible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsResponsible) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MembershipPaymentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MembershipPaymentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipMembershipPaymentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryCompute", cdk.requiredValidator)(properties.queryCompute));
  errors.collect(cdk.propertyValidator("queryCompute", CfnMembershipMembershipQueryComputePaymentConfigPropertyValidator)(properties.queryCompute));
  return errors.wrap("supplied properties not correct for \"MembershipPaymentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMembershipMembershipPaymentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipMembershipPaymentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "QueryCompute": convertCfnMembershipMembershipQueryComputePaymentConfigPropertyToCloudFormation(properties.queryCompute)
  };
}

// @ts-ignore TS6133
function CfnMembershipMembershipPaymentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMembership.MembershipPaymentConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembership.MembershipPaymentConfigurationProperty>();
  ret.addPropertyResult("queryCompute", "QueryCompute", (properties.QueryCompute != null ? CfnMembershipMembershipQueryComputePaymentConfigPropertyFromCloudFormation(properties.QueryCompute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMembershipProps`
 *
 * @param properties - the TypeScript properties of a `CfnMembershipProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMembershipPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("collaborationIdentifier", cdk.requiredValidator)(properties.collaborationIdentifier));
  errors.collect(cdk.propertyValidator("collaborationIdentifier", cdk.validateString)(properties.collaborationIdentifier));
  errors.collect(cdk.propertyValidator("defaultResultConfiguration", CfnMembershipMembershipProtectedQueryResultConfigurationPropertyValidator)(properties.defaultResultConfiguration));
  errors.collect(cdk.propertyValidator("paymentConfiguration", CfnMembershipMembershipPaymentConfigurationPropertyValidator)(properties.paymentConfiguration));
  errors.collect(cdk.propertyValidator("queryLogStatus", cdk.requiredValidator)(properties.queryLogStatus));
  errors.collect(cdk.propertyValidator("queryLogStatus", cdk.validateString)(properties.queryLogStatus));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMembershipProps\"");
}

// @ts-ignore TS6133
function convertCfnMembershipPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMembershipPropsValidator(properties).assertSuccess();
  return {
    "CollaborationIdentifier": cdk.stringToCloudFormation(properties.collaborationIdentifier),
    "DefaultResultConfiguration": convertCfnMembershipMembershipProtectedQueryResultConfigurationPropertyToCloudFormation(properties.defaultResultConfiguration),
    "PaymentConfiguration": convertCfnMembershipMembershipPaymentConfigurationPropertyToCloudFormation(properties.paymentConfiguration),
    "QueryLogStatus": cdk.stringToCloudFormation(properties.queryLogStatus),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMembershipPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMembershipProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMembershipProps>();
  ret.addPropertyResult("collaborationIdentifier", "CollaborationIdentifier", (properties.CollaborationIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CollaborationIdentifier) : undefined));
  ret.addPropertyResult("defaultResultConfiguration", "DefaultResultConfiguration", (properties.DefaultResultConfiguration != null ? CfnMembershipMembershipProtectedQueryResultConfigurationPropertyFromCloudFormation(properties.DefaultResultConfiguration) : undefined));
  ret.addPropertyResult("paymentConfiguration", "PaymentConfiguration", (properties.PaymentConfiguration != null ? CfnMembershipMembershipPaymentConfigurationPropertyFromCloudFormation(properties.PaymentConfiguration) : undefined));
  ret.addPropertyResult("queryLogStatus", "QueryLogStatus", (properties.QueryLogStatus != null ? cfn_parse.FromCloudFormation.getString(properties.QueryLogStatus) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}