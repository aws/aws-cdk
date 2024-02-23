/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The resource represents an enabled control.
 *
 * It specifies an asynchronous operation that creates AWS resources on the specified organizational unit and the accounts it contains. The resources created will vary according to the control that you specify.
 *
 * @cloudformationResource AWS::ControlTower::EnabledControl
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html
 */
export class CfnEnabledControl extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ControlTower::EnabledControl";

  /**
   * Build a CfnEnabledControl from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnabledControl {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnabledControlPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnabledControl(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the control.
   */
  public controlIdentifier: string;

  /**
   * Array of `EnabledControlParameter` objects.
   */
  public parameters?: Array<CfnEnabledControl.EnabledControlParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ARN of the organizational unit.
   */
  public targetIdentifier: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnabledControlProps) {
    super(scope, id, {
      "type": CfnEnabledControl.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "controlIdentifier", this);
    cdk.requireProperty(props, "targetIdentifier", this);

    this.controlIdentifier = props.controlIdentifier;
    this.parameters = props.parameters;
    this.targetIdentifier = props.targetIdentifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "controlIdentifier": this.controlIdentifier,
      "parameters": this.parameters,
      "targetIdentifier": this.targetIdentifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnabledControl.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnabledControlPropsToCloudFormation(props);
  }
}

export namespace CfnEnabledControl {
  /**
   * A set of parameters that configure the behavior of the enabled control.
   *
   * Expressed as a key/value pair, where `Key` is of type `String` and `Value` is of type `Document` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-controltower-enabledcontrol-enabledcontrolparameter.html
   */
  export interface EnabledControlParameterProperty {
    /**
     * The key of a key/value pair.
     *
     * It is of type `string` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-controltower-enabledcontrol-enabledcontrolparameter.html#cfn-controltower-enabledcontrol-enabledcontrolparameter-key
     */
    readonly key: string;

    /**
     * The value of a key/value pair.
     *
     * It can be of type `array` , `string` , `number` , `object` , or `boolean` . [Note: The *Type* field that follows may show a single type such as Number, which is only one possible type.]
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-controltower-enabledcontrol-enabledcontrolparameter.html#cfn-controltower-enabledcontrol-enabledcontrolparameter-value
     */
    readonly value: any | Array<any | boolean | cdk.IResolvable | number | string> | boolean | cdk.IResolvable | number | string;
  }
}

/**
 * Properties for defining a `CfnEnabledControl`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html
 */
export interface CfnEnabledControlProps {
  /**
   * The ARN of the control.
   *
   * Only *Strongly recommended* and *Elective* controls are permitted, with the exception of the *landing zone Region deny* control. For information on how to find the `controlIdentifier` , see [the overview page](https://docs.aws.amazon.com//controltower/latest/APIReference/Welcome.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-controlidentifier
   */
  readonly controlIdentifier: string;

  /**
   * Array of `EnabledControlParameter` objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-parameters
   */
  readonly parameters?: Array<CfnEnabledControl.EnabledControlParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ARN of the organizational unit.
   *
   * For information on how to find the `targetIdentifier` , see [the overview page](https://docs.aws.amazon.com//controltower/latest/APIReference/Welcome.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-targetidentifier
   */
  readonly targetIdentifier: string;
}

/**
 * Determine whether the given properties match those of a `EnabledControlParameterProperty`
 *
 * @param properties - the TypeScript properties of a `EnabledControlParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnabledControlEnabledControlParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.unionValidator(cdk.listValidator(cdk.unionValidator(cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject)), cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject))(properties.value));
  return errors.wrap("supplied properties not correct for \"EnabledControlParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnabledControlEnabledControlParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnabledControlEnabledControlParameterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.unionMapper([cdk.listValidator(cdk.unionValidator(cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject)), cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject], [cdk.listMapper(cdk.unionMapper([cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject], [cdk.stringToCloudFormation, cdk.numberToCloudFormation, cdk.booleanToCloudFormation, cdk.objectToCloudFormation])), cdk.stringToCloudFormation, cdk.numberToCloudFormation, cdk.booleanToCloudFormation, cdk.objectToCloudFormation])(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEnabledControlEnabledControlParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnabledControl.EnabledControlParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnabledControl.EnabledControlParameterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.listValidator(cdk.unionValidator(cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject)), cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject], [cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, cdk.validateNumber, cdk.validateBoolean, cdk.validateObject], [cfn_parse.FromCloudFormation.getString, cfn_parse.FromCloudFormation.getNumber, cfn_parse.FromCloudFormation.getBoolean, cfn_parse.FromCloudFormation.getAny])), cfn_parse.FromCloudFormation.getString, cfn_parse.FromCloudFormation.getNumber, cfn_parse.FromCloudFormation.getBoolean, cfn_parse.FromCloudFormation.getAny])(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEnabledControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnabledControlProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnabledControlPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("controlIdentifier", cdk.requiredValidator)(properties.controlIdentifier));
  errors.collect(cdk.propertyValidator("controlIdentifier", cdk.validateString)(properties.controlIdentifier));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnEnabledControlEnabledControlParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("targetIdentifier", cdk.requiredValidator)(properties.targetIdentifier));
  errors.collect(cdk.propertyValidator("targetIdentifier", cdk.validateString)(properties.targetIdentifier));
  return errors.wrap("supplied properties not correct for \"CfnEnabledControlProps\"");
}

// @ts-ignore TS6133
function convertCfnEnabledControlPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnabledControlPropsValidator(properties).assertSuccess();
  return {
    "ControlIdentifier": cdk.stringToCloudFormation(properties.controlIdentifier),
    "Parameters": cdk.listMapper(convertCfnEnabledControlEnabledControlParameterPropertyToCloudFormation)(properties.parameters),
    "TargetIdentifier": cdk.stringToCloudFormation(properties.targetIdentifier)
  };
}

// @ts-ignore TS6133
function CfnEnabledControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnabledControlProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnabledControlProps>();
  ret.addPropertyResult("controlIdentifier", "ControlIdentifier", (properties.ControlIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ControlIdentifier) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnEnabledControlEnabledControlParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("targetIdentifier", "TargetIdentifier", (properties.TargetIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.TargetIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new landing zone.
 *
 * This API call starts an asynchronous operation that creates and configures a landing zone, based on the parameters specified in the manifest JSON file.
 *
 * @cloudformationResource AWS::ControlTower::LandingZone
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-landingzone.html
 */
export class CfnLandingZone extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ControlTower::LandingZone";

