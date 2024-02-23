/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the ADM channel to send push notifications through the Amazon Device Messaging (ADM) service to apps that run on Amazon devices, such as Kindle Fire tablets. Before you can use Amazon Pinpoint to send messages to Amazon devices, you have to enable the ADM channel for an Amazon Pinpoint application.
 *
 * The ADMChannel resource represents the status and authentication settings for the ADM channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::ADMChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html
 */
export class CfnADMChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::ADMChannel";

  /**
   * Build a CfnADMChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnADMChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnADMChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnADMChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the ADM channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the ADM channel applies to.
   */
  public applicationId: string;

  /**
   * The Client ID that you received from Amazon to send messages by using ADM.
   */
  public clientId: string;

  /**
   * The Client Secret that you received from Amazon to send messages by using ADM.
   */
  public clientSecret: string;

  /**
   * Specifies whether to enable the ADM channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnADMChannelProps) {
    super(scope, id, {
      "type": CfnADMChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "clientId", this);
    cdk.requireProperty(props, "clientSecret", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.enabled = props.enabled;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "clientId": this.clientId,
      "clientSecret": this.clientSecret,
      "enabled": this.enabled
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnADMChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnADMChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnADMChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html
 */
export interface CfnADMChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the ADM channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The Client ID that you received from Amazon to send messages by using ADM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientid
   */
  readonly clientId: string;

  /**
   * The Client Secret that you received from Amazon to send messages by using ADM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientsecret
   */
  readonly clientSecret: string;

  /**
   * Specifies whether to enable the ADM channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnADMChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnADMChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnADMChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"CfnADMChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnADMChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnADMChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnADMChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnADMChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnADMChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the APNs channel to send push notification messages to the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send notifications to APNs, you have to enable the APNs channel for an Amazon Pinpoint application.
 *
 * The APNSChannel resource represents the status and authentication settings for the APNs channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html
 */
export class CfnAPNSChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::APNSChannel";

  /**
   * Build a CfnAPNSChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAPNSChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAPNSChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the APNs channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs channel applies to.
   */
  public applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   */
  public bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   */
  public certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   */
  public defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   */
  public privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   */
  public teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   */
  public tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   */
  public tokenKeyId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAPNSChannelProps) {
    super(scope, id, {
      "type": CfnAPNSChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.bundleId = props.bundleId;
    this.certificate = props.certificate;
    this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
    this.enabled = props.enabled;
    this.privateKey = props.privateKey;
    this.teamId = props.teamId;
    this.tokenKey = props.tokenKey;
    this.tokenKeyId = props.tokenKeyId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "bundleId": this.bundleId,
      "certificate": this.certificate,
      "defaultAuthenticationMethod": this.defaultAuthenticationMethod,
      "enabled": this.enabled,
      "privateKey": this.privateKey,
      "teamId": this.teamId,
      "tokenKey": this.tokenKey,
      "tokenKeyId": this.tokenKeyId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAPNSChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAPNSChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html
 */
export interface CfnAPNSChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-bundleid
   */
  readonly bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-certificate
   */
  readonly certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   *
   * Valid options are `key` or `certificate` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-defaultauthenticationmethod
   */
  readonly defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-privatekey
   */
  readonly privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-teamid
   */
  readonly teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkey
   */
  readonly tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkeyid
   */
  readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPNSChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("defaultAuthenticationMethod", cdk.validateString)(properties.defaultAuthenticationMethod));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("tokenKey", cdk.validateString)(properties.tokenKey));
  errors.collect(cdk.propertyValidator("tokenKeyId", cdk.validateString)(properties.tokenKeyId));
  return errors.wrap("supplied properties not correct for \"CfnAPNSChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnAPNSChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPNSChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "DefaultAuthenticationMethod": cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "TokenKey": cdk.stringToCloudFormation(properties.tokenKey),
    "TokenKeyId": cdk.stringToCloudFormation(properties.tokenKeyId)
  };
}

