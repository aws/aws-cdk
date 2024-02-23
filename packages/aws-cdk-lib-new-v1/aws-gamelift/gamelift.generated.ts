/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::GameLift::Alias` resource creates an alias for an Amazon GameLift (GameLift) fleet destination.
 *
 * There are two types of routing strategies for aliases: simple and terminal. A simple alias points to an active fleet. A terminal alias displays a message instead of routing players to an active fleet. For example, a terminal alias might display a URL link that directs players to an upgrade site. You can use aliases to define destinations in a game session queue or when requesting new game sessions.
 *
 * @cloudformationResource AWS::GameLift::Alias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html
 */
export class CfnAlias extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::Alias";

  /**
   * Build a CfnAlias from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlias {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAliasPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the alias. For example, `arn:aws:gamelift:us-west-1::alias/alias-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912`
   *
   * Alias IDs are unique within a Region.
   *
   * @cloudformationAttribute AliasId
   */
  public readonly attrAliasId: string;

  /**
   * A human-readable description of the alias.
   */
  public description?: string;

  /**
   * A descriptive label that is associated with an alias.
   */
  public name: string;

  /**
   * The routing configuration, including routing type and fleet target, for the alias.
   */
  public routingStrategy: cdk.IResolvable | CfnAlias.RoutingStrategyProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAliasProps) {
    super(scope, id, {
      "type": CfnAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "routingStrategy", this);

    this.attrAliasId = cdk.Token.asString(this.getAtt("AliasId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.routingStrategy = props.routingStrategy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "routingStrategy": this.routingStrategy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAliasPropsToCloudFormation(props);
  }
}

export namespace CfnAlias {
  /**
   * The routing configuration for a fleet alias.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-alias-routingstrategy.html
   */
  export interface RoutingStrategyProperty {
    /**
     * A unique identifier for a fleet that the alias points to.
     *
     * If you specify `SIMPLE` for the `Type` property, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-alias-routingstrategy.html#cfn-gamelift-alias-routingstrategy-fleetid
     */
    readonly fleetId?: string;

    /**
     * The message text to be used with a terminal routing strategy.
     *
     * If you specify `TERMINAL` for the `Type` property, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-alias-routingstrategy.html#cfn-gamelift-alias-routingstrategy-message
     */
    readonly message?: string;

    /**
     * A type of routing strategy.
     *
     * Possible routing types include the following:
     *
     * - *SIMPLE* - The alias resolves to one specific fleet. Use this type when routing to active fleets.
     * - *TERMINAL* - The alias does not resolve to a fleet but instead can be used to display a message to the user. A terminal alias throws a `TerminalRoutingStrategyException` with the message that you specified in the `Message` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-alias-routingstrategy.html#cfn-gamelift-alias-routingstrategy-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html
 */
export interface CfnAliasProps {
  /**
   * A human-readable description of the alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-description
   */
  readonly description?: string;

  /**
   * A descriptive label that is associated with an alias.
   *
   * Alias names do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-name
   */
  readonly name: string;

  /**
   * The routing configuration, including routing type and fleet target, for the alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-routingstrategy
   */
  readonly routingStrategy: cdk.IResolvable | CfnAlias.RoutingStrategyProperty;
}

/**
 * Determine whether the given properties match those of a `RoutingStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasRoutingStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fleetId", cdk.validateString)(properties.fleetId));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"RoutingStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAliasRoutingStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasRoutingStrategyPropertyValidator(properties).assertSuccess();
  return {
    "FleetId": cdk.stringToCloudFormation(properties.fleetId),
    "Message": cdk.stringToCloudFormation(properties.message),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAliasRoutingStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlias.RoutingStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlias.RoutingStrategyProperty>();
  ret.addPropertyResult("fleetId", "FleetId", (properties.FleetId != null ? cfn_parse.FromCloudFormation.getString(properties.FleetId) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("routingStrategy", cdk.requiredValidator)(properties.routingStrategy));
  errors.collect(cdk.propertyValidator("routingStrategy", CfnAliasRoutingStrategyPropertyValidator)(properties.routingStrategy));
  return errors.wrap("supplied properties not correct for \"CfnAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoutingStrategy": convertCfnAliasRoutingStrategyPropertyToCloudFormation(properties.routingStrategy)
  };
}

// @ts-ignore TS6133
function CfnAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAliasProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("routingStrategy", "RoutingStrategy", (properties.RoutingStrategy != null ? CfnAliasRoutingStrategyPropertyFromCloudFormation(properties.RoutingStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GameLift::Build` resource creates a game server build that is installed and run on instances in an Amazon GameLift fleet.
 *
 * This resource points to an Amazon S3 location that contains a zip file with all of the components of the game server build.
 *
 * @cloudformationResource AWS::GameLift::Build
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html
 */
export class CfnBuild extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::Build";

  /**
   * Build a CfnBuild from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBuild {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBuildPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBuild(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the build.
   *
   * @cloudformationAttribute BuildId
   */
  public readonly attrBuildId: string;

  /**
   * A descriptive label that is associated with a build.
   */
  public name?: string;

  /**
   * The operating system that your game server binaries run on.
   */
  public operatingSystem?: string;

  /**
   * A server SDK version you used when integrating your game server build with Amazon GameLift.
   */
  public serverSdkVersion?: string;

  /**
   * Information indicating where your game build files are stored.
   */
  public storageLocation?: cdk.IResolvable | CfnBuild.StorageLocationProperty;

  /**
   * Version information that is associated with this build.
   */
  public version?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBuildProps = {}) {
    super(scope, id, {
      "type": CfnBuild.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrBuildId = cdk.Token.asString(this.getAtt("BuildId", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.operatingSystem = props.operatingSystem;
    this.serverSdkVersion = props.serverSdkVersion;
    this.storageLocation = props.storageLocation;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "operatingSystem": this.operatingSystem,
      "serverSdkVersion": this.serverSdkVersion,
      "storageLocation": this.storageLocation,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBuild.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBuildPropsToCloudFormation(props);
  }
}

export namespace CfnBuild {
  /**
   * The location in Amazon S3 where build or script files are stored for access by Amazon GameLift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html
   */
  export interface StorageLocationProperty {
    /**
     * An Amazon S3 bucket identifier. The name of the S3 bucket.
     *
     * > Amazon GameLift doesn't support uploading from Amazon S3 buckets with names that contain a dot (.).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storagelocation-bucket
     */
    readonly bucket: string;

    /**
     * The name of the zip file that contains the build files or script files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storagelocation-key
     */
    readonly key: string;

    /**
     * A version of a stored file to retrieve, if the object versioning feature is turned on for the S3 bucket.
     *
     * Use this parameter to specify a specific version. If this parameter isn't set, Amazon GameLift retrieves the latest version of the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storagelocation-objectversion
     */
    readonly objectVersion?: string;

    /**
     * The ARNfor an IAM role that allows Amazon GameLift to access the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-build-storagelocation.html#cfn-gamelift-build-storagelocation-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnBuild`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html
 */
export interface CfnBuildProps {
  /**
   * A descriptive label that is associated with a build.
   *
   * Build names do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-name
   */
  readonly name?: string;

  /**
   * The operating system that your game server binaries run on.
   *
   * This value determines the type of fleet resources that you use for this build. If your game build contains multiple executables, they all must run on the same operating system. You must specify a valid operating system in this request. There is no default value. You can't change a build's operating system later.
   *
   * > If you have active fleets using the Windows Server 2012 operating system, you can continue to create new builds using this OS until October 10, 2023, when Microsoft ends its support. All others must use Windows Server 2016 when creating new Windows-based builds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-operatingsystem
   */
  readonly operatingSystem?: string;

  /**
   * A server SDK version you used when integrating your game server build with Amazon GameLift.
   *
   * For more information see [Integrate games with custom game servers](https://docs.aws.amazon.com/gamelift/latest/developerguide/integration-custom-intro.html) . By default Amazon GameLift sets this value to `4.0.2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-serversdkversion
   */
  readonly serverSdkVersion?: string;

  /**
   * Information indicating where your game build files are stored.
   *
   * Use this parameter only when creating a build with files stored in an Amazon S3 bucket that you own. The storage location must specify an Amazon S3 bucket name and key. The location must also specify a role ARN that you set up to allow Amazon GameLift to access your Amazon S3 bucket. The S3 bucket and your new build must be in the same Region.
   *
   * If a `StorageLocation` is specified, the size of your file can be found in your Amazon S3 bucket. Amazon GameLift will report a `SizeOnDisk` of 0.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-storagelocation
   */
  readonly storageLocation?: cdk.IResolvable | CfnBuild.StorageLocationProperty;

  /**
   * Version information that is associated with this build.
   *
   * Version strings do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `StorageLocationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBuildStorageLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("objectVersion", cdk.validateString)(properties.objectVersion));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"StorageLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBuildStorageLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBuildStorageLocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "ObjectVersion": cdk.stringToCloudFormation(properties.objectVersion),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnBuildStorageLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBuild.StorageLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBuild.StorageLocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("objectVersion", "ObjectVersion", (properties.ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersion) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBuildProps`
 *
 * @param properties - the TypeScript properties of a `CfnBuildProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBuildPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("operatingSystem", cdk.validateString)(properties.operatingSystem));
  errors.collect(cdk.propertyValidator("serverSdkVersion", cdk.validateString)(properties.serverSdkVersion));
  errors.collect(cdk.propertyValidator("storageLocation", CfnBuildStorageLocationPropertyValidator)(properties.storageLocation));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnBuildProps\"");
}

// @ts-ignore TS6133
function convertCfnBuildPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBuildPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "OperatingSystem": cdk.stringToCloudFormation(properties.operatingSystem),
    "ServerSdkVersion": cdk.stringToCloudFormation(properties.serverSdkVersion),
    "StorageLocation": convertCfnBuildStorageLocationPropertyToCloudFormation(properties.storageLocation),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnBuildPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBuildProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBuildProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("operatingSystem", "OperatingSystem", (properties.OperatingSystem != null ? cfn_parse.FromCloudFormation.getString(properties.OperatingSystem) : undefined));
  ret.addPropertyResult("serverSdkVersion", "ServerSdkVersion", (properties.ServerSdkVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ServerSdkVersion) : undefined));
  ret.addPropertyResult("storageLocation", "StorageLocation", (properties.StorageLocation != null ? CfnBuildStorageLocationPropertyFromCloudFormation(properties.StorageLocation) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GameLift::Fleet` resource creates an Amazon GameLift (GameLift) fleet to host custom game server or Realtime Servers.
 *
 * A fleet is a set of EC2 instances, configured with instructions to run game servers on each instance.
 *
 * @cloudformationResource AWS::GameLift::Fleet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::Fleet";

  /**
   * Build a CfnFleet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFleet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the fleet.
   *
   * @cloudformationAttribute FleetId
   */
  public readonly attrFleetId: string;

  /**
   * Amazon GameLift Anywhere configuration options.
   */
  public anywhereConfiguration?: CfnFleet.AnywhereConfigurationProperty | cdk.IResolvable;

  /**
   * Current resource capacity settings in a specified fleet or location.
   */
  public applyCapacity?: string;

  /**
   * A unique identifier for a build to be deployed on the new fleet.
   */
  public buildId?: string;

  /**
   * Prompts Amazon GameLift to generate a TLS/SSL certificate for the fleet.
   */
  public certificateConfiguration?: CfnFleet.CertificateConfigurationProperty | cdk.IResolvable;

  /**
   * The type of compute resource used to host your game servers.
   */
  public computeType?: string;

  /**
   * A description for the fleet.
   */
  public description?: string;

  /**
   * The number of EC2 instances that you want this fleet to host.
   */
  public desiredEc2Instances?: number;

  /**
   * The allowed IP address ranges and port settings that allow inbound traffic to access game sessions on this fleet.
   */
  public ec2InboundPermissions?: Array<CfnFleet.IpPermissionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon GameLift-supported Amazon EC2 instance type to use for all fleet instances.
   */
  public ec2InstanceType?: string;

  /**
   * Indicates whether to use On-Demand or Spot instances for this fleet.
   */
  public fleetType?: string;

  /**
   * A unique identifier for an IAM role with access permissions to other AWS services.
   */
  public instanceRoleArn?: string;

  /**
   * Indicates that fleet instances maintain a shared credentials file for the IAM role defined in `InstanceRoleArn` .
   */
  public instanceRoleCredentialsProvider?: string;

  /**
   * A set of remote locations to deploy additional instances to and manage as part of the fleet.
   */
  public locations?: Array<cdk.IResolvable | CfnFleet.LocationConfigurationProperty> | cdk.IResolvable;

  /**
   * This parameter is no longer used.
   *
   * @deprecated this property has been deprecated
   */
  public logPaths?: Array<string>;

  /**
   * The maximum number of instances that are allowed in the specified fleet location.
   */
  public maxSize?: number;

  /**
   * The name of an AWS CloudWatch metric group to add this fleet to.
   */
  public metricGroups?: Array<string>;

  /**
   * The minimum number of instances that are allowed in the specified fleet location.
   */
  public minSize?: number;

  /**
   * A descriptive label that is associated with a fleet.
   */
  public name: string;

  /**
   * The status of termination protection for active game sessions on the fleet.
   */
  public newGameSessionProtectionPolicy?: string;

  /**
   * Used when peering your Amazon GameLift fleet with a VPC, the unique identifier for the AWS account that owns the VPC.
   */
  public peerVpcAwsAccountId?: string;

  /**
   * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet.
   */
  public peerVpcId?: string;

  /**
   * A policy that limits the number of game sessions that an individual player can create on instances in this fleet within a specified span of time.
   */
  public resourceCreationLimitPolicy?: cdk.IResolvable | CfnFleet.ResourceCreationLimitPolicyProperty;

  /**
   * Instructions for how to launch and maintain server processes on instances in the fleet.
   */
  public runtimeConfiguration?: cdk.IResolvable | CfnFleet.RuntimeConfigurationProperty;

  /**
   * Rule that controls how a fleet is scaled.
   */
  public scalingPolicies?: Array<cdk.IResolvable | CfnFleet.ScalingPolicyProperty> | cdk.IResolvable;

  /**
   * The unique identifier for a Realtime configuration script to be deployed on fleet instances.
   */
  public scriptId?: string;

  /**
   * This parameter is no longer used but is retained for backward compatibility.
   *
   * @deprecated this property has been deprecated
   */
  public serverLaunchParameters?: string;

  /**
   * This parameter is no longer used.
   *
   * @deprecated this property has been deprecated
   */
  public serverLaunchPath?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFleetProps) {
    super(scope, id, {
      "type": CfnFleet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrFleetId = cdk.Token.asString(this.getAtt("FleetId", cdk.ResolutionTypeHint.STRING));
    this.anywhereConfiguration = props.anywhereConfiguration;
    this.applyCapacity = props.applyCapacity;
    this.buildId = props.buildId;
    this.certificateConfiguration = props.certificateConfiguration;
    this.computeType = props.computeType;
    this.description = props.description;
    this.desiredEc2Instances = props.desiredEc2Instances;
    this.ec2InboundPermissions = props.ec2InboundPermissions;
    this.ec2InstanceType = props.ec2InstanceType;
    this.fleetType = props.fleetType;
    this.instanceRoleArn = props.instanceRoleArn;
    this.instanceRoleCredentialsProvider = props.instanceRoleCredentialsProvider;
    this.locations = props.locations;
    this.logPaths = props.logPaths;
    this.maxSize = props.maxSize;
    this.metricGroups = props.metricGroups;
    this.minSize = props.minSize;
    this.name = props.name;
    this.newGameSessionProtectionPolicy = props.newGameSessionProtectionPolicy;
    this.peerVpcAwsAccountId = props.peerVpcAwsAccountId;
    this.peerVpcId = props.peerVpcId;
    this.resourceCreationLimitPolicy = props.resourceCreationLimitPolicy;
    this.runtimeConfiguration = props.runtimeConfiguration;
    this.scalingPolicies = props.scalingPolicies;
    this.scriptId = props.scriptId;
    this.serverLaunchParameters = props.serverLaunchParameters;
    this.serverLaunchPath = props.serverLaunchPath;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "anywhereConfiguration": this.anywhereConfiguration,
      "applyCapacity": this.applyCapacity,
      "buildId": this.buildId,
      "certificateConfiguration": this.certificateConfiguration,
      "computeType": this.computeType,
      "description": this.description,
      "desiredEc2Instances": this.desiredEc2Instances,
      "ec2InboundPermissions": this.ec2InboundPermissions,
      "ec2InstanceType": this.ec2InstanceType,
      "fleetType": this.fleetType,
      "instanceRoleArn": this.instanceRoleArn,
      "instanceRoleCredentialsProvider": this.instanceRoleCredentialsProvider,
      "locations": this.locations,
      "logPaths": this.logPaths,
      "maxSize": this.maxSize,
      "metricGroups": this.metricGroups,
      "minSize": this.minSize,
      "name": this.name,
      "newGameSessionProtectionPolicy": this.newGameSessionProtectionPolicy,
      "peerVpcAwsAccountId": this.peerVpcAwsAccountId,
      "peerVpcId": this.peerVpcId,
      "resourceCreationLimitPolicy": this.resourceCreationLimitPolicy,
      "runtimeConfiguration": this.runtimeConfiguration,
      "scalingPolicies": this.scalingPolicies,
      "scriptId": this.scriptId,
      "serverLaunchParameters": this.serverLaunchParameters,
      "serverLaunchPath": this.serverLaunchPath
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFleetPropsToCloudFormation(props);
  }
}

export namespace CfnFleet {
  /**
   * A range of IP addresses and port settings that allow inbound traffic to connect to server processes on an instance in a fleet.
   *
   * New game sessions are assigned an IP address/port number combination, which must fall into the fleet's allowed ranges. Fleets with custom game builds must have permissions explicitly set. For Realtime Servers fleets, GameLift automatically opens two port ranges, one for TCP messaging and one for UDP.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-ippermission.html
   */
  export interface IpPermissionProperty {
    /**
     * A starting value for a range of allowed port numbers.
     *
     * For fleets using Linux builds, only ports `22` and `1026-60000` are valid.
     *
     * For fleets using Windows builds, only ports `1026-60000` are valid.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-ippermission.html#cfn-gamelift-fleet-ippermission-fromport
     */
    readonly fromPort: number;

    /**
     * A range of allowed IP addresses.
     *
     * This value must be expressed in CIDR notation. Example: " `000.000.000.000/[subnet mask]` " or optionally the shortened version " `0.0.0.0/[subnet mask]` ".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-ippermission.html#cfn-gamelift-fleet-ippermission-iprange
     */
    readonly ipRange: string;

    /**
     * The network communication protocol used by the fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-ippermission.html#cfn-gamelift-fleet-ippermission-protocol
     */
    readonly protocol: string;

    /**
     * An ending value for a range of allowed port numbers.
     *
     * Port numbers are end-inclusive. This value must be equal to or greater than `FromPort` .
     *
     * For fleets using Linux builds, only ports `22` and `1026-60000` are valid.
     *
     * For fleets using Windows builds, only ports `1026-60000` are valid.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-ippermission.html#cfn-gamelift-fleet-ippermission-toport
     */
    readonly toPort: number;
  }

  /**
   * A remote location where a multi-location fleet can deploy game servers for game hosting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationconfiguration.html
   */
  export interface LocationConfigurationProperty {
    /**
     * An AWS Region code, such as `us-west-2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationconfiguration.html#cfn-gamelift-fleet-locationconfiguration-location
     */
    readonly location: string;

    /**
     * Current resource capacity settings in a specified fleet or location.
     *
     * The location value might refer to a fleet's remote location or its home Region.
     *
     * *Related actions*
     *
     * [DescribeFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetCapacity.html) | [DescribeFleetLocationCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetLocationCapacity.html) | [UpdateFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_UpdateFleetCapacity.html)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationconfiguration.html#cfn-gamelift-fleet-locationconfiguration-locationcapacity
     */
    readonly locationCapacity?: cdk.IResolvable | CfnFleet.LocationCapacityProperty;
  }

  /**
   * Current resource capacity settings in a specified fleet or location.
   *
   * The location value might refer to a fleet's remote location or its home Region.
   *
   * *Related actions*
   *
   * [DescribeFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetCapacity.html) | [DescribeFleetLocationCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetLocationCapacity.html) | [UpdateFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_UpdateFleetCapacity.html)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationcapacity.html
   */
  export interface LocationCapacityProperty {
    /**
     * The number of Amazon EC2 instances you want to maintain in the specified fleet location.
     *
     * This value must fall between the minimum and maximum size limits. Changes in desired instance value can take up to 1 minute to be reflected when viewing the fleet's capacity settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationcapacity.html#cfn-gamelift-fleet-locationcapacity-desiredec2instances
     */
    readonly desiredEc2Instances: number;

    /**
     * The maximum number of instances that are allowed in the specified fleet location.
     *
     * If this parameter is not set, the default is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationcapacity.html#cfn-gamelift-fleet-locationcapacity-maxsize
     */
    readonly maxSize: number;

    /**
     * The minimum number of instances that are allowed in the specified fleet location.
     *
     * If this parameter is not set, the default is 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-locationcapacity.html#cfn-gamelift-fleet-locationcapacity-minsize
     */
    readonly minSize: number;
  }

  /**
   * A collection of server process configurations that describe the set of processes to run on each instance in a fleet.
   *
   * Server processes run either an executable in a custom game build or a Realtime Servers script. GameLift launches the configured processes, manages their life cycle, and replaces them as needed. Each instance checks regularly for an updated runtime configuration.
   *
   * A GameLift instance is limited to 50 processes running concurrently. To calculate the total number of processes in a runtime configuration, add the values of the `ConcurrentExecutions` parameter for each ServerProcess. Learn more about [Running Multiple Processes on a Fleet](https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-multiprocess.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-runtimeconfiguration.html
   */
  export interface RuntimeConfigurationProperty {
    /**
     * The maximum amount of time (in seconds) allowed to launch a new game session and have it report ready to host players.
     *
     * During this time, the game session is in status `ACTIVATING` . If the game session does not become active before the timeout, it is ended and the game session status is changed to `TERMINATED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-runtimeconfiguration.html#cfn-gamelift-fleet-runtimeconfiguration-gamesessionactivationtimeoutseconds
     */
    readonly gameSessionActivationTimeoutSeconds?: number;

    /**
     * The number of game sessions in status `ACTIVATING` to allow on an instance.
     *
     * This setting limits the instance resources that can be used for new game activations at any one time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-runtimeconfiguration.html#cfn-gamelift-fleet-runtimeconfiguration-maxconcurrentgamesessionactivations
     */
    readonly maxConcurrentGameSessionActivations?: number;

    /**
     * A collection of server process configurations that identify what server processes to run on each instance in a fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-runtimeconfiguration.html#cfn-gamelift-fleet-runtimeconfiguration-serverprocesses
     */
    readonly serverProcesses?: Array<cdk.IResolvable | CfnFleet.ServerProcessProperty> | cdk.IResolvable;
  }

  /**
   * A set of instructions for launching server processes on each instance in a fleet.
   *
   * Server processes run either an executable in a custom game build or a Realtime Servers script.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-serverprocess.html
   */
  export interface ServerProcessProperty {
    /**
     * The number of server processes using this configuration that run concurrently on each instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-serverprocess.html#cfn-gamelift-fleet-serverprocess-concurrentexecutions
     */
    readonly concurrentExecutions: number;

    /**
     * The location of a game build executable or Realtime script.
     *
     * Game builds and Realtime scripts are installed on instances at the root:
     *
     * - Windows (custom game builds only): `C:\game` . Example: " `C:\game\MyGame\server.exe` "
     * - Linux: `/local/game` . Examples: " `/local/game/MyGame/server.exe` " or " `/local/game/MyRealtimeScript.js` "
     *
     * > Amazon GameLift doesn't support the use of setup scripts that launch the game executable. For custom game builds, this parameter must indicate the executable that calls the server SDK operations `initSDK()` and `ProcessReady()` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-serverprocess.html#cfn-gamelift-fleet-serverprocess-launchpath
     */
    readonly launchPath: string;

    /**
     * An optional list of parameters to pass to the server executable or Realtime script on launch.
     *
     * Length Constraints: Minimum length of 1. Maximum length of 1024.
     *
     * Pattern: [A-Za-z0-9_:.+\/\\\- =@{},?'\[\]"]+
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-serverprocess.html#cfn-gamelift-fleet-serverprocess-parameters
     */
    readonly parameters?: string;
  }

  /**
   * Amazon GameLift Anywhere configuration options for your Anywhere fleets.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-anywhereconfiguration.html
   */
  export interface AnywhereConfigurationProperty {
    /**
     * The cost to run your fleet per hour.
     *
     * Amazon GameLift uses the provided cost of your fleet to balance usage in queues. For more information about queues, see [Setting up queues](https://docs.aws.amazon.com/gamelift/latest/developerguide/queues-intro.html) in the *Amazon GameLift Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-anywhereconfiguration.html#cfn-gamelift-fleet-anywhereconfiguration-cost
     */
    readonly cost: string;
  }

  /**
   * A policy that limits the number of game sessions a player can create on the same fleet.
   *
   * This optional policy gives game owners control over how players can consume available game server resources. A resource creation policy makes the following statement: "An individual player can create a maximum number of new game sessions within a specified time period".
   *
   * The policy is evaluated when a player tries to create a new game session. For example, assume you have a policy of 10 new game sessions and a time period of 60 minutes. On receiving a `CreateGameSession` request, Amazon GameLift checks that the player (identified by `CreatorId` ) has created fewer than 10 game sessions in the past 60 minutes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-resourcecreationlimitpolicy.html
   */
  export interface ResourceCreationLimitPolicyProperty {
    /**
     * A policy that puts limits on the number of game sessions that a player can create within a specified span of time.
     *
     * With this policy, you can control players' ability to consume available resources.
     *
     * The policy is evaluated when a player tries to create a new game session. On receiving a `CreateGameSession` request, Amazon GameLift checks that the player (identified by `CreatorId` ) has created fewer than game session limit in the specified time period.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-resourcecreationlimitpolicy.html#cfn-gamelift-fleet-resourcecreationlimitpolicy-newgamesessionspercreator
     */
    readonly newGameSessionsPerCreator?: number;

    /**
     * The time span used in evaluating the resource creation limit policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-resourcecreationlimitpolicy.html#cfn-gamelift-fleet-resourcecreationlimitpolicy-policyperiodinminutes
     */
    readonly policyPeriodInMinutes?: number;
  }

  /**
   * Determines whether a TLS/SSL certificate is generated for a fleet.
   *
   * This feature must be enabled when creating the fleet. All instances in a fleet share the same certificate. The certificate can be retrieved by calling the [GameLift Server SDK](https://docs.aws.amazon.com/gamelift/latest/developerguide/reference-serversdk.html) operation `GetInstanceCertificate` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-certificateconfiguration.html
   */
  export interface CertificateConfigurationProperty {
    /**
     * Indicates whether a TLS/SSL certificate is generated for a fleet.
     *
     * Valid values include:
     *
     * - *GENERATED* - Generate a TLS/SSL certificate for this fleet.
     * - *DISABLED* - (default) Do not generate a TLS/SSL certificate for this fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-certificateconfiguration.html#cfn-gamelift-fleet-certificateconfiguration-certificatetype
     */
    readonly certificateType: string;
  }

  /**
   * Rule that controls how a fleet is scaled.
   *
   * Scaling policies are uniquely identified by the combination of name and fleet ID.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html
   */
  export interface ScalingPolicyProperty {
    /**
     * Comparison operator to use when measuring a metric against the threshold value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-comparisonoperator
     */
    readonly comparisonOperator?: string;

    /**
     * Length of time (in minutes) the metric must be at or beyond the threshold before a scaling event is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-evaluationperiods
     */
    readonly evaluationPeriods?: number;

    /**
     * The fleet location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-location
     */
    readonly location?: string;

    /**
     * Name of the Amazon GameLift-defined metric that is used to trigger a scaling adjustment.
     *
     * For detailed descriptions of fleet metrics, see [Monitor Amazon GameLift with Amazon CloudWatch](https://docs.aws.amazon.com/gamelift/latest/developerguide/monitoring-cloudwatch.html) .
     *
     * - *ActivatingGameSessions* -- Game sessions in the process of being created.
     * - *ActiveGameSessions* -- Game sessions that are currently running.
     * - *ActiveInstances* -- Fleet instances that are currently running at least one game session.
     * - *AvailableGameSessions* -- Additional game sessions that fleet could host simultaneously, given current capacity.
     * - *AvailablePlayerSessions* -- Empty player slots in currently active game sessions. This includes game sessions that are not currently accepting players. Reserved player slots are not included.
     * - *CurrentPlayerSessions* -- Player slots in active game sessions that are being used by a player or are reserved for a player.
     * - *IdleInstances* -- Active instances that are currently hosting zero game sessions.
     * - *PercentAvailableGameSessions* -- Unused percentage of the total number of game sessions that a fleet could host simultaneously, given current capacity. Use this metric for a target-based scaling policy.
     * - *PercentIdleInstances* -- Percentage of the total number of active instances that are hosting zero game sessions.
     * - *QueueDepth* -- Pending game session placement requests, in any queue, where the current fleet is the top-priority destination.
     * - *WaitTime* -- Current wait time for pending game session placement requests, in any queue, where the current fleet is the top-priority destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-metricname
     */
    readonly metricName: string;

    /**
     * A descriptive label that is associated with a fleet's scaling policy.
     *
     * Policy names do not need to be unique.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-name
     */
    readonly name: string;

    /**
     * The type of scaling policy to create.
     *
     * For a target-based policy, set the parameter *MetricName* to 'PercentAvailableGameSessions' and specify a *TargetConfiguration* . For a rule-based policy set the following parameters: *MetricName* , *ComparisonOperator* , *Threshold* , *EvaluationPeriods* , *ScalingAdjustmentType* , and *ScalingAdjustment* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-policytype
     */
    readonly policyType?: string;

    /**
     * Amount of adjustment to make, based on the scaling adjustment type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-scalingadjustment
     */
    readonly scalingAdjustment?: number;

    /**
     * The type of adjustment to make to a fleet's instance count.
     *
     * - *ChangeInCapacity* -- add (or subtract) the scaling adjustment value from the current instance count. Positive values scale up while negative values scale down.
     * - *ExactCapacity* -- set the instance count to the scaling adjustment value.
     * - *PercentChangeInCapacity* -- increase or reduce the current instance count by the scaling adjustment, read as a percentage. Positive values scale up while negative values scale down.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-scalingadjustmenttype
     */
    readonly scalingAdjustmentType?: string;

    /**
     * Current status of the scaling policy.
     *
     * The scaling policy can be in force only when in an `ACTIVE` status. Scaling policies can be suspended for individual fleets. If the policy is suspended for a fleet, the policy status does not change.
     *
     * - *ACTIVE* -- The scaling policy can be used for auto-scaling a fleet.
     * - *UPDATE_REQUESTED* -- A request to update the scaling policy has been received.
     * - *UPDATING* -- A change is being made to the scaling policy.
     * - *DELETE_REQUESTED* -- A request to delete the scaling policy has been received.
     * - *DELETING* -- The scaling policy is being deleted.
     * - *DELETED* -- The scaling policy has been deleted.
     * - *ERROR* -- An error occurred in creating the policy. It should be removed and recreated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-status
     */
    readonly status?: string;

    /**
     * An object that contains settings for a target-based scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-targetconfiguration
     */
    readonly targetConfiguration?: cdk.IResolvable | CfnFleet.TargetConfigurationProperty;

    /**
     * Metric value used to trigger a scaling event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-threshold
     */
    readonly threshold?: number;

    /**
     * The current status of the fleet's scaling policies in a requested fleet location.
     *
     * The status `PENDING_UPDATE` indicates that an update was requested for the fleet but has not yet been completed for the location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-scalingpolicy.html#cfn-gamelift-fleet-scalingpolicy-updatestatus
     */
    readonly updateStatus?: string;
  }

  /**
   * Settings for a target-based scaling policy.
   *
   * A target-based policy tracks a particular fleet metric specifies a target value for the metric. As player usage changes, the policy triggers Amazon GameLift to adjust capacity so that the metric returns to the target value. The target configuration specifies settings as needed for the target based policy, including the target value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-targetconfiguration.html
   */
  export interface TargetConfigurationProperty {
    /**
     * Desired value to use with a target-based scaling policy.
     *
     * The value must be relevant for whatever metric the scaling policy is using. For example, in a policy using the metric PercentAvailableGameSessions, the target value should be the preferred size of the fleet's buffer (the percent of capacity that should be idle and ready for new game sessions).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-fleet-targetconfiguration.html#cfn-gamelift-fleet-targetconfiguration-targetvalue
     */
    readonly targetValue: number;
  }
}

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html
 */
export interface CfnFleetProps {
  /**
   * Amazon GameLift Anywhere configuration options.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-anywhereconfiguration
   */
  readonly anywhereConfiguration?: CfnFleet.AnywhereConfigurationProperty | cdk.IResolvable;

  /**
   * Current resource capacity settings in a specified fleet or location.
   *
   * The location value might refer to a fleet's remote location or its home Region.
   *
   * *Related actions*
   *
   * [DescribeFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetCapacity.html) | [DescribeFleetLocationCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetLocationCapacity.html) | [UpdateFleetCapacity](https://docs.aws.amazon.com/gamelift/latest/apireference/API_UpdateFleetCapacity.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-applycapacity
   */
  readonly applyCapacity?: string;

  /**
   * A unique identifier for a build to be deployed on the new fleet.
   *
   * If you are deploying the fleet with a custom game build, you must specify this property. The build must have been successfully uploaded to Amazon GameLift and be in a `READY` status. This fleet setting cannot be changed once the fleet is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-buildid
   */
  readonly buildId?: string;

  /**
   * Prompts Amazon GameLift to generate a TLS/SSL certificate for the fleet.
   *
   * Amazon GameLift uses the certificates to encrypt traffic between game clients and the game servers running on Amazon GameLift. By default, the `CertificateConfiguration` is `DISABLED` . You can't change this property after you create the fleet.
   *
   * AWS Certificate Manager (ACM) certificates expire after 13 months. Certificate expiration can cause fleets to fail, preventing players from connecting to instances in the fleet. We recommend you replace fleets before 13 months, consider using fleet aliases for a smooth transition.
   *
   * > ACM isn't available in all AWS regions. A fleet creation request with certificate generation enabled in an unsupported Region, fails with a 4xx error. For more information about the supported Regions, see [Supported Regions](https://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html) in the *AWS Certificate Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-certificateconfiguration
   */
  readonly certificateConfiguration?: CfnFleet.CertificateConfigurationProperty | cdk.IResolvable;

  /**
   * The type of compute resource used to host your game servers.
   *
   * You can use your own compute resources with Amazon GameLift Anywhere or use Amazon EC2 instances with managed Amazon GameLift. By default, this property is set to `EC2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-computetype
   */
  readonly computeType?: string;

  /**
   * A description for the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-description
   */
  readonly description?: string;

  /**
   * The number of EC2 instances that you want this fleet to host.
   *
   * When creating a new fleet, GameLift automatically sets this value to "1" and initiates a single instance. Once the fleet is active, update this value to trigger GameLift to add or remove instances from the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-desiredec2instances
   */
  readonly desiredEc2Instances?: number;

  /**
   * The allowed IP address ranges and port settings that allow inbound traffic to access game sessions on this fleet.
   *
   * If the fleet is hosting a custom game build, this property must be set before players can connect to game sessions. For Realtime Servers fleets, Amazon GameLift automatically sets TCP and UDP ranges.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-ec2inboundpermissions
   */
  readonly ec2InboundPermissions?: Array<CfnFleet.IpPermissionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon GameLift-supported Amazon EC2 instance type to use for all fleet instances.
   *
   * Instance type determines the computing resources that will be used to host your game servers, including CPU, memory, storage, and networking capacity. See [Amazon Elastic Compute Cloud Instance Types](https://docs.aws.amazon.com/ec2/instance-types/) for detailed descriptions of Amazon EC2 instance types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-ec2instancetype
   */
  readonly ec2InstanceType?: string;

  /**
   * Indicates whether to use On-Demand or Spot instances for this fleet.
   *
   * By default, this property is set to `ON_DEMAND` . Learn more about when to use [On-Demand versus Spot Instances](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-ec2-instances.html#gamelift-ec2-instances-spot) . This fleet property can't be changed after the fleet is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-fleettype
   */
  readonly fleetType?: string;

  /**
   * A unique identifier for an IAM role with access permissions to other AWS services.
   *
   * Any application that runs on an instance in the fleet--including install scripts, server processes, and other processes--can use these permissions to interact with AWS resources that you own or have access to. For more information about using the role with your game server builds, see [Communicate with other AWS resources from your fleets](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-resources.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-instancerolearn
   */
  readonly instanceRoleArn?: string;

  /**
   * Indicates that fleet instances maintain a shared credentials file for the IAM role defined in `InstanceRoleArn` .
   *
   * Shared credentials allow applications that are deployed with the game server executable to communicate with other AWS resources. This property is used only when the game server is integrated with the server SDK version 5.x. For more information about using shared credentials, see [Communicate with other AWS resources from your fleets](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-resources.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-instancerolecredentialsprovider
   */
  readonly instanceRoleCredentialsProvider?: string;

  /**
   * A set of remote locations to deploy additional instances to and manage as part of the fleet.
   *
   * This parameter can only be used when creating fleets in AWS Regions that support multiple locations. You can add any Amazon GameLift-supported AWS Region as a remote location, in the form of an AWS Region code such as `us-west-2` . To create a fleet with instances in the home Region only, don't use this parameter.
   *
   * To use this parameter, Amazon GameLift requires you to use your home location in the request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-locations
   */
  readonly locations?: Array<cdk.IResolvable | CfnFleet.LocationConfigurationProperty> | cdk.IResolvable;

  /**
   * This parameter is no longer used.
   *
   * When hosting a custom game build, specify where Amazon GameLift should store log files using the Amazon GameLift server API call ProcessReady()
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-logpaths
   */
  readonly logPaths?: Array<string>;

  /**
   * The maximum number of instances that are allowed in the specified fleet location.
   *
   * If this parameter is not set, the default is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-maxsize
   */
  readonly maxSize?: number;

  /**
   * The name of an AWS CloudWatch metric group to add this fleet to.
   *
   * A metric group is used to aggregate the metrics for multiple fleets. You can specify an existing metric group name or set a new name to create a new metric group. A fleet can be included in only one metric group at a time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-metricgroups
   */
  readonly metricGroups?: Array<string>;

  /**
   * The minimum number of instances that are allowed in the specified fleet location.
   *
   * If this parameter is not set, the default is 0.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-minsize
   */
  readonly minSize?: number;

  /**
   * A descriptive label that is associated with a fleet.
   *
   * Fleet names do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-name
   */
  readonly name: string;

  /**
   * The status of termination protection for active game sessions on the fleet.
   *
   * By default, this property is set to `NoProtection` .
   *
   * - *NoProtection* - Game sessions can be terminated during active gameplay as a result of a scale-down event.
   * - *FullProtection* - Game sessions in `ACTIVE` status cannot be terminated during a scale-down event.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-newgamesessionprotectionpolicy
   */
  readonly newGameSessionProtectionPolicy?: string;

  /**
   * Used when peering your Amazon GameLift fleet with a VPC, the unique identifier for the AWS account that owns the VPC.
   *
   * You can find your account ID in the AWS Management Console under account settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-peervpcawsaccountid
   */
  readonly peerVpcAwsAccountId?: string;

  /**
   * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet.
   *
   * The VPC must be in the same Region as your fleet. To look up a VPC ID, use the [VPC Dashboard](https://docs.aws.amazon.com/vpc/) in the AWS Management Console . Learn more about VPC peering in [VPC Peering with Amazon GameLift Fleets](https://docs.aws.amazon.com/gamelift/latest/developerguide/vpc-peering.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-peervpcid
   */
  readonly peerVpcId?: string;

  /**
   * A policy that limits the number of game sessions that an individual player can create on instances in this fleet within a specified span of time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-resourcecreationlimitpolicy
   */
  readonly resourceCreationLimitPolicy?: cdk.IResolvable | CfnFleet.ResourceCreationLimitPolicyProperty;

  /**
   * Instructions for how to launch and maintain server processes on instances in the fleet.
   *
   * The runtime configuration defines one or more server process configurations, each identifying a build executable or Realtime script file and the number of processes of that type to run concurrently.
   *
   * > The `RuntimeConfiguration` parameter is required unless the fleet is being configured using the older parameters `ServerLaunchPath` and `ServerLaunchParameters` , which are still supported for backward compatibility.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-runtimeconfiguration
   */
  readonly runtimeConfiguration?: cdk.IResolvable | CfnFleet.RuntimeConfigurationProperty;

  /**
   * Rule that controls how a fleet is scaled.
   *
   * Scaling policies are uniquely identified by the combination of name and fleet ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-scalingpolicies
   */
  readonly scalingPolicies?: Array<cdk.IResolvable | CfnFleet.ScalingPolicyProperty> | cdk.IResolvable;

  /**
   * The unique identifier for a Realtime configuration script to be deployed on fleet instances.
   *
   * You can use either the script ID or ARN. Scripts must be uploaded to Amazon GameLift prior to creating the fleet. This fleet property cannot be changed later.
   *
   * > You can't use the `!Ref` command to reference a script created with a CloudFormation template for the fleet property `ScriptId` . Instead, use `Fn::GetAtt Script.Arn` or `Fn::GetAtt Script.Id` to retrieve either of these properties as input for `ScriptId` . Alternatively, enter a `ScriptId` string manually.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-scriptid
   */
  readonly scriptId?: string;

  /**
   * This parameter is no longer used but is retained for backward compatibility.
   *
   * Instead, specify server launch parameters in the RuntimeConfiguration parameter. A request must specify either a runtime configuration or values for both ServerLaunchParameters and ServerLaunchPath.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-serverlaunchparameters
   */
  readonly serverLaunchParameters?: string;

  /**
   * This parameter is no longer used.
   *
   * Instead, specify a server launch path using the RuntimeConfiguration parameter. Requests that specify a server launch path and launch parameters instead of a runtime configuration will continue to work.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-serverlaunchpath
   */
  readonly serverLaunchPath?: string;
}

/**
 * Determine whether the given properties match those of a `IpPermissionProperty`
 *
 * @param properties - the TypeScript properties of a `IpPermissionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetIpPermissionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fromPort", cdk.requiredValidator)(properties.fromPort));
  errors.collect(cdk.propertyValidator("fromPort", cdk.validateNumber)(properties.fromPort));
  errors.collect(cdk.propertyValidator("ipRange", cdk.requiredValidator)(properties.ipRange));
  errors.collect(cdk.propertyValidator("ipRange", cdk.validateString)(properties.ipRange));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("toPort", cdk.requiredValidator)(properties.toPort));
  errors.collect(cdk.propertyValidator("toPort", cdk.validateNumber)(properties.toPort));
  return errors.wrap("supplied properties not correct for \"IpPermissionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetIpPermissionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetIpPermissionPropertyValidator(properties).assertSuccess();
  return {
    "FromPort": cdk.numberToCloudFormation(properties.fromPort),
    "IpRange": cdk.stringToCloudFormation(properties.ipRange),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ToPort": cdk.numberToCloudFormation(properties.toPort)
  };
}

// @ts-ignore TS6133
function CfnFleetIpPermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleet.IpPermissionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.IpPermissionProperty>();
  ret.addPropertyResult("fromPort", "FromPort", (properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined));
  ret.addPropertyResult("ipRange", "IpRange", (properties.IpRange != null ? cfn_parse.FromCloudFormation.getString(properties.IpRange) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("toPort", "ToPort", (properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationCapacityProperty`
 *
 * @param properties - the TypeScript properties of a `LocationCapacityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetLocationCapacityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredEc2Instances", cdk.requiredValidator)(properties.desiredEc2Instances));
  errors.collect(cdk.propertyValidator("desiredEc2Instances", cdk.validateNumber)(properties.desiredEc2Instances));
  errors.collect(cdk.propertyValidator("maxSize", cdk.requiredValidator)(properties.maxSize));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.requiredValidator)(properties.minSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  return errors.wrap("supplied properties not correct for \"LocationCapacityProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetLocationCapacityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetLocationCapacityPropertyValidator(properties).assertSuccess();
  return {
    "DesiredEC2Instances": cdk.numberToCloudFormation(properties.desiredEc2Instances),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MinSize": cdk.numberToCloudFormation(properties.minSize)
  };
}

// @ts-ignore TS6133
function CfnFleetLocationCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.LocationCapacityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.LocationCapacityProperty>();
  ret.addPropertyResult("desiredEc2Instances", "DesiredEC2Instances", (properties.DesiredEC2Instances != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredEC2Instances) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetLocationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("locationCapacity", CfnFleetLocationCapacityPropertyValidator)(properties.locationCapacity));
  return errors.wrap("supplied properties not correct for \"LocationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetLocationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetLocationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Location": cdk.stringToCloudFormation(properties.location),
    "LocationCapacity": convertCfnFleetLocationCapacityPropertyToCloudFormation(properties.locationCapacity)
  };
}

// @ts-ignore TS6133
function CfnFleetLocationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.LocationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.LocationConfigurationProperty>();
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("locationCapacity", "LocationCapacity", (properties.LocationCapacity != null ? CfnFleetLocationCapacityPropertyFromCloudFormation(properties.LocationCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerProcessProperty`
 *
 * @param properties - the TypeScript properties of a `ServerProcessProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetServerProcessPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("concurrentExecutions", cdk.requiredValidator)(properties.concurrentExecutions));
  errors.collect(cdk.propertyValidator("concurrentExecutions", cdk.validateNumber)(properties.concurrentExecutions));
  errors.collect(cdk.propertyValidator("launchPath", cdk.requiredValidator)(properties.launchPath));
  errors.collect(cdk.propertyValidator("launchPath", cdk.validateString)(properties.launchPath));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateString)(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ServerProcessProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetServerProcessPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetServerProcessPropertyValidator(properties).assertSuccess();
  return {
    "ConcurrentExecutions": cdk.numberToCloudFormation(properties.concurrentExecutions),
    "LaunchPath": cdk.stringToCloudFormation(properties.launchPath),
    "Parameters": cdk.stringToCloudFormation(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnFleetServerProcessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.ServerProcessProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.ServerProcessProperty>();
  ret.addPropertyResult("concurrentExecutions", "ConcurrentExecutions", (properties.ConcurrentExecutions != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConcurrentExecutions) : undefined));
  ret.addPropertyResult("launchPath", "LaunchPath", (properties.LaunchPath != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchPath) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getString(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuntimeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetRuntimeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gameSessionActivationTimeoutSeconds", cdk.validateNumber)(properties.gameSessionActivationTimeoutSeconds));
  errors.collect(cdk.propertyValidator("maxConcurrentGameSessionActivations", cdk.validateNumber)(properties.maxConcurrentGameSessionActivations));
  errors.collect(cdk.propertyValidator("serverProcesses", cdk.listValidator(CfnFleetServerProcessPropertyValidator))(properties.serverProcesses));
  return errors.wrap("supplied properties not correct for \"RuntimeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetRuntimeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetRuntimeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "GameSessionActivationTimeoutSeconds": cdk.numberToCloudFormation(properties.gameSessionActivationTimeoutSeconds),
    "MaxConcurrentGameSessionActivations": cdk.numberToCloudFormation(properties.maxConcurrentGameSessionActivations),
    "ServerProcesses": cdk.listMapper(convertCfnFleetServerProcessPropertyToCloudFormation)(properties.serverProcesses)
  };
}

// @ts-ignore TS6133
function CfnFleetRuntimeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.RuntimeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.RuntimeConfigurationProperty>();
  ret.addPropertyResult("gameSessionActivationTimeoutSeconds", "GameSessionActivationTimeoutSeconds", (properties.GameSessionActivationTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.GameSessionActivationTimeoutSeconds) : undefined));
  ret.addPropertyResult("maxConcurrentGameSessionActivations", "MaxConcurrentGameSessionActivations", (properties.MaxConcurrentGameSessionActivations != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentGameSessionActivations) : undefined));
  ret.addPropertyResult("serverProcesses", "ServerProcesses", (properties.ServerProcesses != null ? cfn_parse.FromCloudFormation.getArray(CfnFleetServerProcessPropertyFromCloudFormation)(properties.ServerProcesses) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnywhereConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AnywhereConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetAnywhereConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cost", cdk.requiredValidator)(properties.cost));
  errors.collect(cdk.propertyValidator("cost", cdk.validateString)(properties.cost));
  return errors.wrap("supplied properties not correct for \"AnywhereConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetAnywhereConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetAnywhereConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Cost": cdk.stringToCloudFormation(properties.cost)
  };
}

// @ts-ignore TS6133
function CfnFleetAnywhereConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleet.AnywhereConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.AnywhereConfigurationProperty>();
  ret.addPropertyResult("cost", "Cost", (properties.Cost != null ? cfn_parse.FromCloudFormation.getString(properties.Cost) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceCreationLimitPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceCreationLimitPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetResourceCreationLimitPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("newGameSessionsPerCreator", cdk.validateNumber)(properties.newGameSessionsPerCreator));
  errors.collect(cdk.propertyValidator("policyPeriodInMinutes", cdk.validateNumber)(properties.policyPeriodInMinutes));
  return errors.wrap("supplied properties not correct for \"ResourceCreationLimitPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetResourceCreationLimitPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetResourceCreationLimitPolicyPropertyValidator(properties).assertSuccess();
  return {
    "NewGameSessionsPerCreator": cdk.numberToCloudFormation(properties.newGameSessionsPerCreator),
    "PolicyPeriodInMinutes": cdk.numberToCloudFormation(properties.policyPeriodInMinutes)
  };
}

// @ts-ignore TS6133
function CfnFleetResourceCreationLimitPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.ResourceCreationLimitPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.ResourceCreationLimitPolicyProperty>();
  ret.addPropertyResult("newGameSessionsPerCreator", "NewGameSessionsPerCreator", (properties.NewGameSessionsPerCreator != null ? cfn_parse.FromCloudFormation.getNumber(properties.NewGameSessionsPerCreator) : undefined));
  ret.addPropertyResult("policyPeriodInMinutes", "PolicyPeriodInMinutes", (properties.PolicyPeriodInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.PolicyPeriodInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CertificateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetCertificateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateType", cdk.requiredValidator)(properties.certificateType));
  errors.collect(cdk.propertyValidator("certificateType", cdk.validateString)(properties.certificateType));
  return errors.wrap("supplied properties not correct for \"CertificateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetCertificateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetCertificateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CertificateType": cdk.stringToCloudFormation(properties.certificateType)
  };
}

// @ts-ignore TS6133
function CfnFleetCertificateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleet.CertificateConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.CertificateConfigurationProperty>();
  ret.addPropertyResult("certificateType", "CertificateType", (properties.CertificateType != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetTargetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetValue", cdk.requiredValidator)(properties.targetValue));
  errors.collect(cdk.propertyValidator("targetValue", cdk.validateNumber)(properties.targetValue));
  return errors.wrap("supplied properties not correct for \"TargetConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetTargetConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetTargetConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TargetValue": cdk.numberToCloudFormation(properties.targetValue)
  };
}

// @ts-ignore TS6133
function CfnFleetTargetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.TargetConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.TargetConfigurationProperty>();
  ret.addPropertyResult("targetValue", "TargetValue", (properties.TargetValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("evaluationPeriods", cdk.validateNumber)(properties.evaluationPeriods));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("scalingAdjustmentType", cdk.validateString)(properties.scalingAdjustmentType));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("targetConfiguration", CfnFleetTargetConfigurationPropertyValidator)(properties.targetConfiguration));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("updateStatus", cdk.validateString)(properties.updateStatus));
  return errors.wrap("supplied properties not correct for \"ScalingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetScalingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetScalingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "EvaluationPeriods": cdk.numberToCloudFormation(properties.evaluationPeriods),
    "Location": cdk.stringToCloudFormation(properties.location),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment),
    "ScalingAdjustmentType": cdk.stringToCloudFormation(properties.scalingAdjustmentType),
    "Status": cdk.stringToCloudFormation(properties.status),
    "TargetConfiguration": convertCfnFleetTargetConfigurationPropertyToCloudFormation(properties.targetConfiguration),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "UpdateStatus": cdk.stringToCloudFormation(properties.updateStatus)
  };
}

// @ts-ignore TS6133
function CfnFleetScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.ScalingPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.ScalingPolicyProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("evaluationPeriods", "EvaluationPeriods", (properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addPropertyResult("scalingAdjustmentType", "ScalingAdjustmentType", (properties.ScalingAdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.ScalingAdjustmentType) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("targetConfiguration", "TargetConfiguration", (properties.TargetConfiguration != null ? CfnFleetTargetConfigurationPropertyFromCloudFormation(properties.TargetConfiguration) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("updateStatus", "UpdateStatus", (properties.UpdateStatus != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("anywhereConfiguration", CfnFleetAnywhereConfigurationPropertyValidator)(properties.anywhereConfiguration));
  errors.collect(cdk.propertyValidator("applyCapacity", cdk.validateString)(properties.applyCapacity));
  errors.collect(cdk.propertyValidator("buildId", cdk.validateString)(properties.buildId));
  errors.collect(cdk.propertyValidator("certificateConfiguration", CfnFleetCertificateConfigurationPropertyValidator)(properties.certificateConfiguration));
  errors.collect(cdk.propertyValidator("computeType", cdk.validateString)(properties.computeType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("desiredEc2Instances", cdk.validateNumber)(properties.desiredEc2Instances));
  errors.collect(cdk.propertyValidator("ec2InboundPermissions", cdk.listValidator(CfnFleetIpPermissionPropertyValidator))(properties.ec2InboundPermissions));
  errors.collect(cdk.propertyValidator("ec2InstanceType", cdk.validateString)(properties.ec2InstanceType));
  errors.collect(cdk.propertyValidator("fleetType", cdk.validateString)(properties.fleetType));
  errors.collect(cdk.propertyValidator("instanceRoleArn", cdk.validateString)(properties.instanceRoleArn));
  errors.collect(cdk.propertyValidator("instanceRoleCredentialsProvider", cdk.validateString)(properties.instanceRoleCredentialsProvider));
  errors.collect(cdk.propertyValidator("locations", cdk.listValidator(CfnFleetLocationConfigurationPropertyValidator))(properties.locations));
  errors.collect(cdk.propertyValidator("logPaths", cdk.listValidator(cdk.validateString))(properties.logPaths));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("metricGroups", cdk.listValidator(cdk.validateString))(properties.metricGroups));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("newGameSessionProtectionPolicy", cdk.validateString)(properties.newGameSessionProtectionPolicy));
  errors.collect(cdk.propertyValidator("peerVpcAwsAccountId", cdk.validateString)(properties.peerVpcAwsAccountId));
  errors.collect(cdk.propertyValidator("peerVpcId", cdk.validateString)(properties.peerVpcId));
  errors.collect(cdk.propertyValidator("resourceCreationLimitPolicy", CfnFleetResourceCreationLimitPolicyPropertyValidator)(properties.resourceCreationLimitPolicy));
  errors.collect(cdk.propertyValidator("runtimeConfiguration", CfnFleetRuntimeConfigurationPropertyValidator)(properties.runtimeConfiguration));
  errors.collect(cdk.propertyValidator("scalingPolicies", cdk.listValidator(CfnFleetScalingPolicyPropertyValidator))(properties.scalingPolicies));
  errors.collect(cdk.propertyValidator("scriptId", cdk.validateString)(properties.scriptId));
  errors.collect(cdk.propertyValidator("serverLaunchParameters", cdk.validateString)(properties.serverLaunchParameters));
  errors.collect(cdk.propertyValidator("serverLaunchPath", cdk.validateString)(properties.serverLaunchPath));
  return errors.wrap("supplied properties not correct for \"CfnFleetProps\"");
}

// @ts-ignore TS6133
function convertCfnFleetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetPropsValidator(properties).assertSuccess();
  return {
    "AnywhereConfiguration": convertCfnFleetAnywhereConfigurationPropertyToCloudFormation(properties.anywhereConfiguration),
    "ApplyCapacity": cdk.stringToCloudFormation(properties.applyCapacity),
    "BuildId": cdk.stringToCloudFormation(properties.buildId),
    "CertificateConfiguration": convertCfnFleetCertificateConfigurationPropertyToCloudFormation(properties.certificateConfiguration),
    "ComputeType": cdk.stringToCloudFormation(properties.computeType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DesiredEC2Instances": cdk.numberToCloudFormation(properties.desiredEc2Instances),
    "EC2InboundPermissions": cdk.listMapper(convertCfnFleetIpPermissionPropertyToCloudFormation)(properties.ec2InboundPermissions),
    "EC2InstanceType": cdk.stringToCloudFormation(properties.ec2InstanceType),
    "FleetType": cdk.stringToCloudFormation(properties.fleetType),
    "InstanceRoleARN": cdk.stringToCloudFormation(properties.instanceRoleArn),
    "InstanceRoleCredentialsProvider": cdk.stringToCloudFormation(properties.instanceRoleCredentialsProvider),
    "Locations": cdk.listMapper(convertCfnFleetLocationConfigurationPropertyToCloudFormation)(properties.locations),
    "LogPaths": cdk.listMapper(cdk.stringToCloudFormation)(properties.logPaths),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MetricGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.metricGroups),
    "MinSize": cdk.numberToCloudFormation(properties.minSize),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NewGameSessionProtectionPolicy": cdk.stringToCloudFormation(properties.newGameSessionProtectionPolicy),
    "PeerVpcAwsAccountId": cdk.stringToCloudFormation(properties.peerVpcAwsAccountId),
    "PeerVpcId": cdk.stringToCloudFormation(properties.peerVpcId),
    "ResourceCreationLimitPolicy": convertCfnFleetResourceCreationLimitPolicyPropertyToCloudFormation(properties.resourceCreationLimitPolicy),
    "RuntimeConfiguration": convertCfnFleetRuntimeConfigurationPropertyToCloudFormation(properties.runtimeConfiguration),
    "ScalingPolicies": cdk.listMapper(convertCfnFleetScalingPolicyPropertyToCloudFormation)(properties.scalingPolicies),
    "ScriptId": cdk.stringToCloudFormation(properties.scriptId),
    "ServerLaunchParameters": cdk.stringToCloudFormation(properties.serverLaunchParameters),
    "ServerLaunchPath": cdk.stringToCloudFormation(properties.serverLaunchPath)
  };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
  ret.addPropertyResult("anywhereConfiguration", "AnywhereConfiguration", (properties.AnywhereConfiguration != null ? CfnFleetAnywhereConfigurationPropertyFromCloudFormation(properties.AnywhereConfiguration) : undefined));
  ret.addPropertyResult("applyCapacity", "ApplyCapacity", (properties.ApplyCapacity != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyCapacity) : undefined));
  ret.addPropertyResult("buildId", "BuildId", (properties.BuildId != null ? cfn_parse.FromCloudFormation.getString(properties.BuildId) : undefined));
  ret.addPropertyResult("certificateConfiguration", "CertificateConfiguration", (properties.CertificateConfiguration != null ? CfnFleetCertificateConfigurationPropertyFromCloudFormation(properties.CertificateConfiguration) : undefined));
  ret.addPropertyResult("computeType", "ComputeType", (properties.ComputeType != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("desiredEc2Instances", "DesiredEC2Instances", (properties.DesiredEC2Instances != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredEC2Instances) : undefined));
  ret.addPropertyResult("ec2InboundPermissions", "EC2InboundPermissions", (properties.EC2InboundPermissions != null ? cfn_parse.FromCloudFormation.getArray(CfnFleetIpPermissionPropertyFromCloudFormation)(properties.EC2InboundPermissions) : undefined));
  ret.addPropertyResult("ec2InstanceType", "EC2InstanceType", (properties.EC2InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.EC2InstanceType) : undefined));
  ret.addPropertyResult("fleetType", "FleetType", (properties.FleetType != null ? cfn_parse.FromCloudFormation.getString(properties.FleetType) : undefined));
  ret.addPropertyResult("instanceRoleArn", "InstanceRoleARN", (properties.InstanceRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRoleARN) : undefined));
  ret.addPropertyResult("instanceRoleCredentialsProvider", "InstanceRoleCredentialsProvider", (properties.InstanceRoleCredentialsProvider != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRoleCredentialsProvider) : undefined));
  ret.addPropertyResult("locations", "Locations", (properties.Locations != null ? cfn_parse.FromCloudFormation.getArray(CfnFleetLocationConfigurationPropertyFromCloudFormation)(properties.Locations) : undefined));
  ret.addPropertyResult("logPaths", "LogPaths", (properties.LogPaths != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogPaths) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("metricGroups", "MetricGroups", (properties.MetricGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MetricGroups) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("newGameSessionProtectionPolicy", "NewGameSessionProtectionPolicy", (properties.NewGameSessionProtectionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.NewGameSessionProtectionPolicy) : undefined));
  ret.addPropertyResult("peerVpcAwsAccountId", "PeerVpcAwsAccountId", (properties.PeerVpcAwsAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.PeerVpcAwsAccountId) : undefined));
  ret.addPropertyResult("peerVpcId", "PeerVpcId", (properties.PeerVpcId != null ? cfn_parse.FromCloudFormation.getString(properties.PeerVpcId) : undefined));
  ret.addPropertyResult("resourceCreationLimitPolicy", "ResourceCreationLimitPolicy", (properties.ResourceCreationLimitPolicy != null ? CfnFleetResourceCreationLimitPolicyPropertyFromCloudFormation(properties.ResourceCreationLimitPolicy) : undefined));
  ret.addPropertyResult("runtimeConfiguration", "RuntimeConfiguration", (properties.RuntimeConfiguration != null ? CfnFleetRuntimeConfigurationPropertyFromCloudFormation(properties.RuntimeConfiguration) : undefined));
  ret.addPropertyResult("scalingPolicies", "ScalingPolicies", (properties.ScalingPolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnFleetScalingPolicyPropertyFromCloudFormation)(properties.ScalingPolicies) : undefined));
  ret.addPropertyResult("scriptId", "ScriptId", (properties.ScriptId != null ? cfn_parse.FromCloudFormation.getString(properties.ScriptId) : undefined));
  ret.addPropertyResult("serverLaunchParameters", "ServerLaunchParameters", (properties.ServerLaunchParameters != null ? cfn_parse.FromCloudFormation.getString(properties.ServerLaunchParameters) : undefined));
  ret.addPropertyResult("serverLaunchPath", "ServerLaunchPath", (properties.ServerLaunchPath != null ? cfn_parse.FromCloudFormation.getString(properties.ServerLaunchPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * *This operation is used with the Amazon GameLift FleetIQ solution and game server groups.*.
 *
 * Creates a GameLift FleetIQ game server group for managing game hosting on a collection of Amazon EC2 instances for game hosting. This operation creates the game server group, creates an Auto Scaling group in your AWS account , and establishes a link between the two groups. You can view the status of your game server groups in the GameLift console. Game server group metrics and events are emitted to Amazon CloudWatch.
 *
 * Before creating a new game server group, you must have the following:
 *
 * - An Amazon EC2 launch template that specifies how to launch Amazon EC2 instances with your game server build. For more information, see [Launching an Instance from a Launch Template](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html) in the *Amazon EC2 User Guide* .
 * - An IAM role that extends limited access to your AWS account to allow GameLift FleetIQ to create and interact with the Auto Scaling group. For more information, see [Create IAM roles for cross-service interaction](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-iam-permissions-roles.html) in the *GameLift FleetIQ Developer Guide* .
 *
 * To create a new game server group, specify a unique group name, IAM role and Amazon EC2 launch template, and provide a list of instance types that can be used in the group. You must also set initial maximum and minimum limits on the group's instance count. You can optionally set an Auto Scaling policy with target tracking based on a GameLift FleetIQ metric.
 *
 * Once the game server group and corresponding Auto Scaling group are created, you have full access to change the Auto Scaling group's configuration as needed. Several properties that are set when creating a game server group, including maximum/minimum size and auto-scaling policy settings, must be updated directly in the Auto Scaling group. Keep in mind that some Auto Scaling group properties are periodically updated by GameLift FleetIQ as part of its balancing activities to optimize for availability and cost.
 *
 * *Learn more*
 *
 * [GameLift FleetIQ Guide](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-intro.html)
 *
 * @cloudformationResource AWS::GameLift::GameServerGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html
 */
export class CfnGameServerGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::GameServerGroup";

  /**
   * Build a CfnGameServerGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGameServerGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGameServerGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGameServerGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the auto scaling group.
   *
   * @cloudformationAttribute AutoScalingGroupArn
   */
  public readonly attrAutoScalingGroupArn: string;

  /**
   * A unique identifier for the game server group.
   *
   * @cloudformationAttribute GameServerGroupArn
   */
  public readonly attrGameServerGroupArn: string;

  /**
   * Configuration settings to define a scaling policy for the Auto Scaling group that is optimized for game hosting.
   */
  public autoScalingPolicy?: CfnGameServerGroup.AutoScalingPolicyProperty | cdk.IResolvable;

  /**
   * Indicates how Amazon GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group.
   */
  public balancingStrategy?: string;

  /**
   * The type of delete to perform.
   */
  public deleteOption?: string;

  /**
   * A developer-defined identifier for the game server group.
   */
  public gameServerGroupName: string;

  /**
   * A flag that indicates whether instances in the game server group are protected from early termination.
   */
  public gameServerProtectionPolicy?: string;

  /**
   * The set of Amazon EC2 instance types that Amazon GameLift FleetIQ can use when balancing and automatically scaling instances in the corresponding Auto Scaling group.
   */
  public instanceDefinitions: Array<CfnGameServerGroup.InstanceDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon EC2 launch template that contains configuration settings and game server code to be deployed to all instances in the game server group.
   */
  public launchTemplate?: cdk.IResolvable | CfnGameServerGroup.LaunchTemplateProperty;

  /**
   * The maximum number of instances allowed in the Amazon EC2 Auto Scaling group.
   */
  public maxSize?: number;

  /**
   * The minimum number of instances allowed in the Amazon EC2 Auto Scaling group.
   */
  public minSize?: number;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) for an IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new game server group resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of virtual private cloud (VPC) subnets to use with instances in the game server group.
   */
  public vpcSubnets?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGameServerGroupProps) {
    super(scope, id, {
      "type": CfnGameServerGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "gameServerGroupName", this);
    cdk.requireProperty(props, "instanceDefinitions", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrAutoScalingGroupArn = cdk.Token.asString(this.getAtt("AutoScalingGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrGameServerGroupArn = cdk.Token.asString(this.getAtt("GameServerGroupArn", cdk.ResolutionTypeHint.STRING));
    this.autoScalingPolicy = props.autoScalingPolicy;
    this.balancingStrategy = props.balancingStrategy;
    this.deleteOption = props.deleteOption;
    this.gameServerGroupName = props.gameServerGroupName;
    this.gameServerProtectionPolicy = props.gameServerProtectionPolicy;
    this.instanceDefinitions = props.instanceDefinitions;
    this.launchTemplate = props.launchTemplate;
    this.maxSize = props.maxSize;
    this.minSize = props.minSize;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::GameServerGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcSubnets = props.vpcSubnets;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingPolicy": this.autoScalingPolicy,
      "balancingStrategy": this.balancingStrategy,
      "deleteOption": this.deleteOption,
      "gameServerGroupName": this.gameServerGroupName,
      "gameServerProtectionPolicy": this.gameServerProtectionPolicy,
      "instanceDefinitions": this.instanceDefinitions,
      "launchTemplate": this.launchTemplate,
      "maxSize": this.maxSize,
      "minSize": this.minSize,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags(),
      "vpcSubnets": this.vpcSubnets
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGameServerGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGameServerGroupPropsToCloudFormation(props);
  }
}

export namespace CfnGameServerGroup {
  /**
   * *This data type is used with the GameLift FleetIQ and game server groups.*.
   *
   * Configuration settings for intelligent automatic scaling that uses target tracking. After the Auto Scaling group is created, all updates to Auto Scaling policies, including changing this policy and adding or removing other policies, is done directly on the Auto Scaling group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-autoscalingpolicy.html
   */
  export interface AutoScalingPolicyProperty {
    /**
     * Length of time, in seconds, it takes for a new instance to start new game server processes and register with Amazon GameLift FleetIQ.
     *
     * Specifying a warm-up time can be useful, particularly with game servers that take a long time to start up, because it avoids prematurely starting new instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-autoscalingpolicy.html#cfn-gamelift-gameservergroup-autoscalingpolicy-estimatedinstancewarmup
     */
    readonly estimatedInstanceWarmup?: number;

    /**
     * Settings for a target-based scaling policy applied to Auto Scaling group.
     *
     * These settings are used to create a target-based policy that tracks the GameLift FleetIQ metric `PercentUtilizedGameServers` and specifies a target value for the metric. As player usage changes, the policy triggers to adjust the game server group capacity so that the metric returns to the target value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-autoscalingpolicy.html#cfn-gamelift-gameservergroup-autoscalingpolicy-targettrackingconfiguration
     */
    readonly targetTrackingConfiguration: cdk.IResolvable | CfnGameServerGroup.TargetTrackingConfigurationProperty;
  }

  /**
   * *This data type is used with the Amazon GameLift FleetIQ and game server groups.*.
   *
   * Settings for a target-based scaling policy as part of a `GameServerGroupAutoScalingPolicy` . These settings are used to create a target-based policy that tracks the GameLift FleetIQ metric `"PercentUtilizedGameServers"` and specifies a target value for the metric. As player usage changes, the policy triggers to adjust the game server group capacity so that the metric returns to the target value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-targettrackingconfiguration.html
   */
  export interface TargetTrackingConfigurationProperty {
    /**
     * Desired value to use with a game server group target-based scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-targettrackingconfiguration.html#cfn-gamelift-gameservergroup-targettrackingconfiguration-targetvalue
     */
    readonly targetValue: number;
  }

  /**
   * *This data type is used with the GameLift FleetIQ and game server groups.*.
   *
   * An Amazon EC2 launch template that contains configuration settings and game server code to be deployed to all instances in a game server group. The launch template is specified when creating a new game server group with `GameServerGroup` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-launchtemplate.html
   */
  export interface LaunchTemplateProperty {
    /**
     * A unique identifier for an existing Amazon EC2 launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-launchtemplate.html#cfn-gamelift-gameservergroup-launchtemplate-launchtemplateid
     */
    readonly launchTemplateId?: string;

    /**
     * A readable identifier for an existing Amazon EC2 launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-launchtemplate.html#cfn-gamelift-gameservergroup-launchtemplate-launchtemplatename
     */
    readonly launchTemplateName?: string;

    /**
     * The version of the Amazon EC2 launch template to use.
     *
     * If no version is specified, the default version will be used. With Amazon EC2, you can specify a default version for a launch template. If none is set, the default is the first version created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-launchtemplate.html#cfn-gamelift-gameservergroup-launchtemplate-version
     */
    readonly version?: string;
  }

  /**
   * *This data type is used with the Amazon GameLift FleetIQ and game server groups.*.
   *
   * An allowed instance type for a `GameServerGroup` . All game server groups must have at least two instance types defined for it. GameLift FleetIQ periodically evaluates each defined instance type for viability. It then updates the Auto Scaling group with the list of viable instance types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-instancedefinition.html
   */
  export interface InstanceDefinitionProperty {
    /**
     * An Amazon EC2 instance type designation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-instancedefinition.html#cfn-gamelift-gameservergroup-instancedefinition-instancetype
     */
    readonly instanceType: string;

    /**
     * Instance weighting that indicates how much this instance type contributes to the total capacity of a game server group.
     *
     * Instance weights are used by Amazon GameLift FleetIQ to calculate the instance type's cost per unit hour and better identify the most cost-effective options. For detailed information on weighting instance capacity, see [Instance Weighting](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-weighting.html) in the *Amazon Elastic Compute Cloud Auto Scaling User Guide* . Default value is "1".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gameservergroup-instancedefinition.html#cfn-gamelift-gameservergroup-instancedefinition-weightedcapacity
     */
    readonly weightedCapacity?: string;
  }
}

/**
 * Properties for defining a `CfnGameServerGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html
 */
export interface CfnGameServerGroupProps {
  /**
   * Configuration settings to define a scaling policy for the Auto Scaling group that is optimized for game hosting.
   *
   * The scaling policy uses the metric `"PercentUtilizedGameServers"` to maintain a buffer of idle game servers that can immediately accommodate new games and players. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-autoscalingpolicy
   */
  readonly autoScalingPolicy?: CfnGameServerGroup.AutoScalingPolicyProperty | cdk.IResolvable;

  /**
   * Indicates how Amazon GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group.
   *
   * Method options include the following:
   *
   * - `SPOT_ONLY` - Only Spot Instances are used in the game server group. If Spot Instances are unavailable or not viable for game hosting, the game server group provides no hosting capacity until Spot Instances can again be used. Until then, no new instances are started, and the existing nonviable Spot Instances are terminated (after current gameplay ends) and are not replaced.
   * - `SPOT_PREFERRED` - (default value) Spot Instances are used whenever available in the game server group. If Spot Instances are unavailable, the game server group continues to provide hosting capacity by falling back to On-Demand Instances. Existing nonviable Spot Instances are terminated (after current gameplay ends) and are replaced with new On-Demand Instances.
   * - `ON_DEMAND_ONLY` - Only On-Demand Instances are used in the game server group. No Spot Instances are used, even when available, while this balancing strategy is in force.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-balancingstrategy
   */
  readonly balancingStrategy?: string;

  /**
   * The type of delete to perform.
   *
   * To delete a game server group, specify the `DeleteOption` . Options include the following:
   *
   * - `SAFE_DELETE` – (default) Terminates the game server group and Amazon EC2 Auto Scaling group only when it has no game servers that are in `UTILIZED` status.
   * - `FORCE_DELETE` – Terminates the game server group, including all active game servers regardless of their utilization status, and the Amazon EC2 Auto Scaling group.
   * - `RETAIN` – Does a safe delete of the game server group but retains the Amazon EC2 Auto Scaling group as is.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-deleteoption
   */
  readonly deleteOption?: string;

  /**
   * A developer-defined identifier for the game server group.
   *
   * The name is unique for each Region in each AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-gameservergroupname
   */
  readonly gameServerGroupName: string;

  /**
   * A flag that indicates whether instances in the game server group are protected from early termination.
   *
   * Unprotected instances that have active game servers running might be terminated during a scale-down event, causing players to be dropped from the game. Protected instances cannot be terminated while there are active game servers running except in the event of a forced game server group deletion (see ). An exception to this is with Spot Instances, which can be terminated by AWS regardless of protection status.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-gameserverprotectionpolicy
   */
  readonly gameServerProtectionPolicy?: string;

  /**
   * The set of Amazon EC2 instance types that Amazon GameLift FleetIQ can use when balancing and automatically scaling instances in the corresponding Auto Scaling group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-instancedefinitions
   */
  readonly instanceDefinitions: Array<CfnGameServerGroup.InstanceDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon EC2 launch template that contains configuration settings and game server code to be deployed to all instances in the game server group.
   *
   * You can specify the template using either the template name or ID. For help with creating a launch template, see [Creating a Launch Template for an Auto Scaling Group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon Elastic Compute Cloud Auto Scaling User Guide* . After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * > If you specify network interfaces in your launch template, you must explicitly set the property `AssociatePublicIpAddress` to "true". If no network interface is specified in the launch template, Amazon GameLift FleetIQ uses your account's default VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-launchtemplate
   */
  readonly launchTemplate?: cdk.IResolvable | CfnGameServerGroup.LaunchTemplateProperty;

  /**
   * The maximum number of instances allowed in the Amazon EC2 Auto Scaling group.
   *
   * During automatic scaling events, Amazon GameLift FleetIQ and EC2 do not scale up the group above this maximum. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-maxsize
   */
  readonly maxSize?: number;

  /**
   * The minimum number of instances allowed in the Amazon EC2 Auto Scaling group.
   *
   * During automatic scaling events, Amazon GameLift FleetIQ and Amazon EC2 do not scale down the group below this minimum. In production, this value should be set to at least 1. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the AWS console or APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-minsize
   */
  readonly minSize?: number;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) for an IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-rolearn
   */
  readonly roleArn: string;

  /**
   * A list of labels to assign to the new game server group resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources is useful for resource management, access management, and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference* . Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags, respectively. The maximum tag limit may be lower than stated. See the AWS General Reference for actual tagging limits.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of virtual private cloud (VPC) subnets to use with instances in the game server group.
   *
   * By default, all Amazon GameLift FleetIQ-supported Availability Zones are used. You can use this parameter to specify VPCs that you've set up. This property cannot be updated after the game server group is created, and the corresponding Auto Scaling group will always use the property value that is set with this request, even if the Auto Scaling group is updated directly.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gameservergroup.html#cfn-gamelift-gameservergroup-vpcsubnets
   */
  readonly vpcSubnets?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameServerGroupTargetTrackingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetValue", cdk.requiredValidator)(properties.targetValue));
  errors.collect(cdk.propertyValidator("targetValue", cdk.validateNumber)(properties.targetValue));
  return errors.wrap("supplied properties not correct for \"TargetTrackingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameServerGroupTargetTrackingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameServerGroupTargetTrackingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TargetValue": cdk.numberToCloudFormation(properties.targetValue)
  };
}

// @ts-ignore TS6133
function CfnGameServerGroupTargetTrackingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGameServerGroup.TargetTrackingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameServerGroup.TargetTrackingConfigurationProperty>();
  ret.addPropertyResult("targetValue", "TargetValue", (properties.TargetValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameServerGroupAutoScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("estimatedInstanceWarmup", cdk.validateNumber)(properties.estimatedInstanceWarmup));
  errors.collect(cdk.propertyValidator("targetTrackingConfiguration", cdk.requiredValidator)(properties.targetTrackingConfiguration));
  errors.collect(cdk.propertyValidator("targetTrackingConfiguration", CfnGameServerGroupTargetTrackingConfigurationPropertyValidator)(properties.targetTrackingConfiguration));
  return errors.wrap("supplied properties not correct for \"AutoScalingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameServerGroupAutoScalingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameServerGroupAutoScalingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "EstimatedInstanceWarmup": cdk.numberToCloudFormation(properties.estimatedInstanceWarmup),
    "TargetTrackingConfiguration": convertCfnGameServerGroupTargetTrackingConfigurationPropertyToCloudFormation(properties.targetTrackingConfiguration)
  };
}

// @ts-ignore TS6133
function CfnGameServerGroupAutoScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameServerGroup.AutoScalingPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameServerGroup.AutoScalingPolicyProperty>();
  ret.addPropertyResult("estimatedInstanceWarmup", "EstimatedInstanceWarmup", (properties.EstimatedInstanceWarmup != null ? cfn_parse.FromCloudFormation.getNumber(properties.EstimatedInstanceWarmup) : undefined));
  ret.addPropertyResult("targetTrackingConfiguration", "TargetTrackingConfiguration", (properties.TargetTrackingConfiguration != null ? CfnGameServerGroupTargetTrackingConfigurationPropertyFromCloudFormation(properties.TargetTrackingConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameServerGroupLaunchTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchTemplateId", cdk.validateString)(properties.launchTemplateId));
  errors.collect(cdk.propertyValidator("launchTemplateName", cdk.validateString)(properties.launchTemplateName));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameServerGroupLaunchTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameServerGroupLaunchTemplatePropertyValidator(properties).assertSuccess();
  return {
    "LaunchTemplateId": cdk.stringToCloudFormation(properties.launchTemplateId),
    "LaunchTemplateName": cdk.stringToCloudFormation(properties.launchTemplateName),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnGameServerGroupLaunchTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGameServerGroup.LaunchTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameServerGroup.LaunchTemplateProperty>();
  ret.addPropertyResult("launchTemplateId", "LaunchTemplateId", (properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined));
  ret.addPropertyResult("launchTemplateName", "LaunchTemplateName", (properties.LaunchTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateName) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameServerGroupInstanceDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("weightedCapacity", cdk.validateString)(properties.weightedCapacity));
  return errors.wrap("supplied properties not correct for \"InstanceDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameServerGroupInstanceDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameServerGroupInstanceDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "WeightedCapacity": cdk.stringToCloudFormation(properties.weightedCapacity)
  };
}

// @ts-ignore TS6133
function CfnGameServerGroupInstanceDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameServerGroup.InstanceDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameServerGroup.InstanceDefinitionProperty>();
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("weightedCapacity", "WeightedCapacity", (properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getString(properties.WeightedCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGameServerGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGameServerGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameServerGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingPolicy", CfnGameServerGroupAutoScalingPolicyPropertyValidator)(properties.autoScalingPolicy));
  errors.collect(cdk.propertyValidator("balancingStrategy", cdk.validateString)(properties.balancingStrategy));
  errors.collect(cdk.propertyValidator("deleteOption", cdk.validateString)(properties.deleteOption));
  errors.collect(cdk.propertyValidator("gameServerGroupName", cdk.requiredValidator)(properties.gameServerGroupName));
  errors.collect(cdk.propertyValidator("gameServerGroupName", cdk.validateString)(properties.gameServerGroupName));
  errors.collect(cdk.propertyValidator("gameServerProtectionPolicy", cdk.validateString)(properties.gameServerProtectionPolicy));
  errors.collect(cdk.propertyValidator("instanceDefinitions", cdk.requiredValidator)(properties.instanceDefinitions));
  errors.collect(cdk.propertyValidator("instanceDefinitions", cdk.listValidator(CfnGameServerGroupInstanceDefinitionPropertyValidator))(properties.instanceDefinitions));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnGameServerGroupLaunchTemplatePropertyValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcSubnets", cdk.listValidator(cdk.validateString))(properties.vpcSubnets));
  return errors.wrap("supplied properties not correct for \"CfnGameServerGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGameServerGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameServerGroupPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingPolicy": convertCfnGameServerGroupAutoScalingPolicyPropertyToCloudFormation(properties.autoScalingPolicy),
    "BalancingStrategy": cdk.stringToCloudFormation(properties.balancingStrategy),
    "DeleteOption": cdk.stringToCloudFormation(properties.deleteOption),
    "GameServerGroupName": cdk.stringToCloudFormation(properties.gameServerGroupName),
    "GameServerProtectionPolicy": cdk.stringToCloudFormation(properties.gameServerProtectionPolicy),
    "InstanceDefinitions": cdk.listMapper(convertCfnGameServerGroupInstanceDefinitionPropertyToCloudFormation)(properties.instanceDefinitions),
    "LaunchTemplate": convertCfnGameServerGroupLaunchTemplatePropertyToCloudFormation(properties.launchTemplate),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MinSize": cdk.numberToCloudFormation(properties.minSize),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcSubnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSubnets)
  };
}

// @ts-ignore TS6133
function CfnGameServerGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameServerGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameServerGroupProps>();
  ret.addPropertyResult("autoScalingPolicy", "AutoScalingPolicy", (properties.AutoScalingPolicy != null ? CfnGameServerGroupAutoScalingPolicyPropertyFromCloudFormation(properties.AutoScalingPolicy) : undefined));
  ret.addPropertyResult("balancingStrategy", "BalancingStrategy", (properties.BalancingStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.BalancingStrategy) : undefined));
  ret.addPropertyResult("deleteOption", "DeleteOption", (properties.DeleteOption != null ? cfn_parse.FromCloudFormation.getString(properties.DeleteOption) : undefined));
  ret.addPropertyResult("gameServerGroupName", "GameServerGroupName", (properties.GameServerGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GameServerGroupName) : undefined));
  ret.addPropertyResult("gameServerProtectionPolicy", "GameServerProtectionPolicy", (properties.GameServerProtectionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.GameServerProtectionPolicy) : undefined));
  ret.addPropertyResult("instanceDefinitions", "InstanceDefinitions", (properties.InstanceDefinitions != null ? cfn_parse.FromCloudFormation.getArray(CfnGameServerGroupInstanceDefinitionPropertyFromCloudFormation)(properties.InstanceDefinitions) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnGameServerGroupLaunchTemplatePropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcSubnets", "VpcSubnets", (properties.VpcSubnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSubnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GameLift::GameSessionQueue` resource creates a placement queue that processes requests for new game sessions.
 *
 * A queue uses FleetIQ algorithms to determine the best placement locations and find an available game server, then prompts the game server to start a new game session. Queues can have destinations (GameLift fleets or aliases), which determine where the queue can place new game sessions. A queue can have destinations with varied fleet type (Spot and On-Demand), instance type, and AWS Region .
 *
 * @cloudformationResource AWS::GameLift::GameSessionQueue
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html
 */
export class CfnGameSessionQueue extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::GameSessionQueue";

  /**
   * Build a CfnGameSessionQueue from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGameSessionQueue {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGameSessionQueuePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGameSessionQueue(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique Amazon Resource Name (ARN) for the `GameSessionQueue` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A descriptive label that is associated with a game session queue. Names are unique within each Region.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Information to be added to all events that are related to this game session queue.
   */
  public customEventData?: string;

  /**
   * A list of fleets and/or fleet aliases that can be used to fulfill game session placement requests in the queue.
   */
  public destinations?: Array<CfnGameSessionQueue.DestinationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of locations where a queue is allowed to place new game sessions.
   */
  public filterConfiguration?: CfnGameSessionQueue.FilterConfigurationProperty | cdk.IResolvable;

  /**
   * A descriptive label that is associated with game session queue.
   */
  public name: string;

  /**
   * An SNS topic ARN that is set up to receive game session placement notifications.
   */
  public notificationTarget?: string;

  /**
   * A set of policies that act as a sliding cap on player latency.
   */
  public playerLatencyPolicies?: Array<cdk.IResolvable | CfnGameSessionQueue.PlayerLatencyPolicyProperty> | cdk.IResolvable;

  /**
   * Custom settings to use when prioritizing destinations and locations for game session placements.
   */
  public priorityConfiguration?: cdk.IResolvable | CfnGameSessionQueue.PriorityConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new game session queue resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The maximum time, in seconds, that a new game session placement request remains in the queue.
   */
  public timeoutInSeconds?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGameSessionQueueProps) {
    super(scope, id, {
      "type": CfnGameSessionQueue.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.customEventData = props.customEventData;
    this.destinations = props.destinations;
    this.filterConfiguration = props.filterConfiguration;
    this.name = props.name;
    this.notificationTarget = props.notificationTarget;
    this.playerLatencyPolicies = props.playerLatencyPolicies;
    this.priorityConfiguration = props.priorityConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::GameSessionQueue", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeoutInSeconds = props.timeoutInSeconds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customEventData": this.customEventData,
      "destinations": this.destinations,
      "filterConfiguration": this.filterConfiguration,
      "name": this.name,
      "notificationTarget": this.notificationTarget,
      "playerLatencyPolicies": this.playerLatencyPolicies,
      "priorityConfiguration": this.priorityConfiguration,
      "tags": this.tags.renderTags(),
      "timeoutInSeconds": this.timeoutInSeconds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGameSessionQueue.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGameSessionQueuePropsToCloudFormation(props);
  }
}

export namespace CfnGameSessionQueue {
  /**
   * The queue setting that determines the highest latency allowed for individual players when placing a game session.
   *
   * When a latency policy is in force, a game session cannot be placed with any fleet in a Region where a player reports latency higher than the cap. Latency policies are only enforced when the placement request contains player latency information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-playerlatencypolicy.html
   */
  export interface PlayerLatencyPolicyProperty {
    /**
     * The maximum latency value that is allowed for any player, in milliseconds.
     *
     * All policies must have a value set for this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-playerlatencypolicy.html#cfn-gamelift-gamesessionqueue-playerlatencypolicy-maximumindividualplayerlatencymilliseconds
     */
    readonly maximumIndividualPlayerLatencyMilliseconds?: number;

    /**
     * The length of time, in seconds, that the policy is enforced while placing a new game session.
     *
     * A null value for this property means that the policy is enforced until the queue times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-playerlatencypolicy.html#cfn-gamelift-gamesessionqueue-playerlatencypolicy-policydurationseconds
     */
    readonly policyDurationSeconds?: number;
  }

  /**
   * A fleet or alias designated in a game session queue.
   *
   * Queues fulfill requests for new game sessions by placing a new game session on any of the queue's destinations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-gamesessionqueuedestination.html
   */
  export interface GameSessionQueueDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) that is assigned to fleet or fleet alias.
     *
     * ARNs, which include a fleet ID or alias ID and a Region name, provide a unique identifier across all Regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-gamesessionqueuedestination.html#cfn-gamelift-gamesessionqueue-gamesessionqueuedestination-destinationarn
     */
    readonly destinationArn?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-destination.html
   */
  export interface DestinationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-destination.html#cfn-gamelift-gamesessionqueue-destination-destinationarn
     */
    readonly destinationArn?: string;
  }

  /**
   * A list of fleet locations where a game session queue can place new game sessions.
   *
   * You can use a filter to temporarily turn off placements for specific locations. For queues that have multi-location fleets, you can use a filter configuration allow placement with some, but not all of these locations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-filterconfiguration.html
   */
  export interface FilterConfigurationProperty {
    /**
     * A list of locations to allow game session placement in, in the form of AWS Region codes such as `us-west-2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-filterconfiguration.html#cfn-gamelift-gamesessionqueue-filterconfiguration-allowedlocations
     */
    readonly allowedLocations?: Array<string>;
  }

  /**
   * Custom prioritization settings for use by a game session queue when placing new game sessions with available game servers.
   *
   * When defined, this configuration replaces the default FleetIQ prioritization process, which is as follows:
   *
   * - If player latency data is included in a game session request, destinations and locations are prioritized first based on lowest average latency (1), then on lowest hosting cost (2), then on destination list order (3), and finally on location (alphabetical) (4). This approach ensures that the queue's top priority is to place game sessions where average player latency is lowest, and--if latency is the same--where the hosting cost is less, etc.
   * - If player latency data is not included, destinations and locations are prioritized first on destination list order (1), and then on location (alphabetical) (2). This approach ensures that the queue's top priority is to place game sessions on the first destination fleet listed. If that fleet has multiple locations, the game session is placed on the first location (when listed alphabetically).
   *
   * Changing the priority order will affect how game sessions are placed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-priorityconfiguration.html
   */
  export interface PriorityConfigurationProperty {
    /**
     * The prioritization order to use for fleet locations, when the `PriorityOrder` property includes `LOCATION` .
     *
     * Locations are identified by AWS Region codes such as `us-west-2` . Each location can only be listed once.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-priorityconfiguration.html#cfn-gamelift-gamesessionqueue-priorityconfiguration-locationorder
     */
    readonly locationOrder?: Array<string>;

    /**
     * The recommended sequence to use when prioritizing where to place new game sessions.
     *
     * Each type can only be listed once.
     *
     * - `LATENCY` -- FleetIQ prioritizes locations where the average player latency (provided in each game session request) is lowest.
     * - `COST` -- FleetIQ prioritizes destinations with the lowest current hosting costs. Cost is evaluated based on the location, instance type, and fleet type (Spot or On-Demand) for each destination in the queue.
     * - `DESTINATION` -- FleetIQ prioritizes based on the order that destinations are listed in the queue configuration.
     * - `LOCATION` -- FleetIQ prioritizes based on the provided order of locations, as defined in `LocationOrder` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-gamesessionqueue-priorityconfiguration.html#cfn-gamelift-gamesessionqueue-priorityconfiguration-priorityorder
     */
    readonly priorityOrder?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnGameSessionQueue`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html
 */
export interface CfnGameSessionQueueProps {
  /**
   * Information to be added to all events that are related to this game session queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-customeventdata
   */
  readonly customEventData?: string;

  /**
   * A list of fleets and/or fleet aliases that can be used to fulfill game session placement requests in the queue.
   *
   * Destinations are identified by either a fleet ARN or a fleet alias ARN, and are listed in order of placement preference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-destinations
   */
  readonly destinations?: Array<CfnGameSessionQueue.DestinationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of locations where a queue is allowed to place new game sessions.
   *
   * Locations are specified in the form of AWS Region codes, such as `us-west-2` . If this parameter is not set, game sessions can be placed in any queue location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-filterconfiguration
   */
  readonly filterConfiguration?: CfnGameSessionQueue.FilterConfigurationProperty | cdk.IResolvable;

  /**
   * A descriptive label that is associated with game session queue.
   *
   * Queue names must be unique within each Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-name
   */
  readonly name: string;

  /**
   * An SNS topic ARN that is set up to receive game session placement notifications.
   *
   * See [Setting up notifications for game session placement](https://docs.aws.amazon.com/gamelift/latest/developerguide/queue-notification.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-notificationtarget
   */
  readonly notificationTarget?: string;

  /**
   * A set of policies that act as a sliding cap on player latency.
   *
   * FleetIQ works to deliver low latency for most players in a game session. These policies ensure that no individual player can be placed into a game with unreasonably high latency. Use multiple policies to gradually relax latency requirements a step at a time. Multiple policies are applied based on their maximum allowed latency, starting with the lowest value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-playerlatencypolicies
   */
  readonly playerLatencyPolicies?: Array<cdk.IResolvable | CfnGameSessionQueue.PlayerLatencyPolicyProperty> | cdk.IResolvable;

  /**
   * Custom settings to use when prioritizing destinations and locations for game session placements.
   *
   * This configuration replaces the FleetIQ default prioritization process. Priority types that are not explicitly named will be automatically applied at the end of the prioritization process.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-priorityconfiguration
   */
  readonly priorityConfiguration?: cdk.IResolvable | CfnGameSessionQueue.PriorityConfigurationProperty;

  /**
   * A list of labels to assign to the new game session queue resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources are useful for resource management, access management and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference* . Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the AWS General Reference for actual tagging limits.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The maximum time, in seconds, that a new game session placement request remains in the queue.
   *
   * When a request exceeds this time, the game session placement changes to a `TIMED_OUT` status. By default, this property is set to `600` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-gamesessionqueue.html#cfn-gamelift-gamesessionqueue-timeoutinseconds
   */
  readonly timeoutInSeconds?: number;
}

/**
 * Determine whether the given properties match those of a `PlayerLatencyPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `PlayerLatencyPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueuePlayerLatencyPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumIndividualPlayerLatencyMilliseconds", cdk.validateNumber)(properties.maximumIndividualPlayerLatencyMilliseconds));
  errors.collect(cdk.propertyValidator("policyDurationSeconds", cdk.validateNumber)(properties.policyDurationSeconds));
  return errors.wrap("supplied properties not correct for \"PlayerLatencyPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueuePlayerLatencyPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueuePlayerLatencyPolicyPropertyValidator(properties).assertSuccess();
  return {
    "MaximumIndividualPlayerLatencyMilliseconds": cdk.numberToCloudFormation(properties.maximumIndividualPlayerLatencyMilliseconds),
    "PolicyDurationSeconds": cdk.numberToCloudFormation(properties.policyDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueuePlayerLatencyPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGameSessionQueue.PlayerLatencyPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueue.PlayerLatencyPolicyProperty>();
  ret.addPropertyResult("maximumIndividualPlayerLatencyMilliseconds", "MaximumIndividualPlayerLatencyMilliseconds", (properties.MaximumIndividualPlayerLatencyMilliseconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumIndividualPlayerLatencyMilliseconds) : undefined));
  ret.addPropertyResult("policyDurationSeconds", "PolicyDurationSeconds", (properties.PolicyDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PolicyDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GameSessionQueueDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `GameSessionQueueDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueueGameSessionQueueDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  return errors.wrap("supplied properties not correct for \"GameSessionQueueDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueueGameSessionQueueDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueueGameSessionQueueDestinationPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueueGameSessionQueueDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameSessionQueue.GameSessionQueueDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueue.GameSessionQueueDestinationProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueueDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  return errors.wrap("supplied properties not correct for \"DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueueDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueueDestinationPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueueDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameSessionQueue.DestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueue.DestinationProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FilterConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueueFilterConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedLocations", cdk.listValidator(cdk.validateString))(properties.allowedLocations));
  return errors.wrap("supplied properties not correct for \"FilterConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueueFilterConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueueFilterConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedLocations": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedLocations)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueueFilterConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameSessionQueue.FilterConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueue.FilterConfigurationProperty>();
  ret.addPropertyResult("allowedLocations", "AllowedLocations", (properties.AllowedLocations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedLocations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PriorityConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PriorityConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueuePriorityConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("locationOrder", cdk.listValidator(cdk.validateString))(properties.locationOrder));
  errors.collect(cdk.propertyValidator("priorityOrder", cdk.listValidator(cdk.validateString))(properties.priorityOrder));
  return errors.wrap("supplied properties not correct for \"PriorityConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueuePriorityConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueuePriorityConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LocationOrder": cdk.listMapper(cdk.stringToCloudFormation)(properties.locationOrder),
    "PriorityOrder": cdk.listMapper(cdk.stringToCloudFormation)(properties.priorityOrder)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueuePriorityConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGameSessionQueue.PriorityConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueue.PriorityConfigurationProperty>();
  ret.addPropertyResult("locationOrder", "LocationOrder", (properties.LocationOrder != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LocationOrder) : undefined));
  ret.addPropertyResult("priorityOrder", "PriorityOrder", (properties.PriorityOrder != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PriorityOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGameSessionQueueProps`
 *
 * @param properties - the TypeScript properties of a `CfnGameSessionQueueProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGameSessionQueuePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customEventData", cdk.validateString)(properties.customEventData));
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnGameSessionQueueDestinationPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("filterConfiguration", CfnGameSessionQueueFilterConfigurationPropertyValidator)(properties.filterConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("notificationTarget", cdk.validateString)(properties.notificationTarget));
  errors.collect(cdk.propertyValidator("playerLatencyPolicies", cdk.listValidator(CfnGameSessionQueuePlayerLatencyPolicyPropertyValidator))(properties.playerLatencyPolicies));
  errors.collect(cdk.propertyValidator("priorityConfiguration", CfnGameSessionQueuePriorityConfigurationPropertyValidator)(properties.priorityConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"CfnGameSessionQueueProps\"");
}

// @ts-ignore TS6133
function convertCfnGameSessionQueuePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGameSessionQueuePropsValidator(properties).assertSuccess();
  return {
    "CustomEventData": cdk.stringToCloudFormation(properties.customEventData),
    "Destinations": cdk.listMapper(convertCfnGameSessionQueueDestinationPropertyToCloudFormation)(properties.destinations),
    "FilterConfiguration": convertCfnGameSessionQueueFilterConfigurationPropertyToCloudFormation(properties.filterConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NotificationTarget": cdk.stringToCloudFormation(properties.notificationTarget),
    "PlayerLatencyPolicies": cdk.listMapper(convertCfnGameSessionQueuePlayerLatencyPolicyPropertyToCloudFormation)(properties.playerLatencyPolicies),
    "PriorityConfiguration": convertCfnGameSessionQueuePriorityConfigurationPropertyToCloudFormation(properties.priorityConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnGameSessionQueuePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGameSessionQueueProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGameSessionQueueProps>();
  ret.addPropertyResult("customEventData", "CustomEventData", (properties.CustomEventData != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEventData) : undefined));
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnGameSessionQueueDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("filterConfiguration", "FilterConfiguration", (properties.FilterConfiguration != null ? CfnGameSessionQueueFilterConfigurationPropertyFromCloudFormation(properties.FilterConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("notificationTarget", "NotificationTarget", (properties.NotificationTarget != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTarget) : undefined));
  ret.addPropertyResult("playerLatencyPolicies", "PlayerLatencyPolicies", (properties.PlayerLatencyPolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnGameSessionQueuePlayerLatencyPolicyPropertyFromCloudFormation)(properties.PlayerLatencyPolicies) : undefined));
  ret.addPropertyResult("priorityConfiguration", "PriorityConfiguration", (properties.PriorityConfiguration != null ? CfnGameSessionQueuePriorityConfigurationPropertyFromCloudFormation(properties.PriorityConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::GameLift::Location resource creates a custom location for use in an Anywhere fleet.
 *
 * @cloudformationResource AWS::GameLift::Location
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-location.html
 */
export class CfnLocation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::Location";

  /**
   * Build a CfnLocation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the custom location. For example, `arn:aws:gamelift:[region]::location/location-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912` .
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * A descriptive name for the custom location.
   */
  public locationName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new matchmaking configuration resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationProps) {
    super(scope, id, {
      "type": CfnLocation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "locationName", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.locationName = props.locationName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::Location", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "locationName": this.locationName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLocation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-location.html
 */
export interface CfnLocationProps {
  /**
   * A descriptive name for the custom location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-location.html#cfn-gamelift-location-locationname
   */
  readonly locationName: string;

  /**
   * A list of labels to assign to the new matchmaking configuration resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources are useful for resource management, access management and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Rareference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-location.html#cfn-gamelift-location-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnLocationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("locationName", cdk.requiredValidator)(properties.locationName));
  errors.collect(cdk.propertyValidator("locationName", cdk.validateString)(properties.locationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationPropsValidator(properties).assertSuccess();
  return {
    "LocationName": cdk.stringToCloudFormation(properties.locationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationProps>();
  ret.addPropertyResult("locationName", "LocationName", (properties.LocationName != null ? cfn_parse.FromCloudFormation.getString(properties.LocationName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GameLift::MatchmakingConfiguration` resource defines a new matchmaking configuration for use with FlexMatch.
 *
 * Whether you're using FlexMatch with GameLift hosting or as a standalone matchmaking service, the matchmaking configuration sets out rules for matching players and forming teams. If you're using GameLift hosting, it also defines how to start game sessions for each match. Your matchmaking system can use multiple configurations to handle different game scenarios. All matchmaking requests identify the matchmaking configuration to use and provide player attributes that are consistent with that configuration.
 *
 * @cloudformationResource AWS::GameLift::MatchmakingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html
 */
export class CfnMatchmakingConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::MatchmakingConfiguration";

  /**
   * Build a CfnMatchmakingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMatchmakingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMatchmakingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMatchmakingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique Amazon Resource Name (ARN) for the `MatchmakingConfiguration` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The `MatchmakingConfiguration` name, which is unique.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * A flag that determines whether a match that was created with this configuration must be accepted by the matched players.
   */
  public acceptanceRequired: boolean | cdk.IResolvable;

  /**
   * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required.
   */
  public acceptanceTimeoutSeconds?: number;

  /**
   * The number of player slots in a match to keep open for future players.
   */
  public additionalPlayerCount?: number;

  /**
   * The method used to backfill game sessions that are created with this matchmaking configuration.
   */
  public backfillMode?: string;

  /**
   * A time stamp indicating when this data object was created.
   */
  public creationTime?: string;

  /**
   * Information to add to all events related to the matchmaking configuration.
   */
  public customEventData?: string;

  /**
   * A description for the matchmaking configuration.
   */
  public description?: string;

  /**
   * Indicates whether this matchmaking configuration is being used with Amazon GameLift hosting or as a standalone matchmaking solution.
   */
  public flexMatchMode?: string;

  /**
   * A set of custom properties for a game session, formatted as key-value pairs.
   */
  public gameProperties?: Array<CfnMatchmakingConfiguration.GamePropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A set of custom game session properties, formatted as a single string value.
   */
  public gameSessionData?: string;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is `arn:aws:gamelift:<region>::gamesessionqueue/<queue name>` . Queues can be located in any Region. Queues are used to start new Amazon GameLift-hosted game sessions for matches that are created with this matchmaking configuration. If `FlexMatchMode` is set to `STANDALONE` , do not set this parameter.
   */
  public gameSessionQueueArns?: Array<string>;

  /**
   * A unique identifier for the matchmaking configuration.
   */
  public name: string;

  /**
   * An SNS topic ARN that is set up to receive matchmaking notifications.
   */
  public notificationTarget?: string;

  /**
   * The maximum duration, in seconds, that a matchmaking ticket can remain in process before timing out.
   */
  public requestTimeoutSeconds: number;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) associated with the GameLift matchmaking rule set resource that this configuration uses.
   */
  public ruleSetArn?: string;

  /**
   * A unique identifier for the matchmaking rule set to use with this configuration.
   */
  public ruleSetName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new matchmaking configuration resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMatchmakingConfigurationProps) {
    super(scope, id, {
      "type": CfnMatchmakingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "acceptanceRequired", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "requestTimeoutSeconds", this);
    cdk.requireProperty(props, "ruleSetName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.acceptanceRequired = props.acceptanceRequired;
    this.acceptanceTimeoutSeconds = props.acceptanceTimeoutSeconds;
    this.additionalPlayerCount = props.additionalPlayerCount;
    this.backfillMode = props.backfillMode;
    this.creationTime = props.creationTime;
    this.customEventData = props.customEventData;
    this.description = props.description;
    this.flexMatchMode = props.flexMatchMode;
    this.gameProperties = props.gameProperties;
    this.gameSessionData = props.gameSessionData;
    this.gameSessionQueueArns = props.gameSessionQueueArns;
    this.name = props.name;
    this.notificationTarget = props.notificationTarget;
    this.requestTimeoutSeconds = props.requestTimeoutSeconds;
    this.ruleSetArn = props.ruleSetArn;
    this.ruleSetName = props.ruleSetName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::MatchmakingConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptanceRequired": this.acceptanceRequired,
      "acceptanceTimeoutSeconds": this.acceptanceTimeoutSeconds,
      "additionalPlayerCount": this.additionalPlayerCount,
      "backfillMode": this.backfillMode,
      "creationTime": this.creationTime,
      "customEventData": this.customEventData,
      "description": this.description,
      "flexMatchMode": this.flexMatchMode,
      "gameProperties": this.gameProperties,
      "gameSessionData": this.gameSessionData,
      "gameSessionQueueArns": this.gameSessionQueueArns,
      "name": this.name,
      "notificationTarget": this.notificationTarget,
      "requestTimeoutSeconds": this.requestTimeoutSeconds,
      "ruleSetArn": this.ruleSetArn,
      "ruleSetName": this.ruleSetName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMatchmakingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMatchmakingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnMatchmakingConfiguration {
  /**
   * This key-value pair can store custom data about a game session.
   *
   * For example, you might use a `GameProperty` to track a game session's map, level of difficulty, or remaining time. The difficulty level could be specified like this: `{"Key": "difficulty", "Value":"Novice"}` .
   *
   * You can set game properties when creating a game session. You can also modify game properties of an active game session. When searching for game sessions, you can filter on game property keys and values. You can't delete game properties from a game session.
   *
   * For examples of working with game properties, see [Create a game session with properties](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-client-api.html#game-properties) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-matchmakingconfiguration-gameproperty.html
   */
  export interface GamePropertyProperty {
    /**
     * The game property identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-matchmakingconfiguration-gameproperty.html#cfn-gamelift-matchmakingconfiguration-gameproperty-key
     */
    readonly key: string;

    /**
     * The game property value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-matchmakingconfiguration-gameproperty.html#cfn-gamelift-matchmakingconfiguration-gameproperty-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnMatchmakingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html
 */
export interface CfnMatchmakingConfigurationProps {
  /**
   * A flag that determines whether a match that was created with this configuration must be accepted by the matched players.
   *
   * To require acceptance, set to `TRUE` . With this option enabled, matchmaking tickets use the status `REQUIRES_ACCEPTANCE` to indicate when a completed potential match is waiting for player acceptance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-acceptancerequired
   */
  readonly acceptanceRequired: boolean | cdk.IResolvable;

  /**
   * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-acceptancetimeoutseconds
   */
  readonly acceptanceTimeoutSeconds?: number;

  /**
   * The number of player slots in a match to keep open for future players.
   *
   * For example, if the configuration's rule set specifies a match for a single 10-person team, and the additional player count is set to 2, 10 players will be selected for the match and 2 more player slots will be open for future players. This parameter is not used if `FlexMatchMode` is set to `STANDALONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-additionalplayercount
   */
  readonly additionalPlayerCount?: number;

  /**
   * The method used to backfill game sessions that are created with this matchmaking configuration.
   *
   * Specify `MANUAL` when your game manages backfill requests manually or does not use the match backfill feature. Specify `AUTOMATIC` to have GameLift create a `StartMatchBackfill` request whenever a game session has one or more open slots. Learn more about manual and automatic backfill in [Backfill Existing Games with FlexMatch](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-backfill.html) . Automatic backfill is not available when `FlexMatchMode` is set to `STANDALONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-backfillmode
   */
  readonly backfillMode?: string;

  /**
   * A time stamp indicating when this data object was created.
   *
   * Format is a number expressed in Unix time as milliseconds (for example `"1469498468.057"` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-creationtime
   */
  readonly creationTime?: string;

  /**
   * Information to add to all events related to the matchmaking configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-customeventdata
   */
  readonly customEventData?: string;

  /**
   * A description for the matchmaking configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-description
   */
  readonly description?: string;

  /**
   * Indicates whether this matchmaking configuration is being used with Amazon GameLift hosting or as a standalone matchmaking solution.
   *
   * - *STANDALONE* - FlexMatch forms matches and returns match information, including players and team assignments, in a [MatchmakingSucceeded](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-events.html#match-events-matchmakingsucceeded) event.
   * - *WITH_QUEUE* - FlexMatch forms matches and uses the specified Amazon GameLift queue to start a game session for the match.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-flexmatchmode
   */
  readonly flexMatchMode?: string;

  /**
   * A set of custom properties for a game session, formatted as key-value pairs.
   *
   * These properties are passed to a game server process with a request to start a new game session. See [Start a Game Session](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession) . This parameter is not used if `FlexMatchMode` is set to `STANDALONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-gameproperties
   */
  readonly gameProperties?: Array<CfnMatchmakingConfiguration.GamePropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A set of custom game session properties, formatted as a single string value.
   *
   * This data is passed to a game server process with a request to start a new game session. See [Start a Game Session](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-sdk-server-api.html#gamelift-sdk-server-startsession) . This parameter is not used if `FlexMatchMode` is set to `STANDALONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-gamesessiondata
   */
  readonly gameSessionData?: string;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is `arn:aws:gamelift:<region>::gamesessionqueue/<queue name>` . Queues can be located in any Region. Queues are used to start new Amazon GameLift-hosted game sessions for matches that are created with this matchmaking configuration. If `FlexMatchMode` is set to `STANDALONE` , do not set this parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-gamesessionqueuearns
   */
  readonly gameSessionQueueArns?: Array<string>;

  /**
   * A unique identifier for the matchmaking configuration.
   *
   * This name is used to identify the configuration associated with a matchmaking request or ticket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-name
   */
  readonly name: string;

  /**
   * An SNS topic ARN that is set up to receive matchmaking notifications.
   *
   * See [Setting up notifications for matchmaking](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-notification.html) for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-notificationtarget
   */
  readonly notificationTarget?: string;

  /**
   * The maximum duration, in seconds, that a matchmaking ticket can remain in process before timing out.
   *
   * Requests that fail due to timing out can be resubmitted as needed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-requesttimeoutseconds
   */
  readonly requestTimeoutSeconds: number;

  /**
   * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) associated with the GameLift matchmaking rule set resource that this configuration uses.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-rulesetarn
   */
  readonly ruleSetArn?: string;

  /**
   * A unique identifier for the matchmaking rule set to use with this configuration.
   *
   * You can use either the rule set name or ARN value. A matchmaking configuration can only use rule sets that are defined in the same Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-rulesetname
   */
  readonly ruleSetName: string;

  /**
   * A list of labels to assign to the new matchmaking configuration resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources are useful for resource management, access management and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference* . Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the AWS General Reference for actual tagging limits.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingconfiguration.html#cfn-gamelift-matchmakingconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `GamePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `GamePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchmakingConfigurationGamePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"GamePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnMatchmakingConfigurationGamePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchmakingConfigurationGamePropertyPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnMatchmakingConfigurationGamePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchmakingConfiguration.GamePropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchmakingConfiguration.GamePropertyProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMatchmakingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnMatchmakingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchmakingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptanceRequired", cdk.requiredValidator)(properties.acceptanceRequired));
  errors.collect(cdk.propertyValidator("acceptanceRequired", cdk.validateBoolean)(properties.acceptanceRequired));
  errors.collect(cdk.propertyValidator("acceptanceTimeoutSeconds", cdk.validateNumber)(properties.acceptanceTimeoutSeconds));
  errors.collect(cdk.propertyValidator("additionalPlayerCount", cdk.validateNumber)(properties.additionalPlayerCount));
  errors.collect(cdk.propertyValidator("backfillMode", cdk.validateString)(properties.backfillMode));
  errors.collect(cdk.propertyValidator("creationTime", cdk.validateString)(properties.creationTime));
  errors.collect(cdk.propertyValidator("customEventData", cdk.validateString)(properties.customEventData));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("flexMatchMode", cdk.validateString)(properties.flexMatchMode));
  errors.collect(cdk.propertyValidator("gameProperties", cdk.listValidator(CfnMatchmakingConfigurationGamePropertyPropertyValidator))(properties.gameProperties));
  errors.collect(cdk.propertyValidator("gameSessionData", cdk.validateString)(properties.gameSessionData));
  errors.collect(cdk.propertyValidator("gameSessionQueueArns", cdk.listValidator(cdk.validateString))(properties.gameSessionQueueArns));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("notificationTarget", cdk.validateString)(properties.notificationTarget));
  errors.collect(cdk.propertyValidator("requestTimeoutSeconds", cdk.requiredValidator)(properties.requestTimeoutSeconds));
  errors.collect(cdk.propertyValidator("requestTimeoutSeconds", cdk.validateNumber)(properties.requestTimeoutSeconds));
  errors.collect(cdk.propertyValidator("ruleSetArn", cdk.validateString)(properties.ruleSetArn));
  errors.collect(cdk.propertyValidator("ruleSetName", cdk.requiredValidator)(properties.ruleSetName));
  errors.collect(cdk.propertyValidator("ruleSetName", cdk.validateString)(properties.ruleSetName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMatchmakingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnMatchmakingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchmakingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AcceptanceRequired": cdk.booleanToCloudFormation(properties.acceptanceRequired),
    "AcceptanceTimeoutSeconds": cdk.numberToCloudFormation(properties.acceptanceTimeoutSeconds),
    "AdditionalPlayerCount": cdk.numberToCloudFormation(properties.additionalPlayerCount),
    "BackfillMode": cdk.stringToCloudFormation(properties.backfillMode),
    "CreationTime": cdk.stringToCloudFormation(properties.creationTime),
    "CustomEventData": cdk.stringToCloudFormation(properties.customEventData),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FlexMatchMode": cdk.stringToCloudFormation(properties.flexMatchMode),
    "GameProperties": cdk.listMapper(convertCfnMatchmakingConfigurationGamePropertyPropertyToCloudFormation)(properties.gameProperties),
    "GameSessionData": cdk.stringToCloudFormation(properties.gameSessionData),
    "GameSessionQueueArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.gameSessionQueueArns),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NotificationTarget": cdk.stringToCloudFormation(properties.notificationTarget),
    "RequestTimeoutSeconds": cdk.numberToCloudFormation(properties.requestTimeoutSeconds),
    "RuleSetArn": cdk.stringToCloudFormation(properties.ruleSetArn),
    "RuleSetName": cdk.stringToCloudFormation(properties.ruleSetName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMatchmakingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchmakingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchmakingConfigurationProps>();
  ret.addPropertyResult("acceptanceRequired", "AcceptanceRequired", (properties.AcceptanceRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AcceptanceRequired) : undefined));
  ret.addPropertyResult("acceptanceTimeoutSeconds", "AcceptanceTimeoutSeconds", (properties.AcceptanceTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AcceptanceTimeoutSeconds) : undefined));
  ret.addPropertyResult("additionalPlayerCount", "AdditionalPlayerCount", (properties.AdditionalPlayerCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.AdditionalPlayerCount) : undefined));
  ret.addPropertyResult("backfillMode", "BackfillMode", (properties.BackfillMode != null ? cfn_parse.FromCloudFormation.getString(properties.BackfillMode) : undefined));
  ret.addPropertyResult("creationTime", "CreationTime", (properties.CreationTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreationTime) : undefined));
  ret.addPropertyResult("customEventData", "CustomEventData", (properties.CustomEventData != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEventData) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("flexMatchMode", "FlexMatchMode", (properties.FlexMatchMode != null ? cfn_parse.FromCloudFormation.getString(properties.FlexMatchMode) : undefined));
  ret.addPropertyResult("gameProperties", "GameProperties", (properties.GameProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnMatchmakingConfigurationGamePropertyPropertyFromCloudFormation)(properties.GameProperties) : undefined));
  ret.addPropertyResult("gameSessionData", "GameSessionData", (properties.GameSessionData != null ? cfn_parse.FromCloudFormation.getString(properties.GameSessionData) : undefined));
  ret.addPropertyResult("gameSessionQueueArns", "GameSessionQueueArns", (properties.GameSessionQueueArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.GameSessionQueueArns) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("notificationTarget", "NotificationTarget", (properties.NotificationTarget != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTarget) : undefined));
  ret.addPropertyResult("requestTimeoutSeconds", "RequestTimeoutSeconds", (properties.RequestTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.RequestTimeoutSeconds) : undefined));
  ret.addPropertyResult("ruleSetArn", "RuleSetArn", (properties.RuleSetArn != null ? cfn_parse.FromCloudFormation.getString(properties.RuleSetArn) : undefined));
  ret.addPropertyResult("ruleSetName", "RuleSetName", (properties.RuleSetName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleSetName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new rule set for FlexMatch matchmaking.
 *
 * A rule set describes the type of match to create, such as the number and size of teams. It also sets the parameters for acceptable player matches, such as minimum skill level or character type.
 *
 * To create a matchmaking rule set, provide unique rule set name and the rule set body in JSON format. Rule sets must be defined in the same Region as the matchmaking configuration they are used with.
 *
 * Since matchmaking rule sets cannot be edited, it is a good idea to check the rule set syntax.
 *
 * *Learn more*
 *
 * - [Build a rule set](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-rulesets.html)
 * - [Design a matchmaker](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-configuration.html)
 * - [Matchmaking with FlexMatch](https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-intro.html)
 *
 * @cloudformationResource AWS::GameLift::MatchmakingRuleSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingruleset.html
 */
export class CfnMatchmakingRuleSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::MatchmakingRuleSet";

  /**
   * Build a CfnMatchmakingRuleSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMatchmakingRuleSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMatchmakingRuleSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMatchmakingRuleSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique Amazon Resource Name (ARN) assigned to the rule set.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example `"1469498468.057"` ).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The unique name of the rule set.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * A unique identifier for the matchmaking rule set.
   */
  public name: string;

  /**
   * A collection of matchmaking rules, formatted as a JSON string.
   */
  public ruleSetBody: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new matchmaking rule set resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMatchmakingRuleSetProps) {
    super(scope, id, {
      "type": CfnMatchmakingRuleSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "ruleSetBody", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.ruleSetBody = props.ruleSetBody;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::MatchmakingRuleSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "ruleSetBody": this.ruleSetBody,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMatchmakingRuleSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMatchmakingRuleSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMatchmakingRuleSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingruleset.html
 */
export interface CfnMatchmakingRuleSetProps {
  /**
   * A unique identifier for the matchmaking rule set.
   *
   * A matchmaking configuration identifies the rule set it uses by this name value. Note that the rule set name is different from the optional `name` field in the rule set body.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingruleset.html#cfn-gamelift-matchmakingruleset-name
   */
  readonly name: string;

  /**
   * A collection of matchmaking rules, formatted as a JSON string.
   *
   * Comments are not allowed in JSON, but most elements support a description field.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingruleset.html#cfn-gamelift-matchmakingruleset-rulesetbody
   */
  readonly ruleSetBody: string;

  /**
   * A list of labels to assign to the new matchmaking rule set resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources are useful for resource management, access management and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference* . Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the AWS General Reference for actual tagging limits.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-matchmakingruleset.html#cfn-gamelift-matchmakingruleset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnMatchmakingRuleSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnMatchmakingRuleSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMatchmakingRuleSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ruleSetBody", cdk.requiredValidator)(properties.ruleSetBody));
  errors.collect(cdk.propertyValidator("ruleSetBody", cdk.validateString)(properties.ruleSetBody));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMatchmakingRuleSetProps\"");
}

// @ts-ignore TS6133
function convertCfnMatchmakingRuleSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMatchmakingRuleSetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuleSetBody": cdk.stringToCloudFormation(properties.ruleSetBody),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMatchmakingRuleSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMatchmakingRuleSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMatchmakingRuleSetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ruleSetBody", "RuleSetBody", (properties.RuleSetBody != null ? cfn_parse.FromCloudFormation.getString(properties.RuleSetBody) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GameLift::Script` resource creates a new script record for your Realtime Servers script.
 *
 * Realtime scripts are JavaScript that provide configuration settings and optional custom game logic for your game. The script is deployed when you create a Realtime Servers fleet to host your game sessions. Script logic is executed during an active game session.
 *
 * @cloudformationResource AWS::GameLift::Script
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html
 */
export class CfnScript extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GameLift::Script";

  /**
   * Build a CfnScript from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScript {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScriptPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScript(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique Amazon Resource Name (ARN) for the script.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example `"1469498468.057"` ).
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * A unique identifier for a Realtime script.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The file size of the uploaded Realtime script, expressed in bytes. When files are uploaded from an S3 location, this value remains at "0".
   *
   * @cloudformationAttribute SizeOnDisk
   */
  public readonly attrSizeOnDisk: number;

  /**
   * A descriptive label that is associated with a script.
   */
  public name?: string;

  /**
   * The location of the Amazon S3 bucket where a zipped file containing your Realtime scripts is stored.
   */
  public storageLocation: cdk.IResolvable | CfnScript.S3LocationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of labels to assign to the new script resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The version that is associated with a build or script.
   */
  public version?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScriptProps) {
    super(scope, id, {
      "type": CfnScript.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "storageLocation", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrSizeOnDisk = cdk.Token.asNumber(this.getAtt("SizeOnDisk", cdk.ResolutionTypeHint.NUMBER));
    this.name = props.name;
    this.storageLocation = props.storageLocation;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GameLift::Script", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "storageLocation": this.storageLocation,
      "tags": this.tags.renderTags(),
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScript.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScriptPropsToCloudFormation(props);
  }
}

export namespace CfnScript {
  /**
   * The location in Amazon S3 where build or script files can be stored for access by Amazon GameLift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-script-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * An Amazon S3 bucket identifier. Thename of the S3 bucket.
     *
     * > Amazon GameLift doesn't support uploading from Amazon S3 buckets with names that contain a dot (.).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-script-s3location.html#cfn-gamelift-script-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The name of the zip file that contains the build files or script files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-script-s3location.html#cfn-gamelift-script-s3location-key
     */
    readonly key: string;

    /**
     * The version of the file, if object versioning is turned on for the bucket.
     *
     * Amazon GameLift uses this information when retrieving files from an S3 bucket that you own. Use this parameter to specify a specific version of the file. If not set, the latest version of the file is retrieved.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-script-s3location.html#cfn-gamelift-script-s3location-objectversion
     */
    readonly objectVersion?: string;

    /**
     * The Amazon Resource Name ( [ARN](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-arn-format.html) ) for an IAM role that allows Amazon GameLift to access the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-gamelift-script-s3location.html#cfn-gamelift-script-s3location-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnScript`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html
 */
export interface CfnScriptProps {
  /**
   * A descriptive label that is associated with a script.
   *
   * Script names do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html#cfn-gamelift-script-name
   */
  readonly name?: string;

  /**
   * The location of the Amazon S3 bucket where a zipped file containing your Realtime scripts is stored.
   *
   * The storage location must specify the Amazon S3 bucket name, the zip file name (the "key"), and a role ARN that allows Amazon GameLift to access the Amazon S3 storage location. The S3 bucket must be in the same Region where you want to create a new script. By default, Amazon GameLift uploads the latest version of the zip file; if you have S3 object versioning turned on, you can use the `ObjectVersion` parameter to specify an earlier version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html#cfn-gamelift-script-storagelocation
   */
  readonly storageLocation: cdk.IResolvable | CfnScript.S3LocationProperty;

  /**
   * A list of labels to assign to the new script resource.
   *
   * Tags are developer-defined key-value pairs. Tagging AWS resources are useful for resource management, access management and cost allocation. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference* . Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the AWS General Reference for actual tagging limits.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html#cfn-gamelift-script-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The version that is associated with a build or script.
   *
   * Version strings do not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-script.html#cfn-gamelift-script-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScriptS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("objectVersion", cdk.validateString)(properties.objectVersion));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScriptS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScriptS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "ObjectVersion": cdk.stringToCloudFormation(properties.objectVersion),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnScriptS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScript.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScript.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("objectVersion", "ObjectVersion", (properties.ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersion) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScriptProps`
 *
 * @param properties - the TypeScript properties of a `CfnScriptProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScriptPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("storageLocation", cdk.requiredValidator)(properties.storageLocation));
  errors.collect(cdk.propertyValidator("storageLocation", CfnScriptS3LocationPropertyValidator)(properties.storageLocation));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnScriptProps\"");
}

// @ts-ignore TS6133
function convertCfnScriptPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScriptPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "StorageLocation": convertCfnScriptS3LocationPropertyToCloudFormation(properties.storageLocation),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnScriptPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScriptProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScriptProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("storageLocation", "StorageLocation", (properties.StorageLocation != null ? CfnScriptS3LocationPropertyFromCloudFormation(properties.StorageLocation) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}