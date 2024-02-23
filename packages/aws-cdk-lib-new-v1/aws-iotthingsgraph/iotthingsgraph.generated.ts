/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html.
 *
 * @cloudformationResource AWS::IoTThingsGraph::FlowTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html
 */
export class CfnFlowTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTThingsGraph::FlowTemplate";

  /**
   * Build a CfnFlowTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlowTemplate(scope, id, propsResult.value);
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

  public compatibleNamespaceVersion?: number;

  public definition: CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowTemplateProps) {
    super(scope, id, {
      "type": CfnFlowTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "definition", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.compatibleNamespaceVersion = props.compatibleNamespaceVersion;
    this.definition = props.definition;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "compatibleNamespaceVersion": this.compatibleNamespaceVersion,
      "definition": this.definition
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnFlowTemplate {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html
   */
  export interface DefinitionDocumentProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html#cfn-iotthingsgraph-flowtemplate-definitiondocument-language
     */
    readonly language: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html#cfn-iotthingsgraph-flowtemplate-definitiondocument-text
     */
    readonly text: string;
  }
}

/**
 * Properties for defining a `CfnFlowTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html
 */
export interface CfnFlowTemplateProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-compatiblenamespaceversion
   */
  readonly compatibleNamespaceVersion?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-definition
   */
  readonly definition: CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DefinitionDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionDocumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowTemplateDefinitionDocumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("language", cdk.requiredValidator)(properties.language));
  errors.collect(cdk.propertyValidator("language", cdk.validateString)(properties.language));
  errors.collect(cdk.propertyValidator("text", cdk.requiredValidator)(properties.text));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  return errors.wrap("supplied properties not correct for \"DefinitionDocumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowTemplateDefinitionDocumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTemplateDefinitionDocumentPropertyValidator(properties).assertSuccess();
  return {
    "Language": cdk.stringToCloudFormation(properties.language),
    "Text": cdk.stringToCloudFormation(properties.text)
  };
}

// @ts-ignore TS6133
function CfnFlowTemplateDefinitionDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowTemplate.DefinitionDocumentProperty>();
  ret.addPropertyResult("language", "Language", (properties.Language != null ? cfn_parse.FromCloudFormation.getString(properties.Language) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compatibleNamespaceVersion", cdk.validateNumber)(properties.compatibleNamespaceVersion));
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", CfnFlowTemplateDefinitionDocumentPropertyValidator)(properties.definition));
  return errors.wrap("supplied properties not correct for \"CfnFlowTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTemplatePropsValidator(properties).assertSuccess();
  return {
    "CompatibleNamespaceVersion": cdk.numberToCloudFormation(properties.compatibleNamespaceVersion),
    "Definition": convertCfnFlowTemplateDefinitionDocumentPropertyToCloudFormation(properties.definition)
  };
}

// @ts-ignore TS6133
function CfnFlowTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowTemplateProps>();
  ret.addPropertyResult("compatibleNamespaceVersion", "CompatibleNamespaceVersion", (properties.CompatibleNamespaceVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.CompatibleNamespaceVersion) : undefined));
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? CfnFlowTemplateDefinitionDocumentPropertyFromCloudFormation(properties.Definition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}