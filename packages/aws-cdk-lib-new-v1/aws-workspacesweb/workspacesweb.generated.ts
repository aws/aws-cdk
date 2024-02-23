/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * This resource specifies browser settings that can be associated with a web portal.
 *
 * Once associated with a web portal, browser settings control how the browser will behave once a user starts a streaming session for the web portal.
 *
 * @cloudformationResource AWS::WorkSpacesWeb::BrowserSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html
 */
export class CfnBrowserSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::BrowserSettings";

  /**
   * Build a CfnBrowserSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBrowserSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBrowserSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBrowserSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that the browser settings resource is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The ARN of the browser settings.
   *
   * @cloudformationAttribute BrowserSettingsArn
   */
  public readonly attrBrowserSettingsArn: string;

  /**
   * Additional encryption context of the browser settings.
   */
  public additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * A JSON string containing Chrome Enterprise policies that will be applied to all streaming sessions.
   */
  public browserPolicy?: string;

  /**
   * The custom managed key of the browser settings.
   */
  public customerManagedKey?: string;

  /**
   * The tags to add to the browser settings resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBrowserSettingsProps = {}) {
    super(scope, id, {
      "type": CfnBrowserSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrBrowserSettingsArn = cdk.Token.asString(this.getAtt("BrowserSettingsArn", cdk.ResolutionTypeHint.STRING));
    this.additionalEncryptionContext = props.additionalEncryptionContext;
    this.browserPolicy = props.browserPolicy;
    this.customerManagedKey = props.customerManagedKey;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalEncryptionContext": this.additionalEncryptionContext,
      "browserPolicy": this.browserPolicy,
      "customerManagedKey": this.customerManagedKey,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBrowserSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBrowserSettingsPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBrowserSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html
 */
export interface CfnBrowserSettingsProps {
  /**
   * Additional encryption context of the browser settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html#cfn-workspacesweb-browsersettings-additionalencryptioncontext
   */
  readonly additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * A JSON string containing Chrome Enterprise policies that will be applied to all streaming sessions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html#cfn-workspacesweb-browsersettings-browserpolicy
   */
  readonly browserPolicy?: string;

  /**
   * The custom managed key of the browser settings.
   *
   * *Pattern* : `^arn:[\w+=\/,.@-]+:kms:[a-zA-Z0-9\-]*:[a-zA-Z0-9]{1,12}:key\/[a-zA-Z0-9-]+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html#cfn-workspacesweb-browsersettings-customermanagedkey
   */
  readonly customerManagedKey?: string;

  /**
   * The tags to add to the browser settings resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-browsersettings.html#cfn-workspacesweb-browsersettings-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnBrowserSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnBrowserSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBrowserSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalEncryptionContext", cdk.hashValidator(cdk.validateString))(properties.additionalEncryptionContext));
  errors.collect(cdk.propertyValidator("browserPolicy", cdk.validateString)(properties.browserPolicy));
  errors.collect(cdk.propertyValidator("customerManagedKey", cdk.validateString)(properties.customerManagedKey));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBrowserSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnBrowserSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBrowserSettingsPropsValidator(properties).assertSuccess();
  return {
    "AdditionalEncryptionContext": cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalEncryptionContext),
    "BrowserPolicy": cdk.stringToCloudFormation(properties.browserPolicy),
    "CustomerManagedKey": cdk.stringToCloudFormation(properties.customerManagedKey),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBrowserSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBrowserSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBrowserSettingsProps>();
  ret.addPropertyResult("additionalEncryptionContext", "AdditionalEncryptionContext", (properties.AdditionalEncryptionContext != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalEncryptionContext) : undefined));
  ret.addPropertyResult("browserPolicy", "BrowserPolicy", (properties.BrowserPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.BrowserPolicy) : undefined));
  ret.addPropertyResult("customerManagedKey", "CustomerManagedKey", (properties.CustomerManagedKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerManagedKey) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies an identity provider that is then associated with a web portal.
 *
 * This resource is not required if your portal's `AuthenticationType` is IAM Identity Center.
 *
 * @cloudformationResource AWS::WorkSpacesWeb::IdentityProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html
 */
export class CfnIdentityProvider extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::IdentityProvider";

  /**
   * Build a CfnIdentityProvider from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityProvider {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentityProviderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentityProvider(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the identity provider.
   *
   * @cloudformationAttribute IdentityProviderArn
   */
  public readonly attrIdentityProviderArn: string;

  /**
   * The identity provider details. The following list describes the provider detail keys for each identity provider type.
   */
  public identityProviderDetails: cdk.IResolvable | Record<string, string>;

  /**
   * The identity provider name.
   */
  public identityProviderName: string;

  /**
   * The identity provider type.
   */
  public identityProviderType: string;