// @ts-ignore TS6133
function CfnAPNSChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("defaultAuthenticationMethod", "DefaultAuthenticationMethod", (properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("tokenKey", "TokenKey", (properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined));
  ret.addPropertyResult("tokenKeyId", "TokenKeyId", (properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the APNs sandbox channel to send push notification messages to the sandbox environment of the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send notifications to the APNs sandbox environment, you have to enable the APNs sandbox channel for an Amazon Pinpoint application.
 *
 * The APNSSandboxChannel resource represents the status and authentication settings of the APNs sandbox channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSSandboxChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html
 */
export class CfnAPNSSandboxChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::APNSSandboxChannel";

  /**
   * Build a CfnAPNSSandboxChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSSandboxChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAPNSSandboxChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAPNSSandboxChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the APNs sandbox channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs sandbox channel applies to.
   */
  public applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   */
  public bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   */
  public certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   */
  public defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs Sandbox channel for the Amazon Pinpoint application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   */
  public privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   */
  public teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   */
  public tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   */
  public tokenKeyId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAPNSSandboxChannelProps) {
    super(scope, id, {
      "type": CfnAPNSSandboxChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.bundleId = props.bundleId;
    this.certificate = props.certificate;
    this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
    this.enabled = props.enabled;
    this.privateKey = props.privateKey;
    this.teamId = props.teamId;
    this.tokenKey = props.tokenKey;
    this.tokenKeyId = props.tokenKeyId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "bundleId": this.bundleId,
      "certificate": this.certificate,
      "defaultAuthenticationMethod": this.defaultAuthenticationMethod,
      "enabled": this.enabled,
      "privateKey": this.privateKey,
      "teamId": this.teamId,
      "tokenKey": this.tokenKey,
      "tokenKeyId": this.tokenKeyId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSSandboxChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAPNSSandboxChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAPNSSandboxChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html
 */
export interface CfnAPNSSandboxChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs sandbox channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-bundleid
   */
  readonly bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-certificate
   */
  readonly certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   *
   * Valid options are `key` or `certificate` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-defaultauthenticationmethod
   */
  readonly defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs Sandbox channel for the Amazon Pinpoint application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-privatekey
   */
  readonly privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-teamid
   */
  readonly teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkey
   */
  readonly tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkeyid
   */
  readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSSandboxChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSSandboxChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPNSSandboxChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("defaultAuthenticationMethod", cdk.validateString)(properties.defaultAuthenticationMethod));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("tokenKey", cdk.validateString)(properties.tokenKey));
  errors.collect(cdk.propertyValidator("tokenKeyId", cdk.validateString)(properties.tokenKeyId));
  return errors.wrap("supplied properties not correct for \"CfnAPNSSandboxChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnAPNSSandboxChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPNSSandboxChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "DefaultAuthenticationMethod": cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "TokenKey": cdk.stringToCloudFormation(properties.tokenKey),
    "TokenKeyId": cdk.stringToCloudFormation(properties.tokenKeyId)
  };
}

// @ts-ignore TS6133
function CfnAPNSSandboxChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSSandboxChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSSandboxChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("defaultAuthenticationMethod", "DefaultAuthenticationMethod", (properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("tokenKey", "TokenKey", (properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined));
  ret.addPropertyResult("tokenKeyId", "TokenKeyId", (properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the APNs VoIP channel to send VoIP notification messages to the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send VoIP notifications to APNs, you have to enable the APNs VoIP channel for an Amazon Pinpoint application.
 *
 * The APNSVoipChannel resource represents the status and authentication settings of the APNs VoIP channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSVoipChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html
 */
export class CfnAPNSVoipChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::APNSVoipChannel";

  /**
   * Build a CfnAPNSVoipChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSVoipChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAPNSVoipChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAPNSVoipChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the APNs VoIP channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs VoIP channel applies to.
   */
  public applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   */
  public bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   */
  public certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   */
  public defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs VoIP channel for the Amazon Pinpoint application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   */
  public privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   */
  public teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   */
  public tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   */
  public tokenKeyId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAPNSVoipChannelProps) {
    super(scope, id, {
      "type": CfnAPNSVoipChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.bundleId = props.bundleId;
    this.certificate = props.certificate;
    this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
    this.enabled = props.enabled;
    this.privateKey = props.privateKey;
    this.teamId = props.teamId;
    this.tokenKey = props.tokenKey;
    this.tokenKeyId = props.tokenKeyId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "bundleId": this.bundleId,
      "certificate": this.certificate,
      "defaultAuthenticationMethod": this.defaultAuthenticationMethod,
      "enabled": this.enabled,
      "privateKey": this.privateKey,
      "teamId": this.teamId,
      "tokenKey": this.tokenKey,
      "tokenKeyId": this.tokenKeyId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSVoipChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAPNSVoipChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAPNSVoipChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html
 */
export interface CfnAPNSVoipChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the APNs VoIP channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-bundleid
   */
  readonly bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-certificate
   */
  readonly certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   *
   * Valid options are `key` or `certificate` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-defaultauthenticationmethod
   */
  readonly defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the APNs VoIP channel for the Amazon Pinpoint application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-privatekey
   */
  readonly privateKey?: string;

  /**
   * The identifier that's assigned to your Apple Developer Account team.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-teamid
   */
  readonly teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkey
   */
  readonly tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkeyid
   */
  readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSVoipChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPNSVoipChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("defaultAuthenticationMethod", cdk.validateString)(properties.defaultAuthenticationMethod));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("tokenKey", cdk.validateString)(properties.tokenKey));
  errors.collect(cdk.propertyValidator("tokenKeyId", cdk.validateString)(properties.tokenKeyId));
  return errors.wrap("supplied properties not correct for \"CfnAPNSVoipChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnAPNSVoipChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPNSVoipChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "DefaultAuthenticationMethod": cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "TokenKey": cdk.stringToCloudFormation(properties.tokenKey),
    "TokenKeyId": cdk.stringToCloudFormation(properties.tokenKeyId)
  };
}

// @ts-ignore TS6133
function CfnAPNSVoipChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSVoipChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSVoipChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("defaultAuthenticationMethod", "DefaultAuthenticationMethod", (properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("tokenKey", "TokenKey", (properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined));
  ret.addPropertyResult("tokenKeyId", "TokenKeyId", (properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the APNs VoIP sandbox channel to send VoIP notification messages to the sandbox environment of the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send VoIP notifications to the APNs sandbox environment, you have to enable the APNs VoIP sandbox channel for an Amazon Pinpoint application.
 *
 * The APNSVoipSandboxChannel resource represents the status and authentication settings of the APNs VoIP sandbox channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSVoipSandboxChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html
 */
export class CfnAPNSVoipSandboxChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::APNSVoipSandboxChannel";

  /**
   * Build a CfnAPNSVoipSandboxChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSVoipSandboxChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAPNSVoipSandboxChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAPNSVoipSandboxChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the APNs VoIP sandbox channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the application that the APNs VoIP sandbox channel applies to.
   */
  public applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   */
  public bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   */
  public certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   */
  public defaultAuthenticationMethod?: string;

  /**
   * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
   */
  public privateKey?: string;

  /**
   * The identifier that's assigned to your Apple developer account team.
   */
  public teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   */
  public tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   */
  public tokenKeyId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAPNSVoipSandboxChannelProps) {
    super(scope, id, {
      "type": CfnAPNSVoipSandboxChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.bundleId = props.bundleId;
    this.certificate = props.certificate;
    this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
    this.enabled = props.enabled;
    this.privateKey = props.privateKey;
    this.teamId = props.teamId;
    this.tokenKey = props.tokenKey;
    this.tokenKeyId = props.tokenKeyId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "bundleId": this.bundleId,
      "certificate": this.certificate,
      "defaultAuthenticationMethod": this.defaultAuthenticationMethod,
      "enabled": this.enabled,
      "privateKey": this.privateKey,
      "teamId": this.teamId,
      "tokenKey": this.tokenKey,
      "tokenKeyId": this.tokenKeyId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSVoipSandboxChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAPNSVoipSandboxChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAPNSVoipSandboxChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html
 */
export interface CfnAPNSVoipSandboxChannelProps {
  /**
   * The unique identifier for the application that the APNs VoIP sandbox channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The bundle identifier that's assigned to your iOS app.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-bundleid
   */
  readonly bundleId?: string;

  /**
   * The APNs client certificate that you received from Apple.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using an APNs certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-certificate
   */
  readonly certificate?: string;

  /**
   * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs.
   *
   * Valid options are `key` or `certificate` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-defaultauthenticationmethod
   */
  readonly defaultAuthenticationMethod?: string;

  /**
   * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-privatekey
   */
  readonly privateKey?: string;

  /**
   * The identifier that's assigned to your Apple developer account team.
   *
   * This identifier is used for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-teamid
   */
  readonly teamId?: string;

  /**
   * The authentication key to use for APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkey
   */
  readonly tokenKey?: string;

  /**
   * The key identifier that's assigned to your APNs signing key.
   *
   * Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using APNs tokens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkeyid
   */
  readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSVoipSandboxChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipSandboxChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPNSVoipSandboxChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("defaultAuthenticationMethod", cdk.validateString)(properties.defaultAuthenticationMethod));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("tokenKey", cdk.validateString)(properties.tokenKey));
  errors.collect(cdk.propertyValidator("tokenKeyId", cdk.validateString)(properties.tokenKeyId));
  return errors.wrap("supplied properties not correct for \"CfnAPNSVoipSandboxChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnAPNSVoipSandboxChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPNSVoipSandboxChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "DefaultAuthenticationMethod": cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "TokenKey": cdk.stringToCloudFormation(properties.tokenKey),
    "TokenKeyId": cdk.stringToCloudFormation(properties.tokenKeyId)
  };
}

// @ts-ignore TS6133
function CfnAPNSVoipSandboxChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSVoipSandboxChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSVoipSandboxChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("defaultAuthenticationMethod", "DefaultAuthenticationMethod", (properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("tokenKey", "TokenKey", (properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined));
  ret.addPropertyResult("tokenKeyId", "TokenKeyId", (properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An *app* is an Amazon Pinpoint application, also referred to as a *project* .
 *
 * An application is a collection of related settings, customer information, segments, campaigns, and other types of Amazon Pinpoint resources.
 *
 * The App resource represents an Amazon Pinpoint application.
 *
 * @cloudformationResource AWS::Pinpoint::App
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::App";

  /**
   * Build a CfnApp from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApp(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the application. This identifier is displayed as the *Project ID* on the Amazon Pinpoint console.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The display name of the application.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
    super(scope, id, {
      "type": CfnApp.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::App", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html
 */
export interface CfnAppProps {
  /**
   * The display name of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAppProps\"");
}

// @ts-ignore TS6133
function convertCfnAppPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the settings for an Amazon Pinpoint application.
 *
 * In Amazon Pinpoint, an *application* (also referred to as an *app* or *project* ) is a collection of related settings, customer information, segments, and campaigns, and other types of Amazon Pinpoint resources.
 *
 * @cloudformationResource AWS::Pinpoint::ApplicationSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html
 */
export class CfnApplicationSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::ApplicationSettings";

  /**
   * Build a CfnApplicationSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationSettings(scope, id, propsResult.value);
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
   * The unique identifier for the Amazon Pinpoint application.
   */
  public applicationId: string;

  /**
   * The settings for the Lambda function to use by default as a code hook for campaigns in the application.
   */
  public campaignHook?: CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable;

  public cloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

  /**
   * The default sending limits for campaigns in the application.
   */
  public limits?: cdk.IResolvable | CfnApplicationSettings.LimitsProperty;

  /**
   * The default quiet time for campaigns in the application.
   */
  public quietTime?: cdk.IResolvable | CfnApplicationSettings.QuietTimeProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationSettingsProps) {
    super(scope, id, {
      "type": CfnApplicationSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.campaignHook = props.campaignHook;
    this.cloudWatchMetricsEnabled = props.cloudWatchMetricsEnabled;
    this.limits = props.limits;
    this.quietTime = props.quietTime;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "campaignHook": this.campaignHook,
      "cloudWatchMetricsEnabled": this.cloudWatchMetricsEnabled,
      "limits": this.limits,
      "quietTime": this.quietTime
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationSettingsPropsToCloudFormation(props);
  }
}

export namespace CfnApplicationSettings {
  /**
   * Specifies the start and end times that define a time range when messages aren't sent to endpoints.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html
   */
  export interface QuietTimeProperty {
    /**
     * The specific time when quiet time ends.
     *
     * This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html#cfn-pinpoint-applicationsettings-quiettime-end
     */
    readonly end: string;

    /**
     * The specific time when quiet time begins.
     *
     * This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html#cfn-pinpoint-applicationsettings-quiettime-start
     */
    readonly start: string;
  }

  /**
   * Specifies the default sending limits for campaigns in the application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html
   */
  export interface LimitsProperty {
    /**
     * The maximum number of messages that a campaign can send to a single endpoint during a 24-hour period.
     *
     * The maximum value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-daily
     */
    readonly daily?: number;

    /**
     * The maximum amount of time, in seconds, that a campaign can attempt to deliver a message after the scheduled start time for the campaign.
     *
     * The minimum value is 60 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-maximumduration
     */
    readonly maximumDuration?: number;

    /**
     * The maximum number of messages that a campaign can send each second.
     *
     * The minimum value is 1. The maximum value is 20,000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-messagespersecond
     */
    readonly messagesPerSecond?: number;

    /**
     * The maximum number of messages that a campaign can send to a single endpoint during the course of the campaign.
     *
     * The maximum value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-total
     */
    readonly total?: number;
  }

  /**
   * Specifies the Lambda function to use by default as a code hook for campaigns in the application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html
   */
  export interface CampaignHookProperty {
    /**
     * The name or Amazon Resource Name (ARN) of the Lambda function that Amazon Pinpoint invokes to send messages for campaigns in the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-lambdafunctionname
     */
    readonly lambdaFunctionName?: string;

    /**
     * The mode that Amazon Pinpoint uses to invoke the Lambda function. Possible values are:.
     *
     * - `FILTER` - Invoke the function to customize the segment that's used by a campaign.
     * - `DELIVERY` - (Deprecated) Previously, invoked the function to send a campaign through a custom channel. This functionality is not supported anymore. To send a campaign through a custom channel, use the `CustomDeliveryConfiguration` and `CampaignCustomMessage` objects of the campaign.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-mode
     */
    readonly mode?: string;

    /**
     * The web URL that Amazon Pinpoint calls to invoke the Lambda function over HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-weburl
     */
    readonly webUrl?: string;
  }
}

/**
 * Properties for defining a `CfnApplicationSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html
 */
export interface CfnApplicationSettingsProps {
  /**
   * The unique identifier for the Amazon Pinpoint application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-applicationid
   */
  readonly applicationId: string;

  /**
   * The settings for the Lambda function to use by default as a code hook for campaigns in the application.
   *
   * To override these settings for a specific campaign, use the Campaign resource to define custom Lambda function settings for the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-campaignhook
   */
  readonly campaignHook?: CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-cloudwatchmetricsenabled
   */
  readonly cloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

  /**
   * The default sending limits for campaigns in the application.
   *
   * To override these limits for a specific campaign, use the Campaign resource to define custom limits for the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-limits
   */
  readonly limits?: cdk.IResolvable | CfnApplicationSettings.LimitsProperty;

  /**
   * The default quiet time for campaigns in the application.
   *
   * Quiet time is a specific time range when campaigns don't send messages to endpoints, if all the following conditions are met:
   *
   * - The `EndpointDemographic.Timezone` property of the endpoint is set to a valid value.
   *
   * - The current time in the endpoint's time zone is later than or equal to the time specified by the `QuietTime.Start` property for the application (or a campaign that has custom quiet time settings).
   *
   * - The current time in the endpoint's time zone is earlier than or equal to the time specified by the `QuietTime.End` property for the application (or a campaign that has custom quiet time settings).
   *
   * If any of the preceding conditions isn't met, the endpoint will receive messages from a campaign, even if quiet time is enabled.
   *
   * To override the default quiet time settings for a specific campaign, use the Campaign resource to define a custom quiet time for the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-quiettime
   */
  readonly quietTime?: cdk.IResolvable | CfnApplicationSettings.QuietTimeProperty;
}

/**
 * Determine whether the given properties match those of a `QuietTimeProperty`
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationSettingsQuietTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.requiredValidator)(properties.end));
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.requiredValidator)(properties.start));
  errors.collect(cdk.propertyValidator("start", cdk.validateString)(properties.start));
  return errors.wrap("supplied properties not correct for \"QuietTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationSettingsQuietTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationSettingsQuietTimePropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.stringToCloudFormation(properties.end),
    "Start": cdk.stringToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnApplicationSettingsQuietTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationSettings.QuietTimeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.QuietTimeProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LimitsProperty`
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationSettingsLimitsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("daily", cdk.validateNumber)(properties.daily));
  errors.collect(cdk.propertyValidator("maximumDuration", cdk.validateNumber)(properties.maximumDuration));
  errors.collect(cdk.propertyValidator("messagesPerSecond", cdk.validateNumber)(properties.messagesPerSecond));
  errors.collect(cdk.propertyValidator("total", cdk.validateNumber)(properties.total));
  return errors.wrap("supplied properties not correct for \"LimitsProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationSettingsLimitsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationSettingsLimitsPropertyValidator(properties).assertSuccess();
  return {
    "Daily": cdk.numberToCloudFormation(properties.daily),
    "MaximumDuration": cdk.numberToCloudFormation(properties.maximumDuration),
    "MessagesPerSecond": cdk.numberToCloudFormation(properties.messagesPerSecond),
    "Total": cdk.numberToCloudFormation(properties.total)
  };
}

// @ts-ignore TS6133
function CfnApplicationSettingsLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationSettings.LimitsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.LimitsProperty>();
  ret.addPropertyResult("daily", "Daily", (properties.Daily != null ? cfn_parse.FromCloudFormation.getNumber(properties.Daily) : undefined));
  ret.addPropertyResult("maximumDuration", "MaximumDuration", (properties.MaximumDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumDuration) : undefined));
  ret.addPropertyResult("messagesPerSecond", "MessagesPerSecond", (properties.MessagesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessagesPerSecond) : undefined));
  ret.addPropertyResult("total", "Total", (properties.Total != null ? cfn_parse.FromCloudFormation.getNumber(properties.Total) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignHookProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationSettingsCampaignHookPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaFunctionName", cdk.validateString)(properties.lambdaFunctionName));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("webUrl", cdk.validateString)(properties.webUrl));
  return errors.wrap("supplied properties not correct for \"CampaignHookProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationSettingsCampaignHookPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationSettingsCampaignHookPropertyValidator(properties).assertSuccess();
  return {
    "LambdaFunctionName": cdk.stringToCloudFormation(properties.lambdaFunctionName),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "WebUrl": cdk.stringToCloudFormation(properties.webUrl)
  };
}

// @ts-ignore TS6133
function CfnApplicationSettingsCampaignHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.CampaignHookProperty>();
  ret.addPropertyResult("lambdaFunctionName", "LambdaFunctionName", (properties.LambdaFunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionName) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("webUrl", "WebUrl", (properties.WebUrl != null ? cfn_parse.FromCloudFormation.getString(properties.WebUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("campaignHook", CfnApplicationSettingsCampaignHookPropertyValidator)(properties.campaignHook));
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("limits", CfnApplicationSettingsLimitsPropertyValidator)(properties.limits));
  errors.collect(cdk.propertyValidator("quietTime", CfnApplicationSettingsQuietTimePropertyValidator)(properties.quietTime));
  return errors.wrap("supplied properties not correct for \"CfnApplicationSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationSettingsPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "CampaignHook": convertCfnApplicationSettingsCampaignHookPropertyToCloudFormation(properties.campaignHook),
    "CloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
    "Limits": convertCfnApplicationSettingsLimitsPropertyToCloudFormation(properties.limits),
    "QuietTime": convertCfnApplicationSettingsQuietTimePropertyToCloudFormation(properties.quietTime)
  };
}

// @ts-ignore TS6133
function CfnApplicationSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettingsProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("campaignHook", "CampaignHook", (properties.CampaignHook != null ? CfnApplicationSettingsCampaignHookPropertyFromCloudFormation(properties.CampaignHook) : undefined));
  ret.addPropertyResult("cloudWatchMetricsEnabled", "CloudWatchMetricsEnabled", (properties.CloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("limits", "Limits", (properties.Limits != null ? CfnApplicationSettingsLimitsPropertyFromCloudFormation(properties.Limits) : undefined));
  ret.addPropertyResult("quietTime", "QuietTime", (properties.QuietTime != null ? CfnApplicationSettingsQuietTimePropertyFromCloudFormation(properties.QuietTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the Baidu channel to send notifications to the Baidu Cloud Push notification service. Before you can use Amazon Pinpoint to send notifications to the Baidu Cloud Push service, you have to enable the Baidu channel for an Amazon Pinpoint application.
 *
 * The BaiduChannel resource represents the status and authentication settings of the Baidu channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::BaiduChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html
 */
export class CfnBaiduChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::BaiduChannel";

  /**
   * Build a CfnBaiduChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBaiduChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBaiduChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBaiduChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the Baidu channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The API key that you received from the Baidu Cloud Push service to communicate with the service.
   */
  public apiKey: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that you're configuring the Baidu channel for.
   */
  public applicationId: string;

  /**
   * Specifies whether to enable the Baidu channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The secret key that you received from the Baidu Cloud Push service to communicate with the service.
   */
  public secretKey: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBaiduChannelProps) {
    super(scope, id, {
      "type": CfnBaiduChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiKey", this);
    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "secretKey", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiKey = props.apiKey;
    this.applicationId = props.applicationId;
    this.enabled = props.enabled;
    this.secretKey = props.secretKey;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiKey": this.apiKey,
      "applicationId": this.applicationId,
      "enabled": this.enabled,
      "secretKey": this.secretKey
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBaiduChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBaiduChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBaiduChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html
 */
export interface CfnBaiduChannelProps {
  /**
   * The API key that you received from the Baidu Cloud Push service to communicate with the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-apikey
   */
  readonly apiKey: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that you're configuring the Baidu channel for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * Specifies whether to enable the Baidu channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The secret key that you received from the Baidu Cloud Push service to communicate with the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-secretkey
   */
  readonly secretKey: string;
}

/**
 * Determine whether the given properties match those of a `CfnBaiduChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnBaiduChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBaiduChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.requiredValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("secretKey", cdk.requiredValidator)(properties.secretKey));
  errors.collect(cdk.propertyValidator("secretKey", cdk.validateString)(properties.secretKey));
  return errors.wrap("supplied properties not correct for \"CfnBaiduChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnBaiduChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBaiduChannelPropsValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey),
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "SecretKey": cdk.stringToCloudFormation(properties.secretKey)
  };
}

// @ts-ignore TS6133
function CfnBaiduChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBaiduChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBaiduChannelProps>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("secretKey", "SecretKey", (properties.SecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the settings for a campaign.
 *
 * A *campaign* is a messaging initiative that engages a specific segment of users for an Amazon Pinpoint application.
 *
 * @cloudformationResource AWS::Pinpoint::Campaign
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::Campaign";

  /**
   * Build a CfnCampaign from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCampaign(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the campaign.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the campaign.
   *
   * @cloudformationAttribute CampaignId
   */
  public readonly attrCampaignId: string;

  /**
   * An array of requests that defines additional treatments for the campaign, in addition to the default treatment for the campaign.
   */
  public additionalTreatments?: Array<cdk.IResolvable | CfnCampaign.WriteTreatmentResourceProperty> | cdk.IResolvable;

  /**
   * The unique identifier for the Amazon Pinpoint application that the campaign is associated with.
   */
  public applicationId: string;

  /**
   * Specifies the Lambda function to use as a code hook for a campaign.
   */
  public campaignHook?: CfnCampaign.CampaignHookProperty | cdk.IResolvable;

  /**
   * The delivery configuration settings for sending the treatment through a custom channel.
   */
  public customDeliveryConfiguration?: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable;

  /**
   * A custom description of the campaign.
   */
  public description?: string;

  /**
   * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
   */
  public holdoutPercent?: number;

  /**
   * Specifies whether to pause the campaign.
   */
  public isPaused?: boolean | cdk.IResolvable;

  /**
   * The messaging limits for the campaign.
   */
  public limits?: cdk.IResolvable | CfnCampaign.LimitsProperty;

  /**
   * The message configuration settings for the treatment.
   */
  public messageConfiguration?: cdk.IResolvable | CfnCampaign.MessageConfigurationProperty;

  /**
   * The name of the campaign.
   */
  public name: string;

  /**
   * An integer between 1 and 5, inclusive, that represents the priority of the in-app message campaign, where 1 is the highest priority and 5 is the lowest.
   */
  public priority?: number;

  /**
   * The schedule settings for the treatment.
   */
  public schedule: cdk.IResolvable | CfnCampaign.ScheduleProperty;

  /**
   * The unique identifier for the segment to associate with the campaign.
   */
  public segmentId: string;

  /**
   * The version of the segment to associate with the campaign.
   */
  public segmentVersion?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * The message template to use for the treatment.
   */
  public templateConfiguration?: cdk.IResolvable | CfnCampaign.TemplateConfigurationProperty;

  /**
   * A custom description of the treatment.
   */
  public treatmentDescription?: string;

  /**
   * A custom name for the treatment.
   */
  public treatmentName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
    super(scope, id, {
      "type": CfnCampaign.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schedule", this);
    cdk.requireProperty(props, "segmentId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCampaignId = cdk.Token.asString(this.getAtt("CampaignId", cdk.ResolutionTypeHint.STRING));
    this.additionalTreatments = props.additionalTreatments;
    this.applicationId = props.applicationId;
    this.campaignHook = props.campaignHook;
    this.customDeliveryConfiguration = props.customDeliveryConfiguration;
    this.description = props.description;
    this.holdoutPercent = props.holdoutPercent;
    this.isPaused = props.isPaused;
    this.limits = props.limits;
    this.messageConfiguration = props.messageConfiguration;
    this.name = props.name;
    this.priority = props.priority;
    this.schedule = props.schedule;
    this.segmentId = props.segmentId;
    this.segmentVersion = props.segmentVersion;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::Campaign", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateConfiguration = props.templateConfiguration;
    this.treatmentDescription = props.treatmentDescription;
    this.treatmentName = props.treatmentName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalTreatments": this.additionalTreatments,
      "applicationId": this.applicationId,
      "campaignHook": this.campaignHook,
      "customDeliveryConfiguration": this.customDeliveryConfiguration,
      "description": this.description,
      "holdoutPercent": this.holdoutPercent,
      "isPaused": this.isPaused,
      "limits": this.limits,
      "messageConfiguration": this.messageConfiguration,
      "name": this.name,
      "priority": this.priority,
      "schedule": this.schedule,
      "segmentId": this.segmentId,
      "segmentVersion": this.segmentVersion,
      "tags": this.tags.renderTags(),
      "templateConfiguration": this.templateConfiguration,
      "treatmentDescription": this.treatmentDescription,
      "treatmentName": this.treatmentName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCampaignPropsToCloudFormation(props);
  }
}

export namespace CfnCampaign {
  /**
   * Specifies the message template to use for the message, for each type of channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html
   */
  export interface TemplateConfigurationProperty {
    /**
     * The email template to use for the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-emailtemplate
     */
    readonly emailTemplate?: cdk.IResolvable | CfnCampaign.TemplateProperty;

    /**
     * The push notification template to use for the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-pushtemplate
     */
    readonly pushTemplate?: cdk.IResolvable | CfnCampaign.TemplateProperty;

    /**
     * The SMS template to use for the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-smstemplate
     */
    readonly smsTemplate?: cdk.IResolvable | CfnCampaign.TemplateProperty;

    /**
     * The voice template to use for the message.
     *
     * This object isn't supported for campaigns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-voicetemplate
     */
    readonly voiceTemplate?: cdk.IResolvable | CfnCampaign.TemplateProperty;
  }

  /**
   * Specifies the name and version of the message template to use for the message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html
   */
  export interface TemplateProperty {
    /**
     * The name of the message template to use for the message.
     *
     * If specified, this value must match the name of an existing message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html#cfn-pinpoint-campaign-template-name
     */
    readonly name?: string;

    /**
     * The unique identifier for the version of the message template to use for the message.
     *
     * If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the [Template Versions](https://docs.aws.amazon.com/pinpoint/latest/apireference/templates-template-name-template-type-versions.html) resource.
     *
     * If you don't specify a value for this property, Amazon Pinpoint uses the *active version* of the template. The *active version* is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html#cfn-pinpoint-campaign-template-version
     */
    readonly version?: string;
  }

  /**
   * Specifies the settings for a campaign treatment.
   *
   * A *treatment* is a variation of a campaign that's used for A/B testing of a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html
   */
  export interface WriteTreatmentResourceProperty {
    /**
     * The delivery configuration settings for sending the treatment through a custom channel.
     *
     * This object is required if the `MessageConfiguration` object for the treatment specifies a `CustomMessage` object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-customdeliveryconfiguration
     */
    readonly customDeliveryConfiguration?: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable;

    /**
     * The message configuration settings for the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-messageconfiguration
     */
    readonly messageConfiguration?: cdk.IResolvable | CfnCampaign.MessageConfigurationProperty;

    /**
     * The schedule settings for the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-schedule
     */
    readonly schedule?: cdk.IResolvable | CfnCampaign.ScheduleProperty;

    /**
     * The allocated percentage of users (segment members) to send the treatment to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-sizepercent
     */
    readonly sizePercent?: number;

    /**
     * The message template to use for the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-templateconfiguration
     */
    readonly templateConfiguration?: cdk.IResolvable | CfnCampaign.TemplateConfigurationProperty;

    /**
     * A custom description of the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-treatmentdescription
     */
    readonly treatmentDescription?: string;

    /**
     * A custom name for the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-treatmentname
     */
    readonly treatmentName?: string;
  }

  /**
   * Specifies the message configuration settings for a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html
   */
  export interface MessageConfigurationProperty {
    /**
     * The message that the campaign sends through the ADM (Amazon Device Messaging) channel.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-admmessage
     */
    readonly admMessage?: cdk.IResolvable | CfnCampaign.MessageProperty;

    /**
     * The message that the campaign sends through the APNs (Apple Push Notification service) channel.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-apnsmessage
     */
    readonly apnsMessage?: cdk.IResolvable | CfnCampaign.MessageProperty;

    /**
     * The message that the campaign sends through the Baidu (Baidu Cloud Push) channel.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-baidumessage
     */
    readonly baiduMessage?: cdk.IResolvable | CfnCampaign.MessageProperty;

    /**
     * The message that the campaign sends through a custom channel, as specified by the delivery configuration ( `CustomDeliveryConfiguration` ) settings for the campaign.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-custommessage
     */
    readonly customMessage?: CfnCampaign.CampaignCustomMessageProperty | cdk.IResolvable;

    /**
     * The default message that the campaign sends through all the channels that are configured for the campaign.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-defaultmessage
     */
    readonly defaultMessage?: cdk.IResolvable | CfnCampaign.MessageProperty;

    /**
     * The message that the campaign sends through the email channel.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-emailmessage
     */
    readonly emailMessage?: CfnCampaign.CampaignEmailMessageProperty | cdk.IResolvable;

    /**
     * The message that the campaign sends through the GCM channel, which enables Amazon Pinpoint to send push notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-gcmmessage
     */
    readonly gcmMessage?: cdk.IResolvable | CfnCampaign.MessageProperty;

    /**
     * The default message for the in-app messaging channel.
     *
     * This message overrides the default message ( `DefaultMessage` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-inappmessage
     */
    readonly inAppMessage?: CfnCampaign.CampaignInAppMessageProperty | cdk.IResolvable;

    /**
     * The message that the campaign sends through the SMS channel.
     *
     * If specified, this message overrides the default message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-smsmessage
     */
    readonly smsMessage?: CfnCampaign.CampaignSmsMessageProperty | cdk.IResolvable;
  }

  /**
   * Specifies the content and settings for a push notification that's sent to recipients of a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html
   */
  export interface MessageProperty {
    /**
     * The action to occur if a recipient taps the push notification. Valid values are:.
     *
     * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
     * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of iOS and Android.
     * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-action
     */
    readonly action?: string;

    /**
     * The body of the notification message.
     *
     * The maximum number of characters is 200.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-body
     */
    readonly body?: string;

    /**
     * The URL of the image to display as the push notification icon, such as the icon for the app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imageiconurl
     */
    readonly imageIconUrl?: string;

    /**
     * The URL of the image to display as the small, push notification icon, such as a small version of the icon for the app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imagesmalliconurl
     */
    readonly imageSmallIconUrl?: string;

    /**
     * The URL of an image to display in the push notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imageurl
     */
    readonly imageUrl?: string;

    /**
     * The JSON payload to use for a silent push notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-jsonbody
     */
    readonly jsonBody?: string;

    /**
     * The URL of the image or video to display in the push notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-mediaurl
     */
    readonly mediaUrl?: string;

    /**
     * The raw, JSON-formatted string to use as the payload for the notification message.
     *
     * If specified, this value overrides all other content for the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-rawcontent
     */
    readonly rawContent?: string;

    /**
     * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device.
     *
     * Silent push notifications can be used for cases such as updating an app's configuration, displaying messages in an in-app message center, or supporting phone home functionality.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-silentpush
     */
    readonly silentPush?: boolean | cdk.IResolvable;

    /**
     * The number of seconds that the push notification service should keep the message, if the service is unable to deliver the notification the first time.
     *
     * This value is converted to an expiration value when it's sent to a push notification service. If this value is `0` , the service treats the notification as if it expires immediately and the service doesn't store or try to deliver the notification again.
     *
     * This value doesn't apply to messages that are sent through the Amazon Device Messaging (ADM) service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-timetolive
     */
    readonly timeToLive?: number;

    /**
     * The title to display above the notification message on a recipient's device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-title
     */
    readonly title?: string;

    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps the push notification and the value of the `Action` property is `URL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-url
     */
    readonly url?: string;
  }

  /**
   * Specifies the appearance of an in-app message, including the message type, the title and body text, text and background colors, and the configurations of buttons that appear in the message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html
   */
  export interface CampaignInAppMessageProperty {
    /**
     * An array that contains configurtion information about the in-app message for the campaign, including title and body text, text colors, background colors, image URLs, and button configurations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-content
     */
    readonly content?: Array<CfnCampaign.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-customconfig
     */
    readonly customConfig?: any | cdk.IResolvable;

    /**
     * A string that describes how the in-app message will appear. You can specify one of the following:.
     *
     * - `BOTTOM_BANNER` – a message that appears as a banner at the bottom of the page.
     * - `TOP_BANNER` – a message that appears as a banner at the top of the page.
     * - `OVERLAYS` – a message that covers entire screen.
     * - `MOBILE_FEED` – a message that appears in a window in front of the page.
     * - `MIDDLE_BANNER` – a message that appears as a banner in the middle of the page.
     * - `CAROUSEL` – a scrollable layout of up to five unique messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-layout
     */
    readonly layout?: string;
  }

  /**
   * Specifies the configuration and contents of an in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html
   */
  export interface InAppMessageContentProperty {
    /**
     * The background color for an in-app message banner, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-backgroundcolor
     */
    readonly backgroundColor?: string;

    /**
     * Specifies the configuration of main body text in an in-app message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-bodyconfig
     */
    readonly bodyConfig?: CfnCampaign.InAppMessageBodyConfigProperty | cdk.IResolvable;

    /**
     * Specifies the configuration and content of the header or title text of the in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-headerconfig
     */
    readonly headerConfig?: CfnCampaign.InAppMessageHeaderConfigProperty | cdk.IResolvable;

    /**
     * The URL of the image that appears on an in-app message banner.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-imageurl
     */
    readonly imageUrl?: string;

    /**
     * An object that contains configuration information about the primary button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-primarybtn
     */
    readonly primaryBtn?: CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable;

    /**
     * An object that contains configuration information about the secondary button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-secondarybtn
     */
    readonly secondaryBtn?: CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable;
  }

  /**
   * Specifies the configuration of main body text of the in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html
   */
  export interface InAppMessageBodyConfigProperty {
    /**
     * The text alignment of the main body text of the message.
     *
     * Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-alignment
     */
    readonly alignment?: string;

    /**
     * The main body text of the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-body
     */
    readonly body?: string;

    /**
     * The color of the body text, expressed as a string consisting of a hex color code (such as "#000000" for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-textcolor
     */
    readonly textColor?: string;
  }

  /**
   * Specifies the configuration of a button that appears in an in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html
   */
  export interface InAppMessageButtonProperty {
    /**
     * An object that defines the default behavior for a button in in-app messages sent to Android.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-android
     */
    readonly android?: cdk.IResolvable | CfnCampaign.OverrideButtonConfigurationProperty;

    /**
     * An object that defines the default behavior for a button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-defaultconfig
     */
    readonly defaultConfig?: CfnCampaign.DefaultButtonConfigurationProperty | cdk.IResolvable;

    /**
     * An object that defines the default behavior for a button in in-app messages sent to iOS devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-ios
     */
    readonly ios?: cdk.IResolvable | CfnCampaign.OverrideButtonConfigurationProperty;

    /**
     * An object that defines the default behavior for a button in in-app messages for web applications.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-web
     */
    readonly web?: cdk.IResolvable | CfnCampaign.OverrideButtonConfigurationProperty;
  }

  /**
   * Specifies the configuration of a button with settings that are specific to a certain device type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html
   */
  export interface OverrideButtonConfigurationProperty {
    /**
     * The action that occurs when a recipient chooses a button in an in-app message.
     *
     * You can specify one of the following:
     *
     * - `LINK` – A link to a web destination.
     * - `DEEP_LINK` – A link to a specific page in an application.
     * - `CLOSE` – Dismisses the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html#cfn-pinpoint-campaign-overridebuttonconfiguration-buttonaction
     */
    readonly buttonAction?: string;

    /**
     * The destination (such as a URL) for a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html#cfn-pinpoint-campaign-overridebuttonconfiguration-link
     */
    readonly link?: string;
  }

  /**
   * Specifies the default behavior for a button that appears in an in-app message.
   *
   * You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html
   */
  export interface DefaultButtonConfigurationProperty {
    /**
     * The background color of a button, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-backgroundcolor
     */
    readonly backgroundColor?: string;

    /**
     * The border radius of a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-borderradius
     */
    readonly borderRadius?: number;

    /**
     * The action that occurs when a recipient chooses a button in an in-app message.
     *
     * You can specify one of the following:
     *
     * - `LINK` – A link to a web destination.
     * - `DEEP_LINK` – A link to a specific page in an application.
     * - `CLOSE` – Dismisses the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-buttonaction
     */
    readonly buttonAction?: string;

    /**
     * The destination (such as a URL) for a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-link
     */
    readonly link?: string;

    /**
     * The text that appears on a button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-text
     */
    readonly text?: string;

    /**
     * The color of the body text in a button, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-textcolor
     */
    readonly textColor?: string;
  }

  /**
   * Specifies the configuration and content of the header or title text of the in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html
   */
  export interface InAppMessageHeaderConfigProperty {
    /**
     * The text alignment of the title of the message.
     *
     * Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-alignment
     */
    readonly alignment?: string;

    /**
     * The header or title text of the in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-header
     */
    readonly header?: string;

    /**
     * The color of the body text, expressed as a string consisting of a hex color code (such as "#000000" for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-textcolor
     */
    readonly textColor?: string;
  }

  /**
   * Specifies the content and "From" address for an email message that's sent to recipients of a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html
   */
  export interface CampaignEmailMessageProperty {
    /**
     * The body of the email for recipients whose email clients don't render HTML content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-body
     */
    readonly body?: string;

    /**
     * The verified email address to send the email from.
     *
     * The default address is the `FromAddress` specified for the email channel for the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-fromaddress
     */
    readonly fromAddress?: string;

    /**
     * The body of the email, in HTML format, for recipients whose email clients render HTML content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-htmlbody
     */
    readonly htmlBody?: string;

    /**
     * The subject line, or title, of the email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-title
     */
    readonly title?: string;
  }

  /**
   * Specifies the content and settings for an SMS message that's sent to recipients of a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html
   */
  export interface CampaignSmsMessageProperty {
    /**
     * The body of the SMS message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-body
     */
    readonly body?: string;

    /**
     * The entity ID or Principal Entity (PE) id received from the regulatory body for sending SMS in your country.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-entityid
     */
    readonly entityId?: string;

    /**
     * The SMS message type.
     *
     * Valid values are `TRANSACTIONAL` (for messages that are critical or time-sensitive, such as a one-time passwords) and `PROMOTIONAL` (for messsages that aren't critical or time-sensitive, such as marketing messages).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-messagetype
     */
    readonly messageType?: string;

    /**
     * The long code to send the SMS message from.
     *
     * This value should be one of the dedicated long codes that's assigned to your AWS account. Although it isn't required, we recommend that you specify the long code using an E.164 format to ensure prompt and accurate delivery of the message. For example, +12065550100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-originationnumber
     */
    readonly originationNumber?: string;

    /**
     * The alphabetic Sender ID to display as the sender of the message on a recipient's device.
     *
     * Support for sender IDs varies by country or region. To specify a phone number as the sender, omit this parameter and use `OriginationNumber` instead. For more information about support for Sender ID by country, see the [Amazon Pinpoint User Guide](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-senderid
     */
    readonly senderId?: string;

    /**
     * The template ID received from the regulatory body for sending SMS in your country.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-templateid
     */
    readonly templateId?: string;
  }

  /**
   * Specifies the contents of a message that's sent through a custom channel to recipients of a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigncustommessage.html
   */
  export interface CampaignCustomMessageProperty {
    /**
     * The raw, JSON-formatted string to use as the payload for the message.
     *
     * The maximum size is 5 KB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigncustommessage.html#cfn-pinpoint-campaign-campaigncustommessage-data
     */
    readonly data?: string;
  }

  /**
   * Specifies the schedule settings for a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * The scheduled time, in ISO 8601 format, when the campaign ended or will end.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-endtime
     */
    readonly endTime?: string;

    /**
     * The type of event that causes the campaign to be sent, if the value of the `Frequency` property is `EVENT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-eventfilter
     */
    readonly eventFilter?: CfnCampaign.CampaignEventFilterProperty | cdk.IResolvable;

    /**
     * Specifies how often the campaign is sent or whether the campaign is sent in response to a specific event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-frequency
     */
    readonly frequency?: string;

    /**
     * Specifies whether the start and end times for the campaign schedule use each recipient's local time.
     *
     * To base the schedule on each recipient's local time, set this value to `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-islocaltime
     */
    readonly isLocalTime?: boolean | cdk.IResolvable;

    /**
     * The default quiet time for the campaign.
     *
     * Quiet time is a specific time range when a campaign doesn't send messages to endpoints, if all the following conditions are met:
     *
     * - The `EndpointDemographic.Timezone` property of the endpoint is set to a valid value.
     * - The current time in the endpoint's time zone is later than or equal to the time specified by the `QuietTime.Start` property for the campaign.
     * - The current time in the endpoint's time zone is earlier than or equal to the time specified by the `QuietTime.End` property for the campaign.
     *
     * If any of the preceding conditions isn't met, the endpoint will receive messages from the campaign, even if quiet time is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-quiettime
     */
    readonly quietTime?: cdk.IResolvable | CfnCampaign.QuietTimeProperty;

    /**
     * The scheduled time when the campaign began or will begin.
     *
     * Valid values are: `IMMEDIATE` , to start the campaign immediately; or, a specific time in ISO 8601 format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-starttime
     */
    readonly startTime?: string;

    /**
     * The starting UTC offset for the campaign schedule, if the value of the `IsLocalTime` property is `true` .
     *
     * Valid values are: `UTC, UTC+01, UTC+02, UTC+03, UTC+03:30, UTC+04, UTC+04:30, UTC+05, UTC+05:30, UTC+05:45, UTC+06, UTC+06:30, UTC+07, UTC+08, UTC+09, UTC+09:30, UTC+10, UTC+10:30, UTC+11, UTC+12, UTC+13, UTC-02, UTC-03, UTC-04, UTC-05, UTC-06, UTC-07, UTC-08, UTC-09, UTC-10,` and `UTC-11` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-timezone
     */
    readonly timeZone?: string;
  }

  /**
   * Specifies the start and end times that define a time range when messages aren't sent to endpoints.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-quiettime.html
   */
  export interface QuietTimeProperty {
    /**
     * The specific time when quiet time ends.
     *
     * This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-quiettime.html#cfn-pinpoint-campaign-quiettime-end
     */
    readonly end: string;

    /**
     * The specific time when quiet time begins.
     *
     * This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-quiettime.html#cfn-pinpoint-campaign-quiettime-start
     */
    readonly start: string;
  }

  /**
   * Specifies the settings for events that cause a campaign to be sent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html
   */
  export interface CampaignEventFilterProperty {
    /**
     * The dimension settings of the event filter for the campaign.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html#cfn-pinpoint-campaign-campaigneventfilter-dimensions
     */
    readonly dimensions?: CfnCampaign.EventDimensionsProperty | cdk.IResolvable;

    /**
     * The type of event that causes the campaign to be sent.
     *
     * Valid values are: `SYSTEM` , sends the campaign when a system event occurs; and, `ENDPOINT` , sends the campaign when an endpoint event (Events resource) occurs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html#cfn-pinpoint-campaign-campaigneventfilter-filtertype
     */
    readonly filterType?: string;
  }

  /**
   * Specifies the dimensions for an event filter that determines when a campaign is sent or a journey activity is performed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html
   */
  export interface EventDimensionsProperty {
    /**
     * One or more custom attributes that your application reports to Amazon Pinpoint.
     *
     * You can use these attributes as selection criteria when you create an event filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-attributes
     */
    readonly attributes?: any | cdk.IResolvable;

    /**
     * The name of the event that causes the campaign to be sent or the journey activity to be performed.
     *
     * This can be a standard event that Amazon Pinpoint generates, such as `_email.delivered` or `_custom.delivered` . For campaigns, this can also be a custom event that's specific to your application. For information about standard events, see [Streaming Amazon Pinpoint Events](https://docs.aws.amazon.com/pinpoint/latest/developerguide/event-streams.html) in the *Amazon Pinpoint Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-eventtype
     */
    readonly eventType?: cdk.IResolvable | CfnCampaign.SetDimensionProperty;

    /**
     * One or more custom metrics that your application reports to Amazon Pinpoint .
     *
     * You can use these metrics as selection criteria when you create an event filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-metrics
     */
    readonly metrics?: any | cdk.IResolvable;
  }

  /**
   * Specifies the dimension type and values for a segment dimension.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html
   */
  export interface SetDimensionProperty {
    /**
     * The type of segment dimension to use.
     *
     * Valid values are: `INCLUSIVE` , endpoints that match the criteria are included in the segment; and, `EXCLUSIVE` , endpoints that match the criteria are excluded from the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html#cfn-pinpoint-campaign-setdimension-dimensiontype
     */
    readonly dimensionType?: string;

    /**
     * The criteria values to use for the segment dimension.
     *
     * Depending on the value of the `DimensionType` property, endpoints are included or excluded from the segment if their values match the criteria values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html#cfn-pinpoint-campaign-setdimension-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Specifies the delivery configuration settings for sending a campaign or campaign treatment through a custom channel.
   *
   * This object is required if you use the `CampaignCustomMessage` object to define the message to send for the campaign or campaign treatment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html
   */
  export interface CustomDeliveryConfigurationProperty {
    /**
     * The destination to send the campaign or treatment to. This value can be one of the following:.
     *
     * - The name or Amazon Resource Name (ARN) of an AWS Lambda function to invoke to handle delivery of the campaign or treatment.
     * - The URL for a web application or service that supports HTTPS and can receive the message. The URL has to be a full URL, including the HTTPS protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html#cfn-pinpoint-campaign-customdeliveryconfiguration-deliveryuri
     */
    readonly deliveryUri?: string;

    /**
     * The types of endpoints to send the campaign or treatment to.
     *
     * Each valid value maps to a type of channel that you can associate with an endpoint by using the `ChannelType` property of an endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html#cfn-pinpoint-campaign-customdeliveryconfiguration-endpointtypes
     */
    readonly endpointTypes?: Array<string>;
  }

  /**
   * Specifies the limits on the messages that a campaign can send.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html
   */
  export interface LimitsProperty {
    /**
     * The maximum number of messages that a campaign can send to a single endpoint during a 24-hour period.
     *
     * The maximum value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-daily
     */
    readonly daily?: number;

    /**
     * The maximum amount of time, in seconds, that a campaign can attempt to deliver a message after the scheduled start time for the campaign.
     *
     * The minimum value is 60 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-maximumduration
     */
    readonly maximumDuration?: number;

    /**
     * The maximum number of messages that a campaign can send each second.
     *
     * The minimum value is 1. The maximum value is 20,000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-messagespersecond
     */
    readonly messagesPerSecond?: number;

    /**
     * The maximum number of messages that the campaign can send per user session.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-session
     */
    readonly session?: number;

    /**
     * The maximum number of messages that a campaign can send to a single endpoint during the course of the campaign.
     *
     * The maximum value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-total
     */
    readonly total?: number;
  }

  /**
   * Specifies settings for invoking an Lambda function that customizes a segment for a campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html
   */
  export interface CampaignHookProperty {
    /**
     * The name or Amazon Resource Name (ARN) of the Lambda function that Amazon Pinpoint invokes to customize a segment for a campaign.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-lambdafunctionname
     */
    readonly lambdaFunctionName?: string;

    /**
     * The mode that Amazon Pinpoint uses to invoke the Lambda function. Possible values are:.
     *
     * - `FILTER` - Invoke the function to customize the segment that's used by a campaign.
     * - `DELIVERY` - (Deprecated) Previously, invoked the function to send a campaign through a custom channel. This functionality is not supported anymore. To send a campaign through a custom channel, use the `CustomDeliveryConfiguration` and `CampaignCustomMessage` objects of the campaign.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-mode
     */
    readonly mode?: string;

    /**
     * The web URL that Amazon Pinpoint calls to invoke the Lambda function over HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-weburl
     */
    readonly webUrl?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html
   */
  export interface AttributeDimensionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html#cfn-pinpoint-campaign-attributedimension-attributetype
     */
    readonly attributeType?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html#cfn-pinpoint-campaign-attributedimension-values
     */
    readonly values?: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html#cfn-pinpoint-campaign-metricdimension-comparisonoperator
     */
    readonly comparisonOperator?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html#cfn-pinpoint-campaign-metricdimension-value
     */
    readonly value?: number;
  }
}

/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html
 */
export interface CfnCampaignProps {
  /**
   * An array of requests that defines additional treatments for the campaign, in addition to the default treatment for the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-additionaltreatments
   */
  readonly additionalTreatments?: Array<cdk.IResolvable | CfnCampaign.WriteTreatmentResourceProperty> | cdk.IResolvable;

  /**
   * The unique identifier for the Amazon Pinpoint application that the campaign is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-applicationid
   */
  readonly applicationId: string;

  /**
   * Specifies the Lambda function to use as a code hook for a campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-campaignhook
   */
  readonly campaignHook?: CfnCampaign.CampaignHookProperty | cdk.IResolvable;

  /**
   * The delivery configuration settings for sending the treatment through a custom channel.
   *
   * This object is required if the `MessageConfiguration` object for the treatment specifies a `CustomMessage` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-customdeliveryconfiguration
   */
  readonly customDeliveryConfiguration?: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable;

  /**
   * A custom description of the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-description
   */
  readonly description?: string;

  /**
   * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-holdoutpercent
   */
  readonly holdoutPercent?: number;

  /**
   * Specifies whether to pause the campaign.
   *
   * A paused campaign doesn't run unless you resume it by changing this value to `false` . If you restart a campaign, the campaign restarts from the beginning and not at the point you paused it. If a campaign is running it will complete and then pause. Pause only pauses or skips the next run for a recurring future scheduled campaign. A campaign scheduled for immediate can't be paused.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-ispaused
   */
  readonly isPaused?: boolean | cdk.IResolvable;

  /**
   * The messaging limits for the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-limits
   */
  readonly limits?: cdk.IResolvable | CfnCampaign.LimitsProperty;

  /**
   * The message configuration settings for the treatment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-messageconfiguration
   */
  readonly messageConfiguration?: cdk.IResolvable | CfnCampaign.MessageConfigurationProperty;

  /**
   * The name of the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-name
   */
  readonly name: string;

  /**
   * An integer between 1 and 5, inclusive, that represents the priority of the in-app message campaign, where 1 is the highest priority and 5 is the lowest.
   *
   * If there are multiple messages scheduled to be displayed at the same time, the priority determines the order in which those messages are displayed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-priority
   */
  readonly priority?: number;

  /**
   * The schedule settings for the treatment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-schedule
   */
  readonly schedule: cdk.IResolvable | CfnCampaign.ScheduleProperty;

  /**
   * The unique identifier for the segment to associate with the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentid
   */
  readonly segmentId: string;

  /**
   * The version of the segment to associate with the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentversion
   */
  readonly segmentVersion?: number;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-tags
   */
  readonly tags?: any;

  /**
   * The message template to use for the treatment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-templateconfiguration
   */
  readonly templateConfiguration?: cdk.IResolvable | CfnCampaign.TemplateConfigurationProperty;

  /**
   * A custom description of the treatment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentdescription
   */
  readonly treatmentDescription?: string;

  /**
   * A custom name for the treatment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentname
   */
  readonly treatmentName?: string;
}

/**
 * Determine whether the given properties match those of a `TemplateProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"TemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignTemplatePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnCampaignTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.TemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TemplateProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignTemplateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emailTemplate", CfnCampaignTemplatePropertyValidator)(properties.emailTemplate));
  errors.collect(cdk.propertyValidator("pushTemplate", CfnCampaignTemplatePropertyValidator)(properties.pushTemplate));
  errors.collect(cdk.propertyValidator("smsTemplate", CfnCampaignTemplatePropertyValidator)(properties.smsTemplate));
  errors.collect(cdk.propertyValidator("voiceTemplate", CfnCampaignTemplatePropertyValidator)(properties.voiceTemplate));
  return errors.wrap("supplied properties not correct for \"TemplateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignTemplateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignTemplateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EmailTemplate": convertCfnCampaignTemplatePropertyToCloudFormation(properties.emailTemplate),
    "PushTemplate": convertCfnCampaignTemplatePropertyToCloudFormation(properties.pushTemplate),
    "SMSTemplate": convertCfnCampaignTemplatePropertyToCloudFormation(properties.smsTemplate),
    "VoiceTemplate": convertCfnCampaignTemplatePropertyToCloudFormation(properties.voiceTemplate)
  };
}

// @ts-ignore TS6133
function CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.TemplateConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TemplateConfigurationProperty>();
  ret.addPropertyResult("emailTemplate", "EmailTemplate", (properties.EmailTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.EmailTemplate) : undefined));
  ret.addPropertyResult("pushTemplate", "PushTemplate", (properties.PushTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.PushTemplate) : undefined));
  ret.addPropertyResult("smsTemplate", "SMSTemplate", (properties.SMSTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.SMSTemplate) : undefined));
  ret.addPropertyResult("voiceTemplate", "VoiceTemplate", (properties.VoiceTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.VoiceTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MessageProperty`
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("imageIconUrl", cdk.validateString)(properties.imageIconUrl));
  errors.collect(cdk.propertyValidator("imageSmallIconUrl", cdk.validateString)(properties.imageSmallIconUrl));
  errors.collect(cdk.propertyValidator("imageUrl", cdk.validateString)(properties.imageUrl));
  errors.collect(cdk.propertyValidator("jsonBody", cdk.validateString)(properties.jsonBody));
  errors.collect(cdk.propertyValidator("mediaUrl", cdk.validateString)(properties.mediaUrl));
  errors.collect(cdk.propertyValidator("rawContent", cdk.validateString)(properties.rawContent));
  errors.collect(cdk.propertyValidator("silentPush", cdk.validateBoolean)(properties.silentPush));
  errors.collect(cdk.propertyValidator("timeToLive", cdk.validateNumber)(properties.timeToLive));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"MessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignMessagePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Body": cdk.stringToCloudFormation(properties.body),
    "ImageIconUrl": cdk.stringToCloudFormation(properties.imageIconUrl),
    "ImageSmallIconUrl": cdk.stringToCloudFormation(properties.imageSmallIconUrl),
    "ImageUrl": cdk.stringToCloudFormation(properties.imageUrl),
    "JsonBody": cdk.stringToCloudFormation(properties.jsonBody),
    "MediaUrl": cdk.stringToCloudFormation(properties.mediaUrl),
    "RawContent": cdk.stringToCloudFormation(properties.rawContent),
    "SilentPush": cdk.booleanToCloudFormation(properties.silentPush),
    "TimeToLive": cdk.numberToCloudFormation(properties.timeToLive),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnCampaignMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.MessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MessageProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("imageIconUrl", "ImageIconUrl", (properties.ImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIconUrl) : undefined));
  ret.addPropertyResult("imageSmallIconUrl", "ImageSmallIconUrl", (properties.ImageSmallIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageSmallIconUrl) : undefined));
  ret.addPropertyResult("imageUrl", "ImageUrl", (properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined));
  ret.addPropertyResult("jsonBody", "JsonBody", (properties.JsonBody != null ? cfn_parse.FromCloudFormation.getString(properties.JsonBody) : undefined));
  ret.addPropertyResult("mediaUrl", "MediaUrl", (properties.MediaUrl != null ? cfn_parse.FromCloudFormation.getString(properties.MediaUrl) : undefined));
  ret.addPropertyResult("rawContent", "RawContent", (properties.RawContent != null ? cfn_parse.FromCloudFormation.getString(properties.RawContent) : undefined));
  ret.addPropertyResult("silentPush", "SilentPush", (properties.SilentPush != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SilentPush) : undefined));
  ret.addPropertyResult("timeToLive", "TimeToLive", (properties.TimeToLive != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeToLive) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InAppMessageBodyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageBodyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignInAppMessageBodyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alignment", cdk.validateString)(properties.alignment));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"InAppMessageBodyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignInAppMessageBodyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignInAppMessageBodyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Alignment": cdk.stringToCloudFormation(properties.alignment),
    "Body": cdk.stringToCloudFormation(properties.body),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageBodyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageBodyConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageBodyConfigProperty>();
  ret.addPropertyResult("alignment", "Alignment", (properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OverrideButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignOverrideButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("buttonAction", cdk.validateString)(properties.buttonAction));
  errors.collect(cdk.propertyValidator("link", cdk.validateString)(properties.link));
  return errors.wrap("supplied properties not correct for \"OverrideButtonConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignOverrideButtonConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ButtonAction": cdk.stringToCloudFormation(properties.buttonAction),
    "Link": cdk.stringToCloudFormation(properties.link)
  };
}

// @ts-ignore TS6133
function CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.OverrideButtonConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.OverrideButtonConfigurationProperty>();
  ret.addPropertyResult("buttonAction", "ButtonAction", (properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined));
  ret.addPropertyResult("link", "Link", (properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignDefaultButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backgroundColor", cdk.validateString)(properties.backgroundColor));
  errors.collect(cdk.propertyValidator("borderRadius", cdk.validateNumber)(properties.borderRadius));
  errors.collect(cdk.propertyValidator("buttonAction", cdk.validateString)(properties.buttonAction));
  errors.collect(cdk.propertyValidator("link", cdk.validateString)(properties.link));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"DefaultButtonConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignDefaultButtonConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignDefaultButtonConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BackgroundColor": cdk.stringToCloudFormation(properties.backgroundColor),
    "BorderRadius": cdk.numberToCloudFormation(properties.borderRadius),
    "ButtonAction": cdk.stringToCloudFormation(properties.buttonAction),
    "Link": cdk.stringToCloudFormation(properties.link),
    "Text": cdk.stringToCloudFormation(properties.text),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnCampaignDefaultButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.DefaultButtonConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.DefaultButtonConfigurationProperty>();
  ret.addPropertyResult("backgroundColor", "BackgroundColor", (properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined));
  ret.addPropertyResult("borderRadius", "BorderRadius", (properties.BorderRadius != null ? cfn_parse.FromCloudFormation.getNumber(properties.BorderRadius) : undefined));
  ret.addPropertyResult("buttonAction", "ButtonAction", (properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined));
  ret.addPropertyResult("link", "Link", (properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InAppMessageButtonProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageButtonProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignInAppMessageButtonPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("android", CfnCampaignOverrideButtonConfigurationPropertyValidator)(properties.android));
  errors.collect(cdk.propertyValidator("defaultConfig", CfnCampaignDefaultButtonConfigurationPropertyValidator)(properties.defaultConfig));
  errors.collect(cdk.propertyValidator("ios", CfnCampaignOverrideButtonConfigurationPropertyValidator)(properties.ios));
  errors.collect(cdk.propertyValidator("web", CfnCampaignOverrideButtonConfigurationPropertyValidator)(properties.web));
  return errors.wrap("supplied properties not correct for \"InAppMessageButtonProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignInAppMessageButtonPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignInAppMessageButtonPropertyValidator(properties).assertSuccess();
  return {
    "Android": convertCfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.android),
    "DefaultConfig": convertCfnCampaignDefaultButtonConfigurationPropertyToCloudFormation(properties.defaultConfig),
    "IOS": convertCfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.ios),
    "Web": convertCfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.web)
  };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageButtonProperty>();
  ret.addPropertyResult("android", "Android", (properties.Android != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.Android) : undefined));
  ret.addPropertyResult("defaultConfig", "DefaultConfig", (properties.DefaultConfig != null ? CfnCampaignDefaultButtonConfigurationPropertyFromCloudFormation(properties.DefaultConfig) : undefined));
  ret.addPropertyResult("ios", "IOS", (properties.IOS != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.IOS) : undefined));
  ret.addPropertyResult("web", "Web", (properties.Web != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.Web) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InAppMessageHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignInAppMessageHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alignment", cdk.validateString)(properties.alignment));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"InAppMessageHeaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignInAppMessageHeaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignInAppMessageHeaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "Alignment": cdk.stringToCloudFormation(properties.alignment),
    "Header": cdk.stringToCloudFormation(properties.header),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageHeaderConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageHeaderConfigProperty>();
  ret.addPropertyResult("alignment", "Alignment", (properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InAppMessageContentProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignInAppMessageContentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backgroundColor", cdk.validateString)(properties.backgroundColor));
  errors.collect(cdk.propertyValidator("bodyConfig", CfnCampaignInAppMessageBodyConfigPropertyValidator)(properties.bodyConfig));
  errors.collect(cdk.propertyValidator("headerConfig", CfnCampaignInAppMessageHeaderConfigPropertyValidator)(properties.headerConfig));
  errors.collect(cdk.propertyValidator("imageUrl", cdk.validateString)(properties.imageUrl));
  errors.collect(cdk.propertyValidator("primaryBtn", CfnCampaignInAppMessageButtonPropertyValidator)(properties.primaryBtn));
  errors.collect(cdk.propertyValidator("secondaryBtn", CfnCampaignInAppMessageButtonPropertyValidator)(properties.secondaryBtn));
  return errors.wrap("supplied properties not correct for \"InAppMessageContentProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignInAppMessageContentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignInAppMessageContentPropertyValidator(properties).assertSuccess();
  return {
    "BackgroundColor": cdk.stringToCloudFormation(properties.backgroundColor),
    "BodyConfig": convertCfnCampaignInAppMessageBodyConfigPropertyToCloudFormation(properties.bodyConfig),
    "HeaderConfig": convertCfnCampaignInAppMessageHeaderConfigPropertyToCloudFormation(properties.headerConfig),
    "ImageUrl": cdk.stringToCloudFormation(properties.imageUrl),
    "PrimaryBtn": convertCfnCampaignInAppMessageButtonPropertyToCloudFormation(properties.primaryBtn),
    "SecondaryBtn": convertCfnCampaignInAppMessageButtonPropertyToCloudFormation(properties.secondaryBtn)
  };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageContentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageContentProperty>();
  ret.addPropertyResult("backgroundColor", "BackgroundColor", (properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined));
  ret.addPropertyResult("bodyConfig", "BodyConfig", (properties.BodyConfig != null ? CfnCampaignInAppMessageBodyConfigPropertyFromCloudFormation(properties.BodyConfig) : undefined));
  ret.addPropertyResult("headerConfig", "HeaderConfig", (properties.HeaderConfig != null ? CfnCampaignInAppMessageHeaderConfigPropertyFromCloudFormation(properties.HeaderConfig) : undefined));
  ret.addPropertyResult("imageUrl", "ImageUrl", (properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined));
  ret.addPropertyResult("primaryBtn", "PrimaryBtn", (properties.PrimaryBtn != null ? CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties.PrimaryBtn) : undefined));
  ret.addPropertyResult("secondaryBtn", "SecondaryBtn", (properties.SecondaryBtn != null ? CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties.SecondaryBtn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignInAppMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignInAppMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignInAppMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.listValidator(CfnCampaignInAppMessageContentPropertyValidator))(properties.content));
  errors.collect(cdk.propertyValidator("customConfig", cdk.validateObject)(properties.customConfig));
  errors.collect(cdk.propertyValidator("layout", cdk.validateString)(properties.layout));
  return errors.wrap("supplied properties not correct for \"CampaignInAppMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignInAppMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignInAppMessagePropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.listMapper(convertCfnCampaignInAppMessageContentPropertyToCloudFormation)(properties.content),
    "CustomConfig": cdk.objectToCloudFormation(properties.customConfig),
    "Layout": cdk.stringToCloudFormation(properties.layout)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignInAppMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignInAppMessageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignInAppMessageProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignInAppMessageContentPropertyFromCloudFormation)(properties.Content) : undefined));
  ret.addPropertyResult("customConfig", "CustomConfig", (properties.CustomConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomConfig) : undefined));
  ret.addPropertyResult("layout", "Layout", (properties.Layout != null ? cfn_parse.FromCloudFormation.getString(properties.Layout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignEmailMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignEmailMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignEmailMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("fromAddress", cdk.validateString)(properties.fromAddress));
  errors.collect(cdk.propertyValidator("htmlBody", cdk.validateString)(properties.htmlBody));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  return errors.wrap("supplied properties not correct for \"CampaignEmailMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignEmailMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignEmailMessagePropertyValidator(properties).assertSuccess();
  return {
    "Body": cdk.stringToCloudFormation(properties.body),
    "FromAddress": cdk.stringToCloudFormation(properties.fromAddress),
    "HtmlBody": cdk.stringToCloudFormation(properties.htmlBody),
    "Title": cdk.stringToCloudFormation(properties.title)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignEmailMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignEmailMessageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignEmailMessageProperty>();
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("fromAddress", "FromAddress", (properties.FromAddress != null ? cfn_parse.FromCloudFormation.getString(properties.FromAddress) : undefined));
  ret.addPropertyResult("htmlBody", "HtmlBody", (properties.HtmlBody != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlBody) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignSmsMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignSmsMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignSmsMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("entityId", cdk.validateString)(properties.entityId));
  errors.collect(cdk.propertyValidator("messageType", cdk.validateString)(properties.messageType));
  errors.collect(cdk.propertyValidator("originationNumber", cdk.validateString)(properties.originationNumber));
  errors.collect(cdk.propertyValidator("senderId", cdk.validateString)(properties.senderId));
  errors.collect(cdk.propertyValidator("templateId", cdk.validateString)(properties.templateId));
  return errors.wrap("supplied properties not correct for \"CampaignSmsMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignSmsMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignSmsMessagePropertyValidator(properties).assertSuccess();
  return {
    "Body": cdk.stringToCloudFormation(properties.body),
    "EntityId": cdk.stringToCloudFormation(properties.entityId),
    "MessageType": cdk.stringToCloudFormation(properties.messageType),
    "OriginationNumber": cdk.stringToCloudFormation(properties.originationNumber),
    "SenderId": cdk.stringToCloudFormation(properties.senderId),
    "TemplateId": cdk.stringToCloudFormation(properties.templateId)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignSmsMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignSmsMessageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignSmsMessageProperty>();
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("entityId", "EntityId", (properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined));
  ret.addPropertyResult("messageType", "MessageType", (properties.MessageType != null ? cfn_parse.FromCloudFormation.getString(properties.MessageType) : undefined));
  ret.addPropertyResult("originationNumber", "OriginationNumber", (properties.OriginationNumber != null ? cfn_parse.FromCloudFormation.getString(properties.OriginationNumber) : undefined));
  ret.addPropertyResult("senderId", "SenderId", (properties.SenderId != null ? cfn_parse.FromCloudFormation.getString(properties.SenderId) : undefined));
  ret.addPropertyResult("templateId", "TemplateId", (properties.TemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignCustomMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignCustomMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignCustomMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  return errors.wrap("supplied properties not correct for \"CampaignCustomMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignCustomMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignCustomMessagePropertyValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignCustomMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignCustomMessageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignCustomMessageProperty>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MessageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MessageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignMessageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("admMessage", CfnCampaignMessagePropertyValidator)(properties.admMessage));
  errors.collect(cdk.propertyValidator("apnsMessage", CfnCampaignMessagePropertyValidator)(properties.apnsMessage));
  errors.collect(cdk.propertyValidator("baiduMessage", CfnCampaignMessagePropertyValidator)(properties.baiduMessage));
  errors.collect(cdk.propertyValidator("customMessage", CfnCampaignCampaignCustomMessagePropertyValidator)(properties.customMessage));
  errors.collect(cdk.propertyValidator("defaultMessage", CfnCampaignMessagePropertyValidator)(properties.defaultMessage));
  errors.collect(cdk.propertyValidator("emailMessage", CfnCampaignCampaignEmailMessagePropertyValidator)(properties.emailMessage));
  errors.collect(cdk.propertyValidator("gcmMessage", CfnCampaignMessagePropertyValidator)(properties.gcmMessage));
  errors.collect(cdk.propertyValidator("inAppMessage", CfnCampaignCampaignInAppMessagePropertyValidator)(properties.inAppMessage));
  errors.collect(cdk.propertyValidator("smsMessage", CfnCampaignCampaignSmsMessagePropertyValidator)(properties.smsMessage));
  return errors.wrap("supplied properties not correct for \"MessageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignMessageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignMessageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ADMMessage": convertCfnCampaignMessagePropertyToCloudFormation(properties.admMessage),
    "APNSMessage": convertCfnCampaignMessagePropertyToCloudFormation(properties.apnsMessage),
    "BaiduMessage": convertCfnCampaignMessagePropertyToCloudFormation(properties.baiduMessage),
    "CustomMessage": convertCfnCampaignCampaignCustomMessagePropertyToCloudFormation(properties.customMessage),
    "DefaultMessage": convertCfnCampaignMessagePropertyToCloudFormation(properties.defaultMessage),
    "EmailMessage": convertCfnCampaignCampaignEmailMessagePropertyToCloudFormation(properties.emailMessage),
    "GCMMessage": convertCfnCampaignMessagePropertyToCloudFormation(properties.gcmMessage),
    "InAppMessage": convertCfnCampaignCampaignInAppMessagePropertyToCloudFormation(properties.inAppMessage),
    "SMSMessage": convertCfnCampaignCampaignSmsMessagePropertyToCloudFormation(properties.smsMessage)
  };
}

// @ts-ignore TS6133
function CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.MessageConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MessageConfigurationProperty>();
  ret.addPropertyResult("admMessage", "ADMMessage", (properties.ADMMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.ADMMessage) : undefined));
  ret.addPropertyResult("apnsMessage", "APNSMessage", (properties.APNSMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.APNSMessage) : undefined));
  ret.addPropertyResult("baiduMessage", "BaiduMessage", (properties.BaiduMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.BaiduMessage) : undefined));
  ret.addPropertyResult("customMessage", "CustomMessage", (properties.CustomMessage != null ? CfnCampaignCampaignCustomMessagePropertyFromCloudFormation(properties.CustomMessage) : undefined));
  ret.addPropertyResult("defaultMessage", "DefaultMessage", (properties.DefaultMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.DefaultMessage) : undefined));
  ret.addPropertyResult("emailMessage", "EmailMessage", (properties.EmailMessage != null ? CfnCampaignCampaignEmailMessagePropertyFromCloudFormation(properties.EmailMessage) : undefined));
  ret.addPropertyResult("gcmMessage", "GCMMessage", (properties.GCMMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.GCMMessage) : undefined));
  ret.addPropertyResult("inAppMessage", "InAppMessage", (properties.InAppMessage != null ? CfnCampaignCampaignInAppMessagePropertyFromCloudFormation(properties.InAppMessage) : undefined));
  ret.addPropertyResult("smsMessage", "SMSMessage", (properties.SMSMessage != null ? CfnCampaignCampaignSmsMessagePropertyFromCloudFormation(properties.SMSMessage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QuietTimeProperty`
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignQuietTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.requiredValidator)(properties.end));
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.requiredValidator)(properties.start));
  errors.collect(cdk.propertyValidator("start", cdk.validateString)(properties.start));
  return errors.wrap("supplied properties not correct for \"QuietTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignQuietTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignQuietTimePropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.stringToCloudFormation(properties.end),
    "Start": cdk.stringToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnCampaignQuietTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.QuietTimeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.QuietTimeProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SetDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignSetDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionType", cdk.validateString)(properties.dimensionType));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"SetDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignSetDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignSetDimensionPropertyValidator(properties).assertSuccess();
  return {
    "DimensionType": cdk.stringToCloudFormation(properties.dimensionType),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnCampaignSetDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.SetDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.SetDimensionProperty>();
  ret.addPropertyResult("dimensionType", "DimensionType", (properties.DimensionType != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionType) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventDimensionsProperty`
 *
 * @param properties - the TypeScript properties of a `EventDimensionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignEventDimensionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.validateObject)(properties.attributes));
  errors.collect(cdk.propertyValidator("eventType", CfnCampaignSetDimensionPropertyValidator)(properties.eventType));
  errors.collect(cdk.propertyValidator("metrics", cdk.validateObject)(properties.metrics));
  return errors.wrap("supplied properties not correct for \"EventDimensionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignEventDimensionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignEventDimensionsPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.objectToCloudFormation(properties.attributes),
    "EventType": convertCfnCampaignSetDimensionPropertyToCloudFormation(properties.eventType),
    "Metrics": cdk.objectToCloudFormation(properties.metrics)
  };
}

// @ts-ignore TS6133
function CfnCampaignEventDimensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.EventDimensionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.EventDimensionsProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined));
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? CfnCampaignSetDimensionPropertyFromCloudFormation(properties.EventType) : undefined));
  ret.addPropertyResult("metrics", "Metrics", (properties.Metrics != null ? cfn_parse.FromCloudFormation.getAny(properties.Metrics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignEventFilterProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignEventFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignEventFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", CfnCampaignEventDimensionsPropertyValidator)(properties.dimensions));
  errors.collect(cdk.propertyValidator("filterType", cdk.validateString)(properties.filterType));
  return errors.wrap("supplied properties not correct for \"CampaignEventFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignEventFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignEventFilterPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": convertCfnCampaignEventDimensionsPropertyToCloudFormation(properties.dimensions),
    "FilterType": cdk.stringToCloudFormation(properties.filterType)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignEventFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignEventFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignEventFilterProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? CfnCampaignEventDimensionsPropertyFromCloudFormation(properties.Dimensions) : undefined));
  ret.addPropertyResult("filterType", "FilterType", (properties.FilterType != null ? cfn_parse.FromCloudFormation.getString(properties.FilterType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endTime", cdk.validateString)(properties.endTime));
  errors.collect(cdk.propertyValidator("eventFilter", CfnCampaignCampaignEventFilterPropertyValidator)(properties.eventFilter));
  errors.collect(cdk.propertyValidator("frequency", cdk.validateString)(properties.frequency));
  errors.collect(cdk.propertyValidator("isLocalTime", cdk.validateBoolean)(properties.isLocalTime));
  errors.collect(cdk.propertyValidator("quietTime", CfnCampaignQuietTimePropertyValidator)(properties.quietTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignSchedulePropertyValidator(properties).assertSuccess();
  return {
    "EndTime": cdk.stringToCloudFormation(properties.endTime),
    "EventFilter": convertCfnCampaignCampaignEventFilterPropertyToCloudFormation(properties.eventFilter),
    "Frequency": cdk.stringToCloudFormation(properties.frequency),
    "IsLocalTime": cdk.booleanToCloudFormation(properties.isLocalTime),
    "QuietTime": convertCfnCampaignQuietTimePropertyToCloudFormation(properties.quietTime),
    "StartTime": cdk.stringToCloudFormation(properties.startTime),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone)
  };
}

// @ts-ignore TS6133
function CfnCampaignSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ScheduleProperty>();
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? cfn_parse.FromCloudFormation.getString(properties.EndTime) : undefined));
  ret.addPropertyResult("eventFilter", "EventFilter", (properties.EventFilter != null ? CfnCampaignCampaignEventFilterPropertyFromCloudFormation(properties.EventFilter) : undefined));
  ret.addPropertyResult("frequency", "Frequency", (properties.Frequency != null ? cfn_parse.FromCloudFormation.getString(properties.Frequency) : undefined));
  ret.addPropertyResult("isLocalTime", "IsLocalTime", (properties.IsLocalTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsLocalTime) : undefined));
  ret.addPropertyResult("quietTime", "QuietTime", (properties.QuietTime != null ? CfnCampaignQuietTimePropertyFromCloudFormation(properties.QuietTime) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomDeliveryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomDeliveryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCustomDeliveryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryUri", cdk.validateString)(properties.deliveryUri));
  errors.collect(cdk.propertyValidator("endpointTypes", cdk.listValidator(cdk.validateString))(properties.endpointTypes));
  return errors.wrap("supplied properties not correct for \"CustomDeliveryConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCustomDeliveryConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryUri": cdk.stringToCloudFormation(properties.deliveryUri),
    "EndpointTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.endpointTypes)
  };
}

// @ts-ignore TS6133
function CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CustomDeliveryConfigurationProperty>();
  ret.addPropertyResult("deliveryUri", "DeliveryUri", (properties.DeliveryUri != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryUri) : undefined));
  ret.addPropertyResult("endpointTypes", "EndpointTypes", (properties.EndpointTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EndpointTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WriteTreatmentResourceProperty`
 *
 * @param properties - the TypeScript properties of a `WriteTreatmentResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignWriteTreatmentResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customDeliveryConfiguration", CfnCampaignCustomDeliveryConfigurationPropertyValidator)(properties.customDeliveryConfiguration));
  errors.collect(cdk.propertyValidator("messageConfiguration", CfnCampaignMessageConfigurationPropertyValidator)(properties.messageConfiguration));
  errors.collect(cdk.propertyValidator("schedule", CfnCampaignSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("sizePercent", cdk.validateNumber)(properties.sizePercent));
  errors.collect(cdk.propertyValidator("templateConfiguration", CfnCampaignTemplateConfigurationPropertyValidator)(properties.templateConfiguration));
  errors.collect(cdk.propertyValidator("treatmentDescription", cdk.validateString)(properties.treatmentDescription));
  errors.collect(cdk.propertyValidator("treatmentName", cdk.validateString)(properties.treatmentName));
  return errors.wrap("supplied properties not correct for \"WriteTreatmentResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignWriteTreatmentResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignWriteTreatmentResourcePropertyValidator(properties).assertSuccess();
  return {
    "CustomDeliveryConfiguration": convertCfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties.customDeliveryConfiguration),
    "MessageConfiguration": convertCfnCampaignMessageConfigurationPropertyToCloudFormation(properties.messageConfiguration),
    "Schedule": convertCfnCampaignSchedulePropertyToCloudFormation(properties.schedule),
    "SizePercent": cdk.numberToCloudFormation(properties.sizePercent),
    "TemplateConfiguration": convertCfnCampaignTemplateConfigurationPropertyToCloudFormation(properties.templateConfiguration),
    "TreatmentDescription": cdk.stringToCloudFormation(properties.treatmentDescription),
    "TreatmentName": cdk.stringToCloudFormation(properties.treatmentName)
  };
}

// @ts-ignore TS6133
function CfnCampaignWriteTreatmentResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.WriteTreatmentResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.WriteTreatmentResourceProperty>();
  ret.addPropertyResult("customDeliveryConfiguration", "CustomDeliveryConfiguration", (properties.CustomDeliveryConfiguration != null ? CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties.CustomDeliveryConfiguration) : undefined));
  ret.addPropertyResult("messageConfiguration", "MessageConfiguration", (properties.MessageConfiguration != null ? CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties.MessageConfiguration) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnCampaignSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("sizePercent", "SizePercent", (properties.SizePercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizePercent) : undefined));
  ret.addPropertyResult("templateConfiguration", "TemplateConfiguration", (properties.TemplateConfiguration != null ? CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties.TemplateConfiguration) : undefined));
  ret.addPropertyResult("treatmentDescription", "TreatmentDescription", (properties.TreatmentDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentDescription) : undefined));
  ret.addPropertyResult("treatmentName", "TreatmentName", (properties.TreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LimitsProperty`
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignLimitsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("daily", cdk.validateNumber)(properties.daily));
  errors.collect(cdk.propertyValidator("maximumDuration", cdk.validateNumber)(properties.maximumDuration));
  errors.collect(cdk.propertyValidator("messagesPerSecond", cdk.validateNumber)(properties.messagesPerSecond));
  errors.collect(cdk.propertyValidator("session", cdk.validateNumber)(properties.session));
  errors.collect(cdk.propertyValidator("total", cdk.validateNumber)(properties.total));
  return errors.wrap("supplied properties not correct for \"LimitsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignLimitsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignLimitsPropertyValidator(properties).assertSuccess();
  return {
    "Daily": cdk.numberToCloudFormation(properties.daily),
    "MaximumDuration": cdk.numberToCloudFormation(properties.maximumDuration),
    "MessagesPerSecond": cdk.numberToCloudFormation(properties.messagesPerSecond),
    "Session": cdk.numberToCloudFormation(properties.session),
    "Total": cdk.numberToCloudFormation(properties.total)
  };
}

// @ts-ignore TS6133
function CfnCampaignLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.LimitsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.LimitsProperty>();
  ret.addPropertyResult("daily", "Daily", (properties.Daily != null ? cfn_parse.FromCloudFormation.getNumber(properties.Daily) : undefined));
  ret.addPropertyResult("maximumDuration", "MaximumDuration", (properties.MaximumDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumDuration) : undefined));
  ret.addPropertyResult("messagesPerSecond", "MessagesPerSecond", (properties.MessagesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessagesPerSecond) : undefined));
  ret.addPropertyResult("session", "Session", (properties.Session != null ? cfn_parse.FromCloudFormation.getNumber(properties.Session) : undefined));
  ret.addPropertyResult("total", "Total", (properties.Total != null ? cfn_parse.FromCloudFormation.getNumber(properties.Total) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CampaignHookProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignCampaignHookPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaFunctionName", cdk.validateString)(properties.lambdaFunctionName));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("webUrl", cdk.validateString)(properties.webUrl));
  return errors.wrap("supplied properties not correct for \"CampaignHookProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignCampaignHookPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignCampaignHookPropertyValidator(properties).assertSuccess();
  return {
    "LambdaFunctionName": cdk.stringToCloudFormation(properties.lambdaFunctionName),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "WebUrl": cdk.stringToCloudFormation(properties.webUrl)
  };
}

// @ts-ignore TS6133
function CfnCampaignCampaignHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignHookProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignHookProperty>();
  ret.addPropertyResult("lambdaFunctionName", "LambdaFunctionName", (properties.LambdaFunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionName) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("webUrl", "WebUrl", (properties.WebUrl != null ? cfn_parse.FromCloudFormation.getString(properties.WebUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalTreatments", cdk.listValidator(CfnCampaignWriteTreatmentResourcePropertyValidator))(properties.additionalTreatments));
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("campaignHook", CfnCampaignCampaignHookPropertyValidator)(properties.campaignHook));
  errors.collect(cdk.propertyValidator("customDeliveryConfiguration", CfnCampaignCustomDeliveryConfigurationPropertyValidator)(properties.customDeliveryConfiguration));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("holdoutPercent", cdk.validateNumber)(properties.holdoutPercent));
  errors.collect(cdk.propertyValidator("isPaused", cdk.validateBoolean)(properties.isPaused));
  errors.collect(cdk.propertyValidator("limits", CfnCampaignLimitsPropertyValidator)(properties.limits));
  errors.collect(cdk.propertyValidator("messageConfiguration", CfnCampaignMessageConfigurationPropertyValidator)(properties.messageConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", CfnCampaignSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("segmentId", cdk.requiredValidator)(properties.segmentId));
  errors.collect(cdk.propertyValidator("segmentId", cdk.validateString)(properties.segmentId));
  errors.collect(cdk.propertyValidator("segmentVersion", cdk.validateNumber)(properties.segmentVersion));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("templateConfiguration", CfnCampaignTemplateConfigurationPropertyValidator)(properties.templateConfiguration));
  errors.collect(cdk.propertyValidator("treatmentDescription", cdk.validateString)(properties.treatmentDescription));
  errors.collect(cdk.propertyValidator("treatmentName", cdk.validateString)(properties.treatmentName));
  return errors.wrap("supplied properties not correct for \"CfnCampaignProps\"");
}

// @ts-ignore TS6133
function convertCfnCampaignPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignPropsValidator(properties).assertSuccess();
  return {
    "AdditionalTreatments": cdk.listMapper(convertCfnCampaignWriteTreatmentResourcePropertyToCloudFormation)(properties.additionalTreatments),
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "CampaignHook": convertCfnCampaignCampaignHookPropertyToCloudFormation(properties.campaignHook),
    "CustomDeliveryConfiguration": convertCfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties.customDeliveryConfiguration),
    "Description": cdk.stringToCloudFormation(properties.description),
    "HoldoutPercent": cdk.numberToCloudFormation(properties.holdoutPercent),
    "IsPaused": cdk.booleanToCloudFormation(properties.isPaused),
    "Limits": convertCfnCampaignLimitsPropertyToCloudFormation(properties.limits),
    "MessageConfiguration": convertCfnCampaignMessageConfigurationPropertyToCloudFormation(properties.messageConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "Schedule": convertCfnCampaignSchedulePropertyToCloudFormation(properties.schedule),
    "SegmentId": cdk.stringToCloudFormation(properties.segmentId),
    "SegmentVersion": cdk.numberToCloudFormation(properties.segmentVersion),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TemplateConfiguration": convertCfnCampaignTemplateConfigurationPropertyToCloudFormation(properties.templateConfiguration),
    "TreatmentDescription": cdk.stringToCloudFormation(properties.treatmentDescription),
    "TreatmentName": cdk.stringToCloudFormation(properties.treatmentName)
  };
}

// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaignProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaignProps>();
  ret.addPropertyResult("additionalTreatments", "AdditionalTreatments", (properties.AdditionalTreatments != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignWriteTreatmentResourcePropertyFromCloudFormation)(properties.AdditionalTreatments) : undefined));
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("campaignHook", "CampaignHook", (properties.CampaignHook != null ? CfnCampaignCampaignHookPropertyFromCloudFormation(properties.CampaignHook) : undefined));
  ret.addPropertyResult("customDeliveryConfiguration", "CustomDeliveryConfiguration", (properties.CustomDeliveryConfiguration != null ? CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties.CustomDeliveryConfiguration) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("holdoutPercent", "HoldoutPercent", (properties.HoldoutPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.HoldoutPercent) : undefined));
  ret.addPropertyResult("isPaused", "IsPaused", (properties.IsPaused != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPaused) : undefined));
  ret.addPropertyResult("limits", "Limits", (properties.Limits != null ? CfnCampaignLimitsPropertyFromCloudFormation(properties.Limits) : undefined));
  ret.addPropertyResult("messageConfiguration", "MessageConfiguration", (properties.MessageConfiguration != null ? CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties.MessageConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnCampaignSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("segmentId", "SegmentId", (properties.SegmentId != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentId) : undefined));
  ret.addPropertyResult("segmentVersion", "SegmentVersion", (properties.SegmentVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentVersion) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("templateConfiguration", "TemplateConfiguration", (properties.TemplateConfiguration != null ? CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties.TemplateConfiguration) : undefined));
  ret.addPropertyResult("treatmentDescription", "TreatmentDescription", (properties.TreatmentDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentDescription) : undefined));
  ret.addPropertyResult("treatmentName", "TreatmentName", (properties.TreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttributeDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignAttributeDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeType", cdk.validateString)(properties.attributeType));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"AttributeDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignAttributeDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignAttributeDimensionPropertyValidator(properties).assertSuccess();
  return {
    "AttributeType": cdk.stringToCloudFormation(properties.attributeType),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnCampaignAttributeDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.AttributeDimensionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.AttributeDimensionProperty>();
  ret.addPropertyResult("attributeType", "AttributeType", (properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnCampaignMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MetricDimensionProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the email channel to send email to users. Before you can use Amazon Pinpoint to send email, you must enable the email channel for an Amazon Pinpoint application.
 *
 * The EmailChannel resource represents the status, identity, and other settings of the email channel for an application
 *
 * @cloudformationResource AWS::Pinpoint::EmailChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html
 */
export class CfnEmailChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::EmailChannel";

  /**
   * Build a CfnEmailChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEmailChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEmailChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEmailChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the email channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that you're specifying the email channel for.
   */
  public applicationId: string;

  /**
   * The [Amazon SES configuration set](https://docs.aws.amazon.com/ses/latest/APIReference/API_ConfigurationSet.html) that you want to apply to messages that you send through the channel.
   */
  public configurationSet?: string;

  /**
   * Specifies whether to enable the email channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The verified email address that you want to send email from when you send email through the channel.
   */
  public fromAddress: string;

  /**
   * The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that you want to use when you send email through the channel.
   */
  public identity: string;

  /**
   * The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
   */
  public roleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEmailChannelProps) {
    super(scope, id, {
      "type": CfnEmailChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "fromAddress", this);
    cdk.requireProperty(props, "identity", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.configurationSet = props.configurationSet;
    this.enabled = props.enabled;
    this.fromAddress = props.fromAddress;
    this.identity = props.identity;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "configurationSet": this.configurationSet,
      "enabled": this.enabled,
      "fromAddress": this.fromAddress,
      "identity": this.identity,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEmailChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEmailChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEmailChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html
 */
export interface CfnEmailChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that you're specifying the email channel for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The [Amazon SES configuration set](https://docs.aws.amazon.com/ses/latest/APIReference/API_ConfigurationSet.html) that you want to apply to messages that you send through the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-configurationset
   */
  readonly configurationSet?: string;

  /**
   * Specifies whether to enable the email channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The verified email address that you want to send email from when you send email through the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-fromaddress
   */
  readonly fromAddress: string;

  /**
   * The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that you want to use when you send email through the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-identity
   */
  readonly identity: string;

  /**
   * The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-rolearn
   */
  readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEmailChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnEmailChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("configurationSet", cdk.validateString)(properties.configurationSet));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("fromAddress", cdk.requiredValidator)(properties.fromAddress));
  errors.collect(cdk.propertyValidator("fromAddress", cdk.validateString)(properties.fromAddress));
  errors.collect(cdk.propertyValidator("identity", cdk.requiredValidator)(properties.identity));
  errors.collect(cdk.propertyValidator("identity", cdk.validateString)(properties.identity));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnEmailChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnEmailChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ConfigurationSet": cdk.stringToCloudFormation(properties.configurationSet),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "FromAddress": cdk.stringToCloudFormation(properties.fromAddress),
    "Identity": cdk.stringToCloudFormation(properties.identity),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnEmailChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("configurationSet", "ConfigurationSet", (properties.ConfigurationSet != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSet) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("fromAddress", "FromAddress", (properties.FromAddress != null ? cfn_parse.FromCloudFormation.getString(properties.FromAddress) : undefined));
  ret.addPropertyResult("identity", "Identity", (properties.Identity != null ? cfn_parse.FromCloudFormation.getString(properties.Identity) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a message template that you can use in messages that are sent through the email channel.
 *
 * A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::EmailTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html
 */
export class CfnEmailTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::EmailTemplate";

  /**
   * Build a CfnEmailTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEmailTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEmailTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEmailTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the message template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   */
  public defaultSubstitutions?: string;

  /**
   * The message body, in HTML format, to use in email messages that are based on the message template.
   */
  public htmlPart?: string;

  /**
   * The subject line, or title, to use in email messages that are based on the message template.
   */
  public subject: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * A custom description of the message template.
   */
  public templateDescription?: string;

  /**
   * The name of the message template.
   */
  public templateName: string;

  /**
   * The message body, in plain text format, to use in email messages that are based on the message template.
   */
  public textPart?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEmailTemplateProps) {
    super(scope, id, {
      "type": CfnEmailTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "subject", this);
    cdk.requireProperty(props, "templateName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.defaultSubstitutions = props.defaultSubstitutions;
    this.htmlPart = props.htmlPart;
    this.subject = props.subject;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::EmailTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateDescription = props.templateDescription;
    this.templateName = props.templateName;
    this.textPart = props.textPart;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultSubstitutions": this.defaultSubstitutions,
      "htmlPart": this.htmlPart,
      "subject": this.subject,
      "tags": this.tags.renderTags(),
      "templateDescription": this.templateDescription,
      "templateName": this.templateName,
      "textPart": this.textPart
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEmailTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEmailTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEmailTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html
 */
export interface CfnEmailTemplateProps {
  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   *
   * This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-defaultsubstitutions
   */
  readonly defaultSubstitutions?: string;

  /**
   * The message body, in HTML format, to use in email messages that are based on the message template.
   *
   * We recommend using HTML format for email clients that render HTML content. You can include links, formatted text, and more in an HTML message.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-htmlpart
   */
  readonly htmlPart?: string;

  /**
   * The subject line, or title, to use in email messages that are based on the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-subject
   */
  readonly subject: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-tags
   */
  readonly tags?: any;

  /**
   * A custom description of the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatedescription
   */
  readonly templateDescription?: string;

  /**
   * The name of the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatename
   */
  readonly templateName: string;

  /**
   * The message body, in plain text format, to use in email messages that are based on the message template.
   *
   * We recommend using plain text format for email clients that don't render HTML content and clients that are connected to high-latency networks, such as mobile devices.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-textpart
   */
  readonly textPart?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEmailTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnEmailTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultSubstitutions", cdk.validateString)(properties.defaultSubstitutions));
  errors.collect(cdk.propertyValidator("htmlPart", cdk.validateString)(properties.htmlPart));
  errors.collect(cdk.propertyValidator("subject", cdk.requiredValidator)(properties.subject));
  errors.collect(cdk.propertyValidator("subject", cdk.validateString)(properties.subject));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("templateDescription", cdk.validateString)(properties.templateDescription));
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  errors.collect(cdk.propertyValidator("textPart", cdk.validateString)(properties.textPart));
  return errors.wrap("supplied properties not correct for \"CfnEmailTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnEmailTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailTemplatePropsValidator(properties).assertSuccess();
  return {
    "DefaultSubstitutions": cdk.stringToCloudFormation(properties.defaultSubstitutions),
    "HtmlPart": cdk.stringToCloudFormation(properties.htmlPart),
    "Subject": cdk.stringToCloudFormation(properties.subject),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TemplateDescription": cdk.stringToCloudFormation(properties.templateDescription),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName),
    "TextPart": cdk.stringToCloudFormation(properties.textPart)
  };
}

// @ts-ignore TS6133
function CfnEmailTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailTemplateProps>();
  ret.addPropertyResult("defaultSubstitutions", "DefaultSubstitutions", (properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined));
  ret.addPropertyResult("htmlPart", "HtmlPart", (properties.HtmlPart != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlPart) : undefined));
  ret.addPropertyResult("subject", "Subject", (properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("templateDescription", "TemplateDescription", (properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addPropertyResult("textPart", "TextPart", (properties.TextPart != null ? cfn_parse.FromCloudFormation.getString(properties.TextPart) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new event stream for an application or updates the settings of an existing event stream for an application.
 *
 * @cloudformationResource AWS::Pinpoint::EventStream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html
 */
export class CfnEventStream extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::EventStream";

  /**
   * Build a CfnEventStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventStream(scope, id, propsResult.value);
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
   * The unique identifier for the Amazon Pinpoint application that you want to export data from.
   */
  public applicationId: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream that you want to publish event data to.
   */
  public destinationStreamArn: string;

  /**
   * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventStreamProps) {
    super(scope, id, {
      "type": CfnEventStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "destinationStreamArn", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.destinationStreamArn = props.destinationStreamArn;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "destinationStreamArn": this.destinationStreamArn,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventStreamPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEventStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html
 */
export interface CfnEventStreamProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that you want to export data from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-applicationid
   */
  readonly applicationId: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream that you want to publish event data to.
   *
   * For a Kinesis data stream, the ARN format is: `arn:aws:kinesis: region : account-id :stream/ stream_name`
   *
   * For a Kinesis Data Firehose delivery stream, the ARN format is: `arn:aws:firehose: region : account-id :deliverystream/ stream_name`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-destinationstreamarn
   */
  readonly destinationStreamArn: string;

  /**
   * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnEventStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("destinationStreamArn", cdk.requiredValidator)(properties.destinationStreamArn));
  errors.collect(cdk.propertyValidator("destinationStreamArn", cdk.validateString)(properties.destinationStreamArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnEventStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnEventStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventStreamPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "DestinationStreamArn": cdk.stringToCloudFormation(properties.destinationStreamArn),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnEventStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventStreamProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("destinationStreamArn", "DestinationStreamArn", (properties.DestinationStreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationStreamArn) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * You can use the GCM channel to send push notification messages to the Firebase Cloud Messaging (FCM) service, which replaced the Google Cloud Messaging (GCM) service. Before you use Amazon Pinpoint to send notifications to FCM, you have to enable the GCM channel for an Amazon Pinpoint application.
 *
 * The GCMChannel resource represents the status and authentication settings of the GCM channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::GCMChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html
 */
export class CfnGCMChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::GCMChannel";

  /**
   * Build a CfnGCMChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGCMChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGCMChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGCMChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the GCM channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Web API key, also called the *server key* , that you received from Google to communicate with Google services.
   */
  public apiKey?: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the GCM channel applies to.
   */
  public applicationId: string;

  /**
   * The default authentication method used for GCM.
   */
  public defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the GCM channel for the Amazon Pinpoint application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The contents of the JSON file provided by Google during registration in order to generate an access token for authentication.
   */
  public serviceJson?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGCMChannelProps) {
    super(scope, id, {
      "type": CfnGCMChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiKey = props.apiKey;
    this.applicationId = props.applicationId;
    this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
    this.enabled = props.enabled;
    this.serviceJson = props.serviceJson;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiKey": this.apiKey,
      "applicationId": this.applicationId,
      "defaultAuthenticationMethod": this.defaultAuthenticationMethod,
      "enabled": this.enabled,
      "serviceJson": this.serviceJson
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGCMChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGCMChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGCMChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html
 */
export interface CfnGCMChannelProps {
  /**
   * The Web API key, also called the *server key* , that you received from Google to communicate with Google services.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-apikey
   */
  readonly apiKey?: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the GCM channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-applicationid
   */
  readonly applicationId: string;

  /**
   * The default authentication method used for GCM.
   *
   * Values are either "TOKEN" or "KEY". Defaults to "KEY".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-defaultauthenticationmethod
   */
  readonly defaultAuthenticationMethod?: string;

  /**
   * Specifies whether to enable the GCM channel for the Amazon Pinpoint application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The contents of the JSON file provided by Google during registration in order to generate an access token for authentication.
   *
   * For more information see [Migrate from legacy FCM APIs to HTTP v1](https://docs.aws.amazon.com/https://firebase.google.com/docs/cloud-messaging/migrate-v1) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-servicejson
   */
  readonly serviceJson?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGCMChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnGCMChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGCMChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("defaultAuthenticationMethod", cdk.validateString)(properties.defaultAuthenticationMethod));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("serviceJson", cdk.validateString)(properties.serviceJson));
  return errors.wrap("supplied properties not correct for \"CfnGCMChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnGCMChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGCMChannelPropsValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey),
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "DefaultAuthenticationMethod": cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "ServiceJson": cdk.stringToCloudFormation(properties.serviceJson)
  };
}

// @ts-ignore TS6133
function CfnGCMChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGCMChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGCMChannelProps>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("defaultAuthenticationMethod", "DefaultAuthenticationMethod", (properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("serviceJson", "ServiceJson", (properties.ServiceJson != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceJson) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a message template that you can use to send in-app messages.
 *
 * A message template is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications. The In-App channel is unavailable in AWS GovCloud (US).
 *
 * @cloudformationResource AWS::Pinpoint::InAppTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html
 */
export class CfnInAppTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::InAppTemplate";

  /**
   * Build a CfnInAppTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInAppTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInAppTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInAppTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the message template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An object that contains information about the content of an in-app message, including its title and body text, text colors, background colors, images, buttons, and behaviors.
   */
  public content?: Array<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
   */
  public customConfig?: any | cdk.IResolvable;

  /**
   * A string that determines the appearance of the in-app message. You can specify one of the following:.
   */
  public layout?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * An optional description of the in-app template.
   */
  public templateDescription?: string;

  /**
   * The name of the in-app message template.
   */
  public templateName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInAppTemplateProps) {
    super(scope, id, {
      "type": CfnInAppTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "templateName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.content = props.content;
    this.customConfig = props.customConfig;
    this.layout = props.layout;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::InAppTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateDescription = props.templateDescription;
    this.templateName = props.templateName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "content": this.content,
      "customConfig": this.customConfig,
      "layout": this.layout,
      "tags": this.tags.renderTags(),
      "templateDescription": this.templateDescription,
      "templateName": this.templateName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInAppTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInAppTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnInAppTemplate {
  /**
   * Specifies the configuration of an in-app message, including its header, body, buttons, colors, and images.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html
   */
  export interface InAppMessageContentProperty {
    /**
     * The background color for an in-app message banner, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-backgroundcolor
     */
    readonly backgroundColor?: string;

    /**
     * An object that contains configuration information about the header or title text of the in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-bodyconfig
     */
    readonly bodyConfig?: CfnInAppTemplate.BodyConfigProperty | cdk.IResolvable;

    /**
     * An object that contains configuration information about the header or title text of the in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-headerconfig
     */
    readonly headerConfig?: CfnInAppTemplate.HeaderConfigProperty | cdk.IResolvable;

    /**
     * The URL of the image that appears on an in-app message banner.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-imageurl
     */
    readonly imageUrl?: string;

    /**
     * An object that contains configuration information about the primary button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-primarybtn
     */
    readonly primaryBtn?: CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable;

    /**
     * An object that contains configuration information about the secondary button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-secondarybtn
     */
    readonly secondaryBtn?: CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable;
  }

  /**
   * Specifies the configuration of the main body text of the in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html
   */
  export interface BodyConfigProperty {
    /**
     * The text alignment of the main body text of the message.
     *
     * Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-alignment
     */
    readonly alignment?: string;

    /**
     * The main body text of the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-body
     */
    readonly body?: string;

    /**
     * The color of the body text, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-textcolor
     */
    readonly textColor?: string;
  }

  /**
   * Specifies the behavior of buttons that appear in an in-app message template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html
   */
  export interface ButtonConfigProperty {
    /**
     * Optional button configuration to use for in-app messages sent to Android devices.
     *
     * This button configuration overrides the default button configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-android
     */
    readonly android?: cdk.IResolvable | CfnInAppTemplate.OverrideButtonConfigurationProperty;

    /**
     * Specifies the default behavior of a button that appears in an in-app message.
     *
     * You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-defaultconfig
     */
    readonly defaultConfig?: CfnInAppTemplate.DefaultButtonConfigurationProperty | cdk.IResolvable;

    /**
     * Optional button configuration to use for in-app messages sent to iOS devices.
     *
     * This button configuration overrides the default button configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-ios
     */
    readonly ios?: cdk.IResolvable | CfnInAppTemplate.OverrideButtonConfigurationProperty;

    /**
     * Optional button configuration to use for in-app messages sent to web applications.
     *
     * This button configuration overrides the default button configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-web
     */
    readonly web?: cdk.IResolvable | CfnInAppTemplate.OverrideButtonConfigurationProperty;
  }

  /**
   * Specifies the configuration of a button with settings that are specific to a certain device type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html
   */
  export interface OverrideButtonConfigurationProperty {
    /**
     * The action that occurs when a recipient chooses a button in an in-app message.
     *
     * You can specify one of the following:
     *
     * - `LINK` – A link to a web destination.
     * - `DEEP_LINK` – A link to a specific page in an application.
     * - `CLOSE` – Dismisses the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html#cfn-pinpoint-inapptemplate-overridebuttonconfiguration-buttonaction
     */
    readonly buttonAction?: string;

    /**
     * The destination (such as a URL) for a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html#cfn-pinpoint-inapptemplate-overridebuttonconfiguration-link
     */
    readonly link?: string;
  }

  /**
   * Specifies the default behavior of a button that appears in an in-app message.
   *
   * You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html
   */
  export interface DefaultButtonConfigurationProperty {
    /**
     * The background color of a button, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-backgroundcolor
     */
    readonly backgroundColor?: string;

    /**
     * The border radius of a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-borderradius
     */
    readonly borderRadius?: number;

    /**
     * The action that occurs when a recipient chooses a button in an in-app message.
     *
     * You can specify one of the following:
     *
     * - `LINK` – A link to a web destination.
     * - `DEEP_LINK` – A link to a specific page in an application.
     * - `CLOSE` – Dismisses the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-buttonaction
     */
    readonly buttonAction?: string;

    /**
     * The destination (such as a URL) for a button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-link
     */
    readonly link?: string;

    /**
     * The text that appears on a button in an in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-text
     */
    readonly text?: string;

    /**
     * The color of the body text in a button, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-textcolor
     */
    readonly textColor?: string;
  }

  /**
   * Specifies the configuration and content of the header or title text of the in-app message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html
   */
  export interface HeaderConfigProperty {
    /**
     * The text alignment of the title of the message.
     *
     * Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-alignment
     */
    readonly alignment?: string;

    /**
     * The title text of the in-app message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-header
     */
    readonly header?: string;

    /**
     * The color of the title text, expressed as a hex color code (such as #000000 for black).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-textcolor
     */
    readonly textColor?: string;
  }
}

/**
 * Properties for defining a `CfnInAppTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html
 */
export interface CfnInAppTemplateProps {
  /**
   * An object that contains information about the content of an in-app message, including its title and body text, text colors, background colors, images, buttons, and behaviors.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-content
   */
  readonly content?: Array<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-customconfig
   */
  readonly customConfig?: any | cdk.IResolvable;

  /**
   * A string that determines the appearance of the in-app message. You can specify one of the following:.
   *
   * - `BOTTOM_BANNER` – a message that appears as a banner at the bottom of the page.
   * - `TOP_BANNER` – a message that appears as a banner at the top of the page.
   * - `OVERLAYS` – a message that covers entire screen.
   * - `MOBILE_FEED` – a message that appears in a window in front of the page.
   * - `MIDDLE_BANNER` – a message that appears as a banner in the middle of the page.
   * - `CAROUSEL` – a scrollable layout of up to five unique messages.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-layout
   */
  readonly layout?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-tags
   */
  readonly tags?: any;

  /**
   * An optional description of the in-app template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatedescription
   */
  readonly templateDescription?: string;

  /**
   * The name of the in-app message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatename
   */
  readonly templateName: string;
}

/**
 * Determine whether the given properties match those of a `BodyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BodyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateBodyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alignment", cdk.validateString)(properties.alignment));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"BodyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateBodyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateBodyConfigPropertyValidator(properties).assertSuccess();
  return {
    "Alignment": cdk.stringToCloudFormation(properties.alignment),
    "Body": cdk.stringToCloudFormation(properties.body),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateBodyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.BodyConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.BodyConfigProperty>();
  ret.addPropertyResult("alignment", "Alignment", (properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OverrideButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateOverrideButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("buttonAction", cdk.validateString)(properties.buttonAction));
  errors.collect(cdk.propertyValidator("link", cdk.validateString)(properties.link));
  return errors.wrap("supplied properties not correct for \"OverrideButtonConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateOverrideButtonConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ButtonAction": cdk.stringToCloudFormation(properties.buttonAction),
    "Link": cdk.stringToCloudFormation(properties.link)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInAppTemplate.OverrideButtonConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.OverrideButtonConfigurationProperty>();
  ret.addPropertyResult("buttonAction", "ButtonAction", (properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined));
  ret.addPropertyResult("link", "Link", (properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateDefaultButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backgroundColor", cdk.validateString)(properties.backgroundColor));
  errors.collect(cdk.propertyValidator("borderRadius", cdk.validateNumber)(properties.borderRadius));
  errors.collect(cdk.propertyValidator("buttonAction", cdk.validateString)(properties.buttonAction));
  errors.collect(cdk.propertyValidator("link", cdk.validateString)(properties.link));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"DefaultButtonConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateDefaultButtonConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateDefaultButtonConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BackgroundColor": cdk.stringToCloudFormation(properties.backgroundColor),
    "BorderRadius": cdk.numberToCloudFormation(properties.borderRadius),
    "ButtonAction": cdk.stringToCloudFormation(properties.buttonAction),
    "Link": cdk.stringToCloudFormation(properties.link),
    "Text": cdk.stringToCloudFormation(properties.text),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateDefaultButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.DefaultButtonConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.DefaultButtonConfigurationProperty>();
  ret.addPropertyResult("backgroundColor", "BackgroundColor", (properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined));
  ret.addPropertyResult("borderRadius", "BorderRadius", (properties.BorderRadius != null ? cfn_parse.FromCloudFormation.getNumber(properties.BorderRadius) : undefined));
  ret.addPropertyResult("buttonAction", "ButtonAction", (properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined));
  ret.addPropertyResult("link", "Link", (properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ButtonConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ButtonConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateButtonConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("android", CfnInAppTemplateOverrideButtonConfigurationPropertyValidator)(properties.android));
  errors.collect(cdk.propertyValidator("defaultConfig", CfnInAppTemplateDefaultButtonConfigurationPropertyValidator)(properties.defaultConfig));
  errors.collect(cdk.propertyValidator("ios", CfnInAppTemplateOverrideButtonConfigurationPropertyValidator)(properties.ios));
  errors.collect(cdk.propertyValidator("web", CfnInAppTemplateOverrideButtonConfigurationPropertyValidator)(properties.web));
  return errors.wrap("supplied properties not correct for \"ButtonConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateButtonConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateButtonConfigPropertyValidator(properties).assertSuccess();
  return {
    "Android": convertCfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.android),
    "DefaultConfig": convertCfnInAppTemplateDefaultButtonConfigurationPropertyToCloudFormation(properties.defaultConfig),
    "IOS": convertCfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.ios),
    "Web": convertCfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.web)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.ButtonConfigProperty>();
  ret.addPropertyResult("android", "Android", (properties.Android != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.Android) : undefined));
  ret.addPropertyResult("defaultConfig", "DefaultConfig", (properties.DefaultConfig != null ? CfnInAppTemplateDefaultButtonConfigurationPropertyFromCloudFormation(properties.DefaultConfig) : undefined));
  ret.addPropertyResult("ios", "IOS", (properties.IOS != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.IOS) : undefined));
  ret.addPropertyResult("web", "Web", (properties.Web != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.Web) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alignment", cdk.validateString)(properties.alignment));
  errors.collect(cdk.propertyValidator("header", cdk.validateString)(properties.header));
  errors.collect(cdk.propertyValidator("textColor", cdk.validateString)(properties.textColor));
  return errors.wrap("supplied properties not correct for \"HeaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateHeaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateHeaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "Alignment": cdk.stringToCloudFormation(properties.alignment),
    "Header": cdk.stringToCloudFormation(properties.header),
    "TextColor": cdk.stringToCloudFormation(properties.textColor)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.HeaderConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.HeaderConfigProperty>();
  ret.addPropertyResult("alignment", "Alignment", (properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined));
  ret.addPropertyResult("textColor", "TextColor", (properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InAppMessageContentProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplateInAppMessageContentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backgroundColor", cdk.validateString)(properties.backgroundColor));
  errors.collect(cdk.propertyValidator("bodyConfig", CfnInAppTemplateBodyConfigPropertyValidator)(properties.bodyConfig));
  errors.collect(cdk.propertyValidator("headerConfig", CfnInAppTemplateHeaderConfigPropertyValidator)(properties.headerConfig));
  errors.collect(cdk.propertyValidator("imageUrl", cdk.validateString)(properties.imageUrl));
  errors.collect(cdk.propertyValidator("primaryBtn", CfnInAppTemplateButtonConfigPropertyValidator)(properties.primaryBtn));
  errors.collect(cdk.propertyValidator("secondaryBtn", CfnInAppTemplateButtonConfigPropertyValidator)(properties.secondaryBtn));
  return errors.wrap("supplied properties not correct for \"InAppMessageContentProperty\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplateInAppMessageContentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplateInAppMessageContentPropertyValidator(properties).assertSuccess();
  return {
    "BackgroundColor": cdk.stringToCloudFormation(properties.backgroundColor),
    "BodyConfig": convertCfnInAppTemplateBodyConfigPropertyToCloudFormation(properties.bodyConfig),
    "HeaderConfig": convertCfnInAppTemplateHeaderConfigPropertyToCloudFormation(properties.headerConfig),
    "ImageUrl": cdk.stringToCloudFormation(properties.imageUrl),
    "PrimaryBtn": convertCfnInAppTemplateButtonConfigPropertyToCloudFormation(properties.primaryBtn),
    "SecondaryBtn": convertCfnInAppTemplateButtonConfigPropertyToCloudFormation(properties.secondaryBtn)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplateInAppMessageContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.InAppMessageContentProperty>();
  ret.addPropertyResult("backgroundColor", "BackgroundColor", (properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined));
  ret.addPropertyResult("bodyConfig", "BodyConfig", (properties.BodyConfig != null ? CfnInAppTemplateBodyConfigPropertyFromCloudFormation(properties.BodyConfig) : undefined));
  ret.addPropertyResult("headerConfig", "HeaderConfig", (properties.HeaderConfig != null ? CfnInAppTemplateHeaderConfigPropertyFromCloudFormation(properties.HeaderConfig) : undefined));
  ret.addPropertyResult("imageUrl", "ImageUrl", (properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined));
  ret.addPropertyResult("primaryBtn", "PrimaryBtn", (properties.PrimaryBtn != null ? CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties.PrimaryBtn) : undefined));
  ret.addPropertyResult("secondaryBtn", "SecondaryBtn", (properties.SecondaryBtn != null ? CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties.SecondaryBtn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInAppTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnInAppTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInAppTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.listValidator(CfnInAppTemplateInAppMessageContentPropertyValidator))(properties.content));
  errors.collect(cdk.propertyValidator("customConfig", cdk.validateObject)(properties.customConfig));
  errors.collect(cdk.propertyValidator("layout", cdk.validateString)(properties.layout));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("templateDescription", cdk.validateString)(properties.templateDescription));
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"CfnInAppTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnInAppTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInAppTemplatePropsValidator(properties).assertSuccess();
  return {
    "Content": cdk.listMapper(convertCfnInAppTemplateInAppMessageContentPropertyToCloudFormation)(properties.content),
    "CustomConfig": cdk.objectToCloudFormation(properties.customConfig),
    "Layout": cdk.stringToCloudFormation(properties.layout),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TemplateDescription": cdk.stringToCloudFormation(properties.templateDescription),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnInAppTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplateProps>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getArray(CfnInAppTemplateInAppMessageContentPropertyFromCloudFormation)(properties.Content) : undefined));
  ret.addPropertyResult("customConfig", "CustomConfig", (properties.CustomConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomConfig) : undefined));
  ret.addPropertyResult("layout", "Layout", (properties.Layout != null ? cfn_parse.FromCloudFormation.getString(properties.Layout) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("templateDescription", "TemplateDescription", (properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a message template that you can use in messages that are sent through a push notification channel.
 *
 * A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::PushTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html
 */
export class CfnPushTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::PushTemplate";

  /**
   * Build a CfnPushTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPushTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPushTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPushTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the message template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The message template to use for the ADM (Amazon Device Messaging) channel.
   */
  public adm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The message template to use for the APNs (Apple Push Notification service) channel.
   */
  public apns?: CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The message template to use for the Baidu (Baidu Cloud Push) channel.
   */
  public baidu?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The default message template to use for push notification channels.
   */
  public default?: CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   */
  public defaultSubstitutions?: string;

  /**
   * The message template to use for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service.
   */
  public gcm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * A custom description of the message template.
   */
  public templateDescription?: string;

  /**
   * The name of the message template to use for the message.
   */
  public templateName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPushTemplateProps) {
    super(scope, id, {
      "type": CfnPushTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "templateName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.adm = props.adm;
    this.apns = props.apns;
    this.baidu = props.baidu;
    this.default = props.default;
    this.defaultSubstitutions = props.defaultSubstitutions;
    this.gcm = props.gcm;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::PushTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateDescription = props.templateDescription;
    this.templateName = props.templateName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adm": this.adm,
      "apns": this.apns,
      "baidu": this.baidu,
      "default": this.default,
      "defaultSubstitutions": this.defaultSubstitutions,
      "gcm": this.gcm,
      "tags": this.tags.renderTags(),
      "templateDescription": this.templateDescription,
      "templateName": this.templateName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPushTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPushTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnPushTemplate {
  /**
   * Specifies channel-specific content and settings for a message template that can be used in push notifications that are sent through the ADM (Amazon Device Messaging), Baidu (Baidu Cloud Push), or GCM (Firebase Cloud Messaging, formerly Google Cloud Messaging) channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html
   */
  export interface AndroidPushNotificationTemplateProperty {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template.
     *
     * Valid values are:
     *
     * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
     * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform.
     * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-action
     */
    readonly action?: string;

    /**
     * The message body to use in a push notification that's based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-body
     */
    readonly body?: string;

    /**
     * The URL of the large icon image to display in the content view of a push notification that's based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-imageiconurl
     */
    readonly imageIconUrl?: string;

    /**
     * The URL of an image to display in a push notification that's based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-imageurl
     */
    readonly imageUrl?: string;

    /**
     * The URL of the small icon image to display in the status bar and the content view of a push notification that's based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-smallimageiconurl
     */
    readonly smallImageIconUrl?: string;

    /**
     * The sound to play when a recipient receives a push notification that's based on the message template.
     *
     * You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in `/res/raw/` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-sound
     */
    readonly sound?: string;

    /**
     * The title to use in a push notification that's based on the message template.
     *
     * This title appears above the notification message on a recipient's device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-title
     */
    readonly title?: string;

    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-url
     */
    readonly url?: string;
  }

  /**
   * Specifies channel-specific content and settings for a message template that can be used in push notifications that are sent through the APNs (Apple Push Notification service) channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html
   */
  export interface APNSPushNotificationTemplateProperty {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template.
     *
     * Valid values are:
     *
     * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
     * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS platform.
     * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-action
     */
    readonly action?: string;

    /**
     * The message body to use in push notifications that are based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-body
     */
    readonly body?: string;

    /**
     * The URL of an image or video to display in push notifications that are based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-mediaurl
     */
    readonly mediaUrl?: string;

    /**
     * The key for the sound to play when the recipient receives a push notification that's based on the message template.
     *
     * The value for this key is the name of a sound file in your app's main bundle or the `Library/Sounds` folder in your app's data container. If the sound file can't be found or you specify `default` for the value, the system plays the default alert sound.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-sound
     */
    readonly sound?: string;

    /**
     * The title to use in push notifications that are based on the message template.
     *
     * This title appears above the notification message on a recipient's device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-title
     */
    readonly title?: string;

    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-url
     */
    readonly url?: string;
  }

  /**
   * Specifies the default settings and content for a message template that can be used in messages that are sent through a push notification channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html
   */
  export interface DefaultPushNotificationTemplateProperty {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template.
     *
     * Valid values are:
     *
     * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
     * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS and Android platforms.
     * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-action
     */
    readonly action?: string;

    /**
     * The message body to use in push notifications that are based on the message template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-body
     */
    readonly body?: string;

    /**
     * The sound to play when a recipient receives a push notification that's based on the message template.
     *
     * You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in `/res/raw/` .
     *
     * For an iOS platform, this value is the key for the name of a sound file in your app's main bundle or the `Library/Sounds` folder in your app's data container. If the sound file can't be found or you specify `default` for the value, the system plays the default alert sound.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-sound
     */
    readonly sound?: string;

    /**
     * The title to use in push notifications that are based on the message template.
     *
     * This title appears above the notification message on a recipient's device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-title
     */
    readonly title?: string;

    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-url
     */
    readonly url?: string;
  }
}

/**
 * Properties for defining a `CfnPushTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html
 */
export interface CfnPushTemplateProps {
  /**
   * The message template to use for the ADM (Amazon Device Messaging) channel.
   *
   * This message template overrides the default template for push notification channels ( `Default` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-adm
   */
  readonly adm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The message template to use for the APNs (Apple Push Notification service) channel.
   *
   * This message template overrides the default template for push notification channels ( `Default` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-apns
   */
  readonly apns?: CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The message template to use for the Baidu (Baidu Cloud Push) channel.
   *
   * This message template overrides the default template for push notification channels ( `Default` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-baidu
   */
  readonly baidu?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * The default message template to use for push notification channels.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-default
   */
  readonly default?: CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   *
   * This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-defaultsubstitutions
   */
  readonly defaultSubstitutions?: string;

  /**
   * The message template to use for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service.
   *
   * This message template overrides the default template for push notification channels ( `Default` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-gcm
   */
  readonly gcm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-tags
   */
  readonly tags?: any;

  /**
   * A custom description of the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatedescription
   */
  readonly templateDescription?: string;

  /**
   * The name of the message template to use for the message.
   *
   * If specified, this value must match the name of an existing message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatename
   */
  readonly templateName: string;
}

/**
 * Determine whether the given properties match those of a `AndroidPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `AndroidPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPushTemplateAndroidPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("imageIconUrl", cdk.validateString)(properties.imageIconUrl));
  errors.collect(cdk.propertyValidator("imageUrl", cdk.validateString)(properties.imageUrl));
  errors.collect(cdk.propertyValidator("smallImageIconUrl", cdk.validateString)(properties.smallImageIconUrl));
  errors.collect(cdk.propertyValidator("sound", cdk.validateString)(properties.sound));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"AndroidPushNotificationTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPushTemplateAndroidPushNotificationTemplatePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Body": cdk.stringToCloudFormation(properties.body),
    "ImageIconUrl": cdk.stringToCloudFormation(properties.imageIconUrl),
    "ImageUrl": cdk.stringToCloudFormation(properties.imageUrl),
    "SmallImageIconUrl": cdk.stringToCloudFormation(properties.smallImageIconUrl),
    "Sound": cdk.stringToCloudFormation(properties.sound),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.AndroidPushNotificationTemplateProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("imageIconUrl", "ImageIconUrl", (properties.ImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIconUrl) : undefined));
  ret.addPropertyResult("imageUrl", "ImageUrl", (properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined));
  ret.addPropertyResult("smallImageIconUrl", "SmallImageIconUrl", (properties.SmallImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SmallImageIconUrl) : undefined));
  ret.addPropertyResult("sound", "Sound", (properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `APNSPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `APNSPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPushTemplateAPNSPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("mediaUrl", cdk.validateString)(properties.mediaUrl));
  errors.collect(cdk.propertyValidator("sound", cdk.validateString)(properties.sound));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"APNSPushNotificationTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnPushTemplateAPNSPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPushTemplateAPNSPushNotificationTemplatePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Body": cdk.stringToCloudFormation(properties.body),
    "MediaUrl": cdk.stringToCloudFormation(properties.mediaUrl),
    "Sound": cdk.stringToCloudFormation(properties.sound),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnPushTemplateAPNSPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.APNSPushNotificationTemplateProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("mediaUrl", "MediaUrl", (properties.MediaUrl != null ? cfn_parse.FromCloudFormation.getString(properties.MediaUrl) : undefined));
  ret.addPropertyResult("sound", "Sound", (properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPushTemplateDefaultPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("sound", cdk.validateString)(properties.sound));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"DefaultPushNotificationTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnPushTemplateDefaultPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPushTemplateDefaultPushNotificationTemplatePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Body": cdk.stringToCloudFormation(properties.body),
    "Sound": cdk.stringToCloudFormation(properties.sound),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnPushTemplateDefaultPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.DefaultPushNotificationTemplateProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("sound", "Sound", (properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPushTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnPushTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPushTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adm", CfnPushTemplateAndroidPushNotificationTemplatePropertyValidator)(properties.adm));
  errors.collect(cdk.propertyValidator("apns", CfnPushTemplateAPNSPushNotificationTemplatePropertyValidator)(properties.apns));
  errors.collect(cdk.propertyValidator("baidu", CfnPushTemplateAndroidPushNotificationTemplatePropertyValidator)(properties.baidu));
  errors.collect(cdk.propertyValidator("default", CfnPushTemplateDefaultPushNotificationTemplatePropertyValidator)(properties.default));
  errors.collect(cdk.propertyValidator("defaultSubstitutions", cdk.validateString)(properties.defaultSubstitutions));
  errors.collect(cdk.propertyValidator("gcm", CfnPushTemplateAndroidPushNotificationTemplatePropertyValidator)(properties.gcm));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("templateDescription", cdk.validateString)(properties.templateDescription));
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"CfnPushTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnPushTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPushTemplatePropsValidator(properties).assertSuccess();
  return {
    "ADM": convertCfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.adm),
    "APNS": convertCfnPushTemplateAPNSPushNotificationTemplatePropertyToCloudFormation(properties.apns),
    "Baidu": convertCfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.baidu),
    "Default": convertCfnPushTemplateDefaultPushNotificationTemplatePropertyToCloudFormation(properties.default),
    "DefaultSubstitutions": cdk.stringToCloudFormation(properties.defaultSubstitutions),
    "GCM": convertCfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.gcm),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TemplateDescription": cdk.stringToCloudFormation(properties.templateDescription),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnPushTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplateProps>();
  ret.addPropertyResult("adm", "ADM", (properties.ADM != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.ADM) : undefined));
  ret.addPropertyResult("apns", "APNS", (properties.APNS != null ? CfnPushTemplateAPNSPushNotificationTemplatePropertyFromCloudFormation(properties.APNS) : undefined));
  ret.addPropertyResult("baidu", "Baidu", (properties.Baidu != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.Baidu) : undefined));
  ret.addPropertyResult("default", "Default", (properties.Default != null ? CfnPushTemplateDefaultPushNotificationTemplatePropertyFromCloudFormation(properties.Default) : undefined));
  ret.addPropertyResult("defaultSubstitutions", "DefaultSubstitutions", (properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined));
  ret.addPropertyResult("gcm", "GCM", (properties.GCM != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.GCM) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("templateDescription", "TemplateDescription", (properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * To send an SMS text message, you send the message through the SMS channel. Before you can use Amazon Pinpoint to send text messages, you have to enable the SMS channel for an Amazon Pinpoint application.
 *
 * The SMSChannel resource represents the status, sender ID, and other settings for the SMS channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::SMSChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html
 */
export class CfnSMSChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::SMSChannel";

  /**
   * Build a CfnSMSChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSMSChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSMSChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSMSChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the SMS channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the SMS channel applies to.
   */
  public applicationId: string;

  /**
   * Specifies whether to enable the SMS channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The identity that you want to display on recipients' devices when they receive messages from the SMS channel.
   */
  public senderId?: string;

  /**
   * The registered short code that you want to use when you send messages through the SMS channel.
   */
  public shortCode?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSMSChannelProps) {
    super(scope, id, {
      "type": CfnSMSChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.enabled = props.enabled;
    this.senderId = props.senderId;
    this.shortCode = props.shortCode;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "enabled": this.enabled,
      "senderId": this.senderId,
      "shortCode": this.shortCode
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSMSChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSMSChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSMSChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html
 */
export interface CfnSMSChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the SMS channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-applicationid
   */
  readonly applicationId: string;

  /**
   * Specifies whether to enable the SMS channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The identity that you want to display on recipients' devices when they receive messages from the SMS channel.
   *
   * > SenderIDs are only supported in certain countries and regions. For more information, see [Supported Countries and Regions](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) in the *Amazon Pinpoint User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-senderid
   */
  readonly senderId?: string;

  /**
   * The registered short code that you want to use when you send messages through the SMS channel.
   *
   * > For information about obtaining a dedicated short code for sending SMS messages, see [Requesting Dedicated Short Codes for SMS Messaging with Amazon Pinpoint](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-awssupport-short-code.html) in the *Amazon Pinpoint User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-shortcode
   */
  readonly shortCode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSMSChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnSMSChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSMSChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("senderId", cdk.validateString)(properties.senderId));
  errors.collect(cdk.propertyValidator("shortCode", cdk.validateString)(properties.shortCode));
  return errors.wrap("supplied properties not correct for \"CfnSMSChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnSMSChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSMSChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "SenderId": cdk.stringToCloudFormation(properties.senderId),
    "ShortCode": cdk.stringToCloudFormation(properties.shortCode)
  };
}

// @ts-ignore TS6133
function CfnSMSChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSMSChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSMSChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("senderId", "SenderId", (properties.SenderId != null ? cfn_parse.FromCloudFormation.getString(properties.SenderId) : undefined));
  ret.addPropertyResult("shortCode", "ShortCode", (properties.ShortCode != null ? cfn_parse.FromCloudFormation.getString(properties.ShortCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Updates the configuration, dimension, and other settings for an existing segment.
 *
 * @cloudformationResource AWS::Pinpoint::Segment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html
 */
export class CfnSegment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::Segment";

  /**
   * Build a CfnSegment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSegment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSegmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSegment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the segment.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the segment.
   *
   * @cloudformationAttribute SegmentId
   */
  public readonly attrSegmentId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the segment is associated with.
   */
  public applicationId: string;

  /**
   * An array that defines the dimensions for the segment.
   */
  public dimensions?: cdk.IResolvable | CfnSegment.SegmentDimensionsProperty;

  /**
   * The name of the segment.
   */
  public name: string;

  /**
   * The segment group to use and the dimensions to apply to the group's base segments in order to build the segment.
   */
  public segmentGroups?: cdk.IResolvable | CfnSegment.SegmentGroupsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSegmentProps) {
    super(scope, id, {
      "type": CfnSegment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrSegmentId = cdk.Token.asString(this.getAtt("SegmentId", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.dimensions = props.dimensions;
    this.name = props.name;
    this.segmentGroups = props.segmentGroups;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::Segment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "dimensions": this.dimensions,
      "name": this.name,
      "segmentGroups": this.segmentGroups,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSegment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSegmentPropsToCloudFormation(props);
  }
}

export namespace CfnSegment {
  /**
   * Specifies the set of segment criteria to evaluate when handling segment groups for the segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html
   */
  export interface SegmentGroupsProperty {
    /**
     * Specifies the set of segment criteria to evaluate when handling segment groups for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html#cfn-pinpoint-segment-segmentgroups-groups
     */
    readonly groups?: Array<CfnSegment.GroupsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies how to handle multiple segment groups for the segment.
     *
     * For example, if the segment includes three segment groups, whether the resulting segment includes endpoints that match all, any, or none of the segment groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html#cfn-pinpoint-segment-segmentgroups-include
     */
    readonly include?: string;
  }

  /**
   * An array that defines the set of segment criteria to evaluate when handling segment groups for the segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-groups.html
   */
  export interface GroupsProperty {
    /**
     * An array that defines the dimensions to include or exclude from the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-groups.html#cfn-pinpoint-segment-groups-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnSegment.SegmentDimensionsProperty> | cdk.IResolvable;

    /**
     * The base segment to build the segment on.
     *
     * A base segment, also called a *source segment* , defines the initial population of endpoints for a segment. When you add dimensions to the segment, Amazon Pinpoint filters the base segment by using the dimensions that you specify.
     *
     * You can specify more than one dimensional segment or only one imported segment. If you specify an imported segment, the segment size estimate that displays on the Amazon Pinpoint console indicates the size of the imported segment without any filters applied to it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-groups.html#cfn-pinpoint-segment-groups-sourcesegments
     */
    readonly sourceSegments?: Array<cdk.IResolvable | CfnSegment.SourceSegmentsProperty> | cdk.IResolvable;

    /**
     * Specifies how to handle multiple base segments for the segment.
     *
     * For example, if you specify three base segments for the segment, whether the resulting segment is based on all, any, or none of the base segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-groups.html#cfn-pinpoint-segment-groups-sourcetype
     */
    readonly sourceType?: string;

    /**
     * Specifies how to handle multiple dimensions for the segment.
     *
     * For example, if you specify three dimensions for the segment, whether the resulting segment includes endpoints that match all, any, or none of the dimensions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-groups.html#cfn-pinpoint-segment-groups-type
     */
    readonly type?: string;
  }

  /**
   * Specifies the dimension settings for a segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html
   */
  export interface SegmentDimensionsProperty {
    /**
     * One or more custom attributes to use as criteria for the segment.
     *
     * For more information see [AttributeDimension](https://docs.aws.amazon.com/pinpoint/latest/apireference/apps-application-id-segments.html#apps-application-id-segments-model-attributedimension)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-attributes
     */
    readonly attributes?: any | cdk.IResolvable;

    /**
     * The behavior-based criteria, such as how recently users have used your app, for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-behavior
     */
    readonly behavior?: CfnSegment.BehaviorProperty | cdk.IResolvable;

    /**
     * The demographic-based criteria, such as device platform, for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-demographic
     */
    readonly demographic?: CfnSegment.DemographicProperty | cdk.IResolvable;

    /**
     * The location-based criteria, such as region or GPS coordinates, for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-location
     */
    readonly location?: cdk.IResolvable | CfnSegment.LocationProperty;

    /**
     * One or more custom metrics to use as criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-metrics
     */
    readonly metrics?: any | cdk.IResolvable;

    /**
     * One or more custom user attributes to use as criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-userattributes
     */
    readonly userAttributes?: any | cdk.IResolvable;
  }

  /**
   * Specifies demographic-based criteria, such as device platform, for the segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html
   */
  export interface DemographicProperty {
    /**
     * The app version criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-appversion
     */
    readonly appVersion?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The channel criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-channel
     */
    readonly channel?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The device type criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-devicetype
     */
    readonly deviceType?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The device make criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-make
     */
    readonly make?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The device model criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-model
     */
    readonly model?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The device platform criteria for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-demographic.html#cfn-pinpoint-segment-demographic-platform
     */
    readonly platform?: cdk.IResolvable | CfnSegment.SetDimensionProperty;
  }

  /**
   * Specifies the dimension type and values for a segment dimension.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html
   */
  export interface SetDimensionProperty {
    /**
     * The type of segment dimension to use.
     *
     * Valid values are: `INCLUSIVE` , endpoints that match the criteria are included in the segment; and, `EXCLUSIVE` , endpoints that match the criteria are excluded from the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html#cfn-pinpoint-segment-setdimension-dimensiontype
     */
    readonly dimensionType?: string;

    /**
     * The criteria values to use for the segment dimension.
     *
     * Depending on the value of the `DimensionType` property, endpoints are included or excluded from the segment if their values match the criteria values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html#cfn-pinpoint-segment-setdimension-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Specifies behavior-based criteria for the segment, such as how recently users have used your app.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-behavior.html
   */
  export interface BehaviorProperty {
    /**
     * Specifies how recently segment members were active.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-behavior.html#cfn-pinpoint-segment-behavior-recency
     */
    readonly recency?: cdk.IResolvable | CfnSegment.RecencyProperty;
  }

  /**
   * Specifies how recently segment members were active.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-recency.html
   */
  export interface RecencyProperty {
    /**
     * The duration to use when determining which users have been active or inactive with your app.
     *
     * Possible values: `HR_24` | `DAY_7` | `DAY_14` | `DAY_30` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-recency.html#cfn-pinpoint-segment-recency-duration
     */
    readonly duration: string;

    /**
     * The type of recency dimension to use for the segment.
     *
     * Valid values are: `ACTIVE` and `INACTIVE` . If the value is `ACTIVE` , the segment includes users who have used your app within the specified duration are included in the segment. If the value is `INACTIVE` , the segment includes users who haven't used your app within the specified duration are included in the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-recency.html#cfn-pinpoint-segment-recency-recencytype
     */
    readonly recencyType: string;
  }

  /**
   * Specifies location-based criteria, such as region or GPS coordinates, for the segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-location.html
   */
  export interface LocationProperty {
    /**
     * The country or region code, in ISO 3166-1 alpha-2 format, for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-location.html#cfn-pinpoint-segment-location-country
     */
    readonly country?: cdk.IResolvable | CfnSegment.SetDimensionProperty;

    /**
     * The GPS point dimension for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-location.html#cfn-pinpoint-segment-location-gpspoint
     */
    readonly gpsPoint?: CfnSegment.GPSPointProperty | cdk.IResolvable;
  }

  /**
   * Specifies the GPS coordinates of the endpoint location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-gpspoint.html
   */
  export interface GPSPointProperty {
    /**
     * The GPS coordinates to measure distance from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-gpspoint.html#cfn-pinpoint-segment-gpspoint-coordinates
     */
    readonly coordinates: CfnSegment.CoordinatesProperty | cdk.IResolvable;

    /**
     * The range, in kilometers, from the GPS coordinates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-gpspoint.html#cfn-pinpoint-segment-gpspoint-rangeinkilometers
     */
    readonly rangeInKilometers: number;
  }

  /**
   * Specifies the GPS coordinates of a location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-coordinates.html
   */
  export interface CoordinatesProperty {
    /**
     * The latitude coordinate of the location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-coordinates.html#cfn-pinpoint-segment-coordinates-latitude
     */
    readonly latitude: number;

    /**
     * The longitude coordinate of the location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-coordinates.html#cfn-pinpoint-segment-coordinates-longitude
     */
    readonly longitude: number;
  }

  /**
   * Specifies the base segment to build the segment on.
   *
   * A base segment, also called a *source segment* , defines the initial population of endpoints for a segment. When you add dimensions to the segment, Amazon Pinpoint filters the base segment by using the dimensions that you specify.
   *
   * You can specify more than one dimensional segment or only one imported segment. If you specify an imported segment, the segment size estimate that displays on the Amazon Pinpoint console indicates the size of the imported segment without any filters applied to it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-sourcesegments.html
   */
  export interface SourceSegmentsProperty {
    /**
     * The unique identifier for the source segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-sourcesegments.html#cfn-pinpoint-segment-sourcesegments-id
     */
    readonly id: string;

    /**
     * The version number of the source segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-sourcesegments.html#cfn-pinpoint-segment-sourcesegments-version
     */
    readonly version?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html
   */
  export interface AttributeDimensionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html#cfn-pinpoint-segment-attributedimension-attributetype
     */
    readonly attributeType?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html#cfn-pinpoint-segment-attributedimension-values
     */
    readonly values?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnSegment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html
 */
export interface CfnSegmentProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the segment is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-applicationid
   */
  readonly applicationId: string;

  /**
   * An array that defines the dimensions for the segment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-dimensions
   */
  readonly dimensions?: cdk.IResolvable | CfnSegment.SegmentDimensionsProperty;

  /**
   * The name of the segment.
   *
   * > A segment must have a name otherwise it will not appear in the Amazon Pinpoint console.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-name
   */
  readonly name: string;

  /**
   * The segment group to use and the dimensions to apply to the group's base segments in order to build the segment.
   *
   * A segment group can consist of zero or more base segments. Your request can include only one segment group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-segmentgroups
   */
  readonly segmentGroups?: cdk.IResolvable | CfnSegment.SegmentGroupsProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `SetDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentSetDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionType", cdk.validateString)(properties.dimensionType));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"SetDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentSetDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentSetDimensionPropertyValidator(properties).assertSuccess();
  return {
    "DimensionType": cdk.stringToCloudFormation(properties.dimensionType),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnSegmentSetDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.SetDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SetDimensionProperty>();
  ret.addPropertyResult("dimensionType", "DimensionType", (properties.DimensionType != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionType) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DemographicProperty`
 *
 * @param properties - the TypeScript properties of a `DemographicProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentDemographicPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appVersion", CfnSegmentSetDimensionPropertyValidator)(properties.appVersion));
  errors.collect(cdk.propertyValidator("channel", CfnSegmentSetDimensionPropertyValidator)(properties.channel));
  errors.collect(cdk.propertyValidator("deviceType", CfnSegmentSetDimensionPropertyValidator)(properties.deviceType));
  errors.collect(cdk.propertyValidator("make", CfnSegmentSetDimensionPropertyValidator)(properties.make));
  errors.collect(cdk.propertyValidator("model", CfnSegmentSetDimensionPropertyValidator)(properties.model));
  errors.collect(cdk.propertyValidator("platform", CfnSegmentSetDimensionPropertyValidator)(properties.platform));
  return errors.wrap("supplied properties not correct for \"DemographicProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentDemographicPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentDemographicPropertyValidator(properties).assertSuccess();
  return {
    "AppVersion": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.appVersion),
    "Channel": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.channel),
    "DeviceType": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.deviceType),
    "Make": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.make),
    "Model": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.model),
    "Platform": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.platform)
  };
}

// @ts-ignore TS6133
function CfnSegmentDemographicPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.DemographicProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.DemographicProperty>();
  ret.addPropertyResult("appVersion", "AppVersion", (properties.AppVersion != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.AppVersion) : undefined));
  ret.addPropertyResult("channel", "Channel", (properties.Channel != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Channel) : undefined));
  ret.addPropertyResult("deviceType", "DeviceType", (properties.DeviceType != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.DeviceType) : undefined));
  ret.addPropertyResult("make", "Make", (properties.Make != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Make) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Model) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Platform) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecencyProperty`
 *
 * @param properties - the TypeScript properties of a `RecencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentRecencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("duration", cdk.requiredValidator)(properties.duration));
  errors.collect(cdk.propertyValidator("duration", cdk.validateString)(properties.duration));
  errors.collect(cdk.propertyValidator("recencyType", cdk.requiredValidator)(properties.recencyType));
  errors.collect(cdk.propertyValidator("recencyType", cdk.validateString)(properties.recencyType));
  return errors.wrap("supplied properties not correct for \"RecencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentRecencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentRecencyPropertyValidator(properties).assertSuccess();
  return {
    "Duration": cdk.stringToCloudFormation(properties.duration),
    "RecencyType": cdk.stringToCloudFormation(properties.recencyType)
  };
}

// @ts-ignore TS6133
function CfnSegmentRecencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.RecencyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.RecencyProperty>();
  ret.addPropertyResult("duration", "Duration", (properties.Duration != null ? cfn_parse.FromCloudFormation.getString(properties.Duration) : undefined));
  ret.addPropertyResult("recencyType", "RecencyType", (properties.RecencyType != null ? cfn_parse.FromCloudFormation.getString(properties.RecencyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `BehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recency", CfnSegmentRecencyPropertyValidator)(properties.recency));
  return errors.wrap("supplied properties not correct for \"BehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "Recency": convertCfnSegmentRecencyPropertyToCloudFormation(properties.recency)
  };
}

// @ts-ignore TS6133
function CfnSegmentBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.BehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.BehaviorProperty>();
  ret.addPropertyResult("recency", "Recency", (properties.Recency != null ? CfnSegmentRecencyPropertyFromCloudFormation(properties.Recency) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CoordinatesProperty`
 *
 * @param properties - the TypeScript properties of a `CoordinatesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentCoordinatesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("latitude", cdk.requiredValidator)(properties.latitude));
  errors.collect(cdk.propertyValidator("latitude", cdk.validateNumber)(properties.latitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.requiredValidator)(properties.longitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.validateNumber)(properties.longitude));
  return errors.wrap("supplied properties not correct for \"CoordinatesProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentCoordinatesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentCoordinatesPropertyValidator(properties).assertSuccess();
  return {
    "Latitude": cdk.numberToCloudFormation(properties.latitude),
    "Longitude": cdk.numberToCloudFormation(properties.longitude)
  };
}

// @ts-ignore TS6133
function CfnSegmentCoordinatesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.CoordinatesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.CoordinatesProperty>();
  ret.addPropertyResult("latitude", "Latitude", (properties.Latitude != null ? cfn_parse.FromCloudFormation.getNumber(properties.Latitude) : undefined));
  ret.addPropertyResult("longitude", "Longitude", (properties.Longitude != null ? cfn_parse.FromCloudFormation.getNumber(properties.Longitude) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GPSPointProperty`
 *
 * @param properties - the TypeScript properties of a `GPSPointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentGPSPointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coordinates", cdk.requiredValidator)(properties.coordinates));
  errors.collect(cdk.propertyValidator("coordinates", CfnSegmentCoordinatesPropertyValidator)(properties.coordinates));
  errors.collect(cdk.propertyValidator("rangeInKilometers", cdk.requiredValidator)(properties.rangeInKilometers));
  errors.collect(cdk.propertyValidator("rangeInKilometers", cdk.validateNumber)(properties.rangeInKilometers));
  return errors.wrap("supplied properties not correct for \"GPSPointProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentGPSPointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentGPSPointPropertyValidator(properties).assertSuccess();
  return {
    "Coordinates": convertCfnSegmentCoordinatesPropertyToCloudFormation(properties.coordinates),
    "RangeInKilometers": cdk.numberToCloudFormation(properties.rangeInKilometers)
  };
}

// @ts-ignore TS6133
function CfnSegmentGPSPointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.GPSPointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.GPSPointProperty>();
  ret.addPropertyResult("coordinates", "Coordinates", (properties.Coordinates != null ? CfnSegmentCoordinatesPropertyFromCloudFormation(properties.Coordinates) : undefined));
  ret.addPropertyResult("rangeInKilometers", "RangeInKilometers", (properties.RangeInKilometers != null ? cfn_parse.FromCloudFormation.getNumber(properties.RangeInKilometers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("country", CfnSegmentSetDimensionPropertyValidator)(properties.country));
  errors.collect(cdk.propertyValidator("gpsPoint", CfnSegmentGPSPointPropertyValidator)(properties.gpsPoint));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentLocationPropertyValidator(properties).assertSuccess();
  return {
    "Country": convertCfnSegmentSetDimensionPropertyToCloudFormation(properties.country),
    "GPSPoint": convertCfnSegmentGPSPointPropertyToCloudFormation(properties.gpsPoint)
  };
}

// @ts-ignore TS6133
function CfnSegmentLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.LocationProperty>();
  ret.addPropertyResult("country", "Country", (properties.Country != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Country) : undefined));
  ret.addPropertyResult("gpsPoint", "GPSPoint", (properties.GPSPoint != null ? CfnSegmentGPSPointPropertyFromCloudFormation(properties.GPSPoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SegmentDimensionsProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentDimensionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentSegmentDimensionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.validateObject)(properties.attributes));
  errors.collect(cdk.propertyValidator("behavior", CfnSegmentBehaviorPropertyValidator)(properties.behavior));
  errors.collect(cdk.propertyValidator("demographic", CfnSegmentDemographicPropertyValidator)(properties.demographic));
  errors.collect(cdk.propertyValidator("location", CfnSegmentLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("metrics", cdk.validateObject)(properties.metrics));
  errors.collect(cdk.propertyValidator("userAttributes", cdk.validateObject)(properties.userAttributes));
  return errors.wrap("supplied properties not correct for \"SegmentDimensionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentSegmentDimensionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentSegmentDimensionsPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.objectToCloudFormation(properties.attributes),
    "Behavior": convertCfnSegmentBehaviorPropertyToCloudFormation(properties.behavior),
    "Demographic": convertCfnSegmentDemographicPropertyToCloudFormation(properties.demographic),
    "Location": convertCfnSegmentLocationPropertyToCloudFormation(properties.location),
    "Metrics": cdk.objectToCloudFormation(properties.metrics),
    "UserAttributes": cdk.objectToCloudFormation(properties.userAttributes)
  };
}

// @ts-ignore TS6133
function CfnSegmentSegmentDimensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.SegmentDimensionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SegmentDimensionsProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined));
  ret.addPropertyResult("behavior", "Behavior", (properties.Behavior != null ? CfnSegmentBehaviorPropertyFromCloudFormation(properties.Behavior) : undefined));
  ret.addPropertyResult("demographic", "Demographic", (properties.Demographic != null ? CfnSegmentDemographicPropertyFromCloudFormation(properties.Demographic) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnSegmentLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("metrics", "Metrics", (properties.Metrics != null ? cfn_parse.FromCloudFormation.getAny(properties.Metrics) : undefined));
  ret.addPropertyResult("userAttributes", "UserAttributes", (properties.UserAttributes != null ? cfn_parse.FromCloudFormation.getAny(properties.UserAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceSegmentsProperty`
 *
 * @param properties - the TypeScript properties of a `SourceSegmentsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentSourceSegmentsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"SourceSegmentsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentSourceSegmentsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentSourceSegmentsPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnSegmentSourceSegmentsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.SourceSegmentsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SourceSegmentsProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GroupsProperty`
 *
 * @param properties - the TypeScript properties of a `GroupsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentGroupsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnSegmentSegmentDimensionsPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("sourceSegments", cdk.listValidator(CfnSegmentSourceSegmentsPropertyValidator))(properties.sourceSegments));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"GroupsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentGroupsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentGroupsPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnSegmentSegmentDimensionsPropertyToCloudFormation)(properties.dimensions),
    "SourceSegments": cdk.listMapper(convertCfnSegmentSourceSegmentsPropertyToCloudFormation)(properties.sourceSegments),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSegmentGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.GroupsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.GroupsProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentSegmentDimensionsPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("sourceSegments", "SourceSegments", (properties.SourceSegments != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentSourceSegmentsPropertyFromCloudFormation)(properties.SourceSegments) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SegmentGroupsProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentGroupsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentSegmentGroupsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(CfnSegmentGroupsPropertyValidator))(properties.groups));
  errors.collect(cdk.propertyValidator("include", cdk.validateString)(properties.include));
  return errors.wrap("supplied properties not correct for \"SegmentGroupsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentSegmentGroupsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentSegmentGroupsPropertyValidator(properties).assertSuccess();
  return {
    "Groups": cdk.listMapper(convertCfnSegmentGroupsPropertyToCloudFormation)(properties.groups),
    "Include": cdk.stringToCloudFormation(properties.include)
  };
}

// @ts-ignore TS6133
function CfnSegmentSegmentGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSegment.SegmentGroupsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SegmentGroupsProperty>();
  ret.addPropertyResult("groups", "Groups", (properties.Groups != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentGroupsPropertyFromCloudFormation)(properties.Groups) : undefined));
  ret.addPropertyResult("include", "Include", (properties.Include != null ? cfn_parse.FromCloudFormation.getString(properties.Include) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSegmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSegmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("dimensions", CfnSegmentSegmentDimensionsPropertyValidator)(properties.dimensions));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("segmentGroups", CfnSegmentSegmentGroupsPropertyValidator)(properties.segmentGroups));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSegmentProps\"");
}

// @ts-ignore TS6133
function convertCfnSegmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Dimensions": convertCfnSegmentSegmentDimensionsPropertyToCloudFormation(properties.dimensions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SegmentGroups": convertCfnSegmentSegmentGroupsPropertyToCloudFormation(properties.segmentGroups),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSegmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegmentProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? CfnSegmentSegmentDimensionsPropertyFromCloudFormation(properties.Dimensions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("segmentGroups", "SegmentGroups", (properties.SegmentGroups != null ? CfnSegmentSegmentGroupsPropertyFromCloudFormation(properties.SegmentGroups) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttributeDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentAttributeDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeType", cdk.validateString)(properties.attributeType));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"AttributeDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSegmentAttributeDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentAttributeDimensionPropertyValidator(properties).assertSuccess();
  return {
    "AttributeType": cdk.stringToCloudFormation(properties.attributeType),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnSegmentAttributeDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.AttributeDimensionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.AttributeDimensionProperty>();
  ret.addPropertyResult("attributeType", "AttributeType", (properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a message template that you can use in messages that are sent through the SMS channel.
 *
 * A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::SmsTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html
 */
export class CfnSmsTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::SmsTemplate";

  /**
   * Build a CfnSmsTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSmsTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSmsTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSmsTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the message template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The message body to use in text messages that are based on the message template.
   */
  public body: string;

  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   */
  public defaultSubstitutions?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * A custom description of the message template.
   */
  public templateDescription?: string;

  /**
   * The name of the message template to use for the message.
   */
  public templateName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSmsTemplateProps) {
    super(scope, id, {
      "type": CfnSmsTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "body", this);
    cdk.requireProperty(props, "templateName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.body = props.body;
    this.defaultSubstitutions = props.defaultSubstitutions;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::SmsTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateDescription = props.templateDescription;
    this.templateName = props.templateName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "body": this.body,
      "defaultSubstitutions": this.defaultSubstitutions,
      "tags": this.tags.renderTags(),
      "templateDescription": this.templateDescription,
      "templateName": this.templateName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSmsTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSmsTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSmsTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html
 */
export interface CfnSmsTemplateProps {
  /**
   * The message body to use in text messages that are based on the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-body
   */
  readonly body: string;

  /**
   * A JSON object that specifies the default values to use for message variables in the message template.
   *
   * This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-defaultsubstitutions
   */
  readonly defaultSubstitutions?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-tags
   */
  readonly tags?: any;

  /**
   * A custom description of the message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatedescription
   */
  readonly templateDescription?: string;

  /**
   * The name of the message template to use for the message.
   *
   * If specified, this value must match the name of an existing message template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatename
   */
  readonly templateName: string;
}

/**
 * Determine whether the given properties match those of a `CfnSmsTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnSmsTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSmsTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("body", cdk.requiredValidator)(properties.body));
  errors.collect(cdk.propertyValidator("body", cdk.validateString)(properties.body));
  errors.collect(cdk.propertyValidator("defaultSubstitutions", cdk.validateString)(properties.defaultSubstitutions));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("templateDescription", cdk.validateString)(properties.templateDescription));
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"CfnSmsTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnSmsTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSmsTemplatePropsValidator(properties).assertSuccess();
  return {
    "Body": cdk.stringToCloudFormation(properties.body),
    "DefaultSubstitutions": cdk.stringToCloudFormation(properties.defaultSubstitutions),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TemplateDescription": cdk.stringToCloudFormation(properties.templateDescription),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnSmsTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSmsTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSmsTemplateProps>();
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined));
  ret.addPropertyResult("defaultSubstitutions", "DefaultSubstitutions", (properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("templateDescription", "TemplateDescription", (properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *channel* is a type of platform that you can deliver messages to.
 *
 * To send a voice message, you send the message through the voice channel. Before you can use Amazon Pinpoint to send voice messages, you have to enable the voice channel for an Amazon Pinpoint application.
 *
 * The VoiceChannel resource represents the status and other information about the voice channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::VoiceChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html
 */
export class CfnVoiceChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pinpoint::VoiceChannel";

  /**
   * Build a CfnVoiceChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVoiceChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVoiceChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVoiceChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * (Deprecated) An identifier for the voice channel. This property is retained only for backward compatibility.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier for the Amazon Pinpoint application that the voice channel applies to.
   */
  public applicationId: string;

  /**
   * Specifies whether to enable the voice channel for the application.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVoiceChannelProps) {
    super(scope, id, {
      "type": CfnVoiceChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.enabled = props.enabled;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "enabled": this.enabled
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVoiceChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVoiceChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVoiceChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html
 */
export interface CfnVoiceChannelProps {
  /**
   * The unique identifier for the Amazon Pinpoint application that the voice channel applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-applicationid
   */
  readonly applicationId: string;

  /**
   * Specifies whether to enable the voice channel for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnVoiceChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnVoiceChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVoiceChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"CfnVoiceChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnVoiceChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVoiceChannelPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnVoiceChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVoiceChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVoiceChannelProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}