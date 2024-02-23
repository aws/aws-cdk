/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Represents a request to the create device pool operation.
 *
 * @cloudformationResource AWS::DeviceFarm::DevicePool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html
 */
export class CfnDevicePool extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::DevicePool";

  /**
   * Build a CfnDevicePool from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevicePool {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDevicePoolPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDevicePool(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the device pool. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The device pool's description.
   */
  public description?: string;

  /**
   * The number of devices that Device Farm can add to your device pool.
   */
  public maxDevices?: number;

  /**
   * The device pool's name.
   */
  public name: string;

  /**
   * The ARN of the project for the device pool.
   */
  public projectArn: string;

  /**
   * The device pool's rules.
   */
  public rules: Array<cdk.IResolvable | CfnDevicePool.RuleProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDevicePoolProps) {
    super(scope, id, {
      "type": CfnDevicePool.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "projectArn", this);
    cdk.requireProperty(props, "rules", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.maxDevices = props.maxDevices;
    this.name = props.name;
    this.projectArn = props.projectArn;
    this.rules = props.rules;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::DevicePool", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "maxDevices": this.maxDevices,
      "name": this.name,
      "projectArn": this.projectArn,
      "rules": this.rules,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevicePool.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDevicePoolPropsToCloudFormation(props);
  }
}

export namespace CfnDevicePool {
  /**
   * Represents a condition for a device pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-devicepool-rule.html
   */
  export interface RuleProperty {
    /**
     * The rule's stringified attribute. For example, specify the value as `"\"abc\""` .
     *
     * The supported operators for each attribute are provided in the following list.
     *
     * - **APPIUM_VERSION** - The Appium version for the test.
     *
     * Supported operators: `CONTAINS`
     * - **ARN** - The Amazon Resource Name (ARN) of the device (for example, `arn:aws:devicefarm:us-west-2::device:12345Example` .
     *
     * Supported operators: `EQUALS` , `IN` , `NOT_IN`
     * - **AVAILABILITY** - The current availability of the device. Valid values are AVAILABLE, HIGHLY_AVAILABLE, BUSY, or TEMPORARY_NOT_AVAILABLE.
     *
     * Supported operators: `EQUALS`
     * - **FLEET_TYPE** - The fleet type. Valid values are PUBLIC or PRIVATE.
     *
     * Supported operators: `EQUALS`
     * - **FORM_FACTOR** - The device form factor. Valid values are PHONE or TABLET.
     *
     * Supported operators: `EQUALS` , `IN` , `NOT_IN`
     * - **INSTANCE_ARN** - The Amazon Resource Name (ARN) of the device instance.
     *
     * Supported operators: `IN` , `NOT_IN`
     * - **INSTANCE_LABELS** - The label of the device instance.
     *
     * Supported operators: `CONTAINS`
     * - **MANUFACTURER** - The device manufacturer (for example, Apple).
     *
     * Supported operators: `EQUALS` , `IN` , `NOT_IN`
     * - **MODEL** - The device model, such as Apple iPad Air 2 or Google Pixel.
     *
     * Supported operators: `CONTAINS` , `EQUALS` , `IN` , `NOT_IN`
     * - **OS_VERSION** - The operating system version (for example, 10.3.2).
     *
     * Supported operators: `EQUALS` , `GREATER_THAN` , `GREATER_THAN_OR_EQUALS` , `IN` , `LESS_THAN` , `LESS_THAN_OR_EQUALS` , `NOT_IN`
     * - **PLATFORM** - The device platform. Valid values are ANDROID or IOS.
     *
     * Supported operators: `EQUALS` , `IN` , `NOT_IN`
     * - **REMOTE_ACCESS_ENABLED** - Whether the device is enabled for remote access. Valid values are TRUE or FALSE.
     *
     * Supported operators: `EQUALS`
     * - **REMOTE_DEBUG_ENABLED** - Whether the device is enabled for remote debugging. Valid values are TRUE or FALSE.
     *
     * Supported operators: `EQUALS`
     *
     * Because remote debugging is [no longer supported](https://docs.aws.amazon.com/devicefarm/latest/developerguide/history.html) , this filter is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-devicepool-rule.html#cfn-devicefarm-devicepool-rule-attribute
     */
    readonly attribute?: string;

    /**
     * Specifies how Device Farm compares the rule's attribute to the value.
     *
     * For the operators that are supported by each attribute, see the attribute descriptions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-devicepool-rule.html#cfn-devicefarm-devicepool-rule-operator
     */
    readonly operator?: string;

    /**
     * The rule's value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-devicepool-rule.html#cfn-devicefarm-devicepool-rule-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDevicePool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html
 */
export interface CfnDevicePoolProps {
  /**
   * The device pool's description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-description
   */
  readonly description?: string;

  /**
   * The number of devices that Device Farm can add to your device pool.
   *
   * Device Farm adds devices that are available and meet the criteria that you assign for the `rules` parameter. Depending on how many devices meet these constraints, your device pool might contain fewer devices than the value for this parameter.
   *
   * By specifying the maximum number of devices, you can control the costs that you incur by running tests.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-maxdevices
   */
  readonly maxDevices?: number;

  /**
   * The device pool's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-name
   */
  readonly name: string;

  /**
   * The ARN of the project for the device pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-projectarn
   */
  readonly projectArn: string;

  /**
   * The device pool's rules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-rules
   */
  readonly rules: Array<cdk.IResolvable | CfnDevicePool.RuleProperty> | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-devicepool.html#cfn-devicefarm-devicepool-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDevicePoolRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", cdk.validateString)(properties.attribute));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDevicePoolRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDevicePoolRulePropertyValidator(properties).assertSuccess();
  return {
    "Attribute": cdk.stringToCloudFormation(properties.attribute),
    "Operator": cdk.stringToCloudFormation(properties.operator),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDevicePoolRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDevicePool.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevicePool.RuleProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? cfn_parse.FromCloudFormation.getString(properties.Attribute) : undefined));
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDevicePoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnDevicePoolProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDevicePoolPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("maxDevices", cdk.validateNumber)(properties.maxDevices));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("projectArn", cdk.requiredValidator)(properties.projectArn));
  errors.collect(cdk.propertyValidator("projectArn", cdk.validateString)(properties.projectArn));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnDevicePoolRulePropertyValidator))(properties.rules));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDevicePoolProps\"");
}

