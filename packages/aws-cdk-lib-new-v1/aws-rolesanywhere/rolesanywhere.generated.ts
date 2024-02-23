/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html.
 *
 * @cloudformationResource AWS::RolesAnywhere::CRL
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html
 */
export class CfnCRL extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RolesAnywhere::CRL";

  /**
   * Build a CfnCRL from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCRL {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCRLPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCRL(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute CrlId
   */
  public readonly attrCrlId: string;

  public crlData: string;

  public enabled?: boolean | cdk.IResolvable;

  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for.
   */
  public trustAnchorArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCRLProps) {
    super(scope, id, {
      "type": CfnCRL.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "crlData", this);
    cdk.requireProperty(props, "name", this);

    this.attrCrlId = cdk.Token.asString(this.getAtt("CrlId", cdk.ResolutionTypeHint.STRING));
    this.crlData = props.crlData;
    this.enabled = props.enabled;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::CRL", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.trustAnchorArn = props.trustAnchorArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "crlData": this.crlData,
      "enabled": this.enabled,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "trustAnchorArn": this.trustAnchorArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCRL.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCRLPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCRL`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html
 */
export interface CfnCRLProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-crldata
   */
  readonly crlData: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-name
   */
  readonly name: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-trustanchorarn
   */
  readonly trustAnchorArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCRLProps`
 *
 * @param properties - the TypeScript properties of a `CfnCRLProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCRLPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crlData", cdk.requiredValidator)(properties.crlData));
  errors.collect(cdk.propertyValidator("crlData", cdk.validateString)(properties.crlData));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trustAnchorArn", cdk.validateString)(properties.trustAnchorArn));
  return errors.wrap("supplied properties not correct for \"CfnCRLProps\"");
}

// @ts-ignore TS6133
function convertCfnCRLPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCRLPropsValidator(properties).assertSuccess();
  return {
    "CrlData": cdk.stringToCloudFormation(properties.crlData),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrustAnchorArn": cdk.stringToCloudFormation(properties.trustAnchorArn)
  };
}

// @ts-ignore TS6133
function CfnCRLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCRLProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCRLProps>();
  ret.addPropertyResult("crlData", "CrlData", (properties.CrlData != null ? cfn_parse.FromCloudFormation.getString(properties.CrlData) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trustAnchorArn", "TrustAnchorArn", (properties.TrustAnchorArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustAnchorArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a *profile* , a list of the roles that Roles Anywhere service is trusted to assume.
 *
 * You use profiles to intersect permissions with IAM managed policies.
 *
 * *Required permissions:* `rolesanywhere:CreateProfile` .
 *
 * @cloudformationResource AWS::RolesAnywhere::Profile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html
 */
export class CfnProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RolesAnywhere::Profile";

  /**
   * Build a CfnProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the profile.
   *
   * @cloudformationAttribute ProfileArn
   */
  public readonly attrProfileArn: string;

  /**
   * The unique primary identifier of the Profile
   *
   * @cloudformationAttribute ProfileId
   */
  public readonly attrProfileId: string;

  /**
   * Sets the maximum number of seconds that vended temporary credentials through [CreateSession](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html) will be valid for, between 900 and 3600.
   */
  public durationSeconds?: number;

  /**
   * Indicates whether the profile is enabled.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * A list of managed policy ARNs that apply to the vended session credentials.
   */
  public managedPolicyArns?: Array<string>;

  /**
   * The name of the profile.
   */
  public name: string;

  /**
   * Specifies whether instance properties are required in temporary credential requests with this profile.
   */
  public requireInstanceProperties?: boolean | cdk.IResolvable;

  /**
   * A list of IAM role ARNs.
   */
  public roleArns: Array<string>;

  /**
   * A session policy that applies to the trust boundary of the vended session credentials.
   */
  public sessionPolicy?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to attach to the profile.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProfileProps) {
    super(scope, id, {
      "type": CfnProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArns", this);

    this.attrProfileArn = cdk.Token.asString(this.getAtt("ProfileArn", cdk.ResolutionTypeHint.STRING));
    this.attrProfileId = cdk.Token.asString(this.getAtt("ProfileId", cdk.ResolutionTypeHint.STRING));
    this.durationSeconds = props.durationSeconds;
    this.enabled = props.enabled;
    this.managedPolicyArns = props.managedPolicyArns;
    this.name = props.name;
    this.requireInstanceProperties = props.requireInstanceProperties;
    this.roleArns = props.roleArns;
    this.sessionPolicy = props.sessionPolicy;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::Profile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "durationSeconds": this.durationSeconds,
      "enabled": this.enabled,
      "managedPolicyArns": this.managedPolicyArns,
      "name": this.name,
      "requireInstanceProperties": this.requireInstanceProperties,
      "roleArns": this.roleArns,
      "sessionPolicy": this.sessionPolicy,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html
 */
export interface CfnProfileProps {
  /**
   * Sets the maximum number of seconds that vended temporary credentials through [CreateSession](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html) will be valid for, between 900 and 3600.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-durationseconds
   */
  readonly durationSeconds?: number;

  /**
   * Indicates whether the profile is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * A list of managed policy ARNs that apply to the vended session credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-managedpolicyarns
   */
  readonly managedPolicyArns?: Array<string>;

  /**
   * The name of the profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-name
   */
  readonly name: string;

  /**
   * Specifies whether instance properties are required in temporary credential requests with this profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-requireinstanceproperties
   */
  readonly requireInstanceProperties?: boolean | cdk.IResolvable;

  /**
   * A list of IAM role ARNs.
   *
   * During `CreateSession` , if a matching role ARN is provided, the properties in this profile will be applied to the intersection session policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-rolearns
   */
  readonly roleArns: Array<string>;

  /**
   * A session policy that applies to the trust boundary of the vended session credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-sessionpolicy
   */
  readonly sessionPolicy?: string;

  /**
   * The tags to attach to the profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationSeconds", cdk.validateNumber)(properties.durationSeconds));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("managedPolicyArns", cdk.listValidator(cdk.validateString))(properties.managedPolicyArns));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("requireInstanceProperties", cdk.validateBoolean)(properties.requireInstanceProperties));
  errors.collect(cdk.propertyValidator("roleArns", cdk.requiredValidator)(properties.roleArns));
  errors.collect(cdk.propertyValidator("roleArns", cdk.listValidator(cdk.validateString))(properties.roleArns));
  errors.collect(cdk.propertyValidator("sessionPolicy", cdk.validateString)(properties.sessionPolicy));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilePropsValidator(properties).assertSuccess();
  return {
    "DurationSeconds": cdk.numberToCloudFormation(properties.durationSeconds),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "ManagedPolicyArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicyArns),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RequireInstanceProperties": cdk.booleanToCloudFormation(properties.requireInstanceProperties),
    "RoleArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.roleArns),
    "SessionPolicy": cdk.stringToCloudFormation(properties.sessionPolicy),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfileProps>();
  ret.addPropertyResult("durationSeconds", "DurationSeconds", (properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("managedPolicyArns", "ManagedPolicyArns", (properties.ManagedPolicyArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ManagedPolicyArns) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("requireInstanceProperties", "RequireInstanceProperties", (properties.RequireInstanceProperties != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireInstanceProperties) : undefined));
  ret.addPropertyResult("roleArns", "RoleArns", (properties.RoleArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RoleArns) : undefined));
  ret.addPropertyResult("sessionPolicy", "SessionPolicy", (properties.SessionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SessionPolicy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a trust anchor to establish trust between IAM Roles Anywhere and your certificate authority (CA).
 *
 * You can define a trust anchor as a reference to an AWS Private Certificate Authority ( AWS Private CA ) or by uploading a CA certificate. Your AWS workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary AWS credentials.
 *
 * *Required permissions:* `rolesanywhere:CreateTrustAnchor` .
 *
 * @cloudformationResource AWS::RolesAnywhere::TrustAnchor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html
 */
export class CfnTrustAnchor extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RolesAnywhere::TrustAnchor";

  /**
   * Build a CfnTrustAnchor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrustAnchor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrustAnchorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrustAnchor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the trust anchor.
   *
   * @cloudformationAttribute TrustAnchorArn
   */
  public readonly attrTrustAnchorArn: string;

  /**
   * The unique identifier of the trust anchor.
   *
   * @cloudformationAttribute TrustAnchorId
   */
  public readonly attrTrustAnchorId: string;

  /**
   * Indicates whether the trust anchor is enabled.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The name of the trust anchor.
   */
  public name: string;

  /**
   * A list of notification settings to be associated to the trust anchor.
   */
  public notificationSettings?: Array<cdk.IResolvable | CfnTrustAnchor.NotificationSettingProperty> | cdk.IResolvable;

  /**
   * The trust anchor type and its related certificate data.
   */
  public source: cdk.IResolvable | CfnTrustAnchor.SourceProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to attach to the trust anchor.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrustAnchorProps) {
    super(scope, id, {
      "type": CfnTrustAnchor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "source", this);

    this.attrTrustAnchorArn = cdk.Token.asString(this.getAtt("TrustAnchorArn", cdk.ResolutionTypeHint.STRING));
    this.attrTrustAnchorId = cdk.Token.asString(this.getAtt("TrustAnchorId", cdk.ResolutionTypeHint.STRING));
    this.enabled = props.enabled;
    this.name = props.name;
    this.notificationSettings = props.notificationSettings;
    this.source = props.source;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::TrustAnchor", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enabled": this.enabled,
      "name": this.name,
      "notificationSettings": this.notificationSettings,
      "source": this.source,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrustAnchor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrustAnchorPropsToCloudFormation(props);
  }
}

export namespace CfnTrustAnchor {
  /**
   * Customizable notification settings that will be applied to notification events.
   *
   * IAM Roles Anywhere consumes these settings while notifying across multiple channels - CloudWatch metrics, EventBridge , and AWS Health Dashboard .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-notificationsetting.html
   */
  export interface NotificationSettingProperty {
    /**
     * The specified channel of notification.
     *
     * IAM Roles Anywhere uses CloudWatch metrics, EventBridge , and AWS Health Dashboard to notify for an event.
     *
     * > In the absence of a specific channel, IAM Roles Anywhere applies this setting to 'ALL' channels.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-notificationsetting.html#cfn-rolesanywhere-trustanchor-notificationsetting-channel
     */
    readonly channel?: string;

    /**
     * Indicates whether the notification setting is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-notificationsetting.html#cfn-rolesanywhere-trustanchor-notificationsetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The event to which this notification setting is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-notificationsetting.html#cfn-rolesanywhere-trustanchor-notificationsetting-event
     */
    readonly event: string;

    /**
     * The number of days before a notification event.
     *
     * This value is required for a notification setting that is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-notificationsetting.html#cfn-rolesanywhere-trustanchor-notificationsetting-threshold
     */
    readonly threshold?: number;
  }

  /**
   * The trust anchor type and its related certificate data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html
   */
  export interface SourceProperty {
    /**
     * The data field of the trust anchor depending on its type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html#cfn-rolesanywhere-trustanchor-source-sourcedata
     */
    readonly sourceData?: cdk.IResolvable | CfnTrustAnchor.SourceDataProperty;

    /**
     * The type of the TrustAnchor.
     *
     * > `AWS_ACM_PCA` is not an allowed value in your region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html#cfn-rolesanywhere-trustanchor-source-sourcetype
     */
    readonly sourceType?: string;
  }

  /**
   * The data field of the trust anchor depending on its type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html
   */
  export interface SourceDataProperty {
    /**
     * The root certificate of the AWS Private Certificate Authority specified by this ARN is used in trust validation for temporary credential requests.
     *
     * Included for trust anchors of type `AWS_ACM_PCA` .
     *
     * > This field is not supported in your region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html#cfn-rolesanywhere-trustanchor-sourcedata-acmpcaarn
     */
    readonly acmPcaArn?: string;

    /**
     * The PEM-encoded data for the certificate anchor.
     *
     * Included for trust anchors of type `CERTIFICATE_BUNDLE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html#cfn-rolesanywhere-trustanchor-sourcedata-x509certificatedata
     */
    readonly x509CertificateData?: string;
  }
}

