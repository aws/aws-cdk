/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::IoT1Click::Device` resource controls the enabled state of an AWS IoT 1-Click compatible device.
 *
 * For more information, see [Device](https://docs.aws.amazon.com/iot-1-click/1.0/devices-apireference/devices-deviceid.html) in the *AWS IoT 1-Click Devices API Reference* .
 *
 * @cloudformationResource AWS::IoT1Click::Device
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html
 */
export class CfnDevice extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT1Click::Device";

  /**
   * Build a CfnDevice from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevice {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDevicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDevice(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the device, such as `arn:aws:iot1click:us-west-2:123456789012:devices/G030PX0312744DWM` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the device.
   *
   * @cloudformationAttribute DeviceId
   */
  public readonly attrDeviceId: string;

  /**
   * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
   *
   * @cloudformationAttribute Enabled
   */
  public readonly attrEnabled: cdk.IResolvable;

  /**
   * The ID of the device, such as `G030PX0312744DWM` .
   */
  public deviceId: string;

  /**
   * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
   */
  public enabled: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeviceProps) {
    super(scope, id, {
      "type": CfnDevice.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "deviceId", this);
    cdk.requireProperty(props, "enabled", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDeviceId = cdk.Token.asString(this.getAtt("DeviceId", cdk.ResolutionTypeHint.STRING));
    this.attrEnabled = this.getAtt("Enabled");
    this.deviceId = props.deviceId;
    this.enabled = props.enabled;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deviceId": this.deviceId,
      "enabled": this.enabled
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevice.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDevicePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDevice`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html
 */
export interface CfnDeviceProps {
  /**
   * The ID of the device, such as `G030PX0312744DWM` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-deviceid
   */
  readonly deviceId: string;

  /**
   * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-enabled
   */
  readonly enabled: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDevicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceId", cdk.requiredValidator)(properties.deviceId));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"CfnDeviceProps\"");
}

// @ts-ignore TS6133
function convertCfnDevicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDevicePropsValidator(properties).assertSuccess();
  return {
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProps>();
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IoT1Click::Placement` resource creates a placement to be associated with an AWS IoT 1-Click project.
 *
 * A placement is an instance of a device in a location. For more information, see [Projects, Templates, and Placements](https://docs.aws.amazon.com/iot-1-click/latest/developerguide/1click-PTP.html) in the *AWS IoT 1-Click Developer Guide* .
 *
 * @cloudformationResource AWS::IoT1Click::Placement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html
 */
export class CfnPlacement extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT1Click::Placement";

  /**
   * Build a CfnPlacement from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlacement {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPlacementPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPlacement(scope, id, propsResult.value);
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
   * The name of the placement, such as `floor17` .
   *
   * @cloudformationAttribute PlacementName
   */
  public readonly attrPlacementName: string;

  /**
   * The name of the project containing the placement, such as `conference-rooms` .
   *
   * @cloudformationAttribute ProjectName
   */
  public readonly attrProjectName: string;

  /**
   * The devices to associate with the placement, as defined by a mapping of zero or more key-value pairs wherein the key is a template name and the value is a device ID.
   */
  public associatedDevices?: any | cdk.IResolvable;

  /**
   * The user-defined attributes associated with the placement.
   */
  public attributes?: any | cdk.IResolvable;

  /**
   * The name of the placement.
   */
  public placementName?: string;

  /**
   * The name of the project containing the placement.
   */
  public projectName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPlacementProps) {
    super(scope, id, {
      "type": CfnPlacement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "projectName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPlacementName = cdk.Token.asString(this.getAtt("PlacementName", cdk.ResolutionTypeHint.STRING));
    this.attrProjectName = cdk.Token.asString(this.getAtt("ProjectName", cdk.ResolutionTypeHint.STRING));
    this.associatedDevices = props.associatedDevices;
    this.attributes = props.attributes;
    this.placementName = props.placementName;
    this.projectName = props.projectName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associatedDevices": this.associatedDevices,
      "attributes": this.attributes,
      "placementName": this.placementName,
      "projectName": this.projectName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlacement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPlacementPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPlacement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html
 */
export interface CfnPlacementProps {
  /**
   * The devices to associate with the placement, as defined by a mapping of zero or more key-value pairs wherein the key is a template name and the value is a device ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-associateddevices
   */
  readonly associatedDevices?: any | cdk.IResolvable;

  /**
   * The user-defined attributes associated with the placement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-attributes
   */
  readonly attributes?: any | cdk.IResolvable;

  /**
   * The name of the placement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-placementname
   */
  readonly placementName?: string;

  /**
   * The name of the project containing the placement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-projectname
   */
  readonly projectName: string;
}

/**
 * Determine whether the given properties match those of a `CfnPlacementProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlacementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlacementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associatedDevices", cdk.validateObject)(properties.associatedDevices));
  errors.collect(cdk.propertyValidator("attributes", cdk.validateObject)(properties.attributes));
  errors.collect(cdk.propertyValidator("placementName", cdk.validateString)(properties.placementName));
  errors.collect(cdk.propertyValidator("projectName", cdk.requiredValidator)(properties.projectName));
  errors.collect(cdk.propertyValidator("projectName", cdk.validateString)(properties.projectName));
  return errors.wrap("supplied properties not correct for \"CfnPlacementProps\"");
}

