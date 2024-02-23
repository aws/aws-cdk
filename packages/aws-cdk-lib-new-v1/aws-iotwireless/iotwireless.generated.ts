/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new destination that maps a device message to an AWS IoT rule.
 *
 * @cloudformationResource AWS::IoTWireless::Destination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export class CfnDestination extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::Destination";

  /**
   * Build a CfnDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDestination(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the destination created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the new resource.
   */
  public description?: string;

  /**
   * The rule name to send messages to.
   */
  public expression: string;

  /**
   * The type of value in `Expression` .
   */
  public expressionType: string;

  /**
   * The name of the new resource.
   */
  public name: string;

  /**
   * The ARN of the IAM Role that authorizes the destination.
   */
  public roleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDestinationProps) {
    super(scope, id, {
      "type": CfnDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "expression", this);
    cdk.requireProperty(props, "expressionType", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.expression = props.expression;
    this.expressionType = props.expressionType;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::Destination", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "expression": this.expression,
      "expressionType": this.expressionType,
      "name": this.name,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDestinationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export interface CfnDestinationProps {
  /**
   * The description of the new resource.
   *
   * Maximum length is 2048 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-description
   */
  readonly description?: string;

  /**
   * The rule name to send messages to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expression
   */
  readonly expression: string;

  /**
   * The type of value in `Expression` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expressiontype
   */
  readonly expressionType: string;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-name
   */
  readonly name: string;

  /**
   * The ARN of the IAM Role that authorizes the destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-rolearn
   */
  readonly roleArn?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("expressionType", cdk.requiredValidator)(properties.expressionType));
  errors.collect(cdk.propertyValidator("expressionType", cdk.validateString)(properties.expressionType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDestinationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "ExpressionType": cdk.stringToCloudFormation(properties.expressionType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDestinationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("expressionType", "ExpressionType", (properties.ExpressionType != null ? cfn_parse.FromCloudFormation.getString(properties.ExpressionType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new device profile.
 *
 * @cloudformationResource AWS::IoTWireless::DeviceProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export class CfnDeviceProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::DeviceProfile";

  /**
   * Build a CfnDeviceProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeviceProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeviceProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeviceProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the device profile created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the device profile created.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * LoRaWAN device profile object.
   */
  public loRaWan?: cdk.IResolvable | CfnDeviceProfile.LoRaWANDeviceProfileProperty;

  /**
   * The name of the new resource.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeviceProfileProps = {}) {
    super(scope, id, {
      "type": CfnDeviceProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::DeviceProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "loRaWan": this.loRaWan,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeviceProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeviceProfilePropsToCloudFormation(props);
  }
}

export namespace CfnDeviceProfile {
  /**
   * LoRaWAN device profile object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html
   */
  export interface LoRaWANDeviceProfileProperty {
    /**
     * The ClassBTimeout value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classbtimeout
     */
    readonly classBTimeout?: number;

    /**
     * The ClassCTimeout value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classctimeout
     */
    readonly classCTimeout?: number;

    /**
     * The list of values that make up the FactoryPresetFreqs value.
     *
     * Valid range of values include a minimum value of 1000000 and a maximum value of 16700000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-factorypresetfreqslist
     */
    readonly factoryPresetFreqsList?: Array<number> | cdk.IResolvable;

    /**
     * The MAC version (such as OTAA 1.1 or OTAA 1.0.3) to use with this device profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-macversion
     */
    readonly macVersion?: string;

    /**
     * The MaxDutyCycle value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxdutycycle
     */
    readonly maxDutyCycle?: number;

    /**
     * The MaxEIRP value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxeirp
     */
    readonly maxEirp?: number;

    /**
     * The PingSlotDR value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotdr
     */
    readonly pingSlotDr?: number;

    /**
     * The PingSlotFreq value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotfreq
     */
    readonly pingSlotFreq?: number;

    /**
     * The PingSlotPeriod value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotperiod
     */
    readonly pingSlotPeriod?: number;

    /**
     * The version of regional parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-regparamsrevision
     */
    readonly regParamsRevision?: string;

    /**
     * The frequency band (RFRegion) value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rfregion
     */
    readonly rfRegion?: string;

    /**
     * The RXDataRate2 value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdatarate2
     */
    readonly rxDataRate2?: number;

    /**
     * The RXDelay1 value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdelay1
     */
    readonly rxDelay1?: number;

    /**
     * The RXDROffset1 value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdroffset1
     */
    readonly rxDrOffset1?: number;

    /**
     * The RXFreq2 value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxfreq2
     */
    readonly rxFreq2?: number;

    /**
     * The Supports32BitFCnt value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supports32bitfcnt
     */
    readonly supports32BitFCnt?: boolean | cdk.IResolvable;

    /**
     * The SupportsClassB value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassb
     */
    readonly supportsClassB?: boolean | cdk.IResolvable;

    /**
     * The SupportsClassC value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassc
     */
    readonly supportsClassC?: boolean | cdk.IResolvable;

    /**
     * The SupportsJoin value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsjoin
     */
    readonly supportsJoin?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDeviceProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export interface CfnDeviceProfileProps {
  /**
   * LoRaWAN device profile object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-lorawan
   */
  readonly loRaWan?: cdk.IResolvable | CfnDeviceProfile.LoRaWANDeviceProfileProperty;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoRaWANDeviceProfileProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProfileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceProfileLoRaWANDeviceProfilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classBTimeout", cdk.validateNumber)(properties.classBTimeout));
  errors.collect(cdk.propertyValidator("classCTimeout", cdk.validateNumber)(properties.classCTimeout));
  errors.collect(cdk.propertyValidator("factoryPresetFreqsList", cdk.listValidator(cdk.validateNumber))(properties.factoryPresetFreqsList));
  errors.collect(cdk.propertyValidator("macVersion", cdk.validateString)(properties.macVersion));
  errors.collect(cdk.propertyValidator("maxDutyCycle", cdk.validateNumber)(properties.maxDutyCycle));
  errors.collect(cdk.propertyValidator("maxEirp", cdk.validateNumber)(properties.maxEirp));
  errors.collect(cdk.propertyValidator("pingSlotDr", cdk.validateNumber)(properties.pingSlotDr));
  errors.collect(cdk.propertyValidator("pingSlotFreq", cdk.validateNumber)(properties.pingSlotFreq));
  errors.collect(cdk.propertyValidator("pingSlotPeriod", cdk.validateNumber)(properties.pingSlotPeriod));
  errors.collect(cdk.propertyValidator("regParamsRevision", cdk.validateString)(properties.regParamsRevision));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.validateString)(properties.rfRegion));
  errors.collect(cdk.propertyValidator("rxDataRate2", cdk.validateNumber)(properties.rxDataRate2));
  errors.collect(cdk.propertyValidator("rxDelay1", cdk.validateNumber)(properties.rxDelay1));
  errors.collect(cdk.propertyValidator("rxDrOffset1", cdk.validateNumber)(properties.rxDrOffset1));
  errors.collect(cdk.propertyValidator("rxFreq2", cdk.validateNumber)(properties.rxFreq2));
  errors.collect(cdk.propertyValidator("supports32BitFCnt", cdk.validateBoolean)(properties.supports32BitFCnt));
  errors.collect(cdk.propertyValidator("supportsClassB", cdk.validateBoolean)(properties.supportsClassB));
  errors.collect(cdk.propertyValidator("supportsClassC", cdk.validateBoolean)(properties.supportsClassC));
  errors.collect(cdk.propertyValidator("supportsJoin", cdk.validateBoolean)(properties.supportsJoin));
  return errors.wrap("supplied properties not correct for \"LoRaWANDeviceProfileProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceProfileLoRaWANDeviceProfilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceProfileLoRaWANDeviceProfilePropertyValidator(properties).assertSuccess();
  return {
    "ClassBTimeout": cdk.numberToCloudFormation(properties.classBTimeout),
    "ClassCTimeout": cdk.numberToCloudFormation(properties.classCTimeout),
    "FactoryPresetFreqsList": cdk.listMapper(cdk.numberToCloudFormation)(properties.factoryPresetFreqsList),
    "MacVersion": cdk.stringToCloudFormation(properties.macVersion),
    "MaxDutyCycle": cdk.numberToCloudFormation(properties.maxDutyCycle),
    "MaxEirp": cdk.numberToCloudFormation(properties.maxEirp),
    "PingSlotDr": cdk.numberToCloudFormation(properties.pingSlotDr),
    "PingSlotFreq": cdk.numberToCloudFormation(properties.pingSlotFreq),
    "PingSlotPeriod": cdk.numberToCloudFormation(properties.pingSlotPeriod),
    "RegParamsRevision": cdk.stringToCloudFormation(properties.regParamsRevision),
    "RfRegion": cdk.stringToCloudFormation(properties.rfRegion),
    "RxDataRate2": cdk.numberToCloudFormation(properties.rxDataRate2),
    "RxDelay1": cdk.numberToCloudFormation(properties.rxDelay1),
    "RxDrOffset1": cdk.numberToCloudFormation(properties.rxDrOffset1),
    "RxFreq2": cdk.numberToCloudFormation(properties.rxFreq2),
    "Supports32BitFCnt": cdk.booleanToCloudFormation(properties.supports32BitFCnt),
    "SupportsClassB": cdk.booleanToCloudFormation(properties.supportsClassB),
    "SupportsClassC": cdk.booleanToCloudFormation(properties.supportsClassC),
    "SupportsJoin": cdk.booleanToCloudFormation(properties.supportsJoin)
  };
}

// @ts-ignore TS6133
function CfnDeviceProfileLoRaWANDeviceProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeviceProfile.LoRaWANDeviceProfileProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProfile.LoRaWANDeviceProfileProperty>();
  ret.addPropertyResult("classBTimeout", "ClassBTimeout", (properties.ClassBTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ClassBTimeout) : undefined));
  ret.addPropertyResult("classCTimeout", "ClassCTimeout", (properties.ClassCTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ClassCTimeout) : undefined));
  ret.addPropertyResult("factoryPresetFreqsList", "FactoryPresetFreqsList", (properties.FactoryPresetFreqsList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.FactoryPresetFreqsList) : undefined));
  ret.addPropertyResult("macVersion", "MacVersion", (properties.MacVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MacVersion) : undefined));
  ret.addPropertyResult("maxDutyCycle", "MaxDutyCycle", (properties.MaxDutyCycle != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDutyCycle) : undefined));
  ret.addPropertyResult("maxEirp", "MaxEirp", (properties.MaxEirp != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxEirp) : undefined));
  ret.addPropertyResult("pingSlotDr", "PingSlotDr", (properties.PingSlotDr != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotDr) : undefined));
  ret.addPropertyResult("pingSlotFreq", "PingSlotFreq", (properties.PingSlotFreq != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotFreq) : undefined));
  ret.addPropertyResult("pingSlotPeriod", "PingSlotPeriod", (properties.PingSlotPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotPeriod) : undefined));
  ret.addPropertyResult("regParamsRevision", "RegParamsRevision", (properties.RegParamsRevision != null ? cfn_parse.FromCloudFormation.getString(properties.RegParamsRevision) : undefined));
  ret.addPropertyResult("rfRegion", "RfRegion", (properties.RfRegion != null ? cfn_parse.FromCloudFormation.getString(properties.RfRegion) : undefined));
  ret.addPropertyResult("rxDataRate2", "RxDataRate2", (properties.RxDataRate2 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDataRate2) : undefined));
  ret.addPropertyResult("rxDelay1", "RxDelay1", (properties.RxDelay1 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDelay1) : undefined));
  ret.addPropertyResult("rxDrOffset1", "RxDrOffset1", (properties.RxDrOffset1 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDrOffset1) : undefined));
  ret.addPropertyResult("rxFreq2", "RxFreq2", (properties.RxFreq2 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxFreq2) : undefined));
  ret.addPropertyResult("supports32BitFCnt", "Supports32BitFCnt", (properties.Supports32BitFCnt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Supports32BitFCnt) : undefined));
  ret.addPropertyResult("supportsClassB", "SupportsClassB", (properties.SupportsClassB != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsClassB) : undefined));
  ret.addPropertyResult("supportsClassC", "SupportsClassC", (properties.SupportsClassC != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsClassC) : undefined));
  ret.addPropertyResult("supportsJoin", "SupportsJoin", (properties.SupportsJoin != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsJoin) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loRaWan", CfnDeviceProfileLoRaWANDeviceProfilePropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeviceProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnDeviceProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceProfilePropsValidator(properties).assertSuccess();
  return {
    "LoRaWAN": convertCfnDeviceProfileLoRaWANDeviceProfilePropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeviceProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProfileProps>();
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnDeviceProfileLoRaWANDeviceProfilePropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A FUOTA task.
 *
 * @cloudformationResource AWS::IoTWireless::FuotaTask
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export class CfnFuotaTask extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::FuotaTask";

  /**
   * Build a CfnFuotaTask from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFuotaTask {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFuotaTaskPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFuotaTask(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of a FUOTA task
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The status of a FUOTA task.
   *
   * @cloudformationAttribute FuotaTaskStatus
   */
  public readonly attrFuotaTaskStatus: string;

  /**
   * The ID of a FUOTA task.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * FUOTA task LoRaWAN start time
   *
   * @cloudformationAttribute LoRaWAN.StartTime
   */
  public readonly attrLoRaWanStartTime: string;

  /**
   * The ID of the multicast group to associate with a FUOTA task.
   */
  public associateMulticastGroup?: string;

  /**
   * The ID of the wireless device to associate with a multicast group.
   */
  public associateWirelessDevice?: string;

  /**
   * The description of the new resource.
   */
  public description?: string;

  /**
   * The ID of the multicast group to disassociate from a FUOTA task.
   */
  public disassociateMulticastGroup?: string;

  /**
   * The ID of the wireless device to disassociate from a FUOTA task.
   */
  public disassociateWirelessDevice?: string;

  /**
   * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
   */
  public firmwareUpdateImage: string;

  /**
   * The firmware update role that is to be used with a FUOTA task.
   */
  public firmwareUpdateRole: string;

  /**
   * The LoRaWAN information used with a FUOTA task.
   */
  public loRaWan: cdk.IResolvable | CfnFuotaTask.LoRaWANProperty;

  /**
   * The name of a FUOTA task.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFuotaTaskProps) {
    super(scope, id, {
      "type": CfnFuotaTask.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "firmwareUpdateImage", this);
    cdk.requireProperty(props, "firmwareUpdateRole", this);
    cdk.requireProperty(props, "loRaWan", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrFuotaTaskStatus = cdk.Token.asString(this.getAtt("FuotaTaskStatus", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLoRaWanStartTime = cdk.Token.asString(this.getAtt("LoRaWAN.StartTime", cdk.ResolutionTypeHint.STRING));
    this.associateMulticastGroup = props.associateMulticastGroup;
    this.associateWirelessDevice = props.associateWirelessDevice;
    this.description = props.description;
    this.disassociateMulticastGroup = props.disassociateMulticastGroup;
    this.disassociateWirelessDevice = props.disassociateWirelessDevice;
    this.firmwareUpdateImage = props.firmwareUpdateImage;
    this.firmwareUpdateRole = props.firmwareUpdateRole;
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::FuotaTask", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associateMulticastGroup": this.associateMulticastGroup,
      "associateWirelessDevice": this.associateWirelessDevice,
      "description": this.description,
      "disassociateMulticastGroup": this.disassociateMulticastGroup,
      "disassociateWirelessDevice": this.disassociateWirelessDevice,
      "firmwareUpdateImage": this.firmwareUpdateImage,
      "firmwareUpdateRole": this.firmwareUpdateRole,
      "loRaWan": this.loRaWan,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFuotaTask.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFuotaTaskPropsToCloudFormation(props);
  }
}

export namespace CfnFuotaTask {
  /**
   * The LoRaWAN information used with a FUOTA task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html
   */
  export interface LoRaWANProperty {
    /**
     * The frequency band (RFRegion) value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-rfregion
     */
    readonly rfRegion: string;

    /**
     * Start time of a FUOTA task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-starttime
     */
    readonly startTime?: string;
  }
}

/**
 * Properties for defining a `CfnFuotaTask`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export interface CfnFuotaTaskProps {
  /**
   * The ID of the multicast group to associate with a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatemulticastgroup
   */
  readonly associateMulticastGroup?: string;

  /**
   * The ID of the wireless device to associate with a multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatewirelessdevice
   */
  readonly associateWirelessDevice?: string;

  /**
   * The description of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-description
   */
  readonly description?: string;

  /**
   * The ID of the multicast group to disassociate from a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatemulticastgroup
   */
  readonly disassociateMulticastGroup?: string;

  /**
   * The ID of the wireless device to disassociate from a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatewirelessdevice
   */
  readonly disassociateWirelessDevice?: string;

  /**
   * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdateimage
   */
  readonly firmwareUpdateImage: string;

  /**
   * The firmware update role that is to be used with a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdaterole
   */
  readonly firmwareUpdateRole: string;

  /**
   * The LoRaWAN information used with a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-lorawan
   */
  readonly loRaWan: cdk.IResolvable | CfnFuotaTask.LoRaWANProperty;

  /**
   * The name of a FUOTA task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoRaWANProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFuotaTaskLoRaWANPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rfRegion", cdk.requiredValidator)(properties.rfRegion));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.validateString)(properties.rfRegion));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  return errors.wrap("supplied properties not correct for \"LoRaWANProperty\"");
}

// @ts-ignore TS6133
function convertCfnFuotaTaskLoRaWANPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFuotaTaskLoRaWANPropertyValidator(properties).assertSuccess();
  return {
    "RfRegion": cdk.stringToCloudFormation(properties.rfRegion),
    "StartTime": cdk.stringToCloudFormation(properties.startTime)
  };
}

// @ts-ignore TS6133
function CfnFuotaTaskLoRaWANPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFuotaTask.LoRaWANProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFuotaTask.LoRaWANProperty>();
  ret.addPropertyResult("rfRegion", "RfRegion", (properties.RfRegion != null ? cfn_parse.FromCloudFormation.getString(properties.RfRegion) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFuotaTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnFuotaTaskProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFuotaTaskPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associateMulticastGroup", cdk.validateString)(properties.associateMulticastGroup));
  errors.collect(cdk.propertyValidator("associateWirelessDevice", cdk.validateString)(properties.associateWirelessDevice));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disassociateMulticastGroup", cdk.validateString)(properties.disassociateMulticastGroup));
  errors.collect(cdk.propertyValidator("disassociateWirelessDevice", cdk.validateString)(properties.disassociateWirelessDevice));
  errors.collect(cdk.propertyValidator("firmwareUpdateImage", cdk.requiredValidator)(properties.firmwareUpdateImage));
  errors.collect(cdk.propertyValidator("firmwareUpdateImage", cdk.validateString)(properties.firmwareUpdateImage));
  errors.collect(cdk.propertyValidator("firmwareUpdateRole", cdk.requiredValidator)(properties.firmwareUpdateRole));
  errors.collect(cdk.propertyValidator("firmwareUpdateRole", cdk.validateString)(properties.firmwareUpdateRole));
  errors.collect(cdk.propertyValidator("loRaWan", cdk.requiredValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("loRaWan", CfnFuotaTaskLoRaWANPropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFuotaTaskProps\"");
}

// @ts-ignore TS6133
function convertCfnFuotaTaskPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFuotaTaskPropsValidator(properties).assertSuccess();
  return {
    "AssociateMulticastGroup": cdk.stringToCloudFormation(properties.associateMulticastGroup),
    "AssociateWirelessDevice": cdk.stringToCloudFormation(properties.associateWirelessDevice),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisassociateMulticastGroup": cdk.stringToCloudFormation(properties.disassociateMulticastGroup),
    "DisassociateWirelessDevice": cdk.stringToCloudFormation(properties.disassociateWirelessDevice),
    "FirmwareUpdateImage": cdk.stringToCloudFormation(properties.firmwareUpdateImage),
    "FirmwareUpdateRole": cdk.stringToCloudFormation(properties.firmwareUpdateRole),
    "LoRaWAN": convertCfnFuotaTaskLoRaWANPropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFuotaTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFuotaTaskProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFuotaTaskProps>();
  ret.addPropertyResult("associateMulticastGroup", "AssociateMulticastGroup", (properties.AssociateMulticastGroup != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateMulticastGroup) : undefined));
  ret.addPropertyResult("associateWirelessDevice", "AssociateWirelessDevice", (properties.AssociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateWirelessDevice) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disassociateMulticastGroup", "DisassociateMulticastGroup", (properties.DisassociateMulticastGroup != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateMulticastGroup) : undefined));
  ret.addPropertyResult("disassociateWirelessDevice", "DisassociateWirelessDevice", (properties.DisassociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateWirelessDevice) : undefined));
  ret.addPropertyResult("firmwareUpdateImage", "FirmwareUpdateImage", (properties.FirmwareUpdateImage != null ? cfn_parse.FromCloudFormation.getString(properties.FirmwareUpdateImage) : undefined));
  ret.addPropertyResult("firmwareUpdateRole", "FirmwareUpdateRole", (properties.FirmwareUpdateRole != null ? cfn_parse.FromCloudFormation.getString(properties.FirmwareUpdateRole) : undefined));
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnFuotaTaskLoRaWANPropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A multicast group.
 *
 * @cloudformationResource AWS::IoTWireless::MulticastGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export class CfnMulticastGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::MulticastGroup";

  /**
   * Build a CfnMulticastGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMulticastGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMulticastGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMulticastGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the multicast group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the multicast group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Multicast group number of devices in group. Returned after successful read.
   *
   * @cloudformationAttribute LoRaWAN.NumberOfDevicesInGroup
   */
  public readonly attrLoRaWanNumberOfDevicesInGroup: number;

  /**
   * Multicast group number of devices requested. Returned after successful read.
   *
   * @cloudformationAttribute LoRaWAN.NumberOfDevicesRequested
   */
  public readonly attrLoRaWanNumberOfDevicesRequested: number;

  /**
   * The status of a multicast group.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The ID of the wireless device to associate with a multicast group.
   */
  public associateWirelessDevice?: string;

  /**
   * The description of the multicast group.
   */
  public description?: string;

  /**
   * The ID of the wireless device to disassociate from a multicast group.
   */
  public disassociateWirelessDevice?: string;

  /**
   * The LoRaWAN information that is to be used with the multicast group.
   */
  public loRaWan: cdk.IResolvable | CfnMulticastGroup.LoRaWANProperty;

  /**
   * The name of the multicast group.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMulticastGroupProps) {
    super(scope, id, {
      "type": CfnMulticastGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "loRaWan", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLoRaWanNumberOfDevicesInGroup = cdk.Token.asNumber(this.getAtt("LoRaWAN.NumberOfDevicesInGroup", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanNumberOfDevicesRequested = cdk.Token.asNumber(this.getAtt("LoRaWAN.NumberOfDevicesRequested", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.associateWirelessDevice = props.associateWirelessDevice;
    this.description = props.description;
    this.disassociateWirelessDevice = props.disassociateWirelessDevice;
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::MulticastGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associateWirelessDevice": this.associateWirelessDevice,
      "description": this.description,
      "disassociateWirelessDevice": this.disassociateWirelessDevice,
      "loRaWan": this.loRaWan,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMulticastGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMulticastGroupPropsToCloudFormation(props);
  }
}

export namespace CfnMulticastGroup {
  /**
   * The LoRaWAN information that is to be used with the multicast group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html
   */
  export interface LoRaWANProperty {
    /**
     * DlClass for LoRaWAN.
     *
     * Valid values are ClassB and ClassC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-dlclass
     */
    readonly dlClass: string;

    /**
     * Number of devices that are associated to the multicast group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesingroup
     */
    readonly numberOfDevicesInGroup?: number;

    /**
     * Number of devices that are requested to be associated with the multicast group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesrequested
     */
    readonly numberOfDevicesRequested?: number;

    /**
     * The frequency band (RFRegion) value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-rfregion
     */
    readonly rfRegion: string;
  }
}

