/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a data access policy for OpenSearch Serverless.
 *
 * Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see [Data access control for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::AccessPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html
 */
export class CfnAccessPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::AccessPolicy";

  /**
   * Build a CfnAccessPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the policy.
   */
  public description?: string;

  /**
   * The name of the policy.
   */
  public name: string;

  /**
   * The JSON policy document without any whitespaces.
   */
  public policy: string;

  /**
   * The type of access policy.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessPolicyProps) {
    super(scope, id, {
      "type": CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "type", this);

    this.description = props.description;
    this.name = props.name;
    this.policy = props.policy;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "policy": this.policy,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html
 */
export interface CfnAccessPolicyProps {
  /**
   * The description of the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-description
   */
  readonly description?: string;

  /**
   * The name of the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-name
   */
  readonly name: string;

  /**
   * The JSON policy document without any whitespaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-policy
   */
  readonly policy: string;

  /**
   * The type of access policy.
   *
   * Currently the only option is `data` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnAccessPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.stringToCloudFormation(properties.policy),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an OpenSearch Serverless collection.
 *
 * For more information, see [Creating and managing Amazon OpenSearch Serverless collections](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-manage.html) in the *Amazon OpenSearch Service Developer Guide* .
 *
 * > You must create a matching [encryption policy](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-encryption.html) in order for a collection to be created successfully. You can specify the policy resource within the same CloudFormation template as the collection resource if you use the [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) attribute. See [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#aws-resource-opensearchserverless-collection--examples) for a sample template. Otherwise the encryption policy must already exist before you create the collection.
 *
 * @cloudformationResource AWS::OpenSearchServerless::Collection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html
 */
export class CfnCollection extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::Collection";

  /**
   * Build a CfnCollection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCollection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCollectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCollection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the collection. For example, `arn:aws:aoss:us-east-1:123456789012:collection/07tjusf2h91cunochc` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Collection-specific endpoint used to submit index, search, and data upload requests to an OpenSearch Serverless collection. For example, `https://07tjusf2h91cunochc.us-east-1.aoss.amazonaws.com` .
   *
   * @cloudformationAttribute CollectionEndpoint
   */
  public readonly attrCollectionEndpoint: string;

  /**
   * The collection-specific endpoint used to access OpenSearch Dashboards. For example, `https://07tjusf2h91cunochc.us-east-1.aoss.amazonaws.com/_dashboards` .
   *
   * @cloudformationAttribute DashboardEndpoint
   */
  public readonly attrDashboardEndpoint: string;

  /**
   * A unique identifier for the collection. For example, `07tjusf2h91cunochc` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description of the collection.
   */
  public description?: string;

  /**
   * The name of the collection.
   */
  public name: string;

  /**
   * Details about an OpenSearch Serverless collection.
   */
  public standbyReplicas?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the collection.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of collection.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCollectionProps) {
    super(scope, id, {
      "type": CfnCollection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCollectionEndpoint = cdk.Token.asString(this.getAtt("CollectionEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrDashboardEndpoint = cdk.Token.asString(this.getAtt("DashboardEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.standbyReplicas = props.standbyReplicas;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpenSearchServerless::Collection", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "standbyReplicas": this.standbyReplicas,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCollection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCollectionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCollection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html
 */
export interface CfnCollectionProps {
  /**
   * A description of the collection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-description
   */
  readonly description?: string;

  /**
   * The name of the collection.
   *
   * Collection names must meet the following criteria:
   *
   * - Starts with a lowercase letter
   * - Unique to your account and AWS Region
   * - Contains between 3 and 28 characters
   * - Contains only lowercase letters a-z, the numbers 0-9, and the hyphen (-)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-name
   */
  readonly name: string;

  /**
   * Details about an OpenSearch Serverless collection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-standbyreplicas
   */
  readonly standbyReplicas?: string;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the collection.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of collection.
   *
   * Possible values are `SEARCH` , `TIMESERIES` , and `VECTORSEARCH` . For more information, see [Choosing a collection type](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-overview.html#serverless-usecase) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCollectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCollectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("standbyReplicas", cdk.validateString)(properties.standbyReplicas));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnCollectionProps\"");
}

// @ts-ignore TS6133
function convertCfnCollectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCollectionPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StandbyReplicas": cdk.stringToCloudFormation(properties.standbyReplicas),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCollectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCollectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollectionProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("standbyReplicas", "StandbyReplicas", (properties.StandbyReplicas != null ? cfn_parse.FromCloudFormation.getString(properties.StandbyReplicas) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a security configuration for OpenSearch Serverless.
 *
 * For more information, see [SAML authentication for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-saml.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::SecurityConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html
 */
export class CfnSecurityConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::SecurityConfig";

  /**
   * Build a CfnSecurityConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the security configuration. For example, `saml/123456789012/myprovider` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The description of the security configuration.
   */
  public description?: string;

  /**
   * The name of the security configuration.
   */
  public name?: string;

  /**
   * SAML options for the security configuration in the form of a key-value map.
   */
  public samlOptions?: cdk.IResolvable | CfnSecurityConfig.SamlConfigOptionsProperty;

  /**
   * The type of security configuration.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityConfigProps = {}) {
    super(scope, id, {
      "type": CfnSecurityConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.samlOptions = props.samlOptions;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "samlOptions": this.samlOptions,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityConfigPropsToCloudFormation(props);
  }
}

export namespace CfnSecurityConfig {
  /**
   * Describes SAML options for an OpenSearch Serverless security configuration in the form of a key-value map.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html
   */
  export interface SamlConfigOptionsProperty {
    /**
     * The group attribute for this SAML integration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-groupattribute
     */
    readonly groupAttribute?: string;

    /**
     * The XML IdP metadata file generated from your identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-metadata
     */
    readonly metadata: string;

    /**
     * The session timeout, in minutes.
     *
     * Default is 60 minutes (12 hours).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-sessiontimeout
     */
    readonly sessionTimeout?: number;

    /**
     * A user attribute for this SAML integration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-userattribute
     */
    readonly userAttribute?: string;
  }
}

/**
 * Properties for defining a `CfnSecurityConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html
 */
export interface CfnSecurityConfigProps {
  /**
   * The description of the security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-description
   */
  readonly description?: string;

  /**
   * The name of the security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-name
   */
  readonly name?: string;

  /**
   * SAML options for the security configuration in the form of a key-value map.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-samloptions
   */
  readonly samlOptions?: cdk.IResolvable | CfnSecurityConfig.SamlConfigOptionsProperty;

  /**
   * The type of security configuration.
   *
   * Currently the only option is `saml` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `SamlConfigOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SamlConfigOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigSamlConfigOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupAttribute", cdk.validateString)(properties.groupAttribute));
  errors.collect(cdk.propertyValidator("metadata", cdk.requiredValidator)(properties.metadata));
  errors.collect(cdk.propertyValidator("metadata", cdk.validateString)(properties.metadata));
  errors.collect(cdk.propertyValidator("sessionTimeout", cdk.validateNumber)(properties.sessionTimeout));
  errors.collect(cdk.propertyValidator("userAttribute", cdk.validateString)(properties.userAttribute));
  return errors.wrap("supplied properties not correct for \"SamlConfigOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigSamlConfigOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigSamlConfigOptionsPropertyValidator(properties).assertSuccess();
  return {
    "GroupAttribute": cdk.stringToCloudFormation(properties.groupAttribute),
    "Metadata": cdk.stringToCloudFormation(properties.metadata),
    "SessionTimeout": cdk.numberToCloudFormation(properties.sessionTimeout),
    "UserAttribute": cdk.stringToCloudFormation(properties.userAttribute)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigSamlConfigOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityConfig.SamlConfigOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfig.SamlConfigOptionsProperty>();
  ret.addPropertyResult("groupAttribute", "GroupAttribute", (properties.GroupAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.GroupAttribute) : undefined));
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? cfn_parse.FromCloudFormation.getString(properties.Metadata) : undefined));
  ret.addPropertyResult("sessionTimeout", "SessionTimeout", (properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined));
  ret.addPropertyResult("userAttribute", "UserAttribute", (properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("samlOptions", CfnSecurityConfigSamlConfigOptionsPropertyValidator)(properties.samlOptions));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnSecurityConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SamlOptions": convertCfnSecurityConfigSamlConfigOptionsPropertyToCloudFormation(properties.samlOptions),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfigProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("samlOptions", "SamlOptions", (properties.SamlOptions != null ? CfnSecurityConfigSamlConfigOptionsPropertyFromCloudFormation(properties.SamlOptions) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an encryption or network policy to be used by one or more OpenSearch Serverless collections.
 *
 * Network policies specify access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. For more information, see [Network access for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-network.html) .
 *
 * Encryption policies specify a KMS encryption key to assign to particular collections. For more information, see [Encryption at rest for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-encryption.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::SecurityPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html
 */
export class CfnSecurityPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::SecurityPolicy";

  /**
   * Build a CfnSecurityPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the security policy.
   */
  public description?: string;

  /**
   * The name of the policy.
   */
  public name: string;

  /**
   * The JSON policy document without any whitespaces.
   */
  public policy: string;

  /**
   * The type of security policy.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityPolicyProps) {
    super(scope, id, {
      "type": CfnSecurityPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "type", this);

    this.description = props.description;
    this.name = props.name;
    this.policy = props.policy;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "policy": this.policy,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSecurityPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html
 */
export interface CfnSecurityPolicyProps {
  /**
   * The description of the security policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-description
   */
  readonly description?: string;

  /**
   * The name of the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-name
   */
  readonly name: string;

  /**
   * The JSON policy document without any whitespaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-policy
   */
  readonly policy: string;

  /**
   * The type of security policy.
   *
   * Can be either `encryption` or `network` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnSecurityPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityPolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.stringToCloudFormation(properties.policy),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSecurityPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityPolicyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an OpenSearch Serverless-managed interface VPC endpoint.
 *
 * For more information, see [Access Amazon OpenSearch Serverless using an interface endpoint](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-vpc.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::VpcEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html
 */
export class CfnVpcEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::VpcEndpoint";

  /**
   * Build a CfnVpcEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the endpoint. For example, `vpce-050f79086ee71ac05` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the endpoint.
   */
  public name: string;

  /**
   * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
   */
  public securityGroupIds?: Array<string>;

  /**
   * The ID of the subnets from which you access OpenSearch Serverless.
   */
  public subnetIds: Array<string>;

  /**
   * The ID of the VPC from which you access OpenSearch Serverless.
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcEndpointProps) {
    super(scope, id, {
      "type": CfnVpcEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "subnetIds", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetIds = props.subnetIds;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "securityGroupIds": this.securityGroupIds,
      "subnetIds": this.subnetIds,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcEndpointPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVpcEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html
 */
export interface CfnVpcEndpointProps {
  /**
   * The name of the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-name
   */
  readonly name: string;

  /**
   * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * The ID of the subnets from which you access OpenSearch Serverless.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * The ID of the VPC from which you access OpenSearch Serverless.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `CfnVpcEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnVpcEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcEndpointPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnVpcEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcEndpointProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a lifecyle policy to be applied to OpenSearch Serverless indexes.
 *
 * Lifecycle policies define the number of days or hours to retain the data on an OpenSearch Serverless index. For more information, see [Creating data lifecycle policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-lifecycle.html#serverless-lifecycle-create) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::LifecyclePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html
 */
export class CfnLifecyclePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchServerless::LifecyclePolicy";

  /**
   * Build a CfnLifecyclePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecyclePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLifecyclePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLifecyclePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the lifecycle policy.
   */
  public description?: string;

  /**
   * The name of the lifecycle policy.
   */
  public name: string;

  /**
   * The JSON policy document without any whitespaces.
   */
  public policy: string;

  /**
   * The type of lifecycle policy.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLifecyclePolicyProps) {
    super(scope, id, {
      "type": CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "type", this);

    this.description = props.description;
    this.name = props.name;
    this.policy = props.policy;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "policy": this.policy,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLifecyclePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLifecyclePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html
 */
export interface CfnLifecyclePolicyProps {
  /**
   * The description of the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html#cfn-opensearchserverless-lifecyclepolicy-description
   */
  readonly description?: string;

  /**
   * The name of the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html#cfn-opensearchserverless-lifecyclepolicy-name
   */
  readonly name: string;

  /**
   * The JSON policy document without any whitespaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html#cfn-opensearchserverless-lifecyclepolicy-policy
   */
  readonly policy: string;

  /**
   * The type of lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-lifecyclepolicy.html#cfn-opensearchserverless-lifecyclepolicy-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnLifecyclePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnLifecyclePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnLifecyclePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.stringToCloudFormation(properties.policy),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}