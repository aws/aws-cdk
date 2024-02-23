/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Adds cross-account permissions to a signing profile.
 *
 * @cloudformationResource AWS::Signer::ProfilePermission
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html
 */
export class CfnProfilePermission extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Signer::ProfilePermission";

  /**
   * Build a CfnProfilePermission from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfilePermission {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProfilePermissionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProfilePermission(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The AWS Signer action permitted as part of cross-account permissions.
   */
  public action: string;

  /**
   * The AWS principal receiving cross-account permissions.
   */
  public principal: string;

  /**
   * The human-readable name of the signing profile.
   */
  public profileName: string;

  /**
   * The version of the signing profile.
   */
  public profileVersion?: string;

  /**
   * A unique identifier for the cross-account permission statement.
   */
  public statementId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProfilePermissionProps) {
    super(scope, id, {
      "type": CfnProfilePermission.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "principal", this);
    cdk.requireProperty(props, "profileName", this);
    cdk.requireProperty(props, "statementId", this);

    this.action = props.action;
    this.principal = props.principal;
    this.profileName = props.profileName;
    this.profileVersion = props.profileVersion;
    this.statementId = props.statementId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "principal": this.principal,
      "profileName": this.profileName,
      "profileVersion": this.profileVersion,
      "statementId": this.statementId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfilePermission.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProfilePermissionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProfilePermission`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html
 */
export interface CfnProfilePermissionProps {
  /**
   * The AWS Signer action permitted as part of cross-account permissions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-action
   */
  readonly action: string;

  /**
   * The AWS principal receiving cross-account permissions.
   *
   * This may be an IAM role or another AWS account ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-principal
   */
  readonly principal: string;

  /**
   * The human-readable name of the signing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profilename
   */
  readonly profileName: string;

  /**
   * The version of the signing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profileversion
   */
  readonly profileVersion?: string;

  /**
   * A unique identifier for the cross-account permission statement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-statementid
   */
  readonly statementId: string;
}

/**
 * Determine whether the given properties match those of a `CfnProfilePermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfilePermissionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilePermissionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  errors.collect(cdk.propertyValidator("profileName", cdk.requiredValidator)(properties.profileName));
  errors.collect(cdk.propertyValidator("profileName", cdk.validateString)(properties.profileName));
  errors.collect(cdk.propertyValidator("profileVersion", cdk.validateString)(properties.profileVersion));
  errors.collect(cdk.propertyValidator("statementId", cdk.requiredValidator)(properties.statementId));
  errors.collect(cdk.propertyValidator("statementId", cdk.validateString)(properties.statementId));
  return errors.wrap("supplied properties not correct for \"CfnProfilePermissionProps\"");
}

// @ts-ignore TS6133
function convertCfnProfilePermissionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilePermissionPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Principal": cdk.stringToCloudFormation(properties.principal),
    "ProfileName": cdk.stringToCloudFormation(properties.profileName),
    "ProfileVersion": cdk.stringToCloudFormation(properties.profileVersion),
    "StatementId": cdk.stringToCloudFormation(properties.statementId)
  };
}

