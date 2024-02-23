/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Represents a AWS Service Catalog AppRegistry application that is the top-level node in a hierarchy of related cloud resource abstractions.
 *
 * @cloudformationResource AWS::ServiceCatalogAppRegistry::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalogAppRegistry::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the application. The name must be unique in the region in which you are creating the application.
   *
   * @cloudformationAttribute ApplicationName
   */
  public readonly attrApplicationName: string;

  /**
   * The key of the AWS application tag, which is awsApplication. Applications created before 11/13/2023 or applications without the AWS application tag resource group return no value.
   *
   * @cloudformationAttribute ApplicationTagKey
   */
  public readonly attrApplicationTagKey: string;

  /**
   * The value of the AWS application tag, which is the identifier of an associated resource. Applications created before 11/13/2023 or applications without the AWS application tag resource group return no value.
   *
   * @cloudformationAttribute ApplicationTagValue
   */
  public readonly attrApplicationTagValue: string;

  /**
   * The Amazon resource name (ARN) that specifies the application across services.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The identifier of the application.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The description of the application.
   */
  public description?: string;

  /**
   * The name of the application.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs you can use to associate with the application.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrApplicationName = cdk.Token.asString(this.getAtt("ApplicationName", cdk.ResolutionTypeHint.STRING));
    this.attrApplicationTagKey = cdk.Token.asString(this.getAtt("ApplicationTagKey", cdk.ResolutionTypeHint.STRING));
    this.attrApplicationTagValue = cdk.Token.asString(this.getAtt("ApplicationTagValue", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ServiceCatalogAppRegistry::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-application.html
 */
export interface CfnApplicationProps {
  /**
   * The description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-application.html#cfn-servicecatalogappregistry-application-description
   */
  readonly description?: string;

  /**
   * The name of the application.
   *
   * The name must be unique in the region in which you are creating the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-application.html#cfn-servicecatalogappregistry-application-name
   */
  readonly name: string;

  /**
   * Key-value pairs you can use to associate with the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-application.html#cfn-servicecatalogappregistry-application-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new attribute group as a container for user-defined attributes.
 *
 * This feature enables users to have full control over their cloud application's metadata in a rich machine-readable format to facilitate integration with automated workflows and third-party tools.
 *
 * @cloudformationResource AWS::ServiceCatalogAppRegistry::AttributeGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html
 */
export class CfnAttributeGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalogAppRegistry::AttributeGroup";

  /**
   * Build a CfnAttributeGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAttributeGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAttributeGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAttributeGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon resource name (ARN) that specifies the attribute group across services.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The globally unique attribute group identifier of the attribute group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A nested object in a JSON or YAML template that supports arbitrary definitions.
   */
  public attributes: any | cdk.IResolvable;

  /**
   * The description of the attribute group that the user provides.
   */
  public description?: string;

  /**
   * The name of the attribute group.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs you can use to associate with the attribute group.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAttributeGroupProps) {
    super(scope, id, {
      "type": CfnAttributeGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "attributes", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attributes = props.attributes;
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ServiceCatalogAppRegistry::AttributeGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributes": this.attributes,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAttributeGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAttributeGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAttributeGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html
 */
export interface CfnAttributeGroupProps {
  /**
   * A nested object in a JSON or YAML template that supports arbitrary definitions.
   *
   * Represents the attributes in an attribute group that describes an application and its components.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html#cfn-servicecatalogappregistry-attributegroup-attributes
   */
  readonly attributes: any | cdk.IResolvable;

  /**
   * The description of the attribute group that the user provides.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html#cfn-servicecatalogappregistry-attributegroup-description
   */
  readonly description?: string;

  /**
   * The name of the attribute group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html#cfn-servicecatalogappregistry-attributegroup-name
   */
  readonly name: string;

  /**
   * Key-value pairs you can use to associate with the attribute group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroup.html#cfn-servicecatalogappregistry-attributegroup-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnAttributeGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnAttributeGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAttributeGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.validateObject)(properties.attributes));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAttributeGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnAttributeGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAttributeGroupPropsValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.objectToCloudFormation(properties.attributes),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAttributeGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAttributeGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAttributeGroupProps>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates an attribute group with an application to augment the application's metadata with the group's attributes.
 *
 * This feature enables applications to be described with user-defined details that are machine-readable, such as third-party integrations.
 *
 * @cloudformationResource AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroupassociation.html
 */
export class CfnAttributeGroupAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation";

  /**
   * Build a CfnAttributeGroupAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAttributeGroupAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAttributeGroupAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAttributeGroupAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon resource name (ARN) of the application that was augmented with attributes.
   *
   * @cloudformationAttribute ApplicationArn
   */
  public readonly attrApplicationArn: string;

  /**
   * The Amazon resource name (ARN) of the attribute group which contains the application's new attributes.
   *
   * @cloudformationAttribute AttributeGroupArn
   */
  public readonly attrAttributeGroupArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name or ID of the application.
   */
  public application: string;

