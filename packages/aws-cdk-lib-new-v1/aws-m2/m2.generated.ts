/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a new application with given parameters. Requires an existing runtime environment and application definition file.
 *
 * For information about application definitions, see the [AWS Mainframe Modernization User Guide](https://docs.aws.amazon.com/m2/latest/userguide/applications-m2-definition.html) .
 *
 * @cloudformationResource AWS::M2::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::M2::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the application.
   *
   * @cloudformationAttribute ApplicationArn
   */
  public readonly attrApplicationArn: string;

  /**
   * The identifier of the application.
   *
   * @cloudformationAttribute ApplicationId
   */
  public readonly attrApplicationId: string;

  /**
   * The application definition for a particular application. You can specify either inline JSON or an Amazon S3 bucket location.
   */
  public definition: CfnApplication.DefinitionProperty | cdk.IResolvable;

  /**
   * The description of the application.
   */
  public description?: string;

  /**
   * The type of the target platform for this application.
   */
  public engineType: string;

  /**
   * The identifier of a customer managed key.
   */
  public kmsKeyId?: string;

  /**
   * The name of the application.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the role associated with the application.
   */
  public roleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "definition", this);
    cdk.requireProperty(props, "engineType", this);
    cdk.requireProperty(props, "name", this);

    this.attrApplicationArn = cdk.Token.asString(this.getAtt("ApplicationArn", cdk.ResolutionTypeHint.STRING));
    this.attrApplicationId = cdk.Token.asString(this.getAtt("ApplicationId", cdk.ResolutionTypeHint.STRING));
    this.definition = props.definition;
    this.description = props.description;
    this.engineType = props.engineType;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::M2::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "definition": this.definition,
      "description": this.description,
      "engineType": this.engineType,
      "kmsKeyId": this.kmsKeyId,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * The application definition for a particular application.
   *
   * You can specify either inline JSON or an Amazon S3 bucket location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html
   */
  export interface DefinitionProperty {
    /**
     * The content of the application definition.
     *
     * This is a JSON object that contains the resource configuration/definitions that identify an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html#cfn-m2-application-definition-content
     */
    readonly content?: string;

    /**
     * The S3 bucket that contains the application definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html#cfn-m2-application-definition-s3location
     */
    readonly s3Location?: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html
 */
export interface CfnApplicationProps {
  /**
   * The application definition for a particular application. You can specify either inline JSON or an Amazon S3 bucket location.
   *
   * For information about application definitions, see the [AWS Mainframe Modernization User Guide](https://docs.aws.amazon.com/m2/latest/userguide/applications-m2-definition.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-definition
   */
  readonly definition: CfnApplication.DefinitionProperty | cdk.IResolvable;

  /**
   * The description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-description
   */
  readonly description?: string;

  /**
   * The type of the target platform for this application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-enginetype
   */
  readonly engineType: string;

  /**
   * The identifier of a customer managed key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the role associated with the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-rolearn
   */
  readonly roleArn?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("s3Location", cdk.validateString)(properties.s3Location));
  return errors.wrap("supplied properties not correct for \"DefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "S3Location": cdk.stringToCloudFormation(properties.s3Location)
  };
}

