/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a Device Advisor test suite.
 *
 * Requires permission to access the [CreateSuiteDefinition](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
 *
 * @cloudformationResource AWS::IoTCoreDeviceAdvisor::SuiteDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html
 */
export class CfnSuiteDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTCoreDeviceAdvisor::SuiteDefinition";

  /**
   * Build a CfnSuiteDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSuiteDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSuiteDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSuiteDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Arn of the Suite Definition.
   *
   * @cloudformationAttribute SuiteDefinitionArn
   */
  public readonly attrSuiteDefinitionArn: string;

  /**
   * The version of the Suite Definition.
   *
   * @cloudformationAttribute SuiteDefinitionId
   */
  public readonly attrSuiteDefinitionId: string;

  /**
   * The ID of the Suite Definition.
   *
   * @cloudformationAttribute SuiteDefinitionVersion
   */
  public readonly attrSuiteDefinitionVersion: string;

  /**
   * The configuration of the Suite Definition. Listed below are the required elements of the `SuiteDefinitionConfiguration` .
   */
  public suiteDefinitionConfiguration: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the the Suite Definition.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSuiteDefinitionProps) {
    super(scope, id, {
      "type": CfnSuiteDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "suiteDefinitionConfiguration", this);

    this.attrSuiteDefinitionArn = cdk.Token.asString(this.getAtt("SuiteDefinitionArn", cdk.ResolutionTypeHint.STRING));
    this.attrSuiteDefinitionId = cdk.Token.asString(this.getAtt("SuiteDefinitionId", cdk.ResolutionTypeHint.STRING));
    this.attrSuiteDefinitionVersion = cdk.Token.asString(this.getAtt("SuiteDefinitionVersion", cdk.ResolutionTypeHint.STRING));
    this.suiteDefinitionConfiguration = props.suiteDefinitionConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTCoreDeviceAdvisor::SuiteDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "suiteDefinitionConfiguration": this.suiteDefinitionConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSuiteDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSuiteDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnSuiteDefinition {
  /**
   * Gets the suite definition configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html
   */
  export interface SuiteDefinitionConfigurationProperty {
    /**
     * Gets the device permission ARN.
     *
     * This is a required parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-devicepermissionrolearn
     */
    readonly devicePermissionRoleArn: string;

    /**
     * Gets the devices configured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-devices
     */
    readonly devices?: Array<CfnSuiteDefinition.DeviceUnderTestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Gets the tests intended for qualification in a suite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-intendedforqualification
     */
    readonly intendedForQualification?: boolean | cdk.IResolvable;

    /**
     * Gets the test suite root group.
     *
     * This is a required parameter. For updating or creating the latest qualification suite, if `intendedForQualification` is set to true, `rootGroup` can be an empty string. If `intendedForQualification` is false, `rootGroup` cannot be an empty string. If `rootGroup` is empty, and `intendedForQualification` is set to true, all the qualification tests are included, and the configuration is default.
     *
     * For a qualification suite, the minimum length is 0, and the maximum is 2048. For a non-qualification suite, the minimum length is 1, and the maximum is 2048.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-rootgroup
     */
    readonly rootGroup: string;

    /**
     * Gets the suite definition name.
     *
     * This is a required parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-suitedefinitionname
     */
    readonly suiteDefinitionName?: string;
  }

  /**
   * Information of a test device.
   *
   * A thing ARN, certificate ARN or device role ARN is required.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html
   */
  export interface DeviceUnderTestProperty {
    /**
     * Lists device's certificate ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html#cfn-iotcoredeviceadvisor-suitedefinition-deviceundertest-certificatearn
     */
    readonly certificateArn?: string;

    /**
     * Lists device's thing ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html#cfn-iotcoredeviceadvisor-suitedefinition-deviceundertest-thingarn
     */
    readonly thingArn?: string;
  }
}

/**
 * Properties for defining a `CfnSuiteDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html
 */
export interface CfnSuiteDefinitionProps {
  /**
   * The configuration of the Suite Definition. Listed below are the required elements of the `SuiteDefinitionConfiguration` .
   *
   * - ***devicePermissionRoleArn*** - The device permission arn.
   *
   * This is a required element.
   *
   * *Type:* String
   * - ***devices*** - The list of configured devices under test. For more information on devices under test, see [DeviceUnderTest](https://docs.aws.amazon.com/iot/latest/apireference/API_iotdeviceadvisor_DeviceUnderTest.html)
   *
   * Not a required element.
   *
   * *Type:* List of devices under test
   * - ***intendedForQualification*** - The tests intended for qualification in a suite.
   *
   * Not a required element.
   *
   * *Type:* Boolean
   * - ***rootGroup*** - The test suite root group. For more information on creating and using root groups see the [Device Advisor workflow](https://docs.aws.amazon.com/iot/latest/developerguide/device-advisor-workflow.html) .
   *
   * This is a required element.
   *
   * *Type:* String
   * - ***suiteDefinitionName*** - The Suite Definition Configuration name.
   *
   * This is a required element.
   *
   * *Type:* String
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration
   */
  readonly suiteDefinitionConfiguration: any | cdk.IResolvable;

  /**
   * Metadata that can be used to manage the the Suite Definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DeviceUnderTestProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceUnderTestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSuiteDefinitionDeviceUnderTestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  return errors.wrap("supplied properties not correct for \"DeviceUnderTestProperty\"");
}

// @ts-ignore TS6133
function convertCfnSuiteDefinitionDeviceUnderTestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSuiteDefinitionDeviceUnderTestPropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn)
  };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionDeviceUnderTestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSuiteDefinition.DeviceUnderTestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinition.DeviceUnderTestProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SuiteDefinitionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SuiteDefinitionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSuiteDefinitionSuiteDefinitionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devicePermissionRoleArn", cdk.requiredValidator)(properties.devicePermissionRoleArn));
  errors.collect(cdk.propertyValidator("devicePermissionRoleArn", cdk.validateString)(properties.devicePermissionRoleArn));
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnSuiteDefinitionDeviceUnderTestPropertyValidator))(properties.devices));
  errors.collect(cdk.propertyValidator("intendedForQualification", cdk.validateBoolean)(properties.intendedForQualification));
  errors.collect(cdk.propertyValidator("rootGroup", cdk.requiredValidator)(properties.rootGroup));
  errors.collect(cdk.propertyValidator("rootGroup", cdk.validateString)(properties.rootGroup));
  errors.collect(cdk.propertyValidator("suiteDefinitionName", cdk.validateString)(properties.suiteDefinitionName));
  return errors.wrap("supplied properties not correct for \"SuiteDefinitionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSuiteDefinitionSuiteDefinitionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSuiteDefinitionSuiteDefinitionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DevicePermissionRoleArn": cdk.stringToCloudFormation(properties.devicePermissionRoleArn),
    "Devices": cdk.listMapper(convertCfnSuiteDefinitionDeviceUnderTestPropertyToCloudFormation)(properties.devices),
    "IntendedForQualification": cdk.booleanToCloudFormation(properties.intendedForQualification),
    "RootGroup": cdk.stringToCloudFormation(properties.rootGroup),
    "SuiteDefinitionName": cdk.stringToCloudFormation(properties.suiteDefinitionName)
  };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionSuiteDefinitionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSuiteDefinition.SuiteDefinitionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinition.SuiteDefinitionConfigurationProperty>();
  ret.addPropertyResult("devicePermissionRoleArn", "DevicePermissionRoleArn", (properties.DevicePermissionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DevicePermissionRoleArn) : undefined));
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnSuiteDefinitionDeviceUnderTestPropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addPropertyResult("intendedForQualification", "IntendedForQualification", (properties.IntendedForQualification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IntendedForQualification) : undefined));
  ret.addPropertyResult("rootGroup", "RootGroup", (properties.RootGroup != null ? cfn_parse.FromCloudFormation.getString(properties.RootGroup) : undefined));
  ret.addPropertyResult("suiteDefinitionName", "SuiteDefinitionName", (properties.SuiteDefinitionName != null ? cfn_parse.FromCloudFormation.getString(properties.SuiteDefinitionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSuiteDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSuiteDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSuiteDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("suiteDefinitionConfiguration", cdk.requiredValidator)(properties.suiteDefinitionConfiguration));
  errors.collect(cdk.propertyValidator("suiteDefinitionConfiguration", cdk.validateObject)(properties.suiteDefinitionConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSuiteDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnSuiteDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSuiteDefinitionPropsValidator(properties).assertSuccess();
  return {
    "SuiteDefinitionConfiguration": cdk.objectToCloudFormation(properties.suiteDefinitionConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSuiteDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinitionProps>();
  ret.addPropertyResult("suiteDefinitionConfiguration", "SuiteDefinitionConfiguration", (properties.SuiteDefinitionConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.SuiteDefinitionConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}