  /**
   * The name or ID of the attribute group which holds the attributes that describe the application.
   */
  public attributeGroup: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAttributeGroupAssociationProps) {
    super(scope, id, {
      "type": CfnAttributeGroupAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "application", this);
    cdk.requireProperty(props, "attributeGroup", this);

    this.attrApplicationArn = cdk.Token.asString(this.getAtt("ApplicationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAttributeGroupArn = cdk.Token.asString(this.getAtt("AttributeGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.application = props.application;
    this.attributeGroup = props.attributeGroup;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "application": this.application,
      "attributeGroup": this.attributeGroup
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAttributeGroupAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAttributeGroupAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAttributeGroupAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroupassociation.html
 */
export interface CfnAttributeGroupAssociationProps {
  /**
   * The name or ID of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroupassociation.html#cfn-servicecatalogappregistry-attributegroupassociation-application
   */
  readonly application: string;

  /**
   * The name or ID of the attribute group which holds the attributes that describe the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-attributegroupassociation.html#cfn-servicecatalogappregistry-attributegroupassociation-attributegroup
   */
  readonly attributeGroup: string;
}

/**
 * Determine whether the given properties match those of a `CfnAttributeGroupAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAttributeGroupAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAttributeGroupAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("application", cdk.requiredValidator)(properties.application));
  errors.collect(cdk.propertyValidator("application", cdk.validateString)(properties.application));
  errors.collect(cdk.propertyValidator("attributeGroup", cdk.requiredValidator)(properties.attributeGroup));
  errors.collect(cdk.propertyValidator("attributeGroup", cdk.validateString)(properties.attributeGroup));
  return errors.wrap("supplied properties not correct for \"CfnAttributeGroupAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnAttributeGroupAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAttributeGroupAssociationPropsValidator(properties).assertSuccess();
  return {
    "Application": cdk.stringToCloudFormation(properties.application),
    "AttributeGroup": cdk.stringToCloudFormation(properties.attributeGroup)
  };
}

// @ts-ignore TS6133
function CfnAttributeGroupAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAttributeGroupAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAttributeGroupAssociationProps>();
  ret.addPropertyResult("application", "Application", (properties.Application != null ? cfn_parse.FromCloudFormation.getString(properties.Application) : undefined));
  ret.addPropertyResult("attributeGroup", "AttributeGroup", (properties.AttributeGroup != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates a resource with an application.
 *
 * Both the resource and the application can be specified either by ID or name.
 *
 * @cloudformationResource AWS::ServiceCatalogAppRegistry::ResourceAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-resourceassociation.html
 */
export class CfnResourceAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalogAppRegistry::ResourceAssociation";

  /**
   * Build a CfnResourceAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon resource name (ARN) that specifies the application.
   *
   * @cloudformationAttribute ApplicationArn
   */
  public readonly attrApplicationArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon resource name (ARN) that specifies the resource.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name or ID of the application.
   */
  public application: string;

  /**
   * The name or ID of the resource of which the application will be associated.
   */
  public resource: string;

  /**
   * The type of resource of which the application will be associated.
   */
  public resourceType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceAssociationProps) {
    super(scope, id, {
      "type": CfnResourceAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "application", this);
    cdk.requireProperty(props, "resource", this);
    cdk.requireProperty(props, "resourceType", this);

    this.attrApplicationArn = cdk.Token.asString(this.getAtt("ApplicationArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.application = props.application;
    this.resource = props.resource;
    this.resourceType = props.resourceType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "application": this.application,
      "resource": this.resource,
      "resourceType": this.resourceType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-resourceassociation.html
 */
export interface CfnResourceAssociationProps {
  /**
   * The name or ID of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-resourceassociation.html#cfn-servicecatalogappregistry-resourceassociation-application
   */
  readonly application: string;

  /**
   * The name or ID of the resource of which the application will be associated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-resourceassociation.html#cfn-servicecatalogappregistry-resourceassociation-resource
   */
  readonly resource: string;

  /**
   * The type of resource of which the application will be associated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalogappregistry-resourceassociation.html#cfn-servicecatalogappregistry-resourceassociation-resourcetype
   */
  readonly resourceType: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("application", cdk.requiredValidator)(properties.application));
  errors.collect(cdk.propertyValidator("application", cdk.validateString)(properties.application));
  errors.collect(cdk.propertyValidator("resource", cdk.requiredValidator)(properties.resource));
  errors.collect(cdk.propertyValidator("resource", cdk.validateString)(properties.resource));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  return errors.wrap("supplied properties not correct for \"CfnResourceAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceAssociationPropsValidator(properties).assertSuccess();
  return {
    "Application": cdk.stringToCloudFormation(properties.application),
    "Resource": cdk.stringToCloudFormation(properties.resource),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType)
  };
}

// @ts-ignore TS6133
function CfnResourceAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceAssociationProps>();
  ret.addPropertyResult("application", "Application", (properties.Application != null ? cfn_parse.FromCloudFormation.getString(properties.Application) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? cfn_parse.FromCloudFormation.getString(properties.Resource) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}