// @ts-ignore TS6133
function convertCfnPlacementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlacementPropsValidator(properties).assertSuccess();
  return {
    "AssociatedDevices": cdk.objectToCloudFormation(properties.associatedDevices),
    "Attributes": cdk.objectToCloudFormation(properties.attributes),
    "PlacementName": cdk.stringToCloudFormation(properties.placementName),
    "ProjectName": cdk.stringToCloudFormation(properties.projectName)
  };
}

// @ts-ignore TS6133
function CfnPlacementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlacementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlacementProps>();
  ret.addPropertyResult("associatedDevices", "AssociatedDevices", (properties.AssociatedDevices != null ? cfn_parse.FromCloudFormation.getAny(properties.AssociatedDevices) : undefined));
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined));
  ret.addPropertyResult("placementName", "PlacementName", (properties.PlacementName != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementName) : undefined));
  ret.addPropertyResult("projectName", "ProjectName", (properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IoT1Click::Project` resource creates an empty project with a placement template.
 *
 * A project contains zero or more placements that adhere to the placement template defined in the project. For more information, see [CreateProject](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_CreateProject.html) in the *AWS IoT 1-Click Projects API Reference* .
 *
 * @cloudformationResource AWS::IoT1Click::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT1Click::Project";

  /**
   * Build a CfnProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the project, such as `arn:aws:iot1click:us-east-1:123456789012:projects/project-a1bzhi` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the project, such as `project-a1bzhi` .
   *
   * @cloudformationAttribute ProjectName
   */
  public readonly attrProjectName: string;

  /**
   * The description of the project.
   */
  public description?: string;

  /**
   * An object describing the project's placement specifications.
   */
  public placementTemplate: cdk.IResolvable | CfnProject.PlacementTemplateProperty;

  /**
   * The name of the project from which to obtain information.
   */
  public projectName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
    super(scope, id, {
      "type": CfnProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "placementTemplate", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrProjectName = cdk.Token.asString(this.getAtt("ProjectName", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.placementTemplate = props.placementTemplate;
    this.projectName = props.projectName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "placementTemplate": this.placementTemplate,
      "projectName": this.projectName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProjectPropsToCloudFormation(props);
  }
}

export namespace CfnProject {
  /**
   * In AWS CloudFormation , use the `PlacementTemplate` property type to define the template for an AWS IoT 1-Click project.
   *
   * `PlacementTemplate` is a property of the `AWS::IoT1Click::Project` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html
   */
  export interface PlacementTemplateProperty {
    /**
     * The default attributes (key-value pairs) to be applied to all placements using this template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html#cfn-iot1click-project-placementtemplate-defaultattributes
     */
    readonly defaultAttributes?: any | cdk.IResolvable;

    /**
     * An object specifying the [DeviceTemplate](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_DeviceTemplate.html) for all placements using this ( [PlacementTemplate](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_PlacementTemplate.html) ) template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html#cfn-iot1click-project-placementtemplate-devicetemplates
     */
    readonly deviceTemplates?: cdk.IResolvable | Record<string, CfnProject.DeviceTemplateProperty | cdk.IResolvable>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html
   */
  export interface DeviceTemplateProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html#cfn-iot1click-project-devicetemplate-callbackoverrides
     */
    readonly callbackOverrides?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html#cfn-iot1click-project-devicetemplate-devicetype
     */
    readonly deviceType?: string;
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html
 */
export interface CfnProjectProps {
  /**
   * The description of the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-description
   */
  readonly description?: string;

  /**
   * An object describing the project's placement specifications.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-placementtemplate
   */
  readonly placementTemplate: cdk.IResolvable | CfnProject.PlacementTemplateProperty;

  /**
   * The name of the project from which to obtain information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-projectname
   */
  readonly projectName?: string;
}

/**
 * Determine whether the given properties match those of a `DeviceTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectDeviceTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("callbackOverrides", cdk.validateObject)(properties.callbackOverrides));
  errors.collect(cdk.propertyValidator("deviceType", cdk.validateString)(properties.deviceType));
  return errors.wrap("supplied properties not correct for \"DeviceTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectDeviceTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectDeviceTemplatePropertyValidator(properties).assertSuccess();
  return {
    "CallbackOverrides": cdk.objectToCloudFormation(properties.callbackOverrides),
    "DeviceType": cdk.stringToCloudFormation(properties.deviceType)
  };
}

// @ts-ignore TS6133
function CfnProjectDeviceTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProject.DeviceTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.DeviceTemplateProperty>();
  ret.addPropertyResult("callbackOverrides", "CallbackOverrides", (properties.CallbackOverrides != null ? cfn_parse.FromCloudFormation.getAny(properties.CallbackOverrides) : undefined));
  ret.addPropertyResult("deviceType", "DeviceType", (properties.DeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPlacementTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultAttributes", cdk.validateObject)(properties.defaultAttributes));
  errors.collect(cdk.propertyValidator("deviceTemplates", cdk.hashValidator(CfnProjectDeviceTemplatePropertyValidator))(properties.deviceTemplates));
  return errors.wrap("supplied properties not correct for \"PlacementTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectPlacementTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPlacementTemplatePropertyValidator(properties).assertSuccess();
  return {
    "DefaultAttributes": cdk.objectToCloudFormation(properties.defaultAttributes),
    "DeviceTemplates": cdk.hashMapper(convertCfnProjectDeviceTemplatePropertyToCloudFormation)(properties.deviceTemplates)
  };
}

// @ts-ignore TS6133
function CfnProjectPlacementTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnProject.PlacementTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.PlacementTemplateProperty>();
  ret.addPropertyResult("defaultAttributes", "DefaultAttributes", (properties.DefaultAttributes != null ? cfn_parse.FromCloudFormation.getAny(properties.DefaultAttributes) : undefined));
  ret.addPropertyResult("deviceTemplates", "DeviceTemplates", (properties.DeviceTemplates != null ? cfn_parse.FromCloudFormation.getMap(CfnProjectDeviceTemplatePropertyFromCloudFormation)(properties.DeviceTemplates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("placementTemplate", cdk.requiredValidator)(properties.placementTemplate));
  errors.collect(cdk.propertyValidator("placementTemplate", CfnProjectPlacementTemplatePropertyValidator)(properties.placementTemplate));
  errors.collect(cdk.propertyValidator("projectName", cdk.validateString)(properties.projectName));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "PlacementTemplate": convertCfnProjectPlacementTemplatePropertyToCloudFormation(properties.placementTemplate),
    "ProjectName": cdk.stringToCloudFormation(properties.projectName)
  };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("placementTemplate", "PlacementTemplate", (properties.PlacementTemplate != null ? CfnProjectPlacementTemplatePropertyFromCloudFormation(properties.PlacementTemplate) : undefined));
  ret.addPropertyResult("projectName", "ProjectName", (properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}