/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates or updates a reference to Amazon Cognito as an external identity provider.
 *
 * If you are creating a new identity source, then you must specify a `Configuration` . If you are updating an existing identity source, then you must specify an `UpdateConfiguration` .
 *
 * After you create an identity source, you can use the identities provided by the IdP as proxies for the principal in authorization queries that use the [IsAuthorizedWithToken](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_IsAuthorizedWithToken.html) operation. These identities take the form of tokens that contain claims about the user, such as IDs, attributes and group memberships. Amazon Cognito provides both identity tokens and access tokens, and Verified Permissions can use either or both. Any combination of identity and access tokens results in the same Cedar principal. Verified Permissions automatically translates the information about the identities into the standard Cedar attributes that can be evaluated by your policies. Because the Amazon Cognito identity and access tokens can contain different information, the tokens you choose to use determine the attributes that are available to access in the Cedar principal from your policies.
 *
 * Amazon Cognito Identity is not available in all of the same AWS Regions as Amazon Verified Permissions . Because of this, the `AWS::VerifiedPermissions::IdentitySource` type is not available to create from AWS CloudFormation in Regions where Amazon Cognito Identity is not currently available. Users can still create `AWS::VerifiedPermissions::IdentitySource` in those Regions, but only from the AWS CLI , Amazon Verified Permissions SDK, or from the AWS console.
 *
 * > To reference a user from this identity source in your Cedar policies, use the following syntax.
 * >
 * > *IdentityType::"<CognitoUserPoolIdentifier>|<CognitoClientId>*
 * >
 * > Where `IdentityType` is the string that you provide to the `PrincipalEntityType` parameter for this operation. The `CognitoUserPoolId` and `CognitoClientId` are defined by the Amazon Cognito user pool.
 *
 * @cloudformationResource AWS::VerifiedPermissions::IdentitySource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-identitysource.html
 */