/**
 * Properties for defining a `CfnMulticastGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export interface CfnMulticastGroupProps {
  /**
   * The ID of the wireless device to associate with a multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-associatewirelessdevice
   */
  readonly associateWirelessDevice?: string;

  /**
   * The description of the multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-description
   */
  readonly description?: string;

  /**
   * The ID of the wireless device to disassociate from a multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-disassociatewirelessdevice
   */
  readonly disassociateWirelessDevice?: string;

  /**
   * The LoRaWAN information that is to be used with the multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-lorawan
   */
  readonly loRaWan: cdk.IResolvable | CfnMulticastGroup.LoRaWANProperty;

  /**
   * The name of the multicast group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoRaWANProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMulticastGroupLoRaWANPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dlClass", cdk.requiredValidator)(properties.dlClass));
  errors.collect(cdk.propertyValidator("dlClass", cdk.validateString)(properties.dlClass));
  errors.collect(cdk.propertyValidator("numberOfDevicesInGroup", cdk.validateNumber)(properties.numberOfDevicesInGroup));
  errors.collect(cdk.propertyValidator("numberOfDevicesRequested", cdk.validateNumber)(properties.numberOfDevicesRequested));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.requiredValidator)(properties.rfRegion));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.validateString)(properties.rfRegion));
  return errors.wrap("supplied properties not correct for \"LoRaWANProperty\"");
}

// @ts-ignore TS6133
function convertCfnMulticastGroupLoRaWANPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMulticastGroupLoRaWANPropertyValidator(properties).assertSuccess();
  return {
    "DlClass": cdk.stringToCloudFormation(properties.dlClass),
    "NumberOfDevicesInGroup": cdk.numberToCloudFormation(properties.numberOfDevicesInGroup),
    "NumberOfDevicesRequested": cdk.numberToCloudFormation(properties.numberOfDevicesRequested),
    "RfRegion": cdk.stringToCloudFormation(properties.rfRegion)
  };
}

// @ts-ignore TS6133
function CfnMulticastGroupLoRaWANPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMulticastGroup.LoRaWANProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMulticastGroup.LoRaWANProperty>();
  ret.addPropertyResult("dlClass", "DlClass", (properties.DlClass != null ? cfn_parse.FromCloudFormation.getString(properties.DlClass) : undefined));
  ret.addPropertyResult("numberOfDevicesInGroup", "NumberOfDevicesInGroup", (properties.NumberOfDevicesInGroup != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDevicesInGroup) : undefined));
  ret.addPropertyResult("numberOfDevicesRequested", "NumberOfDevicesRequested", (properties.NumberOfDevicesRequested != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDevicesRequested) : undefined));
  ret.addPropertyResult("rfRegion", "RfRegion", (properties.RfRegion != null ? cfn_parse.FromCloudFormation.getString(properties.RfRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMulticastGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnMulticastGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMulticastGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associateWirelessDevice", cdk.validateString)(properties.associateWirelessDevice));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disassociateWirelessDevice", cdk.validateString)(properties.disassociateWirelessDevice));
  errors.collect(cdk.propertyValidator("loRaWan", cdk.requiredValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("loRaWan", CfnMulticastGroupLoRaWANPropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMulticastGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnMulticastGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMulticastGroupPropsValidator(properties).assertSuccess();
  return {
    "AssociateWirelessDevice": cdk.stringToCloudFormation(properties.associateWirelessDevice),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisassociateWirelessDevice": cdk.stringToCloudFormation(properties.disassociateWirelessDevice),
    "LoRaWAN": convertCfnMulticastGroupLoRaWANPropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMulticastGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMulticastGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMulticastGroupProps>();
  ret.addPropertyResult("associateWirelessDevice", "AssociateWirelessDevice", (properties.AssociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateWirelessDevice) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disassociateWirelessDevice", "DisassociateWirelessDevice", (properties.DisassociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateWirelessDevice) : undefined));
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnMulticastGroupLoRaWANPropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Network analyzer configuration.
 *
 * @cloudformationResource AWS::IoTWireless::NetworkAnalyzerConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export class CfnNetworkAnalyzerConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::NetworkAnalyzerConfiguration";

  /**
   * Build a CfnNetworkAnalyzerConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNetworkAnalyzerConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNetworkAnalyzerConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNetworkAnalyzerConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the resource.
   */
  public description?: string;

  /**
   * Name of the network analyzer configuration.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Trace content for your wireless gateway and wireless device resources.
   */
  public traceContent?: any | cdk.IResolvable;

  /**
   * Wireless device resources to add to the network analyzer configuration.
   */
  public wirelessDevices?: Array<string>;

  /**
   * Wireless gateway resources to add to the network analyzer configuration.
   */
  public wirelessGateways?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNetworkAnalyzerConfigurationProps) {
    super(scope, id, {
      "type": CfnNetworkAnalyzerConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::NetworkAnalyzerConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.traceContent = props.traceContent;
    this.wirelessDevices = props.wirelessDevices;
    this.wirelessGateways = props.wirelessGateways;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "traceContent": this.traceContent,
      "wirelessDevices": this.wirelessDevices,
      "wirelessGateways": this.wirelessGateways
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNetworkAnalyzerConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNetworkAnalyzerConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnNetworkAnalyzerConfiguration {
  /**
   * Trace content for your wireless gateway and wireless device resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html
   */
  export interface TraceContentProperty {
    /**
     * The log level for a log message.
     *
     * The log levels can be disabled, or set to `ERROR` to display less verbose logs containing only error information, or to `INFO` for more detailed logs
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-loglevel
     */
    readonly logLevel?: string;

    /**
     * `FrameInfo` of your wireless device resources for the trace content.
     *
     * Use FrameInfo to debug the communication between your LoRaWAN end devices and the network server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-wirelessdeviceframeinfo
     */
    readonly wirelessDeviceFrameInfo?: string;
  }
}

/**
 * Properties for defining a `CfnNetworkAnalyzerConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export interface CfnNetworkAnalyzerConfigurationProps {
  /**
   * The description of the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-description
   */
  readonly description?: string;

  /**
   * Name of the network analyzer configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-name
   */
  readonly name: string;

  /**
   * The tags to attach to the specified resource.
   *
   * Tags are metadata that you can use to manage a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Trace content for your wireless gateway and wireless device resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent
   */
  readonly traceContent?: any | cdk.IResolvable;

  /**
   * Wireless device resources to add to the network analyzer configuration.
   *
   * Provide the `WirelessDeviceId` of the resource to add in the input array.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessdevices
   */
  readonly wirelessDevices?: Array<string>;

  /**
   * Wireless gateway resources to add to the network analyzer configuration.
   *
   * Provide the `WirelessGatewayId` of the resource to add in the input array.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessgateways
   */
  readonly wirelessGateways?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `TraceContentProperty`
 *
 * @param properties - the TypeScript properties of a `TraceContentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationTraceContentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  errors.collect(cdk.propertyValidator("wirelessDeviceFrameInfo", cdk.validateString)(properties.wirelessDeviceFrameInfo));
  return errors.wrap("supplied properties not correct for \"TraceContentProperty\"");
}

// @ts-ignore TS6133
function convertCfnNetworkAnalyzerConfigurationTraceContentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNetworkAnalyzerConfigurationTraceContentPropertyValidator(properties).assertSuccess();
  return {
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel),
    "WirelessDeviceFrameInfo": cdk.stringToCloudFormation(properties.wirelessDeviceFrameInfo)
  };
}

// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationTraceContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNetworkAnalyzerConfiguration.TraceContentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkAnalyzerConfiguration.TraceContentProperty>();
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
  ret.addPropertyResult("wirelessDeviceFrameInfo", "WirelessDeviceFrameInfo", (properties.WirelessDeviceFrameInfo != null ? cfn_parse.FromCloudFormation.getString(properties.WirelessDeviceFrameInfo) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnNetworkAnalyzerConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnNetworkAnalyzerConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("traceContent", cdk.validateObject)(properties.traceContent));
  errors.collect(cdk.propertyValidator("wirelessDevices", cdk.listValidator(cdk.validateString))(properties.wirelessDevices));
  errors.collect(cdk.propertyValidator("wirelessGateways", cdk.listValidator(cdk.validateString))(properties.wirelessGateways));
  return errors.wrap("supplied properties not correct for \"CfnNetworkAnalyzerConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnNetworkAnalyzerConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNetworkAnalyzerConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TraceContent": cdk.objectToCloudFormation(properties.traceContent),
    "WirelessDevices": cdk.listMapper(cdk.stringToCloudFormation)(properties.wirelessDevices),
    "WirelessGateways": cdk.listMapper(cdk.stringToCloudFormation)(properties.wirelessGateways)
  };
}

// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNetworkAnalyzerConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkAnalyzerConfigurationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("traceContent", "TraceContent", (properties.TraceContent != null ? cfn_parse.FromCloudFormation.getAny(properties.TraceContent) : undefined));
  ret.addPropertyResult("wirelessDevices", "WirelessDevices", (properties.WirelessDevices != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.WirelessDevices) : undefined));
  ret.addPropertyResult("wirelessGateways", "WirelessGateways", (properties.WirelessGateways != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.WirelessGateways) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A partner account.
 *
 * If `PartnerAccountId` and `PartnerType` are `null` , returns all partner accounts.
 *
 * @cloudformationResource AWS::IoTWireless::PartnerAccount
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export class CfnPartnerAccount extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::PartnerAccount";

  /**
   * Build a CfnPartnerAccount from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPartnerAccount {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPartnerAccountPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPartnerAccount(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The fingerprint of the Sidewalk application server private key.
   *
   * @cloudformationAttribute Fingerprint
   */
  public readonly attrFingerprint: string;

  /**
   * Whether the partner account is linked to the AWS account.
   */
  public accountLinked?: boolean | cdk.IResolvable;

  /**
   * The ID of the partner account to update.
   */
  public partnerAccountId?: string;

  /**
   * The partner type.
   */
  public partnerType?: string;

  /**
   * The Sidewalk account credentials.
   */
  public sidewalk?: cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoProperty;

  public sidewalkResponse?: cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty;

  /**
   * Sidewalk update.
   */
  public sidewalkUpdate?: cdk.IResolvable | CfnPartnerAccount.SidewalkUpdateAccountProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPartnerAccountProps = {}) {
    super(scope, id, {
      "type": CfnPartnerAccount.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrFingerprint = cdk.Token.asString(this.getAtt("Fingerprint", cdk.ResolutionTypeHint.STRING));
    this.accountLinked = props.accountLinked;
    this.partnerAccountId = props.partnerAccountId;
    this.partnerType = props.partnerType;
    this.sidewalk = props.sidewalk;
    this.sidewalkResponse = props.sidewalkResponse;
    this.sidewalkUpdate = props.sidewalkUpdate;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::PartnerAccount", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountLinked": this.accountLinked,
      "partnerAccountId": this.partnerAccountId,
      "partnerType": this.partnerType,
      "sidewalk": this.sidewalk,
      "sidewalkResponse": this.sidewalkResponse,
      "sidewalkUpdate": this.sidewalkUpdate,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPartnerAccount.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPartnerAccountPropsToCloudFormation(props);
  }
}

export namespace CfnPartnerAccount {
  /**
   * Information about a Sidewalk account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html
   */
  export interface SidewalkAccountInfoWithFingerprintProperty {
    /**
     * The Sidewalk Amazon ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-amazonid
     */
    readonly amazonId?: string;

    /**
     * The Amazon Resource Name (ARN) of the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-arn
     */
    readonly arn?: string;

    /**
     * The fingerprint of the Sidewalk application server private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-fingerprint
     */
    readonly fingerprint?: string;
  }

  /**
   * Information about a Sidewalk account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html
   */
  export interface SidewalkAccountInfoProperty {
    /**
     * The Sidewalk application server private key.
     *
     * The application server private key is a secret key, which you should handle in a similar way as you would an application password. You can protect the application server private key by storing the value in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html#cfn-iotwireless-partneraccount-sidewalkaccountinfo-appserverprivatekey
     */
    readonly appServerPrivateKey: string;
  }

  /**
   * Sidewalk update.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html
   */
  export interface SidewalkUpdateAccountProperty {
    /**
     * The new Sidewalk application server private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html#cfn-iotwireless-partneraccount-sidewalkupdateaccount-appserverprivatekey
     */
    readonly appServerPrivateKey?: string;
  }
}

/**
 * Properties for defining a `CfnPartnerAccount`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export interface CfnPartnerAccountProps {
  /**
   * Whether the partner account is linked to the AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-accountlinked
   */
  readonly accountLinked?: boolean | cdk.IResolvable;

  /**
   * The ID of the partner account to update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partneraccountid
   */
  readonly partnerAccountId?: string;

  /**
   * The partner type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partnertype
   */
  readonly partnerType?: string;

  /**
   * The Sidewalk account credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalk
   */
  readonly sidewalk?: cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkresponse
   */
  readonly sidewalkResponse?: cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty;

  /**
   * Sidewalk update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkupdate
   */
  readonly sidewalkUpdate?: cdk.IResolvable | CfnPartnerAccount.SidewalkUpdateAccountProperty;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SidewalkAccountInfoWithFingerprintProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoWithFingerprintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amazonId", cdk.validateString)(properties.amazonId));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("fingerprint", cdk.validateString)(properties.fingerprint));
  return errors.wrap("supplied properties not correct for \"SidewalkAccountInfoWithFingerprintProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyValidator(properties).assertSuccess();
  return {
    "AmazonId": cdk.stringToCloudFormation(properties.amazonId),
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "Fingerprint": cdk.stringToCloudFormation(properties.fingerprint)
  };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty>();
  ret.addPropertyResult("amazonId", "AmazonId", (properties.AmazonId != null ? cfn_parse.FromCloudFormation.getString(properties.AmazonId) : undefined));
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("fingerprint", "Fingerprint", (properties.Fingerprint != null ? cfn_parse.FromCloudFormation.getString(properties.Fingerprint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SidewalkAccountInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appServerPrivateKey", cdk.requiredValidator)(properties.appServerPrivateKey));
  errors.collect(cdk.propertyValidator("appServerPrivateKey", cdk.validateString)(properties.appServerPrivateKey));
  return errors.wrap("supplied properties not correct for \"SidewalkAccountInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartnerAccountSidewalkAccountInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartnerAccountSidewalkAccountInfoPropertyValidator(properties).assertSuccess();
  return {
    "AppServerPrivateKey": cdk.stringToCloudFormation(properties.appServerPrivateKey)
  };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartnerAccount.SidewalkAccountInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkAccountInfoProperty>();
  ret.addPropertyResult("appServerPrivateKey", "AppServerPrivateKey", (properties.AppServerPrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppServerPrivateKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SidewalkUpdateAccountProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkUpdateAccountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartnerAccountSidewalkUpdateAccountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appServerPrivateKey", cdk.validateString)(properties.appServerPrivateKey));
  return errors.wrap("supplied properties not correct for \"SidewalkUpdateAccountProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartnerAccountSidewalkUpdateAccountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartnerAccountSidewalkUpdateAccountPropertyValidator(properties).assertSuccess();
  return {
    "AppServerPrivateKey": cdk.stringToCloudFormation(properties.appServerPrivateKey)
  };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkUpdateAccountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartnerAccount.SidewalkUpdateAccountProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkUpdateAccountProperty>();
  ret.addPropertyResult("appServerPrivateKey", "AppServerPrivateKey", (properties.AppServerPrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppServerPrivateKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPartnerAccountProps`
 *
 * @param properties - the TypeScript properties of a `CfnPartnerAccountProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartnerAccountPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountLinked", cdk.validateBoolean)(properties.accountLinked));
  errors.collect(cdk.propertyValidator("partnerAccountId", cdk.validateString)(properties.partnerAccountId));
  errors.collect(cdk.propertyValidator("partnerType", cdk.validateString)(properties.partnerType));
  errors.collect(cdk.propertyValidator("sidewalk", CfnPartnerAccountSidewalkAccountInfoPropertyValidator)(properties.sidewalk));
  errors.collect(cdk.propertyValidator("sidewalkResponse", CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyValidator)(properties.sidewalkResponse));
  errors.collect(cdk.propertyValidator("sidewalkUpdate", CfnPartnerAccountSidewalkUpdateAccountPropertyValidator)(properties.sidewalkUpdate));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPartnerAccountProps\"");
}

// @ts-ignore TS6133
function convertCfnPartnerAccountPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartnerAccountPropsValidator(properties).assertSuccess();
  return {
    "AccountLinked": cdk.booleanToCloudFormation(properties.accountLinked),
    "PartnerAccountId": cdk.stringToCloudFormation(properties.partnerAccountId),
    "PartnerType": cdk.stringToCloudFormation(properties.partnerType),
    "Sidewalk": convertCfnPartnerAccountSidewalkAccountInfoPropertyToCloudFormation(properties.sidewalk),
    "SidewalkResponse": convertCfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyToCloudFormation(properties.sidewalkResponse),
    "SidewalkUpdate": convertCfnPartnerAccountSidewalkUpdateAccountPropertyToCloudFormation(properties.sidewalkUpdate),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPartnerAccountPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnerAccountProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccountProps>();
  ret.addPropertyResult("accountLinked", "AccountLinked", (properties.AccountLinked != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccountLinked) : undefined));
  ret.addPropertyResult("partnerAccountId", "PartnerAccountId", (properties.PartnerAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerAccountId) : undefined));
  ret.addPropertyResult("partnerType", "PartnerType", (properties.PartnerType != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerType) : undefined));
  ret.addPropertyResult("sidewalk", "Sidewalk", (properties.Sidewalk != null ? CfnPartnerAccountSidewalkAccountInfoPropertyFromCloudFormation(properties.Sidewalk) : undefined));
  ret.addPropertyResult("sidewalkResponse", "SidewalkResponse", (properties.SidewalkResponse != null ? CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyFromCloudFormation(properties.SidewalkResponse) : undefined));
  ret.addPropertyResult("sidewalkUpdate", "SidewalkUpdate", (properties.SidewalkUpdate != null ? CfnPartnerAccountSidewalkUpdateAccountPropertyFromCloudFormation(properties.SidewalkUpdate) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new service profile.
 *
 * @cloudformationResource AWS::IoTWireless::ServiceProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export class CfnServiceProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::ServiceProfile";

  /**
   * Build a CfnServiceProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the service profile created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the service profile created.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * @cloudformationAttribute LoRaWAN.ChannelMask
   */
  public readonly attrLoRaWanChannelMask: string;

  /**
   * @cloudformationAttribute LoRaWAN.DevStatusReqFreq
   */
  public readonly attrLoRaWanDevStatusReqFreq: number;

  /**
   * @cloudformationAttribute LoRaWAN.DlBucketSize
   */
  public readonly attrLoRaWanDlBucketSize: number;

  /**
   * @cloudformationAttribute LoRaWAN.DlRate
   */
  public readonly attrLoRaWanDlRate: number;

  /**
   * @cloudformationAttribute LoRaWAN.DlRatePolicy
   */
  public readonly attrLoRaWanDlRatePolicy: string;

  /**
   * @cloudformationAttribute LoRaWAN.DrMax
   */
  public readonly attrLoRaWanDrMax: number;

  /**
   * @cloudformationAttribute LoRaWAN.DrMin
   */
  public readonly attrLoRaWanDrMin: number;

  /**
   * @cloudformationAttribute LoRaWAN.HrAllowed
   */
  public readonly attrLoRaWanHrAllowed: cdk.IResolvable;

  /**
   * @cloudformationAttribute LoRaWAN.MinGwDiversity
   */
  public readonly attrLoRaWanMinGwDiversity: number;

  /**
   * @cloudformationAttribute LoRaWAN.NwkGeoLoc
   */
  public readonly attrLoRaWanNwkGeoLoc: cdk.IResolvable;

  /**
   * @cloudformationAttribute LoRaWAN.ReportDevStatusBattery
   */
  public readonly attrLoRaWanReportDevStatusBattery: cdk.IResolvable;

  /**
   * @cloudformationAttribute LoRaWAN.ReportDevStatusMargin
   */
  public readonly attrLoRaWanReportDevStatusMargin: cdk.IResolvable;

  /**
   * @cloudformationAttribute LoRaWANResponse
   */
  public readonly attrLoRaWanResponse: cdk.IResolvable;

  /**
   * @cloudformationAttribute LoRaWAN.TargetPer
   */
  public readonly attrLoRaWanTargetPer: number;

  /**
   * @cloudformationAttribute LoRaWAN.UlBucketSize
   */
  public readonly attrLoRaWanUlBucketSize: number;

  /**
   * @cloudformationAttribute LoRaWAN.UlRate
   */
  public readonly attrLoRaWanUlRate: number;

  /**
   * @cloudformationAttribute LoRaWAN.UlRatePolicy
   */
  public readonly attrLoRaWanUlRatePolicy: string;

  /**
   * LoRaWAN service profile object.
   */
  public loRaWan?: cdk.IResolvable | CfnServiceProfile.LoRaWANServiceProfileProperty;

  /**
   * The name of the new resource.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceProfileProps = {}) {
    super(scope, id, {
      "type": CfnServiceProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLoRaWanChannelMask = cdk.Token.asString(this.getAtt("LoRaWAN.ChannelMask", cdk.ResolutionTypeHint.STRING));
    this.attrLoRaWanDevStatusReqFreq = cdk.Token.asNumber(this.getAtt("LoRaWAN.DevStatusReqFreq", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanDlBucketSize = cdk.Token.asNumber(this.getAtt("LoRaWAN.DlBucketSize", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanDlRate = cdk.Token.asNumber(this.getAtt("LoRaWAN.DlRate", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanDlRatePolicy = cdk.Token.asString(this.getAtt("LoRaWAN.DlRatePolicy", cdk.ResolutionTypeHint.STRING));
    this.attrLoRaWanDrMax = cdk.Token.asNumber(this.getAtt("LoRaWAN.DrMax", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanDrMin = cdk.Token.asNumber(this.getAtt("LoRaWAN.DrMin", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanHrAllowed = this.getAtt("LoRaWAN.HrAllowed");
    this.attrLoRaWanMinGwDiversity = cdk.Token.asNumber(this.getAtt("LoRaWAN.MinGwDiversity", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanNwkGeoLoc = this.getAtt("LoRaWAN.NwkGeoLoc");
    this.attrLoRaWanReportDevStatusBattery = this.getAtt("LoRaWAN.ReportDevStatusBattery");
    this.attrLoRaWanReportDevStatusMargin = this.getAtt("LoRaWAN.ReportDevStatusMargin");
    this.attrLoRaWanResponse = this.getAtt("LoRaWANResponse");
    this.attrLoRaWanTargetPer = cdk.Token.asNumber(this.getAtt("LoRaWAN.TargetPer", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanUlBucketSize = cdk.Token.asNumber(this.getAtt("LoRaWAN.UlBucketSize", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanUlRate = cdk.Token.asNumber(this.getAtt("LoRaWAN.UlRate", cdk.ResolutionTypeHint.NUMBER));
    this.attrLoRaWanUlRatePolicy = cdk.Token.asString(this.getAtt("LoRaWAN.UlRatePolicy", cdk.ResolutionTypeHint.STRING));
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::ServiceProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "loRaWan": this.loRaWan,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceProfilePropsToCloudFormation(props);
  }
}

export namespace CfnServiceProfile {
  /**
   * LoRaWANServiceProfile object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html
   */
  export interface LoRaWANServiceProfileProperty {
    /**
     * The AddGWMetaData value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-addgwmetadata
     */
    readonly addGwMetadata?: boolean | cdk.IResolvable;

    /**
     * The ChannelMask value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-channelmask
     */
    readonly channelMask?: string;

    /**
     * The DevStatusReqFreq value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-devstatusreqfreq
     */
    readonly devStatusReqFreq?: number;

    /**
     * The DLBucketSize value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlbucketsize
     */
    readonly dlBucketSize?: number;

    /**
     * The DLRate value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlrate
     */
    readonly dlRate?: number;

    /**
     * The DLRatePolicy value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlratepolicy
     */
    readonly dlRatePolicy?: string;

    /**
     * The DRMax value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmax
     */
    readonly drMax?: number;

    /**
     * The DRMin value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmin
     */
    readonly drMin?: number;

    /**
     * The HRAllowed value that describes whether handover roaming is allowed.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-hrallowed
     */
    readonly hrAllowed?: boolean | cdk.IResolvable;

    /**
     * The MinGwDiversity value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-mingwdiversity
     */
    readonly minGwDiversity?: number;

    /**
     * The NwkGeoLoc value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-nwkgeoloc
     */
    readonly nwkGeoLoc?: boolean | cdk.IResolvable;

    /**
     * The PRAllowed value that describes whether passive roaming is allowed.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-prallowed
     */
    readonly prAllowed?: boolean | cdk.IResolvable;

    /**
     * The RAAllowed value that describes whether roaming activation is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-raallowed
     */
    readonly raAllowed?: boolean | cdk.IResolvable;

    /**
     * The ReportDevStatusBattery value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusbattery
     */
    readonly reportDevStatusBattery?: boolean | cdk.IResolvable;

    /**
     * The ReportDevStatusMargin value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusmargin
     */
    readonly reportDevStatusMargin?: boolean | cdk.IResolvable;

    /**
     * The TargetPer value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-targetper
     */
    readonly targetPer?: number;

    /**
     * The UlBucketSize value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulbucketsize
     */
    readonly ulBucketSize?: number;

    /**
     * The ULRate value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulrate
     */
    readonly ulRate?: number;

    /**
     * The ULRatePolicy value.
     *
     * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulratepolicy
     */
    readonly ulRatePolicy?: string;
  }
}

/**
 * Properties for defining a `CfnServiceProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export interface CfnServiceProfileProps {
  /**
   * LoRaWAN service profile object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-lorawan
   */
  readonly loRaWan?: cdk.IResolvable | CfnServiceProfile.LoRaWANServiceProfileProperty;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoRaWANServiceProfileProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANServiceProfileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceProfileLoRaWANServiceProfilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addGwMetadata", cdk.validateBoolean)(properties.addGwMetadata));
  errors.collect(cdk.propertyValidator("channelMask", cdk.validateString)(properties.channelMask));
  errors.collect(cdk.propertyValidator("devStatusReqFreq", cdk.validateNumber)(properties.devStatusReqFreq));
  errors.collect(cdk.propertyValidator("dlBucketSize", cdk.validateNumber)(properties.dlBucketSize));
  errors.collect(cdk.propertyValidator("dlRate", cdk.validateNumber)(properties.dlRate));
  errors.collect(cdk.propertyValidator("dlRatePolicy", cdk.validateString)(properties.dlRatePolicy));
  errors.collect(cdk.propertyValidator("drMax", cdk.validateNumber)(properties.drMax));
  errors.collect(cdk.propertyValidator("drMin", cdk.validateNumber)(properties.drMin));
  errors.collect(cdk.propertyValidator("hrAllowed", cdk.validateBoolean)(properties.hrAllowed));
  errors.collect(cdk.propertyValidator("minGwDiversity", cdk.validateNumber)(properties.minGwDiversity));
  errors.collect(cdk.propertyValidator("nwkGeoLoc", cdk.validateBoolean)(properties.nwkGeoLoc));
  errors.collect(cdk.propertyValidator("prAllowed", cdk.validateBoolean)(properties.prAllowed));
  errors.collect(cdk.propertyValidator("raAllowed", cdk.validateBoolean)(properties.raAllowed));
  errors.collect(cdk.propertyValidator("reportDevStatusBattery", cdk.validateBoolean)(properties.reportDevStatusBattery));
  errors.collect(cdk.propertyValidator("reportDevStatusMargin", cdk.validateBoolean)(properties.reportDevStatusMargin));
  errors.collect(cdk.propertyValidator("targetPer", cdk.validateNumber)(properties.targetPer));
  errors.collect(cdk.propertyValidator("ulBucketSize", cdk.validateNumber)(properties.ulBucketSize));
  errors.collect(cdk.propertyValidator("ulRate", cdk.validateNumber)(properties.ulRate));
  errors.collect(cdk.propertyValidator("ulRatePolicy", cdk.validateString)(properties.ulRatePolicy));
  return errors.wrap("supplied properties not correct for \"LoRaWANServiceProfileProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceProfileLoRaWANServiceProfilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceProfileLoRaWANServiceProfilePropertyValidator(properties).assertSuccess();
  return {
    "AddGwMetadata": cdk.booleanToCloudFormation(properties.addGwMetadata),
    "ChannelMask": cdk.stringToCloudFormation(properties.channelMask),
    "DevStatusReqFreq": cdk.numberToCloudFormation(properties.devStatusReqFreq),
    "DlBucketSize": cdk.numberToCloudFormation(properties.dlBucketSize),
    "DlRate": cdk.numberToCloudFormation(properties.dlRate),
    "DlRatePolicy": cdk.stringToCloudFormation(properties.dlRatePolicy),
    "DrMax": cdk.numberToCloudFormation(properties.drMax),
    "DrMin": cdk.numberToCloudFormation(properties.drMin),
    "HrAllowed": cdk.booleanToCloudFormation(properties.hrAllowed),
    "MinGwDiversity": cdk.numberToCloudFormation(properties.minGwDiversity),
    "NwkGeoLoc": cdk.booleanToCloudFormation(properties.nwkGeoLoc),
    "PrAllowed": cdk.booleanToCloudFormation(properties.prAllowed),
    "RaAllowed": cdk.booleanToCloudFormation(properties.raAllowed),
    "ReportDevStatusBattery": cdk.booleanToCloudFormation(properties.reportDevStatusBattery),
    "ReportDevStatusMargin": cdk.booleanToCloudFormation(properties.reportDevStatusMargin),
    "TargetPer": cdk.numberToCloudFormation(properties.targetPer),
    "UlBucketSize": cdk.numberToCloudFormation(properties.ulBucketSize),
    "UlRate": cdk.numberToCloudFormation(properties.ulRate),
    "UlRatePolicy": cdk.stringToCloudFormation(properties.ulRatePolicy)
  };
}

// @ts-ignore TS6133
function CfnServiceProfileLoRaWANServiceProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServiceProfile.LoRaWANServiceProfileProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProfile.LoRaWANServiceProfileProperty>();
  ret.addPropertyResult("addGwMetadata", "AddGwMetadata", (properties.AddGwMetadata != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGwMetadata) : undefined));
  ret.addPropertyResult("channelMask", "ChannelMask", (properties.ChannelMask != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelMask) : undefined));
  ret.addPropertyResult("devStatusReqFreq", "DevStatusReqFreq", (properties.DevStatusReqFreq != null ? cfn_parse.FromCloudFormation.getNumber(properties.DevStatusReqFreq) : undefined));
  ret.addPropertyResult("dlBucketSize", "DlBucketSize", (properties.DlBucketSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DlBucketSize) : undefined));
  ret.addPropertyResult("dlRate", "DlRate", (properties.DlRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.DlRate) : undefined));
  ret.addPropertyResult("dlRatePolicy", "DlRatePolicy", (properties.DlRatePolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DlRatePolicy) : undefined));
  ret.addPropertyResult("drMax", "DrMax", (properties.DrMax != null ? cfn_parse.FromCloudFormation.getNumber(properties.DrMax) : undefined));
  ret.addPropertyResult("drMin", "DrMin", (properties.DrMin != null ? cfn_parse.FromCloudFormation.getNumber(properties.DrMin) : undefined));
  ret.addPropertyResult("hrAllowed", "HrAllowed", (properties.HrAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HrAllowed) : undefined));
  ret.addPropertyResult("minGwDiversity", "MinGwDiversity", (properties.MinGwDiversity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinGwDiversity) : undefined));
  ret.addPropertyResult("nwkGeoLoc", "NwkGeoLoc", (properties.NwkGeoLoc != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NwkGeoLoc) : undefined));
  ret.addPropertyResult("prAllowed", "PrAllowed", (properties.PrAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PrAllowed) : undefined));
  ret.addPropertyResult("raAllowed", "RaAllowed", (properties.RaAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RaAllowed) : undefined));
  ret.addPropertyResult("reportDevStatusBattery", "ReportDevStatusBattery", (properties.ReportDevStatusBattery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReportDevStatusBattery) : undefined));
  ret.addPropertyResult("reportDevStatusMargin", "ReportDevStatusMargin", (properties.ReportDevStatusMargin != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReportDevStatusMargin) : undefined));
  ret.addPropertyResult("targetPer", "TargetPer", (properties.TargetPer != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetPer) : undefined));
  ret.addPropertyResult("ulBucketSize", "UlBucketSize", (properties.UlBucketSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.UlBucketSize) : undefined));
  ret.addPropertyResult("ulRate", "UlRate", (properties.UlRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.UlRate) : undefined));
  ret.addPropertyResult("ulRatePolicy", "UlRatePolicy", (properties.UlRatePolicy != null ? cfn_parse.FromCloudFormation.getString(properties.UlRatePolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loRaWan", CfnServiceProfileLoRaWANServiceProfilePropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceProfilePropsValidator(properties).assertSuccess();
  return {
    "LoRaWAN": convertCfnServiceProfileLoRaWANServiceProfilePropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServiceProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProfileProps>();
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnServiceProfileLoRaWANServiceProfilePropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a gateway task definition.
 *
 * @cloudformationResource AWS::IoTWireless::TaskDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export class CfnTaskDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::TaskDefinition";

  /**
   * Build a CfnTaskDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTaskDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTaskDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the new wireless gateway task definition.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Whether to automatically create tasks using this task definition for all gateways with the specified current version.
   */
  public autoCreateTasks: boolean | cdk.IResolvable;

  /**
   * LoRaWANUpdateGatewayTaskEntry object.
   */
  public loRaWanUpdateGatewayTaskEntry?: cdk.IResolvable | CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty;

  /**
   * The name of the new resource.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A filter to list only the wireless gateway task definitions that use this task definition type.
   */
  public taskDefinitionType?: string;

  /**
   * Information about the gateways to update.
   */
  public update?: cdk.IResolvable | CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTaskDefinitionProps) {
    super(scope, id, {
      "type": CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoCreateTasks", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.autoCreateTasks = props.autoCreateTasks;
    this.loRaWanUpdateGatewayTaskEntry = props.loRaWanUpdateGatewayTaskEntry;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::TaskDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taskDefinitionType = props.taskDefinitionType;
    this.update = props.update;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoCreateTasks": this.autoCreateTasks,
      "loRaWanUpdateGatewayTaskEntry": this.loRaWanUpdateGatewayTaskEntry,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "taskDefinitionType": this.taskDefinitionType,
      "update": this.update
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTaskDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnTaskDefinition {
  /**
   * LoRaWANUpdateGatewayTaskEntry object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html
   */
  export interface LoRaWANUpdateGatewayTaskEntryProperty {
    /**
     * The version of the gateways that should receive the update.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-currentversion
     */
    readonly currentVersion?: cdk.IResolvable | CfnTaskDefinition.LoRaWANGatewayVersionProperty;

    /**
     * The firmware version to update the gateway to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-updateversion
     */
    readonly updateVersion?: cdk.IResolvable | CfnTaskDefinition.LoRaWANGatewayVersionProperty;
  }

  /**
   * LoRaWANGatewayVersion object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html
   */
  export interface LoRaWANGatewayVersionProperty {
    /**
     * The model number of the wireless gateway.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-model
     */
    readonly model?: string;

    /**
     * The version of the wireless gateway firmware.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-packageversion
     */
    readonly packageVersion?: string;

    /**
     * The basic station version of the wireless gateway.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-station
     */
    readonly station?: string;
  }

  /**
   * UpdateWirelessGatewayTaskCreate object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html
   */
  export interface UpdateWirelessGatewayTaskCreateProperty {
    /**
     * The properties that relate to the LoRaWAN wireless gateway.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-lorawan
     */
    readonly loRaWan?: cdk.IResolvable | CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty;

    /**
     * The IAM role used to read data from the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatarole
     */
    readonly updateDataRole?: string;

    /**
     * The link to the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatasource
     */
    readonly updateDataSource?: string;
  }

  /**
   * The signature used to verify the update firmware.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html
   */
  export interface LoRaWANUpdateGatewayTaskCreateProperty {
    /**
     * The version of the gateways that should receive the update.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-currentversion
     */
    readonly currentVersion?: cdk.IResolvable | CfnTaskDefinition.LoRaWANGatewayVersionProperty;

    /**
     * The CRC of the signature private key to check.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-sigkeycrc
     */
    readonly sigKeyCrc?: number;

    /**
     * The signature used to verify the update firmware.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updatesignature
     */
    readonly updateSignature?: string;

    /**
     * The firmware version to update the gateway to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updateversion
     */
    readonly updateVersion?: cdk.IResolvable | CfnTaskDefinition.LoRaWANGatewayVersionProperty;
  }
}

/**
 * Properties for defining a `CfnTaskDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export interface CfnTaskDefinitionProps {
  /**
   * Whether to automatically create tasks using this task definition for all gateways with the specified current version.
   *
   * If `false` , the task must be created by calling `CreateWirelessGatewayTask` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-autocreatetasks
   */
  readonly autoCreateTasks: boolean | cdk.IResolvable;

  /**
   * LoRaWANUpdateGatewayTaskEntry object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry
   */
  readonly loRaWanUpdateGatewayTaskEntry?: cdk.IResolvable | CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A filter to list only the wireless gateway task definitions that use this task definition type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-taskdefinitiontype
   */
  readonly taskDefinitionType?: string;

  /**
   * Information about the gateways to update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-update
   */
  readonly update?: cdk.IResolvable | CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty;
}

/**
 * Determine whether the given properties match those of a `LoRaWANGatewayVersionProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("packageVersion", cdk.validateString)(properties.packageVersion));
  errors.collect(cdk.propertyValidator("station", cdk.validateString)(properties.station));
  return errors.wrap("supplied properties not correct for \"LoRaWANGatewayVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator(properties).assertSuccess();
  return {
    "Model": cdk.stringToCloudFormation(properties.model),
    "PackageVersion": cdk.stringToCloudFormation(properties.packageVersion),
    "Station": cdk.stringToCloudFormation(properties.station)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.LoRaWANGatewayVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANGatewayVersionProperty>();
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("packageVersion", "PackageVersion", (properties.PackageVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PackageVersion) : undefined));
  ret.addPropertyResult("station", "Station", (properties.Station != null ? cfn_parse.FromCloudFormation.getString(properties.Station) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoRaWANUpdateGatewayTaskEntryProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("currentVersion", CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator)(properties.currentVersion));
  errors.collect(cdk.propertyValidator("updateVersion", CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator)(properties.updateVersion));
  return errors.wrap("supplied properties not correct for \"LoRaWANUpdateGatewayTaskEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyValidator(properties).assertSuccess();
  return {
    "CurrentVersion": convertCfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.currentVersion),
    "UpdateVersion": convertCfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.updateVersion)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty>();
  ret.addPropertyResult("currentVersion", "CurrentVersion", (properties.CurrentVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.CurrentVersion) : undefined));
  ret.addPropertyResult("updateVersion", "UpdateVersion", (properties.UpdateVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.UpdateVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoRaWANUpdateGatewayTaskCreateProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskCreateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("currentVersion", CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator)(properties.currentVersion));
  errors.collect(cdk.propertyValidator("sigKeyCrc", cdk.validateNumber)(properties.sigKeyCrc));
  errors.collect(cdk.propertyValidator("updateSignature", cdk.validateString)(properties.updateSignature));
  errors.collect(cdk.propertyValidator("updateVersion", CfnTaskDefinitionLoRaWANGatewayVersionPropertyValidator)(properties.updateVersion));
  return errors.wrap("supplied properties not correct for \"LoRaWANUpdateGatewayTaskCreateProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyValidator(properties).assertSuccess();
  return {
    "CurrentVersion": convertCfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.currentVersion),
    "SigKeyCrc": cdk.numberToCloudFormation(properties.sigKeyCrc),
    "UpdateSignature": cdk.stringToCloudFormation(properties.updateSignature),
    "UpdateVersion": convertCfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.updateVersion)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty>();
  ret.addPropertyResult("currentVersion", "CurrentVersion", (properties.CurrentVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.CurrentVersion) : undefined));
  ret.addPropertyResult("sigKeyCrc", "SigKeyCrc", (properties.SigKeyCrc != null ? cfn_parse.FromCloudFormation.getNumber(properties.SigKeyCrc) : undefined));
  ret.addPropertyResult("updateSignature", "UpdateSignature", (properties.UpdateSignature != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateSignature) : undefined));
  ret.addPropertyResult("updateVersion", "UpdateVersion", (properties.UpdateVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.UpdateVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UpdateWirelessGatewayTaskCreateProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateWirelessGatewayTaskCreateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loRaWan", CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("updateDataRole", cdk.validateString)(properties.updateDataRole));
  errors.collect(cdk.propertyValidator("updateDataSource", cdk.validateString)(properties.updateDataSource));
  return errors.wrap("supplied properties not correct for \"UpdateWirelessGatewayTaskCreateProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyValidator(properties).assertSuccess();
  return {
    "LoRaWAN": convertCfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyToCloudFormation(properties.loRaWan),
    "UpdateDataRole": cdk.stringToCloudFormation(properties.updateDataRole),
    "UpdateDataSource": cdk.stringToCloudFormation(properties.updateDataSource)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty>();
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("updateDataRole", "UpdateDataRole", (properties.UpdateDataRole != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateDataRole) : undefined));
  ret.addPropertyResult("updateDataSource", "UpdateDataSource", (properties.UpdateDataSource != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateDataSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTaskDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoCreateTasks", cdk.requiredValidator)(properties.autoCreateTasks));
  errors.collect(cdk.propertyValidator("autoCreateTasks", cdk.validateBoolean)(properties.autoCreateTasks));
  errors.collect(cdk.propertyValidator("loRaWanUpdateGatewayTaskEntry", CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyValidator)(properties.loRaWanUpdateGatewayTaskEntry));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskDefinitionType", cdk.validateString)(properties.taskDefinitionType));
  errors.collect(cdk.propertyValidator("update", CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyValidator)(properties.update));
  return errors.wrap("supplied properties not correct for \"CfnTaskDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnTaskDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDefinitionPropsValidator(properties).assertSuccess();
  return {
    "AutoCreateTasks": cdk.booleanToCloudFormation(properties.autoCreateTasks),
    "LoRaWANUpdateGatewayTaskEntry": convertCfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyToCloudFormation(properties.loRaWanUpdateGatewayTaskEntry),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskDefinitionType": cdk.stringToCloudFormation(properties.taskDefinitionType),
    "Update": convertCfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyToCloudFormation(properties.update)
  };
}

// @ts-ignore TS6133
function CfnTaskDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinitionProps>();
  ret.addPropertyResult("autoCreateTasks", "AutoCreateTasks", (properties.AutoCreateTasks != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoCreateTasks) : undefined));
  ret.addPropertyResult("loRaWanUpdateGatewayTaskEntry", "LoRaWANUpdateGatewayTaskEntry", (properties.LoRaWANUpdateGatewayTaskEntry != null ? CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyFromCloudFormation(properties.LoRaWANUpdateGatewayTaskEntry) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskDefinitionType", "TaskDefinitionType", (properties.TaskDefinitionType != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionType) : undefined));
  ret.addPropertyResult("update", "Update", (properties.Update != null ? CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyFromCloudFormation(properties.Update) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Provisions a wireless device.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessDevice
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export class CfnWirelessDevice extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::WirelessDevice";

  /**
   * Build a CfnWirelessDevice from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessDevice {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWirelessDevicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWirelessDevice(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the wireless device created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the wireless device created.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the thing associated with the wireless device. The value is empty if a thing isn't associated with the device.
   *
   * @cloudformationAttribute ThingName
   */
  public readonly attrThingName: string;

  /**
   * The description of the new resource.
   */
  public description?: string;

  /**
   * The name of the destination to assign to the new wireless device.
   */
  public destinationName: string;

  /**
   * The date and time when the most recent uplink was received.
   */
  public lastUplinkReceivedAt?: string;

  /**
   * The device configuration information to use to create the wireless device.
   */
  public loRaWan?: cdk.IResolvable | CfnWirelessDevice.LoRaWANDeviceProperty;

  /**
   * The name of the new resource.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the thing to associate with the wireless device.
   */
  public thingArn?: string;

  /**
   * The wireless device type.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWirelessDeviceProps) {
    super(scope, id, {
      "type": CfnWirelessDevice.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationName", this);
    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrThingName = cdk.Token.asString(this.getAtt("ThingName", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.destinationName = props.destinationName;
    this.lastUplinkReceivedAt = props.lastUplinkReceivedAt;
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::WirelessDevice", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thingArn = props.thingArn;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "destinationName": this.destinationName,
      "lastUplinkReceivedAt": this.lastUplinkReceivedAt,
      "loRaWan": this.loRaWan,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "thingArn": this.thingArn,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWirelessDevice.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWirelessDevicePropsToCloudFormation(props);
  }
}

export namespace CfnWirelessDevice {
  /**
   * LoRaWAN object for create functions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html
   */
  export interface LoRaWANDeviceProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv10x
     */
    readonly abpV10X?: CfnWirelessDevice.AbpV10xProperty | cdk.IResolvable;

    /**
     * ABP device object for create APIs for v1.1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv11
     */
    readonly abpV11?: CfnWirelessDevice.AbpV11Property | cdk.IResolvable;

    /**
     * The DevEUI value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deveui
     */
    readonly devEui?: string;

    /**
     * The ID of the device profile for the new wireless device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deviceprofileid
     */
    readonly deviceProfileId?: string;

    /**
     * OTAA device object for create APIs for v1.0.x.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav10x
     */
    readonly otaaV10X?: cdk.IResolvable | CfnWirelessDevice.OtaaV10xProperty;

    /**
     * OTAA device object for v1.1 for create APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav11
     */
    readonly otaaV11?: cdk.IResolvable | CfnWirelessDevice.OtaaV11Property;

    /**
     * The ID of the service profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-serviceprofileid
     */
    readonly serviceProfileId?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html
   */
  export interface AbpV10xProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-devaddr
     */
    readonly devAddr: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-sessionkeys
     */
    readonly sessionKeys: cdk.IResolvable | CfnWirelessDevice.SessionKeysAbpV10xProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html
   */
  export interface SessionKeysAbpV10xProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-appskey
     */
    readonly appSKey: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-nwkskey
     */
    readonly nwkSKey: string;
  }

  /**
   * OTAA device object for v1.1 for create APIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html
   */
  export interface OtaaV11Property {
    /**
     * The AppKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the AppKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-appkey
     */
    readonly appKey: string;

    /**
     * The JoinEUI value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-joineui
     */
    readonly joinEui: string;

    /**
     * The NwkKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the NwkKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-nwkkey
     */
    readonly nwkKey: string;
  }

  /**
   * ABP device object for create APIs for v1.1.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html
   */
  export interface AbpV11Property {
    /**
     * The DevAddr value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-devaddr
     */
    readonly devAddr: string;

    /**
     * Session keys for ABP v1.1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-sessionkeys
     */
    readonly sessionKeys: cdk.IResolvable | CfnWirelessDevice.SessionKeysAbpV11Property;
  }

  /**
   * Session keys for ABP v1.1.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html
   */
  export interface SessionKeysAbpV11Property {
    /**
     * The AppSKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the AppSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-appskey
     */
    readonly appSKey: string;

    /**
     * The FNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the FNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-fnwksintkey
     */
    readonly fNwkSIntKey: string;

    /**
     * The NwkSEncKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the NwkSEncKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-nwksenckey
     */
    readonly nwkSEncKey: string;

    /**
     * The SNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password.
     *
     * You can protect the SNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-snwksintkey
     */
    readonly sNwkSIntKey: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html
   */
  export interface OtaaV10xProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appeui
     */
    readonly appEui: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appkey
     */
    readonly appKey: string;
  }
}

/**
 * Properties for defining a `CfnWirelessDevice`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export interface CfnWirelessDeviceProps {
  /**
   * The description of the new resource.
   *
   * Maximum length is 2048.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-description
   */
  readonly description?: string;

  /**
   * The name of the destination to assign to the new wireless device.
   *
   * Can have only have alphanumeric, - (hyphen) and _ (underscore) characters and it can't have any spaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-destinationname
   */
  readonly destinationName: string;

  /**
   * The date and time when the most recent uplink was received.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lastuplinkreceivedat
   */
  readonly lastUplinkReceivedAt?: string;

  /**
   * The device configuration information to use to create the wireless device.
   *
   * Must be at least one of OtaaV10x, OtaaV11, AbpV11, or AbpV10x.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lorawan
   */
  readonly loRaWan?: cdk.IResolvable | CfnWirelessDevice.LoRaWANDeviceProperty;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the thing to associate with the wireless device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-thingarn
   */
  readonly thingArn?: string;

  /**
   * The wireless device type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `SessionKeysAbpV10xProperty`
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV10xProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV10xPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appSKey", cdk.requiredValidator)(properties.appSKey));
  errors.collect(cdk.propertyValidator("appSKey", cdk.validateString)(properties.appSKey));
  errors.collect(cdk.propertyValidator("nwkSKey", cdk.requiredValidator)(properties.nwkSKey));
  errors.collect(cdk.propertyValidator("nwkSKey", cdk.validateString)(properties.nwkSKey));
  return errors.wrap("supplied properties not correct for \"SessionKeysAbpV10xProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceSessionKeysAbpV10xPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceSessionKeysAbpV10xPropertyValidator(properties).assertSuccess();
  return {
    "AppSKey": cdk.stringToCloudFormation(properties.appSKey),
    "NwkSKey": cdk.stringToCloudFormation(properties.nwkSKey)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDevice.SessionKeysAbpV10xProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.SessionKeysAbpV10xProperty>();
  ret.addPropertyResult("appSKey", "AppSKey", (properties.AppSKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppSKey) : undefined));
  ret.addPropertyResult("nwkSKey", "NwkSKey", (properties.NwkSKey != null ? cfn_parse.FromCloudFormation.getString(properties.NwkSKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AbpV10xProperty`
 *
 * @param properties - the TypeScript properties of a `AbpV10xProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceAbpV10xPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devAddr", cdk.requiredValidator)(properties.devAddr));
  errors.collect(cdk.propertyValidator("devAddr", cdk.validateString)(properties.devAddr));
  errors.collect(cdk.propertyValidator("sessionKeys", cdk.requiredValidator)(properties.sessionKeys));
  errors.collect(cdk.propertyValidator("sessionKeys", CfnWirelessDeviceSessionKeysAbpV10xPropertyValidator)(properties.sessionKeys));
  return errors.wrap("supplied properties not correct for \"AbpV10xProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceAbpV10xPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceAbpV10xPropertyValidator(properties).assertSuccess();
  return {
    "DevAddr": cdk.stringToCloudFormation(properties.devAddr),
    "SessionKeys": convertCfnWirelessDeviceSessionKeysAbpV10xPropertyToCloudFormation(properties.sessionKeys)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceAbpV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.AbpV10xProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.AbpV10xProperty>();
  ret.addPropertyResult("devAddr", "DevAddr", (properties.DevAddr != null ? cfn_parse.FromCloudFormation.getString(properties.DevAddr) : undefined));
  ret.addPropertyResult("sessionKeys", "SessionKeys", (properties.SessionKeys != null ? CfnWirelessDeviceSessionKeysAbpV10xPropertyFromCloudFormation(properties.SessionKeys) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OtaaV11Property`
 *
 * @param properties - the TypeScript properties of a `OtaaV11Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV11PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appKey", cdk.requiredValidator)(properties.appKey));
  errors.collect(cdk.propertyValidator("appKey", cdk.validateString)(properties.appKey));
  errors.collect(cdk.propertyValidator("joinEui", cdk.requiredValidator)(properties.joinEui));
  errors.collect(cdk.propertyValidator("joinEui", cdk.validateString)(properties.joinEui));
  errors.collect(cdk.propertyValidator("nwkKey", cdk.requiredValidator)(properties.nwkKey));
  errors.collect(cdk.propertyValidator("nwkKey", cdk.validateString)(properties.nwkKey));
  return errors.wrap("supplied properties not correct for \"OtaaV11Property\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceOtaaV11PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceOtaaV11PropertyValidator(properties).assertSuccess();
  return {
    "AppKey": cdk.stringToCloudFormation(properties.appKey),
    "JoinEui": cdk.stringToCloudFormation(properties.joinEui),
    "NwkKey": cdk.stringToCloudFormation(properties.nwkKey)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDevice.OtaaV11Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.OtaaV11Property>();
  ret.addPropertyResult("appKey", "AppKey", (properties.AppKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppKey) : undefined));
  ret.addPropertyResult("joinEui", "JoinEui", (properties.JoinEui != null ? cfn_parse.FromCloudFormation.getString(properties.JoinEui) : undefined));
  ret.addPropertyResult("nwkKey", "NwkKey", (properties.NwkKey != null ? cfn_parse.FromCloudFormation.getString(properties.NwkKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SessionKeysAbpV11Property`
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV11Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV11PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appSKey", cdk.requiredValidator)(properties.appSKey));
  errors.collect(cdk.propertyValidator("appSKey", cdk.validateString)(properties.appSKey));
  errors.collect(cdk.propertyValidator("fNwkSIntKey", cdk.requiredValidator)(properties.fNwkSIntKey));
  errors.collect(cdk.propertyValidator("fNwkSIntKey", cdk.validateString)(properties.fNwkSIntKey));
  errors.collect(cdk.propertyValidator("nwkSEncKey", cdk.requiredValidator)(properties.nwkSEncKey));
  errors.collect(cdk.propertyValidator("nwkSEncKey", cdk.validateString)(properties.nwkSEncKey));
  errors.collect(cdk.propertyValidator("sNwkSIntKey", cdk.requiredValidator)(properties.sNwkSIntKey));
  errors.collect(cdk.propertyValidator("sNwkSIntKey", cdk.validateString)(properties.sNwkSIntKey));
  return errors.wrap("supplied properties not correct for \"SessionKeysAbpV11Property\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceSessionKeysAbpV11PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceSessionKeysAbpV11PropertyValidator(properties).assertSuccess();
  return {
    "AppSKey": cdk.stringToCloudFormation(properties.appSKey),
    "FNwkSIntKey": cdk.stringToCloudFormation(properties.fNwkSIntKey),
    "NwkSEncKey": cdk.stringToCloudFormation(properties.nwkSEncKey),
    "SNwkSIntKey": cdk.stringToCloudFormation(properties.sNwkSIntKey)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDevice.SessionKeysAbpV11Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.SessionKeysAbpV11Property>();
  ret.addPropertyResult("appSKey", "AppSKey", (properties.AppSKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppSKey) : undefined));
  ret.addPropertyResult("fNwkSIntKey", "FNwkSIntKey", (properties.FNwkSIntKey != null ? cfn_parse.FromCloudFormation.getString(properties.FNwkSIntKey) : undefined));
  ret.addPropertyResult("nwkSEncKey", "NwkSEncKey", (properties.NwkSEncKey != null ? cfn_parse.FromCloudFormation.getString(properties.NwkSEncKey) : undefined));
  ret.addPropertyResult("sNwkSIntKey", "SNwkSIntKey", (properties.SNwkSIntKey != null ? cfn_parse.FromCloudFormation.getString(properties.SNwkSIntKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AbpV11Property`
 *
 * @param properties - the TypeScript properties of a `AbpV11Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceAbpV11PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devAddr", cdk.requiredValidator)(properties.devAddr));
  errors.collect(cdk.propertyValidator("devAddr", cdk.validateString)(properties.devAddr));
  errors.collect(cdk.propertyValidator("sessionKeys", cdk.requiredValidator)(properties.sessionKeys));
  errors.collect(cdk.propertyValidator("sessionKeys", CfnWirelessDeviceSessionKeysAbpV11PropertyValidator)(properties.sessionKeys));
  return errors.wrap("supplied properties not correct for \"AbpV11Property\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceAbpV11PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceAbpV11PropertyValidator(properties).assertSuccess();
  return {
    "DevAddr": cdk.stringToCloudFormation(properties.devAddr),
    "SessionKeys": convertCfnWirelessDeviceSessionKeysAbpV11PropertyToCloudFormation(properties.sessionKeys)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceAbpV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.AbpV11Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.AbpV11Property>();
  ret.addPropertyResult("devAddr", "DevAddr", (properties.DevAddr != null ? cfn_parse.FromCloudFormation.getString(properties.DevAddr) : undefined));
  ret.addPropertyResult("sessionKeys", "SessionKeys", (properties.SessionKeys != null ? CfnWirelessDeviceSessionKeysAbpV11PropertyFromCloudFormation(properties.SessionKeys) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OtaaV10xProperty`
 *
 * @param properties - the TypeScript properties of a `OtaaV10xProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV10xPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appEui", cdk.requiredValidator)(properties.appEui));
  errors.collect(cdk.propertyValidator("appEui", cdk.validateString)(properties.appEui));
  errors.collect(cdk.propertyValidator("appKey", cdk.requiredValidator)(properties.appKey));
  errors.collect(cdk.propertyValidator("appKey", cdk.validateString)(properties.appKey));
  return errors.wrap("supplied properties not correct for \"OtaaV10xProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceOtaaV10xPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceOtaaV10xPropertyValidator(properties).assertSuccess();
  return {
    "AppEui": cdk.stringToCloudFormation(properties.appEui),
    "AppKey": cdk.stringToCloudFormation(properties.appKey)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDevice.OtaaV10xProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.OtaaV10xProperty>();
  ret.addPropertyResult("appEui", "AppEui", (properties.AppEui != null ? cfn_parse.FromCloudFormation.getString(properties.AppEui) : undefined));
  ret.addPropertyResult("appKey", "AppKey", (properties.AppKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoRaWANDeviceProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceLoRaWANDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("abpV10X", CfnWirelessDeviceAbpV10xPropertyValidator)(properties.abpV10X));
  errors.collect(cdk.propertyValidator("abpV11", CfnWirelessDeviceAbpV11PropertyValidator)(properties.abpV11));
  errors.collect(cdk.propertyValidator("devEui", cdk.validateString)(properties.devEui));
  errors.collect(cdk.propertyValidator("deviceProfileId", cdk.validateString)(properties.deviceProfileId));
  errors.collect(cdk.propertyValidator("otaaV10X", CfnWirelessDeviceOtaaV10xPropertyValidator)(properties.otaaV10X));
  errors.collect(cdk.propertyValidator("otaaV11", CfnWirelessDeviceOtaaV11PropertyValidator)(properties.otaaV11));
  errors.collect(cdk.propertyValidator("serviceProfileId", cdk.validateString)(properties.serviceProfileId));
  return errors.wrap("supplied properties not correct for \"LoRaWANDeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceLoRaWANDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceLoRaWANDevicePropertyValidator(properties).assertSuccess();
  return {
    "AbpV10x": convertCfnWirelessDeviceAbpV10xPropertyToCloudFormation(properties.abpV10X),
    "AbpV11": convertCfnWirelessDeviceAbpV11PropertyToCloudFormation(properties.abpV11),
    "DevEui": cdk.stringToCloudFormation(properties.devEui),
    "DeviceProfileId": cdk.stringToCloudFormation(properties.deviceProfileId),
    "OtaaV10x": convertCfnWirelessDeviceOtaaV10xPropertyToCloudFormation(properties.otaaV10X),
    "OtaaV11": convertCfnWirelessDeviceOtaaV11PropertyToCloudFormation(properties.otaaV11),
    "ServiceProfileId": cdk.stringToCloudFormation(properties.serviceProfileId)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceLoRaWANDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDevice.LoRaWANDeviceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.LoRaWANDeviceProperty>();
  ret.addPropertyResult("abpV10X", "AbpV10x", (properties.AbpV10x != null ? CfnWirelessDeviceAbpV10xPropertyFromCloudFormation(properties.AbpV10x) : undefined));
  ret.addPropertyResult("abpV11", "AbpV11", (properties.AbpV11 != null ? CfnWirelessDeviceAbpV11PropertyFromCloudFormation(properties.AbpV11) : undefined));
  ret.addPropertyResult("devEui", "DevEui", (properties.DevEui != null ? cfn_parse.FromCloudFormation.getString(properties.DevEui) : undefined));
  ret.addPropertyResult("deviceProfileId", "DeviceProfileId", (properties.DeviceProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceProfileId) : undefined));
  ret.addPropertyResult("otaaV10X", "OtaaV10x", (properties.OtaaV10x != null ? CfnWirelessDeviceOtaaV10xPropertyFromCloudFormation(properties.OtaaV10x) : undefined));
  ret.addPropertyResult("otaaV11", "OtaaV11", (properties.OtaaV11 != null ? CfnWirelessDeviceOtaaV11PropertyFromCloudFormation(properties.OtaaV11) : undefined));
  ret.addPropertyResult("serviceProfileId", "ServiceProfileId", (properties.ServiceProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceProfileId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWirelessDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWirelessDeviceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDevicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("destinationName", cdk.requiredValidator)(properties.destinationName));
  errors.collect(cdk.propertyValidator("destinationName", cdk.validateString)(properties.destinationName));
  errors.collect(cdk.propertyValidator("lastUplinkReceivedAt", cdk.validateString)(properties.lastUplinkReceivedAt));
  errors.collect(cdk.propertyValidator("loRaWan", CfnWirelessDeviceLoRaWANDevicePropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnWirelessDeviceProps\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDevicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDevicePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DestinationName": cdk.stringToCloudFormation(properties.destinationName),
    "LastUplinkReceivedAt": cdk.stringToCloudFormation(properties.lastUplinkReceivedAt),
    "LoRaWAN": convertCfnWirelessDeviceLoRaWANDevicePropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnWirelessDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDeviceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDeviceProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("destinationName", "DestinationName", (properties.DestinationName != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationName) : undefined));
  ret.addPropertyResult("lastUplinkReceivedAt", "LastUplinkReceivedAt", (properties.LastUplinkReceivedAt != null ? cfn_parse.FromCloudFormation.getString(properties.LastUplinkReceivedAt) : undefined));
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnWirelessDeviceLoRaWANDevicePropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Information about an import task for wireless devices.
 *
 * When creating the resource, either create a single wireless device import task using the Sidewalk manufacturing serial number (SMSN) of the wireless device, or create an import task for multiple devices by specifying both the `DeviceCreationFile` and the `Role` .
 *
 * @cloudformationResource AWS::IoTWireless::WirelessDeviceImportTask
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdeviceimporttask.html
 */
export class CfnWirelessDeviceImportTask extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::WirelessDeviceImportTask";

  /**
   * Build a CfnWirelessDeviceImportTask from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessDeviceImportTask {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWirelessDeviceImportTaskPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWirelessDeviceImportTask(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN (Amazon Resource Name) of the import task.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time at which the wireless device import task was created.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The summary information of count of wireless devices that failed to onboard to the import task.
   *
   * @cloudformationAttribute FailedImportedDevicesCount
   */
  public readonly attrFailedImportedDevicesCount: number;

  /**
   * The import task ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The summary information of count of wireless devices that are waiting for the control log to be added to an import task.
   *
   * @cloudformationAttribute InitializedImportedDevicesCount
   */
  public readonly attrInitializedImportedDevicesCount: number;

  /**
   * The summary information of count of wireless devices that have been onboarded to the import task.
   *
   * @cloudformationAttribute OnboardedImportedDevicesCount
   */
  public readonly attrOnboardedImportedDevicesCount: number;

  /**
   * The summary information of count of wireless devices that are waiting in the queue to be onboarded to the import task.
   *
   * @cloudformationAttribute PendingImportedDevicesCount
   */
  public readonly attrPendingImportedDevicesCount: number;

  /**
   * @cloudformationAttribute Sidewalk.DeviceCreationFileList
   */
  public readonly attrSidewalkDeviceCreationFileList: Array<string>;

  /**
   * The status of a wireless device import task. The status can be `INITIALIZING` , `INITIALIZED` , `PENDING` , `COMPLETE` , `FAILED` , or `DELETING` .
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The reason that provides additional information about the import task status.
   *
   * @cloudformationAttribute StatusReason
   */
  public readonly attrStatusReason: string;

  /**
   * The name of the destination that describes the IoT rule to route messages from the Sidewalk devices in the import task to other applications.
   */
  public destinationName: string;

  /**
   * The Sidewalk-related information of the wireless device import task.
   */
  public sidewalk: cdk.IResolvable | CfnWirelessDeviceImportTask.SidewalkProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Adds to or modifies the tags of the given resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWirelessDeviceImportTaskProps) {
    super(scope, id, {
      "type": CfnWirelessDeviceImportTask.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationName", this);
    cdk.requireProperty(props, "sidewalk", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrFailedImportedDevicesCount = cdk.Token.asNumber(this.getAtt("FailedImportedDevicesCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrInitializedImportedDevicesCount = cdk.Token.asNumber(this.getAtt("InitializedImportedDevicesCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrOnboardedImportedDevicesCount = cdk.Token.asNumber(this.getAtt("OnboardedImportedDevicesCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrPendingImportedDevicesCount = cdk.Token.asNumber(this.getAtt("PendingImportedDevicesCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrSidewalkDeviceCreationFileList = cdk.Token.asList(this.getAtt("Sidewalk.DeviceCreationFileList", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusReason = cdk.Token.asString(this.getAtt("StatusReason", cdk.ResolutionTypeHint.STRING));
    this.destinationName = props.destinationName;
    this.sidewalk = props.sidewalk;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::WirelessDeviceImportTask", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationName": this.destinationName,
      "sidewalk": this.sidewalk,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWirelessDeviceImportTask.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWirelessDeviceImportTaskPropsToCloudFormation(props);
  }
}

export namespace CfnWirelessDeviceImportTask {
  /**
   * Sidewalk-related information about a wireless device import task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdeviceimporttask-sidewalk.html
   */
  export interface SidewalkProperty {
    /**
     * The CSV file contained in an S3 bucket that's used for adding devices to an import task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdeviceimporttask-sidewalk.html#cfn-iotwireless-wirelessdeviceimporttask-sidewalk-devicecreationfile
     */
    readonly deviceCreationFile?: string;

    /**
     * List of Sidewalk devices that are added to the import task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdeviceimporttask-sidewalk.html#cfn-iotwireless-wirelessdeviceimporttask-sidewalk-devicecreationfilelist
     */
    readonly deviceCreationFileList?: Array<string>;

    /**
     * The IAM role that allows AWS IoT Wireless to access the CSV file in the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdeviceimporttask-sidewalk.html#cfn-iotwireless-wirelessdeviceimporttask-sidewalk-role
     */
    readonly role?: string;

    /**
     * The Sidewalk manufacturing serial number (SMSN) of the Sidewalk device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdeviceimporttask-sidewalk.html#cfn-iotwireless-wirelessdeviceimporttask-sidewalk-sidewalkmanufacturingsn
     */
    readonly sidewalkManufacturingSn?: string;
  }
}

/**
 * Properties for defining a `CfnWirelessDeviceImportTask`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdeviceimporttask.html
 */
export interface CfnWirelessDeviceImportTaskProps {
  /**
   * The name of the destination that describes the IoT rule to route messages from the Sidewalk devices in the import task to other applications.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdeviceimporttask.html#cfn-iotwireless-wirelessdeviceimporttask-destinationname
   */
  readonly destinationName: string;

  /**
   * The Sidewalk-related information of the wireless device import task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdeviceimporttask.html#cfn-iotwireless-wirelessdeviceimporttask-sidewalk
   */
  readonly sidewalk: cdk.IResolvable | CfnWirelessDeviceImportTask.SidewalkProperty;

  /**
   * Adds to or modifies the tags of the given resource.
   *
   * Tags are metadata that you can use to manage a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdeviceimporttask.html#cfn-iotwireless-wirelessdeviceimporttask-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SidewalkProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceImportTaskSidewalkPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceCreationFile", cdk.validateString)(properties.deviceCreationFile));
  errors.collect(cdk.propertyValidator("deviceCreationFileList", cdk.listValidator(cdk.validateString))(properties.deviceCreationFileList));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("sidewalkManufacturingSn", cdk.validateString)(properties.sidewalkManufacturingSn));
  return errors.wrap("supplied properties not correct for \"SidewalkProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceImportTaskSidewalkPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceImportTaskSidewalkPropertyValidator(properties).assertSuccess();
  return {
    "DeviceCreationFile": cdk.stringToCloudFormation(properties.deviceCreationFile),
    "DeviceCreationFileList": cdk.listMapper(cdk.stringToCloudFormation)(properties.deviceCreationFileList),
    "Role": cdk.stringToCloudFormation(properties.role),
    "SidewalkManufacturingSn": cdk.stringToCloudFormation(properties.sidewalkManufacturingSn)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceImportTaskSidewalkPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessDeviceImportTask.SidewalkProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDeviceImportTask.SidewalkProperty>();
  ret.addPropertyResult("deviceCreationFile", "DeviceCreationFile", (properties.DeviceCreationFile != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceCreationFile) : undefined));
  ret.addPropertyResult("deviceCreationFileList", "DeviceCreationFileList", (properties.DeviceCreationFileList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DeviceCreationFileList) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("sidewalkManufacturingSn", "SidewalkManufacturingSn", (properties.SidewalkManufacturingSn != null ? cfn_parse.FromCloudFormation.getString(properties.SidewalkManufacturingSn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWirelessDeviceImportTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnWirelessDeviceImportTaskProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessDeviceImportTaskPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationName", cdk.requiredValidator)(properties.destinationName));
  errors.collect(cdk.propertyValidator("destinationName", cdk.validateString)(properties.destinationName));
  errors.collect(cdk.propertyValidator("sidewalk", cdk.requiredValidator)(properties.sidewalk));
  errors.collect(cdk.propertyValidator("sidewalk", CfnWirelessDeviceImportTaskSidewalkPropertyValidator)(properties.sidewalk));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnWirelessDeviceImportTaskProps\"");
}

// @ts-ignore TS6133
function convertCfnWirelessDeviceImportTaskPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessDeviceImportTaskPropsValidator(properties).assertSuccess();
  return {
    "DestinationName": cdk.stringToCloudFormation(properties.destinationName),
    "Sidewalk": convertCfnWirelessDeviceImportTaskSidewalkPropertyToCloudFormation(properties.sidewalk),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWirelessDeviceImportTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDeviceImportTaskProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDeviceImportTaskProps>();
  ret.addPropertyResult("destinationName", "DestinationName", (properties.DestinationName != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationName) : undefined));
  ret.addPropertyResult("sidewalk", "Sidewalk", (properties.Sidewalk != null ? CfnWirelessDeviceImportTaskSidewalkPropertyFromCloudFormation(properties.Sidewalk) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Provisions a wireless gateway.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessGateway
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export class CfnWirelessGateway extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTWireless::WirelessGateway";

  /**
   * Build a CfnWirelessGateway from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessGateway {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWirelessGatewayPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWirelessGateway(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the wireless gateway created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the wireless gateway created.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The description of the new resource.
   */
  public description?: string;

  /**
   * The date and time when the most recent uplink was received.
   */
  public lastUplinkReceivedAt?: string;

  /**
   * The gateway configuration information to use to create the wireless gateway.
   */
  public loRaWan: cdk.IResolvable | CfnWirelessGateway.LoRaWANGatewayProperty;

  /**
   * The name of the new resource.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the thing to associate with the wireless gateway.
   */
  public thingArn?: string;

  /**
   * The name of the thing associated with the wireless gateway.
   */
  public thingName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWirelessGatewayProps) {
    super(scope, id, {
      "type": CfnWirelessGateway.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "loRaWan", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.lastUplinkReceivedAt = props.lastUplinkReceivedAt;
    this.loRaWan = props.loRaWan;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::WirelessGateway", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thingArn = props.thingArn;
    this.thingName = props.thingName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "lastUplinkReceivedAt": this.lastUplinkReceivedAt,
      "loRaWan": this.loRaWan,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "thingArn": this.thingArn,
      "thingName": this.thingName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWirelessGateway.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWirelessGatewayPropsToCloudFormation(props);
  }
}

export namespace CfnWirelessGateway {
  /**
   * LoRaWAN wireless gateway object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html
   */
  export interface LoRaWANGatewayProperty {
    /**
     * The gateway's EUI value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-gatewayeui
     */
    readonly gatewayEui: string;

    /**
     * The frequency band (RFRegion) value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-rfregion
     */
    readonly rfRegion: string;
  }
}

/**
 * Properties for defining a `CfnWirelessGateway`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export interface CfnWirelessGatewayProps {
  /**
   * The description of the new resource.
   *
   * The maximum length is 2048 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-description
   */
  readonly description?: string;

  /**
   * The date and time when the most recent uplink was received.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lastuplinkreceivedat
   */
  readonly lastUplinkReceivedAt?: string;

  /**
   * The gateway configuration information to use to create the wireless gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lorawan
   */
  readonly loRaWan: cdk.IResolvable | CfnWirelessGateway.LoRaWANGatewayProperty;

  /**
   * The name of the new resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-name
   */
  readonly name?: string;

  /**
   * The tags are an array of key-value pairs to attach to the specified resource.
   *
   * Tags can have a minimum of 0 and a maximum of 50 items.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the thing to associate with the wireless gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingarn
   */
  readonly thingArn?: string;

  /**
   * The name of the thing associated with the wireless gateway.
   *
   * The value is empty if a thing isn't associated with the gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingname
   */
  readonly thingName?: string;
}

/**
 * Determine whether the given properties match those of a `LoRaWANGatewayProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessGatewayLoRaWANGatewayPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gatewayEui", cdk.requiredValidator)(properties.gatewayEui));
  errors.collect(cdk.propertyValidator("gatewayEui", cdk.validateString)(properties.gatewayEui));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.requiredValidator)(properties.rfRegion));
  errors.collect(cdk.propertyValidator("rfRegion", cdk.validateString)(properties.rfRegion));
  return errors.wrap("supplied properties not correct for \"LoRaWANGatewayProperty\"");
}

// @ts-ignore TS6133
function convertCfnWirelessGatewayLoRaWANGatewayPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessGatewayLoRaWANGatewayPropertyValidator(properties).assertSuccess();
  return {
    "GatewayEui": cdk.stringToCloudFormation(properties.gatewayEui),
    "RfRegion": cdk.stringToCloudFormation(properties.rfRegion)
  };
}

// @ts-ignore TS6133
function CfnWirelessGatewayLoRaWANGatewayPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWirelessGateway.LoRaWANGatewayProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessGateway.LoRaWANGatewayProperty>();
  ret.addPropertyResult("gatewayEui", "GatewayEui", (properties.GatewayEui != null ? cfn_parse.FromCloudFormation.getString(properties.GatewayEui) : undefined));
  ret.addPropertyResult("rfRegion", "RfRegion", (properties.RfRegion != null ? cfn_parse.FromCloudFormation.getString(properties.RfRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWirelessGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnWirelessGatewayProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWirelessGatewayPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("lastUplinkReceivedAt", cdk.validateString)(properties.lastUplinkReceivedAt));
  errors.collect(cdk.propertyValidator("loRaWan", cdk.requiredValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("loRaWan", CfnWirelessGatewayLoRaWANGatewayPropertyValidator)(properties.loRaWan));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  errors.collect(cdk.propertyValidator("thingName", cdk.validateString)(properties.thingName));
  return errors.wrap("supplied properties not correct for \"CfnWirelessGatewayProps\"");
}

// @ts-ignore TS6133
function convertCfnWirelessGatewayPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWirelessGatewayPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "LastUplinkReceivedAt": cdk.stringToCloudFormation(properties.lastUplinkReceivedAt),
    "LoRaWAN": convertCfnWirelessGatewayLoRaWANGatewayPropertyToCloudFormation(properties.loRaWan),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn),
    "ThingName": cdk.stringToCloudFormation(properties.thingName)
  };
}

// @ts-ignore TS6133
function CfnWirelessGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessGatewayProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessGatewayProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("lastUplinkReceivedAt", "LastUplinkReceivedAt", (properties.LastUplinkReceivedAt != null ? cfn_parse.FromCloudFormation.getString(properties.LastUplinkReceivedAt) : undefined));
  ret.addPropertyResult("loRaWan", "LoRaWAN", (properties.LoRaWAN != null ? CfnWirelessGatewayLoRaWANGatewayPropertyFromCloudFormation(properties.LoRaWAN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addPropertyResult("thingName", "ThingName", (properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}