/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Cognito::IdentityPool` resource creates an Amazon Cognito identity pool.
 *
 * To avoid deleting the resource accidentally from AWS CloudFormation , use [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) and the [UpdateReplacePolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html) to retain the resource on deletion or replacement.
 *
 * @cloudformationResource AWS::Cognito::IdentityPool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html
 */
export class CfnIdentityPool extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::IdentityPool";

  /**
   * Build a CfnIdentityPool from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityPool {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentityPoolPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentityPool(scope, id, propsResult.value);
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

  /**
   * The name of the Amazon Cognito identity pool, returned as a string.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Enables the Basic (Classic) authentication flow.
   */
  public allowClassicFlow?: boolean | cdk.IResolvable;

  /**
   * Specifies whether the identity pool supports unauthenticated logins.
   */
  public allowUnauthenticatedIdentities: boolean | cdk.IResolvable;

  /**
   * The events to configure.
   */
  public cognitoEvents?: any | cdk.IResolvable;

  /**
   * The Amazon Cognito user pools and their client IDs.
   */
  public cognitoIdentityProviders?: Array<CfnIdentityPool.CognitoIdentityProviderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Configuration options for configuring Amazon Cognito streams.
   */
  public cognitoStreams?: CfnIdentityPool.CognitoStreamsProperty | cdk.IResolvable;

  /**
   * The "domain" Amazon Cognito uses when referencing your users.
   */
  public developerProviderName?: string;

  /**
   * The name of your Amazon Cognito identity pool.
   */
  public identityPoolName?: string;

  /**
   * The Amazon Resource Names (ARNs) of the OpenID connect providers.
   */
  public openIdConnectProviderArns?: Array<string>;

  /**
   * The configuration options to be applied to the identity pool.
   */
  public pushSync?: cdk.IResolvable | CfnIdentityPool.PushSyncProperty;

  /**
   * The Amazon Resource Names (ARNs) of the Security Assertion Markup Language (SAML) providers.
   */
  public samlProviderArns?: Array<string>;

  /**
   * Key-value pairs that map provider names to provider app IDs.
   */
  public supportedLoginProviders?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityPoolProps) {
    super(scope, id, {
      "type": CfnIdentityPool.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "allowUnauthenticatedIdentities", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.allowClassicFlow = props.allowClassicFlow;
    this.allowUnauthenticatedIdentities = props.allowUnauthenticatedIdentities;
    this.cognitoEvents = props.cognitoEvents;
    this.cognitoIdentityProviders = props.cognitoIdentityProviders;
    this.cognitoStreams = props.cognitoStreams;
    this.developerProviderName = props.developerProviderName;
    this.identityPoolName = props.identityPoolName;
    this.openIdConnectProviderArns = props.openIdConnectProviderArns;
    this.pushSync = props.pushSync;
    this.samlProviderArns = props.samlProviderArns;
    this.supportedLoginProviders = props.supportedLoginProviders;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowClassicFlow": this.allowClassicFlow,
      "allowUnauthenticatedIdentities": this.allowUnauthenticatedIdentities,
      "cognitoEvents": this.cognitoEvents,
      "cognitoIdentityProviders": this.cognitoIdentityProviders,
      "cognitoStreams": this.cognitoStreams,
      "developerProviderName": this.developerProviderName,
      "identityPoolName": this.identityPoolName,
      "openIdConnectProviderArns": this.openIdConnectProviderArns,
      "pushSync": this.pushSync,
      "samlProviderArns": this.samlProviderArns,
      "supportedLoginProviders": this.supportedLoginProviders
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityPool.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityPoolPropsToCloudFormation(props);
  }
}

export namespace CfnIdentityPool {
  /**
   * `PushSync` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that defines the configuration options to be applied to an Amazon Cognito identity pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html
   */
  export interface PushSyncProperty {
    /**
     * The ARNs of the Amazon SNS platform applications that could be used by clients.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html#cfn-cognito-identitypool-pushsync-applicationarns
     */
    readonly applicationArns?: Array<string>;

    /**
     * An IAM role configured to allow Amazon Cognito to call Amazon SNS on behalf of the developer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html#cfn-cognito-identitypool-pushsync-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * `CognitoIdentityProvider` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that represents an Amazon Cognito user pool and its client ID.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html
   */
  export interface CognitoIdentityProviderProperty {
    /**
     * The client ID for the Amazon Cognito user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-clientid
     */
    readonly clientId?: string;

    /**
     * The provider name for an Amazon Cognito user pool.
     *
     * For example: `cognito-idp.us-east-2.amazonaws.com/us-east-2_123456789` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-providername
     */
    readonly providerName?: string;

    /**
     * TRUE if server-side token validation is enabled for the identity provider’s token.
     *
     * After you set the `ServerSideTokenCheck` to TRUE for an identity pool, that identity pool checks with the integrated user pools to make sure the user has not been globally signed out or deleted before the identity pool provides an OIDC token or AWS credentials for the user.
     *
     * If the user is signed out or deleted, the identity pool returns a 400 Not Authorized error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-serversidetokencheck
     */
    readonly serverSideTokenCheck?: boolean | cdk.IResolvable;
  }

  /**
   * `CognitoStreams` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that defines configuration options for Amazon Cognito streams.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html
   */
  export interface CognitoStreamsProperty {
    /**
     * The Amazon Resource Name (ARN) of the role Amazon Cognito can assume to publish to the stream.
     *
     * This role must grant access to Amazon Cognito (cognito-sync) to invoke `PutRecord` on your Amazon Cognito stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-rolearn
     */
    readonly roleArn?: string;

    /**
     * Status of the Amazon Cognito streams.
     *
     * Valid values are: `ENABLED` or `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamingstatus
     */
    readonly streamingStatus?: string;

    /**
     * The name of the Amazon Cognito stream to receive updates.
     *
     * This stream must be in the developer's account and in the same Region as the identity pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamname
     */
    readonly streamName?: string;
  }
}

/**
 * Properties for defining a `CfnIdentityPool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html
 */
export interface CfnIdentityPoolProps {
  /**
   * Enables the Basic (Classic) authentication flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowclassicflow
   */
  readonly allowClassicFlow?: boolean | cdk.IResolvable;

  /**
   * Specifies whether the identity pool supports unauthenticated logins.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowunauthenticatedidentities
   */
  readonly allowUnauthenticatedIdentities: boolean | cdk.IResolvable;

  /**
   * The events to configure.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoevents
   */
  readonly cognitoEvents?: any | cdk.IResolvable;

  /**
   * The Amazon Cognito user pools and their client IDs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoidentityproviders
   */
  readonly cognitoIdentityProviders?: Array<CfnIdentityPool.CognitoIdentityProviderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Configuration options for configuring Amazon Cognito streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitostreams
   */
  readonly cognitoStreams?: CfnIdentityPool.CognitoStreamsProperty | cdk.IResolvable;

  /**
   * The "domain" Amazon Cognito uses when referencing your users.
   *
   * This name acts as a placeholder that allows your backend and the Amazon Cognito service to communicate about the developer provider. For the `DeveloperProviderName` , you can use letters and periods (.), underscores (_), and dashes (-).
   *
   * *Minimum length* : 1
   *
   * *Maximum length* : 100
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-developerprovidername
   */
  readonly developerProviderName?: string;

  /**
   * The name of your Amazon Cognito identity pool.
   *
   * *Minimum length* : 1
   *
   * *Maximum length* : 128
   *
   * *Pattern* : `[\w\s+=,.@-]+`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-identitypoolname
   */
  readonly identityPoolName?: string;

  /**
   * The Amazon Resource Names (ARNs) of the OpenID connect providers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-openidconnectproviderarns
   */
  readonly openIdConnectProviderArns?: Array<string>;

  /**
   * The configuration options to be applied to the identity pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-pushsync
   */
  readonly pushSync?: cdk.IResolvable | CfnIdentityPool.PushSyncProperty;

  /**
   * The Amazon Resource Names (ARNs) of the Security Assertion Markup Language (SAML) providers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-samlproviderarns
   */
  readonly samlProviderArns?: Array<string>;

