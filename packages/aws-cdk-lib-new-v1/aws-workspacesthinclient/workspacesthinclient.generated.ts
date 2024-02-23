/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Describes an environment.
 *
 * @cloudformationResource AWS::WorkSpacesThinClient::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpacesThinClient::Environment";

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
   * The activation code to register a device to the environment.
   *
   * @cloudformationAttribute ActivationCode
   */
  public readonly attrActivationCode: string;

  /**
   * The Amazon Resource Name (ARN) of the environment.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp of when the environment was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The type of streaming desktop for the environment.
   *
   * @cloudformationAttribute DesktopType
   */
  public readonly attrDesktopType: string;

  /**
   * Unique identifier of the environment.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the software set that is pending to be installed.
   *
   * @cloudformationAttribute PendingSoftwareSetId
   */
  public readonly attrPendingSoftwareSetId: string;

  /**
   * The version of the software set that is pending to be installed.
   *
   * @cloudformationAttribute PendingSoftwareSetVersion
   */
  public readonly attrPendingSoftwareSetVersion: string;

  /**
   * The number of devices registered to the environment.
   *
   * @cloudformationAttribute RegisteredDevicesCount
   */
  public readonly attrRegisteredDevicesCount: number;

  /**
   * Describes if the software currently installed on all devices in the environment is a supported version.
   *
   * @cloudformationAttribute SoftwareSetComplianceStatus
   */
  public readonly attrSoftwareSetComplianceStatus: string;

  /**
   * The timestamp of when the device was updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The ID of the software set to apply.
   */
  public desiredSoftwareSetId?: string;

  /**
   * The Amazon Resource Name (ARN) of the desktop to stream from Amazon WorkSpaces , WorkSpaces Web, or AppStream 2.0 .
   */
  public desktopArn: string;

  /**
   * The URL for the identity provider login (only for environments that use AppStream 2.0 ).
   */
  public desktopEndpoint?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service key used to encrypt the environment.
   */
  public kmsKeyArn?: string;

  /**
   * A specification for a time window to apply software updates.
   */
  public maintenanceWindow?: cdk.IResolvable | CfnEnvironment.MaintenanceWindowProperty;

  /**
   * The name of the environment.
   */
  public name?: string;

  /**
   * An option to define which software updates to apply.
   */
  public softwareSetUpdateMode?: string;

  /**
   * An option to define if software updates should be applied within a maintenance window.
   */
  public softwareSetUpdateSchedule?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

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

    cdk.requireProperty(props, "desktopArn", this);

    this.attrActivationCode = cdk.Token.asString(this.getAtt("ActivationCode", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDesktopType = cdk.Token.asString(this.getAtt("DesktopType", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPendingSoftwareSetId = cdk.Token.asString(this.getAtt("PendingSoftwareSetId", cdk.ResolutionTypeHint.STRING));
    this.attrPendingSoftwareSetVersion = cdk.Token.asString(this.getAtt("PendingSoftwareSetVersion", cdk.ResolutionTypeHint.STRING));
    this.attrRegisteredDevicesCount = cdk.Token.asNumber(this.getAtt("RegisteredDevicesCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrSoftwareSetComplianceStatus = cdk.Token.asString(this.getAtt("SoftwareSetComplianceStatus", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.desiredSoftwareSetId = props.desiredSoftwareSetId;
    this.desktopArn = props.desktopArn;
    this.desktopEndpoint = props.desktopEndpoint;
    this.kmsKeyArn = props.kmsKeyArn;
    this.maintenanceWindow = props.maintenanceWindow;
    this.name = props.name;
    this.softwareSetUpdateMode = props.softwareSetUpdateMode;
    this.softwareSetUpdateSchedule = props.softwareSetUpdateSchedule;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "desiredSoftwareSetId": this.desiredSoftwareSetId,
      "desktopArn": this.desktopArn,
      "desktopEndpoint": this.desktopEndpoint,
      "kmsKeyArn": this.kmsKeyArn,
      "maintenanceWindow": this.maintenanceWindow,
      "name": this.name,
      "softwareSetUpdateMode": this.softwareSetUpdateMode,
      "softwareSetUpdateSchedule": this.softwareSetUpdateSchedule,
      "tags": this.tags
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
   * Describes the maintenance window for a thin client device.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html
   */
  export interface MaintenanceWindowProperty {
    /**
     * The option to set the maintenance window during the device local time or Universal Coordinated Time (UTC).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-applytimeof
     */
    readonly applyTimeOf?: string;

    /**
     * The days of the week during which the maintenance window is open.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-daysoftheweek
     */
    readonly daysOfTheWeek?: Array<string>;

    /**
     * The hour for the maintenance window end ( `00` - `23` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-endtimehour
     */
    readonly endTimeHour?: number;

    /**
     * The minutes for the maintenance window end ( `00` - `59` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-endtimeminute
     */
    readonly endTimeMinute?: number;

    /**
     * The hour for the maintenance window start ( `00` - `23` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-starttimehour
     */
    readonly startTimeHour?: number;

    /**
     * The minutes past the hour for the maintenance window start ( `00` - `59` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-starttimeminute
     */
    readonly startTimeMinute?: number;

    /**
     * An option to select the default or custom maintenance window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspacesthinclient-environment-maintenancewindow.html#cfn-workspacesthinclient-environment-maintenancewindow-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * The ID of the software set to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-desiredsoftwaresetid
   */
  readonly desiredSoftwareSetId?: string;

  /**
   * The Amazon Resource Name (ARN) of the desktop to stream from Amazon WorkSpaces , WorkSpaces Web, or AppStream 2.0 .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-desktoparn
   */
  readonly desktopArn: string;

  /**
   * The URL for the identity provider login (only for environments that use AppStream 2.0 ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-desktopendpoint
   */
  readonly desktopEndpoint?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service key used to encrypt the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * A specification for a time window to apply software updates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-maintenancewindow
   */
  readonly maintenanceWindow?: cdk.IResolvable | CfnEnvironment.MaintenanceWindowProperty;

  /**
   * The name of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-name
   */
  readonly name?: string;

  /**
   * An option to define which software updates to apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-softwaresetupdatemode
   */
  readonly softwareSetUpdateMode?: string;

  /**
   * An option to define if software updates should be applied within a maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-softwaresetupdateschedule
   */
  readonly softwareSetUpdateSchedule?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspacesthinclient-environment.html#cfn-workspacesthinclient-environment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentMaintenanceWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applyTimeOf", cdk.validateString)(properties.applyTimeOf));
  errors.collect(cdk.propertyValidator("daysOfTheWeek", cdk.listValidator(cdk.validateString))(properties.daysOfTheWeek));
  errors.collect(cdk.propertyValidator("endTimeHour", cdk.validateNumber)(properties.endTimeHour));
  errors.collect(cdk.propertyValidator("endTimeMinute", cdk.validateNumber)(properties.endTimeMinute));
  errors.collect(cdk.propertyValidator("startTimeHour", cdk.validateNumber)(properties.startTimeHour));
  errors.collect(cdk.propertyValidator("startTimeMinute", cdk.validateNumber)(properties.startTimeMinute));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentMaintenanceWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentMaintenanceWindowPropertyValidator(properties).assertSuccess();
  return {
    "ApplyTimeOf": cdk.stringToCloudFormation(properties.applyTimeOf),
    "DaysOfTheWeek": cdk.listMapper(cdk.stringToCloudFormation)(properties.daysOfTheWeek),
    "EndTimeHour": cdk.numberToCloudFormation(properties.endTimeHour),
    "EndTimeMinute": cdk.numberToCloudFormation(properties.endTimeMinute),
    "StartTimeHour": cdk.numberToCloudFormation(properties.startTimeHour),
    "StartTimeMinute": cdk.numberToCloudFormation(properties.startTimeMinute),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentMaintenanceWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.MaintenanceWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.MaintenanceWindowProperty>();
  ret.addPropertyResult("applyTimeOf", "ApplyTimeOf", (properties.ApplyTimeOf != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyTimeOf) : undefined));
  ret.addPropertyResult("daysOfTheWeek", "DaysOfTheWeek", (properties.DaysOfTheWeek != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DaysOfTheWeek) : undefined));
  ret.addPropertyResult("endTimeHour", "EndTimeHour", (properties.EndTimeHour != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndTimeHour) : undefined));
  ret.addPropertyResult("endTimeMinute", "EndTimeMinute", (properties.EndTimeMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndTimeMinute) : undefined));
  ret.addPropertyResult("startTimeHour", "StartTimeHour", (properties.StartTimeHour != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartTimeHour) : undefined));
  ret.addPropertyResult("startTimeMinute", "StartTimeMinute", (properties.StartTimeMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartTimeMinute) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
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
  errors.collect(cdk.propertyValidator("desiredSoftwareSetId", cdk.validateString)(properties.desiredSoftwareSetId));
  errors.collect(cdk.propertyValidator("desktopArn", cdk.requiredValidator)(properties.desktopArn));
  errors.collect(cdk.propertyValidator("desktopArn", cdk.validateString)(properties.desktopArn));
  errors.collect(cdk.propertyValidator("desktopEndpoint", cdk.validateString)(properties.desktopEndpoint));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("maintenanceWindow", CfnEnvironmentMaintenanceWindowPropertyValidator)(properties.maintenanceWindow));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("softwareSetUpdateMode", cdk.validateString)(properties.softwareSetUpdateMode));
  errors.collect(cdk.propertyValidator("softwareSetUpdateSchedule", cdk.validateString)(properties.softwareSetUpdateSchedule));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "DesiredSoftwareSetId": cdk.stringToCloudFormation(properties.desiredSoftwareSetId),
    "DesktopArn": cdk.stringToCloudFormation(properties.desktopArn),
    "DesktopEndpoint": cdk.stringToCloudFormation(properties.desktopEndpoint),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "MaintenanceWindow": convertCfnEnvironmentMaintenanceWindowPropertyToCloudFormation(properties.maintenanceWindow),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SoftwareSetUpdateMode": cdk.stringToCloudFormation(properties.softwareSetUpdateMode),
    "SoftwareSetUpdateSchedule": cdk.stringToCloudFormation(properties.softwareSetUpdateSchedule),
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
  ret.addPropertyResult("desiredSoftwareSetId", "DesiredSoftwareSetId", (properties.DesiredSoftwareSetId != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredSoftwareSetId) : undefined));
  ret.addPropertyResult("desktopArn", "DesktopArn", (properties.DesktopArn != null ? cfn_parse.FromCloudFormation.getString(properties.DesktopArn) : undefined));
  ret.addPropertyResult("desktopEndpoint", "DesktopEndpoint", (properties.DesktopEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.DesktopEndpoint) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("maintenanceWindow", "MaintenanceWindow", (properties.MaintenanceWindow != null ? CfnEnvironmentMaintenanceWindowPropertyFromCloudFormation(properties.MaintenanceWindow) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("softwareSetUpdateMode", "SoftwareSetUpdateMode", (properties.SoftwareSetUpdateMode != null ? cfn_parse.FromCloudFormation.getString(properties.SoftwareSetUpdateMode) : undefined));
  ret.addPropertyResult("softwareSetUpdateSchedule", "SoftwareSetUpdateSchedule", (properties.SoftwareSetUpdateSchedule != null ? cfn_parse.FromCloudFormation.getString(properties.SoftwareSetUpdateSchedule) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}