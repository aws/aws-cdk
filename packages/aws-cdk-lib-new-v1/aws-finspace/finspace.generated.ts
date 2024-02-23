/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::FinSpace::Environment` resource represents an Amazon FinSpace environment.
 *
 * @cloudformationResource AWS::FinSpace::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::FinSpace::Environment";

  /**
   * Build a CfnEnvironment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the AWS account in which the FinSpace environment is created.
   *
   * @cloudformationAttribute AwsAccountId
   */
  public readonly attrAwsAccountId: string;

  /**
   * The AWS account ID of the dedicated service account associated with your FinSpace environment.
   *
   * @cloudformationAttribute DedicatedServiceAccountId
   */
  public readonly attrDedicatedServiceAccountId: string;

  /**
   * The Amazon Resource Name (ARN) of your FinSpace environment.
   *
   * @cloudformationAttribute EnvironmentArn
   */
  public readonly attrEnvironmentArn: string;

  /**
   * The identifier of the FinSpace environment.
   *
   * @cloudformationAttribute EnvironmentId
   */
  public readonly attrEnvironmentId: string;

  /**
   * The sign-in url for the web application of your FinSpace environment.
   *
   * @cloudformationAttribute EnvironmentUrl
   */
  public readonly attrEnvironmentUrl: string;

  /**
   * The url of the integrated FinSpace notebook environment in your web application.
   *
   * @cloudformationAttribute SageMakerStudioDomainUrl
   */
  public readonly attrSageMakerStudioDomainUrl: string;

  /**
   * The current status of creation of the FinSpace environment.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * ARNs of FinSpace Data Bundles to install.
   *
   * @deprecated this property has been deprecated
   */
  public dataBundles?: Array<string>;

  /**
   * The description of the FinSpace environment.
   */
  public description?: string;

  /**
   * The authentication mode for the environment.
   */
  public federationMode?: string;

  /**
   * Configuration information when authentication mode is FEDERATED.
   */
  public federationParameters?: CfnEnvironment.FederationParametersProperty | cdk.IResolvable;

  /**
   * The KMS key id used to encrypt in the FinSpace environment.
   */
  public kmsKeyId?: string;

  /**
   * The name of the FinSpace environment.
   */
  public name: string;

  /**
   * Configuration information for the superuser.
   */
  public superuserParameters?: cdk.IResolvable | CfnEnvironment.SuperuserParametersProperty;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
    super(scope, id, {
      "type": CfnEnvironment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrAwsAccountId = cdk.Token.asString(this.getAtt("AwsAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrDedicatedServiceAccountId = cdk.Token.asString(this.getAtt("DedicatedServiceAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrEnvironmentArn = cdk.Token.asString(this.getAtt("EnvironmentArn", cdk.ResolutionTypeHint.STRING));
    this.attrEnvironmentId = cdk.Token.asString(this.getAtt("EnvironmentId", cdk.ResolutionTypeHint.STRING));
    this.attrEnvironmentUrl = cdk.Token.asString(this.getAtt("EnvironmentUrl", cdk.ResolutionTypeHint.STRING));
    this.attrSageMakerStudioDomainUrl = cdk.Token.asString(this.getAtt("SageMakerStudioDomainUrl", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.dataBundles = props.dataBundles;
    this.description = props.description;
    this.federationMode = props.federationMode;
    this.federationParameters = props.federationParameters;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.superuserParameters = props.superuserParameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FinSpace::Environment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataBundles": this.dataBundles,
      "description": this.description,
      "federationMode": this.federationMode,
      "federationParameters": this.federationParameters,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "superuserParameters": this.superuserParameters,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentPropsToCloudFormation(props);
  }
}

export namespace CfnEnvironment {
  /**
   * Configuration information when authentication mode is FEDERATED.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html
   */
  export interface FederationParametersProperty {
    /**
     * The redirect or sign-in URL that should be entered into the SAML 2.0 compliant identity provider configuration (IdP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-applicationcallbackurl
     */
    readonly applicationCallBackUrl?: string;

    /**
     * SAML attribute name and value.
     *
     * The name must always be `Email` and the value should be set to the attribute definition in which user email is set. For example, name would be `Email` and value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` . Please check your SAML 2.0 compliant identity provider (IdP) documentation for details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-attributemap
     */
    readonly attributeMap?: Array<CfnEnvironment.AttributeMapItemsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Name of the identity provider (IdP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationprovidername
     */
    readonly federationProviderName?: string;

    /**
     * The Uniform Resource Name (URN).
     *
     * Also referred as Service Provider URN or Audience URI or Service Provider Entity ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationurn
     */
    readonly federationUrn?: string;

    /**
     * SAML 2.0 Metadata document from identity provider (IdP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadatadocument
     */
    readonly samlMetadataDocument?: string;

    /**
     * Provide the metadata URL from your SAML 2.0 compliant identity provider (IdP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadataurl
     */
    readonly samlMetadataUrl?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-attributemapitems.html
   */
  export interface AttributeMapItemsProperty {
    /**
     * The key name of the tag.
     *
     * You can specify a value that is 1 to 128 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _, ., /, =, +, and -.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-attributemapitems.html#cfn-finspace-environment-attributemapitems-key
     */
    readonly key?: string;

    /**
     * The value for the tag.
     *
     * You can specify a value that is 0 to 256 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _, ., /, =, +, and -.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-attributemapitems.html#cfn-finspace-environment-attributemapitems-value
     */
    readonly value?: string;
  }

  /**
   * Configuration information for the superuser.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html
   */
  export interface SuperuserParametersProperty {
    /**
     * The email address of the superuser.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-emailaddress
     */
    readonly emailAddress?: string;

    /**
     * The first name of the superuser.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-firstname
     */
    readonly firstName?: string;

    /**
     * The last name of the superuser.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-lastname
     */
    readonly lastName?: string;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * ARNs of FinSpace Data Bundles to install.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-databundles
   */
  readonly dataBundles?: Array<string>;

  /**
   * The description of the FinSpace environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-description
   */
  readonly description?: string;

  /**
   * The authentication mode for the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationmode
   */
  readonly federationMode?: string;

  /**
   * Configuration information when authentication mode is FEDERATED.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationparameters
   */
  readonly federationParameters?: CfnEnvironment.FederationParametersProperty | cdk.IResolvable;

  /**
   * The KMS key id used to encrypt in the FinSpace environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the FinSpace environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-name
   */
  readonly name: string;

  /**
   * Configuration information for the superuser.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-superuserparameters
   */
  readonly superuserParameters?: cdk.IResolvable | CfnEnvironment.SuperuserParametersProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AttributeMapItemsProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeMapItemsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentAttributeMapItemsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AttributeMapItemsProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentAttributeMapItemsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentAttributeMapItemsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentAttributeMapItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.AttributeMapItemsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.AttributeMapItemsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FederationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `FederationParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentFederationParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationCallBackUrl", cdk.validateString)(properties.applicationCallBackUrl));
  errors.collect(cdk.propertyValidator("attributeMap", cdk.listValidator(CfnEnvironmentAttributeMapItemsPropertyValidator))(properties.attributeMap));
  errors.collect(cdk.propertyValidator("federationProviderName", cdk.validateString)(properties.federationProviderName));
  errors.collect(cdk.propertyValidator("federationUrn", cdk.validateString)(properties.federationUrn));
  errors.collect(cdk.propertyValidator("samlMetadataDocument", cdk.validateString)(properties.samlMetadataDocument));
  errors.collect(cdk.propertyValidator("samlMetadataUrl", cdk.validateString)(properties.samlMetadataUrl));
  return errors.wrap("supplied properties not correct for \"FederationParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentFederationParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentFederationParametersPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationCallBackURL": cdk.stringToCloudFormation(properties.applicationCallBackUrl),
    "AttributeMap": cdk.listMapper(convertCfnEnvironmentAttributeMapItemsPropertyToCloudFormation)(properties.attributeMap),
    "FederationProviderName": cdk.stringToCloudFormation(properties.federationProviderName),
    "FederationURN": cdk.stringToCloudFormation(properties.federationUrn),
    "SamlMetadataDocument": cdk.stringToCloudFormation(properties.samlMetadataDocument),
    "SamlMetadataURL": cdk.stringToCloudFormation(properties.samlMetadataUrl)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentFederationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.FederationParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.FederationParametersProperty>();
  ret.addPropertyResult("applicationCallBackUrl", "ApplicationCallBackURL", (properties.ApplicationCallBackURL != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationCallBackURL) : undefined));
  ret.addPropertyResult("attributeMap", "AttributeMap", (properties.AttributeMap != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentAttributeMapItemsPropertyFromCloudFormation)(properties.AttributeMap) : undefined));
  ret.addPropertyResult("federationProviderName", "FederationProviderName", (properties.FederationProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.FederationProviderName) : undefined));
  ret.addPropertyResult("federationUrn", "FederationURN", (properties.FederationURN != null ? cfn_parse.FromCloudFormation.getString(properties.FederationURN) : undefined));
  ret.addPropertyResult("samlMetadataDocument", "SamlMetadataDocument", (properties.SamlMetadataDocument != null ? cfn_parse.FromCloudFormation.getString(properties.SamlMetadataDocument) : undefined));
  ret.addPropertyResult("samlMetadataUrl", "SamlMetadataURL", (properties.SamlMetadataURL != null ? cfn_parse.FromCloudFormation.getString(properties.SamlMetadataURL) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SuperuserParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SuperuserParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentSuperuserParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emailAddress", cdk.validateString)(properties.emailAddress));
  errors.collect(cdk.propertyValidator("firstName", cdk.validateString)(properties.firstName));
  errors.collect(cdk.propertyValidator("lastName", cdk.validateString)(properties.lastName));
  return errors.wrap("supplied properties not correct for \"SuperuserParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentSuperuserParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentSuperuserParametersPropertyValidator(properties).assertSuccess();
  return {
    "EmailAddress": cdk.stringToCloudFormation(properties.emailAddress),
    "FirstName": cdk.stringToCloudFormation(properties.firstName),
    "LastName": cdk.stringToCloudFormation(properties.lastName)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentSuperuserParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.SuperuserParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.SuperuserParametersProperty>();
  ret.addPropertyResult("emailAddress", "EmailAddress", (properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.EmailAddress) : undefined));
  ret.addPropertyResult("firstName", "FirstName", (properties.FirstName != null ? cfn_parse.FromCloudFormation.getString(properties.FirstName) : undefined));
  ret.addPropertyResult("lastName", "LastName", (properties.LastName != null ? cfn_parse.FromCloudFormation.getString(properties.LastName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataBundles", cdk.listValidator(cdk.validateString))(properties.dataBundles));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("federationMode", cdk.validateString)(properties.federationMode));
  errors.collect(cdk.propertyValidator("federationParameters", CfnEnvironmentFederationParametersPropertyValidator)(properties.federationParameters));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("superuserParameters", CfnEnvironmentSuperuserParametersPropertyValidator)(properties.superuserParameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "DataBundles": cdk.listMapper(cdk.stringToCloudFormation)(properties.dataBundles),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FederationMode": cdk.stringToCloudFormation(properties.federationMode),
    "FederationParameters": convertCfnEnvironmentFederationParametersPropertyToCloudFormation(properties.federationParameters),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SuperuserParameters": convertCfnEnvironmentSuperuserParametersPropertyToCloudFormation(properties.superuserParameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
  ret.addPropertyResult("dataBundles", "DataBundles", (properties.DataBundles != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DataBundles) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("federationMode", "FederationMode", (properties.FederationMode != null ? cfn_parse.FromCloudFormation.getString(properties.FederationMode) : undefined));
  ret.addPropertyResult("federationParameters", "FederationParameters", (properties.FederationParameters != null ? CfnEnvironmentFederationParametersPropertyFromCloudFormation(properties.FederationParameters) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("superuserParameters", "SuperuserParameters", (properties.SuperuserParameters != null ? CfnEnvironmentSuperuserParametersPropertyFromCloudFormation(properties.SuperuserParameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}