/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies an Amazon Connect Wisdom assistant.
 *
 * @cloudformationResource AWS::Wisdom::Assistant
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html
 */
export class CfnAssistant extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Wisdom::Assistant";

  /**
   * Build a CfnAssistant from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssistant {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssistantPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssistant(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the assistant.
   *
   * @cloudformationAttribute AssistantArn
   */
  public readonly attrAssistantArn: string;

  /**
   * The ID of the Wisdom assistant.
   *
   * @cloudformationAttribute AssistantId
   */
  public readonly attrAssistantId: string;

  /**
   * The description of the assistant.
   */
  public description?: string;

  /**
   * The name of the assistant.
   */
  public name: string;

  /**
   * The configuration information for the customer managed key used for encryption.
   */
  public serverSideEncryptionConfiguration?: cdk.IResolvable | CfnAssistant.ServerSideEncryptionConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of assistant.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssistantProps) {
    super(scope, id, {
      "type": CfnAssistant.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrAssistantArn = cdk.Token.asString(this.getAtt("AssistantArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssistantId = cdk.Token.asString(this.getAtt("AssistantId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.serverSideEncryptionConfiguration = props.serverSideEncryptionConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::Assistant", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "serverSideEncryptionConfiguration": this.serverSideEncryptionConfiguration,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssistant.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssistantPropsToCloudFormation(props);
  }
}

export namespace CfnAssistant {
  /**
   * The configuration information for the customer managed key used for encryption.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistant-serversideencryptionconfiguration.html
   */
  export interface ServerSideEncryptionConfigurationProperty {
    /**
     * The customer managed key used for encryption.
     *
     * The customer managed key must have a policy that allows `kms:CreateGrant` and `kms:DescribeKey` permissions to the IAM identity using the key to invoke Wisdom. To use Wisdom with chat, the key policy must also allow `kms:Decrypt` , `kms:GenerateDataKey*` , and `kms:DescribeKey` permissions to the `connect.amazonaws.com` service principal. For more information about setting up a customer managed key for Wisdom, see [Enable Amazon Connect Wisdom for your instance](https://docs.aws.amazon.com/connect/latest/adminguide/enable-wisdom.html) . For information about valid ID values, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) in the *AWS Key Management Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistant-serversideencryptionconfiguration.html#cfn-wisdom-assistant-serversideencryptionconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;
  }
}

/**
 * Properties for defining a `CfnAssistant`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html
 */
export interface CfnAssistantProps {
  /**
   * The description of the assistant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-description
   */
  readonly description?: string;

  /**
   * The name of the assistant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-name
   */
  readonly name: string;

  /**
   * The configuration information for the customer managed key used for encryption.
   *
   * The customer managed key must have a policy that allows `kms:CreateGrant` and `kms:DescribeKey` permissions to the IAM identity using the key to invoke Wisdom. To use Wisdom with chat, the key policy must also allow `kms:Decrypt` , `kms:GenerateDataKey*` , and `kms:DescribeKey` permissions to the `connect.amazonaws.com` service principal. For more information about setting up a customer managed key for Wisdom, see [Enable Amazon Connect Wisdom for your instance](https://docs.aws.amazon.com/connect/latest/adminguide/enable-wisdom.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-serversideencryptionconfiguration
   */
  readonly serverSideEncryptionConfiguration?: cdk.IResolvable | CfnAssistant.ServerSideEncryptionConfigurationProperty;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of assistant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssistantServerSideEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  return errors.wrap("supplied properties not correct for \"ServerSideEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssistantServerSideEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssistantServerSideEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnAssistantServerSideEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssistant.ServerSideEncryptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistant.ServerSideEncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssistantProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssistantProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssistantPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("serverSideEncryptionConfiguration", CfnAssistantServerSideEncryptionConfigurationPropertyValidator)(properties.serverSideEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnAssistantProps\"");
}

// @ts-ignore TS6133
function convertCfnAssistantPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssistantPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ServerSideEncryptionConfiguration": convertCfnAssistantServerSideEncryptionConfigurationPropertyToCloudFormation(properties.serverSideEncryptionConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAssistantPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("serverSideEncryptionConfiguration", "ServerSideEncryptionConfiguration", (properties.ServerSideEncryptionConfiguration != null ? CfnAssistantServerSideEncryptionConfigurationPropertyFromCloudFormation(properties.ServerSideEncryptionConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an association between an Amazon Connect Wisdom assistant and another resource.
 *
 * Currently, the only supported association is with a knowledge base. An assistant can have only a single association.
 *
 * @cloudformationResource AWS::Wisdom::AssistantAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html
 */
export class CfnAssistantAssociation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Wisdom::AssistantAssociation";

  /**
   * Build a CfnAssistantAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssistantAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssistantAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssistantAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Wisdom assistant.
   *
   * @cloudformationAttribute AssistantArn
   */
  public readonly attrAssistantArn: string;

  /**
   * The Amazon Resource Name (ARN) of the assistant association.
   *
   * @cloudformationAttribute AssistantAssociationArn
   */
  public readonly attrAssistantAssociationArn: string;

  /**
   * The ID of the association.
   *
   * @cloudformationAttribute AssistantAssociationId
   */
  public readonly attrAssistantAssociationId: string;

  /**
   * The identifier of the Wisdom assistant.
   */
  public assistantId: string;

  /**
   * The identifier of the associated resource.
   */
  public association: CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable;

  /**
   * The type of association.
   */
  public associationType: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnAssistantAssociationProps) {
    super(scope, id, {
      "type": CfnAssistantAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "assistantId", this);
    cdk.requireProperty(props, "association", this);
    cdk.requireProperty(props, "associationType", this);

    this.attrAssistantArn = cdk.Token.asString(this.getAtt("AssistantArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssistantAssociationArn = cdk.Token.asString(this.getAtt("AssistantAssociationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssistantAssociationId = cdk.Token.asString(this.getAtt("AssistantAssociationId", cdk.ResolutionTypeHint.STRING));
    this.assistantId = props.assistantId;
    this.association = props.association;
    this.associationType = props.associationType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::AssistantAssociation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assistantId": this.assistantId,
      "association": this.association,
      "associationType": this.associationType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssistantAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssistantAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnAssistantAssociation {
  /**
   * A union type that currently has a single argument, which is the knowledge base ID.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistantassociation-associationdata.html
   */
  export interface AssociationDataProperty {
    /**
     * The identifier of the knowledge base.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistantassociation-associationdata.html#cfn-wisdom-assistantassociation-associationdata-knowledgebaseid
     */
    readonly knowledgeBaseId: string;
  }
}

/**
 * Properties for defining a `CfnAssistantAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html
 */
export interface CfnAssistantAssociationProps {
  /**
   * The identifier of the Wisdom assistant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-assistantid
   */
  readonly assistantId: string;

  /**
   * The identifier of the associated resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-association
   */
  readonly association: CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable;

  /**
   * The type of association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-associationtype
   */
  readonly associationType: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AssociationDataProperty`
 *
 * @param properties - the TypeScript properties of a `AssociationDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssistantAssociationAssociationDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("knowledgeBaseId", cdk.requiredValidator)(properties.knowledgeBaseId));
  errors.collect(cdk.propertyValidator("knowledgeBaseId", cdk.validateString)(properties.knowledgeBaseId));
  return errors.wrap("supplied properties not correct for \"AssociationDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssistantAssociationAssociationDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssistantAssociationAssociationDataPropertyValidator(properties).assertSuccess();
  return {
    "KnowledgeBaseId": cdk.stringToCloudFormation(properties.knowledgeBaseId)
  };
}

// @ts-ignore TS6133
function CfnAssistantAssociationAssociationDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantAssociation.AssociationDataProperty>();
  ret.addPropertyResult("knowledgeBaseId", "KnowledgeBaseId", (properties.KnowledgeBaseId != null ? cfn_parse.FromCloudFormation.getString(properties.KnowledgeBaseId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssistantAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssistantAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssistantAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assistantId", cdk.requiredValidator)(properties.assistantId));
  errors.collect(cdk.propertyValidator("assistantId", cdk.validateString)(properties.assistantId));
  errors.collect(cdk.propertyValidator("association", cdk.requiredValidator)(properties.association));
  errors.collect(cdk.propertyValidator("association", CfnAssistantAssociationAssociationDataPropertyValidator)(properties.association));
  errors.collect(cdk.propertyValidator("associationType", cdk.requiredValidator)(properties.associationType));
  errors.collect(cdk.propertyValidator("associationType", cdk.validateString)(properties.associationType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAssistantAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnAssistantAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssistantAssociationPropsValidator(properties).assertSuccess();
  return {
    "AssistantId": cdk.stringToCloudFormation(properties.assistantId),
    "Association": convertCfnAssistantAssociationAssociationDataPropertyToCloudFormation(properties.association),
    "AssociationType": cdk.stringToCloudFormation(properties.associationType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAssistantAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantAssociationProps>();
  ret.addPropertyResult("assistantId", "AssistantId", (properties.AssistantId != null ? cfn_parse.FromCloudFormation.getString(properties.AssistantId) : undefined));
  ret.addPropertyResult("association", "Association", (properties.Association != null ? CfnAssistantAssociationAssociationDataPropertyFromCloudFormation(properties.Association) : undefined));
  ret.addPropertyResult("associationType", "AssociationType", (properties.AssociationType != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a knowledge base.
 *
 * @cloudformationResource AWS::Wisdom::KnowledgeBase
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html
 */
export class CfnKnowledgeBase extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Wisdom::KnowledgeBase";

  /**
   * Build a CfnKnowledgeBase from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKnowledgeBase {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnKnowledgeBasePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnKnowledgeBase(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the knowledge base.
   *
   * @cloudformationAttribute KnowledgeBaseArn
   */
  public readonly attrKnowledgeBaseArn: string;

  /**
   * The ID of the knowledge base.
   *
   * @cloudformationAttribute KnowledgeBaseId
   */
  public readonly attrKnowledgeBaseId: string;

  /**
   * The description.
   */
  public description?: string;

  /**
   * The type of knowledge base.
   */
  public knowledgeBaseType: string;

  /**
   * The name of the knowledge base.
   */
  public name: string;

  /**
   * Information about how to render the content.
   */
  public renderingConfiguration?: cdk.IResolvable | CfnKnowledgeBase.RenderingConfigurationProperty;

  /**
   * This customer managed key must have a policy that allows `kms:CreateGrant` and `kms:DescribeKey` permissions to the IAM identity using the key to invoke Wisdom.
   */
  public serverSideEncryptionConfiguration?: cdk.IResolvable | CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty;

  /**
   * The source of the knowledge base content.
   */
  public sourceConfiguration?: cdk.IResolvable | CfnKnowledgeBase.SourceConfigurationProperty;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnKnowledgeBaseProps) {
    super(scope, id, {
      "type": CfnKnowledgeBase.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "knowledgeBaseType", this);
    cdk.requireProperty(props, "name", this);

    this.attrKnowledgeBaseArn = cdk.Token.asString(this.getAtt("KnowledgeBaseArn", cdk.ResolutionTypeHint.STRING));
    this.attrKnowledgeBaseId = cdk.Token.asString(this.getAtt("KnowledgeBaseId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.knowledgeBaseType = props.knowledgeBaseType;
    this.name = props.name;
    this.renderingConfiguration = props.renderingConfiguration;
    this.serverSideEncryptionConfiguration = props.serverSideEncryptionConfiguration;
    this.sourceConfiguration = props.sourceConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::KnowledgeBase", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "knowledgeBaseType": this.knowledgeBaseType,
      "name": this.name,
      "renderingConfiguration": this.renderingConfiguration,
      "serverSideEncryptionConfiguration": this.serverSideEncryptionConfiguration,
      "sourceConfiguration": this.sourceConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnKnowledgeBase.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnKnowledgeBasePropsToCloudFormation(props);
  }
}

export namespace CfnKnowledgeBase {
  /**
   * Configuration information about the external data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-sourceconfiguration.html
   */
  export interface SourceConfigurationProperty {
    /**
     * Configuration information for Amazon AppIntegrations to automatically ingest content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-sourceconfiguration.html#cfn-wisdom-knowledgebase-sourceconfiguration-appintegrations
     */
    readonly appIntegrations: CfnKnowledgeBase.AppIntegrationsConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Configuration information for Amazon AppIntegrations to automatically ingest content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html
   */
  export interface AppIntegrationsConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the AppIntegrations DataIntegration to use for ingesting content.
     *
     * - For [Salesforce](https://docs.aws.amazon.com/https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/sforce_api_objects_knowledge__kav.htm) , your AppIntegrations DataIntegration must have an ObjectConfiguration if objectFields is not provided, including at least `Id` , `ArticleNumber` , `VersionNumber` , `Title` , `PublishStatus` , and `IsDeleted` as source fields.
     * - For [ServiceNow](https://docs.aws.amazon.com/https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/knowledge-management-api) , your AppIntegrations DataIntegration must have an ObjectConfiguration if objectFields is not provided, including at least `number` , `short_description` , `sys_mod_count` , `workflow_state` , and `active` as source fields.
     * - For [Zendesk](https://docs.aws.amazon.com/https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/) , your AppIntegrations DataIntegration must have an ObjectConfiguration if `objectFields` is not provided, including at least `id` , `title` , `updated_at` , and `draft` as source fields.
     * - For [SharePoint](https://docs.aws.amazon.com/https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/sharepoint-net-server-csom-jsom-and-rest-api-index) , your AppIntegrations DataIntegration must have a FileConfiguration, including only file extensions that are among `docx` , `pdf` , `html` , `htm` , and `txt` .
     * - For [Amazon S3](https://docs.aws.amazon.com/https://aws.amazon.com/s3/) , the ObjectConfiguration and FileConfiguration of your AppIntegrations DataIntegration must be null. The `SourceURI` of your DataIntegration must use the following format: `s3://your_s3_bucket_name` .
     *
     * > The bucket policy of the corresponding S3 bucket must allow the AWS principal `app-integrations.amazonaws.com` to perform `s3:ListBucket` , `s3:GetObject` , and `s3:GetBucketLocation` against the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html#cfn-wisdom-knowledgebase-appintegrationsconfiguration-appintegrationarn
     */
    readonly appIntegrationArn: string;

    /**
     * The fields from the source that are made available to your agents in Amazon Q.
     *
     * Optional if ObjectConfiguration is included in the provided DataIntegration.
     *
     * - For [Salesforce](https://docs.aws.amazon.com/https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/sforce_api_objects_knowledge__kav.htm) , you must include at least `Id` , `ArticleNumber` , `VersionNumber` , `Title` , `PublishStatus` , and `IsDeleted` .
     * - For [ServiceNow](https://docs.aws.amazon.com/https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/knowledge-management-api) , you must include at least `number` , `short_description` , `sys_mod_count` , `workflow_state` , and `active` .
     * - For [Zendesk](https://docs.aws.amazon.com/https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/) , you must include at least `id` , `title` , `updated_at` , and `draft` .
     *
     * Make sure to include additional fields. These fields are indexed and used to source recommendations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html#cfn-wisdom-knowledgebase-appintegrationsconfiguration-objectfields
     */
    readonly objectFields?: Array<string>;
  }

  /**
   * The configuration information for the customer managed key used for encryption.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-serversideencryptionconfiguration.html
   */
  export interface ServerSideEncryptionConfigurationProperty {
    /**
     * The customer managed key used for encryption.
     *
     * This customer managed key must have a policy that allows `kms:CreateGrant` and `kms:DescribeKey` permissions to the IAM identity using the key to invoke Wisdom.
     *
     * For more information about setting up a customer managed key for Wisdom, see [Enable Amazon Connect Wisdom for your instance](https://docs.aws.amazon.com/connect/latest/adminguide/enable-wisdom.html) . For information about valid ID values, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-serversideencryptionconfiguration.html#cfn-wisdom-knowledgebase-serversideencryptionconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;
  }

  /**
   * Information about how to render the content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-renderingconfiguration.html
   */
  export interface RenderingConfigurationProperty {
    /**
     * A URI template containing exactly one variable in `${variableName}` format.
     *
     * This can only be set for `EXTERNAL` knowledge bases. For Salesforce, ServiceNow, and Zendesk, the variable must be one of the following:
     *
     * - Salesforce: `Id` , `ArticleNumber` , `VersionNumber` , `Title` , `PublishStatus` , or `IsDeleted`
     * - ServiceNow: `number` , `short_description` , `sys_mod_count` , `workflow_state` , or `active`
     * - Zendesk: `id` , `title` , `updated_at` , or `draft`
     *
     * The variable is replaced with the actual value for a piece of content when calling [GetContent](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_GetContent.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-renderingconfiguration.html#cfn-wisdom-knowledgebase-renderingconfiguration-templateuri
     */
    readonly templateUri?: string;
  }
}

/**
 * Properties for defining a `CfnKnowledgeBase`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html
 */
export interface CfnKnowledgeBaseProps {
  /**
   * The description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-description
   */
  readonly description?: string;

  /**
   * The type of knowledge base.
   *
   * Only CUSTOM knowledge bases allow you to upload your own content. EXTERNAL knowledge bases support integrations with third-party systems whose content is synchronized automatically.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-knowledgebasetype
   */
  readonly knowledgeBaseType: string;

  /**
   * The name of the knowledge base.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-name
   */
  readonly name: string;

  /**
   * Information about how to render the content.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-renderingconfiguration
   */
  readonly renderingConfiguration?: cdk.IResolvable | CfnKnowledgeBase.RenderingConfigurationProperty;

  /**
   * This customer managed key must have a policy that allows `kms:CreateGrant` and `kms:DescribeKey` permissions to the IAM identity using the key to invoke Wisdom.
   *
   * For more information about setting up a customer managed key for Wisdom, see [Enable Amazon Connect Wisdom for your instance](https://docs.aws.amazon.com/connect/latest/adminguide/enable-wisdom.html) . For information about valid ID values, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) in the *AWS Key Management Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-serversideencryptionconfiguration
   */
  readonly serverSideEncryptionConfiguration?: cdk.IResolvable | CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty;

  /**
   * The source of the knowledge base content.
   *
   * Only set this argument for EXTERNAL knowledge bases.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-sourceconfiguration
   */
  readonly sourceConfiguration?: cdk.IResolvable | CfnKnowledgeBase.SourceConfigurationProperty;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AppIntegrationsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AppIntegrationsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKnowledgeBaseAppIntegrationsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appIntegrationArn", cdk.requiredValidator)(properties.appIntegrationArn));
  errors.collect(cdk.propertyValidator("appIntegrationArn", cdk.validateString)(properties.appIntegrationArn));
  errors.collect(cdk.propertyValidator("objectFields", cdk.listValidator(cdk.validateString))(properties.objectFields));
  return errors.wrap("supplied properties not correct for \"AppIntegrationsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnKnowledgeBaseAppIntegrationsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKnowledgeBaseAppIntegrationsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AppIntegrationArn": cdk.stringToCloudFormation(properties.appIntegrationArn),
    "ObjectFields": cdk.listMapper(cdk.stringToCloudFormation)(properties.objectFields)
  };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseAppIntegrationsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBase.AppIntegrationsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.AppIntegrationsConfigurationProperty>();
  ret.addPropertyResult("appIntegrationArn", "AppIntegrationArn", (properties.AppIntegrationArn != null ? cfn_parse.FromCloudFormation.getString(properties.AppIntegrationArn) : undefined));
  ret.addPropertyResult("objectFields", "ObjectFields", (properties.ObjectFields != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ObjectFields) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKnowledgeBaseSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appIntegrations", cdk.requiredValidator)(properties.appIntegrations));
  errors.collect(cdk.propertyValidator("appIntegrations", CfnKnowledgeBaseAppIntegrationsConfigurationPropertyValidator)(properties.appIntegrations));
  return errors.wrap("supplied properties not correct for \"SourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnKnowledgeBaseSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKnowledgeBaseSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AppIntegrations": convertCfnKnowledgeBaseAppIntegrationsConfigurationPropertyToCloudFormation(properties.appIntegrations)
  };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnKnowledgeBase.SourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.SourceConfigurationProperty>();
  ret.addPropertyResult("appIntegrations", "AppIntegrations", (properties.AppIntegrations != null ? CfnKnowledgeBaseAppIntegrationsConfigurationPropertyFromCloudFormation(properties.AppIntegrations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  return errors.wrap("supplied properties not correct for \"ServerSideEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnKnowledgeBaseServerSideEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RenderingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RenderingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKnowledgeBaseRenderingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("templateUri", cdk.validateString)(properties.templateUri));
  return errors.wrap("supplied properties not correct for \"RenderingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnKnowledgeBaseRenderingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKnowledgeBaseRenderingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TemplateUri": cdk.stringToCloudFormation(properties.templateUri)
  };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseRenderingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnKnowledgeBase.RenderingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.RenderingConfigurationProperty>();
  ret.addPropertyResult("templateUri", "TemplateUri", (properties.TemplateUri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnKnowledgeBaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnKnowledgeBaseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKnowledgeBasePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("knowledgeBaseType", cdk.requiredValidator)(properties.knowledgeBaseType));
  errors.collect(cdk.propertyValidator("knowledgeBaseType", cdk.validateString)(properties.knowledgeBaseType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("renderingConfiguration", CfnKnowledgeBaseRenderingConfigurationPropertyValidator)(properties.renderingConfiguration));
  errors.collect(cdk.propertyValidator("serverSideEncryptionConfiguration", CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyValidator)(properties.serverSideEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("sourceConfiguration", CfnKnowledgeBaseSourceConfigurationPropertyValidator)(properties.sourceConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnKnowledgeBaseProps\"");
}

// @ts-ignore TS6133
function convertCfnKnowledgeBasePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKnowledgeBasePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "KnowledgeBaseType": cdk.stringToCloudFormation(properties.knowledgeBaseType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RenderingConfiguration": convertCfnKnowledgeBaseRenderingConfigurationPropertyToCloudFormation(properties.renderingConfiguration),
    "ServerSideEncryptionConfiguration": convertCfnKnowledgeBaseServerSideEncryptionConfigurationPropertyToCloudFormation(properties.serverSideEncryptionConfiguration),
    "SourceConfiguration": convertCfnKnowledgeBaseSourceConfigurationPropertyToCloudFormation(properties.sourceConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnKnowledgeBasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBaseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBaseProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("knowledgeBaseType", "KnowledgeBaseType", (properties.KnowledgeBaseType != null ? cfn_parse.FromCloudFormation.getString(properties.KnowledgeBaseType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("renderingConfiguration", "RenderingConfiguration", (properties.RenderingConfiguration != null ? CfnKnowledgeBaseRenderingConfigurationPropertyFromCloudFormation(properties.RenderingConfiguration) : undefined));
  ret.addPropertyResult("serverSideEncryptionConfiguration", "ServerSideEncryptionConfiguration", (properties.ServerSideEncryptionConfiguration != null ? CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyFromCloudFormation(properties.ServerSideEncryptionConfiguration) : undefined));
  ret.addPropertyResult("sourceConfiguration", "SourceConfiguration", (properties.SourceConfiguration != null ? CfnKnowledgeBaseSourceConfigurationPropertyFromCloudFormation(properties.SourceConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}