  /**
   * Key-value pairs that map provider names to provider app IDs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-supportedloginproviders
   */
  readonly supportedLoginProviders?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PushSyncProperty`
 *
 * @param properties - the TypeScript properties of a `PushSyncProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolPushSyncPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationArns", cdk.listValidator(cdk.validateString))(properties.applicationArns));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"PushSyncProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolPushSyncPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolPushSyncPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.applicationArns),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolPushSyncPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityPool.PushSyncProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPool.PushSyncProperty>();
  ret.addPropertyResult("applicationArns", "ApplicationArns", (properties.ApplicationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ApplicationArns) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CognitoIdentityProviderProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoIdentityProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolCognitoIdentityProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("providerName", cdk.validateString)(properties.providerName));
  errors.collect(cdk.propertyValidator("serverSideTokenCheck", cdk.validateBoolean)(properties.serverSideTokenCheck));
  return errors.wrap("supplied properties not correct for \"CognitoIdentityProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolCognitoIdentityProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolCognitoIdentityProviderPropertyValidator(properties).assertSuccess();
  return {
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ProviderName": cdk.stringToCloudFormation(properties.providerName),
    "ServerSideTokenCheck": cdk.booleanToCloudFormation(properties.serverSideTokenCheck)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolCognitoIdentityProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityPool.CognitoIdentityProviderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPool.CognitoIdentityProviderProperty>();
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("providerName", "ProviderName", (properties.ProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderName) : undefined));
  ret.addPropertyResult("serverSideTokenCheck", "ServerSideTokenCheck", (properties.ServerSideTokenCheck != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ServerSideTokenCheck) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CognitoStreamsProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoStreamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolCognitoStreamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("streamName", cdk.validateString)(properties.streamName));
  errors.collect(cdk.propertyValidator("streamingStatus", cdk.validateString)(properties.streamingStatus));
  return errors.wrap("supplied properties not correct for \"CognitoStreamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolCognitoStreamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolCognitoStreamsPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StreamName": cdk.stringToCloudFormation(properties.streamName),
    "StreamingStatus": cdk.stringToCloudFormation(properties.streamingStatus)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolCognitoStreamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityPool.CognitoStreamsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPool.CognitoStreamsProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("streamingStatus", "StreamingStatus", (properties.StreamingStatus != null ? cfn_parse.FromCloudFormation.getString(properties.StreamingStatus) : undefined));
  ret.addPropertyResult("streamName", "StreamName", (properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityPoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityPoolProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowClassicFlow", cdk.validateBoolean)(properties.allowClassicFlow));
  errors.collect(cdk.propertyValidator("allowUnauthenticatedIdentities", cdk.requiredValidator)(properties.allowUnauthenticatedIdentities));
  errors.collect(cdk.propertyValidator("allowUnauthenticatedIdentities", cdk.validateBoolean)(properties.allowUnauthenticatedIdentities));
  errors.collect(cdk.propertyValidator("cognitoEvents", cdk.validateObject)(properties.cognitoEvents));
  errors.collect(cdk.propertyValidator("cognitoIdentityProviders", cdk.listValidator(CfnIdentityPoolCognitoIdentityProviderPropertyValidator))(properties.cognitoIdentityProviders));
  errors.collect(cdk.propertyValidator("cognitoStreams", CfnIdentityPoolCognitoStreamsPropertyValidator)(properties.cognitoStreams));
  errors.collect(cdk.propertyValidator("developerProviderName", cdk.validateString)(properties.developerProviderName));
  errors.collect(cdk.propertyValidator("identityPoolName", cdk.validateString)(properties.identityPoolName));
  errors.collect(cdk.propertyValidator("openIdConnectProviderArns", cdk.listValidator(cdk.validateString))(properties.openIdConnectProviderArns));
  errors.collect(cdk.propertyValidator("pushSync", CfnIdentityPoolPushSyncPropertyValidator)(properties.pushSync));
  errors.collect(cdk.propertyValidator("samlProviderArns", cdk.listValidator(cdk.validateString))(properties.samlProviderArns));
  errors.collect(cdk.propertyValidator("supportedLoginProviders", cdk.validateObject)(properties.supportedLoginProviders));
  return errors.wrap("supplied properties not correct for \"CfnIdentityPoolProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolPropsValidator(properties).assertSuccess();
  return {
    "AllowClassicFlow": cdk.booleanToCloudFormation(properties.allowClassicFlow),
    "AllowUnauthenticatedIdentities": cdk.booleanToCloudFormation(properties.allowUnauthenticatedIdentities),
    "CognitoEvents": cdk.objectToCloudFormation(properties.cognitoEvents),
    "CognitoIdentityProviders": cdk.listMapper(convertCfnIdentityPoolCognitoIdentityProviderPropertyToCloudFormation)(properties.cognitoIdentityProviders),
    "CognitoStreams": convertCfnIdentityPoolCognitoStreamsPropertyToCloudFormation(properties.cognitoStreams),
    "DeveloperProviderName": cdk.stringToCloudFormation(properties.developerProviderName),
    "IdentityPoolName": cdk.stringToCloudFormation(properties.identityPoolName),
    "OpenIdConnectProviderARNs": cdk.listMapper(cdk.stringToCloudFormation)(properties.openIdConnectProviderArns),
    "PushSync": convertCfnIdentityPoolPushSyncPropertyToCloudFormation(properties.pushSync),
    "SamlProviderARNs": cdk.listMapper(cdk.stringToCloudFormation)(properties.samlProviderArns),
    "SupportedLoginProviders": cdk.objectToCloudFormation(properties.supportedLoginProviders)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityPoolProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolProps>();
  ret.addPropertyResult("allowClassicFlow", "AllowClassicFlow", (properties.AllowClassicFlow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowClassicFlow) : undefined));
  ret.addPropertyResult("allowUnauthenticatedIdentities", "AllowUnauthenticatedIdentities", (properties.AllowUnauthenticatedIdentities != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowUnauthenticatedIdentities) : undefined));
  ret.addPropertyResult("cognitoEvents", "CognitoEvents", (properties.CognitoEvents != null ? cfn_parse.FromCloudFormation.getAny(properties.CognitoEvents) : undefined));
  ret.addPropertyResult("cognitoIdentityProviders", "CognitoIdentityProviders", (properties.CognitoIdentityProviders != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityPoolCognitoIdentityProviderPropertyFromCloudFormation)(properties.CognitoIdentityProviders) : undefined));
  ret.addPropertyResult("cognitoStreams", "CognitoStreams", (properties.CognitoStreams != null ? CfnIdentityPoolCognitoStreamsPropertyFromCloudFormation(properties.CognitoStreams) : undefined));
  ret.addPropertyResult("developerProviderName", "DeveloperProviderName", (properties.DeveloperProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.DeveloperProviderName) : undefined));
  ret.addPropertyResult("identityPoolName", "IdentityPoolName", (properties.IdentityPoolName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolName) : undefined));
  ret.addPropertyResult("openIdConnectProviderArns", "OpenIdConnectProviderARNs", (properties.OpenIdConnectProviderARNs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OpenIdConnectProviderARNs) : undefined));
  ret.addPropertyResult("pushSync", "PushSync", (properties.PushSync != null ? CfnIdentityPoolPushSyncPropertyFromCloudFormation(properties.PushSync) : undefined));
  ret.addPropertyResult("samlProviderArns", "SamlProviderARNs", (properties.SamlProviderARNs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SamlProviderARNs) : undefined));
  ret.addPropertyResult("supportedLoginProviders", "SupportedLoginProviders", (properties.SupportedLoginProviders != null ? cfn_parse.FromCloudFormation.getAny(properties.SupportedLoginProviders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A list of the identity pool principal tag assignments for attributes for access control.
 *
 * @cloudformationResource AWS::Cognito::IdentityPoolPrincipalTag
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html
 */
export class CfnIdentityPoolPrincipalTag extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::IdentityPoolPrincipalTag";

  /**
   * Build a CfnIdentityPoolPrincipalTag from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityPoolPrincipalTag {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentityPoolPrincipalTagPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentityPoolPrincipalTag(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identity pool that you want to associate with this principal tag map.
   */
  public identityPoolId: string;

  /**
   * The identity pool identity provider (IdP) that you want to associate with this principal tag map.
   */
  public identityProviderName: string;

  /**
   * A JSON-formatted list of user claims and the principal tags that you want to associate with them.
   */
  public principalTags?: any | cdk.IResolvable;

  /**
   * Use a default set of mappings between claims and tags for this provider, instead of a custom map.
   */
  public useDefaults?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityPoolPrincipalTagProps) {
    super(scope, id, {
      "type": CfnIdentityPoolPrincipalTag.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "identityPoolId", this);
    cdk.requireProperty(props, "identityProviderName", this);

    this.identityPoolId = props.identityPoolId;
    this.identityProviderName = props.identityProviderName;
    this.principalTags = props.principalTags;
    this.useDefaults = props.useDefaults;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identityPoolId": this.identityPoolId,
      "identityProviderName": this.identityProviderName,
      "principalTags": this.principalTags,
      "useDefaults": this.useDefaults
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityPoolPrincipalTag.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityPoolPrincipalTagPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIdentityPoolPrincipalTag`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html
 */
export interface CfnIdentityPoolPrincipalTagProps {
  /**
   * The identity pool that you want to associate with this principal tag map.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html#cfn-cognito-identitypoolprincipaltag-identitypoolid
   */
  readonly identityPoolId: string;

  /**
   * The identity pool identity provider (IdP) that you want to associate with this principal tag map.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html#cfn-cognito-identitypoolprincipaltag-identityprovidername
   */
  readonly identityProviderName: string;

  /**
   * A JSON-formatted list of user claims and the principal tags that you want to associate with them.
   *
   * When Amazon Cognito requests credentials, it sets the value of the principal tag to the value of the user's claim.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html#cfn-cognito-identitypoolprincipaltag-principaltags
   */
  readonly principalTags?: any | cdk.IResolvable;

  /**
   * Use a default set of mappings between claims and tags for this provider, instead of a custom map.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolprincipaltag.html#cfn-cognito-identitypoolprincipaltag-usedefaults
   */
  readonly useDefaults?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityPoolPrincipalTagProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityPoolPrincipalTagProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolPrincipalTagPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.requiredValidator)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.validateString)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("identityProviderName", cdk.requiredValidator)(properties.identityProviderName));
  errors.collect(cdk.propertyValidator("identityProviderName", cdk.validateString)(properties.identityProviderName));
  errors.collect(cdk.propertyValidator("principalTags", cdk.validateObject)(properties.principalTags));
  errors.collect(cdk.propertyValidator("useDefaults", cdk.validateBoolean)(properties.useDefaults));
  return errors.wrap("supplied properties not correct for \"CfnIdentityPoolPrincipalTagProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolPrincipalTagPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolPrincipalTagPropsValidator(properties).assertSuccess();
  return {
    "IdentityPoolId": cdk.stringToCloudFormation(properties.identityPoolId),
    "IdentityProviderName": cdk.stringToCloudFormation(properties.identityProviderName),
    "PrincipalTags": cdk.objectToCloudFormation(properties.principalTags),
    "UseDefaults": cdk.booleanToCloudFormation(properties.useDefaults)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolPrincipalTagPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityPoolPrincipalTagProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolPrincipalTagProps>();
  ret.addPropertyResult("identityPoolId", "IdentityPoolId", (properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined));
  ret.addPropertyResult("identityProviderName", "IdentityProviderName", (properties.IdentityProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderName) : undefined));
  ret.addPropertyResult("principalTags", "PrincipalTags", (properties.PrincipalTags != null ? cfn_parse.FromCloudFormation.getAny(properties.PrincipalTags) : undefined));
  ret.addPropertyResult("useDefaults", "UseDefaults", (properties.UseDefaults != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseDefaults) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::IdentityPoolRoleAttachment` resource manages the role configuration for an Amazon Cognito identity pool.
 *
 * @cloudformationResource AWS::Cognito::IdentityPoolRoleAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export class CfnIdentityPoolRoleAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::IdentityPoolRoleAttachment";

  /**
   * Build a CfnIdentityPoolRoleAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityPoolRoleAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentityPoolRoleAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentityPoolRoleAttachment(scope, id, propsResult.value);
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

  /**
   * An identity pool ID in the format `REGION:GUID` .
   */
  public identityPoolId: string;

  /**
   * How users for a specific identity provider are mapped to roles.
   */
  public roleMappings?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnIdentityPoolRoleAttachment.RoleMappingProperty>;

  /**
   * The map of the roles associated with this pool.
   */
  public roles?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityPoolRoleAttachmentProps) {
    super(scope, id, {
      "type": CfnIdentityPoolRoleAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "identityPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.identityPoolId = props.identityPoolId;
    this.roleMappings = props.roleMappings;
    this.roles = props.roles;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identityPoolId": this.identityPoolId,
      "roleMappings": this.roleMappings,
      "roles": this.roles
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityPoolRoleAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityPoolRoleAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnIdentityPoolRoleAttachment {
  /**
   * `RoleMapping` is a property of the [AWS::Cognito::IdentityPoolRoleAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html) resource that defines the role-mapping attributes of an Amazon Cognito identity pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html
   */
  export interface RoleMappingProperty {
    /**
     * Specifies the action to be taken if either no rules match the claim value for the Rules type, or there is no `cognito:preferred_role` claim and there are multiple `cognito:roles` matches for the Token type.
     *
     * If you specify Token or Rules as the Type, AmbiguousRoleResolution is required.
     *
     * Valid values are `AuthenticatedRole` or `Deny` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-ambiguousroleresolution
     */
    readonly ambiguousRoleResolution?: string;

    /**
     * Identifier for the identity provider for which the role is mapped.
     *
     * For example: `graph.facebook.com` or `cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id (http://cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id)` . This is the identity provider that is used by the user for authentication.
     *
     * If the identity provider property isn't provided, the key of the entry in the `RoleMappings` map is used as the identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-identityprovider
     */
    readonly identityProvider?: string;

    /**
     * The rules to be used for mapping users to roles.
     *
     * If you specify "Rules" as the role-mapping type, RulesConfiguration is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-rulesconfiguration
     */
    readonly rulesConfiguration?: cdk.IResolvable | CfnIdentityPoolRoleAttachment.RulesConfigurationTypeProperty;

    /**
     * The role-mapping type.
     *
     * `Token` uses `cognito:roles` and `cognito:preferred_role` claims from the Amazon Cognito identity provider token to map groups to roles. `Rules` attempts to match claims from the token to map to a role.
     *
     * Valid values are `Token` or `Rules` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-type
     */
    readonly type: string;
  }

  /**
   * `RulesConfigurationType` is a subproperty of the [RoleMapping](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html) property that defines the rules to be used for mapping users to roles.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html
   */
  export interface RulesConfigurationTypeProperty {
    /**
     * The rules.
     *
     * You can specify up to 25 rules per identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html#cfn-cognito-identitypoolroleattachment-rulesconfigurationtype-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnIdentityPoolRoleAttachment.MappingRuleProperty> | cdk.IResolvable;
  }

  /**
   * Defines how to map a claim to a role ARN.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html
   */
  export interface MappingRuleProperty {
    /**
     * The claim name that must be present in the token.
     *
     * For example: "isAdmin" or "paid".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-claim
     */
    readonly claim: string;

    /**
     * The match condition that specifies how closely the claim value in the IdP token must match `Value` .
     *
     * Valid values are: `Equals` , `Contains` , `StartsWith` , and `NotEqual` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-matchtype
     */
    readonly matchType: string;

    /**
     * The Amazon Resource Name (ARN) of the role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-rolearn
     */
    readonly roleArn: string;

    /**
     * A brief string that the claim must match.
     *
     * For example, "paid" or "yes".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnIdentityPoolRoleAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export interface CfnIdentityPoolRoleAttachmentProps {
  /**
   * An identity pool ID in the format `REGION:GUID` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-identitypoolid
   */
  readonly identityPoolId: string;

  /**
   * How users for a specific identity provider are mapped to roles.
   *
   * This is a string to the `RoleMapping` object map. The string identifies the identity provider. For example: `graph.facebook.com` or `cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id` .
   *
   * If the `IdentityProvider` field isn't provided in this object, the string is used as the identity provider name.
   *
   * For more information, see the [RoleMapping property](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-rolemappings
   */
  readonly roleMappings?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnIdentityPoolRoleAttachment.RoleMappingProperty>;

  /**
   * The map of the roles associated with this pool.
   *
   * For a given role, the key is either "authenticated" or "unauthenticated". The value is the role ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-roles
   */
  readonly roles?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `MappingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MappingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentMappingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("claim", cdk.requiredValidator)(properties.claim));
  errors.collect(cdk.propertyValidator("claim", cdk.validateString)(properties.claim));
  errors.collect(cdk.propertyValidator("matchType", cdk.requiredValidator)(properties.matchType));
  errors.collect(cdk.propertyValidator("matchType", cdk.validateString)(properties.matchType));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MappingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolRoleAttachmentMappingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolRoleAttachmentMappingRulePropertyValidator(properties).assertSuccess();
  return {
    "Claim": cdk.stringToCloudFormation(properties.claim),
    "MatchType": cdk.stringToCloudFormation(properties.matchType),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentMappingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityPoolRoleAttachment.MappingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolRoleAttachment.MappingRuleProperty>();
  ret.addPropertyResult("claim", "Claim", (properties.Claim != null ? cfn_parse.FromCloudFormation.getString(properties.Claim) : undefined));
  ret.addPropertyResult("matchType", "MatchType", (properties.MatchType != null ? cfn_parse.FromCloudFormation.getString(properties.MatchType) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RulesConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `RulesConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnIdentityPoolRoleAttachmentMappingRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"RulesConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnIdentityPoolRoleAttachmentMappingRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityPoolRoleAttachment.RulesConfigurationTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolRoleAttachment.RulesConfigurationTypeProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityPoolRoleAttachmentMappingRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoleMappingProperty`
 *
 * @param properties - the TypeScript properties of a `RoleMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentRoleMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ambiguousRoleResolution", cdk.validateString)(properties.ambiguousRoleResolution));
  errors.collect(cdk.propertyValidator("identityProvider", cdk.validateString)(properties.identityProvider));
  errors.collect(cdk.propertyValidator("rulesConfiguration", CfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyValidator)(properties.rulesConfiguration));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"RoleMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolRoleAttachmentRoleMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolRoleAttachmentRoleMappingPropertyValidator(properties).assertSuccess();
  return {
    "AmbiguousRoleResolution": cdk.stringToCloudFormation(properties.ambiguousRoleResolution),
    "IdentityProvider": cdk.stringToCloudFormation(properties.identityProvider),
    "RulesConfiguration": convertCfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyToCloudFormation(properties.rulesConfiguration),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentRoleMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityPoolRoleAttachment.RoleMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolRoleAttachment.RoleMappingProperty>();
  ret.addPropertyResult("ambiguousRoleResolution", "AmbiguousRoleResolution", (properties.AmbiguousRoleResolution != null ? cfn_parse.FromCloudFormation.getString(properties.AmbiguousRoleResolution) : undefined));
  ret.addPropertyResult("identityProvider", "IdentityProvider", (properties.IdentityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProvider) : undefined));
  ret.addPropertyResult("rulesConfiguration", "RulesConfiguration", (properties.RulesConfiguration != null ? CfnIdentityPoolRoleAttachmentRulesConfigurationTypePropertyFromCloudFormation(properties.RulesConfiguration) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityPoolRoleAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityPoolRoleAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.requiredValidator)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.validateString)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("roleMappings", cdk.hashValidator(CfnIdentityPoolRoleAttachmentRoleMappingPropertyValidator))(properties.roleMappings));
  errors.collect(cdk.propertyValidator("roles", cdk.validateObject)(properties.roles));
  return errors.wrap("supplied properties not correct for \"CfnIdentityPoolRoleAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPoolRoleAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPoolRoleAttachmentPropsValidator(properties).assertSuccess();
  return {
    "IdentityPoolId": cdk.stringToCloudFormation(properties.identityPoolId),
    "RoleMappings": cdk.hashMapper(convertCfnIdentityPoolRoleAttachmentRoleMappingPropertyToCloudFormation)(properties.roleMappings),
    "Roles": cdk.objectToCloudFormation(properties.roles)
  };
}

// @ts-ignore TS6133
function CfnIdentityPoolRoleAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityPoolRoleAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityPoolRoleAttachmentProps>();
  ret.addPropertyResult("identityPoolId", "IdentityPoolId", (properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined));
  ret.addPropertyResult("roleMappings", "RoleMappings", (properties.RoleMappings != null ? cfn_parse.FromCloudFormation.getMap(CfnIdentityPoolRoleAttachmentRoleMappingPropertyFromCloudFormation)(properties.RoleMappings) : undefined));
  ret.addPropertyResult("roles", "Roles", (properties.Roles != null ? cfn_parse.FromCloudFormation.getAny(properties.Roles) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPool` resource creates an Amazon Cognito user pool.
 *
 * For more information on working with Amazon Cognito user pools, see [Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and [CreateUserPool](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPool.html) .
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html
 */
export class CfnUserPool extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPool";

  /**
   * Build a CfnUserPool from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPool {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPool(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the user pool, such as `arn:aws:cognito-idp:us-east-1:123412341234:userpool/us-east-1_123412341` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The provider name of the Amazon Cognito user pool, specified as a `String` .
   *
   * @cloudformationAttribute ProviderName
   */
  public readonly attrProviderName: string;

  /**
   * The URL of the provider of the Amazon Cognito user pool, specified as a `String` .
   *
   * @cloudformationAttribute ProviderURL
   */
  public readonly attrProviderUrl: string;

  /**
   * The ID of the user pool.
   *
   * @cloudformationAttribute UserPoolId
   */
  public readonly attrUserPoolId: string;

  /**
   * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` .
   */
  public accountRecoverySetting?: CfnUserPool.AccountRecoverySettingProperty | cdk.IResolvable;

  /**
   * The configuration for creating a new user profile.
   */
  public adminCreateUserConfig?: CfnUserPool.AdminCreateUserConfigProperty | cdk.IResolvable;

  /**
   * Attributes supported as an alias for this user pool. Possible values: *phone_number* , *email* , or *preferred_username* .
   */
  public aliasAttributes?: Array<string>;

  /**
   * The attributes to be auto-verified.
   */
  public autoVerifiedAttributes?: Array<string>;

  /**
   * When active, `DeletionProtection` prevents accidental deletion of your user pool.
   */
  public deletionProtection?: string;

  /**
   * The device-remembering configuration for a user pool.
   */
  public deviceConfiguration?: CfnUserPool.DeviceConfigurationProperty | cdk.IResolvable;

  /**
   * The email configuration of your user pool.
   */
  public emailConfiguration?: CfnUserPool.EmailConfigurationProperty | cdk.IResolvable;

  /**
   * This parameter is no longer used.
   */
  public emailVerificationMessage?: string;

  /**
   * This parameter is no longer used.
   */
  public emailVerificationSubject?: string;

  /**
   * Enables MFA on a specified user pool.
   */
  public enabledMfas?: Array<string>;

  /**
   * The Lambda trigger configuration information for the new user pool.
   */
  public lambdaConfig?: cdk.IResolvable | CfnUserPool.LambdaConfigProperty;

  /**
   * The multi-factor authentication (MFA) configuration. Valid values include:.
   */
  public mfaConfiguration?: string;

  /**
   * The policy associated with a user pool.
   */
  public policies?: cdk.IResolvable | CfnUserPool.PoliciesProperty;

  /**
   * The schema attributes for the new user pool. These attributes can be standard or custom attributes.
   */
  public schema?: Array<cdk.IResolvable | CfnUserPool.SchemaAttributeProperty> | cdk.IResolvable;

  /**
   * A string representing the SMS authentication message.
   */
  public smsAuthenticationMessage?: string;

  /**
   * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your AWS account through Amazon Simple Notification Service.
   */
  public smsConfiguration?: cdk.IResolvable | CfnUserPool.SmsConfigurationProperty;

  /**
   * This parameter is no longer used.
   */
  public smsVerificationMessage?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The settings for updates to user attributes.
   */
  public userAttributeUpdateSettings?: cdk.IResolvable | CfnUserPool.UserAttributeUpdateSettingsProperty;

  /**
   * Determines whether email addresses or phone numbers can be specified as user names when a user signs up.
   */
  public usernameAttributes?: Array<string>;

  /**
   * You can choose to set case sensitivity on the username input for the selected sign-in option.
   */
  public usernameConfiguration?: cdk.IResolvable | CfnUserPool.UsernameConfigurationProperty;

  /**
   * User pool add-ons.
   */
  public userPoolAddOns?: cdk.IResolvable | CfnUserPool.UserPoolAddOnsProperty;

  /**
   * A string used to name the user pool.
   */
  public userPoolName?: string;

  /**
   * The tag keys and values to assign to the user pool.
   */
  public userPoolTagsRaw?: any;

  /**
   * The template for the verification message that the user sees when the app requests permission to access the user's information.
   */
  public verificationMessageTemplate?: cdk.IResolvable | CfnUserPool.VerificationMessageTemplateProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolProps = {}) {
    super(scope, id, {
      "type": CfnUserPool.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrProviderName = cdk.Token.asString(this.getAtt("ProviderName", cdk.ResolutionTypeHint.STRING));
    this.attrProviderUrl = cdk.Token.asString(this.getAtt("ProviderURL", cdk.ResolutionTypeHint.STRING));
    this.attrUserPoolId = cdk.Token.asString(this.getAtt("UserPoolId", cdk.ResolutionTypeHint.STRING));
    this.accountRecoverySetting = props.accountRecoverySetting;
    this.adminCreateUserConfig = props.adminCreateUserConfig;
    this.aliasAttributes = props.aliasAttributes;
    this.autoVerifiedAttributes = props.autoVerifiedAttributes;
    this.deletionProtection = props.deletionProtection;
    this.deviceConfiguration = props.deviceConfiguration;
    this.emailConfiguration = props.emailConfiguration;
    this.emailVerificationMessage = props.emailVerificationMessage;
    this.emailVerificationSubject = props.emailVerificationSubject;
    this.enabledMfas = props.enabledMfas;
    this.lambdaConfig = props.lambdaConfig;
    this.mfaConfiguration = props.mfaConfiguration;
    this.policies = props.policies;
    this.schema = props.schema;
    this.smsAuthenticationMessage = props.smsAuthenticationMessage;
    this.smsConfiguration = props.smsConfiguration;
    this.smsVerificationMessage = props.smsVerificationMessage;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Cognito::UserPool", props.userPoolTags, {
      "tagPropertyName": "userPoolTags"
    });
    this.userAttributeUpdateSettings = props.userAttributeUpdateSettings;
    this.usernameAttributes = props.usernameAttributes;
    this.usernameConfiguration = props.usernameConfiguration;
    this.userPoolAddOns = props.userPoolAddOns;
    this.userPoolName = props.userPoolName;
    this.userPoolTagsRaw = props.userPoolTags;
    this.verificationMessageTemplate = props.verificationMessageTemplate;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Cognito::UserPool' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountRecoverySetting": this.accountRecoverySetting,
      "adminCreateUserConfig": this.adminCreateUserConfig,
      "aliasAttributes": this.aliasAttributes,
      "autoVerifiedAttributes": this.autoVerifiedAttributes,
      "deletionProtection": this.deletionProtection,
      "deviceConfiguration": this.deviceConfiguration,
      "emailConfiguration": this.emailConfiguration,
      "emailVerificationMessage": this.emailVerificationMessage,
      "emailVerificationSubject": this.emailVerificationSubject,
      "enabledMfas": this.enabledMfas,
      "lambdaConfig": this.lambdaConfig,
      "mfaConfiguration": this.mfaConfiguration,
      "policies": this.policies,
      "schema": this.schema,
      "smsAuthenticationMessage": this.smsAuthenticationMessage,
      "smsConfiguration": this.smsConfiguration,
      "smsVerificationMessage": this.smsVerificationMessage,
      "userPoolTags": this.tags.renderTags(),
      "userAttributeUpdateSettings": this.userAttributeUpdateSettings,
      "usernameAttributes": this.usernameAttributes,
      "usernameConfiguration": this.usernameConfiguration,
      "userPoolAddOns": this.userPoolAddOns,
      "userPoolName": this.userPoolName,
      "verificationMessageTemplate": this.verificationMessageTemplate
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPool.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolPropsToCloudFormation(props);
  }
}

export namespace CfnUserPool {
  /**
   * The policy associated with a user pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html
   */
  export interface PoliciesProperty {
    /**
     * The password policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html#cfn-cognito-userpool-policies-passwordpolicy
     */
    readonly passwordPolicy?: cdk.IResolvable | CfnUserPool.PasswordPolicyProperty;
  }

  /**
   * The password policy type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html
   */
  export interface PasswordPolicyProperty {
    /**
     * The minimum length of the password in the policy that you have set.
     *
     * This value can't be less than 6.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-minimumlength
     */
    readonly minimumLength?: number;

    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one lowercase letter in their password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requirelowercase
     */
    readonly requireLowercase?: boolean | cdk.IResolvable;

    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one number in their password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requirenumbers
     */
    readonly requireNumbers?: boolean | cdk.IResolvable;

    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one symbol in their password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requiresymbols
     */
    readonly requireSymbols?: boolean | cdk.IResolvable;

    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one uppercase letter in their password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requireuppercase
     */
    readonly requireUppercase?: boolean | cdk.IResolvable;

    /**
     * The number of days a temporary password is valid in the password policy.
     *
     * If the user doesn't sign in during this time, an administrator must reset their password. Defaults to `7` . If you submit a value of `0` , Amazon Cognito treats it as a null value and sets `TemporaryPasswordValidityDays` to its default value.
     *
     * > When you set `TemporaryPasswordValidityDays` for a user pool, you can no longer set a value for the legacy `UnusedAccountValidityDays` parameter in that user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-temporarypasswordvaliditydays
     */
    readonly temporaryPasswordValidityDays?: number;
  }

  /**
   * The template for verification messages.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html
   */
  export interface VerificationMessageTemplateProperty {
    /**
     * The default email option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-defaultemailoption
     */
    readonly defaultEmailOption?: string;

    /**
     * The template for email messages that Amazon Cognito sends to your users.
     *
     * You can set an `EmailMessage` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailmessage
     */
    readonly emailMessage?: string;

    /**
     * The email message template for sending a confirmation link to the user.
     *
     * You can set an `EmailMessageByLink` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailmessagebylink
     */
    readonly emailMessageByLink?: string;

    /**
     * The subject line for the email message template.
     *
     * You can set an `EmailSubject` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailsubject
     */
    readonly emailSubject?: string;

    /**
     * The subject line for the email message template for sending a confirmation link to the user.
     *
     * You can set an `EmailSubjectByLink` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailsubjectbylink
     */
    readonly emailSubjectByLink?: string;

    /**
     * The template for SMS messages that Amazon Cognito sends to your users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-smsmessage
     */
    readonly smsMessage?: string;
  }

  /**
   * A list of the user attributes and their properties in your user pool.
   *
   * The attribute schema contains standard attributes, custom attributes with a `custom:` prefix, and developer attributes with a `dev:` prefix. For more information, see [User pool attributes](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html) .
   *
   * Developer-only attributes are a legacy feature of user pools, are read-only to all app clients. You can create and update developer-only attributes only with IAM-authenticated API operations. Use app client read/write permissions instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html
   */
  export interface SchemaAttributeProperty {
    /**
     * The data format of the values for your attribute.
     *
     * When you choose an `AttributeDataType` , Amazon Cognito validates the input against the data type. A custom attribute value in your user's ID token is always a string, for example `"custom:isMember" : "true"` or `"custom:YearsAsMember" : "12"` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-attributedatatype
     */
    readonly attributeDataType?: string;

    /**
     * > We recommend that you use [WriteAttributes](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UserPoolClientType.html#CognitoUserPools-Type-UserPoolClientType-WriteAttributes) in the user pool client to control how attributes can be mutated for new use cases instead of using `DeveloperOnlyAttribute` .
     *
     * Specifies whether the attribute type is developer only. This attribute can only be modified by an administrator. Users will not be able to modify this attribute using their access token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-developeronlyattribute
     */
    readonly developerOnlyAttribute?: boolean | cdk.IResolvable;

    /**
     * Specifies whether the value of the attribute can be changed.
     *
     * Any user pool attribute whose value you map from an IdP attribute must be mutable, with a parameter value of `true` . Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute. For more information, see [Specifying Identity Provider Attribute Mappings for Your User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-mutable
     */
    readonly mutable?: boolean | cdk.IResolvable;

    /**
     * The name of your user pool attribute.
     *
     * When you create or update a user pool, adding a schema attribute creates a custom or developer-only attribute. When you add an attribute with a `Name` value of `MyAttribute` , Amazon Cognito creates the custom attribute `custom:MyAttribute` . When `DeveloperOnlyAttribute` is `true` , Amazon Cognito creates your attribute as `dev:MyAttribute` . In an operation that describes a user pool, Amazon Cognito returns this value as `value` for standard attributes, `custom:value` for custom attributes, and `dev:value` for developer-only attributes..
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-name
     */
    readonly name?: string;

    /**
     * Specifies the constraints for an attribute of the number type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-numberattributeconstraints
     */
    readonly numberAttributeConstraints?: cdk.IResolvable | CfnUserPool.NumberAttributeConstraintsProperty;

    /**
     * Specifies whether a user pool attribute is required.
     *
     * If the attribute is required and the user doesn't provide a value, registration or sign-in will fail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-required
     */
    readonly required?: boolean | cdk.IResolvable;

    /**
     * Specifies the constraints for an attribute of the string type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-stringattributeconstraints
     */
    readonly stringAttributeConstraints?: cdk.IResolvable | CfnUserPool.StringAttributeConstraintsProperty;
  }

  /**
   * The `StringAttributeConstraints` property type defines the string attribute constraints of an Amazon Cognito user pool.
   *
   * `StringAttributeConstraints` is a subproperty of the [SchemaAttribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html
   */
  export interface StringAttributeConstraintsProperty {
    /**
     * The maximum length.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-maxlength
     */
    readonly maxLength?: string;

    /**
     * The minimum length.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-minlength
     */
    readonly minLength?: string;
  }

  /**
   * The minimum and maximum values of an attribute that is of the number data type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html
   */
  export interface NumberAttributeConstraintsProperty {
    /**
     * The maximum value of an attribute that is of the number data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-maxvalue
     */
    readonly maxValue?: string;

    /**
     * The minimum value of an attribute that is of the number data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-minvalue
     */
    readonly minValue?: string;
  }

  /**
   * The configuration for `AdminCreateUser` requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html
   */
  export interface AdminCreateUserConfigProperty {
    /**
     * Set to `True` if only the administrator is allowed to create user profiles.
     *
     * Set to `False` if users can sign themselves up via an app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-allowadmincreateuseronly
     */
    readonly allowAdminCreateUserOnly?: boolean | cdk.IResolvable;

    /**
     * The message template to be used for the welcome message to new users.
     *
     * See also [Customizing User Invitation Messages](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-customizations.html#cognito-user-pool-settings-user-invitation-message-customization) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-invitemessagetemplate
     */
    readonly inviteMessageTemplate?: CfnUserPool.InviteMessageTemplateProperty | cdk.IResolvable;

    /**
     * The user account expiration limit, in days, after which a new account that hasn't signed in is no longer usable.
     *
     * To reset the account after that time limit, you must call `AdminCreateUser` again, specifying `"RESEND"` for the `MessageAction` parameter. The default value for this parameter is 7.
     *
     * > If you set a value for `TemporaryPasswordValidityDays` in `PasswordPolicy` , that value will be used, and `UnusedAccountValidityDays` will be no longer be an available parameter for that user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-unusedaccountvaliditydays
     */
    readonly unusedAccountValidityDays?: number;
  }

  /**
   * The message template to be used for the welcome message to new users.
   *
   * See also [Customizing User Invitation Messages](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-customizations.html#cognito-user-pool-settings-user-invitation-message-customization) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html
   */
  export interface InviteMessageTemplateProperty {
    /**
     * The message template for email messages.
     *
     * EmailMessage is allowed only if [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is DEVELOPER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailmessage
     */
    readonly emailMessage?: string;

    /**
     * The subject line for email messages.
     *
     * EmailSubject is allowed only if [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is DEVELOPER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailsubject
     */
    readonly emailSubject?: string;

    /**
     * The message template for SMS messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-smsmessage
     */
    readonly smsMessage?: string;
  }

  /**
   * The `UsernameConfiguration` property type specifies case sensitivity on the username input for the selected sign-in option.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-usernameconfiguration.html
   */
  export interface UsernameConfigurationProperty {
    /**
     * Specifies whether user name case sensitivity will be applied for all users in the user pool through Amazon Cognito APIs.
     *
     * For most use cases, set case sensitivity to `False` (case insensitive) as a best practice. When usernames and email addresses are case insensitive, users can sign in as the same user when they enter a different capitalization of their user name.
     *
     * Valid values include:
     *
     * - **True** - Enables case sensitivity for all username input. When this option is set to `True` , users must sign in using the exact capitalization of their given username, such as “UserName”. This is the default value.
     * - **False** - Enables case insensitivity for all username input. For example, when this option is set to `False` , users can sign in using `username` , `USERNAME` , or `UserName` . This option also enables both `preferred_username` and `email` alias to be case insensitive, in addition to the `username` attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-usernameconfiguration.html#cfn-cognito-userpool-usernameconfiguration-casesensitive
     */
    readonly caseSensitive?: boolean | cdk.IResolvable;
  }

  /**
   * User pool add-ons.
   *
   * Contains settings for activation of advanced security features. To log user security information but take no action, set to `AUDIT` . To configure automatic security responses to risky traffic to your user pool, set to `ENFORCED` .
   *
   * For more information, see [Adding advanced security to a user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html
   */
  export interface UserPoolAddOnsProperty {
    /**
     * The operating mode of advanced security features in your user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html#cfn-cognito-userpool-userpooladdons-advancedsecuritymode
     */
    readonly advancedSecurityMode?: string;
  }

  /**
   * The settings for updates to user attributes.
   *
   * These settings include the property `AttributesRequireVerificationBeforeUpdate` ,
   * a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For
   * more information, see [Verifying updates to email addresses and phone numbers](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html#user-pool-settings-verifications-verify-attribute-updates) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userattributeupdatesettings.html
   */
  export interface UserAttributeUpdateSettingsProperty {
    /**
     * Requires that your user verifies their email address, phone number, or both before Amazon Cognito updates the value of that attribute.
     *
     * When you update a user attribute that has this option activated, Amazon Cognito sends a verification message to the new phone number or email address. Amazon Cognito doesn’t change the value of the attribute until your user responds to the verification message and confirms the new value.
     *
     * You can verify an updated email address or phone number with a [VerifyUserAttribute](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerifyUserAttribute.html) API request. You can also call the [AdminUpdateUserAttributes](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html) API and set `email_verified` or `phone_number_verified` to true.
     *
     * When `AttributesRequireVerificationBeforeUpdate` is false, your user pool doesn't require that your users verify attribute changes before Amazon Cognito updates them. In a user pool where `AttributesRequireVerificationBeforeUpdate` is false, API operations that change attribute values can immediately update a user’s `email` or `phone_number` attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userattributeupdatesettings.html#cfn-cognito-userpool-userattributeupdatesettings-attributesrequireverificationbeforeupdate
     */
    readonly attributesRequireVerificationBeforeUpdate: Array<string>;
  }

  /**
   * The email configuration of your user pool.
   *
   * The email configuration type sets your preferred sending method, AWS Region, and sender for messages from your user pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html
   */
  export interface EmailConfigurationProperty {
    /**
     * The set of configuration rules that can be applied to emails sent using Amazon SES.
     *
     * A configuration set is applied to an email by including a reference to the configuration set in the headers of the email. Once applied, all of the rules in that configuration set are applied to the email. Configuration sets can be used to apply the following types of rules to emails:
     *
     * - Event publishing – Amazon SES can track the number of send, delivery, open, click, bounce, and complaint events for each email sent. Use event publishing to send information about these events to other AWS services such as SNS and CloudWatch.
     * - IP pool management – When leasing dedicated IP addresses with Amazon SES, you can create groups of IP addresses, called dedicated IP pools. You can then associate the dedicated IP pools with configuration sets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-configurationset
     */
    readonly configurationSet?: string;

    /**
     * Specifies whether Amazon Cognito uses its built-in functionality to send your users email messages, or uses your Amazon Simple Email Service email configuration.
     *
     * Specify one of the following values:
     *
     * - **COGNITO_DEFAULT** - When Amazon Cognito emails your users, it uses its built-in email functionality. When you use the default option, Amazon Cognito allows only a limited number of emails each day for your user pool. For typical production environments, the default email limit is less than the required delivery volume. To achieve a higher delivery volume, specify DEVELOPER to use your Amazon SES email configuration.
     *
     * To look up the email delivery limit for the default option, see [Limits](https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html) in the *Amazon Cognito Developer Guide* .
     *
     * The default FROM address is `no-reply@verificationemail.com` . To customize the FROM address, provide the Amazon Resource Name (ARN) of an Amazon SES verified email address for the `SourceArn` parameter.
     * - **DEVELOPER** - When Amazon Cognito emails your users, it uses your Amazon SES configuration. Amazon Cognito calls Amazon SES on your behalf to send email from your verified email address. When you use this option, the email delivery limits are the same limits that apply to your Amazon SES verified email address in your AWS account .
     *
     * If you use this option, provide the ARN of an Amazon SES verified email address for the `SourceArn` parameter.
     *
     * Before Amazon Cognito can email your users, it requires additional permissions to call Amazon SES on your behalf. When you update your user pool with this option, Amazon Cognito creates a *service-linked role* , which is a type of role in your AWS account . This role contains the permissions that allow you to access Amazon SES and send email messages from your email address. For more information about the service-linked role that Amazon Cognito creates, see [Using Service-Linked Roles for Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/using-service-linked-roles.html) in the *Amazon Cognito Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-emailsendingaccount
     */
    readonly emailSendingAccount?: string;

    /**
     * Identifies either the sender's email address or the sender's name with their email address.
     *
     * For example, `testuser@example.com` or `Test User <testuser@example.com>` . This address appears before the body of the email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-from
     */
    readonly from?: string;

    /**
     * The destination to which the receiver of the email should reply.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-replytoemailaddress
     */
    readonly replyToEmailAddress?: string;

    /**
     * The ARN of a verified email address or an address from a verified domain in Amazon SES.
     *
     * You can set a `SourceArn` email from a verified domain only with an API request. You can set a verified email address, but not an address in a verified domain, in the Amazon Cognito console. Amazon Cognito uses the email address that you provide in one of the following ways, depending on the value that you specify for the `EmailSendingAccount` parameter:
     *
     * - If you specify `COGNITO_DEFAULT` , Amazon Cognito uses this address as the custom FROM address when it emails your users using its built-in email account.
     * - If you specify `DEVELOPER` , Amazon Cognito emails your users with this address by calling Amazon SES on your behalf.
     *
     * The Region value of the `SourceArn` parameter must indicate a supported AWS Region of your user pool. Typically, the Region in the `SourceArn` and the user pool Region are the same. For more information, see [Amazon SES email configuration regions](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html#user-pool-email-developer-region-mapping) in the [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-sourcearn
     */
    readonly sourceArn?: string;
  }

  /**
   * The SMS configuration type that includes the settings the Cognito User Pool needs to call for the Amazon SNS service to send an SMS message from your AWS account .
   *
   * The Cognito User Pool makes the request to the Amazon SNS Service by using an IAM role that you provide for your AWS account .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html
   */
  export interface SmsConfigurationProperty {
    /**
     * The external ID is a value.
     *
     * We recommend you use `ExternalId` to add security to your IAM role, which is used to call Amazon SNS to send SMS messages for your user pool. If you provide an `ExternalId` , the Cognito User Pool uses it when attempting to assume your IAM role. You can also set your roles trust policy to require the `ExternalID` . If you use the Cognito Management Console to create a role for SMS MFA, Cognito creates a role with the required permissions and a trust policy that uses `ExternalId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-externalid
     */
    readonly externalId?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS caller.
     *
     * This is the ARN of the IAM role in your AWS account that Amazon Cognito will use to send SMS messages. SMS messages are subject to a [spending limit](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snscallerarn
     */
    readonly snsCallerArn?: string;

    /**
     * The AWS Region to use with Amazon SNS integration.
     *
     * You can choose the same Region as your user pool, or a supported *Legacy Amazon SNS alternate Region* .
     *
     * Amazon Cognito resources in the Asia Pacific (Seoul) AWS Region must use your Amazon SNS configuration in the Asia Pacific (Tokyo) Region. For more information, see [SMS message settings for Amazon Cognito user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-sms-settings.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snsregion
     */
    readonly snsRegion?: string;
  }

  /**
   * Specifies the configuration for AWS Lambda triggers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html
   */
  export interface LambdaConfigProperty {
    /**
     * Creates an authentication challenge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-createauthchallenge
     */
    readonly createAuthChallenge?: string;

    /**
     * A custom email sender AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-customemailsender
     */
    readonly customEmailSender?: CfnUserPool.CustomEmailSenderProperty | cdk.IResolvable;

    /**
     * A custom Message AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-custommessage
     */
    readonly customMessage?: string;

    /**
     * A custom SMS sender AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-customsmssender
     */
    readonly customSmsSender?: CfnUserPool.CustomSMSSenderProperty | cdk.IResolvable;

    /**
     * Defines the authentication challenge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-defineauthchallenge
     */
    readonly defineAuthChallenge?: string;

    /**
     * The Amazon Resource Name of a AWS Key Management Service ( AWS KMS ) key.
     *
     * Amazon Cognito uses the key to encrypt codes and temporary passwords sent to `CustomEmailSender` and `CustomSMSSender` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * A post-authentication AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postauthentication
     */
    readonly postAuthentication?: string;

    /**
     * A post-confirmation AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postconfirmation
     */
    readonly postConfirmation?: string;

    /**
     * A pre-authentication AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-preauthentication
     */
    readonly preAuthentication?: string;

    /**
     * A pre-registration AWS Lambda trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-presignup
     */
    readonly preSignUp?: string;

    /**
     * The Amazon Resource Name (ARN) of the function that you want to assign to your Lambda trigger.
     *
     * Set this parameter for legacy purposes. If you also set an ARN in `PreTokenGenerationConfig` , its value must be identical to `PreTokenGeneration` . For new instances of pre token generation triggers, set the `LambdaArn` of `PreTokenGenerationConfig` .
     *
     * You can set ``
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-pretokengeneration
     */
    readonly preTokenGeneration?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-pretokengenerationconfig
     */
    readonly preTokenGenerationConfig?: cdk.IResolvable | CfnUserPool.PreTokenGenerationConfigProperty;

    /**
     * The user migration Lambda config type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-usermigration
     */
    readonly userMigration?: string;

    /**
     * Verifies the authentication challenge response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-verifyauthchallengeresponse
     */
    readonly verifyAuthChallengeResponse?: string;
  }

  /**
   * A custom SMS sender AWS Lambda trigger.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html
   */
  export interface CustomSMSSenderProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Cognito triggers to send SMS notifications to users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html#cfn-cognito-userpool-customsmssender-lambdaarn
     */
    readonly lambdaArn?: string;

    /**
     * The Lambda version represents the signature of the "request" attribute in the "event" information Amazon Cognito passes to your custom SMS sender Lambda function.
     *
     * The only supported value is `V1_0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html#cfn-cognito-userpool-customsmssender-lambdaversion
     */
    readonly lambdaVersion?: string;
  }

  /**
   * A custom email sender AWS Lambda trigger.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html
   */
  export interface CustomEmailSenderProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Cognito triggers to send email notifications to users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html#cfn-cognito-userpool-customemailsender-lambdaarn
     */
    readonly lambdaArn?: string;

    /**
     * The Lambda version represents the signature of the "request" attribute in the "event" information that Amazon Cognito passes to your custom email sender AWS Lambda function.
     *
     * The only supported value is `V1_0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html#cfn-cognito-userpool-customemailsender-lambdaversion
     */
    readonly lambdaVersion?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-pretokengenerationconfig.html
   */
  export interface PreTokenGenerationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-pretokengenerationconfig.html#cfn-cognito-userpool-pretokengenerationconfig-lambdaarn
     */
    readonly lambdaArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-pretokengenerationconfig.html#cfn-cognito-userpool-pretokengenerationconfig-lambdaversion
     */
    readonly lambdaVersion?: string;
  }

  /**
   * The device-remembering configuration for a user pool.
   *
   * A [DescribeUserPool](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_DescribeUserPool.html) request returns a null value for this object when the user pool isn't configured to remember devices. When device remembering is active, you can remember a user's device with a [ConfirmDevice](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmDevice.html) API request. Additionally. when the property `DeviceOnlyRememberedOnUserPrompt` is `true` , you must follow `ConfirmDevice` with an [UpdateDeviceStatus](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UpdateDeviceStatus.html) API request that sets the user's device to `remembered` or `not_remembered` .
   *
   * To sign in with a remembered device, include `DEVICE_KEY` in the authentication parameters in your user's [InitiateAuth](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html) request. If your app doesn't include a `DEVICE_KEY` parameter, the [response](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_ResponseSyntax) from Amazon Cognito includes newly-generated `DEVICE_KEY` and `DEVICE_GROUP_KEY` values under `NewDeviceMetadata` . Store these values to use in future device-authentication requests.
   *
   * > When you provide a value for any property of `DeviceConfiguration` , you activate the device remembering for the user pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html
   */
  export interface DeviceConfigurationProperty {
    /**
     * When true, a remembered device can sign in with device authentication instead of SMS and time-based one-time password (TOTP) factors for multi-factor authentication (MFA).
     *
     * > Whether or not `ChallengeRequiredOnNewDevice` is true, users who sign in with devices that have not been confirmed or remembered must still provide a second factor in a user pool that requires MFA.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-challengerequiredonnewdevice
     */
    readonly challengeRequiredOnNewDevice?: boolean | cdk.IResolvable;

    /**
     * When true, Amazon Cognito doesn't automatically remember a user's device when your app sends a [ConfirmDevice](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmDevice.html) API request. In your app, create a prompt for your user to choose whether they want to remember their device. Return the user's choice in an [UpdateDeviceStatus](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UpdateDeviceStatus.html) API request.
     *
     * When `DeviceOnlyRememberedOnUserPrompt` is `false` , Amazon Cognito immediately remembers devices that you register in a `ConfirmDevice` API request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-deviceonlyrememberedonuserprompt
     */
    readonly deviceOnlyRememberedOnUserPrompt?: boolean | cdk.IResolvable;
  }

  /**
   * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` .
   *
   * It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-accountrecoverysetting.html
   */
  export interface AccountRecoverySettingProperty {
    /**
     * The list of `RecoveryOptionTypes` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-accountrecoverysetting.html#cfn-cognito-userpool-accountrecoverysetting-recoverymechanisms
     */
    readonly recoveryMechanisms?: Array<cdk.IResolvable | CfnUserPool.RecoveryOptionProperty> | cdk.IResolvable;
  }

  /**
   * A map containing a priority as a key, and recovery method name as a value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html
   */
  export interface RecoveryOptionProperty {
    /**
     * Specifies the recovery method for a user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html#cfn-cognito-userpool-recoveryoption-name
     */
    readonly name?: string;

    /**
     * A positive integer specifying priority of a method with 1 being the highest priority.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html#cfn-cognito-userpool-recoveryoption-priority
     */
    readonly priority?: number;
  }
}

/**
 * Properties for defining a `CfnUserPool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html
 */
export interface CfnUserPoolProps {
  /**
   * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` .
   *
   * It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-accountrecoverysetting
   */
  readonly accountRecoverySetting?: CfnUserPool.AccountRecoverySettingProperty | cdk.IResolvable;

  /**
   * The configuration for creating a new user profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-admincreateuserconfig
   */
  readonly adminCreateUserConfig?: CfnUserPool.AdminCreateUserConfigProperty | cdk.IResolvable;

  /**
   * Attributes supported as an alias for this user pool. Possible values: *phone_number* , *email* , or *preferred_username* .
   *
   * > This user pool property cannot be updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-aliasattributes
   */
  readonly aliasAttributes?: Array<string>;

  /**
   * The attributes to be auto-verified.
   *
   * Possible values: *email* , *phone_number* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-autoverifiedattributes
   */
  readonly autoVerifiedAttributes?: Array<string>;

  /**
   * When active, `DeletionProtection` prevents accidental deletion of your user pool.
   *
   * Before you can delete a user pool that you have protected against deletion, you must deactivate this feature.
   *
   * When you try to delete a protected user pool in a `DeleteUserPool` API request, Amazon Cognito returns an `InvalidParameterException` error. To delete a protected user pool, send a new `DeleteUserPool` request after you deactivate deletion protection in an `UpdateUserPool` API request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deletionprotection
   */
  readonly deletionProtection?: string;

  /**
   * The device-remembering configuration for a user pool.
   *
   * A null value indicates that you have deactivated device remembering in your user pool.
   *
   * > When you provide a value for any `DeviceConfiguration` field, you activate the Amazon Cognito device-remembering feature.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deviceconfiguration
   */
  readonly deviceConfiguration?: CfnUserPool.DeviceConfigurationProperty | cdk.IResolvable;

  /**
   * The email configuration of your user pool.
   *
   * The email configuration type sets your preferred sending method, AWS Region, and sender for messages from your user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailconfiguration
   */
  readonly emailConfiguration?: CfnUserPool.EmailConfigurationProperty | cdk.IResolvable;

  /**
   * This parameter is no longer used.
   *
   * See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationmessage
   */
  readonly emailVerificationMessage?: string;

  /**
   * This parameter is no longer used.
   *
   * See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationsubject
   */
  readonly emailVerificationSubject?: string;

  /**
   * Enables MFA on a specified user pool.
   *
   * To disable all MFAs after it has been enabled, set MfaConfiguration to “OFF” and remove EnabledMfas. MFAs can only be all disabled if MfaConfiguration is OFF. Once SMS_MFA is enabled, SMS_MFA can only be disabled by setting MfaConfiguration to “OFF”. Can be one of the following values:
   *
   * - `SMS_MFA` - Enables SMS MFA for the user pool. SMS_MFA can only be enabled if SMS configuration is provided.
   * - `SOFTWARE_TOKEN_MFA` - Enables software token MFA for the user pool.
   *
   * Allowed values: `SMS_MFA` | `SOFTWARE_TOKEN_MFA`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-enabledmfas
   */
  readonly enabledMfas?: Array<string>;

  /**
   * The Lambda trigger configuration information for the new user pool.
   *
   * > In a push model, event sources (such as Amazon S3 and custom applications) need permission to invoke a function. So you must make an extra call to add permission for these event sources to invoke your Lambda function.
   * >
   * > For more information on using the Lambda API to add permission, see [AddPermission](https://docs.aws.amazon.com/lambda/latest/dg/API_AddPermission.html) .
   * >
   * > For adding permission using the AWS CLI , see [add-permission](https://docs.aws.amazon.com/cli/latest/reference/lambda/add-permission.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-lambdaconfig
   */
  readonly lambdaConfig?: cdk.IResolvable | CfnUserPool.LambdaConfigProperty;

  /**
   * The multi-factor authentication (MFA) configuration. Valid values include:.
   *
   * - `OFF` MFA won't be used for any users.
   * - `ON` MFA is required for all users to sign in.
   * - `OPTIONAL` MFA will be required only for individual users who have an MFA factor activated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-mfaconfiguration
   */
  readonly mfaConfiguration?: string;

  /**
   * The policy associated with a user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-policies
   */
  readonly policies?: cdk.IResolvable | CfnUserPool.PoliciesProperty;

  /**
   * The schema attributes for the new user pool. These attributes can be standard or custom attributes.
   *
   * > During a user pool update, you can add new schema attributes but you cannot modify or delete an existing schema attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-schema
   */
  readonly schema?: Array<cdk.IResolvable | CfnUserPool.SchemaAttributeProperty> | cdk.IResolvable;

  /**
   * A string representing the SMS authentication message.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsauthenticationmessage
   */
  readonly smsAuthenticationMessage?: string;

  /**
   * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your AWS account through Amazon Simple Notification Service.
   *
   * To send SMS messages with Amazon SNS in the AWS Region that you want, the Amazon Cognito user pool uses an AWS Identity and Access Management (IAM) role in your AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsconfiguration
   */
  readonly smsConfiguration?: cdk.IResolvable | CfnUserPool.SmsConfigurationProperty;

  /**
   * This parameter is no longer used.
   *
   * See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsverificationmessage
   */
  readonly smsVerificationMessage?: string;

  /**
   * The settings for updates to user attributes.
   *
   * These settings include the property `AttributesRequireVerificationBeforeUpdate` ,
   * a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For
   * more information, see [Verifying updates to email addresses and phone numbers](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html#user-pool-settings-verifications-verify-attribute-updates) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userattributeupdatesettings
   */
  readonly userAttributeUpdateSettings?: cdk.IResolvable | CfnUserPool.UserAttributeUpdateSettingsProperty;

  /**
   * Determines whether email addresses or phone numbers can be specified as user names when a user signs up.
   *
   * Possible values: `phone_number` or `email` .
   *
   * This user pool property cannot be updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameattributes
   */
  readonly usernameAttributes?: Array<string>;

  /**
   * You can choose to set case sensitivity on the username input for the selected sign-in option.
   *
   * For example, when this is set to `False` , users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameconfiguration
   */
  readonly usernameConfiguration?: cdk.IResolvable | CfnUserPool.UsernameConfigurationProperty;

  /**
   * User pool add-ons.
   *
   * Contains settings for activation of advanced security features. To log user security information but take no action, set to `AUDIT` . To configure automatic security responses to risky traffic to your user pool, set to `ENFORCED` .
   *
   * For more information, see [Adding advanced security to a user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooladdons
   */
  readonly userPoolAddOns?: cdk.IResolvable | CfnUserPool.UserPoolAddOnsProperty;

  /**
   * A string used to name the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpoolname
   */
  readonly userPoolName?: string;

  /**
   * The tag keys and values to assign to the user pool.
   *
   * A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooltags
   */
  readonly userPoolTags?: any;

  /**
   * The template for the verification message that the user sees when the app requests permission to access the user's information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-verificationmessagetemplate
   */
  readonly verificationMessageTemplate?: cdk.IResolvable | CfnUserPool.VerificationMessageTemplateProperty;
}

/**
 * Determine whether the given properties match those of a `PasswordPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `PasswordPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolPasswordPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("minimumLength", cdk.validateNumber)(properties.minimumLength));
  errors.collect(cdk.propertyValidator("requireLowercase", cdk.validateBoolean)(properties.requireLowercase));
  errors.collect(cdk.propertyValidator("requireNumbers", cdk.validateBoolean)(properties.requireNumbers));
  errors.collect(cdk.propertyValidator("requireSymbols", cdk.validateBoolean)(properties.requireSymbols));
  errors.collect(cdk.propertyValidator("requireUppercase", cdk.validateBoolean)(properties.requireUppercase));
  errors.collect(cdk.propertyValidator("temporaryPasswordValidityDays", cdk.validateNumber)(properties.temporaryPasswordValidityDays));
  return errors.wrap("supplied properties not correct for \"PasswordPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolPasswordPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolPasswordPolicyPropertyValidator(properties).assertSuccess();
  return {
    "MinimumLength": cdk.numberToCloudFormation(properties.minimumLength),
    "RequireLowercase": cdk.booleanToCloudFormation(properties.requireLowercase),
    "RequireNumbers": cdk.booleanToCloudFormation(properties.requireNumbers),
    "RequireSymbols": cdk.booleanToCloudFormation(properties.requireSymbols),
    "RequireUppercase": cdk.booleanToCloudFormation(properties.requireUppercase),
    "TemporaryPasswordValidityDays": cdk.numberToCloudFormation(properties.temporaryPasswordValidityDays)
  };
}

// @ts-ignore TS6133
function CfnUserPoolPasswordPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.PasswordPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.PasswordPolicyProperty>();
  ret.addPropertyResult("minimumLength", "MinimumLength", (properties.MinimumLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumLength) : undefined));
  ret.addPropertyResult("requireLowercase", "RequireLowercase", (properties.RequireLowercase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireLowercase) : undefined));
  ret.addPropertyResult("requireNumbers", "RequireNumbers", (properties.RequireNumbers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireNumbers) : undefined));
  ret.addPropertyResult("requireSymbols", "RequireSymbols", (properties.RequireSymbols != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireSymbols) : undefined));
  ret.addPropertyResult("requireUppercase", "RequireUppercase", (properties.RequireUppercase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireUppercase) : undefined));
  ret.addPropertyResult("temporaryPasswordValidityDays", "TemporaryPasswordValidityDays", (properties.TemporaryPasswordValidityDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.TemporaryPasswordValidityDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `PoliciesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("passwordPolicy", CfnUserPoolPasswordPolicyPropertyValidator)(properties.passwordPolicy));
  return errors.wrap("supplied properties not correct for \"PoliciesProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolPoliciesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolPoliciesPropertyValidator(properties).assertSuccess();
  return {
    "PasswordPolicy": convertCfnUserPoolPasswordPolicyPropertyToCloudFormation(properties.passwordPolicy)
  };
}

// @ts-ignore TS6133
function CfnUserPoolPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.PoliciesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.PoliciesProperty>();
  ret.addPropertyResult("passwordPolicy", "PasswordPolicy", (properties.PasswordPolicy != null ? CfnUserPoolPasswordPolicyPropertyFromCloudFormation(properties.PasswordPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VerificationMessageTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `VerificationMessageTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolVerificationMessageTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultEmailOption", cdk.validateString)(properties.defaultEmailOption));
  errors.collect(cdk.propertyValidator("emailMessage", cdk.validateString)(properties.emailMessage));
  errors.collect(cdk.propertyValidator("emailMessageByLink", cdk.validateString)(properties.emailMessageByLink));
  errors.collect(cdk.propertyValidator("emailSubject", cdk.validateString)(properties.emailSubject));
  errors.collect(cdk.propertyValidator("emailSubjectByLink", cdk.validateString)(properties.emailSubjectByLink));
  errors.collect(cdk.propertyValidator("smsMessage", cdk.validateString)(properties.smsMessage));
  return errors.wrap("supplied properties not correct for \"VerificationMessageTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolVerificationMessageTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolVerificationMessageTemplatePropertyValidator(properties).assertSuccess();
  return {
    "DefaultEmailOption": cdk.stringToCloudFormation(properties.defaultEmailOption),
    "EmailMessage": cdk.stringToCloudFormation(properties.emailMessage),
    "EmailMessageByLink": cdk.stringToCloudFormation(properties.emailMessageByLink),
    "EmailSubject": cdk.stringToCloudFormation(properties.emailSubject),
    "EmailSubjectByLink": cdk.stringToCloudFormation(properties.emailSubjectByLink),
    "SmsMessage": cdk.stringToCloudFormation(properties.smsMessage)
  };
}

// @ts-ignore TS6133
function CfnUserPoolVerificationMessageTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.VerificationMessageTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.VerificationMessageTemplateProperty>();
  ret.addPropertyResult("defaultEmailOption", "DefaultEmailOption", (properties.DefaultEmailOption != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultEmailOption) : undefined));
  ret.addPropertyResult("emailMessage", "EmailMessage", (properties.EmailMessage != null ? cfn_parse.FromCloudFormation.getString(properties.EmailMessage) : undefined));
  ret.addPropertyResult("emailMessageByLink", "EmailMessageByLink", (properties.EmailMessageByLink != null ? cfn_parse.FromCloudFormation.getString(properties.EmailMessageByLink) : undefined));
  ret.addPropertyResult("emailSubject", "EmailSubject", (properties.EmailSubject != null ? cfn_parse.FromCloudFormation.getString(properties.EmailSubject) : undefined));
  ret.addPropertyResult("emailSubjectByLink", "EmailSubjectByLink", (properties.EmailSubjectByLink != null ? cfn_parse.FromCloudFormation.getString(properties.EmailSubjectByLink) : undefined));
  ret.addPropertyResult("smsMessage", "SmsMessage", (properties.SmsMessage != null ? cfn_parse.FromCloudFormation.getString(properties.SmsMessage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StringAttributeConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `StringAttributeConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolStringAttributeConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxLength", cdk.validateString)(properties.maxLength));
  errors.collect(cdk.propertyValidator("minLength", cdk.validateString)(properties.minLength));
  return errors.wrap("supplied properties not correct for \"StringAttributeConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolStringAttributeConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolStringAttributeConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "MaxLength": cdk.stringToCloudFormation(properties.maxLength),
    "MinLength": cdk.stringToCloudFormation(properties.minLength)
  };
}

// @ts-ignore TS6133
function CfnUserPoolStringAttributeConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.StringAttributeConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.StringAttributeConstraintsProperty>();
  ret.addPropertyResult("maxLength", "MaxLength", (properties.MaxLength != null ? cfn_parse.FromCloudFormation.getString(properties.MaxLength) : undefined));
  ret.addPropertyResult("minLength", "MinLength", (properties.MinLength != null ? cfn_parse.FromCloudFormation.getString(properties.MinLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NumberAttributeConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `NumberAttributeConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolNumberAttributeConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateString)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateString)(properties.minValue));
  return errors.wrap("supplied properties not correct for \"NumberAttributeConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolNumberAttributeConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolNumberAttributeConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "MaxValue": cdk.stringToCloudFormation(properties.maxValue),
    "MinValue": cdk.stringToCloudFormation(properties.minValue)
  };
}

// @ts-ignore TS6133
function CfnUserPoolNumberAttributeConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.NumberAttributeConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.NumberAttributeConstraintsProperty>();
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getString(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getString(properties.MinValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolSchemaAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeDataType", cdk.validateString)(properties.attributeDataType));
  errors.collect(cdk.propertyValidator("developerOnlyAttribute", cdk.validateBoolean)(properties.developerOnlyAttribute));
  errors.collect(cdk.propertyValidator("mutable", cdk.validateBoolean)(properties.mutable));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("numberAttributeConstraints", CfnUserPoolNumberAttributeConstraintsPropertyValidator)(properties.numberAttributeConstraints));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  errors.collect(cdk.propertyValidator("stringAttributeConstraints", CfnUserPoolStringAttributeConstraintsPropertyValidator)(properties.stringAttributeConstraints));
  return errors.wrap("supplied properties not correct for \"SchemaAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolSchemaAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolSchemaAttributePropertyValidator(properties).assertSuccess();
  return {
    "AttributeDataType": cdk.stringToCloudFormation(properties.attributeDataType),
    "DeveloperOnlyAttribute": cdk.booleanToCloudFormation(properties.developerOnlyAttribute),
    "Mutable": cdk.booleanToCloudFormation(properties.mutable),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NumberAttributeConstraints": convertCfnUserPoolNumberAttributeConstraintsPropertyToCloudFormation(properties.numberAttributeConstraints),
    "Required": cdk.booleanToCloudFormation(properties.required),
    "StringAttributeConstraints": convertCfnUserPoolStringAttributeConstraintsPropertyToCloudFormation(properties.stringAttributeConstraints)
  };
}

// @ts-ignore TS6133
function CfnUserPoolSchemaAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.SchemaAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.SchemaAttributeProperty>();
  ret.addPropertyResult("attributeDataType", "AttributeDataType", (properties.AttributeDataType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeDataType) : undefined));
  ret.addPropertyResult("developerOnlyAttribute", "DeveloperOnlyAttribute", (properties.DeveloperOnlyAttribute != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeveloperOnlyAttribute) : undefined));
  ret.addPropertyResult("mutable", "Mutable", (properties.Mutable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Mutable) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("numberAttributeConstraints", "NumberAttributeConstraints", (properties.NumberAttributeConstraints != null ? CfnUserPoolNumberAttributeConstraintsPropertyFromCloudFormation(properties.NumberAttributeConstraints) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addPropertyResult("stringAttributeConstraints", "StringAttributeConstraints", (properties.StringAttributeConstraints != null ? CfnUserPoolStringAttributeConstraintsPropertyFromCloudFormation(properties.StringAttributeConstraints) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InviteMessageTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `InviteMessageTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolInviteMessageTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emailMessage", cdk.validateString)(properties.emailMessage));
  errors.collect(cdk.propertyValidator("emailSubject", cdk.validateString)(properties.emailSubject));
  errors.collect(cdk.propertyValidator("smsMessage", cdk.validateString)(properties.smsMessage));
  return errors.wrap("supplied properties not correct for \"InviteMessageTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolInviteMessageTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolInviteMessageTemplatePropertyValidator(properties).assertSuccess();
  return {
    "EmailMessage": cdk.stringToCloudFormation(properties.emailMessage),
    "EmailSubject": cdk.stringToCloudFormation(properties.emailSubject),
    "SMSMessage": cdk.stringToCloudFormation(properties.smsMessage)
  };
}

// @ts-ignore TS6133
function CfnUserPoolInviteMessageTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.InviteMessageTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.InviteMessageTemplateProperty>();
  ret.addPropertyResult("emailMessage", "EmailMessage", (properties.EmailMessage != null ? cfn_parse.FromCloudFormation.getString(properties.EmailMessage) : undefined));
  ret.addPropertyResult("emailSubject", "EmailSubject", (properties.EmailSubject != null ? cfn_parse.FromCloudFormation.getString(properties.EmailSubject) : undefined));
  ret.addPropertyResult("smsMessage", "SMSMessage", (properties.SMSMessage != null ? cfn_parse.FromCloudFormation.getString(properties.SMSMessage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdminCreateUserConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AdminCreateUserConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolAdminCreateUserConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowAdminCreateUserOnly", cdk.validateBoolean)(properties.allowAdminCreateUserOnly));
  errors.collect(cdk.propertyValidator("inviteMessageTemplate", CfnUserPoolInviteMessageTemplatePropertyValidator)(properties.inviteMessageTemplate));
  errors.collect(cdk.propertyValidator("unusedAccountValidityDays", cdk.validateNumber)(properties.unusedAccountValidityDays));
  return errors.wrap("supplied properties not correct for \"AdminCreateUserConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolAdminCreateUserConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolAdminCreateUserConfigPropertyValidator(properties).assertSuccess();
  return {
    "AllowAdminCreateUserOnly": cdk.booleanToCloudFormation(properties.allowAdminCreateUserOnly),
    "InviteMessageTemplate": convertCfnUserPoolInviteMessageTemplatePropertyToCloudFormation(properties.inviteMessageTemplate),
    "UnusedAccountValidityDays": cdk.numberToCloudFormation(properties.unusedAccountValidityDays)
  };
}

// @ts-ignore TS6133
function CfnUserPoolAdminCreateUserConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.AdminCreateUserConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.AdminCreateUserConfigProperty>();
  ret.addPropertyResult("allowAdminCreateUserOnly", "AllowAdminCreateUserOnly", (properties.AllowAdminCreateUserOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowAdminCreateUserOnly) : undefined));
  ret.addPropertyResult("inviteMessageTemplate", "InviteMessageTemplate", (properties.InviteMessageTemplate != null ? CfnUserPoolInviteMessageTemplatePropertyFromCloudFormation(properties.InviteMessageTemplate) : undefined));
  ret.addPropertyResult("unusedAccountValidityDays", "UnusedAccountValidityDays", (properties.UnusedAccountValidityDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnusedAccountValidityDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UsernameConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `UsernameConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUsernameConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caseSensitive", cdk.validateBoolean)(properties.caseSensitive));
  return errors.wrap("supplied properties not correct for \"UsernameConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUsernameConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUsernameConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CaseSensitive": cdk.booleanToCloudFormation(properties.caseSensitive)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUsernameConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.UsernameConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.UsernameConfigurationProperty>();
  ret.addPropertyResult("caseSensitive", "CaseSensitive", (properties.CaseSensitive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaseSensitive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserPoolAddOnsProperty`
 *
 * @param properties - the TypeScript properties of a `UserPoolAddOnsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUserPoolAddOnsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("advancedSecurityMode", cdk.validateString)(properties.advancedSecurityMode));
  return errors.wrap("supplied properties not correct for \"UserPoolAddOnsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUserPoolAddOnsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUserPoolAddOnsPropertyValidator(properties).assertSuccess();
  return {
    "AdvancedSecurityMode": cdk.stringToCloudFormation(properties.advancedSecurityMode)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUserPoolAddOnsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.UserPoolAddOnsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.UserPoolAddOnsProperty>();
  ret.addPropertyResult("advancedSecurityMode", "AdvancedSecurityMode", (properties.AdvancedSecurityMode != null ? cfn_parse.FromCloudFormation.getString(properties.AdvancedSecurityMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserAttributeUpdateSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `UserAttributeUpdateSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUserAttributeUpdateSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributesRequireVerificationBeforeUpdate", cdk.requiredValidator)(properties.attributesRequireVerificationBeforeUpdate));
  errors.collect(cdk.propertyValidator("attributesRequireVerificationBeforeUpdate", cdk.listValidator(cdk.validateString))(properties.attributesRequireVerificationBeforeUpdate));
  return errors.wrap("supplied properties not correct for \"UserAttributeUpdateSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUserAttributeUpdateSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUserAttributeUpdateSettingsPropertyValidator(properties).assertSuccess();
  return {
    "AttributesRequireVerificationBeforeUpdate": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributesRequireVerificationBeforeUpdate)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUserAttributeUpdateSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.UserAttributeUpdateSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.UserAttributeUpdateSettingsProperty>();
  ret.addPropertyResult("attributesRequireVerificationBeforeUpdate", "AttributesRequireVerificationBeforeUpdate", (properties.AttributesRequireVerificationBeforeUpdate != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AttributesRequireVerificationBeforeUpdate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EmailConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EmailConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolEmailConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationSet", cdk.validateString)(properties.configurationSet));
  errors.collect(cdk.propertyValidator("emailSendingAccount", cdk.validateString)(properties.emailSendingAccount));
  errors.collect(cdk.propertyValidator("from", cdk.validateString)(properties.from));
  errors.collect(cdk.propertyValidator("replyToEmailAddress", cdk.validateString)(properties.replyToEmailAddress));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  return errors.wrap("supplied properties not correct for \"EmailConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolEmailConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolEmailConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ConfigurationSet": cdk.stringToCloudFormation(properties.configurationSet),
    "EmailSendingAccount": cdk.stringToCloudFormation(properties.emailSendingAccount),
    "From": cdk.stringToCloudFormation(properties.from),
    "ReplyToEmailAddress": cdk.stringToCloudFormation(properties.replyToEmailAddress),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn)
  };
}

// @ts-ignore TS6133
function CfnUserPoolEmailConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.EmailConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.EmailConfigurationProperty>();
  ret.addPropertyResult("configurationSet", "ConfigurationSet", (properties.ConfigurationSet != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSet) : undefined));
  ret.addPropertyResult("emailSendingAccount", "EmailSendingAccount", (properties.EmailSendingAccount != null ? cfn_parse.FromCloudFormation.getString(properties.EmailSendingAccount) : undefined));
  ret.addPropertyResult("from", "From", (properties.From != null ? cfn_parse.FromCloudFormation.getString(properties.From) : undefined));
  ret.addPropertyResult("replyToEmailAddress", "ReplyToEmailAddress", (properties.ReplyToEmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.ReplyToEmailAddress) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SmsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SmsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolSmsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("externalId", cdk.validateString)(properties.externalId));
  errors.collect(cdk.propertyValidator("snsCallerArn", cdk.validateString)(properties.snsCallerArn));
  errors.collect(cdk.propertyValidator("snsRegion", cdk.validateString)(properties.snsRegion));
  return errors.wrap("supplied properties not correct for \"SmsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolSmsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolSmsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ExternalId": cdk.stringToCloudFormation(properties.externalId),
    "SnsCallerArn": cdk.stringToCloudFormation(properties.snsCallerArn),
    "SnsRegion": cdk.stringToCloudFormation(properties.snsRegion)
  };
}

// @ts-ignore TS6133
function CfnUserPoolSmsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.SmsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.SmsConfigurationProperty>();
  ret.addPropertyResult("externalId", "ExternalId", (properties.ExternalId != null ? cfn_parse.FromCloudFormation.getString(properties.ExternalId) : undefined));
  ret.addPropertyResult("snsCallerArn", "SnsCallerArn", (properties.SnsCallerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsCallerArn) : undefined));
  ret.addPropertyResult("snsRegion", "SnsRegion", (properties.SnsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SnsRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomSMSSenderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomSMSSenderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolCustomSMSSenderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaVersion", cdk.validateString)(properties.lambdaVersion));
  return errors.wrap("supplied properties not correct for \"CustomSMSSenderProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolCustomSMSSenderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolCustomSMSSenderPropertyValidator(properties).assertSuccess();
  return {
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn),
    "LambdaVersion": cdk.stringToCloudFormation(properties.lambdaVersion)
  };
}

// @ts-ignore TS6133
function CfnUserPoolCustomSMSSenderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.CustomSMSSenderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.CustomSMSSenderProperty>();
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addPropertyResult("lambdaVersion", "LambdaVersion", (properties.LambdaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomEmailSenderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomEmailSenderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolCustomEmailSenderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaVersion", cdk.validateString)(properties.lambdaVersion));
  return errors.wrap("supplied properties not correct for \"CustomEmailSenderProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolCustomEmailSenderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolCustomEmailSenderPropertyValidator(properties).assertSuccess();
  return {
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn),
    "LambdaVersion": cdk.stringToCloudFormation(properties.lambdaVersion)
  };
}

// @ts-ignore TS6133
function CfnUserPoolCustomEmailSenderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.CustomEmailSenderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.CustomEmailSenderProperty>();
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addPropertyResult("lambdaVersion", "LambdaVersion", (properties.LambdaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PreTokenGenerationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PreTokenGenerationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolPreTokenGenerationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaVersion", cdk.validateString)(properties.lambdaVersion));
  return errors.wrap("supplied properties not correct for \"PreTokenGenerationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolPreTokenGenerationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolPreTokenGenerationConfigPropertyValidator(properties).assertSuccess();
  return {
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn),
    "LambdaVersion": cdk.stringToCloudFormation(properties.lambdaVersion)
  };
}

// @ts-ignore TS6133
function CfnUserPoolPreTokenGenerationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.PreTokenGenerationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.PreTokenGenerationConfigProperty>();
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addPropertyResult("lambdaVersion", "LambdaVersion", (properties.LambdaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolLambdaConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createAuthChallenge", cdk.validateString)(properties.createAuthChallenge));
  errors.collect(cdk.propertyValidator("customEmailSender", CfnUserPoolCustomEmailSenderPropertyValidator)(properties.customEmailSender));
  errors.collect(cdk.propertyValidator("customMessage", cdk.validateString)(properties.customMessage));
  errors.collect(cdk.propertyValidator("customSmsSender", CfnUserPoolCustomSMSSenderPropertyValidator)(properties.customSmsSender));
  errors.collect(cdk.propertyValidator("defineAuthChallenge", cdk.validateString)(properties.defineAuthChallenge));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("postAuthentication", cdk.validateString)(properties.postAuthentication));
  errors.collect(cdk.propertyValidator("postConfirmation", cdk.validateString)(properties.postConfirmation));
  errors.collect(cdk.propertyValidator("preAuthentication", cdk.validateString)(properties.preAuthentication));
  errors.collect(cdk.propertyValidator("preSignUp", cdk.validateString)(properties.preSignUp));
  errors.collect(cdk.propertyValidator("preTokenGeneration", cdk.validateString)(properties.preTokenGeneration));
  errors.collect(cdk.propertyValidator("preTokenGenerationConfig", CfnUserPoolPreTokenGenerationConfigPropertyValidator)(properties.preTokenGenerationConfig));
  errors.collect(cdk.propertyValidator("userMigration", cdk.validateString)(properties.userMigration));
  errors.collect(cdk.propertyValidator("verifyAuthChallengeResponse", cdk.validateString)(properties.verifyAuthChallengeResponse));
  return errors.wrap("supplied properties not correct for \"LambdaConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolLambdaConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolLambdaConfigPropertyValidator(properties).assertSuccess();
  return {
    "CreateAuthChallenge": cdk.stringToCloudFormation(properties.createAuthChallenge),
    "CustomEmailSender": convertCfnUserPoolCustomEmailSenderPropertyToCloudFormation(properties.customEmailSender),
    "CustomMessage": cdk.stringToCloudFormation(properties.customMessage),
    "CustomSMSSender": convertCfnUserPoolCustomSMSSenderPropertyToCloudFormation(properties.customSmsSender),
    "DefineAuthChallenge": cdk.stringToCloudFormation(properties.defineAuthChallenge),
    "KMSKeyID": cdk.stringToCloudFormation(properties.kmsKeyId),
    "PostAuthentication": cdk.stringToCloudFormation(properties.postAuthentication),
    "PostConfirmation": cdk.stringToCloudFormation(properties.postConfirmation),
    "PreAuthentication": cdk.stringToCloudFormation(properties.preAuthentication),
    "PreSignUp": cdk.stringToCloudFormation(properties.preSignUp),
    "PreTokenGeneration": cdk.stringToCloudFormation(properties.preTokenGeneration),
    "PreTokenGenerationConfig": convertCfnUserPoolPreTokenGenerationConfigPropertyToCloudFormation(properties.preTokenGenerationConfig),
    "UserMigration": cdk.stringToCloudFormation(properties.userMigration),
    "VerifyAuthChallengeResponse": cdk.stringToCloudFormation(properties.verifyAuthChallengeResponse)
  };
}

// @ts-ignore TS6133
function CfnUserPoolLambdaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.LambdaConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.LambdaConfigProperty>();
  ret.addPropertyResult("createAuthChallenge", "CreateAuthChallenge", (properties.CreateAuthChallenge != null ? cfn_parse.FromCloudFormation.getString(properties.CreateAuthChallenge) : undefined));
  ret.addPropertyResult("customEmailSender", "CustomEmailSender", (properties.CustomEmailSender != null ? CfnUserPoolCustomEmailSenderPropertyFromCloudFormation(properties.CustomEmailSender) : undefined));
  ret.addPropertyResult("customMessage", "CustomMessage", (properties.CustomMessage != null ? cfn_parse.FromCloudFormation.getString(properties.CustomMessage) : undefined));
  ret.addPropertyResult("customSmsSender", "CustomSMSSender", (properties.CustomSMSSender != null ? CfnUserPoolCustomSMSSenderPropertyFromCloudFormation(properties.CustomSMSSender) : undefined));
  ret.addPropertyResult("defineAuthChallenge", "DefineAuthChallenge", (properties.DefineAuthChallenge != null ? cfn_parse.FromCloudFormation.getString(properties.DefineAuthChallenge) : undefined));
  ret.addPropertyResult("kmsKeyId", "KMSKeyID", (properties.KMSKeyID != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyID) : undefined));
  ret.addPropertyResult("postAuthentication", "PostAuthentication", (properties.PostAuthentication != null ? cfn_parse.FromCloudFormation.getString(properties.PostAuthentication) : undefined));
  ret.addPropertyResult("postConfirmation", "PostConfirmation", (properties.PostConfirmation != null ? cfn_parse.FromCloudFormation.getString(properties.PostConfirmation) : undefined));
  ret.addPropertyResult("preAuthentication", "PreAuthentication", (properties.PreAuthentication != null ? cfn_parse.FromCloudFormation.getString(properties.PreAuthentication) : undefined));
  ret.addPropertyResult("preSignUp", "PreSignUp", (properties.PreSignUp != null ? cfn_parse.FromCloudFormation.getString(properties.PreSignUp) : undefined));
  ret.addPropertyResult("preTokenGeneration", "PreTokenGeneration", (properties.PreTokenGeneration != null ? cfn_parse.FromCloudFormation.getString(properties.PreTokenGeneration) : undefined));
  ret.addPropertyResult("preTokenGenerationConfig", "PreTokenGenerationConfig", (properties.PreTokenGenerationConfig != null ? CfnUserPoolPreTokenGenerationConfigPropertyFromCloudFormation(properties.PreTokenGenerationConfig) : undefined));
  ret.addPropertyResult("userMigration", "UserMigration", (properties.UserMigration != null ? cfn_parse.FromCloudFormation.getString(properties.UserMigration) : undefined));
  ret.addPropertyResult("verifyAuthChallengeResponse", "VerifyAuthChallengeResponse", (properties.VerifyAuthChallengeResponse != null ? cfn_parse.FromCloudFormation.getString(properties.VerifyAuthChallengeResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolDeviceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("challengeRequiredOnNewDevice", cdk.validateBoolean)(properties.challengeRequiredOnNewDevice));
  errors.collect(cdk.propertyValidator("deviceOnlyRememberedOnUserPrompt", cdk.validateBoolean)(properties.deviceOnlyRememberedOnUserPrompt));
  return errors.wrap("supplied properties not correct for \"DeviceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolDeviceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolDeviceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ChallengeRequiredOnNewDevice": cdk.booleanToCloudFormation(properties.challengeRequiredOnNewDevice),
    "DeviceOnlyRememberedOnUserPrompt": cdk.booleanToCloudFormation(properties.deviceOnlyRememberedOnUserPrompt)
  };
}

// @ts-ignore TS6133
function CfnUserPoolDeviceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.DeviceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.DeviceConfigurationProperty>();
  ret.addPropertyResult("challengeRequiredOnNewDevice", "ChallengeRequiredOnNewDevice", (properties.ChallengeRequiredOnNewDevice != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ChallengeRequiredOnNewDevice) : undefined));
  ret.addPropertyResult("deviceOnlyRememberedOnUserPrompt", "DeviceOnlyRememberedOnUserPrompt", (properties.DeviceOnlyRememberedOnUserPrompt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeviceOnlyRememberedOnUserPrompt) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecoveryOptionProperty`
 *
 * @param properties - the TypeScript properties of a `RecoveryOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRecoveryOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  return errors.wrap("supplied properties not correct for \"RecoveryOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRecoveryOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRecoveryOptionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Priority": cdk.numberToCloudFormation(properties.priority)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRecoveryOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPool.RecoveryOptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.RecoveryOptionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountRecoverySettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccountRecoverySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolAccountRecoverySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recoveryMechanisms", cdk.listValidator(CfnUserPoolRecoveryOptionPropertyValidator))(properties.recoveryMechanisms));
  return errors.wrap("supplied properties not correct for \"AccountRecoverySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolAccountRecoverySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolAccountRecoverySettingPropertyValidator(properties).assertSuccess();
  return {
    "RecoveryMechanisms": cdk.listMapper(convertCfnUserPoolRecoveryOptionPropertyToCloudFormation)(properties.recoveryMechanisms)
  };
}

// @ts-ignore TS6133
function CfnUserPoolAccountRecoverySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPool.AccountRecoverySettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPool.AccountRecoverySettingProperty>();
  ret.addPropertyResult("recoveryMechanisms", "RecoveryMechanisms", (properties.RecoveryMechanisms != null ? cfn_parse.FromCloudFormation.getArray(CfnUserPoolRecoveryOptionPropertyFromCloudFormation)(properties.RecoveryMechanisms) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountRecoverySetting", CfnUserPoolAccountRecoverySettingPropertyValidator)(properties.accountRecoverySetting));
  errors.collect(cdk.propertyValidator("adminCreateUserConfig", CfnUserPoolAdminCreateUserConfigPropertyValidator)(properties.adminCreateUserConfig));
  errors.collect(cdk.propertyValidator("aliasAttributes", cdk.listValidator(cdk.validateString))(properties.aliasAttributes));
  errors.collect(cdk.propertyValidator("autoVerifiedAttributes", cdk.listValidator(cdk.validateString))(properties.autoVerifiedAttributes));
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateString)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("deviceConfiguration", CfnUserPoolDeviceConfigurationPropertyValidator)(properties.deviceConfiguration));
  errors.collect(cdk.propertyValidator("emailConfiguration", CfnUserPoolEmailConfigurationPropertyValidator)(properties.emailConfiguration));
  errors.collect(cdk.propertyValidator("emailVerificationMessage", cdk.validateString)(properties.emailVerificationMessage));
  errors.collect(cdk.propertyValidator("emailVerificationSubject", cdk.validateString)(properties.emailVerificationSubject));
  errors.collect(cdk.propertyValidator("enabledMfas", cdk.listValidator(cdk.validateString))(properties.enabledMfas));
  errors.collect(cdk.propertyValidator("lambdaConfig", CfnUserPoolLambdaConfigPropertyValidator)(properties.lambdaConfig));
  errors.collect(cdk.propertyValidator("mfaConfiguration", cdk.validateString)(properties.mfaConfiguration));
  errors.collect(cdk.propertyValidator("policies", CfnUserPoolPoliciesPropertyValidator)(properties.policies));
  errors.collect(cdk.propertyValidator("schema", cdk.listValidator(CfnUserPoolSchemaAttributePropertyValidator))(properties.schema));
  errors.collect(cdk.propertyValidator("smsAuthenticationMessage", cdk.validateString)(properties.smsAuthenticationMessage));
  errors.collect(cdk.propertyValidator("smsConfiguration", CfnUserPoolSmsConfigurationPropertyValidator)(properties.smsConfiguration));
  errors.collect(cdk.propertyValidator("smsVerificationMessage", cdk.validateString)(properties.smsVerificationMessage));
  errors.collect(cdk.propertyValidator("userAttributeUpdateSettings", CfnUserPoolUserAttributeUpdateSettingsPropertyValidator)(properties.userAttributeUpdateSettings));
  errors.collect(cdk.propertyValidator("userPoolAddOns", CfnUserPoolUserPoolAddOnsPropertyValidator)(properties.userPoolAddOns));
  errors.collect(cdk.propertyValidator("userPoolName", cdk.validateString)(properties.userPoolName));
  errors.collect(cdk.propertyValidator("userPoolTags", cdk.validateObject)(properties.userPoolTags));
  errors.collect(cdk.propertyValidator("usernameAttributes", cdk.listValidator(cdk.validateString))(properties.usernameAttributes));
  errors.collect(cdk.propertyValidator("usernameConfiguration", CfnUserPoolUsernameConfigurationPropertyValidator)(properties.usernameConfiguration));
  errors.collect(cdk.propertyValidator("verificationMessageTemplate", CfnUserPoolVerificationMessageTemplatePropertyValidator)(properties.verificationMessageTemplate));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolPropsValidator(properties).assertSuccess();
  return {
    "AccountRecoverySetting": convertCfnUserPoolAccountRecoverySettingPropertyToCloudFormation(properties.accountRecoverySetting),
    "AdminCreateUserConfig": convertCfnUserPoolAdminCreateUserConfigPropertyToCloudFormation(properties.adminCreateUserConfig),
    "AliasAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.aliasAttributes),
    "AutoVerifiedAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.autoVerifiedAttributes),
    "DeletionProtection": cdk.stringToCloudFormation(properties.deletionProtection),
    "DeviceConfiguration": convertCfnUserPoolDeviceConfigurationPropertyToCloudFormation(properties.deviceConfiguration),
    "EmailConfiguration": convertCfnUserPoolEmailConfigurationPropertyToCloudFormation(properties.emailConfiguration),
    "EmailVerificationMessage": cdk.stringToCloudFormation(properties.emailVerificationMessage),
    "EmailVerificationSubject": cdk.stringToCloudFormation(properties.emailVerificationSubject),
    "EnabledMfas": cdk.listMapper(cdk.stringToCloudFormation)(properties.enabledMfas),
    "LambdaConfig": convertCfnUserPoolLambdaConfigPropertyToCloudFormation(properties.lambdaConfig),
    "MfaConfiguration": cdk.stringToCloudFormation(properties.mfaConfiguration),
    "Policies": convertCfnUserPoolPoliciesPropertyToCloudFormation(properties.policies),
    "Schema": cdk.listMapper(convertCfnUserPoolSchemaAttributePropertyToCloudFormation)(properties.schema),
    "SmsAuthenticationMessage": cdk.stringToCloudFormation(properties.smsAuthenticationMessage),
    "SmsConfiguration": convertCfnUserPoolSmsConfigurationPropertyToCloudFormation(properties.smsConfiguration),
    "SmsVerificationMessage": cdk.stringToCloudFormation(properties.smsVerificationMessage),
    "UserAttributeUpdateSettings": convertCfnUserPoolUserAttributeUpdateSettingsPropertyToCloudFormation(properties.userAttributeUpdateSettings),
    "UserPoolAddOns": convertCfnUserPoolUserPoolAddOnsPropertyToCloudFormation(properties.userPoolAddOns),
    "UserPoolName": cdk.stringToCloudFormation(properties.userPoolName),
    "UserPoolTags": cdk.objectToCloudFormation(properties.userPoolTags),
    "UsernameAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.usernameAttributes),
    "UsernameConfiguration": convertCfnUserPoolUsernameConfigurationPropertyToCloudFormation(properties.usernameConfiguration),
    "VerificationMessageTemplate": convertCfnUserPoolVerificationMessageTemplatePropertyToCloudFormation(properties.verificationMessageTemplate)
  };
}

// @ts-ignore TS6133
function CfnUserPoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolProps>();
  ret.addPropertyResult("accountRecoverySetting", "AccountRecoverySetting", (properties.AccountRecoverySetting != null ? CfnUserPoolAccountRecoverySettingPropertyFromCloudFormation(properties.AccountRecoverySetting) : undefined));
  ret.addPropertyResult("adminCreateUserConfig", "AdminCreateUserConfig", (properties.AdminCreateUserConfig != null ? CfnUserPoolAdminCreateUserConfigPropertyFromCloudFormation(properties.AdminCreateUserConfig) : undefined));
  ret.addPropertyResult("aliasAttributes", "AliasAttributes", (properties.AliasAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AliasAttributes) : undefined));
  ret.addPropertyResult("autoVerifiedAttributes", "AutoVerifiedAttributes", (properties.AutoVerifiedAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AutoVerifiedAttributes) : undefined));
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getString(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("deviceConfiguration", "DeviceConfiguration", (properties.DeviceConfiguration != null ? CfnUserPoolDeviceConfigurationPropertyFromCloudFormation(properties.DeviceConfiguration) : undefined));
  ret.addPropertyResult("emailConfiguration", "EmailConfiguration", (properties.EmailConfiguration != null ? CfnUserPoolEmailConfigurationPropertyFromCloudFormation(properties.EmailConfiguration) : undefined));
  ret.addPropertyResult("emailVerificationMessage", "EmailVerificationMessage", (properties.EmailVerificationMessage != null ? cfn_parse.FromCloudFormation.getString(properties.EmailVerificationMessage) : undefined));
  ret.addPropertyResult("emailVerificationSubject", "EmailVerificationSubject", (properties.EmailVerificationSubject != null ? cfn_parse.FromCloudFormation.getString(properties.EmailVerificationSubject) : undefined));
  ret.addPropertyResult("enabledMfas", "EnabledMfas", (properties.EnabledMfas != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EnabledMfas) : undefined));
  ret.addPropertyResult("lambdaConfig", "LambdaConfig", (properties.LambdaConfig != null ? CfnUserPoolLambdaConfigPropertyFromCloudFormation(properties.LambdaConfig) : undefined));
  ret.addPropertyResult("mfaConfiguration", "MfaConfiguration", (properties.MfaConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.MfaConfiguration) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? CfnUserPoolPoliciesPropertyFromCloudFormation(properties.Policies) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getArray(CfnUserPoolSchemaAttributePropertyFromCloudFormation)(properties.Schema) : undefined));
  ret.addPropertyResult("smsAuthenticationMessage", "SmsAuthenticationMessage", (properties.SmsAuthenticationMessage != null ? cfn_parse.FromCloudFormation.getString(properties.SmsAuthenticationMessage) : undefined));
  ret.addPropertyResult("smsConfiguration", "SmsConfiguration", (properties.SmsConfiguration != null ? CfnUserPoolSmsConfigurationPropertyFromCloudFormation(properties.SmsConfiguration) : undefined));
  ret.addPropertyResult("smsVerificationMessage", "SmsVerificationMessage", (properties.SmsVerificationMessage != null ? cfn_parse.FromCloudFormation.getString(properties.SmsVerificationMessage) : undefined));
  ret.addPropertyResult("userAttributeUpdateSettings", "UserAttributeUpdateSettings", (properties.UserAttributeUpdateSettings != null ? CfnUserPoolUserAttributeUpdateSettingsPropertyFromCloudFormation(properties.UserAttributeUpdateSettings) : undefined));
  ret.addPropertyResult("usernameAttributes", "UsernameAttributes", (properties.UsernameAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UsernameAttributes) : undefined));
  ret.addPropertyResult("usernameConfiguration", "UsernameConfiguration", (properties.UsernameConfiguration != null ? CfnUserPoolUsernameConfigurationPropertyFromCloudFormation(properties.UsernameConfiguration) : undefined));
  ret.addPropertyResult("userPoolAddOns", "UserPoolAddOns", (properties.UserPoolAddOns != null ? CfnUserPoolUserPoolAddOnsPropertyFromCloudFormation(properties.UserPoolAddOns) : undefined));
  ret.addPropertyResult("userPoolName", "UserPoolName", (properties.UserPoolName != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolName) : undefined));
  ret.addPropertyResult("userPoolTags", "UserPoolTags", (properties.UserPoolTags != null ? cfn_parse.FromCloudFormation.getAny(properties.UserPoolTags) : undefined));
  ret.addPropertyResult("verificationMessageTemplate", "VerificationMessageTemplate", (properties.VerificationMessageTemplate != null ? CfnUserPoolVerificationMessageTemplatePropertyFromCloudFormation(properties.VerificationMessageTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolClient` resource specifies an Amazon Cognito user pool client.
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPoolClient
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html
 */
export class CfnUserPoolClient extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolClient";

  /**
   * Build a CfnUserPoolClient from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolClient {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolClientPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolClient(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute ClientId
   */
  public readonly attrClientId: string;

  /**
   * @cloudformationAttribute ClientSecret
   */
  public readonly attrClientSecret: string;

  /**
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The access token time limit.
   */
  public accessTokenValidity?: number;

  /**
   * The OAuth grant types that you want your app client to generate.
   */
  public allowedOAuthFlows?: Array<string>;

  /**
   * Set to `true` to use OAuth 2.0 features in your user pool app client.
   */
  public allowedOAuthFlowsUserPoolClient?: boolean | cdk.IResolvable;

  /**
   * The allowed OAuth scopes.
   */
  public allowedOAuthScopes?: Array<string>;

  /**
   * The user pool analytics configuration for collecting metrics and sending them to your Amazon Pinpoint campaign.
   */
  public analyticsConfiguration?: CfnUserPoolClient.AnalyticsConfigurationProperty | cdk.IResolvable;

  /**
   * Amazon Cognito creates a session token for each API request in an authentication flow.
   */
  public authSessionValidity?: number;

  /**
   * A list of allowed redirect (callback) URLs for the IdPs.
   */
  public callbackUrLs?: Array<string>;

  /**
   * The client name for the user pool client you would like to create.
   */
  public clientName?: string;

  /**
   * The default redirect URI. Must be in the `CallbackURLs` list.
   */
  public defaultRedirectUri?: string;

  /**
   * Activates the propagation of additional user context data.
   */
  public enablePropagateAdditionalUserContextData?: boolean | cdk.IResolvable;

  /**
   * Activates or deactivates token revocation. For more information about revoking tokens, see [RevokeToken](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RevokeToken.html) .
   */
  public enableTokenRevocation?: boolean | cdk.IResolvable;

  /**
   * The authentication flows that you want your user pool client to support.
   */
  public explicitAuthFlows?: Array<string>;

  /**
   * Boolean to specify whether you want to generate a secret for the user pool client being created.
   */
  public generateSecret?: boolean | cdk.IResolvable;

  /**
   * The ID token time limit.
   */
  public idTokenValidity?: number;

  /**
   * A list of allowed logout URLs for the IdPs.
   */
  public logoutUrLs?: Array<string>;

  /**
   * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool.
   */
  public preventUserExistenceErrors?: string;

  /**
   * The list of user attributes that you want your app client to have read-only access to.
   */
  public readAttributes?: Array<string>;

  /**
   * The refresh token time limit.
   */
  public refreshTokenValidity?: number;

  /**
   * A list of provider names for the identity providers (IdPs) that are supported on this client.
   */
  public supportedIdentityProviders?: Array<string>;

  /**
   * The units in which the validity times are represented.
   */
  public tokenValidityUnits?: cdk.IResolvable | CfnUserPoolClient.TokenValidityUnitsProperty;

  /**
   * The user pool ID for the user pool where you want to create a user pool client.
   */
  public userPoolId: string;

  /**
   * The list of user attributes that you want your app client to have write access to.
   */
  public writeAttributes?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolClientProps) {
    super(scope, id, {
      "type": CfnUserPoolClient.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userPoolId", this);

    this.attrClientId = cdk.Token.asString(this.getAtt("ClientId", cdk.ResolutionTypeHint.STRING));
    this.attrClientSecret = cdk.Token.asString(this.getAtt("ClientSecret", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.accessTokenValidity = props.accessTokenValidity;
    this.allowedOAuthFlows = props.allowedOAuthFlows;
    this.allowedOAuthFlowsUserPoolClient = props.allowedOAuthFlowsUserPoolClient;
    this.allowedOAuthScopes = props.allowedOAuthScopes;
    this.analyticsConfiguration = props.analyticsConfiguration;
    this.authSessionValidity = props.authSessionValidity;
    this.callbackUrLs = props.callbackUrLs;
    this.clientName = props.clientName;
    this.defaultRedirectUri = props.defaultRedirectUri;
    this.enablePropagateAdditionalUserContextData = props.enablePropagateAdditionalUserContextData;
    this.enableTokenRevocation = props.enableTokenRevocation;
    this.explicitAuthFlows = props.explicitAuthFlows;
    this.generateSecret = props.generateSecret;
    this.idTokenValidity = props.idTokenValidity;
    this.logoutUrLs = props.logoutUrLs;
    this.preventUserExistenceErrors = props.preventUserExistenceErrors;
    this.readAttributes = props.readAttributes;
    this.refreshTokenValidity = props.refreshTokenValidity;
    this.supportedIdentityProviders = props.supportedIdentityProviders;
    this.tokenValidityUnits = props.tokenValidityUnits;
    this.userPoolId = props.userPoolId;
    this.writeAttributes = props.writeAttributes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessTokenValidity": this.accessTokenValidity,
      "allowedOAuthFlows": this.allowedOAuthFlows,
      "allowedOAuthFlowsUserPoolClient": this.allowedOAuthFlowsUserPoolClient,
      "allowedOAuthScopes": this.allowedOAuthScopes,
      "analyticsConfiguration": this.analyticsConfiguration,
      "authSessionValidity": this.authSessionValidity,
      "callbackUrLs": this.callbackUrLs,
      "clientName": this.clientName,
      "defaultRedirectUri": this.defaultRedirectUri,
      "enablePropagateAdditionalUserContextData": this.enablePropagateAdditionalUserContextData,
      "enableTokenRevocation": this.enableTokenRevocation,
      "explicitAuthFlows": this.explicitAuthFlows,
      "generateSecret": this.generateSecret,
      "idTokenValidity": this.idTokenValidity,
      "logoutUrLs": this.logoutUrLs,
      "preventUserExistenceErrors": this.preventUserExistenceErrors,
      "readAttributes": this.readAttributes,
      "refreshTokenValidity": this.refreshTokenValidity,
      "supportedIdentityProviders": this.supportedIdentityProviders,
      "tokenValidityUnits": this.tokenValidityUnits,
      "userPoolId": this.userPoolId,
      "writeAttributes": this.writeAttributes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolClient.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolClientPropsToCloudFormation(props);
  }
}

export namespace CfnUserPoolClient {
  /**
   * The Amazon Pinpoint analytics configuration necessary to collect metrics for a user pool.
   *
   * > In Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html
   */
  export interface AnalyticsConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of an Amazon Pinpoint project.
     *
     * You can use the Amazon Pinpoint project for integration with the chosen user pool client. Amazon Cognito publishes events to the Amazon Pinpoint project that the app ARN declares.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-applicationarn
     */
    readonly applicationArn?: string;

    /**
     * The application ID for an Amazon Pinpoint application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-applicationid
     */
    readonly applicationId?: string;

    /**
     * The external ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-externalid
     */
    readonly externalId?: string;

    /**
     * The ARN of an AWS Identity and Access Management role that authorizes Amazon Cognito to publish events to Amazon Pinpoint analytics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-rolearn
     */
    readonly roleArn?: string;

    /**
     * If `UserDataShared` is `true` , Amazon Cognito includes user data in the events that it publishes to Amazon Pinpoint analytics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-userdatashared
     */
    readonly userDataShared?: boolean | cdk.IResolvable;
  }

  /**
   * The time units you use when you set the duration of ID, access, and refresh tokens.
   *
   * The default unit for RefreshToken is days, and the default for ID and access tokens is hours.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html
   */
  export interface TokenValidityUnitsProperty {
    /**
     * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `AccessTokenValidity` parameter.
     *
     * The default `AccessTokenValidity` time unit is hours. `AccessTokenValidity` duration can range from five minutes to one day.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-accesstoken
     */
    readonly accessToken?: string;

    /**
     * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `IdTokenValidity` parameter.
     *
     * The default `IdTokenValidity` time unit is hours. `IdTokenValidity` duration can range from five minutes to one day.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-idtoken
     */
    readonly idToken?: string;

    /**
     * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `RefreshTokenValidity` parameter.
     *
     * The default `RefreshTokenValidity` time unit is days. `RefreshTokenValidity` duration can range from 60 minutes to 10 years.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-refreshtoken
     */
    readonly refreshToken?: string;
  }
}

/**
 * Properties for defining a `CfnUserPoolClient`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html
 */
export interface CfnUserPoolClientProps {
  /**
   * The access token time limit.
   *
   * After this limit expires, your user can't use their access token. To specify the time unit for `AccessTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
   *
   * For example, when you set `AccessTokenValidity` to `10` and `TokenValidityUnits` to `hours` , your user can authorize access with their access token for 10 hours.
   *
   * The default time unit for `AccessTokenValidity` in an API request is hours.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-accesstokenvalidity
   */
  readonly accessTokenValidity?: number;

  /**
   * The OAuth grant types that you want your app client to generate.
   *
   * To create an app client that generates client credentials grants, you must add `client_credentials` as the only allowed OAuth flow.
   *
   * - **code** - Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the `/oauth2/token` endpoint.
   * - **implicit** - Issue the access token (and, optionally, ID token, based on scopes) directly to your user.
   * - **client_credentials** - Issue the access token from the `/oauth2/token` endpoint directly to a non-person user using a combination of the client ID and client secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflows
   */
  readonly allowedOAuthFlows?: Array<string>;

  /**
   * Set to `true` to use OAuth 2.0 features in your user pool app client.
   *
   * `AllowedOAuthFlowsUserPoolClient` must be `true` before you can configure the following features in your app client.
   *
   * - `CallBackURLs` : Callback URLs.
   * - `LogoutURLs` : Sign-out redirect URLs.
   * - `AllowedOAuthScopes` : OAuth 2.0 scopes.
   * - `AllowedOAuthFlows` : Support for authorization code, implicit, and client credentials OAuth 2.0 grants.
   *
   * To use OAuth 2.0 features, configure one of these features in the Amazon Cognito console or set `AllowedOAuthFlowsUserPoolClient` to `true` in a `CreateUserPoolClient` or `UpdateUserPoolClient` API request. If you don't set a value for `AllowedOAuthFlowsUserPoolClient` in a request with the AWS CLI or SDKs, it defaults to `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflowsuserpoolclient
   */
  readonly allowedOAuthFlowsUserPoolClient?: boolean | cdk.IResolvable;

  /**
   * The allowed OAuth scopes.
   *
   * Possible values provided by OAuth are `phone` , `email` , `openid` , and `profile` . Possible values provided by AWS are `aws.cognito.signin.user.admin` . Custom scopes created in Resource Servers are also supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthscopes
   */
  readonly allowedOAuthScopes?: Array<string>;

  /**
   * The user pool analytics configuration for collecting metrics and sending them to your Amazon Pinpoint campaign.
   *
   * > In AWS Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in AWS Region us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-analyticsconfiguration
   */
  readonly analyticsConfiguration?: CfnUserPoolClient.AnalyticsConfigurationProperty | cdk.IResolvable;

  /**
   * Amazon Cognito creates a session token for each API request in an authentication flow.
   *
   * `AuthSessionValidity` is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-authsessionvalidity
   */
  readonly authSessionValidity?: number;

  /**
   * A list of allowed redirect (callback) URLs for the IdPs.
   *
   * A redirect URI must:
   *
   * - Be an absolute URI.
   * - Be registered with the authorization server.
   * - Not include a fragment component.
   *
   * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
   *
   * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
   *
   * App callback URLs such as myapp://example are also supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-callbackurls
   */
  readonly callbackUrLs?: Array<string>;

  /**
   * The client name for the user pool client you would like to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-clientname
   */
  readonly clientName?: string;

  /**
   * The default redirect URI. Must be in the `CallbackURLs` list.
   *
   * A redirect URI must:
   *
   * - Be an absolute URI.
   * - Be registered with the authorization server.
   * - Not include a fragment component.
   *
   * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
   *
   * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
   *
   * App callback URLs such as myapp://example are also supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-defaultredirecturi
   */
  readonly defaultRedirectUri?: string;

  /**
   * Activates the propagation of additional user context data.
   *
   * For more information about propagation of user context data, see [Adding advanced security to a user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html) . If you don’t include this parameter, you can't send device fingerprint information, including source IP address, to Amazon Cognito advanced security. You can only activate `EnablePropagateAdditionalUserContextData` in an app client that has a client secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enablepropagateadditionalusercontextdata
   */
  readonly enablePropagateAdditionalUserContextData?: boolean | cdk.IResolvable;

  /**
   * Activates or deactivates token revocation. For more information about revoking tokens, see [RevokeToken](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RevokeToken.html) .
   *
   * If you don't include this parameter, token revocation is automatically activated for the new user pool client.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enabletokenrevocation
   */
  readonly enableTokenRevocation?: boolean | cdk.IResolvable;

  /**
   * The authentication flows that you want your user pool client to support.
   *
   * For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.
   *
   * > If you don't specify a value for `ExplicitAuthFlows` , your user client supports `ALLOW_REFRESH_TOKEN_AUTH` , `ALLOW_USER_SRP_AUTH` , and `ALLOW_CUSTOM_AUTH` .
   *
   * Valid values include:
   *
   * - `ALLOW_ADMIN_USER_PASSWORD_AUTH` : Enable admin based user password authentication flow `ADMIN_USER_PASSWORD_AUTH` . This setting replaces the `ADMIN_NO_SRP_AUTH` setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.
   * - `ALLOW_CUSTOM_AUTH` : Enable Lambda trigger based authentication.
   * - `ALLOW_USER_PASSWORD_AUTH` : Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.
   * - `ALLOW_USER_SRP_AUTH` : Enable SRP-based authentication.
   * - `ALLOW_REFRESH_TOKEN_AUTH` : Enable authflow to refresh tokens.
   *
   * In some environments, you will see the values `ADMIN_NO_SRP_AUTH` , `CUSTOM_AUTH_FLOW_ONLY` , or `USER_PASSWORD_AUTH` . You can't assign these legacy `ExplicitAuthFlows` values to user pool clients at the same time as values that begin with `ALLOW_` ,
   * like `ALLOW_USER_SRP_AUTH` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-explicitauthflows
   */
  readonly explicitAuthFlows?: Array<string>;

  /**
   * Boolean to specify whether you want to generate a secret for the user pool client being created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-generatesecret
   */
  readonly generateSecret?: boolean | cdk.IResolvable;

  /**
   * The ID token time limit.
   *
   * After this limit expires, your user can't use their ID token. To specify the time unit for `IdTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
   *
   * For example, when you set `IdTokenValidity` as `10` and `TokenValidityUnits` as `hours` , your user can authenticate their session with their ID token for 10 hours.
   *
   * The default time unit for `IdTokenValidity` in an API request is hours.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-idtokenvalidity
   */
  readonly idTokenValidity?: number;

  /**
   * A list of allowed logout URLs for the IdPs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-logouturls
   */
  readonly logoutUrLs?: Array<string>;

  /**
   * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool.
   *
   * When set to `ENABLED` and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to `LEGACY` , those APIs will return a `UserNotFoundException` exception if the user does not exist in the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-preventuserexistenceerrors
   */
  readonly preventUserExistenceErrors?: string;

  /**
   * The list of user attributes that you want your app client to have read-only access to.
   *
   * After your user authenticates in your app, their access token authorizes them to read their own attribute value for any attribute in this list. An example of this kind of activity is when your user selects a link to view their profile information. Your app makes a [GetUser](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html) API request to retrieve and display your user's profile data.
   *
   * When you don't specify the `ReadAttributes` for your app client, your app can read the values of `email_verified` , `phone_number_verified` , and the Standard attributes of your user pool. When your user pool has read access to these default attributes, `ReadAttributes` doesn't return any information. Amazon Cognito only populates `ReadAttributes` in the API response if you have specified your own custom set of read attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-readattributes
   */
  readonly readAttributes?: Array<string>;

  /**
   * The refresh token time limit.
   *
   * After this limit expires, your user can't use their refresh token. To specify the time unit for `RefreshTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
   *
   * For example, when you set `RefreshTokenValidity` as `10` and `TokenValidityUnits` as `days` , your user can refresh their session and retrieve new access and ID tokens for 10 days.
   *
   * The default time unit for `RefreshTokenValidity` in an API request is days. You can't set `RefreshTokenValidity` to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-refreshtokenvalidity
   */
  readonly refreshTokenValidity?: number;

  /**
   * A list of provider names for the identity providers (IdPs) that are supported on this client.
   *
   * The following are supported: `COGNITO` , `Facebook` , `Google` , `SignInWithApple` , and `LoginWithAmazon` . You can also specify the names that you configured for the SAML and OIDC IdPs in your user pool, for example `MySAMLIdP` or `MyOIDCIdP` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-supportedidentityproviders
   */
  readonly supportedIdentityProviders?: Array<string>;

  /**
   * The units in which the validity times are represented.
   *
   * The default unit for RefreshToken is days, and default for ID and access tokens are hours.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-tokenvalidityunits
   */
  readonly tokenValidityUnits?: cdk.IResolvable | CfnUserPoolClient.TokenValidityUnitsProperty;

  /**
   * The user pool ID for the user pool where you want to create a user pool client.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-userpoolid
   */
  readonly userPoolId: string;

  /**
   * The list of user attributes that you want your app client to have write access to.
   *
   * After your user authenticates in your app, their access token authorizes them to set or modify their own attribute value for any attribute in this list. An example of this kind of activity is when you present your user with a form to update their profile information and they change their last name. Your app then makes an [UpdateUserAttributes](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UpdateUserAttributes.html) API request and sets `family_name` to the new value.
   *
   * When you don't specify the `WriteAttributes` for your app client, your app can write the values of the Standard attributes of your user pool. When your user pool has write access to these default attributes, `WriteAttributes` doesn't return any information. Amazon Cognito only populates `WriteAttributes` in the API response if you have specified your own custom set of write attributes.
   *
   * If your app client allows users to sign in through an IdP, this array must include all attributes that you have mapped to IdP attributes. Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If your app client does not have write access to a mapped attribute, Amazon Cognito throws an error when it tries to update the attribute. For more information, see [Specifying IdP Attribute Mappings for Your user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-writeattributes
   */
  readonly writeAttributes?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `AnalyticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AnalyticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolClientAnalyticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationArn", cdk.validateString)(properties.applicationArn));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("externalId", cdk.validateString)(properties.externalId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("userDataShared", cdk.validateBoolean)(properties.userDataShared));
  return errors.wrap("supplied properties not correct for \"AnalyticsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolClientAnalyticsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolClientAnalyticsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationArn": cdk.stringToCloudFormation(properties.applicationArn),
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ExternalId": cdk.stringToCloudFormation(properties.externalId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "UserDataShared": cdk.booleanToCloudFormation(properties.userDataShared)
  };
}

// @ts-ignore TS6133
function CfnUserPoolClientAnalyticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolClient.AnalyticsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolClient.AnalyticsConfigurationProperty>();
  ret.addPropertyResult("applicationArn", "ApplicationArn", (properties.ApplicationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationArn) : undefined));
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("externalId", "ExternalId", (properties.ExternalId != null ? cfn_parse.FromCloudFormation.getString(properties.ExternalId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("userDataShared", "UserDataShared", (properties.UserDataShared != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserDataShared) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TokenValidityUnitsProperty`
 *
 * @param properties - the TypeScript properties of a `TokenValidityUnitsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolClientTokenValidityUnitsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("idToken", cdk.validateString)(properties.idToken));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"TokenValidityUnitsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolClientTokenValidityUnitsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolClientTokenValidityUnitsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "IdToken": cdk.stringToCloudFormation(properties.idToken),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnUserPoolClientTokenValidityUnitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPoolClient.TokenValidityUnitsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolClient.TokenValidityUnitsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("idToken", "IdToken", (properties.IdToken != null ? cfn_parse.FromCloudFormation.getString(properties.IdToken) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolClientProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolClientProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolClientPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessTokenValidity", cdk.validateNumber)(properties.accessTokenValidity));
  errors.collect(cdk.propertyValidator("allowedOAuthFlows", cdk.listValidator(cdk.validateString))(properties.allowedOAuthFlows));
  errors.collect(cdk.propertyValidator("allowedOAuthFlowsUserPoolClient", cdk.validateBoolean)(properties.allowedOAuthFlowsUserPoolClient));
  errors.collect(cdk.propertyValidator("allowedOAuthScopes", cdk.listValidator(cdk.validateString))(properties.allowedOAuthScopes));
  errors.collect(cdk.propertyValidator("analyticsConfiguration", CfnUserPoolClientAnalyticsConfigurationPropertyValidator)(properties.analyticsConfiguration));
  errors.collect(cdk.propertyValidator("authSessionValidity", cdk.validateNumber)(properties.authSessionValidity));
  errors.collect(cdk.propertyValidator("callbackUrLs", cdk.listValidator(cdk.validateString))(properties.callbackUrLs));
  errors.collect(cdk.propertyValidator("clientName", cdk.validateString)(properties.clientName));
  errors.collect(cdk.propertyValidator("defaultRedirectUri", cdk.validateString)(properties.defaultRedirectUri));
  errors.collect(cdk.propertyValidator("enablePropagateAdditionalUserContextData", cdk.validateBoolean)(properties.enablePropagateAdditionalUserContextData));
  errors.collect(cdk.propertyValidator("enableTokenRevocation", cdk.validateBoolean)(properties.enableTokenRevocation));
  errors.collect(cdk.propertyValidator("explicitAuthFlows", cdk.listValidator(cdk.validateString))(properties.explicitAuthFlows));
  errors.collect(cdk.propertyValidator("generateSecret", cdk.validateBoolean)(properties.generateSecret));
  errors.collect(cdk.propertyValidator("idTokenValidity", cdk.validateNumber)(properties.idTokenValidity));
  errors.collect(cdk.propertyValidator("logoutUrLs", cdk.listValidator(cdk.validateString))(properties.logoutUrLs));
  errors.collect(cdk.propertyValidator("preventUserExistenceErrors", cdk.validateString)(properties.preventUserExistenceErrors));
  errors.collect(cdk.propertyValidator("readAttributes", cdk.listValidator(cdk.validateString))(properties.readAttributes));
  errors.collect(cdk.propertyValidator("refreshTokenValidity", cdk.validateNumber)(properties.refreshTokenValidity));
  errors.collect(cdk.propertyValidator("supportedIdentityProviders", cdk.listValidator(cdk.validateString))(properties.supportedIdentityProviders));
  errors.collect(cdk.propertyValidator("tokenValidityUnits", CfnUserPoolClientTokenValidityUnitsPropertyValidator)(properties.tokenValidityUnits));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("writeAttributes", cdk.listValidator(cdk.validateString))(properties.writeAttributes));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolClientProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolClientPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolClientPropsValidator(properties).assertSuccess();
  return {
    "AccessTokenValidity": cdk.numberToCloudFormation(properties.accessTokenValidity),
    "AllowedOAuthFlows": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOAuthFlows),
    "AllowedOAuthFlowsUserPoolClient": cdk.booleanToCloudFormation(properties.allowedOAuthFlowsUserPoolClient),
    "AllowedOAuthScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOAuthScopes),
    "AnalyticsConfiguration": convertCfnUserPoolClientAnalyticsConfigurationPropertyToCloudFormation(properties.analyticsConfiguration),
    "AuthSessionValidity": cdk.numberToCloudFormation(properties.authSessionValidity),
    "CallbackURLs": cdk.listMapper(cdk.stringToCloudFormation)(properties.callbackUrLs),
    "ClientName": cdk.stringToCloudFormation(properties.clientName),
    "DefaultRedirectURI": cdk.stringToCloudFormation(properties.defaultRedirectUri),
    "EnablePropagateAdditionalUserContextData": cdk.booleanToCloudFormation(properties.enablePropagateAdditionalUserContextData),
    "EnableTokenRevocation": cdk.booleanToCloudFormation(properties.enableTokenRevocation),
    "ExplicitAuthFlows": cdk.listMapper(cdk.stringToCloudFormation)(properties.explicitAuthFlows),
    "GenerateSecret": cdk.booleanToCloudFormation(properties.generateSecret),
    "IdTokenValidity": cdk.numberToCloudFormation(properties.idTokenValidity),
    "LogoutURLs": cdk.listMapper(cdk.stringToCloudFormation)(properties.logoutUrLs),
    "PreventUserExistenceErrors": cdk.stringToCloudFormation(properties.preventUserExistenceErrors),
    "ReadAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.readAttributes),
    "RefreshTokenValidity": cdk.numberToCloudFormation(properties.refreshTokenValidity),
    "SupportedIdentityProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.supportedIdentityProviders),
    "TokenValidityUnits": convertCfnUserPoolClientTokenValidityUnitsPropertyToCloudFormation(properties.tokenValidityUnits),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId),
    "WriteAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.writeAttributes)
  };
}

// @ts-ignore TS6133
function CfnUserPoolClientPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolClientProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolClientProps>();
  ret.addPropertyResult("accessTokenValidity", "AccessTokenValidity", (properties.AccessTokenValidity != null ? cfn_parse.FromCloudFormation.getNumber(properties.AccessTokenValidity) : undefined));
  ret.addPropertyResult("allowedOAuthFlows", "AllowedOAuthFlows", (properties.AllowedOAuthFlows != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOAuthFlows) : undefined));
  ret.addPropertyResult("allowedOAuthFlowsUserPoolClient", "AllowedOAuthFlowsUserPoolClient", (properties.AllowedOAuthFlowsUserPoolClient != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowedOAuthFlowsUserPoolClient) : undefined));
  ret.addPropertyResult("allowedOAuthScopes", "AllowedOAuthScopes", (properties.AllowedOAuthScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOAuthScopes) : undefined));
  ret.addPropertyResult("analyticsConfiguration", "AnalyticsConfiguration", (properties.AnalyticsConfiguration != null ? CfnUserPoolClientAnalyticsConfigurationPropertyFromCloudFormation(properties.AnalyticsConfiguration) : undefined));
  ret.addPropertyResult("authSessionValidity", "AuthSessionValidity", (properties.AuthSessionValidity != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthSessionValidity) : undefined));
  ret.addPropertyResult("callbackUrLs", "CallbackURLs", (properties.CallbackURLs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CallbackURLs) : undefined));
  ret.addPropertyResult("clientName", "ClientName", (properties.ClientName != null ? cfn_parse.FromCloudFormation.getString(properties.ClientName) : undefined));
  ret.addPropertyResult("defaultRedirectUri", "DefaultRedirectURI", (properties.DefaultRedirectURI != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRedirectURI) : undefined));
  ret.addPropertyResult("enablePropagateAdditionalUserContextData", "EnablePropagateAdditionalUserContextData", (properties.EnablePropagateAdditionalUserContextData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePropagateAdditionalUserContextData) : undefined));
  ret.addPropertyResult("enableTokenRevocation", "EnableTokenRevocation", (properties.EnableTokenRevocation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableTokenRevocation) : undefined));
  ret.addPropertyResult("explicitAuthFlows", "ExplicitAuthFlows", (properties.ExplicitAuthFlows != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExplicitAuthFlows) : undefined));
  ret.addPropertyResult("generateSecret", "GenerateSecret", (properties.GenerateSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.GenerateSecret) : undefined));
  ret.addPropertyResult("idTokenValidity", "IdTokenValidity", (properties.IdTokenValidity != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdTokenValidity) : undefined));
  ret.addPropertyResult("logoutUrLs", "LogoutURLs", (properties.LogoutURLs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogoutURLs) : undefined));
  ret.addPropertyResult("preventUserExistenceErrors", "PreventUserExistenceErrors", (properties.PreventUserExistenceErrors != null ? cfn_parse.FromCloudFormation.getString(properties.PreventUserExistenceErrors) : undefined));
  ret.addPropertyResult("readAttributes", "ReadAttributes", (properties.ReadAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ReadAttributes) : undefined));
  ret.addPropertyResult("refreshTokenValidity", "RefreshTokenValidity", (properties.RefreshTokenValidity != null ? cfn_parse.FromCloudFormation.getNumber(properties.RefreshTokenValidity) : undefined));
  ret.addPropertyResult("supportedIdentityProviders", "SupportedIdentityProviders", (properties.SupportedIdentityProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SupportedIdentityProviders) : undefined));
  ret.addPropertyResult("tokenValidityUnits", "TokenValidityUnits", (properties.TokenValidityUnits != null ? CfnUserPoolClientTokenValidityUnitsPropertyFromCloudFormation(properties.TokenValidityUnits) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addPropertyResult("writeAttributes", "WriteAttributes", (properties.WriteAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.WriteAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Cognito::UserPoolDomain resource creates a new domain for a user pool.
 *
 * @cloudformationResource AWS::Cognito::UserPoolDomain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html
 */
export class CfnUserPoolDomain extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolDomain";

  /**
   * Build a CfnUserPoolDomain from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolDomain {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolDomainPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolDomain(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon CloudFront endpoint that you use as the target of the alias that you set up with your Domain Name Service (DNS) provider.
   *
   * @cloudformationAttribute CloudFrontDistribution
   */
  public readonly attrCloudFrontDistribution: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The configuration for a custom domain that hosts the sign-up and sign-in pages for your application.
   */
  public customDomainConfig?: CfnUserPoolDomain.CustomDomainConfigTypeProperty | cdk.IResolvable;

  /**
   * The domain name for the domain that hosts the sign-up and sign-in pages for your application.
   */
  public domain: string;

  /**
   * The user pool ID for the user pool where you want to associate a user pool domain.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolDomainProps) {
    super(scope, id, {
      "type": CfnUserPoolDomain.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domain", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.attrCloudFrontDistribution = cdk.Token.asString(this.getAtt("CloudFrontDistribution", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.customDomainConfig = props.customDomainConfig;
    this.domain = props.domain;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customDomainConfig": this.customDomainConfig,
      "domain": this.domain,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolDomain.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolDomainPropsToCloudFormation(props);
  }
}

export namespace CfnUserPoolDomain {
  /**
   * The configuration for a custom domain that hosts the sign-up and sign-in webpages for your application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooldomain-customdomainconfigtype.html
   */
  export interface CustomDomainConfigTypeProperty {
    /**
     * The Amazon Resource Name (ARN) of an AWS Certificate Manager SSL certificate.
     *
     * You use this certificate for the subdomain of your custom domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooldomain-customdomainconfigtype.html#cfn-cognito-userpooldomain-customdomainconfigtype-certificatearn
     */
    readonly certificateArn?: string;
  }
}

/**
 * Properties for defining a `CfnUserPoolDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html
 */
export interface CfnUserPoolDomainProps {
  /**
   * The configuration for a custom domain that hosts the sign-up and sign-in pages for your application.
   *
   * Use this object to specify an SSL certificate that is managed by ACM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-customdomainconfig
   */
  readonly customDomainConfig?: CfnUserPoolDomain.CustomDomainConfigTypeProperty | cdk.IResolvable;

  /**
   * The domain name for the domain that hosts the sign-up and sign-in pages for your application.
   *
   * For example: `auth.example.com` . If you're using a prefix domain, this field denotes the first part of the domain before `.auth.[region].amazoncognito.com` .
   *
   * This string can include only lowercase letters, numbers, and hyphens. Don't use a hyphen for the first or last character. Use periods to separate subdomain names.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-domain
   */
  readonly domain: string;

  /**
   * The user pool ID for the user pool where you want to associate a user pool domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CustomDomainConfigTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CustomDomainConfigTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolDomainCustomDomainConfigTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  return errors.wrap("supplied properties not correct for \"CustomDomainConfigTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolDomainCustomDomainConfigTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolDomainCustomDomainConfigTypePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn)
  };
}

// @ts-ignore TS6133
function CfnUserPoolDomainCustomDomainConfigTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolDomain.CustomDomainConfigTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolDomain.CustomDomainConfigTypeProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolDomainProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolDomainPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customDomainConfig", CfnUserPoolDomainCustomDomainConfigTypePropertyValidator)(properties.customDomainConfig));
  errors.collect(cdk.propertyValidator("domain", cdk.requiredValidator)(properties.domain));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolDomainProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolDomainPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolDomainPropsValidator(properties).assertSuccess();
  return {
    "CustomDomainConfig": convertCfnUserPoolDomainCustomDomainConfigTypePropertyToCloudFormation(properties.customDomainConfig),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolDomainProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolDomainProps>();
  ret.addPropertyResult("customDomainConfig", "CustomDomainConfig", (properties.CustomDomainConfig != null ? CfnUserPoolDomainCustomDomainConfigTypePropertyFromCloudFormation(properties.CustomDomainConfig) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A user pool group that you can add a user to.
 *
 * @cloudformationResource AWS::Cognito::UserPoolGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html
 */
export class CfnUserPoolGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolGroup";

  /**
   * Build a CfnUserPoolGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A string containing the description of the group.
   */
  public description?: string;

  /**
   * The name of the group.
   */
  public groupName?: string;

  /**
   * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool.
   */
  public precedence?: number;

  /**
   * The role Amazon Resource Name (ARN) for the group.
   */
  public roleArn?: string;

  /**
   * The user pool ID for the user pool.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolGroupProps) {
    super(scope, id, {
      "type": CfnUserPoolGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userPoolId", this);

    this.description = props.description;
    this.groupName = props.groupName;
    this.precedence = props.precedence;
    this.roleArn = props.roleArn;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "groupName": this.groupName,
      "precedence": this.precedence,
      "roleArn": this.roleArn,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserPoolGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html
 */
export interface CfnUserPoolGroupProps {
  /**
   * A string containing the description of the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-description
   */
  readonly description?: string;

  /**
   * The name of the group.
   *
   * Must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-groupname
   */
  readonly groupName?: string;

  /**
   * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool.
   *
   * Zero is the highest precedence value. Groups with lower `Precedence` values take precedence over groups with higher or null `Precedence` values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN is given in the user's tokens for the `cognito:roles` and `cognito:preferred_role` claims.
   *
   * Two groups can have the same `Precedence` value. If this happens, neither group takes precedence over the other. If two groups with the same `Precedence` have the same role ARN, that role is used in the `cognito:preferred_role` claim in tokens for users in each group. If the two groups have different role ARNs, the `cognito:preferred_role` claim isn't set in users' tokens.
   *
   * The default `Precedence` value is null. The maximum `Precedence` value is `2^31-1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-precedence
   */
  readonly precedence?: number;

  /**
   * The role Amazon Resource Name (ARN) for the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-rolearn
   */
  readonly roleArn?: string;

  /**
   * The user pool ID for the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("precedence", cdk.validateNumber)(properties.precedence));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "Precedence": cdk.numberToCloudFormation(properties.precedence),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("precedence", "Precedence", (properties.Precedence != null ? cfn_parse.FromCloudFormation.getNumber(properties.Precedence) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolIdentityProvider` resource creates an identity provider for a user pool.
 *
 * @cloudformationResource AWS::Cognito::UserPoolIdentityProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html
 */
export class CfnUserPoolIdentityProvider extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolIdentityProvider";

  /**
   * Build a CfnUserPoolIdentityProvider from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolIdentityProvider {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolIdentityProviderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolIdentityProvider(scope, id, propsResult.value);
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

  /**
   * A mapping of IdP attributes to standard and custom user pool attributes.
   */
  public attributeMapping?: any | cdk.IResolvable;

  /**
   * A list of IdP identifiers.
   */
  public idpIdentifiers?: Array<string>;

  /**
   * The IdP details. The following list describes the provider detail keys for each IdP type.
   */
  public providerDetails?: any | cdk.IResolvable;

  /**
   * The IdP name.
   */
  public providerName: string;

  /**
   * The IdP type.
   */
  public providerType: string;

  /**
   * The user pool ID.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolIdentityProviderProps) {
    super(scope, id, {
      "type": CfnUserPoolIdentityProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "providerName", this);
    cdk.requireProperty(props, "providerType", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attributeMapping = props.attributeMapping;
    this.idpIdentifiers = props.idpIdentifiers;
    this.providerDetails = props.providerDetails;
    this.providerName = props.providerName;
    this.providerType = props.providerType;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributeMapping": this.attributeMapping,
      "idpIdentifiers": this.idpIdentifiers,
      "providerDetails": this.providerDetails,
      "providerName": this.providerName,
      "providerType": this.providerType,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolIdentityProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolIdentityProviderPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserPoolIdentityProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html
 */
export interface CfnUserPoolIdentityProviderProps {
  /**
   * A mapping of IdP attributes to standard and custom user pool attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-attributemapping
   */
  readonly attributeMapping?: any | cdk.IResolvable;

  /**
   * A list of IdP identifiers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-idpidentifiers
   */
  readonly idpIdentifiers?: Array<string>;

  /**
   * The IdP details. The following list describes the provider detail keys for each IdP type.
   *
   * - For Google and Login with Amazon:
   *
   * - client_id
   * - client_secret
   * - authorize_scopes
   * - For Facebook:
   *
   * - client_id
   * - client_secret
   * - authorize_scopes
   * - api_version
   * - For Sign in with Apple:
   *
   * - client_id
   * - team_id
   * - key_id
   * - private_key
   * - authorize_scopes
   * - For OpenID Connect (OIDC) providers:
   *
   * - client_id
   * - client_secret
   * - attributes_request_method
   * - oidc_issuer
   * - authorize_scopes
   * - The following keys are only present if Amazon Cognito didn't discover them at the `oidc_issuer` URL.
   *
   * - authorize_url
   * - token_url
   * - attributes_url
   * - jwks_uri
   * - Amazon Cognito sets the value of the following keys automatically. They are read-only.
   *
   * - attributes_url_add_attributes
   * - For SAML providers:
   *
   * - MetadataFile or MetadataURL
   * - IDPSignout *optional*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providerdetails
   */
  readonly providerDetails?: any | cdk.IResolvable;

  /**
   * The IdP name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providername
   */
  readonly providerName: string;

  /**
   * The IdP type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providertype
   */
  readonly providerType: string;

  /**
   * The user pool ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolIdentityProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolIdentityProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolIdentityProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeMapping", cdk.validateObject)(properties.attributeMapping));
  errors.collect(cdk.propertyValidator("idpIdentifiers", cdk.listValidator(cdk.validateString))(properties.idpIdentifiers));
  errors.collect(cdk.propertyValidator("providerDetails", cdk.validateObject)(properties.providerDetails));
  errors.collect(cdk.propertyValidator("providerName", cdk.requiredValidator)(properties.providerName));
  errors.collect(cdk.propertyValidator("providerName", cdk.validateString)(properties.providerName));
  errors.collect(cdk.propertyValidator("providerType", cdk.requiredValidator)(properties.providerType));
  errors.collect(cdk.propertyValidator("providerType", cdk.validateString)(properties.providerType));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolIdentityProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolIdentityProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolIdentityProviderPropsValidator(properties).assertSuccess();
  return {
    "AttributeMapping": cdk.objectToCloudFormation(properties.attributeMapping),
    "IdpIdentifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.idpIdentifiers),
    "ProviderDetails": cdk.objectToCloudFormation(properties.providerDetails),
    "ProviderName": cdk.stringToCloudFormation(properties.providerName),
    "ProviderType": cdk.stringToCloudFormation(properties.providerType),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolIdentityProviderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolIdentityProviderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolIdentityProviderProps>();
  ret.addPropertyResult("attributeMapping", "AttributeMapping", (properties.AttributeMapping != null ? cfn_parse.FromCloudFormation.getAny(properties.AttributeMapping) : undefined));
  ret.addPropertyResult("idpIdentifiers", "IdpIdentifiers", (properties.IdpIdentifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdpIdentifiers) : undefined));
  ret.addPropertyResult("providerDetails", "ProviderDetails", (properties.ProviderDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.ProviderDetails) : undefined));
  ret.addPropertyResult("providerName", "ProviderName", (properties.ProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderName) : undefined));
  ret.addPropertyResult("providerType", "ProviderType", (properties.ProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderType) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolResourceServer` resource creates a new OAuth2.0 resource server and defines custom scopes in it.
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPoolResourceServer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html
 */
export class CfnUserPoolResourceServer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolResourceServer";

  /**
   * Build a CfnUserPoolResourceServer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolResourceServer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolResourceServerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolResourceServer(scope, id, propsResult.value);
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

  /**
   * A unique resource server identifier for the resource server.
   */
  public identifier: string;

  /**
   * A friendly name for the resource server.
   */
  public name: string;

  /**
   * A list of scopes.
   */
  public scopes?: Array<cdk.IResolvable | CfnUserPoolResourceServer.ResourceServerScopeTypeProperty> | cdk.IResolvable;

  /**
   * The user pool ID for the user pool.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolResourceServerProps) {
    super(scope, id, {
      "type": CfnUserPoolResourceServer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "identifier", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.identifier = props.identifier;
    this.name = props.name;
    this.scopes = props.scopes;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identifier": this.identifier,
      "name": this.name,
      "scopes": this.scopes,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolResourceServer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolResourceServerPropsToCloudFormation(props);
  }
}

export namespace CfnUserPoolResourceServer {
  /**
   * A resource server scope.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html
   */
  export interface ResourceServerScopeTypeProperty {
    /**
     * A description of the scope.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html#cfn-cognito-userpoolresourceserver-resourceserverscopetype-scopedescription
     */
    readonly scopeDescription: string;

    /**
     * The name of the scope.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html#cfn-cognito-userpoolresourceserver-resourceserverscopetype-scopename
     */
    readonly scopeName: string;
  }
}

/**
 * Properties for defining a `CfnUserPoolResourceServer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html
 */
export interface CfnUserPoolResourceServerProps {
  /**
   * A unique resource server identifier for the resource server.
   *
   * This could be an HTTPS endpoint where the resource server is located. For example: `https://my-weather-api.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-identifier
   */
  readonly identifier: string;

  /**
   * A friendly name for the resource server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-name
   */
  readonly name: string;

  /**
   * A list of scopes.
   *
   * Each scope is a map with keys `ScopeName` and `ScopeDescription` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-scopes
   */
  readonly scopes?: Array<cdk.IResolvable | CfnUserPoolResourceServer.ResourceServerScopeTypeProperty> | cdk.IResolvable;

  /**
   * The user pool ID for the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `ResourceServerScopeTypeProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceServerScopeTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolResourceServerResourceServerScopeTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scopeDescription", cdk.requiredValidator)(properties.scopeDescription));
  errors.collect(cdk.propertyValidator("scopeDescription", cdk.validateString)(properties.scopeDescription));
  errors.collect(cdk.propertyValidator("scopeName", cdk.requiredValidator)(properties.scopeName));
  errors.collect(cdk.propertyValidator("scopeName", cdk.validateString)(properties.scopeName));
  return errors.wrap("supplied properties not correct for \"ResourceServerScopeTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolResourceServerResourceServerScopeTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolResourceServerResourceServerScopeTypePropertyValidator(properties).assertSuccess();
  return {
    "ScopeDescription": cdk.stringToCloudFormation(properties.scopeDescription),
    "ScopeName": cdk.stringToCloudFormation(properties.scopeName)
  };
}

// @ts-ignore TS6133
function CfnUserPoolResourceServerResourceServerScopeTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPoolResourceServer.ResourceServerScopeTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolResourceServer.ResourceServerScopeTypeProperty>();
  ret.addPropertyResult("scopeDescription", "ScopeDescription", (properties.ScopeDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ScopeDescription) : undefined));
  ret.addPropertyResult("scopeName", "ScopeName", (properties.ScopeName != null ? cfn_parse.FromCloudFormation.getString(properties.ScopeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolResourceServerProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolResourceServerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolResourceServerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identifier", cdk.requiredValidator)(properties.identifier));
  errors.collect(cdk.propertyValidator("identifier", cdk.validateString)(properties.identifier));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("scopes", cdk.listValidator(CfnUserPoolResourceServerResourceServerScopeTypePropertyValidator))(properties.scopes));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolResourceServerProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolResourceServerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolResourceServerPropsValidator(properties).assertSuccess();
  return {
    "Identifier": cdk.stringToCloudFormation(properties.identifier),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Scopes": cdk.listMapper(convertCfnUserPoolResourceServerResourceServerScopeTypePropertyToCloudFormation)(properties.scopes),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolResourceServerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolResourceServerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolResourceServerProps>();
  ret.addPropertyResult("identifier", "Identifier", (properties.Identifier != null ? cfn_parse.FromCloudFormation.getString(properties.Identifier) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("scopes", "Scopes", (properties.Scopes != null ? cfn_parse.FromCloudFormation.getArray(CfnUserPoolResourceServerResourceServerScopeTypePropertyFromCloudFormation)(properties.Scopes) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolRiskConfigurationAttachment` resource sets the risk configuration that is used for Amazon Cognito advanced security features.
 *
 * You can specify risk configuration for a single client (with a specific `clientId` ) or for all clients (by setting the `clientId` to `ALL` ). If you specify `ALL` , the default configuration is used for every client that has had no risk configuration set previously. If you specify risk configuration for a particular client, it no longer falls back to the `ALL` configuration.
 *
 * @cloudformationResource AWS::Cognito::UserPoolRiskConfigurationAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html
 */
export class CfnUserPoolRiskConfigurationAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolRiskConfigurationAttachment";

  /**
   * Build a CfnUserPoolRiskConfigurationAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolRiskConfigurationAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolRiskConfigurationAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolRiskConfigurationAttachment(scope, id, propsResult.value);
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

  /**
   * The account takeover risk configuration object, including the `NotifyConfiguration` object and `Actions` to take if there is an account takeover.
   */
  public accountTakeoverRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty | cdk.IResolvable;

  /**
   * The app client ID.
   */
  public clientId: string;

  /**
   * The compromised credentials risk configuration object, including the `EventFilter` and the `EventAction` .
   */
  public compromisedCredentialsRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty | cdk.IResolvable;

  /**
   * The configuration to override the risk decision.
   */
  public riskExceptionConfiguration?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty;

  /**
   * The user pool ID.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolRiskConfigurationAttachmentProps) {
    super(scope, id, {
      "type": CfnUserPoolRiskConfigurationAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clientId", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.accountTakeoverRiskConfiguration = props.accountTakeoverRiskConfiguration;
    this.clientId = props.clientId;
    this.compromisedCredentialsRiskConfiguration = props.compromisedCredentialsRiskConfiguration;
    this.riskExceptionConfiguration = props.riskExceptionConfiguration;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountTakeoverRiskConfiguration": this.accountTakeoverRiskConfiguration,
      "clientId": this.clientId,
      "compromisedCredentialsRiskConfiguration": this.compromisedCredentialsRiskConfiguration,
      "riskExceptionConfiguration": this.riskExceptionConfiguration,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolRiskConfigurationAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolRiskConfigurationAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnUserPoolRiskConfigurationAttachment {
  /**
   * The compromised credentials risk configuration type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html
   */
  export interface CompromisedCredentialsRiskConfigurationTypeProperty {
    /**
     * The compromised credentials risk configuration actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype-actions
     */
    readonly actions: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsActionsTypeProperty | cdk.IResolvable;

    /**
     * Perform the action for these events.
     *
     * The default is to perform all events if no event filter is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype-eventfilter
     */
    readonly eventFilter?: Array<string>;
  }

  /**
   * The compromised credentials actions type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype.html
   */
  export interface CompromisedCredentialsActionsTypeProperty {
    /**
     * The event action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype-eventaction
     */
    readonly eventAction: string;
  }

  /**
   * Configuration for mitigation actions and notification for different levels of risk detected for a potential account takeover.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html
   */
  export interface AccountTakeoverRiskConfigurationTypeProperty {
    /**
     * Account takeover risk configuration actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype-actions
     */
    readonly actions: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionsTypeProperty | cdk.IResolvable;

    /**
     * The notify configuration used to construct email notifications.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype-notifyconfiguration
     */
    readonly notifyConfiguration?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyConfigurationTypeProperty;
  }

  /**
   * Account takeover actions type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html
   */
  export interface AccountTakeoverActionsTypeProperty {
    /**
     * Action to take for a high risk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-highaction
     */
    readonly highAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;

    /**
     * Action to take for a low risk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-lowaction
     */
    readonly lowAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;

    /**
     * Action to take for a medium risk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-mediumaction
     */
    readonly mediumAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;
  }

  /**
   * Account takeover action type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html
   */
  export interface AccountTakeoverActionTypeProperty {
    /**
     * The action to take in response to the account takeover action. Valid values are as follows:.
     *
     * - `BLOCK` Choosing this action will block the request.
     * - `MFA_IF_CONFIGURED` Present an MFA challenge if user has configured it, else allow the request.
     * - `MFA_REQUIRED` Present an MFA challenge if user has configured it, else block the request.
     * - `NO_ACTION` Allow the user to sign in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype-eventaction
     */
    readonly eventAction: string;

    /**
     * Flag specifying whether to send a notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype-notify
     */
    readonly notify: boolean | cdk.IResolvable;
  }

  /**
   * The notify configuration type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html
   */
  export interface NotifyConfigurationTypeProperty {
    /**
     * Email template used when a detected risk event is blocked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-blockemail
     */
    readonly blockEmail?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty;

    /**
     * The email address that is sending the email.
     *
     * The address must be either individually verified with Amazon Simple Email Service, or from a domain that has been verified with Amazon SES.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-from
     */
    readonly from?: string;

    /**
     * The multi-factor authentication (MFA) email template used when MFA is challenged as part of a detected risk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-mfaemail
     */
    readonly mfaEmail?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty;

    /**
     * The email template used when a detected risk event is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-noactionemail
     */
    readonly noActionEmail?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty;

    /**
     * The destination to which the receiver of an email should reply to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-replyto
     */
    readonly replyTo?: string;

    /**
     * The Amazon Resource Name (ARN) of the identity that is associated with the sending authorization policy.
     *
     * This identity permits Amazon Cognito to send for the email address specified in the `From` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-sourcearn
     */
    readonly sourceArn: string;
  }

  /**
   * The notify email type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html
   */
  export interface NotifyEmailTypeProperty {
    /**
     * The email HTML body.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-htmlbody
     */
    readonly htmlBody?: string;

    /**
     * The email subject.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-subject
     */
    readonly subject: string;

    /**
     * The email text body.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-textbody
     */
    readonly textBody?: string;
  }

  /**
   * The type of the configuration to override the risk decision.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html
   */
  export interface RiskExceptionConfigurationTypeProperty {
    /**
     * Overrides the risk decision to always block the pre-authentication requests.
     *
     * The IP range is in CIDR notation, a compact representation of an IP address and its routing prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype-blockediprangelist
     */
    readonly blockedIpRangeList?: Array<string>;

    /**
     * Risk detection isn't performed on the IP addresses in this range list.
     *
     * The IP range is in CIDR notation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype-skippediprangelist
     */
    readonly skippedIpRangeList?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnUserPoolRiskConfigurationAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html
 */
export interface CfnUserPoolRiskConfigurationAttachmentProps {
  /**
   * The account takeover risk configuration object, including the `NotifyConfiguration` object and `Actions` to take if there is an account takeover.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfiguration
   */
  readonly accountTakeoverRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty | cdk.IResolvable;

  /**
   * The app client ID.
   *
   * You can specify the risk configuration for a single client (with a specific ClientId) or for all clients (by setting the ClientId to `ALL` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-clientid
   */
  readonly clientId: string;

  /**
   * The compromised credentials risk configuration object, including the `EventFilter` and the `EventAction` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfiguration
   */
  readonly compromisedCredentialsRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty | cdk.IResolvable;

  /**
   * The configuration to override the risk decision.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfiguration
   */
  readonly riskExceptionConfiguration?: cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty;

  /**
   * The user pool ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CompromisedCredentialsActionsTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CompromisedCredentialsActionsTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventAction", cdk.requiredValidator)(properties.eventAction));
  errors.collect(cdk.propertyValidator("eventAction", cdk.validateString)(properties.eventAction));
  return errors.wrap("supplied properties not correct for \"CompromisedCredentialsActionsTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyValidator(properties).assertSuccess();
  return {
    "EventAction": cdk.stringToCloudFormation(properties.eventAction)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsActionsTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsActionsTypeProperty>();
  ret.addPropertyResult("eventAction", "EventAction", (properties.EventAction != null ? cfn_parse.FromCloudFormation.getString(properties.EventAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CompromisedCredentialsRiskConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CompromisedCredentialsRiskConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("eventFilter", cdk.listValidator(cdk.validateString))(properties.eventFilter));
  return errors.wrap("supplied properties not correct for \"CompromisedCredentialsRiskConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "Actions": convertCfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyToCloudFormation(properties.actions),
    "EventFilter": cdk.listMapper(cdk.stringToCloudFormation)(properties.eventFilter)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsActionsTypePropertyFromCloudFormation(properties.Actions) : undefined));
  ret.addPropertyResult("eventFilter", "EventFilter", (properties.EventFilter != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EventFilter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountTakeoverActionTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AccountTakeoverActionTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventAction", cdk.requiredValidator)(properties.eventAction));
  errors.collect(cdk.propertyValidator("eventAction", cdk.validateString)(properties.eventAction));
  errors.collect(cdk.propertyValidator("notify", cdk.requiredValidator)(properties.notify));
  errors.collect(cdk.propertyValidator("notify", cdk.validateBoolean)(properties.notify));
  return errors.wrap("supplied properties not correct for \"AccountTakeoverActionTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyValidator(properties).assertSuccess();
  return {
    "EventAction": cdk.stringToCloudFormation(properties.eventAction),
    "Notify": cdk.booleanToCloudFormation(properties.notify)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty>();
  ret.addPropertyResult("eventAction", "EventAction", (properties.EventAction != null ? cfn_parse.FromCloudFormation.getString(properties.EventAction) : undefined));
  ret.addPropertyResult("notify", "Notify", (properties.Notify != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Notify) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountTakeoverActionsTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AccountTakeoverActionsTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("highAction", CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyValidator)(properties.highAction));
  errors.collect(cdk.propertyValidator("lowAction", CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyValidator)(properties.lowAction));
  errors.collect(cdk.propertyValidator("mediumAction", CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyValidator)(properties.mediumAction));
  return errors.wrap("supplied properties not correct for \"AccountTakeoverActionsTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyValidator(properties).assertSuccess();
  return {
    "HighAction": convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyToCloudFormation(properties.highAction),
    "LowAction": convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyToCloudFormation(properties.lowAction),
    "MediumAction": convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyToCloudFormation(properties.mediumAction)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionsTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionsTypeProperty>();
  ret.addPropertyResult("highAction", "HighAction", (properties.HighAction != null ? CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyFromCloudFormation(properties.HighAction) : undefined));
  ret.addPropertyResult("lowAction", "LowAction", (properties.LowAction != null ? CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyFromCloudFormation(properties.LowAction) : undefined));
  ret.addPropertyResult("mediumAction", "MediumAction", (properties.MediumAction != null ? CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionTypePropertyFromCloudFormation(properties.MediumAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotifyEmailTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotifyEmailTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("htmlBody", cdk.validateString)(properties.htmlBody));
  errors.collect(cdk.propertyValidator("subject", cdk.requiredValidator)(properties.subject));
  errors.collect(cdk.propertyValidator("subject", cdk.validateString)(properties.subject));
  errors.collect(cdk.propertyValidator("textBody", cdk.validateString)(properties.textBody));
  return errors.wrap("supplied properties not correct for \"NotifyEmailTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyValidator(properties).assertSuccess();
  return {
    "HtmlBody": cdk.stringToCloudFormation(properties.htmlBody),
    "Subject": cdk.stringToCloudFormation(properties.subject),
    "TextBody": cdk.stringToCloudFormation(properties.textBody)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty>();
  ret.addPropertyResult("htmlBody", "HtmlBody", (properties.HtmlBody != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlBody) : undefined));
  ret.addPropertyResult("subject", "Subject", (properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined));
  ret.addPropertyResult("textBody", "TextBody", (properties.TextBody != null ? cfn_parse.FromCloudFormation.getString(properties.TextBody) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotifyConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotifyConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockEmail", CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyValidator)(properties.blockEmail));
  errors.collect(cdk.propertyValidator("from", cdk.validateString)(properties.from));
  errors.collect(cdk.propertyValidator("mfaEmail", CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyValidator)(properties.mfaEmail));
  errors.collect(cdk.propertyValidator("noActionEmail", CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyValidator)(properties.noActionEmail));
  errors.collect(cdk.propertyValidator("replyTo", cdk.validateString)(properties.replyTo));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.requiredValidator)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  return errors.wrap("supplied properties not correct for \"NotifyConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "BlockEmail": convertCfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyToCloudFormation(properties.blockEmail),
    "From": cdk.stringToCloudFormation(properties.from),
    "MfaEmail": convertCfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyToCloudFormation(properties.mfaEmail),
    "NoActionEmail": convertCfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyToCloudFormation(properties.noActionEmail),
    "ReplyTo": cdk.stringToCloudFormation(properties.replyTo),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.NotifyConfigurationTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.NotifyConfigurationTypeProperty>();
  ret.addPropertyResult("blockEmail", "BlockEmail", (properties.BlockEmail != null ? CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyFromCloudFormation(properties.BlockEmail) : undefined));
  ret.addPropertyResult("from", "From", (properties.From != null ? cfn_parse.FromCloudFormation.getString(properties.From) : undefined));
  ret.addPropertyResult("mfaEmail", "MfaEmail", (properties.MfaEmail != null ? CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyFromCloudFormation(properties.MfaEmail) : undefined));
  ret.addPropertyResult("noActionEmail", "NoActionEmail", (properties.NoActionEmail != null ? CfnUserPoolRiskConfigurationAttachmentNotifyEmailTypePropertyFromCloudFormation(properties.NoActionEmail) : undefined));
  ret.addPropertyResult("replyTo", "ReplyTo", (properties.ReplyTo != null ? cfn_parse.FromCloudFormation.getString(properties.ReplyTo) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountTakeoverRiskConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AccountTakeoverRiskConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("notifyConfiguration", CfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyValidator)(properties.notifyConfiguration));
  return errors.wrap("supplied properties not correct for \"AccountTakeoverRiskConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "Actions": convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyToCloudFormation(properties.actions),
    "NotifyConfiguration": convertCfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyToCloudFormation(properties.notifyConfiguration)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? CfnUserPoolRiskConfigurationAttachmentAccountTakeoverActionsTypePropertyFromCloudFormation(properties.Actions) : undefined));
  ret.addPropertyResult("notifyConfiguration", "NotifyConfiguration", (properties.NotifyConfiguration != null ? CfnUserPoolRiskConfigurationAttachmentNotifyConfigurationTypePropertyFromCloudFormation(properties.NotifyConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RiskExceptionConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `RiskExceptionConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockedIpRangeList", cdk.listValidator(cdk.validateString))(properties.blockedIpRangeList));
  errors.collect(cdk.propertyValidator("skippedIpRangeList", cdk.listValidator(cdk.validateString))(properties.skippedIpRangeList));
  return errors.wrap("supplied properties not correct for \"RiskExceptionConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "BlockedIPRangeList": cdk.listMapper(cdk.stringToCloudFormation)(properties.blockedIpRangeList),
    "SkippedIPRangeList": cdk.listMapper(cdk.stringToCloudFormation)(properties.skippedIpRangeList)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty>();
  ret.addPropertyResult("blockedIpRangeList", "BlockedIPRangeList", (properties.BlockedIPRangeList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BlockedIPRangeList) : undefined));
  ret.addPropertyResult("skippedIpRangeList", "SkippedIPRangeList", (properties.SkippedIPRangeList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SkippedIPRangeList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolRiskConfigurationAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolRiskConfigurationAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountTakeoverRiskConfiguration", CfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyValidator)(properties.accountTakeoverRiskConfiguration));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("compromisedCredentialsRiskConfiguration", CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyValidator)(properties.compromisedCredentialsRiskConfiguration));
  errors.collect(cdk.propertyValidator("riskExceptionConfiguration", CfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyValidator)(properties.riskExceptionConfiguration));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolRiskConfigurationAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolRiskConfigurationAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolRiskConfigurationAttachmentPropsValidator(properties).assertSuccess();
  return {
    "AccountTakeoverRiskConfiguration": convertCfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyToCloudFormation(properties.accountTakeoverRiskConfiguration),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "CompromisedCredentialsRiskConfiguration": convertCfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyToCloudFormation(properties.compromisedCredentialsRiskConfiguration),
    "RiskExceptionConfiguration": convertCfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyToCloudFormation(properties.riskExceptionConfiguration),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolRiskConfigurationAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolRiskConfigurationAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolRiskConfigurationAttachmentProps>();
  ret.addPropertyResult("accountTakeoverRiskConfiguration", "AccountTakeoverRiskConfiguration", (properties.AccountTakeoverRiskConfiguration != null ? CfnUserPoolRiskConfigurationAttachmentAccountTakeoverRiskConfigurationTypePropertyFromCloudFormation(properties.AccountTakeoverRiskConfiguration) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("compromisedCredentialsRiskConfiguration", "CompromisedCredentialsRiskConfiguration", (properties.CompromisedCredentialsRiskConfiguration != null ? CfnUserPoolRiskConfigurationAttachmentCompromisedCredentialsRiskConfigurationTypePropertyFromCloudFormation(properties.CompromisedCredentialsRiskConfiguration) : undefined));
  ret.addPropertyResult("riskExceptionConfiguration", "RiskExceptionConfiguration", (properties.RiskExceptionConfiguration != null ? CfnUserPoolRiskConfigurationAttachmentRiskExceptionConfigurationTypePropertyFromCloudFormation(properties.RiskExceptionConfiguration) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolUICustomizationAttachment` resource sets the UI customization information for a user pool's built-in app UI.
 *
 * You can specify app UI customization settings for a single client (with a specific `clientId` ) or for all clients (by setting the `clientId` to `ALL` ). If you specify `ALL` , the default configuration is used for every client that has had no UI customization set previously. If you specify UI customization settings for a particular client, it no longer falls back to the `ALL` configuration.
 *
 * > Before you create this resource, your user pool must have a domain associated with it. You can create an `AWS::Cognito::UserPoolDomain` resource first in this user pool.
 *
 * Setting a logo image isn't supported from AWS CloudFormation . Use the Amazon Cognito [SetUICustomization](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SetUICustomization.html#API_SetUICustomization_RequestSyntax) API operation to set the image.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUICustomizationAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html
 */
export class CfnUserPoolUICustomizationAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolUICustomizationAttachment";

  /**
   * Build a CfnUserPoolUICustomizationAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUICustomizationAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolUICustomizationAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolUICustomizationAttachment(scope, id, propsResult.value);
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

  /**
   * The client ID for the client app.
   */
  public clientId: string;

  /**
   * The CSS values in the UI customization.
   */
  public css?: string;

  /**
   * The user pool ID for the user pool.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUICustomizationAttachmentProps) {
    super(scope, id, {
      "type": CfnUserPoolUICustomizationAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clientId", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.clientId = props.clientId;
    this.css = props.css;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientId": this.clientId,
      "css": this.css,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolUICustomizationAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolUICustomizationAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserPoolUICustomizationAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html
 */
export interface CfnUserPoolUICustomizationAttachmentProps {
  /**
   * The client ID for the client app.
   *
   * You can specify the UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to `ALL` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-clientid
   */
  readonly clientId: string;

  /**
   * The CSS values in the UI customization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-css
   */
  readonly css?: string;

  /**
   * The user pool ID for the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolUICustomizationAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolUICustomizationAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUICustomizationAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("css", cdk.validateString)(properties.css));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolUICustomizationAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUICustomizationAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUICustomizationAttachmentPropsValidator(properties).assertSuccess();
  return {
    "CSS": cdk.stringToCloudFormation(properties.css),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUICustomizationAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolUICustomizationAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolUICustomizationAttachmentProps>();
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("css", "CSS", (properties.CSS != null ? cfn_parse.FromCloudFormation.getString(properties.CSS) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Cognito::UserPoolUser` resource creates an Amazon Cognito user pool user.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUser
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html
 */
export class CfnUserPoolUser extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolUser";

  /**
   * Build a CfnUserPoolUser from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUser {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolUserPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolUser(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A map of custom key-value pairs that you can provide as input for the custom workflow that is invoked by the *pre sign-up* trigger.
   */
  public clientMetadata?: cdk.IResolvable | Record<string, string>;

  /**
   * Specify `"EMAIL"` if email will be used to send the welcome message.
   */
  public desiredDeliveryMediums?: Array<string>;

  /**
   * This parameter is used only if the `phone_number_verified` or `email_verified` attribute is set to `True` .
   */
  public forceAliasCreation?: boolean | cdk.IResolvable;

  /**
   * Set to `RESEND` to resend the invitation message to a user that already exists and reset the expiration limit on the user's account.
   */
  public messageAction?: string;

  /**
   * An array of name-value pairs that contain user attributes and attribute values.
   */
  public userAttributes?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that you want to set as the username sign-in attribute.
   */
  public username?: string;

  /**
   * The user pool ID for the user pool where the user will be created.
   */
  public userPoolId: string;

  /**
   * Temporary user attributes that contribute to the outcomes of your pre sign-up Lambda trigger.
   */
  public validationData?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUserProps) {
    super(scope, id, {
      "type": CfnUserPoolUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userPoolId", this);

    this.clientMetadata = props.clientMetadata;
    this.desiredDeliveryMediums = props.desiredDeliveryMediums;
    this.forceAliasCreation = props.forceAliasCreation;
    this.messageAction = props.messageAction;
    this.userAttributes = props.userAttributes;
    this.username = props.username;
    this.userPoolId = props.userPoolId;
    this.validationData = props.validationData;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientMetadata": this.clientMetadata,
      "desiredDeliveryMediums": this.desiredDeliveryMediums,
      "forceAliasCreation": this.forceAliasCreation,
      "messageAction": this.messageAction,
      "userAttributes": this.userAttributes,
      "username": this.username,
      "userPoolId": this.userPoolId,
      "validationData": this.validationData
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolUserPropsToCloudFormation(props);
  }
}

export namespace CfnUserPoolUser {
  /**
   * Specifies whether the attribute is standard or custom.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html
   */
  export interface AttributeTypeProperty {
    /**
     * The name of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html#cfn-cognito-userpooluser-attributetype-name
     */
    readonly name?: string;

    /**
     * The value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html#cfn-cognito-userpooluser-attributetype-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnUserPoolUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html
 */
export interface CfnUserPoolUserProps {
  /**
   * A map of custom key-value pairs that you can provide as input for the custom workflow that is invoked by the *pre sign-up* trigger.
   *
   * You create custom workflows by assigning AWS Lambda functions to user pool triggers. When you create a `UserPoolUser` resource and include the `ClientMetadata` property, Amazon Cognito invokes the function that is assigned to the *pre sign-up* trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a `clientMetadata` attribute, which provides the data that you assigned to the ClientMetadata property. In your function code in AWS Lambda , you can process the `clientMetadata` value to enhance your workflow for your specific needs.
   *
   * For more information, see [Customizing User Pool Workflows with Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html) in the *Amazon Cognito Developer Guide* .
   *
   * > Take the following limitations into consideration when you use the ClientMetadata parameter:
   * >
   * > - Amazon Cognito does not store the ClientMetadata value. This data is available only to AWS Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.
   * > - Amazon Cognito does not validate the ClientMetadata value.
   * > - Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-clientmetadata
   */
  readonly clientMetadata?: cdk.IResolvable | Record<string, string>;

  /**
   * Specify `"EMAIL"` if email will be used to send the welcome message.
   *
   * Specify `"SMS"` if the phone number will be used. The default value is `"SMS"` . You can specify more than one value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-desireddeliverymediums
   */
  readonly desiredDeliveryMediums?: Array<string>;

  /**
   * This parameter is used only if the `phone_number_verified` or `email_verified` attribute is set to `True` .
   *
   * Otherwise, it is ignored.
   *
   * If this parameter is set to `True` and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias.
   *
   * If this parameter is set to `False` , the API throws an `AliasExistsException` error if the alias already exists. The default value is `False` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-forcealiascreation
   */
  readonly forceAliasCreation?: boolean | cdk.IResolvable;

  /**
   * Set to `RESEND` to resend the invitation message to a user that already exists and reset the expiration limit on the user's account.
   *
   * Set to `SUPPRESS` to suppress sending the message. You can specify only one value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-messageaction
   */
  readonly messageAction?: string;

  /**
   * An array of name-value pairs that contain user attributes and attribute values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userattributes
   */
  readonly userAttributes?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that you want to set as the username sign-in attribute.
   *
   * The following conditions apply to the username parameter.
   *
   * - The username can't be a duplicate of another username in the same user pool.
   * - You can't change the value of a username after you create it.
   * - You can only provide a value if usernames are a valid sign-in attribute for your user pool. If your user pool only supports phone numbers or email addresses as sign-in attributes, Amazon Cognito automatically generates a username value. For more information, see [Customizing sign-in attributes](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-username
   */
  readonly username?: string;

  /**
   * The user pool ID for the user pool where the user will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userpoolid
   */
  readonly userPoolId: string;

  /**
   * Temporary user attributes that contribute to the outcomes of your pre sign-up Lambda trigger.
   *
   * This set of key-value pairs are for custom validation of information that you collect from your users but don't need to retain.
   *
   * Your Lambda function can analyze this additional data and act on it. Your function might perform external API operations like logging user attributes and validation data to Amazon CloudWatch Logs. Validation data might also affect the response that your function returns to Amazon Cognito, like automatically confirming the user if they sign up from within your network.
   *
   * For more information about the pre sign-up Lambda trigger, see [Pre sign-up Lambda trigger](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-validationdata
   */
  readonly validationData?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `AttributeTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUserAttributeTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AttributeTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUserAttributeTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUserAttributeTypePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUserAttributeTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolUser.AttributeTypeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientMetadata", cdk.hashValidator(cdk.validateString))(properties.clientMetadata));
  errors.collect(cdk.propertyValidator("desiredDeliveryMediums", cdk.listValidator(cdk.validateString))(properties.desiredDeliveryMediums));
  errors.collect(cdk.propertyValidator("forceAliasCreation", cdk.validateBoolean)(properties.forceAliasCreation));
  errors.collect(cdk.propertyValidator("messageAction", cdk.validateString)(properties.messageAction));
  errors.collect(cdk.propertyValidator("userAttributes", cdk.listValidator(CfnUserPoolUserAttributeTypePropertyValidator))(properties.userAttributes));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  errors.collect(cdk.propertyValidator("validationData", cdk.listValidator(CfnUserPoolUserAttributeTypePropertyValidator))(properties.validationData));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUserPropsValidator(properties).assertSuccess();
  return {
    "ClientMetadata": cdk.hashMapper(cdk.stringToCloudFormation)(properties.clientMetadata),
    "DesiredDeliveryMediums": cdk.listMapper(cdk.stringToCloudFormation)(properties.desiredDeliveryMediums),
    "ForceAliasCreation": cdk.booleanToCloudFormation(properties.forceAliasCreation),
    "MessageAction": cdk.stringToCloudFormation(properties.messageAction),
    "UserAttributes": cdk.listMapper(convertCfnUserPoolUserAttributeTypePropertyToCloudFormation)(properties.userAttributes),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId),
    "Username": cdk.stringToCloudFormation(properties.username),
    "ValidationData": cdk.listMapper(convertCfnUserPoolUserAttributeTypePropertyToCloudFormation)(properties.validationData)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolUserProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolUserProps>();
  ret.addPropertyResult("clientMetadata", "ClientMetadata", (properties.ClientMetadata != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ClientMetadata) : undefined));
  ret.addPropertyResult("desiredDeliveryMediums", "DesiredDeliveryMediums", (properties.DesiredDeliveryMediums != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DesiredDeliveryMediums) : undefined));
  ret.addPropertyResult("forceAliasCreation", "ForceAliasCreation", (properties.ForceAliasCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ForceAliasCreation) : undefined));
  ret.addPropertyResult("messageAction", "MessageAction", (properties.MessageAction != null ? cfn_parse.FromCloudFormation.getString(properties.MessageAction) : undefined));
  ret.addPropertyResult("userAttributes", "UserAttributes", (properties.UserAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnUserPoolUserAttributeTypePropertyFromCloudFormation)(properties.UserAttributes) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addPropertyResult("validationData", "ValidationData", (properties.ValidationData != null ? cfn_parse.FromCloudFormation.getArray(CfnUserPoolUserAttributeTypePropertyFromCloudFormation)(properties.ValidationData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds the specified user to the specified group.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUserToGroupAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html
 */
export class CfnUserPoolUserToGroupAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::UserPoolUserToGroupAttachment";

  /**
   * Build a CfnUserPoolUserToGroupAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUserToGroupAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPoolUserToGroupAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserPoolUserToGroupAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the group that you want to add your user to.
   */
  public groupName: string;

  public username: string;

  /**
   * The user pool ID for the user pool.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUserToGroupAttachmentProps) {
    super(scope, id, {
      "type": CfnUserPoolUserToGroupAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupName", this);
    cdk.requireProperty(props, "username", this);
    cdk.requireProperty(props, "userPoolId", this);

    this.groupName = props.groupName;
    this.username = props.username;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groupName": this.groupName,
      "username": this.username,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPoolUserToGroupAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPoolUserToGroupAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserPoolUserToGroupAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html
 */
export interface CfnUserPoolUserToGroupAttachmentProps {
  /**
   * The name of the group that you want to add your user to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-groupname
   */
  readonly groupName: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-username
   */
  readonly username: string;

  /**
   * The user pool ID for the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserPoolUserToGroupAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPoolUserToGroupAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPoolUserToGroupAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"CfnUserPoolUserToGroupAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPoolUserToGroupAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPoolUserToGroupAttachmentPropsValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnUserPoolUserToGroupAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserPoolUserToGroupAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserPoolUserToGroupAttachmentProps>();
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The logging parameters of a user pool.
 *
 * @cloudformationResource AWS::Cognito::LogDeliveryConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-logdeliveryconfiguration.html
 */
export class CfnLogDeliveryConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cognito::LogDeliveryConfiguration";

  /**
   * Build a CfnLogDeliveryConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogDeliveryConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLogDeliveryConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLogDeliveryConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A user pool ID, for example `us-east-1_EXAMPLE` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The detailed activity logging destination of a user pool.
   */
  public logConfigurations?: Array<cdk.IResolvable | CfnLogDeliveryConfiguration.LogConfigurationProperty> | cdk.IResolvable;

  /**
   * The ID of the user pool where you configured detailed activity logging.
   */
  public userPoolId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLogDeliveryConfigurationProps) {
    super(scope, id, {
      "type": CfnLogDeliveryConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userPoolId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.logConfigurations = props.logConfigurations;
    this.userPoolId = props.userPoolId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logConfigurations": this.logConfigurations,
      "userPoolId": this.userPoolId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogDeliveryConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLogDeliveryConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnLogDeliveryConfiguration {
  /**
   * The logging parameters of a user pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * The CloudWatch logging destination of a user pool detailed activity logging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-logconfiguration.html#cfn-cognito-logdeliveryconfiguration-logconfiguration-cloudwatchlogsconfiguration
     */
    readonly cloudWatchLogsConfiguration?: CfnLogDeliveryConfiguration.CloudWatchLogsConfigurationProperty | cdk.IResolvable;

    /**
     * The source of events that your user pool sends for detailed activity logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-logconfiguration.html#cfn-cognito-logdeliveryconfiguration-logconfiguration-eventsource
     */
    readonly eventSource?: string;

    /**
     * The `errorlevel` selection of logs that a user pool sends for detailed activity logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-logconfiguration.html#cfn-cognito-logdeliveryconfiguration-logconfiguration-loglevel
     */
    readonly logLevel?: string;
  }

  /**
   * The CloudWatch logging destination of a user pool detailed activity logging configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-cloudwatchlogsconfiguration.html
   */
  export interface CloudWatchLogsConfigurationProperty {
    /**
     * The Amazon Resource Name (arn) of a CloudWatch Logs log group where your user pool sends logs.
     *
     * The log group must not be encrypted with AWS Key Management Service and must be in the same AWS account as your user pool.
     *
     * To send logs to log groups with a resource policy of a size greater than 5120 characters, configure a log group with a path that starts with `/aws/vendedlogs` . For more information, see [Enabling logging from certain AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-logdeliveryconfiguration-cloudwatchlogsconfiguration.html#cfn-cognito-logdeliveryconfiguration-cloudwatchlogsconfiguration-loggrouparn
     */
    readonly logGroupArn?: string;
  }
}

/**
 * Properties for defining a `CfnLogDeliveryConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-logdeliveryconfiguration.html
 */
export interface CfnLogDeliveryConfigurationProps {
  /**
   * The detailed activity logging destination of a user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-logdeliveryconfiguration.html#cfn-cognito-logdeliveryconfiguration-logconfigurations
   */
  readonly logConfigurations?: Array<cdk.IResolvable | CfnLogDeliveryConfiguration.LogConfigurationProperty> | cdk.IResolvable;

  /**
   * The ID of the user pool where you configured detailed activity logging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-logdeliveryconfiguration.html#cfn-cognito-logdeliveryconfiguration-userpoolid
   */
  readonly userPoolId: string;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogDeliveryConfiguration.CloudWatchLogsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogDeliveryConfiguration.CloudWatchLogsConfigurationProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogDeliveryConfigurationLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsConfiguration", CfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyValidator)(properties.cloudWatchLogsConfiguration));
  errors.collect(cdk.propertyValidator("eventSource", cdk.validateString)(properties.eventSource));
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLogDeliveryConfigurationLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogDeliveryConfigurationLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsConfiguration": convertCfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyToCloudFormation(properties.cloudWatchLogsConfiguration),
    "EventSource": cdk.stringToCloudFormation(properties.eventSource),
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel)
  };
}

// @ts-ignore TS6133
function CfnLogDeliveryConfigurationLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLogDeliveryConfiguration.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogDeliveryConfiguration.LogConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLogsConfiguration", "CloudWatchLogsConfiguration", (properties.CloudWatchLogsConfiguration != null ? CfnLogDeliveryConfigurationCloudWatchLogsConfigurationPropertyFromCloudFormation(properties.CloudWatchLogsConfiguration) : undefined));
  ret.addPropertyResult("eventSource", "EventSource", (properties.EventSource != null ? cfn_parse.FromCloudFormation.getString(properties.EventSource) : undefined));
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLogDeliveryConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogDeliveryConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogDeliveryConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logConfigurations", cdk.listValidator(CfnLogDeliveryConfigurationLogConfigurationPropertyValidator))(properties.logConfigurations));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.requiredValidator)(properties.userPoolId));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CfnLogDeliveryConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnLogDeliveryConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogDeliveryConfigurationPropsValidator(properties).assertSuccess();
  return {
    "LogConfigurations": cdk.listMapper(convertCfnLogDeliveryConfigurationLogConfigurationPropertyToCloudFormation)(properties.logConfigurations),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnLogDeliveryConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogDeliveryConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogDeliveryConfigurationProps>();
  ret.addPropertyResult("logConfigurations", "LogConfigurations", (properties.LogConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnLogDeliveryConfigurationLogConfigurationPropertyFromCloudFormation)(properties.LogConfigurations) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}