  /**
   * Build a CfnLandingZone from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLandingZone {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLandingZonePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLandingZone(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the landing zone.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The drift status of the landing zone.
   *
   * @cloudformationAttribute DriftStatus
   */
  public readonly attrDriftStatus: string;

  /**
   * The unique identifier of the landing zone.
   *
   * @cloudformationAttribute LandingZoneIdentifier
   */
  public readonly attrLandingZoneIdentifier: string;

  /**
   * The latest available version of the landing zone.
   *
   * @cloudformationAttribute LatestAvailableVersion
   */
  public readonly attrLatestAvailableVersion: string;

  /**
   * The landing zone deployment status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The landing zone manifest JSON text file that specifies the landing zone configurations.
   */
  public manifest: any | cdk.IResolvable;

  /**
   * Tags to be applied to the landing zone.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The landing zone's current deployed version.
   */
  public version: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLandingZoneProps) {
    super(scope, id, {
      "type": CfnLandingZone.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "manifest", this);
    cdk.requireProperty(props, "version", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDriftStatus = cdk.Token.asString(this.getAtt("DriftStatus", cdk.ResolutionTypeHint.STRING));
    this.attrLandingZoneIdentifier = cdk.Token.asString(this.getAtt("LandingZoneIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrLatestAvailableVersion = cdk.Token.asString(this.getAtt("LatestAvailableVersion", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.manifest = props.manifest;
    this.tags = props.tags;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "manifest": this.manifest,
      "tags": this.tags,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLandingZone.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLandingZonePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLandingZone`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-landingzone.html
 */
export interface CfnLandingZoneProps {
  /**
   * The landing zone manifest JSON text file that specifies the landing zone configurations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-landingzone.html#cfn-controltower-landingzone-manifest
   */
  readonly manifest: any | cdk.IResolvable;

  /**
   * Tags to be applied to the landing zone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-landingzone.html#cfn-controltower-landingzone-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The landing zone's current deployed version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-landingzone.html#cfn-controltower-landingzone-version
   */
  readonly version: string;
}

/**
 * Determine whether the given properties match those of a `CfnLandingZoneProps`
 *
 * @param properties - the TypeScript properties of a `CfnLandingZoneProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLandingZonePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifest", cdk.requiredValidator)(properties.manifest));
  errors.collect(cdk.propertyValidator("manifest", cdk.validateObject)(properties.manifest));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnLandingZoneProps\"");
}

// @ts-ignore TS6133
function convertCfnLandingZonePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLandingZonePropsValidator(properties).assertSuccess();
  return {
    "Manifest": cdk.objectToCloudFormation(properties.manifest),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLandingZonePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLandingZoneProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLandingZoneProps>();
  ret.addPropertyResult("manifest", "Manifest", (properties.Manifest != null ? cfn_parse.FromCloudFormation.getAny(properties.Manifest) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}