  /**
   * The ARN of the identity provider.
   */
  public portalArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityProviderProps) {
    super(scope, id, {
      "type": CfnIdentityProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "identityProviderDetails", this);
    cdk.requireProperty(props, "identityProviderName", this);
    cdk.requireProperty(props, "identityProviderType", this);

    this.attrIdentityProviderArn = cdk.Token.asString(this.getAtt("IdentityProviderArn", cdk.ResolutionTypeHint.STRING));
    this.identityProviderDetails = props.identityProviderDetails;
    this.identityProviderName = props.identityProviderName;
    this.identityProviderType = props.identityProviderType;
    this.portalArn = props.portalArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identityProviderDetails": this.identityProviderDetails,
      "identityProviderName": this.identityProviderName,
      "identityProviderType": this.identityProviderType,
      "portalArn": this.portalArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityProviderPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIdentityProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html
 */
export interface CfnIdentityProviderProps {
  /**
   * The identity provider details. The following list describes the provider detail keys for each identity provider type.
   *
   * - For Google and Login with Amazon:
   *
   * - `client_id`
   * - `client_secret`
   * - `authorize_scopes`
   * - For Facebook:
   *
   * - `client_id`
   * - `client_secret`
   * - `authorize_scopes`
   * - `api_version`
   * - For Sign in with Apple:
   *
   * - `client_id`
   * - `team_id`
   * - `key_id`
   * - `private_key`
   * - `authorize_scopes`
   * - For OIDC providers:
   *
   * - `client_id`
   * - `client_secret`
   * - `attributes_request_method`
   * - `oidc_issuer`
   * - `authorize_scopes`
   * - `authorize_url` *if not available from discovery URL specified by oidc_issuer key*
   * - `token_url` *if not available from discovery URL specified by oidc_issuer key*
   * - `attributes_url` *if not available from discovery URL specified by oidc_issuer key*
   * - `jwks_uri` *if not available from discovery URL specified by oidc_issuer key*
   * - For SAML providers:
   *
   * - `MetadataFile` OR `MetadataURL`
   * - `IDPSignout` *optional*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html#cfn-workspacesweb-identityprovider-identityproviderdetails
   */
  readonly identityProviderDetails: cdk.IResolvable | Record<string, string>;

  /**
   * The identity provider name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html#cfn-workspacesweb-identityprovider-identityprovidername
   */
  readonly identityProviderName: string;

  /**
   * The identity provider type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html#cfn-workspacesweb-identityprovider-identityprovidertype
   */
  readonly identityProviderType: string;

  /**
   * The ARN of the identity provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-identityprovider.html#cfn-workspacesweb-identityprovider-portalarn
   */
  readonly portalArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityProviderDetails", cdk.requiredValidator)(properties.identityProviderDetails));
  errors.collect(cdk.propertyValidator("identityProviderDetails", cdk.hashValidator(cdk.validateString))(properties.identityProviderDetails));
  errors.collect(cdk.propertyValidator("identityProviderName", cdk.requiredValidator)(properties.identityProviderName));
  errors.collect(cdk.propertyValidator("identityProviderName", cdk.validateString)(properties.identityProviderName));
  errors.collect(cdk.propertyValidator("identityProviderType", cdk.requiredValidator)(properties.identityProviderType));
  errors.collect(cdk.propertyValidator("identityProviderType", cdk.validateString)(properties.identityProviderType));
  errors.collect(cdk.propertyValidator("portalArn", cdk.validateString)(properties.portalArn));
  return errors.wrap("supplied properties not correct for \"CfnIdentityProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityProviderPropsValidator(properties).assertSuccess();
  return {
    "IdentityProviderDetails": cdk.hashMapper(cdk.stringToCloudFormation)(properties.identityProviderDetails),
    "IdentityProviderName": cdk.stringToCloudFormation(properties.identityProviderName),
    "IdentityProviderType": cdk.stringToCloudFormation(properties.identityProviderType),
    "PortalArn": cdk.stringToCloudFormation(properties.portalArn)
  };
}

// @ts-ignore TS6133
function CfnIdentityProviderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProviderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderProps>();
  ret.addPropertyResult("identityProviderDetails", "IdentityProviderDetails", (properties.IdentityProviderDetails != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.IdentityProviderDetails) : undefined));
  ret.addPropertyResult("identityProviderName", "IdentityProviderName", (properties.IdentityProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderName) : undefined));
  ret.addPropertyResult("identityProviderType", "IdentityProviderType", (properties.IdentityProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderType) : undefined));
  ret.addPropertyResult("portalArn", "PortalArn", (properties.PortalArn != null ? cfn_parse.FromCloudFormation.getString(properties.PortalArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies IP access settings that can be associated with a web portal.
 *
 * For more information, see [Set up IP access controls (optional)](https://docs.aws.amazon.com/workspaces-web/latest/adminguide/ip-access-controls.html) .
 *
 * @cloudformationResource AWS::WorkSpacesWeb::IpAccessSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html
 */
export class CfnIpAccessSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::IpAccessSettings";

  /**
   * Build a CfnIpAccessSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIpAccessSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIpAccessSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIpAccessSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that this IP access settings resource is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The creation date timestamp of the IP access settings.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The ARN of the IP access settings resource.
   *
   * @cloudformationAttribute IpAccessSettingsArn
   */
  public readonly attrIpAccessSettingsArn: string;

  /**
   * Additional encryption context of the IP access settings.
   */
  public additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The custom managed key of the IP access settings.
   */
  public customerManagedKey?: string;

  /**
   * The description of the IP access settings.
   */
  public description?: string;

  /**
   * The display name of the IP access settings.
   */
  public displayName?: string;

  /**
   * The IP rules of the IP access settings.
   */
  public ipRules: Array<CfnIpAccessSettings.IpRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The tags to add to the browser settings resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIpAccessSettingsProps) {
    super(scope, id, {
      "type": CfnIpAccessSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ipRules", this);

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrIpAccessSettingsArn = cdk.Token.asString(this.getAtt("IpAccessSettingsArn", cdk.ResolutionTypeHint.STRING));
    this.additionalEncryptionContext = props.additionalEncryptionContext;
    this.customerManagedKey = props.customerManagedKey;
    this.description = props.description;
    this.displayName = props.displayName;
    this.ipRules = props.ipRules;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalEncryptionContext": this.additionalEncryptionContext,
      "customerManagedKey": this.customerManagedKey,
      "description": this.description,
      "displayName": this.displayName,
      "ipRules": this.ipRules,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIpAccessSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIpAccessSettingsPropsToCloudFormation(props);
  }
}

export namespace CfnIpAccessSettings {
  /**
   * The IP rules of the IP access settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-ipaccesssettings-iprule.html
   */
  export interface IpRuleProperty {
    /**
     * The description of the IP rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-ipaccesssettings-iprule.html#cfn-workspacesweb-ipaccesssettings-iprule-description
     */
    readonly description?: string;

    /**
     * The IP range of the IP rule.
     *
     * This can either be a single IP address or a range using CIDR notation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-ipaccesssettings-iprule.html#cfn-workspacesweb-ipaccesssettings-iprule-iprange
     */
    readonly ipRange: string;
  }
}

/**
 * Properties for defining a `CfnIpAccessSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html
 */
export interface CfnIpAccessSettingsProps {
  /**
   * Additional encryption context of the IP access settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-additionalencryptioncontext
   */
  readonly additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The custom managed key of the IP access settings.
   *
   * *Pattern* : `^arn:[\w+=\/,.@-]+:kms:[a-zA-Z0-9\-]*:[a-zA-Z0-9]{1,12}:key\/[a-zA-Z0-9-]+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-customermanagedkey
   */
  readonly customerManagedKey?: string;

  /**
   * The description of the IP access settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-description
   */
  readonly description?: string;

  /**
   * The display name of the IP access settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-displayname
   */
  readonly displayName?: string;

  /**
   * The IP rules of the IP access settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-iprules
   */
  readonly ipRules: Array<CfnIpAccessSettings.IpRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The tags to add to the browser settings resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-ipaccesssettings.html#cfn-workspacesweb-ipaccesssettings-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `IpRuleProperty`
 *
 * @param properties - the TypeScript properties of a `IpRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIpAccessSettingsIpRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ipRange", cdk.requiredValidator)(properties.ipRange));
  errors.collect(cdk.propertyValidator("ipRange", cdk.validateString)(properties.ipRange));
  return errors.wrap("supplied properties not correct for \"IpRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnIpAccessSettingsIpRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIpAccessSettingsIpRulePropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "IpRange": cdk.stringToCloudFormation(properties.ipRange)
  };
}

// @ts-ignore TS6133
function CfnIpAccessSettingsIpRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIpAccessSettings.IpRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIpAccessSettings.IpRuleProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ipRange", "IpRange", (properties.IpRange != null ? cfn_parse.FromCloudFormation.getString(properties.IpRange) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIpAccessSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnIpAccessSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIpAccessSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalEncryptionContext", cdk.hashValidator(cdk.validateString))(properties.additionalEncryptionContext));
  errors.collect(cdk.propertyValidator("customerManagedKey", cdk.validateString)(properties.customerManagedKey));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("ipRules", cdk.requiredValidator)(properties.ipRules));
  errors.collect(cdk.propertyValidator("ipRules", cdk.listValidator(CfnIpAccessSettingsIpRulePropertyValidator))(properties.ipRules));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnIpAccessSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnIpAccessSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIpAccessSettingsPropsValidator(properties).assertSuccess();
  return {
    "AdditionalEncryptionContext": cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalEncryptionContext),
    "CustomerManagedKey": cdk.stringToCloudFormation(properties.customerManagedKey),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "IpRules": cdk.listMapper(convertCfnIpAccessSettingsIpRulePropertyToCloudFormation)(properties.ipRules),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnIpAccessSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIpAccessSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIpAccessSettingsProps>();
  ret.addPropertyResult("additionalEncryptionContext", "AdditionalEncryptionContext", (properties.AdditionalEncryptionContext != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalEncryptionContext) : undefined));
  ret.addPropertyResult("customerManagedKey", "CustomerManagedKey", (properties.CustomerManagedKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerManagedKey) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("ipRules", "IpRules", (properties.IpRules != null ? cfn_parse.FromCloudFormation.getArray(CfnIpAccessSettingsIpRulePropertyFromCloudFormation)(properties.IpRules) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies network settings that can be associated with a web portal.
 *
 * Once associated with a web portal, network settings define how streaming instances will connect with your specified VPC.
 *
 * The VPC must have default tenancy. VPCs with dedicated tenancy are not supported.
 *
 * For availability consideration, you must have at least two subnets created in two different Availability Zones. WorkSpaces Web is available in a subset of the Availability Zones for each supported Region. For more information, see [Supported Availability Zones](https://docs.aws.amazon.com/workspaces-web/latest/adminguide/availability-zones.html) .
 *
 * @cloudformationResource AWS::WorkSpacesWeb::NetworkSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html
 */
export class CfnNetworkSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::NetworkSettings";

  /**
   * Build a CfnNetworkSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNetworkSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNetworkSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNetworkSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that this network settings is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The ARN of the network settings.
   *
   * @cloudformationAttribute NetworkSettingsArn
   */
  public readonly attrNetworkSettingsArn: string;

  /**
   * One or more security groups used to control access from streaming instances to your VPC.
   */
  public securityGroupIds: Array<string>;

  /**
   * The subnets in which network interfaces are created to connect streaming instances to your VPC.
   */
  public subnetIds: Array<string>;

  /**
   * The tags to add to the network settings resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The VPC that streaming instances will connect to.
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNetworkSettingsProps) {
    super(scope, id, {
      "type": CfnNetworkSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "securityGroupIds", this);
    cdk.requireProperty(props, "subnetIds", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrNetworkSettingsArn = cdk.Token.asString(this.getAtt("NetworkSettingsArn", cdk.ResolutionTypeHint.STRING));
    this.securityGroupIds = props.securityGroupIds;
    this.subnetIds = props.subnetIds;
    this.tags = props.tags;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "securityGroupIds": this.securityGroupIds,
      "subnetIds": this.subnetIds,
      "tags": this.tags,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNetworkSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNetworkSettingsPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnNetworkSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html
 */
export interface CfnNetworkSettingsProps {
  /**
   * One or more security groups used to control access from streaming instances to your VPC.
   *
   * *Pattern* : `^[\w+\-]+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html#cfn-workspacesweb-networksettings-securitygroupids
   */
  readonly securityGroupIds: Array<string>;

  /**
   * The subnets in which network interfaces are created to connect streaming instances to your VPC.
   *
   * At least two of these subnets must be in different availability zones.
   *
   * *Pattern* : `^subnet-([0-9a-f]{8}|[0-9a-f]{17})$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html#cfn-workspacesweb-networksettings-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * The tags to add to the network settings resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html#cfn-workspacesweb-networksettings-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The VPC that streaming instances will connect to.
   *
   * *Pattern* : `^vpc-[0-9a-z]*$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-networksettings.html#cfn-workspacesweb-networksettings-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `CfnNetworkSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnNetworkSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNetworkSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnNetworkSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnNetworkSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNetworkSettingsPropsValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnNetworkSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNetworkSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkSettingsProps>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies a web portal, which users use to start browsing sessions.
 *
 * A `Standard` web portal can't start browsing sessions unless you have at defined and associated an `IdentityProvider` and `NetworkSettings` resource. An `IAM Identity Center` web portal does not require an `IdentityProvider` resource.
 *
 * For more information about web portals, see [What is Amazon WorkSpaces Web?](https://docs.aws.amazon.com/workspaces-web/latest/adminguide/what-is-workspaces-web.html.html) .
 *
 * @cloudformationResource AWS::WorkSpacesWeb::Portal
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html
 */
export class CfnPortal extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::Portal";

  /**
   * Build a CfnPortal from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortal {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortalPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortal(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The browser that users see when using a streaming session.
   *
   * @cloudformationAttribute BrowserType
   */
  public readonly attrBrowserType: string;

  /**
   * The creation date of the web portal.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The ARN of the web portal.
   *
   * @cloudformationAttribute PortalArn
   */
  public readonly attrPortalArn: string;

  /**
   * The endpoint URL of the web portal that users access in order to start streaming sessions.
   *
   * @cloudformationAttribute PortalEndpoint
   */
  public readonly attrPortalEndpoint: string;

  /**
   * The status of the web portal.
   *
   * @cloudformationAttribute PortalStatus
   */
  public readonly attrPortalStatus: string;

  /**
   * The renderer that is used in streaming sessions.
   *
   * @cloudformationAttribute RendererType
   */
  public readonly attrRendererType: string;

  /**
   * The SAML metadata of the service provider.
   *
   * @cloudformationAttribute ServiceProviderSamlMetadata
   */
  public readonly attrServiceProviderSamlMetadata: string;

  /**
   * A message that explains why the web portal is in its current status.
   *
   * @cloudformationAttribute StatusReason
   */
  public readonly attrStatusReason: string;

  /**
   * The additional encryption context of the portal.
   */
  public additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The type of authentication integration points used when signing into the web portal. Defaults to `Standard` .
   */
  public authenticationType?: string;

  /**
   * The ARN of the browser settings that is associated with this web portal.
   */
  public browserSettingsArn?: string;

  /**
   * The customer managed key of the web portal.
   */
  public customerManagedKey?: string;

  /**
   * The name of the web portal.
   */
  public displayName?: string;

  /**
   * The ARN of the IP access settings that is associated with the web portal.
   */
  public ipAccessSettingsArn?: string;

  /**
   * The ARN of the network settings that is associated with the web portal.
   */
  public networkSettingsArn?: string;

  /**
   * The tags to add to the web portal.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the trust store that is associated with the web portal.
   */
  public trustStoreArn?: string;

  /**
   * The ARN of the user access logging settings that is associated with the web portal.
   */
  public userAccessLoggingSettingsArn?: string;

  /**
   * The ARN of the user settings that is associated with the web portal.
   */
  public userSettingsArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortalProps = {}) {
    super(scope, id, {
      "type": CfnPortal.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrBrowserType = cdk.Token.asString(this.getAtt("BrowserType", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrPortalArn = cdk.Token.asString(this.getAtt("PortalArn", cdk.ResolutionTypeHint.STRING));
    this.attrPortalEndpoint = cdk.Token.asString(this.getAtt("PortalEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrPortalStatus = cdk.Token.asString(this.getAtt("PortalStatus", cdk.ResolutionTypeHint.STRING));
    this.attrRendererType = cdk.Token.asString(this.getAtt("RendererType", cdk.ResolutionTypeHint.STRING));
    this.attrServiceProviderSamlMetadata = cdk.Token.asString(this.getAtt("ServiceProviderSamlMetadata", cdk.ResolutionTypeHint.STRING));
    this.attrStatusReason = cdk.Token.asString(this.getAtt("StatusReason", cdk.ResolutionTypeHint.STRING));
    this.additionalEncryptionContext = props.additionalEncryptionContext;
    this.authenticationType = props.authenticationType;
    this.browserSettingsArn = props.browserSettingsArn;
    this.customerManagedKey = props.customerManagedKey;
    this.displayName = props.displayName;
    this.ipAccessSettingsArn = props.ipAccessSettingsArn;
    this.networkSettingsArn = props.networkSettingsArn;
    this.tags = props.tags;
    this.trustStoreArn = props.trustStoreArn;
    this.userAccessLoggingSettingsArn = props.userAccessLoggingSettingsArn;
    this.userSettingsArn = props.userSettingsArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalEncryptionContext": this.additionalEncryptionContext,
      "authenticationType": this.authenticationType,
      "browserSettingsArn": this.browserSettingsArn,
      "customerManagedKey": this.customerManagedKey,
      "displayName": this.displayName,
      "ipAccessSettingsArn": this.ipAccessSettingsArn,
      "networkSettingsArn": this.networkSettingsArn,
      "tags": this.tags,
      "trustStoreArn": this.trustStoreArn,
      "userAccessLoggingSettingsArn": this.userAccessLoggingSettingsArn,
      "userSettingsArn": this.userSettingsArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortal.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortalPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPortal`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html
 */
export interface CfnPortalProps {
  /**
   * The additional encryption context of the portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-additionalencryptioncontext
   */
  readonly additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The type of authentication integration points used when signing into the web portal. Defaults to `Standard` .
   *
   * `Standard` web portals are authenticated directly through your identity provider (IdP). User and group access to your web portal is controlled through your IdP. You need to include an IdP resource in your template to integrate your IdP with your web portal. Completing the configuration for your IdP requires exchanging WorkSpaces Web’s SP metadata with your IdP’s IdP metadata. If your IdP requires the SP metadata first before returning the IdP metadata, you should follow these steps:
   *
   * 1. Create and deploy a CloudFormation template with a `Standard` portal with no `IdentityProvider` resource.
   *
   * 2. Retrieve the SP metadata using `Fn:GetAtt` , the WorkSpaces Web console, or by the calling the `GetPortalServiceProviderMetadata` API.
   *
   * 3. Submit the data to your IdP.
   *
   * 4. Add an `IdentityProvider` resource to your CloudFormation template.
   *
   * `IAM Identity Center` web portals are authenticated through AWS IAM Identity Center . They provide additional features, such as IdP-initiated authentication. Identity sources (including external identity provider integration) and other identity provider information must be configured in IAM Identity Center . User and group assignment must be done through the WorkSpaces Web console. These cannot be configured in CloudFormation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-authenticationtype
   */
  readonly authenticationType?: string;

  /**
   * The ARN of the browser settings that is associated with this web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-browsersettingsarn
   */
  readonly browserSettingsArn?: string;

  /**
   * The customer managed key of the web portal.
   *
   * *Pattern* : `^arn:[\w+=\/,.@-]+:kms:[a-zA-Z0-9\-]*:[a-zA-Z0-9]{1,12}:key\/[a-zA-Z0-9-]+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-customermanagedkey
   */
  readonly customerManagedKey?: string;

  /**
   * The name of the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-displayname
   */
  readonly displayName?: string;

  /**
   * The ARN of the IP access settings that is associated with the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-ipaccesssettingsarn
   */
  readonly ipAccessSettingsArn?: string;

  /**
   * The ARN of the network settings that is associated with the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-networksettingsarn
   */
  readonly networkSettingsArn?: string;

  /**
   * The tags to add to the web portal.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the trust store that is associated with the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-truststorearn
   */
  readonly trustStoreArn?: string;

  /**
   * The ARN of the user access logging settings that is associated with the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-useraccessloggingsettingsarn
   */
  readonly userAccessLoggingSettingsArn?: string;

  /**
   * The ARN of the user settings that is associated with the web portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-portal.html#cfn-workspacesweb-portal-usersettingsarn
   */
  readonly userSettingsArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPortalProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortalProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortalPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalEncryptionContext", cdk.hashValidator(cdk.validateString))(properties.additionalEncryptionContext));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("browserSettingsArn", cdk.validateString)(properties.browserSettingsArn));
  errors.collect(cdk.propertyValidator("customerManagedKey", cdk.validateString)(properties.customerManagedKey));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("ipAccessSettingsArn", cdk.validateString)(properties.ipAccessSettingsArn));
  errors.collect(cdk.propertyValidator("networkSettingsArn", cdk.validateString)(properties.networkSettingsArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trustStoreArn", cdk.validateString)(properties.trustStoreArn));
  errors.collect(cdk.propertyValidator("userAccessLoggingSettingsArn", cdk.validateString)(properties.userAccessLoggingSettingsArn));
  errors.collect(cdk.propertyValidator("userSettingsArn", cdk.validateString)(properties.userSettingsArn));
  return errors.wrap("supplied properties not correct for \"CfnPortalProps\"");
}

// @ts-ignore TS6133
function convertCfnPortalPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortalPropsValidator(properties).assertSuccess();
  return {
    "AdditionalEncryptionContext": cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalEncryptionContext),
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "BrowserSettingsArn": cdk.stringToCloudFormation(properties.browserSettingsArn),
    "CustomerManagedKey": cdk.stringToCloudFormation(properties.customerManagedKey),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "IpAccessSettingsArn": cdk.stringToCloudFormation(properties.ipAccessSettingsArn),
    "NetworkSettingsArn": cdk.stringToCloudFormation(properties.networkSettingsArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrustStoreArn": cdk.stringToCloudFormation(properties.trustStoreArn),
    "UserAccessLoggingSettingsArn": cdk.stringToCloudFormation(properties.userAccessLoggingSettingsArn),
    "UserSettingsArn": cdk.stringToCloudFormation(properties.userSettingsArn)
  };
}

// @ts-ignore TS6133
function CfnPortalPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortalProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortalProps>();
  ret.addPropertyResult("additionalEncryptionContext", "AdditionalEncryptionContext", (properties.AdditionalEncryptionContext != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalEncryptionContext) : undefined));
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("browserSettingsArn", "BrowserSettingsArn", (properties.BrowserSettingsArn != null ? cfn_parse.FromCloudFormation.getString(properties.BrowserSettingsArn) : undefined));
  ret.addPropertyResult("customerManagedKey", "CustomerManagedKey", (properties.CustomerManagedKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerManagedKey) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("ipAccessSettingsArn", "IpAccessSettingsArn", (properties.IpAccessSettingsArn != null ? cfn_parse.FromCloudFormation.getString(properties.IpAccessSettingsArn) : undefined));
  ret.addPropertyResult("networkSettingsArn", "NetworkSettingsArn", (properties.NetworkSettingsArn != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkSettingsArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trustStoreArn", "TrustStoreArn", (properties.TrustStoreArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustStoreArn) : undefined));
  ret.addPropertyResult("userAccessLoggingSettingsArn", "UserAccessLoggingSettingsArn", (properties.UserAccessLoggingSettingsArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserAccessLoggingSettingsArn) : undefined));
  ret.addPropertyResult("userSettingsArn", "UserSettingsArn", (properties.UserSettingsArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserSettingsArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies a trust store that can be associated with a web portal.
 *
 * A trust store contains certificate authority (CA) certificates. Once associated with a web portal, the browser in a streaming session will recognize certificates that have been issued using any of the CAs in the trust store. If your organization has internal websites that use certificates issued by private CAs, you should add the private CA certificate to the trust store.
 *
 * @cloudformationResource AWS::WorkSpacesWeb::TrustStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-truststore.html
 */
export class CfnTrustStore extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::TrustStore";

  /**
   * Build a CfnTrustStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrustStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrustStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrustStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that this trust store is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The ARN of the trust store.
   *
   * @cloudformationAttribute TrustStoreArn
   */
  public readonly attrTrustStoreArn: string;

  /**
   * A list of CA certificates to be added to the trust store.
   */
  public certificateList: Array<string>;

  /**
   * The tags to add to the trust store.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrustStoreProps) {
    super(scope, id, {
      "type": CfnTrustStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificateList", this);

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrTrustStoreArn = cdk.Token.asString(this.getAtt("TrustStoreArn", cdk.ResolutionTypeHint.STRING));
    this.certificateList = props.certificateList;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateList": this.certificateList,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrustStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrustStorePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTrustStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-truststore.html
 */
export interface CfnTrustStoreProps {
  /**
   * A list of CA certificates to be added to the trust store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-truststore.html#cfn-workspacesweb-truststore-certificatelist
   */
  readonly certificateList: Array<string>;

  /**
   * The tags to add to the trust store.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-truststore.html#cfn-workspacesweb-truststore-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnTrustStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrustStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateList", cdk.requiredValidator)(properties.certificateList));
  errors.collect(cdk.propertyValidator("certificateList", cdk.listValidator(cdk.validateString))(properties.certificateList));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTrustStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnTrustStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustStorePropsValidator(properties).assertSuccess();
  return {
    "CertificateList": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateList),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTrustStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustStoreProps>();
  ret.addPropertyResult("certificateList", "CertificateList", (properties.CertificateList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateList) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies user access logging settings that can be associated with a web portal.
 *
 * In order to receive logs from WorkSpaces Web, you must have an Amazon Kinesis Data Stream that starts with "amazon-workspaces-web-*". Your Amazon Kinesis data stream must either have server-side encryption turned off, or must use AWS managed keys for server-side encryption.
 *
 * For more information about setting server-side encryption in Amazon Kinesis , see [How Do I Get Started with Server-Side Encryption?](https://docs.aws.amazon.com/streams/latest/dev/getting-started-with-sse.html) .
 *
 * For more information about setting up user access logging, see [Set up user access logging](https://docs.aws.amazon.com/workspaces-web/latest/adminguide/user-logging.html) .
 *
 * @cloudformationResource AWS::WorkSpacesWeb::UserAccessLoggingSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-useraccessloggingsettings.html
 */
export class CfnUserAccessLoggingSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::UserAccessLoggingSettings";

  /**
   * Build a CfnUserAccessLoggingSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserAccessLoggingSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserAccessLoggingSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserAccessLoggingSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that this user access logging settings is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The ARN of the user access logging settings.
   *
   * @cloudformationAttribute UserAccessLoggingSettingsArn
   */
  public readonly attrUserAccessLoggingSettingsArn: string;

  /**
   * The ARN of the Kinesis stream.
   */
  public kinesisStreamArn: string;

  /**
   * The tags to add to the user access logging settings resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserAccessLoggingSettingsProps) {
    super(scope, id, {
      "type": CfnUserAccessLoggingSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "kinesisStreamArn", this);

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrUserAccessLoggingSettingsArn = cdk.Token.asString(this.getAtt("UserAccessLoggingSettingsArn", cdk.ResolutionTypeHint.STRING));
    this.kinesisStreamArn = props.kinesisStreamArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "kinesisStreamArn": this.kinesisStreamArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserAccessLoggingSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserAccessLoggingSettingsPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserAccessLoggingSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-useraccessloggingsettings.html
 */
export interface CfnUserAccessLoggingSettingsProps {
  /**
   * The ARN of the Kinesis stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-useraccessloggingsettings.html#cfn-workspacesweb-useraccessloggingsettings-kinesisstreamarn
   */
  readonly kinesisStreamArn: string;

  /**
   * The tags to add to the user access logging settings resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-useraccessloggingsettings.html#cfn-workspacesweb-useraccessloggingsettings-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnUserAccessLoggingSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserAccessLoggingSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserAccessLoggingSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kinesisStreamArn", cdk.requiredValidator)(properties.kinesisStreamArn));
  errors.collect(cdk.propertyValidator("kinesisStreamArn", cdk.validateString)(properties.kinesisStreamArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnUserAccessLoggingSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnUserAccessLoggingSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserAccessLoggingSettingsPropsValidator(properties).assertSuccess();
  return {
    "KinesisStreamArn": cdk.stringToCloudFormation(properties.kinesisStreamArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnUserAccessLoggingSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserAccessLoggingSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserAccessLoggingSettingsProps>();
  ret.addPropertyResult("kinesisStreamArn", "KinesisStreamArn", (properties.KinesisStreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.KinesisStreamArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource specifies user settings that can be associated with a web portal.
 *
 * Once associated with a web portal, user settings control how users can transfer data between a streaming session and the their local devices.
 *
 * @cloudformationResource AWS::WorkSpacesWeb::UserSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html
 */
export class CfnUserSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesWeb::UserSettings";

  /**
   * Build a CfnUserSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of web portal ARNs that this user settings resource is associated with.
   *
   * @cloudformationAttribute AssociatedPortalArns
   */
  public readonly attrAssociatedPortalArns: Array<string>;

  /**
   * The ARN of the user settings.
   *
   * @cloudformationAttribute UserSettingsArn
   */
  public readonly attrUserSettingsArn: string;

  public additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
   */
  public cookieSynchronizationConfiguration?: CfnUserSettings.CookieSynchronizationConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether the user can copy text from the streaming session to the local device.
   */
  public copyAllowed: string;

  public customerManagedKey?: string;

  /**
   * The amount of time that a streaming session remains active after users disconnect.
   */
  public disconnectTimeoutInMinutes?: number;

  /**
   * Specifies whether the user can download files from the streaming session to the local device.
   */
  public downloadAllowed: string;

  /**
   * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
   */
  public idleDisconnectTimeoutInMinutes?: number;

  /**
   * Specifies whether the user can paste text from the local device to the streaming session.
   */
  public pasteAllowed: string;

  /**
   * Specifies whether the user can print to the local device.
   */
  public printAllowed: string;

  /**
   * The tags to add to the user settings resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * Specifies whether the user can upload files from the local device to the streaming session.
   */
  public uploadAllowed: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserSettingsProps) {
    super(scope, id, {
      "type": CfnUserSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "copyAllowed", this);
    cdk.requireProperty(props, "downloadAllowed", this);
    cdk.requireProperty(props, "pasteAllowed", this);
    cdk.requireProperty(props, "printAllowed", this);
    cdk.requireProperty(props, "uploadAllowed", this);

    this.attrAssociatedPortalArns = cdk.Token.asList(this.getAtt("AssociatedPortalArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrUserSettingsArn = cdk.Token.asString(this.getAtt("UserSettingsArn", cdk.ResolutionTypeHint.STRING));
    this.additionalEncryptionContext = props.additionalEncryptionContext;
    this.cookieSynchronizationConfiguration = props.cookieSynchronizationConfiguration;
    this.copyAllowed = props.copyAllowed;
    this.customerManagedKey = props.customerManagedKey;
    this.disconnectTimeoutInMinutes = props.disconnectTimeoutInMinutes;
    this.downloadAllowed = props.downloadAllowed;
    this.idleDisconnectTimeoutInMinutes = props.idleDisconnectTimeoutInMinutes;
    this.pasteAllowed = props.pasteAllowed;
    this.printAllowed = props.printAllowed;
    this.tags = props.tags;
    this.uploadAllowed = props.uploadAllowed;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalEncryptionContext": this.additionalEncryptionContext,
      "cookieSynchronizationConfiguration": this.cookieSynchronizationConfiguration,
      "copyAllowed": this.copyAllowed,
      "customerManagedKey": this.customerManagedKey,
      "disconnectTimeoutInMinutes": this.disconnectTimeoutInMinutes,
      "downloadAllowed": this.downloadAllowed,
      "idleDisconnectTimeoutInMinutes": this.idleDisconnectTimeoutInMinutes,
      "pasteAllowed": this.pasteAllowed,
      "printAllowed": this.printAllowed,
      "tags": this.tags,
      "uploadAllowed": this.uploadAllowed
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserSettingsPropsToCloudFormation(props);
  }
}

export namespace CfnUserSettings {
  /**
   * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiesynchronizationconfiguration.html
   */
  export interface CookieSynchronizationConfigurationProperty {
    /**
     * The list of cookie specifications that are allowed to be synchronized to the remote browser.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiesynchronizationconfiguration.html#cfn-workspacesweb-usersettings-cookiesynchronizationconfiguration-allowlist
     */
    readonly allowlist: Array<CfnUserSettings.CookieSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The list of cookie specifications that are blocked from being synchronized to the remote browser.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiesynchronizationconfiguration.html#cfn-workspacesweb-usersettings-cookiesynchronizationconfiguration-blocklist
     */
    readonly blocklist?: Array<CfnUserSettings.CookieSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies a single cookie or set of cookies in an end user's browser.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiespecification.html
   */
  export interface CookieSpecificationProperty {
    /**
     * The domain of the cookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiespecification.html#cfn-workspacesweb-usersettings-cookiespecification-domain
     */
    readonly domain: string;

    /**
     * The name of the cookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiespecification.html#cfn-workspacesweb-usersettings-cookiespecification-name
     */
    readonly name?: string;

    /**
     * The path of the cookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesweb-usersettings-cookiespecification.html#cfn-workspacesweb-usersettings-cookiespecification-path
     */
    readonly path?: string;
  }
}

/**
 * Properties for defining a `CfnUserSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html
 */
export interface CfnUserSettingsProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-additionalencryptioncontext
   */
  readonly additionalEncryptionContext?: cdk.IResolvable | Record<string, string>;

  /**
   * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-cookiesynchronizationconfiguration
   */
  readonly cookieSynchronizationConfiguration?: CfnUserSettings.CookieSynchronizationConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether the user can copy text from the streaming session to the local device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-copyallowed
   */
  readonly copyAllowed: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-customermanagedkey
   */
  readonly customerManagedKey?: string;

  /**
   * The amount of time that a streaming session remains active after users disconnect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-disconnecttimeoutinminutes
   */
  readonly disconnectTimeoutInMinutes?: number;

  /**
   * Specifies whether the user can download files from the streaming session to the local device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-downloadallowed
   */
  readonly downloadAllowed: string;

  /**
   * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-idledisconnecttimeoutinminutes
   */
  readonly idleDisconnectTimeoutInMinutes?: number;

  /**
   * Specifies whether the user can paste text from the local device to the streaming session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-pasteallowed
   */
  readonly pasteAllowed: string;

  /**
   * Specifies whether the user can print to the local device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-printallowed
   */
  readonly printAllowed: string;

  /**
   * The tags to add to the user settings resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies whether the user can upload files from the local device to the streaming session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesweb-usersettings.html#cfn-workspacesweb-usersettings-uploadallowed
   */
  readonly uploadAllowed: string;
}

/**
 * Determine whether the given properties match those of a `CookieSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CookieSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserSettingsCookieSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domain", cdk.requiredValidator)(properties.domain));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"CookieSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserSettingsCookieSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserSettingsCookieSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnUserSettingsCookieSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserSettings.CookieSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserSettings.CookieSpecificationProperty>();
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookieSynchronizationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CookieSynchronizationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserSettingsCookieSynchronizationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowlist", cdk.requiredValidator)(properties.allowlist));
  errors.collect(cdk.propertyValidator("allowlist", cdk.listValidator(CfnUserSettingsCookieSpecificationPropertyValidator))(properties.allowlist));
  errors.collect(cdk.propertyValidator("blocklist", cdk.listValidator(CfnUserSettingsCookieSpecificationPropertyValidator))(properties.blocklist));
  return errors.wrap("supplied properties not correct for \"CookieSynchronizationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserSettingsCookieSynchronizationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserSettingsCookieSynchronizationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Allowlist": cdk.listMapper(convertCfnUserSettingsCookieSpecificationPropertyToCloudFormation)(properties.allowlist),
    "Blocklist": cdk.listMapper(convertCfnUserSettingsCookieSpecificationPropertyToCloudFormation)(properties.blocklist)
  };
}

// @ts-ignore TS6133
function CfnUserSettingsCookieSynchronizationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserSettings.CookieSynchronizationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserSettings.CookieSynchronizationConfigurationProperty>();
  ret.addPropertyResult("allowlist", "Allowlist", (properties.Allowlist != null ? cfn_parse.FromCloudFormation.getArray(CfnUserSettingsCookieSpecificationPropertyFromCloudFormation)(properties.Allowlist) : undefined));
  ret.addPropertyResult("blocklist", "Blocklist", (properties.Blocklist != null ? cfn_parse.FromCloudFormation.getArray(CfnUserSettingsCookieSpecificationPropertyFromCloudFormation)(properties.Blocklist) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalEncryptionContext", cdk.hashValidator(cdk.validateString))(properties.additionalEncryptionContext));
  errors.collect(cdk.propertyValidator("cookieSynchronizationConfiguration", CfnUserSettingsCookieSynchronizationConfigurationPropertyValidator)(properties.cookieSynchronizationConfiguration));
  errors.collect(cdk.propertyValidator("copyAllowed", cdk.requiredValidator)(properties.copyAllowed));
  errors.collect(cdk.propertyValidator("copyAllowed", cdk.validateString)(properties.copyAllowed));
  errors.collect(cdk.propertyValidator("customerManagedKey", cdk.validateString)(properties.customerManagedKey));
  errors.collect(cdk.propertyValidator("disconnectTimeoutInMinutes", cdk.validateNumber)(properties.disconnectTimeoutInMinutes));
  errors.collect(cdk.propertyValidator("downloadAllowed", cdk.requiredValidator)(properties.downloadAllowed));
  errors.collect(cdk.propertyValidator("downloadAllowed", cdk.validateString)(properties.downloadAllowed));
  errors.collect(cdk.propertyValidator("idleDisconnectTimeoutInMinutes", cdk.validateNumber)(properties.idleDisconnectTimeoutInMinutes));
  errors.collect(cdk.propertyValidator("pasteAllowed", cdk.requiredValidator)(properties.pasteAllowed));
  errors.collect(cdk.propertyValidator("pasteAllowed", cdk.validateString)(properties.pasteAllowed));
  errors.collect(cdk.propertyValidator("printAllowed", cdk.requiredValidator)(properties.printAllowed));
  errors.collect(cdk.propertyValidator("printAllowed", cdk.validateString)(properties.printAllowed));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("uploadAllowed", cdk.requiredValidator)(properties.uploadAllowed));
  errors.collect(cdk.propertyValidator("uploadAllowed", cdk.validateString)(properties.uploadAllowed));
  return errors.wrap("supplied properties not correct for \"CfnUserSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnUserSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserSettingsPropsValidator(properties).assertSuccess();
  return {
    "AdditionalEncryptionContext": cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalEncryptionContext),
    "CookieSynchronizationConfiguration": convertCfnUserSettingsCookieSynchronizationConfigurationPropertyToCloudFormation(properties.cookieSynchronizationConfiguration),
    "CopyAllowed": cdk.stringToCloudFormation(properties.copyAllowed),
    "CustomerManagedKey": cdk.stringToCloudFormation(properties.customerManagedKey),
    "DisconnectTimeoutInMinutes": cdk.numberToCloudFormation(properties.disconnectTimeoutInMinutes),
    "DownloadAllowed": cdk.stringToCloudFormation(properties.downloadAllowed),
    "IdleDisconnectTimeoutInMinutes": cdk.numberToCloudFormation(properties.idleDisconnectTimeoutInMinutes),
    "PasteAllowed": cdk.stringToCloudFormation(properties.pasteAllowed),
    "PrintAllowed": cdk.stringToCloudFormation(properties.printAllowed),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UploadAllowed": cdk.stringToCloudFormation(properties.uploadAllowed)
  };
}

// @ts-ignore TS6133
function CfnUserSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserSettingsProps>();
  ret.addPropertyResult("additionalEncryptionContext", "AdditionalEncryptionContext", (properties.AdditionalEncryptionContext != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalEncryptionContext) : undefined));
  ret.addPropertyResult("cookieSynchronizationConfiguration", "CookieSynchronizationConfiguration", (properties.CookieSynchronizationConfiguration != null ? CfnUserSettingsCookieSynchronizationConfigurationPropertyFromCloudFormation(properties.CookieSynchronizationConfiguration) : undefined));
  ret.addPropertyResult("copyAllowed", "CopyAllowed", (properties.CopyAllowed != null ? cfn_parse.FromCloudFormation.getString(properties.CopyAllowed) : undefined));
  ret.addPropertyResult("customerManagedKey", "CustomerManagedKey", (properties.CustomerManagedKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerManagedKey) : undefined));
  ret.addPropertyResult("disconnectTimeoutInMinutes", "DisconnectTimeoutInMinutes", (properties.DisconnectTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DisconnectTimeoutInMinutes) : undefined));
  ret.addPropertyResult("downloadAllowed", "DownloadAllowed", (properties.DownloadAllowed != null ? cfn_parse.FromCloudFormation.getString(properties.DownloadAllowed) : undefined));
  ret.addPropertyResult("idleDisconnectTimeoutInMinutes", "IdleDisconnectTimeoutInMinutes", (properties.IdleDisconnectTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleDisconnectTimeoutInMinutes) : undefined));
  ret.addPropertyResult("pasteAllowed", "PasteAllowed", (properties.PasteAllowed != null ? cfn_parse.FromCloudFormation.getString(properties.PasteAllowed) : undefined));
  ret.addPropertyResult("printAllowed", "PrintAllowed", (properties.PrintAllowed != null ? cfn_parse.FromCloudFormation.getString(properties.PrintAllowed) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("uploadAllowed", "UploadAllowed", (properties.UploadAllowed != null ? cfn_parse.FromCloudFormation.getString(properties.UploadAllowed) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}