// @ts-ignore TS6133
function CfnProfilePermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilePermissionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilePermissionProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? cfn_parse.FromCloudFormation.getString(properties.Principal) : undefined));
  ret.addPropertyResult("profileName", "ProfileName", (properties.ProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ProfileName) : undefined));
  ret.addPropertyResult("profileVersion", "ProfileVersion", (properties.ProfileVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProfileVersion) : undefined));
  ret.addPropertyResult("statementId", "StatementId", (properties.StatementId != null ? cfn_parse.FromCloudFormation.getString(properties.StatementId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a signing profile.
 *
 * A signing profile is a code-signing template that can be used to carry out a pre-defined signing job.
 *
 * @cloudformationResource AWS::Signer::SigningProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html
 */
export class CfnSigningProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Signer::SigningProfile";

  /**
   * Build a CfnSigningProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSigningProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSigningProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSigningProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the signing profile created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the signing profile created.
   *
   * @cloudformationAttribute ProfileName
   */
  public readonly attrProfileName: string;

  /**
   * The version of the signing profile created.
   *
   * @cloudformationAttribute ProfileVersion
   */
  public readonly attrProfileVersion: string;

  /**
   * The signing profile ARN, including the profile version.
   *
   * @cloudformationAttribute ProfileVersionArn
   */
  public readonly attrProfileVersionArn: string;

  /**
   * The ID of a platform that is available for use by a signing profile.
   */
  public platformId: string;

  /**
   * The validity period override for any signature generated using this signing profile.
   */
  public signatureValidityPeriod?: cdk.IResolvable | CfnSigningProfile.SignatureValidityPeriodProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags associated with the signing profile.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSigningProfileProps) {
    super(scope, id, {
      "type": CfnSigningProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "platformId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrProfileName = cdk.Token.asString(this.getAtt("ProfileName", cdk.ResolutionTypeHint.STRING));
    this.attrProfileVersion = cdk.Token.asString(this.getAtt("ProfileVersion", cdk.ResolutionTypeHint.STRING));
    this.attrProfileVersionArn = cdk.Token.asString(this.getAtt("ProfileVersionArn", cdk.ResolutionTypeHint.STRING));
    this.platformId = props.platformId;
    this.signatureValidityPeriod = props.signatureValidityPeriod;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Signer::SigningProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "platformId": this.platformId,
      "signatureValidityPeriod": this.signatureValidityPeriod,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSigningProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSigningProfilePropsToCloudFormation(props);
  }
}

export namespace CfnSigningProfile {
  /**
   * The validity period for the signing job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html
   */
  export interface SignatureValidityPeriodProperty {
    /**
     * The time unit for signature validity: DAYS | MONTHS | YEARS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html#cfn-signer-signingprofile-signaturevalidityperiod-type
     */
    readonly type?: string;

    /**
     * The numerical value of the time unit for signature validity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html#cfn-signer-signingprofile-signaturevalidityperiod-value
     */
    readonly value?: number;
  }
}

/**
 * Properties for defining a `CfnSigningProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html
 */
export interface CfnSigningProfileProps {
  /**
   * The ID of a platform that is available for use by a signing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
   */
  readonly platformId: string;

  /**
   * The validity period override for any signature generated using this signing profile.
   *
   * If unspecified, the default is 135 months.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-signaturevalidityperiod
   */
  readonly signatureValidityPeriod?: cdk.IResolvable | CfnSigningProfile.SignatureValidityPeriodProperty;

  /**
   * A list of tags associated with the signing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SignatureValidityPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `SignatureValidityPeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSigningProfileSignatureValidityPeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"SignatureValidityPeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnSigningProfileSignatureValidityPeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSigningProfileSignatureValidityPeriodPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnSigningProfileSignatureValidityPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSigningProfile.SignatureValidityPeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSigningProfile.SignatureValidityPeriodProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSigningProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnSigningProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSigningProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("platformId", cdk.requiredValidator)(properties.platformId));
  errors.collect(cdk.propertyValidator("platformId", cdk.validateString)(properties.platformId));
  errors.collect(cdk.propertyValidator("signatureValidityPeriod", CfnSigningProfileSignatureValidityPeriodPropertyValidator)(properties.signatureValidityPeriod));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSigningProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnSigningProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSigningProfilePropsValidator(properties).assertSuccess();
  return {
    "PlatformId": cdk.stringToCloudFormation(properties.platformId),
    "SignatureValidityPeriod": convertCfnSigningProfileSignatureValidityPeriodPropertyToCloudFormation(properties.signatureValidityPeriod),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSigningProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSigningProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSigningProfileProps>();
  ret.addPropertyResult("platformId", "PlatformId", (properties.PlatformId != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformId) : undefined));
  ret.addPropertyResult("signatureValidityPeriod", "SignatureValidityPeriod", (properties.SignatureValidityPeriod != null ? CfnSigningProfileSignatureValidityPeriodPropertyFromCloudFormation(properties.SignatureValidityPeriod) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}