// @ts-ignore TS6133
function CfnApplicationDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.DefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.DefinitionProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("s3Location", "S3Location", (properties.S3Location != null ? cfn_parse.FromCloudFormation.getString(properties.S3Location) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", CfnApplicationDefinitionPropertyValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engineType", cdk.requiredValidator)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineType", cdk.validateString)(properties.engineType));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "Definition": convertCfnApplicationDefinitionPropertyToCloudFormation(properties.definition),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EngineType": cdk.stringToCloudFormation(properties.engineType),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? CfnApplicationDefinitionPropertyFromCloudFormation(properties.Definition) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engineType", "EngineType", (properties.EngineType != null ? cfn_parse.FromCloudFormation.getString(properties.EngineType) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a runtime environment for a given runtime engine.
 *
 * @cloudformationResource AWS::M2::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::M2::Environment";

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
   * The Amazon Resource Name (ARN) of the runtime environment.
   *
   * @cloudformationAttribute EnvironmentArn
   */
  public readonly attrEnvironmentArn: string;

  /**
   * The unique identifier of the runtime environment.
   *
   * @cloudformationAttribute EnvironmentId
   */
  public readonly attrEnvironmentId: string;

  /**
   * The description of the runtime environment.
   */
  public description?: string;

  /**
   * The target platform for the runtime environment.
   */
  public engineType: string;

  /**
   * The version of the runtime engine.
   */
  public engineVersion?: string;

  /**
   * Defines the details of a high availability configuration.
   */
  public highAvailabilityConfig?: CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable;

  /**
   * The instance type of the runtime environment.
   */
  public instanceType: string;

  /**
   * The identifier of a customer managed key.
   */
  public kmsKeyId?: string;

  /**
   * The name of the runtime environment.
   */
  public name: string;

  /**
   * Configures the maintenance window that you want for the runtime environment.
   */
  public preferredMaintenanceWindow?: string;

  /**
   * Specifies whether the runtime environment is publicly accessible.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The list of security groups for the VPC associated with this runtime environment.
   */
  public securityGroupIds?: Array<string>;

  /**
   * Defines the storage configuration for a runtime environment.
   */
  public storageConfigurations?: Array<cdk.IResolvable | CfnEnvironment.StorageConfigurationProperty> | cdk.IResolvable;

  /**
   * The list of subnets associated with the VPC for this runtime environment.
   */
  public subnetIds?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

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

    cdk.requireProperty(props, "engineType", this);
    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "name", this);

    this.attrEnvironmentArn = cdk.Token.asString(this.getAtt("EnvironmentArn", cdk.ResolutionTypeHint.STRING));
    this.attrEnvironmentId = cdk.Token.asString(this.getAtt("EnvironmentId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.engineType = props.engineType;
    this.engineVersion = props.engineVersion;
    this.highAvailabilityConfig = props.highAvailabilityConfig;
    this.instanceType = props.instanceType;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.publiclyAccessible = props.publiclyAccessible;
    this.securityGroupIds = props.securityGroupIds;
    this.storageConfigurations = props.storageConfigurations;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::M2::Environment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "engineType": this.engineType,
      "engineVersion": this.engineVersion,
      "highAvailabilityConfig": this.highAvailabilityConfig,
      "instanceType": this.instanceType,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "publiclyAccessible": this.publiclyAccessible,
      "securityGroupIds": this.securityGroupIds,
      "storageConfigurations": this.storageConfigurations,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags()
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
   * Defines the details of a high availability configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-highavailabilityconfig.html
   */
  export interface HighAvailabilityConfigProperty {
    /**
     * The number of instances in a high availability configuration.
     *
     * The minimum possible value is 1 and the maximum is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-highavailabilityconfig.html#cfn-m2-environment-highavailabilityconfig-desiredcapacity
     */
    readonly desiredCapacity: number;
  }

  /**
   * Defines the storage configuration for a runtime environment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html
   */
  export interface StorageConfigurationProperty {
    /**
     * Defines the storage configuration for an Amazon EFS file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html#cfn-m2-environment-storageconfiguration-efs
     */
    readonly efs?: CfnEnvironment.EfsStorageConfigurationProperty | cdk.IResolvable;

    /**
     * Defines the storage configuration for an Amazon FSx file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html#cfn-m2-environment-storageconfiguration-fsx
     */
    readonly fsx?: CfnEnvironment.FsxStorageConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Defines the storage configuration for an Amazon EFS file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html
   */
  export interface EfsStorageConfigurationProperty {
    /**
     * The file system identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html#cfn-m2-environment-efsstorageconfiguration-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * The mount point for the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html#cfn-m2-environment-efsstorageconfiguration-mountpoint
     */
    readonly mountPoint: string;
  }

  /**
   * Defines the storage configuration for an Amazon FSx file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html
   */
  export interface FsxStorageConfigurationProperty {
    /**
     * The file system identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html#cfn-m2-environment-fsxstorageconfiguration-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * The mount point for the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html#cfn-m2-environment-fsxstorageconfiguration-mountpoint
     */
    readonly mountPoint: string;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * The description of the runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-description
   */
  readonly description?: string;

  /**
   * The target platform for the runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-enginetype
   */
  readonly engineType: string;

  /**
   * The version of the runtime engine.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-engineversion
   */
  readonly engineVersion?: string;

  /**
   * Defines the details of a high availability configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-highavailabilityconfig
   */
  readonly highAvailabilityConfig?: CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable;

  /**
   * The instance type of the runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-instancetype
   */
  readonly instanceType: string;

  /**
   * The identifier of a customer managed key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-name
   */
  readonly name: string;

  /**
   * Configures the maintenance window that you want for the runtime environment.
   *
   * The maintenance window must have the format `ddd:hh24:mi-ddd:hh24:mi` and must be less than 24 hours. The following two examples are valid maintenance windows: `sun:23:45-mon:00:15` or `sat:01:00-sat:03:00` .
   *
   * If you do not provide a value, a random system-generated value will be assigned.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * Specifies whether the runtime environment is publicly accessible.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The list of security groups for the VPC associated with this runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * Defines the storage configuration for a runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-storageconfigurations
   */
  readonly storageConfigurations?: Array<cdk.IResolvable | CfnEnvironment.StorageConfigurationProperty> | cdk.IResolvable;

  /**
   * The list of subnets associated with the VPC for this runtime environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `HighAvailabilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HighAvailabilityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentHighAvailabilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredCapacity", cdk.requiredValidator)(properties.desiredCapacity));
  errors.collect(cdk.propertyValidator("desiredCapacity", cdk.validateNumber)(properties.desiredCapacity));
  return errors.wrap("supplied properties not correct for \"HighAvailabilityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentHighAvailabilityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentHighAvailabilityConfigPropertyValidator(properties).assertSuccess();
  return {
    "DesiredCapacity": cdk.numberToCloudFormation(properties.desiredCapacity)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentHighAvailabilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.HighAvailabilityConfigProperty>();
  ret.addPropertyResult("desiredCapacity", "DesiredCapacity", (properties.DesiredCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EfsStorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EfsStorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentEfsStorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.requiredValidator)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.requiredValidator)(properties.mountPoint));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.validateString)(properties.mountPoint));
  return errors.wrap("supplied properties not correct for \"EfsStorageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentEfsStorageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentEfsStorageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "MountPoint": cdk.stringToCloudFormation(properties.mountPoint)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentEfsStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.EfsStorageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.EfsStorageConfigurationProperty>();
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("mountPoint", "MountPoint", (properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FsxStorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FsxStorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentFsxStorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.requiredValidator)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.requiredValidator)(properties.mountPoint));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.validateString)(properties.mountPoint));
  return errors.wrap("supplied properties not correct for \"FsxStorageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentFsxStorageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentFsxStorageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "MountPoint": cdk.stringToCloudFormation(properties.mountPoint)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentFsxStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.FsxStorageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.FsxStorageConfigurationProperty>();
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("mountPoint", "MountPoint", (properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentStorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("efs", CfnEnvironmentEfsStorageConfigurationPropertyValidator)(properties.efs));
  errors.collect(cdk.propertyValidator("fsx", CfnEnvironmentFsxStorageConfigurationPropertyValidator)(properties.fsx));
  return errors.wrap("supplied properties not correct for \"StorageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentStorageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentStorageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Efs": convertCfnEnvironmentEfsStorageConfigurationPropertyToCloudFormation(properties.efs),
    "Fsx": convertCfnEnvironmentFsxStorageConfigurationPropertyToCloudFormation(properties.fsx)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.StorageConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.StorageConfigurationProperty>();
  ret.addPropertyResult("efs", "Efs", (properties.Efs != null ? CfnEnvironmentEfsStorageConfigurationPropertyFromCloudFormation(properties.Efs) : undefined));
  ret.addPropertyResult("fsx", "Fsx", (properties.Fsx != null ? CfnEnvironmentFsxStorageConfigurationPropertyFromCloudFormation(properties.Fsx) : undefined));
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
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engineType", cdk.requiredValidator)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineType", cdk.validateString)(properties.engineType));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("highAvailabilityConfig", CfnEnvironmentHighAvailabilityConfigPropertyValidator)(properties.highAvailabilityConfig));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("storageConfigurations", cdk.listValidator(CfnEnvironmentStorageConfigurationPropertyValidator))(properties.storageConfigurations));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EngineType": cdk.stringToCloudFormation(properties.engineType),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "HighAvailabilityConfig": convertCfnEnvironmentHighAvailabilityConfigPropertyToCloudFormation(properties.highAvailabilityConfig),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "StorageConfigurations": cdk.listMapper(convertCfnEnvironmentStorageConfigurationPropertyToCloudFormation)(properties.storageConfigurations),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engineType", "EngineType", (properties.EngineType != null ? cfn_parse.FromCloudFormation.getString(properties.EngineType) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("highAvailabilityConfig", "HighAvailabilityConfig", (properties.HighAvailabilityConfig != null ? CfnEnvironmentHighAvailabilityConfigPropertyFromCloudFormation(properties.HighAvailabilityConfig) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("storageConfigurations", "StorageConfigurations", (properties.StorageConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentStorageConfigurationPropertyFromCloudFormation)(properties.StorageConfigurations) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}