// @ts-ignore TS6133
function convertCfnDevicePoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDevicePoolPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MaxDevices": cdk.numberToCloudFormation(properties.maxDevices),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProjectArn": cdk.stringToCloudFormation(properties.projectArn),
    "Rules": cdk.listMapper(convertCfnDevicePoolRulePropertyToCloudFormation)(properties.rules),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDevicePoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDevicePoolProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevicePoolProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("maxDevices", "MaxDevices", (properties.MaxDevices != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDevices) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("projectArn", "ProjectArn", (properties.ProjectArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectArn) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnDevicePoolRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a profile that can be applied to one or more private fleet device instances.
 *
 * @cloudformationResource AWS::DeviceFarm::InstanceProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html
 */
export class CfnInstanceProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::InstanceProfile";

  /**
   * Build a CfnInstanceProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstanceProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstanceProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the instance profile. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the instance profile.
   */
  public description?: string;

  /**
   * An array of strings containing the list of app packages that should not be cleaned up from the device after a test run completes.
   */
  public excludeAppPackagesFromCleanup?: Array<string>;

  /**
   * The name of the instance profile.
   */
  public name: string;

  /**
   * When set to `true` , Device Farm removes app packages after a test run.
   */
  public packageCleanup?: boolean | cdk.IResolvable;

  /**
   * When set to `true` , Device Farm reboots the instance after a test run.
   */
  public rebootAfterUse?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceProfileProps) {
    super(scope, id, {
      "type": CfnInstanceProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.excludeAppPackagesFromCleanup = props.excludeAppPackagesFromCleanup;
    this.name = props.name;
    this.packageCleanup = props.packageCleanup;
    this.rebootAfterUse = props.rebootAfterUse;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::InstanceProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "excludeAppPackagesFromCleanup": this.excludeAppPackagesFromCleanup,
      "name": this.name,
      "packageCleanup": this.packageCleanup,
      "rebootAfterUse": this.rebootAfterUse,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnInstanceProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html
 */
export interface CfnInstanceProfileProps {
  /**
   * The description of the instance profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-description
   */
  readonly description?: string;

  /**
   * An array of strings containing the list of app packages that should not be cleaned up from the device after a test run completes.
   *
   * The list of packages is considered only if you set `packageCleanup` to `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-excludeapppackagesfromcleanup
   */
  readonly excludeAppPackagesFromCleanup?: Array<string>;

  /**
   * The name of the instance profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-name
   */
  readonly name: string;

  /**
   * When set to `true` , Device Farm removes app packages after a test run.
   *
   * The default value is `false` for private devices.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-packagecleanup
   */
  readonly packageCleanup?: boolean | cdk.IResolvable;

  /**
   * When set to `true` , Device Farm reboots the instance after a test run.
   *
   * The default value is `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-rebootafteruse
   */
  readonly rebootAfterUse?: boolean | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-instanceprofile.html#cfn-devicefarm-instanceprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("excludeAppPackagesFromCleanup", cdk.listValidator(cdk.validateString))(properties.excludeAppPackagesFromCleanup));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("packageCleanup", cdk.validateBoolean)(properties.packageCleanup));
  errors.collect(cdk.propertyValidator("rebootAfterUse", cdk.validateBoolean)(properties.rebootAfterUse));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnInstanceProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceProfilePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExcludeAppPackagesFromCleanup": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeAppPackagesFromCleanup),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PackageCleanup": cdk.booleanToCloudFormation(properties.packageCleanup),
    "RebootAfterUse": cdk.booleanToCloudFormation(properties.rebootAfterUse),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnInstanceProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProfileProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("excludeAppPackagesFromCleanup", "ExcludeAppPackagesFromCleanup", (properties.ExcludeAppPackagesFromCleanup != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeAppPackagesFromCleanup) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("packageCleanup", "PackageCleanup", (properties.PackageCleanup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PackageCleanup) : undefined));
  ret.addPropertyResult("rebootAfterUse", "RebootAfterUse", (properties.RebootAfterUse != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RebootAfterUse) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a network profile.
 *
 * @cloudformationResource AWS::DeviceFarm::NetworkProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html
 */
export class CfnNetworkProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::NetworkProfile";

  /**
   * Build a CfnNetworkProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNetworkProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNetworkProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNetworkProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the network profile. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the network profile.
   */
  public description?: string;

  /**
   * The data throughput rate in bits per second, as an integer from 0 to 104857600.
   */
  public downlinkBandwidthBits?: number;

  /**
   * Delay time for all packets to destination in milliseconds as an integer from 0 to 2000.
   */
  public downlinkDelayMs?: number;

  /**
   * Time variation in the delay of received packets in milliseconds as an integer from 0 to 2000.
   */
  public downlinkJitterMs?: number;

  /**
   * Proportion of received packets that fail to arrive from 0 to 100 percent.
   */
  public downlinkLossPercent?: number;

  /**
   * The name of the network profile.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the specified project.
   */
  public projectArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The data throughput rate in bits per second, as an integer from 0 to 104857600.
   */
  public uplinkBandwidthBits?: number;

  /**
   * Delay time for all packets to destination in milliseconds as an integer from 0 to 2000.
   */
  public uplinkDelayMs?: number;

  /**
   * Time variation in the delay of received packets in milliseconds as an integer from 0 to 2000.
   */
  public uplinkJitterMs?: number;

  /**
   * Proportion of transmitted packets that fail to arrive from 0 to 100 percent.
   */
  public uplinkLossPercent?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNetworkProfileProps) {
    super(scope, id, {
      "type": CfnNetworkProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "projectArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.downlinkBandwidthBits = props.downlinkBandwidthBits;
    this.downlinkDelayMs = props.downlinkDelayMs;
    this.downlinkJitterMs = props.downlinkJitterMs;
    this.downlinkLossPercent = props.downlinkLossPercent;
    this.name = props.name;
    this.projectArn = props.projectArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::NetworkProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.uplinkBandwidthBits = props.uplinkBandwidthBits;
    this.uplinkDelayMs = props.uplinkDelayMs;
    this.uplinkJitterMs = props.uplinkJitterMs;
    this.uplinkLossPercent = props.uplinkLossPercent;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "downlinkBandwidthBits": this.downlinkBandwidthBits,
      "downlinkDelayMs": this.downlinkDelayMs,
      "downlinkJitterMs": this.downlinkJitterMs,
      "downlinkLossPercent": this.downlinkLossPercent,
      "name": this.name,
      "projectArn": this.projectArn,
      "tags": this.tags.renderTags(),
      "uplinkBandwidthBits": this.uplinkBandwidthBits,
      "uplinkDelayMs": this.uplinkDelayMs,
      "uplinkJitterMs": this.uplinkJitterMs,
      "uplinkLossPercent": this.uplinkLossPercent
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNetworkProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNetworkProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnNetworkProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html
 */
export interface CfnNetworkProfileProps {
  /**
   * The description of the network profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-description
   */
  readonly description?: string;

  /**
   * The data throughput rate in bits per second, as an integer from 0 to 104857600.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-downlinkbandwidthbits
   */
  readonly downlinkBandwidthBits?: number;

  /**
   * Delay time for all packets to destination in milliseconds as an integer from 0 to 2000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-downlinkdelayms
   */
  readonly downlinkDelayMs?: number;

  /**
   * Time variation in the delay of received packets in milliseconds as an integer from 0 to 2000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-downlinkjitterms
   */
  readonly downlinkJitterMs?: number;

  /**
   * Proportion of received packets that fail to arrive from 0 to 100 percent.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-downlinklosspercent
   */
  readonly downlinkLossPercent?: number;

  /**
   * The name of the network profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the specified project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-projectarn
   */
  readonly projectArn: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The data throughput rate in bits per second, as an integer from 0 to 104857600.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-uplinkbandwidthbits
   */
  readonly uplinkBandwidthBits?: number;

  /**
   * Delay time for all packets to destination in milliseconds as an integer from 0 to 2000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-uplinkdelayms
   */
  readonly uplinkDelayMs?: number;

  /**
   * Time variation in the delay of received packets in milliseconds as an integer from 0 to 2000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-uplinkjitterms
   */
  readonly uplinkJitterMs?: number;

  /**
   * Proportion of transmitted packets that fail to arrive from 0 to 100 percent.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-networkprofile.html#cfn-devicefarm-networkprofile-uplinklosspercent
   */
  readonly uplinkLossPercent?: number;
}

/**
 * Determine whether the given properties match those of a `CfnNetworkProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnNetworkProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNetworkProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("downlinkBandwidthBits", cdk.validateNumber)(properties.downlinkBandwidthBits));
  errors.collect(cdk.propertyValidator("downlinkDelayMs", cdk.validateNumber)(properties.downlinkDelayMs));
  errors.collect(cdk.propertyValidator("downlinkJitterMs", cdk.validateNumber)(properties.downlinkJitterMs));
  errors.collect(cdk.propertyValidator("downlinkLossPercent", cdk.validateNumber)(properties.downlinkLossPercent));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("projectArn", cdk.requiredValidator)(properties.projectArn));
  errors.collect(cdk.propertyValidator("projectArn", cdk.validateString)(properties.projectArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("uplinkBandwidthBits", cdk.validateNumber)(properties.uplinkBandwidthBits));
  errors.collect(cdk.propertyValidator("uplinkDelayMs", cdk.validateNumber)(properties.uplinkDelayMs));
  errors.collect(cdk.propertyValidator("uplinkJitterMs", cdk.validateNumber)(properties.uplinkJitterMs));
  errors.collect(cdk.propertyValidator("uplinkLossPercent", cdk.validateNumber)(properties.uplinkLossPercent));
  return errors.wrap("supplied properties not correct for \"CfnNetworkProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnNetworkProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNetworkProfilePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DownlinkBandwidthBits": cdk.numberToCloudFormation(properties.downlinkBandwidthBits),
    "DownlinkDelayMs": cdk.numberToCloudFormation(properties.downlinkDelayMs),
    "DownlinkJitterMs": cdk.numberToCloudFormation(properties.downlinkJitterMs),
    "DownlinkLossPercent": cdk.numberToCloudFormation(properties.downlinkLossPercent),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProjectArn": cdk.stringToCloudFormation(properties.projectArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UplinkBandwidthBits": cdk.numberToCloudFormation(properties.uplinkBandwidthBits),
    "UplinkDelayMs": cdk.numberToCloudFormation(properties.uplinkDelayMs),
    "UplinkJitterMs": cdk.numberToCloudFormation(properties.uplinkJitterMs),
    "UplinkLossPercent": cdk.numberToCloudFormation(properties.uplinkLossPercent)
  };
}

// @ts-ignore TS6133
function CfnNetworkProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNetworkProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkProfileProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("downlinkBandwidthBits", "DownlinkBandwidthBits", (properties.DownlinkBandwidthBits != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownlinkBandwidthBits) : undefined));
  ret.addPropertyResult("downlinkDelayMs", "DownlinkDelayMs", (properties.DownlinkDelayMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownlinkDelayMs) : undefined));
  ret.addPropertyResult("downlinkJitterMs", "DownlinkJitterMs", (properties.DownlinkJitterMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownlinkJitterMs) : undefined));
  ret.addPropertyResult("downlinkLossPercent", "DownlinkLossPercent", (properties.DownlinkLossPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownlinkLossPercent) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("projectArn", "ProjectArn", (properties.ProjectArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("uplinkBandwidthBits", "UplinkBandwidthBits", (properties.UplinkBandwidthBits != null ? cfn_parse.FromCloudFormation.getNumber(properties.UplinkBandwidthBits) : undefined));
  ret.addPropertyResult("uplinkDelayMs", "UplinkDelayMs", (properties.UplinkDelayMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.UplinkDelayMs) : undefined));
  ret.addPropertyResult("uplinkJitterMs", "UplinkJitterMs", (properties.UplinkJitterMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.UplinkJitterMs) : undefined));
  ret.addPropertyResult("uplinkLossPercent", "UplinkLossPercent", (properties.UplinkLossPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.UplinkLossPercent) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a project.
 *
 * @cloudformationResource AWS::DeviceFarm::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::Project";

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
   * The Amazon Resource Name (ARN) of the project. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Sets the execution timeout value (in minutes) for a project.
   */
  public defaultJobTimeoutMinutes?: number;

  /**
   * The project's name.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to add to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The VPC security groups and subnets that are attached to a project.
   */
  public vpcConfig?: cdk.IResolvable | CfnProject.VpcConfigProperty;

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

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.defaultJobTimeoutMinutes = props.defaultJobTimeoutMinutes;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::Project", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultJobTimeoutMinutes": this.defaultJobTimeoutMinutes,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "vpcConfig": this.vpcConfig
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
   * The VPC security groups and subnets that are attached to a project.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-project-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * A list of VPC security group IDs.
     *
     * A security group allows inbound traffic from network interfaces (and their associated instances) that are assigned to the same security group. See [Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud user guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-project-vpcconfig.html#cfn-devicefarm-project-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * A subnet is a range of IP addresses in your VPC.
     *
     * You can launch Amazon resources, such as EC2 instances, into a specific subnet. When you create a subnet, you specify the IPv4 CIDR block for the subnet, which is a subset of the VPC CIDR block. See [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon Virtual Private Cloud user guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-project-vpcconfig.html#cfn-devicefarm-project-vpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;

    /**
     * A list of VPC IDs.
     *
     * Each VPC is given a unique ID upon creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-project-vpcconfig.html#cfn-devicefarm-project-vpcconfig-vpcid
     */
    readonly vpcId: string;
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html
 */
export interface CfnProjectProps {
  /**
   * Sets the execution timeout value (in minutes) for a project.
   *
   * All test runs in this project use the specified execution timeout value unless overridden when scheduling a run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html#cfn-devicefarm-project-defaultjobtimeoutminutes
   */
  readonly defaultJobTimeoutMinutes?: number;

  /**
   * The project's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html#cfn-devicefarm-project-name
   */
  readonly name: string;

  /**
   * The tags to add to the resource.
   *
   * A tag is an array of key-value pairs. Tag keys can have a maximum character length of 128 characters. Tag values can have a maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html#cfn-devicefarm-project-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The VPC security groups and subnets that are attached to a project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-project.html#cfn-devicefarm-project-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnProject.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnProjectVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnProject.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
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
  errors.collect(cdk.propertyValidator("defaultJobTimeoutMinutes", cdk.validateNumber)(properties.defaultJobTimeoutMinutes));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnProjectVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "DefaultJobTimeoutMinutes": cdk.numberToCloudFormation(properties.defaultJobTimeoutMinutes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcConfig": convertCfnProjectVpcConfigPropertyToCloudFormation(properties.vpcConfig)
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
  ret.addPropertyResult("defaultJobTimeoutMinutes", "DefaultJobTimeoutMinutes", (properties.DefaultJobTimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultJobTimeoutMinutes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnProjectVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A Selenium testing project.
 *
 * Projects are used to collect and collate sessions.
 *
 * @cloudformationResource AWS::DeviceFarm::TestGridProject
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html
 */
export class CfnTestGridProject extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::TestGridProject";

  /**
   * Build a CfnTestGridProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTestGridProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTestGridProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTestGridProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `TestGrid` project. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A human-readable description for the project.
   */
  public description?: string;

  /**
   * A human-readable name for the project.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The VPC security groups and subnets that are attached to a project.
   */
  public vpcConfig?: cdk.IResolvable | CfnTestGridProject.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTestGridProjectProps) {
    super(scope, id, {
      "type": CfnTestGridProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::TestGridProject", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTestGridProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTestGridProjectPropsToCloudFormation(props);
  }
}

export namespace CfnTestGridProject {
  /**
   * The VPC security groups and subnets attached to the `TestGrid` project.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-testgridproject-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * A list of VPC security group IDs.
     *
     * A security group allows inbound traffic from network interfaces (and their associated instances) that are assigned to the same security group. See [Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud user guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-testgridproject-vpcconfig.html#cfn-devicefarm-testgridproject-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * A list of VPC subnet IDs.
     *
     * A subnet is a range of IP addresses in your VPC. You can launch Amazon resources, such as EC2 instances, into a specific subnet. When you create a subnet, you specify the IPv4 CIDR block for the subnet, which is a subset of the VPC CIDR block. See [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon Virtual Private Cloud user guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-testgridproject-vpcconfig.html#cfn-devicefarm-testgridproject-vpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;

    /**
     * A list of VPC IDs.
     *
     * Each VPC is given a unique ID upon creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-devicefarm-testgridproject-vpcconfig.html#cfn-devicefarm-testgridproject-vpcconfig-vpcid
     */
    readonly vpcId: string;
  }
}

/**
 * Properties for defining a `CfnTestGridProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html
 */
export interface CfnTestGridProjectProps {
  /**
   * A human-readable description for the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html#cfn-devicefarm-testgridproject-description
   */
  readonly description?: string;

  /**
   * A human-readable name for the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html#cfn-devicefarm-testgridproject-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html#cfn-devicefarm-testgridproject-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The VPC security groups and subnets that are attached to a project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-testgridproject.html#cfn-devicefarm-testgridproject-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnTestGridProject.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTestGridProjectVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTestGridProjectVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTestGridProjectVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnTestGridProjectVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTestGridProject.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTestGridProject.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTestGridProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnTestGridProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTestGridProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnTestGridProjectVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnTestGridProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnTestGridProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTestGridProjectPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcConfig": convertCfnTestGridProjectVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnTestGridProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTestGridProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTestGridProjectProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnTestGridProjectVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a configuration record in Device Farm for your Amazon Virtual Private Cloud (VPC) endpoint service.
 *
 * @cloudformationResource AWS::DeviceFarm::VPCEConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html
 */
export class CfnVPCEConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DeviceFarm::VPCEConfiguration";

  /**
   * Build a CfnVPCEConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVPCEConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVPCEConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVPCEConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the VPC endpoint. See [Amazon resource names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *General Reference guide* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The DNS name that Device Farm will use to map to the private service you want to access.
   */
  public serviceDnsName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * An optional description that provides details about your VPC endpoint configuration.
   */
  public vpceConfigurationDescription?: string;

  /**
   * The friendly name you give to your VPC endpoint configuration to manage your configurations more easily.
   */
  public vpceConfigurationName: string;

  /**
   * The name of the VPC endpoint service that you want to access from Device Farm.
   */
  public vpceServiceName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVPCEConfigurationProps) {
    super(scope, id, {
      "type": CfnVPCEConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "serviceDnsName", this);
    cdk.requireProperty(props, "vpceConfigurationName", this);
    cdk.requireProperty(props, "vpceServiceName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.serviceDnsName = props.serviceDnsName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DeviceFarm::VPCEConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpceConfigurationDescription = props.vpceConfigurationDescription;
    this.vpceConfigurationName = props.vpceConfigurationName;
    this.vpceServiceName = props.vpceServiceName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "serviceDnsName": this.serviceDnsName,
      "tags": this.tags.renderTags(),
      "vpceConfigurationDescription": this.vpceConfigurationDescription,
      "vpceConfigurationName": this.vpceConfigurationName,
      "vpceServiceName": this.vpceServiceName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVPCEConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVPCEConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVPCEConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html
 */
export interface CfnVPCEConfigurationProps {
  /**
   * The DNS name that Device Farm will use to map to the private service you want to access.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html#cfn-devicefarm-vpceconfiguration-servicednsname
   */
  readonly serviceDnsName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html#cfn-devicefarm-vpceconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * An optional description that provides details about your VPC endpoint configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html#cfn-devicefarm-vpceconfiguration-vpceconfigurationdescription
   */
  readonly vpceConfigurationDescription?: string;

  /**
   * The friendly name you give to your VPC endpoint configuration to manage your configurations more easily.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html#cfn-devicefarm-vpceconfiguration-vpceconfigurationname
   */
  readonly vpceConfigurationName: string;

  /**
   * The name of the VPC endpoint service that you want to access from Device Farm.
   *
   * The name follows the format `com.amazonaws.vpce.us-west-2.vpce-svc-id` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-devicefarm-vpceconfiguration.html#cfn-devicefarm-vpceconfiguration-vpceservicename
   */
  readonly vpceServiceName: string;
}

/**
 * Determine whether the given properties match those of a `CfnVPCEConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnVPCEConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVPCEConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serviceDnsName", cdk.requiredValidator)(properties.serviceDnsName));
  errors.collect(cdk.propertyValidator("serviceDnsName", cdk.validateString)(properties.serviceDnsName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpceConfigurationDescription", cdk.validateString)(properties.vpceConfigurationDescription));
  errors.collect(cdk.propertyValidator("vpceConfigurationName", cdk.requiredValidator)(properties.vpceConfigurationName));
  errors.collect(cdk.propertyValidator("vpceConfigurationName", cdk.validateString)(properties.vpceConfigurationName));
  errors.collect(cdk.propertyValidator("vpceServiceName", cdk.requiredValidator)(properties.vpceServiceName));
  errors.collect(cdk.propertyValidator("vpceServiceName", cdk.validateString)(properties.vpceServiceName));
  return errors.wrap("supplied properties not correct for \"CfnVPCEConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnVPCEConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVPCEConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ServiceDnsName": cdk.stringToCloudFormation(properties.serviceDnsName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpceConfigurationDescription": cdk.stringToCloudFormation(properties.vpceConfigurationDescription),
    "VpceConfigurationName": cdk.stringToCloudFormation(properties.vpceConfigurationName),
    "VpceServiceName": cdk.stringToCloudFormation(properties.vpceServiceName)
  };
}

// @ts-ignore TS6133
function CfnVPCEConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVPCEConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVPCEConfigurationProps>();
  ret.addPropertyResult("serviceDnsName", "ServiceDnsName", (properties.ServiceDnsName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceDnsName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpceConfigurationDescription", "VpceConfigurationDescription", (properties.VpceConfigurationDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VpceConfigurationDescription) : undefined));
  ret.addPropertyResult("vpceConfigurationName", "VpceConfigurationName", (properties.VpceConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.VpceConfigurationName) : undefined));
  ret.addPropertyResult("vpceServiceName", "VpceServiceName", (properties.VpceServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpceServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}