/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SSMContacts::Contact` resource specifies a contact or escalation plan.
 *
 * Incident Manager contacts are a subset of actions and data types that you can use for managing responder engagement and interaction.
 *
 * @cloudformationResource AWS::SSMContacts::Contact
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export class CfnContact extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMContacts::Contact";

  /**
   * Build a CfnContact from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContact {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContactPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContact(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `Contact` resource, such as `arn:aws:ssm-contacts:us-west-2:123456789012:contact/contactalias` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique and identifiable alias of the contact or escalation plan.
   */
  public alias: string;

  /**
   * The full name of the contact or escalation plan.
   */
  public displayName: string;

  /**
   * A list of stages.
   */
  public plan?: Array<cdk.IResolvable | CfnContact.StageProperty> | cdk.IResolvable;

  /**
   * Refers to the type of contact:.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContactProps) {
    super(scope, id, {
      "type": CfnContact.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "alias", this);
    cdk.requireProperty(props, "displayName", this);
    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.alias = props.alias;
    this.displayName = props.displayName;
    this.plan = props.plan;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alias": this.alias,
      "displayName": this.displayName,
      "plan": this.plan,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContact.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContactPropsToCloudFormation(props);
  }
}

export namespace CfnContact {
  /**
   * The `Stage` property type specifies a set amount of time that an escalation plan or engagement plan engages the specified contacts or contact methods.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html
   */
  export interface StageProperty {
    /**
     * The time to wait until beginning the next stage.
     *
     * The duration can only be set to 0 if a target is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-durationinminutes
     */
    readonly durationInMinutes?: number;

    /**
     * The Amazon Resource Names (ARNs) of the on-call rotations associated with the plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-rotationids
     */
    readonly rotationIds?: Array<string>;

    /**
     * The contacts or contact methods that the escalation plan or engagement plan is engaging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-targets
     */
    readonly targets?: Array<cdk.IResolvable | CfnContact.TargetsProperty> | cdk.IResolvable;
  }

  /**
   * The contact or contact channel that's being engaged.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html
   */
  export interface TargetsProperty {
    /**
     * Information about the contact channel that Incident Manager engages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-channeltargetinfo
     */
    readonly channelTargetInfo?: CfnContact.ChannelTargetInfoProperty | cdk.IResolvable;

    /**
     * The contact that Incident Manager is engaging during an incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-contacttargetinfo
     */
    readonly contactTargetInfo?: CfnContact.ContactTargetInfoProperty | cdk.IResolvable;
  }

  /**
   * Information about the contact channel that Incident Manager uses to engage the contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html
   */
  export interface ChannelTargetInfoProperty {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-channelid
     */
    readonly channelId: string;

    /**
     * The number of minutes to wait before retrying to send engagement if the engagement initially failed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-retryintervalinminutes
     */
    readonly retryIntervalInMinutes: number;
  }

  /**
   * The contact that Incident Manager is engaging during an incident.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html
   */
  export interface ContactTargetInfoProperty {
    /**
     * The Amazon Resource Name (ARN) of the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-contactid
     */
    readonly contactId: string;

    /**
     * A Boolean value determining if the contact's acknowledgement stops the progress of stages in the plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-isessential
     */
    readonly isEssential: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnContact`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export interface CfnContactProps {
  /**
   * The unique and identifiable alias of the contact or escalation plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-alias
   */
  readonly alias: string;

  /**
   * The full name of the contact or escalation plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-displayname
   */
  readonly displayName: string;

  /**
   * A list of stages.
   *
   * A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-plan
   */
  readonly plan?: Array<cdk.IResolvable | CfnContact.StageProperty> | cdk.IResolvable;

  /**
   * Refers to the type of contact:.
   *
   * - `PERSONAL` : A single, individual contact.
   * - `ESCALATION` : An escalation plan.
   * - `ONCALL_SCHEDULE` : An on-call schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `ChannelTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactChannelTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelId", cdk.requiredValidator)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelId", cdk.validateString)(properties.channelId));
  errors.collect(cdk.propertyValidator("retryIntervalInMinutes", cdk.requiredValidator)(properties.retryIntervalInMinutes));
  errors.collect(cdk.propertyValidator("retryIntervalInMinutes", cdk.validateNumber)(properties.retryIntervalInMinutes));
  return errors.wrap("supplied properties not correct for \"ChannelTargetInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnContactChannelTargetInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactChannelTargetInfoPropertyValidator(properties).assertSuccess();
  return {
    "ChannelId": cdk.stringToCloudFormation(properties.channelId),
    "RetryIntervalInMinutes": cdk.numberToCloudFormation(properties.retryIntervalInMinutes)
  };
}

// @ts-ignore TS6133
function CfnContactChannelTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.ChannelTargetInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.ChannelTargetInfoProperty>();
  ret.addPropertyResult("channelId", "ChannelId", (properties.ChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelId) : undefined));
  ret.addPropertyResult("retryIntervalInMinutes", "RetryIntervalInMinutes", (properties.RetryIntervalInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryIntervalInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContactTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ContactTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactContactTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactId", cdk.requiredValidator)(properties.contactId));
  errors.collect(cdk.propertyValidator("contactId", cdk.validateString)(properties.contactId));
  errors.collect(cdk.propertyValidator("isEssential", cdk.requiredValidator)(properties.isEssential));
  errors.collect(cdk.propertyValidator("isEssential", cdk.validateBoolean)(properties.isEssential));
  return errors.wrap("supplied properties not correct for \"ContactTargetInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnContactContactTargetInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactContactTargetInfoPropertyValidator(properties).assertSuccess();
  return {
    "ContactId": cdk.stringToCloudFormation(properties.contactId),
    "IsEssential": cdk.booleanToCloudFormation(properties.isEssential)
  };
}

// @ts-ignore TS6133
function CfnContactContactTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.ContactTargetInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.ContactTargetInfoProperty>();
  ret.addPropertyResult("contactId", "ContactId", (properties.ContactId != null ? cfn_parse.FromCloudFormation.getString(properties.ContactId) : undefined));
  ret.addPropertyResult("isEssential", "IsEssential", (properties.IsEssential != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEssential) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactTargetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelTargetInfo", CfnContactChannelTargetInfoPropertyValidator)(properties.channelTargetInfo));
  errors.collect(cdk.propertyValidator("contactTargetInfo", CfnContactContactTargetInfoPropertyValidator)(properties.contactTargetInfo));
  return errors.wrap("supplied properties not correct for \"TargetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnContactTargetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactTargetsPropertyValidator(properties).assertSuccess();
  return {
    "ChannelTargetInfo": convertCfnContactChannelTargetInfoPropertyToCloudFormation(properties.channelTargetInfo),
    "ContactTargetInfo": convertCfnContactContactTargetInfoPropertyToCloudFormation(properties.contactTargetInfo)
  };
}

// @ts-ignore TS6133
function CfnContactTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContact.TargetsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.TargetsProperty>();
  ret.addPropertyResult("channelTargetInfo", "ChannelTargetInfo", (properties.ChannelTargetInfo != null ? CfnContactChannelTargetInfoPropertyFromCloudFormation(properties.ChannelTargetInfo) : undefined));
  ret.addPropertyResult("contactTargetInfo", "ContactTargetInfo", (properties.ContactTargetInfo != null ? CfnContactContactTargetInfoPropertyFromCloudFormation(properties.ContactTargetInfo) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageProperty`
 *
 * @param properties - the TypeScript properties of a `StageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactStagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInMinutes", cdk.validateNumber)(properties.durationInMinutes));
  errors.collect(cdk.propertyValidator("rotationIds", cdk.listValidator(cdk.validateString))(properties.rotationIds));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnContactTargetsPropertyValidator))(properties.targets));
  return errors.wrap("supplied properties not correct for \"StageProperty\"");
}

// @ts-ignore TS6133
function convertCfnContactStagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactStagePropertyValidator(properties).assertSuccess();
  return {
    "DurationInMinutes": cdk.numberToCloudFormation(properties.durationInMinutes),
    "RotationIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.rotationIds),
    "Targets": cdk.listMapper(convertCfnContactTargetsPropertyToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnContactStagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContact.StageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.StageProperty>();
  ret.addPropertyResult("durationInMinutes", "DurationInMinutes", (properties.DurationInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInMinutes) : undefined));
  ret.addPropertyResult("rotationIds", "RotationIds", (properties.RotationIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RotationIds) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnContactTargetsPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContactProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alias", cdk.requiredValidator)(properties.alias));
  errors.collect(cdk.propertyValidator("alias", cdk.validateString)(properties.alias));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("plan", cdk.listValidator(CfnContactStagePropertyValidator))(properties.plan));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnContactProps\"");
}

// @ts-ignore TS6133
function convertCfnContactPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactPropsValidator(properties).assertSuccess();
  return {
    "Alias": cdk.stringToCloudFormation(properties.alias),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "Plan": cdk.listMapper(convertCfnContactStagePropertyToCloudFormation)(properties.plan),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnContactPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactProps>();
  ret.addPropertyResult("alias", "Alias", (properties.Alias != null ? cfn_parse.FromCloudFormation.getString(properties.Alias) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("plan", "Plan", (properties.Plan != null ? cfn_parse.FromCloudFormation.getArray(CfnContactStagePropertyFromCloudFormation)(properties.Plan) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSMContacts::ContactChannel` resource specifies a contact channel as the method that Incident Manager uses to engage your contact.
 *
 * @cloudformationResource AWS::SSMContacts::ContactChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export class CfnContactChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMContacts::ContactChannel";

  /**
   * Build a CfnContactChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContactChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContactChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `ContactChannel` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The details that Incident Manager uses when trying to engage the contact channel.
   */
  public channelAddress: string;

  /**
   * The name of the contact channel.
   */
  public channelName: string;

  /**
   * The type of the contact channel. Incident Manager supports three contact methods:.
   */
  public channelType: string;

  /**
   * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
   */
  public contactId: string;

  /**
   * If you want to activate the channel at a later time, you can choose to defer activation.
   */
  public deferActivation?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContactChannelProps) {
    super(scope, id, {
      "type": CfnContactChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "channelAddress", this);
    cdk.requireProperty(props, "channelName", this);
    cdk.requireProperty(props, "channelType", this);
    cdk.requireProperty(props, "contactId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.channelAddress = props.channelAddress;
    this.channelName = props.channelName;
    this.channelType = props.channelType;
    this.contactId = props.contactId;
    this.deferActivation = props.deferActivation;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelAddress": this.channelAddress,
      "channelName": this.channelName,
      "channelType": this.channelType,
      "contactId": this.contactId,
      "deferActivation": this.deferActivation
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContactChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnContactChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export interface CfnContactChannelProps {
  /**
   * The details that Incident Manager uses when trying to engage the contact channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeladdress
   */
  readonly channelAddress: string;

  /**
   * The name of the contact channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channelname
   */
  readonly channelName: string;

  /**
   * The type of the contact channel. Incident Manager supports three contact methods:.
   *
   * - SMS
   * - VOICE
   * - EMAIL
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeltype
   */
  readonly channelType: string;

  /**
   * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-contactid
   */
  readonly contactId: string;

  /**
   * If you want to activate the channel at a later time, you can choose to defer activation.
   *
   * Incident Manager can't engage your contact channel until it has been activated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-deferactivation
   */
  readonly deferActivation?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnContactChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelAddress", cdk.requiredValidator)(properties.channelAddress));
  errors.collect(cdk.propertyValidator("channelAddress", cdk.validateString)(properties.channelAddress));
  errors.collect(cdk.propertyValidator("channelName", cdk.requiredValidator)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelType", cdk.requiredValidator)(properties.channelType));
  errors.collect(cdk.propertyValidator("channelType", cdk.validateString)(properties.channelType));
  errors.collect(cdk.propertyValidator("contactId", cdk.requiredValidator)(properties.contactId));
  errors.collect(cdk.propertyValidator("contactId", cdk.validateString)(properties.contactId));
  errors.collect(cdk.propertyValidator("deferActivation", cdk.validateBoolean)(properties.deferActivation));
  return errors.wrap("supplied properties not correct for \"CfnContactChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnContactChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactChannelPropsValidator(properties).assertSuccess();
  return {
    "ChannelAddress": cdk.stringToCloudFormation(properties.channelAddress),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "ChannelType": cdk.stringToCloudFormation(properties.channelType),
    "ContactId": cdk.stringToCloudFormation(properties.contactId),
    "DeferActivation": cdk.booleanToCloudFormation(properties.deferActivation)
  };
}

// @ts-ignore TS6133
function CfnContactChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactChannelProps>();
  ret.addPropertyResult("channelAddress", "ChannelAddress", (properties.ChannelAddress != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelAddress) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("channelType", "ChannelType", (properties.ChannelType != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelType) : undefined));
  ret.addPropertyResult("contactId", "ContactId", (properties.ContactId != null ? cfn_parse.FromCloudFormation.getString(properties.ContactId) : undefined));
  ret.addPropertyResult("deferActivation", "DeferActivation", (properties.DeferActivation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeferActivation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Information about the stages and on-call rotation teams associated with an escalation plan or engagement plan.
 *
 * @cloudformationResource AWS::SSMContacts::Plan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-plan.html
 */
export class CfnPlan extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMContacts::Plan";

  /**
   * Build a CfnPlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `Plan` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Name (ARN) of the contact.
   */
  public contactId: string;

  /**
   * The Amazon Resource Names (ARNs) of the on-call rotations associated with the plan.
   */
  public rotationIds?: Array<string>;

  /**
   * A list of stages that the escalation plan or engagement plan uses to engage contacts and contact methods.
   */
  public stages?: Array<cdk.IResolvable | CfnPlan.StageProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPlanProps) {
    super(scope, id, {
      "type": CfnPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "contactId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.contactId = props.contactId;
    this.rotationIds = props.rotationIds;
    this.stages = props.stages;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contactId": this.contactId,
      "rotationIds": this.rotationIds,
      "stages": this.stages
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPlanPropsToCloudFormation(props);
  }
}

export namespace CfnPlan {
  /**
   * A set amount of time that an escalation plan or engagement plan engages the specified contacts or contact methods.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-stage.html
   */
  export interface StageProperty {
    /**
     * The time to wait until beginning the next stage.
     *
     * The duration can only be set to 0 if a target is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-stage.html#cfn-ssmcontacts-plan-stage-durationinminutes
     */
    readonly durationInMinutes: number;

    /**
     * The contacts or contact methods that the escalation plan or engagement plan is engaging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-stage.html#cfn-ssmcontacts-plan-stage-targets
     */
    readonly targets?: Array<cdk.IResolvable | CfnPlan.TargetsProperty> | cdk.IResolvable;
  }

  /**
   * The contact or contact channel that's being engaged.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-targets.html
   */
  export interface TargetsProperty {
    /**
     * Information about the contact channel that Incident Manager engages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-targets.html#cfn-ssmcontacts-plan-targets-channeltargetinfo
     */
    readonly channelTargetInfo?: CfnPlan.ChannelTargetInfoProperty | cdk.IResolvable;

    /**
     * Information about the contact that Incident Manager engages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-targets.html#cfn-ssmcontacts-plan-targets-contacttargetinfo
     */
    readonly contactTargetInfo?: CfnPlan.ContactTargetInfoProperty | cdk.IResolvable;
  }

  /**
   * Information about the contact channel that Incident Manager uses to engage the contact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-channeltargetinfo.html
   */
  export interface ChannelTargetInfoProperty {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-channeltargetinfo.html#cfn-ssmcontacts-plan-channeltargetinfo-channelid
     */
    readonly channelId: string;

    /**
     * The number of minutes to wait before retrying to send engagement if the engagement initially failed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-channeltargetinfo.html#cfn-ssmcontacts-plan-channeltargetinfo-retryintervalinminutes
     */
    readonly retryIntervalInMinutes: number;
  }

  /**
   * The contact that Incident Manager is engaging during an incident.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-contacttargetinfo.html
   */
  export interface ContactTargetInfoProperty {
    /**
     * The Amazon Resource Name (ARN) of the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-contacttargetinfo.html#cfn-ssmcontacts-plan-contacttargetinfo-contactid
     */
    readonly contactId: string;

    /**
     * A Boolean value determining if the contact's acknowledgement stops the progress of stages in the plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-plan-contacttargetinfo.html#cfn-ssmcontacts-plan-contacttargetinfo-isessential
     */
    readonly isEssential: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-plan.html
 */
export interface CfnPlanProps {
  /**
   * The Amazon Resource Name (ARN) of the contact.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-plan.html#cfn-ssmcontacts-plan-contactid
   */
  readonly contactId: string;

  /**
   * The Amazon Resource Names (ARNs) of the on-call rotations associated with the plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-plan.html#cfn-ssmcontacts-plan-rotationids
   */
  readonly rotationIds?: Array<string>;

  /**
   * A list of stages that the escalation plan or engagement plan uses to engage contacts and contact methods.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-plan.html#cfn-ssmcontacts-plan-stages
   */
  readonly stages?: Array<cdk.IResolvable | CfnPlan.StageProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ChannelTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlanChannelTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelId", cdk.requiredValidator)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelId", cdk.validateString)(properties.channelId));
  errors.collect(cdk.propertyValidator("retryIntervalInMinutes", cdk.requiredValidator)(properties.retryIntervalInMinutes));
  errors.collect(cdk.propertyValidator("retryIntervalInMinutes", cdk.validateNumber)(properties.retryIntervalInMinutes));
  return errors.wrap("supplied properties not correct for \"ChannelTargetInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlanChannelTargetInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlanChannelTargetInfoPropertyValidator(properties).assertSuccess();
  return {
    "ChannelId": cdk.stringToCloudFormation(properties.channelId),
    "RetryIntervalInMinutes": cdk.numberToCloudFormation(properties.retryIntervalInMinutes)
  };
}

// @ts-ignore TS6133
function CfnPlanChannelTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlan.ChannelTargetInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlan.ChannelTargetInfoProperty>();
  ret.addPropertyResult("channelId", "ChannelId", (properties.ChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelId) : undefined));
  ret.addPropertyResult("retryIntervalInMinutes", "RetryIntervalInMinutes", (properties.RetryIntervalInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryIntervalInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContactTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ContactTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlanContactTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactId", cdk.requiredValidator)(properties.contactId));
  errors.collect(cdk.propertyValidator("contactId", cdk.validateString)(properties.contactId));
  errors.collect(cdk.propertyValidator("isEssential", cdk.requiredValidator)(properties.isEssential));
  errors.collect(cdk.propertyValidator("isEssential", cdk.validateBoolean)(properties.isEssential));
  return errors.wrap("supplied properties not correct for \"ContactTargetInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlanContactTargetInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlanContactTargetInfoPropertyValidator(properties).assertSuccess();
  return {
    "ContactId": cdk.stringToCloudFormation(properties.contactId),
    "IsEssential": cdk.booleanToCloudFormation(properties.isEssential)
  };
}

// @ts-ignore TS6133
function CfnPlanContactTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlan.ContactTargetInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlan.ContactTargetInfoProperty>();
  ret.addPropertyResult("contactId", "ContactId", (properties.ContactId != null ? cfn_parse.FromCloudFormation.getString(properties.ContactId) : undefined));
  ret.addPropertyResult("isEssential", "IsEssential", (properties.IsEssential != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEssential) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlanTargetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelTargetInfo", CfnPlanChannelTargetInfoPropertyValidator)(properties.channelTargetInfo));
  errors.collect(cdk.propertyValidator("contactTargetInfo", CfnPlanContactTargetInfoPropertyValidator)(properties.contactTargetInfo));
  return errors.wrap("supplied properties not correct for \"TargetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlanTargetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlanTargetsPropertyValidator(properties).assertSuccess();
  return {
    "ChannelTargetInfo": convertCfnPlanChannelTargetInfoPropertyToCloudFormation(properties.channelTargetInfo),
    "ContactTargetInfo": convertCfnPlanContactTargetInfoPropertyToCloudFormation(properties.contactTargetInfo)
  };
}

// @ts-ignore TS6133
function CfnPlanTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPlan.TargetsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlan.TargetsProperty>();
  ret.addPropertyResult("channelTargetInfo", "ChannelTargetInfo", (properties.ChannelTargetInfo != null ? CfnPlanChannelTargetInfoPropertyFromCloudFormation(properties.ChannelTargetInfo) : undefined));
  ret.addPropertyResult("contactTargetInfo", "ContactTargetInfo", (properties.ContactTargetInfo != null ? CfnPlanContactTargetInfoPropertyFromCloudFormation(properties.ContactTargetInfo) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageProperty`
 *
 * @param properties - the TypeScript properties of a `StageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlanStagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInMinutes", cdk.requiredValidator)(properties.durationInMinutes));
  errors.collect(cdk.propertyValidator("durationInMinutes", cdk.validateNumber)(properties.durationInMinutes));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnPlanTargetsPropertyValidator))(properties.targets));
  return errors.wrap("supplied properties not correct for \"StageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlanStagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlanStagePropertyValidator(properties).assertSuccess();
  return {
    "DurationInMinutes": cdk.numberToCloudFormation(properties.durationInMinutes),
    "Targets": cdk.listMapper(convertCfnPlanTargetsPropertyToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnPlanStagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPlan.StageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlan.StageProperty>();
  ret.addPropertyResult("durationInMinutes", "DurationInMinutes", (properties.DurationInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInMinutes) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnPlanTargetsPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactId", cdk.requiredValidator)(properties.contactId));
  errors.collect(cdk.propertyValidator("contactId", cdk.validateString)(properties.contactId));
  errors.collect(cdk.propertyValidator("rotationIds", cdk.listValidator(cdk.validateString))(properties.rotationIds));
  errors.collect(cdk.propertyValidator("stages", cdk.listValidator(CfnPlanStagePropertyValidator))(properties.stages));
  return errors.wrap("supplied properties not correct for \"CfnPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlanPropsValidator(properties).assertSuccess();
  return {
    "ContactId": cdk.stringToCloudFormation(properties.contactId),
    "RotationIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.rotationIds),
    "Stages": cdk.listMapper(convertCfnPlanStagePropertyToCloudFormation)(properties.stages)
  };
}

// @ts-ignore TS6133
function CfnPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlanProps>();
  ret.addPropertyResult("contactId", "ContactId", (properties.ContactId != null ? cfn_parse.FromCloudFormation.getString(properties.ContactId) : undefined));
  ret.addPropertyResult("rotationIds", "RotationIds", (properties.RotationIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RotationIds) : undefined));
  ret.addPropertyResult("stages", "Stages", (properties.Stages != null ? cfn_parse.FromCloudFormation.getArray(CfnPlanStagePropertyFromCloudFormation)(properties.Stages) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a rotation in an on-call schedule.
 *
 * @cloudformationResource AWS::SSMContacts::Rotation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html
 */
export class CfnRotation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMContacts::Rotation";

  /**
   * Build a CfnRotation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRotation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRotationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRotation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `Rotation` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Names (ARNs) of the contacts to add to the rotation.
   */
  public contactIds: Array<string>;

  /**
   * The name for the rotation.
   */
  public name: string;

  /**
   * Information about the rule that specifies when shift team members rotate.
   */
  public recurrence: cdk.IResolvable | CfnRotation.RecurrenceSettingsProperty;

  /**
   * The date and time the rotation goes into effect.
   */
  public startTime: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata to assign to the rotation.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The time zone to base the rotation’s activity on, in Internet Assigned Numbers Authority (IANA) format.
   */
  public timeZoneId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRotationProps) {
    super(scope, id, {
      "type": CfnRotation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "contactIds", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "recurrence", this);
    cdk.requireProperty(props, "startTime", this);
    cdk.requireProperty(props, "timeZoneId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.contactIds = props.contactIds;
    this.name = props.name;
    this.recurrence = props.recurrence;
    this.startTime = props.startTime;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSMContacts::Rotation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeZoneId = props.timeZoneId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contactIds": this.contactIds,
      "name": this.name,
      "recurrence": this.recurrence,
      "startTime": this.startTime,
      "tags": this.tags.renderTags(),
      "timeZoneId": this.timeZoneId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRotation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRotationPropsToCloudFormation(props);
  }
}

export namespace CfnRotation {
  /**
   * Information about when an on-call rotation is in effect and how long the rotation period lasts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html
   */
  export interface RecurrenceSettingsProperty {
    /**
     * Information about on-call rotations that recur daily.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-dailysettings
     */
    readonly dailySettings?: Array<string>;

    /**
     * Information about on-call rotations that recur monthly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-monthlysettings
     */
    readonly monthlySettings?: Array<cdk.IResolvable | CfnRotation.MonthlySettingProperty> | cdk.IResolvable;

    /**
     * The number of contacts, or shift team members designated to be on call concurrently during a shift.
     *
     * For example, in an on-call schedule that contains ten contacts, a value of `2` designates that two of them are on call at any given time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-numberofoncalls
     */
    readonly numberOfOnCalls: number;

    /**
     * The number of days, weeks, or months a single rotation lasts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-recurrencemultiplier
     */
    readonly recurrenceMultiplier: number;

    /**
     * Information about the days of the week included in on-call rotation coverage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-shiftcoverages
     */
    readonly shiftCoverages?: Array<cdk.IResolvable | CfnRotation.ShiftCoverageProperty> | cdk.IResolvable;

    /**
     * Information about on-call rotations that recur weekly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-recurrencesettings.html#cfn-ssmcontacts-rotation-recurrencesettings-weeklysettings
     */
    readonly weeklySettings?: Array<cdk.IResolvable | CfnRotation.WeeklySettingProperty> | cdk.IResolvable;
  }

  /**
   * Information about the days of the week that the on-call rotation coverage includes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-shiftcoverage.html
   */
  export interface ShiftCoverageProperty {
    /**
     * The start and end times of the shift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-shiftcoverage.html#cfn-ssmcontacts-rotation-shiftcoverage-coveragetimes
     */
    readonly coverageTimes: Array<CfnRotation.CoverageTimeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of days on which the schedule is active.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-shiftcoverage.html#cfn-ssmcontacts-rotation-shiftcoverage-dayofweek
     */
    readonly dayOfWeek: string;
  }

  /**
   * Information about when an on-call shift begins and ends.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-coveragetime.html
   */
  export interface CoverageTimeProperty {
    /**
     * Information about when an on-call rotation shift ends.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-coveragetime.html#cfn-ssmcontacts-rotation-coveragetime-endtime
     */
    readonly endTime: string;

    /**
     * Information about when an on-call rotation shift begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-coveragetime.html#cfn-ssmcontacts-rotation-coveragetime-starttime
     */
    readonly startTime: string;
  }

  /**
   * Information about rotations that recur weekly.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-weeklysetting.html
   */
  export interface WeeklySettingProperty {
    /**
     * The day of the week when weekly recurring on-call shift rotations begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-weeklysetting.html#cfn-ssmcontacts-rotation-weeklysetting-dayofweek
     */
    readonly dayOfWeek: string;

    /**
     * The time of day when a weekly recurring on-call shift rotation begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-weeklysetting.html#cfn-ssmcontacts-rotation-weeklysetting-handofftime
     */
    readonly handOffTime: string;
  }

  /**
   * Information about on-call rotations that recur monthly.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-monthlysetting.html
   */
  export interface MonthlySettingProperty {
    /**
     * The day of the month when monthly recurring on-call rotations begin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-monthlysetting.html#cfn-ssmcontacts-rotation-monthlysetting-dayofmonth
     */
    readonly dayOfMonth: number;

    /**
     * The time of day when a monthly recurring on-call shift rotation begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-rotation-monthlysetting.html#cfn-ssmcontacts-rotation-monthlysetting-handofftime
     */
    readonly handOffTime: string;
  }
}

/**
 * Properties for defining a `CfnRotation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html
 */
export interface CfnRotationProps {
  /**
   * The Amazon Resource Names (ARNs) of the contacts to add to the rotation.
   *
   * The order in which you list the contacts is their shift order in the rotation schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-contactids
   */
  readonly contactIds: Array<string>;

  /**
   * The name for the rotation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-name
   */
  readonly name: string;

  /**
   * Information about the rule that specifies when shift team members rotate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-recurrence
   */
  readonly recurrence: cdk.IResolvable | CfnRotation.RecurrenceSettingsProperty;

  /**
   * The date and time the rotation goes into effect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-starttime
   */
  readonly startTime: string;

  /**
   * Optional metadata to assign to the rotation.
   *
   * Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For more information, see [Tagging Incident Manager resources](https://docs.aws.amazon.com/incident-manager/latest/userguide/tagging.html) in the *Incident Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The time zone to base the rotation’s activity on, in Internet Assigned Numbers Authority (IANA) format.
   *
   * For example: "America/Los_Angeles", "UTC", or "Asia/Seoul". For more information, see the [Time Zone Database](https://docs.aws.amazon.com/https://www.iana.org/time-zones) on the IANA website.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-rotation.html#cfn-ssmcontacts-rotation-timezoneid
   */
  readonly timeZoneId: string;
}

/**
 * Determine whether the given properties match those of a `CoverageTimeProperty`
 *
 * @param properties - the TypeScript properties of a `CoverageTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationCoverageTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endTime", cdk.requiredValidator)(properties.endTime));
  errors.collect(cdk.propertyValidator("endTime", cdk.validateString)(properties.endTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.requiredValidator)(properties.startTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  return errors.wrap("supplied properties not correct for \"CoverageTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationCoverageTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationCoverageTimePropertyValidator(properties).assertSuccess();
  return {
    "EndTime": cdk.stringToCloudFormation(properties.endTime),
    "StartTime": cdk.stringToCloudFormation(properties.startTime)
  };
}

// @ts-ignore TS6133
function CfnRotationCoverageTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRotation.CoverageTimeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotation.CoverageTimeProperty>();
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? cfn_parse.FromCloudFormation.getString(properties.EndTime) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ShiftCoverageProperty`
 *
 * @param properties - the TypeScript properties of a `ShiftCoverageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationShiftCoveragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coverageTimes", cdk.requiredValidator)(properties.coverageTimes));
  errors.collect(cdk.propertyValidator("coverageTimes", cdk.listValidator(CfnRotationCoverageTimePropertyValidator))(properties.coverageTimes));
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.requiredValidator)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.validateString)(properties.dayOfWeek));
  return errors.wrap("supplied properties not correct for \"ShiftCoverageProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationShiftCoveragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationShiftCoveragePropertyValidator(properties).assertSuccess();
  return {
    "CoverageTimes": cdk.listMapper(convertCfnRotationCoverageTimePropertyToCloudFormation)(properties.coverageTimes),
    "DayOfWeek": cdk.stringToCloudFormation(properties.dayOfWeek)
  };
}

// @ts-ignore TS6133
function CfnRotationShiftCoveragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRotation.ShiftCoverageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotation.ShiftCoverageProperty>();
  ret.addPropertyResult("coverageTimes", "CoverageTimes", (properties.CoverageTimes != null ? cfn_parse.FromCloudFormation.getArray(CfnRotationCoverageTimePropertyFromCloudFormation)(properties.CoverageTimes) : undefined));
  ret.addPropertyResult("dayOfWeek", "DayOfWeek", (properties.DayOfWeek != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfWeek) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WeeklySettingProperty`
 *
 * @param properties - the TypeScript properties of a `WeeklySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationWeeklySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.requiredValidator)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.validateString)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("handOffTime", cdk.requiredValidator)(properties.handOffTime));
  errors.collect(cdk.propertyValidator("handOffTime", cdk.validateString)(properties.handOffTime));
  return errors.wrap("supplied properties not correct for \"WeeklySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationWeeklySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationWeeklySettingPropertyValidator(properties).assertSuccess();
  return {
    "DayOfWeek": cdk.stringToCloudFormation(properties.dayOfWeek),
    "HandOffTime": cdk.stringToCloudFormation(properties.handOffTime)
  };
}

// @ts-ignore TS6133
function CfnRotationWeeklySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRotation.WeeklySettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotation.WeeklySettingProperty>();
  ret.addPropertyResult("dayOfWeek", "DayOfWeek", (properties.DayOfWeek != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfWeek) : undefined));
  ret.addPropertyResult("handOffTime", "HandOffTime", (properties.HandOffTime != null ? cfn_parse.FromCloudFormation.getString(properties.HandOffTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MonthlySettingProperty`
 *
 * @param properties - the TypeScript properties of a `MonthlySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationMonthlySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dayOfMonth", cdk.requiredValidator)(properties.dayOfMonth));
  errors.collect(cdk.propertyValidator("dayOfMonth", cdk.validateNumber)(properties.dayOfMonth));
  errors.collect(cdk.propertyValidator("handOffTime", cdk.requiredValidator)(properties.handOffTime));
  errors.collect(cdk.propertyValidator("handOffTime", cdk.validateString)(properties.handOffTime));
  return errors.wrap("supplied properties not correct for \"MonthlySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationMonthlySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationMonthlySettingPropertyValidator(properties).assertSuccess();
  return {
    "DayOfMonth": cdk.numberToCloudFormation(properties.dayOfMonth),
    "HandOffTime": cdk.stringToCloudFormation(properties.handOffTime)
  };
}

// @ts-ignore TS6133
function CfnRotationMonthlySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRotation.MonthlySettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotation.MonthlySettingProperty>();
  ret.addPropertyResult("dayOfMonth", "DayOfMonth", (properties.DayOfMonth != null ? cfn_parse.FromCloudFormation.getNumber(properties.DayOfMonth) : undefined));
  ret.addPropertyResult("handOffTime", "HandOffTime", (properties.HandOffTime != null ? cfn_parse.FromCloudFormation.getString(properties.HandOffTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecurrenceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RecurrenceSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationRecurrenceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dailySettings", cdk.listValidator(cdk.validateString))(properties.dailySettings));
  errors.collect(cdk.propertyValidator("monthlySettings", cdk.listValidator(CfnRotationMonthlySettingPropertyValidator))(properties.monthlySettings));
  errors.collect(cdk.propertyValidator("numberOfOnCalls", cdk.requiredValidator)(properties.numberOfOnCalls));
  errors.collect(cdk.propertyValidator("numberOfOnCalls", cdk.validateNumber)(properties.numberOfOnCalls));
  errors.collect(cdk.propertyValidator("recurrenceMultiplier", cdk.requiredValidator)(properties.recurrenceMultiplier));
  errors.collect(cdk.propertyValidator("recurrenceMultiplier", cdk.validateNumber)(properties.recurrenceMultiplier));
  errors.collect(cdk.propertyValidator("shiftCoverages", cdk.listValidator(CfnRotationShiftCoveragePropertyValidator))(properties.shiftCoverages));
  errors.collect(cdk.propertyValidator("weeklySettings", cdk.listValidator(CfnRotationWeeklySettingPropertyValidator))(properties.weeklySettings));
  return errors.wrap("supplied properties not correct for \"RecurrenceSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationRecurrenceSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationRecurrenceSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DailySettings": cdk.listMapper(cdk.stringToCloudFormation)(properties.dailySettings),
    "MonthlySettings": cdk.listMapper(convertCfnRotationMonthlySettingPropertyToCloudFormation)(properties.monthlySettings),
    "NumberOfOnCalls": cdk.numberToCloudFormation(properties.numberOfOnCalls),
    "RecurrenceMultiplier": cdk.numberToCloudFormation(properties.recurrenceMultiplier),
    "ShiftCoverages": cdk.listMapper(convertCfnRotationShiftCoveragePropertyToCloudFormation)(properties.shiftCoverages),
    "WeeklySettings": cdk.listMapper(convertCfnRotationWeeklySettingPropertyToCloudFormation)(properties.weeklySettings)
  };
}

// @ts-ignore TS6133
function CfnRotationRecurrenceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRotation.RecurrenceSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotation.RecurrenceSettingsProperty>();
  ret.addPropertyResult("dailySettings", "DailySettings", (properties.DailySettings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DailySettings) : undefined));
  ret.addPropertyResult("monthlySettings", "MonthlySettings", (properties.MonthlySettings != null ? cfn_parse.FromCloudFormation.getArray(CfnRotationMonthlySettingPropertyFromCloudFormation)(properties.MonthlySettings) : undefined));
  ret.addPropertyResult("numberOfOnCalls", "NumberOfOnCalls", (properties.NumberOfOnCalls != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfOnCalls) : undefined));
  ret.addPropertyResult("recurrenceMultiplier", "RecurrenceMultiplier", (properties.RecurrenceMultiplier != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecurrenceMultiplier) : undefined));
  ret.addPropertyResult("shiftCoverages", "ShiftCoverages", (properties.ShiftCoverages != null ? cfn_parse.FromCloudFormation.getArray(CfnRotationShiftCoveragePropertyFromCloudFormation)(properties.ShiftCoverages) : undefined));
  ret.addPropertyResult("weeklySettings", "WeeklySettings", (properties.WeeklySettings != null ? cfn_parse.FromCloudFormation.getArray(CfnRotationWeeklySettingPropertyFromCloudFormation)(properties.WeeklySettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRotationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRotationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactIds", cdk.requiredValidator)(properties.contactIds));
  errors.collect(cdk.propertyValidator("contactIds", cdk.listValidator(cdk.validateString))(properties.contactIds));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recurrence", cdk.requiredValidator)(properties.recurrence));
  errors.collect(cdk.propertyValidator("recurrence", CfnRotationRecurrenceSettingsPropertyValidator)(properties.recurrence));
  errors.collect(cdk.propertyValidator("startTime", cdk.requiredValidator)(properties.startTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeZoneId", cdk.requiredValidator)(properties.timeZoneId));
  errors.collect(cdk.propertyValidator("timeZoneId", cdk.validateString)(properties.timeZoneId));
  return errors.wrap("supplied properties not correct for \"CfnRotationProps\"");
}

// @ts-ignore TS6133
function convertCfnRotationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationPropsValidator(properties).assertSuccess();
  return {
    "ContactIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.contactIds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Recurrence": convertCfnRotationRecurrenceSettingsPropertyToCloudFormation(properties.recurrence),
    "StartTime": cdk.stringToCloudFormation(properties.startTime),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TimeZoneId": cdk.stringToCloudFormation(properties.timeZoneId)
  };
}

// @ts-ignore TS6133
function CfnRotationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRotationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotationProps>();
  ret.addPropertyResult("contactIds", "ContactIds", (properties.ContactIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContactIds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recurrence", "Recurrence", (properties.Recurrence != null ? CfnRotationRecurrenceSettingsPropertyFromCloudFormation(properties.Recurrence) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeZoneId", "TimeZoneId", (properties.TimeZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZoneId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}