export class CfnIdentitySource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VerifiedPermissions::IdentitySource";

  /**
   * Build a CfnIdentitySource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentitySource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentitySourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentitySource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A structure that contains information about the configuration of the identity source.
   *
   * @cloudformationAttribute Details
   */
  public readonly attrDetails: cdk.IResolvable;

  /**
   * @cloudformationAttribute Details.ClientIds
   */
  public readonly attrDetailsClientIds: Array<string>;

  /**
   * @cloudformationAttribute Details.DiscoveryUrl
   */
  public readonly attrDetailsDiscoveryUrl: string;

  /**
   * @cloudformationAttribute Details.OpenIdIssuer
   */
  public readonly attrDetailsOpenIdIssuer: string;

  /**
   * @cloudformationAttribute Details.UserPoolArn
   */
  public readonly attrDetailsUserPoolArn: string;

  /**
   * The unique ID of the new or updated identity store.
   *
   * @cloudformationAttribute IdentitySourceId
   */
  public readonly attrIdentitySourceId: string;

  /**
   * Contains configuration information used when creating a new identity source.
   */
  public configuration: CfnIdentitySource.IdentitySourceConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the ID of the policy store in which you want to store this identity source.
   */
  public policyStoreId?: string;

  /**
   * Specifies the namespace and data type of the principals generated for identities authenticated by the new identity source.
   */
  public principalEntityType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentitySourceProps) {
    super(scope, id, {
      "type": CfnIdentitySource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configuration", this);

    this.attrDetails = this.getAtt("Details");
    this.attrDetailsClientIds = cdk.Token.asList(this.getAtt("Details.ClientIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrDetailsDiscoveryUrl = cdk.Token.asString(this.getAtt("Details.DiscoveryUrl", cdk.ResolutionTypeHint.STRING));
    this.attrDetailsOpenIdIssuer = cdk.Token.asString(this.getAtt("Details.OpenIdIssuer", cdk.ResolutionTypeHint.STRING));
    this.attrDetailsUserPoolArn = cdk.Token.asString(this.getAtt("Details.UserPoolArn", cdk.ResolutionTypeHint.STRING));
    this.attrIdentitySourceId = cdk.Token.asString(this.getAtt("IdentitySourceId", cdk.ResolutionTypeHint.STRING));
    this.configuration = props.configuration;
    this.policyStoreId = props.policyStoreId;
    this.principalEntityType = props.principalEntityType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuration": this.configuration,
      "policyStoreId": this.policyStoreId,
      "principalEntityType": this.principalEntityType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentitySource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentitySourcePropsToCloudFormation(props);
  }
}

export namespace CfnIdentitySource {
  /**
   * A structure that contains configuration information used when creating or updating a new identity source.
   *
   * > At this time, the only valid member of this structure is a Amazon Cognito user pool configuration.
   * >
   * > You must specify a `userPoolArn` , and optionally, a `ClientId` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourceconfiguration.html
   */
  export interface IdentitySourceConfigurationProperty {
    /**
     * A structure that contains configuration information used when creating or updating an identity source that represents a connection to an Amazon Cognito user pool used as an identity provider for Verified Permissions .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourceconfiguration.html#cfn-verifiedpermissions-identitysource-identitysourceconfiguration-cognitouserpoolconfiguration
     */
    readonly cognitoUserPoolConfiguration: CfnIdentitySource.CognitoUserPoolConfigurationProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains configuration information used when creating or updating an identity source that represents a connection to an Amazon Cognito user pool used as an identity provider for Verified Permissions .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-cognitouserpoolconfiguration.html
   */
  export interface CognitoUserPoolConfigurationProperty {
    /**
     * The unique application client IDs that are associated with the specified Amazon Cognito user pool.
     *
     * Example: `"ClientIds": ["&ExampleCogClientId;"]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-cognitouserpoolconfiguration.html#cfn-verifiedpermissions-identitysource-cognitouserpoolconfiguration-clientids
     */
    readonly clientIds?: Array<string>;

    /**
     * The [Amazon Resource Name (ARN)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the Amazon Cognito user pool that contains the identities to be authorized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-cognitouserpoolconfiguration.html#cfn-verifiedpermissions-identitysource-cognitouserpoolconfiguration-userpoolarn
     */
    readonly userPoolArn: string;
  }

  /**
   * A structure that contains configuration of the identity source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourcedetails.html
   */
  export interface IdentitySourceDetailsProperty {
    /**
     * The application client IDs associated with the specified Amazon Cognito user pool that are enabled for this identity source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourcedetails.html#cfn-verifiedpermissions-identitysource-identitysourcedetails-clientids
     */
    readonly clientIds?: Array<string>;

    /**
     * The well-known URL that points to this user pool's OIDC discovery endpoint.
     *
     * This is a URL string in the following format. This URL replaces the placeholders for both the AWS Region and the user pool identifier with those appropriate for this user pool.
     *
     * `https://cognito-idp. *<region>* .amazonaws.com/ *<user-pool-id>* /.well-known/openid-configuration`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourcedetails.html#cfn-verifiedpermissions-identitysource-identitysourcedetails-discoveryurl
     */
    readonly discoveryUrl?: string;

    /**
     * A string that identifies the type of OIDC service represented by this identity source.
     *
     * At this time, the only valid value is `cognito` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourcedetails.html#cfn-verifiedpermissions-identitysource-identitysourcedetails-openidissuer
     */
    readonly openIdIssuer?: string;

    /**
     * The [Amazon Resource Name (ARN)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the Amazon Cognito user pool whose identities are accessible to this Verified Permissions policy store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-identitysource-identitysourcedetails.html#cfn-verifiedpermissions-identitysource-identitysourcedetails-userpoolarn
     */
    readonly userPoolArn?: string;
  }
}

/**
 * Properties for defining a `CfnIdentitySource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-identitysource.html
 */
export interface CfnIdentitySourceProps {
  /**
   * Contains configuration information used when creating a new identity source.
   *
   * > At this time, the only valid member of this structure is a Amazon Cognito user pool configuration.
   * >
   * > You must specify a `userPoolArn` , and optionally, a `ClientId` .
   *
   * This data type is used as a request parameter for the [CreateIdentitySource](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreateIdentitySource.html) operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-identitysource.html#cfn-verifiedpermissions-identitysource-configuration
   */
  readonly configuration: CfnIdentitySource.IdentitySourceConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the ID of the policy store in which you want to store this identity source.
   *
   * Only policies and requests made using this policy store can reference identities from the identity provider configured in the new identity source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-identitysource.html#cfn-verifiedpermissions-identitysource-policystoreid
   */
  readonly policyStoreId?: string;

  /**
   * Specifies the namespace and data type of the principals generated for identities authenticated by the new identity source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-identitysource.html#cfn-verifiedpermissions-identitysource-principalentitytype
   */
  readonly principalEntityType?: string;
}

/**
 * Determine whether the given properties match those of a `CognitoUserPoolConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoUserPoolConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentitySourceCognitoUserPoolConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientIds", cdk.listValidator(cdk.validateString))(properties.clientIds));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.requiredValidator)(properties.userPoolArn));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.validateString)(properties.userPoolArn));
  return errors.wrap("supplied properties not correct for \"CognitoUserPoolConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentitySourceCognitoUserPoolConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentitySourceCognitoUserPoolConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ClientIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.clientIds),
    "UserPoolArn": cdk.stringToCloudFormation(properties.userPoolArn)
  };
}

// @ts-ignore TS6133
function CfnIdentitySourceCognitoUserPoolConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentitySource.CognitoUserPoolConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentitySource.CognitoUserPoolConfigurationProperty>();
  ret.addPropertyResult("clientIds", "ClientIds", (properties.ClientIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClientIds) : undefined));
  ret.addPropertyResult("userPoolArn", "UserPoolArn", (properties.UserPoolArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdentitySourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IdentitySourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentitySourceIdentitySourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cognitoUserPoolConfiguration", cdk.requiredValidator)(properties.cognitoUserPoolConfiguration));
  errors.collect(cdk.propertyValidator("cognitoUserPoolConfiguration", CfnIdentitySourceCognitoUserPoolConfigurationPropertyValidator)(properties.cognitoUserPoolConfiguration));
  return errors.wrap("supplied properties not correct for \"IdentitySourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentitySourceIdentitySourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentitySourceIdentitySourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CognitoUserPoolConfiguration": convertCfnIdentitySourceCognitoUserPoolConfigurationPropertyToCloudFormation(properties.cognitoUserPoolConfiguration)
  };
}

// @ts-ignore TS6133
function CfnIdentitySourceIdentitySourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentitySource.IdentitySourceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentitySource.IdentitySourceConfigurationProperty>();
  ret.addPropertyResult("cognitoUserPoolConfiguration", "CognitoUserPoolConfiguration", (properties.CognitoUserPoolConfiguration != null ? CfnIdentitySourceCognitoUserPoolConfigurationPropertyFromCloudFormation(properties.CognitoUserPoolConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdentitySourceDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `IdentitySourceDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentitySourceIdentitySourceDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientIds", cdk.listValidator(cdk.validateString))(properties.clientIds));
  errors.collect(cdk.propertyValidator("discoveryUrl", cdk.validateString)(properties.discoveryUrl));
  errors.collect(cdk.propertyValidator("openIdIssuer", cdk.validateString)(properties.openIdIssuer));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.validateString)(properties.userPoolArn));
  return errors.wrap("supplied properties not correct for \"IdentitySourceDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentitySourceIdentitySourceDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentitySourceIdentitySourceDetailsPropertyValidator(properties).assertSuccess();
  return {
    "ClientIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.clientIds),
    "DiscoveryUrl": cdk.stringToCloudFormation(properties.discoveryUrl),
    "OpenIdIssuer": cdk.stringToCloudFormation(properties.openIdIssuer),
    "UserPoolArn": cdk.stringToCloudFormation(properties.userPoolArn)
  };
}

// @ts-ignore TS6133
function CfnIdentitySourceIdentitySourceDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentitySource.IdentitySourceDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentitySource.IdentitySourceDetailsProperty>();
  ret.addPropertyResult("clientIds", "ClientIds", (properties.ClientIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClientIds) : undefined));
  ret.addPropertyResult("discoveryUrl", "DiscoveryUrl", (properties.DiscoveryUrl != null ? cfn_parse.FromCloudFormation.getString(properties.DiscoveryUrl) : undefined));
  ret.addPropertyResult("openIdIssuer", "OpenIdIssuer", (properties.OpenIdIssuer != null ? cfn_parse.FromCloudFormation.getString(properties.OpenIdIssuer) : undefined));
  ret.addPropertyResult("userPoolArn", "UserPoolArn", (properties.UserPoolArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdentitySourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentitySourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentitySourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.requiredValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("configuration", CfnIdentitySourceIdentitySourceConfigurationPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("policyStoreId", cdk.validateString)(properties.policyStoreId));
  errors.collect(cdk.propertyValidator("principalEntityType", cdk.validateString)(properties.principalEntityType));
  return errors.wrap("supplied properties not correct for \"CfnIdentitySourceProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentitySourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentitySourcePropsValidator(properties).assertSuccess();
  return {
    "Configuration": convertCfnIdentitySourceIdentitySourceConfigurationPropertyToCloudFormation(properties.configuration),
    "PolicyStoreId": cdk.stringToCloudFormation(properties.policyStoreId),
    "PrincipalEntityType": cdk.stringToCloudFormation(properties.principalEntityType)
  };
}

// @ts-ignore TS6133
function CfnIdentitySourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentitySourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentitySourceProps>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnIdentitySourceIdentitySourceConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("policyStoreId", "PolicyStoreId", (properties.PolicyStoreId != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyStoreId) : undefined));
  ret.addPropertyResult("principalEntityType", "PrincipalEntityType", (properties.PrincipalEntityType != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalEntityType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a Cedar policy and saves it in the specified policy store.
 *
 * You can create either a static policy or a policy linked to a policy template.
 *
 * You can directly update only static policies. To update a template-linked policy, you must update it's linked policy template instead.
 *
 * - To create a static policy, in the `Definition` include a `Static` element that includes the Cedar policy text in the `Statement` element.
 * - To create a policy that is dynamically linked to a policy template, in the `Definition` include a `Templatelinked` element that specifies the policy template ID and the principal and resource to associate with this policy. If the policy template is ever updated, any policies linked to the policy template automatically use the updated template.
 *
 * > - If policy validation is enabled in the policy store, then updating a static policy causes Verified Permissions to validate the policy against the schema in the policy store. If the updated static policy doesn't pass validation, the operation fails and the update isn't stored.
 * > - When you edit a static policy, You can change only certain elements of a static policy:
 * >
 * > - The action referenced by the policy.
 * > - A condition clause, such as when and unless.
 * >
 * > You can't change these elements of a static policy:
 * >
 * > - Changing a policy from a static policy to a template-linked policy.
 * > - Changing the effect of a static policy from permit or forbid.
 * > - The principal referenced by a static policy.
 * > - The resource referenced by a static policy.
 * > - To update a template-linked policy, you must update the template instead.
 *
 * @cloudformationResource AWS::VerifiedPermissions::Policy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policy.html
 */
export class CfnPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VerifiedPermissions::Policy";

  /**
   * Build a CfnPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique ID of the new or updated policy.
   *
   * @cloudformationAttribute PolicyId
   */
  public readonly attrPolicyId: string;

  /**
   * The type of the policy. This is one of the following values:
   *
   * - Static
   * - TemplateLinked
   *
   * @cloudformationAttribute PolicyType
   */
  public readonly attrPolicyType: string;

  /**
   * Specifies the policy type and content to use for the new or updated policy.
   */
  public definition: cdk.IResolvable | CfnPolicy.PolicyDefinitionProperty;

  /**
   * Specifies the `PolicyStoreId` of the policy store you want to store the policy in.
   */
  public policyStoreId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyProps) {
    super(scope, id, {
      "type": CfnPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "definition", this);
    cdk.requireProperty(props, "policyStoreId", this);

    this.attrPolicyId = cdk.Token.asString(this.getAtt("PolicyId", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyType = cdk.Token.asString(this.getAtt("PolicyType", cdk.ResolutionTypeHint.STRING));
    this.definition = props.definition;
    this.policyStoreId = props.policyStoreId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "definition": this.definition,
      "policyStoreId": this.policyStoreId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnPolicy {
  /**
   * A structure that defines a Cedar policy.
   *
   * It includes the policy type, a description, and a policy body. This is a top level data type used to create a policy.
   *
   * This data type is used as a request parameter for the [CreatePolicy](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreatePolicy.html) operation. This structure must always have either an `Static` or a `TemplateLinked` element.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-policydefinition.html
   */
  export interface PolicyDefinitionProperty {
    /**
     * A structure that describes a static policy.
     *
     * An static policy doesn't use a template or allow placeholders for entities.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-policydefinition.html#cfn-verifiedpermissions-policy-policydefinition-static
     */
    readonly static?: cdk.IResolvable | CfnPolicy.StaticPolicyDefinitionProperty;

    /**
     * A structure that describes a policy that was instantiated from a template.
     *
     * The template can specify placeholders for `principal` and `resource` . When you use [CreatePolicy](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreatePolicy.html) to create a policy from a template, you specify the exact principal and resource to use for the instantiated policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-policydefinition.html#cfn-verifiedpermissions-policy-policydefinition-templatelinked
     */
    readonly templateLinked?: cdk.IResolvable | CfnPolicy.TemplateLinkedPolicyDefinitionProperty;
  }

  /**
   * A structure that defines a static policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-staticpolicydefinition.html
   */
  export interface StaticPolicyDefinitionProperty {
    /**
     * The description of the static policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-staticpolicydefinition.html#cfn-verifiedpermissions-policy-staticpolicydefinition-description
     */
    readonly description?: string;

    /**
     * The policy content of the static policy, written in the Cedar policy language.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-staticpolicydefinition.html#cfn-verifiedpermissions-policy-staticpolicydefinition-statement
     */
    readonly statement: string;
  }

  /**
   * A structure that describes a policy created by instantiating a policy template.
   *
   * > You can't directly update a template-linked policy. You must update the associated policy template instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-templatelinkedpolicydefinition.html
   */
  export interface TemplateLinkedPolicyDefinitionProperty {
    /**
     * The unique identifier of the policy template used to create this policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-templatelinkedpolicydefinition.html#cfn-verifiedpermissions-policy-templatelinkedpolicydefinition-policytemplateid
     */
    readonly policyTemplateId: string;

    /**
     * The principal associated with this template-linked policy.
     *
     * Verified Permissions substitutes this principal for the `?principal` placeholder in the policy template when it evaluates an authorization request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-templatelinkedpolicydefinition.html#cfn-verifiedpermissions-policy-templatelinkedpolicydefinition-principal
     */
    readonly principal?: CfnPolicy.EntityIdentifierProperty | cdk.IResolvable;

    /**
     * The resource associated with this template-linked policy.
     *
     * Verified Permissions substitutes this resource for the `?resource` placeholder in the policy template when it evaluates an authorization request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-templatelinkedpolicydefinition.html#cfn-verifiedpermissions-policy-templatelinkedpolicydefinition-resource
     */
    readonly resource?: CfnPolicy.EntityIdentifierProperty | cdk.IResolvable;
  }

  /**
   * Contains the identifier of an entity in a policy, including its ID and type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-entityidentifier.html
   */
  export interface EntityIdentifierProperty {
    /**
     * The identifier of an entity.
     *
     * `"entityId":" *identifier* "`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-entityidentifier.html#cfn-verifiedpermissions-policy-entityidentifier-entityid
     */
    readonly entityId: string;

    /**
     * The type of an entity.
     *
     * Example: `"entityType":" *typeName* "`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policy-entityidentifier.html#cfn-verifiedpermissions-policy-entityidentifier-entitytype
     */
    readonly entityType: string;
  }
}

/**
 * Properties for defining a `CfnPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policy.html
 */
export interface CfnPolicyProps {
  /**
   * Specifies the policy type and content to use for the new or updated policy.
   *
   * The definition structure must include either a `Static` or a `TemplateLinked` element.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policy.html#cfn-verifiedpermissions-policy-definition
   */
  readonly definition: cdk.IResolvable | CfnPolicy.PolicyDefinitionProperty;

  /**
   * Specifies the `PolicyStoreId` of the policy store you want to store the policy in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policy.html#cfn-verifiedpermissions-policy-policystoreid
   */
  readonly policyStoreId: string;
}

/**
 * Determine whether the given properties match those of a `StaticPolicyDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `StaticPolicyDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyStaticPolicyDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", cdk.validateString)(properties.statement));
  return errors.wrap("supplied properties not correct for \"StaticPolicyDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyStaticPolicyDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyStaticPolicyDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Statement": cdk.stringToCloudFormation(properties.statement)
  };
}

// @ts-ignore TS6133
function CfnPolicyStaticPolicyDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPolicy.StaticPolicyDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.StaticPolicyDefinitionProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? cfn_parse.FromCloudFormation.getString(properties.Statement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EntityIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `EntityIdentifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyEntityIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityId", cdk.requiredValidator)(properties.entityId));
  errors.collect(cdk.propertyValidator("entityId", cdk.validateString)(properties.entityId));
  errors.collect(cdk.propertyValidator("entityType", cdk.requiredValidator)(properties.entityType));
  errors.collect(cdk.propertyValidator("entityType", cdk.validateString)(properties.entityType));
  return errors.wrap("supplied properties not correct for \"EntityIdentifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyEntityIdentifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyEntityIdentifierPropertyValidator(properties).assertSuccess();
  return {
    "EntityId": cdk.stringToCloudFormation(properties.entityId),
    "EntityType": cdk.stringToCloudFormation(properties.entityType)
  };
}

// @ts-ignore TS6133
function CfnPolicyEntityIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicy.EntityIdentifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.EntityIdentifierProperty>();
  ret.addPropertyResult("entityId", "EntityId", (properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined));
  ret.addPropertyResult("entityType", "EntityType", (properties.EntityType != null ? cfn_parse.FromCloudFormation.getString(properties.EntityType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateLinkedPolicyDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateLinkedPolicyDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyTemplateLinkedPolicyDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyTemplateId", cdk.requiredValidator)(properties.policyTemplateId));
  errors.collect(cdk.propertyValidator("policyTemplateId", cdk.validateString)(properties.policyTemplateId));
  errors.collect(cdk.propertyValidator("principal", CfnPolicyEntityIdentifierPropertyValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("resource", CfnPolicyEntityIdentifierPropertyValidator)(properties.resource));
  return errors.wrap("supplied properties not correct for \"TemplateLinkedPolicyDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyTemplateLinkedPolicyDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyTemplateLinkedPolicyDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "PolicyTemplateId": cdk.stringToCloudFormation(properties.policyTemplateId),
    "Principal": convertCfnPolicyEntityIdentifierPropertyToCloudFormation(properties.principal),
    "Resource": convertCfnPolicyEntityIdentifierPropertyToCloudFormation(properties.resource)
  };
}

// @ts-ignore TS6133
function CfnPolicyTemplateLinkedPolicyDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPolicy.TemplateLinkedPolicyDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.TemplateLinkedPolicyDefinitionProperty>();
  ret.addPropertyResult("policyTemplateId", "PolicyTemplateId", (properties.PolicyTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyTemplateId) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? CfnPolicyEntityIdentifierPropertyFromCloudFormation(properties.Principal) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? CfnPolicyEntityIdentifierPropertyFromCloudFormation(properties.Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PolicyDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyPolicyDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("static", CfnPolicyStaticPolicyDefinitionPropertyValidator)(properties.static));
  errors.collect(cdk.propertyValidator("templateLinked", CfnPolicyTemplateLinkedPolicyDefinitionPropertyValidator)(properties.templateLinked));
  return errors.wrap("supplied properties not correct for \"PolicyDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyPolicyDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyPolicyDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Static": convertCfnPolicyStaticPolicyDefinitionPropertyToCloudFormation(properties.static),
    "TemplateLinked": convertCfnPolicyTemplateLinkedPolicyDefinitionPropertyToCloudFormation(properties.templateLinked)
  };
}

// @ts-ignore TS6133
function CfnPolicyPolicyDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPolicy.PolicyDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicy.PolicyDefinitionProperty>();
  ret.addPropertyResult("static", "Static", (properties.Static != null ? CfnPolicyStaticPolicyDefinitionPropertyFromCloudFormation(properties.Static) : undefined));
  ret.addPropertyResult("templateLinked", "TemplateLinked", (properties.TemplateLinked != null ? CfnPolicyTemplateLinkedPolicyDefinitionPropertyFromCloudFormation(properties.TemplateLinked) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", CfnPolicyPolicyDefinitionPropertyValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("policyStoreId", cdk.requiredValidator)(properties.policyStoreId));
  errors.collect(cdk.propertyValidator("policyStoreId", cdk.validateString)(properties.policyStoreId));
  return errors.wrap("supplied properties not correct for \"CfnPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyPropsValidator(properties).assertSuccess();
  return {
    "Definition": convertCfnPolicyPolicyDefinitionPropertyToCloudFormation(properties.definition),
    "PolicyStoreId": cdk.stringToCloudFormation(properties.policyStoreId)
  };
}

// @ts-ignore TS6133
function CfnPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyProps>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? CfnPolicyPolicyDefinitionPropertyFromCloudFormation(properties.Definition) : undefined));
  ret.addPropertyResult("policyStoreId", "PolicyStoreId", (properties.PolicyStoreId != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyStoreId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a policy store.
 *
 * A policy store is a container for policy resources. You can create a separate policy store for each of your applications.
 *
 * @cloudformationResource AWS::VerifiedPermissions::PolicyStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policystore.html
 */
export class CfnPolicyStore extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VerifiedPermissions::PolicyStore";

  /**
   * Build a CfnPolicyStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicyStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPolicyStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPolicyStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The [Amazon Resource Name (ARN)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the new or updated policy store.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique ID of the new or updated policy store.
   *
   * @cloudformationAttribute PolicyStoreId
   */
  public readonly attrPolicyStoreId: string;

  /**
   * Descriptive text that you can provide to help with identification of the current policy store.
   */
  public description?: string;

  /**
   * Creates or updates the policy schema in a policy store.
   */
  public schema?: cdk.IResolvable | CfnPolicyStore.SchemaDefinitionProperty;

  /**
   * Specifies the validation setting for this policy store.
   */
  public validationSettings: cdk.IResolvable | CfnPolicyStore.ValidationSettingsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyStoreProps) {
    super(scope, id, {
      "type": CfnPolicyStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "validationSettings", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyStoreId = cdk.Token.asString(this.getAtt("PolicyStoreId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.schema = props.schema;
    this.validationSettings = props.validationSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "schema": this.schema,
      "validationSettings": this.validationSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicyStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyStorePropsToCloudFormation(props);
  }
}

export namespace CfnPolicyStore {
  /**
   * A structure that contains Cedar policy validation settings for the policy store.
   *
   * The validation mode determines which validation failures that Cedar considers serious enough to block acceptance of a new or edited static policy or policy template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policystore-validationsettings.html
   */
  export interface ValidationSettingsProperty {
    /**
     * The validation mode currently configured for this policy store. The valid values are:.
     *
     * - *OFF* – Neither Verified Permissions nor Cedar perform any validation on policies. No validation errors are reported by either service.
     * - *STRICT* – Requires a schema to be present in the policy store. Cedar performs validation on all submitted new or updated static policies and policy templates. Any that fail validation are rejected and Cedar doesn't store them in the policy store.
     *
     * > If `Mode=STRICT` and the policy store doesn't contain a schema, Verified Permissions rejects all static policies and policy templates because there is no schema to validate against.
     * >
     * > To submit a static policy or policy template without a schema, you must turn off validation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policystore-validationsettings.html#cfn-verifiedpermissions-policystore-validationsettings-mode
     */
    readonly mode: string;
  }

  /**
   * Contains a list of principal types, resource types, and actions that can be specified in policies stored in the same policy store.
   *
   * If the validation mode for the policy store is set to `STRICT` , then policies that can't be validated by this schema are rejected by Verified Permissions and can't be stored in the policy store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policystore-schemadefinition.html
   */
  export interface SchemaDefinitionProperty {
    /**
     * A JSON string representation of the schema supported by applications that use this policy store.
     *
     * For more information, see [Policy store schema](https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/schema.html) in the *Amazon Verified Permissions User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-verifiedpermissions-policystore-schemadefinition.html#cfn-verifiedpermissions-policystore-schemadefinition-cedarjson
     */
    readonly cedarJson?: string;
  }
}

/**
 * Properties for defining a `CfnPolicyStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policystore.html
 */
export interface CfnPolicyStoreProps {
  /**
   * Descriptive text that you can provide to help with identification of the current policy store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policystore.html#cfn-verifiedpermissions-policystore-description
   */
  readonly description?: string;

  /**
   * Creates or updates the policy schema in a policy store.
   *
   * Cedar can use the schema to validate any Cedar policies and policy templates submitted to the policy store. Any changes to the schema validate only policies and templates submitted after the schema change. Existing policies and templates are not re-evaluated against the changed schema. If you later update a policy, then it is evaluated against the new schema at that time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policystore.html#cfn-verifiedpermissions-policystore-schema
   */
  readonly schema?: cdk.IResolvable | CfnPolicyStore.SchemaDefinitionProperty;

  /**
   * Specifies the validation setting for this policy store.
   *
   * Currently, the only valid and required value is `Mode` .
   *
   * > We recommend that you turn on `STRICT` mode only after you define a schema. If a schema doesn't exist, then `STRICT` mode causes any policy to fail validation, and Verified Permissions rejects the policy. You can turn off validation by using the [UpdatePolicyStore](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_UpdatePolicyStore) . Then, when you have a schema defined, use [UpdatePolicyStore](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_UpdatePolicyStore) again to turn validation back on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policystore.html#cfn-verifiedpermissions-policystore-validationsettings
   */
  readonly validationSettings: cdk.IResolvable | CfnPolicyStore.ValidationSettingsProperty;
}

/**
 * Determine whether the given properties match those of a `ValidationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ValidationSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyStoreValidationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  return errors.wrap("supplied properties not correct for \"ValidationSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyStoreValidationSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyStoreValidationSettingsPropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode)
  };
}

// @ts-ignore TS6133
function CfnPolicyStoreValidationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPolicyStore.ValidationSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyStore.ValidationSettingsProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyStoreSchemaDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cedarJson", cdk.validateString)(properties.cedarJson));
  return errors.wrap("supplied properties not correct for \"SchemaDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPolicyStoreSchemaDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyStoreSchemaDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "CedarJson": cdk.stringToCloudFormation(properties.cedarJson)
  };
}

// @ts-ignore TS6133
function CfnPolicyStoreSchemaDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPolicyStore.SchemaDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyStore.SchemaDefinitionProperty>();
  ret.addPropertyResult("cedarJson", "CedarJson", (properties.CedarJson != null ? cfn_parse.FromCloudFormation.getString(properties.CedarJson) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("schema", CfnPolicyStoreSchemaDefinitionPropertyValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("validationSettings", cdk.requiredValidator)(properties.validationSettings));
  errors.collect(cdk.propertyValidator("validationSettings", CfnPolicyStoreValidationSettingsPropertyValidator)(properties.validationSettings));
  return errors.wrap("supplied properties not correct for \"CfnPolicyStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyStorePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Schema": convertCfnPolicyStoreSchemaDefinitionPropertyToCloudFormation(properties.schema),
    "ValidationSettings": convertCfnPolicyStoreValidationSettingsPropertyToCloudFormation(properties.validationSettings)
  };
}

// @ts-ignore TS6133
function CfnPolicyStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyStoreProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? CfnPolicyStoreSchemaDefinitionPropertyFromCloudFormation(properties.Schema) : undefined));
  ret.addPropertyResult("validationSettings", "ValidationSettings", (properties.ValidationSettings != null ? CfnPolicyStoreValidationSettingsPropertyFromCloudFormation(properties.ValidationSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a policy template.
 *
 * A template can use placeholders for the principal and resource. A template must be instantiated into a policy by associating it with specific principals and resources to use for the placeholders. That instantiated policy can then be considered in authorization decisions. The instantiated policy works identically to any other policy, except that it is dynamically linked to the template. If the template changes, then any policies that are linked to that template are immediately updated as well.
 *
 * @cloudformationResource AWS::VerifiedPermissions::PolicyTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policytemplate.html
 */
export class CfnPolicyTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VerifiedPermissions::PolicyTemplate";

  /**
   * Build a CfnPolicyTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicyTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPolicyTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPolicyTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the new or modified policy template.
   *
   * @cloudformationAttribute PolicyTemplateId
   */
  public readonly attrPolicyTemplateId: string;

  /**
   * The description to attach to the new or updated policy template.
   */
  public description?: string;

  /**
   * The unique identifier of the policy store that contains the template.
   */
  public policyStoreId?: string;

  /**
   * Specifies the content that you want to use for the new policy template, written in the Cedar policy language.
   */
  public statement: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyTemplateProps) {
    super(scope, id, {
      "type": CfnPolicyTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "statement", this);

    this.attrPolicyTemplateId = cdk.Token.asString(this.getAtt("PolicyTemplateId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.policyStoreId = props.policyStoreId;
    this.statement = props.statement;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "policyStoreId": this.policyStoreId,
      "statement": this.statement
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicyTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPolicyTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policytemplate.html
 */
export interface CfnPolicyTemplateProps {
  /**
   * The description to attach to the new or updated policy template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policytemplate.html#cfn-verifiedpermissions-policytemplate-description
   */
  readonly description?: string;

  /**
   * The unique identifier of the policy store that contains the template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policytemplate.html#cfn-verifiedpermissions-policytemplate-policystoreid
   */
  readonly policyStoreId?: string;

  /**
   * Specifies the content that you want to use for the new policy template, written in the Cedar policy language.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-verifiedpermissions-policytemplate.html#cfn-verifiedpermissions-policytemplate-statement
   */
  readonly statement: string;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("policyStoreId", cdk.validateString)(properties.policyStoreId));
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", cdk.validateString)(properties.statement));
  return errors.wrap("supplied properties not correct for \"CfnPolicyTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyTemplatePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "PolicyStoreId": cdk.stringToCloudFormation(properties.policyStoreId),
    "Statement": cdk.stringToCloudFormation(properties.statement)
  };
}

// @ts-ignore TS6133
function CfnPolicyTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyTemplateProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("policyStoreId", "PolicyStoreId", (properties.PolicyStoreId != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyStoreId) : undefined));
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? cfn_parse.FromCloudFormation.getString(properties.Statement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}