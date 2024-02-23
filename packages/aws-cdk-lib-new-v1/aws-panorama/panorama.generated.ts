/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an application instance and deploys it to a device.
 *
 * @cloudformationResource AWS::Panorama::ApplicationInstance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html
 */
export class CfnApplicationInstance extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Panorama::ApplicationInstance";

  /**
   * Build a CfnApplicationInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The application instance's ID.
   *
   * @cloudformationAttribute ApplicationInstanceId
   */
  public readonly attrApplicationInstanceId: string;

  /**
   * The application instance's ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The application instance's created time.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: number;

  /**
   * The application instance's default runtime context device name.
   *
   * @cloudformationAttribute DefaultRuntimeContextDeviceName
   */
  public readonly attrDefaultRuntimeContextDeviceName: string;

  /**
   * The application instance's health status.
   *
   * @cloudformationAttribute HealthStatus
   */
  public readonly attrHealthStatus: string;

  /**
   * The application instance's last updated time.
   *
   * @cloudformationAttribute LastUpdatedTime
   */
  public readonly attrLastUpdatedTime: number;

  /**
   * The application instance's status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The application instance's status description.
   *
   * @cloudformationAttribute StatusDescription
   */
  public readonly attrStatusDescription: string;

  /**
   * The ID of an application instance to replace with the new instance.
   */
  public applicationInstanceIdToReplace?: string;

  /**
   * The device's ID.
   */
  public defaultRuntimeContextDevice: string;

  /**
   * A description for the application instance.
   */
  public description?: string;

  /**
   * Setting overrides for the application manifest.
   */
  public manifestOverridesPayload?: cdk.IResolvable | CfnApplicationInstance.ManifestOverridesPayloadProperty;

  /**
   * The application's manifest document.
   */
  public manifestPayload: cdk.IResolvable | CfnApplicationInstance.ManifestPayloadProperty;

  /**
   * A name for the application instance.
   */
  public name?: string;

  /**
   * The ARN of a runtime role for the application instance.
   */
  public runtimeRoleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the application instance.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationInstanceProps) {
    super(scope, id, {
      "type": CfnApplicationInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultRuntimeContextDevice", this);
    cdk.requireProperty(props, "manifestPayload", this);

    this.attrApplicationInstanceId = cdk.Token.asString(this.getAtt("ApplicationInstanceId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asNumber(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrDefaultRuntimeContextDeviceName = cdk.Token.asString(this.getAtt("DefaultRuntimeContextDeviceName", cdk.ResolutionTypeHint.STRING));
    this.attrHealthStatus = cdk.Token.asString(this.getAtt("HealthStatus", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedTime = cdk.Token.asNumber(this.getAtt("LastUpdatedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusDescription = cdk.Token.asString(this.getAtt("StatusDescription", cdk.ResolutionTypeHint.STRING));
    this.applicationInstanceIdToReplace = props.applicationInstanceIdToReplace;
    this.defaultRuntimeContextDevice = props.defaultRuntimeContextDevice;
    this.description = props.description;
    this.manifestOverridesPayload = props.manifestOverridesPayload;
    this.manifestPayload = props.manifestPayload;
    this.name = props.name;
    this.runtimeRoleArn = props.runtimeRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Panorama::ApplicationInstance", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationInstanceIdToReplace": this.applicationInstanceIdToReplace,
      "defaultRuntimeContextDevice": this.defaultRuntimeContextDevice,
      "description": this.description,
      "manifestOverridesPayload": this.manifestOverridesPayload,
      "manifestPayload": this.manifestPayload,
      "name": this.name,
      "runtimeRoleArn": this.runtimeRoleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationInstancePropsToCloudFormation(props);
  }
}

export namespace CfnApplicationInstance {
  /**
   * Parameter overrides for an application instance.
   *
   * This is a JSON document that has a single key ( `PayloadData` ) where the value is an escaped string representation of the overrides document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestoverridespayload.html
   */
  export interface ManifestOverridesPayloadProperty {
    /**
     * The overrides document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestoverridespayload.html#cfn-panorama-applicationinstance-manifestoverridespayload-payloaddata
     */
    readonly payloadData?: string;
  }

  /**
   * A application verion's manifest file.
   *
   * This is a JSON document that has a single key ( `PayloadData` ) where the value is an escaped string representation of the application manifest ( `graph.json` ). This file is located in the `graphs` folder in your application source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestpayload.html
   */
  export interface ManifestPayloadProperty {
    /**
     * The application manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestpayload.html#cfn-panorama-applicationinstance-manifestpayload-payloaddata
     */
    readonly payloadData?: string;
  }
}

/**
 * Properties for defining a `CfnApplicationInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html
 */
export interface CfnApplicationInstanceProps {
  /**
   * The ID of an application instance to replace with the new instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-applicationinstanceidtoreplace
   */
  readonly applicationInstanceIdToReplace?: string;

  /**
   * The device's ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-defaultruntimecontextdevice
   */
  readonly defaultRuntimeContextDevice: string;

  /**
   * A description for the application instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-description
   */
  readonly description?: string;

  /**
   * Setting overrides for the application manifest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestoverridespayload
   */
  readonly manifestOverridesPayload?: cdk.IResolvable | CfnApplicationInstance.ManifestOverridesPayloadProperty;

  /**
   * The application's manifest document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestpayload
   */
  readonly manifestPayload: cdk.IResolvable | CfnApplicationInstance.ManifestPayloadProperty;

  /**
   * A name for the application instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-name
   */
  readonly name?: string;

  /**
   * The ARN of a runtime role for the application instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-runtimerolearn
   */
  readonly runtimeRoleArn?: string;

  /**
   * Tags for the application instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ManifestOverridesPayloadProperty`
 *
 * @param properties - the TypeScript properties of a `ManifestOverridesPayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInstanceManifestOverridesPayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payloadData", cdk.validateString)(properties.payloadData));
  return errors.wrap("supplied properties not correct for \"ManifestOverridesPayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInstanceManifestOverridesPayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInstanceManifestOverridesPayloadPropertyValidator(properties).assertSuccess();
  return {
    "PayloadData": cdk.stringToCloudFormation(properties.payloadData)
  };
}

// @ts-ignore TS6133
function CfnApplicationInstanceManifestOverridesPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationInstance.ManifestOverridesPayloadProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationInstance.ManifestOverridesPayloadProperty>();
  ret.addPropertyResult("payloadData", "PayloadData", (properties.PayloadData != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManifestPayloadProperty`
 *
 * @param properties - the TypeScript properties of a `ManifestPayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInstanceManifestPayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payloadData", cdk.validateString)(properties.payloadData));
  return errors.wrap("supplied properties not correct for \"ManifestPayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInstanceManifestPayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInstanceManifestPayloadPropertyValidator(properties).assertSuccess();
  return {
    "PayloadData": cdk.stringToCloudFormation(properties.payloadData)
  };
}

// @ts-ignore TS6133
function CfnApplicationInstanceManifestPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationInstance.ManifestPayloadProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationInstance.ManifestPayloadProperty>();
  ret.addPropertyResult("payloadData", "PayloadData", (properties.PayloadData != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationInstanceIdToReplace", cdk.validateString)(properties.applicationInstanceIdToReplace));
  errors.collect(cdk.propertyValidator("defaultRuntimeContextDevice", cdk.requiredValidator)(properties.defaultRuntimeContextDevice));
  errors.collect(cdk.propertyValidator("defaultRuntimeContextDevice", cdk.validateString)(properties.defaultRuntimeContextDevice));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("manifestOverridesPayload", CfnApplicationInstanceManifestOverridesPayloadPropertyValidator)(properties.manifestOverridesPayload));
  errors.collect(cdk.propertyValidator("manifestPayload", cdk.requiredValidator)(properties.manifestPayload));
  errors.collect(cdk.propertyValidator("manifestPayload", CfnApplicationInstanceManifestPayloadPropertyValidator)(properties.manifestPayload));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("runtimeRoleArn", cdk.validateString)(properties.runtimeRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInstancePropsValidator(properties).assertSuccess();
  return {
    "ApplicationInstanceIdToReplace": cdk.stringToCloudFormation(properties.applicationInstanceIdToReplace),
    "DefaultRuntimeContextDevice": cdk.stringToCloudFormation(properties.defaultRuntimeContextDevice),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ManifestOverridesPayload": convertCfnApplicationInstanceManifestOverridesPayloadPropertyToCloudFormation(properties.manifestOverridesPayload),
    "ManifestPayload": convertCfnApplicationInstanceManifestPayloadPropertyToCloudFormation(properties.manifestPayload),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuntimeRoleArn": cdk.stringToCloudFormation(properties.runtimeRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnApplicationInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationInstanceProps>();
  ret.addPropertyResult("applicationInstanceIdToReplace", "ApplicationInstanceIdToReplace", (properties.ApplicationInstanceIdToReplace != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationInstanceIdToReplace) : undefined));
  ret.addPropertyResult("defaultRuntimeContextDevice", "DefaultRuntimeContextDevice", (properties.DefaultRuntimeContextDevice != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRuntimeContextDevice) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("manifestOverridesPayload", "ManifestOverridesPayload", (properties.ManifestOverridesPayload != null ? CfnApplicationInstanceManifestOverridesPayloadPropertyFromCloudFormation(properties.ManifestOverridesPayload) : undefined));
  ret.addPropertyResult("manifestPayload", "ManifestPayload", (properties.ManifestPayload != null ? CfnApplicationInstanceManifestPayloadPropertyFromCloudFormation(properties.ManifestPayload) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("runtimeRoleArn", "RuntimeRoleArn", (properties.RuntimeRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a package and storage location in an Amazon S3 access point.
 *
 * @cloudformationResource AWS::Panorama::Package
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html
 */
export class CfnPackage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Panorama::Package";

  /**
   * Build a CfnPackage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPackagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPackage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The package's ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the package was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: number;

  /**
   * The package's ID.
   *
   * @cloudformationAttribute PackageId
   */
  public readonly attrPackageId: string;

  /**
   * @cloudformationAttribute StorageLocation.BinaryPrefixLocation
   */
  public readonly attrStorageLocationBinaryPrefixLocation: string;

  /**
   * @cloudformationAttribute StorageLocation.Bucket
   */
  public readonly attrStorageLocationBucket: string;

  /**
   * @cloudformationAttribute StorageLocation.GeneratedPrefixLocation
   */
  public readonly attrStorageLocationGeneratedPrefixLocation: string;

  /**
   * @cloudformationAttribute StorageLocation.ManifestPrefixLocation
   */
  public readonly attrStorageLocationManifestPrefixLocation: string;

  /**
   * @cloudformationAttribute StorageLocation.RepoPrefixLocation
   */
  public readonly attrStorageLocationRepoPrefixLocation: string;

  /**
   * A name for the package.
   */
  public packageName: string;

  /**
   * A storage location.
   */
  public storageLocation?: cdk.IResolvable | CfnPackage.StorageLocationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the package.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPackageProps) {
    super(scope, id, {
      "type": CfnPackage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "packageName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asNumber(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrPackageId = cdk.Token.asString(this.getAtt("PackageId", cdk.ResolutionTypeHint.STRING));
    this.attrStorageLocationBinaryPrefixLocation = cdk.Token.asString(this.getAtt("StorageLocation.BinaryPrefixLocation", cdk.ResolutionTypeHint.STRING));
    this.attrStorageLocationBucket = cdk.Token.asString(this.getAtt("StorageLocation.Bucket", cdk.ResolutionTypeHint.STRING));
    this.attrStorageLocationGeneratedPrefixLocation = cdk.Token.asString(this.getAtt("StorageLocation.GeneratedPrefixLocation", cdk.ResolutionTypeHint.STRING));
    this.attrStorageLocationManifestPrefixLocation = cdk.Token.asString(this.getAtt("StorageLocation.ManifestPrefixLocation", cdk.ResolutionTypeHint.STRING));
    this.attrStorageLocationRepoPrefixLocation = cdk.Token.asString(this.getAtt("StorageLocation.RepoPrefixLocation", cdk.ResolutionTypeHint.STRING));
    this.packageName = props.packageName;
    this.storageLocation = props.storageLocation;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Panorama::Package", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "packageName": this.packageName,
      "storageLocation": this.storageLocation,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPackagePropsToCloudFormation(props);
  }
}

export namespace CfnPackage {
  /**
   * A storage location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html
   */
  export interface StorageLocationProperty {
    /**
     * The location's binary prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-binaryprefixlocation
     */
    readonly binaryPrefixLocation?: string;

    /**
     * The location's bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-bucket
     */
    readonly bucket?: string;

    /**
     * The location's generated prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-generatedprefixlocation
     */
    readonly generatedPrefixLocation?: string;

    /**
     * The location's manifest prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-manifestprefixlocation
     */
    readonly manifestPrefixLocation?: string;

    /**
     * The location's repo prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-repoprefixlocation
     */
    readonly repoPrefixLocation?: string;
  }
}

/**
 * Properties for defining a `CfnPackage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html
 */
export interface CfnPackageProps {
  /**
   * A name for the package.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-packagename
   */
  readonly packageName: string;

  /**
   * A storage location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-storagelocation
   */
  readonly storageLocation?: cdk.IResolvable | CfnPackage.StorageLocationProperty;

  /**
   * Tags for the package.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `StorageLocationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackageStorageLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("binaryPrefixLocation", cdk.validateString)(properties.binaryPrefixLocation));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("generatedPrefixLocation", cdk.validateString)(properties.generatedPrefixLocation));
  errors.collect(cdk.propertyValidator("manifestPrefixLocation", cdk.validateString)(properties.manifestPrefixLocation));
  errors.collect(cdk.propertyValidator("repoPrefixLocation", cdk.validateString)(properties.repoPrefixLocation));
  return errors.wrap("supplied properties not correct for \"StorageLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackageStorageLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackageStorageLocationPropertyValidator(properties).assertSuccess();
  return {
    "BinaryPrefixLocation": cdk.stringToCloudFormation(properties.binaryPrefixLocation),
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "GeneratedPrefixLocation": cdk.stringToCloudFormation(properties.generatedPrefixLocation),
    "ManifestPrefixLocation": cdk.stringToCloudFormation(properties.manifestPrefixLocation),
    "RepoPrefixLocation": cdk.stringToCloudFormation(properties.repoPrefixLocation)
  };
}

// @ts-ignore TS6133
function CfnPackageStorageLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackage.StorageLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackage.StorageLocationProperty>();
  ret.addPropertyResult("binaryPrefixLocation", "BinaryPrefixLocation", (properties.BinaryPrefixLocation != null ? cfn_parse.FromCloudFormation.getString(properties.BinaryPrefixLocation) : undefined));
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("generatedPrefixLocation", "GeneratedPrefixLocation", (properties.GeneratedPrefixLocation != null ? cfn_parse.FromCloudFormation.getString(properties.GeneratedPrefixLocation) : undefined));
  ret.addPropertyResult("manifestPrefixLocation", "ManifestPrefixLocation", (properties.ManifestPrefixLocation != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestPrefixLocation) : undefined));
  ret.addPropertyResult("repoPrefixLocation", "RepoPrefixLocation", (properties.RepoPrefixLocation != null ? cfn_parse.FromCloudFormation.getString(properties.RepoPrefixLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPackageProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("packageName", cdk.requiredValidator)(properties.packageName));
  errors.collect(cdk.propertyValidator("packageName", cdk.validateString)(properties.packageName));
  errors.collect(cdk.propertyValidator("storageLocation", CfnPackageStorageLocationPropertyValidator)(properties.storageLocation));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPackageProps\"");
}

// @ts-ignore TS6133
function convertCfnPackagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagePropsValidator(properties).assertSuccess();
  return {
    "PackageName": cdk.stringToCloudFormation(properties.packageName),
    "StorageLocation": convertCfnPackageStorageLocationPropertyToCloudFormation(properties.storageLocation),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPackagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackageProps>();
  ret.addPropertyResult("packageName", "PackageName", (properties.PackageName != null ? cfn_parse.FromCloudFormation.getString(properties.PackageName) : undefined));
  ret.addPropertyResult("storageLocation", "StorageLocation", (properties.StorageLocation != null ? CfnPackageStorageLocationPropertyFromCloudFormation(properties.StorageLocation) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers a package version.
 *
 * @cloudformationResource AWS::Panorama::PackageVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html
 */
export class CfnPackageVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Panorama::PackageVersion";

  /**
   * Build a CfnPackageVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackageVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPackageVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPackageVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Whether the package version is the latest version.
   *
   * @cloudformationAttribute IsLatestPatch
   */
  public readonly attrIsLatestPatch: cdk.IResolvable;

  /**
   * The package version's ARN.
   *
   * @cloudformationAttribute PackageArn
   */
  public readonly attrPackageArn: string;

  /**
   * The package version's name.
   *
   * @cloudformationAttribute PackageName
   */
  public readonly attrPackageName: string;

  /**
   * The package version's registered time.
   *
   * @cloudformationAttribute RegisteredTime
   */
  public readonly attrRegisteredTime: number;

  /**
   * The package version's status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The package version's status description.
   *
   * @cloudformationAttribute StatusDescription
   */
  public readonly attrStatusDescription: string;

  /**
   * Whether to mark the new version as the latest version.
   */
  public markLatest?: boolean | cdk.IResolvable;

  /**
   * An owner account.
   */
  public ownerAccount?: string;

  /**
   * A package ID.
   */
  public packageId: string;

  /**
   * A package version.
   */
  public packageVersion: string;

  /**
   * A patch version.
   */
  public patchVersion: string;

  /**
   * If the version was marked latest, the new version to maker as latest.
   */
  public updatedLatestPatchVersion?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPackageVersionProps) {
    super(scope, id, {
      "type": CfnPackageVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "packageId", this);
    cdk.requireProperty(props, "packageVersion", this);
    cdk.requireProperty(props, "patchVersion", this);

    this.attrIsLatestPatch = this.getAtt("IsLatestPatch");
    this.attrPackageArn = cdk.Token.asString(this.getAtt("PackageArn", cdk.ResolutionTypeHint.STRING));
    this.attrPackageName = cdk.Token.asString(this.getAtt("PackageName", cdk.ResolutionTypeHint.STRING));
    this.attrRegisteredTime = cdk.Token.asNumber(this.getAtt("RegisteredTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusDescription = cdk.Token.asString(this.getAtt("StatusDescription", cdk.ResolutionTypeHint.STRING));
    this.markLatest = props.markLatest;
    this.ownerAccount = props.ownerAccount;
    this.packageId = props.packageId;
    this.packageVersion = props.packageVersion;
    this.patchVersion = props.patchVersion;
    this.updatedLatestPatchVersion = props.updatedLatestPatchVersion;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "markLatest": this.markLatest,
      "ownerAccount": this.ownerAccount,
      "packageId": this.packageId,
      "packageVersion": this.packageVersion,
      "patchVersion": this.patchVersion,
      "updatedLatestPatchVersion": this.updatedLatestPatchVersion
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackageVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPackageVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPackageVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html
 */
export interface CfnPackageVersionProps {
  /**
   * Whether to mark the new version as the latest version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-marklatest
   */
  readonly markLatest?: boolean | cdk.IResolvable;

  /**
   * An owner account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-owneraccount
   */
  readonly ownerAccount?: string;

  /**
   * A package ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageid
   */
  readonly packageId: string;

  /**
   * A package version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageversion
   */
  readonly packageVersion: string;

  /**
   * A patch version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-patchversion
   */
  readonly patchVersion: string;

  /**
   * If the version was marked latest, the new version to maker as latest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-updatedlatestpatchversion
   */
  readonly updatedLatestPatchVersion?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPackageVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackageVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackageVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("markLatest", cdk.validateBoolean)(properties.markLatest));
  errors.collect(cdk.propertyValidator("ownerAccount", cdk.validateString)(properties.ownerAccount));
  errors.collect(cdk.propertyValidator("packageId", cdk.requiredValidator)(properties.packageId));
  errors.collect(cdk.propertyValidator("packageId", cdk.validateString)(properties.packageId));
  errors.collect(cdk.propertyValidator("packageVersion", cdk.requiredValidator)(properties.packageVersion));
  errors.collect(cdk.propertyValidator("packageVersion", cdk.validateString)(properties.packageVersion));
  errors.collect(cdk.propertyValidator("patchVersion", cdk.requiredValidator)(properties.patchVersion));
  errors.collect(cdk.propertyValidator("patchVersion", cdk.validateString)(properties.patchVersion));
  errors.collect(cdk.propertyValidator("updatedLatestPatchVersion", cdk.validateString)(properties.updatedLatestPatchVersion));
  return errors.wrap("supplied properties not correct for \"CfnPackageVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnPackageVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackageVersionPropsValidator(properties).assertSuccess();
  return {
    "MarkLatest": cdk.booleanToCloudFormation(properties.markLatest),
    "OwnerAccount": cdk.stringToCloudFormation(properties.ownerAccount),
    "PackageId": cdk.stringToCloudFormation(properties.packageId),
    "PackageVersion": cdk.stringToCloudFormation(properties.packageVersion),
    "PatchVersion": cdk.stringToCloudFormation(properties.patchVersion),
    "UpdatedLatestPatchVersion": cdk.stringToCloudFormation(properties.updatedLatestPatchVersion)
  };
}

// @ts-ignore TS6133
function CfnPackageVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackageVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackageVersionProps>();
  ret.addPropertyResult("markLatest", "MarkLatest", (properties.MarkLatest != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MarkLatest) : undefined));
  ret.addPropertyResult("ownerAccount", "OwnerAccount", (properties.OwnerAccount != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerAccount) : undefined));
  ret.addPropertyResult("packageId", "PackageId", (properties.PackageId != null ? cfn_parse.FromCloudFormation.getString(properties.PackageId) : undefined));
  ret.addPropertyResult("packageVersion", "PackageVersion", (properties.PackageVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PackageVersion) : undefined));
  ret.addPropertyResult("patchVersion", "PatchVersion", (properties.PatchVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PatchVersion) : undefined));
  ret.addPropertyResult("updatedLatestPatchVersion", "UpdatedLatestPatchVersion", (properties.UpdatedLatestPatchVersion != null ? cfn_parse.FromCloudFormation.getString(properties.UpdatedLatestPatchVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}