/**
 * Properties for defining a `CfnTrustAnchor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html
 */
export interface CfnTrustAnchorProps {
  /**
   * Indicates whether the trust anchor is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The name of the trust anchor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-name
   */
  readonly name: string;

  /**
   * A list of notification settings to be associated to the trust anchor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-notificationsettings
   */
  readonly notificationSettings?: Array<cdk.IResolvable | CfnTrustAnchor.NotificationSettingProperty> | cdk.IResolvable;

  /**
   * The trust anchor type and its related certificate data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-source
   */
  readonly source: cdk.IResolvable | CfnTrustAnchor.SourceProperty;

  /**
   * The tags to attach to the trust anchor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `NotificationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustAnchorNotificationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channel", cdk.validateString)(properties.channel));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("event", cdk.requiredValidator)(properties.event));
  errors.collect(cdk.propertyValidator("event", cdk.validateString)(properties.event));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  return errors.wrap("supplied properties not correct for \"NotificationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnTrustAnchorNotificationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustAnchorNotificationSettingPropertyValidator(properties).assertSuccess();
  return {
    "Channel": cdk.stringToCloudFormation(properties.channel),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Event": cdk.stringToCloudFormation(properties.event),
    "Threshold": cdk.numberToCloudFormation(properties.threshold)
  };
}

// @ts-ignore TS6133
function CfnTrustAnchorNotificationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrustAnchor.NotificationSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchor.NotificationSettingProperty>();
  ret.addPropertyResult("channel", "Channel", (properties.Channel != null ? cfn_parse.FromCloudFormation.getString(properties.Channel) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("event", "Event", (properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustAnchorSourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acmPcaArn", cdk.validateString)(properties.acmPcaArn));
  errors.collect(cdk.propertyValidator("x509CertificateData", cdk.validateString)(properties.x509CertificateData));
  return errors.wrap("supplied properties not correct for \"SourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnTrustAnchorSourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustAnchorSourceDataPropertyValidator(properties).assertSuccess();
  return {
    "AcmPcaArn": cdk.stringToCloudFormation(properties.acmPcaArn),
    "X509CertificateData": cdk.stringToCloudFormation(properties.x509CertificateData)
  };
}

// @ts-ignore TS6133
function CfnTrustAnchorSourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrustAnchor.SourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchor.SourceDataProperty>();
  ret.addPropertyResult("acmPcaArn", "AcmPcaArn", (properties.AcmPcaArn != null ? cfn_parse.FromCloudFormation.getString(properties.AcmPcaArn) : undefined));
  ret.addPropertyResult("x509CertificateData", "X509CertificateData", (properties.X509CertificateData != null ? cfn_parse.FromCloudFormation.getString(properties.X509CertificateData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustAnchorSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourceData", CfnTrustAnchorSourceDataPropertyValidator)(properties.sourceData));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  return errors.wrap("supplied properties not correct for \"SourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTrustAnchorSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustAnchorSourcePropertyValidator(properties).assertSuccess();
  return {
    "SourceData": convertCfnTrustAnchorSourceDataPropertyToCloudFormation(properties.sourceData),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType)
  };
}

// @ts-ignore TS6133
function CfnTrustAnchorSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrustAnchor.SourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchor.SourceProperty>();
  ret.addPropertyResult("sourceData", "SourceData", (properties.SourceData != null ? CfnTrustAnchorSourceDataPropertyFromCloudFormation(properties.SourceData) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTrustAnchorProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrustAnchorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustAnchorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("notificationSettings", cdk.listValidator(CfnTrustAnchorNotificationSettingPropertyValidator))(properties.notificationSettings));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", CfnTrustAnchorSourcePropertyValidator)(properties.source));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTrustAnchorProps\"");
}

// @ts-ignore TS6133
function convertCfnTrustAnchorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustAnchorPropsValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NotificationSettings": cdk.listMapper(convertCfnTrustAnchorNotificationSettingPropertyToCloudFormation)(properties.notificationSettings),
    "Source": convertCfnTrustAnchorSourcePropertyToCloudFormation(properties.source),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTrustAnchorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustAnchorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchorProps>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("notificationSettings", "NotificationSettings", (properties.NotificationSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnTrustAnchorNotificationSettingPropertyFromCloudFormation)(properties.NotificationSettings) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? CfnTrustAnchorSourcePropertyFromCloudFormation(properties.Source) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}